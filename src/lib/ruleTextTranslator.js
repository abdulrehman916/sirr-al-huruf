// ═══════════════════════════════════════════════════════════════
// RULE TEXT TRANSLATOR — UI Display Layer Only
//
// Batch-translates English rule text to Malayalam for the Astro Clock
// Smart Search rule sections (Supporting, Blocking, Conditional,
// Exceptions, Indirect).
//
// RULES:
//   - Keeps Arabic words / Islamic terminology / astrological terms
//     EXACTLY as they are (المريخ, زحل, الشمس, القمر, سعد, نحس...).
//   - Does NOT translate Arabic source quotations.
//   - Translates only the explanatory English text to natural Malayalam.
//   - Does NOT modify: database, LLM prompts, search engine, knowledge
//     graph, timing engine, or canonical records.
//   - Results are cached to avoid repeated LLM calls.
// ═══════════════════════════════════════════════════════════════
import { base44 } from "@/api/base44Client";

const cache = new Map();
const CACHE_MAX = 100;

/**
 * Batch-translate an array of English texts to Malayalam.
 * @param {string[]} texts — English texts to translate
 * @returns {Promise<Object>} — map of original text → Malayalam translation
 */
export async function batchTranslateToMalayalam(texts) {
  if (!texts || texts.length === 0) return {};

  const result = {};
  const uncached = [];

  for (const text of texts) {
    if (!text || typeof text !== "string") continue;
    const key = text.substring(0, 200);
    if (cache.has(key)) {
      result[text] = cache.get(key);
    } else if (!uncached.includes(text)) {
      uncached.push(text);
    }
  }

  if (uncached.length === 0) return result;

  const prompt =
    "Translate the following English texts to natural, fluent Malayalam.\n\n" +
    "CRITICAL RULES:\n" +
    "1. Keep Arabic words, Islamic terminology, and astrological terms EXACTLY as they are " +
    "(e.g., المريخ, زحل, الشمس, القمر, سعد, نحس, فضة, ذهب, عود, مسك).\n" +
    "2. Keep proper nouns (book titles, author names, place names) as they are.\n" +
    "3. Translate ONLY the explanatory English text to natural Malayalam.\n" +
    "4. Do NOT translate Arabic quotations, Quranic verses, or supplications.\n" +
    "5. Keep numbers and symbols as they are.\n\n" +
    "Texts to translate:\n" +
    uncached.map((t, i) => "[" + i + "] " + t).join("\n\n") +
    "\n\nReturn JSON: { \"translations\": [\"malayalam_0\", \"malayalam_1\", ...] }";

  try {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          translations: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    });

    const translations = response.translations || [];
    uncached.forEach((text, i) => {
      const translated = translations[i] || text;
      result[text] = translated;
      cache.set(text.substring(0, 200), translated);
      if (cache.size > CACHE_MAX) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
    });
  } catch (e) {
    // If translation fails, fall back to original English
    uncached.forEach((text) => {
      result[text] = text;
    });
  }

  return result;
}