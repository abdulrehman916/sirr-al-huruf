import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SUPPORTED_LANGUAGES = ['ml', 'en', 'ar'];
const STORAGE_KEY = 'sirr_al_huruf_language';
const LANGUAGE_SET_KEY = 'sirr_al_huruf_language_set';

function detectDeviceLanguage() {
  try {
    const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (lang.startsWith('ml')) return 'ml';
    if (lang.startsWith('ar')) return 'ar';
    return 'en';
  } catch { return 'en'; }
}

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;
  } catch {}
  return detectDeviceLanguage();
}

function isLanguageSet() {
  try { return !!localStorage.getItem(LANGUAGE_SET_KEY); } catch { return false; }
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const [langSet, setLangSet] = useState(isLanguageSet);

  const setLanguage = useCallback((lang) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    setLangSet(true);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(LANGUAGE_SET_KEY, 'true');
    } catch {}
    // Apply RTL
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  // Apply on mount
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const value = { language, setLanguage, langSet, supportedLanguages: SUPPORTED_LANGUAGES };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export default I18nContext;