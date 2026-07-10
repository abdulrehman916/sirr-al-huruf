// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK LANGUAGE CONTEXT — 3-Language (ML / EN / TR)
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LanguageContext = createContext();

export function AstroClockLanguageProvider({ children }) {
  const [language, setLang] = useState(() => {
    let saved = localStorage.getItem("astroClockLanguage");
    if (saved === "tr") saved = "ar"; // GLOBAL UI LANGUAGE RULE: Turkish replaced by Arabic
    return saved || "ml";
  });

  useEffect(() => {
    localStorage.setItem("astroClockLanguage", language);
  }, [language]);

  const isMalayalam = language === "ml";
  const isEnglish = language === "en";
  const isArabic = language === "ar";

  const setLanguage = useCallback((lang) => setLang(lang), []);

  // Custom date override — persisted to localStorage so Historical Date Mode survives reloads
  const [customDate, setCustomDate] = useState(() => {
    try { const saved = localStorage.getItem("astroClockCustomDate"); return saved ? new Date(saved) : null; } catch { return null; }
  });
  const setCustomDatePersisted = useCallback((date) => {
    setCustomDate(date);
    try { if (date) localStorage.setItem("astroClockCustomDate", date.toISOString()); else localStorage.removeItem("astroClockCustomDate"); } catch {}
  }, []);
  const clearCustomDate = useCallback(() => {
    setCustomDate(null);
    try { localStorage.removeItem("astroClockCustomDate"); } catch {}
  }, []);
  const toggleLanguage = useCallback(() => {
    setLang(prev => prev === "ml" ? "en" : prev === "en" ? "ar" : "ml");
  }, []);

  // txt: returns Malayalam or English. Never returns Turkish.
  // Existing calls with a 3rd arg (legacy Turkish) are safely ignored.
  const txt = useCallback((ml, en) => {
    if (language === "ml") return ml;
    return en;
  }, [language]);

  // txtA: trilingual-aware — use when Arabic translation is available
  const txtA = useCallback((ml, en, ar) => {
    if (language === "ml") return ml;
    if (language === "ar") return ar || en;
    return en;
  }, [language]);

  // Legacy t object (kept for backward compat with old components)
  const t = {
    current: txt("മലയാളം", "English", "Türkçe"),
    toggle: txt("English", "മലയാളം", "Malayalam"),
    day: txt("ദിവസം", "Day", "Gün"),
    planetRuler: txt("ഗ്രഹ നാഥൻ", "Planet Ruler", "Gezegen Hükümdarı"),
    qualities: txt("ഗുണങ്ങൾ", "Qualities", "Özellikler"),
    warnings: txt("മുന്നറിയിപ്പുകൾ", "Warnings", "Uyarılar"),
    suitableActions: txt("ഉചിത പ്രവൃത്തികൾ", "Suitable Actions", "Uygun Eylemler"),
    note: txt("കുറിപ്പ്", "Note", "Not"),
    source: txt("സ്രോതസ്സ്", "Source", "Kaynak"),
    daytimeHours: txt("പകൽ 12 ഗ്രഹ മണിക്കൂറുകൾ", "Daytime 12 Planetary Hours", "Gündüz 12 Gezegen Saati"),
    nighttimeHours: txt("രാത്രി 12 ഗ്രഹ മണിക്കൂറുകൾ", "Nighttime 12 Planetary Hours", "Gece 12 Gezegen Saati"),
    hour: txt("മണിക്കൂർ", "Hour", "Saat"),
    time: txt("സമയം", "Time", "Zaman"),
    planet: txt("ഗ്രഹം", "Planet", "Gezegen"),
    sunrise: txt("സൂര്യോദയം", "Sunrise", "Güneş Doğuşu"),
    sunset: txt("സൂര്യാസ്തമയം", "Sunset", "Güneş Batışı"),
    moonPosition: txt("ചന്ദ്രന്റെ സ്ഥാനം", "Moon Position", "Ay Pozisyonu"),
    currentMansion: txt("നിലവിലെ നക്ഷത്രം", "Current Mansion", "Mevcut Menzil"),
    zodiacSign: txt("രാശി", "Zodiac Sign", "Burç"),
    degree: txt("ഡിഗ്രി", "Degree", "Derece"),
    lunarMansions: txt("ചാന്ദ്ര നക്ഷത്രങ്ങൾ", "Lunar Mansions", "Ay Menzilleri"),
    mansion: txt("നക്ഷത്രം", "Mansion", "Menzil"),
    zodiac: txt("രാശി", "Zodiac", "Burçlar"),
    suitable: txt("ഉചിതമായ പ്രവർത്തനങ്ങൾ", "Suitable Operations", "Uygun Çalışmalar"),
    planets: txt("ഗ്രഹങ്ങൾ", "Planets", "Gezegenler"),
    nature: txt("സ്വഭാവം", "Nature", "Doğa"),
    benefits: txt("ഗുണങ്ങൾ", "Benefits", "Faydalar"),
    spiritualOperations: txt("ആത്മിക പ്രവർത്തനങ്ങൾ", "Spiritual Operations", "Manevi Çalışmalar"),
    element: txt("മൂലകം", "Element", "Element"),
    gender: txt("ലിംഗം", "Gender", "Cinsiyet"),
    metal: txt("ലോഹം", "Metal", "Metal"),
    incense: txt("സുഗന്ധം", "Incense", "Tütsü"),
    friendlySigns: txt("സൌഹൃദ രാശികൾ", "Friendly Signs", "Dost Burçlar"),
    enemySigns: txt("ശത്രു രാശികൾ", "Enemy Signs", "Düşman Burçlar"),
    spiritualMeaning: txt("ആത്മിക അർത്ഥം", "Spiritual Meaning", "Manevi Anlam"),
    favorable: txt("അനുയോജ്യം", "Favorable", "Elverişli"),
    neutral: txt("സാധാരണ", "Neutral", "Nötr"),
    unfavorable: txt("പ്രതികൂലം", "Unfavorable", "Olumsuz"),
    ready: txt("തയ്യാറാണ്", "Ready", "Hazır"),
    traditionalSystem: txt("പാരമ്പര്യ വ്യവസ്ഥ", "Traditional System", "Geleneksel Sistem"),
  };

  return (
    <LanguageContext.Provider value={{ language, isMalayalam, isEnglish, isArabic, t, txt, txtA, toggleLanguage, setLanguage, customDate, setCustomDate: setCustomDatePersisted, clearCustomDate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAstroClockLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useAstroClockLanguage must be used within AstroClockLanguageProvider");
  return ctx;
}