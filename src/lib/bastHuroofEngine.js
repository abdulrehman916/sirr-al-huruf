// ═══════════════════════════════════════════════════════════════
// BASTHUL HUROOF DEDICATED ENGINE
// Completely independent — sources data ONLY from bastHuroofData.js
// Does NOT import from any other engine in this project.
// ═══════════════════════════════════════════════════════════════

import { BAST_LOOKUP, BAST_FIELD_MAP } from './bastHuroofData';

// ── Arabic letter extraction ──────────────────────────────────
function extractArabicLetters(text) {
  if (!text) return [];
  const cleaned = text
    .replace(/[\u064B-\u065F]/g, '')   // tashkeel
    .replace(/\u0640/g, '')            // tatweel
    .replace(/\u0670/g, '')            // superscript alef
    .replace(/[\u0600-\u0605]/g, '')   // Arabic number signs
    .replace(/[\u0610-\u061A]/g, '')   // Arabic sign marks
    .replace(/[\u200B-\u200F]/g, '')   // zero-width chars
    .replace(/[\u202A-\u202E]/g, '')   // bidi embedding
    .replace(/[\uFE70-\uFEFF]/g, '');  // presentation forms noise
  return cleaned.match(/[\u0621-\u063A\u0641-\u064A]/g) || [];
}

// ── Normalization (hamza variants → base form) ────────────────
const NORM_MAP = {
  'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا',
  'ى': 'ي', 'ئ': 'ي',
  'ؤ': 'و',
  'ة': 'ه',
};
function normalize(ch) { return NORM_MAP[ch] || ch; }

// ── Bast level metadata (UI labels) ──────────────────────────
export const BAST_LEVELS = [
  { key: 1, label: "Bast-i Evvel",  arabic: "بسط الأول",   field: "bastEvvel" },
  { key: 2, label: "Bast-i Sani",   arabic: "بسط الثاني",  field: "bastSani"  },
  { key: 3, label: "Bast-i Salis",  arabic: "بسط الثالث",  field: "bastSalis" },
  { key: 4, label: "Bast-i Rabi",   arabic: "بسط الرابع",  field: "bastRabi"  },
  { key: 5, label: "Bast-i Hamis",  arabic: "بسط الخامس",  field: "bastHamis" },
];

// ── Main calculation function ─────────────────────────────────
/**
 * @param {string} text   — raw Arabic input
 * @param {number} level  — 1 | 2 | 3 | 4 | 5
 * @returns {{ entries, total, letterCount, isPending }}
 */
export function calcBastHuroof(text, level = 1) {
  const rawLetters = extractArabicLetters(text);
  const field = BAST_FIELD_MAP[level];

  const entries = rawLetters.map((original) => {
    const norm = normalize(original);
    const row  = BAST_LOOKUP[norm];
    const value = row ? row[field] : null;
    return { original, normalized: norm, name: row?.name ?? norm, value };
  });

  const isPending = entries.some(e => e.value === null);
  const total     = isPending
    ? null
    : entries.reduce((s, e) => s + e.value, 0);

  return { entries, total, letterCount: entries.length, isPending };
}