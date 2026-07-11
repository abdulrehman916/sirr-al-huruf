// ═══════════════════════════════════════════════════════════════
// ENTITY KNOWLEDGE HOOK
// Queries EntityKnowledge by entity_type + entity_key.
// Used by EntityKnowledgePanel to display manuscript knowledge
// in Planet, Zodiac, and Mansion detail cards.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

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

    base44.entities.EntityKnowledge.filter({
      entity_type: entityType,
      entity_key: String(entityKey).toLowerCase(),
      is_marker: false,
      verification_status: "verified"
    }, "-source_count", 20)
      .then(records => {
        if (cancelled) return;
        setKnowledge(records || []);
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