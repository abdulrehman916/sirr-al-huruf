/**
 * ASTRO CLOCK ACTION TIMING ADVISOR — ENHANCED
 * Comprehensive action-to-rule mappings from ingested PDF knowledge base
 * Astro Clock module only — completely isolated
 */

import { KNOWLEDGE_DAYS, KNOWLEDGE_LUNAR_MANSIONS, LUNAR_MANSION_DATA } from './astroClockKnowledgeBase.js';
import { PLANET_DATA } from './astroClockData.js';

// ─────────────────────────────────────────────────────────────────────────────
// ACTION CATEGORIES WITH COMPLETE RULES
// Maps each action to specific timing rules from ingested knowledge
// ─────────────────────────────────────────────────────────────────────────────
export const ACTION_RULES = {
  marriage: {
    category: "Marriage & Relationships",
    category_ml: "വിവാഹവും ബന്ധങ്ങളും",
    bestDays: [
      { day: "Friday", day_ml: "വെള്ളി", planet: "Venus", planet_ml: "ശുക്രൻ", symbol: "♀", reason: "Day of love and harmony" },
      { day: "Thursday", day_ml: "വ്യാഴം", planet: "Jupiter", planet_ml: "ഗുരു", symbol: "♃", reason: "Most benefic for marriage" }
    ],
    worstDays: [
      { day: "Tuesday", day_ml: "ചൊവ്വ", planet: "Mars", planet_ml: "ചൊവ്വ", symbol: "♂", reason: "Malefic planet causes discord" },
      { day: "Saturday", day_ml: "ശനി", planet: "Saturn", planet_ml: "ശനി", symbol: "♄", reason: "Delays and obstacles" }
    ],
    bestHours: ["Venus", "Jupiter", "Moon"],
    bestHours_ml: ["ശുക്രൻ", "ഗുരു", "ചന്ദ്രൻ"],
    worstHours: ["Mars", "Saturn"],
    worstHours_ml: ["ചൊവ്വ", "ശനി"],
    suitableMansions: [6, 7, 11, 15, 16, 20, 24, 28], // Hana, Zira, Zebra, Gufur, Zibana, Neaim, Saadüssuud, Erreşa
    worstMansions: [1, 4, 5, 8, 9, 12, 13, 14, 21], // Sharateyn, Dübran, Hak'a, Nesre, Tarfa, Surfa, Ava, Semmak, Belde
    suitablePlanets: ["Venus", "Jupiter", "Moon"],
    enemyPlanets: ["Mars", "Saturn"],
    benefits: ["Harmonious marriage", "Long-lasting relationship", "Family happiness", "Prosperity"],
    benefits_ml: ["സുഖകരമായ വിവാഹം", "ദീർഘകാല ബന്ധം", "കുടുംബ ഐശ്വര്യം", "ഐശ്വര്യം"],
    warnings: ["Avoid Mars hours", "Avoid Saturn days", "Check Moon not in Scorpio"],
    warnings_ml: ["ചൊവ്വ മണിക്കൂർ ഒഴിവാക്കുക", "ശനി ദിവസം ഒഴിവാക്കുക", "ചന്ദ്രൻ വൃശ്ചികത്തിൽ ആകരുത്"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "51", author: "Bülent Kısa" },
      { book: "تدریس نجوم احکامی", page: "33", author: "Ustad Taha" }
    ]
  },
  business: {
    category: "Business & Trade",
    category_ml: "വ്യാപാരം",
    bestDays: [
      { day: "Wednesday", day_ml: "ബുധൻ", planet: "Mercury", planet_ml: "ബുധൻ", symbol: "☿", reason: "Planet of commerce and wealth" },
      { day: "Thursday", day_ml: "വ്യാഴം", planet: "Jupiter", planet_ml: "ഗുരു", symbol: "♃", reason: "Expansion and prosperity" }
    ],
    worstDays: [
      { day: "Tuesday", day_ml: "ചൊവ്വ", planet: "Mars", planet_ml: "ചൊവ്വ", symbol: "♂", reason: "Losses and conflicts" }
    ],
    bestHours: ["Mercury", "Jupiter", "Venus"],
    bestHours_ml: ["ബുധൻ", "ഗുരു", "ശുക്രൻ"],
    worstHours: ["Mars", "Saturn"],
    worstHours_ml: ["ചൊവ്വ", "ശനി"],
    suitableMansions: [2, 6, 7, 11, 15, 20, 24], // Buteyn, Hana, Zira, Zebra, Gufur, Neaim, Saadüssuud
    worstMansions: [1, 5, 8, 9, 13, 21],
    suitablePlanets: ["Mercury", "Jupiter", "Venus"],
    enemyPlanets: ["Mars", "Saturn"],
    benefits: ["Profitable trade", "Business growth", "Good negotiations", "Wealth increase"],
    benefits_ml: ["ലാഭകരമായ വ്യാപാരം", "ബിസിനസ് വളർച്ച", "നല്ല ചർച്ചകൾ", "സമ്പത്ത് വർദ്ധന"],
    warnings: ["Avoid Mars hours for signing contracts", "Check Mercury not retrograde"],
    warnings_ml: ["കരാർ ഒപ്പിടാൻ ചൊവ്വ മണിക്കൂർ ഒഴിവാക്കുക", "ബുധൻ വക്രഗതിയിൽ ആകരുത്"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "50-51", author: "Bülent Kısa" }
    ]
  },
  travel: {
    category: "Travel & Journeys",
    category_ml: "യാത്ര",
    bestDays: [
      { day: "Monday", day_ml: "തിങ്കൾ", planet: "Moon", planet_ml: "ചന്ദ്രൻ", symbol: "☽", reason: "Day of travel and movement" },
      { day: "Friday", day_ml: "വെള്ളി", planet: "Venus", planet_ml: "ശുക്രൻ", symbol: "♀", reason: "Pleasant journeys" }
    ],
    worstDays: [
      { day: "Tuesday", day_ml: "ചൊവ്വ", planet: "Mars", planet_ml: "ചൊവ്വ", symbol: "♂", reason: "Accidents and delays" },
      { day: "Saturday", day_ml: "ശനി", planet: "Saturn", planet_ml: "ശനി", symbol: "♄", reason: "Obstacles" }
    ],
    bestHours: ["Moon", "Venus", "Mercury"],
    bestHours_ml: ["ചന്ദ്രൻ", "ശുക്രൻ", "ബുധൻ"],
    worstHours: ["Mars", "Saturn"],
    worstHours_ml: ["ചൊവ്വ", "ശനി"],
    suitableMansions: [2, 6, 7, 11, 15, 20], // Buteyn, Hana, Zira, Zebra, Gufur, Neaim
    worstMansions: [1, 4, 8, 9, 13, 21],
    suitablePlanets: ["Moon", "Venus", "Mercury"],
    enemyPlanets: ["Mars", "Saturn"],
    benefits: ["Safe journey", "Pleasant travel", "Good experiences"],
    benefits_ml: ["സുരക്ഷിത യാത്ര", "സുഖപ്രദ യാത്ര", "നല്ല അനുഭവങ്ങൾ"],
    warnings: ["Never travel when Moon in Scorpio", "Avoid Mars hours"],
    warnings_ml: ["ചന്ദ്രൻ വൃശ്ചികത്തിൽ ആകുമ്പോൾ യാത്ര പാടില്ല", "ചൊവ്വ മണിക്കൂർ ഒഴിവാക്കുക"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "50", author: "Bülent Kısa" }
    ]
  },
  healing: {
    category: "Healing & Health",
    category_ml: "ചികിത്സ",
    bestDays: [
      { day: "Monday", day_ml: "തിങ്കൾ", planet: "Moon", planet_ml: "ചന്ദ്രൻ", symbol: "☽", reason: "Health and wellness" },
      { day: "Thursday", day_ml: "വ്യാഴം", planet: "Jupiter", planet_ml: "ഗുരു", symbol: "♃", reason: "Healing and recovery" }
    ],
    worstDays: [
      { day: "Tuesday", day_ml: "ചൊവ്വ", planet: "Mars", planet_ml: "ചൊവ്വ", symbol: "♂", reason: "Surgery only, not healing" },
      { day: "Saturday", day_ml: "ശനി", planet: "Saturn", planet_ml: "ശനി", symbol: "♄", reason: "Chronic issues" }
    ],
    bestHours: ["Moon", "Jupiter", "Sun"],
    bestHours_ml: ["ചന്ദ്രൻ", "ഗുരു", "സൂര്യൻ"],
    worstHours: ["Mars", "Saturn"],
    worstHours_ml: ["ചൊവ്വ", "ശനി"],
    suitableMansions: [2, 6, 11, 15, 20, 24], // Buteyn, Hana, Zebra, Gufur, Neaim, Saadüssuud
    worstMansions: [1, 4, 5, 8, 9, 13, 21],
    suitablePlanets: ["Moon", "Jupiter", "Sun"],
    enemyPlanets: ["Mars", "Saturn"],
    benefits: ["Quick recovery", "Effective treatment", "Good health"],
    benefits_ml: ["പെട്ടെന്ന് സുഖം പ്രാപിക്കൽ", "ഫലപ്രദമായ ചികിത്സ", "നല്ല ആരോഗ്യം"],
    warnings: ["Avoid Mars for non-emergency surgery", "Check Moon phase"],
    warnings_ml: ["അടിയന്തരമല്ലാത്ത ശസ്ത്രക്രിയക്ക് ചൊവ്വ ഒഴിവാക്കുക", "ചന്ദ്ര കല പരിശോധിക്കുക"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "50-51", author: "Bülent Kısa" }
    ]
  },
  job: {
    category: "Career & Employment",
    category_ml: "ജോലി",
    bestDays: [
      { day: "Sunday", day_ml: "ഞായർ", planet: "Sun", planet_ml: "സൂര്യൻ", symbol: "☉", reason: "Leadership and success" },
      { day: "Thursday", day_ml: "വ്യാഴം", planet: "Jupiter", planet_ml: "ഗുരു", symbol: "♃", reason: "Career growth" }
    ],
    worstDays: [
      { day: "Saturday", day_ml: "ശനി", planet: "Saturn", planet_ml: "ശനി", symbol: "♄", reason: "Delays and rejections" }
    ],
    bestHours: ["Sun", "Jupiter", "Venus"],
    bestHours_ml: ["സൂര്യൻ", "ഗുരു", "ശുക്രൻ"],
    worstHours: ["Saturn", "Mars"],
    worstHours_ml: ["ശനി", "ചൊവ്വ"],
    suitableMansions: [6, 7, 11, 15, 20, 24],
    worstMansions: [1, 4, 8, 9, 13, 21],
    suitablePlanets: ["Sun", "Jupiter", "Venus"],
    enemyPlanets: ["Saturn", "Mars"],
    benefits: ["Job success", "Career advancement", "Good interviews"],
    benefits_ml: ["ജോലിയിൽ വിജയം", "ഉദ്യോഗ ഉന്നതി", "നല്ല ഇന്റർവ്യൂ"],
    warnings: ["Avoid Saturn days for interviews", "Check Sun strong"],
    warnings_ml: ["ഇന്റർവ്യൂവിന് ശനി ദിവസം ഒഴിവാക്കുക", "സൂര്യൻ ശക്തനാകണം"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "50", author: "Bülent Kısa" }
    ]
  },
  love: {
    category: "Love & Romance",
    category_ml: "പ്രണയം",
    bestDays: [
      { day: "Friday", day_ml: "വെള്ളി", planet: "Venus", planet_ml: "ശുക്രൻ", symbol: "♀", reason: "Day of love" },
      { day: "Monday", day_ml: "തിങ്കൾ", planet: "Moon", planet_ml: "ചന്ദ്രൻ", symbol: "☽", reason: "Emotional connection" }
    ],
    worstDays: [
      { day: "Tuesday", day_ml: "ചൊവ്വ", planet: "Mars", planet_ml: "ചൊവ്വ", symbol: "♂", reason: "Conflicts" },
      { day: "Saturday", day_ml: "ശനി", planet: "Saturn", planet_ml: "ശനി", symbol: "♄", reason: "Coldness" }
    ],
    bestHours: ["Venus", "Moon"],
    bestHours_ml: ["ശുക്രൻ", "ചന്ദ്രൻ"],
    worstHours: ["Mars", "Saturn"],
    worstHours_ml: ["ചൊവ്വ", "ശനി"],
    suitableMansions: [6, 7, 11, 15, 20, 24, 28],
    worstMansions: [1, 4, 5, 8, 9, 13, 21],
    suitablePlanets: ["Venus", "Moon"],
    enemyPlanets: ["Mars", "Saturn"],
    benefits: ["Romantic success", "Emotional bonding", "Attraction"],
    benefits_ml: ["പ്രണയ വിജയം", "ഭാവപൂർണ്ണ ബന്ധം", "ആകർഷണം"],
    warnings: ["Avoid Mars hours", "Moon in good mansion"],
    warnings_ml: ["ചൊവ്വ മണിക്കൂർ ഒഴിവാക്കുക", "ചന്ദ്രൻ നല്ല നക്ഷത്രത്തിൽ"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "51", author: "Bülent Kısa" }
    ]
  },
  spiritual: {
    category: "Spiritual Work",
    category_ml: "ആദ്ധ്യാത്മിക പ്രവർത്തനങ്ങൾ",
    bestDays: [
      { day: "Thursday", day_ml: "വ്യാഴം", planet: "Jupiter", planet_ml: "ഗുരു", symbol: "♃", reason: "Spiritual growth" },
      { day: "Saturday", day_ml: "ശനി", planet: "Saturn", planet_ml: "ശനി", symbol: "♄", reason: "Deep practices" }
    ],
    worstDays: [],
    bestHours: ["Jupiter", "Moon", "Saturn"],
    bestHours_ml: ["ഗുരു", "ചന്ദ്രൻ", "ശനി"],
    worstHours: [],
    suitableMansions: [2, 6, 11, 15, 20, 24, 28],
    worstMansions: [1, 4, 5, 8, 9],
    suitablePlanets: ["Jupiter", "Moon", "Saturn"],
    enemyPlanets: [],
    benefits: ["Spiritual advancement", "Deep meditation", "Divine connection"],
    benefits_ml: ["ആദ്ധ്യാത്മിക പുരോഗതി", "ആഴത്തിലുള്ള ധ്യാനം", "ദൈവിക ബന്ധം"],
    warnings: ["Check Moon phase", "Avoid eclipse periods"],
    warnings_ml: ["ചന്ദ്ര കല പരിശോധിക്കുക", "ഗ്രഹണ സമയം ഒഴിവാക്കുക"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "51", author: "Bülent Kısa" }
    ]
  },
  study: {
    category: "Education & Learning",
    category_ml: "വിദ്യാഭ്യാസം",
    bestDays: [
      { day: "Wednesday", day_ml: "ബുധൻ", planet: "Mercury", planet_ml: "ബുധൻ", symbol: "☿", reason: "Knowledge and learning" },
      { day: "Thursday", day_ml: "വ്യാഴം", planet: "Jupiter", planet_ml: "ഗുരു", symbol: "♃", reason: "Wisdom" }
    ],
    worstDays: [
      { day: "Tuesday", day_ml: "ചൊവ്വ", planet: "Mars", planet_ml: "ചൊവ്വ", symbol: "♂", reason: "Distraction" }
    ],
    bestHours: ["Mercury", "Jupiter"],
    bestHours_ml: ["ബുധൻ", "ഗുരു"],
    worstHours: ["Venus", "Mars"],
    worstHours_ml: ["ശുക്രൻ", "ചൊവ്വ"],
    suitableMansions: [2, 6, 7, 11, 15, 20],
    worstMansions: [1, 4, 5, 8, 9, 13],
    suitablePlanets: ["Mercury", "Jupiter"],
    enemyPlanets: ["Venus", "Mars"],
    benefits: ["Better learning", "Knowledge retention", "Academic success"],
    benefits_ml: ["മികച്ച പഠനം", "അറിവ് നിലനിർത്തൽ", "വിദ്യാഭ്യാസ വിജയം"],
    warnings: ["Avoid Venus hours (distraction)", "Mercury strong"],
    warnings_ml: ["ശുക്ര മണിക്കൂർ ഒഴിവാക്കുക", "ബുധൻ ശക്തനാകണം"],
    sources: [
      { book: "Havâss'ın Derinlikleri", page: "50-51", author: "Bülent Kısa" }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ACTION TIMING ADVICE — ENHANCED
// Now uses comprehensive ACTION_RULES mappings
// ─────────────────────────────────────────────────────────────────────────────
export function getActionTimingAdvice(action, language = 'en') {
  if (!action || !action.trim()) {
    return {
      found: false,
      message: language === 'ml' 
        ? "ദയവായി ഒരു പ്രവൃത്തി നൽകുക" 
        : "Please enter an action to analyze"
    };
  }

  const actionLower = action.toLowerCase().trim();
  const isMalayalam = language === 'ml';

  // Find matching action category with better keyword matching
  let matchedCategory = null;
  
  // Direct match first
  for (const [category, rules] of Object.entries(ACTION_RULES)) {
    if (actionLower.includes(category.toLowerCase()) || 
        (isMalayalam && actionLower.includes(rules.category_ml.toLowerCase()))) {
      matchedCategory = category;
      break;
    }
  }
  
  // If no direct match, try keyword search
  if (!matchedCategory) {
    matchedCategory = findMatchingCategory(actionLower, isMalayalam);
  }

  if (!matchedCategory) {
    return {
      found: false,
      message: isMalayalam 
        ? `"${action}" എന്ന പ്രവൃത്തിക്കായി സമയ നിയമങ്ങൾ കണ്ടെത്താനായില്ല` 
        : `No specific timing rules found for "${action}"`,
      suggestions: getGeneralSuggestions(isMalayalam)
    };
  }

  // Get rules for this category
  const rules = ACTION_RULES[matchedCategory];
  
  // Build comprehensive result
  const result = {
    found: true,
    action: isMalayalam ? rules.category_ml : rules.category,
    category: matchedCategory,
    bestDays: rules.bestDays,
    worstDays: rules.worstDays,
    bestHours: isMalayalam ? rules.bestHours_ml.map((h, i) => ({
      planet: h,
      symbol: rules.bestHours[i] === "Sun" ? "☉" : 
               rules.bestHours[i] === "Moon" ? "☽" :
               rules.bestHours[i] === "Mars" ? "♂" :
               rules.bestHours[i] === "Mercury" ? "☿" :
               rules.bestHours[i] === "Jupiter" ? "♃" :
               rules.bestHours[i] === "Venus" ? "♀" : "♄",
      day: isMalayalam ? "ഇന്ന്" : "Today"
    })) : rules.bestHours.map(h => ({
      planet: h,
      symbol: h === "Sun" ? "☉" : h === "Moon" ? "☽" : h === "Mars" ? "♂" : h === "Mercury" ? "☿" : h === "Jupiter" ? "♃" : h === "Venus" ? "♀" : "♄",
      day: "Today"
    })),
    worstHours: isMalayalam ? rules.worstHours_ml.map(h => ({ planet: h, symbol: "♂", day: "Today" })) : rules.worstHours.map(h => ({ planet: h, symbol: "♂", day: "Today" })),
    suitableMansions: (rules.suitableMansions || []).map(num => {
      const mansion = LUNAR_MANSION_DATA.find(m => m.number === num);
      return mansion ? {
        number: mansion.number,
        name: isMalayalam ? mansion.name_ml : mansion.name_en,
        arabic: mansion.name_arabic,
        nature: isMalayalam ? mansion.nature_ml : mansion.nature
      } : null;
    }).filter(Boolean),
    worstMansions: (rules.worstMansions || []).map(num => {
      const mansion = LUNAR_MANSION_DATA.find(m => m.number === num);
      return mansion ? {
        number: mansion.number,
        name: isMalayalam ? mansion.name_ml : mansion.name_en,
        arabic: mansion.name_arabic,
        nature: isMalayalam ? mansion.nature_ml : mansion.nature
      } : null;
    }).filter(Boolean),
    suitablePlanets: rules.suitablePlanets.map(p => {
      const planet = Object.entries(PLANET_DATA).find(([k]) => k === p.toLowerCase());
      return planet ? {
        name: isMalayalam ? planet[1].name_ml : planet[1].name_en,
        symbol: planet[1].symbol
      } : null;
    }).filter(Boolean),
    enemyPlanets: rules.enemyPlanets.map(p => {
      const planet = Object.entries(PLANET_DATA).find(([k]) => k === p.toLowerCase());
      return planet ? {
        name: isMalayalam ? planet[1].name_ml : planet[1].name_en,
        symbol: planet[1].symbol
      } : null;
    }).filter(Boolean),
    benefits: isMalayalam ? rules.benefits_ml : rules.benefits,
    warnings: isMalayalam ? rules.warnings_ml : rules.warnings,
    sources: rules.sources,
    totalRulesFound: rules.sources.length
  };

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIND MATCHING CATEGORY — Keyword search
// ─────────────────────────────────────────────────────────────────────────────
function findMatchingCategory(action, isMalayalam) {
  const keywords = {
    marriage: ['marriage', 'wedding', 'engagement', 'proposal', 'വിവാഹം', 'നിശ്ചയം'],
    business: ['business', 'trade', 'commerce', 'buying', 'selling', 'വ്യാപാരം', 'കച്ചവടം'],
    travel: ['travel', 'journey', 'trip', 'voyage', 'യാത്ര'],
    healing: ['healing', 'health', 'treatment', 'cure', 'ആരോഗ്യം', 'ചികിത്സ'],
    job: ['job', 'career', 'employment', 'work', 'ഉദ്യോഗം', 'ജോലി'],
    love: ['love', 'romance', 'attraction', 'relationship', 'പ്രണയം', 'ആകർഷണം'],
    spiritual: ['spiritual', 'prayer', 'meditation', 'worship', 'ആദ്ധ്യാത്മിക', 'പ്രാർത്ഥന'],
    study: ['study', 'learning', 'education', 'പഠനം', 'വിദ്യാഭ്യാസം'],
    government: ['government', 'official', 'സർക്കാർ', 'സർക്കാർ കാര്യങ്ങൾ']
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => action.includes(word.toLowerCase()))) {
      return category;
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET GENERAL SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────
function getGeneralSuggestions(isMalayalam) {
  return {
    suggestions: [
      {
        category: isMalayalam ? "വിവാഹം" : "Marriage",
        advice: isMalayalam ? "വിവാഹത്തിന് വെള്ളി, വ്യാഴം ദിവസങ്ങൾ ഉത്തമം" : "Friday and Thursday are best for marriage",
        match: true
      },
      {
        category: isMalayalam ? "വ്യാപാരം" : "Business",
        advice: isMalayalam ? "വ്യാപാരത്തിന് ബുധൻ, വ്യാഴം ദിവസങ്ങൾ ഉത്തമം" : "Wednesday and Thursday for business",
        match: true
      },
      {
        category: isMalayalam ? "യാത്ര" : "Travel",
        advice: isMalayalam ? "യാത്രക്ക് തിങ്കൾ, വെള്ളി ദിവസങ്ങൾ ഉത്തമം" : "Monday and Friday for travel",
        match: true
      },
      {
        category: isMalayalam ? "ചികിത്സ" : "Healing",
        advice: isMalayalam ? "ചികിത്സക്ക് തിങ്കൾ, വ്യാഴം ദിവസങ്ങൾ ഉത്തമം" : "Monday and Thursday for healing",
        match: true
      }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FIND SIMILAR ACTIONS
// ─────────────────────────────────────────────────────────────────────────────
export function findSimilarActions(partialAction, isMalayalam = false) {
  if (!partialAction || partialAction.length < 2) return [];
  
  const actionLower = partialAction.toLowerCase();
  const suggestions = [];

  Object.entries(ACTION_RULES).forEach(([category, rules]) => {
    const categoryName = isMalayalam ? rules.category_ml : rules.category;
    if (categoryName.toLowerCase().includes(actionLower)) {
      suggestions.push({
        category: categoryName,
        keywords: [categoryName],
        match: true
      });
    }
  });

  return suggestions.slice(0, 8);
}