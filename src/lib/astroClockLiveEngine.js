// ═══════════════════════════════════════════════════
// ASTRO CLOCK LIVE ENGINE
// Weekday analysis data for Day Analysis Panel
// Completely independent. No shared logic.
// ═══════════════════════════════════════════════════

export const WEEKDAY_ANALYSIS = [
  {
    // Sunday - Sun
    friendlyDays: ["Monday", "Thursday", "Friday"],
    enemyDays: ["Tuesday", "Saturday"],
    business: "Good for leadership, authority, government work",
    love: "Passionate but ego-driven",
    marriage: "Moderate - ensure humility",
    travel: "Excellent for important journeys",
    healing: "Good for heart, spine, vitality",
    goodWorks: ["Leadership roles", "Government business", "Seeking promotions", "Starting ventures"],
    badWorks: ["Humble tasks", "Submitting to others", "Secretive activities"],
    spiritual: "Invoke solar deities, seek authority, leadership spells",
    source: "Traditional Astrological Manuscripts",
    malayalam: "ഞായറാഴ്ച സൂര്യന്റെ ദിവസമാണ്. നേതൃത്വത്തിനും അധികാരത്തിനും ഉത്തമം."
  },
  {
    // Monday - Moon
    friendlyDays: ["Sunday", "Tuesday", "Thursday"],
    enemyDays: ["Wednesday", "Saturday"],
    business: "Good for public dealings, women-related business",
    love: "Emotional, nurturing, romantic",
    marriage: "Very favorable, especially for women",
    travel: "Good for short trips, water-related travel",
    healing: "Good for stomach, breasts, fluids",
    goodWorks: ["Family matters", "Emotional healing", "Public relations", "Women's issues"],
    badWorks: ["Confrontations", "Aggressive actions", "Fire-related work"],
    spiritual: "Moon invocations, emotional healing, intuition development",
    source: "Traditional Astrological Manuscripts",
    malayalam: "തിങ്കളാഴ്ച ചന്ദ്രന്റെ ദിവസമാണ്. വികാരങ്ങൾക്കും കുടുംബകാര്യങ്ങൾക്കും ഉത്തമം."
  },
  {
    // Tuesday - Mars
    friendlyDays: ["Sunday", "Monday", "Thursday"],
    enemyDays: ["Friday", "Saturday"],
    business: "Good for competitive business, sports, military",
    love: "Intense, passionate, impulsive",
    marriage: "Challenging - may cause conflicts",
    travel: "Good for adventurous travel, risky journeys",
    healing: "Good for muscles, blood, surgery",
    goodWorks: ["Competitive activities", "Sports", "Military matters", "Surgery"],
    badWorks: ["Peace negotiations", "Romantic dates", "Financial planning"],
    spiritual: "Protection spells, courage invocations, enemy defeat",
    source: "Traditional Astrological Manuscripts",
    malayalam: "ചൊവ്വാഴ്ച ചൊവ്വയുടെ ദിവസമാണ്. ധൈര്യത്തിനും മത്സരങ്ങൾക്കും ഉത്തമം."
  },
  {
    // Wednesday - Mercury
    friendlyDays: ["Friday", "Saturday"],
    enemyDays: ["Monday", "Thursday"],
    business: "Excellent for communication, trade, writing",
    love: "Intellectual, communicative, friendly",
    marriage: "Good for contracts, agreements",
    travel: "Excellent for business trips, learning journeys",
    healing: "Good for nervous system, hands, communication",
    goodWorks: ["Writing", "Teaching", "Business deals", "Learning"],
    badWorks: ["Emotional decisions", "Physical labor", "Silent retreats"],
    spiritual: "Knowledge spells, communication enhancement, learning",
    source: "Traditional Astrological Manuscripts",
    malayalam: "ബുധനാഴ്ച ബുധന്റെ ദിവസമാണ്. ആശയവിനിമയത്തിനും വ്യാപാരത്തിനും ഉത്തമം."
  },
  {
    // Thursday - Jupiter
    friendlyDays: ["Sunday", "Monday", "Tuesday"],
    enemyDays: ["Wednesday"],
    business: "Excellent for finance, law, education, religion",
    love: "Generous, optimistic, committed",
    marriage: "Most favorable day for weddings",
    travel: "Excellent for pilgrimages, educational travel",
    healing: "Good for liver, wealth, expansion",
    goodWorks: ["Weddings", "Financial investments", "Education", "Religious activities"],
    badWorks: ["Deception", "Frugal activities", "Ending relationships"],
    spiritual: "Prosperity spells, wisdom invocations, religious rites",
    source: "Traditional Astrological Manuscripts",
    malayalam: "വ്യാഴാഴ്ച ഗുരുവിന്റെ ദിവസമാണ്. വിവാഹത്തിനും ധനകാര്യങ്ങൾക്കും ഉത്തമം."
  },
  {
    // Friday - Venus
    friendlyDays: ["Wednesday", "Saturday"],
    enemyDays: ["Tuesday", "Sunday"],
    business: "Excellent for arts, beauty, luxury, relationships",
    love: "Romantic, harmonious, pleasurable",
    marriage: "Very favorable, especially for men",
    travel: "Good for pleasure trips, romantic getaways",
    healing: "Good for kidneys, beauty treatments, throat",
    goodWorks: ["Art", "Music", "Romance", "Beauty treatments", "Social events"],
    badWorks: ["Confrontations", "Ugly tasks", "Isolation"],
    spiritual: "Love spells, beauty enhancement, harmony invocations",
    source: "Traditional Astrological Manuscripts",
    malayalam: "വെള്ളിയാഴ്ച ശുക്രന്റെ ദിവസമാണ്. പ്രണയത്തിനും കലകൾക്കും ഉത്തമം."
  },
  {
    // Saturday - Saturn
    friendlyDays: ["Wednesday", "Friday"],
    enemyDays: ["Sunday", "Monday", "Tuesday"],
    business: "Good for long-term planning, real estate, discipline",
    love: "Serious, committed, restrictive",
    marriage: "Moderate - ensures longevity but challenges",
    travel: "Good for pilgrimages, solitary travel",
    healing: "Good for bones, teeth, chronic conditions",
    goodWorks: ["Discipline", "Long-term planning", "Real estate", "Meditation"],
    badWorks: ["Quick gains", "Parties", "Superficial activities"],
    spiritual: "Protection from enemies, karma clearing, discipline",
    source: "Traditional Astrological Manuscripts",
    malayalam: "ശനിയാഴ്ച ശനിയുടെ ദിവസമാണ്. ദീർഘകാല ആസൂത്രണത്തിനും ധ്യാനത്തിനും ഉത്തമം."
  }
];

export const ASTRO_CLOCK_LIVE_ENGINE_STATUS = {
  version: "1.0.0",
  initialized: true,
  note: "Weekday analysis engine ready - 7 days loaded with Malayalam support"
};