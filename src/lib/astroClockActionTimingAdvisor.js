/**
 * ASTRO CLOCK ACTION TIMING ADVISOR
 * Searches knowledge base for action-specific timing rules
 * Astro Clock module only — completely isolated
 */

import { KNOWLEDGE_DAYS, KNOWLEDGE_HOURS, KNOWLEDGE_LUNAR_MANSIONS, KNOWLEDGE_TIMING_RULES } from './astroClockKnowledgeBase.js';
import { TAHA_ZODIAC_SIGNS, TAHA_PLANETS, TAHA_HOUSES, TAHA_PRACTICAL_TIMING } from './astroClockTahaData.js';

// ─────────────────────────────────────────────────────────────────────────────
// ACTION KEYWORDS MAPPING — Maps user actions to knowledge base categories
// ─────────────────────────────────────────────────────────────────────────────
export const ACTION_KEYWORDS = {
  marriage: ['marriage', 'wedding', 'engagement', 'proposal', 'നിശ്ചയം', 'വിവാഹം'],
  love: ['love', 'romance', 'attraction', 'relationship', 'പ്രണയം', 'ആകർഷണം'],
  travel: ['travel', 'journey', 'trip', 'voyage', 'യാത്ര', 'യാത്രകൾ'],
  business: ['business', 'trade', 'commerce', 'buying', 'selling', 'വ്യാപാരം', 'കച്ചവടം'],
  healing: ['healing', 'health', 'treatment', 'cure', 'ആരോഗ്യം', 'ചികിത്സ'],
  property: ['property', 'real estate', 'land', 'house', 'ഭൂമി', 'വീട്'],
  job: ['job', 'career', 'employment', 'work', 'ഉദ്യോഗം', 'ജോലി'],
  meeting: ['meeting', 'negotiation', 'agreement', 'കൂടിക്കാഴ്ച', 'ചർച്ച'],
  spiritual: ['spiritual', 'prayer', 'meditation', 'worship', 'ആദ്ധ്യാത്മിക', 'പ്രാർത്ഥന'],
  vefk: ['vefk', 'talisman', 'amulet', 'വെഫ്ക്', 'തയിലം'],
  study: ['study', 'learning', 'education', 'പഠനം', 'വിദ്യാഭ്യാസം'],
  examination: ['examination', 'test', 'exam', 'പരീക്ഷ', 'ടെസ്റ്റ്'],
  money: ['money', 'wealth', 'wealth', 'ധനം', 'സമ്പത്ത്'],
  friendship: ['friendship', 'social', 'friends', 'സൗഹൃദം', 'സുഹൃത്തുക്കൾ'],
  leadership: ['leadership', 'authority', 'power', 'നേതൃത്വം', 'അധികാരം']
};

// ─────────────────────────────────────────────────────────────────────────────
// PLANET DATA WITH MALAYALAM
// ─────────────────────────────────────────────────────────────────────────────
export const PLANET_DATA = {
  sun: {
    name_en: "Sun",
    name_ml: "സൂര്യൻ",
    symbol: "☉",
    nature_en: "King of Planets",
    nature_ml: "ഗ്രഹങ്ങളുടെ രാജാവ്",
    day_en: "Sunday",
    day_ml: "ഞായർ",
    benefits_en: ["Leadership", "Wealth", "Career Success", "Government Favor"],
    benefits_ml: ["നേതൃത്വം", "ഐശ്വര്യം", "ഉദ്യോഗ ഉന്നതി", "സർക്കാർ അനുകൂല്യം"],
    warnings_en: ["Weak in Libra", "Avoid arrogance"],
    warnings_ml: ["തുലാം രാശിയിൽ ദുർബലൻ", "അഹങ്കാരം ഒഴിവാക്കുക"]
  },
  moon: {
    name_en: "Moon",
    name_ml: "ചന്ദ്രൻ",
    symbol: "☽",
    nature_en: "Most Influential",
    nature_ml: "ഏറ്റവും ശക്തമായ ഗ്രഹം",
    day_en: "Monday",
    day_ml: "തിങ്കൾ",
    benefits_en: ["Mental Peace", "Health", "Domestic Harmony", "Intuition"],
    benefits_ml: ["മാനസിക ശാന്തത", "ആരോഗ്യം", "ഗൃഹ ഐശ്വര്യം", "സഹജാവബോധം"],
    warnings_en: ["Weak in Scorpio (3°)"],
    warnings_ml: ["വൃശ്ചികത്തിൽ നീചം (3°)"]
  },
  mars: {
    name_en: "Mars",
    name_ml: "ചൊവ്വ",
    symbol: "♂",
    nature_en: "Malefic",
    nature_ml: "ദ്രോഹ ഗ്രഹം",
    day_en: "Tuesday",
    day_ml: "ചൊവ്വ",
    benefits_en: ["Courage", "Strength", "Victory", "Overcoming Enemies"],
    benefits_ml: ["ധൈര്യം", "ശക്തി", "വിജയം", "ശത്രുക്കളെ നേരിടൽ"],
    warnings_en: ["Marital discord possible"],
    warnings_ml: ["ദാമ്പത്യ ക്ലേശം സാധ്യത"]
  },
  mercury: {
    name_en: "Mercury",
    name_ml: "ബുധൻ",
    symbol: "☿",
    nature_en: "Planet of Wealth",
    nature_ml: "ഐശ്വര്യ ഗ്രഹം",
    day_en: "Wednesday",
    day_ml: "ബുധൻ",
    benefits_en: ["Knowledge", "Business", "Communication", "Arts"],
    benefits_ml: ["ജ്ഞാനം", "വ്യാപാരം", "ആശയ വിനിമയം", "കലകൾ"],
    warnings_en: ["Malefic with malefic planets"],
    warnings_ml: ["ദ്രോഹ ഗ്രഹത്തോടൊപ്പം ദ്രോഹ ഫലം"]
  },
  jupiter: {
    name_en: "Jupiter",
    name_ml: "ഗുരു",
    symbol: "♃",
    nature_en: "Most Benefic",
    nature_ml: "ഏറ്റവും ശുഭ ഗ്രഹം",
    day_en: "Thursday",
    day_ml: "വ്യാഴം",
    benefits_en: ["Spiritual Growth", "Wealth", "Wisdom", "Marriage"],
    benefits_ml: ["ആദ്ധ്യാത്മിക ഉന്നതി", "ഐശ്വര്യം", "ജ്ഞാനം", "വിവാഹം"],
    warnings_en: [],
    warnings_ml: []
  },
  venus: {
    name_en: "Venus",
    name_ml: "ശുക്രൻ",
    symbol: "♀",
    nature_en: "Planet of Love",
    nature_ml: "പ്രേമ-ഭക്തി ഗ്രഹം",
    day_en: "Friday",
    day_ml: "വെള്ളി",
    benefits_en: ["Love", "Attraction", "Arts", "Luxury"],
    benefits_ml: ["പ്രണയം", "ആകർഷണം", "കലകൾ", "ആഡംബരം"],
    warnings_en: ["Weak in Virgo"],
    warnings_ml: ["കന്നിയിൽ ദുർബലൻ"]
  },
  saturn: {
    name_en: "Saturn",
    name_ml: "ശനി",
    symbol: "♄",
    nature_en: "Greater Malefic",
    nature_ml: "മഹാ ദ്രോഹ ഗ്രഹം",
    day_en: "Saturday",
    day_ml: "ശനി",
    benefits_en: ["Stability", "Long-term Planning", "Discipline"],
    benefits_ml: ["സ്ഥിരത", "ദീർഘകാല ആസൂത്രണം", "ശൃംഖല"],
    warnings_en: ["Obstacles in 1st, 4th, 7th, 10th houses"],
    warnings_ml: ["ഒന്നാം, 4, 7, 10 ഭവനത്തിൽ ദ്രോഹ ഫലം"]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LUNAR MANSION DATA
// ─────────────────────────────────────────────────────────────────────────────
export const LUNAR_MANSION_DATA = [
  { number: 1, name_en: "Sharateyn", name_ml: "ശർതെയ്ൻ", name_arabic: "شَرطَین", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 2, name_en: "Buteyn", name_ml: "ബുതെയ്ൻ", name_arabic: "بُطَین", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 3, name_en: "Süreyya", name_ml: "സുരയ്യ", name_arabic: "سُرَیّا", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 4, name_en: "Dübran", name_ml: "ദുബ്രാൻ", name_arabic: "دُبران", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 5, name_en: "Hak'a", name_ml: "ഹഖ", name_arabic: "هَقعَة", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 6, name_en: "Hena", name_ml: "ഹന", name_arabic: "هَنعَة", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 7, name_en: "Zira", name_ml: "സിറ", name_arabic: "ذِراع", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 8, name_en: "Nesre", name_ml: "നെസ്രെ", name_arabic: "نَسرَة", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 9, name_en: "Tarfa", name_ml: "തർഫ", name_arabic: "طَرف", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 10, name_en: "Cephe", name_ml: "ജബ്ഹ", name_arabic: "جَبهَة", nature: "mixed", nature_ml: "മിശ്രം" },
  { number: 11, name_en: "Zebra", name_ml: "സബ്ര", name_arabic: "زُبرَة", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 12, name_en: "Surfa", name_ml: "സർഫ", name_arabic: "صَرفَة", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 13, name_en: "Ava", name_ml: "അവ", name_arabic: "عَوّاء", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 14, name_en: "Semmak", name_ml: "സെമ്മാക്", name_arabic: "سِماک", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 15, name_en: "Gufur", name_ml: "ഗുഫൂർ", name_arabic: "غُفر", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 16, name_en: "Zibana", name_ml: "സിബാന", name_arabic: "زُبانَة", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 17, name_en: "İklil", name_ml: "ഇക്ലീൽ", name_arabic: "إِكلِيل", nature: "mixed", nature_ml: "മിശ്രം" },
  { number: 18, name_en: "Kâlp", name_ml: "ഖൽബ്", name_arabic: "قَلب", nature: "mixed", nature_ml: "മിശ്രം" },
  { number: 19, name_en: "Şevle", name_ml: "ഷവ്ല", name_arabic: "شَولَة", nature: "mixed", nature_ml: "മിശ്രം" },
  { number: 20, name_en: "Neaim", name_ml: "നയീം", name_arabic: "نَعائِم", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 21, name_en: "Belde", name_ml: "ബൽദ", name_arabic: "بَلدَة", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 22, name_en: "Saadüzzabih", name_ml: "സഅദുസ്സാബിഹ്", name_arabic: "سَعدُالذّابِح", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 23, name_en: "Saubela", name_ml: "സൗബേല", name_arabic: "سَعدُبُلَع", nature: "mixed", nature_ml: "മിശ്രം" },
  { number: 24, name_en: "Saadüssuud", name_ml: "സഅദുസ്സുഊദ്", name_arabic: "سَعدُالسُّعُود", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 25, name_en: "Saadulahbiyye", name_ml: "സഅദുൽഅഖ്ബിയ്യ", name_arabic: "سَعدُالأخبیَة", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 26, name_en: "Ferül Mukaddem", name_ml: "ഫറുൽ മുഖദ്ദം", name_arabic: "فَغرُالمُقَدَّم", nature: "lucky", nature_ml: "ശുഭ" },
  { number: 27, name_en: "Ferül Müahhir", name_ml: "ഫറുൽ മുഅഖ്ഖർ", name_arabic: "فَغرُالمُؤَخَّر", nature: "unlucky", nature_ml: "ഉഗ്രസ" },
  { number: 28, name_en: "Erreşa", name_ml: "റേഷ", name_arabic: "الرِّشَاء", nature: "lucky", nature_ml: "ശുഭ" }
];

// ─────────────────────────────────────────────────────────────────────────────
// GET ACTION TIMING ADVICE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Get comprehensive timing advice for a specific action
 * @param {string} action - User's action query
 * @param {string} language - 'ml' or 'en'
 * @returns {Object} Complete timing advice
 */
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

  // Find matching action category
  let matchedCategory = null;
  for (const [category, keywords] of Object.entries(ACTION_KEYWORDS)) {
    if (keywords.some(kw => actionLower.includes(kw.toLowerCase()))) {
      matchedCategory = category;
      break;
    }
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

  // Search knowledge base
  const results = searchKnowledgeBase(matchedCategory, actionLower);
  
  if (!results || results.length === 0) {
    return {
      found: false,
      message: isMalayalam 
        ? `"${action}" എന്ന പ്രവൃത്തിക്കായി സമയ നിയമങ്ങൾ കണ്ടെത്താനായില്ല` 
        : `No specific timing rules found for "${action}"`,
      suggestions: getGeneralSuggestions(isMalayalam)
    };
  }

  // Analyze and compile results
  const analysis = analyzeTimingResults(results, matchedCategory, isMalayalam);

  return {
    found: true,
    action: action,
    category: matchedCategory,
    ...analysis
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────────────────────
function searchKnowledgeBase(category, actionQuery) {
  const results = [];

  // Search days
  KNOWLEDGE_DAYS.forEach(day => {
    const searchText = JSON.stringify(day.data.suitable_operations || []).toLowerCase();
    if (searchText.includes(actionQuery)) {
      results.push({ type: 'day', data: day });
    }
  });

  // Search lunar mansions
  KNOWLEDGE_LUNAR_MANSIONS.forEach(mansion => {
    const operations = JSON.stringify(mansion.data.operations || []).toLowerCase();
    if (operations.includes(actionQuery)) {
      results.push({ type: 'mansion', data: mansion });
    }
  });

  // Search timing rules
  KNOWLEDGE_TIMING_RULES.forEach(rule => {
    const text = JSON.stringify(rule.data || {}).toLowerCase();
    if (text.includes(actionQuery)) {
      results.push({ type: 'rule', data: rule });
    }
  });

  // Search Taha practical timing
  TAHA_PRACTICAL_TIMING.forEach(timing => {
    const text = JSON.stringify(timing.malayalam || {}).toLowerCase();
    if (text.includes(actionQuery) || timing.original_text.toLowerCase().includes(actionQuery)) {
      results.push({ type: 'taha', data: timing });
    }
  });

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYZE TIMING RESULTS
// ─────────────────────────────────────────────────────────────────────────────
function analyzeTimingResults(results, category, isMalayalam) {
  const bestDays = [];
  const worstDays = [];
  const bestHours = [];
  const worstHours = [];
  const suitableMansions = [];
  const unsuitableMansions = [];
  const benefits = [];
  const harms = [];
  const warnings = [];
  const sources = [];

  results.forEach(result => {
    if (result.type === 'day') {
      const day = result.data;
      const dayName = isMalayalam ? day.data.day : day.data.day_en;
      const ruler = PLANET_DATA[day.data.ruler.toLowerCase()];
      
      if (ruler) {
        bestDays.push({
          day: dayName,
          planet: isMalayalam ? ruler.name_ml : ruler.name_en,
          symbol: ruler.symbol,
          benefits: isMalayalam ? ruler.benefits_ml : ruler.benefits_en
        });
      }

      // Add source
      if (day.source) {
        sources.push({
          book: day.source.book,
          page: day.source.page,
          type: 'day'
        });
      }
    }

    if (result.type === 'mansion') {
      const mansion = result.data;
      const mansionData = LUNAR_MANSION_DATA.find(m => m.number === mansion.data.number);
      
      if (mansionData) {
        const mansionEntry = {
          number: mansionData.number,
          name: isMalayalam ? mansionData.name_ml : mansionData.name_en,
          arabic: mansionData.name_arabic,
          nature: isMalayalam ? mansionData.nature_ml : mansionData.nature
        };

        if (mansionData.nature === 'lucky') {
          suitableMansions.push(mansionEntry);
        } else if (mansionData.nature === 'unlucky') {
          unsuitableMansions.push(mansionEntry);
        }
      }

      if (mansion.source) {
        sources.push({
          book: mansion.source.book,
          page: mansion.source.page,
          type: 'mansion'
        });
      }
    }

    if (result.type === 'taha') {
      const taha = result.data;
      if (taha.malayalam) {
        if (taha.malayalam.benefits) {
          benefits.push(...taha.malayalam.benefits);
        }
        if (taha.malayalam.warnings) {
          warnings.push(...taha.malayalam.warnings);
        }
      }
    }
  });

  // Determine worst days (opposite of best)
  const bestDayNames = bestDays.map(d => d.day.toLowerCase());
  KNOWLEDGE_DAYS.forEach(day => {
    const dayName = isMalayalam ? day.data.day : day.data.day_en;
    if (!bestDayNames.includes(dayName.toLowerCase())) {
      const ruler = PLANET_DATA[day.data.ruler.toLowerCase()];
      if (ruler && ruler.nature_ml?.includes('ദ്രോഹ')) {
        worstDays.push({
          day: dayName,
          planet: isMalayalam ? ruler.name_ml : ruler.name_en,
          symbol: ruler.symbol,
          reason: isMalayalam ? ruler.nature_ml : ruler.nature_en
        });
      }
    }
  });

  // Determine best/worst hours based on planet nature
  Object.entries(PLANET_DATA).forEach(([key, planet]) => {
    const isBenefic = planet.nature_ml?.includes('ശുഭ') || planet.nature_en?.includes('Benefic');
    const hourInfo = {
      planet: isMalayalam ? planet.name_ml : planet.name_en,
      symbol: planet.symbol,
      day: isMalayalam ? planet.day_ml : planet.day_en
    };

    if (isBenefic) {
      bestHours.push(hourInfo);
    } else {
      worstHours.push(hourInfo);
    }
  });

  return {
    bestDays,
    worstDays,
    bestHours,
    worstHours,
    suitableMansions,
    unsuitableMansions,
    benefits: [...new Set(benefits)],
    harms: [],
    warnings: [...new Set(warnings)],
    sources: [...new Set(sources.map(s => JSON.stringify(s)))].map(s => JSON.parse(s)),
    totalRulesFound: results.length
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET GENERAL SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────
function getGeneralSuggestions(isMalayalam) {
  return {
    suggestions: [
      {
        category: isMalayalam ? "പൊതു ഉപദേശം" : "General Advice",
        advice: isMalayalam 
          ? "ജ്യോതിഷ ഗ്രന്ഥങ്ങളിൽ നിന്ന് നിർദ്ദിഷ്ട സമയ മാർഗ്ഗനിർദ്ദേശങ്ങൾ തേടുക" 
          : "Consult traditional astrological manuscripts for specific timing guidance",
        source: isMalayalam ? "പാരമ്പര്യ ജ്ഞാനം" : "Traditional Wisdom"
      },
      {
        category: isMalayalam ? "മറ്റ് സമീപനം" : "Alternative Approach",
        advice: isMalayalam 
          ? "ബന്ധപ്പെട്ട പ്രവൃത്തികൾ അല്ലെങ്കിൽ വിശാലമായ വിഭാഗങ്ങൾ തിരയുക" 
          : "Try searching for related actions or broader categories",
        source: "Astro Clock Framework"
      }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FIND SIMILAR ACTIONS (Autocomplete)
// ─────────────────────────────────────────────────────────────────────────────
export function findSimilarActions(partialAction, isMalayalam = false) {
  if (!partialAction || partialAction.length < 2) return [];
  
  const actionLower = partialAction.toLowerCase();
  const suggestions = [];

  Object.entries(ACTION_KEYWORDS).forEach(([category, keywords]) => {
    if (keywords.some(kw => kw.toLowerCase().includes(actionLower))) {
      suggestions.push({
        category,
        keywords: keywords.slice(0, 3),
        match: true
      });
    }
  });

  return suggestions.slice(0, 8);
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGINE STATUS
// ─────────────────────────────────────────────────────────────────────────────
export const ACTION_TIMING_ADVISOR_STATUS = {
  version: "1.0.0",
  initialized: true,
  features: [
    "Action-based timing search",
    "Malayalam & English support",
    "Best/Worst days analysis",
    "Best/Worst planetary hours",
    "Lunar mansion recommendations",
    "Source citation tracking",
    "Benefits & warnings display"
  ],
  knowledge_sources: 3,
  total_rules_searchable: 409,
  note: "Action Timing Advisor ready — searches across all Astro Clock knowledge"
};