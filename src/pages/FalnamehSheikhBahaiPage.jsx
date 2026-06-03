// ═══════════════════════════════════════════════════════════════
// FALNAMEH SHEIKH BAHAI — Independent Page
// Separate from Faal Hasrath Ali and Faal Luqman
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, CheckCircle, AlertCircle, TestTube } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FALNAMEH_QUESTIONS, FALNAMEH_VERSES, PERSIAN_LETTERS } from "../lib/falnamehSheikhBahaiData";
import { FALNAMEH_GRIDS_ARRAY } from "../lib/falnamehGrids.js";

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

// ── Language Toggle ────────────────────────────────────────────
function LangToggle({ lang, setLang }) {
  return (
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
  );
}

// ── Question Card ─────────────────────────────────────────────
function QuestionCard({ question, index, lang }) {
  return (
    <a href={`/falnameh-question-detail?question=${question.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.02, duration: 0.25 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-2xl border p-3 text-center"
        style={{
          background: P.bg,
          borderColor: P.faint,
          boxShadow: `0 0 12px ${P.glow}`,
          minHeight: 90,
        }}
      >
        <span className="font-inter text-[8px] uppercase tracking-widest mb-1 block" style={{ color: P.gold }}>
          سؤال {question.id}
        </span>
        <p className="font-amiri font-bold text-xs mb-1" style={{ color: P.text, lineHeight: 1.5 }}>
          {question.persianTitle}
        </p>
        <p className="font-inter text-[8px]" style={{ color: P.dim }}>
          {lang === "ml" ? question.malayalamTitle : question.englishTitle}
        </p>
      </motion.div>
    </a>
  );
}

// ── Letter Grid Cell ──────────────────────────────────────────
function LetterCell({ letter, index, isSelected, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(letter)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.01, duration: 0.15 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-lg border flex items-center justify-center aspect-square"
      style={{
        background: isSelected ? P.bgHi : P.bg,
        borderColor: isSelected ? P.borderHi : P.faint,
        boxShadow: isSelected ? `0 0 12px ${P.glowHi}` : "none",
      }}
    >
      <span className="font-amiri text-xs" style={{
        color: isSelected ? P.gold : P.text,
        textShadow: isSelected ? `0 0 8px ${P.gold}` : "none",
      }}>
        {letter}
      </span>
    </motion.button>
  );
}

// ── Result Modal ──────────────────────────────────────────────
function ResultModal({ result, lang, onClose, verificationMode, setVerificationMode, verificationData }) {
  if (!result) return null;

  const verseData = FALNAMEH_VERSES[result.letter];

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
                <span className="font-amiri font-bold text-3xl" style={{ color: P.gold }}>{result.letter}</span>
              </div>
              <span className="font-inter text-[9px] uppercase tracking-[0.28em]" style={{ color: P.dim }}>
                {lang === "ml" ? `ചോദ്യം ${result.question.id}` : `Question ${result.question.id}`}
              </span>
              <h2 className="font-amiri font-bold text-xl" style={{ color: P.text }}>{result.question.persianTitle}</h2>
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

            {/* Verification Results Panel */}
            {verificationMode && verificationData && (
              <div className="rounded-2xl border p-4 space-y-3"
                style={{
                  background: verificationData.isMatch 
                    ? "rgba(34,197,94,0.08)" 
                    : "rgba(239,68,68,0.08)",
                  borderColor: verificationData.isMatch 
                    ? "rgba(34,197,94,0.40)" 
                    : "rgba(239,68,68,0.40)",
                }}>
                <div className="flex items-center gap-2 mb-2">
                  {verificationData.isMatch ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <p className="font-inter text-[9px] uppercase tracking-widest font-bold"
                    style={{ color: verificationData.isMatch ? "#22c55e" : "#ef4444" }}>
                    {lang === "ml" ? "വാക്യം പരിശോധന" : "Verse Verification"}
                  </p>
                </div>

                {/* Collected Letters */}
                <div className="space-y-1">
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>
                    {lang === "ml" ? "ശേഖരിച്ച അക്ഷരങ്ങൾ (ഓരോ 6-ാമത്തെയും):" : "Collected Letters (every 6th):"}
                  </p>
                  <p className="font-amiri text-sm leading-relaxed" dir="rtl" style={{ color: P.text }}>
                    {verificationData.collectedLetters.join(" ← ")}
                  </p>
                </div>

                {/* Odd/Even Split */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: P.gold }}>
                      {lang === "ml" ? "ഒറ്റ സ്ഥാനങ്ങൾ" : "Odd Positions"}
                    </p>
                    <p className="font-amiri text-xs leading-relaxed" dir="rtl" style={{ color: P.text }}>
                      {verificationData.oddLetters.join(" ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: P.gold }}>
                      {lang === "ml" ? "ഇരട്ട സ്ഥാനങ്ങൾ" : "Even Positions"}
                    </p>
                    <p className="font-amiri text-xs leading-relaxed" dir="rtl" style={{ color: P.text }}>
                      {verificationData.evenLetters.join(" ")}
                    </p>
                  </div>
                </div>

                {/* Merged Verse */}
                <div>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>
                    {lang === "ml" ? "ചേർത്തുവെച്ച വാക്യം:" : "Merged Verse:"}
                  </p>
                  <p className="font-amiri text-sm leading-relaxed" dir="rtl" style={{ color: P.text }}>
                    {verificationData.mergedLetters.join("")}
                  </p>
                </div>

                {/* Comparison */}
                <div className="space-y-2 pt-2 border-t" style={{ borderColor: P.faint }}>
                  <div className="flex items-center justify-between">
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>
                      {lang === "ml" ? "പുനർനിർമ്മിച്ച വാക്യം:" : "Reconstructed Verse:"}
                    </p>
                    <span className={`font-inter text-xs font-bold px-2 py-0.5 rounded ${
                      verificationData.matchPercentage >= 85 
                        ? "bg-green-600 text-white" 
                        : "bg-red-600 text-white"
                    }`}>
                      {verificationData.matchPercentage}% {lang === "ml" ? "യോജിപ്പ്" : "Match"}
                    </span>
                  </div>
                  <p className="font-amiri text-xs leading-relaxed" dir="rtl" style={{ color: verificationData.isMatch ? "#22c55e" : "#ef4444" }}>
                    {verificationData.reconstructedVerse || "..."}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>
                    {lang === "ml" ? "സൂക്ഷിച്ച വാക്യം:" : "Stored Verse:"}
                  </p>
                  <p className="font-amiri text-xs leading-relaxed" dir="rtl" style={{ color: P.gold }}>
                    {verificationData.storedVerse || "..."}
                  </p>
                </div>

                {/* Error Warning */}
                {!verificationData.isMatch && (
                  <div className="rounded-xl border p-3 mt-2"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      borderColor: "rgba(239,68,68,0.30)",
                    }}>
                    <p className="font-inter text-[7px] uppercase tracking-widest font-bold mb-1"
                      style={{ color: "#ef4444" }}>
                      ⚠ {lang === "ml" ? "എക്സ്ട്രാക്ഷൻ പിശക് കണ്ടെത്തി" : "Extraction Error Detected"}
                    </p>
                    <p className="font-inter text-[7px] leading-relaxed" style={{ color: "rgba(239,68,68,0.80)" }}>
                      {lang === "ml" 
                        ? "ഈ ഗ്രിഡിലെ അക്ഷരങ്ങൾ ശരിയായി എക്സ്ട്രാക്ട് ചെയ്തിട്ടില്ല. മാനുസ്ക്രിപ്ത് പേജ് വീണ്ടും പരിശോധിക്കുക."
                        : "This grid contains extraction errors. Please re-verify the manuscript page."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Verification Mode Toggle */}
            <div className="rounded-2xl border p-4" style={{ background: P.bg, borderColor: P.faint }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TestTube className="w-4 h-4" style={{ color: P.gold }} />
                  <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.gold }}>
                    {lang === "ml" ? "◈ പരിശോധനാ രീതി" : "◈ Verification Mode"}
                  </p>
                </div>
                <button
                  onClick={() => setVerificationMode(prev => !prev)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    verificationMode ? "bg-green-600 text-white" : "bg-slate-600 text-white/60"
                  }`}
                >
                  {verificationMode ? (lang === "ml" ? "സജീവം" : "ON") : (lang === "ml" ? "നിഷ്ക്രിയം" : "OFF")}
                </button>
              </div>
              <p className="font-inter text-[8px] leading-relaxed" style={{ color: P.dim }}>
                {lang === "ml" 
                  ? "സജീവമാക്കുമ്പോൾ, ഓരോ അക്ഷരം തിരഞ്ഞെടുത്താലും 6-ാമത്തെ അക്ഷരങ്ങൾ ശേഖരിച്ച് വാക്യം പുനർനിർമ്മിച്ച് പരിശോധിക്കും."
                  : "When enabled, collects every 6th letter after selection to reconstruct and verify the Persian verse."}
              </p>
            </div>

            <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-2" style={{ color: P.faint }}>
              فالنامه شیخ بهایی — Falnameh Sheikh Bahai
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function FalnamehSheikhBahaiPage() {
  const [lang, setLang] = useState("ml");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const handleSelectLetter = (letter) => {
    setSelectedLetter(letter);
    setTimeout(() => {
      const resultData = { question: selectedQuestion, letter };
      setResult(resultData);
      
      // Run verification if mode is enabled
      if (verificationMode && selectedQuestion) {
        const verification = runVerification(selectedQuestion.id, letter);
        setVerificationData(verification);
      }
    }, 300);
  };

  const handleCloseResult = () => {
    setResult(null);
    setSelectedLetter(null);
    setSelectedQuestion(null);
    setVerificationData(null);
  };

  // ═══════════════════════════════════════════════════════════
  // VERIFICATION MODE: Collect every 6th letter, split odd/even,
  // merge according to Sheikh Bahai method, compare with stored verse
  // ═══════════════════════════════════════════════════════════
  const runVerification = (questionId, selectedLetter) => {
    const gridIndex = questionId - 1;
    const grid = FALNAMEH_GRIDS_ARRAY[gridIndex];
    
    if (!grid) return null;

    // Flatten grid to array (row-major order)
    const flatLetters = grid.flat();
    
    // Collect every 6th letter starting from selected letter's position
    const selectedIndex = flatLetters.indexOf(selectedLetter);
    if (selectedIndex === -1) return null;

    const collectedLetters = [];
    for (let i = selectedIndex; i < flatLetters.length; i += 6) {
      collectedLetters.push(flatLetters[i]);
    }

    // Split into odd and even positions (1-indexed)
    const oddLetters = collectedLetters.filter((_, i) => (i + 1) % 2 !== 0);
    const evenLetters = collectedLetters.filter((_, i) => (i + 1) % 2 === 0);

    // Merge: interleave odd and even (Sheikh Bahai method)
    const mergedLetters = [];
    const maxLen = Math.max(oddLetters.length, evenLetters.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < oddLetters.length) mergedLetters.push(oddLetters[i]);
      if (i < evenLetters.length) mergedLetters.push(evenLetters[i]);
    }

    // Reconstruct Persian verse from merged letters
    const reconstructedVerse = mergedLetters.join("");

    // Get stored verse for comparison
    const storedVerse = FALNAMEH_VERSES[selectedLetter]?.persian || "";

    // Calculate match percentage (character-by-character)
    const maxLenCompare = Math.max(reconstructedVerse.length, storedVerse.length);
    let matchCount = 0;
    for (let i = 0; i < maxLenCompare; i++) {
      if (reconstructedVerse[i] === storedVerse[i]) matchCount++;
    }
    const matchPercentage = Math.round((matchCount / maxLenCompare) * 100);

    return {
      collectedLetters,
      oddLetters,
      evenLetters,
      mergedLetters,
      reconstructedVerse,
      storedVerse,
      matchPercentage,
      isMatch: matchPercentage >= 85,
    };
  };

  return (
    <PageLayout>
      <div className="space-y-4">

        <PageTitle
          arabic="فالنامه شیخ بهایی"
          latin="FALNAMEH SHEIKH BAHAI"
          subtitle="Persian Divination System"
          icon="📜"
        />

        <LangToggle lang={lang} setLang={setLang} />

        {/* Instruction Panel */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border px-4 py-3 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(160,100,220,0.12) 0%, rgba(160,100,220,0.06) 100%)",
            borderColor: P.border,
            boxShadow: `0 0 20px ${P.glow}, inset 0 1px 0 rgba(216,180,254,0.08)`,
          }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between gap-2"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📜</span>
              <h3 className="font-amiri font-bold text-base" style={{ color: P.text }}>
                {lang === "ml" ? "ഫൽനാമെ ഷെയ്ഖ് ബഹായ് - രീതി" : "FALNAMEH SHEIKH BAHAI — Method"}
              </h3>
            </div>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm"
              style={{ color: P.text }}
            >
              ▼
            </motion.span>
          </button>
          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2 text-sm">
            {lang === "ml" ? (
              <>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  1. സൂറത്ത് അൽ-ഫാതിഹ ഓതുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  2. അതിന്റെ സവാബ് റസൂലുല്ലാഹ് ﷺ യ്ക്ക് ഹദിയ ചെയ്യുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  3. ഒരു ഫാതിഹ ഓതി അഹ്‌ലുൽ ബൈത്തിന് ഹദിയ ചെയ്യുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  4. ഒരു ഫാതിഹ ഓതി സഹാബാക്കൾക്ക് ഹദിയ ചെയ്യുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  5. ഒരു ഫാതിഹ ഓതി ഹസ്രത്ത് അലി (റ) യ്ക്ക് ഹദിയ ചെയ്യുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  6. ഒരു ഫാതിഹ ഓതി ഷെയ്ഖ് ബഹായ് (റ) യ്ക്ക് ഹദിയ ചെയ്യുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  7. കണ്ണടയ്ക്കുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  8. കലിമാ ശരീഫ് ചൊല്ലി കലിമാവിരൽ ഉയർത്തുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  9. സൂറത്ത് അൽ-ഇഖ്‌ലാസ്, സൂറത്ത് അൽ-ഫലഖ്, സൂറത്ത് അൻ-നാസ് (3 കുൽ സൂറത്തുകൾ) ഓതുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  10. മനസ്സിൽ ഉദ്ദേശിക്കുന്ന കാര്യം കരുതുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  11. 26 ചോദ്യങ്ങളിൽ നിന്ന് ഒന്ന് തിരഞ്ഞെടുക്കുക.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  12. 18×12 ഗ്രിഡിൽ നിന്ന് ഒരു അക്ഷരം തിരഞ്ഞെടുക്കുക.
                </p>
                <p className="font-inter text-xs leading-relaxed font-semibold" style={{ color: P.text }}>
                  13. പേർഷ്യൻ വാക്യവും വ്യാഖ്യാനവും വായിക്കുക.
                </p>
              </>
            ) : (
              <>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  1. Recite Surah Al-Fatihah.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  2. Gift its reward to Prophet Muhammad ﷺ.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  3. Recite one Fatihah and gift its reward to Ahlul Bayt.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  4. Recite one Fatihah and gift its reward to the Sahabah.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  5. Recite one Fatihah and gift its reward to Hazrat Ali (RA).
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  6. Recite one Fatihah and gift its reward to Sheikh Bahai (RA).
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  7. Close your eyes.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  8. Recite the Kalimah and raise your index finger.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  9. Recite the three Qul Surahs: Surah Al-Ikhlas, Surah Al-Falaq, Surah An-Nas.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  10. Keep your intention firmly in your heart.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  11. Select one question from the 26 questions.
                </p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                  12. Select one letter from the 18×12 grid.
                </p>
                <p className="font-inter text-xs leading-relaxed font-semibold" style={{ color: "rgba(216,180,254,0.95)" }}>
                  13. Read the Persian verse and interpretation.
                </p>
              </>
            )}
            </div>
          </motion.div>
        </motion.div>

        {/* Question Selector or Grid View */}
        {!selectedQuestion ? (
          <div className="space-y-4">
            <div className="rounded-2xl border px-4 py-3 text-center"
              style={{
                background: P.bg,
                borderColor: P.border,
                boxShadow: `0 0 20px ${P.glow}`,
              }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>
                {lang === "ml" ? "ഒരു ചോദ്യം തിരഞ്ഞെടുക്കുക" : "Select a Question"}
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "10px",
            }}>
              {FALNAMEH_QUESTIONS.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  lang={lang}
                />
              ))}
            </div>

            <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: P.faint }}>
              ൨൬ ചോദ്യങ്ങൾ — 26 Questions
            </p>
          </div>
        ) : (
          /* Grid View */
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setSelectedQuestion(null)}
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
              </button>
              <div className="flex-1 text-center">
                <p className="font-amiri font-bold text-sm" style={{ color: P.text }}>
                  {selectedQuestion.persianTitle}
                </p>
                <p className="font-inter text-[9px]" style={{ color: P.dim }}>
                  {lang === "ml" ? selectedQuestion.malayalamTitle : selectedQuestion.englishTitle}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border p-3"
              style={{
                background: P.bg,
                borderColor: P.border,
                boxShadow: `0 0 24px ${P.glow}`,
              }}>
              <p className="font-inter text-[8px] uppercase tracking-widest text-center mb-3" style={{ color: P.gold }}>
                {lang === "ml" ? "അക്ഷരം തിരഞ്ഞെടുക്കുക" : "Select a Letter"}
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(18, 1fr)",
                gap: "3px",
              }}>
                {PERSIAN_LETTERS.map((letter, i) => (
                  <LetterCell
                    key={i}
                    letter={letter}
                    index={i}
                    isSelected={selectedLetter === letter}
                    onSelect={handleSelectLetter}
                  />
                ))}
              </div>
            </div>

            <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: P.faint }}>
              ൧൮ × ൧൨ = ൨൧൬ അക്ഷരങ്ങൾ
            </p>
          </div>
        )}

        {/* Result Modal */}
        <ResultModal 
          result={result} 
          lang={lang} 
          onClose={handleCloseResult} 
          verificationMode={verificationMode}
          setVerificationMode={setVerificationMode}
          verificationData={verificationData}
        />

      </div>
    </PageLayout>
  );
}