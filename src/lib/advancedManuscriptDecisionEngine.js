/**
 * ADVANCED MANUSCRIPT DECISION ENGINE
 * FINAL MANUSCRIPT RULE: Only uploaded PDF manuscripts as knowledge source
 * 
 * For every recommendation, displays:
 * 1. Book name
 * 2. Page number
 * 3. Original manuscript text
 * 4. Malayalam translation
 * 5. Why this rule applies now
 * 
 * If no manuscript rule matches: "No matching manuscript rule found"
 */

import { AY_MANAZILLERI } from './astroClockData.js';
import { PLANETARY_HOUR_RULES } from './astroClockPlanetaryHourRules.js';
import { getRulesForTopic } from './astroClockKnowledgeBaseFramework.js';

/**
 * Search manuscripts for action-related rules
 * @param {string} action - User action (marriage, business, travel, etc.)
 * @returns {object} Manuscript search results
 */
export function searchManuscriptsForAction(action) {
  const actionKey = action.toLowerCase().replace(/\s+/g, '_');
  
  // Get rules from PDF knowledge base
  const rules = getRulesForTopic(actionKey);
  
  if (!rules || rules.length === 0) {
    return {
      found: false,
      action,
      message: "No matching manuscript rule found",
      message_ml: "ഹസ്തലിഖിതത്തിൽ യോജിക്കുന്ന നിയമമില്ല",
      rulesByManuscript: {},
      totalRules: 0
    };
  }
  
  // Group by manuscript source
  const rulesByManuscript = {};
  rules.forEach(rule => {
    const bookName = rule.book || "Havâss'ın Derinlikleri";
    if (!rulesByManuscript[bookName]) {
      rulesByManuscript[bookName] = [];
    }
    rulesByManuscript[bookName].push(rule);
  });
  
  return {
    found: true,
    action,
    rulesByManuscript,
    totalRules: rules.length,
    manuscriptNames: Object.keys(rulesByManuscript)
  };
}

/**
 * Get current live astrological conditions
 * @param {Date} timestamp - Time to evaluate
 * @param {number} sunrise - Sunrise decimal hour
 * @param {number} sunset - Sunset decimal hour
 * @returns {object} Current conditions
 */
export function getCurrentLiveConditions(timestamp, sunrise = 6.5, sunset = 18.25) {
  const now = timestamp || new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayIndex = now.getDay();
  const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayKey = dayKeys[dayIndex];
  
  // Get lunar mansion (simplified - would use full calculation in production)
  const mansionNumber = ((now.getDate() % 28) + 1);
  const mansion = AY_MANAZILLERI.find(m => m.no === mansionNumber);
  
  // Get planetary hour
  const isDaytime = hour >= sunrise && hour < sunset;
  const planetHour = calculatePlanetaryHour(now, sunrise, sunset);
  
  return {
    timestamp: now,
    lunarMansion: {
      number: mansionNumber,
      name_en: mansion?.name || `Mansion ${mansionNumber}`,
      name_ml: mansion?.name_ml || `മൻസിൽ ${mansionNumber}`,
      name_ar: mansion?.name_arabic || `منزل ${mansionNumber}`
    },
    planetaryHour: {
      planet: planetHour.planet,
      name_en: planetHour.planetInfo?.name_en || planetHour.planet,
      name_ml: planetHour.planetInfo?.name_ml_equivalent || planetHour.planet,
      isDaytime
    },
    dayRuler: {
      name_en: dayKeys[dayIndex],
      name_ml: dayKeys[dayIndex]
    },
    isDaytime,
    isNighttime: !isDaytime
  };
}

/**
 * Compare manuscript rules against current conditions
 * FINAL MANUSCRIPT RULE: No recommendation without matching rules
 * @param {array} manuscriptRules - Rules from manuscripts
 * @param {object} currentConditions - Live conditions
 * @returns {object} Comparison results
 */
export function compareRulesAgainstConditions(manuscriptRules, currentConditions) {
  let score = 0;
  const matchingFactors = [];
  const conflictingFactors = [];
  
  manuscriptRules.forEach(rule => {
    // Extract suitable factors from rule text
    const suitableMansions = extractMansionNumbers(rule.ruleText);
    const suitablePlanets = extractPlanets(rule.ruleText);
    const suitableDays = extractDays(rule.ruleText);
    const dayOrNight = extractDayOrNight(rule.ruleText);
    
    // Check mansion match
    if (suitableMansions.includes(currentConditions.lunarMansion.number)) {
      score += 3;
      matchingFactors.push({
        type: "mansion_match",
        value: currentConditions.lunarMansion.number,
        name: currentConditions.lunarMansion.name_en,
        ruleText: rule.ruleText,
        book: rule.book || "Havâss'ın Derinlikleri",
        pages: rule.pages || "PDF2",
        original_text: rule.ruleText,
        malayalam_translation: rule.malayalamTranslation || null,
        why_applies: `Current mansion (${currentConditions.lunarMansion.number}) matches manuscript rule`
      });
    }
    
    // Check planet match
    if (suitablePlanets.includes(currentConditions.planetaryHour.planet)) {
      score += 2;
      matchingFactors.push({
        type: "planet_match",
        value: currentConditions.planetaryHour.planet,
        name: currentConditions.planetaryHour.name_en,
        ruleText: rule.ruleText,
        book: rule.book || "Havâss'ın Derinlikleri",
        pages: rule.pages || "PDF2",
        original_text: rule.ruleText,
        malayalam_translation: rule.malayalamTranslation || null,
        why_applies: `Current ${currentConditions.planetaryHour.name_en} hour matches manuscript rule`
      });
    }
    
    // Check day match
    if (suitableDays.includes(currentConditions.dayRuler.name_en)) {
      score += 2;
      matchingFactors.push({
        type: "day_match",
        value: currentConditions.dayRuler.name_en,
        ruleText: rule.ruleText,
        book: rule.book || "Havâss'ın Derinlikleri",
        pages: rule.pages || "PDF2",
        original_text: rule.ruleText,
        malayalam_translation: rule.malayalamTranslation || null,
        why_applies: `Current day (${currentConditions.dayRuler.name_en}) matches manuscript rule`
      });
    }
    
    // Check day/night
    if (dayOrNight === "night" && currentConditions.isNighttime) {
      score += 1;
      matchingFactors.push({
        type: "time_match",
        value: "night",
        ruleText: rule.ruleText,
        book: rule.book || "Havâss'ın Derinlikleri",
        pages: rule.pages || "PDF2",
        original_text: rule.ruleText,
        malayalam_translation: rule.malayalamTranslation || null,
        why_applies: `Nighttime matches manuscript requirement`
      });
    } else if (dayOrNight === "day" && currentConditions.isDaytime) {
      score += 1;
      matchingFactors.push({
        type: "time_match",
        value: "day",
        ruleText: rule.ruleText,
        book: rule.book || "Havâss'ın Derinlikleri",
        pages: rule.pages || "PDF2",
        original_text: rule.ruleText,
        malayalam_translation: rule.malayalamTranslation || null,
        why_applies: `Daytime matches manuscript requirement`
      });
    }
  });
  
  // FINAL MANUSCRIPT RULE: No recommendation without matching rules
  const hasMatchingRules = matchingFactors.length > 0;
  const isSuitableNow = score >= 3 && hasMatchingRules;
  const isWait = score >= 1 && score < 3 && hasMatchingRules;
  const isUnsuitable = !hasMatchingRules || score === 0;
  
  return {
    score,
    isSuitableNow,
    isWait,
    isUnsuitable,
    hasMatchingRules,
    matchingFactors,
    conflictingFactors,
    totalRulesEvaluated: manuscriptRules.length,
    no_manuscript_match: !hasMatchingRules
  };
}

/**
 * Calculate next suitable time
 * @param {array} manuscriptRules - Rules from manuscripts
 * @param {Date} now - Current time
 * @param {number} sunrise - Sunrise decimal
 * @param {number} sunset - Sunset decimal
 * @returns {object} Next suitable time info
 */
export function calculateNextSuitableTime(manuscriptRules, now, sunrise = 6.5, sunset = 18.25) {
  for (let h = now.getHours() + 1; h < now.getHours() + 24; h++) {
    const future = new Date(now);
    future.setHours(h, 0, 0, 0);
    
    const conditions = getCurrentLiveConditions(future, sunrise, sunset);
    const comparison = compareRulesAgainstConditions(manuscriptRules, conditions);
    
    if (comparison.isSuitableNow) {
      const hoursUntil = h - now.getHours();
      return {
        found: true,
        time: future,
        formattedTime: formatTime(future),
        hoursUntil,
        countdown: formatCountdown(hoursUntil)
      };
    }
  }
  
  return {
    found: false,
    message: "No suitable time in next 24 hours",
    message_ml: "അടുത്ത 24 മണിക്കൂറിനുള്ളിൽ ഉചിത സമയമില്ല"
  };
}

// Helper functions
function calculatePlanetaryHour(date, sunrise, sunset) {
  const hour = date.getHours() + date.getMinutes() / 60;
  const isDaytime = hour >= sunrise && hour < sunset;
  
  // Simplified - would use full calculation in production
  const dayIndex = date.getDay();
  const planetSequence = ["saturn", "jupiter", "mars", "sun", "venus", "mercury", "moon"];
  const planetIndex = (dayIndex * 12 + Math.floor((hour - sunrise) / ((sunset - sunrise) / 12))) % 7;
  
  return {
    planet: planetSequence[planetIndex] || "sun",
    planetInfo: PLANETARY_HOUR_RULES[planetSequence[planetIndex] || "sun"]
  };
}

function extractMansionNumbers(text) {
  const matches = text.match(/\d+/g);
  if (!matches) return [];
  return matches.map(n => parseInt(n)).filter(n => n >= 1 && n <= 28);
}

function extractPlanets(text) {
  const planets = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"];
  const found = [];
  planets.forEach(p => {
    if (text.toLowerCase().includes(p)) found.push(p);
  });
  return found;
}

function extractDays(text) {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const found = [];
  days.forEach(d => {
    if (text.toLowerCase().includes(d)) found.push(d);
  });
  return found;
}

function extractDayOrNight(text) {
  if (text.toLowerCase().includes("night")) return "night";
  if (text.toLowerCase().includes("day")) return "day";
  return null;
}

function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const hours = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${hours}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatCountdown(hours) {
  if (hours >= 24) return `${Math.floor(hours / 24)} day(s)`;
  if (hours >= 1) return `${hours} hour(s)`;
  return `${hours * 60} minute(s)`;
}

// Default export
export default {
  searchManuscriptsForAction,
  getCurrentLiveConditions,
  compareRulesAgainstConditions,
  calculateNextSuitableTime
};