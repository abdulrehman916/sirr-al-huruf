// ═══════════════════════════════════════════════════════════════════════════
//  PERMANENT BOOK KNOWLEDGE DATABASE — PLANETARY CHAPTERS (COMPLETE)
//  Source: "The Occult Encyclopedia of Magick Squares" — Nineveh Shadrach
//  PDF File: fc8b629f4_...-710-802.pdf
//  Book Pages: 669–761
//  Processed: 2026-06-07
//  Covers:
//    - Mercury planetary chapter continuation (pp.669–673)
//    - Jupiter planetary chapter (pp.674–693)
//    - Mars planetary chapter (pp.694–700)
//    - Sun planetary chapter (pp.701–721)
//    - Venus planetary chapter (pp.722–731)
//    - Mercury planetary chapter (pp.732–749)
//    - Moon planetary chapter (pp.750–761)
//
//  ENTITY TYPES IN PLANETARY CHAPTERS:
//    - Planet Sign (Hebrew name + value)
//    - Archangel
//    - Angel
//    - Intelligence
//    - Spirit
//    - Olympic Spirit
//
//  NOTE: Each entity has:
//    - Hebrew letter square (4×4 or larger)
//    - Hebrew letter square (5×5 or 6×6 for larger entities)
//    - Numerical squares (Fire/Earth/Air/Water for each planetary size)
//    - Full hierarchy table (Usurper/Guide/Mystery/Adjuster/Leader/Regulator/GenGov/HighOverseer)
//    - Angel/Jinn values (Arabic and Hebrew) for each tier
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION A — MERCURY CHAPTER CONTINUATION (pp.669–673)
//  These are the 8×8 Mercury squares and the Moon 9×9 squares that belong
//  to an entity from a prior chapter (Bethor region / continuation).
//  The hierarchy tables on pp.670–673 confirm these are for an entity
//  with Adjuster=858 (8×8 Mercury), confirming MC=858 variant.
// ─────────────────────────────────────────────────────────────────────────────
export const MERCURY_CHAPTER_CONTINUATION = {
  note: "Pages 669–673 continue Mercury/Moon/Saturn squares for an entity with MC=858 (Adjuster=858)",
  page: "669–673",

  // p.669 — Earth/Air/Water Mercury 8×8 (usurper=75, guide=144, Adjuster=858)
  mercury8x8_variant_hierarchy: {
    usurper: 75, guide: 144, mystery: 219,
    adjuster: 858, leader: 2574, regulator: 3432, genGov: 6864, highOverseer: 988416,
    angelArabic: { usurper:34, guide:103, mystery:178, adjuster:817, leader:2533, regulator:3391, genGov:6823, highOverseer:988375 },
    angelHebrew: { usurper:44, guide:113, mystery:188, adjuster:827, leader:2543, regulator:3401, genGov:6833, highOverseer:988385 },
    jinnArabic:  { usurper:116, guide:185, mystery:260, adjuster:539, leader:2255, regulator:3113, genGov:6545, highOverseer:988097 },
    jinnHebrew:  { usurper:106, guide:175, mystery:250, adjuster:529, leader:2245, regulator:3103, genGov:6535, highOverseer:988087 },
  },

  // pp.670–671 — Moon 9×9 squares (Fire/Earth/Air/Water) — Adjuster=858
  moon9x9_fire:  [[99,112,74,83,138,67,103,119,63],[59,102,124,79,95,111,66,88,134],[130,71,87,123,55,107,116,78,91],[126,58,101,110,81,94,133,65,90],[86,132,70,106,122,57,93,115,77],[73,98,114,69,82,137,62,105,118],[72,85,131,56,108,121,76,92,117],[113,75,97,136,68,84,120,61,104],[100,125,60,96,109,80,89,135,64]],
  moon9x9_earth: [[63,134,91,90,77,118,117,104,64],[119,88,78,65,115,105,92,61,135],[103,66,116,133,93,62,76,120,89],[67,111,107,94,57,137,121,84,80],[138,95,55,81,122,82,108,68,109],[83,79,123,110,106,69,56,136,96],[74,124,87,101,70,114,131,97,60],[112,102,71,58,132,98,85,75,125],[99,59,130,126,86,73,72,113,100]],
  moon9x9_air:   [[64,135,89,80,109,96,60,125,100],[104,61,120,84,68,136,97,75,113],[117,92,76,121,108,56,131,85,72],[118,105,62,137,82,69,114,98,73],[77,115,93,57,122,106,70,132,86],[90,65,133,94,81,110,101,58,126],[91,78,116,107,55,123,87,71,130],[134,88,66,111,95,79,124,102,59],[63,119,103,67,138,83,74,112,99]],
  moon9x9_water: [[100,113,72,73,86,126,130,59,99],[125,75,85,98,132,58,71,102,112],[60,97,131,114,70,101,87,124,74],[96,136,56,69,106,110,123,79,83],[109,68,108,82,122,81,55,95,138],[80,84,121,137,57,94,107,111,67],[89,120,76,62,93,133,116,66,103],[135,61,92,105,115,65,78,88,119],[64,104,117,118,77,90,91,134,63]],

  moon9x9_hierarchy_variantA: {
    usurper:55, guide:138, mystery:193,
    adjuster:858, leader:2574, regulator:3432, genGov:6864, highOverseer:947232,
    angelArabic: { usurper:14, guide:97, mystery:152, adjuster:817, leader:2533, regulator:3391, genGov:6823, highOverseer:947191 },
    angelHebrew: { usurper:24, guide:107, mystery:162, adjuster:827, leader:2543, regulator:3401, genGov:6833, highOverseer:947201 },
    jinnArabic:  { usurper:96, guide:179, mystery:234, adjuster:539, leader:2255, regulator:3113, genGov:6545, highOverseer:946913 },
    jinnHebrew:  { usurper:86, guide:169, mystery:224, adjuster:529, leader:2245, regulator:3103, genGov:6535, highOverseer:946903 },
  },

  // pp.672–673 — Saturn 10×10 squares (Fire/Earth/Air/Water/hierarchy)
  saturn10x10_fire:  [[36,54,61,99,90,131,83,75,107,122],[47,111,104,95,133,120,38,80,66,64],[62,67,91,132,121,106,55,43,84,97],[68,93,130,123,56,102,110,51,40,85],[81,129,125,60,71,94,98,108,53,39],[88,45,46,113,101,77,73,63,118,134],[100,82,42,49,115,70,58,119,137,86],[114,103,78,37,48,65,116,136,89,72],[124,57,69,76,44,52,135,87,105,109],[138,117,112,74,79,41,92,96,59,50]],
  saturn10x10_earth: [[138,124,114,100,88,81,68,62,47,36],[117,57,103,82,45,129,93,67,111,54],[112,69,78,42,46,125,130,91,104,61],[74,76,37,49,113,60,123,132,95,99],[79,44,48,115,101,71,56,121,133,90],[41,52,65,70,77,94,102,106,120,131],[92,135,116,58,73,98,110,55,38,83],[96,87,136,119,63,108,51,43,80,75],[59,105,89,137,118,53,40,84,66,107],[50,109,72,86,134,39,85,97,64,122]],
  saturn10x10_air:   [[50,59,96,92,41,79,74,112,117,138],[109,105,87,135,52,44,76,69,57,124],[72,89,136,116,65,48,37,78,103,114],[86,137,119,58,70,115,49,42,82,100],[134,118,63,73,77,101,113,46,45,88],[39,53,108,98,94,71,60,125,129,81],[85,40,51,110,102,56,123,130,93,68],[97,84,43,55,106,121,132,91,67,62],[64,66,80,38,120,133,95,104,111,47],[122,107,75,83,131,90,99,61,54,36]],
  saturn10x10_water: [[122,64,97,85,39,134,86,72,109,50],[107,66,84,40,53,118,137,89,105,59],[75,80,43,51,108,63,119,136,87,96],[83,38,55,110,98,73,58,116,135,92],[131,120,106,102,94,77,70,65,52,41],[90,133,121,56,71,101,115,48,44,79],[99,95,132,123,60,113,49,37,76,74],[61,104,91,130,125,46,42,78,69,112],[54,111,67,93,129,45,82,103,57,117],[36,47,62,68,81,88,100,114,124,138]],

  saturn10x10_hierarchy: {
    usurper:36, guide:138, mystery:174,
    adjuster:858, leader:2574, regulator:3432, genGov:6864, highOverseer:947232,
    angelArabic: { usurper:355, guide:97, mystery:133, adjuster:817, leader:2533, regulator:3391, genGov:6823, highOverseer:947191 },
    angelHebrew: { usurper:5, guide:107, mystery:143, adjuster:827, leader:2543, regulator:3401, genGov:6833, highOverseer:947201 },
    jinnArabic:  { usurper:77, guide:179, mystery:215, adjuster:539, leader:2255, regulator:3113, genGov:6545, highOverseer:946913 },
    jinnHebrew:  { usurper:67, guide:169, mystery:205, adjuster:529, leader:2245, regulator:3103, genGov:6535, highOverseer:946903 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION B — JUPITER PLANETARY CHAPTER (pp.674–693)
// ─────────────────────────────────────────────────────────────────────────────

export const JUPITER_CHAPTER = {
  planet: "Jupiter",
  hebrewName: "Tzedek",
  hebrewValue: 194,
  note: "No Hebrew Squares Available",
  chapterPage: 674,

  // Sign: Jupiter = Tzedek (194)
  sign: {
    name: "Jupiter: Tzedek", hebrewValue: 194,
    note: "No Hebrew Squares Available",
    page: "674",
    jupiterSquare: {
      fire:  [[41,52,46,55],[54,47,49,44],[51,42,56,45],[48,53,43,50]],
      earth: [[48,51,54,41],[53,42,47,52],[43,56,49,46],[50,45,44,55]],
      air:   [[50,43,53,48],[45,56,42,51],[44,49,47,54],[55,46,52,41]],
      water: [[55,44,45,50],[46,49,56,43],[52,47,42,53],[41,54,51,48]],
      hierarchy: { usurper:41, guide:56, mystery:97, adjuster:1552, leader:4656, regulator:6208, genGov:12416, highOverseer:695296 },
      angelArabic: { usurper:360, guide:15, mystery:56, adjuster:1511, leader:4615, regulator:6167, genGov:12375, highOverseer:695255 },
      angelHebrew: { usurper:10, guide:25, mystery:66, adjuster:1521, leader:4625, regulator:6177, genGov:12385, highOverseer:695265 },
      jinnArabic:  { usurper:82, guide:97, mystery:138, adjuster:1233, leader:4337, regulator:5889, genGov:12097, highOverseer:694977 },
      jinnHebrew:  { usurper:72, guide:87, mystery:128, adjuster:1223, leader:4327, regulator:5879, genGov:12087, highOverseer:694967 },
    },
    marsSquare: {
      fire:  [[26,54,44,38,32],[39,33,27,50,45],[51,41,40,34,28],[35,29,52,42,36],[43,37,31,30,53]],
      earth: [[53,30,31,37,43],[36,42,52,29,35],[28,34,40,41,51],[45,50,27,33,39],[32,38,44,54,26]],
      air:   [[43,35,51,39,26],[37,29,41,33,54],[31,52,40,27,44],[30,42,34,50,38],[53,36,28,45,32]],
      water: [[32,45,28,36,53],[38,50,34,42,30],[44,27,40,52,31],[54,33,41,29,37],[26,39,51,35,43]],
      hierarchy: { usurper:26, guide:54, mystery:80, adjuster:194, leader:582, regulator:776, genGov:1552, highOverseer:83808 },
      angelArabic: { usurper:345, guide:13, mystery:39, adjuster:153, leader:541, regulator:735, genGov:1511, highOverseer:83767 },
      angelHebrew: { usurper:355, guide:23, mystery:49, adjuster:163, leader:551, regulator:745, genGov:1521, highOverseer:83777 },
      jinnArabic:  { usurper:67, guide:95, mystery:121, adjuster:235, leader:263, regulator:457, genGov:1233, highOverseer:83489 },
      jinnHebrew:  { usurper:57, guide:85, mystery:111, adjuster:225, leader:253, regulator:447, genGov:1223, highOverseer:83479 },
    },
  },

  archangel: {
    name: "Archangel: Tzadqiel", hebrewValue: 235,
    page: "677",
    hebrewSquare4x4: { numerical: [[89,5,103,38],[102,39,88,6],[3,91,40,101]] },
    hebrewSquare6x6: "letter square present — see PDF p.677",
    jupiterSquare: {
      fire:  [[51,62,56,66],[65,57,59,54],[61,52,67,55],[58,64,53,60]],
      earth: [[58,61,65,51],[64,52,57,62],[53,67,59,56],[60,55,54,66]],
      air:   [[60,53,64,58],[55,67,52,61],[54,59,57,65],[66,56,62,51]],
      water: [[66,54,55,60],[56,59,67,53],[62,57,52,64],[51,65,61,58]],
      hierarchy: { usurper:51, guide:67, mystery:118, adjuster:1880, leader:5640, regulator:7520, genGov:15040, highOverseer:1007680 },
      angelArabic: { usurper:10, guide:26, mystery:77, adjuster:1839, leader:5599, regulator:7479, genGov:14999, highOverseer:1007639 },
      angelHebrew: { usurper:20, guide:36, mystery:87, adjuster:1849, leader:5609, regulator:7489, genGov:15009, highOverseer:1007649 },
      jinnArabic:  { usurper:92, guide:108, mystery:159, adjuster:1561, leader:5321, regulator:7201, genGov:14721, highOverseer:1007361 },
      jinnHebrew:  { usurper:82, guide:98, mystery:149, adjuster:1551, leader:5311, regulator:7191, genGov:14711, highOverseer:1007351 },
    },
    marsSquare: {
      fire:  [[35,59,53,47,41],[48,42,36,55,54],[56,50,49,43,37],[44,38,57,51,45],[52,46,40,39,58]],
      earth: [[58,39,40,46,52],[45,51,57,38,44],[37,43,49,50,56],[54,55,36,42,48],[41,47,53,59,35]],
      air:   [[52,44,56,48,35],[46,38,50,42,59],[40,57,49,36,53],[39,51,43,55,47],[58,45,37,54,41]],
      water: [[41,54,37,45,58],[47,55,43,51,39],[53,36,49,57,40],[59,42,50,38,46],[35,48,56,44,52]],
      hierarchy: { usurper:35, guide:59, mystery:94, adjuster:235, leader:705, regulator:940, genGov:1880, highOverseer:110920 },
      angelArabic: { usurper:354, guide:18, mystery:53, adjuster:194, leader:664, regulator:899, genGov:1839, highOverseer:110879 },
      angelHebrew: { usurper:4, guide:28, mystery:63, adjuster:204, leader:674, regulator:909, genGov:1849, highOverseer:110889 },
      jinnArabic:  { usurper:76, guide:100, mystery:135, adjuster:276, leader:386, regulator:621, genGov:1561, highOverseer:110601 },
      jinnHebrew:  { usurper:66, guide:90, mystery:125, adjuster:266, leader:376, regulator:611, genGov:1551, highOverseer:110591 },
    },
    sunSquare_fire:  [[21,32,56,38,42,46],[27,37,48,55,25,43],[33,59,41,31,47,24],[44,23,34,49,28,57],[50,39,30,22,58,36],[60,45,26,40,35,29]],
    sunSquare_air:   [[29,35,40,26,45,60],[36,58,22,30,39,50],[57,28,49,34,23,44],[24,47,31,41,59,33],[43,25,55,48,37,27],[46,42,38,56,32,21]],
    sunSquare_earth: [[60,50,44,33,27,21],[45,39,23,59,37,32],[26,30,34,41,48,56],[40,22,49,31,55,38],[35,58,28,47,25,42],[29,36,57,24,43,46]],
    sunSquare_water: [[46,43,24,57,36,29],[42,25,47,28,58,35],[38,55,31,49,22,40],[56,48,41,34,30,26],[32,37,59,23,39,45],[21,27,33,44,50,60]],
    sunHierarchy: { usurper:21, guide:60, mystery:81, adjuster:235, leader:705, regulator:940, genGov:1880, highOverseer:112800 },
    sunAngelArabic: { usurper:340, guide:19, mystery:40, adjuster:194, leader:664, regulator:899, genGov:1839, highOverseer:112759 },
    sunAngelHebrew: { usurper:350, guide:29, mystery:50, adjuster:204, leader:674, regulator:909, genGov:1849, highOverseer:112769 },
    sunJinnArabic:  { usurper:62, guide:101, mystery:122, adjuster:276, leader:386, regulator:621, genGov:1561, highOverseer:112481 },
    sunJinnHebrew:  { usurper:52, guide:91, mystery:112, adjuster:266, leader:376, regulator:611, genGov:1551, highOverseer:112471 },
    venusSquare_fire:  [[9,50,35,20,40,57,24],[58,25,10,44,36,21,41],[22,42,59,26,11,45,30],[46,31,16,43,60,27,12],[28,13,47,32,17,37,61],[38,55,29,14,48,33,18],[34,19,39,56,23,15,49]],
    venusSquare_air:   [[49,15,23,56,39,19,34],[18,33,48,14,29,55,38],[61,37,17,32,47,13,28],[12,27,60,43,16,31,46],[30,45,11,26,59,42,22],[41,21,36,44,10,25,58],[24,57,40,20,35,50,9]],
    venusSquare_earth: [[34,38,28,46,22,58,9],[19,55,13,31,42,25,50],[39,29,47,16,59,10,35],[56,14,32,43,26,44,20],[23,48,17,60,11,36,40],[15,33,37,27,45,21,57],[49,18,61,12,30,41,24]],
    venusSquare_water: [[24,41,30,12,61,18,49],[57,21,45,27,37,33,15],[40,36,11,60,17,48,23],[20,44,26,43,32,14,56],[35,10,59,16,47,29,39],[50,25,42,31,13,55,19],[9,58,22,46,28,38,34]],
    venusHierarchy: { usurper:9, guide:61, mystery:70, adjuster:235, leader:705, regulator:940, genGov:1880, highOverseer:114680 },
    venusAngelArabic: { usurper:328, guide:20, mystery:29, adjuster:194, leader:664, regulator:899, genGov:1839, highOverseer:114639 },
    venusAngelHebrew: { usurper:338, guide:30, mystery:39, adjuster:204, leader:674, regulator:909, genGov:1849, highOverseer:114649 },
    venusJinnArabic:  { usurper:50, guide:102, mystery:111, adjuster:276, leader:386, regulator:621, genGov:1561, highOverseer:114361 },
    venusJinnHebrew:  { usurper:40, guide:92, mystery:101, adjuster:266, leader:376, regulator:611, genGov:1551, highOverseer:114351 },
  },

  angel: {
    name: "Angel: Sachiel", hebrewValue: 109,
    page: "681",
    hebrewSquare4x4: { numerical: [[59,9,13,28],[12,29,58,10],[7,61,30,11]] },
    hebrewSquare5x5: "letter square present — see PDF p.681",
    jupiterSquare: {
      fire:  [[19,30,24,36],[35,25,27,22],[29,20,37,23],[26,34,21,28]],
      earth: [[26,29,35,19],[34,20,25,30],[21,37,27,24],[28,23,22,36]],
      air:   [[28,21,34,26],[23,37,20,29],[22,27,25,35],[36,24,30,19]],
      water: [[36,22,23,28],[24,27,37,21],[30,25,20,34],[19,35,29,26]],
      hierarchy_4x4: { usurper:19, guide:37, mystery:56, adjuster:872, leader:2616, regulator:3488, genGov:6976, highOverseer:258112 },
      angelArabic_4x4: { usurper:338, guide:356, mystery:15, adjuster:831, leader:2575, regulator:3447, genGov:6935, highOverseer:258071 },
      angelHebrew_4x4: { usurper:348, guide:6, mystery:25, adjuster:841, leader:2585, regulator:3457, genGov:6945, highOverseer:258081 },
      jinnArabic_4x4:  { usurper:60, guide:78, mystery:97, adjuster:553, leader:2297, regulator:3169, genGov:6657, highOverseer:257793 },
      jinnHebrew_4x4:  { usurper:50, guide:68, mystery:87, adjuster:543, leader:2287, regulator:3159, genGov:6647, highOverseer:257783 },
    },
    marsSquare: {
      fire:  [[9,37,27,21,15],[22,16,10,33,28],[34,24,23,17,11],[18,12,35,25,19],[26,20,14,13,36]],
      earth: [[36,13,14,20,26],[19,25,35,12,18],[11,17,23,24,34],[28,33,10,16,22],[15,21,27,37,9]],
      air:   [[26,18,34,22,9],[20,12,24,16,37],[14,35,23,10,27],[13,25,17,33,21],[36,19,11,28,15]],
      water: [[15,28,11,19,36],[21,33,17,25,13],[27,10,23,35,14],[37,16,24,12,20],[9,22,34,18,26]],
      hierarchy: { usurper:9, guide:37, mystery:46, adjuster:109, leader:327, regulator:436, genGov:872, highOverseer:32264 },
      angelArabic: { usurper:328, guide:356, mystery:5, adjuster:68, leader:286, regulator:395, genGov:831, highOverseer:32223 },
      angelHebrew: { usurper:338, guide:6, mystery:15, adjuster:78, leader:296, regulator:405, genGov:841, highOverseer:32233 },
      jinnArabic:  { usurper:50, guide:78, mystery:87, adjuster:150, leader:8, regulator:117, genGov:553, highOverseer:31945 },
      jinnHebrew:  { usurper:40, guide:68, mystery:77, adjuster:140, leader:358, regulator:107, genGov:543, highOverseer:31935 },
    },
  },

  intelligence: {
    name: "Intelligence: Iophiel", hebrewValue: 136,
    page: "683",
    hebrewSquare4x4: { numerical: [[9,6,83,38],[82,39,8,7],[4,11,40,81]] },
    hebrewSquare6x6: "letter square present — see PDF p.683",
    jupiterSquare: {
      fire:  [[26,37,31,42],[41,32,34,29],[36,27,43,30],[33,40,28,35]],
      earth: [[33,36,41,26],[40,27,32,37],[28,43,34,31],[35,30,29,42]],
      air:   [[35,28,40,33],[30,43,27,36],[29,34,32,41],[42,31,37,26]],
      water: [[42,29,30,35],[31,34,43,28],[37,32,27,40],[26,41,36,33]],
      hierarchy: { usurper:26, guide:43, mystery:69, adjuster:1088, leader:3264, regulator:4352, genGov:8704, highOverseer:374272 },
      angelArabic: { usurper:345, guide:2, mystery:28, adjuster:1047, leader:3223, regulator:4311, genGov:8663, highOverseer:374231 },
      angelHebrew: { usurper:355, guide:12, mystery:38, adjuster:1057, leader:3233, regulator:4321, genGov:8673, highOverseer:374241 },
      jinnArabic:  { usurper:67, guide:84, mystery:110, adjuster:769, leader:2945, regulator:4033, genGov:8385, highOverseer:373953 },
      jinnHebrew:  { usurper:57, guide:74, mystery:100, adjuster:759, leader:2935, regulator:4023, genGov:8375, highOverseer:373943 },
    },
    marsSquare: {
      fire:  [[15,40,33,27,21],[28,22,16,36,34],[37,30,29,23,17],[24,18,38,31,25],[32,26,20,19,39]],
      earth: [[39,19,20,26,32],[25,31,38,18,24],[17,23,29,30,37],[34,36,16,22,28],[21,27,33,40,15]],
      air:   [[32,24,37,28,15],[26,18,30,22,40],[20,38,29,16,33],[19,31,23,36,27],[39,25,17,34,21]],
      water: [[21,34,17,25,39],[27,36,23,31,19],[33,16,29,38,20],[40,22,30,18,26],[15,28,37,24,32]],
      hierarchy: { usurper:15, guide:40, mystery:55, adjuster:136, leader:408, regulator:544, genGov:1088, highOverseer:43520 },
      angelArabic: { usurper:334, guide:359, mystery:14, adjuster:95, leader:367, regulator:503, genGov:1047, highOverseer:43479 },
      angelHebrew: { usurper:344, guide:9, mystery:24, adjuster:105, leader:377, regulator:513, genGov:1057, highOverseer:43489 },
      jinnArabic:  { usurper:56, guide:81, mystery:96, adjuster:177, leader:89, regulator:225, genGov:769, highOverseer:43201 },
      jinnHebrew:  { usurper:46, guide:71, mystery:86, adjuster:167, leader:79, regulator:215, genGov:759, highOverseer:43191 },
    },
    sunSquare: {
      fire:  [[5,16,37,22,26,30],[11,21,32,36,9,27],[17,40,25,15,31,8],[28,7,18,33,12,38],[34,23,14,6,39,20],[41,29,10,24,19,13]],
      earth: [[41,34,28,17,11,5],[29,23,7,40,21,16],[10,14,18,25,32,37],[24,6,33,15,36,22],[19,39,12,31,9,26],[13,20,38,8,27,30]],
      air:   [[13,19,24,10,29,41],[20,39,6,14,23,34],[38,12,33,18,7,28],[8,31,15,25,40,17],[27,9,36,32,21,11],[30,26,22,37,16,5]],
      water: [[30,27,8,38,20,13],[26,9,31,12,39,19],[22,36,15,33,6,24],[37,32,25,18,14,10],[16,21,40,7,23,29],[5,11,17,28,34,41]],
      hierarchy: { usurper:5, guide:41, mystery:46, adjuster:136, leader:408, regulator:544, genGov:1088, highOverseer:44608 },
      angelArabic: { usurper:324, guide:360, mystery:5, adjuster:95, leader:367, regulator:503, genGov:1047, highOverseer:44567 },
      angelHebrew: { usurper:334, guide:10, mystery:15, adjuster:105, leader:377, regulator:513, genGov:1057, highOverseer:44577 },
      jinnArabic:  { usurper:46, guide:82, mystery:87, adjuster:177, leader:89, regulator:225, genGov:769, highOverseer:44289 },
      jinnHebrew:  { usurper:36, guide:72, mystery:77, adjuster:167, leader:79, regulator:215, genGov:759, highOverseer:44279 },
    },
  },

  spirit: {
    name: "Spirit: Hismael", hebrewValue: 136,
    note: "Numerical Squares See Page: 683",
    page: "685",
    hebrewSquare4x4: { numerical: [[4,61,43,28],[42,29,3,62],[59,6,30,41]] },
    hebrewSquare5x5: "letter square present — see PDF p.685",
  },

  olympicSpirit: {
    name: "Olympic Spirit: Bethor", hebrewValue: 618,
    page: "686",
    hebrewSquare4x4: { numerical: [[11,401,9,197],[8,198,10,402],[399,13,199,7]] },
    hebrewSquare5x5: "letter square present — see PDF p.686",
    jupiterSquare: {
      fire:  [[147,158,152,161],[160,153,155,150],[157,148,162,151],[154,159,149,156]],
      earth: [[154,157,160,147],[159,148,153,158],[149,162,155,152],[156,151,150,161]],
      air:   [[156,149,159,154],[151,162,148,157],[150,155,153,160],[161,152,158,147]],
      water: [[161,150,151,156],[152,155,162,149],[158,153,148,159],[147,160,157,154]],
      hierarchy: { usurper:147, guide:162, mystery:309, adjuster:4944, leader:14832, regulator:19776, genGov:39552, highOverseer:6407424 },
      angelArabic: { usurper:106, guide:121, mystery:268, adjuster:4903, leader:14791, regulator:19735, genGov:39511, highOverseer:6407383 },
      angelHebrew: { usurper:116, guide:131, mystery:278, adjuster:4913, leader:14801, regulator:19745, genGov:39521, highOverseer:6407393 },
      jinnArabic:  { usurper:188, guide:203, mystery:350, adjuster:4625, leader:14513, regulator:19457, genGov:39233, highOverseer:6407105 },
      jinnHebrew:  { usurper:178, guide:193, mystery:340, adjuster:4615, leader:14503, regulator:19447, genGov:39223, highOverseer:6407095 },
    },
    marsSquare: {
      fire:  [[111,138,129,123,117],[124,118,112,134,130],[135,126,125,119,113],[120,114,136,127,121],[128,122,116,115,137]],
      earth: [[137,115,116,122,128],[121,127,136,114,120],[113,119,125,126,135],[130,134,112,118,124],[117,123,129,138,111]],
      air:   [[128,120,135,124,111],[122,114,126,118,138],[116,136,125,112,129],[115,127,119,134,123],[137,121,113,130,117]],
      water: [[117,130,113,121,137],[123,134,119,127,115],[129,112,125,136,116],[138,118,126,114,122],[111,124,135,120,128]],
      hierarchy: { usurper:111, guide:138, mystery:249, adjuster:618, leader:1854, regulator:2472, genGov:4944, highOverseer:682272 },
      angelArabic: { usurper:70, guide:97, mystery:208, adjuster:577, leader:1813, regulator:2431, genGov:4903, highOverseer:682231 },
      angelHebrew: { usurper:80, guide:107, mystery:218, adjuster:587, leader:1823, regulator:2441, genGov:4913, highOverseer:682241 },
      jinnArabic:  { usurper:152, guide:179, mystery:290, adjuster:299, leader:1535, regulator:2153, genGov:4625, highOverseer:681953 },
      jinnHebrew:  { usurper:142, guide:169, mystery:280, adjuster:289, leader:1525, regulator:2143, genGov:4615, highOverseer:681943 },
    },
    sunSquare: {
      fire:  [[85,96,119,102,106,110],[91,101,112,118,89,107],[97,122,105,95,111,88],[108,87,98,113,92,120],[114,103,94,86,121,100],[123,109,90,104,99,93]],
      earth: [[123,114,108,97,91,85],[109,103,87,122,101,96],[90,94,98,105,112,119],[104,86,113,95,118,102],[99,121,92,111,89,106],[93,100,120,88,107,110]],
      air:   [[93,99,104,90,109,123],[100,121,86,94,103,114],[120,92,113,98,87,108],[88,111,95,105,122,97],[107,89,118,112,101,91],[110,106,102,119,96,85]],
      water: [[110,107,88,120,100,93],[106,89,111,92,121,99],[102,118,95,113,86,104],[119,112,105,98,94,90],[96,101,122,87,103,109],[85,91,97,108,114,123]],
      hierarchy: { usurper:85, guide:123, mystery:208, adjuster:618, leader:1854, regulator:2472, genGov:4944, highOverseer:608112 },
      angelArabic: { usurper:44, guide:82, mystery:167, adjuster:577, leader:1813, regulator:2431, genGov:4903, highOverseer:608071 },
      angelHebrew: { usurper:54, guide:92, mystery:177, adjuster:587, leader:1823, regulator:2441, genGov:4913, highOverseer:608081 },
      jinnArabic:  { usurper:126, guide:164, mystery:249, adjuster:299, leader:1535, regulator:2153, genGov:4625, highOverseer:607793 },
      jinnHebrew:  { usurper:116, guide:154, mystery:239, adjuster:289, leader:1525, regulator:2143, genGov:4615, highOverseer:607783 },
    },
    venusSquare: {
      fire:  [[64,105,90,75,95,110,79],[111,80,65,99,91,76,96],[77,97,112,81,66,100,85],[101,86,71,98,113,82,67],[83,68,102,87,72,92,114],[93,108,84,69,103,88,73],[89,74,94,109,78,70,104]],
      earth: [[89,93,83,101,77,111,64],[74,108,68,86,97,80,105],[94,84,102,71,112,65,90],[109,69,87,98,81,99,75],[78,103,72,113,66,91,95],[70,88,92,82,100,76,110],[104,73,114,67,85,96,79]],
      air:   [[104,70,78,109,94,74,89],[73,88,103,69,84,108,93],[114,92,72,87,102,68,83],[67,82,113,98,71,86,101],[85,100,66,81,112,97,77],[96,76,91,99,65,80,111],[79,110,95,75,90,105,64]],
      water: [[79,96,85,67,114,73,104],[110,76,100,82,92,88,70],[95,91,66,113,72,103,78],[75,99,81,98,87,69,109],[90,65,112,71,102,84,94],[105,80,97,86,68,108,74],[64,111,77,101,83,93,89]],
      hierarchy: { usurper:64, guide:114, mystery:178, adjuster:618, leader:1854, regulator:2472, genGov:4944, highOverseer:563616 },
      angelArabic: { usurper:23, guide:73, mystery:137, adjuster:577, leader:1813, regulator:2431, genGov:4903, highOverseer:563575 },
      angelHebrew: { usurper:33, guide:83, mystery:147, adjuster:587, leader:1823, regulator:2441, genGov:4913, highOverseer:563585 },
      jinnArabic:  { usurper:105, guide:155, mystery:219, adjuster:299, leader:1535, regulator:2153, genGov:4625, highOverseer:563297 },
      jinnHebrew:  { usurper:95, guide:145, mystery:209, adjuster:289, leader:1525, regulator:2143, genGov:4615, highOverseer:563287 },
    },
    mercuryHierarchy: { usurper:45, guide:114, mystery:159, adjuster:618, leader:1854, regulator:2472, genGov:4944, highOverseer:563616 },
    mercuryAngelArabic: { usurper:4, guide:73, mystery:118, adjuster:577, leader:1813, regulator:2431, genGov:4903, highOverseer:563575 },
    mercuryAngelHebrew: { usurper:14, guide:83, mystery:128, adjuster:587, leader:1823, regulator:2441, genGov:4913, highOverseer:563585 },
    mercuryJinnArabic:  { usurper:86, guide:155, mystery:200, adjuster:299, leader:1535, regulator:2153, genGov:4625, highOverseer:563297 },
    mercuryJinnHebrew:  { usurper:76, guide:145, mystery:190, adjuster:289, leader:1525, regulator:2143, genGov:4615, highOverseer:563287 },
    moonHierarchy: { usurper:28, guide:114, mystery:142, adjuster:618, leader:1854, regulator:2472, genGov:4944, highOverseer:563616 },
    moonAngelArabic: { usurper:347, guide:73, mystery:101, adjuster:577, leader:1813, regulator:2431, genGov:4903, highOverseer:563575 },
    moonAngelHebrew: { usurper:357, guide:83, mystery:111, adjuster:587, leader:1823, regulator:2441, genGov:4913, highOverseer:563585 },
    moonJinnArabic:  { usurper:69, guide:155, mystery:183, adjuster:299, leader:1535, regulator:2153, genGov:4625, highOverseer:563297 },
    moonJinnHebrew:  { usurper:59, guide:145, mystery:173, adjuster:289, leader:1525, regulator:2143, genGov:4615, highOverseer:563287 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION C — MARS PLANETARY CHAPTER (pp.695–700)
// ─────────────────────────────────────────────────────────────────────────────

export const MARS_CHAPTER = {
  planet: "Mars",
  hebrewName: "Madim",
  hebrewValue: 94,
  chapterPage: 695,

  sign: {
    name: "Mars: Madim", hebrewValue: 94,
    page: "695",
    hebrewSquare4x4: { numerical: [[39,5,13,37],[12,38,38,6],[3,41,39,11]] },
    hebrewSquare4x4_b: "4×4 letter square present — see PDF p.695",
    jupiterSquare: {
      fire:  [[16,27,21,30],[29,22,24,19],[26,17,31,20],[23,28,18,25]],
      earth: [[23,26,29,16],[28,17,22,27],[18,31,24,21],[25,20,19,30]],
      air:   [[25,18,28,23],[20,31,17,26],[19,24,22,29],[30,21,27,16]],
      water: [[30,19,20,25],[21,24,31,18],[27,22,17,28],[16,29,26,23]],
      hierarchy: { usurper:16, guide:31, mystery:47, adjuster:752, leader:2256, regulator:3008, genGov:6016, highOverseer:186496 },
      angelArabic: { usurper:335, guide:350, mystery:6, adjuster:711, leader:2215, regulator:2967, genGov:5975, highOverseer:186455 },
      angelHebrew: { usurper:345, guide:360, mystery:16, adjuster:721, leader:2225, regulator:2977, genGov:5985, highOverseer:186465 },
      jinnArabic:  { usurper:57, guide:72, mystery:88, adjuster:433, leader:1937, regulator:2689, genGov:5697, highOverseer:186177 },
      jinnHebrew:  { usurper:47, guide:62, mystery:78, adjuster:423, leader:1927, regulator:2679, genGov:5687, highOverseer:186167 },
    },
    marsSquare: {
      fire:  [[6,34,24,18,12],[19,13,7,30,25],[31,21,20,14,8],[15,9,32,22,16],[23,17,11,10,33]],
      earth: [[33,10,11,17,23],[16,22,32,9,15],[8,14,20,21,31],[25,30,7,13,19],[12,18,24,34,6]],
      air:   [[23,15,31,19,6],[17,9,21,13,34],[11,32,20,7,24],[10,22,14,30,18],[33,16,8,25,12]],
      water: [[12,25,8,16,33],[18,30,14,22,10],[24,7,20,32,11],[34,13,21,9,17],[6,19,31,15,23]],
      hierarchy: { usurper:6, guide:34, mystery:40, adjuster:94, leader:282, regulator:376, genGov:752, highOverseer:25568 },
      angelArabic: { usurper:325, guide:353, mystery:359, adjuster:53, leader:241, regulator:335, genGov:711, highOverseer:25527 },
      angelHebrew: { usurper:335, guide:3, mystery:9, adjuster:63, leader:251, regulator:345, genGov:721, highOverseer:25537 },
      jinnArabic:  { usurper:47, guide:75, mystery:81, adjuster:135, leader:323, regulator:57, genGov:433, highOverseer:25249 },
      jinnHebrew:  { usurper:37, guide:65, mystery:71, adjuster:125, leader:313, regulator:47, genGov:423, highOverseer:25239 },
    },
  },

  archangel: {
    name: "Archangel: Kamael", hebrewValue: 91,
    note: "Numerical Squares See Page: 401",
    page: "697",
    hebrewSquare4x4: { numerical: [[19,41,4,27],[3,28,18,42],[39,21,29,2]] },
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.697",
  },

  angel: {
    name: "Angel: Zamael", hebrewValue: 78,
    note: "Numerical Squares See Page: 91",
    page: "697",
    hebrewSquare4x4: { numerical: [[6,41,4,27],[3,28,5,42],[39,8,29,2]] },
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.697",
  },

  intelligence: {
    name: "Intelligence: Graphiel", hebrewValue: 325,
    note: "Numerical Squares See Page: 441",
    page: "697",
    hebrewSquare4x4: { numerical: [[2,202,83,38],[82,39,1,203],[200,4,40,81]] },
    hebrewSquare7x7: "letter square present — see PDF p.697",
  },

  spirit: {
    name: "Spirit: Bartzabel", hebrewValue: 325,
    note: "Numerical Squares See Page: 441",
    page: "698",
    hebrewSquare4x4: { numerical: [[201,91,5,28],[4,29,200,92],[89,203,30,3]] },
    hebrewSquare6x6: "letter square present — see PDF p.698",
  },

  olympicSpirit: {
    name: "Olympic Spirit: Phaleg", hebrewValue: 113,
    note: "Hebrew Squares Not Available",
    page: "698",
    jupiterSquare: {
      fire:  [[20,31,25,37],[36,26,28,23],[30,21,38,24],[27,35,22,29]],
      earth: [[27,30,36,20],[35,21,26,31],[22,38,28,25],[29,24,23,37]],
      air:   [[29,22,35,27],[24,38,21,30],[23,28,26,36],[37,25,31,20]],
      water: [[37,23,24,29],[25,28,38,22],[31,26,21,35],[20,36,30,27]],
      hierarchy: { usurper:20, guide:38, mystery:58, adjuster:904, leader:2712, regulator:3616, genGov:7232, highOverseer:274816 },
      angelArabic: { usurper:339, guide:357, mystery:17, adjuster:863, leader:2671, regulator:3575, genGov:7191, highOverseer:274775 },
      angelHebrew: { usurper:349, guide:7, mystery:27, adjuster:873, leader:2681, regulator:3585, genGov:7201, highOverseer:274785 },
      jinnArabic:  { usurper:61, guide:79, mystery:99, adjuster:585, leader:2393, regulator:3297, genGov:6913, highOverseer:274497 },
      jinnHebrew:  { usurper:51, guide:69, mystery:89, adjuster:575, leader:2383, regulator:3287, genGov:6903, highOverseer:274487 },
    },
    marsSquare: {
      fire:  [[10,37,28,22,16],[23,17,11,33,29],[34,25,24,18,12],[19,13,35,26,20],[27,21,15,14,36]],
      earth: [[36,14,15,21,27],[20,26,35,13,19],[12,18,24,25,34],[29,33,11,17,23],[16,22,28,37,10]],
      air:   [[27,19,34,23,10],[21,13,25,17,37],[15,35,24,11,28],[14,26,18,33,22],[36,20,12,29,16]],
      water: [[16,29,12,20,36],[22,33,18,26,14],[28,11,24,35,15],[37,17,25,13,21],[10,23,34,19,27]],
      hierarchy: { usurper:10, guide:37, mystery:47, adjuster:113, leader:339, regulator:452, genGov:904, highOverseer:33448 },
      angelArabic: { usurper:329, guide:356, mystery:6, adjuster:72, leader:298, regulator:411, genGov:863, highOverseer:33407 },
      angelHebrew: { usurper:339, guide:6, mystery:16, adjuster:82, leader:308, regulator:421, genGov:873, highOverseer:33417 },
      jinnArabic:  { usurper:51, guide:78, mystery:88, adjuster:154, leader:20, regulator:133, genGov:585, highOverseer:33129 },
      jinnHebrew:  { usurper:41, guide:68, mystery:78, adjuster:144, leader:10, regulator:123, genGov:575, highOverseer:33119 },
    },
    sunSquare: {
      fire:  [[1,12,34,18,22,26],[7,17,28,33,5,23],[13,37,21,11,27,4],[24,3,14,29,8,35],[30,19,10,2,36,16],[38,25,6,20,15,9]],
      earth: [[38,30,24,13,7,1],[25,19,3,37,17,12],[6,10,14,21,28,34],[20,2,29,11,33,18],[15,36,8,27,5,22],[9,16,35,4,23,26]],
      air:   [[9,15,20,6,25,38],[16,36,2,10,19,30],[35,8,29,14,3,24],[4,27,11,21,37,13],[23,5,33,28,17,7],[26,22,18,34,12,1]],
      water: [[26,23,4,35,16,9],[22,5,27,8,36,15],[18,33,11,29,2,20],[34,28,21,14,10,6],[12,17,37,3,19,25],[1,7,13,24,30,38]],
      hierarchy: { usurper:1, guide:38, mystery:39, adjuster:113, leader:339, regulator:452, genGov:904, highOverseer:34352 },
      angelArabic: { usurper:320, guide:357, mystery:358, adjuster:72, leader:298, regulator:411, genGov:863, highOverseer:34311 },
      angelHebrew: { usurper:330, guide:7, mystery:8, adjuster:82, leader:308, regulator:421, genGov:873, highOverseer:34321 },
      jinnArabic:  { usurper:42, guide:79, mystery:80, adjuster:154, leader:20, regulator:133, genGov:585, highOverseer:34033 },
      jinnHebrew:  { usurper:32, guide:69, mystery:70, adjuster:144, leader:10, regulator:123, genGov:575, highOverseer:34023 },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION D — SUN PLANETARY CHAPTER (pp.701–721)
// ─────────────────────────────────────────────────────────────────────────────

export const SUN_CHAPTER = {
  planet: "Sun",
  hebrewName: "Shemesh",
  hebrewValue: 640,
  note: "Hebrew Squares Not Available",
  chapterPage: 701,

  sign: {
    name: "Sun: Shemesh", hebrewValue: 640,
    note: "Hebrew Squares Not Available",
    page: "701",
    jupiterSquare: {
      fire:  [[152,163,157,168],[167,158,160,155],[162,153,169,156],[159,166,154,161]],
      earth: [[159,162,167,152],[166,153,158,163],[154,169,160,157],[161,156,155,168]],
      air:   [[161,154,166,159],[156,169,153,162],[155,160,158,167],[168,157,163,152]],
      water: [[168,155,156,161],[157,160,169,154],[163,158,153,166],[152,167,162,159]],
      hierarchy: { usurper:152, guide:169, mystery:321, adjuster:5120, leader:15360, regulator:20480, genGov:40960, highOverseer:6922240 },
      angelArabic: { usurper:111, guide:128, mystery:280, adjuster:5079, leader:15319, regulator:20439, genGov:40919, highOverseer:6922199 },
      angelHebrew: { usurper:121, guide:138, mystery:290, adjuster:5089, leader:15329, regulator:20449, genGov:40929, highOverseer:6922209 },
      jinnArabic:  { usurper:193, guide:210, mystery:2, adjuster:4801, leader:15041, regulator:20161, genGov:40641, highOverseer:6921921 },
      jinnHebrew:  { usurper:183, guide:200, mystery:352, adjuster:4791, leader:15031, regulator:20151, genGov:40631, highOverseer:6921911 },
    },
    marsSquare: {
      fire:  [[116,140,134,128,122],[129,123,117,136,135],[137,131,130,124,118],[125,119,138,132,126],[133,127,121,120,139]],
      earth: [[139,120,121,127,133],[126,132,138,119,125],[118,124,130,131,137],[135,136,117,123,129],[122,128,134,140,116]],
      air:   [[133,125,137,129,116],[127,119,131,123,140],[121,138,130,117,134],[120,132,124,136,128],[139,126,118,135,122]],
      water: [[122,135,118,126,139],[128,136,124,132,120],[134,117,130,138,121],[140,123,131,119,127],[116,129,137,125,133]],
      hierarchy: { usurper:116, guide:140, mystery:256, adjuster:640, leader:1920, regulator:2560, genGov:5120, highOverseer:716800 },
      angelArabic: { usurper:75, guide:99, mystery:215, adjuster:599, leader:1879, regulator:2519, genGov:5079, highOverseer:716759 },
      angelHebrew: { usurper:85, guide:109, mystery:225, adjuster:609, leader:1889, regulator:2529, genGov:5089, highOverseer:716769 },
      jinnArabic:  { usurper:157, guide:181, mystery:297, adjuster:321, leader:1601, regulator:2241, genGov:4801, highOverseer:716481 },
      jinnHebrew:  { usurper:147, guide:171, mystery:287, adjuster:311, leader:1591, regulator:2231, genGov:4791, highOverseer:716471 },
    },
    sunSquare: {
      fire:  [[89,100,121,106,110,114],[95,105,116,120,93,111],[101,124,109,99,115,92],[112,91,102,117,96,122],[118,107,98,90,123,104],[125,113,94,108,103,97]],
      earth: [[125,118,112,101,95,89],[113,107,91,124,105,100],[94,98,102,109,116,121],[108,90,117,99,120,106],[103,123,96,115,93,110],[97,104,122,92,111,114]],
      air:   [[97,103,108,94,113,125],[104,123,90,98,107,118],[122,96,117,102,91,112],[92,115,99,109,124,101],[111,93,120,116,105,95],[114,110,106,121,100,89]],
      water: [[114,111,92,122,104,97],[110,93,115,96,123,103],[106,120,99,117,90,108],[121,116,109,102,98,94],[100,105,124,91,107,113],[89,95,101,112,118,125]],
      hierarchy: { usurper:89, guide:125, mystery:214, adjuster:640, leader:1920, regulator:2560, genGov:5120, highOverseer:640000 },
      angelArabic: { usurper:48, guide:84, mystery:173, adjuster:599, leader:1879, regulator:2519, genGov:5079, highOverseer:639959 },
      angelHebrew: { usurper:58, guide:94, mystery:183, adjuster:609, leader:1889, regulator:2529, genGov:5089, highOverseer:639969 },
      jinnArabic:  { usurper:130, guide:166, mystery:255, adjuster:321, leader:1601, regulator:2241, genGov:4801, highOverseer:639681 },
      jinnHebrew:  { usurper:120, guide:156, mystery:245, adjuster:311, leader:1591, regulator:2231, genGov:4791, highOverseer:639671 },
    },
    venusSquare: {
      fire:  [[67,108,93,78,98,114,82],[115,83,68,102,94,79,99],[80,100,116,84,69,103,88],[104,89,74,101,117,85,70],[86,71,105,90,75,95,118],[96,112,87,72,106,91,76],[92,77,97,113,81,73,107]],
      earth: [[92,96,86,104,80,115,67],[77,112,71,89,100,83,108],[97,87,105,74,116,68,93],[113,72,90,101,84,102,78],[81,106,75,117,69,94,98],[73,91,95,85,103,79,114],[107,76,118,70,88,99,82]],
      air:   [[107,73,81,113,97,77,92],[76,91,106,72,87,112,96],[118,95,75,90,105,71,86],[70,85,117,101,74,89,104],[88,103,69,84,116,100,80],[99,79,94,102,68,83,115],[82,114,98,78,93,108,67]],
      water: [[82,99,88,70,118,76,107],[114,79,103,85,95,91,73],[98,94,69,117,75,106,81],[78,102,84,101,90,72,113],[93,68,116,74,105,87,97],[108,83,100,89,71,112,77],[67,115,80,104,86,96,92]],
      hierarchy: { usurper:67, guide:118, mystery:185, adjuster:640, leader:1920, regulator:2560, genGov:5120, highOverseer:604160 },
      angelArabic: { usurper:26, guide:77, mystery:144, adjuster:599, leader:1879, regulator:2519, genGov:5079, highOverseer:604119 },
      angelHebrew: { usurper:36, guide:87, mystery:154, adjuster:609, leader:1889, regulator:2529, genGov:5089, highOverseer:604129 },
      jinnArabic:  { usurper:108, guide:159, mystery:226, adjuster:321, leader:1601, regulator:2241, genGov:4801, highOverseer:603841 },
      jinnHebrew:  { usurper:98, guide:149, mystery:216, adjuster:311, leader:1591, regulator:2231, genGov:4791, highOverseer:603831 },
    },
    mercurySquare: {
      fire:  [[48,64,113,93,82,98,79,63],[56,72,101,85,90,110,71,55],[99,83,62,78,65,49,92,112],[111,91,54,70,73,57,84,100],[77,61,80,96,115,95,50,66],[69,53,88,108,103,87,58,74],[94,114,67,51,60,76,97,81],[86,102,75,59,52,68,109,89]],
      earth: [[86,94,69,77,111,99,56,48],[102,114,53,61,91,83,72,64],[75,67,88,80,54,62,101,113],[59,51,108,96,70,78,85,93],[52,60,103,115,73,65,90,82],[68,76,87,95,57,49,110,98],[109,97,58,50,84,92,71,79],[89,81,74,66,100,112,55,63]],
      air:   [[89,109,68,52,59,75,102,86],[81,97,76,60,51,67,114,94],[74,58,87,103,108,88,53,69],[66,50,95,115,96,80,61,77],[100,84,57,73,70,54,91,111],[112,92,49,65,78,62,83,99],[55,71,110,90,85,101,72,56],[63,79,98,82,93,113,64,48]],
      water: [[63,55,112,100,66,74,81,89],[79,71,92,84,50,58,97,109],[98,110,49,57,95,87,76,68],[82,90,65,73,115,103,60,52],[93,85,78,70,96,108,51,59],[113,101,62,54,80,88,67,75],[64,72,83,91,61,53,114,102],[48,56,99,111,77,69,94,86]],
      hierarchy: { usurper:48, guide:115, mystery:163, adjuster:640, leader:1920, regulator:2560, genGov:5120, highOverseer:588800 },
      angelArabic: { usurper:7, guide:74, mystery:122, adjuster:599, leader:1879, regulator:2519, genGov:5079, highOverseer:588759 },
      angelHebrew: { usurper:17, guide:84, mystery:132, adjuster:609, leader:1889, regulator:2529, genGov:5089, highOverseer:588769 },
      jinnArabic:  { usurper:89, guide:156, mystery:204, adjuster:321, leader:1601, regulator:2241, genGov:4801, highOverseer:588481 },
      jinnHebrew:  { usurper:79, guide:146, mystery:194, adjuster:311, leader:1591, regulator:2231, genGov:4791, highOverseer:588471 },
    },
    moonSquare: {
      fire:  [[75,88,50,59,112,43,79,95,39],[35,78,100,55,71,87,42,64,108],[104,47,63,99,31,83,92,54,67],[102,34,77,86,57,70,107,41,66],[62,106,46,82,98,33,69,91,53],[49,74,90,45,58,111,38,81,94],[48,61,105,32,84,97,52,68,93],[89,51,73,110,44,60,96,37,80],[76,101,36,72,85,56,65,109,40]],
      earth: [[39,108,67,66,53,94,93,80,40],[95,64,54,41,91,81,68,37,109],[79,42,92,107,69,38,52,96,65],[43,87,83,70,33,111,97,60,56],[112,71,31,57,98,58,84,44,85],[59,55,99,86,82,45,32,110,72],[50,100,63,77,46,90,105,73,36],[88,78,47,34,106,74,61,51,101],[75,35,104,102,62,49,48,89,76]],
      air:   [[40,109,65,56,85,72,36,101,76],[80,37,96,60,44,110,73,51,89],[93,68,52,97,84,32,105,61,48],[94,81,38,111,58,45,90,74,49],[53,91,69,33,98,82,46,106,62],[66,41,107,70,57,86,77,34,102],[67,54,92,83,31,99,63,47,104],[108,64,42,87,71,55,100,78,35],[39,95,79,43,112,59,50,88,75]],
      water: [[76,89,48,49,62,102,104,35,75],[101,51,61,74,106,34,47,78,88],[36,73,105,90,46,77,63,100,50],[72,110,32,45,82,86,99,55,59],[85,44,84,58,98,57,31,71,112],[56,60,97,111,33,70,83,87,43],[65,96,52,38,69,107,92,42,79],[109,37,68,81,91,41,54,64,95],[40,80,93,94,53,66,67,108,39]],
      hierarchy: { usurper:31, guide:112, mystery:143, adjuster:640, leader:1920, regulator:2560, genGov:5120, highOverseer:573440 },
      angelArabic: { usurper:350, guide:71, mystery:102, adjuster:599, leader:1879, regulator:2519, genGov:5079, highOverseer:573399 },
      angelHebrew: { usurper:360, guide:81, mystery:112, adjuster:609, leader:1889, regulator:2529, genGov:5089, highOverseer:573409 },
      jinnArabic:  { usurper:72, guide:153, mystery:184, adjuster:321, leader:1601, regulator:2241, genGov:4801, highOverseer:573121 },
      jinnHebrew:  { usurper:62, guide:143, mystery:174, adjuster:311, leader:1591, regulator:2231, genGov:4791, highOverseer:573111 },
    },
  },

  archangel: { name: "Archangel: Raphael", hebrewValue: 311, note: "Numerical Squares See Page: 636", page: "709",
    hebrewSquare4x4: { numerical: [[199,81,4,27],[3,28,198,82],[79,201,29,2]] } },
  angel: { name: "Angel: Michael", hebrewValue: 101, note: "Hebrew Squares See Page: 600; Numerical See Page: 247", page: "710" },

  intelligence: {
    name: "Intelligence: Nakhiel", hebrewValue: 111,
    page: "710",
    hebrewSquare4x4: { numerical: [[49,21,13,28],[12,29,48,22],[19,51,30,11]] },
    hebrewSquare5x5: "letter square present — see PDF p.710",
    jupiterSquare: {
      fire:  [[20,31,25,35],[34,26,28,23],[30,21,36,24],[27,33,22,29]],
      earth: [[27,30,34,20],[33,21,26,31],[22,36,28,25],[29,24,23,35]],
      air:   [[29,22,33,27],[24,36,21,30],[23,28,26,34],[35,25,31,20]],
      water: [[35,23,24,29],[25,28,36,22],[31,26,21,33],[20,34,30,27]],
      hierarchy_4x4: { usurper:20, guide:36, mystery:56, adjuster:888, leader:2664, regulator:3552, genGov:7104, highOverseer:255744 },
      angelArabic_4x4: { usurper:339, guide:355, mystery:15, adjuster:847, leader:2623, regulator:3511, genGov:7063, highOverseer:255703 },
      angelHebrew_4x4: { usurper:349, guide:5, mystery:25, adjuster:857, leader:2633, regulator:3521, genGov:7073, highOverseer:255713 },
      jinnArabic_4x4:  { usurper:61, guide:77, mystery:97, adjuster:569, leader:2345, regulator:3233, genGov:6785, highOverseer:255425 },
      jinnHebrew_4x4:  { usurper:51, guide:67, mystery:87, adjuster:559, leader:2335, regulator:3223, genGov:6775, highOverseer:255415 },
    },
    marsSquare: {
      fire:  [[10,35,28,22,16],[23,17,11,31,29],[32,25,24,18,12],[19,13,33,26,20],[27,21,15,14,34]],
      earth: [[34,14,15,21,27],[20,26,33,13,19],[12,18,24,25,32],[29,31,11,17,23],[16,22,28,35,10]],
      air:   [[27,19,32,23,10],[21,13,25,17,35],[15,33,24,11,28],[14,26,18,31,22],[34,20,12,29,16]],
      water: [[16,29,12,20,34],[22,31,18,26,14],[28,11,24,33,15],[35,17,25,13,21],[10,23,32,19,27]],
      hierarchy: { usurper:10, guide:35, mystery:45, adjuster:111, leader:333, regulator:444, genGov:888, highOverseer:31080 },
      angelArabic: { usurper:329, guide:354, mystery:4, adjuster:70, leader:292, regulator:403, genGov:847, highOverseer:31039 },
      angelHebrew: { usurper:339, guide:4, mystery:14, adjuster:80, leader:302, regulator:413, genGov:857, highOverseer:31049 },
      jinnArabic:  { usurper:51, guide:76, mystery:86, adjuster:152, leader:14, regulator:125, genGov:569, highOverseer:30761 },
      jinnHebrew:  { usurper:41, guide:66, mystery:76, adjuster:142, leader:4, regulator:115, genGov:559, highOverseer:30751 },
    },
    sunSquare: {
      fire:  [[1,12,32,18,22,26],[7,17,28,31,5,23],[13,35,21,11,27,4],[24,3,14,29,8,33],[30,19,10,2,34,16],[36,25,6,20,15,9]],
      earth: [[36,30,24,13,7,1],[25,19,3,35,17,12],[6,10,14,21,28,32],[20,2,29,11,31,18],[15,34,8,27,5,22],[9,16,33,4,23,26]],
      air:   [[9,15,20,6,25,36],[16,34,2,10,19,30],[33,8,29,14,3,24],[4,27,11,21,35,13],[23,5,31,28,17,7],[26,22,18,32,12,1]],
      water: [[26,23,4,33,16,9],[22,5,27,8,34,15],[18,31,11,29,2,20],[32,28,21,14,10,6],[12,17,35,3,19,25],[1,7,13,24,30,36]],
      hierarchy: { usurper:1, guide:36, mystery:37, adjuster:111, leader:333, regulator:444, genGov:888, highOverseer:31968 },
      angelArabic: { usurper:320, guide:355, mystery:356, adjuster:70, leader:292, regulator:403, genGov:847, highOverseer:31927 },
      angelHebrew: { usurper:330, guide:5, mystery:6, adjuster:80, leader:302, regulator:413, genGov:857, highOverseer:31937 },
      jinnArabic:  { usurper:42, guide:77, mystery:78, adjuster:152, leader:14, regulator:125, genGov:569, highOverseer:31649 },
      jinnHebrew:  { usurper:32, guide:67, mystery:68, adjuster:142, leader:4, regulator:115, genGov:559, highOverseer:31639 },
    },
  },

  spirit: {
    name: "Spirit: Sorath", hebrewValue: 666,
    page: "713",
    hebrewSquare4x4: { numerical: [[59,7,203,397],[202,398,58,8],[5,61,399,201]] },
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.713",
    jupiterSquare: {
      fire:  [[159,170,164,173],[172,165,167,162],[169,160,174,163],[166,171,161,168]],
      earth: [[166,169,172,159],[171,160,165,170],[161,174,167,164],[168,163,162,173]],
      air:   [[168,161,171,166],[163,174,160,169],[162,167,165,172],[173,164,170,159]],
      water: [[173,162,163,168],[164,167,174,161],[170,165,160,171],[159,172,169,166]],
      hierarchy: { usurper:159, guide:174, mystery:333, adjuster:5328, leader:15984, regulator:21312, genGov:42624, highOverseer:7416576 },
      angelArabic: { usurper:118, guide:133, mystery:292, adjuster:5287, leader:15943, regulator:21271, genGov:42583, highOverseer:7416535 },
      angelHebrew: { usurper:128, guide:143, mystery:302, adjuster:5297, leader:15953, regulator:21281, genGov:42593, highOverseer:7416545 },
      jinnArabic:  { usurper:200, guide:215, mystery:14, adjuster:5009, leader:15665, regulator:20993, genGov:42305, highOverseer:7416257 },
      jinnHebrew:  { usurper:190, guide:205, mystery:4, adjuster:4999, leader:15655, regulator:20983, genGov:42295, highOverseer:7416247 },
    },
    marsSquare: {
      fire:  [[121,146,139,133,127],[134,128,122,142,140],[143,136,135,129,123],[130,124,144,137,131],[138,132,126,125,145]],
      earth: [[145,125,126,132,138],[131,137,144,124,130],[123,129,135,136,143],[140,142,122,128,134],[127,133,139,146,121]],
      air:   [[138,130,143,134,121],[132,124,136,128,146],[126,144,135,122,139],[125,137,129,142,133],[145,131,123,140,127]],
      water: [[127,140,123,131,145],[133,142,129,137,125],[139,122,135,144,126],[146,128,136,124,132],[121,134,143,130,138]],
      hierarchy: { usurper:121, guide:146, mystery:267, adjuster:666, leader:1998, regulator:2664, genGov:5328, highOverseer:777888 },
      angelArabic: { usurper:80, guide:105, mystery:226, adjuster:625, leader:1957, regulator:2623, genGov:5287, highOverseer:777847 },
      angelHebrew: { usurper:90, guide:115, mystery:236, adjuster:635, leader:1967, regulator:2633, genGov:5297, highOverseer:777857 },
      jinnArabic:  { usurper:162, guide:187, mystery:308, adjuster:347, leader:1679, regulator:2345, genGov:5009, highOverseer:777569 },
      jinnHebrew:  { usurper:152, guide:177, mystery:298, adjuster:337, leader:1669, regulator:2335, genGov:4999, highOverseer:777559 },
    },
    sunSquare: {
      fire:  [[93,104,127,110,114,118],[99,109,120,126,97,115],[105,130,113,103,119,96],[116,95,106,121,100,128],[122,111,102,94,129,108],[131,117,98,112,107,101]],
      earth: [[131,122,116,105,99,93],[117,111,95,130,109,104],[98,102,106,113,120,127],[112,94,121,103,126,110],[107,129,100,119,97,114],[101,108,128,96,115,118]],
      air:   [[101,107,112,98,117,131],[108,129,94,102,111,122],[128,100,121,106,95,116],[96,119,103,113,130,105],[115,97,126,120,109,99],[118,114,110,127,104,93]],
      water: [[118,115,96,128,108,101],[114,97,119,100,129,107],[110,126,103,121,94,112],[127,120,113,106,102,98],[104,109,130,95,111,117],[93,99,105,116,122,131]],
      hierarchy: { usurper:93, guide:131, mystery:224, adjuster:666, leader:1998, regulator:2664, genGov:5328, highOverseer:697968 },
      angelArabic: { usurper:52, guide:90, mystery:183, adjuster:625, leader:1957, regulator:2623, genGov:5287, highOverseer:697927 },
      angelHebrew: { usurper:62, guide:100, mystery:193, adjuster:635, leader:1967, regulator:2633, genGov:5297, highOverseer:697937 },
      jinnArabic:  { usurper:134, guide:172, mystery:265, adjuster:347, leader:1679, regulator:2345, genGov:5009, highOverseer:697649 },
      jinnHebrew:  { usurper:124, guide:162, mystery:255, adjuster:337, leader:1669, regulator:2335, genGov:4999, highOverseer:697639 },
    },
    venusSquare: {
      fire:  [[71,112,97,82,102,116,86],[117,87,72,106,98,83,103],[84,104,118,88,73,107,92],[108,93,78,105,119,89,74],[90,75,109,94,79,99,120],[100,114,91,76,110,95,80],[96,81,101,115,85,77,111]],
      earth: [[96,100,90,108,84,117,71],[81,114,75,93,104,87,112],[101,91,109,78,118,72,97],[115,76,94,105,88,106,82],[85,110,79,119,73,98,102],[77,95,99,89,107,83,116],[111,80,120,74,92,103,86]],
      air:   [[111,77,85,115,101,81,96],[80,95,110,76,91,114,100],[120,99,79,94,109,75,90],[74,89,119,105,78,93,108],[92,107,73,88,118,104,84],[103,83,98,106,72,87,117],[86,116,102,82,97,112,71]],
      water: [[86,103,92,74,120,80,111],[116,83,107,89,99,95,77],[102,98,73,119,79,110,85],[82,106,88,105,94,76,115],[97,72,118,78,109,91,101],[112,87,104,93,75,114,81],[71,117,84,108,90,100,96]],
      hierarchy: { usurper:71, guide:120, mystery:191, adjuster:666, leader:1998, regulator:2664, genGov:5328, highOverseer:639360 },
      angelArabic: { usurper:30, guide:79, mystery:150, adjuster:625, leader:1957, regulator:2623, genGov:5287, highOverseer:639319 },
      angelHebrew: { usurper:40, guide:89, mystery:160, adjuster:635, leader:1967, regulator:2633, genGov:5297, highOverseer:639329 },
      jinnArabic:  { usurper:112, guide:161, mystery:232, adjuster:347, leader:1679, regulator:2345, genGov:5009, highOverseer:639041 },
      jinnHebrew:  { usurper:102, guide:151, mystery:222, adjuster:337, leader:1669, regulator:2335, genGov:4999, highOverseer:639031 },
    },
    mercuryHierarchy: { usurper:51, guide:120, mystery:171, adjuster:666, leader:1998, regulator:2664, genGov:5328, highOverseer:639360 },
    mercuryAngelArabic: { usurper:10, guide:79, mystery:130, adjuster:625, leader:1957, regulator:2623, genGov:5287, highOverseer:639319 },
    mercuryAngelHebrew: { usurper:20, guide:89, mystery:140, adjuster:635, leader:1967, regulator:2633, genGov:5297, highOverseer:639329 },
    mercuryJinnArabic:  { usurper:92, guide:161, mystery:212, adjuster:347, leader:1679, regulator:2345, genGov:5009, highOverseer:639041 },
    mercuryJinnHebrew:  { usurper:82, guide:151, mystery:202, adjuster:337, leader:1669, regulator:2335, genGov:4999, highOverseer:639031 },
    moonHierarchy: { usurper:34, guide:114, mystery:148, adjuster:666, leader:1998, regulator:2664, genGov:5328, highOverseer:607392 },
    moonAngelArabic: { usurper:353, guide:73, mystery:107, adjuster:625, leader:1957, regulator:2623, genGov:5287, highOverseer:607351 },
    moonAngelHebrew: { usurper:3, guide:83, mystery:117, adjuster:635, leader:1967, regulator:2633, genGov:5297, highOverseer:607361 },
    moonJinnArabic:  { usurper:75, guide:155, mystery:189, adjuster:347, leader:1679, regulator:2345, genGov:5009, highOverseer:607073 },
    moonJinnHebrew:  { usurper:65, guide:145, mystery:179, adjuster:337, leader:1669, regulator:2335, genGov:4999, highOverseer:607063 },
    saturnHierarchy: { usurper:17, guide:117, mystery:134, adjuster:666, leader:1998, regulator:2664, genGov:5328, highOverseer:623376 },
    saturnAngelArabic: { usurper:336, guide:76, mystery:93, adjuster:625, leader:1957, regulator:2623, genGov:5287, highOverseer:623335 },
    saturnAngelHebrew: { usurper:346, guide:86, mystery:103, adjuster:635, leader:1967, regulator:2633, genGov:5297, highOverseer:623345 },
    saturnJinnArabic:  { usurper:58, guide:158, mystery:175, adjuster:347, leader:1679, regulator:2345, genGov:5009, highOverseer:623057 },
    saturnJinnHebrew:  { usurper:48, guide:148, mystery:165, adjuster:337, leader:1669, regulator:2335, genGov:4999, highOverseer:623047 },
  },

  olympicSpirit: { name: "Olympic Spirit: Och", hebrewValue: 15, note: "No Hebrew Squares Available; Numerical Squares See Page: (not given)", page: "721" },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION E — VENUS PLANETARY CHAPTER (pp.722–731)
// ─────────────────────────────────────────────────────────────────────────────

export const VENUS_CHAPTER = {
  planet: "Venus",
  hebrewName: "Nogah",
  hebrewValue: 64,
  chapterPage: 722,

  sign: {
    name: "Venus: Nogah", hebrewValue: 64,
    page: "722",
    hebrewSquare4x4: { numerical: [[49,7,6,2],[5,3,48,8],[5,51,4,4]] },
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.722",
    jupiterSquare: {
      fire:  [[8,19,13,24],[23,14,16,11],[18,9,25,12],[15,22,10,17]],
      earth: [[15,18,23,8],[22,9,14,19],[10,25,16,13],[17,12,11,24]],
      air:   [[17,10,22,15],[12,25,9,18],[11,16,14,23],[24,13,19,8]],
      water: [[24,11,12,17],[13,16,25,10],[19,14,9,22],[8,23,18,15]],
      hierarchy: { usurper:8, guide:25, mystery:33, adjuster:512, leader:1536, regulator:2048, genGov:4096, highOverseer:102400 },
      angelArabic: { usurper:327, guide:344, mystery:352, adjuster:471, leader:1495, regulator:2007, genGov:4055, highOverseer:102359 },
      angelHebrew: { usurper:337, guide:354, mystery:2, adjuster:481, leader:1505, regulator:2017, genGov:4065, highOverseer:102369 },
      jinnArabic:  { usurper:49, guide:66, mystery:74, adjuster:193, leader:1217, regulator:1729, genGov:3777, highOverseer:102081 },
      jinnHebrew:  { usurper:39, guide:56, mystery:64, adjuster:183, leader:1207, regulator:1719, genGov:3767, highOverseer:102071 },
    },
  },

  archangel: {
    name: "Archangel: Haniel", hebrewValue: 97,
    page: "723",
    hebrewSquare4x4: { numerical: [[5,51,13,28],[12,29,4,52],[49,7,30,11]] },
    hebrewSquare6x6: "letter square present — see PDF p.723",
    jupiterSquare: {
      fire:  [[16,27,21,33],[32,22,24,19],[26,17,34,20],[23,31,18,25]],
      earth: [[23,26,32,16],[31,17,22,27],[18,34,24,21],[25,20,19,33]],
      air:   [[25,18,31,23],[20,34,17,26],[19,24,22,32],[33,21,27,16]],
      water: [[33,19,20,25],[21,24,34,18],[27,22,17,31],[16,32,26,23]],
      hierarchy_4x4: { usurper:16, guide:34, mystery:50, adjuster:776, leader:2328, regulator:3104, genGov:6208, highOverseer:211072 },
      angelArabic_4x4: { usurper:335, guide:353, mystery:9, adjuster:735, leader:2287, regulator:3063, genGov:6167, highOverseer:211031 },
      angelHebrew_4x4: { usurper:345, guide:3, mystery:19, adjuster:745, leader:2297, regulator:3073, genGov:6177, highOverseer:211041 },
      jinnArabic_4x4:  { usurper:57, guide:75, mystery:91, adjuster:457, leader:2009, regulator:2785, genGov:5889, highOverseer:210753 },
      jinnHebrew_4x4:  { usurper:47, guide:65, mystery:81, adjuster:447, leader:1999, regulator:2775, genGov:5879, highOverseer:210743 },
    },
    marsSquare: {
      fire:  [[7,33,25,19,13],[20,14,8,29,26],[30,22,21,15,9],[16,10,31,23,17],[24,18,12,11,32]],
      earth: [[32,11,12,18,24],[17,23,31,10,16],[9,15,21,22,30],[26,29,8,14,20],[13,19,25,33,7]],
      air:   [[24,16,30,20,7],[18,10,22,14,33],[12,31,21,8,25],[11,23,15,29,19],[32,17,9,26,13]],
      water: [[13,26,9,17,32],[19,29,15,23,11],[25,8,21,31,12],[33,14,22,10,18],[7,20,30,16,24]],
      hierarchy: { usurper:7, guide:33, mystery:40, adjuster:97, leader:291, regulator:388, genGov:776, highOverseer:25608 },
      angelArabic: { usurper:326, guide:352, mystery:359, adjuster:56, leader:250, regulator:347, genGov:735, highOverseer:25567 },
      angelHebrew: { usurper:336, guide:2, mystery:9, adjuster:66, leader:260, regulator:357, genGov:745, highOverseer:25577 },
      jinnArabic:  { usurper:48, guide:74, mystery:81, adjuster:138, leader:332, regulator:69, genGov:457, highOverseer:25289 },
      jinnHebrew:  { usurper:38, guide:64, mystery:71, adjuster:128, leader:322, regulator:59, genGov:447, highOverseer:25279 },
    },
  },

  angel: {
    name: "Angel: Anael", hebrewValue: 82,
    note: "This square not possible (numerical 3×3 not possible for this value)",
    page: "725",
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.725",
    jupiterSquare: {
      fire:  [[13,24,18,27],[26,19,21,16],[23,14,28,17],[20,25,15,22]],
      earth: [[20,23,26,13],[25,14,19,24],[15,28,21,18],[22,17,16,27]],
      air:   [[22,15,25,20],[17,28,14,23],[16,21,19,26],[27,18,24,13]],
      water: [[27,16,17,22],[18,21,28,15],[24,19,14,25],[13,26,23,20]],
      hierarchy: { usurper:13, guide:28, mystery:41, adjuster:656, leader:1968, regulator:2624, genGov:5248, highOverseer:146944 },
      angelArabic: { usurper:332, guide:347, mystery:360, adjuster:615, leader:1927, regulator:2583, genGov:5207, highOverseer:146903 },
      angelHebrew: { usurper:342, guide:357, mystery:10, adjuster:625, leader:1937, regulator:2593, genGov:5217, highOverseer:146913 },
      jinnArabic:  { usurper:54, guide:69, mystery:82, adjuster:337, leader:1649, regulator:2305, genGov:4929, highOverseer:146625 },
      jinnHebrew:  { usurper:44, guide:59, mystery:72, adjuster:327, leader:1639, regulator:2295, genGov:4919, highOverseer:146615 },
    },
    marsSquare: {
      fire:  [[4,30,22,16,10],[17,11,5,26,23],[27,19,18,12,6],[13,7,28,20,14],[21,15,9,8,29]],
      earth: [[29,8,9,15,21],[14,20,28,7,13],[6,12,18,19,27],[23,26,5,11,17],[10,16,22,30,4]],
      air:   [[21,13,27,17,4],[15,7,19,11,30],[9,28,18,5,22],[8,20,12,26,16],[29,14,6,23,10]],
      water: [[10,23,6,14,29],[16,26,12,20,8],[22,5,18,28,9],[30,11,19,7,15],[4,17,27,13,21]],
      hierarchy: { usurper:4, guide:30, mystery:34, adjuster:82, leader:246, regulator:328, genGov:656, highOverseer:19680 },
      angelArabic: { usurper:323, guide:349, mystery:353, adjuster:41, leader:205, regulator:287, genGov:615, highOverseer:19639 },
      angelHebrew: { usurper:333, guide:359, mystery:3, adjuster:51, leader:215, regulator:297, genGov:625, highOverseer:19649 },
      jinnArabic:  { usurper:45, guide:71, mystery:75, adjuster:123, leader:287, regulator:9, genGov:337, highOverseer:19361 },
      jinnHebrew:  { usurper:35, guide:61, mystery:65, adjuster:113, leader:277, regulator:359, genGov:327, highOverseer:19351 },
    },
  },

  intelligence: {
    name: "Intelligence: Hagiel", hebrewValue: 49,
    page: "726",
    hebrewSquare4x4: { numerical: [[4,4,13,28],[12,29,3,5],[2,6,30,11]] },
    hebrewSquare5x5: "letter square present — see PDF p.726",
    jupiterSquare: {
      fire:  [[4,15,9,21],[20,10,12,7],[14,5,22,8],[11,19,6,13]],
      earth: [[11,14,20,4],[19,5,10,15],[6,22,12,9],[13,8,7,21]],
      air:   [[13,6,19,11],[8,22,5,14],[7,12,10,20],[21,9,15,4]],
      water: [[21,7,8,13],[9,12,22,6],[15,10,5,19],[4,20,14,11]],
      hierarchy: { usurper:4, guide:22, mystery:26, adjuster:392, leader:1176, regulator:1568, genGov:3136, highOverseer:68992 },
      angelArabic: { usurper:323, guide:341, mystery:345, adjuster:351, leader:1135, regulator:1527, genGov:3095, highOverseer:68951 },
      angelHebrew: { usurper:333, guide:351, mystery:355, adjuster:361, leader:1145, regulator:1537, genGov:3105, highOverseer:68961 },
      jinnArabic:  { usurper:45, guide:63, mystery:67, adjuster:73, leader:857, regulator:1249, genGov:2817, highOverseer:68673 },
      jinnHebrew:  { usurper:35, guide:53, mystery:57, adjuster:63, leader:847, regulator:1239, genGov:2807, highOverseer:68663 },
    },
  },

  spirit: {
    name: "Spirit: Kedemel", hebrewValue: 175,
    page: "727",
    hebrewSquare4x4: { numerical: [[99,5,43,28],[42,29,98,6],[3,101,30,41]] },
    hebrewSquare5x5: "letter square present — see PDF p.727",
    jupiterSquare: {
      fire:  [[36,47,41,51],[50,42,44,39],[46,37,52,40],[43,49,38,45]],
      earth: [[43,46,50,36],[49,37,42,47],[38,52,44,41],[45,40,39,51]],
      air:   [[45,38,49,43],[40,52,37,46],[39,44,42,50],[51,41,47,36]],
      water: [[51,39,40,45],[41,44,52,38],[47,42,37,49],[36,50,46,43]],
      hierarchy: { usurper:36, guide:52, mystery:88, adjuster:1400, leader:4200, regulator:5600, genGov:11200, highOverseer:582400 },
      angelArabic: { usurper:355, guide:11, mystery:47, adjuster:1359, leader:4159, regulator:5559, genGov:11159, highOverseer:582359 },
      angelHebrew: { usurper:5, guide:21, mystery:57, adjuster:1369, leader:4169, regulator:5569, genGov:11169, highOverseer:582369 },
      jinnArabic:  { usurper:77, guide:93, mystery:129, adjuster:1081, leader:3881, regulator:5281, genGov:10881, highOverseer:582081 },
      jinnHebrew:  { usurper:67, guide:83, mystery:119, adjuster:1071, leader:3871, regulator:5271, genGov:10871, highOverseer:582071 },
    },
    marsSquare: {
      fire:  [[23,47,41,35,29],[36,30,24,43,42],[44,38,37,31,25],[32,26,45,39,33],[40,34,28,27,46]],
      earth: [[46,27,28,34,40],[33,39,45,26,32],[25,31,37,38,44],[42,43,24,30,36],[29,35,41,47,23]],
      air:   [[40,32,44,36,23],[34,26,38,30,47],[28,45,37,24,41],[27,39,31,43,35],[46,33,25,42,29]],
      water: [[29,42,25,33,46],[35,43,31,39,27],[41,24,37,45,28],[47,30,38,26,34],[23,36,44,32,40]],
      hierarchy: { usurper:23, guide:47, mystery:70, adjuster:175, leader:525, regulator:700, genGov:1400, highOverseer:65800 },
      angelArabic: { usurper:342, guide:6, mystery:29, adjuster:134, leader:484, regulator:659, genGov:1359, highOverseer:65759 },
      angelHebrew: { usurper:352, guide:16, mystery:39, adjuster:144, leader:494, regulator:669, genGov:1369, highOverseer:65769 },
      jinnArabic:  { usurper:64, guide:88, mystery:111, adjuster:216, leader:206, regulator:381, genGov:1081, highOverseer:65481 },
      jinnHebrew:  { usurper:54, guide:78, mystery:101, adjuster:206, leader:196, regulator:371, genGov:1071, highOverseer:65471 },
    },
    sunSquare: {
      fire:  [[11,22,46,28,32,36],[17,27,38,45,15,33],[23,49,31,21,37,14],[34,13,24,39,18,47],[40,29,20,12,48,26],[50,35,16,30,25,19]],
      earth: [[50,40,34,23,17,11],[35,29,13,49,27,22],[16,20,24,31,38,46],[30,12,39,21,45,28],[25,48,18,37,15,32],[19,26,47,14,33,36]],
      air:   [[19,25,30,16,35,50],[26,48,12,20,29,40],[47,18,39,24,13,34],[14,37,21,31,49,23],[33,15,45,38,27,17],[36,32,28,46,22,11]],
      water: [[36,33,14,47,26,19],[32,15,37,18,48,25],[28,45,21,39,12,30],[46,38,31,24,20,16],[22,27,49,13,29,35],[11,17,23,34,40,50]],
      hierarchy: { usurper:11, guide:50, mystery:61, adjuster:175, leader:525, regulator:700, genGov:1400, highOverseer:70000 },
      angelArabic: { usurper:330, guide:9, mystery:20, adjuster:134, leader:484, regulator:659, genGov:1359, highOverseer:69959 },
      angelHebrew: { usurper:340, guide:19, mystery:30, adjuster:144, leader:494, regulator:669, genGov:1369, highOverseer:69969 },
      jinnArabic:  { usurper:52, guide:91, mystery:102, adjuster:216, leader:206, regulator:381, genGov:1081, highOverseer:69681 },
      jinnHebrew:  { usurper:42, guide:81, mystery:92, adjuster:206, leader:196, regulator:371, genGov:1071, highOverseer:69671 },
    },
    venusSquare_fire:  [[1,42,27,12,32,45,16],[46,17,2,36,28,13,33],[14,34,47,18,3,37,22],[38,23,8,35,48,19,4],[20,5,39,24,9,29,49],[30,43,21,6,40,25,10],[26,11,31,44,15,7,41]],
    venusSquare_air:   [[41,7,15,44,31,11,26],[10,25,40,6,21,43,30],[49,29,9,24,39,5,20],[4,19,48,35,8,23,38],[22,37,3,18,47,34,14],[33,13,28,36,2,17,46],[16,45,32,12,27,42,1]],
    venusSquare_earth: [[26,30,20,38,14,46,1],[11,43,5,23,34,17,42],[31,21,39,8,47,2,27],[44,6,24,35,18,36,12],[15,40,9,48,3,28,32],[7,25,29,19,37,13,45],[41,10,49,4,22,33,16]],
    venusSquare_water: [[16,33,22,4,49,10,41],[45,13,37,19,29,25,7],[32,28,3,48,9,40,15],[12,36,18,35,24,6,44],[27,2,47,8,39,21,31],[42,17,34,23,5,43,11],[1,46,14,38,20,30,26]],
    venusHierarchy: { usurper:1, guide:49, mystery:50, adjuster:175, leader:525, regulator:700, genGov:1400, highOverseer:68600 },
    venusAngelArabic: { usurper:320, guide:8, mystery:9, adjuster:134, leader:484, regulator:659, genGov:1359, highOverseer:68559 },
    venusAngelHebrew: { usurper:330, guide:18, mystery:19, adjuster:144, leader:494, regulator:669, genGov:1369, highOverseer:68569 },
    venusJinnArabic:  { usurper:42, guide:90, mystery:91, adjuster:216, leader:206, regulator:381, genGov:1081, highOverseer:68281 },
    venusJinnHebrew:  { usurper:32, guide:80, mystery:81, adjuster:206, leader:196, regulator:371, genGov:1071, highOverseer:68271 },
  },

  olympicSpirit: {
    name: "Olympic Spirit: Hagith", hebrewValue: 421,
    page: "731",
    hebrewSquare4x4: { numerical: [[7,101,13,397],[12,398,6,102],[99,9,399,11]] },
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.731",
    note: "Numerical Squares See Page: (not given in this PDF)",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION F — MERCURY PLANETARY CHAPTER (pp.732–749)
// ─────────────────────────────────────────────────────────────────────────────

export const MERCURY_CHAPTER = {
  planet: "Mercury",
  hebrewName: "Kokab",
  hebrewValue: 48,
  chapterPage: 732,

  sign: {
    name: "Mercury: Kokab", hebrewValue: 48,
    page: "732",
    hebrewSquare4x4: { numerical: [[21,8,18,1],[18,3,19,8],[7,17,5,19]] },
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.732",
    note: "Numerical Squares See Page: (not given)",
  },

  archangel: { name: "Archangel: Michael", hebrewValue: 101, note: "Hebrew Squares See Page: (not given); Numerical See Page: (not given)", page: "732" },
  angel: { name: "Angel: Raphael", hebrewValue: 311, note: "Numerical Squares See Page: 636", page: "732" },

  intelligence: {
    name: "Intelligence: Tiriel", hebrewValue: 260,
    page: "733",
    hebrewSquare4x4: { numerical: [[8,11,203,38],[202,39,7,12],[9,10,40,201]] },
    hebrewSquare6x6: "letter square present — see PDF p.733",
    jupiterSquare: {
      fire:  [[57,68,62,73],[72,63,65,60],[67,58,74,61],[64,71,59,66]],
      earth: [[64,67,72,57],[71,58,63,68],[59,74,65,62],[66,61,60,73]],
      air:   [[66,59,71,64],[61,74,58,67],[60,65,63,72],[73,62,68,57]],
      water: [[73,60,61,66],[62,65,74,59],[68,63,58,71],[57,72,67,64]],
      hierarchy: { usurper:57, guide:74, mystery:131, adjuster:2080, leader:6240, regulator:8320, genGov:16640, highOverseer:1231360 },
      angelArabic: { usurper:16, guide:33, mystery:90, adjuster:2039, leader:6199, regulator:8279, genGov:16599, highOverseer:1231319 },
      angelHebrew: { usurper:26, guide:43, mystery:100, adjuster:2049, leader:6209, regulator:8289, genGov:16609, highOverseer:1231329 },
      jinnArabic:  { usurper:98, guide:115, mystery:172, adjuster:1761, leader:5921, regulator:8001, genGov:16321, highOverseer:1231041 },
      jinnHebrew:  { usurper:88, guide:105, mystery:162, adjuster:1751, leader:5911, regulator:7991, genGov:16311, highOverseer:1231031 },
    },
    marsSquare: {
      fire:  [[40,64,58,52,46],[53,47,41,60,59],[61,55,54,48,42],[49,43,62,56,50],[57,51,45,44,63]],
      earth: [[63,44,45,51,57],[50,56,62,43,49],[42,48,54,55,61],[59,60,41,47,53],[46,52,58,64,40]],
      air:   [[57,49,61,53,40],[51,43,55,47,64],[45,62,54,41,58],[44,56,48,60,52],[63,50,42,59,46]],
      water: [[46,59,42,50,63],[52,60,48,56,44],[58,41,54,62,45],[64,47,55,43,51],[40,53,61,49,57]],
      hierarchy: { usurper:40, guide:64, mystery:104, adjuster:260, leader:780, regulator:1040, genGov:2080, highOverseer:133120 },
      angelArabic: { usurper:359, guide:23, mystery:63, adjuster:219, leader:739, regulator:999, genGov:2039, highOverseer:133079 },
      angelHebrew: { usurper:9, guide:33, mystery:73, adjuster:229, leader:749, regulator:1009, genGov:2049, highOverseer:133089 },
      jinnArabic:  { usurper:81, guide:105, mystery:145, adjuster:301, leader:461, regulator:721, genGov:1761, highOverseer:132801 },
      jinnHebrew:  { usurper:71, guide:95, mystery:135, adjuster:291, leader:451, regulator:711, genGov:1751, highOverseer:132791 },
    },
    sunSquare: {
      fire:  [[25,36,61,42,46,50],[31,41,52,60,29,47],[37,64,45,35,51,28],[48,27,38,53,32,62],[54,43,34,26,63,40],[65,49,30,44,39,33]],
      earth: [[65,54,48,37,31,25],[49,43,27,64,41,36],[30,34,38,45,52,61],[44,26,53,35,60,42],[39,63,32,51,29,46],[33,40,62,28,47,50]],
      air:   [[33,39,44,30,49,65],[40,63,26,34,43,54],[62,32,53,38,27,48],[28,51,35,45,64,37],[47,29,60,52,41,31],[50,46,42,61,36,25]],
      water: [[50,47,28,62,40,33],[46,29,51,32,63,39],[42,60,35,53,26,44],[61,52,45,38,34,30],[36,41,64,27,43,49],[25,31,37,48,54,65]],
      hierarchy: { usurper:25, guide:65, mystery:90, adjuster:260, leader:780, regulator:1040, genGov:2080, highOverseer:135200 },
      angelArabic: { usurper:344, guide:24, mystery:49, adjuster:219, leader:739, regulator:999, genGov:2039, highOverseer:135159 },
      angelHebrew: { usurper:354, guide:34, mystery:59, adjuster:229, leader:749, regulator:1009, genGov:2049, highOverseer:135169 },
      jinnArabic:  { usurper:66, guide:106, mystery:131, adjuster:301, leader:461, regulator:721, genGov:1761, highOverseer:134881 },
      jinnHebrew:  { usurper:56, guide:96, mystery:121, adjuster:291, leader:451, regulator:711, genGov:1751, highOverseer:134871 },
    },
    venusSquare_fire:  [[13,54,39,24,44,58,28],[59,29,14,48,40,25,45],[26,46,60,30,15,49,34],[50,35,20,47,61,31,16],[32,17,51,36,21,41,62],[42,56,33,18,52,37,22],[38,23,43,57,27,19,53]],
    venusHierarchy: { usurper:13, guide:62, mystery:75, adjuster:260, leader:780, regulator:1040, genGov:2080, highOverseer:128960 },
    venusAngelArabic: { usurper:332, guide:21, mystery:34, adjuster:219, leader:739, regulator:999, genGov:2039, highOverseer:128919 },
    venusAngelHebrew: { usurper:342, guide:31, mystery:44, adjuster:229, leader:749, regulator:1009, genGov:2049, highOverseer:128929 },
    venusJinnArabic:  { usurper:54, guide:103, mystery:116, adjuster:301, leader:461, regulator:721, genGov:1761, highOverseer:128641 },
    venusJinnHebrew:  { usurper:44, guide:93, mystery:106, adjuster:291, leader:451, regulator:711, genGov:1751, highOverseer:128631 },
    mercurySquare: {
      fire:  [[1,17,62,46,35,51,32,16],[9,25,54,38,43,59,24,8],[52,36,15,31,18,2,45,61],[60,44,7,23,26,10,37,53],[30,14,33,49,64,48,3,19],[22,6,41,57,56,40,11,27],[47,63,20,4,13,29,50,34],[39,55,28,12,5,21,58,42]],
      earth: [[39,47,22,30,60,52,9,1],[55,63,6,14,44,36,25,17],[28,20,41,33,7,15,54,62],[12,4,57,49,23,31,38,46],[5,13,56,64,26,18,43,35],[21,29,40,48,10,2,59,51],[58,50,11,3,37,45,24,32],[42,34,27,19,53,61,8,16]],
      air:   [[42,58,21,5,12,28,55,39],[34,50,29,13,4,20,63,47],[27,11,40,56,57,41,6,22],[19,3,48,64,49,33,14,30],[53,37,10,26,23,7,44,60],[61,45,2,18,31,15,36,52],[8,24,59,43,38,54,25,9],[16,32,51,35,46,62,17,1]],
      water: [[16,8,61,53,19,27,34,42],[32,24,45,37,3,11,50,58],[51,59,2,10,48,40,29,21],[35,43,18,26,64,56,13,5],[46,38,31,23,49,57,4,12],[62,54,15,7,33,41,20,28],[17,25,36,44,14,6,63,55],[1,9,52,60,30,22,47,39]],
      hierarchy: { usurper:1, guide:64, mystery:65, adjuster:260, leader:780, regulator:1040, genGov:2080, highOverseer:133120 },
      angelArabic: { usurper:320, guide:23, mystery:24, adjuster:219, leader:739, regulator:999, genGov:2039, highOverseer:133079 },
      angelHebrew: { usurper:330, guide:33, mystery:34, adjuster:229, leader:749, regulator:1009, genGov:2049, highOverseer:133089 },
      jinnArabic:  { usurper:42, guide:105, mystery:106, adjuster:301, leader:461, regulator:721, genGov:1761, highOverseer:132801 },
      jinnHebrew:  { usurper:32, guide:95, mystery:96, adjuster:291, leader:451, regulator:711, genGov:1751, highOverseer:132791 },
    },
  },

  spirit: {
    name: "Spirit: Taphthartharath", hebrewValue: 2080,
    page: "738",
    hebrewSquare4x4: { numerical: [[479,601,603,397],[602,398,478,602],[599,481,399,601]] },
    hebrewSquare7x7: "letter square present — see PDF p.738",
    jupiterSquare: {
      fire:  [[512,523,517,528],[527,518,520,515],[522,513,529,516],[519,526,514,521]],
      earth: [[519,522,527,512],[526,513,518,523],[514,529,520,517],[521,516,515,528]],
      air:   [[521,514,526,519],[516,529,513,522],[515,520,518,527],[528,517,523,512]],
      water: [[528,515,516,521],[517,520,529,514],[523,518,513,526],[512,527,522,519]],
      hierarchy: { usurper:512, guide:529, mystery:1041, adjuster:16640, leader:49920, regulator:66560, genGov:133120, highOverseer:70420480 },
      angelArabic: { usurper:471, guide:488, mystery:1000, adjuster:16599, leader:49879, regulator:66519, genGov:133079, highOverseer:70420439 },
      angelHebrew: { usurper:481, guide:498, mystery:1010, adjuster:16609, leader:49889, regulator:66529, genGov:133089, highOverseer:70420449 },
      jinnArabic:  { usurper:193, guide:210, mystery:722, adjuster:16321, leader:49601, regulator:66241, genGov:132801, highOverseer:70420161 },
      jinnHebrew:  { usurper:183, guide:200, mystery:712, adjuster:16311, leader:49591, regulator:66231, genGov:132791, highOverseer:70420151 },
    },
    marsSquare: {
      fire:  [[404,428,422,416,410],[417,411,405,424,423],[425,419,418,412,406],[413,407,426,420,414],[421,415,409,408,427]],
      earth: [[427,408,409,415,421],[414,420,426,407,413],[406,412,418,419,425],[423,424,405,411,417],[410,416,422,428,404]],
      air:   [[421,413,425,417,404],[415,407,419,411,428],[409,426,418,405,422],[408,420,412,424,416],[427,414,406,423,410]],
      water: [[410,423,406,414,427],[416,424,412,420,408],[422,405,418,426,409],[428,411,419,407,415],[404,417,425,413,421]],
      hierarchy: { usurper:404, guide:428, mystery:832, adjuster:2080, leader:6240, regulator:8320, genGov:16640, highOverseer:7121920 },
      angelArabic: { usurper:363, guide:387, mystery:791, adjuster:2039, leader:6199, regulator:8279, genGov:16599, highOverseer:7121879 },
      angelHebrew: { usurper:373, guide:397, mystery:801, adjuster:2049, leader:6209, regulator:8289, genGov:16609, highOverseer:7121889 },
      jinnArabic:  { usurper:85, guide:109, mystery:513, adjuster:1761, leader:5921, regulator:8001, genGov:16321, highOverseer:7121601 },
      jinnHebrew:  { usurper:75, guide:99, mystery:503, adjuster:1751, leader:5911, regulator:7991, genGov:16311, highOverseer:7121591 },
    },
    sunSquare: {
      fire:  [[329,340,361,346,350,354],[335,345,356,360,333,351],[341,364,349,339,355,332],[352,331,342,357,336,362],[358,347,338,330,363,344],[365,353,334,348,343,337]],
      earth: [[365,358,352,341,335,329],[353,347,331,364,345,340],[334,338,342,349,356,361],[348,330,357,339,360,346],[343,363,336,355,333,350],[337,344,362,332,351,354]],
      air:   [[337,343,348,334,353,365],[344,363,330,338,347,358],[362,336,357,342,331,352],[332,355,339,349,364,341],[351,333,360,356,345,335],[354,350,346,361,340,329]],
      water: [[354,351,332,362,344,337],[350,333,355,336,363,343],[346,360,339,357,330,348],[361,356,349,342,338,334],[340,345,364,331,347,353],[329,335,341,352,358,365]],
      hierarchy: { usurper:329, guide:365, mystery:694, adjuster:2080, leader:6240, regulator:8320, genGov:16640, highOverseer:6073600 },
      angelArabic: { usurper:288, guide:324, mystery:653, adjuster:2039, leader:6199, regulator:8279, genGov:16599, highOverseer:6073559 },
      angelHebrew: { usurper:298, guide:334, mystery:663, adjuster:2049, leader:6209, regulator:8289, genGov:16609, highOverseer:6073569 },
      jinnArabic:  { usurper:10, guide:46, mystery:375, adjuster:1761, leader:5921, regulator:8001, genGov:16321, highOverseer:6073281 },
      jinnHebrew:  { usurper:360, guide:36, mystery:365, adjuster:1751, leader:5911, regulator:7991, genGov:16311, highOverseer:6073271 },
    },
    venusSquare: {
      fire:  [[273,314,299,284,304,318,288],[319,289,274,308,300,285,305],[286,306,320,290,275,309,294],[310,295,280,307,321,291,276],[292,277,311,296,281,301,322],[302,316,293,278,312,297,282],[298,283,303,317,287,279,313]],
      earth: [[298,302,292,310,286,319,273],[283,316,277,295,306,289,314],[303,293,311,280,320,274,299],[317,278,296,307,290,308,284],[287,312,281,321,275,300,304],[279,297,301,291,309,285,318],[313,282,322,276,294,305,288]],
      air:   [[313,279,287,317,303,283,298],[282,297,312,278,293,316,302],[322,301,281,296,311,277,292],[276,291,321,307,280,295,310],[294,309,275,290,320,306,286],[305,285,300,308,274,289,319],[288,318,304,284,299,314,273]],
      water: [[288,305,294,276,322,282,313],[318,285,309,291,301,297,279],[304,300,275,321,281,312,287],[284,308,290,307,296,278,317],[299,274,320,280,311,293,303],[314,289,306,295,277,316,283],[273,319,286,310,292,302,298]],
      hierarchy: { usurper:273, guide:322, mystery:595, adjuster:2080, leader:6240, regulator:8320, genGov:16640, highOverseer:5358080 },
      angelArabic: { usurper:232, guide:281, mystery:554, adjuster:2039, leader:6199, regulator:8279, genGov:16599, highOverseer:5358039 },
      angelHebrew: { usurper:242, guide:291, mystery:564, adjuster:2049, leader:6209, regulator:8289, genGov:16609, highOverseer:5358049 },
      jinnArabic:  { usurper:314, guide:3, mystery:276, adjuster:1761, leader:5921, regulator:8001, genGov:16321, highOverseer:5357761 },
      jinnHebrew:  { usurper:304, guide:353, mystery:266, adjuster:1751, leader:5911, regulator:7991, genGov:16311, highOverseer:5357751 },
    },
    mercuryHierarchy: { usurper:228, guide:295, mystery:523, adjuster:2080, leader:6240, regulator:8320, genGov:16640, highOverseer:4908800 },
    mercuryAngelArabic: { usurper:187, guide:254, mystery:482, adjuster:2039, leader:6199, regulator:8279, genGov:16599, highOverseer:4908759 },
    mercuryAngelHebrew: { usurper:197, guide:264, mystery:492, adjuster:2049, leader:6209, regulator:8289, genGov:16609, highOverseer:4908769 },
    mercuryJinnArabic:  { usurper:269, guide:336, mystery:204, adjuster:1761, leader:5921, regulator:8001, genGov:16321, highOverseer:4908481 },
    mercuryJinnHebrew:  { usurper:259, guide:326, mystery:194, adjuster:1751, leader:5911, regulator:7991, genGov:16311, highOverseer:4908471 },
    moonHierarchy: { usurper:191, guide:272, mystery:463, adjuster:2080, leader:6240, regulator:8320, genGov:16640, highOverseer:4526080 },
    moonAngelArabic: { usurper:150, guide:231, mystery:422, adjuster:2039, leader:6199, regulator:8279, genGov:16599, highOverseer:4526039 },
    moonAngelHebrew: { usurper:160, guide:241, mystery:432, adjuster:2049, leader:6209, regulator:8289, genGov:16609, highOverseer:4526049 },
    moonJinnArabic:  { usurper:232, guide:313, mystery:144, adjuster:1761, leader:5921, regulator:8001, genGov:16321, highOverseer:4525761 },
    moonJinnHebrew:  { usurper:222, guide:303, mystery:134, adjuster:1751, leader:5911, regulator:7991, genGov:16311, highOverseer:4525751 },
    saturnHierarchy: { usurper:158, guide:262, mystery:420, adjuster:2080, leader:6240, regulator:8320, genGov:16640, highOverseer:4359680 },
    saturnAngelArabic: { usurper:117, guide:221, mystery:379, adjuster:2039, leader:6199, regulator:8279, genGov:16599, highOverseer:4359639 },
    saturnAngelHebrew: { usurper:127, guide:231, mystery:389, adjuster:2049, leader:6209, regulator:8289, genGov:16609, highOverseer:4359649 },
    saturnJinnArabic:  { usurper:199, guide:303, mystery:101, adjuster:1761, leader:5921, regulator:8001, genGov:16321, highOverseer:4359361 },
    saturnJinnHebrew:  { usurper:189, guide:293, mystery:91, adjuster:1751, leader:5911, regulator:7991, genGov:16311, highOverseer:4359351 },
  },

  olympicSpirit: {
    name: "Olympic Spirit: Ophiel", hebrewValue: 128,
    page: "746",
    hebrewSquare4x4: { numerical: [[6,81,13,28],[12,29,5,82],[79,8,30,11]] },
    hebrewSquare6x6: "letter square present — see PDF p.746",
    jupiterSquare: {
      fire:  [[24,35,29,40],[39,30,32,27],[34,25,41,28],[31,38,26,33]],
      earth: [[31,34,39,24],[38,25,30,35],[26,41,32,29],[33,28,27,40]],
      air:   [[33,26,38,31],[28,41,25,34],[27,32,30,39],[40,29,35,24]],
      water: [[40,27,28,33],[29,32,41,26],[35,30,25,38],[24,39,34,31]],
      hierarchy: { usurper:24, guide:41, mystery:65, adjuster:1024, leader:3072, regulator:4096, genGov:8192, highOverseer:335872 },
      angelArabic: { usurper:343, guide:360, mystery:24, adjuster:983, leader:3031, regulator:4055, genGov:8151, highOverseer:335831 },
      angelHebrew: { usurper:353, guide:10, mystery:34, adjuster:993, leader:3041, regulator:4065, genGov:8161, highOverseer:335841 },
      jinnArabic:  { usurper:65, guide:82, mystery:106, adjuster:705, leader:2753, regulator:3777, genGov:7873, highOverseer:335553 },
      jinnHebrew:  { usurper:55, guide:72, mystery:96, adjuster:695, leader:2743, regulator:3767, genGov:7863, highOverseer:335543 },
    },
    marsSquare: {
      fire:  [[13,40,31,25,19],[26,20,14,36,32],[37,28,27,21,15],[22,16,38,29,23],[30,24,18,17,39]],
      earth: [[39,17,18,24,30],[23,29,38,16,22],[15,21,27,28,37],[32,36,14,20,26],[19,25,31,40,13]],
      air:   [[30,22,37,26,13],[24,16,28,20,40],[18,38,27,14,31],[17,29,21,36,25],[39,23,15,32,19]],
      water: [[19,32,15,23,39],[25,36,21,29,17],[31,14,27,38,18],[40,20,28,16,24],[13,26,37,22,30]],
      hierarchy: { usurper:13, guide:40, mystery:53, adjuster:128, leader:384, regulator:512, genGov:1024, highOverseer:40960 },
      angelArabic: { usurper:332, guide:359, mystery:12, adjuster:87, leader:343, regulator:471, genGov:983, highOverseer:40919 },
      angelHebrew: { usurper:342, guide:9, mystery:22, adjuster:97, leader:353, regulator:481, genGov:993, highOverseer:40929 },
      jinnArabic:  { usurper:54, guide:81, mystery:94, adjuster:169, leader:65, regulator:193, genGov:705, highOverseer:40641 },
      jinnHebrew:  { usurper:44, guide:71, mystery:84, adjuster:159, leader:55, regulator:183, genGov:695, highOverseer:40631 },
    },
    sunSquare: {
      fire:  [[3,14,39,20,24,28],[9,19,30,38,7,25],[15,42,23,13,29,6],[26,5,16,31,10,40],[32,21,12,4,41,18],[43,27,8,22,17,11]],
      earth: [[43,32,26,15,9,3],[27,21,5,42,19,14],[8,12,16,23,30,39],[22,4,31,13,38,20],[17,41,10,29,7,24],[11,18,40,6,25,28]],
      air:   [[11,17,22,8,27,43],[18,41,4,12,21,32],[40,10,31,16,5,26],[6,29,13,23,42,15],[25,7,38,30,19,9],[28,24,20,39,14,3]],
      water: [[28,25,6,40,18,11],[24,7,29,10,41,17],[20,38,13,31,4,22],[39,30,23,16,12,8],[14,19,42,5,21,27],[3,9,15,26,32,43]],
      hierarchy: { usurper:3, guide:43, mystery:46, adjuster:128, leader:384, regulator:512, genGov:1024, highOverseer:44032 },
      angelArabic: { usurper:322, guide:2, mystery:5, adjuster:87, leader:343, regulator:471, genGov:983, highOverseer:43991 },
      angelHebrew: { usurper:332, guide:12, mystery:15, adjuster:97, leader:353, regulator:481, genGov:993, highOverseer:44001 },
      jinnArabic:  { usurper:44, guide:84, mystery:87, adjuster:169, leader:65, regulator:193, genGov:705, highOverseer:43713 },
      jinnHebrew:  { usurper:34, guide:74, mystery:77, adjuster:159, leader:55, regulator:183, genGov:695, highOverseer:43703 },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION G — MOON PLANETARY CHAPTER (pp.750–761)
// ─────────────────────────────────────────────────────────────────────────────

export const MOON_CHAPTER = {
  planet: "Moon",
  hebrewName: "Levanah",
  hebrewValue: 87,
  chapterPage: 750,

  sign: {
    name: "Moon: Levanah", hebrewValue: 87,
    note: "Numerical Squares See Page: 630",
    page: "750",
    hebrewSquare4x4: { numerical: [[29,3,53,2],[52,3,28,4],[1,31,4,51]] },
    hebrewSquare4x4_letter: "4×4 letter square present — see PDF p.750",
  },

  archangel: {
    name: "Archangel: Gabriel", hebrewValue: 246,
    note: "Numerical Squares See Page: 79",
    page: "750",
    hebrewSquare4x4: { numerical: [[2,3,203,38],[202,39,1,4],[1,4,40,201]] },
    hebrewSquare6x6: "letter square present — see PDF p.750",
  },

  angel: {
    name: "Angel: Gabriel", hebrewValue: 246,
    note: "Hebrew Squares See Page: 750; Numerical Squares See Page: 79",
    page: "751",
  },

  intelligence: {
    name: "Intelligence: Malka be-Tarshishim ve-ad be-Ruah Shehakim", hebrewValue: 3321,
    page: "751",
    hebrewWordSquare: {
      words: ["Malka (מלכא)", "be-Tarshishim (בתרשישים)", "ve-ad (ועד)", "Ruah (רוחות)", "Shehakim (שחלים)"],
      numericalSquare: [[90,1583,703,945],[702,946,89,1584],[1581,92,947,701]],
      note: "5×5 and 4×4 letter squares present — see PDF p.751",
    },
    jupiterSquare: {
      fire:  [[822,833,827,839],[838,828,830,825],[832,823,840,826],[829,837,824,831]],
      earth: [[829,832,838,822],[837,823,828,833],[824,840,830,827],[831,826,825,839]],
      air:   [[831,824,837,829],[826,840,823,832],[825,830,828,838],[839,827,833,822]],
      water: [[839,825,826,831],[827,830,840,824],[833,828,823,837],[822,838,832,829]],
      hierarchy: { usurper:822, guide:840, mystery:1662, adjuster:26568, leader:79704, regulator:106272, genGov:212544, highOverseer:178536960 },
      angelArabic: { usurper:781, guide:799, mystery:1621, adjuster:26527, leader:79663, regulator:106231, genGov:212503, highOverseer:178536919 },
      angelHebrew: { usurper:791, guide:809, mystery:1631, adjuster:26537, leader:79673, regulator:106241, genGov:212513, highOverseer:178536929 },
      jinnArabic:  { usurper:503, guide:521, mystery:1343, adjuster:26249, leader:79385, regulator:105953, genGov:212225, highOverseer:178536641 },
      jinnHebrew:  { usurper:493, guide:511, mystery:1333, adjuster:26239, leader:79375, regulator:105943, genGov:212215, highOverseer:178536631 },
    },
    marsSquare: {
      fire:  [[652,677,670,664,658],[665,659,653,673,671],[674,667,666,660,654],[661,655,675,668,662],[669,663,657,656,676]],
      earth: [[676,656,657,663,669],[662,668,675,655,661],[654,660,666,667,674],[671,673,653,659,665],[658,664,670,677,652]],
      air:   [[669,661,674,665,652],[663,655,667,659,677],[657,675,666,653,670],[656,668,660,673,664],[676,662,654,671,658]],
      water: [[658,671,654,662,676],[664,673,660,668,656],[670,653,666,675,657],[677,659,667,655,663],[652,665,674,661,669]],
      hierarchy: { usurper:652, guide:677, mystery:1329, adjuster:3321, leader:9963, regulator:13284, genGov:26568, highOverseer:17986536 },
      angelArabic: { usurper:611, guide:636, mystery:1288, adjuster:3280, leader:9922, regulator:13243, genGov:26527, highOverseer:17986495 },
      angelHebrew: { usurper:621, guide:646, mystery:1298, adjuster:3290, leader:9932, regulator:13253, genGov:26537, highOverseer:17986505 },
      jinnArabic:  { usurper:333, guide:358, mystery:1010, adjuster:3002, leader:9644, regulator:12965, genGov:26249, highOverseer:17986217 },
      jinnHebrew:  { usurper:323, guide:348, mystery:1000, adjuster:2992, leader:9634, regulator:12955, genGov:26239, highOverseer:17986207 },
    },
    sunSquare: {
      fire:  [[536,547,567,553,557,561],[542,552,563,566,540,558],[548,570,556,546,562,539],[559,538,549,564,543,568],[565,554,545,537,569,551],[571,560,541,555,550,544]],
      earth: [[571,565,559,548,542,536],[560,554,538,570,552,547],[541,545,549,556,563,567],[555,537,564,546,566,553],[550,569,543,562,540,557],[544,551,568,539,558,561]],
      air:   [[544,550,555,541,560,571],[551,569,537,545,554,565],[568,543,564,549,538,559],[539,562,546,556,570,548],[558,540,566,563,552,542],[561,557,553,567,547,536]],
      water: [[561,558,539,568,551,544],[557,540,562,543,569,550],[553,566,546,564,537,555],[567,563,556,549,545,541],[547,552,570,538,554,560],[536,542,548,559,565,571]],
      hierarchy: { usurper:536, guide:571, mystery:1107, adjuster:3321, leader:9963, regulator:13284, genGov:26568, highOverseer:15170328 },
      angelArabic: { usurper:495, guide:530, mystery:1066, adjuster:3280, leader:9922, regulator:13243, genGov:26527, highOverseer:15170287 },
      angelHebrew: { usurper:505, guide:540, mystery:1076, adjuster:3290, leader:9932, regulator:13253, genGov:26537, highOverseer:15170297 },
      jinnArabic:  { usurper:217, guide:252, mystery:788, adjuster:3002, leader:9644, regulator:12965, genGov:26249, highOverseer:15170009 },
      jinnHebrew:  { usurper:207, guide:242, mystery:778, adjuster:2992, leader:9634, regulator:12955, genGov:26239, highOverseer:15169999 },
    },
    venusSquare: {
      fire:  [[450,491,476,461,481,497,465],[498,466,451,485,477,462,482],[463,483,499,467,452,486,471],[487,472,457,484,500,468,453],[469,454,488,473,458,478,501],[479,495,470,455,489,474,459],[475,460,480,496,464,456,490]],
      earth: [[475,479,469,487,463,498,450],[460,495,454,472,483,466,491],[480,470,488,457,499,451,476],[496,455,473,484,467,485,461],[464,489,458,500,452,477,481],[456,474,478,468,486,462,497],[490,459,501,453,471,482,465]],
      air:   [[490,456,464,496,480,460,475],[459,474,489,455,470,495,479],[501,478,458,473,488,454,469],[453,468,500,484,457,472,487],[471,486,452,467,499,483,463],[482,462,477,485,451,466,498],[465,497,481,461,476,491,450]],
      water: [[465,482,471,453,501,459,490],[497,462,486,468,478,474,456],[481,477,452,500,458,489,464],[461,485,467,484,473,455,496],[476,451,499,457,488,470,480],[491,466,483,472,454,495,460],[450,498,463,487,469,479,475]],
      hierarchy: { usurper:450, guide:501, mystery:951, adjuster:3321, leader:9963, regulator:13284, genGov:26568, highOverseer:13310568 },
      angelArabic: { usurper:409, guide:460, mystery:910, adjuster:3280, leader:9922, regulator:13243, genGov:26527, highOverseer:13310527 },
      angelHebrew: { usurper:419, guide:470, mystery:920, adjuster:3290, leader:9932, regulator:13253, genGov:26537, highOverseer:13310537 },
      jinnArabic:  { usurper:131, guide:182, mystery:632, adjuster:3002, leader:9644, regulator:12965, genGov:26249, highOverseer:13310249 },
      jinnHebrew:  { usurper:121, guide:172, mystery:622, adjuster:2992, leader:9634, regulator:12955, genGov:26239, highOverseer:13310239 },
    },
    mercuryHierarchy: { usurper:383, guide:451, mystery:834, adjuster:3321, leader:9963, regulator:13284, genGov:26568, highOverseer:11982168 },
    mercuryAngelArabic: { usurper:342, guide:410, mystery:793, adjuster:3280, leader:9922, regulator:13243, genGov:26527, highOverseer:11982127 },
    mercuryAngelHebrew: { usurper:352, guide:420, mystery:803, adjuster:3290, leader:9932, regulator:13253, genGov:26537, highOverseer:11982137 },
    mercuryJinnArabic:  { usurper:64, guide:132, mystery:515, adjuster:3002, leader:9644, regulator:12965, genGov:26249, highOverseer:11981849 },
    mercuryJinnHebrew:  { usurper:54, guide:122, mystery:505, adjuster:2992, leader:9634, regulator:12955, genGov:26239, highOverseer:11981839 },
    moonHierarchy: { usurper:329, guide:409, mystery:738, adjuster:3321, leader:9963, regulator:13284, genGov:26568, highOverseer:10866312 },
    moonAngelArabic: { usurper:288, guide:368, mystery:697, adjuster:3280, leader:9922, regulator:13243, genGov:26527, highOverseer:10866271 },
    moonAngelHebrew: { usurper:298, guide:378, mystery:707, adjuster:3290, leader:9932, regulator:13253, genGov:26537, highOverseer:10866281 },
    moonJinnArabic:  { usurper:10, guide:90, mystery:419, adjuster:3002, leader:9644, regulator:12965, genGov:26249, highOverseer:10865993 },
    moonJinnHebrew:  { usurper:360, guide:80, mystery:409, adjuster:2992, leader:9634, regulator:12955, genGov:26239, highOverseer:10865983 },
    saturnHierarchy: { usurper:282, guide:387, mystery:669, adjuster:3321, leader:9963, regulator:13284, genGov:26568, highOverseer:10281816 },
    saturnAngelArabic: { usurper:241, guide:346, mystery:628, adjuster:3280, leader:9922, regulator:13243, genGov:26527, highOverseer:10281775 },
    saturnAngelHebrew: { usurper:251, guide:356, mystery:638, adjuster:3290, leader:9932, regulator:13253, genGov:26537, highOverseer:10281785 },
    saturnJinnArabic:  { usurper:323, guide:68, mystery:350, adjuster:3002, leader:9644, regulator:12965, genGov:26249, highOverseer:10281497 },
    saturnJinnHebrew:  { usurper:313, guide:58, mystery:340, adjuster:2992, leader:9634, regulator:12955, genGov:26239, highOverseer:10281487 },
  },

  spirit: {
    name: "Spirit: Chashmodai", hebrewValue: 369,
    note: "Numerical Squares See Page: 169",
    page: "760",
    hebrewSquare4x4: { numerical: [[307,47,8,7],[7,8,306,48],[45,309,9,6]] },
    hebrewSquare7x7: "letter square present — see PDF p.760",
  },

  olympicSpirit: {
    name: "Olympic Spirit: Phul", hebrewValue: 116,
    note: "Hebrew Squares Not Available; Numerical Squares See Page: 310",
    page: "761",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION H — COMPLETE PLANETARY ENTITY CATALOG
// ─────────────────────────────────────────────────────────────────────────────

export const PLANETARY_ENTITY_CATALOG = {
  saturn: {
    sign:          { name: "Shabtai", hebrewValue: 713, note: "Confirmed from prior Saturn chapter (pp.654–673)" },
    archangel:     { name: "Tzaphqiel", hebrewValue: 351, note: "Numerical See Page: 280" },
    angel:         { name: "Cassiel", hebrewValue: 200, note: "See prior Saturn pages" },
    intelligence:  { name: "Agiel", hebrewValue: 45, note: "See prior Saturn pages" },
    spirit:        { name: "Zazel", hebrewValue: 45, note: "See prior Saturn pages" },
    olympicSpirit: { name: "Aratron", hebrewValue: 260, note: "See prior pages" },
  },
  jupiter: {
    sign:          { name: "Tzedek", hebrewValue: 194, page: 674, noHebrewSquares: true },
    archangel:     { name: "Tzadqiel", hebrewValue: 235, page: 677 },
    angel:         { name: "Sachiel", hebrewValue: 109, page: 681 },
    intelligence:  { name: "Iophiel", hebrewValue: 136, page: 683 },
    spirit:        { name: "Hismael", hebrewValue: 136, page: 685, note: "Numerical See Page: 683" },
    olympicSpirit: { name: "Bethor", hebrewValue: 618, page: 686 },
  },
  mars: {
    sign:          { name: "Madim", hebrewValue: 94, page: 695 },
    archangel:     { name: "Kamael", hebrewValue: 91, page: 697, note: "Numerical See Page: 401" },
    angel:         { name: "Zamael", hebrewValue: 78, page: 697, note: "Numerical See Page: 91" },
    intelligence:  { name: "Graphiel", hebrewValue: 325, page: 697, note: "Numerical See Page: 441" },
    spirit:        { name: "Bartzabel", hebrewValue: 325, page: 698, note: "Numerical See Page: 441" },
    olympicSpirit: { name: "Phaleg", hebrewValue: 113, page: 698, noHebrewSquares: true },
  },
  sun: {
    sign:          { name: "Shemesh", hebrewValue: 640, page: 701, noHebrewSquares: true },
    archangel:     { name: "Raphael", hebrewValue: 311, page: 709, note: "Numerical See Page: 636" },
    angel:         { name: "Michael", hebrewValue: 101, page: 710, note: "Hebrew See Page: 600; Numerical See Page: 247" },
    intelligence:  { name: "Nakhiel", hebrewValue: 111, page: 710 },
    spirit:        { name: "Sorath", hebrewValue: 666, page: 713 },
    olympicSpirit: { name: "Och", hebrewValue: 15, page: 721, noHebrewSquares: true },
  },
  venus: {
    sign:          { name: "Nogah", hebrewValue: 64, page: 722 },
    archangel:     { name: "Haniel", hebrewValue: 97, page: 723 },
    angel:         { name: "Anael", hebrewValue: 82, page: 725, note: "3×3 square not possible" },
    intelligence:  { name: "Hagiel", hebrewValue: 49, page: 726 },
    spirit:        { name: "Kedemel", hebrewValue: 175, page: 727 },
    olympicSpirit: { name: "Hagith", hebrewValue: 421, page: 731 },
  },
  mercury: {
    sign:          { name: "Kokab", hebrewValue: 48, page: 732 },
    archangel:     { name: "Michael", hebrewValue: 101, page: 732 },
    angel:         { name: "Raphael", hebrewValue: 311, page: 732, note: "Numerical See Page: 636" },
    intelligence:  { name: "Tiriel", hebrewValue: 260, page: 733 },
    spirit:        { name: "Taphthartharath", hebrewValue: 2080, page: 738 },
    olympicSpirit: { name: "Ophiel", hebrewValue: 128, page: 746 },
  },
  moon: {
    sign:          { name: "Levanah", hebrewValue: 87, page: 750, note: "Numerical See Page: 630" },
    archangel:     { name: "Gabriel", hebrewValue: 246, page: 750, note: "Numerical See Page: 79" },
    angel:         { name: "Gabriel", hebrewValue: 246, page: 751, note: "Hebrew See Page: 750; Numerical See Page: 79" },
    intelligence:  { name: "Malka be-Tarshishim ve-ad be-Ruah Shehakim", hebrewValue: 3321, page: 751 },
    spirit:        { name: "Chashmodai", hebrewValue: 369, page: 760, note: "Numerical See Page: 169" },
    olympicSpirit: { name: "Phul", hebrewValue: 116, page: 761, noHebrewSquares: true, note: "Numerical See Page: 310" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION I — HIGH OVERSEER VERIFICATION — PLANETARY CHAPTERS
// ─────────────────────────────────────────────────────────────────────────────
export const PLANETARY_HO_VERIFICATION = {
  rule: "HighOverseer = GenGov × Guide",
  verified: true,
  examples: [
    // Jupiter chapter
    { entity:"Jupiter Sign Jupiter-sq", genGov:12416, guide:56, result:695296 },
    { entity:"Jupiter Sign Mars-sq", genGov:1552, guide:54, result:83808 },
    { entity:"Tzadqiel Jupiter-sq", genGov:15040, guide:67, result:1007680 },
    { entity:"Tzadqiel Mars-sq", genGov:1880, guide:59, result:110920 },
    { entity:"Sachiel Jupiter-4x4", genGov:6976, guide:37, result:258112 },
    { entity:"Sachiel Mars-sq", genGov:872, guide:37, result:32264 },
    { entity:"Iophiel Jupiter-sq", genGov:8704, guide:43, result:374272 },
    { entity:"Iophiel Mars-sq", genGov:1088, guide:40, result:43520 },
    { entity:"Bethor Jupiter-sq", genGov:39552, guide:162, result:6407424 },
    { entity:"Bethor Mars-sq", genGov:4944, guide:138, result:682272 },
    // Mars chapter
    { entity:"Madim Jupiter-sq", genGov:6016, guide:31, result:186496 },
    { entity:"Madim Mars-sq", genGov:752, guide:34, result:25568 },
    { entity:"Phaleg Jupiter-sq", genGov:7232, guide:38, result:274816 },
    { entity:"Phaleg Mars-sq", genGov:904, guide:37, result:33448 },
    // Sun chapter
    { entity:"Shemesh Jupiter-sq", genGov:40960, guide:169, result:6922240 },
    { entity:"Shemesh Mars-sq", genGov:5120, guide:140, result:716800 },
    { entity:"Shemesh Sun-sq", genGov:5120, guide:125, result:640000 },
    { entity:"Nakhiel Jupiter-4x4", genGov:7104, guide:36, result:255744 },
    { entity:"Nakhiel Mars-sq", genGov:888, guide:35, result:31080 },
    { entity:"Sorath Jupiter-sq", genGov:42624, guide:174, result:7416576 },
    { entity:"Sorath Mars-sq", genGov:5328, guide:146, result:777888 },
    // Venus chapter
    { entity:"Nogah Jupiter-sq", genGov:4096, guide:25, result:102400 },
    { entity:"Haniel Jupiter-4x4", genGov:6208, guide:34, result:211072 },
    { entity:"Anael Jupiter-sq", genGov:5248, guide:28, result:146944 },
    { entity:"Anael Mars-sq", genGov:656, guide:30, result:19680 },
    { entity:"Hagiel Jupiter-sq", genGov:3136, guide:22, result:68992 },
    { entity:"Kedemel Jupiter-sq", genGov:11200, guide:52, result:582400 },
    { entity:"Kedemel Mars-sq", genGov:1400, guide:47, result:65800 },
    { entity:"Kedemel Sun-sq", genGov:1400, guide:50, result:70000 },
    { entity:"Kedemel Venus-sq", genGov:1400, guide:49, result:68600 },
    // Mercury chapter
    { entity:"Tiriel Jupiter-sq", genGov:16640, guide:74, result:1231360 },
    { entity:"Tiriel Mars-sq", genGov:2080, guide:64, result:133120 },
    { entity:"Taphthartharath Jupiter-sq", genGov:133120, guide:529, result:70420480 },
    { entity:"Taphthartharath Mars-sq", genGov:16640, guide:428, result:7121920 },
    { entity:"Ophiel Jupiter-sq", genGov:8192, guide:41, result:335872 },
    { entity:"Ophiel Mars-sq", genGov:1024, guide:40, result:40960 },
    { entity:"Ophiel Sun-sq", genGov:1024, guide:43, result:44032 },
    // Moon chapter
    { entity:"Malka Jupiter-sq", genGov:212544, guide:840, result:178536960 },
    { entity:"Malka Mars-sq", genGov:26568, guide:677, result:17986536 },
    { entity:"Malka Sun-sq", genGov:26568, guide:571, result:15170328 },
    { entity:"Malka Venus-sq", genGov:26568, guide:501, result:13310568 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION J — PROCESSING LOG
// ─────────────────────────────────────────────────────────────────────────────
export const PLANETARY_CHAPTERS_LOG = {
  id: "PDF-PLANETARY-PP669-761",
  date_added: "2026-06-07",
  source: "PDF: fc8b629f4_Occult_Encyclopedia_...-710-802.pdf",
  bookPagesProcessed: "669–761 (93 pages)",
  chaptersProcessed: [
    "Mercury chapter continuation pp.669–673 (8×8 Mercury + 9×9 Moon + 10×10 Saturn continuation)",
    "Jupiter planetary chapter pp.674–693 (Sign Tzedek, Archangel Tzadqiel, Angel Sachiel, Intelligence Iophiel, Spirit Hismael, Olympic Spirit Bethor)",
    "Mars planetary chapter pp.694–700 (Sign Madim, Archangel Kamael, Angel Zamael, Intelligence Graphiel, Spirit Bartzabel, Olympic Spirit Phaleg)",
    "Sun planetary chapter pp.701–721 (Sign Shemesh, Archangel Raphael, Angel Michael, Intelligence Nakhiel, Spirit Sorath, Olympic Spirit Och)",
    "Venus planetary chapter pp.722–731 (Sign Nogah, Archangel Haniel, Angel Anael, Intelligence Hagiel, Spirit Kedemel, Olympic Spirit Hagith)",
    "Mercury planetary chapter pp.732–749 (Sign Kokab, Archangel Michael, Angel Raphael, Intelligence Tiriel, Spirit Taphthartharath, Olympic Spirit Ophiel)",
    "Moon planetary chapter pp.750–761 (Sign Levanah, Archangel Gabriel, Angel Gabriel, Intelligence Malka be-Tarshishim, Spirit Chashmodai, Olympic Spirit Phul)",
  ],
  entitiesExtracted: 36,
  newEntityTypes: ["Olympic Spirit (NEW TYPE)", "Intelligence (planetary)", "Spirit (planetary)", "Planet Sign (planetary)"],
  newPlanetaryTablesAdded: 180,
  criticalFindings: [
    "HighOverseer = GenGov × Guide confirmed on ALL planetary entities — zero exceptions ever",
    "FIRST COMPLETE planetary chapter data in database",
    "Olympic Spirits: Bethor(618/Jupiter), Phaleg(113/Mars), Och(15/Sun), Hagith(421/Venus), Ophiel(128/Mercury), Phul(116/Moon)",
    "Intelligences: Iophiel(136/Jupiter), Graphiel(325/Mars), Nakhiel(111/Sun), Hagiel(49/Venus), Tiriel(260/Mercury), Malka be-Tarshishim(3321/Moon)",
    "Spirits: Hismael(136/Jupiter), Bartzabel(325/Mars), Sorath(666/Sun), Kedemel(175/Venus), Taphthartharath(2080/Mercury), Chashmodai(369/Moon)",
    "Spirit Taphthartharath(2080) has highest value of any Mercury entity — Jupiter square usurper=512",
    "Intelligence Malka be-Tarshishim(3321) = Moon total — Jupiter square usurper=822, guide=840",
    "Spirit Sorath(666) confirms Sun 6×6 number system — esoteric number 666",
    "Jupiter Sign Tzedek(194) = No Hebrew Squares Available",
    "Sun Sign Shemesh(640) = No Hebrew Squares Available",
    "Mars Intelligence Graphiel and Spirit Bartzabel are both 325 — same value",
    "Mercury Intelligence Tiriel(260) = Mercury 8×8 magic constant (MC=260 for standard 8×8)",
    "Pages 762–802 still needed (Moon continuation beyond Chashmodai)",
  ],
  remainingMissing: "Moon chapter pp.762+ (if any — this appears to be the end or near-end of the book)",
};

export default {
  MERCURY_CHAPTER_CONTINUATION,
  JUPITER_CHAPTER, MARS_CHAPTER, SUN_CHAPTER,
  VENUS_CHAPTER, MERCURY_CHAPTER, MOON_CHAPTER,
  PLANETARY_ENTITY_CATALOG,
  PLANETARY_HO_VERIFICATION, PLANETARY_CHAPTERS_LOG,
};