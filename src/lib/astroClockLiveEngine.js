/**
 * ASTRO CLOCK LIVE ENGINE — Planetary Hour Calculations
 * Real-time planetary hour system with sunrise/sunset based calculations
 * Astro Clock module only — completely isolated
 */

import { TAHA_HOUR_TABLE_DAY, TAHA_WEEKDAY_RULERS } from './astroClockTahaData.js';
import { PLANETARY_DAY_RULERS } from './astroClockData.js';

// ─────────────────────────────────────────────────────────────────────────────
// PLANET DATA — Combined from all sources
// ─────────────────────────────────────────────────────────────────────────────
export const PLANET_INFO = {
  sun: { 
    name_ml: "സൂര്യൻ", 
    name_en: "Sun", 
    symbol: "☉", 
    nature_ml: "ഗ്രഹങ്ങളുടെ രാജാവ്", 
    nature_en: "King of Planets",
    benefits_ml: ["നേതൃത്വം", "ഐശ്വര്യം", "ഉദ്യോഗ ഉന്നതി"],
    benefits_en: ["Leadership", "Wealth", "Career Success"],
    warnings_ml: ["തുലാം രാശിയിൽ ദുർബലൻ"],
    warnings_en: ["Weak in Libra"]
  },
  moon: { 
    name_ml: "ചന്ദ്രൻ", 
    name_en: "Moon", 
    symbol: "☽", 
    nature_ml: "ഏറ്റവും ശക്തമായ ഗ്രഹം", 
    nature_en: "Most Influential Planet",
    benefits_ml: ["മാനസിക ശാന്തത", "ആരോഗ്യം", "ഗൃഹ ഐശ്വര്യം"],
    benefits_en: ["Mental Peace", "Health", "Domestic Harmony"],
    warnings_ml: ["വൃശ്ചികത്തിൽ നീചം (3°)"]
  },
  mars: { 
    name_ml: "ചൊവ്വ", 
    name_en: "Mars", 
    symbol: "♂", 
    nature_ml: "ദ്രോഹ ഗ്രഹം", 
    nature_en: "Malefic Planet",
    benefits_ml: ["ധൈര്യം", "ശക്തി", "വിജയം"],
    benefits_en: ["Courage", "Strength", "Victory"],
    warnings_ml: ["ദാമ്പത്യ ക്ലേശം സാധ്യത"]
  },
  mercury: { 
    name_ml: "ബുധൻ", 
    name_en: "Mercury", 
    symbol: "☿", 
    nature_ml: "ഐശ്വര്യ ഗ്രഹം", 
    nature_en: "Planet of Wealth",
    benefits_ml: ["ജ്ഞാനം", "വ്യാപാരം", "ആശയ വ്യക്തത"],
    benefits_en: ["Knowledge", "Business", "Clear Communication"],
    warnings_ml: ["ദ്രോഹ ഗ്രഹത്തോടൊപ്പം ദ്രോഹ ഫലം"]
  },
  jupiter: { 
    name_ml: "ഗുരു", 
    name_en: "Jupiter", 
    symbol: "♃", 
    nature_ml: "ഏറ്റവും ശുഭ ഗ്രഹം", 
    nature_en: "Most Benefic Planet",
    benefits_ml: ["ആദ്ധ്യാത്മിക ഉന്നതി", "ഐശ്വര്യം", "ജ്ഞാനം"],
    benefits_en: ["Spiritual Growth", "Wealth", "Wisdom"],
    warnings_ml: []
  },
  venus: { 
    name_ml: "ശുക്രൻ", 
    name_en: "Venus", 
    symbol: "♀", 
    nature_ml: "പ്രേമ-ഭക്തി ഗ്രഹം", 
    nature_en: "Planet of Love",
    benefits_ml: ["പ്രണയം", "ആകർഷണം", "കലകൾ"],
    benefits_en: ["Love", "Attraction", "Arts"],
    warnings_ml: ["കന്നിയിൽ ദുർബലൻ"]
  },
  saturn: { 
    name_ml: "ശനി", 
    name_en: "Saturn", 
    symbol: "♄", 
    nature_ml: "മഹാ ദ്രോഹ ഗ്രഹം", 
    nature_en: "Greater Malefic",
    benefits_ml: ["ദ്രോഹ ദൂരീകരണം"],
    benefits_en: ["Obstacle Removal"],
    warnings_ml: ["ഒന്നാം, 4, 7, 10 ഭവനത്തിൽ ദ്രോഹ ഫലം"]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DAY DATA
// ─────────────────────────────────────────────────────────────────────────────
export const DAY_INFO = {
  0: { // Sunday
    name_ml: "ഞായർ",
    name_en: "Sunday",
    ruler: "sun",
    benefits_ml: ["പണം", "പ്രതീക്ഷ", "നേതൃക്കളിൽ നിന്ന് അംഗീകാരം", "സൗഹൃദം", "ശാരീരിക ശക്തി"],
    benefits_en: ["Money", "Hope", "Favor from Leaders", "Friendship", "Physical Strength"],
    warnings_ml: ["അഹങ്കാരം ഒഴിവാക്കുക"],
    warnings_en: ["Avoid Arrogance"]
  },
  1: { // Monday
    name_ml: "തിങ്കൾ",
    name_en: "Monday",
    ruler: "moon",
    benefits_ml: ["യാത്രകൾ", "പ്രണയം", "ജല സംബന്ധിത കാര്യങ്ങൾ", "സ്വപ്നങ്ങൾ", "സഹജാവബോധം"],
    benefits_en: ["Travel", "Love", "Water-related Matters", "Dreams", "Intuition"],
    warnings_ml: []
  },
  2: { // Tuesday
    name_ml: "ചൊവ്വ",
    name_en: "Tuesday",
    ruler: "mars",
    benefits_ml: ["ധൈര്യം", "സൈനിക വിജയം", "ശത്രുക്കളെ നേരിടൽ"],
    benefits_en: ["Courage", "Military Success", "Confronting Enemies"],
    warnings_ml: ["പുതിയ കാര്യങ്ങൾ ആരംഭിക്കാൻ ഉചിതമല്ല"],
    warnings_en: ["Not suitable for new beginnings"]
  },
  3: { // Wednesday
    name_ml: "ബുധൻ",
    name_en: "Wednesday",
    ruler: "mercury",
    benefits_ml: ["ആശയ വിനിമയം", "വ്യാപാരം", "കലകൾ", "ശാസ്ത്രം"],
    benefits_en: ["Communication", "Business", "Arts", "Science"],
    warnings_ml: []
  },
  4: { // Thursday
    name_ml: "വ്യാഴം",
    name_en: "Thursday",
    ruler: "jupiter",
    benefits_ml: ["ഐശ്വര്യം", "സൗഹൃദം", "ആരോഗ്യം", "ജ്ഞാനം"],
    benefits_en: ["Wealth", "Friendship", "Health", "Knowledge"],
    warnings_ml: []
  },
  5: { // Friday
    name_ml: "വെള്ളി",
    name_en: "Friday",
    ruler: "venus",
    benefits_ml: ["പ്രണയം", "സൗഹൃദം", "യാത്ര", "വിനോദം"],
    benefits_en: ["Love", "Friendship", "Travel", "Entertainment"],
    warnings_ml: []
  },
  6: { // Saturday
    name_ml: "ശനി",
    name_en: "Saturday",
    ruler: "saturn",
    benefits_ml: ["ആദ്ധ്യാത്മിക കൃത്യങ്ങൾ", "സ്ഥിരത", "ദീർഘകാല ആസൂത്രണം"],
    benefits_en: ["Spiritual Work", "Stability", "Long-term Planning"],
    warnings_ml: ["പുതിയ സംരംഭങ്ങൾ ഒഴിവാക്കുക"],
    warnings_en: ["Avoid New Ventures"]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PLANETARY HOUR SEQUENCE (Chaldean Order)
// ─────────────────────────────────────────────────────────────────────────────
export const PLANET_SEQUENCE = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];

// ─────────────────────────────────────────────────────────────────────────────
// GET PLANETARY HOUR FOR CURRENT TIME
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Calculate current planetary hour
 * @param {Date} date - Current date/time
 * @param {number} sunrise - Sunrise hour (e.g., 6.5 for 6:30 AM)
 * @param {number} sunset - Sunset hour (e.g., 18.25 for 6:15 PM)
 * @returns {Object} Current hour info
 */
export function getCurrentPlanetaryHour(date, sunrise = 6.5, sunset = 18.25) {
  const dayOfWeek = date.getDay(); // 0=Sunday, 6=Saturday
  const currentHour = date.getHours() + date.getMinutes() / 60;
  
  // Calculate day and night duration
  const dayDuration = sunset - sunrise;
  const nightDuration = 24 - dayDuration;
  
  // Calculate hour duration
  const dayHourDuration = dayDuration / 12;
  const nightHourDuration = nightDuration / 12;
  
  // Determine if current time is day or night
  const isDay = currentHour >= sunrise && currentHour < sunset;
  
  // Calculate which hour we're in
  let hourIndex;
  let hourDuration;
  let hourStart;
  let hourEnd;
  
  if (isDay) {
    hourIndex = Math.floor((currentHour - sunrise) / dayHourDuration);
    hourDuration = dayHourDuration;
    hourStart = sunrise + hourIndex * dayHourDuration;
    hourEnd = hourStart + dayHourDuration;
  } else {
    // Night calculation
    let nightStart = sunset;
    if (currentHour < sunrise) {
      // Early morning (before sunrise)
      nightStart = sunset - 24;
    }
    hourIndex = Math.floor((currentHour - nightStart) / nightHourDuration);
    hourDuration = nightHourDuration;
    hourStart = nightStart + hourIndex * nightHourDuration;
    hourEnd = hourStart + nightHourDuration;
    
    // Normalize hourIndex for night hours (0-11)
    if (hourIndex < 0) hourIndex += 12;
    if (hourIndex >= 12) hourIndex -= 12;
  }
  
  // Get day ruler
  const dayRuler = getDayRuler(dayOfWeek);
  
  // Calculate planet for this hour
  const planetIndex = (dayRuler.index + hourIndex) % 7;
  const planet = PLANET_SEQUENCE[planetIndex];
  
  // Calculate remaining time
  const remainingMinutes = (hourEnd - currentHour) * 60;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = Math.floor(remainingMinutes % 60);
  
  return {
    hourNumber: hourIndex + 1,
    planet,
    planetInfo: PLANET_INFO[planet],
    isDay,
    hourStart: formatTime(hourStart),
    hourEnd: formatTime(hourEnd),
    duration: formatDuration(hourDuration),
    remainingTime: `${remainingHours}h ${remainingMins}m`,
    dayRuler: PLANET_SEQUENCE[dayRuler.index],
    dayOfWeek,
    nextPlanet: PLANET_SEQUENCE[(planetIndex + 1) % 7]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET DAY RULER
// ─────────────────────────────────────────────────────────────────────────────
export function getDayRuler(dayOfWeek) {
  const rulers = {
    0: { planet: 'sun', index: 3 },      // Sunday
    1: { planet: 'moon', index: 6 },     // Monday
    2: { planet: 'mars', index: 2 },     // Tuesday
    3: { planet: 'mercury', index: 5 },  // Wednesday
    4: { planet: 'jupiter', index: 1 },  // Thursday
    5: { planet: 'venus', index: 4 },    // Friday
    6: { planet: 'saturn', index: 0 }    // Saturday
  };
  return rulers[dayOfWeek];
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT TIME
// ─────────────────────────────────────────────────────────────────────────────
function formatTime(decimalHour) {
  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);
  const h = hours >= 24 ? hours - 24 : hours;
  const hDisplay = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = hours >= 12 && hours < 24 ? 'PM' : 'AM';
  return `${hDisplay}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT DURATION
// ─────────────────────────────────────────────────────────────────────────────
function formatDuration(decimalHours) {
  const minutes = Math.round(decimalHours * 60);
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL 24 HOURS FOR A DAY
// ─────────────────────────────────────────────────────────────────────────────
export function getAllPlanetaryHours(date, sunrise = 6.5, sunset = 18.25) {
  const dayOfWeek = date.getDay();
  const dayRuler = getDayRuler(dayOfWeek);
  
  const dayDuration = sunset - sunrise;
  const nightDuration = 24 - dayDuration;
  const dayHourDuration = dayDuration / 12;
  const nightHourDuration = nightDuration / 12;
  
  const hours = [];
  
  // Day hours (1-12)
  for (let i = 0; i < 12; i++) {
    const planetIndex = (dayRuler.index + i) % 7;
    const planet = PLANET_SEQUENCE[planetIndex];
    const start = sunrise + i * dayHourDuration;
    const end = start + dayHourDuration;
    
    hours.push({
      hourNumber: i + 1,
      period: 'day',
      planet,
      planetInfo: PLANET_INFO[planet],
      startTime: formatTime(start),
      endTime: formatTime(end),
      duration: formatDuration(dayHourDuration)
    });
  }
  
  // Night hours (13-24)
  for (let i = 0; i < 12; i++) {
    const planetIndex = (dayRuler.index + i) % 7;
    const planet = PLANET_SEQUENCE[planetIndex];
    const start = sunset + i * nightHourDuration;
    const end = start + nightHourDuration;
    
    hours.push({
      hourNumber: i + 13,
      period: 'night',
      planet,
      planetInfo: PLANET_INFO[planet],
      startTime: formatTime(start >= 24 ? start - 24 : start),
      endTime: formatTime(end >= 24 ? end - 24 : end),
      duration: formatDuration(nightHourDuration)
    });
  }
  
  return hours;
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKDAY ANALYSIS — For DayAnalysisPanel Component
// ─────────────────────────────────────────────────────────────────────────────
export const WEEKDAY_ANALYSIS = {
  0: { // Sunday
    friendlyDays: ["Thursday", "Tuesday", "Saturday"],
    enemyDays: ["Monday", "Friday"],
    business: "Favorable for leadership roles, government work, gold trading",
    love: "Good for proposals",
    marriage: "Moderate - ensure Moon is strong",
    travel: "Excellent for long journeys",
    healing: "Good for vitality treatments",
    goodWorks: ["Leadership", "Career advancement", "Gold business", "Government work"],
    badWorks: ["Humility", "Secret operations"],
    spiritual: "Invoke Solar deities for power and success",
    source: "Havâss'ın Derinlikleri, p.50",
    malayalam: "ഞായറാഴ്ച സൂര്യൻ ഭരിക്കുന്നു. നേതൃത്വം, ഐശ്വര്യം, ഉദ്യോഗ ഉന്നതി എന്നിവയ്ക്ക് ഉത്തമം."
  },
  1: { // Monday
    friendlyDays: ["Wednesday", "Friday", "Sunday"],
    enemyDays: ["Saturday"],
    business: "Good for water-related business, shipping, travel agencies",
    love: "Excellent for romance and emotional connections",
    marriage: "Very favorable",
    travel: "Excellent, especially by water",
    healing: "Good for mental health and fluid balance",
    goodWorks: ["Travel", "Romance", "Water business", "Intuitive work"],
    badWorks: ["Confrontation", "Aggressive actions"],
    spiritual: "Moon meditation for emotional balance",
    source: "Havâss'ın Derinlikleri, p.50",
    malayalam: "തിങ്കളാഴ്ച ചന്ദ്രൻ ഭരിക്കുന്നു. യാത്രകൾ, പ്രണയം, ജല സംബന്ധിത കാര്യങ്ങൾക്ക് ഉത്തമം."
  },
  2: { // Tuesday
    friendlyDays: ["Sunday", "Thursday", "Saturday"],
    enemyDays: ["Monday", "Wednesday"],
    business: "Good for metal work, military contracts, sports",
    love: "Passionate but may cause conflicts",
    marriage: "Not recommended",
    travel: "Avoid unless urgent",
    healing: "Good for surgery and blood-related treatments",
    goodWorks: ["Courage", "Sports", "Military work", "Overcoming enemies"],
    badWorks: ["Marriage", "Peaceful negotiations"],
    spiritual: "Mars mantras for strength and protection",
    source: "Havâss'ın Derinlikleri, p.50",
    malayalam: "ചൊവ്വാഴ്ച ചൊവ്വ ഭരിക്കുന്നു. ധൈര്യം, ശക്തി, ശത്രുക്കളെ നേരിടൽ എന്നിവയ്ക്ക് ഉത്തമം."
  },
  3: { // Wednesday
    friendlyDays: ["Monday", "Friday", "Sunday"],
    enemyDays: ["Tuesday", "Thursday"],
    business: "Excellent for communication, writing, commerce",
    love: "Good for intellectual connections",
    marriage: "Favorable",
    travel: "Good for short trips and business travel",
    healing: "Good for nervous system and respiratory issues",
    goodWorks: ["Business", "Writing", "Communication", "Learning"],
    badWorks: ["Deception", "Gambling"],
    spiritual: "Mercury mantras for knowledge and wisdom",
    source: "Havâss'ın Derinlikleri, p.50",
    malayalam: "ബുധനാഴ്ച ബുധൻ ഭരിക്കുന്നു. വ്യാപാരം, ആശയ വിനിമയം, കലകൾ എന്നിവയ്ക്ക് ഉത്തമം."
  },
  4: { // Thursday
    friendlyDays: ["Sunday", "Tuesday", "Saturday"],
    enemyDays: ["Wednesday"],
    business: "Excellent for finance, teaching, religious work",
    love: "Favorable for serious relationships",
    marriage: "Very favorable",
    travel: "Excellent for pilgrimage and educational trips",
    healing: "Good for liver and metabolic issues",
    goodWorks: ["Education", "Finance", "Spiritual work", "Marriage"],
    badWorks: ["Dishonesty", "Harmful activities"],
    spiritual: "Jupiter prayers for wisdom and prosperity",
    source: "Havâss'ın Derinlikleri, p.51",
    malayalam: "വ്യാഴാഴ്ച ഗുരു ഭരിക്കുന്നു. ഐശ്വര്യം, ജ്ഞാനം, ആദ്ധ്യാത്മിക ഉന്നതി എന്നിവയ്ക്ക് ഉത്തമം."
  },
  5: { // Friday
    friendlyDays: ["Monday", "Wednesday", "Saturday"],
    enemyDays: ["Sunday"],
    business: "Excellent for arts, beauty, entertainment, luxury goods",
    love: "Most favorable day for love and romance",
    marriage: "Highly favorable",
    travel: "Good for pleasure trips",
    healing: "Good for reproductive and kidney issues",
    goodWorks: ["Love", "Arts", "Beauty", "Entertainment", "Marriage"],
    badWorks: ["Conflict", "Harsh speech"],
    spiritual: "Venus mantras for love and attraction",
    source: "Havâss'ın Derinlikleri, p.51",
    malayalam: "വെള്ളിയാഴ്ച ശുക്രൻ ഭരിക്കുന്നു. പ്രണയം, കലകൾ, ആകർഷണം എന്നിവയ്ക്ക് ഉത്തമം."
  },
  6: { // Saturday
    friendlyDays: ["Sunday", "Tuesday", "Thursday"],
    enemyDays: ["Monday", "Friday"],
    business: "Good for real estate, mining, long-term investments",
    love: "Not favorable for romance",
    marriage: "Not recommended",
    travel: "Avoid unless necessary",
    healing: "Good for chronic conditions and bone issues",
    goodWorks: ["Discipline", "Long-term planning", "Real estate"],
    badWorks: ["New ventures", "Romance", "Entertainment"],
    spiritual: "Saturn mantras for karmic cleansing",
    source: "Havâss'ın Derinlikleri, p.51",
    malayalam: "ശനിയാഴ്ച ശനി ഭരിക്കുന്നു. ദീർഘകാല ആസൂത്രണം, സ്ഥിരത എന്നിവയ്ക്ക് ഉത്തമം."
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ENGINE STATUS
// ─────────────────────────────────────────────────────────────────────────────
export const ASTRO_CLOCK_LIVE_ENGINE_STATUS = {
  version: "1.0.0",
  initialized: true,
  features: [
    "Real-time planetary hour calculation",
    "Sunrise/sunset based hour duration",
    "Day/Night hour sequence",
    "Malayalam & English support",
    "24-hour display (12 day + 12 night)"
  ],
  note: "Live engine ready — calculates planetary hours based on actual sunrise/sunset times"
};