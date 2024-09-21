import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import zhJSON from './locale/zh-CN.json'
import enJSON from './locale/en-US.json'
import deJSON from './locale/de-DE.json'
import { getSetting } from './store/settings'

export const initI18n = async () => {
  const settings = await getSetting()

  return i18n.use(LanguageDetector).init({
    resources: {
      'en-US': {
        translation: enJSON,
      },
      'de-DE': {
        translation: deJSON,
      },
      'zh-CN': {
        translation: zhJSON,
      },
    },
    fallbackLng: 'en-US',
    lng: settings.lang || '',
  })
}
