// ── KASAM DATABASE (Section 4 only) ──────────────────────────────────────────
// SOURCE AUTHORITY: PDF manuscripts only — "Bastların Usulü Vefklerin Sırrı ve Havassı"
// NO AI-generated text. NO web content. NO reconstructed text.
// If PDF source is incomplete: mark entry as pdf_incomplete.
// Malayalam translations preserve Arabic exactly — translation only below Arabic.
// Arabic text is the primary source. Malayalam never alters it.
// ─────────────────────────────────────────────────────────────────────────────

// ── COMMON KASAM — Universal base layer (Azimet Bağlamak) ────────────────────
// Source: Page 78 — "Azimet Bağlamak" section.
// This is the universal binding structure read BEFORE every purpose-specific Kasam.
// Placeholders:
//   [ESMAİ-AVAN]   → Esma-i A'van names (each prefixed يَا)
//   [ESMAİ-KASEM]  → Esma-i Kasem names (each prefixed بِحَقِّ)
// NOTE: [ESMAİ-AVAN] placeholder has NO leading يَا — formatAvanNames() adds يَا to each.
// ─────────────────────────────────────────────────────────────────────────────
export const COMMON_KASAM = {
  id: "common",
  label: "Common Kasam — Azimet Bağlamak",
  arabic: "القسم المشترك — كيفية ربط العزيمة",
  malayalamLabel: "പൊതു ഖസം — അസീമത്ത് ബന്ധന ക്രമം",
  icon: "◉",
  source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 78 (Azimet Bağlamak)",

  // ── ACTUAL ARABIC AZIMET TEXT (PDF Page 78 — base layer, read before every category Kasam) ──
  arabicText:
    "أَقْسَمْتُ عَلَيْكُمْ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ [ESMAİ-AVAN] [ESMAİ-KASEM] بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ اللهِ الْعَزِيزِ الْحَكِيمِ الَّذِي يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",

  arabicTextMalayalam:
    "ഹേ ആദരണീയ ആത്മീയ ആത്മാക്കളേ, ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു — 'യാ [Esma-i A\'van]', 'ബി ഹഖ്ഖി [Esma-i Kasem]' — ഏകനും, ആരാലും ആശ്രയിക്കപ്പെടുന്നവനും, ഭർത്താവോ മക്കളോ ഇല്ലാത്തവനും, ജനിക്കാത്തവനും, ജനിപ്പിക്കപ്പെടാത്തവനും, ആർക്കും തുല്യനില്ലാത്തവനുമായ (അല്ലാഹുവിന്റെ) പേരിൽ — എന്റെ ആവശ്യം നടപ്പാക്കൂ, എന്റെ പ്രാർത്ഥന ഉത്തരം ചെയ്യൂ. ആകാശ-ഭൂമിയിലുള്ളതെല്ലാം അവന് തസ്ബീഹ് ചൊല്ലുന്ന, അസീസ്-ഹകീം ആയ അല്ലാഹുവിന്റെ സഹായത്തോടെ. സകല കാര്യങ്ങളുടെ ആധിപത്യം അവൻ്റെ കൈകളിൽ — അവങ്കലേക്ക് നിങ്ങൾ മടക്കിഅയക്കപ്പെടും.",

  usageNote:
    "ശൈഖ് തംതം സമൂർ ഹിന്ദി (റഹ്) വചനപ്രകാരം: Esma-i A\'van-ന്റെ മുൻപ് 'يا' (Yâ), Esma-i Kasem-ന്റെ മുൻപ് 'بحق' (Bi hakki) ചേർത്ത് ഓതണം. Esma-i Kitabet ഉൾപ്പെടുത്തരുത്.",
};

export const KASAM_CATEGORIES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. MUHABBET (LOVE) AZİMETİ
  // Source: PDF Pages 76–77
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "muhabbet",
    label: "Muhabbet Kasam",
    arabic: "قسم المحبة",
    malayalamLabel: "സ്നേഹം / പ്രണയം",
    icon: "❤",
    description: "Love & Affection",
    nameFields: ["targetMale", "targetFemale"],
    entries: [
      {
        id: "muhabbet_1",
        // PDF Page 76 — first part of Muhabbet Azimeti
        // This is read AFTER the Common Kasam as part of the purpose-specific section.
        arabic:
          "أَقْسَمْتُ عَلَيْكُمْ أَيُّهَاالأَرْوَاحِ يُحِبُّونَهُمْ كَحُبِّ اللهِ وَالَّذِينَ آمَنُوا اَشَدُّحُبًّا لله اَنتَ الْمُعَمِّمَاتُ الْقُلُوبَ لِلْمَحَبَّةِ يَا جَمرَغَبْ وَيَاأَمْخَعَهُ وَيَاعَقْفَزَكَ وَيَاحَغْبَجَمَ وَيَارَغْبَامْ وَيَا جَعْجَمَرْ",
        malayalam:
          "ഹേ ആത്മാക്കളേ, ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു — അവർ അല്ലാഹുവിനെ സ്നേഹിക്കുന്നതുപോലെ (ഇവരെ) സ്നേഹിക്കുക. സത്യവിശ്വാസികൾ അല്ലാഹുവിനോട് ഏറ്റവും ശക്തമായ സ്നേഹം ഉള്ളവരാണ്. നീ ഹൃദയങ്ങളെ സ്നേഹത്തിൽ ആഴ്ത്തുന്നവനാണ്. ഓ ജംറഗബ്, ഓ അംഖഅഹ്, ഓ അഖ്ഫസക്, ഓ ഹഗ്ബജം, ഓ റഗ്ബാം, ഓ ജഅ്ജമർ.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 76 (Muhabbet Azimeti — first part)",
        notes:
          "PDF-ൽ ഈ ഭാഗം Esma-i A'van, Esma-i Kasem-നോടൊപ്പം Common Kasam-ന് ശേഷം ഓതണം. Esma-i Kitabet ഇതിൽ ഉൾപ്പെടുത്തരുത്.",
        status: "verified",
      },
      {
        id: "muhabbet_2",
        // PDF Page 77 — continuation of Muhabbet Azimeti
        // Names: طُوبَى بِنْتِ حَسِيبَةَ = {femaleTargetName}, أَنَسْ ابْنِ نَاظِلِي = {maleTargetName}
        // CORRECTED: الْوَاحَا × 3, الْعَجَلَ × 3, السَّاعَةَ × 3 per PDF page 77
        arabic:
          "وَمُسَحَّرُ قَلْبُ {femaleTargetName} عَلَى مَحَبَّةِ وَالْعِشْقِ {maleTargetName} بِحَقِّ اَسْمَاءِكُمُ الطَّاهِرَةِ وَبُخُورِكُمُ الْمُقَدَّسَةِ وَاَخْلاَقِكُمُ الشَّرِيفَةِ اِسْرَعُوا بِجَلْبِ الْقُلُوبِ مِنْ طَرْفَةِ الْعَيْنِ أَيُّهَا الأَرْوَاحُ الطَّاهِرَةُ الْمُطَهَّرَةُ الْمُبَارَكَةِ اِسْرَعُوا الْوَاحَا الْوَاحَا الْوَاحَا الْعَجَلَ الْعَجَلَ الْعَجَلَ السَّاعَةَ السَّاعَةَ السَّاعَةَ بِحَقِّ زَكَجَعْ وَبِحَقِّ بَفَعَحْ وَبِحَقِّ فَتَعَبْ وَبِحَقِّ مَشَعَا وَبِحَقِّ صَظَرَكَ أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ اللهِ الْعَزِيزِ الْحَكِيمِ الَّذِي يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",
        malayalam:
          "{femaleTargetName} എന്ന സ്ത്രീയുടെ ഹൃദയം, {maleTargetName} -യോടുള്ള സ്നേഹത്തിലും ആഗ്രഹത്തിലും മോഹിപ്പിക്കപ്പെട്ടിരിക്കുന്നു. നിങ്ങളുടെ പരിശുദ്ധ നാമങ്ങളും, ആദരണീയ ഗുണഗണങ്ങളും, പൂജ്യ ധൂപങ്ങളും കൊണ്ട് ഹൃദയങ്ങളെ നിമിഷനേരം കൊണ്ട് ആകർഷിക്കൂ. ഹേ പരിശുദ്ധ, ബറകത്തുള്ള ആത്മാക്കളേ — ഉടൻ! ഉടൻ! ഉടൻ! ഇപ്പോൾ! ഇപ്പോൾ! ഇപ്പോൾ! ഈ നിമിഷം! ഈ നിമിഷം! ഈ നിമിഷം! — സകജഈ, ബഫഈഹ്, ഫതഈബ്, മശഈ, സ്വതർക്ക് എന്നിവ കൊണ്ടുള്ള സത്യം. ഏകനും, ഒന്നാകുന്നവനും, ആരാലും ആശ്രയിക്കപ്പെടുന്നവനും, ഭർത്താവില്ലാത്തവനും, മക്കളില്ലാത്തവനും, ജനിക്കാത്തവനും, ജനിപ്പിക്കപ്പെടാത്തവനുമായ അള്ളാഹുവിന്റെ പേരിൽ ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു — എന്റെ ആവശ്യം നിറവേറ്റൂ. അസീസ്, ഹകീം ആയ അള്ളാഹുവിന്റെ സഹായത്തോടെ — ആകാശത്തിലും ഭൂമിയിലുമുള്ളവ ഒക്കെ അവനെ തസ്ബീഹ് ചൊല്ലുന്നു. അവൻ്റെ കൈകളിൽ സകല കാര്യങ്ങളുടെ ആധിപത്യമുണ്ട്, അവങ്കലേക്ക് തന്നെ നിങ്ങൾ മടക്കിഅയക്കപ്പെടും.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 77 (Muhabbet Azimeti — continuation)",
        notes:
          "CORRECTED per PDF page 77: الْوَاحَا × 3, الْعَجَلَ × 3, السَّاعَةَ × 3. PDF example names replaced with {femaleTargetName} / {maleTargetName} placeholders.",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HERKES TARAFINDAN SEVİLME (LOVED BY ALL) AZİMETİ
  // Source: PDF Page 79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "herkessevilme",
    label: "Herkes Tarafından Sevilme Kasam",
    arabic: "قسم المحبة العامة",
    malayalamLabel: "എല്ലാവരുടെയും സ്നേഹവും സ്വീകാര്യതയും",
    icon: "☀",
    description: "Loved by All Creation",
    nameFields: ["requesterName"],
    entries: [
      {
        id: "herkessevilme_1",
        arabic:
          "سَبِّتْ سَبِّتْ رُوحَانِيَّةَ الْمَحَبَّةِ وَالْمَوَدَّةِ وَالأُلْفَةِ بِجَمِيعِ الْخَلاَئِقِ وَامْتَزَاجِ فِيهِ رُوحَانِيَّةَ الْمَحَبَّةِ فِي قُلُوبِ بَنِي آدَمَ وَبَنَاتِ حَوَّا حُرِّهِمْ وَعَبْدِهِمْ وَسَائِرِ الْخَلْقِ اَجْمَعِينَ",
        malayalam:
          "മഹബ്ബത്ത്, മവദ്ദത്ത്, ഉൽഫത്ത് എന്നിവയുടെ റൂഹാനിയ്യത്ത് (ആത്മശക്തി) സകല സൃഷ്ടികളുടെ ഇടയിൽ ഉറപ്പിക്കൂ, ഉറപ്പിക്കൂ. ആദം സന്തതികളുടെയും ഹവ്വാ പുത്രീ-പുത്രന്മാരുടെയും — അടിമകളുടെയും സ്വതന്ത്രരുടെയും — ഹൃദയങ്ങളിൽ സ്നേഹത്തിന്റെ ആത്മശക്തി ലയിപ്പിക്കൂ. ഇതര സൃഷ്ടികൾ എല്ലാവർക്കും ഇതുതന്നെ ചെയ്യൂ.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 79 (Herkes Tarafından Sevilme Azimeti)",
        notes: "ഈ അസീമത്ത് ഓതിക്കഴിഞ്ഞ് Esma-i A'van, Esma-i Kasem ഇസ്മുകളും ചേർത്ത് ഓതണം.",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ADAVET (SEPARATION / ENMITY) AZİMETİ
  // Source: PDF Pages 78–79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "adavet",
    label: "Adavet Kasam",
    arabic: "قسم العداوة",
    malayalamLabel: "ശത്രുത / വേർപാട്",
    icon: "⚔",
    description: "Separation & Enmity",
    nameFields: ["targetMale"],
    entries: [
      {
        id: "adavet_1",
        // PDF Page 78 — Adavet Azimeti first part
        // "يَا. كَذَا كَذَا." = Yâ nidâ placeholder for Esma-i A'van names
        // Rendered as [ESMAİ-AVAN] token per Section 4 injection rules
        arabic:
          "أَقْسَمْتُ عَلَيْكُمْ أَيُّهَا الأَرْوَاحُ أَنتَ مُصَرِّفَةُ الْقُلُوبِ الْعَدَاوَةَ بَيْنَ وَبَيْنَ {maleTargetName} لاَ تَجْتَمِعَانِ [ESMAİ-AVAN] هَيِّجُوا رُوحَانِيَّةَ الشَّرِّ وَالْخُصُومَةَ وَالْبَغْضَاءَ فَرِّقُوا بَيْنَ وَبَيْنَ {maleTargetName} لاَ تَجْتَمِعَانِ وَلاَ يَتَحَابَّانِ وَلاَ يَتَّفِقَانِ وَلاَ يَسْمَعُ أَحَدًا هُمَا كَلاَمَ الآخَرِ وَيَكُونَانِ كَالذِّئْبِ وَالْفَحِّ وَالْهِرَّةِ وَالْفَأْرَةِ",
        malayalam:
          "ഹേ ആത്മാക്കളേ, ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു — നിങ്ങൾ ഹൃദയങ്ങളിൽ ശത്രുത ഊതിവീർപ്പിക്കുന്നവരാണ്. {maleTargetName} — ഇവർ ഒരുമിക്കരുത്. (Yâ — Esma-i A'van ഇവിടെ ഓതണം) — ദോഷം, ശത്രുത, വൈരം എന്നിവയുടെ ആത്മശക്തി ജ്വലിപ്പിക്കൂ. {maleTargetName} ഇടയിൽ വേർതിരിവ് ഉണ്ടാക്കൂ. അവർ ഒരിക്കലും ഒന്നിക്കരുത്, പ്രണയിക്കരുത്, യോജിക്കരുത്. ഒരാൾ മറ്റൊരാളുടെ വാക്ക് കേൾക്കരുത്. അവർ ചെന്നായ-പൂച്ച, പൂച്ച-എലി എന്ന പോലെ ആകട്ടെ.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 78 (Adavet Azimeti — first part)",
        notes:
          "PDF-ൽ 'يَا. كَذَا كَذَا.' = Esma-i A'van ഓതേണ്ട സ്ഥാനം. [ESMAİ-AVAN] token ഇവിടെ inject ചെയ്യും.",
        status: "verified",
      },
      {
        id: "adavet_2",
        // PDF Page 79 — Adavet continuation
        // CORRECTED: الْوَاحَا × 3, الْعَجَلَ × 3, السَّاعَةَ × 3 per PDF page 79
        // "بِحَقِّ كَذَا اَوْ كَذَا" = Esma-i Kasem placeholder → [ESMAİ-KASEM]
        arabic:
          "بِحَقِّ اَسْمَاءِكُمُ الطَّاهِرَةِ وَبُخُورِكُمُ الْمُقَدَّسَةِ وَاَخْلاَقِكُمُ الشَّرِيفَةِ اِسْرَعُوا بِالْعَدَاوَةِ الْوَاحَا الْوَاحَا الْوَاحَا الْعَجَلَ الْعَجَلَ الْعَجَلَ السَّاعَةَ السَّاعَةَ السَّاعَةَ [ESMAİ-KASEM] أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحُ الرُّوحَانِيَّةُ الْمُشَرَّفَةُ بِالْوَاحِدِ الأَحَدِ الْفَرْدِ الصَّمَدِ الَّذِي لَمْ يَتَّخِذْ صَاحِبَةً وَلاَ وَلَدًا لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ إِلاَّ مَا أَسْرَعْتُمْ فِي قَضَاءِ حَاجَتِي وَإِجَابَةِ دَعْوَتِي بِعَوْنِ الْعَزِيزِ الْحَكِيمِ يُسَبِّحُ لَهُ مَا فِي السَّمَوَاتِ وَالأَرْضِ أَجْمَعِينَ وَمَا ذَلِكَ بِعَزِيزٍ وَمَادَلَّكَ بِعَزِيزٍ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",
        malayalam:
          "നിങ്ങളുടെ പരിശുദ്ധ നാമങ്ങൾ, ആദരണീയ ഗുണഗണങ്ങൾ, പൂജ്യ ധൂപങ്ങൾ എന്നിവ കൊണ്ടുള്ള സത്യം — ഉടൻ ഉടൻ ഉടൻ ശത്രുത ഉണ്ടാക്കൂ! ഇപ്പോൾ! ഇപ്പോൾ! ഇപ്പോൾ! ഈ നിമിഷം! ഈ നിമിഷം! ഈ നിമിഷം! — (Esma-i Kasem) കൊണ്ടുള്ള സത്യം. ഏകനും, ആരാലും ആശ്രയിക്കപ്പെടുന്നവനും, ഭർത്താവോ മക്കളോ ഇല്ലാത്തവനും, ജനിക്കാത്തവനും, ജനിപ്പിക്കപ്പെടാത്തവനുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ — എന്റെ ആവശ്യം നടപ്പാക്കൂ. ആകാശ-ഭൂമിയിലുള്ളതെല്ലാം അവന് തസ്ബീഹ് ചൊല്ലുന്നു. സകലകാര്യങ്ങളുടെ ആധിപത്യം അവൻ്റെ കൈകളിൽ — അവങ്കലേക്ക് നിങ്ങൾ മടക്കിഅയക്കപ്പെടും.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 79 (Adavet Azimeti — continuation)",
        notes:
          "CORRECTED per PDF page 79: الْوَاحَا × 3, الْعَجَلَ × 3, السَّاعَةَ × 3. 'بِحَقِّ كَذَا اَوْ كَذَا' = Esma-i Kasem injection point → [ESMAİ-KASEM].",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CELB (ATTRACTION) AZİMETİ
  // Source: PDF — text not visible in provided screenshots
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "celb",
    label: "Celb Kasam",
    arabic: "قسم الجلب",
    malayalamLabel: "ആകർഷണം / വരുത്തൽ",
    icon: "✦",
    description: "Attraction",
    nameFields: ["targetMale"],
    entries: [
      {
        id: "celb_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Celb Azimeti text not visible in uploaded pages. Awaiting verified manuscript page.",
        notes: "",
        status: "pending",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SİHİR BOZMA (BREAKING MAGIC) AZİMETİ
  // Source: PDF Page 79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sihir",
    label: "Sihir Bozma Kasam",
    arabic: "قسم كسر السحر",
    malayalamLabel: "സിഹിർ നീക്കം",
    icon: "🔒",
    description: "Breaking Magic",
    nameFields: ["targetMale"],
    entries: [
      {
        id: "sihir_1",
        arabic:
          "أَطْلِقُوا رُوحَانِيَّةَ السِّحْرِ النَّافِذَةَ عَنْ {maleTargetName} وَحَلُّوا عُقْدَةً وَارْهَبُوا كَمَا يُطْفِئُ النَّارَ",
        malayalam:
          "{maleTargetName} -ൽ നിന്ന് ഊർജ്ജമുള്ള ആ സിഹ്ർ (ജാദൂ) ന്റെ ആത്മശക്തി വിടുവിക്കൂ, കെട്ട് അഴിക്കൂ, തീ കെടുക്കുന്നതുപോലെ (ഈ ജാദൂ) ഇല്ലാതാക്കൂ.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 79 (Sihir Bozma Azimeti)",
        notes: "ഈ ഭാഗം ഓതിക്കഴിഞ്ഞ് 'dersin' (ഇങ്ങനെ ഓതുക) എന്ന് ഗ്രന്ഥം നിർദ്ദേശിക്കുന്നു.",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. BAĞLIYI ÇÖZME (REMOVING BINDINGS) AZİMETİ
  // Source: PDF Page 79
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "bagli",
    label: "Bağlı Çözme Kasam",
    arabic: "قسم حل الربط",
    malayalamLabel: "ബന്ധന മോചനം",
    icon: "🔗",
    description: "Removing Bindings",
    nameFields: ["targetMale"],
    entries: [
      {
        id: "bagli_1",
        arabic:
          "اَطْلِقُوا كُلَّ مَأْمُورٍ وَمَقْصُورٍ وَمَلْسُوعٍ وَمَبْرُودٍ وَاَسْأَلُكَ اَنْ يَخْرُجَ الْفَعَّادَ الْمُسْتَكَنَ عَنْ {maleTargetName} وَيَتَحَرَّكَ الشَّهْوَةُ وَالنِّكَاحُ",
        malayalam:
          "ബന്ധിതനും, കെട്ടപ്പെട്ടവനും, ശക്തിഹീനനും, ഊർജ്ജം നഷ്ടപ്പെട്ടവനും ആയ ഓരോ (ഇടപ്പെടൽ) വിടുവിക്കൂ. {maleTargetName} -ൽ നിന്ന് ഒളിച്ചിരിക്കുന്ന ഫഹ്ദ്/ഇഫ്ഫ (ഊർജ്ജ-തടസ്സം) പുറത്ത് പോകട്ടെ, ഇച്ഛ-ശക്തിയും ദ്വന്ദ്വ-ശേഷിയും ഉണർന്ന് ചലിക്കട്ടെ.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 79 (Bağlıyı Çözme Azimeti)",
        notes: "ഈ ഭാഗം ഓതിക്കഴിഞ്ഞ് 'dersin' (ഇങ്ങനെ ഓതുക) എന്ന് ഗ്രന്ഥം നിർദ്ദേശിക്കുന്നു.",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. UYKU BAĞLAMA (SLEEP) AZİMETİ
  // Source: PDF Page 80
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "uyku",
    label: "Uyku Kasam",
    arabic: "قسم النوم",
    malayalamLabel: "ഉറക്കം",
    icon: "☽",
    description: "Sleep Binding",
    nameFields: ["targetMale"],
    entries: [
      {
        id: "uyku_1",
        arabic:
          "أَعْقِدُ التَّوْمَ {maleTargetName} وَأَخْرِجْ مِنْ أَجْفَانِهِ وَدَلَّ مِنْ دِمَاغِهِ وَأَخْرِجْ مِنْ جِسْمِهِ رُوحَانِيَّةَ التَّوْمِ وَسَلِّطْ عَلَيْهِ النَّهْرَ وَالْفَلَقَ وَحَدِيثَ النَّقْنَ وَالسُّوءَ",
        malayalam:
          "{maleTargetName} -ന്റെ ഉറക്കം കെട്ടിപ്പൂട്ടുക. അവന്റെ കണ്ണിൽ നിന്ന് (ഉറക്കം) പോകട്ടെ, തലച്ചോറിൽ നിന്ന് ഇറങ്ങിപ്പോകട്ടെ, ശരീരത്തിൽ നിന്ന് ഉറക്കത്തിന്റെ ആത്മശക്തി ഇറങ്ങിപ്പോകട്ടെ. അവന്റെ മേൽ ഒഴുക്കും, ഫലഖ് (പ്രഭാതം)ഉം, ദുഃസ്വപ്നങ്ങളും, ദോഷ ചിന്തകളും ആകർഷിക്കൂ.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 80 (Uyku Bağlama Azimeti)",
        notes:
          "ഓതിക്കഴിഞ്ഞ് 'dersin' (ഇങ്ങനെ ഓതുക) എന്ന് ഗ്രന്ഥം നിർദ്ദേശിക്കുന്നു. ഈ ആമൽ ചെയ്യാൻ Celb, Tard, Sıhhat, Sakam മിസാൻ ഉപയോഗിക്കണം.",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. HASTALANDIRMA (ILLNESS) AZİMETİ
  // Source: PDF Page 80
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "hastalandirma",
    label: "Hastalandırma Kasam",
    arabic: "قسم التمريض",
    malayalamLabel: "രോഗാവസ്ഥ വരുത്തൽ",
    icon: "⚕",
    description: "Illness",
    nameFields: ["targetMale"],
    entries: [
      {
        id: "hastalandirma_1",
        arabic: "هَيِّجُوا وَسَطَ الصَّدَاعِ الْمُسْتَكِنْ",
        malayalam:
          "ഒളിഞ്ഞിരിക്കുന്ന/ഉള്ളിൽ ഉള്ള തലവേദനയെ (ഊർജ്ജ-ശക്തിയെ) ഉദ്ദീപിക്കൂ, ജ്വലിപ്പിക്കൂ.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 80 (Hastalandırma Azimeti)",
        notes:
          "ഓതിക്കഴിഞ്ഞ് 'dersin' (ഇങ്ങനെ ഓതുക) എന്ന് ഗ്രന്ഥം നിർദ്ദേശിക്കുന്നു.",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. ERKEKLİK BAĞLAMA (MALE BINDING) AZİMETİ
  // Source: PDF Page 80
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "erkeklik",
    label: "Erkeklik Bağlama Kasam",
    arabic: "قسم ربط الرجولة",
    malayalamLabel: "പുരുഷശക്തി തടയൽ",
    icon: "⚡",
    description: "Male Binding",
    nameFields: ["targetMale", "targetFemale"],
    entries: [
      {
        id: "erkeklik_1",
        arabic:
          "اِقْطَعُوا شَهْوَةَ {maleTargetName} أَمْرَحُورٍ وَجَانِبِ الْحَرَكَةِ وَالأَنْعَامِ عَنْ {femaleTargetName} وَاعْقِدْ فَرْجَهُ حَتَّى لاَ يُطِيقَهُ حَرَكَةَ الْجِمَاعِ",
        malayalam:
          "{maleTargetName} -ന്റെ ഇച്ഛ-ശക്തി മുറിക്കൂ — അംർഹൂർ ഊർജ്ജ-ചലനം {femaleTargetName} -ൽ നിന്ന് അകലട്ടെ. അവന്റെ (ആ ഭാഗം) കെട്ടൂ, ദ്വന്ദ്വ-ചലനം ഇനിമേൽ ആകരുത്.",
        source: "Bastların Usulü Vefklerin Sırrı ve Havassı — Page 80 (Erkeklik Bağlama Azimeti)",
        notes:
          "ഓതിക്കഴിഞ്ഞ് 'dersin' (ഇങ്ങനെ ഓതുക) എന്ന് ഗ്രന്ഥം നിർദ്ദേശിക്കുന്നു. PDF ഉദ്ദേശ്യ നാമ ഉദാഹരണങ്ങൾ {maleTargetName} / {femaleTargetName} placeholder-കൾ ആക്കി മാറ്റിയിരിക്കുന്നു.",
        status: "verified",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. GENERAL PURPOSE KASAM
  // Source: PDF — text not visible in provided screenshots
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "general",
    label: "General Purpose Kasam",
    arabic: "قسم عام",
    malayalamLabel: "പൊതുവായ ആവശ്യങ്ങൾ",
    icon: "◎",
    description: "General Purpose",
    nameFields: ["requesterName", "targetMale"],
    entries: [
      {
        id: "general_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — General Kasam text not specified in uploaded pages. Awaiting verified manuscript page.",
        notes: "",
        status: "pending",
      },
    ],
  },
];