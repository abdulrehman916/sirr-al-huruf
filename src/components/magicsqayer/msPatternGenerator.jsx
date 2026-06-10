// ═══════════════════════════════════════════════════════════════
//  TRADITIONAL HIERARCHY NAME GENERATOR
//  Book formula: tier value - suffix → letters → vocalized name
// ═══════════════════════════════════════════════════════════════

import { applyPhoneticRules, checkPronounceability, VOWELS } from './msPhonologyEngine';
import { numToArabic, numToHebrew } from './msEngine';

const { FATHA, KASRA, DAMMA, SUKUN } = VOWELS;

// Book suffix values (RULE_NAME_CONSTRUCTION)
const SUFFIXES = {
  'heb-angel': 31,   // אל
  'ar-angel': 41,    // إيل
  'heb-jinn': 329,   // 360 - 31
  'ar-jinn': 319,    // 360 - 41
};

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
  
  // BOOK FORMULA: subtract suffix from tier value
  let remainder = value - suffix;
  
  // Negative value fix (RULE_NAME_CONSTRUCTION)
  if (remainder <= 0) {
    remainder = value + 360 - suffix;
  }
  
  // Convert remainder to letters using book's Akram positional system
  const letterString = isHebrew ? numToHebrew(remainder) : numToArabic(remainder);
  const consonants = letterString.split('');
  
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
  
  // Add suffix with proper tashkeel for Angel names
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
  }
  // Jinn: no additional suffix (already accounted for in the math)
  
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