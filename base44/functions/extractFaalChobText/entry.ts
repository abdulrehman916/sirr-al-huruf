import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { screenshotUrls } = await req.json();

    if (!screenshotUrls || !Array.isArray(screenshotUrls)) {
      return Response.json({ error: 'No screenshot URLs provided' }, { status: 400 });
    }

    // Load existing card data to match combinations
    const cards = await base44.entities.FaalChobTranslation.list();
    
    const results = [];
    let updated = 0;
    let skipped = 0;

    for (const url of screenshotUrls) {
      try {
        // Step 1: Extract Arabic combination and Persian text from screenshot
        const extraction = await base44.integrations.Core.InvokeLLM({
          prompt: `Extract ALL visible text from this FAAL CHOB divination card screenshot:

1. COMBINATION: The 3 Arabic letters at the top (e.g., "ددج", "د د د", "ا ب ج")
2. GRID POSITION: Number 1-64 if visible
3. VERSE: Any Quran verse at the top
4. MAIN TEXT: ALL Persian text in the main result area
5. DANYAL: Text under دانیال
6. SADIQ: Text under صادق

Return as JSON:
{
  "combination": "exact 3 Arabic letters",
  "gridPos": number or null,
  "verse": "verse text or null",
  "mainText": "all Persian main text",
  "danyal": "Danyal text or null",
  "sadiq": "Sadiq text or null"
}

Extract EXACTLY what's visible - NO translation, NO summarization, NO AI generation.`,
          file_urls: [url],
          model: "gemini_3_flash"
        });

        const extracted = typeof extraction === 'string' ? JSON.parse(extraction) : extraction;

        if (!extracted.combination || extracted.combination.trim() === '') {
          results.push({
            url,
            success: false,
            error: 'No Arabic combination detected in screenshot',
            skipped: true
          });
          skipped++;
          continue;
        }

        // Normalize combination (remove spaces)
        const comboKey = extracted.combination.replace(/\s+/g, '');
        
        // Step 2: Find matching card by combination
        const matchingCard = cards.find(card => {
          const cardCombo = card.symbol?.replace(/\s+/g, '');
          return cardCombo === comboKey;
        });

        if (!matchingCard) {
          results.push({
            url,
            success: false,
            error: `No card found for combination: ${comboKey}`,
            combination: comboKey,
            skipped: true
          });
          skipped++;
          continue;
        }

        // Step 3: Check if card already has content
        const hasContent = matchingCard.text && matchingCard.text.trim().length > 0;
        const hasArabic = matchingCard.arabic?.text && matchingCard.arabic.text.trim().length > 0;
        const hasMalayalam = matchingCard.malayalam?.text && matchingCard.malayalam.text.trim().length > 0;

        if (hasContent && hasArabic && hasMalayalam) {
          results.push({
            url,
            success: true,
            combination: comboKey,
            gridPos: matchingCard.gridPos,
            message: 'Card already complete - no update needed',
            skipped: true
          });
          skipped++;
          continue;
        }

        // Step 4: Generate translations only if needed
        const persianText = extracted.mainText || matchingCard.text;
        const persianDanyal = extracted.danyal || matchingCard.danyal;
        const persianSadiq = extracted.sadiq || matchingCard.sadiq;
        const verse = extracted.verse || matchingCard.verse;

        let arabic = matchingCard.arabic;
        let malayalam = matchingCard.malayalam;

        if (!hasArabic && persianText) {
          const arabicGen = await base44.integrations.Core.InvokeLLM({
            prompt: `Translate this Faal Chob divination text to Arabic (العربية). 
Keep the spiritual and traditional tone.

Original Persian:
${persianText}
${persianDanyal ? '\nDanyal: ' + persianDanyal : ''}
${persianSadiq ? '\nSadiq: ' + persianSadiq : ''}

JSON format:
{
  "text": "Arabic translation of main text",
  "danyal": "Arabic translation of Danyal text",
  "sadiq": "Arabic translation of Sadiq text"
}`,
            model: "gemini_3_flash"
          });
          arabic = typeof arabicGen === 'string' ? JSON.parse(arabicGen) : arabicGen;
        }

        if (!hasMalayalam && persianText) {
          const mlGen = await base44.integrations.Core.InvokeLLM({
            prompt: `Translate this Faal Chob divination text to Malayalam (മലയാളം). 
Keep the spiritual and traditional tone.

Original Persian:
${persianText}
${persianDanyal ? '\nDanyal: ' + persianDanyal : ''}
${persianSadiq ? '\nSadiq: ' + persianSadiq : ''}

JSON format:
{
  "text": "Malayalam translation of main text",
  "danyal": "Malayalam translation of Danyal text",
  "sadiq": "Malayalam translation of Sadiq text"
}`,
            model: "gemini_3_flash"
          });
          malayalam = typeof mlGen === 'string' ? JSON.parse(mlGen) : mlGen;
        }

        // Step 5: Update the card
        const updateData = {
          gridPos: matchingCard.gridPos,
          source_text: persianText,
          arabic: arabic || matchingCard.arabic,
          malayalam: malayalam || matchingCard.malayalam
        };

        // Only update if there are changes
        await base44.entities.FaalChobTranslation.update(matchingCard.id, updateData);

        results.push({
          url,
          success: true,
          combination: comboKey,
          gridPos: matchingCard.gridPos,
          cardId: matchingCard.id,
          updated: {
            persian: !hasContent,
            arabic: !hasArabic,
            malayalam: !hasMalayalam
          },
          message: 'Card updated successfully'
        });
        updated++;

      } catch (error) {
        results.push({
          url,
          success: false,
          error: error.message,
          skipped: true
        });
        skipped++;
      }
    }

    return Response.json({
      results,
      summary: {
        total: screenshotUrls.length,
        updated,
        skipped
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});