import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Scroll, Shield, Search, Filter, Info } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  gold:         "#F5D060",
  goldDim:      "rgba(245,208,96,0.55)",
  goldFaint:    "rgba(245,208,96,0.08)",
  goldBorder:   "rgba(212,175,55,0.35)",
  goldBorderHi: "rgba(212,175,55,0.65)",
  glow:         "rgba(212,175,55,0.15)",
  bg:           "rgba(3,6,20,0.99)",
  bgCard:       "rgba(8,16,40,0.97)",
  bgInner:      "rgba(212,175,55,0.05)",
  text:         "rgba(255,255,255,0.90)",
  textDim:      "rgba(255,255,255,0.50)",
  green:        "#4ADE80",
  yellow:       "#FBBF24",
  red:          "#F87171",
};

// ── ARABIC TYPOGRAPHY ────────────────────────────────────────────────────────
const ARABIC_STYLE = {
  fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', serif",
  fontSize:   "1.35rem",
  lineHeight: 2.6,
  letterSpacing: "0.02em",
  wordSpacing:   "0.1em",
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
};

// ── KASAM LIBRARY DATA (Reference Only - Independent from Section 4) ────────
const KASAM_LIBRARY = [
  {
    id: 1,
    name: "Azimetlerin Kasemi",
    arabicTitle: "أزيمتلرن قسم",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "663–668",
    category: "Common Kasam (Master Universal)",
    verificationStatus: "HIGH",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ اعزمُ عَلَيْكُمْ يَامَعَاشَرَ الجَانْ قُلْ أُوحِيَ إِلَيَّ أَنَّهُ اسْتَمَعَ نَفَرٌ مِنَ الْجِنِّ فَقَالُوا إِنَّا سَمِعْنَا قُرْآنًا عَجَبًا يَهْدِي إِلَى الرُّشْدِ فَآمَنَّا بِهِ وَلَنْ نُشْرِكَ بِرَبِّنَا أَحَدًا... وَأَنَّهُ تَعَالَى جَدُّ رَبِّنَا مَا اتَّخَذَ صَاحِبَةً وَلَا وَلَدًا وَأَنَّهُ لَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ... أَقْسَمْتُ عَلَيْكُمْ بِالْعُهُودِ وَمِمَّا كُتِبَ فِي آيَاتِ السُّوَرِ وَمَا خَلَقَ اللَّهُ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ وَمَا بَيْنَهُمَا مِنَ الْأَنْوَارِ... يَا مَعاشَرَ الجِنِّ بِحَقِّ هَذِهِ الْأَسْمَاءِ الشَّرِيفَةِ احْضُرُوا بِإِذْنِ اللَّهِ تَعَالَى...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — ഹേ ജിന്നുകളുടെ സമൂഹമേ! നിങ്ങളോട് ഞാൻ ആജ്ഞാപിക്കുന്നു: 'എനിക്കൊരു വിഭാഗം ജിന്നുകൾ ഖുർആൻ ശ്രദ്ധയോടെ കേട്ടു, അവർ പറഞ്ഞു: ഞങ്ങൾ അത്ഭുതകരമായ ഒരു ഖുർആൻ കേട്ടു — അത് നേർവഴിയിലേക്ക് നയിക്കുന്നു, ഞങ്ങൾ അതിൽ വിശ്വസിച്ചു, ഞങ്ങളുടെ രക്ഷിതാവിനോട് ഞങ്ങൾ ഒന്നിനെയും പങ്കുചേർക്കില്ല...' അവൻ മഹാനാണ് — ഞങ്ങളുടെ രക്ഷിതാവ് ഭാര്യയെയോ മക്കളെയോ സ്വീകരിച്ചിട്ടില്ല, അവന് തുല്യനായി ആരുമില്ല... ഞാൻ നിങ്ങളോട് ആണയിടുന്നു — ഉടമ്പടികളാണ, സൂറത്തുകളിലെ ആയത്തുകളിൽ എഴുതപ്പെട്ടതാണ്, അല്ലാഹു സൃഷ്ടിച്ച രാവും പകലും സൂര്യനും ചന്ദ്രനും അവയ്ക്കിടയിലുള്ള പ്രകാശങ്ങളും കൊണ്ട്... ഹേ ജിന്നുകളുടെ സമൂഹമേ! ഈ പവിത്ര നാമങ്ങളാണ സത്യം — അല്ലാഹുവിന്റെ അനുമതിയോടെ ഹാജരാകൂ!",
    purpose: "Universal — All operations, spirit summoning, Jinn king invocation",
    usage: "Read 1 time day + 1 time night for general use. Read 7 times for summoning Jinn kings. Burn fragrant incense during recitation.",
    notes: "Master universal Kasam invoking all seven Jinn kings by weekday domains. Same structural framework as Common Kasam.",
  },
  {
    id: 2,
    name: "İdmarul Amme Kasemi",
    arabicTitle: "إدمارُ الأَمَّةِ قَسَمِ",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "668–669",
    category: "Independent Kasam (Written Form)",
    verificationStatus: "LOW",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ أَهْنِي رَصْرَطٍ كَقَامَشٍ رَادَلٍ لِمُقْفَنْجِيلٍ فَكَاجَنْ يَافَارِسْ... وَأَنْتَ يَا فُلَانُ (حَادِمُ الْيَوْمِ) وَافْعَلُوا كَذَا وَكَذَا...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — അഹ്നീ റസ്വ്വരത്വ് കഖാമശ് റാദലിൻ ലിമുഖ്ഫൻജീൽ ഫകാജൻ യാഫാരിസ്... നീയും ഹേ ഫുലാൻ (ഇന്നത്തെ ദിവസത്തിന്റെ ഖാദിം) — ഇപ്രകാരം ചെയ്യൂ!",
    purpose: "Universal written Kasam — healing, sihir removal, Celb, Tefrik, binding",
    usage: "Write on paper with saffron ink. Place under Vefk diagram. Do not recite — written form only.",
    notes: "Written Kasam, not recited. Used with Vefk diagram. OCR extraction has letter ambiguities — requires visual verification.",
  },
  {
    id: 3,
    name: "Zecr Kasemi",
    arabicTitle: "زَجْرُ قَسَمِ",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "669–670",
    category: "Purpose-Specific (Banishment)",
    verificationStatus: "HIGH",
    arabicText: "يَا يَفْمُوشٍ أَيَلَغْمُوشٍ أَوْغَامُوشٍ مَرْغَامُوشٍ مُوشٍ مُوشٍ... جَلَّ الْجَلِيلُ صَاحِبُ الِاسْمِ الْكَبِيرِ... نَارٌ مُحْرِقَةٌ بِكُمْ يَا عُمَّارَ هَذَا الْمَكَانِ...",
    malayalamMeaning: "ഏ യഫ്മൂശ്! ഏ യല്ഗ്മൂശ്! ഏ ഔഗാമൂശ്! ഏ മർഗാമൂശ്! മൂശ് മൂശ്... മഹാനാണ് ജലീൽ — മഹാനാമത്തിന്റെ ഉടമ... നിങ്ങളുടെ മേൽ ദഹിപ്പിക്കുന്ന തീ വീഴട്ടെ — ഹേ ഈ സ്ഥലത്തെ അധിവസിപ്പിക്കുന്നവരേ!",
    purpose: "Banishment/Expulsion of Jinn from place",
    usage: "Recite facing the location. Use with burning incense. Speak with authority. 7× minimum, 41× for stubborn cases.",
    notes: "Clear text extraction. Standard Zecr formula structure. Good confidence in accuracy.",
  },
  {
    id: 4,
    name: "Erciye Da'veti",
    arabicTitle: "أَرجِيَه دَاوَتِي",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "670–671",
    category: "Azimet (Rizık/Kabul)",
    verificationStatus: "MEDIUM",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ أَرْجٍ أَرْجَجٍ هَيُوجٍ هَيْلَجٍ هَيْلُوجٍ... يَا مَعْشَرَ الْأَرْوَاحِ الرُّوحَانِيَّةِ أَكْسُونِي... اقْسَمْتُ بِهِ عَلَيْكُمْ وَإِنَّهُ لَقَسَمٌ لَوْ تَعْلَمُونَ عَظِيمٌ...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — അർജിൻ അർജജ് ഹയൂജ് ഹെയ്ലജ് ഹെയ്ലൂജ്... ഹേ റൂഹാനി ആത്മാക്കളുടെ സമൂഹമേ! എന്നെ ധനവാനാക്കൂ... ഞാൻ അതിനാൽ നിങ്ങളോട് ആണയിടുന്നു — അറിയാമായിരുന്നെങ്കിൽ അത് മഹത്തായ ആണയാണ്!",
    purpose: "Rizık (livelihood), kalb tesiri (heart influence), kabul (acceptance)",
    usage: "Recite after Fajr prayer. Face Qibla. Recite for 7 consecutive days, 41× daily.",
    notes: "Spirit name vowels need visual confirmation. Overall structure clear.",
  },
  {
    id: 5,
    name: "Salsala Da'veti",
    arabicTitle: "صَلْصَلَه دَاوَتِ",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "671–673",
    category: "Azimet (Treasure/Earth Opening)",
    verificationStatus: "MEDIUM",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ أَجِيبُوا وَاحْضُرُوا يَا زَوْبَعَةُ الرِّيَاحِ... يَا سَلْسَلُ يَا فَرْدُ يَا قَاهِرُ...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — ഉത്തരം നൽകൂ, ഹാജരാകൂ ഹേ കാറ്റുകളുടെ ചുഴലിക്കാറ്റേ! ഹേ സൽസൽ! ഏ ഫർദ്! ഏ ഖാഹിർ!",
    purpose: "Define çıkartma (treasure finding), şakkul ard (earth opening)",
    usage: "Recite at treasure location. Use specific incense. Perform on designated planetary hour. 7× at location.",
    notes: "Partial extraction warning. Full 3-page text requires visual verification for completeness.",
  },
  {
    id: 6,
    name: "Ankemuşiyye Kasemi",
    arabicTitle: "أَنكَمُوشِيَّه قَسَمِ",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "673–674",
    category: "Independent Kasam (Name-List)",
    verificationStatus: "LOW",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ بِسَعْنَكَمُوشٍ عَنْكَمُوشٍ طَحَسِيطَخٍ...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — ബിസഅ്നകമൂശ്, അൻകമൂശ്, തഹസീത്വഖ്...",
    purpose: "General invocation — long spirit name list",
    usage: "Recite for general spirit summoning. 3× standard.",
    notes: "Urgent visual verification required. Obscure spirit names with multiple letter ambiguities. Text extraction incomplete.",
  },
  {
    id: 7,
    name: "Sebaseb Da'veti",
    arabicTitle: "سَبَاسَب دَاوَتِي",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "674",
    category: "Azimet (Healing/Şifa)",
    verificationStatus: "MEDIUM",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ بِسْمِ اللَّهِ احْتَجَبَتْ عَنِ الْأَبْصَارِ... لِلشِّفَاءِ مِنَ الْجِنِّ وَالسِّحْرِ وَالنَّظَرِ...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — അല്ലാഹുവിന്റെ നാമം ദൃഷ്ടികളിൽ നിന്ന് മറഞ്ഞുനിന്നു... ജിന്ന്, സിഹ്റ്, നസർ എന്നിവയിൽ നിന്നുള്ള രോഗശാന്തിക്കായി...",
    purpose: "Şifa (healing) — Jinn possession, sihir, nazar",
    usage: "Recite over patient. Can write and dissolve in water for drinking. 7× over patient.",
    notes: "Partial text warning. Full Kasam may extend to page 675.",
  },
  {
    id: 8,
    name: "Hadim Kasem",
    arabicTitle: "(Unnamed)",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "681–682",
    category: "Purpose-Specific (Hadim Summons)",
    verificationStatus: "HIGH",
    arabicText: "بِشَمَاخٍ شَمَاخٍ أَشْمَخٍ أَشْمَخٍ شَامِخٍ شَامِخٍ عَلَى كُلِّ بَرَاخٍ... أَقْسَمْتُ عَلَيْكَ أَيُّهَا الْعَوْنُ الْمُعِينُ بِعِزَّةِ شَمْلَخٍ... وَإِنَّهُ لَقَسَمٌ لَوْ تَعْلَمُونَ عَظِيمٌ...",
    malayalamMeaning: "ബിശ്മാഖ് ശ്മാഖ് അശ്മഖ് അശ്മഖ് ശാമിഖ് ശാമിഖ് എല്ലാ ബറാഖിലും... ഞാൻ നിന്നോട് ആണയിടുന്നു ഹേ സഹായിക്കുന്ന സഹായമേ! ശംലഖിന്റെ മഹത്വം കൊണ്ട്... അറിയാമായിരുന്നെങ്കിൽ അത് മഹത്തായ ആണയാണ്!",
    purpose: "Hadim summons — general assistant spirit",
    usage: "Recite for hadim assistance in any operation. 7× standard.",
    notes: "Good confidence. Clear repetition structure. Standard Hadim formula.",
  },
  {
    id: 9,
    name: "Mendeli Zati Kasem",
    arabicTitle: "(Unnamed)",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "686",
    category: "Azimet (Mirror Scrying)",
    verificationStatus: "HIGH",
    arabicText: "شَلْشٍ شَلْشٍ شَلُوشٍ شَلُوشٍ شَهْيُوشٍ شَهْيُوشٍ شَامُوشٍ...",
    malayalamMeaning: "ശൽശ് ശൽശ് ശലൂശ് ശലൂശ് ശഹയൂശ് ശഹയൂശ് ശാമൂശ്...",
    purpose: "Mirror seeing (Mendeli) — revealing hidden knowledge",
    usage: "Recite while gazing into mirror. Use in dark room with candle. 21× while gazing.",
    notes: "Good confidence. Clear Mendeli formula structure.",
  },
  {
    id: 10,
    name: "Cin Da'veti Kasem",
    arabicTitle: "(Unnamed)",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "693–694",
    category: "Azimet (Water-Bowl Scrying)",
    verificationStatus: "MEDIUM",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ أَقْسَمْتُ عَلَيْكُمْ يَامَيَطَطَرُونَ بِحَقِّ آيَةٍ بِقِطْرِيَالٍ... عَزَمْتُ عَلَيْكُمْ يَا حُدَّامَ هَذِهِ الْأَسْمَاءِ احْضِرُوا...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — ഞാൻ നിങ്ങളോട് ആണയിടുന്നു ഹേ മയത്വത്വരൂനേ! ബിഹഖ്ഖി ആയത്തിൻ ബിഖ്ത്വരിയാൽ... ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു ഹേ ഈ നാമങ്ങളുടെ ഖുദ്ദാമേ! ഹാജരാകൂ!",
    purpose: "General Cin summoning with water-bowl (Mendeli Mâi)",
    usage: "Recite over water bowl. Gaze into water for visions. 7× over bowl.",
    notes: "Spirit name requires visual confirmation. Standard Cin Da'veti structure.",
  },
  {
    id: 11,
    name: "Final Da'vet Kasem",
    arabicTitle: "(Multiple)",
    sourcePdf: "8511a42f5_...661-702.pdf",
    sourcePage: "697–702",
    category: "Azimet (Scrying/Vision)",
    verificationStatus: "LOW",
    arabicText: "لَهْرُوشٍ لَهْرُوشٍ هَرُوشٍ هَرُوشٍ هَيْفَنٍ هَيْفَنٍ... عَزَمْتُ عَلَيْكُمْ يَا جَمَاعَةَ الْجِنِّ وَالْجُنُونِ بِحَقِّ حَقِّ اللَّهِ... بِحَقِّ كَفَ هَا يَا عَيْنَ صَادَ...",
    malayalamMeaning: "ലഹ്റൂശ് ലഹ്റൂശ് ഹറൂശ് ഹറൂശ് ഹെയ്ഫൻ ഹെയ്ഫൻ... ഞാൻ നിങ്ങളോട് ആജ്ഞാപിക്കുന്നു ഹേ ജിന്നുകളുടെയും ഭ്രാന്തന്മാരുടെയും സമൂഹമേ! അല്ലാഹുവിന്റെ ഹഖ്ഖ് കൊണ്ട്... ബിഹഖ്ഖി കഫ ഹാ യാ ഐൻ സാദ്!",
    purpose: "Scrying / Cin vision",
    usage: "Multiple variants for different vision types. Use with appropriate tools (mirror, water, smoke). 7× to 41×.",
    notes: "Urgent visual verification required. 6-page span with multiple variants. Extraction incomplete.",
  },
  {
    id: 12,
    name: "Esma-i Berhetiyye Kasemi",
    arabicTitle: "أسماء البرهتية قسم",
    sourcePdf: "d1ca167f4_...421-480.pdf",
    sourcePage: "435–436",
    category: "Common Kasam (Variant)",
    verificationStatus: "MEDIUM",
    arabicText: "بَرْهَتِيه ٢ كَرِيرٍ ٢ تَتْلِيه ٢ طُورَان ٢ مَزْجَلٍ ٢ بِزْجَلٍ ٢... أَللَّهُمَّ بِحَقِّ كَهْكَهِيجِنْ يَغْتَشِيِّ بِلِتْشَغْشَغْوِيلِنْ... سُبْحَانَ مَنْ لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ",
    malayalamMeaning: "ബർഹതീയ 2, കരീർ 2, തത്ലീയ 2, തൂറാൻ 2, മസ്ജൽ 2, ബിസ്ജൽ 2... ഹേ അല്ലാഹു! കഹ്കഹീജൻ യഗ്തശീ ബിലിത്ശഗ്ശഗ്വീലൻ്റെ ഹഖ്ഖ് കൊണ്ട്... തന്നോട് സദൃശനായ ഒന്നുമില്ലാത്തവൻ പരിശുദ്ധൻ — അവൻ സർവ്വം കേൾക്കുന്നവൻ, സർവ്വം കാണുന്നവൻ!",
    purpose: "Universal — all 28 Berhetiyye names as oath names",
    usage: "Recite as base Kasam for any operation. Each name invoked twice. 1× standard, 7× enhanced.",
    notes: "28-name list requires complete visual verification. Closing blessing confirmed.",
  },
  {
    id: 13,
    name: "İmam Tusi Berhetiyye Kasemi",
    arabicTitle: "(İmam Tusi r.a.)",
    sourcePdf: "d1ca167f4_...421-480.pdf",
    sourcePage: "436–439",
    category: "Common Kasam (Master Variant)",
    verificationStatus: "HIGH",
    arabicText: "بِسْمِ اللهِ الْمَلِكِ الْمُحِيطِ الدَّائِمِ الْقَدِيمُ الَّذِى مَلَأَ سَاطِعُ نُورِ وَجْهِه الْأَكْوَانِ... أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الأَرْوَاحِ الرُّوحَانِيَّةِ الْعُلْوِيَّةِ وَالسُّفْلِيَّةِ وَخُدَّامَ هَذَا الْعَهْدِ الْكَبِيرِ تُجِيبُوا دَعْوَتِي وَتَقَضُّوا حَاجَتِي وَتَتَوَكَّلُوا بِكَذَا وَكَذَا...",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — രാജാവ്, സർവ്വവും ചുറ്റിനിൽക്കുന്നവൻ, നിത്യൻ, പഴമയുള്ളവൻ — അവന്റെ മുഖത്തിന്റെ പ്രകാശം പ്രപഞ്ചങ്ങളെ നിറച്ചുനിൽക്കുന്നു... ഞാൻ നിങ്ങളോട് ആണയിടുന്നു ഹേ ഉയർന്നതും താഴ്ന്നതുമായ റൂഹാനി ആത്മാക്കളേ! ഈ മഹത്തായ ഉടമ്പടിയുടെ ഖുദ്ദാമേ! എന്റെ വിളിക്ക് ഉത്തരം നൽകൂ, എന്റെ ആവശ്യം നിറവേറ്റൂ, ഇപ്രകാരം പ്രവർത്തിക്കൂ!",
    purpose: "Universal — Master Kasam with full 28 names + BEDUH + closing",
    usage: "Use as primary Common Kasam for all operations. Full recitation required. 1× standard, 7× enhanced.",
    notes: "CRITICAL: Opening phrase matches current Section 4 COMMON_KASAM.opening exactly. Structural source.",
  },
  {
    id: 14,
    name: "Cemaleddin el Kirvani Kasemi",
    arabicTitle: "(Cemaleddin el Kirvani r.a.)",
    sourcePdf: "d1ca167f4_...421-480.pdf",
    sourcePage: "441–445",
    category: "Common Kasam (Variant)",
    verificationStatus: "MEDIUM",
    arabicText: "بِسْمِ اللهِ الْمُحِيطِ الْقَدِيمُ الْأَزَلِيُّ الَّذِى جَمَعَ بِنُـــورِ وَجْهِـــه الْأَكْوَانِ... أَقْسَمْتُ عَلَيْكُمُ أَيُّهَا الْمَلَائِكَةِ الْعُلْوِيَّةِ وَالأَرْوَاحِ الرُّوحَانِيَّةِ بِمَا جَمَعَ فِي بَحْرِ الأَسْمَاءِ مِنَ الأَنْـــوَارِ تَرْمِي بِسُهُبِ النَّارِ عَلَى كُلِّ مَنْ عَصَى دَاعِيَ الْمَلِكِ الْجَبَّارِ... اِنْ كَانَتْ اِلاَّ صَيْحَةً وَاحِدَةً فَإِذَاهُمْ جَمِيعٌ لَدَيْنَا مُحْضَرُونَ",
    malayalamMeaning: "അല്ലാഹുവിന്റെ നാമത്തിൽ — സർവ്വവും ചുറ്റിനിൽക്കുന്നവൻ, പഴമയുള്ളവൻ, ആദിയുള്ളവൻ — അവന്റെ മുഖത്തിന്റെ പ്രകാശം പ്രപഞ്ചങ്ങളെ ഒന്നിച്ചുചേർത്തു... ഞാൻ നിങ്ങളോട് ആണയിടുന്നു ഹേ ഉയർന്ന മാലാഖമാരേ! റൂഹാനി ആത്മാക്കളേ! നാമങ്ങളുടെ സമുദ്രത്തിൽ ശേഖരിക്കപ്പെട്ട പ്രകാശങ്ങൾ കൊണ്ട് — രാജാവിന്റെ വിളി ലംഘിക്കുന്ന ഓരോരുത്തരുടെ മേലും അഗ്നിബാണങ്ങൾ എറിയപ്പെടുന്നു... അതൊരു ഒറ്റ നിലവിളി മാത്രമായിരുന്നു — ഉടൻ തന്നെ അവരെല്ലാം നമ്മുടെ മുമ്പാകെ ഹാജരാക്കപ്പെട്ടു!",
    purpose: "Universal — expanded variant with angels + ruhani spirits",
    usage: "Recite for operations requiring angelic assistance alongside Jinn. 1× standard, 3× enhanced.",
    notes: "Angel invocation confirmed. Full text requires visual verification across 5 pages.",
  },
  {
    id: 15,
    name: "Ebi Abdullah el Fasi Poetic Kasemi",
    arabicTitle: "(Poetic form)",
    sourcePdf: "d1ca167f4_...421-480.pdf",
    sourcePage: "445–451",
    category: "Poetic Variant",
    verificationStatus: "MEDIUM",
    arabicText: "بَدَأْتُ بِبِسْمِ اللهِ لِلرُّوحِ هَادِيَاً — إِلَى كَشْفِ أَسْرَارٍ ارْتَعَلَتْ فِيهِ خَافِيَاً... وَإِنْ شِئْتَ تَهْيِجَن وَعَطَفًا مَحَبَّةً — وَإِنْ شِئْتَ تَجْلِبَ رِزْقًا أَوْ مَعَالِي فِي الْمَلَا — وَإِنْ شِئْتَ تَحُلَّ كُلَّ نَعْلٍ تَرْتَجِيهِ — وَإِنْ شِئْتَ تَفُكَّ كُلَّ مَحْكُومٍ بِسِجْنٍ...",
    malayalamMeaning: "ഞാൻ ആരംഭിക്കുന്നു ബിസ്മില്ലാഹി കൊണ്ട് — ആത്മാവിന് നേർവഴി കാട്ടുന്നവനായി... രഹസ്യങ്ങൾ വെളിപ്പെടുത്താൻ — അതിൽ മറഞ്ഞിരിക്കുന്നവയെ... നീ ആഗ്രഹിക്കുന്നുവെങ്കിൽ സ്നേഹവും ആകർഷണവും ഉണർത്താം — നീ ആഗ്രഹിക്കുന്നുവെങ്കിൽ റിസ്ഖ് കൊണ്ടുവരാം അല്ലെങ്കിൽ ഉന്നത പദവികൾ — നീ ആഗ്രഹിക്കുന്നുവെങ്കിൽ ഓരോ ബന്ധനവും അഴിക്കാം — നീ ആഗ്രഹിക്കുന്നുവെങ്കിൽ തടവിലാക്കപ്പെട്ട ഓരോരുത്തരെയും മോചിപ്പിക്കാം...",
    purpose: "Poetic Kasam — explicitly lists Muhabbet, Celb, Rizık, Bağlı categories",
    usage: "Recite as confirmation of purpose categories. Not a working Kasam — reference only. 1× reference.",
    notes: "Poetic structure helps verification. Full poem requires visual confirmation. Purpose categories explicitly named.",
  },
  {
    id: 16,
    name: "Üstaz el Kişni Kasemi",
    arabicTitle: "(Üstaz el Kişni r.a.)",
    sourcePdf: "d1ca167f4_...421-480.pdf",
    sourcePage: "451–453",
    category: "Common Kasam (Variant)",
    verificationStatus: "MEDIUM",
    arabicText: "(28 Berhetiyye names × 2) + بِعِزَّتِكَ اِلاَّ مَا أَخَذْتَ سَمْعَهُمْ وَأَبْصَارِهِمْ... أَقْسَمْتُ عَلَيْكُمُ وَأَدُوكُمُ مَعَاشِرَ الأَرْوَاحِ الرُّوحَانِيَّةِ بِالإِسْمِ الَّذِي تَكَلَّمَ بِهِ مَلِكُ الأَرْوَاحِ فَتَسَاقَطَتْ مِنْهُ رُؤُوسُ الْمَلاَئِكَةِ الرُّوحَانِيَّةِ وَالْكَرُوبِيِّينَ... بَاكِرًا كَـرُّوكِ آلٍ قُـدُّوسٌ عَلَى قَوِيٌّ عَزِيزٌ",
    malayalamMeaning: "(28 Berhetiyye പേരുകൾ × 2) + നിന്റെ മഹത്വം കൊണ്ട് — നീ അവരുടെ കേൾവിയും കാഴ്ചയും എടുത്തല്ലോ... ഞാൻ നിങ്ങളോട് ആണയിടുന്നു ഹേ റൂഹാനി ആത്മാക്കളുടെ സമൂഹമേ! ആത്മാക്കളുടെ രാജാവ് സംസാരിച്ച നാമം കൊണ്ട് — അതിൽ നിന്ന് റൂഹാനി മാലാഖമാരുടെയും കെരൂബികളുടെയും തലകൾ ഉരുണ്ടുവീണു... ബാകിറാൻ കർറൂകി ആൽ കുദ്ദൂസുൻ അലാ ഖവിയ്യുൻ അസീസ്",
    purpose: "Universal — strongest Berhetiyye variant with extended oath",
    usage: "Use for difficult operations requiring maximum spiritual authority. 1× standard, 3× difficult operations.",
    notes: "Extended oath confirmed. Full 28-name list requires visual verification.",
  },
  {
    id: 17,
    name: "Celb Azimet (Purpose #8)",
    arabicTitle: "(Celb Azimet)",
    sourcePdf: "d1ca167f4_...421-480.pdf",
    sourcePage: "457",
    category: "Purpose-Specific Azimet (Celb)",
    verificationStatus: "HIGH",
    arabicText: "أَهْطَمْفَشَزْ بَدُوحْ بَدُوحْ لَهَزِنْ طَحِنْ أَطَحِنْ أَسْلَحِنْ سَلَيْلَحِنْ تَوَكَّلُوا يَا خُدَّامَ هَذِهِ الأَسْمَاءِ وَأَنْتَ يَا أَحْمَرُ بِتَهْيِيجِ فُلاَنٍ ابْنِ فُلاَنَةَ بِمَحَبَّةِ وَعِشْقِ فُلاَنَةَ بِنْتِ فُلاَنَةَ",
    malayalamMeaning: "അഹ്ത്വമ്ഫശസ് ബദൂഹ് ബദൂഹ് ലഹ്സിൻ ത്വഹിൻ അത്വഹിൻ അസ്ലഹിൻ സലൈലഹിൻ — ഈ നാമങ്ങളുടെ ഖുദ്ദാമേ! നിങ്ങൾ പ്രവർത്തിക്കൂ! ഹേ അഹ്മർ! ഫുലാൻ ഇബ്നു ഫുലാനയെ ഉണർത്തൂ — ഫുലാന ബിൻത് ഫുലാനയോടുള്ള സ്നേഹത്തിലും പ്രണയത്തിലും!",
    purpose: "Celb — attraction with love",
    usage: "Recite with name tokens injected. Use during Venus hour for maximum effect. 7× minimum, 41× strong operations.",
    notes: "CRITICAL: Name token pattern {maleTargetName}/{femaleTargetName} confirmed. FILLS missing Celb category.",
  },
  {
    id: 18,
    name: "Sarfı Ummar",
    arabicTitle: "صَرْفُ عُمّار",
    sourcePdf: "d1ca167f4_...421-480.pdf",
    sourcePage: "479–480",
    category: "Dismissal Formula (Sarf)",
    verificationStatus: "MEDIUM",
    arabicText: "أَقْشَامَقْشِنْ مِهْرَاقِشِنْ أَقْشَمَقْشِنْ شَقْمُونَهْشِنْ نَادِيَ الْعَالِي الْأَعْلَى... سُبْحَانَ مَنْ لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ",
    malayalamMeaning: "അഖ്ശാമഖ്ശിൻ മിഹ്റാഖ്ശിൻ അഖ്ശമഖ്ശിൻ ശഖ്മൂനഹ്ശിൻ — ഉന്നതനും അത്യുന്നതനുമായവൻ വിളിക്കുന്നു... തന്നോട് സദൃശനായ ഒന്നുമില്ലാത്തവൻ പരിശുദ്ധൻ — അവൻ സർവ്വം കേൾക്കുന്നവൻ, സർവ്വം കാണുന്നവൻ!",
    purpose: "Dismissal of summoned spirits after operations",
    usage: "Recite AFTER completing operation. Face away from operation space. 1× dismissal.",
    notes: "Dismissal formula confirmed. Full text requires visual verification. Currently absent from Section 4.",
  },
];

// ── VERIFICATION BADGE ───────────────────────────────────────────────────────
function VerificationBadge({ status }) {
  const colors = {
    HIGH:   { bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.45)", text: G.green },
    MEDIUM: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.45)", text: G.yellow },
    LOW:    { bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.45)", text: G.red },
  };
  const c = colors[status] || colors.MEDIUM;
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
      style={{ background: c.bg, borderColor: c.border }}>
      <Shield className="w-3 h-3" style={{ color: c.text }} />
      <span className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: c.text }}>
        {status}
      </span>
    </div>
  );
}

// ── KASAM CARD ───────────────────────────────────────────────────────────────
function KasamCard({ kasam, isExpanded, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: kasam.id * 0.03 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: G.bgCard,
        borderColor: G.goldBorder,
        boxShadow: `0 2px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}>

      {/* Card Header */}
      <div className="px-5 py-4 border-b cursor-pointer"
        style={{ borderColor: G.goldBorder + "55", background: G.bgInner }}
        onClick={onToggle}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-inter text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                style={{ background: G.goldFaint, color: G.goldDim, border: `1px solid ${G.goldBorder}` }}>
                #{kasam.id}
              </span>
              <VerificationBadge status={kasam.verificationStatus} />
            </div>
            <h3 className="font-inter text-base font-bold mb-1" style={{ color: G.gold }}>
              {kasam.name}
            </h3>
            <p className="font-amiri text-lg mb-2" dir="rtl" style={{ ...ARABIC_STYLE, color: G.goldDim }}>
              {kasam.arabicTitle}
            </p>
            <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.textDim }}>
              {kasam.category}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-inter text-[8px] uppercase tracking-wider mb-1" style={{ color: G.textDim }}>
              Source
            </p>
            <p className="font-inter text-[9px] font-bold" style={{ color: G.gold }}>
              p. {kasam.sourcePage}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 py-5 space-y-5">

          {/* Arabic Text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scroll className="w-4 h-4" style={{ color: G.goldDim }} />
              <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: G.goldDim }}>
                Arabic Text
              </span>
            </div>
            <div className="rounded-xl border p-4"
              style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
              <p className="text-right leading-relaxed" dir="rtl" style={ARABIC_STYLE}>
                {kasam.arabicText}
              </p>
            </div>
          </div>

          {/* Malayalam Meaning */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4" style={{ color: G.goldDim }} />
              <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: G.goldDim }}>
                Malayalam Meaning
              </span>
            </div>
            <div className="rounded-xl border p-4"
              style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
              <p className="leading-relaxed" style={{ color: G.text, lineHeight: 2.1, fontSize: "1rem" }}>
                {kasam.malayalamMeaning}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-3"
              style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
              <span className="font-inter text-[7px] uppercase tracking-wider block mb-1.5" style={{ color: G.textDim }}>
                Purpose
              </span>
              <p className="font-inter text-sm" style={{ color: G.text }}>{kasam.purpose}</p>
            </div>
            <div className="rounded-xl border p-3"
              style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
              <span className="font-inter text-[7px] uppercase tracking-wider block mb-1.5" style={{ color: G.textDim }}>
                Usage
              </span>
              <p className="font-inter text-sm" style={{ color: G.text }}>{kasam.usage}</p>
            </div>
          </div>

          {/* Source Info */}
          <div className="rounded-xl border p-3"
            style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
            <span className="font-inter text-[7px] uppercase tracking-wider block mb-1.5" style={{ color: G.textDim }}>
              Source Information
            </span>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-inter" style={{ color: G.text }}>
                PDF: <span style={{ color: G.goldDim }}>{kasam.sourcePdf}</span>
              </span>
              <span className="font-inter" style={{ color: G.text }}>
                Pages: <span style={{ color: G.gold }}>{kasam.sourcePage}</span>
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border p-3"
            style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" style={{ color: G.goldDim }} />
              <span className="font-inter text-[7px] uppercase tracking-wider font-bold" style={{ color: G.goldDim }}>
                Notes
              </span>
            </div>
            <p className="font-inter text-sm" style={{ color: G.textDim }}>{kasam.notes}</p>
          </div>

        </motion.div>
      )}
    </motion.div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function KasamLibrary() {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["ALL", ...new Set(KASAM_LIBRARY.map(k => k.category.split(" ")[0]))];

  const filteredKasams = KASAM_LIBRARY.filter(k => {
    const matchesCategory = filter === "ALL" || k.category.startsWith(filter);
    const matchesSearch = searchQuery === "" ||
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="space-y-6">

        {/* Header */}
        <PageTitle
          arabic="مكتبة الأقسام"
          latin="Kasam Library"
          subtitle="Manuscript Reference Collection — Independent Archive"
          icon="📚"
        />

        {/* Isolation Notice */}
        <div className="rounded-xl border p-4"
          style={{
            background: "rgba(147,197,253,0.06)",
            borderColor: "rgba(147,197,253,0.25)",
          }}>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "rgba(147,197,253,0.85)" }} />
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider font-bold mb-1"
                style={{ color: "rgba(147,197,253,0.85)" }}>
                Reference Library Only — Completely Isolated
              </p>
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                This page is a read-only manuscript archive. It does NOT connect to Section 4, Common Kasam, or any existing module. No assembly logic. No automatic injection. No modifications anywhere in the application.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: G.textDim }} />
            <input
              type="text"
              placeholder="Search Kasams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none"
              style={{
                background: G.bgCard,
                borderColor: G.goldBorder,
                color: G.text,
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="px-3 py-2.5 rounded-xl border text-sm font-inter transition-all"
                style={{
                  background: filter === cat ? G.goldFaint : G.bgCard,
                  borderColor: filter === cat ? G.goldBorderHi : G.goldBorder,
                  color: filter === cat ? G.gold : G.textDim,
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
          style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
          <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.textDim }}>
            Total Kasams
          </span>
          <span className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>
            {filteredKasams.length} / {KASAM_LIBRARY.length}
          </span>
        </div>

        {/* Kasam Cards */}
        <div className="space-y-4">
          {filteredKasams.map(kasam => (
            <KasamCard
              key={kasam.id}
              kasam={kasam}
              isExpanded={expandedId === kasam.id}
              onToggle={() => setExpandedId(expandedId === kasam.id ? null : kasam.id)}
            />
          ))}
        </div>

        {/* Footer Notice */}
        <div className="text-center py-6">
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.textDim }}>
            Manuscript Reference Library — For Manual Review Only
          </p>
          <p className="font-inter text-[7px] mt-1" style={{ color: G.textDim }}>
            No integration with existing Section 4 system
          </p>
        </div>

      </div>
    </PageLayout>
  );
}