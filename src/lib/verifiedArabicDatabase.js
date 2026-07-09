// ═══════════════════════════════════════════════════════════════
// VERIFIED ARABIC DATABASE — FRONTEND LOOKUP MODULE (STRICT)
// ═══════════════════════════════════════════════════════════════
// STRICT CACHE RULES:
//   - Only cache records with verification_status === 'verified'
//   - Never cache unverified records
//   - Never cache manual_review_required records
//
// BACKEND WORKFLOW (verifyArabicText function):
//   STEP 1: Check VerifiedArabic DB (return only verified/manual_review)
//   STEP 2: Check HolyOneName (divine names)
//   STEP 3: Search manuscript data (ManuscriptRule + frontend-passed)
//   STEP 4: Internet search (authoritative sources)
//   STEP 5: Cross-validate ALL sources
//   STEP 6: Save ONLY verified or manual_review. Unverified → save nothing.
//
// RULE: AI MUST NEVER GUESS harakat. If unverified → "Verification unavailable".
// ═══════════════════════════════════════════════════════════════

import { base44 } from "@/api/base44Client";

const CACHE_KEY_PREFIX = "verified_arabic_";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours — only for verified records

// ── Normalize Arabic for cache key ──
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

// ── Promise sharing: one request per unique text per session ──
const inflightPromises = new Map();

/**
 * Lookup verified Arabic text with full harakat, translations, and source.
 *
 * STRICT RULES:
 *   - Only verified records are cached in localStorage
 *   - Unverified records are never cached
 *   - Promise sharing prevents duplicate API calls within a session
 *
 * @param {string} arabicText - The Arabic text to verify
 * @param {string} [sourceType] - quran, hadith, divine_name, dua, etc.
 * @param {string} [bookName] - Source book name
 * @param {string|number} [pageNumber] - Source page number
 * @param {string} [section] - Section/chapter name
 * @param {string} [manuscriptArabicText] - Arabic text from app's manuscript data files (for Step 3 comparison)
 * @param {string} [manuscriptSource] - Which manuscript source (for reference)
 * @returns {Promise<Object>} - { arabic_text, malayalam_meaning, english_meaning,
 *   verification_status, source_url, book_name, page_number, section, notes, reused }
 */
export async function lookupVerifiedArabic(
  arabicText,
  sourceType,
  bookName,
  pageNumber,
  section,
  manuscriptArabicText,
  manuscriptSource
) {
  if (!arabicText || typeof arabicText !== "string") return null;

  const cacheKey = CACHE_KEY_PREFIX + normalizeForCache(arabicText);

  // Check localStorage cache — ONLY verified records are cached
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.cached_at < CACHE_TTL) {
        // Only return cached data if it was verified
        if (parsed.data?.verification_status === "verified") {
          return parsed.data;
        }
        // If cached but not verified, remove it (shouldn't happen, but safety)
        localStorage.removeItem(cacheKey);
      }
    }
  } catch {
    // localStorage not available — proceed to API
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
        section: section,
        manuscript_arabic_text: manuscriptArabicText,
        manuscript_source: manuscriptSource,
      });

      const data = response.data;

      // STRICT CACHE RULE: Only cache verified records
      if (data?.verification_status === "verified") {
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, cached_at: Date.now() })
          );
        } catch {
          // Storage full — non-critical
        }
      }
      // Unverified and manual_review records are NOT cached

      return data;
    } catch (error) {
      console.error("Verified Arabic lookup failed:", error);
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