import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// PURPOSE DICTIONARY LOOKUP — Read-only backend function
// ═══════════════════════════════════════════════════════════════
// ── PERMANENT ISOLATION CONTRACT (immutable) ──
// This is the ONLY code permitted to READ the PurposeDictionary.
//   • READ ONLY. Never writes.
//   • Returns exactly ONE normalized_purpose_key, or {matched:false}.
//   • Must NEVER modify any workflow, trigger any calculation,
//     perform scoring/timing/AI/semantic inference, or influence
//     any Mizan, engine, Ebced, Bast, Kasam, or Astro Clock output.
//   • Must use indexed database queries with LIMIT 1 — never load
//     the full dictionary into memory. Must stay fast at 1M+ records.
//   • On no match → return {matched:false} and let the existing
//     workflow continue exactly as before.
// Caller: src/lib/purposeDictionaryLookup.js (7th Mizan custom purpose).
// No other file, function, engine, page, or component may read this DB.
// See src/lib/purposeDictionaryIsolationLaw.js for the full contract.
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
          malayalam_meaning: entry.malayalam_meaning || "",
          english_meaning: entry.english_meaning || "",
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

    // ── STEP 3: Per-word fallback (up to 3 longest words) ──
    // Even a SINGLE remaining token (e.g. "البدن") is queried — never
    // skipped. Each word is tried against BOTH aliases and arabic_keyword.
    const words = normalizedInput
      .split(/\s+/)
      .filter((w) => w.length >= 3)
      .sort((a, b) => b.length - a.length)
      .slice(0, 3); // limit to 3 words for performance

    for (const word of words) {
      const aliasHit = await tryQuery({ is_active: true, aliases: word });
      if (aliasHit) return Response.json(aliasHit);
      const keywordHit = await tryQuery({ is_active: true, arabic_keyword: word });
      if (keywordHit) return Response.json(keywordHit);
    }

    return Response.json({ matched: false });
  } catch (error) {
    return Response.json({ matched: false, error: error.message }, { status: 500 });
  }
});