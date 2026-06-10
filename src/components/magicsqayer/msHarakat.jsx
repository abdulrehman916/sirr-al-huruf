// ═══════════════════════════════════════════════════════════════
//  MS HARAKAT ENGINE
//  Vocalization engine for Magic Square Angel / Jinn names.
//  STRICT RULE: consonant sequence is IMMUTABLE — only diacritics added.
//
//  Four systems — fully separate, never mixed:
//    ar-angel  → suffix 41  = ئِيل   (Arabic)
//    ar-jinn   → suffix 319 = طِيشْ  (Arabic)
//    heb-angel → suffix 31  = אל     (Hebrew — no harakat)
//    heb-jinn  → suffix 329 = טכש    (Hebrew — no harakat)
//
//  Arabic root harakat: alternating Fatha/Sukun starting with Fatha.
//  Hebrew roots: plain consonant concatenation, no diacritics.
// ═══════════════════════════════════════════════════════════════

const FATHA = '\u064E'; // َ
const SUKUN = '\u0652'; // ْ

// Arabic suffixes
const ANGEL_SUFFIX = 'ئِيل'; // ئ + Kasra + ي + ل

// Arabic Jinn suffix: طِيشْ  (Kasra on ط, long ī via ي, Sukun on ش)
const JINN_SUFFIX = '\u0637\u0650\u064A\u0634\u0652'; // طِيشْ

// Hebrew suffixes (book values: אל = 31, טכש = 329)
const HEB_ANGEL_SUFFIX = 'אל';   // El
const HEB_JINN_SUFFIX  = 'טכש';  // Takesh

/**
 * vocalizeConsonants(consonants)
 * Applies alternating Fatha/Sukun (pos 0 → Fatha, pos 1 → Sukun, ...).
 * Used for Arabic names only. Consonant array is NEVER modified.
 */
export function vocalizeConsonants(consonants) {
  if (!consonants || consonants.length === 0) return '';
  return consonants.map((c, i) => c + (i % 2 === 0 ? FATHA : SUKUN)).join('');
}

/** Arabic Angel: vocalized root + ئِيل */
export function buildAngelName(consonants) {
  if (!consonants || consonants.length === 0) return ANGEL_SUFFIX;
  return vocalizeConsonants(consonants) + ANGEL_SUFFIX;
}

/** Arabic Jinn: vocalized root + طِيشْ (319) */
export function buildJinnName(consonants) {
  if (!consonants || consonants.length === 0) return JINN_SUFFIX;
  return vocalizeConsonants(consonants) + JINN_SUFFIX;
}

/** Hebrew Angel: plain root + אל (31) — no Arabic diacritics */
export function buildHebrewAngelName(consonants) {
  if (!consonants || consonants.length === 0) return HEB_ANGEL_SUFFIX;
  return consonants.join('') + HEB_ANGEL_SUFFIX;
}

/** Hebrew Jinn: plain root + טכש (329) — no Arabic diacritics */
export function buildHebrewJinnName(consonants) {
  if (!consonants || consonants.length === 0) return HEB_JINN_SUFFIX;
  return consonants.join('') + HEB_JINN_SUFFIX;
}