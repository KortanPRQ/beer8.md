import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import ro from './locales/ro.json';
import en from './locales/en.json';

const savedLanguage = localStorage.getItem('language') || 
  (navigator.language.split('-')[0] === 'ru' ? 'ru' : 
   navigator.language.split('-')[0] === 'ro' ? 'ro' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      ro: { translation: ro },
      en: { translation: en }
    },
    lng: savedLanguage,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
