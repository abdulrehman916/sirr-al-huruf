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
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: "Extract ALL visible text from this FAAL CHOB divination card screenshot. Include: 1) The combination code (3 Arabic letters like ا ب د), 2) Any grid position number visible, 3) ALL Persian/Arabic text in the main content area, 4) Any text labeled as Danyal or Sadiq, 5) Any verse text at top. Return as JSON with fields: combination, gridPos, mainText, danyalText, sadiqText, verseText. Extract EXACTLY what's visible - no summarization, no translation, no AI generation.",
          file_urls: [url],
          model: "gemini_3_flash"
        });
        results.push({ url, text: res, success: true });
      } catch (e) {
        results.push({ url, error: e.message, success: false });
      }
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});