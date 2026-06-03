// ═══════════════════════════════════════════════════════════════
// FALNAMEH RESULT MODAL COMPONENT
// Displays selected letter result with verse and interpretation
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FALNAMEH_VERSES } from "../../lib/falnamehSheikhBahaiData";

const P = {
  border:   "rgba(160,100,220,0.40)",
  borderHi: "rgba(180,120,255,0.70)",
  glow:     "rgba(160,100,220,0.25)",
  glowHi:   "rgba(180,120,255,0.55)",
  text:     "#D8B4FE",
  dim:      "rgba(216,180,254,0.55)",
  faint:    "rgba(216,180,254,0.18)",
  bg:       "rgba(160,100,220,0.07)",
  bgHi:     "rgba(160,100,220,0.16)",
  gold:     "#D4AF37",
};

export default function FalnamehResultModal({ question, letter, cellNumber, lang, onClose }) {
  const verseData = FALNAMEH_VERSES[letter];

  return (
    <AnimatePresence>
      <motion.div
        key="result-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 pb-4 sm:pb-0"
        style={{ background: "rgba(0,0,0,0.84)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          key="result-panel"
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.30, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
            borderColor: P.borderHi,
            boxShadow: `0 0 80px ${P.glow}, 0 8px 48px rgba(0,0,0,0.80), inset 0 1px 0 rgba(216,180,254,0.10)`,
            maxHeight: "88vh",
            overflowY: "auto",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border z-10"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl border mx-auto flex items-center justify-center"
                style={{
                  background: P.bgHi,
                  borderColor: P.borderHi,
                  boxShadow: `0 0 40px ${P.glow}`,
                }}>
                <span className="font-amiri font-bold text-3xl" style={{ color: P.gold }}>{letter}</span>
              </div>
              {cellNumber && (
                <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.faint }}>
                  {lang === "ml" ? `സെൽ ${cellNumber}` : `Cell ${cellNumber}`}
                </span>
              )}
              <span className="font-inter text-[9px] uppercase tracking-[0.28em]" style={{ color: P.dim }}>
                {lang === "ml" ? `ചോദ്യം ${question.id}` : `Question ${question.id}`}
              </span>
              <h2 className="font-amiri font-bold text-xl" style={{ color: P.text }}>{question.persianTitle}</h2>
              <p className="font-inter text-[9px]" style={{ color: P.dim }}>
                {lang === "ml" ? question.malayalamTitle : question.englishTitle}
              </p>
            </div>

            {/* Persian Verse */}
            <div className="rounded-2xl border p-4 text-center"
              style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                {lang === "ml" ? "◈ പേർഷ്യൻ വാക്യം" : "◈ Persian Verse"}
              </p>
              <p className="font-amiri text-lg leading-relaxed" dir="rtl" style={{ color: P.gold }}>
                {verseData?.persian || "..."}
              </p>
            </div>

            {/* Meaning */}
            <div className="rounded-2xl border p-4"
              style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                {lang === "ml" ? "◈ അർത്ഥം" : "◈ Meaning"}
              </p>
              <p className="font-amiri text-base leading-relaxed" style={{ color: P.text }}>
                {lang === "ml" ? verseData?.ml?.meaning : verseData?.en?.meaning}
              </p>
            </div>

            {/* Interpretation */}
            <div className="rounded-2xl border p-4"
              style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                {lang === "ml" ? "☽ വ്യാഖ്യാനം" : "☽ Interpretation"}
              </p>
              <p className="font-amiri text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                {lang === "ml" ? verseData?.ml?.interpretation : verseData?.en?.interpretation}
              </p>
            </div>

            {/* Footer */}
            <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-2" style={{ color: P.faint }}>
              فالنامه شیخ بهایی — Falnameh Sheikh Bahai
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}