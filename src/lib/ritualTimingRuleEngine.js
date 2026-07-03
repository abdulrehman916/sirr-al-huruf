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

  // ── STEP 10: Check if today is a valid day ──
  let canPerformToday = false;
  let dayMatch = false;
  if (bestDay) {
    dayMatch = currentDayKey === bestDay || (altDay && currentDayKey === altDay);
    if (dayMatch) {
      canPerformToday = bestWindowsToday.length > 0;
      if (canPerformToday) {
        rulesApplied.push({ id: 'DAY_MATCH', desc: `Today (${MIZAN_DAY_NAMES[currentDayKey]}) matches the recommended day for ${pdfRule?.pdfName}`, source: pdfRule?.source || '' });
      } else if (bestWindowsToday.length === 0) {
        // Today is the right day but the best hours have passed — check if any are upcoming
        const allMatching = findHoursByPlanet(todayHours, bestHourPlanet);
        if (allMatching.length > 0) {
          // All passed
          warnings.push(`Today is the correct day but all ${bestHourPlanet} hours have passed. Wait for the next occurrence.`);
        }
      }
    } else {
      warnings.push(`Today is ${MIZAN_DAY_NAMES[currentDayKey]}, but the recommended day is ${MIZAN_DAY_NAMES[bestDay]}${altDay ? ' or ' + MIZAN_DAY_NAMES[altDay] : ''}`);
    }
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

  // ── STEP 13: Determine verdict ──
  let verdict, verdictColor, verdictReason;
  if (score >= 80) { verdict = 'Excellent'; verdictColor = '#4ADE80'; verdictReason = 'All major conditions align'; }
  else if (score >= 60) { verdict = 'Good'; verdictColor = '#FBBF24'; verdictReason = 'Most conditions favorable'; }
  else if (score >= 40) { verdict = 'Neutral'; verdictColor = '#818CF8'; verdictReason = 'Mixed conditions — proceed with caution'; }
  else { verdict = 'Avoid'; verdictColor = '#F87171'; verdictReason = 'Multiple unfavorable conditions'; }

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

  // ═══════════════════════════════════════════════════════════════
  // BUILD RESULT
  // ═══════════════════════════════════════════════════════════════
  return {
    verdict,
    verdictColor,
    verdictReason,
    confidenceScore: score,
    scoreBreakdown: scoreReasons,

    canPerformToday,
    dayMatch,

    currentPlanetaryHour: {
      number: currentHourInfo.hourNumber,
      planet: currentHourInfo.planet,
      symbol: PLANET_INFO[currentHourInfo.planet]?.symbol || '',
      isDay: currentHourInfo.isDay,
      endsAt: currentHourInfo.hourEnd,
      remaining: currentHourInfo.remainingTime,
    },
    currentDayRuler: dayRuler.planet,
    isNightTime,
    moonPhase: {
      lunarDay: moonPhase.lunarDay,
      phaseName: moonPhase.phaseName,
      isWaxing: moonPhase.isWaxing,
      isNewMoon: moonPhase.isNewMoon,
      isFullMoon: moonPhase.isFullMoon,
    },

    bestWindowsToday,
    avoidWindowsToday,

    nextOpportunity, // { dayName, date, hour, planet, startTime, endTime, daysAhead, isToday }

    elementDirection: dominant ? { dir: elementDirection?.dir, ar: elementDirection?.ar } : null,
    elementPlacement: dominant ? { placement: elementPlacement?.placement, ar: elementPlacement?.ar } : null,

    recommendedIncense,

    rulesApplied,
    warnings,
    bookNotes,
    conflicts,

    reasoning,

    // Summary for display
    ritualIntent: pdfRule?.pdfName || 'General spiritual work',
    bestDay: bestDay ? MIZAN_DAY_NAMES[bestDay] : null,
    bestHour: bestHourPlanet,
    altDay: altDay ? MIZAN_DAY_NAMES[altDay] : null,
    altHour: altHourPlanet,
  };
}