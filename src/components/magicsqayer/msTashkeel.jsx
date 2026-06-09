// ═══════════════════════════════════════════════════════════════
//  ARABIC TASHKEEL ENGINE — CLASSICAL PHONOLOGY (REWRITTEN)
//  Pure display layer — does NOT modify calculation logic.
//
//  CRITICAL RULES:
//  1. Balanced vowel distribution (Fatha/Kasra/Damma) — Sukun used sparingly
//  2. CCC clusters FORBIDDEN — max 2 consecutive consonants
//  3. First letter NEVER gets Sukun — Arabic words start with CV
//  4. Madd letters (ا، و، ي) NEVER receive harakat — they ARE the vowel
//  5. Final ending determined by preceding letter (NOT universal "ـيل")
//  6. Every name validated for Arabic pronounceability
// ═══════════════════════════════════════════════════════════════

// Unicode combining harakat
const FATHA = '\u064E'; // َ (short "a")
const KASRA = '\u0650'; // ِ (short "i")
const DAMMA = '\u064F'; // ُ (short "u")
const SUKUN = '\u0652'; // ْ (no vowel)

// Madd (long vowel) letters — NEVER get harakat
const MADD_LETTERS = new Set(['ا', 'و', 'ي', 'ى']);

// Hamza forms — vowel carriers, never get harakat
const HAMZA_FORMS = new Set(['آ', 'أ', 'إ', 'ئ', 'ؤ']);

const VOWEL_CARRIERS = new Set([...MADD_LETTERS, ...HAMZA_FORMS]);

// Bare suffixes
const SUFFIX_ANGEL = 'إيل';
const SUFFIX_JINN  = 'طيش';

// Angel ending variants with pre-vocalized forms
const ANGEL_ENDING_VARIANTS = [
  { pattern: 'ائيل', vocalization: '\u0627\u0626\u0650\u064A\u0644\u0652', desc: 'āʾīl (after alif)' },
  { pattern: 'ييل',  vocalization: '\u064A\u0650\u064A\u0644\u0652',  desc: 'yīl (after ya)' },
  { pattern: 'ؤيل',  vocalization: '\u0624\u0650\u064A\u0644\u0652',  desc: 'ūʾīl (after waw)' },
  { pattern: 'ئيل',  vocalization: '\u0626\u0650\u064A\u0644\u0652',  desc: 'iʾīl (hamza carrier)' },
];

// Suffix vocalizations
const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u0652'; // إِيلْ
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F'; // طَيْشُ

/**
 * getHarakaForMadd(maddChar)
 * Returns appropriate haraka for consonant preceding Madd letter.
 */
function getHarakaForMadd(maddChar) {
  if (maddChar === 'ا' || maddChar === 'آ' || maddChar === 'أ' || maddChar === 'إ') return FATHA;
  if (maddChar === 'و' || maddChar === 'ؤ') return DAMMA;
  if (maddChar === 'ي' || maddChar === 'ئ') return KASRA;
  return FATHA;
}

/**
 * detectAngelEndingVariant(name)
 * 
 * MORPHOLOGICAL ENDING DETECTION — FINAL LETTER ANALYSIS
 * 
 * Determines ending based on the FINAL CONSONANT before إيل.
 * NEVER uses universal ending — each name gets phonologically appropriate form.
 * 
 * RULES:
 * 1. ا (Alif) → ائيل (āʾīl) — alif requires hamza carrier
 * 2. و (Waw) → ؤيل (ūʾīl) — waw requires hamza carrier
 * 3. ي (Ya) → ييل (yīl) — ya extends naturally
 * 4. Consonant → ئيل (iʾīl) — direct kasra connection
 */
function detectAngelEndingVariant(name) {
  if (!name.endsWith(SUFFIX_ANGEL)) return null;
  
  const body = name.slice(0, name.length - SUFFIX_ANGEL.length);
  if (!body) return ANGEL_ENDING_VARIANTS[0];
  
  const lastChar = body[body.length - 1];
  
  // Alif → ائيل (āʾīl)
  if (lastChar === 'ا') return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ائيل');
  
  // Waw → ؤيل (ūʾīl)
  if (lastChar === 'و') return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ؤيل');
  
  // Ya → ييل (yīl)
  if (lastChar === 'ي') return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ييل');
  
  // Consonant → ئيل (iʾīl) — default
  return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ئيل');
}

/**
 * validateArabicSyllable(pattern)
 * 
 * PHONOLOGICAL VALIDATION — checks Arabic syllable rules.
 * Returns { valid, issues, fixedPattern }
 * 
 * RULES CHECKED:
 * 1. No word-initial Sukun (must start CV)
 * 2. No CCC clusters (max 2 consonants)
 * 3. No consecutive Sukun
 * 4. Balanced vowel distribution
 */
function validateArabicSyllable(pattern) {
  const issues = [];
  const fixed = JSON.parse(JSON.stringify(pattern));
  let hasIssues = false;
  
  // Rule 1: First letter must have vowel
  if (fixed[0] && fixed[0].vowel === SUKUN) {
    issues.push("Word-initial Sukun forbidden");
    fixed[0].vowel = FATHA;
    hasIssues = true;
  }
  
  // Rules 2 & 3: Check consonant clusters and consecutive Sukun
  let consonantCount = 0;
  for (let i = 0; i < fixed.length; i++) {
    const p = fixed[i];
    
    if (p.vowel === null) { // Madd/Hamza
      consonantCount = 0;
      continue;
    }
    
    if (p.vowel === SUKUN) {
      consonantCount++;
      
      // Consecutive Sukun check
      if (i > 0 && fixed[i-1].vowel === SUKUN) {
        issues.push(`Consecutive Sukun at ${i}`);
        fixed[i].vowel = KASRA;
        consonantCount = 1;
        hasIssues = true;
      }
      
      // CCC cluster check
      if (consonantCount >= 3) {
        issues.push(`CCC cluster at ${i}`);
        fixed[i].vowel = (i % 2 === 0) ? KASRA : FATHA;
        consonantCount = 1;
        hasIssues = true;
      }
    } else {
      consonantCount = 0;
    }
  }
  
  // Final consonant must have vowel for suffix connection
  const lastValid = fixed.findLast(p => p.vowel !== null);
  if (lastValid && lastValid.vowel === SUKUN) {
    issues.push("Final consonant Sukun blocks suffix");
    lastValid.vowel = KASRA;
    hasIssues = true;
  }
  
  return { valid: !hasIssues, issues, fixedPattern: fixed };
}

/**
 * buildSyllablePattern(chars, isAngel)
 * 
 * AUTHENTIC ARABIC PHONETIC ENGINE
 * 
 * Builds syllable pattern following classical Arabic phonology.
 * Returns array of {consonant, vowel} where vowel is:
 * - FATHA/KASRA/DAMMA (open syllable CV)
 * - SUKUN (closed syllable CVC, used sparingly)
 * - null (Madd/vowel carrier)
 * 
 * RULES:
 * 1. First letter ALWAYS gets vowel (CV start)
 * 2. CCC clusters forbidden
 * 3. Sukun ONLY for syllable closure (max 20% of characters)
 * 4. Angel names: prefer Kasra/Fatha for melodic flow
 * 5. Long vowels never receive harakat
 */
function buildSyllablePattern(chars, isAngel) {
  const pattern = [];
  const n = chars.length;
  
  for (let i = 0; i < n; i++) {
    const ch = chars[i];
    const nextCh = chars[i + 1];
    
    // Madd/Hamza — no haraka needed
    if (MADD_LETTERS.has(ch) || HAMZA_FORMS.has(ch)) {
      pattern.push({ consonant: ch, vowel: null });
      continue;
    }
    
    // RULE 1: First letter ALWAYS gets vowel
    if (i === 0) {
      pattern.push({ consonant: ch, vowel: FATHA });
      continue;
    }
    
    // Last consonant before suffix — MUST have vowel
    if (i === n - 1) {
      pattern.push({ consonant: ch, vowel: isAngel ? KASRA : FATHA });
      continue;
    }
    
    // Next char is Madd/vowel carrier
    if (nextCh && VOWEL_CARRIERS.has(nextCh)) {
      if (MADD_LETTERS.has(nextCh)) {
        pattern.push({ consonant: ch, vowel: getHarakaForMadd(nextCh) });
      } else {
        pattern.push({ consonant: ch, vowel: FATHA });
      }
      continue;
    }
    
    // Next char is consonant — decide vowel or Sukun
    const prevPattern = pattern[pattern.length - 1];
    const prevHasSukun = prevPattern && prevPattern.vowel === SUKUN;
    
    // Count consonant run to prevent CCC
    let consonantRun = 0;
    for (let j = i; j < n; j++) {
      if (!MADD_LETTERS.has(chars[j]) && !HAMZA_FORMS.has(chars[j])) {
        consonantRun++;
      } else {
        break;
      }
    }
    
    if (prevHasSukun) {
      // Previous Sukun → this MUST be vowel
      const vowelCycle = [KASRA, FATHA, DAMMA];
      pattern.push({ consonant: ch, vowel: vowelCycle[i % 3] });
    } else if (consonantRun >= 3) {
      // Long run — ONE Sukun for CVC, rest vowels
      if (i % 3 === 1) {
        pattern.push({ consonant: ch, vowel: SUKUN });
      } else {
        pattern.push({ consonant: ch, vowel: isAngel ? KASRA : FATHA });
      }
    } else {
      // Short sequence — use vowels for readability
      if (isAngel) {
        // Angel: flowing, melodic — alternate Kasra/Fatha
        pattern.push({ consonant: ch, vowel: (i % 2 === 0) ? KASRA : FATHA });
      } else {
        // Jinn: occasional Sukun for harsher sound
        if (consonantRun === 2 && i % 2 === 1) {
          pattern.push({ consonant: ch, vowel: SUKUN });
        } else {
          pattern.push({ consonant: ch, vowel: FATHA });
        }
      }
    }
  }
  
  // Validate and fix
  const validation = validateArabicSyllable(pattern);
  return validation.fixedPattern;
}

/**
 * validateNamePronounceability(vocalizedName, isAngel)
 * 
 * QUALITY CONTROL — Arabic pronunciation validation.
 * Returns { valid, issues }
 * 
 * REJECTION CRITERIA:
 * 1. Sukun density > 25%
 * 2. CCC clusters
 * 3. Consecutive Sukun
 * 4. Unbalanced vowel distribution
 */
function validateNamePronounceability(vocalizedName, isAngel) {
  const issues = [];
  
  // Sukun density check
  const sukunCount = (vocalizedName.match(new RegExp(SUKUN, 'g')) || []).length;
  const sukunDensity = sukunCount / vocalizedName.length;
  
  if (sukunDensity > 0.25) {
    issues.push(`Excessive Sukun: ${(sukunDensity * 100).toFixed(1)}%`);
  }
  
  // CCC cluster check
  const clusters = vocalizedName.match(/([^اويآأإئؤ\u064E\u0650\u064F]{3,})/g);
  if (clusters) {
    issues.push(`CCC clusters: ${clusters.join(', ')}`);
  }
  
  // Consecutive Sukun check
  if (/[\u0652]{2,}/.test(vocalizedName)) {
    issues.push("Consecutive Sukun detected");
  }
  
  // Vowel balance check
  const fathaCount = (vocalizedName.match(new RegExp(FATHA, 'g')) || []).length;
  const kasraCount = (vocalizedName.match(new RegExp(KASRA, 'g')) || []).length;
  const dammaCount = (vocalizedName.match(new RegExp(DAMMA, 'g')) || []).length;
  
  if (isAngel && dammaCount > fathaCount + kasraCount) {
    issues.push("Unbalanced vowels for angel name");
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * addTashkeelToArabicName(name, suffixType)
 * 
 * AUTHENTIC ARABIC NAME GENERATION SYSTEM
 * 
 * CRITICAL: Display-only — does NOT modify base letters from Abjad conversion.
 * 
 * PROCESS:
 * 1. Detect morphological ending variant based on final letter
 * 2. Build syllable pattern using Arabic phonetic rules
 * 3. Apply balanced harakat (Fatha/Kasra/Damma)
 * 4. Validate pronounceability
 * 5. Return vocalized name with complete Tashkīl
 * 
 * suffixType: "angel" | "jinn"
 */
export function addTashkeelToArabicName(name, suffixType) {
  if (!name || typeof name !== 'string') return name;

  const isAngel = suffixType === 'angel';
  const bareSuffix = isAngel ? SUFFIX_ANGEL : SUFFIX_JINN;

  if (!name.endsWith(bareSuffix)) return name;

  const body = name.slice(0, name.length - bareSuffix.length);
  
  // Detect ending variant for angel names
  let vocSuffix = isAngel ? SUFFIX_ANGEL_VOC : SUFFIX_JINN_VOC;
  if (isAngel) {
    const variant = detectAngelEndingVariant(name);
    if (variant) {
      vocSuffix = variant.vocalization;
    }
  }

  if (!body) return vocSuffix;

  // Build syllable pattern
  const chars = [...body];
  const pattern = buildSyllablePattern(chars, isAngel);
  
  // Apply pattern
  let out = '';
  for (const { consonant, vowel } of pattern) {
    out += vowel === null ? consonant : consonant + vowel;
  }

  const vocalizedName = out + vocSuffix;
  
  // Quality control
  const validation = validateNamePronounceability(vocalizedName, isAngel);
  if (!validation.valid) {
    console.warn("Tashkeel quality issues:", validation.issues, "Name:", vocalizedName);
  }

  return vocalizedName;
}