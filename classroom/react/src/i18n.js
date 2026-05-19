import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from './locales/en/translation.json'
import hy from './locales/hy/translation.json'
import de from './locales/de/translation.json'

i18next.
use(initReactI18next).
init({
    resource: {
        en: {
            translation: en
        },
        hy: {
            translation: hy
        },
        de: {
            translation: de
        },
    },
    lng: localStorage.getItem("language"),
    fallbackLng : "en"
})

export default i18next