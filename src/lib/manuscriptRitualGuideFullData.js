// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT RITUAL GUIDE — FULL EXTRACTION DATA
// ═══════════════════════════════════════════════════════════════
// Source: Kashf al-Haqa'iq (كشف الحقائق), pp.1-90, 3 PDFs
// Extracted via page-by-page AI vision scanning.
//
// ALL Arabic text is verbatim from the manuscript. No invention.
// Every entry includes source book + page number.
//
// STRUCTURE:
//   1. _general: Rules that apply to ALL recitations (auto-merged)
//   2. KASHF_FULL_MANTRAS: Mantra objects for display as GuidedRitualCards
//   3. Instructions registered in the cross-manuscript search registry
// ═══════════════════════════════════════════════════════════════
import { registerManuscriptInstructions } from "./manuscriptRitualGuideLaw";

const SOURCE = "Kashf al-Haqa'iq";
const SOURCE_AR = "كشف الحقائق";

// ═══════════════════════════════════════════════════════════════
// 1. GENERAL RULES — Apply to ALL recitations via _general key
// These auto-fill previously-empty fields in every GuidedRitualCard
// ═══════════════════════════════════════════════════════════════
const _general = {
  required_purification: [
    { text: "സ്ഥിരം ഉപവാസം, ആരാധന, ശുദ്ധി, വൃത്തി (വസ്ത്രം, ശരീരം, മുറി, കിടക്ക)", page: 9 },
    { text: "സുഗന്ധികൾ ഉപയോഗിക്കുക", page: 9 },
  ],
  required_fasting: [
    { text: "റിയാദയിൽ അപ്പം, ഒലിവ് എണ്ണ, ഉണക്കമുന്തിരി, ഈത്തപ്പഴം മാത്രം (ആവശ്യത്തിന് മാത്രം)", page: 33 },
  ],
  required_incense: [
    { text: "സഅാത്തിലെ ഗ്രഹത്തിന്റെ ധൂപം ഉപയോഗിക്കുക (ദിവസത്തിന്റേതല്ല)", page: 21 },
    { text: "പ്രവൃത്തിയുമായി ബന്ധപ്പെട്ട ധൂപം ഉപയോഗിക്കുക", page: 12 },
  ],
  required_materials: [
    { text: "ആത്മ മഷി: സാഫ്രൺ (3 ഭാഗം), കസ്തൂരി (1 ഭാഗം), ഗുലാബ് വെള്ളം, മാൻ രക്തം (അകർ ഫാസി). സൂര്യപ്രകാശം ഒഴിവാക്കുക", page: 52 },
  ],
  required_intention: [
    { text: "ശെയ്ഖിൽ പൂർണ്ണ വിശ്വാസം വേണം", page: 10 },
  ],
  conditions: [
    { text: "മൃഗങ്ങളുടെ ചിത്രങ്ങൾ (നായ, പൂച്ച, പൂവൻകോഴി, കഴുത) ഒഴിവാക്കുക", page: 9 },
    { text: "ശെയ്ഖിന്റെ ഇജാസ ആവശ്യം", page: 10 },
    { text: "ഇരുണ്ട, ചുരുങ്ങിയ സ്ഥലം ഉപയോഗിക്കുക", page: 43 },
  ],
  warnings: [
    { text: "താഴ്ന്ന ആത്മക്കളോട് കഠിനമായി സംസാരിക്കുക, സൗമ്യമായിട്ടല്ല", page: 32 },
    { text: "ആത്മക്കളിൽ നിന്ന് സംരക്ഷണത്തിന് അദ്കാർ അവസാനിപ്പിക്കരുത്", page: 11 },
  ],
  additional_notes: [
    { text: "സ്ഥലത്തെ ആത്മക്കളെ (സാക്കിൻ) മാറ്റുക — അവർ സ്ഥലം വിടാൻ കല്പന നൽകുക", page: 11 },
    { text: "സ്ഥലത്ത് ആയത്തുൽ കുർസിയും ഫാതിഹയും എഴുതിയ വട്ടം വരയ്ക്കുക", page: 33 },
  ],
};

// ═══════════════════════════════════════════════════════════════
// 2. MANTRA OBJECTS — For display as GuidedRitualCards
// ═══════════════════════════════════════════════════════════════

// Helper to create a mantra object
function M(id, type, page, arabic, purposeMl, purposeEn) {
  return { id, type, day_index: null, arabic_text: arabic, purpose_ml: purposeMl, purpose_en: purposeEn,
    source: { book: SOURCE_AR, book_en: SOURCE, page } };
}

// Helper to create instruction entry for a mantra
function I(category, titleMl, purposeMl, page, extra = {}) {
  return {
    category: [{ text: category, page }],
    title_ml: [{ text: titleMl, page }],
    purpose: [{ text: purposeMl, page }],
    introduction: [{ text: purposeMl, page }],
    expected_result: [{ text: purposeMl, page }],
    ...extra,
  };
}

// ── Dua & Notes ──
const MANTRA_DUA_KNOWLEDGE = M("kashf_p7_dua_knowledge", "dua", 7,
  "اللهم اجعل هذه العلوم خالصة لوجهك ، نافعة لمن قرأها ، مشرقة لمن تأملها ، وهب لنا فيها سكينة العلم ، وبركة الحكمة ، ونور البصيرة",
  "അറിവിൽ ബരകത്തും ജ്ഞാനവും തേടൽ", "Dua for seeking knowledge and wisdom");

const MANTRA_POETRY_CONCEAL = M("kashf_p8_poetry", "poetry", 8,
  "لمن أبوح بعلمي حين أذكره أم من أخص بما فيه من الزبد أما جهول فال يدري مواقعه أو عالم فهو ال يخلو من الحسد",
  "അറിവ് അർഹിക്കാത്തവർക്ക് മറയ്ക്കുക", "Poetry about concealing knowledge from the unworthy");

// ── Conditions & Protection ──
const MANTRA_CONDITIONS = M("kashf_p9_conditions", "conditions", 9,
  "ملازمة الصوم والعبادة والطهارة والنظافة ثوبا وبدنا وفراشا ومكانا",
  "ആത്മ കൃത്യങ്ങൾക്കുള്ള നിബന്ധനകൾ", "Conditions for spiritual work: fasting, worship, purity, cleanliness");

const MANTRA_IJAZA = M("kashf_p10_ijaza", "conditions", 10,
  "الإجازة من شيوخ العلم والاعتقاد الكلي في المرشد والإجازة والإرشاد منه إلى ما ال تهتدي له",
  "ശെയ്ഖിന്റെ ഇജാസ ആവശ്യം", "Permission (ijaza) from a spiritual guide is required");

const MANTRA_PROTECTION_ADHKAR = M("kashf_p11_protection", "protection", 11,
  "التحصين فيجب عليك أن ال تخلوا اوقاتك من الاذكار والاوراد التي يكون بها تحصين",
  "അദ്കാർ കൊണ്ടുള്ള സംരക്ഷണം", "Protection through constant adhkar and awrad");

const MANTRA_SADR_AMMAR = M("kashf_p11_sadr_ammam", "jinn_related", 11,
  "صرف العمار فاعلم أن الأماكن ال تخلوا من ساكن مكان وهم الجن من جميع الأصناف فسكان المكان ال يرضون أن يأخذ مكانهم أحد",
  "സ്ഥലത്തെ ആത്മക്കളെ മാറ്റൽ", "Clearing resident jinn (Sadr al-Ammar) before operations");

const MANTRA_INCENSE_GENERAL = M("kashf_p12_incense", "incense", 12,
  "إطلاق البخور المناسب",
  "ധൂപം ഉപയോഗിക്കൽ", "Using appropriate incense for the planet and operation");

const MANTRA_INCENSE_HOUR = M("kashf_p21_incense_hour", "incense", 21,
  "بخور العمل هو بخور الساعة وليس اليوم",
  "ധൂപം സഅാത്തിന്റേതാണ് ദിവസത്തിന്റേതല്ല", "Incense follows the planetary HOUR, not the day");

// ── Timing Rules (p.13) ──
const MANTRA_TIMING_LOVE = M("kashf_p13_love", "timing", 13,
  "المحبة والقبول إىل شخص واحد في ساعة الزهرة من يوم الجمعة",
  "സ്നേഹം — വെള്ളിയാഴ്ച ശുക്ര സഅാത്തിൽ", "Love & acceptance: Venus hour on Friday");

const MANTRA_TIMING_AUTHORITY = M("kashf_p13_authority", "timing", 13,
  "لجميع الناس مع اإلجالل والتعظيم في ساعة عطارد يوم الخميس",
  "ബഹുമാനം — വ്യാഴാഴ്ച ബുധ സഅാത്തിൽ", "Authority & respect: Mercury hour on Thursday");

const MANTRA_TIMING_COMPASSION = M("kashf_p13_compassion", "timing", 13,
  "عطفا بين اثنين في ساعة القمر يوم الجمعة",
  "അനുകമ്പ — വെള്ളിയാഴ്ച ചന്ദ്ര സഅാത്തിൽ", "Compassion between two: Moon hour on Friday");

const MANTRA_TIMING_NEEDS = M("kashf_p13_needs", "timing", 13,
  "قضاء حاجة عند شخص ذا مقام وجاه وسلطان في ساعة الشمس يوم األحد",
  "ആവശ്യം — ഞായറാഴ്ച സൂര്യ സഅാത്തിൽ", "Fulfilling needs from authorities: Sun hour on Sunday");

const MANTRA_TIMING_AWE = M("kashf_p13_awe", "timing", 13,
  "الهيبة مع الخوف والرعب في قلوب الناس في ساعة الشمس يوم المريخ",
  "ഭയം — ചൊവ്വാഴ്ച സൂര്യ സഅാത്തിൽ", "Awe & fear: Sun hour on Tuesday");

const MANTRA_TIMING_CONFLICT = M("kashf_p13_conflict", "timing", 13,
  "إيقاع الحرب والفتن والخصومة بين الناس في ساعة عطارد يوم عطارد",
  "ശത്രുത — ബുധാഴ്ച ബുധ സഅാത്തിൽ", "Conflict & discord: Mercury hour on Wednesday");

// ── Warnings & Fasting ──
const MANTRA_SPIRIT_PROTOCOL = M("kashf_p32_spirit_protocol", "warnings", 32,
  "يجب عليك عدم مخاطبتهم باللين بل تنظر إليهم سرا وأن تخاطبهم بالشدة أما العوارض والعمار والقرائن وأعوان الأعمال فال تخاطبهم إلا بالشدة والكلام الخشن والزجر والقهر والتهديد",
  "ആത്മക്കളോട് കഠിനമായി സംസാരിക്കുക", "Protocol for dealing with spirits: use harsh tone with lower spirits");

const MANTRA_FASTING_RIYADA = M("kashf_p33_fasting", "fasting", 33,
  "ان يقتصر أكلك مدة الرياضة على طعام كالخبز وزيت الزيتون والزبيب والتمر قدر الحاجة فقط",
  "റിയാദയിലെ ഭക്ഷണം: അപ്പം, ഒലിവ് എണ്ണ, ഉണക്കമുന്തിരി, ഈത്തപ്പഴം", "Diet during Riyada: bread, olive oil, raisins, dates only");

const MANTRA_PROTECTION_CIRCLE = M("kashf_p33_circle", "protection", 33,
  "أن يجعل حول سجادته دائرة مكتوب فيها آية الكرسي والفاتحة أحرف مفرقة بعضها متداخلة في بعضها وأن يحصن نفسه بحجاب من الحجب وأن يصرف العمار",
  "സംരക്ഷണ വട്ടം: ആയത്തുൽ കുർസിയും ഫാതിഹയും എഴുതിയ വട്ടം", "Protection circle: write Ayatul Kursi and Fatiha in a circle around prayer rug");

const MANTRA_LIGHTING = M("kashf_p43_lighting", "conditions", 43,
  "تجنب المصباح فظلمة المكان وضيقه يجعل النفس تسكن وتجمع الحواس ومن أراد أن يرى فعليه بزيارة مساجد العباد في نزوى",
  "ഇരുണ്ട, ചുരുങ്ങിയ സ്ഥലം ഉപയോഗിക്കുക", "Lighting: dark, narrow space for focus and psychic vision");

// ── Materials: Ink Preparation (p.52) ──
const MANTRA_INK_PREP = M("kashf_p52_ink", "materials", 52,
  "تأخذ عىل بركة هللا زعفران من النوع الممتاز األص يىل ومسك خام ودم الغزال وهو ما يعرف بـ العكر الفا يش أو دم األخوين وماء ورد وتخلط المسك الخام والزعفران عىل أن يكون الزعفران ثالثة أضعاف المسك وتدقهما ثم تخلطهم بعود خشب مع التقليب بماء ورد ثم تضيف دم الغزال وتخلطهم جيدا وتضعه ف حافظة او زجاجة معتمه واعلم أن العكر الفا يش أو دم األخوين ليس شرطا ، مع وجوب أن يكون عملك بعيدا عن ضوء الشمس",
  "ആത്മ മഷി തയ്യാറാക്കൽ: സാഫ്രൺ (3 ഭാഗം), കസ്തൂരി (1 ഭാഗം), ഗുലാബ് വെള്ളം, മാൻ രക്തം", "Spiritual ink: saffron (3 parts), musk (1 part), rose water, gazelle blood");

// ── Lunar Mansion Operations (p.54) — Moon in each zodiac ──
const ZODIAC_SAAT = [
  ["aries", "الحمل", "المريخ", "മേടം → ചൊവ്വ സഅാത്തിൽ", "Aries → Mars hour"],
  ["taurus", "الثور", "الزهرة", "രാശി → ശുക്ര സഅാത്തിൽ", "Taurus → Venus hour"],
  ["gemini", "الجوزاء", "عطارد", "മിഥുനം → ബുധ സഅാത്തിൽ", "Gemini → Mercury hour"],
  ["cancer", "الرسطان", "القمر", "കർക്കടകം → ചന്ദ്ര സഅാത്തിൽ", "Cancer → Moon hour"],
  ["leo", "الأأسد", "الشمس", "സിംഹം → സൂര്യ സഅാത്തിൽ", "Leo → Sun hour"],
  ["virgo", "العذراء", "عطارد", "കന്നി → ബുധ സഅാത്തിൽ", "Virgo → Mercury hour"],
  ["libra", "الميزان", "الزهرة", "തുലാം → ശുക്ര സഅാത്തിൽ", "Libra → Venus hour"],
  ["scorpio", "العقرب", "المريخ", "വൃശ്ചികം → ചൊവ്വ സഅാത്തിൽ", "Scorpio → Mars hour"],
  ["sagittarius", "القوس", "المشي ر", "ധനു → വ്യാഴ സഅാത്തിൽ", "Sagittarius → Jupiter hour"],
  ["capricorn", "الجدي", "زحل", "മകരം → ശനി സഅാത്തിൽ", "Capricorn → Saturn hour"],
  ["aquarius", "الدلو", "زحل", "കുംഭം → ശനി സഅാത്തിൽ", "Aquarius → Saturn hour"],
  ["pisces", "الحوت", "المشي ر", "മീനം → വ്യാഴ സഅാത്തിൽ", "Pisces → Jupiter hour"],
];

const MANTRAS_ZODIAC = ZODIAC_SAAT.map(([key, ar, planet, ml, en]) =>
  M(`kashf_p54_moon_${key}`, "lunar_mansion", 54,
    `اذا نزل القمر في ${ar} اقصد حاجتك ساعة ${planet}`,
    ml, en)
);

// ── Unlucky Days (p.57, p.59) ──
const MANTRA_MONTHLY_NAHS = M("kashf_p57_monthly_nahs", "nahs_days", 57,
  "أعلم أن كل شهر فيه سبعة أيام نحسة، هي المعبر عنها بالأيام الكوامل، وهي الأيام: 3، 5، 13، 16، 21، 24، 25 من كل شهر عربي",
  "പ്രതിമാസം നഹ്സ് ദിവസങ്ങൾ: 3, 5, 13, 16, 21, 24, 25", "Monthly unlucky days: 3, 5, 13, 16, 21, 24, 25 of every lunar month");

const MANTRA_ANNUAL_NAHS = M("kashf_p59_annual_nahs", "nahs_days", 59,
  "الثاني عشر من محرم والعاشر من صفر والرابع من ربيع الأول والثامن من ربيع الأخر والرابع من جمادي الأولى والثاني من جمادي الثانية والثالث والعشرين من شعبان والرابع والعشرين من رمضان والثامن من شوال والثامن والعشرين من ذي القعدة والثامن من ذي الحجة",
  "വാർഷിക നഹ്സ് ദിവസങ്ങൾ", "Annual unlucky days across the Islamic lunar calendar");

// ── Lunar Day Guidance (pp.60-65) — All 30 days ──
const LUNAR_DAYS = [
  [1, 60, "أول يوم من الشهر : سعد يصلح للقاء الأمراء ، و طلب الحوائج ، و الشراء و البيع ، و الزراعة و السفر وقيل أنه يوم مبارك خلق الله فيه آدم", "ദിവസം 1: സഅദ് — ഭരണകർത്താക്കളെ കാണൽ, ആവശ്യങ്ങൾ, വാങ്ങൽ, വിൽക്കൽ, കൃഷി, യാത്ര"],
  [2, 60, "الثاني منه : يصلح للسفر و طلب الحوائج وقيل أنه يوم نساء وتزويج وفيه خلقت حواء من آدم", "ദിവസം 2: സഅദ് — യാത്ര, ആവശ്യങ്ങൾ, വിവാഹം, വീടുവയ്ക്കൽ"],
  [3, 60, "الثالث منه : رديء لا يصلح لشيء وهو يوم نحس مستمر، فاتق فيه السلطان والبيع والشراء وطلب الحوائج، ولا تتعرض فيه لمعاملة ولا تشارك فيه أحدا", "ദിവസം 3: നഹ്സ് — എല്ലാം ഒഴിവാക്കുക, വീട്ടിൽ തുടരുക"],
  [4, 60, "الرابع منه : صالح للتزويج ويكره السفر فيه وقيل أنه يوم ولد فيه هابيل، وهو يوم صالح للصيد والزرع، ويستحب فيه البناء واتخاذ الماشية", "ദിവസം 4: സഅദ് — വിവാഹം, വേട്ട, കൃഷി, വീടുവയ്ക്കൽ (യാത്ര ഒഴിവാക്കുക)"],
  [5, 60, "الخامس منه : رديء نحس وقيل أنه ولد فيه قابيل الشقي وفيه قتل أخاه وهو نحس مستمر، فلا تبتدئ فيه بعمل", "ദിവസം 5: നഹ്സ് — പുതിയ തുടക്കങ്ങൾ ഒഴിവാക്കുക"],
  [6, 61, "السادس منه : مبارك يصلح للتزويج و مبارك لطلب الحوائج والسفر في البر والبحر، ومن سافر فيه رجع إلى أهله بما يحبه", "ദിവസം 6: സഅദ് — വിവാഹം, ആവശ്യങ്ങൾ, യാത്ര"],
  [7, 61, "السابع منه : مبارك مختار يصلح لكل ما يراد و يسعى فيه فاعمل فيه ما تشاء، وعالج ما تريد من عمل الكتابة", "ദിവസം 7: സഅദ് — എല്ലാം, കിതാബത്ത്, വീടുവയ്ക്കൽ, നടുക"],
  [8, 61, "الثامن : يوم صالح لكل حاجة من البيع والشراء، ومن دخل فيه على سلطان قضيت حاجته، ويكره فيه ركوب السفن في الماء", "ദിവസം 8: സഅദ് — വാങ്ങൽ, വിൽക്കൽ, ഭരണകർത്താക്കളെ കാണൽ (കപ്പൽ ഒഴിവാക്കുക)"],
  [9, 61, "التاسع منه : مبارك يصلح لكل ما يريده الإنسان، ومن سافر فيه رزق مالا و يرى في سفره كل خير", "ദിവസം 9: സഅദ് — എല്ലാം, യാത്ര, സമ്പത്ത്"],
  [10, 61, "العاشر : صالح لكل حاجة، سوى الدخول على السلطان، ومن فر فيه من السلطان أخذ، وهو جيد للشراء و البيع", "ദിവസം 10: സഅദ് — വാങ്ങൽ, വിൽക്കൽ (ഭരണകർത്താക്കളെ കാണരുത്)"],
  [11, 61, "الحادي عشر : يصلح للشراء والبيع، و لجميع الحوائج و للسفر، ما خلا الدخول على السلطان", "ദിവസം 11: സഅദ് — വാങ്ങൽ, വിൽക്കൽ, യാത്ര (ഭരണകർത്താക്കളെ കാണരുത്)"],
  [12, 62, "الثاني عشر : يوم صالح مبارك، فاطلبوا فيه حوائجكم واسعوا لها، فإنها تقضى وقيل أنه يصلح للتزويج وفتح الحوانيت والشركة", "ദിവസം 12: സഅദ് — ആവശ്യങ്ങൾ, വിവാഹം, കട തുറക്കൽ, പങ്കാളിത്തം"],
  [13, 62, "الثالث عشر : يوم نحس مستمر، فاتقوا فيه جميع الأعمال، فيه المنازعات والحكومة ولقاء السلطان", "ദിവസം 13: നഹ്സ് — എല്ലാം ഒഴിവാക്കുക"],
  [14, 62, "الرابع عشر : جيد، للحوائج صالح لكل شيء لطلب العلم والشراء والبيع والاستقراض والقرض، وركوب البحر", "ദിവസം 14: സഅദ് — അറിവ്, വാങ്ങൽ, വിൽക്കൽ, കടം, കടൽയാത്ര"],
  [15, 62, "الخامس عشر : صالح، لكل حاجة تريدها، فاطلبوا فيه حوائجكم فإنها تقضى إلا أن هناك من قال أنه يوم محذور", "ദിവസം 15: സഅദ് — ആവശ്യങ്ങൾ (ചിലർ മുന്നറിയിപ്പ് നൽകുന്നു)"],
  [16, 62, "السادس عشر : رديء، مذموم لكل شيء فهو يوم نحس من سافر فيه هلك، ويصلح للتجارة والبيع والمشاركة", "ദിവസം 16: നഹ്സ് — യാത്ര മരണം; വ്യാപാരം മാത്രം ഗുണം"],
  [17, 62, "السابع عشر : صالح، مختار فاطلبوا فيه ما شئتم، و تزوجوا، وبيعوا و اشتروا، و ازرعوا و ابنوا، و ادخلوا على السلطان", "ദിവസം 17: സഅദ് — എല്ലാം (തർക്കം ഒഴിവാക്കുക)"],
  [18, 63, "الثامن عشر : مختار، صالح للسفر و طلب الحوائج، و من خاصم فيه عدوه خصمه و غلبه", "ദിവസം 18: സഅദ് — യാത്ര, ആവശ്യങ്ങൾ, തർക്കത്തിൽ വിജയം"],
  [19, 63, "التاسع عشر : مختار، صالح لكل عمل، ومن ولد فيه يكون مباركا وهو يوم سعيد ولد فيه إسحاق بن إبراهيم", "ദിവസം 19: സഅദ് — എല്ലാം, യാത്ര, അറിവ്"],
  [20, 63, "العشرون : جيد، مختار للحوائج، و السفر، و البناء، و الغرس، و العرس، و الدخول على السلطان", "ദിവസം 20: സഅദ് — ആവശ്യങ്ങൾ, യാത്ര, വീടുവയ്ക്കൽ, വിവാഹം"],
  [21, 63, "الحادي و العشرون : يوم نحس مستمر لا يطلب فيه حاجة، يتفه السلطان، ومن سافر فيه لم يرجع", "ദിവസം 21: നഹ്സ് — യാത്ര മടങ്ങിവരില്ല"],
  [22, 63, "الثاني و العشرون : مختار صالح للشراء و البيع و لقاء السلطان، و السفر و الصدقة", "ദിവസം 22: സഅദ് — വാങ്ങൽ, വിൽക്കൽ, ഭരണകർത്താക്കളെ കാണൽ, യാത്ര, ദാനം"],
  [23, 64, "الثالث و العشرون : مختار جيد، خاصة للتزويج، و التجارات كلها، و الدخول على السلطان، ولد فيه يوسف", "ദിവസം 23: സഅദ് — വിവാഹം, വ്യാപാരം, ഭരണകർത്താക്കളെ കാണൽ"],
  [24, 64, "الرابع و العشرون : يوم مشئوم رديء نحس لكل أمر يطلب فيه، ولد فيه فرعون", "ദിവസം 24: നഹ്സ് — എല്ലാം ഒഴിവാക്കുക"],
  [25, 64, "الخامس و العشرون : رديء مذموم يحذر فيه من كل شيء فهو نحس رديء فلا تطلب فيه حاجة، واحفظ فيه نفسك فهو يوم شديد البلاء", "ദിവസം 25: നഹ്സ് — വളരെ അപകടകരം, സ്വയം സംരക്ഷിക്കുക"],
  [26, 64, "السادس و العشرون : صالح لكل حاجة، سوى التزويج و السفر، وعليكم بالصدقة فيه", "ദിവസം 26: സഅദ് — എല്ലാം (വിവാഹവും യാത്രയും ഒഴിവാക്കുക), ദാനം"],
  [27, 64, "السابع و العشرون : جيد مختار للحوائج، و لكل ما يراد و لقاء السلطان صالح لكل أمر وحاجة", "ദിവസം 27: സഅദ് — എല്ലാം, ഭരണകർത്താക്കളെ കാണൽ"],
  [28, 64, "الثامن و العشرون : ممزوج وقيل أنه يوم صالح مبارك لكل أمر وحاجة، ولد فيه يعقوب", "ദിവസം 28: സഅദ് — എല്ലാം"],
  [29, 65, "التاسع و العشرون : مختار جيد لكل حاجة، ومن مرض فيه برأ سريعا، و من سافر فيه أصاب مالا كثيرا، ولا يكتب فيه وصية", "ദിവസം 29: സഅദ് — എല്ലാം, യാത്ര, സൗഖ്യം (ഉയിൽപ്പത്രം ഒഴിവാക്കുക)"],
  [30, 65, "الثلاثون : مختار، جيد لكل شيء، ولكل حاجة من شراء و بيع، و زرع و تزويج، ولا تسافر فيه", "ദിവസം 30: സഅദ് — എല്ലാം (യാത്ര ഒഴിവാക്കുക)"],
];

const MANTRAS_LUNAR_DAYS = LUNAR_DAYS.map(([day, page, ar, ml]) =>
  M(`kashf_p${page}_day${day}`, "lunar_day", page, ar, ml, `Lunar day ${day} guidance`)
);

// ═══════════════════════════════════════════════════════════════
// 3. ALL MANTRA OBJECTS — Exported for display
// ═══════════════════════════════════════════════════════════════
export const KASHF_FULL_MANTRAS = [
  MANTRA_DUA_KNOWLEDGE,
  MANTRA_POETRY_CONCEAL,
  MANTRA_CONDITIONS,
  MANTRA_IJAZA,
  MANTRA_PROTECTION_ADHKAR,
  MANTRA_SADR_AMMAR,
  MANTRA_INCENSE_GENERAL,
  MANTRA_INCENSE_HOUR,
  MANTRA_TIMING_LOVE,
  MANTRA_TIMING_AUTHORITY,
  MANTRA_TIMING_COMPASSION,
  MANTRA_TIMING_NEEDS,
  MANTRA_TIMING_AWE,
  MANTRA_TIMING_CONFLICT,
  MANTRA_SPIRIT_PROTOCOL,
  MANTRA_FASTING_RIYADA,
  MANTRA_PROTECTION_CIRCLE,
  MANTRA_LIGHTING,
  MANTRA_INK_PREP,
  ...MANTRAS_ZODIAC,
  MANTRA_MONTHLY_NAHS,
  MANTRA_ANNUAL_NAHS,
  ...MANTRAS_LUNAR_DAYS,
];

// ═══════════════════════════════════════════════════════════════
// 4. INSTRUCTION ENTRIES — Registered in cross-manuscript search
// ═══════════════════════════════════════════════════════════════
const instructions = { _general };

// Build instruction entry for each mantra
KASHF_FULL_MANTRAS.forEach(mantra => {
  const page = mantra.source?.page;
  instructions[mantra.id] = I(
    // Category derived from type via autoClassifyEntry (imported separately)
    // Store category directly for clarity
    ({
      dua: 'Dua', poetry: 'Notes', conditions: 'Conditions', protection: 'Protection',
      jinn_related: 'Jinn Related', incense: 'Incense', timing: 'Timing',
      warnings: 'Warnings', fasting: 'Fasting', materials: 'Powders',
      lunar_mansion: 'Lunar Mansion Related', lunar_day: 'Timing', nahs_days: 'Warnings',
    })[mantra.type] || 'Other',
    mantra.purpose_ml,
    mantra.purpose_ml,
    page,
    {
      arabic_word_explanations: mantra.purpose_en ? [{ text: mantra.purpose_en, page }] : [],
    }
  );
});

// Register in the cross-manuscript search registry
registerManuscriptInstructions("kashf_full_extraction", SOURCE, instructions);

// Export count for verification
export const KASHF_FULL_ENTRY_COUNT = KASHF_FULL_MANTRAS.length;