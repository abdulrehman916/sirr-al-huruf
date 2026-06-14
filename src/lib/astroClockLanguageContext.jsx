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
  const t = {
    current: isMalayalam ? "മലയാളം" : "English",
    toggle: isMalayalam ? "English" : "മലയാളം"
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