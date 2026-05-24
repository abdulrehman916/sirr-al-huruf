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
  { hour: 1,  label: '1st',  arabic: 'الأولى',    planet: 'Şems',    symbol: '☉', compatible: ['fire'] },
  { hour: 2,  label: '2nd',  arabic: 'الثانية',   planet: 'Zühre',   symbol: '♀', compatible: ['water'] },
  { hour: 3,  label: '3rd',  arabic: 'الثالثة',   planet: 'Utarid',  symbol: '☿', compatible: ['air'] },
  { hour: 4,  label: '4th',  arabic: 'الرابعة',   planet: 'Kamer',   symbol: '☽', compatible: ['water'] },
  { hour: 5,  label: '5th',  arabic: 'الخامسة',   planet: 'Zühal',   symbol: '♄', compatible: ['earth'] },
  { hour: 6,  label: '6th',  arabic: 'السادسة',   planet: 'Müşteri', symbol: '♃', compatible: ['air'] },
  { hour: 7,  label: '7th',  arabic: 'السابعة',   planet: 'Merih',   symbol: '♂', compatible: ['fire'] },
  { hour: 8,  label: '8th',  arabic: 'الثامنة',   planet: 'Şems',    symbol: '☉', compatible: ['fire'] },
  { hour: 9,  label: '9th',  arabic: 'التاسعة',   planet: 'Zühre',   symbol: '♀', compatible: ['water'] },
  { hour: 10, label: '10th', arabic: 'العاشرة',   planet: 'Utarid',  symbol: '☿', compatible: ['air'] },
  { hour: 11, label: '11th', arabic: 'الحادية عشر', planet: 'Kamer', symbol: '☽', compatible: ['water'] },
  { hour: 12, label: '12th', arabic: 'الثانية عشر', planet: 'Zühal', symbol: '♄', compatible: ['earth'] },
];

// ── MIZAAN 5: Days ──
export const MIZAAN_DAYS = [
  { key: 'sun',  label: 'Sunday',    arabic: 'الأحد',       planet: 'Şems',    symbol: '☉', compatible: ['fire'],  color: '#FBBF24' },
  { key: 'mon',  label: 'Monday',    arabic: 'الاثنين',     planet: 'Kamer',   symbol: '☽', compatible: ['water'], color: '#818CF8' },
  { key: 'tue',  label: 'Tuesday',   arabic: 'الثلاثاء',    planet: 'Merih',   symbol: '♂', compatible: ['fire'],  color: '#F87171' },
  { key: 'wed',  label: 'Wednesday', arabic: 'الأربعاء',    planet: 'Utarid',  symbol: '☿', compatible: ['air'],   color: '#34D399' },
  { key: 'thu',  label: 'Thursday',  arabic: 'الخميس',      planet: 'Müşteri', symbol: '♃', compatible: ['air'],   color: '#74C0FC' },
  { key: 'fri',  label: 'Friday',    arabic: 'الجمعة',      planet: 'Zühre',   symbol: '♀', compatible: ['water'], color: '#F9A8D4' },
  { key: 'sat',  label: 'Saturday',  arabic: 'السبت',       planet: 'Zühal',   symbol: '♄', compatible: ['earth'], color: '#9B7FD4' },
];

// ── MIZAAN 6: Planets ──
export const MIZAAN_PLANETS_ALL = [
  { key: 'sems',    name: 'Şems',    arabic: 'الشمس',    symbol: '☉', element: 'fire',  color: '#FBBF24', bast: 2870 },
  { key: 'kamer',   name: 'Kamer',   arabic: 'القمر',    symbol: '☽', element: 'water', color: '#818CF8', bast: 2520 },
  { key: 'merih',   name: 'Merih',   arabic: 'المريخ',   symbol: '♂', element: 'fire',  color: '#FF4444', bast: 3124 },
  { key: 'utarid',  name: 'Utarid',  arabic: 'عطارد',    symbol: '☿', element: 'air',   color: '#34D399', bast: 2160 },
  { key: 'mustari', name: 'Müşteri', arabic: 'المشتري',  symbol: '♃', element: 'air',   color: '#74C0FC', bast: 3757 },
  { key: 'zuhre',   name: 'Zühre',   arabic: 'الزهرة',   symbol: '♀', element: 'water', color: '#F9A8D4', bast: 3342 },
  { key: 'zuhal',   name: 'Zühal',   arabic: 'زحل',      symbol: '♄', element: 'earth', color: '#9B7FD4', bast: 3886 },
];

// ── MIZAAN 7: Purposes ──
export const MIZAAN_PURPOSES = [
  { key: 'celb',    label: 'Celb',          arabic: 'الجلب',        desc: 'Attraction & drawing',   elements: ['fire'],         color: '#FF6B35', icon: '🧲' },
  { key: 'tard',    label: 'Tard',          arabic: 'الطرد',        desc: 'Repulsion & banishment', elements: ['earth'],        color: '#A5C880', icon: '🛡' },
  { key: 'sihhat',  label: 'Sıhhat',        arabic: 'الصحة',        desc: 'Health & restoration',   elements: ['air'],          color: '#B2EBF2', icon: '💚' },
  { key: 'sekam',   label: 'Sekam',         arabic: 'السقام',       desc: 'Spiritual remedy',       elements: ['water'],        color: '#4FC3F7', icon: '🌊' },
  { key: 'tarfet',  label: "Tarfetel Ayn",  arabic: 'طرفة العين',   desc: 'Instant manifestation',  elements: ['fire', 'air'],  color: '#D4AF37', icon: '👁' },
];

// ── MIZAAN 8: Day / Night (full) ──
export const MIZAAN_DAYNIGHT_FULL = {
  gunduz: {
    label: 'Gündüz',
    arabic: 'النهار',
    icon: '☀️',
    bast: 3886,
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
    bast: 3120,
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