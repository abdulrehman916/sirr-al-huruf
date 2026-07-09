import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// WAFQ MODULE AUTO-ENRICHMENT — Extracts wafq/magic square/diagram
// knowledge from verified manuscript entries and stores in
// WafqKnowledge. Called by routeManuscriptKnowledge.
// ═══════════════════════════════════════════════════════════════

function normalizeText(text: string): string {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '').trim();
}

async function computeHash(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { book_id, batch_size, entry_ids } = body;
    if (!book_id) return Response.json({ error: 'book_id is required' }, { status: 400 });

    const BATCH = Math.min(batch_size || 5, 8);
    const books = await base44.asServiceRole.entities.ManuscriptBook.filter({ book_id });
    if (!books?.length) return Response.json({ error: 'Book not found' }, { status: 404 });
    const book = books[0];

    const entries = await base44.asServiceRole.entities.ManuscriptEntry.filter({ book_id });
    if (!entries?.length) return Response.json({ error: 'No entries found' }, { status: 404 });

    const idFilter: string[] | undefined = entry_ids;
    const verified = entries.filter((e: any) => {
      const ok = e.verification_status === 'verified' || e.verification_status === 'manual_review';
      if (!ok) return false;
      if (idFilter && Array.isArray(idFilter) && idFilter.length > 0) return idFilter.includes(e.entry_id);
      return true;
    });

    if (!verified.length) {
      return Response.json({ status: 'enrichment_complete', book_id, total_entries: entries.length, verified_entries: 0, wafq_pieces_extracted: 0, message: 'No verified entries.' });
    }

    const existing = await base44.asServiceRole.entities.WafqKnowledge.filter({ source_book_id: book_id });
    const processed = new Set(existing.map((k: any) => k.source_entry_id));
    const unprocessed = verified.filter((e: any) => !processed.has(e.entry_id));

    if (!unprocessed.length) {
      const real = existing.filter((k: any) => !k.is_marker && k.knowledge_text_en?.length > 0);
      return Response.json({ status: 'enrichment_complete', book_id, total_entries: entries.length, verified_entries: verified.length, wafq_pieces_extracted: real.length, message: `Wafq enrichment complete. ${real.length} pieces.` });
    }

    const batch = unprocessed.slice(0, BATCH);

    const summaries = batch.map((e: any, i: number) => `Entry ${i + 1}:
- Entry ID: ${e.entry_id}
- Page: ${e.page_number || 'N/A'}
- Topic: ${e.topic || e.purpose || 'N/A'}
- Entry type: ${e.entry_type || 'N/A'}
- Purpose: ${e.purpose || 'N/A'}
- Arabic text: ${(e.arabic_text || '').substring(0, 500)}
- English meaning: ${(e.english_meaning || '').substring(0, 400)}
- Malayalam meaning: ${(e.malayalam_meaning || '').substring(0, 300)}
- Procedure: ${(e.procedure || '').substring(0, 400)}
- Conditions: ${(e.conditions || '').substring(0, 200)}
- Images: ${(e.images || []).length} image(s)
- Notes: ${(e.notes || '').substring(0, 200)}`).join('\n\n---\n\n');

    const prompt = `You are analyzing verified Islamic manuscript entries for WAFQ-RELATED knowledge only.

MANUSCRIPT: ${book.book_title}

ENTRIES:
${summaries}

TASK: For each entry, extract ONLY wafq-related knowledge:
- Wafq structures (sacred letter/number grids)
- Magic square layouts (numeric grids)
- Letter diagrams (arrangements)
- Numeric calculations (abjad-based)
- Taweez designs (protective seals)

For each piece, provide:
- source_entry_id: the entry ID
- source_type: "wafq" | "magic_square" | "letter_diagram" | "numeric_diagram" | "taweez"
- category: "wafq_structure" | "magic_square_layout" | "letter_arrangement" | "numeric_calculation" | "taweez_design" | "grid_template" | "construction_method" | "usage_instruction"
- text_en: concise English description of the wafq knowledge
- text_ml: Malayalam translation if available, else empty string
- text_ar: original Arabic text verbatim if present, else empty string
- grid_size: grid dimensions if specified (e.g., "3x3", "4x4"), else empty string
- associated_divine_name: divine name associated with the wafq if mentioned, else empty string
- timing_reference: lightweight timing note for construction, else empty string

RULES:
1. Extract ONLY wafq knowledge. Do NOT extract timing rules, dua texts, or ritual procedures.
2. Preserve Arabic text verbatim — never modify or invent.
3. If an entry has NO wafq knowledge, do not include pieces for it.
4. Keep each piece concise — extract the wafq intelligence, not the full entry.

Return JSON: { "entries_analyzed": <number>, "wafq_pieces": [ { ... } ] }`;

    const llmRes = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          entries_analyzed: { type: "number" },
          wafq_pieces: {
            type: "array",
            items: {
              type: "object",
              properties: {
                source_entry_id: { type: "string" },
                source_type: { type: "string" },
                category: { type: "string" },
                text_en: { type: "string" },
                text_ml: { type: "string" },
                text_ar: { type: "string" },
                grid_size: { type: "string" },
                associated_divine_name: { type: "string" },
                timing_reference: { type: "string" }
              },
              required: ["source_entry_id", "source_type", "category", "text_en"]
            }
          }
        },
        required: ["entries_analyzed", "wafq_pieces"]
      }
    });

    const result: any = (llmRes as any).data || llmRes;
    const pieces: any[] = Array.isArray(result.wafq_pieces) ? result.wafq_pieces : [];

    let created = 0, merged = 0, canonicalMerged = 0;
    const withWafq = new Set<string>();

    for (const p of pieces) {
      if (!p.text_en || !String(p.text_en).trim()) continue;
      if (!p.source_entry_id) continue;
      const textEn = String(p.text_en).trim();
      const hash = await computeHash(normalizeText(textEn));
      const existingRecs = await base44.asServiceRole.entities.WafqKnowledge.filter({ content_hash: hash }, undefined, 1);
      const srcEntry = batch.find((e: any) => e.entry_id === p.source_entry_id);
      const isVer = srcEntry?.verification_status === 'verified';

      if (existingRecs?.length > 0) {
        const ex = existingRecs[0];
        const sources = ex.supporting_sources || [];
        const has = sources.some((s: any) => s.entry_id === p.source_entry_id) || ex.source_entry_id === p.source_entry_id;
        if (!has) {
          await base44.asServiceRole.entities.WafqKnowledge.update(ex.id, {
            supporting_sources: [...sources, { book_title: book.book_title, page_number: srcEntry?.page_number || '', entry_id: p.source_entry_id }],
            source_count: (ex.source_count || 1) + 1
          });
          merged++;
        }
      } else {
        // CANONICAL KEY CHECK — field-level knowledge evolution
        const canonicalKey = `${p.source_type || 'wafq'}|${p.category || 'wafq_structure'}|${p.grid_size ?? ''}`;
        const canonicalMatches = await base44.asServiceRole.entities.WafqKnowledge.filter({ canonical_key: canonicalKey, is_marker: false }, undefined, 1);

        if (canonicalMatches?.length > 0) {
          const ex = canonicalMatches[0];
          const mergeRes = await base44.integrations.Core.InvokeLLM({
            prompt: `You are merging new verified manuscript knowledge into an existing canonical record. Never remove existing information. Add only genuinely new information. Organize by category with bullet points. Do not duplicate.\n\nEXISTING:\n${ex.knowledge_text_en}\n\nNEW:\n${textEn}\n\nReturn JSON: { "merged_text_en": "..." }`,
            response_json_schema: { type: "object", properties: { merged_text_en: { type: "string" } }, required: ["merged_text_en"] }
          });
          const mergedData: any = (mergeRes as any).data || mergeRes;
          const mergedEn = mergedData.merged_text_en || textEn;
          const appendedAr = ex.knowledge_text_ar && p.text_ar ? ex.knowledge_text_ar + '\n---\n' + p.text_ar : (p.text_ar || ex.knowledge_text_ar || '');
          const appendedMl = ex.knowledge_text_ml && p.text_ml ? ex.knowledge_text_ml + '\n---\n' + p.text_ml : (p.text_ml || ex.knowledge_text_ml || '');
          const appendedGrid = ex.grid_size && p.grid_size ? ex.grid_size + '; ' + p.grid_size : (p.grid_size || ex.grid_size || '');
          const appendedDivine = ex.associated_divine_name && p.associated_divine_name ? ex.associated_divine_name + '; ' + p.associated_divine_name : (p.associated_divine_name || ex.associated_divine_name || '');
          const appendedTiming = ex.timing_reference && p.timing_reference ? ex.timing_reference + '; ' + p.timing_reference : (p.timing_reference || ex.timing_reference || '');

          await base44.asServiceRole.entities.WafqKnowledge.update(ex.id, {
            knowledge_text_en: mergedEn, knowledge_text_ml: appendedMl, knowledge_text_ar: appendedAr,
            grid_size: appendedGrid, associated_divine_name: appendedDivine, timing_reference: appendedTiming,
            supporting_sources: [...(ex.supporting_sources || []), { book_title: book.book_title, page_number: srcEntry?.page_number || '', entry_id: p.source_entry_id }],
            source_count: (ex.source_count || 1) + 1, is_verified: ex.is_verified || isVer
          });
          canonicalMerged++;
        } else {
          const kid = `WK-${p.source_entry_id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          await base44.asServiceRole.entities.WafqKnowledge.create({
            knowledge_id: kid, source_type: p.source_type || 'wafq', knowledge_category: p.category || 'wafq_structure',
            canonical_key: canonicalKey,
            knowledge_text_en: textEn, knowledge_text_ml: p.text_ml || '', knowledge_text_ar: p.text_ar || '',
            content_hash: hash, is_marker: false,
            grid_size: p.grid_size || '', associated_divine_name: p.associated_divine_name || '', timing_reference: p.timing_reference || '',
            source_book_id: book_id, source_book_title: book.book_title, source_page_number: srcEntry?.page_number || '',
            source_entry_id: p.source_entry_id, is_verified: isVer, supporting_sources: [], source_count: 1
          });
          created++;
        }
      }
      withWafq.add(p.source_entry_id);
    }

    for (const e of batch) {
      if (!withWafq.has(e.entry_id)) {
        const mhash = await computeHash(`no-wafq-${e.entry_id}`);
        await base44.asServiceRole.entities.WafqKnowledge.create({
          knowledge_id: `WK-MARKER-${e.entry_id}`,
          source_type: 'wafq',
          knowledge_category: 'wafq_structure',
          knowledge_text_en: '',
          knowledge_text_ml: '',
          knowledge_text_ar: '',
          content_hash: mhash,
          is_marker: true,
          grid_size: '',
          associated_divine_name: '',
          timing_reference: '',
          source_book_id: book_id,
          source_book_title: book.book_title,
          source_page_number: e.page_number || '',
          source_entry_id: e.entry_id,
          is_verified: e.verification_status === 'verified',
          supporting_sources: [],
          source_count: 0
        });
      }
    }

    const remaining = unprocessed.length - batch.length;
    if (remaining > 0) {
      return Response.json({ status: 'batch_complete', book_id, batch_processed: batch.length, remaining, new_pieces: created, sources_merged: merged, message: `Batch: ${created} new, ${merged} merged. ${remaining} remaining.` });
    }

    const all = await base44.asServiceRole.entities.WafqKnowledge.filter({ source_book_id: book_id });
    const real = all.filter((k: any) => !k.is_marker && k.knowledge_text_en?.length > 0);
    return Response.json({ status: 'enrichment_complete', book_id, total_entries: entries.length, verified_entries: verified.length, wafq_pieces_extracted: real.length, sources_merged: merged, message: `Wafq enrichment complete. ${real.length} pieces.` });
  } catch (error) {
    return Response.json({ error: error.message, status: 'enrichment_failed' }, { status: 500 });
  }
});