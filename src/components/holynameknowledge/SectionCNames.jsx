import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Loader2, ShieldAlert } from "lucide-react";
import { base44 } from "@/api/base44Client";
import HolyNameEsotericResearchProfile from "@/components/holynameknowledge/HolyNameEsotericResearchProfile";

// ── Section C — Birhatīya / Esoteric Invocation Names ──
// INDEPENDENT module. Reads ONLY from HolyNameEsotericKnowledge.
// Displays all 28 seeded cards as clickable, collapsible cards.
// No data from Section A or Section B is used here.

const P = {
  border: "rgba(212,175,55,0.30)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(245,208,96,0.55)",
  faint: "rgba(212,175,55,0.14)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function SectionCNames() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let alive = true;
    base44.entities.HolyNameEsotericKnowledge.list("order_index", 200)
      .then((r) => { if (alive) setCards(r || []); })
      .catch(() => { if (alive) setCards([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((c) =>
      (c.arabic_name || "").toLowerCase().includes(q) ||
      (c.arabic_normalized || "").toLowerCase().includes(q) ||
      (c.transliteration || "").toLowerCase().includes(q) ||
      (c.exact_meaning || "").toLowerCase().includes(q) ||
      (c.name_id || "").toLowerCase().includes(q)
    );
  }, [cards, query]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: P.dim }} />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <ShieldAlert className="w-10 h-10 mx-auto" style={{ color: "rgba(148,163,184,0.6)" }} />
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.7)" }}>
          No Section C cards found
        </p>
        <p className="font-malayalam text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          കാർഡുകൾ ലഭ്യമായില്ല
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="section-c-container">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl border px-3 py-2.5" style={{ background: P.bg, borderColor: P.border }}>
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: P.dim }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Birhatīya names..."
          className="flex-1 bg-transparent outline-none font-inter text-sm"
          style={{ color: "rgba(255,255,255,0.85)" }}
          dir="auto"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ color: P.dim }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
          {filtered.length} of {cards.length} names
        </p>
        <button
          onClick={() => { setQuery(""); setOpenId(null); }}
          className="px-3 py-1.5 rounded-xl border font-inter text-[10px] uppercase tracking-widest"
          style={{ background: P.bg, borderColor: P.border, color: P.dim }}
        >
          Clear
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
              <p className="font-amiri text-lg" style={{ color: P.dim }}>لا توجد نتائج</p>
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>Try a different search</p>
            </motion.div>
          ) : (
            filtered.map((card, i) => {
              const isOpen = openId === card.id;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.020, 0.30), duration: 0.22 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    borderColor: isOpen ? P.borderHi : P.border,
                    background: isOpen
                      ? "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)"
                      : P.bg,
                    boxShadow: isOpen ? `0 0 24px rgba(212,175,55,0.12)` : "none",
                  }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : card.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-inter text-[8px] font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>
                          #{String(card.order_index || card.original_static_id).padStart(2, "0")}
                        </span>
                        <span className="font-amiri text-[1.65rem] font-bold" style={{ color: P.text, textShadow: isOpen ? "0 0 20px rgba(212,175,55,0.35)" : "0 0 12px rgba(212,175,55,0.20)" }} dir="rtl">
                          {card.arabic_name}
                        </span>
                        {card.total_abjad_value > 0 && (
                          <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border whitespace-nowrap" style={{ color: P.dim, borderColor: P.border, background: "rgba(245,208,96,0.08)" }}>
                            {card.total_abjad_value}
                          </span>
                        )}
                      </div>
                      {card.transliteration && (
                        <p className="font-inter text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.88)" }}>{card.transliteration}</p>
                      )}
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0" style={{ color: isOpen ? P.text : P.dim }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid " + P.faint }}>
                          <HolyNameEsotericResearchProfile nameId={card.name_id} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}