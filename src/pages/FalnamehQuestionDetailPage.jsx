// ═══════════════════════════════════════════════════════════════
// FALNAMEH QUESTION DETAIL PAGE
// Shows 18×12 grid for a specific question
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { FALNAMEH_QUESTIONS, FALNAMEH_VERSES } from "../lib/falnamehSheikhBahaiData";

// ── Color Palette ─────────────────────────────────────────────
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
  gold:     "#F4D03F",
};

// ── Letter Grid Cell ──────────────────────────────────────────
function LetterCell({ letter, index, isSelected, onSelect, disabled }) {
  return (
    <motion.button
      onClick={() => !disabled && onSelect(letter)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.01, duration: 0.15 }}
      whileHover={!disabled ? { scale: 1.12 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className="rounded-lg border flex items-center justify-center aspect-square"
      style={{
        background: isSelected ? P.bgHi : disabled ? "rgba(0,0,0,0.3)" : P.bg,
        borderColor: isSelected ? P.borderHi : disabled ? "rgba(255,255,255,0.05)" : P.faint,
        boxShadow: isSelected ? `0 0 12px ${P.glowHi}` : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <span className="font-amiri text-xs" style={{
        color: isSelected ? P.gold : disabled ? "rgba(255,255,255,0.2)" : P.text,
        textShadow: isSelected ? `0 0 8px ${P.gold}` : "none",
      }}>
        {letter}
      </span>
    </motion.button>
  );
}

// ── Result Display Modal ──────────────────────────────────────
function ResultDisplay({ result, lang, onClose }) {
  if (!result) return null;

  const verseData = FALNAMEH_VERSES[result.finalLetter];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 pb-4 sm:pb-0"
        style={{ background: "rgba(0,0,0,0.84)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.30, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
            borderColor: P.borderHi,
            boxShadow: `0 0 80px ${P.glow}, 0 8px 48px rgba(0,0,0,0.80)`,
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
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl border mx-auto flex items-center justify-center"
                style={{
                  background: P.bgHi,
                  borderColor: P.borderHi,
                  boxShadow: `0 0 40px ${P.glow}`,
                }}>
                <span className="font-amiri font-bold text-3xl" style={{ color: P.gold }}>{result.finalLetter}</span>
              </div>
              <p className="font-inter text-[9px] uppercase tracking-[0.28em]" style={{ color: P.dim }}>
                {lang === "ml" ? `ഫലം` : `Result`}
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

            {/* Translation */}
            <div className="rounded-2xl border p-4"
              style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                {lang === "ml" ? "◈ മലയാളം തർജ്ജമ" : "◈ Translation"}
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function FalnamehQuestionDetailPage() {
  const [lang, setLang] = useState("ml");
  const [questionId, setQuestionId] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [result, setResult] = useState(null);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("question"));
    if (id && id >= 1 && id <= 26) {
      setQuestionId(id);
      // Placeholder grid data - to be replaced with actual 18x12 grids per question
      const placeholderLetters = Array.from({ length: 216 }, (_, i) => 
        String.fromCharCode(65 + (i % 26))
      );
      setGridData(placeholderLetters);
    }
  }, []);

  const question = questionId ? FALNAMEH_QUESTIONS.find(q => q.id === questionId) : null;

  const handleSelectLetter = (letter) => {
    setSelectedLetter(letter);
    // Placeholder: In future, this will trigger the Sheikh Bahai algorithm
    // For now, just show a result based on the selected letter
    setTimeout(() => {
      setResult({ finalLetter: letter });
    }, 300);
  };

  if (!question) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-inter text-sm" style={{ color: P.dim }}>Loading...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* Header with Back Button */}
        <div className="flex items-center gap-2 mb-2">
          <a
            href="/falnameh-sheikh-bahai"
            className="p-2 rounded-xl border flex items-center gap-1"
            style={{
              background: P.bg,
              borderColor: P.faint,
              color: P.text,
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-inter text-xs uppercase tracking-widest">
              {lang === "ml" ? "മടങ്ങുക" : "Back"}
            </span>
          </a>
          <div className="flex-1 text-center">
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.gold }}>
              سؤال {question.id}
            </p>
            <p className="font-amiri font-bold text-base" style={{ color: P.text }}>
              {question.persianTitle}
            </p>
            <p className="font-inter text-[9px]" style={{ color: P.dim }}>
              {lang === "ml" ? question.malayalamTitle : question.englishTitle}
            </p>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center justify-center">
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: P.faint }}>
            {["ml", "en"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-4 py-1.5 font-inter text-xs font-semibold tracking-widest uppercase transition-all"
                style={{
                  background: lang === l ? P.bgHi : "transparent",
                  color: lang === l ? P.text : "rgba(216,180,254,0.35)",
                  borderRight: l === "ml" ? `1px solid ${P.faint}` : "none",
                }}
              >
                {l === "ml" ? "മലയാളം" : "English"}
              </button>
            ))}
          </div>
        </div>

        {/* Instruction */}
        <div className="rounded-2xl border px-4 py-3 text-center"
          style={{
            background: P.bg,
            borderColor: P.border,
            boxShadow: `0 0 20px ${P.glow}`,
          }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.gold }}>
            {lang === "ml" ? "തുടങ്ങാൻ ഒരു അക്ഷരം തിരഞ്ഞെടുക്കുക" : "Select a Starting Letter"}
          </p>
        </div>

        {/* 18×12 Grid */}
        <div className="rounded-2xl border p-3"
          style={{
            background: P.bg,
            borderColor: P.border,
            boxShadow: `0 0 24px ${P.glow}`,
          }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(18, 1fr)",
            gap: "3px",
          }}>
            {gridData.map((letter, i) => (
              <LetterCell
                key={i}
                letter={letter}
                index={i}
                isSelected={selectedLetter === letter}
                onSelect={handleSelectLetter}
                disabled={false}
              />
            ))}
          </div>
        </div>

        <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: P.faint }}>
          ൧൮ × ൧൨ = ൨൧൬ അക്ഷരങ്ങൾ
        </p>

        {/* Result Modal */}
        <ResultDisplay result={result} lang={lang} onClose={() => setResult(null)} />

      </div>
    </PageLayout>
  );
}