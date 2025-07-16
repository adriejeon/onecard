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

const HomeScreen = ({ navigation }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      rotateAnim.setValue(0); // 초기값 리셋
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000, // 4초로 늘려서 더 부드럽게
          useNativeDriver: true,
        }),
        {
          iterations: -1, // 무한 반복 명시
        }
      ).start();
    };

    startRotation();

    // 컴포넌트 언마운트 시 정리
    return () => {
      rotateAnim.stopAnimation();
    };
  }, []);

  const handleStart = () => {
    navigation.navigate("CardSelection");
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
    extrapolate: "clamp", // 값 범위 제한
  });

  return (
    <ImageBackground
      source={require("../../assets/homeBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        {/* 상단 심볼 영역 */}
        <View style={styles.symbolContainer}>
          <Animated.Image
            source={require("../../assets/home-symbol.png")}
            style={[
              styles.symbolImage,
              {
                transform: [{ rotate: spin }],
              },
            ]}
            resizeMode="contain"
            width={48}
            height={48}
            marginTop={60}
          />
        </View>

        {/* 중앙 텍스트 영역 */}
        <View style={styles.centerTextContainer}>
          <Text style={styles.centerText}>
            매일이 새로운 기회입니다.{"\n"}
            오늘 뽑은 한 장의 카드가{"\n"}
            기회로 이끌어 줄 거예요.
          </Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  symbolContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
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
  centerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 38,
  },
  bottomSection: {
    paddingBottom: 60,
    alignItems: "center",
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
});

export default HomeScreen;
