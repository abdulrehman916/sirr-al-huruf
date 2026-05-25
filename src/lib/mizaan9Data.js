// ═══════════════════════════════════════════════════════════════
// MIZAAN 9 — STATIC DATA TABLES  (v2)
// All occult data for sections 3-9
// ═══════════════════════════════════════════════════════════════

// ── MIZAAN 3: Khayr / Sharr ──
export const MIZAAN_KHAYR_SHARR = {
  khayr: {
    label: 'Khayr',
    arabic: 'الخير',
    desc: 'Benevolence & blessing',
    bast: 1416,
    elements: ['fire', 'air'],   // compatible elements
    color: '#4ADE80',
    glow: 'rgba(74,222,128,0.35)',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.45)',
    icon: '✨',
  },
  sharr: {
    label: 'Sharr',
    arabic: 'الشر',
    desc: 'Power & banishment',
    bast: 501,
    elements: ['earth', 'water'], // compatible elements
    color: '#F87171',
    glow: 'rgba(248,113,113,0.35)',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.45)',
    icon: '⚡',
  },
};

// ── MIZAAN 4: Hours ──
export const MIZAAN_HOURS = [
  { hour: 1,  arabic: 'الساعة الأولى',         bast: 5460 },
  { hour: 2,  arabic: 'الساعة الثانية',        bast: 5760 },
  { hour: 3,  arabic: 'الساعة الثالثة',        bast: 6276 },
  { hour: 4,  arabic: 'الساعة الرابعة',        bast: 4983 },
  { hour: 5,  arabic: 'الساعة الخامسة',        bast: 5038 },
  { hour: 6,  arabic: 'الساعة السادسة',        bast: 4984 },
  { hour: 7,  arabic: 'الساعة السابعة',        bast: 4466 },
  { hour: 8,  arabic: 'الساعة الثامنة',        bast: 5520 },
  { hour: 9,  arabic: 'الساعة التاسعة',        bast: 4711 },
  { hour: 10, arabic: 'الساعة العاشرة',        bast: 5462 },
  { hour: 11, arabic: 'الساعة الحادية عشرة',   bast: 7273 },
  { hour: 12, arabic: 'الساعة الثانية عشرة',   bast: 7906 },
];

// ── MIZAAN 5: Days ──
export const MIZAAN_DAYS = [
  { key: 'sun', arabic: 'الأحد',     icon: '☀️', bast: 2024, color: '#FBBF24' },
  { key: 'mon', arabic: 'الإثنين',   icon: '🌙', bast: 4001, color: '#818CF8' },
  { key: 'tue', arabic: 'الثلاثاء',  icon: '🔥', bast: 3784, color: '#F87171' },
  { key: 'wed', arabic: 'الأربعاء',  icon: '🌿', bast: 3491, color: '#34D399' },
  { key: 'thu', arabic: 'الخميس',    icon: '⭐', bast: 3077, color: '#74C0FC' },
  { key: 'fri', arabic: 'الجمعة',    icon: '🕌', bast: 3399, color: '#F9A8D4' },
  { key: 'sat', arabic: 'السبت',     icon: '🪐', bast: 2590, color: '#9B7FD4' },
];

// ── MIZAAN 6: Planets ──
export const MIZAAN_PLANETS_ALL = [
  { key: 'zuhal',   arabic: 'الزحل',    icon: '🪐', color: '#9B7FD4', bast: 2963 },
  { key: 'mustari', arabic: 'المشتري',  icon: '✨', color: '#74C0FC', bast: 3980 },
  { key: 'merih',   arabic: 'المريخ',   icon: '🔥', color: '#FF4444', bast: 3070 },
  { key: 'sems',    arabic: 'الشمس',    icon: '☀️', color: '#FBBF24', bast: 3071 },
  { key: 'zuhre',   arabic: 'الزهرة',   icon: '💖', color: '#F9A8D4', bast: 3189 },
  { key: 'utarid',  arabic: 'العطارد',  icon: '🧠', color: '#34D399', bast: 2665 },
  { key: 'kamer',   arabic: 'القمر',    icon: '🌙', color: '#818CF8', bast: 2029 },
];

// Day key → planet key mapping
export const DAY_PLANET_MAP = {
  sun: 'sems', mon: 'kamer', tue: 'merih', wed: 'utarid',
  thu: 'mustari', fri: 'zuhre', sat: 'zuhal',
};

// ── MIZAAN 7: Purposes ──
export const MIZAAN_PURPOSES = [
  { key: 'celb',   arabic: 'جلب',          icon: '💖', color: '#FF6B6B', bast: 2754 },
  { key: 'tard',   arabic: 'طرد',          icon: '🚫', color: '#A5C880', bast: 1339 },
  { key: 'sihhat', arabic: 'الصحة',        icon: '🩺', color: '#4FC3F7', bast: 2657 },
  { key: 'sekam',  arabic: 'السقم',        icon: '☠️', color: '#9B7FD4', bast: 2036 },
  { key: 'tarfet', arabic: 'طرفة العين',   icon: '🧿', color: '#D4AF37', bast: 4704 },
];

// ── MIZAAN 8: Day / Night (full) ──
export const MIZAAN_DAYNIGHT_FULL = {
  gunduz: {
    label: 'Gündüz',
    arabic: 'النهار',
    icon: '☀️',
    bast: 3120,
    desc: 'Solar force — peak daytime energy',
    elements: ['fire', 'earth'],
    color: '#FBBF24',
    glow: 'rgba(251,191,36,0.35)',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.40)',
  },
  gece: {
    label: 'Gece',
    arabic: 'الليل',
    icon: '🌙',
    bast: 3886,
    desc: 'Lunar force — nocturnal wisdom',
    elements: ['air', 'water'],
    color: '#818CF8',
    glow: 'rgba(129,140,248,0.35)',
    bg: 'rgba(129,140,248,0.08)',
    border: 'rgba(129,140,248,0.40)',
  },
};

// ── Helpers ──
export function getDominantDayNight(dominant) {
  if (!dominant) return null;
  if (['fire', 'earth'].includes(dominant)) return 'gunduz';
  return 'gece';
}

export function getDominantPurpose(dominant) {
  if (!dominant) return null;
  const match = MIZAAN_PURPOSES.find(p => p.elements.includes(dominant));
  return match?.key ?? null;
}

export function getBestHour(dominant) {
  if (!dominant) return null;
  const match = MIZAAN_HOURS.find(h => h.compatible.includes(dominant));
  return match?.hour ?? null;
}

export function getBestDay(dominant) {
  if (!dominant) return null;
  const match = MIZAAN_DAYS.find(d => d.compatible.includes(dominant));
  return match?.key ?? null;
}

export function getDominantPlanet(dominant) {
  if (!dominant) return null;
  const match = MIZAAN_PLANETS_ALL.find(p => p.element === dominant);
  return match?.key ?? null;
}