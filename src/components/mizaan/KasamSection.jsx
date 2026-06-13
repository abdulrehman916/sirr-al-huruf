import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, AlertTriangle, FileText, Layers, Info, User, Users } from "lucide-react";
import { COMMON_KASAM, KASAM_CATEGORIES } from "../../lib/kasamData";

// ── Token substitution ───────────────────────────────────────────────────────
// Replaces {maleTargetName} and {femaleTargetName} in text with user-entered values.
// Returns array of segments: { text, isToken } for highlighted rendering.
function tokenize(text, names) {
  if (!text) return [];
  const regex = /(\{maleTargetName\}|\{femaleTargetName\})/g;
  const parts = [];
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index), isToken: false });
    const key = match[1] === "{maleTargetName}" ? "male" : "female";
    const filled = key === "male" ? names.male : names.female;
    parts.push({ text: filled || match[1], isToken: true, filled: !!filled, key });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), isToken: false });
  return parts;
}

function TokenText({ text, names, className, style, dir }) {
  const parts = tokenize(text, names);
  return (
    <span className={className} style={style} dir={dir}>
      {parts.map((p, i) =>
        p.isToken ? (
          <span key={i} style={{
            color: p.filled ? "#86efac" : "#fbbf24",
            background: p.filled ? "rgba(74,222,128,0.10)" : "rgba(251,191,36,0.10)",
            border: `1px solid ${p.filled ? "rgba(74,222,128,0.25)" : "rgba(251,191,36,0.25)"}`,
            borderRadius: "0.25rem",
            padding: "0 0.25rem",
            fontStyle: p.filled ? "normal" : "italic",
          }}>{p.text}</span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

// ── Section 4: KASAM (القسم) ──────────────────────────────────────────────────
// COMPLETELY ISOLATED from Sections 1, 2, 3.
// No calculations. No engine calls. Display only.
// Source authority: PDF manuscripts only. No AI-generated text.
//
// ARCHITECTURE:
//   Final Kasam = Common Kasam (base layer) + Selected Category Kasam
//   They are NOT merged — displayed as two separate sequential blocks.
// ─────────────────────────────────────────────────────────────────────────────

const G = {
  bg:           "rgba(5, 12, 28, 0.97)",
  bgInner:      "rgba(10, 20, 45, 0.95)",
  gold:         "#D4AF37",
  goldDim:      "rgba(212,175,55,0.65)",
  goldBorder:   "rgba(212,175,55,0.22)",
  goldBorderHi: "rgba(212,175,55,0.48)",
  goldFaint:    "rgba(212,175,55,0.06)",
  glow:         "rgba(212,175,55,0.10)",
  dim:          "rgba(255,255,255,0.35)",
  warn:         "rgba(251,191,36,0.85)",
  warnBg:       "rgba(251,191,36,0.07)",
  warnBorder:   "rgba(251,191,36,0.25)",
  blue:         "rgba(147,197,253,0.85)",
  blueBg:       "rgba(147,197,253,0.06)",
  blueBorder:   "rgba(147,197,253,0.22)",
};

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: G.goldBorder }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.goldFaint, border: `1px solid ${G.goldBorder}` }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: G.goldBorder }} />
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

function LayerLabel({ number, label, color = G.gold }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center justify-center w-5 h-5 rounded-md font-inter text-[9px] font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
        {number}
      </div>
      <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${color}30, transparent)` }} />
    </div>
  );
}

// ── Name input form ──────────────────────────────────────────────────────────
function NameInputForm({ names, onChange }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: G.goldBorder, background: G.bgInner }}>
      <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: G.goldBorder, background: G.goldFaint }}>
        <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G.gold }} />
        <p className="font-inter text-[8px] uppercase tracking-widest font-bold" style={{ color: G.goldDim }}>
          Target Names — injected into Kasam text
        </p>
      </div>
      <div className="px-4 py-3 grid grid-cols-1 gap-3">
        <div className="space-y-1">
          <label className="font-inter text-[8px] uppercase tracking-wider font-bold flex items-center gap-1.5"
            style={{ color: "rgba(134,239,172,0.85)" }}>
            <User className="w-3 h-3" />
            Male Target — فلان ابن فلانة
          </label>
          <input
            type="text"
            dir="rtl"
            value={names.male}
            onChange={e => onChange({ ...names, male: e.target.value })}
            placeholder="e.g. أحمد ابن فاطمة"
            className="w-full rounded-lg px-3 py-2 font-amiri text-base focus:outline-none"
            style={{
              background: "rgba(4,12,34,0.97)",
              border: `1px solid ${names.male ? "rgba(74,222,128,0.40)" : G.goldBorder}`,
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="font-inter text-[8px] uppercase tracking-wider font-bold flex items-center gap-1.5"
            style={{ color: "rgba(251,191,36,0.85)" }}>
            <User className="w-3 h-3" />
            Female Target — فلانة بنت فلانة
          </label>
          <input
            type="text"
            dir="rtl"
            value={names.female}
            onChange={e => onChange({ ...names, female: e.target.value })}
            placeholder="e.g. مريم بنت عائشة"
            className="w-full rounded-lg px-3 py-2 font-amiri text-base focus:outline-none"
            style={{
              background: "rgba(4,12,34,0.97)",
              border: `1px solid ${names.female ? "rgba(251,191,36,0.40)" : G.goldBorder}`,
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>
        {(names.male || names.female) && (
          <button onClick={() => onChange({ male: "", female: "" })}
            className="font-inter text-[8px] uppercase tracking-wider self-start px-2.5 py-1 rounded-lg border"
            style={{ color: "rgba(255,255,255,0.35)", borderColor: "rgba(255,255,255,0.12)" }}>
            Clear names
          </button>
        )}
      </div>
    </div>
  );
}

// ── Single Kasam entry card ──────────────────────────────────────────────────
function KasamEntry({ entry, names }) {
  const isPending = entry.status === "pending" || !entry.arabic;
  const isIncomplete = entry.status === "pdf_incomplete";

  if (isPending) {
    return (
      <div className="rounded-xl border px-4 py-4 flex items-start gap-3"
        style={{ background: G.warnBg, borderColor: G.warnBorder, borderStyle: "dashed" }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G.warn }} />
        <div>
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: G.warn }}>
            PDF SOURCE INCOMPLETE
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.30)" }}>{entry.source}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: G.goldBorder, background: G.bgInner }}>
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: G.goldBorder }}>
        <p className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.goldDim }}>Arabic — Original Text</p>
        <TokenText
          text={entry.arabic}
          names={names}
          className="font-amiri text-xl font-bold leading-loose text-right block"
          style={{ textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}
          dir="rtl"
        />
      </div>
      {entry.malayalam && (
        <div className="px-4 py-3 border-b" style={{ borderColor: G.goldBorder }}>
          <p className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.goldDim }}>Malayalam — Meaning</p>
          <TokenText
            text={entry.malayalam}
            names={names}
            className="font-amiri text-sm leading-relaxed block"
            style={{ color: "rgba(255,255,255,0.78)" }}
          />
        </div>
      )}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        {entry.source && (
          <div className="flex items-start gap-2">
            <BookOpen className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: G.goldDim }} />
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>{entry.source}</p>
          </div>
        )}
        {entry.notes && (
          <div className="flex items-start gap-2">
            <FileText className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: G.goldDim }} />
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>{entry.notes}</p>
          </div>
        )}
        {isIncomplete && (
          <div className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg"
            style={{ background: G.warnBg, border: `1px solid ${G.warnBorder}` }}>
            <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: G.warn }} />
            <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.warn }}>
              PDF SOURCE INCOMPLETE — partial text shown above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Common Kasam panel (always-visible base layer) ───────────────────────────
function CommonKasamPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: G.blueBorder,
        background: open
          ? "linear-gradient(145deg, rgba(147,197,253,0.06) 0%, rgba(147,197,253,0.02) 100%)"
          : G.bgInner,
        transition: "border-color 0.2s, background 0.2s",
      }}>
      {/* Header */}
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Layers className="w-4 h-4 flex-shrink-0" style={{ color: G.blue }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-inter text-[11px] font-bold uppercase tracking-widest" style={{ color: G.blue }}>
                {COMMON_KASAM.label}
              </p>
              <span className="font-inter text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                style={{ color: G.blue, borderColor: G.blueBorder, background: G.blueBg }}>
                BASE LAYER
              </span>
            </div>
            <p className="font-amiri text-base font-bold leading-tight mt-0.5" dir="rtl"
              style={{ color: "rgba(147,197,253,0.55)" }}>
              {COMMON_KASAM.arabic}
            </p>
            <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
              {COMMON_KASAM.malayalamLabel} · Read before every category Kasam
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0" style={{ color: open ? G.blue : G.blueBorder }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="common-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4 space-y-3">

              {/* Arabic Azimet Text — PRIMARY */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: G.blueBorder }}>
                <div className="px-4 py-2.5 border-b" style={{ borderColor: G.blueBorder, background: G.blueBg }}>
                  <p className="font-inter text-[7px] uppercase tracking-widest font-bold" style={{ color: G.blue }}>
                    Arabic — Common Azimet Base Text (PDF Page 78)
                  </p>
                </div>
                <div className="px-4 py-4">
                  <p className="font-amiri text-xl font-bold leading-loose text-right"
                    dir="rtl"
                    style={{
                      color: G.gold,
                      textRendering: "optimizeLegibility",
                      WebkitFontSmoothing: "antialiased",
                      lineHeight: 2.2,
                    }}>
                    {COMMON_KASAM.arabicText}
                  </p>
                </div>
                {/* Malayalam meaning BELOW Arabic */}
                <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: G.blueBorder }}>
                  <p className="font-inter text-[7px] uppercase tracking-widest mb-2 mt-3" style={{ color: G.goldDim }}>
                    Malayalam — Meaning
                  </p>
                  <p className="font-amiri text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                    {COMMON_KASAM.arabicTextMalayalam}
                  </p>
                </div>
              </div>

              {/* Usage note */}
              <div className="rounded-xl border px-4 py-3"
                style={{ background: G.blueBg, borderColor: G.blueBorder }}>
                <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: G.blue }}>
                  Reading Instructions
                </p>
                <p className="font-amiri text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {COMMON_KASAM.usageNote}
                </p>
              </div>

              {/* Source */}
              <div className="flex items-start gap-2">
                <BookOpen className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: G.goldDim }} />
                <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {COMMON_KASAM.source}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Selected category expanded view (Common + Category) ──────────────────────
function SelectedKasamView({ cat, onClose, names, onNamesChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: G.goldBorderHi, background: G.bg }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b flex items-center justify-between gap-3"
        style={{ borderColor: G.goldBorder, background: G.goldFaint }}>
        <div>
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: G.gold }}>
            {cat.icon} {cat.label} — Full Azimet
          </p>
          <p className="font-amiri text-base mt-0.5" dir="rtl" style={{ color: G.goldDim }}>{cat.arabic}</p>
        </div>
        <button onClick={onClose}
          className="font-inter text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-lg border flex-shrink-0"
          style={{ color: G.goldDim, borderColor: G.goldBorder, background: "transparent" }}>
          Close
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Layer 1: Common Kasam — actual Arabic text */}
        <div>
          <LayerLabel number="1" label="Common Kasam — Azimet Base (Read First)" color={G.blue} />
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: G.blueBorder }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: G.blueBorder, background: G.blueBg }}>
              <p className="font-inter text-[7px] uppercase tracking-widest font-bold" style={{ color: G.blue }}>
                Arabic — Common Azimet Base Text (PDF Page 78)
              </p>
            </div>
            <div className="px-4 py-4">
              <p className="font-amiri text-xl font-bold leading-loose text-right"
                dir="rtl"
                style={{
                  color: G.gold,
                  textRendering: "optimizeLegibility",
                  WebkitFontSmoothing: "antialiased",
                  lineHeight: 2.2,
                }}>
                {COMMON_KASAM.arabicText}
              </p>
            </div>
            <div className="px-4 pb-4 border-t" style={{ borderColor: G.blueBorder }}>
              <p className="font-inter text-[7px] uppercase tracking-widest mb-2 mt-3" style={{ color: G.goldDim }}>
                Malayalam — Meaning
              </p>
              <p className="font-amiri text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                {COMMON_KASAM.arabicTextMalayalam}
              </p>
            </div>
            <div className="px-4 pb-3 border-t" style={{ borderColor: G.blueBorder }}>
              <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5 mt-3" style={{ color: G.blue }}>
                Reading Instructions
              </p>
              <p className="font-amiri text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {COMMON_KASAM.usageNote}
              </p>
            </div>
          </div>
        </div>

        {/* Divider with arrow */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-px flex-1" style={{ background: G.goldBorder }} />
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.goldDim }}>then read</span>
            <span style={{ color: G.goldDim, fontSize: 16 }}>↓</span>
          </div>
          <div className="h-px flex-1" style={{ background: G.goldBorder }} />
        </div>

        {/* Name inputs */}
        <NameInputForm names={names} onChange={onNamesChange} />

        {/* Layer 2: Category-specific Kasam */}
        <div>
          <LayerLabel number="2" label={`${cat.label} — Category Kasam`} color={G.gold} />
          <div className="space-y-3">
            {cat.entries.map((entry) => (
              <KasamEntry key={entry.id} entry={entry} names={names} />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// ── Collapsible category selector card ───────────────────────────────────────
function KasamCategory({ cat, index, onSelect }) {
  const hasVerified = cat.entries.some(e => e.status === "verified" && e.arabic);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: G.goldBorder, background: G.bgInner }}>
      <button
        onClick={() => onSelect(cat)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-lg leading-none flex-shrink-0" style={{ color: G.goldDim }}>{cat.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-inter text-[11px] font-bold uppercase tracking-widest" style={{ color: G.gold }}>
                {cat.label}
              </p>
              <span className="font-inter text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                style={hasVerified
                  ? { color: "rgba(74,222,128,0.85)", borderColor: "rgba(74,222,128,0.30)", background: "rgba(74,222,128,0.07)" }
                  : { color: G.warn, borderColor: G.warnBorder, background: G.warnBg }}>
                {hasVerified ? "Verified" : "Pending PDF"}
              </span>
            </div>
            <p className="font-amiri text-base font-bold leading-tight mt-0.5" dir="rtl"
              style={{ color: G.goldDim }}>{cat.arabic}</p>
            <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
              {cat.malayalamLabel} · {cat.description}
            </p>
          </div>
        </div>
        <span className="font-inter text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-lg border flex-shrink-0"
          style={{ color: G.goldDim, borderColor: G.goldBorder }}>
          View ›
        </span>
      </button>
    </motion.div>
  );
}

// ── Main Section 4 component ─────────────────────────────────────────────────
export default function KasamSection() {
  const [selectedCat, setSelectedCat] = useState(null);
  const [names, setNames] = useState({ male: "", female: "" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}>

      {/* Top accent line */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />

      {/* Title */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>
            Section 4 — Kasam
          </span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-xl font-bold"
          style={{ color: G.gold, lineHeight: 1.7, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>
          القسم
        </h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>
          Kasam & Azimet Texts — PDF Source Only
        </p>
      </div>

      {/* PDF authority notice */}
      <div className="mx-4 mb-3 rounded-xl border px-4 py-2.5 flex items-start gap-2"
        style={{ background: G.warnBg, borderColor: G.warnBorder }}>
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: G.warn }} />
        <p className="font-inter text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          <span className="font-bold" style={{ color: G.warn }}>PDF AUTHORITY RULE: </span>
          All Kasam texts sourced exclusively from verified PDF manuscripts.
          No AI-generated, web-sourced, or reconstructed text permitted.
          Entries marked "Pending PDF" await verified source material.
        </p>
      </div>

      {/* Architecture note */}
      <div className="mx-4 mb-3 rounded-xl border px-4 py-2.5 flex items-start gap-2"
        style={{ background: G.blueBg, borderColor: G.blueBorder }}>
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: G.blue }} />
        <p className="font-inter text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          <span className="font-bold" style={{ color: G.blue }}>STRUCTURE: </span>
          Final Azimet = <span style={{ color: G.blue }}>Common Kasam (base layer)</span>
          {" + "}
          <span style={{ color: G.gold }}>Selected Category Kasam</span>.
          Select a category below to view the combined reading order.
        </p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 pt-2 space-y-4">

        {/* Common Kasam — always visible */}
        <CommonKasamPanel />

        <OrnamentalDivider />

        {/* Selected category view */}
        <AnimatePresence mode="wait">
          {selectedCat && (
            <SelectedKasamView
              key={selectedCat.id}
              cat={selectedCat}
              onClose={() => setSelectedCat(null)}
              names={names}
              onNamesChange={setNames}
            />
          )}
        </AnimatePresence>

        {/* Category selector */}
        <div>
          <p className="font-inter text-[8px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: G.goldDim }}>
            {selectedCat ? `Selected: ${selectedCat.label} — tap another to switch` : "Select a purpose category"}
          </p>
          <div className="space-y-2">
            {KASAM_CATEGORIES.map((cat, i) => (
              <KasamCategory
                key={cat.id}
                cat={cat}
                index={i}
                onSelect={(c) => setSelectedCat(prev => prev?.id === c.id ? null : c)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />
    </motion.div>
  );
}