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
} from "react-native";
import { colors } from "../styles/colors";
import { commonStyles } from "../styles/common";

const QuestionInputScreen = ({ navigation }) => {
  const [question, setQuestion] = useState("");

  const handleNext = () => {
    if (question.trim()) {
      navigation.navigate("CardDraw", { question: question.trim() });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>질문을 입력하세요</Text>
          <Text style={styles.subtitle}>
            예/아니오로 답할 수 있는 질문을 작성해주세요
          </Text>
        </View>

        {/* 질문 입력 영역 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>질문</Text>
          <TextInput
            style={styles.textInput}
            value={question}
            onChangeText={setQuestion}
            placeholder="예: 오늘 고백할까요?"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={100}
          />
          <Text style={styles.characterCount}>{question.length}/100</Text>
        </View>

        {/* 예시 질문들 */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>예시 질문</Text>
          <View style={styles.exampleItems}>
            <Text style={styles.exampleItem}>• 오늘 고백할까요?</Text>
            <Text style={styles.exampleItem}>• 숙제를 할까요?</Text>
            <Text style={styles.exampleItem}>• 여행을 갈까요?</Text>
            <Text style={styles.exampleItem}>• 새로운 것을 시도해볼까요?</Text>
          </View>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !question.trim() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!question.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>뒤로가기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradientStart,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    opacity: 0.8,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 40,
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
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  characterCount: {
    fontSize: 14,
    color: colors.textLight,
    opacity: 0.6,
    textAlign: "right",
    marginTop: 8,
  },
  examplesContainer: {
    marginBottom: 40,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 15,
  },
  exampleItems: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  exampleItem: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 15,
  },
  nextButton: {
    backgroundColor: colors.textLight,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.8,
  },
});

export default QuestionInputScreen;
