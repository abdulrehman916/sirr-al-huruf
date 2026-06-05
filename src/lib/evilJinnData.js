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

export const EVIL_JINN_NAMES = [
  // 1-10: Original names
  {
    id: 1, serialNo: 1, arabicName: "مهمس", arabicHarakat: "مَهْمَس",
    englishName: "Mahmas", abjadValue: 145, letterCount: 4,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ه", value: 5 }, { letter: "م", value: 40 }, { letter: "س", value: 60 }]
  },
  {
    id: 2, serialNo: 2, arabicName: "برقن", arabicHarakat: "بَرْقَن",
    englishName: "Barqan", abjadValue: 352, letterCount: 4,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ر", value: 200 }, { letter: "ق", value: 100 }, { letter: "ن", value: 50 }]
  },
  {
    id: 3, serialNo: 3, arabicName: "شمهوش", arabicHarakat: "شَمْهُوش",
    englishName: "Shamhush", abjadValue: 651, letterCount: 5,
    breakdown: [{ letter: "ش", value: 300 }, { letter: "م", value: 40 }, { letter: "ه", value: 5 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }]
  },
  {
    id: 4, serialNo: 4, arabicName: "فقطوس", arabicHarakat: "فَقْطُوس",
    englishName: "Faqthus", abjadValue: 255, letterCount: 5,
    breakdown: [{ letter: "ف", value: 80 }, { letter: "ق", value: 100 }, { letter: "ط", value: 9 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }]
  },
  {
    id: 5, serialNo: 5, arabicName: "مرو", arabicHarakat: "مَرُّو",
    englishName: "Marroo", abjadValue: 246, letterCount: 3,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }]
  },
  {
    id: 6, serialNo: 6, arabicName: "شكرتي", arabicHarakat: "شَكَرْتِي",
    englishName: "Shakarti", abjadValue: 930, letterCount: 5,
    breakdown: [{ letter: "ش", value: 300 }, { letter: "ك", value: 20 }, { letter: "ر", value: 200 }, { letter: "ت", value: 400 }, { letter: "ي", value: 10 }]
  },
  {
    id: 7, serialNo: 7, arabicName: "ميمور", arabicHarakat: "مَيْمُور",
    englishName: "Maymoor", abjadValue: 296, letterCount: 5,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ي", value: 10 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }]
  },
  {
    id: 8, serialNo: 8, arabicName: "ساموج", arabicHarakat: "سَامُوج",
    englishName: "Samooj", abjadValue: 110, letterCount: 5,
    breakdown: [{ letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ج", value: 3 }]
  },
  {
    id: 9, serialNo: 9, arabicName: "نحوش", arabicHarakat: "نَحُوش",
    englishName: "Nahush", abjadValue: 364, letterCount: 4,
    breakdown: [{ letter: "ن", value: 50 }, { letter: "ح", value: 8 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }]
  },
  {
    id: 10, serialNo: 10, arabicName: "بهمور", arabicHarakat: "بَهْمُور",
    englishName: "Bahmoor", abjadValue: 253, letterCount: 5,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ه", value: 5 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }]
  },

  // 11-21: Page 216 (Left)
  {
    id: 11, serialNo: 11, arabicName: "لطوش", arabicHarakat: "لَطُوش",
    englishName: "Latush", abjadValue: 345, letterCount: 4,
    breakdown: [{ letter: "ل", value: 30 }, { letter: "ط", value: 9 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }]
  },
  {
    id: 12, serialNo: 12, arabicName: "الدولات وهيرام الصبيان", arabicHarakat: "الدُّولَات وَهِيرَام الصِّبْيَان",
    englishName: "Aldulat Wa Hiram Alsebiyan", abjadValue: 918, letterCount: 14,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "د", value: 4 }, { letter: "و", value: 6 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ت", value: 400 }, { letter: "و", value: 6 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "ا", value: 1 }]
  },
  {
    id: 13, serialNo: 13, arabicName: "الوق", arabicHarakat: "الوَق",
    englishName: "Aluq", abjadValue: 137, letterCount: 3,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "ق", value: 100 }]
  },
  {
    id: 14, serialNo: 14, arabicName: "دنهش", arabicHarakat: "دَنْهَش",
    englishName: "Danhash", abjadValue: 359, letterCount: 4,
    breakdown: [{ letter: "د", value: 4 }, { letter: "ن", value: 50 }, { letter: "ه", value: 5 }, { letter: "ش", value: 300 }]
  },
  {
    id: 15, serialNo: 15, arabicName: "ترجوش", arabicHarakat: "تَرْجُوش",
    englishName: "Tarjush", abjadValue: 366, letterCount: 5,
    breakdown: [{ letter: "ت", value: 400 }, { letter: "ر", value: 200 }, { letter: "ج", value: 3 }, { letter: "و", value: 6 }, { letter: "ش", value: 300 }]
  },
  {
    id: 16, serialNo: 16, arabicName: "الدابة", arabicHarakat: "الدَّابَة",
    englishName: "Aldabah", abjadValue: 43, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "د", value: 4 }, { letter: "ا", value: 1 }, { letter: "ب", value: 2 }, { letter: "ة", value: 5 }]
  },
  {
    id: 17, serialNo: 17, arabicName: "المسرف", arabicHarakat: "المُسْرِف",
    englishName: "Almusrif", abjadValue: 211, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "س", value: 60 }, { letter: "ر", value: 200 }, { letter: "ف", value: 80 }]
  },
  {
    id: 18, serialNo: 18, arabicName: "زوبغة", arabicHarakat: "زُوبَغَة",
    englishName: "Zoobaghah", abjadValue: 1020, letterCount: 4,
    breakdown: [{ letter: "ز", value: 7 }, { letter: "و", value: 6 }, { letter: "ب", value: 2 }, { letter: "غ", value: 1000 }, { letter: "ة", value: 5 }]
  },
  {
    id: 19, serialNo: 19, arabicName: "الحجا", arabicHarakat: "الحَجَا",
    englishName: "Alhaja", abjadValue: 43, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ح", value: 8 }, { letter: "ج", value: 3 }, { letter: "ا", value: 1 }]
  },
  {
    id: 20, serialNo: 20, arabicName: "العويه", arabicHarakat: "العُوَيْه",
    englishName: "Al'uiah", abjadValue: 122, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ع", value: 70 }, { letter: "و", value: 6 }, { letter: "ي", value: 10 }, { letter: "ه", value: 5 }]
  },
  {
    id: 21, serialNo: 21, arabicName: "عبقر ذات الاسقام", arabicHarakat: "عِبْقَر ذَات الاسْقَام",
    englishName: "'Bqar Dhat Alasqam", abjadValue: 1705, letterCount: 11,
    breakdown: [{ letter: "ع", value: 70 }, { letter: "ب", value: 2 }, { letter: "ق", value: 100 }, { letter: "ر", value: 200 }, { letter: "ذ", value: 700 }, { letter: "ا", value: 1 }, { letter: "ت", value: 400 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }]
  },

  // 22-33: Page 216-217 (Right)
  {
    id: 22, serialNo: 22, arabicName: "الزبدة", arabicHarakat: "الزُّبْدَة",
    englishName: "Alzubdah", abjadValue: 49, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ز", value: 7 }, { letter: "ب", value: 2 }, { letter: "د", value: 4 }, { letter: "ة", value: 5 }]
  },
  {
    id: 23, serialNo: 23, arabicName: "القوة", arabicHarakat: "القُوَّة",
    englishName: "Alqooah", abjadValue: 142, letterCount: 3,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ق", value: 100 }, { letter: "و", value: 6 }, { letter: "ة", value: 5 }]
  },
  {
    id: 24, serialNo: 24, arabicName: "السيسان", arabicHarakat: "السِّيسَان",
    englishName: "Alsisan", abjadValue: 212, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "س", value: 60 }, { letter: "ي", value: 10 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }]
  },
  {
    id: 25, serialNo: 25, arabicName: "قلنمانة", arabicHarakat: "قَلْنَمَانَة",
    englishName: "Qelnemanah", abjadValue: 626, letterCount: 6,
    breakdown: [{ letter: "ق", value: 100 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "م", value: 40 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }, { letter: "ة", value: 5 }]
  },
  {
    id: 26, serialNo: 26, arabicName: "فعجيان", arabicHarakat: "فَعْجِيَان",
    englishName: "Fa'jiyan", abjadValue: 214, letterCount: 5,
    breakdown: [{ letter: "ف", value: 80 }, { letter: "ع", value: 70 }, { letter: "ج", value: 3 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }]
  },
  {
    id: 27, serialNo: 27, arabicName: "صعبة", arabicHarakat: "صَعْبَة",
    englishName: "Sa'bah", abjadValue: 175, letterCount: 4,
    breakdown: [{ letter: "ص", value: 90 }, { letter: "ع", value: 70 }, { letter: "ب", value: 2 }, { letter: "ة", value: 5 }]
  },
  {
    id: 28, serialNo: 28, arabicName: "الرواح", arabicHarakat: "الرَّوَاح",
    englishName: "Alruah", abjadValue: 246, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ح", value: 8 }]
  },
  {
    id: 29, serialNo: 29, arabicName: "القرصة", arabicHarakat: "القَرْصَة",
    englishName: "Alqarsa", abjadValue: 426, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ق", value: 100 }, { letter: "ر", value: 200 }, { letter: "ص", value: 90 }, { letter: "ة", value: 5 }]
  },
  {
    id: 30, serialNo: 30, arabicName: "روبمنة", arabicHarakat: "رُوبْمَنَة",
    englishName: "Ruimnah", abjadValue: 311, letterCount: 5,
    breakdown: [{ letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ب", value: 2 }, { letter: "م", value: 40 }, { letter: "ن", value: 50 }, { letter: "ة", value: 5 }]
  },
  {
    id: 31, serialNo: 31, arabicName: "الخامن", arabicHarakat: "الخَامِن",
    englishName: "Alekhnamen", abjadValue: 772, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "خ", value: 600 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "ن", value: 50 }]
  },
  {
    id: 32, serialNo: 32, arabicName: "حبشاشش", arabicHarakat: "حَبْشَاشِش",
    englishName: "Habshahesh", abjadValue: 618, letterCount: 6,
    breakdown: [{ letter: "ح", value: 8 }, { letter: "ب", value: 2 }, { letter: "ش", value: 300 }, { letter: "ا", value: 1 }, { letter: "ش", value: 300 }, { letter: "ش", value: 300 }]
  },
  {
    id: 33, serialNo: 33, arabicName: "لهيف", arabicHarakat: "لَهِيف",
    englishName: "Lahif", abjadValue: 125, letterCount: 4,
    breakdown: [{ letter: "ل", value: 30 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }, { letter: "ف", value: 80 }]
  },

  // 34-45: Page 218 (Left)
  {
    id: 34, serialNo: 34, arabicName: "سمهل", arabicHarakat: "سِمْهَل",
    englishName: "Simhel", abjadValue: 135, letterCount: 4,
    breakdown: [{ letter: "س", value: 60 }, { letter: "م", value: 40 }, { letter: "ه", value: 5 }, { letter: "ل", value: 30 }]
  },
  {
    id: 35, serialNo: 35, arabicName: "بقسمين", arabicHarakat: "بَقْسِمِين",
    englishName: "Beqasmin", abjadValue: 262, letterCount: 5,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ق", value: 100 }, { letter: "س", value: 60 }, { letter: "م", value: 40 }, { letter: "ي", value: 10 }, { letter: "ن", value: 50 }]
  },
  {
    id: 36, serialNo: 36, arabicName: "الجندع", arabicHarakat: "الجُنْدَع",
    englishName: "Aljund", abjadValue: 158, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }, { letter: "ن", value: 50 }, { letter: "د", value: 4 }, { letter: "ع", value: 70 }]
  },
  {
    id: 37, serialNo: 37, arabicName: "طلايا", arabicHarakat: "طَلَايَا",
    englishName: "Talyaba", abjadValue: 53, letterCount: 4,
    breakdown: [{ letter: "ط", value: 9 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }]
  },
  {
    id: 38, serialNo: 38, arabicName: "سفر", arabicHarakat: "سَفِر",
    englishName: "Safir", abjadValue: 340, letterCount: 3,
    breakdown: [{ letter: "س", value: 60 }, { letter: "ف", value: 80 }, { letter: "ر", value: 200 }]
  },
  {
    id: 39, serialNo: 39, arabicName: "هموري", arabicHarakat: "هَمُورِي",
    englishName: "Hamudi", abjadValue: 65, letterCount: 4,
    breakdown: [{ letter: "ه", value: 5 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }]
  },
  {
    id: 40, serialNo: 40, arabicName: "النفس", arabicHarakat: "النَّفْس",
    englishName: "Alnafis", abjadValue: 221, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "ف", value: 80 }, { letter: "س", value: 60 }]
  },
  {
    id: 41, serialNo: 41, arabicName: "حورتا", arabicHarakat: "حُورْتَا",
    englishName: "Hurta", abjadValue: 616, letterCount: 4,
    breakdown: [{ letter: "ح", value: 8 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }, { letter: "ت", value: 400 }, { letter: "ا", value: 1 }]
  },
  {
    id: 42, serialNo: 42, arabicName: "الراهية", arabicHarakat: "الرَّاهِيَة",
    englishName: "Alrahiah", abjadValue: 52, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }, { letter: "ة", value: 5 }]
  },
  {
    id: 43, serialNo: 43, arabicName: "الضريان", arabicHarakat: "الضَّرِيَان",
    englishName: "Aldarban", abjadValue: 1084, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ض", value: 800 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }]
  },
  {
    id: 44, serialNo: 44, arabicName: "الخطاف", arabicHarakat: "الخَطَّاف",
    englishName: "Alkhataf", abjadValue: 721, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "خ", value: 600 }, { letter: "ط", value: 9 }, { letter: "ا", value: 1 }, { letter: "ف", value: 80 }]
  },
  {
    id: 45, serialNo: 45, arabicName: "الوسواس", arabicHarakat: "الوَسْوَاس",
    englishName: "Alwiswas", abjadValue: 164, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }]
  },

  // 46-56: Page 218-219 (Right)
  {
    id: 46, serialNo: 46, arabicName: "يدام ملدم", arabicHarakat: "يَدِام مِلْدَم",
    englishName: "Yedam Meldem", abjadValue: 169, letterCount: 7,
    breakdown: [{ letter: "ي", value: 10 }, { letter: "د", value: 4 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "م", value: 40 }, { letter: "ل", value: 30 }, { letter: "د", value: 4 }, { letter: "م", value: 40 }]
  },
  {
    id: 47, serialNo: 47, arabicName: "الزواعة", arabicHarakat: "الزِّوَاعَة",
    englishName: "Alzu'ah", abjadValue: 119, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ز", value: 7 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ع", value: 70 }, { letter: "ة", value: 5 }]
  },
  {
    id: 48, serialNo: 48, arabicName: "النباح", arabicHarakat: "النَّبَاح",
    englishName: "Alnabah", abjadValue: 92, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "ب", value: 2 }, { letter: "ا", value: 1 }, { letter: "ح", value: 8 }]
  },
  {
    id: 49, serialNo: 49, arabicName: "المولع", arabicHarakat: "المُولَع",
    englishName: "Almul'", abjadValue: 177, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "و", value: 6 }, { letter: "ل", value: 30 }, { letter: "ع", value: 70 }]
  },
  {
    id: 50, serialNo: 50, arabicName: "الوسواس الاكبر", arabicHarakat: "الوَسْوَاس الأكْبَر",
    englishName: "Alwiswas Alakbar", abjadValue: 418, letterCount: 9,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ك", value: 20 }, { letter: "ب", value: 2 }, { letter: "ر", value: 200 }]
  },
  {
    id: 51, serialNo: 51, arabicName: "الخناس الاصغار", arabicHarakat: "الخَنَّاس الأصْغَار",
    englishName: "Alkhanas Alasghar", abjadValue: 2065, letterCount: 10,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "خ", value: 600 }, { letter: "ن", value: 50 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "ص", value: 90 }, { letter: "غ", value: 1000 }, { letter: "ا", value: 1 }, { letter: "ر", value: 200 }]
  },
  {
    id: 52, serialNo: 52, arabicName: "الجمقا", arabicHarakat: "الجَمْقَا",
    englishName: "Alhamqa", abjadValue: 180, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }, { letter: "م", value: 40 }, { letter: "ق", value: 100 }, { letter: "ا", value: 1 }]
  },
  {
    id: 53, serialNo: 53, arabicName: "حسن", arabicHarakat: "حَسَن",
    englishName: "Hasen", abjadValue: 118, letterCount: 3,
    breakdown: [{ letter: "ح", value: 8 }, { letter: "س", value: 60 }, { letter: "ن", value: 50 }]
  },
  {
    id: 54, serialNo: 54, arabicName: "المأسور", arabicHarakat: "المَأْسُور",
    englishName: "Almasur", abjadValue: 338, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "و", value: 6 }, { letter: "ر", value: 200 }]
  },
  {
    id: 55, serialNo: 55, arabicName: "بالم", arabicHarakat: "بَالِم",
    englishName: "Balim", abjadValue: 72, letterCount: 3,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }]
  },
  {
    id: 56, serialNo: 56, arabicName: "شاخيا", arabicHarakat: "شَاخِيَا",
    englishName: "Shakhya", abjadValue: 912, letterCount: 4,
    breakdown: [{ letter: "ش", value: 300 }, { letter: "ا", value: 1 }, { letter: "خ", value: 600 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }]
  },

  // 57-66: Page 220 (Left)
  {
    id: 57, serialNo: 57, arabicName: "بردون", arabicHarakat: "بَرْدُون",
    englishName: "Bardun", abjadValue: 262, letterCount: 4,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ر", value: 200 }, { letter: "د", value: 4 }, { letter: "و", value: 6 }, { letter: "ن", value: 50 }]
  },
  {
    id: 58, serialNo: 58, arabicName: "بزيد المجوسي", arabicHarakat: "بَزِيد المَجُوسِي",
    englishName: "Bezid Almajusi", abjadValue: 172, letterCount: 8,
    breakdown: [{ letter: "ب", value: 2 }, { letter: "ز", value: 7 }, { letter: "ي", value: 10 }, { letter: "د", value: 4 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ج", value: 3 }, { letter: "و", value: 6 }, { letter: "س", value: 60 }, { letter: "ي", value: 10 }]
  },
  {
    id: 59, serialNo: 59, arabicName: "معروز", arabicHarakat: "مَعْرُوز",
    englishName: "Ma'ruz", abjadValue: 323, letterCount: 4,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ع", value: 70 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ز", value: 7 }]
  },
  {
    id: 60, serialNo: 60, arabicName: "الملية النافضة", arabicHarakat: "الْمِلِيَّة النَّافِضَة",
    englishName: "Almiliah Alnafedha", abjadValue: 1083, letterCount: 10,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ل", value: 30 }, { letter: "ي", value: 10 }, { letter: "ة", value: 5 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ن", value: 50 }, { letter: "ا", value: 1 }, { letter: "ف", value: 80 }, { letter: "ض", value: 800 }, { letter: "ة", value: 5 }]
  },
  {
    id: 61, serialNo: 61, arabicName: "مروبا", arabicHarakat: "مَرُوبَا",
    englishName: "Marweya", abjadValue: 257, letterCount: 4,
    breakdown: [{ letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "و", value: 6 }, { letter: "ب", value: 2 }, { letter: "ا", value: 1 }]
  },
  {
    id: 62, serialNo: 62, arabicName: "الفالج", arabicHarakat: "الفَالِج",
    englishName: "Alfalij", abjadValue: 145, letterCount: 5,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ف", value: 80 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }]
  },
  {
    id: 63, serialNo: 63, arabicName: "الواثق", arabicHarakat: "الوَاثِق",
    englishName: "Alwathiq", abjadValue: 638, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ث", value: 500 }, { letter: "ق", value: 100 }]
  },
  {
    id: 64, serialNo: 64, arabicName: "الاسعاري اليهودي", arabicHarakat: "الأسْعَارِي الْيَهُودِي",
    englishName: "Al-Sa'ari Al-Yahudi", abjadValue: 438, letterCount: 10,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }, { letter: "ع", value: 70 }, { letter: "ا", value: 1 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ي", value: 10 }, { letter: "ه", value: 5 }, { letter: "و", value: 6 }, { letter: "د", value: 4 }, { letter: "ي", value: 10 }]
  },
  {
    id: 65, serialNo: 65, arabicName: "لوق", arabicHarakat: "لُوق",
    englishName: "Luq", abjadValue: 136, letterCount: 3,
    breakdown: [{ letter: "ل", value: 30 }, { letter: "و", value: 6 }, { letter: "ق", value: 100 }]
  },
  {
    id: 66, serialNo: 66, arabicName: "المريخ", arabicHarakat: "الْمَرِيخ",
    englishName: "Almarikh", abjadValue: 881, letterCount: 4,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "ي", value: 10 }, { letter: "خ", value: 600 }]
  },

  // 67-72: Page 220-221 (Right)
  {
    id: 67, serialNo: 67, arabicName: "عامر ابو الشيفان صاحب الجيل", arabicHarakat: "عَامِر أبُو الشَّيْفَان صَاحِب الْجِيل",
    englishName: "'Amer Abu Al-Shifan Saheb Aljebel", abjadValue: 1049, letterCount: 20,
    breakdown: [{ letter: "ع", value: 70 }, { letter: "ا", value: 1 }, { letter: "م", value: 40 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }, { letter: "ب", value: 2 }, { letter: "و", value: 6 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ش", value: 300 }, { letter: "ي", value: 10 }, { letter: "ف", value: 80 }, { letter: "ا", value: 1 }, { letter: "ن", value: 50 }, { letter: "ص", value: 90 }, { letter: "ا", value: 1 }, { letter: "ح", value: 8 }, { letter: "ب", value: 2 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ج", value: 3 }, { letter: "ي", value: 10 }, { letter: "ل", value: 30 }]
  },
  {
    id: 68, serialNo: 68, arabicName: "الحلية الظاهرة", arabicHarakat: "الحِلْيَة الظَّاهِرَة",
    englishName: "Alhilya Alzaherah", abjadValue: 1226, letterCount: 8,
    breakdown: [{ letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ح", value: 8 }, { letter: "ل", value: 30 }, { letter: "ي", value: 10 }, { letter: "ة", value: 5 }, { letter: "ا", value: 1 }, { letter: "ل", value: 30 }, { letter: "ظ", value: 900 }, { letter: "ا", value: 1 }, { letter: "ه", value: 5 }, { letter: "ر", value: 200 }, { letter: "ة", value: 5 }]
  },
  {
    id: 69, serialNo: 69, arabicName: "قدسا", arabicHarakat: "قُدْسَا",
    englishName: "Qudsa", abjadValue: 165, letterCount: 4,
    breakdown: [{ letter: "ق", value: 100 }, { letter: "د", value: 4 }, { letter: "س", value: 60 }, { letter: "ا", value: 1 }]
  },
  {
    id: 70, serialNo: 70, arabicName: "شرهي", arabicHarakat: "شَرَهِي",
    englishName: "Shrahi", abjadValue: 515, letterCount: 4,
    breakdown: [{ letter: "ش", value: 300 }, { letter: "ر", value: 200 }, { letter: "ه", value: 5 }, { letter: "ي", value: 10 }]
  },
  {
    id: 71, serialNo: 71, arabicName: "مغشغاس", arabicHarakat: "مَغْشَغَاس",
    englishName: "Maghshaghas", abjadValue: 2400, letterCount: 5,
    breakdown: [{ letter: "م", value: 40 }, { letter: "غ", value: 1000 }, { letter: "ش", value: 300 }, { letter: "غ", value: 1000 }, { letter: "ا", value: 1 }, { letter: "س", value: 60 }]
  },
  {
    id: 72, serialNo: 72, arabicName: "عشرا", arabicHarakat: "عِشْرَا",
    englishName: "'Shara", abjadValue: 571, letterCount: 4,
    breakdown: [{ letter: "ع", value: 70 }, { letter: "ش", value: 300 }, { letter: "ر", value: 200 }, { letter: "ا", value: 1 }]
  }
];

export const EVIL_JINN_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "low", label: "Low (≤200)" },
  { id: "medium", label: "Medium (201-400)" },
  { id: "high", label: "High (>400)" }
];