// ═══════════════════════════════════════════════════════════════
// SIRR MANUSCRIPT READER — SIRR-ISOLATED STORE
// ═══════════════════════════════════════════════════════════════
// Reads ONLY from the SIRR-dedicated entities (SirrManuscriptBook /
// SirrManuscriptEntry). It NEVER connects to the global ManuscriptBook
// or ManuscriptEntry collections used by Astro Clock, Reference
// Library, or Import History.
//
// The SIRR page therefore starts COMPLETELY EMPTY. No placeholder
// books, no old imports, no cross-module manuscripts are shown. A book
// appears here ONLY after a PDF is uploaded specifically for the SIRR
// module (written into SirrManuscriptBook by SIRR-only logic).
//
// Books → entries render in exact manuscript order (entry_order) with
// original titles, verbatim Arabic, Malayalam translation, and a full
// reference footer. Nothing is invented.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, BookOpen, FileText, Globe, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SirrManuscriptEntry from "./SirrManuscriptEntry";

// SIRR-ISOLATED fetchers — query ONLY the SIRR-dedicated entities.
async function fetchSirrBooks() {
  try {
    const books = await base44.entities.SirrManuscriptBook.list("-created_date", 500);
    return books || [];
  } catch {
    return [];
  }
}
async function fetchSirrEntries() {
  try {
    const entries = await base44.entities.SirrManuscriptEntry.list("-created_date", 1000);
    return entries || [];
  } catch {
    return [];
  }
}

function hasText(v) { return v != null && String(v).trim().length > 0; }

export default function SirrManuscriptReader({ language, setLanguage }) {
  const [books, setBooks] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");     // 'list' | 'book'
  const [selectedBook, setSelectedBook] = useState(null);
  const isMl = language === "ml";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchSirrBooks(), fetchSirrEntries()])
      .then(([b, e]) => {
        if (!cancelled) { setBooks(b); setEntries(e); setLoading(false); }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const selectedEntries = useMemo(() => {
    if (!selectedBook) return [];
    return entries
      .filter((e) => e.sirr_book_id === selectedBook.sirr_book_id)
      .sort((a, b) => (a.entry_order || 0) - (b.entry_order || 0));
  }, [entries, selectedBook]);

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
            {selectedBook.book_title || selectedBook.sirr_book_id}
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
                key={entry.sirr_entry_id || entry._id}
                entry={entry}
                book={selectedBook}
                heading={null}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── List view — SIRR-only books (starts empty) ──
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "rgba(212,175,55,0.60)" }} />
          <h1 className="font-inter text-sm font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
            {isMl ? "സിറർ ഗ്രന്ഥശേഖരം" : "Sirr Manuscript Library"}
          </h1>
        </div>
        <LangToggle language={language} setLanguage={setLanguage} isMl={isMl} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-7 h-7 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        // Empty production-ready container — waiting for SIRR manuscript upload.
        // No placeholder books, no global manuscripts, nothing fabricated.
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(212,175,55,0.25)" }} />
          <p className={`text-sm font-bold ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.45)" }}>
            {isMl ? "സിറർ ഗ്രന്ഥങ്ങളൊന്നുമില്ല" : "No Sirr manuscripts"}
          </p>
          <p className={`text-xs mt-1 ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.30)" }}>
            {isMl ? "സിറർ ഘടകത്തിനായി ഒരു ഗ്രന്ഥം ഇറക്കുമതി ചെയ്യുക" : "Upload a manuscript for the Sirr module to begin"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {books.map((book) => {
            const bookEntryCount = entries.filter((e) => e.sirr_book_id === book.sirr_book_id).length;
            const exColor = book.extraction_status === "completed" ? "#4ADE80"
              : book.extraction_status === "failed" ? "#F87171" : "#FBBF24";
            return (
              <button key={book.sirr_book_id || book._id}
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
                    {book.book_title || book.sirr_book_id}
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