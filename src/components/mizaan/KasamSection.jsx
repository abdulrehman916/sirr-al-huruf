import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, AlertTriangle, FileText } from "lucide-react";
import { KASAM_CATEGORIES } from "../../lib/kasamData";

// ── Section 4: KASAM (القسم) ──────────────────────────────────────────────────
// COMPLETELY ISOLATED from Sections 1, 2, 3.
// No calculations. No engine calls. Display only.
// Source authority: PDF manuscripts only. No AI-generated text.
// ─────────────────────────────────────────────────────────────────────────────

const G = {
  bg:           "rgba(5, 12, 28, 0.97)",
  bgInner:      "rgba(10, 20, 45, 0.95)",
  gold:         "#D4AF37",
  goldDim:      "rgba(212,175,55,0.65)",
  goldBorder:   "rgba(212,175,55,0.22)",
  goldBorderHi: "rgba(212,175,55,0.48)",
  goldFaint:    "rgba(212,175,55,0.06)",
  glow:         "rgba(212,175,55,0.10)",
  dim:          "rgba(255,255,255,0.35)",
  warn:         "rgba(251,191,36,0.85)",
  warnBg:       "rgba(251,191,36,0.07)",
  warnBorder:   "rgba(251,191,36,0.25)",
};

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: G.goldBorder }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.goldFaint, border: `1px solid ${G.goldBorder}` }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: G.goldBorder }} />
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

// Single Kasam entry display card
function KasamEntry({ entry }) {
  const isPending = entry.status === "pending" || !entry.arabic;
  const isIncomplete = entry.status === "pdf_incomplete";

  if (isPending) {
    return (
      <div
        className="rounded-xl border px-4 py-4 flex items-start gap-3"
        style={{ background: G.warnBg, borderColor: G.warnBorder, borderStyle: "dashed" }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G.warn }} />
        <div>
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: G.warn }}>
            PDF SOURCE INCOMPLETE
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.30)" }}>
            {entry.source}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: G.goldBorder, background: G.bgInner }}>
      {/* Arabic text — primary source */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: G.goldBorder }}>
        <p className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.goldDim }}>
          Arabic — Original Text
        </p>
        <p
          className="font-amiri text-xl font-bold leading-loose text-right"
          dir="rtl"
          style={{ color: G.gold, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}
        >
          {entry.arabic}
        </p>
      </div>

      {/* Malayalam translation */}
      {entry.malayalam && (
        <div className="px-4 py-3 border-b" style={{ borderColor: G.goldBorder }}>
          <p className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.goldDim }}>
            Malayalam — Meaning
          </p>
          <p className="font-amiri text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
            {entry.malayalam}
          </p>
        </div>
      )}

      {/* Source + Notes */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        {entry.source && (
          <div className="flex items-start gap-2">
            <BookOpen className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: G.goldDim }} />
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
              {entry.source}
            </p>
          </div>
        )}
        {entry.notes && (
          <div className="flex items-start gap-2">
            <FileText className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: G.goldDim }} />
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
              {entry.notes}
            </p>
          </div>
        )}
        {isIncomplete && (
          <div className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg" style={{ background: G.warnBg, border: `1px solid ${G.warnBorder}` }}>
            <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: G.warn }} />
            <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.warn }}>
              PDF SOURCE INCOMPLETE — partial text shown above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Collapsible category card
function KasamCategory({ cat, index }) {
  const [open, setOpen] = useState(false);
  const hasVerified = cat.entries.some(e => e.status === "verified" && e.arabic);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: open ? G.goldBorderHi : G.goldBorder,
        background: open
          ? "linear-gradient(145deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)"
          : G.bgInner,
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-lg leading-none flex-shrink-0" style={{ color: G.goldDim }}>{cat.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-inter text-[11px] font-bold uppercase tracking-widest" style={{ color: G.gold }}>
                {cat.label}
              </p>
              {/* Status badge */}
              <span
                className="font-inter text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                style={
                  hasVerified
                    ? { color: "rgba(74,222,128,0.85)", borderColor: "rgba(74,222,128,0.30)", background: "rgba(74,222,128,0.07)" }
                    : { color: G.warn, borderColor: G.warnBorder, background: G.warnBg }
                }
              >
                {hasVerified ? "Verified" : "Pending PDF"}
              </span>
            </div>
            <p className="font-amiri text-base font-bold leading-tight mt-0.5" style={{ color: G.goldDim }} dir="rtl">
              {cat.arabic}
            </p>
            <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
              {cat.malayalamLabel} · {cat.description}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
          style={{ color: open ? G.gold : G.goldDim }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Expanded entries */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 space-y-3">
              {cat.entries.map((entry) => (
                <KasamEntry key={entry.id} entry={entry} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function KasamSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* Top accent line */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />

      {/* Title Banner */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>
            Section 4 — Kasam
          </span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-xl font-bold"
          style={{ color: G.gold, lineHeight: 1.7, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>
          القسم
        </h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>
          Kasam & Azimet Texts — PDF Source Only
        </p>
      </div>

      {/* PDF authority notice */}
      <div className="mx-4 mb-3 rounded-xl border px-4 py-2.5 flex items-start gap-2"
        style={{ background: G.warnBg, borderColor: G.warnBorder }}>
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: G.warn }} />
        <p className="font-inter text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          <span className="font-bold" style={{ color: G.warn }}>PDF AUTHORITY RULE: </span>
          All Kasam texts are sourced exclusively from verified PDF manuscripts.
          No AI-generated, web-sourced, or reconstructed text is permitted.
          Entries marked "Pending PDF" await verified source material.
        </p>
      </div>

      <OrnamentalDivider />

      {/* Category list */}
      <div className="px-4 pb-6 pt-2 space-y-3">
        {KASAM_CATEGORIES.map((cat, i) => (
          <KasamCategory key={cat.id} cat={cat} index={i} />
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />
    </motion.div>
  );
}