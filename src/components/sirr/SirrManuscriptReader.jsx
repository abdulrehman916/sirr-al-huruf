// ═══════════════════════════════════════════════════════════════
// SIRR DUA LIBRARY — reads from the BASE MANUSCRIPT LIBRARY
//
// Reads ONLY from ManuscriptBook / ManuscriptEntry / ManuscriptHeading.
// Does NOT use separate SIRR entities. Does NOT upload PDFs.
//
// Home: grid of clickable Dua title cards (no books, no counts, no tech info)
// Detail: full Dua content in exact manuscript order
//
// Card: Malayalam title (large) + Arabic title (smaller below)
// Detail order:
//   ML title → AR title → Introduction → Purpose → Benefits →
//   Etiquette → Conditions → Preparation → Materials → Repetitions →
//   Best Time → Best Day → Warnings → Notes → Complete Arabic Dua →
//   Malayalam meaning → Reference footer
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, BookOpen, Loader2, AlertTriangle, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Field labels (Malayalam / English) ──────────────────────
const LABELS = {
  introduction:  { ml: "ആമുഖം",         en: "Introduction" },
  purpose:       { ml: "ഉദ്ദേശ്യം",       en: "Purpose" },
  benefits:      { ml: "ഗുണങ്ങൾ",        en: "Virtues / Benefits" },
  etiquette:    { ml: "മര്യാദകൾ",       en: "Etiquette" },
  conditions:    { ml: "നിബന്ധനകൾ",     en: "Conditions" },
  preparation:   { ml: "ഒരുക്കം",         en: "Preparation" },
  materials:     { ml: "സാമഗ്രികൾ",      en: "Materials" },
  repetition:    { ml: "ആവർത്തനം",       en: "Repetitions" },
  timing:        { ml: "അനുയോജ്യ സമയം", en: "Best Time" },
  day:           { ml: "അനുയോജ്യ ദിവസം", en: "Best Day" },
  warnings:      { ml: "മുന്നറിയിപ്പ്",   en: "Warnings" },
  notes:         { ml: "കുറിപ്പുകൾ",      en: "Notes" },
};

// Manuscript-order field keys for the detail view (pre-Arabic section)
const DETAIL_FIELDS = [
  'introduction','purpose','benefits','etiquette','conditions',
  'preparation','materials','repetition','timing','day','warnings','notes',
];

function hasText(v) { return v != null && String(v).trim().length > 0; }

// Turkish detection — heading_title_ar sometimes contains Turkish, not Arabic
function looksTurkish(text) {
  if (!text) return false;
  return /[ŞİĞÜÖÇşığüöç]/.test(text);
}

// Get Malayalam content for a field from content_translations_ml or _ml variant
function getMlField(entry, fieldName) {
  if (entry.content_translations_ml && entry.content_translations_ml[fieldName]) {
    return entry.content_translations_ml[fieldName];
  }
  const mlKey = fieldName + '_ml';
  if (entry[mlKey]) return entry[mlKey];
  return '';
}

// ── Title resolution ────────────────────────────────────────
function getTitleMl(entry, headingMap) {
  if (hasText(entry.topic_ml)) return entry.topic_ml;
  if (hasText(entry.purpose_ml)) return entry.purpose_ml;
  const heading = headingMap[entry.heading_id];
  if (heading && hasText(heading.heading_title)) return heading.heading_title;
  if (hasText(entry.topic)) return entry.topic;
  if (hasText(entry.purpose)) return entry.purpose;
  return '';
}

function getTitleAr(entry, headingMap) {
  if (hasText(entry.topic_ar) && !looksTurkish(entry.topic_ar)) return entry.topic_ar;
  const heading = headingMap[entry.heading_id];
  if (heading && hasText(heading.heading_title_ar) && !looksTurkish(heading.heading_title_ar)) {
    return heading.heading_title_ar;
  }
  return '';
}

// ── Detail view ──────────────────────────────────────────────
function DuaDetail({ entry, book, headingMap, language, onBack }) {
  const isMl = language === "ml";

  const titleMl = getTitleMl(entry, headingMap);
  const titleAr = getTitleAr(entry, headingMap);
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

          {entry.page_number && (
            <p className="font-inter text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.30)" }}>
              {isMl ? "പേജ്" : "Page"} {entry.page_number}
            </p>
          )}
        </header>

        <div className="px-4 py-4 space-y-4">
          {/* 3–12: Pre-Arabic fields in manuscript order */}
          {DETAIL_FIELDS.map((key) => {
            let val = '';
            if (isMl) {
              val = getMlField(entry, key);
              if (!hasText(val)) val = ''; // ML mode: only Malayalam
            } else {
              val = entry[key] || '';
            }
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

          {/* 13. Complete Arabic Dua — verbatim */}
          {hasText(arabic) && (
            <div className="rounded-xl p-4 my-1"
              style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.20)" }}>
              <p className="font-amiri text-xl leading-loose whitespace-pre-wrap selectable"
                style={{ color: "rgba(255,255,255,0.92)", direction: "rtl", textAlign: "right", lineHeight: "2.4" }}>
                {arabic}
              </p>
            </div>
          )}

          {/* 14. Malayalam meaning */}
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
            {book?.book_title && <RefRow label={isMl ? "ഗ്രന്ഥം" : "Book"} value={book.book_title} />}
            {book?.book_title_ar && <RefRow label={isMl ? "അറബി ശീർഷകം" : "Arabic Title"} value={book.book_title_ar} />}
            {entry.page_number && <RefRow label={isMl ? "പേജ്" : "Page"} value={String(entry.page_number)} />}
            {book?.author && <RefRow label={isMl ? "ഗ്രന്ഥകർത്താവ്" : "Author"} value={book.author} />}
            {book?.edition && <RefRow label={isMl ? "പതിപ്പ്" : "Edition"} value={book.edition} />}
            {book?.publication_year && <RefRow label={isMl ? "പ്രസിദ്ധീകരണ വർഷം" : "Year"} value={book.publication_year} />}
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
function DuaCard({ entry, headingMap, language, onClick }) {
  const isMl = language === "ml";
  const titleMl = getTitleMl(entry, headingMap) || (isMl ? `ഭാഗം ${entry.entry_order || ''}` : `Section ${entry.entry_order || ''}`);
  const titleAr = getTitleAr(entry, headingMap);

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
            {entry.entry_order ? String(entry.entry_order).slice(-3) : ''}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {/* Line 1: Malayalam/English title (large) */}
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
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [search, setSearch] = useState('');
  const isMl = language === "ml";

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([
      base44.entities.ManuscriptBook.list('-created_date', 100).catch(() => []),
      base44.entities.ManuscriptEntry.list('entry_order', 2000).catch(() => []),
      base44.entities.ManuscriptHeading.list('heading_order', 500).catch(() => []),
    ]).then(([b, e, h]) => {
      setBooks(b || []);
      setEntries((e || []).sort((a, b2) => (a.entry_order || 0) - (b2.entry_order || 0)));
      setHeadings(h || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Build lookup maps
  const bookMap = useMemo(() => {
    const m = {};
    (books || []).forEach(b => { if (b.book_id) m[b.book_id] = b; });
    return m;
  }, [books]);

  const headingMap = useMemo(() => {
    const m = {};
    (headings || []).forEach(h => { if (h.heading_id) m[h.heading_id] = h; });
    return m;
  }, [headings]);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(e =>
      (e.topic_ml || '').toLowerCase().includes(q) ||
      (e.topic || '').toLowerCase().includes(q) ||
      (e.topic_ar || '').includes(q) ||
      (e.purpose || '').toLowerCase().includes(q) ||
      (e.arabic_text || '').includes(q)
    );
  }, [entries, search]);

  // ── Detail view ──
  if (selectedEntry) {
    return (
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4">
        <DuaDetail
          entry={selectedEntry}
          book={bookMap[selectedEntry.book_id]}
          headingMap={headingMap}
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: "rgba(212,175,55,0.60)" }} />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(212,175,55,0.25)" }} />
          <p className="font-malayalam text-sm font-bold" style={{ color: "rgba(255,255,255,0.45)" }}>
            {isMl ? "ഔറാദുകളൊന്നുമില്ല" : "No duas found"}
          </p>
        </div>
      ) : (
        <>
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
                key={entry.entry_id || entry._id}
                entry={entry}
                headingMap={headingMap}
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