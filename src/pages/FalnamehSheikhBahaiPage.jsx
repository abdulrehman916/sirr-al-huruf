// ═══════════════════════════════════════════════════════════════
// FALNAMEH SHEIKH BAHAI PAGE — Independent Module
// 26 Questions × Persian Letter Grid (18×12)
// Completely separate from Faal Hasrath Ali system
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FALNAMEH_QUESTIONS, PERSIAN_LETTERS } from "../lib/falnamehSheikhBahaiData";

// ── Shared Palette (dark blue + gold) ───────────────────────────
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

// ── Question Card ──────────────────────────────────────────────
function QuestionCard({ question, index, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(question)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.28 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-2xl border p-3 text-center"
      style={{
        background: P.bg,
        borderColor: P.faint,
        boxShadow: `0 0 16px ${P.glow}`,
        minHeight: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>
        سؤال {question.id}
      </span>
      <p className="font-amiri font-bold text-sm mb-1" style={{ color: P.text, lineHeight: 1.6 }}>
        {question.arabic}
      </p>
      <p className="font-inter text-[9px]" style={{ color: P.dim }}>
        {question.ml.question}
      </p>
    </motion.button>
  );
}

// ── Persian Letter Grid Cell ───────────────────────────────────
function LetterCell({ letter, index, isSelected, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(letter)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.015, duration: 0.2 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="rounded-xl border flex items-center justify-center"
      style={{
        background: isSelected ? P.bgHi : P.bg,
        borderColor: isSelected ? P.borderHi : P.faint,
        boxShadow: isSelected ? `0 0 24px ${P.glowHi}` : `0 0 8px ${P.glow}`,
        aspectRatio: "1 / 1",
        minWidth: 0,
      }}
    >
      <span className="font-amiri font-bold" style={{
        fontSize: "clamp(1rem, 4vw, 1.6rem)",
        color: isSelected ? P.gold : P.text,
        textShadow: isSelected ? `0 0 12px ${P.gold}` : `0 0 8px ${P.glow}`,
      }}>
        {letter}
      </span>
    </motion.button>
  );
}

// ── Questions Grid View ────────────────────────────────────────
function QuestionsView({ questions, lang, onSelectQuestion }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="rounded-2xl border px-4 py-3"
        style={{
          background: P.bg,
          borderColor: P.border,
          boxShadow: `0 0 20px ${P.glow}`,
        }}>
        <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: P.dim }}>
          {lang === "ml" ? "ഒരു ചോദ്യം തിരഞ്ഞെടുക്കുക" : "Select a Question"}
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
      }}>
        {questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} onSelect={onSelectQuestion} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Letter Grid View ───────────────────────────────────────────
function LetterGridView({ question, lang, onBack, onSelectLetter }) {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const handleSelectLetter = (letter) => {
    setSelectedLetter(letter);
    setTimeout(() => {
      onSelectLetter(question, letter, selectedLetter || letter);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Back button + Question header */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border"
          style={{
            background: P.bg,
            borderColor: P.faint,
            color: P.text,
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          <p className="font-amiri font-bold text-base" style={{ color: P.text }}>
            {question.arabic}
          </p>
          <p className="font-inter text-[9px]" style={{ color: P.dim }}>
            {lang === "ml" ? question.ml.question : question.en.question}
          </p>
        </div>
      </div>

      {/* Persian Letter Grid (18×12 = 216 cells) */}
      <div className="rounded-2xl border p-3"
        style={{
          background: P.bg,
          borderColor: P.border,
          boxShadow: `0 0 24px ${P.glow}`,
        }}>
        <p className="font-inter text-[8px] uppercase tracking-widest text-center mb-3" style={{ color: P.dim }}>
          {lang === "ml" ? "അക്ഷരം തിരഞ്ഞെടുക്കുക" : "Select a Letter"}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(18, 1fr)",
          gap: "4px",
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
    </motion.div>
  );
}

// ── Result Modal ───────────────────────────────────────────────
function ResultModal({ question, letter, lang, onClose }) {
  if (!question || !letter) return null;

  // Find the interpretation for this letter
  const letterData = PERSIAN_LETTERS_INTERPRETATION[letter];
  const interpretation = letterData ? (lang === "ml" ? letterData.ml : letterData.en) : null;

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
          transition={{ duration: 0.3 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border overflow-hidden"
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
            {/* Selected letter display */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl border mx-auto flex items-center justify-center"
                style={{
                  background: P.bgHi,
                  borderColor: P.borderHi,
                  boxShadow: `0 0 40px ${P.glow}`,
                }}>
                <span className="font-amiri font-bold" style={{ fontSize: "3rem", color: P.gold }}>
                  {letter}
                </span>
              </div>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>
                {lang === "ml" ? "എടുത്ത അക്ഷരം" : "Selected Letter"}
              </p>
            </div>

            {/* Question */}
            <div className="rounded-2xl border p-4 text-center"
              style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-amiri font-bold text-base mb-1" style={{ color: P.text }}>
                {question.arabic}
              </p>
              <p className="font-inter text-[9px]" style={{ color: P.dim }}>
                {lang === "ml" ? question.ml.question : question.en.question}
              </p>
            </div>

            {/* Persian Verse */}
            {letterData && (
              <>
                <div className="rounded-2xl border p-4"
                  style={{ background: P.bg, borderColor: P.faint }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                    {lang === "ml" ? "പേർഷ്യൻ വാചകം" : "Persian Verse"}
                  </p>
                  <p className="font-amiri text-lg text-center leading-relaxed" style={{ color: P.text }}>
                    {letterData.persian}
                  </p>
                </div>

                {/* Meaning */}
                <div className="rounded-2xl border p-4"
                  style={{ background: P.bg, borderColor: P.faint }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                    {lang === "ml" ? "അർത്ഥം" : "Meaning"}
                  </p>
                  <p className="font-amiri text-base leading-relaxed" style={{ color: P.text }}>
                    {interpretation?.meaning || letterData.ml?.meaning || letterData.en?.meaning}
                  </p>
                </div>

                {/* Interpretation */}
                <div className="rounded-2xl border p-4"
                  style={{ background: P.bg, borderColor: P.faint }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                    {lang === "ml" ? "വ്യാഖ്യാനം" : "Interpretation"}
                  </p>
                  <p className="font-amiri text-base leading-relaxed" style={{ color: P.dim }}>
                    {interpretation?.interpretation || letterData.ml?.interpretation || letterData.en?.interpretation}
                  </p>
                </div>
              </>
            )}

            <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-2" style={{ color: P.faint }}>
              فالنامه شیخ بهایی — Falnameh Sheikh Bahai
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Persian Letters Interpretation Data ────────────────────────
const PERSIAN_LETTERS_INTERPRETATION = {
  "ا": {
    persian: "اول کار بخیر آید، صبر کن",
    ml: { meaning: "കാര്യത്തിന്റെ തുടക്കം നല്ലതാണ്, ക്ഷമിക്കുക", interpretation: "തുടക്കം ശുഭകരമാണ്. ക്ഷമയോടെ കാത്തിരിക്കുക. വിജയം ലഭിക്കും." },
    en: { meaning: "Beginning of matter is good, be patient", interpretation: "Beginning is auspicious. Wait patiently. Success will come." },
  },
  "ب": {
    persian: "بشارت به تو رسد، شادی کن",
    ml: { meaning: "നിങ്ങൾക്ക് സന്തോഷവാർത്ത ലഭിക്കും, സന്തോഷിക്കുക", interpretation: "സന്തോഷകരമായ വാർത്ത വരുന്നു. സന്തോഷിക്കുക. അല്ലാഹുവിന് നന്ദി അർപ്പിക്കുക." },
    en: { meaning: "Good news shall reach you, rejoice", interpretation: "Happy news is coming. Rejoice. Give thanks to Allah." },
  },
  "پ": {
    persian: "پنهان مکن، که آشکار شود",
    ml: { meaning: "രഹസ്യം വെക്കരുത്, അത് വെളിപ്പെടും", interpretation: "രഹസ്യങ്ങൾ വെളിപ്പെടും. സത്യം പറയുക. തുറന്നിരിക്കുക." },
    en: { meaning: "Hide not, for it shall be revealed", interpretation: "Secrets will be revealed. Speak truth. Be open." },
  },
  "ت": {
    persian: "توفیق یابی، دعا بکن",
    ml: { meaning: "നിങ്ങൾക്ക് വിജയം ലഭിക്കും, പ്രാർത്ഥിക്കുക", interpretation: "വിജയം ലഭിക്കും. പ്രാർത്ഥന തുടരുക. അല്ലാഹുവിങ്കൽ വിശ്വസിക്കുക." },
    en: { meaning: "You shall find success, make dua", interpretation: "Success will come. Continue prayer. Trust in Allah." },
  },
  "ث": {
    persian: "ثابت قدم باش، که پیروزی نزدیک است",
    ml: { meaning: "ഉറച്ചുനിൽക്കുക, വിജയം അടുത്താണ്", interpretation: "ഉറച്ചുനിൽക്കുക. വിജയം അടുത്തുണ്ട്. പ്രതീക്ഷ കൈവിടരുത്." },
    en: { meaning: "Stand firm, for victory is near", interpretation: "Stand firm. Victory is near. Do not lose hope." },
  },
  "ج": {
    persian: "جواب تو آید، منتظر باش",
    ml: { meaning: "നിങ്ങളുടെ ഉത്തരം വരും, കാത്തിരിക്കുക", interpretation: "ഉത്തരം വരുന്നു. ക്ഷമയോടെ കാത്തിരിക്കുക. സമയം അടുത്തു." },
    en: { meaning: "Your answer shall come, wait", interpretation: "Answer is coming. Wait patiently. Time is near." },
  },
  "چ": {
    persian: "چشم امید داشته باش",
    ml: { meaning: "പ്രതീക്ഷയോടെ കാത്തിരിക്കുക", interpretation: "പ്രതീക്ഷ കൈവിടരുത്. നല്ല സമയം വരുന്നു. വിശ്വസിക്കുക." },
    en: { meaning: "Keep eyes of hope", interpretation: "Do not lose hope. Good times are coming. Trust." },
  },
  "ح": {
    persian: "حاجت تو روا شود",
    ml: { meaning: "നിങ്ങളുടെ ആവശ്യം സഫലമാകും", interpretation: "ആവശ്യം സഫലമാകും. പ്രാർത്ഥന തുടരുക. അല്ലാഹു കേൾക്കുന്നു." },
    en: { meaning: "Your need shall be fulfilled", interpretation: "Need will be fulfilled. Continue prayer. Allah hears." },
  },
  "خ": {
    persian: "خوبی به تو رسد",
    ml: { meaning: "നന്മ നിങ്ങളിൽ എത്തും", interpretation: "നന്മ വരുന്നു. നന്മ ചെയ്യുക. നന്മ ലഭിക്കും." },
    en: { meaning: "Goodness shall reach you", interpretation: "Goodness is coming. Do good. Receive good." },
  },
  "د": {
    persian: "دعا مستجاب آید",
    ml: { meaning: "പ്രാർത്ഥന സ്വീകരിക്കപ്പെടും", interpretation: "പ്രാർത്ഥന സ്വീകരിക്കപ്പെടും. തുടരുക. ഫലം ലഭിക്കും." },
    en: { meaning: "Prayer shall be answered", interpretation: "Prayer will be answered. Continue. Result will come." },
  },
  "ذ": {
    persian: "ذکر خدا بکن، که آرامی یابی",
    ml: { meaning: "ദൈവത്തെ ഓർക്കുക, നിങ്ങൾക്ക് സമാധാനം ലഭിക്കും", interpretation: "അല്ലാഹുവിനെ ഓർക്കുക. സമാധാനം ലഭിക്കും. ഹൃദയം ശാന്തമാകും." },
    en: { meaning: "Remember Allah, you shall find peace", interpretation: "Remember Allah. Peace will come. Heart will calm." },
  },
  "ر": {
    persian: "رحمت خدا شامل تو شود",
    ml: { meaning: "ദൈവത്തിന്റെ കാരുണ്യം നിങ്ങളിൽ ഉണ്ടാകും", interpretation: "അല്ലാഹുവിന്റെ കാരുണ്യം നിങ്ങളിൽ ഉണ്ടാകും. നന്മ ചെയ്യുക." },
    en: { meaning: "Allah's mercy shall encompass you", interpretation: "Allah's mercy will be upon you. Do good." },
  },
  "ز": {
    persian: "زیان به تو نرسد",
    ml: { meaning: "നിങ്ങൾക്ക് നഷ്ടം സംഭവിക്കില്ല", interpretation: "നഷ്ടം സംഭവിക്കില്ല. അല്ലാഹു സംരക്ഷിക്കും. ഭയപ്പെടേണ്ട." },
    en: { meaning: "Loss shall not reach you", interpretation: "Loss will not occur. Allah protects. Fear not." },
  },
  "ژ": {
    persian: "ژرف بین باش، که حقیقت آشکار است",
    ml: { meaning: "ആഴത്തിൽ ചിന്തിക്കുക, സത്യം വെളിപ്പെട്ടിരിക്കുന്നു", interpretation: "ആഴത്തിൽ ചിന്തിക്കുക. സത്യം മനസ്സിലാകും. ശരിയായ തീരുമാനം എടുക്കുക." },
    en: { meaning: "Think deeply, truth is revealed", interpretation: "Think deeply. Truth will be understood. Make right decision." },
  },
  "س": {
    persian: "سلامتی یابی، شکر بجا آور",
    ml: { meaning: "നിങ്ങൾക്ക് ആരോഗ്യം ലഭിക്കും, നന്ദി അർപ്പിക്കുക", interpretation: "ആരോഗ്യം ലഭിക്കും. അല്ലാഹുവിന് നന്ദി അർപ്പിക്കുക. സൽപ്രവൃത്തികൾ തുടരുക." },
    en: { meaning: "You shall find health, give thanks", interpretation: "Health will come. Give thanks to Allah. Continue good deeds." },
  },
  "ش": {
    persian: "شادی به دل تو آید، غم برود",
    ml: { meaning: "നിങ്ങളുടെ ഹൃദയത്തിൽ സന്തോഷം വരും, ദുഃഖം പോകും", interpretation: "സന്തോഷം നിങ്ങളിൽ നിറയും. ദുഃഖങ്ങൾ മാറും. സന്തോഷകരമായ സമയം വരുന്നു." },
    en: { meaning: "Joy shall come to your heart, grief depart", interpretation: "Joy will fill you. Griefs will depart. Happy times are coming." },
  },
  "ص": {
    persian: "صبر پیشه کن، که فتح نزدیک است",
    ml: { meaning: "ക്ഷമ സ്വീകരിക്കുക, വിജയം അടുത്താണ്", interpretation: "ക്ഷമ പാലിക്കുക. വിജയം അടുത്തുണ്ട്. പ്രതീക്ഷ കൈവിടരുത്." },
    en: { meaning: "Adopt patience, for victory is near", interpretation: "Be patient. Victory is near. Do not lose hope." },
  },
  "ض": {
    persian: "ضرر به تو نرسد، محفوظ باشی",
    ml: { meaning: "നിങ്ങൾക്ക് ദോഷം സംഭവിക്കില്ല, നിങ്ങൾ സംരക്ഷിക്കപ്പെടും", interpretation: "ദോഷങ്ങൾ നിങ്ങളെ ബാധിക്കില്ല. അല്ലാഹു നിങ്ങളെ സംരക്ഷിക്കും. ഭയപ്പെടേണ്ട." },
    en: { meaning: "Harm shall not reach you, you are protected", interpretation: "Harm will not reach you. Allah protects you. Fear not." },
  },
  "ط": {
    persian: "طاعت خدا بکن، که رستگاری در آن است",
    ml: { meaning: "ദൈവത്തെ അനുസരിക്കുക, അതിൽ മോക്ഷമുണ്ട്", interpretation: "അല്ലാഹുവിനെ അനുസരിക്കുക. അതിലാണ് വിജയം. ധാർമ്മികത പാലിക്കുക." },
    en: { meaning: "Obey Allah, for salvation lies therein", interpretation: "Obey Allah. In that is success. Maintain righteousness." },
  },
  "ظ": {
    persian: "ظلم مکن، که ستم برگردد",
    ml: { meaning: "അനീതി ചെയ്യരുത്, അത് തിരിച്ചുവരും", interpretation: "അനീതി ചെയ്യരുത്. അത് നിങ്ങൾക്ക് തിരിച്ചുവരും. നീതി പാലിക്കുക." },
    en: { meaning: "Do not oppress, for oppression returns", interpretation: "Do not oppress. It will return to you. Maintain justice." },
  },
  "ع": {
    persian: "عاقبت بخیر شوی، امید دار",
    ml: { meaning: "നിങ്ങൾക്ക് നല്ല അന്ത്യം ഉണ്ടാകും, പ്രതീക്ഷിക്കുക", interpretation: "നല്ല അന്ത്യം ലഭിക്കും. പ്രതീക്ഷ കൈവിടരുത്. നന്മ ചെയ്യുക." },
    en: { meaning: "You shall have good end, have hope", interpretation: "Good end will come. Do not lose hope. Do good." },
  },
  "غ": {
    persian: "غم فردا مخور، که امروز کافیست",
    ml: { meaning: "നാളത്തെക്കുറിച്ച് വിഷമിക്കരുത്, ഇന്ന് മതി", interpretation: "ഭാവിയെക്കുറിച്ച് ആശങ്കപ്പെടരുത്. ഇന്നത്തെ ദിവസം മതി. അല്ലാഹുവിങ്കൽ വിശ്വസിക്കുക." },
    en: { meaning: "Worry not for tomorrow, for today is enough", interpretation: "Worry not for future. Today is enough. Trust in Allah." },
  },
  "ف": {
    persian: "فلاح یابی، راه حق برو",
    ml: { meaning: "നിങ്ങൾക്ക് വിജയം ലഭിക്കും, നേരായ വഴിയിൽ പോകുക", interpretation: "വിജയം ലഭിക്കും. നേരായ വഴിയിൽ സഞ്ചരിക്കുക. സത്യം പിന്തുടരുക." },
    en: { meaning: "You shall attain success, walk the right path", interpretation: "Success will come. Walk the straight path. Follow truth." },
  },
  "ق": {
    persian: "قدر تو دانسته شود، صبر کن",
    ml: { meaning: "നിങ്ങളുടെ മൂല്യം അറിയാം, ക്ഷമിക്കുക", interpretation: "നിങ്ങളുടെ മൂല്യം അംഗീകരിക്കപ്പെടും. ക്ഷമയോടെ കാത്തിരിക്കുക. സമയം വരും." },
    en: { meaning: "Your worth shall be known, be patient", interpretation: "Your worth will be recognized. Wait patiently. Time will come." },
  },
  "ک": {
    persian: "کار تو به سر آید، دل آرام کن",
    ml: { meaning: "നിങ്ങളുടെ കാര്യം പൂർത്തിയാകും, മനസ്സ് ശാന്തമാക്കുക", interpretation: "കാര്യങ്ങൾ പൂർത്തിയാകും. മനസ്സ് ശാന്തമാക്കുക. അല്ലാഹുവിങ്കൽ വിശ്വസിക്കുക." },
    en: { meaning: "Your matter shall complete, calm your heart", interpretation: "Matters will complete. Calm your heart. Trust in Allah." },
  },
  "گ": {
    persian: "گمشده تو یابد، جستجو کن",
    ml: { meaning: "നഷ്ടപ്പെട്ടത് കണ്ടെത്തും, തിരയുക", interpretation: "നഷ്ടപ്പെട്ടത് കണ്ടെത്തും. തിരയൽ തുടരുക. വിജയം ലഭിക്കും." },
    en: { meaning: "Your lost shall be found, keep searching", interpretation: "Lost will be found. Continue searching. Success will come." },
  },
  "ل": {
    persian: "لطف خدا شامل تو شود",
    ml: { meaning: "ദൈവത്തിന്റെ അനുഗ്രഹം നിങ്ങളിൽ ഉണ്ടാകും", interpretation: "അല്ലാഹുവിന്റെ അനുഗ്രഹം നിങ്ങളിൽ ഉണ്ടാകും. നന്മ ചെയ്യുക. നന്ദി അർപ്പിക്കുക." },
    en: { meaning: "Allah's grace shall encompass you", interpretation: "Allah's grace will be upon you. Do good. Give thanks." },
  },
  "م": {
    persian: "مراد تو حاصل آید، شادی کن",
    ml: { meaning: "നിങ്ങളുടെ ആഗ്രഹം സഫലമാകും, സന്തോഷിക്കുക", interpretation: "ആഗ്രഹം സഫലമാകും. സന്തോഷിക്കുക. അല്ലാഹുവിന് നന്ദി അർപ്പിക്കുക." },
    en: { meaning: "Your desire shall be fulfilled, rejoice", interpretation: "Desire will be fulfilled. Rejoice. Give thanks to Allah." },
  },
  "ن": {
    persian: "نور هدایت به دل تو آید",
    ml: { meaning: "നിങ്ങളുടെ ഹൃദയത്തിൽ മാർഗ്ഗദർശനത്തിന്റെ വെളിച്ചം വരും", interpretation: "മാർഗ്ഗദർശനം ലഭിക്കും. ഹൃദയത്തിൽ വെളിച്ചം വരും. ശരിയായ തീരുമാനം എടുക്കുക." },
    en: { meaning: "Light of guidance shall come to your heart", interpretation: "Guidance will come. Light will enter heart. Make right decision." },
  },
  "و": {
    persian: "وعده خدا راست آید، ایمان دار",
    ml: { meaning: "ദൈവത്തിന്റെ വാഗ്ദാനം സത്യമാകും, വിശ്വസിക്കുക", interpretation: "അല്ലാഹുവിന്റെ വാഗ്ദാനം സത്യമാണ്. വിശ്വാസം കൈവിടരുത്. പ്രതീക്ഷിക്കുക." },
    en: { meaning: "Allah's promise comes true, have faith", interpretation: "Allah's promise is true. Do not lose faith. Have hope." },
  },
  "ه": {
    persian: "هدایت یابی، راه مستقیم برو",
    ml: { meaning: "നിങ്ങൾക്ക് മാർഗ്ഗദർശനം ലഭിക്കും, നേരായ വഴിയിൽ പോകുക", interpretation: "മാർഗ്ഗദർശനം ലഭിക്കും. നേരായ വഴിയിൽ സഞ്ചരിക്കുക. സത്യം പിന്തുടരുക." },
    en: { meaning: "You shall find guidance, walk the straight path", interpretation: "Guidance will come. Walk the straight path. Follow truth." },
  },
  "ی": {
    persian: "یقین دان که پیروزی با توست",
    ml: { meaning: "ഉറപ്പായി അറിയുക, വിജയം നിങ്ങളോടൊപ്പമാണ്", interpretation: "ഉറപ്പായി അറിയുക, വിജയം നിങ്ങളുടെ പക്ഷത്താണ്. ധൈര്യം കൈവിടരുത്." },
    en: { meaning: "Know for certain, victory is with you", interpretation: "Know for certain, victory is on your side. Do not lose courage." },
  },
};

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function FalnamehSheikhBahaiPage() {
  const [lang, setLang] = useState("ml");
  const [view, setView] = useState("questions");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [result, setResult] = useState({ question: null, letter: null });

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setView("letters");
  };

  const handleBackToQuestions = () => {
    setView("questions");
    setSelectedQuestion(null);
  };

  const handleSelectLetter = (question, letter) => {
    setResult({ question, letter });
  };

  const handleCloseResult = () => {
    setResult({ question: null, letter: null });
    setView("questions");
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
          {view === "questions" ? (
            <QuestionsView
              key="questions"
              questions={FALNAMEH_QUESTIONS}
              lang={lang}
              onSelectQuestion={handleSelectQuestion}
            />
          ) : (
            <LetterGridView
              key="letters"
              question={selectedQuestion}
              lang={lang}
              onBack={handleBackToQuestions}
              onSelectLetter={handleSelectLetter}
            />
          )}
        </AnimatePresence>

        {result.question && (
          <ResultModal
            question={result.question}
            letter={result.letter}
            lang={lang}
            onClose={handleCloseResult}
          />
        )}
      </div>
    </PageLayout>
  );
}