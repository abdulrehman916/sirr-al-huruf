// ═══════════════════════════════════════════════════════════════
// INTELLIGENT LIVE DASHBOARD — SINGLE OPERATIONAL CENTRE
// Merges EVERY operational manuscript layer into one dashboard.
// The reference/study sections below remain separate (no duplication).
//
// DATA RULE: reads only useAstroData + astroClockDecisionEngine.
//   No manuscript information is invented; every line traceable to
//   Havâss / Kashf. Layers with no manuscript data (e.g. Moon zodiac
//   dignity) are shown information-only, never scored.
// LANGUAGE RULE: one language per item; Arabic shows Arabic where the
//   manuscript provides it, otherwise hides untranslated lists.
// ═══════════════════════════════════════════════════════════════
import { useAstroData, DAY_AR, PLANET_AR } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { computeAstroDecision } from "@/lib/astroClockDecisionEngine";
import { MiniCard } from "./DashboardSection";
import { planetArabicMLDisplay } from "@/lib/astroClockLabelMap";
import {
  Sparkles, CheckCircle2, Ban, Crosshair, Layers, Clock, BookOpen,
  Sun, Moon, Compass, ScrollText, CalendarDays, Star, Activity,
} from "lucide-react";

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

function SourceChip({ src }) {
  if (!src) return null;
  return (
    <span className="font-inter text-[8px] leading-tight block" style={{ color: "rgba(129,140,248,0.45)" }}>
      📖 {src}
    </span>
  );
}

function OpList({ items, language, color }) {
  if (!items || items.length === 0) {
    return <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>—</p>;
  }
  const filtered = language === "ar" ? items.filter(it => it.ar) : items;
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
          <SourceChip src={it.source} />
        </span>
      ))}
    </div>
  );
}

// ── Inline layer block ──
function LayerBlock({ icon: Icon, title, source, color, children }) {
  const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)" };
  return (
    <div className="rounded-lg p-2.5" style={{ background: `${color}06`, border: `1px solid ${color}18` }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
        <span className="font-inter text-[10px] uppercase tracking-wider font-bold flex-1" style={{ color }}>{title}</span>
        {source && <SourceChip src={source} />}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div className="flex items-baseline gap-2 text-[10px]">
      <span className="font-inter flex-shrink-0" style={{ color: "rgba(255,255,255,0.40)" }}>{label}</span>
      <span className="font-inter font-bold" style={{ color: color || "rgba(255,255,255,0.80)" }}>{value}</span>
    </div>
  );
}

export default function IntelligentDashboard() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  if (!d.currentHour) return null;

  const dec = computeAstroDecision(d);
  if (!dec) return null;

  const L = dec.layers;
  const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)" };
  const friend = FRIEND_LABEL[dec.friend] || FRIEND_LABEL.neutral;

  // Context strip values
  const dayName = language === "ar" ? DAY_AR[d.activeDayIndex]
    : language === "ml" ? d.dayInfo?.name_ml : d.dayInfo?.name_en;
  const planetName = language === "ar" ? (PLANET_AR[d.currentHour.planet] || d.currentHour.planet)
    : language === "ml" ? (planetArabicMLDisplay(d.currentHour.planet) || d.currentHour.planet)
    : d.planetInfo?.[d.currentHour.planet]?.name_en || d.currentHour.planet;

  const pl = (en, ml, ar) => (language === "ar" ? ar : language === "ml" ? ml : en);

  return (
    <div className="space-y-3">
      {/* ══ Context strip ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <MiniCard icon="📅" label={txt("ദിവസം", "Day", "يوم")} value={dayName} color={G.text} />
        <MiniCard icon={d.isNight ? "🌙" : "☀"} label={txt("ليل / نهار", "Layl / Nahar", "ليل / نهار")}
          value={language === "ar" ? (d.isNight ? "ليل" : "نهار") : d.laylNahar} color={d.isNight ? "#818CF8" : "#FBBF24"} />
        <MiniCard icon="⏰" label={txt("ساعة", "Saat", "ساعة")} value={`#${d.currentHour.hourNumber}`} color={G.text} />
        <MiniCard icon={d.planetInfo?.[d.currentHour.planet]?.symbol || "☉"}
          label={txt("كوكب", "Kawkab", "كوكب")} value={planetName} color={G.text} />
      </div>

      {/* ══ 1 · Overall Current Status ══ */}
      <div className="rounded-xl p-3 flex items-center gap-3" style={{
        background: `${dec.status.color}12`, border: `1px solid ${dec.status.color}45`,
      }}>
        <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: dec.status.color }} />
        <div className="flex-1 min-w-0">
          <span className="font-inter text-sm font-bold" style={{ color: dec.status.color }}>
            {pl(dec.status.ml, dec.status.ml, dec.status.ar)}
          </span>
          <span className="font-inter text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.50)" }}>
            {txt("സമഗ്ര വിലയിരുത്തൽ", "Overall synthesis", "التركيب الكلي")}
          </span>
        </div>
        <span className="font-inter text-[10px] flex-shrink-0 hidden sm:block" style={{ color: "rgba(255,255,255,0.40)" }}>
          {txt("മണിക്കൂർ അവസാനം", "Hour ends", "نهاية الساعة")}: {dec.nextChange.hourEnd}
        </span>
      </div>

      {/* ══ 2 · Manuscript Layers (inline operational sections) ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        {/* Planetary Day */}
        {L.planetaryDay && (
          <LayerBlock icon={Sun} title={txt("ഗ്രഹ ദിനം", "Planetary Day", "يوم الكوكب")} color="#FBBF24"
            source={L.planetaryDay.source}>
            <Row label={txt("ഭരണി", "Ruler", "الحاكم")}
              value={pl(L.planetaryDay.name_en, L.planetaryDay.name_ml, L.planetaryDay.name_ar)} color={G.text} />
            <Row label={txt("സ്വഭാവം", "Nature", "الطبيعة")}
              value={pl(L.planetaryDay.nature, L.planetaryDay.nature_ml, L.planetaryDay.nature)} color="#FBBF24" />
            <Row label={txt("മൂലകം", "Element", "العنصر")} value={L.planetaryDay.element} color="rgba(255,255,255,0.70)" />
          </LayerBlock>
        )}

        {/* Lunar Day */}
        {L.lunarDay && (
          <LayerBlock icon={CalendarDays} title={txt("ചാന്ദ്ര ദിനം", "Lunar Day", "يوم القمر")} color="#818CF8"
            source={L.lunarDay.source}>
            <Row label={txt("ദിവസം", "Day", "اليوم")} value={`#${L.lunarDay.day}`} color="#818CF8" />
            <Row label={txt("സ്വഭാവം", "Nature", "الطبيعة")}
              value={pl(L.lunarDay.nature_en, L.lunarDay.nature_ml, L.lunarDay.nature_en)} color="rgba(255,255,255,0.80)" />
            {L.lunarDay.summary_ar && (
              <p className="font-amiri text-[10px] mt-1" style={{ color: "rgba(129,140,248,0.65)", direction: "rtl" }}>{L.lunarDay.summary_ar}</p>
            )}
            {L.lunarDay.nahsStatus && (
              <p className="font-inter text-[9px] mt-1" style={{ color: "#F87171" }}>
                {language === "ar" ? "⚠" : "⚠"} {pl(L.lunarDay.nahsStatus.en, L.lunarDay.nahsStatus.ml, L.lunarDay.nahsStatus.en)}
              </p>
            )}
          </LayerBlock>
        )}

        {/* Moon Mansion */}
        {L.moonMansion && (
          <LayerBlock icon={Star} title={txt("ചാന്ദ്ര നക്ഷത്രം", "Moon Mansion", "منزل القمر")} color="#A78BFA"
            source={L.moonMansion.source}>
            <Row label={txt("മന്സിൽ", "Mansion", "المنزل")} value={`#${L.moonMansion.no} ${L.moonMansion.name_ar}`} color="#A78BFA" />
            <Row label={txt("സ്വഭാവം", "Nature", "الطبيعة")}
              value={pl(L.moonMansion.nature_en, L.moonMansion.nature_ml, L.moonMansion.nature_en)} color="rgba(255,255,255,0.80)" />
            {L.moonMansion.operation_ar && (
              <p className="font-amiri text-[10px] mt-1" style={{ color: "rgba(167,139,250,0.65)", direction: "rtl" }}>{L.moonMansion.operation_ar}</p>
            )}
          </LayerBlock>
        )}

        {/* Moon Zodiac */}
        <LayerBlock icon={Star} title={txt("ചന്ദ്ര രാശി", "Moon Zodiac", "برج القمر")} color="#60A5FA"
          source={L.moonZodiac.source || "Dignity not in manuscripts"}>
          <Row label={txt("രാശി", "Sign", "البرج")}
            value={L.moonZodiac.name_en ? pl(L.moonZodiac.name_en, L.moonZodiac.name_en, L.moonZodiac.name_ar) : "—"} color="#60A5FA" />
          {L.moonZodiac.longitude && <Row label={txt("ദ്രാഘണം", "Longitude", "الطول")} value={`${L.moonZodiac.longitude}°`} color="rgba(255,255,255,0.70)" />}
          {L.moonZodiac.bestSaatPlanet && (
            <Row label={txt("മികച്ച ഘടിക", "Best Saat", "أفضل ساعة")}
              value={`${L.moonZodiac.bestSaatPlanetAr} (${L.moonZodiac.bestSaatPlanet})`} color="rgba(255,255,255,0.70)" />
          )}
          <p className="font-inter text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
            {txt("ശക്തി ഗ്രന്ഥങ്ങളിൽ ഇല്ല", "Dignity not in manuscripts — info only", "الكرامة ليست في المخطوطات")}
          </p>
        </LayerBlock>

        {/* Moon Phase */}
        {L.moonPhase && (
          <LayerBlock icon={Moon} title={txt("ചന്ദ്ര ഘട്ടം", "Moon Phase", "طور القمر")} color="#94A3B8"
            source={L.moonPhase.source}>
            <Row label={txt("ഘട്ടം", "Phase", "الطور")}
              value={`${pl(L.moonPhase.en, L.moonPhase.ml, L.moonPhase.en)} (${L.moonPhase.pct}%)`} color="#94A3B8" />
            <Row label={txt("ദിശ", "Direction", "الاتجاه")}
              value={L.moonPhase.isWaxing
                ? txt("വർദ്ധിക്കുന്നു (ശുഭം)", "Waxing (positive)", "متزايد (إيجابي)")
                : txt("കുറയുന്നു (വിശേഷം)", "Waning (negative/special)", "تناقصي (خاص)")}
              color="rgba(255,255,255,0.70)" />
          </LayerBlock>
        )}

        {/* Day / Night (Practice rule context) */}
        <LayerBlock icon={L.dayNight.isNight ? Moon : Sun} title={txt("രാത്രി / പകൽ", "Day / Night", "الليل / النهار")} color="#818CF8"
          source={L.dayNight.source}>
          <Row label={txt("നിലവിലെ കാലം", "Current period", "الوقت")}
            value={pl(L.dayNight.isNight ? "രാത്രി" : "പകൽ", L.dayNight.isNight ? "Night" : "Day", L.dayNight.isNight ? "ليل" : "نهار")}
            color="#818CF8" />
          <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
            {pl(L.practiceRule.ml, L.practiceRule.en, L.practiceRule.ar)}
          </p>
          <p className="font-inter text-[8px] mt-0.5" style={{ color: "#4ADE80" }}>
            {txt("അപവാദം", "Exception", "استثناء")}: {pl(L.practiceRule.exception_en, L.practiceRule.exception_en, L.practiceRule.exception_en)}
          </p>
        </LayerBlock>

        {/* Current Planetary Hour */}
        {L.currentHour && (
          <LayerBlock icon={Clock} title={txt("നിലവിലെ ഗ്രഹ മണിക്കൂർ", "Current Planetary Hour", "ساعة الكوكب الحالية")} color="#F5D060"
            source={L.currentHour.source}>
            <Row label={txt("ഘടിക", "Hour", "الساعة")}
              value={`#${L.currentHour.hourNumber} · ${pl(L.currentHour.name_en, L.currentHour.name_ml, L.currentHour.name_ar)}`} color={G.text} />
            <Row label={txt("സ്വഭാവം", "Nature", "الطبيعة")}
              value={pl(L.currentHour.nature, L.currentHour.nature_ml, L.currentHour.nature)} color="#FBBF24" />
            <Row label={txt("സമയം", "Time", "الوقت")}
              value={`${L.currentHour.hourStart} – ${L.currentHour.hourEnd}`} color="rgba(255,255,255,0.70)" />
            <Row label={txt("ദിവസവുമായി", "vs Day", "مع اليوم")}
              value={pl(friend.ml, friend.en, friend.ar)} color={friend.color} />
          </LayerBlock>
        )}

        {/* Direction Guidance */}
        <LayerBlock icon={Compass} title={txt("ദിശ മാർഗ്ഗനിർദ്ദേശം", "Direction Guidance", "إرشاد الاتجاه")} color="#34D399"
          source={L.direction.source}>
          {L.direction.facing ? (
            <Row label={txt("അഭ്യാസ ദിശ", "Facing", "التوجه")}
              value={pl(L.direction.facing.ml, L.direction.facing.en, L.direction.facing.ar)} color="#34D399" />
          ) : <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>—</p>}
          {L.direction.travelNahs && (
            <p className="font-inter text-[9px] mt-1" style={{ color: "#F87171" }}>
              ⚠ {txt("യാത്ര ഒഴിവാക്കുക", "Avoid travel", "تجنب السفر")}: {L.direction.travelNahs.direction_en}
            </p>
          )}
        </LayerBlock>

        {/* Kashf Hour Information */}
        <LayerBlock icon={ScrollText} title={txt("കശ്ഫ് ഘടിക വിവരം", "Kashf Hour Info", "معلومات ساعات كشف")} color="#F5D060"
          source={L.kashfHour.source}>
          {L.kashfHour.answerHour && (
            <Row label={txt("ഉത്തര ഘടിക", "Answer", "إجابة")}
              value={`${L.kashfHour.answerHour.planet_ar} · #${L.kashfHour.answerHour.hour_number}${L.kashfHour.answerHour.isNow ? " · NOW" : ""}`}
              color={L.kashfHour.answerHour.isNow ? "#4ADE80" : "rgba(255,255,255,0.70)"} />
          )}
          {L.kashfHour.dominanceHour && (
            <Row label={txt("ജയ ഘടിക", "Dominance", "غلبة")}
              value={`${L.kashfHour.dominanceHour.planet_ar} · #${L.kashfHour.dominanceHour.hour_number}${L.kashfHour.dominanceHour.isNow ? " · NOW" : ""}`}
              color={L.kashfHour.dominanceHour.isNow ? "#FBBF24" : "rgba(255,255,255,0.70)"} />
          )}
          {L.kashfHour.jaad && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 text-[9px] font-inter" style={{ color: "rgba(255,255,255,0.60)" }}>
              <span>{txt("സഅദ്", "Sa'd", "سعد")}: {L.kashfHour.jaad.saad}</span>
              <span>{txt("ജയം", "Dom", "غلبة")}: {L.kashfHour.jaad.dominance}</span>
              <span>{txt("ഉത്തരം", "Ans", "إجابة")}: {L.kashfHour.jaad.answer}</span>
              <span>{txt("അനുഗ്രഹം", "Bless", "بركة")}: {L.kashfHour.jaad.blessing}</span>
            </div>
          )}
          {L.kashfHour.principle && (
            <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              {pl(L.kashfHour.principle.ml, L.kashfHour.principle.en, L.kashfHour.principle.ar)}
            </p>
          )}
        </LayerBlock>

        {/* Day Operations (Kashf) */}
        {L.dayOperations.length > 0 && (
          <LayerBlock icon={Activity} title={txt("ദിന പ്രവൃത്തികൾ", "Day Operations", "أعمال اليوم")} color="#C084FC"
            source={`Kashf al-Haqa'iq, pp.12-13, 26-27`}>
            <OpList items={L.dayOperations} language={language} color="#C084FC" />
          </LayerBlock>
        )}
      </div>

      {/* ══ 3 · Best Operations RIGHT NOW ══ */}
      <div className="rounded-lg p-2.5" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ADE80" }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4ADE80" }}>
            {txt("ഇപ്പോഴത്തെ മികച്ച പ്രവൃത്തികൾ", "Best Operations Now", "أفضل الأعمال الآن")}
          </span>
        </div>
        <OpList items={dec.bestOperations} language={language} color="#4ADE80" />
      </div>

      {/* ══ 4 · Operations To Avoid ══ */}
      <div className="rounded-lg p-2.5" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Ban className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
            {txt("ഒഴിവാക്കേണ്ട പ്രവൃത്തികൾ", "Operations To Avoid", "أعمال يجب تجنبها")}
          </span>
        </div>
        <OpList items={dec.avoidOperations} language={language} color="#F87171" />
      </div>

      {/* ══ 5 · Special Operations ══ */}
      {dec.specialOperations.length > 0 && (
        <div className="rounded-lg p-2.5" style={{ background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.20)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Crosshair className="w-3.5 h-3.5" style={{ color: "#C084FC" }} />
            <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#C084FC" }}>
              {txt("വിശേഷ പ്രവൃത്തികൾ", "Special Operations", "أعمال خاصة")}
            </span>
          </div>
          <p className="font-inter text-[9px] mb-1.5" style={{ color: "rgba(255,255,255,0.40)" }}>
            {txt("ഈ സംയോജനം വിശേഷ കൃത്യങ്ങൾക്ക് അനുകൂലം", "This combination favours specialised works", "هذا التركيب يفضّل أعمالاً مخصصة")}
          </p>
          <OpList items={dec.specialOperations} language={language} color="#C084FC" />
        </div>
      )}

      {/* ══ 6 · Compatibility Summary ══ */}
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
            const layerName = pl(c.layer.ml, c.layer.en, c.layer.ar);
            const strengthText = pl(label.ml, label.en, label.ar);
            return (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className="font-inter flex-shrink-0 w-28 truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{layerName}</span>
                <span className="font-inter font-bold flex-shrink-0 w-20" style={{ color: s.color }}>{s.sym} {strengthText}</span>
                <span className="font-inter flex-1 truncate" style={{ color: "rgba(255,255,255,0.40)" }}>{c.detail}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2 text-[10px] pt-1.5 mt-1" style={{ borderTop: "1px solid rgba(212,175,55,0.12)" }}>
            <span className="font-inter flex-shrink-0 w-28 truncate font-bold" style={{ color: G.text }}>
              {txt("സമഗ്രം", "Overall", "الإجمالي")}
            </span>
            <span className="font-inter font-bold flex-shrink-0 w-20" style={{ color: dec.status.color }}>
              {dec.status.en === "Very Strong" || dec.status.en === "Special Purpose" ? "✓" : dec.status.en === "Avoid Normal Operations" ? "✗" : "≈"}{" "}
              {pl(dec.status.ml, dec.status.en, dec.status.ar)}
            </span>
            <span className="font-inter flex-1 truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
              {txt("എല്ലാ പാളികളുടെയും സംയോജനം", "synthesis of all layers", "تركيب جميع الطبقات")}
            </span>
          </div>
        </div>
      </div>

      {/* ══ 7 · Next Live Change ══ */}
      <div className="rounded-lg p-2.5 flex items-center gap-2.5" style={{
        background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.15)",
      }}>
        <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#818CF8" }} />
        <div className="flex-1 min-w-0">
          <span className="font-inter text-[10px] font-bold" style={{ color: "#818CF8" }}>
            {txt("അടുത്ത മാറ്റം", "Next Live Change", "التغيير الحي التالي")}
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

      {/* ══ 8 · Manuscript References ══ */}
      <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5" style={{ color: G.dim }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
            {txt("ഗ്രന്ഥ റഫറൻസുകൾ", "Manuscript References", "المراجع")}
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
      </div>
    </div>
  );
}