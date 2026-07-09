import { useState, useMemo, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import SirrHub from "@/components/sirr/SirrHub";
import SirrSectionView from "@/components/sirr/SirrSectionView";
import SirrTopicView from "@/components/sirr/SirrTopicView";
import SirrSourceLibrary from "@/components/sirr/SirrSourceLibrary";
import SirrValidationReport from "@/components/sirr/SirrValidationReport";
import { getSirrKnowledgeStructure } from "@/lib/sirrKnowledgeClassifier";
import { fetchManuscriptBooks, fetchManuscriptEntries, fetchManuscriptHeadings, mergeEntriesIntoStructure, buildHeadingTree } from "@/lib/manuscriptLibrarySync";
import { fetchPreparations } from "@/lib/preparationLibrarySync";
import SirrPreparationLibrary from "@/components/sirr/SirrPreparationLibrary";
import SirrPreparationDetail from "@/components/sirr/SirrPreparationDetail";
import SirrOneDriveBrowser from "@/components/sirr/SirrOneDriveBrowser";
import SirrOneDriveFolderImporter from "@/components/sirr/SirrOneDriveFolderImporter";
import SirrBookTOC from "@/components/sirr/SirrBookTOC";
import SirrHeadingView from "@/components/sirr/SirrHeadingView";

export default function SirrPage() {
  const [language, setLanguage] = useState("ml");
  const [view, setView] = useState("hub");
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [databaseBooks, setDatabaseBooks] = useState([]);
  const [databaseEntries, setDatabaseEntries] = useState([]);
  const [databaseHeadings, setDatabaseHeadings] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [selectedValidationBook, setSelectedValidationBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedHeading, setSelectedHeading] = useState(null);
  const [headingBreadcrumb, setHeadingBreadcrumb] = useState([]);
  const [preparations, setPreparations] = useState([]);
  const [loadingPreps, setLoadingPreps] = useState(true);
  const [selectedPreparation, setSelectedPreparation] = useState(null);

  const baseStructure = useMemo(() => getSirrKnowledgeStructure(), []);
  const structure = useMemo(
    () => mergeEntriesIntoStructure(baseStructure, databaseEntries),
    [baseStructure, databaseEntries]
  );

  useEffect(() => {
    let cancelled = false;
    setLoadingDb(true);
    Promise.all([fetchManuscriptBooks(), fetchManuscriptEntries(), fetchManuscriptHeadings(), fetchPreparations()])
      .then(([books, entries, headings, preps]) => {
        if (!cancelled) {
          setDatabaseBooks(books);
          setDatabaseEntries(entries);
          setDatabaseHeadings(headings);
          setPreparations(preps);
          setLoadingDb(false);
          setLoadingPreps(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadingDb(false);
          setLoadingPreps(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const selectedSection = structure.sections.find((s) => s.id === selectedSectionId);

  const handleSelectSection = (sectionId) => {
    setSelectedSectionId(sectionId);
    setView("section");
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setView("topic");
  };

  const handleBackToHub = () => {
    setView("hub");
    setSelectedSectionId(null);
    setSelectedTopic(null);
  };

  const handleBackToSection = () => {
    setView("section");
    setSelectedTopic(null);
  };

  const handleSelectLibrary = () => setView("library");

  const handleShowValidationReport = (book) => {
    setSelectedValidationBook(book);
    setView("validation_report");
  };

  const handleOneDriveImported = () => {
    setLoadingDb(true);
    Promise.all([fetchManuscriptBooks(), fetchManuscriptEntries(), fetchManuscriptHeadings()])
      .then(([books, entries, headings]) => {
        setDatabaseBooks(books);
        setDatabaseEntries(entries);
        setDatabaseHeadings(headings);
        setLoadingDb(false);
      })
      .catch(() => setLoadingDb(false));
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setSelectedHeading(null);
    setHeadingBreadcrumb([]);
    setView("book_toc");
  };

  const handleSelectHeading = (heading) => {
    const breadcrumb = [];
    let current = heading;
    while (current) {
      breadcrumb.unshift(current);
      const parentId = current.parent_heading_id;
      current = parentId ? databaseHeadings.find((h) => h.heading_id === parentId) : null;
    }
    setHeadingBreadcrumb(breadcrumb);
    setSelectedHeading(heading);
    setView("heading");
  };

  return (
    <PageLayout>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4">
        {/* Language Switcher — visible on all views */}
        <div className="flex items-center justify-center gap-1.5 py-1 mb-2">
          <button onClick={() => setLanguage("ml")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === "ml" ? "btn-gold" : ""}`}
            style={language !== "ml" ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.10)" } : {}}>
            🇲🇱 മലയാളം
          </button>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>|</span>
          <button onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === "en" ? "btn-gold" : ""}`}
            style={language !== "en" ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.10)" } : {}}>
            🇬🇧 English
          </button>
        </div>

        {/* Views */}
        {view === "hub" && (
          <SirrHub
            structure={structure}
            onSelectSection={handleSelectSection}
            onSelectLibrary={handleSelectLibrary}
            language={language}
          />
        )}

        {view === "section" && selectedSection && (
          <SirrSectionView
            section={selectedSection}
            onSelectTopic={handleSelectTopic}
            onBack={handleBackToHub}
            language={language}
            onSelectPreparations={() => setView("preparation_library")}
          />
        )}

        {view === "topic" && selectedTopic && selectedSection && (
          <SirrTopicView
            topic={selectedTopic}
            section={selectedSection}
            onBack={handleBackToSection}
            language={language}
            onSelectPreparation={(prep) => { setSelectedPreparation(prep); setView("preparation_detail"); }}
          />
        )}

        {view === "library" && (
          <SirrSourceLibrary
            sourceLibrary={structure.sourceLibrary}
            databaseBooks={databaseBooks}
            loadingDb={loadingDb}
            onBack={handleBackToHub}
            onShowValidationReport={handleShowValidationReport}
            onImportFromOneDrive={() => setView("onedrive_browser")}
            onImportFolderFromOneDrive={() => setView("folder_importer")}
            onSelectBook={handleSelectBook}
            language={language}
          />
        )}

        {view === "folder_importer" && (
          <SirrOneDriveFolderImporter
            onBack={() => setView("library")}
            onImported={handleOneDriveImported}
            language={language}
          />
        )}

        {view === "onedrive_browser" && (
          <SirrOneDriveBrowser
            onBack={() => setView("library")}
            onImported={handleOneDriveImported}
            language={language}
          />
        )}

        {view === "book_toc" && selectedBook && (
          <SirrBookTOC
            book={selectedBook}
            headingTree={buildHeadingTree(databaseHeadings.filter((h) => h.book_id === selectedBook.book_id))}
            entries={databaseEntries.filter((e) => e.book_id === selectedBook.book_id)}
            onSelectHeading={handleSelectHeading}
            onBack={() => { setView("library"); setSelectedBook(null); }}
            language={language}
          />
        )}

        {view === "heading" && selectedHeading && selectedBook && (
          <SirrHeadingView
            heading={selectedHeading}
            childHeadings={databaseHeadings
              .filter((h) => h.parent_heading_id === selectedHeading.heading_id)
              .sort((a, b) => (a.heading_order || 0) - (b.heading_order || 0))}
            entries={databaseEntries.filter((e) => e.heading_id === selectedHeading.heading_id)}
            breadcrumb={headingBreadcrumb}
            onSelectHeading={handleSelectHeading}
            onSelectEntry={() => {}}
            onBack={() => { setView("book_toc"); setSelectedHeading(null); }}
            language={language}
            accent="#D4AF37"
          />
        )}

        {view === "validation_report" && selectedValidationBook && (
          <SirrValidationReport
            book={selectedValidationBook}
            onBack={() => { setView("library"); setSelectedValidationBook(null); }}
            language={language}
          />
        )}

        {view === "preparation_library" && (
          <SirrPreparationLibrary
            preparations={preparations}
            loading={loadingPreps}
            onSelectPreparation={(prep) => { setSelectedPreparation(prep); setView("preparation_detail"); }}
            onBack={() => setView("hub")}
            language={language}
            accent="#34D399"
          />
        )}

        {view === "preparation_detail" && selectedPreparation && (
          <SirrPreparationDetail
            preparation={selectedPreparation}
            onBack={() => setView("preparation_library")}
            language={language}
            accent="#34D399"
          />
        )}
      </div>
    </PageLayout>
  );
}