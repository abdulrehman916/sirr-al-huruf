// ═══════════════════════════════════════════════════════════════
// PLANTS & INGREDIENTS DICTIONARY — STANDALONE DATA
// Schema: ArabicName, EnglishName, MalayalamName, ScientificName,
//         DescriptionEnglish, DescriptionMalayalam,
//         UsesEnglish, UsesMalayalam, PageReference, SourcePage
// Completely isolated. Zero imports from any engine or lib file.
// ═══════════════════════════════════════════════════════════════

export const PLANT_CATEGORIES = [
  { id: 'all',    label: 'All',     arabic: 'الكل',     ml: 'എല്ലാം' },
  { id: 'herb',   label: 'Herbs',   arabic: 'الأعشاب',  ml: 'ഔഷധസസ്യം' },
  { id: 'spice',  label: 'Spices',  arabic: 'التوابل',  ml: 'സുഗന്ധദ്രവ്യം' },
  { id: 'resin',  label: 'Resins',  arabic: 'الصمغ',    ml: 'റെസിൻ' },
  { id: 'root',   label: 'Roots',   arabic: 'الجذور',   ml: 'വേര്' },
  { id: 'flower', label: 'Flowers', arabic: 'الأزهار',  ml: 'പൂക്കൾ' },
  { id: 'fruit',  label: 'Fruits',  arabic: 'الفواكه',  ml: 'ഫലം' },
  { id: 'seed',   label: 'Seeds',   arabic: 'البذور',   ml: 'വിത്ത്' },
  { id: 'oil',    label: 'Oils',    arabic: 'الزيوت',   ml: 'എണ്ണ' },
  { id: 'wood',   label: 'Woods',   arabic: 'الأخشاب',  ml: 'മരം' },
  { id: 'other',  label: 'Other',   arabic: 'أخرى',     ml: 'മറ്റുള്ളവ' },
];

// ── Entries will be added incrementally as source pages are provided ──
export const PLANTS_DATA = [
  // ── PLACEHOLDER — awaiting source pages from user ──
  // Each entry follows this schema:
  // {
  //   id:                   number,
  //   category:             string (from PLANT_CATEGORIES ids),
  //   ArabicName:           string,
  //   EnglishName:          string,
  //   MalayalamName:        string,
  //   ScientificName:       string,
  //   DescriptionEnglish:   string,
  //   DescriptionMalayalam: string,
  //   UsesEnglish:          string,
  //   UsesMalayalam:        string,
  //   PageReference:        string,
  //   SourcePage:           string | number,
  // }
];