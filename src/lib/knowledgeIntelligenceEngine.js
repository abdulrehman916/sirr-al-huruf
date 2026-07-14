// ═══════════════════════════════════════════════════════════════
// KNOWLEDGE INTELLIGENCE ENGINE
//
// A true knowledge-driven search engine — NOT a synonym matcher.
//
// ARCHITECTURE:
//   1. Collect ALL verified knowledge from database (no keyword filter)
//   2. Send user input + ALL knowledge to LLM for semantic analysis
//   3. LLM understands intent, finds canonical action, classifies every
//      relevant record, determines preferred/avoided planets, writes reasoning
//   4. Engine merges LLM classification with original database records
//   5. Hook combines with timing engine (read-only)
//
// AUTO-LEARNING:
//   No static synonym list. The LLM understands ANY term in ANY language
//   (ML, AR, EN). When new terms appear in the knowledge database, the
//   engine automatically understands them — zero code changes needed.
//
// ISOLATED:
//   Does NOT modify timing engine, calculation engine, database schema,
//   OCR, translation, Nine Mizan, Abjad, Bast, authentication, or navigation.
// ═══════════════════════════════════════════════════════════════
import { base44 } from "@/api/base44Client";

// ── Response cache (avoids duplicate LLM calls for same input+weekday) ──
const responseCache = new Map();
const CACHE_MAX = 30;

// ── LLM response JSON schema ──
const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: true,
  properties: {
    canonicalId: {
      type: "string",
      description: "Canonical action ID from: construction, travel, marriage, business, agriculture, medical, love, protection, wealth, knowledge, spiritual, courage, or unknown"
    },
    canonicalAction: {
      type: "object",
      properties: {
        ml: { type: "string" },
        en: { type: "string" },
        ar: { type: "string" }
      }
    },
    relatedConcepts: {
      type: "array",
      items: { type: "string" }
    },
    preferredPlanets: {
      type: "array",
      items: { type: "string" }
    },
    avoidPlanets: {
      type: "array",
      items: { type: "string" }
    },
    preferredDays: {
      type: "array",
      items: { type: "string" }
    },
    relevantRecords: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
        properties: {
          recordId: { type: "string" },
          relevance: { type: "number" },
          classification: { type: "string" },
          reason: { type: "string" }
        }
      }
    },
    reasoningSummary: { type: "string" },
    confidence: { type: "number" }
  }
};

// ── Collect ALL verified knowledge from database (no keyword filter) ──
async function collectAllKnowledge(weekday) {
  // PERMANENT ARCHITECTURE: all astrology knowledge lives ONLY in
  // AstroClockKnowledge. Timing = full_context records; entity knowledge =
  // categorized records. EntityKnowledge is no longer read here.
  const [ackData, ekData] = await Promise.all([
    base44.entities.AstroClockKnowledge.filter(
      { weekday, is_marker: false },
      "-source_count",
      30
    ),
    base44.entities.AstroClockKnowledge.filter(
      { is_marker: false, source_type: "categorized" },
      "-source_count",
      50
    ),
  ]);
  return { ackRecords: ackData || [], ekRecords: ekData || [] };
}

// ── Format records into compact lines for LLM prompt ──
function formatRecordsForLLM(ackRecords, ekRecords) {
  const lines = [];

  ackRecords.forEach(r => {
    const rec = (r.recommended_actions || []).map(a => a.en).filter(Boolean).join("; ");
    const forb = (r.forbidden_actions || []).map(a => a.en).filter(Boolean).join("; ");
    const sum = (r.knowledge_text_en || "").substring(0, 150);
    const suit = (r.ritual_suitability || "").substring(0, 80);
    lines.push(
      `ACK|${r.knowledge_id}|saat:${r.saat_number || "?"}|period:${r.period || "?"}|planet:${r.planet || "?"}|recommended:[${rec}]|forbidden:[${forb}]|suitability:${suit}|summary:${sum}`
    );
  });

  ekRecords.forEach(r => {
    const text = (r.knowledge_text_en || "").substring(0, 150);
    const cat = (r.attributes && r.attributes.knowledge_category) || r.rule_category || "general";
    lines.push(
      `EK|${r.knowledge_id}|entity:${r.rule_category || r.entity_type}/${r.rule_entity || r.entity_key}|category:${cat}|text:${text}`
    );
  });

  return lines.join("\n");
}

// ── Build the LLM prompt ──
function buildPrompt(userInput, formattedRecords, weekdayName, weekdayIndex) {
  return `You are a Knowledge Intelligence Engine for an Islamic astrological timing system.

The system uses 7 planets (sun, moon, mars, mercury, jupiter, venus, saturn), 7 weekdays (sunday-saturday), and 24 planetary hours (12 day + 12 night). Each hour is governed by a planet. Certain actions are recommended or forbidden during specific planetary hours based on verified manuscript knowledge.

USER SEARCH: "${userInput}"
TODAY: ${weekdayName} (index ${weekdayIndex})

VERIFIED KNOWLEDGE RECORDS FROM MANUSCRIPT DATABASE:
${formattedRecords}

YOUR TASK:
1. INTENT: Understand what the user wants to do. Identify the canonical action in Malayalam (ml), English (en), and Arabic (ar). Also identify the canonical ID from: construction, travel, marriage, business, agriculture, medical, love, protection, wealth, knowledge, spiritual, courage, or "unknown".
2. EXPAND: List ALL related concepts, synonyms, and sub-actions in any language.
3. ANALYZE: For EACH knowledge record above, determine:
   - Is it relevant to the user's intent? (If yes, relevance score 1-100; if no, skip it)
   - Classification: "supporting" (recommends/supports the action), "blocking" (forbids/warns against), "conditional" (allowed only under specific conditions stated in the record), "exception" (exception to a general rule about this action), "indirect" (indirectly related — e.g., planet properties, general timing rules)
   - Reason: Brief explanation of why this record is relevant
4. PLANETS: Based on ALL relevant records, determine preferred planets (favorable for this action) and avoid planets (unfavorable). Use keys: sun, moon, mars, mercury, jupiter, venus, saturn.
5. DAYS: Determine preferred weekdays. Use keys: sunday, monday, tuesday, wednesday, thursday, friday, saturday.
6. REASONING: Write a detailed reasoning summary citing specific records by their ID.
7. CONFIDENCE: Overall confidence (0-100) based on how much verified knowledge supports the analysis.

CRITICAL RULES:
- Base your analysis ONLY on the verified records above. Do NOT use external knowledge or invent rules.
- If no records are relevant, set confidence to 0 and explain in reasoning.
- Include ALL relevant records, not just the top few.
- Consider indirect relationships (e.g., if a record mentions a planet's properties and that planet governs the action).
- The canonical action must reflect the user's TRUE intent, not just a keyword match.`;
}

// ── Collect all action arrays from an ACK record ──
function collectActions(record) {
  const actions = [];
  const collect = (arr, type) => {
    if (!Array.isArray(arr)) return;
    arr.forEach(a => {
      actions.push({ type, en: a.en || "", ml: a.ml || "", ar: a.ar || "" });
    });
  };
  collect(record.recommended_actions, "recommended");
  collect(record.forbidden_actions, "forbidden");
  collect(record.friendship_actions, "friendship");
  collect(record.enemy_actions, "enemy");
  return actions;
}

// ── Normalize arrays to lowercase strings ──
function normalizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(s => String(s).toLowerCase().trim()).filter(Boolean);
}

// ── Merge LLM classification with original database records ──
function processResponse(llmResponse, ackRecords, ekRecords) {
  const resp = typeof llmResponse === "string" ? JSON.parse(llmResponse) : llmResponse;

  // Build lookup map: recordId → { type, record }
  const recordMap = new Map();
  ackRecords.forEach(r => recordMap.set(r.knowledge_id, { type: "ACK", record: r }));
  ekRecords.forEach(r => recordMap.set(r.knowledge_id, { type: "EK", record: r }));

  // Merge each LLM-classified record with its full database data
  const relevantRecords = (resp.relevantRecords || []).map(rr => {
    const entry = recordMap.get(rr.recordId);
    if (!entry) return null; // LLM hallucinated a record ID — skip
    const { type, record } = entry;

    if (type === "ACK") {
      return {
        recordId: rr.recordId,
        relevance: rr.relevance,
        classification: rr.classification,
        reason: rr.reason,
        recordType: "ACK",
        saat: record.saat_number,
        period: record.period,
        planet: record.planet,
        actions: collectActions(record),
        summary: record.knowledge_text_en || "",
        ritual_suitability: record.ritual_suitability || "",
        source: record.source_book_title || "Screenshot Upload",
        page: record.source_page_number,
        screenshot: record.source_screenshot_url,
        supporting_sources: record.supporting_sources || [],
        source_count: record.source_count || 1,
      };
    } else {
      return {
        recordId: rr.recordId,
        relevance: rr.relevance,
        classification: rr.classification,
        reason: rr.reason,
        recordType: "EK",
        text: record.knowledge_text_en || "",
        text_ml: record.knowledge_text_ml || "",
        text_ar: record.knowledge_text_ar || "",
        category: (record.attributes && record.attributes.knowledge_category) || record.rule_category || record.knowledge_category,
        entity_type: record.rule_category || record.entity_type,
        entity_key: record.rule_entity || record.entity_key,
        source: record.source_book_title || "Manuscript",
        page: record.source_page_number,
        screenshot: record.source_screenshot_url,
        supporting_sources: record.supporting_sources || [],
        source_count: record.source_count || 1,
      };
    }
  }).filter(Boolean);

  return {
    canonicalId: resp.canonicalId || "unknown",
    canonicalAction: resp.canonicalAction || { ml: "", en: "", ar: "" },
    relatedConcepts: resp.relatedConcepts || [],
    preferredPlanets: normalizeArray(resp.preferredPlanets),
    avoidPlanets: normalizeArray(resp.avoidPlanets),
    preferredDays: normalizeArray(resp.preferredDays),
    relevantRecords,
    reasoningSummary: resp.reasoningSummary || "",
    confidence: resp.confidence || 0,
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
//
// 1. Collect ALL verified knowledge (no keyword filter)
// 2. Send user input + ALL knowledge to LLM
// 3. LLM understands intent, classifies records, determines planets
// 4. Return complete knowledge package for the hook
// ═══════════════════════════════════════════════════════════════
export async function runKnowledgeIntelligenceSearch(userInput, weekday, weekdayName) {
  // Check cache first
  const cacheKey = `${userInput}|${weekday}`;
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }

  // 1. Collect ALL verified knowledge
  const { ackRecords, ekRecords } = await collectAllKnowledge(weekday);

  // 2. Format records for LLM
  const formattedRecords = formatRecordsForLLM(ackRecords, ekRecords);

  // 3. Build prompt
  const prompt = buildPrompt(userInput, formattedRecords, weekdayName, weekday);

  // 4. Call LLM (automatic model — fast, multilingual, cost-efficient)
  const llmResponse = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: RESPONSE_SCHEMA,
  });

  // 5. Merge LLM response with original records
  const processed = processResponse(llmResponse, ackRecords, ekRecords);

  // 6. Cache and return
  responseCache.set(cacheKey, processed);
  if (responseCache.size > CACHE_MAX) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }

  return processed;
}

// Clear cache (for testing)
export function clearKnowledgeCache() {
  responseCache.clear();
}