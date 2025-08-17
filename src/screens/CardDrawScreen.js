import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import i18n from "../utils/i18n";
import { useLanguage } from "../contexts/LanguageContext";

const { width, height } = Dimensions.get("window");

// 모든 카드 이미지를 정적으로 import
const cardImages = {
  1: require("../../assets/oracleCard/01.png"),
  2: require("../../assets/oracleCard/02.png"),
  3: require("../../assets/oracleCard/03.png"),
  4: require("../../assets/oracleCard/04.png"),
  5: require("../../assets/oracleCard/05.png"),
  6: require("../../assets/oracleCard/06.png"),
  7: require("../../assets/oracleCard/07.png"),
  8: require("../../assets/oracleCard/08.png"),
  9: require("../../assets/oracleCard/09.png"),
  10: require("../../assets/oracleCard/10.png"),
  11: require("../../assets/oracleCard/11.png"),
  12: require("../../assets/oracleCard/12.png"),
  13: require("../../assets/oracleCard/13.png"),
  14: require("../../assets/oracleCard/14.png"),
  15: require("../../assets/oracleCard/15.png"),
  16: require("../../assets/oracleCard/16.png"),
  17: require("../../assets/oracleCard/17.png"),
  18: require("../../assets/oracleCard/18.png"),
  19: require("../../assets/oracleCard/19.png"),
  20: require("../../assets/oracleCard/20.png"),
  21: require("../../assets/oracleCard/21.png"),
  22: require("../../assets/oracleCard/22.png"),
  23: require("../../assets/oracleCard/23.png"),
  24: require("../../assets/oracleCard/24.png"),
  25: require("../../assets/oracleCard/25.png"),
  26: require("../../assets/oracleCard/26.png"),
  27: require("../../assets/oracleCard/27.png"),
  28: require("../../assets/oracleCard/28.png"),
  29: require("../../assets/oracleCard/29.png"),
  30: require("../../assets/oracleCard/30.png"),
  31: require("../../assets/oracleCard/31.png"),
  32: require("../../assets/oracleCard/32.png"),
  33: require("../../assets/oracleCard/33.png"),
  34: require("../../assets/oracleCard/34.png"),
  35: require("../../assets/oracleCard/35.png"),
};

const CardDrawScreen = ({ navigation, route }) => {
  const { currentLanguage } = useLanguage(); // 언어 변경 감지를 위한 훅 추가
  const { question, cardType } = route.params || {};
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [showSelectedCard, setShowSelectedCard] = useState(false);

  // 카드 회전 애니메이션 값들 (react-native-reanimated 사용)
  const cardRotations = useRef(
    Array(12)
      .fill(0)
      .map(() => useSharedValue(0))
  ).current;

  // 모든 카드에 대한 애니메이션 스타일을 미리 생성
  const backCardAnimatedStyles = useRef(
    Array(12)
      .fill(0)
      .map((_, index) =>
        useAnimatedStyle(() => {
          const spinValue = interpolate(
            cardRotations[index].value,
            [0, 1],
            [0, 180]
          );

          return {
            transform: [{ rotateY: `${spinValue}deg` }],
          };
        })
      )
  ).current;

  const frontCardAnimatedStyles = useRef(
    Array(12)
      .fill(0)
      .map((_, index) =>
        useAnimatedStyle(() => {
          const spinValue = interpolate(
            cardRotations[index].value,
            [0, 1],
            [180, 360]
          );

          return {
            transform: [{ rotateY: `${spinValue}deg` }],
          };
        })
      )
  ).current;

  // 35장의 카드 데이터 생성
  const generateCards = () => {
    const cards = [];
    for (let i = 1; i <= 35; i++) {
      cards.push({
        id: i,
        backImage: require("../../assets/card-back.png"),
        frontImage: cardImages[i],
      });
    }
    return cards;
  };

  // 12장의 카드를 랜덤으로 선택
  const selectRandomCards = (allCards) => {
    const shuffled = [...allCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 12);
  };

  // 카드 셔플 함수
  const shuffleCards = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 컴포넌트 마운트 시 카드 셔플
  useEffect(() => {
    const allCards = generateCards();
    const selectedCards = selectRandomCards(allCards);
    setShuffledCards(selectedCards);
  }, []);

  // 동적 타이틀 생성
  const getHeaderTitle = () => {
    return cardType === "daily"
      ? i18n.t("cardDraw.dailyTitle")
      : i18n.t("cardDraw.yesnoTitle");
  };

  const handleCardPress = (card, index) => {
    if (isAnimating || showSelectedCard) return;

    setIsAnimating(true);
    setSelectedCard(card);
    setSelectedCardIndex(index);

    // 카드 회전 애니메이션
    cardRotations[index].value = withTiming(1, { duration: 600 });

    // 애니메이션 완료 후 상태 업데이트
    setTimeout(() => {
      setIsAnimating(false);
      setShowSelectedCard(true);
    }, 600);
  };

  const handleViewResult = () => {
    if (selectedCard) {
      navigation.replace("Result", {
        question,
        result: selectedCard,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
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

        <Text style={commonStyles.headerTitle}>{getHeaderTitle()}</Text>

        <TouchableOpacity
          style={commonStyles.infoButton}
          onPress={() => navigation.navigate("More")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/info-icon-dark.png")}
            style={commonStyles.infoIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 카드 그리드 */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 상단 텍스트 */}
          <View style={styles.headerContainer}>
            {/* 질문 텍스트 */}
            <View style={styles.gradientContainer}>
              <MaskedView
                style={{ width: "100%" }}
                maskElement={
                  <Text style={styles.questionTitle}>{question}</Text>
                }
              >
                <LinearGradient
                  colors={["#612CC9", "#C53D93"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.8, y: 0 }}
                >
                  <Text style={[styles.questionTitle, { opacity: 0 }]}>
                    {question}
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>

            {/* 안내 텍스트 */}
            <Text style={styles.instructionText}>
              {i18n.t("cardDraw.gradientTitleSuffix")}
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            {shuffledCards.map((card, index) => {
              const isSelected = selectedCardIndex === index;
              const isLastCardInRow = (index + 1) % 4 === 0; // 4의 배수 번째 카드는 마지막 카드

              return (
                <TouchableOpacity
                  key={`${card.id}-${index}`}
                  style={[
                    styles.cardWrapper,
                    isLastCardInRow && { marginRight: 0 }, // 마지막 카드는 오른쪽 마진 제거
                  ]}
                  onPress={() => handleCardPress(card, index)}
                  activeOpacity={0.8}
                  disabled={isAnimating || showSelectedCard}
                >
                  <View style={styles.card}>
                    {/* 카드 뒷면 */}
                    <Animated.View
                      style={[
                        styles.cardFace,
                        styles.cardBack,
                        backCardAnimatedStyles[index],
                      ]}
                    >
                      <Image
                        source={card.backImage}
                        style={styles.cardImage}
                        contentFit="contain"
                      />
                    </Animated.View>

                    {/* 카드 앞면 */}
                    <Animated.View
                      style={[
                        styles.cardFace,
                        styles.cardFront,
                        frontCardAnimatedStyles[index],
                      ]}
                    >
                      <Image
                        source={card.frontImage}
                        style={styles.cardImage}
                        contentFit="contain"
                      />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* 하단 버튼 영역 */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.resultButton,
              !showSelectedCard && styles.resultButtonDisabled,
            ]}
            onPress={handleViewResult}
            disabled={!showSelectedCard}
            activeOpacity={0.8}
          >
            <Text style={styles.resultButtonText}>
              {i18n.t("cardDraw.result")}
            </Text>
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
    marginBottom: 20,
    width: "100%",
  },
  gradientContainer: {
    alignItems: "center",
    width: "100%",
  },
  questionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 34,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 0,
  },
  cardWrapper: {
    width: (width - 40 - 12) / 4, // 4개씩 배치, 좌우 패딩과 카드 간 간격(3개 * 4px) 고려
    aspectRatio: 0.7, // 카드 비율
    marginBottom: 12, // 행 간격 증가
    marginRight: 4, // 카드 간 간격
  },
  card: {
    flex: 1,
    position: "relative",
  },
  cardFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: "hidden",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardBack: {
    backgroundColor: "transparent",
  },
  cardFront: {
    transform: [{ rotateY: "180deg" }],
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: "center",
  },
  resultButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 80,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: Platform.OS === "android" ? 56 : undefined,
  },
  resultButtonDisabled: {
    opacity: 0.2,
  },
  resultButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
});

export default CardDrawScreen;
