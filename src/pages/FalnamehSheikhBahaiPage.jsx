// ═══════════════════════════════════════════════════════════════
// FALNAMEH SHEIKH BAHAI — Independent Page
// Separate from Faal Hasrath Ali and Faal Luqman
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FALNAMEH_QUESTIONS, FALNAMEH_VERSES, PERSIAN_LETTERS } from "../lib/falnamehSheikhBahaiData";

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
function QuestionCard({ question, index, onSelect, lang }) {
  return (
    <motion.button
      onClick={() => onSelect(question)}
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
    </motion.button>
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
function ResultModal({ result, lang, onClose }) {
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

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const handleSelectLetter = (letter) => {
    setSelectedLetter(letter);
    setTimeout(() => {
      setResult({ question: selectedQuestion, letter });
    }, 300);
  };

  const handleCloseResult = () => {
    setResult(null);
    setSelectedLetter(null);
    setSelectedQuestion(null);
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
                  onSelect={handleSelectQuestion}
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
        <ResultModal result={result} lang={lang} onClose={handleCloseResult} />

      </div>
    </PageLayout>
  );
}