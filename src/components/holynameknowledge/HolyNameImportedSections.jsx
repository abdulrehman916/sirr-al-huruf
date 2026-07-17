import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, BookOpen, ImageIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";

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

const CATEGORY_ORDER = [
  "arabic_name",
  "malayalam_meaning",
  "description",
  "benefits",
  "usage",
  "method",
  "recitations",
  "conditions",
  "warnings",
  "related_duas",
  "references",
  "notes",
  "wafq_diagram",
  "table",
  "numeric_layout",
  "symbol",
  "other",
];

const SECTION_LABELS = {
  arabic_name: "Arabic Name",
  malayalam_meaning: "Malayalam Meaning",
  description: "Explanation",
  benefits: "Benefits",
  usage: "Usage Method",
  method: "Method",
  recitations: "Number of Recitations",
  conditions: "Conditions",
  warnings: "Warnings",
  related_duas: "Related Duas",
  references: "References",
  notes: "Notes",
  wafq_diagram: "Wafq / Magic Square",
  table: "Table",
  numeric_layout: "Numeric Layout",
  symbol: "Symbol",
  other: "From PDF",
};

const LANG_LABELS = { ar: "Arabic", ml: "Malayalam", en: "English", mixed: "Arabic + Malayalam" };

/**
 * Displays all imported PDF sections for ONE Holy Name, inline inside that
 * Holy Name's existing card (Section A accordion or Section B detail page).
 * Append-only: fetches every child record matching (sourceSection, sourceNameKey),
 * ordered by PDF file then page so each source stays in manuscript order.
 * Sections are AUTO-GROUPED by their classified category (section_type) so all
 * imported knowledge is organized into the appropriate sections automatically.
 * Visual content (wafq, tables, diagrams) images are displayed inline.
 */
export default function HolyNameImportedSections({ sourceSection, sourceNameKey, refreshKey = 0 }) {
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    base44.entities.HolyNameImportedSection
      .filter({ source_section: sourceSection, source_name_key: String(sourceNameKey) }, null, 500)
      .then((raw) => {
        if (!alive) return;
        const secs = (raw || []).slice().sort((a, b) => {
          const fa = (a.source_pdf_file || "").localeCompare(b.source_pdf_file || "");
          if (fa !== 0) return fa;
          return (a.source_pdf_page || 0) - (b.source_pdf_page || 0);
        });
        setSections(secs);
      })
      .catch(() => { if (alive) setSections([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [sourceSection, sourceNameKey, refreshKey]);

  // Group sections by their classified category, in display order
  const grouped = useMemo(() => {
    if (!sections || sections.length === 0) return [];
    const map = {};
    for (const s of sections) {
      const cat = s.section_type || "other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    }
    // Known types shown first in preferred order; new/future types appended alphabetically.
    const allCats = Object.keys(map);
    const known = CATEGORY_ORDER.filter((cat) => map[cat]);
    const unknown = allCats.filter((cat) => !CATEGORY_ORDER.includes(cat)).sort();
    return [...known, ...unknown].map((cat) => ({
      category: cat,
      label: SECTION_LABELS[cat] || cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      items: map[cat],
    }));
  }, [sections]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3" style={{ borderTop: "1px solid " + P.faint }}>
        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: P.dim }} />
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>Loading imported knowledge…</span>
      </div>
    );
  }

  if (!sections || sections.length === 0) return null;

  return (
    <div className="pt-3 mt-1" style={{ borderTop: "1px solid " + P.faint }}>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-3.5 h-3.5" style={{ color: P.text }} />
        <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: P.text }}>
          PDF Knowledge · {sections.length} section{sections.length > 1 ? "s" : ""} · {grouped.length} categor{grouped.length > 1 ? "ies" : "y"}
        </span>
      </div>

      <div className="space-y-3">
        {grouped.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(gi * 0.04, 0.2), duration: 0.2 }}
            className="space-y-2"
          >
            {/* Category header */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: P.text }} />
              <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: P.text }}>
                {group.label}
              </span>
              <span className="font-inter text-[8px]" style={{ color: P.dim }}>· {group.items.length}</span>
            </div>

            {/* Sections in this category */}
            <AnimatePresence mode="popLayout">
              {group.items.map((s, i) => (
                <motion.div
                  key={s.section_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.2), duration: 0.2 }}
                  className="rounded-xl border p-3 space-y-2"
                  style={{ background: "rgba(8,16,38,0.6)", borderColor: P.border }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-inter text-[8px]" style={{ color: P.dim }}>
                      {LANG_LABELS[s.language] || s.language}
                    </span>
                    {s.has_visual && (
                      <span className="flex items-center gap-1 font-inter text-[8px] uppercase tracking-widest" style={{ color: P.text }}>
                        <ImageIcon className="w-3 h-3" /> Visual
                      </span>
                    )}
                  </div>

                  {s.arabic_text && (
                    <div className="space-y-1">
                      <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.50)" }}>Original Arabic text</span>
                      <p className="font-amiri text-lg leading-loose whitespace-pre-wrap selectable" style={{ color: "rgba(255,255,255,0.92)" }} dir="rtl">
                        {s.arabic_text}
                      </p>
                    </div>
                  )}

                  {s.malayalam_translation && (
                    <div className="space-y-1 pt-1 border-t" style={{ borderColor: "rgba(212,175,55,0.10)" }}>
                      <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.50)" }}>Malayalam translation</span>
                      <p className="font-malayalam text-sm leading-relaxed whitespace-pre-wrap selectable" style={{ color: "rgba(255,255,255,0.80)" }} dir="auto">
                        {s.malayalam_translation}
                      </p>
                    </div>
                  )}

                  {s.text_content && (
                    <details className="pt-1 border-t" style={{ borderColor: "rgba(212,175,55,0.10)" }}>
                      <summary className="cursor-pointer font-inter text-[7px] uppercase tracking-widest py-1" style={{ color: "rgba(212,175,55,0.50)" }}>Original book content</summary>
                      <p className="font-amiri text-sm leading-loose whitespace-pre-wrap selectable mt-1" style={{ color: "rgba(255,255,255,0.70)" }} dir="auto">
                        {s.text_content}
                      </p>
                    </details>
                  )}

                  {s.images && s.images.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: "rgba(212,175,55,0.10)" }}>
                      <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.50)" }}>Visual content from page</span>
                      <div className="grid grid-cols-1 gap-2">
                        {s.images.map((imgUrl, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={imgUrl}
                            alt={`Page ${s.source_pdf_page} visual content`}
                            className="w-full rounded-lg border"
                            style={{ borderColor: P.border, background: "rgba(8,16,38,0.4)" }}
                            loading="lazy"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1 border-t flex-wrap" style={{ borderColor: "rgba(212,175,55,0.12)" }}>
                    <FileText className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(212,175,55,0.40)" }} />
                    <span className="font-inter text-[8px] truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
                      {s.source_pdf_file || "PDF"} · Page {s.source_pdf_page || "?"}
                    </span>
                    {s.import_date && (
                      <span className="font-inter text-[8px] truncate" style={{ color: "rgba(255,255,255,0.30)" }}>
                        · {new Date(s.import_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}