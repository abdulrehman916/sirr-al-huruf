/**
 * ASTRO CLOCK TIMING ADVISOR ENGINE
 * Analyzes stored knowledge to provide timing recommendations
 * Astro Clock only — never invents recommendations
 */

import { KNOWLEDGE_DAYS_ML, KNOWLEDGE_HOURS_ML, KNOWLEDGE_LUNAR_MANSIONS_ML, KNOWLEDGE_TIMING_RULES_ML } from './astroClockKnowledgeBaseML';

const ALL_KNOWLEDGE = [
  ...KNOWLEDGE_DAYS_ML,
  ...KNOWLEDGE_HOURS_ML,
  ...KNOWLEDGE_LUNAR_MANSIONS_ML,
  ...KNOWLEDGE_TIMING_RULES_ML
];

/**
 * Analyze knowledge base for a specific action
 * @param {string} action - User's intended action (e.g., "Business", "Love", "Marriage")
 * @returns {Object} Timing recommendations with sources
 */
export function getTimingAdvice(action) {
  const actionLower = action.toLowerCase();
  
  // Find all rules mentioning this action
  const matchingRules = ALL_KNOWLEDGE.filter(rule => {
    const searchText = [
      rule.original_text?.operations?.join(' ') || '',
      rule.original_text?.suitable_operations?.join(' ') || '',
      rule.malayalam?.suitable_actions || '',
      rule.malayalam?.benefits?.join(' ') || '',
      rule.malayalam?.meaning || '',
      rule.malayalam?.title || ''
    ].join(' ').toLowerCase();
    
    return searchText.includes(actionLower);
  });

  if (matchingRules.length === 0) {
    return {
      found: false,
      action: action,
      message: "No specific timing rules found for this action in stored knowledge.",
      suggestions: getGeneralSuggestions()
    };
  }

  // Analyze and categorize findings
  const analysis = analyzeMatchingRules(matchingRules, action);
  
  return {
    found: true,
    action: action,
    ...analysis,
    totalRulesFound: matchingRules.length
  };
}

/**
 * Analyze matching rules and extract timing recommendations
 */
function analyzeMatchingRules(rules, action) {
  const bestDays = [];
  const bestPlanets = [];
  const bestHours = [];
  const bestMansions = [];
  const suitableConditions = [];
  const unsuitableConditions = [];
  const enemyDays = [];
  const enemyHours = [];
  const sources = [];
  const disagreements = [];

  rules.forEach(rule => {
    // Extract source info
    const sourceInfo = {
      book: rule.source?.book || "Unknown",
      page: rule.source?.page || "N/A",
      category: rule.category,
      originalText: rule.original_text?.tr || rule.original_text?.rule || "",
      malayalamTitle: rule.malayalam?.title || "",
      malayalamExplanation: rule.malayalam?.meaning || ""
    };

    // Categorize by rule type
    if (rule.category === 'DAYS') {
      const dayData = extractDayData(rule, sourceInfo);
      if (dayData.isSuitable) {
        bestDays.push(dayData);
      } else if (dayData.isUnsuitable) {
        enemyDays.push(dayData);
      }
    }

    if (rule.category === 'HOURS') {
      const hourData = extractHourData(rule, sourceInfo);
      if (hourData.isSuitable) {
        bestHours.push(hourData);
      } else if (hourData.isUnsuitable) {
        enemyHours.push(hourData);
      }
    }

    if (rule.category === 'LUNAR_MANSIONS') {
      const mansionData = extractMansionData(rule, sourceInfo);
      if (mansionData.isSuitable) {
        bestMansions.push(mansionData);
      } else if (mansionData.isUnsuitable) {
        unsuitableConditions.push(mansionData);
      }
    }

    // Extract planet associations
    if (rule.original_text?.planet || rule.malayalam?.planet) {
      const planet = rule.original_text?.planet || rule.malayalam?.planet;
      if (!bestPlanets.find(p => p.name === planet)) {
        bestPlanets.push({
          name: planet,
          source: sourceInfo
        });
      }
    }

    // Track suitable/unsuitable conditions
    if (rule.malayalam?.suitable_actions) {
      suitableConditions.push({
        condition: rule.malayalam.suitable_actions,
        source: sourceInfo
      });
    }

    if (rule.malayalam?.unsuitable_actions) {
      unsuitableConditions.push({
        condition: rule.malayalam.unsuitable_actions,
        source: sourceInfo
      });
    }

    // Track warnings
    if (rule.malayalam?.warnings) {
      unsuitableConditions.push({
        condition: rule.malayalam.warnings,
        type: "warning",
        source: sourceInfo
      });
    }

    sources.push(sourceInfo);
  });

  // Check for disagreements between sources
  const disagreementAnalysis = findDisagreements(rules);
  if (disagreementAnalysis.length > 0) {
    disagreements.push(...disagreementAnalysis);
  }

  return {
    bestDays: consolidateRecommendations(bestDays),
    bestPlanets: consolidateRecommendations(bestPlanets),
    bestHours: consolidateRecommendations(bestHours),
    bestMansions: consolidateRecommendations(bestMansions),
    suitableConditions: consolidateRecommendations(suitableConditions),
    unsuitableConditions: consolidateRecommendations(unsuitableConditions),
    enemyDays: consolidateRecommendations(enemyDays),
    enemyHours: consolidateRecommendations(enemyHours),
    sources: deduplicateSources(sources),
    disagreements: disagreements.length > 0 ? disagreements : null
  };
}

/**
 * Extract day-specific data from a rule
 */
function extractDayData(rule, sourceInfo) {
  const dayName = rule.original_text?.day_name || rule.original_text?.tr || rule.malayalam?.title || "";
  const planet = rule.original_text?.planet || rule.malayalam?.planet || "";
  
  // Determine if suitable or unsuitable based on operations
  const operations = rule.original_text?.suitable_operations || rule.original_text?.operations || [];
  const malayalamBenefits = rule.malayalam?.benefits || [];
  
  const isSuitable = operations.length > 0 || malayalamBenefits.length > 0;
  const isUnsuitable = rule.malayalam?.unsuitable_actions || rule.malayalam?.warnings;

  return {
    name: dayName,
    planet: planet,
    operations: operations,
    malayalamExplanation: rule.malayalam?.meaning || "",
    isSuitable,
    isUnsuitable,
    source: sourceInfo
  };
}

/**
 * Extract hour-specific data from a rule
 */
function extractHourData(rule, sourceInfo) {
  const hourNumber = rule.original_text?.hour || rule.malayalam?.hour || "";
  const ruler = rule.original_text?.ruler || rule.malayalam?.ruler || "";
  
  return {
    hour: hourNumber,
    ruler: ruler,
    malayalamExplanation: rule.malayalam?.meaning || "",
    isSuitable: !rule.malayalam?.warnings,
    isUnsuitable: !!rule.malayalam?.warnings,
    source: sourceInfo
  };
}

/**
 * Extract mansion-specific data from a rule
 */
function extractMansionData(rule, sourceInfo) {
  const mansionName = rule.original_text?.name || rule.original_text?.tr || rule.malayalam?.title || "";
  const arabicLetter = rule.original_text?.letter?.arabic || rule.original_text?.letter_arabic || "";
  const zodiacSign = rule.original_text?.zodiac_sign || rule.malayalam?.zodiac || "";
  const generalRuling = rule.original_text?.genel_hukum || rule.malayalam?.general_ruling || "";
  
  return {
    name: mansionName,
    arabicLetter: arabicLetter,
    zodiacSign: zodiacSign,
    generalRuling: generalRuling,
    operations: rule.original_text?.operations || [],
    malayalamExplanation: rule.malayalam?.meaning || "",
    isSuitable: generalRuling?.includes('Saad') || generalRuling?.includes('Uygun') || rule.malayalam?.general_ruling?.includes('അനുയോജ്യം'),
    isUnsuitable: generalRuling?.includes('Nahs') || generalRuling?.includes('Uğursuz') || rule.malayalam?.general_ruling?.includes('അനുയോജ്യമല്ല'),
    source: sourceInfo
  };
}

/**
 * Find disagreements between different sources
 */
function findDisagreements(rules) {
  const disagreements = [];
  
  // Group by category
  const byCategory = {};
  rules.forEach(rule => {
    if (!byCategory[rule.category]) {
      byCategory[rule.category] = [];
    }
    byCategory[rule.category].push(rule);
  });

  // Check for conflicting rulings within categories
  Object.keys(byCategory).forEach(category => {
    const categoryRules = byCategory[category];
    if (categoryRules.length > 1) {
      const suitable = categoryRules.filter(r => 
        r.malayalam?.general_ruling?.includes('അനുയോജ്യം') ||
        r.original_text?.genel_hukum?.includes('Saad') ||
        r.original_text?.genel_hukum?.includes('Uygun')
      );
      const unsuitable = categoryRules.filter(r =>
        r.malayalam?.general_ruling?.includes('അനുയോജ്യമല്ല') ||
        r.original_text?.genel_hukum?.includes('Nahs') ||
        r.original_text?.genel_hukum?.includes('Uğursuz')
      );

      if (suitable.length > 0 && unsuitable.length > 0) {
        disagreements.push({
          category: category,
          type: "Suitability Conflict",
          opinion1: {
            ruling: "Suitable",
            sources: suitable.map(s => ({
              book: s.source?.book,
              page: s.source?.page,
              text: s.malayalam?.title || s.original_text?.tr
            }))
          },
          opinion2: {
            ruling: "Unsuitable",
            sources: unsuitable.map(u => ({
              book: u.source?.book,
              page: u.source?.page,
              text: u.malayalam?.title || u.original_text?.tr
            }))
          }
        });
      }
    }
  });

  return disagreements;
}

/**
 * Consolidate duplicate recommendations
 */
function consolidateRecommendations(items) {
  const consolidated = [];
  const seen = new Set();

  items.forEach(item => {
    const key = item.name || item.hour || item.condition || JSON.stringify(item);
    if (!seen.has(key)) {
      seen.add(key);
      consolidated.push(item);
    }
  });

  return consolidated;
}

/**
 * Deduplicate source references
 */
function deduplicateSources(sources) {
  const unique = [];
  const seen = new Set();

  sources.forEach(source => {
    const key = `${source.book}-${source.page}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(source);
    }
  });

  return unique;
}

/**
 * Get general suggestions when no specific match found
 */
function getGeneralSuggestions() {
  return {
    note: "No specific rules found. Consider general principles:",
    suggestions: [
      {
        category: "Moon Phase",
        advice: "Waxing moon (വളരുന്ന ചന്ദ്രൻ) for positive actions, Waning moon (ചുരുങ്ങുന്ന ചന്ദ്രൻ) for baneful works",
        source: "General Timing Rules"
      },
      {
        category: "Planetary Hours",
        advice: "Use the planetary hour of the day's ruler for general purposes",
        source: "Planetary Hour Rules"
      },
      {
        category: "Recommendation",
        advice: "Search for related actions (e.g., 'wealth' for business, 'love' for marriage)",
        source: "System"
      }
    ]
  };
}

/**
 * Get all available actions from knowledge base
 * @returns {Array} List of actions that have timing rules
 */
export function getAvailableActions() {
  const actions = new Set();

  ALL_KNOWLEDGE.forEach(rule => {
    // Extract from operations
    if (rule.original_text?.suitable_operations) {
      rule.original_text.suitable_operations.forEach(op => actions.add(op));
    }
    if (rule.original_text?.operations) {
      rule.original_text.operations.forEach(op => actions.add(op));
    }
    // Extract from Malayalam
    if (rule.malayalam?.suitable_actions) {
      const actions_split = rule.malayalam.suitable_actions.split(/[,,]/);
      actions_split.forEach(a => actions.add(a.trim()));
    }
    if (rule.malayalam?.benefits) {
      rule.malayalam.benefits.forEach(b => actions.add(b));
    }
  });

  return Array.from(actions).sort();
}

/**
 * Search for similar actions
 * @param {string} action - User's action
 * @returns {Array} Similar actions found in knowledge base
 */
export function findSimilarActions(action) {
  const actionLower = action.toLowerCase();
  const availableActions = getAvailableActions();
  
  return availableActions.filter(a => 
    a.toLowerCase().includes(actionLower) ||
    actionLower.includes(a.toLowerCase().split(' ')[0])
  ).slice(0, 10);
}