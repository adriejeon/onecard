import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";

const { width, height } = Dimensions.get("window");

const CardDrawScreen = ({ navigation, route }) => {
  const { question } = route.params;
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // test
  // 애니메이션 값들
  const cardScale = new Animated.Value(1);
  const cardOpacity = new Animated.Value(1);
  const cardRotation = new Animated.Value(0);

  // 카드 데이터 (예/아니오 카드)
  const cards = [
    { id: 1, text: "YES", color: colors.yesColor },
    { id: 2, text: "NO", color: colors.noColor },
    { id: 3, text: "YES", color: colors.yesColor },
    { id: 4, text: "NO", color: colors.noColor },
    { id: 5, text: "YES", color: colors.yesColor },
    { id: 6, text: "NO", color: colors.noColor },
  ];

  const handleCardPress = (card) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSelectedCard(card);

    // 카드 선택 애니메이션
    Animated.parallel([
      Animated.timing(cardScale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardRotation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 결과 화면으로 이동
      setTimeout(() => {
        navigation.navigate("Result", {
          question,
          result: card,
        });
      }, 500);
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>카드를 선택하세요</Text>
          <Text style={styles.questionText}>{question}</Text>
        </View>

        {/* 카드 그리드 */}
        <View style={styles.cardsContainer}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardWrapper}
              onPress={() => handleCardPress(card)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [
                      { scale: cardScale },
                      {
                        rotate: cardRotation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                    opacity: cardOpacity,
                  },
                ]}
              >
                <Text style={[styles.cardText, { color: card.color }]}>
                  {card.text}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 하단 텍스트 */}
        <Text style={styles.bottomText}>마음에 드는 카드를 터치하세요</Text>

        {/* 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradientStart,
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 15,
    textAlign: "center",
  },
  questionText: {
    fontSize: 18,
    color: colors.textLight,
    opacity: 0.9,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  cardsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  cardWrapper: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  cardText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  bottomText: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.8,
  },
});

export default CardDrawScreen;
