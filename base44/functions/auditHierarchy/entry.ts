import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Arabic Abjad values
const ARABIC_ABJAD = [
  { letter: 'ا', value: 1 },
  { letter: 'ب', value: 2 },
  { letter: 'ج', value: 3 },
  { letter: 'د', value: 4 },
  { letter: 'ه', value: 5 },
  { letter: 'و', value: 6 },
  { letter: 'ز', value: 7 },
  { letter: 'ح', value: 8 },
  { letter: 'ط', value: 9 },
  { letter: 'ي', value: 10 },
  { letter: 'ك', value: 20 },
  { letter: 'ل', value: 30 },
  { letter: 'م', value: 40 },
  { letter: 'ن', value: 50 },
  { letter: 'س', value: 60 },
  { letter: 'ع', value: 70 },
  { letter: 'ف', value: 80 },
  { letter: 'ص', value: 90 },
  { letter: 'ق', value: 100 },
  { letter: 'ر', value: 200 },
  { letter: 'ش', value: 300 },
  { letter: 'ت', value: 400 },
  { letter: 'ث', value: 500 },
  { letter: 'خ', value: 600 },
  { letter: 'ذ', value: 700 },
  { letter: 'ض', value: 800 },
  { letter: 'ظ', value: 900 },
  { letter: 'غ', value: 1000 },
];

const SUFFIXES = {
  'ar-angel': 41,
  'ar-jinn': 319,
};

const FATHA = '\u064E';
const KASRA = '\u0650';
const DAMMA = '\u064F';
const SUKUN = '\u0652';

function extractLettersFromValue(value) {
  if (!value || value <= 0) return { letters: [], steps: [] };
  
  const letters = [];
  const steps = [];
  let remaining = value;
  
  for (let i = ARABIC_ABJAD.length - 1; i >= 0 && remaining > 0; i--) {
    const { letter, value: abjadValue } = ARABIC_ABJAD[i];
    let count = 0;
    while (remaining >= abjadValue) {
      letters.push(letter);
      remaining -= abjadValue;
      count++;
    }
    if (count > 0) {
      steps.push(`${abjadValue} × ${count} = ${letter}${count > 1 ? '×' + count : ''}`);
    }
  }
  
  return { letters, steps };
}

function applyPhoneticRules(letters, value) {
  const vowels = [];
  const rules = [];
  
  for (let i = 0; i < letters.length; i++) {
    const c = letters[i];
    let vowel = FATHA;
    let rule = 'Default Fatha';
    
    if (i === 0) {
      vowel = FATHA;
      rule = 'Initial Fatha';
    } else if (c === 'ي') {
      vowel = KASRA;
      rule = 'Ya takes Kasra';
    } else if (c === 'و') {
      vowel = DAMMA;
      rule = 'Waw takes Damma';
    } else {
      const vowelType = (Math.abs(value) + i) % 3;
      if (vowelType === 0) { vowel = FATHA; rule = 'Fatha'; }
      else if (vowelType === 1) { vowel = KASRA; rule = 'Kasra'; }
      else { vowel = DAMMA; rule = 'Damma'; }
    }
    
    vowels.push(vowel);
    rules.push(rule);
  }
  
  return { vowels, rules };
}

function getContextAwareVowel(lastConsonant, value) {
  const guttural = ['ع', 'ح', 'ه', 'خ', 'غ'];
  const palatal = ['ج', 'ش', 'ي'];
  const labial = ['ب', 'م', 'ف'];
  
  if (guttural.includes(lastConsonant)) return KASRA;
  if (palatal.includes(lastConsonant)) return Math.abs(value) % 2 === 0 ? KASRA : FATHA;
  if (labial.includes(lastConsonant)) return Math.abs(value) % 2 === 0 ? DAMMA : KASRA;
  return KASRA;
}

function generateName(value, suffixType) {
  const suffix = SUFFIXES[suffixType];
  const isAngel = suffixType === 'ar-angel';
  
  let remainder = value - suffix;
  const underflow = remainder <= 0;
  if (underflow) {
    remainder = value + 360 - suffix;
  }
  
  const { letters, steps } = extractLettersFromValue(remainder);
  const phoneticResult = applyPhoneticRules(letters, value);
  
  const nameBefore = letters.join('');
  
  let vocalizedName = '';
  for (let i = 0; i < letters.length; i++) {
    vocalizedName += letters[i] + phoneticResult.vowels[i];
  }
  
  if (isAngel) {
    vocalizedName = vocalizedName.replace(/[\u064E\u0650\u064F\u0652]$/, '');
    const preVowel = getContextAwareVowel(letters[letters.length - 1], value);
    vocalizedName += preVowel + 'ي' + FATHA + 'ل';
  }
  
  return {
    value,
    suffixType,
    remainder,
    underflow,
    extractionSteps: steps,
    letters,
    nameBefore,
    nameAfter: vocalizedName,
    phoneticRules: phoneticResult.rules
  };
}

function getFormula(tier) {
  const formulas = {
    Usurper: '(mc - triangle(n)) / n',
    Guide: 'usurper + n² - 1',
    Mystery: 'usurper + guide',
    Adjuster: 'mc (Magic Constant)',
    Leader: 'adjuster × n',
    Regulator: 'adjuster × (n + 1)',
    GeneralGovernor: 'adjuster × 2 × (n + 1)',
    HighOverseer: 'generalGov × guide'
  };
  return formulas[tier] || 'N/A';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const mc = 66;
    const n = 3;
    const triangle = n * (n * n - 1) / 2;
    
    const hierarchy = {
      Usurper: (mc - triangle) / n,
      Guide: ((mc - triangle) / n) + n * n - 1,
      Mystery: ((mc - triangle) / n) + (((mc - triangle) / n) + n * n - 1),
      Adjuster: mc,
      Leader: mc * n,
      Regulator: mc * (n + 1),
      GeneralGovernor: mc * 2 * (n + 1),
      HighOverseer: (mc * 2 * (n + 1)) * ((((mc - triangle) / n) + n * n - 1))
    };
    
    const audit = {};
    
    for (const [tier, value] of Object.entries(hierarchy)) {
      audit[tier] = {
        value: Math.floor(value),
        formula: getFormula(tier),
        arabicAngel: generateName(Math.floor(value), 'ar-angel'),
        arabicJinn: generateName(Math.floor(value), 'ar-jinn')
      };
    }
    
    return Response.json({
      mc,
      gridSize: n,
      triangleConstant: triangle,
      hierarchy: audit
    });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});