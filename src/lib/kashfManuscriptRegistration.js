// ═══════════════════════════════════════════════════════════════
// KASHF AL-HAQA'IQ — MASTER REGISTRATION
// Registers all 3 new data files into the cross-manuscript search
// ═══════════════════════════════════════════════════════════════
import { registerManuscriptInstructions } from "./manuscriptRitualGuideLaw";
import { MANSIONS_LAYER1, MANSION_OPERATIONS_TABLE, ZODIAC_MANSION_TABLE } from "./kashfManuscriptData_Part1_Mansions";
import { TAHSEEN_LIST } from "./kashfManuscriptData_Part2_Tahseen";
import { SARF_FORMULAS, SARF_RETURN_FORMULAS, AZIMA_SHAJARA, AZIMA_IDRIS, SARF_AMMAR_INTRO } from "./kashfManuscriptData_Part3_SarfExorcism";

const SOURCE = "Kashf al-Haqa'iq";
const SOURCE_AR = "كشف الحقائق";

// Build instructions for mansions
const mansionInstructions = { _general: {} };
MANSIONS_LAYER1.forEach(m => {
  mansionInstructions[`mansion_${m.id}`] = {
    title_ml: [{ text: `المنزلة ${m.number}: ${m.name_ar}`, page: m.page }],
    purpose: [{ text: m.purpose_ml || `Lunar Mansion ${m.name_en}`, page: m.page }],
    suitable_lunar_mansion: [{ text: m.name_ar, page: m.page }],
    suitable_operations: m.suitable ? [{ text: m.suitable, page: m.page }] : [],
    warnings: m.forbidden ? [{ text: m.forbidden, page: m.page }] : [],
    expected_result: m.marriage_rule ? [{ text: `Marriage: ${m.marriage_rule}`, page: m.page }] : [],
    timing: m.best_saat ? [{ text: `Best Saat: ${m.best_saat}`, page: m.page }] : [],
  };
});

// Build instructions for tahseen
const tahseenInstructions = { _general: {} };
TAHSEEN_LIST.forEach(t => {
  tahseenInstructions[`tahseen_${t.id}`] = {
    title_ml: [{ text: t.title_ar, page: t.page }],
    purpose: [{ text: t.purpose_en, page: t.page }],
    required_purification: t.timing ? [{ text: t.timing, page: t.page }] : [],
    repetition_count: t.repetition ? [{ text: t.repetition, page: t.page }] : [],
    expected_result: [{ text: t.purpose_en, page: t.page }],
    additional_notes: t.source_scholar ? [{ text: `By: ${t.source_scholar}`, page: t.page }] : [],
  };
});

// Build instructions for sarf + exorcisms
const sarfInstructions = { _general: {} };
SARF_FORMULAS.forEach(s => {
  sarfInstructions[s.id] = {
    title_ml: [{ text: s.title_ar, page: s.page }],
    purpose: [{ text: s.purpose_en, page: s.page }],
    required_incense: [{ text: "لبان (Frankincense/Luban) — burn before reciting", page: 153 }],
    repetition_count: s.repetition ? [{ text: s.repetition, page: s.page }] : [],
    before_recitation_steps: [
      { text: "Burn frankincense (luban) first", page: 153 },
      { text: "Stand facing the space you want to clear", page: 153 }
    ],
    expected_result: [{ text: s.purpose_en, page: s.page }],
    warnings: [{ text: "Must be done before ALL spiritual work. Skipping causes complete failure.", page: 153 }]
  };
});

sarfInstructions["azima_shajara"] = {
  title_ml: [{ text: AZIMA_SHAJARA.title_ar, page: AZIMA_SHAJARA.page }],
  purpose: [{ text: AZIMA_SHAJARA.purpose_en, page: AZIMA_SHAJARA.page }],
  how_to_use: AZIMA_SHAJARA.how_to_use.map((h, i) => ({ text: h, page: AZIMA_SHAJARA.page })),
  expected_result: [{ text: "First reading: abolishes magic. Second: burns jinn. Third: kills them.", page: AZIMA_SHAJARA.page }]
};

sarfInstructions["azima_idris"] = {
  title_ml: [{ text: AZIMA_IDRIS.title_ar, page: AZIMA_IDRIS.page }],
  purpose: [{ text: AZIMA_IDRIS.purpose_en, page: AZIMA_IDRIS.page }],
  expected_result: [{ text: "1st reading: abolishes magic. 2nd: burns jinn. 3rd: kills them.", page: AZIMA_IDRIS.page }]
};

// Register all three in the cross-manuscript search registry
registerManuscriptInstructions("kashf_mansions", SOURCE, mansionInstructions);
registerManuscriptInstructions("kashf_tahseen", SOURCE, tahseenInstructions);
registerManuscriptInstructions("kashf_sarf_exorcism", SOURCE, sarfInstructions);

export const KASHF_TOTAL_ENTRIES = {
  mansions: MANSIONS_LAYER1.length,
  tahseen: TAHSEEN_LIST.length,
  sarf_formulas: SARF_FORMULAS.length,
  exorcisms: 2,
  operations_table: MANSION_OPERATIONS_TABLE.purpose_to_mansion.length,
  total: MANSIONS_LAYER1.length + TAHSEEN_LIST.length + SARF_FORMULAS.length + 2
};

export { MANSIONS_LAYER1, MANSION_OPERATIONS_TABLE, ZODIAC_MANSION_TABLE, TAHSEEN_LIST, SARF_FORMULAS, AZIMA_SHAJARA, AZIMA_IDRIS, SARF_AMMAR_INTRO };
export { SARF_RETURN_FORMULAS } from "./kashfManuscriptData_Part3_SarfExorcism";