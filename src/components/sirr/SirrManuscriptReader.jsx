// ═══════════════════════════════════════════════════════════════
// SIRR MANUSCRIPT READER — MANUSCRIPT-DRIVEN READER
// ═══════════════════════════════════════════════════════════════
// Clean, production-ready reader. Displays ONLY imported manuscripts.
//
//   • No hardcoded Sirr 1-7 sections, categories, demo content, or counts.
//   • Each imported PDF = one Book, shown exactly as imported.
//   • Inside every book, entries render in exact manuscript order
//     (entry_order) with original titles, verbatim Arabic, Malayalam
//     translation, and a full reference footer.
//   • Import is the only non-manuscript action (opens the existing
//     OneDrive browser, which is reused unchanged).
//
// The manuscript is the ONLY source of truth. Nothing is fabricated.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { ChevronLeft, BookOpen, FileText, Globe, Upload, Sparkles } from "lucide-react";
import SirrManuscriptEntry from "./SirrManuscriptEntry";
import SirrOneDriveBrowser from "./SirrOneDriveBrowser";

export default function SirrManuscriptReader({ books, entries, headings, loading, onRefresh, language, setLanguage }) {
  const [view, setView] = useState("list");     // 'list' | 'book' | 'import'
  const [selectedBook, setSelectedBook] = useState(null);
  const isMl = language === "ml";

  // heading_id → heading record (for original manuscript titles)
  const headingMap = useMemo(() => {
    const m = new Map();
    for (const h of headings || []) m.set(h.heading_id, h);
    return m;
  }, [headings]);

  const selectedEntries = useMemo(() => {
    if (!selectedBook) return [];
    return (entries || [])
      .filter((e) => e.book_id === selectedBook.book_id)
      .sort((a, b) => (a.entry_order || 0) - (b.entry_order || 0));
  }, [entries, selectedBook]);

  // ── Import view — reuse existing OneDrive browser (unchanged) ──
  if (view === "import") {
    return (
      <SirrOneDriveBrowser
        onBack={() => setView(books.length ? "list" : "list")}
        onImported={() => { onRefresh?.(); setView("list"); setSelectedBook(null); }}
        language={language}
      />
    );
  }

  // ── Book view — entries in manuscript order ──
  if (view === "book" && selectedBook) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 pt-1">
          <button onClick={() => { setView("list"); setSelectedBook(null); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <ChevronLeft className="w-4 h-4" /> {isMl ? "ഗ്രന്ഥങ്ങളിലേക്ക്" : "Back to Books"}
          </button>
          <LangToggle language={language} setLanguage={setLanguage} isMl={isMl} />
        </div>

        {/* Book header — original title, author, edition */}
        <div className="text-center pb-2">
          {hasText(selectedBook.book_title_ar) && (
            <h1 className="font-amiri text-2xl font-bold" style={{ color: "#D4AF37", direction: "rtl" }}>
              {selectedBook.book_title_ar}
            </h1>
          )}
          <h1 className="font-inter text-lg font-bold" style={{ color: "rgba(255,255,255,0.90)" }}>
            {selectedBook.book_title || selectedBook.book_id}
          </h1>
          {hasText(selectedBook.author) && (
            <p className="font-inter text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {selectedBook.author}
              {hasText(selectedBook.edition) ? ` · ${selectedBook.edition}` : ""}
              {hasText(selectedBook.publication_year) ? ` · ${selectedBook.publication_year}` : ""}
            </p>
          )}
          <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(212,175,55,0.55)" }}>
            {selectedEntries.length} {isMl ? "വിഭാഗങ്ങൾ" : "sections"} · {selectedBook.total_pages || "?"} {isMl ? "പേജുകൾ" : "pages"}
          </p>
        </div>

        {/* Entries in exact manuscript order */}
        {selectedEntries.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(255,255,255,0.20)" }} />
            <p className={`text-xs ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.35)" }}>
              {isMl ? "ഈ ഗ്രന്ഥത്തിൽ ഇറക്കുമതി ചെയ്ത വിഭാഗങ്ങളില്ല." : "No imported sections in this book."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedEntries.map((entry) => (
              <SirrManuscriptEntry
                key={entry.entry_id || entry._id}
                entry={entry}
                book={selectedBook}
                heading={entry.heading_id ? headingMap.get(entry.heading_id) : null}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── List view — imported books + import action ──
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "rgba(212,175,55,0.60)" }} />
          <h1 className="font-inter text-sm font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
            {isMl ? "ഗ്രന്ഥശേഖരം" : "Manuscript Library"}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <LangToggle language={language} setLanguage={setLanguage} isMl={isMl} />
          <button onClick={() => setView("import")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold btn-gold">
            <Upload className="w-3.5 h-3.5" /> {isMl ? "ഗ്രന്ഥം ഇറക്കുമതി" : "Import"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-7 h-7 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        // Empty production-ready container — waiting for manuscript content
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(212,175,55,0.25)" }} />
          <p className={`text-sm font-bold ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.45)" }}>
            {isMl ? "ഇറക്കുമതി ചെയ്ത ഗ്രന്ഥങ്ങളൊന്നുമില്ല" : "No manuscript imported yet"}
          </p>
          <p className={`text-xs mt-1 ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.30)" }}>
            {isMl ? "ഒരു ഗ്രന്ഥം ഇറക്കുമതി ചെയ്യുക" : "Import a manuscript to begin"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {books.map((book) => {
            const bookEntryCount = (entries || []).filter((e) => e.book_id === book.book_id).length;
            const exColor = book.extraction_status === "completed" ? "#4ADE80"
              : book.extraction_status === "failed" ? "#F87171" : "#FBBF24";
            return (
              <button key={book.book_id || book._id}
                onClick={() => { setSelectedBook(book); setView("book"); }}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
                  border: "1px solid rgba(212,175,55,0.22)",
                }}>
                <BookOpen className="w-5 h-5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.50)" }} />
                <div className="flex-1 min-w-0">
                  {hasText(book.book_title_ar) && (
                    <p className="font-amiri text-base font-bold truncate" style={{ color: "rgba(212,175,55,0.70)", direction: "rtl" }}>
                      {book.book_title_ar}
                    </p>
                  )}
                  <p className="font-inter text-sm font-bold truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {book.book_title || book.book_id}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {hasText(book.author) && (
                      <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>{book.author}</span>
                    )}
                    <span className="flex items-center gap-0.5 font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <FileText className="w-2.5 h-2.5" /> {book.total_pages || "?"} {isMl ? "പേജ്" : "pg"}
                    </span>
                    <span className="flex items-center gap-0.5 font-inter text-[10px]" style={{ color: "rgba(129,140,248,0.55)" }}>
                      <Sparkles className="w-2.5 h-2.5" /> {bookEntryCount} {isMl ? "വിഭാഗം" : "sections"}
                    </span>
                    {hasText(book.language) && (
                      <span className="flex items-center gap-0.5 font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        <Globe className="w-2.5 h-2.5" /> {book.language}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-inter text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: `${exColor}15`, color: exColor, border: `1px solid ${exColor}40` }}>
                  {book.extraction_status || "—"}
                </span>
                <ChevronLeft className="w-4 h-4 flex-shrink-0 rotate-180" style={{ color: "rgba(212,175,55,0.60)" }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LangToggle({ language, setLanguage, isMl }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setLanguage("ml")}
        className={`px-2 py-1 rounded-md text-[10px] font-bold ${language === "ml" ? "btn-gold" : ""}`}
        style={language !== "ml" ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.10)" } : {}}>
        മലയാളം
      </button>
      <button onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded-md text-[10px] font-bold ${language === "en" ? "btn-gold" : ""}`}
        style={language !== "en" ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.10)" } : {}}>
        EN
      </button>
    </div>
  );
}

function hasText(v) { return v != null && String(v).trim().length > 0; }