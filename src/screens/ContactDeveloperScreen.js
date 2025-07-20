import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import * as MailComposer from "expo-mail-composer";

import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";

const ContactDeveloperScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSendFeedback = async () => {
    if (feedback.trim() === "") {
      Alert.alert("알림", "의견을 입력해주세요.");
      return;
    }

    setIsSending(true);

    try {
      // 메일 앱을 통해 이메일 전송
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert("오류", "이 기기에서는 메일 앱을 사용할 수 없습니다.", [
          { text: "확인" },
        ]);
        return;
      }

      const result = await MailComposer.composeAsync({
        recipients: ["mhjun01@gmail.com", "hijennkim@gmail.com"],
        subject: "원카드 앱 - 사용자 의견",
        body: `사용자 의견:\n\n${feedback}\n\n전송 시간: ${new Date().toLocaleString()}`,
      });

      console.log("메일 전송 결과:", result);

      if (result.status === "sent") {
        Alert.alert(
          "전송 완료",
          "소중한 의견을 보내주셔서 감사합니다. 관리자가 확인 후 답변드리겠습니다!",
          [
            {
              text: "확인",
              onPress: () => {
                setFeedback("");
                navigation.goBack();
              },
            },
          ]
        );
      } else if (result.status === "cancelled") {
        Alert.alert("취소됨", "메일 전송이 취소되었습니다.");
      } else {
        throw new Error("전송 실패");
      }
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      console.error("에러 상세:", error.message);
      Alert.alert(
        "전송 실패",
        `이메일 전송에 실패했습니다.\n에러: ${error.message}\n다시 시도해주세요.`,
        [
          {
            text: "확인",
          },
        ]
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
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
        <View style={[commonStyles.header, { position: "relative" }]}>
          <TouchableOpacity
            style={[commonStyles.backButton, { zIndex: 2 }]}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/back-icon.png")}
              style={commonStyles.backIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
          <Text
            style={[
              commonStyles.headerTitle,
              {
                position: "absolute",
                left: 0,
                right: 0,
                top: 60,
                zIndex: 1,
              },
            ]}
          >
            개발자에게 문의하기
          </Text>
          <View style={[commonStyles.infoButton, { zIndex: 2 }]} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* 타이틀 영역 */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>어떤 문의를 남기시겠습니까?</Text>
            </View>

            {/* 설명 텍스트 */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                자유롭게 의견을 남겨주세요. 모든 의견을 꼼꼼히 듣고 더 좋은
                앱으로 개선하겠습니다. 언제나 감사합니다.
              </Text>
            </View>

            {/* 피드백 입력 영역 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.feedbackInput}
                placeholder="의견을 자유롭게 작성해주세요..."
                placeholderTextColor={colors.textSecondary}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text style={styles.characterCount}>{feedback.length}/1000</Text>
            </View>

            {/* 의견 보내기 버튼 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  commonStyles.startButton,
                  (feedback.trim() === "" || isSending) &&
                    commonStyles.nextButtonDisabled,
                ]}
                onPress={handleSendFeedback}
                activeOpacity={0.8}
                disabled={feedback.trim() === "" || isSending}
              >
                <Text style={commonStyles.startButtonText}>
                  {isSending ? "전송 중..." : "의견 보내기"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 32,
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 30,
  },
  feedbackInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 8,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});

export default ContactDeveloperScreen;
