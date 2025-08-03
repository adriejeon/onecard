import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Share,
  ImageBackground,
  StatusBar,
  Alert,
  Linking,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { saveCardResult, deleteCardResult } from "../utils/cardArchiveUtils";
import i18n from "../utils/i18n";
import { useLanguage } from "../contexts/LanguageContext";
import cardResults from "../assets/data/cardResults";

const { width, height } = Dimensions.get("window");

// 카드 id를 cardResults의 실제 키로 변환하는 함수
const getCardKeyById = (id) => {
  for (const key in cardResults) {
    if (cardResults[key] && (cardResults[key].id === id || key === id)) {
      return key;
    }
  }
  return id;
};

const ResultScreen = ({ navigation, route }) => {
  const { currentLanguage } = useLanguage(); // 언어 변경 감지를 위한 훅 추가
  const { question, result, cardType } = route.params;

  // 애니메이션 값들
  const resultScale = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;

  // 보관 상태 관리
  const [isArchived, setIsArchived] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  // 카드 결과에 따라 배경 결정
  const getBackgroundImage = () => {
    const cardId = result.id;

    // 카드별 YES/NO 분류
    const isPositive = getCardResult(cardId).isPositive;

    if (isPositive) {
      return require("../../assets/resultBg-posi.png");
    } else {
      return require("../../assets/resultBg-nage.png");
    }
  };

  // 카드별 결과 정보
  const getCardResult = (cardId) => {
    return {
      isPositive: i18n.t(`oracleResults.${cardId}.text`) === "YES",
      percentage: i18n.t(`oracleResults.${cardId}.percentage`),
      text: i18n.t(`oracleResults.${cardId}.text`),
      name: i18n.t(`oracleResults.${cardId}.name`),
      description: i18n.t(`oracleResults.${cardId}.description`),
    };
  };

  // 동적 타이틀 생성
  const getHeaderTitle = () => {
    return cardType === "daily"
      ? i18n.t("cardDraw.dailyTitle")
      : i18n.t("cardDraw.yesnoTitle");
  };

  useEffect(() => {
    // 결과 애니메이션
    Animated.sequence([
      Animated.timing(resultScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(resultOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // 안드로이드 하단 앱바 뒤로가기 버튼 제어
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 결과 화면에서 뒤로가기 시 홈으로 이동
        if (route.params.fromArchive) {
          // 보관함에서 온 경우 보관함으로 돌아가기
          navigation.goBack();
        } else {
          // 새로운 카드 결과인 경우 홈으로 이동
          navigation.navigate("Home");
        }
        return true; // 기본 뒤로가기 동작 방지
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [navigation, route.params.fromArchive])
  );

  const handleShare = async () => {
    try {
      const cardResult = getCardResult(result.id);
      const shareMessage = `${i18n.t("result.shareMessage.question", {
        question,
      })}\n${i18n.t("result.shareMessage.answer", {
        percentage: cardResult.percentage,
        text: cardResult.text,
      })}\n\n${i18n.t("result.shareMessage.description", {
        description: cardResult.description,
      })}\n\n${i18n.t("result.shareMessage.invite")}`;

      await Share.share({
        message: shareMessage,
        title: i18n.t("result.shareTitle"),
      });
    } catch (error) {
      Alert.alert(
        i18n.t("result.shareFailTitle"),
        i18n.t("result.shareFailMessage")
      );
    }
  };

  const handleRetry = () => {
    navigation.navigate("Home");
  };

  const handleBack = () => {
    if (route.params.fromArchive) {
      // 보관함에서 온 경우 보관함으로 돌아가기
      navigation.goBack();
    } else {
      // 새로운 카드 결과인 경우 홈으로 이동
      navigation.navigate("Home");
    }
  };

  const handleHome = () => {
    navigation.navigate("Home");
  };

  const handleArchive = async () => {
    // 이미 보관 중이거나 보관된 경우 중복 실행 방지
    if (isArchiving || isArchived) {
      return;
    }

    setIsArchiving(true);

    try {
      const archiveData = {
        cardType: "yesno",
        question: question,
        result: result,
        cardResult: cardResult,
      };

      const success = await saveCardResult(archiveData);
      if (success) {
        setIsArchived(true);
        Alert.alert(
          i18n.t("result.archiveComplete"),
          i18n.t("result.archiveSaved")
        );
      } else {
        Alert.alert(
          i18n.t("result.archiveFail"),
          i18n.t("result.archiveSaveFail")
        );
      }
    } catch (error) {
      Alert.alert(
        i18n.t("result.archiveFail"),
        i18n.t("result.archiveSaveFail")
      );
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(i18n.t("result.deleteTitle"), i18n.t("result.deleteMessage"), [
      {
        text: i18n.t("result.cancel"),
        style: "cancel",
      },
      {
        text: i18n.t("result.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            // 보관함에서 온 경우에만 삭제 가능
            if (route.params.fromArchive && route.params.archiveId) {
              const success = await deleteCardResult(route.params.archiveId);
              if (success) {
                Alert.alert(
                  i18n.t("result.deleteComplete"),
                  i18n.t("result.archiveDeleted"),
                  [
                    {
                      text: i18n.t("result.confirm"),
                      onPress: () => {
                        // 보관함으로 돌아가기
                        navigation.navigate("CardArchive");
                      },
                    },
                  ]
                );
              } else {
                Alert.alert(
                  i18n.t("result.deleteFail"),
                  i18n.t("result.archiveDeleteFail")
                );
              }
            }
          } catch (error) {
            Alert.alert(
              i18n.t("result.deleteFail"),
              i18n.t("result.archiveDeleteFail")
            );
          }
        },
      },
    ]);
  };

  const cardResult = getCardResult(result.id);

  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* 상단 헤더 */}
      <View style={[commonStyles.header, { position: "relative" }]}>
        <TouchableOpacity
          style={[commonStyles.backButton, { zIndex: 2 }]}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={commonStyles.backIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        <Text
          style={[
            commonStyles.headerTitle,
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 60,
              zIndex: 1,
            },
          ]}
        >
          {getHeaderTitle()}
        </Text>

        {!route.params.fromArchive ? (
          <TouchableOpacity
            style={[commonStyles.infoButton, { zIndex: 2 }]}
            onPress={() => navigation.navigate("More")}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/info-icon-dark.png")}
              style={commonStyles.infoIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={[commonStyles.infoButton, { zIndex: 2 }]} />
        )}
      </View>

      <View style={styles.content}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <View style={styles.gradientContainer}>
            <MaskedView
              style={{ width: "100%" }}
              maskElement={<Text style={styles.gradientTitle}>{question}</Text>}
            >
              <LinearGradient
                colors={["#612CC9", "#C53D93"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
              >
                <Text style={[styles.gradientTitle, { opacity: 0 }]}>
                  {question}
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </View>

        {/* 결과 카드 */}
        <View style={styles.resultContainer}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                transform: [{ scale: cardScale }],
                opacity: resultOpacity,
              },
            ]}
          >
            <Image
              source={result.frontImage}
              style={styles.resultCardImage}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        {/* 카드 이름 */}
        <Animated.View
          style={[
            styles.cardNameContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text style={styles.cardNameText}>{cardResult.name} {i18n.t("cardDraw.cardSuffix")}</Text>
        </Animated.View>

        {/* YES/NO 퍼센트 텍스트 */}
        <Animated.View
          style={[
            styles.percentageContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text
            style={[
              styles.percentageText,
              { color: cardResult.isPositive ? colors.primary : "#E91B64" },
            ]}
          >
            {cardResult.percentage} {cardResult.text}
          </Text>
        </Animated.View>

        {/* 결과 설명 */}
        <Animated.View
          style={[
            styles.explanationContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text style={styles.explanationText}>
            {i18n.t(`oracleResults.${String(result.id)}.description`)}
          </Text>
        </Animated.View>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          {!route.params.fromArchive ? (
            // 새로운 카드 결과인 경우에만 보관하기 버튼 표시
            <View style={styles.topButtonRow}>
              <TouchableOpacity
                style={[
                  commonStyles.archiveButton,
                  (isArchived || isArchiving) && styles.archiveButtonDisabled,
                ]}
                onPress={handleArchive}
                activeOpacity={0.8}
                disabled={isArchived || isArchiving}
              >
                <Text
                  style={[
                    commonStyles.archiveButtonText,
                    (isArchived || isArchiving) &&
                      styles.archiveButtonTextDisabled,
                  ]}
                >
                  {isArchiving
                    ? i18n.t("result.archiving")
                    : isArchived
                    ? i18n.t("result.archived")
                    : i18n.t("result.archive")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyles.shareButton}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.shareButtonText}>
                  {i18n.t("result.share")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 보관함에서 온 경우 공유하기 + 삭제하기 버튼 표시
            <View style={styles.topButtonRow}>
              <TouchableOpacity
                style={commonStyles.shareButton}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.shareButtonText}>
                  {i18n.t("result.share")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyles.deleteButton}
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.deleteButtonText}>
                  {i18n.t("result.delete")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>{i18n.t("result.home")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
  },
  gradientContainer: {
    alignItems: "center",
    width: "100%",
  },
  gradientTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 34,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  resultCard: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  resultCardImage: {
    width: "100%",
    height: "100%",
  },
  cardNameContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  cardNameText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  percentageContainer: {
    alignItems: "center",
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  explanationContainer: {
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  explanationText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 28,
  },
  buttonContainer: {
    gap: 15,
  },
  topButtonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  retryButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "48%",
    borderColor: colors.textPrimary,
    borderWidth: 1,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  homeButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  homeButtonText: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.8,
  },
  archiveButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#f0f0f0",
  },
  archiveButtonTextDisabled: {
    color: "#999",
  },
});

export default ResultScreen;
