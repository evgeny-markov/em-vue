import { createI18n } from "vue-i18n";
import ru from "@/locales/ru.json";
import en from "@/locales/en.json";

const SUPPORT_LOCALES = ["ru", "en"];
const STORAGE_KEY = "locale";

function readStoredLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORT_LOCALES.includes(stored)) {
      return stored;
    }
  } catch {
    return null;
  }

  return null;
}

function writeStoredLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Safari private mode and blocked storage should not break the app.
  }
}

function detectLocale() {
  const stored = readStoredLocale();
  if (stored) {
    return stored;
  }

  const navigatorLocale = typeof navigator !== "undefined" ? navigator.language : "";
  return navigatorLocale.toLowerCase().startsWith("en") ? "en" : "ru";
}

export function persistLocale(locale) {
  writeStoredLocale(locale);
  document.documentElement.setAttribute("lang", locale);
}

const locale = detectLocale();

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: "ru",
  messages: { ru, en },
});

persistLocale(locale);

export default i18n;
