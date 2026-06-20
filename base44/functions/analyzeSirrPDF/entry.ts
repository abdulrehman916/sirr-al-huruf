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
    const { pdfUrl, action } = await req.json();
    if (!pdfUrl) {
      return Response.json({ error: 'PDF URL required' }, { status: 400 });
    }

    // Handle different actions
    if (action === 'extract') {
      // Full PDF extraction with structure
      const extraction = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: pdfUrl,
        json_schema: {
          type: 'object',
          properties: {
            pages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pageNumber: { type: 'integer' },
                  blocks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        text: { type: 'string' },
                        type: { type: 'string' },
                        isHeading: { type: 'boolean' },
                        fontSize: { type: 'number' },
                        isBold: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
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

      return Response.json({
        success: true,
        action: 'extract',
        result: extraction.output || { pages: [] },
      });
    }

    if (action === 'search') {
      const { query, index } = await req.json();
      
      // Search through extracted index
      const results = searchKnowledgeIndex(query, index);
      
      return Response.json({
        success: true,
        action: 'search',
        results,
      });
    }

    // Default: basic extraction
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

// Search knowledge index (client-side will do this too)
function searchKnowledgeIndex(query, index) {
  if (!query || !index) return [];
  
  const queryLower = query.toLowerCase().trim();
  const results = [];
  const seen = new Set();
  
  // Search through pages
  (index.pages || []).forEach(page => {
    (page.blocks || []).forEach(block => {
      if (block.text && block.text.toLowerCase().includes(queryLower)) {
        const key = `${page.pageNumber}-${block.text.substring(0, 50)}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            type: 'text_match',
            relevance: 1.0,
            page: page.pageNumber,
            text: block.text,
            matchType: block.text.toLowerCase() === queryLower ? 'exact' : 'contains',
          });
        }
      }
    });
  });
  
  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 50);
}