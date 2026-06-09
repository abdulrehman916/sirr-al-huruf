// ═══════════════════════════════════════════════════════════════
//  ARABIC TASHKEEL (HARAKAT) FOR ABJAD-GENERATED NAMES
//  Pure display layer — does NOT modify any calculation logic.
//
//  Unicode combining marks attach directly to the preceding letter
//  codepoint. Arabic shaping engines (browser/OS) handle rendering.
//
//  Vocalization follows classical Arabic orthographic rules:
//  - Consonants get appropriate harakat based on following letter.
//  - Long vowels (ا، و، ي) are NEVER vocalized — they ARE the vowel.
//  - Consonant before ا → Fatha (produces "aa" sound)
//  - Consonant before و → Damma (produces "uu" sound)
//  - Consonant before ي → Kasra (produces "ii" sound)
//  - Final consonant before suffix follows suffix vowel pattern.
//  - Suffixes are pre-vocalized with authentic pronunciation.
// ═══════════════════════════════════════════════════════════════

// Unicode combining harakat — attach immediately after base letter
const FATHA = '\u064E'; // َ  above (short "a")
const KASRA = '\u0650'; // ِ  below (short "i")
const DAMMA = '\u064F'; // ُ  above (short "u")
const SUKUN = '\u0652'; // ْ  above (no vowel)

// Long-vowel letters (Madd) — these ARE vowels, never get harakat
const LONG_VOWEL = new Set(['ا', 'و', 'ي', 'ى', 'آ', 'أ', 'إ', 'ئ', 'ؤ']);

// Bare suffixes as they appear in generated names
const SUFFIX_ANGEL = 'إيل';
const SUFFIX_JINN  = 'طيش';

// Pre-vocalized suffixes — authentic classical pronunciation
// إِيلُ  = إ + kasra + ي (bare) + ل + damma → /ʔiːlu/
const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u064F'; // إِيلُ

// طَيْشُ = ط + fatha + ي + sukun + ش + damma → /tajʃu/
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F'; // طَيْشُ

/**
 * addTashkeelToArabicName(name, suffixType)
 *
 * Display-only function. Returns a fully vocalized copy of `name`.
 * The original `name` string (used for all calculations) is never
 * mutated or replaced.
 *
 * suffixType: "angel" | "jinn"
 *
 * Arabic vocalization rules applied:
 * 1. Long vowels (ا، و، ي) never receive harakat — they are the vowel.
 * 2. Consonant before ا gets Fatha (creates "aa" sound).
 * 3. Consonant before و gets Damma (creates "uu" sound).
 * 4. Consonant before ي gets Kasra (creates "ii" sound).
 * 5. Other consonants get Fatha for open syllables (default).
 * 6. Final consonant before suffix follows suffix entry vowel.
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

  const chars = [...body]; // spread handles BMP Arabic correctly
  let out = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const nextCh = chars[i + 1];

    // Long vowel letters NEVER get harakat — they ARE the vowel
    if (LONG_VOWEL.has(ch)) {
      out += ch;
      continue;
    }

    // Determine harakat based on following letter (Arabic syllable rules)
    let haraka;
    if (nextCh === undefined) {
      // Last consonant before suffix — use suffix entry vowel
      haraka = isAngel ? KASRA : FATHA;
    } else if (nextCh === 'ا' || nextCh === 'آ' || nextCh === 'أ' || nextCh === 'إ') {
      // Consonant before alif → Fatha (creates "aa" long vowel)
      haraka = FATHA;
    } else if (nextCh === 'و' || nextCh === 'ؤ') {
      // Consonant before waw → Damma (creates "uu" long vowel)
      haraka = DAMMA;
    } else if (nextCh === 'ي' || nextCh === 'ئ') {
      // Consonant before ya → Kasra (creates "ii" long vowel)
      haraka = KASRA;
    } else if (LONG_VOWEL.has(nextCh)) {
      // Other long vowel forms → no haraka (let next letter stand)
      haraka = '';
    } else {
      // Default: open syllable with Fatha (most common in Arabic names)
      haraka = FATHA;
    }

    out += ch + haraka;
  }

  return out + vocSuffix;
}