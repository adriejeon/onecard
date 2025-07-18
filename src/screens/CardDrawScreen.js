import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
} from "react-native";
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
};

const CardDrawScreen = ({ navigation, route }) => {
  const { question, cardType } = route.params;
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [showSelectedCard, setShowSelectedCard] = useState(false);

  // 카드 회전 애니메이션 값들 (react-native-reanimated 사용)
  const cardRotations = useRef(
    Array(32)
      .fill(0)
      .map(() => useSharedValue(0))
  ).current;

  // 모든 카드에 대한 애니메이션 스타일을 미리 생성
  const backCardAnimatedStyles = useRef(
    Array(32)
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
    Array(32)
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

  // 32장의 카드 데이터 생성
  const generateCards = () => {
    const cards = [];
    for (let i = 1; i <= 32; i++) {
      cards.push({
        id: i,
        backImage: require("../../assets/card-back.png"),
        frontImage: cardImages[i],
      });
    }
    return cards;
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
    const cards = generateCards();
    setShuffledCards(shuffleCards(cards));
  }, []);

  // 동적 타이틀 생성
  const getHeaderTitle = () => {
    return cardType === "daily" ? "데일리 카드" : "Yes or No 오라클 타로";
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
      navigation.navigate("Result", {
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/back-icon.png")}
            style={styles.backIcon}
            resizeMode="contain"
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
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <View style={styles.gradientContainer}>
            <MaskedView
              style={{ width: "100%" }}
              maskElement={
                <Text style={styles.gradientTitle}>
                  {question}
                  {"\n"}를 생각하며 한 장 뽑아주세요.
                </Text>
              }
            >
              <LinearGradient
                colors={["#612CC9", "#C53D93"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
              >
                <Text style={[styles.gradientTitle, { opacity: 0 }]}>
                  {question}
                  {"\n"}를 생각하며 한 장 뽑아주세요.
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </View>

        {/* 카드 그리드 */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardsContainer}>
            {shuffledCards.map((card, index) => {
              const isSelected = selectedCardIndex === index;

              return (
                <TouchableOpacity
                  key={`${card.id}-${index}`}
                  style={styles.cardWrapper}
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
                        resizeMode="contain"
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
                        resizeMode="contain"
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
            <Text style={styles.resultButtonText}>결과 보기</Text>
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
    marginBottom: 20,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  cardWrapper: {
    width: (width - 56) / 4, // 4개씩 배치, 좌우 패딩과 간격 고려
    aspectRatio: 0.7, // 카드 비율
    marginBottom: 8,
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
