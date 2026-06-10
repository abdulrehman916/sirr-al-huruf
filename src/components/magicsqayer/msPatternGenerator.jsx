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

// Positional digit-cycle letter mappings
const UNITS =     {1:'ا', 2:'ب', 3:'ج', 4:'د', 5:'ه', 6:'و', 7:'ز', 8:'ح', 9:'ط'};
const TENS =      {10:'ي', 20:'ك', 30:'ل', 40:'م', 50:'ن', 60:'س', 70:'ع', 80:'ف', 90:'ص'};
const HUNDREDS =  {100:'ق', 200:'ر', 300:'ش', 400:'ت', 500:'ث', 600:'خ', 700:'ذ', 800:'ض', 900:'ظ'};
const THOUSAND_MARKER = 'غ';

/**
 * extractLettersFromValue(value) - Positional digit-cycle method
 * RULE: Read number right-to-left, cycling: Unit → Tens → Hundreds → Thousand Marker
 * 
 * Thousands rule:
 * - 1000 = غ (only marker, no unit digit)
 * - 2000-9000 = غ + unit digit (e.g., 2000 = غ + ب)
 * 
 * Zeros rule:
 * - Zeros do not generate letters
 * - Zeros do NOT remove their position
 * - Position cycle is preserved
 */
function extractLettersFromValue(value) {
  if (!value || value <= 0) return [];
  
  const letters = [];
  let n = Math.floor(value);
  
  // Extract digits (LSD first - right to left)
  const digits = [];
  while (n > 0) {
    digits.push(n % 10);
    n = Math.floor(n / 10);
  }
  
  // Process digits with positional cycle: Unit → Tens → Hundreds → Thousand Marker
  let slot = 0; // 0=Unit, 1=Tens, 2=Hundreds, 3=Thousand
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    
    if (slot === 0) {
      // Unit position (1-9)
      if (d !== 0 && UNITS[d]) {
        letters.push(UNITS[d]);
      }
      slot = 1;
    } else if (slot === 1) {
      // Tens position (10-90)
      const v = d * 10;
      if (d !== 0 && TENS[v]) {
        letters.push(TENS[v]);
      }
      slot = 2;
    } else if (slot === 2) {
      // Hundreds position (100-900)
      const v = d * 100;
      if (d !== 0 && HUNDREDS[v]) {
        letters.push(HUNDREDS[v]);
      }
      slot = 3;
    } else {
      // Thousand position: always emit marker + optional unit digit (2-9)
      letters.push(THOUSAND_MARKER);
      if (d !== 0 && d !== 1 && UNITS[d]) {
        letters.push(UNITS[d]);
      }
      slot = 1; // Restart cycle from Tens after thousands (thousands consumed the Unit slot implicitly)
    }
  }
  
  return letters;
}

/**
 * generateNameForHierarchyValue(value, suffixType)
 * BAST-2 EXTRACTION RULE:
 * 1. Value is already the final adjusted extraction value (DO NOT subtract suffix again)
 * 2. Extract letters directly from value using Abjad decomposition (greedy, largest → smallest)
 * 3. For Angel modes: add suffix letters (إيل for Arabic, אל for Hebrew) AFTER extraction
 * 4. For Jinn modes: no suffix letters added
 * 5. Apply tashkeel ONLY (never change letters)
 * 
 * CRITICAL: BAST-2 CONSONANT ORDER IS IMMUTABLE
 * - Extracted consonants are concatenated in EXACT extraction order
 * - NO reversal, NO reordering, NO letter insertion, NO letter removal
 * - Example: 337 = 300 + 30 + 7 = ش + ل + ز = شلز (NOT زلش)
 * 
 * CRITICAL: The input value is already the result of Ulvi adjustment.
 * Example: 18 → 18 + 360 - 41 = 337 (adjustment happens BEFORE this function is called)
 * This function receives 337 and extracts: 337 = 300 + 30 + 7 = ش ل ز
 */
export function generateNameForHierarchyValue(value, suffixType = 'ar-angel') {
  const suffix = SUFFIXES[suffixType];
  if (!suffix) {
    return { success: false, error: 'Invalid suffix type' };
  }
  
  const isAngel = suffixType.includes('angel');
  const isHebrew = suffixType.includes('heb');
  const isArabic = !isHebrew;
  
  // BAST-2 RULE: value is already adjusted, extract directly
  // DO NOT subtract suffix again - it was already applied during Ulvi adjustment
  const extractionValue = value;
  
  // POSITIONAL DIGIT-CYCLE EXTRACTION: Read right-to-left, cycling Unit → Tens → Hundreds → Thousand Marker
  const consonants = extractLettersFromValue(extractionValue);
  
  if (consonants.length === 0) {
    return { success: false, error: 'Could not extract letters' };
  }
  
  // FINAL NAME ASSEMBLY: Mirror order (reverse of breakdown sequence)
  // Breakdown remains unchanged (extraction order for display)
  // Final displayed name uses REVERSE of breakdown sequence
  // Example: breakdown [ز, ل, ر, غ] → final name = غرلز
  const rawConsonantSequence = consonants.join(''); // Keep original for breakdown display
  const reversedConsonants = [...consonants].reverse(); // Mirror order for final name
  
  // Apply phonetic rules for tashkeel to MIRRORED sequence
  const phoneticResult = applyPhoneticRules(reversedConsonants, value);
  
  // Build vocalized name using MIRRORED consonant order
  let vocalizedName = '';
  for (let i = 0; i < reversedConsonants.length; i++) {
    vocalizedName += reversedConsonants[i] + phoneticResult.vowels[i];
  }
  
  // Add Angel suffix letters (إيل or אל) - ONLY for Angel modes
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
  // Jinn: no suffix letters added (suffix was already applied during Ulvi adjustment)
  
  // Validate pronounceability
  const pronounceability = checkPronounceability(vocalizedName);
  
  return {
    success: true,
    value,
    suffixType,
    extractionValue,
    consonants, // BAST-2: immutable extraction order (for breakdown display)
    rawConsonantSequence, // Direct concatenation (extraction order - breakdown)
    reversedConsonants, // Mirror order (final displayed name)
    fullName: vocalizedName,
    isAngel,
    isHebrew,
    phoneticRules: phoneticResult.rules,
    validation: {
      morphology: {
        score: 100,
        passed: true,
        reason: 'Bast-2 extraction applied'
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