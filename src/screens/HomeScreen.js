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
} from "react-native";
import { Image } from "expo-image";
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
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={commonStyles.content}>
        {/* 상단 심볼 영역 */}
        <View style={commonStyles.symbolContainer}>
          <Animated.View
            style={[
              commonStyles.symbolImage,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <Image
              source={require("../../assets/home-symbol.png")}
              style={commonStyles.symbolImage}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        {/* 중앙 텍스트 영역 */}
        <View style={commonStyles.centerTextContainer}>
          <Text style={commonStyles.centerText}>
            매일이 새로운 기회입니다.{"\n"}
            오늘 뽑은 한 장의 카드가{"\n"}
            기회로 이끌어 줄 거예요.
          </Text>
        </View>

        {/* 하단 영역 */}
        <View style={commonStyles.bottomSection}>
          {/* 시작 버튼 */}
          <TouchableOpacity
            style={commonStyles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={commonStyles.startButtonText}>시작하기</Text>
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
});

export default HomeScreen;
