import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const { width, height } = Dimensions.get("window");

export const commonStyles = StyleSheet.create({
  // 공통 헤더 스타일
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  backButton: {},
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
  infoButton: {},
  infoIcon: {
    width: 18,
    height: 18,
  },

  // 공통 컨테이너 스타일
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // 공통 텍스트 스타일
  gradientTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 34,
  },
  centerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 38,
  },

  // 공통 버튼 스타일
  buttonContainer: {
    gap: 15,
    paddingHorizontal: 24,
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
    borderColor: colors.textPrimary,
    borderWidth: 1,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  archiveButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "48%",
    borderColor: colors.primary,
    borderWidth: 1,
  },
  archiveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  deleteButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "48%",
    borderColor: "#EA1B63",
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#EA1B63",
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
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 80,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 80,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#C3C3C3",
  },

  // 공통 카드 스타일
  cardWrapper: {
    width: (width - 56) / 4,
    aspectRatio: 0.7,
    marginBottom: 8,
  },
  card: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "transparent",
  },
  cardFront: {
    backgroundColor: "transparent",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  resultCard: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  resultCardImage: {
    width: "100%",
    height: "100%",
  },

  // 공통 레이아웃 스타일
  headerContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  gradientContainer: {
    alignItems: "center",
    width: "100%",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 4,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  explanationContainer: {
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // 공통 텍스트 스타일
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  explanationText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 28,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
  },

  // 공통 섹션 스타일
  centerContent: {
    flex: 0.7,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerGroup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    paddingBottom: 60,
    alignItems: "center",
  },
  symbolContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    marginTop: 60,
  },
  symbolImage: {
    width: 48,
    height: 48,
  },

  centerTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  // 공통 입력 스타일
  inputContainer: {
    width: "100%",
    marginTop: 30,
    position: "relative",
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
  },
  characterCount: {
    position: "absolute",
    bottom: 10,
    right: 15,
    fontSize: 12,
    color: "#888",
  },

  // 공통 카드 버튼 스타일
  cardButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 4,
  },
  cardButtonSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    opacity: 0.8,
  },

  // 공통 키워드 스타일
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 4,
    marginBottom: 12,
  },
  keywordChip: {
    backgroundColor: "rgba(97, 44, 201, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  keywordText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },

  // 공통 퍼센트 컨테이너
  percentageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  // 보관 버튼 스타일
  archiveButton: {
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    width: "48%",
    borderColor: colors.primary,
    borderWidth: 1,
  },
  archiveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
});
