// ═══════════════════════════════════════════════════════════════
// FALNAMEH QUESTION DETAIL PAGE
// Shows 18×12 grid for a specific question
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { FALNAMEH_QUESTIONS, FALNAMEH_VERSES, FALNAMEH_GRIDS } from "../lib/falnamehSheikhBahaiData";

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

          <div className="p-6 space-y-4">

            {/* Final Letter */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl border mx-auto flex items-center justify-center"
                style={{ background: P.bgHi, borderColor: P.borderHi, boxShadow: `0 0 40px ${P.glow}` }}>
                <span className="font-amiri font-bold text-3xl" style={{ color: P.gold }}>{result.finalLetter}</span>
              </div>
              <p className="font-inter text-[9px] uppercase tracking-[0.28em]" style={{ color: P.dim }}>
                {lang === "ml" ? "അന്തിമ അക്ഷരം" : "Final Letter"}
              </p>
            </div>

            {/* Extraction Steps */}
            <div className="rounded-2xl border p-3 space-y-2" style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.gold }}>
                {lang === "ml" ? "◈ ശേഖരിച്ച അക്ഷരങ്ങൾ (ഓരോ 6-ാമത്)" : "◈ Extracted Letters (every 6th)"}
              </p>
              <p className="font-amiri text-sm leading-loose tracking-widest" dir="rtl" style={{ color: P.text }}>
                {result.extracted.join("  ")}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: P.faint }}>
                <div>
                  <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>
                    {lang === "ml" ? "ഒറ്റ" : "Odd"}
                  </p>
                  <p className="font-amiri text-xs leading-loose" dir="rtl" style={{ color: P.text }}>
                    {result.oddLetters.join(" ")}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>
                    {lang === "ml" ? "ഇരട്ട" : "Even"}
                  </p>
                  <p className="font-amiri text-xs leading-loose" dir="rtl" style={{ color: P.text }}>
                    {result.evenLetters.join(" ")}
                  </p>
                </div>
              </div>
              <div className="pt-1 border-t" style={{ borderColor: P.faint }}>
                <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>
                  {lang === "ml" ? "ലയിപ്പിച്ച ശ്രേണി → അവസാന അക്ഷരം:" : "Merged sequence → last letter:"}
                </p>
                <p className="font-amiri text-xs leading-loose" dir="rtl" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {result.mergedSequence.slice(0, -1).join(" ")}{" "}
                  <span style={{ color: P.gold, fontWeight: "bold", fontSize: "1.1em" }}>
                    {result.finalLetter}
                  </span>
                </p>
              </div>
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
      // Load the unique grid for this specific question (flatten 2D array to 216 letters)
      const grid = FALNAMEH_GRIDS[`GRID_${id}`];
      setGridData(grid ? grid.flat() : []);
    }
  }, []);

  const question = questionId ? FALNAMEH_QUESTIONS.find(q => q.id === questionId) : null;

  const handleSelectLetter = (letter) => {
    setSelectedLetter(letter);
    setTimeout(() => {
      setResult(runSheikhBahaiAlgorithm(gridData, letter));
    }, 300);
  };

  // ── Sheikh Bahai Falnameh Algorithm ──────────────────────────
  // 1. Find starting index of selected letter
  // 2. Collect every 6th letter (wrapping), starting from that index
  //    Stop after 36 steps (216 / 6 = one full cycle)
  // 3. Split collected letters into odd-position (1,3,5…) and even-position (2,4,6…)
  // 4. Write odd letters first, then even letters → merged sequence
  // 5. The LAST letter of the merged sequence is the final result letter
  function runSheikhBahaiAlgorithm(flat, startLetter) {
    const total = flat.length; // 216
    const startIndex = flat.indexOf(startLetter);
    if (startIndex === -1) return { finalLetter: startLetter, extracted: [], oddLetters: [], evenLetters: [], mergedSequence: [] };

    // Collect every 6th letter for a full cycle (36 steps)
    const steps = Math.floor(total / 6);
    const extracted = [];
    for (let i = 0; i < steps; i++) {
      extracted.push(flat[(startIndex + i * 6) % total]);
    }

    // Split by 1-indexed position: odd = index 0,2,4… | even = index 1,3,5…
    const oddLetters  = extracted.filter((_, i) => i % 2 === 0);
    const evenLetters = extracted.filter((_, i) => i % 2 !== 0);

    // Merge: all odd first, then all even
    const mergedSequence = [...oddLetters, ...evenLetters];

    // Final result = last letter of merged sequence
    const finalLetter = mergedSequence[mergedSequence.length - 1];

    return { finalLetter, extracted, oddLetters, evenLetters, mergedSequence };
  }

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