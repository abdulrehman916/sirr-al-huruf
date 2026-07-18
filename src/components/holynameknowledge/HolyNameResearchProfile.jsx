import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, ShieldAlert, BookOpen, Languages, ScrollText, Sparkles,
  Link2, BookMarked, GraduationCap, FileText, Quote, Award, AlertTriangle, Clock,
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
  verified: { t: "Verified", c: "#34d399" },
  needs_review: { t: "Needs Review", c: "#fbbf24" },
  conflicting_sources: { t: "Conflicting Sources", c: "#fb923c" },
  not_in_classical_sources: { t: "Not in Classical Sources", c: "#94a3b8" },
  unverified: { t: "Not Verified", c: "#64748b" },
};
const ORIGIN_LABELS = {
  hebrew: "Hebrew", syriac: "Syriac", aramaic: "Aramaic", arabic: "Arabic",
  persian: "Persian", mixed: "Mixed", unknown: "Unknown",
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

function Row({ label, value, dir, mono }) {
  const empty = !value || (typeof value === "string" && !value.trim());
  return (
    <div className="space-y-1">
      <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>{label}</p>
      {empty ? (
        <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.30)" }}>{NOT_VERIFIED}</p>
      ) : (
        <p
          className={mono ? "font-amiri text-base leading-loose selectable" : "font-inter text-sm leading-relaxed selectable"}
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
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-inter text-[8px] leading-tight" style={{ background: "rgba(8,16,38,0.6)", borderColor: P.border, color: "rgba(255,255,255,0.72)" }}>
      <BookMarked className="w-2.5 h-2.5 flex-shrink-0" style={{ color: P.dim }} />
      <span className="font-semibold" style={{ color: P.text }}>{s.title}</span>
      {s.author && <span>· {s.author}</span>}
      {s.page && <span>· p.{s.page}</span>}
      {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="underline" style={{ color: P.dim }}>↗</a>}
      {s.reliability_score ? <span style={{ color: "rgba(212,175,55,0.45)" }}>· {s.reliability_score}%</span> : null}
    </span>
  );
}

function SourcesList({ sources }) {
  const arr = Array.isArray(sources) ? sources : [];
  if (arr.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {arr.map((s, i) => <SourceChip key={i} s={s} />)}
    </div>
  );
}

function Section({ icon: Icon, title, children, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border p-3 space-y-2.5"
      style={{ background: "rgba(8,16,38,0.55)", borderColor: P.border }}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" style={{ color: accent || P.text }} />
        <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: accent || P.text }}>{title}</span>
      </div>
      {children}
    </motion.div>
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

export default function HolyNameResearchProfile({ originalStaticId }) {
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const nameId = `HNK-MHN-${originalStaticId}`;
    base44.entities.HolyNameKnowledge
      .filter({ name_id: nameId }, null, 1)
      .then((r) => { if (alive) setRec((r && r[0]) || null); })
      .catch(() => { if (alive) setRec(null); })
      .finally(() => { if (alive) setLoading(false); });
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

  // Not yet audited by the enrichment pipeline
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
  const hasIslamic = ik.quran_verses || ik.hadith_refs || ik.tafsir_refs || ik.scholarly_explanation;

  return (
    <div className="pt-3 mt-1 space-y-3" style={{ borderTop: `1px solid ${P.faint}` }}>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3.5 h-3.5" style={{ color: P.text }} />
        <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: P.text }}>Scholarly Research Profile</span>
      </div>

      {/* 1,24,25,26 — Verified spelling + verification meta */}
      <Section icon={ShieldCheck} title="Verified Spelling & Harakat" accent={st.c}>
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
      </Section>

      {/* 2 — Alternative vocalizations */}
      {Array.isArray(rec.alternative_readings) && rec.alternative_readings.length > 0 && (
        <Section icon={BookOpen} title="Alternative Accepted Vocalizations">
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

      {/* 7,8, primary source discovery — Origin & Etymology */}
      <Section icon={Languages} title="Origin & Etymology">
        <Row label="Language of Origin" value={ORIGIN_LABELS[rec.name_origin] || rec.name_origin} />
        <Row label="Original Source Word" value={rec.original_source_word} mono />
        <Row label="Etymology" value={rec.etymology} />
        {rp.earliest_occurrence && <Row label="Earliest Known Occurrence" value={rp.earliest_occurrence} />}
        {rp.related_historical_usage && <Row label="Related Historical Usage" value={rp.related_historical_usage} />}
      </Section>

      {/* 3,4,5,6 — Meanings */}
      <Section icon={BookOpen} title="Meanings">
        <Row label="Arabic Meaning" value={mean.arabic} />
        <Row label="Malayalam Meaning" value={mean.malayalam} dir="auto" />
        <Row label="English Meaning" value={mean.english} />
        <Row label="Original-Language Meaning" value={mean.original} />
        <Row label="Literal Meaning" value={rp.literal_meaning || ling.literal_meaning} />
        <Row label="Root Meaning" value={rp.root_meaning || ling.lexical_meaning} />
        {mean.symbolic && <Row label="Symbolic Meaning (sourced)" value={mean.symbolic} />}
        {mean.historical && <Row label="Historical Meaning" value={mean.historical} />}
        {mean.traditional && <Row label="Traditional Meaning" value={mean.traditional} />}
      </Section>

      {/* 9 — Pronunciation */}
      <Section icon={ScrollText} title="Pronunciation & Linguistics">
        <Row label="Pronunciation Guide" value={rp.pronunciation_guide} />
        <Row label="Linguistic Explanation" value={rp.linguistic_explanation || ling.classical_explanation} />
        <Row label="Root Letters" value={rp.root_letters || ling.root_letters} mono />
        <Row label="Arabic Root" value={rp.arabic_root || ling.arabic_root} mono />
        <Row label="Morphological Pattern" value={rp.morphological_pattern || ling.morphological_pattern} />
        {ling.grammar_notes && <Row label="Grammar Notes" value={ling.grammar_notes} />}
      </Section>

      {/* 10,11,12 — Relationship to 99 Names */}
      <Section icon={Link2} title="Relationship to the 99 Names of Allah" accent={relType === "none" ? "rgba(148,163,184,0.8)" : P.text}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 rounded-lg font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: relType === "none" ? "rgba(148,163,184,0.85)" : P.text, background: relType === "none" ? "rgba(148,163,184,0.10)" : P.bgHi, border: `1px solid ${relType === "none" ? "rgba(148,163,184,0.30)" : P.border}` }}>
            {REL_LABELS[relType] || relType}
          </span>
          {rel99.related_name_arabic && <span className="font-amiri text-base" style={{ color: P.text }} dir="rtl">{rel99.related_name_arabic}</span>}
          {rel99.related_name_id && <span className="font-inter text-[9px]" style={{ color: P.dim }}>({rel99.related_name_id})</span>}
        </div>
        <Row label="Evidence" value={rel99.evidence} />
        {relType === "none" && !rel99.evidence && (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No authentic relationship to the 99 Names of Allah is known.</p>
        )}
        {rel99.sources && rel99.sources.length > 0 && <SourcesList sources={rel99.sources} />}
      </Section>

      {/* 13,14,15 — Islamic knowledge */}
      <Section icon={Quote} title="Qur'anic, Hadith & Tafsir References">
        {hasIslamic ? (
          <>
            {ik.quran_verses && ik.quran_verses.length > 0 && (
              <div className="space-y-1">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Qur'anic References</p>
                {(Array.isArray(ik.quran_verses) ? ik.quran_verses : []).map((q, i) => (
                  <p key={i} className="font-amiri text-sm leading-loose selectable" style={{ color: "rgba(255,255,255,0.88)" }} dir="rtl">{q}</p>
                ))}
              </div>
            )}
            {ik.hadith_refs && ik.hadith_refs.length > 0 && (
              <div className="space-y-1">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Hadith References</p>
                {(Array.isArray(ik.hadith_refs) ? ik.hadith_refs : []).map((h, i) => (
                  <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{h}</p>
                ))}
              </div>
            )}
            {ik.tafsir_refs && ik.tafsir_refs.length > 0 && (
              <div className="space-y-1">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Classical Tafsir References</p>
                {(Array.isArray(ik.tafsir_refs) ? ik.tafsir_refs : []).map((t, i) => (
                  <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{t}</p>
                ))}
              </div>
            )}
            {ik.scholarly_explanation && <Row label="Scholarly Explanation" value={ik.scholarly_explanation} />}
          </>
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>{NOT_FOUND}</p>
        )}
      </Section>

      {/* 16,17,18,19 — Primary source discovery: references */}
      <Section icon={BookMarked} title="Primary Source Discovery">
        {rp.historical_background && <Row label="Historical Background" value={rp.historical_background} />}
        {rp.classical_dict_refs && rp.classical_dict_refs.length > 0 && (
          <div className="space-y-1">
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Classical Arabic Lexicon References</p>
            {rp.classical_dict_refs.map((r, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{r}</p>)}
          </div>
        )}
        {rp.academic_refs && rp.academic_refs.length > 0 && (
          <div className="space-y-1">
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Academic References</p>
            {rp.academic_refs.map((r, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{r}</p>)}
          </div>
        )}
        {rp.manuscript_refs && rp.manuscript_refs.length > 0 && (
          <div className="space-y-1">
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Manuscript References</p>
            {rp.manuscript_refs.map((r, i) => <p key={i} className="font-inter text-xs selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto">{r}</p>)}
          </div>
        )}
        {!rp.historical_background && !(rp.classical_dict_refs && rp.classical_dict_refs.length) && !(rp.academic_refs && rp.academic_refs.length) && !(rp.manuscript_refs && rp.manuscript_refs.length) && (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>{NOT_FOUND}</p>
        )}
      </Section>

      {/* 21,22 — Benefits */}
      <Section icon={Award} title="Virtues & Benefits (Source-Supported)">
        {ben.authentic_islamic && ben.authentic_islamic.length > 0 ? (
          <BenefitList items={ben.authentic_islamic} authenticated={true} />
        ) : (
          <p className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.40)" }}>No authentic Islamic virtues found in reliable sources.</p>
        )}
        {ben.linguistic && ben.linguistic.length > 0 && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Linguistic Significance</p><BenefitList items={ben.linguistic} /></div>)}
        {ben.historical && ben.historical.length > 0 && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Historical Significance</p><BenefitList items={ben.historical} /></div>)}
      </Section>

      {/* 20 — Traditional / occult, clearly labelled */}
      {((ben.traditional && ben.traditional.length > 0) || (ben.wafq && ben.wafq.length > 0) || (ben.amal && ben.amal.length > 0) || (ben.esoteric && ben.esoteric.length > 0) || (Array.isArray(rec.traditional_practices) && rec.traditional_practices.length > 0)) && (
        <Section icon={AlertTriangle} title="Traditional / Occult References" accent="#fbbf24">
          <p className="font-inter text-[9px] italic" style={{ color: "rgba(251,191,36,0.75)" }}>Traditional / Historical · Not Authenticated as Islamic Teaching</p>
          {ben.traditional && ben.traditional.length > 0 && <BenefitList items={ben.traditional} authenticated={false} />}
          {ben.wafq && ben.wafq.length > 0 && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Wafq-related</p><BenefitList items={ben.wafq} authenticated={false} /></div>)}
          {ben.amal && ben.amal.length > 0 && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Amal-related</p><BenefitList items={ben.amal} authenticated={false} /></div>)}
          {ben.esoteric && ben.esoteric.length > 0 && (<div className="space-y-1"><p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Esoteric Traditions</p><BenefitList items={ben.esoteric} authenticated={false} /></div>)}
          {Array.isArray(rec.traditional_practices) && rec.traditional_practices.length > 0 && (
            <div className="space-y-2">
              <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>Traditional Practices</p>
              {rec.traditional_practices.map((tp, i) => (
                <div key={i} className="space-y-1 rounded-lg p-2.5" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.25)" }}>
                  <p className="font-amiri text-sm selectable" style={{ color: "rgba(255,255,255,0.85)" }} dir="rtl">{tp.text_ar}</p>
                  {tp.translation_en && <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>{tp.translation_en}</p>}
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

      {/* 27 — Every source */}
      {Array.isArray(rec.verification_sources) && rec.verification_sources.length > 0 && (
        <Section icon={FileText} title={`All Sources Consulted (${rec.verification_sources.length})`}>
          <SourcesList sources={rec.verification_sources} />
        </Section>
      )}
    </div>
  );
}