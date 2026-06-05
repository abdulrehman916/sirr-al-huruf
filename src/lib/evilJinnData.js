// Evil Jinn Names Database
export const EVIL_JINN_NAMES = [
  {
    id: 1,
    serialNo: 1,
    arabicName: "مَهْمَس",
    arabicHarakat: "مَهْمَس",
    englishName: "Mahmas",
    abjadValue: 145,
    letterCount: 3,
    breakdown: [
      { letter: "م", value: 40 },
      { letter: "ه", value: 5 },
      { letter: "م", value: 40 },
      { letter: "س", value: 60 }
    ]
  },
  {
    id: 2,
    serialNo: 2,
    arabicName: "بَرْقَن",
    arabicHarakat: "بَرْقَن",
    englishName: "Barqan",
    abjadValue: 352,
    letterCount: 5,
    breakdown: [
      { letter: "ب", value: 2 },
      { letter: "ر", value: 200 },
      { letter: "ق", value: 100 },
      { letter: "ن", value: 50 }
    ]
  },
  {
    id: 3,
    serialNo: 3,
    arabicName: "شَمْهُوش",
    arabicHarakat: "شَمْهُوش",
    englishName: "Shamhush",
    abjadValue: 556,
    letterCount: 6,
    breakdown: [
      { letter: "ش", value: 300 },
      { letter: "م", value: 40 },
      { letter: "ه", value: 5 },
      { letter: "و", value: 6 },
      { letter: "ش", value: 300 }
    ]
  },
  {
    id: 4,
    serialNo: 4,
    arabicName: "فَقْطُوس",
    arabicHarakat: "فَقْطُوس",
    englishName: "Faqthus",
    abjadValue: 496,
    letterCount: 6,
    breakdown: [
      { letter: "ف", value: 80 },
      { letter: "ق", value: 100 },
      { letter: "ط", value: 9 },
      { letter: "و", value: 6 },
      { letter: "س", value: 60 }
    ]
  },
  {
    id: 5,
    serialNo: 5,
    arabicName: "مَرُّو",
    arabicHarakat: "مَرُّو",
    englishName: "Marroo",
    abjadValue: 246,
    letterCount: 3,
    breakdown: [
      { letter: "م", value: 40 },
      { letter: "ر", value: 200 },
      { letter: "و", value: 6 }
    ]
  },
  {
    id: 6,
    serialNo: 6,
    arabicName: "شَكَرْتِي",
    arabicHarakat: "شَكَرْتِي",
    englishName: "Shakarti",
    abjadValue: 622,
    letterCount: 6,
    breakdown: [
      { letter: "ش", value: 300 },
      { letter: "ك", value: 20 },
      { letter: "ر", value: 200 },
      { letter: "ت", value: 400 },
      { letter: "ي", value: 10 }
    ]
  },
  {
    id: 7,
    serialNo: 7,
    arabicName: "مَيْمُور",
    arabicHarakat: "مَيْمُور",
    englishName: "Maymoor",
    abjadValue: 256,
    letterCount: 5,
    breakdown: [
      { letter: "م", value: 40 },
      { letter: "ي", value: 10 },
      { letter: "م", value: 40 },
      { letter: "و", value: 6 },
      { letter: "ر", value: 200 }
    ]
  },
  {
    id: 8,
    serialNo: 8,
    arabicName: "سَامُوج",
    arabicHarakat: "سَامُوج",
    englishName: "Samooj",
    abjadValue: 109,
    letterCount: 4,
    breakdown: [
      { letter: "س", value: 60 },
      { letter: "ا", value: 1 },
      { letter: "م", value: 40 },
      { letter: "و", value: 6 },
      { letter: "ج", value: 3 }
    ]
  },
  {
    id: 9,
    serialNo: 9,
    arabicName: "نَحُوش",
    arabicHarakat: "نَحُوش",
    englishName: "Nahush",
    abjadValue: 364,
    letterCount: 4,
    breakdown: [
      { letter: "ن", value: 50 },
      { letter: "ح", value: 8 },
      { letter: "و", value: 6 },
      { letter: "ش", value: 300 }
    ]
  },
  {
    id: 10,
    serialNo: 10,
    arabicName: "بَهْمُور",
    arabicHarakat: "بَهْمُور",
    englishName: "Bahmoor",
    abjadValue: 253,
    letterCount: 5,
    breakdown: [
      { letter: "ب", value: 2 },
      { letter: "ه", value: 5 },
      { letter: "م", value: 40 },
      { letter: "و", value: 6 },
      { letter: "ر", value: 200 }
    ]
  }
];

export const EVIL_JINN_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "low", label: "Low (1-100)", min: 0, max: 100 },
  { id: "medium", label: "Medium (101-300)", min: 101, max: 300 },
  { id: "high", label: "High (301+)", min: 301, max: Infinity }
];