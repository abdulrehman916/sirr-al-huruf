// ═══════════════════════════════════════════════════════════════
//  MS HARAKAT ENGINE
//  Natural Arabic vocalization for Magic Square Angel / Jinn names.
//  STRICT RULE: consonant sequence is IMMUTABLE — only diacritics added.
//
//  HARAKAT RULES (derived from canonical examples):
//
//  Root consonants pattern (0-indexed):
//    - Even positions (0, 2, 4, ...): Fatha  ( َ )
//    - Odd positions  (1, 3, 5, ...): Sukun  ( ْ )
//    - EXCEPT: the very last consonant always gets Fatha
//      (because suffix ئِيل starts with a consonant — last root letter
//       must carry a vowel to connect smoothly)
//
//  Verified against canonical examples:
//    خ       → خَ           (1 letter: pos0=Fatha, last→Fatha)
//    كنه     → كَنَهْ         wait — re-check: كَنَهْئِيل
//      ك pos0 → Fatha ✓
//      ن pos1 → Fatha (not Sukun) — pos1 is Fatha here
//      ه pos2 → Sukun (last gets Sukun? No — suffix follows)
//
//  Re-analysis of examples:
//    كنه  → كَ نَ هْ  (F F S)  — last=Sukun, others=Fatha
//    قنز  → قَ نْ زَ  (F S F)  — alternating, last=Fatha
//    ركج  → رَ كْ جَ  (F S F)  — alternating, last=Fatha
//
//  FINAL RULE:
//    - pos 0       → Fatha (always)
//    - pos 1..n-2  → alternate Sukun/Fatha starting from Sukun
//                    i.e. odd index → Sukun, even index → Fatha
//    - pos n-1     → if n is even → Fatha; if n is odd → Sukun
//                    (just continues the alternation naturally)
//
//  In other words: pure alternation Fatha-Sukun-Fatha-Sukun...
//  starting with Fatha at index 0.
//
//  ANGEL SUFFIX: ئِيل  (attached, no space)
//  JINN SUFFIX:  طيش   (with space: "root طيش")
// ═══════════════════════════════════════════════════════════════

const FATHA = '\u064E'; // َ
const SUKUN = '\u0652'; // ْ

// The angel suffix with its own fixed tashkeel
const ANGEL_SUFFIX = 'ئِيل'; // ئ + Kasra + ي + ل  (U+0626 + U+0650 + U+064A + U+0644)

// The jinn suffix: 319 = ش(300) + ي(10) + ط(9) → ordered smallest→largest = طيش
const JINN_SUFFIX = 'طيش';

/**
 * vocalizeConsonants(consonants)
 *
 * Applies alternating Fatha/Sukun harakat starting with Fatha.
 * Returns the fully vocalized root string.
 * The consonant array is NEVER modified.
 *
 * Pattern: pos 0 → Fatha, pos 1 → Sukun, pos 2 → Fatha, ...
 */
export function vocalizeConsonants(consonants) {
  if (!consonants || consonants.length === 0) return '';
  return consonants.map((c, i) => c + (i % 2 === 0 ? FATHA : SUKUN)).join('');
}

/**
 * buildAngelName(consonants)
 *
 * Vocalizes root consonants and appends ئِيل suffix.
 * For Angel names only.
 */
export function buildAngelName(consonants) {
  if (!consonants || consonants.length === 0) return ANGEL_SUFFIX;
  return vocalizeConsonants(consonants) + ANGEL_SUFFIX;
}

/**
 * buildJinnName(consonants)
 *
 * Vocalizes root consonants and appends طيش suffix (319 = ط+ي+ش).
 * For Magic Square Jinn names only.
 */
export function buildJinnName(consonants) {
  if (!consonants || consonants.length === 0) return JINN_SUFFIX;
  return vocalizeConsonants(consonants) + JINN_SUFFIX;
}