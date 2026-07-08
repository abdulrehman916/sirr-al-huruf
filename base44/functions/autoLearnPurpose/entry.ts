import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// AUTO-LEARN PURPOSE — Self-learning Purpose Dictionary entry
// ═══════════════════════════════════════════════════════════════
// PIPELINE (frozen):
//   1. Call lookupPurposeIntent (existing locked lookup) — if match,
//      return the stored meaning immediately. Never regenerate.
//   2. If NO match → use InvokeLLM to generate Malayalam + English
//      meanings from the Arabic phrase (action + purpose + modifier).
//   3. Save the new entry to PurposeDictionary (source: "Auto Generated",
//      notes: "Needs Review") so future lookups find it instantly.
//   4. Return the result in the same shape as lookupPurposeIntent.
//
// LEARN ONCE — NEVER RECALCULATE:
//   After an entry is saved, every subsequent call finds it in step 1
//   and returns the stored meaning. The LLM is never asked again for
//   the same phrase. The dictionary grows smarter with every new purpose.
//
// ISOLATION COMPLIANCE:
//   • READS: delegates to lookupPurposeIntent (the only authorized reader).
//   • WRITES: creates new PurposeDictionary entries via asServiceRole.
//
// Caller: src/lib/purposeDictionaryLookup.js (replaces direct lookupPurposeIntent call).
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// PURPOSE PHRASE PARSER — Positional structure extraction
// ═══════════════════════════════════════════════════════════════
// Every custom purpose follows: [Action Card] + [Main Purpose] + [Modifier]
//   Action Cards:  جلب, طرد, الصحة, السقم  (first word)
//   Modifiers:     طرفة العين              (last 2 words)
//   Main Purpose:  everything in between   (ONLY this goes to the dictionary)
//
// The Main Purpose is NEVER the Action Card or the Modifier.
// Only the Main Purpose is searched in the Purpose Dictionary.
// ═══════════════════════════════════════════════════════════════
const ACTION_CARDS = ["جلب", "طرد", "الصحة", "السقم"];
const MODIFIER_PHRASES = ["طرفة العين", "طرفه العين"];

function parsePurposePhrase(text) {
  const norm = String(text || "")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, "") // harakat
    .replace(/\u0640/g, "")                               // tatweel
    .trim();
  if (!norm) return { action: "", mainPurpose: "", modifier: "" };

  const words = norm.split(/\s+/).filter(Boolean);
  if (words.length === 0) return { action: "", mainPurpose: "", modifier: "" };

  // 1. Action = first word if it's an action card
  let action = "";
  let rest = [...words];
  if (ACTION_CARDS.includes(rest[0])) {
    action = rest[0];
    rest = rest.slice(1);
  }

  // 2. Modifier = last 2 words if they form a known modifier phrase
  let modifier = "";
  if (rest.length >= 2) {
    const lastTwo = rest.slice(-2).join(" ");
    if (MODIFIER_PHRASES.includes(lastTwo)) {
      modifier = lastTwo;
      rest = rest.slice(0, -2);
    }
  }

  // 3. Main Purpose = everything in between
  const mainPurpose = rest.join(" ").trim();
  return { action, mainPurpose, modifier };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { customPurpose, selectedAction } = body;

    if (!customPurpose || !customPurpose.trim()) {
      return Response.json({ matched: false });
    }

    // ── Parse phrase structure: [Action] + [Main Purpose] + [Modifier] ──
    const parsed = parsePurposePhrase(customPurpose);

    // ── STEP 1: Check dictionary using ONLY the Main Purpose ──
    // The Action Card and Modifier must NEVER be searched — only the
    // middle word(s) are the actual purpose. If no main purpose was
    // extracted (e.g., user typed only an action card), no lookup.
    if (!parsed.mainPurpose) {
      return Response.json({ matched: false });
    }
    const existingRes = await base44.functions.invoke('lookupPurposeIntent', {
      customPurpose: parsed.mainPurpose,
      selectedAction,
    });
    const existing = existingRes?.data || existingRes;
    if (existing && existing.matched) {
      // Entry already exists — return it. Never regenerate.
      return Response.json(existing);
    }

    // ── STEP 2: No match — generate MAIN PURPOSE meaning via LLM ──
    // The LLM translates ONLY the Main Purpose (the middle segment).
    // The Action Card and Modifier are handled by the frontend builder
    // (buildRitualSemanticPhrase) — the dictionary stores ONLY the purpose
    // word meaning, so the builder can combine Action + Purpose + Modifier
    // without duplicating the action or modifier.
    const llmResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert in Arabic occult manuscripts and Islamic spirituality.

Translate this Arabic MAIN PURPOSE word/phrase into Malayalam and English.
This is the MAIN PURPOSE only — the Action (جلب/طرد/الصحة/السقم) and Modifier (طرفة العين) are handled separately. Do NOT include them in your translation.

Arabic Main Purpose: "${parsed.mainPurpose}"

Instructions:
1. English: Translate the Main Purpose word ONLY.
   - "المحبة" → "Love"
   - "الرزق" → "Provision"
   - "في البدن" → "Body Health"
   - "المرض" → "Illness"
   - "الهيبة" → "Awe"
2. Malayalam: Translate the Main Purpose word ONLY.
   - "المحبة" → "സ്നേഹം"
   - "الرزق" → "ഉപജീവനം"
   - "في البدن" → "ശരീരാരോഗ്യം"
   - "المرض" → "രോഗം"
   - "الهيبة" → "ഭീമാണം"
3. Determine the normalized_purpose_key based on the MAIN PURPOSE:
   - "celb" (attraction/جلب), "tard" (banishment/طرد), "sihhat" (health/صحة), "sekam" (illness/سقم),
   - "tarfet" (instant/طرفة), "rizq" (provision/رزق), "knowledge" (knowledge/علم),
   - "travel" (travel/سفر), "sultan" (authority/سلطان), "haybah" (awe/هيبة)

Return ONLY a JSON object.`,
      response_json_schema: {
        type: "object",
        properties: {
          english_meaning: { type: "string", description: "English translation of the MAIN PURPOSE only (e.g. 'Love', 'Health') — NOT the full phrase" },
          malayalam_meaning: { type: "string", description: "Malayalam translation of the MAIN PURPOSE only (e.g. 'സ്നേഹം') — NOT the full phrase" },
          normalized_purpose_key: { type: "string", description: "One of: celb, tard, sihhat, sekam, tarfet, rizq, knowledge, travel, sultan, haybah" },
        },
      },
    });

    // ── Validate normalized_purpose_key ──
    const VALID_KEYS = ["celb", "tard", "sihhat", "sekam", "tarfet", "rizq", "knowledge", "travel", "sultan", "haybah"];
    const normKey = VALID_KEYS.includes(llmResult.normalized_purpose_key) ? llmResult.normalized_purpose_key : "celb";

    // ── Map normalized_purpose_key → action enum ──
    const KEY_TO_ACTION = {
      celb: "jalb", tard: "tard", sihhat: "sihhat", sekam: "sekam",
      tarfet: "tarfet", rizq: "jalb", knowledge: "jalb", travel: "jalb",
      sultan: "jalb", haybah: "jalb",
    };
    const actionEnum = KEY_TO_ACTION[normKey] || "other";

    const englishMeaning = (llmResult.english_meaning || "").trim();
    const malayalamMeaning = (llmResult.malayalam_meaning || "").trim();

    // ── STEP 3: Save to PurposeDictionary ──
    // purpose_phrase = the MAIN PURPOSE only (not the full phrase), so that
    // step 1 (exact match) finds it instantly on the next lookup of the same
    // main purpose — regardless of which Action Card or Modifier was used.
    // arabic_keyword = the parsed mainPurpose (from the parser, not the LLM),
    // so the indexed keyword always matches what the parser extracts.
    const newEntry = {
      purpose_phrase: parsed.mainPurpose,
      arabic_keyword: parsed.mainPurpose,
      malayalam_meaning: malayalamMeaning,
      english_meaning: englishMeaning,
      action: actionEnum,
      normalized_purpose_key: normKey,
      language: "ar",
      aliases: [],
      source: "Auto Generated",
      is_active: true,
      notes: `Auto-generated from full phrase: "${customPurpose.trim()}" — needs review`,
    };

    try {
      await base44.asServiceRole.entities.PurposeDictionary.create(newEntry);
    } catch (saveErr) {
      // If save fails (e.g. duplicate), still return the generated meaning
      // so the UI works. The next call will find it via lookupPurposeIntent.
    }

    // ── STEP 4: Return result (same shape as lookupPurposeIntent) ──
    return Response.json({
      matched: true,
      ritualIntent: normKey,
      matchedPhrase: newEntry.purpose_phrase,
      source: "Auto Generated",
      malayalam_meaning: malayalamMeaning,
      english_meaning: englishMeaning,
      auto_learned: true,
    });
  } catch (error) {
    return Response.json({ matched: false, error: error.message }, { status: 500 });
  }
});