import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Share,
} from "react-native";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";

const { width, height } = Dimensions.get("window");

const ResultScreen = ({ navigation, route }) => {
  const { question, result } = route.params;

  // 애니메이션 값들
  const resultScale = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;

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
      const shareMessage = `질문: ${question}\n답: ${result.text}\n\n원카드 앱으로 답을 찾아보세요!`;

      await Share.share({
        message: shareMessage,
        title: "원카드 결과",
      });
    } catch (error) {
      console.log("공유 실패:", error);
    }
  };

  const handleRetry = () => {
    navigation.navigate("QuestionInput");
  };

  const handleHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>결과</Text>
          <Text style={styles.questionText}>{question}</Text>
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
            <Text style={[styles.resultText, { color: result.color }]}>
              {result.text}
            </Text>
          </Animated.View>
        </View>

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
            {result.text === "YES"
              ? "긍정적인 답입니다. 자신을 믿고 도전해보세요!"
              : "신중하게 생각해보세요. 다른 관점에서도 고려해보는 것이 좋겠어요."}
          </Text>
        </Animated.View>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.shareButtonText}>공유하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>다시하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>홈으로</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
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
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  resultCard: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  resultText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  explanationContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  explanationText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  shareButton: {
    backgroundColor: colors.textLight,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  retryButton: {
    backgroundColor: colors.buttonSecondary,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
