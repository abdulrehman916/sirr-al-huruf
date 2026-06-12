// ═══════════════════════════════════════════════════════════════
// CONCLUSION & RULES PANEL — READ-ONLY DOCUMENTATION
// No calculations. No state changes. No pipeline. Display only.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

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
    english: "Section 3 (Esma-i Kasem) always uses Fifth Bast (B5) for its final derivation block, regardless of Zevc/Ferd determination. The border letters of Section 3 Vefk are derived from the Istintak of the total value of all Fifth Bast expanded letters.",
    malayalam: "സെക്ഷൻ 3 (Esma-i Kasem) അതിന്റെ അന്തിമ ഡെറിവേഷൻ ബ്ലോക്കിനായി Zevc/Ferd നിർണ്ണയം പരിഗണിക്കാതെ എപ്പോഴും Fifth Bast (B5) ഉപയോഗിക്കുന്നു. സെക്ഷൻ 3 Vefk-ന്റെ അതിർത്തി അക്ഷരങ്ങൾ എല്ലാ Fifth Bast വിപുലീകരിച്ച അക്ഷരങ്ങളുടെ ആകെ മൂല്യത്തിന്റെ Istintak-ൽ നിന്ന് ഉരുത്തിരിക്കുന്നു.",
  },
  {
    number: 9,
    title: "Section 3 Vefk Rules",
    english: "The Section 3 Vefk source number is the total sum of all expanded letters from the final Fifth Bast block. The magic square is built directly from this source without an intermediate Istintak stage. Border letters frame all four sides of the grid.",
    malayalam: "സെക്ഷൻ 3 Vefk സോഴ്സ് നമ്പർ എന്നത് അന്തിമ Fifth Bast ബ്ലോക്കിലെ എല്ലാ വിപുലീകരിച്ച അക്ഷരങ്ങളുടെ ആകെ തുകയാണ്. ഇടനില Istintak ഘട്ടമില്ലാതെ ഈ സോഴ്സിൽ നിന്ന് നേരിട്ട് മാജിക് സ്ക്വയർ നിർമ്മിക്കുന്നു. അതിർത്തി അക്ഷരങ്ങൾ ഗ്രിഡിന്റെ നാല് വശങ്ങളെയും ചുറ്റി നിൽക്കുന്നു.",
  },
  {
    number: 10,
    title: "Final Principle",
    english: "All calculations strictly follow the manuscript formulas. The book is the sole authority. No mathematical assumptions or external systems override the manuscript evidence. Every cell in every Vefk grid must match the manuscript examples exactly.",
    malayalam: "എല്ലാ കണക്കുകൂട്ടലുകളും കൈയെഴുത്തുപ്രമാണ സൂത്രവാക്യങ്ങൾ കർശനമായി പിന്തുടരുന്നു. പുസ്തകമാണ് ഏക അധികാരം. കൈയെഴുത്തുപ്രമാണ തെളിവുകളെ മറികടക്കുന്ന ഗണിതശാസ്ത്ര അനുമാനങ്ങളോ ബാഹ്യ സംവിധാനങ്ങളോ പാടില്ല. ഓരോ Vefk ഗ്രിഡിലെയും ഓരോ സെല്ലും കൈയെഴുത്തുപ്രമാണ ഉദാഹരണങ്ങളുമായി കൃത്യമായി യോജിക്കണം.",
  },
];

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1.5">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

export default function ConclusionRulesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* Top accent */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: G.goldFaint, border: `1px solid ${G.goldBorder}` }}>
            <BookOpen className="w-5 h-5" style={{ color: G.gold }} />
          </div>
          <div className="flex flex-col">
            <span className="font-inter text-[9px] uppercase tracking-[0.25em] font-bold" style={{ color: G.gold }}>
              Conclusion & Rules
            </span>
            <span className="font-amiri text-lg font-bold leading-tight" style={{ color: G.goldDim }} dir="rtl">
              സംഗ്രഹവും നിയമങ്ങളും
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dimLo }}>
            {open ? "Collapse" : "Expand"}
          </span>
          <div className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: G.gold + "22", border: `1px solid ${G.gold}44` }}>
            {open
              ? <ChevronUp className="w-4 h-4" style={{ color: G.gold }} />
              : <ChevronDown className="w-4 h-4" style={{ color: G.gold }} />}
          </div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <OrnamentalDivider />

            <div className="px-6 pb-6 space-y-4">

              {/* Rules List */}
              {RULES.map((rule, idx) => (
                <div key={idx}
                  className="rounded-xl border p-4 space-y-3"
                  style={{
                    background: G.bgCard,
                    borderColor: G.goldBorder + "40",
                    boxShadow: `0 1px 8px rgba(0,0,0,0.3)`,
                  }}>

                  {/* Rule Header */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md font-inter text-[9px] font-black"
                      style={{ background: G.gold + "22", color: G.gold, border: `1px solid ${G.gold}44` }}>
                      {rule.number}
                    </div>
                    <span className="font-inter text-[8px] uppercase tracking-[0.2em] font-bold" style={{ color: G.gold }}>
                      {rule.title}
                    </span>
                  </div>

                  {/* English */}
                  <div className="space-y-1">
                    <span className="font-inter text-[7px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                      English
                    </span>
                    <p className="font-inter text-xs leading-relaxed" style={{ color: G.gold }}>
                      {rule.english}
                    </p>
                  </div>

                  {/* Malayalam */}
                  <div className="space-y-1 pt-2 border-t" style={{ borderColor: G.goldBorder + "30" }}>
                    <span className="font-inter text-[7px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                      Malayalam
                    </span>
                    <p className="font-amiri text-sm leading-relaxed" style={{ color: G.goldDim }} dir="rtl">
                      {rule.malayalam}
                    </p>
                  </div>

                </div>
              ))}

              {/* Final Note */}
              <div className="rounded-xl border p-4 text-center"
                style={{
                  background: G.goldFaint,
                  borderColor: G.goldBorder,
                }}>
                <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>
                  Read-Only Documentation Panel
                </span>
                <p className="font-inter text-xs mt-1.5" style={{ color: G.goldDim }}>
                  This panel displays system rules only. No calculations, state changes, or pipeline execution occur here.
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}