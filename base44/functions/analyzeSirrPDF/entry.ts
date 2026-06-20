import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const { pdfUrl } = await req.json();
    if (!pdfUrl) {
      return Response.json({ error: 'PDF URL required' }, { status: 400 });
    }

    // Extract text from PDF using Base44 integration
    const extraction = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url: pdfUrl,
      json_schema: {
        type: 'object',
        properties: {
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                pageNumber: { type: 'integer' },
                content: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' },
                      type: { type: 'string' },
                      language: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          keyConcepts: {
            type: 'array',
            items: { type: 'string' },
          },
          languages: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    });

    if (extraction.status === 'error') {
      return Response.json({ 
        error: 'PDF extraction failed',
        details: extraction.details,
      }, { status: 500 });
    }

    // Structure the result
    const result = {
      document: {
        title: pdfUrl.split('/').pop() || 'Document',
        totalPages: extraction.output?.sections?.length || 0,
      },
      sections: extraction.output?.sections || [],
      keyConcepts: extraction.output?.keyConcepts || [],
      languages: extraction.output?.languages || [],
    };

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Sirr PDF analysis error:', error);
    return Response.json({ 
      error: error.message || 'Analysis failed',
    }, { status: 500 });
  }
});