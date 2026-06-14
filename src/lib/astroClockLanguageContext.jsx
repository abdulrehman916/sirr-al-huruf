/**
 * ASTRO CLOCK LANGUAGE CONTEXT
 * Malayalam ↔ English toggle for Astro Clock module only
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AstroClockLanguageContext = createContext();

export const LANGUAGES = {
  MALAYALAM: 'ml',
  ENGLISH: 'en'
};

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE LABELS — All Astro Clock UI text
// ─────────────────────────────────────────────────────────────────────────────
export const UI_LABELS = {
  [LANGUAGES.MALAYALAM]: {
    // Header
    astro_clock: "ജ്യോതിഷ ഘടികാരം",
    subtitle: "ഗ്രഹ-നക്ഷത്ര സമയ ക്രമീകരണം",
    
    // Live System
    live_system: "ലൈവ് സിസ്റ്റം",
    current_date: "തീയതി",
    current_time: "സമയം",
    current_planetary_hour: "നിലവിലെ ഗ്രഹ മണിക്കൂർ",
    remaining_time: "ബാക്കി സമയം",
    next_hour: "അടുത്ത മണിക്കൂർ",
    current_day_ruler: "ദിവസ നാഥൻ",
    current_moon: "ചന്ദ്രൻ",
    current_lunar_mansion: "നക്ഷത്രം",
    
    // Day System
    day_system: "ദിവസ വ്യവസ്ഥ",
    day_ruler: "ദിവസ നാഥൻ",
    planet: "ഗ്രഹം",
    benefits: "ഗുണങ്ങൾ",
    warnings: "മുന്നറിയിപ്പുകൾ",
    suitable_actions: "ഉചിതമായ കാര്യങ്ങൾ",
    unsuitable_actions: "അനുചിതമായ കാര്യങ്ങൾ",
    
    // Planetary Hours
    planetary_hours: "ഗ്രഹ മണിക്കൂറുകൾ",
    hour_number: "മണിക്കൂർ",
    start_time: "തുടക്കം",
    end_time: "അവസാനം",
    duration: "ദൈർഘ്യം",
    lunar_mansion: "നക്ഷത്രം",
    star: "നക്ഷത്രം",
    spiritual_operations: "ആദ്ധ്യാത്മിക കൃത്യങ്ങൾ",
    source_book: "ഗ്രന്ഥം",
    page_number: "പുറം",
    
    // Actions
    select_day: "ദിവസം തിരഞ്ഞെടുക്കുക",
    view_hours: "മണിക്കൂറുകൾ കാണുക",
    close: "അടയ്ക്കുക",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    
    // Planet Names
    sun: "സൂര്യൻ",
    moon: "ചന്ദ്രൻ",
    mars: "ചൊവ്വ",
    mercury: "ബുധൻ",
    jupiter: "ഗുരു",
    venus: "ശുക്രൻ",
    saturn: "ശനി",
    
    // Day Names
    sunday: "ഞായർ",
    monday: "തിങ്കൾ",
    tuesday: "ചൊവ്വ",
    wednesday: "ബുധൻ",
    thursday: "വ്യാഴം",
    friday: "വെള്ളി",
    saturday: "ശനി"
  },
  
  [LANGUAGES.ENGLISH]: {
    // Header
    astro_clock: "Astro Clock",
    subtitle: "Planetary & Celestial Timing Framework",
    
    // Live System
    live_system: "Live System",
    current_date: "Date",
    current_time: "Time",
    current_planetary_hour: "Current Planetary Hour",
    remaining_time: "Remaining Time",
    next_hour: "Next Hour",
    current_day_ruler: "Day Ruler",
    current_moon: "Moon",
    current_lunar_mansion: "Lunar Mansion",
    
    // Day System
    day_system: "Day System",
    day_ruler: "Day Ruler",
    planet: "Planet",
    benefits: "Benefits",
    warnings: "Warnings",
    suitable_actions: "Suitable Actions",
    unsuitable_actions: "Unsuitable Actions",
    
    // Planetary Hours
    planetary_hours: "Planetary Hours",
    hour_number: "Hour",
    start_time: "Start",
    end_time: "End",
    duration: "Duration",
    lunar_mansion: "Lunar Mansion",
    star: "Star",
    spiritual_operations: "Spiritual Operations",
    source_book: "Source Book",
    page_number: "Page",
    
    // Actions
    select_day: "Select Day",
    view_hours: "View Hours",
    close: "Close",
    loading: "Loading...",
    
    // Planet Names
    sun: "Sun",
    moon: "Moon",
    mars: "Mars",
    mercury: "Mercury",
    jupiter: "Jupiter",
    venus: "Venus",
    saturn: "Saturn",
    
    // Day Names
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday"
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function AstroClockLanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('astroClockLanguage') : null;
    return saved || LANGUAGES.MALAYALAM;
  });

  useEffect(() => {
    localStorage.setItem('astroClockLanguage', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === LANGUAGES.MALAYALAM ? LANGUAGES.ENGLISH : LANGUAGES.MALAYALAM);
  };

  const t = (key) => {
    return UI_LABELS[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isMalayalam: language === LANGUAGES.MALAYALAM,
    isEnglish: language === LANGUAGES.ENGLISH
  };

  return (
    <AstroClockLanguageContext.Provider value={value}>
      {children}
    </AstroClockLanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────
export function useAstroClockLanguage() {
  const context = useContext(AstroClockLanguageContext);
  if (!context) {
    throw new Error('useAstroClockLanguage must be used within AstroClockLanguageProvider');
  }
  return context;
}