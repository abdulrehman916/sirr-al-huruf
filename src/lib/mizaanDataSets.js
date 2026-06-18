// ═══════════════════════════════════════════════════════════════
// MIZAAN DATA SETS — Section 1 (A) and Section 2 (B)
// Same pipeline structure. Different source values.
// ═══════════════════════════════════════════════════════════════

import { MIZAAN_ELEMENTS, MIZAAN_BAST2 } from './mizaan9Engine.js';
import {
  MIZAAN_DAYNIGHT_FULL,
  MIZAAN_HOURS,
  MIZAAN_DAYS,
  MIZAAN_PLANETS_ALL,
  MIZAAN_PURPOSES,
  MIZAAN_ELEMENT_DEGREES,
} from './mizaan9Data.js';
import {
  MIZAAN_ELEMENTS_B,
  MIZAAN_BAST2_B,
  MIZAAN_DAYNIGHT_B,
  MIZAAN_HOURS_B,
  MIZAAN_DAYS_B,
  MIZAAN_PLANETS_B,
  MIZAAN_PURPOSES_B,
  KHAYR_SHARR8_B,
  MIZAAN_ELEMENT_DEGREES_B,
} from './mizaan9DataB.js';

// M8 Khayr/Sharr bast values for Section 1 (mirrors Mizaan8 local array)
const KHAYR_SHARR8_A = {
  khayr: { arabic: 'الخير', icon: '✨', bast: 2731, color: '#4ADE80' },
  sharr: { arabic: 'الشر',  icon: '⚡', bast: 2725, color: '#F87171' },
};

// ── Section 1 Dataset ──
export const DATASET_A = {
  elements:    MIZAAN_ELEMENTS,
  bast2:       MIZAAN_BAST2,
  dayNight:    MIZAAN_DAYNIGHT_FULL,
  hours:       MIZAAN_HOURS,
  days:        MIZAAN_DAYS,
  planets:     MIZAAN_PLANETS_ALL,
  purposes:    MIZAAN_PURPOSES,
  khayrSharr8: KHAYR_SHARR8_A,
  degrees:     MIZAAN_ELEMENT_DEGREES,
};

// ── Section 2 Dataset (placeholder — values filled from screenshots) ──
export const DATASET_B = {
  elements:    MIZAAN_ELEMENTS_B,
  bast2:       MIZAAN_BAST2_B,
  dayNight:    MIZAAN_DAYNIGHT_B,
  hours:       MIZAAN_HOURS_B,
  days:        MIZAAN_DAYS_B,
  planets:     MIZAAN_PLANETS_B,
  purposes:    MIZAAN_PURPOSES_B,
  khayrSharr8: KHAYR_SHARR8_B,
  degrees:     MIZAAN_ELEMENT_DEGREES_B,
};

export function getDataSet(section) {
  return section === 2 ? DATASET_B : DATASET_A;
}