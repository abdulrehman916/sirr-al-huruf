// ═══════════════════════════════════════════════════════════════
//  ARABIC TASHKEEL (HARAKAT) FOR ABJAD-GENERATED NAMES
//  Pure display layer — does NOT modify any calculation logic.
//
//  Unicode combining marks attach directly to the preceding letter
//  codepoint. Arabic shaping engines (browser/OS) handle rendering.
//
//  Vocalization pattern for Abjad positional names:
//  - Each consonant gets Fatha (open CV syllable).
//  - Long-vowel carriers (ا، و، ي) are left bare — they supply
//    their own inherent vowel sound.
//  - Last body consonant before إيل → Kasra (glide into /i/).
//  - Last body consonant before طيش → Fatha (open /a/ before /ṭ/).
//  - Fixed suffixes are pre-vocalized as literal strings with
//    combining marks already embedded in the source.
// ═══════════════════════════════════════════════════════════════

// Unicode combining harakat — attach immediately after base letter
const FATHA = '\u064E'; // َ  above
const KASRA = '\u0650'; // ِ  below
const SUKUN = '\u0652'; // ْ  above (used only on ي in إيل suffix)

// Long-vowel carrier letters — inherent vowel, no extra haraka
const LONG_VOWEL = new Set(['ا', 'و', 'ي', 'ى', 'آ', 'أ', 'إ', 'ئ', 'ؤ']);

// Bare suffixes as they appear in generated names
const SUFFIX_ANGEL = 'إيل';
const SUFFIX_JINN  = 'طيش';

// Pre-vocalized suffixes — harakat embedded as combining codepoints
// إِيلُ  = إ + kasra + ي + ل + damma
// طَيْشُ = ط + fatha + ي + sukun + ش + damma
const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u064F'; // إِيلُ
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F'; // طَيْشُ

/**
 * addTashkeelToArabicName(name, suffixType)
 *
 * Display-only function. Returns a fully vocalized copy of `name`.
 * The original `name` string (used for all calculations) is never
 * mutated or replaced.
 *
 * suffixType: "angel" | "jinn"
 */
export function addTashkeelToArabicName(name, suffixType) {
  if (!name || typeof name !== 'string') return name;

  const isAngel = suffixType === 'angel';
  const bareSuffix = isAngel ? SUFFIX_ANGEL : SUFFIX_JINN;

  if (!name.endsWith(bareSuffix)) return name; // unexpected format — render as-is

  // Body = everything before the fixed suffix
  const body = name.slice(0, name.length - bareSuffix.length);

  const vocSuffix = isAngel ? SUFFIX_ANGEL_VOC : SUFFIX_JINN_VOC;

  if (!body) return vocSuffix;

  // Iterate body characters; attach harakat directly after each base letter.
  // Arabic combining marks MUST immediately follow their base codepoint.
  const chars = [...body]; // spread handles BMP Arabic correctly

  // Find index of last true consonant (skip long-vowel carriers at end)
  let lastCons = -1;
  for (let i = chars.length - 1; i >= 0; i--) {
    if (!LONG_VOWEL.has(chars[i])) { lastCons = i; break; }
  }

  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (LONG_VOWEL.has(ch)) {
      // Long-vowel carrier — no haraka added, inherent sound
      out += ch;
    } else if (i === lastCons) {
      // Last consonant before suffix
      out += ch + (isAngel ? KASRA : FATHA);
    } else {
      // All other consonants — open syllable: Fatha only (no Sukun)
      // Sukun would create a closed syllable cluster that looks broken
      out += ch + FATHA;
    }
  }

  return out + vocSuffix;
}