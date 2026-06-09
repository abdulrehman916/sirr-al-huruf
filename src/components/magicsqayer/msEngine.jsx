// ═══════════════════════════════════════════════════════════════
//  MAGIC SQUARE ENGINE — Book Authority Only
//  Source: Occult Encyclopedia of Magic Squares
// ═══════════════════════════════════════════════════════════════

// ── Planet mapping (3–16, cycling Saturn→Moon per book) ─────────
export const SIZE_PLANET_MAP = {
  3:"zuhal", 4:"mustari", 5:"merih",  6:"sems",
  7:"zuhre", 8:"utarid",  9:"kamer",
  // Extended cycle (10–16 follow the same Saturn→Moon pattern)
  10:"zuhal", 11:"mustari", 12:"merih", 13:"sems",
  14:"zuhre", 15:"utarid",  16:"kamer",
};

export const PLANET_EN = {
  zuhal:"Saturn", mustari:"Jupiter", merih:"Mars",
  sems:"Sun", zuhre:"Venus", utarid:"Mercury", kamer:"Moon",
};

export const PLANETS = [
  { key:"zuhal",   arabic:"الزحل",   malayalam:"ശനി",     english:"Saturn",  icon:"🪐", color:"#9B7FD4", glow:"rgba(155,127,212,0.35)", bg:"rgba(155,127,212,0.10)", border:"rgba(155,127,212,0.50)" },
  { key:"mustari", arabic:"المشتري", malayalam:"വ്യാഴം",  english:"Jupiter", icon:"✨", color:"#74C0FC", glow:"rgba(116,192,252,0.35)", bg:"rgba(116,192,252,0.10)", border:"rgba(116,192,252,0.50)" },
  { key:"merih",   arabic:"المريخ",  malayalam:"ചൊവ്വ",   english:"Mars",    icon:"🔴", color:"#FF4444", glow:"rgba(255,68,68,0.35)",   bg:"rgba(255,68,68,0.10)",   border:"rgba(255,68,68,0.50)" },
  { key:"sems",    arabic:"الشمس",   malayalam:"സൂര്യൻ",  english:"Sun",     icon:"☀️", color:"#FBBF24", glow:"rgba(251,191,36,0.35)",  bg:"rgba(251,191,36,0.10)",  border:"rgba(251,191,36,0.50)" },
  { key:"zuhre",   arabic:"الزهرة",  malayalam:"ശുക്രൻ",  english:"Venus",   icon:"💖", color:"#F9A8D4", glow:"rgba(249,168,212,0.35)", bg:"rgba(249,168,212,0.10)", border:"rgba(249,168,212,0.50)" },
  { key:"utarid",  arabic:"العطارد", malayalam:"ബുധൻ",    english:"Mercury", icon:"🧠", color:"#34D399", glow:"rgba(52,211,153,0.35)",  bg:"rgba(52,211,153,0.10)",  border:"rgba(52,211,153,0.50)" },
  { key:"kamer",   arabic:"القمر",   malayalam:"ചന്ദ്രൻ", english:"Moon",    icon:"🌙", color:"#818CF8", glow:"rgba(129,140,248,0.35)", bg:"rgba(129,140,248,0.10)", border:"rgba(129,140,248,0.50)" },
];

export const ELEMENTS = [
  { key:"fire",  arabic:"النار",   malayalam:"അഗ്നി", english:"Fire",  icon:"🔥", color:"#FF6B35", glow:"rgba(255,107,53,0.35)",  bg:"rgba(255,107,53,0.10)",  border:"rgba(255,107,53,0.50)"  },
  { key:"air",   arabic:"الهواء",  malayalam:"വായു",  english:"Air",   icon:"🌬", color:"#B2EBF2", glow:"rgba(178,235,242,0.35)", bg:"rgba(178,235,242,0.10)", border:"rgba(178,235,242,0.50)" },
  { key:"earth", arabic:"التراب",  malayalam:"ഭൂമി",  english:"Earth", icon:"🌍", color:"#A5C880", glow:"rgba(165,200,128,0.35)", bg:"rgba(165,200,128,0.10)", border:"rgba(165,200,128,0.50)" },
  { key:"water", arabic:"الماء",   malayalam:"ജലം",   english:"Water", icon:"💧", color:"#4FC3F7", glow:"rgba(79,195,247,0.35)",  bg:"rgba(79,195,247,0.10)",  border:"rgba(79,195,247,0.50)"  },
];

// ── Triangular constant: n(n²−1)/2 ─────────────────────────────
export function triangle(n) { return n * (n * n - 1) / 2; }

// ── Suffix constants (book authority) ───────────────────────────
export const SUFFIX_VAL = { none:0, arabic:41, hebrew:31 };

// ── Apply suffix + negative-360 fix ─────────────────────────────
export function applyISuffix(raw, mode) {
  const s = SUFFIX_VAL[mode] || 0;
  if (s === 0) return { mc: raw, subtracted: false, negFixed: false };
  let mc = raw - s;
  let negFixed = false;
  if (mc <= 0) { mc += 360; negFixed = true; }
  return { mc, subtracted: true, negFixed };
}

// ── Compatibility check ──────────────────────────────────────────
export function isCompatible(mc, n) {
  const tri = triangle(n);
  const diff = mc - tri;
  return diff > 0 && diff % n === 0;
}

export function compatibleSizes(mc) {
  return [3,4,5,6,7,8,9,10,11,12,13,14,15,16].filter(n => isCompatible(mc, n));
}

// ── Usurper (starting cell value A) ─────────────────────────────
export function computeUsurper(mc, n) {
  if (!isCompatible(mc, n)) return null;
  return (mc - triangle(n)) / n;
}

// ── Hierarchy table (8 rows per book) ────────────────────────────
export function buildHierarchy(mc, n) {
  const A = computeUsurper(mc, n);
  if (A === null) return null;
  const usurper   = A;
  const guide     = A + n * n - 1;
  const mystery   = usurper + guide;
  const adjuster  = mc;                          // magic constant
  const leader    = adjuster * n;
  const regulator = adjuster * (n + 1);
  const genGov    = adjuster * 2 * (n + 1);
  // High Overseer — Book formula: General Governor × Guide
  const highOver  = genGov * guide;
  return { usurper, guide, mystery, adjuster, leader, regulator, genGov, highOver };
}

// ── Angel/Jinn derivation (±41 Arabic, ±31 Hebrew) ───────────────
// Book rule: if angel result ≤ 0, add 360 (negative fix)
export function angelJinn(v) {
  let angelAr  = v - 41; if (angelAr  <= 0) angelAr  += 360;
  let angelHeb = v - 31; if (angelHeb <= 0) angelHeb += 360;
  return { angelAr, angelHeb, jinnAr: v + 41, jinnHeb: v + 31 };
}

// ════════════════════════════════════════════════════════════════
//  CONSTRUCTION ALGORITHMS
// ════════════════════════════════════════════════════════════════

// Odd-order: Siamese (de la Loubère)
function siameseStd(n) {
  const g = Array.from({length:n}, () => Array(n).fill(0));
  let r = 0, c = Math.floor(n/2);
  for (let k = 1; k <= n * n; k++) {
    g[r][c] = k;
    const nr = (r-1+n)%n, nc = (c+1)%n;
    if (g[nr][nc] !== 0) r = (r+1)%n;
    else { r = nr; c = nc; }
  }
  return g;
}

// Doubly-even (n%4===0): diagonal complement
function doublyEvenStd(n) {
  const g = Array.from({length:n}, () => Array(n).fill(0));
  for (let i=0;i<n;i++) for (let j=0;j<n;j++) g[i][j] = i*n+j+1;
  for (let i=0;i<n;i++) for (let j=0;j<n;j++) {
    const bi=i%4, bj=j%4;
    if (bi===bj || bi+bj===3) g[i][j] = n*n+1-g[i][j];
  }
  return g;
}

// Singly-even (n%2===0, n%4!==0): Strachey method
function singlyEvenStd(n) {
  const h = n/2;
  const base = Array.from({length:h}, () => Array(h).fill(0));
  let r=0, c=Math.floor(h/2);
  for (let k=1;k<=h*h;k++) {
    base[r][c] = k;
    const nr=(r-1+h)%h, nc=(c+1)%h;
    if (base[nr][nc]!==0||(nr===0&&nc===Math.floor(h/2))) r=(r+1)%h;
    else { r=nr; c=nc; }
  }
  const g = Array.from({length:n}, () => Array(n).fill(0));
  for (let i=0;i<h;i++) for (let j=0;j<h;j++) {
    g[i][j]       = base[i][j];
    g[i][j+h]     = base[i][j]+2*h*h;
    g[i+h][j]     = base[i][j]+h*h;
    g[i+h][j+h]   = base[i][j]+3*h*h;
  }
  const k = Math.floor((n-2)/4), mid = Math.floor(h/2);
  for (let i=0;i<h;i++) for (let j=0;j<k;j++) {
    if (i===mid&&j===0) continue;
    [g[i][j],g[i+h][j]]=[g[i+h][j],g[i][j]];
  }
  [g[mid][k],g[mid+h][k]]=[g[mid+h][k],g[mid][k]];
  for (let i=0;i<h;i++) for (let j=n-k+1;j<n;j++) {
    [g[i][j],g[i+h][j]]=[g[i+h][j],g[i][j]];
  }
  return g;
}

function buildBaseSquare(n) {
  if (n%2===1)     return siameseStd(n);
  if (n%4===0)     return doublyEvenStd(n);
  return singlyEvenStd(n);
}

// ── Affine shift: maps 1..n² → usurper..usurper+n²-1 ────────────
function buildMagicSquare(n, usurper) {
  return buildBaseSquare(n).map(row => row.map(v => v - 1 + usurper));
}

// ── Elemental transforms (BOOK ORDER confirmed) ──────────────────
// Fire = original, Air = LR mirror, Earth = TB mirror, Water = 180°
function elementTransform(g, key) {
  const clone = () => g.map(row=>[...row]);
  if (key==="fire")  return clone();
  if (key==="air")   return clone().map(row=>[...row].reverse());
  if (key==="earth") return [...clone()].reverse();
  if (key==="water") return [...clone()].reverse().map(row=>[...row].reverse());
  return clone();
}

export function generateSquare(n, usurper, elementKey) {
  return elementTransform(buildMagicSquare(n, usurper), elementKey);
}

// ── Verification ─────────────────────────────────────────────────
export function verifySquare(g) {
  const n = g.length;
  const mc = g[0].reduce((s,v)=>s+v,0);
  const rowOk = g.every(row=>row.reduce((s,v)=>s+v,0)===mc);
  const colOk = Array.from({length:n},(_,j)=>g.reduce((s,row)=>s+row[j],0)).every(s=>s===mc);
  const d1Ok  = g.reduce((s,row,i)=>s+row[i],0)===mc;
  const d2Ok  = g.reduce((s,row,i)=>s+row[n-1-i],0)===mc;
  return { mc, rowOk, colOk, d1Ok, d2Ok, valid: rowOk&&colOk&&d1Ok&&d2Ok };
}

// ════════════════════════════════════════════════════════════════
//  LETTER TABLES (book authority)
// ════════════════════════════════════════════════════════════════

// Arabic Abjad — 28 letters, values 1–1000
export const ARABIC_ABJAD = [
  {letter:"ا", name:"Alef",  val:1},
  {letter:"ب", name:"Ba",    val:2},
  {letter:"ج", name:"Jeem",  val:3},
  {letter:"د", name:"Dal",   val:4},
  {letter:"ه", name:"Ha",    val:5},
  {letter:"و", name:"Waw",   val:6},
  {letter:"ز", name:"Zai",   val:7},
  {letter:"ح", name:"Ha2",   val:8},
  {letter:"ط", name:"Toa",   val:9},
  {letter:"ي", name:"Ya",    val:10},
  {letter:"ك", name:"Kaf",   val:20},
  {letter:"ل", name:"Lam",   val:30},
  {letter:"م", name:"Meem",  val:40},
  {letter:"ن", name:"Nun",   val:50},
  {letter:"س", name:"Seen",  val:60},
  {letter:"ع", name:"Ayin",  val:70},
  {letter:"ف", name:"Fa",    val:80},
  {letter:"ص", name:"Sad",   val:90},
  {letter:"ق", name:"Qaf",   val:100},
  {letter:"ر", name:"Ra",    val:200},
  {letter:"ش", name:"Sheen", val:300},
  {letter:"ت", name:"Ta",    val:400},
  {letter:"ث", name:"Tha",   val:500},
  {letter:"خ", name:"Kha",   val:600},
  {letter:"ذ", name:"Dhal",  val:700},
  {letter:"ض", name:"Dad",   val:800},
  {letter:"ظ", name:"Zhoa",  val:900},
  {letter:"غ", name:"Ghain", val:1000},
];

// Hebrew Gematria — 22 letters (1–400), compounds above 400
export const HEBREW_GEMATRIA = [
  {letter:"א", name:"Aleph", val:1},
  {letter:"ב", name:"Beth",  val:2},
  {letter:"ג", name:"Gimel", val:3},
  {letter:"ד", name:"Daleth",val:4},
  {letter:"ה", name:"Heh",   val:5},
  {letter:"ו", name:"Waw",   val:6},
  {letter:"ז", name:"Zayin", val:7},
  {letter:"ח", name:"Heth",  val:8},
  {letter:"ט", name:"Teth",  val:9},
  {letter:"י", name:"Yod",   val:10},
  {letter:"כ", name:"Kaf",   val:20},
  {letter:"ל", name:"Lamed", val:30},
  {letter:"מ", name:"Mem",   val:40},
  {letter:"נ", name:"Nun",   val:50},
  {letter:"ס", name:"Samekh",val:60},
  {letter:"ע", name:"Ayin",  val:70},
  {letter:"פ", name:"Pe",    val:80},
  {letter:"צ", name:"Tsadi", val:90},
  {letter:"ק", name:"Qof",   val:100},
  {letter:"ר", name:"Resh",  val:200},
  {letter:"ש", name:"Shin",  val:300},
  {letter:"ת", name:"Tav",   val:400},
];

// ── Hebrew letter maps (positional, same Akram digit-cycle as Arabic) ──
const HEB_UNITS    = { 1:'א',2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט' };
const HEB_TENS     = { 10:'י',20:'כ',30:'ל',40:'מ',50:'נ',60:'ס',70:'ע',80:'פ',90:'צ' };
// Hebrew hundreds: 100–400 are single letters; 500–900 are compounds (standard gematria)
const HEB_HUNDREDS = {
  100:'ק', 200:'ר', 300:'ש', 400:'ת',
  500:'תק', 600:'תר', 700:'תש', 800:'תת', 900:'תתק',
};

/**
 * numToHebrew — POSITIONAL Akram-style decomposition (mirrors toAkramPieces).
 * Processes digits right-to-left through a fixed slot cycle:
 *   slot 0 = Unit (1–9)
 *   slot 1 = Ten  (10–90)
 *   slot 2 = Hundred (100–900, using compound letters above 400)
 *   slot 3 = Thousand marker: emits nothing extra (Hebrew has no distinct thousands
 *            letter in standard gematria), just advances the cycle from Ten again.
 *            The digit consumed at slot 3 is treated as additional units of 1000 —
 *            we emit it as a Unit letter so the name stays compact and readable.
 *
 * This guarantees O(digits) output — never repeats letters for large values.
 */
export function numToHebrew(n) {
  if (!n || n < 1) return '';
  n = Math.floor(n);

  // Extract digits right-to-left (LSD first)
  const digits = [];
  let tmp = n;
  while (tmp > 0) { digits.push(tmp % 10); tmp = Math.floor(tmp / 10); }

  const pieces = [];
  let i = 0, slot = 0;

  while (i < digits.length) {
    const d = digits[i];

    if (slot === 0) {
      if (d !== 0 && HEB_UNITS[d]) pieces.push(HEB_UNITS[d]);
      i++; slot = 1;
    } else if (slot === 1) {
      const v = d * 10;
      if (d !== 0 && HEB_TENS[v]) pieces.push(HEB_TENS[v]);
      i++; slot = 2;
    } else if (slot === 2) {
      const v = d * 100;
      if (d !== 0 && HEB_HUNDREDS[v]) pieces.push(HEB_HUNDREDS[v]);
      i++; slot = 3;
    } else {
      // Thousand slot — Hebrew uses the digit as a plain unit marker (compact)
      if (d !== 0 && HEB_UNITS[d]) pieces.push(HEB_UNITS[d]);
      i++; slot = 1;
    }
  }

  return pieces.join('');
}

// Convert number to Arabic Abjad letters — positional Akram method (no greedy repeats)
const AR_UNITS    = { 1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط' };
const AR_TENS     = { 10:'ي',20:'ك',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص' };
const AR_HUNDREDS = { 100:'ق',200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ' };

export function numToArabic(n) {
  if (!n || n < 1) return '';
  n = Math.floor(n);
  const digits = [];
  let tmp = n;
  while (tmp > 0) { digits.push(tmp % 10); tmp = Math.floor(tmp / 10); }
  const pieces = [];
  let i = 0, slot = 0;
  while (i < digits.length) {
    const d = digits[i];
    if (slot === 0) {
      if (d !== 0 && AR_UNITS[d])    pieces.push(AR_UNITS[d]);
      i++; slot = 1;
    } else if (slot === 1) {
      const v = d * 10;
      if (d !== 0 && AR_TENS[v])     pieces.push(AR_TENS[v]);
      i++; slot = 2;
    } else if (slot === 2) {
      const v = d * 100;
      if (d !== 0 && AR_HUNDREDS[v]) pieces.push(AR_HUNDREDS[v]);
      i++; slot = 3;
    } else {
      // Thousand slot: غ marker, then digit as Unit if non-zero/non-1
      pieces.push('غ');
      if (d !== 0 && d !== 1) pieces.push(AR_UNITS[d]);
      i++; slot = 1;
    }
  }
  return pieces.join('');
}