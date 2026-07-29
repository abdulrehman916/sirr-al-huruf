// ═══════════════════════════════════════════════════════════════
// INTELLIGENT TODAY DASHBOARD — PRIMARY LIVE DECISION ENGINE
// One-glance synthesis of every manuscript layer. The detailed cards
// below remain as reference/evidence only.
//
// DATA RULE: reads only from useAstroData + astroClockDecisionEngine.
//   No manuscript information is invented; every line is traceable to
//   Havâss / Kashf (see per-item source chips).
// LANGUAGE RULE: one language per item; Arabic shows Arabic where the
//   manuscript provides it, otherwise hides untranslated lists (no leak).
// ═══════════════════════════════════════════════════════════════
import { useAstroData, DAY_AR, PLANET_AR } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { computeAstroDecision } from "@/lib/astroClockDecisionEngine";
import { MiniCard } from "./DashboardSection";
import { planetArabicMLDisplay } from "@/lib/astroClockLabelMap";
import { Sparkles, CheckCircle2, Ban, Crosshair, Layers, Clock, BookOpen } from "lucide-react";

const FRIEND_LABEL = {
  friend:  { en: "Compatible", ml: "അനുയോജ്യം", ar: "متوافق", color: "#4ADE80", sym: "✓" },
  neutral: { en: "Neutral", ml: "നിഷ്പക്ഷം", ar: "محايد", color: "#FBBF24", sym: "≈" },
  enemy:   { en: "Conflicting", ml: "പൊരുത്തമില്ലാത്തത്", ar: "متضارب", color: "#F87171", sym: "✗" },
};

function strengthFromScore(score) {
  if (score == null) return { key: "info", color: "rgba(255,255,255,0.50)", sym: "•" };
  if (score >= 2) return { key: "very_strong", color: "#4ADE80", sym: "✓" };
  if (score === 1) return { key: "strong", color: "#86EFAC", sym: "✓" };
  if (score === 0) return { key: "moderate", color: "#FBBF24", sym: "≈" };
  if (score === -1) return { key: "weak", color: "#FB923C", sym: "!" };
  return { key: "avoid", color: "#F87171", sym: "✗" };
}

const STRENGTH_LABEL = {
  very_strong: { en: "Very Strong", ml: "വളരെ ശക്തം", ar: "قوي جداً" },
  strong:      { en: "Strong", ml: "ശക്തം", ar: "قوي" },
  moderate:    { en: "Moderate", ml: "മിതം", ar: "معتدل" },
  weak:        { en: "Weak", ml: "ദുർബലം", ar: "ضعيف" },
  avoid:       { en: "Avoid", ml: "ഒഴിവാക്കുക", ar: "تجنب" },
  info:        { en: "Info", ml: "വിവരം", ar: "إعلام" },
};

function SourceChip({ src, language, isOwner }) {
  if (!src || !isOwner) return null;
  return (
    <span className="font-inter text-[8px] leading-tight" style={{ color: "rgba(129,140,248,0.45)" }}>
      📖 {src}
    </span>
  );
}

function OpList({ items, language, isOwner, color }) {
  if (!items || items.length === 0) {
    return <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>—</p>;
  }
  // Arabic mode: only show items that carry an Arabic manuscript label
  // (Kashf operations). Havâss lists have no approved Arabic — hide to avoid leak.
  const filtered = language === "ar"
    ? items.filter(it => it.ar)
    : items;
  if (filtered.length === 0) {
    return <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>—</p>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {filtered.map((it, i) => (
        <span key={i} className="font-inter text-[10px] px-1.5 py-0.5 rounded inline-flex flex-col"
          style={{ background: `${color}10`, color: `${color}cc`, border: `1px solid ${color}25` }}>
          <span dir={language === "ar" ? "rtl" : "auto"}>
            {language === "ar" ? it.ar : (language === "ml" ? (it.ml || it.en) : it.en)}
          </span>
          {isOwner && <SourceChip src={it.source} language={language} isOwner={isOwner} />}
        </span>
      ))}
    </div>
  );
}

export default function IntelligentDashboard() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  if (!d.currentHour) return null;

  const dec = computeAstroDecision(d);
  if (!dec) return null;

  // ── Compact context strip (Day / Layl-Nahar / Saat / Kawkab) ──
  const dayName = language === "ar" ? DAY_AR[d.activeDayIndex]
    : language === "ml" ? d.dayInfo?.name_ml : d.dayInfo?.name_en;
  const planetName = language === "ar" ? (PLANET_AR[d.currentHour.planet] || d.currentHour.planet)
    : language === "ml" ? (planetArabicMLDisplay(d.currentHour.planet) || d.currentHour.planet)
    : d.planetInfo?.[d.currentHour.planet]?.name_en || d.currentHour.planet;

  const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)" };
  const friend = FRIEND_LABEL[dec.friend] || FRIEND_LABEL.neutral;

  return (
    <div className="space-y-3">
      {/* ══ 0 · Context strip ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <MiniCard icon="📅" label={txt("ദിവസം", "Day", "يوم")} value={dayName} color={G.text} />
        <MiniCard icon={d.isNight ? "🌙" : "☀"} label={txt("ليل / نهار", "Layl / Nahar", "ليل / نهار")}
          value={language === "ar" ? (d.isNight ? "ليل" : "نهار") : d.laylNahar} color={d.isNight ? "#818CF8" : "#FBBF24"} />
        <MiniCard icon="⏰" label={txt("ساعة", "Saat", "ساعة")} value={`#${d.currentHour.hourNumber}`} color={G.text} />
        <MiniCard icon={d.planetInfo?.[d.currentHour.planet]?.symbol || "☉"}
          label={txt("كوكب", "Kawkab", "كوكب")} value={planetName} color={G.text} />
      </div>

      {/* ══ 1 · Current Overall Status ══ */}
      <div className="rounded-xl p-3 flex items-center gap-3" style={{
        background: `${dec.status.color}12`, border: `1px solid ${dec.status.color}45`,
      }}>
        <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: dec.status.color }} />
        <div className="flex-1 min-w-0">
          <span className="font-inter text-sm font-bold" style={{ color: dec.status.color }}>
            {language === "ar" ? dec.status.ar : language === "ml" ? dec.status.ml : dec.status.en}
          </span>
          <span className="font-inter text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.50)" }}>
            {txt("സമഗ്ര വിലയിരുത്തൽ", "Overall synthesis", "التركيب الكلي")}
          </span>
        </div>
        <span className="font-inter text-[10px] flex-shrink-0 hidden sm:block" style={{ color: "rgba(255,255,255,0.40)" }}>
          {txt("മണിക്കൂർ അവസാനം", "Hour ends", "نهاية الساعة")}: {dec.nextChange.hourEnd}
        </span>
      </div>

      {/* ══ 2 · Best Operations RIGHT NOW ══ */}
      <div className="rounded-lg p-2.5" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ADE80" }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4ADE80" }}>
            {txt("ഇപ്പോഴത്തെ മികച്ച പ്രവൃത്തികൾ", "Best Operations Now", "أفضل الأعمال الآن")}
          </span>
        </div>
        <OpList items={dec.bestOperations} language={language} color="#4ADE80" isOwner={true} />
      </div>

      {/* ══ 3 · Operations To Avoid ══ */}
      <div className="rounded-lg p-2.5" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Ban className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
            {txt("ഒഴിവാക്കേണ്ട പ്രവൃത്തികൾ", "Operations To Avoid", "أعمال يجب تجنبها")}
          </span>
        </div>
        <OpList items={dec.avoidOperations} language={language} color="#F87171" isOwner={true} />
      </div>

      {/* ══ 4 · Special Operations ══ */}
      {dec.specialOperations.length > 0 && (
        <div className="rounded-lg p-2.5" style={{ background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.20)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Crosshair className="w-3.5 h-3.5" style={{ color: "#C084FC" }} />
            <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#C084FC" }}>
              {txt("വിശേഷ പ്രവൃത്തികൾ", "Special Operations", "أعمال خاصة")}
            </span>
          </div>
          <p className="font-inter text-[9px] mb-1.5" style={{ color: "rgba(255,255,255,0.40)" }}>
            {txt("ഈ സംയോജനം ചില വിശേഷ കൃത്യങ്ങൾക്ക് അനുകൂലമാണ്", "This combination favours specialised works", "هذا التركيب يفضّل أعمالاً مخصصة")}
          </p>
          <OpList items={dec.specialOperations} language={language} color="#C084FC" isOwner={true} />
        </div>
      )}

      {/* ══ 5 · Compatibility Summary ══ */}
      <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.12)" }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Layers className="w-3.5 h-3.5" style={{ color: G.text }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.text }}>
            {txt("പാളി സംഭാവന", "Compatibility Summary", "ملخص التوافق")}
          </span>
        </div>
        <div className="space-y-1">
          {dec.compatibility.map((c, i) => {
            const s = strengthFromScore(c.score);
            const label = c.infoOnly ? STRENGTH_LABEL.info : STRENGTH_LABEL[s.key] || STRENGTH_LABEL.moderate;
            const layerName = language === "ar" ? c.layer.ar : language === "ml" ? c.layer.ml : c.layer.en;
            const strengthText = language === "ar" ? label.ar : language === "ml" ? label.ml : label.en;
            return (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className="font-inter flex-shrink-0 w-28 truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{layerName}</span>
                <span className="font-inter font-bold flex-shrink-0 w-20" style={{ color: s.color }}>{s.sym} {strengthText}</span>
                <span className="font-inter flex-1 truncate" style={{ color: "rgba(255,255,255,0.40)" }}>{c.detail}</span>
              </div>
            );
          })}
          {/* Overall row */}
          <div className="flex items-center gap-2 text-[10px] pt-1.5 mt-1" style={{ borderTop: "1px solid rgba(212,175,55,0.12)" }}>
            <span className="font-inter flex-shrink-0 w-28 truncate font-bold" style={{ color: G.text }}>
              {txt("സമഗ്രം", "Overall", "الإجمالي")}
            </span>
            <span className="font-inter font-bold flex-shrink-0 w-20" style={{ color: dec.status.color }}>
              {dec.status.en === "Very Strong" || dec.status.en === "Special Purpose" ? "✓" : dec.status.en === "Avoid Normal Operations" ? "✗" : "≈"}{" "}
              {language === "ar" ? dec.status.ar : language === "ml" ? dec.status.ml : dec.status.en}
            </span>
            <span className="font-inter flex-1 truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
              {txt("എല്ലാ പാളികളുടെയും സംയോജനം", "synthesis of all layers", "تركيب جميع الطبقات")}
            </span>
          </div>
        </div>
      </div>

      {/* ══ 6 · Next Change ══ */}
      <div className="rounded-lg p-2.5 flex items-center gap-2.5" style={{
        background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.15)",
      }}>
        <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#818CF8" }} />
        <div className="flex-1 min-w-0">
          <span className="font-inter text-[10px] font-bold" style={{ color: "#818CF8" }}>
            {txt("അടുത്ത മാറ്റം", "Next Change", "التغيير التالي")}
          </span>
          <span className="font-inter text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.55)" }}>
            {txt("അടുത്ത ഗ്രഹ മണിക്കൂർ", "Next planetary hour", "الساعة الكوكبية التالية")}:
            <span className="font-bold ml-1" style={{ color: "#818CF8" }}>
              {language === "ar" ? (PLANET_AR[dec.nextChange.nextPlanet] || dec.nextChange.nextPlanet)
                : language === "ml" ? (planetArabicMLDisplay(dec.nextChange.nextPlanet) || dec.nextChange.nextPlanet)
                : dec.nextChange.nextPlanet}
            </span>
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-inter text-[11px] font-bold" style={{ color: "#818CF8" }}>{dec.nextChange.remainingTime}</div>
          <div className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>{dec.nextChange.hourEnd}</div>
        </div>
      </div>

      {/* ══ 7 · Manuscript Sources ══ */}
      <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5" style={{ color: G.dim }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
            {txt("ഗ്രന്ഥ സ്രോതസ്സുകൾ", "Manuscript Sources", "المصادر")}
          </span>
        </div>
        <div className="space-y-1">
          {dec.sources.map((s, i) => (
            <div key={i} className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              <span className="font-bold" style={{ color: G.dim }}>{s.book}</span>
              <span className="ml-1">— {s.author}</span>
              <span className="ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>· {s.topic}</span>
            </div>
          ))}
        </div>
        {dec.dayDirection && (
          <p className="font-inter text-[9px] mt-2 pt-1.5" style={{ borderTop: "1px solid rgba(212,175,55,0.08)", color: "rgba(255,255,255,0.40)" }}>
            {txt("ദിശ", "Direction", "الاتجاه")}: <span style={{ color: G.dim }}>{dec.dayDirection.en}</span>
            <span className="ml-1" style={{ color: "rgba(255,255,255,0.25)" }}>(Kashf p.42)</span>
          </p>
        )}
      </div>
    </div>
  );
}