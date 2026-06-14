/**
 * VERIFICATION AUDIT — ManuscriptRule Database Integrity Check
 * Returns exact counts for all 7 audit metrics requested.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    // Fetch all ManuscriptRule records
    const allRules = await base44.asServiceRole.entities.ManuscriptRule.filter({});
    
    // Fetch all ManuscriptLibrary records for reference
    const allManuscripts = await base44.asServiceRole.entities.ManuscriptLibrary.filter({});

    // 1. Total ManuscriptRule count
    const totalRules = allRules.length;

    // 2. Total unique page numbers stored
    const uniquePages = new Set(allRules.map(r => r.page_number).filter(p => p != null));
    const uniquePageCount = uniquePages.size;

    // 3. Pages with zero extracted rules (check against expected range 1-200)
    const expectedPages = new Set();
    for (let i = 1; i <= 200; i++) expectedPages.add(i);
    const pagesWithRules = new Set(allRules.map(r => r.page_number));
    const pagesWithZeroRules = [...expectedPages].filter(p => !pagesWithRules.has(p));

    // 4. Rules missing page citations
    const rulesMissingPageCitation = allRules.filter(r => !r.page_number || r.page_number === null || r.page_number === undefined);
    const rulesMissingPageCitationCount = rulesMissingPageCitation.length;

    // 5. Duplicate rule IDs
    const ruleIdCounts = {};
    allRules.forEach(r => {
      ruleIdCounts[r.rule_id] = (ruleIdCounts[r.rule_id] || 0) + 1;
    });
    const duplicateRuleIds = Object.entries(ruleIdCounts)
      .filter(([_, count]) => count > 1)
      .map(([id, count]) => ({ rule_id: id, count }));
    const duplicateRuleIdCount = duplicateRuleIds.length;

    // 6. Orphaned records (manuscript_id not in ManuscriptLibrary)
    const manuscriptIds = new Set(allManuscripts.map(m => m.book_id));
    const orphanedRecords = allRules.filter(r => !manuscriptIds.has(r.manuscript_id));
    const orphanedRecordCount = orphanedRecords.length;

    // 7. Categories with zero records
    const definedCategories = [
      'PLANETARY_HOURS', 'LUNAR_MANSIONS', 'ZODIAC', 'PLANETS',
      'FRIENDSHIP_RULES', 'INCENSE_RULES', 'LETTER_RULES', 'TIMING_RULES',
      'DAY_RULERS', 'SAAD_NAHS', 'SPIRITUAL_WORKS', 'PROTECTION_WORKS',
      'LOVE_WORKS', 'WEALTH_WORKS', 'TRAVEL_WORKS', 'ELEMENT_RULES',
      'COSMOLOGY', 'OTHER', 'EXALTATION', 'VEFK', 'HADIM', 'ABJAD',
      'SOFTWARE_USAGE'
    ];
    const categoriesInUse = new Set(allRules.map(r => r.category));
    const categoriesWithZeroRecords = definedCategories.filter(c => !categoriesInUse.has(c));

    return Response.json({
      audit_results: {
        total_manuscript_rules: totalRules,
        unique_pages_with_rules: uniquePageCount,
        pages_with_zero_rules: pagesWithZeroRules.length,
        rules_missing_page_citations: rulesMissingPageCitationCount,
        duplicate_rule_ids: duplicateRuleIdCount,
        orphaned_records: orphanedRecordCount,
        categories_with_zero_records: categoriesWithZeroRecords.length
      },
      details: {
        pages_with_zero_rules_list: pagesWithZeroRules,
        duplicate_rule_ids_detail: duplicateRuleIds,
        categories_with_zero_records_list: categoriesWithZeroRecords,
        orphaned_manuscript_ids: [...new Set(orphanedRecords.map(r => r.manuscript_id))]
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});