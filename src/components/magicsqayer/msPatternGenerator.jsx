// ═══════════════════════════════════════════════════════════════
//  ORIGINAL HIERARCHY NAME GENERATOR
//  Book formula: tier value → subtract suffix → extract letters via Abjad
// ═══════════════════════════════════════════════════════════════

import { VOWELS, applyPhoneticRules, checkPronounceability } from './msPhonologyEngine';
import { ARABIC_ABJAD, HEBREW_GEMATRIA } from './msEngine';

const { FATHA, KASRA, DAMMA, SUKUN } = VOWELS;

// Book suffix values
const SUFFIXES = {
  'heb-angel': 31,   // אל
  'ar-angel': 41,    // إيل
  'heb-jinn': 329,   // תקש
  'ar-jinn': 319,    // طيش
};

/**
 * extractLettersFromValue(value)
 * ORIGINAL METHOD: Decompose value into Abjad letters using greedy algorithm
 */
function extractLettersFromValue(value, letterTable) {
  if (!value || value <= 0) return [];
  
  const letters = [];
  let remaining = value;
  
  // Greedy decomposition: largest values first
  for (let i = letterTable.length - 1; i >= 0 && remaining > 0; i--) {
    const { val, letter } = letterTable[i];
    while (remaining >= val) {
      letters.push(letter);
      remaining -= val;
    }
  }
  
  // Reverse to get proper reading order
  return letters.reverse();
}

/**
 * generateNameForHierarchyValue(value, suffixType)
 * ORIGINAL BOOK FORMULA:
 * 1. Hierarchy value - suffix = remainder
 * 2. Extract letters from remainder using Abjad decomposition
 * 3. Add suffix letters (إيل for Angel, none for Jinn)
 * 4. Apply tashkeel ONLY (never change letters)
 */
export function generateNameForHierarchyValue(value, suffixType = 'ar-angel') {
  const suffix = SUFFIXES[suffixType];
  if (!suffix) {
    return { success: false, error: 'Invalid suffix type' };
  }
  
  const isAngel = suffixType.includes('angel');
  const isHebrew = suffixType.includes('heb');
  const isArabic = !isHebrew;
  
  // BOOK FORMULA: subtract suffix from tier value
  let remainder = value - suffix;
  
  // Underflow rule: if value < suffix, add 360 first
  if (remainder <= 0) {
    remainder = value + 360 - suffix;
  }
  
  // ORIGINAL LETTER EXTRACTION: Abjad decomposition
  const letterTable = isHebrew ? HEBREW_GEMATRIA : ARABIC_ABJAD;
  const consonants = extractLettersFromValue(remainder, letterTable);
  
  if (consonants.length === 0) {
    return { success: false, error: 'Could not extract letters' };
  }
  
  // Apply phonetic rules for tashkeel ONLY
  const phoneticResult = applyPhoneticRules(consonants, value);
  
  // Build vocalized name WITHOUT changing letters
  let vocalizedName = '';
  for (let i = 0; i < consonants.length; i++) {
    vocalizedName += consonants[i] + phoneticResult.vowels[i];
  }
  
  // Add Angel suffix letters (إيل or אל)
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
  // Jinn: no additional suffix (suffix already subtracted in math)
  
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
    example: 'Adjuster(136) - 41 = 95 → Abjad letters → vocalized name'
  };
}