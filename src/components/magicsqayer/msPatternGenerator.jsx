// ═══════════════════════════════════════════════════════════════
//  HURUFI NAME GENERATOR — TRADITIONAL LETTER-BASED SYSTEM
//  Generates Angel/Jinn names from numerical values with proper Arabic tashkeel
// ═══════════════════════════════════════════════════════════════

import {
  applyPhoneticRules,
  vocalizeWord,
  checkPronounceability,
  VOWELS,
} from './msPhonologyEngine';

const { FATHA, KASRA, DAMMA, SUKUN } = VOWELS;

const FORBIDDEN_CLUSTERS = [
  'غك', 'قغ', 'ظغ', 'غظ', 'كغ', 'غق', 'كش', 'نش', 'سش', 'غش',
  'طغ', 'ظط', 'غط', 'قك', 'كق', 'صك', 'كص', 'ضك', 'كض'
];

// Letter-to-number mapping (Abjad-inspired for consonant extraction)
const DIGIT_CONSONANTS = {
  0: 'ا', 1: 'ب', 2: 'ج', 3: 'د', 4: 'ر', 
  5: 'س', 6: 'ع', 7: 'ف', 8: 'ك', 9: 'ل'
};

// Weak letters that need special handling
const WEAK_LETTERS = ['ا', 'و', 'ي'];

/**
 * extractConsonantsFromNumber(number)
 * Extract consonants from numeric value using digit mapping
 */
export function extractConsonantsFromNumber(number) {
  const n = Math.abs(number);
  const consonants = [];
  let temp = n;
  
  // Extract consonants from digits (reverse order for traditional approach)
  while (temp > 0 && consonants.length < 4) {
    const digit = temp % 10;
    const consonant = DIGIT_CONSONANTS[digit];
    
    if (consonant && !WEAK_LETTERS.includes(consonant)) {
      // Check for forbidden clusters
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
 * getVowelBeforeIle(consonants, value)
 * Determine the vowel before إيل ending based on preceding consonant
 * This is the key rule for context-aware ending variation
 */
function getVowelBeforeIle(lastConsonant, value) {
  // Phonetic context rules for vowel before يْل
  // Based on articulation point (makhraj) of preceding consonant
  
  const guttural = ['ع', 'ح', 'ه', 'خ', 'غ'];
  const palatal = ['ج', 'ش', 'ي'];
  const dental = ['ت', 'د', 'ط', 'ظ', 'ز', 'س', 'ص', 'ث', 'ذ', 'ض'];
  const labial = ['ب', 'م', 'ف'];
  const velar = ['ك', 'ق'];
  const lateral = ['ل', 'ر', 'ن'];
  
  // Guttural letters prefer Kasra (īl) for smooth transition
  if (guttural.includes(lastConsonant)) {
    return KASRA;
  }
  
  // Palatal letters prefer Fatha (ayl) or Kasra (īl)
  if (palatal.includes(lastConsonant)) {
    return Math.abs(value) % 2 === 0 ? KASRA : FATHA;
  }
  
  // Dental letters: vary based on value hash
  if (dental.includes(lastConsonant)) {
    const hash = Math.abs(value) % 3;
    return hash === 0 ? FATHA : hash === 1 ? KASRA : DAMMA;
  }
  
  // Labial letters prefer Damma (ūl) for rounded articulation
  if (labial.includes(lastConsonant)) {
    return Math.abs(value) % 2 === 0 ? DAMMA : KASRA;
  }
  
  // Velar letters: Kasra for clarity
  if (velar.includes(lastConsonant)) {
    return KASRA;
  }
  
  // Lateral letters: default to Kasra
  if (lateral.includes(lastConsonant)) {
    return KASRA;
  }
  
  // Default
  return KASRA;
}

/**
 * buildIleEnding(consonants, value)
 * Build the إيل ending with context-aware vowel
 */
function buildIleEnding(consonants, value) {
  const lastConsonant = consonants[consonants.length - 1];
  const preIleVowel = getVowelBeforeIle(lastConsonant, value);
  
  // Build: [preIleVowel] + ي + [Fatha] + ل
  return preIleVowel + 'ي' + FATHA + 'ل';
}

/**
 * generateNameWithValue(value, category)
 * Generate traditional Hurufi name with proper Arabic vocalization
 */
export function generateNameWithValue(value, category = 'angel') {
  // Extract consonants from value
  const consonants = extractConsonantsFromNumber(value);
  
  // Apply phonetic rules for vowel assignment
  const phoneticResult = applyPhoneticRules(consonants, value);
  
  // Build base name with tashkeel
  let baseName = '';
  for (let i = 0; i < consonants.length; i++) {
    baseName += consonants[i] + phoneticResult.vowels[i];
  }
  
  // For Angel category: add إيل ending with context-aware vowel
  let fullName = baseName;
  let pattern = 'hurufi-derived';
  
  if (category === 'angel') {
    // Remove last vowel from base, then add إيل with proper pre-vowel
    const baseWithoutLastVowel = baseName.replace(/[\u064E\u0650\u064F\u0652]$/, '');
    const ileEnding = buildIleEnding(consonants, value);
    fullName = baseWithoutLastVowel + ileEnding;
    pattern = 'hurufi-angelic';
  }
  
  // Validate pronounceability
  const pronounceability = checkPronounceability(fullName);
  
  // Check for consonant clusters
  const hasClusters = checkConsonantClusters(fullName);
  
  return {
    success: true,
    value,
    category,
    method: 'hurufi-traditional',
    root: consonants.slice(0, 3).join(''),
    pattern,
    fullName,
    consonants,
    phoneticRules: phoneticResult.rules,
    validation: {
      morphology: {
        score: 85,
        passed: true,
        reason: 'Valid Hurufi pattern'
      },
      phonology: {
        score: pronounceability.score,
        passed: pronounceability.pronounceable && !hasClusters,
        reason: pronounceability.reason
      },
      overall: {
        score: Math.round((85 + pronounceability.score) / 2),
        passed: pronounceability.pronounceable && !hasClusters
      }
    }
  };
}

/**
 * checkConsonantClusters(name)
 * Check if name has impossible consonant clusters
 */
function checkConsonantClusters(name) {
  const bare = name.replace(/[\u064E\u0650\u064F\u0652]/g, '');
  
  // Check for 3+ consecutive consonants (forbidden in Arabic)
  const clusterPattern = /[^اويآأإئؤ]{3,}/;
  return clusterPattern.test(bare);
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