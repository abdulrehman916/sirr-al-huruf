// ═══════════════════════════════════════════════════════════════
// BASTI ADEDİ CEDVELİ — DEDICATED BAST DATA TABLE
// Source: Basti Adedi Cedveli (manuscript)
// Used ONLY by: lib/bastHuroofEngine.js → pages/BastHuroofPage.jsx
// ---------------------------------------------------------------
// DO NOT import this file into any other engine or page.
// DO NOT derive values from Abjad, Mizan, or any other system.
// All values must be entered directly from the source table.
// ═══════════════════════════════════════════════════════════════

/**
 * BAST_DATA — One row per Arabic base letter (28 letters).
 *
 * Fields:
 *   letter     — normalized Arabic letter (key used by the engine)
 *   name       — Arabic letter name (for display in UI)
 *   bastEvvel  — Bast-i Evvel  (Level 1)  ← enter from source
 *   bastSani   — Bast-i Sani   (Level 2)  ← enter from source
 *   bastSalis  — Bast-i Salis  (Level 3)  ← enter from source
 *   bastRabi   — Bast-i Rabi   (Level 4)  ← enter from source
 *   bastHamis  — Bast-i Hamis  (Level 5)  ← enter from source
 *
 * Status: null = value not yet entered from source table.
 */
export const BAST_DATA = [
  { letter: 'ا', name: 'ألف',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ب', name: 'باء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ج', name: 'جيم',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'د', name: 'دال',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ه', name: 'هاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'و', name: 'واو',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ز', name: 'زاي',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ح', name: 'حاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ط', name: 'طاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ي', name: 'ياء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ك', name: 'كاف',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ل', name: 'لام',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'م', name: 'ميم',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ن', name: 'نون',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'س', name: 'سين',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ع', name: 'عين',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ف', name: 'فاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ص', name: 'صاد',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ق', name: 'قاف',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ر', name: 'راء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ش', name: 'شين',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ت', name: 'تاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ث', name: 'ثاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'خ', name: 'خاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ذ', name: 'ذال',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ض', name: 'ضاد',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'ظ', name: 'ظاء',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
  { letter: 'غ', name: 'غين',  bastEvvel: null, bastSani: null, bastSalis: null, bastRabi: null, bastHamis: null },
];

// ── Field → Level key mapping (used by engine) ────────────────
export const BAST_FIELD_MAP = {
  1: 'bastEvvel',
  2: 'bastSani',
  3: 'bastSalis',
  4: 'bastRabi',
  5: 'bastHamis',
};

// ── Lookup map: letter → row (built once at import time) ───────
export const BAST_LOOKUP = Object.fromEntries(
  BAST_DATA.map(row => [row.letter, row])
);