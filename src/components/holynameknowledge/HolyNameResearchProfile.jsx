import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, ShieldAlert, BookOpen, Languages, ScrollText, Sparkles,
  Link2, BookMarked, FileText, Quote, Award, AlertTriangle, Clock, Volume2,
  Network, GitBranch, BookCopy, ChevronDown,
} from "lucide-react";
import { base44 } from "@/api/base44Client";

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
  not_in_classical_sources: { t: "Not in Classical Sources", ml: "ക്ലാസിക്ക് സ്രോതസ്സുകളിൽ ഇല്ല", c: "#94a3b8" },
  unverified: { t: "Not Verified", ml: "പരിശോധിച്ചിട്ടില്ല", c: "#64748b" },
};
const ORIGIN_LABELS = {
  hebrew: "Hebrew", syriac: "Syriac", aramaic: "Aramaic", arabic: "Arabic",
  persian: "Persian", mixed: "Mixed", unknown: "Unknown",
};
const ORIGIN_ML = {
  hebrew: "ഹീബ്രു", syriac: "സിറിയാക്ക്", aramaic: "അറമായിക്ക്", arabic: "അറബിക്",
  persian: "പേർഷ്യൻ", mixed: "മിശ്രിതം", unknown: "അജ്ഞാതം",
};
const REL_LABELS = {
  identical: "Identical to a 99 Name", alternate_reading: "Alternate Reading of a 99 Name",
  same_root: "Same Arabic Root", same_meaning: "Same Meaning",
  closely_related: "Closely Related", synonymous: "Synonymous",
  scholarly_relation: "Related via Classical Scholarship", none: "No Authentic Relationship",
  foreign_equivalent: "Foreign-Language Equivalent", traditional_only: "Traditional/Occult Association Only",
  unknown: "Relationship Not Determined",
};

const NOT_VERIFIED = "Not Verified";
const NOT_FOUND = "Not found in verified primary sources";
const has = (v) => v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== "");

function Row({ label, value, dir, mono, ml }) {
  const empty = !has(value);
  return (
    <div className="space-y-1">
      <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>{label}</p>
      {empty ? (
        <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>
      ) : (
        <p
          className={ml ? "font-malayalam text-sm leading-relaxed selectable" : mono ? "font-amiri text-base leading-loose selectable" : "font-inter text-sm leading-relaxed selectable"}
          style={{ color: "rgba(255,255,255,0.88)" }}
          dir={dir || (mono ? "rtl" : "auto")}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function SourceChip({ s }) {
  const title = s?.title || "Untitled source";
  const url = s?.url;
  const inner = (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-inter text-[8px] leading-tight" style={{ background: "rgba(8,16,38,0.6)", borderColor: P.border, color: "rgba(255,255,255,0.72)" }}>
      <BookMarked className="w-2.5 h-2.5 flex-shrink-0" style={{ color: P.dim }} />
      <span className="font-semibold" style={{ color: P.text }}>{title}</span>
      {s.author && <span>· {s.author}</span>}
      {s.page && <span>· p.{s.page}</span>}
      {url && <span style={{ color: P.dim }}>↗</span>}
      {s.reliability_score ? <span style={{ color: "rgba(212,175,55,0.45)" }}>· {s.reliability_score}%</span> : null}
    </span>
  );
  return url
    ? <a href={url} target="_blank" rel="noreferrer" className="inline-flex no-underline">{inner}</a>
    : <span className="inline-flex">{inner}</span>;
}

function SourcesList({ sources }) {
  const arr = Array.isArray(sources) ? sources : [];
  if (arr.length === 0) return null;
  return <div className="flex flex-wrap gap-1.5">{arr.map((s, i) => <SourceChip key={i} s={s} />)}</div>;
}

function Section({ icon: Icon, title, children, accent, defaultOpen = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(8,16,38,0.55)", borderColor: P.border }}
    >
      <details open={defaultOpen} className="group">
        <summary className="cursor-pointer list-none flex items-center gap-2 px-3 py-2.5 select-none" style={{ borderBottom: defaultOpen ? `1px solid ${P.faint}` : "none" }}>
          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent || P.text }} />
          <span className="font-inter text-[9px] uppercase tracking-widest font-bold flex-1" style={{ color: accent || P.text }}>{title}</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" style={{ color: P.dim }} />
        </summary>
        <div className="px-3 py-3 space-y-2.5">{children}</div>
      </details>
    </motion.div>
  );
}

function BoolLine({ label, present, note }) {
  return (
    <div className="flex items-start gap-2">
      <span className="font-malayalam text-[10px] uppercase tracking-wider flex-shrink-0 mt-0.5" style={{ color: P.dim }}>{label}</span>
      <span className="font-malayalam text-sm selectable" style={{ color: present ? "#34d399" : "rgba(255,255,255,0.45)" }} dir="auto">
        {present ? "ഉണ്ട്" : "ഇല്ല / പരിശോധിച്ചിട്ടില്ല"}{note ? ` — ${note}` : ""}
      </span>
    </div>
  );
}

function BenefitList({ items, authenticated }) {
  const arr = Array.isArray(items) ? items : [];
  if (arr.length === 0) return null;
  return (
    <div className="space-y-2">
      {arr.map((b, i) => (
        <div key={i} className="space-y-1.5 rounded-lg p-2.5" style={{ background: "rgba(212,175,55,0.05)", border: `1px solid ${P.faint}` }}>
          <p className="font-inter text-xs leading-relaxed selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{b.text}</p>
          {authenticated === false && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-inter text-[7px] uppercase tracking-widest font-bold" style={{ color: "#fbbf24", background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.30)" }}>
              <AlertTriangle className="w-2.5 h-2.5" /> Traditional / Historical · Not Authenticated as Islamic Teaching
            </span>
          )}
          {b.authenticated === true && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-inter text-[7px] uppercase tracking-widest font-bold" style={{ color: "#34d399", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.30)" }}>
              <ShieldCheck className="w-2.5 h-2.5" /> Authentic Islamic Source
            </span>
          )}
          {b.sources && b.sources.length > 0 && <SourcesList sources={b.sources} />}
        </div>
      ))}
    </div>
  );
}

const INVOCATION_CATS = [
  { id: "authentic_islamic_dhikr", label: "Authentic Islamic Dhikr", auth: true },
  { id: "quranic_supplication", label: "Qur'anic Supplications", auth: true },
  { id: "hadith_supplication", label: "Hadith Supplications", auth: true },
  { id: "classical_wazifa", label: "Classical Wazifa", auth: false },
  { id: "traditional_invocation", label: "Traditional Invocation", auth: false },
  { id: "vefk_practice", label: "Vefk Practice", auth: false },
  { id: "talismanic_formula", label: "Talismanic Formula", auth: false },
  { id: "occult_manuscript_practice", label: "Occult Manuscript Practice", auth: false },
  { id: "unknown_origin", label: "Unknown Origin", auth: false },
];

function InvocationCard({ inv }) {
  const auth = inv.authenticated === true || inv.evidence_level === "authenticated";
  return (
    <div className="space-y-2 rounded-lg p-3" style={{ background: auth ? "rgba(52,211,153,0.04)" : "rgba(251,191,36,0.04)", border: `1px solid ${auth ? "rgba(52,211,153,0.25)" : "rgba(251,191,36,0.25)"}` }}>
      {inv.text_ar && (
        <p className="font-amiri text-lg leading-loose selectable whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.92)" }} dir="rtl">{inv.text_ar}</p>
      )}
      {inv.text_harakat && inv.text_harakat !== inv.text_ar && (
        <p className="font-amiri text-base leading-loose selectable" style={{ color: P.text }} dir="rtl">{inv.text_harakat}</p>
      )}
      {inv.transliteration && <p className="font-inter text-xs italic selectable" style={{ color: "rgba(255,255,255,0.70)" }} dir="ltr">{inv.transliteration}</p>}
      {inv.translation_ml && <p className="font-malayalam text-sm leading-relaxed selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{inv.translation_ml}</p>}
      {inv.translation_en && <p className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.75)" }} dir="auto">{inv.translation_en}</p>}
      <div className="flex flex-wrap gap-1.5">
        <span className="font-inter text-[7px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded" style={{ color: auth ? "#34d399" : "#fbbf24", background: auth ? "rgba(52,211,153,0.10)" : "rgba(251,191,36,0.10)", border: `1px solid ${auth ? "rgba(52,211,153,0.30)" : "rgba(251,191,36,0.30)"}` }}>
          {auth ? "Authenticated" : "NOT AUTHENTICATED · Traditional Historical Practice Only"}
        </span>
        {inv.evidence_level && <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ color: P.dim, background: P.bg, border: `1px solid ${P.faint}` }}>Evidence: {inv.evidence_level}</span>}
      </div>
      {(inv.source_book || inv.author || inv.chapter || inv.page || inv.edition || inv.manuscript_ref || inv.publication || inv.url) && (
        <div className="space-y-0.5 pt-1 border-t text-[10px] font-inter selectable" style={{ borderColor: "rgba(212,175,55,0.12)", color: "rgba(255,255,255,0.65)" }}>
          {inv.source_book && <div>📚 {inv.source_book}{inv.author ? ` — ${inv.author}` : ""}</div>}
          {(inv.chapter || inv.page || inv.edition) && <div>{[inv.chapter && `Ch. ${inv.chapter}`, inv.page && `p. ${inv.page}`, inv.edition && `Ed. ${inv.edition}`].filter(Boolean).join(" · ")}</div>}
          {inv.manuscript_ref && <div>📜 Manuscript: {inv.manuscript_ref}</div>}
          {inv.publication && <div>🏫 {inv.publication}</div>}
          {inv.url && <a href={inv.url} target="_blank" rel="noreferrer" className="underline" style={{ color: P.dim }}>Source ↗</a>}
        </div>
      )}
      <div className="space-y-1 text-xs font-inter selectable" style={{ color: "rgba(255,255,255,0.80)" }}>
        {inv.purpose && <div><span style={{ color: P.dim }}>Purpose: </span>{inv.purpose}</div>}
        {inv.traditional_usage && <div><span style={{ color: P.dim }}>Traditional usage: </span>{inv.traditional_usage}</div>}
        {inv.historical_usage && <div><span style={{ color: P.dim }}>Historical usage: </span>{inv.historical_usage}</div>}
        {inv.conditions && <div><span style={{ color: P.dim }}>Conditions: </span>{inv.conditions}</div>}
        {inv.repetitions && <div><span style={{ color: P.dim }}>Repetitions: </span>{inv.repetitions}</div>}
        {inv.timing && <div><span style={{ color: P.dim }}>Timing: </span>{inv.timing}</div>}
        {inv.preparation && <div><span style={{ color: P.dim }}>Preparation: </span>{inv.preparation}</div>}
        {inv.warnings && <div><span style={{ color: "#fbbf24" }}>⚠ Warnings: </span><span>{inv.warnings}</span></div>}
        {inv.scholarly_opinions && <div><span style={{ color: P.dim }}>Scholarly opinions: </span>{inv.scholarly_opinions}</div>}
      </div>
    </div>
  );
}

export default function HolyNameResearchProfile({ originalStaticId }) {
  const [rec, setRec] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const nameId = `HNK-MHN-${originalStaticId}`;
    Promise.all([
      base44.entities.HolyNameKnowledge.filter({ name_id: nameId }, null, 1).then(r => (r && r[0]) || null).catch(() => null),
      base44.entities.HolyNameImportedSection.filter({ source_section: "section_a", source_name_key: String(originalStaticId) }, null, 500)
        .then(r => (r || []).filter(s => s.source_pdf_file))
        .catch(() => []),
    ]).then(([k, secs]) => {
      if (!alive) return;
      setRec(k);
      // group source PDFs
      const map = new Map();
      for (const s of secs) {
        const key = s.source_pdf_file;
        if (!map.has(key)) map.set(key, { file: key, url: s.source_pdf_url || "", pages: new Set() });
        if (s.source_pdf_page) map.get(key).pages.add(s.source_pdf_page);
      }
      setPdfs(Array.from(map.values()).map(g => ({ file: g.file, url: g.url, pageList: Array.from(g.pages).sort((a,b)=>a-b) })));
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [originalStaticId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3" style={{ borderTop: `1px solid ${P.faint}` }}>
        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: P.dim }} />
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>Loading scholarly research profile…</span>
      </div>
    );
  }

  if (!rec || rec.verification_status === "unverified") {
    return (
      <div className="mt-3 rounded-xl border p-3 flex items-start gap-2" style={{ background: "rgba(8,16,38,0.5)", borderColor: P.faint }}>
        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(148,163,184,0.7)" }} />
        <div className="space-y-0.5">
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(148,163,184,0.85)" }}>{NOT_VERIFIED}</p>
          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>This name's scholarly research profile has not been verified yet. Authoritative harakat, origin, meanings, and source-attributed knowledge will appear here once the verification pipeline reaches this name.</p>
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
    <div className="pt-3 mt-1 space-y-3" style={{ borderTop: `1px solid ${P.faint}` }}>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3.5 h-3.5" style={{ color: P.text }} />
        <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: P.text }}>Scholarly Research Profile</span>
      </div>

      {/* 1,28,29,30 — Verified spelling + verification meta */}
      <Section icon={ShieldCheck} title="1 · Verified Arabic Spelling & Harakat" accent={st.c}>
        <div className="text-center py-2 rounded-lg" style={{ background: P.bgHi, border: `1px solid ${P.borderHi}` }}>
          <p className="font-amiri text-[2.2rem] font-bold leading-[2.2] selectable" style={{ color: P.text, textShadow: "0 0 20px rgba(212,175,55,0.30)" }} dir="rtl">
            {rec.canonical_arabic || rec.fully_vowelized_name || rec.arabic_name}
          </p>
          {rec.canonical_arabic && rec.arabic_name && rec.canonical_arabic !== rec.arabic_name && (
            <p className="font-inter text-[8px] mt-1" style={{ color: P.dim }}>As printed in source: <span className="font-amiri text-sm" dir="rtl">{rec.arabic_name}</span></p>
          )}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-inter text-[8px] uppercase tracking-widest font-bold" style={{ color: st.c, background: `${st.c}1a`, border: `1px solid ${st.c}55` }}>
            <ShieldCheck className="w-3 h-3" /> {st.t}
          </span>
          <span className="font-inter text-[9px]" style={{ color: P.dim }}>Confidence: <b style={{ color: P.text }}>{rec.verification_confidence || 0}%</b></span>
          {rec.last_verified_date && (
            <span className="inline-flex items-center gap-1 font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              <Clock className="w-2.5 h-2.5" /> {new Date(rec.last_verified_date).toLocaleDateString()}
            </span>
          )}
          {rec.harakat_verified && (
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "#34d399" }}>Harakat Confirmed (≥2 sources)</span>
          )}
        </div>
        {rec.review_notes && <Row label="Reviewer Notes" value={rec.review_notes} />}
      </Section>

      {/* 2 — Alternative Harakat & accepted readings */}
      {Array.isArray(rec.alternative_readings) && rec.alternative_readings.length > 0 && (
        <Section icon={BookOpen} title="2 · Alternative Harakat & Accepted Readings">
          <div className="space-y-2">
            {rec.alternative_readings.map((a, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-amiri text-lg selectable" style={{ color: P.text }} dir="rtl">{a.arabic}</span>
                  {a.preferred && <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ color: P.text, background: P.bgHi, border: `1px solid ${P.border}` }}>Preferred</span>}
                  {a.reading_note && <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.60)" }}>{a.reading_note}</span>}
                </div>
                <SourcesList sources={a.sources} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Alternative spellings */}
      {Array.isArray(rec.alternative_spellings) && rec.alternative_spellings.length > 0 && (
        <Section icon={BookOpen} title="Alternative Spellings">
          <div className="space-y-1.5">
            {rec.alternative_spellings.map((a, i) => (
              <div key={i} className="space-y-1">
                <span className="font-amiri text-base selectable" style={{ color: P.text }} dir="rtl">{a.arabic}</span>
                {a.note && <span className="font-inter text-[9px] ml-2" style={{ color: "rgba(255,255,255,0.55)" }}>{a.note}</span>}
                <SourcesList sources={a.sources} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 3 — Original Script */}
      <Section icon={Languages} title="3 · Original Script" defaultOpen>
        <Row label="Original Source Word (Native Script)" value={rec.original_source_word} mono />
        <Row label="Language of Origin" value={`${originLabel} (${originML})`} />
        <Row label="Etymology" value={rec.etymology} />
      </Section>

      {/* 4 — Pronunciation */}
      <Section icon={Volume2} title="4 · Pronunciation">
        <Row label="Pronunciation Guide" value={rp.pronunciation_guide} />
        <Row label="Linguistic Explanation" value={rp.linguistic_explanation || ling.classical_explanation} />
      </Section>

      {/* 5,6,7,8 — Meanings */}
      <Section icon={BookOpen} title="5–8 · Meanings" defaultOpen>
        <Row label="Arabic Meaning" value={mean.arabic} mono />
        <Row label="Malayalam Meaning" value={mean.malayalam} ml />
        <Row label="English Meaning" value={mean.english} />
        <Row label="Original-Language Meaning" value={mean.original} />
        <Row label="Literal Meaning" value={rp.literal_meaning || ling.literal_meaning} />
        <Row label="Root Meaning" value={rp.root_meaning || ling.lexical_meaning} />
        {has(mean.symbolic) && <Row label="Symbolic Meaning (sourced)" value={mean.symbolic} />}
        {has(mean.historical) && <Row label="Historical Meaning" value={mean.historical} />}
        {has(mean.traditional) && <Row label="Traditional Meaning" value={mean.traditional} />}
      </Section>

      {/* 9,10,11,12 — Origin, Etymology, Historical Background, Earliest Occurrence */}
      <Section icon={ScrollText} title="9–12 · Origin, History & Earliest Occurrence">
        <Row label="Language of Origin" value={`${originLabel} (${originML})`} />
        <Row label="Etymology" value={rec.etymology} />
        <Row label="Historical Background" value={rp.historical_background} />
        <Row label="Earliest Known Occurrence" value={rp.earliest_occurrence} />
        <Row label="Related Historical Usage" value={rp.related_historical_usage} />
        {!has(rp.historical_background) && !has(rp.earliest_occurrence) && !has(rp.related_historical_usage) && (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>{NOT_FOUND}</p>
        )}
      </Section>

      {/* 13 — Relationship to 99 Names */}
      <Section icon={Link2} title="13 · Relationship to the 99 Beautiful Names of Allah" accent={relType === "none" ? "rgba(148,163,184,0.8)" : P.text}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 rounded-lg font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: relType === "none" ? "rgba(148,163,184,0.85)" : P.text, background: relType === "none" ? "rgba(148,163,184,0.10)" : P.bgHi, border: `1px solid ${relType === "none" ? "rgba(148,163,184,0.30)" : P.border}` }}>
            {REL_LABELS[relType] || relType}
          </span>
          {rel99.related_name_arabic && <span className="font-amiri text-base" style={{ color: P.text }} dir="rtl">{rel99.related_name_arabic}</span>}
          {rel99.related_name_id && <span className="font-inter text-[9px]" style={{ color: P.dim }}>({rel99.related_name_id})</span>}
        </div>
        <Row label="Evidence" value={rel99.evidence} />
        {relType === "none" && !has(rel99.evidence) && (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No authentic relationship to the 99 Names of Allah is known.</p>
        )}
        {rel99.sources && rel99.sources.length > 0 && <SourcesList sources={rel99.sources} />}
      </Section>

      {/* 14,15,16,17 — Authentic Islamic References */}
      <Section icon={Quote} title="14–17 · Authentic Islamic References">
        {has(ik.quran_verses) || has(ik.hadith_refs) || has(ik.tafsir_refs) || has(ik.scholarly_explanation) ? (
          <>
            {has(ik.quran_verses) && (
              <div className="space-y-1">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>15 · Qur'an References</p>
                {ik.quran_verses.map((q, i) => <p key={i} className="font-amiri text-sm leading-loose selectable" style={{ color: "rgba(255,255,255,0.88)" }} dir="rtl">{q}</p>)}
              </div>
            )}
            {has(ik.hadith_refs) && (
              <div className="space-y-1">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>16 · Hadith References</p>
                {ik.hadith_refs.map((h, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{h}</p>)}
              </div>
            )}
            {has(ik.tafsir_refs) && (
              <div className="space-y-1">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>17 · Classical Tafsir References</p>
                {ik.tafsir_refs.map((t, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{t}</p>)}
              </div>
            )}
            {has(ik.scholarly_explanation) && <Row label="Scholarly Explanation" value={ik.scholarly_explanation} />}
            {!has(ik.quran_verses) && !has(ik.hadith_refs) && !has(ik.tafsir_refs) && (
              <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>Not found in Qur'an or Hadith (common for foreign-origin names).</p>
            )}
          </>
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>Not found in verified primary Islamic sources.</p>
        )}
      </Section>

      {/* 18,19,20 — Classical / Academic / Manuscript references */}
      <Section icon={BookMarked} title="18–20 · Classical, Academic & Manuscript References" defaultOpen={false}>
        <div className="space-y-2">
          <div>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>18 · Classical Dictionary References</p>
            {has(rp.classical_dict_refs) ? rp.classical_dict_refs.map((r, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{r}</p>) : <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>}
          </div>
          <div>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>19 · Academic References</p>
            {has(rp.academic_refs) ? rp.academic_refs.map((r, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{r}</p>) : <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>}
          </div>
          <div>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>20 · Manuscript References</p>
            {has(rp.manuscript_refs) ? rp.manuscript_refs.map((r, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{r}</p>) : <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>}
          </div>
        </div>
      </Section>

      {/* 21 — Traditional / Occult, clearly labelled */}
      {((ben.traditional && ben.traditional.length > 0) || (ben.wafq && ben.wafq.length > 0) || (ben.amal && ben.amal.length > 0) || (ben.esoteric && ben.esoteric.length > 0) || (Array.isArray(rec.traditional_practices) && rec.traditional_practices.length > 0)) && (
        <Section icon={AlertTriangle} title="21 · Traditional / Occult References" accent="#fbbf24" defaultOpen={false}>
          <p className="font-inter text-[9px] italic" style={{ color: "rgba(251,191,36,0.75)" }}>Traditional / Historical · Not Authenticated as Islamic Teaching</p>
          {has(ben.traditional) && <BenefitList items={ben.traditional} authenticated={false} />}
          {has(ben.wafq) && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Wafq-related</p><BenefitList items={ben.wafq} authenticated={false} /></div>)}
          {has(ben.amal) && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Amal-related</p><BenefitList items={ben.amal} authenticated={false} /></div>)}
          {has(ben.esoteric) && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Esoteric Traditions</p><BenefitList items={ben.esoteric} authenticated={false} /></div>)}
          {Array.isArray(rec.traditional_practices) && rec.traditional_practices.length > 0 && (
            <div className="space-y-2">
              <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Traditional Practices</p>
              {rec.traditional_practices.map((tp, i) => (
                <div key={i} className="space-y-1 rounded-lg p-2.5" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.25)" }}>
                  {tp.text_ar && <p className="font-amiri text-sm selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="rtl">{tp.text_ar}</p>}
                  {tp.translation_en && <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>{tp.translation_en}</p>}
                  {tp.translation_ml && <p className="font-malayalam text-sm selectable" style={{ color: "rgba(255,255,255,0.80)" }} dir="auto">{tp.translation_ml}</p>}
                  {tp.source && <p className="font-inter text-[9px]" style={{ color: P.dim }}>Source: {tp.source}</p>}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-inter text-[7px] uppercase tracking-widest font-bold" style={{ color: "#fbbf24", background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.30)" }}>
                    <AlertTriangle className="w-2.5 h-2.5" /> Traditional Manuscript Reference (Not Authenticated)
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* 22,23 — Benefits */}
      <Section icon={Award} title="22–23 · Authentic & Traditional Benefits" defaultOpen={false}>
        {has(ben.authentic_islamic) ? (
          <>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>22 · Authentic Benefits (evidence-supported)</p>
            <BenefitList items={ben.authentic_islamic} authenticated={true} />
          </>
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No authentic Islamic virtues found in reliable sources.</p>
        )}
        {has(ben.linguistic) && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Linguistic Significance</p><BenefitList items={ben.linguistic} /></div>)}
        {has(ben.historical) && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Historical Significance</p><BenefitList items={ben.historical} /></div>)}
        {has(ben.traditional) && (
          <>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "#fbbf24" }}>23 · Traditional Benefits — Not Authenticated</p>
            <BenefitList items={ben.traditional} authenticated={false} />
          </>
        )}
      </Section>

      {/* Practices, Invocations & Manuscript Texts */}
      <Section icon={BookCopy} title={`Practices, Invocations & Manuscript Texts${Array.isArray(rec.invocations) && rec.invocations.length ? ` (${rec.invocations.length})` : ""}`} defaultOpen={false}>
        {Array.isArray(rec.invocations) && rec.invocations.length > 0 ? (
          <div className="space-y-3">
            {INVOCATION_CATS.map(cat => {
              const items = rec.invocations.filter(iv => iv.category === cat.id);
              if (items.length === 0) return null;
              return (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.auth ? "#34d399" : "#fbbf24" }} />
                    <span className="font-inter text-[8px] uppercase tracking-widest font-bold" style={{ color: cat.auth ? "#34d399" : "#fbbf24" }}>{cat.label} ({items.length})</span>
                  </div>
                  {items.map((iv, i) => <InvocationCard key={i} inv={iv} />)}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No historically documented invocation was found.</p>
        )}
      </Section>

      {/* 24,25,26 — Related Names, Similar Names, Related Root Words */}
      <Section icon={Network} title="24–26 · Related Names, Similar Names & Root Words" defaultOpen={false}>
        <Row label="24 · Related Names" value={ling.related_names} />
        <Row label="25 · Similar Names — Distinctions" value={ling.difference_from_similar} />
        <Row label="26 · Related Root Words" value={ling.arabic_root} mono />
        <Row label="Root Letters" value={ling.root_letters || rp.root_letters} mono />
        <Row label="Morphological Pattern" value={ling.morphological_pattern || rp.morphological_pattern} />
      </Section>

      {/* 27 — Source PDFs */}
      <Section icon={BookCopy} title={`27 · Source PDFs${pdfs.length ? ` (${pdfs.length})` : ""}`} defaultOpen={false}>
        {pdfs.length === 0 ? (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No imported PDF paragraphs linked to this name yet.</p>
        ) : (
          <div className="space-y-1.5">
            {pdfs.map((p, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background: "rgba(212,175,55,0.05)", border: `1px solid ${P.faint}` }}>
                <FileText className="w-3 h-3 flex-shrink-0" style={{ color: P.dim }} />
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="font-inter text-xs truncate flex-1 underline" style={{ color: P.text }}>{p.file}</a>
                ) : (
                  <span className="font-inter text-xs truncate flex-1" style={{ color: "rgba(255,255,255,0.75)" }}>{p.file}</span>
                )}
                <span className="font-inter text-[9px] flex-shrink-0" style={{ color: P.dim }}>
                  {p.pageList.length} page{p.pageList.length > 1 ? "s" : ""}: {p.pageList[0]}{p.pageList.length > 1 ? `–${p.pageList[p.pageList.length-1]}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 28,29,30 — Verification + every source */}
      <Section icon={ShieldCheck} title="28–30 · Verification & All Sources" defaultOpen={false} accent={st.c}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: st.c, background: `${st.c}1a`, border: `1px solid ${st.c}55` }}>
            {st.t}
          </span>
          <span className="font-inter text-[9px]" style={{ color: P.dim }}>Confidence: <b style={{ color: P.text }}>{rec.verification_confidence || 0}%</b></span>
          {rec.last_verified_date && <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>· {new Date(rec.last_verified_date).toLocaleDateString()}</span>}
        </div>
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>30 · Every Source Consulted</p>
          {has(rec.verification_sources) ? <SourcesList sources={rec.verification_sources} /> : <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>}
        </div>
      </Section>

      {/* Malayalam Explanation — comprehensive narrative using available data */}
      <Section icon={Languages} title="മലയാളം · വിശദീകരണം (Malayalam Explanation)" accent="#60a5fa" defaultOpen>
        <div className="space-y-2.5 rounded-lg p-3" style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.20)" }}>
          <Row label="അർത്ഥം (Meaning)" value={mean.malayalam} ml />
          <div className="space-y-1">
            <p className="font-malayalam text-[10px] uppercase tracking-wider" style={{ color: P.dim }}>ഭാഷ (Language)</p>
            <p className="font-malayalam text-sm selectable" style={{ color: "rgba(255,255,255,0.88)" }} dir="auto">{originML}{has(rec.etymology) ? ` — ${rec.etymology}` : ""}</p>
          </div>
          <div className="space-y-1">
            <p className="font-malayalam text-[10px] uppercase tracking-wider" style={{ color: P.dim }}>99 നാമങ്ങളുമായി ബന്ധം</p>
            <p className="font-malayalam text-sm selectable" style={{ color: relType === "none" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.88)" }} dir="auto">
              {relType === "none" ? "അല്ലാഹുവിന്റെ 99 നാമങ്ങളുമായി ആധികാരിക ബന്ധമൊന്നുമില്ല." : `${REL_LABELS[relType] || relType}${has(rel99.related_name_arabic) ? ` — ${rel99.related_name_arabic}` : ""}`}
            </p>
            {has(rel99.evidence) && <p className="font-malayalam text-sm selectable" style={{ color: "rgba(255,255,255,0.70)" }} dir="auto">{rel99.evidence}</p>}
          </div>
          <BoolLine label="ഖുർആനിൽ" present={has(ik.quran_verses)} />
          {has(ik.quran_verses) && ik.quran_verses.map((q, i) => <p key={i} className="font-amiri text-sm leading-loose selectable" style={{ color: "rgba(255,255,255,0.80)" }} dir="rtl">{q}</p>)}
          <BoolLine label="ഹദീസിൽ" present={has(ik.hadith_refs)} />
          <BoolLine label="ക്ലാസിക്ക് അറബി സാഹിത്യത്തിൽ" present={has(rp.classical_dict_refs) || has(ling.classical_explanation)} />
          <div className="space-y-1">
            <p className="font-malayalam text-[10px] uppercase tracking-wider" style={{ color: P.dim }}>ആദ്യത്തെ പരാമർശം / ചരിത്രം</p>
            {has(rp.earliest_occurrence) || has(rp.historical_background) ? (
              <>
                {has(rp.earliest_occurrence) && <p className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.80)" }} dir="auto">{rp.earliest_occurrence}</p>}
                {has(rp.historical_background) && <p className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.70)" }} dir="auto">{rp.historical_background}</p>}
              </>
            ) : <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_FOUND}</p>}
          </div>
          <div className="space-y-1">
            <p className="font-malayalam text-[10px] uppercase tracking-wider" style={{ color: "#34d399" }}>പ്രാമാണിക ഗുണങ്ങൾ</p>
            {has(ben.authentic_islamic) ? ben.authentic_islamic.map((b, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{b.text}</p>) : <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>ആധികാരിക സ്രോതസ്സുകളിൽ ഗുണങ്ങൾ രേഖപ്പെടുത്തിയിട്ടില്ല.</p>}
          </div>
          <div className="space-y-1">
            <p className="font-malayalam text-[10px] uppercase tracking-wider" style={{ color: "#fbbf24" }}>പാരമ്പര്യ വിശ്വാസങ്ങൾ</p>
            {has(ben.traditional) ? ben.traditional.map((b, i) => (
              <div key={i} className="space-y-0.5">
                <p className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.80)" }} dir="auto">{b.text}</p>
                <span className="font-malayalam text-[10px] italic" style={{ color: "rgba(251,191,36,0.75)" }}>പ്രാമാണികമല്ല — പരിശോധിച്ചു സ്ഥിരീകരിച്ചിട്ടില്ല</span>
              </div>
            )) : <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>രേഖപ്പെടുത്തിയിട്ടില്ല.</p>}
          </div>
          <div className="space-y-1 pt-1 border-t" style={{ borderColor: "rgba(96,165,250,0.15)" }}>
            <p className="font-malayalam text-[10px] uppercase tracking-wider" style={{ color: P.dim }}>പരിശോധന നില</p>
            <p className="font-malayalam text-sm selectable" style={{ color: st.c } } dir="auto">{st.ml} — {rec.verification_confidence || 0}%</p>
          </div>
        </div>
      </Section>
    </div>
  );
}