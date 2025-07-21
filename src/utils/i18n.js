import * as Localization from "expo-localization";
import * as i18n from "i18n-js";

import ko from "../locales/ko.json";
import en from "../locales/en.json";

i18n.translations = { ko, en };
i18n.locale = Localization.locale;
i18n.fallbacks = true;
i18n.defaultLocale = "ko";

export default i18n;
