import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {  // Ensure 'en' is correct
        translation: {
          nominees: {
            title: 'Select Your Nominee'
          }
        }
      },
      hi: {  // Use standard language code for Hindi
        translation: {
          nominees: {
            title: 'अपने नामांकित व्यक्ति का चयन करें'
          }
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;