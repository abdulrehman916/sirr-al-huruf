import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// UNIVERSAL KNOWLEDGE ROUTING — CANONICAL SYSTEM ORCHESTRATOR
//
// GLOBAL ARCHITECTURE RULE:
// Every verified manuscript entry is automatically classified by
// its PRIMARY PURPOSE and routed to exactly ONE canonical module
// knowledge store:
//
//   astro_timing → AstroClockKnowledge (via enrichAstroClockFromManuscript)
//   dua          → DuaKnowledge         (via enrichDuaFromManuscript)
//   ritual       → RitualKnowledge      (via enrichRitualFromManuscript)
//   wafq         → WafqKnowledge        (via enrichWafqFromManuscript)
//   other        → none (materials, herbs, notes — not routed)
//
// CANONICAL STORAGE RULE:
// - ONE canonical location per knowledge piece.
// - Never duplicate complete records across modules.
// - Modules may create lightweight references (timing_reference field).
// - Duplicate protection: search existing, merge sources, never overwrite.
//
// This function is called automatically by the SirrAnalyzeModal
// pipeline after verification + duplicate detection complete.
// Batch-processed — caller re-invokes until all entries routed.
// ═══════════════════════════════════════════════════════════════

// Entry type → primary purpose routing map
const ENTRY_TYPE_TO_ROUTE: Record<string, string> = {
  // Astro Clock — timing-related ONLY
  timing: 'astro_timing',
  // Dua module
  dua: 'dua',
  quran_verse: 'dua',
  divine_name: 'dua',
  // Ritual module — conditions, warnings, instructions are most often ritual-related.
  // Timing-related conditions/warnings are captured by the Ritual LLM as timing_reference
  // (a lightweight cross-module reference to Astro Clock), so nothing is lost.
  ritual: 'ritual',
  exorcism: 'ritual',
  protection: 'ritual',
  instruction: 'ritual',
  condition: 'ritual',
  warning: 'ritual',
  // Wafq module — images in these manuscripts are almost always wafq/taweez/diagrams
  wafq: 'wafq',
  taweez: 'wafq',
  diagram: 'wafq',
  table: 'wafq',
  image: 'wafq',
  // Other — not routed to a specific module
  material: 'other',
  herb: 'other',
  incense: 'other',
  note: 'other',
  reference: 'other',
};

const ROUTE_TO_ENTITY: Record<string, string> = {
  astro_timing: 'AstroClockKnowledge',
  dua: 'DuaKnowledge',
  ritual: 'RitualKnowledge',
  wafq: 'WafqKnowledge',
  other: 'none',
};

const ROUTE_TO_FUNCTION: Record<string, string> = {
  astro_timing: 'enrichAstroClockFromManuscript',
  dua: 'enrichDuaFromManuscript',
  ritual: 'enrichRitualFromManuscript',
  wafq: 'enrichWafqFromManuscript',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { book_id, batch_size } = body;
    if (!book_id) return Response.json({ error: 'book_id is required' }, { status: 400 });

    const BATCH = Math.min(batch_size || 5, 8);
    const books = await base44.asServiceRole.entities.ManuscriptBook.filter({ book_id });
    if (!books?.length) return Response.json({ error: 'Book not found' }, { status: 404 });
    const book = books[0];

    const entries = await base44.asServiceRole.entities.ManuscriptEntry.filter({ book_id }, '-created_date', 500);
    if (!entries?.length) return Response.json({ error: 'No entries found' }, { status: 404 });

    // Only verified or manual_review entries
    const verified = entries.filter((e: any) =>
      e.verification_status === 'verified' || e.verification_status === 'manual_review'
    );

    if (!verified.length) {
      return Response.json({
        status: 'routing_complete', book_id, book_title: book.book_title,
        total_entries: entries.length, verified_entries: 0, total_routed: 0,
        by_route: {}, message: 'No verified entries to route.'
      });
    }

    // Get existing routing records to skip already-routed entries
    const existingRoutes = await base44.asServiceRole.entities.KnowledgeRouting.filter({ book_id });
    const routedEntryIds = new Set(existingRoutes.map((r: any) => r.entry_id));
    const unrouted = verified.filter((e: any) => !routedEntryIds.has(e.entry_id));

    if (!unrouted.length) {
      // All routed — summarize
      const byRoute: Record<string, number> = {};
      for (const r of existingRoutes) {
        byRoute[r.primary_purpose] = (byRoute[r.primary_purpose] || 0) + 1;
      }
      return Response.json({
        status: 'routing_complete', book_id, book_title: book.book_title,
        total_entries: entries.length, verified_entries: verified.length,
        total_routed: existingRoutes.length, by_route: byRoute,
        message: `Knowledge routing complete. ${existingRoutes.length} entries routed.`
      });
    }

    // Take a batch
    const batch = unrouted.slice(0, BATCH);

    // Classify each entry by primary purpose using entry_type
    const routeGroups: Record<string, string[]> = {};
    for (const entry of batch) {
      const route = ENTRY_TYPE_TO_ROUTE[entry.entry_type] || 'other';
      if (!routeGroups[route]) routeGroups[route] = [];
      routeGroups[route].push(entry.entry_id);
    }

    // Call enrichment functions in PARALLEL to prevent Deno timeout
    // (sequential calls for 4 route groups × ~30s each = ~120s → timeout)
    const routingResults: Record<string, any> = {};
    const now = new Date().toISOString();

    const routePromises = Object.entries(routeGroups).map(async ([route, entryIds]: [string, string[]]) => {
      if (route === 'other' || !ROUTE_TO_FUNCTION[route]) {
        return [route, { status: 'skipped', entry_count: entryIds.length }];
      }
      try {
        const fnName = ROUTE_TO_FUNCTION[route];
        const fnRes = await base44.functions.invoke(fnName, {
          book_id,
          batch_size: BATCH,
          entry_ids: entryIds,
        });
        return [route, (fnRes as any).data || fnRes];
      } catch (err) {
        return [route, { status: 'error', error: err.message, entry_count: entryIds.length }];
      }
    });

    const routeResults = await Promise.all(routePromises);
    for (const [route, result] of routeResults) {
      routingResults[route] = result;
    }

    // Create KnowledgeRouting records — SKIP entries where enrichment FAILED
    // so they can be retried on the next call instead of being permanently orphaned
    let routedCount = 0;
    let skippedForRetry = 0;
    for (const entry of batch) {
      const route = ENTRY_TYPE_TO_ROUTE[entry.entry_type] || 'other';
      const routedTo = ROUTE_TO_ENTITY[route] || 'none';

      // RETRY SAFETY: If enrichment failed for this route group, skip this entry.
      // It will be retried on the next routeManuscriptKnowledge call.
      const routeResult = routingResults[route];
      if (routedTo !== 'none' && routeResult?.status === 'error') {
        skippedForRetry++;
        continue;
      }

      let knowledgeIds: string[] = [];
      let isMarker = false;

      if (routedTo !== 'none') {
        try {
          const kRecords = await base44.asServiceRole.entities[routedTo].filter({ source_entry_id: entry.entry_id });
          if (kRecords?.length > 0) {
            knowledgeIds = kRecords.filter((k: any) => !k.is_marker).map((k: any) => k.knowledge_id);
            isMarker = knowledgeIds.length === 0 && kRecords.some((k: any) => k.is_marker);
          }
        } catch { /* non-critical */ }
      }

      const routingId = `KR-${entry.entry_id}`;
      await base44.asServiceRole.entities.KnowledgeRouting.create({
        routing_id: routingId,
        entry_id: entry.entry_id,
        book_id,
        primary_purpose: route,
        routed_to: routedTo,
        knowledge_ids: knowledgeIds,
        is_marker: isMarker,
        routed_at: now,
      });
      routedCount++;
    }

    const remaining = unrouted.length - batch.length;

    if (remaining > 0) {
      return Response.json({
        status: 'batch_complete', book_id, book_title: book.book_title,
        batch_processed: batch.length, remaining, entries_routed: routedCount,
        skipped_for_retry: skippedForRetry,
        route_groups: Object.fromEntries(Object.entries(routeGroups).map(([k, v]) => [k, v.length])),
        routing_results: routingResults,
        message: `Batch: ${routedCount} entries routed${skippedForRetry > 0 ? `, ${skippedForRetry} skipped for retry` : ''}. ${remaining} remaining.`,
      });
    }

    // Final report — all entries routed
    const allRoutes = await base44.asServiceRole.entities.KnowledgeRouting.filter({ book_id });
    const byRoute: Record<string, number> = {};
    for (const r of allRoutes) {
      byRoute[r.primary_purpose] = (byRoute[r.primary_purpose] || 0) + 1;
    }

    return Response.json({
      status: 'routing_complete', book_id, book_title: book.book_title,
      total_entries: entries.length, verified_entries: verified.length,
      total_routed: allRoutes.length, by_route: byRoute,
      routing_results: routingResults,
      message: `Knowledge routing complete. ${allRoutes.length} entries routed across ${Object.keys(byRoute).length} modules.`,
    });
  } catch (error) {
    return Response.json({ error: error.message, status: 'routing_failed' }, { status: 500 });
  }
});