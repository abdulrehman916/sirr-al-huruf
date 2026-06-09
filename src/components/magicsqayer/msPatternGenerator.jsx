// ═══════════════════════════════════════════════════════════════
//  PATTERN-BASED ARABIC NAME GENERATOR
//  Contextual ending formation with varied pre-īl syllables
// ═══════════════════════════════════════════════════════════════

import { MORPHOLOGICAL_PATTERNS } from './msPatterns';
import { validateName } from './msNameValidator';

// Valid Arabic consonants
const VALID_CONSONANTS = [
  'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

// Forbidden sequences
const FORBIDDEN_SEQUENCES = [
  'غك', 'قغ', 'ظغ', 'غظ', 'كغ', 'غق', 'كش', 'نش', 'سش', 'غش',
  'طغ', 'ظط', 'غط', 'قك', 'كق', 'صك', 'كص', 'ضك', 'كض'
];

// Pre-īl syllable patterns (varied structures)
const PRE_IL_SYLLABLES = [
  { pattern: 'رِ', vowels: 'ِ', consonant: 'ر' },      // -rīl (جِبْرِيل)
  { pattern: 'فِ', vowels: 'ِ', consonant: 'ف' },      // -fīl (إِسْرَافِيل)
  { pattern: 'زْ', vowels: '', consonant: 'ز' },       // -zāʾīl (عَزْرَائِيل)
  { pattern: 'كْ', vowels: '', consonant: 'ك' },       // -kāʾīl (مِيكَائِيل)
  { pattern: 'بِ', vowels: 'ِ', consonant: 'ب' },      // -bīl
  { pattern: 'لِ', vowels: 'ِ', consonant: 'ل' },      // -līl
  { pattern: 'مِ', vowels: 'ِ', consonant: 'م' },      // -mīl
  { pattern: 'نِ', vowels: 'ِ', consonant: 'ن' },      // -nīl
  { pattern: 'سِ', vowels: 'ِ', consonant: 'س' },      // -sīl
  { pattern: 'عِ', vowels: 'ِ', consonant: 'ع' },      // -ʿīl
  { pattern: 'قِ', vowels: 'ِ', consonant: 'ق' },      // -qīl
  { pattern: 'هِ', vowels: 'ِ', consonant: 'ه' },      // -hīl
];

/**
 * selectPatternByNumber(number, category)
 */
export function selectPatternByNumber(number, category = 'angel') {
  const patterns = MORPHOLOGICAL_PATTERNS.filter(p => p.category === category);
  if (patterns.length === 0) return null;
  
  const idx = Math.abs(number) % patterns.length;
  return patterns[idx];
}

/**
 * extractConsonantsFromNumber(number)
 * Extract 2-4 consonants with phonetic validation
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
 * buildContextualEnding(consonants, number)
 * Build varied pre-īl syllable based on consonants
 */
export function buildContextualEnding(consonants, number) {
  if (!consonants || consonants.length === 0) {
    return { syllable: 'رِ', consonant: 'ر' };
  }
  
  // Select pre-īl consonant based on number (deterministic but varied)
  const idx = Math.abs(number) % PRE_IL_SYLLABLES.length;
  const syllableData = PRE_IL_SYLLABLES[idx];
  
  // Check if selected consonant creates forbidden sequence
  const lastConsonant = consonants[consonants.length - 1];
  const sequence = lastConsonant + syllableData.consonant;
  
  if (FORBIDDEN_SEQUENCES.includes(sequence)) {
    // Try next available consonant
    for (let i = 1; i < PRE_IL_SYLLABLES.length; i++) {
      const altIdx = (idx + i) % PRE_IL_SYLLABLES.length;
      const alt = PRE_IL_SYLLABLES[altIdx];
      if (!FORBIDDEN_SEQUENCES.includes(lastConsonant + alt.consonant)) {
        return { syllable: alt.pattern, consonant: alt.consonant };
      }
    }
  }
  
  return { syllable: syllableData.pattern, consonant: syllableData.consonant };
}

/**
 * applyPatternWithVariedEnding(pattern, consonants, value)
 * Apply pattern with contextual pre-īl ending
 */
export function applyPatternWithVariedEnding(pattern, consonants, value) {
  if (!pattern || !consonants || consonants.length === 0) return null;
  
  const template = pattern.template;
  const isAngelPattern = pattern.category === 'angel';
  
  let result = '';
  let cIdx = 0;
  
  // Map ف=first, ع=second, ل=third consonant
  const cMap = {
    'ف': consonants[0] || 'ب',
    'ع': consonants[1] || consonants[0] || 'ج',
    'ل': consonants[2] || consonants[0] || 'د'
  };
  
  // Build name from template
  for (let i = 0; i < template.length; i++) {
    const char = template[i];
    
    if (['ف', 'ع', 'ل'].includes(char)) {
      result += cMap[char];
    } else if (['ا', 'و', 'ي', 'ى', 'آ', 'أ', 'إ'].includes(char)) {
      // Long vowel - keep as is
      result += char;
    } else if (['َ', 'ِ', 'ُ', 'ْ', 'ّ'].includes(char)) {
      // Vowel mark - keep as is
      result += char;
    } else {
      // Other characters - keep
      result += char;
    }
  }
  
  // For angel patterns, ensure varied pre-īl ending
  if (isAngelPattern && !result.endsWith('إيل')) {
    // Build contextual ending
    const endingData = buildContextualEnding(consonants, value);
    
    // Remove any existing 'يل' ending and replace with contextual one + إيل
    const baseName = result.replace(/يل$/, '');
    result = baseName + endingData.syllable + 'يل';
  }
  
  return result;
}

/**
 * generatePatternBasedName(value, category)
 * Generate name with contextual ending formation
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
  
  const generatedName = applyPatternWithVariedEnding(pattern, consonants, value);
  if (!generatedName) {
    return { success: false, error: 'Failed to apply pattern', value, category };
  }
  
  const validation = validateName(generatedName, category === 'angel');
  
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
    generatedName,
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
 */
export function getNameForHierarchyValue(value, suffixType = 'ar-angel') {
  const category = suffixType.includes('angel') ? 'angel' : 
                   suffixType.includes('jinn') ? 'jinn' : 'general';
  return generatePatternBasedName(value, category);
}

/**
 * getPatternInfo(patternId)
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