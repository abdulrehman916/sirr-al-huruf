// ── KASAM DATABASE (Section 4 only) ──────────────────────────────────────────
// SOURCE AUTHORITY: PDF manuscripts only — "Bastların Usulü Vefklerin Sırrı ve Havassı"
// NO AI-generated text. NO web content. NO reconstructed text.
// ─────────────────────────────────────────────────────────────────────────────
//
// CORRECT PDF STRUCTURE (pages 76–80):
//
//   The Common Kasam is the FIXED FRAME. It ALWAYS opens and closes every Azimet.
//   The purpose-specific phrase is inserted INSIDE the Common Kasam frame.
//
//   FULL READING ORDER (PDF sentence order):
//
//   أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ
//   [ESMAİ-AVAN]                    ← computed Esma-i A'van (يَا prefix each)
//   [PURPOSE_PHRASE]                ← purpose-specific text with {names} tokens
//   [ESMAİ-KASEM]                   ← computed Esma-i Kasem (بِحَقِّ prefix each)
//   بِالْوَاحِدِ الأَحَدِ ... فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ
//
// TOKENS in the assembled final text:
//   [ESMAİ-AVAN]    → يَا Name1 يَا Name2 ...
//   [ESMAİ-KASEM]   → بِحَقِّ Name1 بِحَقِّ Name2 ...
//   [PURPOSE]       → the category-specific purpose phrase (with {name} tokens resolved)
//   {maleTargetName}     → male target full name
//   {femaleTargetName}   → female target full name
//   {requesterName}      → requester full name
// ─────────────────────────────────────────────────────────────────────────────

// ── COMMON KASAM — The complete fixed frame (PDF Page 78) ─────────────────────
// This is the FULL text that EVERY Azimet uses, unchanged.
// [ESMAİ-AVAN], [PURPOSE], [ESMAİ-KASEM] are injection points within this frame.
//
// Arabic reading order per PDF:
//   1. Opening invocation
//   2. Esma-i A'van (يَا prefix)  ← [ESMAİ-AVAN]
//   3. Purpose-specific phrase    ← [PURPOSE]
//   4. Esma-i Kasem (بِحَقِّ prefix) ← [ESMAİ-KASEM]
//   5. Closing invocation (الواحد الأحد ... فسبحان)

export const COMMON_KASAM = {
  id: "common",
  label: "Common Kasam — PDF Page 78",
  arabic: "أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ",
  malayalamLabel: "Common Kasam — PDF Page 78",
  source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 78",
  usageNote:
    "ശൈഖ് തംതം സമൂർ ഹിന്ദി (റഹ്) വചനപ്രകാരം: Esma-i A'van-ന്റെ മുൻപ് 'يا' (Yâ), Esma-i Kasem-ന്റെ മുൻപ് 'بحق' (Bi hakki) ചേർത്ത് ഓതണം. Esma-i Kitabet ഉൾപ്പെടുത്തരുത്.",

  // The full Common Kasam frame with injection tokens.
  // [ESMAİ-AVAN]  → computed A'van names with يَا prefix
  // [PURPOSE]     → the selected purpose phrase (with target names already resolved)
  // [ESMAİ-KASEM] → computed Kasem names with بِحَقِّ prefix
  fullFrame:
    "أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ [ESMAİ-AVAN] [PURPOSE] [ESMAİ-KASEM] بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ اللهِ الْعَزِيزِ الْحَكِيمِ الَّذِي يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",

  // Malayalam meaning of the Common Kasam frame (without purpose phrase)
  openingMalayalam:
    "ഹേ ആദരണീയ ആത്മാക്കളേ, ഞാൻ നിങ്ങളോട് ആണ ചെയ്യുന്നു —",
  closingMalayalam:
    "ഏകനും, ആരാലും ആശ്രയിക്കപ്പെടുന്നവനും, ഭർത്താവോ മക്കളോ ഇല്ലാത്തവനും, ജനിക്കാത്തവനും, ജനിപ്പിക്കപ്പെടാത്തവനും, ആർക്കും തുല്യനില്ലാത്തവനുമായ (അല്ലാഹുവിന്റെ) ഇടത്ത് കൊണ്ട് — എന്റെ ആവശ്യം നടപ്പാക്കൂ, എന്റെ പ്രാർത്ഥന ഉത്തരം ചെയ്യൂ. ആകാശ-ഭൂമിയിലുള്ളതെല്ലാം അവന് തസ്ബീഹ് ചൊല്ലുന്ന, അസീസ്-ഹകീം ആയ അല്ലാഹുവിന്റെ സഹായത്തോടെ. സകല കാര്യങ്ങളുടെ ആധിപത്യം അവൻ്റെ കൈകളിൽ — അവങ്കലേക്ക് നിങ്ങൾ മടക്കിഅയക്കപ്പെടും.",
};

// ── KASAM CATEGORIES ──────────────────────────────────────────────────────────
// Each category defines ONLY its purpose-specific phrase (purposeArabic / purposeMalayalam).
// The Final Kasam is assembled by the renderer as:
//   COMMON_KASAM.fullFrame with [ESMAİ-AVAN], [PURPOSE], [ESMAİ-KASEM] replaced.
//
// purposeArabic may contain {maleTargetName}, {femaleTargetName}, {requesterName} tokens.
// These are resolved before injection into the frame.
// ─────────────────────────────────────────────────────────────────────────────

export const KASAM_CATEGORIES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. MUHABBET (LOVE)
  // Source: PDF Pages 76–77
  // Purpose phrase: invokes love spirits + سَحَّرَ قَلْبَ construction with names
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "muhabbet",
    label: "Muhabbet",
    arabic: "المحبة",
    malayalamLabel: "സ്നേഹം / പ്രണയം",
    icon: "❤",
    description: "Love & Affection",
    nameFields: ["targetFemale", "targetMale"],
    source: "PDF Pages 76–77",
    // The purpose phrase only — injected at [PURPOSE] inside the Common Kasam frame
    purposeArabic:
      "يُحِبُّونَهُمْ كَحُبِّ اللهِ وَالَّذِينَ آمَنُوا أَشَدُّ حُبًّا لِلَّهِ أَنْتَ الْمُعَمِّمَاتُ الْقُلُوبَ لِلْمَحَبَّةِ يَا جَمرَغَبْ وَيَا أَمْخَعَهُ وَيَا عَقْفَزَكَ وَيَا حَغْبَجَمَ وَيَا رَغْبَامْ وَيَا جَعْجَمَرْ سَحَّرَ قَلْبَ {femaleTargetName} عَلَى مَحَبَّةِ وَعِشْقِ {maleTargetName} بِحَقِّ أَسْمَاءِكُمُ الطَّاهِرَةِ وَبُخُورِكُمُ الْمُقَدَّسَةِ وَأَخْلاَقِكُمُ الشَّرِيفَةِ أَسْرِعُوا بِجَلْبِ الْقُلُوبِ مِنْ طَرْفَةِ الْعَيْنِ أَيُّهَا الأَرْوَاحُ الطَّاهِرَةُ الْمُطَهَّرَةُ الْمُبَارَكَةُ أَسْرِعُوا الْوَاحَا الْوَاحَا الْوَاحَا الْعَجَلَ الْعَجَلَ الْعَجَلَ السَّاعَةَ السَّاعَةَ السَّاعَةَ بِحَقِّ زَكَجَعْ وَبِحَقِّ بَفَعَحْ وَبِحَقِّ فَتَعَبْ وَبِحَقِّ مَشَعَا وَبِحَقِّ صَظَرَكَ",
    purposeMalayalam:
      "അവർ അല്ലാഹുവിനെ സ്നേഹിക്കുന്നതുപോലെ (ഇവരെ) സ്നേഹിക്കൂ — സത്യവിശ്വാസികൾ അല്ലാഹുവിനോട് ഏറ്റവും ശക്തമായ സ്നേഹം ഉള്ളവരാണ്. നിങ്ങൾ ഹൃദയങ്ങളെ സ്നേഹത്തിൽ ആഴ്ത്തുന്നവരാണ്. ഓ ജംറഗബ്, ഓ അംഖഅഹ്, ഓ അഖ്ഫസക്, ഓ ഹഗ്ബജം, ഓ റഗ്ബാം, ഓ ജഅ്ജമർ — {femaleTargetName} -ന്റെ ഹൃദയം {maleTargetName} -യോടുള്ള സ്നേഹത്തിൽ മോഹിക്കട്ടെ. നിങ്ങളുടെ പരിശുദ്ധ നാമങ്ങൾ, ധൂപങ്ങൾ, ഗുണഗണങ്ങൾ കൊണ്ട് ഹൃദ്‌ ഹൃദ്‌ ഹൃദ്‌ ഇക്ഷണം ആകർഷിക്കൂ — ഉടൻ! ഉടൻ! ഉടൻ! ഇപ്പോൾ! ഇപ്പോൾ! ഇപ്പോൾ! ഈ നിമിഷം! ഈ നിമിഷം! ഈ നിമിഷം! — സകജഈ, ബഫഈഹ്, ഫതഈബ്, മശഈ, സ്വതർക്ക്.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HERKES TARAFINDAN SEVİLME (LOVED BY ALL)
  // Source: PDF Page 79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "herkessevilme",
    label: "Herkes Sevilme",
    arabic: "المحبة العامة",
    malayalamLabel: "എല്ലാവരുടെയും സ്നേഹം",
    icon: "☀",
    description: "Loved by All Creation",
    nameFields: ["requesterName"],
    source: "PDF Page 79",
    purposeArabic:
      "ثَبِّتْ ثَبِّتْ رُوحَانِيَّةَ الْمَحَبَّةِ وَالْمَوَدَّةِ وَالأُلْفَةِ بِجَمِيعِ الْخَلاَئِقِ وَامْتَزِجْ فِيهِ رُوحَانِيَّةَ الْمَحَبَّةِ فِي قُلُوبِ بَنِي آدَمَ وَبَنَاتِ حَوَّاءَ حُرِّهِمْ وَعَبْدِهِمْ وَسَائِرِ الْخَلْقِ أَجْمَعِينَ لِـ{requesterName}",
    purposeMalayalam:
      "മഹബ്ബത്ത്, മവദ്ദത്ത്, ഉൽഫത്ത് എന്നിവയുടെ ആത്മശക്തി ഉറപ്പിക്കൂ, ഉറപ്പിക്കൂ. ആദം സന്തതികളുടെയും ഹവ്വ പുത്രീ-പുത്രന്മാരുടെയും — അടിമകളുടെയും സ്വതന്ത്രരുടെയും — ഹൃദയങ്ങളിൽ {requesterName} -നോടുള്ള സ്നേഹം ലയിപ്പിക്കൂ.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ADAVET (ENMITY / SEPARATION)
  // Source: PDF Pages 78–79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "adavet",
    label: "Adavet",
    arabic: "العداوة",
    malayalamLabel: "ശത്രുത / വേർപാട്",
    icon: "⚔",
    description: "Enmity & Separation",
    nameFields: ["targetMale"],
    source: "PDF Pages 78–79",
    purposeArabic:
      "أَنْتُمْ مُصَرِّفُو الْقُلُوبِ هَيِّجُوا رُوحَانِيَّةَ الشَّرِّ وَالْخُصُومَةِ وَالْبَغْضَاءِ فَرِّقُوا بَيْنَ {maleTargetName} وَبَيْنَ قَرِينِهِ لاَ يَجْتَمِعَانِ وَلاَ يَتَحَابَّانِ وَلاَ يَتَّفِقَانِ وَلاَ يَسْمَعُ أَحَدُهُمَا كَلاَمَ الآخَرِ وَيَكُونَانِ كَالذِّئْبِ وَالْكَلْبِ وَالْهِرَّةِ وَالْفَأْرَةِ بِحَقِّ أَسْمَاءِكُمُ الطَّاهِرَةِ وَبُخُورِكُمُ الْمُقَدَّسَةِ وَأَخْلاَقِكُمُ الشَّرِيفَةِ أَسْرِعُوا بِالْعَدَاوَةِ الْوَاحَا الْوَاحَا الْوَاحَا الْعَجَلَ الْعَجَلَ الْعَجَلَ السَّاعَةَ السَّاعَةَ السَّاعَةَ",
    purposeMalayalam:
      "നിങ്ങൾ ഹൃദയങ്ങൾ നിയന്ത്രിക്കുന്നവരാണ് — ദോഷം, ശത്രുത, വൈരം എന്നിവയുടെ ആത്മശക്തി ജ്വലിപ്പിക്കൂ. {maleTargetName} -നും അദ്ദേഹത്തിന്റെ കൂട്ടാളിക്കും ഇടയിൽ വേർതിരിവ് ഉണ്ടാക്കൂ — ഒരിക്കലും ഒന്നിക്കരുത്, പ്രണയിക്കരുത്, യോജിക്കരുത്. ഒരാൾ മറ്റൊരാളുടെ വാക്ക് കേൾക്കരുത്. ചെന്നായ-നായ, പൂച്ച-എലി എന്ന പോലെ ആകട്ടെ. ഉടൻ! ഉടൻ! ഉടൻ! ഇപ്പോൾ! ഇപ്പോൾ! ഇപ്പോൾ! ഈ നിമിഷം! ഈ നിമിഷം! ഈ നിമിഷം!",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CELB (ATTRACTION) — PDF SOURCE INCOMPLETE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "celb",
    label: "Celb",
    arabic: "الجلب",
    malayalamLabel: "ആകർഷണം / വരുത്തൽ",
    icon: "✦",
    description: "Attraction",
    nameFields: ["targetMale"],
    source: "PDF SOURCE INCOMPLETE",
    purposeArabic: "",
    purposeMalayalam: "",
    status: "pending",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SİHİR BOZMA (BREAKING MAGIC)
  // Source: PDF Page 79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sihir",
    label: "Sihir Bozma",
    arabic: "كسر السحر",
    malayalamLabel: "സിഹിർ നീക്കം",
    icon: "🔒",
    description: "Breaking Magic",
    nameFields: ["targetMale"],
    source: "PDF Page 79",
    purposeArabic:
      "أَطْلِقُوا رُوحَانِيَّةَ السِّحْرِ النَّافِذَةَ عَنْ {maleTargetName} وَحُلُّوا عُقْدَتَهُ وَأَطْفِئُوهَا كَمَا يُطْفَأُ النَّارُ",
    purposeMalayalam:
      "{maleTargetName} -ൽ നിന്ന് ഊർജ്ജ-സിഹ്ർ ന്റെ ആത്മശക്തി വിടുവിക്കൂ, കെട്ട് അഴിക്കൂ, തീ കെടുക്കുന്നതുപോലെ ഇല്ലാതാക്കൂ.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. BAĞLIYI ÇÖZME (REMOVING BINDINGS)
  // Source: PDF Page 79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "bagli",
    label: "Bağlı Çözme",
    arabic: "حل الربط",
    malayalamLabel: "ബന്ധന മോചനം",
    icon: "🔗",
    description: "Removing Bindings",
    nameFields: ["targetMale"],
    source: "PDF Page 79",
    purposeArabic:
      "أَطْلِقُوا كُلَّ مَأْمُورٍ وَمَقْصُورٍ وَمَلْسُوعٍ وَمَبْرُودٍ وَأَخْرِجُوا الْفَعَّادَ الْمُسْتَكِنَّ عَنْ {maleTargetName} وَتَحَرَّكُ الشَّهْوَةُ وَالنِّكَاحُ",
    purposeMalayalam:
      "ബന്ധിതനും, കെട്ടപ്പെട്ടവനും, ഊർജ്ജ-ഹീനനും ആയ ഓരോ (ഇടപ്പെടൽ) വിടുവിക്കൂ. {maleTargetName} -ൽ ഒളിഞ്ഞിരിക്കുന്ന തടസ്സം പോകട്ടെ, ഇച്ഛ-ശക്തിയും ദ്വന്ദ്വ-ശേഷിയും ഉണർന്ന് ചലിക്കട്ടെ.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. UYKU BAĞLAMA (SLEEP BINDING)
  // Source: PDF Page 80
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "uyku",
    label: "Uyku Bağlama",
    arabic: "ربط النوم",
    malayalamLabel: "ഉറക്കം",
    icon: "☽",
    description: "Sleep Binding",
    nameFields: ["targetMale"],
    source: "PDF Page 80",
    purposeArabic:
      "اعْقِدُوا النَّوْمَ عَنْ {maleTargetName} وَأَخْرِجُوا مِنْ أَجْفَانِهِ وَأَزِيلُوا مِنْ دِمَاغِهِ وَأَخْرِجُوا مِنْ جِسْمِهِ رُوحَانِيَّةَ النَّوْمِ وَسَلِّطُوا عَلَيْهِ السَّهَرَ وَالْقَلَقَ وَحَدِيثَ النَّفْسِ وَالسُّوءَ",
    purposeMalayalam:
      "{maleTargetName} -ന്റെ ഉറക്കം കെട്ടൂ. കണ്ണിൽ നിന്ന് ഉറക്കം പോകട്ടെ, തലച്ചോറിൽ നിന്ന് ഇറങ്ങിപ്പോകട്ടെ, ഉടലിൽ നിന്ന് ഉറക്കത്തിന്റെ ആത്മശക്തി പോകട്ടെ. ഉറക്കമില്ലായ്മ, ആശങ്ക, ദുർ-ചിന്ത എന്നിവ അവന്റെ മേൽ ആകർഷിക്കൂ.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. HASTALANDIRMA (ILLNESS)
  // Source: PDF Page 80
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "hastalandirma",
    label: "Hastalandırma",
    arabic: "التمريض",
    malayalamLabel: "രോഗം വരുത്തൽ",
    icon: "⚕",
    description: "Illness",
    nameFields: ["targetMale"],
    source: "PDF Page 80",
    purposeArabic:
      "هَيِّجُوا وَسَطَ الصَّدَاعِ الْمُسْتَكِنَّ فِي {maleTargetName}",
    purposeMalayalam:
      "{maleTargetName} -ൽ ഒളിഞ്ഞിരിക്കുന്ന ഉള്ളിലെ തലവേദനയെ ഉദ്ദീപിക്കൂ, ജ്വലിപ്പിക്കൂ.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. ERKEKLİK BAĞLAMA (MALE BINDING)
  // Source: PDF Page 80
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "erkeklik",
    label: "Erkeklik Bağlama",
    arabic: "ربط الرجولة",
    malayalamLabel: "പുരുഷശക്തി തടയൽ",
    icon: "⚡",
    description: "Male Binding",
    nameFields: ["targetMale", "targetFemale"],
    source: "PDF Page 80",
    purposeArabic:
      "اقْطَعُوا شَهْوَةَ {maleTargetName} عَنْ {femaleTargetName} وَاعْقِدُوا فَرْجَهُ حَتَّى لاَ يَسْتَطِيعَ حَرَكَةَ الْجِمَاعِ",
    purposeMalayalam:
      "{maleTargetName} -ന്റെ ഇച്ഛ-ശക്തി {femaleTargetName} -ൽ നിന്ന് അകലട്ടെ. അവന്റെ (ആ ഭാഗം) കെട്ടൂ — ദ്വന്ദ്വ-ചലനം ഇനിമേൽ ആകരുത്.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. GENERAL PURPOSE — PDF SOURCE INCOMPLETE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "general",
    label: "General Purpose",
    arabic: "قسم عام",
    malayalamLabel: "പൊതുവായ ആവശ്യം",
    icon: "◎",
    description: "General Purpose",
    nameFields: ["requesterName", "targetMale"],
    source: "PDF SOURCE INCOMPLETE",
    purposeArabic: "",
    purposeMalayalam: "",
    status: "pending",
  },
];