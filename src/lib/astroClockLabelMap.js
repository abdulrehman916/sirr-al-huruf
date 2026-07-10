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