// ═══════════════════════════════════════════════════════════════
//  ARABIC NAME GENERATOR — AUTHENTIC PHONOLOGY
//  Generates names that follow actual Arabic morphological patterns
// ═══════════════════════════════════════════════════════════════

import { validateName } from './msNameValidator';

// Unicode combining harakat
const FATHA = '\u064E';
const KASRA = '\u0650';
const DAMMA = '\u064F';
const SUKUN = '\u0652';

// Long vowel letters
const MADD_LETTERS = new Set(['ا', 'و', 'ي', 'ى']);
const HAMZA_FORMS = new Set(['آ', 'أ', 'إ', 'ئ', 'ؤ']);
const VOWEL_CARRIERS = new Set([...MADD_LETTERS, ...HAMZA_FORMS]);

// Suffixes
const SUFFIX_ANGEL = 'إيل';
const SUFFIX_JINN  = 'طيش';

// Angel ending variants
const ANGEL_ENDING_VARIANTS = [
  { pattern: 'ائيل', vocalization: '\u0627\u0626\u0650\u064A\u0644\u0652' },
  { pattern: 'ييل',  vocalization: '\u064A\u0650\u064A\u0644\u0652' },
  { pattern: 'ؤيل',  vocalization: '\u0624\u0650\u064A\u0644\u0652' },
  { pattern: 'ئيل',  vocalization: '\u0626\u0650\u064A\u0644\u0652' },
];

const SUFFIX_ANGEL_VOC = '\u0625\u0650\u064A\u0644\u0652';
const SUFFIX_JINN_VOC  = '\u0637\u064E\u064A\u0652\u0634\u064F';

// Arabic Abjad for conversion
const AR_UNITS = { 1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط' };
const AR_TENS = { 10:'ي',20:'ك',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص' };
const AR_HUNDREDS = { 100:'ق',200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ' };
const AR_THOUSAND = 'غ';

/**
 * numToArabic(n)
 * Convert number to Arabic letters using positional Akram method
 */
function numToArabic(n) {
  if (!n || n < 1) return '';
  n = Math.floor(n);
  const digits = [];
  let tmp = n;
  while (tmp > 0) { digits.push(tmp % 10); tmp = Math.floor(tmp / 10); }
  
  const pieces = [];
  let i = 0, slot = 0;
  while (i < digits.length) {
    const d = digits[i];
    if (slot === 0) {
      if (d !== 0 && AR_UNITS[d]) pieces.push(AR_UNITS[d]);
      i++; slot = 1;
    } else if (slot === 1) {
      const v = d * 10;
      if (d !== 0 && AR_TENS[v]) pieces.push(AR_TENS[v]);
      i++; slot = 2;
    } else if (slot === 2) {
      const v = d * 100;
      if (d !== 0 && AR_HUNDREDS[v]) pieces.push(AR_HUNDREDS[v]);
      i++; slot = 3;
    } else {
      pieces.push(AR_THOUSAND);
      if (d !== 0 && d !== 1 && AR_UNITS[d]) pieces.push(AR_UNITS[d]);
      i++; slot = 1;
    }
  }
  return pieces.join('');
}

/**
 * detectAngelEndingVariant(name)
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
 */
function getHarakaForMadd(maddChar) {
  if (maddChar === 'ا' || maddChar === 'آ' || maddChar === 'أ' || maddChar === 'إ') return FATHA;
  if (maddChar === 'و' || maddChar === 'ؤ') return DAMMA;
  if (maddChar === 'ي' || maddChar === 'ئ') return KASRA;
  return FATHA;
}

/**
 * vocalizeArabicName(chars, isAngel)
 * Simple vocalization - every consonant gets a vowel
 */
function vocalizeArabicName(chars, isAngel) {
  const pattern = [];
  const n = chars.length;
  
  for (let i = 0; i < n; i++) {
    const ch = chars[i];
    const nextCh = chars[i + 1];
    
    if (MADD_LETTERS.has(ch) || HAMZA_FORMS.has(ch)) {
      pattern.push({ consonant: ch, vowel: null });
      continue;
    }
    
    if (i === 0) {
      pattern.push({ consonant: ch, vowel: FATHA });
      continue;
    }
    
    if (nextCh && VOWEL_CARRIERS.has(nextCh)) {
      if (MADD_LETTERS.has(nextCh)) {
        pattern.push({ consonant: ch, vowel: getHarakaForMadd(nextCh) });
      } else {
        pattern.push({ consonant: ch, vowel: FATHA });
      }
      continue;
    }
    
    if (isAngel) {
      const vowelCycle = [KASRA, FATHA, DAMMA];
      pattern.push({ consonant: ch, vowel: vowelCycle[i % 3] });
    } else {
      const vowelCycle = [FATHA, DAMMA, FATHA, KASRA];
      pattern.push({ consonant: ch, vowel: vowelCycle[i % 4] });
    }
  }
  
  return pattern;
}

/**
 * applySubtract(val, subtractVal)
 * Apply suffix subtraction with underflow fix
 */
function applySubtract(val, subtractVal) {
  return val < subtractVal ? val + 360 - subtractVal : val - subtractVal;
}

/**
 * generateArabicAngelName(val)
 * Generate angel name from value
 */
function generateArabicAngelName(val) {
  const r = applySubtract(val, 41);
  const letters = numToArabic(r);
  return { remainder: r, name: letters + SUFFIX_ANGEL };
}

/**
 * generateArabicJinnName(val)
 * Generate jinn name from value
 */
function generateArabicJinnName(val) {
  const r = applySubtract(val, 319);
  const letters = numToArabic(r);
  return { remainder: r, name: letters + SUFFIX_JINN };
}

/**
 * addTashkeelToArabicName(name, suffixType)
 * 
 * Generate vocalized name WITH VALIDATION
 * Returns { name, score, passed, validation, failureReason }
 */
export function addTashkeelToArabicName(name, suffixType) {
  if (!name || typeof name !== 'string') {
    return { name: null, score: 0, passed: false, failureReason: 'Invalid input' };
  }

  const isAngel = suffixType === 'angel';
  const bareSuffix = isAngel ? SUFFIX_ANGEL : SUFFIX_JINN;

  if (!name.endsWith(bareSuffix)) {
    return { name: null, score: 0, passed: false, failureReason: 'Invalid suffix' };
  }

  const body = name.slice(0, name.length - bareSuffix.length);
  
  // Get vocalized suffix
  let vocSuffix = isAngel ? SUFFIX_ANGEL_VOC : SUFFIX_JINN_VOC;
  if (isAngel) {
    const variant = detectAngelEndingVariant(name);
    if (variant) {
      vocSuffix = variant.vocalization;
    }
  }

  if (!body) {
    const vocalizedName = vocSuffix;
    const validation = validateName(vocalizedName, isAngel);
    return {
      name: vocalizedName,
      score: validation.score,
      passed: validation.passed,
      validation,
      failureReason: validation.passed ? null : validation.failureReason
    };
  }

  // Vocalize body
  const chars = [...body];
  const pattern = vocalizeArabicName(chars, isAngel);
  
  let out = '';
  for (const { consonant, vowel } of pattern) {
    out += vowel === null ? consonant : consonant + vowel;
  }

  const vocalizedName = out + vocSuffix;
  
  // VALIDATE
  const validation = validateName(vocalizedName, isAngel);
  
  return {
    name: vocalizedName,
    score: validation.score,
    passed: validation.passed,
    validation,
    failureReason: validation.passed ? null : validation.failureReason
  };
}

/**
 * generateValidatedNames(count, suffixType, minValue = 1)
 * Generate N names that pass validation
 */
export function generateValidatedNames(count, suffixType, minValue = 1) {
  const results = [];
  const failed = [];
  let val = minValue;
  
  while (results.length < count && val < 100000) {
    const generator = suffixType === 'angel' ? generateArabicAngelName : generateArabicJinnName;
    const base = generator(val);
    const result = addTashkeelToArabicName(base.name, suffixType);
    
    if (result.passed) {
      results.push({
        value: val,
        remainder: base.remainder,
        name: result.name,
        score: result.score
      });
    } else {
      failed.push({
        value: val,
        name: result.name,
        score: result.score,
        reason: result.failureReason
      });
    }
    
    val++;
  }
  
  return {
    generated: results,
    failed,
    total: results.length + failed.length,
    passRate: ((results.length / (results.length + failed.length)) * 100).toFixed(1) + '%'
  };
}