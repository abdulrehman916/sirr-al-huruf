import { useState, useCallback } from 'react';
import { searchSamurHindi, BOOK_META, CHAPTERS, getChapterForPage } from '../../lib/samurHindiIndex';

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.20)",
  text: "#E8C84A",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.18)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.12)",
};

const QUICK_TOPICS = [
  { label: "Qasam", query: "kasem" },
  { label: "Amal", query: "amel" },
  { label: "Hadim / A'van", query: "avan" },
  { label: "Vefk", query: "vefk" },
  { label: "Celb", query: "celb" },
  { label: "Anasır", query: "anasır" },
  { label: "Gezegenler", query: "gezegen" },
  { label: "Sihir İptali", query: "sihir" },
  { label: "Muhabbet", query: "muhabbet" },
  { label: "Mizan", query: "mizan" },
  { label: "Fatiha", query: "fatiha" },
  { label: "Burçlar", query: "burç" },
];

function ResultCard({ result, index }) {
  const [expanded, setExpanded] = useState(false);
  const chapter = getChapterForPage(result.page);

  return (
    <div
      className="rounded-xl border p-4 space-y-2"
      style={{
        background: expanded ? G.bgHi : "rgba(255,255,255,0.02)",
        borderColor: expanded ? G.borderHi : G.faint,
        boxShadow: expanded ? `0 0 16px ${G.glow}` : "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="font-inter text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{ background: G.bg, borderColor: G.faint, color: G.text }}
            >
              Page {result.page}
            </span>
            <span
              className="font-inter text-[9px] uppercase tracking-widest"
              style={{ color: G.dim }}
            >
              Score: {result.score}
            </span>
          </div>
          <p
            className="font-inter text-[10px] font-bold uppercase tracking-wide"
            style={{ color: G.text }}
          >
            {result.chapter}
          </p>
          {chapter && (
            <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>
              {chapter.name}
            </p>
          )}
        </div>
        <button
          className="flex-shrink-0 font-inter text-[9px] uppercase tracking-widest px-2 py-1 rounded-lg border"
          style={{ borderColor: G.faint, color: G.dim }}
        >
          {expanded ? "▲ Hide" : "▼ Show"}
        </button>
      </div>

      {/* Exact Text */}
      {expanded && (
        <div
          className="rounded-lg p-3 mt-2"
          style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${G.faint}` }}
        >
          <p
            className="font-inter text-[9px] uppercase tracking-widest mb-2"
            style={{ color: G.dim }}
          >
            📖 EXACT TEXT FROM BOOK — Page {result.page}
          </p>
          <p
            className="font-amiri leading-relaxed text-sm"
            style={{ color: "rgba(255,255,255,0.80)", direction: "rtl", textAlign: "right" }}
          >
            {result.text}
          </p>

          {result.related_pages && result.related_pages.length > 0 && (
            <div className="mt-3 pt-2 border-t" style={{ borderColor: G.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                Related Pages:
              </p>
              <div className="flex flex-wrap gap-1">
                {result.related_pages.map(p => (
                  <span
                    key={p}
                    className="font-inter text-[9px] px-2 py-0.5 rounded-full border"
                    style={{ background: G.bg, borderColor: G.faint, color: G.text }}
                  >
                    p.{p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SirrBookSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback((q) => {
    const term = q || query;
    if (!term.trim()) return;
    const found = searchSamurHindi(term);
    setResults(found);
    setSearched(true);
    if (q && q !== query) setQuery(q);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setSearched(false);
  };

  return (
    <div className="space-y-4">
      {/* Book Header */}
      <div
        className="rounded-2xl border p-5 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(8,18,48,0.99) 0%, rgba(4,12,34,0.99) 100%)",
          borderColor: G.borderHi,
          boxShadow: `0 0 40px ${G.glow}`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg,transparent,rgba(212,175,55,0.50),transparent)` }} />
        <p className="font-amiri text-2xl font-bold mb-1" style={{ color: G.text }}>
          رِسَالَةِ صَمُورٍ هِنْدِي
        </p>
        <p className="font-inter text-[10px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
          RISALE-İ SAMUR HİNDİ
        </p>
        <p className="font-inter text-[9px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          {BOOK_META.author} — {BOOK_META.date}, {BOOK_META.place}
        </p>
        <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
          Source: {BOOK_META.source_book} — {BOOK_META.total_pages} pages indexed
        </p>
      </div>

      {/* Search Box */}
      <div
        className="rounded-2xl border p-4"
        style={{
          background: "rgba(4,12,34,0.97)",
          borderColor: G.border,
        }}
      >
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Search This Book — Arabic / Turkish / Topic
        </label>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. Qasam, Amal, Celb, Mizan, Sihir..."
            className="flex-1 rounded-xl px-4 py-3 font-inter text-base text-white focus:outline-none caret-white placeholder:text-white/30"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}`, fontSize: '16px' }}
          />
          {query && (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-xl border font-inter text-[9px]"
              style={{ borderColor: "rgba(239,68,68,0.30)", color: "rgba(239,68,68,0.60)", background: "rgba(239,68,68,0.05)" }}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            className="px-5 py-2 rounded-xl font-inter font-bold text-sm disabled:opacity-30 text-[#0d1b2a]"
            style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)" }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Quick Topics */}
      <div>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Quick Search Topics:
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map(t => (
            <button
              key={t.query}
              onClick={() => handleSearch(t.query)}
              className="px-3 py-1.5 rounded-xl border font-inter text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: G.bg,
                borderColor: G.faint,
                color: G.text,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && results !== null && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {results.length > 0
                ? `${results.length} result${results.length !== 1 ? 's' : ''} found in Samur Hindi`
                : 'No matching content found in this book'}
            </p>
            {results.length > 0 && (
              <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                All results from book only
              </span>
            )}
          </div>

          {results.length === 0 && (
            <div
              className="rounded-2xl border p-8 text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="font-amiri text-lg mb-2" style={{ color: "rgba(255,255,255,0.30)" }}>
                لا يوجد نتيجة
              </p>
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
                No matching content found for "{query}" in Risale-i Samur Hindi.
              </p>
            </div>
          )}

          {results.map((result, i) => (
            <ResultCard key={`${result.page}-${result.topic}-${i}`} result={result} index={i} />
          ))}
        </div>
      )}

      {/* Chapter Index */}
      {!searched && (
        <div
          className="rounded-2xl border p-4 space-y-2"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: G.faint }}
        >
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
            Book Structure — {CHAPTERS.length} Chapters
          </p>
          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-none">
            {CHAPTERS.map(ch => (
              <div
                key={ch.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: G.bg }}
              >
                <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {ch.name}
                </span>
                <span className="font-inter text-[9px]" style={{ color: G.dim }}>
                  pp. {ch.pages[0]}–{ch.pages[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}