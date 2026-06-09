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
// Final Lam (ل) in angel suffix gets Sukun when closing the word (not Damma)
// إِيلْ  = إ + kasra + ي (bare, madd) + ل + sukun → /ʔiːl/
const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u0652'; // إِيلْ

// طَيْشُ = ط + fatha + ي + sukun + ش + damma → /tajʃu/
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F'; // طَيْشُ

// Common Arabic name endings — treat as complete phonetic units
// These patterns override automatic syllable rules
// Final Lam gets Sukun (لْ) when closing the word, following Arabic phonetic structure
const NAME_ENDINGS = [
  { pattern: 'ائيل', vocalization: '\u0627\u0626\u0650\u064A\u0644\u0652' }, // ائِلْ
  { pattern: 'ئيل',  vocalization: '\u0626\u0650\u064A\u0644\u0652' },      // ئِلْ
  { pattern: 'ييل',  vocalization: '\u064A\u0650\u064A\u0644\u0652' },      // يِلْ
  { pattern: 'ايل',  vocalization: '\u0627\u064A\u0644\u0652' },           // ايلْ
];

/**
 * findMatchingEnding(name)
 * Returns the matching ending pattern and its pre-vocalized form, or null.
 */
function findMatchingEnding(name) {
  for (const ending of NAME_ENDINGS) {
    if (name.endsWith(ending.pattern)) {
      return ending;
    }
  }
  return null;
}

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
 * vocalizeNameWithEnding(body, ending)
 * Vocalizes a name body that ends with a recognized Arabic pattern (ائيل، ئيل، etc.).
 * Uses pre-vocalized ending for authentic pronunciation.
 */
function vocalizeNameWithEnding(body, ending) {
  const bodyWithoutEnding = body.slice(0, body.length - ending.pattern.length);
  if (!bodyWithoutEnding) {
    return ending.vocalization;
  }

  const chars = [...bodyWithoutEnding];
  let out = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const nextCh = chars[i + 1];

    // Madd letters NEVER get harakat — they ARE the vowel
    if (MADD_LETTERS.has(ch)) {
      out += ch;
      continue;
    }

    // Hamza forms — treat as vowel carriers, no harakat
    if (HAMZA_FORMS.has(ch)) {
      out += ch;
      continue;
    }

    let haraka;

    // CRITICAL: First letter NEVER gets Sukun — must be pronounceable
    if (i === 0) {
      haraka = FATHA;

    } else if (nextCh === undefined) {
      // Last consonant before the ending — flows into ending's first vowel
      haraka = KASRA;

    } else if (VOWEL_CARRIERS.has(nextCh)) {
      if (MADD_LETTERS.has(nextCh)) {
        haraka = getHarakaForMadd(nextCh);
      } else {
        haraka = FATHA;
      }

    } else {
      haraka = SUKUN;
    }

    out += ch + haraka;
  }

  return out + ending.vocalization;
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
 * 2. Recognized name endings (ائيل، ئيل، ييل، ايل) use pre-vocalized patterns.
 * 3. Consonant + Madd → appropriate haraka for long vowel syllable (CV).
 * 4. Consonant + Consonant → Sukun (close syllable, CVC pattern).
 * 5. First letter NEVER gets Sukun — always pronounceable (Fatha default).
 * 6. Final consonant flows into suffix with appropriate vowel.
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

  // Check for recognized Arabic name endings (ائيل، ئيل، ييل، ايل)
  // These override automatic syllable rules for authentic pronunciation
  const ending = findMatchingEnding(body + bareSuffix);
  if (ending) {
    return vocalizeNameWithEnding(body, ending);
  }

  // Default vocalization for names without recognized endings
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

    // CRITICAL RULE: First letter NEVER gets Sukun — must be pronounceable
    // Arabic words always begin with a vowel sound, never a closed consonant
    if (i === 0) {
      // First consonant — always use Fatha as default opening vowel
      // This ensures names like قَصْحَايِل not قْصَحَايِل
      haraka = FATHA;

    } else if (nextCh === undefined) {
      // Last consonant before suffix — flows into suffix's first vowel
      // Angel suffix إِيلْ starts with kasra on Hamza → /ʔiːl/
      // Jinn suffix طَيْشُ starts with fatha on Ta → /tajʃu/
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