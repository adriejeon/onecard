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

const { width, height } = Dimensions.get("window");

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
    const cardResults = {
      1: {
        isPositive: true,
        percentage: "100%",
        text: "YES",
        description:
          "태양의 가호를 받은 태양 카드는 모든 일의 출발과 시작입니다. 될 일은 결코 이루어집니다.",
      },
      2: {
        isPositive: true,
        percentage: "100%",
        text: "YES",
        description:
          "위로 올라가는 상승 카드는 하는 일에 승리가 따를 것을 보여줍니다.",
      },
      3: {
        isPositive: true,
        percentage: "100%",
        text: "YES",
        description:
          "명예 카드는 질문이 곧 나의 명예를 상승시켜 줄 수 있음을 보여줍니다.",
      },
      4: {
        isPositive: true,
        percentage: "84%",
        text: "YES",
        description:
          "리더쉽 카드는 나의 자리가 견고함을 보여줍니다. 질문이 긍정적인 방향으로 갈 것을 알려줍니다.",
      },
      5: {
        isPositive: false,
        percentage: "73%",
        text: "NO",
        description:
          "우울 카드는 고민이 많아지는 것을 보여줍니다. 질문의 방향이 좋지 않은 쪽으로 흘러갈 가능성이 있습니다.",
      },
      6: {
        isPositive: false,
        percentage: "86%",
        text: "NO",
        description:
          "변덕 카드는 불안정한 상태를 보여줍니다. 질문의 미래가 불투명해질 수 있습니다.",
      },
      7: {
        isPositive: true,
        percentage: "80%",
        text: "YES",
        description:
          "가족 카드는 든든한 울타리 안에 있음을 보여줍니다. 질문의 미래가 안정적이라고 볼 수 있습니다.",
      },
      8: {
        isPositive: true,
        percentage: "90%",
        text: "YES",
        description:
          "엄마 카드는 언제나 따뜻하게 품어주는 엄마와 같습니다. 질문이 긍정적인 방향으로 흘러갈 수 있습니다.",
      },
      9: {
        isPositive: false,
        percentage: "94%",
        text: "NO",
        description:
          "질병 카드는 뜻과 같이 일이 진행되지 않음을 보여줍니다. 결과가 좋지 않을 수 있습니다.",
      },
      10: {
        isPositive: false,
        percentage: "56%",
        text: "NO",
        description:
          "변화 카드는 변화를 암시합니다. 변화는 잘 대응하면 긍정적이지만 대체로 부정적입니다.",
      },
      11: {
        isPositive: true,
        percentage: "73%",
        text: "YES",
        description:
          "지성 카드는 꽤 긍정적입니다. 지성을 발휘하여 문제를 해결해 나갈 수 있습니다.",
      },
      12: {
        isPositive: false,
        percentage: "95%",
        text: "NO",
        description:
          "도둑질 카드는 부정적인 카드입니다. 내 생각과 다르게 타인의 부정 행위에 의해 좌절될 수 있습니다.",
      },
      13: {
        isPositive: true,
        percentage: "64%",
        text: "YES",
        description:
          "트레이드 카드는 꽤 긍정적입니다. 협상이 발생할 수 있지만 긍정적인 쪽으로 타협할 수 있습니다.",
      },
      14: {
        isPositive: true,
        percentage: "82%",
        text: "YES",
        description:
          "즐거움 카드는 상당히 긍정적입니다. 결과가 어찌되든 자신이 느끼는 행복과 즐거움이 따릅니다.",
      },
      15: {
        isPositive: true,
        percentage: "100%",
        text: "YES",
        description:
          "평화 카드는 무척 긍정적입니다. 결과는 결국 긍정적인 방향으로 종결되고 평화가 찾아올 것입니다.",
      },
      16: {
        isPositive: true,
        percentage: "88%",
        text: "YES",
        description:
          "돈 카드는 긍정에 가깝습니다. 금전적으로 해결되는 일, 혹은 금전이 되어 돌아오는 일 생길 수 있습니다.",
      },
      17: {
        isPositive: true,
        percentage: "100%",
        text: "YES",
        description:
          "사랑 카드는 긍정입니다. 연애와 관련한 질문이었다면 결국 사랑의 화합으로 이어질 것입니다.",
      },
      18: {
        isPositive: true,
        percentage: "88%",
        text: "YES",
        description:
          "음식과 음료 카드는 긍정입니다. 맛있는걸 먹고 마시며 즐거운 시간으로 이어질 것입니다.",
      },
      19: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "악의 카드는 부정적입니다. 내 뜻과 달리 타인의 개입이나 악의로 인해 좌절될 수 있습니다.",
      },
      20: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "전쟁 카드는 부정적입니다. 서로 충돌하고 싸우고 오해하는 일이 생길 수 있습니다.",
      },
      21: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "적 카드는 부정적입니다. 나를 해치고 음해하는 적이 가까운 곳에 있을 수 있습니다.",
      },
      22: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "재난 카드는 부정적입니다. 내 뜻과 다른 재해와 가까운 외부 변수로 인해 좌절될 수 있습니다.",
      },
      23: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "사고 카드는 부정적입니다. 갑작스러운 이슈가 생길 수 있습니다.",
      },
      24: {
        isPositive: true,
        percentage: "70%",
        text: "YES",
        description:
          "성찰 카드는 긍정적입니다. 자아 성찰을 통해 더 나은 미래로 나아갈 수 있습니다.",
      },
      25: {
        isPositive: true,
        percentage: "100%",
        text: "YES",
        description:
          "좋은 기회 카드는 무척 긍정적입니다. 생각하지 못한 좋은 기회가 가까운 곳에서 기다리고 있을 수 있습니다.",
      },
      26: {
        isPositive: true,
        percentage: "100%",
        text: "YES",
        description:
          "명성 카드는 무척 긍정적입니다. 주변에 나의 좋은 소식, 명성이 올라가는 긍정적인 이벤트가 있을 수 있습니다.",
      },
      27: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "불운 카드는 부정적입니다. 내 실수나 잘못을 떠나서 찾아오는 불운이 생길 수 있습니다.",
      },
      28: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "비극 카드는 부정적입니다. 이름에서 느껴지듯 비극적인 결론으로 이어질 수 있으니 주의가 필요합니다.",
      },
      29: {
        isPositive: false,
        percentage: "100%",
        text: "NO",
        description:
          "파멸 카드는 부정적입니다. 이름에서 느껴지듯 파멸로 향하며 끝날 수 있습니다.",
      },
      30: {
        isPositive: false,
        percentage: "60%",
        text: "NO",
        description:
          "지연 카드는 꽤 부정적입니다. 일의 지연과 막힘이 있을 수 있습니다.",
      },
      31: {
        isPositive: false,
        percentage: "70%",
        text: "NO",
        description:
          "고립 카드는 꽤 부정적입니다. 혼자 고립되어 외롭고 고독한 시간을 보낼 수 있습니다.",
      },
      32: {
        isPositive: true,
        percentage: "80%",
        text: "YES",
        description:
          "유머 카드는 꽤 긍정적입니다. 누군가와 즐겁게 대화하고 웃을 수 있는 시간이 있을 수 있습니다.",
      },
    };

    return (
      cardResults[cardId] || {
        isPositive: true,
        percentage: "50%",
        text: "YES",
        description: "카드 결과를 확인할 수 없습니다.",
      }
    );
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={styles.backIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate("PrivacyPolicy")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/info-icon-dark.png")}
            style={styles.infoIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
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
          <Text style={styles.explanationText}>{cardResult.description}</Text>
        </Animated.View>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <View style={styles.topButtonRow}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>처음으로</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Text style={styles.shareButtonText}>공유하기</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>홈으로</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    width: 20,
    height: 20,
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
  shareButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "48%",
    borderColor: colors.primary,
    borderWidth: 1,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
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
