/**
 * AUDIT ASTROLOGY INGESTION — Pre-Ingestion Analysis (Read-Only)
 * Filters ONLY astrology-related content, excludes spiritual/magical operations.
 * Returns detailed audit report WITHOUT writing to database.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const { pdf_urls } = body;

    if (!pdf_urls || !Array.isArray(pdf_urls) || pdf_urls.length === 0) {
      return Response.json({ error: 'pdf_urls array is required' }, { status: 400 });
    }

    // ASTROLOGY-ONLY EXTRACTION PROMPT
    const extractionPrompt = `You are an expert scholar of Islamic judicial astrology (Ahkam al-Nujum).

TASK: Extract ONLY astrology-related content from this Turkish occult manuscript.

INCLUDE THESE CATEGORIES (extract all instances):
1. PLANETARY_HOURS — planetary hour sequences, Chaldean order, hour durations, day/night hour calculations
2. LUNAR_MANSIONS — 28 manazil: names (Arabic/Turkish), associated stars, elements, lucky/unlucky operations, transit timing
3. ZODIAC — 12 burc/signs: element (fire/earth/air/water), quality (cardinal/fixed/mutable), gender, ruler planet, exaltation degree, fall degree, decan rulers
4. PLANETS — 7 classical planets: nature (benefic/malefic), element, gender, temperament (hot/cold/dry/wet), day rulership, hour rulership, body parts ruled, professions, colors, stones, metals
5. FRIENDSHIP_RULES — planetary friendships (dostlar), enmities (düşmanlar), neutral relations
6. DAY_RULERS — which planet rules each day (Saturday-Saturday), day ruler + night ruler assignments
7. SAAD_NAHS — Sa'd (lucky/benefic) and Nahs (unlucky/malefic) classifications for planets, signs, mansions, days
8. COSMOLOGY — geocentric model, celestial spheres, ecliptic, seven climates, lunar nodes (Caput Draconis/Cauda Draconis), planetary orbits
9. ASTRONOMICAL_DATA — planetary positions, conjunctions, oppositions, aspects, orbital periods, retrograde motion
10. ELECTION_RULES — astrological election timing (when to start works based on moon phase, planetary hour, day ruler)
11. HOUSES — 12 astrological houses meanings, house rulerships
12. ASPECTS — planetary aspects: trine (120°), square (90°), opposition (180°), sextile (60°), conjunction (0°)
13. EXALTATION — sharaf (exaltation) degrees for each planet, hubut (fall) degrees

EXCLUDE COMPLETELY (skip these):
- Vefk / magic square construction
- Talismans / tılsım
- Love operations / muhabbat works
- Wealth operations / rizk works  
- Protection works / korunma
- Spiritual entities / hadim services
- Divine Names properties
- Angel invocations
- Du'a formulas
- Zikir counts
- Healing rituals

FOR EACH EXTRACTED ITEM return:
{
  "page_number": <exact page number from PDF>,
  "category": "<one of 13 categories above>",
  "subcategory": "<specific topic>",
  "original_text": "<exact Turkish/Arabic quote>",
  "rule_summary": "<detailed English summary>",
  "data_json": {<structured data: planet names, degrees, timings, etc>},
  "confidence": <0.0-1.0>
}

Return as JSON:
{
  "astrology_rules": [<all extracted rules>],
  "excluded_count": <approximate count of excluded spiritual content>,
  "pages_scanned": [<list of page numbers scanned>],
  "total_pages": <total pages in PDF>,
  "categories_found": [<unique categories found>],
  "extraction_notes": "<any notes about content quality, gaps, diagrams>"
}

IMPORTANT: This is a Turkish translation of Elbuni's work. Look for Turkish terms like:
- Gezegen (planet), Burc (zodiac), Saat (hour), Gün (day)
- Saad/Nahs, Uğurlu/Uğursuz (lucky/unlucky)
- Gezegen dostluğu/düşmanlığı (friendship/enmity)
- Ay menzilleri (lunar mansions)
- Yükselme (exaltation), Düşme (fall)`;

    console.log(`Starting astrology-only extraction from ${pdf_urls.length} PDFs`);

    let llmResult;
    try {
      llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: extractionPrompt,
        file_urls: pdf_urls,
        model: 'claude_sonnet_4_6',
        response_json_schema: {
          type: 'object',
          properties: {
            astrology_rules: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  page_number: { type: 'integer' },
                  category: { type: 'string' },
                  subcategory: { type: 'string' },
                  original_text: { type: 'string' },
                  rule_summary: { type: 'string' },
                  data_json: { type: 'object' },
                  confidence: { type: 'number' }
                }
              }
            },
            excluded_count: { type: 'integer' },
            pages_scanned: { type: 'array', items: { type: 'integer' } },
            total_pages: { type: 'integer' },
            categories_found: { type: 'array', items: { type: 'string' } },
            extraction_notes: { type: 'string' }
          }
        }
      });
    } catch (llmError) {
      return Response.json({ error: 'LLM extraction failed: ' + llmError.message }, { status: 500 });
    }

    const astrologyRules = llmResult.astrology_rules || [];
    const excludedCount = llmResult.excluded_count || 0;
    const pagesScanned = llmResult.pages_scanned || [];
    const categoriesFound = llmResult.categories_found || [];

    // Get existing database for comparison
    const existingRules = await base44.asServiceRole.entities.ManuscriptRule.filter({});
    const existingManuscripts = await base44.asServiceRole.entities.ManuscriptLibrary.filter({});

    // Analyze overlaps
    const existingCategories = new Set(existingRules.map(r => r.category));
    const newCategories = categoriesFound.filter(c => !existingCategories.has(c));
    
    // Category breakdown for extracted rules
    const categoryBreakdown = {};
    astrologyRules.forEach(r => {
      categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1;
    });

    // Estimate overlaps (same category + similar subcategory)
    const potentialOverlaps = [];
    astrologyRules.forEach(rule => {
      const similar = existingRules.filter(r => 
        r.category === rule.category && 
        r.subcategory === rule.subcategory
      );
      if (similar.length > 0) {
        potentialOverlaps.push({
          new_rule: rule,
          existing_count: similar.length,
          manuscripts: [...new Set(similar.map(r => r.book_name))]
        });
      }
    });

    // Calculate expected operations
    const recordsToCreate = astrologyRules.length;
    const recordsToUpdate = 0; // No updates in additive mode
    const recordsToDelete = 0; // Never delete

    // Estimate alternate_source and disagreement entries
    const alternateSourceEstimate = potentialOverlaps.filter(o => o.existing_count > 0).length;
    const disagreementEstimate = potentialOverlaps.filter(o => 
      o.manuscripts.length > 0 && o.existing_count > 0
    ).length;

    // Page coverage estimate
    const uniquePages = new Set(astrologyRules.map(r => r.page_number)).size;

    return Response.json({
      pre_ingestion_audit: {
        manuscript_info: {
          book_name: "Sems'ul-Maarif'ul-Kubra (Vol. 3)",
          author: 'Imam Ahmed Elbuni',
          translator: 'Selahaddin Alpay',
          publisher: 'Sedef Yayinevi, 1979',
          proposed_id: 'elbuni_semsul_maarif_astrology_only'
        },
        extraction_summary: {
          pdfs_processed: pdf_urls.length,
          total_pages_scanned: pagesScanned.length,
          astrology_rules_extracted: astrologyRules.length,
          spiritual_content_excluded: excludedCount,
          categories_found: categoriesFound,
          category_breakdown: categoryBreakdown
        },
        database_comparison: {
          existing_manuscripts: existingManuscripts.length,
          existing_rules: existingRules.length,
          existing_categories: Array.from(existingCategories),
          new_categories_to_add: newCategories,
          potential_overlaps: potentialOverlaps.length,
          overlap_details: potentialOverlaps.slice(0, 20)
        },
        estimated_operations: {
          records_to_create: recordsToCreate,
          records_to_update: recordsToUpdate,
          records_to_delete: recordsToDelete,
          alternate_source_entries: alternateSourceEstimate,
          manuscript_disagreement_entries: disagreementEstimate,
          expected_page_coverage: uniquePages
        },
        filtering_applied: {
          included_categories: [
            'PLANETARY_HOURS', 'LUNAR_MANSIONS', 'ZODIAC', 'PLANETS',
            'FRIENDSHIP_RULES', 'DAY_RULERS', 'SAAD_NAHS', 'COSMOLOGY',
            'ASTRONOMICAL_DATA', 'ELECTION_RULES', 'HOUSES', 'ASPECTS'
          ],
          excluded_categories: [
            'VEFK', 'TALISMANS', 'LOVE_WORKS', 'WEALTH_WORKS',
            'PROTECTION_WORKS', 'SPIRITUAL_WORKS', 'INVOCATIONS',
            'DIVINE_NAMES', 'ANGEL_HIERARCHY', 'ZIKIR_PROTOCOL',
            'HEALING_OPERATIONS', 'MAGIC_SQUARES'
          ]
        },
        sample_rules: astrologyRules.slice(0, 10),
        extraction_notes: llmResult.extraction_notes || ''
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});