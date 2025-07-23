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
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import cardResults from "../assets/data/cardResults";
import { saveCardResult, deleteCardResult } from "../utils/cardArchiveUtils";
import i18n from "../utils/i18n";

const { width } = Dimensions.get("window");

// 카드 id를 cardResults의 실제 키로 변환하는 함수
const getCardKeyById = (id) => {
  // cardResults의 모든 키를 순회하여 id(숫자/문자)와 일치하는 키를 반환
  for (const key in cardResults) {
    if (cardResults[key] && (cardResults[key].id === id || key === id)) {
      return key;
    }
  }
  // fallback: id가 이미 major_16 등일 수도 있으니 그대로 반환
  return id;
};

const DailyResultScreen = ({ navigation, route }) => {
  const { result, cardData } = route.params;

  // cardData가 있으면 그것을 사용하고, 없으면 result를 사용
  const selectedCard = cardData ? cardData.result : result;

  // 애니메이션 값들
  const resultScale = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;

  // 카드 결과에 따라 배경 결정
  const getBackgroundImage = () => {
    const cardResult = getCardResult(selectedCard.id);
    return cardResult.isPositive
      ? require("../../assets/resultBg-posi.png")
      : require("../../assets/resultBg-nage.png");
  };

  // 카드별 결과 정보
  const getCardResult = (cardId) => {
    return (
      cardResults[cardId] || {
        isPositive: true,
        score: "0",
        title: "알 수 없는 카드",
        description: "카드 결과를 확인할 수 없습니다.",
        keywords: "",
      }
    );
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
      const cardResult = getCardResult(selectedCard.id);
      const shareMessage = `${i18n.t("dailyResult.todayCard")}: ${
        cardResult.title
      }\n\n${cardResult.description}\n\n${i18n.t("dailyResult.shareApp")}`;

      // 먼저 카카오톡이 설치되어 있는지 확인
      const canOpenKakao = await Linking.canOpenURL("kakaotalk://");

      if (canOpenKakao) {
        // 카카오톡으로 링크 공유 (리치 카드 형태)
        // 앱 다운로드 링크를 포함하여 카드 형태로 표시되도록 함
        const appDownloadUrl = "https://apps.apple.com/app/onecard";
        const kakaoUrl = `kakaotalk://send?text=${encodeURIComponent(
          shareMessage
        )}&url=${encodeURIComponent(appDownloadUrl)}`;
        await Linking.openURL(kakaoUrl);
      } else {
        // 카카오톡이 없으면 기본 공유 시트 사용
        await Share.share({
          message: `${shareMessage}\n\n${appDownloadUrl}`,
          title: i18n.t("dailyResult.shareTitle"),
        });
      }
    } catch (error) {
      console.log("공유 실패:", error);

      // 모든 방법이 실패한 경우 기본 공유 시트로 폴백
      try {
        const cardResult = getCardResult(selectedCard.id);
        const shareMessage = `${i18n.t("dailyResult.todayCard")}: ${
          cardResult.title
        }\n\n${cardResult.description}\n\n${i18n.t("dailyResult.shareApp")}`;

        await Share.share({
          message: shareMessage,
          title: i18n.t("dailyResult.shareTitle"),
        });
      } catch (fallbackError) {
        Alert.alert(
          i18n.t("dailyResult.shareFailTitle"),
          i18n.t("dailyResult.shareFailMessage")
        );
      }
    }
  };

  const handleRetry = () => {
    navigation.navigate("Home");
  };

  const handleBack = () => {
    if (cardData) {
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
        cardType: "daily",
        result: selectedCard,
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
            if (cardData && cardData.id) {
              const success = await deleteCardResult(cardData.id);
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
            } else {
              Alert.alert(
                i18n.t("result.deleteFail"),
                i18n.t("result.noCardDataToDelete")
              );
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

  const cardResult = getCardResult(selectedCard.id);

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
          {i18n.t("dailyResult.title")}
        </Text>
        {!cardData ? (
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

      <ScrollView
        style={commonStyles.scrollView}
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 텍스트 */}
        <View style={commonStyles.headerContainer}>
          <View style={commonStyles.gradientContainer}>
            <MaskedView
              style={{ width: "100%" }}
              maskElement={
                <Text style={commonStyles.gradientTitle}>
                  {i18n.t("dailyResult.gradientTitle")}
                </Text>
              }
            >
              <LinearGradient
                colors={["#612CC9", "#C53D93"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
              >
                <Text style={[commonStyles.gradientTitle, { opacity: 0 }]}>
                  {i18n.t("dailyResult.gradientTitle")}
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </View>

        {/* 결과 카드 */}
        <View style={commonStyles.resultContainer}>
          <Animated.View
            style={[
              commonStyles.resultCard,
              {
                transform: [{ scale: cardScale }],
                opacity: resultOpacity,
              },
            ]}
          >
            <Image
              source={selectedCard.frontImage}
              style={commonStyles.resultCardImage}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        {/* 카드 제목 + 점수 */}
        <Animated.View
          style={[
            commonStyles.titleContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <Text
            style={[
              commonStyles.cardTitle,
              { color: cardResult.isPositive ? colors.primary : "#E91B64" },
            ]}
          >
            {cardResult.score}
            {i18n.t("dailyResult.scoreSuffix")}{" "}
            {i18n.t(`cards.${getCardKeyById(selectedCard.id)}.title`)}
          </Text>
        </Animated.View>

        {/* 결과 설명 */}
        <Animated.View
          style={[
            commonStyles.explanationContainer,
            {
              opacity: resultOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          {cardResult.keywords && (
            <View style={commonStyles.keywordsContainer}>
              {cardResult.keywords.split(", ").map((keyword, index) => (
                <View key={index} style={commonStyles.keywordChip}>
                  <Text style={commonStyles.keywordText}>{keyword.trim()}</Text>
                </View>
              ))}
            </View>
          )}
          <Text style={commonStyles.explanationText}>
            {i18n.t(`cards.${getCardKeyById(selectedCard.id)}.description`)}
          </Text>
        </Animated.View>

        {/* 버튼들 */}
        <View style={commonStyles.buttonContainer}>
          {!cardData ? (
            // 새로운 카드 결과인 경우에만 보관하기 버튼 표시
            <View style={commonStyles.topButtonRow}>
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
            <View style={commonStyles.topButtonRow}>
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

          <TouchableOpacity
            style={commonStyles.homeButton}
            onPress={handleHome}
          >
            <Text style={commonStyles.homeButtonText}>
              {i18n.t("result.home")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DailyResultScreen;
