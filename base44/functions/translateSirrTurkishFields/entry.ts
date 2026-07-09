import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// SIRR TURKISH TRANSLATION — GLOBAL LANGUAGE RULE
// ═══════════════════════════════════════════════════════════════
// Scans ManuscriptEntry content fields for Turkish text.
// Translates ALL Turkish content fields to BOTH English AND Malayalam.
//   - English: overwrites the original field (replacing Turkish)
//   - Malayalam: saves to _ml field (topic_ml, purpose_ml) OR
//     content_translations_ml JSON (for fields without _ml variants)
// Book titles, Arabic text, and harakat are NEVER touched.
// ═══════════════════════════════════════════════════════════════

const TURKISH_CHARS = /[çşğğıİöüÇŞĞĞ]/;
const TURKISH_WORDS = [
  've','ile','bir','bu','şu','için','gibi','kadar','ancak','veya',
  'sonra','önce','değil','vardır','yoktur','olarak','üzere','rağmen',
  'dolayı','nedeniyle','tarafından','maksadıyla','gayesiyle','amacıyla',
  'cihetle','itibaren','bahisle','dair','edilir','yapılır','alınır',
  'yazılır','okunur','söylenir','denenmiştir','bildirilmiştir',
  'belirtilmiştir','anlatılmıştır','açıklanmıştır','nakledilmiştir',
  'rivayet','methal','beyan'
];

function hasTurkish(text: any): boolean {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length === 0) return false;

  const lower = t.toLowerCase();

  // Count Turkish function word matches
  // RULE: Turkish chars alone do NOT trigger — only function words do.
  // Proper names (Bülent Kısa, Kitabül Cilve, Mücerrebat, hüddam) are OK.
  let turkishWordCount = 0;
  for (const w of TURKISH_WORDS) {
    if (new RegExp(`\\b${w}\\b`, 'gi').test(lower)) {
      turkishWordCount++;
      if (turkishWordCount >= 2) return true;
    }
  }

  // 1 Turkish function word = likely Turkish
  if (turkishWordCount >= 1) return true;

  // 0 Turkish function words = NOT Turkish
  return false;
}

// Content fields to check and translate
const CONTENT_FIELDS = [
  'topic', 'purpose', 'introduction', 'conditions', 'materials',
  'preparation', 'procedure', 'timing', 'planet', 'day', 'incense',
  'repetition', 'warnings', 'benefits', 'notes'
];

// Fields that have dedicated _ml variants in the entity schema
const FIELDS_WITH_ML_VARIANT = new Set(['topic', 'purpose']);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const batchSize = Math.min(body.batch_size || 5, 8);

    // Fetch all entries
    const allEntries = await base44.asServiceRole.entities.ManuscriptEntry.list('-created_date', 500);

    // Find entries with Turkish in content fields
    const entriesWithTurkish = allEntries.filter((e: any) =>
      CONTENT_FIELDS.some((f: string) => hasTurkish(e[f]))
    );

    const totalTurkishFields = entriesWithTurkish.reduce((count: number, e: any) =>
      count + CONTENT_FIELDS.filter((f: string) => hasTurkish(e[f])).length, 0
    );

    // Take the next batch
    const batch = entriesWithTurkish.slice(0, batchSize);

    if (batch.length === 0) {
      return Response.json({
        status: 'complete',
        total_entries: allEntries.length,
        total_with_turkish: 0,
        total_turkish_fields: 0,
        remaining: 0,
        has_more: false,
        audit: {
          entries_scanned: allEntries.length,
          turkish_fields_corrected: 0,
          remaining_turkish: 0
        }
      });
    }

    // Collect all Turkish fields to translate
    const fieldsToTranslate: any[] = [];

    batch.forEach((entry: any) => {
      CONTENT_FIELDS.forEach((field: string) => {
        if (hasTurkish(entry[field])) {
          fieldsToTranslate.push({
            id: `${entry.entry_id}__${field}`,
            text: entry[field]
          });
        }
      });
    });

    // Build LLM prompt for batch translation
    const itemsJson = JSON.stringify(fieldsToTranslate);

    const prompt = `You are a professional translator for an Islamic occult manuscript encyclopedia (Sirr al-Huruf).

Translate each Turkish text below to BOTH English AND Malayalam.

RULES:
- Preserve all Islamic/occult/spiritual terminology accurately.
- Arabic phrases or names within the Turkish text must remain in Arabic script in both translations.
- Numbers, measurements, and proper names should be preserved.
- Do NOT translate book titles or author names.
- English: clean, professional translation.
- Malayalam: use proper Malayalam script (Unicode range U+0D00–U+0D7F).

Return a JSON object with a "translations" array. Each item must have:
  - id: the original id string
  - english: the English translation
  - malayalam: the Malayalam translation

Items to translate:
${itemsJson}`;

    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                english: { type: 'string' },
                malayalam: { type: 'string' }
              }
            }
          }
        }
      }
    });

    // Build translation lookup
    const translations: any = {};
    const transArray = (llmResponse as any)?.translations || [];
    if (Array.isArray(transArray)) {
      for (const t of transArray) {
        if (t.id) {
          translations[t.id] = {
            english: t.english || '',
            malayalam: t.malayalam || ''
          };
        }
      }
    }

    // Apply translations to entries
    const audit: any[] = [];
    let totalCorrected = 0;
    const updates: any[] = [];

    for (const entry of batch) {
      const updateData: any = {};
      const entryAudit: any = { entry_id: entry.entry_id, topic: entry.topic, fields_translated: [] };

      // Preserve existing content_translations_ml
      const existingTranslationsMl = entry.content_translations_ml || {};
      updateData.content_translations_ml = { ...existingTranslationsMl };

      let hasUpdates = false;

      for (const field of CONTENT_FIELDS) {
        if (hasTurkish(entry[field])) {
          const translationId = `${entry.entry_id}__${field}`;
          const translation = translations[translationId];

          if (translation && translation.english && translation.malayalam) {
            // Save English to original field (overwrites Turkish)
            updateData[field] = translation.english;

            // Save Malayalam
            if (FIELDS_WITH_ML_VARIANT.has(field)) {
              updateData[`${field}_ml`] = translation.malayalam;
            } else {
              updateData.content_translations_ml[field] = translation.malayalam;
            }

            entryAudit.fields_translated.push(`${field}→EN+ML`);
            totalCorrected++;
            hasUpdates = true;
          } else {
            entryAudit.fields_translated.push(`${field}→SKIPPED`);
          }
        }
      }

      if (hasUpdates) {
        updates.push({ id: entry.id, ...updateData });
        audit.push(entryAudit);
      }
    }

    // Bulk update
    if (updates.length > 0) {
      await base44.asServiceRole.entities.ManuscriptEntry.bulkUpdate(updates);
    }

    // Count remaining
    const remaining = Math.max(0, entriesWithTurkish.length - batch.length);

    return Response.json({
      status: remaining > 0 ? 'batch_complete' : 'complete',
      total_entries: allEntries.length,
      total_with_turkish: entriesWithTurkish.length,
      total_turkish_fields: totalTurkishFields,
      entries_in_batch: batch.length,
      entries_translated: audit.length,
      fields_corrected: totalCorrected,
      remaining: remaining,
      has_more: remaining > 0,
      audit: audit
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});