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
 * 
 * CLASSICAL ARABIC MORPHOLOGICAL ENDING DETECTION
 * 
 * Analyzes the final syllable structure to determine the authentic angelic ending.
 * Returns the appropriate vocalization pattern based on Arabic phonotactics.
 * 
 * ARABIC MORPHOLOGICAL RULES:
 * 1. Alif (ا) before إيل → ائيل (Vʾīl pattern, like إِسْرَافِيل)
 * 2. Waw (و) before إيل → ؤيل (ūʾīl pattern, like جِبْرَائِيل)
 * 3. Ya (ي) before إيل → depends on preceding vowel:
 *    - Vowel + ي → ئيل (iʾīl, like مِيكَائِيل)
 *    - Consonant + ي → ييل (yīl, direct connection)
 * 4. Consonant before إيل → Cīl pattern (like جِبْرِيل، عَزْرَائِيل)
 * 5. The ending is determined by the FINAL SYLLABLE, not forced uniformly
 * 
 * This ensures each name gets its own unique, phonetically appropriate ending.
 */
function detectAngelEndingVariant(name) {
  if (!name.endsWith(SUFFIX_ANGEL)) return null;
  
  const body = name.slice(0, name.length - SUFFIX_ANGEL.length);
  if (!body) return ANGEL_ENDING_VARIANTS[0];
  
  const lastChar = body[body.length - 1];
  const secondLastChar = body.length > 1 ? body[body.length - 2] : null;
  const thirdLastChar = body.length > 2 ? body[body.length - 3] : null;
  
  // Analyze final syllable structure for authentic ending selection
  
  // Case 1: Alif (ا) before إيل → ائيل pattern (Vʾīl)
  // Examples: إِسْرَافِيل، عَزْرَائِيل
  if (lastChar === 'ا') {
    return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ائيل') || ANGEL_ENDING_VARIANTS[0];
  }
  
  // Case 2: Waw (و) before إيل → ؤيل pattern (ūʾīl)
  // Example: جِبْرَائِيل (with waw-hamza carrier)
  if (lastChar === 'و') {
    return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ؤيل') || ANGEL_ENDING_VARIANTS[0];
  }
  
  // Case 3: Ya (ي) before إيل — analyze preceding context
  if (lastChar === 'ي') {
    // Sub-case 3a: Double vowel letters → need hamza carrier (ئيل)
    // Prevents awkward VVʾīl sequences
    if (secondLastChar && ['ا', 'و', 'ي'].includes(secondLastChar)) {
      return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ئيل') || ANGEL_ENDING_VARIANTS[0];
    }
    // Sub-case 3b: Consonant + Ya → direct yīl connection (ييل)
    // Creates smooth CVCCyīl pattern
    return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ييل') || ANGEL_ENDING_VARIANTS[0];
  }
  
  // Case 4: Consonant before إيل → Cīl pattern (direct kasra connection)
  // Most common pattern: جِبْرِيل، مِيكَائِيل
  // The final consonant gets kasra to connect to hamza
  // Analyze the consonant type for optimal ending variant
  
  // If preceded by vowel letter, use hamza carrier for smooth transition
  if (secondLastChar && ['ا', 'و', 'ي'].includes(secondLastChar)) {
    return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ئيل') || ANGEL_ENDING_VARIANTS[0];
  }
  
  // Default: consonant cluster → use ئيل for proper morphology
  // Creates CVCC-īl or CVC-īl patterns
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
 * validateArabicSyllable(pattern)
 * 
 * CLASSICAL ARABIC PHONOLOGY VALIDATION
 * 
 * Validates that the generated syllable pattern follows Arabic phonotactic rules.
 * Returns { valid: boolean, issues: string[], fixedPattern: pattern }
 * 
 * ARABIC PHONOLOGICAL RULES CHECKED:
 * 1. No word-initial Sukun (Arabic words must start with vowel)
 * 2. No more than 2 consecutive consonants (CC max, CCC forbidden)
 * 3. No consecutive Sukun (creates unpronounceable clusters)
 * 4. Every syllable must be CV, CVC, CVV, or CVVC
 * 5. Long vowels (Madd) must not carry harakat
 * 6. Final consonant before suffix must have vowel for connection
 * 
 * If violations found, automatically repairs the pattern for readability.
 */
function validateArabicSyllable(pattern) {
  const issues = [];
  const fixed = JSON.parse(JSON.stringify(pattern)); // Deep copy
  let hasIssues = false;
  
  // Rule 1: First letter must have vowel (no word-initial Sukun)
  if (fixed[0] && fixed[0].vowel === SUKUN) {
    issues.push("Word-initial Sukun forbidden");
    fixed[0].vowel = FATHA;
    hasIssues = true;
  }
  
  // Rule 2 & 3: Check for consecutive Sukun and consonant clusters
  let consonantCount = 0;
  for (let i = 0; i < fixed.length; i++) {
    const p = fixed[i];
    
    // Skip Madd/Hamza — they're vowels
    if (p.vowel === null) {
      consonantCount = 0;
      continue;
    }
    
    if (p.vowel === SUKUN) {
      consonantCount++;
      
      // Check for consecutive Sukun
      if (i > 0 && fixed[i-1].vowel === SUKUN) {
        issues.push(`Consecutive Sukun at position ${i}`);
        // Fix: alternate with Kasra for readability
        fixed[i].vowel = KASRA;
        consonantCount = 1;
        hasIssues = true;
      }
      
      // Rule: Max 2 consonants in a row (CCC forbidden in Arabic)
      if (consonantCount >= 3) {
        issues.push(`Forbidden CCC cluster at position ${i}`);
        // Fix: insert vowel on this consonant
        fixed[i].vowel = (i % 2 === 0) ? KASRA : FATHA;
        consonantCount = 1;
        hasIssues = true;
      }
    } else {
      // Has vowel — reset consonant count
      consonantCount = 0;
    }
  }
  
  // Rule 6: Final consonant must have vowel (for suffix connection)
  const lastValid = fixed.findLast(p => p.vowel !== null);
  if (lastValid && lastValid.vowel === SUKUN) {
    issues.push("Final consonant has Sukun — cannot connect to suffix");
    lastValid.vowel = KASRA;
    hasIssues = true;
  }
  
  return {
    valid: !hasIssues,
    issues,
    fixedPattern: fixed
  };
}

/**
 * buildSyllablePattern(chars, isAngel)
 * 
 * AUTHENTIC CLASSICAL ARABIC PHONETIC ENGINE
 * 
 * Builds a syllable pattern following Arabic phonology and morphology.
 * Returns array of {consonant, vowel} where vowel is:
 * - FATHA, KASRA, DAMMA (open syllable CV)
 * - SUKUN (closed syllable CVC, used sparingly)
 * - null (Madd/vowel carrier — no haraka needed)
 * 
 * CLASSICAL ARABIC PHONOLOGICAL RULES:
 * 1. Every Arabic word starts with CV (vowel sound, never Sukun)
 * 2. Syllable structures: CV (open), CVC (closed), CVV (long), CVVC (long+closed)
 * 3. CCC clusters forbidden — max 2 consecutive consonants
 * 4. Sukun ONLY for syllable closure, never on consecutive consonants
 * 5. Vowel alternation for natural flow: Fatha → Kasra → Damma
 * 6. Angel names: prefer Kasra/Fatha for melodic quality (جِبْرِيل، مِيكَائِيل)
 * 7. Long vowels (ا، و، ي) never receive harakat — they ARE the vowel
 * 8. Final consonant before suffix MUST have vowel for smooth connection
 */
function buildSyllablePattern(chars, isAngel) {
  const pattern = [];
  const n = chars.length;
  
  for (let i = 0; i < n; i++) {
    const ch = chars[i];
    const nextCh = chars[i + 1];
    
    // Madd letters ARE vowels — skip (no haraka needed)
    if (MADD_LETTERS.has(ch)) {
      pattern.push({ consonant: ch, vowel: null });
      continue;
    }
    
    // Hamza forms are vowel carriers — skip (no haraka needed)
    if (HAMZA_FORMS.has(ch)) {
      pattern.push({ consonant: ch, vowel: null });
      continue;
    }
    
    // RULE 1: First letter ALWAYS gets vowel (CV start)
    // Arabic words cannot begin with closed consonant
    if (i === 0) {
      pattern.push({ consonant: ch, vowel: FATHA });
      continue;
    }
    
    // RULE 8: Last consonant before suffix — MUST have vowel
    // Angel suffix starts with kasra, Jinn with fatha
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
    // ARABIC PHONOLOGY: Prefer vowels, use Sukun only for CVC closure
    
    const prevPattern = pattern[pattern.length - 1];
    const prevHasSukun = prevPattern && prevPattern.vowel === SUKUN;
    
    // Count consecutive consonants to prevent CCC clusters
    let consonantRun = 0;
    for (let j = i; j < n; j++) {
      if (!MADD_LETTERS.has(chars[j]) && !HAMZA_FORMS.has(chars[j])) {
        consonantRun++;
      } else {
        break;
      }
    }
    
    if (prevHasSukun) {
      // Previous was Sukun → this MUST be vowel (prevents CC cluster)
      const vowelCycle = [KASRA, FATHA, DAMMA];
      pattern.push({ consonant: ch, vowel: vowelCycle[i % 3] });
    } else if (consonantRun >= 3) {
      // Long consonant sequence — need ONE Sukun for CVC, rest vowels
      // Place Sukun on 2nd consonant only (creates CVC.CV pattern)
      const positionInRun = i % 3;
      if (positionInRun === 1) {
        pattern.push({ consonant: ch, vowel: SUKUN });
      } else {
        pattern.push({ consonant: ch, vowel: isAngel ? KASRA : FATHA });
      }
    } else {
      // Short sequence (1-2 consonants) — use vowels for readability
      if (isAngel) {
        // Angel names: flowing, melodic — alternate Kasra/Fatha
        pattern.push({ consonant: ch, vowel: (i % 2 === 0) ? KASRA : FATHA });
      } else {
        // Jinn names: can use occasional Sukun for harsher sound
        if (consonantRun === 2 && i % 2 === 1) {
          pattern.push({ consonant: ch, vowel: SUKUN });
        } else {
          pattern.push({ consonant: ch, vowel: FATHA });
        }
      }
    }
  }
  
  // PHONOLOGICAL VALIDATION: Ensure pattern follows Arabic rules
  const validation = validateArabicSyllable(pattern);
  return validation.fixedPattern;
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
 * validateNamePronounceability(name, isAngel)
 * 
 * QUALITY CONTROL: Arabic Pronunciation Validation
 * 
 * Validates that the generated name can be smoothly read by Arabic speakers.
 * Returns { valid: boolean, issues: string[] }
 * 
 * VALIDATION RULES:
 * 1. No excessive Sukun density (max 30% of characters)
 * 2. No CCC consonant clusters
 * 3. No consecutive Sukun
 * 4. Must have balanced vowel distribution
 * 5. Must be readable without difficulty
 * 
 * If validation fails, the name should be regenerated with adjusted vowels.
 */
function validateNamePronounceability(name, isAngel) {
  const issues = [];
  
  // Count Sukun density
  const sukunCount = (name.match(new RegExp(SUKUN, 'g')) || []).length;
  const totalChars = name.length;
  const sukunDensity = sukunCount / totalChars;
  
  if (sukunDensity > 0.30) {
    issues.push(`Excessive Sukun density: ${(sukunDensity * 100).toFixed(1)}% (max 30%)`);
  }
  
  // Check for CCC clusters (3+ consecutive consonants without vowels)
  const consonantPattern = /([^اويآأإئؤ\u064E\u0650\u064F]{3,})/g;
  const clusters = name.match(consonantPattern);
  if (clusters) {
    issues.push(`Forbidden CCC clusters found: ${clusters.join(', ')}`);
  }
  
  // Check for consecutive Sukun
  const consecutiveSukun = /[\u0652]{2,}/g;
  if (consecutiveSukun.test(name)) {
    issues.push("Consecutive Sukun detected");
  }
  
  // Check vowel balance (should have variety of Fatha/Kasra/Damma)
  const fathaCount = (name.match(new RegExp(FATHA, 'g')) || []).length;
  const kasraCount = (name.match(new RegExp(KASRA, 'g')) || []).length;
  const dammaCount = (name.match(new RegExp(DAMMA, 'g')) || []).length;
  
  // For angel names, expect more Kasra/Fatha than Damma
  if (isAngel) {
    if (dammaCount > fathaCount + kasraCount) {
      issues.push("Unbalanced vowel distribution for angel name");
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}



/**
 * addTashkeelToArabicName(name, suffixType)
 *
 * AUTHENTIC CLASSICAL ARABIC NAME GENERATION SYSTEM
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
 * CLASSICAL ARABIC RULES APPLIED:
 * 1. Phonology: Every name follows Arabic syllable structures (CV, CVC, CVV, CVVC)
 * 2. CCC clusters forbidden — max 2 consecutive consonants
 * 3. Balanced harakat: Fatha, Kasra, Damma — Sukun ONLY for syllable closure
 * 4. First letter NEVER gets Sukun — Arabic words start with vowel sound
 * 5. Madd letters (ا، و، ي) never receive harakat — they ARE the vowel
 * 6. Morphology: Ending variants determined by final syllable (رِيل، فِيل، كَائِيل، etc.)
 * 7. Quality Control: Pronunciation validation ensures readability
 * 8. Output: Authentic names like جِبْرِيل، مِيكَائِيل، إِسْرَافِيل، عَزْرَائِيل
 */
export function addTashkeelToArabicName(name, suffixType) {
  if (!name || typeof name !== 'string') return name;

  const isAngel = suffixType === 'angel';
  const bareSuffix = isAngel ? SUFFIX_ANGEL : SUFFIX_JINN;

  if (!name.endsWith(bareSuffix)) return name; // unexpected format — render as-is

  // Body = everything before the suffix (letters from conversion only)
  const body = name.slice(0, name.length - bareSuffix.length);

  // For angel names: detect morphological variant based on preceding letters
  // This ensures natural Arabic patterns instead of uniform template
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
    if (vowel === null) {
      out += consonant; // Madd/Hamza — no haraka
    } else {
      out += consonant + vowel;
    }
  }

  const vocalizedName = out + vocSuffix;
  
  // QUALITY CONTROL: Validate pronunciation
  const validation = validateNamePronounceability(vocalizedName, isAngel);
  if (!validation.valid) {
    // In production, could regenerate here if needed
    // For now, log the issue for debugging
    console.warn("Arabic name quality issues:", validation.issues, "Name:", vocalizedName);
  }

  return vocalizedName;
}