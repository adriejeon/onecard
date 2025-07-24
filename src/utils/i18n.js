import * as Localization from "expo-localization";
import I18n from "i18n-js";

import ko from "../locales/ko.json";
import en from "../locales/en.json";

I18n.translations = { ko, en };

// 디바이스 언어 감지 및 설정 (안전한 방식)
let languageCode = "en"; // 기본값

try {
  const deviceLocale = Localization.locale;
  if (deviceLocale && typeof deviceLocale === "string") {
    languageCode = deviceLocale.split("-")[0]; // 'ko-KR' -> 'ko', 'en-US' -> 'en'
  }
} catch (error) {}

// 지원하는 언어인지 확인하고 설정
if (I18n.translations[languageCode]) {
  I18n.locale = languageCode;
} else {
  I18n.locale = "en"; // 지원하지 않는 언어는 영어로 fallback
}

I18n.fallbacks = true;
I18n.defaultLocale = "en"; // 기본 언어를 영어로 변경

export default I18n;
