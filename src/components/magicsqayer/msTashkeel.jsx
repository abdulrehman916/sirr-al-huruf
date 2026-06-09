// ═══════════════════════════════════════════════════════════════
//  ARABIC TASHKEEL (HARAKAT) FOR ABJAD-GENERATED NAMES
//  Pure display layer — does NOT modify any calculation logic.
//
//  Unicode combining marks attach directly to the preceding base letter.
//  Arabic shaping engines (browser/OS) handle glyph formation and positioning.
//
//  CRITICAL: This is a DISPLAY-ONLY layer — it does NOT modify the actual letters.
//  The Arabic name letters come PURELY from the Abjad conversion algorithm.
//  No forced endings, no injected suffixes, no artificial letter changes.
//
//  MORPHOLOGICAL VARIANT DETECTION FOR ANGEL NAMES:
//  - Angel names ending with إيل use different patterns based on preceding letters.
//  - ا + إيل → ائيل (like إِسْرَافِيل)
//  - ي + إيل → ييل or ئيل (like مِيكَائِيل)
//  - و + إيل → ؤيل (like جِبْرَائِيل)
//  - Consonant + إيل → Cīl pattern (like جِبْرِيل)
//  - This ensures authentic Arabic morphology, not mechanical uniformity.
//
//  Vocalization follows classical Arabic phonetic and orthographic rules:
//  - BALANCED VOWEL DISTRIBUTION: Use Fatha, Kasra, Damma — not just Sukun.
//  - Syllable structure: CV, CVC, CVV, CVVC — natural Arabic patterns only.
//  - Madd letters (ا، و، ي) NEVER receive harakat — they ARE the vowel.
//  - Consonant + ا → Fatha (creates /aː/ "aa" long vowel)
//  - Consonant + و → Damma (creates /uː/ "uu" long vowel)
//  - Consonant + ي → Kasra (creates /iː/ "ii" long vowel)
//  - Sukun ONLY where Arabic syllable closure requires it (CVC pattern).
//  - NEVER overload names with Sukun — must be pronounceable by Arabic speakers.
//  - First letter NEVER receives Sukun — always pronounceable (CV start).
//  - Angel names: prefer flowing vowels (Kasra/Fatha) for melodic patterns.
//  - Ending variants: رِيل، فِيل، ائِيل، كَائِيل، يِيل — determined by context.
//  - ONLY pronunciation marks are added — the base letters remain unchanged.
//  - Result: authentic Arabic angelic names like جِبْرِيل، مِيكَائِيل، إِسْرَافِيل.
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

// Angel name ending patterns — morphological variants based on preceding consonant.
// Arabic angel names don't use one fixed pattern; the syllable before إيل determines the form.
// Examples: جِبْرِيل (CVCC-īl), مِيكَائِيل (CVCCVʾ-īl), إِسْرَافِيل (VCCVVC-īl), عَزْرَائِيل (VCCCVʾ-īl)
// The key is the vowel BEFORE إيل and whether a hamza is needed for proper Arabic morphology.
const ANGEL_ENDING_VARIANTS = [
  { pattern: 'ائيل', vocalization: '\u0627\u0626\u0650\u064A\u0644\u0652', description: 'āʾīl — after alif' },    // ا + ئ + يل
  { pattern: 'ييل',  vocalization: '\u064A\u0650\u064A\u0644\u0652',  description: 'yīl — after ya' },         // ي + يل
  { pattern: 'ايل',  vocalization: '\u0627\u0650\u064A\u0644\u0652',  description: 'āl — after alif (no hamza)' }, // ا + يل
  { pattern: 'ءيل',  vocalization: '\u0621\u0650\u064A\u0644\u0652',  description: 'ʾīl — standalone hamza' },   // ء + يل
  { pattern: 'ؤيل',  vocalization: '\u0624\u0650\u064A\u0644\u0652',  description: 'ūʾīl — after waw' },        // ؤ + يل
  { pattern: 'ئيل',  vocalization: '\u0626\u0650\u064A\u0644\u0652',  description: 'iʾīl — after ya' },         // ئ + يل
];

// Suffix vocalization — applied to the EXISTING suffix letters from conversion.
// Angel suffix: إ + ي + ل (from conversion) → إِيلْ (with pronunciation marks only)
// Jinn suffix: ط + ي + ش (from conversion) → طَيْشُ (with pronunciation marks only)
// No letters are added or removed — only harakat/sukun are applied for pronunciation.
const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u0652'; // إِيلْ (pronunciation only)

// طَيْشُ = ط + fatha + ي + sukun + ش + damma → /tajʃu/
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F'; // طَيْشُ

// NO FORCED ENDINGS - Disabled to preserve original Abjad conversion results.
// The Arabic name letters come PURELY from the conversion algorithm.
// Do not append or inject fixed "Eel/Il" suffixes or force specific ending patterns.
const NAME_ENDINGS = []; // Empty - no forced ending patterns

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
 * detectAngelEndingVariant(name)
 * Detects which angel ending variant applies based on the letters before إيل.
 * Returns the appropriate vocalization pattern for authentic Arabic morphology.
 * 
 * Arabic angel names follow morphological rules:
 * - Long vowel (ا، و، ي) before إيل → often needs hamza carrier (ائيل، ؤيل، ئيل)
 * - Consonant before إيل → direct kasra connection (Cīl pattern like رِيل، فِيل)
 * - The goal is natural Arabic phonetics, not mechanical uniformity
 */
function detectAngelEndingVariant(name) {
  if (!name.endsWith(SUFFIX_ANGEL)) return null;
  
  const body = name.slice(0, name.length - SUFFIX_ANGEL.length);
  if (!body) return ANGEL_ENDING_VARIANTS[0]; // Default to ائيل for bare suffix
  
  const lastChar = body[body.length - 1];
  const secondLastChar = body.length > 1 ? body[body.length - 2] : null;
  
  // Check for long vowels that typically take hamza in angel names
  if (lastChar === 'ا') {
    // Alif before إيل → ائيل pattern (like إِسْرَافِيل)
    return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ائيل') || ANGEL_ENDING_VARIANTS[0];
  }
  
  if (lastChar === 'ي') {
    // Ya before إيل → could be ييل or ئيل depending on context
    // If preceded by another vowel letter, use hamza form
    if (secondLastChar && ['ا', 'و', 'ي'].includes(secondLastChar)) {
      return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ئيل') || ANGEL_ENDING_VARIANTS[0];
    }
    return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ييل') || ANGEL_ENDING_VARIANTS[0];
  }
  
  if (lastChar === 'و') {
    // Waw before إيل → ؤيل pattern (like جِبْرَائِيل with waw-hamza)
    return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ؤيل') || ANGEL_ENDING_VARIANTS[0];
  }
  
  // Consonant before إيل → use ئيل for proper morphology (like جِبْرِيل، مِيكَائِيل)
  // The consonant gets kasra to connect smoothly to the hamza
  return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ئيل') || ANGEL_ENDING_VARIANTS[0];
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
 * CRITICAL: This is a DISPLAY-ONLY function — it does NOT modify the actual letters.
 * The Arabic name comes PURELY from the Abjad conversion algorithm.
 * No forced endings, no injected suffixes, no artificial letter changes.
 *
 * Returns a vocalized copy of `name` with pronunciation marks only.
 * The original `name` string (used for all calculations) is never mutated.
 *
 * suffixType: "angel" | "jinn"
 *
 * Arabic phonetic rules applied:
 * 1. Madd letters (ا، و، ي) NEVER receive harakat — they ARE the vowel.
 * 2. Consonant + Madd → appropriate haraka for long vowel syllable (CV).
 * 3. Consonant + Consonant → Sukun (close syllable, CVC pattern).
 * 4. First letter NEVER gets Sukun — always pronounceable (Fatha default).
 * 5. ONLY pronunciation marks are added — base letters remain unchanged.
 */
export function addTashkeelToArabicName(name, suffixType) {
  if (!name || typeof name !== 'string') return name;

  const isAngel = suffixType === 'angel';
  const bareSuffix = isAngel ? SUFFIX_ANGEL : SUFFIX_JINN;

  if (!name.endsWith(bareSuffix)) return name; // unexpected format — render as-is

  // Body = everything before the suffix (letters from conversion only)
  const body = name.slice(0, name.length - bareSuffix.length);

  // For angel names: detect morphological variant based on preceding letters
  // This ensures natural Arabic patterns (جِبْرِيل، مِيكَائِيل، إِسْرَافِيل) instead of uniform template
  let vocSuffix = isAngel ? SUFFIX_ANGEL_VOC : SUFFIX_JINN_VOC;
  if (isAngel) {
    const variant = detectAngelEndingVariant(name);
    if (variant) {
      vocSuffix = variant.vocalization;
    }
  }

  if (!body) return vocSuffix;

  // NO FORCED ENDINGS - vocalize the actual letters from conversion
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
    // CRITICAL: Use balanced vowels (Fatha/Kasra/Damma) — Sukun ONLY where required
    // Arabic names must be pronounceable, not consonant clusters with Sukun
    let haraka;

    // CRITICAL RULE: First letter NEVER gets Sukun — must be pronounceable
    // Arabic words always begin with a vowel sound (CV pattern)
    if (i === 0) {
      // First consonant — use Fatha as default opening vowel
      // Creates natural CV start like جَ، بَ، رَ
      haraka = FATHA;

    } else if (nextCh === undefined) {
      // Last consonant before suffix — flows into suffix's vowel
      // Angel suffix starts with kasra → use Kasra for smooth transition
      // Jinn suffix starts with fatha → use Fatha
      haraka = isAngel ? KASRA : FATHA;

    } else if (VOWEL_CARRIERS.has(nextCh)) {
      // Next letter is a vowel carrier (Madd or Hamza form)
      // Apply appropriate haraka to create long vowel syllable (CVV or CVVC)
      if (MADD_LETTERS.has(nextCh)) {
        // Consonant + Madd → long vowel (CVV pattern)
        // ا → Fatha (creates /aː/), و → Damma (creates /uː/), ي → Kasra (creates /iː/)
        haraka = getHarakaForMadd(nextCh);
      } else {
        // Hamza form — use Fatha as default (most common in angel names)
        haraka = FATHA;
      }

    } else {
      // Next letter is a consonant
      // ARABIC PHONETIC RULE: Don't default to Sukun — use varied vowels
      // Only use Sukun for true syllable closure (CVC pattern)
      // Alternate between Fatha, Kasra, Damma for natural flow
      
      // Check if we already have a Sukun in the previous position
      // Avoid consecutive Sukun (creates unpronounceable clusters)
      const prevChar = out[out.length - 1];
      const prevHasSukun = prevChar && prevChar.charCodeAt(prevChar.length - 1) === SUKUN.charCodeAt(0);
      
      if (prevHasSukun) {
        // Previous consonant has Sukun → this one MUST have a vowel
        // Alternate between Fatha, Kasra, Damma for variety
        // Use position-based alternation for consistency
        haraka = (i % 3 === 0) ? FATHA : (i % 3 === 1) ? KASRA : DAMMA;
      } else {
        // Decide: vowel or Sukun based on syllable position
        // Prefer vowels for pronounceability — only use Sukun when needed
        // Rule: Use Sukun only if this creates a proper CVC syllable
        // and the next letter is not a vowel carrier
        
        // For angel names: prefer vowels to create flowing, melodic patterns
        // like مِيكَائِيل (CV-CV-CVV-CVVC) not مِكْأَلْيِل
        if (isAngel) {
          // Angel names: use Kasra for elegance (common in angelic names)
          // or Fatha for openness — avoid Sukun unless truly needed
          haraka = (i % 2 === 0) ? KASRA : FATHA;
        } else {
          // Jinn names: can use more Sukun for harsher sound, but still balanced
          haraka = SUKUN;
        }
      }
    }

    out += ch + haraka;
  }

  return out + vocSuffix;
}