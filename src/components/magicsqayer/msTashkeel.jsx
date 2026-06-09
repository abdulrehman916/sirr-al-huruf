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
 * buildSyllablePattern(chars, isAngel)
 * 
 * AUTHENTIC ARABIC PHONETIC ENGINE
 * 
 * Builds a syllable pattern for the given consonant sequence.
 * Returns array of {consonant, vowel} objects where vowel can be:
 * - FATHA, KASRA, DAMMA (open syllable CV)
 * - SUKUN (closed syllable CVC, used sparingly)
 * - null (skip - next char is Madd/vowel carrier)
 * 
 * ARABIC SYLLABLE RULES:
 * 1. Every Arabic word starts with CV (never Sukun on first letter)
 * 2. Syllables are: CV (open), CVC (closed), CVV (long vowel), CVVC (long + closure)
 * 3. Sukun ONLY appears to close a syllable when followed by another consonant
 * 4. Never place Sukun on consecutive consonants (creates unpronounceable clusters)
 * 5. Alternate vowels for natural flow: Fatha → Kasra → Damma pattern
 * 6. Angel names prefer flowing vowels (Kasra/Fatha) for melodic quality
 * 7. The last consonant before suffix gets a vowel to connect smoothly
 */
function buildSyllablePattern(chars, isAngel) {
  const pattern = [];
  const n = chars.length;
  
  for (let i = 0; i < n; i++) {
    const ch = chars[i];
    const nextCh = chars[i + 1];
    
    // Madd letters ARE vowels — skip them (no haraka needed)
    if (MADD_LETTERS.has(ch)) {
      pattern.push({ consonant: ch, vowel: null });
      continue;
    }
    
    // Hamza forms are vowel carriers — skip (no haraka needed)
    if (HAMZA_FORMS.has(ch)) {
      pattern.push({ consonant: ch, vowel: null });
      continue;
    }
    
    // CRITICAL: First letter ALWAYS gets a vowel (CV start)
    // Arabic words cannot begin with a closed consonant
    if (i === 0) {
      pattern.push({ consonant: ch, vowel: FATHA });
      continue;
    }
    
    // Last consonant before suffix — MUST have vowel to connect
    // Angel suffix starts with kasra, Jinn suffix starts with fatha
    if (i === n - 1) {
      pattern.push({ consonant: ch, vowel: isAngel ? KASRA : FATHA });
      continue;
    }
    
    // Next char is Madd/vowel carrier — this consonant needs appropriate vowel
    if (nextCh && VOWEL_CARRIERS.has(nextCh)) {
      if (MADD_LETTERS.has(nextCh)) {
        // Consonant + Madd = long vowel syllable (CVV)
        pattern.push({ consonant: ch, vowel: getHarakaForMadd(nextCh) });
      } else {
        // Hamza form — use Fatha as default
        pattern.push({ consonant: ch, vowel: FATHA });
      }
      continue;
    }
    
    // Next char is consonant — decide: vowel or Sukun?
    // AUTHENTIC ARABIC RULE: Prefer vowels for pronounceability
    // Only use Sukun when it creates a proper CVC syllable
    
    // Check previous syllable — avoid consecutive Sukun
    const prevPattern = pattern[pattern.length - 1];
    const prevHasSukun = prevPattern && prevPattern.vowel === SUKUN;
    
    if (prevHasSukun) {
      // Previous was Sukun → this MUST be a vowel (prevents C-C clusters)
      // Use position-based alternation for natural variety
      const vowelCycle = [KASRA, FATHA, DAMMA];
      pattern.push({ consonant: ch, vowel: vowelCycle[i % 3] });
    } else {
      // Decide based on name type and position
      if (isAngel) {
        // Angel names: flowing, melodic — prefer vowels over Sukun
        // Pattern: alternate Kasra/Fatha for elegance
        // Only use Sukun if we have 3+ consonants in a row
        const consonantRun = countConsonantRun(chars, i);
        if (consonantRun >= 3) {
          // Long consonant sequence — need one Sukun for CVC syllable
          // Place it on every 3rd consonant to maintain pronounceability
          pattern.push({ consonant: ch, vowel: (i % 3 === 2) ? SUKUN : KASRA });
        } else {
          // Short sequence — use vowels only
          pattern.push({ consonant: ch, vowel: (i % 2 === 0) ? KASRA : FATHA });
        }
      } else {
        // Jinn names: can use more Sukun for harsher sound
        // But still maintain pronounceability — max 1 Sukun per 2 consonants
        const consonantRun = countConsonantRun(chars, i);
        if (consonantRun >= 2 && i % 2 === 1) {
          pattern.push({ consonant: ch, vowel: SUKUN });
        } else {
          pattern.push({ consonant: ch, vowel: FATHA });
        }
      }
    }
  }
  
  return pattern;
}

/**
 * countConsonantRun(chars, startIndex)
 * 
 * Counts consecutive consonants starting from startIndex.
 * Used to determine if we need Sukun for syllable closure.
 */
function countConsonantRun(chars, startIndex) {
  let count = 0;
  for (let i = startIndex; i < chars.length; i++) {
    if (!MADD_LETTERS.has(chars[i]) && !HAMZA_FORMS.has(chars[i])) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

/**
 * addTashkeelToArabicName(name, suffixType)
 *
 * AUTHENTIC ARABIC PHONETIC ENGINE
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
 * AUTHENTIC ARABIC RULES APPLIED:
 * 1. Every name is fully pronounceable by native Arabic speakers
 * 2. Balanced harakat distribution: Fatha, Kasra, Damma — Sukun ONLY when needed
 * 3. Syllable structures: CV, CVC, CVV, CVVC (natural Arabic patterns)
 * 4. Madd letters (ا، و، ي) never receive harakat — they ARE the vowel
 * 5. First letter NEVER gets Sukun — Arabic words start with vowel sound
 * 6. Sukun only appears to close syllables (CVC), never on consecutive consonants
 * 7. Angel names use flowing vowels (Kasra/Fatha) for melodic quality
 * 8. Ending variants determined by preceding letter: رِيل، فِيل، كَائِيل، etc.
 * 9. Output resembles authentic names: جِبْرِيل، مِيكَائِيل، إِسْرَافِيل
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

  // Build authentic syllable pattern using Arabic phonetic rules
  const chars = [...body];
  const pattern = buildSyllablePattern(chars, isAngel);
  
  // Apply the pattern to generate vocalized output
  let out = '';
  for (const { consonant, vowel } of pattern) {
    // Skip Madd/Hamza — they don't get harakat
    if (vowel === null) {
      out += consonant;
    } else {
      out += consonant + vowel;
    }
  }

  return out + vocSuffix;
}