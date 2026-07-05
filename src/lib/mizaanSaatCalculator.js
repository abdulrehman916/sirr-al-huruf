// ═══════════════════════════════════════════════════════════════
// MIZAAN 4 — SAAT (HOUR) "NOW" DETECTION
// ─────────────────────────────────────────────────────────────
// Manuscript rule:
//   • Day Saat 1 begins at Sunrise; Day Saat 12 ends at Sunset.
//   • Night Saat 1 begins at Sunset; Night Saat 12 ends at next Sunrise.
//
// This delegates to the EXISTING Astro Clock `getCurrentPlanetaryHour`
// calculation — it already divides the daytime period (Sunrise→Sunset)
// and nighttime period (Sunset→next Sunrise) into 12 Saat each and
// returns the hourNumber (1–12) whose interval contains the current time.
//
// No Saat is calculated from the raw clock hour. The current time is
// compared directly against the Astro Clock's Sunrise/Sunset-based Saat
// intervals. Manual Saat selection is untouched.
//
// The `dayNight` argument is accepted for interface compatibility but
// intentionally NOT used: "NOW" reflects the actual Saat containing the
// current moment, per the Astro Clock, regardless of the Mizaan3 selection.
// ═══════════════════════════════════════════════════════════════
import { getCurrentPlanetaryHour } from "./astroClockLiveEngine";
import { calculateSunriseSunset, getUserLocation } from "./astroClockSunriseSunset";

/**
 * Returns the current Saat (1–12) — the Astro Clock Saat interval that
 * contains the current time.
 *
 * @param {*} _dayNight — accepted for interface compatibility; intentionally unused.
 * @returns {number} 1–12
 */
export function getCurrentSaat(_dayNight = null) {
  const now = new Date();
  const loc = getUserLocation();
  const { sunrise, sunset } = calculateSunriseSunset(now, loc.lat, loc.lng, loc.timezone);

  // Polar edge-case fallback (never occurs in the default Dubai location) —
  // preserves a safe 1–12 value so the UI never breaks.
  if (sunrise === null || sunset === null) {
    return (Math.floor(now.getHours() / 2) % 12) + 1;
  }

  // Use the EXACT Astro Clock Saat interval calculation. This returns the
  // hourNumber whose [hourStart, hourEnd) interval contains the current time.
  const hour = getCurrentPlanetaryHour(now, sunrise, sunset);
  return hour.hourNumber;
}