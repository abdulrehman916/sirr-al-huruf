// ═══════════════════════════════════════════════════════════════
// FAAL HASRATH PAGE — Independent Module
// Subsections: Faal Ali (16 hearts) + Faalul Luqman (28 symbols)
// Each subsection uses its own isolated dataset.
// Zero shared logic with any other module.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FAAL_CELLS } from "../lib/faalHasrathData";
import { LUQMAN_CELLS } from "../lib/faalLuqmanData";
import { FALNAMEH_QUESTIONS, FALNAMEH_VERSES, PERSIAN_LETTERS } from "../lib/falnamehSheikhBahaiData";

// ── Shared Palette ─────────────────────────────────────────────
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
};

// ── SVG inner mark renderer (Faal Ali) ────────────────────────
function InnerMark({ mark, size = 28, color = "#D8B4FE" }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.14;
  const sw = Math.max(1.5, size * 0.09);
  const sp = { stroke: color, strokeWidth: sw, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

  const marks = {
    "dot":        <circle cx={cx} cy={cy} r={r} fill={color} />,
    "two-dots":   <><circle cx={cx - r * 1.6} cy={cy} r={r * 0.85} fill={color} /><circle cx={cx + r * 1.6} cy={cy} r={r * 0.85} fill={color} /></>,
    "three-dots": <><circle cx={cx} cy={cy - r * 1.5} r={r * 0.8} fill={color} /><circle cx={cx - r * 1.4} cy={cy + r} r={r * 0.8} fill={color} /><circle cx={cx + r * 1.4} cy={cy + r} r={r * 0.8} fill={color} /></>,
    "cross":      <><line x1={cx} y1={cy - r * 2.2} x2={cx} y2={cy + r * 2.2} {...sp} /><line x1={cx - r * 2.2} y1={cy} x2={cx + r * 2.2} y2={cy} {...sp} /></>,
    "x-cross":    <><line x1={cx - r * 2} y1={cy - r * 2} x2={cx + r * 2} y2={cy + r * 2} {...sp} /><line x1={cx + r * 2} y1={cy - r * 2} x2={cx - r * 2} y2={cy + r * 2} {...sp} /></>,
    "line-h":     <line x1={cx - r * 2.4} y1={cy} x2={cx + r * 2.4} y2={cy} {...sp} />,
    "line-v":     <line x1={cx} y1={cy - r * 2.4} x2={cx} y2={cy + r * 2.4} {...sp} />,
    "line-diag":  <line x1={cx - r * 2} y1={cy + r * 2} x2={cx + r * 2} y2={cy - r * 2} {...sp} />,
    "arc-up":     <path d={`M ${cx - r * 2.2} ${cy + r * 0.5} Q ${cx} ${cy - r * 2.2} ${cx + r * 2.2} ${cy + r * 0.5}`} {...sp} />,
    "arc-down":   <path d={`M ${cx - r * 2.2} ${cy - r * 0.5} Q ${cx} ${cy + r * 2.2} ${cx + r * 2.2} ${cy - r * 0.5}`} {...sp} />,
    "eye":        <><path d={`M ${cx - r * 2.2} ${cy} Q ${cx} ${cy - r * 2} ${cx + r * 2.2} ${cy} Q ${cx} ${cy + r * 2} ${cx - r * 2.2} ${cy} Z`} {...sp} /><circle cx={cx} cy={cy} r={r * 0.7} fill={color} /></>,
    "circle":     <circle cx={cx} cy={cy} r={r * 1.8} {...sp} />,
    "double-arc": <><path d={`M ${cx - r * 2} ${cy - r * 0.6} Q ${cx} ${cy - r * 2.4} ${cx + r * 2} ${cy - r * 0.6}`} {...sp} /><path d={`M ${cx - r * 2} ${cy + r * 0.8} Q ${cx} ${cy + r * 2.6} ${cx + r * 2} ${cy + r * 0.8}`} {...sp} /></>,
    "spiral":     <path d={`M ${cx} ${cy} m ${r * 0.6} 0 a ${r * 0.6} ${r * 0.6} 0 1 0 -${r * 1.2} 0 a ${r * 1.2} ${r * 1.2} 0 1 1 ${r * 2.4} 0`} {...sp} />,
    "star3":      <><line x1={cx} y1={cy - r * 2.2} x2={cx} y2={cy + r * 2.2} {...sp} /><line x1={cx - r * 1.9} y1={cy - r * 1.1} x2={cx + r * 1.9} y2={cy + r * 1.1} {...sp} /><line x1={cx + r * 1.9} y1={cy - r * 1.1} x2={cx - r * 1.9} y2={cy + r * 1.1} {...sp} /></>,
    "zigzag":     <polyline points={`${cx - r * 2.2},${cy + r * 1.2} ${cx - r * 0.8},${cy - r * 1.2} ${cx + r * 0.8},${cy + r * 1.2} ${cx + r * 2.2},${cy - r * 1.2}`} {...sp} />,
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {marks[mark] || <circle cx={cx} cy={cy} r={r} fill={color} />}
    </svg>
  );
}

// ── Heart SVG (Faal Ali) ───────────────────────────────────────
function HeartSymbol({ mark, size = 64, active = false }) {
  const heartPath = "M50,30 C50,20 35,10 25,18 C15,26 15,40 25,50 L50,75 L75,50 C85,40 85,26 75,18 C65,10 50,20 50,30 Z";
  const markSize = size * 0.38;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ filter: `drop-shadow(0 0 ${active ? 10 : 5}px ${active ? P.glowHi : P.glow})`, overflow: "visible" }}>
      <path d={heartPath}
        fill={active ? "rgba(216,180,254,0.14)" : "rgba(216,180,254,0.06)"}
        stroke={active ? "rgba(216,180,254,0.85)" : "rgba(216,180,254,0.60)"}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <foreignObject x={(100 - markSize) / 2} y="30" width={markSize} height={markSize}>
        <div xmlns="http://www.w3.org/1999/xhtml"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
          <InnerMark mark={mark} size={markSize} color="#D8B4FE" />
        </div>
      </foreignObject>
    </svg>
  );
}

// ── Section Tab Selector ───────────────────────────────────────
function SectionTabs({ section, setSection }) {
  const tabs = [
    { key: "ali",    arabic: "فأل حسرت علي", label: "FAAL ALI",    path: "/faal-hasrath" },
    { key: "luqman", arabic: "فال لقمان",     label: "FAAL LUQMAN", path: "/faal-hasrath" },
  ];
  return (
    <div className="flex rounded-2xl overflow-hidden border" style={{ borderColor: P.faint }}>
      {tabs.map((t, i) => (
        <motion.button
          key={t.key}
          onClick={() => setSection(t.key)}
          className="flex-1 flex flex-col items-center py-2.5 px-2 relative"
          style={{
            background: section === t.key ? P.bgHi : "transparent",
            borderRight: i === 0 ? `1px solid ${P.faint}` : "none",
          }}
          whileTap={{ scale: 0.97 }}
        >
          {section === t.key && (
            <motion.div
              layoutId="sectionHighlight"
              className="absolute inset-0"
              style={{ background: P.bgHi, borderRadius: "inherit" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
          )}
          <span className="font-amiri text-sm leading-none relative z-10"
            style={{ color: section === t.key ? P.text : P.dim }}>
            {t.arabic}
          </span>
          <span className="font-inter text-[8px] tracking-widest uppercase mt-0.5 relative z-10"
            style={{ color: section === t.key ? P.text : "rgba(216,180,254,0.28)" }}>
            {t.label}
          </span>
        </motion.button>
      ))}
      {/* Third tab - links to separate page */}
      <a
        href="/falnameh-sheikh-bahai"
        className="flex-1 flex flex-col items-center py-2.5 px-2 relative"
        style={{
          background: "transparent",
          borderLeft: `1px solid ${P.faint}`,
        }}
      >
        <span className="font-amiri text-sm leading-none relative z-10"
          style={{ color: P.dim }}>
          فالنامه شیخ بهایی
        </span>
        <span className="font-inter text-[8px] tracking-widest uppercase mt-0.5 relative z-10"
          style={{ color: "rgba(216,180,254,0.28)" }}>
          SHEIKH BAHAI
        </span>
        <ChevronRight className="absolute top-2 right-2 w-3 h-3" style={{ color: P.faint }} />
      </a>
    </div>
  );
}

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

// ══════════════════════════════════════════════════════════════
// FAAL ALI SECTION (unchanged)
// ══════════════════════════════════════════════════════════════

function FaalCell({ cell, lang, index, onTap }) {
  const t = cell[lang];
  return (
    <motion.button
      onClick={() => onTap(cell)}
      initial={{ opacity: 0, scale: 0.72 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      className="relative flex flex-col items-center justify-between rounded-2xl border pt-2 pb-2 px-1"
      style={{
        background: P.bg,
        borderColor: P.faint,
        aspectRatio: "1 / 1",
        WebkitTapHighlightColor: "transparent",
        minHeight: 0,
      }}
    >
      <span className="absolute top-1.5 left-2 font-inter text-[9px] font-bold tabular-nums"
        style={{ color: "rgba(216,180,254,0.30)" }}>
        {cell.id}
      </span>
      <motion.div
        className="flex-1 flex items-center justify-center w-full"
        animate={{ opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 3.2 + index * 0.22, repeat: Infinity, ease: "easeInOut" }}
      >
        <HeartSymbol mark={cell.innerMark} size={52} />
      </motion.div>
    </motion.button>
  );
}

function FaalAliModal({ cell, lang, onClose }) {
  if (!cell) return null;
  const t = cell[lang];
  return (
    <AnimatePresence>
      <motion.div key="ali-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 pb-4 sm:pb-0"
        style={{ background: "rgba(0,0,0,0.84)", backdropFilter: "blur(8px)" }}
        onClick={onClose}>
        <motion.div key="ali-panel" initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ duration: 0.30, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
            borderColor: P.borderHi,
            boxShadow: `0 0 80px ${P.glow}, 0 8px 48px rgba(0,0,0,0.80), inset 0 1px 0 rgba(216,180,254,0.10)`,
            maxHeight: "88vh", overflowY: "auto",
          }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${P.borderHi}, transparent)` }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border z-10"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}>
            <X className="w-4 h-4 text-white/60" />
          </button>
          <div className="p-6 space-y-5">
            <div className="text-center space-y-3 pt-1">
              <motion.div className="flex justify-center"
                animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
                <HeartSymbol mark={cell.innerMark} size={86} active />
              </motion.div>
              <span className="font-inter text-[9px] uppercase tracking-[0.28em]"
                style={{ color: "rgba(216,180,254,0.38)" }}>
                {lang === "ml" ? `ഫാൽ ${cell.id} / ൧൬` : `Faal ${cell.id} of 16`}
              </span>
              <motion.h2 className="font-amiri font-bold leading-snug"
                style={{ fontSize: "clamp(1.3rem, 5.5vw, 1.8rem)", color: P.text }}
                animate={{ textShadow: [`0 0 12px ${P.glow}`, `0 0 32px ${P.glowHi}`, `0 0 12px ${P.glow}`] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {t.result}
              </motion.h2>
              <div className="flex items-center justify-center gap-2.5">
                <div style={{ width: 38, height: 0.5, background: `linear-gradient(to right, transparent, ${P.borderHi})` }} />
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: P.text, boxShadow: `0 0 6px ${P.glowHi}` }} />
                <div style={{ width: 38, height: 0.5, background: `linear-gradient(to left, transparent, ${P.borderHi})` }} />
              </div>
            </div>
            <div className="rounded-2xl border p-4 space-y-2" style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>
                {lang === "ml" ? "◈ ഫലം" : "◈ Result"}
              </p>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
              <p className="font-amiri text-base leading-relaxed" style={{ color: P.text }}>{t.body}</p>
            </div>
            <div className="rounded-2xl border p-4 space-y-2" style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>
                {lang === "ml" ? "☽ പരിഹാരം" : "☽ Remedy"}
              </p>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
              <p className="font-amiri text-base leading-relaxed text-white/70">{t.remedy}</p>
            </div>
            <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-1"
              style={{ color: "rgba(216,180,254,0.18)" }}>
              فأل نامه حسرت علي — Faal Nama Hasrath Ali
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FaalAliSection({ lang }) {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {/* Collapsible Instruction Panel */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border px-4 py-3 mb-3 overflow-hidden"
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
              {lang === "ml" ? "ഫാൽ അലി എടുക്കുന്ന വിധം" : "FAAL ALI – Method"}
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
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                1. സൂറത്ത് അൽ-ഫാതിഹ ഓതുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                2. അതിന്റെ സവാബ് റസൂലുല്ലാഹ് ﷺ യ്ക്ക് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                3. ഒരു ഫാതിഹ ഓതി അഹ്‌ലുൽ ബൈത്തിന് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                4. ഒരു ഫാതിഹ ഓതി സഹാബാക്കൾക്ക് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                5. ഒരു ഫാതിഹ ഓതി ഹസ്രത്ത് അലി (റ) യ്ക്ക് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                6. കണ്ണടയ്ക്കുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                7. കലിമാ ശരീഫ് ചൊല്ലി കലിമാവിരൽ ഉയർത്തുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                8. സൂറത്ത് അൽ-ഇഖ്‌ലാസ്, സൂറത്ത് അൽ-ഫലഖ്, സൂറത്ത് അൻ-നാസ് (3 കുൽ സൂറത്തുകൾ) ഓതുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                9. മനസ്സിൽ ഉദ്ദേശിക്കുന്ന കാര്യം കരുതുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                10. അക്ഷരങ്ങളുടെ കളത്തിൽ സ്പർശിക്കുക.
              </p>
              <p className="font-amiri leading-relaxed font-semibold" style={{ color: P.text }}>
                11. ലഭിക്കുന്ന അക്ഷരത്തിന്റെ ഫലം വായിക്കുക.
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
                6. Close your eyes.
              </p>
              <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                7. Recite the Kalimah and raise your index finger.
              </p>
              <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                8. Recite the three Qul Surahs: Surah Al-Ikhlas, Surah Al-Falaq, Surah An-Nas.
              </p>
              <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                9. Keep your intention firmly in your heart.
              </p>
              <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                10. Touch one of the letter cells.
              </p>
              <p className="font-inter text-xs leading-relaxed font-semibold" style={{ color: "rgba(216,180,254,0.95)" }}>
                11. Read the result of the selected letter.
              </p>
            </>
          )}
          </div>
        </motion.div>
      </motion.div>

      <div dir="rtl" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {FAAL_CELLS.map((cell, i) => (
          <FaalCell key={cell.id} cell={cell} lang={lang} index={i} onTap={setSelected} />
        ))}
      </div>

      <p className="font-inter text-[8px] uppercase tracking-widest text-center"
        style={{ color: "rgba(216,180,254,0.16)" }}>
        ✦ ൧ — ൧൬ ✦
      </p>

      <FaalAliModal cell={selected} lang={lang} onClose={() => setSelected(null)} />
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// FAALUL LUQMAN SECTION (new, independent)
// ══════════════════════════════════════════════════════════════

function LuqmanCell({ cell, lang, index, onTap }) {
  const t = cell[lang];
  return (
    <motion.button
      onClick={() => onTap(cell)}
      initial={{ opacity: 0, scale: 0.72 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.26, ease: "easeOut" }}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.92 }}
      className="relative flex flex-col items-center justify-between rounded-2xl border py-3 px-1"
      style={{
        background: P.bg,
        borderColor: P.faint,
        aspectRatio: "1 / 1",
        WebkitTapHighlightColor: "transparent",
        minHeight: 0,
      }}
    >
      <span className="absolute top-1 left-1.5 font-inter text-[8px] tabular-nums"
        style={{ color: "rgba(216,180,254,0.22)" }}>
        {cell.lq_id - 100}
      </span>

      {/* Arabic letter — the main symbol */}
      <motion.div
        className="flex-1 flex items-center justify-center w-full"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 3.4 + index * 0.18, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-amiri font-bold select-none"
          style={{
            fontSize: "clamp(1.5rem, 7vw, 2.2rem)",
            color: P.text,
            textShadow: `0 0 14px ${P.glow}`,
            lineHeight: 1,
          }}>
          {cell.symbol}
        </span>
      </motion.div>
    </motion.button>
  );
}

function LuqmanModal({ cell, lang, onClose }) {
  if (!cell) return null;
  const t = cell[lang];
  const num = cell.lq_id - 100;
  return (
    <AnimatePresence>
      <motion.div key="lq-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 pb-4 sm:pb-0"
        style={{ background: "rgba(0,0,0,0.84)", backdropFilter: "blur(8px)" }}
        onClick={onClose}>
        <motion.div key="lq-panel" initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ duration: 0.30, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
            borderColor: P.borderHi,
            boxShadow: `0 0 80px ${P.glow}, 0 8px 48px rgba(0,0,0,0.80), inset 0 1px 0 rgba(216,180,254,0.10)`,
            maxHeight: "88vh", overflowY: "auto",
          }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${P.borderHi}, transparent)` }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border z-10"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}>
            <X className="w-4 h-4 text-white/60" />
          </button>
          <div className="p-6 space-y-5">
            <div className="text-center space-y-3 pt-1">
              {/* Large symbol display */}
              <motion.div className="flex justify-center"
                animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
                <div className="w-20 h-20 rounded-2xl border flex items-center justify-center"
                  style={{
                    background: P.bgHi,
                    borderColor: P.borderHi,
                    boxShadow: `0 0 40px ${P.glow}`,
                  }}>
                  <span className="font-amiri font-bold" style={{ fontSize: "3rem", color: P.text, lineHeight: 1 }}>
                    {cell.symbol}
                  </span>
                </div>
              </motion.div>

              <span className="font-inter text-[9px] uppercase tracking-[0.28em]"
                style={{ color: "rgba(216,180,254,0.38)" }}>
                {cell.symbolName} — {lang === "ml" ? `${num} / ൨൮` : `${num} of 28`}
              </span>

              <motion.h2 className="font-amiri font-bold leading-snug"
                style={{ fontSize: "clamp(1.3rem, 5.5vw, 1.8rem)", color: P.text }}
                animate={{ textShadow: [`0 0 12px ${P.glow}`, `0 0 32px ${P.glowHi}`, `0 0 12px ${P.glow}`] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {t.result}
              </motion.h2>

              <div className="flex items-center justify-center gap-2.5">
                <div style={{ width: 38, height: 0.5, background: `linear-gradient(to right, transparent, ${P.borderHi})` }} />
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: P.text, boxShadow: `0 0 6px ${P.glowHi}` }} />
                <div style={{ width: 38, height: 0.5, background: `linear-gradient(to left, transparent, ${P.borderHi})` }} />
              </div>
            </div>

            <div className="rounded-2xl border p-4 space-y-2" style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>
                {lang === "ml" ? "◈ ഫലം" : "◈ Result"}
              </p>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
              <p className="font-amiri text-base leading-relaxed" style={{ color: P.text }}>{t.body}</p>
            </div>

            <div className="rounded-2xl border p-4 space-y-2" style={{ background: P.bg, borderColor: P.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>
                {lang === "ml" ? "☽ പരിഹാരം" : "☽ Remedy"}
              </p>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
              <p className="font-amiri text-base leading-relaxed text-white/70">{t.remedy}</p>
            </div>

            <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-1"
              style={{ color: "rgba(216,180,254,0.18)" }}>
              فال لقمان — Faalul Luqman
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FaalLuqmanSection({ lang }) {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {/* Collapsible Instruction Panel */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border px-4 py-3 mb-3 overflow-hidden"
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
              {lang === "ml" ? "ഫാൽ ലുഖ്മാൻ എടുക്കുന്ന വിധം" : "FAAL LUQMAN – Method"}
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
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                1. സൂറത്ത് അൽ-ഫാതിഹ ഓതുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                2. അതിന്റെ സവാബ് റസൂലുല്ലാഹ് ﷺ യ്ക്ക് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                3. ഒരു ഫാതിഹ ഓതി അഹ്‌ലുൽ ബൈത്തിന് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                4. ഒരു ഫാതിഹ ഓതി സഹാബാക്കൾക്ക് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                5. ഒരു ഫാതിഹ ഓതി ഹസ്രത്ത് അലി (റ) യ്ക്ക് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                6. ഒരു ഫാതിഹ ഓതി ഹസ്രത്ത് ലുഖ്മാൻ (റ) യ്ക്ക് ഹദിയ ചെയ്യുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                7. കണ്ണടയ്ക്കുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                8. കലിമാ ശരീഫ് ചൊല്ലി കലിമാവിരൽ ഉയർത്തുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                9. സൂറത്ത് അൽ-ഇഖ്‌ലാസ്, സൂറത്ത് അൽ-ഫലഖ്, സൂറത്ത് അൻ-നാസ് (3 കുൽ സൂറത്തുകൾ) ഓതുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                10. മനസ്സിൽ ഉദ്ദേശിക്കുന്ന കാര്യം കരുതുക.
              </p>
              <p className="font-amiri leading-relaxed" style={{ color: "rgba(216,180,254,0.85)" }}>
                11. അക്ഷരങ്ങളുടെ കളത്തിൽ സ്പർശിക്കുക.
              </p>
              <p className="font-amiri leading-relaxed font-semibold" style={{ color: P.text }}>
                12. ലഭിക്കുന്ന അക്ഷരത്തിന്റെ ഫലം വായിക്കുക.
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
                6. Recite one Fatihah and gift its reward to Hazrat Luqman (RA).
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
                11. Touch one of the letter cells.
              </p>
              <p className="font-inter text-xs leading-relaxed font-semibold" style={{ color: "rgba(216,180,254,0.95)" }}>
                12. Read the result of the selected letter.
              </p>
            </>
          )}
          </div>
        </motion.div>
      </motion.div>

      {/* 4×7 grid for 28 cells */}
      <div dir="rtl" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {LUQMAN_CELLS.map((cell, i) => (
          <LuqmanCell key={cell.lq_id} cell={cell} lang={lang} index={i} onTap={setSelected} />
        ))}
      </div>

      <p className="font-inter text-[8px] uppercase tracking-widest text-center"
        style={{ color: "rgba(216,180,254,0.16)" }}>
        ✦ فال لقمان ✦
      </p>

      <LuqmanModal cell={selected} lang={lang} onClose={() => setSelected(null)} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// FALNAMEH SHEIKH BAHAI SECTION
// Independent from Faal Ali and Faal Luqman
// ═══════════════════════════════════════════════════════════════

function FalnamehSheikhBahaiSection({ lang }) {
  const [expandedSheikh, setExpandedSheikh] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [result, setResult] = useState(null);

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
    <>
      {/* Collapsible Instruction Panel */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border px-4 py-3 mb-3 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(160,100,220,0.12) 0%, rgba(160,100,220,0.06) 100%)",
          borderColor: P.border,
          boxShadow: `0 0 20px ${P.glow}, inset 0 1px 0 rgba(216,180,254,0.08)`,
        }}>
        <button
          onClick={() => setExpandedSheikh(!expandedSheikh)}
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
            animate={{ rotate: expandedSheikh ? 180 : 0 }}
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
            height: expandedSheikh ? "auto" : 0,
            opacity: expandedSheikh ? 1 : 0,
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

      {/* Question Selector */}
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
              <motion.button
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02, duration: 0.25 }}
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
                  سؤال {q.id}
                </span>
                <p className="font-amiri font-bold text-xs mb-1" style={{ color: P.text, lineHeight: 1.5 }}>
                  {q.persianTitle}
                </p>
                <p className="font-inter text-[8px]" style={{ color: P.dim }}>
                  {lang === "ml" ? q.malayalamTitle : q.englishTitle}
                </p>
              </motion.button>
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
                <motion.button
                  key={i}
                  onClick={() => handleSelectLetter(letter)}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01, duration: 0.15 }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg border flex items-center justify-center aspect-square"
                  style={{
                    background: selectedLetter === letter ? P.bgHi : P.bg,
                    borderColor: selectedLetter === letter ? P.borderHi : P.faint,
                    boxShadow: selectedLetter === letter ? `0 0 12px ${P.glowHi}` : "none",
                  }}
                >
                  <span className="font-amiri text-xs" style={{
                    color: selectedLetter === letter ? P.gold : P.text,
                    textShadow: selectedLetter === letter ? `0 0 8px ${P.gold}` : "none",
                  }}>
                    {letter}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: P.faint }}>
            ൧൮ × ൧൨ = ൨൧൬ അക്ഷരങ്ങൾ
          </p>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 pb-4 sm:pb-0"
            style={{ background: "rgba(0,0,0,0.84)", backdropFilter: "blur(8px)" }}
            onClick={handleCloseResult}
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
                onClick={handleCloseResult}
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
                    {FALNAMEH_VERSES[result.letter]?.persian || "..."}
                  </p>
                </div>

                {/* Malayalam Translation */}
                <div className="rounded-2xl border p-4"
                  style={{ background: P.bg, borderColor: P.faint }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                    {lang === "ml" ? "◈ മലയാളം തർജ്ജമ" : "◈ Malayalam Translation"}
                  </p>
                  <p className="font-amiri text-base leading-relaxed" style={{ color: P.text }}>
                    {lang === "ml" ? FALNAMEH_VERSES[result.letter]?.ml?.meaning : FALNAMEH_VERSES[result.letter]?.en?.meaning}
                  </p>
                </div>

                {/* Interpretation */}
                <div className="rounded-2xl border p-4"
                  style={{ background: P.bg, borderColor: P.faint }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
                    {lang === "ml" ? "☽ വ്യാഖ്യാനം" : "☽ Interpretation"}
                  </p>
                  <p className="font-amiri text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {lang === "ml" ? FALNAMEH_VERSES[result.letter]?.ml?.interpretation : FALNAMEH_VERSES[result.letter]?.en?.interpretation}
                  </p>
                </div>

                <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-2" style={{ color: P.faint }}>
                  فالنامه شیخ بهایی — Falnameh Sheikh Bahai
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function FaalHasrathPage() {
  const [lang, setLang] = useState("ml");
  const [section, setSection] = useState("ali");

  return (
    <PageLayout>
      <div className="space-y-4">

        <PageTitle
          arabic="فأل نامه حسرت علي"
          latin="Faal Nama Hasrath Ali"
          subtitle="Sacred Omen System"
          icon="♡"
        />

        {/* Section selector */}
        <SectionTabs section={section} setSection={setSection} />

        {/* Language toggle */}
        <LangToggle lang={lang} setLang={setLang} />

        {/* Conditional section render */}
        <AnimatePresence mode="wait">
          {section === "ali" ? (
            <motion.div key="ali-section"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
              className="space-y-4">
              <FaalAliSection lang={lang} />
            </motion.div>
          ) : (
            <motion.div key="luqman-section"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
              className="space-y-4">
              <FaalLuqmanSection lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageLayout>
  );
}