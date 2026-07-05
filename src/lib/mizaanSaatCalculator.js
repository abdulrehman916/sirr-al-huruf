// ═══════════════════════════════════════════════════════════════
// MIZAAN 4 — SAAT (HOUR) CALCULATOR
// ─────────────────────────────────────────────────────────────
// Manuscript rule:
//   • Day Saat 1 begins at Sunrise; Day Saat 12 ends at Sunset.
//   • Night Saat 1 begins at Sunset; Night Saat 12 ends at next Sunrise.
//
// Uses the EXISTING Astro Clock sunrise/sunset calculation (NOAA),
// read-only. Does NOT modify the Astro Clock in any way.
// ═══════════════════════════════════════════════════════════════
import { calculateSunriseSunset, getUserLocation } from "./astroClockSunriseSunset";

/**
 * Returns the current Saat (1–12) within the Day or Night period,
 * calculated from the existing Astro Clock sunrise/sunset times.
 *
 * @param {"gunduz"|"gece"|null} dayNight — Mizaan3 selection.
 *        If null, the period is auto-detected from the current clock time
 *        (Day if between sunrise and sunset, otherwise Night).
 * @returns {number} 1–12
 */
export function getCurrentSaat(dayNight = null) {
  const now = new Date();
  const loc = getUserLocation();
  const { sunrise, sunset } = calculateSunriseSunset(now, loc.lat, loc.lng, loc.timezone);

  // Polar edge-case fallback (never occurs in default Dubai location) —
  // preserves the original fixed 2-hour bin so the UI never breaks.
  if (sunrise === null || sunset === null) {
    return (Math.floor(now.getHours() / 2) % 12) + 1;
  }

  const nowDec = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

  // Auto-detect period from current time when Mizaan3 has no selection
  const isDaytime = nowDec >= sunrise && nowDec < sunset;
  const period = dayNight || (isDaytime ? "gunduz" : "gece");

  if (period === "gunduz") {
    // Day period: [sunrise, sunset]
    const periodLength = sunset - sunrise;
    if (periodLength <= 0) return 1;
    let saat = Math.floor((nowDec - sunrise) / (periodLength / 12)) + 1;
    return Math.max(1, Math.min(12, saat));
  }

  // Night period: [sunset, next sunrise] — spans midnight
  const nextSunrise = sunrise + 24;
  let nightNow = nowDec;
  if (nightNow < sunset) nightNow += 24; // pre-dawn hours belong to the night that began at sunset
  const periodLength = nextSunrise - sunset;
  if (periodLength <= 0) return 1;
  let saat = Math.floor((nightNow - sunset) / (periodLength / 12)) + 1;
  return Math.max(1, Math.min(12, saat));
}