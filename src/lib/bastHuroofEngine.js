// ═══════════════════════════════════════════════════════════════
// BASTHUL HUROOF DEDICATED ENGINE
// Completely independent — does NOT import from any other engine.
// Bast table values will be filled in when provided.
// ═══════════════════════════════════════════════════════════════

// ── Arabic letter extraction ──────────────────────────────────
// Strips everything except bare Arabic letters.
// Handles hamza variants, alef maddah, alef wasla.
function extractArabicLetters(text) {
  if (!text) return [];

  // Strip diacritics, tatweel, noise — leave only base Arabic letters
  const cleaned = text
    .replace(/[\u064B-\u065F]/g, '')   // tashkeel
    .replace(/\u0640/g, '')            // tatweel (kashida)
    .replace(/\u0670/g, '')            // superscript alef
    .replace(/[\u0600-\u0605]/g, '')   // Arabic number signs
    .replace(/[\u0610-\u061A]/g, '')   // Arabic sign marks
    .replace(/[\u200B-\u200F]/g, '')   // zero-width chars
    .replace(/[\u202A-\u202E]/g, '')   // bidi embedding
    .replace(/[\uFE70-\uFEFF]/g, '');  // presentation forms noise

  // Match Arabic letters only (U+0621–U+063A, U+0641–U+064A)
  const matches = cleaned.match(/[\u0621-\u063A\u0641-\u064A]/g);
  return matches || [];
}

// ── Normalization map (hamza variants → base form) ────────────
const NORM_MAP = {
  'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا',
  'ى': 'ي', 'ئ': 'ي',
  'ؤ': 'و',
  'ة': 'ه',
};

function normalize(ch) {
  return NORM_MAP[ch] || ch;
}

// ── Bast level keys ───────────────────────────────────────────
export const BAST_LEVELS = [
  { key: 1, label: "Bast-i Evvel",  arabic: "بسط الأول",  short: "1" },
  { key: 2, label: "Bast-i Sani",   arabic: "بسط الثاني", short: "2" },
  { key: 3, label: "Bast-i Salis",  arabic: "بسط الثالث", short: "3" },
  { key: 4, label: "Bast-i Rabi",   arabic: "بسط الرابع", short: "4" },
  { key: 5, label: "Bast-i Hamis",  arabic: "بسط الخامس", short: "5" },
];

// ── DEDICATED BAST TABLE ──────────────────────────────────────
// Values to be filled in when provided.
// Keys are normalized Arabic letters (28 base letters).
// Each letter maps to an object with levels 1–5.
// PLACEHOLDER — replace values when the real table is supplied.
export const BAST_HUROOF_TABLE = {
  // letter: { 1: val, 2: val, 3: val, 4: val, 5: val }
  'ا': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ب': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ج': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'د': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ه': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'و': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ز': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ح': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ط': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ي': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ك': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ل': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'م': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ن': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'س': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ع': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ف': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ص': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ق': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ر': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ش': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ت': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ث': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'خ': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ذ': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ض': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'ظ': { 1: null, 2: null, 3: null, 4: null, 5: null },
  'غ': { 1: null, 2: null, 3: null, 4: null, 5: null },
};

// ── Main calculation function ─────────────────────────────────
/**
 * Calculate Bast values for Arabic text at a given level.
 * @param {string} text  — raw Arabic input (any content)
 * @param {number} level — 1 | 2 | 3 | 4 | 5
 * @returns {{ entries: Array, total: number|null, letterCount: number, unknownLetters: string[] }}
 */
export function calcBastHuroof(text, level = 1) {
  const rawLetters = extractArabicLetters(text);
  const unknownLetters = [];

  const entries = rawLetters.map((original) => {
    const norm  = normalize(original);
    const row   = BAST_HUROOF_TABLE[norm];
    const value = row ? row[level] : null;

    if (!row) unknownLetters.push(original);

    return { original, normalized: norm, value };
  });

  // Total is null while any entry still has a null value (table not filled yet)
  const hasNulls = entries.some(e => e.value === null);
  const total    = hasNulls
    ? null
    : entries.reduce((s, e) => s + e.value, 0);

  return {
    entries,
    total,
    letterCount: entries.length,
    unknownLetters: [...new Set(unknownLetters)],
    isPending: hasNulls,
  };
}