// ═══════════════════════════════════════════════════════════════
// classifyRitualIntent — Semantic ritual understanding
// ═══════════════════════════════════════════════════════════════
// Understands the true intention of the Custom Purpose text written
// in Arabic, Malayalam, English, or mixed languages, using an LLM.
// Returns the ritual category + a human-readable explanation of WHY.
//
// Read-only. Does NOT touch Mizan calculations or Astro Clock.
// Falls back gracefully (returns null) if the LLM call fails.
// ═══════════════════════════════════════════════════════════════
import { base44 } from "@/api/base44Client";

const RITUAL_KEYS = [
  "love", "separation", "protection", "wealth", "knowledge", "healing",
  "enemy", "attraction", "animal_attraction", "travel", "spiritual",
  "jinn", "planetary", "general",
];

const SCHEMA = {
  type: "object",
  properties: {
    ritualKey: { type: "string", enum: RITUAL_KEYS },
    ritualCategory: { type: "string", description: "Human-readable category label in English" },
    explanation: { type: "string", description: "Why this ritual belongs to this category, 1-3 sentences. Mention the language detected and the specific intention inferred." },
    confidence: { type: "number", description: "0.0 to 1.0" },
    detectedLanguage: { type: "string", description: "Detected primary language: arabic, malayalam, english, or mixed" },
  },
  required: ["ritualKey", "ritualCategory", "explanation", "confidence"],
};

export async function classifyRitualIntent({ customPurpose, selections, result }) {
  const text = (customPurpose || "").trim();
  if (!text) return null;

  const ctx = {
    customPurpose: text,
    dominantElement: result?.dominant || selections?.elements?.[0] || null,
    khayrSharr: selections?.khayrSharr8 || null,
    selectedDay: selections?.days || null,
    selectedHour: selections?.hour || null,
    selectedPlanet: selections?.planet || null,
    dayNight: selections?.dayNight || null,
    mizanPurposes: selections?.purposes || [],
  };

  const prompt = `You are an expert scholar of Islamic occult manuscripts (Havâss, Ilm al-Huruf, Vefk, Mizan).
A practitioner has described the intention of a ritual in the "Custom Purpose" field.
The text may be written in Arabic, Malayalam, English, or a mixture of these languages.

Read the text SEMANTICALLY — understand the actual intention, not just literal keywords.
For example:
- An Arabic phrase meaning "bring wild animals" = category "animal_attraction".
- "Increase love between two people" = "love".
- "Create separation / divorce" = "separation".
- "Protect from evil eye / jinn" = "protection".
- "Bring wealth / rizq / money" = "wealth".
- "Harm an enemy / destroy" = "enemy".
- "Healing / cure illness" = "healing".
- "Knowledge / study / wisdom" = "knowledge".
- "Travel safely" = "travel".
- "Spiritual work / dhikr / divine connection" = "spiritual".
- "Jinn / spirit conjuration" = "jinn".
- "Planetary / kawkab work" = "planetary".
- General attraction without love = "attraction".

Also consider the Mizan context provided (dominant element, Khayr/Sharr, selected day/hour/planet, purposes) to disambiguate when the text is ambiguous.

Return ONLY the JSON object matching the schema. Choose the single best ritualKey.

Custom Purpose text:
"""
${text}
"""

Mizan context (JSON):
${JSON.stringify(ctx)}`;

  try {
    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: SCHEMA,
      model: "claude_sonnet_4_6",
    });
    const data = res?.data ?? res;
    if (!data || !RITUAL_KEYS.includes(data.ritualKey)) return null;
    return {
      ritualKey: data.ritualKey,
      ritualCategory: data.ritualCategory || data.ritualKey,
      explanation: data.explanation || "",
      confidence: typeof data.confidence === "number" ? data.confidence : 0.5,
      detectedLanguage: data.detectedLanguage || "unknown",
      source: "Semantic LLM classification (Claude Sonnet)",
    };
  } catch (e) {
    return null;
  }
}