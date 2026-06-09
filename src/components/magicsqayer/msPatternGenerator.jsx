// ═══════════════════════════════════════════════════════════════
//  PATTERN-BASED ARABIC NAME GENERATOR
//  Maps numeric values to 200+ authentic morphological patterns
// ═══════════════════════════════════════════════════════════════

import { MORPHOLOGICAL_PATTERNS } from './msPatterns';
import { validateName } from './msNameValidator';

// Valid Arabic consonants for name generation
const VALID_CONSONANTS = [
  'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

// Forbidden consonant sequences
const FORBIDDEN_SEQUENCES = [
  'غك', 'قغ', 'ظغ', 'غظ', 'كغ', 'غق', 'كش', 'نش', 'سش', 'غش',
  'طغ', 'ظط', 'غط', 'قك', 'كق', 'صك', 'كص', 'ضك', 'كض'
];

/**
 * selectPatternByNumber(number, category)
 * Select morphological pattern based on numeric value
 */
export function selectPatternByNumber(number, category = 'angel') {
  const patterns = MORPHOLOGICAL_PATTERNS.filter(p => p.category === category);
  if (patterns.length === 0) return null;
  
  // Deterministic selection based on number
  const idx = Math.abs(number) % patterns.length;
  return patterns[idx];
}

/**
 * extractConsonantsFromNumber(number)
 * Extract 2-4 consonants from number using phonetic mapping
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
      // Check for forbidden sequences
      if (consonants.length > 0) {
        const seq = consonants[consonants.length - 1] + consonant;
        if (FORBIDDEN_SEQUENCES.includes(seq)) {
          temp = Math.floor(temp / 10);
          continue;
        }
      }
      consonants.push(consonant);
    }
    temp = Math.floor(temp / 10);
  }
  
  // Ensure minimum 2 consonants
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
 * applyPatternToConsonants(pattern, consonants)
 * Apply pattern template to consonants
 */
export function applyPatternToConsonants(pattern, consonants) {
  if (!pattern || !consonants || consonants.length === 0) return null;
  
  const template = pattern.template;
  let result = '';
  let cIdx = 0;
  
  // Map ف=first, ع=second, ل=third consonant
  const cMap = {
    'ف': consonants[0] || 'ب',
    'ع': consonants[1] || consonants[0] || 'ج',
    'ل': consonants[2] || consonants[0] || 'د'
  };
  
  for (let char of template) {
    if (['ف', 'ع', 'ل'].includes(char)) {
      result += cMap[char];
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * generatePatternBasedName(value, category)
 * Generate name using pattern-based approach
 */
export function generatePatternBasedName(value, category = 'angel') {
  const pattern = selectPatternByNumber(value, category);
  if (!pattern) {
    return { success: false, error: 'No pattern found', value, category };
  }
  
  const consonants = extractConsonantsFromNumber(value);
  if (consonants.length === 0) {
    return { success: false, error: 'No consonants', value, category };
  }
  
  const bareName = applyPatternToConsonants(pattern, consonants);
  if (!bareName) {
    return { success: false, error: 'Failed to apply pattern', value, category };
  }
  
  const validation = validateName(bareName, category === 'angel');
  
  return {
    success: true,
    value,
    category,
    pattern: {
      id: pattern.id,
      template: pattern.template,
      category: pattern.category,
      difficulty: pattern.difficulty,
      example: pattern.example
    },
    consonants,
    generatedName: bareName,
    validation: {
      score: validation.score,
      passed: validation.passed,
      failureReason: validation.failureReason,
      recommendation: validation.recommendation
    }
  };
}

/**
 * generateMultipleNames(count, category, startValue)
 * Generate multiple names
 */
export function generateMultipleNames(count, category = 'angel', startValue = 1) {
  const results = [], failed = [];
  
  for (let i = 0; i < count; i++) {
    const result = generatePatternBasedName(startValue + i, category);
    if (result.success) {
      if (result.validation.passed) results.push(result);
      else failed.push(result);
    } else {
      failed.push(result);
    }
  }
  
  return {
    generated: results,
    failed,
    total: count,
    passRate: ((results.length / count) * 100).toFixed(1) + '%',
    category
  };
}

/**
 * getNameForHierarchyValue(value, suffixType)
 * Generate name for hierarchy level
 */
export function getNameForHierarchyValue(value, suffixType = 'ar-angel') {
  const category = suffixType.includes('angel') ? 'angel' : 
                   suffixType.includes('jinn') ? 'jinn' : 'general';
  return generatePatternBasedName(value, category);
}

/**
 * getPatternInfo(patternId)
 * Get pattern details
 */
export function getPatternInfo(patternId) {
  const pattern = MORPHOLOGICAL_PATTERNS.find(p => p.id === patternId);
  if (!pattern) return null;
  
  return {
    id: pattern.id,
    template: pattern.template,
    category: pattern.category,
    syllables: pattern.syllables,
    difficulty: pattern.difficulty,
    example: pattern.example
  };
}