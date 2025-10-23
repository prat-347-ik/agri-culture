import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Loads translations from /public/locales
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en', // Use English if a translation is missing
    debug: true, // Logs info to console (good for development)

    // Where to find the translation files
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;