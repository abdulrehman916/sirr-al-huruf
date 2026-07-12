// ═══════════════════════════════════════════════════════════════
// SEMANTIC ACTION SEARCH HOOK
// Combines Action Classification + Knowledge Matching + Timing Engine
//
// FLOW:
//   1. User types an action → classifyAction maps it to a canonical category
//   2. Query AstroClockKnowledge (today's weekday) + EntityKnowledge (verified)
//   3. Filter both sets by semantic text matching against the category
//   4. Combine with existing timing engine (allHours) to determine suitability
//   5. Return recommendation: best hours, why suitable, supporting knowledge
//
// SAFETY:
//   - Only verified knowledge appears (verification_status: "verified")
//   - Pending review content NEVER appears to customers
//   - Timing engine is NOT replaced — only consumed read-only
//   - No schema, OCR, ingestion, or calculation changes
//
// LIVE: As new verified knowledge is imported, results auto-enrich.
// No manual mapping required — matching is dynamic via textMatchesCategory.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { classifyAction, textMatchesCategory, ACTION_CATEGORIES } from "@/lib/astroActionClassifier";
import { useAstroData } from "@/components/astroclock/dashboard/useAstroData";
import { getKashfOperationsForPurpose } from "@/lib/astroClockManuscriptMerger";

export function useSemanticActionSearch() {
  const d = useAstroData();
  const [query, setQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [ackRecords, setAckRecords] = useState([]);
  const [ekRecords, setEkRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const classification = useMemo(() => classifyAction(query), [query]);

  // ── Knowledge query: fires when search is triggered + classification succeeds ──
  useEffect(() => {
    if (!searchTriggered || !classification) {
      setAckRecords([]);
      setEkRecords([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const catKey = classification.category;

    // Query 1: AstroClockKnowledge for today's weekday (all saat/planet combos)
    // Same filter as existing useAstroClockContextKnowledge, but by weekday only
    const ackQuery = {
      weekday: d.activeDayIndex,
      is_marker: false,
    };

    // Query 2: EntityKnowledge — verified only, pending_review NEVER shown
    const ekQuery = {
      is_marker: false,
      verification_status: "verified",
    };

    Promise.all([
      base44.entities.AstroClockKnowledge.filter(ackQuery, "-source_count", 50),
      base44.entities.EntityKnowledge.filter(ekQuery, "-source_count", 50),
    ])
      .then(([ackData, ekData]) => {
        if (cancelled) return;

        // Filter AstroClockKnowledge: records with actions matching the category
        const matchedACK = (ackData || []).filter(r => {
          if (r.source_type !== 'full_context') return false;
          const checkActions = (actions) => Array.isArray(actions) && actions.some(a =>
            textMatchesCategory(a.en, catKey) ||
            textMatchesCategory(a.ml, catKey) ||
            textMatchesCategory(a.ar, catKey)
          );
          return checkActions(r.recommended_actions) ||
                 checkActions(r.forbidden_actions) ||
                 checkActions(r.enemy_actions) ||
                 checkActions(r.friendship_actions) ||
                 textMatchesCategory(r.ritual_suitability, catKey) ||
                 textMatchesCategory(r.knowledge_text_en, catKey);
        });

        // Filter EntityKnowledge: text matching the category
        const matchedEK = (ekData || []).filter(r =>
          textMatchesCategory(r.knowledge_text_en, catKey) ||
          textMatchesCategory(r.knowledge_text_ml, catKey)
        );

        setAckRecords(matchedACK);
        setEkRecords(matchedEK);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAckRecords([]);
        setEkRecords([]);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [searchTriggered, classification, d.activeDayIndex]);

  // ── Build recommendation result ──
  const result = useMemo(() => {
    if (!classification || !d.allHours) return null;
    const cat = ACTION_CATEGORIES[classification.category];
    if (!cat) return null;

    const preferredPlanets = cat.preferredPlanets || [];
    const avoidPlanets = cat.avoidPlanets || [];
    const preferredDays = cat.preferredDays || [];

    // Check if today is a preferred day
    const isPreferredDay = preferredDays.includes(d.dayKey);

    // ── Timing engine: find recommended/alternative/avoided hours ──
    // Uses the EXISTING allHours from useAstroData — no calculation changes
    const recommendedHours = d.allHours
      .filter(h => h.status !== "past" && preferredPlanets.includes(h.planet))
      .sort((a, b) => {
        if (a.status === "current") return -1;
        if (b.status === "current") return 1;
        return 0;
      })
      .slice(0, 3);

    const alternativeHours = d.allHours
      .filter(h => h.status !== "past" && !preferredPlanets.includes(h.planet) && !avoidPlanets.includes(h.planet))
      .slice(0, 3);

    const avoidedHours = d.allHours
      .filter(h => h.status !== "past" && avoidPlanets.includes(h.planet))
      .slice(0, 3);

    // ── Suitability determination ──
    const hasRecommendedHours = recommendedHours.length > 0;
    const currentHourBlocked = d.currentHour && avoidPlanets.includes(d.currentHour.planet);
    const isSuitable = hasRecommendedHours && !currentHourBlocked;

    // ── Blocking reasons (if not suitable) ──
    const blockingReasons = [];
    if (!hasRecommendedHours) {
      blockingReasons.push({
        ml: "ഇന്ന് അനുകൂല സഅാതുകൾ ബാക്കിയില്ല",
        en: "No favorable hours remaining today",
      });
    }
    if (currentHourBlocked) {
      blockingReasons.push({
        ml: "നിലവിലെ സഅാത് പ്രതികൂല ഗ്രഹത്തിന്റെ ഭരണത്തിലാണ്",
        en: "Current hour is governed by an unfavorable planet",
      });
    }
    if (!isPreferredDay) {
      blockingReasons.push({
        ml: "ഈ പ്രവൃത്തിക്ക് ഏറ്റവും അനുകൂലമായ ദിവസം ഇന്നല്ല",
        en: "Today is not the most favorable day for this action",
      });
    }

    // ── Supporting rules from matched AstroClockKnowledge ──
    const supportingRules = ackRecords.map(r => {
      // Extract relevant action texts
      const relevantActions = [];
      const collectActions = (actions, type) => {
        if (!Array.isArray(actions)) return;
        actions.forEach(a => {
          if (textMatchesCategory(a.en, classification.category) ||
              textMatchesCategory(a.ml, classification.category) ||
              textMatchesCategory(a.ar, classification.category)) {
            relevantActions.push({ type, en: a.en, ml: a.ml, ar: a.ar });
          }
        });
      };
      collectActions(r.recommended_actions, 'recommended');
      collectActions(r.forbidden_actions, 'forbidden');
      collectActions(r.friendship_actions, 'friendship');
      collectActions(r.enemy_actions, 'enemy');

      return {
        saat: r.saat_number,
        planet: r.planet,
        period: r.period,
        actions: relevantActions,
        ritual_suitability: r.ritual_suitability || '',
        summary: r.knowledge_text_en || '',
        summary_ml: r.knowledge_text_ml || '',
        source: r.source_book_title || 'Screenshot Upload',
        page: r.source_page_number,
        screenshot: r.source_screenshot_url,
        sources: r.supporting_sources || [],
        source_count: r.source_count || 1,
      };
    });

    // ── Supporting manuscripts from matched EntityKnowledge ──
    const supportingManuscripts = ekRecords.map(r => ({
      text: r.knowledge_text_en || '',
      text_ml: r.knowledge_text_ml || '',
      text_ar: r.knowledge_text_ar || '',
      category: r.knowledge_category,
      entity_type: r.entity_type,
      entity_key: r.entity_key,
      source: r.source_book_title || 'Manuscript',
      page: r.source_page_number,
      screenshot: r.source_screenshot_url,
      sources: r.supporting_sources || [],
      source_count: r.source_count || 1,
    })).filter(r => r.text);

    // ── Collect all unique source references ──
    const allSources = new Set();
    [...ackRecords, ...ekRecords].forEach(r => {
      if (r.source_book_title) allSources.add(r.source_book_title);
      (r.supporting_sources || []).forEach(s => {
        if (s.book_title) allSources.add(s.book_title);
      });
    });

    // ── Kashf manuscript operations (existing data, read-only) ──
    const kashfOps = getKashfOperationsForPurpose(classification.category) || [];

    // ── Confidence calculation ──
    const classificationConfidence = classification.confidence;
    const knowledgeMatchCount = ackRecords.length + ekRecords.length;
    const knowledgeConfidence = knowledgeMatchCount > 0
      ? Math.min(100, 50 + knowledgeMatchCount * 10)
      : 30;
    const timingConfidence = hasRecommendedHours ? 80 : 20;
    const overallConfidence = Math.round(
      (classificationConfidence + knowledgeConfidence + timingConfidence) / 3
    );

    return {
      category: classification.category,
      categoryLabel: cat.label,
      suitable: isSuitable,
      confidence: overallConfidence,
      recommendedHours,
      alternativeHours,
      avoidedHours,
      isPreferredDay,
      blockingReasons,
      supportingRules,
      supportingManuscripts,
      sources: Array.from(allSources),
      kashfOps,
      preferredPlanets,
      avoidPlanets,
      knowledgeMatchCount,
    };
  }, [classification, d, ackRecords, ekRecords]);

  const search = (q) => {
    setQuery(q);
    setSearchTriggered(true);
  };

  const reset = () => {
    setQuery("");
    setSearchTriggered(false);
    setAckRecords([]);
    setEkRecords([]);
  };

  return { query, search, reset, classification, result, loading };
}