// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK — DAILY MANTRAS & SPIRITUAL RECITATIONS DATA MODULE
// ═══════════════════════════════════════════════════════════════
//
// SECTION 2 — DAILY MANTRAS & SPIRITUAL RECITATIONS
//
// LAW COMPLIANCE:
//   - Manuscript Integration Law: additive only, grouped by source
//   - Manuscript Preservation Law: never delete/overwrite
//   - Language System Law: ML/EN/TR only, Arabic preserved
//   - Location & Time Law: day index from live useAstroData()
//   - Live Astronomy Law: no hardcoded day assumptions
//
// DATA SOURCE RULE:
//   This module scans ALL integrated manuscript sources for daily
//   mantras, adhkar, invocations, wazifas, and spiritual recitations
//   that are specifically recommended for the current day.
//
//   If found → integrate them (grouped by source).
//   If not found → return empty array. DO NOT INVENT anything.
//
// SCAN RESULT (as of 2026-07-08):
//   Scanned: Havâss'ın Derinlikleri, Taha, Kashf al-Haqa'iq
//   Found: NO daily mantras or recitations in any manuscript
//   The manuscripts contain timing rules, planetary attributes,
//   and operational guidance — but NO specific daily recitations.
//
//   Therefore getDailyMantrasForDay() returns [] (empty).
//   The UI shows the empty state message.
//
// FUTURE PDFs:
//   When a future PDF contains daily mantras, add a new export
//   array to its data file (e.g., KASHF_DAILY_MANTRAS) and add a
//   scan entry here. The section auto-merges — no UI redesign needed.
// ═══════════════════════════════════════════════════════════════

// ── MANUSCRIPT SOURCES SCANNED ──
// Each entry documents which manuscript was checked and what was found.
// This is the transparency layer — users/admins can see exactly what
// was scanned and why the section may be empty.
export const DAILY_MANTRA_SCAN_REPORT = {
  scan_date: "2026-07-08",
  manuscripts_scanned: [
    {
      source_id: "havass_derinlikleri",
      book_name: "Havâss'ın Derinlikleri",
      author: "Bülent Kısa",
      pages_scanned: "1-100",
      daily_mantras_found: false,
      note: "Contains planetary day rulers, suitable operations, and timing rules. No daily mantras, adhkar, or recitations.",
    },
    {
      source_id: "taha_judicial_astrology",
      book_name: "تدریس نجوم احکامی (Teaching Judicial Astrology)",
      author: "استاد طاها (Ustad Taha)",
      pages_scanned: "1-80",
      daily_mantras_found: false,
      note: "Contains zodiac, planet, aspect, and house significations. No daily mantras, adhkar, or recitations.",
    },
    {
      source_id: "kashf_alhaqa_iq",
      book_name: "كشف الحقائق (Kashf al-Haqa'iq)",
      author: "Anonymous Omani scholar",
      pages_scanned: "1-90",
      daily_mantras_found: false,
      note: "Contains operation timing tables, hour assignments, and astrological principles. No daily mantras, adhkar, or recitations.",
    },
  ],
  total_mantras_found: 0,
  conclusion: "No daily mantra or spiritual recitation exists in the currently integrated manuscripts.",
};

// ── DAILY MANTRA ENTRY SCHEMA ──
// This defines the structure every mantra entry must follow.
// Future PDFs that contain mantras must conform to this schema.
// All fields are optional except: id, source, recommended_day, purpose
export const DAILY_MANTRA_SCHEMA = {
  id: "string — unique identifier e.g. kashf_mantra_001",
  source: {
    book: "string — book name (Arabic or original)",
    book_en: "string — English book name",
    book_ml: "string — Malayalam book name",
    page: "number — exact page number",
    scholar: "string — scholar name (if attributed)",
  },
  arabic_text: "string — original Arabic text (NEVER translated or modified)",
  malayalam_translation: "string — Malayalam translation",
  english_translation: "string — English translation",
  turkish_translation: "string — Turkish translation (internal reference)",
  purpose_ml: "string — purpose in Malayalam",
  purpose_en: "string — purpose in English",
  purpose_tr: "string — purpose in Turkish",
  benefits_ml: "string — benefits in Malayalam",
  benefits_en: "string — benefits in English",
  benefits_tr: "string — benefits in Turkish",
  recommended_day: "number — 0=Sunday ... 6=Saturday (or null for any day)",
  recommended_time: "string — time of day (if specified, null otherwise)",
  recommended_saat: "number — Saat number 1-12 (if specified, null otherwise)",
  recommended_saat_period: "string — 'day' or 'night' (if specified)",
  recommended_moon_condition: "string — Moon condition (if specified, null otherwise)",
  repetition_count: "number — repetition count (if specified, null otherwise)",
  preparation_ml: "string — preparation requirements in Malayalam (if specified)",
  preparation_en: "string — preparation requirements in English (if specified)",
  preparation_tr: "string — preparation requirements in Turkish (if specified)",
  warnings_ml: "string — warnings or restrictions in Malayalam (if specified)",
  warnings_en: "string — warnings or restrictions in English (if specified)",
  warnings_tr: "string — warnings or restrictions in Turkish (if specified)",
};

// ── DAILY MANTRAS BY SOURCE ──
// Currently empty — no manuscripts contain daily mantras.
// Future PDFs add their mantra arrays here as new entries.
// Example for future integration:
//   { source_id: "future_pdf", mantras: [...] }
export const DAILY_MANTRAS_BY_SOURCE = [
  // ── Havâss'ın Derinlikleri — NO daily mantras found ──
  // Scanned: pp.1-100. Contains timing rules only.
  {
    source_id: "havass_derinlikleri",
    source: {
      book: "Havâss'ın Derinlikleri",
      book_en: "Havâss'ın Derinlikleri",
      book_ml: "ഹാവാസ്സ് ദേരിൻലിക്ലേരി",
      scholar: "Bülent Kısa",
    },
    mantras: [], // EMPTY — no daily mantras in this manuscript
  },
  // ── Taha Judicial Astrology — NO daily mantras found ──
  // Scanned: pp.1-80. Contains zodiac/planet/house data only.
  {
    source_id: "taha_judicial_astrology",
    source: {
      book: "تدریس نجوم احکامی",
      book_en: "Teaching Judicial Astrology",
      book_ml: "താഹ ന്യായാത്മക ജ്യോതിഷം",
      scholar: "استاد طاها (Ustad Taha)",
    },
    mantras: [], // EMPTY — no daily mantras in this manuscript
  },
  // ── Kashf al-Haqa'iq — NO daily mantras found ──
  // Scanned: pp.1-90. Contains operation timing tables only.
  {
    source_id: "kashf_alhaqa_iq",
    source: {
      book: "كشف الحقائق",
      book_en: "Kashf al-Haqa'iq",
      book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്",
      scholar: "Anonymous Omani scholar",
    },
    mantras: [], // EMPTY — no daily mantras in this manuscript
  },
  // ── Future PDFs will be appended here as new source entries ──
];

// ═══════════════════════════════════════════════════════════════
// GET DAILY MANTRAS FOR A SPECIFIC DAY
// ═══════════════════════════════════════════════════════════════
//
// Returns mantras recommended for the given day, grouped by source.
// Day index: 0=Sunday, 1=Monday, ..., 6=Saturday
//
// A mantra is included if:
//   - recommended_day === dayIndex, OR
//   - recommended_day === null (applies to any day)
//
// Returns: array of { source, mantras: [...] }
// If no mantras exist for this day, returns [] (empty).
// ═══════════════════════════════════════════════════════════════
export function getDailyMantrasForDay(dayIndex) {
  const results = [];
  for (const sourceEntry of DAILY_MANTRAS_BY_SOURCE) {
    const matchingMantras = sourceEntry.mantras.filter(m => {
      if (m.recommended_day === null || m.recommended_day === undefined) return true; // Any day
      return m.recommended_day === dayIndex;
    });
    if (matchingMantras.length > 0) {
      results.push({
        source: sourceEntry.source,
        mantras: matchingMantras,
      });
    }
  }
  return results;
}

// ═══════════════════════════════════════════════════════════════
// GET ALL DAILY MANTRAS (regardless of day)
// Used for the scan report / admin view
// ═══════════════════════════════════════════════════════════════
export function getAllDailyMantras() {
  return DAILY_MANTRAS_BY_SOURCE;
}

// ═══════════════════════════════════════════════════════════════
// GET TOTAL MANTRA COUNT
// ═══════════════════════════════════════════════════════════════
export function getTotalMantraCount() {
  return DAILY_MANTRAS_BY_SOURCE.reduce((sum, s) => sum + s.mantras.length, 0);
}

// ═══════════════════════════════════════════════════════════════
// CHECK IF ANY MANTRAS EXIST
// Quick check for the UI to decide empty-state vs content
// ═══════════════════════════════════════════════════════════════
export function hasAnyDailyMantras() {
  return getTotalMantraCount() > 0;
}