// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT RITUAL GUIDE DATA — KASHF AL-HAQA'IQ REGISTRATION
// ═══════════════════════════════════════════════════════════════
// Builds comprehensive instruction entries for all 37 recitations
// from Kashf al-Haqa'iq and registers them in the law module.
//
// FUTURE MANUSCRIPTS: Create a new data module, import
// registerManuscriptInstructions from manuscriptRitualGuideLaw,
// build instruction entries, and call registerManuscriptInstructions.
// The cross-manuscript search automatically includes the new source.
// No changes to this file or existing code needed.
// ═══════════════════════════════════════════════════════════════
import { registerManuscriptInstructions } from "./manuscriptRitualGuideLaw";
import {
  KASHF_AZAYIM_BY_DAY,
  KASHF_AQSAM_BY_DAY,
  KASHF_UNIVERSAL_SUPPLICATIONS,
  KASHF_ISTIKHARA_DUAS,
  KASHF_QURAN_RECITATIONS,
  KASHF_OPENING_SECRETS_DUAS,
  KASHF_TANZIL_DUAS,
  KASHF_DIVINE_NAMES,
  KASHF_TAWKEEL,
  WEEKDAY_PLANET_META,
  MANUSCRIPT_PERFORMANCE_RULES,
  RECITATION_RELATIONSHIPS,
  QURAN_VERIFICATION_NOTES,
} from "./astroClockDailyMantrasData";

const SOURCE = "Kashf al-Haqa'iq";
const rules = MANUSCRIPT_PERFORMANCE_RULES;

// Build a comprehensive instruction entry from verified manuscript data.
// Only uses data actually present in the manuscripts — never invents.
function buildEntry(mantra) {
  const entry = {};
  const page = mantra.source?.page;
  const weekdayMeta = mantra.day_index !== null && mantra.day_index !== undefined
    ? WEEKDAY_PLANET_META.find(d => d.day_index === mantra.day_index)
    : null;

  // Purpose
  if (mantra.purpose_ml) {
    entry.purpose = [{ text: mantra.purpose_ml, page }];
  }

  // Suitable weekday + planet + angel (from weekday metadata, pp.27-31)
  if (weekdayMeta) {
    entry.suitable_weekday = [{ text: `${weekdayMeta.day_ml} (${weekdayMeta.day_en})`, page }];
    entry.suitable_planet = [{ text: `${weekdayMeta.planet_ml} (${weekdayMeta.planet_en})`, page }];
    entry.required_angel = [{ text: `${weekdayMeta.angel_en} (${weekdayMeta.angel_ml})`, page }];
  }

  // Required Jinn (king for Azimah, servant for Qasam)
  if (mantra.king_en) {
    entry.required_jinn = [{ text: `${mantra.king_en} (${mantra.king})`, page }];
  } else if (mantra.servant_en) {
    entry.required_jinn = [{ text: `${mantra.servant_en} (${mantra.servant})`, page }];
  }

  // Repetition count
  if (mantra.repetition) {
    entry.repetition_count = [{ text: `${mantra.repetition} തവണ`, page }];
  }

  // General performance rules (apply to all recitations, from Kashf pp.11,20,39,42,65)
  entry.suitable_saat = [{ text: rules.timing.rule_ml, page: 11 }];
  entry.suitable_moon_phase = [{ text: rules.moon.rule_ml, page: 20 }];
  entry.required_direction = [{ text: rules.direction.default_ml, page: 42 }];
  entry.during_recitation_rules = [{ text: rules.night_preference.rule_ml, page: 39 }];
  entry.warnings = [{ text: rules.night_preference.rule_ml, page: 39 }];
  entry.additional_notes = [{ text: rules.day_boundary.rule_ml, page: 65 }];

  // Type-specific before/after rules (from manuscript structure pp.27-31)
  if (mantra.type === "azimah") {
    entry.before_recitation_steps = [{ text: "ആഹ്വാനം (അസീം) ചൊല്ലുക, ശേഷം ഖസം ചൊല്ലുക", page: "27-31" }];
    entry.after_recitation_rules = [{ text: "സർവ ദു‌ആ ചൊല്ലുക", page: 31 }];
    entry.azimah = [{ text: "ആഹ്വാന പാഠം മുകളിൽ കാണാം", page }];
  } else if (mantra.type === "qasam") {
    entry.before_recitation_steps = [{ text: "ഖസം ചൊല്ലുക (അസീമ-ന് ശേഷം)", page: "27-31" }];
    entry.after_recitation_rules = [{ text: "സർവ ദു‌ആ ചൊല്ലുക", page: 31 }];
    entry.qasam = [{ text: "ശപഥ പാഠം മുകളിൽ കാണാം", page }];
  }

  // Related rituals (from RECITATION_RELATIONSHIPS)
  const relatedIds = RECITATION_RELATIONSHIPS[mantra.id] || [];
  if (relatedIds.length > 0) {
    entry.related_rituals = relatedIds.map(id => ({ text: id, page }));
  }

  // Quran verses (for quran_recitation type)
  if (mantra.type === "quran_recitation") {
    const note = QURAN_VERIFICATION_NOTES[mantra.id];
    if (note) {
      entry.quran_verses = [{ text: note.quran_ref, page }];
    }
  }

  // Specific recitation details (from manuscript)
  if (mantra.id === "kashf_istikhara") {
    entry.conditions = [{ text: "كذا وكذا-ൽ ആവശ്യം പ്രസ്താവിക്കുക", page: 43 }];
    entry.before_recitation_steps = [{ text: "എല്ലാ ആത്മ കൃത്യങ്ങൾക്ക് മുമ്പ് ചൊല്ലുക", page: 43 }];
  }

  if (mantra.id === "kashf_opening_secrets") {
    entry.salawat = [{ text: "സലാവത്ത് ഉൾപ്പെടുന്നു", page: 47 }];
    entry.required_divine_names = [{ text: "യാ ഹയ്യ് യാ ഖയ്യൂം", page: 47 }];
  }

  if (mantra.id === "kashf_ism_alim") {
    entry.ism = [{ text: "യാ അലീം", page: 47 }];
  }

  if (mantra.id === "kashf_istighfar") {
    entry.before_recitation_steps = [{ text: "തൻസീലിന് മുമ്പ് ചൊല്ലുക", page: 51 }];
  }

  if (mantra.id === "kashf_tanzil_dua") {
    entry.before_recitation_steps = [{ text: "ഇസ്തിഗ്ഫാർ ചൊല്ലിയ ശേഷം ചൊല്ലുക", page: 51 }];
  }

  if (mantra.id === "kashf_tawkeel_love") {
    entry.tawkeel = [{ text: "തവ്കീൽ പാഠം മുകളിൽ കാണാം", page: 52 }];
    entry.conditions = [{ text: "فلان بن فلانة-ൽ ലക്ഷ്യസ്ഥാനയുടെ പേരും അമ്മയുടെ പേരും നൽകുക", page: 52 }];
  }

  if (mantra.id === "kashf_supplication_post_qasam") {
    entry.quran_verses = [{ text: "Quran 31:27", page: 31 }];
    entry.after_recitation_rules = [{ text: "എല്ലാ ആത്മ കൃത്യങ്ങൾ ചെയ്ത ശേഷം ചൊല്ലുക", page: 31 }];
  }

  if (mantra.id === "kashf_supplication_ilahi") {
    entry.before_recitation_steps = [{ text: "ആത്മ കൃത്യങ്ങൾക്കും ത്വിലസ്മ പ്രവർത്തനത്തിനും മുമ്പ്", page: 37 }];
  }

  return entry;
}

// Build instruction entries for all 37 recitations
const allRecitations = [
  ...KASHF_AZAYIM_BY_DAY,
  ...KASHF_AQSAM_BY_DAY,
  ...KASHF_UNIVERSAL_SUPPLICATIONS,
  ...KASHF_ISTIKHARA_DUAS,
  ...KASHF_QURAN_RECITATIONS,
  ...KASHF_OPENING_SECRETS_DUAS,
  ...KASHF_TANZIL_DUAS,
  ...KASHF_DIVINE_NAMES,
  ...KASHF_TAWKEEL,
];

const instructions = {};
for (const mantra of allRecitations) {
  instructions[mantra.id] = buildEntry(mantra);
}

// Register in the law module — search now includes Kashf al-Haqa'iq
registerManuscriptInstructions("kashf_alhaqa_iq", SOURCE, instructions);

// Re-export search functions for convenience
export {
  getMergedRitualInstructions,
  getFieldInstructions,
  isFieldSpecified,
  getRegisteredSources,
  RITUAL_INSTRUCTION_FIELDS,
  MANUSCRIPT_RITUAL_GUIDE_LAW,
} from "./manuscriptRitualGuideLaw";