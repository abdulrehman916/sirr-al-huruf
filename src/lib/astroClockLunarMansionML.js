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
  operations_ml: mansion.operations
}));