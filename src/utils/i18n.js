import I18n from "i18n-js";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ko from "../locales/ko.json";
import en from "../locales/en.json";

I18n.translations = { ko, en };

// 언어 설정 키
const LANGUAGE_STORAGE_KEY = "selected_language";

// 언어 설정 함수들
export const setLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    I18n.locale = language;
    // 언어 변경 이벤트 발생 (Context에서 감지)
    if (global.languageChangeCallback) {
      global.languageChangeCallback(language);
    }
  } catch (error) {
    console.error("언어 설정 저장 실패:", error);
  }
};

export const getStoredLanguage = async () => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.error("저장된 언어 설정 불러오기 실패:", error);
    return null;
  }
};

// 언어 초기화 함수
export const initializeLanguage = async () => {
  let languageCode = "ko"; // 기본값 설정

  // 1. 저장된 언어 설정 확인
  const storedLanguage = await getStoredLanguage();
  if (storedLanguage && I18n.translations[storedLanguage]) {
    languageCode = storedLanguage;
    I18n.locale = languageCode;
    return;
  }

  // 2. 저장된 설정이 없으면 기본값 사용 (안전한 방법)
  try {
    // 간단한 언어 감지 (안전한 방법)
    const deviceLocale =
      Platform.OS === "ios"
        ? "ko" // iOS는 기본적으로 한국어로 설정
        : "ko"; // Android도 기본적으로 한국어로 설정

    languageCode = deviceLocale;
  } catch (error) {
    languageCode = "ko"; // 에러 시 한국어로 fallback
  }

  // 최종 언어 설정
  I18n.locale = languageCode;
};

// 초기 언어 설정
let languageCode = "ko"; // 기본값을 한국어로 변경

// 최종 언어 설정
I18n.locale = languageCode;
I18n.fallbacks = true;
I18n.defaultLocale = "ko";

export default I18n;
