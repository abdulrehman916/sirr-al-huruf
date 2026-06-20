// ═══════════════════════════════════════════════════════════════
// SIRR PDF ENGINE — Advanced Knowledge Extraction
// ═══════════════════════════════════════════════════════════════
// Purpose: Complete PDF ingestion, indexing, and exact retrieval
// This engine is exclusively for the Sirr page (/sirr)
// Complete isolation from all other page engines
// ═══════════════════════════════════════════════════════════════

/**
 * Extract complete text content from PDF with structure preservation
 * @param {string} pdfUrl - URL of uploaded PDF
 * @returns {Promise<object>} Complete document structure
 */
export async function extractPdfContent(pdfUrl) {
  // Backend function will handle actual extraction
  // This returns the expected structure
  return {
    success: true,
    message: 'PDF extraction initiated',
  };
}

/**
 * Build searchable knowledge index from extracted content
 * @param {array} pages - Array of page objects
 * @returns {object} Searchable index with mappings
 */
export function buildKnowledgeIndex(pages) {
  const index = {
    // Full-text search index
    textIndex: new Map(),
    
    // Chapter/section mappings
    chapters: [],
    
    // Topic relationships
    topics: new Map(),
    
    // Page references
    pageMap: new Map(),
    
    // Special entities
    entities: {
      ayahs: [],
      surahs: [],
      duas: [],
      wazifas: [],
      amals: [],
      persons: [],
      numbers: [],
      symbols: [],
    },
  };
  
  let currentChapter = null;
  
  pages.forEach((page, pageIndex) => {
    const pageNum = page.pageNumber || pageIndex + 1;
    index.pageMap.set(pageNum, page);
    
    (page.blocks || []).forEach(block => {
      // Track chapters/sections
      if (block.type === 'heading' || block.isHeading) {
        currentChapter = {
          title: block.text,
          startPage: pageNum,
          endPage: pageNum,
          content: [],
        };
        index.chapters.push(currentChapter);
      }
      
      if (currentChapter) {
        currentChapter.endPage = pageNum;
        if (block.type === 'paragraph') {
          currentChapter.content.push({
            text: block.text,
            page: pageNum,
          });
        }
      }
      
      // Index text for search
      if (block.text) {
        const words = block.text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        words.forEach(word => {
          if (!index.textIndex.has(word)) {
            index.textIndex.set(word, []);
          }
          index.textIndex.get(word).push({
            page: pageNum,
            text: block.text,
            type: block.type,
          });
        });
      }
      
      // Detect special entities
      detectAndIndexEntities(block.text, pageNum, index.entities);
    });
  });
  
  return index;
}

/**
 * Detect and index special entities (Ayah, Surah, Dua, etc.)
 * @param {string} text - Text block
 * @param {number} page - Page number
 * @param {object} entities - Entities collection
 */
function detectAndIndexEntities(text, page, entities) {
  if (!text) return;
  
  // Detect Ayah references (e.g., "Ayah 2:255", "آية ٢:٢٥٥")
  const ayahPattern = /\b(?:ayah|آية|آيات)\s*[:\-]?\s*\d+[:\-]?\d*/gi;
  const ayahMatches = text.match(ayahPattern);
  if (ayahMatches) {
    ayahMatches.forEach(match => {
      entities.ayahs.push({ reference: match, page, context: text.substring(0, 100) });
    });
  }
  
  // Detect Surah references
  const surahPattern = /\b(?:surah|سورة)\s*[:\-]?\s*[\w\u0600-\u06FF]+/gi;
  const surahMatches = text.match(surahPattern);
  if (surahMatches) {
    surahMatches.forEach(match => {
      entities.surahs.push({ reference: match, page, context: text.substring(0, 100) });
    });
  }
  
  // Detect Dua references
  const duaPattern = /\b(?:dua|دعاء|دعا)\b/gi;
  if (duaPattern.test(text)) {
    entities.duas.push({ page, text: text.substring(0, 200), context: text });
  }
  
  // Detect Wazifa references
  const wazifaPattern = /\b(?:wazifa|وظيفة|وظائف|wazaif)\b/gi;
  if (wazifaPattern.test(text)) {
    entities.wazifas.push({ page, text: text.substring(0, 200), context: text });
  }
  
  // Detect Amal references
  const amalPattern = /\b(?:amal|عمل|أعمال)\b/gi;
  if (amalPattern.test(text)) {
    entities.amals.push({ page, text: text.substring(0, 200), context: text });
  }
  
  // Detect numbers (standalone significant numbers)
  const numberPattern = /\b\d{2,}\b/g;
  const numberMatches = text.match(numberPattern);
  if (numberMatches) {
    numberMatches.forEach(match => {
      entities.numbers.push({ value: match, page, context: text.substring(0, 100) });
    });
  }
  
  // Detect symbols/special characters
  const symbolPattern = /[☆★◉●○■□▪▫✦✧⊕⊗⊘]/g;
  const symbolMatches = text.match(symbolPattern);
  if (symbolMatches) {
    entities.symbols.push({ symbols: symbolMatches, page, context: text.substring(0, 100) });
  }
}

/**
 * Search knowledge index for query
 * @param {string} query - User search query
 * @param {object} index - Knowledge index
 * @returns {array} Matching results
 */
export function searchKnowledge(query, index) {
  if (!query || !index) return [];
  
  const queryLower = query.toLowerCase().trim();
  const results = [];
  const seen = new Set();
  
  // Direct text search
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  queryWords.forEach(word => {
    // Exact word match
    if (index.textIndex.has(word)) {
      index.textIndex.get(word).forEach(match => {
        const key = `${match.page}-${match.text.substring(0, 50)}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            type: 'text_match',
            relevance: 1.0,
            page: match.page,
            text: match.text,
            matchType: 'exact_word',
          });
        }
      });
    }
    
    // Partial match
    for (const [indexedWord, matches] of index.textIndex.entries()) {
      if (indexedWord.includes(word) || word.includes(indexedWord)) {
        matches.forEach(match => {
          const key = `${match.page}-${match.text.substring(0, 50)}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              type: 'text_match',
              relevance: 0.7,
              page: match.page,
              text: match.text,
              matchType: 'partial',
            });
          }
        });
      }
    }
  });
  
  // Entity search
  searchEntities(query, index.entities, results, seen);
  
  // Chapter search
  index.chapters.forEach(chapter => {
    if (chapter.title.toLowerCase().includes(queryLower)) {
      results.push({
        type: 'chapter',
        relevance: 0.9,
        chapter: chapter.title,
        startPage: chapter.startPage,
        endPage: chapter.endPage,
      });
    }
  });
  
  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);
  
  return results.slice(0, 50); // Limit results
}

/**
 * Search entities for query matches
 */
function searchEntities(query, entities, results, seen) {
  const queryLower = query.toLowerCase();
  
  Object.entries(entities).forEach(([type, items]) => {
    items.forEach(item => {
      const searchText = JSON.stringify(item).toLowerCase();
      if (searchText.includes(queryLower)) {
        const key = `${type}-${item.page}-${JSON.stringify(item).substring(0, 50)}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            type: 'entity',
            entityType: type,
            relevance: 0.85,
            page: item.page,
            data: item,
          });
        }
      }
    });
  });
}

/**
 * Get context around a match (before and after)
 * @param {number} page - Page number
 * @param {string} text - Matched text
 * @param {object} index - Knowledge index
 * @returns {object} Context with before/after
 */
export function getContextForMatch(page, text, index) {
  const pageData = index.pageMap.get(page);
  if (!pageData) return { before: '', after: '' };
  
  const blocks = pageData.blocks || [];
  const matchIndex = blocks.findIndex(b => b.text === text);
  
  if (matchIndex === -1) return { before: '', after: '' };
  
  // Get 2 blocks before and after
  const before = blocks.slice(Math.max(0, matchIndex - 2), matchIndex)
    .map(b => b.text).join(' ');
  
  const after = blocks.slice(matchIndex + 1, Math.min(blocks.length, matchIndex + 3))
    .map(b => b.text).join(' ');
  
  return { before, after };
}

/**
 * Generate explanation based ONLY on PDF content
 * @param {array} results - Search results
 * @param {string} query - Original query
 * @returns {string} Explanation text
 */
export function generateExplanation(results, query) {
  if (!results || results.length === 0) {
    return 'No information found in the uploaded PDF for this query.';
  }
  
  const relevantTexts = results
    .filter(r => r.type === 'text_match')
    .slice(0, 5)
    .map(r => r.text)
    .join('\n\n');
  
  return `Based on the uploaded PDF, here is what was found:\n\n${relevantTexts}`;
}

/**
 * Get related sections from same PDF
 * @param {number} page - Current page
 * @param {object} index - Knowledge index
 * @returns {array} Related page references
 */
export function getRelatedSections(page, index) {
  const pageData = index.pageMap.get(page);
  if (!pageData) return [];
  
  const related = [];
  
  // Find same chapter
  const chapter = index.chapters.find(c => 
    page >= c.startPage && page <= c.endPage
  );
  
  if (chapter) {
    // Add other pages in same chapter
    for (let p = chapter.startPage; p <= chapter.endPage; p++) {
      if (p !== page) {
        related.push({
          page: p,
          reason: 'Same chapter: ' + chapter.title,
        });
      }
    }
  }
  
  // Find pages with similar content
  const pageBlocks = pageData.blocks || [];
  const pageWords = new Set(
    pageBlocks.flatMap(b => (b.text || '').toLowerCase().split(/\s+/))
  );
  
  index.pageMap.forEach((otherPage, otherPageNum) => {
    if (otherPageNum === page) return;
    
    const otherBlocks = otherPage.blocks || [];
    const otherWords = new Set(
      otherBlocks.flatMap(b => (b.text || '').toLowerCase().split(/\s+/))
    );
    
    // Calculate word overlap
    const overlap = [...pageWords].filter(w => otherWords.has(w)).length;
    if (overlap > 5) {
      related.push({
        page: otherPageNum,
        reason: `${overlap} common terms`,
      });
    }
  });
  
  return related.slice(0, 10);
}

/**
 * Validate extraction completeness
 * @param {object} extraction - Extraction result
 * @returns {object} Validation report
 */
export function validateExtraction(extraction) {
  const report = {
    totalPages: extraction.pages?.length || 0,
    totalBlocks: 0,
    hasHeadings: false,
    hasParagraphs: false,
    hasTables: false,
    missingContent: [],
    isValid: true,
  };
  
  (extraction.pages || []).forEach(page => {
    const blocks = page.blocks || [];
    report.totalBlocks += blocks.length;
    
    if (blocks.some(b => b.type === 'heading')) report.hasHeadings = true;
    if (blocks.some(b => b.type === 'paragraph')) report.hasParagraphs = true;
    if (blocks.some(b => b.type === 'table')) report.hasTables = true;
    
    if (blocks.length === 0) {
      report.missingContent.push(page.pageNumber);
    }
  });
  
  if (report.totalBlocks === 0) {
    report.isValid = false;
    report.error = 'No content extracted from PDF';
  }
  
  return report;
}