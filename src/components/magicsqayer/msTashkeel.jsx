// ═══════════════════════════════════════════════════════════════
//  ARABIC TASHKEEL (HARAKAT) FOR ABJAD-GENERATED NAMES
//  Pure display layer — does NOT modify any calculation logic.
//
//  Unicode combining marks attach directly to the preceding base letter.
//  Arabic shaping engines (browser/OS) handle glyph formation and positioning.
//
//  Vocalization follows classical Arabic phonetic and orthographic rules:
//  - Syllable structure: CV (open) or CVC (closed) — no unnatural clusters.
//  - Madd letters (ا، و، ي) NEVER receive harakat — they ARE the vowel.
//  - Consonant + ا → Fatha (creates /aː/ "aa" long vowel)
//  - Consonant + و → Damma (creates /uː/ "uu" long vowel)
//  - Consonant + ي → Kasra (creates /iː/ "ii" long vowel)
//  - Consonant + Consonant → Sukun (closes syllable, CVC pattern)
//  - Final consonant before suffix → follows suffix entry vowel pattern.
//  - Suffixes pre-vocalized with authentic classical pronunciation.
//  - Result: naturally readable Arabic resembling printed manuscripts.
// ═══════════════════════════════════════════════════════════════

// Unicode combining harakat — attach immediately after base letter
const FATHA = '\u064E'; // َ  above (short "a")
const KASRA = '\u0650'; // ِ  below (short "i")
const DAMMA = '\u064F'; // ُ  above (short "u")
const SUKUN = '\u0652'; // ْ  above (no vowel)

// Madd (long vowel) letters — these ARE vowels, never get harakat
// When preceded by a consonant, they create long vowels:
//   C + ا → /aː/ (aa)
//   C + و → /uː/ (uu)
//   C + ي → /iː/ (ii)
const MADD_LETTERS = new Set(['ا', 'و', 'ي', 'ى']);

// Hamza forms that can carry Madd — treated as vowel carriers
const HAMZA_FORMS = new Set(['آ', 'أ', 'إ', 'ئ', 'ؤ']);

// All vowel carriers (Madd + Hamza forms) — never receive harakat
const VOWEL_CARRIERS = new Set([...MADD_LETTERS, ...HAMZA_FORMS]);

// Bare suffixes as they appear in generated names
const SUFFIX_ANGEL = 'إيل';
const SUFFIX_JINN  = 'طيش';

// Pre-vocalized suffixes — authentic classical pronunciation
// إِيلُ  = إ + kasra + ي (bare, madd) + ل + damma → /ʔiːlu/
const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u064F'; // إِيلُ

// طَيْشُ = ط + fatha + ي + sukun + ش + damma → /tajʃu/
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F'; // طَيْشُ

/**
 * getHarakaForMadd(maddChar)
 * Returns the appropriate haraka for a consonant preceding a Madd letter.
 * - ا → Fatha (creates /aː/ "aa")
 * - و → Damma (creates /uː/ "uu")
 * - ي → Kasra (creates /iː/ "ii")
 */
function getHarakaForMadd(maddChar) {
  if (maddChar === 'ا' || maddChar === 'آ' || maddChar === 'أ' || maddChar === 'إ') {
    return FATHA; // /aː/
  }
  if (maddChar === 'و' || maddChar === 'ؤ') {
    return DAMMA; // /uː/
  }
  if (maddChar === 'ي' || maddChar === 'ئ') {
    return KASRA; // /iː/
  }
  return FATHA; // default
}

/**
 * addTashkeelToArabicName(name, suffixType)
 *
 * Display-only function. Returns a fully vocalized copy of `name`.
 * The original `name` string (used for all calculations) is never
 * mutated or replaced.
 *
 * suffixType: "angel" | "jinn"
 *
 * Arabic phonetic rules applied:
 * 1. Madd letters (ا، و، ي) NEVER receive harakat — they ARE the vowel.
 * 2. Consonant + Madd → appropriate haraka for long vowel syllable (CV).
 * 3. Consonant + Consonant → Sukun (close syllable, CVC pattern).
 * 4. Final consonant before suffix → follows suffix entry vowel.
 * 5. No unnatural vowel sequences — proper CV / CVC syllable structure.
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

    // Madd letters NEVER get harakat — they ARE the vowel
    if (MADD_LETTERS.has(ch)) {
      out += ch;
      continue;
    }

    // Hamza forms (أ، إ، ئ، ؤ) — treat as vowel carriers, no harakat
    if (HAMZA_FORMS.has(ch)) {
      out += ch;
      continue;
    }

    // Determine haraka based on phonetic context (Arabic syllable structure)
    let haraka;

    if (nextCh === undefined) {
      // Last consonant before suffix — use suffix entry vowel
      // Angel suffix إِيلُ starts with kasra → /ʔiːlu/
      // Jinn suffix طَيْشُ starts with fatha → /tajʃu/
      haraka = isAngel ? KASRA : FATHA;

    } else if (VOWEL_CARRIERS.has(nextCh)) {
      // Next letter is a vowel carrier (Madd or Hamza form)
      // Apply appropriate haraka to create long vowel syllable
      if (MADD_LETTERS.has(nextCh)) {
        // Consonant + Madd → long vowel (CV pattern)
        haraka = getHarakaForMadd(nextCh);
      } else {
        // Hamza form — use Fatha as default (most common)
        haraka = FATHA;
      }

    } else {
      // Next letter is a consonant → Sukun (close the syllable, CVC pattern)
      // Example: رَمْعَطِيش — مْ has sukun because ع follows
      // This creates natural Arabic syllable boundaries
      haraka = SUKUN;
    }

    out += ch + haraka;
  }

  return out + vocSuffix;
}