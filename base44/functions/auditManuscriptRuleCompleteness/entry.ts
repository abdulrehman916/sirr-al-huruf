import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const allRules = await base44.entities.ManuscriptRule.filter({});
    
    const audit = {
      total_records: allRules.length,
      with_original_arabic: 0,
      with_malayalam_translation: 0,
      with_arabic_letter: 0,
      with_planet: 0,
      with_zodiac: 0,
      with_lunar_mansion: 0,
      missing_fields: {
        missing_arabic: [],
        missing_malayalam: [],
        missing_letter: [],
        missing_planet: [],
        missing_zodiac: [],
        missing_mansion: []
      },
      by_category: {},
      by_manuscript: {},
      completeness_score: 0
    };

    allRules.forEach((rule) => {
      const ruleId = rule.rule_id || rule.id;
      const category = rule.category || 'UNKNOWN';
      const manuscript = rule.manuscript_id || 'UNKNOWN';

      if (!audit.by_category[category]) {
        audit.by_category[category] = { total: 0, with_arabic: 0, with_malayalam: 0, with_letter: 0, with_planet: 0, with_zodiac: 0, with_mansion: 0 };
      }
      audit.by_category[category].total++;

      if (!audit.by_manuscript[manuscript]) {
        audit.by_manuscript[manuscript] = { total: 0, with_arabic: 0, with_malayalam: 0, with_letter: 0, with_planet: 0, with_zodiac: 0, with_mansion: 0 };
      }
      audit.by_manuscript[manuscript].total++;

      let parsedData = {};
      try { parsedData = rule.data_json ? JSON.parse(rule.data_json) : {}; } catch (e) {}

      const hasArabic = rule.original_text && rule.original_text.trim().length > 0;
      if (hasArabic) {
        audit.with_original_arabic++;
        audit.by_category[category].with_arabic++;
        audit.by_manuscript[manuscript].with_arabic++;
      } else {
        audit.missing_fields.missing_arabic.push(ruleId);
      }

      const hasMalayalam = rule.rule_summary_ml && rule.rule_summary_ml.trim().length > 0;
      if (hasMalayalam) {
        audit.with_malayalam_translation++;
        audit.by_category[category].with_malayalam++;
        audit.by_manuscript[manuscript].with_malayalam++;
      } else {
        audit.missing_fields.missing_malayalam.push(ruleId);
      }

      const hasLetter = parsedData.letter || parsedData.arabic_letter || parsedData.harf || 
                        (parsedData.letters && parsedData.letters.length > 0) ||
                        (rule.subcategory && rule.subcategory.includes('letter'));
      if (hasLetter) {
        audit.with_arabic_letter++;
        audit.by_category[category].with_letter++;
        audit.by_manuscript[manuscript].with_letter++;
      } else {
        audit.missing_fields.missing_letter.push(ruleId);
      }

      const hasPlanet = parsedData.planet || parsedData.ruling_planet || parsedData.planets ||
                        (parsedData.planet_list && parsedData.planet_list.length > 0) ||
                        (rule.subcategory && rule.subcategory.includes('planet')) ||
                        (category === 'PLANETS');
      if (hasPlanet) {
        audit.with_planet++;
        audit.by_category[category].with_planet++;
        audit.by_manuscript[manuscript].with_planet++;
      } else {
        audit.missing_fields.missing_planet.push(ruleId);
      }

      const hasZodiac = parsedData.zodiac || parsedData.zodiac_sign || parsedData.sign ||
                        parsedData.burj || (parsedData.zodiac_signs && parsedData.zodiac_signs.length > 0) ||
                        (rule.subcategory && rule.subcategory.includes('zodiac')) ||
                        (category === 'ZODIAC');
      if (hasZodiac) {
        audit.with_zodiac++;
        audit.by_category[category].with_zodiac++;
        audit.by_manuscript[manuscript].with_zodiac++;
      } else {
        audit.missing_fields.missing_zodiac.push(ruleId);
      }

      const hasMansion = parsedData.mansion || parsedData.lunar_mansion || parsedData.manazil ||
                         parsedData.manzil || (parsedData.mansions && parsedData.mansions.length > 0) ||
                         (rule.subcategory && rule.subcategory.includes('mansion')) ||
                         (category === 'LUNAR_MANSIONS');
      if (hasMansion) {
        audit.with_lunar_mansion++;
        audit.by_category[category].with_mansion++;
        audit.by_manuscript[manuscript].with_mansion++;
      } else {
        audit.missing_fields.missing_mansion.push(ruleId);
      }
    });

    const total = audit.total_records || 1;
    const rates = [
      audit.with_original_arabic / total,
      audit.with_malayalam_translation / total,
      audit.with_arabic_letter / total,
      audit.with_planet / total,
      audit.with_zodiac / total,
      audit.with_lunar_mansion / total
    ];
    audit.completeness_score = Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100);

    const recordsNeedingReingestion = [];
    allRules.forEach((rule) => {
      const ruleId = rule.rule_id || rule.id;
      let missingCount = 0;
      if (!rule.original_text) missingCount++;
      if (!rule.rule_summary_ml) missingCount++;
      let parsedData = {};
      try { parsedData = rule.data_json ? JSON.parse(rule.data_json) : {}; } catch (e) {}
      if (!parsedData.letter && !parsedData.arabic_letter && !parsedData.harf) missingCount++;
      if (!parsedData.planet && !parsedData.ruling_planet) missingCount++;
      if (!parsedData.zodiac && !parsedData.zodiac_sign && !parsedData.sign) missingCount++;
      if (!parsedData.mansion && !parsedData.lunar_mansion && !parsedData.manazil) missingCount++;
      if (missingCount >= 3) recordsNeedingReingestion.push(ruleId);
    });

    audit.records_requiring_reingestion = recordsNeedingReingestion;
    audit.records_requiring_reingestion_count = recordsNeedingReingestion.length;

    return Response.json({
      success: true,
      audit: audit,
      summary: {
        total_records: audit.total_records,
        completeness_percentage: audit.completeness_score,
        records_missing_arabic: audit.missing_fields.missing_arabic.length,
        records_missing_malayalam: audit.missing_fields.missing_malayalam.length,
        records_missing_letter: audit.missing_fields.missing_letter.length,
        records_missing_planet: audit.missing_fields.missing_planet.length,
        records_missing_zodiac: audit.missing_fields.missing_zodiac.length,
        records_missing_mansion: audit.missing_fields.missing_mansion.length,
        records_needing_reingestion: audit.records_requiring_reingestion_count
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});