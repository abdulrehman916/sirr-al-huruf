// ═══════════════════════════════════════════════════════════════
// CONCLUSION & RULES PANEL — READ-ONLY DOCUMENTATION
// No calculations. No state changes. No pipeline. Display only.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

const G = {
  gold:         "#F5D060",
  goldDim:      "rgba(245,208,96,0.55)",
  goldFaint:    "rgba(245,208,96,0.08)",
  goldBorder:   "rgba(212,175,55,0.35)",
  goldBorderHi: "rgba(212,175,55,0.60)",
  glow:         "rgba(212,175,55,0.14)",
  bg:           "rgba(3,6,20,0.99)",
  bgCard:       "rgba(8,16,40,0.98)",
  bgInner:      "rgba(212,175,55,0.05)",
  dim:          "rgba(255,255,255,0.38)",
  dimLo:        "rgba(255,255,255,0.22)",
};

const RULES = [
  {
    number: 1,
    title: "Section Independence",
    english: "Each section is completely independent and must not modify or overwrite the data of any other section. Section 1, Section 2, and Section 3 each run their own isolated pipelines from start to finish.",
    malayalam: "ഓരോ സെക്ഷനും പൂർണ്ണമായും സ്വതന്ത്രമാണ്. ഒരു സെക്ഷനും മറ്റൊരു സെക്ഷന്റെ ഡേറ്റ മാറ്റുകയോ തിരുത്തുകയോ ചെയ്യരുത്. സെക്ഷൻ 1, 2, 3 — ഓരോന്നും ആദ്യം മുതൽ അവസാനം വരെ സ്വന്തം ഐസൊലേറ്റഡ് പൈപ്പ്‌ലൈൻ പ്രവർത്തിപ്പിക്കും.",
  },
  {
    number: 2,
    title: "Data Flow",
    english: "Section 2 reads only the final Expanded Letters of Section 1 as a read-only input. Section 3 reads only the final Expanded Letters of Section 2 as a read-only input. No section writes back to a previous section.",
    malayalam: "സെക്ഷൻ 2, സെക്ഷൻ 1-ന്റെ അന്തിമ Expanded Letters മാത്രം Read-Only ആയി വായിക്കണം. സെക്ഷൻ 3, സെക്ഷൻ 2-ന്റെ അന്തിമ Expanded Letters മാത്രം Read-Only ആയി വായിക്കണം. ഒരു സെക്ഷനും മുൻ സെക്ഷനിലേക്ക് ഡേറ്റ തിരിച്ചെഴുതരുത്.",
  },
  {
    number: 3,
    title: "Remainder Letter Rules",
    english: "When the total expanded letters count is not perfectly divisible by the group size (4 or 5), the shortfall letters are derived from the Istintak of the Ghalib Anasir (dominant element) value. Only the exact number of letters needed to complete the final group are taken.",
    malayalam: "ആകെ Expanded Letters, ഗ്രൂപ്പ് സൈസ് (4 അല്ലെങ്കിൽ 5) കൊണ്ട് കൃത്യമായി ഹരിക്കാൻ കഴിയാത്ത സ്ഥിതിയിൽ, ബാക്കി ആവശ്യമുള്ള അക്ഷരങ്ങൾ Ghalib Anasir (Dominant Element) -ന്റെ മൂല്യത്തിന്റെ Istintak-ൽ നിന്ന് ഉരുത്തിരിക്കണം. അവസാന ഗ്രൂപ്പ് പൂർത്തിയാക്കാൻ ആവശ്യമായ കൃത്യ എണ്ണം അക്ഷരങ്ങൾ മാത്രം എടുക്കണം.",
  },
  {
    number: 4,
    title: "Istintak Rules",
    english: "Istintak converts a number into its constituent Arabic letters by extracting each positional digit and mapping it to the corresponding letter. The output letters become the seed or expanded sequence for the next pipeline step.",
    malayalam: "Istintak എന്നത് ഒരു സംഖ്യയെ അതിന്റെ ഘടകഭാഗമായ അറബി അക്ഷരങ്ങളിലേക്ക് പരിവർത്തനം ചെയ്യുന്ന പ്രക്രിയയാണ്. ഓരോ ഡിജിറ്റ് സ്ഥാനത്തെ അക്ഷരമാക്കി മാറ്റുന്നു. ഔട്ട്‌പുട്ട് അക്ഷരങ്ങൾ അടുത്ത പൈപ്പ്‌ലൈൻ ഘട്ടത്തിന്റെ Seed അല്ലെങ്കിൽ Expanded ശ്രേണിയാകും.",
  },
  {
    number: 5,
    title: "Vefk Order",
    english: "The three Vefk squares are always produced in the following strict order: Section 1 (Esma-i Kitabet / Esma-i Vefk) → Section 2 (Esma-i A'van) → Section 3 (Esma-i Kasem). Each Vefk is derived only from its own section's pipeline and is never shared or reused across sections.",
    malayalam: "മൂന്ന് Vefk സ്ക്വയറുകൾ എപ്പോഴും ഈ കർശനമായ ക്രമത്തിൽ ഉൽപ്പാദിപ്പിക്കണം: സെക്ഷൻ 1 (Esma-i Kitabet / Esma-i Vefk) → സെക്ഷൻ 2 (Esma-i A'van) → സെക്ഷൻ 3 (Esma-i Kasem). ഓരോ Vefk-ഉം അതിന്റെ സ്വന്തം സെക്ഷന്റെ പൈപ്പ്‌ലൈനിൽ നിന്ന് മാത്രം ഉരുത്തിരിക്കണം. ഒരിക്കലും സെക്ഷനുകൾക്കിടയിൽ പങ്കിടുകയോ പുനരുപയോഗിക്കുകയോ ചെയ്യരുത്.",
  },
  {
    number: 6,
    title: "Element Rules",
    english: "The dominant element (Ghalib Anasir) is determined once from the 9-Mizan grand analysis. This single dominant element value is then shared as a read-only parameter to all three sections. No section may change or re-derive the dominant element independently.",
    malayalam: "Dominant Element (Ghalib Anasir) 9-Mizan Grand Analysis-ൽ നിന്ന് ഒരു തവണ മാത്രം നിർണ്ണയിക്കും. ഈ ഒറ്റ Dominant Element മൂല്യം Read-Only Parameter ആയി മൂന്ന് സെക്ഷനുകളിലേക്കും നൽകും. ഒരു സെക്ഷനും Dominant Element സ്വതന്ത്രമായി മാറ്റുകയോ പുനർ-ഉരുത്തിരിക്കുകയോ ചെയ്യരുത്.",
  },
  {
    number: 7,
    title: "Day and Hour Rules",
    english: "The selected Day and Hour values from the 9-Mizan input stage are fixed inputs to the grand total calculation only. They do not independently affect the Bast derivations within Section 1, 2, or 3 pipelines. The day and hour selections are locked once the analysis begins.",
    malayalam: "9-Mizan ഇൻപുട്ട് ഘട്ടത്തിൽ തിരഞ്ഞെടുത്ത Day, Hour മൂല്യങ്ങൾ Grand Total കണക്കുകൂട്ടലിൽ മാത്രം Fixed Input ആണ്. അവ സ്വതന്ത്രമായി സെക്ഷൻ 1, 2, 3 പൈപ്പ്‌ലൈനുകളിലെ Bast Derivation-നെ ബാധിക്കരുത്. Analysis ആരംഭിച്ചതിനു ശേഷം Day, Hour തിരഞ്ഞെടുപ്പുകൾ ലോക്ക് ചെയ്യപ്പെടും.",
  },
  {
    number: 8,
    title: "Section 3 Special Rules",
    english: "Section 3 (Esma-i Kasem) always uses a mandatory post-processing block exclusively with Fifth Bast (B5), regardless of the Zevc/Ferd determination of the seed letters. This Fifth Bast post-processing is unique to Section 3 and must not be applied to Section 1 or Section 2.",
    malayalam: "സെക്ഷൻ 3 (Esma-i Kasem) എപ്പോഴും Seed Letters-ന്റെ Zevc/Ferd നിർണ്ണയം പരിഗണിക്കാതെ, Fifth Bast (B5) ഉപയോഗിച്ചുള്ള നിർബന്ധിത Post-Processing Block ഉൾക്കൊള്ളുന്നു. ഈ Fifth Bast Post-Processing സെക്ഷൻ 3-ന് മാത്രം അനന്യമാണ്. ഇത് സെക്ഷൻ 1 അല്ലെങ്കിൽ സെക്ഷൻ 2-ൽ പ്രയോഗിക്കരുത്.",
  },
  {
    number: 9,
    title: "Section 3 Vefk Rules",
    english: "The Vefk source number for Section 3 is derived from the total sum of all First Bast values of the expanded letters produced by the Final Fifth Bast block. The border letters of the Section 3 Vefk grid are derived from the Istintak of the total of all B5-expanded letters' First Bast values.",
    malayalam: "സെക്ഷൻ 3-ന്റെ Vefk Source Number, Final Fifth Bast Block-ൽ ഉൽപ്പാദിപ്പിക്കപ്പെടുന്ന Expanded Letters-ന്റെ എല്ലാ First Bast മൂല്യങ്ങളുടെ ആകെ തുകയിൽ നിന്ന് ഉരുത്തിരിക്കണം. സെക്ഷൻ 3 Vefk Grid-ന്റെ Border Letters, B5-Expanded Letters-ന്റെ First Bast മൂല്യങ്ങളുടെ ആകെ തുകയുടെ Istintak-ൽ നിന്ന് ഉരുത്തിരിക്കണം.",
  },
  {
    number: 10,
    title: "Final Principle",
    english: "The entire system — from 9-Mizan analysis through all three sections — is a sealed, read-only manuscript engine. No user action, UI interaction, or external parameter may alter the calculation logic, intermediate values, or final outputs once a pipeline has been executed. All results are derived strictly and solely from the manuscript formulas.",
    malayalam: "9-Mizan Analysis മുതൽ മൂന്ന് സെക്ഷനുകൾ വരെ ഉള്ള ഈ മുഴുവൻ സിസ്റ്റവും ഒരു Sealed, Read-Only Manuscript Engine ആണ്. ഒരു Pipeline Execute ആയിക്കഴിഞ്ഞാൽ ഒരു User Action-ഉം, UI Interaction-ഉം, External Parameter-ഉം Calculation Logic-നെ, Intermediate Values-നെ, അല്ലെങ്കിൽ Final Outputs-നെ മാറ്റരുത്. എല്ലാ ഫലങ്ങളും കർശനമായും ഏക്ലത്തും Manuscript Formulas-ൽ നിന്ന് ഉരുത്തിരിക്കണം.",
  },
];

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 9 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

function RuleCard({ rule }) {
  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: G.bgInner, borderColor: G.goldBorder }}>

      {/* Rule Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: G.goldBorder + "55" }}>
        <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black flex-shrink-0"
          style={{ background: G.goldFaint, border: `1px solid ${G.goldBorder}`, color: G.gold }}>
          {rule.number}
        </div>
        <span className="font-inter text-[9px] uppercase tracking-[0.22em] font-bold" style={{ color: G.gold }}>
          Rule {rule.number} — {rule.title}
        </span>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* English */}
        <div className="space-y-1">
          <div className="font-inter text-[7px] uppercase tracking-widest font-bold" style={{ color: G.dimLo }}>
            English
          </div>
          <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            {rule.english}
          </p>
        </div>

        {/* Divider between languages */}
        <div className="h-px w-full" style={{ background: G.goldBorder + "44" }} />

        {/* Malayalam */}
        <div className="space-y-1">
          <div className="font-inter text-[7px] uppercase tracking-widest font-bold" style={{ color: G.dimLo }}>
            Malayalam
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
            {rule.malayalam}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConclusionRulesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 60px ${G.glow}, 0 4px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.07)`,
      }}>

      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* Collapsible Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-5 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
            style={{ background: G.goldFaint, border: `1px solid ${G.goldBorder}` }}>
            <BookOpen className="w-5 h-5" style={{ color: G.gold }} />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-inter text-[9px] uppercase tracking-[0.28em] font-bold" style={{ color: G.goldDim }}>
                Conclusion & Rules
              </span>
              <span className="font-inter text-[8px]" style={{ color: G.dim }}>📖</span>
            </div>
            <span className="font-amiri text-xl font-bold" style={{ color: G.gold }}>
              സംഗ്രഹവും നിയമങ്ങളും
            </span>
            <span className="font-inter text-[8px]" style={{ color: G.dim }}>
              {open ? "Tap to collapse" : "Tap to expand — 10 rules"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
          style={{ background: G.goldFaint, border: `1px solid ${G.goldBorder}` }}>
          {open
            ? <ChevronUp className="w-4 h-4" style={{ color: G.gold }} />
            : <ChevronDown className="w-4 h-4" style={{ color: G.gold }} />}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="rules-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <OrnamentalDivider />

            {/* Read-only notice */}
            <div className="mx-4 mb-4 mt-1 px-4 py-2.5 rounded-xl border text-center"
              style={{ background: "rgba(245,208,96,0.05)", borderColor: G.goldBorder + "55" }}>
              <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dimLo }}>
                📖 Documentation Only — No calculations, no state changes, no pipeline execution
              </span>
            </div>

            <div className="px-4 pb-6 space-y-3">
              {RULES.map((rule) => (
                <RuleCard key={rule.number} rule={rule} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </div>
  );
}