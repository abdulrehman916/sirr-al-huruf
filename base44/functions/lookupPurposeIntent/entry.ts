import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// PURPOSE DICTIONARY LOOKUP — Read-only backend function
// ═══════════════════════════════════════════════════════════════
// ISOLATION: This function is called ONLY from the 7th Mizan
// custom purpose field via purposeDictionaryLookup.js →
// RitualDecisionEngine.jsx. It must NEVER be used by any other
// Mizan, any Ebced/Bast calculation, any Kasam, any Astro Clock
// computation, or any ritual mathematics.
//
// RESPONSIBILITY: 7th Mizan Custom Purpose → lookup → return
// normalized_purpose_key → pass to existing Ritual Timing Engine.
// Nothing else.
//
// SCALABILITY: Uses database-level indexed queries (filter + limit)
// instead of loading all entries into memory. Supports unlimited
// dictionary growth (thousands to millions of entries) with no
// code changes needed.
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { customPurpose } = body;

    if (!customPurpose || !customPurpose.trim()) {
      return Response.json({ matched: false });
    }

    // Normalize: strip harakat, tatweel, lowercase, trim
    const normalize = (text) => {
      return String(text)
        .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '') // harakat
        .replace(/\u0640/g, '')                               // tatweel
        .toLowerCase()
        .trim();
    };

    const normalizedInput = normalize(customPurpose);
    if (!normalizedInput) {
      return Response.json({ matched: false });
    }

    // Helper: try a single database query and return first match
    const tryQuery = async (query) => {
      const results = await base44.asServiceRole.entities.PurposeDictionary.filter(
        query,
        null,
        1 // limit — only need the first match
      );
      if (results && results.length > 0) {
        const entry = results[0];
        return {
          matched: true,
          ritualIntent: entry.normalized_purpose_key,
          matchedPhrase: entry.purpose_phrase,
          source: entry.source || null,
        };
      }
      return null;
    };

    // ── STEP 1: Exact match on aliases array (indexed) ──
    // Aliases contain pre-normalized forms (no harakat) in Arabic,
    // Malayalam, and English, so this covers most lookups.
    const aliasResult = await tryQuery({
      is_active: true,
      aliases: normalizedInput,
    });
    if (aliasResult) return Response.json(aliasResult);

    // ── STEP 2: Exact match on arabic_keyword (indexed) ──
    const keywordResult = await tryQuery({
      is_active: true,
      arabic_keyword: normalizedInput,
    });
    if (keywordResult) return Response.json(keywordResult);

    // ── STEP 3: Multi-word fallback (max 3 longest words) ──
    // For inputs like "جلب المحبة طرفة العين", split into words
    // and try the longest, most specific words as alias lookups.
    const words = normalizedInput
      .split(/\s+/)
      .filter((w) => w.length >= 3)
      .sort((a, b) => b.length - a.length)
      .slice(0, 3); // limit to 3 queries for performance

    if (words.length > 1) {
      for (const word of words) {
        const wordResult = await tryQuery({
          is_active: true,
          aliases: word,
        });
        if (wordResult) return Response.json(wordResult);
      }
    }

    return Response.json({ matched: false });
  } catch (error) {
    return Response.json({ matched: false, error: error.message }, { status: 500 });
  }
});