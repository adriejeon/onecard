// 피그마 디자인 기반 색상 테마
export const colors = {
  // 메인 컬러 (보라색 계열)
  primary: "#6B46C1",
  primaryLight: "#9F7AEA",
  primaryDark: "#553C9A",

  // 배경색
  background: "#F7FAFC",
  backgroundDark: "#1A202C",

  // 카드 색상
  cardBackground: "#FFFFFF",
  cardBackgroundDark: "#2D3748",

  // 텍스트 색상
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  textLight: "#FFFFFF",

  // Yes/No 결과 색상
  yesColor: "#48BB78", // 초록색
  noColor: "#F56565", // 빨간색

  // 버튼 색상
  buttonPrimary: "#6B46C1",
  buttonSecondary: "#E2E8F0",
  buttonText: "#FFFFFF",

  // 그라데이션
  gradientStart: "#6B46C1",
  gradientEnd: "#9F7AEA",

  // 그림자
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.3)",
};

export const gradients = {
  primary: [colors.gradientStart, colors.gradientEnd],
  card: [colors.cardBackground, colors.cardBackground],
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};
