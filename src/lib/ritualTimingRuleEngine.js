// ═══════════════════════════════════════════════════════════════
// RITUAL TIMING RULE ENGINE — READ-ONLY ANALYSIS LAYER
// ═══════════════════════════════════════════════════════════════
// PRIORITY ORDER (5-tier merge):
//   1. Existing Sirr al-Huruf project rules
//   2. Previously imported Astrology Clock manuscripts (Havâss'ın Derinlikleri, Ustad Taha)
//   3. Newly imported PDF: "الشروط" (Al-Shurut — The Conditions) pages 8–50
//   4. Current Mizan selections and calculated results
//   5. Live Astrology Clock data (current day, planetary hour, moon phase)
//
// This module is READ-ONLY. It NEVER modifies Mizan calculations or Astro Clock logic.
// It reads existing Mizan state + live time and produces a recommendation.
// ═══════════════════════════════════════════════════════════════

import { getCurrentPlanetaryHour, getDayRuler, PLANET_SEQUENCE, PLANET_INFO, getAllPlanetaryHours } from './astroClockLiveEngine.js';
import { ACTION_RULES } from './astroClockActionTimingAdvisor.js';

// ── Mizan key → English planet name (used by live engine) ──
const MIZAN_TO_EN_PLANET = {
  zuhal: 'Saturn', mustari: 'Jupiter', merih: 'Mars', sems: 'Sun',
  zuhre: 'Venus', utarid: 'Mercury', kamer: 'Moon',
};

// ── Mizan day key → day-of-week index (0=Sunday) ──
const MIZAN_DAY_TO_INDEX = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

const MIZAN_DAY_NAMES = {
  sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday',
};

// ── English planet → Mizan planet key (reverse) ──
const EN_TO_MIZAN_PLANET = {
  Saturn: 'zuhal', Jupiter: 'mustari', Mars: 'merih', Sun: 'sems',
  Venus: 'zuhre', Mercury: 'utarid', Moon: 'kamer',
};

// ═══════════════════════════════════════════════════════════════
// SOURCE 3: PDF "الشروط" (Al-Shurut) — Purpose × Day × Hour Table
// Pages 12–13, 26–27
// ═══════════════════════════════════════════════════════════════
const PDF_PURPOSE_TABLE = {
  // Mizan purpose keys mapped to PDF rules
  celb: { // جلب = attraction/love
    pdfName: 'Mahabbah (محبة)',
    bestDay: 'fri', bestHour: 'Venus',
    altDay: 'tue', altHour: 'Venus',
    description: 'Love and attraction to a specific person',
    source: 'Al-Shurut p.12',
    isNightRequired: true,
  },
  tard: { // طرد = banishment/separation
    pdfName: 'Firqa (فرقة)',
    bestDay: 'tue', bestHour: 'Saturn',
    description: 'Separation, hatred, driving away an enemy',
    source: 'Al-Shurut p.12',
    isNightRequired: true,
  },
  sihhat: { // الصحة = health
    pdfName: 'Sihhat (صحة)',
    bestDay: 'mon', bestHour: 'Moon',
    altDay: 'thu', altHour: 'Jupiter',
    description: 'Healing, health, and recovery',
    source: 'Al-Shurut p.12 + Havâss p.50-51',
    isNightRequired: false,
  },
  sekam: { // السقم = illness/harm
    pdfName: 'Taslit al-Dam / Hariq',
    bestDay: 'tue', bestHour: 'Mars',
    description: 'Causing harm, injury, or destruction (dark works)',
    source: 'Al-Shurut p.12',
    isNightRequired: true,
  },
  tarfet: { // طرفة العين = evil eye protection
    pdfName: 'Kaff al-Adha (كف الضرر)',
    bestDay: 'fri', bestHour: 'Saturn',
    description: 'Stopping harm, protection, walking safely',
    source: 'Al-Shurut p.12',
    isNightRequired: false,
  },
};

// ── Custom purpose keyword → PDF purpose rule ──
const CUSTOM_PURPOSE_KEYWORDS = [
  { keywords: ['love', 'محبة', 'حب', 'attraction', 'جلب', 'محب', 'عشق'], rule: 'celb' },
  { keywords: ['separation', 'فرقة', 'divorce', 'طلاق', 'banish', 'طرد', 'فراق'], rule: 'tard' },
  { keywords: ['healing', 'شفاء', 'صحة', 'health', 'علاج', 'medicine'], rule: 'sihhat' },
  { keywords: ['harm', 'ضرر', 'injury', 'أذى', 'destruction', 'هلاك'], rule: 'sekam' },
  { keywords: ['protection', 'حماية', 'evil eye', 'عين', 'طرفة', 'safety', 'أمان'], rule: 'tarfet' },
  { keywords: ['awe', 'هيبة', 'reverence', 'جلال', 'تعظيم'], rule: 'ijlal', custom: { pdfName: 'Ijlal (جلال)', bestDay: 'thu', bestHour: 'Mercury', source: 'Al-Shurut p.12' } },
  { keywords: ['binding', 'عقد', 'tie', 'ربط'], rule: 'aqd', custom: { pdfName: 'Aqd (عقد)', bestDay: 'wed', bestHour: 'Saturn', source: 'Al-Shurut p.12' } },
  { keywords: ['wealth', 'رزق', 'money', 'مال', 'livelihood', 'provision', 'sustenance'], rule: 'rizq', custom: { pdfName: 'Jalb al-Rizq (جلب الرزق)', bestDay: 'tue', bestHour: 'Jupiter', source: 'Al-Shurut p.13' } },
  { keywords: ['war', 'حرب', 'strife', 'فتنة', 'conflict', 'نزاع'], rule: 'harb', custom: { pdfName: 'Iqa Harb (إيقاع حرب)', bestDay: 'tue', bestHour: 'Mercury', source: 'Al-Shurut p.12' } },
  { keywords: ['agitation', 'تهييج', 'stir', 'إثارة'], rule: 'tahyij', custom: { pdfName: 'Tahyij (تهييج)', bestDay: 'fri', bestHour: 'Mars', source: 'Al-Shurut p.12' } },
  { keywords: ['fire', 'حريق', 'burn'], rule: 'hariq', custom: { pdfName: 'Hariq (حريق)', bestDay: 'tue', bestHour: 'Mars', source: 'Al-Shurut p.12' } },
  { keywords: ['authority', 'سلطان', 'ruler', 'حاكم', 'king', 'ملك', 'official'], rule: 'sultan', custom: { pdfName: 'Need with Authority', bestDay: 'sun', bestHour: 'Sun', source: 'Al-Shurut p.12' } },
  { keywords: ['fear', 'خوف', 'haybah', 'هيبة'], rule: 'haybah', custom: { pdfName: 'Haybah (هيبة)', bestDay: 'tue', bestHour: 'Sun', source: 'Al-Shurut p.12' } },
  { keywords: ['scatter', 'تشتيت', 'destabilize'], rule: 'tashtit', custom: { pdfName: 'Tashtit (تشتيت)', bestDay: 'wed', bestHour: 'Saturn', source: 'Al-Shurut p.13' } },
];

// ═══════════════════════════════════════════════════════════════
// SOURCE 3: PDF Element → Direction & Placement (pages 37, 42)
// ═══════════════════════════════════════════════════════════════
const ELEMENT_DIRECTION = {
  fire: { dir: 'East (المشرق)', ar: 'المشرق', source: 'Al-Shurut p.42' },
  water: { dir: 'West (المغرب)', ar: 'المغرب', source: 'Al-Shurut p.42' },
  air: { dir: 'North (الشمال)', ar: 'الشمال', source: 'Al-Shurut p.42' },
  earth: { dir: 'South (الجنوب)', ar: 'الجنوب', source: 'Al-Shurut p.42' },
};

const ELEMENT_PLACEMENT = {
  fire: { placement: 'Near an open flame', ar: 'قرب النار', source: 'Al-Shurut p.37' },
  earth: { placement: 'Buried in the ground, away from foot traffic', ar: 'مدفون في التراب', source: 'Al-Shurut p.37' },
  air: { placement: 'Where wind blows freely', ar: 'في مهب الريح', source: 'Al-Shurut p.37' },
  water: { placement: 'Near a water source', ar: 'قرب الماء', source: 'Al-Shurut p.37' },
};

// ═══════════════════════════════════════════════════════════════
// SOURCE 3: PDF Hayr Hour Rules (page 13, LCK_001–004)
// ═══════════════════════════════════════════════════════════════
const HAYR_SIID_DAYS = ['sun', 'mon', 'thu', 'fri']; // Sa'idat days
const HAYR_SIID_HOURS = [1, 8]; // 1st and 8th hours
const BENEFIC_PLANETS = ['Sun', 'Jupiter', 'Venus', 'Moon'];

// ═══════════════════════════════════════════════════════════════
// SOURCE 3: PDF Night Preference (pages 39–40, NGT_001–006)
// ═══════════════════════════════════════════════════════════════
const NIGHT_REQUIRED_WORKS = ['celb', 'tard', 'sekam']; // love, separation, harm

// ═══════════════════════════════════════════════════════════════
// SOURCE 3: PDF Zodiac Timing Tables (pages 18–19, 24)
// Two Omani scholar systems + Shaikh Zahir's table
// ═══════════════════════════════════════════════════════════════
const ZODIAC_TIMING_A = { // System A — Day + Hour (page 18)
  aries:       { day: ['sun', 'mon'],           hour: ['Mercury', 'Jupiter'], source: 'Al-Shurut p.18 (Omani System A)' },
  taurus:      { day: ['sat', 'sun', 'thu'],    hour: ['Moon', 'Jupiter'],     source: 'Al-Shurut p.18 (Omani System A)' },
  gemini:      { day: ['sat', 'sun', 'thu'],    hour: ['Jupiter'],             source: 'Al-Shurut p.18 (Omani System A)' },
  cancer:      { day: ['wed', 'fri'],           hour: ['Moon', 'Jupiter'],     source: 'Al-Shurut p.18 (Omani System A)' },
  leo:         { day: ['mon'],                  hour: ['Moon', 'Jupiter', 'Mercury'], source: 'Al-Shurut p.18 (Omani System A)' },
  virgo:       { day: ['mon'],                  hour: ['Moon', 'Jupiter', 'Mercury'], source: 'Al-Shurut p.18 (Omani System A)' },
  libra:       { day: ['wed'],                  hour: ['Mercury'],             source: 'Al-Shurut p.18 (Omani System A)' },
  scorpio:     { day: ['tue'],                  hour: ['Moon'],                source: 'Al-Shurut p.18 — NOTE: author states "not found"' },
  sagittarius: { day: ['wed'],                  hour: ['Mercury'],             source: 'Al-Shurut p.18 (Omani System A)' },
  capricorn:   { day: ['thu'],                  hour: ['Mercury'],             source: 'Al-Shurut p.18 (Omani System A)' },
  aquarius:    { day: ['sun'],                  hour: ['Jupiter'],             source: 'Al-Shurut p.18 (Omani System A)' },
  pisces:      { day: ['tue'],                  hour: ['Mars'],                source: 'Al-Shurut p.18 (Omani System A)' },
};

const ZODIAC_TIMING_B = { // System B — Hour only (page 19)
  aries:       { hour: 'Jupiter', source: 'Al-Shurut p.19 (Omani System B)' },
  taurus:      { hour: 'Jupiter', source: 'Al-Shurut p.19 (Omani System B)' },
  gemini:      { hour: 'Sun', source: 'Al-Shurut p.19 (Omani System B)' },
  cancer:      { hour: 'Saturn', source: 'Al-Shurut p.19 (Omani System B)' },
  leo:         { hour: 'Sun', source: 'Al-Shurut p.19 (Omani System B)' },
  virgo:       { hour: 'Jupiter', source: 'Al-Shurut p.19 (Omani System B)' },
  libra:       { hour: 'Mercury', source: 'Al-Shurut p.19 (Omani System B)' },
  scorpio:     { hour: 'Sun', source: 'Al-Shurut p.19 (Omani System B)' },
  sagittarius: { hour: 'Moon', source: 'Al-Shurut p.19 (Omani System B)' },
  capricorn:   { hour: 'Moon', source: 'Al-Shurut p.19 (Omani System B)' },
  aquarius:    { hour: 'Moon', source: 'Al-Shurut p.19 (Omani System B)' },
};

// Element → planet affinity (for element compatibility assessment)
const ELEMENT_PLANET_AFFINITY = {
  fire:  { planets: ['Mars', 'Sun'], nature: 'hot & dry', strengthens: ['passion', 'courage', 'authority', 'destruction'] },
  earth: { planets: ['Saturn', 'Mercury'], nature: 'cold & dry', strengthens: ['binding', 'stability', 'wealth', 'patience'] },
  air:   { planets: ['Jupiter', 'Mercury'], nature: 'hot & moist', strengthens: ['knowledge', 'communication', 'spirituality', 'healing'] },
  water: { planets: ['Moon', 'Venus'], nature: 'cold & moist', strengthens: ['love', 'emotions', 'intuition', 'protection'] },
};

// ═══════════════════════════════════════════════════════════════
// MOON PHASE CALCULATION
// ═══════════════════════════════════════════════════════════════
function getMoonPhase(date) {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const lunarCycleMs = 29.53059 * 24 * 60 * 60 * 1000;
  const diff = date.getTime() - knownNewMoon;
  const cycles = diff / lunarCycleMs;
  const phaseFraction = cycles - Math.floor(cycles);
  const lunarDay = Math.floor(phaseFraction * 29.53) + 1;
  const isWaxing = lunarDay <= 14;
  const isWaning = lunarDay > 14;
  const isNewMoon = lunarDay >= 28 || lunarDay <= 1;
  const isFullMoon = lunarDay >= 13 && lunarDay <= 16;
  return {
    lunarDay,
    phaseName: isWaxing ? 'Waxing (مقبل)' : 'Waning (مدبر)',
    isWaxing,
    isWaning,
    isNewMoon,
    isFullMoon,
    isGoodForKhayr: isWaxing,
    isGoodForSharr: isWaning || isNewMoon,
  };
}

// ═══════════════════════════════════════════════════════════════
// MATCH CUSTOM PURPOSE TEXT TO A RULE
// ═══════════════════════════════════════════════════════════════
function matchCustomPurpose(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const entry of CUSTOM_PURPOSE_KEYWORDS) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase()) || text.includes(kw)) {
        if (entry.custom) return { ...entry.custom, isNightRequired: ['love', 'separation', 'harm'].includes(entry.rule) };
        return PDF_PURPOSE_TABLE[entry.rule];
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// GET ALL PLANETARY HOURS FOR TODAY (day + night)
// ═══════════════════════════════════════════════════════════════
function getTodayAllHours(date) {
  // Approximate sunrise/sunset for Asia/Dubai (can be refined with API later)
  // Summer: ~5:30 AM / 19:00; Winter: ~7:00 AM / 17:40
  const month = date.getMonth(); // 0-11
  let sunrise, sunset;
  if (month >= 4 && month <= 8) { // May–Sep: summer
    sunrise = 5.5; sunset = 19.0;
  } else if (month === 3 || month === 9) { // Apr, Oct: transitional
    sunrise = 6.0; sunset = 18.25;
  } else { // Nov–Mar: winter
    sunrise = 6.83; sunset = 17.67;
  }
  return { hours: getAllPlanetaryHours(date, sunrise, sunset), sunrise, sunset };
}

// ═══════════════════════════════════════════════════════════════
// FIND BEST HOURS FOR A TARGET PLANET IN TODAY'S TABLE
// ═══════════════════════════════════════════════════════════════
function findHoursByPlanet(allHours, targetPlanetEn) {
  const target = targetPlanetEn.toLowerCase();
  return allHours.filter(h => h.planet === target);
}

// ═══════════════════════════════════════════════════════════════
// FIND NEXT VALID DAY + HOUR (within next 7 days)
// ═══════════════════════════════════════════════════════════════
function findNextValidDayHour(bestDayKey, bestHourPlanetEn) {
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayIdx = checkDate.getDay();
    const dayKey = Object.keys(MIZAN_DAY_TO_INDEX).find(k => MIZAN_DAY_TO_INDEX[k] === dayIdx);
    if (dayKey === bestDayKey) {
      const { hours } = getTodayAllHours(checkDate);
      const matching = findHoursByPlanet(hours, bestHourPlanetEn);
      if (matching.length > 0) {
        const firstHour = matching[0];
        return {
          dayName: MIZAN_DAY_NAMES[dayKey],
          date: checkDate.toISOString().split('T')[0],
          hour: firstHour.hourNumber,
          planet: firstHour.planet,
          startTime: firstHour.startTime,
          endTime: firstHour.endTime,
          isToday: i === 0,
          daysAhead: i,
        };
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// MAP MIZAN PURPOSE TO EXISTING ACTION_RULES CATEGORY
// ═══════════════════════════════════════════════════════════════
function mapToActionRule(mizanPurposeKey) {
  const map = {
    celb: 'love', tard: 'spiritual', sihhat: 'healing', sekam: null, tarfet: 'spiritual',
  };
  return map[mizanPurposeKey] ? ACTION_RULES[map[mizanPurposeKey]] : null;
}

// ═══════════════════════════════════════════════════════════════
// MAIN ANALYSIS FUNCTION
// ═══════════════════════════════════════════════════════════════
export function analyzeRitualTiming({ result, selections, customPurpose, activeMethod }) {
  const reasoning = [];
  const warnings = [];
  const bookNotes = [];
  const conflicts = [];
  const rulesApplied = [];

  // ── STEP 1: Extract Mizan state ──
  const dominant = result?.dominant || (selections?.elements?.[0] || null);
  const khayrSharr = selections?.khayrSharr8 || null;
  const selectedDay = selections?.days || null;
  const selectedHour = selections?.hour || null;
  const selectedPlanet = selections?.planet || null;
  const dayNight = selections?.dayNight || null;
  const purposes = selections?.purposes || [];
  const primaryPurpose = purposes[0] || null;
  const suitability = result?.suitability || null;

  reasoning.push(`Mizan dominant element: ${dominant || 'unknown'}`);
  reasoning.push(`Khayr/Sharr selection: ${khayrSharr || 'not selected'}`);
  reasoning.push(`Selected day: ${selectedDay ? MIZAN_DAY_NAMES[selectedDay] : 'not selected'}`);
  reasoning.push(`Selected planetary hour: #${selectedHour || 'not selected'}`);
  reasoning.push(`Selected planet: ${selectedPlanet ? MIZAN_TO_EN_PLANET[selectedPlanet] : 'not selected'}`);
  reasoning.push(`Day/Night mode: ${dayNight || 'not selected'}`);
  reasoning.push(`Primary purpose: ${primaryPurpose || 'none'}`);
  if (customPurpose) reasoning.push(`Custom purpose: "${customPurpose}"`);
  reasoning.push(`Active Method: ${activeMethod}`);

  // ── STEP 2: Determine ritual intent (purpose) ──
  let pdfRule = null;
  if (primaryPurpose && PDF_PURPOSE_TABLE[primaryPurpose]) {
    pdfRule = PDF_PURPOSE_TABLE[primaryPurpose];
    rulesApplied.push({ id: `PDF_${primaryPurpose}`, desc: `Purpose "${pdfRule.pdfName}" → Day: ${MIZAN_DAY_NAMES[pdfRule.bestDay]}, Hour: ${pdfRule.bestHour}`, source: pdfRule.source });
  }
  // If custom purpose text matches, use it as additional/override
  const customMatch = matchCustomPurpose(customPurpose);
  if (customMatch && !pdfRule) {
    pdfRule = customMatch;
    rulesApplied.push({ id: 'PDF_CUSTOM', desc: `Custom purpose matched "${pdfRule.pdfName}" → Day: ${MIZAN_DAY_NAMES[pdfRule.bestDay]}, Hour: ${pdfRule.bestHour}`, source: pdfRule.source });
  } else if (customMatch && pdfRule && customMatch.pdfName !== pdfRule.pdfName) {
    // Conflict: Mizan purpose says one thing, custom says another
    conflicts.push({
      rule1: `Mizan purpose "${pdfRule.pdfName}" (${pdfRule.source})`,
      rule2: `Custom text matched "${customMatch.pdfName}" (${customMatch.source})`,
      resolution: `Mizan purpose takes priority (Tier 4). Custom purpose noted as secondary.`,
    });
  }

  // ── STEP 3: Read live time ──
  const now = new Date();
  const { hours: todayHours, sunrise, sunset } = getTodayAllHours(now);
  const currentHourInfo = getCurrentPlanetaryHour(now, sunrise, sunset);
  const dayRuler = getDayRuler(now.getDay());
  const moonPhase = getMoonPhase(now);
  const currentDayKey = Object.keys(MIZAN_DAY_TO_INDEX).find(k => MIZAN_DAY_TO_INDEX[k] === now.getDay());
  const isNightTime = now.getHours() < sunrise || now.getHours() >= sunset;

  reasoning.push(`Current time: ${now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' })}`);
  reasoning.push(`Current planetary hour: #${currentHourInfo.hourNumber} (${currentHourInfo.planet})`);
  reasoning.push(`Current day ruler: ${dayRuler.planet}`);
  reasoning.push(`Moon phase: Day ${moonPhase.lunarDay} — ${moonPhase.phaseName}`);
  reasoning.push(`Currently ${isNightTime ? 'nighttime' : 'daytime'}`);

  // ── STEP 4: Apply PDF rules — best day/hour from purpose table ──
  let bestDay = null, bestHourPlanet = null, altDay = null, altHourPlanet = null;
  if (pdfRule) {
    bestDay = pdfRule.bestDay;
    bestHourPlanet = pdfRule.bestHour;
    altDay = pdfRule.altDay || null;
    altHourPlanet = pdfRule.altHour || null;
  }

  // ── STEP 5: Apply Khayr hour restriction (LCK_001–003) ──
  if (khayrSharr === 'khayr') {
    rulesApplied.push({ id: 'LCK_001', desc: 'Hayr works: restrict to Sa\'idat hours (1st & 8th of Sun/Mon/Thu/Fri) OR any benefic planet hour', source: 'Al-Shurut p.13' });
    // Check: is current day a Sa'idat day?
    const isSiidDay = HAYR_SIID_DAYS.includes(currentDayKey);
    const isSiidHour = HAYR_SIID_HOURS.includes(currentHourInfo.hourNumber);
    const isBeneficHour = BENEFIC_PLANETS.includes(currentHourInfo.planet);
    if (!isSiidHour && !isBeneficHour) {
      warnings.push(`Current hour (#${currentHourInfo.hourNumber}, ${currentHourInfo.planet}) is NOT a Sa'idat hour and ${currentHourInfo.planet} is not a benefic planet — unsuitable for Khayr works (LCK_003)`);
    }
  }

  // ── STEP 6: Apply Moon phase rules (MN_001–002) ──
  if (khayrSharr === 'khayr' && !moonPhase.isGoodForKhayr) {
    warnings.push(`Moon is in the waning phase (Day ${moonPhase.lunarDay}). Khayr works should be done in the waxing phase (MN_001)`);
    rulesApplied.push({ id: 'MN_001', desc: 'Khayr works require waxing moon (first half of lunar month)', source: 'Al-Shurut p.13' });
  }
  if (khayrSharr === 'sharr' && !moonPhase.isGoodForSharr) {
    warnings.push(`Moon is in the waxing phase. Sharr works are better in the waning phase, especially at New Moon (MN_002)`);
    rulesApplied.push({ id: 'MN_002', desc: 'Sharr works best in waning moon, especially New Moon (محاق)', source: 'Al-Shurut p.13' });
  }

  // ── STEP 7: Apply Night preference (NGT_001–006) ──
  let nightWarning = null;
  if (pdfRule?.isNightRequired && !isNightTime) {
    nightWarning = `This work (${pdfRule.pdfName}) MUST be performed at night — spirits are suppressed by daylight (NGT_002)`;
    warnings.push(nightWarning);
    rulesApplied.push({ id: 'NGT_006', desc: 'Love, enmity, separation, and binding works must be done at night', source: 'Al-Shurut p.39-40' });
  }
  if (!isNightTime) {
    rulesApplied.push({ id: 'NGT_001', desc: 'All scholars agree: night is superior to day for spiritual works (Sun suppresses spirits)', source: 'Al-Shurut p.39-40' });
  }

  // ── STEP 8: Element direction & placement (Categories 10, 13) ──
  let elementDirection = null, elementPlacement = null;
  if (dominant && ELEMENT_DIRECTION[dominant]) {
    elementDirection = ELEMENT_DIRECTION[dominant];
    rulesApplied.push({ id: `DIR_${dominant}`, desc: `Face ${elementDirection.dir} for ${dominant} element works`, source: elementDirection.source });
  }
  if (dominant && ELEMENT_PLACEMENT[dominant]) {
    elementPlacement = ELEMENT_PLACEMENT[dominant];
    rulesApplied.push({ id: `PLC_${dominant}`, desc: `Place talisman ${elementPlacement.placement}`, source: elementPlacement.source });
  }

  // ── STEP 9: Find best hours today ──
  let bestWindowsToday = [];
  let avoidWindowsToday = [];

  if (bestHourPlanet) {
    const matchingHours = findHoursByPlanet(todayHours, bestHourPlanet);
    for (const h of matchingHours) {
      if (h.status === 'past') continue;
      bestWindowsToday.push({
        startTime: h.startTime,
        endTime: h.endTime,
        planet: h.planet,
        hourNumber: h.hourNumber,
        period: h.period,
        isIdeal: h.planet === bestHourPlanet.toLowerCase(),
        reason: `${bestHourPlanet} hour — ideal for ${pdfRule?.pdfName || 'this work'}`,
      });
    }
  }

  // Avoid windows: hours of enemy planets (from existing ACTION_RULES)
  const actionRule = mapToActionRule(primaryPurpose);
  if (actionRule?.enemyPlanets) {
    for (const enemy of actionRule.enemyPlanets) {
      const enemyHours = findHoursByPlanet(todayHours, enemy);
      for (const h of enemyHours) {
        if (h.status === 'past') continue;
        avoidWindowsToday.push({
          startTime: h.startTime,
          endTime: h.endTime,
          planet: h.planet,
          hourNumber: h.hourNumber,
          reason: `${enemy} hour — enemy planet for ${actionRule.category}`,
        });
      }
    }
  }

  // ── STEP 10: Check if today is a valid day (Yes / No / Limited) ──
  let canPerformToday = 'No'; // 'Yes' | 'No' | 'Limited'
  let dayMatch = false;
  let canPerformTodayReason = '';
  if (bestDay) {
    dayMatch = currentDayKey === bestDay || (altDay && currentDayKey === altDay);
    if (dayMatch) {
      const upcomingBest = bestWindowsToday.filter(w => w.status !== 'past');
      const allMatching = findHoursByPlanet(todayHours, bestHourPlanet);
      if (upcomingBest.length > 0) {
        canPerformToday = 'Yes';
        canPerformTodayReason = `Today (${MIZAN_DAY_NAMES[currentDayKey]}) is the recommended day and ${upcomingBest.length} optimal hour${upcomingBest.length > 1 ? 's' : ''} remain available.`;
        rulesApplied.push({ id: 'DAY_MATCH', desc: `Today (${MIZAN_DAY_NAMES[currentDayKey]}) matches the recommended day for ${pdfRule?.pdfName}`, source: pdfRule?.source || '' });
      } else if (allMatching.length > 0) {
        canPerformToday = 'Limited';
        canPerformTodayReason = `Today is the correct day, but all ${bestHourPlanet} hours have already passed. You may proceed with a secondary hour, or wait for the next occurrence.`;
        warnings.push(`Today is the correct day but all ${bestHourPlanet} hours have passed. Proceeding with a non-optimal hour is possible but weakened.`);
      } else {
        canPerformToday = 'No';
        canPerformTodayReason = `Today is the correct day but no ${bestHourPlanet} hours exist in today's planetary table.`;
      }
    } else {
      canPerformToday = 'No';
      canPerformTodayReason = `Today is ${MIZAN_DAY_NAMES[currentDayKey]}, but the recommended day is ${MIZAN_DAY_NAMES[bestDay]}${altDay ? ' or ' + MIZAN_DAY_NAMES[altDay] : ''}.`;
      warnings.push(`Today is ${MIZAN_DAY_NAMES[currentDayKey]}, but the recommended day is ${MIZAN_DAY_NAMES[bestDay]}${altDay ? ' or ' + MIZAN_DAY_NAMES[altDay] : ''}`);
    }
  } else {
    canPerformToday = 'Limited';
    canPerformTodayReason = `No specific day restriction found for this ritual type. Any day may work, but consult the planetary hours below for timing.`;
  }

  // ── STEP 11: Find next valid opportunity ──
  let nextOpportunity = null;
  if (bestDay && bestHourPlanet) {
    nextOpportunity = findNextValidDayHour(bestDay, bestHourPlanet);
    if (!nextOpportunity && altDay && altHourPlanet) {
      nextOpportunity = findNextValidDayHour(altDay, altHourPlanet);
    }
  }

  // ── STEP 12: Compute suitability score ──
  let score = 50; // base
  const scoreReasons = [];

  if (dayMatch) { score += 20; scoreReasons.push('Correct day (+20)'); }
  else { score -= 15; scoreReasons.push('Wrong day (-15)'); }

  // Current hour matches best hour planet?
  const currentHourMatches = bestHourPlanet && currentHourInfo.planet === bestHourPlanet.toLowerCase();
  if (currentHourMatches) { score += 25; scoreReasons.push('Current hour matches best planet (+25)'); }
  else if (bestHourPlanet) { score -= 10; scoreReasons.push('Current hour does not match best planet (-10)'); }

  // Benefic hour for khayr?
  if (khayrSharr === 'khayr' && BENEFIC_PLANETS.includes(currentHourInfo.planet)) {
    score += 10; scoreReasons.push('Benefic hour for Khayr (+10)');
  }

  // Moon phase
  if (khayrSharr === 'khayr' && moonPhase.isGoodForKhayr) { score += 10; scoreReasons.push('Waxing moon for Khayr (+10)'); }
  if (khayrSharr === 'sharr' && moonPhase.isGoodForSharr) { score += 10; scoreReasons.push('Waning moon for Sharr (+10)'); }

  // Night preference
  if (pdfRule?.isNightRequired && isNightTime) { score += 10; scoreReasons.push('Nighttime for nocturnal works (+10)'); }
  if (pdfRule?.isNightRequired && !isNightTime) { score -= 15; scoreReasons.push('Daytime but night required (-15)'); }
  if (!pdfRule?.isNightRequired && isNightTime) { score += 5; scoreReasons.push('Nighttime is generally superior (+5)'); }

  // Dominant element alignment with purpose
  if (dominant && pdfRule) {
    const firePurposes = ['celb', 'sekam', 'tahyij', 'hariq', 'harb', 'haybah'];
    const earthPurposes = ['tard', 'aqd', 'tashtit'];
    const airPurposes = ['sihhat', 'ijlal'];
    const waterPurposes = ['tarfet', 'sultan'];
    const purposeKey = primaryPurpose || '';
    if (dominant === 'fire' && firePurposes.includes(purposeKey)) { score += 5; scoreReasons.push('Fire element aligns with purpose (+5)'); }
    if (dominant === 'earth' && earthPurposes.includes(purposeKey)) { score += 5; scoreReasons.push('Earth element aligns with purpose (+5)'); }
    if (dominant === 'air' && airPurposes.includes(purposeKey)) { score += 5; scoreReasons.push('Air element aligns with purpose (+5)'); }
    if (dominant === 'water' && waterPurposes.includes(purposeKey)) { score += 5; scoreReasons.push('Water element aligns with purpose (+5)'); }
  }

  score = Math.max(0, Math.min(100, score));

  // ── STEP 13: Determine verdict (5 levels: Excellent / Strong / Moderate / Weak / Avoid) ──
  let verdict, verdictColor, verdictReason;
  if (score >= 85) { verdict = 'Excellent'; verdictColor = '#4ADE80'; verdictReason = 'All major conditions align perfectly — the heavens strongly support this ritual.'; }
  else if (score >= 65) { verdict = 'Strong'; verdictColor = '#86EFAC'; verdictReason = 'Most conditions are favorable — proceed with confidence.'; }
  else if (score >= 45) { verdict = 'Moderate'; verdictColor = '#FBBF24'; verdictReason = 'Mixed conditions — the ritual can succeed but requires extra focus and correct timing.'; }
  else if (score >= 25) { verdict = 'Weak'; verdictColor = '#F59E0B'; verdictReason = 'Conditions are unfavorable — postpone to a better time if possible.'; }
  else { verdict = 'Avoid'; verdictColor = '#F87171'; verdictReason = 'Multiple unfavorable conditions — do not proceed at this time.'; }

  // ── STEP 14: Book notes ──
  if (pdfRule) {
    bookNotes.push({ source: pdfRule.source, text: `${pdfRule.pdfName}: Day ${MIZAN_DAY_NAMES[pdfRule.bestDay]}, Hour ${pdfRule.bestHour}` });
  }
  if (dominant) {
    bookNotes.push({ source: 'Al-Shurut p.37', text: `Dominant element ${dominant}: place talisman ${elementPlacement?.placement || 'appropriately'}` });
    bookNotes.push({ source: 'Al-Shurut p.42', text: `Face ${elementDirection?.dir || 'Qibla'} during ritual` });
  }
  if (actionRule) {
    for (const src of (actionRule.sources || [])) {
      bookNotes.push({ source: `${src.book} p.${src.page}`, text: `Existing manuscript: ${actionRule.category}` });
    }
  }

  // ── STEP 15: Recommended incense (INC_004) ──
  const recommendedIncense = `${currentHourInfo.planet} incense (for the current ${currentHourInfo.planet} hour)`;
  rulesApplied.push({ id: 'INC_004', desc: 'Incense = incense of the SA\'AT (hour), NOT the day', source: 'Al-Shurut p.11, 20' });

  // ── STEP 16: Zodiac suitability (from PDF Systems A + B) ──
  // Note: Zodiac sign is not available from Mizan state directly; this is informational.
  // We check if today's day/hour matches ANY zodiac timing as a general guidance.
  let zodiacSuitability = { assessed: false, bestSigns: [], note: '' };
  const todayDayMatchesZodiac = [];
  for (const [sign, rule] of Object.entries(ZODIAC_TIMING_A)) {
    if (rule.day.includes(currentDayKey)) {
      todayDayMatchesZodiac.push({ sign, system: 'A', hour: rule.hour, source: rule.source });
    }
  }
  if (todayDayMatchesZodiac.length > 0) {
    zodiacSuitability = {
      assessed: true,
      bestSigns: todayDayMatchesZodiac,
      note: `Today's day (${MIZAN_DAY_NAMES[currentDayKey]}) is optimal for rituals targeting people born under: ${todayDayMatchesZodiac.map(z => z.sign).join(', ')}. If your target's natal sign is among these, today is especially powerful.`,
    };
    rulesApplied.push({ id: 'ZOD_A', desc: `Zodiac System A: ${MIZAN_DAY_NAMES[currentDayKey]} matches ${todayDayMatchesZodiac.map(z => z.sign).join(', ')}`, source: 'Al-Shurut p.18' });
  } else {
    zodiacSuitability = {
      assessed: true,
      bestSigns: [],
      note: `Today's day (${MIZAN_DAY_NAMES[currentDayKey]}) is not listed as optimal for any specific natal sign in the Omani zodiac timing tables. Proceed based on purpose and planetary hour rules.`,
    };
  }

  // ── STEP 17: Day/Night suitability assessment ──
  let dayNightSuitability = { status: 'neutral', reason: '', citation: '' };
  if (pdfRule?.isNightRequired) {
    if (isNightTime) {
      dayNightSuitability = {
        status: 'optimal',
        reason: `It is currently nighttime, which is required for this type of work (${pdfRule.pdfName}). The Sun's suppression of spirits is lifted at night.`,
        citation: 'Al-Shurut p.39-40 (NGT_001-006)',
      };
    } else {
      dayNightSuitability = {
        status: 'forbidden',
        reason: `It is currently daytime, but this work (${pdfRule.pdfName}) must be performed at night. The Sun's dominion suppresses all spirits during daylight.`,
        citation: 'Al-Shurut p.39-40 (NGT_002)',
      };
    }
  } else {
    if (isNightTime) {
      dayNightSuitability = {
        status: 'good',
        reason: `It is nighttime — all scholars agree that night is superior to day for spiritual works because the Sun no longer suppresses the spirits.`,
        citation: 'Al-Shurut p.39 (NGT_001)',
      };
    } else {
      dayNightSuitability = {
        status: 'acceptable',
        reason: `It is daytime. While night is generally preferred for spiritual works, this type of work (healing, talismans, invocations) can be performed during the day if the planetary hour is correct.`,
        citation: 'Al-Shurut p.39-40 (NGT_007)',
      };
    }
  }

  // ── STEP 18: Element compatibility assessment ──
  let elementCompatibility = { assessed: false, status: 'neutral', reason: '', citation: '' };
  if (dominant && ELEMENT_PLANET_AFFINITY[dominant]) {
    const elemInfo = ELEMENT_PLANET_AFFINITY[dominant];
    const currentPlanetLower = currentHourInfo.planet.toLowerCase();
    const isAligned = elemInfo.planets.map(p => p.toLowerCase()).includes(currentPlanetLower);
    elementCompatibility = {
      assessed: true,
      status: isAligned ? 'aligned' : 'neutral',
      element: dominant,
      elementNature: elemInfo.nature,
      affinityPlanets: elemInfo.planets,
      strengthens: elemInfo.strengthens,
      reason: isAligned
        ? `The dominant element from your Mizan analysis is ${dominant} (${elemInfo.nature}), and the current planetary hour is ruled by ${currentHourInfo.planet} — one of the planets naturally aligned with ${dominant}. This harmony amplifies the ritual's power.`
        : `The dominant element is ${dominant} (${elemInfo.nature}), but the current hour is ruled by ${currentHourInfo.planet}, which is not the primary planet of ${dominant}. The ritual can still work, but wait for a ${elemInfo.planets.join(' or ')} hour for maximum alignment.`,
      citation: 'Al-Shurut p.37, 42 + Havâss p.50-56',
    };
    rulesApplied.push({ id: `ELEM_${dominant}`, desc: `Element ${dominant} affinity: ${elemInfo.planets.join(', ')} — current hour ${isAligned ? 'matches' : 'differs'}`, source: 'Al-Shurut p.37 + Havâss' });
  }

  // ── STEP 19: Current Astro Clock status summary ──
  const astroClockStatus = {
    day: MIZAN_DAY_NAMES[currentDayKey],
    dayRuler: dayRuler.planet,
    currentHour: { number: currentHourInfo.hourNumber, planet: currentHourInfo.planet, symbol: PLANET_INFO[currentHourInfo.planet]?.symbol || '' },
    isDaytime: !isNightTime,
    hourRemaining: currentHourInfo.remainingTime,
    nextPlanet: PLANET_SEQUENCE[(PLANET_SEQUENCE.indexOf(currentHourInfo.planet) + 1) % 7] || '',
    moonPhase: `Day ${moonPhase.lunarDay} (${moonPhase.phaseName})`,
    summary: `Today is ${MIZAN_DAY_NAMES[currentDayKey]} (ruled by ${dayRuler.planet}). The current planetary hour is #${currentHourInfo.hourNumber} (${currentHourInfo.planet} ${PLANET_INFO[currentHourInfo.planet]?.symbol || ''}), ${isNightTime ? 'nighttime' : 'daytime'}, with ${currentHourInfo.remainingTime} remaining. The Moon is at day ${moonPhase.lunarDay} (${moonPhase.phaseName}). The next planetary hour will be ruled by ${PLANET_SEQUENCE[(PLANET_SEQUENCE.indexOf(currentHourInfo.planet) + 1) % 7] || 'unknown'}.`,
  };

  // ── STEP 20: Recommended start/end times ──
  let recommendedStart = null;
  let recommendedEnd = null;
  let recommendedStartReason = '';
  if (bestWindowsToday.length > 0) {
    const first = bestWindowsToday[0];
    recommendedStart = first.startTime;
    recommendedEnd = first.endTime;
    recommendedStartReason = `Begin during the ${first.planet} hour — this is the optimal planetary hour for ${pdfRule?.pdfName || 'this work'}. ${pdfRule ? `The manuscript ${pdfRule.source} prescribes this hour for this purpose.` : ''}`;
  } else if (nextOpportunity) {
    recommendedStart = nextOpportunity.startTime;
    recommendedEnd = nextOpportunity.endTime;
    recommendedStartReason = `No optimal hours remain today. The next available ${nextOpportunity.planet} hour is on ${nextOpportunity.dayName} at ${nextOpportunity.startTime}.`;
  }

  // ── STEP 21: Human-readable expert narrative ──
  const expertNarrative = [];
  expertNarrative.push(`Based on your Mizan analysis, this ritual is classified as "${pdfRule?.pdfName || 'General spiritual work'}" — ${pdfRule?.description || 'a spiritual operation requiring proper timing.'}`);
  if (khayrSharr) {
    expertNarrative.push(`You have selected this as a ${khayrSharr === 'khayr' ? 'Khayr (good/benevolent)' : 'Sharr (powerful/banishment)'} work. ${khayrSharr === 'khayr' ? 'Khayr works are best performed during the waxing Moon and in Sa\'idat (auspicious) hours.' : 'Sharr works are best performed during the waning Moon, especially at the New Moon (محاق).'}`);
  }
  if (dominant) {
    expertNarrative.push(`The dominant element in your text is ${dominant}, which means you should face ${elementDirection?.dir || 'Qibla'} during the ritual and place the talisman ${elementPlacement?.placement || 'appropriately'}.`);
  }
  expertNarrative.push(`The manuscripts recommend performing this work on ${bestDay ? MIZAN_DAY_NAMES[bestDay] : 'any suitable day'} during the ${bestHourPlanet || 'appropriate planetary'} hour. ${canPerformToday === 'Yes' ? 'Today meets this criteria and optimal hours are still available.' : canPerformToday === 'Limited' ? 'Today is the right day but the optimal hours have passed — you may proceed with caution or wait for the next occurrence.' : 'Today does not meet the day criteria — wait for the next recommended day.'}`);
  if (isNightTime) {
    expertNarrative.push(`It is currently nighttime, which is favorable — the Sun no longer dominates and spirits can act freely.`);
  } else if (pdfRule?.isNightRequired) {
    expertNarrative.push(`WARNING: This work must be performed at night, but it is currently daytime. Wait until after sunset.`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 22: BUILD THE 23-POINT EXPERT CONSULTATION
  // Each point: { n, title, body, citation, consequence }
  // ═══════════════════════════════════════════════════════════════
  const consultation = [];

  consultation.push({
    n: 1, title: `Whether Today Is Suitable`,
    body: canPerformToday === `Yes`
      ? `Yes — today is suitable. ${canPerformTodayReason} The heavens are aligned for this work, and you may proceed with confidence during the optimal hours listed below.`
      : canPerformToday === `Limited`
        ? `Today is only partially suitable. ${canPerformTodayReason} You may proceed, but the ritual will be weakened. If the matter is urgent, continue; otherwise, wait for the next fully aligned day.`
        : `No — today is not suitable. ${canPerformTodayReason} Performing this ritual today would be working against the celestial current, which the manuscripts warn against.`,
    citation: pdfRule?.source || `Al-Shurut p.12-13`,
    consequence: canPerformToday === `Yes`
      ? `No risk — proceed.`
      : `Proceeding on the wrong day weakens the ritual and may cause the spirits to refuse the request, as the planetary ruler of the day does not govern this type of work.`,
  });

  const whyTodayParts = [];
  if (dayMatch) whyTodayParts.push(`Today's weekday (${MIZAN_DAY_NAMES[currentDayKey]}) matches the prescription for ${pdfRule?.pdfName || `this work`}.`);
  else if (bestDay) whyTodayParts.push(`Today is ${MIZAN_DAY_NAMES[currentDayKey]} but the prescribed day is ${MIZAN_DAY_NAMES[bestDay]}${altDay ? ` or ` + MIZAN_DAY_NAMES[altDay] : ``}.`);
  if (bestHourPlanet) {
    if (currentHourInfo.planet === bestHourPlanet.toLowerCase()) whyTodayParts.push(`The current planetary hour is ruled by ${currentHourInfo.planet}, which is the prescribed hour.`);
    else whyTodayParts.push(`The current hour is ruled by ${currentHourInfo.planet}, not the prescribed ${bestHourPlanet}.`);
  }
  if (pdfRule?.isNightRequired) whyTodayParts.push(isNightTime ? `It is nighttime, which is required for this work.` : `It is daytime, but this work requires night.`);
  if (khayrSharr === `khayr` && !moonPhase.isGoodForKhayr) whyTodayParts.push(`The Moon is waning, which weakens Khayr works.`);
  if (khayrSharr === `sharr` && !moonPhase.isGoodForSharr) whyTodayParts.push(`The Moon is waxing, which weakens Sharr works.`);
  consultation.push({
    n: 2, title: `Why Today Is Suitable or Unsuitable`,
    body: whyTodayParts.join(` `) || `No specific rule restricts or promotes today for this work.`,
    citation: `Al-Shurut pp.12-13, 39-40`,
    consequence: `Understanding the cause of unsuitability tells you exactly which condition to wait for — day, hour, or moon phase.`,
  });

  consultation.push({
    n: 3, title: `Best Start Time`,
    body: recommendedStart
      ? `Begin at ${recommendedStart}. ${recommendedStartReason}`
      : `No specific optimal start time was identified — consult the available hours below.`,
    citation: pdfRule?.source || `Al-Shurut p.12`,
    consequence: `Starting at the wrong hour means the planetary ruler does not govern the request, and the invocation may return unanswered.`,
  });

  consultation.push({
    n: 4, title: `Best End Time`,
    body: recommendedEnd
      ? `Complete before ${recommendedEnd}, when the planetary hour changes. ${pdfRule ? `The ${bestHourPlanet} hour is the window in which the ${pdfRule.pdfName} must be performed.` : `Do not let the hour pass — each planetary hour governs a different spiritual domain.`}`
      : `No specific end time identified.`,
    citation: `Al-Shurut p.12 + Havâss p.50-56`,
    consequence: `Continuing past the hour means entering a new planetary rulership, which may oppose the work and nullify what was built.`,
  });

  consultation.push({
    n: 5, title: `Strongest Planetary Hour`,
    body: bestHourPlanet
      ? `The ${bestHourPlanet} hour is the strongest hour for this work. ${bestHourReason} ${bestWindowsToday.length > 0 ? `Today, this hour occurs at: ${bestWindowsToday.map(w => `${w.startTime}–${w.endTime}`).join(`, `)}.` : `No instances of this hour remain today.`}`
      : `No specific strongest hour was identified from the manuscripts for this purpose.`,
    citation: pdfRule?.source || `Havâss p.50-56`,
    consequence: `A weak hour means the planetary spirit is not inclined to answer — the ritual becomes an empty recitation.`,
  });

  consultation.push({
    n: 6, title: `Weak Planetary Hours to Avoid`,
    body: avoidWindowsToday.length > 0
      ? `Avoid the following hours today: ${avoidWindowsToday.map(w => `${w.startTime}–${w.endTime} (${w.planet} — ${w.reason})`).join(`; `)}. These hours are ruled by planets that oppose ${pdfRule?.pdfName || `this work`}, and performing the ritual during them can cause the work to rebound against the practitioner.`
      : bestHourPlanet
        ? `No specific enemy-planet hours were found for this work. However, avoid any hour that is not the ${bestHourPlanet} hour, as the manuscripts advise against performing spiritual works in hours not prescribed for them.`
        : `No specific weak hours were identified.`,
    citation: `Al-Shurut p.12 + Havâss p.50-56`,
    consequence: `The manuscripts warn that performing a work in the hour of an enemy planet causes the ritual to reverse — harming the practitioner instead of the target.`,
  });

  consultation.push({
    n: 7, title: `Best Moon Condition`,
    body: khayrSharr === `khayr`
      ? `The best moon condition is the waxing phase (first 14 lunar days), especially days 1–7, when the Moon is growing in light. Khayr (benevolent) works thrive on the increasing lunar energy. The Full Moon (days 13–16) is also powerful for works of majesty and attraction.`
      : khayrSharr === `sharr`
        ? `The best moon condition is the waning phase (days 15–29), especially the New Moon (محاق, days 27–2), when the Moon's light is smallest. Sharr (dark) works require the diminishing lunar energy to dissolve and banish.`
        : `Select Khayr or Sharr in Mizan 8 to receive moon-specific guidance. Generally: waxing for attraction and growth, waning for banishment and removal.`,
    citation: `Al-Shurut p.13 (MN_001-002)`,
    consequence: `Wrong moon phase is like rowing against the tide — the ritual expends effort but achieves little, as the lunar current opposes the intention.`,
  });

  consultation.push({
    n: 8, title: `Current Moon Condition vs Required`,
    body: `The Moon is currently at Day ${moonPhase.lunarDay} (${moonPhase.phaseName}). ${khayrSharr === `khayr` ? (moonPhase.isGoodForKhayr ? `This is GOOD — the Moon is waxing, which supports Khayr works.` : `This is NOT ideal — the Moon is waning. Khayr works are weakened. Wait for the next waxing cycle.`) : khayrSharr === `sharr` ? (moonPhase.isGoodForSharr ? `This is GOOD — the Moon is waning, which supports Sharr works. ${moonPhase.isNewMoon ? `Today is near the New Moon — the most powerful time for dark works.` : ``}` : `This is NOT ideal — the Moon is waxing. Sharr works are weakened. Wait for the waning phase.`) : `Select Khayr or Sharr in Mizan 8 to receive a moon comparison.`}`,
    citation: `Al-Shurut p.13 (MN_001-002)`,
    consequence: `Proceeding with a mismatched moon means the lunar energy either amplifies or contradicts the work. Khayr in a waning moon withers; Sharr in a waxing moon rebounds.`,
  });

  consultation.push({
    n: 9, title: `Best Weekday`,
    body: bestDay
      ? `${MIZAN_DAY_NAMES[bestDay]} is the best weekday for this work. ${bestDayReason}${altDay ? ` ${MIZAN_DAY_NAMES[altDay]} is an acceptable alternative.` : ``}`
      : `No specific weekday restriction was found for this purpose. Consult the planetary hours for timing.`,
    citation: pdfRule?.source || `Al-Shurut p.12`,
    consequence: `The wrong weekday means the day's ruling planet does not govern this type of work, and the spirits of that day will not assist.`,
  });

  consultation.push({
    n: 10, title: `Today's Weekday Analysis`,
    body: `Today is ${MIZAN_DAY_NAMES[currentDayKey]}, ruled by ${dayRuler.planet}. ${PLANET_INFO[dayRuler.planet.toLowerCase()]?.nature_en || ``}. ${dayMatch ? `This matches the prescription for your work.` : bestDay ? `This does not match the prescribed day (${MIZAN_DAY_NAMES[bestDay]}), so the day's planetary energy does not support your ritual.` : `No specific day prescription exists for this work.`}`,
    citation: `Havâss p.50-56 + Al-Shurut p.12`,
    consequence: `Each weekday is governed by a specific planet. Performing a Venus work on a Mars day creates planetary conflict that the spirits recognize and refuse.`,
  });

  consultation.push({
    n: 11, title: `Best Planetary Alignment`,
    body: `The ideal alignment is: ${bestDay ? MIZAN_DAY_NAMES[bestDay] + ` (day)` : `any suitable day`} + ${bestHourPlanet || `correct`} hour${pdfRule?.isNightRequired ? ` + nighttime` : ``}${khayrSharr === `khayr` ? ` + waxing moon` : khayrSharr === `sharr` ? ` + waning/new moon` : ``}${dominant ? ` + ${dominant} element hour` : ``}. When all these align, the ritual has maximum power.`,
    citation: `Al-Shurut pp.12-13, 39-40 + Havâss p.50-56`,
    consequence: `Missing any alignment reduces the ritual's power. The more conditions met, the stronger the result; the more missed, the weaker.`,
  });

  consultation.push({
    n: 12, title: `Current Planetary Condition`,
    body: `Right now: ${MIZAN_DAY_NAMES[currentDayKey]} (ruled by ${dayRuler.planet}), Hour #${currentHourInfo.hourNumber} (${currentHourInfo.planet}), ${isNightTime ? `nighttime` : `daytime`}, Moon Day ${moonPhase.lunarDay} (${moonPhase.phaseName}). ${currentHourInfo.planet === (bestHourPlanet || ``).toLowerCase() ? `The current hour IS the prescribed hour — act now.` : `The current hour is ${currentHourInfo.planet}, not the prescribed ${bestHourPlanet || `—`}.`}`,
    citation: `Live Astro Clock + Al-Shurut p.12`,
    consequence: `The current condition is your window of opportunity. If it matches, act immediately; if not, wait for the alignment.`,
  });

  consultation.push({
    n: 13, title: `Good Periods Today`,
    body: bestWindowsToday.length > 0
      ? `The following periods today are favorable: ${bestWindowsToday.map(w => `${w.startTime}–${w.endTime} (${w.planet} hour, Hour #${w.hourNumber}, ${w.period})`).join(`; `)}. These are the windows when the prescribed planet rules the hour.`
      : `No favorable periods remain today — all prescribed hours have passed.`,
    citation: pdfRule?.source || `Al-Shurut p.12`,
    consequence: `These are your power windows. Missing them means waiting for the next occurrence (possibly a full week).`,
  });

  consultation.push({
    n: 14, title: `Dangerous Periods Today`,
    body: avoidWindowsToday.length > 0
      ? `The following periods are dangerous: ${avoidWindowsToday.map(w => `${w.startTime}–${w.endTime} (${w.planet} — ${w.reason})`).join(`; `)}. In these hours, enemy planets rule, and the work can reverse or harm the practitioner.`
      : `No specifically dangerous periods were identified, but avoid hours not prescribed for your work.`,
    citation: `Al-Shurut p.12 + Havâss p.50-56`,
    consequence: `Performing in a dangerous hour can cause the ritual to rebound — the manuscripts record cases of practitioners becoming ill or possessed after working in enemy hours.`,
  });

  consultation.push({
    n: 15, title: `Forbidden Periods Today`,
    body: pdfRule?.isNightRequired && !isNightTime
      ? `The entire daytime period today is FORBIDDEN for this work. ${pdfRule.pdfName} must be performed at night only. Wait until after sunset.`
      : `No periods are strictly forbidden today, but observe the dangerous hours listed above.`,
    citation: `Al-Shurut p.39-40 (NGT_001-006)`,
    consequence: `The manuscripts state that the Sun suppresses all spirits during daylight. Performing a nocturnal work during the day causes the spirits to refuse and may anger them.`,
  });

  consultation.push({
    n: 16, title: `Day or Night Recommendation`,
    body: dayNightSuitability.status === `optimal` ? `Perform at NIGHT. ${dayNightSuitability.reason}`
      : dayNightSuitability.status === `forbidden` ? `You MUST wait for night. ${dayNightSuitability.reason}`
      : dayNightSuitability.status === `good` ? `Night is strongly recommended. ${dayNightSuitability.reason}`
      : `Daytime is acceptable but night is better. ${dayNightSuitability.reason}`,
    citation: dayNightSuitability.citation,
    consequence: `Night is when spirits are free to act. Daytime works risk the Sun's suppression, which weakens or nullifies the invocation.`,
  });

  consultation.push({
    n: 17, title: `Element Compatibility`,
    body: elementCompatibility.assessed
      ? `${elementCompatibility.reason} ${dominant ? `Face ${elementDirection?.dir || `Qibla`} and place the talisman ${elementPlacement?.placement || `appropriately`}.` : ``}`
      : `No element was detected in your Mizan analysis. Element compatibility cannot be assessed.`,
    citation: elementCompatibility.citation || `Al-Shurut p.37, 42`,
    consequence: `Wrong element alignment means the talisman's spiritual nature conflicts with the environment, reducing its effectiveness.`,
  });

  consultation.push({
    n: 18, title: `Zodiac Compatibility`,
    body: zodiacSuitability.assessed
      ? `${zodiacSuitability.note} ${zodiacSuitability.bestSigns.length > 0 ? `If you know your target's natal sign, matching today strengthens the ritual.` : ``}`
      : `Zodiac compatibility could not be assessed.`,
    citation: `Al-Shurut p.18-19 (Omani Systems A & B)`,
    consequence: `Zodiac mismatch is not fatal, but matching the target's sign to the correct day amplifies the ritual's reach into their life.`,
  });

  consultation.push({
    n: 19, title: `Overall Ritual Strength`,
    body: `The overall strength of this ritual at this moment is: ${verdict} (${score}%). ${verdictReason}`,
    citation: `Composite of all manuscript rules`,
    consequence: score >= 65 ? `The ritual is strong — proceed with confidence.` : score >= 45 ? `The ritual is moderate — proceed with extra focus and strict adherence to timing.` : `The ritual is weak — postpone if possible.`,
  });

  consultation.push({
    n: 20, title: `Confidence Score`,
    body: `Confidence: ${score}%. This score is computed from: ${scoreReasons.join(`; `)}. A score above 65% means the heavens support the work; below 45% means conditions are unfavorable.`,
    citation: `Composite scoring from all sources`,
    consequence: `Low confidence means multiple conditions are missed — the ritual will require more effort and may still fail.`,
  });

  consultation.push({
    n: 21, title: `Warnings`,
    body: warnings.length > 0
      ? warnings.map(w => `⚠ ${w}`).join(` `)
      : `No warnings — all checked conditions are favorable.`,
    citation: `Al-Shurut pp.12-13, 39-40`,
    consequence: `Each warning identifies a condition that, if ignored, reduces the ritual's power or reverses it.`,
  });

  consultation.push({
    n: 22, title: `Conflicting Manuscript Rules`,
    body: conflicts.length > 0
      ? conflicts.map(c => `${c.rule1} vs ${c.rule2}. Resolution: ${c.resolution}`).join(` `)
      : `No conflicts between manuscript rules were detected. All sources agree on the recommendation.`,
    citation: `Multi-source rule merge`,
    consequence: `When manuscripts conflict, the higher-priority source takes precedence. Ignoring the resolution means following a weaker rule.`,
  });

  consultation.push({
    n: 23, title: `Next Best Available Time`,
    body: nextOpportunity
      ? `If today's opportunity has passed, the next best time is: ${nextOpportunity.dayName}${nextOpportunity.isToday ? ` (today)` : ` (${nextOpportunity.daysAhead} day${nextOpportunity.daysAhead > 1 ? `s` : ``} from now)`}, at ${nextOpportunity.startTime}–${nextOpportunity.endTime} (${nextOpportunity.planet} hour, Hour #${nextOpportunity.hour}).`
      : `No future opportunity was found within the next 7 days. Consult the manuscripts for alternative days.`,
    citation: pdfRule?.source || `Al-Shurut p.12`,
    consequence: `Waiting for the next aligned time ensures the ritual has full power. Rushing on an unaligned day wastes effort.`,
  });

  // ═══════════════════════════════════════════════════════════════
  // BUILD RESULT — Enriched Expert Analysis
  // ═══════════════════════════════════════════════════════════════
  return {
    consultation,
    // ── Verdict & Confidence ──
    verdict,
    verdictColor,
    verdictReason,
    confidenceScore: score,
    scoreBreakdown: scoreReasons,

    // ── Ritual Type (auto-inferred) ──
    ritualType: pdfRule?.pdfName || 'General spiritual work',
    ritualTypeDescription: pdfRule?.description || '',
    ritualIntent: pdfRule?.pdfName || 'General spiritual work',
    khayrSharr: khayrSharr || 'Not selected',
    khayrSharrMeaning: khayrSharr === 'khayr' ? 'Benevolence & blessing (الخير)' : khayrSharr === 'sharr' ? 'Power & banishment (الشر)' : 'Not determined from Mizan selections',

    // ── Can perform today? (Yes / No / Limited) ──
    canPerformToday,
    canPerformTodayReason,

    // ── Recommended start/end time ──
    recommendedStart,
    recommendedEnd,
    recommendedStartReason,

    // ── Best planetary hour & ruling planet ──
    bestPlanetaryHour: bestHourPlanet,
    bestRulingPlanet: bestHourPlanet,
    bestDay: bestDay ? MIZAN_DAY_NAMES[bestDay] : null,
    bestDayReason: pdfRule ? `The manuscript ${pdfRule.source} prescribes ${MIZAN_DAY_NAMES[pdfRule.bestDay]} for ${pdfRule.pdfName}.` : 'No specific day prescription found.',
    bestHourReason: pdfRule ? `The ${pdfRule.bestHour} hour is the optimal planetary hour for ${pdfRule.pdfName}. The planets reach the position for this work during this hour.` : 'No specific hour prescription found.',
    altDay: altDay ? MIZAN_DAY_NAMES[altDay] : null,
    altHour: altHourPlanet,

    // ── Moon phase ──
    moonPhase: {
      lunarDay: moonPhase.lunarDay,
      phaseName: moonPhase.phaseName,
      isWaxing: moonPhase.isWaxing,
      isNewMoon: moonPhase.isNewMoon,
      isFullMoon: moonPhase.isFullMoon,
      assessment: khayrSharr === 'khayr'
        ? (moonPhase.isGoodForKhayr ? `The Moon is waxing (Day ${moonPhase.lunarDay}), which is ideal for Khayr works. The growing lunar energy amplifies benevolent operations.` : `The Moon is waning (Day ${moonPhase.lunarDay}). Khayr works are weakened in the waning phase — wait for the next waxing cycle.`)
        : khayrSharr === 'sharr'
          ? (moonPhase.isGoodForSharr ? `The Moon is waning (Day ${moonPhase.lunarDay}), which is ideal for Sharr works. ${moonPhase.isNewMoon ? 'Today is near the New Moon (محاق) — the most powerful time for banishment and dark works.' : ''}` : `The Moon is waxing (Day ${moonPhase.lunarDay}). Sharr works are better in the waning phase — wait for the Moon to begin decreasing.`)
          : `The Moon is at Day ${moonPhase.lunarDay} (${moonPhase.phaseName}). Select Khayr or Sharr in Mizan 8 for specific moon phase guidance.`,
      citation: 'Al-Shurut p.13 (MN_001-002)',
    },

    // ── Day/Night suitability ──
    dayNightSuitability,

    // ── Zodiac suitability ──
    zodiacSuitability,

    // ── Element compatibility ──
    elementCompatibility,
    elementDirection: dominant ? { dir: elementDirection?.dir, ar: elementDirection?.ar } : null,
    elementPlacement: dominant ? { placement: elementPlacement?.placement, ar: elementPlacement?.ar } : null,

    // ── Current Astro Clock status ──
    astroClockStatus,

    // ── Best/avoid windows today ──
    bestWindowsToday,
    avoidWindowsToday,

    // ── Next best opportunity ──
    nextOpportunity,

    // ── Recommended incense ──
    recommendedIncense,

    // ── Rules & citations ──
    rulesApplied,
    warnings,
    bookNotes,
    conflicts,

    // ── Expert narrative (human-readable) ──
    expertNarrative,
    reasoning,
  };
}