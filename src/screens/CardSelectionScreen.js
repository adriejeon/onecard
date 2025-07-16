import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";

const { width, height } = Dimensions.get("window");

const CardSelectionScreen = ({ navigation }) => {
  const handleYesNo = () => {
    navigation.navigate("QuestionInput");
  };

  const handleDailyCard = () => {
    // 데일리 카드 기능은 나중에 구현
    console.log("데일리 카드 선택");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>카드를 선택하세요</Text>
          <Text style={styles.subtitle}>어떤 카드를 뽑아보시겠어요?</Text>
        </View>

        {/* 카드 선택 버튼들 */}
        <View style={styles.buttonContainer}>
          {/* Yes or No 카드 버튼 */}
          <TouchableOpacity
            style={styles.cardButton}
            onPress={handleYesNo}
            activeOpacity={0.8}
          >
            <View style={styles.cardButtonContent}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>?</Text>
              </View>
              <Text style={styles.cardButtonTitle}>Yes or No</Text>
              <Text style={styles.cardButtonSubtitle}>
                예/아니오로 답할 수 있는 질문
              </Text>
            </View>
          </TouchableOpacity>

          {/* 데일리 카드 버튼 */}
          <TouchableOpacity
            style={styles.cardButton}
            onPress={handleDailyCard}
            activeOpacity={0.8}
          >
            <View style={styles.cardButtonContent}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>✨</Text>
              </View>
              <Text style={styles.cardButtonTitle}>데일리 카드</Text>
              <Text style={styles.cardButtonSubtitle}>
                오늘 하루의 운세를 확인해보세요
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    opacity: 0.8,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 30,
  },
  cardButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 25,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  cardButtonContent: {
    alignItems: "center",
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardIconText: {
    fontSize: 40,
    color: colors.textLight,
  },
  cardButtonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  cardButtonSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
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

export default CardSelectionScreen;
