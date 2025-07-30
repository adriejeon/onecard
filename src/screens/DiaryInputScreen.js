import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import i18n from "../utils/i18n";

import cardResults from "../assets/data/cardResults";

const { width, height } = Dimensions.get("window");

const DiaryInputScreen = ({ navigation, route }) => {
  const { selectedDate: selectedDateParam } = route.params || {
    selectedDate: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    })(),
  };
  const selectedDate = new Date(selectedDateParam);

  // 오늘 날짜와 비교하여 미래/과거 날짜인지 확인
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
  const selectedDateOnly = new Date(selectedDate);
  selectedDateOnly.setHours(0, 0, 0, 0); // 선택된 날짜도 시간을 00:00:00으로 설정
  const isFutureDate = selectedDateOnly > today;
  const isPastDate = selectedDateOnly < today;
  const [diaryText, setDiaryText] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [hasDailyCard, setHasDailyCard] = useState(false);
  const [dailyCardScore, setDailyCardScore] = useState(null);
  const [dailyCardData, setDailyCardData] = useState(null);
  const [hasExistingDiary, setHasExistingDiary] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const snackbarOpacity = useState(new Animated.Value(0))[0];
  const scrollViewRef = useRef(null);

  // 사진 관련 상태
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const emotions = useMemo(
    () => [
      {
        id: "great",
        image: require("../../assets/great.png"),
        label: "diary.emotions.great",
      },
      {
        id: "good",
        image: require("../../assets/good.png"),
        label: "diary.emotions.good",
      },
      {
        id: "okay",
        image: require("../../assets/okay.png"),
        label: "diary.emotions.okay",
      },
      {
        id: "not-great",
        image: require("../../assets/not-great.png"),
        label: "diary.emotions.not-great",
      },
      {
        id: "bad",
        image: require("../../assets/bad.png"),
        label: "diary.emotions.bad",
      },
      {
        id: "angry",
        image: require("../../assets/angry.png"),
        label: "diary.emotions.angry",
      },
    ],
    []
  );

  // 카드 정보 가져오기 함수 - 메모이제이션
  const getCardInfo = useCallback((cardId) => {
    const cardResult = cardResults[cardId];

    if (cardResult) {
      const result = {
        score: cardResult.score || "0",
        title: cardResult.title || cardId,
        keywords: cardResult.keywords || "",
      };
      return result;
    }

    const fallback = {
      score: "0",
      title: cardId,
      keywords: "",
    };
    return fallback;
  }, []);

  useEffect(() => {
    // 기존 일기가 있는지 확인하고 로드
    loadExistingDiary();
    // 데일리 카드 상태 확인
    checkDailyCardStatus();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [loadExistingDiary, checkDailyCardStatus]);

  // 사진 변경 시 자동 저장
  useEffect(() => {
    if (selectedImages.length > 0) {
      const timeoutId = setTimeout(() => {
        autoSave();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedImages, autoSave]);

  const loadExistingDiary = useCallback(async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      const dateKey = `diary_${dateString}`;
      const existingDiary = await AsyncStorage.getItem(dateKey);
      if (existingDiary) {
        const diary = JSON.parse(existingDiary);
        setDiaryText(diary.content || "");
        setSelectedEmotion(diary.emotion || null);
        setSelectedImages(diary.images || []);
        setHasExistingDiary(true);
      } else {
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("기존 일기 로드 실패:", error);
    }
  }, [selectedDate]);

  const checkDailyCardStatus = useCallback(async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      const dateKey = `dailyCard_${dateString}`;

      const dailyCard = await AsyncStorage.getItem(dateKey);

      if (dailyCard) {
        const cardData = JSON.parse(dailyCard);

        setHasDailyCard(true);
        setDailyCardScore(cardData.score || null);
        setDailyCardData(cardData); // 전체 데이터 저장
      } else {
        setHasDailyCard(false);
        setDailyCardScore(null);
        setDailyCardData(null);
      }
    } catch (error) {
      setHasDailyCard(false);
      setDailyCardScore(null);
      setDailyCardData(null);
    }
  }, [selectedDate]);

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const handleInfoPress = () => {
    navigation.navigate("More");
  };

  const handleDeletePress = () => {
    Alert.alert(
      "일기 삭제",
      "이 일기를 삭제하시겠어요? 삭제하시면 복구할 수 없어요.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: handleDeleteDiary,
        },
      ]
    );
  };

  const handleDeleteDiary = async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      const dateKey = `diary_${dateString}`;
      await AsyncStorage.removeItem(dateKey);

      // 상태 초기화
      setDiaryText("");
      setSelectedEmotion(null);
      setSelectedImages([]);
      setHasExistingDiary(false);

      Alert.alert("일기 삭제 완료", "일기가 삭제되었습니다.", [
        {
          text: "확인",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("일기 삭제 실패:", error);
      Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
    }
  };

  const autoSave = useCallback(async () => {
    // 실제로 변경된 내용이 있는지 확인
    const hasContent = diaryText.trim().length > 0;
    const hasEmotion = selectedEmotion !== null;
    const hasImages = selectedImages.length > 0;

    // 기존 데이터와 비교하여 변경사항이 있는지 확인
    const currentSelectedDate = selectedDate;
    const year = currentSelectedDate.getFullYear();
    const month = String(currentSelectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentSelectedDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    const dateKey = `diary_${dateString}`;

    try {
      const existingData = await AsyncStorage.getItem(dateKey);
      let hasChanges = false;

      if (existingData) {
        const existing = JSON.parse(existingData);
        hasChanges =
          existing.content !== diaryText.trim() ||
          existing.emotion !== selectedEmotion ||
          JSON.stringify(existing.images) !== JSON.stringify(selectedImages);
      } else {
        // 새로 생성되는 경우
        hasChanges = hasContent || hasEmotion || hasImages;
      }

      if (!hasChanges) {
        return; // 변경사항이 없으면 저장하지 않음
      }

      const diaryData = {
        date: dateString,
        content: diaryText.trim(),
        emotion: selectedEmotion,
        images: selectedImages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(dateKey, JSON.stringify(diaryData));

      // 스낵바 표시
      showAutoSaveSnackbar();
    } catch (error) {
      console.error("자동 저장 실패:", error);
    }
  }, [diaryText, selectedEmotion, selectedImages]);

  const showAutoSaveSnackbar = useCallback((message) => {
    setSnackbarMessage(message || i18n.t("diary.autoSaveMessage"));
    setShowSnackbar(true);

    // 스낵바 페이드 인
    Animated.timing(snackbarOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 4초 후 스낵바 페이드 아웃
    setTimeout(() => {
      Animated.timing(snackbarOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSnackbar(false);
      });
    }, 4000);
  }, []);

  const handleTextChange = (text) => {
    setDiaryText(text);

    // 기존 타이머가 있으면 취소
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // 1초 후 자동 저장
    const timeout = setTimeout(autoSave, 1000);
    setAutoSaveTimeout(timeout);
  };

  const handleEmotionSelect = (emotionId) => {
    const newEmotion = selectedEmotion === emotionId ? null : emotionId;
    setSelectedEmotion(newEmotion);

    // 기존 타이머가 있으면 취소
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // 즉시 자동 저장 (감정 선택은 즉시 반영)
    setTimeout(() => {
      // 새로운 감정 값으로 자동 저장
      const autoSaveWithNewEmotion = async () => {
        if (!diaryText.trim() && !newEmotion) {
          return; // 내용이 없으면 저장하지 않음
        }

        try {
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
          const day = String(selectedDate.getDate()).padStart(2, "0");
          const dateString = `${year}-${month}-${day}`;

          const diaryData = {
            date: dateString,
            content: diaryText.trim(),
            emotion: newEmotion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const dateKey = `diary_${dateString}`;
          await AsyncStorage.setItem(dateKey, JSON.stringify(diaryData));

          // 스낵바 표시
          showAutoSaveSnackbar();
        } catch (error) {
          console.error("감정 선택 자동 저장 실패:", error);
        }
      };

      autoSaveWithNewEmotion();
    }, 100);
  };

  const handleDailyCardPress = () => {
    if (hasDailyCard && dailyCardData) {
      // 이미 뽑은 경우 결과 페이지로 이동 - 실제 데이터 사용
      navigation.navigate("DailyResult", {
        result: dailyCardData.result || "데일리 카드 결과",
        cardType: "daily",
        score: dailyCardData.score,
        cardData: dailyCardData,
      });
    } else {
      // 아직 뽑지 않은 경우 데일리 카드 선택 페이지로 이동 - 선택된 날짜 전달
      navigation.navigate("DailyCardSelection", { selectedDate });
    }
  };

  // 사진 선택 함수
  const pickImage = async () => {
    try {
      // 권한 요청
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
        return;
      }

      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // 여러 장 선택 시 편집 비활성화
        allowsMultipleSelection: true, // 여러 장 선택 가능
        selectionLimit: 3, // 최대 3장까지 선택 가능
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImages = result.assets;

        // 현재 선택된 이미지와 새로 선택한 이미지의 총 개수 확인
        const totalImages = selectedImages.length + newImages.length;

        if (totalImages > 3) {
          Alert.alert("사진 제한", i18n.t("diary.photoLimitMessage"));
          return;
        }

        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error("사진 선택 실패:", error);
      Alert.alert("오류", "사진을 선택하는 중 오류가 발생했습니다.");
    }
  };

  // 사진 삭제 함수
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 사진 전체화면 보기 함수
  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  // 사진 모달 닫기 함수
  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeekKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayOfWeek = i18n.t(`home.dayOfWeek.${dayOfWeekKeys[date.getDay()]}`);

    return i18n.t("home.diaryDateFormat", {
      month: i18n.t(`home.monthNames.${month}`),
      day: day,
      dayOfWeek: dayOfWeek,
    });
  };

  const renderEmotionSelector = () => {
    const emotionQuestion = isPastDate
      ? i18n.t("diary.emotionQuestionPast")
      : i18n.t("diary.emotionQuestion");

    return (
      <View style={styles.emotionContainer}>
        <Text style={styles.emotionTitle}>{emotionQuestion}</Text>
        <View style={styles.emotionGrid}>
          {emotions.map((emotion, index) => (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.emotionButton,
                selectedEmotion === emotion.id && styles.emotionButtonSelected,
              ]}
              onPress={() => handleEmotionSelect(emotion.id)}
            >
              <Image
                source={emotion.image}
                style={styles.emotionIcon}
                contentFit="contain"
              />
              <Text
                style={[
                  styles.emotionLabel,
                  selectedEmotion === emotion.id && styles.emotionLabelSelected,
                ]}
              >
                {i18n.t(emotion.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderImageModal = () => {
    if (!showImageModal || selectedImages.length === 0) return null;

    return (
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.imageModalOverlay}>
          <View style={styles.imageModalContainer}>
            <TouchableOpacity
              style={styles.imageModalCloseButton}
              onPress={closeImageModal}
            >
              <Image
                source={require("../../assets/close-icon.png")}
                style={styles.imageModalCloseIcon}
                contentFit="contain"
              />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImages[selectedImageIndex].uri }}
              style={styles.imageModalImage}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/subBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 상단 헤더 */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.headerLeftButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={styles.backIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        <Text style={styles.customHeaderTitle}>{formatDate(selectedDate)}</Text>

        {hasExistingDiary ? (
          <TouchableOpacity
            style={styles.headerRightButton}
            onPress={handleDeletePress}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/delete-icon.png")}
              style={styles.backIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerRightButton} />
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              automaticallyAdjustKeyboardInsets={false}
            >
              {/* 과거 날짜: 감정 선택 + 일기 입력 */}
              {isPastDate && (
                <>
                  {/* 감정 선택 */}
                  {renderEmotionSelector()}

                  {/* 일기 내용 입력 */}
                  <View style={styles.diaryContainer}>
                    <View style={styles.inputWrapper}>
                      {/* 선택된 이미지들 표시 */}
                      {selectedImages.length > 0 && (
                        <View style={styles.photoGrid}>
                          {selectedImages.map((image, index) => (
                            <View key={index} style={styles.photoItem}>
                              <TouchableOpacity
                                onPress={() => openImageModal(index)}
                                activeOpacity={0.8}
                              >
                                <Image
                                  source={{ uri: image.uri }}
                                  style={styles.photoImage}
                                  contentFit="cover"
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.photoDeleteButton}
                                onPress={() => removeImage(index)}
                              >
                                <Image
                                  source={require("../../assets/close-icon.png")}
                                  style={styles.photoDeleteIcon}
                                  contentFit="contain"
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}

                      <TextInput
                        style={styles.diaryInput}
                        value={diaryText}
                        onChangeText={handleTextChange}
                        placeholder={i18n.t("diary.placeholder")}
                        placeholderTextColor="#999999"
                        multiline
                        textAlignVertical="top"
                        maxLength={2000}
                        scrollEnabled={true}
                        keyboardType="default"
                        returnKeyType="default"
                        blurOnSubmit={false}
                        onFocus={() =>
                          scrollViewRef.current?.scrollToEnd({
                            animated: true,
                          })
                        }
                      />

                      {/* 사진 추가 버튼 */}
                      {selectedImages.length < 3 && (
                        <TouchableOpacity
                          style={styles.addPhotoButton}
                          onPress={pickImage}
                          activeOpacity={0.8}
                        >
                          <Image
                            source={require("../../assets/photo-icon.png")}
                            style={styles.photoIcon}
                            contentFit="contain"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </>
              )}

              {/* 오늘 날짜: 데일리 카드 + 투두리스트 + 감정 선택 + 일기 입력 */}
              {!isPastDate && !isFutureDate && (
                <>
                  {/* 데일리 카드 섹션 */}
                  <View style={styles.dailyCardContainer}>
                    {/* 운세 점수 표시 */}
                    {hasDailyCard && dailyCardData && dailyCardData.result && (
                      <View style={styles.scoreContainer}>
                        {(() => {
                          const cardInfo = getCardInfo(dailyCardData.result.id);
                          return (
                            <>
                              <Text style={styles.scoreText}>
                                {i18n.t("diary.dailyCardScore", {
                                  score: cardInfo.score,
                                })}
                              </Text>
                              <Text style={styles.scoreText}>
                                {i18n.t("diary.cardName")}: {cardInfo.title}
                              </Text>
                              <Text style={styles.scoreText}>
                                {i18n.t("diary.keywords")}: {cardInfo.keywords}
                              </Text>
                            </>
                          );
                        })()}
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.dailyCardButton}
                      onPress={handleDailyCardPress}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("../../assets/daily-icon.png")}
                        style={styles.dailyCardIcon}
                        contentFit="contain"
                      />
                      <Text style={styles.dailyCardText}>
                        {hasDailyCard
                          ? i18n.t("diary.dailyCardResult")
                          : i18n.t("diary.dailyCardQuestion")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 감정 선택 */}
                  {renderEmotionSelector()}

                  {/* 일기 내용 입력 */}
                  <View style={styles.diaryContainer}>
                    <View style={styles.inputWrapper}>
                      {/* 선택된 이미지들 표시 */}
                      {selectedImages.length > 0 && (
                        <View style={styles.photoGrid}>
                          {selectedImages.map((image, index) => (
                            <View key={index} style={styles.photoItem}>
                              <TouchableOpacity
                                onPress={() => openImageModal(index)}
                                activeOpacity={0.8}
                              >
                                <Image
                                  source={{ uri: image.uri }}
                                  style={styles.photoImage}
                                  contentFit="cover"
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.photoDeleteButton}
                                onPress={() => removeImage(index)}
                              >
                                <Image
                                  source={require("../../assets/close-icon.png")}
                                  style={styles.photoDeleteIcon}
                                  contentFit="contain"
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}

                      <TextInput
                        style={styles.diaryInput}
                        value={diaryText}
                        onChangeText={handleTextChange}
                        placeholder={i18n.t("diary.placeholder")}
                        placeholderTextColor="#999999"
                        multiline
                        textAlignVertical="top"
                        maxLength={2000}
                        scrollEnabled={true}
                        keyboardType="default"
                        returnKeyType="default"
                        blurOnSubmit={false}
                        onFocus={() =>
                          scrollViewRef.current?.scrollToEnd({
                            animated: true,
                          })
                        }
                      />

                      {/* 사진 추가 버튼 */}
                      {selectedImages.length < 3 && (
                        <TouchableOpacity
                          style={styles.addPhotoButton}
                          onPress={pickImage}
                          activeOpacity={0.8}
                        >
                          <Image
                            source={require("../../assets/photo-icon.png")}
                            style={styles.photoIcon}
                            contentFit="contain"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </>
              )}

              {/* 미래 날짜: 데일리 카드만 */}
              {isFutureDate && (
                <View style={styles.dailyCardContainer}>
                  <TouchableOpacity
                    style={styles.dailyCardButton}
                    onPress={handleDailyCardPress}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require("../../assets/daily-icon.png")}
                      style={styles.dailyCardIcon}
                      contentFit="contain"
                    />
                    <Text style={styles.dailyCardText}>
                      {hasDailyCard
                        ? i18n.t("diary.dailyCardResult")
                        : i18n.t("diary.dailyCardQuestion")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* 미래 날짜인 경우 안내 메시지 표시 */}
              {isFutureDate && (
                <View style={styles.futureDateMessage}>
                  <Text style={styles.futureDateSubText}>
                    {i18n.t("diary.futureDateMessage")}
                  </Text>
                  <Text style={styles.futureDateSubText}>
                    {i18n.t("diary.futureDateSubMessage")}
                  </Text>
                </View>
              )}

              {/* 과거 날짜인 경우 안내 메시지 표시 */}
              {isPastDate && (
                <View style={styles.futureDateMessage}>
                  <Text
                    style={[
                      styles.futureDateSubText,
                      Platform.OS === "android" && styles.androidText,
                    ]}
                  >
                    {i18n.t("diary.pastDateMessage")}
                  </Text>
                  <Text
                    style={[
                      styles.futureDateSubText,
                      Platform.OS === "android" && styles.androidText,
                    ]}
                  >
                    {i18n.t("diary.pastDateSubMessage")}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        {/* 자동저장 스낵바 */}
        {showSnackbar && (
          <Animated.View
            style={[
              styles.snackbar,
              {
                opacity: snackbarOpacity,
              },
            ]}
          >
            <Text style={styles.snackbarText}>{snackbarMessage}</Text>
          </Animated.View>
        )}

        {/* 이미지 전체화면 모달 */}
        {renderImageModal()}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#474747",
    textAlign: "center",
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  dailyCardContainer: {
    marginBottom: 25,
  },
  dailyCardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
  },
  dailyCardIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  dailyCardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#474747",
  },
  adviceText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },

  scoreContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
    fontWeight: "500",
    fontStyle: "italic",
  },
  emotionContainer: {
    marginBottom: 10,
  },
  emotionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#474747",
    marginBottom: 15,
  },
  emotionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emotionButton: {
    width: (width - 60) / 3,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  emotionButtonSelected: {
    borderColor: "#3100BB",
    backgroundColor: "rgba(49, 0, 187, 0.1)",
  },
  emotionIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    alignSelf: "center",
  },
  emotionLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
    textAlign: "center",
    textAlignVertical: "center",
  },
  emotionLabelSelected: {
    color: "#3100BB",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
    paddingBottom: 5,
  },
  photoItem: {
    position: "relative",
    width: 80,
    height: 80,
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  photoDeleteButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff6b6b",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  photoDeleteIcon: {
    width: 12,
    height: 12,
  },
  addPhotoButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  photoIcon: {
    width: 20,
    height: 20,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 20,
  },
  imageModalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  imageModalCloseIcon: {
    width: 20,
    height: 20,
  },
  imageModalImage: {
    width: width,
    height: height * 0.8,
    resizeMode: "contain",
  },
  diaryContainer: {
    minHeight: 200,
    marginBottom: 30,
    position: "relative",
  },
  inputWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    position: "relative",
    minHeight: 300,
  },
  diaryInput: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 0,
    fontSize: 16,
    color: "#474747",
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: "top",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  characterCount: {
    fontSize: 12,
    color: "#474747",
    textAlign: "right",
    marginTop: 5,
    opacity: 0.8,
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  snackbar: {
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
    backgroundColor: "#333333",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  snackbarText: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "transparent",
  },
  headerLeftButton: {
    padding: 5,
    width: 34,
    alignItems: "center",
  },
  headerRightButton: {
    padding: 5,
    width: 34,
    alignItems: "center",
  },
  customHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#474747",
    textAlign: "center",
    flex: 1,
  },
  futureDateMessage: {
    padding: 20,
    marginTop: 20,
    alignItems: "center",
  },
  futureDateSubText: {
    fontSize: 12,
    color: "#AFAFAF",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "normal",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  androidText: {
    color: "#AFAFAF",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
    backgroundColor: "transparent",
    fontFamily: Platform.OS === "android" ? "sans-serif" : undefined,
    fontWeight: "400",
  },
});

export default DiaryInputScreen;
