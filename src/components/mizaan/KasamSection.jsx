import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// ── Section 4: KASAM (القسم) ──────────────────────────────────────────────────
// COMPLETELY ISOLATED — reads no data from Sections 1, 2, or 3.
// Display only. No calculations. Future Kasam logic added here later.
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
};

const KASAM_SUBSECTIONS = [
  { id: "muhabbet",   label: "Muhabbet Kasam",    arabic: "قسم المحبة",       icon: "❤" },
  { id: "adavet",     label: "Adavet Kasam",       arabic: "قسم العداوة",      icon: "⚔" },
  { id: "sihir",      label: "Sihir Bozma Kasam",  arabic: "قسم كسر السحر",    icon: "🔒" },
  { id: "bagli",      label: "Bagli Cozme Kasam",  arabic: "قسم حل الربط",     icon: "🔗" },
  { id: "uyku",       label: "Uyku Kasam",         arabic: "قسم النوم",        icon: "☽" },
];

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

function KasamSubsection({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: open ? G.goldBorderHi : G.goldBorder,
        background: open
          ? "linear-gradient(145deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)"
          : G.bgInner,
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none" style={{ color: G.goldDim }}>{item.icon}</span>
          <div>
            <p className="font-inter text-[11px] font-bold uppercase tracking-widest" style={{ color: G.gold }}>
              {item.label}
            </p>
            <p className="font-amiri text-base font-bold leading-tight mt-0.5" style={{ color: G.goldDim }} dir="rtl">
              {item.arabic}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: open ? G.gold : G.goldDim }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Expandable placeholder body */}
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
            <div
              className="mx-4 mb-4 rounded-xl border flex flex-col items-center justify-center py-8 gap-2"
              style={{ background: G.bg, borderColor: G.goldBorder, borderStyle: "dashed" }}
            >
              <span className="font-amiri text-2xl" style={{ color: G.goldDim }}>{item.icon}</span>
              <p className="font-amiri text-base font-bold" style={{ color: G.goldDim }} dir="rtl">
                {item.arabic}
              </p>
              <p className="font-inter text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.20)" }}>
                Kasam text — coming soon
              </p>
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
        <div
          className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}
        >
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>
            Section 4 — Kasam
          </span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2
          className="font-amiri text-xl font-bold"
          style={{ color: G.gold, lineHeight: 1.7, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}
        >
          القسم
        </h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>
          Kasam & Azimet Texts
        </p>
      </div>

      <OrnamentalDivider />

      {/* Subsections */}
      <div className="px-4 pb-6 pt-2 space-y-3">
        {KASAM_SUBSECTIONS.map((item, i) => (
          <KasamSubsection key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />
    </motion.div>
  );
}