// ═══════════════════════════════════════════════════════════════
// SIRR PAGE — Library + Reader
// ═══════════════════════════════════════════════════════════════
// Clean shell reusing the existing SirrManuscriptBook /
// SirrManuscriptEntry entities via read-only hooks. The Reader
// (search, filter, categories, pagination, favorites, trilingual)
// is mounted below the book library. No new schema, no new backend
// functions, no business logic. Owner-only source material is gated
// inside SirrEntryCard.
//
// Preserved:
//   • Route /sirr (routeManifest.js — untouched)
//   • Navigation item, icon, permissions (PageLayout — untouched)
//   • All existing Sirr entities, backend functions, audit logic
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { useSirrBooks } from "@/hooks/useSirrBooks";
import SirrReader from "@/components/sirr/SirrReader";

const G = { text: "#D4AF37", dim: "rgba(212,175,55,0.55)", faint: "rgba(212,175,55,0.18)" };

function Empty({ label }) {
  return (
    <div className="rounded-xl border p-6 text-center" style={{ borderColor: G.faint, background: "rgba(8,16,38,0.40)" }}>
      <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</p>
    </div>
  );
}

export default function SirrPage() {
  const { books, loading: booksLoading } = useSirrBooks();
  const [selectedBookId, setSelectedBookId] = useState(null);
  const selectedBook = books.find(b => b.sirr_book_id === selectedBookId) || null;

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
          <h2 className="font-inter text-xs uppercase tracking-widest font-bold" style={{ color: G.dim }}>Library — Books</h2>
          {booksLoading ? (
            <Empty label="Loading library…" />
          ) : books.length === 0 ? (
            <Empty label="No books yet. Future manuscript imports will appear here." />
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

        {/* 2 — Reader: search · filter · categories · trilingual · favorites */}
        <section className="space-y-3">
          <h2 className="font-inter text-xs uppercase tracking-widest font-bold" style={{ color: G.dim }}>Reader · Cards & Knowledge</h2>
          <SirrReader book={selectedBook} />
        </section>
      </div>
    </PageLayout>
  );
}