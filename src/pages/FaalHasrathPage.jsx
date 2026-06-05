// ═══════════════════════════════════════════════════════════════
// FAAL HASRATH PAGE — Independent Module
// Subsections: Faal Ali (16 hearts) + Faalul Luqman (28 symbols)
// Each subsection uses its own isolated dataset.
// Zero shared logic with any other module.
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FAAL_CELLS } from "../lib/faalHasrathData";
import { LUQMAN_CELLS } from "../lib/faalLuqmanData";

// ── Shared Palette ─────────────────────────────────────────────
const P = {
  border:   "rgba(160,100,220,0.50)",
  borderHi: "rgba(190,130,255,0.80)",
  glow:     "rgba(140,80,210,0.35)",
  glowHi:   "rgba(190,130,255,0.65)",
  text:     "#E2C6FF",
  dim:      "rgba(226,198,255,0.65)",
  faint:    "rgba(216,180,254,0.24)",
  bg:       "rgba(10,4,28,0.82)",
  bgHi:     "rgba(30,10,60,0.92)",
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
    { key: "ali",    arabic: "فأل حسرت علي", label: "FAAL ALI" },
    { key: "luqman", arabic: "فال لقمان",     label: "FAAL LUQMAN" },
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

// ── Shared shuffle utility ─────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════════════════════════
// FAAL ALI SECTION
// ══════════════════════════════════════════════════════════════

function FaalCell({ cell, lang, index, onTap }) {
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (revealed) return;
    setRevealed(true);
    setTimeout(() => onTap(cell), 900);
  };

  const dealOffset = useMemo(() => ({
    x: (Math.random() - 0.5) * 24,
    y: (Math.random() - 0.5) * 24,
    rotate: (Math.random() - 0.5) * 18,
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.72, x: dealOffset.x, y: dealOffset.y, rotate: dealOffset.rotate }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.04, duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
      onClick={handleClick}
      className="relative rounded-2xl border flex items-center justify-center"
      style={{
        aspectRatio: "1 / 1",
        minHeight: "clamp(52px, 18vw, 90px)",
        cursor: revealed ? "default" : "pointer",
        WebkitTapHighlightColor: "transparent",
        background: revealed ? P.bgHi : P.bg,
        borderColor: revealed ? P.borderHi : P.faint,
        transition: "background 0.3s, border-color 0.3s",
        boxShadow: revealed ? `0 0 18px ${P.glow}` : "none",
      }}
    >
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Outer ornamental border */}
            <div style={{
              position: "absolute", inset: 3, borderRadius: 9,
              border: `1px solid rgba(216,180,254,0.22)`,
              pointerEvents: "none",
            }} />
            {/* Inner ornamental border */}
            <div style={{
              position: "absolute", inset: 6, borderRadius: 6,
              border: `1px solid rgba(216,180,254,0.10)`,
              pointerEvents: "none",
            }} />
            {/* Corner dots */}
            {[["3px","3px"],["3px","auto"],["auto","3px"],["auto","auto"]].map(([t,b], i) => (
              <div key={i} style={{
                position: "absolute",
                top: t !== "auto" ? 5 : "auto", bottom: b !== "auto" ? 5 : "auto",
                left: i % 2 === 0 ? 5 : "auto", right: i % 2 !== 0 ? 5 : "auto",
                width: 3, height: 3, borderRadius: "50%",
                background: "rgba(216,180,254,0.30)",
              }} />
            ))}
            {/* Center symbol with glow */}
            <span style={{
              fontSize: "clamp(1.1rem, min(6vw, 5dvh), 1.9rem)",
              color: P.text,
              lineHeight: 1,
              textShadow: `0 0 8px ${P.glowHi}, 0 0 20px ${P.glow}, 0 0 40px rgba(160,100,220,0.30)`,
            }}>
              ❖
            </span>
          </motion.div>
        ) : (
          <motion.span
            key="letter"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="font-amiri font-bold select-none text-center px-1"
            style={{
              fontSize: "clamp(0.55rem, min(3.5vw, 3dvh), 1rem)",
              color: P.text,
              textShadow: `0 0 14px ${P.glowHi}`,
              lineHeight: 1.2,
            }}
          >
            {cell[lang].shortTitle}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FaalAliModal({ cell, lang, onClose }) {
  if (!cell) return null;
  const t = cell[lang];
  return (
    <AnimatePresence>
      <motion.div key="ali-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
          background: "rgba(0,0,0,0.84)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}>
        <motion.div key="ali-panel" initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ duration: 0.30, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
            borderColor: P.borderHi,
            boxShadow: `0 0 80px ${P.glow}, 0 8px 48px rgba(0,0,0,0.80), inset 0 1px 0 rgba(216,180,254,0.10)`,
            maxHeight: "min(88vh, calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 32px))",
            overflowY: "auto",
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

function FaalAliSection({ lang, shuffledCells, onShuffle }) {
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

      <div dir="rtl" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "clamp(6px, 2vw, 12px)" }}>
        {shuffledCells.map((cell, i) => (
          <FaalCell key={cell.id} cell={cell} lang={lang} index={i} onTap={setSelected} />
        ))}
      </div>

      <p className="font-inter text-[8px] uppercase tracking-widest text-center"
        style={{ color: "rgba(216,180,254,0.16)" }}>
        ✦ ൧ — ൧൬ ✦
      </p>

      <FaalAliModal cell={selected} lang={lang} onClose={() => setSelected(null)} />
      <div className="text-center mt-4">
        <motion.button onClick={onShuffle} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-xl border font-inter text-xs font-semibold" style={{ background: P.bg, borderColor: P.border, color: P.dim }}>
          New Reading (Shuffle)
        </motion.button>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// FAALUL LUQMAN SECTION (new, independent)
// ══════════════════════════════════════════════════════════════

function LuqmanCell({ cell, index, onTap }) {
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (revealed) return;
    setRevealed(true);
    setTimeout(() => onTap(cell), 900);
  };

  const dealOffset = useMemo(() => ({
    x: (Math.random() - 0.5) * 24,
    y: (Math.random() - 0.5) * 24,
    rotate: (Math.random() - 0.5) * 18,
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.72, x: dealOffset.x, y: dealOffset.y, rotate: dealOffset.rotate }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.04, duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
      onClick={handleClick}
      className="relative rounded-lg border flex items-center justify-center"
      style={{
        minHeight: "clamp(36px, 10vw, 60px)",
        minWidth: 0,
        cursor: revealed ? "default" : "pointer",
        WebkitTapHighlightColor: "transparent",
        background: revealed ? P.bgHi : P.bg,
        borderColor: revealed ? P.borderHi : P.faint,
        transition: "background 0.3s, border-color 0.3s",
        boxShadow: revealed ? `0 0 18px ${P.glow}` : "none",
      }}
    >
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Outer ornamental border */}
            <div style={{
              position: "absolute", inset: 2, borderRadius: 5,
              border: `1px solid rgba(216,180,254,0.20)`,
              pointerEvents: "none",
            }} />
            {/* Inner ornamental border */}
            <div style={{
              position: "absolute", inset: 4, borderRadius: 3,
              border: `1px solid rgba(216,180,254,0.09)`,
              pointerEvents: "none",
            }} />
            {/* Corner dots */}
            {[0,1,2,3].map((i) => (
              <div key={i} style={{
                position: "absolute",
                top: i < 2 ? 4 : "auto", bottom: i >= 2 ? 4 : "auto",
                left: i % 2 === 0 ? 4 : "auto", right: i % 2 !== 0 ? 4 : "auto",
                width: 2, height: 2, borderRadius: "50%",
                background: "rgba(216,180,254,0.28)",
              }} />
            ))}
            {/* Center symbol with glow */}
            <span style={{
              fontSize: "clamp(0.8rem, min(4.5vw, 3.8dvh), 1.3rem)",
              color: P.text,
              lineHeight: 1,
              textShadow: `0 0 6px ${P.glowHi}, 0 0 16px ${P.glow}, 0 0 32px rgba(160,100,220,0.28)`,
            }}>
              ۞
            </span>
          </motion.div>
        ) : (
          <motion.span
            key="letter"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="font-amiri font-bold select-none"
            style={{
              fontSize: "clamp(0.75rem, min(4.8vw, 3.8dvh), 1.6rem)",
              color: P.text,
              textShadow: `0 0 14px ${P.glowHi}`,
              lineHeight: 1,
            }}
          >
            {cell.symbol}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
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
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
          background: "rgba(0,0,0,0.84)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}>
        <motion.div key="lq-panel" initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ duration: 0.30, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
            borderColor: P.borderHi,
            boxShadow: `0 0 80px ${P.glow}, 0 8px 48px rgba(0,0,0,0.80), inset 0 1px 0 rgba(216,180,254,0.10)`,
            maxHeight: "min(88vh, calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 32px))",
            overflowY: "auto",
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

function FaalLuqmanSection({ lang, shuffledCells, onShuffle }) {
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

      {/* 7×4 grid — responsive: 4 cols on tiny phones, 7 on normal+ */}
      <div
        dir="rtl"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: "clamp(3px, 1.2vw, 8px)",
          minHeight: "clamp(180px, 38dvh, 360px)",
        }}
      >
        {shuffledCells.map((cell, i) => (
          <LuqmanCell key={cell.lq_id} cell={cell} index={i} onTap={setSelected} />
        ))}
      </div>

      <p className="font-inter text-[8px] uppercase tracking-widest text-center"
        style={{ color: "rgba(216,180,254,0.16)" }}>
        ✦ فال لقمان ✦
      </p>

      <LuqmanModal cell={selected} lang={lang} onClose={() => setSelected(null)} />
       <div className="text-center mt-4">
        <motion.button onClick={onShuffle} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-xl border font-inter text-xs font-semibold" style={{ background: P.bg, borderColor: P.border, color: P.dim }}>
          New Reading (Shuffle)
        </motion.button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
const PAGE_STATE_KEY = 'faalHasrathPageState';

const getInitialState = () => {
  try {
    const savedState = sessionStorage.getItem(PAGE_STATE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.shuffledAli && parsed.shuffledLuqman) {
        return parsed;
      }
    }
  } catch(e) {
    console.error("Failed to load Faal state", e);
  }
  return {
    lang: "ml",
    section: "ali",
    shuffledAli: shuffleArray(FAAL_CELLS),
    shuffledLuqman: shuffleArray(LUQMAN_CELLS),
  };
};

export default function FaalHasrathPage() {
  const [initialState] = useState(getInitialState);
  const [lang, setLang] = useState(initialState.lang);
  const [section, setSection] = useState(initialState.section);
  const [shuffledAli, setShuffledAli] = useState(initialState.shuffledAli);
  const [shuffledLuqman, setShuffledLuqman] = useState(initialState.shuffledLuqman);

  useEffect(() => {
    try {
      const stateToSave = JSON.stringify({ lang, section, shuffledAli, shuffledLuqman });
      sessionStorage.setItem(PAGE_STATE_KEY, stateToSave);
    } catch(e) {
      console.error("Failed to save Faal state", e);
    }
  }, [lang, section, shuffledAli, shuffledLuqman]);

  const handleShuffle = (type) => {
    if (type === 'ali') setShuffledAli(shuffleArray(FAAL_CELLS));
    if (type === 'luqman') setShuffledLuqman(shuffleArray(LUQMAN_CELLS));
  };

  return (
    <PageLayout>
      {/* Deep cosmic background layer for this page */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(60,20,120,0.38) 0%, transparent 60%), linear-gradient(180deg, rgba(4,1,16,0.92) 0%, rgba(6,2,20,0.96) 100%)",
          zIndex: 0,
        }}
      />
      <div className="space-y-4 relative" style={{ zIndex: 1 }}>

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
              <FaalAliSection lang={lang} shuffledCells={shuffledAli} onShuffle={() => handleShuffle('ali')} />
            </motion.div>
          ) : (
            <motion.div key="luqman-section"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
              className="space-y-4">
              <FaalLuqmanSection lang={lang} shuffledCells={shuffledLuqman} onShuffle={() => handleShuffle('luqman')} />
            </motion.div>
          )}
        </AnimatePresence>

        </div>
    </PageLayout>
  );
}