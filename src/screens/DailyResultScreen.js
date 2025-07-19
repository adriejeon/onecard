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

const { width } = Dimensions.get("window");

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
        const cardResult = getCardResult(selectedCard.id);
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
        Alert.alert("보관 완료", "카드 결과가 보관함에 저장되었습니다.");
      } else {
        Alert.alert("보관 실패", "카드 결과 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("보관 실패:", error);
      Alert.alert("보관 실패", "카드 결과 저장에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "보관 삭제",
      "이 카드 결과를 보관함에서 삭제하시겠습니까? 삭제된 카드 결과는 다시 되돌릴 수 없습니다",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              // 보관함에서 온 경우에만 삭제 가능
              if (cardData && cardData.id) {
                const success = await deleteCardResult(cardData.id);
                if (success) {
                  Alert.alert(
                    "삭제 완료",
                    "카드 결과가 보관함에서 삭제되었습니다.",
                    [
                      {
                        text: "확인",
                        onPress: () => {
                          // 보관함으로 돌아가기
                          navigation.navigate("CardArchive");
                        },
                      },
                    ]
                  );
                } else {
                  Alert.alert("삭제 실패", "카드 결과 삭제에 실패했습니다.");
                }
              } else {
                Alert.alert(
                  "삭제 실패",
                  "삭제할 수 있는 카드 데이터가 없습니다."
                );
              }
            } catch (error) {
              console.error("삭제 실패:", error);
              Alert.alert("삭제 실패", "카드 결과 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
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
          데일리 카드
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
          {!cardData ? (
            // 새로운 카드 결과인 경우에만 보관하기 버튼 표시
            <View style={commonStyles.topButtonRow}>
              <TouchableOpacity
                style={commonStyles.archiveButton}
                onPress={handleArchive}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.archiveButtonText}>보관하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyles.shareButton}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.shareButtonText}>공유하기</Text>
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
                <Text style={commonStyles.shareButtonText}>공유하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyles.deleteButton}
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.deleteButtonText}>보관 삭제하기</Text>
              </TouchableOpacity>
            </View>
          )}

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
