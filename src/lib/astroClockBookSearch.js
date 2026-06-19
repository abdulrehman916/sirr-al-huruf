/**
 * ASTRO CLOCK BOOK-BASED SEARCH ENGINE
 * Searches ONLY stored database records — no AI generation.
 * Returns book-sourced timing guidance only.
 */

import { KNOWLEDGE_DAYS, KNOWLEDGE_HOURS, KNOWLEDGE_LUNAR_MANSIONS, KNOWLEDGE_TIMING_RULES, KNOWLEDGE_PLANETS, KNOWLEDGE_ZODIAC } from "@/lib/astroClockKnowledgeBase";
import { AY_MANAZILLERI, PLANETARY_DAY_RULERS } from "@/lib/astroClockData";
import { ACTION_CATEGORIES, ACTION_TIMING_RULES, findActionCategory, getTimingRulesForAction, evaluateCurrentTiming } from "@/lib/astroClockActionTimingRules";

/**
 * Search knowledge base for action-related timing rules
 * @param {string} query - User's search query (e.g., "marriage", "business", "travel")
 * @returns {Object} Search results with book references
 */
export function searchBookKnowledge(query) {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Step 1: Find matching action category
  const actionCategory = findActionCategory(normalizedQuery);
  
  if (actionCategory) {
    const rules = getTimingRulesForAction(actionCategory);
    if (rules) {
      return {
        found: true,
        type: "ACTION_TIMING",
        category: actionCategory,
        rules: rules,
        source: rules.source,
        mansions: {
          suitable: rules.suitableMansions.map(num => AY_MANAZILLERI.find(m => m.no === num)),
          unsuitable: rules.unsuitableMansions.map(num => AY_MANAZILLERI.find(m => m.no === num))
        },
        planets: {
          suitable: rules.suitablePlanets,
          unsuitable: rules.unsuitablePlanets
        },
        days: {
          suitable: rules.suitableDays,
          unsuitable: rules.unsuitableDays
        }
      };
    }
  }
  
  // Step 2: Search general knowledge base
  const results = {
    found: false,
    type: "GENERAL_SEARCH",
    dayRules: [],
    mansionRules: [],
    timingRules: [],
    planetRules: [],
    zodiacRules: []
  };
  
  // Search days
  KNOWLEDGE_DAYS.forEach(rule => {
    if (
      rule.data.suitable_operations.some(op => 
        op.toLowerCase().includes(normalizedQuery)
      )
    ) {
      results.dayRules.push(rule);
      results.found = true;
    }
  });
  
  // Search lunar mansions
  KNOWLEDGE_LUNAR_MANSIONS.forEach(rule => {
    if (
      rule.data.operations.some(op => 
        op.toLowerCase().includes(normalizedQuery)
      )
    ) {
      results.mansionRules.push(rule);
      results.found = true;
    }
  });
  
  // Search timing rules
  KNOWLEDGE_TIMING_RULES.forEach(rule => {
    if (
      rule.rule_text.toLowerCase().includes(normalizedQuery) ||
      (rule.original_text && rule.original_text.toLowerCase().includes(normalizedQuery))
    ) {
      results.timingRules.push(rule);
      results.found = true;
    }
  });
  
  return results;
}

/**
 * Get today's analysis based on book data
 * @param {Object} astroData - Current astronomical data
 * @returns {Object} Today's guidance with book references
 */
export function getTodaysAnalysis(astroData) {
  const { dayOfWeek, mansion, planetaryHour, zodiacSign } = astroData;
  
  const goodFor = [];
  const avoid = [];
  const neutral = [];
  
  // Get day ruler operations
  const dayRuler = PLANETARY_DAY_RULERS.find(d => 
    d.day_name_en.toLowerCase() === dayOfWeek.toLowerCase()
  );
  
  if (dayRuler) {
    dayRuler.suitable_operations.forEach(op => {
      goodFor.push({
        text: op,
        source: `Havâss'ın Derinlikleri p.50-51 — ${dayRuler.day_name} ruled by ${dayRuler.planet}`
      });
    });
  }
  
  // Get mansion operations
  const currentMansion = AY_MANAZILLERI.find(m => m.no === mansion.number);
  if (currentMansion) {
    currentMansion.operations.forEach(op => {
      if (currentMansion.genel_hukum.includes("Uygun")) {
        goodFor.push({
          text: op,
          source: `Havâss'ın Derinlikleri p.64-74 — ${currentMansion.name} mansion`
        });
      } else if (currentMansion.genel_hukum.includes("Uğursuz")) {
        avoid.push({
          text: op,
          source: `Havâss'ın Derinlikleri p.64-74 — ${currentMansion.name} mansion (Nahs)`
        });
      } else {
        neutral.push({
          text: op,
          source: `Havâss'ın Derinlikleri p.64-74 — ${currentMansion.name} mansion (Mixed)`
        });
      }
    });
  }
  
  return {
    day: {
      name: dayRuler?.day_name,
      ruler: dayRuler?.planet,
      symbol: dayRuler?.symbol
    },
    mansion: {
      number: currentMansion?.no,
      name: currentMansion?.name,
      nature: currentMansion?.genel_hukum
    },
    planetaryHour: {
      planet: planetaryHour?.planetInfo?.name_en,
      nature: planetaryHour?.planetInfo?.nature_en
    },
    zodiac: {
      sign: zodiacSign?.name_en,
      element: zodiacSign?.element
    },
    goodFor,
    avoid,
    neutral
  };
}

/**
 * Find best timing for a specific action
 * @param {string} action - User's intended action
 * @param {Object} currentData - Current astrological data
 * @returns {Object} Best timing recommendations with book sources
 */
export function findBestTimeForAction(action, currentData) {
  const category = findActionCategory(action);
  
  if (!category) {
    return {
      found: false,
      message: "No book-based reference found for this action.",
      source: null
    };
  }
  
  const rules = getTimingRulesForAction(category);
  if (!rules) {
    return {
      found: false,
      message: "No timing rules found in database.",
      source: null
    };
  }
  
  // Evaluate current timing
  const evaluation = evaluateCurrentTiming(category, currentData);
  
  return {
    found: true,
    action: category,
    currentTiming: evaluation,
    bestTimes: {
      today: findBestHoursToday(rules, currentData),
      thisWeek: findBestDaysThisWeek(rules),
      mansions: rules.suitableMansions.map(num => AY_MANAZILLERI.find(m => m.no === num)),
      planets: rules.suitablePlanets,
      days: rules.suitableDays
    },
    avoid: {
      mansions: rules.unsuitableMansions.map(num => AY_MANAZILLERI.find(m => m.no === num)),
      planets: rules.unsuitablePlanets,
      days: rules.unsuitableDays
    },
    source: rules.source,
    notes: rules.notes
  };
}

/**
 * Find best hours today based on rules
 */
function findBestHoursToday(rules, currentData) {
  // This would integrate with planetary hour calculation
  // For now, return rule-based guidance
  return {
    guidance: `Best hours: ${rules.suitablePlanets.join(', ')} hours during daytime`,
    source: rules.source
  };
}

/**
 * Find best days this week based on rules
 */
function findBestDaysThisWeek(rules) {
  return {
    days: rules.suitableDays,
    source: rules.source
  };
}

/**
 * Get full mansion details from database
 */
export function getMansionDetails(mansionNumber) {
  const mansion = AY_MANAZILLERI.find(m => m.no === mansionNumber);
  if (!mansion) return null;
  
  return {
    number: mansion.no,
    name: mansion.name,
    name_arabic: mansion.name_arabic,
    letter: mansion.harf_arabic,
    zodiac: {
      sign: mansion.zodiac_sign,
      degree: mansion.zodiac_degree
    },
    nature: mansion.genel_hukum,
    operations: mansion.operations,
    source: "Havâss'ın Derinlikleri p.64-74"
  };
}

/**
 * Get zodiac details from database
 */
export function getZodiacDetails(signName) {
  // Search knowledge base for zodiac information
  const zodiacRules = KNOWLEDGE_ZODIAC.filter(rule => 
    rule.data.fire_signs?.includes(signName) ||
    rule.data.earth_signs?.includes(signName) ||
    rule.data.air_signs?.includes(signName) ||
    rule.data.water_signs?.includes(signName)
  );
  
  return {
    sign: signName,
    rules: zodiacRules,
    source: zodiacRules.length > 0 ? zodiacRules[0].source.book : "Havâss'ın Derinlikleri"
  };
}