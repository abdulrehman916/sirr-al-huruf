import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Download, FileText } from "lucide-react";
import { calcKebir, calcSaghir, calcCumeli, calcBast } from "../lib/abjadModes";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";

// ── Gold helpers ──────────────────────────────
const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.25)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
};

// ── Modes ─────────────────────────────────────
const MODES = [
  { key: "kebir",  label: "EBCEDİ KEBİR",        arabic: "الأبجد الكبير",    calc: calcKebir  },
  { key: "saghir", label: "EBCEDİ SAĞİR",         arabic: "الأبجد الصغير",   calc: calcSaghir },
  { key: "cumeli", label: "CÜMELİ KEBİR",          arabic: "الجُمَل الكبير",  calc: calcCumeli },
  { key: "bast",   label: "BAST-I HURUF",           arabic: "بسط الحروف",      calc: calcBast   },
];

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-1">
      <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

// ── Grand Total display ───────────────────────
function TotalCard({ total, label, count }) {
  return (
    <div className="rounded-2xl border p-6 text-center space-y-2 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,18,48,0.99) 0%, rgba(4,10,28,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 60px ${G.glow}, 0 4px 32px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.12)`,
      }}>
      {/* Top sheen */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />
      <p className="font-inter text-[9px] uppercase tracking-[0.25em]" style={{ color: G.dim }}>{label}</p>
      <motion.p className="font-amiri font-bold tabular-nums"
        style={{ fontSize: "clamp(2.8rem,12vw,4.2rem)", color: G.text, lineHeight: 1 }}
        animate={{ textShadow: [`0 0 20px ${G.glow}`, `0 0 60px ${G.glowHi}`, `0 0 20px ${G.glow}`] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        {total.toLocaleString()}
      </motion.p>
      {count != null && <p className="font-inter text-[9px] text-white/30 uppercase tracking-widest">{count} letters</p>}
    </div>
  );
}

// ── Shared letter grid ────────────────────────
function LetterGrid({ letters, valueKey = "value" }) {
  return (
    <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
      {letters.map((l, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.025, duration: 0.28 }}
          className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[46px]"
          style={{ background: G.bg, borderColor: G.faint }}>
          <span className="font-amiri text-2xl text-white leading-none mb-0.5">{l.original}</span>
          <span className="font-inter text-[11px] font-bold tabular-nums" style={{ color: G.text }}>{l[valueKey]}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Running total strip ───────────────────────
function RunningStrip({ letters, valueKey = "value" }) {
  let running = 0;
  return (
    <div className="space-y-1" dir="rtl">
      {letters.map((l, i) => {
        running += l[valueKey];
        const isLast = i === letters.length - 1;
        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.018 * i, duration: 0.28 }}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg"
            style={{ background: isLast ? G.bgHi : "rgba(255,255,255,0.02)", borderBottom: `1px solid ${G.faint}` }}>
            <div className="flex items-center gap-3">
              <span className="font-amiri text-lg text-white w-6 text-center">{l.original}</span>
              <span className="font-inter text-[10px] text-white/25">+</span>
              <span className="font-inter text-xs tabular-nums" style={{ color: G.dim }}>{l[valueKey]}</span>
            </div>
            <span className="font-inter text-sm font-bold tabular-nums" style={{ color: isLast ? G.text : "rgba(255,255,255,0.50)" }}>
              {running.toLocaleString()}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// RESULT PANELS
// ═══════════════════════════════════════════════

function KebirResults({ data }) {
  return (
    <div className="space-y-4">
      {/* Total + letter count */}
      <TotalCard total={data.total} label="Total — Ebced-i Kebir" count={data.letters.length} />

      {/* Letter breakdown grid */}
      <Section title={`Letter Breakdown — ${data.letters.length} Letters`}>
        <LetterGrid letters={data.letters} />
      </Section>

      {/* Running total strip */}
      <Section title="Running Total">
        <RunningStrip letters={data.letters} />
      </Section>
    </div>
  );
}

function SaghirResults({ data }) {
  return (
    <div className="space-y-4">
      {/* Total + count */}
      <TotalCard total={data.total} label="Total — Ebced-i Sağir" count={data.letters.length} />

      {/* Full letter breakdown grid — show all including sakit */}
      <Section title={`Letter Breakdown — ${data.letters.length} Letters`}>
        <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
          {data.letters.map((l, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.025, duration: 0.28 }}
              className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[46px]"
              style={{
                background: l.sakit ? "rgba(255,255,255,0.02)" : G.bg,
                borderColor: l.sakit ? "rgba(255,255,255,0.10)" : G.faint,
                opacity: l.sakit ? 0.45 : 1,
              }}>
              <span className="font-amiri text-2xl text-white leading-none mb-0.5">{l.original}</span>
              <span className="font-inter text-[11px] font-bold tabular-nums" style={{ color: l.sakit ? "rgba(255,255,255,0.25)" : G.text }}>
                {l.saghir}
              </span>
              {l.sakit && (
                <span className="font-inter text-[7px] uppercase tracking-wide text-white/25 mt-0.5">sakit</span>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Running total — active letters only */}
      {data.activeLetters.length > 0 && (
        <Section title="Running Total (Active Letters)">
          <RunningStrip letters={data.activeLetters} valueKey="saghir" />
        </Section>
      )}
    </div>
  );
}

function CumeliResults({ data }) {
  let running = 0;
  return (
    <div className="space-y-4">
      {/* Total + count */}
      <TotalCard total={data.total} label="Total — Cümeli Kebir" count={data.entries.length} />

      {/* Letter cards grid */}
      <Section title={`Letter Breakdown — ${data.entries.length} Letters`}>
        <div className="flex flex-wrap gap-3 justify-end" dir="rtl">
          {data.entries.map((e, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.28 }}
              className="flex flex-col items-center rounded-2xl border px-4 py-3 min-w-[64px] gap-1"
              style={{ background: G.bgHi, borderColor: G.borderHi, boxShadow: `0 0 14px ${G.glow}` }}>
              <span className="font-amiri text-3xl text-white leading-none">{e.original}</span>
              <span className="font-amiri text-sm leading-none" style={{ color: G.dim }}>{e.name}</span>
              <span className="font-inter text-sm font-bold tabular-nums mt-0.5" style={{ color: G.text }}>{e.nameTotal}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Running total strip */}
      <Section title="Running Total">
        <div className="space-y-1" dir="rtl">
          {data.entries.map((e, i) => {
            running += e.nameTotal;
            const isLast = i === data.entries.length - 1;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.018 * i, duration: 0.28 }}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                style={{ background: isLast ? G.bgHi : "rgba(255,255,255,0.02)", borderBottom: `1px solid ${G.faint}` }}>
                <div className="flex items-center gap-3">
                  <span className="font-amiri text-lg text-white w-6 text-center">{e.original}</span>
                  <span className="font-amiri text-xs" style={{ color: G.dim }}>{e.name}</span>
                  <span className="font-inter text-[10px] text-white/25">+</span>
                  <span className="font-inter text-xs tabular-nums" style={{ color: G.dim }}>{e.nameTotal}</span>
                </div>
                <span className="font-inter text-sm font-bold tabular-nums" style={{ color: isLast ? G.text : "rgba(255,255,255,0.50)" }}>
                  {running.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function BastResults({ data }) {
  let running = 0;
  return (
    <div className="space-y-4">
      {/* Total + count */}
      <TotalCard total={data.total} label={`Total — Bast-${data.bastLevel || 1}`} count={data.entries.length} />

      {/* Letter cards grid */}
      <Section title={`Letter Breakdown — ${data.entries.length} Letters`}>
        <div className="flex flex-wrap gap-3 justify-end" dir="rtl">
          {data.entries.map((e, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.28 }}
              className="flex flex-col items-center rounded-2xl border px-4 py-3 min-w-[64px] gap-1"
              style={{ background: G.bgHi, borderColor: G.borderHi, boxShadow: `0 0 14px ${G.glow}` }}>
              <span className="font-amiri text-3xl text-white leading-none">{e.original}</span>
              <span className="font-inter text-xs leading-none font-bold" style={{ color: G.dim }}>BAST {data.bastLevel}</span>
              <span className="font-inter text-sm font-bold tabular-nums mt-0.5" style={{ color: G.text }}>{e.value}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Running total strip */}
      <Section title="Running Total">
        <div className="space-y-1" dir="rtl">
          {data.entries.map((e, i) => {
            running += e.value;
            const isLast = i === data.entries.length - 1;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.018 * i, duration: 0.28 }}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                style={{ background: isLast ? G.bgHi : "rgba(255,255,255,0.02)", borderBottom: `1px solid ${G.faint}` }}>
                <div className="flex items-center gap-3">
                  <span className="font-amiri text-lg text-white w-6 text-center">{e.original}</span>
                  <span className="font-inter text-xs" style={{ color: G.dim }}>BAST {data.bastLevel}</span>
                  <span className="font-inter text-[10px] text-white/25">+</span>
                  <span className="font-inter text-xs tabular-nums" style={{ color: G.dim }}>{e.value}</span>
                </div>
                <span className="font-inter text-sm font-bold tabular-nums" style={{ color: isLast ? G.text : "rgba(255,255,255,0.50)" }}>
                  {running.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// ── Generic section wrapper ───────────────────
function Section({ title, children }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{
        background: "linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)",
        borderColor: G.border,
        boxShadow: "0 2px 20px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.06)",
      }}>
      <p className="font-inter text-[9px] uppercase tracking-[0.22em] text-center" style={{ color: G.dim }}>✦ {title}</p>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)` }} />
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
export default function AbjadKabirPage() {
  const [mode, setMode] = useState("kebir");
  const [bastLevel, setBastLevel] = useState(1);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const debounceTimerRef = useRef(null);

  // ONE shared input — persists across all mode switches
  const [input, setInput] = useState("");
  // Per-mode results — each mode stores its own last result
  const [results, setResults] = useState({ kebir: null, saghir: null, cumeli: null, bast: null });

  const modeObj = MODES.find(m => m.key === mode);
  const result  = results[mode];

  const performCalculation = useCallback((inputValue = input) => {
    if (!inputValue.trim()) return;
    const calcFn = MODES.find(m => m.key === mode).calc;
    const resultValue = mode === "bast" ? calcFn(inputValue, bastLevel) : calcFn(inputValue);
    setResults(prev => ({ ...prev, [mode]: resultValue }));
    setHistory(prev => [{
      mode,
      input: inputValue,
      bastLevel: mode === "bast" ? bastLevel : null,
      result: resultValue,
      timestamp: new Date().toLocaleTimeString(),
    }, ...prev.slice(0, 19)]);
  }, [mode, bastLevel, input]);

  const handleCalculate = useCallback(() => performCalculation(), [performCalculation]);

  // Auto-calculate with debounce (300ms delay)
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!input.trim()) {
      setResults(prev => ({ ...prev, [mode]: null }));
      return;
    }
    debounceTimerRef.current = setTimeout(() => {
      performCalculation(input);
    }, 300);
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [input, mode, bastLevel]);

  const handleModeChange = (key) => {
    setMode(key);
    // Input persists; result for the new mode will auto-calculate via the effect above
  };

  const handleClear = () => { setInput(""); setResults({ kebir: null, saghir: null, cumeli: null, bast: null }); };

  const handleCopy = () => {
    if (!result) return;
    const text = `[${modeObj.label}]\n${input}\n\nTotal: ${result.total}`;
    navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsText = () => {
    if (!result) return;
    const text = `═══════════════════════════════════════
${modeObj.label}
═══════════════════════════════════════
Input: ${input}
Total: ${result.total}
Mode: ${mode}${mode === "bast" ? ` (Level ${bastLevel})` : ""}
Timestamp: ${new Date().toLocaleString()}
═══════════════════════════════════════`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abjad-${mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* ── Header ── */}
        <PageTitle arabic="حاسبة الأبجد" latin="Abjad Calculator" subtitle="Numerical Value System" icon="ا" />

        {/* ── Mode Selector ── */}
        <div className="rounded-2xl border p-3"
          style={{ background:"linear-gradient(145deg, rgba(6,14,36,0.99) 0%, rgba(4,10,24,0.99) 100%)", borderColor:"rgba(212,175,55,0.14)", boxShadow:"0 2px 24px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.06)" }}>
          <p className="font-inter text-[8px] uppercase tracking-[0.22em] text-center text-white/25 mb-2.5">✦ Select Calculation Mode</p>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map(m => {
              const active = mode === m.key;
              return (
                <motion.button key={m.key}
                  onClick={() => handleModeChange(m.key)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  animate={{
                    background: active ? G.bgHi : "rgba(255,255,255,0.02)",
                    boxShadow: active ? `0 0 22px ${G.glow}, inset 0 1px 0 ${G.faint}` : "none",
                  }}
                  transition={{ duration: 0.22 }}
                  className="relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border"
                  style={{ borderColor: active ? G.borderHi : "rgba(255,255,255,0.07)" }}>
                  <span className="font-inter text-[10px] font-bold tracking-wider leading-none mb-1"
                    style={{ color: active ? G.text : "rgba(255,255,255,0.35)" }}>
                    {m.label}
                  </span>
                  <span className="font-amiri text-xs" style={{ color: active ? G.dim : "rgba(255,255,255,0.18)" }}>
                    {m.arabic}
                  </span>
                  {active && (
                    <motion.div layoutId="modeUnderline"
                      className="absolute bottom-1.5 rounded-full h-0.5 w-8"
                      style={{ background: G.text }}
                      transition={{ duration: 0.25, ease: "easeInOut" }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Input ── */}
        <div className="rounded-2xl border p-5 relative overflow-hidden"
          style={{ background:"linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)", borderColor: G.borderHi, boxShadow:`0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.10)` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)` }} />
          <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5" style={{ color: G.dim }}>
            Arabic Text Input — {modeObj.label}
          </label>
          <textarea dir="rtl" value={input}
            onChange={e => { setInput(e.target.value); setResults(prev => ({ ...prev, [mode]: null })); }}
            onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleCalculate(); } }}
            placeholder="أدخل النص العربي هنا..."
            rows={4}
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white mb-3 placeholder:text-white/30"
            style={{ background:"rgba(4,12,34,0.97)", border:`1px solid ${G.border}` }} />
          
          {/* Bast Level Selector */}
          {mode === "bast" && (
            <div className="mb-3">
              <p className="font-inter text-[8px] uppercase tracking-widest text-center mb-2" style={{ color: G.dim }}>Select Bast Level</p>
              <div className="grid grid-cols-5 gap-1.5">
                {[1,2,3,4,5].map(level => {
                  const active = bastLevel === level;
                  return (
                    <motion.button key={level}
                      onClick={() => { setBastLevel(level); setResults(prev => ({ ...prev, bast: null })); }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      animate={{
                        background: active ? G.bgHi : "rgba(255,255,255,0.02)",
                        borderColor: active ? G.borderHi : "rgba(255,255,255,0.08)",
                        boxShadow: active ? `0 0 16px ${G.glow}` : "none",
                      }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-center py-2 px-1 rounded-lg border">
                      <span className="font-inter text-[10px] font-bold" style={{ color: active ? G.text : "rgba(255,255,255,0.35)" }}>
                        BAST {level}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <motion.button onClick={handleCalculate} disabled={!input.trim()}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a] tracking-wide"
              style={{ background:"linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)", boxShadow:`0 0 32px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)` }}>
              <span className="font-amiri text-base">احسب</span> Calculate
            </motion.button>
            <motion.button onClick={handleClear} disabled={!input}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="flex items-center gap-1.5 py-3 px-4 rounded-xl text-white/55 hover:text-white font-inter text-sm border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background:"rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)" }}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key={mode + "-results"}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              className="space-y-4">

              {mode === "kebir"  && <KebirResults  data={result} />}
              {mode === "saghir" && <SaghirResults data={result} />}
              {mode === "cumeli" && <CumeliResults data={result} />}
              {mode === "bast"   && <BastResults   data={result} />}

              {/* Copy + Export */}
              <div className="flex flex-wrap gap-2 justify-start pt-1">
                <motion.button onClick={handleCopy}
                  whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-xs font-inter transition-all"
                  style={{ background:"rgba(255,255,255,0.06)" }}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
                <motion.button onClick={exportAsText}
                  whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-xs font-inter transition-all"
                  style={{ background:"rgba(255,255,255,0.06)" }}>
                  <Download className="w-3.5 h-3.5" /> Export TXT
                </motion.button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>



        {/* ── History ── */}
        {history.length > 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            className="rounded-2xl border p-4 space-y-2"
            style={{ background:"linear-gradient(145deg, rgba(6,14,36,0.99) 0%, rgba(4,10,24,0.99) 100%)", borderColor:"rgba(212,175,55,0.18)", boxShadow:"0 2px 20px rgba(0,0,0,0.40)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>Recent Calculations</p>
            <div className="space-y-1 max-h-64 overflow-y-auto" dir="rtl">
              {history.slice(0, 10).map((entry, i) => (
                <motion.button key={i}
                  onClick={() => {
                    setMode(entry.mode);
                    if (entry.mode === "bast") setBastLevel(entry.bastLevel || 1);
                    setInput(entry.input);
                    setResults(prev => ({ ...prev, [entry.mode]: entry.result }));
                  }}
                  whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 text-xs transition-all"
                  style={{ background:"rgba(255,255,255,0.02)" }}>
                  <span className="font-amiri text-sm text-white truncate flex-1">{entry.input.slice(0,20)}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="font-inter text-[8px] uppercase tracking-widest text-white/40">{entry.mode}</span>
                    <span className="font-inter text-xs font-bold tabular-nums" style={{ color:G.text }}>{entry.result.total}</span>
                    <span className="font-inter text-[8px] text-white/25">{entry.timestamp}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </PageLayout>
  );
}

// ── Reference table ───────────────────────────
const KABIR_ROWS = [
  [["ا",1],["ب",2],["ج",3],["د",4],["ه",5],["و",6],["ز",7],["ح",8],["ط",9]],
  [["ي",10],["ك",20],["ل",30],["م",40],["ن",50],["س",60],["ع",70],["ف",80],["ص",90]],
  [["ق",100],["ر",200],["ش",300],["ت",400],["ث",500],["خ",600],["ذ",700],["ض",800],["ظ",900],["غ",1000]],
];

function KabirReferenceTable() {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
      className="rounded-2xl border" style={{ background:"rgba(6,14,36,0.95)", borderColor:G.faint }}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3">
        <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
          Abjad Kebir Reference
        </span>
        <span className="font-inter text-[10px] text-white/30">{open ? "▲" : "▼"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.3 }} className="overflow-hidden px-4 pb-4 space-y-3">
            {KABIR_ROWS.map((row, ri) => (
              <div key={ri} className="flex flex-wrap gap-1.5 justify-end" dir="rtl">
                {row.map(([letter, val]) => (
                  <div key={letter} className="flex flex-col items-center rounded-lg border px-2.5 py-1.5 min-w-[40px]"
                    style={{ background: G.bg, borderColor: G.faint }}>
                    <span className="font-amiri text-lg text-white leading-none">{letter}</span>
                    <span className="font-inter text-[10px] tabular-nums" style={{ color: G.dim }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}