import { useMemo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy } from "./msEngine";
import { buildAngelName, buildSufliHadimName } from "./msHarakat";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

// ── Positional digit-cycle letter extraction (Arabic) ───────────
const AR_UNITS    = { 1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط' };
const AR_TENS     = { 10:'ي',20:'ك',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص' };
const AR_HUNDREDS = { 100:'ق',200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ' };
const AR_THOUSAND = 'غ';

function extractArabicLetters(value) {
  if (!value || value <= 0) return [];
  const letters = [];
  let n = Math.floor(value);
  const digits = [];
  while (n > 0) { digits.push(n % 10); n = Math.floor(n / 10); }
  let slot = 0;
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    if (slot === 0) {
      if (d !== 0 && AR_UNITS[d]) letters.push(AR_UNITS[d]);
      slot = 1;
    } else if (slot === 1) {
      if (d !== 0 && AR_TENS[d * 10]) letters.push(AR_TENS[d * 10]);
      slot = 2;
    } else if (slot === 2) {
      if (d !== 0 && AR_HUNDREDS[d * 100]) letters.push(AR_HUNDREDS[d * 100]);
      slot = 3;
    } else {
      letters.push(AR_THOUSAND);
      if (d !== 0 && d !== 1 && AR_UNITS[d]) letters.push(AR_UNITS[d]);
      slot = 1;
    }
  }
  return letters;
}

function generateUlviName(value) {
  if (!value || value <= 0) return "...";
  const adjusted = value < 41 ? value + 360 - 41 : value - 41;
  if (adjusted <= 0) return "...";
  const consonants = extractArabicLetters(adjusted);
  const reversed = [...consonants].reverse();
  return buildAngelName(reversed);
}

function generateSufliHadimName(value) {
  if (!value || value <= 0) return "...";
  const angelVal = value < 41 ? value + 360 - 41 : value - 41;
  const adjusted = angelVal < 316 ? angelVal + 360 - 316 : angelVal - 316;
  if (adjusted <= 0) return "...";
  const consonants = extractArabicLetters(adjusted);
  const reversed = [...consonants].reverse();
  return buildSufliHadimName(reversed);
}

// ── Weekday computation ─────────────────────────────────────────
const ARABIC_WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const WEEKDAY_ULVI = {
  0: 'روقيائيل',   // Sunday — Sun
  1: 'جبرائيل',    // Monday — Moon
  2: 'سمسمائيل',   // Tuesday — Mars
  3: 'ميخائيل',    // Wednesday — Mercury
  4: 'صرفيائيل',   // Thursday — Jupiter
  5: 'عنيائيل',    // Friday — Venus
  6: 'كسفيائيل',   // Saturday — Saturn
};

const WEEKDAY_SUFLI = {
  0: 'روقيائش',    // Sunday
  1: 'جبرائش',     // Monday
  2: 'سمسمائش',    // Tuesday
  3: 'ميخائش',     // Wednesday
  4: 'صرفيائش',    // Thursday
  5: 'عنيائش',     // Friday
  6: 'كسفيائش',    // Saturday
};

function getWeekdayInfo() {
  const d = new Date().getDay();
  return {
    name: ARABIC_WEEKDAYS[d],
    ulvi: WEEKDAY_ULVI[d],
    sufli: WEEKDAY_SUFLI[d],
  };
}

/**
 * Join Arabic names with "و" separator (Arabic "and")
 */
function joinArabicNames(names) {
  if (!names || names.length === 0) return "";
  if (names.length === 1) return names[0];
  return names.join(' و ');
}

/**
 * MsQasam — Dynamic Arabic QASAM generated from live Magic Sqayer values.
 *
 * Props:
 *   mc          — magic constant (rawNum)
 *   gridSize    — selected grid size  
 *   userPurpose — optional purpose string (replaces placeholder 17)
 *   targetName  — optional target person name (replaces placeholder 26)
 */
export default function MsQasam({ mc, gridSize, userPurpose, targetName }) {
  const weekday = useMemo(() => getWeekdayInfo(), []);

  const hier = useMemo(() => {
    if (!mc || !gridSize) return null;
    return buildHierarchy(mc, gridSize);
  }, [mc, gridSize]);

  const hierValues = hier ? [
    hier.usurper, hier.guide, hier.mystery, hier.adjuster,
    hier.leader, hier.regulator, hier.genGov, hier.highOver,
  ] : [];

  const ulviNames = useMemo(() => hierValues.map(v => generateUlviName(v)), [hierValues]);
  const sufliNames = useMemo(() => hierValues.map(v => generateSufliHadimName(v)), [hierValues]);

  const qasamText = useMemo(() => {
    if (!mc || !gridSize || !hier) return null;

    const purpose = userPurpose || '...';
    const target = targetName || '...';
    const wkName = weekday.name;
    const wkUlvi = weekday.ulvi;
    const wkSufli = weekday.sufli;

    const ulviStr = joinArabicNames(ulviNames);
    const sufliStr = joinArabicNames(sufliNames);

    // Esmaul Avan — generated from hierarchy values (angel names)
    const esmaulAvanStr = joinArabicNames(ulviNames);

    // Four surrounding archangels
    const archangels = 'جبرائيل و إسرافيل و ميكائيل و عزرائيل';

    return `بسم الله الرحمن الرحيم

عزيمة من الله ورسوله سليمان بن داود عليهما السلام. إلى ملوك الجن والشياطين والمردة والعفاريت جنود إبليس أجمعين. أقسمت عليكم أيتها الأرواح الروحانية والأعوان الأرضية أن تجيبوا دعوتي وتحضروا مقامي وتشموا دخاني وتقضوا حوائجي وهي ${purpose}. بعزة برهتيهين برهتيهين. كريرين كريرين. تطلحين تطلحين. طورانين طورانين. مزجلين مزجلين. بزجلين بزجلين. تركابين تركابين. برهشين برهشين. غلمشين غلمشين. حطورين حطورين. كالنهودين كالنهودين. برشانين برشانين. كزهيرين كزهيرين. نموشلحين نموشلحين. برهايولين برهايولين. بشكيلاهين بشكيلاهين. كزمجين كزمجين. أنغلاليتين أنغلاليتين. كبراتين كبراتين. غاياهين غاياهين. كيدهولين كيدهولين. شمهاهيرين شمهاهيرين. شمهاهيرين شمهاهيرين. شمهاهيرين شمهاهيرين.

بكهتهونهين بكهتهونهين. بشارشين بشارشين. طنيشين طنيشين. شمهبروهين شمهبروهين. اللهم بحق كهكهيجين يغتشين بلط سغ شغويلين. أمولين جلدين مهمن هلمجين ورودهين مهفياجين بعزتك إلا أخذت سمعهم وأبصارهم سبحان من ليس كمثله شيء وهو السميع البصير وبحق ${esmaulAvanStr} أجب أيها الملوك والأعوان بحق هذه الأسماء عليكم وطاعتها لديكم وبحق من قال للسماوات والأرض ائتيا طوعاً أو كرهاً قالتا أتينا طائعين لله رب العالمين. أجب واسمع وأطع ولا تكن من الذين قالوا سمعنا وأطعنا وهم لا يسمعون. أجب يا ${archangels} عليه السلام وأنت يا أملاك الموكلين بهذا الوفق ${ulviStr}. أقسمت عليكم بالملك العظيم منزل الوحي على الرسول من مرادقات العظمة إلى اللوح المحفوظ. إلا ما أجبتم عزيمتي هذه واحضرتم خادمي هذا اليوم الموكلين بيوم ${wkName} ${wkUlvi} وخادمه ${wkSufli} وخدام هذا الوفق ${sufliStr} بحق ما فيها من سر الأسرار ونور الأنوار. هيا هيا. الواحا الواحا. العجل العجل. الساعة الساعة.`;
  }, [mc, gridSize, hier, userPurpose, targetName, weekday, ulviNames, sufliNames]);

  // Only render when we have the minimum required data
  if (!qasamText) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-6 space-y-4"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 28px ${G.glow}`,
      }}
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <h2
          className="font-inter font-bold tracking-[0.20em] uppercase"
          style={{ color: G.text, fontSize: "1.1rem", letterSpacing: "0.25em" }}
        >
          QASAM
        </h2>
        <div
          className="mx-auto"
          style={{
            width: 48,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)`,
          }}
        />
      </div>

      {/* Dynamic Arabic QASAM */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(212,175,55,0.04)",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <p
          className="font-amiri text-base leading-[2.4] text-center"
          dir="rtl"
          style={{
            color: "rgba(245,235,210,0.88)",
            whiteSpace: "pre-wrap",
            textShadow: "0 0 12px rgba(212,175,55,0.12)",
          }}
        >
          {qasamText}
        </p>
      </div>

      {/* Metadata summary — shows what values were used */}
      <div
        className="rounded-xl p-3 space-y-1.5"
        style={{
          background: "rgba(212,175,55,0.02)",
          border: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-inter text-[9px]">
          <span style={{ color: G.dim }}>العنوان / Purpose:</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{userPurpose || '—'}</span>
          <span style={{ color: G.dim }}>اليوم / Day:</span>
          <span className="font-amiri" dir="rtl" style={{ color: "rgba(255,255,255,0.55)" }}>{weekday.name}</span>
          <span style={{ color: G.dim }}>الهدف / Target:</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{targetName || '—'}</span>
          <span style={{ color: G.dim }}>أسماء الأولياء / Ulvi Hadim:</span>
          <span className="font-amiri text-[8px]" dir="rtl" style={{ color: "rgba(79,227,255,0.70)" }}>{ulviNames.join(' · ')}</span>
          <span style={{ color: G.dim }}>أسماء يوش / Sufli Hadim:</span>
          <span className="font-amiri text-[8px]" dir="rtl" style={{ color: "rgba(52,211,153,0.70)" }}>{sufliNames.join(' · ')}</span>
        </div>
      </div>
    </motion.div>
  );
}