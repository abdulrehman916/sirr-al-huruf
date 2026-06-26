import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const { pdf_url } = await req.json();
    if (!pdf_url) return Response.json({ error: 'pdf_url is required' }, { status: 400 });

    // Extract Holy Names from PDF using AI
    const extraction = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url: pdf_url,
      json_schema: {
        type: "object",
        properties: {
          holy_names: {
            type: "array",
            items: {
              type: "object",
              properties: {
                arabic_name: { type: "string", description: "Arabic name text" },
                arabic_transliteration: { type: "string", description: "Latin script transliteration" },
                malayalam_pronunciation: { type: "string", description: "Malayalam pronunciation" },
                meaning_malayalam: { type: "string", description: "Meaning in Malayalam" },
                explanation_malayalam: { type: "string", description: "Complete Malayalam explanation" },
                virtues_benefits: { type: "string", description: "Virtues and benefits in Malayalam" },
                islamic_information: { type: "string", description: "Related Islamic information" },
                authentic_notes: { type: "string", description: "Authentic notes from PDF" },
                source_page: { type: "integer", description: "Page number in source PDF" },
                source_reference: { type: "string", description: "Reference/citation from PDF" }
              },
              required: ["arabic_name", "malayalam_pronunciation", "meaning_malayalam"]
            }
          }
        },
        required: ["holy_names"]
      }
    });

    if (!extraction || extraction.status !== 'success' || !extraction.output || !extraction.output.holy_names) {
      return Response.json({ 
        error: 'Extraction failed', 
        details: extraction.details 
      }, { status: 500 });
    }

    const names = extraction.output.holy_names;
    if (!Array.isArray(names) || names.length === 0) {
      return Response.json({ error: 'No Holy Names found in PDF' }, { status: 404 });
    }

    // Import to database
    const imported = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const nameId = `HN-${String(i + 1).padStart(3, '0')}`;
      
      const record = await base44.entities.HolyOneName.create({
        name_id: nameId,
        arabic_name: name.arabic_name || '',
        arabic_transliteration: name.arabic_transliteration || '',
        malayalam_pronunciation: name.malayalam_pronunciation || '',
        meaning_malayalam: name.meaning_malayalam || '',
        explanation_malayalam: name.explanation_malayalam || '',
        virtues_benefits: name.virtues_benefits || '',
        islamic_information: name.islamic_information || '',
        authentic_notes: name.authentic_notes || '',
        source_page: name.source_page || null,
        source_reference: name.source_reference || '',
        order_index: i + 1,
        is_favorite: false,
        view_count: 0,
        created_by: user.id,
        created_date: new Date().toISOString(),
        archived: false
      });
      
      imported.push({ name_id: nameId, arabic_name: name.arabic_name });
    }

    return Response.json({
      success: true,
      message: `Successfully imported ${imported.length} Holy Names`,
      count: imported.length,
      names: imported,
      extraction_details: extraction
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});