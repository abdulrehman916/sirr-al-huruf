import { useState, useCallback } from 'react';
import PageLayout from '../components/PageLayout';
import PageTitle from '../components/PageTitle';
import SirrUpload from '../components/sirr/SirrUpload';
import SirrResults from '../components/sirr/SirrResults';
import SirrSectionViewer from '../components/sirr/SirrSectionViewer';
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
  });

  const [uploadedFile, setUploadedFile] = useState(initialState.uploadedFile);
  const [analysisResult, setAnalysisResult] = useState(initialState.analysisResult);
  const [selectedSection, setSelectedSection] = useState(initialState.selectedSection);
  const [isAnalyzing, setIsAnalyzing] = useState(initialState.isAnalyzing);

  // Persist state
  useState(() => {
    setPageState(PAGE_KEY, { uploadedFile, analysisResult, selectedSection, isAnalyzing });
  });

  const handleFileUploaded = useCallback((file) => {
    setUploadedFile(file);
    setSelectedSection(null);
  }, []);

  const handleAnalysisComplete = useCallback(async (pdfUrl) => {
    setIsAnalyzing(true);
    
    try {
      // Call backend function to analyze PDF
      const response = await base44.functions.invoke('analyzeSirrPDF', { pdfUrl });
      
      if (response.data?.success) {
        setAnalysisResult(response.data.result);
      } else {
        throw new Error(response.data?.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('PDF analysis error:', err);
      // For now, create mock result for testing
      setAnalysisResult({
        document: {
          title: uploadedFile?.name || 'Document',
          totalPages: 10,
        },
        sections: [
          {
            id: 'section-1',
            title: 'Introduction',
            pageNumber: 1,
            content: [
              {
                text: 'This is a sample introduction section extracted from the PDF. The actual content will be displayed here after backend analysis is implemented.',
                type: 'paragraph',
                pageNumber: 1,
                language: 'english',
              },
            ],
          },
          {
            id: 'section-2',
            title: 'Chapter One',
            pageNumber: 3,
            content: [
              {
                text: 'This is the first chapter content. The backend function will extract real content from the uploaded PDF.',
                type: 'paragraph',
                pageNumber: 3,
                language: 'english',
              },
            ],
          },
        ],
        keyConcepts: ['Concept 1', 'Concept 2', 'Concept 3'],
        languages: ['english', 'arabic'],
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedFile]);

  const handleSelectSection = useCallback((section) => {
    setSelectedSection(section);
  }, []);

  const handleBackToResults = useCallback(() => {
    setSelectedSection(null);
  }, []);

  return (
    <PageLayout>
      <div className="space-y-4">
        {/* Header */}
        <PageTitle
          arabic="السر"
          latin="SIRR"
          subtitle="PDF Knowledge Analysis"
          icon="📖"
        />

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
              Analyzing PDF...
            </p>
            <p className="font-inter text-xs mt-2" style={{ color: 'rgba(255,255,255,0.30)' }}>
              Extracting text, tables, and structure
            </p>
          </div>
        )}

        {/* Results or Section Viewer */}
        {!isAnalyzing && (
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