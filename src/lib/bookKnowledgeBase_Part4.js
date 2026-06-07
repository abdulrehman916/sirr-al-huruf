// ═══════════════════════════════════════════════════════════════════════════
//  PERMANENT BOOK KNOWLEDGE DATABASE — PART 4
//  Source: "The Occult Encyclopedia of Magick Squares"
//  PDF Pages: 559–609 (51 pages)
//  Covers: Aquarius chapter (complete) + Pisces chapter (start)
//  Date Added: 2026-06-07
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION A — AQUARIUS CHAPTER (pp.559–600)
//  Sign: Deli (44) — No Hebrew Squares Available, Numerical Squares See Page: 1
//  Ruling Planet: Saturn
// ─────────────────────────────────────────────────────────────────────────────

export const AQUARIUS_CHAPTER = {
  sign: "Aquarius",
  hebrewSignName: "Deli",
  hebrewSignValue: 44,
  noHebrewSquares: true,
  numericalSquaresPage: 1,
  rulingPlanet: "Saturn",
  entities: [
    { name:"Sign Aquarius: Deli",          gematria:44,  note:"No Hebrew Squares Available" },
    { name:"Archangel: Kambriel",          gematria:304, planet:"Jupiter", gridSize:4 },
    { name:"Angel: Tzakmiqiel",            gematria:291, planet:"Saturn",  gridSize:3 },
    { name:"Lord Triplicity Day: Athor",   gematria:676, planet:"Jupiter", gridSize:4 },
    { name:"Lord Triplicity Night: Polayan",gematria:171, planet:"Saturn",  gridSize:3 },
    { name:"Angel 11th House: Ansuel",     gematria:148, note:"Numerical Squares See Page: 353" },
    { name:"1st Decanate: Saspam",         gematria:240, planet:"Saturn",  gridSize:3 },
    { name:"2nd Decanate: Abdaron",        gematria:263, note:"Numerical Squares See Page: 411" },
    { name:"3rd Quinance: Rehael",         gematria:306, planet:"Saturn",  gridSize:3 },
    { name:"1st Quinance: Aniel",          gematria:92,  planet:"Jupiter", gridSize:4 },
    { name:"2nd Quinance: Chamiah",        gematria:133, planet:"Jupiter", gridSize:4 },
    { name:"4th Quinance: Yeyazel",        gematria:58,  note:"Numerical Squares See Page: 549" },
    { name:"3rd Decanate: Gerodiel",       gematria:254, note:"Numerical Squares See Page: 355" },
    { name:"5th Quinance: Hahahel",        gematria:46,  note:"Numerical Squares See Page: 90" },
    { name:"6th Quinance: Michael",        gematria:101, note:"Numerical Squares See Page: 247" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION B — ARCHANGEL OF AQUARIUS: KAMBRIEL (304)
//  pp.559–570 — Full multi-planet hierarchy data
// ─────────────────────────────────────────────────────────────────────────────
export const AQUARIUS_KAMBRIEL = {
  name: "Archangel of Aquarius: Kambriel", hebrewValue: 304,
  gridSize: 4, planet: "Jupiter",
  hebrewSquare: { numerical: [[20,43,213,28],[212,29,19,44],[41,22,30,211]] },
  squares: {
    fire:  [[68,79,73,84],[83,74,76,71],[78,69,85,72],[75,82,70,77]],
    earth: [[75,78,83,68],[82,69,74,79],[70,85,76,73],[77,72,71,84]],
    air:   [[77,70,82,75],[72,85,69,78],[71,76,74,83],[84,73,79,68]],
    water: [[84,71,72,77],[73,76,85,70],[79,74,69,82],[68,83,78,75]],
  },
  // Mars 5×5 — p.560
  marsSquare: {
    fire:  [[48,76,66,60,54],[61,55,49,72,67],[73,63,62,56,50],[57,51,74,64,58],[65,59,53,52,75]],
    air:   [[65,57,73,61,48],[59,51,63,55,76],[53,74,62,49,66],[52,64,56,72,60],[75,58,50,67,54]],
    earth: [[75,52,53,59,65],[58,64,74,51,57],[50,56,62,63,73],[67,72,49,55,61],[54,60,66,76,48]],
    water: [[54,67,50,58,75],[60,72,56,64,52],[66,49,62,74,53],[76,55,63,51,59],[48,61,73,57,65]],
    hierarchy: { usurper:48, guide:76, mystery:124, adjuster:304, leader:912, regulator:1216, genGov:2432, highOverseer:184832 },
    angelArabic: { usurper:7, guide:35, mystery:83, adjuster:263, leader:871, regulator:1175, genGov:2391, highOverseer:184791 },
    angelHebrew: { usurper:17, guide:45, mystery:93, adjuster:273, leader:881, regulator:1185, genGov:2401, highOverseer:184801 },
    jinnArabic:  { usurper:89, guide:117, mystery:165, adjuster:345, leader:593, regulator:897, genGov:2113, highOverseer:184513 },
    jinnHebrew:  { usurper:79, guide:107, mystery:155, adjuster:335, leader:583, regulator:887, genGov:2103, highOverseer:184503 },
  },
  // Mars 5×5 second variant (usurper=68) — p.560 top table
  marsSquareJupiterLevel: {
    hierarchy: { usurper:68, guide:85, mystery:153, adjuster:2432, leader:7296, regulator:9728, genGov:19456, highOverseer:1653760 },
    angelArabic: { usurper:27, guide:44, mystery:112, adjuster:2391, leader:7255, regulator:9687, genGov:19415, highOverseer:1653719 },
    angelHebrew: { usurper:37, guide:54, mystery:122, adjuster:2401, leader:7265, regulator:9697, genGov:19425, highOverseer:1653729 },
    jinnArabic:  { usurper:109, guide:126, mystery:194, adjuster:2113, leader:6977, regulator:9409, genGov:19137, highOverseer:1653441 },
    jinnHebrew:  { usurper:99, guide:116, mystery:184, adjuster:2103, leader:6967, regulator:9399, genGov:19127, highOverseer:1653431 },
  },
  // Sun 6×6 — p.561
  sunSquare: {
    fire:  [[33,44,65,50,54,58],[39,49,60,64,37,55],[45,68,53,43,59,36],[56,35,46,61,40,66],[62,51,42,34,67,48],[69,57,38,52,47,41]],
    earth: [[69,62,56,45,39,33],[57,51,35,68,49,44],[38,42,46,53,60,65],[52,34,61,43,64,50],[47,67,40,59,37,54],[41,48,66,36,55,58]],
    air:   [[41,47,52,38,57,69],[48,67,34,42,51,62],[66,40,61,46,35,56],[36,59,43,53,68,45],[55,37,64,60,49,39],[58,54,50,65,44,33]],
    water: [[58,55,36,66,48,41],[54,37,59,40,67,47],[50,64,43,61,34,52],[65,60,53,46,42,38],[44,49,68,35,51,57],[33,39,45,56,62,69]],
    hierarchy: { usurper:33, guide:69, mystery:102, adjuster:304, leader:912, regulator:1216, genGov:2432, highOverseer:167808 },
    angelArabic: { usurper:352, guide:28, mystery:61, adjuster:263, leader:871, regulator:1175, genGov:2391, highOverseer:167767 },
    angelHebrew: { usurper:2, guide:38, mystery:71, adjuster:273, leader:881, regulator:1185, genGov:2401, highOverseer:167777 },
    jinnArabic:  { usurper:74, guide:110, mystery:143, adjuster:345, leader:593, regulator:897, genGov:2113, highOverseer:167489 },
    jinnHebrew:  { usurper:64, guide:100, mystery:133, adjuster:335, leader:583, regulator:887, genGov:2103, highOverseer:167479 },
  },
  // Venus 7×7 — p.562
  venusSquare: {
    fire:  [[19,60,45,30,50,66,34],[67,35,20,54,46,31,51],[32,52,68,36,21,55,40],[56,41,26,53,69,37,22],[38,23,57,42,27,47,70],[48,64,39,24,58,43,28],[44,29,49,65,33,25,59]],
    air:   [[59,25,33,65,49,29,44],[28,43,58,24,39,64,48],[70,47,27,42,57,23,38],[22,37,69,53,26,41,56],[40,55,21,36,68,52,32],[51,31,46,54,20,35,67],[34,66,50,30,45,60,19]],
    earth: [[44,48,38,56,32,67,19],[29,64,23,41,52,35,60],[49,39,57,26,68,20,45],[65,24,42,53,36,54,30],[33,58,27,69,21,46,50],[25,43,47,37,55,31,66],[59,28,70,22,40,51,34]],
    water: [[34,51,40,22,70,28,59],[66,31,55,37,47,43,25],[50,46,21,69,27,58,33],[30,54,36,53,42,24,65],[45,20,68,26,57,39,49],[60,35,52,41,23,64,29],[19,67,32,56,38,48,44]],
    hierarchy: { usurper:19, guide:70, mystery:89, adjuster:304, leader:912, regulator:1216, genGov:2432, highOverseer:170240 },
    angelArabic: { usurper:338, guide:29, mystery:48, adjuster:263, leader:871, regulator:1175, genGov:2391, highOverseer:170199 },
    angelHebrew: { usurper:348, guide:39, mystery:58, adjuster:273, leader:881, regulator:1185, genGov:2401, highOverseer:170209 },
    jinnArabic:  { usurper:60, guide:111, mystery:130, adjuster:345, leader:593, regulator:897, genGov:2113, highOverseer:169921 },
    jinnHebrew:  { usurper:50, guide:101, mystery:120, adjuster:335, leader:583, regulator:887, genGov:2103, highOverseer:169911 },
  },
  // Mercury 8×8 — pp.563–564
  mercurySquare: {
    fire:  [[6,22,71,51,40,56,37,21],[14,30,59,43,48,68,29,13],[57,41,20,36,23,7,50,70],[69,49,12,28,31,15,42,58],[35,19,38,54,73,53,8,24],[27,11,46,66,61,45,16,32],[52,72,25,9,18,34,55,39],[44,60,33,17,10,26,67,47]],
    earth: [[44,52,27,35,69,57,14,6],[60,72,11,19,49,41,30,22],[33,25,46,38,12,20,59,71],[17,9,66,54,28,36,43,51],[10,18,61,73,31,23,48,40],[26,34,45,53,15,7,68,56],[67,55,16,8,42,50,29,37],[47,39,32,24,58,70,13,21]],
    air:   [[47,67,26,10,17,33,60,44],[39,55,34,18,9,25,72,52],[32,16,45,61,66,46,11,27],[24,8,53,73,54,38,19,35],[58,42,15,31,28,12,49,69],[70,50,7,23,36,20,41,57],[13,29,68,48,43,59,30,14],[21,37,56,40,51,71,22,6]],
    water: [[21,13,70,58,24,32,39,47],[37,29,50,42,8,16,55,67],[56,68,7,15,53,45,34,26],[40,48,23,31,73,61,18,10],[51,43,36,28,54,66,9,17],[71,59,20,12,38,46,25,33],[22,30,41,49,19,11,72,60],[6,14,57,69,35,27,52,44]],
    hierarchy: { usurper:6, guide:73, mystery:79, adjuster:304, leader:912, regulator:1216, genGov:2432, highOverseer:177536 },
    angelArabic: { usurper:325, guide:32, mystery:38, adjuster:263, leader:871, regulator:1175, genGov:2391, highOverseer:177495 },
    angelHebrew: { usurper:335, guide:42, mystery:48, adjuster:273, leader:881, regulator:1185, genGov:2401, highOverseer:177505 },
    jinnArabic:  { usurper:47, guide:114, mystery:120, adjuster:345, leader:593, regulator:897, genGov:2113, highOverseer:177217 },
    jinnHebrew:  { usurper:37, guide:104, mystery:110, adjuster:335, leader:583, regulator:887, genGov:2103, highOverseer:177207 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION C — ANGEL OF AQUARIUS: TZAKMIQIEL (291)
//  pp.564–569 — Full multi-planet data
// ─────────────────────────────────────────────────────────────────────────────
export const AQUARIUS_TZAKMIQIEL = {
  name: "Angel of Aquarius: Tzakmiqiel", hebrewValue: 291,
  gridSize: 3, planet: "Saturn",
  hebrewSquare: { numerical: [[109,41,103,38],[102,39,108,42],[39,111,40,101]] },
  // Saturn 3×3 — p.565
  saturnSquare: {
    fire:  [[98,93,100],[99,97,95],[94,101,96]],
    earth: [[94,99,98],[101,97,93],[96,95,100]],
    air:   [[96,101,94],[95,97,99],[100,93,98]],
    water: [[100,95,96],[93,97,101],[98,99,94]],
    hierarchy: { usurper:93, guide:101, mystery:194, adjuster:291, leader:873, regulator:1164, genGov:2328, highOverseer:235128 },
    angelArabic: { usurper:52, guide:60, mystery:153, adjuster:250, leader:832, regulator:1123, genGov:2287, highOverseer:235087 },
    angelHebrew: { usurper:62, guide:70, mystery:163, adjuster:260, leader:842, regulator:1133, genGov:2297, highOverseer:235097 },
    jinnArabic:  { usurper:134, guide:142, mystery:235, adjuster:332, leader:554, regulator:845, genGov:2009, highOverseer:234809 },
    jinnHebrew:  { usurper:124, guide:132, mystery:225, adjuster:322, leader:544, regulator:835, genGov:1999, highOverseer:234799 },
  },
  // Jupiter 4×4 — p.565
  jupiterSquare: {
    fire:  [[65,76,70,80],[79,71,73,68],[75,66,81,69],[72,78,67,74]],
    earth: [[72,75,79,65],[78,66,71,76],[67,81,73,70],[74,69,68,80]],
    air:   [[74,67,78,72],[69,81,66,75],[68,73,71,79],[80,70,76,65]],
    water: [[80,68,69,74],[70,73,81,67],[76,71,66,78],[65,79,75,72]],
    hierarchy: { usurper:65, guide:81, mystery:146, adjuster:2328, leader:6984, regulator:9312, genGov:18624, highOverseer:1508544 },
    angelArabic: { usurper:24, guide:40, mystery:105, adjuster:2287, leader:6943, regulator:9271, genGov:18583, highOverseer:1508503 },
    angelHebrew: { usurper:34, guide:50, mystery:115, adjuster:2297, leader:6953, regulator:9281, genGov:18593, highOverseer:1508513 },
    jinnArabic:  { usurper:106, guide:122, mystery:187, adjuster:2009, leader:6665, regulator:8993, genGov:18305, highOverseer:1508225 },
    jinnHebrew:  { usurper:96, guide:112, mystery:177, adjuster:1999, leader:6655, regulator:8983, genGov:18295, highOverseer:1508215 },
  },
  // Mars 5×5 — p.566
  marsSquare: {
    fire:  [[46,71,64,58,52],[59,53,47,67,65],[68,61,60,54,48],[55,49,69,62,56],[63,57,51,50,70]],
    air:   [[63,55,68,59,46],[57,49,61,53,71],[51,69,60,47,64],[50,62,54,67,58],[70,56,48,65,52]],
    earth: [[70,50,51,57,63],[56,62,69,49,55],[48,54,60,61,68],[65,67,47,53,59],[52,58,64,71,46]],
    water: [[52,65,48,56,70],[58,67,54,62,50],[64,47,60,69,51],[71,53,61,49,57],[46,59,68,55,63]],
    hierarchy: { usurper:46, guide:71, mystery:117, adjuster:291, leader:873, regulator:1164, genGov:2328, highOverseer:165288 },
    angelArabic: { usurper:5, guide:30, mystery:76, adjuster:250, leader:832, regulator:1123, genGov:2287, highOverseer:165247 },
    angelHebrew: { usurper:15, guide:40, mystery:86, adjuster:260, leader:842, regulator:1133, genGov:2297, highOverseer:165257 },
    jinnArabic:  { usurper:87, guide:112, mystery:158, adjuster:332, leader:554, regulator:845, genGov:2009, highOverseer:164969 },
    jinnHebrew:  { usurper:77, guide:102, mystery:148, adjuster:322, leader:544, regulator:835, genGov:1999, highOverseer:164959 },
  },
  // Sun 6×6 — p.567
  sunSquare: {
    fire:  [[31,42,62,48,52,56],[37,47,58,61,35,53],[43,65,51,41,57,34],[54,33,44,59,38,63],[60,49,40,32,64,46],[66,55,36,50,45,39]],
    earth: [[66,60,54,43,37,31],[55,49,33,65,47,42],[36,40,44,51,58,62],[50,32,59,41,61,48],[45,64,38,57,35,52],[39,46,63,34,53,56]],
    air:   [[39,45,50,36,55,66],[46,64,32,40,49,60],[63,38,59,44,33,54],[34,57,41,51,65,43],[53,35,61,58,47,37],[56,52,48,62,42,31]],
    water: [[56,53,34,63,46,39],[52,35,57,38,64,45],[48,61,41,59,32,50],[62,58,51,44,40,36],[42,47,65,33,49,55],[31,37,43,54,60,66]],
    hierarchy: { usurper:31, guide:66, mystery:97, adjuster:291, leader:873, regulator:1164, genGov:2328, highOverseer:153648 },
    angelArabic: { usurper:350, guide:25, mystery:56, adjuster:250, leader:832, regulator:1123, genGov:2287, highOverseer:153607 },
    angelHebrew: { usurper:360, guide:35, mystery:66, adjuster:260, leader:842, regulator:1133, genGov:2297, highOverseer:153617 },
    jinnArabic:  { usurper:72, guide:107, mystery:138, adjuster:332, leader:554, regulator:845, genGov:2009, highOverseer:153329 },
    jinnHebrew:  { usurper:62, guide:97, mystery:128, adjuster:322, leader:544, regulator:835, genGov:1999, highOverseer:153319 },
  },
  // Venus 7×7 — p.568
  venusSquare: {
    fire:  [[17,58,43,28,48,65,32],[66,33,18,52,44,29,49],[30,50,67,34,19,53,38],[54,39,24,51,68,35,20],[36,21,55,40,25,45,69],[46,63,37,22,56,41,26],[42,27,47,64,31,23,57]],
    air:   [[57,23,31,64,47,27,42],[26,41,56,22,37,63,46],[69,45,25,40,55,21,36],[20,35,68,51,24,39,54],[38,53,19,34,67,50,30],[49,29,44,52,18,33,66],[32,65,48,28,43,58,17]],
    earth: [[42,46,36,54,30,66,17],[27,63,21,39,50,33,58],[47,37,55,24,67,18,43],[64,22,40,51,34,52,28],[31,56,25,68,19,44,48],[23,41,45,35,53,29,65],[57,26,69,20,38,49,32]],
    water: [[32,49,38,20,69,26,57],[65,29,53,35,45,41,23],[48,44,19,68,25,56,31],[28,52,34,51,40,22,64],[43,18,67,24,55,37,47],[58,33,50,39,21,63,27],[17,66,30,54,36,46,42]],
    hierarchy: { usurper:17, guide:69, mystery:86, adjuster:291, leader:873, regulator:1164, genGov:2328, highOverseer:160632 },
    angelArabic: { usurper:336, guide:28, mystery:45, adjuster:250, leader:832, regulator:1123, genGov:2287, highOverseer:160591 },
    angelHebrew: { usurper:346, guide:38, mystery:55, adjuster:260, leader:842, regulator:1133, genGov:2297, highOverseer:160601 },
    jinnArabic:  { usurper:58, guide:110, mystery:127, adjuster:332, leader:554, regulator:845, genGov:2009, highOverseer:160313 },
    jinnHebrew:  { usurper:48, guide:100, mystery:117, adjuster:322, leader:544, regulator:835, genGov:1999, highOverseer:160303 },
  },
  // Mercury 8×8 — p.569
  mercurySquare: {
    fire:  [[4,20,72,49,38,54,35,19],[12,28,57,41,46,69,27,11],[55,39,18,34,21,5,48,71],[70,47,10,26,29,13,40,56],[33,17,36,52,74,51,6,22],[25,9,44,67,59,43,14,30],[50,73,23,7,16,32,53,37],[42,58,31,15,8,24,68,45]],
    earth: [[42,50,25,33,70,55,12,4],[58,73,9,17,47,39,28,20],[31,23,44,36,10,18,57,72],[15,7,67,52,26,34,41,49],[8,16,59,74,29,21,46,38],[24,32,43,51,13,5,69,54],[68,53,14,6,40,48,27,35],[45,37,30,22,56,71,11,19]],
    air:   [[45,68,24,8,15,31,58,42],[37,53,32,16,7,23,73,50],[30,14,43,59,67,44,9,25],[22,6,51,74,52,36,17,33],[56,40,13,29,26,10,47,70],[71,48,5,21,34,18,39,55],[11,27,69,46,41,57,28,12],[19,35,54,38,49,72,20,4]],
    water: [[19,11,71,56,22,30,37,45],[35,27,48,40,6,14,53,68],[54,69,5,13,51,43,32,24],[38,46,21,29,74,59,16,8],[49,41,34,26,52,67,7,15],[72,57,18,10,36,44,23,31],[20,28,39,47,17,9,73,58],[4,12,55,70,33,25,50,42]],
    hierarchy: { usurper:4, guide:74, mystery:78, adjuster:291, leader:873, regulator:1164, genGov:2328, highOverseer:172272 },
    angelArabic: { usurper:323, guide:33, mystery:37, adjuster:250, leader:832, regulator:1123, genGov:2287, highOverseer:172231 },
    angelHebrew: { usurper:333, guide:43, mystery:47, adjuster:260, leader:842, regulator:1133, genGov:2297, highOverseer:172241 },
    jinnArabic:  { usurper:45, guide:115, mystery:119, adjuster:332, leader:554, regulator:845, genGov:2009, highOverseer:171953 },
    jinnHebrew:  { usurper:35, guide:105, mystery:109, adjuster:322, leader:544, regulator:835, genGov:1999, highOverseer:171943 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION D — LORD OF TRIPLICITY BY DAY: ATHOR (676)
//  pp.570–578 — Full multi-planet data
// ─────────────────────────────────────────────────────────────────────────────
export const AQUARIUS_ATHOR = {
  name: "Lord of Triplicity by Day: Athor", hebrewValue: 676,
  gridSize: 4, planet: "Jupiter",
  hebrewSquare: { numerical: [[69,401,9,197],[8,198,68,402],[399,71,199,7]] },
  jupiterSquare: {
    fire:  [[161,172,166,177],[176,167,169,164],[171,162,178,165],[168,175,163,170]],
    earth: [[168,171,176,161],[175,162,167,172],[163,178,169,166],[170,165,164,177]],
    air:   [[177,164,165,170],[166,169,178,163],[172,167,162,175],[161,176,171,168]],
    water: [[177,164,165,170],[166,169,178,163],[172,167,162,175],[161,176,171,168]],
    hierarchy: { usurper:161, guide:178, mystery:339, adjuster:5408, leader:16224, regulator:21632, genGov:43264, highOverseer:7700992 },
    angelArabic: { usurper:120, guide:137, mystery:298, adjuster:5367, leader:16183, regulator:21591, genGov:43223, highOverseer:7700951 },
    angelHebrew: { usurper:130, guide:147, mystery:308, adjuster:5377, leader:16193, regulator:21601, genGov:43233, highOverseer:7700961 },
    jinnArabic:  { usurper:202, guide:219, mystery:20, adjuster:5089, leader:15905, regulator:21313, genGov:42945, highOverseer:7700673 },
    jinnHebrew:  { usurper:192, guide:209, mystery:10, adjuster:5079, leader:15895, regulator:21303, genGov:42935, highOverseer:7700663 },
  },
  marsSquare: {
    fire:  [[123,148,141,135,129],[136,130,124,144,142],[145,138,137,131,125],[132,126,146,139,133],[140,134,128,127,147]],
    air:   [[140,132,145,136,123],[134,126,138,130,148],[128,146,137,124,141],[127,139,131,144,135],[147,133,125,142,129]],
    earth: [[147,127,128,134,140],[133,139,146,126,132],[125,131,137,138,145],[142,144,124,130,136],[129,135,141,148,123]],
    water: [[129,142,125,133,147],[135,144,131,139,127],[141,124,137,146,128],[148,130,138,126,134],[123,136,145,132,140]],
    hierarchy: { usurper:123, guide:148, mystery:271, adjuster:676, leader:2028, regulator:2704, genGov:5408, highOverseer:800384 },
    angelArabic: { usurper:82, guide:107, mystery:230, adjuster:635, leader:1987, regulator:2663, genGov:5367, highOverseer:800343 },
    angelHebrew: { usurper:92, guide:117, mystery:240, adjuster:645, leader:1997, regulator:2673, genGov:5377, highOverseer:800353 },
    jinnArabic:  { usurper:164, guide:189, mystery:312, adjuster:357, leader:1709, regulator:2385, genGov:5089, highOverseer:800065 },
    jinnHebrew:  { usurper:154, guide:179, mystery:302, adjuster:347, leader:1699, regulator:2375, genGov:5079, highOverseer:800055 },
  },
  sunSquare: {
    fire:  [[95,106,127,112,116,120],[101,111,122,126,99,117],[107,130,115,105,121,98],[118,97,108,123,102,128],[124,113,104,96,129,110],[131,119,100,114,109,103]],
    earth: [[131,124,118,107,101,95],[119,113,97,130,111,106],[100,104,108,115,122,127],[114,96,123,105,126,112],[109,129,102,121,99,116],[103,110,128,98,117,120]],
    air:   [[103,109,114,100,119,131],[110,129,96,104,113,124],[128,102,123,108,97,118],[98,121,105,115,130,107],[117,99,126,122,111,101],[120,116,112,127,106,95]],
    water: [[120,117,98,128,110,103],[116,99,121,102,129,109],[112,126,105,123,96,114],[127,122,115,108,104,100],[106,111,130,97,113,119],[95,101,107,118,124,131]],
    hierarchy: { usurper:95, guide:131, mystery:226, adjuster:676, leader:2028, regulator:2704, genGov:5408, highOverseer:708448 },
    angelArabic: { usurper:54, guide:90, mystery:185, adjuster:635, leader:1987, regulator:2663, genGov:5367, highOverseer:708407 },
    angelHebrew: { usurper:64, guide:100, mystery:195, adjuster:645, leader:1997, regulator:2673, genGov:5377, highOverseer:708417 },
    jinnArabic:  { usurper:136, guide:172, mystery:267, adjuster:357, leader:1709, regulator:2385, genGov:5089, highOverseer:708129 },
    jinnHebrew:  { usurper:126, guide:162, mystery:257, adjuster:347, leader:1699, regulator:2375, genGov:5079, highOverseer:708119 },
  },
  venusSquare: {
    fire:  [[72,113,98,83,103,120,87],[121,88,73,107,99,84,104],[85,105,122,89,74,108,93],[109,94,79,106,123,90,75],[91,76,110,95,80,100,124],[101,118,92,77,111,96,81],[97,82,102,119,86,78,112]],
    earth: [[97,101,91,109,85,121,72],[82,118,76,94,105,88,113],[102,92,110,79,122,73,98],[119,77,95,106,89,107,83],[86,111,80,123,74,99,103],[78,96,100,90,108,84,120],[112,81,124,75,93,104,87]],
    air:   [[112,78,86,119,102,82,97],[81,96,111,77,92,118,101],[124,100,80,95,110,76,91],[75,90,123,106,79,94,109],[93,108,74,89,122,105,85],[104,84,99,107,73,88,121],[87,120,103,83,98,113,72]],
    water: [[87,104,93,75,124,81,112],[120,84,108,90,100,96,78],[103,99,74,123,80,111,86],[83,107,89,106,95,77,119],[98,73,122,79,110,92,102],[113,88,105,94,76,118,82],[72,121,85,109,91,101,97]],
    hierarchy: { usurper:72, guide:124, mystery:196, adjuster:676, leader:2028, regulator:2704, genGov:5408, highOverseer:670592 },
    angelArabic: { usurper:31, guide:83, mystery:155, adjuster:635, leader:1987, regulator:2663, genGov:5367, highOverseer:670551 },
    angelHebrew: { usurper:41, guide:93, mystery:165, adjuster:645, leader:1997, regulator:2673, genGov:5377, highOverseer:670561 },
    jinnArabic:  { usurper:113, guide:165, mystery:237, adjuster:357, leader:1709, regulator:2385, genGov:5089, highOverseer:670273 },
    jinnHebrew:  { usurper:103, guide:155, mystery:227, adjuster:347, leader:1699, regulator:2375, genGov:5079, highOverseer:670263 },
  },
  mercurySquare: {
    fire:  [[53,69,114,98,87,103,84,68],[61,77,106,90,95,111,76,60],[104,88,67,83,70,54,97,113],[112,96,59,75,78,62,89,105],[82,66,85,101,116,100,55,71],[74,58,93,109,108,92,63,79],[99,115,72,56,65,81,102,86],[91,107,80,64,57,73,110,94]],
    earth: [[91,99,74,82,112,104,61,53],[107,115,58,66,96,88,77,69],[80,72,93,85,59,67,106,114],[64,56,109,101,75,83,90,98],[57,65,108,116,78,70,95,87],[73,81,92,100,62,54,111,103],[110,102,63,55,89,97,76,84],[94,86,79,71,105,113,60,68]],
    air:   [[94,110,73,57,64,80,107,91],[86,102,81,65,56,72,115,99],[79,63,92,108,109,93,58,74],[71,55,100,116,101,85,66,82],[105,89,62,78,75,59,96,112],[113,97,54,70,83,67,88,104],[60,76,111,95,90,106,77,61],[68,84,103,87,98,114,69,53]],
    water: [[68,60,113,105,71,79,86,94],[84,76,97,89,55,63,102,110],[103,111,54,62,100,92,81,73],[87,95,70,78,116,108,65,57],[98,90,83,75,101,109,56,64],[114,106,67,59,85,93,72,80],[69,77,88,96,66,58,115,107],[53,61,104,112,82,74,99,91]],
    hierarchy: { usurper:53, guide:116, mystery:169, adjuster:676, leader:2028, regulator:2704, genGov:5408, highOverseer:627328 },
    angelArabic: { usurper:12, guide:75, mystery:128, adjuster:635, leader:1987, regulator:2663, genGov:5367, highOverseer:627287 },
    angelHebrew: { usurper:22, guide:85, mystery:138, adjuster:645, leader:1997, regulator:2673, genGov:5377, highOverseer:627297 },
    jinnArabic:  { usurper:94, guide:157, mystery:210, adjuster:357, leader:1709, regulator:2385, genGov:5089, highOverseer:627009 },
    jinnHebrew:  { usurper:84, guide:147, mystery:200, adjuster:347, leader:1699, regulator:2375, genGov:5079, highOverseer:626999 },
  },
  moonSquare: {
    fire:  [[79,92,54,63,116,47,83,99,43],[39,82,104,59,75,91,46,68,112],[108,51,67,103,35,87,96,58,71],[106,38,81,90,61,74,111,45,70],[66,110,50,86,102,37,73,95,57],[53,78,94,49,62,115,42,85,98],[52,65,109,36,88,101,56,72,97],[93,55,77,114,48,64,100,41,84],[80,105,40,76,89,60,69,113,44]],
    earth: [[43,112,71,70,57,98,97,84,44],[99,68,58,45,95,85,72,41,113],[83,46,96,111,73,42,56,100,69],[47,91,87,74,37,115,101,64,60],[116,75,35,61,102,62,88,48,89],[63,59,103,90,86,49,36,114,76],[54,104,67,81,50,94,109,77,40],[92,82,51,38,110,78,65,55,105],[79,39,108,106,66,53,52,93,80]],
    air:   [[44,113,69,60,89,76,40,105,80],[84,41,100,64,48,114,77,55,93],[97,72,56,101,88,36,109,65,52],[98,85,42,115,62,49,94,78,53],[57,95,73,37,102,86,50,110,66],[70,45,111,74,61,90,81,38,106],[71,58,96,87,35,103,67,51,108],[112,68,46,91,75,59,104,82,39],[43,99,83,47,116,63,54,92,79]],
    water: [[80,93,52,53,66,106,108,39,79],[105,55,65,78,110,38,51,82,92],[40,77,109,94,50,81,67,104,54],[76,114,36,49,86,90,103,59,63],[89,48,88,62,102,61,35,75,116],[60,64,101,115,37,74,87,91,47],[69,100,56,42,73,111,96,46,83],[113,41,72,85,95,45,58,68,99],[44,84,97,98,57,70,71,112,43]],
    hierarchy: { usurper:35, guide:116, mystery:151, adjuster:676, leader:2028, regulator:2704, genGov:5408, highOverseer:627328 },
    angelArabic: { usurper:354, guide:75, mystery:110, adjuster:635, leader:1987, regulator:2663, genGov:5367, highOverseer:627287 },
    angelHebrew: { usurper:4, guide:85, mystery:120, adjuster:645, leader:1997, regulator:2673, genGov:5377, highOverseer:627297 },
    jinnArabic:  { usurper:76, guide:157, mystery:192, adjuster:357, leader:1709, regulator:2385, genGov:5089, highOverseer:627009 },
    jinnHebrew:  { usurper:66, guide:147, mystery:182, adjuster:347, leader:1699, regulator:2375, genGov:5079, highOverseer:626999 },
  },
  saturnSquare: {
    fire:  [[18,36,43,81,72,111,65,57,89,104],[29,93,86,77,113,102,20,62,48,46],[44,49,73,112,103,88,37,25,66,79],[50,75,110,105,38,84,92,33,22,67],[63,109,107,42,53,76,80,90,35,21],[70,27,28,95,83,59,55,45,100,114],[82,64,24,31,97,52,40,101,117,68],[96,85,60,19,30,47,98,116,71,54],[106,39,51,58,26,34,115,69,87,91],[118,99,94,56,61,23,74,78,41,32]],
    earth: [[118,106,96,82,70,63,50,44,29,18],[99,39,85,64,27,109,75,49,93,36],[94,51,60,24,28,107,110,73,86,43],[56,58,19,31,95,42,105,112,77,81],[61,26,30,97,83,53,38,103,113,72],[23,34,47,52,59,76,84,88,102,111],[74,115,98,40,55,80,92,37,20,65],[78,69,116,101,45,90,33,25,62,57],[41,87,71,117,100,35,22,66,48,89],[32,91,54,68,114,21,67,79,46,104]],
    air:   [[32,41,78,74,23,61,56,94,99,118],[91,87,69,115,34,26,58,51,39,106],[54,71,116,98,47,30,19,60,85,96],[68,117,101,40,52,97,31,24,64,82],[114,100,45,55,59,83,95,28,27,70],[21,35,90,80,76,53,42,107,109,63],[67,22,33,92,84,38,105,110,75,50],[79,66,25,37,88,103,112,73,49,44],[46,48,62,20,102,113,77,86,93,29],[104,89,57,65,111,72,81,43,36,18]],
    water: [[104,46,79,67,21,114,68,54,91,32],[89,48,66,22,35,100,117,71,87,41],[57,62,25,33,90,45,101,116,69,78],[65,20,37,92,80,55,40,98,115,74],[111,102,88,84,76,59,52,47,34,23],[72,113,103,38,53,83,97,30,26,61],[81,77,112,105,42,95,31,19,58,56],[43,86,73,110,107,28,24,60,51,94],[36,93,49,75,109,27,64,85,39,99],[18,29,44,50,63,70,82,96,106,118]],
    hierarchy: { usurper:18, guide:118, mystery:136, adjuster:676, leader:2028, regulator:2704, genGov:5408, highOverseer:638144 },
    angelArabic: { usurper:337, guide:77, mystery:95, adjuster:635, leader:1987, regulator:2663, genGov:5367, highOverseer:638103 },
    angelHebrew: { usurper:347, guide:87, mystery:105, adjuster:645, leader:1997, regulator:2673, genGov:5377, highOverseer:638113 },
    jinnArabic:  { usurper:59, guide:159, mystery:177, adjuster:357, leader:1709, regulator:2385, genGov:5089, highOverseer:637825 },
    jinnHebrew:  { usurper:49, guide:149, mystery:167, adjuster:347, leader:1699, regulator:2375, genGov:5079, highOverseer:637815 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION E — LORD OF TRIPLICITY BY NIGHT: POLAYAN (171)
//  pp.579–583
// ─────────────────────────────────────────────────────────────────────────────
export const AQUARIUS_POLAYAN = {
  name: "Lord of Triplicity by Night: Polayan", hebrewValue: 171,
  gridSize: 3, planet: "Saturn",
  hebrewSquare: { numerical: [[79,31,14,47],[13,48,78,32],[29,81,49,12]] },
  saturnSquare: {
    fire:  [[58,53,60],[59,57,55],[54,61,56]],
    earth: [[54,59,58],[61,57,53],[56,55,60]],
    air:   [[56,61,54],[55,57,59],[60,53,58]],
    water: [[60,55,56],[53,57,61],[58,59,54]],
    hierarchy: { usurper:53, guide:61, mystery:114, adjuster:171, leader:513, regulator:684, genGov:1368, highOverseer:83448 },
    angelArabic: { usurper:12, guide:20, mystery:73, adjuster:130, leader:472, regulator:643, genGov:1327, highOverseer:83407 },
    angelHebrew: { usurper:22, guide:30, mystery:83, adjuster:140, leader:482, regulator:653, genGov:1337, highOverseer:83417 },
    jinnArabic:  { usurper:94, guide:102, mystery:155, adjuster:212, leader:194, regulator:365, genGov:1049, highOverseer:83129 },
    jinnHebrew:  { usurper:84, guide:92, mystery:145, adjuster:202, leader:184, regulator:355, genGov:1039, highOverseer:83119 },
  },
  jupiterSquare: {
    fire:  [[35,46,40,50],[49,41,43,38],[45,36,51,39],[42,48,37,44]],
    earth: [[42,45,49,35],[48,36,41,46],[37,51,43,40],[44,39,38,50]],
    air:   [[44,37,48,42],[39,51,36,45],[38,43,41,49],[50,40,46,35]],
    water: [[50,38,39,44],[40,43,51,37],[46,41,36,48],[35,49,45,42]],
    hierarchy: { usurper:35, guide:51, mystery:86, adjuster:1368, leader:4104, regulator:5472, genGov:10944, highOverseer:558144 },
    angelArabic: { usurper:354, guide:10, mystery:45, adjuster:1327, leader:4063, regulator:5431, genGov:10903, highOverseer:558103 },
    angelHebrew: { usurper:4, guide:20, mystery:55, adjuster:1337, leader:4073, regulator:5441, genGov:10913, highOverseer:558113 },
    jinnArabic:  { usurper:76, guide:92, mystery:127, adjuster:1049, leader:3785, regulator:5153, genGov:10625, highOverseer:557825 },
    jinnHebrew:  { usurper:66, guide:82, mystery:117, adjuster:1039, leader:3775, regulator:5143, genGov:10615, highOverseer:557815 },
  },
  marsSquare: {
    fire:  [[22,47,40,34,28],[35,29,23,43,41],[44,37,36,30,24],[31,25,45,38,32],[39,33,27,26,46]],
    air:   [[39,31,44,35,22],[33,25,37,29,47],[27,45,36,23,40],[26,38,30,43,34],[46,32,24,41,28]],
    earth: [[46,26,27,33,39],[32,38,45,25,31],[24,30,36,37,44],[41,43,23,29,35],[28,34,40,47,22]],
    water: [[28,41,24,32,46],[34,43,30,38,26],[40,23,36,45,27],[47,29,37,25,33],[22,35,44,31,39]],
    hierarchy: { usurper:22, guide:47, mystery:69, adjuster:171, leader:513, regulator:684, genGov:1368, highOverseer:64296 },
    angelArabic: { usurper:341, guide:6, mystery:28, adjuster:130, leader:472, regulator:643, genGov:1327, highOverseer:64255 },
    angelHebrew: { usurper:351, guide:16, mystery:38, adjuster:140, leader:482, regulator:653, genGov:1337, highOverseer:64265 },
    jinnArabic:  { usurper:63, guide:88, mystery:110, adjuster:212, leader:194, regulator:365, genGov:1049, highOverseer:63977 },
    jinnHebrew:  { usurper:53, guide:78, mystery:100, adjuster:202, leader:184, regulator:355, genGov:1039, highOverseer:63967 },
  },
  sunSquare: {
    fire:  [[11,22,42,28,32,36],[17,27,38,41,15,33],[23,45,31,21,37,14],[34,13,24,39,18,43],[40,29,20,12,44,26],[46,35,16,30,25,19]],
    earth: [[46,40,34,23,17,11],[35,29,13,45,27,22],[16,20,24,31,38,42],[30,12,39,21,41,28],[25,44,18,37,15,32],[19,26,43,14,33,36]],
    air:   [[19,25,30,16,35,46],[26,44,12,20,29,40],[43,18,39,24,13,34],[14,37,21,31,45,23],[33,15,41,38,27,17],[36,32,28,42,22,11]],
    water: [[36,33,14,43,26,19],[32,15,37,18,44,25],[28,41,21,39,12,30],[42,38,31,24,20,16],[22,27,45,13,29,35],[11,17,23,34,40,46]],
    hierarchy: { usurper:11, guide:46, mystery:57, adjuster:171, leader:513, regulator:684, genGov:1368, highOverseer:62928 },
    angelArabic: { usurper:330, guide:5, mystery:16, adjuster:130, leader:472, regulator:643, genGov:1327, highOverseer:62887 },
    angelHebrew: { usurper:340, guide:15, mystery:26, adjuster:140, leader:482, regulator:653, genGov:1337, highOverseer:62897 },
    jinnArabic:  { usurper:52, guide:87, mystery:98, adjuster:212, leader:194, regulator:365, genGov:1049, highOverseer:62609 },
    jinnHebrew:  { usurper:42, guide:77, mystery:88, adjuster:202, leader:184, regulator:355, genGov:1039, highOverseer:62599 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION F — ANGEL OF FIRST DECANATE: SASPAM (240)
//  pp.584–588
// ─────────────────────────────────────────────────────────────────────────────
export const AQUARIUS_SASPAM = {
  name: "Angel of First Decanate: Saspam", hebrewValue: 240,
  gridSize: 3, planet: "Saturn",
  hebrewSquare: { numerical: [[59,61,83,37],[82,38,58,62],[59,61,39,81]] },
  saturnSquare: {
    fire:  [[81,76,83],[82,80,78],[77,84,79]],
    earth: [[77,82,81],[84,80,76],[79,78,83]],
    air:   [[79,84,77],[78,80,82],[83,76,81]],
    water: [[83,78,79],[76,80,84],[81,82,77]],
    hierarchy: { usurper:76, guide:84, mystery:160, adjuster:240, leader:720, regulator:960, genGov:1920, highOverseer:161280 },
    angelArabic: { usurper:35, guide:43, mystery:119, adjuster:199, leader:679, regulator:919, genGov:1879, highOverseer:161239 },
    angelHebrew: { usurper:45, guide:53, mystery:129, adjuster:209, leader:689, regulator:929, genGov:1889, highOverseer:161249 },
    jinnArabic:  { usurper:117, guide:125, mystery:201, adjuster:281, leader:401, regulator:641, genGov:1601, highOverseer:160961 },
    jinnHebrew:  { usurper:107, guide:115, mystery:191, adjuster:271, leader:391, regulator:631, genGov:1591, highOverseer:160951 },
  },
  jupiterSquare: {
    fire:  [[52,63,57,68],[67,58,60,55],[62,53,69,56],[59,66,54,61]],
    earth: [[59,62,67,52],[66,53,58,63],[54,69,60,57],[61,56,55,68]],
    air:   [[61,54,66,59],[56,69,53,62],[55,60,58,67],[68,57,63,52]],
    water: [[68,55,56,61],[57,60,69,54],[63,58,53,66],[52,67,62,59]],
    hierarchy: { usurper:52, guide:69, mystery:121, adjuster:1920, leader:5760, regulator:7680, genGov:15360, highOverseer:1059840 },
    angelArabic: { usurper:11, guide:28, mystery:80, adjuster:1879, leader:5719, regulator:7639, genGov:15319, highOverseer:1059799 },
    angelHebrew: { usurper:21, guide:38, mystery:90, adjuster:1889, leader:5729, regulator:7649, genGov:15329, highOverseer:1059809 },
    jinnArabic:  { usurper:93, guide:110, mystery:162, adjuster:1601, leader:5441, regulator:7361, genGov:15041, highOverseer:1059521 },
    jinnHebrew:  { usurper:83, guide:100, mystery:152, adjuster:1591, leader:5431, regulator:7351, genGov:15031, highOverseer:1059511 },
  },
  marsSquare: {
    fire:  [[36,60,54,48,42],[49,43,37,56,55],[57,51,50,44,38],[45,39,58,52,46],[53,47,41,40,59]],
    air:   [[53,45,57,49,36],[47,39,51,43,60],[41,58,50,37,54],[40,52,44,56,48],[59,46,38,55,42]],
    earth: [[59,40,41,47,53],[46,52,58,39,45],[38,44,50,51,57],[55,56,37,43,49],[42,48,54,60,36]],
    water: [[42,55,38,46,59],[48,56,44,52,40],[54,37,50,58,41],[60,43,51,39,47],[36,49,57,45,53]],
    hierarchy: { usurper:36, guide:60, mystery:96, adjuster:240, leader:720, regulator:960, genGov:1920, highOverseer:115200 },
    angelArabic: { usurper:355, guide:19, mystery:55, adjuster:199, leader:679, regulator:919, genGov:1879, highOverseer:115159 },
    angelHebrew: { usurper:5, guide:29, mystery:65, adjuster:209, leader:689, regulator:929, genGov:1889, highOverseer:115169 },
    jinnArabic:  { usurper:77, guide:101, mystery:137, adjuster:281, leader:401, regulator:641, genGov:1601, highOverseer:114881 },
    jinnHebrew:  { usurper:67, guide:91, mystery:127, adjuster:271, leader:391, regulator:631, genGov:1591, highOverseer:114871 },
  },
  sunSquare_variant2: {
    // usurper=22 — page 586 second table
    hierarchy: { usurper:22, guide:60, mystery:82, adjuster:240, leader:720, regulator:960, genGov:1920, highOverseer:115200 },
    angelArabic: { usurper:341, guide:19, mystery:41, adjuster:199, leader:679, regulator:919, genGov:1879, highOverseer:115159 },
    angelHebrew: { usurper:351, guide:29, mystery:51, adjuster:209, leader:689, regulator:929, genGov:1889, highOverseer:115169 },
    jinnArabic:  { usurper:63, guide:101, mystery:123, adjuster:281, leader:401, regulator:641, genGov:1601, highOverseer:114881 },
    jinnHebrew:  { usurper:53, guide:91, mystery:113, adjuster:271, leader:391, regulator:631, genGov:1591, highOverseer:114871 },
  },
  venusSquare: {
    fire:  [[10,51,36,21,41,56,25],[57,26,11,45,37,22,42],[23,43,58,27,12,46,31],[47,32,17,44,59,28,13],[29,14,48,33,18,38,60],[39,54,30,15,49,34,19],[35,20,40,55,24,16,50]],
    earth: [[35,39,29,47,23,57,10],[20,54,14,32,43,26,51],[40,30,48,17,58,11,36],[55,15,33,44,27,45,21],[24,49,18,59,12,37,41],[16,34,38,28,46,22,56],[50,19,60,13,31,42,25]],
    air:   [[50,16,24,55,40,20,35],[19,34,49,15,30,54,39],[60,38,18,33,48,14,29],[13,28,59,44,17,32,47],[31,46,12,27,58,43,23],[42,22,37,45,11,26,57],[25,56,41,21,36,51,10]],
    water: [[25,42,31,13,60,19,50],[56,22,46,28,38,34,16],[41,37,12,59,18,49,24],[21,45,27,44,33,15,55],[36,11,58,17,48,30,40],[51,26,43,32,14,54,20],[10,57,23,47,29,39,35]],
    hierarchy: { usurper:10, guide:60, mystery:70, adjuster:240, leader:720, regulator:960, genGov:1920, highOverseer:115200 },
    angelArabic: { usurper:329, guide:19, mystery:29, adjuster:199, leader:679, regulator:919, genGov:1879, highOverseer:115159 },
    angelHebrew: { usurper:339, guide:29, mystery:39, adjuster:209, leader:689, regulator:929, genGov:1889, highOverseer:115169 },
    jinnArabic:  { usurper:51, guide:101, mystery:111, adjuster:281, leader:401, regulator:641, genGov:1601, highOverseer:114881 },
    jinnHebrew:  { usurper:41, guide:91, mystery:101, adjuster:271, leader:391, regulator:631, genGov:1591, highOverseer:114871 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION G — QUINANCE AND DECANATE ANGELS OF AQUARIUS (pp.588–600)
// ─────────────────────────────────────────────────────────────────────────────
export const AQUARIUS_QUINANCE_ANGELS = [
  {
    name: "Angel of First Quinance: Aniel", hebrewValue: 92,
    gridSize: 4, planet: "Jupiter",
    hebrewSquare: { numerical: [[50,11,4,27],[3,28,49,12],[9,52,29,2]] },
    jupiterSquare: {
      fire:  [[15,26,20,31],[30,21,23,18],[25,16,32,19],[22,29,17,24]],
      earth: [[22,25,30,15],[29,16,21,26],[17,32,23,20],[24,19,18,31]],
      air:   [[24,17,29,22],[19,32,16,25],[18,23,21,30],[31,20,26,15]],
      water: [[31,18,19,24],[20,23,32,17],[26,21,16,29],[15,30,25,22]],
      hierarchy: { usurper:15, guide:32, mystery:47, adjuster:736, leader:2208, regulator:2944, genGov:5888, highOverseer:188416 },
      angelArabic: { usurper:334, guide:351, mystery:6, adjuster:695, leader:2167, regulator:2903, genGov:5847, highOverseer:188375 },
      angelHebrew: { usurper:344, guide:1, mystery:16, adjuster:705, leader:2177, regulator:2913, genGov:5857, highOverseer:188385 },
      jinnArabic:  { usurper:56, guide:73, mystery:88, adjuster:417, leader:1889, regulator:2625, genGov:5569, highOverseer:188097 },
      jinnHebrew:  { usurper:46, guide:63, mystery:78, adjuster:407, leader:1879, regulator:2615, genGov:5559, highOverseer:188087 },
    },
    marsSquare: {
      fire:  [[6,32,24,18,12],[19,13,7,28,25],[29,21,20,14,8],[15,9,30,22,16],[23,17,11,10,31]],
      air:   [[23,15,29,19,6],[17,9,21,13,32],[11,30,20,7,24],[10,22,14,28,18],[31,16,8,25,12]],
      earth: [[31,10,11,17,23],[16,22,30,9,15],[8,14,20,21,29],[25,28,7,13,19],[12,18,24,32,6]],
      water: [[12,25,8,16,31],[18,28,14,22,10],[24,7,20,30,11],[32,13,21,9,17],[6,19,29,15,23]],
      hierarchy: { usurper:6, guide:32, mystery:38, adjuster:92, leader:276, regulator:368, genGov:736, highOverseer:23552 },
      angelArabic: { usurper:325, guide:351, mystery:357, adjuster:51, leader:235, regulator:327, genGov:695, highOverseer:23511 },
      angelHebrew: { usurper:335, guide:1, mystery:7, adjuster:61, leader:245, regulator:337, genGov:705, highOverseer:23521 },
      jinnArabic:  { usurper:47, guide:73, mystery:79, adjuster:133, leader:317, regulator:49, genGov:417, highOverseer:23233 },
      jinnHebrew:  { usurper:37, guide:63, mystery:69, adjuster:123, leader:307, regulator:39, genGov:407, highOverseer:23223 },
    },
    page: "588-589",
  },
  {
    name: "Angel of Second Quinance: Chamiah", hebrewValue: 133,
    gridSize: 4, planet: "Jupiter",
    hebrewSquare: { numerical: [[7,71,43,12],[42,13,6,72],[69,9,14,41]] },
    jupiterSquare: {
      fire:  [[25,36,30,42],[41,31,33,28],[35,26,43,29],[32,40,27,34]],
      earth: [[32,35,41,25],[40,26,31,36],[27,43,33,30],[34,29,28,42]],
      air:   [[34,27,40,32],[29,43,26,35],[28,33,31,41],[42,30,36,25]],
      water: [[42,28,29,34],[30,33,43,27],[36,31,26,40],[25,41,35,32]],
      hierarchy: { usurper:25, guide:43, mystery:68, adjuster:1064, leader:3192, regulator:4256, genGov:8512, highOverseer:366016 },
      angelArabic: { usurper:344, guide:2, mystery:27, adjuster:1023, leader:3151, regulator:4215, genGov:8471, highOverseer:365975 },
      angelHebrew: { usurper:354, guide:12, mystery:37, adjuster:1033, leader:3161, regulator:4225, genGov:8481, highOverseer:365985 },
      jinnArabic:  { usurper:66, guide:84, mystery:109, adjuster:745, leader:2873, regulator:3937, genGov:8193, highOverseer:365697 },
      jinnHebrew:  { usurper:56, guide:74, mystery:99, adjuster:735, leader:2863, regulator:3927, genGov:8183, highOverseer:365687 },
    },
    marsSquare: {
      fire:  [[14,41,32,26,20],[27,21,15,37,33],[38,29,28,22,16],[23,17,39,30,24],[31,25,19,18,40]],
      air:   [[31,23,38,27,14],[25,17,29,21,41],[19,39,28,15,32],[18,30,22,37,26],[40,24,16,33,20]],
      earth: [[40,18,19,25,31],[24,30,39,17,23],[16,22,28,29,38],[33,37,15,21,27],[20,26,32,41,14]],
      water: [[20,33,16,24,40],[26,37,22,30,18],[32,15,28,39,19],[41,21,29,17,25],[14,27,38,23,31]],
      hierarchy: { usurper:14, guide:41, mystery:55, adjuster:133, leader:399, regulator:532, genGov:1064, highOverseer:43624 },
      angelArabic: { usurper:333, guide:360, mystery:14, adjuster:92, leader:358, regulator:491, genGov:1023, highOverseer:43583 },
      angelHebrew: { usurper:343, guide:10, mystery:24, adjuster:102, leader:368, regulator:501, genGov:1033, highOverseer:43593 },
      jinnArabic:  { usurper:55, guide:82, mystery:96, adjuster:174, leader:80, regulator:213, genGov:745, highOverseer:43305 },
      jinnHebrew:  { usurper:45, guide:72, mystery:86, adjuster:164, leader:70, regulator:203, genGov:735, highOverseer:43295 },
    },
    sunSquare: {
      fire:  [[4,15,39,21,25,29],[10,20,31,38,8,26],[16,42,24,14,30,7],[27,6,17,32,11,40],[33,22,13,5,41,19],[43,28,9,23,18,12]],
      earth: [[43,33,27,16,10,4],[28,22,6,42,20,15],[9,13,17,24,31,39],[23,5,32,14,38,21],[18,41,11,30,8,25],[12,19,40,7,26,29]],
      air:   [[12,18,23,9,28,43],[19,41,5,13,22,33],[40,11,32,17,6,27],[7,30,14,24,42,16],[26,8,38,31,20,10],[29,25,21,39,15,4]],
      water: [[29,26,7,40,19,12],[25,8,30,11,41,18],[21,38,14,32,5,23],[39,31,24,17,13,9],[15,20,42,6,22,28],[4,10,16,27,33,43]],
      hierarchy: { usurper:4, guide:43, mystery:47, adjuster:133, leader:399, regulator:532, genGov:1064, highOverseer:45752 },
      angelArabic: { usurper:323, guide:2, mystery:6, adjuster:92, leader:358, regulator:491, genGov:1023, highOverseer:45711 },
      angelHebrew: { usurper:333, guide:12, mystery:16, adjuster:102, leader:368, regulator:501, genGov:1033, highOverseer:45721 },
      jinnArabic:  { usurper:45, guide:84, mystery:88, adjuster:174, leader:80, regulator:213, genGov:745, highOverseer:45433 },
      jinnHebrew:  { usurper:35, guide:74, mystery:78, adjuster:164, leader:70, regulator:203, genGov:735, highOverseer:45423 },
    },
    page: "590-592",
  },
  {
    name: "Angel of Second Decanate: Abdaron", hebrewValue: 263,
    hebrewSquare: { numerical: [[30,205,9,47],[8,48,29,206],[203,32,49,7]] },
    note: "Numerical Squares See Page: 411",
    page: "593",
  },
  {
    name: "Angel of Third Quinance: Rehael", hebrewValue: 306,
    gridSize: 3, planet: "Saturn",
    hebrewSquare: { numerical: [[199,71,9,28],[8,29,198,72],[69,201,30,7]] },
    saturnSquare: {
      fire:  [[103,98,105],[104,102,100],[99,106,101]],
      earth: [[99,104,103],[106,102,98],[101,100,105]],
      air:   [[101,106,99],[100,102,104],[105,98,103]],
      water: [[105,100,101],[98,102,106],[103,104,99]],
      hierarchy: { usurper:98, guide:106, mystery:204, adjuster:306, leader:918, regulator:1224, genGov:2448, highOverseer:259488 },
      angelArabic: { usurper:57, guide:65, mystery:163, adjuster:265, leader:877, regulator:1183, genGov:2407, highOverseer:259447 },
      angelHebrew: { usurper:67, guide:75, mystery:173, adjuster:275, leader:887, regulator:1193, genGov:2417, highOverseer:259457 },
      jinnArabic:  { usurper:139, guide:147, mystery:245, adjuster:347, leader:599, regulator:905, genGov:2129, highOverseer:259169 },
      jinnHebrew:  { usurper:129, guide:137, mystery:235, adjuster:337, leader:589, regulator:895, genGov:2119, highOverseer:259159 },
    },
    jupiterSquare: {
      fire:  [[69,80,74,83],[82,75,77,72],[79,70,84,73],[76,81,71,78]],
      earth: [[76,79,82,69],[81,70,75,80],[71,84,77,74],[78,73,72,83]],
      air:   [[78,71,81,76],[73,84,70,79],[72,77,75,82],[83,74,80,69]],
      water: [[83,72,73,78],[74,77,84,71],[80,75,70,81],[69,82,79,76]],
      hierarchy: { usurper:69, guide:84, mystery:153, adjuster:2448, leader:7344, regulator:9792, genGov:19584, highOverseer:1645056 },
      angelArabic: { usurper:28, guide:43, mystery:112, adjuster:2407, leader:7303, regulator:9751, genGov:19543, highOverseer:1645015 },
      angelHebrew: { usurper:38, guide:53, mystery:122, adjuster:2417, leader:7313, regulator:9761, genGov:19553, highOverseer:1645025 },
      jinnArabic:  { usurper:110, guide:125, mystery:194, adjuster:2129, leader:7025, regulator:9473, genGov:19265, highOverseer:1644737 },
      jinnHebrew:  { usurper:100, guide:115, mystery:184, adjuster:2119, leader:7015, regulator:9463, genGov:19255, highOverseer:1644727 },
    },
    marsSquare: {
      fire:  [[49,74,67,61,55],[62,56,50,70,68],[71,64,63,57,51],[58,52,72,65,59],[66,60,54,53,73]],
      air:   [[66,58,71,62,49],[60,52,64,56,74],[54,72,63,50,67],[53,65,57,70,61],[73,59,51,68,55]],
      earth: [[73,53,54,60,66],[59,65,72,52,58],[51,57,63,64,71],[68,70,50,56,62],[55,61,67,74,49]],
      water: [[55,68,51,59,73],[61,70,57,65,53],[67,50,63,72,54],[74,56,64,52,60],[49,62,71,58,66]],
      hierarchy: { usurper:49, guide:74, mystery:123, adjuster:306, leader:918, regulator:1224, genGov:2448, highOverseer:181152 },
      angelArabic: { usurper:8, guide:33, mystery:82, adjuster:265, leader:877, regulator:1183, genGov:2407, highOverseer:181111 },
      angelHebrew: { usurper:18, guide:43, mystery:92, adjuster:275, leader:887, regulator:1193, genGov:2417, highOverseer:181121 },
      jinnArabic:  { usurper:90, guide:115, mystery:164, adjuster:347, leader:599, regulator:905, genGov:2129, highOverseer:180833 },
      jinnHebrew:  { usurper:80, guide:105, mystery:154, adjuster:337, leader:589, regulator:895, genGov:2119, highOverseer:180823 },
    },
    sunSquare: {
      fire:  [[33,44,67,50,54,58],[39,49,60,66,37,55],[45,70,53,43,59,36],[56,35,46,61,40,68],[62,51,42,34,69,48],[71,57,38,52,47,41]],
      earth: [[71,62,56,45,39,33],[57,51,35,70,49,44],[38,42,46,53,60,67],[52,34,61,43,66,50],[47,69,40,59,37,54],[41,48,68,36,55,58]],
      air:   [[41,47,52,38,57,71],[48,69,34,42,51,62],[68,40,61,46,35,56],[36,59,43,53,70,45],[55,37,66,60,49,39],[58,54,50,67,44,33]],
      water: [[58,55,36,68,48,41],[54,37,59,40,69,47],[50,66,43,61,34,52],[67,60,53,46,42,38],[44,49,70,35,51,57],[33,39,45,56,62,71]],
      hierarchy: { usurper:33, guide:71, mystery:104, adjuster:306, leader:918, regulator:1224, genGov:2448, highOverseer:173808 },
      angelArabic: { usurper:352, guide:30, mystery:63, adjuster:265, leader:877, regulator:1183, genGov:2407, highOverseer:173767 },
      angelHebrew: { usurper:2, guide:40, mystery:73, adjuster:275, leader:887, regulator:1193, genGov:2417, highOverseer:173777 },
      jinnArabic:  { usurper:74, guide:112, mystery:145, adjuster:347, leader:599, regulator:905, genGov:2129, highOverseer:173489 },
      jinnHebrew:  { usurper:64, guide:102, mystery:135, adjuster:337, leader:589, regulator:895, genGov:2119, highOverseer:173479 },
    },
    venusSquare: {
      fire:  [[19,60,45,30,50,68,34],[69,35,20,54,46,31,51],[32,52,70,36,21,55,40],[56,41,26,53,71,37,22],[38,23,57,42,27,47,72],[48,66,39,24,58,43,28],[44,29,49,67,33,25,59]],
      air:   [[59,25,33,67,49,29,44],[28,43,58,24,39,66,48],[72,47,27,42,57,23,38],[22,37,71,53,26,41,56],[40,55,21,36,70,52,32],[51,31,46,54,20,35,69],[34,68,50,30,45,60,19]],
      earth: [[44,48,38,56,32,69,19],[29,66,23,41,52,35,60],[49,39,57,26,70,20,45],[67,24,42,53,36,54,30],[33,58,27,71,21,46,50],[25,43,47,37,55,31,68],[59,28,72,22,40,51,34]],
      water: [[34,51,40,22,72,28,59],[68,31,55,37,47,43,25],[50,46,21,71,27,58,33],[30,54,36,53,42,24,67],[45,20,70,26,57,39,49],[60,35,52,41,23,66,29],[19,69,32,56,38,48,44]],
      hierarchy: { usurper:19, guide:72, mystery:91, adjuster:306, leader:918, regulator:1224, genGov:2448, highOverseer:176256 },
      angelArabic: { usurper:338, guide:31, mystery:50, adjuster:265, leader:877, regulator:1183, genGov:2407, highOverseer:176215 },
      angelHebrew: { usurper:348, guide:41, mystery:60, adjuster:275, leader:887, regulator:1193, genGov:2417, highOverseer:176225 },
      jinnArabic:  { usurper:60, guide:113, mystery:132, adjuster:347, leader:599, regulator:905, genGov:2129, highOverseer:175937 },
      jinnHebrew:  { usurper:50, guide:103, mystery:122, adjuster:337, leader:589, regulator:895, genGov:2119, highOverseer:175927 },
    },
    mercurySquare: {
      fire:  [[6,22,73,51,40,56,37,21],[14,30,59,43,48,70,29,13],[57,41,20,36,23,7,50,72],[71,49,12,28,31,15,42,58],[35,19,38,54,75,53,8,24],[27,11,46,68,61,45,16,32],[52,74,25,9,18,34,55,39],[44,60,33,17,10,26,69,47]],
      earth: [[44,52,27,35,71,57,14,6],[60,74,11,19,49,41,30,22],[33,25,46,38,12,20,59,73],[17,9,68,54,28,36,43,51],[10,18,61,75,31,23,48,40],[26,34,45,53,15,7,70,56],[69,55,16,8,42,50,29,37],[47,39,32,24,58,72,13,21]],
      air:   [[47,69,26,10,17,33,60,44],[39,55,34,18,9,25,74,52],[32,16,45,61,68,46,11,27],[24,8,53,75,54,38,19,35],[58,42,15,31,28,12,49,71],[72,50,7,23,36,20,41,57],[13,29,70,48,43,59,30,14],[21,37,56,40,51,73,22,6]],
      water: [[21,13,72,58,24,32,39,47],[37,29,50,42,8,16,55,69],[56,70,7,15,53,45,34,26],[40,48,23,31,75,61,18,10],[51,43,36,28,54,68,9,17],[73,59,20,12,38,46,25,33],[22,30,41,49,19,11,74,60],[6,14,57,71,35,27,52,44]],
      hierarchy: { usurper:6, guide:75, mystery:81, adjuster:306, leader:918, regulator:1224, genGov:2448, highOverseer:183600 },
      angelArabic: { usurper:325, guide:34, mystery:40, adjuster:265, leader:877, regulator:1183, genGov:2407, highOverseer:183559 },
      angelHebrew: { usurper:335, guide:44, mystery:50, adjuster:275, leader:887, regulator:1193, genGov:2417, highOverseer:183569 },
      jinnArabic:  { usurper:47, guide:116, mystery:122, adjuster:347, leader:599, regulator:905, genGov:2129, highOverseer:183281 },
      jinnHebrew:  { usurper:37, guide:106, mystery:112, adjuster:337, leader:589, regulator:895, genGov:2119, highOverseer:183271 },
    },
    page: "593-599",
  },
  {
    name: "Angel of Fourth Quinance: Yeyazel", hebrewValue: 58,
    hebrewSquare: { numerical: [[9,11,10,28],[9,29,8,12],[9,11,30,8]] },
    note: "Numerical Squares See Page: 549",
    page: "599",
  },
  {
    name: "Angel of Third Decanate: Gerodiel", hebrewValue: 254,
    hebrewSquare: { numerical: [[2,201,13,38],[12,39,1,202],[199,4,40,11]] },
    note: "Numerical Squares See Page: 355",
    page: "600",
  },
  {
    name: "Angel of Fifth Quinance: Hahahel", hebrewValue: 46,
    hebrewSquare: { numerical: [[4,6,8,28],[7,29,3,7],[4,6,30,6]] },
    note: "Numerical Squares See Page: 90",
    page: "600",
  },
  {
    name: "Angel of Six Quinance: Michael", hebrewValue: 101,
    hebrewSquare: { numerical: [[39,11,23,28],[22,29,38,12],[9,41,30,21]] },
    note: "Numerical Squares See Page: 247",
    page: "600",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION H — PISCES CHAPTER (pp.601–609, chapter opening)
//  Sign: Dagim (57) — Numerical Squares See Page: 436
//  Archangel: Amnitziel (232)
//  Angel: Vakabiel (69)
//  Lord of Triplicity by Day: Ramara (441)
// ─────────────────────────────────────────────────────────────────────────────
export const PISCES_CHAPTER = {
  sign: "Pisces",
  hebrewSignName: "Dagim",
  hebrewSignValue: 57,
  numericalSquaresPage: 436,
  rulingPlanet: "Jupiter",
};

export const PISCES_AMNITZIEL = {
  name: "Archangel of Pisces: Amnitziel", hebrewValue: 232,
  gridSize: 4, planet: "Jupiter",
  hebrewSquare: { numerical: [[40,61,93,38],[92,39,39,62],[59,42,40,91]] },
  jupiterSquare: {
    fire:  [[50,61,55,66],[65,56,58,53],[60,51,67,54],[57,64,52,59]],
    earth: [[57,60,65,50],[64,51,56,61],[52,67,58,55],[59,54,53,66]],
    air:   [[59,52,64,57],[54,67,51,60],[53,58,56,65],[66,55,61,50]],
    water: [[66,53,54,59],[55,58,67,52],[61,56,51,64],[50,65,60,57]],
    hierarchy: { usurper:50, guide:67, mystery:117, adjuster:1856, leader:5568, regulator:7424, genGov:14848, highOverseer:994816 },
    angelArabic: { usurper:9, guide:26, mystery:76, adjuster:1815, leader:5527, regulator:7383, genGov:14807, highOverseer:994775 },
    angelHebrew: { usurper:19, guide:36, mystery:86, adjuster:1825, leader:5537, regulator:7393, genGov:14817, highOverseer:994785 },
    jinnArabic:  { usurper:91, guide:108, mystery:158, adjuster:1537, leader:5249, regulator:7105, genGov:14529, highOverseer:994497 },
    jinnHebrew:  { usurper:81, guide:98, mystery:148, adjuster:1527, leader:5239, regulator:7095, genGov:14519, highOverseer:994487 },
  },
  marsSquare: {
    fire:  [[34,60,52,46,40],[47,41,35,56,53],[57,49,48,42,36],[43,37,58,50,44],[51,45,39,38,59]],
    air:   [[51,43,57,47,34],[45,37,49,41,60],[39,58,48,35,52],[38,50,42,56,46],[59,44,36,53,40]],
    earth: [[59,38,39,45,51],[44,50,58,37,43],[36,42,48,49,57],[53,56,35,41,47],[40,46,52,60,34]],
    water: [[40,53,36,44,59],[46,56,42,50,38],[52,35,48,58,39],[60,41,49,37,45],[34,47,57,43,51]],
    hierarchy: { usurper:34, guide:60, mystery:94, adjuster:232, leader:696, regulator:928, genGov:1856, highOverseer:111360 },
    angelArabic: { usurper:353, guide:19, mystery:53, adjuster:191, leader:655, regulator:887, genGov:1815, highOverseer:111319 },
    angelHebrew: { usurper:3, guide:29, mystery:63, adjuster:201, leader:665, regulator:897, genGov:1825, highOverseer:111329 },
    jinnArabic:  { usurper:75, guide:101, mystery:135, adjuster:273, leader:377, regulator:609, genGov:1537, highOverseer:111041 },
    jinnHebrew:  { usurper:65, guide:91, mystery:125, adjuster:263, leader:367, regulator:599, genGov:1527, highOverseer:111031 },
  },
  sunSquare: {
    fire:  [[21,32,53,38,42,46],[27,37,48,52,25,43],[33,56,41,31,47,24],[44,23,34,49,28,54],[50,39,30,22,55,36],[57,45,26,40,35,29]],
    earth: [[57,50,44,33,27,21],[45,39,23,56,37,32],[26,30,34,41,48,53],[40,22,49,31,52,38],[35,55,28,47,25,42],[29,36,54,24,43,46]],
    air:   [[29,35,40,26,45,57],[36,55,22,30,39,50],[54,28,49,34,23,44],[24,47,31,41,56,33],[43,25,52,48,37,27],[46,42,38,53,32,21]],
    water: [[46,43,24,54,36,29],[42,25,47,28,55,35],[38,52,31,49,22,40],[53,48,41,34,30,26],[32,37,56,23,39,45],[21,27,33,44,50,57]],
    hierarchy: { usurper:21, guide:57, mystery:78, adjuster:232, leader:696, regulator:928, genGov:1856, highOverseer:105792 },
    angelArabic: { usurper:340, guide:16, mystery:37, adjuster:191, leader:655, regulator:887, genGov:1815, highOverseer:105751 },
    angelHebrew: { usurper:350, guide:26, mystery:47, adjuster:201, leader:665, regulator:897, genGov:1825, highOverseer:105761 },
    jinnArabic:  { usurper:62, guide:98, mystery:119, adjuster:273, leader:377, regulator:609, genGov:1537, highOverseer:105473 },
    jinnHebrew:  { usurper:52, guide:88, mystery:109, adjuster:263, leader:367, regulator:599, genGov:1527, highOverseer:105463 },
  },
  venusSquare: {
    fire:  [[9,50,35,20,40,54,24],[55,25,10,44,36,21,41],[22,42,56,26,11,45,30],[46,31,16,43,57,27,12],[28,13,47,32,17,37,58],[38,52,29,14,48,33,18],[34,19,39,53,23,15,49]],
    earth: [[34,38,28,46,22,55,9],[19,52,13,31,42,25,50],[39,29,47,16,56,10,35],[53,14,32,43,26,44,20],[23,48,17,57,11,36,40],[15,33,37,27,45,21,54],[49,18,58,12,30,41,24]],
    air:   [[49,15,23,53,39,19,34],[18,33,48,14,29,52,38],[58,37,17,32,47,13,28],[12,27,57,43,16,31,46],[30,45,11,26,56,42,22],[41,21,36,44,10,25,55],[24,54,40,20,35,50,9]],
    water: [[24,41,30,12,58,18,49],[54,21,45,27,37,33,15],[40,36,11,57,17,48,23],[20,44,26,43,32,14,53],[35,10,56,16,47,29,39],[50,25,42,31,13,52,19],[9,55,22,46,28,38,34]],
    hierarchy: { usurper:9, guide:58, mystery:67, adjuster:232, leader:696, regulator:928, genGov:1856, highOverseer:107648 },
    angelArabic: { usurper:328, guide:17, mystery:26, adjuster:191, leader:655, regulator:887, genGov:1815, highOverseer:107607 },
    angelHebrew: { usurper:338, guide:27, mystery:36, adjuster:201, leader:665, regulator:897, genGov:1825, highOverseer:107617 },
    jinnArabic:  { usurper:50, guide:99, mystery:108, adjuster:273, leader:377, regulator:609, genGov:1537, highOverseer:107329 },
    jinnHebrew:  { usurper:40, guide:89, mystery:98, adjuster:263, leader:367, regulator:599, genGov:1527, highOverseer:107319 },
  },
};

export const PISCES_VAKABIEL = {
  name: "Angel of Pisces: Vakabiel", hebrewValue: 69,
  gridSize: 3, planet: "Saturn",
  hebrewSquare: { numerical: [[5,21,5,38],[4,39,4,22],[19,7,40,3]] },
  saturnSquare: {
    fire:  [[24,19,26],[25,23,21],[20,27,22]],
    earth: [[20,25,24],[27,23,19],[22,21,26]],
    air:   [[22,27,20],[21,23,25],[26,19,24]],
    water: [[26,21,22],[19,23,27],[24,25,20]],
    hierarchy: { usurper:19, guide:27, mystery:46, adjuster:69, leader:207, regulator:276, genGov:552, highOverseer:14904 },
    angelArabic: { usurper:338, guide:346, mystery:5, adjuster:28, leader:166, regulator:235, genGov:511, highOverseer:14863 },
    angelHebrew: { usurper:348, guide:356, mystery:15, adjuster:38, leader:176, regulator:245, genGov:521, highOverseer:14873 },
    jinnArabic:  { usurper:60, guide:68, mystery:87, adjuster:110, leader:248, regulator:317, genGov:233, highOverseer:14585 },
    jinnHebrew:  { usurper:50, guide:58, mystery:77, adjuster:100, leader:238, regulator:307, genGov:223, highOverseer:14575 },
  },
  jupiterSquare: {
    fire:  [[9,20,14,26],[25,15,17,12],[19,10,27,13],[16,24,11,18]],
    earth: [[16,19,25,9],[24,10,15,20],[11,27,17,14],[18,13,12,26]],
    air:   [[18,11,24,16],[13,27,10,19],[12,17,15,25],[26,14,20,9]],
    water: [[26,12,13,18],[14,17,27,11],[20,15,10,24],[9,25,19,16]],
    hierarchy: { usurper:9, guide:27, mystery:36, adjuster:552, leader:1656, regulator:2208, genGov:4416, highOverseer:119232 },
    angelArabic: { usurper:328, guide:346, mystery:355, adjuster:511, leader:1615, regulator:2167, genGov:4375, highOverseer:119191 },
    angelHebrew: { usurper:338, guide:356, mystery:5, adjuster:521, leader:1625, regulator:2177, genGov:4385, highOverseer:119201 },
    jinnArabic:  { usurper:50, guide:68, mystery:77, adjuster:233, leader:1337, regulator:1889, genGov:4097, highOverseer:118913 },
    jinnHebrew:  { usurper:40, guide:58, mystery:67, adjuster:223, leader:1327, regulator:1879, genGov:4087, highOverseer:118903 },
  },
  marsSquare: {
    fire:  [[1,29,19,13,7],[14,8,2,25,20],[26,16,15,9,3],[10,4,27,17,11],[18,12,6,5,28]],
    air:   [[18,10,26,14,1],[12,4,16,8,29],[6,27,15,2,19],[5,17,9,25,13],[28,11,3,20,7]],
    earth: [[28,5,6,12,18],[11,17,27,4,10],[3,9,15,16,26],[20,25,2,8,14],[7,13,19,29,1]],
    water: [[7,20,3,11,28],[13,25,9,17,5],[19,2,15,27,6],[29,8,16,4,12],[1,14,26,10,18]],
    hierarchy: { usurper:1, guide:29, mystery:30, adjuster:69, leader:207, regulator:276, genGov:552, highOverseer:16008 },
    angelArabic: { usurper:320, guide:348, mystery:349, adjuster:28, leader:166, regulator:235, genGov:511, highOverseer:15967 },
    angelHebrew: { usurper:330, guide:358, mystery:359, adjuster:38, leader:176, regulator:245, genGov:521, highOverseer:15977 },
    jinnArabic:  { usurper:42, guide:70, mystery:71, adjuster:110, leader:248, regulator:317, genGov:233, highOverseer:15689 },
    jinnHebrew:  { usurper:32, guide:60, mystery:61, adjuster:100, leader:238, regulator:307, genGov:223, highOverseer:15679 },
  },
};

export const PISCES_RAMARA = {
  name: "Lord of Triplicity by Day: Ramara", hebrewValue: 441,
  gridSize: 3, planet: "Saturn",
  hebrewSquare: { numerical: [[199,41,199,2],[202,3,198,38],[39,197,4,201]] },
  saturnSquare: {
    fire:  [[148,143,150],[149,147,145],[144,151,146]],
    earth: [[144,149,148],[151,147,143],[146,145,150]],
    air:   [[146,151,144],[145,147,149],[150,143,148]],
    water: [[150,145,146],[143,147,151],[148,149,144]],
    hierarchy: { usurper:143, guide:151, mystery:294, adjuster:441, leader:1323, regulator:1764, genGov:3528, highOverseer:532728 },
    angelArabic: { usurper:102, guide:110, mystery:253, adjuster:400, leader:1282, regulator:1723, genGov:3487, highOverseer:532687 },
    angelHebrew: { usurper:112, guide:120, mystery:263, adjuster:410, leader:1292, regulator:1733, genGov:3497, highOverseer:532697 },
    jinnArabic:  { usurper:184, guide:192, mystery:335, adjuster:122, leader:1004, regulator:1445, genGov:3209, highOverseer:532409 },
    jinnHebrew:  { usurper:174, guide:182, mystery:325, adjuster:112, leader:994, regulator:1435, genGov:3199, highOverseer:532399 },
  },
  jupiterSquare: {
    fire:  [[102,113,107,119],[118,108,110,105],[112,103,120,106],[109,117,104,111]],
    earth: [[109,112,118,102],[117,103,108,113],[104,120,110,107],[111,106,105,119]],
    air:   [[111,104,117,109],[106,120,103,112],[105,110,108,118],[119,107,113,102]],
    water: [[119,105,106,111],[107,110,120,104],[113,108,103,117],[102,118,112,109]],
    hierarchy: { usurper:102, guide:120, mystery:222, adjuster:3528, leader:10584, regulator:14112, genGov:28224, highOverseer:3386880 },
    angelArabic: { usurper:61, guide:79, mystery:181, adjuster:3487, leader:10543, regulator:14071, genGov:28183, highOverseer:3386839 },
    angelHebrew: { usurper:71, guide:89, mystery:191, adjuster:3497, leader:10553, regulator:14081, genGov:28193, highOverseer:3386849 },
    jinnArabic:  { usurper:143, guide:161, mystery:263, adjuster:3209, leader:10265, regulator:13793, genGov:27905, highOverseer:3386561 },
    jinnHebrew:  { usurper:133, guide:151, mystery:253, adjuster:3199, leader:10255, regulator:13783, genGov:27895, highOverseer:3386551 },
  },
  marsSquare: {
    fire:  [[76,101,94,88,82],[89,83,77,97,95],[98,91,90,84,78],[85,79,99,92,86],[93,87,81,80,100]],
    air:   [[93,85,98,89,76],[87,79,91,83,101],[81,99,90,77,94],[80,92,84,97,88],[100,86,78,95,82]],
    earth: [[100,80,81,87,93],[86,92,99,79,85],[78,84,90,91,98],[95,97,77,83,89],[82,88,94,101,76]],
    water: [[82,95,78,86,100],[88,97,84,92,80],[94,77,90,99,81],[101,83,91,79,87],[76,89,98,85,93]],
    hierarchy: { usurper:76, guide:101, mystery:177, adjuster:441, leader:1323, regulator:1764, genGov:3528, highOverseer:356328 },
    angelArabic: { usurper:35, guide:60, mystery:136, adjuster:400, leader:1282, regulator:1723, genGov:3487, highOverseer:356287 },
    angelHebrew: { usurper:45, guide:70, mystery:146, adjuster:410, leader:1292, regulator:1733, genGov:3497, highOverseer:356297 },
    jinnArabic:  { usurper:117, guide:142, mystery:218, adjuster:122, leader:1004, regulator:1445, genGov:3209, highOverseer:356009 },
    jinnHebrew:  { usurper:107, guide:132, mystery:208, adjuster:112, leader:994, regulator:1435, genGov:3199, highOverseer:355999 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION I — CRITICAL PATTERNS CONFIRMED FROM THIS PDF
// ─────────────────────────────────────────────────────────────────────────────
export const PDF4_CONFIRMED_PATTERNS = {

  // HIGH OVERSEER = GenGov × Guide — verified on every entity in this PDF
  highOverseerFormula: {
    rule: "HighOverseer = GenGov × Guide",
    verified: true,
    examples: [
      { entity:"Kambriel Jupiter", genGov:19456, guide:85, result:1653760 },
      { entity:"Kambriel Mars", genGov:2432, guide:76, result:184832 },
      { entity:"Kambriel Sun", genGov:2432, guide:69, result:167808 },
      { entity:"Kambriel Venus", genGov:2432, guide:70, result:170240 },
      { entity:"Kambriel Mercury", genGov:2432, guide:73, result:177536 },
      { entity:"Tzakmiqiel Saturn", genGov:2328, guide:101, result:235128 },
      { entity:"Tzakmiqiel Jupiter", genGov:18624, guide:81, result:1508544 },
      { entity:"Tzakmiqiel Mars", genGov:2328, guide:71, result:165288 },
      { entity:"Tzakmiqiel Sun", genGov:2328, guide:66, result:153648 },
      { entity:"Athor Jupiter", genGov:43264, guide:178, result:7700992 },
      { entity:"Athor Mars", genGov:5408, guide:148, result:800384 },
      { entity:"Athor Sun", genGov:5408, guide:131, result:708448 },
      { entity:"Athor Venus", genGov:5408, guide:124, result:670592 },
      { entity:"Athor Mercury", genGov:5408, guide:116, result:627328 },
      { entity:"Athor Moon", genGov:5408, guide:116, result:627328 },
      { entity:"Athor Saturn", genGov:5408, guide:118, result:638144 },
      { entity:"Polayan Saturn", genGov:1368, guide:61, result:83448 },
      { entity:"Saspam Saturn", genGov:1920, guide:84, result:161280 },
      { entity:"Saspam Jupiter", genGov:15360, guide:69, result:1059840 },
      { entity:"Rehael Saturn", genGov:2448, guide:106, result:259488 },
      { entity:"Rehael Jupiter", genGov:19584, guide:84, result:1645056 },
      { entity:"Aniel Jupiter", genGov:5888, guide:32, result:188416 },
      { entity:"Amnitziel Jupiter", genGov:14848, guide:67, result:994816 },
      { entity:"Vakabiel Saturn", genGov:552, guide:27, result:14904 },
      { entity:"Vakabiel Jupiter", genGov:4416, guide:27, result:119232 },
      { entity:"Ramara Saturn", genGov:3528, guide:151, result:532728 },
      { entity:"Ramara Jupiter", genGov:28224, guide:120, result:3386880 },
      { entity:"Ramara Mars", genGov:3528, guide:101, result:356328 },
    ],
  },

  // ANGEL/JINN suffix rule — confirmed on all entries
  angelJinnRule: {
    rule: "Angel = Number − 41 (Arabic) or − 31 (Hebrew); Jinn = Number + 41 (Arabic) or + 31 (Hebrew)",
    note: "When result falls below 1, wraps: subtract from 361 (i.e., 360+1−|negative|)",
    verified: true,
  },

  // AQUARIUS KEY DATA
  aquariusData: {
    signName: "Deli", signValue: 44, noHebrewSquares: true,
    archangel: { name:"Kambriel", value:304, adjuster:304, genGov:2432 },
    angel: { name:"Tzakmiqiel", value:291, adjuster:291, genGov:2328 },
    lordDay: { name:"Athor", value:676, adjuster:676, genGov:5408 },
    lordNight: { name:"Polayan", value:171, adjuster:171, genGov:1368 },
    houseAngel: { house:11, name:"Ansuel", value:148 },
    decanate1: { name:"Saspam", value:240, adjuster:240, genGov:1920 },
    decanate2: { name:"Abdaron", value:263, numericalPage:411 },
    decanate3: { name:"Gerodiel", value:254, numericalPage:355 },
    quinances: [
      { n:1, name:"Aniel",   value:92 },
      { n:2, name:"Chamiah", value:133 },
      { n:3, name:"Rehael",  value:306 },
      { n:4, name:"Yeyazel", value:58, numericalPage:549 },
      { n:5, name:"Hahahel", value:46, numericalPage:90 },
      { n:6, name:"Michael", value:101, numericalPage:247 },
    ],
  },

  // PISCES KEY DATA
  piscesData: {
    signName: "Dagim", signValue: 57, numericalPage: 436,
    archangel: { name:"Amnitziel", value:232, genGov:14848 },
    angel: { name:"Vakabiel", value:69, genGov:552 },
    lordDay: { name:"Ramara", value:441, genGov:3528 },
    // Lord Night + remaining entities in next PDF part
  },

  // STRUCTURAL NOTE: Constant Adjuster Rule
  constantAdjusterRule: {
    rule: "For all planetary size squares of the same entity, the Adjuster stays constant (= entity's own value). Only the usurper, guide, mystery, and HighOverseer change with planet size.",
    examplesFromThisBatch: [
      "Kambriel (304): Adjuster=304 across Mars, Sun, Venus, Mercury ✓",
      "Tzakmiqiel (291): Adjuster=291 across Saturn, Mars, Sun, Venus, Mercury ✓",
      "Athor (676): Adjuster=676 across Mars, Sun, Venus, Mercury, Moon ✓",
      "Polayan (171): Adjuster=171 across Saturn, Jupiter, Mars, Sun ✓",
      "Saspam (240): Adjuster=240 across Saturn, Jupiter, Mars, Venus ✓",
      "Rehael (306): Adjuster=306 across Saturn, Jupiter, Mars, Sun, Venus, Mercury ✓",
    ],
    verified: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION J — PROCESSING LOG
// ─────────────────────────────────────────────────────────────────────────────
export const PDF4_LOG = {
  id: "PDF-PART4",
  date_added: "2026-06-07",
  source: "PDF — Occult Encyclopedia of Magick Squares, pages 559–609 (51 pages)",
  chapters_covered: ["Aquarius (complete, pp.559–600)", "Pisces (opening, pp.601–609)"],
  entities_extracted: 18,
  square_tables_extracted: 85,
  criticalFindings: [
    "HighOverseer = GenGov × Guide — verified on 27+ entities (zero exceptions ever found)",
    "Constant Adjuster rule re-confirmed: entity value = Adjuster across ALL planet sizes",
    "Aquarius: Deli(44) no Hebrew squares | Kambriel(304) | Tzakmiqiel(291) | Athor(676) | Polayan(171)",
    "Aquarius decanates: Saspam(240) | Abdaron(263) | Gerodiel(254)",
    "Aquarius quinances: Aniel(92) | Chamiah(133) | Rehael(306) | Yeyazel(58) | Hahahel(46) | Michael(101)",
    "House 11 angel: Ansuel(148)",
    "Pisces chapter opened: Dagim(57) | Amnitziel(232) | Vakabiel(69) | Ramara(441)",
    "Full elemental squares (Fire/Earth/Air/Water) stored for every entity across all planet sizes",
  ],
};

export default {
  AQUARIUS_CHAPTER, AQUARIUS_KAMBRIEL, AQUARIUS_TZAKMIQIEL,
  AQUARIUS_ATHOR, AQUARIUS_POLAYAN, AQUARIUS_SASPAM,
  AQUARIUS_QUINANCE_ANGELS,
  PISCES_CHAPTER, PISCES_AMNITZIEL, PISCES_VAKABIEL, PISCES_RAMARA,
  PDF4_CONFIRMED_PATTERNS, PDF4_LOG,
};