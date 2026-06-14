// ═══════════════════════════════════════════════════
// ASTRO CLOCK DATA
// Completely independent module. No shared logic.
// Future PDF-based data will be added here.
// ═══════════════════════════════════════════════════

/**
 * ASTRO CLOCK DATA - EMPTY FRAMEWORK
 * 
 * This data module is reserved for future astrological data
 * based on PDF manuscript sources.
 * 
 * Currently: Empty structure ready for implementation
 * 
 * Future implementations will include:
 * - Planetary correspondences
 * - Hour rulership tables
 * - Day rulership tables
 * - Astrological metadata
 * - Timing recommendations
 * 
 * All data will be sourced from PDF manuscripts.
 */

// ── Placeholder planetary data ─────────────────────────
export const PLANETS = Object.freeze([]);
// Future structure:
// [
//   { key: 'saturn', name: 'Saturn', arabic: 'زحل', symbol: '♄', ... },
//   { key: 'jupiter', name: 'Jupiter', arabic: 'المشتري', symbol: '♃', ... },
//   ...
// ]

// ── Placeholder day rulerships ─────────────────────────
export const DAY_RULERSHIPS = Object.freeze({});
// Future structure:
// {
//   saturday: 'saturn',
//   sunday: 'sun',
//   monday: 'moon',
//   ...
// }

// ── Placeholder hour rulerships ────────────────────────
export const HOUR_RULERSHIPS = Object.freeze({});
// Future structure will be added from PDF sources

// ── Placeholder astrological metadata ──────────────────
export const ASTRO_METADATA = Object.freeze({
  version: '0.0.1',
  status: 'FRAMEWORK_READY',
  dataLoaded: false,
  pdfSourcesIngested: false,
  note: 'Empty data structure ready for PDF-based implementation',
});

// ── Placeholder categories ─────────────────────────────
export const ASTRO_CATEGORIES = Object.freeze([]);
// Future structure for categorizing astrological timings