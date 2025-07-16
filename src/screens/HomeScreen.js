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

const HomeScreen = ({ navigation }) => {
  const handleStart = () => {
    navigation.navigate("CardSelection");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 상단 여백 */}
        <View style={styles.topSpacer} />

        {/* 메인 카드 영역 */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardText}>?</Text>
          </View>
        </View>

        {/* 하단 영역 */}
        <View style={styles.bottomSection}>
          {/* 시작 버튼 */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>시작하기</Text>
          </TouchableOpacity>

          {/* 하단 텍스트 */}
          <Text style={styles.bottomText}>카드 한 장으로 답을 찾아보세요</Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  topSpacer: {
    height: 100,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.7,
    height: width * 0.9,
    backgroundColor: colors.cardBackground,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  cardText: {
    fontSize: 140,
    fontWeight: "bold",
    color: colors.primary,
  },
  bottomSection: {
    paddingBottom: 60,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: colors.textLight,
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 80,
    marginBottom: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
  },
  bottomText: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.9,
    textAlign: "center",
  },
});

export default HomeScreen;
