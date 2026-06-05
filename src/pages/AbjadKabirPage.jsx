import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Download, FileText, X } from "lucide-react";
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

  return (
    <PageLayout>
      <PageTitle 
        arabic="الأبجد الكبير" 
        latin="Abjad Kabir" 
        subtitle="Sacred Numerology Calculator" 
        icon="🔢" 
      />

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Mode Selection Cards */}
        <SectionCard>
          <SectionLabel>Calculation Mode — وضع الحساب</SectionLabel>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { id: 'kebir', label: 'Kebir', arabic: 'الكبير', color: 'rgba(59,130,246,0.2)' },
              { id: 'saghir', label: 'Saghir', arabic: 'الصغير', color: 'rgba(16,185,129,0.2)' },
              { id: 'cumeli', label: 'Cumeli', arabic: 'الجمالي', color: 'rgba(245,158,11,0.2)' },
              { id: 'bast', label: 'Bast', arabic: 'البسط', color: 'rgba(139,92,246,0.2)' },
            ].map((m) => (
              <motion.button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl py-3.5 px-3 border transition-all relative overflow-hidden"
                style={{
                  background: mode === m.id
                    ? "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)"
                    : "rgba(4,12,34,0.97)",
                  borderColor: mode === m.id ? G.borderHi : "rgba(255,255,255,0.08)",
                  color: mode === m.id ? G.text : "rgba(255,255,255,0.38)",
                  boxShadow: mode === m.id ? `0 0 18px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)` : "none",
                }}
              >
                {mode === m.id && (
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />
                )}
                <span className="block text-xs font-bold font-inter">{m.label}</span>
                <span className="block text-sm font-amiri mt-0.5">{m.arabic}</span>
              </motion.button>
            ))}
          </div>
        </SectionCard>

        {/* Bast Level Selection */}
        {mode === 'bast' && (
          <SectionCard>
            <SectionLabel>Bast Level — المستوى</SectionLabel>
            <div className="grid grid-cols-5 gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => handleBastLevelChange(level)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl py-3 text-sm font-bold font-inter border transition-all"
                  style={{
                    background: bastLevel === level
                      ? "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)"
                      : "rgba(4,12,34,0.97)",
                    borderColor: bastLevel === level ? G.borderHi : "rgba(255,255,255,0.08)",
                    color: bastLevel === level ? "#0d1b2a" : "rgba(255,255,255,0.38)",
                  }}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Input */}
        <SectionCard>
          <SectionLabel>Arabic Text — النص العربي</SectionLabel>
          <div className="relative mt-3">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="أدخل النص العربي هنا..."
              className="w-full rounded-xl border-2 bg-slate-900/50 p-4 text-right font-amiri text-lg text-white placeholder-slate-500 focus:outline-none"
              style={{
                borderColor: "rgba(212,175,55,0.30)",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.30)",
              }}
              rows={4}
              dir="rtl"
            />
            {input && (
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-2 rounded-lg transition-colors"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.50)",
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </SectionCard>

        {/* Results Summary Cards */}
        {results[mode] && (
          <SectionCard glow>
            <SectionLabel>Result — النتيجة</SectionLabel>
            
            <div className="mt-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-2xl border mb-4"
                style={{
                  background: "linear-gradient(145deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.05) 100%)",
                  borderColor: G.borderHi,
                  boxShadow: `0 0 32px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)`,
                }}
              >
                <span className="text-5xl font-bold" style={{ color: G.text }}>
                  {results[mode].total}
                </span>
              </motion.div>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                {mode.toUpperCase()} Total Value
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-inter font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
                  color: "#0d1b2a",
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </motion.button>
              <motion.button
                onClick={handleExport}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-inter font-bold text-sm border"
                style={{
                  background: "rgba(4,12,34,0.97)",
                  borderColor: "rgba(212,175,55,0.30)",
                  color: G.text,
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>

            {/* Detailed View Button */}
            <motion.button
              onClick={() => openModal(mode)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-3 py-3 rounded-xl font-inter font-bold text-sm border"
              style={{
                background: "rgba(212,175,55,0.06)",
                borderColor: "rgba(212,175,55,0.20)",
                color: G.text,
              }}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              View Details
            </motion.button>
          </SectionCard>
        )}

        {/* History */}
        {history.length > 0 && (
          <SectionCard>
            <SectionLabel>Recent Calculations — الحسابات الأخيرة</SectionLabel>
            <div className="space-y-2 mt-3">
              {history.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 px-3 rounded-lg"
                  style={{
                    background: "rgba(212,175,55,0.04)",
                    border: "1px solid rgba(212,175,55,0.10)",
                  }}
                >
                  <span className="font-amiri text-white/80" dir="rtl">{item.input}</span>
                  <span className="font-inter text-sm font-bold" style={{ color: G.text }}>{item.total}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {/* Modal for Detailed View */}
      <AnimatePresence>
        {showModal && selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border p-6"
              style={{
                background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
                borderColor: G.borderHi,
                boxShadow: `0 0 48px ${G.glowHi}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-inter font-bold text-lg" style={{ color: G.text }}>
                  {selectedResult.type.toUpperCase()} Details
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.50)",
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedResult.type === 'kebir' && selectedResult.data && (
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Letter Breakdown</p>
                    <div className="flex flex-wrap gap-2" dir="rtl">
                      {selectedResult.data.letters.map((letter, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-2 rounded-xl border font-amiri text-base"
                          style={{
                            background: "rgba(212,175,55,0.06)",
                            borderColor: "rgba(212,175,55,0.20)",
                            color: G.text,
                          }}
                        >
                          {letter.original} = {letter.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResult.type === 'saghir' && selectedResult.data && (
                  <div className="space-y-3">
                    <div>
                      <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Active Letters</p>
                      <div className="flex flex-wrap gap-2" dir="rtl">
                        {selectedResult.data.activeLetters.map((letter, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-2 rounded-xl border font-amiri text-base"
                            style={{
                              background: "rgba(16,185,129,0.10)",
                              borderColor: "rgba(16,185,129,0.30)",
                              color: "#10B981",
                            }}
                          >
                            {letter.original} = {letter.saghir}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedResult.data.sakitLetters.length > 0 && (
                      <div>
                        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Sakit (Silent) Letters</p>
                        <div className="flex flex-wrap gap-2" dir="rtl">
                          {selectedResult.data.sakitLetters.map((letter, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-2 rounded-xl border font-amiri text-base"
                              style={{
                                background: "rgba(239,68,68,0.10)",
                                borderColor: "rgba(239,68,68,0.30)",
                                color: "#EF4444",
                              }}
                            >
                              {letter.original} = 0
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedResult.type === 'cumeli' && selectedResult.data && (
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Letter Names</p>
                    <div className="space-y-2" dir="rtl">
                      {selectedResult.data.entries.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-lg"
                          style={{
                            background: "rgba(212,175,55,0.04)",
                            border: "1px solid rgba(212,175,55,0.10)",
                          }}
                        >
                          <span className="font-amiri text-lg" style={{ color: G.text }}>{entry.original}</span>
                          <span className="font-inter text-sm text-white/60">{entry.name}</span>
                          <span className="font-inter text-sm font-bold" style={{ color: "#10B981" }}>{entry.nameTotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResult.type === 'bast' && selectedResult.data && (
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Bast Level {bastLevel} Values</p>
                    <div className="flex flex-wrap gap-2" dir="rtl">
                      {selectedResult.data.entries.map((entry, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-2 rounded-xl border font-amiri text-base"
                          style={{
                            background: "rgba(139,92,246,0.10)",
                            borderColor: "rgba(139,92,246,0.30)",
                            color: "#8B5CF6",
                          }}
                        >
                          {entry.original} = {entry.value}
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

function SectionCard({ children, glow = false }) {
  return (
    <div
      className="rounded-2xl border p-4 space-y-3"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: "rgba(212,175,55,0.22)",
        boxShadow: glow
          ? `0 8px 48px rgba(0,0,0,0.62), 0 0 32px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.12)`
          : `0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
      {children}
    </p>
  );
}