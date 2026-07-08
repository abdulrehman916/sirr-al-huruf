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
import { ACTION_RULES } from "./astroClockActionTimingAdvisor.js";

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

// Ritual keyword table (en + ml + ar) → ritualKey
const RITUAL_KEYWORDS = [
  { key: "love",        en: ["love", "romance", "marriage", "union"],                       ml: ["പ്രണയം", "വിവാഹം"],                    ar: ["محبة", "حب", "زواج"] },
  { key: "attraction",  en: ["attraction", "draw", "pull toward", "compel"],                ml: ["ആകർഷണം"],                               ar: ["جلب", "تهييج"] },
  { key: "animal_attraction", en: ["animal", "beast", "wild animal", "hunt", "cattle"],     ml: ["മൃഗം", "വന്യമൃഗം", "വേട്ട"],           ar: ["حيوان", "وحش", "صيد", "بهيمة"] },
  { key: "separation",  en: ["separation", "divorce", "banish", "breakup"],                  ml: ["വേർപിരിവ്", "വിവാഹമോചനം"],            ar: ["فرقة", "طرد", "فراق", "طلاق"] },
  { key: "protection",  en: ["protection", "safety", "evil eye", "ward", "shield"],          ml: ["സംരക്ഷണം", "ദൃഷ്ടി"],                   ar: ["حماية", "عين", "أمان", "تحصين"] },
  { key: "wealth",      en: ["wealth", "money", "livelihood", "prosperity", "provision"],    ml: ["സമ്പത്ത്", "ധനം", "ഉപജീവനം"],          ar: ["رزق", "مال", "غنى"] },
  { key: "knowledge",   en: ["knowledge", "study", "learning", "wisdom", "education"],      ml: ["അറിവ്", "പഠനം", "വിജ്ഞാനം"],           ar: ["علم", "حكمة", "دراسة"] },
  { key: "healing",     en: ["healing", "health", "recovery", "cure", "medicine"],          ml: ["ചികിത്സ", "ആരോഗ്യം", "സുഖം"],          ar: ["شفاء", "صحة", "علاج"] },
  { key: "enemy",       en: ["enemy", "harm", "destruction", "attack", "fire"],              ml: ["ശത്രു", "നാശം", "ഉപദ്രവം"],            ar: ["عداوة", "ضرر", "هلاك", "حريق"] },
  { key: "travel",      en: ["travel", "journey", "voyage"],                                 ml: ["യാത്ര"],                                  ar: ["سفر", "رحلة"] },
  { key: "spiritual",   en: ["spiritual", "meditation", "divine", "worship", "dhikr"],       ml: ["ആത്മീയ", "ധ്യാനം", "ആരാധന"],           ar: ["روحاني", "تأمل", "عبادة", "ذكر"] },
  { key: "jinn",        en: ["jinn", "spirit", "conjuration", "summon"],                     ml: ["ജിൻ"],                                   ar: ["جن", "روحاني"] },
  { key: "planetary",   en: ["planetary", "planet work", "planetary ritual"],                ml: ["ഗ്രഹ"],                                   ar: ["كوكب", "گراه"] },
];

// Map ritualKey → ACTION_RULES key (JS fallback)
const RITUAL_TO_ACTION = {
  love: "love", attraction: "love", animal_attraction: "love",
  marriage: "marriage", separation: "spiritual", protection: "spiritual",
  wealth: "business", knowledge: "study", healing: "healing", enemy: "spiritual",
  travel: "travel", spiritual: "spiritual", jinn: "spiritual", planetary: "spiritual",
  general: "spiritual",
};

// ═══════════════════════════════════════════════════════════════
// STEP 1 — Identify the ritual from user's Mizan selections + custom purpose
// Priority: Mizan purpose keys → multilingual keyword match → ManuscriptRule category
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

  // ── PRIORITY 3: Arabic text without dictionary match → DO NOT GUESS ──
  // If the custom purpose contains Arabic characters but the dictionary
  // did not match, we must NOT fall back to literal keyword matching.
  // Return null so the engine uses a "general" context with no purpose.
  const hasArabic = /[\u0600-\u06FF]/.test(custom);
  if (hasArabic && custom) {
    return {
      ritualKey: null,
      matchedOn: "Arabic purpose not found in Purpose Dictionary — no guess",
      semanticMeaningEn: "",
      semanticMeaningMl: "",
    };
  }

  // ── PRIORITY 4: Keyword match for non-Arabic text (English/Malayalam) ──
  const haystacks = [custom, ...purposes].filter(Boolean);
  const haystack = haystacks.join(" ").toLowerCase();

  // Keyword match across en/ml/ar
  for (const r of RITUAL_KEYWORDS) {
    for (const kw of [...r.en, ...r.ml, ...r.ar]) {
      if (haystack.includes(kw.toLowerCase())) {
        return { ritualKey: r.key, matchedOn: `keyword "${kw}"` };
      }
    }
  }

  // Fall back to category inferred from ManuscriptRule availability
  if (manuscriptRules && manuscriptRules.length > 0) {
    const cats = {};
    for (const r of manuscriptRules) cats[r.category] = (cats[r.category] || 0) + 1;
    for (const [cat, key] of Object.entries(CATEGORY_TO_RITUAL)) {
      if (cats[cat] && key !== "general") return { ritualKey: key, matchedOn: `ManuscriptRule category ${cat}` };
    }
  }

  return { ritualKey: "general", matchedOn: "no explicit match — general ritual" };
}

// ═══════════════════════════════════════════════════════════════
// STEP 2 — Gather rules: DB first, JS fallback. Never invent.
// ═══════════════════════════════════════════════════════════════
function gatherRules(ritualKey, manuscriptRules, purposeSelected) {
  const dbRules = (manuscriptRules || []).filter((r) => {
    const cat = CATEGORY_TO_RITUAL[r.category];
    return cat === ritualKey || (cat === "general" && r.subcategory && r.subcategory.toLowerCase().includes(ritualKey));
  });

  // Build requirements from DB rules (priority) then JS fallback
  const req = {
    days: null,           // array of day keys e.g. ['fri','thu']
    hours: null,          // array of planet names
    worstDays: null,
    worstHours: null,
    moon: null,           // 'waxing' | 'waning' | 'full' | 'new' | null
    zodiac: null,         // array of signs
    planet: null,         // array of planets
    direction: null,
    incense: null,
    element: null,
    nightRequired: null,  // bool
    enemyPlanets: [],
    suitableMansions: null,
  };
  const citations = [];

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
      if (dj.moon) { req.moon = String(dj.moon).toLowerCase(); citations.push({ ...cite, field: "moon", value: req.moon }); }
      if (Array.isArray(dj.zodiac) && dj.zodiac.length) { req.zodiac = dj.zodiac.map((z) => String(z).toLowerCase()); citations.push({ ...cite, field: "zodiac", value: req.zodiac.join(", ") }); }
      if (Array.isArray(dj.planet) && dj.planet.length) { req.planet = dj.planet.map((p) => capitalPlanet(p)); citations.push({ ...cite, field: "planet", value: req.planet.join(", ") }); }
      if (dj.direction) { req.direction = dj.direction; citations.push({ ...cite, field: "direction", value: dj.direction }); }
      if (dj.incense) { req.incense = dj.incense; citations.push({ ...cite, field: "incense", value: dj.incense }); }
      if (dj.element) { req.element = String(dj.element).toLowerCase(); citations.push({ ...cite, field: "element", value: dj.element }); }
      if (typeof dj.nightRequired === "boolean") { req.nightRequired = dj.nightRequired; citations.push({ ...cite, field: "night", value: String(dj.nightRequired) }); }
      if (Array.isArray(dj.enemyPlanets) && dj.enemyPlanets.length) req.enemyPlanets = dj.enemyPlanets.map((p) => capitalPlanet(p));
      if (Array.isArray(dj.suitableMansions) && dj.suitableMansions.length) req.suitableMansions = dj.suitableMansions;
    }
  }

  // ── JS fallback — ONLY when manuscript has absolutely no rule for this ritual ──
  // When a purpose is selected, use manuscript rules exclusively. No JS knowledge,
  // no fallback spiritual recommendations, no invented recommendations.
  // JS fallback only when manuscript has zero rules (dbRules.length === 0).
  const actionKey = RITUAL_TO_ACTION[ritualKey] || "spiritual";
  const allowJsFallback = !purposeSelected || dbRules.length === 0;
  if (allowJsFallback) {
    const ar = ACTION_RULES[actionKey];
    if (ar) {
      if (!req.days && ar.bestDays?.length) req.days = ar.bestDays.map((d) => dayKeyFromName(d.day));
      if (!req.hours && ar.bestHours?.length) req.hours = ar.bestHours.map((h) => h);
      if (!req.worstDays && ar.worstDays?.length) req.worstDays = ar.worstDays.map((d) => dayKeyFromName(d.day));
      if (!req.worstHours && ar.worstHours?.length) req.worstHours = ar.worstHours.map((h) => h);
      if (!req.enemyPlanets && ar.enemyPlanets?.length) req.enemyPlanets = ar.enemyPlanets.map((p) => p);
      if (!req.suitableMansions && ar.suitableMansions?.length) req.suitableMansions = ar.suitableMansions;
      if (ar.sources?.length) {
        for (const s of ar.sources) {
          citations.push({ rule_id: `JS_${actionKey}`, source: `${s.book} p.${s.page}`, summary: ar.category, category: "JS_KNOWLEDGE_BASE" });
        }
      }
    }
  }

  return { req, citations, dbRuleCount: dbRules.length, actionKey };
}

// ═══════════════════════════════════════════════════════════════
// Astronomy helpers (pure math, read-only)
// ═══════════════════════════════════════════════════════════════
function getMoonPhase(date) {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const lunarCycleMs = 29.53059 * 24 * 60 * 60 * 1000;
  const cycles = (date.getTime() - knownNewMoon) / lunarCycleMs;
  const frac = cycles - Math.floor(cycles);
  const lunarDay = Math.floor(frac * 29.53) + 1;
  return {
    lunarDay,
    isWaxing: lunarDay <= 14,
    isWaning: lunarDay > 14,
    isNewMoon: lunarDay >= 27 || lunarDay <= 1,
    isFullMoon: lunarDay >= 13 && lunarDay <= 16,
    phaseName: lunarDay <= 14 ? "Waxing" : "Waning",
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
    const moon = getMoonPhase(date);

    // Day rule check
    if (req.days && !req.days.includes(dayKey)) continue;
    // Moon rule check
    if (!moonSatisfied(req.moon, moon.lunarDay)) continue;

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
        lunarDay: moon.lunarDay,
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

  // 6. Moon Phase
  if (req.moon) {
    const moonOk = moonSatisfied(req.moon, moonPhase.lunarDay);
    if (!moonOk) allPass = false;
    breakdown.push({
      dimension: "moon", label: "Moon Phase",
      currentValue: `Day ${moonPhase.lunarDay} (${moonPhase.phaseName})`,
      status: moonOk ? "pass" : "fail",
      reason: moonOk
        ? `The manuscript requires ${req.moon} moon. Current moon satisfies this.`
        : `The manuscript requires ${req.moon} moon. Current moon does not satisfy this.`,
      source: citeFor("moon"),
      recommended: moonOk ? null : req.moon,
    });
  } else {
    breakdown.push({ dimension: "moon", label: "Moon Phase", currentValue: `Day ${moonPhase.lunarDay} (${moonPhase.phaseName})`, status: "neutral", reason: "No manuscript rule exists for this condition.", source: null, recommended: null });
  }

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

  // 8. Zodiac (informational — not selectable in Mizan)
  if (req.zodiac) {
    breakdown.push({
      dimension: "zodiac", label: "Zodiac",
      currentValue: "Not selectable in Mizan",
      status: "neutral",
      reason: `The manuscript prescribes zodiac: ${req.zodiac.join(", ")}. This is not selectable in Mizan — verify manually.`,
      source: citeFor("zodiac"),
      recommended: req.zodiac.join(", "),
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
  const { req, citations, dbRuleCount, actionKey } = gatherRules(effectiveRitualKey, manuscriptRules, !noPurposeSelected);
  reasoning.push(`ManuscriptRule DB: ${dbRuleCount} matching rule(s). JS fallback: ${(!noPurposeSelected && dbRuleCount > 0) ? "skipped (purpose selected, manuscript-only)" : actionKey}.`);
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

  reasoning.push(`Current: ${MIZAN_DAY_NAMES[currentDayKey]}, hour #${currentHourInfo.hourNumber} (${currentHourInfo.planet}), moon day ${moonPhase.lunarDay}, ${isNightTime ? "night" : "day"}.`);

  // ── Evaluate current moment against found rules ONLY ──
  const currentHourOk = !req.hours || req.hours.map((p) => p.toLowerCase()).includes(currentHourInfo.planet);
  const currentDayOk = !req.days || req.days.includes(currentDayKey);
  const currentMoonOk = moonSatisfied(req.moon, moonPhase.lunarDay);
  const currentNightOk = req.nightRequired !== true || isNightTime;
  const currentNotEnemy = !req.enemyPlanets || !req.enemyPlanets.map((p) => p.toLowerCase()).includes(currentHourInfo.planet);
  const currentNotWorst = !req.worstHours || !req.worstHours.map((p) => p.toLowerCase()).includes(currentHourInfo.planet);
  const currentMomentSuitable = currentHourOk && currentDayOk && currentMoonOk && currentNightOk && currentNotEnemy && currentNotWorst;

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
    const moonOk = moonSatisfied(req.moon, moonPhase.lunarDay);
    if (anyOk && dayOk && moonOk) canPerformToday = "Limited";
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
      if (moonSatisfied(req.moon, moonPhase.lunarDay)) { s += 8; r.push("moon condition satisfied"); }
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
  if (currentMoonOk && req.moon) { score += 10; scoreReasons.push("Moon condition met (+10)"); } else if (!currentMoonOk && req.moon) { score -= 10; scoreReasons.push("Moon condition unmet (-10)"); }
  if (currentNightOk && req.nightRequired === true) { score += 10; scoreReasons.push("Night requirement met (+10)"); }
  if (currentNotEnemy && req.enemyPlanets?.length) { score += 5; scoreReasons.push("Not enemy hour (+5)"); }
  score = Math.max(0, Math.min(100, score));

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
  if (req.moon && !currentMoonOk) warnings.push(`Moon condition (${req.moon}) not satisfied today (lunar day ${moonPhase.lunarDay}).`);
  if (req.nightRequired === true && !isNightTime) warnings.push("Manuscript requires night, but it is currently day.");
  if (req.worstHours && currentNotWorst === false) warnings.push(`Current hour is a worst/enemy hour: ${capitalPlanet(currentHourInfo.planet)}.`);

  // ── Astro Clock status ──
  const astroClockStatus = {
    day: MIZAN_DAY_NAMES[currentDayKey], dayRuler: dayRuler.planet,
    currentHour: { number: currentHourInfo.hourNumber, planet: capitalPlanet(currentHourInfo.planet), symbol: PLANET_INFO[currentHourInfo.planet]?.symbol || "" },
    isDaytime: !isNightTime, hourRemaining: currentHourInfo.remainingTime,
    nextPlanet: PLANET_SEQUENCE[(PLANET_SEQUENCE.indexOf(currentHourInfo.planet) + 1) % 7] || "",
    moonPhase: `Day ${moonPhase.lunarDay} (${moonPhase.phaseName})`,
    summary: `Today is ${MIZAN_DAY_NAMES[currentDayKey]} (ruled by ${dayRuler.planet}). Current hour #${currentHourInfo.hourNumber} (${currentHourInfo.planet}), ${isNightTime ? "night" : "day"}, ${currentHourInfo.remainingTime} left. Moon: day ${moonPhase.lunarDay} (${moonPhase.phaseName}).`,
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
  const ritualTypeLabel = identified.semanticMeaningEn
    ? identified.semanticMeaningEn
    : effectiveRitualKey.charAt(0).toUpperCase() + effectiveRitualKey.slice(1) + " Work";

  report.push({
    section: "TODAY ANALYSIS", icon: "calendar", status: canPerformToday,
    body: canPerformToday === "Yes" ? `Yes — the current conditions satisfy every manuscript rule found for this ritual. You may proceed now.`
      : canPerformToday === "Limited" ? `Today is partially suitable — some valid hours remain, but the current moment is not ideal.`
      : `No — today does not satisfy the manuscript rules for this ritual. ${req.days ? `Prescribed day(s): ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")}.` : ""}`,
    citation: citations.map((c) => c.source).join("; ") || "ManuscriptRule + JS knowledge base",
    consequence: "Proceeding against manuscript rules weakens or reverses the ritual.",
  });

  report.push({
    section: "CURRENT MOMENT", icon: "clock", status: currentMomentSuitable ? "Suitable" : "Not suitable",
    body: currentMomentSuitable
      ? `The current moment satisfies all found manuscript rules: hour ${capitalPlanet(currentHourInfo.planet)}, ${isNightTime ? "night" : "day"}, moon day ${moonPhase.lunarDay}. Act now.`
      : `The current moment does NOT satisfy all manuscript rules. Hour: ${capitalPlanet(currentHourInfo.planet)}. ${!currentHourOk ? `Prescribed hours: ${req.hours.join(", ")}.` : ""} ${!currentMoonOk ? `Moon condition (${req.moon}) unmet.` : ""} ${!currentNightOk ? "Night required." : ""} ${earliest ? `Earliest valid opportunity: ${earliest.dayName}${earliest.isToday ? " (today)" : ""} at ${earliest.startTime}–${earliest.endTime} (${earliest.planet}).` : ""}`,
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
      enemyMoonPhases: req.moon ? [req.moon === "waxing" ? "Waning" : "Waxing"] : [],
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
      ? `Earliest valid opportunity: ${earliest.dayName}${earliest.isToday ? " (today)" : ` (${earliest.daysAhead} day(s) ahead)`}, ${earliest.startTime}–${earliest.endTime} (${earliest.planet} hour, hour #${earliest.hour}), moon day ${earliest.lunarDay}. This is the first time all manuscript rules are simultaneously satisfied within the next 14 days.`
      : `No fully valid opportunity found within 14 days. Review the manuscript rules for exceptions.`,
    citation: citations.map((c) => c.source).join("; ") || "Manuscript rules",
    consequence: "Waiting for the earliest valid time ensures full ritual power.",
  });

  report.push({
    section: "ASTRO ANALYSIS", icon: "globe", status: `${astroClockStatus.day} / ${astroClockStatus.currentHour.planet}`,
    body: `Today is ${astroClockStatus.day}, ruled by ${dayRuler.planet}. Current hour #${currentHourInfo.hourNumber} (${currentHourInfo.planet}), ${isNightTime ? "night" : "day"}, ${currentHourInfo.remainingTime} left. Moon: day ${moonPhase.lunarDay} (${moonPhase.phaseName}). Overall manuscript strength: ${verdict} (${score}%).`,
    citation: "Live Astro Clock (read-only)",
    consequence: "Composite of all manuscript conditions.",
    details: { dayRuler: dayRuler.planet, currentHour: currentHourInfo, moonPhase, score, verdict },
  });

  report.push({
    section: "MANUSCRIPT EXPLANATION", icon: "book", status: `${rulesApplied.length} rules applied`,
    rules: rulesApplied,
    body: `Every recommendation is grounded in the ManuscriptRule database (priority) and the existing JS knowledge base (fallback). ${citations.length} rule citation(s) found for this ritual. No rule was invented: dimensions without a manuscript rule are reported as unrestricted.`,
    citation: "ManuscriptRule DB + JS knowledge base",
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
  if (dbRuleCount > 0) expertNarrative.push(`${dbRuleCount} manuscript rule(s) were found in the database for this ritual, supplemented by the JS knowledge base.`);
  else expertNarrative.push(`No matching rules were found in the ManuscriptRule database; recommendations fall back to the existing JS knowledge base (${actionKey}).`);
  if (req.days) expertNarrative.push(`The manuscripts prescribe day(s): ${req.days.map((d) => MIZAN_DAY_NAMES[d]).join(", ")}.`);
  if (req.hours) expertNarrative.push(`The manuscripts prescribe hour(s) ruled by: ${req.hours.join(", ")}.`);
  if (req.moon) expertNarrative.push(`The manuscripts require a ${req.moon} moon.`);
  if (req.nightRequired === true) expertNarrative.push(`The manuscripts require this work be performed at night.`);
  if (earliest) expertNarrative.push(`The earliest fully valid opportunity is ${earliest.dayName}${earliest.isToday ? " (today)" : ` (${earliest.daysAhead} day(s) away)`} at ${earliest.startTime}–${earliest.endTime}.`);
  if (!req.days && !req.hours && !req.moon) expertNarrative.push(`No specific day, hour, or moon restriction was found in the manuscripts for this ritual — timing is guided by the general planetary conditions only.`);

  return {
    report, consultation: report,
    noPurposeSelected,
    verdict, verdictColor, verdictReason, verdictStars: stars, verdictStarsString: starsToString(stars),
    confidenceScore: score, scoreBreakdown: scoreReasons,
    ritualType: ritualTypeLabel, ritualTypeDescription: "", ritualCategory: ritualTypeLabel, ritualIntent: ritualTypeLabel,
    ritualSemanticMl: identified.semanticMeaningMl || null,
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
      assessment: req.moon ? (moonSatisfied(req.moon, moonPhase.lunarDay) ? `Moon condition (${req.moon}) satisfied (day ${moonPhase.lunarDay}).` : `Moon condition (${req.moon}) NOT satisfied (day ${moonPhase.lunarDay}).`) : `No moon restriction in manuscripts (day ${moonPhase.lunarDay}).`,
      citation: "ManuscriptRule (if specified)",
    },
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
    zodiacSuitability: { assessed: !!req.zodiac, bestSigns: req.zodiac || [], note: req.zodiac ? `Manuscript prescribes zodiac: ${req.zodiac.join(", ")}` : "No zodiac restriction in manuscripts." },
    elementCompatibility: { assessed: !!req.element, status: "neutral", reason: req.element ? `Manuscript prescribes element: ${req.element}` : "No element restriction in manuscripts." },
    elementDirection: req.direction ? { dir: req.direction } : null,
    elementPlacement: null,
    astroClockStatus,
    liveNow,
    recommendedStart: ranked[0]?.startTime || earliest?.startTime || null,
    recommendedEnd: ranked[0]?.endTime || earliest?.endTime || null,
    recommendedIncense: req.incense || null,
    selectionAnalysis,
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
    field: "Moon Condition", icon: "moon",
    current: base.moonPhase.assessment,
    recommended: req.moon || "No moon restriction in manuscripts",
    isOptimal: !req.moon || moonSatisfied(req.moon, base.moonPhase.lunarDay),
    reason: !req.moon ? "The manuscripts do not prescribe a moon condition for this ritual — moon phase is ignored." : (moonSatisfied(req.moon, base.moonPhase.lunarDay) ? `Current moon satisfies the manuscript (${req.moon}).` : `Manuscript requires ${req.moon} moon; current is day ${base.moonPhase.lunarDay} (${citations.map((c) => c.source).join("; ")}).`),
  });
  if (req.moon && !moonSatisfied(req.moon, base.moonPhase.lunarDay)) allOptimal = false;

  recommendations.push({
    field: "Zodiac Sign", icon: "sparkles",
    current: "Not selected in Mizan",
    recommended: req.zodiac ? req.zodiac.join(", ") : "No zodiac restriction in manuscripts",
    isOptimal: true,
    reason: req.zodiac ? `The manuscripts prescribe zodiac sign(s): ${req.zodiac.join(", ")} (${citations.map((c) => c.source).join("; ")}).` : "The manuscripts do not prescribe a zodiac sign for this ritual.",
  });

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