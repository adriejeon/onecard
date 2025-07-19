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

const { width } = Dimensions.get("window");

const DailyResultScreen = ({ navigation, route }) => {
  const { result } = route.params;

  // 애니메이션 값들
  const resultScale = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;

  // 카드 결과에 따라 배경 결정
  const getBackgroundImage = () => {
    const cardResult = getCardResult(result.id);
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
      const cardResult = getCardResult(result.id);
      const shareMessage = `오늘의 데일리 카드: ${cardResult.title}\n\n${cardResult.description}\n\n원카드 앱으로 오늘의 운세를 확인해보세요!`;

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
          title: "원카드 데일리 결과",
        });
      }
    } catch (error) {
      console.log("공유 실패:", error);

      // 모든 방법이 실패한 경우 기본 공유 시트로 폴백
      try {
        const cardResult = getCardResult(result.id);
        const shareMessage = `오늘의 데일리 카드: ${cardResult.title}\n\n${cardResult.description}\n\n원카드 앱으로 오늘의 운세를 확인해보세요! (https://apps.apple.com/app/onecard)`;

        await Share.share({
          message: shareMessage,
          title: "원카드 데일리 결과",
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
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate("Home");
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
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={commonStyles.backIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>데일리 카드</Text>
        <TouchableOpacity
          style={commonStyles.infoButton}
          onPress={() => navigation.navigate("PrivacyPolicy")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/info-icon-dark.png")}
            style={commonStyles.infoIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
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
                <Text style={commonStyles.gradientTitle}>오늘의 운세</Text>
              }
            >
              <LinearGradient
                colors={["#612CC9", "#C53D93"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
              >
                <Text style={[commonStyles.gradientTitle, { opacity: 0 }]}>
                  오늘의 운세
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
              source={result.frontImage}
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
            {cardResult.score}점 {cardResult.title}
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
            {cardResult.description}
          </Text>
        </Animated.View>

        {/* 버튼들 */}
        <View style={commonStyles.buttonContainer}>
          <View style={commonStyles.topButtonRow}>
            <TouchableOpacity
              style={commonStyles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Text style={commonStyles.retryButtonText}>처음으로</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyles.shareButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Text style={commonStyles.shareButtonText}>공유하기</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={commonStyles.homeButton}
            onPress={handleHome}
          >
            <Text style={commonStyles.homeButtonText}>홈으로</Text>
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
