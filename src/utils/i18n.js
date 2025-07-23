import * as Localization from "expo-localization";
import I18n from "i18n-js";

import ko from "../locales/ko.json";
import en from "../locales/en.json";

I18n.translations = { ko, en };
I18n.locale = Localization.locale;
I18n.fallbacks = true;
I18n.defaultLocale = "ko";

export default I18n;
