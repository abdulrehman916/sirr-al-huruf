// ═══════════════════════════════════════════════════════════════
//  TRADITIONAL HIERARCHY NAME GENERATOR
//  Uses book formulas: tier value - suffix → letters → name with tashkeel
// ═══════════════════════════════════════════════════════════════

import { applyPhoneticRules, checkPronounceability, VOWELS } from './msPhonologyEngine';

const { FATHA, KASRA, DAMMA, SUKUN } = VOWELS;

// Book suffix values (RULE_NAME_CONSTRUCTION)
const SUFFIXES = {
  'heb-angel': 31,   // אל
  'ar-angel': 41,    // إيل
  'heb-jinn': 329,   // 360 - 31
  'ar-jinn': 319,    // 360 - 41
};

// Letter-to-number mappings (RULE_NAME_CONSTRUCTION)
const HEBREW_LETTERS = [
  { v:1, l:'א' }, { v:2, l:'ב' }, { v:3, l:'ג' }, { v:4, l:'ד' }, { v:5, l:'ה' },
  { v:6, l:'ו' }, { v:7, l:'ז' }, { v:8, l:'ח' }, { v:9, l:'ט' }, { v:10, l:'י' },
  { v:20, l:'כ' }, { v:30, l:'ל' }, { v:40, l:'מ' }, { v:50, l:'נ' }, { v:60, l:'ס' },
  { v:70, l:'ע' }, { v:80, l:'פ' }, { v:90, l:'צ' }, { v:100, l:'ק' }, { v:200, l:'ר' },
  { v:300, l:'ש' }, { v:400, l:'ת' },
];

const ARABIC_LETTERS = [
  { v:1, l:'ا' }, { v:2, l:'ب' }, { v:3, l:'ج' }, { v:4, l:'د' }, { v:5, l:'ه' },
  { v:6, l:'و' }, { v:7, l:'ز' }, { v:8, l:'ح' }, { v:9, l:'ط' }, { v:10, l:'ي' },
  { v:20, l:'ك' }, { v:30, l:'ل' }, { v:40, l:'م' }, { v:50, l:'ن' }, { v:60, l:'س' },
  { v:70, l:'ع' }, { v:80, l:'ف' }, { v:90, l:'ص' }, { v:100, l:'ق' }, { v:200, l:'ر' },
  { v:300, l:'ش' }, { v:400, l:'ت' }, { v:500, l:'ث' }, { v:600, l:'خ' },
  { v:700, l:'ذ' }, { v:800, l:'ض' }, { v:900, l:'ظ' }, { v:1000, l:'غ' },
];

/**
 * numberToLetters(value, lang)
 * Convert number to letters using book's gematria system
 */
function numberToLetters(value, lang) {
  if (value <= 0) return [];
  
  const letters = lang === 'hebrew' ? HEBREW_LETTERS : ARABIC_LETTERS;
  const result = [];
  let remaining = value;
  
  // Greedy algorithm: largest letter first
  for (let i = letters.length - 1; i >= 0 && remaining > 0; i--) {
    const { v, l } = letters[i];
    while (remaining >= v) {
      result.push(l);
      remaining -= v;
    }
  }
  
  return result;
}

/**
 * generateNameForHierarchyValue(value, suffixType)
 * BOOK FORMULA: tier value - suffix → letters → vocalized name
 */
export function generateNameForHierarchyValue(value, suffixType = 'ar-angel') {
  const suffix = SUFFIXES[suffixType];
  if (!suffix) {
    return { success: false, error: 'Invalid suffix type' };
  }
  
  const isAngel = suffixType.includes('angel');
  const isHebrew = suffixType.includes('heb');
  const lang = isHebrew ? 'hebrew' : 'arabic';
  
  // BOOK FORMULA: subtract suffix from tier value
  let remainder = value - suffix;
  
  // Negative value fix (RULE_NAME_CONSTRUCTION)
  if (remainder <= 0) {
    remainder = value + 360 - suffix;
  }
  
  // Convert remainder to letters
  const consonants = numberToLetters(remainder, lang);
  
  if (consonants.length === 0) {
    return { success: false, error: 'Could not convert to letters' };
  }
  
  // Apply phonetic rules for tashkeel ONLY (not changing the letters)
  const phoneticResult = applyPhoneticRules(consonants, value);
  
  // Build vocalized name
  let vocalizedName = '';
  for (let i = 0; i < consonants.length; i++) {
    vocalizedName += consonants[i] + phoneticResult.vowels[i];
  }
  
  // Add suffix with proper tashkeel
  if (isAngel) {
    if (isHebrew) {
      // Hebrew: אל (Aleph-Lamed)
      vocalizedName += FATHA + 'ל';
    } else {
      // Arabic: إيل with context-aware pre-vowel
      const lastConsonant = consonants[consonants.length - 1];
      const preVowel = getContextAwareVowel(lastConsonant, value);
      vocalizedName = vocalizedName.replace(/[\u064E\u0650\u064F\u0652]$/, '') + preVowel + 'ي' + FATHA + 'ل';
    }
  } else {
    // Jinn suffix already included in the math (value + 41 or +31)
    // No additional suffix letters needed
  }
  
  // Validate pronounceability
  const pronounceability = checkPronounceability(vocalizedName);
  
  return {
    success: true,
    value,
    suffixType,
    remainder,
    consonants,
    fullName: vocalizedName,
    isAngel,
    isHebrew,
    phoneticRules: phoneticResult.rules,
    validation: {
      morphology: {
        score: 100,
        passed: true,
        reason: 'Book formula applied'
      },
      phonology: {
        score: pronounceability.score,
        passed: pronounceability.pronounceable,
        reason: pronounceability.reason
      },
      overall: {
        score: pronounceability.score,
        passed: pronounceability.pronounceable
      }
    }
  };
}

/**
 * getContextAwareVowel(lastConsonant, value)
 * Determine vowel before إيل based on consonant articulation
 */
function getContextAwareVowel(lastConsonant, value) {
  const guttural = ['ع', 'ح', 'ه', 'خ', 'غ'];
  const palatal = ['ج', 'ش', 'ي'];
  const labial = ['ب', 'م', 'ف'];
  
  if (guttural.includes(lastConsonant)) return KASRA;
  if (palatal.includes(lastConsonant)) return Math.abs(value) % 2 === 0 ? KASRA : FATHA;
  if (labial.includes(lastConsonant)) return Math.abs(value) % 2 === 0 ? DAMMA : KASRA;
  return KASRA; // Default
}

/**
 * Legacy export for compatibility
 */
export function getNameForHierarchyValue(value, suffixType) {
  return generateNameForHierarchyValue(value, suffixType);
}

export function getPatternInfo() {
  return {
    id: 'book-formula',
    template: 'tier-minus-suffix',
    category: 'traditional',
    syllables: 'variable',
    difficulty: 1,
    example: 'Adjuster(136) - 41 = 95 → letters → vocalized name'
  };
}