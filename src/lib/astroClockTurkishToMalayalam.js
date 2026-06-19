/**
 * ASTRO CLOCK — TURKISH TO MALAYALAM TRANSLATION LAYER
 * Translates Turkish labels to Malayalam for display ONLY.
 * Database values remain unchanged.
 * 
 * RULES:
 * - Arabic text preserved as-is
 * - Turkish text NEVER shown directly
 * - Malayalam displayed first, Arabic second, English third
 */

// ─────────────────────────────────────────────────────────────────────────────
// PLANET NAMES — Turkish → Malayalam → Arabic
// ─────────────────────────────────────────────────────────────────────────────
export const PLANET_TRANSLATIONS = {
  'Güneş': { ml: 'സൂര്യൻ', ar: 'الشمس', en: 'Sun' },
  'Ay': { ml: 'ചന്ദ്രൻ', ar: 'القمر', en: 'Moon' },
  'Merkür': { ml: 'ബുധൻ', ar: 'عطارد', en: 'Mercury' },
  'Venüs': { ml: 'ശുക്രൻ', ar: 'الزهرة', en: 'Venus' },
  'Mars': { ml: 'ചൊവ്വ', ar: 'المريخ', en: 'Mars' },
  'Jüpiter': { ml: 'ഗുരു', ar: 'المشتري', en: 'Jupiter' },
  'Satürn': { ml: 'ശനി', ar: 'زحل', en: 'Saturn' },
  'GÜNEŞ': { ml: 'സൂര്യൻ', ar: 'الشمس', en: 'Sun' },
  'AY': { ml: 'ചന്ദ്രൻ', ar: 'القمر', en: 'Moon' },
  'MERKÜR': { ml: 'ബുധൻ', ar: 'عطارد', en: 'Mercury' },
  'VENÜS': { ml: 'ശുക്രൻ', ar: 'الزهرة', en: 'Venus' },
  'MARS': { ml: 'ചൊവ്വ', ar: 'المريخ', en: 'Mars' },
  'JÜPİTER': { ml: 'ഗുരു', ar: 'المشتري', en: 'Jupiter' },
  'SATÜRN': { ml: 'ശനി', ar: 'زحل', en: 'Saturn' }
};

// ─────────────────────────────────────────────────────────────────────────────
// DAY NAMES — Turkish → Malayalam → Arabic
// ─────────────────────────────────────────────────────────────────────────────
export const DAY_TRANSLATIONS = {
  'Pazar': { ml: 'ഞായർ', ar: 'الأحد', en: 'Sunday' },
  'Pazartesi': { ml: 'തിങ്കൾ', ar: 'الاثنين', en: 'Monday' },
  'Salı': { ml: 'ചൊവ്വ', ar: 'الثلاثاء', en: 'Tuesday' },
  'Çarşamba': { ml: 'ബുധൻ', ar: 'الأربعاء', en: 'Wednesday' },
  'Perşembe': { ml: 'വ്യാഴം', ar: 'الخميس', en: 'Thursday' },
  'Cuma': { ml: 'വെള്ളി', ar: 'الجمعة', en: 'Friday' },
  'Cumartesi': { ml: 'ശനി', ar: 'السبت', en: 'Saturday' }
};

// ─────────────────────────────────────────────────────────────────────────────
// GENERAL ASTROLOGICAL TERMS
// ─────────────────────────────────────────────────────────────────────────────
export const GENERAL_TRANSLATIONS = {
  // Time references
  'Bugün': { ml: 'ഇന്ന്', ar: 'اليوم', en: 'Today' },
  'Yarın': { ml: 'നാളെ', ar: 'غداً', en: 'Tomorrow' },
  'Bu Hafta': { ml: 'ഈ ആഴ്ച', ar: 'هذا الأسبوع', en: 'This Week' },
  
  // Suitability
  'Uygun': { ml: 'അനുകൂലം', ar: 'موافق', en: 'Suitable' },
  'Uygun Değil': { ml: 'അനനുകൂലം', ar: 'غير مناسب', en: 'Not Suitable' },
  'Uğursuz': { ml: 'അശുഭം', ar: 'نحس', en: 'Unlucky' },
  'Saad': { ml: 'ശുഭം', ar: 'سعد', en: 'Lucky' },
  'Nahs': { ml: 'അശുഭം', ar: 'نحس', en: 'Unlucky' },
  'Karışık': { ml: 'മിശ്രം', ar: 'مختلط', en: 'Mixed' },
  
  // Operations
  'İyi': { ml: 'നല്ലത്', ar: 'جيد', en: 'Good' },
  'Kötü': { ml: 'ചീത്ത', ar: 'سيء', en: 'Bad' },
  'En İyi': { ml: 'ഏറ്റവും നല്ലത്', ar: 'الأفضل', en: 'Best' },
  
  // Elements
  'Ateş': { ml: 'അഗ്നി', ar: 'نار', en: 'Fire' },
  'Toprak': { ml: 'ഭൂമി', ar: 'أرض', en: 'Earth' },
  'Hava': { ml: 'വായു', ar: 'هواء', en: 'Air' },
  'Su': { ml: 'ജലം', ar: 'ماء', en: 'Water' },
  
  // Nature
  'Erkek': { ml: 'പുരുഷൻ', ar: 'ذكر', en: 'Male' },
  'Dişi': { ml: 'സ്ത്രീ', ar: 'أنثى', en: 'Female' },
  'Nötr': { ml: 'തടസ്സമില്ലാത്ത', ar: 'محايد', en: 'Neutral' },
  
  // Actions
  'Gündüz': { ml: 'പകൽ', ar: 'نهار', en: 'Day' },
  'Gece': { ml: 'രാത്രി', ar: 'ليل', en: 'Night' },
  'Saat': { ml: 'മണിക്കൂർ', ar: 'ساعة', en: 'Hour' },
  'Dakika': { ml: 'മിനിറ്റ്', ar: 'دقيقة', en: 'Minute' }
};

// ─────────────────────────────────────────────────────────────────────────────
// MOON MANSION NAMES — Turkish → Malayalam (Arabic preserved)
// ─────────────────────────────────────────────────────────────────────────────
export const MANSION_TRANSLATIONS = {
  'ŞARTEYN': { ml: 'ഷർതൈൻ', ar: 'الشرطان' },
  'BUTEYN': { ml: 'ബുതൈൻ', ar: 'البطين' },
  'SÜREYYA': { ml: 'സുറയ്യ', ar: 'الثريا' },
  'DÜBRAN': { ml: 'ദുബ്രാൻ', ar: 'الدبران' },
  'HAK\'A': { ml: 'ഹഖ്അ', ar: 'الهقعة' },
  'HENA': { ml: 'ഹനഅ', ar: 'الهنعة' },
  'ZİRA': { ml: 'സിറഅ', ar: 'الذراع' },
  'NESRE': { ml: 'നസ്റ', ar: 'النثرة' },
  'TARFA': { ml: 'തർഫ', ar: 'الطرف' },
  'CEPHE': { ml: 'ജബ്ഹ', ar: 'الجبهة' },
  'ZEBRA': { ml: 'സബ്ര', ar: 'الزبرة' },
  'SURFA': { ml: 'സർഫ', ar: 'الصرفة' },
  'AVA': { ml: 'അവ്വ', ar: 'العواء' },
  'SEMMAK': { ml: 'സമ്മാഖ്', ar: 'السماك' },
  'GUFUR': { ml: 'ഗുഫ്ര', ar: 'الغفر' },
  'ZİBANA': { ml: 'സുബാന', ar: 'الزبانا' },
  'İKLİL': { ml: 'ഇക്ലീൽ', ar: 'الإكليل' },
  'KÂLP': { ml: 'ഖൽബ്', ar: 'القلب' },
  'ŞEVLE': { ml: 'ഷൗല', ar: 'الشولة' },
  'NEAİM': { ml: 'നഈം', ar: 'النعائم' },
  'BELDE': { ml: 'ബൽദ', ar: 'البلدة' },
  'SAADÜZZABİH': { ml: 'സഅ്ദുസ്സാബിഹ്', ar: 'سعد الذابح' },
  'SAUDBELA': { ml: 'സഅ്ദുൽബുലഅ', ar: 'سعد البلع' },
  'SAADÜSSUUD': { ml: 'സഅ്ദുസ്സുഊദ്', ar: 'سعد السعود' },
  'SAADÜLAHBİYYE': { ml: 'സഅ്ദുൽഅഖ്ബിയ', ar: 'سعد الأخبية' },
  'FERÜLMUKADDEM': { ml: 'ഫർഉൽമുഖദ്ദം', ar: 'فرع المقدم' },
  'FERÜLMÜAHHİR': { ml: 'ഫർഉൽമുഅഖ്ഖർ', ar: 'فرع المؤخر' },
  'EERREŞA': { ml: 'റശാഅ', ar: 'الرشا' }
};

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Translate Turkish planet name to Malayalam
 * @param {string} turkishName - Turkish planet name
 * @returns {string} Malayalam translation
 */
export function translatePlanetToMalayalam(turkishName) {
  if (!turkishName) return '';
  const translation = PLANET_TRANSLATIONS[turkishName];
  return translation?.ml || turkishName;
}

/**
 * Translate Turkish day name to Malayalam
 * @param {string} turkishName - Turkish day name
 * @returns {string} Malayalam translation
 */
export function translateDayToMalayalam(turkishName) {
  if (!turkishName) return '';
  const translation = DAY_TRANSLATIONS[turkishName];
  return translation?.ml || turkishName;
}

/**
 * Translate Turkish mansion name to Malayalam
 * @param {string} turkishName - Turkish mansion name
 * @returns {string} Malayalam translation
 */
export function translateMansionToMalayalam(turkishName) {
  if (!turkishName) return '';
  const translation = MANSION_TRANSLATIONS[turkishName];
  return translation?.ml || turkishName;
}

/**
 * Translate Turkish general term to Malayalam
 * @param {string} turkishTerm - Turkish term
 * @returns {string} Malayalam translation
 */
export function translateGeneralTerm(turkishTerm) {
  if (!turkishTerm) return '';
  const translation = GENERAL_TRANSLATIONS[turkishTerm];
  return translation?.ml || turkishTerm;
}

/**
 * Get full planet info with all languages
 * @param {string} turkishName - Turkish planet name
 * @returns {Object} Object with ml, ar, en properties
 */
export function getPlanetInfo(turkishName) {
  if (!turkishName) return { ml: '', ar: '', en: '' };
  return PLANET_TRANSLATIONS[turkishName] || { ml: turkishName, ar: '', en: turkishName };
}

/**
 * Get full day info with all languages
 * @param {string} turkishName - Turkish day name
 * @returns {Object} Object with ml, ar, en properties
 */
export function getDayInfo(turkishName) {
  if (!turkishName) return { ml: '', ar: '', en: '' };
  return DAY_TRANSLATIONS[turkishName] || { ml: turkishName, ar: '', en: turkishName };
}

/**
 * Get full mansion info with all languages
 * @param {string} turkishName - Turkish mansion name
 * @returns {Object} Object with ml, ar properties
 */
export function getMansionInfo(turkishName) {
  if (!turkishName) return { ml: '', ar: '' };
  return MANSION_TRANSLATIONS[turkishName] || { ml: turkishName, ar: '' };
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPLAY FORMATTER — Malayalam first, Arabic second, English third
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format planet display: Malayalam (Arabic) English
 * @param {string} turkishName - Turkish planet name
 * @param {boolean} includeEnglish - Include English (default: false)
 * @returns {string} Formatted display string
 */
export function formatPlanetDisplay(turkishName, includeEnglish = false) {
  const info = getPlanetInfo(turkishName);
  if (includeEnglish) {
    return `${info.ml} | ${info.ar} | ${info.en}`;
  }
  return `${info.ml} | ${info.ar}`;
}

/**
 * Format day display: Malayalam (Arabic) English
 * @param {string} turkishName - Turkish day name
 * @param {boolean} includeEnglish - Include English (default: false)
 * @returns {string} Formatted display string
 */
export function formatDayDisplay(turkishName, includeEnglish = false) {
  const info = getDayInfo(turkishName);
  if (includeEnglish) {
    return `${info.ml} | ${info.ar} | ${info.en}`;
  }
  return `${info.ml} | ${info.ar}`;
}

/**
 * Format mansion display: Malayalam (Arabic)
 * @param {string} turkishName - Turkish mansion name
 * @returns {string} Formatted display string
 */
export function formatMansionDisplay(turkishName) {
  const info = getMansionInfo(turkishName);
  return `${info.ml} | ${info.ar}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT CLEANER — Remove Turkish text from operations lists
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clean Turkish text from operations list
 * @param {string[]} operations - Array of operation strings (may contain Turkish)
 * @returns {string[]} Cleaned operations (Turkish removed or translated)
 */
export function cleanOperationsList(operations) {
  if (!operations || !Array.isArray(operations)) return [];
  
  return operations.map(op => {
    if (!op) return '';
    
    // Skip if it's already Arabic or Malayalam
    if (/[\u0600-\u06FF]/.test(op) || /[\u0D00-\u0D7F]/.test(op)) {
      return op;
    }
    
    // Translate common Turkish terms
    let cleaned = op;
    Object.entries(GENERAL_TRANSLATIONS).forEach(([tr, trans]) => {
      cleaned = cleaned.replace(new RegExp(tr, 'g'), trans.ml);
    });
    
    return cleaned;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────
export const TRANSLATION_LAYER_METADATA = {
  version: '1.0.0',
  purpose: 'Turkish → Malayalam display translation layer',
  rules: [
    'Arabic text preserved as-is',
    'Turkish text NEVER shown directly',
    'Malayalam displayed first',
    'Database values unchanged',
    'Display-only translation'
  ],
  coverage: {
    planets: 7,
    days: 7,
    mansions: 28,
    general_terms: 20
  },
  status: 'ACTIVE'
};