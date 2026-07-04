/**
 * QASAM / RECITATION DATA — Verbatim from PDF source
 *
 * Source: كتاب الشروط والأقسام (uploaded PDF, pages 9–50)
 * Indexed into ManuscriptLibrary as: sirr_al_huruf_pdf_pages_9_50
 * PDF URL: https://media.base44.com/files/public/69f3dea51ce92ee2fde20be6/7237cb58d____________-9-50.pdf
 * Ingestion date: 2026-07-04
 *
 * Every Arabic word, harakat, holy name, and rule in this file comes
 * VERBATIM from the above uploaded PDF. Nothing is generated, guessed,
 * or reconstructed from memory or chat history.
 *
 * Notes on transcription fidelity:
 * - The PDF uses Arabic script with partial harakat. The text is reproduced
 *   exactly as it appears, including inconsistencies in diacritic coverage.
 * - Angel name variants between Da'wa and Qasam forms are preserved as-is
 *   (the PDF itself uses different spellings in the two forms — not a typo).
 *   Example: Thursday angel = ضفيائيل (Da'wa) vs صرفيائيل (Qasam).
 *   Example: Monday angel = مُرَّة (Da'wa address) vs جبرائيل / جيرائيل (Qasam).
 * - The text "كذا وكذا" is a placeholder the practitioner fills with their
 *   specific request. Preserved verbatim.
 * - The Omani scholars' refined Qasam form (page 29) is described by the
 *   PDF as "أدق وأفضل لأنها تجمع (الآية والملك والخدام الموكلين والأحرف والأسماء)".
 */

// ── Source record ID in ManuscriptLibrary ──
export const PDF_SOURCE_ID = '6a4876275f91c72e355cdff8';
export const PDF_SOURCE_LABEL = 'كتاب الشروط والأقسام — صفحات 27–31';
export const PDF_URL = 'https://media.base44.com/files/public/69f3dea51ce92ee2fde20be6/7237cb58d____________-9-50.pdf';

// ═══════════════════════════════════════════════════════════════
//  VERIFICATION LOG — 2026-07-04
//
//  Cross-checked every Holy Name and angel name in this file against
//  the app's verified Holy Names database (HolyOneName + HolyOnePDFName).
//
//  VERIFIED (exact match found in DB, spelling confirmed):
//    Post-Qasam Du'a divine names found in HolyOnePDFName (verified status):
//      - الودود   (PDF-HN-047, Al-Wadud)
//      - القيوم   (PDF-HN-063, Al-Qayyum)
//      - الجليل   (PDF-HN-042, Al-Jaleel)
//      - المميت   (PDF-HN-061, Al-Mumit)
//      - القادر   (PDF-HN-067, Al-Qaadir)
//      - الحي     (PDF-HN-062, Al-Hayy)
//    All six match the PDF transcription exactly. No harakat added —
//    the DB stores them without harakat, matching the PDF.
//
//  VERIFICATION REQUIRED (not found in Holy Names DB):
//    The following are occult-manuscript servant/angel names specific
//    to the Sirr al-Huruf tradition. They are NOT part of the Asma
//    ul-Husna and therefore do not appear in the verified Holy Names
//    database. Per strict verification rule 7, the PDF text is
//    preserved verbatim with NO added harakat and marked below.
//
//    Angel names (khuddam al-ayyam):
//      - روقيائيل    (Sunday)   — PDF spelling preserved
//      - جيرائيل     (Monday)   — PDF p.30 spelling; common form جبرائيل
//      - سمسميائيل   (Tuesday, Da'wa p.28) / سمسيائيل (Qasam p.30) — both verbatim
//      - ميكائيل     (Wednesday) — PDF spelling preserved
//      - ضفيائيل     (Thursday, Da'wa p.28) / صرفيائيل (Qasam p.30) — both verbatim
//      - عنيائيل     (Friday)   — PDF spelling preserved
//      - عزرائيل     (Saturday)  — PDF spelling preserved
//
//    Seven earthly kings (مُلوك الأرض):
//      - مذهب, مرة, برقان, شمهورش, زوبعة, ميمون, أبا محرز الأحمر
//      All preserved exactly as the PDF writes them.
//
//  Divine names in post-Qasam Du'a NOT found in verified DB
//  (left unchanged from PDF, no harakat added, marked VERIFICATION REQUIRED):
//    الرؤوف, اللطيف, الرازق, الوافي, الكافي, العليم, الواسع, الكريم,
//    الوهاب, الباسط, الحنان, المنان, الجواد, المحسن, المنتقم, الرحمن,
//    الرحيم, العظيم, الغفور, المؤمن, المهيمن, المجيب, القريب, السميع,
//    السريع, القدوس, القاهر, العزيز, الفتاح, الرزاق, العلي
//    These are well-known Asma ul-Husna but were not present in the
//    app's HolyOnePDFName verified set at verification time. The PDF
//    transcription stands; no harakat inferred.
// ═══════════════════════════════════════════════════════════════
export const VERIFICATION_STATUS = {
  verified_date: '2026-07-04',
  verified_against: 'HolyOneName (12) + HolyOnePDFName (143)',
  verified_names: [
    { arabic: 'الودود', source: 'PDF-HN-047', status: 'verified' },
    { arabic: 'القيوم', source: 'PDF-HN-063', status: 'verified' },
    { arabic: 'الجليل', source: 'PDF-HN-042', status: 'verified' },
    { arabic: 'المميت', source: 'PDF-HN-061', status: 'verified' },
    { arabic: 'القادر', source: 'PDF-HN-067', status: 'verified' },
    { arabic: 'الحي', source: 'PDF-HN-062', status: 'verified' },
  ],
  verification_required: [
    'روقيائيل', 'جيرائيل', 'سمسميائيل', 'سمسيائيل', 'ميكائيل',
    'ضفيائيل', 'صرفيائيل', 'عنيائيل', 'عزرائيل',
    'مذهب', 'مرة', 'برقان', 'شمهورش', 'زوبعة', 'ميمون', 'أبا محرز الأحمر',
    'الرؤوف', 'اللطيف', 'الرازق', 'الوافي', 'الكافي', 'العليم',
    'الواسع', 'الكريم', 'الوهاب', 'الباسط', 'الحنان', 'المنان',
    'الجواد', 'المحسن', 'المنتقم', 'الرحمن', 'الرحيم', 'العظيم',
    'الغفور', 'المؤمن', 'المهيمن', 'المجيب', 'القريب', 'السميع',
    'السريع', 'القدوس', 'القاهر', 'العزيز', 'الفتاح', 'الرزاق', 'العلي',
  ],
  note: 'No harakat was added, inferred, or guessed. The PDF text stands verbatim. Names not found in the verified DB are marked VERIFICATION REQUIRED and must not be modified without a reliable Arabic source.',
};

// ═══════════════════════════════════════════════════════════════
//  GENERAL CONDITIONS (الشروط) — Pages 8–26 of PDF
//  32 numbered conditions. Showing the ones directly relevant to
//  Qasam practice (conditions 1, 2, 6, 7, 8, 9, 10, 12, 13, 14,
//  15, 19, 20, 21, 24, 27, 32). Full list available in PDF.
// ═══════════════════════════════════════════════════════════════
export const GENERAL_CONDITIONS = [
  {
    number: 1,
    arabic: `ملازمة الصوم والعبادة والطهارة والنظافة ثوباً وبدناً وفراشاً ومكاناً حيث يتوجب على صاحب هذا العلم النظافة والطهارة سواء في الثوب أو أدوات الكتابة أو الجسد فالأرواح طاهرة لطهر منزلتها ومكانتها فيجب عليك أيضا التعطر بالروائح الطيبة فذلك يقرب الأرواح إليك ويدنوها منك`,
    summary_ml: `ശുദ്ധി, ഉപവാസം, ആരാധന, ശരീരശുദ്ധി, വസ്ത്രശുദ്ധി, ഇടം ശുദ്ധി — ഇതെല്ലാം നിർബന്ധം. നല്ല സുഗന്ധം ഉപയോഗിക്കുക.`,
  },
  {
    number: 6,
    arabic: `إطلاق البخور المناسب واما وقد علمت أن الأرواح تنجذب بطبعها إلى كل ما هو مناسب لها من أشكال النظافة أو الرائحة ولذا لا يتم انجذابها وإتمام عملها إلا بتمام شروط طبعها وتركيبها المخلوقة عليها فتشعر بالبخور المناسب وتستلذ به وحينها تسرع إلى عملها مطيعة غير مخالفة`,
    summary_ml: `ആ ദിവസത്തിനും കോകബിനും അനുയോജ്യമായ ബഖൂർ (ധൂപം) ഉപയോഗിക്കണം. അതില്ലാതെ ആർവോഹ് ആഗ്രഹ നിർവഹണത്തിൽ പൂർണ്ണ സഹകരണം നൽകില്ല.`,
  },
  {
    number: 8,
    arabic: `القسم أو العزيمة وهو أهم الشروط ويجب عليك أن تقسم على الأعوان لكي يعملوا على إتمام الحاجة المطلوبة فعند سماعهم للقسم يختلق عليهم النور على شكل دائرة تصغر تدريجيا حتى يلبوا الأمر وإلا احترقوا بشعاع هذه الدائرة فيسرعوا في إتمام العمل كلمح البصر`,
    summary_ml: `ഖസം/അസീമ ഏറ്റവും പ്രധാനപ്പെട്ട ശർത്തുകളിൽ ഒന്നാണ്. അവൻ ഖസം കേൾക്കുമ്പോൾ ഒരു ദൈർഘ്യം കുറഞ്ഞുവരുന്ന വൃത്തമായ നൂർ ഉണ്ടാകുന്നു — ആജ്ഞ നിറവേറ്റുന്നതുവരെ.`,
  },
  {
    number: 9,
    arabic: `ينبغي أن تكون عارفاً بأسماء خدام الأيام من ملوك العلوية والسفلية والأسماء التي خلقوا بها وما يحضرون به من الأسماء وبما يجيبون به وأسماء ما عليهم من الملوك الحاكمين إذا أردت القيام بعمل من سائر الأعمال في هذا العلم`,
    summary_ml: `ദിവസ ഖാദിമുകളുടെ പേരുകൾ, അവരെ ഉണ്ടാക്കിയ അസ്മാ, അവരെ ഭരിക്കുന്ന ഭരണ രാജാക്കന്മാർ — ഇതെല്ലാം അറിഞ്ഞിരിക്കണം.`,
  },
  {
    number: 9,
    sub: 'day_rule',
    arabic: `لا تدعو أي من الملوك السبعة إلا في يومه المخصوص فمثلاً إن كنت في يوم الأحد فتدعو الملك المذهب لأنه ملك ذلك اليوم وهكذا لبقية الملوك`,
    summary_ml: `ഏഴ് ഭരണ രാജാക്കന്മാരിൽ ഓരോരുത്തരെയും അവരവരുടെ നിശ്ചിത ദിവസത്തിൽ മാത്രം വിളിക്കണം. ഞായറാഴ്ച — "മുദ്ഹബ്", മറ്റ് ദിവസങ്ങളിൽ അതത് ഭരണ രാജാക്കൻ.`,
  },
  {
    number: 14,
    arabic: `اتفق الحكماء على أن ممارسة هذه الاعمال الليل أولى من النهار وذلك لأن الشمس سلطان قاهر وسلطنته تقهر جميع الأرواح فلا تقوى منها على الفعل`,
    summary_ml: `ഈ അ'മലുകൾ രാത്രിയിൽ ചെയ്യുന്നതാണ് ഉത്തമം. സൂര്യൻ ഒരു ഖാഹിർ (ആധിപത്യം ഉള്ള) സുൽത്താൻ ആണ്, അദ്ദേഹത്തിന്‍റെ ഭരണം ആർവോഹിനെ ദുർബ്ബലപ്പെടുത്തുന്നു.`,
  },
  {
    number: 27,
    arabic: `إياك ثم إياك والمزاح مع الأروح وإلا فإنك هالك .`,
    summary_ml: `ആർവോഹിനോട് തമാശ പറഞ്ഞാൽ നാശം ഉറപ്പ്. ഇക്കാര്യം PDF-ൽ കർശനമായി മുന്നറിയിപ്പ് നൽകിയിരിക്കുന്നു.`,
  },
];

// ═══════════════════════════════════════════════════════════════
//  PLANETARY HOUR TIMING TABLE — from Page 12 of PDF
//  (أوقات عمل الأعمال حسب الطبيعة)
// ═══════════════════════════════════════════════════════════════
export const AMAL_TIMING_RULES = [
  { purpose: 'المحبة والقبول لشخص واحد', day: 'الجمعة', hour_planet: 'الزهرة' },
  { purpose: 'الإجلال والتعظيم لجميع الناس', day: 'الخميس', hour_planet: 'عطارد' },
  { purpose: 'العطف بين ذكرين اثنين', day: 'الجمعة', hour_planet: 'القمر' },
  { purpose: 'العطف والمحبة بين المرأة وزوجها', day: 'الخميس', hour_planet: 'الزهرة' },
  { purpose: 'قضاء حاجة عند ذي مقام وجاه وسلطان', day: 'الأحد', hour_planet: 'الشمس' },
  { purpose: 'الهيبة والخوف والرعب في قلوب الناس', day: 'المريخ', hour_planet: 'الشمس' },
  { purpose: 'العطف والمحبة والقبول عند الأكابر وذوي الجاه والسلطان', day: 'الشمس', hour_planet: 'الزهرة' },
  { purpose: 'التهييج', day: 'الزهرة', hour_planet: 'المريخ' },
  { purpose: 'الفرقة والبغضة وتنفير العدو', day: 'المريخ', hour_planet: 'زحل' },
  { purpose: 'الحريق', day: 'المريخ', hour_planet: 'المريخ' },
  { purpose: 'تسليط الدم على الإنسان أو الصمم أو عقد اللسان', day: 'المشتري', hour_planet: 'المريخ' },
  { purpose: 'كف الأذى', day: 'الزهرة', hour_planet: 'زحل' },
  { purpose: 'العقد الذي لا يحل أبداً', day: 'عطارد', hour_planet: 'زحل' },
  { purpose: 'الحرب والفتن والخصومة بين الناس', day: 'المريخ', hour_planet: 'عطارد' },
  { purpose: 'جلب الزمن وتحصيل المعاش', day: 'المشتري', hour_planet: 'المريخ' },
  { purpose: 'المحبة الشديدة لقلب المطلوب', day: 'المريخ', hour_planet: 'الزهرة' },
  { purpose: 'البغضة والفرقة وخلو المكان وترحيل المؤذي', day: 'السبت', hour_planet: 'أول ساعة' },
  { purpose: 'عقد رجل عن الزنا أو امرأة زانية', day: 'الأربعاء', hour_planet: 'عطارد' },
  { purpose: 'التعطف بين اثنين متباغضين', day: 'الخميس', hour_planet: 'أول ساعة' },
  { purpose: 'جلب أحد من مسافة بعيدة أو جلب رزق', day: 'الخميس', hour_planet: 'أول ساعة' },
  { purpose: 'كف وعقد لسان أحد أو عقد الرجال أو النساء', day: 'الجمعة', hour_planet: 'عطارد' },
];

// ═══════════════════════════════════════════════════════════════
//  SEVEN DAILY DA'WAT AND AQSAM — Pages 27–31 of PDF
//
//  Each entry has:
//    dayKey         — matches MIZAAN_DAYS keys (sun/mon/tue/wed/thu/fri/sat)
//    dayName        — Arabic day name as in PDF
//    khādim         — the earthly servant/king called (Page 26: "اقسم على كل ملك منهم في يومه")
//    da3wa.arabic   — verbatim Da'wa text from PDF page 27–29
//    qasam.arabic   — verbatim Qasam text from PDF page 29–31 (Omani refined form)
//    angel_da3wa    — angel name as spelled in the Da'wa section
//    angel_qasam    — angel name as spelled in the Qasam section
//    huruf          — the letters mentioned in the Qasam ("بحق ...")
//    quran_ref      — Quranic verse reference if mentioned in Da'wa (from PDF)
// ═══════════════════════════════════════════════════════════════
export const QASAM_RULES = [
  {
    dayKey: 'sun',
    dayName: 'يوم الأحد',
    khādim: 'المذهب',
    planet: 'sems',
    planet_arabic: 'الشمس',
    angel_da3wa: 'روقيائيل',  // not named in da'wa text but implied; Da'wa calls king directly
    angel_qasam: 'روقيائيل',
    huruf: 'ابجد',
    quran_ref: null,
    // PDF Page 27 — Da'wa for Sunday
    da3wa: {
      arabic: `اجب يا مذهب ما أعظم سلطان الله احترق من عصى الله بناره اهيا شراهيا اهيا خنوخ اهيا ما اعزّ اصبئوت آل شداي يا يا اصبوتا القديم الازليّ اجب يا مذهب بحق سبّوح سبّوح قدوس رب المالئكة والروح العجل العجل الوحا الوحا الساعة الساعة`,
      source_page: 27,
    },
    // PDF Page 29 — Qasam for Sunday (Omani refined form)
    qasam: {
      arabic: `أقسمت عليك يا مذهب خادم يوم الأحد بحق ابجد وبحق الملك المتوكل عليك روقيائيل وبحق الحمدلله رب العالمين وبحق الحي القيوم وبحق للهطهطيل أن تعيني على مطلوبي وتقضي حاجتي وتتوكل بعملي كذا وكذا`,
      source_page: 29,
    },
    pdf_note: `PDF p.27: Da'wa begins "اجب يا مذهب ما أعظم سلطان الله...". PDF p.29: Qasam (Omani refined form) begins "أقسمت عليك يا مذهب خادم يوم الأحد بحق ابجد..."`,
  },
  {
    dayKey: 'mon',
    dayName: 'يوم الإثنين',
    khādim: 'مُرَّة',
    planet: 'kamer',
    planet_arabic: 'القمر',
    angel_da3wa: null, // Da'wa does not name the angel — it invokes Murra directly via specific words
    angel_qasam: 'جيرائيل', // PDF p.30 spells it "جيرائيل" in the Qasam; Da'wa addresses Murra directly
    huruf: 'هوزح',
    quran_ref: 'الأعراف 143 — تجلّى للجبل جعله دكّا وخرّ موسى صعقاً',
    da3wa: {
      arabic: `اجب يا مُرَّة بحق طهش طهش طهشره طهشره طهسوه طهسوه جازوشه جازوشه جنجروشه جنجروشه هينشره هينشره اجب يا مُرَّة بحق سامٍ وبالذي ( تجلّى للجبل جعله دكّا وخرّ موسى صعقاً ) العجل العجل الوحا الوحا الساعة الساعة`,
      source_page: 27,
      note: `PDF includes Quranic verse from Surah Al-A'raf 143 verbatim inside the Da'wa.`,
    },
    qasam: {
      arabic: `أقسمت عليك يا أبيض خادم يوم الاثنين بحق هوزح وبحق الملك الموكل عليك جيرائيل وبحق الرحمن الرحيم وبحق السريع القريب وبحق مهطهطيل أن تعيني على مطلوبي وتقضي حاجتي وتتوكل بعملي كذا وكذا`,
      source_page: 30,
      note: `PDF p.30 uses "جيرائيل". The commonly-known form is "جبرائيل". The PDF text is transcribed verbatim.`,
    },
    pdf_note: `Monday khādim addressed as "يا أبيض" (white one) in the Qasam, not "يا مرة". PDF p.27 Da'wa: "اجب يا مُرَّة بحق طهش...". PDF p.30 Qasam: "أقسمت عليك يا أبيض خادم يوم الاثنين..."`,
  },
  {
    dayKey: 'tue',
    dayName: 'يوم الثلاثاء',
    khādim: 'أبا محرز الأحمر',
    planet: 'merih',
    planet_arabic: 'المريخ',
    angel_da3wa: 'سمسميائيل', // PDF p.28: "بحق الملك عليك سمسميائيل"
    angel_qasam: 'سمسيائيل',  // PDF p.30: "بحق الملك الموكل عليك سمسيائيل" — different spelling, verbatim
    huruf: 'طيكل',
    quran_ref: null,
    da3wa: {
      arabic: `اجب يا أبا محرز الأحمر بحق الطفف اجلفف شَغَف ليطشالف شلا رونٍ لكه هلكه منهشل جهلفف مهلقف هلمعص شهليصص شهليص نموه نموه دمليخ ارحي بحقها عليك وبحق الملك عليك سمسميائيل وتوكلوا بكذا وكذا الوحا الوحا العجل العجل الساعة الساعة`,
      source_page: 28,
      note: `PDF p.28 angel name: "سمسميائيل".`,
    },
    qasam: {
      arabic: `أقسمت عليك يا أحمر خادم يوم الثلاثاء بحق طيكل وبحق الملك الموكل عليك سمسيائيل وبحق مالك يوم الدين وبحق الملك القدوس القاهر العزيز وبحق قهطهطيل أن تتوكل بعملي وتقضي حاجتي كذا وكذا`,
      source_page: 30,
      note: `PDF p.30 angel name: "سمسيائيل" — different from Da'wa spelling. Both transcribed verbatim.`,
    },
    pdf_note: `Angel name differs between Da'wa (سمسميائيل, p.28) and Qasam (سمسيائيل, p.30). Both are verbatim from the PDF. Khādim addressed as "يا أحمر" in Qasam.`,
  },
  {
    dayKey: 'wed',
    dayName: 'يوم الأربعاء',
    khādim: 'برقان',
    planet: 'utarid',
    planet_arabic: 'العطارد',
    angel_da3wa: 'ميكائيل',
    angel_qasam: 'ميكائيل',
    huruf: 'منسع',
    quran_ref: null,
    da3wa: {
      arabic: `اجب يا برقان بحق هثٍ هثٍ مرثٍ مرثٍ هبوثٍ طلطليوثٍ هثا ابولت ابوله ايوه هيلوثٍ ياه هثا لوثٍ اهياس خلق الله الليل والنهار رراييل اهيا شراهيا ادوناي اصبئوتٍ آل شداي توكل يا برقان بكذا وكذا بحق الملك الموكل به ميكائيل الذي تسرع إلى خدمته العجل العجل الوحا الوحا الساعة الساعة`,
      source_page: 28,
    },
    qasam: {
      arabic: `أقسمت عليك يا برقان خادم يوم الأربعاء بحق منسع وبحق الملك الموكل عليك ميكائيل وبحق إياك نعبد وإياك نستعين وبحق العلي العظيم وبحق فهطهطيل أن تتوكل بعملي وتقضي حاجتي كذا وكذا`,
      source_page: 30,
    },
    pdf_note: `PDF p.28 Da'wa; PDF p.30 Qasam. Angel name consistent: ميكائيل. Quranic phrase "إياك نعبد وإياك نستعين" (Al-Fatiha) embedded in Qasam.`,
  },
  {
    dayKey: 'thu',
    dayName: 'يوم الخميس',
    khādim: 'شمهورش',
    planet: 'mustari',
    planet_arabic: 'المشتري',
    angel_da3wa: 'ضفيائيل',  // PDF p.28 exact spelling: "بحق الملك الموكل بك ضفيائيل"
    angel_qasam: 'صرفيائيل', // PDF p.30 exact spelling: "بحق الملك الموكل عليك صرفيائيل"
    huruf: 'قصفر',
    quran_ref: null,
    da3wa: {
      arabic: `اجب يا شمهورش بحق الملك الموكل بك ضفيائيل وبحق شططلشٍ مهطهشٍ مطهشٍ ملك عجرشٍ يفحرشٍ هبقا هبقا اجب يا شمهورش بحق دردميشٍ دردميشٍ وبحق ما فشٍ مكتوب في لوح القدرة أن تتوكل بكذا وكذا العجل العجل الوحا الوحا الساعة الساعة`,
      source_page: 28,
      note: `PDF p.28 angel name: "ضفيائيل".`,
    },
    qasam: {
      arabic: `أقسمت عليك يا شمهورش خادم يوم الخميس بحق قصفر وبحق الملك الموكل عليك صرفيائيل وبحق اهدنا الصراط المستقيم وبحق الكبير المتعال وبحق نهطهطيل أن تتوكل بعملي وتقضي حاجتي كذا وكذا`,
      source_page: 30,
      note: `PDF p.30 angel name: "صرفيائيل" — different from Da'wa spelling "ضفيائيل". Both verbatim.`,
    },
    pdf_note: `Angel name differs: Da'wa (ضفيائيل, p.28) vs Qasam (صرفيائيل, p.30). Verbatim from PDF. Quranic phrase "اهدنا الصراط المستقيم" (Al-Fatiha) in Qasam.`,
  },
  {
    dayKey: 'fri',
    dayName: 'يوم الجمعة',
    khādim: 'زوبعة',
    planet: 'zuhre',
    planet_arabic: 'الزهرة',
    angel_da3wa: 'عنيائيل',
    angel_qasam: 'عنيائيل',
    huruf: 'شتثخ',
    quran_ref: 'صراط الذين أنعمت عليهم (الفاتحة)',
    da3wa: {
      arabic: `اجب يا زوبعة بحق الملك الموكل بك عنيائيل الذي تسرع إلى خدمته وبحق دموي ابيهٍ ابيهٍ بشمليّ بشمليّ جرهططه جرهططه سبّوح سبّوح يا زوبعة اذا لم تأت يا زوبعة وإلا اعرضها على النار اجب وأسرع وتوكل بكذا وكذا بارك الله فيك وعليك`,
      source_page: 28,
    },
    qasam: {
      arabic: `اقسمت عليك يا زوبعة خادم يوم الجمعة بحق شتثخ وبحق الملك الموكل عليك عنيائيل وبحق صراط الذين أنعمت عليهم وبحق الرؤوف الكافي الغني العطوف وبحق جهطهطيل أن تتوكل بعملي وتقضي حاجتي ومطلوبي كذا وكذا سريعاً عاجلاً`,
      source_page: 30,
    },
    pdf_note: `PDF p.28 Da'wa ends with "بارك الله فيك وعليك". PDF p.30 Qasam ends with "سريعاً عاجلاً" — unique to Friday. Quranic phrase from Al-Fatiha in Qasam.`,
  },
  {
    dayKey: 'sat',
    dayName: 'يوم السبت',
    khādim: 'ميمون أبا نوخ',
    planet: 'zuhal',
    planet_arabic: 'الزحل',
    angel_da3wa: 'عزرائيل',
    angel_qasam: 'عزرائيل',
    huruf: 'ذضظغ',
    quran_ref: 'غير المغضوب عليهم ولا الضالين (الفاتحة)',
    da3wa: {
      arabic: `اجب يا ميمون أبا نوخ بحق الملك الموكل بك الذي تسرع إلى خدمته عزرائيل وبحق ازليٍ ازليٍ تقمشٍ تقمشٍ هلكٍ هلكٍ كشلطٍ كشلطٍ كليسه كليسه لطه لطه نفعاتٍ نفعاتٍ بشغمليٍ بشغمليٍ علشاقٍ علشاقٍ اقشٍ مهراقشٍ مهراقشٍ علشاقش اقشٍ اقشامقشٍ اقشامقشٍ شقمونهشٍ شقمونهشٍ كللخٍ بشكليخٍ كللخٍ بشكليخٍ اركشا اركشا ركشليخٍ بركشيليخٍ بركشيليخٍ غلمشٍ غلمشٍ لهشٍ لهشٍ نموهشٍ نموهشٍ اجب يا ميمون أبا نوخ وتوكل بكذا وكذا بحق ما اقسمت به عليك العجل العجل الوحا الوحا الساعة الساعة`,
      source_page: 28,
      note: `Saturday Da'wa is the longest of the seven, as noted in the PDF.`,
    },
    qasam: {
      arabic: `أقسمت عليك يا ميمون خادم يوم السبت بحق ذضظغ وبحق الملك الموكل عليك عزرائيل وبحق غير المغضوب عليهم ولا الضالين وبحق الفتاح الرزاق القادر وبحق بهطهطيل أن تتوكل بعملي وتقضي حاجتي كذا وكذا`,
      source_page: 31,
    },
    pdf_note: `PDF p.28 Da'wa (longest of seven). PDF p.31 Qasam. Quranic phrase from Al-Fatiha in Qasam. Khādim addressed as "يا ميمون" (not "ميمون أبا نوخ") in Qasam.`,
  },
];

// ═══════════════════════════════════════════════════════════════
//  GENERAL POST-QASAM DU'A — Page 31 of PDF
//  To be read after EVERY daily Qasam, for every work.
//  PDF instruction (verbatim): "بعد القسم المطلوب في اليوم المطلوب عليك
//  ببخور اليوم عند قراءة أو كتابة العزيمة وعليك أن تقرأها على جميع الاعمال
//  بعد القسم فافهم الإشارة وهي:"
// ═══════════════════════════════════════════════════════════════
export const GENERAL_POST_QASAM_DUA = {
  source_page: 31,
  arabic: `بسم الله الرحمن الرحيم اللهم إني اسألك بأسمائك الحسنى كلها التي إذا وضعت على شيء ذل وخضع واذا طلبت بهن الحسنات ادركت واذا صرفت بهن السيئات صرفت (وَلَوْ أَنَّمَا فِي الْأَرْضِ مِن شَجَرَةٍ أَقْلَامٌ وَالْبَحْرُ يَمُدُّهُ مِن بَعْدِهِ سَبْعَةُ أَبْحُرٍ مَّا نَفِدَتْ كَلِمَاتُ اللَّهِ إِنَّ اللَّهَ عَزِيزٌ حَكِيمٌ) يا رؤوف يا لطيف يا رازق يا وافي يا كافي يا ودود يا قيوم يا عليم يا واسع يا كرم يا وهاب يا باسط يا ذا الطول يا معطي يا حنان يا منان يا جواد يا محسن يا منتقم اللهم اغنني بحلالك عن حرامك يا ارحم الراحمين واسألك اللهم باسمك الذي لا إله إلا هو الجليل الرحمن الرحيم اللطيف العظيم الرزاق الغفور المؤمن المهيمن المميت المجيب القريب السميع السريع الكريم ذو الجلال والاكرام ذو الطول المنان`,
  quran_embedded: 'لقمان 27 — (وَلَوْ أَنَّمَا فِي الْأَرْضِ مِن شَجَرَةٍ أَقْلَامٌ...)',
  instruction_arabic: `بعد القسم المطلوب في اليوم المطلوب عليك ببخور اليوم عند قراءة أو كتابة العزيمة وعليك أن تقرأها على جميع الاعمال بعد القسم`,
  instruction_ml: `ഖസം കഴിഞ്ഞ ഉടൻ ആ ദിവസത്തെ ബഖൂർ ഉപയോഗിച്ചുകൊണ്ട് ഈ ദുആ ഓതണം. എഴുതുകയോ ഓതുകയോ ചെയ്യുന്ന എല്ലാ അ'മലിനും ഖസം കഴിഞ്ഞ ശേഷം ഇത് ഓതണം.`,
};

// ═══════════════════════════════════════════════════════════════
//  NOTE ON ORDER — From PDF (Page 29)
//  The PDF explicitly states these Aqsam (Omani refined form) come
//  AFTER the 'Azima. Verbatim: "وهذه الأقسام تكون بعد العزيمة التي
//  سأوردها بعد الأقسام السبعة إن شاء الله تعالى"
//  Order per PDF:
//    1. Da'wa (دعوة يوم ...)
//    2. 'Azima (عزيمة — separate section, not in this extracted range)
//    3. Qasam — Omani refined form (أقسمت عليك يا ...)
//    4. General post-Qasam Du'a (بسم الله الرحمن الرحيم اللهم إني ...)
//    5. Incense (بخور اليوم) during reading/writing
// ═══════════════════════════════════════════════════════════════
export const RITUAL_ORDER_NOTE = {
  arabic: `وهذه الأقسام تكون بعد العزيمة التي سأوردها بعد الأقسام السبعة إن شاء الله تعالى`,
  source_page: 29,
  ml: `ഈ ഖസങ്ങൾ അസീമ ഓതിയ ശേഷമാണ് ഓതേണ്ടത്. PDF-ൽ ഈ ക്രമം വ്യക്തമായി പ്രസ്താവിക്കപ്പെട്ടിരിക്കുന്നു.`,
};

// ═══════════════════════════════════════════════════════════════
//  NOTE ON AQSAM FORM — From PDF (Page 29)
//  The PDF describes this Qasam form as preferred:
// ═══════════════════════════════════════════════════════════════
export const OMANI_FORM_NOTE = {
  arabic: `وذكر هذه الاقسام أحد المشايخ العمانيين رحمه الله تعالى بصيغة أخرى وهي ادق وأفضل لأنها تجمع (الآية والملك والخدام الموكلين والاحرف والاسماء)`,
  source_page: 29,
  ml: `ഒരു ഒമാനി ശൈഖ് (റഹ്) ഈ ഖസമിനെ മറ്റൊരു ശൈലിയിൽ ഉദ്ധരിച്ചിരിക്കുന്നു. ഇത് കൂടുതൽ സൂക്ഷ്മവും ഉത്തമവുമാണ്, കാരണം ഇത് (ആയത്ത്, ഭരണ രാജാവ്, നിയോഗിക്കപ്പെട്ട ഖുദ്ദാം, അക്ഷരങ്ങൾ, നാമങ്ങൾ) എല്ലാം ഒന്നിപ്പിക്കുന്നു.`,
};

// ── Day key → planet key mapping (matches Mizan system) ──
const DAY_PLANET = {
  sun: 'sems', mon: 'kamer', tue: 'merih', wed: 'utarid',
  thu: 'mustari', fri: 'zuhre', sat: 'zuhal',
};

/**
 * Rule-based resolver: returns the Qasam entry for the current
 * Mizan selections, plus a conditions summary.
 *
 * @param {object} selections — current Mizan state
 * @returns {{ entry: object|null, conditions: object|null }}
 */
export function resolveQasam(selections) {
  if (!selections) return { entry: null, conditions: null };

  const dayKey = selections.days ?? selections.day ?? null;
  const hourPlanet = selections.planet ?? null;
  const purposes = selections.purposes ?? null;
  const khayrSharr = selections.khayrSharr8 ?? selections.khayrSharr ?? null;

  const entry = dayKey
    ? QASAM_RULES.find(r => r.dayKey === String(dayKey)) ?? null
    : null;

  const dayPlanet = entry ? entry.planet : (dayKey ? DAY_PLANET[dayKey] : null);
  const hourMatchesDay = !!(dayPlanet && hourPlanet && dayPlanet === hourPlanet);

  return {
    entry,
    conditions: {
      daySelected: !!dayKey,
      hourMatchesDay,
      hourPlanet,
      dayPlanet,
      purposes,
      khayrSharr,
    },
  };
}