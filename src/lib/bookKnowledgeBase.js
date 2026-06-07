// ═══════════════════════════════════════════════════════════════════════════
//  PERMANENT BOOK KNOWLEDGE DATABASE
//  Source: Occult Encyclopedia of Magic Squares (and related uploads)
//
//  RULES:
//  - Never delete entries. Only ADD new ones.
//  - Each entry tagged: { page, chapter, book, date_added, raw_text }
//  - Before answering any magic square question, search this DB first.
//  - Continuously expanded as new screenshots are uploaded.
// ═══════════════════════════════════════════════════════════════════════════

export const BOOK_META = {
  primary: "Occult Encyclopedia of Magic Squares",
  language: "Arabic / Persian (original)",
  translationTarget: ["English", "Arabic", "Malayalam"],
  lastUpdated: "2026-06-07",
  totalScreenshots: 0,
  totalEntries: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 1 — MAGIC SQUARE CONSTRUCTION RULES
// ─────────────────────────────────────────────────────────────────────────────
export const CONSTRUCTION_RULES = [
  {
    id: "CR-001",
    rule: "Size range is 3×3 through 16×16 (14 sizes total)",
    formula: null,
    page: null,
    chapter: "Magic Square Fundamentals",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
  {
    id: "CR-002",
    rule: "Odd-order squares use Siamese (de la Loubère) algorithm",
    formula: "Start center-top, move up-right, drop down on collision",
    page: null,
    chapter: "Magic Square Fundamentals",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
  {
    id: "CR-003",
    rule: "Doubly-even squares (n%4=0) use Diagonal Complement method",
    formula: "Fill sequentially, flip diagonal positions to n²+1−v",
    page: null,
    chapter: "Magic Square Fundamentals",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
  {
    id: "CR-004",
    rule: "Singly-even squares (n%2=0, n%4≠0) use Strachey method",
    formula: "Build 4 quadrants from odd base, then swap specific columns",
    page: null,
    chapter: "Magic Square Fundamentals",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
  {
    id: "CR-005",
    rule: "Usurper (minimum cell value A) formula",
    formula: "A = (MC − n(n²−1)/2) ÷ n",
    page: null,
    chapter: "Usurper Derivation",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
  {
    id: "CR-006",
    rule: "Triangular constant formula",
    formula: "T(n) = n(n²−1)/2",
    page: null,
    chapter: "Usurper Derivation",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
  {
    id: "CR-007",
    rule: "Compatibility check: MC must yield integer Usurper ≥ 1",
    formula: "(MC − T(n)) > 0 AND (MC − T(n)) % n === 0",
    page: null,
    chapter: "Compatibility",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
  {
    id: "CR-008",
    rule: "Affine shift maps standard 1..n² grid to Usurper..Usurper+n²−1",
    formula: "cell_value = standard_value − 1 + Usurper",
    page: null,
    chapter: "Affine Shift",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    raw_text: null,
    confirmed: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 2 — ELEMENTAL TRANSFORMATION RULES
// ─────────────────────────────────────────────────────────────────────────────
export const ELEMENT_RULES = [
  {
    id: "EL-001",
    element: "fire",
    arabic: "النار",
    malayalam: "അഗ്നി",
    english: "Fire",
    transform: "Original — no transformation applied",
    formula: "g[i][j] = base[i][j]",
    page: null,
    chapter: "Elemental Squares",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    confirmed: true,
  },
  {
    id: "EL-002",
    element: "air",
    arabic: "الهواء",
    malayalam: "വായു",
    english: "Air",
    transform: "Left-Right mirror",
    formula: "g[i][j] = base[i][n−1−j]",
    page: null,
    chapter: "Elemental Squares",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    confirmed: true,
  },
  {
    id: "EL-003",
    element: "earth",
    arabic: "التراب",
    malayalam: "ഭൂമി",
    english: "Earth",
    transform: "Top-Bottom mirror",
    formula: "g[i][j] = base[n−1−i][j]",
    page: null,
    chapter: "Elemental Squares",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    confirmed: true,
  },
  {
    id: "EL-004",
    element: "water",
    arabic: "الماء",
    malayalam: "ജലം",
    english: "Water",
    transform: "180° rotation (LR + TB combined)",
    formula: "g[i][j] = base[n−1−i][n−1−j]",
    page: null,
    chapter: "Elemental Squares",
    book: "Occult Encyclopedia of Magic Squares",
    date_added: "2026-06-07",
    source: "prior_session",
    confirmed: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 3 — PLANET CORRESPONDENCE RULES
// ─────────────────────────────────────────────────────────────────────────────
export const PLANET_RULES = [
  { id:"PL-001", size:3,  planet:"zuhal",   arabic:"الزحل",   english:"Saturn",  malayalam:"ശനി",     cycle:1, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-002", size:4,  planet:"mustari", arabic:"المشتري", english:"Jupiter", malayalam:"വ്യാഴം",  cycle:2, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-003", size:5,  planet:"merih",   arabic:"المريخ",  english:"Mars",    malayalam:"ചൊവ്വ",   cycle:3, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-004", size:6,  planet:"sems",    arabic:"الشمس",   english:"Sun",     malayalam:"സൂര്യൻ",  cycle:4, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-005", size:7,  planet:"zuhre",   arabic:"الزهرة",  english:"Venus",   malayalam:"ശുക്രൻ",  cycle:5, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-006", size:8,  planet:"utarid",  arabic:"العطارد", english:"Mercury", malayalam:"ബുധൻ",    cycle:6, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-007", size:9,  planet:"kamer",   arabic:"القمر",   english:"Moon",    malayalam:"ചന്ദ്രൻ", cycle:7, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-008", size:10, planet:"zuhal",   arabic:"الزحل",   english:"Saturn",  malayalam:"ശനി",     cycle:1, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-009", size:11, planet:"mustari", arabic:"المشتري", english:"Jupiter", malayalam:"വ്യാഴം",  cycle:2, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-010", size:12, planet:"merih",   arabic:"المريخ",  english:"Mars",    malayalam:"ചൊവ്വ",   cycle:3, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-011", size:13, planet:"sems",    arabic:"الشمس",   english:"Sun",     malayalam:"സൂര്യൻ",  cycle:4, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-012", size:14, planet:"zuhre",   arabic:"الزهرة",  english:"Venus",   malayalam:"ശുക്രൻ",  cycle:5, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-013", size:15, planet:"utarid",  arabic:"العطارد", english:"Mercury", malayalam:"ബുധൻ",    cycle:6, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"PL-014", size:16, planet:"kamer",   arabic:"القمر",   english:"Moon",    malayalam:"ചന്ദ്രൻ", cycle:7, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 4 — HIERARCHY RULES (8-tier system)
// ─────────────────────────────────────────────────────────────────────────────
export const HIERARCHY_RULES = [
  { id:"HR-001", tier:1, name:"usurper",   arabic:"المغتصب",      formula:"(MC − T(n)) ÷ n",            notes:"Minimum cell value", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HR-002", tier:2, name:"guide",     arabic:"الدليل",       formula:"Usurper + n² − 1",           notes:"Maximum cell value", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HR-003", tier:3, name:"mystery",   arabic:"الغموض",       formula:"Usurper + Guide",            notes:"Sum of min+max",     page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HR-004", tier:4, name:"adjuster",  arabic:"المعدل",       formula:"= MC",                       notes:"Magic constant itself", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HR-005", tier:5, name:"leader",    arabic:"القائد",       formula:"MC × n",                     notes:null, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HR-006", tier:6, name:"regulator", arabic:"المنظم",       formula:"MC × (n + 1)",               notes:null, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HR-007", tier:7, name:"genGov",    arabic:"الحاكم العام", formula:"MC × 2(n + 1)",              notes:null, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HR-008", tier:8, name:"highOver",  arabic:"المراقب الأعلى", formula:"(Leader × Regulator) ÷ n", notes:"⚠️ UNCONFIRMED — awaiting book screenshot", page:null, date_added:"2026-06-07", source:"assumed", confirmed:false },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 5 — SUFFIX RULES
// ─────────────────────────────────────────────────────────────────────────────
export const SUFFIX_RULES = [
  { id:"SF-001", mode:"none",   value:0,   formula:"MC = Raw",          page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"SF-002", mode:"arabic", value:-41, formula:"MC = Raw − 41",     page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"SF-003", mode:"hebrew", value:-31, formula:"MC = Raw − 31",     page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 6 — CORRECTION RULES
// ─────────────────────────────────────────────────────────────────────────────
export const CORRECTION_RULES = [
  { id:"CORR-001", rule:"Negative fix", formula:"If (Raw − suffix) ≤ 0 → add 360", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"CORR-002", rule:"Incompatibility fallback", formula:"If MC not compatible with n → show all compatible sizes", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"CORR-003", rule:"Minimum usurper guard", formula:"Usurper must be ≥ 1; if not → incompatible", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 7 — ANGEL / JINN RULES
// ─────────────────────────────────────────────────────────────────────────────
export const ANGEL_JINN_RULES = [
  { id:"AJ-001", type:"angel_arabic",  formula:"V − 41", applied_to:"All 8 hierarchy tier values", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AJ-002", type:"angel_hebrew",  formula:"V − 31", applied_to:"All 8 hierarchy tier values", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AJ-003", type:"jinn_arabic",   formula:"V + 41", applied_to:"All 8 hierarchy tier values", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AJ-004", type:"jinn_hebrew",   formula:"V + 31", applied_to:"All 8 hierarchy tier values", page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 8 — ARABIC ABJAD LETTER TABLE
// ─────────────────────────────────────────────────────────────────────────────
export const ARABIC_ABJAD_DB = [
  { id:"AA-001", letter:"ا", name:"Alef",  value:1,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-002", letter:"ب", name:"Ba",    value:2,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-003", letter:"ج", name:"Jeem",  value:3,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-004", letter:"د", name:"Dal",   value:4,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-005", letter:"ه", name:"Ha",    value:5,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-006", letter:"و", name:"Waw",   value:6,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-007", letter:"ز", name:"Zai",   value:7,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-008", letter:"ح", name:"Ha2",   value:8,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-009", letter:"ط", name:"Toa",   value:9,    page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-010", letter:"ي", name:"Ya",    value:10,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-011", letter:"ك", name:"Kaf",   value:20,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-012", letter:"ل", name:"Lam",   value:30,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-013", letter:"م", name:"Meem",  value:40,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-014", letter:"ن", name:"Nun",   value:50,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-015", letter:"س", name:"Seen",  value:60,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-016", letter:"ع", name:"Ayin",  value:70,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-017", letter:"ف", name:"Fa",    value:80,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-018", letter:"ص", name:"Sad",   value:90,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-019", letter:"ق", name:"Qaf",   value:100,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-020", letter:"ر", name:"Ra",    value:200,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-021", letter:"ش", name:"Sheen", value:300,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-022", letter:"ت", name:"Ta",    value:400,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-023", letter:"ث", name:"Tha",   value:500,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-024", letter:"خ", name:"Kha",   value:600,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-025", letter:"ذ", name:"Dhal",  value:700,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-026", letter:"ض", name:"Dad",   value:800,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-027", letter:"ظ", name:"Zhoa",  value:900,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"AA-028", letter:"غ", name:"Ghain", value:1000, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 9 — HEBREW GEMATRIA LETTER TABLE
// ─────────────────────────────────────────────────────────────────────────────
export const HEBREW_GEMATRIA_DB = [
  { id:"HG-001", letter:"א", name:"Aleph",  value:1,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-002", letter:"ב", name:"Beth",   value:2,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-003", letter:"ג", name:"Gimel",  value:3,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-004", letter:"ד", name:"Daleth", value:4,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-005", letter:"ה", name:"Heh",    value:5,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-006", letter:"ו", name:"Waw",    value:6,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-007", letter:"ז", name:"Zayin",  value:7,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-008", letter:"ח", name:"Heth",   value:8,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-009", letter:"ט", name:"Teth",   value:9,   page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-010", letter:"י", name:"Yod",    value:10,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-011", letter:"כ", name:"Kaf",    value:20,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-012", letter:"ל", name:"Lamed",  value:30,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-013", letter:"מ", name:"Mem",    value:40,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-014", letter:"נ", name:"Nun",    value:50,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-015", letter:"ס", name:"Samekh", value:60,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-016", letter:"ע", name:"Ayin",   value:70,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-017", letter:"פ", name:"Pe",     value:80,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-018", letter:"צ", name:"Tsadi",  value:90,  page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-019", letter:"ק", name:"Qof",    value:100, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-020", letter:"ר", name:"Resh",   value:200, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-021", letter:"ש", name:"Shin",   value:300, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
  { id:"HG-022", letter:"ת", name:"Tav",    value:400, page:null, date_added:"2026-06-07", source:"prior_session", confirmed:true },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 10 — SCREENSHOT LOG
//  Every uploaded screenshot is logged here permanently.
// ─────────────────────────────────────────────────────────────────────────────
export const SCREENSHOT_LOG = [
  // Format:
  // {
  //   id: "SS-001",
  //   date_added: "YYYY-MM-DD",
  //   page: null,       ← book page number if visible
  //   chapter: null,    ← chapter name/number if visible
  //   book: "...",
  //   ocr_text: "...",  ← full raw OCR text extracted
  //   new_rules: [],    ← IDs of rules added from this screenshot
  //   summary: "...",
  // }
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 11 — PENDING / UNCONFIRMED RULES (needs screenshot confirmation)
// ─────────────────────────────────────────────────────────────────────────────
export const UNCONFIRMED_RULES = [
  { id:"UC-001", topic:"High Overseer formula", assumed_formula:"(Leader × Regulator) ÷ n", needs:"Book page showing exact formula", date_added:"2026-06-07" },
  { id:"UC-002", topic:"Planet colors/icons",    assumed_formula:"App aesthetic only",       needs:"Book page showing planet symbols", date_added:"2026-06-07" },
  { id:"UC-003", topic:"Wazaif per planet",       assumed_formula:null,                       needs:"Book chapter on planetary invocations", date_added:"2026-06-07" },
  { id:"UC-004", topic:"Wazaif per element",      assumed_formula:null,                       needs:"Book chapter on elemental invocations", date_added:"2026-06-07" },
  { id:"UC-005", topic:"Day/hour correspondences",assumed_formula:null,                       needs:"Book table: planets × days × hours", date_added:"2026-06-07" },
  { id:"UC-006", topic:"Multi-grid combinations", assumed_formula:null,                       needs:"Book chapter on combining squares", date_added:"2026-06-07" },
  { id:"UC-007", topic:"Vefk purposes per planet",assumed_formula:null,                       needs:"Book chapter on vefk applications", date_added:"2026-06-07" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  DB SEARCH UTILITY
// ─────────────────────────────────────────────────────────────────────────────
export function searchDB(keyword) {
  const kw = keyword.toLowerCase();
  const all = [
    ...CONSTRUCTION_RULES,
    ...ELEMENT_RULES,
    ...PLANET_RULES,
    ...HIERARCHY_RULES,
    ...SUFFIX_RULES,
    ...CORRECTION_RULES,
    ...ANGEL_JINN_RULES,
  ];
  return all.filter(entry =>
    JSON.stringify(entry).toLowerCase().includes(kw)
  );
}

export default {
  BOOK_META,
  CONSTRUCTION_RULES,
  ELEMENT_RULES,
  PLANET_RULES,
  HIERARCHY_RULES,
  SUFFIX_RULES,
  CORRECTION_RULES,
  ANGEL_JINN_RULES,
  ARABIC_ABJAD_DB,
  HEBREW_GEMATRIA_DB,
  SCREENSHOT_LOG,
  UNCONFIRMED_RULES,
  searchDB,
};