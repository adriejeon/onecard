import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import i18n from "../utils/i18n";

const QuestionInputScreen = ({ navigation, route }) => {
  const [question, setQuestion] = useState("");

  // 라우트 파라미터에서 카드 타입 확인
  const cardType = route.params?.cardType || "yesno";

  const handleNext = () => {
    if (question.trim()) {
      navigation.navigate("CardDraw", {
        question: question.trim(),
        cardType: cardType,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // 동적 타이틀 생성
  const getHeaderTitle = () => {
    return cardType === "daily"
      ? i18n.t("questionInput.headerDaily")
      : i18n.t("questionInput.headerYesno");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/subBg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        {/* 상단 헤더 */}
        <View style={commonStyles.header}>
          <TouchableOpacity
            style={commonStyles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/back-icon.png")}
              style={commonStyles.backIcon}
              contentFit="contain"
            />
          </TouchableOpacity>

          <Text style={commonStyles.headerTitle}>{getHeaderTitle()}</Text>

          <TouchableOpacity
            style={commonStyles.infoButton}
            onPress={() => navigation.navigate("More")}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/info-icon-dark.png")}
              style={commonStyles.infoIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* 중앙 그룹 영역 */}
          <View style={styles.centerGroup}>
            {/* 상단 텍스트 */}
            <View style={styles.gradientContainer}>
              <MaskedView
                maskElement={
                  <Text style={styles.gradientTitle}>
                    {i18n.t("questionInput.gradientTitle")}
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#612CC9", "#C53D93"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.8, y: 0 }}
                >
                  <Text style={[styles.gradientTitle, { opacity: 0 }]}>
                    {i18n.t("questionInput.gradientTitle")}
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>

            {/* 질문 입력 영역 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={question}
                onChangeText={setQuestion}
                placeholder={i18n.t("questionInput.placeholder")}
                placeholderTextColor="#C3C3C3"
                multiline={false}
                textAlignVertical="center"
                maxLength={60}
                blurOnSubmit={true}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                scrollEnabled={true}
              />
              <Text style={styles.characterCount}>{question.length}/60</Text>
            </View>
          </View>

          {/* 하단 버튼 영역 */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                !question.trim() && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={!question.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {i18n.t("questionInput.next")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
  centerGroup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary,
    // marginBottom: 10,
    textAlign: "center",
  },
  gradient: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 100,
  },
  gradientTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    opacity: 0.8,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    fontSize: 20,
    color: colors.textPrimary,
    textAlignVertical: "top",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#722FC0",
    borderStyle: "solid",
    elevation: 6,
    height: 74, // 고정 높이 설정
    minHeight: 74, // 최소 높이 보장
  },
  characterCount: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 8,
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 80,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    opacity: 0.2,
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
});

export default QuestionInputScreen;
