// ═══════════════════════════════════════════════════════════════
//  MS HARAKAT ENGINE — Natural Arabic vocalization
//  Applies ONLY to Magic Square Angel / Jinn names.
//  STRICT RULE: consonant sequence is IMMUTABLE — only diacritics added.
// ═══════════════════════════════════════════════════════════════

const FATHA  = '\u064E'; // َ
const KASRA  = '\u0650'; // ِ
const DAMMA  = '\u064F'; // ُ
const SUKUN  = '\u0652'; // ْ

// Articulation classes (مخارج الحروف) — used for natural vowel selection
const HALQI   = new Set(['ء','ه','ع','ح','غ','خ']); // throat → prefer Fatha
const SHATAWI = new Set(['ب','م','و','ف']);          // labial  → prefer Damma
const YAWI    = new Set(['ي']);                       // glide-Y → prefer Kasra

/**
 * naturalHarakat(consonants)
 *
 * Returns an array of harakat (one per consonant) following natural Arabic rules:
 *
 *  1. First consonant: never Sukun — use Fatha for halqi/default, Damma for labial.
 *  2. Middle consonants:
 *       - Halqi letters    → Fatha (throat letters open the mouth)
 *       - Labial letters   → Damma (lip-roundness carried by Damma)
 *       - Ya (ي)           → Kasra
 *       - Before the final → Kasra (smooth closure pattern)
 *       - Default          → Fatha
 *  3. Final consonant: Sukun (Arabic words typically close with a rest).
 *
 *  Single-letter edge case: returns Fatha only.
 */
export function naturalHarakat(consonants) {
  const n = consonants.length;
  if (n === 0) return [];

  const harakat = [];

  for (let i = 0; i < n; i++) {
    const c = consonants[i];
    const isFirst = i === 0;
    const isLast  = i === n - 1;

    if (isFirst) {
      // First letter: open syllable — Fatha default, Damma for labials
      harakat.push(SHATAWI.has(c) ? DAMMA : FATHA);
      continue;
    }

    if (isLast) {
      // Final letter: closed syllable
      harakat.push(SUKUN);
      continue;
    }

    // Middle letters
    if (HALQI.has(c)) {
      harakat.push(FATHA);         // throat letters open
    } else if (SHATAWI.has(c)) {
      harakat.push(DAMMA);         // labial letters round
    } else if (YAWI.has(c)) {
      harakat.push(KASRA);         // ya pulls down
    } else if (i === n - 2) {
      // Position immediately before the last letter → Kasra for smooth closure
      harakat.push(KASRA);
    } else {
      harakat.push(FATHA);         // default open vowel
    }
  }

  return harakat;
}

/**
 * vocalizeConsonants(consonants)
 *
 * Applies naturalHarakat and returns the fully vocalized string.
 * Consonant array is NEVER modified.
 */
export function vocalizeConsonants(consonants) {
  if (!consonants || consonants.length === 0) return '';
  const harakat = naturalHarakat(consonants);
  return consonants.map((c, i) => c + harakat[i]).join('');
}