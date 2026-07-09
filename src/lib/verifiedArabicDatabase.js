// ═══════════════════════════════════════════════════════════════
// VERIFIED ARABIC DATABASE — FRONTEND LOOKUP MODULE
// ═══════════════════════════════════════════════════════════════
// Provides lookupVerifiedArabic() which:
//   1. Checks localStorage cache (24h TTL, one-time per text)
//   2. Calls verifyArabicText backend function (full workflow)
//   3. Shares in-flight promises to prevent duplicate API calls
//
// The backend function handles:
//   STEP 1: Check VerifiedArabic entity (by text_hash)
//   STEP 2: Check HolyOneName (for divine names)
//   STEP 3: Internet search (authoritative sources)
//   STEP 4: Cross-verification
//   STEP 5: Harakat (copy exactly, never guess)
//   STEP 6: Translation (from verified Arabic only)
//   STEP 7: Save permanently
//   STEP 8: Reuse on future calls
//
// RULE: AI MUST NEVER GUESS harakat. If unverified → "Verification unavailable".
// ═══════════════════════════════════════════════════════════════

import { base44 } from "@/api/base44Client";

const CACHE_KEY_PREFIX = "verified_arabic_";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ── Normalize Arabic for cache key (strip harakat, normalize alef) ──
const ARABIC_LETTER_RANGES = [
  [0x0621, 0x064a],
  [0x066e, 0x066f],
  [0x0671, 0x06d3],
  [0x06d5, 0x06d5],
];
const ALEF_VARIANTS = new Set([0x0623, 0x0625, 0x0622, 0x0671]);
const PLAIN_ALEF = "\u0627";

function isInRange(code, ranges) {
  return ranges.some(([s, e]) => code >= s && code <= e);
}

function normalizeForCache(text) {
  if (!text || typeof text !== "string") return "";
  let result = "";
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (isInRange(code, ARABIC_LETTER_RANGES)) {
      result += ALEF_VARIANTS.has(code) ? PLAIN_ALEF : ch;
    }
  }
  return result.slice(0, 100);
}

// ── Promise sharing: one request per unique text ──
const inflightPromises = new Map();

/**
 * Lookup verified Arabic text with full harakat, translations, and source.
 *
 * @param {string} arabicText - The Arabic text to verify
 * @param {string} [sourceType] - Category: quran, hadith, divine_name, dua, etc.
 * @param {string} [bookName] - Source book name
 * @param {string|number} [pageNumber] - Source page number
 * @returns {Promise<Object>} - { arabic_text, malayalam_meaning, english_meaning,
 *   verification_status, source_url, book_name, page_number, notes, reused }
 */
export async function lookupVerifiedArabic(arabicText, sourceType, bookName, pageNumber) {
  if (!arabicText || typeof arabicText !== "string") return null;

  const cacheKey = CACHE_KEY_PREFIX + normalizeForCache(arabicText);

  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.cached_at < CACHE_TTL) {
        return parsed.data;
      }
    }
  } catch {
    // localStorage not available or corrupt — proceed to API
  }

  // Promise sharing — prevents duplicate API calls during rapid re-renders
  if (inflightPromises.has(cacheKey)) {
    return inflightPromises.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const response = await base44.functions.invoke("verifyArabicText", {
        arabic_text: arabicText,
        source_type: sourceType,
        book_name: bookName,
        page_number: pageNumber,
      });

      const data = response.data;

      // Cache the result permanently in localStorage (24h TTL)
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, cached_at: Date.now() })
        );
      } catch {
        // Storage full or unavailable — non-critical
      }

      return data;
    } catch (error) {
      console.error("Verified Arabic lookup failed:", error);
      // Graceful fallback — never crash the UI
      return {
        verification_status: "unverified",
        arabic_text: arabicText,
        malayalam_meaning: "",
        english_meaning: "",
        source: "error",
        notes: "Verification service temporarily unavailable.",
      };
    } finally {
      inflightPromises.delete(cacheKey);
    }
  })();

  inflightPromises.set(cacheKey, promise);
  return promise;
}

/**
 * Clear the localStorage cache for a specific Arabic text.
 * Useful when admin re-verifies a text and wants to force re-lookup.
 */
export function clearVerifiedArabicCache(arabicText) {
  if (!arabicText) return;
  try {
    localStorage.removeItem(CACHE_KEY_PREFIX + normalizeForCache(arabicText));
  } catch {
    // Non-critical
  }
}

/**
 * Clear all verified Arabic cache entries.
 */
export function clearAllVerifiedArabicCache() {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(CACHE_KEY_PREFIX)
    );
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Non-critical
  }
}