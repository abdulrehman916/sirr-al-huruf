// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK LANGUAGE CONTEXT
// Malayalam/English toggle — separate modes, no mixing
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function AstroClockLanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("astroClockLanguage");
    return saved || "ml"; // Default to Malayalam
  });

  useEffect(() => {
    localStorage.setItem("astroClockLanguage", language);
  }, [language]);

  const isMalayalam = language === "ml";
  
  // Comprehensive translations for ALL UI elements
  const t = {
    // Language selector
    current: isMalayalam ? "മലയാളം" : "English",
    toggle: isMalayalam ? "English" : "മലയാളം",
    
    // Common labels
    day: isMalayalam ? "ദിവസം" : "Day",
    planetRuler: isMalayalam ? "ഗ്രഹ നാഥൻ" : "Planet Ruler",
    qualities: isMalayalam ? "ഗുണങ്ങൾ" : "Qualities",
    warnings: isMalayalam ? "മുന്നറിയിപ്പുകൾ" : "Warnings",
    suitableActions: isMalayalam ? "ഉചിത പ്രവൃത്തികൾ" : "Suitable Actions",
    note: isMalayalam ? "കുറിപ്പ്" : "Note",
    source: isMalayalam ? "സ്രോതസ്സ്" : "Source",
    
    // Planetary hours
    daytimeHours: isMalayalam ? "പകൽ 12 ഗ്രഹ മണിക്കൂറുകൾ" : "Daytime 12 Planetary Hours",
    nighttimeHours: isMalayalam ? "രാത്രി 12 ഗ്രഹ മണിക്കൂറുകൾ" : "Nighttime 12 Planetary Hours",
    fromSunriseToSunset: isMalayalam ? "സൂര്യോദയം മുതൽ സൂര്യാസ്തമയം വരെ" : "From Sunrise to Sunset",
    fromSunsetToSunrise: isMalayalam ? "സൂര്യാസ്തമയം മുതൽ സൂര്യോദയം വരെ" : "From Sunset to Sunrise",
    hour: isMalayalam ? "മണിക്കൂർ" : "Hour",
    time: isMalayalam ? "സമയം" : "Time",
    planet: isMalayalam ? "ഗ്രഹം" : "Planet",
    duration: isMalayalam ? "ദൈർഘ്യം" : "Duration",
    goodActions: isMalayalam ? "ഉചിതം" : "Good Actions",
    sunrise: isMalayalam ? "സൂര്യോദയം" : "Sunrise",
    sunset: isMalayalam ? "സൂര്യാസ്തമയം" : "Sunset",
    
    // Moon status
    moonPosition: isMalayalam ? "ചന്ദ്രന്റെ സ്ഥാനം" : "Moon Position",
    currentMansion: isMalayalam ? "നിലവിലെ നക്ഷത്രം" : "Current Mansion",
    zodiacSign: isMalayalam ? "രാശി" : "Zodiac Sign",
    degree: isMalayalam ? "ഡിഗ്രി" : "Degree",
    
    // Manazil
    lunarMansions: isMalayalam ? "ചാന്ദ്ര നക്ഷത്രങ്ങൾ" : "Lunar Mansions",
    mansion: isMalayalam ? "നക്ഷത്രം" : "Mansion",
    zodiac: isMalayalam ? "രാശി" : "Zodiac",
    suitable: isMalayalam ? "ഉചിതമായ പ്രവർത്തനങ്ങൾ" : "Suitable Operations",
    
    // Planets
    planets: isMalayalam ? "ഗ്രഹങ്ങൾ" : "Planets",
    nature: isMalayalam ? "സ്വഭാവം" : "Nature",
    benefits: isMalayalam ? "ഗുണങ്ങൾ" : "Benefits",
    spiritualOperations: isMalayalam ? "ആത്മിക പ്രവർത്തനങ്ങൾ" : "Spiritual Operations",
    
    // Zodiac
    zodiac: isMalayalam ? "രാശി" : "Zodiac",
    element: isMalayalam ? "മൂലകം" : "Element",
    gender: isMalayalam ? "ലിംഗം" : "Gender",
    metal: isMalayalam ? "ലോഹം" : "Metal",
    incense: isMalayalam ? "സുഗന്ധം" : "Incense",
    friendlySigns: isMalayalam ? "സൌഹൃദ രാശികൾ" : "Friendly Signs",
    enemySigns: isMalayalam ? "ശത്രു രാശികൾ" : "Enemy Signs",
    spiritualMeaning: isMalayalam ? "ആത്മിക അർത്ഥം" : "Spiritual Meaning",
    
    // Incense
    incenseAdvisor: isMalayalam ? "സുഗന്ധ ഉപദേശം" : "Incense Advisor",
    planetaryIncense: isMalayalam ? "ഗ്രഹ സുഗന്ധങ്ങൾ" : "Planetary Incense",
    zodiacIncense: isMalayalam ? "രാശി സുഗന്ധങ്ങൾ" : "Zodiac Incense",
    howToUse: isMalayalam ? "ഉപയോഗം" : "How to Use",
    
    // Timing Advisor
    timingAdvisor: isMalayalam ? "സമയ ഉപദേശം" : "Timing Advisor",
    action: isMalayalam ? "പ്രവർത്തനം" : "Action",
    search: isMalayalam ? "തിരയുക" : "Search",
    bestDay: isMalayalam ? "മികച്ച ദിവസം" : "Best Day",
    bestHour: isMalayalam ? "മികച്ച മണിക്കൂർ" : "Best Hour",
    recommendation: isMalayalam ? "ശുപാർശ" : "Recommendation",
    
    // Birth Profile
    birthProfile: isMalayalam ? "ജനന വിശകലനം" : "Birth Profile Analyzer",
    dateOfBirth: isMalayalam ? "ജനന തീയതി" : "Date of Birth",
    timeOfBirth: isMalayalam ? "ജനന സമയം" : "Time of Birth",
    placeOfBirth: isMalayalam ? "ജനന സ്ഥലം" : "Place of Birth",
    calculate: isMalayalam ? "വിശകലനം ആരംഭിക്കുക" : "Calculate Birth Profile",
    optional: isMalayalam ? "ഐച്ഛികം" : "Optional",
    cityCountry: isMalayalam ? "നഗരം, രാജ്യം" : "City, Country",
    relations: isMalayalam ? "ബന്ധങ്ങൾ" : "Relations",
    compatibility: isMalayalam ? "അനുയോജ്യത" : "Compatibility",
    comparisonWithCurrentTime: isMalayalam ? "നിലവിലെ സമയവുമായുള്ള താരതമ്യം" : "Comparison With Current Time",
    livePlanetaryData: isMalayalam ? "തത്സമയ ഗ്രഹ നിലവാരം" : "Live Planetary Data",
    currentHour: isMalayalam ? "നിലവിലെ ഗ്രഹ മണിക്കൂർ" : "Current Hour",
    dayRuler: isMalayalam ? "ദിന നാഥൻ" : "Day Ruler",
    moon: isMalayalam ? "ചന്ദ്രൻ" : "Moon",
    direction: isMalayalam ? "ദിശ" : "Direction",
    compatible: isMalayalam ? "അനുയോജ്യ മൂലകങ്ങൾ" : "Compatible",
    incompatible: isMalayalam ? "അനുയോജ്യമല്ലാത്ത മൂലകങ്ങൾ" : "Incompatible",
    friendlyPlanets: isMalayalam ? "സൌഹൃദ ഗ്രഹങ്ങൾ" : "Friendly Planets",
    enemyPlanets: isMalayalam ? "ശത്രു ഗ്രഹങ്ങൾ" : "Enemy Planets",
    
    // Status
    favorable: isMalayalam ? "അനുയോജ്യം" : "Favorable",
    neutral: isMalayalam ? "സാധാരണ" : "Neutral",
    unfavorable: isMalayalam ? "പ്രതികൂലം" : "Unfavorable",
    ready: isMalayalam ? "തയ്യാറാണ്" : "Ready",
    traditionalSystem: isMalayalam ? "പാരമ്പര്യ വ്യവസ്ഥ" : "Traditional System"
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "ml" ? "en" : "ml");
  };

  return (
    <LanguageContext.Provider value={{ language, isMalayalam, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAstroClockLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useAstroClockLanguage must be used within AstroClockLanguageProvider");
  }
  return context;
}