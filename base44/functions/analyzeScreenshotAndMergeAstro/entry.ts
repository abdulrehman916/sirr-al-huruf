import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK SCREENSHOT ANALYZER + MERGE
//
// Accepts an uploaded screenshot image, uses vision LLM to extract
// structured timing knowledge indexed by the COMPLETE context:
//   Weekday + Day/Night + Sa'at Number (1-24) + Kawkab + Nakshatra
//
// MERGE RULES (per user mandate):
// 1. Never overwrite previous knowledge.
// 2. Never delete existing knowledge.
// 3. Remove duplicate rules (text-normalized dedup).
// 4. Preserve every unique recommendation.
// 5. Preserve every source reference.
// 6. Knowledge is indexed by full_context_key, NOT by planet name.
// 7. Same Day+Saat+Kawkab = same canonical record (merged).
// 8. Different Day = different record (even if same Kawkab).
// ═══════════════════════════════════════════════════════════════

function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}

async function computeHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PLANET_KEYS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

// Merge an action array: add only unique items, preserve all sources, never delete
function mergeActionArray(
  existing: any[],
  newItems: any[],
  source: any
): { array: any[]; added: number; duplicates: number } {
  const result: any[] = JSON.parse(JSON.stringify(existing || []));
  const seen = new Set(result.map((item: any) => normalizeText(item.en)));
  let added = 0;
  let duplicates = 0;

  for (const newItem of newItems) {
    const en = String(newItem.en || '').trim();
    if (!en) continue;
    const norm = normalizeText(en);

    if (norm && !seen.has(norm)) {
      // Unique new item — add it
      seen.add(norm);
      result.push({
        en,
        ml: String(newItem.ml || '').trim(),
        ar: String(newItem.ar || '').trim(),
        sources: [source]
      });
      added++;
    } else {
      // Duplicate — add source to existing item if not already there
      duplicates++;
      const existingItem = result.find((item: any) => normalizeText(item.en) === norm);
      if (existingItem) {
        const existingSources = existingItem.sources || [];
        const alreadyHasSource = existingSources.some((s: any) =>
          (s.screenshot_url && source.screenshot_url && s.screenshot_url === source.screenshot_url) ||
          (s.book_title === source.book_title && s.page_number === source.page_number)
        );
        if (!alreadyHasSource) {
          existingSources.push(source);
        }
      }
    }
  }

  return { array: result, added, duplicates };
}

// Merge a text field: append if not duplicate
function mergeTextField(
  existing: string,
  newText: string
): { text: string; added: boolean } {
  if (!newText || !newText.trim()) return { text: existing || '', added: false };
  const normExisting = normalizeText(existing);
  const normNew = normalizeText(newText);
  if (normExisting.includes(normNew)) return { text: existing || '', added: false };
  if (!existing) return { text: newText, added: true };
  return { text: existing + '\n---\n' + newText, added: true };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { file_url, source_label } = body;

    if (!file_url) {
      return Response.json({ error: 'file_url is required (upload the image first via UploadFile)' }, { status: 400 });
    }

    // ══ 1. Vision LLM — extract structured knowledge from screenshot ══
    const prompt = `You are an expert analyst of Islamic occult manuscripts about Astro Clock (Saat/Kawkab) timing rules.

Analyze the provided screenshot image VERY CAREFULLY. It contains manuscript text (possibly in Arabic, Turkish, or transliterated English) about planetary hours (Sa'at), ruling planets (Kawkab), weekdays, and timing rules.

EXTRACTION TASK:
For EVERY unique timing rule combination found in the image, extract the COMPLETE context and all associated actions.

The COMPLETE context for each rule is:
1. Weekday: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
2. Period: "day" or "night"
3. saat_number: 1-24 (1-12 = daytime hours, 13-24 = nighttime hours). If the manuscript says "Saat 1" during daytime, that's saat_number=1. If it says "Saat 1" during nighttime, that's saat_number=13.
4. kawkab: the governing planet — "sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"
5. nakshatra: the lunar mansion / Manzil name if mentioned (empty string if not applicable)

CRITICAL RULES:
- Knowledge is indexed by the COMPLETE context (Weekday + Period + Saat + Kawkab + Nakshatra), NOT by planet name alone.
- If the image shows a rule for "Sunday, Saat 1, Shams (Sun)", that is a DIFFERENT record from "Monday, Saat 1, Shams (Sun)" even though both have kawkab=sun.
- Never assume all hours of the same planet are identical.
- Extract ALL action categories mentioned for each combination.

For each combination, extract these action arrays (each item has en, ml, ar):
- recommended_actions: actions RECOMMENDED for this exact time
- forbidden_actions: actions FORBIDDEN or to be AVOIDED for this exact time
- enemy_actions: actions related to ENEMIES (dealing with enemies, protection from enemies, etc.)
- friendship_actions: actions related to FRIENDSHIP (making friends, reconciliation, love, etc.)
- warnings_list: WARNINGS for this exact time
- notes_list: additional NOTES

Also extract:
- ritual_suitability: a text description of which ritual types are suitable for this exact time
- knowledge_text_en: a concise English summary of the complete rule
- knowledge_text_ar: the original Arabic text if visible (verbatim, never modified)

If the image does NOT contain any valid timing knowledge for a specific Day+Saat+Kawkab combination, return an empty array.

Return JSON with this exact schema:
{
  "combinations_found": <number>,
  "rules": [
    {
      "weekday": 0-6,
      "period": "day" or "night",
      "saat_number": 1-24,
      "kawkab": "sun"/"moon"/"mars"/"mercury"/"jupiter"/"venus"/"saturn",
      "nakshatra": "" or name,
      "ritual_suitability": "...",
      "knowledge_text_en": "...",
      "knowledge_text_ar": "...",
      "recommended_actions": [{"en":"...","ml":"...","ar":"..."}],
      "forbidden_actions": [{"en":"...","ml":"...","ar":"..."}],
      "enemy_actions": [{"en":"...","ml":"...","ar":"..."}],
      "friendship_actions": [{"en":"...","ml":"...","ar":"..."}],
      "warnings_list": [{"en":"...","ml":"...","ar":"..."}],
      "notes_list": [{"en":"...","ml":"...","ar":"..."}]
    }
  ]
}`;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          combinations_found: { type: "number" },
          rules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                weekday: { type: "number" },
                period: { type: "string" },
                saat_number: { type: "number" },
                kawkab: { type: "string" },
                nakshatra: { type: "string" },
                ritual_suitability: { type: "string" },
                knowledge_text_en: { type: "string" },
                knowledge_text_ar: { type: "string" },
                recommended_actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      en: { type: "string" },
                      ml: { type: "string" },
                      ar: { type: "string" }
                    }
                  }
                },
                forbidden_actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      en: { type: "string" },
                      ml: { type: "string" },
                      ar: { type: "string" }
                    }
                  }
                },
                enemy_actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      en: { type: "string" },
                      ml: { type: "string" },
                      ar: { type: "string" }
                    }
                  }
                },
                friendship_actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      en: { type: "string" },
                      ml: { type: "string" },
                      ar: { type: "string" }
                    }
                  }
                },
                warnings_list: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      en: { type: "string" },
                      ml: { type: "string" },
                      ar: { type: "string" }
                    }
                  }
                },
                notes_list: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      en: { type: "string" },
                      ml: { type: "string" },
                      ar: { type: "string" }
                    }
                  }
                }
              },
              required: ["weekday", "period", "saat_number", "kawkab", "knowledge_text_en"]
            }
          }
        },
        required: ["combinations_found", "rules"]
      }
    });

    const result: any = (llmResponse as any).data || llmResponse;
    const rules: any[] = Array.isArray(result.rules) ? result.rules : [];

    if (rules.length === 0) {
      return Response.json({
        status: 'no_knowledge_found',
        message: 'The screenshot did not contain valid timing knowledge for any Day+Saat+Kawkab combination.',
        combinations_found: 0,
        records_created: 0,
        records_merged: 0,
      });
    }

    // ══ 2. Process each extracted rule — merge into canonical database ══
    const sourceObj = {
      book_title: source_label || 'Screenshot Upload',
      page_number: '',
      entry_id: '',
      screenshot_url: file_url
    };

    let recordsCreated = 0;
    let recordsMerged = 0;
    let totalActionsAdded = 0;
    let totalDuplicatesSkipped = 0;
    const mergeDetails: any[] = [];

    for (const rule of rules) {
      // Validate required context fields
      if (rule.weekday === undefined || rule.weekday === null) continue;
      if (!rule.period) continue;
      if (!rule.saat_number) continue;
      if (!rule.kawkab) continue;
      if (!PLANET_KEYS.includes(rule.kawkab)) continue;

      const weekday = Number(rule.weekday);
      const period = String(rule.period);
      const saatNumber = Number(rule.saat_number);
      const kawkab = String(rule.kawkab);
      const nakshatra = String(rule.nakshatra || '');

      // Build full_context_key
      const fullContextKey = `${weekday}|${period}|${saatNumber}|${kawkab}|${nakshatra}`;

      // Query existing record with same full_context_key
      const existing = await base44.asServiceRole.entities.AstroClockKnowledge.filter(
        { full_context_key: fullContextKey, is_marker: false },
        undefined,
        1
      );

      const textEn = String(rule.knowledge_text_en || '').trim();
      const textAr = String(rule.knowledge_text_ar || '').trim();

      if (existing && existing.length > 0) {
        // ══ MERGE into existing record — never overwrite, never delete ══
        const ex = existing[0];

        // Merge each action array
        const recMerge = mergeActionArray(ex.recommended_actions, rule.recommended_actions || [], sourceObj);
        const forbMerge = mergeActionArray(ex.forbidden_actions, rule.forbidden_actions || [], sourceObj);
        const enemyMerge = mergeActionArray(ex.enemy_actions, rule.enemy_actions || [], sourceObj);
        const friendMerge = mergeActionArray(ex.friendship_actions, rule.friendship_actions || [], sourceObj);
        const warnMerge = mergeActionArray(ex.warnings_list, rule.warnings_list || [], sourceObj);
        const notesMerge = mergeActionArray(ex.notes_list, rule.notes_list || [], sourceObj);

        // Merge ritual_suitability (append if new)
        let ritualSuitability = ex.ritual_suitability || '';
        if (rule.ritual_suitability) {
          const rNorm = normalizeText(rule.ritual_suitability);
          if (ritualSuitability && !normalizeText(ritualSuitability).includes(rNorm)) {
            ritualSuitability = ritualSuitability + '\n---\n' + rule.ritual_suitability;
          } else if (!ritualSuitability) {
            ritualSuitability = rule.ritual_suitability;
          }
        }

        // Merge text fields
        const textMerge = mergeTextField(ex.knowledge_text_en, textEn);
        const arMerge = mergeTextField(ex.knowledge_text_ar, textAr);

        // Merge supporting_sources (add screenshot source)
        const supportingSources = [...(ex.supporting_sources || [])];
        const alreadyHasSource = supportingSources.some((s: any) =>
          (s.screenshot_url && s.screenshot_url === file_url)
        );
        if (!alreadyHasSource) {
          supportingSources.push(sourceObj);
        }

        const actionsAdded = recMerge.added + forbMerge.added + enemyMerge.added + friendMerge.added + warnMerge.added + notesMerge.added;
        const dupsSkipped = recMerge.duplicates + forbMerge.duplicates + enemyMerge.duplicates + friendMerge.duplicates + warnMerge.duplicates + notesMerge.duplicates;

        await base44.asServiceRole.entities.AstroClockKnowledge.update(ex.id, {
          recommended_actions: recMerge.array,
          forbidden_actions: forbMerge.array,
          enemy_actions: enemyMerge.array,
          friendship_actions: friendMerge.array,
          warnings_list: warnMerge.array,
          notes_list: notesMerge.array,
          ritual_suitability: ritualSuitability,
          knowledge_text_en: textMerge.text,
          knowledge_text_ar: arMerge.text,
          supporting_sources: supportingSources,
          source_count: (ex.source_count || 1) + (alreadyHasSource ? 0 : 1)
        });

        recordsMerged++;
        totalActionsAdded += actionsAdded;
        totalDuplicatesSkipped += dupsSkipped;

        mergeDetails.push({
          full_context_key: fullContextKey,
          weekday: WEEKDAY_NAMES[weekday] || `Day ${weekday}`,
          period,
          saat_number: saatNumber,
          kawkab,
          nakshatra: nakshatra || '(none)',
          action: 'merged',
          actions_added: actionsAdded,
          duplicates_skipped: dupsSkipped,
          total_sources: (ex.source_count || 1) + (alreadyHasSource ? 0 : 1)
        });
      } else {
        // ══ CREATE new record ══
        const knowledgeId = `ACK-SCR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const contentHash = await computeHash(`scr-${fullContextKey}-${normalizeText(textEn)}`);

        // Initialize action arrays with source
        const initActions = (items: any[]) => (items || []).filter((i: any) => i.en && String(i.en).trim()).map((i: any) => ({
          en: String(i.en).trim(),
          ml: String(i.ml || '').trim(),
          ar: String(i.ar || '').trim(),
          sources: [sourceObj]
        }));

        await base44.asServiceRole.entities.AstroClockKnowledge.create({
          knowledge_id: knowledgeId,
          source_type: 'full_context',
          weekday,
          period,
          saat_number: saatNumber,
          sahath_number: period === 'night' ? saatNumber - 12 : saatNumber,
          planet: kawkab,
          nakshatra,
          full_context_key: fullContextKey,
          knowledge_category: 'full_context_rule',
          recommended_actions: initActions(rule.recommended_actions),
          forbidden_actions: initActions(rule.forbidden_actions),
          enemy_actions: initActions(rule.enemy_actions),
          friendship_actions: initActions(rule.friendship_actions),
          warnings_list: initActions(rule.warnings_list),
          notes_list: initActions(rule.notes_list),
          ritual_suitability: String(rule.ritual_suitability || ''),
          knowledge_text_en: textEn,
          knowledge_text_ml: '',
          knowledge_text_ar: textAr,
          content_hash: contentHash,
          canonical_key: `full_context|${fullContextKey}`,
          is_marker: false,
          source_book_id: '',
          source_book_title: source_label || 'Screenshot Upload',
          source_page_number: '',
          source_entry_id: '',
          source_screenshot_url: file_url,
          is_verified: false,
          supporting_sources: [],
          source_count: 1
        });

        recordsCreated++;
        const actionsAdded = initActions(rule.recommended_actions).length +
          initActions(rule.forbidden_actions).length +
          initActions(rule.enemy_actions).length +
          initActions(rule.friendship_actions).length +
          initActions(rule.warnings_list).length +
          initActions(rule.notes_list).length;

        mergeDetails.push({
          full_context_key: fullContextKey,
          weekday: WEEKDAY_NAMES[weekday] || `Day ${weekday}`,
          period,
          saat_number: saatNumber,
          kawkab,
          nakshatra: nakshatra || '(none)',
          action: 'created',
          actions_added: actionsAdded,
          duplicates_skipped: 0,
          total_sources: 1
        });
      }
    }

    return Response.json({
      status: 'merge_complete',
      screenshot_url: file_url,
      combinations_found: rules.length,
      records_created: recordsCreated,
      records_merged: recordsMerged,
      total_actions_added: totalActionsAdded,
      total_duplicates_skipped: totalDuplicatesSkipped,
      merge_details: mergeDetails,
      message: `Analyzed screenshot: ${rules.length} combinations found. ${recordsCreated} new records created, ${recordsMerged} existing records merged. ${totalActionsAdded} unique actions added, ${totalDuplicatesSkipped} duplicates removed. All sources preserved.`
    });
  } catch (error) {
    return Response.json({ error: error.message, status: 'analysis_failed' }, { status: 500 });
  }
});