// ═══════════════════════════════════════════════════════════════
// FALNAMEH SHEIKH BAHAI — MAIN PAGE
// Question Management System with Selection & Detail Views
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import FalnamehQuestionCard from "../components/falnameh/FalnamehQuestionCard";
import FalnamehQuestionDetail from "../components/falnameh/FalnamehQuestionDetail";
import FalnamehResultModal from "../components/falnameh/FalnamehResultModal";
import { FALNAMEH_QUESTIONS } from "../lib/falnamehSheikhBahaiData";

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

// ── Questions Selection View ───────────────────────────────────
function QuestionsSelection({ questions, lang, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
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
        gap: "12px",
      }}>
        {questions.map((q, i) => (
          <FalnamehQuestionCard
            key={q.id}
            question={q}
            index={i}
            lang={lang}
            onSelect={onSelect}
          />
        ))}
      </div>

      <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: P.faint }}>
        ൨൬ ചോദ്യങ്ങൾ — 26 Questions
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function FalnamehSheikhBahaiPage() {
  const [lang, setLang] = useState("ml");
  const [view, setView] = useState("selection");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [result, setResult] = useState({ question: null, letter: null, cellNumber: null });

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setView("detail");
  };

  const handleBackToSelection = () => {
    setView("selection");
    setSelectedQuestion(null);
  };

  const handleSelectLetter = (question, letter, cellNumber) => {
    setResult({ question, letter, cellNumber });
  };

  const handleCloseResult = () => {
    setResult({ question: null, letter: null, cellNumber: null });
    setView("selection");
    setSelectedQuestion(null);
  };

  return (
    <PageLayout>
      <div className="space-y-4">
        <PageTitle
          arabic="فالنامه شیخ بهایی"
          latin="FALNAMEH SHEIKH BAHAI"
          subtitle="Sacred Persian Falnameh System"
          icon="◈"
        />

        <LangToggle lang={lang} setLang={setLang} />

        <AnimatePresence mode="wait">
          {view === "selection" ? (
            <QuestionsSelection
              key="selection"
              questions={FALNAMEH_QUESTIONS}
              lang={lang}
              onSelect={handleSelectQuestion}
            />
          ) : (
            <FalnamehQuestionDetail
              key="detail"
              question={selectedQuestion}
              lang={lang}
              onBack={handleBackToSelection}
              onSelectLetter={handleSelectLetter}
            />
          )}
        </AnimatePresence>

        {result.question && (
          <FalnamehResultModal
            question={result.question}
            letter={result.letter}
            cellNumber={result.cellNumber}
            lang={lang}
            onClose={handleCloseResult}
          />
        )}
      </div>
    </PageLayout>
  );
}