import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Animated,
} from "react-native";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";

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
    navigation.navigate("QuestionInput");
  };

  const handleDailyCard = () => {
    console.log("데일리 카드 선택");
  };

  const handleHomePress = () => {
    navigation.navigate("Home");
  };

  const handleInfoPress = () => {
    navigation.navigate("PrivacyPolicy");
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
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.symbolButton}
          onPress={handleHomePress}
          activeOpacity={0.8}
        >
          <Animated.Image
            source={require("../../assets/home-symbol.png")}
            style={[
              styles.symbolImage,
              {
                transform: [{ rotate: spin }],
              },
            ]}
            resizeMode="contain"
            width={32}
            height={32}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={handleInfoPress}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/info-icon.png")}
            style={styles.infoImage}
            resizeMode="contain"
            width={24}
            height={24}
          />
        </TouchableOpacity>
      </View>

      {/* 중앙 컨텐츠 영역 */}
      <View style={styles.centerContent}>
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <Text style={styles.subtitle}>어떤 카드를 뽑아볼까요?</Text>
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
                resizeMode="contain"
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardButtonTitle}>Yes or No</Text>
                <Text style={styles.cardButtonSubtitle}>
                  예/아니오로 답할 수 있는 질문
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
                resizeMode="contain"
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardButtonTitle}>데일리 카드</Text>
                <Text style={styles.cardButtonSubtitle}>
                  오늘 하루의 운세를 확인해보세요
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
    width: 34,
    height: 34,
  },
  infoButton: {},
  infoImage: {
    width: 24,
    height: 24,
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
