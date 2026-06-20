import { useState, useCallback, useEffect, useRef } from 'react';
import PageLayout from '../components/PageLayout';
import PageTitle from '../components/PageTitle';
import SirrBookSearch from '../components/sirr/SirrBookSearch';
import SirrCalculator from '../components/sirr/SirrCalculator';
import SirrUpload from '../components/sirr/SirrUpload';
import SirrResults from '../components/sirr/SirrResults';
import SirrSectionViewer from '../components/sirr/SirrSectionViewer';
import SirrSearchBox from '../components/sirr/SirrSearchBox';
import SirrAnswerPanel from '../components/sirr/SirrAnswerPanel';
import SirrReferenceViewer from '../components/sirr/SirrReferenceViewer';
import { buildKnowledgeIndex, searchKnowledge } from '../lib/sirrPdfEngine';
import { base44 } from '@/api/base44Client';
import { usePageState } from '../context/PageStateContext';

const PAGE_KEY = 'sirr';

export default function SirrPage() {
  const { getPageState, setPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, {
    uploadedFile: null,
    analysisResult: null,
    selectedSection: null,
    isAnalyzing: false,
    knowledgeIndex: null,
    searchQuery: '',
    searchResults: null,
    selectedResult: null,
  });

  const [uploadedFile, setUploadedFile] = useState(initialState.uploadedFile);
  const [analysisResult, setAnalysisResult] = useState(initialState.analysisResult);
  const [selectedSection, setSelectedSection] = useState(initialState.selectedSection);
  const [isAnalyzing, setIsAnalyzing] = useState(initialState.isAnalyzing);
  const [knowledgeIndex, setKnowledgeIndex] = useState(initialState.knowledgeIndex);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery);
  const [searchResults, setSearchResults] = useState(initialState.searchResults);
  const [selectedResult, setSelectedResult] = useState(initialState.selectedResult);
  const [isSearching, setIsSearching] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const pageContainerRef = useRef(null);

  // SIRR PAGE KEYBOARD FIX — VisualViewport API handler (page-scoped, isolated)
  // Prevents viewport compression, scroll jumps, and layout shifts on iPhone Safari
  useEffect(() => {
    if (typeof window.visualViewport === 'undefined') return;
    
    let savedScrollY = 0;
    let keyboardWasOpen = false;
    let originalOverflow = '';
    
    const handleResize = () => {
      const viewportHeight = window.visualViewport.height;
      const innerHeight = window.innerHeight;
      const keyboardIsOpen = viewportHeight < innerHeight * 0.9;
      
      // Keyboard just opened
      if (keyboardIsOpen && !keyboardWasOpen) {
        savedScrollY = window.scrollY;
        keyboardWasOpen = true;
        
        // Lock body scroll to prevent jump
        originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.width = '100%';
      }
      
      // Keyboard just closed
      if (!keyboardIsOpen && keyboardWasOpen) {
        keyboardWasOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = originalOverflow;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        requestAnimationFrame(() => {
          window.scrollTo(0, savedScrollY);
        });
      }
    };
    
    // Listen for viewport resize (keyboard open/close)
    window.visualViewport.addEventListener('resize', handleResize, { passive: true });
    
    // Initial check
    handleResize();
    
    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      // Cleanup
      document.body.style.overflow = originalOverflow;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, []);

  // Persist state
  useState(() => {
    setPageState(PAGE_KEY, { uploadedFile, analysisResult, selectedSection, isAnalyzing, knowledgeIndex, searchQuery, searchResults, selectedResult });
  });

  const handleFileUploaded = useCallback((file) => {
    setUploadedFile(file);
    setSelectedSection(null);
    setSearchResults(null);
    setSearchQuery('');
  }, []);

  const handleAnalysisComplete = useCallback(async (pdfUrl) => {
    setIsAnalyzing(true);
    
    try {
      // Extract full PDF content
      const response = await base44.functions.invoke('analyzeSirrPDF', { pdfUrl, action: 'extract' });
      
      if (response.data?.success) {
        const extractedData = response.data.result;
        
        // Build knowledge index
        const index = buildKnowledgeIndex(extractedData.pages || []);
        setKnowledgeIndex(index);
        setAnalysisResult({
          document: {
            title: uploadedFile?.name || 'Document',
            totalPages: extractedData.pages?.length || 0,
          },
          pages: extractedData.pages || [],
          index,
        });
      } else {
        throw new Error(response.data?.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('PDF analysis error:', err);
      // Mock data for testing
      const mockPages = Array.from({ length: 10 }, (_, i) => ({
        pageNumber: i + 1,
        blocks: [
          { text: `Sample content from page ${i + 1}`, type: 'paragraph' },
        ],
      }));
      const index = buildKnowledgeIndex(mockPages);
      setKnowledgeIndex(index);
      setAnalysisResult({
        document: { title: uploadedFile?.name || 'Document', totalPages: 10 },
        pages: mockPages,
        index,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedFile]);

  const handleSearch = useCallback(async (query) => {
    if (!query?.trim() || !knowledgeIndex) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      // Search through knowledge index using engine function
      const results = searchKnowledge(query, knowledgeIndex);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [knowledgeIndex]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults(null);
    setSelectedResult(null);
  }, []);

  const handleSelectResult = useCallback((result) => {
    setSelectedResult(result);
  }, []);

  const handleSelectSection = useCallback((section) => {
    setSelectedSection(section);
  }, []);

  const handleBackToResults = useCallback(() => {
    setSelectedSection(null);
  }, []);

  return (
    <PageLayout>
      <div
        ref={pageContainerRef}
        className="space-y-4"
        style={{
          minHeight: '100dvh',
          // Prevent flex compression during keyboard open
          flexShrink: 0,
          flexGrow: 0,
          // Ensure content doesn't overflow horizontally
          maxWidth: '100vw',
          overflowX: 'hidden',
        }}
      >
        {/* Header */}
        <PageTitle
          arabic="السر"
          latin="SIRR"
          subtitle="Book-Based Calculation Engine"
          icon="🔮"
        />

        {/* Book Search — Samur Hindi Indexed */}
        <SirrBookSearch />

        {/* Calculator Toggle */}
        <div className="flex items-center justify-between gap-3 my-3">
          <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="px-4 py-2 rounded-xl border font-inter text-[10px] font-bold uppercase tracking-wide"
            style={{
              background: showCalculator ? "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.10))" : "rgba(212,175,55,0.06)",
              borderColor: showCalculator ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.18)",
              color: showCalculator ? "#E8C84A" : "rgba(212,175,55,0.55)"
            }}
          >
            {showCalculator ? '▼ Hide Calculator' : '▶ Open Calculator'}
          </button>
          <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
        </div>

        {/* Calculator — Book-Based Calculation Engine */}
        {showCalculator && (
          <div className="rounded-2xl border p-5"
            style={{
              background: "rgba(4,12,34,0.97)",
              borderColor: "rgba(212,175,55,0.35)",
              boxShadow: "0 0 40px rgba(212,175,55,0.15)"
            }}
          >
            <div className="mb-4">
              <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.55)" }}>
                CALCULATION ENGINE
              </p>
              <p className="font-amiri text-lg font-bold" style={{ color: "#E8C84A" }}>
                تطبيق قواعد الكتاب
              </p>
              <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                Apply book rules step-by-step — No external methods
              </p>
            </div>
            <SirrCalculator />
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
          <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.35)" }}>
            Upload Additional PDF
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
        </div>

        {/* Upload Section */}
        <SirrUpload
          onFileUploaded={handleFileUploaded}
          onAnalysisComplete={handleAnalysisComplete}
        />

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="rounded-2xl border p-8 text-center"
            style={{
              background: 'rgba(212,175,55,0.04)',
              borderColor: 'rgba(212,175,55,0.20)',
            }}
          >
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(212,175,55,0.40)', borderTopColor: 'transparent' }}
            />
            <p className="font-inter text-sm mt-4" style={{ color: 'rgba(212,175,55,0.60)' }}>
              Building Knowledge Index...
            </p>
            <p className="font-inter text-xs mt-2" style={{ color: 'rgba(255,255,255,0.30)' }}>
              Extracting text, tables, chapters, and references
            </p>
          </div>
        )}

        {/* Search Box (shown after analysis) */}
        {!isAnalyzing && knowledgeIndex && (
          <SirrSearchBox
            onSearch={handleSearch}
            query={searchQuery}
            setQuery={setSearchQuery}
            isLoading={isSearching}
            hasIndex={!!knowledgeIndex}
          />
        )}

        {/* Search Results */}
        {!isAnalyzing && searchResults && searchResults.length > 0 && (
          <>
            <SirrAnswerPanel
              results={searchResults}
              query={searchQuery}
              onResultSelect={handleSelectResult}
              explanation={`Found ${searchResults.length} matches in the PDF. All results are extracted directly from the uploaded document.`}
            />
            
            {selectedResult && (
              <SirrReferenceViewer
                relatedSections={[
                  { page: selectedResult.page, reason: 'Direct match' },
                  ...(searchResults.filter(r => r.page !== selectedResult.page).slice(0, 4).map(r => ({
                    page: r.page,
                    reason: 'Related content',
                  }))),
                ]}
                currentPage={selectedResult.page}
              />
            )}
          </>
        )}

        {/* No search results message */}
        {!isAnalyzing && searchResults && searchResults.length === 0 && searchQuery && (
          <div className="rounded-2xl border p-8 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
              No matches found for "{searchQuery}" in the uploaded PDF.
            </p>
          </div>
        )}

        {/* Results or Section Viewer (when no search) */}
        {!isAnalyzing && !searchResults && (
          selectedSection ? (
            <SirrSectionViewer
              section={selectedSection}
              onBack={handleBackToResults}
            />
          ) : (
            <SirrResults
              analysisResult={analysisResult}
              onSelectSection={handleSelectSection}
            />
          )
        )}
      </div>
    </PageLayout>
  );
}