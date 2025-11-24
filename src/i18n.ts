import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import httpApi from 'i18next-http-backend';

i18n
  .use(httpApi) // ✅ Load translations from backend
  .use(LanguageDetector) // ✅ Detect language
  .use(initReactI18next) // ✅ Initialize react-i18next
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
      detection: {
  order: ['querystring', 'localStorage', 'cookie', 'navigator'],
  lookupQuerystring: 'lang',
  caches: [], // Do not cache unless you want it
},
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // ✅ Corrected path (public folder)
    },
  });

export default i18n;
