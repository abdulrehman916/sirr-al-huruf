import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// PURPOSE DICTIONARY LOOKUP — Read-only backend function
// ═══════════════════════════════════════════════════════════════
// Called silently from the Ritual Decision Engine after the 7th
// Mizan. Checks the PurposeDictionary (admin-only entity, read via
// service role) for a match against the user's custom purpose text.
//
// Returns ONLY the normalized purpose key — never dictionary contents.
// If no match: returns { matched: false }.
//
// This function does NOT calculate anything. It is a pure lookup.
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { customPurpose } = body;

    if (!customPurpose || !customPurpose.trim()) {
      return Response.json({ matched: false });
    }

    // Normalize: strip harakat, tatweel, non-Arabic/Latin chars, lowercase
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

    // Fetch all active dictionary entries via service role
    const entries = await base44.asServiceRole.entities.PurposeDictionary.filter({
      is_active: true
    });

    // Check each entry's phrase + aliases against the normalized input
    for (const entry of entries) {
      const phrases = [entry.purpose_phrase, ...(entry.aliases || [])];
      for (const phrase of phrases) {
        const np = normalize(phrase);
        if (np && normalizedInput.includes(np)) {
          return Response.json({
            matched: true,
            ritualIntent: entry.normalized_purpose_key,
            matchedPhrase: phrase,
            source: entry.source || null,
          });
        }
      }
    }

    return Response.json({ matched: false });
  } catch (error) {
    return Response.json({ matched: false, error: error.message }, { status: 500 });
  }
});