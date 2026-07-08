// ═══════════════════════════════════════════════════════════════
// PURPOSE INTERPRETATION CARD — Master purpose resolver
// ═══════════════════════════════════════════════════════════════
// Sits directly below the Custom Purpose textbox (Mizaan 7).
// Resolves the Arabic purpose phrase using ONLY:
//   1. Purpose Dictionary (lookupPurposeIntent)
//   2. Selected Purpose Card (action detection)
//   3. Manuscript knowledge (via dictionary source)
//
// Displays: Original Arabic → Detected Action → Main Purpose →
// Modifier → Final Meaning (selected language).
//
// This Final Meaning is the MASTER PURPOSE — the Ritual Timing
// engine reads the same dictionary result (not the raw Arabic).
//
// Read-only. Never modifies any Mizan, calculation, or engine.
// Full language parity: Malayalam or English, never mixed.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowDown, Loader2 } from "lucide-react";
import { lookupPurposeIntent } from "../../lib/purposeDictionaryLookup";
import {
  detectAction, extractMiddleWord, ACTION_MEANINGS, ENDING_MEANING,
  CARD_TO_ACTION, buildRitualSemanticPhrase,
} from "../../lib/ritualSemanticPhrase";
import { useRitualLang, RITUAL_LANGS } from "../../lib/ritualTimingI18n";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
};

// Normalize Arabic (strip harakat + tatweel) — mirrors ritualSemanticPhrase
function normalizeArabic(text) {
  return String(text || "")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .trim();
}

// Detect modifier (طرفة العين) from normalized text
function detectModifier(text) {
  const norm = normalizeArabic(text);
  if (norm.includes("طرفة") || norm.includes("طرفه")) return "طرفة العين";
  return null;
}

export default function PurposeInterpretationCard({ customPurpose, selections }) {
  const [lang, setLang] = useRitualLang();
  const [purposeLookup, setPurposeLookup] = useState({ matched: false });
  const [loading, setLoading] = useState(false);

  // ── Detect action, middle word, modifier (synchronous, from text) ──
  const detected = useMemo(() => {
    const custom = (customPurpose || "").trim();
    if (!custom) return null;

    let actionArabic = null;
    const cardKey = Array.isArray(selections?.purposes) && selections.purposes.length > 0
      ? selections.purposes[0] : null;
    if (cardKey && CARD_TO_ACTION[cardKey]) actionArabic = CARD_TO_ACTION[cardKey];
    if (!actionArabic) actionArabic = detectAction(custom);

    const middleWord = extractMiddleWord(custom, actionArabic);
    const modifierArabic = detectModifier(custom);

    return { actionArabic, middleWord, modifierArabic, cardKey };
  }, [customPurpose, selections]);

  // ── Purpose Dictionary lookup (async) ──
  useEffect(() => {
    if (!detected) { setPurposeLookup({ matched: false }); return; }
    setLoading(true);
    let cancelled = false;
    lookupPurposeIntent((customPurpose || "").trim(), detected.cardKey).then((res) => {
      if (cancelled) return;
      setPurposeLookup(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [detected, customPurpose]);

  // ── Build interpretation for display (language-aware) ──
  const interp = useMemo(() => {
    if (!detected || !(customPurpose || "").trim()) return null;

    const purposeMeaning = purposeLookup?.matched
      ? (lang === "ml"
          ? (purposeLookup.malayalam_meaning || purposeLookup.english_meaning || "")
          : (purposeLookup.english_meaning || purposeLookup.malayalam_meaning || ""))
      : "";

    const actionMeaning = detected.actionArabic
      ? (lang === "ml" ? ACTION_MEANINGS[detected.actionArabic]?.ml : ACTION_MEANINGS[detected.actionArabic]?.en)
      : null;

    const modifierMeaning = detected.modifierArabic
      ? (lang === "ml" ? ENDING_MEANING.ml : ENDING_MEANING.en)
      : null;

    const finalMeaning = buildRitualSemanticPhrase({
      selections, customPurpose, purposeLookup, lang,
    });

    return {
      originalArabic: (customPurpose || "").trim(),
      actionArabic: detected.actionArabic,
      actionMeaning,
      mainPurposeArabic: detected.middleWord || (purposeLookup?.matchedPhrase || ""),
      mainPurposeMeaning: purposeMeaning,
      mainPurposeMatched: purposeLookup?.matched || false,
      mainPurposeSource: purposeLookup?.source || null,
      modifierArabic: detected.modifierArabic,
      modifierMeaning,
      finalMeaning,
      autoLearned: purposeLookup?.auto_learned || false,
    };
  }, [detected, purposeLookup, customPurpose, lang]);

  // ── Labels (full language parity) ──
  const L = lang === "ml" ? {
    title: "ലക്ഷ്യ വ്യാഖ്യാനം",
    original: "യഥാർത്ഥ അറബിക് വാചകം",
    action: "കർമ്മം",
    mainPurpose: "പ്രധാന ലക്ഷ്യം",
    modifier: "പരിഷ്കർത്തകൻ",
    finalMeaning: "അന്തിമ അർത്ഥം",
    notDetected: "കണ്ടെത്തിയില്ല",
    noMatch: "നിഘണ്ടുവിൽ ഇല്ല",
    dictSource: "ഉറവിടം",
    notAvailable: "പ്രോജക്റ്റ് പർപ്പസ് ഡിക്ഷനറിയിൽ ഈ ലക്ഷ്യം കണ്ടെത്തിയില്ല.",
    loading: "വ്യാഖ്യാനിക്കുന്നു...",
    autoLearned: "സ്വയം പഠിച്ചു — പരിശോധന ആവശ്യം",
  } : {
    title: "Purpose Interpretation",
    original: "Original Arabic Text",
    action: "Detected Action",
    mainPurpose: "Detected Main Purpose",
    modifier: "Detected Modifier",
    finalMeaning: "Final Meaning",
    notDetected: "Not detected",
    noMatch: "Not in dictionary",
    dictSource: "Source",
    notAvailable: "Purpose not found in the Project Purpose Dictionary.",
    loading: "Interpreting...",
    autoLearned: "Auto-Generated — Needs Review",
  };

  if (!interp) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: "0 0 24px rgba(212,175,55,0.12)",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between p-3" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: G.text }} />
          <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {L.title}
          </span>
          {interp.autoLearned && (
            <span className="font-inter text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-full ml-2"
              style={{ color: "#FBBF24", border: "1px solid rgba(251,191,36,0.50)", background: "rgba(251,191,36,0.10)" }}>
              {L.autoLearned}
            </span>
          )}
        </div>
        {/* Language toggle */}
        <div className="flex items-center gap-1">
          {RITUAL_LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="px-2 py-0.5 rounded-md font-inter text-[10px] font-bold transition"
              style={{
                background: lang === l.code ? "rgba(212,175,55,0.18)" : "transparent",
                border: `1px solid ${lang === l.code ? G.borderHi : G.border}`,
                color: lang === l.code ? G.text : "rgba(255,255,255,0.45)",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-3 space-y-2.5">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-1">
            <Loader2 className="w-3 h-3 animate-spin" style={{ color: G.dim }} />
            <span className="font-inter text-[10px]" style={{ color: G.dim }}>{L.loading}</span>
          </div>
        )}

        {/* Original Arabic */}
        <Row label={L.original}>
          <p className="font-amiri text-base text-right leading-relaxed" style={{ color: "#fff" }} dir="rtl">
            {interp.originalArabic}
          </p>
        </Row>

        {/* Detected Action */}
        <Row label={L.action}>
          {interp.actionArabic ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-amiri text-base" style={{ color: G.text }} dir="rtl">
                {interp.actionArabic}
              </span>
              {interp.actionMeaning && (
                <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  = {interp.actionMeaning}
                </span>
              )}
            </div>
          ) : (
            <span className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.35)" }}>
              {L.notDetected}
            </span>
          )}
        </Row>

        {/* Detected Main Purpose */}
        <Row label={L.mainPurpose}>
          {interp.mainPurposeArabic ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-amiri text-base" style={{ color: G.text }} dir="rtl">
                {interp.mainPurposeArabic}
              </span>
              {interp.mainPurposeMeaning && (
                <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  = {interp.mainPurposeMeaning}
                </span>
              )}
              {interp.mainPurposeMatched && interp.mainPurposeSource && (
                <span className="font-inter text-[9px] italic" style={{ color: "rgba(212,175,55,0.45)" }}>
                  ({L.dictSource}: {interp.mainPurposeSource})
                </span>
              )}
              {!interp.mainPurposeMatched && (
                <span className="font-inter text-[9px] italic" style={{ color: "rgba(248,113,113,0.60)" }}>
                  ({L.noMatch})
                </span>
              )}
            </div>
          ) : (
            <span className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.35)" }}>
              {L.notDetected}
            </span>
          )}
        </Row>

        {/* Detected Modifier */}
        <Row label={L.modifier}>
          {interp.modifierArabic ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-amiri text-base" style={{ color: G.text }} dir="rtl">
                {interp.modifierArabic}
              </span>
              <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                = {interp.modifierMeaning}
              </span>
            </div>
          ) : (
            <span className="font-inter text-xs italic" style={{ color: "rgba(255,255,255,0.35)" }}>
              {L.notDetected}
            </span>
          )}
        </Row>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 py-1">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.border})` }} />
          <ArrowDown className="w-3 h-3" style={{ color: G.dim }} />
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.border})` }} />
        </div>

        {/* Final Meaning — MASTER PURPOSE */}
        <div className="rounded-lg p-3" style={{
          background: "rgba(212,175,55,0.10)",
          border: `1px solid ${G.borderHi}`,
        }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {L.finalMeaning}
          </p>
          {interp.finalMeaning ? (
            <p className="font-inter text-sm font-bold" style={{ color: G.text }}>
              {interp.finalMeaning}
            </p>
          ) : (
            <p className="font-inter text-xs italic" style={{ color: "rgba(248,113,113,0.55)" }}>
              {L.notAvailable}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Single interpretation row ──
function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
        {label}
      </p>
      {children}
    </div>
  );
}