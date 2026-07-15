// ═══════════════════════════════════════════════════════════════
// SIRR MANUSCRIPT ENTRY — FAITHFUL MANUSCRIPT RENDERER
// ═══════════════════════════════════════════════════════════════
// Renders ONE manuscript entry EXACTLY as imported from the PDF.
//
// STRICT MANUSCRIPT RULE:
//   • Title = the original heading printed inside the manuscript
//     (heading_title_ar / heading_title). Never "Dua 1", "Prayer 2".
//   • Every field is shown ONLY if the manuscript provided it.
//   • Arabic text is displayed verbatim — every letter, harakah,
//     punctuation, line break preserved. Never normalized/rewritten.
//   • Malayalam translation sits immediately below the Arabic.
//   • Ends with a full reference footer (Book / Page / Edition / Source).
//   • Nothing is invented, summarized, merged, or reordered.
//
// This component displays manuscript content ONLY. It never generates.
// ═══════════════════════════════════════════════════════════════
import { BookOpen } from "lucide-react";

// Field label map (Malayalam / English). Manuscript-section labels only.
const FIELD_LABELS = {
  introduction:  { ml: "ആമുഖം",            en: "Introduction" },
  purpose:       { ml: "ഉദ്ദേശ്യം",          en: "Purpose" },
  preparation:   { ml: "ഒരുക്കം",            en: "Preparation" },
  conditions:    { ml: "വ്യവസ്ഥകൾ",          en: "Conditions" },
  materials:     { ml: "സാമഗ്രികൾ",          en: "Materials" },
  repetition:    { ml: "ആവർത്തന എണ്ണം",      en: "Number of Recitations" },
  timing:        { ml: "അനുയോജ്യ സമയം",     en: "Best Time" },
  day:           { ml: "ദിവസം",              en: "Day" },
  planet:        { ml: "ഗ്രഹം",              en: "Planet" },
  incense:       { ml: "ധൂപം",              en: "Incense" },
  warnings:      { ml: "മുന്നറിയിപ്പുകൾ",    en: "Warnings" },
  notes:         { ml: "കുറിപ്പുകൾ",        en: "Notes" },
  benefits:      { ml: "ഗുണങ്ങൾ",           en: "Benefits" },
  procedure:     { ml: "രീതി",              en: "Method" },
};

// Order of context fields shown BEFORE the Arabic text (manuscript order).
const PRE_ARABIC_ORDER = [
  "introduction", "purpose", "preparation", "conditions", "materials",
  "repetition", "timing", "day", "planet", "incense", "warnings", "notes",
];

// Order of practice fields shown AFTER the Malayalam translation.
const POST_ARABIC_ORDER = ["benefits", "procedure"];

function hasText(v) {
  return v != null && String(v).trim().length > 0;
}

// Resolve the Malayalam rendering of a context field:
// content_translations_ml[field] (faithful Malayalam) → fallback to raw field.
function fieldText(entry, field, language) {
  const raw = entry[field];
  if (language === "ml") {
    const ml = entry.content_translations_ml?.[field];
    return hasText(ml) ? ml : raw;
  }
  return raw;
}

function FieldBlock({ entry, field, language }) {
  const value = fieldText(entry, field, language);
  if (!hasText(value)) return null;
  const label = FIELD_LABELS[field]?.[language] || FIELD_LABELS[field]?.en || field;
  return (
    <div className="space-y-1">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${language === "ml" ? "font-malayalam" : "font-inter"}`}
        style={{ color: "rgba(212,175,55,0.60)" }}>
        {label}
      </p>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${language === "ml" ? "font-malayalam" : "font-inter"}`}
        style={{ color: "rgba(255,255,255,0.72)" }}>
        {value}
      </p>
    </div>
  );
}

export default function SirrManuscriptEntry({ entry, book, heading, language }) {
  if (!entry) return null;
  const isMl = language === "ml";

  // ── Title: the original heading printed inside the manuscript ──
  const titleAr = heading?.heading_title_ar || entry.topic_ar || "";
  const titleMain = heading?.heading_title || entry.topic || entry.purpose || "";
  const titleMl = entry.topic_ml || entry.purpose_ml || "";

  // ── Arabic text — verbatim, harakat preserved ──
  const arabic = entry.arabic_text || "";
  // ── Malayalam translation — immediately below Arabic ──
  const malayalam = entry.malayalam_meaning || "";

  // ── Images extracted from the manuscript (diagrams / wafq) ──
  const images = Array.isArray(entry.images) ? entry.images.filter(Boolean) : [];

  return (
    <article className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: "1px solid rgba(212,175,55,0.22)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>
      {/* ── Original manuscript title ── */}
      <header className="px-4 pt-4 pb-2 text-center"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        {hasText(titleAr) && (
          <h2 className="font-amiri text-2xl font-bold leading-relaxed"
            style={{ color: "#D4AF37", direction: "rtl" }}>
            {titleAr}
          </h2>
        )}
        {hasText(titleMain) && (
          <p className={`text-base font-bold mt-1 ${isMl ? "font-malayalam" : "font-inter"}`}
            style={{ color: "rgba(255,255,255,0.85)" }}>
            {titleMain}
          </p>
        )}
        {hasText(titleMl) && titleMl !== titleMain && (
          <p className="font-malayalam text-sm mt-0.5"
            style={{ color: "rgba(212,175,55,0.55)" }}>
            {titleMl}
          </p>
        )}
      </header>

      <div className="px-4 py-3 space-y-3">
        {/* ── Pre-Arabic context fields (manuscript order) ── */}
        {PRE_ARABIC_ORDER.map((f) => (
          <FieldBlock key={f} entry={entry} field={f} language={language} />
        ))}

        {/* ── Complete Arabic text — verbatim ── */}
        {hasText(arabic) && (
          <div className="rounded-lg p-3 my-1"
            style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.18)" }}>
            <p className="font-amiri text-xl leading-loose whitespace-pre-wrap selectable"
              style={{ color: "rgba(255,255,255,0.92)", direction: "rtl", textAlign: "right" }}>
              {arabic}
            </p>
          </div>
        )}

        {/* ── Malayalam translation — immediately below Arabic ── */}
        {hasText(malayalam) && (
          <div className="rounded-lg p-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="font-malayalam text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: "rgba(255,255,255,0.68)" }}>
              {malayalam}
            </p>
          </div>
        )}

        {/* ── Post-Arabic practice fields (manuscript order) ── */}
        {POST_ARABIC_ORDER.map((f) => (
          <FieldBlock key={f} entry={entry} field={f} language={language} />
        ))}

        {/* ── Original manuscript images ── */}
        {images.length > 0 && (
          <div className="space-y-2">
            {images.map((url, i) => (
              <img key={i} src={url} alt={`manuscript image ${i + 1}`}
                className="w-full rounded-lg"
                style={{ border: "1px solid rgba(212,175,55,0.18)" }}
                loading="lazy" />
            ))}
          </div>
        )}
      </div>

      {/* ── Reference footer ── */}
      <footer className="px-4 py-3 mt-1"
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.03)" }}>
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3 h-3" style={{ color: "rgba(212,175,55,0.55)" }} />
          <span className="font-inter text-[9px] font-bold uppercase tracking-wider"
            style={{ color: "rgba(212,175,55,0.60)" }}>
            {isMl ? "അവലംബം" : "Reference"}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-1 text-[10px]">
          <RefRow label={isMl ? "ഗ്രന്ഥം" : "Book"} value={book?.book_title || entry.book_title} />
          {hasText(book?.book_title_ar) && book.book_title_ar !== book?.book_title &&
            <RefRow label={isMl ? "മൂല ശീർഷകം" : "Original Title"} value={book.book_title_ar} />}
          {hasText(book?.author) && <RefRow label={isMl ? "രചയിതാവ്" : "Author"} value={book.author} />}
          {book?.pdf_count > 1 && <RefRow label={isMl ? "വാല്യം" : "Volume"} value={String(book.pdf_count)} />}
          {hasText(entry.page_number) && <RefRow label={isMl ? "പേജ്" : "Page"} value={String(entry.page_number)} />}
          {hasText(book?.edition) && <RefRow label={isMl ? "പതിപ്പ്" : "Edition"} value={book.edition} />}
          {hasText(book?.publication_year) && <RefRow label={isMl ? "വർഷം" : "Year"} value={book.publication_year} />}
          <RefRow label={isMl ? "സ്രോതസ്സ്" : "Source"} value={book?.source || "manuscript"} />
          {hasText(entry.entry_id) && <RefRow label={isMl ? "അവലംബ ഐഡി" : "Reference ID"} value={entry.entry_id} />}
        </div>
      </footer>
    </article>
  );
}

function RefRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-1.5">
      <span className="font-inter text-[9px] font-bold flex-shrink-0"
        style={{ color: "rgba(255,255,255,0.35)" }}>{label}:</span>
      <span className="font-inter text-[10px]"
        style={{ color: "rgba(255,255,255,0.60)" }}>{value}</span>
    </div>
  );
}