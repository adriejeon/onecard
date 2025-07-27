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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import i18n from "../utils/i18n";
import cardResults from "../assets/data/cardResults";

const { width, height } = Dimensions.get("window");

const DiaryInputScreen = ({ navigation, route }) => {
  const { selectedDate: selectedDateParam } = route.params || {
    selectedDate: new Date().toISOString().split("T")[0],
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
  const snackbarOpacity = useState(new Animated.Value(0))[0];
  const scrollViewRef = useRef(null);

  const emotions = useMemo(
    () => [
      {
        id: "great",
        image: require("../../assets/great.png"),
        label: i18n.t("diary.emotions.great"),
      },
      {
        id: "good",
        image: require("../../assets/good.png"),
        label: i18n.t("diary.emotions.good"),
      },
      {
        id: "okay",
        image: require("../../assets/okay.png"),
        label: i18n.t("diary.emotions.okay"),
      },
      {
        id: "not-great",
        image: require("../../assets/not-great.png"),
        label: i18n.t("diary.emotions.not-great"),
      },
      {
        id: "bad",
        image: require("../../assets/bad.png"),
        label: i18n.t("diary.emotions.bad"),
      },
      {
        id: "angry",
        image: require("../../assets/angry.png"),
        label: i18n.t("diary.emotions.angry"),
      },
    ],
    [i18n.locale]
  );

  // 카드 정보 가져오기 함수 - 메모이제이션
  const getCardInfo = useCallback(
    (cardId) => {
      const cardResult = cardResults[cardId];

      if (cardResult) {
        const result = {
          score: cardResult.score || "0",
          title: i18n.t(`cards.${cardId}.title`) || cardResult.title || cardId,
          keywords:
            i18n.t(`cards.${cardId}.keywords`) || cardResult.keywords || "",
        };
        return result;
      }

      const fallback = {
        score: "0",
        title: cardId,
        keywords: "",
      };
      return fallback;
    },
    [i18n.locale]
  );

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

  const loadExistingDiary = useCallback(async () => {
    try {
      const dateKey = `diary_${selectedDate.toISOString().split("T")[0]}`;
      const existingDiary = await AsyncStorage.getItem(dateKey);
      if (existingDiary) {
        const diary = JSON.parse(existingDiary);
        setDiaryText(diary.content || "");
        setSelectedEmotion(diary.emotion || null);
        setHasExistingDiary(true);
      }
    } catch (error) {
      console.error("기존 일기 로드 실패:", error);
    }
  }, [selectedDate]);

  const checkDailyCardStatus = useCallback(async () => {
    try {
      const dateKey = `dailyCard_${selectedDate.toISOString().split("T")[0]}`;

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
      const dateKey = `diary_${selectedDate.toISOString().split("T")[0]}`;
      await AsyncStorage.removeItem(dateKey);

      // 상태 초기화
      setDiaryText("");
      setSelectedEmotion(null);
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
    if (!diaryText.trim() && !selectedEmotion) {
      return; // 내용이 없으면 저장하지 않음
    }

    try {
      const diaryData = {
        date: selectedDate.toISOString().split("T")[0],
        content: diaryText.trim(),
        emotion: selectedEmotion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const dateKey = `diary_${diaryData.date}`;
      await AsyncStorage.setItem(dateKey, JSON.stringify(diaryData));

      // 스낵바 표시
      showAutoSaveSnackbar();
    } catch (error) {
      console.error("자동 저장 실패:", error);
    }
  }, [diaryText, selectedEmotion, selectedDate]);

  const showAutoSaveSnackbar = useCallback(() => {
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
  }, [snackbarOpacity]);

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
          const diaryData = {
            date: selectedDate.toISOString().split("T")[0],
            content: diaryText.trim(),
            emotion: newEmotion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const dateKey = `diary_${diaryData.date}`;
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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    if (i18n.locale === "ko") {
      const koreanDays = ["일", "월", "화", "수", "목", "금", "토"];
      return `${year}년 ${month}월 ${day}일 ${koreanDays[dayOfWeek]}요일`;
    } else {
      const englishDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const formattedMonth = month.toString().padStart(2, "0");
      const formattedDay = day.toString().padStart(2, "0");
      return `${year}.${formattedMonth}.${formattedDay} ${englishDays[dayOfWeek]}`;
    }
  };

  const renderEmotionSelector = () => {
    return (
      <View style={styles.emotionContainer}>
        <Text style={styles.emotionTitle}>
          {i18n.t("diary.emotionQuestion")}
        </Text>
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
                {emotion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
              {/* 데일리 운세 버튼 - 과거 날짜가 아닌 경우에만 표시 */}
              {!isPastDate && (
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
              )}

              {/* 미래 날짜가 아닌 경우에만 감정 선택과 일기 입력 표시 */}
              {!isFutureDate && (
                <>
                  {/* 감정 선택 */}
                  {renderEmotionSelector()}

                  {/* 일기 내용 입력 */}
                  <View style={styles.diaryContainer}>
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
                    <Text style={styles.characterCount}>
                      {diaryText.length}/2000
                    </Text>
                  </View>
                </>
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
                  <Text style={styles.futureDateSubText}>
                    {i18n.t("diary.pastDateMessage")}
                  </Text>
                  <Text style={styles.futureDateSubText}>
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
            <Text style={styles.snackbarText}>
              {i18n.t("diary.autoSaveMessage")}
            </Text>
          </Animated.View>
        )}
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
  },
  emotionLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  emotionLabelSelected: {
    color: "#3100BB",
    fontWeight: "bold",
  },
  diaryContainer: {
    minHeight: 200,
    marginBottom: 30,
  },
  diaryInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    fontSize: 16,
    color: "#474747",
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: "top",
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
    fontSize: 14,
    color: "#AFAFAF",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default DiaryInputScreen;
