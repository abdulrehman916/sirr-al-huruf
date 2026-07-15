// ═══════════════════════════════════════════════════════════════
// SIRR MANUSCRIPT READER — SIRR-ISOLATED STORE
// ═══════════════════════════════════════════════════════════════
// Reads ONLY from the SIRR-dedicated entities (SirrManuscriptBook /
// SirrManuscriptEntry). NEVER connects to the global ManuscriptBook /
// ManuscriptEntry collections used by Astro Clock, Reference Library,
// Holy Names, or any other module.
//
// Library: Upload button + book cards (Open / Rename / Delete /
// Re-import). Book view: entries in exact manuscript order.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, BookOpen, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SirrManuscriptEntry from "./SirrManuscriptEntry";
import SirrUploadButton from "./SirrUploadButton";
import SirrBookCard from "./SirrBookCard";

async function fetchSirrBooks() {
  try { return (await base44.entities.SirrManuscriptBook.list("-created_date", 500)) || []; }
  catch { return []; }
}
async function fetchSirrEntries() {
  try { return (await base44.entities.SirrManuscriptEntry.list("-created_date", 1000)) || []; }
  catch { return []; }
}

export default function SirrManuscriptReader({ language, setLanguage }) {
  const [books, setBooks] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [selectedBook, setSelectedBook] = useState(null);
  const isMl = language === "ml";

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([fetchSirrBooks(), fetchSirrEntries()])
      .then(([b, e]) => { setBooks(b); setEntries(e); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const selectedEntries = useMemo(() => {
    if (!selectedBook) return [];
    return entries
      .filter((e) => e.sirr_book_id === selectedBook.sirr_book_id)
      .sort((a, b) => (a.entry_order || 0) - (b.entry_order || 0));
  }, [entries, selectedBook]);

  // ── Book view — entries in exact manuscript order ──
  if (view === "book" && selectedBook) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 pt-1">
          <button onClick={() => { setView("list"); setSelectedBook(null); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <ChevronLeft className="w-4 h-4" /> {isMl ? "ഗ്രന്ഥങ്ങളിലേക്ക്" : "Back to Books"}
          </button>
          <LangToggle language={language} setLanguage={setLanguage} />
        </div>

        <div className="text-center pb-2">
          {selectedBook.malayalam_book_name && (
            <h1 className={`text-xl font-bold ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.90)" }}>
              {selectedBook.malayalam_book_name}
            </h1>
          )}
          {selectedBook.book_title_ar && (
            <p className="font-amiri text-lg font-bold" style={{ color: "#D4AF37", direction: "rtl" }}>{selectedBook.book_title_ar}</p>
          )}
          {selectedBook.book_title && selectedBook.book_title !== selectedBook.malayalam_book_name && (
            <p className="font-inter text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{selectedBook.book_title}</p>
          )}
          <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(212,175,55,0.55)" }}>
            {selectedEntries.length} {isMl ? "വിഭാഗങ്ങൾ" : "sections"} · {selectedBook.total_pages || "?"} {isMl ? "പേജുകൾ" : "pages"}
          </p>
        </div>

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

  // ── Library view — SIRR-only books (starts empty) ──
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "rgba(212,175,55,0.60)" }} />
          <h1 className={`text-sm font-bold ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.85)" }}>
            {isMl ? "സിറർ ഗ്രന്ഥശേഖരം" : "Sirr Manuscript Library"}
          </h1>
        </div>
        <LangToggle language={language} setLanguage={setLanguage} />
      </div>

      {/* Upload button — native file picker, SIRR-only ingestion */}
      <SirrUploadButton onUploaded={refresh} language={language} />

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-7 h-7 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-10">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(212,175,55,0.25)" }} />
          <p className={`text-sm font-bold ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.45)" }}>
            {isMl ? "സിറർ ഗ്രന്ഥങ്ങളൊന്നുമില്ല" : "No Sirr manuscripts"}
          </p>
          <p className={`text-xs mt-1 ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.30)" }}>
            {isMl ? "മുകളിൽ നിന്ന് ഒരു PDF ഇറക്കുമതി ചെയ്യുക" : "Upload a PDF above to begin"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {books.map((book) => {
            const entryCount = entries.filter((e) => e.sirr_book_id === book.sirr_book_id).length;
            return (
              <SirrBookCard
                key={book.sirr_book_id || book._id}
                book={book}
                entryCount={entryCount}
                onOpen={() => { setSelectedBook(book); setView("book"); }}
                onRefresh={refresh}
                language={language}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function LangToggle({ language, setLanguage }) {
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