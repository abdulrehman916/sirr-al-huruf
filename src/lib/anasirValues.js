// Letter to element classification
export const ELEMENTS = {
  fire: {
    name: "Fire",
    arabic: "النار",
    letters: ['ا', 'ه', 'ط', 'م', 'ف', 'ش', 'ذ'],
    color: "#ff6a00",
    arabicColor: "#ffccaa",
    glow: "rgba(255, 80, 0, 0.5)",
    bg: "linear-gradient(135deg, rgba(255, 95, 31, 0.15), rgba(255, 0, 0, 0.1))",
    border: "rgba(255, 106, 0, 0.5)",
    icon: "🔥",
  },
  air: {
    name: "Air",
    arabic: "الهواء",
    letters: ['ج', 'ز', 'ك', 'س', 'ق', 'ت', 'ظ'],
    color: "#60a5fa",
    arabicColor: "#ffffff",
    glow: "rgba(96, 165, 250, 0.4)",
    bg: "rgba(96, 165, 250, 0.08)",
    border: "rgba(96, 165, 250, 0.4)",
    icon: "💨",
  },
  water: {
    name: "Water",
    arabic: "الماء",
    letters: ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'ض'],
    color: "#0ea5e9",
    arabicColor: "#ffffff",
    glow: "rgba(14, 165, 233, 0.4)",
    bg: "rgba(14, 165, 233, 0.08)",
    border: "rgba(14, 165, 233, 0.4)",
    icon: "💧",
  },
  earth: {
    name: "Earth",
    arabic: "الأرض",
    letters: ['ب', 'و', 'ي', 'ن', 'ص', 'ث', 'غ'],
    color: "#22c55e",
    arabicColor: "#ffffff",
    glow: "rgba(34, 197, 94, 0.4)",
    bg: "rgba(34, 197, 94, 0.08)",
    border: "rgba(34, 197, 94, 0.4)",
    icon: "🌍",
  },
};

// Normalize common Arabic letter variants
const NORMALIZE_MAP = {
  'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا',
  'ى': 'ي', 'ئ': 'ي',
  'ؤ': 'و',
  'ة': 'ه',
};

function normalize(char) {
  return NORMALIZE_MAP[char] || char;
}

// Build reverse lookup: letter → element key
const LETTER_TO_ELEMENT = {};
for (const [key, el] of Object.entries(ELEMENTS)) {
  for (const letter of el.letters) {
    LETTER_TO_ELEMENT[letter] = key;
  }
}

export function analyzeText(text) {
  const counts = { fire: 0, air: 0, water: 0, earth: 0 };
  const letterDetails = [];

  for (const char of text) {
    const norm = normalize(char);
    const element = LETTER_TO_ELEMENT[norm];
    if (element) {
      counts[element]++;
      letterDetails.push({ original: char, element });
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages = {};
  for (const key of Object.keys(counts)) {
    percentages[key] = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
  }

  const dominant = total > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return { counts, percentages, total, dominant, letterDetails };
}