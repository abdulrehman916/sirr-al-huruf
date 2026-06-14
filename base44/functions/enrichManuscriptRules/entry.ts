import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const PATTERNS = {
  letters: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
  mansions: ['الشرطان', 'البطين', 'الثريا', 'الدبران', 'الهقعة', 'الهنعة', 'الذراع', 'النسرة', 'الطرف', 'الجبهة', 'الزبرة', 'الصرفة', 'العواء', 'السماك', 'الغفر', 'الزبانا', 'الإكليل', 'القلب', 'الشولة', 'النعائم', 'البلدة', 'سعد الذابح', 'سعد بلع', 'سعد السعود', 'سعد الأخبية', 'الفرغ المقدم', 'الفرغ المؤخر', 'الحوت'],
  planets: { 'شمس': 'Sun', 'قمر': 'Moon', 'عطارد': 'Mercury', 'زهرة': 'Venus', 'مریخ': 'Mars', 'مرّيخ': 'Mars', 'مشتری': 'Jupiter', 'زحل': 'Saturn' },
  zodiac: { 'حمل': 'Aries', 'ثور': 'Taurus', 'جوزا': 'Gemini', 'سرطان': 'Cancer', 'اسد': 'Leo', 'سنبله': 'Virgo', 'میزان': 'Libra', 'عقرب': 'Scorpio', 'قوس': 'Sagittarius', 'جدی': 'Capricorn', 'دلو': 'Aquarius', 'حوت': 'Pisces' },
  elements: { 'نار': 'Fire', 'هواء': 'Air', 'ماء': 'Water', 'تراب': 'Earth', 'آتش': 'Fire', 'باد': 'Air', 'آب': 'Water', 'خاک': 'Earth' },
  saad_nahs: { 'سعد': 'Saad', 'نحس': 'Nahs', 'مبارك': 'Saad', 'شوم': 'Nahs' },
  metals: { 'ذهب': 'Gold', 'فضة': 'Silver', 'نحاس': 'Copper', 'حديد': 'Iron' },
  colors: { 'أحمر': 'Red', 'أبيض': 'White', 'أسود': 'Black', 'أصفر': 'Yellow', 'أخضر': 'Green', 'أزرق': 'Blue' }
};

function extract(text, patternObj, isArray = false) {
  if (Array.isArray(patternObj)) {
    return patternObj.filter(p => text.includes(p));
  }
  const results = [];
  Object.entries(patternObj).forEach(([ar, en]) => {
    if (text.includes(ar)) {
      results.push(isArray ? { arabic: ar, english: en } : en);
    }
  });
  return results;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const { batch_size = 50, delay_ms = 1000 } = await req.json().catch(() => ({}));
    const allRules = await base44.entities.ManuscriptRule.filter({});
    
    let enrichedCount = 0;
    let updatedRecords = [];

    for (let i = 0; i < allRules.length; i++) {
      const rule = allRules[i];
      const text = (rule.original_text || '') + ' ' + (rule.rule_summary || '');
      if (!text.trim()) continue;

      let parsedData = {};
      try { parsedData = rule.data_json ? JSON.parse(rule.data_json) : {}; } catch (e) {}

      const extracted = {
        letters: extract(text, PATTERNS.letters),
        mansions: extract(text, PATTERNS.mansions),
        planets: extract(text, PATTERNS.planets, true),
        zodiac_signs: extract(text, PATTERNS.zodiac, true),
        elements: extract(text, PATTERNS.elements, true),
        saad_nahs: extract(text, PATTERNS.saad_nahs)[0] || null,
        metals: extract(text, PATTERNS.metals, true),
        colors: extract(text, PATTERNS.colors, true)
      };

      const hasNewData = Object.values(extracted).some(v => 
        (Array.isArray(v) && v.length > 0) || (typeof v === 'string' && v)
      );

      if (hasNewData) {
        const updatedDataJson = JSON.stringify({ ...parsedData, ...extracted });
        await base44.entities.ManuscriptRule.update(rule.id, { data_json: updatedDataJson });
        enrichedCount++;
        updatedRecords.push(rule.rule_id || rule.id);
      }

      if ((i + 1) % batch_size === 0 && i < allRules.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay_ms));
      }
    }

    return Response.json({
      success: true,
      total_processed: allRules.length,
      enriched_count: enrichedCount,
      updated_records: updatedRecords.slice(0, 20),
      message: `Enriched ${enrichedCount}/${allRules.length} records`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});