import * as Localization from "expo-localization";
import I18n from "i18n-js";
import { Platform, NativeModules } from "react-native";
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
  // 1. 저장된 언어 설정 확인
  const storedLanguage = await getStoredLanguage();
  if (storedLanguage && I18n.translations[storedLanguage]) {
    languageCode = storedLanguage;
    I18n.locale = languageCode;
    return;
  }

  // 2. 저장된 설정이 없으면 디바이스 언어 감지
  try {
    // expo-localization 시도
    let deviceLocale = Localization.locale;

    // 2. expo-localization이 실패하면 더 강력한 방법 시도
    if (!deviceLocale || deviceLocale === "undefined") {
      try {
        // iOS에서 더 직접적인 접근
        if (Platform.OS === "ios") {
          // SettingsManager 직접 접근
          if (NativeModules.SettingsManager) {
            // getConstants 메서드 사용
            try {
              const constants = NativeModules.SettingsManager.getConstants();

              if (constants && constants.settings) {
                // AppleLanguages를 우선적으로 확인 (첫 번째 언어가 사용자 선호 언어)
                if (
                  constants.settings.AppleLanguages &&
                  constants.settings.AppleLanguages.length > 0
                ) {
                  deviceLocale = constants.settings.AppleLanguages[0];
                }
                // AppleLocale 시도
                else if (constants.settings.AppleLocale) {
                  deviceLocale = constants.settings.AppleLocale;
                }
              }
            } catch (constantsError) {
              // getConstants 실패 시 무시
            }

            // settings 객체 직접 접근 시도
            if (!deviceLocale && NativeModules.SettingsManager.settings) {
              if (
                NativeModules.SettingsManager.settings.AppleLanguages &&
                NativeModules.SettingsManager.settings.AppleLanguages.length > 0
              ) {
                deviceLocale =
                  NativeModules.SettingsManager.settings.AppleLanguages[0];
              } else if (NativeModules.SettingsManager.settings.AppleLocale) {
                deviceLocale =
                  NativeModules.SettingsManager.settings.AppleLocale;
              }
            }
          }

          // 다른 방법들도 시도
          if (!deviceLocale) {
            // NSLocale.currentLocale 시뮬레이션
            const currentDate = new Date();
            const localeString = currentDate.toLocaleDateString();

            // 간단한 한국어 감지 (날짜 형식으로)
            if (
              localeString.includes("년") ||
              localeString.includes("월") ||
              localeString.includes("일")
            ) {
              deviceLocale = "ko-KR";
            }
          }
        }
        // Android에서 더 직접적인 접근
        else if (Platform.OS === "android") {
          if (NativeModules.I18nManager) {
            if (NativeModules.I18nManager.localeIdentifier) {
              deviceLocale = NativeModules.I18nManager.localeIdentifier;
            }
          }
        }
      } catch (fallbackError) {
        // 강력한 감지 실패 시 무시
      }
    }

    if (deviceLocale && typeof deviceLocale === "string") {
      // 더 정확한 언어 감지
      const detectedLanguage = deviceLocale.split("-")[0].toLowerCase();

      // 지원하는 언어인지 확인
      if (I18n.translations[detectedLanguage]) {
        languageCode = detectedLanguage;
      } else {
        // 한국어 관련 언어 코드들 처리
        if (detectedLanguage === "ko" || deviceLocale.includes("ko")) {
          languageCode = "ko";
        } else {
          languageCode = "en"; // 영어로 fallback
        }
      }
    } else {
      // 유효한 로케일이 없으면 기본값 사용
    }
  } catch (error) {
    languageCode = "en"; // 에러 시 영어로 fallback
  }

  // 최종 언어 설정
  languageCode = languageCode || "ko";
  I18n.locale = languageCode;
};

// 초기 언어 설정
let languageCode = "ko"; // 기본값을 한국어로 변경

// 최종 언어 설정
I18n.locale = languageCode;
I18n.fallbacks = true;
I18n.defaultLocale = "ko";

export default I18n;
