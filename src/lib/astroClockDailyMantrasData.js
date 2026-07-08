// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK — DAILY MANTRAS & SPIRITUAL RECITATIONS DATA MODULE
// ═══════════════════════════════════════════════════════════════
//
// SECTION 2 — DAILY MANTRAS & SPIRITUAL RECITATIONS
//
// LAW COMPLIANCE:
//   - Manuscript Integration Law: additive only, grouped by source
//   - Manuscript Preservation Law: never delete/overwrite
//   - Language System Law: ML/EN/TR only, Arabic preserved
//   - Location & Time Law: day index from live useAstroData()
//   - Live Astronomy Law: no hardcoded day assumptions
//
// PAGE-BY-PAGE AUDIT REPORT (Kashf al-Haqa'iq, 90 pages):
//   PDF 1 (pp.1–30) — Scanned. Recitations found: pp.8–10 (adhkar
//     instruction), pp.27–30 (7 Azayim + first 1 of 7 Aqsam).
//   PDF 2 (pp.31–60) — Scanned. Recitations found: pp.30–31 (6
//     remaining Aqsam), p.31 (universal post-qasm supplication),
//     p.36 (daily dhikr schedule), p.42 (pre-work prayer + istikhara),
//     p.50 (talisman supplication), p.51 (Quranic verses for love works).
//     Remaining pages: timing tables — no recitations.
//   PDF 3 (pp.60–90) — Scanned. Only lunar-day guidance and poetry
//     on mansion timing for marriage/travel/clothing. No recitations.
//
// TOTAL RECITATIONS INTEGRATED: 14 weekday invocations (7 Azayim +
//   7 Aqsam) + 2 universal supplications + 1 daily dhikr + 1 pre-work
//   prayer sequence.
//
// PREVIOUSLY INTEGRATED MANUSCRIPTS (Havâss, Taha):
//   Re-scanned. No recitations found — confirmed empty.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// SOURCE: KASHF AL-HAQA'IQ (كشف الحقائق)
// Author: Anonymous Omani scholar, Bani Falaj Rabia, Oman
// Book: كشف الحقائق لمن جهل الطرائق — الرسالة الأولى (مفاتيح العلوم)
// Tradition: Omani Islamic spiritual sciences
// ═══════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────
// CATEGORY A: THE SEVEN DAILY AZAYIM (العزائم / الأقسام للأيام)
//
// Source: pp.27–31, Kashf al-Haqa'iq
// Context (p.9, Condition #8): "يجب عليك أن تقسم على الأعوان لكي
//   يعملوا على إتمام الحاجة المطلوبة... تلاوة العزيمة ثلاث مرات
//   وأوسطه خمسا وغالبه سبعا."
// Rule: Each Azimah is recited on its specific weekday,
//   accompanied by the incense of that day and planet.
// Repetition: 3 times minimum, 5 medium, 7 preferred.
// ────────────────────────────────────────────────────────────────

export const KASHF_AZAYIM_BY_DAY = [
  {
    id: "kashf_azimah_sunday",
    day_index: 0, // Sunday
    king: "المذهب",
    king_en: "al-Mudhhab (the Gilded)",
    king_ml: "അൽ-മുദ്ദഹബ്",
    type: "azimah",
    arabic_text: "اجب يا مذّهب ما أعظم سلطان الله احترق من عصى الله بنار اهياه شراهيا اهيا خنوخ اهناتاه ما اعزّ اصبوتا القديم الازليّ جرهططه جرهططه سبّوح سبّوح قدوس رب الملائكة والروح اجب يا مذّهب بحق سبّوح سبّوح قدوس رب الملائكة والروح العجل العجل الوحا الوحا الساعة الساعة",
    purpose_en: "Invocation of the planetary king of Sunday (Sun). Recited to fulfill needs of Sunday, attract favour with rulers, and for works of prosperity and acceptance.",
    purpose_ml: "ഞായർ ദിവസത്തെ ഗ്രഹ ദേശീയ ദൂതനെ വിളിക്കൽ. ഭരണകർത്താക്കളുടെ പ്രീതി, ഐശ്വര്യം, സ്വീകാര്യത എന്നിവക്ക്.",
    purpose_tr: "Pazar günü gezegen meleğinin çağrılması. Yöneticilerin teveccühü, refah ve kabul için.",
    instructions_ar: "يُتلى بعد أقسام الملوك الأرضية في يوم الأحد مع بخور الشمس، مستقبلاً القبلة، طاهراً متطيباً.",
    instructions_en: "Recited on Sunday after the Qasam of the earthly kings, with solar incense, facing the Qibla, in a state of purity.",
    instructions_ml: "ഞായറാഴ്ച ഭൗമ ദേശീയ ദൂതരുടെ ഖസം ചൊല്ലിയ ശേഷം, സൂര്യ ഊദ് ദഹിപ്പിച്ച്, ഖിബ്‌ലയ്ക്ക് അഭിമുഖമായി, ശുദ്ധിയോടെ.",
    repetition: "3 / 5 / 7",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 27, scholar: "Anonymous Omani scholar" },
  },
  {
    id: "kashf_azimah_monday",
    day_index: 1, // Monday
    king: "مُرَّة",
    king_en: "Murrah (the Moon's king)",
    king_ml: "മുർറ",
    type: "azimah",
    arabic_text: "اجب يا مُرَّةُ بحق طهش طهش طهشره طهشره طهسوه طهسوه جازوشه جازوشه جنجروشه جنجروشه هينشره هينشره اجب يا مُرَّةُ بحق سامٍ وبالذّي تجلّى للجبل جعله دكا وخر موسى صعقاً العجل العجل الوحا الوحا الساعة الساعة",
    purpose_en: "Invocation of the king of Monday (Moon). Recited for attraction, gathering love, bringing absent persons, and lunar-day works.",
    purpose_ml: "തിങ്കൾ ദിവസത്തെ (ചന്ദ്ര) ദൂതൻ. ആകർഷണം, സ്നേഹം വർദ്ധിപ്പിക്കൽ, അഭ്യർഥന പ്രകടിപ്പിക്കൽ.",
    purpose_tr: "Pazartesi günü meleğinin çağrılması (Ay). Çekme, sevgi, uzakta olanı getirme.",
    instructions_en: "Recited on Monday with lunar incense.",
    instructions_ml: "തിങ്കൾ ദിവസം ചന്ദ്ര ഊദ് ദഹിപ്പിച്ച് ചൊല്ലുക.",
    instructions_tr: "Pazartesi, ay buhuru ile okunur.",
    repetition: "3 / 5 / 7",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 27, scholar: "Anonymous Omani scholar" },
  },
  {
    id: "kashf_azimah_tuesday",
    day_index: 2, // Tuesday
    king: "أبو محرز الأحمر",
    king_en: "Abu Mihraz al-Ahmar (the Red)",
    king_ml: "അബൂ മിഹ്‌രസ് അൽ-അഹ്‌മർ",
    type: "azimah",
    arabic_text: "اجب يا أبا محرز الأحمر بحق غشَطَفٍ ليطشالٍ اجلفٍ شالٍ رونٍ لكهٍ هلمعقٍ منهشلٍ جهلفٍ مهلقٍ شهليصٍ شهليصٍ نموهٍ دمليخ ارحيٍ بحقها عليك وبحق الملك عليك سمسميائيل وتوكلوا بكذا وكذا الوحا الوحا العجل العجل الساعة الساعة",
    purpose_en: "Invocation of the king of Tuesday (Mars). Recited for works requiring force, overcoming enemies, warfare, or protection.",
    purpose_ml: "ചൊവ്വ ദിവസത്തെ (ചൊവ്വ ഗ്രഹ) ദൂതൻ. ശക്തിയുള്ള കൃത്യങ്ങൾ, ശത്രുനിഗ്രഹം, യുദ്ധം, സംരക്ഷണം.",
    purpose_tr: "Salı günü meleğinin çağrılması (Mars). Güç gerektiren işler, düşmanı yenme.",
    instructions_en: "Recited on Tuesday with Mars incense.",
    instructions_ml: "ചൊവ്വ ദിവസം ചൊവ്വ ഗ്രഹ ഊദ് ദഹിപ്പിച്ച് ചൊല്ലുക.",
    instructions_tr: "Salı, Mars buhuru ile okunur.",
    repetition: "3 / 5 / 7",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 28, scholar: "Anonymous Omani scholar" },
  },
  {
    id: "kashf_azimah_wednesday",
    day_index: 3, // Wednesday
    king: "برقان",
    king_en: "Burqan (Mercury's king)",
    king_ml: "ബൂർഖാൻ",
    type: "azimah",
    arabic_text: "اجب يا برقان بحق هثٍ هثٍ مرثٍ مرثٍ هبوثٍ طلطليوثٍ هثا ابولت ابوله ايوه هيلوثٍ يا هثا لوثٍ اهياس خلق الله الليل والنهار رراييل اهيا شراهيا ادوناي اصبئوتٍ آل شداي توكل يا برقان بكذا وكذا بحق الملك الموكل به ميكائيل الذي تسرع إلى خدمته العجل العجل الوحا الوحا الساعة الساعة",
    purpose_en: "Invocation of the king of Wednesday (Mercury). Recited for knowledge, writing, binding tongues, contracts, and works of intellect.",
    purpose_ml: "ബുധൻ ദിവസത്തെ (ബുധ ഗ്രഹ) ദൂതൻ. അറിവ്, എഴുത്ത്, നാവ് ബന്ധനം, ഉടമ്പടി, ബൗദ്ധിക കൃത്യങ്ങൾ.",
    purpose_tr: "Çarşamba günü meleğinin çağrılması (Merkür). Bilgi, yazı, dil bağlama, sözleşmeler.",
    instructions_en: "Recited on Wednesday with Mercury incense.",
    instructions_ml: "ബുധൻ ദിവസം ബുധ ഗ്രഹ ഊദ് ദഹിപ്പിച്ച് ചൊല്ലുക.",
    instructions_tr: "Çarşamba, Merkür buhuru ile okunur.",
    repetition: "3 / 5 / 7",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 28, scholar: "Anonymous Omani scholar" },
  },
  {
    id: "kashf_azimah_thursday",
    day_index: 4, // Thursday
    king: "شمهورش",
    king_en: "Shamhursh (Jupiter's king)",
    king_ml: "ശംഹൂർഷ്",
    type: "azimah",
    arabic_text: "اجب يا شمهورش بحق الملك الموكل بك صرفيائيل وبحق شططلشٍ مهطشٍ مطهشٍ ملك عجرشٍ يفحرشٍ هبقا هبقا اجب يا شمهورش بحق دردميشٍ دردميشٍ وبحق ما فشٍ مكتوب في لوح القدرة أن تتوكل بكذا وكذا العجل العجل الوحا الوحا الساعة الساعة",
    purpose_en: "Invocation of the king of Thursday (Jupiter). Recited for gathering love, attracting wealth, fulfilling needs with nobles, obtaining honour and prestige.",
    purpose_ml: "വ്യാഴ ദിവസത്തെ (വ്യാഴ ഗ്രഹ) ദൂതൻ. സ്നേഹം, ഐശ്വര്യം, ഉന്നതരുടെ സഹായം, ബഹുമാനം.",
    purpose_tr: "Perşembe günü meleğinin çağrılması (Jüpiter). Sevgi, zenginlik, ileri gelenlerden yardım, itibar.",
    instructions_en: "Recited on Thursday with Jupiter incense.",
    instructions_ml: "വ്യാഴ ദിവസം വ്യാഴ ഗ്രഹ ഊദ് ദഹിപ്പിച്ച് ചൊല്ലുക.",
    instructions_tr: "Perşembe, Jüpiter buhuru ile okunur.",
    repetition: "3 / 5 / 7",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 28, scholar: "Anonymous Omani scholar" },
  },
  {
    id: "kashf_azimah_friday",
    day_index: 5, // Friday
    king: "زوبعة",
    king_en: "Zawba'a (Venus' king)",
    king_ml: "സൗബ‌അ",
    type: "azimah",
    arabic_text: "اجب يا زوبعة بحق الملك الموكل بك عنيائيل الذي تسرع إلى خدمته وبحق دموي ابيهٍ ابيهٍ بشمليّ بشمليّ جرهططهٍ جرهططهٍ سبّوح سبّوح اذا لم تأت يا زوبعة وإلا اعرضها على النار اجب وأسرع وتوكل بكذا وكذا بارك الله فيك وعليك",
    purpose_en: "Invocation of the king of Friday (Venus). Recited for love between a man and woman, marriage, attraction, beauty works, and obtaining from the generous.",
    purpose_ml: "വെള്ളി ദിവസത്തെ (ശുക്ര ഗ്രഹ) ദൂതൻ. സ്ത്രീ-പുരുഷ സ്നേഹം, വിവാഹം, ആകർഷണം, സൗന്ദര്യ കൃത്യങ്ങൾ.",
    purpose_tr: "Cuma günü meleğinin çağrılması (Venüs). Erkek-kadın arasında sevgi, evlilik, çekicilik.",
    instructions_en: "Recited on Friday with Venus incense (oud/rose).",
    instructions_ml: "വെള്ളി ദിവസം ശുക്ര ഗ്രഹ ഊദ്/ഗുലാബ് ദഹിപ്പിച്ച് ചൊല്ലുക.",
    instructions_tr: "Cuma, Venüs buhuru (oud/gül) ile okunur.",
    repetition: "3 / 5 / 7",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 28, scholar: "Anonymous Omani scholar" },
  },
  {
    id: "kashf_azimah_saturday",
    day_index: 6, // Saturday
    king: "ميمون أبا نوخ",
    king_en: "Maymun Abu Nukh (Saturn's king)",
    king_ml: "മൈമൂൻ അബൂ നൂഖ്",
    type: "azimah",
    arabic_text: "اجب يا ميمون أبا نوخ بحق الملك الموكل بك الذي تسرع إلى خدمته عزرائيل وبحق ازليٍ ازليٍ تقمشٍ تقمشٍ هلكشٍ هلكشٍ كشلطلٍ كشلطلٍ كليسهٍ كليسهٍ لطهٍ لطهٍ نفعاتمٍ بشغمليمٍ اقشٍ مهراقشٍ مهراقشٍ علشاقصٍ علشاقصٍ بشغمليشٍ اقشٍ اقشامقشٍ اقشامقشٍ شقمونهشٍ شقمونهشٍ اركشا اركشا ركشليخٍ بشكليخٍ كللخٍ بشكليخٍ كللخٍ بركشيليخٍ بركشيليخٍ غلمشٍ غلمشٍ لهشٍ لهشٍ نموهٍ نموهٍ اجب يا ميمون أبا نوخ وتوكل بكذا وكذا بحق ما اقسمت به عليك العجل العجل الوحا الوحا الساعة الساعة",
    purpose_en: "Invocation of the king of Saturday (Saturn). Recited for banishment, separation, long-distance binding, sending away those who cause harm.",
    purpose_ml: "ശനി ദിവസത്തെ (ശനി ഗ്രഹ) ദൂതൻ. ബഹിഷ്കരണം, വേർപിരിക്കൽ, ദൂര ബന്ധനം, ദ്രോഹകരെ അകറ്റൽ.",
    purpose_tr: "Cumartesi günü meleğinin çağrılması (Satürn). Uzaklaştırma, ayrılık, uzaktan bağlama.",
    instructions_en: "Recited on Saturday with Saturn incense.",
    instructions_ml: "ശനിയാഴ്ച ശനി ഗ്രഹ ഊദ് ദഹിപ്പിച്ച് ചൊല്ലുക.",
    instructions_tr: "Cumartesi, Satürn buhuru ile okunur.",
    repetition: "3 / 5 / 7",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 29, scholar: "Anonymous Omani scholar" },
  },
];

// ────────────────────────────────────────────────────────────────
// CATEGORY B: THE SEVEN DAILY AQSAM (الأقسام السبعة للأيام)
//
// Source: pp.29–31, Kashf al-Haqa'iq
// Context (p.29): "ذكر هذه الاقسام أحد المشايخ العمانيين رحمه
//   الله تعالى بصيغة أخرى وهي ادق وأفضل لأنها تجمع (الآية والملك
//   والخدام والاحرف والاسماء)"
// Note: These are recited AFTER the Azayim above. They incorporate
//   Quranic verse openings, angelic names, and the servant's name.
// ────────────────────────────────────────────────────────────────

export const KASHF_AQSAM_BY_DAY = [
  {
    id: "kashf_qasam_sunday",
    day_index: 0,
    servant: "مذهب",
    servant_en: "Mudhhab (servant of Sunday)",
    servant_ml: "മുദ്ദഹബ് (ഞായർ ദൂതൻ)",
    type: "qasam",
    arabic_text: "أقسمت عليك يا مذهب خادم يوم الأحد بحق ابجد وبحق الملك المتوكل عليك روقيائيل وبحق الحمدلله رب العالمين وبحق الحي القيوم وبحق اللهطهطيل أن تعين على مطلوبي وتقضي حاجتي وتتوكل بعملي كذا وكذا",
    purpose_en: "Sworn oath to the servant of Sunday for fulfilling one's need. Recited after the Azimah of Sunday, incorporating the opening verse of al-Fatiha, divine names, and the angelic guardian Ruqiya'il.",
    purpose_ml: "ഞായർ ദൂതനോടുള്ള ശപഥ. ഫാതിഹ ആദ്യ വചനം, ദൈവനാമങ്ങൾ, മലക് റൂഖിയാഇൽ ഉൾക്കൊള്ളുന്നു.",
    purpose_tr: "Pazar günü hizmetçisine yemin. Fatiha'nın açılış ayeti ve melek Rukiya'il içerir.",
    instructions_en: "Recited immediately after the Sunday Azimah. Replace كذا وكذا with your specific need.",
    instructions_ml: "ഞായർ അസീമ ശേഷം ഉടനടി ചൊല്ലുക. كذا وكذا-ൽ ആവശ്യം പ്രസ്താവിക്കുക.",
    instructions_tr: "Pazar Azimah'ından hemen sonra okunur. كذا وكذا yerine ihtiyacınızı belirtin.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 29, scholar: "Omani scholar (unnamed)" },
  },
  {
    id: "kashf_qasam_monday",
    day_index: 1,
    servant: "أبيض",
    servant_en: "Abyad (servant of Monday)",
    servant_ml: "അബ്‌യദ് (തിങ്കൾ ദൂതൻ)",
    type: "qasam",
    arabic_text: "أقسمت عليك يا أبيض خادم يوم الاثنين بحق هوزح وبحق الملك الموكل عليك جبرائيل وبحق الرحمن الرحيم وبحق السريع القريب وبحق مهطهطيل أن تعين على مطلوبي وتقضي حاجتي وتتوكل بعملي كذا وكذا",
    purpose_en: "Sworn oath to the servant of Monday. Incorporates the divine names al-Rahman al-Rahim, al-Sari' al-Qarib, and the angel Jibrail.",
    purpose_ml: "തിങ്കൾ ദൂതനോടുള്ള ശപഥ. അർ-റഹ്‌മാൻ, അർ-റഹീം, ജിബ്‌രീൽ ഉൾക്കൊള്ളുന്നു.",
    purpose_tr: "Pazartesi hizmetçisine yemin. Rahman, Rahim, Cebrail içerir.",
    instructions_en: "Recited on Monday after the Azimah.",
    instructions_ml: "തിങ്കൾ അസീമ ശേഷം ചൊല്ലുക.",
    instructions_tr: "Pazartesi, Azimah'tan sonra okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 30, scholar: "Omani scholar (unnamed)" },
  },
  {
    id: "kashf_qasam_tuesday",
    day_index: 2,
    servant: "أحمر",
    servant_en: "Ahmar (servant of Tuesday)",
    servant_ml: "അഹ്‌മർ (ചൊവ്വ ദൂതൻ)",
    type: "qasam",
    arabic_text: "أقسمت عليك يا أحمر خادم يوم الثلاثاء بحق طيكل وبحق الملك الموكل عليك سمسيائيل وبحق مالك يوم الدين وبحق الملك القدوس القاهر العزيز وبحق قهطهطيل أن تتوكل بعملي وتقضي حاجتي كذا وكذا",
    purpose_en: "Sworn oath to the servant of Tuesday. Incorporates the verse مالك يوم الدين and the angel Samsiya'il.",
    purpose_ml: "ചൊവ്വ ദൂതനോടുള്ള ശപഥ. مالك يوم الدين ഖുർആൻ വചനം, മലക് സംസിയാഇൽ.",
    purpose_tr: "Salı hizmetçisine yemin. مالك يوم الدين ayeti ve melek Samsiya'il içerir.",
    instructions_en: "Recited on Tuesday after the Azimah.",
    instructions_ml: "ചൊവ്വ അസീമ ശേഷം ചൊല്ലുക.",
    instructions_tr: "Salı, Azimah'tan sonra okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 30, scholar: "Omani scholar (unnamed)" },
  },
  {
    id: "kashf_qasam_wednesday",
    day_index: 3,
    servant: "برقان",
    servant_en: "Burqan (servant of Wednesday)",
    servant_ml: "ബൂർഖാൻ (ബുധൻ ദൂതൻ)",
    type: "qasam",
    arabic_text: "أقسمت عليك يا برقان خادم يوم الأربعاء بحق منسع وبحق الملك الموكل عليك ميكائيل وبحق إياك نعبد وإياك نستعين وبحق العلي العظيم وبحق فهطهطيل أن تتوكل بعملي وتقضي حاجتي كذا وكذا",
    purpose_en: "Sworn oath to the servant of Wednesday. Incorporates إياك نعبد وإياك نستعين from al-Fatiha and the angel Mika'il.",
    purpose_ml: "ബുധൻ ദൂതനോടുള്ള ശപഥ. إياك نعبد وإياك نستعين (ഫാതിഹ), മലക് മീകാഇൽ.",
    purpose_tr: "Çarşamba hizmetçisine yemin. إياك نعبد وإياك نستعين (Fatiha) ve melek Mika'il.",
    instructions_en: "Recited on Wednesday after the Azimah.",
    instructions_ml: "ബുധൻ അസീമ ശേഷം ചൊല്ലുക.",
    instructions_tr: "Çarşamba, Azimah'tan sonra okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 30, scholar: "Omani scholar (unnamed)" },
  },
  {
    id: "kashf_qasam_thursday",
    day_index: 4,
    servant: "شمهورش",
    servant_en: "Shamhursh (servant of Thursday)",
    servant_ml: "ശംഹൂർഷ് (വ്യാഴ ദൂതൻ)",
    type: "qasam",
    arabic_text: "أقسمت عليك يا شمهورش خادم يوم الخميس بحق قصفر وبحق الملك الموكل عليك صرفيائيل وبحق اهدنا الصراط المستقيم وبحق الكبير المتعال وبحق نهطهطيل ان تتوكل بعملي وتقضي حاجتي كذا وكذا",
    purpose_en: "Sworn oath to the servant of Thursday. Incorporates اهدنا الصراط المستقيم from al-Fatiha and the angel Sarfiya'il.",
    purpose_ml: "വ്യാഴ ദൂതനോടുള്ള ശപഥ. اهدنا الصراط المستقيم (ഫാതിഹ), മലക് സർഫിയാഇൽ.",
    purpose_tr: "Perşembe hizmetçisine yemin. اهدنا الصراط المستقيم (Fatiha) ve melek Sarfiya'il.",
    instructions_en: "Recited on Thursday after the Azimah.",
    instructions_ml: "വ്യാഴ അസീമ ശേഷം ചൊല്ലുക.",
    instructions_tr: "Perşembe, Azimah'tan sonra okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 30, scholar: "Omani scholar (unnamed)" },
  },
  {
    id: "kashf_qasam_friday",
    day_index: 5,
    servant: "زوبعة",
    servant_en: "Zawba'a (servant of Friday)",
    servant_ml: "സൗബ‌അ (വെള്ളി ദൂതൻ)",
    type: "qasam",
    arabic_text: "اقسمت عليك يا زوبعة خادم يوم الجمعة بحق شتثخ وبحق الملك الموكل عليك عنيائيل وبحق صراط الذين انعمت عليهم وبحق الرؤوف الكافي الغني العطوف وبحق جهطهطيل ان تتوكل بعملي وتقضي حاجتي ومطلوبي كذا وكذا سريعا عاجلا",
    purpose_en: "Sworn oath to the servant of Friday. Incorporates صراط الذين أنعمت عليهم from al-Fatiha and the angel Unya'il.",
    purpose_ml: "വെള്ളി ദൂതനോടുള്ള ശപഥ. صراط الذين أنعمت عليهم (ഫാതിഹ), മലക് ഉന്‍യാഇൽ.",
    purpose_tr: "Cuma hizmetçisine yemin. صراط الذين أنعمت عليهم (Fatiha) ve melek Uny'a'il.",
    instructions_en: "Recited on Friday after the Azimah.",
    instructions_ml: "വെള്ളി അസീമ ശേഷം ചൊല്ലുക.",
    instructions_tr: "Cuma, Azimah'tan sonra okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 30, scholar: "Omani scholar (unnamed)" },
  },
  {
    id: "kashf_qasam_saturday",
    day_index: 6,
    servant: "ميمون",
    servant_en: "Maymun (servant of Saturday)",
    servant_ml: "മൈമൂൻ (ശനി ദൂതൻ)",
    type: "qasam",
    arabic_text: "أقسمت عليك يا ميمون خادم يوم السبت بحق ذضظغ وبحق الملك الموكل عليك عزرائيل وبحق غير المغضوب عليهم ولا الضالين وبحق الفتاح الرزاق القادر وبحق بهطهطيل أن تتوكل بعملي وتقضي حاجتي كذا وكذا",
    purpose_en: "Sworn oath to the servant of Saturday. Incorporates غير المغضوب عليهم ولا الضالين from al-Fatiha and the angel Azra'il.",
    purpose_ml: "ശനി ദൂതനോടുള്ള ശപഥ. غير المغضوب عليهم ولا الضالين (ഫാതിഹ), മലക് അസ്‌റാഇൽ.",
    purpose_tr: "Cumartesi hizmetçisine yemin. غير المغضوب عليهم ولا الضالين (Fatiha) ve melek Azrail.",
    instructions_en: "Recited on Saturday after the Azimah.",
    instructions_ml: "ശനി അസീമ ശേഷം ചൊല്ലുക.",
    instructions_tr: "Cumartesi, Azimah'tan sonra okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 31, scholar: "Omani scholar (unnamed)" },
  },
];

// ────────────────────────────────────────────────────────────────
// CATEGORY C: UNIVERSAL SUPPLICATIONS (الأدعية الشاملة)
//
// These are recited on ANY day, after the Qasam and Azimah,
// on all spiritual works regardless of the day.
// ────────────────────────────────────────────────────────────────

export const KASHF_UNIVERSAL_SUPPLICATIONS = [
  {
    id: "kashf_supplication_post_qasam",
    day_index: null, // Any day
    type: "universal_supplication",
    arabic_text: "بسم الله الرحمن الرحيم اللهم إني أسألك بأسمائك الحسنى كلها التي إذا وضعت على شيء ذل وخضع واذا طلبت بهن الحسنات ادركت واذا دفعت بهن السيئات دفعت (وَلَوْ أَنَّمَا فِي الْأَرْضِ مِن شَجَرَةٍ أَقْلَامٌ وَالْبَحْرُ يَمُدُّهُ مِن بَعْدِهِ سَبْعَةُ أَبْحُرٍ مَّا نَفِدَتْ كَلِمَاتُ اللَّهِ إِنَّ اللَّهَ عَزِيزٌ حَكِيمٌ) يا كافي يا وافي يا رؤوف يا لطيف يا رازق يا ودود يا قيوم يا عليم يا واسع يا كرم يا وهاب يا باسط يا ذا الطول يا معطي يا حنان يا منان يا جواد يا محسن يا منتقم اللهم اغنني بحلالك عن حرامك يا ارحم الراحمين واسألك اللهم باسمك الذي لا إله إلا هو الجليل الرحمن الرحيم اللطيف العظيم الرزاق الغفور المؤمن المهيمن المميت المجيب القريب السريع الكريم ذو الجلال والاكرام ذو الطول المنان",
    purpose_en: "Universal supplication recited after the daily Qasam (sworn oath) on ALL spiritual works, on all days. Contains Quranic verse (Surah Luqman 31:27) and the Beautiful Names of Allah.",
    purpose_ml: "എല്ലാ ദിവസവും, എല്ലാ ആത്മിക കൃത്യങ്ങൾ ചെയ്ത ശേഷം ചൊല്ലേണ്ട ദു‌ആ. ഖുർആൻ 31:27, ദൈവത്തിന്റെ ഉത്തമ നാമങ്ങൾ.",
    purpose_tr: "Tüm günlerde, tüm ruhaniyat çalışmalarından sonra okunan evrensel dua. Kur'an 31:27 ve Allah'ın güzel isimleri.",
    instructions_en: "Recited on the specific day, with its incense, after completing the Azimah and Qasam. No specific repetition count.",
    instructions_ml: "ആ ദിവസത്തെ ഊദ് ദഹിപ്പിച്ച്, അസീമ, ഖസം ശേഷം ചൊല്ലുക.",
    instructions_tr: "O günün buhuru ile, Azimah ve Qasam'dan sonra okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 31, scholar: "Anonymous Omani scholar" },
  },
  {
    id: "kashf_supplication_talisman",
    day_index: null, // Any day — recited before talisman activation
    type: "universal_supplication",
    arabic_text: "إلهي من ذا الذي دعاك فلم تجبه ومن ذا الذي سألك فلم تعطه ومن ذا الذي استجار بك فلم تجره ومن ذا الذي استعاذ بك فلم تعذه ومن ذا الذي استغاث بك فلم تغثه وا غوثاه وا غوثاه واغوثاه يا غياث المستغيثين اغثني وأقض حوائجي وحوائج المحتاجين والمسلمين بحرمة القرآن العظيم والنبي الكريم اللهم أفعل بنا ما أنت أهله ولا تفعل بنا ما نحن أهله فإنك أهل التقوى وأهل المغفرة ونحن أهل الذنوب والخطايا برحمتك يا أرحم الراحمين وصلى الله على سيدنا محمد وعلى آله وصحبه وسلم",
    purpose_en: "Supplication recited before activating talisman names (تنزيل الأسماء). Called the dua of the seeker: five rhetorical questions affirming that Allah always answers, followed by a plea and blessing on the Prophet.",
    purpose_ml: "ത്വിലസ്മ നാമങ്ങൾ പ്രവർത്തിപ്പിക്കുന്നതിന് മുമ്പ് ചൊല്ലുന്ന ദു‌ആ. അഞ്ച് ചോദ്യങ്ങൾ, നബി (صلى الله عليه وسلم) മേൽ സലാം.",
    purpose_tr: "Tılsım isimlerini etkinleştirmeden önce okunan dua. Beş soru, Hz. Peygamber üzerine salavat.",
    instructions_en: "Recited when the center of the talisman is empty, or to activate the spiritual names. No specific count.",
    instructions_ml: "ത്വിലസ്മ കേന്ദ്രം ഒഴിഞ്ഞിരിക്കുമ്പോൾ, അല്ലെങ്കിൽ ആത്മ നാമങ്ങൾ ഉണർത്തുമ്പോൾ.",
    instructions_tr: "Tılsısmın merkezi boş olduğunda veya ruhaniyat isimleri etkinleştirilirken okunur.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 50, scholar: "Anonymous Omani scholar" },
  },
];

// ────────────────────────────────────────────────────────────────
// CATEGORY D: DAILY DHIKR (الذكر اليومي)
//
// Source: p.36, Kashf al-Haqa'iq (Condition #10 — spiritual retreat table)
// Context: Required daily dhikr during spiritual retreat/riyada,
//   morning and evening, as part of the foundational practice.
// ────────────────────────────────────────────────────────────────

export const KASHF_DAILY_DHIKR = [
  {
    id: "kashf_dhikr_daily_morning_evening",
    day_index: null, // Every day
    type: "dhikr",
    arabic_text: "يا حي يا قيوم — لا إله إلا الله",
    purpose_en: "Core daily dhikr of the spiritual retreat (Riyada). Recited morning and evening, 313 times or 1000 times according to the degree of the work and the guidance of one's teacher.",
    purpose_ml: "ആത്മ ഉദ്ഘാടനത്തിനും ഖുർആൻ ഗ്രഹണം എളുപ്പമാക്കുന്നതിനുമുള്ള ദൈനംദിന ദിക്ർ. രാവിലെ, വൈകുന്നേരം, 313 അല്ലെങ്കിൽ 1000 തവണ.",
    purpose_tr: "Ruhani riyaza için temel günlük zikir. Sabah ve akşam 313 veya 1000 kez.",
    repetition: "313 times or 1000 times, morning and evening",
    repetition_ml: "313 അല്ലെങ്കിൽ 1000 തവണ, രാവിലെ വൈകുന്നേരം",
    repetition_tr: "313 veya 1000 kez, sabah ve akşam",
    instructions_en: "Recited during a spiritual retreat (Riyada) as the daily sustained remembrance. The exact count is set by one's spiritual teacher according to the goal.",
    instructions_ml: "ആദ്ധ്യാത്മിക ഏകാന്തവാസ (രിയാദ) കാലത്ത് ദൈനംദിന ദിക്ർ. ഗ്രഹണ ലക്ഷ്യം അനുസരിച്ച് ഗുരു നിശ്ചയിക്കുന്ന എണ്ണം.",
    instructions_tr: "Ruhaniyat için inzivada (Riyada) boyunca günlük zikir. Sayı, şeyh tarafından amaca göre belirlenir.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 36, scholar: "Anonymous Omani scholar" },
  },
];

// ────────────────────────────────────────────────────────────────
// CATEGORY E: PRE-WORK PRAYER (صلاة قبل الشروع في العمل)
//
// Source: p.42, Kashf al-Haqa'iq (Condition #17)
// This is a specific 2-rakat prayer with designated suras,
// recited before every spiritual work.
// ────────────────────────────────────────────────────────────────

export const KASHF_PRE_WORK_PRAYER = [
  {
    id: "kashf_prayer_pre_work",
    day_index: null, // Before every spiritual work
    type: "prayer_sequence",
    arabic_text: "اللهم إني استخيرك بعلمك واستقدرك بقدرتك وأسألك من فضلك العظيم أن تبين لي عاقبة أمري (في كذا وكذا تذكر حاجتك) فإن كان خيرا فاشرح لي صدري ووفقني لعمله وإن كان شرا فاصرفه عني واصرفني عنه إنك على كل شيء قدير وأنت المحيط العليم (سبعة مرات)",
    purpose_en: "Istikhara (guidance) prayer recited before every spiritual work. Two rak'ats: first with al-Fatiha and al-Kafirun, second with al-Fatiha and al-Ikhlas. After salaam, this dua is recited 7 times.",
    purpose_ml: "എല്ലാ ആത്മ കൃത്യങ്ങൾക്ക് മുമ്പ് ചൊല്ലേണ്ട ഇസ്തിഖാറ ദു‌ആ. 2 റക്‌അ: ആദ്യം ഫാതിഹ+കാഫിറൂൻ, രണ്ടാം ഫാതിഹ+ഇഖ്‌ലാസ്. സലാം ശേഷം 7 തവണ.",
    purpose_tr: "Her ruhaniyat çalışmasından önce istiharə duası. İki rekat: birincisinde Fatiha+Kafirun, ikincisinde Fatiha+İhlâs. Selamdan sonra bu dua 7 kez okunur.",
    prayer_description_en: "Perform 2 rak'ats: (1st) al-Fatiha + al-Kafirun; (2nd) al-Fatiha + al-Ikhlas. After Tasleem: recite Salawat on the Prophet ﷺ, then this dua 7 times.",
    prayer_description_ml: "2 റക്‌അ: (1) ഫാതിഹ + കാഫിറൂൻ; (2) ഫാതിഹ + ഇഖ്‌ലാസ്. സലാം ശേഷം: നബി ﷺ ക്ക് ദ്രൂദ്, പിന്നെ ഈ ദു‌ആ 7 തവണ.",
    prayer_description_tr: "2 rekat: (1.) Fatiha + Kafirun; (2.) Fatiha + İhlâs. Selamdan sonra: Salavat, ardından bu dua 7 kez.",
    repetition: "7 times",
    instructions_en: "Recited before any spiritual work. If the work feels suitable after prayer, proceed; if not, abandon it.",
    instructions_ml: "ഏത് ആത്മ കൃത്യത്തിനും മുമ്പ് ചൊല്ലുക. നമസ്കാരം ശേഷം അനുചിതമായി തോന്നുകയില്ലെങ്കിൽ തുടരുക.",
    instructions_tr: "Her ruhaniyat çalışmasından önce okunur. Namazdan sonra uygun hissediliyorsa devam edin.",
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", page: 42, scholar: "Anonymous Omani scholar" },
  },
];

// ═══════════════════════════════════════════════════════════════
// PREVIOUSLY INTEGRATED MANUSCRIPTS — RE-SCAN RESULTS
// ═══════════════════════════════════════════════════════════════

export const DAILY_MANTRA_SCAN_REPORT = {
  scan_date: "2026-07-08",
  manuscripts_scanned: [
    {
      source_id: "havass_derinlikleri",
      book_name: "Havâss'ın Derinlikleri",
      author: "Bülent Kısa",
      pages_scanned: "1-100",
      daily_mantras_found: false,
      note: "Contains planetary day rulers, suitable operations, and timing rules. No daily mantras, adhkar, or recitations.",
    },
    {
      source_id: "taha_judicial_astrology",
      book_name: "تدریس نجوم احکامی (Teaching Judicial Astrology)",
      author: "استاد طاها (Ustad Taha)",
      pages_scanned: "1-80",
      daily_mantras_found: false,
      note: "Contains zodiac, planet, aspect, and house significations. No daily mantras, adhkar, or recitations.",
    },
    {
      source_id: "kashf_alhaqa_iq",
      book_name: "كشف الحقائق (Kashf al-Haqa'iq)",
      author: "Anonymous Omani scholar",
      pages_scanned: "1-90",
      daily_mantras_found: true,
      note: "pp.27–31: 7 Azayim + 7 Aqsam (one per weekday). p.31: Universal post-Qasam supplication. p.36: Daily Dhikr (يا حي يا قيوم, 313/1000×). p.42: Pre-work Istikhara prayer. p.50: Talisman supplication. Total: 18 recitations found.",
    },
  ],
  total_mantras_found: 18,
  conclusion: "18 recitations found in Kashf al-Haqa'iq (pp.27–31, 36, 42, 50). All integrated by category: Azayim (7), Aqsam (7), Universal supplications (2), Daily Dhikr (1), Pre-work prayer (1).",
};

// ═══════════════════════════════════════════════════════════════
// GET DAILY MANTRAS FOR A SPECIFIC DAY
// Returns all recitations relevant to the given weekday index
// (0=Sunday ... 6=Saturday), grouped by type.
// Includes day-specific Azimah + Qasam + all universal items.
// ═══════════════════════════════════════════════════════════════
export function getDailyMantrasForDay(dayIndex) {
  const results = [];

  // Day-specific Azimah
  const azimah = KASHF_AZAYIM_BY_DAY.find(m => m.day_index === dayIndex);
  // Day-specific Qasam
  const qasam = KASHF_AQSAM_BY_DAY.find(m => m.day_index === dayIndex);

  const daySpecific = [azimah, qasam].filter(Boolean);
  if (daySpecific.length > 0) {
    results.push({
      source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", scholar: "Anonymous Omani scholar" },
      group_label_en: "Weekday Invocations (Azimah + Qasam)",
      group_label_ml: "ദൈനംദിന ആഹ്വാനം (അസീമ + ഖസം)",
      group_label_tr: "Günlük Çağrılar (Azimah + Kasem)",
      mantras: daySpecific,
    });
  }

  // Universal supplications (any day)
  results.push({
    source: { book: "كشف الحقائق", book_en: "Kashf al-Haqa'iq", book_ml: "കശ്ഫ് അൽ-ഹഖാഇഖ്", scholar: "Anonymous Omani scholar" },
    group_label_en: "Universal Supplications (All Days)",
    group_label_ml: "സർവ ദിവസ ദു‌ആകൾ",
    group_label_tr: "Evrensel Dualar (Her Gün)",
    mantras: [...KASHF_UNIVERSAL_SUPPLICATIONS, ...KASHF_DAILY_DHIKR, ...KASHF_PRE_WORK_PRAYER],
  });

  return results;
}

export function getTotalMantraCount() {
  return KASHF_AZAYIM_BY_DAY.length
    + KASHF_AQSAM_BY_DAY.length
    + KASHF_UNIVERSAL_SUPPLICATIONS.length
    + KASHF_DAILY_DHIKR.length
    + KASHF_PRE_WORK_PRAYER.length;
}

export function hasAnyDailyMantras() {
  return getTotalMantraCount() > 0;
}