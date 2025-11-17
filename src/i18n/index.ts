import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import bn from './bn';
import en from './en';

const LANGUAGE_STORAGE_KEY = '@quran_app_language';

// Get device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

// Initialize i18n
const initI18n = async () => {
  // Try to load saved language preference
  let savedLanguage = deviceLanguage;
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) {
      savedLanguage = saved;
    }
  } catch (error) {
    console.error('Failed to load language preference:', error);
  }

  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      resources: {
        en,
        bn,
      },
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

// Save language preference
export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};

export { initI18n };
export default i18n;
