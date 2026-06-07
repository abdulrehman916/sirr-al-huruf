import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { screenshotUrls } = await req.json();

    const results = [];
    
    for (const url of screenshotUrls) {
      try {
        // Extract text from screenshot
        const extraction = await base44.integrations.Core.InvokeLLM({
          prompt: `Extract text from this FAAL CHOB card screenshot. Return JSON with:
1. combination: 3 Arabic letters (e.g., "ددج" or "د د ج")
2. gridPos: grid position number (1-64) if visible
3. verseText: Quran verse at top (if any)
4. mainText: ALL Persian text in main result area
5. danyalText: text under دانیال (Danyal)
6. sadiqText: text under صادق (Sadiq)

Extract EXACTLY what's visible - NO translation, NO summarization.`,
          file_urls: [url],
          model: "gemini_3_flash"
        });

        const extracted = typeof extraction === 'string' ? JSON.parse(extraction) : extraction;
        
        if (!extracted.combination) {
          results.push({ url, error: 'No combination detected', success: false });
          continue;
        }

        // Generate Arabic translation
        const arabicGen = await base44.integrations.Core.InvokeLLM({
          prompt: `Translate to Arabic (keep spiritual tone):
${extracted.mainText}
${extracted.danyalText ? '\nDanyal: ' + extracted.danyalText : ''}
${extracted.sadiqText ? '\nSadiq: ' + extracted.sadiqText : ''}

JSON: {"text": "...", "danyal": "...", "sadiq": "..."}`,
          model: "gemini_3_flash"
        });
        const arabic = typeof arabicGen === 'string' ? JSON.parse(arabicGen) : arabicGen;

        // Generate Malayalam translation
        const mlGen = await base44.integrations.Core.InvokeLLM({
          prompt: `Translate to Malayalam (keep spiritual tone):
${extracted.mainText}
${extracted.danyalText ? '\nDanyal: ' + extracted.danyalText : ''}
${extracted.sadiqText ? '\nSadiq: ' + extracted.sadiqText : ''}

JSON: {"text": "...", "danyal": "...", "sadiq": "..."}`,
          model: "gemini_3_flash"
        });
        const malayalam = typeof mlGen === 'string' ? JSON.parse(mlGen) : mlGen;

        results.push({
          url,
          success: true,
          combination: extracted.combination,
          gridPos: extracted.gridPos,
          persian: { text: extracted.mainText, danyal: extracted.danyalText, sadiq: extracted.sadiqText, verse: extracted.verseText },
          arabic,
          malayalam
        });

      } catch (e) {
        results.push({ url, error: e.message, success: false });
      }
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});