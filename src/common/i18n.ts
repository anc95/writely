import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhJSON from './locale/zh-CN.json';
import enJSON from './locale/en-US.json';
import { getSetting } from './store/settings';

export const initI18n = async () => {
  const settings = await getSetting();

  console.log(settings, 'settings');

  return i18n.use(LanguageDetector).init({
    resources: {
      'en-US': {
        translation: enJSON,
      },
      'zh-CN': {
        translation: zhJSON,
      },
    },
    fallbackLng: 'en-US',
    lng: settings.lang || '',
  });
};
