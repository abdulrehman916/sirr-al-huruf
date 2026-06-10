// ═══════════════════════════════════════════════════════════════
//  ARABIC NAME GENERATOR — MORPHOLOGY & PHONOLOGY BASED
//  Uses authentic roots, patterns, and phonetic rules
// ═══════════════════════════════════════════════════════════════

import {
  extractRootFromName,
  extractBareConsonants,
  isValidRoot,
  validateMorphologicalStructure,
  getAuthenticRootForValue,
  generateNameFromRoot,
} from './msMorphologyEngine';
import {
  applyPhoneticRules,
  vocalizeWord,
  checkPronounceability,
  VOWELS
} from './msPhonologyEngine';

const FORBIDDEN_CLUSTERS = [
  'غك', 'قغ', 'ظغ', 'غظ', 'كغ', 'غق', 'كش', 'نش', 'سش', 'غش',
  'طغ', 'ظط', 'غط', 'قك', 'كق', 'صك', 'كص', 'ضك', 'كض'
];

/**
 * extractConsonantsFromNumber(number)
 * Extract consonants from numeric value
 */
export function extractConsonantsFromNumber(number) {
  const n = Math.abs(number);
  const digitMap = {
    0: 'ا', 1: 'ب', 2: 'ج', 3: 'د', 4: 'ر', 
    5: 'س', 6: 'ع', 7: 'ف', 8: 'ك', 9: 'ل'
  };
  
  const consonants = [];
  let temp = n;
  
  while (temp > 0 && consonants.length < 4) {
    const digit = temp % 10;
    const consonant = digitMap[digit];
    
    if (consonant && !['ا', 'و', 'ي'].includes(consonant)) {
      if (consonants.length > 0) {
        const seq = consonants[consonants.length - 1] + consonant;
        if (FORBIDDEN_CLUSTERS.includes(seq)) {
          temp = Math.floor(temp / 10);
          continue;
        }
      }
      consonants.push(consonant);
    }
    temp = Math.floor(temp / 10);
  }
  
  if (consonants.length < 2) {
    const defaults = ['ب', 'ج', 'د', 'ر', 'س', 'ع', 'ف', 'ك', 'ل', 'م'];
    while (consonants.length < 2) {
      const c = defaults[n % defaults.length];
      if (!consonants.includes(c)) consonants.push(c);
      n = Math.floor(n / 10);
    }
  }
  
  return consonants.slice(0, 4);
}

/**
 * generateNameWithValue(value, category)
 * Generate name using authentic morphology + phonology
 */
export function generateNameWithValue(value, category = 'angel') {
  // Step 1: Get authentic root for value
  const authenticRoot = getAuthenticRootForValue(value);
  
  // Step 2: Generate name from root using proper pattern
  const rootGenerated = generateNameFromRoot(authenticRoot, category);
  
  if (rootGenerated && rootGenerated.name) {
    // Apply phonetic rules
    const consonants = extractBareConsonants(rootGenerated.name);
    const phoneticResult = applyPhoneticRules(consonants, value);
    const vocalized = vocalizeWord(consonants, phoneticResult.vowels);
    
    // Validate
    const morphology = validateMorphologicalStructure(vocalized);
    const pronounceability = checkPronounceability(vocalized);
    
    return {
      success: true,
      value,
      category,
      method: 'authentic-root',
      root: authenticRoot.join(''),
      pattern: rootGenerated.pattern,
      fullName: vocalized,
      consonants,
      phoneticRules: phoneticResult.rules,
      validation: {
        morphology: {
          score: morphology.score,
          passed: morphology.valid,
          reason: morphology.reason
        },
        phonology: {
          score: pronounceability.score,
          passed: pronounceability.pronounceable,
          reason: pronounceability.reason
        },
        overall: {
          score: Math.round((morphology.score + pronounceability.score) / 2),
          passed: morphology.valid && pronounceability.pronounceable
        }
      }
    };
  }
  
  // Fallback: use extracted consonants with phonology
  const consonants = extractConsonantsFromNumber(value);
  const phoneticResult = applyPhoneticRules(consonants, value);
  const baseName = vocalizeWord(consonants, phoneticResult.vowels);
  
  // Add إيل ending for angels
  let fullName = baseName;
  if (category === 'angel') {
    const lastVowel = phoneticResult.vowels[phoneticResult.vowels.length - 1] || VOWELS.KASRA;
    fullName = baseName.replace(/[\u064E\u0650\u064F\u0652]$/, '') + lastVowel + 'ي' + VOWELS.FATHA + 'ل';
  }
  
  const morphology = validateMorphologicalStructure(fullName);
  const pronounceability = checkPronounceability(fullName);
  
  return {
    success: true,
    value,
    category,
    method: 'phonology-based',
    root: consonants.slice(0, 3).join(''),
    pattern: 'derived',
    fullName,
    consonants,
    phoneticRules: phoneticResult.rules,
    validation: {
      morphology: {
        score: morphology.score,
        passed: morphology.valid,
        reason: morphology.reason
      },
      phonology: {
        score: pronounceability.score,
        passed: pronounceability.pronounceable,
        reason: pronounceability.reason
      },
      overall: {
        score: Math.round((morphology.score + pronounceability.score) / 2),
        passed: morphology.valid && pronounceability.pronounceable
      }
    }
  };
}

/**
 * getNameForHierarchyValue(value, suffixType)
 */
export function getNameForHierarchyValue(value, suffixType = 'ar-angel') {
  const category = suffixType.includes('angel') ? 'angel' : 'jinn';
  return generateNameWithValue(value, category);
}

/**
 * getPatternInfo(patternId)
 */
export function getPatternInfo(patternId) {
  return {
    id: patternId || 'morphology-based',
    template: 'authentic-root-pattern',
    category: 'derived',
    syllables: 'variable',
    difficulty: 2,
    example: 'جَبْريل'
  };
}