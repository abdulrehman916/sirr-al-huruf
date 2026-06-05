import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Download } from "lucide-react";
import { calcKebir, calcSaghir, calcCumeli, calcBast } from "../lib/abjadModes";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { usePageState } from "../context/PageStateContext";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

const PAGE_KEY = 'abjadKabir';

export default function AbjadKabirPage() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, {
    mode: "kebir",
    bastLevel: 1,
    history: [],
    input: "",
    results: { kebir: null, saghir: null, cumeli: null, bast: null },
  });
  
  const [mode, setMode] = useState(initialState.mode);
  const [bastLevel, setBastLevel] = useState(initialState.bastLevel);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(initialState.history);
  const debounceTimerRef = useRef(null);
  const [input, setInput] = useState(initialState.input);
  const [results, setResults] = useState(initialState.results);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    setPageState(PAGE_KEY, { mode, bastLevel, history, input, results });
  }, [mode, bastLevel, history, input, results, setPageState]);

  const handleClear = () => {
    setInput("");
    setResults({ kebir: null, saghir: null, cumeli: null, bast: null });
    setHistory([]);
    setBastLevel(1);
    setMode('kebir');
    clearPageState(PAGE_KEY);
  };

  const calculateResults = useCallback((text, level = bastLevel) => {
    if (!text.trim()) {
      setResults({ kebir: null, saghir: null, cumeli: null, bast: null });
      return;
    }
    const kebir = calcKebir(text);
    const saghir = calcSaghir(text);
    const cumeli = calcCumeli(text);
    const bast = calcBast(text, level);
    setResults({ kebir, saghir, cumeli, bast });
  }, [bastLevel]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      calculateResults(value);
    }, 300);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (input.trim()) {
      calculateResults(input, bastLevel);
    }
  };

  const handleBastLevelChange = (level) => {
    setBastLevel(level);
    if (input.trim()) {
      calculateResults(input, level);
    }
  };

  const handleCopy = () => {
    const result = results[mode];
    if (result) {
      navigator.clipboard.writeText(result.total.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    const result = results[mode];
    if (result) {
      const text = `Abjad ${mode.toUpperCase()} Result\nInput: ${input}\nTotal: ${result.total}\nDate: ${new Date().toLocaleDateString()}`;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `abjad-${mode}-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const openModal = (resultType) => {
    setSelectedResult({ type: resultType, data: results[resultType] });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResult(null);
  };

  const getModeLabel = (id) => {
    const labels = {
      kebir: { en: 'EBCEDI KEBIR', ar: 'الكبير الأبجد' },
      saghir: { en: 'EBCEDI SAGHIR', ar: 'الصغير الأبجد' },
      cumeli: { en: 'CUMELI KEBIR', ar: 'الكبير الجمالي' },
      bast: { en: 'BAST-I HURUF', ar: 'الحروف البسط' },
    };
    return labels[id];
  };

  return (
    <PageLayout>
      <div className="text-center mb-2">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border mb-2"
          style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
            borderColor: "rgba(212,175,55,0.20)",
            boxShadow: "0 0 12px rgba(212,175,55,0.10)",
          }}
        >
          <span className="font-amiri text-sm" style={{ color: "#D4AF37" }}>🔢</span>
        </motion.div>
        <h1 className="font-amiri font-bold leading-tight" style={{ fontSize: "1.35rem", color: "#f5ead4", textShadow: "0 0 12px rgba(212,175,55,0.20)" }}>
          حاسبة الأبجد
        </h1>
        <p className="font-inter font-bold tracking-[0.18em] uppercase mt-0.5" style={{ fontSize: "6.5px", color: "rgba(212,175,55,0.60)" }}>
          Abjad Calculator
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {/* Mode Selection Card */}
        <SectionCard>
          <SectionLabel>SELECT CALCULATION MODE</SectionLabel>
          
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {['kebir', 'saghir', 'cumeli', 'bast'].map((modeId) => {
              const labels = getModeLabel(modeId);
              const isActive = mode === modeId;
              
              return (
                <motion.button
                  key={modeId}
                  onClick={() => handleModeChange(modeId)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg py-2.5 px-2 border transition-all relative overflow-hidden"
                  style={{
                    background: isActive
                      ? "linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)"
                      : "rgba(4,12,34,0.95)",
                    borderColor: isActive ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.06)",
                    boxShadow: isActive ? `0 0 12px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.10)` : "none",
                  }}
                >
                  <span className="block font-inter font-bold text-[9px] tracking-wide" style={{ color: isActive ? G.text : "rgba(255,255,255,0.35)" }}>
                    {labels.en}
                  </span>
                  <span className="block font-amiri text-[11px] font-bold mt-0.5" style={{ color: isActive ? "rgba(212,175,55,0.65)" : "rgba(212,175,55,0.40)" }}>
                    {labels.ar}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-px rounded-full" style={{ background: G.text }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* Bast Level Selection */}
        {mode === 'bast' && (
          <SectionCard>
            <SectionLabel>BAST LEVEL</SectionLabel>
            <div className="grid grid-cols-5 gap-1 mt-1.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => handleBastLevelChange(level)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-md py-1.5 text-[11px] font-bold font-inter border transition-all"
                  style={{
                    background: bastLevel === level
                      ? "linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)"
                      : "rgba(4,12,34,0.95)",
                    borderColor: bastLevel === level ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.06)",
                    color: bastLevel === level ? G.text : "rgba(255,255,255,0.35)",
                    boxShadow: bastLevel === level ? `0 0 12px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.10)` : "none",
                  }}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Input Card */}
        <SectionCard>
          <SectionLabel>ARABIC TEXT INPUT — {mode.toUpperCase()}</SectionLabel>
          
          <div className="relative mt-2">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="أدخل النص العربي هنا..."
              className="w-full rounded-lg border bg-slate-950/60 p-3 text-right font-amiri text-sm text-white placeholder-slate-600 focus:outline-none transition-all"
              style={{
                borderColor: "rgba(212,175,55,0.20)",
                boxShadow: "inset 0 1px 8px rgba(0,0,0,0.35)",
              }}
              rows={3}
              dir="rtl"
            />
          </div>

          {/* Calculate & Clear Buttons */}
          <div className="flex gap-1.5 mt-2">
            <motion.button
              onClick={() => calculateResults(input)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2.5 rounded-lg font-amiri font-bold text-sm border transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.15) 100%)",
                borderColor: "rgba(212,175,55,0.35)",
                color: G.text,
                boxShadow: `0 0 12px ${G.glow}`,
              }}
            >
              احسب
            </motion.button>
            <motion.button
              onClick={handleClear}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-inter font-bold text-[11px] border transition-all"
              style={{
                background: "rgba(4,12,34,0.95)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "rgba(212,175,55,0.55)",
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </motion.button>
          </div>
        </SectionCard>

        {/* Result Card */}
        {results[mode] && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionCard>
              <SectionLabel>RESULT</SectionLabel>

              <div className="text-center mt-4 mb-4">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block font-inter font-bold"
                  style={{
                    color: G.text,
                    fontSize: results[mode].total.toString().length > 6 ? '2.5rem' : 
                              results[mode].total.toString().length > 4 ? '3rem' : '3.5rem',
                    textShadow: `0 0 24px ${G.glow}`,
                  }}
                >
                  {results[mode].total}
                </motion.span>
              </div>

              <div className="space-y-2">
                {results[mode].letters && (
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-wider mb-2" style={{ color: G.dim }}>Letter Breakdown</p>
                    <div className="flex flex-wrap gap-1.5" dir="rtl">
                      {results[mode].letters.map((letter, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-lg text-xs font-amiri" style={{
                          background: "rgba(212,175,55,0.08)",
                          borderColor: "rgba(212,175,55,0.25)",
                          border: "1px solid rgba(212,175,55,0.25)",
                          color: G.text,
                        }}>
                          {letter.original} = {letter.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {results[mode].activeLetters && (
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-wider mb-2 mt-3" style={{ color: G.dim }}>Active Letters</p>
                    <div className="flex flex-wrap gap-1.5" dir="rtl">
                      {results[mode].activeLetters.map((letter, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-lg text-xs font-amiri" style={{
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.25)",
                          color: "#10B981",
                        }}>
                          {letter.original} = {letter.saghir}
                        </span>
                      ))}
                    </div>
                    {results[mode].sakitLetters?.length > 0 && (
                      <>
                        <p className="font-inter text-[9px] uppercase tracking-wider mb-2 mt-3" style={{ color: G.dim }}>Sakit Letters</p>
                        <div className="flex flex-wrap gap-1.5" dir="rtl">
                          {results[mode].sakitLetters.map((letter, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-lg text-xs font-amiri" style={{
                              background: "rgba(239,68,68,0.08)",
                              border: "1px solid rgba(239,68,68,0.25)",
                              color: "#EF4444",
                            }}>
                              {letter.original} = 0
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {results[mode].entries && (
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-wider mb-2 mt-3" style={{ color: G.dim }}>Letter Names</p>
                    <div className="space-y-1.5" dir="rtl">
                      {results[mode].entries.map((entry, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs px-2 py-1" style={{ color: G.text }}>
                          <span className="font-amiri">{entry.original}</span>
                          <span className="font-inter text-white/60 text-center flex-1">{entry.name}</span>
                          <span className="font-bold">{entry.nameTotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1.5 mt-3">
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md font-inter font-bold text-[10px] border transition-all"
                  style={{
                    background: copied ? "rgba(16,185,129,0.12)" : "rgba(4,12,34,0.95)",
                    borderColor: copied ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)",
                    color: copied ? "#10B981" : "rgba(212,175,55,0.55)",
                  }}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </motion.button>
                <motion.button
                  onClick={handleExport}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md font-inter font-bold text-[10px] border transition-all"
                  style={{
                    background: "rgba(4,12,34,0.95)",
                    borderColor: "rgba(255,255,255,0.08)",
                    color: "rgba(212,175,55,0.55)",
                  }}
                >
                  <Download className="w-3 h-3" />
                  Export
                </motion.button>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.88)" }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border-2 p-6"
              style={{
                background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
                borderColor: "rgba(212,175,55,0.30)",
                boxShadow: `0 0 60px ${G.glowHi}, inset 0 1px 0 rgba(212,175,55,0.15)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-inter font-bold text-lg mb-4" style={{ color: G.text }}>
                {selectedResult.type.toUpperCase()} Details
              </h3>
              <div className="space-y-4" style={{ color: G.text }}>
                {selectedResult.data?.letters && (
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-wider mb-2" style={{ color: G.dim }}>Letter Breakdown</p>
                    <div className="flex flex-wrap gap-2" dir="rtl">
                      {selectedResult.data.letters.map((letter, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg text-sm font-amiri border" style={{
                          background: "rgba(212,175,55,0.10)",
                          borderColor: "rgba(212,175,55,0.30)",
                          color: G.text,
                        }}>
                          {letter.original} = {letter.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

function SectionCard({ children }) {
  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.95) 0%, rgba(4,10,24,0.98) 100%)",
        borderColor: "rgba(212,175,55,0.18)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.06)",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[9px] uppercase tracking-wide" style={{ color: G.dim }}>
      {children}
    </p>
  );
}