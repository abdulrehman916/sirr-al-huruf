import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// ENTITY KNOWLEDGE ENRICHMENT FROM MANUSCRIPT ENTRIES
//
// Called by routeManuscriptKnowledge for entries classified as
// planet_info, zodiac_info, mansion_info, element_info, house_info,
// weekday_info, or general_astro.
//
// Uses text LLM to classify each manuscript entry into entity_type
// + entity_key, extracts knowledge, and merges into EntityKnowledge.
//
// MERGE RULES: never overwrite, never delete, dedup by content_hash,
// merge complementary by canonical_key, preserve every source.
// ═══════════════════════════════════════════════════════════════

function normalizeText(text: string): string {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '').trim();
}

async function computeHash(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { book_id, batch_size, entry_ids } = body;

    // Get entries — either by entry_ids or by book_id
    let entries: any[] = [];
    if (entry_ids && Array.isArray(entry_ids) && entry_ids.length > 0) {
      for (const eid of entry_ids.slice(0, 8)) {
        const recs = await base44.asServiceRole.entities.ManuscriptEntry.filter({ entry_id: eid }, undefined, 1);
        if (recs?.length) entries.push(recs[0]);
      }
    } else if (book_id) {
      entries = await base44.asServiceRole.entities.ManuscriptEntry.filter({ book_id }, '-created_date', Math.min(batch_size || 5, 8));
    }

    if (!entries?.length) {
      return Response.json({ status: 'no_entries', message: 'No entries to process', records_created: 0, records_merged: 0 });
    }

    // Get book title for source attribution
    let bookTitle = '';
    if (book_id) {
      const books = await base44.asServiceRole.entities.ManuscriptBook.filter({ book_id }, undefined, 1);
      if (books?.length) bookTitle = books[0].book_title || '';
    }
    if (!bookTitle && entries[0]?.book_title) bookTitle = entries[0].book_title;

    // ══ Step 1: LLM — classify each entry into entity_type + entity_key ══
    const classifyPrompt = `You are classifying Islamic occult manuscript entries for entity-aware routing.

ENTRIES:
${entries.map((e: any, i: number) => `Entry ${i + 1} (ID: ${e.entry_id}):
- Purpose: ${(e.purpose || 'N/A').substring(0, 200)}
- Topic: ${(e.topic || 'N/A').substring(0, 150)}
- Arabic: ${(e.arabic_text || '').substring(0, 300)}
- English: ${(e.english_meaning || '').substring(0, 300)}
- Procedure: ${(e.procedure || '').substring(0, 200)}
- Materials: ${(e.materials || '').substring(0, 150)}
- Timing: ${(e.timing || 'N/A').substring(0, 150)}
- Planet: ${(e.planet || 'N/A').substring(0, 80)}
- Day: ${(e.day || 'N/A').substring(0, 80)}
- Incense: ${(e.incense || 'N/A').substring(0, 80)}
- Notes: ${(e.notes || '').substring(0, 200)}`).join('\n\n')}

TASK: For each entry, classify it into entity_type + entity_key + extract knowledge.

entity_type options:
- "planet" — PRIMARILY about a specific planet's properties/traits/nature/relationships
- "zodiac" — PRIMARILY about a specific zodiac sign's properties/rulership/health
- "mansion" — PRIMARILY about a specific lunar mansion (1-28)
- "weekday" — PRIMARILY about a specific day of the week
- "house" — PRIMARILY about one of the 12 astrological houses
- "element" — PRIMARILY about fire/earth/air/water
- "ritual" — PRIMARILY a ritual/spiritual practice (not timing-specific)
- "general_astro" — general astrological theory not tied to one entity

entity_key (lowercase):
- planet: sun/moon/mars/mercury/jupiter/venus/saturn
- zodiac: aries/taurus/gemini/cancer/leo/virgo/libra/scorpio/sagittarius/capricorn/aquarius/pisces
- mansion: 1-28 (string)
- weekday: 0-6 (string, 0=Sunday)
- house: 1-12 (string)
- element: fire/earth/air/water
- ritual: short name
- general_astro: "general"

Also extract:
- knowledge_category: properties/traits/relationships/timing_rules/ritual_instructions/warnings/incense/health/general
- knowledge_text_en: concise English summary of the knowledge
- knowledge_text_ar: original Arabic text if available (verbatim)

RULES:
- If an entry is about Mars (e.g., "Mars is hot and dry, rules Aries"), classify as planet/mars.
- If an entry is about Aries (e.g., "Aries is a fire sign"), classify as zodiac/aries.
- If an entry is about a specific lunar mansion, classify as mansion/<number>.
- If an entry is general astro theory, classify as general_astro/general.
- If an entry has NO astrological entity info, return entity_type="none".

Return JSON:
{
  "classifications": [
    {
      "entry_id": "...",
      "entity_type": "planet"|"zodiac"|"mansion"|"weekday"|"house"|"element"|"ritual"|"general_astro"|"none",
      "entity_key": "...",
      "knowledge_category": "...",
      "knowledge_text_en": "...",
      "knowledge_text_ar": "..."
    }
  ]
}`;

    const classifyRes = await base44.integrations.Core.InvokeLLM({
      prompt: classifyPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          classifications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                entry_id: { type: "string" },
                entity_type: { type: "string", enum: ["planet", "zodiac", "mansion", "weekday", "house", "element", "ritual", "general_astro", "none"] },
                entity_key: { type: "string" },
                knowledge_category: { type: "string" },
                knowledge_text_en: { type: "string" },
                knowledge_text_ar: { type: "string" }
              },
              required: ["entry_id", "entity_type"]
            }
          }
        },
        required: ["classifications"]
      }
    });

    const classifyData: any = (classifyRes as any).data || classifyRes;
    const classifications: any[] = Array.isArray(classifyData.classifications) ? classifyData.classifications : [];

    let recordsCreated = 0;
    let recordsMerged = 0;
    let markersCreated = 0;
    const details: any[] = [];

    // ══ Step 2: Merge each classified entry into EntityKnowledge ══
    for (const cls of classifications) {
      const entry = entries.find((e: any) => e.entry_id === cls.entry_id);
      if (!entry) continue;

      const entityType = String(cls.entity_type || '').toLowerCase();
      const entityKey = String(cls.entity_key || '').toLowerCase();
      const textEn = String(cls.knowledge_text_en || '').trim();
      const textAr = String(cls.knowledge_text_ar || entry.arabic_text || '').trim();
      const category = String(cls.knowledge_category || 'general').toLowerCase();

      // If no entity detected, create a marker to prevent reprocessing
      if (entityType === 'none' || !entityType || !textEn) {
        const markerId = `EK-MAN-MARKER-${entry.entry_id}`;
        const markerHash = await computeHash(`marker-${entry.entry_id}`);
        await base44.asServiceRole.entities.EntityKnowledge.create({
          knowledge_id: markerId, entity_type: 'general_astro', entity_key: 'general',
          knowledge_category: 'general', knowledge_text_en: '',
          content_hash: markerHash, canonical_key: `general_astro|general|marker-${entry.entry_id}`,
          is_marker: true, source_book_id: entry.book_id || book_id || '',
          source_book_title: bookTitle, source_page_number: entry.page_number || '',
          source_entry_id: entry.entry_id, is_verified: entry.verification_status === 'verified',
          supporting_sources: [], source_count: 0
        });
        markersCreated++;
        details.push({ entry_id: entry.entry_id, action: 'marker' });
        continue;
      }

      const canonicalKey = `${entityType}|${entityKey}|${category}`;
      const contentHash = await computeHash(`${entityType}|${entityKey}|${normalizeText(textEn).substring(0, 200)}`);
      const sourceObj = {
        book_title: bookTitle, page_number: entry.page_number || '',
        entry_id: entry.entry_id, screenshot_url: ''
      };

      // Check by content_hash (exact duplicate)
      const existingByHash = await base44.asServiceRole.entities.EntityKnowledge.filter(
        { content_hash: contentHash, is_marker: false }, undefined, 1
      );

      if (existingByHash && existingByHash.length > 0) {
        const ex = existingByHash[0];
        const sources = [...(ex.supporting_sources || [])];
        if (!sources.some((s: any) => s.entry_id === entry.entry_id)) {
          sources.push(sourceObj);
          await base44.asServiceRole.entities.EntityKnowledge.update(ex.id, {
            supporting_sources: sources, source_count: (ex.source_count || 1) + 1
          });
        }
        recordsMerged++;
        details.push({ entry_id: entry.entry_id, entity_type: entityType, entity_key: entityKey, action: 'merged_exact' });
        continue;
      }

      // Check by canonical_key (complementary merge)
      const existingByCanonical = await base44.asServiceRole.entities.EntityKnowledge.filter(
        { canonical_key: canonicalKey, is_marker: false }, undefined, 1
      );

      if (existingByCanonical && existingByCanonical.length > 0) {
        const ex = existingByCanonical[0];
        const normExisting = normalizeText(ex.knowledge_text_en || '');
        const normNew = normalizeText(textEn);
        let mergedText = ex.knowledge_text_en || '';
        if (!normExisting.includes(normNew)) {
          mergedText = mergedText ? mergedText + '\n---\n' + textEn : textEn;
        }
        const sources = [...(ex.supporting_sources || [])];
        const hasNewSource = !sources.some((s: any) => s.entry_id === entry.entry_id);
        if (hasNewSource) sources.push(sourceObj);
        let mergedAr = ex.knowledge_text_ar || '';
        if (textAr && !normalizeText(mergedAr).includes(normalizeText(textAr))) {
          mergedAr = mergedAr ? mergedAr + '\n---\n' + textAr : textAr;
        }
        await base44.asServiceRole.entities.EntityKnowledge.update(ex.id, {
          knowledge_text_en: mergedText, knowledge_text_ar: mergedAr,
          supporting_sources: sources,
          source_count: (ex.source_count || 1) + (hasNewSource ? 1 : 0)
        });
        recordsMerged++;
        details.push({ entry_id: entry.entry_id, entity_type: entityType, entity_key: entityKey, action: 'merged_complementary' });
      } else {
        const knowledgeId = `EK-MAN-${entry.entry_id}-${Math.random().toString(36).substring(2, 5)}`;
        await base44.asServiceRole.entities.EntityKnowledge.create({
          knowledge_id: knowledgeId, entity_type: entityType, entity_key: entityKey,
          knowledge_category: category, knowledge_text_en: textEn,
          knowledge_text_ml: '', knowledge_text_ar: textAr,
          structured_data: {}, content_hash: contentHash, canonical_key: canonicalKey,
          is_marker: false, source_book_id: entry.book_id || book_id || '',
          source_book_title: bookTitle, source_page_number: entry.page_number || '',
          source_entry_id: entry.entry_id, source_screenshot_url: '',
          is_verified: entry.verification_status === 'verified',
          supporting_sources: [], source_count: 1
        });
        recordsCreated++;
        details.push({ entry_id: entry.entry_id, entity_type: entityType, entity_key: entityKey, action: 'created' });
      }
    }

    return Response.json({
      status: 'enrichment_complete', book_id: book_id || '',
      entries_processed: entries.length, records_created: recordsCreated,
      records_merged: recordsMerged, markers_created: markersCreated,
      details,
      message: `Enriched ${entries.length} entries: ${recordsCreated} new EntityKnowledge records, ${recordsMerged} merged, ${markersCreated} markers.`
    });
  } catch (error) {
    return Response.json({ error: error.message, status: 'enrichment_failed' }, { status: 500 });
  }
});