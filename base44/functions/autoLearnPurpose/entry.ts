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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { customPurpose, selectedAction } = body;

    if (!customPurpose || !customPurpose.trim()) {
      return Response.json({ matched: false });
    }

    // ── STEP 1: Check existing dictionary (reuse locked lookup) ──
    const existingRes = await base44.functions.invoke('lookupPurposeIntent', {
      customPurpose,
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

Instructions:
1. Identify the action word: جلب (Bring/Attract), طرد (Repel/Banish), الصحة (Health/Restore), السقم (Illness/Inflict), or none.
2. Identify the main purpose (the core subject — e.g., محبة=Love, رزق=Provision, علم=Knowledge, سلطان=Authority).
3. Identify the modifier: طرفة العين (Quickly/Immediately) if present, otherwise none.
4. Generate a natural Malayalam translation.
   - Word order: Modifier (if any) + Purpose + Action
   - Example: "جلب المحبة طرفة العين" → "വേഗത്തിൽ സ്നേഹം കൊണ്ടുവരുക"
   - Example: "الصحة في البدن طرفة العين" → "വേഗത്തിൽ ശരീരാരോഗ്യം വീണ്ടെടുക്കുക"
5. Generate a natural English translation.
   - Word order: Action + Purpose + Modifier
   - Example: "جلب المحبة طرفة العين" → "Bring Love Quickly"
   - Example: "الصحة في البدن طرفة العين" → "Restore Physical Health Quickly"
6. Determine the normalized_purpose_key (must be exactly one of):
   - "celb" (attraction/جلب), "tard" (banishment/طرد), "sihhat" (health/صحة), "sekam" (illness/سقم),
   - "tarfet" (instant/طرفة), "rizq" (provision/رزق), "knowledge" (knowledge/علم),
   - "travel" (travel/سفر), "sultan" (authority/سلطان), "haybah" (awe/هيبة)

Return ONLY a JSON object.`,
      response_json_schema: {
        type: "object",
        properties: {
          english_meaning: { type: "string", description: "Natural English translation" },
          malayalam_meaning: { type: "string", description: "Natural Malayalam translation" },
          arabic_keyword: { type: "string", description: "Core purpose word in Arabic (without action/modifier)" },
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