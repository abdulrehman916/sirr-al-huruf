// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK ENGINE — HAVÂSS'IN DERİNLİKLERİ (Bülent Kısa, 2004)
// Completely independent module. No shared logic with any other module.
// All rules sourced exclusively from the PDF manuscripts.
// ═══════════════════════════════════════════════════════════════

import {
  PLANETS,
  PLANETARY_HOUR_SEQUENCE,
  DAYTIME_HOURS_TABLE,
  NIGHTTIME_HOURS_TABLE,
  AY_MENAZILLERI,
  MOON_PHASE_RULES,
  TIMING_CALCULATION_RULES
} from './astroClockData.js';

// ── Day key mapping (for table lookup) ────────────────────────
// JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const DAY_KEYS = {
  0: 'paz',  // Pazar / Sunday
  1: 'pts',  // Pazartesi / Monday
  2: 'sal',  // Salı / Tuesday
  3: 'car',  // Çarşamba / Wednesday
  4: 'per',  // Perşembe / Thursday
  5: 'cum',  // Cuma / Friday
  6: 'cts'   // Cumartesi / Saturday
};

// Night table columns use the PREVIOUS day's key (e.g. Pazartesi gecesi = night connecting Pazar→Pazartesi)
// The table header for night = [pts, sal, car, per, cum, cts, paz]
// Pazartesi gecesi (Mon night) = pts column, meaning night after Sunday connecting to Monday
const NIGHT_DAY_KEYS = {
  0: 'paz',  // Pazar gecesi (Sun night = night connecting Sat→Sun)
  1: 'pts',  // Pazartesi gecesi (Mon night = night connecting Sun→Mon)
  2: 'sal',
  3: 'car',
  4: 'per',
  5: 'cum',
  6: 'cts'
};

// ── Core calculation: get sunrise/sunset in minutes from midnight ─
// Source: Pages 55-59 — Takvim-based calculation method
// takvimGunesMinutes: minutes from midnight of the takvim "Güneş" column
// takvimAksamMinutes: minutes from midnight of the takvim "Akşam" column
// Rule: +12 minutes for actual sunrise, -12 minutes for actual sunset
export function getActualSunTimes(takvimGunesMinutes, takvimAksamMinutes) {
  return {
    sunrise: takvimGunesMinutes + 12,  // +12 dakika (p.57)
    sunset: takvimAksamMinutes - 12    // -12 dakika (p.57)
  };
}

// ── Calculate daytime hour duration (minutes) ─────────────────
// Source: Page 58 — Rule: (sunset - sunrise) / 12
export function getDaytimeHourDuration(sunriseMinutes, sunsetMinutes) {
  const totalDaytimeMinutes = sunsetMinutes - sunriseMinutes;
  return Math.floor(totalDaytimeMinutes / 12); // tam sayı alınır (p.58)
}

// ── Calculate nighttime hour duration (minutes) ───────────────
// Source: Page 59 — Rule: ((nextSunrise + 1440) - sunset) / 12
export function getNighttimeHourDuration(sunsetMinutes, nextSunriseMinutes) {
  const midnight = 24 * 60;
  let totalNightMinutes;
  if (nextSunriseMinutes < sunsetMinutes) {
    // Sunrise is next day
    totalNightMinutes = (midnight - sunsetMinutes) + nextSunriseMinutes;
  } else {
    totalNightMinutes = nextSunriseMinutes - sunsetMinutes;
  }
  return Math.floor(totalNightMinutes / 12);
}

// ── Get planet ruling a specific daytime hour ─────────────────
// Source: Pages 53-54 — GÜNDÜZ SAATLERİ TABLOSU
// dayOfWeek: 0-6 (JS standard, 0=Sunday)
// hourNumber: 1-12
export function getDaytimePlanetForHour(dayOfWeek, hourNumber) {
  if (hourNumber < 1 || hourNumber > 12) return null;
  const dayKey = DAY_KEYS[dayOfWeek];
  const row = DAYTIME_HOURS_TABLE.find(r => r.hour === hourNumber);
  if (!row || !dayKey) return null;
  const planetId = row[dayKey];
  return PLANETS.find(p => p.id === planetId) || null;
}

// ── Get planet ruling a specific nighttime hour ───────────────
// Source: Pages 54 — GECE SAATLERİ TABLOSU
// dayOfWeek: day of the CURRENT night (night connecting previous day to this day)
// hourNumber: 1-12
export function getNighttimePlanetForHour(dayOfWeek, hourNumber) {
  if (hourNumber < 1 || hourNumber > 12) return null;
  const dayKey = NIGHT_DAY_KEYS[dayOfWeek];
  const row = NIGHTTIME_HOURS_TABLE.find(r => r.hour === hourNumber);
  if (!row || !dayKey) return null;
  const planetId = row[dayKey];
  return PLANETS.find(p => p.id === planetId) || null;
}

// ── Get the ruling planet for a day ───────────────────────────
// Source: Page 50 — Each day's ruling planet
export function getDayRulingPlanet(dayOfWeek) {
  return PLANETS.find(p => p.day_number === dayOfWeek) || null;
}

// ── Calculate full schedule for a given day ───────────────────
// sunriseMinutes, sunsetMinutes: actual times (after +/-12 correction)
// nextSunriseMinutes: actual sunrise of next day
// Returns array of {hourNumber, planetId, planetName, startMinutes, endMinutes, isDaytime}
export function calculateFullDaySchedule(dayOfWeek, sunriseMinutes, sunsetMinutes, nextSunriseMinutes) {
  const dayDuration = getDaytimeHourDuration(sunriseMinutes, sunsetMinutes);
  const nightDuration = getNighttimeHourDuration(sunsetMinutes, nextSunriseMinutes);
  
  const schedule = [];
  
  // Daytime hours (1-12)
  for (let h = 1; h <= 12; h++) {
    const planet = getDaytimePlanetForHour(dayOfWeek, h);
    const startMin = sunriseMinutes + (h - 1) * dayDuration;
    const endMin = startMin + dayDuration;
    schedule.push({
      hourNumber: h,
      planetId: planet?.id || null,
      planetName: planet?.name_turkish || null,
      startMinutes: startMin,
      endMinutes: endMin,
      isDaytime: true
    });
  }
  
  // Nighttime hours (1-12)
  for (let h = 1; h <= 12; h++) {
    const nextDay = (dayOfWeek + 1) % 7;
    const planet = getNighttimePlanetForHour(nextDay, h);
    const startMin = sunsetMinutes + (h - 1) * nightDuration;
    const endMin = startMin + nightDuration;
    schedule.push({
      hourNumber: h + 12,
      planetId: planet?.id || null,
      planetName: planet?.name_turkish || null,
      startMinutes: startMin,
      endMinutes: endMin,
      isDaytime: false
    });
  }
  
  return schedule;
}

// ── Get current hour slot from a schedule ─────────────────────
export function getCurrentHourSlot(schedule, currentMinutes) {
  return schedule.find(slot => currentMinutes >= slot.startMinutes && currentMinutes < slot.endMinutes) || null;
}

// ── Format minutes-from-midnight as HH:MM ─────────────────────
export function formatMinutes(minutes) {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

// ── Convert HH:MM string to minutes from midnight ─────────────
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// ── Get planet info by ID ──────────────────────────────────────
export function getPlanetById(id) {
  return PLANETS.find(p => p.id === id) || null;
}

// ── Get lunar mansion for a zodiac degree ─────────────────────
// totalDegree: 0-359 (Aries=0, Taurus=30, Gemini=60, etc.)
// Returns the Ay Menazil entry
export function getLunarMansionForDegree(totalDegree) {
  // Map zodiac sign and degree to find the correct mansion
  const signs = ["Koç","Boğa","İkizler","Yengeç","Arslan","Başak","Terazi","Akrep","Yay","Oğlak","Kova","Balık"];
  const signIndex = Math.floor(totalDegree / 30);
  const degreeInSign = totalDegree % 30;
  const signName = signs[signIndex];
  
  // Find the applicable mansion
  // Mansions start at specific degrees within signs
  // We look for the last mansion whose start is <= current position
  let applicableMansion = null;
  for (const mansion of AY_MENAZILLERI) {
    if (mansion.starting_sign === signName && mansion.starting_degree <= degreeInSign) {
      applicableMansion = mansion;
    } else if (mansion.starting_sign === signName && mansion.starting_degree > degreeInSign) {
      break;
    }
  }
  
  // If no mansion found in current sign, check if we're before the first mansion of this sign
  // In that case, use the last mansion from the previous sign
  if (!applicableMansion) {
    // Find last mansion from previous sign
    const prevSignIndex = (signIndex - 1 + 12) % 12;
    const prevSignName = signs[prevSignIndex];
    const prevSignMansions = AY_MENAZILLERI.filter(m => m.starting_sign === prevSignName);
    if (prevSignMansions.length > 0) {
      applicableMansion = prevSignMansions[prevSignMansions.length - 1];
    }
  }
  
  return applicableMansion;
}

// ── Engine status ───────────────────────────────────────────────
export const ASTRO_CLOCK_ENGINE_STATUS = {
  version: '1.0.0',
  status: 'DATA_FOUNDATION_COMPLETE',
  calculationsLoaded: true,
  pdfRulesIngested: true,
  source: "Havâss'ın Derinlikleri — Bülent Kısa (2004)",
  pages_processed: 100,
  tables_extracted: 21,
  note: 'Data foundation complete. Calculator/recommendation engines await explicit implementation request.',
};

export { PLANETS, PLANETARY_HOUR_SEQUENCE, AY_MENAZILLERI, MOON_PHASE_RULES, TIMING_CALCULATION_RULES };