import React, { useEffect, useRef } from "react";
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
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { saveCardResult, deleteCardResult } from "../utils/cardArchiveUtils";
import i18n from "../utils/i18n";
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
  const { question, result, cardType } = route.params;

  // 애니메이션 값들
  const resultScale = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;

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
      description: i18n.t(`oracleResults.${cardId}.description`),
    };
  };

  // 동적 타이틀 생성
  const getHeaderTitle = () => {
    return cardType === "daily" ? "데일리 카드" : "Yes or No 오라클 타로";
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

  const handleShare = async () => {
    try {
      const cardResult = getCardResult(result.id);
      const shareMessage = `질문: ${question}\n답: ${cardResult.percentage} ${cardResult.text}\n\n${cardResult.description}\n\n원카드 앱으로 운명의 답을 찾아보세요! (https://apps.apple.com/app/onecard)`;

      // 먼저 카카오톡이 설치되어 있는지 확인
      const canOpenKakao = await Linking.canOpenURL("kakaotalk://");

      if (canOpenKakao) {
        // 카카오톡으로 직접 공유 (이미지 포함)
        // 카드 이미지 URL을 포함한 공유 URL 생성
        const imageUrl = encodeURIComponent(
          "https://your-app-domain.com/card-image.jpg"
        ); // 실제 이미지 URL로 교체 필요
        const kakaoUrl = `kakaotalk://send?text=${encodeURIComponent(
          shareMessage
        )}&image=${imageUrl}`;
        await Linking.openURL(kakaoUrl);
      } else {
        // 카카오톡이 없으면 기본 공유 시트 사용
        await Share.share({
          message: shareMessage,
          title: "원카드 결과",
        });
      }
    } catch (error) {
      console.log("공유 실패:", error);

      // 모든 방법이 실패한 경우 기본 공유 시트로 폴백
      try {
        const cardResult = getCardResult(result.id);
        const shareMessage = `질문: ${question}\n답: ${cardResult.percentage} ${cardResult.text}\n\n${cardResult.description}\n\n원카드 앱으로 운명의 답을 찾아보세요! (https://apps.apple.com/app/onecard)`;

        await Share.share({
          message: shareMessage,
          title: "원카드 결과",
        });
      } catch (fallbackError) {
        console.log("기본 공유도 실패:", fallbackError);
        Alert.alert("공유 실패", "공유 기능을 사용할 수 없습니다.");
      }
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
    try {
      const archiveData = {
        cardType: "yesno",
        question: question,
        result: result,
        cardResult: cardResult,
      };

      const success = await saveCardResult(archiveData);
      if (success) {
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
      console.error("보관 실패:", error);
      Alert.alert(
        i18n.t("result.archiveFail"),
        i18n.t("result.archiveSaveFail")
      );
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
            console.error("삭제 실패:", error);
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
                style={commonStyles.archiveButton}
                onPress={handleArchive}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.archiveButtonText}>
                  {i18n.t("result.archive")}
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
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 34,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  resultCard: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resultCardImage: {
    width: "100%",
    height: "100%",
  },
  percentageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  explanationContainer: {
    marginBottom: 60,
    paddingHorizontal: 24,
  },
  explanationText: {
    fontSize: 18,
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
});

export default ResultScreen;
