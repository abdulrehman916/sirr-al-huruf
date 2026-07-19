import { useState, useEffect, createContext, useContext } from "react";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, ShieldAlert, BookOpen, Languages, ScrollText, Sparkles,
  Link2, BookMarked, FileText, Quote, Award, AlertTriangle, Clock,
  Network, BookCopy, ChevronDown,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import HolyNameProfileLangSelector from "./HolyNameProfileLangSelector";
import { arTitle } from "./holyNameProfileI18n";

// ── Section C Research Profile ──
// Mirrors Section A (HolyNameResearchProfile) architecture but reads ONLY
// from HolyNameEsotericKnowledge. All scholarly fields render empty
// ("Not Verified") until the owner supplies source material and a future
// enrichment pass populates them.

const P = {
  border: "rgba(212,175,55,0.30)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(245,208,96,0.55)",
  faint: "rgba(212,175,55,0.14)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const STATUS_LABELS = {
  verified: { t: "Verified", ml: "പരിശോധിച്ചു സ്ഥിരീകരിച്ചു", c: "#34d399" },
  needs_review: { t: "Needs Review", ml: "വീണ്ടും പരിശോധന ആവശ്യം", c: "#fbbf24" },
  conflicting_sources: { t: "Conflicting Sources", ml: "ഉറവിടങ്ങൾ തമ്മിൽ ഭിന്നത", c: "#fb923c" },
  not_in_classical_sources: { t: "Not in Classical Sources", ml: "ക്ലാസിക് സ്രോതസ്സുകളിൽ ഇല്ല", c: "#94a3b8" },
  unverified: { t: "Not Verified", ml: "പരിശോധിച്ചിട്ടില്ല", c: "#64748b" },
};
const ORIGIN_LABELS = { hebrew: "Hebrew", syriac: "Syriac", aramaic: "Aramaic", arabic: "Arabic", persian: "Persian", mixed: "Mixed", unknown: "Unknown" };
const ORIGIN_ML = { hebrew: "ഹീബ്രു", syriac: "സിറിയാക്ക്", aramaic: "അറമായിക്ക്", arabic: "അറബിക്", persian: "പേർഷ്യൻ", mixed: "മിശ്രിതം", unknown: "അജ്ഞാതം" };
const REL_LABELS = {
  identical: "Identical to a 99 Name", alternate_reading: "Alternate Reading of a 99 Name",
  same_root: "Same Arabic Root", same_meaning: "Same Meaning", closely_related: "Closely Related",
  synonymous: "Synonymous", scholarly_relation: "Related via Classical Scholarship",
  none: "No Authentic Relationship", foreign_equivalent: "Foreign-Language Equivalent",
  traditional_only: "Traditional/Occult Association Only", unknown: "Relationship Not Determined",
};

const NOT_VERIFIED = "Not Verified";
const NOT_FOUND = "Not found in verified primary sources";
const has = (v) => v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== "");

const LangCtx = createContext("en");

function TriField({ label, labelML, arabic, malayalam, english, arabicFirst }) {
  const lang = useContext(LangCtx);
  const labelAR = arTitle(label);
  const activeLabel = lang === "ml" ? (labelML || label) : lang === "ar" ? (labelAR || label) : label;
  const labelIsAr = lang === "ar" && !!labelAR;
  const selVal = lang === "ml" ? malayalam : lang === "ar" ? arabic : english;
  const hasTerm = arabicFirst && has(arabic);
  const hasSel = has(selVal);
  const parts = [];
  if (hasTerm) parts.push({ val: arabic, cls: "font-amiri text-base leading-loose", dir: "rtl" });
  if (hasSel && !(arabicFirst && lang === "ar")) {
    const cls = lang === "ml" ? "font-malayalam text-sm leading-relaxed" : lang === "ar" ? "font-amiri text-base leading-loose" : "font-inter text-xs leading-relaxed";
    parts.push({ val: selVal, cls, dir: lang === "ar" ? "rtl" : "auto" });
  }
  const empty = parts.length === 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2 flex-wrap">
        {labelIsAr
          ? <span className="font-amiri text-xs font-semibold" style={{ color: P.dim }} dir="rtl">{activeLabel}</span>
          : lang === "ml"
            ? <span className="font-malayalam text-[11px] font-semibold" style={{ color: P.dim }}>{activeLabel}</span>
            : <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>{activeLabel}</span>}
      </div>
      {empty ? (
        <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>
      ) : (
        <div className="space-y-1">{parts.map((p, i) => <p key={i} className={`${p.cls} selectable`} style={{ color: "rgba(255,255,255,0.88)" }} dir={p.dir}>{p.val}</p>)}</div>
      )}
    </div>
  );
}

function RefList({ label, labelML, items }) {
  const arr = Array.isArray(items) ? items : [];
  const lang = useContext(LangCtx);
  const labelAR = arTitle(label);
  const activeLabel = lang === "ml" ? (labelML || label) : lang === "ar" ? (labelAR || label) : label;
  const labelIsAr = lang === "ar" && !!labelAR;
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        {labelIsAr
          ? <span className="font-amiri text-xs font-semibold" style={{ color: P.dim }} dir="rtl">{activeLabel}</span>
          : lang === "ml"
            ? <span className="font-malayalam text-[11px] font-semibold" style={{ color: P.dim }}>{activeLabel}</span>
            : <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>{activeLabel}</span>}
      </div>
      {arr.length === 0 ? (
        <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>
      ) : (
        arr.map((r, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{r}</p>)
      )}
    </div>
  );
}

function Section({ icon: Icon, title, titleML, children, accent, defaultOpen = true }) {
  const lang = useContext(LangCtx);
  const ar = arTitle(title);
  const primary = lang === "ml" ? (titleML || title) : lang === "ar" ? (ar || title) : title;
  const primaryIsAr = lang === "ar" && !!ar;
  const primaryCls = lang === "ml" ? "font-malayalam text-[11px] font-semibold flex-1" : primaryIsAr ? "font-amiri text-sm flex-1" : "font-inter text-[9px] uppercase tracking-widest font-bold flex-1";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="rounded-xl border overflow-hidden" style={{ background: "rgba(8,16,38,0.55)", borderColor: P.border }}>
      <details open={defaultOpen} className="group">
        <summary className="cursor-pointer list-none flex items-center gap-2 px-3 py-2.5 select-none" style={{ borderBottom: defaultOpen ? `1px solid ${P.faint}` : "none" }}>
          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent || P.text }} />
          <span className={primaryCls} style={{ color: accent || P.text }} dir={primaryIsAr ? "rtl" : undefined}>{primary}</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180 flex-shrink-0" style={{ color: P.dim }} />
        </summary>
        <div className="px-3 py-3 space-y-2.5">{children}</div>
      </details>
    </motion.div>
  );
}

export default function HolyNameEsotericResearchProfile({ nameId }) {
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    base44.entities.HolyNameEsotericKnowledge.filter({ name_id: nameId }, null, 1)
      .then(r => { if (alive) setRec((r && r[0]) || null); })
      .catch(() => { if (alive) setRec(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [nameId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3" style={{ borderTop: `1px solid ${P.faint}` }}>
        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: P.dim }} />
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>Loading scholarly research profile…</span>
      </div>
    );
  }

  if (!rec) {
    return (
      <div className="mt-3 rounded-xl border p-3 flex items-start gap-2" style={{ background: "rgba(8,16,38,0.5)", borderColor: P.faint }}>
        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(148,163,184,0.7)" }} />
        <div className="space-y-0.5">
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(148,163,184,0.85)" }}>{NOT_VERIFIED}</p>
          <p className="font-malayalam text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>ഈ നാമത്തിന്റെ പണ്ഡിതോപയോഗിയായ ഗവേഷണ വിവരങ്ങൾ ഇതുവരെ പരിശോധിച്ചിട്ടില്ല.</p>
        </div>
      </div>
    );
  }

  const st = STATUS_LABELS[rec.verification_status] || STATUS_LABELS.unverified;
  const rp = rec.research_profile || {};
  const ling = rec.linguistic || {};
  const ik = rec.islamic_knowledge || {};
  const mean = rec.meanings || {};
  const ben = rec.benefits || {};
  const rel99 = rec.relationship_to_99_names || {};
  const relType = rec.relationship_to_99_names_type || rel99.relationship_type || "unknown";
  const originLabel = ORIGIN_LABELS[rec.name_origin] || rec.name_origin || "Unknown";
  const originML = ORIGIN_ML[rec.name_origin] || "അജ്ഞാതം";

  return (
    <LangCtx.Provider value={lang}>
    <div className="pt-3 mt-1 space-y-3" style={{ borderTop: `1px solid ${P.faint}` }}>
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" style={{ color: P.text }} />
          <span className={lang === "ml" ? "font-malayalam text-[11px] font-bold" : "font-inter text-[9px] uppercase tracking-widest font-bold"} style={{ color: P.text }}>{lang === "ml" ? "പണ്ഡിതോപയോഗിയായ ഗവേഷണ പ്രൊഫൈൽ" : "Scholarly Research Profile"}</span>
        </div>
        <HolyNameProfileLangSelector lang={lang} setLang={setLang} />
      </div>

      {/* 1 — Verified Arabic spelling + verification meta */}
      <Section icon={ShieldCheck} title="1 · Verified Arabic Spelling & Harakat" titleML="സ്ഥിരീകരിച്ച അറബി നാമവും ഹരകത്തും" accent={st.c}>
        <div className="text-center py-2 rounded-lg" style={{ background: P.bgHi, border: `1px solid ${P.borderHi}` }}>
          <p className="font-amiri text-[2.2rem] font-bold leading-[2.2] selectable" style={{ color: P.text, textShadow: "0 0 20px rgba(212,175,55,0.30)" }} dir="rtl">{rec.canonical_arabic || rec.fully_vowelized_name || rec.arabic_name}</p>
          {rec.canonical_arabic && rec.arabic_name && rec.canonical_arabic !== rec.arabic_name && <p className="font-inter text-[8px] mt-1" style={{ color: P.dim }}>As supplied: <span className="font-amiri text-sm" dir="rtl">{rec.arabic_name}</span></p>}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-inter text-[8px] uppercase tracking-widest font-bold" style={{ color: st.c, background: `${st.c}1a`, border: `1px solid ${st.c}55` }}><ShieldCheck className="w-3 h-3" /> {lang === "ml" ? st.ml : st.t}</span>
          <span className="font-inter text-[9px]" style={{ color: P.dim }}>Confidence: <b style={{ color: P.text }}>{rec.verification_confidence || 0}%</b></span>
          {rec.last_verified_date && <span className="inline-flex items-center gap-1 font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}><Clock className="w-2.5 h-2.5" /> {new Date(rec.last_verified_date).toLocaleDateString()}</span>}
        </div>
        {rec.review_notes && <TriField label="Reviewer Notes" labelML="പരിശോധകന്റെ കുറിപ്പുകൾ" english={rec.review_notes} malayalam={rec.review_notes_ml} />}
      </Section>

      {/* 2 — Alternative harakat */}
      {Array.isArray(rec.alternative_readings) && rec.alternative_readings.length > 0 && (
        <Section icon={BookOpen} title="2 · Alternative Accepted Harakat & Readings" titleML="മാറ്റൊലികളും സ്വീകാര്യമായ വായനകളും">
          <div className="space-y-2">
            {rec.alternative_readings.map((a, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-amiri text-lg selectable" style={{ color: P.text }} dir="rtl">{a.arabic}</span>
                  {a.preferred && <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ color: P.text, background: P.bgHi, border: `1px solid ${P.border}` }}>Preferred</span>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 3,4,5,6 — Pronunciation, Origin, Original word, Etymology */}
      <Section icon={Languages} title="3–6 · Pronunciation, Origin, Original Word & Etymology" titleML="ഉച്ചാരണം, ഉദ്ഭവ ഭാഷ, മൂലപദം, പദോൽപ്പത്തി">
        <TriField label="3 · Pronunciation" labelML="ഉച്ചാരണം" english={rp.pronunciation_guide} malayalam={rp.pronunciation_guide_ml} />
        <TriField label="4 · Language of Origin" labelML="ഉദ്ഭവ ഭാഷ" english={originLabel} malayalam={originML} />
        <TriField label="5 · Original Source Word" labelML="മൂലപദം" arabic={rec.original_source_word} arabicFirst />
        <TriField label="6 · Etymology" labelML="പദോൽപ്പത്തി" english={rec.etymology} malayalam={rp.etymology_ml} />
      </Section>

      {/* 7,8 — Historical background & earliest occurrence */}
      <Section icon={ScrollText} title="7–8 · Historical Background & Earliest Occurrence" titleML="ചരിത്രപരമായ പശ്ചാത്തലവും ആദ്യത്തെ പരാമർശവും">
        <TriField label="7 · Historical Background" labelML="ചരിത്രപരമായ പശ്ചാത്തലം" english={rp.historical_background} malayalam={rp.historical_background_ml} />
        <TriField label="8 · Earliest Known Occurrence" labelML="ആദ്യത്തെ പരാമർശം" english={rp.earliest_occurrence} malayalam={rp.earliest_occurrence_ml} />
        <TriField label="Related Historical Usage" labelML="ബന്ധപ്പെട്ട ചരിത്രപരമായ ഉപയോഗം" english={rp.related_historical_usage} malayalam={rp.related_historical_usage_ml} />
        {!has(rp.historical_background) && !has(rp.earliest_occurrence) && <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>{NOT_FOUND}</p>}
      </Section>

      {/* 9–17 — Meanings (trilingual) */}
      <Section icon={BookOpen} title="9–17 · Meanings" titleML="അർത്ഥങ്ങൾ">
        <TriField label="Meaning" labelML="അർത്ഥം" arabic={mean.arabic} malayalam={mean.malayalam} english={mean.english} />
        <TriField label="12 · Original-Language Meaning" labelML="മൂലഭാഷാ അർത്ഥം" english={mean.original} malayalam={mean.original_ml} />
        <TriField label="13 · Literal Meaning" labelML="ആക്ഷരിക അർത്ഥം" english={rp.literal_meaning || ling.literal_meaning} malayalam={mean.literal_ml} />
        <TriField label="14 · Root Meaning" labelML="ധാതു അർത്ഥം" english={rp.root_meaning || ling.lexical_meaning} malayalam={mean.root_ml} />
        <TriField label="15 · Symbolic Meaning" labelML="പ്രതീകാത്മക അർത്ഥം" english={mean.symbolic} malayalam={mean.symbolic_ml} />
        <TriField label="16 · Historical Meaning" labelML="ചരിത്രപരമായ അർത്ഥം" english={mean.historical} malayalam={mean.historical_ml} />
        <TriField label="17 · Traditional Meaning" labelML="പാരമ്പര്യ അർത്ഥം" english={mean.traditional} malayalam={mean.traditional_ml} />
      </Section>

      {/* 18 — Relationship to 99 Names */}
      <Section icon={Link2} title="18 · Relationship with the 99 Beautiful Names of Allah" titleML="99 സുന്ദര നാമങ്ങളുമായുള്ള ബന്ധം" accent={relType === "none" ? "rgba(148,163,184,0.8)" : P.text}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 rounded-lg font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: relType === "none" ? "rgba(148,163,184,0.85)" : P.text, background: relType === "none" ? "rgba(148,163,184,0.10)" : P.bgHi, border: `1px solid ${relType === "none" ? "rgba(148,163,184,0.30)" : P.border}` }}>{REL_LABELS[relType] || relType}</span>
          {rel99.related_name_arabic && <span className="font-amiri text-base" style={{ color: P.text }} dir="rtl">{rel99.related_name_arabic}</span>}
        </div>
        <TriField label="Evidence" labelML="തെളിവുകൾ" english={rel99.evidence} malayalam={rel99.evidence_ml} />
        {relType === "unknown" && <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>Relationship not yet determined — awaiting source material.</p>}
      </Section>

      {/* 19,20,21 — Quran / Hadith / Tafsir */}
      <Section icon={Quote} title="19–21 · Qur'an, Hadith & Tafsir References" titleML="ഖുർആൻ, ഹദീസ്, തഫ്സീർ പരാമർശങ്ങൾ">
        {has(ik.quran_verses) || has(ik.hadith_refs) || has(ik.tafsir_refs) || has(ik.scholarly_explanation) ? (
          <>
            {has(ik.quran_verses) && <div className="space-y-1"><span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>19 · Qur'an References</span>{ik.quran_verses.map((q, i) => <p key={i} className="font-amiri text-sm leading-loose selectable" style={{ color: "rgba(255,255,255,0.88)" }} dir="rtl">{q}</p>)}</div>}
            {has(ik.hadith_refs) && <div className="space-y-1"><span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>20 · Hadith References</span>{ik.hadith_refs.map((h, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{h}</p>)}</div>}
            {has(ik.tafsir_refs) && <div className="space-y-1"><span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>21 · Tafsir References</span>{ik.tafsir_refs.map((t, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{t}</p>)}</div>}
            {has(ik.scholarly_explanation) && <TriField label="Scholarly Explanation" labelML="പണ്ഡിത വിശദീകരണം" english={ik.scholarly_explanation} malayalam={ik.scholarly_explanation_ml} />}
          </>
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>Not found in verified primary Islamic sources (awaiting source material).</p>
        )}
      </Section>

      {/* 22,23,24 — References */}
      <Section icon={BookMarked} title="22–24 · Classical, Academic & Manuscript References" titleML="ക്ലാസിക്, അക്കാദമിക്, കയ്യെഴുത്തുപ്രതി പരാമർശങ്ങൾ" defaultOpen={false}>
        <RefList label="22 · Classical Dictionary References" labelML="ക്ലാസിക് നിഘണ്ടു പരാമർശങ്ങൾ" items={rp.classical_dict_refs} />
        <RefList label="23 · Academic References" labelML="അക്കാദമിക് പരാമർശങ്ങൾ" items={rp.academic_refs} />
        <RefList label="24 · Manuscript References" labelML="കയ്യെഴുത്തുപ്രതി പരാമർശങ്ങൾ" items={rp.manuscript_refs} />
      </Section>

      {/* 25,26 — Related names & root words */}
      <Section icon={Network} title="25–26 · Related Names & Related Root Words" titleML="ബന്ധപ്പെട്ട നാമങ്ങളും ധാതുക്കളും" defaultOpen={false}>
        <TriField label="25 · Related Names" labelML="ബന്ധപ്പെട്ട നാമങ്ങൾ" english={ling.related_names} malayalam={rp.related_names_ml} />
        <TriField label="26 · Related Root Words" labelML="ബന്ധപ്പെട്ട ധാതുക്കൾ" arabic={ling.arabic_root} arabicFirst />
        <TriField label="Root Letters" labelML="ധാതു അക്ഷരങ്ങൾ" arabic={ling.root_letters || rp.root_letters} arabicFirst />
        <TriField label="Morphological Pattern" labelML="രൂപശാസ്ത്ര പാറ്റേൺ" english={ling.morphological_pattern || rp.morphological_pattern} />
      </Section>

      {/* 27,28 — Benefits */}
      <Section icon={Award} title="27–28 · Authentic Islamic & Traditional Benefits" titleML="പ്രാമാണിക ഇസ്ലാമിക, പാരമ്പര്യ ഗുണങ്ങൾ" defaultOpen={false}>
        {has(ben.authentic_islamic) ? (
          <>
            <div className="flex items-baseline gap-2"><span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>27 · Authentic Islamic Benefits</span></div>
            <div className="space-y-1">{(ben.authentic_islamic || []).map((b, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{b.text}</p>)}</div>
          </>
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No authentic Islamic virtues found in reliable sources (awaiting source material).</p>
        )}
        {has(ben.traditional) && (
          <>
            <div className="flex items-baseline gap-2"><span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "#fbbf24" }}>28 · Traditional Benefits — Not Authenticated</span></div>
            <div className="space-y-1">{(ben.traditional || []).map((b, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{b.text}</p>)}</div>
          </>
        )}
      </Section>

      {/* Invocations */}
      <Section icon={BookCopy} title={`Invocations / Wazifa / Dhikr / Manuscript Practices${Array.isArray(rec.invocations) && rec.invocations.length ? ` (${rec.invocations.length})` : ""}`} titleML="പ്രാർഥനകൾ / വസീഫ / ദിക്ർ / കയ്യെഴുത്തുപ്രതി അഭ്യാസങ്ങൾ" defaultOpen={false}>
        {Array.isArray(rec.invocations) && rec.invocations.length > 0 ? (
          <div className="space-y-3">
            {rec.invocations.map((iv, i) => (
              <div key={i} className="space-y-2 rounded-lg p-3" style={{ background: iv.authenticated ? "rgba(52,211,153,0.04)" : "rgba(251,191,36,0.04)", border: `1px solid ${iv.authenticated ? "rgba(52,211,153,0.25)" : "rgba(251,191,36,0.25)"}` }}>
                {iv.text_ar && <p className="font-amiri text-lg leading-loose selectable whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.92)" }} dir="rtl">{iv.text_ar}</p>}
                {lang === "ml" && iv.translation_ml && <p className="font-malayalam text-sm leading-relaxed selectable" style={{ color: "rgba(255,255,255,0.90)" }} dir="auto">{iv.translation_ml}</p>}
                {lang === "en" && iv.translation_en && <p className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.72)" }} dir="auto">{iv.translation_en}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No historically documented invocation found yet (awaiting source material).</p>
        )}
      </Section>

      {/* 29,30,31 — Verification + sources */}
      <Section icon={ShieldCheck} title="29–31 · Verification Status, Confidence & Sources" titleML="പരിശോധന നില, വിശ്വാസ്യത, സ്രോതസ്സുകൾ" defaultOpen={false} accent={st.c}>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: st.c, background: `${st.c}1a`, border: `1px solid ${st.c}55` }}>{lang === "ml" ? st.ml : st.t}</span>
          <span className="font-inter text-[9px]" style={{ color: P.dim }}>Confidence: <b style={{ color: P.text }}>{rec.verification_confidence || 0}%</b>{rec.last_verified_date ? ` · ${new Date(rec.last_verified_date).toLocaleDateString()}` : ""}</span>
          {has(rec.verification_sources) ? (
            <div className="space-y-1.5 pt-1">
              {(rec.verification_sources || []).map((s, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg border font-inter text-[8px]" style={{ background: "rgba(8,16,38,0.6)", borderColor: P.border, color: "rgba(255,255,255,0.72)" }}>
                  <BookMarked className="w-2.5 h-2.5 flex-shrink-0" style={{ color: P.dim }} />
                  <span className="font-semibold" style={{ color: P.text }}>{s.title}</span>
                  {s.author && <span>· {s.author}</span>}
                  {s.page && <span>· p.{s.page}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>
          )}
        </div>
      </Section>
    </div>
    </LangCtx.Provider>
  );
}