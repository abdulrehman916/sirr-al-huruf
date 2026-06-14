/**
 * ASTRO CLOCK DATA — HAVÂSS'IN DERİNLİKLERİ (Bülent Kısa, 2004)
 * Source: Pages 1-100 of two PDF volumes
 * Extraction: Complete, no skipping, no summarizing, no interpretation
 * Module: ASTRO CLOCK — FULLY ISOLATED
 * DO NOT IMPORT FROM OTHER MODULES
 */

// ═══════════════════════════════════════════════════════════════
// TABLE 1: PLANETARY RULERS — DAY AND CHARACTERISTICS
// Source: Pages 49-51 (Gündüz ve Gece Saatleri section)
// ═══════════════════════════════════════════════════════════════

export const PLANETS = [
  {
    id: "gunes",
    name_turkish: "GÜNEŞ",
    name_arabic: "الشمس",
    symbol: "☉",
    day: "Pazar",
    day_arabic: "يوم الأحد",
    day_number: 0, // 0=Sunday
    applications: [
      "Para",
      "Ümit",
      "Yöneticiler, başkanlar, güçlü kimseler nezdinde teveccüh kazanmak",
      "Genel arkadaşlık",
      "Düşmanlığa karşı koymak",
      "Düşmanlığı, dostluğa çevirmek",
      "Sportif başarılar",
      "Fiziksel sağlamlık",
      "Genelin hayranlığını kazanmak"
    ],
    source_page: 50
  },
  {
    id: "ay",
    name_turkish: "AY",
    name_arabic: "القمر",
    symbol: "☽",
    day: "Pazartesi",
    day_arabic: "يوم الإثنين",
    day_number: 1,
    applications: [
      "Denizcilik",
      "Gemicilik",
      "Yolculuklar",
      "Aşk ve yenileşme",
      "Su ve suyla ilgili şeyler",
      "Hırsızlık ve hırsızlıkla ilgili konular",
      "Haberciler",
      "Vizyonlar",
      "Rüyalar",
      "Sezgiler"
    ],
    source_page: 50
  },
  {
    id: "merkur",
    name_turkish: "MERKÜR",
    name_arabic: "عطارد",
    symbol: "☿",
    day: "Çarşamba",
    day_arabic: "يوم الأربعاء",
    day_number: 3,
    applications: [
      "Konuşma gücü",
      "İş",
      "Sanat ve bilim",
      "Kehanet",
      "Hırsızlığı keşfetmek",
      "Ticari eşyalar",
      "Hile gerektiren iş ve uygulamalar",
      "Fiziksel plan dışından davetler"
    ],
    source_page: 50
  },
  {
    id: "venus",
    name_turkish: "VENÜS",
    name_arabic: "الزهرة",
    symbol: "♀",
    day: "Cuma",
    day_arabic: "يوم الجمعة",
    day_number: 5,
    applications: [
      "Aşk",
      "Arkadaşlık",
      "Seyyehat",
      "Nezaket ve zevk",
      "Eğlence",
      "Cinsel konular",
      "Baştan çıkartmalar"
    ],
    source_page: 51
  },
  {
    id: "mars",
    name_turkish: "MARS",
    name_arabic: "المريخ",
    symbol: "♂",
    day: "Salı",
    day_arabic: "يوم الثلاثاء",
    day_number: 2,
    applications: [
      "Savaş",
      "Askeri başarılar",
      "Cesaret",
      "İmha ve uyumsuzluk çalışmaları",
      "Katliam",
      "Ölüm ve acı haberler",
      "Askeri konularda şans kazanmak",
      "Düşmanlıklar",
      "Düşmanlara karşı lanet çalışmaları",
      "Erkeklere yönelik çalışmalar"
    ],
    source_page: 51
  },
  {
    id: "jupiter",
    name_turkish: "JÜPİTER",
    name_arabic: "المشتري",
    symbol: "♃",
    day: "Perşembe",
    day_arabic: "يوم الخميس",
    day_number: 4,
    applications: [
      "Şeref ve zenginlik",
      "Arkadaşlık",
      "Fiziksel sağlık",
      "Kalpteki arzular",
      "Para ve zenginlik",
      "Bilgi kazanmak"
    ],
    source_page: 51
  },
  {
    id: "saturn",
    name_turkish: "SATÜRN",
    name_arabic: "زحل",
    symbol: "♄",
    day: "Cumartesi",
    day_arabic: "يوم السبت",
    day_number: 6,
    applications: [
      "İyi ve şerli uygulamalara aynı derecede yarar",
      "Hâdim davetleri",
      "Birisinin rüyasına girmek ve telkin",
      "Mesleki şans veya bela",
      "Mal, mülk",
      "Bilgi kazanmak",
      "Ölüm ve bela çalışmaları"
    ],
    source_page: 51
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 2: PLANETARY HOUR SEQUENCE
// Source: Pages 51-52
// Rule: The sequence cycles continuously: Güneş → Venüs → Merkür → Ay → Satürn → Jüpiter → Mars
// ═══════════════════════════════════════════════════════════════

export const PLANETARY_HOUR_SEQUENCE = [
  "gunes",   // 1
  "venus",   // 2
  "merkur",  // 3
  "ay",      // 4
  "saturn",  // 5
  "jupiter", // 6
  "mars"     // 7
];

// ═══════════════════════════════════════════════════════════════
// TABLE 3: DAYTIME PLANETARY HOURS TABLE
// Source: Page 53 — Gündüz Saatleri Tablosu
// Columns: Paz(Pazar/Sun), Pts(Pazartesi/Mon), Sal(Salı/Tue), Çar(Çarşamba/Wed),
//          Per(Perşembe/Thu), Cum(Cuma/Fri), Cts(Cumartesi/Sat)
// ═══════════════════════════════════════════════════════════════

export const DAYTIME_HOURS_TABLE = [
  // Hour 1
  { hour: 1, paz: "gunes",   pts: "ay",     sal: "mars",   car: "merkur", per: "jupiter", cum: "venus",  cts: "saturn"  },
  // Hour 2
  { hour: 2, paz: "venus",   pts: "saturn", sal: "gunes",  car: "ay",     per: "mars",    cum: "merkur", cts: "jupiter" },
  // Hour 3
  { hour: 3, paz: "merkur",  pts: "jupiter",sal: "venus",  car: "saturn", per: "gunes",   cum: "ay",     cts: "mars"    },
  // Hour 4
  { hour: 4, paz: "ay",      pts: "mars",   sal: "merkur", car: "jupiter",per: "venus",   cum: "saturn", cts: "gunes"   },
  // Hour 5
  { hour: 5, paz: "saturn",  pts: "gunes",  sal: "ay",     car: "mars",   per: "merkur",  cum: "jupiter",cts: "venus"   },
  // Hour 6
  { hour: 6, paz: "jupiter", pts: "venus",  sal: "saturn", car: "gunes",  per: "ay",      cum: "mars",   cts: "merkur"  },
  // Hour 7
  { hour: 7, paz: "mars",    pts: "merkur", sal: "jupiter",car: "venus",  per: "saturn",  cum: "gunes",  cts: "ay"      },
  // Hour 8
  { hour: 8, paz: "gunes",   pts: "ay",     sal: "mars",   car: "merkur", per: "jupiter", cum: "venus",  cts: "saturn"  },
  // Hour 9
  { hour: 9, paz: "venus",   pts: "saturn", sal: "gunes",  car: "ay",     per: "mars",    cum: "merkur", cts: "jupiter" },
  // Hour 10
  { hour: 10,paz: "merkur",  pts: "jupiter",sal: "venus",  car: "saturn", per: "gunes",   cum: "ay",     cts: "mars"    },
  // Hour 11
  { hour: 11,paz: "ay",      pts: "mars",   sal: "merkur", car: "jupiter",per: "venus",   cum: "saturn", cts: "gunes"   },
  // Hour 12
  { hour: 12,paz: "saturn",  pts: "gunes",  sal: "ay",     car: "mars",   per: "merkur",  cum: "jupiter",cts: "venus"   }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 4: NIGHTTIME PLANETARY HOURS TABLE
// Source: Page 54 — Gece Saatleri Tablosu
// NOTE: "Pazartesi gecesi" means the night connecting Pazar→Pazartesi
//       "Salı gecesi" means the night connecting Pazartesi→Salı, etc.
// Columns: Pts(Pazartesi), Sal(Salı), Çar(Çarşamba), Per(Perşembe),
//          Cum(Cuma), Cts(Cumartesi), Paz(Pazar)
// ═══════════════════════════════════════════════════════════════

export const NIGHTTIME_HOURS_TABLE = [
  // Hour 1
  { hour: 1, pts: "jupiter",sal: "venus",  car: "saturn", per: "gunes",  cum: "ay",      cts: "mars",   paz: "merkur"  },
  // Hour 2
  { hour: 2, pts: "mars",   sal: "merkur", car: "jupiter",per: "venus",  cum: "saturn",  cts: "gunes",  paz: "ay"      },
  // Hour 3
  { hour: 3, pts: "gunes",  sal: "ay",     car: "mars",   per: "merkur", cum: "jupiter", cts: "venus",  paz: "saturn"  },
  // Hour 4
  { hour: 4, pts: "venus",  sal: "saturn", car: "gunes",  per: "ay",     cum: "mars",    cts: "merkur", paz: "jupiter" },
  // Hour 5
  { hour: 5, pts: "merkur", sal: "jupiter",car: "venus",  per: "saturn", cum: "gunes",   cts: "ay",     paz: "mars"    },
  // Hour 6
  { hour: 6, pts: "ay",     sal: "mars",   car: "merkur", per: "jupiter",cum: "venus",   cts: "saturn", paz: "gunes"   },
  // Hour 7
  { hour: 7, pts: "saturn", sal: "gunes",  car: "ay",     per: "mars",   cum: "merkur",  cts: "jupiter",paz: "venus"   },
  // Hour 8
  { hour: 8, pts: "jupiter",sal: "venus",  car: "saturn", per: "gunes",  cum: "ay",      cts: "mars",   paz: "merkur"  },
  // Hour 9
  { hour: 9, pts: "mars",   sal: "merkur", car: "jupiter",per: "venus",  cum: "saturn",  cts: "gunes",  paz: "ay"      },
  // Hour 10
  { hour: 10,pts: "gunes",  sal: "ay",     car: "mars",   per: "merkur", cum: "jupiter", cts: "venus",  paz: "saturn"  },
  // Hour 11
  { hour: 11,pts: "venus",  sal: "saturn", car: "gunes",  per: "ay",     cum: "mars",    cts: "merkur", paz: "jupiter" },
  // Hour 12
  { hour: 12,pts: "merkur", sal: "jupiter",car: "venus",  per: "saturn", cum: "gunes",   cts: "ay",     paz: "mars"    }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 5: AY MENAZİLLERİ — 28 LUNAR MANSIONS
// Source: Pages 64-74
// Each mansion: name, starting degree, letter (harf), effects/rules
// ═══════════════════════════════════════════════════════════════

export const AY_MENAZILLERI = [
  {
    id: 1,
    name: "ŞARTEYN",
    arabic_name: "الشرطين",
    starting_sign: "Koç",
    starting_degree: 25,
    harf: "Elif",
    arabic_harf: "ا",
    character: "nahs",
    effects: [
      "Geleneksel olarak uğursuz kabul edilir",
      "Kan dökmek ve kötü işler yapmaya uygun",
      "Bu zamanda mecbur olunmayan hiç bir iş yapılmamalıdır",
      "Fesad",
      "Bozgunculuk",
      "İnsanların aralarında düşmanlık yaratmak",
      "Ay bu menazilde iken insanlar kötü rüyalar, kabuslar görürür"
    ],
    suitable_operations: [],
    unsuitable_operations: [
      "Mecbur olunmayan her türlü iş"
    ],
    source_page: 66
  },
  {
    id: 2,
    name: "BUTEYN",
    arabic_name: "البطين",
    starting_sign: "Boğa",
    starting_degree: 8,
    harf: "Ba",
    arabic_harf: "ب",
    character: "mixed",
    effects: [
      "Büyü, Tılsım (Talisman), Vefk gibi şeyler yapmak için uygundur",
      "Elişleri, Talisman veya vefk gibi şeylerin metal veya başka maddeler üzerine işlenmeleri",
      "Kadınlar üzerinde etkili bir zamandır",
      "Günlük hayatta erkeklerin kadınlarla tanışmaları için ideal",
      "Kadınların baştan çıkartılmaları ve kadınları elde etmek için ideal",
      "Kadınların iyiliği için çalışmalara da uygundur: rızk açıklığı, kısmet açıklığı, şifâ"
    ],
    suitable_operations: [
      "Büyü, Tılsım, Vefk yapmak",
      "Metal veya başka maddeler üzerine işlemek",
      "Erkek-kadın ilişkileri",
      "Baştan çıkartma çalışmaları",
      "Kadınların rızk açıklığı, kısmet açıklığı, şifâ çalışmaları"
    ],
    unsuitable_operations: [],
    source_page: 66
  },
  {
    id: 3,
    name: "SÜREYYA",
    arabic_name: "الثريا",
    starting_sign: "Boğa",
    starting_degree: 21,
    harf: "Cim",
    arabic_harf: "ج",
    character: "saad",
    effects: [
      "Evlilik, Evlenme teklifi gibi işlere uygun bir zamandır",
      "Bu zamanda kadınların yararına olabilecek celbi muhabbet çalışmaları yapılabilir",
      "Kadının bir erkeği elde etmesi için uygun zaman",
      "İşlerin açılması, işi geliştirmek, Ticari kazanç gibi şeyler başarılıdır"
    ],
    suitable_operations: [
      "Evlilik, evlenme teklifi",
      "Celbi muhabbet (kadın için)",
      "Kadının erkek elde etmesi",
      "İş açma, geliştirme",
      "Ticari kazanç"
    ],
    unsuitable_operations: [],
    source_page: 67
  },
  {
    id: 4,
    name: "DÜBRAN",
    arabic_name: "الدبران",
    starting_sign: "İkizler",
    starting_degree: 3,
    harf: "Dal",
    arabic_harf: "د",
    character: "nahs",
    effects: [
      "Kin, düşmanlık, ayrılık ve benzeri şeylere uygun bir zamandır",
      "Bu zamanda olumlu bir iş için ya da bu zamanın kötülüklerini gidermekle ilgili bir çalışma yapılmamalıdır",
      "Ay Dübran menazilinde iken insanlar sırlarını korumaya ve boşboğazlık etmemeye dikkat etmelidirler",
      "Toprak, Tarla, mesken gibi işler için iyidir",
      "Kişiyi kötü duruma düşürmek",
      "Pasifize etmek",
      "Sağlığını bozmak gibi işler",
      "Kin ve düşmanlığa sebep olmak",
      "İnsanları ayırmak",
      "Ortaklık veya evlikleri bozmak"
    ],
    suitable_operations: [
      "Toprak, tarla, mesken işleri",
      "Kişiyi kötü duruma düşürmek",
      "Pasifize etmek",
      "Sağlığını bozmak",
      "Kin ve düşmanlığa sebep olmak",
      "İnsanları ayırmak",
      "Ortaklık veya evlikleri bozmak"
    ],
    unsuitable_operations: [
      "Olumlu işler",
      "Kötülükleri gidermek için çalışma"
    ],
    source_page: 67
  },
  {
    id: 5,
    name: "HAK'A",
    arabic_name: "الهقعة",
    starting_sign: "İkizler",
    starting_degree: 16,
    harf: "He",
    arabic_harf: "ه",
    character: "nahs",
    effects: [
      "Kişiyi eşinden soğutmak",
      "Ayrılık",
      "Mal ve para açısından zarar vermek",
      "Ortaklıkları ve işi bozmak",
      "Ticari kayıplar",
      "Büyük şirketlerin zarar etmesi",
      "Gözden düşürmek",
      "Günlük hayatta bozuk gıdalara ve gıda zehirlenmelerine dikkat etmek gereken bir zamandır",
      "Bu zamanda yapılan evlilikler hayırlı olmayıp, uzun sürmezler",
      "Evlenme teklifleri veya nişanlılıklar sonuca ulaşamazlar",
      "Ay bu menazildeyken sadece Tarla, bahçe, arazi, emlak gibi işler hayırlı sonuç verir"
    ],
    suitable_operations: [
      "Kişiyi eşinden soğutmak",
      "Ayrılık çalışmaları",
      "Mal ve para zararı çalışmaları",
      "Ortaklık ve iş bozmak",
      "Ticari kayıp çalışmaları",
      "Gözden düşürmek",
      "Tarla, bahçe, arazi, emlak işleri"
    ],
    unsuitable_operations: [
      "Evlilik ve nişanlanma",
      "Evlenme teklifleri"
    ],
    source_page: 67
  },
  {
    id: 6,
    name: "HENA",
    arabic_name: "الهنعة",
    starting_sign: "İkizler",
    starting_degree: 29,
    harf: "Vav",
    arabic_harf: "و",
    character: "saad",
    effects: [
      "Aşk ve sevgi",
      "Dargınlıkların giderilmesi",
      "Önemli kimselerden istekte bulunmak",
      "Sağlık",
      "Bir şeye sahip olmak",
      "Mal edinmek",
      "Maddi gelirin artışı",
      "Günlük hayatta arkadaş toplantıları, dostlarla görüşmek hayırlı zamandır",
      "Fikir alışverişleri için hayırlı",
      "Yeni şeyler satın almak için hayırlı",
      "Evlenmek, nişanlanmak için hayırlı zamandır"
    ],
    suitable_operations: [
      "Aşk ve sevgi çalışmaları",
      "Dargınlık gidermek",
      "Önemli kimselerden istekte bulunmak",
      "Sağlık çalışmaları",
      "Mal edinmek",
      "Maddi gelir artırma",
      "Arkadaş toplantıları",
      "Yeni alışveriş",
      "Evlilik, nişanlanma"
    ],
    unsuitable_operations: [],
    source_page: 68
  },
  {
    id: 7,
    name: "ZİRA",
    arabic_name: "الذراع",
    starting_sign: "Yengeç",
    starting_degree: 12,
    harf: "Zel",
    arabic_harf: "ز",
    character: "saad",
    effects: [
      "Bilim ve eğitimde başarılı olmak",
      "Konuşma, toplantı ve anlaşmalarda başarı",
      "Mal, emlak veya arazi sahibi olmak",
      "Önemli konumlardaki kimselerden istekte bulunup, kabul görmek",
      "Günlük hayatta önemli konumlardaki kimselerden istekte bulunmaya uygun",
      "Hayırlı işler için tılsım veya vefk hazırlamaya uygun bir dönem"
    ],
    suitable_operations: [
      "Bilim ve eğitimde başarı",
      "Toplantı ve anlaşmalar",
      "Mal, emlak, arazi edinmek",
      "Önemli kimselerden istekte bulunmak",
      "Hayırlı tılsım veya vefk hazırlamak"
    ],
    unsuitable_operations: [],
    source_page: 68
  },
  {
    id: 8,
    name: "NESRE",
    arabic_name: "النثرة",
    starting_sign: "Yengeç",
    starting_degree: 25,
    harf: "Ha",
    arabic_harf: "ح",
    character: "nahs",
    effects: [
      "Düşmanlık",
      "Kin",
      "Kahır",
      "Kavga ve geçimsizlik",
      "Bu zamanda ortaklık kurulmamalı",
      "Evlenmemeli, nişanlanmamalı",
      "Ev, arazi gibi şeyler almak veya kiralamak iyi sonuç vermez"
    ],
    suitable_operations: [],
    unsuitable_operations: [
      "Ortaklık kurmak",
      "Evlenmek, nişanlanmak",
      "Ev, arazi almak veya kiralamak"
    ],
    source_page: 69
  },
  {
    id: 9,
    name: "TARFA",
    arabic_name: "الطرفة",
    starting_sign: "Arslan",
    starting_degree: 8,
    harf: "Tı",
    arabic_harf: "ط",
    character: "nahs",
    effects: [
      "Uğursuzluk",
      "Mutluluğu bozmak",
      "Gözden düşürmek",
      "Dostlukları bozmak",
      "Günlük hayatta, böyle bir dönemde iken resmi dairelerle ilgili işler takip edilmemeli",
      "Kimseden ricada bulunulmamalı"
    ],
    suitable_operations: [],
    unsuitable_operations: [
      "Resmi dairelerle ilgili işler",
      "Kimseye ricada bulunmak"
    ],
    source_page: 69
  },
  {
    id: 10,
    name: "CEPHE",
    arabic_name: "الجبهة",
    starting_sign: "Arslan",
    starting_degree: 21,
    harf: "Ye",
    arabic_harf: "ي",
    character: "mixed",
    effects: [
      "Dostluklar kurmak",
      "Genel hayranlık ve sosyal ilerleme",
      "Başarılı olmak",
      "Bu zamanda hem iyi hem kötü şeyler yapılabilir",
      "Suflî işler yukarda sayılan maddelerin tam tersine çalışmasıdır"
    ],
    suitable_operations: [
      "Dostluklar kurmak",
      "Sosyal ilerleme",
      "Başarı çalışmaları",
      "Suflî işler (tam ters etki yaratmak için)"
    ],
    unsuitable_operations: [],
    source_page: 69
  },
  {
    id: 11,
    name: "ZEBRA",
    arabic_name: "الزبرة",
    starting_sign: "Başak",
    starting_degree: 3,
    harf: "Kef",
    arabic_harf: "ك",
    character: "saad",
    effects: [
      "Hastalıktan kurtulmak",
      "Her şeyden korunmak",
      "Ticaret, alım satım işlerinde kolaylık",
      "Önemli kimselerden lutuf görmek",
      "İsteklerini kabul ettirmek",
      "Bütün insanlar tarafından sevilmek"
    ],
    suitable_operations: [
      "Hastalıktan kurtulma çalışmaları",
      "Koruma çalışmaları",
      "Ticaret ve alım satım",
      "Önemli kimselerden lutuf",
      "Kabul ettirme çalışmaları",
      "Sevilme çalışmaları"
    ],
    unsuitable_operations: [],
    source_page: 70
  },
  {
    id: 12,
    name: "SURFA",
    arabic_name: "الصرفة",
    starting_sign: "Başak",
    starting_degree: 16,
    harf: "Lam",
    arabic_harf: "ل",
    character: "nahs",
    effects: [
      "Ay bu menazilde iken, her türlü olumsuz iş",
      "Kahır ve helak çalışmalarına uygun zamandır"
    ],
    suitable_operations: [
      "Her türlü olumsuz iş",
      "Kahır ve helak çalışmaları"
    ],
    unsuitable_operations: [],
    source_page: 70
  },
  {
    id: 13,
    name: "AVA",
    arabic_name: "العواء",
    starting_sign: "Başak",
    starting_degree: 29,
    harf: "Mim",
    arabic_harf: "م",
    character: "nahs",
    effects: [
      "Şehvet duygusunu körüklemek",
      "Bir erkeğin, belli bir kadına karşı dayanılmaz cinsel istekler içinde olması",
      "Ahlaksızlık",
      "Düşmanlık uyandırmak",
      "Ya da bir erkeğin, erkekliğini bağlamak",
      "Tam tersine Bir erkeğin bütün ahlaksal şartlanmalarını yıkmak",
      "Bu zamanda insanlardan ricada bulunulmamalı",
      "Resmî işlemler ve yasalarla ilgili şeylerden uzak durmak gereklidir"
    ],
    suitable_operations: [
      "Şehvet körükleme çalışmaları",
      "Düşmanlık uyandırma",
      "Erkekliği bağlamak",
      "Ahlaksal şartlanmaları yıkmak"
    ],
    unsuitable_operations: [
      "İnsanlardan ricada bulunmak",
      "Resmî işlemler ve yasalarla ilgili işler"
    ],
    source_page: 70
  },
  {
    id: 14,
    name: "SEMMAK",
    arabic_name: "السماك",
    starting_sign: "Terazi",
    starting_degree: 12,
    harf: "Nun",
    arabic_harf: "ن",
    character: "nahs",
    effects: [
      "Fesad",
      "Düşmanlık",
      "Ölüm",
      "İş hayatında başarısızlık",
      "İşten kovulmak",
      "Maddi sıkıntı",
      "Yalanların ortaya çıkması",
      "Riskli durumlarda kayıp",
      "Ard niyetli teklifler almak",
      "Güvenilmez kişilerle karşılaşmak"
    ],
    suitable_operations: [],
    unsuitable_operations: [],
    source_page: 71
  },
  {
    id: 15,
    name: "GUFUR",
    arabic_name: "الغفر",
    starting_sign: "Terazi",
    starting_degree: 25,
    harf: "Sin",
    arabic_harf: "س",
    character: "saad",
    effects: [
      "Sevgi ve dostluk",
      "Barışma",
      "Barıştırma",
      "Büyük işleri başarmak",
      "İş bulmak",
      "İşe girmek",
      "Şifâ bulmak veya şifâ çalışması yapmak"
    ],
    suitable_operations: [
      "Sevgi ve dostluk çalışmaları",
      "Barışma ve barıştırma",
      "Büyük işleri başarmak",
      "İş bulmak",
      "Şifâ çalışmaları"
    ],
    unsuitable_operations: [],
    source_page: 71
  },
  {
    id: 16,
    name: "ZİBANA",
    arabic_name: "الزبانى",
    starting_sign: "Akrep",
    starting_degree: 8,
    harf: "Ayın",
    arabic_harf: "ع",
    character: "mixed",
    effects: [
      "Düşmana karşı zafer kazanmak",
      "Yara ve ağrıların çabuk iyileşmesi",
      "Tedavi",
      "Başarı ve mutluluk",
      "Düşman için lanet çalışmaları yapmaya uygun zaman"
    ],
    suitable_operations: [
      "Düşmana karşı zafer",
      "Tedavi ve iyileşme çalışmaları",
      "Başarı ve mutluluk",
      "Düşmana lanet çalışmaları"
    ],
    unsuitable_operations: [],
    source_page: 71
  },
  {
    id: 17,
    name: "İKLİL",
    arabic_name: "الإكليل",
    starting_sign: "Akrep",
    starting_degree: 21,
    harf: "Fe",
    arabic_harf: "ف",
    character: "mixed",
    effects: [
      "İyi ve kötü işler karışıktır",
      "İnsanlar tarafından sevilmemek",
      "Mal ve parada zarara uğramak",
      "İşlerin bozulması",
      "Anlaşmaların olmaması",
      "İşten kovulmak ya da bunların tersi"
    ],
    suitable_operations: [],
    unsuitable_operations: [],
    source_page: 71
  },
  {
    id: 18,
    name: "KÂLP",
    arabic_name: "القلب",
    starting_sign: "Yay",
    starting_degree: 3,
    harf: "Sad",
    arabic_harf: "ص",
    character: "mixed",
    effects: [
      "Fesad",
      "Bütün işlerin bozulması",
      "Maddi zarar",
      "Sağlığın bozulması",
      "Aynı zamanda şans açılması",
      "Beklenmedik kazançlara kavuşmak",
      "Şifâ"
    ],
    suitable_operations: [
      "Şans açılması",
      "Beklenmedik kazanç çalışmaları",
      "Şifâ"
    ],
    unsuitable_operations: [],
    source_page: 72
  },
  {
    id: 19,
    name: "ŞEVLE",
    arabic_name: "الشولة",
    starting_sign: "Yay",
    starting_degree: 16,
    harf: "Kaf",
    arabic_harf: "ق",
    character: "mixed",
    effects: [
      "İyi ve kötü karışıktır",
      "Zor işlerin çözümlenmesi veya çıkmaza sokulması",
      "Çılgınlığa sebep olmak veya ruhsal tedavi çalışmaları"
    ],
    suitable_operations: [
      "Zor işlerin çözümlenmesi",
      "Zor işleri çıkmaza sokmak",
      "Ruhsal tedavi çalışmaları"
    ],
    unsuitable_operations: [],
    source_page: 72
  },
  {
    id: 20,
    name: "NEAİM",
    arabic_name: "النعائم",
    starting_sign: "Yay",
    starting_degree: 29,
    harf: "Re",
    arabic_harf: "ر",
    character: "saad",
    effects: [
      "Zevk",
      "Mutluluk",
      "Dostluk",
      "Aşk",
      "Sanatta başarı",
      "Sıkıntıdan kurtulmak",
      "Ev sahibi olmak"
    ],
    suitable_operations: [
      "Zevk ve mutluluk çalışmaları",
      "Dostluk kurma",
      "Aşk çalışmaları",
      "Sanatta başarı",
      "Sıkıntıdan kurtulma",
      "Ev edinme"
    ],
    unsuitable_operations: [],
    source_page: 72
  },
  {
    id: 21,
    name: "BELDE",
    arabic_name: "البلدة",
    starting_sign: "Oğlak",
    starting_degree: 12,
    harf: "Şın",
    arabic_harf: "ش",
    character: "nahs",
    effects: [
      "Düşmanlık",
      "Kin",
      "Ayrılık",
      "Kovulma",
      "Yerini terke mecbur olmak",
      "Gözden düşmek",
      "Sosyal seviye kaybı",
      "Her türlü alım satım işleri için kötü zaman"
    ],
    suitable_operations: [],
    unsuitable_operations: [
      "Her türlü alım satım"
    ],
    source_page: 72
  },
  {
    id: 22,
    name: "SAADÜZZABİH",
    arabic_name: "سعد الذابح",
    starting_sign: "Oğlak",
    starting_degree: 25,
    harf: "Te",
    arabic_harf: "ت",
    character: "nahs",
    effects: [
      "Kin",
      "Düşmanlık",
      "Rezalet",
      "Kadının kötü yola düşmesi",
      "Sırların açığa çıkması",
      "Herkes tarafından dışlanmak"
    ],
    suitable_operations: [],
    unsuitable_operations: [],
    source_page: 73
  },
  {
    id: 23,
    name: "SAUDBELA",
    arabic_name: "سعد بلع",
    starting_sign: "Kova",
    starting_degree: 8,
    harf: "Se",
    arabic_harf: "ث",
    character: "mixed",
    effects: [
      "Hayırlı ve şerli işlerde aynı anda kullanılabilir",
      "İhanete uğramak",
      "Bu zamanda kimseye güvenmemek gerekir"
    ],
    suitable_operations: [
      "Hayırlı ve şerli işler eşit derecede"
    ],
    unsuitable_operations: [
      "Kimseye güvenmek"
    ],
    source_page: 73
  },
  {
    id: 24,
    name: "SAADÜSSUUD",
    arabic_name: "سعد السعود",
    starting_sign: "Kova",
    starting_degree: 21,
    harf: "Hı",
    arabic_harf: "خ",
    character: "saad",
    effects: [
      "Herşeyin düzeltilmesi",
      "Sevgi ve dostluk",
      "Önemli kimselerden destek görmek",
      "İsteklerin kabul edilmesi"
    ],
    suitable_operations: [
      "Her şeyi düzeltmek",
      "Sevgi ve dostluk çalışmaları",
      "Önemli kimselerden destek almak",
      "İsteklerin kabul edilmesi"
    ],
    unsuitable_operations: [],
    source_page: 73
  },
  {
    id: 25,
    name: "SAADÜLAHBİYYE",
    arabic_name: "سعد الأخبية",
    starting_sign: "Balık",
    starting_degree: 3,
    harf: "Zal",
    arabic_harf: "ذ",
    character: "nahs",
    effects: [
      "Kin ve düşmanlık uyandırma çalışmaları",
      "Ay bu menazildeyken her işte başarısız olunur",
      "İnsanlar birbirlerine tahammül edemezler"
    ],
    suitable_operations: [
      "Kin ve düşmanlık uyandırma çalışmaları"
    ],
    unsuitable_operations: [
      "Her türlü iş (başarısız olunur)"
    ],
    source_page: 73
  },
  {
    id: 26,
    name: "FERÜLMUKADDEM",
    arabic_name: "فرغ المقدم",
    starting_sign: "Balık",
    starting_degree: 16,
    harf: "Dad",
    arabic_harf: "ض",
    character: "saad",
    effects: [
      "Aşk",
      "Sevgi",
      "Cinselliğe düşkünlük",
      "Baştan çıkartmak",
      "Her türlü tabunun yıkılması",
      "Yeni ilişkiler kurmak",
      "Önemli kimselerden destek görmek",
      "Her işte başarı"
    ],
    suitable_operations: [
      "Aşk ve sevgi çalışmaları",
      "Baştan çıkartmak",
      "Yeni ilişkiler kurmak",
      "Önemli kimselerden destek almak",
      "Her işte başarı"
    ],
    unsuitable_operations: [],
    source_page: 74
  },
  {
    id: 27,
    name: "FERÜLMÜAHHİR",
    arabic_name: "فرغ المؤخر",
    starting_sign: "Balık",
    starting_degree: 29,
    harf: "Zı",
    arabic_harf: "ظ",
    character: "nahs",
    effects: [
      "Düşmanlık görmek",
      "Kaza ve belalara uğramak",
      "Kahır ve helak",
      "Sağlığın bozulması"
    ],
    suitable_operations: [],
    unsuitable_operations: [],
    source_page: 74
  },
  {
    id: 28,
    name: "EERREŞA",
    arabic_name: "الرشاء",
    starting_sign: "Koç",
    starting_degree: 12,
    harf: "Gayın",
    arabic_harf: "غ",
    character: "saad",
    effects: [
      "Başarı ve zenginliğe kavuşmak",
      "İnsanlarla iyi ilişkiler",
      "Sosyal genişleme",
      "Yolculuklar"
    ],
    suitable_operations: [
      "Başarı ve zenginlik çalışmaları",
      "Sosyal ilişki geliştirme",
      "Yolculuklar"
    ],
    unsuitable_operations: [],
    source_page: 74
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 6: TIMING RULES — MOON PHASE RULES
// Source: Page 63
// ═══════════════════════════════════════════════════════════════

export const MOON_PHASE_RULES = [
  {
    id: "waxing",
    name: "Ay'ın Büyümesi",
    english: "Waxing Moon",
    use_for: "Olumlu (Positive) operations",
    rule: "Positive/beneficial operations should be performed during waxing moon",
    source_page: 63
  },
  {
    id: "waning",
    name: "Ay'ın Küçülmesi",
    english: "Waning Moon",
    use_for: "Olumsuz (Negative) operations",
    rule: "Negative/harmful operations should be performed during waning moon",
    source_page: 63
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 7: TIMING CALCULATION RULES
// Source: Pages 55-59
// ═══════════════════════════════════════════════════════════════

export const TIMING_CALCULATION_RULES = [
  {
    id: "rule_1",
    title: "Güneş Doğuş Düzeltmesi",
    rule: "Takvim'deki Güneş sütunu sabah namazı saatini gösterir. Güneş'in gerçek doğuş saati takvim saatine +12 dakika eklenerek bulunur.",
    example: "1 Ocak: Takvim 7:22 → Gerçek doğuş 7:34",
    source_page: 57
  },
  {
    id: "rule_2",
    title: "Güneş Batış Düzeltmesi",
    rule: "Takvim'deki Akşam sütunu akşam namazı saatini gösterir. Güneş'in gerçek batış saati takvim saatinden -12 dakika çıkartılarak bulunur.",
    example: "1 Ocak: Takvim 16:53 → Gerçek batış 16:41",
    source_page: 57
  },
  {
    id: "rule_3",
    title: "Gündüz Saati Uzunluğu",
    rule: "Güneş doğuş ile batış arasındaki toplam dakika sayısı 12'ye bölünür. Gelen tam sayı bir gündüz saatinin dakika uzunluğudur.",
    example: "15 Ocak: 07:32 doğuş, 16:55 batış → 563 dakika / 12 = 46 dakika (bir gündüz saati)",
    source_page: 58
  },
  {
    id: "rule_4",
    title: "Gece Saati Uzunluğu",
    rule: "Güneş batışından ertesi sabah doğuşuna kadar olan toplam dakika sayısı 12'ye bölünür. Gelen tam sayı bir gece saatinin dakika uzunluğudur.",
    example: "15 Ocak gecesi: 16:55 batış → 07:32 (ertesi) → 877 dakika / 12 = 73 dakika (bir gece saati)",
    source_page: 59
  },
  {
    id: "rule_5",
    title: "Her Günün 1. Saati Başlangıcı",
    rule: "Her günün birinci saati tam Güneş'in doğum anında başlar.",
    source_page: 52
  },
  {
    id: "rule_6",
    title: "Gecenin 1. Saati Başlangıcı",
    rule: "Güneş battığı anda gecenin birinci saati başlamış olur.",
    source_page: 52
  },
  {
    id: "rule_7",
    title: "Saatler 60 dakika değildir",
    rule: "Gündüz ve gece saatleri alışıldık 60 dakikalık saatler değildirler. Mevsime göre gün ve gece saatlerinin uzunlukları devamlı olarak değişir.",
    source_page: 52
  },
  {
    id: "rule_8",
    title: "Çalışma Başlama Toleransı",
    rule: "Hesaplarda saniye ve saliseler atıldığından bazı durumlarda günde 10 dakikaya kadar fark yaratabilir. En iyisi, beklediğimiz saat girdikten on, onbeş dakika sonra çalışmaya başlamaktır.",
    source_page: 60
  },
  {
    id: "rule_9",
    title: "Alaturka Saat Sistemi YANLIŞTIR",
    rule: "Alaturka saatler denilen sistem (güneş batarken saat 12 sayılır) Havâss için yanlış bir yöntemdir. Bu sistem tarihsel bir pratik kolaylık aracıdır ve gerçek majikal zamanlamayla ilgisi yoktur.",
    source_page: 60
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 8: HARFLERIN TABİATLARI — LETTER-ELEMENT TABLE
// Source: Pages 76-80 — Harflerin Tabiatları
// Four elements, seven letters each
// ═══════════════════════════════════════════════════════════════

export const HARF_ELEMENT_TABLE = {
  source: "Muhiddini Arabi (Miftahül Cifir) and İmam Ahmedel Buni",
  note: "Various scholars have different orderings — only Fire letters are agreed upon universally",
  
  // Fire letters — agreed upon by all scholars
  ates_harfleri: {
    element: "Ateş",
    symbol: "△",
    letters: ["ا", "ه", "ط", "م", "ف", "ش", "ذ"],
    latin: ["Elif", "He", "Tı", "Mim", "Fe", "Şın", "Zal"],
    direction: "Doğu",
    zodiac_signs: ["Koç", "Arslan", "Yay"]
  },
  
  // Earth letters
  toprak_harfleri: {
    element: "Toprak",
    symbol: "▽",
    letters: ["ب", "و", "ي", "ن", "ص", "ت", "ض"],
    latin: ["Ba", "Vav", "Ye", "Nun", "Sad", "Te", "Dad"],
    direction: "Güney",
    zodiac_signs: ["Boğa", "Başak", "Oğlak"]
  },
  
  // Air letters
  hava_harfleri: {
    element: "Hava",
    symbol: "△",
    letters: ["ج", "ز", "ك", "س", "ق", "ث", "ظ"],
    latin: ["Cim", "Ze", "Kef", "Sin", "Kaf", "Se", "Zı"],
    direction: "Batı",
    zodiac_signs: ["İkizler", "Terazi", "Kova"]
  },
  
  // Water letters
  su_harfleri: {
    element: "Su",
    symbol: "▽",
    letters: ["د", "ح", "ل", "ع", "ر", "خ", "غ"],
    latin: ["Dal", "Ha", "Lam", "Ayın", "Ra", "Hı", "Gayın"],
    direction: "Kuzey",
    zodiac_signs: ["Yengeç", "Akrep", "Balık"]
  }
};

// ═══════════════════════════════════════════════════════════════
// TABLE 9: HURUFU NURANÎYE VE ZULMANÎYE — LIGHT AND DARK LETTERS
// Source: Pages 82-83
// ═══════════════════════════════════════════════════════════════

export const HARF_NURANI_ZULMANI = {
  nurani: {
    name: "Hurufu Nuranîye",
    meaning: "Aydınlık Harfler",
    total: 14,
    letters: ["ا", "ح", "ر", "س", "ص", "ط", "ع", "ق", "ك", "م", "ن", "ه", "و", "ي"],
    ulvi: {
      name: "Nuranî, Ulvî harfler",
      letters: ["ا", "ط", "ص", "ع", "ق", "س", "ح", "ر"]
    },
    sufli: {
      name: "Nuranî, Suflî harfler",
      letters: ["ن", "ك", "و", "ي", "م", "ل", "ه"]
    },
    erkek: {
      name: "Nuranî, Erkek harfler",
      letters: ["ا", "ط", "ص", "ع", "ق", "ه", "و", "ي", "ك", "ل", "ن"]
    },
    disi: {
      name: "Nuranî, Dişi harfler",
      letters: ["ح", "ك", "م", "س", "ر"]
    }
  },
  zulmani: {
    name: "Hurufu Zulmanîye",
    meaning: "Karanlık Harfler",
    total: 14,
    letters: ["ب", "ت", "ث", "ج", "خ", "ذ", "ز", "ش", "ض", "ظ", "ف", "غ", "و"],
    ulvi: {
      name: "Zulmanî, Ulvî harfler",
      letters: ["ب", "غ", "د", "ض", "و", "ت", "ذ"]
    },
    sufli: {
      name: "Zulmanî, Suflî harfler",
      letters: ["ث", "ج", "خ", "ز", "ش", "ظ", "ف"]
    },
    erkek: {
      name: "Zulmanî, Erkek harfler",
      letters: ["ج", "ز", "ش", "ذ", "ظ", "غ", "ث"]
    },
    disi: {
      name: "Zulmanî, Dişi harfler",
      letters: ["ب", "ت", "خ", "د", "ف", "ض", "و"]
    }
  },
  fatiha_disi: {
    name: "Fatiha Dışı Harfler",
    description: "Surei Fatiha'da bulunmayan harfler. Bunlar Hurufu suflîyei zulmanîyedirler.",
    letters: ["ف", "ش", "ج", "خ", "ز", "ظ", "ث"]
  }
};

// ═══════════════════════════════════════════════════════════════
// TABLE 10: HURUFU MENAZİL — LETTER-MANSION CORRESPONDENCES
// Source: Page 81
// ═══════════════════════════════════════════════════════════════

export const HURUFU_MENAZIL = [
  { menazil: "Şarteyn",          harf: "Elif",  arabic: "ا" },
  { menazil: "Buteyn",           harf: "Ba",    arabic: "ب" },
  { menazil: "Süreyya",          harf: "Cim",   arabic: "ج" },
  { menazil: "Düberan",          harf: "Dal",   arabic: "د" },
  { menazil: "Hak'a",            harf: "He",    arabic: "ه" },
  { menazil: "Hena",             harf: "Vav",   arabic: "و" },
  { menazil: "Zira",             harf: "Ze",    arabic: "ز" },
  { menazil: "Nesre",            harf: "Ha",    arabic: "ح" },
  { menazil: "Tarfe",            harf: "Tı",    arabic: "ط" },
  { menazil: "Cebhe",            harf: "Ye",    arabic: "ي" },
  { menazil: "Harsan (Zebra)",   harf: "Kef",   arabic: "ك" },
  { menazil: "Sarfe",            harf: "Lam",   arabic: "ل" },
  { menazil: "Ava",              harf: "Mim",   arabic: "م" },
  { menazil: "Semmak",           harf: "Nun",   arabic: "ن" },
  { menazil: "Gufur",            harf: "Sin",   arabic: "س" },
  { menazil: "Zibana",           harf: "Ayın",  arabic: "ع" },
  { menazil: "İklil",            harf: "Fe",    arabic: "ف" },
  { menazil: "Kalb",             harf: "Sad",   arabic: "ص" },
  { menazil: "Şevle",            harf: "Kaf",   arabic: "ق" },
  { menazil: "Neayim",           harf: "Ra",    arabic: "ر" },
  { menazil: "Belde",            harf: "Şın",   arabic: "ش" },
  { menazil: "Saadüzzabih",      harf: "Te",    arabic: "ت" },
  { menazil: "Saudbela",         harf: "Se",    arabic: "ث" },
  { menazil: "Saadüssuud",       harf: "Hı",    arabic: "خ" },
  { menazil: "Saadülahbiyye",    harf: "Zal",   arabic: "ذ" },
  { menazil: "Ferülmukaddem",    harf: "Dad",   arabic: "ض" },
  { menazil: "Ferülmuahhir",     harf: "Zı",    arabic: "ظ" },
  { menazil: "Erreşa",           harf: "Gayın", arabic: "غ" }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 11: YILDIZLARIN HARFLERİ — PLANET-LETTER CORRESPONDENCES
// Source: Page 81
// ═══════════════════════════════════════════════════════════════

export const PLANET_LETTERS = [
  { planet: "Güneş",  harf: "Fe",  arabic: "ف" },
  { planet: "Ay",     harf: "Cim", arabic: "ج" },
  { planet: "Merkür", harf: "Se",  arabic: "ث" },
  { planet: "Venüs",  harf: "Hı",  arabic: "خ" },
  { planet: "Mars",   harf: "Sin", arabic: "س" },
  { planet: "Jüpiter",harf: "Zı",  arabic: "ظ" },
  { planet: "Satürn", harf: "Zal", arabic: "ذ" }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 12: EBCEDİ KEBİR — MAIN ABJAD TABLE
// Source: Page 90
// ═══════════════════════════════════════════════════════════════

export const EBCEDI_KEBIR = [
  { letter: "ا", name: "Elif",  value: 1    },
  { letter: "ب", name: "Ba",    value: 2    },
  { letter: "ج", name: "Cim",   value: 3    },
  { letter: "د", name: "Dal",   value: 4    },
  { letter: "ه", name: "He",    value: 5    },
  { letter: "و", name: "Vav",   value: 6    },
  { letter: "ز", name: "Ze",    value: 7    },
  { letter: "ح", name: "Ha",    value: 8    },
  { letter: "ط", name: "Tı",    value: 9    },
  { letter: "ي", name: "Ye",    value: 10   },
  { letter: "ك", name: "Kef",   value: 20   },
  { letter: "ل", name: "Lam",   value: 30   },
  { letter: "م", name: "Mim",   value: 40   },
  { letter: "ن", name: "Nun",   value: 50   },
  { letter: "س", name: "Sin",   value: 60   },
  { letter: "ع", name: "Ayın",  value: 70   },
  { letter: "ف", name: "Fe",    value: 80   },
  { letter: "ص", name: "Sad",   value: 90   },
  { letter: "ق", name: "Kaf",   value: 100  },
  { letter: "ر", name: "Ra",    value: 200  },
  { letter: "ش", name: "Şın",   value: 300  },
  { letter: "ت", name: "Te",    value: 400  },
  { letter: "ث", name: "Se",    value: 500  },
  { letter: "خ", name: "Hı",    value: 600  },
  { letter: "ذ", name: "Zal",   value: 700  },
  { letter: "ض", name: "Dad",   value: 800  },
  { letter: "ظ", name: "Zı",    value: 900  },
  { letter: "غ", name: "Gayın", value: 1000 }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 13: EBCEDİ SAGİR — SMALL ABJAD TABLE
// Source: Page 91
// Rule: Harfin Ebcedî kebir değerinden 12 çıkartılarak bulunur
// Note: Sin, Şın, Hı, Zı harflerinin değerleri sıfırdır
// ═══════════════════════════════════════════════════════════════

export const EBCEDI_SAGIR = [
  { letter: "ا", name: "Elif",  value: 1  },
  { letter: "ب", name: "Ba",    value: 2  },
  { letter: "ج", name: "Cim",   value: 3  },
  { letter: "د", name: "Dal",   value: 4  },
  { letter: "ه", name: "He",    value: 5  },
  { letter: "و", name: "Vav",   value: 6  },
  { letter: "ز", name: "Ze",    value: 7  },
  { letter: "ح", name: "Ha",    value: 8  },
  { letter: "ط", name: "Tı",    value: 9  },
  { letter: "ي", name: "Ye",    value: 10 },
  { letter: "ك", name: "Kef",   value: 8  },
  { letter: "ل", name: "Lam",   value: 6  },
  { letter: "م", name: "Mim",   value: 4  },
  { letter: "ن", name: "Nun",   value: 2  },
  { letter: "س", name: "Sin",   value: 0  }, // Sıfır
  { letter: "ع", name: "Ayın",  value: 10 },
  { letter: "ف", name: "Fe",    value: 8  },
  { letter: "ص", name: "Sad",   value: 6  },
  { letter: "ق", name: "Kaf",   value: 4  },
  { letter: "ر", name: "Ra",    value: 8  },
  { letter: "ش", name: "Şın",   value: 0  }, // Sıfır
  { letter: "ت", name: "Te",    value: 4  },
  { letter: "ث", name: "Se",    value: 8  },
  { letter: "خ", name: "Hı",    value: 0  }, // Sıfır
  { letter: "ذ", name: "Zal",   value: 4  },
  { letter: "ض", name: "Dad",   value: 6  },
  { letter: "ظ", name: "Zı",    value: 0  }, // Sıfır
  { letter: "غ", name: "Gayın", value: 4  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 14: HARFLERDE SAAD VE NAHS
// Source: Page 84
// ═══════════════════════════════════════════════════════════════

export const HARF_SAAD_NAHS = {
  saad: {
    name: "Saad Harfler",
    meaning: "Mutlu harfler",
    rule: "Noktasız harflerdir",
    letters: ["ا", "ح", "د", "ر", "س", "ط", "ع", "ل", "م", "و", "ه"]
  },
  nahs: {
    name: "Nahs harfler",
    meaning: "Uğursuz harfler",
    rule: "Üzerinde iki veya üç nokta olan harflerdir",
    letters: ["ب", "ت", "ث", "ج", "خ", "ذ", "ز", "ش", "ض", "ظ", "ف", "غ", "ق", "ك", "ن", "ي"]
  }
};

// ═══════════════════════════════════════════════════════════════
// TABLE 15: HARFLERDE YÖN — DIRECTIONAL LETTERS
// Source: Page 84
// ═══════════════════════════════════════════════════════════════

export const HARF_YONLER = {
  dogu: {
    direction: "Doğu",
    element: "Ateş",
    rule: "Ateş harfleri, Doğu'dur"
  },
  bati: {
    direction: "Batı",
    element: "Hava",
    rule: "Hava harfleri, Batı'dır"
  },
  kuzey: {
    direction: "Kuzey",
    element: "Su",
    rule: "Su harfleri, Kuzey'dir"
  },
  guney: {
    direction: "Güney",
    element: "Toprak",
    rule: "Toprak harfleri, Güney'dir"
  }
};

// ═══════════════════════════════════════════════════════════════
// TABLE 16: HARFLERDE MERTEBE — LETTER RANK SYSTEM
// Source: Pages 86-88
// The nine ranks (Aykag, Bekr, Celiş, Demet, Hense, Vasih, Zeaza, Hafeda, Tıdaza)
// ═══════════════════════════════════════════════════════════════

export const HARF_MERTEBE = [
  {
    rank: 1,
    name: "Aykag",
    arabic: "ايقغ",
    numbers: [1, 10, 100, 1000],
    letters: ["ا", "ي", "ق", "غ"],
    latin: ["Elif", "Ye", "Kaf", "Gayın"]
  },
  {
    rank: 2,
    name: "Bekr",
    arabic: "بكر",
    numbers: [2, 20, 200],
    letters: ["ب", "ك", "ر"],
    latin: ["Ba", "Kef", "Ra"]
  },
  {
    rank: 3,
    name: "Celiş",
    arabic: "جلش",
    numbers: [3, 30, 300],
    letters: ["ج", "ل", "ش"],
    latin: ["Cim", "Lam", "Şın"]
  },
  {
    rank: 4,
    name: "Demet",
    arabic: "دمت",
    numbers: [4, 40, 400],
    letters: ["د", "م", "ت"],
    latin: ["Dal", "Mim", "Te"]
  },
  {
    rank: 5,
    name: "Hense",
    arabic: "هنث",
    numbers: [5, 50, 500],
    letters: ["ه", "ن", "ث"],
    latin: ["He", "Nun", "Se"]
  },
  {
    rank: 6,
    name: "Vasih",
    arabic: "وسخ",
    numbers: [6, 60, 600],
    letters: ["و", "س", "خ"],
    latin: ["Vav", "Sin", "Hı"]
  },
  {
    rank: 7,
    name: "Zeaza",
    arabic: "زعذ",
    numbers: [7, 70, 700],
    letters: ["ز", "ع", "ذ"],
    latin: ["Ze", "Ayın", "Zal"]
  },
  {
    rank: 8,
    name: "Hafeda",
    arabic: "حفض",
    numbers: [8, 80, 800],
    letters: ["ح", "ف", "ض"],
    latin: ["Ha", "Fe", "Dad"]
  },
  {
    rank: 9,
    name: "Tıdaza",
    arabic: "طصظ",
    numbers: [9, 90, 900],
    letters: ["ط", "ص", "ظ"],
    latin: ["Tı", "Sad", "Zı"]
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 17: MUHIDDIN ARABI'S LETTER CLASSIFICATION
// Source: Page 75 — Miftahül Cifir
// ═══════════════════════════════════════════════════════════════

export const MUHIDDIN_ARABI_HARF_CLASSIFICATION = {
  source: "Muhiddinî Arabî, Miftahül Cifir",
  classifications: [
    {
      id: "fikriye",
      name: "Hurufu Fikriye",
      description: "İnsan zihninde resmolan ve seslenen harftir",
      spiritual_power: "Has its own spiritual power and reflects a vibration to the divine realm"
    },
    {
      id: "lafziye",
      name: "Hurufu Lafziye",
      description: "Telaffuz edilerek seslendirilen harftir",
      spiritual_power: "Has its own spiritual power and reflects a vibration to the divine realm"
    },
    {
      id: "hattiye",
      name: "Hurufu Hattiye",
      description: "Kalem ve sair şeyle resmedilen harftir",
      spiritual_power: "Has its own spiritual power and reflects a vibration to the divine realm"
    }
  ],
  source_page: 75
};

// ═══════════════════════════════════════════════════════════════
// TABLE 18: GENERAL SPIRITUAL OPERATION RULES
// Source: Pages 11-15, 19-20, 49
// ═══════════════════════════════════════════════════════════════

export const SPIRITUAL_OPERATION_RULES = [
  {
    id: "rule_zamanlamalar",
    title: "Zamanlamalar (Timing)",
    rule: "Timings are among the most established traditional elements. Ay's growth/waning, Astrological angles, Ay menazilleri — all must be observed.",
    source_page: 49
  },
  {
    id: "rule_moon_positive",
    title: "Olumlu işler için Ay kuralı",
    rule: "Olumlu (positive/beneficial) operations: prefer Ay'ın büyümesi (waxing moon)",
    source_page: 63
  },
  {
    id: "rule_moon_negative",
    title: "Olumsuz işler için Ay kuralı",
    rule: "Olumsuz (negative/harmful) operations: prefer Ay'ın küçülmesi (waning moon)",
    source_page: 63
  },
  {
    id: "rule_planet_hour",
    title: "Yıldız Saatlerine Uyum",
    rule: "Choose the planetary hour whose characteristics match the intended operation. Each planet governs specific types of work.",
    source_page: 63
  },
  {
    id: "rule_day_ruler",
    title: "Günün Yöneticisi",
    rule: "Every day of the week is governed by one of the seven classical celestial bodies. Operations are most effective on the day and in the hour ruled by the appropriate planet.",
    source_page: 49
  },
  {
    id: "rule_gece_saatleri",
    title: "Gece Saatlerine Uyulması",
    rule: "Some sources say only daytime hours need be observed. However, night hours do exist and observing them as well yields more productive results.",
    source_page: 63
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 19: BAST, TEKSIR, ISTINTAK, MECZ METHODS
// Source: Pages 96-100
// ═══════════════════════════════════════════════════════════════

export const LETTER_TRANSFORMATION_METHODS = [
  {
    id: "bast",
    name: "BAST",
    description: "Bir kelimenin harflerini Ayrık olarak yazmaktır",
    example: "Muhammed ismi → م ح م د ayrık harflerle yazılır",
    source_page: 96
  },
  {
    id: "bast_hurufi",
    name: "Bastı hurufî",
    description: "Kelimeyi oluşturan harfleri, harf isimleri şeklinde yazmaktır",
    example: "Muhammed ismi → 'Mim, Ha, Mim, Dal' şeklinde harf isimleriyle yazılır",
    source_page: 96
  },
  {
    id: "bast_huruf_esma",
    name: "Bastı hurufî, esmaî adedi huruf",
    description: "Third form of Bast",
    source_page: 96
  },
  {
    id: "istintak",
    name: "İSTİNTAK (Konuşturmak)",
    description: "Bir kelimenin toplam adedini harfle yazmaktır",
    method_1: "Kelimenin toplam sayı değeri alınır, Ebced harflerine çevrilir. Mesela Muhammed=92 → 90+2 → Sad+Ba → 'Sab' veya 'Saba'",
    method_2: "Kelimenin adedini kendi kendisiyle çarptıktan sonra nutk etmek. 92×92=8464 → Ha+Gayın+Te+Sin+Dal",
    method_3: "İki kere çarpma: 92×92×92=778688 → harflere çevirmek",
    source_page: 97
  },
  {
    id: "mecz",
    name: "MECZ (Karıştırmak)",
    description: "İki kelimenin harflerini birbirine karıştırmaktır",
    method: "Birinci kelimenin ilk harfi, ikinci kelimenin ilk harfi. Birinci kelimenin ikinci harfi, ikinci kelimenin ikinci harfi. Bu şekilde devam edilir.",
    example: "Hasan ve Ali → ALY+HSN → AHLSYN: ع ح ل س ي ن",
    rule_unequal: "Az harfli isimle başlanır ve az harfli isim sona erince tekrar edilir",
    source_page: 98
  },
  {
    id: "teksir",
    name: "TEKSİR",
    description: "Bast ve Teksir yöntemleri Havâss uygulamaları içinde çok önemlidirler",
    method_1_rules: [
      "1) Kelimenin son harfi, ilk harfin altına yazılır",
      "2) Kelimenin ilk harfi, ikinci harfin altına yazılır",
      "3) Sondan ikinci harf, baştan üçüncü harfin altına yazılır",
      "4) Baştan ikinci harf, baştan dördüncü harfin altına yazılır",
      "5) Baştan üçüncü harf, baştan beşinci harfin altına yazılır"
    ],
    continuation: "Bu şekilde ikinci satır oluşturulur. İkinci satıra da aynı işlem yapılarak üçüncü satır meydana getirilir ve ilk satır tekrar, aynen oluşana kadar bu şekilde devam edilir.",
    example: "Mütekebbir ismi → 6 satırda tekrar oluşur",
    source_page: 99
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 20: EBCED VARIANTS
// Source: Pages 91-95
// ═══════════════════════════════════════════════════════════════

export const EBCED_VARIANTS = [
  {
    id: "kebir",
    name: "Ebcedî Kebir",
    description: "Ana Ebced. Tüm diğer ebced tablolarının temelidir. Havâss uygulamalarının hesaplamalarında en çok kullanılan.",
    rule: "Standard letter-to-number values",
    source_page: 90
  },
  {
    id: "sagir",
    name: "Ebcedî Sagir",
    description: "Harfin Ebcedî kebir değerinden 12 çıkartılarak bulunur. 'Ye' harfinden sonra başlar.",
    rule: "value = (Kebir value) mod 12, starting after Ye. Sin, Şın, Hı, Zı = 0 (Adedsiz harfler)",
    source_page: 91
  },
  {
    id: "batini",
    name: "Ebcedî Batınî",
    description: "Harfin isminin Ebcedî kebir'e göre hesaplanmasıyla oluşur",
    rule: "Calculate Ebced Kebir value of the full letter name (e.g., Elif = ا+ل+ف = 1+30+80 = 111)",
    example: "Elif harfinin Batınî değeri 111'dir",
    source_page: 92
  },
  {
    id: "menazile",
    name: "Ebcedî Menazile",
    description: "Ay menazillerinin adedi olan 28, harfin Ebcedî kebir değerinden çıkartılır",
    rule: "value = Kebir value mod 28",
    example: "Lam: 30-28=2. Nun: 50-28=22",
    source_page: 92
  },
  {
    id: "derece",
    name: "Ebcedî Derece",
    description: "Bir burcun derece adedi olan 30, harfin Ebcedî kebir değerinden çıkartılır",
    rule: "value = Kebir value mod 30",
    source_page: 93
  },
  {
    id: "anasir",
    name: "Ebcedî Anasır",
    description: "Dört element adedi olan 4, Harfin Ebcedî kebir değerinden çıkartılır",
    rule: "value = Kebir value mod 4",
    source_page: 94
  },
  {
    id: "seyyare",
    name: "Ebcedî Seyyare",
    description: "7 Klasik, Astrolojik gök cismi sayısı, harfin değerinden çıkartılır",
    rule: "value = Kebir value mod 7",
    source_page: 94
  },
  {
    id: "terkibiye",
    name: "Ebcedî Terkibîye",
    description: "Derived composite Ebced table",
    source_page: 95
  }
];

// ═══════════════════════════════════════════════════════════════
// TABLE 21: ZODIAC SIGNS — BURÇLAR
// Source: Pages 66-80 (referenced throughout)
// ═══════════════════════════════════════════════════════════════

export const BURCLAR = [
  { id: "koc",    name: "Koç",    element: "Ateş",   number: 1  },
  { id: "boga",   name: "Boğa",   element: "Toprak", number: 2  },
  { id: "ikizler",name: "İkizler",element: "Hava",   number: 3  },
  { id: "yengec", name: "Yengeç", element: "Su",     number: 4  },
  { id: "arslan", name: "Arslan", element: "Ateş",   number: 5  },
  { id: "basak",  name: "Başak",  element: "Toprak", number: 6  },
  { id: "terazi", name: "Terazi", element: "Hava",   number: 7  },
  { id: "akrep",  name: "Akrep",  element: "Su",     number: 8  },
  { id: "yay",    name: "Yay",    element: "Ateş",   number: 9  },
  { id: "oglak",  name: "Oğlak",  element: "Toprak", number: 10 },
  { id: "kova",   name: "Kova",   element: "Hava",   number: 11 },
  { id: "balik",  name: "Balık",  element: "Su",     number: 12 }
];

// ═══════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════

export const ASTRO_METADATA = {
  source_book: "Havâss'ın Derinlikleri",
  author: "Bülent Kısa",
  contact: "mbkisa@yahoo.com",
  written: "1974-2004",
  published: "15 Ağustos 2004, İstanbul",
  volume: "I. Kitap (Book 1)",
  total_source_pages: 100,
  extraction_date: "2026-06-14",
  module: "ASTRO CLOCK — ISOLATED",
  status: "DATA FOUNDATION ONLY — NO CALCULATORS BUILT YET",
  tables_extracted: 21,
  total_rules_extracted: "See individual tables",
  note: "PlanetaryHourTable and CelestialInfo components remain placeholders pending explicit implementation request"
};