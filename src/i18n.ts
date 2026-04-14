import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  en: {
    translation: {
      "nav": {
        "solutions": "Solutions",
        "workspaces": "Workspaces",
        "partner": "Partner with Us",
        "getInTouch": "Get in Touch",
        "signIn": "Sign in"
      },
      "common": {
        "loading": "Loading...",
        "error": "Something went wrong"
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "solutions": "????????",
        "workspaces": "????? ?????",
        "partner": "????? ????",
        "getInTouch": "????? ????",
        "signIn": "????? ???????"
      },
      "common": {
        "loading": "????...",
        "error": "?? ??? ????"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
