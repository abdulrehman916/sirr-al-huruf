// ═══════════════════════════════════════════════════════════════
//  ARABIC PHONOLOGY ENGINE — علم الأصوات العربية
//  Authentic phonetic rules for dynamic vowel assignment
// ═══════════════════════════════════════════════════════════════

// Vowel marks
export const VOWELS = {
  FATHA: '\u064E',    // َ
  KASRA: '\u0650',    // ِ
  DAMMA: '\u064F',    // ُ
  SUKUN: '\u0652',    // ْ
  SHADDA: '\u0651',   // ّ
};

// Consonant classes by articulation point (مخارج الحروف)
const CONSONANT_CLASSES = {
  HALQI: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'],      // Throat
  LAHAWI: ['ق', 'ك', 'ج', 'ش', 'ض', 'ي', 'ل', 'ن', 'ر', 'ت', 'د', 'ط', 'ث', 'ظ', 'ذ', 'ز', 'س', 'ص'],  // Tongue
  SHATAWI: ['ب', 'م', 'و', 'ف'],              // Lips
};

// Forbidden consonant clusters
const FORBIDDEN_CLUSTERS = [
  'غك', 'قغ', 'ظغ', 'غظ', 'كغ', 'غق', 'كش', 'نش', 'سش', 'غش',
  'طغ', 'ظط', 'غط', 'قك', 'كق', 'صك', 'كص', 'ضك', 'كض', 'غج', 'قج',
  'هق', 'هك', 'عق', 'عك', 'حك', 'حق', 'خك', 'خق',
];

/**
 * extractConsonantsFromNumber(number)
 * Extract 2-4 consonants based on numeric value
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
    
    // Skip long vowels
    if (consonant && !['ا', 'و', 'ي'].includes(consonant)) {
      // Check for forbidden cluster with previous consonant
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
 * getConsonantClass(consonant)
 */
export function getConsonantClass(consonant) {
  for (const [className, consonants] of Object.entries(CONSONANT_CLASSES)) {
    if (consonants.includes(consonant)) {
      return className;
    }
  }
  return 'UNKNOWN';
}

/**
 * applyPhoneticRules(consonants, number)
 * Apply authentic phonetic rules with value-based variation
 */
export function applyPhoneticRules(consonants, number) {
  if (!consonants || consonants.length === 0) return { vowels: [], rules: [] };
  
  const vowels = [];
  const rules = [];
  
  for (let i = 0; i < consonants.length; i++) {
    const c = consonants[i];
    const prevC = i > 0 ? consonants[i - 1] : null;
    const nextC = i < consonants.length - 1 ? consonants[i + 1] : null;
    
    let vowel = null;
    let rule = '';
    
    // Rule 1: First consonant - never Sukun
    if (i === 0) {
      // Use number to vary initial vowel
      const initType = Math.abs(number) % 3;
      if (initType === 0) {
        vowel = VOWELS.FATHA;
        rule = 'Initial Fatha';
      } else if (initType === 1) {
        vowel = VOWELS.KASRA;
        rule = 'Initial Kasra';
      } else {
        vowel = VOWELS.DAMMA;
        rule = 'Initial Damma';
      }
    }
    // Rule 2: Check forbidden cluster
    else if (nextC && FORBIDDEN_CLUSTERS.includes(c + nextC)) {
      vowel = VOWELS.KASRA;
      rule = `Kasra breaks ${c}${nextC}`;
    }
    // Rule 3: Throat letters prefer Fatha
    else if (CONSONANT_CLASSES.HALQI.includes(c)) {
      vowel = VOWELS.FATHA;
      rule = 'Throat letter → Fatha';
    }
    // Rule 4: ي prefers Kasra, و prefers Damma
    else if (c === 'ي') {
      vowel = VOWELS.KASRA;
      rule = 'Ya → Kasra';
    } else if (c === 'و') {
      vowel = VOWELS.DAMMA;
      rule = 'Waw → Damma';
    }
    // Rule 5: Pre-īl position (before ي + ل)
    else if (nextC === 'ي' && consonants[i + 2] === 'ل') {
      const preIlType = Math.abs(number) % 3;
      if (preIlType === 0) {
        vowel = VOWELS.KASRA;
        rule = 'Pre-īl Kasra';
      } else if (preIlType === 1) {
        vowel = VOWELS.FATHA;
        rule = 'Pre-īl Fatha';
      } else {
        vowel = VOWELS.SUKUN;
        rule = 'Pre-īl Sukun';
      }
    }
    // Rule 6: Middle consonants - vary based on position and number
    else if (i > 0 && i < consonants.length - 1) {
      const midType = (Math.abs(number) + i) % 3;
      if (midType === 0) {
        vowel = VOWELS.FATHA;
        rule = 'Middle Fatha';
      } else if (midType === 1) {
        vowel = VOWELS.KASRA;
        rule = 'Middle Kasra';
      } else {
        vowel = VOWELS.DAMMA;
        rule = 'Middle Damma';
      }
    }
    // Rule 7: Final consonant (before suffix)
    else {
      const finalType = Math.abs(number) % 2;
      if (finalType === 0) {
        vowel = VOWELS.FATHA;
        rule = 'Final Fatha';
      } else {
        vowel = VOWELS.SUKUN;
        rule = 'Final Sukun';
      }
    }
    
    vowels.push(vowel);
    rules.push(rule);
  }
  
  return { vowels, rules };
}

/**
 * vocalizeWord(consonants, vowels)
 */
export function vocalizeWord(consonants, vowels) {
  if (!consonants || !vowels || consonants.length !== vowels.length) return null;
  
  let word = '';
  for (let i = 0; i < consonants.length; i++) {
    word += consonants[i] + (vowels[i] || '');
  }
  
  return word;
}

/**
 * buildIilEnding(preIlVowel)
 * Build إيل ending with specified pre-īl vowel
 */
export function buildIilEnding(preIlVowel = VOWELS.KASRA) {
  return preIlVowel + 'ي' + VOWELS.FATHA + 'ل';
}

/**
 * checkPronounceability(word)
 */
export function checkPronounceability(word) {
  if (!word) return { pronounceable: false, reason: 'Empty word', score: 0 };
  
  const vowelMarks = word.match(/[\u064E\u0650\u064F\u0652]/g) || [];
  const vowelCount = vowelMarks.filter(v => v !== VOWELS.SUKUN).length;
  const sukunCount = vowelMarks.filter(v => v === VOWELS.SUKUN).length;
  const bareConsonants = word.replace(/[\u064E\u0650\u064F\u0652]/g, '').split('');
  const consonantCount = bareConsonants.length;
  
  // Check forbidden clusters
  for (let i = 0; i < bareConsonants.length - 1; i++) {
    const cluster = bareConsonants[i] + bareConsonants[i + 1];
    if (FORBIDDEN_CLUSTERS.includes(cluster)) {
      return { pronounceable: false, reason: `Forbidden cluster: ${cluster}`, score: 10 };
    }
  }
  
  // Check initial Sukun
  if (vowelMarks[0] === VOWELS.SUKUN) {
    return { pronounceable: false, reason: 'Initial Sukun', score: 0 };
  }
  
  // Calculate score
  const vowelRatio = vowelCount / consonantCount;
  const sukunRatio = sukunCount / consonantCount;
  
  let score = 100;
  if (vowelRatio < 0.4) score -= 30;
  if (sukunRatio > 0.25) score -= 25;
  if (consonantCount < 3 || consonantCount > 5) score -= 20;
  
  return {
    pronounceable: score >= 70,
    score: Math.max(0, score),
    vowelRatio: vowelRatio.toFixed(2),
    sukunRatio: sukunRatio.toFixed(2),
    reason: score >= 70 ? 'Valid' : 'Phonetic violation'
  };
}

/**
 * generateNameWithValue(value, category)
 * Main generation function with full phonology
 */
export function generateNameWithValue(value, category = 'angel') {
  const consonants = extractConsonantsFromNumber(value);
  if (consonants.length === 0) {
    return { success: false, error: 'No consonants', value };
  }
  
  const phoneticResult = applyPhoneticRules(consonants, value);
  const baseName = vocalizeWord(consonants, phoneticResult.vowels);
  
  if (!baseName) {
    return { success: false, error: 'Vocalization failed', value };
  }
  
  // Add إيل ending for angels
  let fullName = baseName;
  if (category === 'angel') {
    // Remove final vowel if exists, then add إيل
    const baseWithoutFinal = baseName.replace(/[\u064E\u0650\u064F\u0652]$/, '');
    const preIlVowel = phoneticResult.vowels[phoneticResult.vowels.length - 1] || VOWELS.KASRA;
    fullName = baseWithoutFinal + buildIilEnding(preIlVowel);
  }
  
  const pronounceability = checkPronounceability(fullName);
  
  return {
    success: true,
    value,
    category,
    consonants,
    phoneticRules: phoneticResult.rules,
    baseName,
    fullName,
    validation: {
      score: pronounceability.score,
      passed: pronounceability.pronounceable,
      failureReason: pronounceability.reason,
      metrics: {
        vowelRatio: pronounceability.vowelRatio,
        sukunRatio: pronounceability.sukunRatio
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
 * Placeholder for compatibility
 */
export function getPatternInfo(patternId) {
  return {
    id: patternId,
    template: 'phonology-based',
    category: 'generated',
    syllables: 'variable',
    difficulty: 2,
    example: 'dynamic'
  };
}