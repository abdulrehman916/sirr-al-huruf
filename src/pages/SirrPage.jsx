import { useState, useMemo, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import SirrHub from "@/components/sirr/SirrHub";
import SirrSectionView from "@/components/sirr/SirrSectionView";
import SirrTopicView from "@/components/sirr/SirrTopicView";
import SirrSourceLibrary from "@/components/sirr/SirrSourceLibrary";
import { getSirrKnowledgeStructure } from "@/lib/sirrKnowledgeClassifier";
import { fetchManuscriptBooks, fetchManuscriptEntries, mergeEntriesIntoStructure } from "@/lib/manuscriptLibrarySync";

export default function SirrPage() {
  const [language, setLanguage] = useState("ml");
  const [view, setView] = useState("hub"); // 'hub' | 'section' | 'topic' | 'library'
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [databaseBooks, setDatabaseBooks] = useState([]);
  const [databaseEntries, setDatabaseEntries] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  const baseStructure = useMemo(() => getSirrKnowledgeStructure(), []);
  const structure = useMemo(
    () => mergeEntriesIntoStructure(baseStructure, databaseEntries),
    [baseStructure, databaseEntries]
  );

  useEffect(() => {
    let cancelled = false;
    setLoadingDb(true);
    Promise.all([fetchManuscriptBooks(), fetchManuscriptEntries()])
      .then(([books, entries]) => {
        if (!cancelled) {
          setDatabaseBooks(books);
          setDatabaseEntries(entries);
          setLoadingDb(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingDb(false);
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
          />
        )}

        {view === "topic" && selectedTopic && selectedSection && (
          <SirrTopicView
            topic={selectedTopic}
            section={selectedSection}
            onBack={handleBackToSection}
            language={language}
          />
        )}

        {view === "library" && (
          <SirrSourceLibrary
            sourceLibrary={structure.sourceLibrary}
            databaseBooks={databaseBooks}
            loadingDb={loadingDb}
            onBack={handleBackToHub}
            language={language}
          />
        )}
      </div>
    </PageLayout>
  );
}