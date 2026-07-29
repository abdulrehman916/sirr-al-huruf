/**
 * ASTRO CLOCK — LIVE MOON POSITION CALCULATOR
 * Calculate moon position using mathematical algorithms
 * Astro Clock module only — completely isolated
 */

import { AY_MANAZILLERI } from './astroClockData.js';

// ─────────────────────────────────────────────────────────────────────────────
// MOON POSITION CALCULATION
// Simplified astronomical calculation for moon position
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate moon position for a given date
 * Uses simplified lunar theory for approximate position
 * @param {Date} date - Date to calculate for
 * @returns {Object} Moon position data
 */
export function calculateMoonPosition(date) {
  const J2000 = 2451545.0; // Julian date for J2000.0
  
  // Calculate Julian Date
  const JD = getJulianDate(date);
  const T = (JD - J2000) / 36525; // Julian centuries from J2000
  
  // Mean longitude of the Moon
  let L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  L0 = normalizeAngle(L0);
  
  // Mean elongation of the Moon
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  D = normalizeAngle(D);
  
  // Sun's mean anomaly
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  M = normalizeAngle(M);
  
  // Moon's mean anomaly
  let Mprime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  Mprime = normalizeAngle(Mprime);
  
  // Moon's argument of latitude
  let F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  F = normalizeAngle(F);
  
  // Eccentricity correction
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  
  // Perturbation terms for longitude
  let longitude = L0
    + 6.289 * Math.sin(degToRad(Mprime))
    - 1.274 * E * Math.sin(degToRad(Mprime - 2 * D))
    + 0.658 * Math.sin(degToRad(2 * D))
    + 0.214 * E * Math.sin(degToRad(2 * Mprime))
    - 0.186 * Math.sin(degToRad(M));
  
  longitude = normalizeAngle(longitude);
  
  // Perturbation terms for latitude
  let latitude = F
    + 5.128 * Math.sin(degToRad(F))
    - 0.281 * Math.sin(degToRad(F - 2 * D))
    + 0.278 * Math.sin(degToRad(F + Mprime))
    + 0.173 * Math.sin(degToRad(F + 2 * D));
  
  latitude = normalizeAngle(latitude - 180); // Center around 0
  
  // Distance in Earth radii
  const distance = 60.2666
    - 3.2566 * Math.cos(degToRad(Mprime))
    + 0.6032 * E * Math.cos(degToRad(Mprime - 2 * D))
    + 0.1117 * Math.cos(degToRad(2 * D));
  
  // Phase (illumination fraction)
  const phase = (1 - Math.cos(degToRad(D))) / 2;
  
  // Find current lunar mansion
  const mansion = findLunarMansion(longitude);
  
  return {
    longitude: longitude.toFixed(2),
    latitude: latitude.toFixed(2),
    distance: distance.toFixed(3),
    phase: (phase * 100).toFixed(1),
    // Mean elongation D (Moon longitude − Sun longitude, mean), 0..360.
    // Source: Kashf al-Haqa'iq principle_004 (pp.65-66): lunar day is computed
    // astronomically from conjunction, not by crescent sighting. Used to derive
    // the synodic lunar day (tithi) in useAstroData.
    elongation: D.toFixed(2),
    // Mean elongation D (0..360) determines waxing (0<D<180) vs waning (180<D<360).
    // Illumination % alone cannot distinguish the two halves — both give the same value.
    isWaxing: D > 0 && D < 180,
    mansion: mansion,
    zodiacSign: getZodiacSign(longitude),
    nakshatra: mansion?.name_en || 'Unknown',
    calculatedFor: date.toISOString()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function getJulianDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60;
  
  let Y = year;
  let M = month;
  
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5 + hour / 24;
}

function normalizeAngle(angle) {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  return angle;
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

// Manuscript mansion start boundaries (absolute tropical degrees), in
// mansion order 1..28. Source: Havâss'ın Derinlikleri, PDF2 p.64-74 —
// AY_MANAZILLERI[].baslama_siniri. The manuscript gives UNEQUAL widths
// (mostly 13°, some 12°), so equal 360/28 division is NOT used.
//   1 Sheratayn 25°, 2 Buteyn 38°, 3 Süreyya 51°, 4 Düberan 63°,
//   5 Hak'a 76°, 6 Hena 89°, 7 Zira 102°, 8 Nesre 115°, 9 Tarfe 128°,
//   10 Cebhe 141°, 11 Zebra 153°, 12 Surfa 166°, 13 Ava 179°,
//   14 Semmak 192°, 15 Gufur 205°, 16 Zibana 218°, 17 İklil 231°,
//   18 Kalp 243°, 19 Şevle 256°, 20 Neayim 269°, 21 Belde 282°,
//   22 Saadüzzabih 295°, 23 Saudbela 308°, 24 Saadüssuud 321°,
//   25 Saadülahbiyye 333°, 26 Ferülmukaddem 346°, 27 Ferülmüahhir 359°,
//   28 Erreşa 12° (wraps). Tropical frame (Havâss uses tropical sign names).
export const MANSION_START_DEGREES = [
  25, 38, 51, 63, 76, 89, 102, 115, 128, 141, 153, 166, 179, 192, 205, 218,
  231, 243, 256, 269, 282, 295, 308, 321, 333, 346, 359, 12,
];

// Map a tropical ecliptic longitude (0..360) to its manuscript mansion index
// (0..27, = AY_MANAZILLERI index). Handles the wrap: m27 spans [359,360)∪[0,12),
// m28 spans [12,25), m1 starts at 25°.
export function mansionIndexFromLongitude(longitude) {
  const lon = ((longitude % 360) + 360) % 360;
  if (lon >= 12 && lon < 25) return 27;            // m28 Erreşa
  if (lon >= 359 || lon < 12) return 26;           // m27 Ferülmüahhir (wraps 0°)
  for (let i = 0; i < 26; i++) {
    if (lon >= MANSION_START_DEGREES[i] && lon < MANSION_START_DEGREES[i + 1]) return i;
  }
  return 0;
}

function findLunarMansion(longitude) {
  const mansionIndex = mansionIndexFromLongitude(longitude);
  if (mansionIndex >= 0 && mansionIndex < 28) {
    return AY_MANAZILLERI[mansionIndex];
  }
  return null;
}

function getZodiacSign(longitude) {
  const signWidth = 30;
  const signIndex = Math.floor(longitude / signWidth);
  
  const signs = [
    { name_en: 'Aries', name_ml: 'മേഷം', symbol: '♈' },
    { name_en: 'Taurus', name_ml: 'ഇടവം', symbol: '♉' },
    { name_en: 'Gemini', name_ml: 'മിഥുനം', symbol: '♊' },
    { name_en: 'Cancer', name_ml: 'കർക്കിടകം', symbol: '♋' },
    { name_en: 'Leo', name_ml: 'ചിങ്ങം', symbol: '♌' },
    { name_en: 'Virgo', name_ml: 'കന്നി', symbol: '♍' },
    { name_en: 'Libra', name_ml: 'തുലാം', symbol: '♎' },
    { name_en: 'Scorpio', name_ml: 'വൃശ്ചികം', symbol: '♏' },
    { name_en: 'Sagittarius', name_ml: 'ധനു', symbol: '♐' },
    { name_en: 'Capricorn', name_ml: 'മകരം', symbol: '♑' },
    { name_en: 'Aquarius', name_ml: 'കുംഭം', symbol: '♒' },
    { name_en: 'Pisces', name_ml: 'മീനം', symbol: '♓' }
  ];
  
  return signs[signIndex] || signs[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// MOON TRANSIT CALCULATIONS
// Calculate upcoming sign and mansion transitions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate upcoming Moon sign and mansion transits
 * @param {Date} fromDate - Starting date for calculations
 * @returns {Object} Transit data with sign and mansion transitions
 */
export function calculateMoonTransits(fromDate = new Date()) {
  const signTransits = [];
  const mansionTransits = { current: null, next: null, upcoming: [] };
  
  // Get current moon position
  const currentPosition = calculateMoonPosition(fromDate);
  const currentLongitude = parseFloat(currentPosition.longitude);
  
  // Calculate current sign
  const currentSignIndex = Math.floor(currentLongitude / 30);
  const signs = getZodiacSigns();
  
  // Find when moon enters next sign
  const nextSignIndex = (currentSignIndex + 1) % 12;
  const nextSignBoundary = nextSignIndex * 30;
  
  // Calculate time to next sign entry
  const moonSpeed = 0.5; // degrees per hour (average)
  const degreesToNextSign = nextSignBoundary - currentLongitude;
  const hoursToNextSign = degreesToNextSign / moonSpeed;
  
  // Current sign transit
  signTransits.push({
    name: signs[currentSignIndex].name_en,
    symbol: signs[currentSignIndex].symbol,
    entryTime: fromDate,
    remainingTime: hoursToNextSign * 60 * 60 * 1000 // ms
  });
  
  // Next sign transit
  const nextSignTime = new Date(fromDate.getTime() + hoursToNextSign * 60 * 60 * 1000);
  signTransits.push({
    name: signs[nextSignIndex].name_en,
    symbol: signs[nextSignIndex].symbol,
    entryTime: nextSignTime
  });
  
  // Calculate next 5 sign transits
  for (let i = 1; i <= 5; i++) {
    const signIndex = (currentSignIndex + i) % 12;
    const signTime = new Date(nextSignTime.getTime() + (i * 2.5 * 24 * 60 * 60 * 1000)); // ~2.5 days per sign
    signTransits.push({
      name: signs[signIndex].name_en,
      symbol: signs[signIndex].symbol,
      entryTime: signTime
    });
  }
  
  // Calculate mansion transits — manuscript boundaries (Havâss PDF2 p.64-74),
  // unequal widths via MANSION_START_DEGREES (not equal 360/28 division).
  const currentMansionIndex = mansionIndexFromLongitude(currentLongitude);
  const mansions = AY_MANAZILLERI;
  // Width of the CURRENT mansion (for time-to-next-mansion estimate).
  const curStart = MANSION_START_DEGREES[currentMansionIndex];
  const nextStart = MANSION_START_DEGREES[(currentMansionIndex + 1) % 28];
  const mansionWidth = ((nextStart - curStart + 360) % 360) || 12.857;
  
  // Current mansion
  const degreesToNextMansion = mansionWidth - (currentLongitude % mansionWidth);
  const hoursToNextMansion = degreesToNextMansion / moonSpeed;
  
  mansionTransits.current = {
    number: mansions[currentMansionIndex]?.no || currentMansionIndex + 1,
    name: mansions[currentMansionIndex]?.name_en || `Mansion ${currentMansionIndex + 1}`,
    arabic: mansions[currentMansionIndex]?.harfi || "",
    entryTime: fromDate,
    remainingTime: hoursToNextMansion * 60 * 60 * 1000 // ms
  };
  
  // Next mansion
  const nextMansionIndex = (currentMansionIndex + 1) % 28;
  const nextMansionTime = new Date(fromDate.getTime() + hoursToNextMansion * 60 * 60 * 1000);
  
  mansionTransits.next = {
    number: mansions[nextMansionIndex]?.no || nextMansionIndex + 1,
    name: mansions[nextMansionIndex]?.name_en || `Mansion ${nextMansionIndex + 1}`,
    arabic: mansions[nextMansionIndex]?.harfi || "",
    entryTime: nextMansionTime
  };
  
  // Next 5 mansions
  for (let i = 1; i <= 5; i++) {
    const mansionIndex = (currentMansionIndex + i) % 28;
    const mansionTime = new Date(nextMansionTime.getTime() + (i * 0.9 * 24 * 60 * 60 * 1000)); // ~0.9 days per mansion
    
    mansionTransits.upcoming.push({
      number: mansions[mansionIndex]?.no || mansionIndex + 1,
      name: mansions[mansionIndex]?.name_en || `Mansion ${mansionIndex + 1}`,
      arabic: mansions[mansionIndex]?.harfi || "",
      entryTime: mansionTime
    });
  }
  
  return { signTransits, mansionTransits };
}

function getZodiacSigns() {
  return [
    { name_en: 'Aries', name_ml: 'മേഷം', symbol: '♈' },
    { name_en: 'Taurus', name_ml: 'ഇടവം', symbol: '♉' },
    { name_en: 'Gemini', name_ml: 'മിഥുനം', symbol: '♊' },
    { name_en: 'Cancer', name_ml: 'കർക്കിടകം', symbol: '♋' },
    { name_en: 'Leo', name_ml: 'ചിങ്ങം', symbol: '♌' },
    { name_en: 'Virgo', name_ml: 'കന്നി', symbol: '♍' },
    { name_en: 'Libra', name_ml: 'തുലാം', symbol: '♎' },
    { name_en: 'Scorpio', name_ml: 'വൃശ്ചികം', symbol: '♏' },
    { name_en: 'Sagittarius', name_ml: 'ധനു', symbol: '♐' },
    { name_en: 'Capricorn', name_ml: 'മകരം', symbol: '♑' },
    { name_en: 'Aquarius', name_ml: 'കുംഭം', symbol: '♒' },
    { name_en: 'Pisces', name_ml: 'മീനം', symbol: '♓' }
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// MOON PHASE DESCRIPTION
// ─────────────────────────────────────────────────────────────────────────────
export function getMoonPhaseDescription(phase, isWaxing) {
  const phasePercent = parseFloat(phase);

  // New / Full are illumination-only (unambiguous at the cycle extremes).
  if (phasePercent < 5) return { en: 'New Moon', ml: 'അമാവാസി' };
  if (phasePercent >= 95) return { en: 'Full Moon', ml: 'പൗർണ്ണമി' };

  // Waxing/waning from the mean elongation (D in 0..360):
  //   waxing  = 0  < D < 180   (New → Full)
  //   waning = 180 < D < 360  (Full → New)
  // The previous implementation labelled the ENTIRE waning half as waxing
  // (e.g. Last Quarter → "First Quarter", Waning Crescent → "Waxing Crescent")
  // because it used illumination % alone, which is identical for both halves.
  // `isWaxing` is passed from calculateMoonPosition (which has D); when a
  // legacy caller omits it, we default to waxing to preserve prior behavior.
  const waxing = isWaxing !== undefined ? isWaxing : true;

  if (waxing) {
    if (phasePercent < 25) return { en: 'Waxing Crescent', ml: 'വളരുന്ന പിറവം' };
    if (phasePercent < 50) return { en: 'First Quarter', ml: 'പകുതി പിറവം' };
    return { en: 'Waxing Gibbous', ml: 'കുത്തുപിറവം' };
  }
  if (phasePercent < 25) return { en: 'Waning Crescent', ml: 'തേയുന്ന പിറവം' };
  if (phasePercent < 50) return { en: 'Last Quarter', ml: 'പകുതി തേയുന്ന' };
  return { en: 'Waning Gibbous', ml: 'തേയുന്ന പിറവം' };
}