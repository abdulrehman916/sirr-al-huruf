import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check } from "lucide-react";
import { calcKebir, calcSaghir, calcCumeli, calcBast } from "../lib/abjadModes";
import PageLayout from "../components/PageLayout";

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
    <div className="rounded-2xl border p-5 text-center space-y-1"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 48px ${G.glow}, 0 4px 24px rgba(0,0,0,0.55)` }}>
      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</p>
      <motion.p className="font-inter font-bold tabular-nums"
        style={{ fontSize: "clamp(2.6rem,12vw,4rem)", color: G.text }}
        animate={{ textShadow: [`0 0 20px ${G.glow}`, `0 0 55px ${G.glowHi}`, `0 0 20px ${G.glow}`] }}
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
      <TotalCard total={data.total} label="Total — Ebced-i Kebir" count={data.letters.length} />
      <Section title="Letter Breakdown">
        <LetterGrid letters={data.letters} />
      </Section>
      <Section title="Running Total">
        <RunningStrip letters={data.letters} />
      </Section>
    </div>
  );
}

function SaghirResults({ data }) {
  return (
    <div className="space-y-4">
      <TotalCard total={data.total} label="Total — Ebced-i Sağir" />

      {/* All letters: kebir vs saghir */}
      <Section title="Kebir → Sağir Breakdown">
        <div className="space-y-1.5" dir="rtl">
          {data.letters.map((l, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.02 * i }}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: l.sakit ? "rgba(255,255,255,0.02)" : G.bg, borderBottom: `1px solid ${G.faint}`, opacity: l.sakit ? 0.35 : 1 }}>
              <div className="flex items-center gap-3">
                <span className="font-amiri text-xl text-white w-6 text-center">{l.original}</span>
                <span className="font-inter text-[10px] tabular-nums text-white/40">{l.kabir}</span>
                <span className="font-inter text-[10px] text-white/20">→</span>
                <span className="font-inter text-xs font-bold tabular-nums" style={{ color: l.sakit ? "rgba(255,255,255,0.20)" : G.text }}>
                  {l.sakit ? "SAKIT" : l.saghir}
                </span>
              </div>
              {l.sakit && <span className="font-inter text-[8px] uppercase tracking-widest text-white/25">silent</span>}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Sakit letters */}
      {data.sakitLetters.length > 0 && (
        <Section title={`Sakit Letters (${data.sakitLetters.length})`}>
          <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
            {data.sakitLetters.map((l, i) => (
              <div key={i} className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[46px] opacity-40"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)" }}>
                <span className="font-amiri text-2xl text-white leading-none">{l.original}</span>
                <span className="font-inter text-[9px] text-white/40 uppercase tracking-wide">sakit</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Running active letters */}
      <Section title="Running Total (Active)">
        <RunningStrip letters={data.activeLetters} valueKey="saghir" />
      </Section>
    </div>
  );
}

function CumeliResults({ data }) {
  return (
    <div className="space-y-4">
      <TotalCard total={data.total} label="Total — Cümeli Kebir" count={data.entries.length} />

      {data.entries.map((e, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border p-4 space-y-3"
          style={{ background: "rgba(8,18,44,0.96)", borderColor: G.faint }}>
          {/* header: original → name */}
          <div className="flex items-center gap-3" dir="rtl">
            <span className="font-amiri text-3xl text-white">{e.original}</span>
            <span className="font-inter text-white/25 text-sm">→</span>
            <span className="font-amiri text-2xl" style={{ color: G.text }}>{e.name}</span>
            <span className="font-inter text-sm font-bold tabular-nums ml-auto" style={{ color: G.text }}>= {e.nameTotal}</span>
          </div>
          {/* name letters */}
          <div className="flex flex-wrap gap-1.5 justify-end" dir="rtl">
            {e.nameLetters.map((nl, ni) => (
              <div key={ni} className="flex flex-col items-center rounded-lg border px-2 py-1.5 min-w-[36px]"
                style={{ background: G.bg, borderColor: G.faint }}>
                <span className="font-amiri text-base text-white leading-none">{nl.original}</span>
                <span className="font-inter text-[10px] tabular-nums" style={{ color: G.dim }}>{nl.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BastResults({ data }) {
  return (
    <div className="space-y-4">
      <TotalCard total={data.total} label="Total — Bast-ı Huruf" count={data.entries.length} />

      {data.entries.map((e, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-2xl border p-4 space-y-3"
          style={{ background: "rgba(8,18,44,0.96)", borderColor: G.faint }}>

          {/* top: original → first name → total */}
          <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: G.faint }} dir="rtl">
            <span className="font-amiri text-3xl text-white">{e.original}</span>
            <span className="text-white/25 text-sm">→</span>
            <span className="font-amiri text-xl" style={{ color: G.dim }}>{e.firstName}</span>
            <span className="font-inter text-sm font-bold tabular-nums ml-auto" style={{ color: G.text }}>= {e.entryTotal}</span>
          </div>

          {/* bast groups */}
          <div className="space-y-2" dir="rtl">
            {e.bastGroups.map((g, gi) => (
              <div key={gi} className="rounded-xl border px-3 py-2 space-y-1.5"
                style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.12)" }}>
                <div className="flex items-center gap-2">
                  <span className="font-amiri text-lg text-white">{g.letter}</span>
                  <span className="text-white/20 text-xs">→</span>
                  <span className="font-amiri text-base" style={{ color: G.dim }}>{g.name}</span>
                  <span className="font-inter text-xs tabular-nums ml-auto" style={{ color: G.text }}>= {g.total}</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {g.letters.map((sl, si) => (
                    <div key={si} className="flex flex-col items-center rounded-md border px-1.5 py-1 min-w-[32px]"
                      style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.15)" }}>
                      <span className="font-amiri text-sm text-white leading-none">{sl.original}</span>
                      <span className="font-inter text-[9px] tabular-nums" style={{ color: "rgba(212,175,55,0.55)" }}>{sl.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Generic section wrapper ───────────────────
function Section({ title, children }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{ background: "rgba(8,18,44,0.96)", borderColor: G.border }}>
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>{title}</p>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
export default function AbjadKabirPage() {
  const [mode, setMode]   = useState("kebir");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const modeObj = MODES.find(m => m.key === mode);

  const handleCalculate = useCallback(() => {
    if (!input.trim()) return;
    setResult(modeObj.calc(input));
  }, [input, modeObj]);

  const handleModeChange = (key) => {
    setMode(key);
    // recalculate instantly if there's already input
    if (input.trim()) {
      const m = MODES.find(x => x.key === key);
      setResult(m.calc(input));
    } else {
      setResult(null);
    }
  };

  const handleClear = () => { setInput(""); setResult(null); };

  const handleCopy = () => {
    if (!result) return;
    const text = `[${modeObj.label}]\n${input}\n\nTotal: ${result.total}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* ── Header ── */}
        <div className="text-center">
          <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background:"linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow:"0 0 28px rgba(212,175,55,0.18)" }}>
            <span className="font-amiri text-2xl" style={{ color:"#D4AF37" }}>ا</span>
          </motion.div>
          <h1 className="font-amiri text-4xl font-bold text-white">حاسبة الأبجد</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>Abjad Calculator</p>
          <GoldDivider />
        </div>

        {/* ── Mode Selector ── */}
        <div className="rounded-2xl border p-3"
          style={{ background:"rgba(6,14,36,0.97)", borderColor:"rgba(255,255,255,0.09)", boxShadow:"0 2px 20px rgba(0,0,0,0.45)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest text-center text-white/25 mb-2.5">Select Calculation Mode</p>
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
        <div className="rounded-2xl border p-5"
          style={{ background:"rgba(10,24,56,0.95)", borderColor: G.borderHi, boxShadow:`0 0 28px ${G.glow}, 0 4px 20px rgba(0,0,0,0.40)` }}>
          <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5" style={{ color: G.dim }}>
            Arabic Text Input — {modeObj.label}
          </label>
          <textarea dir="rtl" value={input}
            onChange={e => { setInput(e.target.value); setResult(null); }}
            onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleCalculate(); } }}
            placeholder="أدخل النص العربي هنا..."
            rows={4}
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white mb-3 placeholder:text-white/30"
            style={{ background:"rgba(4,12,34,0.97)", border:`1px solid ${G.border}` }} />
          <div className="flex gap-2">
            <motion.button onClick={handleCalculate} disabled={!input.trim()}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-inter font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a]"
              style={{ background:"linear-gradient(135deg,#fcd34d,#d97706)", boxShadow:`0 0 28px ${G.glowHi}` }}>
              <span className="font-amiri text-base">احسب</span> Calculate
            </motion.button>
            <motion.button onClick={handleClear} disabled={!input && !result}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-white/70 hover:text-white font-inter text-sm border border-white/15 hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background:"rgba(255,255,255,0.04)" }}>
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

              {/* Copy */}
              <div className="flex justify-start pt-1">
                <motion.button onClick={handleCopy}
                  whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-xs font-inter transition-all"
                  style={{ background:"rgba(255,255,255,0.06)" }}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Results"}
                </motion.button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Reference Table ── */}
        <KabirReferenceTable />

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