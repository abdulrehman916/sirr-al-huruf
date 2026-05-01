import { useState, useCallback } from "react";
import { analyzeText, ELEMENTS } from "../lib/anasirValues";
import { processText } from "../lib/abjadValues";
import AnasirLetterGrid from "../components/AnasirLetterGrid";
import LetterGrid from "../components/LetterGrid";
import ResultsSummary from "../components/ResultsSummary";
import AbjadReferenceTable from "../components/AbjadReferenceTable";
import LetterAnalysis from "../components/LetterAnalysis";
import ElementInsight from "../components/ElementInsight";
import HistorySection from "../components/HistorySection";
import FavoritesSection from "../components/FavoritesSection";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Trash2, Star, Copy, Share2, Check } from "lucide-react";

let idCounter = 0;
const uid = () => `${Date.now()}-${++idCounter}`;

function buildHistoryItem(text, abjadResult, anasirResult) {
  const dominant = anasirResult?.dominant;
  const el = dominant ? ELEMENTS[dominant] : null;
  return {
    id: uid(),
    text,
    abjadTotal: abjadResult?.total ?? 0,
    totalLetters: abjadResult?.count ?? 0,
    dominantName: el?.name ?? "—",
    dominantColor: el?.color ?? "#ffffff",
    dominantIcon: el?.icon ?? "◈",
  };
}

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [anasirInput, setAnasirInput] = useState("");
  const [anasirResult, setAnasirResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);

  // ── Abjad ──────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
    if (!input.trim()) return;
    const r = processText(input);
    setResult(r);
    const ar = analyzeText(input);
    const item = buildHistoryItem(input, r, ar);
    setHistory((h) => [item, ...h].slice(0, 20));
  }, [input]);

  const handleClear = () => { setInput(""); setResult(null); };

  // ── Anasir ─────────────────────────────────────────────
  const handleAnasirAnalyze = useCallback(() => {
    if (!anasirInput.trim()) return;
    const ar = analyzeText(anasirInput);
    setAnasirResult(ar);
    const r = processText(anasirInput);
    const item = buildHistoryItem(anasirInput, r, ar);
    setHistory((h) => [item, ...h].slice(0, 20));
  }, [anasirInput]);

  const handleAnasirClear = () => { setAnasirInput(""); setAnasirResult(null); };

  // ── Favorites ──────────────────────────────────────────
  const saveToFavorites = (text, abjadResult, anasirResult) => {
    const item = buildHistoryItem(text, abjadResult, anasirResult);
    setFavorites((f) => {
      if (f.some((x) => x.text === text)) return f;
      return [item, ...f];
    });
  };

  const removeFavorite = (id) => setFavorites((f) => f.filter((x) => x.id !== id));

  // ── Copy / Share ───────────────────────────────────────
  const buildShareText = (text, abjadR, anasirR) => {
    const dominant = anasirR?.dominant ? ELEMENTS[anasirR.dominant] : null;
    return `📖 ${text}\n🔢 Abjad Value: ${abjadR?.total ?? "—"}\n${dominant ? `${dominant.icon} Dominant Element: ${dominant.name}` : ""}`;
  };

  const handleCopy = (text, abjadR, anasirR) => {
    navigator.clipboard.writeText(buildShareText(text, abjadR, anasirR));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (text, abjadR, anasirR) => {
    const shareText = buildShareText(text, abjadR, anasirR);
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── History select ─────────────────────────────────────
  const handleHistorySelect = (item) => {
    setInput(item.text);
    setResult(processText(item.text));
    setAnasirInput(item.text);
    setAnasirResult(analyzeText(item.text));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] via-[#0f1f30] to-[#0a1520] text-white font-inter relative overflow-x-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-12">

        {/* ══════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-yellow-500/20 mb-5"
            style={{ background: "linear-gradient(180deg, rgba(234,179,8,0.12) 0%, rgba(234,179,8,0.04) 100%)" }}>
            <span className="font-amiri text-3xl text-yellow-400">ح</span>
          </div>
          <h1 className="font-amiri text-5xl sm:text-6xl font-bold text-white">سرّ الحروف</h1>
          <p className="font-inter text-xs text-white/35 mt-2 tracking-widest uppercase">Advanced Ilm al-Huruf Analysis</p>
          <Divider color="yellow" />
        </motion.div>

        {/* ══════════════════════════════════════════
            ABJAD CALCULATOR
        ══════════════════════════════════════════ */}
        <Section>
          <SectionLabel>Abjad Calculator</SectionLabel>
          <InputCard
            value={input}
            onChange={setInput}
            onCalculate={handleCalculate}
            onClear={handleClear}
            hasResult={!!result}
            accentColor="yellow"
          />

          <AnimatePresence mode="wait">
            {result && (
              <motion.div key="abjad-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 mt-3">
                <Card>
                  <ResultsSummary count={result.count} total={result.total} />
                </Card>
                {result.letters.length > 0 && (
                  <>
                    <Card>
                      <p className="font-inter text-xs text-white/35 uppercase tracking-widest mb-4">Letter Breakdown</p>
                      <LetterGrid letters={result.letters} />
                    </Card>
                    <LetterAnalysis letters={result.letters} />
                  </>
                )}
                <ActionRow
                  onStar={() => saveToFavorites(input, result, analyzeText(input))}
                  onCopy={() => handleCopy(input, result, analyzeText(input))}
                  onShare={() => handleShare(input, result, analyzeText(input))}
                  copied={copied}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        <DividerLine />

        {/* ══════════════════════════════════════════
            ANASIR CALCULATOR
        ══════════════════════════════════════════ */}
        <Section>
          <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-cyan-500/25 mb-4"
              style={{ background: "linear-gradient(180deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 100%)" }}>
              <span className="text-2xl">🌊</span>
            </div>
            <h2 className="font-amiri text-4xl sm:text-5xl font-bold text-white">حاسبة العناصر</h2>
            <p className="font-inter text-xs text-cyan-400/50 mt-1.5 tracking-widest uppercase font-medium">Anasir Domination Calculator</p>
            <Divider color="cyan" />
          </motion.div>

          <InputCard
            value={anasirInput}
            onChange={setAnasirInput}
            onCalculate={handleAnasirAnalyze}
            onClear={handleAnasirClear}
            hasResult={!!anasirResult}
            accentColor="cyan"
            buttonLabel="Analyze Elements"
          />

          <AnimatePresence mode="wait">
            {anasirResult && (
              <motion.div key="anasir-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 mt-3">

                {/* Dominant Banner */}
                {anasirResult.dominant && (() => {
                  const el = ELEMENTS[anasirResult.dominant];
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl p-5 flex items-center justify-between border backdrop-blur-sm"
                      style={{ background: el.bg, borderColor: el.border, boxShadow: `0 0 30px ${el.glow}` }}
                    >
                      <div>
                        <p className="font-inter text-[10px] uppercase tracking-widest mb-1 font-semibold" style={{ color: el.color }}>Dominant Element</p>
                        <p className="font-amiri text-2xl font-bold text-white">{el.icon} {el.name}</p>
                        <p className="font-inter text-xs text-white/55 mt-1">{anasirResult.counts[anasirResult.dominant]} letters · {anasirResult.percentages[anasirResult.dominant]}%</p>
                      </div>
                      <span className="font-amiri text-5xl opacity-15" style={{ color: el.color }}>{el.arabic}</span>
                    </motion.div>
                  );
                })()}

                {/* Element Cards */}
                <Card>
                  <div className="grid grid-cols-2 gap-3">
                    <TotalCard total={anasirResult.total} />
                    {Object.entries(ELEMENTS).map(([key, el], i) => {
                      const isDominant = anasirResult.dominant === key;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.3, delay: i * 0.06 }}
                          className="rounded-xl p-4 flex flex-col items-center gap-1.5 border cursor-default transition-all backdrop-blur-md"
                          style={{
                            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                            borderColor: isDominant ? el.color : "rgba(255,255,255,0.08)",
                            boxShadow: isDominant ? `0 0 20px ${el.glow}, inset 0 1px 0 rgba(255,255,255,0.08)` : "inset 0 1px 0 rgba(255,255,255,0.05)",
                          }}
                        >
                          <span className={`text-xl ${key === "fire" && isDominant ? "animate-pulse" : ""}`}>{el.icon}</span>
                          <span className="font-inter text-[10px] uppercase tracking-widest font-medium" style={{ color: isDominant ? el.color : "rgba(255,255,255,0.6)" }}>{el.name}</span>
                          <span className="font-amiri text-base font-bold" style={{ color: isDominant ? (el.arabicColor || "#fff") : "rgba(255,255,255,0.5)", textShadow: isDominant && key === "fire" ? "0 0 4px rgba(255,80,0,0.5)" : isDominant ? `0 0 8px ${el.glow}` : "none" }}>{el.arabic}</span>
                          <span className="font-amiri text-3xl font-bold" style={{ color: isDominant ? (el.numberColor || el.color) : "rgba(255,255,255,0.85)" }}>{anasirResult.counts[key]}</span>
                          {isDominant && (
                            <span className="font-inter text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-semibold mt-0.5"
                              style={{ color: el.color, borderColor: el.border, background: el.bg }}>Dominant</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>

                {/* Letter Breakdown */}
                {anasirResult.letterDetails.length > 0 && (
                  <Card>
                    <AnasirLetterGrid letterDetails={anasirResult.letterDetails} />
                  </Card>
                )}

                {/* Element Insight */}
                <ElementInsight dominant={anasirResult.dominant} />

                <ActionRow
                  onStar={() => saveToFavorites(anasirInput, processText(anasirInput), anasirResult)}
                  onCopy={() => handleCopy(anasirInput, processText(anasirInput), anasirResult)}
                  onShare={() => handleShare(anasirInput, processText(anasirInput), anasirResult)}
                  copied={copied}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        <DividerLine />

        {/* ══════════════════════════════════════════
            FAVORITES
        ══════════════════════════════════════════ */}
        <FavoritesSection favorites={favorites} onRemove={removeFavorite} />

        {/* ══════════════════════════════════════════
            HISTORY
        ══════════════════════════════════════════ */}
        <HistorySection history={history} onClear={() => setHistory([])} onSelect={handleHistorySelect} />

        {/* ══════════════════════════════════════════
            REFERENCE TABLE
        ══════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pb-8">
          <AbjadReferenceTable />
        </motion.div>

      </div>
    </div>
  );
}

// ── Shared mini-components ──────────────────────────────

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function SectionLabel({ children }) {
  return <p className="font-inter text-xs text-white/35 uppercase tracking-widest mb-3">{children}</p>;
}

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-white/8 p-5"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)" }}>
      {children}
    </div>
  );
}

function TotalCard({ total }) {
  return (
    <div className="col-span-2 rounded-xl border border-cyan-500/20 p-4 flex flex-col items-center gap-1"
      style={{ background: "linear-gradient(180deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.02) 100%)" }}>
      <span className="font-inter text-[10px] text-cyan-400/70 uppercase tracking-widest font-semibold">Total Letters</span>
      <span className="font-amiri text-4xl font-bold text-white">{total}</span>
    </div>
  );
}

function Divider({ color }) {
  const c = color === "yellow" ? "yellow-500" : "cyan-500";
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <div className={`h-px w-12 bg-gradient-to-r from-transparent to-${c}/40`} />
      <div className={`w-1.5 h-1.5 rounded-full bg-${c}/50`} />
      <div className={`h-px w-12 bg-gradient-to-l from-transparent to-${c}/40`} />
    </div>
  );
}

function DividerLine() {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-transparent" />
    </div>
  );
}

function InputCard({ value, onChange, onCalculate, onClear, hasResult, accentColor, buttonLabel = "Calculate" }) {
  const isYellow = accentColor === "yellow";
  return (
    <div className="rounded-2xl border p-5"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)", borderColor: isYellow ? "rgba(234,179,8,0.15)" : "rgba(6,182,212,0.15)" }}>
      <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5"
        style={{ color: isYellow ? "rgba(234,179,8,0.5)" : "rgba(6,182,212,0.5)" }}>
        Arabic Text Input
      </label>
      <textarea
        dir="rtl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="أدخل النص العربي هنا..."
        rows={4}
        className="w-full bg-black/30 border rounded-xl px-4 py-3 font-amiri text-xl text-white placeholder:text-white/25 leading-relaxed resize-none focus:outline-none transition-all duration-200 caret-white mb-3"
        style={{ borderColor: isYellow ? "rgba(234,179,8,0.2)" : "rgba(6,182,212,0.2)" }}
      />
      <div className="flex gap-2">
        <motion.button
          onClick={onCalculate}
          disabled={!value.trim()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-inter font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a]"
          style={{ background: isYellow ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#06b6d4,#3b82f6)" }}
        >
          <Calculator className="w-3.5 h-3.5" />
          {buttonLabel}
        </motion.button>
        <motion.button
          onClick={onClear}
          disabled={!value && !hasResult}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-white/50 hover:text-white font-inter text-sm border border-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </motion.button>
      </div>
    </div>
  );
}

function ActionRow({ onStar, onCopy, onShare, copied }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <motion.button
        onClick={onStar}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-yellow-500/20 text-yellow-400/70 hover:text-yellow-400 hover:border-yellow-500/40 text-xs font-inter transition-all"
        style={{ background: "rgba(234,179,8,0.04)" }}
      >
        <Star className="w-3.5 h-3.5" />
        Save
      </motion.button>
      <motion.button
        onClick={onCopy}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/25 text-xs font-inter transition-all"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy"}
      </motion.button>
      <motion.button
        onClick={onShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/25 text-xs font-inter transition-all"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </motion.button>
    </div>
  );
}