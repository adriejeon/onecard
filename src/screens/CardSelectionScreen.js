import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
  StatusBar,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import {
  checkDailyCardAvailability,
  getTodayDailyCard,
  resetDailyCardData,
} from "../utils/dailyCardUtils";
import i18n from "../utils/i18n";

const { width, height } = Dimensions.get("window");

const CardSelectionScreen = ({ navigation }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        {
          iterations: -1,
        }
      ).start();
    };

    startRotation();

    return () => {
      rotateAnim.stopAnimation();
    };
  }, []);

  const handleYesNo = () => {
    navigation.navigate("QuestionInput", { cardType: "yesno" });
  };

  const handleDailyCard = async () => {
    // 데일리 카드 뽑기 가능 여부 확인
    const canDrawDaily = await checkDailyCardAvailability();

    if (!canDrawDaily) {
      // 이미 오늘 뽑았으면 오늘 뽑은 데일리 카드 결과 페이지로 바로 이동
      const todayCard = await getTodayDailyCard();
      if (todayCard) {
        navigation.navigate("DailyResult", { cardData: todayCard });
      } else {
        // 카드 정보가 없으면 데이터 초기화하고 새로 뽑기
        await resetDailyCardData();
        navigation.navigate("DailyCardSelection");
      }
      return;
    }

    // 뽑기 가능하면 데일리 카드 선택 화면으로 이동
    navigation.navigate("DailyCardSelection");
  };

  const handleHomePress = () => {
    navigation.navigate("Home");
  };

  const handleInfoPress = () => {
    navigation.navigate("More");
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
    extrapolate: "clamp",
  });

  return (
    <ImageBackground
      source={require("../../assets/homeBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {/* 상단 헤더 */}
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={handleHomePress}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.symbolImage,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <Image
              source={require("../../assets/home-symbol.png")}
              style={styles.symbolImage}
              contentFit="contain"
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={commonStyles.infoButton}
          onPress={handleInfoPress}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/info-icon.png")}
            style={commonStyles.infoIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 중앙 컨텐츠 영역 */}
      <View style={styles.centerContent}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <Text style={styles.subtitle}>
            {i18n.t("cardSelection.subtitle")}
          </Text>
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
              <Image
                source={require("../../assets/taro-icon.png")}
                style={styles.cardIcon}
                contentFit="contain"
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardButtonTitle}>
                  {i18n.t("cardSelection.yesnoTitle")}
                </Text>
                <Text style={styles.cardButtonSubtitle}>
                  {i18n.t("cardSelection.yesnoDesc")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 데일리 카드 버튼 */}
          <TouchableOpacity
            style={styles.cardButton}
            onPress={handleDailyCard}
            activeOpacity={0.8}
          >
            <View style={styles.cardButtonContent}>
              <Image
                source={require("../../assets/daily-icon.png")}
                style={styles.cardIcon}
                contentFit="contain"
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardButtonTitle}>
                  {i18n.t("cardSelection.dailyTitle")}
                </Text>
                <Text style={styles.cardButtonSubtitle}>
                  {i18n.t("cardSelection.dailyDesc")}
                </Text>
              </View>
            </View>
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
  },
  symbolButton: {},
  symbolImage: {
    width: 32,
    height: 32,
  },
  infoButton: {},
  infoImage: {
    width: 20,
    height: 20,
  },
  centerContent: {
    flex: 0.7,
    justifyContent: "center",
    paddingHorizontal: 24,
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
    fontSize: 26,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    gap: 24,
  },
  cardButton: {
    backgroundColor: colors.choiceBackground,
    borderRadius: 24,
    padding: 24,
    elevation: 12,
  },
  cardButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 54,
    height: 54,
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardButtonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: "left",
  },
  cardButtonSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "left",
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
