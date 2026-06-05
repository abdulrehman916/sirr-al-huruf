import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Download, FileText } from "lucide-react";
import { calcKebir, calcSaghir, calcCumeli, calcBast } from "../lib/abjadModes";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { usePageState } from "../context/PageStateContext";

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

  const getActiveColor = () => {
    switch(mode) {
      case 'kebir': return 'from-blue-500/20 to-blue-600/10';
      case 'saghir': return 'from-emerald-500/20 to-emerald-600/10';
      case 'cumeli': return 'from-amber-500/20 to-amber-600/10';
      case 'bast': return 'from-purple-500/20 to-purple-600/10';
      default: return 'from-slate-500/20 to-slate-600/10';
    }
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
        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'kebir', label: 'Kebir', arabic: 'الكبير' },
            { id: 'saghir', label: 'Saghir', arabic: 'الصغير' },
            { id: 'cumeli', label: 'Cumeli', arabic: 'الجمالي' },
            { id: 'bast', label: 'Bast', arabic: 'البسط' },
          ].map((m) => (
            <motion.button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl py-3 px-2 border transition-all relative overflow-hidden ${
                mode === m.id 
                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/50' 
                  : 'bg-slate-900/50 border-slate-700/50'
              }`}
            >
              <span className="block text-xs font-bold text-amber-400">{m.label}</span>
              <span className="block text-sm font-amiri text-amber-300/80">{m.arabic}</span>
            </motion.button>
          ))}
        </div>

        {/* Bast Level Selection (only for Bast mode) */}
        {mode === 'bast' && (
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <motion.button
                key={level}
                onClick={() => handleBastLevelChange(level)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-lg py-2 text-sm font-bold ${
                  bastLevel === level
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                Level {level}
              </motion.button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="أدخل النص العربي هنا..."
            className="w-full rounded-xl border-2 border-slate-700 bg-slate-900/50 p-4 text-right font-amiri text-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            rows={4}
            dir="rtl"
          />
          {input && (
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Result Display */}
        {results[mode] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-900/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  {mode} Result
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleExport}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-6xl font-bold text-amber-400 mb-2"
              >
                {results[mode].total}
              </motion.div>
              <p className="text-sm text-slate-400">Total Value</p>
            </div>

            {/* Letter Breakdown */}
            {mode === 'kebir' && results.kebir && (
              <div className="mt-4 pt-4 border-t border-amber-500/20">
                <p className="text-xs text-slate-400 mb-2">Letter Breakdown</p>
                <div className="flex flex-wrap gap-1" dir="rtl">
                  {results.kebir.letters.map((letter, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-amber-300 text-sm">
                      {letter.original} = {letter.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mode === 'saghir' && results.saghir && (
              <div className="mt-4 pt-4 border-t border-amber-500/20">
                <p className="text-xs text-slate-400 mb-2">Active Letters</p>
                <div className="flex flex-wrap gap-1" dir="rtl">
                  {results.saghir.activeLetters.map((letter, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-emerald-300 text-sm">
                      {letter.original} = {letter.saghir}
                    </span>
                  ))}
                </div>
                {results.saghir.sakitLetters.length > 0 && (
                  <>
                    <p className="text-xs text-slate-400 mb-2 mt-3">Sakit (Silent) Letters</p>
                    <div className="flex flex-wrap gap-1" dir="rtl">
                      {results.saghir.sakitLetters.map((letter, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-red-300 text-sm">
                          {letter.original} = 0
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {mode === 'cumeli' && results.cumeli && (
              <div className="mt-4 pt-4 border-t border-amber-500/20">
                <p className="text-xs text-slate-400 mb-2">Letter Names</p>
                <div className="space-y-2" dir="rtl">
                  {results.cumeli.entries.map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-amber-300">{entry.original}</span>
                      <span className="text-slate-400">{entry.name}</span>
                      <span className="text-emerald-300">{entry.nameTotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'bast' && results.bast && (
              <div className="mt-4 pt-4 border-t border-amber-500/20">
                <p className="text-xs text-slate-400 mb-2">Bast Level {bastLevel} Values</p>
                <div className="flex flex-wrap gap-1" dir="rtl">
                  {results.bast.entries.map((entry, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-purple-300 text-sm">
                      {entry.original} = {entry.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <h3 className="text-sm font-bold text-slate-400 mb-3">Recent Calculations</h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-amiri" dir="rtl">{item.input}</span>
                  <span className="text-amber-400">{item.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}