// ═══════════════════════════════════════════════════════════════
// ENTITY KNOWLEDGE HOOK — Astrology module read path
//
// PERMANENT ARCHITECTURE: all astrology knowledge lives ONLY in
// AstroClockKnowledge. This hook now reads categorized records from
// AstroClockKnowledge (instead of EntityKnowledge) and maps them back
// to the shape EntityKnowledgePanel expects.
//
// Affects: Astrology (Astro Clock) module only.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// entity_type (legacy) → AstroClockKnowledge rule_category (lowercase)
const ENTITY_TYPE_TO_RULE_CATEGORY = {
  planet: "planet",
  zodiac: "zodiac",
  mansion: "lunar mansion",
  weekday: "weekday",
  element: "element",
  house: "house",
  ritual: "ritual",
  general_astro: "general astrology",
};

export function useEntityKnowledge(entityType, entityKey) {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contextKey = `${entityType}|${entityKey}`;

  useEffect(() => {
    if (!entityType || !entityKey) {
      setKnowledge([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const ruleCategory = ENTITY_TYPE_TO_RULE_CATEGORY[entityType] || entityType;

    base44.entities.AstroClockKnowledge.filter({
      source_type: "categorized",
      is_marker: false,
      rule_category: ruleCategory,
      rule_entity: String(entityKey).toLowerCase(),
    }, "-source_count", 20)
      .then(records => {
        if (cancelled) return;
        // Map ACK categorized records → EntityKnowledgePanel shape.
        const mapped = (records || []).map(r => ({
          ...r,
          knowledge_category: (r.attributes && r.attributes.knowledge_category) || r.rule_category || "general",
          knowledge_text_en: r.knowledge_text_en || "",
          knowledge_text_ml: r.knowledge_text_ml || "",
          knowledge_text_ar: r.knowledge_text_ar || "",
          source_book_title: r.source_book_title || "",
          source_page_number: r.source_page_number || "",
          source_screenshot_url: r.source_screenshot_url || "",
          source_count: r.source_count || 1,
        }));
        setKnowledge(mapped);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err?.message || "Failed to load entity knowledge");
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [contextKey]);

  return { knowledge, loading, error };
}