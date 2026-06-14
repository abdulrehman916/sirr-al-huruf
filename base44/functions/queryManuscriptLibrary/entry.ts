/**
 * MANUSCRIPT LIBRARY QUERY FUNCTION
 * Query the permanent manuscript library by category, book, or search term.
 * Returns all matching rules with full source citations.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { category, manuscript_id, search_term, include_conflicts } = body;

    let query = {};
    if (category) query.category = category;
    if (manuscript_id) query.manuscript_id = manuscript_id;

    // Fetch all matching rules
    const rules = await base44.asServiceRole.entities.ManuscriptRule.filter(query);

    // If search_term, filter by rule_summary or original_text
    let filteredRules = rules;
    if (search_term) {
      const term = search_term.toLowerCase();
      filteredRules = rules.filter(r =>
        (r.rule_summary && r.rule_summary.toLowerCase().includes(term)) ||
        (r.original_text && r.original_text.toLowerCase().includes(term)) ||
        (r.subcategory && r.subcategory.toLowerCase().includes(term))
      );
    }

    // Fetch all manuscripts for metadata
    const manuscripts = await base44.asServiceRole.entities.ManuscriptLibrary.list();

    // Group rules by category
    const byCategory = {};
    filteredRules.forEach(rule => {
      if (!byCategory[rule.category]) byCategory[rule.category] = [];
      byCategory[rule.category].push(rule);
    });

    // Find conflicts
    const conflictingRules = include_conflicts
      ? filteredRules.filter(r => r.conflict_with)
      : [];

    return Response.json({
      success: true,
      total_rules: filteredRules.length,
      total_manuscripts: manuscripts.length,
      manuscripts: manuscripts.map(m => ({
        book_id: m.book_id,
        book_name: m.book_name,
        author: m.author,
        pages_ingested: m.pages_ingested,
        total_rules: m.total_rules_extracted,
        status: m.ingestion_status,
        date: m.ingestion_date
      })),
      rules_by_category: byCategory,
      conflicts: conflictingRules,
      categories_present: Object.keys(byCategory)
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});