// ═══════════════════════════════════════════════════════════════
// SIRR DUA LIBRARY — reads ONLY from SIRR-DEDICATED entities
//
// SirrManuscriptBook / SirrManuscriptEntry are ISOLATED from the
// global ManuscriptBook / ManuscriptEntry used by Astro, Bast,
// Holy Names, Plants, Jinn, and all other modules.
//
// SIRR starts EMPTY. A Dua card appears ONLY after a PDF is
// uploaded specifically via the SIRR upload button. No manuscripts
// from other modules ever appear here.
//
// Home: grid of clickable Dua title cards (no books, no counts)
// Detail: full Dua content in exact manuscript order
//
// Card: Malayalam title (large) + Arabic title (smaller below)
// Detail order:
//   ML title → AR title → Introduction → Purpose → Benefits →
//   Etiquette → Conditions → Preparation → Warnings → Notes →
//   Complete Arabic Dua (verbatim, all harakat) → Malayalam meaning →
//   Book & page reference
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, BookOpen, Loader2, AlertTriangle, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SirrUploadButton from "./SirrUploadButton";

// ── Field labels (Malayalam / English) ──────────────────────
const LABELS = {
  introduction:  { ml: "ആമുഖം",         en: "Introduction" },
  purpose:       { ml: "ഉദ്ദേശ്യം",       en: "Purpose" },
  benefits:      { ml: "ഗുണങ്ങൾ",        en: "Virtues / Benefits" },
  etiquette:     { ml: "മര്യാദകൾ",       en: "Etiquette" },
  conditions:    { ml: "നിബന്ധനകൾ",     en: "Conditions" },
  preparation:   { ml: "ഒരുക്കം",         en: "Preparation" },
  materials:     { ml: "സാമഗ്രികൾ",      en: "Materials" },
  repetition:    { ml: "ആവർത്തനം",      en: "Repetition" },
  timing:        { ml: "സമയം",          en: "Recommended Time" },
  day:           { ml: "ദിവസം",         en: "Recommended Day" },
  warnings:      { ml: "മുന്നറിയിപ്പ്",   en: "Warnings" },
  notes:         { ml: "കുറിപ്പുകൾ",      en: "Notes" },
};

// Manuscript-order field keys for the detail view (pre-Arabic section)
const DETAIL_FIELDS = [
  'introduction','purpose','benefits','etiquette','conditions',
  'preparation','materials','repetition','timing','day',
  'warnings','notes',
];

function hasText(v) { return v != null && String(v).trim().length > 0; }

function parseNotes(raw) {
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

// ── Detail view ──────────────────────────────────────────────
function DuaDetail({ entry, book, language, onBack }) {
  const isMl = language === "ml";
  const fields = parseNotes(entry.notes);

  const titleMl = entry.heading_title_ml || entry.heading_title || '';
  const titleAr = entry.heading_title_ar || '';
  const arabic  = entry.arabic_text || '';
  const malayalam = entry.malayalam_meaning || '';

  return (
    <div className="space-y-3">
      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.10)" }}>
        <ChevronLeft className="w-4 h-4" />
        {isMl ? "ഗ്രന്ഥശേഖരത്തിലേക്ക്" : "Back to Library"}
      </button>

      <article className="rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: "1px solid rgba(212,175,55,0.22)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.55)",
        }}>
        {/* Title header */}
        <header className="px-4 pt-5 pb-3 text-center" style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
          {/* 1. Malayalam title */}
          {hasText(titleMl) && (
            <h1 className="font-malayalam text-xl font-bold leading-relaxed" style={{ color: "#D4AF37" }}>
              {titleMl}
            </h1>
          )}

          {/* 2. Arabic title */}
          {hasText(titleAr) && (
            <p className="font-amiri text-lg font-bold mt-1" style={{ color: "rgba(212,175,55,0.70)", direction: "rtl" }}>
              {titleAr}
            </p>
          )}


        </header>

        <div className="px-4 py-4 space-y-4">
          {/* 3–8: Pre-Arabic fields in manuscript order */}
          {DETAIL_FIELDS.map((key) => {
            const val = fields[key];
            if (!hasText(val)) return null;
            const label = LABELS[key]?.[isMl ? 'ml' : 'en'] || key;
            return (
              <div key={key} className="space-y-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isMl ? 'font-malayalam' : 'font-inter'}`}
                  style={{ color: "rgba(212,175,55,0.60)" }}>
                  {label}
                </p>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isMl ? 'font-malayalam' : 'font-inter'}`}
                  style={{ color: "rgba(255,255,255,0.72)" }}>
                  {val}
                </p>
              </div>
            );
          })}

          {/* 9. Complete Arabic Dua — verbatim, all harakat */}
          {hasText(arabic) && (
            <div className="rounded-xl p-4 my-1"
              style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.20)" }}>
              <p className="font-amiri text-xl leading-loose whitespace-pre-wrap selectable"
                style={{ color: "rgba(255,255,255,0.92)", direction: "rtl", textAlign: "right", lineHeight: "2.4" }}>
                {arabic}
              </p>
            </div>
          )}

          {/* 10. Malayalam meaning */}
          {hasText(malayalam) && (
            <div className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="font-inter text-[9px] font-bold uppercase tracking-wider mb-2"
                style={{ color: "rgba(212,175,55,0.50)" }}>
                {isMl ? "വിശദീകരണം" : "Explanation"}
              </p>
              <p className="font-malayalam text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "rgba(255,255,255,0.68)" }}>
                {malayalam}
              </p>
            </div>
          )}
        </div>

        {/* Reference footer */}
        <footer className="px-4 py-3" style={{ borderTop: "1px solid rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.02)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3 h-3" style={{ color: "rgba(212,175,55,0.50)" }} />
            <span className="font-inter text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(212,175,55,0.55)" }}>
              {isMl ? "അവലംബം" : "Reference"}
            </span>
          </div>
          <div className="space-y-0.5">
            {book?.malayalam_book_name && <RefRow label={isMl ? "ഗ്രന്ഥം" : "Book"} value={book.malayalam_book_name} />}
            {book?.book_title && book.book_title !== book?.malayalam_book_name && <RefRow label={isMl ? "മൂല ഗ്രന്ഥം" : "Original Title"} value={book.book_title} />}
            {book?.book_title_ar && <RefRow label={isMl ? "അറബി ശീർഷകം" : "Arabic Title"} value={book.book_title_ar} />}
            {entry.source_part_number ? <RefRow label={isMl ? "ഭാഗം" : "PDF Part"} value={`Part ${entry.source_part_number}`} /> : null}
            {entry.page_number && <RefRow label={isMl ? "പേജ്" : "Page"} value={String(entry.page_number)} />}
            {book?.author && <RefRow label={isMl ? "ഗ്രന്ഥകർത്താവ്" : "Author"} value={book.author} />}
            {book?.edition && <RefRow label={isMl ? "പതിപ്പ്" : "Edition"} value={book.edition} />}
            {book?.original_file_name && <RefRow label={isMl ? "ഉറവിടം" : "Source"} value={book.original_file_name} />}
          </div>
        </footer>
      </article>
    </div>
  );
}

function RefRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-1.5">
      <span className="font-inter text-[9px] font-bold flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>{label}:</span>
      <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{value}</span>
    </div>
  );
}

// ── Dua title card ───────────────────────────────────────────
function DuaCard({ entry, language, onClick }) {
  const isMl = language === "ml";
  const titleMl = entry.heading_title_ml || entry.heading_title || (isMl ? `ഭാഗം ${entry.entry_order}` : `Section ${entry.entry_order}`);
  const titleAr = entry.heading_title_ar || '';

  return (
    <button onClick={onClick}
      className="w-full text-left rounded-xl p-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.95) 0%, rgba(4,10,24,0.98) 100%)",
        border: "1px solid rgba(212,175,55,0.20)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.40)",
      }}>
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
          style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.20)" }}>
          <span className="font-inter text-[10px] font-bold tabular-nums" style={{ color: "rgba(212,175,55,0.70)" }}>
            {entry.entry_order}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {/* Line 1: Malayalam title (large) */}
          <p className="font-malayalam text-sm font-bold leading-snug line-clamp-2" style={{ color: "rgba(255,255,255,0.88)" }}>
            {titleMl}
          </p>
          {/* Line 2: Arabic title (smaller) */}
          {hasText(titleAr) && (
            <p className="font-amiri text-sm mt-0.5 truncate" style={{ color: "rgba(212,175,55,0.60)", direction: "rtl", textAlign: "right" }}>
              {titleAr}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Language toggle ──────────────────────────────────────────
function LangToggle({ language, setLanguage }) {
  return (
    <div className="flex items-center gap-1">
      {['ml','en'].map(lang => (
        <button key={lang} onClick={() => setLanguage(lang)}
          className={`px-2 py-1 rounded-md text-[10px] font-bold ${language === lang ? 'btn-gold' : ''}`}
          style={language !== lang ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.10)" } : {}}>
          {lang === 'ml' ? 'മലയാളം' : 'EN'}
        </button>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function SirrManuscriptReader({ language, setLanguage }) {
  const [books, setBooks] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [search, setSearch] = useState('');
  const [bookFilter, setBookFilter] = useState('');
  const isMl = language === "ml";

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([
      base44.entities.SirrManuscriptBook.list('-created_date', 500).catch(() => []),
      base44.entities.SirrManuscriptEntry.list('entry_order', 2000).catch(() => []),
    ]).then(([b, e]) => {
      setBooks(b || []);
      setEntries((e || []).sort((a, b2) => (a.entry_order || 0) - (b2.entry_order || 0)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: new Dua cards appear automatically as the background engine processes pages.
  useEffect(() => {
    const unsubscribe = base44.entities.SirrManuscriptEntry.subscribe((event) => {
      if (event.type === 'create' && event.data) {
        setEntries(prev => {
          if (prev.find(e => (e.sirr_entry_id || e._id) === (event.data.sirr_entry_id || event.data._id))) return prev;
          const next = [...prev, event.data];
          next.sort((a, b2) => (a.entry_order || 0) - (b2.entry_order || 0));
          return next;
        });
      }
    });
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  // Periodic refresh while any book is still processing in the background (safety net).
  useEffect(() => {
    const interval = setInterval(() => {
      base44.entities.SirrManuscriptBook.filter({ extraction_status: { $in: ['pending', 'processing', 'partial'] } }, undefined, 1)
        .then(b => { if (b && b.length > 0) refresh(); })
        .catch(() => {});
    }, 12000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Find the book for a given entry
  const bookFor = useCallback((entry) => {
    return books.find(b => b.sirr_book_id === entry?.sirr_book_id) || null;
  }, [books]);

  const filtered = useMemo(() => {
    let list = entries;
    if (bookFilter) list = list.filter(e => e.sirr_book_id === bookFilter);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(e =>
      (e.heading_title_ml || '').toLowerCase().includes(q) ||
      (e.heading_title_ar || '').includes(q) ||
      (e.arabic_text || '').includes(q) ||
      (e.book_title || '').toLowerCase().includes(q)
    );
  }, [entries, search, bookFilter]);

  // ── Detail view ──
  if (selectedEntry) {
    return (
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4">
        <DuaDetail
          entry={selectedEntry}
          book={bookFor(selectedEntry)}
          language={language}
          onBack={() => setSelectedEntry(null)}
        />
      </div>
    );
  }

  // ── Library (home) view ──
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "rgba(212,175,55,0.60)" }} />
          <h1 className="font-malayalam text-sm font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
            {isMl ? "ദുആ ലൈബ്രറി" : "Dua Library"}
          </h1>
        </div>
        <LangToggle language={language} setLanguage={setLanguage} />
      </div>

      {/* Admin: upload button */}
      <SirrUploadButton onUploaded={refresh} language={language} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: "rgba(212,175,55,0.60)" }} />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(212,175,55,0.25)" }} />
          <p className="font-malayalam text-sm font-bold" style={{ color: "rgba(255,255,255,0.45)" }}>
            {isMl ? "ഔറാദുകളൊന്നുമില്ല" : "No duas imported yet"}
          </p>
          <p className="font-inter text-xs mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
            {isMl ? "ഒരു PDF അപ്‌ലോഡ് ചെയ്യൂ" : "Upload a PDF above to begin"}
          </p>
        </div>
      ) : (
        <>
          {/* Book filter */}
          {books.length > 1 && (
            <select
              value={bookFilter}
              onChange={(e) => setBookFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.80)",
                border: "1px solid rgba(212,175,55,0.15)",
                colorScheme: "dark",
              }}
            >
              <option value="">{isMl ? "എല്ലാ ഗ്രന്ഥങ്ങളും" : "All books"}</option>
              {books.map((b) => (
                <option key={b.sirr_book_id} value={b.sirr_book_id}>
                  {b.malayalam_book_name || b.book_title}
                </option>
              ))}
            </select>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(212,175,55,0.50)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isMl ? "ദുആ തിരയുക..." : "Search..."}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.80)", border: "1px solid rgba(212,175,55,0.15)", colorScheme: "dark" }}
            />
          </div>

          {/* Dua cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map(entry => (
              <DuaCard
                key={entry.sirr_entry_id || entry._id}
                entry={entry}
                language={language}
                onClick={() => setSelectedEntry(entry)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}