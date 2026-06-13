// ── KASAM DATABASE (Section 4 only) ──────────────────────────────────────────
// SOURCE AUTHORITY: PDF manuscripts only — "Bastların Usulü Vefklerin Sırrı ve Havassı"
// NO AI-generated text. NO web content. NO reconstructed text.
// ─────────────────────────────────────────────────────────────────────────────
//
// PDF STRUCTURE — every Kasam is ONE continuous text:
//
//   [Category-specific opening + invocation + name placeholders + Esma-i A'van]
//   [بِحَقِّ أَسْمَاءِكُمُ ... اِسْرَعُوا + urgency phrases × 3]
//   [Esma-i Kasem placeholder]
//   [Closing invocation — الواحد الأحد ... فسبحان]
//
// TOKENS:
//   [ESMAİ-AVAN]         → يَا Name1  يَا Name2  ... (each prefixed يَا)
//   [ESMAİ-KASEM]        → بِحَقِّ Name1  بِحَقِّ Name2  ... (each prefixed بِحَقِّ)
//   {maleTargetName}     → male target full name
//   {femaleTargetName}   → female target full name
//   {requesterName}      → requester full name
//
// CLOSING INVOCATION (shared, appended to short-form "dersin" categories):
//   أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ [ESMAİ-AVAN] [ESMAİ-KASEM]
//   بِالْوَاحِدِ الأَحَدِ ... فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ
//
// ─────────────────────────────────────────────────────────────────────────────

// The shared closing invocation — used by all categories that do not contain it inline.
// Muhabbet and Adavet already have their own full closing embedded.
// Sihir, Bagli, Hastalandirma, Erkeklik, Uyku use this closing after their command phrase.
const CLOSING_INVOCATION =
  "أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ [ESMAİ-AVAN] [ESMAİ-KASEM] بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ اللهِ الْعَزِيزِ الْحَكِيمِ الَّذِي يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ";

const CLOSING_MALAYALAM =
  "ഏകനും, ആരാലും ആശ്രയിക്കപ്പെടുന്നവനും, ഭർത്താവോ മക്കളോ ഇല്ലാത്തവനും, ജനിക്കാത്തവനും, ജനിപ്പിക്കപ്പെടാത്തവനും, ആർക്കും തുല്യനില്ലാത്തവനുമായ അല്ലാഹുവിന്റെ പേരിൽ ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു — എന്റെ ആവശ്യം നടപ്പാക്കൂ, എന്റെ പ്രാർത്ഥന ഉത്തരം ചെയ്യൂ. ആകാശ-ഭൂമിയിലുള്ളതെല്ലാം അവന് തസ്ബീഹ് ചൊല്ലുന്ന, അസീസ്-ഹകീം ആയ അല്ലാഹുവിന്റെ സഹായത്തോടെ. സകല കാര്യങ്ങളുടെ ആധിപത്യം അവൻ്റെ കൈകളിൽ — അവങ്കലേക്ക് നിങ്ങൾ മടക്കിഅയക്കപ്പെടും.";

// Exported for UI reference display (Esma list display panel)
export const COMMON_KASAM = {
  id: "common",
  label: "Esma-i A'van & Esma-i Kasem — Reading Guide",
  arabic: "أسماء الأعوان وأسماء القسم",
  malayalamLabel: "Esma-i A'van, Esma-i Kasem നാമ ദർശനം",
  icon: "◉",
  source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 78",
  usageNote:
    "ശൈഖ് തംതം സമൂർ ഹിന്ദി (റഹ്) വചനപ്രകാരം: Esma-i A'van-ന്റെ മുൻപ് 'يا' (Yâ), Esma-i Kasem-ന്റെ മുൻപ് 'بحق' (Bi hakki) ചേർത്ത് ഓതണം. Esma-i Kitabet ഉൾപ്പെടുത്തരുത്.",
  // The shared Common Kasam closing — PDF Page 78, appears at end of every Azimet
  arabicText: "أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ اللهِ الْعَزِيزِ الْحَكِيمِ الَّذِي يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",
  arabicTextMalayalam: "ഹേ ആദരണീയ ആത്മാക്കളേ, ഏകനും, ആരാലും ആശ്രയിക്കപ്പെടുന്നവനും, ഭർത്താവോ മക്കളോ ഇല്ലാത്തവനും, ജനിക്കാത്തവനും, ജനിപ്പിക്കപ്പെടാത്തവനും, ആർക്കും തുല്യനില്ലാത്തവനുമായ (അല്ലാഹുവിന്റെ) ഇടത്ത് കൊണ്ട് ഞാൻ നിങ്ങളോട് ആണ ചെയ്യുന്നു — എന്റെ ആവശ്യം നടപ്പാക്കൂ, എന്റെ പ്രാർത്ഥന ഉത്തരം ചെയ്യൂ. ആകാശ-ഭൂമിയിലുള്ളതെല്ലാം അവന് തസ്ബീഹ് ചൊല്ലുന്ന, അസീസ്-ഹകീം ആയ അല്ലാഹുവിന്റെ സഹായത്തോടെ. സകല കാര്യങ്ങളുടെ ആധിപത്യം അവൻ്റെ കൈകളിൽ — അവങ്കലേക്ക് നിങ്ങൾ മടക്കിഅയക്കപ്പെടും.",
};

export const KASAM_CATEGORIES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. MUHABBET (LOVE) AZİMETİ
  // Source: PDF Pages 76–77
  // Complete integrated Kasam — contains its own full closing invocation.
  // Structure:
  //   Opening invocation + A'van names (hardcoded in PDF) → name phrase →
  //   بحق أسمائكم ... اسرعوا → urgency × 3 → بحق [5 names] →
  //   أقسمت ... بالواحد الأحد → closing
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "muhabbet",
    label: "Muhabbet Kasam",
    arabic: "قسم المحبة",
    malayalamLabel: "സ്നേഹം / പ്രണയം",
    icon: "❤",
    description: "Love & Affection",
    nameFields: ["targetMale", "targetFemale"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Pages 76–77",
    // fullArabic: ONE continuous Kasam exactly as PDF pages 76–77
    // Esma-i A'van injected at [ESMAİ-AVAN] inside the structure
    // (PDF page 76 shows the 6 hard invocation names يا جمرغب ... يا جعجمر
    //  as the Esma-i A'van for this category — they are rendered directly)
    fullArabic:
      "أَقْسَمْتُ عَلَيْكُمْ أَيُّهَا الأَرْوَاحِ يُحِبُّونَهُمْ كَحُبِّ اللهِ وَالَّذِينَ آمَنُوا اَشَدُّ حُبًّا لِله اَنتَ الْمُعَمِّمَاتُ الْقُلُوبَ لِلْمَحَبَّةِ يَا جَمرَغَبْ وَيَا أَمْخَعَهُ وَيَا عَقْفَزَكَ وَيَا حَغْبَجَمَ وَيَا رَغْبَامْ وَيَا جَعْجَمَرْ وَمُسَحَّرُ قَلْبُ {femaleTargetName} عَلَى مَحَبَّةِ وَالْعِشْقِ {maleTargetName} بِحَقِّ اَسْمَاءِكُمُ الطَّاهِرَةِ وَبُخُورِكُمُ الْمُقَدَّسَةِ وَاَخْلاَقِكُمُ الشَّرِيفَةِ اِسْرَعُوا بِجَلْبِ الْقُلُوبِ مِنْ طَرْفَةِ الْعَيْنِ أَيُّهَا الأَرْوَاحُ الطَّاهِرَةُ الْمُطَهَّرَةُ الْمُبَارَكَةِ اِسْرَعُوا الْوَاحَا الْوَاحَا الْوَاحَا الْعَجَلَ الْعَجَلَ الْعَجَلَ السَّاعَةَ السَّاعَةَ السَّاعَةَ بِحَقِّ زَكَجَعْ وَبِحَقِّ بَفَعَحْ وَبِحَقِّ فَتَعَبْ وَبِحَقِّ مَشَعَا وَبِحَقِّ صَظَرَكَ [ESMAİ-AVAN] [ESMAİ-KASEM] أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ اللهِ الْعَزِيزِ الْحَكِيمِ الَّذِي يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",
    fullMalayalam:
      "ഹേ ആത്മാക്കളേ, ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു — അവർ അല്ലാഹുവിനെ സ്നേഹിക്കുന്നതുപോലെ (ഇവരെ) സ്നേഹിക്കൂ. സത്യവിശ്വാസികൾ അല്ലാഹുവിനോട് ഏറ്റവും ശക്തമായ സ്നേഹം ഉള്ളവരാണ്. നീ ഹൃദയങ്ങളെ സ്നേഹത്തിൽ ആഴ്ത്തുന്നവനാണ്. ഓ ജംറഗബ്, ഓ അംഖഅഹ്, ഓ അഖ്ഫസക്, ഓ ഹഗ്ബജം, ഓ റഗ്ബാം, ഓ ജഅ്ജമർ — {femaleTargetName} -ന്റെ ഹൃദയം {maleTargetName} -യോടുള്ള സ്നേഹത്തിലും ആഗ്രഹത്തിലും മോഹിപ്പിക്കപ്പെട്ടിരിക്കുന്നു. നിങ്ങളുടെ പരിശുദ്ധ നാമങ്ങളും, പൂജ്യ ധൂപങ്ങളും, ആദരണീയ ഗുണഗണങ്ങളും കൊണ്ട് ഹൃദയങ്ങളെ നിമിഷനേരം കൊണ്ട് ആകർഷിക്കൂ. ഹേ പരിശുദ്ധ, ബറകത്തുള്ള ആത്മാക്കളേ — ഉടൻ! ഉടൻ! ഉടൻ! ഇപ്പോൾ! ഇപ്പോൾ! ഇപ്പോൾ! ഈ നിമിഷം! ഈ നിമിഷം! ഈ നിമിഷം! — സകജഈ, ബഫഈഹ്, ഫതഈബ്, മശഈ, സ്വതർക്ക് — Esma-i A'van, Esma-i Kasem — " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HERKES TARAFINDAN SEVİLME (LOVED BY ALL) AZİMETİ
  // Source: PDF Page 79
  // Structure: short command phrase + Common closing
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "herkessevilme",
    label: "Herkes Tarafından Sevilme Kasam",
    arabic: "قسم المحبة العامة",
    malayalamLabel: "എല്ലാവരുടെയും സ്നേഹവും സ്വീകാര്യതയും",
    icon: "☀",
    description: "Loved by All Creation",
    nameFields: ["requesterName"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 79",
    fullArabic:
      "سَبِّتْ سَبِّتْ رُوحَانِيَّةَ الْمَحَبَّةِ وَالْمَوَدَّةِ وَالأُلْفَةِ بِجَمِيعِ الْخَلاَئِقِ وَامْتَزَاجِ فِيهِ رُوحَانِيَّةَ الْمَحَبَّةِ فِي قُلُوبِ بَنِي آدَمَ وَبَنَاتِ حَوَّا حُرِّهِمْ وَعَبْدِهِمْ وَسَائِرِ الْخَلْقِ اَجْمَعِينَ " + CLOSING_INVOCATION,
    fullMalayalam:
      "മഹബ്ബത്ത്, മവദ്ദത്ത്, ഉൽഫത്ത് എന്നിവയുടെ ആത്മശക്തി സകല സൃഷ്ടികളുടെ ഇടയിൽ ഉറപ്പിക്കൂ, ഉറപ്പിക്കൂ. ആദം സന്തതികളുടെയും ഹവ്വാ പുത്രീ-പുത്രന്മാരുടെയും — അടിമകളുടെയും സ്വതന്ത്രരുടെയും — ഹൃദയങ്ങളിൽ സ്നേഹത്തിന്റെ ആത്മശക്തി ലയിപ്പിക്കൂ. ഇതര സൃഷ്ടികൾ എല്ലാവർക്കും ഇതുതന്നെ ചെയ്യൂ. " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ADAVET (SEPARATION / ENMITY) AZİMETİ
  // Source: PDF Pages 78–79
  // Complete integrated Kasam — contains its own full closing invocation.
  // Structure:
  //   Opening + Esma-i A'van position → enmity phrases → name placeholders →
  //   بحق أسمائكم ... اسرعوا بالعداوة → urgency × 3 → Esma-i Kasem →
  //   أقسمت ... بالواحد الأحد → closing
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "adavet",
    label: "Adavet Kasam",
    arabic: "قسم العداوة",
    malayalamLabel: "ശത്രുത / വേർപാട്",
    icon: "⚔",
    description: "Separation & Enmity",
    nameFields: ["targetMale"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Pages 78–79",
    fullArabic:
      "أَقْسَمْتُ عَلَيْكُمْ أَيُّهَا الأَرْوَاحُ أَنتَ مُصَرِّفَةُ الْقُلُوبِ الْعَدَاوَةَ بَيْنَ وَبَيْنَ {maleTargetName} لاَ تَجْتَمِعَانِ [ESMAİ-AVAN] هَيِّجُوا رُوحَانِيَّةَ الشَّرِّ وَالْخُصُومَةَ وَالْبَغْضَاءَ فَرِّقُوا بَيْنَ وَبَيْنَ {maleTargetName} لاَ تَجْتَمِعَانِ وَلاَ يَتَحَابَّانِ وَلاَ يَتَّفِقَانِ وَلاَ يَسْمَعُ أَحَدًا هُمَا كَلاَمَ الآخَرِ وَيَكُونَانِ كَالذِّئْبِ وَالْفَحِّ وَالْهِرَّةِ وَالْفَأْرَةِ بِحَقِّ اَسْمَاءِكُمُ الطَّاهِرَةِ وَبُخُورِكُمُ الْمُقَدَّسَةِ وَاَخْلاَقِكُمُ الشَّرِيفَةِ اِسْرَعُوا بِالْعَدَاوَةِ الْوَاحَا الْوَاحَا الْوَاحَا الْعَجَلَ الْعَجَلَ الْعَجَلَ السَّاعَةَ السَّاعَةَ السَّاعَةَ [ESMAİ-KASEM] أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ الْعَزِيزِ الْحَكِيمِ يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ وَمَا ذَلِكَ بِعَزِيزٍ وَمَا دَلَّكَ بِعَزِيزٍ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",
    fullMalayalam:
      "ഹേ ആത്മാക്കളേ, ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു — നിങ്ങൾ ഹൃദയങ്ങളിൽ ശത്രുത ഊതിവീർപ്പിക്കുന്നവരാണ്. {maleTargetName} — ഇവർ ഒരുമിക്കരുത്. (Esma-i A'van) — ദോഷം, ശത്രുത, വൈരം എന്നിവയുടെ ആത്മശക്തി ജ്വലിപ്പിക്കൂ. {maleTargetName} ഇടയിൽ വേർതിരിവ് ഉണ്ടാക്കൂ. അവർ ഒരിക്കലും ഒന്നിക്കരുത്, പ്രണയിക്കരുത്, യോജിക്കരുത്. ഒരാൾ മറ്റൊരാളുടെ വാക്ക് കേൾക്കരുത്. അവർ ചെന്നായ-നായ, പൂച്ച-എലി എന്ന പോലെ ആകട്ടെ. നിങ്ങളുടെ പരിശുദ്ധ നാമങ്ങൾ, പൂജ്യ ധൂപങ്ങൾ, ആദരണീയ ഗുണഗണങ്ങൾ — ഉടൻ ഉടൻ ഉടൻ ശത്രുത ഉണ്ടാക്കൂ! ഇപ്പോൾ! ഇപ്പോൾ! ഇപ്പോൾ! ഈ നിമിഷം! ഈ നിമിഷം! ഈ നിമിഷം! (Esma-i Kasem) " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CELB (ATTRACTION) AZİMETİ
  // PDF SOURCE INCOMPLETE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "celb",
    label: "Celb Kasam",
    arabic: "قسم الجلب",
    malayalamLabel: "ആകർഷണം / വരുത്തൽ",
    icon: "✦",
    description: "Attraction",
    nameFields: ["targetMale"],
    source: "PDF SOURCE INCOMPLETE — Celb Azimeti text not visible in uploaded pages.",
    fullArabic: "",
    fullMalayalam: "",
    status: "pending",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SİHİR BOZMA (BREAKING MAGIC) AZİMETİ
  // Source: PDF Page 79
  // Structure: command phrase + Common closing (PDF says "dersin" after phrase)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sihir",
    label: "Sihir Bozma Kasam",
    arabic: "قسم كسر السحر",
    malayalamLabel: "സിഹിർ നീക്കം",
    icon: "🔒",
    description: "Breaking Magic",
    nameFields: ["targetMale"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 79",
    fullArabic:
      "اَطْلِقُوا رُوحَانِيَّةَ السِّحْرِ النَّافِذَةَ عَنْ {maleTargetName} وَحَلُّوا عُقْدَةً وَارْهَبُوا كَمَا يُطْفِئُ النَّارَ " + CLOSING_INVOCATION,
    fullMalayalam:
      "{maleTargetName} -ൽ നിന്ന് ഊർജ്ജമുള്ള ആ സിഹ്ർ (ജാദൂ) ന്റെ ആത്മശക്തി വിടുവിക്കൂ, കെട്ട് അഴിക്കൂ, തീ കെടുക്കുന്നതുപോലെ (ഈ ജാദൂ) ഇല്ലാതാക്കൂ. " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. BAĞLIYI ÇÖZME (REMOVING BINDINGS) AZİMETİ
  // Source: PDF Page 79
  // Structure: command phrase + Common closing (PDF says "dersin" after phrase)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "bagli",
    label: "Bağlı Çözme Kasam",
    arabic: "قسم حل الربط",
    malayalamLabel: "ബന്ധന മോചനം",
    icon: "🔗",
    description: "Removing Bindings",
    nameFields: ["targetMale"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 79",
    fullArabic:
      "اَطْلِقُوا كُلَّ مَأْمُورٍ وَمَقْصُورٍ وَمَلْسُوعٍ وَمَبْرُودٍ وَاَسْأَلُكَ اَنْ يَخْرُجَ الْفَعَّادَ الْمُسْتَكَنَ عَنْ {maleTargetName} وَيَتَحَرَّكَ الشَّهْوَةُ وَالنِّكَاحُ " + CLOSING_INVOCATION,
    fullMalayalam:
      "ബന്ധിതനും, കെട്ടപ്പെട്ടവനും, ശക്തിഹീനനും, ഊർജ്ജം നഷ്ടപ്പെട്ടവനും ആയ ഓരോ (ഇടപ്പെടൽ) വിടുവിക്കൂ. {maleTargetName} -ൽ നിന്ന് ഒളിച്ചിരിക്കുന്ന ഊർജ്ജ-തടസ്സം പുറത്ത് പോകട്ടെ, ഇച്ഛ-ശക്തിയും ദ്വന്ദ്വ-ശേഷിയും ഉണർന്ന് ചലിക്കട്ടെ. " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. UYKU BAĞLAMA (SLEEP BINDING) AZİMETİ
  // Source: PDF Page 80
  // Structure: command phrase + Common closing (PDF says "dersin" after phrase)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "uyku",
    label: "Uyku Kasam",
    arabic: "قسم النوم",
    malayalamLabel: "ഉറക്കം",
    icon: "☽",
    description: "Sleep Binding",
    nameFields: ["targetMale"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 80",
    fullArabic:
      "اَعْقِدُ التَّوْمَ {maleTargetName} وَاَخْرِجْ مِنْ اَجْفَانِهِ وَدَلَّ مِنْ دِمَاغِهِ وَاَخْرِجْ مِنْ جِسْمِهِ رُوحَانِيَّةَ التَّوْمِ وَسَلِّطْ عَلَيْهِ النَّهْرَ وَالْفَلَقَ وَحَدِيثَ النَّقْنَ وَالسُّوءَ " + CLOSING_INVOCATION,
    fullMalayalam:
      "{maleTargetName} -ന്റെ ഉറക്കം കെട്ടിപ്പൂട്ടൂ. അവന്റെ കണ്ണിൽ നിന്ന് ഉറക്കം പോകട്ടെ, തലച്ചോറിൽ നിന്ന് ഇറങ്ങിപ്പോകട്ടെ, ശരീരത്തിൽ നിന്ന് ഉറക്കത്തിന്റെ ആത്മശക്തി ഇറങ്ങിപ്പോകട്ടെ. അവന്റെ മേൽ ഒഴുക്കും, ഫലഖ് (പ്രഭാതം)ഉം, ദുഃസ്വപ്നങ്ങളും, ദോഷ ചിന്തകളും ആകർഷിക്കൂ. " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. HASTALANDIRMA (ILLNESS) AZİMETİ
  // Source: PDF Page 80
  // Structure: command phrase + Common closing (PDF says "dersin" after phrase)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "hastalandirma",
    label: "Hastalandırma Kasam",
    arabic: "قسم التمريض",
    malayalamLabel: "രോഗാവസ്ഥ വരുത്തൽ",
    icon: "⚕",
    description: "Illness",
    nameFields: ["targetMale"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 80",
    fullArabic:
      "هَيِّجُوا وَسَطَ الصَّدَاعِ الْمُسْتَكِنْ " + CLOSING_INVOCATION,
    fullMalayalam:
      "ഒളിഞ്ഞിരിക്കുന്ന ഉള്ളിലെ തലവേദനയെ ഉദ്ദീപിക്കൂ, ജ്വലിപ്പിക്കൂ. " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. ERKEKLİK BAĞLAMA (MALE BINDING) AZİMETİ
  // Source: PDF Page 80
  // Structure: command phrase + Common closing (PDF says "dersin" after phrase)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "erkeklik",
    label: "Erkeklik Bağlama Kasam",
    arabic: "قسم ربط الرجولة",
    malayalamLabel: "പുരുഷശക്തി തടയൽ",
    icon: "⚡",
    description: "Male Binding",
    nameFields: ["targetMale", "targetFemale"],
    source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 80",
    fullArabic:
      "اِقْطَعُوا شَهْوَةَ {maleTargetName} أَمْرَحُورٍ وَجَانِبِ الْحَرَكَةِ وَالأَنْعَامِ عَنْ {femaleTargetName} وَاعْقِدْ فَرْجَهُ حَتَّى لاَيُطِيقَهُ حَرَكَةَ الْجِمَاعِ " + CLOSING_INVOCATION,
    fullMalayalam:
      "{maleTargetName} -ന്റെ ഇച്ഛ-ശക്തി മുറിക്കൂ — അംർഹൂർ ഊർജ്ജ-ചലനം {femaleTargetName} -ൽ നിന്ന് അകലട്ടെ. അവന്റെ (ആ ഭാഗം) കെട്ടൂ, ദ്വന്ദ്വ-ചലനം ഇനിമേൽ ആകരുത്. " + CLOSING_MALAYALAM,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. GENERAL PURPOSE KASAM
  // PDF SOURCE INCOMPLETE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "general",
    label: "General Purpose Kasam",
    arabic: "قسم عام",
    malayalamLabel: "പൊതുവായ ആവശ്യങ്ങൾ",
    icon: "◎",
    description: "General Purpose",
    nameFields: ["requesterName", "targetMale"],
    source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page.",
    fullArabic: "",
    fullMalayalam: "",
    status: "pending",
  },
];