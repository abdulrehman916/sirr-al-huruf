// Abjad Kebir (Ebced-i Kebir) values
const ABJAD_MAP = {
  'ا': 1,
  'ب': 2,
  'ج': 3,
  'د': 4,
  'ه': 5,
  'و': 6,
  'ز': 7,
  'ح': 8,
  'ط': 9,
  'ي': 10,
  'ك': 20,
  'ل': 30,
  'م': 40,
  'ن': 50,
  'س': 60,
  'ع': 70,
  'ف': 80,
  'ص': 90,
  'ق': 100,
  'ر': 200,
  'ش': 300,
  'ت': 400,
  'ث': 500,
  'خ': 600,
  'ذ': 700,
  'ض': 800,
  'ظ': 900,
  'غ': 1000,
};

// Common Arabic letter variants that map to base letters
const NORMALIZE_MAP = {
  'أ': 'ا',
  'إ': 'ا',
  'آ': 'ا',
  'ٱ': 'ا',
  'ى': 'ي',
  'ئ': 'ي',
  'ؤ': 'و',
  'ة': 'ه',
};

export function normalizeArabicLetter(letter) {
  return NORMALIZE_MAP[letter] || letter;
}

export function getAbjadValue(letter) {
  const normalized = normalizeArabicLetter(letter);
  return ABJAD_MAP[normalized] || 0;
}

export function isArabicLetter(char) {
  const normalized = normalizeArabicLetter(char);
  return normalized in ABJAD_MAP;
}

export function processText(text) {
  const letters = [];
  for (const char of text) {
    if (isArabicLetter(char)) {
      const normalized = normalizeArabicLetter(char);
      letters.push({
        original: char,
        normalized,
        value: ABJAD_MAP[normalized],
      });
    }
  }
  const total = letters.reduce((sum, l) => sum + l.value, 0);
  return { letters, total, count: letters.length };
}

export { ABJAD_MAP };