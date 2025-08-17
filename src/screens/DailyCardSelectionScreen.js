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
import {
  saveDailyCardDraw,
  checkDailyCardAvailability,
  getTodayDailyCard,
} from "../utils/dailyCardUtils";
import i18n from "../utils/i18n";
import { useLanguage } from "../contexts/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cardResults from "../assets/data/cardResults";

const { width, height } = Dimensions.get("window");

// 모든 유니버셜 카드 이미지를 정적으로 import
const tarotImages = {
  major_0: require("../../assets/tarot/major_0.png"),
  major_1: require("../../assets/tarot/major_1.png"),
  major_2: require("../../assets/tarot/major_2.png"),
  major_3: require("../../assets/tarot/major_3.png"),
  major_4: require("../../assets/tarot/major_4.png"),
  major_5: require("../../assets/tarot/major_5.png"),
  major_6: require("../../assets/tarot/major_6.png"),
  major_7: require("../../assets/tarot/major_7.png"),
  major_8: require("../../assets/tarot/major_8.png"),
  major_9: require("../../assets/tarot/major_9.png"),
  major_10: require("../../assets/tarot/major_10.png"),
  major_11: require("../../assets/tarot/major_11.png"),
  major_12: require("../../assets/tarot/major_12.png"),
  major_13: require("../../assets/tarot/major_13.png"),
  major_14: require("../../assets/tarot/major_14.png"),
  major_15: require("../../assets/tarot/major_15.png"),
  major_16: require("../../assets/tarot/major_16.png"),
  major_17: require("../../assets/tarot/major_17.png"),
  major_18: require("../../assets/tarot/major_18.png"),
  major_19: require("../../assets/tarot/major_19.png"),
  major_20: require("../../assets/tarot/major_20.png"),
  major_21: require("../../assets/tarot/major_21.png"),
  ace_cups: require("../../assets/tarot/ace_cups.png"),
  ace_pentacles: require("../../assets/tarot/ace_pentacles.png"),
  ace_swords: require("../../assets/tarot/ace_swords.png"),
  ace_wands: require("../../assets/tarot/ace_wands.png"),
  cups_2: require("../../assets/tarot/cups_2.png"),
  cups_3: require("../../assets/tarot/cups_3.png"),
  cups_4: require("../../assets/tarot/cups_4.png"),
  cups_5: require("../../assets/tarot/cups_5.png"),
  cups_6: require("../../assets/tarot/cups_6.png"),
  cups_7: require("../../assets/tarot/cups_7.png"),
  cups_8: require("../../assets/tarot/cups_8.png"),
  cups_9: require("../../assets/tarot/cups_9.png"),
  cups_10: require("../../assets/tarot/cups_10.png"),
  pentacle_2: require("../../assets/tarot/pentacle_2.png"),
  pentacle_3: require("../../assets/tarot/pentacle_3.png"),
  pentacle_4: require("../../assets/tarot/pentacle_4.png"),
  pentacle_5: require("../../assets/tarot/pentacle_5.png"),
  pentacle_6: require("../../assets/tarot/pentacle_6.png"),
  pentacle_7: require("../../assets/tarot/pentacle_7.png"),
  pentacle_8: require("../../assets/tarot/pentacle_8.png"),
  pentacle_9: require("../../assets/tarot/pentacle_9.png"),
  pentacle_10: require("../../assets/tarot/pentacle_10.png"),
  swords_2: require("../../assets/tarot/swords_2.png"),
  swords_3: require("../../assets/tarot/swords_3.png"),
  swords_4: require("../../assets/tarot/swords_4.png"),
  swords_5: require("../../assets/tarot/swords_5.png"),
  swords_6: require("../../assets/tarot/swords_6.png"),
  swords_7: require("../../assets/tarot/swords_7.png"),
  swords_8: require("../../assets/tarot/swords_8.png"),
  swords_9: require("../../assets/tarot/swords_9.png"),
  swords_10: require("../../assets/tarot/swords_10.png"),
  wands_2: require("../../assets/tarot/wands_2.png"),
  wands_3: require("../../assets/tarot/wands_3.png"),
  wands_4: require("../../assets/tarot/wands_4.png"),
  wands_5: require("../../assets/tarot/wands_5.png"),
  wands_6: require("../../assets/tarot/wands_6.png"),
  wands_7: require("../../assets/tarot/wands_7.png"),
  wands_8: require("../../assets/tarot/wands_8.png"),
  wands_9: require("../../assets/tarot/wands_9.png"),
  wands_10: require("../../assets/tarot/wands_10.png"),
  page_cups: require("../../assets/tarot/page_cups.png"),
  page_pentacles: require("../../assets/tarot/page_pentacles.png"),
  page_swords: require("../../assets/tarot/page_swords.png"),
  page_wands: require("../../assets/tarot/page_wands.png"),
  knight_cups: require("../../assets/tarot/knight_cups.png"),
  knight_pentacles: require("../../assets/tarot/knight_pentacles.png"),
  knight_swords: require("../../assets/tarot/knight_swords.png"),
  knight_wands: require("../../assets/tarot/knight_wands.png"),
  queen_cups: require("../../assets/tarot/queen_cups.png"),
  queen_pentacles: require("../../assets/tarot/queen_pentacles.png"),
  queen_swords: require("../../assets/tarot/queen_swords.png"),
  queen_wands: require("../../assets/tarot/queen_wands.png"),
  king_cups: require("../../assets/tarot/king_cups.png"),
  king_pentacles: require("../../assets/tarot/king_pentacles.png"),
  king_swords: require("../../assets/tarot/king_swords.png"),
  king_wands: require("../../assets/tarot/king_wands.png"),
};

const DailyCardSelectionScreen = ({ navigation, route }) => {
  const { currentLanguage } = useLanguage(); // 언어 변경 감지를 위한 훅 추가
  const { selectedDate: selectedDateParam } = route.params || {
    selectedDate: new Date().toISOString().split("T")[0],
  };

  // selectedDate를 문자열로 유지 (Date 객체로 변환하지 않음)
  const selectedDate = selectedDateParam;

  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [showSelectedCard, setShowSelectedCard] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // 12장의 카드 데이터 생성 (랜덤 선택)
  const generateCards = () => {
    const cardKeys = Object.keys(tarotImages);
    const shuffledKeys = cardKeys.sort(() => Math.random() - 0.5);
    const selectedKeys = shuffledKeys.slice(0, 12);

    const cards = selectedKeys.map((key, index) => ({
      id: key,
      backImage: require("../../assets/card-back.png"),
      frontImage: tarotImages[key],
    }));

    return cards;
  };

  // 컴포넌트 마운트 시 카드 생성 및 데일리 카드 확인
  useEffect(() => {
    const checkDailyCard = async () => {
      try {
        // selectedDate는 이미 문자열 형태 (YYYY-MM-DD)
        const dateString = selectedDate;
        const dateKey = `dailyCard_${dateString}`;

        const existingCard = await AsyncStorage.getItem(dateKey);

        if (existingCard) {
          // 이미 해당 날짜에 뽑았으면 결과 페이지로 바로 이동
          const cardData = JSON.parse(existingCard);
          navigation.replace("DailyResult", {
            result: cardData.result,
            cardType: "daily",
            score: cardData.score,
            cardData: cardData,
          });
          return;
        }

        // 뽑기 가능하거나 카드 정보가 없으면 카드 생성
        const cards = generateCards();
        setShuffledCards(cards);
      } catch (error) {
        console.error("Error in checkDailyCard:", error); // 에러 로그
      }
    };

    checkDailyCard();
  }, [navigation, selectedDate]);

  const handleCardPress = (card, index) => {
    if (isAnimating || showSelectedCard) return;

    setIsAnimating(true);
    setSelectedCard(card);
    setSelectedCardIndex(index);

    // 카드 회전 애니메이션
    cardRotations[index].value = withTiming(1, { duration: 600 });

    // 애니메이션 완료 후 상태 업데이트
    setTimeout(async () => {
      setIsAnimating(false);
      setShowSelectedCard(true);

      // 특정 날짜에 데일리 카드 뽑기 완료 저장
      // selectedDate는 이미 문자열 형태 (YYYY-MM-DD)
      const dateString = selectedDate;
      const dateKey = `dailyCard_${dateString}`;

      // 카드 결과 정보 가져오기
      const cardResult = cardResults[card.id] || {
        score: "0",
        isPositive: true,
      };

      const cardDataToSave = {
        result: {
          ...card,
          title: cardResult.title || card.id, // 카드 제목 추가
        },
        cardType: "daily",
        date: dateString,
        score: cardResult.score,
        isPositive: cardResult.isPositive,
        createdAt: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem(dateKey, JSON.stringify(cardDataToSave));
      } catch (error) {
        console.error("데일리 카드 저장 실패:", error);
      }
    }, 600);
  };

  const handleViewResult = () => {
    if (selectedCard) {
      // selectedDate는 이미 문자열 형태 (YYYY-MM-DD)
      const dateString = selectedDate;

      navigation.replace("DailyResult", {
        result: selectedCard,
        cardType: "daily",
        cardData: {
          date: dateString,
          result: selectedCard,
        },
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

        <Text style={commonStyles.headerTitle}>
          {i18n.t("cardDraw.dailyTitle")}
        </Text>

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
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <View style={styles.gradientContainer}>
            <MaskedView
              style={{ width: "100%" }}
              maskElement={
                <Text style={styles.gradientTitle}>
                  {i18n.t("dailyCardSelection.gradientTitle")}
                </Text>
              }
            >
              <LinearGradient
                colors={["#612CC9", "#C53D93"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
              >
                <Text style={[styles.gradientTitle, { opacity: 0 }]}>
                  {i18n.t("dailyCardSelection.gradientTitle")}
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
              {i18n.t("dailyCardSelection.result")}
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
    marginTop: 28,
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
    minHeight: 400, // 최소 높이 설정
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1, // 내용이 적을 때도 전체 높이 사용
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
    borderRadius: 8, // 카드 이미지에도 둥근 모서리 적용
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

export default DailyCardSelectionScreen;
