// ═══════════════════════════════════════════════════════════════
// RITUAL TIMING ENGINE V3 — MANUSCRIPT-DRIVEN, READ-ONLY
// ═══════════════════════════════════════════════════════════════
// SOURCE PRIORITY (strict, no invention):
//   1. ManuscriptRule database (passed in via manuscriptRules param)
//   2. Existing JS knowledge base (astroClockActionTimingAdvisor ACTION_RULES)
//   3. Astro Clock live calculations (read-only)
//
// This engine NEVER invents rules. Every recommendation cites the
// manuscript rule that produced it. If no rule is found for a
// dimension (day, hour, moon, zodiac, planet, direction, incense,
// element, night/day), that dimension is reported as unrestricted.
//
// Reads existing Mizan state + live Astro Clock. Does NOT modify
// any Mizan calculation, Method 1–4, or Astro Clock logic.
// ═══════════════════════════════════════════════════════════════

import { getCurrentPlanetaryHour, getDayRuler, getActiveWeekday, PLANET_SEQUENCE, PLANET_INFO, getAllPlanetaryHours } from "./astroClockLiveEngine.js";
import { calculateSunriseSunset, getUserLocation } from "./astroClockSunriseSunset.js";
import { calculateMoonPosition } from "./astroClockMoonPosition.js";
import { AY_MANAZILLERI } from "./astroClockData.js";

// ── Moon Mansion & Zodiac lists (for Plan-by-Moon dropdowns) ──
export const MOON_MANSIONS = (AY_MANAZILLERI || []).map(m => ({
  no: m.no, name: m.name, harfi: m.harfi,
}));
export const ZODIAC_SIGNS = [
  { name_en: "Aries", name_ml: "മേഷം", symbol: "♈" },
  { name_en: "Taurus", name_ml: "ഇടവം", symbol: "♉" },
  { name_en: "Gemini", name_ml: "മിഥുനം", symbol: "♊" },
  { name_en: "Cancer", name_ml: "കർക്കിടകം", symbol: "♋" },
  { name_en: "Leo", name_ml: "ചിങ്ങം", symbol: "♌" },
  { name_en: "Virgo", name_ml: "കന്നി", symbol: "♍" },
  { name_en: "Libra", name_ml: "തുലാം", symbol: "♎" },
  { name_en: "Scorpio", name_ml: "വൃശ്ചികം", symbol: "♏" },
  { name_en: "Sagittarius", name_ml: "ധനു", symbol: "♐" },
  { name_en: "Capricorn", name_ml: "മകരം", symbol: "♑" },
  { name_en: "Aquarius", name_ml: "കുംഭം", symbol: "♒" },
  { name_en: "Pisces", name_ml: "മീനം", symbol: "♓" },
];

// ── Maps ──
const MIZAN_TO_EN_PLANET = {
  zuhal: "Saturn", mustari: "Jupiter", merih: "Mars", sems: "Sun",
  zuhre: "Venus", utarid: "Mercury", kamer: "Moon",
};
const MIZAN_DAY_TO_INDEX = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const MIZAN_DAY_NAMES = {
  sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday",
  thu: "Thursday", fri: "Friday", sat: "Saturday",
};
const DAY_KEY_BY_INDEX = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const BENEFIC = ["Sun", "Jupiter", "Venus", "Moon"];
const MALEFIC = ["Saturn", "Mars"];

// ManuscriptRule.category → ritualKey
const CATEGORY_TO_RITUAL = {
  LOVE_WORKS: "love",
  PROTECTION_WORKS: "protection",
  WEALTH_WORKS: "wealth",
  TRAVEL_WORKS: "travel",
  SPIRITUAL_WORKS: "spiritual",
  TIMING_RULES: "general",
  PLANETARY_HOURS: "general",
  DAY_RULERS: "general",
  SAAD_NAHS: "general",
  INCENSE_RULES: "general",
  ELEMENT_RULES: "general",
  ZODIAC: "general",
  LUNAR_MANSIONS: "general",
};

// ═══════════════════════════════════════════════════════════════
// STEP 1 — Identify the ritual from user's Mizan selections + custom purpose
// Priority: Purpose Dictionary (confirmed) → Mizan purpose keys.
// NO keyword fallback. NO heuristic inference. NO ManuscriptRule category guess.
// Pipeline: Dictionary → AI → User Confirmation → Save → Reuse.
// Until a confirmed dictionary entry exists, no ritual category is assigned.
// ═══════════════════════════════════════════════════════════════
function identifyRitual({ selections, customPurpose, manuscriptRules, purposeLookup }) {
  const purposes = selections?.purposes || [];
  const custom = (customPurpose || "").trim();

  // Mizan purpose keys → ritual category
  const mizanPurposeMap = {
    celb: "love", tard: "separation", sihhat: "healing", sekam: "enemy",
    tarfet: "protection", rizq: "wealth", knowledge: "knowledge",
    travel: "travel", sultan: "planetary", haybah: "planetary",
  };

  // ── PRIORITY 1: Purpose Dictionary (authoritative) ──
  // If the dictionary matched, use the normalized_purpose_key to map to
  // the ritual category. Never guess, never use literal translation.
  // The dictionary stores the semantic meaning used for display.
  if (purposeLookup?.matched && purposeLookup.ritualIntent) {
    const ritualKey = mizanPurposeMap[purposeLookup.ritualIntent];
    if (ritualKey) {
      return {
        ritualKey,
        matchedOn: `Purpose Dictionary: "${purposeLookup.matchedPhrase}" → ${purposeLookup.ritualIntent}`,
        semanticMeaningEn: purposeLookup.english_meaning || "",
        semanticMeaningMl: purposeLookup.malayalam_meaning || "",
        resolvedPhraseEn: purposeLookup.interpretation_en || "",
        resolvedPhraseMl: purposeLookup.interpretation_ml || "",
        dictionarySource: purposeLookup.source || null,
      };
    }
  }

  // No purpose selected and no custom purpose → do NOT assume any category
  if (purposes.length === 0 && !custom) {
    return { ritualKey: null, matchedOn: "no purpose selected" };
  }

  // ── PRIORITY 2: Mizan purpose keys (from selections.purposes) ──
  for (const p of purposes) {
    if (mizanPurposeMap[p]) return { ritualKey: mizanPurposeMap[p], matchedOn: `Mizan purpose "${p}"` };
  }

  // ── NO KEYWORD FALLBACK ──
  // If the Purpose Dictionary did not match and no Mizan purpose key was
  // selected, the ritual purpose is UNIDENTIFIED. Never infer from
  // hardcoded keywords, never guess from ManuscriptRule categories.
  // Pipeline: Dictionary → AI → User Confirmation → Save → Reuse.
  // Until a confirmed dictionary entry exists, no ritual category is assigned.
  return {
    ritualKey: null,
    matchedOn: "no confirmed dictionary match — purpose identification requires confirmed entry",
    semanticMeaningEn: "",
    semanticMeaningMl: "",
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 2 — Gather rules: ManuscriptRule DB only. No JS fallback. Never invent.
// ═══════════════════════════════════════════════════════════════
function gatherRules(ritualKey, manuscriptRules, purposeSelected) {
  const dbRules = (manuscriptRules || []).filter((r) => {
    const cat = CATEGORY_TO_RITUAL[r.category];
    return cat === ritualKey || (cat === "general" && r.subcategory && r.subcategory.toLowerCase().includes(ritualKey));
  });

  // Build requirements from DB rules — Moon fields separated into moonReq.
  // Main timing (Day + Saat + Kawkab) uses req. Moon analysis (optional,
  // user-initiated) uses moonReq — never affects the main timing decision.
  const req = {
    days: null,           // array of day keys e.g. ['fri','thu']
    hours: null,          // array of planet names
    worstDays: null,
    worstHours: null,
    planet: null,         // array of planets
    direction: null,
    incense: null,
    element: null,
    nightRequired: null,  // bool
    enemyPlanets: [],
  };
  const moonReq = {
    moon: null,           // 'waxing' | 'waning' | 'full' | 'new' | null
    zodiac: null,         // array of signs
    suitableMansions: null,
  };
  const citations = [];
  const moonCitations = [];

  // ── DB rules ──
  for (const r of dbRules) {
    let dj = null;
    try { dj = r.data_json ? JSON.parse(r.data_json) : null; } catch (_) { dj = null; }
    const cite = { rule_id: r.rule_id, source: `${r.book_name || "ManuscriptRule"}${r.page_number ? ` p.${r.page_number}` : ""}`, summary: r.rule_summary, category: r.category };

    if (dj) {
      if (Array.isArray(dj.bestDays) && dj.bestDays.length) { req.days = dj.bestDays.map((d) => String(d).toLowerCase()); citations.push({ ...cite, field: "day", value: req.days.join(", ") }); }
      if (Array.isArray(dj.bestHours) && dj.bestHours.length) { req.hours = dj.bestHours.map((h) => capitalPlanet(h)); citations.push({ ...cite, field: "hour", value: req.hours.join(", ") }); }
      if (Array.isArray(dj.worstDays) && dj.worstDays.length) req.worstDays = dj.worstDays.map((d) => String(d).toLowerCase());
      if (Array.isArray(dj.worstHours) && dj.worstHours.length) req.worstHours = dj.worstHours.map((h) => capitalPlanet(h));
      if (dj.moon) { moonReq.moon = String(dj.moon).toLowerCase(); moonCitations.push({ ...cite, field: "moon", value: moonReq.moon }); }
      if (Array.isArray(dj.zodiac) && dj.zodiac.length) { moonReq.zodiac = dj.zodiac.map((z) => String(z).toLowerCase()); moonCitations.push({ ...cite, field: "zodiac", value: moonReq.zodiac.join(", ") }); }
      if (Array.isArray(dj.planet) && dj.planet.length) { req.planet = dj.planet.map((p) => capitalPlanet(p)); citations.push({ ...cite, field: "planet", value: req.planet.join(", ") }); }
      if (dj.direction) { req.direction = dj.direction; citations.push({ ...cite, field: "direction", value: dj.direction }); }
      if (dj.incense) { req.incense = dj.incense; citations.push({ ...cite, field: "incense", value: dj.incense }); }
      if (dj.element) { req.element = String(dj.element).toLowerCase(); citations.push({ ...cite, field: "element", value: dj.element }); }
      if (typeof dj.nightRequired === "boolean") { req.nightRequired = dj.nightRequired; citations.push({ ...cite, field: "night", value: String(dj.nightRequired) }); }
      if (Array.isArray(dj.enemyPlanets) && dj.enemyPlanets.length) req.enemyPlanets = dj.enemyPlanets.map((p) => capitalPlanet(p));
      if (Array.isArray(dj.suitableMansions) && dj.suitableMansions.length) { moonReq.suitableMansions = dj.suitableMansions; moonCitations.push({ ...cite, field: "mansion", value: moonReq.suitableMansions.join(", ") }); }
    }
  }

  // ── NO JS FALLBACK ──
  // Recommendations come ONLY from ManuscriptRule DB. If no manuscript rule
  // exists for a dimension, that dimension is reported as unrestricted with
  // "No manuscript rule available for this ritual." Never invent or estimate.
  return { req, moonReq, citations, moonCitations, dbRuleCount: dbRules.length };
}

// ═══════════════════════════════════════════════════════════════
// Astronomy helpers (pure math, read-only)
// ═══════════════════════════════════════════════════════════════
// ── LIVE MOON ENGINE ──
// Connects to the Astro Clock moon position calculator for real astronomical
// data: Moon Sign (zodiac), Moon Mansion (Manzil), Moon Phase, Waxing/Waning.
// Used in every manuscript timing evaluation that requires moon dimensions.
function getMoonPhase(date) {
  // Lunar day from known new moon (backward compatibility with moonSatisfied)
  const knownNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const lunarCycleMs = 29.53059 * 24 * 60 * 60 * 1000;
  const cycles = (date.getTime() - knownNewMoon) / lunarCycleMs;
  const frac = cycles - Math.floor(cycles);
  const lunarDay = Math.floor(frac * 29.53) + 1;

  // ── LIVE MOON POSITION from Astro Clock engine (read-only) ──
  // Returns: longitude, zodiacSign {name_en, name_ml, symbol},
  // mansion {name_en, harfi, no, ...}, phase (illumination %), nakshatra
  let liveMoon = null;
  try {
    liveMoon = calculateMoonPosition(date);
  } catch (_e) {
    liveMoon = null;
  }

  const moonSign = liveMoon?.zodiacSign || null;
  const moonMansion = liveMoon?.mansion || null;
  const illumination = liveMoon ? parseFloat(liveMoon.phase) : 0;

  return {
    lunarDay,
    isWaxing: lunarDay <= 14,
    isWaning: lunarDay > 14,
    isNewMoon: lunarDay >= 27 || lunarDay <= 1,
    isFullMoon: lunarDay >= 13 && lunarDay <= 16,
    phaseName: lunarDay <= 14 ? "Waxing" : "Waning",
    // ── LIVE DATA from Astro Clock Moon Engine ──
    moonSign: moonSign ? moonSign.name_en : null,
    moonSignMl: moonSign ? moonSign.name_ml : null,
    moonSignSymbol: moonSign ? moonSign.symbol : null,
    moonMansion: moonMansion ? (moonMansion.name_en || moonMansion.name) : null,
    moonMansionArabic: moonMansion ? (moonMansion.harfi || moonMansion.arabic || "") : null,
    moonMansionNumber: moonMansion ? (moonMansion.no || null) : null,
    moonLongitude: liveMoon ? parseFloat(liveMoon.longitude) : null,
    moonIllumination: illumination,
  };
}

function getTodayAllHours(date) {
  const month = date.getMonth();
  let sunrise, sunset;
  if (month >= 4 && month <= 8) { sunrise = 5.5; sunset = 19.0; }
  else if (month === 3 || month === 9) { sunrise = 6.0; sunset = 18.25; }
  else { sunrise = 6.83; sunset = 17.67; }
  return { hours: getAllPlanetaryHours(date, sunrise, sunset), sunrise, sunset };
}

function findHoursByPlanet(allHours, planetEn) {
  const t = (planetEn || "").toLowerCase();
  return allHours.filter((h) => h.planet === t);
}

function capitalPlanet(p) {
  if (!p) return p;
  const s = String(p);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function dayKeyFromName(name) {
  const n = String(name).toLowerCase();
  const map = { sunday: "sun", monday: "mon", tuesday: "tue", wednesday: "wed", thursday: "thu", friday: "fri", saturday: "sat" };
  return map[n] || n.slice(0, 3);
}

function scoreToStars(s) {
  if (s >= 85) return 5; if (s >= 70) return 4; if (s >= 50) return 3; if (s >= 30) return 2; if (s >= 15) return 1; return 0;
}
function starsToString(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

function moonSatisfied(moonReq, lunarDay) {
  if (!moonReq) return true;
  if (moonReq === "waxing") return lunarDay <= 14;
  if (moonReq === "waning") return lunarDay > 14;
  if (moonReq === "new") return lunarDay >= 27 || lunarDay <= 1;
  if (moonReq === "full") return lunarDay >= 13 && lunarDay <= 16;
  return true;
}

// ═══════════════════════════════════════════════════════════════
// STEP 5 — Find the EARLIEST valid time across up to 14 days.
// Searches: today remaining hours → tonight → next days → next valid day.
// ═══════════════════════════════════════════════════════════════
function findEarliestValidTime(req, fromDate) {
  const SEARCH_DAYS = 14;
  for (let d = 0; d < SEARCH_DAYS; d++) {
    const date = new Date(fromDate.getTime() + d * 24 * 60 * 60 * 1000);
    const { hours, sunrise, sunset } = getTodayAllHours(date);
    const dayKey = DAY_KEY_BY_INDEX[getActiveWeekday(date, sunrise, sunset)];

    // Day rule check only — Moon is handled separately in analyzeMoonCompatibility
    if (req.days && !req.days.includes(dayKey)) continue;

    for (const h of hours) {
      // Skip past hours today
      if (d === 0 && h.status === "past") continue;
      // Hour rule
      if (req.hours && !req.hours.map((p) => p.toLowerCase()).includes(h.planet)) continue;
      // Night rule
      if (req.nightRequired === true && h.period !== "night") continue;
      // Avoid worst hours
      if (req.worstHours && req.worstHours.map((p) => p.toLowerCase()).includes(h.planet)) continue;
      // Avoid enemy planets
      if (req.enemyPlanets && req.enemyPlanets.map((p) => p.toLowerCase()).includes(h.planet)) continue;

      return {
        dayName: MIZAN_DAY_NAMES[dayKey],
        date: date.toISOString().split("T")[0],
        hour: h.hourNumber,
        planet: capitalPlanet(h.planet),
        startTime: h.startTime,
        endTime: h.endTime,
        period: h.period,
        isToday: d === 0,
        daysAhead: d,
      };
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT DAY RESOLVER — LIVE (sunset-aware) or MANUAL (selected day)
// ═══════════════════════════════════════════════════════════════
// LIVE mode (no selectedDay): active day = getActiveWeekday(now) — changes at sunset.
// MANUAL mode (selectedDay set): the selected day IS the manuscript day.
//   Night of Day X = previous civil day's sunset → X's sunrise (target = X-1).
//   Day of Day X   = X's sunrise → X's sunset (target = X).
// Returns { activeDayIndex, referenceDate } for downstream hour-table lookup.
function resolveManuscriptDay(selectedDay, dayNight, now, sunrise, sunset) {
  if (!selectedDay) {
    return { activeDayIndex: getActiveWeekday(now, sunrise, sunset), referenceDate: now };
  }
  const activeDayIndex = MIZAN_DAY_TO_INDEX[selectedDay];
  const targetCivilIndex = dayNight === 'gece'
    ? (activeDayIndex - 1 + 7) % 7
    : activeDayIndex;
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    if (checkDate.getDay() === targetCivilIndex) {
      const referenceDate = new Date(checkDate);
      if (dayNight === 'gece') {
        referenceDate.setHours(Math.floor(sunset) + 1, 0, 0, 0);
      } else if (dayNight === 'gunduz') {
        referenceDate.setHours(Math.floor(sunrise) + 2, 0, 0, 0);
      }
      return { activeDayIndex, referenceDate };
    }
  }
  return { activeDayIndex, referenceDate: now };
}

// ═══════════════════════════════════════════════════════════════
// SELECTION ANALYSIS — Dimension-by-dimension check of user's
// manual Mizan selections against manuscript rules.
// Every ✓/✗ includes the manuscript reason and source.
// ═══════════════════════════════════════════════════════════════
function buildSelectionAnalysis({ selections, req, citations, noPurposeSelected, earliest, bestWindowsToday, todayHours, moonPhase, dayNight, selectedDay, selectedHour, selectedPlanet }) {
  if (noPurposeSelected) {
    return {
      suitable: false,
      purposeRequired: true,
      summary: "Purpose not selected — ritual-specific recommendations cannot be generated.",
      decisionBreakdown: [],
      bestAlternative: null,
    };
  }

  const breakdown = [];
  let allPass = true;
  const citeFor = (field) => {
    const c = citations.find(x => x.field === field);
    return c ? c.source : null;
  };

  // 1. Weekday
  if (req.days) {
    const dayOk = selectedDay && req.days.includes(selectedDay);
    if (!dayOk) allPass = false;
    breakdown.push({
      dimension: "weekday", label: "Weekday",
      currentValue: selectedDay ? MIZAN_DAY_NAMES[selectedDay] : "Not selected",
      status: dayOk ? "pass" : "fail",
      reason: dayOk
        ? `The manuscript prescribes ${req.days.map(d => MIZAN_DAY_NAMES[d]).join(", ")}. Your selection matches.`
        : `The manuscript prescribes ${req.days.map(d => MIZAN_DAY_NAMES[d]).join(" and ")} only.`,
      source: citeFor("day"),
      recommended: dayOk ? null : req.days.map(d => MIZAN_DAY_NAMES[d]).join(" or "),
    });
  } else {
    breakdown.push({ dimension: "weekday", label: "Weekday", currentValue: selectedDay ? MIZAN_DAY_NAMES[selectedDay] : "Not selected", status: "neutral", reason: "No manuscript rule exists for this condition.", source: null, recommended: null });
  }

  // 2. Planetary Hour — find the ruling planet of the selected hour
  if (req.hours) {
    const selectedPeriod = dayNight === "gece" ? "night" : "day";
    const selectedHourInfo = selectedHour ? todayHours.find(h => h.hourNumber === selectedHour && (dayNight ? h.period === selectedPeriod : true)) : null;
    const hourPlanet = selectedHourInfo ? capitalPlanet(selectedHourInfo.planet) : null;
    const hourOk = selectedHourInfo && req.hours.map(p => p.toLowerCase()).includes(selectedHourInfo.planet);
    if (selectedHourInfo && !hourOk) allPass = false;
    breakdown.push({
      dimension: "hour", label: "Planetary Hour",
      currentValue: selectedHour ? `Hour #${selectedHour}${hourPlanet ? ` (${hourPlanet})` : ""}` : "Not selected",
      status: !selectedHourInfo ? "neutral" : hourOk ? "pass" : "fail",
      reason: !selectedHourInfo
        ? `The manuscript prescribes ${req.hours.join(", ")} hour(s). Select an hour to verify.`
        : hourOk
          ? `The manuscript prescribes ${req.hours.join(", ")} hour. Your selected hour is ruled by ${hourPlanet}.`
          : `The manuscript prescribes ${req.hours.join(", ")} hour. Your selected hour is ruled by ${hourPlanet}, which does not match.`,
      source: citeFor("hour"),
      recommended: req.hours.join(" or "),
    });
  } else {
    breakdown.push({ dimension: "hour", label: "Planetary Hour", currentValue: selectedHour ? `Hour #${selectedHour}` : "Not selected", status: "neutral", reason: "No manuscript rule exists for this condition.", source: null, recommended: null });
  }

  // 3. Planet
  if (req.planet) {
    const selectedPlanetEn = MIZAN_TO_EN_PLANET[selectedPlanet];
    const planetOk = selectedPlanetEn && req.planet.includes(selectedPlanetEn);
    if (selectedPlanet && !planetOk) allPass = false;
    breakdown.push({
      dimension: "planet", label: "Planet",
      currentValue: selectedPlanetEn || (selectedPlanet || "Not selected"),
      status: !selectedPlanet ? "neutral" : planetOk ? "pass" : "fail",
      reason: !selectedPlanet
        ? `The manuscript prescribes ${req.planet.join(", ")}.`
        : planetOk
          ? `The manuscript prescribes ${req.planet.join(", ")}. Your selection matches.`
          : `The manuscript prescribes ${req.planet.join(" and ")} only.`,
      source: citeFor("planet"),
      recommended: planetOk ? null : req.planet.join(" or "),
    });
  } else {
    breakdown.push({ dimension: "planet", label: "Planet", currentValue: selectedPlanet ? (MIZAN_TO_EN_PLANET[selectedPlanet] || selectedPlanet) : "Not selected", status: "neutral", reason: "No manuscript rule exists for this condition.", source: null, recommended: null });
  }

  // 4. Element
  const selectedElement = selections?.elements?.[0] || null;
  if (req.element) {
    const elemOk = selectedElement === req.element;
    if (selectedElement && !elemOk) allPass = false;
    breakdown.push({
      dimension: "element", label: "Element",
      currentValue: selectedElement || "Not selected",
      status: !selectedElement ? "neutral" : elemOk ? "pass" : "fail",
      reason: !selectedElement
        ? `The manuscript prescribes ${req.element} element.`
        : elemOk
          ? `The manuscript prescribes ${req.element} element. Your selection matches.`
          : `The manuscript prescribes ${req.element} element for this work.`,
      source: citeFor("element"),
      recommended: elemOk ? null : req.element,
    });
  } else {
    breakdown.push({ dimension: "element", label: "Element", currentValue: selectedElement || "Not selected", status: "neutral", reason: "No manuscript rule exists for this condition.", source: null, recommended: null });
  }

  // 5. Day/Night
  if (req.nightRequired === true) {
    const dnOk = dayNight === "gece";
    if (dayNight && !dnOk) allPass = false;
    breakdown.push({
      dimension: "dayNight", label: "Day / Night",
      currentValue: dayNight === "gunduz" ? "Day" : dayNight === "gece" ? "Night" : "Not selected",
      status: !dayNight ? "neutral" : dnOk ? "pass" : "fail",
      reason: !dayNight
        ? "The manuscript requires this work be performed at night."
        : dnOk
          ? "The manuscript requires night. Your selection matches."
          : "The manuscript requires this work be performed at night.",
      source: citeFor("night"),
      recommended: dnOk ? null : "Night (Gece)",
    });
  } else {
    breakdown.push({ dimension: "dayNight", label: "Day / Night", currentValue: dayNight === "gunduz" ? "Day" : dayNight === "gece" ? "Night" : "Not selected", status: "neutral", reason: "No manuscript rule exists for this condition.", source: null, recommended: null });
  }

  // ── Moon dimensions removed from main checklist ──
  // Moon analysis is OPTIONAL and handled by the MoonAnalysisCard component.
  // The main checklist evaluates Day + Saat + Kawkab + Element + Day/Night only.

  // 7. Enemy planet check
  if (req.enemyPlanets && req.enemyPlanets.length > 0 && selectedPlanet) {
    const selectedPlanetEn = MIZAN_TO_EN_PLANET[selectedPlanet];
    const isEnemy = selectedPlanetEn && req.enemyPlanets.includes(selectedPlanetEn);
    if (isEnemy) allPass = false;
    breakdown.push({
      dimension: "enemyPlanet", label: "Enemy Planet Check",
      currentValue: selectedPlanetEn || "Not selected",
      status: isEnemy ? "fail" : "pass",
      reason: isEnemy
        ? `${selectedPlanetEn} is an enemy planet for this ritual per the manuscript.`
        : `Your selected planet is not an enemy planet for this ritual.`,
      source: "ManuscriptRule",
      recommended: isEnemy ? (req.planet?.[0] || req.hours?.[0] || "See prescribed planets") : null,
    });
  }

  // Best alternative configuration
  const bestAlt = {};
  if (req.days?.[0]) bestAlt.day = MIZAN_DAY_NAMES[req.days[0]];
  if (req.days?.[1]) bestAlt.altDay = MIZAN_DAY_NAMES[req.days[1]];
  if (req.hours?.[0]) bestAlt.hour = req.hours[0];
  if (req.planet?.[0]) bestAlt.planet = req.planet[0];
  else if (req.hours?.[0]) bestAlt.planet = req.hours[0];
  if (req.element) bestAlt.element = req.element;
  if (req.nightRequired === true) bestAlt.dayNight = "Night (Gece)";
  if (earliest) {
    bestAlt.timeWindow = `${earliest.startTime} – ${earliest.endTime}`;
    bestAlt.dayName = earliest.dayName;
    bestAlt.date = earliest.date;
    bestAlt.isToday = earliest.isToday;
    bestAlt.daysAhead = earliest.daysAhead;
  } else if (bestWindowsToday?.[0]) {
    bestAlt.timeWindow = `${bestWindowsToday[0].startTime} – ${bestWindowsToday[0].endTime}`;
    bestAlt.dayName = "Today";
    bestAlt.isToday = true;
  }
  bestAlt.reason = "Matches all manuscript conditions for this ritual.";
  bestAlt.complete = !!bestAlt.day || !!bestAlt.hour || !!bestAlt.timeWindow;

  return {
    suitable: allPass,
    purposeRequired: false,
    summary: allPass
      ? "Your current configuration is valid — all manuscript conditions are satisfied."
      : `Your current configuration has ${breakdown.filter(b => b.status === "fail").length} issue(s) that need to be corrected.`,
    decisionBreakdown: breakdown,
    bestAlternative: bestAlt.complete ? bestAlt : null,
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN — analyzeRitualTiming (same return shape as V2)
// ═══════════════════════════════════════════════════════════════
export function analyzeRitualTiming({ result, selections, customPurpose, activeMethod, manuscriptRules, purposeLookup }) {
  const reasoning = [];
  const warnings = [];
  const bookNotes = [];
  const conflicts = [];
  const rulesApplied = [];

  // ── Mizan state ──
  const dominant = result?.dominant || (selections?.elements?.[0] || null);
  const khayrSharrSelected = selections?.khayrSharr8 || null;
  const selectedDay = selections?.days || null;
  const selectedHour = selections?.hour || null;
  const selectedPlanet = selections?.planet || null;
  const dayNight = selections?.dayNight || null;
  const purposes = selections?.purposes || [];

  // ── STEP 1: identify ritual from user selections ──
  const identified = identifyRitual({ selections, customPurpose, manuscriptRules, purposeLookup });
  const ritualKey = identified.ritualKey;
  const matchedOn = identified.matchedOn;
  // No purpose selected → continue with a "general" context so the full report
  // still renders. Purpose-specific fields will be marked as unavailable.
  const noPurposeSelected = !ritualKey;
  const effectiveRitualKey = ritualKey || "general";
  reasoning.push(`Ritual identified as "${effectiveRitualKey}" via ${matchedOn}.`);
  rulesApplied.push({
    id: "IDENTIFY",
    desc: `Ritual classified as ${effectiveRitualKey} (${matchedOn})`,
    source: "Engine inference from Mizan + custom purpose",
  });

  // ── STEP 2: gather rules ──
  const { req, moonReq, citations, moonCitations, dbRuleCount } = gatherRules(effectiveRitualKey, manuscriptRules, !noPurposeSelected);
  reasoning.push(`ManuscriptRule DB: ${dbRuleCount} matching rule(s). No JS fallback — manuscript-only authority.`);
  for (const c of citations) {
    rulesApplied.push({ id: c.rule_id, desc: c.summary || `${c.category} rule`, source: c.source });
    bookNotes.push({ source: c.source, text: c.summary || c.category });
  }

  // ── Polarity (only if explicitly selected; never invent) ──
  const khayrSharr = khayrSharrSelected || null;

  // ── STEP 3+4: Astro Clock — manuscript sunset-aware (LIVE + MANUAL) ──
  const now = new Date();
  const nowData = getTodayAllHours(now);
  const sunrise = nowData.sunrise;
  const sunset = nowData.sunset;

  const { activeDayIndex, referenceDate } = resolveManuscriptDay(selectedDay, dayNight, now, sunrise, sunset);
  const refData = getTodayAllHours(referenceDate);
  const todayHours = refData.hours;

  const currentHourInfo = getCurrentPlanetaryHour(referenceDate, refData.sunrise, refData.sunset);
  const dayRuler = getDayRuler(activeDayIndex);
  const moonPhase = getMoonPhase(referenceDate);
  const currentDayKey = DAY_KEY_BY_INDEX[activeDayIndex];
  const isNightTime = selectedDay
    ? (dayNight === 'gece')
    : (now.getHours() < sunrise || now.getHours() >= sunset);

  reasoning.push(`Current: ${MIZAN_DAY_NAMES[currentDayKey]}, hour #${currentHourInfo.hourNumber} (${currentHourInfo.planet}), ${isNightTime ? "night" : "day"}.`);

  // ── Evaluate current moment against found rules ONLY ──
  const currentHourOk = !req.hours || req.hours.map((p) => p.toLowerCase()).includes(currentHourInfo.planet);
  const currentDayOk = !req.days || req.days.includes(currentDayKey);
  const currentNightOk = req.nightRequired !== true || isNightTime;
  const currentNotEnemy = !req.enemyPlanets || !req.enemyPlanets.map((p) => p.toLowerCase()).includes(currentHourInfo.planet);
  const currentNotWorst = !req.worstHours || !req.worstHours.map((p) => p.toLowerCase()).includes(currentHourInfo.planet);
  // Moon is NOT part of the main timing evaluation — it is optional.
  const currentMomentSuitable = currentHourOk && currentDayOk && currentNightOk && currentNotEnemy && currentNotWorst;

  // ── Can perform today? ──
  let canPerformToday = "No";
  if (currentMomentSuitable) canPerformToday = "Yes";
  else {
    // search remaining today
    const todayRemaining = todayHours.filter((h) => h.status !== "past");
    const anyOk = todayRemaining.some((h) =>
      (!req.hours || req.hours.map((p) => p.toLowerCase()).includes(h.planet)) &&
      (!req.worstHours || !req.worstHours.map((p) => p.toLowerCase()).includes(h.planet)) &&
      (!req.enemyPlanets || !req.enemyPlanets.map((p) => p.toLowerCase()).includes(h.planet)) &&
      (req.nightRequired !== true || h.period === "night")
    );
    const dayOk = !req.days || req.days.includes(currentDayKey);
    if (anyOk && dayOk) canPerformToday = "Limited";
  }

  // ── Today's windows (rule-matched, star-rated) ──
  const bestWindowsToday = [];
  const avoidWindowsToday = [];
  for (const h of todayHours) {
    if (h.status === "past") continue;
    const planetLC = h.planet;
    const isBest = !req.hours || req.hours.map((p) => p.toLowerCase()).includes(planetLC);
    const isWorst = (req.worstHours && req.worstHours.map((p) => p.toLowerCase()).includes(planetLC)) ||
                    (req.enemyPlanets && req.enemyPlanets.map((p) => p.toLowerCase()).includes(planetLC));
    if (isBest && !isWorst) {
      let s = 50;
      const r = [];
      if (req.hours && req.hours.map((p) => p.toLowerCase()).includes(planetLC)) { s += 25; r.push("hour matches manuscript prescription"); }
      if (req.nightRequired === true && h.period === "night") { s += 12; r.push("night hour as required"); }
      bestWindowsToday.push({
        startTime: h.startTime, endTime: h.endTime, planet: capitalPlanet(planetLC),
        hourNumber: h.hourNumber, period: h.period,
        score: Math.min(100, s), stars: scoreToStars(Math.min(100, s)),
        reason: r.join("; ") || "available hour",
      });
    }
    if (isWorst) {
      avoidWindowsToday.push({ startTime: h.startTime, endTime: h.endTime, planet: capitalPlanet(planetLC), hourNumber: h.hourNumber, reason: "enemy/worst planet per manuscript" });
    }
  }

  // ── STEP 5: earliest valid time ──
  const earliest = findEarliestValidTime(req, now);

  // ── SELECTION ANALYSIS: dimension-by-dimension check of user's selections ──
  const selectionAnalysis = buildSelectionAnalysis({
    selections, req, citations, noPurposeSelected,
    earliest, bestWindowsToday, todayHours, moonPhase,
    dayNight, selectedDay, selectedHour, selectedPlanet,
  });

  // ── Score: only from found rules ──
  let score = 50;
  const scoreReasons = [];
  if (currentDayOk) { score += 20; scoreReasons.push("Correct day per manuscript (+20)"); } else if (req.days) { score -= 15; scoreReasons.push("Wrong day per manuscript (-15)"); }
  if (currentHourOk) { score += 25; scoreReasons.push("Current hour matches manuscript (+25)"); } else if (req.hours) { score -= 10; scoreReasons.push("Current hour not prescribed (-10)"); }
  if (currentNightOk && req.nightRequired === true) { score += 10; scoreReasons.push("Night requirement met (+10)"); }
  if (currentNotEnemy && req.enemyPlanets?.length) { score += 5; scoreReasons.push("Not enemy hour (+5)"); }
  score = Math.max(0, Math.min(100, score));

  // ── Estimated compatibility after applying all recommendations ──
  // If the user follows every manuscript recommendation, all conditions pass.
  // Calculate the max achievable score from the rules that exist.
  let estimatedAfterChanges = score;
  if (dbRuleCount > 0) {
    let maxScore = 50;
    if (req.days) maxScore += 20;
    if (req.hours) maxScore += 25;
    if (req.nightRequired === true) maxScore += 10;
    if (req.enemyPlanets?.length) maxScore += 5;
    estimatedAfterChanges = Math.min(100, maxScore);
  }

  const stars = scoreToStars(score);
  let verdict, verdictColor, verdictReason;
  if (score >= 85) { verdict = "Excellent"; verdictColor = "#4ADE80"; verdictReason = "All manuscript conditions align."; }
  else if (score >= 70) { verdict = "Good"; verdictColor = "#86EFAC"; verdictReason = "Most manuscript conditions are favorable."; }
  else if (score >= 50) { verdict = "Moderate"; verdictColor = "#FBBF24"; verdictReason = "Mixed conditions — proceed with caution."; }
  else if (score >= 30) { verdict = "Weak"; verdictColor = "#F59E0B"; verdictReason = "Conditions are unfavorable per manuscript."; }
  else { verdict = "Avoid"; verdictColor = "#F87171"; verdictReason = "Multiple unfavorable conditions."; }

  // ── Warnings (only for violated found rules) ──
  if (req.days && !currentDayOk) warnings.push(`Today (${MIZAN_DAY_NAMES[currentDayKey]}) is not a prescribed day. Manuscript prescribes: ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")}.`);
  if (req.hours && !currentHourOk) warnings.push(`Current hour (${capitalPlanet(currentHourInfo.planet)}) is not prescribed. Manuscript prescribes: ${req.hours.join(", ")} hour(s).`);
  if (req.nightRequired === true && !isNightTime) warnings.push("Manuscript requires night, but it is currently day.");
  if (req.worstHours && currentNotWorst === false) warnings.push(`Current hour is a worst/enemy hour: ${capitalPlanet(currentHourInfo.planet)}.`);

  // ── Astro Clock status ──
  const astroClockStatus = {
    day: MIZAN_DAY_NAMES[currentDayKey], dayRuler: dayRuler.planet,
    currentHour: { number: currentHourInfo.hourNumber, planet: capitalPlanet(currentHourInfo.planet), symbol: PLANET_INFO[currentHourInfo.planet]?.symbol || "" },
    isDaytime: !isNightTime, hourRemaining: currentHourInfo.remainingTime,
    nextPlanet: PLANET_SEQUENCE[(PLANET_SEQUENCE.indexOf(currentHourInfo.planet) + 1) % 7] || "",
    summary: `Today is ${MIZAN_DAY_NAMES[currentDayKey]} (ruled by ${dayRuler.planet}). Current hour #${currentHourInfo.hourNumber} (${currentHourInfo.planet}), ${isNightTime ? "night" : "day"}, ${currentHourInfo.remainingTime} left.`,
  };

  // ── LIVE NOW — real current time + REAL local sunrise/sunset (NOAA) ──
  // Separate state: manual selections (day/Layl-Nahar/Saat) do NOT overwrite this.
  // Uses real local sunrise/sunset — never hardcoded seasonal approximations.
  // getCurrentPlanetaryHour divides Sunrise→Sunset into 12 Day Saat and
  // Sunset→next Sunrise into 12 Night Saat, returning the interval containing now.
  const liveLoc = getUserLocation();
  const liveSun = calculateSunriseSunset(now, liveLoc.lat, liveLoc.lng, liveLoc.timezone);
  const liveSunrise = (liveSun.sunrise != null) ? liveSun.sunrise : 6.5;
  const liveSunset = (liveSun.sunset != null) ? liveSun.sunset : 18.25;
  // Shift now to the location's timezone so getHours()/getDay() return local
  // time matching the sunrise/sunset values from calculateSunriseSunset.
  // Without this, a browser in a non-Dubai timezone reads the wrong hour and
  // the Sahat defaults to 1 instead of the actual current Sahat.
  const liveTzDiffMs = (liveLoc.timezone * 60 + now.getTimezoneOffset()) * 60 * 1000;
  const liveNowDate = new Date(now.getTime() + liveTzDiffMs);
  const liveHourInfo = getCurrentPlanetaryHour(liveNowDate, liveSunrise, liveSunset);
  const liveDayIndex = getActiveWeekday(liveNowDate, liveSunrise, liveSunset);
  const liveDayKey = DAY_KEY_BY_INDEX[liveDayIndex];
  const liveDayRuler = getDayRuler(liveDayIndex);
  const liveIsNight = liveNowDate.getHours() < liveSunrise || liveNowDate.getHours() >= liveSunset;
  const liveNow = {
    day: MIZAN_DAY_NAMES[liveDayKey],
    dayRuler: liveDayRuler.planet,
    laylNahar: liveIsNight ? "Layl" : "Nahar",
    saat: liveHourInfo.hourNumber,
    kawkab: capitalPlanet(liveHourInfo.planet),
    planetaryHour: capitalPlanet(liveHourInfo.planet),
    currentHour: { number: liveHourInfo.hourNumber, planet: capitalPlanet(liveHourInfo.planet), symbol: PLANET_INFO[liveHourInfo.planet]?.symbol || "" },
    isDaytime: !liveIsNight,
    hourRemaining: liveHourInfo.remainingTime,
    summary: `Now is ${MIZAN_DAY_NAMES[liveDayKey]} (ruled by ${liveDayRuler.planet}), ${liveIsNight ? "Layl (night)" : "Nahar (day)"}. Saat #${liveHourInfo.hourNumber} (${capitalPlanet(liveHourInfo.planet)}).`,
  };

  // ═══════════════════════════════════════════════════════════════
  // BUILD 10-SECTION REPORT (same shape as V2)
  // ═══════════════════════════════════════════════════════════════
  const report = [];
  // Canonical display label: full resolved phrase (Action + Purpose + Modifier),
  // never the isolated dictionary keyword. Falls back to ritual-key label only
  // when no dictionary match produced a resolved phrase.
  const ritualTypeLabel = identified.resolvedPhraseEn
    || (effectiveRitualKey.charAt(0).toUpperCase() + effectiveRitualKey.slice(1) + " Work");

  report.push({
    section: "TODAY ANALYSIS", icon: "calendar", status: canPerformToday,
    body: canPerformToday === "Yes" ? `Yes — the current conditions satisfy every manuscript rule found for this ritual. You may proceed now.`
      : canPerformToday === "Limited" ? `Today is partially suitable — some valid hours remain, but the current moment is not ideal.`
      : `No — today does not satisfy the manuscript rules for this ritual. ${req.days ? `Prescribed day(s): ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")}.` : ""}`,
    citation: citations.map((c) => c.source).join("; ") || "ManuscriptRule DB only",
    consequence: "Proceeding against manuscript rules weakens or reverses the ritual.",
  });

  report.push({
    section: "CURRENT MOMENT", icon: "clock", status: currentMomentSuitable ? "Suitable" : "Not suitable",
    body: currentMomentSuitable
      ? `The current moment satisfies all found manuscript rules: hour ${capitalPlanet(currentHourInfo.planet)}, ${isNightTime ? "night" : "day"}. Act now.`
      : `The current moment does NOT satisfy all manuscript rules. Hour: ${capitalPlanet(currentHourInfo.planet)}. ${!currentHourOk ? `Prescribed hours: ${req.hours.join(", ")}.` : ""} ${!currentNightOk ? "Night required." : ""} ${earliest ? `Earliest valid opportunity: ${earliest.dayName}${earliest.isToday ? " (today)" : ""} at ${earliest.startTime}–${earliest.endTime} (${earliest.planet}).` : ""}`,
    citation: citations.map((c) => c.source).join("; ") || "Manuscript rules",
    consequence: "Acting outside the manuscript window wastes the ritual.",
    waitTime: earliest ? (earliest.isToday ? "later today" : `${earliest.daysAhead}d`) : null,
  });

  report.push({
    section: "TODAY'S WINDOWS", icon: "windows", status: `${bestWindowsToday.length} available`,
    windows: bestWindowsToday.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((w) => ({
      time: `${w.startTime}–${w.endTime}`, stars: starsToString(w.stars), planet: w.planet, hourNumber: w.hourNumber, period: w.period,
      reason: w.reason, strengthReason: `${starsToString(w.stars)} — ${w.reason}`,
    })),
    body: bestWindowsToday.length > 0 ? `Rule-matched windows today, star-rated by alignment with manuscript prescriptions.` : `No rule-matched windows remain today.`,
    citation: citations.map((c) => c.source).join("; ") || "Manuscript rules",
    consequence: "These are your power windows per the manuscripts.",
  });

  const ranked = [...bestWindowsToday].sort((a, b) => b.score - a.score).slice(0, 3).map((w, i) => ({ ...w, rank: i + 1 }));
  report.push({
    section: "BEST TIME", icon: "star", status: `${ranked.length} ranked`,
    ranked: ranked.map((w) => ({
      rank: w.rank, time: `${w.startTime}–${w.endTime}`, stars: starsToString(w.stars), planet: w.planet,
      reason: w.rank === 1 ? `Strongest window today. ${w.reason}.` : `Rank ${w.rank} fallback. ${w.reason}.`,
    })),
    body: ranked.length > 0 ? `Top hours today ranked by manuscript alignment.` : `No ranked windows today — see next opportunity.`,
    citation: citations.map((c) => c.source).join("; ") || "Manuscript rules",
    consequence: "Starting at the wrong hour means the ruling planet does not govern the request.",
  });

  report.push({
    section: "BAD TIMES", icon: "alert", status: `${avoidWindowsToday.length} to avoid`,
    avoid: avoidWindowsToday.map((w) => ({ time: `${w.startTime}–${w.endTime}`, planet: w.planet, reason: w.reason })),
    enemyAnalysis: {
      enemyHours: req.worstHours || req.enemyPlanets || [],
      enemyDays: req.worstDays || [],
      enemyMoonPhases: [],
      enemyRulers: req.enemyPlanets || [],
      note: req.enemyPlanets?.length ? `Manuscript identifies ${req.enemyPlanets.join(", ")} as enemy planets for this work.` : `No enemy planets specified in the manuscripts for this ritual.`,
    },
    body: avoidWindowsToday.length > 0 ? `Avoid these hours today per manuscript: ${avoidWindowsToday.map((w) => `${w.startTime}–${w.endTime} (${w.planet})`).join("; ")}.` : `No specifically dangerous hours found today.`,
    citation: citations.map((c) => c.source).join("; ") || "Manuscript rules",
    consequence: "Performing in an enemy hour can cause the ritual to rebound.",
  });

  report.push({
    section: "IF TODAY IS NOT GOOD", icon: "calendar-clock", status: earliest ? `Next: ${earliest.dayName}` : "No window in 14 days",
    nextHour: earliest ? { day: earliest.dayName, time: `${earliest.startTime}–${earliest.endTime}`, planet: earliest.planet, isToday: earliest.isToday, daysAhead: earliest.daysAhead } : null,
    nextMoonPhase: null,
    body: earliest
      ? `Earliest valid opportunity: ${earliest.dayName}${earliest.isToday ? " (today)" : ` (${earliest.daysAhead} day(s) ahead)`}, ${earliest.startTime}–${earliest.endTime} (${earliest.planet} hour, hour #${earliest.hour}). This is the first time all Day + Saat manuscript rules are simultaneously satisfied within the next 14 days.`
      : `No fully valid opportunity found within 14 days. Review the manuscript rules for exceptions.`,
    citation: citations.map((c) => c.source).join("; ") || "Manuscript rules",
    consequence: "Waiting for the earliest valid time ensures full ritual power.",
  });

  report.push({
    section: "ASTRO ANALYSIS", icon: "globe", status: `${astroClockStatus.day} / ${astroClockStatus.currentHour.planet}`,
    body: `Today is ${astroClockStatus.day}, ruled by ${dayRuler.planet}. Current hour #${currentHourInfo.hourNumber} (${currentHourInfo.planet}), ${isNightTime ? "night" : "day"}, ${currentHourInfo.remainingTime} left. Overall manuscript strength: ${verdict} (${score}%).`,
    citation: "Live Astro Clock (read-only)",
    consequence: "Composite of all manuscript conditions.",
    details: { dayRuler: dayRuler.planet, currentHour: currentHourInfo, moonPhase, score, verdict },
  });

  report.push({
    section: "MANUSCRIPT EXPLANATION", icon: "book", status: `${rulesApplied.length} rules applied`,
    rules: rulesApplied,
    body: `Every recommendation is grounded exclusively in the ManuscriptRule database. ${citations.length} rule citation(s) found for this ritual. No JS fallback, no heuristic, no invented rule: dimensions without a manuscript rule are reported as unrestricted.`,
    citation: "ManuscriptRule DB (manuscript-only authority)",
    consequence: "Each rule carries the authority of its source manuscript.",
  });

  report.push({
    section: "WARNING SECTION", icon: "alert-triangle", status: warnings.length > 0 ? `${warnings.length} warnings` : "No warnings",
    warnings, conflicts,
    body: warnings.length > 0 ? warnings.map((w) => `⚠ ${w}`).join(" ") : `No warnings — all found manuscript conditions are satisfied.`,
    citation: "Manuscript rules",
    consequence: "Each warning identifies a violated manuscript condition.",
  });

  report.push({
    section: "FINAL DECISION", icon: "sparkles", status: verdict, stars: starsToString(stars), starsCount: stars, color: verdictColor, score,
    body: `${starsToString(stars)} ${verdict}. ${verdictReason} Composite of ${scoreReasons.length} factor(s): ${scoreReasons.join("; ")}. ${canPerformToday === "Yes" ? "Proceed now." : canPerformToday === "Limited" ? "Proceed with caution today or wait for the earliest valid time." : "Postpone to the earliest valid opportunity."} ${req.incense ? `Burn ${req.incense} during the work.` : ""}`,
    citation: "Composite of manuscript rules",
    consequence: score >= 70 ? "Strong — proceed." : score >= 50 ? "Moderate — proceed with focus." : "Weak — postpone.",
  });

  // ── Expert narrative ──
  const expertNarrative = [];
  expertNarrative.push(`This ritual has been identified as "${ritualTypeLabel}" from your Mizan results and custom purpose (${matchedOn}).`);
  if (dbRuleCount > 0) expertNarrative.push(`${dbRuleCount} manuscript rule(s) were found in the database for this ritual. All recommendations are manuscript-sourced.`);
  else expertNarrative.push(`No matching rules were found in the ManuscriptRule database. No manuscript rule available for this ritual — all dimensions are unrestricted.`);
  if (req.days) expertNarrative.push(`The manuscripts prescribe day(s): ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")}.`);
  if (req.hours) expertNarrative.push(`The manuscripts prescribe hour(s) ruled by: ${req.hours.join(", ")}.`);
  if (req.nightRequired === true) expertNarrative.push(`The manuscripts require this work be performed at night.`);
  if (earliest) expertNarrative.push(`The earliest fully valid opportunity is ${earliest.dayName}${earliest.isToday ? " (today)" : ` (${earliest.daysAhead} day(s) away)`} at ${earliest.startTime}–${earliest.endTime}.`);
  if (!req.days && !req.hours) expertNarrative.push(`No specific day or hour restriction was found in the manuscripts for this ritual — timing is guided by the general planetary conditions only.`);

  return {
    report, consultation: report,
    noPurposeSelected,
    verdict, verdictColor, verdictReason, verdictStars: stars, verdictStarsString: starsToString(stars),
    confidenceScore: score, scoreBreakdown: scoreReasons,
    ritualType: ritualTypeLabel, ritualTypeDescription: "", ritualCategory: ritualTypeLabel, ritualIntent: ritualTypeLabel,
    ritualSemanticMl: identified.resolvedPhraseMl || null,
    khayrSharr: khayrSharr || "Not selected", khayrSharrInferred: false,
    khayrSharrMeaning: khayrSharr === "khayr" ? "Benevolence" : khayrSharr === "sharr" ? "Power/Banishment" : "Not determined",
    canPerformToday,
    currentMomentSuitable,
    waitTime: earliest ? (earliest.isToday ? "later today" : `${earliest.daysAhead}d`) : null,
    bestWindowsToday, rankedWindows: ranked, topThree: ranked, avoidWindowsToday,
    enemyAnalysis: { enemyHours: req.worstHours || req.enemyPlanets || [], enemyDays: req.worstDays || [], enemyMoonPhases: [], enemyRulers: req.enemyPlanets || [], note: "" },
    nextOpportunity: earliest, nextMoonPhase: null,
    moonPhase: {
      lunarDay: moonPhase.lunarDay, phaseName: moonPhase.phaseName,
      isWaxing: moonPhase.isWaxing, isNewMoon: moonPhase.isNewMoon, isFullMoon: moonPhase.isFullMoon,
      moonSign: moonPhase.moonSign, moonSignMl: moonPhase.moonSignMl, moonSignSymbol: moonPhase.moonSignSymbol,
      moonMansion: moonPhase.moonMansion, moonMansionArabic: moonPhase.moonMansionArabic, moonMansionNumber: moonPhase.moonMansionNumber,
      moonLongitude: moonPhase.moonLongitude, moonIllumination: moonPhase.moonIllumination,
    },
    moonReq,
    moonCitations,
    req,
    bestPlanetaryHour: req.hours?.[0] || null, bestRulingPlanet: req.planet?.[0] || req.hours?.[0] || null,
    bestDay: req.days?.[0] ? MIZAN_DAY_NAMES[req.days[0]] : null,
    bestDayReason: req.days ? `Manuscript prescribes ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")}` : "No day restriction in manuscripts",
    bestHourReason: req.hours ? `Manuscript prescribes ${req.hours.join(", ")} hour(s)` : "No hour restriction in manuscripts",
    altDay: req.days?.[1] ? MIZAN_DAY_NAMES[req.days[1]] : null, altHour: req.hours?.[1] || null,
    dayNightSuitability: {
      status: req.nightRequired === true ? (isNightTime ? "optimal" : "forbidden") : "neutral",
      reason: req.nightRequired === true ? (isNightTime ? "Night, as required." : "Day, but night required.") : "No night restriction in manuscripts.",
      citation: "ManuscriptRule (if specified)",
    },
    zodiacSuitability: { assessed: false, note: "Zodiac analysis is optional — use the Moon Analysis card." },
    elementCompatibility: { assessed: !!req.element, status: "neutral", reason: req.element ? `Manuscript prescribes element: ${req.element}` : "No element restriction in manuscripts." },
    elementDirection: req.direction ? { dir: req.direction } : null,
    elementPlacement: null,
    astroClockStatus,
    liveNow,
    recommendedStart: ranked[0]?.startTime || earliest?.startTime || null,
    recommendedEnd: ranked[0]?.endTime || earliest?.endTime || null,
    recommendedIncense: req.incense || null,
    selectionAnalysis,
    estimatedCompatibilityAfterChanges: estimatedAfterChanges,
    rulesApplied, warnings, bookNotes, conflicts, expertNarrative, reasoning,
  };
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION ADVISOR — compares current Mizan vs manuscript ideal.
// Same return shape as V2.
// ═══════════════════════════════════════════════════════════════
export function analyzeConfigurationAdvice({ result, selections, customPurpose, activeMethod, manuscriptRules, purposeLookup }) {
  const purposes = selections?.purposes || [];
  const custom = (customPurpose || "").trim();
  const base = analyzeRitualTiming({ result, selections, customPurpose, activeMethod, manuscriptRules, purposeLookup });
  const noPurposeSelected = !!base?.noPurposeSelected;
  const { ritualKey } = identifyRitual({ selections, customPurpose, manuscriptRules, purposeLookup });
  const effectiveRitualKey = ritualKey || "general";
  const { req, citations } = gatherRules(effectiveRitualKey, manuscriptRules, !noPurposeSelected);

  const dominant = result?.dominant || (selections?.elements?.[0] || null);
  const selectedDay = selections?.days || null;
  const selectedHour = selections?.hour || null;
  const selectedPlanet = selections?.planet || null;
  const dayNight = selections?.dayNight || null;
  const now = new Date();
  const nowDataAdv = getTodayAllHours(now);
  const { referenceDate: cfgRefDate } = resolveManuscriptDay(selectedDay, dayNight, now, nowDataAdv.sunrise, nowDataAdv.sunset);
  const bestWindow = base.bestWindowsToday?.[0];

  const recommendations = [];
  let allOptimal = true;

  const purposeLabel = base?.ritualType || (effectiveRitualKey.charAt(0).toUpperCase() + effectiveRitualKey.slice(1) + " Work");
  const identifiedAdv = identifyRitual({ selections, customPurpose, manuscriptRules, purposeLookup });
  recommendations.push({
    field: "Ritual Purpose", icon: "target",
    current: noPurposeSelected ? "No Purpose Selected" : purposeLabel,
    recommended: noPurposeSelected ? "Select a Purpose in Mizan 7" : purposeLabel,
    isOptimal: !noPurposeSelected,
    reason: noPurposeSelected
      ? "No purpose selected in Mizan 7. Purpose-specific recommendations are marked as Not Available. Select a purpose to receive targeted ritual timing advice."
      : `Ritual identified as ${effectiveRitualKey} from Mizan selections and custom purpose (${identifiedAdv.matchedOn}). This is the basis for all manuscript rule lookups.`,
  });

  const khayrSharrSelected = selections?.khayrSharr8 || null;
  recommendations.push({
    field: "Khayr / Sharr (Mizan 8)", icon: "scale",
    current: khayrSharrSelected || "Not selected",
    recommended: khayrSharrSelected || "Select Khayr or Sharr (optional — no universal rule applied)",
    isOptimal: true,
    reason: "No manuscript rule was found that forces a universal Khayr/Sharr timing restriction for this ritual. Select it only if your specific manuscript requires it.",
  });

  const dayOptimal = !req.days || (selectedDay && req.days.includes(selectedDay));
  if (req.days && !dayOptimal) allOptimal = false;
  recommendations.push({
    field: "Selected Weekday (Mizan 5)", icon: "calendar",
    current: selectedDay ? MIZAN_DAY_NAMES[selectedDay] : "Not selected",
    recommended: req.days ? req.days.map((d) => MIZAN_DAY_NAMES[d]).join(" or ") : "No day restriction in manuscripts",
    isOptimal: dayOptimal,
    reason: !req.days ? "The manuscripts do not prescribe a specific day for this ritual." : !selectedDay ? `The manuscripts prescribe ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")}. Select one of these days.` : dayOptimal ? `Your selected day matches the manuscript prescription.` : `Your day is ${MIZAN_DAY_NAMES[selectedDay]}, but the manuscripts prescribe ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")} (${citations.map((c) => c.source).join("; ")}).`,
  });

  const planetOptimal = !req.planet || (selectedPlanet && req.planet.includes(MIZAN_TO_EN_PLANET[selectedPlanet]));
  if (req.planet && !planetOptimal) allOptimal = false;
  recommendations.push({
    field: "Selected Planet (Mizan 6)", icon: "orbit",
    current: selectedPlanet ? MIZAN_TO_EN_PLANET[selectedPlanet] || selectedPlanet : "Not selected",
    recommended: req.planet ? req.planet.join(" or ") : "No planet restriction in manuscripts",
    isOptimal: planetOptimal,
    reason: !req.planet ? "The manuscripts do not prescribe a specific planet for this ritual." : !selectedPlanet ? `The manuscripts prescribe ${req.planet.join(", ")}.` : planetOptimal ? `Your planet matches the manuscript.` : `Your planet is ${MIZAN_TO_EN_PLANET[selectedPlanet]}, but the manuscripts prescribe ${req.planet.join(", ")} (${citations.map((c) => c.source).join("; ")}).`,
  });

  const { hours: todayHours } = getTodayAllHours(cfgRefDate);
  const recommendedHourNumbers = req.hours ? findHoursByPlanet(todayHours, req.hours[0]).map((h) => h.hourNumber) : [];
  const hourOptimal = !req.hours || (selectedHour && recommendedHourNumbers.includes(selectedHour));
  if (req.hours && !hourOptimal) allOptimal = false;
  recommendations.push({
    field: "Selected Planetary Hour (Mizan 4)", icon: "clock",
    current: selectedHour ? `Hour #${selectedHour}` : "Not selected",
    recommended: recommendedHourNumbers.length > 0 ? `Hour #${recommendedHourNumbers.join(" or #")}` : (req.hours ? req.hours.join(" hour") : "No hour restriction in manuscripts"),
    isOptimal: hourOptimal,
    reason: !req.hours ? "The manuscripts do not prescribe a specific hour for this ritual." : !selectedHour ? `The manuscripts prescribe ${req.hours.join(", ")} hour(s). Today at: ${base.bestWindowsToday?.map((w) => `${w.startTime}–${w.endTime}`).join(", ") || "none remain"}.` : hourOptimal ? `Your hour matches the manuscript.` : `Your hour is #${selectedHour}, but the manuscripts prescribe ${req.hours.join(", ")} (${citations.map((c) => c.source).join("; ")}).`,
  });

  recommendations.push({
    field: "Selected Element (Mizan 2)", icon: "flame",
    current: dominant || "Not detected",
    recommended: req.element || "Based on your input text",
    isOptimal: !req.element || dominant === req.element,
    reason: !req.element ? "No element restriction in manuscripts for this ritual." : dominant === req.element ? "Your element matches the manuscript." : `The manuscripts recommend the ${req.element} element for this work (${citations.map((c) => c.source).join("; ")}).`,
  });
  if (req.element && dominant !== req.element) allOptimal = false;

  recommendations.push({
    field: "Day / Night (Mizan 3)", icon: "sunset",
    current: dayNight ? (dayNight === "gunduz" ? "Day" : "Night") : "Not selected",
    recommended: req.nightRequired === true ? "Night (Gece)" : "No night restriction in manuscripts",
    isOptimal: req.nightRequired !== true || dayNight === "gece",
    reason: req.nightRequired === true ? (dayNight === "gece" ? "You selected Night, as required." : "The manuscripts require night (Gece).") : "The manuscripts do not require a specific day/night for this ritual.",
  });
  if (req.nightRequired === true && dayNight !== "gece") allOptimal = false;

  const currentClock = now.toLocaleTimeString("en-US", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" });
  recommendations.push({
    field: "Best Time to Perform (Today)", icon: "timer",
    current: `Now: ${currentClock}`,
    recommended: bestWindow ? `${bestWindow.startTime}–${bestWindow.endTime}` : (base.nextOpportunity ? `${base.nextOpportunity.startTime}–${base.nextOpportunity.endTime} (${base.nextOpportunity.dayName})` : "No valid time in 14 days"),
    isOptimal: bestWindow && base.currentMomentSuitable,
    reason: !bestWindow ? `No valid window today. Earliest opportunity: ${base.nextOpportunity ? `${base.nextOpportunity.dayName} ${base.nextOpportunity.startTime}` : "none in 14 days"}.` : base.currentMomentSuitable ? `Current moment is within an optimal window (${bestWindow.startTime}–${bestWindow.endTime}).` : `Wait until ${bestWindow.startTime}–${bestWindow.endTime} (${bestWindow.planet} hour) for full manuscript alignment.`,
  });
  if (bestWindow && !base.currentMomentSuitable) allOptimal = false;

  recommendations.push({
    field: "Direction", icon: "compass",
    current: "Not selected",
    recommended: req.direction || "No direction restriction in manuscripts",
    isOptimal: true,
    reason: req.direction ? `The manuscripts prescribe facing ${req.direction} (${citations.map((c) => c.source).join("; ")}).` : "The manuscripts do not prescribe a direction for this ritual.",
  });

  recommendations.push({
    field: "Incense", icon: "wind",
    current: req.incense || "Not specified",
    recommended: req.incense || "No incense restriction in manuscripts",
    isOptimal: true,
    reason: req.incense ? `The manuscripts prescribe ${req.incense} (${citations.map((c) => c.source).join("; ")}).` : "The manuscripts do not prescribe a specific incense for this ritual.",
  });

  return { recommendations, allOptimal, base, noPurposeSelected };
}

// ═══════════════════════════════════════════════════════════════
// MOON COMPATIBILITY ANALYSIS — Optional, user-initiated
// ═══════════════════════════════════════════════════════════════
// Called by MoonAnalysisCard ONLY when the user presses "Analyze Moon
// Compatibility". Loads ONLY Moon rules (moonReq) for the current ritual.
// If no Moon rule exists in the manuscript, returns hasMoonRules: false —
// the ritual is NOT affected by Moon in any way.
// Never hardcodes Moon logic. Never generalizes Moon importance.
// Never reduces the main compatibility score.
// ═══════════════════════════════════════════════════════════════
export function analyzeMoonCompatibility({ moonReq, moonPhase, moonCitations }) {
  const hasMoonRules = !!(moonReq?.moon || moonReq?.zodiac || moonReq?.suitableMansions);

  if (!hasMoonRules) {
    return {
      hasMoonRules: false,
      message: "According to the manuscript, Moon conditions are NOT required for this ritual. Current Moon information is shown only as additional reference.",
      currentMoon: moonPhase ? { ...moonPhase } : null,
      checks: [],
      compatible: true,
      conclusion: "No Moon restriction — ritual timing is based on Day + Saat + Kawkab only.",
    };
  }

  const checks = [];
  let allPass = true;

  // 1. Moon Phase check (waxing / waning / new / full)
  if (moonReq.moon) {
    const ok = moonSatisfied(moonReq.moon, moonPhase.lunarDay);
    if (!ok) allPass = false;
    checks.push({
      dimension: "phase", label: "Moon Phase",
      currentValue: `Day ${moonPhase.lunarDay} (${moonPhase.phaseName})`,
      required: moonReq.moon,
      status: ok ? "pass" : "fail",
      reason: ok
        ? `Manuscript requires ${moonReq.moon} moon. Current moon satisfies this.`
        : `Manuscript requires ${moonReq.moon} moon. Current moon does NOT satisfy this.`,
    });
  }

  // 2. Moon Zodiac Sign check
  if (moonReq.zodiac && moonPhase.moonSign) {
    const ok = moonReq.zodiac.includes(moonPhase.moonSign.toLowerCase());
    if (!ok) allPass = false;
    checks.push({
      dimension: "sign", label: "Moon Zodiac Sign",
      currentValue: `${moonPhase.moonSignSymbol || ""} ${moonPhase.moonSign}`,
      required: moonReq.zodiac.join(", "),
      status: ok ? "pass" : "fail",
      reason: ok
        ? `Manuscript prescribes zodiac ${moonReq.zodiac.join(", ")}. Current moon sign matches.`
        : `Manuscript prescribes zodiac ${moonReq.zodiac.join(", ")}. Current moon sign is ${moonPhase.moonSign}.`,
    });
  } else if (moonReq.zodiac && !moonPhase.moonSign) {
    checks.push({
      dimension: "sign", label: "Moon Zodiac Sign",
      currentValue: "Unavailable",
      required: moonReq.zodiac.join(", "),
      status: "neutral",
      reason: "Live moon sign data unavailable from Astro Clock.",
    });
  }

  // 3. Moon Mansion (Manzil) check
  if (moonReq.suitableMansions && moonPhase.moonMansion) {
    const ok = moonReq.suitableMansions.some(m =>
      String(m).toLowerCase() === String(moonPhase.moonMansion).toLowerCase() ||
      String(m) === String(moonPhase.moonMansionNumber)
    );
    if (!ok) allPass = false;
    checks.push({
      dimension: "mansion", label: "Moon Mansion (Manzil)",
      currentValue: moonPhase.moonMansionArabic
        ? `${moonPhase.moonMansionArabic} (${moonPhase.moonMansion})`
        : moonPhase.moonMansion,
      required: moonReq.suitableMansions.join(", "),
      status: ok ? "pass" : "fail",
      reason: ok
        ? `Manuscript prescribes mansions ${moonReq.suitableMansions.join(", ")}. Current mansion matches.`
        : `Manuscript prescribes mansions ${moonReq.suitableMansions.join(", ")}. Current mansion is ${moonPhase.moonMansion}.`,
    });
  } else if (moonReq.suitableMansions && !moonPhase.moonMansion) {
    checks.push({
      dimension: "mansion", label: "Moon Mansion (Manzil)",
      currentValue: "Unavailable",
      required: moonReq.suitableMansions.join(", "),
      status: "neutral",
      reason: "Live moon mansion data unavailable from Astro Clock.",
    });
  }

  return {
    hasMoonRules: true,
    currentMoon: moonPhase ? { ...moonPhase } : null,
    checks,
    compatible: allPass,
    citations: moonCitations || [],
    conclusion: allPass
      ? "Moon conditions are compatible with this ritual."
      : "Moon conditions are NOT compatible with this ritual.",
  };
}

// ═══════════════════════════════════════════════════════════════
// FIND NEXT SUITABLE MOON TIME — Optional, user-initiated
// ═══════════════════════════════════════════════════════════════
// Searches up to 30 days for the next date where ALL Moon conditions
// (from moonReq) are satisfied. Also finds the best Day + Saat on that
// date using the main req. Returns null if no suitable date found.
// Never called automatically — only by MoonAnalysisCard toggle.
// ═══════════════════════════════════════════════════════════════
export function findNextSuitableMoonTime({ req, moonReq, fromDate, filters }) {
  const effectiveMoonReq = { ...moonReq, ...(filters || {}) };
  const hasMoonRules = !!(effectiveMoonReq.moon || effectiveMoonReq.zodiac || effectiveMoonReq.suitableMansions);
  if (!hasMoonRules) return null;

  const SEARCH_DAYS = 30;
  for (let d = 1; d < SEARCH_DAYS; d++) {
    const date = new Date(fromDate.getTime() + d * 24 * 60 * 60 * 1000);
    const moon = getMoonPhase(date);

    // Check all Moon conditions
    let moonOk = true;
    if (effectiveMoonReq.moon && !moonSatisfied(effectiveMoonReq.moon, moon.lunarDay)) moonOk = false;
    if (effectiveMoonReq.zodiac && moon.moonSign && !effectiveMoonReq.zodiac.includes(moon.moonSign.toLowerCase())) moonOk = false;
    if (effectiveMoonReq.suitableMansions && moon.moonMansion) {
      const mansionOk = effectiveMoonReq.suitableMansions.some(m =>
        String(m).toLowerCase() === String(moon.moonMansion).toLowerCase() ||
        String(m) === String(moon.moonMansionNumber)
      );
      if (!mansionOk) moonOk = false;
    }
    if (!moonOk) continue;

    // Moon conditions satisfied — find best Day + Saat on this date
    const { hours, sunrise, sunset } = getTodayAllHours(date);
    const dayKey = DAY_KEY_BY_INDEX[getActiveWeekday(date, sunrise, sunset)];
    const dayOk = !req?.days || req.days.includes(dayKey);
    if (!dayOk) continue;

    let bestHour = null;
    for (const h of hours) {
      if (req?.hours && !req.hours.map((p) => p.toLowerCase()).includes(h.planet)) continue;
      if (req?.nightRequired === true && h.period !== "night") continue;
      if (req?.worstHours && req.worstHours.map((p) => p.toLowerCase()).includes(h.planet)) continue;
      if (req?.enemyPlanets && req.enemyPlanets.map((p) => p.toLowerCase()).includes(h.planet)) continue;
      bestHour = h;
      break;
    }

    if (bestHour) {
      return {
        date: date.toISOString().split("T")[0],
        daysAhead: d,
        dayName: MIZAN_DAY_NAMES[dayKey],
        moonPhaseName: moon.phaseName,
        lunarDay: moon.lunarDay,
        moonSign: moon.moonSign,
        moonSignSymbol: moon.moonSignSymbol,
        moonMansion: moon.moonMansion,
        moonMansionArabic: moon.moonMansionArabic,
        moonIllumination: moon.moonIllumination,
        bestHour: bestHour.hourNumber,
        bestHourPlanet: capitalPlanet(bestHour.planet),
        bestHourStart: bestHour.startTime,
        bestHourEnd: bestHour.endTime,
        confidence: 85,
      };
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// PLAN RITUAL BY MOON — User-controlled future Moon planning
// ═══════════════════════════════════════════════════════════════
// Called by MoonAnalysisCard ONLY when the user selects "Plan Ritual
// by Moon" and chooses desired Moon conditions (Mansion/Zodiac/Phase).
//
// Searches up to 60 days (~2 Moon cycles) for when the Moon enters
// the user's desired condition. At each matching day, evaluates ALL
// manuscript conditions simultaneously:
//   ✓ Day (req.days)
//   ✓ Saat (req.hours, avoiding worstHours)
//   ✓ Kawkab (planetary ruler of the Saat)
//   ✓ Moon (satisfied by definition — user selected it)
//   ✓ Nahas (worstDays, worstHours, enemyPlanets)
//   ✓ Manuscript Moon rules (moonReq, if they exist)
//
// Returns:
//   { found: true, firstMatch, recommendedTime, searchedDays }
//   — firstMatch: the first time Moon enters the desired condition (with full ✓/✗ evaluation)
//   — recommendedTime: the first time ALL conditions are simultaneously satisfied
//   — If no fully compatible time found in 60 days, found=false and recommendedTime=null
//
// Moon alone NEVER approves a ritual. A future time is valid ONLY when
// ALL required manuscript conditions are simultaneously satisfied.
// ═══════════════════════════════════════════════════════════════
export function planRitualByMoon({ req, moonReq, desiredMansion, desiredZodiac, desiredPhase, fromDate }) {
  // No fixed limit — search until a fully compatible time is found.
  // 365 days (1 year, ~12+ Moon cycles) is a safety cap only; if no match
  // exists in a year, the conditions are genuinely incompatible.
  const MAX_SEARCH_DAYS = 365;
  let firstMatch = null;

  for (let d = 1; d <= MAX_SEARCH_DAYS; d++) {
    const date = new Date(fromDate.getTime() + d * 24 * 60 * 60 * 1000);
    const moon = getMoonPhase(date);

    // ── Check if Moon matches user's desired conditions ──
    let moonMatch = true;
    if (desiredPhase === "waxing" && !moon.isWaxing) moonMatch = false;
    if (desiredPhase === "waning" && !moon.isWaning) moonMatch = false;
    if (desiredZodiac && moon.moonSign && desiredZodiac.toLowerCase() !== moon.moonSign.toLowerCase()) moonMatch = false;
    if (desiredMansion) {
      const mansionOk = String(desiredMansion) === String(moon.moonMansionNumber) ||
                        String(desiredMansion).toLowerCase() === String(moon.moonMansion).toLowerCase();
      if (!mansionOk) moonMatch = false;
    }
    if (!moonMatch) continue;

    // ── Moon matches! Evaluate ALL conditions on this day ──
    const { hours, sunrise, sunset } = getTodayAllHours(date);
    const dayIndex = getActiveWeekday(date, sunrise, sunset);
    const dayKey = DAY_KEY_BY_INDEX[dayIndex];

    const checks = [];
    let allPass = true;

    // 1. Day check
    if (req?.days) {
      const dayOk = req.days.includes(dayKey);
      if (!dayOk) allPass = false;
      checks.push({
        dimension: "day", label: "Day",
        status: dayOk ? "pass" : "fail",
        current: MIZAN_DAY_NAMES[dayKey],
        required: req.days.map(dd => MIZAN_DAY_NAMES[dd]).join(", "),
        reason: dayOk ? "Day is suitable." : "The Day is prohibited.",
      });
    } else {
      checks.push({
        dimension: "day", label: "Day",
        status: "pass", current: MIZAN_DAY_NAMES[dayKey], required: "Any",
        reason: "No day restriction — Day is suitable.",
      });
    }

    // 2. Nahas (worst day) check
    if (req?.worstDays && req.worstDays.length > 0) {
      const isWorstDay = req.worstDays.includes(dayKey);
      if (isWorstDay) allPass = false;
      checks.push({
        dimension: "nahas_day", label: "Nahas (Day)",
        status: isWorstDay ? "fail" : "pass",
        current: MIZAN_DAY_NAMES[dayKey],
        required: "Avoid: " + req.worstDays.map(dd => MIZAN_DAY_NAMES[dd]).join(", "),
        reason: isWorstDay ? "Nahas restriction exists." : "No Nahas restriction on this day.",
      });
    }

    // 3. Find best Saat on this day (satisfies hours, night, avoids worst/enemy)
    let bestHour = null;
    for (const h of hours) {
      if (req?.hours && !req.hours.map(p => p.toLowerCase()).includes(h.planet)) continue;
      if (req?.nightRequired === true && h.period !== "night") continue;
      if (req?.worstHours && req.worstHours.map(p => p.toLowerCase()).includes(h.planet)) continue;
      if (req?.enemyPlanets && req.enemyPlanets.map(p => p.toLowerCase()).includes(h.planet)) continue;
      bestHour = h;
      break;
    }

    // 4. Saat check
    const saatOk = !!bestHour;
    if (!saatOk) allPass = false;
    checks.push({
      dimension: "saat", label: "Saat",
      status: saatOk ? "pass" : "fail",
      current: bestHour ? `#${bestHour.hourNumber} (${capitalPlanet(bestHour.planet)})` : "None available",
      required: req?.hours ? req.hours.join(", ") : "Any",
      reason: saatOk ? "Saat is suitable." : "No suitable Saat found on this day.",
    });

    // 5. Kawkab check (ruling planet of the Saat)
    if (bestHour) {
      const kawkabOk = !req?.hours || req.hours.map(p => p.toLowerCase()).includes(bestHour.planet);
      if (!kawkabOk) allPass = false;
      checks.push({
        dimension: "kawkab", label: "Kawkab",
        status: kawkabOk ? "pass" : "fail",
        current: capitalPlanet(bestHour.planet),
        required: req?.hours ? req.hours.join(", ") : "Any",
        reason: kawkabOk ? "Kawkab is suitable." : "Kawkab does not match prescription.",
      });

      // 6. Nahas (hour) check
      const hasNahasHour = (req?.worstHours && req.worstHours.length > 0) || (req?.enemyPlanets && req.enemyPlanets.length > 0);
      if (hasNahasHour) {
        const isWorstHour = (req?.worstHours && req.worstHours.map(p => p.toLowerCase()).includes(bestHour.planet)) ||
                            (req?.enemyPlanets && req.enemyPlanets.map(p => p.toLowerCase()).includes(bestHour.planet));
        if (isWorstHour) allPass = false;
        checks.push({
          dimension: "nahas_hour", label: "Nahas (Hour)",
          status: isWorstHour ? "fail" : "pass",
          current: capitalPlanet(bestHour.planet),
          required: "Avoid enemy/worst planets",
          reason: isWorstHour ? "Nahas restriction exists." : "No Nahas restriction on this hour.",
        });
      }
    }

    // 7. Moon check (satisfied by definition — user selected this condition)
    checks.push({
      dimension: "moon", label: "Moon",
      status: "pass",
      current: moon.moonMansion ? `${moon.moonMansion} / ${moon.moonSign || "—"}` : moon.moonSign || "—",
      required: "User-selected condition",
      reason: "Moon requirement satisfied.",
    });

    // 8. Manuscript Moon rules (if they exist for this ritual)
    const hasMsMoonRules = !!(moonReq?.moon || moonReq?.zodiac || moonReq?.suitableMansions);
    if (hasMsMoonRules) {
      let moonRuleOk = true;
      if (moonReq.moon && !moonSatisfied(moonReq.moon, moon.lunarDay)) moonRuleOk = false;
      if (moonReq.zodiac && moon.moonSign && !moonReq.zodiac.includes(moon.moonSign.toLowerCase())) moonRuleOk = false;
      if (moonReq.suitableMansions && moon.moonMansion) {
        const mOk = moonReq.suitableMansions.some(m =>
          String(m).toLowerCase() === String(moon.moonMansion).toLowerCase() ||
          String(m) === String(moon.moonMansionNumber)
        );
        if (!mOk) moonRuleOk = false;
      }
      if (!moonRuleOk) allPass = false;
      checks.push({
        dimension: "moon_rule", label: "Manuscript Moon Rule",
        status: moonRuleOk ? "pass" : "fail",
        current: moon.moonMansion ? `${moon.moonMansion} / ${moon.moonSign || "—"}` : "—",
        required: "Per manuscript",
        reason: moonRuleOk ? "Manuscript Moon restriction satisfied." : "Manuscript Moon restriction NOT satisfied.",
      });
    }

    // 9. Night requirement check
    if (req?.nightRequired === true) {
      const nightOk = bestHour && bestHour.period === "night";
      if (!nightOk) allPass = false;
      checks.push({
        dimension: "night", label: "Day / Night",
        status: nightOk ? "pass" : "fail",
        current: bestHour ? (bestHour.period === "night" ? "Night" : "Day") : "—",
        required: "Night",
        reason: nightOk ? "Night, as required." : "Manuscript requires night but no night Saat available.",
      });
    }

    // ── Nahas Status summary ──
    const nahasActive = (req?.worstDays && req.worstDays.includes(dayKey)) ||
      (bestHour && req?.worstHours && req.worstHours.map(p => p.toLowerCase()).includes(bestHour.planet)) ||
      (bestHour && req?.enemyPlanets && req.enemyPlanets.map(p => p.toLowerCase()).includes(bestHour.planet));
    const nahasStatus = nahasActive
      ? "Nahas restriction exists — this time is blocked."
      : "No Nahas restriction found.";

    // ── Build result for this match ──
    const monthName = date.toLocaleString("en-US", { month: "long" });
    const matchResult = {
      date: date.toISOString().split("T")[0],
      dateObj: date,
      dayName: MIZAN_DAY_NAMES[dayKey],
      monthName,
      dayNumber: date.getDate(),
      year: date.getFullYear(),
      timeStr: bestHour ? bestHour.startTime : "—",
      timeEnd: bestHour ? bestHour.endTime : null,
      hourNumber: bestHour?.hourNumber || null,
      hourPlanet: bestHour ? capitalPlanet(bestHour.planet) : null,
      moon: { ...moon },
      checks,
      allPass,
      bestHour,
      nahasStatus,
    };

    // Record first match (always)
    if (!firstMatch) firstMatch = matchResult;

    // If ALL conditions pass, this is the recommended time — stop searching
    if (allPass) {
      return { found: true, firstMatch, recommendedTime: matchResult, searchedDays: d };
    }
  }

  // No fully compatible time found within the safety cap
  return { found: false, firstMatch, recommendedTime: null, searchedDays: MAX_SEARCH_DAYS };
}