import i18n from "i18next";
import global_en from "./Translations/en/global.json";
import global_am from "./Translations/am/global.json";

i18n.init({
  compatibilityJSON: 'v3',
  lng: "am", // default language
  fallbackLng: "en", // fallback if the selected language doesn't have translation
  resources: {
    en: { global: global_en },
    am: { global: global_am },
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
