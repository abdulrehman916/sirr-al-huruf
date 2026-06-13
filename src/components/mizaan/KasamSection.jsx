import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, AlertTriangle, Check, User, Eye } from "lucide-react";
import { COMMON_KASAM, KASAM_CATEGORIES } from "../../lib/kasamData";

// ── SECTION 4: KASAM — 6-Step PDF Pipeline Display ───────────────────────────
// ISOLATED from Sections 1, 2, 3. No engine calls.
// Steps:
//   1. Common Kasam (PDF Page 78) — closing invocation base
//   2. Selected Purpose Azimet
//   3. Esma-i A'van (يَا prefix per PDF rule)
//   4. Esma-i Kasem (بِحَقِّ prefix per PDF rule)
//   5. Target Name(s)
//   6. Final Kasam — all merged per PDF sentence order
// ─────────────────────────────────────────────────────────────────────────────

const G = {
  bg:           "rgba(5, 12, 28, 0.97)",
  bgInner:      "rgba(10, 20, 45, 0.95)",
  bgDeep:       "rgba(3, 8, 22, 0.99)",
  gold:         "#D4AF37",
  goldBright:   "#F5D060",
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
  purple:       "rgba(196,181,253,0.85)",
  purpleBg:     "rgba(196,181,253,0.06)",
  purpleBorder: "rgba(196,181,253,0.22)",
  rose:         "rgba(251,113,133,0.85)",
  roseBg:       "rgba(251,113,133,0.06)",
  roseBorder:   "rgba(251,113,133,0.22)",
};

const ARABIC_STYLE = {
  fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', serif",
  fontSize:   "1.3rem",
  lineHeight: 2.8,
  letterSpacing: "0.03em",
  wordSpacing:   "0.12em",
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
  fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
};

const ARABIC_FINAL_STYLE = {
  ...ARABIC_STYLE,
  fontSize:   "1.4rem",
  lineHeight: 3.2,
  color: "#F5D060",
};

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatAvanNames(names) {
  if (!Array.isArray(names) || !names.length) return "";
  return names.map(n => `يَا ${n}`).join("  ·  ");
}
function formatKasemNames(names) {
  if (!Array.isArray(names) || !names.length) return "";
  return names.map(n => `بِحَقِّ ${n}`).join("  ·  ");
}

function resolveTokens(text, names, avanNames, kasemNames) {
  if (!text) return "";
  let r = text;
  const avan  = Array.isArray(avanNames)  && avanNames.length  ? avanNames.map(n => `يَا ${n}`).join(" ")      : "";
  const kasem = Array.isArray(kasemNames) && kasemNames.length ? kasemNames.map(n => `بِحَقِّ ${n}`).join(" ") : "";
  r = r.replace(/\[ESMAİ-AVAN\]/g,  avan);
  r = r.replace(/\[ESMAİ-KASEM\]/g, kasem);
  r = r.replace(/\{maleTargetName\}/g,       names.targetMale      || "");
  r = r.replace(/\{femaleTargetName\}/g,     names.targetFemale    || "");
  r = r.replace(/\{requesterName\}/g,        names.requesterName   || "");
  r = r.replace(/\{requesterMotherName\}/g,  names.requesterMother || "");
  return r.trim();
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-2">
      <div style={{ width: 32, height: 0.5, background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: G.goldFaint, border: `1px solid ${G.goldBorder}` }} />
      <div style={{ width: 32, height: 0.5, background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

function StepBadge({ number, label, color = G.gold, active }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
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

// A collapsible step card
function StepCard({ stepNum, label, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: color + "44", background: G.bgInner }}>
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-5 h-5 rounded-md font-inter text-[9px] font-black flex-shrink-0"
            style={{ background: color + "18", border: `1px solid ${color}44`, color }}>
            {stepNum}
          </div>
          <span className="font-inter text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} style={{ color, flexShrink: 0 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: color + "22" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Arrow connector between steps
function StepArrow({ label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0.5">
      <div className="w-px h-4" style={{ background: G.goldBorder }} />
      <span className="font-inter text-[6px] uppercase tracking-widest" style={{ color: G.goldDim }}>{label}</span>
      <span style={{ color: G.goldDim, fontSize: "0.7rem", lineHeight: 1 }}>↓</span>
    </div>
  );
}

// ── Purpose selector grid ─────────────────────────────────────────────────────
function PurposeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {KASAM_CATEGORIES.map((cat, i) => {
        const isSelected = selected?.id === cat.id;
        const hasText = cat.status !== "pending" && !!cat.fullArabic;
        return (
          <motion.button key={cat.id}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(isSelected ? null : cat)}
            className="rounded-xl border px-3 py-3 text-left relative"
            style={{
              background:  isSelected ? G.goldFaint : G.bgInner,
              borderColor: isSelected ? G.goldBorderHi : G.goldBorder,
              boxShadow:   isSelected ? `0 0 16px ${G.glow}` : "none",
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
              style={{ fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', serif", fontSize: "0.95rem", lineHeight: 1.9, color: isSelected ? G.goldDim : "rgba(255,255,255,0.28)" }}>
              {cat.arabic}
            </p>
            {!hasText && (
              <span className="font-inter text-[6px] uppercase tracking-wider mt-1 block" style={{ color: G.warn }}>
                Pending PDF
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Name input fields ─────────────────────────────────────────────────────────
function NameInputBlock({ cat, names, onChange }) {
  const fields = cat.nameFields || ["targetMale"];
  const FIELD_CONFIG = {
    requesterName:   { label: "Requester — اسم الطالب",       placeholder: "أحمد ابن فاطمة",    color: G.blue },
    requesterMother: { label: "Requester Mother — أم الطالب", placeholder: "فاطمة",              color: G.blue },
    targetMale:      { label: "Male Target — فلان ابن فلانة", placeholder: "محمد ابن خديجة",    color: G.green },
    targetFemale:    { label: "Female Target — فلانة بنت فلانة", placeholder: "مريم بنت عائشة", color: G.warn },
  };
  return (
    <div className="space-y-3">
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
            <input type="text" dir="rtl" value={val}
              onChange={e => onChange({ ...names, [fieldKey]: e.target.value })}
              placeholder={cfg.placeholder}
              className="w-full rounded-lg px-3 py-2 focus:outline-none"
              style={{
                background: "rgba(4,12,34,0.97)",
                border: `1px solid ${val ? cfg.color.replace("0.85","0.40") : G.goldBorder}`,
                color: "#fff", fontSize: "1rem",
                fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', serif",
              }}
            />
          </div>
        );
      })}
      {Object.values(names).some(Boolean) && (
        <button onClick={() => onChange({ requesterName:"", requesterMother:"", targetMale:"", targetFemale:"" })}
          className="font-inter text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-lg border"
          style={{ color: "rgba(255,255,255,0.30)", borderColor: "rgba(255,255,255,0.12)" }}>
          Clear all names
        </button>
      )}
    </div>
  );
}

// ── 6-Step Pipeline display (shown after category selected) ───────────────────
function KasamPipeline({ cat, names, avanNames, kasemNames }) {
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
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.30)" }}>{cat.source}</p>
        </div>
      </div>
    );
  }

  const avanStr  = formatAvanNames(avanNames);
  const kasemStr = formatKasemNames(kasemNames);

  // Build filled name display
  const nameFields = cat.nameFields || [];
  const filledNames = nameFields
    .map(f => {
      const MAP = { targetMale: names.targetMale, targetFemale: names.targetFemale, requesterName: names.requesterName, requesterMother: names.requesterMother };
      return MAP[f];
    })
    .filter(Boolean);

  // The final fully resolved text
  const finalArabic = resolveTokens(cat.fullArabic, names, avanNames, kasemNames);
  const finalMalayalam = resolveTokens(cat.fullMalayalam || "", names, [], []);

  return (
    <div className="space-y-1.5">

      {/* ── STEP 1: Common Kasam ── */}
      <StepCard stepNum="1" label="Common Kasam — PDF Page 78" color={G.blue} defaultOpen={false}>
        <p className="text-right mt-2" dir="rtl"
          style={{ ...ARABIC_STYLE, color: "rgba(147,197,253,0.80)", fontSize: "1.15rem", lineHeight: 2.6 }}>
          {COMMON_KASAM.arabicText}
        </p>
        <p className="font-amiri text-sm mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
          {COMMON_KASAM.arabicTextMalayalam}
        </p>
        <p className="font-inter text-[7px] mt-2 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.20)" }}>
          {COMMON_KASAM.source}
        </p>
      </StepCard>

      <StepArrow label="merged with" />

      {/* ── STEP 2: Purpose Azimet ── */}
      <StepCard stepNum="2" label={`Purpose Azimet — ${cat.label}`} color={G.gold} defaultOpen={false}>
        <p className="font-amiri text-sm mt-1 mb-2" style={{ color: "rgba(134,239,172,0.75)" }}>
          {cat.malayalamLabel} — {cat.description}
        </p>
        <p className="text-right" dir="rtl"
          style={{ ...ARABIC_STYLE, color: G.goldBright, fontSize: "1.15rem", lineHeight: 2.6 }}>
          {/* Show raw text with token placeholders highlighted */}
          {cat.fullArabic.replace(/\[ESMAİ-AVAN\]/g, "[ Esma-i Aʿvan ]").replace(/\[ESMAİ-KASEM\]/g, "[ Esma-i Kasem ]")}
        </p>
        <p className="font-inter text-[7px] mt-2 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.20)" }}>
          {cat.source}
        </p>
      </StepCard>

      <StepArrow label="+ inject" />

      {/* ── STEP 3: Esma-i A'van ── */}
      <StepCard stepNum="3" label="Esma-i A'van — يَا prefix" color={G.gold} defaultOpen={false}>
        {avanStr ? (
          <p className="text-right mt-2" dir="rtl"
            style={{ ...ARABIC_STYLE, color: G.gold, fontSize: "1.1rem", lineHeight: 2.4 }}>
            {avanStr}
          </p>
        ) : (
          <p className="font-inter text-[9px] mt-2" style={{ color: G.warn }}>
            No Esma-i A'van computed yet — run Section 2 analysis first.
          </p>
        )}
        <p className="font-inter text-[7px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          PDF Rule: ശൈഖ് തംതം സമൂർ ഹിന്ദി (റഹ്) — Esma-i A'van-ന് "يَا" ചേർക്കണം
        </p>
      </StepCard>

      <StepArrow label="+ inject" />

      {/* ── STEP 4: Esma-i Kasem ── */}
      <StepCard stepNum="4" label="Esma-i Kasem — بِحَقِّ prefix" color={G.purple} defaultOpen={false}>
        {kasemStr ? (
          <p className="text-right mt-2" dir="rtl"
            style={{ ...ARABIC_STYLE, color: "rgba(196,181,253,0.90)", fontSize: "1.1rem", lineHeight: 2.4 }}>
            {kasemStr}
          </p>
        ) : (
          <p className="font-inter text-[9px] mt-2" style={{ color: G.warn }}>
            No Esma-i Kasem computed yet — run Section 3 analysis first.
          </p>
        )}
        <p className="font-inter text-[7px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          PDF Rule: Esma-i Kasem-ന് "بِحَقِّ" ചേർക്കണം
        </p>
      </StepCard>

      <StepArrow label="+ inject" />

      {/* ── STEP 5: Target Names ── */}
      <StepCard stepNum="5" label="Target Name(s)" color={G.green} defaultOpen={true}>
        {filledNames.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2" dir="rtl">
            {filledNames.map((n, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg border font-bold"
                style={{ ...ARABIC_STYLE, fontSize: "1.05rem", lineHeight: 2, color: "#86efac", borderColor: "rgba(74,222,128,0.30)", background: "rgba(74,222,128,0.06)" }}>
                {n}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-inter text-[9px] mt-2" style={{ color: G.warn }}>
            Names not entered yet — fill the input above.
          </p>
        )}
        <p className="font-inter text-[7px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          PDF-ൽ കാണിച്ചിരിക്കുന്ന ക്രമ-സ്ഥാനത്ത് മാത്രം injected
        </p>
      </StepCard>

      <StepArrow label="merge all →" />

      {/* ── STEP 6 / FINAL: Fully merged Kasam ── */}
      <div className="rounded-2xl border overflow-hidden"
        style={{
          borderColor: "rgba(212,175,55,0.55)",
          background: G.bgDeep,
          boxShadow: "0 0 60px rgba(212,175,55,0.12), inset 0 1px 0 rgba(212,175,55,0.10)",
        }}>

        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center gap-3"
          style={{ borderColor: "rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.08)" }}>
          <Eye className="w-4 h-4 flex-shrink-0" style={{ color: G.gold }} />
          <div>
            <p className="font-inter text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: G.gold }}>
              ✦ Final Kasam — Ready to Read
            </p>
            <p className="font-inter text-[8px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(212,175,55,0.50)" }}>
              القسم الكامل — {cat.arabic} — All 6 steps merged per PDF sentence order
            </p>
          </div>
        </div>

        {/* Full Arabic */}
        <div className="px-5 py-6">
          <p className="text-right leading-relaxed" dir="rtl" style={ARABIC_FINAL_STYLE}>
            {finalArabic}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px" style={{ background: "rgba(212,175,55,0.18)" }} />

        {/* Malayalam meaning */}
        <div className="px-5 py-5">
          <p className="font-inter text-[8px] uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: "rgba(212,175,55,0.50)" }}>
            Final Malayalam Meaning — അർഥം
          </p>
          <p className="font-amiri text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)", lineHeight: 2.1 }}>
            {finalMalayalam || "—"}
          </p>
        </div>

        {/* Source */}
        <div className="px-5 pb-4 flex items-center gap-2">
          <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(212,175,55,0.30)" }} />
          <p className="font-inter text-[7px]" style={{ color: "rgba(255,255,255,0.20)" }}>{cat.source}</p>
        </div>
      </div>

    </div>
  );
}

// ── Main Section 4 export ─────────────────────────────────────────────────────
export default function KasamSection({ avanNames = [], kasemNames = [] }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const [names, setNames] = useState({
    requesterName: "", requesterMother: "", targetMale: "", targetFemale: "",
  });

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
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-2"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>
            Section 4 — Kasam القسم
          </span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em]" style={{ color: G.goldDim }}>
          PDF Source Only — 6-Step Pipeline
        </p>
      </div>

      <div className="px-4 pb-6 space-y-4">

        {/* Purpose selection */}
        <div>
          <StepBadge number="A" label="Select Purpose Category" color={G.gold} active />
          <PurposeSelector selected={selectedCat} onSelect={setSelectedCat} />
        </div>

        {/* Name input — only shown when a category is selected and has name fields */}
        <AnimatePresence>
          {selectedCat && selectedCat.nameFields?.length > 0 && (
            <motion.div key="names"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <StepBadge number="B" label="Enter Names" color={G.green} active />
              <div className="rounded-xl border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
                <NameInputBlock cat={selectedCat} names={names} onChange={setNames} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <OrnamentalDivider />

        {/* 6-step pipeline */}
        <AnimatePresence>
          {selectedCat && (
            <motion.div key={selectedCat.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <StepBadge number="C" label="Kasam Pipeline — Steps 1–6" color={G.gold} active />
              <KasamPipeline
                cat={selectedCat}
                names={names}
                avanNames={avanNames}
                kasemNames={kasemNames}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedCat && (
          <p className="font-inter text-[9px] text-center uppercase tracking-widest py-4"
            style={{ color: "rgba(255,255,255,0.20)" }}>
            Select a purpose above to begin
          </p>
        )}

      </div>

      {/* Bottom accent */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />
    </motion.div>
  );
}