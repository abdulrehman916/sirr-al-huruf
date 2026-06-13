import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, AlertTriangle, Layers, User, Check } from "lucide-react";
import { COMMON_KASAM, KASAM_CATEGORIES } from "../../lib/kasamData";

// ── SECTION 4: KASAM (القسم) ──────────────────────────────────────────────────
// COMPLETELY ISOLATED from Sections 1, 2, 3. No calculations. No engine calls.
// Flow: 1) Common Kasam → 2) Purpose Selection → 3) Name Input → 4) Final Assembled Kasam
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
  green:        "rgba(74,222,128,0.85)",
  greenBg:      "rgba(74,222,128,0.07)",
  greenBorder:  "rgba(74,222,128,0.25)",
};

// ── Shared Arabic text style for Section 4 Kasam ─────────────────────────────
// Naskh-style: Scheherazade New → Noto Naskh Arabic → Amiri fallback
// Prioritises harakat clarity, connected letters, and comfortable line height
const ARABIC_TEXT_STYLE = {
  fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', serif",
  fontSize:   "1.35rem",
  lineHeight: 2.6,
  letterSpacing: "0.03em",
  wordSpacing:   "0.12em",
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
};

const ARABIC_NAME_STYLE = {
  ...ARABIC_TEXT_STYLE,
  fontSize:   "1.15rem",
  lineHeight: 2.4,
};

// ── Token substitution engine ─────────────────────────────────────────────────
// Tokens: {maleTargetName}, {femaleTargetName}, {requesterName}, {requesterMotherName}
function substituteNames(text, names) {
  if (!text) return text;
  return text
    .replace(/\{maleTargetName\}/g,       names.targetMale   || "{فلان ابن فلانة}")
    .replace(/\{femaleTargetName\}/g,     names.targetFemale || "{فلانة بنت فلانة}")
    .replace(/\{requesterName\}/g,        names.requesterName || "{اسم الطالب}")
    .replace(/\{requesterMotherName\}/g,  names.requesterMother || "{أم الطالب}");
}

// ── PDF RULE: prefix formatters ──────────────────────────────────────────────
// "Esma-i A'van'ın önüne Yâ nidası, Esma-i Kasem'in önüne Bi Hakkı kelimesini ekleriz."
// Every individual name must carry its own prefix.
function formatAvanNames(names) {
  if (!Array.isArray(names) || !names.length) return null;
  return names.map(n => `يَا ${n}`).join("  ·  ");
}
function formatKasemNames(names) {
  if (!Array.isArray(names) || !names.length) return null;
  return names.map(n => `بِحَقِّ ${n}`).join("  ·  ");
}

// ── Inject Esma-i A'van and Esma-i Kasem into the common kasam text ──────────
// Replaces [ESMAİ-AVAN] and [ESMAİ-KASEM] with prefixed name strings per PDF rule
function injectEsmaNames(text, avanNames, kasemNames) {
  if (!text) return text;
  const avanStr  = formatAvanNames(avanNames);
  const kasemStr = formatKasemNames(kasemNames);
  let result = text;
  if (avanStr)  result = result.replace(/\[ESMAİ-AVAN\]/g,  avanStr);
  if (kasemStr) result = result.replace(/\[ESMAİ-KASEM\]/g, kasemStr);
  return result;
}

// Renders text with name tokens highlighted (filled=green, unfilled=amber)
function TokenText({ text, names, className, style, dir }) {
  const TOKEN_RE = /(\{maleTargetName\}|\{femaleTargetName\}|\{requesterName\}|\{requesterMotherName\})/g;
  const TOKEN_MAP = {
    "{maleTargetName}":      { key: "targetMale",      fallback: "فلان ابن فلانة" },
    "{femaleTargetName}":    { key: "targetFemale",    fallback: "فلانة بنت فلانة" },
    "{requesterName}":       { key: "requesterName",   fallback: "اسم الطالب" },
    "{requesterMotherName}": { key: "requesterMother", fallback: "أم الطالب" },
  };
  const parts = [];
  let last = 0;
  let match;
  const regex = new RegExp(TOKEN_RE.source, "g");
  while ((match = regex.exec(text || "")) !== null) {
    if (match.index > last) parts.push({ type: "text", value: text.slice(last, match.index) });
    const info  = TOKEN_MAP[match[1]];
    const filled = info ? names[info.key] : "";
    parts.push({ type: "token", value: filled || info?.fallback || match[1], filled: !!filled });
    last = match.index + match[0].length;
  }
  if (last < (text || "").length) parts.push({ type: "text", value: text.slice(last) });

  return (
    <span className={className} style={style} dir={dir}>
      {parts.map((p, i) =>
        p.type === "token" ? (
          <span key={i} style={{
            color:        p.filled ? "#86efac" : "#fbbf24",
            background:   p.filled ? "rgba(74,222,128,0.10)" : "rgba(251,191,36,0.10)",
            border:       `1px solid ${p.filled ? "rgba(74,222,128,0.25)" : "rgba(251,191,36,0.25)"}`,
            borderRadius: "0.25rem",
            padding:      "0 0.25rem",
            fontStyle:    p.filled ? "normal" : "italic",
          }}>{p.value}</span>
        ) : <span key={i}>{p.value}</span>
      )}
    </span>
  );
}

// ── Shared UI primitives ──────────────────────────────────────────────────────
function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.goldFaint, border: `1px solid ${G.goldBorder}` }} />
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

function StepBadge({ number, label, color = G.gold, active }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center justify-center w-6 h-6 rounded-lg font-inter text-[10px] font-black flex-shrink-0"
        style={{ background: (active ? color : G.goldBorder) + "22", border: `1px solid ${active ? color : G.goldBorder}55`, color: active ? color : G.goldBorder }}>
        {number}
      </div>
      <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: active ? color : G.goldBorder }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${active ? color : G.goldBorder}40, transparent)` }} />
    </div>
  );
}

// ── STEP 1: Esma reference panel — shows computed A'van & Kasem names ─────────
function EsmaReferenceBlock({ avanNames, kasemNames }) {
  const [open, setOpen] = useState(false);
  const hasEsma = avanNames?.length > 0 || kasemNames?.length > 0;
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ borderColor: G.blueBorder, background: G.bgInner }}>
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}>
        <div className="flex items-center gap-3 min-w-0">
          <Layers className="w-4 h-4 flex-shrink-0" style={{ color: G.blue }} />
          <div>
            <p className="font-inter text-[11px] font-bold uppercase tracking-widest" style={{ color: G.blue }}>
              Esma-i A'van & Esma-i Kasem — Reference
            </p>
            <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
              {hasEsma ? `${avanNames?.length || 0} A'van · ${kasemNames?.length || 0} Kasem names — injected into Final Kasam` : "No Esma computed yet — run analysis first"}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ color: G.blue, flexShrink: 0 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="esma-body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4 space-y-3">
              {avanNames?.length > 0 && (
                <div className="rounded-lg border px-3 py-2" style={{ background: "rgba(212,175,55,0.05)", borderColor: G.goldBorder }}>
                  <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: G.goldDim }}>
                    Esma-i A'van — أسماء الأعوان (يَا prefix)
                  </p>
                  <p className="font-bold text-right" dir="rtl"
                    style={{ ...ARABIC_NAME_STYLE, color: G.gold }}>
                    {formatAvanNames(avanNames)}
                  </p>
                </div>
              )}
              {kasemNames?.length > 0 && (
                <div className="rounded-lg border px-3 py-2" style={{ background: "rgba(147,197,253,0.05)", borderColor: G.blueBorder }}>
                  <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: G.blue }}>
                    Esma-i Kasem — أسماء القسم (بِحَقِّ prefix)
                  </p>
                  <p className="font-bold text-right" dir="rtl"
                    style={{ ...ARABIC_NAME_STYLE, color: "rgba(147,197,253,0.90)" }}>
                    {formatKasemNames(kasemNames)}
                  </p>
                </div>
              )}
              <div className="rounded-xl border px-4 py-2.5" style={{ background: G.blueBg, borderColor: G.blueBorder }}>
                <p className="font-amiri text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                  {COMMON_KASAM.usageNote}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── STEP 2: Purpose selector ──────────────────────────────────────────────────
function PurposeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {KASAM_CATEGORIES.map((cat, i) => {
        const isSelected = selected?.id === cat.id;
        const hasVerified = cat.status !== "pending" && !!cat.fullArabic;
        return (
          <motion.button key={cat.id}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(isSelected ? null : cat)}
            className="rounded-xl border px-3 py-3 text-left relative"
            style={{
              background:   isSelected ? G.goldFaint : G.bgInner,
              borderColor:  isSelected ? G.goldBorderHi : G.goldBorder,
              boxShadow:    isSelected ? `0 0 16px ${G.glow}` : "none",
              WebkitTapHighlightColor: "transparent",
            }}>
            {isSelected && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: G.goldFaint, border: `1px solid ${G.goldBorderHi}` }}>
                <Check className="w-2.5 h-2.5" style={{ color: G.gold }} />
              </div>
            )}
            <span className="text-base leading-none block mb-1">{cat.icon}</span>
            <p className="font-inter text-[9px] font-bold uppercase tracking-wider leading-tight"
              style={{ color: isSelected ? G.gold : "rgba(255,255,255,0.70)" }}>
              {cat.label}
            </p>
            <p className="font-amiri text-sm mt-0.5 leading-snug"
              style={{ color: isSelected ? "#86efac" : "rgba(134,239,172,0.55)" }}>
              {cat.malayalamLabel}
            </p>
            <p className="font-bold mt-0.5" dir="rtl"
              style={{ fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', serif", fontSize: "1rem", lineHeight: 1.9, color: isSelected ? G.goldDim : "rgba(255,255,255,0.30)" }}>
              {cat.arabic}
            </p>
            {!hasVerified && (
              <span className="font-inter text-[6px] uppercase tracking-wider mt-1 block"
                style={{ color: G.warn }}>Pending PDF</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── STEP 3: Name input fields ─────────────────────────────────────────────────
// nameFields config per category defined in kasamData; falls back to all fields
function NameInputBlock({ cat, names, onChange }) {
  const fields = cat.nameFields || ["targetMale", "targetFemale"];

  const FIELD_CONFIG = {
    requesterName:   { label: "Requester Name — اسم الطالب",        placeholder: "e.g. أحمد ابن فاطمة",    color: G.blue },
    requesterMother: { label: "Requester's Mother — أم الطالب",     placeholder: "e.g. فاطمة",              color: G.blue },
    targetMale:      { label: "Male Target — فلان ابن فلانة",       placeholder: "e.g. محمد ابن خديجة",    color: G.green },
    targetFemale:    { label: "Female Target — فلانة بنت فلانة",   placeholder: "e.g. مريم بنت عائشة",    color: "rgba(251,191,36,0.85)" },
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: G.goldBorder, background: G.bgInner }}>
      <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: G.goldBorder, background: G.goldFaint }}>
        <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G.gold }} />
        <p className="font-inter text-[8px] uppercase tracking-widest font-bold" style={{ color: G.goldDim }}>
          Name Input — Injected into Kasam Text
        </p>
      </div>
      <div className="px-4 py-3 space-y-3">
        {fields.map(fieldKey => {
          const cfg = FIELD_CONFIG[fieldKey];
          if (!cfg) return null;
          const val = names[fieldKey] || "";
          return (
            <div key={fieldKey} className="space-y-1">
              <label className="font-inter text-[8px] uppercase tracking-wider font-bold flex items-center gap-1.5"
                style={{ color: cfg.color }}>
                <User className="w-3 h-3" />
                {cfg.label}
              </label>
              <input
                type="text" dir="rtl"
                value={val}
                onChange={e => onChange({ ...names, [fieldKey]: e.target.value })}
                placeholder={cfg.placeholder}
                className="w-full rounded-lg px-3 py-2 font-amiri text-base focus:outline-none"
                style={{
                  background: "rgba(4,12,34,0.97)",
                  border: `1px solid ${val ? cfg.color.replace("0.85", "0.40") : G.goldBorder}`,
                  color: "#fff", fontSize: "1rem",
                }}
              />
            </div>
          );
        })}
        {Object.values(names).some(Boolean) && (
          <button onClick={() => onChange({ requesterName: "", requesterMother: "", targetMale: "", targetFemale: "" })}
            className="font-inter text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-lg border"
            style={{ color: "rgba(255,255,255,0.30)", borderColor: "rgba(255,255,255,0.12)" }}>
            Clear all names
          </button>
        )}
      </div>
    </div>
  );
}

// ── Fully resolve all tokens/placeholders in a text string ──────────────────
// Replaces [ESMAİ-AVAN], [ESMAİ-KASEM], and name tokens with real values.
// Returns a plain string with NO placeholders remaining.
function fullyResolve(text, names, avanNames, kasemNames) {
  if (!text) return "";
  let result = text;

  // 1. Inject Esma-i A'van
  const avanStr = Array.isArray(avanNames) && avanNames.length
    ? avanNames.map(n => `يَا ${n}`).join(" ") : "";
  if (avanStr) result = result.replace(/\[ESMAİ-AVAN\]/g, avanStr);
  else result = result.replace(/\[ESMAİ-AVAN\]/g, "");

  // 2. Inject Esma-i Kasem
  const kasemStr = Array.isArray(kasemNames) && kasemNames.length
    ? kasemNames.map(n => `بِحَقِّ ${n}`).join(" ") : "";
  if (kasemStr) result = result.replace(/\[ESMAİ-KASEM\]/g, kasemStr);
  else result = result.replace(/\[ESMAİ-KASEM\]/g, "");

  // 3. Name tokens
  result = result
    .replace(/\{maleTargetName\}/g,      names.targetMale      || "")
    .replace(/\{femaleTargetName\}/g,    names.targetFemale    || "")
    .replace(/\{requesterName\}/g,       names.requesterName   || "")
    .replace(/\{requesterMotherName\}/g, names.requesterMother || "");

  return result.trim();
}

// ── STEP 4: Final Kasam — Ready to Read ──────────────────────────────────────
// Each category has a single fullArabic field — one continuous integrated Kasam per PDF.
// Tokens [ESMAİ-AVAN], [ESMAİ-KASEM], {names} are resolved here at render time.
function FinalKasamBlock({ cat, names, avanNames, kasemNames }) {
  const isPending = cat.status === "pending" || !cat.fullArabic;

  if (isPending) {
    return (
      <div className="rounded-xl border px-4 py-4 flex items-start gap-3"
        style={{ background: G.warnBg, borderColor: G.warnBorder, borderStyle: "dashed" }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G.warn }} />
        <div>
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: G.warn }}>
            PDF SOURCE INCOMPLETE
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.30)" }}>
            {cat.source}
          </p>
        </div>
      </div>
    );
  }

  const fullArabic  = fullyResolve(cat.fullArabic,   names, avanNames, kasemNames);
  const fullMalayalam = fullyResolve(cat.fullMalayalam || "", names, [], []);

  const FINAL_ARABIC_STYLE = {
    fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', serif",
    fontSize:   "1.4rem",
    lineHeight: 3,
    letterSpacing: "0.04em",
    wordSpacing:   "0.18em",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
    color: "#F5D060",
  };

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: "rgba(212,175,55,0.55)",
        background: "rgba(4, 10, 28, 0.99)",
        boxShadow: "0 0 60px rgba(212,175,55,0.12), inset 0 1px 0 rgba(212,175,55,0.10)",
      }}>

      {/* Header banner */}
      <div className="px-5 py-4 border-b"
        style={{ borderColor: "rgba(212,175,55,0.30)", background: "rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="font-inter text-[11px] font-black uppercase tracking-[0.3em]"
              style={{ color: "#D4AF37" }}>
              ✦ Final Kasam — Ready to Read
            </p>
            <p className="font-inter text-[8px] uppercase tracking-widest"
              style={{ color: "rgba(212,175,55,0.55)" }}>
              القسم الكامل — {cat.arabic}
            </p>
            <p className="font-amiri text-xs mt-0.5" style={{ color: "rgba(134,239,172,0.70)" }}>
              {cat.malayalamLabel} — PDF Authority Only
            </p>
          </div>
        </div>
      </div>

      {/* Full Arabic text — one continuous block */}
      <div className="px-5 py-6">
        <p className="text-right leading-relaxed" dir="rtl" style={FINAL_ARABIC_STYLE}>
          {fullArabic}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: "rgba(212,175,55,0.20)" }} />

      {/* Final Malayalam Meaning */}
      <div className="px-5 py-5">
        <p className="font-inter text-[8px] uppercase tracking-[0.25em] font-bold mb-3"
          style={{ color: "rgba(212,175,55,0.55)" }}>
          Final Malayalam Meaning — അർഥം
        </p>
        <p className="font-amiri text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.78)", lineHeight: 2 }}>
          {fullMalayalam || "—"}
        </p>
      </div>

      {/* Source note */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(212,175,55,0.35)" }} />
        <p className="font-inter text-[7px]" style={{ color: "rgba(255,255,255,0.22)" }}>
          {cat.source}
        </p>
      </div>
    </div>
  );
}

// ── Main Section 4 component ──────────────────────────────────────────────────
export default function KasamSection({ avanNames = [], kasemNames = [] }) {
  const [selectedCat, setSelectedCat]   = useState(null);
  const [names, setNames]               = useState({
    requesterName:   "",
    requesterMother: "",
    targetMale:      "",
    targetFemale:    "",
  });

  const showFinal = !!selectedCat;

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

      {/* Top accent */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />

      {/* Title */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>
            Section 4 — Kasam القسم
          </span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>
          Azimet Texts — PDF Source Only
        </p>
      </div>

      <div className="px-4 pb-6 space-y-5">

        {/* ── STEP 1: Esma reference — shows computed names injected into Final Kasam ── */}
        <div>
          <StepBadge number="1" label="Esma-i A'van & Kasem Reference" color={G.blue} active />
          <EsmaReferenceBlock avanNames={avanNames} kasemNames={kasemNames} />
        </div>

        <OrnamentalDivider />

        {/* ── STEP 2: Purpose Selection ── */}
        <div>
          <StepBadge number="2" label="Select Purpose" color={G.gold} active />
          <PurposeSelector selected={selectedCat} onSelect={setSelectedCat} />
        </div>

        {/* ── STEP 3: Name Input (only after selection) ── */}
        <AnimatePresence>
          {selectedCat && (
            <motion.div key="name-input"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <StepBadge number="3" label="Enter Names" color={G.gold} active />
              <NameInputBlock cat={selectedCat} names={names} onChange={setNames} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP 4: Final Assembled Kasam ── */}
        <AnimatePresence>
          {showFinal && (
            <motion.div key={selectedCat.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <StepBadge number="4" label="Final Kasam — Ready to Read" color={G.gold} active />
              <FinalKasamBlock cat={selectedCat} names={names} avanNames={avanNames} kasemNames={kasemNames} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom accent */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />
    </motion.div>
  );
}