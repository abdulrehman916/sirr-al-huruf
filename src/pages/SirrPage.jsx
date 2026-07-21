// ═══════════════════════════════════════════════════════════════
// SIRR PAGE — SCAFFOLD + READ-ONLY DATA HOOKS
// ═══════════════════════════════════════════════════════════════
// Clean, structured shell ready to receive future Sirr content.
// Reuses the existing SirrManuscriptBook / SirrManuscriptEntry
// entities via read-only hooks — no new schema, no new backend
// functions, no business logic. Books and cards render
// automatically as soon as data exists.
//
// Preserved:
//   • Route /sirr (routeManifest.js — untouched)
//   • Navigation item, icon, permissions (PageLayout — untouched)
//   • All existing Sirr entities, backend functions, audit logic
//
// Sections (ready for future enrichment):
//   1. Library — Books       (useSirrBooks)
//   2. Cards · Knowledge      (useSirrEntries for selected book)
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { useSirrBooks } from "@/hooks/useSirrBooks";
import { useSirrEntries } from "@/hooks/useSirrEntries";

const G = { text: "#D4AF37", dim: "rgba(212,175,55,0.55)", faint: "rgba(212,175,55,0.18)" };

function EmptyState({ label }) {
  return (
    <div className="rounded-xl border p-6 text-center" style={{ borderColor: G.faint, background: "rgba(8,16,38,0.40)" }}>
      <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="font-inter text-xs uppercase tracking-widest font-bold" style={{ color: G.dim }}>{children}</h2>
  );
}

export default function SirrPage() {
  const { books, loading: booksLoading } = useSirrBooks();
  const [selectedBookId, setSelectedBookId] = useState(null);
  const { entries, loading: entriesLoading } = useSirrEntries(selectedBookId);

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center pt-2">
          <h1 className="font-amiri text-3xl" style={{ color: G.text }}>السرّ</h1>
          <p className="font-inter text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>Sirr · Manuscript Library</p>
        </div>

        {/* 1 — Library: Books */}
        <section className="space-y-3">
          <SectionLabel>Library — Books</SectionLabel>
          {booksLoading ? (
            <EmptyState label="Loading library…" />
          ) : books.length === 0 ? (
            <EmptyState label="No books yet. Future manuscript imports will appear here." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {books.map((b) => (
                <button
                  key={b.sirr_book_id}
                  onClick={() => setSelectedBookId(b.sirr_book_id)}
                  className="rounded-xl border p-3 text-left transition"
                  style={{
                    borderColor: selectedBookId === b.sirr_book_id ? "rgba(212,175,55,0.50)" : G.faint,
                    background: selectedBookId === b.sirr_book_id ? "rgba(212,175,55,0.06)" : "rgba(8,16,38,0.40)",
                  }}
                >
                  <p className="font-amiri text-base truncate" style={{ color: "rgba(255,255,255,0.85)" }} dir="rtl">
                    {b.malayalam_book_name || b.book_title || "—"}
                  </p>
                  <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {b.combined_total_pages || 0} pages · {b.total_entries || 0} entries
                  </p>
                  <p className="font-inter text-[9px] mt-0.5" style={{ color: G.dim }}>{b.extraction_status}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 2 — Cards · Knowledge */}
        <section className="space-y-3">
          <SectionLabel>Cards · Knowledge</SectionLabel>
          {!selectedBookId ? (
            <EmptyState label="Select a book to view its manuscript cards." />
          ) : entriesLoading ? (
            <EmptyState label="Loading cards…" />
          ) : entries.length === 0 ? (
            <EmptyState label="No cards extracted from this book yet." />
          ) : (
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.sirr_entry_id} className="rounded-xl border p-3" style={{ borderColor: G.faint, background: "rgba(8,16,38,0.40)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-amiri text-base truncate" style={{ color: "rgba(255,255,255,0.85)" }} dir="rtl">
                      {e.heading_title_ar || e.heading_title_ml || e.heading_title || "—"}
                    </p>
                    {e.category && (
                      <span className="font-inter text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(212,175,55,0.10)", color: G.dim }}>
                        {e.category}
                      </span>
                    )}
                  </div>
                  {e.arabic_text && (
                    <p className="font-amiri text-sm mt-1.5 line-clamp-3" style={{ color: "rgba(255,255,255,0.70)" }} dir="rtl">{e.arabic_text}</p>
                  )}
                  {e.malayalam_meaning && (
                    <p className="font-malayalam text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{e.malayalam_meaning}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}