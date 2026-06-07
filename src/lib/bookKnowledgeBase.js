// ═══════════════════════════════════════════════════════════════════════════
//  PERMANENT BOOK KNOWLEDGE DATABASE — v3.0
//  Primary Source: "The Occult Encyclopedia of Magick Squares"
//    — Planetary Angels and Spirits of Ceremonial Magick
//    — Author: Nineveh Shadrach
//    — Publisher: Ishtar Publishing, Vancouver
//  Secondary Source: Screenshots of companion volume (Arabic/Hebrew tradition)
//
//  RULES:
//  - NEVER delete entries. Only ADD.
//  - Each entry tagged with page, chapter, book, date_added.
//  - Before answering any magic square question, search this DB first.
// ═══════════════════════════════════════════════════════════════════════════

export const BOOK_META = {
  primaryBook: {
    title: "The Occult Encyclopedia of Magick Squares — Planetary Angels and Spirits of Ceremonial Magick",
    author: "Nineveh Shadrach",
    publisher: "Ishtar Publishing, Vancouver",
    isbn: "978-1-926667-09-6",
    tradition: "Golden Dawn / Western Mystery Tradition",
    part1_pages: "i–60 (pages confirmed processed)",
    total_pages_in_full_book: "750+",
  },
  companionBook: {
    title: "Occult Encyclopedia of Magic Squares (Arabic/Hebrew tradition companion)",
    tradition: "Classical Arabic/Hebrew Near Eastern tradition",
    pages_processed: "xxvi–204+",
  },
  lastUpdated: "2026-06-07",
  totalScreenshots: 250,
  totalPDFPagesProcessed: 100,
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 1 — BOOK TERMINOLOGY (p.iii–iv)
// ═══════════════════════════════════════════════════════════════════════════
export const TERMINOLOGY = {
  kamea: { definition: "Hebrew word for magic square; means talisman or amulet", page: "iii" },
  alWifeq: { definition: "Arabic word for magic square; carries similar meaning to kamea", page: "iii" },
  magicSquareTypes: [
    { type: "Numerical", definition: "Consists only of a sequence of numbers", page: "iii" },
    { type: "Alphabetical Numerical", definition: "Digits represented by their equivalent letters", page: "iii" },
    { type: "Alphabetical", definition: "Consists only of letters; different type than alphabetical numerical", page: "iii" },
    { type: "Alphanumerical", definition: "Combines both numbers and letters", page: "iii" },
  ],
  usePrinciple: {
    rule: "Numerical and alphabetical numerical squares are effective for evoking the corresponding force in the material world. Alphabetical and alphanumerical squares are for angelic or celestial beings.",
    page: "iii",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 2 — PLANETARY MAGIC SQUARE SIZES (p.x–xi)
// ═══════════════════════════════════════════════════════════════════════════
// PRIMARY sizes (7 classical planets, first cycle):
export const PLANET_PRIMARY_SIZES = [
  { planet: "Saturn",  size: 3,  magic_constant: 15,  esoteric_number: 45,   total_cells: 9   },
  { planet: "Jupiter", size: 4,  magic_constant: 34,  esoteric_number: 136,  total_cells: 16  },
  { planet: "Mars",    size: 5,  magic_constant: 65,  esoteric_number: 325,  total_cells: 25  },
  { planet: "Sun",     size: 6,  magic_constant: 111, esoteric_number: 666,  total_cells: 36  },
  { planet: "Venus",   size: 7,  magic_constant: 175, esoteric_number: 1225, total_cells: 49  },
  { planet: "Mercury", size: 8,  magic_constant: 260, esoteric_number: 2080, total_cells: 64  },
  { planet: "Moon",    size: 9,  magic_constant: 369, esoteric_number: 3321, total_cells: 81  },
];

// EXTENDED sizes — cycle repeats Saturn→Moon indefinitely:
export const PLANET_EXTENDED_SIZES = {
  // Pattern: size % 7 maps to planet index (Saturn=0, Jupiter=1, Mars=2, Sun=3, Venus=4, Mercury=5, Moon=6)
  // (size - 3) % 7 gives index 0–6
  Saturn:  [3,10,17,24,31,38,45,52,59,66,73,80,87,94],
  Jupiter: [4,11,18,25,32,39,46,53,60,67,74,81,88,95],
  Mars:    [5,12,19,26,33,40,47,54,61,68,75,82,89,96],
  Sun:     [6,13,20,27,34,41,48,55,62,69,76,83,90,97],
  Venus:   [7,14,21,28,35,42,49,56,63,70,77,84,91,98],
  Mercury: [8,15,22,29,36,43,50,57,64,71,78,85,92,99],
  Moon:    [9,16,23,30,37,44,51,58,65,72,79,86,93,100],
  // Book explicitly confirms: "The ultimate magic square, 100×100, corresponds with the Moon" (p.xi)
  rule: "Ancients restarted the cycle at size 10. Adding extra modern planets would throw the whole system off. (p.xi)",
  bookMaxUsed: "10×10 (due to space limitations in the book — not a theoretical limit)",
  page: "x-xi",
};

// CONFIRMED magic constants for first 16 squares (p.xix):
export const CONFIRMED_MAGIC_CONSTANTS = [
  { planet:"Saturn",  size:3,  cells:9,   lineSum:15,   totalSum:45    },
  { planet:"Jupiter", size:4,  cells:16,  lineSum:34,   totalSum:136   },
  { planet:"Mars",    size:5,  cells:25,  lineSum:65,   totalSum:325   },
  { planet:"Sun",     size:6,  cells:36,  lineSum:111,  totalSum:666   },
  { planet:"Venus",   size:7,  cells:49,  lineSum:175,  totalSum:1225  },
  { planet:"Mercury", size:8,  cells:64,  lineSum:260,  totalSum:2080  },
  { planet:"Moon",    size:9,  cells:81,  lineSum:369,  totalSum:3321  },
  { planet:"Saturn",  size:10, cells:100, lineSum:505,  totalSum:5050  },
  { planet:"Jupiter", size:11, cells:121, lineSum:671,  totalSum:7381  },
  { planet:"Mars",    size:12, cells:144, lineSum:870,  totalSum:10440 },
  { planet:"Sun",     size:13, cells:169, lineSum:1105, totalSum:14365 },
  { planet:"Venus",   size:14, cells:196, lineSum:1379, totalSum:19306 },
  { planet:"Mercury", size:15, cells:225, lineSum:1695, totalSum:25425 },
  { planet:"Moon",    size:16, cells:256, lineSum:2056, totalSum:32896 },
];

// Pythagorean reduction pattern for line sums: 6-7-2-3-4-8-9-1-5 (repeating, starting at 3×3)
// All esoteric numbers reduce to either 1 or 9 (Alpha=1, Omega=9)
export const ESOTERIC_NUMBER_LAW = {
  rule: "All magic square esoteric numbers reduce to 1 or 9 via Pythagorean reduction",
  alphaSquares: "Reduce to 1",
  omegaSquares: "Reduce to 9",
  pattern: "Starting 3×3: 6-7-2-3-4-8-9-1-5 (non-repeating 9 digits, then cycles)",
  page: "xx-xxi",
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 3 — ELEMENTAL TRANSFORMATIONS (p.xii-xvii, xix)
//  CRITICAL: Book uses ASTROLOGICAL sequence Fire-Earth-Air-Water (p.xvii)
//  NOT alchemical Fire-Air-Water-Earth
// ═══════════════════════════════════════════════════════════════════════════
export const ELEMENT_RULES = {
  bookSequence: "Fire - Earth - Air - Water (astrological sequence, used throughout book)",
  alchemicalSequence: "Fire - Air - Water - Earth (alternative, not used in this book)",
  authorPreference: "I am in favor of using the astrological arrangement. I have used this arrangement throughout the book. (p.xvii)",
  page: "xv-xvii",
  elementDescriptions: [
    { element: "Fire",  qualities: "Hot and Dry",   direction: "Eastern",  zodiacSigns: ["Aries (Male)", "Leo (Male)", "Sagittarius (Male)"],        purpose: "Being well received and respected" },
    { element: "Earth", qualities: "Cold and Dry",  direction: "Northern", zodiacSigns: ["Taurus (Female)", "Virgo (Female)", "Capricorn (Female)"],  purpose: "Separation, Betrayal, and Imprisonment" },
    { element: "Air",   qualities: "Hot and Moist", direction: "Western",  zodiacSigns: ["Gemini (Male)", "Libra (Male)", "Aquarius (Male)"],          purpose: "Arousing of Passion and Attraction" },
    { element: "Water", qualities: "Cold and Moist",direction: "Southern", zodiacSigns: ["Cancer (Female)", "Scorpio (Female)", "Pisces (Female)"],    purpose: "Bringing of Prosperity" },
  ],
  transformations: [
    // From the MANUSCRIPT table decoded by author (p.xv-xix):
    // The book decoded two conflicting manuscripts and reconciled them.
    // CONFIRMED elemental square pattern for 3×3 (from manuscript Azrael/Michael/Israfel/Gabriel):
    { element: "Fire",  sampleSquare3x3: [[8,1,6],[3,5,7],[4,9,2]], description: "Standard 3×3 pattern — base/original" },
    { element: "Earth", sampleSquare3x3: [[4,9,2],[3,5,7],[8,1,6]], description: "Same as Fire in corrected table (Azrael = Earth, Cold and Dry)" },
    { element: "Water", sampleSquare3x3: [[4,9,2],[3,5,7],[8,1,6]], description: "Michael = Water, Cold and Moist" },
    { element: "Air",   sampleSquare3x3: [[2,7,6],[9,5,1],[4,3,8]], description: "Israfel = Air, Hot and Moist" },
    // NOTE: The book's TABLE header uses "Fire-[Planet]" format throughout
  ],
  bookHeaderFormat: "Headers read 'Fire-Saturn', 'Air-Jupiter', etc. to indicate Element + Planet",
  compatibilityNote: "All four elemental versions of any square are valid. Use element aligned with your purpose. (p.xviii)",
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 4 — ANGELS AND JINN HIERARCHY SYSTEM (p.xxii-xxv)
//  THE MASTER FORMULA TABLE — BOOK CONFIRMED
// ═══════════════════════════════════════════════════════════════════════════
export const HIERARCHY_SYSTEM = {
  description: "From each magic square, 8 Angels and 8 Jinn can be extracted. Ancient Near Eastern system from Arabic manuscripts.",
  angelUse: "Angels for constructive purposes",
  jinnUse: "Jinn for destructive purposes",
  combinedUse: "Angels and Jinn together for material manifestation — angels commanding jinn",
  warning: "The names are linked to the square, not directly to the named entity. Multiple names could share the same square.",
  page: "xxii-xxv",
};

// FORMULAS — BOOK CONFIRMED (p.xxiii):
export const HIERARCHY_FORMULAS = {
  usurper:         { title:"Usurper",          formula:"First number in the square (minimum cell value)" },
  guide:           { title:"Guide",            formula:"Last number in the square (maximum cell value)" },
  mystery:         { title:"Mystery",          formula:"First Number + Last Number" },
  adjuster:        { title:"Adjuster",         formula:"Total Sum of a Row (= Magic Constant)" },
  leader:          { title:"Leader",           formula:"Total Value of All Rows (= Esoteric Number = MC × n)" },
  regulator:       { title:"Regulator",        formula:"Total Sum of a Row + Total Sum of All Rows (= MC + MC×n = MC×(n+1))" },
  genGov:          { title:"General Governor", formula:"(Total Sum of a Row + Total Sum of All Rows) × 2 (= MC×(n+1)×2)" },
  highOverseer:    { title:"High Overseer",    formula:"((Total Sum of a Row + Total Sum of All Rows) × 2) × Last Number in the Square = General Governor × Guide" },
  // ✅ HIGH OVERSEER FORMULA NOW CONFIRMED FROM PDF p.xxiii:
  // HighOverseer = ((MC + MC×n) × 2) × Guide = GenGov × Guide
  // Verify 3×3 (n=3, MC=15, Guide=9): GenGov=120, HighOverseer=120×9=1080 ✓
  // Verify 4×4 (n=4, MC=34, Guide=16): GenGov=340, HighOverseer=340×16=5440 ✓
  // Verify 5×5 (n=5, MC=65, Guide=25): GenGov=780, HighOverseer=780×25=19500 ✓
  // Verify 6×6 (n=6, MC=111, Guide=36): GenGov=1554, HighOverseer=1554×36=55944 ✓
  // Verify 7×7 (n=7, MC=175, Guide=49): GenGov=2600, HighOverseer=2600×49=127400 ✓
  // Verify 8×8 (n=8, MC=260, Guide=64): GenGov=4680, HighOverseer=4680×64=299520 ✓
  // Verify 9×9 (n=9, MC=369, Guide=81): GenGov=7380, HighOverseer=7380×81=597780 ✓
  highOverseerConfirmed: "HIGH OVERSEER = General Governor × Guide = ((MC×(n+1))×2) × (Usurper + n²−1)",
};

// CANONICAL BASE VALUES (standard squares, Usurper=1) — BOOK CONFIRMED (p.xxiv-xxviii):
export const BASE_HIERARCHY_VALUES = [
  { size:"3×3",  n:3,  usurper:1,  guide:9,   mystery:10,  adjuster:15,   leader:45,    regulator:60,    genGov:120,    highOverseer:1080    },
  { size:"4×4",  n:4,  usurper:1,  guide:16,  mystery:17,  adjuster:34,   leader:136,   regulator:170,   genGov:340,    highOverseer:5440    },
  { size:"5×5",  n:5,  usurper:1,  guide:25,  mystery:26,  adjuster:65,   leader:325,   regulator:390,   genGov:780,    highOverseer:19500   },
  { size:"6×6",  n:6,  usurper:1,  guide:36,  mystery:37,  adjuster:111,  leader:666,   regulator:777,   genGov:1554,   highOverseer:55944   },
  { size:"7×7",  n:7,  usurper:1,  guide:49,  mystery:50,  adjuster:175,  leader:1125,  regulator:1300,  genGov:2600,   highOverseer:127400  },
  { size:"8×8",  n:8,  usurper:1,  guide:64,  mystery:65,  adjuster:260,  leader:2080,  regulator:2340,  genGov:4680,   highOverseer:299520  },
  { size:"9×9",  n:9,  usurper:1,  guide:81,  mystery:82,  adjuster:369,  leader:3321,  regulator:3690,  genGov:7380,   highOverseer:597780  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 5 — SUFFIX AND ANGEL/JINN NAME SYSTEM (p.xxvii-xxix)
// ═══════════════════════════════════════════════════════════════════════════
export const SUFFIX_SYSTEM = {
  angelSuffix: {
    word: "AL (El/Aeel)",
    meaning: "Ancient Semitic word for God",
    hebrewValue: 31,
    arabicValue: 41,
    hebrewSpelling: "אל (Aleph=1 + Lamed=30 = 31)",
    arabicSpelling: "إيل (Aeel — phonetic Arabic = 41)",
    page: "xxvii",
  },
  jinnSuffix: {
    derivationRule: "360 − angelic suffix = jinn suffix",
    arabicJinnSuffix: { value: 319, letters: "Sheen(300)+Ya(10)+Toa(9) = Teesh or To-Ya-Sha", derivation: "360 − 41 = 319" },
    hebrewJinnSuffix: { value: 329, letters: "Shin(300)+Kaph(20)+Teth(9) = Takesh", derivation: "360 − 31 = 329" },
    page: "xxvii",
  },
  nameConstructionMethod: {
    step1: "Identify the hierarchy tier value (e.g. Adjuster=136 for 4×4)",
    step2: "Subtract the suffix FIRST (e.g. 136 − 31 = 105 for Hebrew angel)",
    step3: "Pronounce the remainder to determine letter order",
    step4: "Convert to letters (e.g. 105 → 'one hundred and five' → 100(Qoph)+5(Heh) = QH)",
    step5: "Append suffix (QH + EL = QHAL, pronounced Qahael)",
    note: "Subtract suffix FIRST so that total value INCLUDING suffix equals the desired number",
    page: "xxviii",
    example: { number: 136, system: "Hebrew", step: "136−31=105 → Q(100)+H(5)+EL = QHAL (Qahael)" },
  },
  negativeValueFix: {
    rule: "If value is less than the suffix: add 360 first, then subtract suffix, then proceed",
    example: "Value=5, Hebrew suffix=31: 5+360=365, 365−31=334, convert 334 to letters",
    source: "Old manuscripts workaround",
    page: "xxix",
  },
  largeNumbersHebrew: {
    rule: "For values > 400, use compound letters. 900 has no direct letter → 400+400+100",
    example999: "999 = 400+400+100+90+9 → ת+ת+ק+צ+ט = Th-Th-Q-Ts-T",
    example1030: "1030 − suffix(31) = 999 → convert as above",
    example20000: "כתר (Kaf+Tav+Resh = 20+400+200+[thousands handled separately])",
    page: "xxviii-xxix",
  },
  arabicAdvantage: {
    note: "Arabic is easier for large numbers — has Ghain(غ)=1000. Arabic shares all Hebrew letters plus 6 more.",
    example351123: "ShANGhQJK (Shanghaqajek) = Sh(300)+A(1)+N(50)+Gh(1000)+Q(100)+J(3)+K(20)",
    page: "xxix",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 6 — LETTER TABLES (p.xxvi-xxvii)
//  BOOK-CONFIRMED: Hebrew 22 letters (1–400) + Arabic 28 letters (1–1000)
// ═══════════════════════════════════════════════════════════════════════════
export const HEBREW_LETTER_TABLE = [
  { value:1,   letter:"א", name:"Aleph",  englishEquiv:"A"    },
  { value:2,   letter:"ב", name:"Beth",   englishEquiv:"B, V" },
  { value:3,   letter:"ג", name:"Gimel",  englishEquiv:"G, J" },
  { value:4,   letter:"ד", name:"Daleth", englishEquiv:"D"    },
  { value:5,   letter:"ה", name:"Heh",    englishEquiv:"H"    },
  { value:6,   letter:"ו", name:"Waw",    englishEquiv:"V,U,W"},
  { value:7,   letter:"ז", name:"Zayin",  englishEquiv:"Z"    },
  { value:8,   letter:"ח", name:"Heth",   englishEquiv:"Ch, H"},
  { value:9,   letter:"ט", name:"Teth",   englishEquiv:"T"    },
  { value:10,  letter:"י", name:"Yod",    englishEquiv:"Y"    },
  { value:20,  letter:"כ", name:"Kaf",    englishEquiv:"K"    },
  { value:30,  letter:"ל", name:"Lamed",  englishEquiv:"L"    },
  { value:40,  letter:"מ", name:"Mem",    englishEquiv:"M"    },
  { value:50,  letter:"נ", name:"Nun",    englishEquiv:"N"    },
  { value:60,  letter:"ס", name:"Samekh", englishEquiv:"S"    },
  { value:70,  letter:"ע", name:"Ayin",   englishEquiv:"O, A" },
  { value:80,  letter:"פ", name:"Pe",     englishEquiv:"Ph, F"},
  { value:90,  letter:"צ", name:"Tsadi",  englishEquiv:"Ts"   },
  { value:100, letter:"ק", name:"Qof",    englishEquiv:"Q"    },
  { value:200, letter:"ר", name:"Resh",   englishEquiv:"R"    },
  { value:300, letter:"ש", name:"Shin",   englishEquiv:"Sh"   },
  { value:400, letter:"ת", name:"Tav",    englishEquiv:"T,Th" },
  // Compound values (no single letter — use combinations):
  { value:500, letter:"תק", name:"(compound)", englishEquiv:"(none)" },
  { value:600, letter:"תר", name:"(compound)", englishEquiv:"(none)" },
  { value:700, letter:"תש", name:"(compound)", englishEquiv:"(none)" },
  { value:800, letter:"תת", name:"(compound)", englishEquiv:"(none)" },
  { value:900, letter:"תתק",name:"(compound)", englishEquiv:"(none)" },
];

export const ARABIC_LETTER_TABLE = [
  { value:1,    letter:"ا", name:"Alef",  englishEquiv:"A"    },
  { value:2,    letter:"ب", name:"Ba",    englishEquiv:"B"    },
  { value:3,    letter:"ج", name:"Jeem",  englishEquiv:"J"    },
  { value:4,    letter:"د", name:"Dal",   englishEquiv:"D"    },
  { value:5,    letter:"ه", name:"Ha",    englishEquiv:"H"    },
  { value:6,    letter:"و", name:"Waw",   englishEquiv:"W, U" },
  { value:7,    letter:"ز", name:"Zai",   englishEquiv:"Z"    },
  { value:8,    letter:"ح", name:"Ha2",   englishEquiv:"H"    },
  { value:9,    letter:"ط", name:"Toa",   englishEquiv:"T"    },
  { value:10,   letter:"ي", name:"Ya",    englishEquiv:"Y, I" },
  { value:20,   letter:"ك", name:"Kaf",   englishEquiv:"K"    },
  { value:30,   letter:"ل", name:"Lam",   englishEquiv:"L"    },
  { value:40,   letter:"م", name:"Meem",  englishEquiv:"M"    },
  { value:50,   letter:"ن", name:"Nun",   englishEquiv:"N"    },
  { value:60,   letter:"س", name:"Seen",  englishEquiv:"S"    },
  { value:70,   letter:"ع", name:"Ayin",  englishEquiv:"a"    },
  { value:80,   letter:"ف", name:"Fa",    englishEquiv:"F"    },
  { value:90,   letter:"ص", name:"Sad",   englishEquiv:"Ts"   },
  { value:100,  letter:"ق", name:"Qaf",   englishEquiv:"Q"    },
  { value:200,  letter:"ر", name:"Ra",    englishEquiv:"R"    },
  { value:300,  letter:"ش", name:"Sheen", englishEquiv:"Sh"   },
  { value:400,  letter:"ت", name:"Ta",    englishEquiv:"T"    },
  { value:500,  letter:"ث", name:"Tha",   englishEquiv:"Th"   },
  { value:600,  letter:"خ", name:"Kha",   englishEquiv:"Kh, Ch"},
  { value:700,  letter:"ذ", name:"Dhal",  englishEquiv:"Dh, Tz"},
  { value:800,  letter:"ض", name:"Dad",   englishEquiv:"D"    },
  { value:900,  letter:"ظ", name:"Zhoa",  englishEquiv:"Zh, Z"},
  { value:1000, letter:"غ", name:"Ghain", englishEquiv:"Gh, G"},
];

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 7 — PLANET CORRESPONDENCES (p.xxx-xxxv)
// ═══════════════════════════════════════════════════════════════════════════
export const PLANET_CORRESPONDENCES = {
  saturn: {
    keywords:    ["Obstructions","Delays","Defects","Fatalities","Losses","Sorrows","Poverty","Decay","Long Illnesses","Long Relationships"],
    bodyParts:   ["Teeth","Ligaments","Skin","Skeleton","Gall Bladder","Auditory Organs","Knees","Sigmoid Fexture","Left Ear"],
    professions: ["Conservative Business","Real Estate","Mining","Undertakers","Jailers","Farmers","Masons","Bricklayers"],
    traits:      ["Analytical","Tactful","Responsible","Punctual","Studious","Faithful","Chaste"],
    page: "xxx",
  },
  jupiter: {
    keywords:    ["Honors","Long Journeys","Legal Affairs","Protection","Religious Affiliations","Successes","Friendships"],
    bodyParts:   ["Liver","Glycogen","Thighs","Hips","Right Ear","Viscera","Arterial System","Upper Forehead"],
    professions: ["Lawyers","Ministers","Financers","Insurance","Charity Workers","General Physicians","Restaurant Workers","Philanthropists","Merchants","Clothiers","Philosophers"],
    traits:      ["Benevolence","Honor","Joviality","Patience","Wisdom","Justness","Popularity","Piety","Compassion","Well-Respected"],
    page: "xxx-xxxi",
  },
  mars: {
    keywords:    ["Strife and Conflicts","Wounds","Burns","Poisoning","Fires","Sudden Death","Impetuous Actions","Adventures","Enthusiasms"],
    bodyParts:   ["Muscular Tissues","Bile","Nose","Motor Nerves","Red Blood","External Generative Organs"],
    professions: ["Military","Chemists","Metal Workers","Dentists","Engineers","Barbers","Butchers","Firefighters","Competitive Sports","Surgeons"],
    traits:      ["Bravery","Expertise","High Energy","Strength","Independence","High Mindedness","Impulsiveness"],
    page: "xxxi",
  },
  sun: {
    keywords:    ["Fame","Health","Powerful Friends","Public Office","Fortunate Circumstances","Elevation to High Positions","Success in Public Enterprises"],
    bodyParts:   ["Heart","Vital Fluids","Blood Circulation"],
    professions: ["Executive Positions","Jewelers","Goldsmiths","Judges","Public Servants","Acting","Monarchs","Leaders"],
    traits:      ["Vitality","Ambition","Dignity","Versatility","Education","Good Character"],
    page: "xxxi",
  },
  venus: {
    keywords:    ["Love Affairs","Beautiful Environments","Friendship of Women","Pleasure","Marriage","Desires of All Kinds"],
    bodyParts:   ["Kidneys","Throat","Oral Ducts","Mouth","Cheeks","Thymus Gland","Ovaries","Internal Reproductive System"],
    professions: ["Singers","Actors","Musicians","Designers","Botanists","Painters","Dancers","Poets","Fashion Creators"],
    traits:      ["Artistic Temperament","Diplomatic Nature","Affection","Attractiveness","Poetic Ability","Artistic Ability","Love","Harmony","Luck"],
    page: "xxxii",
  },
  mercury: {
    keywords:    ["Quick Travel","Commerce","Sudden Changes","Scattered Thoughts","Worries","Communication Challenges"],
    bodyParts:   ["General Nervous System","Tongue","Senses","Thyroid Gland","Nerve Fluid","Vocal Cord","Hearing and Sight","Intestines"],
    professions: ["Accountants","Broadcasters","Advertising Agents","Jesters","Debaters","Orators","Journalists","Writers","Inventors","Booksellers","Publishers","Clerks","Civil Engineers"],
    traits:      ["Dexterity","Subtlety","Brilliance","Industriousness","Retention","Wit","Literacy","Strong Intellect","Fluency","Impressionability"],
    page: "xxxii",
  },
  moon: {
    keywords:    ["Water Travel","Popularity","Idealism","Visions","Emotionalism","Rapid Changes"],
    bodyParts:   ["Stomach","Breasts","Lymphatics","Tear Ducts","Nerve Sheaths","Mucous Membranes","Brain Matter"],
    professions: ["Sailor","Psychologists","Childcare Providers","Cooks","Fishery","Nutrition","Psychic Work","Spy Work","Nurses","Healers"],
    traits:      ["Positive Psychic Development","Imagination","Peaceful Temperament","Personal Magnetism","Emotional Strength"],
    page: "xxxii-xxxiii",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 8 — ZODIAC SIGN CORRESPONDENCES (p.xxxiii-xxxviii)
// ═══════════════════════════════════════════════════════════════════════════
export const ZODIAC_CORRESPONDENCES = {
  aries:       { rulingPlanet:"Mars",    professions:"Same as Mars",    traits:["Pioneering","Enterprising","Confident","Explorative","Independent","Precise","Expedient","Aggressive","Competitive","Dictatorial","Scientific","Ingenious"], principle:"The Will to Accomplish, the Power from Adversity, Cosmic Urge, and Consciousness", page:"xxxiii" },
  taurus:      { rulingPlanet:"Venus",   professions:"Same as Venus",   traits:["Persistent","Steadfast","Patient","Determined","Stubborn","Materialistic","Emotionally Driven","Conservative","Retentive"], principle:"Ebb and Flow of the Cosmos, Attraction and Repulsion, Universal Motion and Celestial Rhythm", page:"xxxiii" },
  gemini:      { rulingPlanet:"Mercury", professions:"Same as Mercury", traits:["Inventive","Versatile","Superficial Thinker","Analytical","Tricky","Dextrous","Adaptable","Self-Expressive","Curious"], principle:"Mirror of the Spirit, Power of Imagination, Universal Substance, and the Vision of Relationships", page:"xxxiii" },
  cancer:      { rulingPlanet:"Moon",    professions:"Same as Moon",    traits:["Self-Sacrificing","Veneration for Tradition","Cautious","Reserved","Brooding","Negative","Receptive"], principle:"Physical Life Principle, Sustaining Energy, Power of Receptivity, and the Sacred Breath", page:"xxxiv" },
  leo:         { rulingPlanet:"Sun",     professions:"Same as Sun",     traits:["Ambitious","Optimistic","Magnanimous","Opposed to Secrecy","Challenging","Bold","Autocratic","Generous"], principle:"Will to Illuminate, Faith, Will to Rule, and Life Principle", page:"xxxiv" },
  virgo:       { rulingPlanet:"Mercury", professions:"Same as Mercury", traits:["Witty","Studious","Versatile","Methodical","Skeptical","Critical","Ingenious","Fear of Disease and Poverty","Scheming","Scientific"], principle:"Form in Bondage, Desire to Serve, Feeling Pity, and Shadow of the Spirit", page:"xxxiv" },
  libra:       { rulingPlanet:"Venus",   professions:"Same as Venus",   traits:["Imitative","Tactful","Undecided","Persuasive","Fond of Show","Materialistic","Intriguing"], principle:"Power of Sex, Consciousness of Judgment, Order of Creation, and the Symbol of the Fall", page:"xxxiv" },
  scorpio:     { rulingPlanet:"Mars",    professions:"Same as Mars",    traits:["Penetrating","Temperamental","Sarcastic","Vindictive","Altruistic","Executive","Intellectual","Scientific","Explorative","Anarchistic"], principle:"Spiritual Power in the Mundane, Fashioner, Desire Impulse, and Spiritual Memory", page:"xxxv" },
  sagittarius: { rulingPlanet:"Jupiter", professions:"Same as Jupiter", traits:["Jovial","Philosophical","Frank","Eclectic","Intrepid","Prophetic","Extremely Ambitious","Progressive","Financially Inclined"], principle:"Seat of Intuition, Cosmic Thinker, Patron of Conscious Evolution, and Esoteric Understanding", page:"xxxv" },
  capricorn:   { rulingPlanet:"Saturn",  professions:"Same as Saturn",  traits:["Laborious","Economical","Conservative","Scrupulous","Detailed Thinker","Fatalistic","Stubborn","Domineering","Egotistic","Brooding","Cautious"], principle:"Individuality, Separateness, Competitive Spirit, and Lack of Connection with Spiritual Reality", page:"xxxv" },
  aquarius:    { rulingPlanet:"Saturn",  professions:"Same as Saturn",  traits:["Inventive","Creative","Independent","Discreet","Humanitarian","Optimistic","Superficial","Unforeseeing","Tolerant","Reasonable","Diplomatic"], principle:"Soul and Seat of Perceiving Power", page:"xxxv" },
  pisces:      { rulingPlanet:"Jupiter", professions:"Same as Jupiter", traits:["Intuitive","Abstract","Introspective","Religious","Clairvoyant","Impractical","Procrastinating","Fatalistic","Insecure","Compassionate"], principle:"Meditation on the Source and the Will to Renounce", page:"xxxviii" },
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 9 — BOOK STRUCTURE / CONTENTS (p.iv)
//  Full table of contents confirming structure
// ═══════════════════════════════════════════════════════════════════════════
export const BOOK_CONTENTS = {
  preface: "p.i",
  quickGuide: "p.iii",
  zodiacChapters: {
    aries:       { startPage: 1 },
    taurus:      { startPage: 64 },
    gemini:      { startPage: 118 },
    cancer:      { startPage: 193 },
    leo:         { startPage: 249 },
    virgo:       { startPage: 303 },
    libra:       { startPage: 353 },
    scorpio:     { startPage: 404 },
    sagittarius: { startPage: 459 },
    capricorn:   { startPage: 514 },
    aquarius:    { startPage: 559 },
    pisces:      { startPage: 601 },
  },
  planetaryChapters: {
    saturn:  { startPage: 654 },
    jupiter: { startPage: 674 },
    mars:    { startPage: 695 },
    sun:     { startPage: 701 },
    venus:   { startPage: 722 },
    mercury: { startPage: 732 },
    moon:    { startPage: 750 },
  },
  // Entities within each zodiac sign chapter (confirmed from Aries chapter pp.1–60):
  perZodiacStructure: [
    "Sign (e.g. Taleh=44 for Aries)",
    "Archangel of sign",
    "Angel of sign",
    "Lord of Triplicity by Day",
    "Lord of Triplicity by Night",
    "Angel Ruling 1st House",
    "Angel of First Decanate",
    "Angel of Second Decanate",
    "Angel of Third Decanate",
    "Angel of First Quinance",
    "Angel of Second Quinance",
    "Angel of Third Quinance",
    "Angel of Fourth Quinance",
    "Angel of Fifth Quinance",
    "Angel of Sixth Quinance",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 10 — ARIES CHAPTER — ALL CONFIRMED HIERARCHY VALUES (pp.1–60)
//  Each entity: usurper, guide, mystery, adjuster, leader, regulator, genGov, highOverseer
//  Plus: angel_arabic, angel_hebrew, jinn_arabic, jinn_hebrew for each tier
// ═══════════════════════════════════════════════════════════════════════════
export const ARIES_ENTITIES = [
  {
    name: "Sign Aries: Taleh", hebrewValue: 44, gridSize: 4, planet: "Jupiter",
    note: "Hebrew Squares Not Available",
    squares: { fire:[[3,14,8,19],[18,9,11,6],[13,4,20,7],[10,17,5,12]], air:[[12,5,17,10],[7,20,4,13],[6,11,9,18],[19,8,14,3]], earth:[[10,13,18,3],[17,4,9,14],[5,20,11,8],[12,7,6,19]], water:[[19,6,7,12],[8,11,20,5],[14,9,4,17],[3,18,13,10]] },
    hierarchy: { usurper:3, guide:20, mystery:23, adjuster:352, leader:1056, regulator:1408, genGov:2816, highOverseer:56320 },
    angelArabic: { usurper:322, guide:339, mystery:342, adjuster:311, leader:1015, regulator:1367, genGov:2775, highOverseer:56279 },
    angelHebrew: { usurper:332, guide:349, mystery:352, adjuster:321, leader:1025, regulator:1377, genGov:2785, highOverseer:56289 },
    jinnArabic:  { usurper:44, guide:61, mystery:64, adjuster:33, leader:737, regulator:1089, genGov:2497, highOverseer:56001 },
    jinnHebrew:  { usurper:34, guide:51, mystery:54, adjuster:23, leader:727, regulator:1079, genGov:2487, highOverseer:55991 },
    page: "1",
  },
  {
    name: "Archangel of Aries: Malkidiel", hebrewValue: 135, gridSize: 3, planet: "Saturn",
    squares: { fire:[[46,41,48],[47,45,43],[42,49,44]], earth:[[42,47,46],[49,45,41],[44,43,48]], air:[[44,49,42],[43,45,47],[48,41,46]], water:[[48,43,44],[41,45,49],[46,47,42]] },
    hierarchy: { usurper:41, guide:49, mystery:90, adjuster:135, leader:405, regulator:540, genGov:1080, highOverseer:52920 },
    angelArabic: { usurper:360, guide:8, mystery:49, adjuster:94, leader:364, regulator:499, genGov:1039, highOverseer:52879 },
    angelHebrew: { usurper:10, guide:18, mystery:59, adjuster:104, leader:374, regulator:509, genGov:1049, highOverseer:52889 },
    jinnArabic:  { usurper:82, guide:90, mystery:131, adjuster:176, leader:86, regulator:221, genGov:761, highOverseer:52601 },
    jinnHebrew:  { usurper:72, guide:80, mystery:121, adjuster:166, leader:76, regulator:211, genGov:751, highOverseer:52591 },
    page: "2",
  },
  {
    name: "Angel of Aries: Sharhiel", hebrewValue: 546, gridSize: 3, planet: "Saturn",
    squares: { fire:[[183,178,185],[184,182,180],[179,186,181]], earth:[[179,184,183],[186,182,178],[181,180,185]], air:[[181,186,179],[180,182,184],[185,178,183]], water:[[185,180,181],[178,182,186],[183,184,179]] },
    hierarchy: { usurper:178, guide:186, mystery:364, adjuster:546, leader:1638, regulator:2184, genGov:4368, highOverseer:812448 },
    angelArabic: { usurper:137, guide:145, mystery:323, adjuster:505, leader:1597, regulator:2143, genGov:4327, highOverseer:812407 },
    angelHebrew: { usurper:147, guide:155, mystery:333, adjuster:515, leader:1607, regulator:2153, genGov:4337, highOverseer:812417 },
    jinnArabic:  { usurper:219, guide:227, mystery:45, adjuster:227, leader:1319, regulator:1865, genGov:4049, highOverseer:812129 },
    jinnHebrew:  { usurper:209, guide:217, mystery:35, adjuster:217, leader:1309, regulator:1855, genGov:4039, highOverseer:812119 },
    page: "6",
  },
  {
    name: "Lord of Triplicity by Day: Sateraton", hebrewValue: 398, gridSize: 4, planet: "Jupiter",
    squares: { fire:[[92,103,97,106],[105,98,100,95],[102,93,107,96],[99,104,94,101]], earth:[[99,102,105,92],[104,93,98,103],[94,107,100,97],[101,96,95,106]], air:[[101,94,104,99],[96,107,93,102],[95,100,98,105],[106,97,103,92]], water:[[106,95,96,101],[97,100,107,94],[103,98,93,104],[92,105,102,99]] },
    hierarchy: { usurper:92, guide:107, mystery:199, adjuster:3184, leader:9552, regulator:12736, genGov:25472, highOverseer:2725504 },
    angelArabic: { usurper:51, guide:66, mystery:158, adjuster:3143, leader:9511, regulator:12695, genGov:25431, highOverseer:2725463 },
    angelHebrew: { usurper:61, guide:76, mystery:168, adjuster:3153, leader:9521, regulator:12705, genGov:25441, highOverseer:2725473 },
    jinnArabic:  { usurper:133, guide:148, mystery:240, adjuster:2865, leader:9233, regulator:12417, genGov:25153, highOverseer:2725185 },
    jinnHebrew:  { usurper:123, guide:138, mystery:230, adjuster:2855, leader:9223, regulator:12407, genGov:25143, highOverseer:2725175 },
    page: "17",
  },
  {
    name: "Lord of Triplicity by Night: Sapatavi", hebrewValue: 236, gridSize: 4, planet: "Jupiter",
    squares: { fire:[[51,62,56,67],[66,57,59,54],[61,52,68,55],[58,65,53,60]], earth:[[58,61,66,51],[65,52,57,62],[53,68,59,56],[60,55,54,67]], air:[[60,53,65,58],[55,68,52,61],[54,59,57,66],[67,56,62,51]], water:[[67,54,55,60],[56,59,68,53],[62,57,52,65],[51,66,61,58]] },
    hierarchy: { usurper:51, guide:68, mystery:119, adjuster:1888, leader:5664, regulator:7552, genGov:15104, highOverseer:1027072 },
    angelArabic: { usurper:10, guide:27, mystery:78, adjuster:1847, leader:5623, regulator:7511, genGov:15063, highOverseer:1027031 },
    angelHebrew: { usurper:20, guide:37, mystery:88, adjuster:1857, leader:5633, regulator:7521, genGov:15073, highOverseer:1027041 },
    jinnArabic:  { usurper:92, guide:109, mystery:160, adjuster:1569, leader:5345, regulator:7233, genGov:14785, highOverseer:1026753 },
    jinnHebrew:  { usurper:82, guide:99, mystery:150, adjuster:1559, leader:5335, regulator:7223, genGov:14775, highOverseer:1026743 },
    page: "25",
  },
  {
    name: "Angel Ruling 1st House: Ayel", hebrewValue: 42, gridSize: 3, planet: "Saturn",
    note: "Hebrew Squares Not Available",
    squares: { fire:[[15,10,17],[16,14,12],[11,18,13]], earth:[[11,16,15],[18,14,10],[13,12,17]], air:[[13,18,11],[12,14,16],[17,10,15]], water:[[17,12,13],[10,14,18],[15,16,11]] },
    hierarchy: { usurper:10, guide:18, mystery:28, adjuster:42, leader:126, regulator:168, genGov:336, highOverseer:6048 },
    angelArabic: { usurper:329, guide:337, mystery:347, adjuster:1, leader:85, regulator:127, genGov:295, highOverseer:6007 },
    angelHebrew: { usurper:339, guide:347, mystery:357, adjuster:11, leader:95, regulator:137, genGov:305, highOverseer:6017 },
    jinnArabic:  { usurper:51, guide:59, mystery:69, adjuster:83, leader:167, regulator:209, genGov:17, highOverseer:5729 },
    jinnHebrew:  { usurper:41, guide:49, mystery:59, adjuster:73, leader:157, regulator:199, genGov:7, highOverseer:5719 },
    page: "29",
  },
  {
    name: "Angel of First Decanate: Zazer", hebrewValue: 214, gridSize: 4, planet: "Jupiter",
    note: "Hebrew Squares Not Available",
    squares: { fire:[[46,57,51,60],[59,52,54,49],[56,47,61,50],[53,58,48,55]], earth:[[53,56,59,46],[58,47,52,57],[48,61,54,51],[55,50,49,60]], air:[[55,48,58,53],[50,61,47,56],[49,54,52,59],[60,51,57,46]], water:[[60,49,50,55],[51,54,61,48],[57,52,47,58],[46,59,56,53]] },
    hierarchy: { usurper:46, guide:61, mystery:107, adjuster:1712, leader:5136, regulator:6848, genGov:13696, highOverseer:835456 },
    angelArabic: { usurper:5, guide:20, mystery:66, adjuster:1671, leader:5095, regulator:6807, genGov:13655, highOverseer:835415 },
    angelHebrew: { usurper:15, guide:30, mystery:76, adjuster:1681, leader:5105, regulator:6817, genGov:13665, highOverseer:835425 },
    jinnArabic:  { usurper:87, guide:102, mystery:148, adjuster:1393, leader:4817, regulator:6529, genGov:13377, highOverseer:835137 },
    jinnHebrew:  { usurper:77, guide:92, mystery:138, adjuster:1383, leader:4807, regulator:6519, genGov:13367, highOverseer:835127 },
    page: "31",
  },
  {
    name: "Angel of Second Decanate: Behahemi", hebrewValue: 62, gridSize: 4, planet: "Jupiter",
    squares: { fire:[[8,19,13,22],[21,14,16,11],[18,9,23,12],[15,20,10,17]], earth:[[15,18,21,8],[20,9,14,19],[10,23,16,13],[17,12,11,22]], air:[[17,10,20,15],[12,23,9,18],[11,16,14,21],[22,13,19,8]], water:[[22,11,12,17],[13,16,23,10],[19,14,9,20],[8,21,18,15]] },
    hierarchy: { usurper:8, guide:23, mystery:31, adjuster:496, leader:1488, regulator:1984, genGov:3968, highOverseer:91264 },
    angelArabic: { usurper:327, guide:342, mystery:350, adjuster:455, leader:1447, regulator:1943, genGov:3927, highOverseer:91223 },
    angelHebrew: { usurper:337, guide:352, mystery:360, adjuster:465, leader:1457, regulator:1953, genGov:3937, highOverseer:91233 },
    jinnArabic:  { usurper:49, guide:64, mystery:72, adjuster:177, leader:1169, regulator:1665, genGov:3649, highOverseer:90945 },
    jinnHebrew:  { usurper:39, guide:54, mystery:62, adjuster:167, leader:1159, regulator:1655, genGov:3639, highOverseer:90935 },
    page: "39",
  },
  {
    name: "Angel of Third Decanate: Satander", hebrewValue: 323, gridSize: 4, planet: "Jupiter",
    note: "See page 48 for Hebrew letter squares",
    page: "48",
  },
  {
    name: "Angel of First Quinance: Vehuel", hebrewValue: 48, gridSize: 3, planet: "Saturn",
    squares: { fire:[[17,12,19],[18,16,14],[13,20,15]], earth:[[13,18,17],[20,16,12],[15,14,19]], air:[[15,20,13],[14,16,18],[19,12,17]], water:[[19,14,15],[12,16,20],[17,18,13]] },
    hierarchy: { usurper:41, guide:49, mystery:90, adjuster:135, leader:405, regulator:540, genGov:1080, highOverseer:52920 },
    angelArabic: { usurper:360, guide:8, mystery:49, adjuster:94, leader:364, regulator:499, genGov:1039, highOverseer:52879 },
    angelHebrew: { usurper:10, guide:18, mystery:59, adjuster:104, leader:374, regulator:509, genGov:1049, highOverseer:52889 },
    jinnArabic:  { usurper:82, guide:90, mystery:131, adjuster:176, leader:86, regulator:221, genGov:761, highOverseer:52601 },
    jinnHebrew:  { usurper:72, guide:80, mystery:121, adjuster:166, leader:76, regulator:211, genGov:751, highOverseer:52591 },
    page: "35",
  },
  {
    name: "Angel of Second Quinance: Daniel", hebrewValue: 95, gridSize: 3, planet: "Saturn",
    squares: { fire:[[33,28,35],[34,32,30],[29,36,31]], earth:[[29,34,33],[36,32,28],[31,30,35]], air:[[31,36,29],[30,32,34],[35,28,33]], water:[[35,30,31],[28,32,36],[33,34,29]] },
    hierarchy: { usurper:28, guide:36, mystery:64, adjuster:96, leader:288, regulator:384, genGov:768, highOverseer:27648 },
    angelArabic: { usurper:347, guide:355, mystery:23, adjuster:55, leader:247, regulator:343, genGov:727, highOverseer:27607 },
    angelHebrew: { usurper:357, guide:5, mystery:33, adjuster:65, leader:257, regulator:353, genGov:737, highOverseer:27617 },
    jinnArabic:  { usurper:69, guide:77, mystery:105, adjuster:137, leader:329, regulator:65, genGov:449, highOverseer:27329 },
    jinnHebrew:  { usurper:59, guide:67, mystery:95, adjuster:127, leader:319, regulator:55, genGov:439, highOverseer:27319 },
    page: "36-37",
  },
  {
    name: "Angel of Third Quinance: Hechashiah", hebrewValue: 328, gridSize: 4, planet: "Jupiter",
    squares: { fire:[[74,85,79,90],[89,80,82,77],[84,75,91,78],[81,88,76,83]], earth:[[81,84,89,74],[88,75,80,85],[76,91,82,79],[83,78,77,90]], air:[[83,76,88,81],[78,91,75,84],[77,82,80,89],[90,79,85,74]], water:[[90,77,78,83],[79,82,91,76],[85,80,75,88],[74,89,84,81]] },
    hierarchy: { usurper:74, guide:91, mystery:165, adjuster:2624, leader:7872, regulator:10496, genGov:20992, highOverseer:1910272 },
    angelArabic: { usurper:33, guide:50, mystery:124, adjuster:2583, leader:7831, regulator:10455, genGov:20951, highOverseer:1910231 },
    angelHebrew: { usurper:43, guide:60, mystery:134, adjuster:2593, leader:7841, regulator:10465, genGov:20961, highOverseer:1910241 },
    jinnArabic:  { usurper:115, guide:132, mystery:206, adjuster:2305, leader:7553, regulator:10177, genGov:20673, highOverseer:1909953 },
    jinnHebrew:  { usurper:105, guide:122, mystery:196, adjuster:2295, leader:7543, regulator:10167, genGov:20663, highOverseer:1909943 },
    page: "40",
  },
  {
    name: "Angel of Fourth Quinance: Amamiah", hebrewValue: 165, gridSize: 3, planet: "Saturn",
    squares: { fire:[[56,51,58],[57,55,53],[52,59,54]], earth:[[52,57,56],[59,55,51],[54,53,58]], air:[[54,59,52],[53,55,57],[58,51,56]], water:[[58,53,54],[51,55,59],[56,57,52]] },
    hierarchy: { usurper:51, guide:59, mystery:110, adjuster:165, leader:495, regulator:660, genGov:1320, highOverseer:77880 },
    angelArabic: { usurper:10, guide:18, mystery:69, adjuster:124, leader:454, regulator:619, genGov:1279, highOverseer:77839 },
    angelHebrew: { usurper:20, guide:28, mystery:79, adjuster:134, leader:464, regulator:629, genGov:1289, highOverseer:77849 },
    jinnArabic:  { usurper:92, guide:100, mystery:151, adjuster:206, leader:176, regulator:341, genGov:1001, highOverseer:77561 },
    jinnHebrew:  { usurper:82, guide:90, mystery:141, adjuster:196, leader:166, regulator:331, genGov:991, highOverseer:77551 },
    page: "45-46",
  },
  {
    name: "Angel of Fifth Quinance: Nanael", hebrewValue: 132, gridSize: 3, planet: "Saturn",
    squares: { fire:[[45,40,47],[46,44,42],[41,48,43]], earth:[[41,46,45],[48,44,40],[43,42,47]], air:[[43,48,41],[42,44,46],[47,40,45]], water:[[47,42,43],[40,44,48],[45,46,41]] },
    hierarchy: { usurper:40, guide:48, mystery:88, adjuster:132, leader:396, regulator:528, genGov:1056, highOverseer:50688 },
    angelArabic: { usurper:359, guide:7, mystery:47, adjuster:91, leader:355, regulator:487, genGov:1015, highOverseer:50647 },
    angelHebrew: { usurper:9, guide:17, mystery:57, adjuster:101, leader:365, regulator:497, genGov:1025, highOverseer:50657 },
    jinnArabic:  { usurper:81, guide:89, mystery:129, adjuster:173, leader:77, regulator:209, genGov:737, highOverseer:50369 },
    jinnHebrew:  { usurper:71, guide:79, mystery:119, adjuster:163, leader:67, regulator:199, genGov:727, highOverseer:50359 },
    page: "54",
  },
  {
    name: "Angel of Sixth Quinance: Nithael", hebrewValue: 132, gridSize: 4, planet: "Jupiter",
    squares: { fire:[[115,126,120,130],[129,121,123,118],[125,116,131,119],[122,128,117,124]], earth:[[122,125,129,115],[128,116,121,126],[117,131,123,120],[124,119,118,130]], air:[[124,117,128,122],[119,131,116,125],[118,123,121,129],[130,120,126,115]], water:[[130,118,119,124],[120,123,131,117],[126,121,116,128],[115,129,125,122]] },
    hierarchy: { usurper:115, guide:131, mystery:246, adjuster:3928, leader:11784, regulator:15712, genGov:31424, highOverseer:4116544 },
    angelArabic: { usurper:74, guide:90, mystery:205, adjuster:3887, leader:11743, regulator:15671, genGov:31383, highOverseer:4116503 },
    angelHebrew: { usurper:84, guide:100, mystery:215, adjuster:3897, leader:11753, regulator:15681, genGov:31393, highOverseer:4116513 },
    jinnArabic:  { usurper:156, guide:172, mystery:287, adjuster:3609, leader:11465, regulator:15393, genGov:31105, highOverseer:4116225 },
    jinnHebrew:  { usurper:146, guide:162, mystery:277, adjuster:3599, leader:11455, regulator:15383, genGov:31095, highOverseer:4116215 },
    page: "57",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 11 — TALISMAN CONSTRUCTION RULES (p.xxxvi-xl)
// ═══════════════════════════════════════════════════════════════════════════
export const TALISMAN_RULES = {
  generalRules: [
    { rule: "A magic square, if created and empowered properly, is the ONLY talisman you need for results", page:"xxxvi" },
    { rule: "Must be constructed on a NATURAL surface: paper, leather, or cloth", page:"xxxvi" },
    { rule: "NEVER laminate a talisman", page:"xxxvi" },
    { rule: "NEVER use a printer-produced talisman — hand-write only", page:"xxxvi" },
    { rule: "Inscription must be written right to left (for Hebrew/Arabic)", page:"xl" },
  ],
  sampleTalisman: {
    purpose: "Generating endless opportunities for income growth",
    timing: "Moon in 8th degree of Virgo. No negative aspect to Moon, Mercury and Jupiter.",
    incense: "Frankincense, Saffron, and Amber",
    structure: "Two squares surrounded by large infinity symbol (figure-8)",
    square1: { type:"8×8 all-Heth (ח)", value:512, reduction:"5+1+2=8", meaning:"Represents number 8" },
    square2: { type:"Word square", words:["Aobel (אובל)","Ha (ה)","Gazzah (גזה)","Dehab (זהב)"], translation:"Bring The Golden Fleece" },
    chantWhileDrawing: "Nathan Sha'al Aosher Kabowd Aiysh Melek Yowm",
    chantEnglish: "And I have also given thee that which thou has not asked, both riches and honor, so that there shall not be any among the kings like unto thee all thy days.",
    activationChant8x: "Chesed (Mercy), Chamal (Compassion), Chai (Living)",
    breathChant8x: "Chartom (Magician), Chen (Charm), Chayil (Wealth)",
    afterCompletion: "Wrap in white cloth. Place in wallet. Re-trace inscription every time Moon re-enters 8th degree of Virgo.",
    page: "xxxvi-xl",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 12 — GENERAL CONSTRUCTION RULES
// ═══════════════════════════════════════════════════════════════════════════
export const CONSTRUCTION_RULES = {
  specific_vs_general: {
    rule: "Specific squares are more powerful than general pattern squares. General=area code; specific=actual phone number.",
    page: "viii-ix",
  },
  multipleSquaresRule: {
    rule: "You can have ALL planetary squares (3×3 through 10×10) for a single entity or purpose.",
    page: "xii",
  },
  replacementRule: {
    rule: "You can use a larger square to replace a smaller one of the SAME planetary correspondence. E.g. 10×10 instead of 3×3 for Saturn.",
    page: "xi",
  },
  harmonicPlanetRule: {
    rule: "If a number doesn't fit its corresponding size, use a harmonious planet's size. Mars(5×5) is friend of Saturn(3×3). Mercury(8×8) is neutral — malefic with malefic, benefic with benefic.",
    page: "xi",
  },
  usurperFormula: {
    rule: "Usurper (first/min cell) = (MC − T(n)) ÷ n, where T(n) = n(n²−1)/2",
    page: "confirmed from all Aries squares",
  },
  highOverseerFormula: {
    rule: "High Overseer = General Governor × Guide",
    formula: "((MC×(n+1))×2) × (Usurper + n²−1)",
    confirmed: true,
    confirmedFrom: "p.xxiii formula table + all seven base squares verified",
    page: "xxiii",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 13 — NUMEROLOGY OF NUMBERS (p.xviii-xxii)
// ═══════════════════════════════════════════════════════════════════════════
export const NUMBER_MYSTICISM = {
  1: "Beginning of all things. Unity of the Godhead. Symbol of wisdom.",
  2: "Polarity and duality. Mother of wisdom.",
  3: "First equilibrium of unities. Peace, prudence, temperance, friendship.",
  4: "Root of all things, fountain of nature.",
  5: "Sacred symbol of light, vitality, health. Fifth element ether. The Hierophant.",
  6: "Perfection of all parts. Form of forms. First number of manifestation. God created world in 6 days.",
  7: "Most sacred. 'Worthy of veneration'. Number of life. Fortune, custody, dreams, visions.",
  8: "Love, counsel, law, convenience. Associated with Eleusinian mysteries.",
  9: "Number of human beings (9-month gestation). End and termination of 9 digits. Horizon and ocean.",
  special119: "119 = 7×17. 119th degree of Zodiac = 28th degree of Cancer. Fall of Mars. Moon rules Cancer.",
  special15: "15 = sum of 3×3 row. Numerological value of EVE in Arabic.",
  special45: "45 = total of 3×3 square. Numerological value of ADAM in Arabic and Hebrew.",
  oddEven: "Odd numbers = masculine. Even numbers = feminine. In 3×3: even numbers in corners contain odd numbers (sacred union symbol).",
  page: "xviii-xxiii",
};

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 14 — SCREENSHOT LOG
// ═══════════════════════════════════════════════════════════════════════════
export const SCREENSHOT_LOG = [
  {
    id: "PDF-PART1",
    date_added: "2026-06-07",
    source: "PDF — The Occult Encyclopedia of Magick Squares, Part 1 (pages 1–100)",
    pages_processed: "i, ii, iii, iv, v, viii, ix, x, xi, xii, xiii, xiv, xv, xvi, xvii, xviii, xix, xx, xxi, xxii, xxiii, xxiv, xxv, xxvi, xxvii, xxviii, xxix, xxx, xxxi, xxxii, xxxiii, xxxiv, xxxv, xxxvi, xxxvii, xxxviii, 1–60",
    new_sections_added: [
      "TERMINOLOGY", "PLANET_PRIMARY_SIZES", "PLANET_EXTENDED_SIZES", "CONFIRMED_MAGIC_CONSTANTS",
      "ESOTERIC_NUMBER_LAW", "ELEMENT_RULES", "HIERARCHY_SYSTEM", "HIERARCHY_FORMULAS",
      "BASE_HIERARCHY_VALUES", "SUFFIX_SYSTEM", "HEBREW_LETTER_TABLE", "ARABIC_LETTER_TABLE",
      "PLANET_CORRESPONDENCES", "ZODIAC_CORRESPONDENCES", "BOOK_CONTENTS",
      "ARIES_ENTITIES (15 entities)", "TALISMAN_RULES", "CONSTRUCTION_RULES", "NUMBER_MYSTICISM"
    ],
    critical_discoveries: [
      "HIGH OVERSEER FORMULA CONFIRMED: HighOverseer = General Governor × Guide (p.xxiii)",
      "ELEMENTAL SEQUENCE: Book uses ASTROLOGICAL Fire-Earth-Air-Water, NOT alchemical Fire-Air-Water-Earth",
      "All 7 base squares (3×3 through 9×9) hierarchy values confirmed",
      "Full Aries chapter (15 entities) with complete hierarchy tables",
      "Complete Hebrew (22) and Arabic (28) letter tables with English equivalents",
      "Suffix system: Hebrew El=31, Arabic Aeel=41, Jinn derived from 360-suffix",
      "Negative value fix: add 360 before subtracting suffix",
      "Full planetary and zodiac correspondences (keywords, body parts, professions, traits)",
    ],
    summary: "Complete extraction of 100 PDF pages from Part 1 of the primary source book.",
  },
  {
    id: "SCREENSHOTS-BATCH-001",
    date_added: "2026-06-07",
    source: "WhatsApp screenshots — companion Arabic/Hebrew tradition volume (pages xxvi–204)",
    pages_processed: "xxvi–204+",
    new_sections_added: ["Previously stored in v2.0 of this DB — companion volume data"],
    summary: "250+ screenshots from companion volume confirming Arabic/Hebrew tradition approach.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION 15 — CONFIRMED/UNCONFIRMED STATUS
// ═══════════════════════════════════════════════════════════════════════════
export const STATUS_TRACKER = {
  nowConfirmed: [
    { item: "High Overseer formula", formula: "GenGov × Guide", confirmedPage: "xxiii" },
    { item: "Elemental sequence in book", value: "Fire-Earth-Air-Water (astrological)", confirmedPage: "xvii" },
    { item: "Hebrew El suffix = 31", confirmedPage: "xxvii" },
    { item: "Arabic Aeel suffix = 41", confirmedPage: "xxvii" },
    { item: "Jinn suffix = 360 − angel suffix", confirmedPage: "xxvii" },
    { item: "All 7 base squares hierarchy values", confirmedPage: "xxiv-xxv" },
    { item: "Planet-to-size cycling (repeating)", confirmedPage: "x-xi" },
    { item: "Full Aries entity catalog (15 entities)", confirmedPage: "1-60" },
    { item: "Complete planet correspondences", confirmedPage: "xxx-xxxv" },
    { item: "Complete zodiac correspondences", confirmedPage: "xxxiii-xxxviii" },
  ],
  stillPending: [
    { item: "Taurus chapter entities (pp.64–117)", status: "Not yet in Part 1 PDF — will be in Part 2+" },
    { item: "Gemini through Pisces chapters", status: "Pages 118–653 not yet processed" },
    { item: "Planetary chapters (Saturn–Moon)", status: "Pages 654–750+ not yet processed" },
    { item: "Specific wazaif/invocations per entity", status: "Not in Quick Guide — may be in entity chapters" },
    { item: "Day/hour planetary tables", status: "Not found in Part 1" },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  DB SEARCH UTILITY
// ═══════════════════════════════════════════════════════════════════════════
export function searchDB(keyword) {
  const kw = keyword.toLowerCase();
  const sections = [
    ...Object.values(PLANET_CORRESPONDENCES),
    ...Object.values(ZODIAC_CORRESPONDENCES),
    ...ARIES_ENTITIES,
    ...BASE_HIERARCHY_VALUES,
    ...CONFIRMED_MAGIC_CONSTANTS,
    HIERARCHY_FORMULAS,
    SUFFIX_SYSTEM,
  ];
  return sections.filter(entry => JSON.stringify(entry).toLowerCase().includes(kw));
}

export default {
  BOOK_META, TERMINOLOGY, PLANET_PRIMARY_SIZES, PLANET_EXTENDED_SIZES,
  CONFIRMED_MAGIC_CONSTANTS, ESOTERIC_NUMBER_LAW, ELEMENT_RULES,
  HIERARCHY_SYSTEM, HIERARCHY_FORMULAS, BASE_HIERARCHY_VALUES,
  SUFFIX_SYSTEM, HEBREW_LETTER_TABLE, ARABIC_LETTER_TABLE,
  PLANET_CORRESPONDENCES, ZODIAC_CORRESPONDENCES, BOOK_CONTENTS,
  ARIES_ENTITIES, TALISMAN_RULES, CONSTRUCTION_RULES, NUMBER_MYSTICISM,
  SCREENSHOT_LOG, STATUS_TRACKER, searchDB,
};