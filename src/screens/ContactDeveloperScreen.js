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
import i18n from "../utils/i18n";

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
      Alert.alert(i18n.t("contact.alertTitle"), i18n.t("contact.alertEmpty"));
      return;
    }

    setIsSending(true);

    try {
      // 메일 앱을 통해 이메일 전송
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          i18n.t("contact.errorTitle"),
          i18n.t("contact.mailUnavailable"),
          [{ text: i18n.t("contact.ok") }]
        );
        return;
      }

      const result = await MailComposer.composeAsync({
        recipients: ["mhjun01@gmail.com", "hijennkim@gmail.com"],
        subject: i18n.t("contact.mailSubject"),
        body: `${i18n.t("contact.mailBody")}:\n\n${feedback}\n\n${i18n.t(
          "contact.sendTime"
        )}: ${new Date().toLocaleString()}`,
      });

      if (result.status === "sent") {
        Alert.alert(
          i18n.t("contact.sendComplete"),
          i18n.t("contact.sendThanks"),
          [
            {
              text: i18n.t("contact.ok"),
              onPress: () => {
                setFeedback("");
                navigation.goBack();
              },
            },
          ]
        );
      } else if (result.status === "cancelled") {
        Alert.alert(
          i18n.t("contact.cancelled"),
          i18n.t("contact.mailCancelled")
        );
      } else {
        throw new Error(i18n.t("contact.sendFail"));
      }
    } catch (error) {
      Alert.alert(
        i18n.t("contact.sendFail"),
        `${i18n.t("contact.sendFailMsg")}\n${i18n.t("contact.error")}: ${
          error.message
        }\n${i18n.t("contact.retry")}`,
        [
          {
            text: i18n.t("contact.ok"),
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
              source={require("../../assets/close-icon.png")}
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
            {i18n.t("more.contact")}
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
              <Text style={styles.title}>{i18n.t("more.contact")}</Text>
            </View>

            {/* 설명 텍스트 */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{i18n.t("contact.desc")}</Text>
            </View>

            {/* 피드백 입력 영역 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.feedbackInput}
                placeholder={i18n.t("contact.placeholder")}
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
                  {isSending
                    ? i18n.t("contact.sending")
                    : i18n.t("contact.send")}
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
