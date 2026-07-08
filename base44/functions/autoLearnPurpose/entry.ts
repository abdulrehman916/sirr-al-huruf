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

    // ── STEP 2: No match — generate meanings via LLM ──
    const llmResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert in Arabic occult manuscripts, Islamic spirituality, and Malayalam/English translation.

Analyze this Arabic ritual purpose phrase and generate accurate translations.

Arabic phrase: "${customPurpose}"

The phrase has already been parsed into its structure:
- Action Card: "${parsed.action || "(none)"}"
- Main Purpose: "${parsed.mainPurpose}"
- Modifier: "${parsed.modifier || "(none)"}"

Instructions:
1. The Main Purpose is: ${parsed.mainPurpose} — translate THIS word/phrase, NOT the action or modifier.
2. Generate a natural Malayalam translation combining Action + Purpose + Modifier.
   - Word order: Modifier (if any) + Purpose + Action
   - Example: Action=جلب, Purpose=المحبة, Modifier=طرفة العين → "വേഗത്തിൽ സ്നേഹം കൊണ്ടുവരുക"
   - Example: Action=الصحة, Purpose=في البدن, Modifier=طرفة العين → "വേഗത്തിൽ ശരീരാരോഗ്യം വീണ്ടെടുക്കുക"
   - Example: Action=طرد, Purpose=العداوة, Modifier=طرفة العين → "വേഗത്തിൽ ശത്രുത അകറ്റുക"
3. Generate a natural English translation combining Action + Purpose + Modifier.
   - Word order: Action + Purpose + Modifier
   - Example: Action=جلب, Purpose=المحبة, Modifier=طرفة العين → "Bring Love Quickly"
   - Example: Action=الصحة, Purpose=في البدن, Modifier=طرفة العين → "Restore Physical Health Quickly"
4. Determine the normalized_purpose_key based on the MAIN PURPOSE (not the action):
   - "celb" (attraction/جلب), "tard" (banishment/طرد), "sihhat" (health/صحة), "sekam" (illness/سقم),
   - "tarfet" (instant/طرفة), "rizq" (provision/رزق), "knowledge" (knowledge/علم),
   - "travel" (travel/سفر), "sultan" (authority/سلطان), "haybah" (awe/هيبة)

Return ONLY a JSON object.`,
      response_json_schema: {
        type: "object",
        properties: {
          english_meaning: { type: "string", description: "Natural English translation" },
          malayalam_meaning: { type: "string", description: "Natural Malayalam translation" },
          arabic_keyword: { type: "string", description: "Core purpose word in Arabic (the Main Purpose, without action/modifier)" },
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
    const arabicKeyword = (llmResult.arabic_keyword || "").trim();

    // ── STEP 3: Save to PurposeDictionary ──
    const newEntry = {
      purpose_phrase: customPurpose.trim(),
      arabic_keyword: arabicKeyword,
      malayalam_meaning: malayalamMeaning,
      english_meaning: englishMeaning,
      action: actionEnum,
      normalized_purpose_key: normKey,
      language: "ar",
      aliases: [],
      source: "Auto Generated",
      is_active: true,
      notes: "Auto-generated — needs review",
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