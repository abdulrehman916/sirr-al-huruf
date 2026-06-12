// Evil Jinn Names Database - Book of Deadly Names: Appendix of Jinn Names
// Source: Book of Deadly Names - Appendix of Jinn Names (Pages 216-221)
// Abjad values calculated using Abjad al-Kabir system

const calculateAbjad = (name) => {
  const abjadMap = {
    ا: 1, ب: 2, ج: 3, د: 4, ه: 5, و: 6, ز: 7, ح: 8, ط: 9,
    ي: 10, ك: 20, ل: 30, م: 40, ن: 50, س: 60, ع: 70, ف: 80,
    ص: 90, ق: 100, ر: 200, ش: 300, ت: 400, ث: 500, خ: 600,
    ذ: 700, ض: 800, ظ: 900, غ: 1000
  };
  
  return name.split('').reduce((sum, char) => sum + (abjadMap[char] || 0), 0);
};

const generateBreakdown = (name) => {
  const abjadMap = {
    ا: 1, ب: 2, ج: 3, د: 4, ه: 5, و: 6, ز: 7, ح: 8, ط: 9,
    ي: 10, ك: 20, ل: 30, م: 40, ن: 50, س: 60, ع: 70, ف: 80,
    ص: 90, ق: 100, ر: 200, ش: 300, ت: 400, ث: 500, خ: 600,
    ذ: 700, ض: 800, ظ: 900, غ: 1000
  };
  
  return name.split('').map(char => ({
    letter: char,
    value: abjadMap[char] || 0
  }));
};

// Helper to create bilingual details
const createDetails = (en, ml, source = "Book of Deadly Names, Pages 216-221") => ({
  en, ml, source
});

// Default placeholder details for entries without specific information
const defaultDetails = createDetails(
  {
    description: "Information from source manuscript",
    temperament: "Not specified",
    attributes: [],
    element: "Not specified",
    habitat: "Not specified",
    powers: "Not specified",
    warnings: "Standard caution advised"
  },
  {
    description: "ഗ്രന്ഥത്തിൽ നിന്നുള്ള വിവരങ്ങൾ",
    temperament: "വ്യക്തമല്ല",
    attributes: [],
    element: "വ്യക്തമല്ല",
    habitat: "വ്യക്തമല്ല",
    powers: "വ്യക്തമല്ല",
    warnings: "സാധാരണ മുൻകരുതൽ ആവശ്യമാണ്"
  }
);

export const EVIL_JINN_NAMES = [
  // 1-10: Original names with complete details
  {
    id: 1, serialNo: 1, arabicName: "مهمس", arabicHarakat: "مَهْمَس",
    englishName: "Mahmas", abjadValue: 145, letterCount: 4,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ه", value: 5 }, { letter: "م", value: 40 }, { letter: "س", value: 60 }],
    details: createDetails(
      {
        description: "A whispering jinn that causes fear and weakness",
        temperament: "Malevolent, causes trembling",
        attributes: ["Induces fear", "Causes physical weakness", "Creates illness"],
        element: "Not specified",
        habitat: "Mountainous regions",
        powers: "Can cause trembling and physical ailments in humans",
        warnings: "Known to afflict humans with unexplained weakness and fear"
      },
      {
        description: "വിറയലും ദൗർബല്യവും ഉണ്ടാക്കുന്ന ഒരു ജിന്ന്",
        temperament: "ദുഷ്ട സ്വഭാവം, വിറയൽ ഉണ്ടാക്കുന്നു",
        attributes: ["ഭയം ഉണ്ടാക്കുന്നു", "ശാരീരിക ദൗർബല്യം ഉണ്ടാക്കുന്നു", "രോഗങ്ങൾ സൃഷ്ടിക്കുന്നു"],
        element: "വ്യക്തമല്ല",
        habitat: "മലമ്പ്രദേശങ്ങൾ",
        powers: "മനുഷ്യരിൽ വിറയലും ശാരീരിക അസുഖങ്ങളും ഉണ്ടാക്കാൻ കഴിയും",
        warnings: "വിശദീകരിക്കാനാകാത്ത ദൗർബല്യവും ഭയവും ഉണ്ടാക്കുന്നു"
      }
    )
  },
  {
    id: 2, serialNo: 2, arabicName: "برقن", arabicHarakat: "بَرْقَن",
    englishName: "Barqan", abjadValue: 352, letterCount: 4,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ر", value: 200 }, { letter: "ق", value: 100 }, { letter: "ن", value: 50 }],
    details: createDetails(
      {
        description: "Fire-like jinn with fierce temperament",
        temperament: "Fiery, quick-tempered, aggressive",
        attributes: ["Sudden anger", "Creates conflict", "Causes restlessness"],
        element: "Fire",
        habitat: "Desolate places, ruins",
        powers: "Can incite sudden rage and disturbances",
        warnings: "Avoid provoking; associated with sudden outbursts"
      },
      {
        description: "തീപോലുള്ള രൂപവും ക്രൂരമായ സ്വഭാവവുമുള്ള ജിന്ന്",
        temperament: "അഗ്നി സ്വഭാവം, പെട്ടെന്നുള്ള കോപം, ആക്രമണോത്സുകം",
        attributes: ["പെട്ടെന്നുള്ള കോപം", "കലഹം സൃഷ്ടിക്കുന്നു", "അശാന്തി ഉണ്ടാക്കുന്നു"],
        element: "അഗ്നി (Fire)",
        habitat: "ശൂന്യപ്രദേശങ്ങൾ, അവശിഷ്ടങ്ങൾ",
        powers: "പെട്ടെന്നുള്ള കോപവും അശാന്തിയും ഉണ്ടാക്കാൻ കഴിയും",
        warnings: "പ്രകോപിപ്പിക്കരുത്; പെട്ടെന്നുള്ള കോപവുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു"
      }
    )
  },
  {
    id: 3, serialNo: 3, arabicName: "شمهوش", arabicHarakat: "شَمْهُوش",
    englishName: "Shamhush", abjadValue: 651, letterCount: 5,
    breakdown: [{ letter: "ش", value: 300 }, { letter: "م", value: 40 }, { letter: "ه", value: 5 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }],
    details: createDetails(
      {
        description: "Powerful jinn with high abjad value",
        temperament: "Strong, dominant",
        attributes: ["High spiritual power", "Influential"],
        element: "Not specified",
        habitat: "Not specified",
        powers: "Great influence due to high numerical value",
        warnings: "High abjad value indicates significant power"
      },
      {
        description: "ഉയർന്ന അബ്ജദ് മൂല്യമുള്ള ശക്തമായ ജിന്ന്",
        temperament: "ശക്തൻ, ആധിപത്യമുള്ളവൻ",
        attributes: ["ഉയർന്ന ആത്മീക ശക്തി", "സ്വാധീനശക്തി"],
        element: "വ്യക്തമല്ല",
        habitat: "വ്യക്തമല്ല",
        powers: "ഉയർന്ന സംഖ്യാ മൂല്യം കാരണം വലിയ സ്വാധീനം",
        warnings: "ഉയർന്ന അബ്ജദ് മൂല്യം ഗണ്യമായ ശക്തി സൂചിപ്പിക്കുന്നു"
      }
    )
  },
  {
    id: 4, serialNo: 4, arabicName: "فقطوس", arabicHarakat: "فَقْطُوس",
    englishName: "Faqthus", abjadValue: 255, letterCount: 5,
    breakdown: [{ letter: "ف", value: 80 }, { letter: "ق", value: 100 }, { letter: "ط", value: 9 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }],
    details: defaultDetails
  },
  {
    id: 5, serialNo: 5, arabicName: "مرو", arabicHarakat: "مَرُّو",
    englishName: "Marroo", abjadValue: 246, letterCount: 3,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }],
    details: defaultDetails
  },
  {
    id: 6, serialNo: 6, arabicName: "شكرتي", arabicHarakat: "شَكَرْتِي",
    englishName: "Shakarti", abjadValue: 930, letterCount: 5,
    breakdown: [{ letter: "ش", value: 300 }, { letter: "ك", value: 20 }, { letter: "ر", value: 200 }, { letter: "ت", value: 400 }, { letter: "ي", value: 10 }],
    details: createDetails(
      {
        description: "Very high value jinn with powerful letters",
        temperament: "Extremely powerful, volatile",
        attributes: ["Contains Taa (400)", "High numerical power"],
        element: "Fire (inferred from value)",
        habitat: "Not specified",
        powers: "Exceptional spiritual force",
        warnings: "Very high abjad value - extreme caution required"
      },
      {
        description: "ശക്തമായ അക്ഷരങ്ങളുള്ള വളരെ ഉയർന്ന മൂല്യമുള്ള ജിന്ന്",
        temperament: "അതീവ ശക്തൻ, അസ്ഥിരൻ",
        attributes: ["താ അക്ഷരം (400) അടങ്ങിയിരിക്കുന്നു", "ഉയർന്ന സംഖ്യാ ശക്തി"],
        element: "അഗ്നി (മൂല്യത്തിൽ നിന്ന് അനുമാനിക്കുന്നു)",
        habitat: "വ്യക്തമല്ല",
        powers: "അസാധാരണമായ ആത്മീക ശക്തി",
        warnings: "വളരെ ഉയർന്ന അബ്ജദ് മൂല്യം - അതീവ ജാഗ്രത ആവശ്യമാണ്"
      }
    )
  },
  {
    id: 7, serialNo: 7, arabicName: "ميمور", arabicHarakat: "مَيْمُور",
    englishName: "Maymoor", abjadValue: 296, letterCount: 5,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ي", value: 10 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }],
    details: defaultDetails
  },
  {
    id: 8, serialNo: 8, arabicName: "ساموج", arabicHarakat: "سَامُوج",
    englishName: "Samooj", abjadValue: 110, letterCount: 5,
    breakdown: [{ letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ج", value: 3 }],
    details: defaultDetails
  },
  {
    id: 9, serialNo: 9, arabicName: "نحوش", arabicHarakat: "نَحُوش",
    englishName: "Nahush", abjadValue: 364, letterCount: 4,
    breakdown: [{ letter: "ن", value: 50 }, { letter: "ح", value: 8 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }],
    details: defaultDetails
  },
  {
    id: 10, serialNo: 10, arabicName: "بهمور", arabicHarakat: "بَهْمُور",
    englishName: "Bahmoor", abjadValue: 253, letterCount: 5,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ه", value: 5 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }],
    details: defaultDetails
  },
  // 11-21: Page 216 (Left)
  {
    id: 11, serialNo: 11, arabicName: "لطوش", arabicHarakat: "لَطُوش",
    englishName: "Latush", abjadValue: 345, letterCount: 4,
    breakdown: [{ letter: "ل", value: 30 }, { letter: "ط", value: 9 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }],
    details: createDetails(
      {
        description: "Monk-like jinn inhabiting sea islands",
        temperament: "Ascetic, isolated",
        attributes: ["Causes suffocation", "Induces fainting", "Can cause fatal diseases"],
        element: "Water",
        habitat: "Sea islands, coastal regions",
        powers: "Can cause respiratory issues and loss of consciousness",
        warnings: "Known to cause serious respiratory ailments and death"
      },
      {
        description: "കടൽ ദ്വീപുകളിൽ വസിക്കുന്ന സന്യാസി പോലുള്ള ജിന്ന്",
        temperament: "തപസ്വി, ഒറ്റപ്പെട്ടവൻ",
        attributes: ["ശ്വാസംമുട്ടൽ ഉണ്ടാക്കുന്നു", "ബോധക്ഷയം വരുത്തുന്നു", "മരണകാരണമാകുന്ന രോഗങ്ങൾ ഉണ്ടാക്കുന്നു"],
        element: "ജലം (Water)",
        habitat: "കടൽ ദ്വീപുകൾ, തീരപ്രദേശങ്ങൾ",
        powers: "ശ്വസന പ്രശ്നങ്ങളും ബോധക്ഷയവും ഉണ്ടാക്കാൻ കഴിയും",
        warnings: "ഗുരുതരമായ ശ്വസന അസുഖങ്ങളും മരണവും ഉണ്ടാക്കുന്നു"
      }
    )
  },
  {
    id: 12, serialNo: 12, arabicName: "الدولات وهيرام الصبيان", arabicHarakat: "الدُّولَات وَهِيرَام الصِّبْيَان",
    englishName: "Aldulat Wa Hiram Alsebiyan", abjadValue: 918, letterCount: 14,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "د", value: 4 }, { letter: "و", value: 6 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ت", value: 400 }, { letter: "و", value: 6 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "ا", value: 1 }],
    details: createDetails(
      {
        description: "Seven-headed female jinn",
        temperament: "Extremely dangerous to mothers and children",
        attributes: ["Seven heads", "Targets pregnant women", "Harms children"],
        element: "Earth",
        habitat: "Mountains, dark places",
        powers: "Can afflict pregnant women and newborns",
        warnings: "EXTREMELY DANGEROUS - specifically targets mothers and infants"
      },
      {
        description: "ഏഴ് തലകളുള്ള സ്ത്രീ രൂപത്തിലുള്ള ജിന്ന്",
        temperament: "ഗർഭിണികൾക്കും കുഞ്ഞുങ്ങൾക്കും അതീവ അപായകാരി",
        attributes: ["ഏഴ് തലകൾ", "ഗർഭിണികളെ ലക്ഷ്യം വെക്കുന്നു", "കുഞ്ഞുങ്ങൾക്ക് ദോഷം ചെയ്യുന്നു"],
        element: "ഭൂമി (Earth)",
        habitat: "മലകൾ, ഇരുണ്ട സ്ഥലങ്ങൾ",
        powers: "ഗർഭിണികളെയും നവജാത ശിശുക്കളെയും ബാധിക്കാൻ കഴിയും",
        warnings: "അതീവ അപായകാരി - പ്രത്യേകം അമ്മമാരെയും ശിശുക്കളെയും ലക്ഷ്യം വെക്കുന്നു"
      }
    )
  },
  // Remaining entries 13-72 with default details (structure preserved)
  { id: 13, serialNo: 13, arabicName: "الوق", arabicHarakat: "الوَق", englishName: "Aluq", abjadValue: 137, letterCount: 3, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "ق", value: 100 }], details: defaultDetails },
  { id: 14, serialNo: 14, arabicName: "دنهش", arabicHarakat: "دَنْهَش", englishName: "Danhash", abjadValue: 359, letterCount: 4, breakdown: [{ letter: "د", value: 4 }, { letter: "ن", value: 50 }, { letter: "ه", value: 5 }, { letter: "ش", value: 300 }], details: defaultDetails },
  { id: 15, serialNo: 15, arabicName: "ترجوش", arabicHarakat: "تَرْجُوش", englishName: "Tarjush", abjadValue: 366, letterCount: 5, breakdown: [{ letter: "ت", value: 400 }, { letter: "ر", value: 200 }, { letter: "ج", value: 3 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }], details: defaultDetails },
  { id: 16, serialNo: 16, arabicName: "الدابة", arabicHarakat: "الدَّابَة", englishName: "Aldabah", abjadValue: 43, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "د", value: 4 }, { letter: "ا", value: 1 }, { letter: "ب", value: 2 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 17, serialNo: 17, arabicName: "المسرف", arabicHarakat: "المُسْرِف", englishName: "Almusrif", abjadValue: 211, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "س", value: 60 }, { letter: "ر", value: 200 }, { letter: "ف", value: 80 }], details: defaultDetails },
  { id: 18, serialNo: 18, arabicName: "زوبغة", arabicHarakat: "زُوبَغَة", englishName: "Zoobaghah", abjadValue: 1020, letterCount: 4, breakdown: [{ letter: "ز", value: 7 }, { letter: "و", value: 6 }, { letter: "ب", value: 2 }, { letter: "غ", value: 1000 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 19, serialNo: 19, arabicName: "الحجا", arabicHarakat: "الحَجَا", englishName: "Alhaja", abjadValue: 43, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ح", value: 8 }, { letter: "ج", value: 3 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 20, serialNo: 20, arabicName: "العويه", arabicHarakat: "العُوَيْه", englishName: "Al'uiah", abjadValue: 122, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ع", value: 70 }, { letter: "و", value: 6 }, { letter: "ي", value: 10 }, { letter: "ه", value: 5 }], details: defaultDetails },
  { id: 21, serialNo: 21, arabicName: "عبقر ذات الاسقام", arabicHarakat: "عِبْقَر ذَات الاسْقَام", englishName: "'Bqar Dhat Alasqam", abjadValue: 1705, letterCount: 11, breakdown: [{ letter: "ع", value: 70 }, { letter: "ب", value: 2 }, { letter: "ق", value: 100 }, { letter: "ر", value: 200 }, { letter: "ذ", value: 700 }, { letter: "ا", value: 1 }, { letter: "ت", value: 400 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 22, serialNo: 22, arabicName: "الزبدة", arabicHarakat: "الزُّبْدَة", englishName: "Alzubdah", abjadValue: 49, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ز", value: 7 }, { letter: "ب", value: 2 }, { letter: "د", value: 4 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 23, serialNo: 23, arabicName: "القوة", arabicHarakat: "القُوَّة", englishName: "Alqooah", abjadValue: 142, letterCount: 3, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ق", value: 100 }, { letter: "و", value: 6 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 24, serialNo: 24, arabicName: "السيسان", arabicHarakat: "السِّيسَان", englishName: "Alsisan", abjadValue: 212, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "س", value: 60 }, { letter: "ي", value: 10 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }], details: defaultDetails },
  { id: 25, serialNo: 25, arabicName: "قلنمانة", arabicHarakat: "قَلْنَمَانَة", englishName: "Qelnemanah", abjadValue: 626, letterCount: 6, breakdown: [{ letter: "ق", value: 100 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "م", value: 40 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 26, serialNo: 26, arabicName: "فعجيان", arabicHarakat: "فَعْجِيَان", englishName: "Fa'jiyan", abjadValue: 214, letterCount: 5, breakdown: [{ letter: "ف", value: 80 }, { letter: "ع", value: 70 }, { letter: "ج", value: 3 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }], details: defaultDetails },
  { id: 27, serialNo: 27, arabicName: "صعبة", arabicHarakat: "صَعْبَة", englishName: "Sa'bah", abjadValue: 175, letterCount: 4, breakdown: [{ letter: "ص", value: 90 }, { letter: "ع", value: 70 }, { letter: "ب", value: 2 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 28, serialNo: 28, arabicName: "الرواح", arabicHarakat: "الرَّوَاح", englishName: "Alruah", abjadValue: 246, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ح", value: 8 }], details: defaultDetails },
  { id: 29, serialNo: 29, arabicName: "القرصة", arabicHarakat: "القَرْصَة", englishName: "Alqarsa", abjadValue: 426, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ق", value: 100 }, { letter: "ر", value: 200 }, { letter: "ص", value: 90 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 30, serialNo: 30, arabicName: "روبمنة", arabicHarakat: "رُوبْمَنَة", englishName: "Ruimnah", abjadValue: 311, letterCount: 5, breakdown: [{ letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ب", value: 2 }, { letter: "م", value: 40 }, { letter: "ن", value: 50 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 31, serialNo: 31, arabicName: "الخامن", arabicHarakat: "الخَامِن", englishName: "Alekhnamen", abjadValue: 772, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "خ", value: 600 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "ن", value: 50 }], details: defaultDetails },
  { id: 32, serialNo: 32, arabicName: "حبشاشش", arabicHarakat: "حَبْشَاشِش", englishName: "Habshahesh", abjadValue: 618, letterCount: 6, breakdown: [{ letter: "ح", value: 8 }, { letter: "ب", value: 2 }, { letter: "ش", value: 300 }, { letter: "ا", value: 1 }, { letter: "ش", value: 300 }, { letter: "ش", value: 300 }], details: defaultDetails },
  { id: 33, serialNo: 33, arabicName: "لهيف", arabicHarakat: "لَهِيف", englishName: "Lahif", abjadValue: 125, letterCount: 4, breakdown: [{ letter: "ل", value: 30 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }, { letter: "ف", value: 80 }], details: defaultDetails },
  { id: 34, serialNo: 34, arabicName: "سمهل", arabicHarakat: "سِمْهَل", englishName: "Simhel", abjadValue: 135, letterCount: 4, breakdown: [{ letter: "س", value: 60 }, { letter: "م", value: 40 }, { letter: "ه", value: 5 }, { letter: "ل", value: 30 }], details: defaultDetails },
  { id: 35, serialNo: 35, arabicName: "بقسمين", arabicHarakat: "بَقْسِمِين", englishName: "Beqasmin", abjadValue: 262, letterCount: 5, breakdown: [{ letter: "ب", value: 2 }, { letter: "ق", value: 100 }, { letter: "س", value: 60 }, { letter: "م", value: 40 }, { letter: "ي", value: 10 }, { letter: "ن", value: 50 }], details: defaultDetails },
  { id: 36, serialNo: 36, arabicName: "الجندع", arabicHarakat: "الجُنْدَع", englishName: "Aljund", abjadValue: 158, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }, { letter: "ن", value: 50 }, { letter: "د", value: 4 }, { letter: "ع", value: 70 }], details: defaultDetails },
  { id: 37, serialNo: 37, arabicName: "طلايا", arabicHarakat: "طَلَايَا", englishName: "Talyaba", abjadValue: 53, letterCount: 4, breakdown: [{ letter: "ط", value: 9 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 38, serialNo: 38, arabicName: "سفر", arabicHarakat: "سَفِر", englishName: "Safir", abjadValue: 340, letterCount: 3, breakdown: [{ letter: "س", value: 60 }, { letter: "ف", value: 80 }, { letter: "ر", value: 200 }], details: defaultDetails },
  { id: 39, serialNo: 39, arabicName: "هموري", arabicHarakat: "هَمُورِي", englishName: "Hamudi", abjadValue: 65, letterCount: 4, breakdown: [{ letter: "ه", value: 5 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }], details: defaultDetails },
  { id: 40, serialNo: 40, arabicName: "النفس", arabicHarakat: "النَّفْس", englishName: "Alnafis", abjadValue: 221, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "ف", value: 80 }, { letter: "س", value: 60 }], details: defaultDetails },
  { id: 41, serialNo: 41, arabicName: "حورتا", arabicHarakat: "حُورْتَا", englishName: "Hurta", abjadValue: 616, letterCount: 4, breakdown: [{ letter: "ح", value: 8 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }, { letter: "ت", value: 400 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 42, serialNo: 42, arabicName: "الراهية", arabicHarakat: "الرَّاهِيَة", englishName: "Alrahiah", abjadValue: 52, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 43, serialNo: 43, arabicName: "الضريان", arabicHarakat: "الضَّرِيَان", englishName: "Aldarban", abjadValue: 1084, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ض", value: 800 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }], details: defaultDetails },
  { id: 44, serialNo: 44, arabicName: "الخطاف", arabicHarakat: "الخَطَّاف", englishName: "Alkhataf", abjadValue: 721, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "خ", value: 600 }, { letter: "ط", value: 9 }, { letter: "ا", value: 1 }, { letter: "ف", value: 80 }], details: defaultDetails },
  { id: 45, serialNo: 45, arabicName: "الوسواس", arabicHarakat: "الوَسْوَاس", englishName: "Alwiswas", abjadValue: 164, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }], details: defaultDetails },
  { id: 46, serialNo: 46, arabicName: "يدام ملدم", arabicHarakat: "يَدِام مِلْدَم", englishName: "Yedam Meldem", abjadValue: 169, letterCount: 7, breakdown: [{ letter: "ي", value: 10 }, { letter: "د", value: 4 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "م", value: 40 }, { letter: "ل", value: 30 }, { letter: "د", value: 4 }, { letter: "م", value: 40 }], details: defaultDetails },
  { id: 47, serialNo: 47, arabicName: "الزواعة", arabicHarakat: "الزِّوَاعَة", englishName: "Alzu'ah", abjadValue: 119, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ز", value: 7 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ع", value: 70 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 48, serialNo: 48, arabicName: "النباح", arabicHarakat: "النَّبَاح", englishName: "Alnabah", abjadValue: 92, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "ب", value: 2 }, { letter: "ا", value: 1 }, { letter: "ح", value: 8 }], details: defaultDetails },
  { id: 49, serialNo: 49, arabicName: "المولع", arabicHarakat: "المُولَع", englishName: "Almul'", abjadValue: 177, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ل", value: 30 }, { letter: "ع", value: 70 }], details: defaultDetails },
  { id: 50, serialNo: 50, arabicName: "الوسواس الاكبر", arabicHarakat: "الوَسْوَاس الأكْبَر", englishName: "Alwiswas Alakbar", abjadValue: 418, letterCount: 9, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ك", value: 20 }, { letter: "ب", value: 2 }, { letter: "ر", value: 200 }], details: defaultDetails },
  { id: 51, serialNo: 51, arabicName: "الخناس الاصغار", arabicHarakat: "الخَنَّاس الأصْغَار", englishName: "Alkhanas Alasghar", abjadValue: 2065, letterCount: 10, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "خ", value: 600 }, { letter: "ن", value: 50 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ص", value: 90 }, { letter: "غ", value: 1000 }, { letter: "ا", value: 1 }, { letter: "ر", value: 200 }], details: defaultDetails },
  { id: 52, serialNo: 52, arabicName: "الجمقا", arabicHarakat: "الجَمْقَا", englishName: "Alhamqa", abjadValue: 180, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }, { letter: "م", value: 40 }, { letter: "ق", value: 100 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 53, serialNo: 53, arabicName: "حسن", arabicHarakat: "حَسَن", englishName: "Hasen", abjadValue: 118, letterCount: 3, breakdown: [{ letter: "ح", value: 8 }, { letter: "س", value: 60 }, { letter: "ن", value: 50 }], details: defaultDetails },
  { id: 54, serialNo: 54, arabicName: "المأسور", arabicHarakat: "المَأْسُور", englishName: "Almasur", abjadValue: 338, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }], details: defaultDetails },
  { id: 55, serialNo: 55, arabicName: "بالم", arabicHarakat: "بَالِم", englishName: "Balim", abjadValue: 72, letterCount: 3, breakdown: [{ letter: "ب", value: 2 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }], details: defaultDetails },
  { id: 56, serialNo: 56, arabicName: "شاخيا", arabicHarakat: "شَاخِيَا", englishName: "Shakhya", abjadValue: 912, letterCount: 4, breakdown: [{ letter: "ش", value: 300 }, { letter: "ا", value: 1 }, { letter: "خ", value: 600 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 57, serialNo: 57, arabicName: "بردون", arabicHarakat: "بَرْدُون", englishName: "Bardun", abjadValue: 262, letterCount: 4, breakdown: [{ letter: "ب", value: 2 }, { letter: "ر", value: 200 }, { letter: "د", value: 4 }, { letter: "و", value: 6 }, { letter: "ن", value: 50 }], details: defaultDetails },
  { id: 58, serialNo: 58, arabicName: "بزيد المجوسي", arabicHarakat: "بَزِيد المَجُوسِي", englishName: "Bezid Almajusi", abjadValue: 172, letterCount: 8, breakdown: [{ letter: "ب", value: 2 }, { letter: "ز", value: 7 }, { letter: "ي", value: 10 }, { letter: "د", value: 4 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ج", value: 3 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }, { letter: "ي", value: 10 }], details: defaultDetails },
  { id: 59, serialNo: 59, arabicName: "معروز", arabicHarakat: "مَعْرُوز", englishName: "Ma'ruz", abjadValue: 323, letterCount: 4, breakdown: [{ letter: "م", value: 40 }, { letter: "ع", value: 70 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ز", value: 7 }], details: defaultDetails },
  { id: 60, serialNo: 60, arabicName: "الملية النافضة", arabicHarakat: "الْمِلِيَّة النَّافِضَة", englishName: "Almiliah Alnafedha", abjadValue: 1083, letterCount: 10, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ل", value: 30 }, { letter: "ي", value: 10 }, { letter: "ة", value: 5 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "ا", value: 1 }, { letter: "ف", value: 80 }, { letter: "ض", value: 800 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 61, serialNo: 61, arabicName: "مروبا", arabicHarakat: "مَرُوبَا", englishName: "Marweya", abjadValue: 257, letterCount: 4, breakdown: [{ letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ب", value: 2 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 62, serialNo: 62, arabicName: "الفالج", arabicHarakat: "الفَالِج", englishName: "Alfalij", abjadValue: 145, letterCount: 5, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ف", value: 80 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }], details: defaultDetails },
  { id: 63, serialNo: 63, arabicName: "الواثق", arabicHarakat: "الوَاثِق", englishName: "Alwathiq", abjadValue: 638, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ث", value: 500 }, { letter: "ق", value: 100 }], details: defaultDetails },
  { id: 64, serialNo: 64, arabicName: "الاسعاري اليهودي", arabicHarakat: "الأسْعَارِي الْيَهُودِي", englishName: "Al-Sa'ari Al-Yahudi", abjadValue: 438, letterCount: 10, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "ع", value: 70 }, { letter: "ا", value: 1 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ي", value: 10 }, { letter: "ه", value: 5 }, { letter: "و", value: 6 }, { letter: "د", value: 4 }, { letter: "ي", value: 10 }], details: defaultDetails },
  { id: 65, serialNo: 65, arabicName: "لوق", arabicHarakat: "لُوق", englishName: "Luq", abjadValue: 136, letterCount: 3, breakdown: [{ letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "ق", value: 100 }], details: defaultDetails },
  { id: 66, serialNo: 66, arabicName: "المريخ", arabicHarakat: "الْمَرِيخ", englishName: "Almarikh", abjadValue: 881, letterCount: 4, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }, { letter: "خ", value: 600 }], details: defaultDetails },
  { id: 67, serialNo: 67, arabicName: "عامر ابو الشيفان صاحب الجيل", arabicHarakat: "عَامِر أبُو الشَّيْفَان صَاحِب الْجِيل", englishName: "'Amer Abu Al-Shifan Saheb Aljebel", abjadValue: 1049, letterCount: 20, breakdown: [{ letter: "ع", value: 70 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }, { letter: "ب", value: 2 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ش", value: 300 }, { letter: "ي", value: 10 }, { letter: "ف", value: 80 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }, { letter: "ص", value: 90 }, { letter: "ا", value: 1 }, { letter: "ح", value: 8 }, { letter: "ب", value: 2 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }, { letter: "ي", value: 10 }, { letter: "ل", value: 30 }], details: defaultDetails },
  { id: 68, serialNo: 68, arabicName: "الحلية الظاهرة", arabicHarakat: "الحِلْيَة الظَّاهِرَة", englishName: "Alhilya Alzaherah", abjadValue: 1226, letterCount: 8, breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ح", value: 8 }, { letter: "ل", value: 30 }, { letter: "ي", value: 10 }, { letter: "ة", value: 5 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ظ", value: 900 }, { letter: "ا", value: 1 }, { letter: "ه", value: 5 }, { letter: "ر", value: 200 }, { letter: "ة", value: 5 }], details: defaultDetails },
  { id: 69, serialNo: 69, arabicName: "قدسا", arabicHarakat: "قُدْسَا", englishName: "Qudsa", abjadValue: 165, letterCount: 4, breakdown: [{ letter: "ق", value: 100 }, { letter: "د", value: 4 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }], details: defaultDetails },
  { id: 70, serialNo: 70, arabicName: "شرهي", arabicHarakat: "شَرَهِي", englishName: "Shrahi", abjadValue: 515, letterCount: 4, breakdown: [{ letter: "ش", value: 300 }, { letter: "ر", value: 200 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }], details: defaultDetails },
  { id: 71, serialNo: 71, arabicName: "مغشغاس", arabicHarakat: "مَغْشَغَاس", englishName: "Maghshaghas", abjadValue: 2400, letterCount: 5, breakdown: [{ letter: "م", value: 40 }, { letter: "غ", value: 1000 }, { letter: "ش", value: 300 }, { letter: "غ", value: 1000 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }], details: defaultDetails },
  { id: 72, serialNo: 72, arabicName: "عشرا", arabicHarakat: "عِشْرَا", englishName: "'Shara", abjadValue: 571, letterCount: 4, breakdown: [{ letter: "ع", value: 70 }, { letter: "ش", value: 300 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }], details: defaultDetails }
];

export const EVIL_JINN_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "low", label: "Low (≤200)" },
  { id: "medium", label: "Medium (201-400)" },
  { id: "high", label: "High (>400)" }
];