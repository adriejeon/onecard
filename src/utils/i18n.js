import * as Localization from "expo-localization";
import I18n from "i18n-js";
import { Platform, NativeModules } from "react-native";

import ko from "../locales/ko.json";
import en from "../locales/en.json";

I18n.translations = { ko, en };

// 디바이스 언어 감지 및 설정
let languageCode = "ko"; // 기본값을 한국어로 변경

try {
  // 1. expo-localization 시도
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
              deviceLocale = NativeModules.SettingsManager.settings.AppleLocale;
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
I18n.locale = languageCode;
I18n.fallbacks = true;
I18n.defaultLocale = "ko";

export default I18n;
