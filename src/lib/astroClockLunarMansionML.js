/**
 * LUNAR MANSION MALAYALAM TRANSLATIONS
 * All 28 Mansions with Malayalam translations
 * Source: Havâss'ın Derinlikleri - PDF knowledge base
 * STRICTLY ISOLATED: Astro Clock module only
 */

import { AY_MANAZILLERI } from './astroClockData.js';

export const MANSION_ML_NAMES = {
  "ŞARTEYN": "ഷർതെയ്ൻ", "BUTEYN": "ബുതെയ്ൻ", "SÜREYYA": "സുരയ്യ", "DÜBRAN": "ദുബ്രാൻ",
  "HAK'A": "ഹഖ്അ", "HENA": "ഹനാ", "ZİRA": "സിറാ", "NESRE": "നസ്റ",
  "TARFA": "തർഫ", "CEPHE": "ജബ്ഹ", "ZEBRA": "സുബ്ര", "SURFA": "സുർഫ",
  "AVA": "അവ്വ", "SEMMAK": "സമ്മാഖ്", "GUFUR": "ഗുഫ്ർ", "ZİBANA": "സുബാന",
  "İKLİL": "ഇക്ലീൽ", "KÂLP": "ഖൽബ്", "ŞEVLE": "ഷൗല", "NEAİM": "നയിം",
  "BELDE": "ബൽദ", "SAADÜZZABİH": "സഅദുൽസാബിഹ്", "SAUDBELA": "സഅദുൽബുലാ", "SAADÜSSUUD": "സഅദുൽസുഊദ്",
  "SAADÜLAHBİYYE": "സഅദുൽഅഹ്ബിയ്യ", "FERÜLMUKADDEM": "ഫറുൽമുഖദ്ദം", "FERÜLMÜAHHİR": "ഫറുൽമുഅഖ്ഖർ", "EERREŞA": "അൽറിഷ"
};

export const ZODIAC_ML = {
  "Koç": "മേഷം", "Boğa": "ഇടവം", "İkizler": "മിഥുനം", "Yengeç": "കർക്കിടകം",
  "Arslan": "ചിങ്ങം", "Başak": "കന്നി", "Terazi": "തുലാം", "Akrep": "വൃശ്ചികം",
  "Yay": "ധനു", "Oğlak": "മകരം", "Kova": "കുംഭം", "Balık": "മീനം"
};

export const LUNAR_MANSION_DATA = AY_MANAZILLERI.map(mansion => ({
  number: mansion.no,
  name_en: mansion.name,
  name_ml: MANSION_ML_NAMES[mansion.name] || mansion.name,
  name_arabic: mansion.harfi,
  nature: mansion.genel_hukum === "Uygun (Saad)" ? "Saad" : mansion.genel_hukum === "Uğursuz (Nahs)" ? "Nahs" : "Mixed",
  nature_ml: mansion.genel_hukum === "Uygun (Saad)" ? "ഉത്തമം" : mansion.genel_hukum === "Uğursuz (Nahs)" ? "അനുചിതം" : "മിശ്രം",
  zodiac_sign: mansion.zodiac_sign,
  zodiac_sign_ml: ZODIAC_ML[mansion.zodiac_sign] || mansion.zodiac_sign,
  zodiac_degree: mansion.zodiac_degree,
  operations: mansion.operations,
  operations_ml: mansion.operations.map(op => OPERATIONS_ML[op] || op)
}));

export const OPERATIONS_ML = {
  // Mansion 1 - ŞARTEYN
  "Kan dökmek ve kötü işler yapmaya uygun olduğu söylenir": "രക്തചൊരിച്ചിലിനും മോശം കാര്യങ്ങൾക്കും അനുയോജ്യം",
  "Bu zamanda mecbur olunmayan hiç bir iş yapılmamalıdır": "നിർബന്ധമില്ലാത്ത കാര്യങ്ങൾ ചെയ്യരുത്",
  "Şarteyn manzili fesad, bozgunculuk, insanların aralarında düşmanlık yaratmak gibi etkilere sahiptir": "ഷർതെയ്ൻ നക്ഷത്രം ചതിവും നാശവും മനുഷ്യരിൽ ശത്രുതയും ഉണ്ടാക്കുന്നു",
  "Ay bu menazildeyken insanlar kötü rüyalar, kabuslar görürür": "ഈ നക്ഷത്രത്തിൽ മനുഷ്യർ ദുസ്വപ്നങ്ങൾ കാണുന്നു",
  
  // Mansion 2 - BUTEYN
  "Büyü, Tılsım (Talisman), Vefk gibi şeyler yapmak için uygundur": "മാന്ത്രികത, തകിത, വെഫ്ക് എന്നിവയ്ക്ക് അനുയോജ്യം",
  "Elişleri, Talisman veya vefk gibi şeylerin metal veya başka maddeler üzerine işlenmeleri": "ലോഹങ്ങളിലോ മറ്റ് വസ്തുക്കളിലോ തകിത/വെഫ്ക് കൊത്താൻ അനുയോജ്യം",
  "Kadınlar üzerinde etkili bir zamandır": "സ്ത്രീകളെ സ്വാധീനിക്കാൻ അനുയോജ്യ സമയം",
  "Erkeklerin kadınlarla tanışmaları için ideal zamandır": "പുരുഷന്മാർ സ്ത്രീകളെ പരിചയപ്പെടാൻ അനുയോജ്യം",
  "Kadınların baştan çıkartılmaları için ideal zamandır": "സ്ത്രീകളെ വശീകരിക്കാൻ അനുയോജ്യം",
  "Kadınları elde etmek için yapılacak olan tılsım veya diğer majikal çalışmalar için ideal zamandır": "സ്ത്രീകളെ നേടാൻ മാന്ത്രിക പ്രവർത്തനങ്ങൾക്ക് അനുയോജ്യം",
  "Kadınların iyiliği için yapılacak olan rızk açıklığı çalışmalarına uygundur": "സ്ത്രീകളുടെ നന്മയ്ക്ക് ഐശ്വര്യ പ്രവർത്തനങ്ങൾക്ക് അനുയോജ്യം",
  "Kısmet açıklığı çalışmalarına uygundur": "ഭാഗ്യം തുറക്കാൻ അനുയോജ്യം",
  "Şifâ çalışmalarına uygundur": "രോഗശാന്തി പ്രവർത്തനങ്ങൾക്ക് അനുയോജ്യം",
  
  // Mansion 3 - SÜREYYA
  "Evlilik, Evlenme teklifi gibi işlere uygun bir zamandır": "വിവാഹം, വിവാഹ ആലോചന എന്നിവയ്ക്ക് അനുയോജ്യം",
  "Bu zamanda kadınların yararına olabilecek celbi muhabbet çalışmaları yapılabilir": "സ്ത്രീകൾക്ക് ഗുണകരമായ സ്നേഹ ആകർഷണ പ്രവർത്തനങ്ങൾ ചെയ്യാം",
  "Kadının bir erkeği elde etmesi için uygun zaman": "സ്ത്രീ പുരുഷനെ നേടാൻ അനുയോജ്യ സമയം",
  "İşlerin açılması": "കാര്യങ്ങൾ സാധിക്കാൻ",
  "İşi geliştirmek": "ജോലി വികസിപ്പിക്കാൻ",
  "Ticari kazanç gibi şeyler başarılıdır": "വ്യാപാര ലാഭം വിജയിക്കുന്നു",
  
  // Mansion 4 - DÜBRAN
  "Kin, düşmanlık, ayrılık ve benzeri şeylere uygun bir zamandır": "വൈരം, ശത്രുത, പിരിച്ചുവിടൽ എന്നിവയ്ക്ക് അനുയോജ്യം",
  "Bu zamanda olumlu bir iş için ya da bu zamanın kötülüklerini gidermekle ilgili bir çalışma yapılmamalıdır": "ഈ സമയത്ത് നല്ല കാര്യങ്ങൾക്കോ ദോഷം മാറ്റാനോ ശ്രമിക്കരുത്",
  "Ay Dübran menazilinde iken insanlar sırlarını korumaya ve boşboğazlık etmemeye dikkat etmelidirler": "ഈ നക്ഷത്രത്തിൽ മനുഷ്യർ രഹസ്യങ്ങൾ സൂക്ഷിക്കണം",
  "Toprak, Tarla, mesken gibi işler için iyidir": "ഭൂമി, വസ്തു എന്നിവയ്ക്ക് നല്ലത്",
  "Kişiyi kötü duruma düşürmek için çalışmalar yapılabilir": "ആളുകളെ ദോഷത്തിലാക്കാൻ പ്രവർത്തനങ്ങൾ ചെയ്യാം",
  "Pasifize etmek için çalışmalar yapılabilir": "നിഷ്ക്രിയമാക്കാൻ പ്രവർത്തനങ്ങൾ ചെയ്യാം",
  "Sağlığını bozmak gibi işler için çalışmalar yapılabilir": "ആരോഗ്യം കെടുത്താൻ പ്രവർത്തനങ്ങൾ ചെയ്യാം",
  "Kin ve düşmanlığa sebep olmak için çalışmalar yapılabilir": "വൈരവും ശത്രുതയും ഉണ്ടാക്കാൻ പ്രവർത്തനങ്ങൾ ചെയ്യാം",
  "İnsanları ayırmak için çalışmalar yapılabilir": "മനുഷ്യരെ വേർപെടുത്താൻ പ്രവർത്തനങ്ങൾ ചെയ്യാം",
  "Ortaklık veya evlikleri bozmak gibi işler için çalışmalar yapılabilir": "കൂട്ടുകെട്ടും വിവാഹവും തകർക്കാൻ പ്രവർത്തനങ്ങൾ ചെയ്യാം",
  
  // Mansion 5 - HAK'A
  "Kişiyi eşinden soğutmak": "ആളെ ഭാര്യയിൽ നിന്ന് അകറ്റാൻ",
  "Ayrılık": "വേർപിരിയൽ",
  "Mal ve para açısından zarar vermek": "വസ്തുവകകൾക്കും പണത്തിനും നഷ്ടം വരുത്താൻ",
  "Ortaklıkları ve işi bozmak": "കൂട്ടുകെട്ടും ജോലിയും തകർക്കാൻ",
  "Ticari kayıplar": "വ്യാപാര നഷ്ടങ്ങൾ",
  "Büyük şirketlerin zarar etmesi": "വലിയ കമ്പനികൾക്ക് നഷ്ടം വരുത്താൻ",
  "Gözden düşürmek gibi çalışmalar için uygun bir zaman": "ആളുകളെ താഴ്ത്താൻ അനുയോജ്യ സമയം",
  "Günlük hayatta bozuk gıdalara ve gıda zehirlenmelerine dikkat etmek gereken bir zamandır": "ദൈനംദിന ജീവിതത്തിൽ ചീത്ത ഭക്ഷണത്തെക്കുറിച്ച് ശ്രദ്ധിക്കണം",
  "Bu zamanda yapılan evlilikler hayırlı olmayıp, uzun sürmezler": "ഈ സമയത്ത് നടക്കുന്ന വിവാഹങ്ങൾ നല്ലതല്ല, നീണ്ടുനിൽക്കില്ല",
  "Evlenme teklifleri veya nişanlılıklar sonuca ulaşamazlar": "വിവാഹ ആലോചനകളും നിശ്ചയങ്ങളും വിജയിക്കില്ല",
  "Ay bu menazildeyken sadece Tarla, bahçe, arazi, emlak gibi işler hayırlı sonuç verir": "ഈ നക്ഷത്രത്തിൽ ഭൂമി, വസ്തു എന്നിവ മാത്രം നല്ല ഫലം നൽകുന്നു",
  
  // Mansion 6 - HENA
  "Aşk ve sevgi çalışmalarına uygundur": "പ്രണയവും സ്നേഹവുമായ പ്രവർത്തനങ്ങൾക്ക് അനുയോജ്യം",
  "Dargınlıkların giderilmesi": "പിണക്കം മാറ്റാൻ",
  "Önemli kimselerden istekte bulunmak": "പ്രമുഖരിൽ നിന്ന് ആവശ്യപ്പെടാൻ",
  "Sağlık çalışmalarına uygundur": "ആരോഗ്യ പ്രവർത്തനങ്ങൾക്ക് അനുയോജ്യം",
  "Bir şeye sahip olmak": "എന്തെങ്കിലും നേടാൻ",
  "Mal edinmek": "വസ്തുക്കൾ നേടാൻ",
  "Maddi gelirin artışı gibi çalışmalara uygun bir zamandır": "വരുമാനം വർദ്ധിപ്പിക്കാൻ അനുയോജ്യ സമയം",
  "Günlük hayatta arkadaş toplantıları için hayırlı zamandır": "ദൈനംദിന ജീവിതത്തിൽ സുഹൃത്ത് സമ്മേളനങ്ങൾക്ക് നല്ല സമയം",
  "Dostlarla görüşmek için hayırlı zamandır": "സുഹൃത്തുക്കളെ കാണാൻ നല്ല സമയം",
  "Fikir alışverişleri için hayırlı zamandır": "ആശയവിനിമയത്തിന് നല്ല സമയം",
  "Yeni şeyler satın almak için hayırlı zamandır": "പുതിയ വസ്തുക്കൾ വാങ്ങാൻ നല്ല സമയം",
  "Evlenmek için hayırlı zamandır": "വിവാഹത്തിന് നല്ല സമയം",
  "Nişanlanmak için hayırlı zamandır": "നിശ്ചയത്തിന് നല്ല സമയം",
  
  // Mansion 7 - ZİRA
  "Bilim ve eğitimde başarılı olmak": "ശാസ്ത്രത്തിലും വിദ്യാഭ്യാസത്തിലും വിജയിക്കാൻ",
  "Konuşma, toplantı ve anlaşmalarda başarı": "സംഭാഷണം, യോഗം, കരാറുകൾ എന്നിവയിൽ വിജയം",
  "Mal, emlak veya arazi sahibi olmak": "വസ്തുക്കൾ, റിയൽ എസ്റ്റേറ്റ്, ഭൂമി എന്നിവ നേടാൻ",
  "Önemli konumlardaki kimselerden istekte bulunup, kabul görmek": "പ്രമുഖരിൽ നിന്ന് ആവശ്യപ്പെട്ട് അംഗീകാരം നേടാൻ",
  "Günlük hayatta önemli konumlardaki kimselerden istekte bulunmaya uygun bir zamandır": "ദൈനംദിന ജീവിതത്തിൽ പ്രമുഖരിൽ നിന്ന് ആവശ്യപ്പെടാൻ അനുയോജ്യ സമയം",
  "Hayırlı işler için tılsım veya vefk hazırlamaya uygun bir dönem": "നല്ല കാര്യങ്ങൾക്ക് തകിത/വെഫ്ക് തയ്യാറാക്കാൻ അനുയോജ്യ സമയം",
  
  // Mansion 8 - NESRE
  "Düşmanlık": "ശത്രുത",
  "Kin": "വൈരം",
  "Kahır": "പീഡനം",
  "Kavga ve geçimsizlik": "തർക്കവും അസ്വാരസ്യവും",
  "Bu zamanda ortaklık kurulmamalı": "ഈ സമയത്ത് കൂട്ടുകെട്ട് പാടില്ല",
  "Evlenmemeli": "വിവാഹം പാടില്ല",
  "Nişanlanmamalı": "നിശ്ചയം പാടില്ല",
  "Ev, arazi gibi şeyler almak veya kiralamak iyi sonuç vermez": "വീട്, ഭൂമി എന്നിവ വാങ്ങാനോ വാടകയ്ക്കെടുക്കാനോ നല്ലതല്ല",
  
  // Mansion 9 - TARFA
  "Uğursuzluk": "ദൗർഭാഗ്യം",
  "Mutluluğu bozmak": "സന്തോഷം നശിപ്പിക്കാൻ",
  "Gözden düşürmek": "ആളുകളെ താഴ്ത്താൻ",
  "Dostlukları bozmak": "സൗഹൃദം തകർക്കാൻ",
  "Günlük hayatta böyle bir dönemde iken resmi dairelerle ilgili işler പിന്തുടരരുത്": "ദൈനംദിന ജീവിതത്തിൽ ഔദ്യോഗിക കാര്യങ്ങൾ പിന്തുടരരുത്",
  "Kimseden ricada bulunulmamalı": "ആരിൽ നിന്നും അഭ്യർത്ഥിക്കരുത്",
  
  // Mansion 10 - CEPHE
  "Dostluklar kurmak": "സൗഹൃദങ്ങൾ സ്ഥാപിക്കാൻ",
  "Genel hayranlık ve sosyal ilerleme": "പൊതു ആരാധനയും സാമൂഹിക പുരോഗതിയും",
  "Başarılı olmak": "വിജയിക്കാൻ",
  "Bu zamanda hem iyi hem kötü şeyler yapılabilir": "ഈ സമയത്ത് നല്ലതും ചീത്തയും ചെയ്യാം",
  "Suflî işler yukarda sayılan maddelerin tam tersine çalışmasıdır": "താഴ്ന്ന കാര്യങ്ങൾ മുകളിൽ പറഞ്ഞവയ്ക്ക് വിപരീതമായി പ്രവർത്തിക്കുന്നു",
  
  // Mansion 11 - ZEBRA
  "Hastalıktan kurtulmak": "രോഗത്തിൽ നിന്ന് മുക്തി നേടാൻ",
  "Her şeyden korunmak": "എല്ലാറ്റിൽ നിന്നും സംരക്ഷണം നേടാൻ",
  "Ticaret, alım satım işlerinde kolaylık": "വ്യാപാരത്തിൽ എളുപ്പം",
  "Önemli kimselerden lutuf görmek": "പ്രമുഖരിൽ നിന്ന് അനുഗ്രഹം നേടാൻ",
  "İsteklerini kabul ettirmek": "ആഗ്രഹങ്ങൾ സാധിക്കാൻ",
  "Bütün insanlar tarafından sevilmek gibi çalışmalara uygun zaman": "എല്ലാവരാലും സ്നേഹിക്കപ്പെടാൻ അനുയോജ്യ സമയം",
  
  // Mansion 12 - SURFA
  "Ay bu menazilde iken, her türlü olumsuz iş için uygundur": "ഈ നക്ഷത്രത്തിൽ എല്ലാ തരം നെഗറ്റീവ് ജോലികൾക്കും അനുയോജ്യം",
  "Kahır ve helak çalışmalarına uygun zamandır": "പീഡനത്തിനും നാശത്തിനും അനുയോജ്യ സമയം",
  
  // Mansion 13 - AVA
  "Şehvet duygusunu körüklemek": "കാമവികാരം വർദ്ധിപ്പിക്കാൻ",
  "Bir erkeğin, belli bir kadına karşı dayanılmaz cinsel istekler içinde olması": "പുരുഷന് ഒരു സ്ത്രീയോട് അതിയായ ലൈംഗിക ആഗ്രഹം ഉണ്ടാകാൻ",
  "Ahlaksızlık": "അനൈതികത",
  "Düşmanlık uyandırmak": "ശത്രുത ഉണർത്താൻ",
  "Bir erkeğin, erkekliğini bağlamak": "പുരുഷന്റെ പുരുഷത്വം ബന്ധിക്കാൻ",
  "Bir erkeğin bütün ahlaksal şartlanmalarını yıkmak": "പുരുഷന്റെ എല്ലാ നൈതിക വ്യവസ്ഥകളും തകർക്കാൻ",
  "Bu zamanda insanlardan ricada bulunulmamalı": "ഈ സമയത്ത് ആരിൽ നിന്നും അഭ്യർത്ഥിക്കരുത്",
  "Resmî işlemler ve yasalarla ilgili şeylerden uzak durmak gereklidir": "ഔദ്യോഗിക കാര്യങ്ങളിൽ നിന്നും നിയമങ്ങളിൽ നിന്നും അകലെ നിൽക്കണം",
  
  // Mansion 14 - SEMMAK
  "Fesad": "ചതി",
  "Düşmanlık": "ശത്രുത",
  "Ölüm": "മരണം",
  "İş hayatında başarısızlık": "ജോലിജീവിതത്തിൽ പരാജയം",
  "İşten kovulmak": "ജോലിയിൽ നിന്ന് പുറത്താക്കപ്പെടാൻ",
  "Maddi sıkıntı": "സാമ്പത്തിക ബുദ്ധിമുട്ട്",
  "Yalanların ortaya çıkması": "കള്ളങ്ങൾ പുറത്തുവരാൻ",
  "Riskli durumlarda kayıp": "അപകടസാധ്യതയുള്ള സാഹചര്യങ്ങളിൽ നഷ്ടം",
  "Ard niyetli teklifler almak": "മോശം ഉദ്ദേശ്യത്തോടെയുള്ള നിർദ്ദേശങ്ങൾ ലഭിക്കാൻ",
  "Güvenilmez kişilerle karşılaşmak": "വിശ്വസിക്കാൻ കഴിയാത്ത ആളുകളെ കണ്ടുമുട്ടാൻ",
  
  // Mansion 15 - GUFUR
  "Sevgi ve dostluk": "സ്നേഹവും സൗഹൃദവും",
  "Barışma": "സമാധാനം",
  "Barıştırma": "സമാധാനം സ്ഥാപിക്കാൻ",
  "Büyük işleri başarmak": "വലിയ കാര്യങ്ങൾ നേടാൻ",
  "İş bulmak": "ജോലി നേടാൻ",
  "İşe girmek": "ജോലിയിൽ പ്രവേശിക്കാൻ",
  "Şifâ bulmak veya şifâ çalışması yapmak": "രോഗശാന്തി നേടാനോ രോഗശാന്തി പ്രവർത്തനങ്ങൾ നടത്താനോ",
  
  // Mansion 16 - ZİBANA
  "Düşmana karşı zafer kazanmak": "ശത്രുവിനെതിരെ വിജയം നേടാൻ",
  "Yara ve ağrıların çabuk iyileşmesi": "പരിക്കുകളും വേദനകളും പെട്ടെന്ന് സുഖപ്പെടാൻ",
  "Tedavi": "ചികിത്സ",
  "Başarı ve mutluluk": "വിജയവും സന്തോഷവും",
  "Düşman için lanet çalışmaları yapmaya uygun zaman": "ശത്രുവിനെതിരെ ശാപ പ്രവർത്തനങ്ങൾ നടത്താൻ അനുയോജ്യ സമയം",
  
  // Mansion 17 - İKLİL
  "İyi ve kötü işler karışıktır": "നല്ലതും ചീത്തയും കാര്യങ്ങൾ കലർന്നിരിക്കുന്നു",
  "İnsanlar tarafından sevilmemek": "ആളുകളാൽ സ്നേഹിക്കപ്പെടാതിരിക്കാൻ",
  "Mal ve parada zarara uğramak": "വസ്തുവകകൾക്കും പണത്തിനും നഷ്ടം വരുത്താൻ",
  "İşlerin bozulması": "കാര്യങ്ങൾ തകരാൻ",
  "Anlaşmaların olmaması": "കരാറുകൾ ഇല്ലാതാക്കാൻ",
  "İşten kovulmak ya da bunların tersi": "ജോലിയിൽ നിന്ന് പുറത്താക്കപ്പെടാനോ അതിന്റെ വിപരീതമോ",
  
  // Mansion 18 - KÂLP
  "Fesad": "ചതി",
  "Bütün işlerin bozulması": "എല്ലാ കാര്യങ്ങളും തകരാൻ",
  "Maddi zarar": "സാമ്പത്തിക നഷ്ടം",
  "Sağlığın bozulması": "ആരോഗ്യം കെടാൻ",
  "Aynı zamanda şans açılması": "അതേസമയം ഭാഗ്യം തുറക്കാൻ",
  "Beklenmedik kazançlara kavuşmak": "പ്രതീക്ഷിക്കാത്ത ലാഭങ്ങൾ നേടാൻ",
  "Şifâ": "രോഗശാന്തി",
  
  // Mansion 19 - ŞEVLE
  "İyi ve kötü karışıktır": "നല്ലതും ചീത്തയും കലർന്നിരിക്കുന്നു",
  "Zor işlerin çözümlenmesi veya çıkmaza sokulması": "ബുദ്ധിമുട്ടുള്ള കാര്യങ്ങൾ പരിഹരിക്കാനോ സങ്കീർണ്ണമാക്കാനോ",
  "Çılgınlığa sebep olmak veya ruhsal tedavi çalışmaları": "ഭ്രാന്ത് ഉണ്ടാക്കാനോ മാനസിക ചികിത്സയ്ക്കോ",
  
  // Mansion 20 - NEAİM
  "Zevk": "ആനന്ദം",
  "Mutluluk": "സന്തോഷം",
  "Dostluk": "സൗഹൃദം",
  "Aşk": "പ്രണയം",
  "Sanatta başarı": "കലയിൽ വിജയം",
  "Sıkıntıdan kurtulmak": "ബുദ്ധിമുട്ടുകളിൽ നിന്ന് മുക്തി നേടാൻ",
  "Ev sahibi olmak": "വീടുവയ്പ്പ്",
  
  // Mansion 21 - BELDE
  "Düşmanlık": "ശത്രുത",
  "Kin": "വൈരം",
  "Ayrılık": "വേർപിരിയൽ",
  "Kovulma": "പുറത്താക്കൽ",
  "Yerini terke mecbur olmak": "സ്ഥലം വിടാൻ നിർബന്ധിതരാകാൻ",
  "Gözden düşmek": "ആളുകളുടെ മുന്നിൽ താഴാൻ",
  "Sosyal seviye kaybı": "സാമൂഹിക നിലവാരം നഷ്ടപ്പെടാൻ",
  "Her türlü alım satım işleri için kötü zaman": "എല്ലാ തരം വ്യാപാരങ്ങൾക്കും ചീത്ത സമയം",
  
  // Mansion 22 - SAADÜZZABİH
  "Kin": "വൈരം",
  "Düşmanlık": "ശത്രുത",
  "Rezalet": "അപമാനം",
  "Kadının kötü yola düşmesi": "സ്ത്രീ മോശം വഴിയിലേക്ക് പോകാൻ",
  "Sırların açığa çıkması": "രഹസ്യങ്ങൾ പുറത്തുവരാൻ",
  "Herkes tarafından dışlanmak": "എല്ലാവരാലും ഒറ്റപ്പെടാൻ",
  
  // Mansion 23 - SAUDBELA
  "Hayırlı ve şerli işlerde aynı anda kullanılabilir": "നല്ലതും ചീത്തയും കാര്യങ്ങൾക്ക് ഒരേസമയം ഉപയോഗിക്കാം",
  "İhanete uğramak": "ദ്രോഹിക്കപ്പെടാൻ",
  "Bu zamanda kimseye güvenmemek gerekir": "ഈ സമയത്ത് ആരെയും വിശ്വസിക്കരുത്",
  
  // Mansion 24 - SAADÜSSUUD
  "Herşeyin düzeltilmesi": "എല്ലാ കാര്യങ്ങളും നന്നാക്കാൻ",
  "Sevgi ve dostluk": "സ്നേഹവും സൗഹൃദവും",
  "Önemli kimselerden destek görmek": "പ്രമുഖരിൽ നിന്ന് പിന്തുണ നേടാൻ",
  "İsteklerin kabul edilmesi": "ആഗ്രഹങ്ങൾ സാധിക്കാൻ",
  
  // Mansion 25 - SAADÜLAHBİYYE
  "Kin ve düşmanlık uyandırma çalışmaları": "വൈരവും ശത്രുതയും ഉണർത്താൻ പ്രവർത്തനങ്ങൾ",
  "Ay bu menazildeyken her işte başarısız olunur": "ഈ നക്ഷത്രത്തിൽ എല്ലാ കാര്യങ്ങളിലും പരാജയപ്പെടുന്നു",
  "İnsanlar birbirlerine tahammül edemezler": "മനുഷ്യർ പരസ്പരം സഹിക്കുന്നില്ല",
  
  // Mansion 26 - FERÜLMUKADDEM
  "Aşk": "പ്രണയം",
  "Sevgi": "സ്നേഹം",
  "Cinselliğe düşkünlük": "ലൈംഗികതയിൽ ആസക്തി",
  "Baştan çıkartmak": "വശീകരിക്കാൻ",
  "Her türlü tabunun yıkılması": "എല്ലാ തരം നിരോധനങ്ങളും തകർക്കാൻ",
  "Yeni ilişkiler kurmak": "പുതിയ ബന്ധങ്ങൾ സ്ഥാപിക്കാൻ",
  "Önemli kimselerden destek görmek ve her işte başarı": "പ്രമുഖരിൽ നിന്ന് പിന്തുണ നേടാനും എല്ലാ കാര്യങ്ങളിലും വിജയിക്കാനും",
  
  // Mansion 27 - FERÜLMÜAHHİR
  "Düşmanlık görmek": "ശത്രുത നേരിടാൻ",
  "Kaza ve belalara uğramak": "അപകടങ്ങളും ദുരന്തങ്ങളും നേരിടാൻ",
  "Kahır ve helak": "പീഡനവും നാശവും",
  "Sağlığın bozulması": "ആരോഗ്യം കെടാൻ",
  
  // Mansion 28 - EERREŞA
  "Başarı ve zenginliğe kavuşmak": "വിജയവും സമ്പത്തും നേടാൻ",
  "İnsanlarla iyi ilişkiler": "മനുഷ്യരുമായി നല്ല ബന്ധങ്ങൾ",
  "Sosyal genişleme": "സാമൂഹിക വികാസം",
  "Yolculuklar": "യാത്രകൾ"
};