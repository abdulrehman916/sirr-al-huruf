/**
 * ASTRO CLOCK LABEL MAP — Turkish-to-Arabic display mapping
 * Display-only utility. Does NOT modify any engine, calculation, or data file.
 * Maps Turkish mansion/zodiac labels from Havâss data to Arabic for UI display.
 */

export function natureToArabic(genelHukum) {
  if (!genelHukum) return "—";
  const lower = genelHukum.toLowerCase();
  if (lower.includes("nahs") || lower.includes("uğursuz")) return "نحس";
  if (lower.includes("saad") || lower.includes("sa'd") || lower.includes("uğurlu")) return "سعد";
  if (lower.includes("karışık")) return "مختلط";
  return "—";
}

export function isNahsNature(genelHukum) {
  if (!genelHukum) return false;
  const lower = genelHukum.toLowerCase();
  return lower.includes("nahs") || lower.includes("uğursuz");
}

const ZODIAC_TR_TO_AR = {
  "koç": "الحمل", "boğa": "الثور", "ikizler": "الجوزاء",
  "yengeç": "السرطان", "aslan": "الأسد", "başak": "العذراء",
  "terazi": "الميزان", "akrep": "العقرب", "yay": "القوس",
  "oğlak": "الجدي", "kova": "الدلو", "balık": "الحوت",
};

export function zodiacToArabic(zodiacSign) {
  if (!zodiacSign) return "—";
  return ZODIAC_TR_TO_AR[zodiacSign.toLowerCase()] || "—";
}

export function extractDegree(baslamaSiniri) {
  if (!baslamaSiniri) return "";
  const match = baslamaSiniri.match(/(\d+)/);
  return match ? match[1] : "";
}

// ── Malayalam zodiac names (standard Kerala rashi names) ──
const ZODIAC_TR_TO_ML = {
  "koç": "മേടം", "boğa": "ഇടവം", "ikizler": "മിഥുനം",
  "yengeç": "കർക്കടകം", "aslan": "ചിങ്ങം", "başak": "കന്നി",
  "terazi": "തുലാം", "akrep": "വൃശ്ചികം", "yay": "ധനു",
  "oğlak": "മകരം", "kova": "കുംഭം", "balık": "മീനം",
};

const ZODIAC_EN_TO_ML = {
  "aries": "മേടം", "taurus": "ഇടവം", "gemini": "മിഥുനം",
  "cancer": "കർക്കടകം", "leo": "ചിങ്ങം", "virgo": "കന്നി",
  "libra": "തുലാം", "scorpio": "വൃശ്ചികം", "sagittarius": "ധനു",
  "capricorn": "മകരം", "aquarius": "കുംഭം", "pisces": "മീനം",
};

const ELEMENT_EN_TO_ML = {
  "Fire": "അഗ്നി", "Earth": "ഭൂമി", "Air": "വായു", "Water": "വെള്ളം",
};

export function zodiacToML(zodiacSign) {
  if (!zodiacSign) return "—";
  const lower = zodiacSign.toLowerCase();
  return ZODIAC_TR_TO_ML[lower] || ZODIAC_EN_TO_ML[lower] || "—";
}

export function zodiacEnToML(nameEn) {
  if (!nameEn) return "—";
  return ZODIAC_EN_TO_ML[nameEn.toLowerCase()] || "—";
}

export function natureToML(genelHukum) {
  if (!genelHukum) return "—";
  const lower = genelHukum.toLowerCase();
  if (lower.includes("nahs") || lower.includes("uğursuz")) return "നഹ്സ്";
  if (lower.includes("saad") || lower.includes("sa'd") || lower.includes("uğurlu") || lower.includes("uygun")) return "സഅദ്";
  if (lower.includes("karışık")) return "മിശ്രം";
  return "—";
}

export function signsToML(signs) {
  if (!signs || !signs.length) return [];
  return signs.map(s => ZODIAC_EN_TO_ML[s.toLowerCase()] || s);
}

export function elementToML(element) {
  if (!element) return "—";
  return ELEMENT_EN_TO_ML[element] || element;
}

// ── Planet Malayalam display: ML transliteration (ML meaning) ──
// Format: "ശംസ് (സൂര്യൻ)" — Malayalam transliteration of Arabic term + Malayalam meaning
export const PLANET_ML_PARTS = {
  sun:     { reading: "ശംസ്",    meaning: "സൂര്യൻ" },
  moon:    { reading: "ഖമർ",     meaning: "ചന്ദ്രൻ" },
  mars:    { reading: "മിരീഖ്",   meaning: "ചൊവ്വാഗ്രഹം" },
  mercury: { reading: "ഉതാരിദ്",  meaning: "ബുധഗ്രഹം" },
  jupiter: { reading: "മുഷ്തരി",  meaning: "വ്യാഴഗ്രഹം" },
  venus:   { reading: "സുഹ്റ",    meaning: "ശുക്രഗ്രഹം" },
  saturn:  { reading: "സുഹൽ",     meaning: "ശനിഗ്രഹം" },
};

export function planetMLDisplay(planetKey) {
  const parts = PLANET_ML_PARTS[planetKey];
  if (!parts) return null;
  return `${parts.reading} (${parts.meaning})`;
}