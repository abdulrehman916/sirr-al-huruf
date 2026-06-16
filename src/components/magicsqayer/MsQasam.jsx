import { useMemo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, numToArabic } from "./msEngine";
import { buildAngelName, buildJinnName, buildSufliHadimName, buildHebrewAngelName, buildHebrewJinnName } from "./msHarakat";

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

// ── Hebrew positional digit-cycle letter extraction ─────────────
const HE_UNITS    = { 1:'א',2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט' };
const HE_TENS     = { 10:'י',20:'כ',30:'ל',40:'מ',50:'נ',60:'ס',70:'ע',80:'פ',90:'צ' };
const HE_HUNDREDS = { 100:'ק',200:'ר',300:'ש',400:'ת',500:'ך',600:'ם',700:'ן',800:'ף',900:'ץ' };
const HE_THOUSAND = 'א';

function extractHebrewLetters(value) {
  if (!value || value <= 0) return [];
  const letters = [];
  let n = Math.floor(value);
  const digits = [];
  while (n > 0) { digits.push(n % 10); n = Math.floor(n / 10); }
  let slot = 0;
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    if (slot === 0) {
      if (d !== 0 && HE_UNITS[d]) letters.push(HE_UNITS[d]);
      slot = 1;
    } else if (slot === 1) {
      if (d !== 0 && HE_TENS[d * 10]) letters.push(HE_TENS[d * 10]);
      slot = 2;
    } else if (slot === 2) {
      if (d !== 0 && HE_HUNDREDS[d * 100]) letters.push(HE_HUNDREDS[d * 100]);
      slot = 3;
    } else {
      letters.push(HE_THOUSAND);
      if (d !== 0 && d !== 1 && HE_UNITS[d]) letters.push(HE_UNITS[d]);
      slot = 1;
    }
  }
  return letters;
}

// ── Suffix-dispatched name generators ────────────────────────────
const ULV_SUFFIXES = { angelAr: 41, angelHeb: 31 };
const SFL_SUFFIXES = { jinnAr: 319, jinnHeb: 329 };

// Underflow rule: if value < suffix, add 360 first, then subtract
function adjustedValue(value, suffix) {
  if (!value || value <= 0) return 0;
  return value < suffix ? value + 360 - suffix : value - suffix;
}

function generateUlviNameSuffixed(value, suffix) {
  if (!value || value <= 0) return "...";
  if (suffix === "heb-angel") {
    const adj = adjustedValue(value, ULV_SUFFIXES.angelHeb);
    if (adj <= 0) return "...";
    const consonants = extractHebrewLetters(adj);
    return buildHebrewAngelName([...consonants].reverse());
  }
  // Default: Arabic Angel (-41)
  const adj = adjustedValue(value, ULV_SUFFIXES.angelAr);
  if (adj <= 0) return "...";
  const consonants = extractArabicLetters(adj);
  return buildAngelName([...consonants].reverse());
}

function generateSufliNameSuffixed(value, suffix) {
  if (!value || value <= 0) return "...";
  if (suffix === "ar-jinn") {
    const adj = adjustedValue(value, SFL_SUFFIXES.jinnAr);
    if (adj <= 0) return "...";
    const consonants = extractArabicLetters(adj);
    return buildJinnName([...consonants].reverse());
  }
  if (suffix === "heb-jinn") {
    const adj = adjustedValue(value, SFL_SUFFIXES.jinnHeb);
    if (adj <= 0) return "...";
    const consonants = extractHebrewLetters(adj);
    return buildHebrewJinnName([...consonants].reverse());
  }
  // Default: Arabic Sufli Hadim (-316, applied after angel -41)
  const angelVal = adjustedValue(value, ULV_SUFFIXES.angelAr);
  const adj = angelVal < 316 ? angelVal + 360 - 316 : angelVal - 316;
  if (adj <= 0) return "...";
  const consonants = extractArabicLetters(adj);
  return buildSufliHadimName([...consonants].reverse());
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
 *   grid        — { grid: number[][], usurper, incompatible? } from generateSquare
 *   userPurpose — optional purpose string
 *   targetName  — optional target person name
 */
export default function MsQasam({ mc, gridSize, grid, userPurpose, targetName, suffix = "ar-angel" }) {
  const weekday = useMemo(() => getWeekdayInfo(), []);

  const hier = useMemo(() => {
    if (!mc || !gridSize) return null;
    return buildHierarchy(mc, gridSize);
  }, [mc, gridSize]);

  // Esmaul Avan — per source: convert cell value to Arabic letters + append طاطيل
  // N² names: 3×3=9, 4×4=16, etc.
  const esmaulAvanNames = useMemo(() => {
    if (!grid || !grid.grid) return [];
    return grid.grid.flat().map(v => numToArabic(v) + 'طاطيل');
  }, [grid]);

  // Ulvi Hadim — one angel name per hierarchy value (8 names)
  const hierValues = useMemo(() => {
    if (!hier) return [];
    return [hier.usurper, hier.guide, hier.mystery, hier.adjuster,
            hier.leader, hier.regulator, hier.genGov, hier.highOver];
  }, [hier]);

  const ulviNames = useMemo(() => hierValues.map(v => generateUlviNameSuffixed(v, suffix)), [hierValues, suffix]);
  const sufliNames = useMemo(() => hierValues.map(v => generateSufliNameSuffixed(v, suffix)), [hierValues, suffix]);

  const qasamText = useMemo(() => {
    if (!mc) return null;

    const purpose = userPurpose || '...';
    const target = targetName || '...';
    const wkName = weekday.name;
    const wkUlvi = weekday.ulvi;
    const wkSufli = weekday.sufli;

    const ulviStr = joinArabicNames(ulviNames);
    const sufliStr = joinArabicNames(sufliNames);

    // Esmaul Avan — all N² cell-based names
    const esmaulAvanStr = joinArabicNames(esmaulAvanNames);

    // Four surrounding archangels
    const archangels = 'جبرائيل و إسرافيل و ميكائيل و عزرائيل';

    return `بسم الله الرحمن الرحيم

عزيمة من الله ورسوله سليمان بن داود عليهما السلام. إلى ملوك الجن والشياطين والمردة والعفاريت جنود إبليس أجمعين. أقسمت عليكم أيتها الأرواح الروحانية والأعوان الأرضية أن تجيبوا دعوتي وتحضروا مقامي وتشموا دخاني وتقضوا حوائجي وهي ${purpose}. بعزة برهتيهين برهتيهين. كريرين كريرين. تطلحين تطلحين. طورانين طورانين. مزجلين مزجلين. بزجلين بزجلين. تركابين تركابين. برهشين برهشين. غلمشين غلمشين. حطورين حطورين. كالنهودين كالنهودين. برشانين برشانين. كزهيرين كزهيرين. نموشلحين نموشلحين. برهايولين برهايولين. بشكيلاهين بشكيلاهين. كزمجين كزمجين. أنغلاليتين أنغلاليتين. كبراتين كبراتين. غاياهين غاياهين. كيدهولين كيدهولين. شمهاهيرين شمهاهيرين. شمهاهيرين شمهاهيرين. شمهاهيرين شمهاهيرين.

بكهتهونهين بكهتهونهين. بشارشين بشارشين. طنيشين طنيشين. شمهبروهين شمهبروهين. اللهم بحق كهكهيجين يغتشين بلط سغ شغويلين. أمولين جلدين مهمن هلمجين ورودهين مهفياجين بعزتك إلا أخذت سمعهم وأبصارهم سبحان من ليس كمثله شيء وهو السميع البصير وبحق ${esmaulAvanStr} أجب أيها الملوك والأعوان بحق هذه الأسماء عليكم وطاعتها لديكم وبحق من قال للسماوات والأرض ائتيا طوعاً أو كرهاً قالتا أتينا طائعين لله رب العالمين. أجب واسمع وأطع ولا تكن من الذين قالوا سمعنا وأطعنا وهم لا يسمعون. أجب يا ${archangels} عليه السلام وأنت يا أملاك الموكلين بهذا الوفق ${ulviStr}. أقسمت عليكم بالملك العظيم منزل الوحي على الرسول من مرادقات العظمة إلى اللوح المحفوظ. إلا ما أجبتم عزيمتي هذه واحضرتم خادمي هذا اليوم الموكلين بيوم ${wkName} ${wkUlvi} وخادمه ${wkSufli} وخدام هذا الوفق ${sufliStr} بحق ما فيها من سر الأسرار ونور الأنوار. هيا هيا. الواحا الواحا. العجل العجل. الساعة الساعة.`;
  }, [mc, userPurpose, targetName, weekday, ulviNames, sufliNames, esmaulAvanNames]);

  // Malayalam translation — structural, sacred names preserved in original form
  const malayalamText = useMemo(() => {
    if (!mc) return null;

    const purpose = userPurpose || '...';
    const target = targetName || '...';
    const wkName = weekday.name;

    return `بسم الله الرحمن الرحيم

അല്ലാഹുവിന്റെ നാമത്തിൽ, പരമകാരുണികനും കരുണാനിധിയുമായവന്റെ.

അല്ലാഹുവിൽ നിന്നും അവന്റെ ദൂതൻ സുലൈമാൻ ബിൻ ദാവൂദ് (അ) യിൽ നിന്നുമുള്ള ഒരു ശക്തമായ ആജ്ഞ. ജിന്നുകളുടെ രാജാക്കന്മാർക്കും, പിശാചുക്കൾക്കും, വിമതന്മാർക്കും, ഇഫ്രീത്തുകൾക്കും, ഇബ്ലീസിന്റെ എല്ലാ സൈന്യങ്ങൾക്കും. ഓ ആത്മീയ ശക്തികളേ, ഓ ഭൗമിക സഹായികളേ, നിങ്ങളോട് ഞാൻ ആണയിടുന്നു — എന്റെ വിളിക്ക് ഉത്തരം നൽകുക, എന്റെ സന്നിധിയിൽ ഹാജരാകുക, എന്റെ ധൂപം മണക്കുക, എന്റെ ആവശ്യം നിറവേറ്റുക, അതായത്: ${purpose}. ബിര്‍ഹത്തീഹീൻ, കരീരീൻ, തത്‌ലഹീൻ, ത്വൂറാനീൻ, മസ്‌ജലീൻ, ബിസ്‌ജലീൻ, തർകാബീൻ, ബർഹശീൻ, ഗുൽമശീൻ, ഹത്വൂരീൻ, കാല്‍നഹൂദീൻ, ബർശാനീൻ, കസ്‌ഹീരീൻ, നമൂശ്‌ലഹീൻ, ബർഹായൂലീൻ, ബശ്‌കീലാഹീൻ, കസ്‌മജീൻ, അൻഗലാലീത്തീൻ, കബ്റാത്തീൻ, ഗായാഹീൻ, കൈദഹൂലീൻ, ശംഹാഹീരീൻ (മൂന്ന് പ്രാവശ്യം) എന്നീ നാമങ്ങളുടെ പ്രതാപത്താൽ.

ബകഹ്‌തഹൂനഹീൻ (രണ്ട് പ്രാവശ്യം), ബശാരിശീൻ, ത്വനീശീൻ, ശംഹബ്‌റൂഹീൻ. അല്ലാഹുവേ, കഹ്‌കഹീജീൻ, യഗ്‌തശീൻ, ബൽത്വ് സഗ് ശഗ്‌വീലീൻ എന്നിവയുടെ അവകാശത്താൽ... അവരുടെ കേൾവിയും കാഴ്ചകളും തട്ടിയെടുക്കുക. അവനു തുല്യമായി യാതൊന്നുമില്ലാത്തവൻ എത്ര പരിശുദ്ധൻ! അവൻ എല്ലാം കേൾക്കുന്നവനും കാണുന്നവനുമാണ്. ഈ വഫ്‌ഖിന്റെ പേരുകളുടെ (${esmaulAvanNames.length} നാമങ്ങൾ) അവകാശത്താൽ — ഓ രാജാക്കന്മാരേ, സഹായികളേ, ഉത്തരം നൽകുക. ആകാശത്തോടും ഭൂമിയോടും "സ്വമേധയാ അല്ലെങ്കിൽ നിർബന്ധിതമായി വരുവിൻ" എന്ന് പറഞ്ഞവന്റെ അവകാശത്താൽ. അവർ പറഞ്ഞു: "ഞങ്ങൾ അനുസരണയോടെ വന്നിരിക്കുന്നു." ജിബ്രീൽ, ഇസ്‌റാഫീൽ, മീകാഈൽ, അസ്‌റാഈൽ (അ) എന്നിവരേ, ഉത്തരം നൽകുക. ഈ വഫ്‌ഖിന്റെ ചുമതലയുള്ള മലക്കുകളേ, ഉത്തരം നൽകുക. മഹത്തായ രാജാവിന്റെ പേരിൽ ഞാൻ നിങ്ങളോട് ആണയിടുന്നു, വഹ്‌യ് ഇറക്കിയവന്റെ, സംരക്ഷിത ഫലകത്തിലേക്ക് മഹത്വത്തിന്റെ തിരശ്ശീലകളിൽ നിന്ന്... ${wkName} ദിവസത്തിന്റെ ചുമതലയുള്ള ഈ ദിവസത്തെ ഖാദിമിനെ ഹാജരാക്കുക. രഹസ്യങ്ങളുടെ രഹസ്യവും പ്രകാശങ്ങളുടെ പ്രകാശവും ഇതിൽ അടങ്ങിയിരിക്കുന്നതിന്റെ അവകാശത്താൽ. വേഗം വേഗം. ഉടൻ ഉടൻ. ഈ നിമിഷം ഈ നിമിഷം.`;
  }, [mc, userPurpose, targetName, weekday, esmaulAvanNames]);

  // Only render when we have the minimum required data (mc)
  if (!mc) return null;

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

      {/* Malayalam Translation */}
      {malayalamText && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(212,175,55,0.02)",
            border: "1px solid rgba(212,175,55,0.10)",
          }}
        >
          <p className="font-inter text-[9px] uppercase tracking-widest text-center mb-3" style={{ color: "rgba(212,175,55,0.40)" }}>
            മലയാളം · Malayalam Translation
          </p>
          <p
            className="text-sm leading-[2.2] text-left"
            style={{
              color: "rgba(220,220,220,0.80)",
              whiteSpace: "pre-wrap",
            }}
          >
            {malayalamText}
          </p>
        </div>
      )}
    </motion.div>
  );
}