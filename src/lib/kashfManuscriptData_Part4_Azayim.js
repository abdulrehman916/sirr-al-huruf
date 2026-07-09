// ═══════════════════════════════════════════════════════════════
// KASHF AL-HAQA'IQ — PART 4: NEW AZAYIM (pp.180-212)
// Source: PDFs pp.181-212 of the Omani manuscript
// Includes:
//   - Continuation of Azimah Idris (p.180-181)
//   - Azimah al-Zawra (p.181) — Palm stick exorcism by Sheikh Khamis al-Abri
//   - Azimah al-Khanjar (p.182-186) — Dagger azimah (3 types) by Sheikh Hilal
//   - Azimah al-Mischah (p.186) — Hoe azimah
//   - Al-Dawah al-Rashidiyya (p.187-189) — Planetary invocation (54x/day)
//   - Tawkeel al-Muluk al-Sab'a (p.190) — Deputizing the 7 kings
//   - Azimah al-Burhatiyya (p.190-200) — The Old Covenant (4 versions)
//   - Azimah Khalkhalat al-Hawa (p.200) — Stirring the Air/Heart
//   - Dawat Asma al-Qamar (p.201-202) — Invocation of Moon Names
//   - Al-Dawat al-Lahutiyya (p.203-205) — Divine Invocation
//   - Dawat li-Surat al-Fatiha (p.205-206) — Fatiha Invocation
//   - Zajr Adhim (p.206-208) — Great Compulsion
//   - Zajr al-Mudhhish al-Muhriq (p.208-209) — Stunning/Burning Compulsion
//   - Azimah Istihdar al-Ammar (p.209) — Summoning Resident Jinn
//   - Azimah Qahr al-A'wan (p.209-210) — Overpowering Helpers
// ALL Arabic text is verbatim from the manuscript PDFs.
// ═══════════════════════════════════════════════════════════════

const SOURCE_AR = "كشف الحقائق";
const SOURCE_EN = "Kashf al-Haqa'iq";

// ══════════════════════════════════════════════════════════════════
// AZIMAH AL-ZAWRA (عزيمة الزورة) — Palm Stick Exorcism
// Source: p.181 — By Sheikh Khamis bin Rashid al-Abri
// Used: Cut a palm frond (male palm), arm-length or longer
// Write Surah al-Zalzala on it, with angel names at tips
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_ZAWRA = {
  id: "azimah_zawra",
  title_ar: "عزيمة الزورة",
  title_en: "The Palm Stick Exorcism",
  scholar: "الشيخ خميس بن راشد العبري",
  page: 181,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 181 },
  materials: "زورة من نخلة فحل طولها قدر ذراع أو أكثر (a palm frond from a male palm, arm-length or more)",
  angels_at_tips: "إسرافيل، عزرائيل — عند طرف الزورة؛ جريائيل، ميكائيل — عند قرب المقبض",
  purpose_ml: "ആഭിചാരം, ജ്ഞ — ചൂരൽ ഉപയോഗിച്ചുള്ള ആഭിചാര നിർത്തൽ",
  purpose_en: "Palm stick exorcism for magic and jinn. Write Surah al-Zalzala + angel names on the stick, then recite Surah Ya-Sin and command the stick to go to the thief/affected person.",
  arabic_text: `بسم الله الرحمن الرحيم إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا وَقَالَ الْإِنسَانُ مَا لَهَا يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا بِأَنَّ رَبَّكَ أَوْحَى لَهَا أَوْحَى لَهَا أَوْحَى لَهَا أَوْحَى لَهَا أَوْحَى لَهَا أَوْحَى لَهَا`,
  usage: [
    "Cut palm frond from male palm (arm-length), write Surah al-Zalzala on it",
    "Write angel names: Israfil + Azrail at tip; Jibrail + Mikail near handle",
    "Recite Surah Ya-Sin to 'وكل شيء أحصيناه في إمام مبين'",
    "Say: سيري أيتها الزورة إلى سارق متاع فلان بن فلان",
    "Keep repeating until it moves (first slowly, then forcefully)"
  ],
  notes: "Some people need days, others only one day or less — depends on practice"
};

// ══════════════════════════════════════════════════════════════════
// AZIMAH AL-KHANJAR (عزيمة الخنجر) — Dagger Azimah
// Source: pp.182-186 — 3 versions
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_KHANJAR = [
  {
    id: "azimah_khanjar_1",
    number: 1,
    title_ar: "العزيمة الأولى: لمعرفة الخبر (عزيمة الخنجر)",
    title_en: "Dagger Azimah 1 — For Knowing Hidden Things",
    scholar: "الشيخ هلال بن سالم بن راشد الصبيحي",
    page: 182,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 182 },
    purpose_ml: "ഖഞ്ജർ — ഒന്നാം ആഭിചാരം: രഹസ്യ അറിവ്, കള്ളൻ കണ്ടെത്തൽ",
    purpose_en: "Place Quran open at Surah Ya-Sin; bind the Khanjar handle into it; two people hold it from each side by index finger. Recite prayer — dagger turns by Allah's will to indicate the thief/truth.",
    arabic_text: `بسم الله الرحمن الرحيم قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ وَلَوْ أَنَّ قُرْآنًا سُيِّرَتْ بِهِ الْجِبَالُ أَوْ قُطِّعَتْ بِهِ الْأَرْضُ أَوْ كُلِّمَ بِهِ الْمَوْتَى بَلْ لِلَّهِ الْأَمْرُ جَمِيعًا وَلَوْ شَاءَ اللَّهُ لَهَدَاهُمْ أَجْمَعِينَ فَلَعَرَفْتَهُمْ بِسِيمَاهُمْ وَلَتَعْرِفَنَّهُمْ فِي لَحْنِ الْقَوْلِ وَلَقَدْ كَشَفْنَا عَنكَ غِطَاءَكَ فَبَصَرُكَ الْيَوْمَ حَدِيدٌ اللهم بحق كهيعص حمعسق يس وَالْقُرْآنِ الْحَكِيمِ بحق وسر هذه الآيات البينات والأسماء المعظمات أن كان كذا وكذا فليدر هذا الخنجر فإنه يدور بإذن الله تعالى`,
    procedure: "Two people hold Khanjar handle between their index fingers; dagger rotates on the name of the guilty party"
  },
  {
    id: "azimah_khanjar_2",
    number: 2,
    title_ar: "العزيمة الثانية: للهيبة والقبول والتحصين",
    title_en: "Dagger Azimah 2 — For Awe, Acceptance and Protection",
    scholar: "غير منسوب",
    page: 183,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 183 },
    purpose_ml: "ഖഞ്ജർ — രണ്ടാം ആഭിചാരം: ഹൈബ, ഖബൂൽ, ഹിജ്‌ബ്",
    purpose_en: "Recited before wearing the Khanjar in gatherings or occasions. Gives awe (haybah), acceptance, and protection. The Khanjar becomes a spiritual fortress.",
    timing: "قبل ارتداء الخنجر في المجالس أو المناسبات",
    arabic_text: `بسم الله العظيم وبنور وجهه الكريم يا من أنزل الحديد فيه بأس شديد اجعل لهذا الخنجر مهابة في القلوب وقبولاً وسراً في العيون وناصراً في اليد ونصراً على كل من عاداني اللهم اربط عليه روح الهيبة واحرسه بروح القوة واجعل فيه سلطاناً يُخرِس لسان المعتدي وتضعف به نفس الظالم ولا يُحمل إلا بحق ولا يُستخدم إلا في عدل بحق حملة العرش وبأسمائك القيوم الكامل المهيمن الجبار بحق سرك العظيم وبحق سبوح قدوس رب الملائكة والروح اللهم كن وليا وناصراً وكفيلاً ووكيلاً وحسيباً وحفيظاً برحمتك وفضلك واجعل جميع مخلوقاتك طوع يدي مالكاً أزمة قلوبهم محبوباً عندهم معززاً مكرماً مهاباً فيهم لا يعصون أمري ولا أنال منهم مكروهاً أبداً`,
    incense: "Not specified",
    notes: "Ends with a long list of oaths including Surah al-Kahf and Yasin verses"
  },
  {
    id: "azimah_khanjar_3",
    number: 3,
    title_ar: "العزيمة الثالثة: لجلب السارق",
    title_en: "Dagger Azimah 3 — For Bringing the Thief",
    scholar: "غير منسوب",
    page: 185,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 185 },
    purpose_ml: "ഖഞ്ജർ — മൂന്നാം ആഭിചാരം: കള്ളനെ കൊണ്ടുവരൽ",
    purpose_en: "Bury the Khanjar in the ground and recite to bring the thief to the scene.",
    arabic_text: `اللهم يا من لا تضيع لديه الودائع أسألك بأسمائك ونور وجهك أن تجلب لي سارق متاع فلان بن فلانة صاغراً حيراناً بحق ما أنزلنا عليك القرآن لتشقى وبحق الاسم الأعظم المخزون`,
    procedure: "Bury Khanjar in ground where the theft occurred; recite with the full Burhatiyya oath"
  }
];

// ══════════════════════════════════════════════════════════════════
// AZIMAH AL-MISCHAH (عزيمة المسحاة) — Hoe Exorcism
// Source: p.186
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_MISCHAH = {
  id: "azimah_mischah",
  title_ar: "عزيمة المسحاة",
  title_en: "The Hoe Exorcism",
  page: 186,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 186 },
  purpose_ml: "മിസ്‌ഹ — കുഴൽ (hoe) ഉപയോഗിച്ചുള്ള ആഭിചാര നിർത്തൽ",
  purpose_en: "Write صهصليق (6 times) on a hoe, then recite. Fire/burn formula for dealing with the thief. Combines Quran 21:69 (fire on Ibrahim) and the sarf formula.",
  materials: "مسحاة (hoe), ويكتب عليها: صهصليق صهصليق صهصليق صهصليق صهصليق صهصليق",
  arabic_text: `قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَى إِبْرَاهِيمَ إلا سارق متاع فلان بن فلانه احرقيه بنارك وأذيقيه مس عذابك إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ أَلَّا تَعْلُوا عَلَيَّ وَأْتُونِي مُسْلِمِينَ الوحا الوحا العجل العجل الساعة الساعة`
};

// ══════════════════════════════════════════════════════════════════
// AL-DAWAH AL-RASHIDIYYA (الدعوة الرشيدية للأملاك الفلكية)
// Source: p.187-189 — Comprehensive planetary invocation
// Repetition: 54 times morning and evening with seclusion and fasting
// This is the MASTER collective invocation for all 7 planetary rulers
// Incense: لبان ذكر، جاوي أسود، كزبرة
// ══════════════════════════════════════════════════════════════════
export const DAWAH_RASHIDIYYA = {
  id: "dawah_rashidiyya",
  title_ar: "الدعوة الرشيدية للأملاك الفلكية",
  title_en: "The Rashidian Invocation of the Planetary Rulers",
  page: 187,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 187 },
  repetition: "54 مرة صباحاً ومساءً مع مراعاة الشروط والخلوة والصيام",
  incense: "لبان ذكر وجاوي أسود وكزبرة",
  purpose_ml: "ഗ്രഹ ഭരണാധിപൻ (7 ഫലകീ ദൂതൻ) — ജ്ഞ, ഭൂ, ആ, ഖ — ഏറ്റവും ഉ സ്‌ഥ ദൗ",
  purpose_en: "The master collective invocation encompassing all spiritual secrets. Whoever maintains it with conditions (seclusion, fasting, purity) becomes one of the masters of spiritual work. Called 'the collective azimah for all spiritual secrets.'",
  arabic_text: `بسم الله الرحمن الرحيم بسم الله وبالله ومن الله وإلى الله وعلى الله وفي الله ولا إله إلا الله وما النصر إلا من عند الله ولا حول ولا قوة إلا بالله العلي العظيم وأصمت عليكم يا معشر الأرواح الروحانية والملوك الطاهرة الزكية والأشخاص الجوهرية والأرواح النورانية بحق حق الله وبقدرة قدر الله وبعظمة عظمة الله وبسلطان سلطان الله وبعز عز الله وبنور وجه الله وبما جرى به القلم من عند الله إلى خير خلق الله سيدنا محمد صلى الله عليه وآله بن عبد الله ورسول الله تبارك اسم الله وجل ثناء الله يا حي قيوم مالك الملك بديع السماوات والأرض ذو الجلال والإكرام عزيز جبار متكبر قهار قوي متين قادر مقتدر شديد البطش شديد العقاب سريع الحساب لا يغلبه غالب ولا ينجو منه هارب بحول الله وقوته وعظمة أسمائه وآياته أقسمت عليكم يا ملائكة رب العالمين بحق الأسماء التي تكلم بها ربنا على السماوات فارتفعت وعلى الأرض فسطحت وعلى الجبال فنصبت وعلى العيون فتفجرت وعلى الأنهار فجرت وعلى البحار فزخرت وعلى النجوم فأزهرت وعلى الشمس فأضاءت وعلى القمر فاستنار وعلى الليل فأظلم وعلى النهار فأضاء`,
  closing: `أيها الملوك الفلكية السبعة روقيائيل وجريائيل وسمسمائيل وميكائيل وضفيائيل وعنيائيل و عزرائيل والكرسي الجسيم والملائكة المقربين جبريل وميكائيل وإسرافيل وعزرائيل والأنبياء المرسلين والشهداء والصالحين وبحق التوراة والإنجيل والزبور والفرقان العظيم`,
  planetary_kings: {
    sunday: { king: "المذهب", servant: "دعول", angel: "روقيائيل" },
    monday: { king: "الأبيض", servant: "حندش", angel: "جبرائيل" },
    tuesday: { king: "الأحمر", servant: "حنغر", angel: "سمسمائيل" },
    wednesday: { king: "برقان", servant: "هميطل", angel: "ميكائيل" },
    thursday: { king: "شمهورش", servant: "شمرول", angel: "صرفيائيل" },
    friday: { king: "زوبعة", servant: "بطراق", angel: "عنيائيل" },
    saturday: { king: "ميمون", servant: "شمعون", angel: "عزرائيل" }
  }
};

// ══════════════════════════════════════════════════════════════════
// TAWKEEL AL-MULUK AL-SAB'A (توكيل الملوك السبعة)
// Source: p.190 — Deputizing the 7 planetary kings for breaking magic
// ══════════════════════════════════════════════════════════════════
export const TAWKEEL_MULUK_SAB = {
  id: "tawkeel_muluk_sab",
  title_ar: "توكيل الملوك السبعة",
  title_en: "Deputizing the Seven Kings",
  page: 190,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 190 },
  purpose_ml: "ഏഴ് ഭരണ (ഫലകീ) ദൂതൻ — ആഭിചാര നിർ, ജ്ഞ, ദ്ദ്‌ഹ, ഇ‌ അ",
  purpose_en: "Deputize the 7 planetary kings + their servants to break all magic, talismans, vows, evil eye, envy, jinn, spirits, diseases — and heal with spiritual and divine medicine.",
  arabic_text: `أجيبوا وتوكلوا يا ملوك وخدام هذه الأسماء العظام بحقها عليكم وعظمتها لديكم بإبطال وفك وحل وفسخ جميع الأسحار والأعمال والطلاسم والرصد والعهود وامنعوا تجديدها وتوكلوا بصرف ومنع وطرد جميع خدام السحر والعين والحسد والنظرة والطربة وكل مس وجن وشيطان وجميع العوارض والتوابع والزوابع والقرناء والعمار والأرواح والأرياح وتوابعها وأمراضها ونحوساتها وعبوثاتها ودكوا الحصون وفكوا القيود والأقفال عني وبالطب الروحاني وداووني وعالجوني وبالعناية الإلهية وبقدرة الله القوية من كل ما نتج وينتج عنهم من الأمراض والأوجاع ونظفوا وطهروا ولا تبقوا لها باقية ولا أثر وأصلحوا هالتي وقفلوها وحصنوني وحجبوني بحجاب من نور حتى لا يعود إلي شيء من ذلك العجل العجل الوحا الوحا الساعة الساعة بارك الله فيكم وعليكم`
};

// ══════════════════════════════════════════════════════════════════
// AZIMAH AL-BURHATIYYA (عزيمة البرهتية / العهد القديم)
// Source: pp.190-200 — 4 authentic versions
// One of the most famous and powerful azayim — The Old Covenant
// Attributed to Prophet Idris; contains upper and lower angel names
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_BURHATIYYA = [
  {
    id: "burhatiyya_1",
    number: 1,
    title_ar: "البرهتية — الصيغة الأولى (للشيخ المنذري السليفي)",
    title_en: "Burhatiyya 1 — Version of Sheikh al-Mundhiri al-Sulaiphy",
    scholar: "الشيخ المنذري السليفي رحمه الله تعالى",
    page: 191,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 191 },
    purpose_ml: "ബർഹ‌തിയ്യ — ആദ്യ രൂപം: ജ്ഞ, ഇ, ആ — ഏറ്റവും ശക്തമായ ആ",
    purpose_en: "Version 1 of the Old Covenant azimah. Contains the mysterious spirit-binding syllables. Invokes all 7 planetary kings by name.",
    opening_syllables: "بِرْهَتِيَةٍ بِرْهَتِيَةٍ كَرِيرٍ كَرِيرٍ تَتْلِيَةٍ تَتْلِيَةٍ طَوْرَانٍ طَوْرَانٍ مَزْجَلٍ مَزْجَلٍ بَرْجَلٍ بَرْجَلٍ تَرْقَبٍ تَرْقَبٍ بَرْهَشٍ بَرْهَشٍ غَلْمَشٍ غَلْمَشٍ خُوطِيرٍ خُوطِيرٍ بَرْشَانٍ بَرْشَانٍ كَظْهِيرٍ كَظْهِيرٍ نَمُوشَّلَخٍ نَمُوشَّلَخٍ بَشْكَيْلَخٍ بَشْكَيْلَخٍ قَزْ قَزْ مَزٍ مَزٍ أَنْغَلَلِيطٍ أَنْغَلَلِيطٍ قِيرَاتٍ قِيرَاتٍ غَيَاهاً غَيَاهاً كَيْدَهَوْلاءَ كَيْدَهَوْلاءَ شَمْخَاهِيرٍ شَمْخَاهِيرٍ شَمْهَاهِيرٍ شَمْهَاهِيرٍ شَمْخَاهِيرٍ شَمْهَارِيـخٍ شَمْهَارِيـخٍ شَرْهَمَيَاهٍ شَرْهَمَيَاهٍ",
    quranic_verse: `وَمَن يُعْرِضْ عَن ذِكْرِ رَبِّهِ يَسْلُكْهُ عَذَابًا صَعَدًا`,
    command: "اجيبوا مسرعين توكلوا به يا ميططرون",
    planetary_call: "اجب يا مذهب اجب يا ابيض اجب يا احمر اجب يا برقان اجب يا شمهورش اجب يا زوبعة اجب يا ميمون ويا أبا نوخ اجيبوا داعي الله"
  },
  {
    id: "burhatiyya_2",
    number: 2,
    title_ar: "البرهتية — الصيغة الثانية",
    title_en: "Burhatiyya 2 — Second Version",
    scholar: "غير منسوب",
    page: 192,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 192 },
    purpose_ml: "ബർഹ‌തിയ്യ — രണ്ടാം രൂപം",
    purpose_en: "Second version with different syllable arrangement. Invokes with Qadir verse, adds أزريدٍ أزريدٍ اندعالج and the 7 kings.",
    opening_syllables: "بِرْهَتِيَّةٍ بِرْهَتِيَّةٍ كَرِيرٍ كَرِيرٍ تَتْلِيَهٍ تَتْلِيَهٍ طُوْرَانٍ طُوْرَانٍ مَزْجَلٍ مَزْجَلٍ بَرْجَلٍ بَرْجَلٍ تَرْقَبٍ تَرْقَبٍ بَرْهَشٍ بَرْهَشٍ عَلْمَشٍ عَلْمَشٍ خُوطِيرٍ خُوطِيرٍ خَوَطَانٍ خَوَطَانٍ بَرٍّ بَرٍّ قَلْنَهُوْدٍ قَلْنَهُوْدٍ بَرْشَانٍ بَرْشَانٍ كَظْهِيرٍ كَظْهِيرٍ نِّوشَلَّمٍ نِّوشَلَّمٍ بِشَكْلِيمَّةٍ بِشَكْلِيمَّةٍ",
    quranic_invoking: "بِكَهْطَهُوْنَيَّةٍ بِكَهْطَهُوْنَيَّةٍ بِبَشَارِيشٍ بِشَارِيشٍ طُوِيشٍ طُوِيشٍ بَشَارِيشٍ طُوبَاشٍ بِلَطَشْفُّشُوِيلٍ أَيُوِيلٍ شَمْخَاهُو شَمْخَاهُو بحق كَهْكَهِيجٍ",
    notes: "Ends: إلا ما أخذت سمعهم وأبصارهم"
  },
  {
    id: "burhatiyya_3",
    number: 3,
    title_ar: "البرهتية — الصيغة الثالثة",
    title_en: "Burhatiyya 3 — Third Version",
    scholar: "غير منسوب",
    page: 193,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 193 },
    purpose_ml: "ബർഹ‌തിയ്യ — മൂന്നാം രൂപം: ഉ‌ `ആ ലത്തായ ഇഫ് അ` ഭ",
    purpose_en: "Third version. Adds invocation from hidden Quranic letter values. Invokes 7 kings, the Throne, and angel Metatron. Most elaborate version with full oath to Allah's attributes.",
    surah_invocation: "يا قَوْمَنَا أَجِيبُوا دَاعِيَ اللَّهِ وَآمِنُوا بِهِ يَغْفِرْ لَكُم مِّن ذُنُوبِكُمْ وَمَن لَّا يُجِبْ دَاعِيَ اللَّهِ فَلَيْسَ بِمُعْجِزٍ فِي الْأَرْضِ وَلَيْسَ لَهُ مِن دُونِهِ أَوْلِيَاءُ أُولَٰئِكَ فِي ضَلَالٍ مُّبِينٍ",
    planetary_call: "اجيبوا بحرمة الملك الموكل بكم روقيائيل والغالب عليكم السيد ميططرون وبمن هو بقائمة العرش ابجد وبأسماء الله اجلبكم وبآياته احصكم"
  },
  {
    id: "burhatiyya_4",
    number: 4,
    title_ar: "البرهتية — الصيغة الرابعة",
    title_en: "Burhatiyya 4 — Fourth Version",
    scholar: "غير منسوب",
    page: 195,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 195 },
    purpose_ml: "ബർഹ‌തിയ്യ — നാലാം രൂ: ബ ദ ‌ ‌ ‌, ‌",
    purpose_en: "Fourth version with 'بسم الله الملك الحق الدائم القديم' — mentions Cherubim angels, the divine light, and complete oath.",
    opening: "بسم الله الملك الحق الدائم القديم الذي ملاء نور وجهه الاكوان وأمدها بقوة جذبة هيبة سلطانه على كل ملك وجني وإنسي وشيطان وسلطان فخافته جميع المخلوقات واذعنت وتواضعت الملائكة الكروبيون من اعلى مقاماتها وسجدت وأجابت دعوة اسمه العظيم الأعظم لمن تكلم به",
    oath_name: "بسر بَدُوحٍ أَجْهَزَطٍ أقسمت عليكم أيتها الأرواح الروحانية العلوية والسفلية وخدام هذا العهد القديم أن تجيبوا دعوتي وتقضوا حاجتي وتتوكلوا بإذن الله"
  }
];

// ══════════════════════════════════════════════════════════════════
// AZIMAH KHALKHALAT AL-HAWA (عزيمة خلخلة الهوى وفتق الجوى)
// Source: p.200 — For commanding a jinn servant
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_KHALKHALAT = {
  id: "azimah_khalkhalat",
  title_ar: "عزيمة خلخلة الهوى وفتق الجوى",
  title_en: "The Azimah for Stirring the Air and Opening the Heart",
  page: 200,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 200 },
  purpose_ml: "ഖൽഖ‌ലത്ത് — ഹൃദ‌ ‌ ‌ ‌ ‌ ‌, ‌ ‌ ‌",
  purpose_en: "Invocation of pure spiritual entities to assign a jinn servant (khadim) from among the jinn who will serve, guard, and fulfill all needs. The servant remains bound by Allah's covenant not to assist in disobedience.",
  arabic_text: `بسم الله الرحمن الرحيم بسم الله المتعالي في دنوه المتداني في علوه المتجبر بجبروته المتفرد بالعزة والكبرياء العالم الذي أحاط علمه بالآخرة والأولى لا إله إلا هو الصمد القائم والسلطان الدائم الذي خضعت له الملوك وصار المالك لعظمته مملوك فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا أُولِي أَجْنِحَةٍ مَّثْنَى وَثُلَاثَ وَرُبَاعَ يَزِيدُ فِي الْخَلْقِ مَا يَشَاءُ اقسمت عليكم أيتها الأرواح الروحانية الطاهرة الملكوتية بالاسم السريع المطلوب منه الخبير المنيع المحجوب بلا حجاب اسم ذي السبعة الأحرف`,
  closing: "اجب يا مذهب ويا ابيض ويا أحمر ويا برقان ويا شمهورش ويا زوبعة ويا ميمون اجيبوا بما اقسمت به عليكم وَإِنَّهُ لَقَسَمٌ لَّوْ تَعْلَمُونَ عَظِيمٌ",
  khadim_conditions: "يلازم خدمتي وطاعتي ويحضرني ويراعي خدمتي وعليه عهده وميثاقه أن لا أضره في معصية الله"
};

// ══════════════════════════════════════════════════════════════════
// DAWAT ASMA AL-QAMAR (دعوة أسماء القمر)
// Source: pp.201-202 — Moon Names invocation with 7 secret names
// Each planetary angel + king paired with a secret moon name
// ══════════════════════════════════════════════════════════════════
export const DAWAT_ASMA_QAMAR = {
  id: "dawat_asma_qamar",
  title_ar: "دعوة أسماء القمر",
  title_en: "Invocation of the Moon Names",
  page: 201,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 201 },
  purpose_ml: "ദേ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ — ‌ ‌ ‌ ‌ ‌",
  purpose_en: "Invoke the 7 pure lunar spiritual entities (planetary rulers + their angels) using their secret moon names (Liyakhim, Liyalghu, Liyafur, etc.) to fulfill needs. Incense unspecified.",
  arabic_text: `بسم الله الذي لا اله إلا هو الحي القيوم الدائم القادر المقتدر القاهر الذي خلق الأشياء كلها كيف شاء بقدرته وأمر كل شيء بما سبق في علمه وحكم على كل شيء بما سبق في أزليته وخلق آدم عليه السلام بعظمته ونفخ فيه من روحه وصوره بحكمته وأمر الملائكة بالسجود إليه فسجدت له ملائكة السماوات والأرض بلا عدد ودحا الأرض ومدها بإرادته وكبريائه فاستمسكت بجلاله لا اله إلا هو الملك المعبود مخرج الأشياء من العدم إلى الوجود`,
  seven_moon_names: [
    { angel: "روقيائيل", king: "مذهب", moon_name: "لياخيم", secret: "بياه ياه" },
    { angel: "جريائيل", king: "مرة", moon_name: "ليالغو", secret: "بسام سام" },
    { angel: "سمسمائيل", king: "أحمر", moon_name: "ليافور", secret: "بدمليخ دمليخ" },
    { angel: "ميكائيل", king: "برقان", moon_name: "لياروث", secret: "بأهياش أهياش" },
    { angel: "صرفيائيل", king: "شمهروش", moon_name: "لياروغ", secret: "بدردميش دردميش" },
    { angel: "عنيائيل", king: "أبيض", moon_name: "لياروش", secret: "سبوح سبوح قدوس قدوس رب الملائكة والروح" },
    { angel: "كسفيائيل", king: "ميمون", moon_name: "لياشلش", secret: "بأزلي أزلي ازرار ازرار" }
  ],
  divine_names_in_dua: "مهمهوب مهمهوب ذي اللطف الخفي (يا الله يا الله يا الله) بصعصع صعصع ذي النور والبهاء والكمال والجلال (يا الله يا الله يا الله) بسهسهوب سهسهوب ذي العز الشامخ",
  closing: "أجيبوا بجلجميش حي قيوم قدوس الذي سخر البحر لموسى بن عمران عليه السلام والنار لإبراهيم عليه السلام"
};

// ══════════════════════════════════════════════════════════════════
// AL-DAWAT AL-LAHUTIYYA (الدعوة اللاهوتية)
// Source: pp.203-205 — The Divine Invocation
// Recited at night: 1, 3, 5, or 7 times; preceded by يا الله (1000x)
// ══════════════════════════════════════════════════════════════════
export const DAWAT_LAHUTIYYA = {
  id: "dawat_lahutiyya",
  title_ar: "الدعوة اللاهوتية",
  title_en: "The Divine Invocation",
  page: 203,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 203 },
  repetition: "ليلاً مرة أو ثلاث أو خمس أو سبع مرات — مسبوقاً بـ (يا الله ألف مرة)",
  purpose_ml: "ദൈ‌ ‌ — ‌ ‌ ‌ ‌ ‌ ‌, ‌ ‌ ‌",
  purpose_en: "The supreme Divine Invocation. Preceded by (يا الله) 1000 times. Opens with Allah's transcendence, light, unity, and the manifestation on Mount Sinai. Commands all upper and lower spirits through secret divine codes.",
  opening: "يا الله (ألف مرة) بسم الله الرحمن الرحيم بسم الله العظيم الذى احترق الحجاب من بهاء نوره وتدكدكت الجبال لهيبته وذلت الرقاب لعظمته يسبح الرعد بحمده والملائكة من خيفته هو الله الذى لا اله إلا هو الفرد الصمد المنفرد بربوبيته المتوحد في الملكوت بوحدانيته القديم السلطان الدائم الديوم الحي القيوم",
  divine_codes: "أنا الله الف لام ميم أنا الله يَاهٍ يَاهٍ أنا الله آهيا شراهيا أدوناي اصبائوت آل شداي أنا الله الأحد أنا الله الصمد أنا الله حططاخيم أنا الله مَهُوشَدارخاشيم",
  divine_declaration: "أنا الله قال العزة ردائي والعظمة دثاري ومن يخالفني أحرقته بناري وأنا عليه جبار يوم القيامة",
  closing_command: "اهبطوا أيتها الأرواح أينما كنتم في ملكوت الله تعالى علوياً وسفلياً ترابياً وناراً وهوائياً وسحابياً وغمامياً وبرياً وبحرياً أجيبوا بحق ما اقسمت به عليكم"
};

// ══════════════════════════════════════════════════════════════════
// DAWAT LI-SURAT AL-FATIHA (دعوة لسورة الفاتحة)
// Source: pp.205-206
// ══════════════════════════════════════════════════════════════════
export const DAWAT_FATIHA = {
  id: "dawat_fatiha",
  title_ar: "دعوة لسورة الفاتحة",
  title_en: "Invocation Through Surah al-Fatiha",
  page: 205,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 205 },
  purpose_ml: "ഫാ‌ ‌ ‌ — ‌ ‌ ‌ ‌ ‌",
  purpose_en: "Invocation using Surah al-Fatiha's spiritual power. Includes praise in all worlds, ends with requesting from Allah through al-Khadir and fulfillment of needs.",
  arabic_text: `بسم الله الرحمن الرحيم الحمد لله رب العالمين حمداً يفرق بل يوافق وبفضل حمد الحامدون وبالأولين والآخرين حمداً يكون لي رضىً وحفضاً عند رب العالمين الرحمن الرحيم الدي دحى وهدى الأقاليم واختص موسى الكليم وأحيا العظام وهي رميم فهدان اسمان جليلان شفاء لكل سقيم ملك يوم الدين الذي لا منازع له ولا قرير ولا نظير له ولا معين`,
  petition: "اللهم أكرمني بسر الفاتحة ووفقني لسرها واظهر لي روحانيتها وسخر لي الاخيضر إنك على كل شيء قدير",
  closing: "بسم الله الرحمن الرحيم بدوح دحوب ودحب يا مالك ملوك العوالم لا إله إلا أنت سبحانك أني كنت من الظالمين"
};

// ══════════════════════════════════════════════════════════════════
// ZAJR ADHIM (زجر عظيم) — Great Compulsion for Spirits
// Source: pp.206-208 — Also an amulet against evil
// ══════════════════════════════════════════════════════════════════
export const ZAJR_ADHIM = {
  id: "zajr_adhim",
  title_ar: "زجر عظيم",
  title_en: "The Great Compulsion",
  page: 206,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 206 },
  purpose_ml: "ഉ‌ ‌ ‌ — ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌",
  purpose_en: "Great compulsion for summoning spirits and their obedience. Also a protective amulet — no rebellious spirit or jinn can harm the one who recites it. Reveals spirits visually (iyanan).",
  arabic_text: `بسم الله الكبير العظيم فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ الْعَلِيمُ سبحان من ألجم الجن بكلماته فانقادت بقدرته ومخافة سطوته ونقمته فقهرهم بشدة قهره وأنقذ منهم المؤمنين بعهده سبحان من يسبح الرعد بحمده والملائكة من خيفته وخطف البرق بقدرته مسرعاً وطارت الشياطين هاربة وفزعة وعنت الوجوه للحي القيوم خاضعة لربوبيته دهشاً وتضعضعت الأركان دون حجابه تحيراً`,
  closing_petition: "اللهم سخر لي ملائكتك لأستدل على عظيم ربوبيتك واجعل مستحقاً لتسبيح قدرتك وسخر لي خلقك من الجن والإنس أجمعين",
  additional_compulsions: [
    {
      title: "زجر المدهش المحرق",
      page: 208,
      arabic: "بسم الله الرحمن الرحيم سبحان من كان ولا مكان مفني الدهور والأزمان سبحان خالق الأنس والجان سبحان من تقدس وتمجد بالعظمة والجلال",
      purpose: "Stunning and burning compulsion — invokes angel Metatron to strike disobedient spirits with fire spears"
    }
  ]
};

// ══════════════════════════════════════════════════════════════════
// AZIMAH ISTIHDAR AL-AMMAR (عزيمة استحضار العمار وتسخيرهم)
// Source: p.209 — Summoning and subjugating resident jinn
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_ISTIHDAR_AMMAR = {
  id: "azimah_istihdar_ammar",
  title_ar: "عزيمة استحضار العمار وتسخيرهم",
  title_en: "Azimah for Summoning and Subjugating Resident Jinn",
  page: 209,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 209 },
  purpose_ml: "‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌",
  purpose_en: "Summon the king of resident jinn (Tarish) or the jinn of a specific location to answer questions truthfully. When summoned, ask: 'I want you to inform me of such-and-such truthfully — if you lie, divine punishment of the people of Aad will fall upon you.'",
  arabic_text: `أقسم عليك يا طارش ملك العمار (أو يا عامر هذه البقعة) بسره الخفي وسلطانه القوي وبحق شَلَهَشٍ رَهَطَيُوشٍ رَهَطَيُوشٍ رَهَطُيُوشٍ هَرَشَّطَلَشٍ زَاطُوشٍ مَهَطَفِيشٍ آلُومَتِشٍ هَمَّلِيلاً شَطَكُّهُوشٍ شَطُّوطِشٍ جَهَلَّطِشٍ يِطِيشٍ عَهَّطِيشٍ مَهَلَّطُوشٍ مَقُلَطَيَشٍ مَيَطَيَاطِشٍ مَهَلَّيَاطُوشٍ`,
  instructions: "عند استحضار العمار فيكون توجيهك للسؤال أن تقول أريد أن تخبروني بما هو كذا وكذا من غير كذب ولا بهتان وأن ظهر الأمر بضد ما تقول نزل بك من العذاب ما نزل على قوم عاد فإنه يصدقك في كل ما تسأله عنه"
};

// ══════════════════════════════════════════════════════════════════
// AZIMAH QAHR AL-A'WAN (عزيمة قهر الأعوان)
// Source: pp.209-210 — Overpowering spiritual helpers for dismissal or summoning
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_QAHR_AWAN = {
  id: "azimah_qahr_awan",
  title_ar: "عزيمة قهر الأعوان",
  title_en: "Azimah for Overpowering the Spiritual Helpers",
  page: 209,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 209 },
  purpose_ml: "‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌",
  purpose_en: "For dismissing OR summoning. 'أيها الملائكة الكرام' for dismissal; 'أيها الملوك الروحانية والأرواح الطاهرة' for summoning. Read ONCE for either purpose.",
  arabic_text: `أقسم عليكم أيها الملائكة الكرام (إن أردت الاستنزال) أما إن أردت الاستحضار فتقول أيها الملوك الروحانية والأرواح الطاهرة الحاكمون على كل جني وعفريت ومارد وشيطان بأسماء الله تعالى التي لا يعصيها مخلوق ولا يتخلف عنها روح وبالكتب المنزلة على الأنبياء المرسلة وما فيها من الأسرار والطاعة عليكم بالحجب النورانية والحروف السريانية المنزلة على آدم وبصحف إبراهيم وموسى وبالتوراة والإنجيل والزبور والفرقان وبالعرش العظيم والكرسي الكريم وبالأفلاك السبعة والإمدادات وكواكبها`,
  surah_solomon: `إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ أَلَّا تَعْلُوا عَلَيَّ وَأْتُونِي مُسْلِمِينَ`,
  note: "تلاوته مرة واحدة سواء للاستنزال أو الاستحضار"
};

// ══════════════════════════════════════════════════════════════════
// AZIMAH AL-SHAWKA (عزيمة الشوكة) — Thorn/Needle Exorcism
// Source: p.211 — For removing a stuck thorn or needle
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_SHAWKA = {
  id: "azimah_shawka",
  title_ar: "عزيمة الشوكة",
  title_en: "The Thorn Exorcism",
  page: 211,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 211 },
  repetition: "3 مرات",
  purpose_ml: "‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌",
  purpose_en: "Remove a thorn or needle stuck in flesh, bone, nerve, fat, blood, or skin. Command it to slide out painlessly like fire was cool for Ibrahim.",
  arabic_text: `بسم الله الرحمن الرحيم عزمت عليك أيتها الشوكة بنت شائكة رطبة أم يابسة مسلمة أم كافرة يهودية أم نصرانية أيبسي أو أخرجي وتسلسلي بقدرة الله في العروق أو في العظم أو في الجلد في الدم أو في الشحم أو في اللحم أو في العصب أو في المفاصل بحق لا حول ولا قوة إلا بالله العلي العظيم وصلى الله على سيدنا محمد وآله وصحبه وسلم`
};

// ══════════════════════════════════════════════════════════════════
// AZIMAH AL-IBRIQ (عزيمة الإبريق) — Teapot/Pitcher Exorcism
// Source: pp.211-212 — Two versions for identifying thieves
// ══════════════════════════════════════════════════════════════════
export const AZIMAH_IBRIQ = [
  {
    id: "azimah_ibriq_1",
    number: 1,
    title_ar: "عزيمة الإبريق — الصيغة الأولى (الشيخ سالم بن عامر الحارثي)",
    title_en: "Teapot Azimah 1 — By Sheikh Salim bin Amer al-Harthi",
    scholar: "الشيخ سالم بن عامر الحارثي رحمه الله",
    page: 211,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 211 },
    purpose_ml: "ഇ‌ ‌ — ‌ ‌ ‌ ‌ ‌ ‌",
    purpose_en: "Write angel names on teapot sides. Recite Surah Ya-Sin. Hold empty teapot between two people's index fingers. When it spins, that person is the thief.",
    angels_on_teapot: { right: "جريائيل", left: "ميكائيل", handle: "إسرافيل", spout: "عزرائيل" },
    arabic_text: `مَا دَلَّهُمْ عَلَىٰ مَوْتِهِ إِلَّا دَابَّةُ الْأَرْضِ تَأْكُلُ مِنسَأَتَهُ فَلَمَّا خَرَّ تَبَيَّنَتِ الْجِنُّ أَجِبْ أيها الملك أنت وأعوانك وخدامك وبين سارق متاع فلان بن فلانة الوحا الوحا العجل العجل الساعة الساعة`
  },
  {
    id: "azimah_ibriq_2",
    number: 2,
    title_ar: "عزيمة الإبريق — الصيغة الثانية (الشيخ عبدالله بن حمود العذالي)",
    title_en: "Teapot Azimah 2 — By Sheikh Abdullah bin Hamoud al-Adhali",
    scholar: "الشيخ عبدالله بن حمود العذالي رحمه الله تعالى",
    page: 211,
    source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 211 },
    purpose_ml: "ഇ‌ ‌ — ‌ ‌ ‌ ‌ ‌ ‌",
    purpose_en: "Write suspect name on teapot. Two people hold it between index fingers. Recite Surah Ya-Sin to 'وجعلني من المكرمين'. Teapot rotates on the guilty name.",
    procedure: "Write suspect name + mother's name (if unknown, write حواء), then recite"
  }
];

// ══════════════════════════════════════════════════════════════════
// AL-SALAT AL-NARIYYA (الصلاة النارية)
// Source: p.212 — The Burning/Fire Prayer on the Prophet ﷺ
// ══════════════════════════════════════════════════════════════════
export const SALAT_NARIYYA = {
  id: "salat_nariyya",
  title_ar: "الصلاة النارية",
  title_en: "The Fire (Nariyya) Prayer",
  page: 212,
  source: { book: SOURCE_AR, book_en: SOURCE_EN, page: 212 },
  purpose_ml: "‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌",
  purpose_en: "The famous Salat al-Nariyya — dissolves knots, removes distress, fulfills needs, gains desires, achieves good endings. Recited at every breath in Allah's count.",
  arabic_text: `اللهم صل صلاةً كاملةً وسلم سلاماً تاماً على سيدنا محمد النبي الذي تنحل به العقد وتنفرج به الكرب وتقضى به الحوائج وتنال به الرغائب وحسن الخواتيم ويستسقى الغمام بوجهه الكريم وعلى آله وصحبه في كل لمحة ونفس عدد كل معلوم لك`
};

// All new azayim for export
export const ALL_NEW_AZAYIM = [
  AZIMAH_ZAWRA,
  ...AZIMAH_KHANJAR,
  AZIMAH_MISCHAH,
  DAWAH_RASHIDIYYA,
  TAWKEEL_MULUK_SAB,
  ...AZIMAH_BURHATIYYA,
  AZIMAH_KHALKHALAT,
  DAWAT_ASMA_QAMAR,
  DAWAT_LAHUTIYYA,
  DAWAT_FATIHA,
  ZAJR_ADHIM,
  AZIMAH_ISTIHDAR_AMMAR,
  AZIMAH_QAHR_AWAN,
  AZIMAH_SHAWKA,
  ...AZIMAH_IBRIQ,
  SALAT_NARIYYA
];

export default ALL_NEW_AZAYIM;