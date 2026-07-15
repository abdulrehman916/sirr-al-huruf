// ═══════════════════════════════════════════════════════════════
// SIRR PAGE — CLEAN MANUSCRIPT-DRIVEN READER
// ═══════════════════════════════════════════════════════════════
// Production-ready container. Displays ONLY imported manuscripts.
//
// Removed: all hardcoded Sirr 1-7 sections, categories, introductions,
// subtitles, counters, icons, placeholder/demo content, old layouts,
// expandable sections, and old manuscript displays.
//
// The page builds exclusively from imported PDF manuscripts via the
// existing read-only data fetchers. Nothing is invented or generated.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import SirrManuscriptReader from "@/components/sirr/SirrManuscriptReader";
import { fetchManuscriptBooks, fetchManuscriptEntries, fetchManuscriptHeadings } from "@/lib/manuscriptLibrarySync";

export default function SirrPage() {
  const [language, setLanguage] = useState("ml");
  const [books, setBooks] = useState([]);
  const [entries, setEntries] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = () => {
    setLoading(true);
    Promise.all([fetchManuscriptBooks(), fetchManuscriptEntries(), fetchManuscriptHeadings()])
      .then(([b, e, h]) => {
        setBooks(b);
        setEntries(e);
        setHeadings(h);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchManuscriptBooks(), fetchManuscriptEntries(), fetchManuscriptHeadings()])
      .then(([b, e, h]) => {
        if (!cancelled) {
          setBooks(b);
          setEntries(e);
          setHeadings(h);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <PageLayout>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4">
        <SirrManuscriptReader
          books={books}
          entries={entries}
          headings={headings}
          loading={loading}
          onRefresh={loadAll}
          language={language}
          setLanguage={setLanguage}
        />
      </div>
    </PageLayout>
  );
}