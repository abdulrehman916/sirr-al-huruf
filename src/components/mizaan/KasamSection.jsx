import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, AlertTriangle, Check, User, Eye } from "lucide-react";
import { COMMON_KASAM, KASAM_CATEGORIES } from "../../lib/kasamData";

// ── SECTION 4: KASAM — PDF-accurate assembly ──────────────────────────────────
// ISOLATED from Sections 1, 2, 3. No engine calls.
//
// FINAL KASAM ASSEMBLY ORDER (per PDF):
//   1. Common Kasam opening  (أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ)
//   2. Esma-i A'van          [ESMAİ-AVAN] → يَا Name each
//   3. Purpose phrase        [PURPOSE] → category-specific text with resolved names
//   4. Esma-i Kasem          [ESMAİ-KASEM] → بِحَقِّ Name each
//   5. Common Kasam closing  (بِالْوَاحِدِ الأَحَدِ ... فَسُبْحَانَ ...)
//
// The Common Kasam NEVER disappears. The purpose phrase is NEVER the opener.
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
  warn:         "rgba(251,191,36,0.85)",
  warnBg:       "rgba(251,191,36,0.07)",
  warnBorder:   "rgba(251,191,36,0.25)",
  blue:         "rgba(147,197,253,0.85)",
  blueBg:       "rgba(147,197,253,0.06)",
  blueBorder:   "rgba(147,197,253,0.22)",
  green:        "rgba(74,222,128,0.85)",
  purple:       "rgba(196,181,253,0.85)",
  purpleBorder: "rgba(196,181,253,0.22)",
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
  fontSize: "1.4rem",
  lineHeight: 3.2,
  color: "#F5D060",
};

// ── Assembly logic ────────────────────────────────────────────────────────────
// Resolves name and Esma tokens into the Azimet text, then appends Common Kasam closure.
//
// FINAL = [Azimet with A'van + Kasem + Names injected] + [Common Kasam closure]
//
function resolveNames(text, names) {
  if (!text) return "";
  return text
    .replace(/\{maleTargetName\}/g,      names.targetMale      || "فلان")
    .replace(/\{femaleTargetName\}/g,    names.targetFemale    || "فلانة")
    .replace(/\{requesterName\}/g,       names.requesterName   || "فلان")
    .replace(/\{requesterMotherName\}/g, names.requesterMother || "فلانة");
}

function assembleFinalKasam(cat, names, avanNames, kasemNames) {
  const avanStr  = Array.isArray(avanNames)  && avanNames.length
    ? avanNames.map(n => `يَا ${n}`).join(" ")      : "";
  const kasemStr = Array.isArray(kasemNames) && kasemNames.length
    ? kasemNames.map(n => `بِحَقِّ ${n}`).join(" ") : "";

  // Step 1: inject A'van and Kasem tokens into the Azimet
  let azimet = (cat.purposeArabic || "")
    .replace(/\[ESMAİ-AVAN\]/g,  avanStr)
    .replace(/\[ESMAİ-KASEM\]/g, kasemStr);

  // Step 2: resolve name tokens
  azimet = resolveNames(azimet, names);

  // Step 3: append Common Kasam closure
  return (azimet + " " + COMMON_KASAM.closure).trim();
}

function assembleFinalMalayalam(cat, names, avanNames, kasemNames) {
  const avanStr  = Array.isArray(avanNames)  && avanNames.length
    ? avanNames.map(n => `يَا ${n}`).join(" ")       : "(Esma-i A'van)";
  const kasemStr = Array.isArray(kasemNames) && kasemNames.length
    ? kasemNames.map(n => `بِحَقِّ ${n}`).join(" ")  : "(Esma-i Kasem)";

  let mlText = (cat.purposeMalayalam || "")
    .replace(/\[Esma-i A'van\]/g,  avanStr)
    .replace(/\[Esma-i Kasem\]/g,  kasemStr);

  mlText = resolveNames(mlText, names);

  return mlText + " — " + COMMON_KASAM.closureMalayalam;
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

// Collapsible step card
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

function StepArrow() {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0.5">
      <div className="w-px h-3" style={{ background: G.goldBorder }} />
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
        const hasText = cat.status !== "pending" && !!cat.purposeArabic;
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
              style={{ fontFamily: "'Scheherazade New','Noto Naskh Arabic','Amiri',serif", fontSize: "0.95rem", lineHeight: 1.9, color: isSelected ? G.goldDim : "rgba(255,255,255,0.28)" }}>
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

// ── Name input ────────────────────────────────────────────────────────────────
function NameInputBlock({ cat, names, onChange }) {
  const fields = cat.nameFields || [];
  const FIELD_CONFIG = {
    requesterName:   { label: "Requester — اسم الطالب",          placeholder: "أحمد ابن فاطمة",   color: G.blue },
    requesterMother: { label: "Requester Mother — أم الطالب",    placeholder: "فاطمة",             color: G.blue },
    targetMale:      { label: "Male Target — فلان ابن فلانة",    placeholder: "محمد ابن خديجة",   color: G.green },
    targetFemale:    { label: "Female Target — فلانة بنت فلانة", placeholder: "مريم بنت عائشة",   color: G.warn },
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
                fontFamily: "'Scheherazade New','Noto Naskh Arabic','Amiri',serif",
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

// ── Pipeline breakdown + Final Kasam ─────────────────────────────────────────
function KasamPipeline({ cat, names, avanNames, kasemNames }) {
  if (cat.status === "pending" || !cat.purposeArabic) {
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

  const avanStr  = Array.isArray(avanNames)  && avanNames.length  ? avanNames.map(n  => `يَا ${n}`).join("  ·  ")       : null;
  const kasemStr = Array.isArray(kasemNames) && kasemNames.length ? kasemNames.map(n => `بِحَقِّ ${n}`).join("  ·  ")  : null;
  const purposeResolved = resolveNames(cat.purposeArabic, names);

  const finalArabic    = assembleFinalKasam(cat, names, avanNames, kasemNames);
  const finalMalayalam = assembleFinalMalayalam(cat, names, avanNames, kasemNames);

  return (
    <div className="space-y-1.5">

      {/* ── Step 1: Common Kasam opening ── */}
      <StepCard stepNum="1" label="Common Kasam — Opening (PDF Page 78)" color={G.blue} defaultOpen={false}>
        <p className="text-right mt-2" dir="rtl"
          style={{ ...ARABIC_STYLE, color: "rgba(147,197,253,0.80)", fontSize: "1.1rem", lineHeight: 2.5 }}>
          أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ
        </p>
        <p className="font-amiri text-sm mt-2" style={{ color: "rgba(255,255,255,0.50)", lineHeight: 1.9 }}>
          {COMMON_KASAM.openingMalayalam || "ഹേ ആദരണീയ ആത്മാക്കളേ — നിങ്ങളോട് ആണ ചെയ്യുന്നു:"}
        </p>
      </StepCard>

      <StepArrow />

      {/* ── Step 2: Esma-i A'van ── */}
      <StepCard stepNum="2" label="Esma-i A'van — يَا prefix (PDF Rule)" color={G.gold} defaultOpen={false}>
        {avanStr ? (
          <p className="text-right mt-2" dir="rtl"
            style={{ ...ARABIC_STYLE, color: G.goldBright, fontSize: "1.1rem", lineHeight: 2.5 }}>
            {avanStr}
          </p>
        ) : (
          <p className="font-inter text-[9px] mt-2 italic" style={{ color: G.warn }}>
            No Esma-i A'van yet — run Sections 1 & 2 first.
          </p>
        )}
      </StepCard>

      <StepArrow />

      {/* ── Step 3: Purpose phrase ── */}
      <StepCard stepNum="3" label={`Purpose — ${cat.label} (${cat.source})`} color={G.green} defaultOpen={false}>
        <p className="font-amiri text-xs mt-1 mb-2" style={{ color: "rgba(134,239,172,0.70)" }}>
          {cat.malayalamLabel} — {cat.description}
        </p>
        <p className="text-right" dir="rtl"
          style={{ ...ARABIC_STYLE, color: "#86efac", fontSize: "1.1rem", lineHeight: 2.5 }}>
          {purposeResolved || cat.purposeArabic}
        </p>
      </StepCard>

      <StepArrow />

      {/* ── Step 4: Esma-i Kasem ── */}
      <StepCard stepNum="4" label="Esma-i Kasem — بِحَقِّ prefix (PDF Rule)" color={G.purple} defaultOpen={false}>
        {kasemStr ? (
          <p className="text-right mt-2" dir="rtl"
            style={{ ...ARABIC_STYLE, color: "rgba(196,181,253,0.90)", fontSize: "1.1rem", lineHeight: 2.5 }}>
            {kasemStr}
          </p>
        ) : (
          <p className="font-inter text-[9px] mt-2 italic" style={{ color: G.warn }}>
            No Esma-i Kasem yet — run Section 3 first.
          </p>
        )}
      </StepCard>

      <StepArrow />

      {/* ── Step 5: Common Kasam closing ── */}
      <StepCard stepNum="5" label="Common Kasam — Closing (PDF Page 78)" color={G.blue} defaultOpen={false}>
        <p className="text-right mt-2" dir="rtl"
          style={{ ...ARABIC_STYLE, color: "rgba(147,197,253,0.80)", fontSize: "1.1rem", lineHeight: 2.5 }}>
          بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ اللهِ الْعَزِيزِ الْحَكِيمِ الَّذِي يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ
        </p>
        <p className="font-amiri text-sm mt-2" style={{ color: "rgba(255,255,255,0.50)", lineHeight: 1.9 }}>
          {COMMON_KASAM.closingMalayalam}
        </p>
        <p className="font-amiri text-sm mt-1" style={{ color: "rgba(255,255,255,0.30)", lineHeight: 1.9 }}>
          {COMMON_KASAM.closing}
        </p>
      </StepCard>

      <StepArrow />

      {/* ── Final: Fully merged ── */}
      <div className="rounded-2xl border overflow-hidden"
        style={{
          borderColor: "rgba(212,175,55,0.55)",
          background: G.bgDeep,
          boxShadow: "0 0 60px rgba(212,175,55,0.12), inset 0 1px 0 rgba(212,175,55,0.10)",
        }}>

        <div className="px-5 py-4 border-b flex items-center gap-3"
          style={{ borderColor: "rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.08)" }}>
          <Eye className="w-4 h-4 flex-shrink-0" style={{ color: G.gold }} />
          <div>
            <p className="font-inter text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: G.gold }}>
              ✦ Final Kasam — Ready to Read
            </p>
            <p className="font-inter text-[8px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(212,175,55,0.50)" }}>
              القسم الكامل — Steps 1–5 merged in PDF sentence order
            </p>
          </div>
        </div>

        <div className="px-5 py-6">
          <p className="text-right leading-relaxed" dir="rtl" style={ARABIC_FINAL_STYLE}>
            {finalArabic}
          </p>
        </div>

        <div className="mx-5 h-px" style={{ background: "rgba(212,175,55,0.18)" }} />

        <div className="px-5 py-5">
          <p className="font-inter text-[8px] uppercase tracking-[0.25em] font-bold mb-3"
            style={{ color: "rgba(212,175,55,0.50)" }}>
            Final Malayalam Meaning — അർഥം
          </p>
          <p className="font-amiri text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)", lineHeight: 2.1 }}>
            {finalMalayalam}
          </p>
        </div>

        <div className="px-5 pb-4 flex items-center gap-2">
          <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(212,175,55,0.30)" }} />
          <p className="font-inter text-[7px]" style={{ color: "rgba(255,255,255,0.20)" }}>
            {COMMON_KASAM.source} · {cat.source}
          </p>
        </div>
      </div>

    </div>
  );
}

// ── Final Kasam output block — always rendered at bottom ─────────────────────
function FinalKasamOutput({ cat, names, avanNames, kasemNames }) {
  const hasCat    = !!cat && cat.status !== "pending" && !!cat.purposeArabic;
  const finalArabic    = hasCat ? assembleFinalKasam(cat, names, avanNames, kasemNames)    : null;
  const finalMalayalam = hasCat ? assembleFinalMalayalam(cat, names, avanNames, kasemNames) : null;

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: hasCat ? "rgba(212,175,55,0.65)" : "rgba(212,175,55,0.22)",
        background:  G.bgDeep,
        boxShadow:   hasCat
          ? "0 0 80px rgba(212,175,55,0.18), inset 0 1px 0 rgba(212,175,55,0.12)"
          : "none",
        transition:  "border-color 0.3s, box-shadow 0.3s",
      }}>

      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center gap-3"
        style={{
          borderColor: hasCat ? "rgba(212,175,55,0.30)" : "rgba(212,175,55,0.12)",
          background:  hasCat ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.04)",
        }}>
        <Eye className="w-4 h-4 flex-shrink-0" style={{ color: hasCat ? G.gold : "rgba(212,175,55,0.30)" }} />
        <div>
          <p className="font-inter text-[11px] font-black uppercase tracking-[0.3em]"
            style={{ color: hasCat ? G.gold : "rgba(212,175,55,0.30)" }}>
            ✦ Final Kasam — القسم الكامل
          </p>
          <p className="font-inter text-[8px] uppercase tracking-widest mt-0.5"
            style={{ color: "rgba(212,175,55,0.35)" }}>
            {hasCat ? `${cat.label} · PDF order: Azimet (A'van + Purpose + Kasem) + Common Kasam Closure` : "Select a purpose above to generate the Final Kasam"}
          </p>
        </div>
      </div>

      {/* Arabic text */}
      <div className="px-5 py-6 min-h-[80px] flex items-center justify-center">
        {hasCat ? (
          <p className="text-right w-full leading-relaxed" dir="rtl" style={ARABIC_FINAL_STYLE}>
            {finalArabic}
          </p>
        ) : (
          <p className="font-inter text-[9px] uppercase tracking-widest text-center"
            style={{ color: "rgba(255,255,255,0.15)" }}>
            القسم سيظهر هنا بعد اختيار الغرض
          </p>
        )}
      </div>

      {/* Malayalam meaning */}
      {hasCat && finalMalayalam && (
        <>
          <div className="mx-5 h-px" style={{ background: "rgba(212,175,55,0.18)" }} />
          <div className="px-5 py-5">
            <p className="font-inter text-[8px] uppercase tracking-[0.25em] font-bold mb-3"
              style={{ color: "rgba(212,175,55,0.50)" }}>
              Final Malayalam Meaning — അർഥം
            </p>
            <p className="font-amiri text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.75)", lineHeight: 2.1 }}>
              {finalMalayalam}
            </p>
          </div>
        </>
      )}

      {/* Source footnote */}
      {hasCat && (
        <div className="px-5 pb-4 flex items-center gap-2">
          <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(212,175,55,0.30)" }} />
          <p className="font-inter text-[7px]" style={{ color: "rgba(255,255,255,0.20)" }}>
            {COMMON_KASAM.source} · {cat.source}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function KasamSection({ avanNames = [], kasemNames = [] }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const [names, setNames] = useState({
    requesterName: "", requesterMother: "", targetMale: "", targetFemale: "",
  });

  const hasAvan  = Array.isArray(avanNames)  && avanNames.length  > 0;
  const hasKasem = Array.isArray(kasemNames) && kasemNames.length > 0;

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

      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />

      {/* Section title */}
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
          Esma-i A'van · Purpose · Esma-i Kasem · Common Kasam Closure — PDF Page 78
        </p>
      </div>

      <div className="px-4 pb-6 space-y-5">

        {/* ── 1. COMMON KASAM — full live structure (PDF Page 78) ── */}
        <div>
          <StepBadge number="1" label="Common Kasam — PDF Page 78" color={G.blue} active />
          <div className="rounded-xl border overflow-hidden"
            style={{ background: G.bgInner, borderColor: "rgba(147,197,253,0.25)" }}>

            {/* يا + Esma-i A'van */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(147,197,253,0.15)" }}>
              <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,175,55,0.50)" }}>
                Esma-i A'van — يَا prefix · Section 2
              </p>
              {hasAvan ? (
                <p className="text-right" dir="rtl"
                  style={{ ...ARABIC_STYLE, color: G.goldBright, fontSize: "1.1rem", lineHeight: 2.6 }}>
                  {avanNames.map(n => `يَا ${n}`).join(" ")}
                </p>
              ) : (
                <p className="font-inter text-[8px] italic text-right" style={{ color: "rgba(212,175,55,0.30)" }}>
                  يَا [ أسماء العوان — تُحسب في القسم ٢ ]
                </p>
              )}
            </div>

            {/* Purpose position indicator */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(147,197,253,0.15)", background: "rgba(74,222,128,0.04)" }}>
              <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(74,222,128,0.50)" }}>
                Purpose — Azimet text (inserted here per category)
              </p>
              {selectedCat && selectedCat.purposeArabic ? (
                <p className="text-right" dir="rtl"
                  style={{ ...ARABIC_STYLE, color: "rgba(134,239,172,0.75)", fontSize: "1.05rem", lineHeight: 2.5 }}>
                  {resolveNames(
                    selectedCat.purposeArabic
                      .replace(/\[ESMAİ-AVAN\]/g, "")
                      .replace(/\[ESMAİ-KASEM\]/g, "")
                      .trim(),
                    names
                  )}
                </p>
              ) : (
                <p className="font-inter text-[8px] italic text-right" style={{ color: "rgba(74,222,128,0.25)" }}>
                  [ غرض القسم — اختر الغرض أدناه ]
                </p>
              )}
            </div>

            {/* بحق + Esma-i Kasem */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(147,197,253,0.15)" }}>
              <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(196,181,253,0.50)" }}>
                Esma-i Kasem — بِحَقِّ prefix · Section 3
              </p>
              {hasKasem ? (
                <p className="text-right" dir="rtl"
                  style={{ ...ARABIC_STYLE, color: "rgba(196,181,253,0.90)", fontSize: "1.1rem", lineHeight: 2.6 }}>
                  {kasemNames.map(n => `بِحَقِّ ${n}`).join(" ")}
                </p>
              ) : (
                <p className="font-inter text-[8px] italic text-right" style={{ color: "rgba(196,181,253,0.25)" }}>
                  بِحَقِّ [ أسماء القسم — تُحسب في القسم ٣ ]
                </p>
              )}
            </div>

            {/* Common Kasam closure */}
            <div className="px-4 py-3">
              <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(147,197,253,0.50)" }}>
                Common Kasam Closure — always appended last
              </p>
              <p className="text-right" dir="rtl"
                style={{ ...ARABIC_STYLE, color: "rgba(147,197,253,0.85)", fontSize: "1.1rem", lineHeight: 2.7 }}>
                {COMMON_KASAM.closure}
              </p>
            </div>

          </div>
        </div>

        <OrnamentalDivider />

        {/* ── 2. PURPOSE SELECTION ── */}
        <div>
          <StepBadge number="2" label="Select Purpose Category" color={G.gold} active />
          <PurposeSelector selected={selectedCat} onSelect={setSelectedCat} />
        </div>

        {/* ── 3. NAME INPUTS ── */}
        <AnimatePresence>
          {selectedCat && selectedCat.nameFields?.length > 0 && (
            <motion.div key="names"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <StepBadge number="3" label="Enter Names" color={G.green} active />
              <div className="rounded-xl border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
                <NameInputBlock cat={selectedCat} names={names} onChange={setNames} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <OrnamentalDivider />

        {/* ── 4. FINAL KASAM — always rendered, populated when ready ── */}
        <div>
          <StepBadge number="4" label="Final Kasam — Complete Arabic Text" color={G.gold} active />
          <FinalKasamOutput
            cat={selectedCat}
            names={names}
            avanNames={avanNames}
            kasemNames={kasemNames}
          />
        </div>

      </div>

      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />
    </motion.div>
  );
}