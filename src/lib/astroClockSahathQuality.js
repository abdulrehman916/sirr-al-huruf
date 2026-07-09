/**
 * SAHATH QUALITY SYSTEM — Manuscript-Based
 *
 * GLOBAL RULE: No Sahath is completely unusable. Every Sahath has suitable
 * and less suitable purposes. Quality indicates overall strength only.
 * Never use labels: Avoid, Do Not Do, Forbidden, Bad Time.
 *
 * Quality is derived from:
 * 1. Planet nature (Sa'd/Nahs) — base strength (Havâss'ın Derinlikleri)
 * 2. Friendship with the day ruler — adjustment (manuscript friendship tables)
 *
 * Levels:
 * 🟢 Excellent (5) — Sa'd planet, friend of day ruler
 * 🟢 Very Good (4) — Strong Sa'd, or Sa'd + friend
 * 🟡 Good (3) — Sa'd planet, neutral to day ruler
 * 🟠 Moderate (2) — Mixed/Nahs planet, or Sa'd + enemy
 * 🔴 Weak (1) — Nahs planet, enemy of day ruler
 *
 * Source: Havâss'ın Derinlikleri — manuscript planetary nature + friendships
 */

import { PLANET_FRIENDSHIPS } from "./astroClockPlanetFriendships.js";

// Base strength from manuscript planet nature (Sa'd Akbar → Nahs Akbar)
const PLANET_NATURE_STRENGTH = {
  jupiter: 4,  // Sa'd Akbar (Most Benefic)
  sun: 3,      // Sa'd (King of Planets)
  venus: 3,    // Sa'd (Planet of Love)
  moon: 3,     // Sa'd (Most Influential)
  mercury: 2,  // Mixed (benefic with benefics, malefic with malefics)
  mars: 2,     // Nahs (Malefic)
  saturn: 1,   // Nahs Akbar (Greater Malefic)
};

export const QUALITY_META = {
  5: { dot: "🟢", color: "#22c55e", label_en: "Excellent", label_ml: "മികച്ചത്", label_tr: "Mükemmel" },
  4: { dot: "🟢", color: "#4ADE80", label_en: "Very Good", label_ml: "വളരെ നല്ലത്", label_tr: "Çok İyi" },
  3: { dot: "🟡", color: "#F5D060", label_en: "Good", label_ml: "നല്ലത്", label_tr: "İyi" },
  2: { dot: "🟠", color: "#FB923C", label_en: "Moderate", label_ml: "സാധാരണം", label_tr: "Orta" },
  1: { dot: "🔴", color: "#F87171", label_en: "Weak", label_ml: "ദുർബലം", label_tr: "Zayıf" },
};

/**
 * Returns the manuscript-based quality for a Sahath.
 * @param {string} planetKey — Hour planet key (sun, moon, mars, etc.)
 * @param {string|null} dayRulerPlanet — Day ruler planet key, or null if unknown
 * @returns {object} { dot, color, label_en, label_ml, label_tr, level }
 */
export function getSahathQuality(planetKey, dayRulerPlanet) {
  let strength = PLANET_NATURE_STRENGTH[planetKey] || 2;
  if (dayRulerPlanet && planetKey === dayRulerPlanet) {
    strength += 1;
  } else if (dayRulerPlanet) {
    const fr = PLANET_FRIENDSHIPS[planetKey];
    if (fr) {
      if (fr.friends.includes(dayRulerPlanet)) strength += 1;
      else if (fr.enemies.includes(dayRulerPlanet)) strength -= 1;
    }
  }
  const level = Math.max(1, Math.min(5, strength));
  return { ...QUALITY_META[level], level };
}