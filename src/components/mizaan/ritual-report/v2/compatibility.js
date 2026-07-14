import { DAY_KEY_BY_INDEX } from "../shared";

// Compute compatibility breakdown with optional overrides for "what-if" scenarios.
// overrides: { dayKey, planetLC, period } — when provided, used instead of current selection.
export function computeCompat(analysis, overrides = {}) {
  const req = analysis?.req || {};
  const liveNow = analysis?.liveNow || {};
  const astro = analysis?.astroClockStatus || {};
  const matchingRules = analysis?.matchingRules || [];

  const dayKey = overrides.dayKey || DAY_KEY_BY_INDEX[astro.activeWeekday];
  const planetLC = overrides.planetLC || String(liveNow.kawkab || liveNow.planetaryHour || "").toLowerCase();

  const purposeMatch = analysis?.ritualType && analysis.ritualType !== "General Work" ? 100 : 0;
  const bookRuleMatch = matchingRules.length > 0 ? 100 : 0;

  let dayMatch = 50;
  if (req.days?.includes(dayKey)) dayMatch = 100;
  else if (req.worstDays?.includes(dayKey)) dayMatch = 0;
  else if (req.days?.length > 0) dayMatch = 40;

  let saatMatch = 50;
  if (req.hours?.some((p) => p.toLowerCase() === planetLC)) saatMatch = 100;
  else if (req.worstHours?.some((p) => p.toLowerCase() === planetLC)) saatMatch = 0;
  else if (req.hours?.length > 0) saatMatch = 40;

  let planetMatch = 50;
  if (req.hours?.some((p) => p.toLowerCase() === planetLC)) planetMatch = 100;
  else if (req.enemyPlanets?.some((p) => p.toLowerCase() === planetLC)) planetMatch = 10;
  else if (req.worstHours?.some((p) => p.toLowerCase() === planetLC)) planetMatch = 10;

  const final = Math.round((purposeMatch + bookRuleMatch + dayMatch + saatMatch + planetMatch) / 5);
  return { purposeMatch, bookRuleMatch, dayMatch, saatMatch, planetMatch, final };
}

export function compatColor(pct) {
  return pct >= 70 ? "#4ADE80" : pct >= 50 ? "#FBBF24" : pct > 0 ? "#FB923C" : "#F87171";
}