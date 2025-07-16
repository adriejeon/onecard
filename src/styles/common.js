import { StyleSheet, Dimensions } from "react-native";
import { colors, shadows } from "./colors";

const { width, height } = Dimensions.get("window");

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    margin: 10,
    ...shadows.medium,
  },

  button: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.small,
  },

  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "600",
  },

  secondaryButton: {
    backgroundColor: colors.buttonSecondary,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.small,
  },

  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.buttonSecondary,
    marginBottom: 20,
    ...shadows.small,
  },

  // 그라데이션 배경을 위한 스타일
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// shadows를 commonStyles에 추가
commonStyles.shadows = shadows;

export const dimensions = {
  screenWidth: width,
  screenHeight: height,
  cardWidth: width * 0.8,
  cardHeight: height * 0.6,
};
