// ═══════════════════════════════════════════════════════════════
//  ARABIC TASHKEEL ENGINE — SIMPLE PHONETIC VOCALIZATION
//  Pure display layer — does NOT modify calculation logic.
//
//  CRITICAL RULES:
//  1. NO Sukun — ALL consonants get vowels (Fatha/Kasra/Damma)
//  2. First letter ALWAYS gets Fatha (CV start)
//  3. Madd letters (ا، و، ي) NEVER receive harakat
//  4. Angel names: flowing Kasra/Fatha pattern
//  5. Jinn names: stronger Fatha/Damma pattern
//  6. Pre-vocalized suffixes for correct morphology
// ═══════════════════════════════════════════════════════════════

// Unicode combining harakat
const FATHA = '\u064E'; // َ (short "a")
const KASRA = '\u0650'; // ِ (short "i")
const DAMMA = '\u064F'; // ُ (short "u")

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

// Suffix vocalizations (pre-built)
const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u0652'; // إِيلْ
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F'; // طَيْشُ

/**
 * detectAngelEndingVariant(name)
 * Determines ending based on final letter before إيل
 */
function detectAngelEndingVariant(name) {
  if (!name.endsWith(SUFFIX_ANGEL)) return null;
  
  const body = name.slice(0, name.length - SUFFIX_ANGEL.length);
  if (!body) return ANGEL_ENDING_VARIANTS[0];
  
  const lastChar = body[body.length - 1];
  
  if (lastChar === 'ا') return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ائيل');
  if (lastChar === 'و') return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ؤيل');
  if (lastChar === 'ي') return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ييل');
  return ANGEL_ENDING_VARIANTS.find(v => v.pattern === 'ئيل');
}

/**
 * getHarakaForMadd(maddChar)
 * Returns appropriate haraka for consonant preceding Madd letter
 */
function getHarakaForMadd(maddChar) {
  if (maddChar === 'ا' || maddChar === 'آ' || maddChar === 'أ' || maddChar === 'إ') return FATHA;
  if (maddChar === 'و' || maddChar === 'ؤ') return DAMMA;
  if (maddChar === 'ي' || maddChar === 'ئ') return KASRA;
  return FATHA;
}

/**
 * vocalizeArabicName(chars, isAngel)
 * 
 * SIMPLE VOCALIZATION — NO Sukun
 * Every consonant gets a vowel (Fatha/Kasra/Damma)
 * 
 * RULES:
 * 1. First letter ALWAYS gets Fatha
 * 2. Madd/Hamza never get harakat
 * 3. Consonant before Madd gets appropriate haraka
 * 4. Angel: alternate Kasra/Fatha for flowing sound
 * 5. Jinn: Fatha/Damma for stronger sound
 */
function vocalizeArabicName(chars, isAngel) {
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
    
    // RULE 1: First letter ALWAYS gets Fatha
    if (i === 0) {
      pattern.push({ consonant: ch, vowel: FATHA });
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
    
    // Regular consonant — assign vowel (NO Sukun)
    if (isAngel) {
      // Angel: flowing, melodic — alternate Kasra/Fatha
      const vowelCycle = [KASRA, FATHA, DAMMA];
      pattern.push({ consonant: ch, vowel: vowelCycle[i % 3] });
    } else {
      // Jinn: stronger — Fatha/Damma
      const vowelCycle = [FATHA, DAMMA, FATHA, KASRA];
      pattern.push({ consonant: ch, vowel: vowelCycle[i % 4] });
    }
  }
  
  return pattern;
}

/**
 * validateNamePronounceability(vocalizedName, isAngel)
 * Quality control — should always pass with new engine
 */
function validateNamePronounceability(vocalizedName, isAngel) {
  const issues = [];
  
  // Check for any Sukun (should be none)
  const sukunCount = (vocalizedName.match(new RegExp('\u0652', 'g')) || []).length;
  // Sukun only allowed in suffix (final Lam), not in body
  const bodySukun = vocalizedName.slice(0, vocalizedName.length - 4).match(new RegExp('\u0652', 'g'));
  if (bodySukun && bodySukun.length > 0) {
    issues.push(`Unexpected Sukun in body: ${bodySukun.length}`);
  }
  
  // Check for CCC clusters
  const clusters = vocalizedName.match(/([^اويآأإئؤ\u064E\u0650\u064F]{3,})/g);
  if (clusters) {
    issues.push(`CCC clusters: ${clusters.join(', ')}`);
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * addTashkeelToArabicName(name, suffixType)
 * 
 * AUTHENTIC ARABIC NAME VOCALIZATION
 * 
 * suffixType: "angel" | "jinn"
 */
export function addTashkeelToArabicName(name, suffixType) {
  if (!name || typeof name !== 'string') return name;

  const isAngel = suffixType === 'angel';
  const bareSuffix = isAngel ? SUFFIX_ANGEL : SUFFIX_JINN;

  if (!name.endsWith(bareSuffix)) return name;

  const body = name.slice(0, name.length - bareSuffix.length);
  
  // Get vocalized suffix
  let vocSuffix = isAngel ? SUFFIX_ANGEL_VOC : SUFFIX_JINN_VOC;
  if (isAngel) {
    const variant = detectAngelEndingVariant(name);
    if (variant) {
      vocSuffix = variant.vocalization;
    }
  }

  if (!body) return vocSuffix;

  // Vocalize body
  const chars = [...body];
  const pattern = vocalizeArabicName(chars, isAngel);
  
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