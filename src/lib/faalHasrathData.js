// ═══════════════════════════════════════════════════════════════
// FAAL HASRATH — Independent Data
// Used ONLY by FaalHasrathPage. Zero shared logic with any module.
// 16 heart symbols from the manuscript "Faal Nama Hasrath Ali (O)"
// Positions preserved exactly as shown in the reference image.
// Grid is right-to-left: cell 1 = top-right, cell 4 = top-left, etc.
// ═══════════════════════════════════════════════════════════════

// Each cell's innerMark describes what is drawn inside the heart in the manuscript.
// innerMark codes used by the SVG renderer in FaalHasrathPage:
//   "dot"         — single central dot
//   "two-dots"    — two dots side by side
//   "three-dots"  — triangle of three dots
//   "cross"       — plus/cross
//   "x-cross"     — diagonal X
//   "line-h"      — horizontal line
//   "line-v"      — vertical line
//   "line-diag"   — diagonal line
//   "arc-up"      — arc opening upward (smile)
//   "arc-down"    — arc opening downward (frown)
//   "eye"         — eye shape
//   "circle"      — small open circle
//   "double-arc"  — two arcs (waves)
//   "spiral"      — small spiral
//   "star3"       — 3-point star / asterisk
//   "zigzag"      — small zigzag line

export const FAAL_CELLS = [
  {
    id: 1,
    innerMark: "dot",
    arabic: "الفأل الأول",
    title: "Faal One — The First Sign",
    description: "The opening heart with a single mark — the simplest sign, yet carrying the fullest blessing. It is the seal of new beginnings.",
    interpretation: "A journey, a new endeavor, or a fresh beginning is strongly favored. The way ahead is open with divine grace.",
    advice: "Begin immediately. Hesitation will cost you. The first step taken with faith is already protected.",
  },
  {
    id: 2,
    innerMark: "two-dots",
    arabic: "الفأل الثاني",
    title: "Faal Two — Duality",
    description: "Two marks within the heart speak of partnership, balance, and the meeting of two forces or two people.",
    interpretation: "A matter involving two people, two choices, or a partnership is central to your situation.",
    advice: "Seek harmony between the two sides. Do not force one to dominate the other — balance is the key.",
  },
  {
    id: 3,
    innerMark: "arc-up",
    arabic: "الفأل الثالث",
    title: "Faal Three — The Rising Arc",
    description: "An arc rising upward within the heart — a symbol of ascent, hope, and matters elevating toward resolution.",
    interpretation: "Your situation is on the rise. What has been low or difficult is beginning to lift and improve.",
    advice: "Maintain your upward momentum. Do not look down at where you were — keep your eyes on where you are going.",
  },
  {
    id: 4,
    innerMark: "three-dots",
    arabic: "الفأل الرابع",
    title: "Faal Four — The Three Witnesses",
    description: "Three dots form a triangle within the heart — body, soul, and spirit aligned as one unified witness.",
    interpretation: "A matter of travel, news from afar, or the involvement of a third party brings clarity to your situation.",
    advice: "Seek counsel from a trusted third person. The answer you need exists outside your current circle.",
  },
  {
    id: 5,
    innerMark: "line-h",
    arabic: "الفأل الخامس",
    title: "Faal Five — The Horizon",
    description: "A horizontal line divides the heart — the horizon between what is visible and what lies beyond sight.",
    interpretation: "A period of waiting and patience is indicated. The answer exists but has not yet crossed into your visible world.",
    advice: "Wait with active patience. Prepare for what is coming rather than chasing what is not yet here.",
  },
  {
    id: 6,
    innerMark: "eye",
    arabic: "الفأل السادس",
    title: "Faal Six — The Watchful Eye",
    description: "An eye rests at the center of the heart — the divine witness that sees all hidden matters and intentions.",
    interpretation: "You are being watched over with care. Hidden protection surrounds your situation. Sincerity matters greatly now.",
    advice: "Act as though every deed is seen and recorded — because it is. Your true intentions will determine the outcome.",
  },
  {
    id: 7,
    innerMark: "x-cross",
    arabic: "الفأل السابع",
    title: "Faal Seven — The Crossroads",
    description: "Two diagonal lines cross within the heart — a sign of obstacle, intersection, or a matter requiring resolution.",
    interpretation: "A blockage or delay is present. Two forces or desires are crossing each other and creating friction.",
    advice: "Identify the source of the conflict and address it directly. Avoidance only deepens the crossing.",
  },
  {
    id: 8,
    innerMark: "line-v",
    arabic: "الفأل الثامن",
    title: "Faal Eight — The Pillar",
    description: "A single vertical line stands firm at the center of the heart — the pillar of steadfastness and will.",
    interpretation: "Strength, determination, and individual will are the deciding forces in your situation. Stand firm.",
    advice: "Be the pillar. Do not bend to pressure or persuasion that conflicts with your truth. Firmness is your protection.",
  },
  {
    id: 9,
    innerMark: "circle",
    arabic: "الفأل التاسع",
    title: "Faal Nine — The Circle",
    description: "A small open circle at the heart's center — the eternal loop of return, wholeness, and completion.",
    interpretation: "What was sent out is returning. A cycle is completing. What you gave will come back to you.",
    advice: "Prepare to receive. The circle closes in your favor — but only for those who remained consistent.",
  },
  {
    id: 10,
    innerMark: "arc-down",
    arabic: "الفأل العاشر",
    title: "Faal Ten — The Descent",
    description: "An arc falling downward within the heart — indicating the need for humility, descent, or a return to roots.",
    interpretation: "Pride or overreaching may be causing stagnation. A willingness to lower yourself will open the way.",
    advice: "Humble yourself before the situation. What you seek will come to you when you stop demanding it.",
  },
  {
    id: 11,
    innerMark: "cross",
    arabic: "الفأل الحادي عشر",
    title: "Faal Eleven — The Four Directions",
    description: "A perfect cross at the center of the heart — the meeting of all four directions and the stillness at the center.",
    interpretation: "You are at the center of several converging forces. A major decision point has arrived.",
    advice: "Be still before you choose. The one who is centered when all directions pull is the one who chooses wisely.",
  },
  {
    id: 12,
    innerMark: "spiral",
    arabic: "الفأل الثاني عشر",
    title: "Faal Twelve — The Spiral",
    description: "A spiral unfurling within the heart — the symbol of deep inner movement and transforming from within.",
    interpretation: "An inward process of growth or transformation is occurring beneath the surface of visible events.",
    advice: "Trust the unseen work happening within you. Do not measure your progress by what is visible yet.",
  },
  {
    id: 13,
    innerMark: "double-arc",
    arabic: "الفأل الثالث عشر",
    title: "Faal Thirteen — The Two Waves",
    description: "Two arcs stacked within the heart — waves of emotion or events arriving in succession, one after another.",
    interpretation: "Two events or emotions are coming in sequence. The second wave brings the true resolution.",
    advice: "Endure the first wave — it is not the final answer. Hold firm and the second movement will bring relief.",
  },
  {
    id: 14,
    innerMark: "star3",
    arabic: "الفأل الرابع عشر",
    title: "Faal Fourteen — The Three-Point Star",
    description: "A three-pointed star blazes within the heart — a sign of elevated spiritual blessing and divine intervention.",
    interpretation: "A blessing from above is specifically directed toward your matter. Spiritual forces are actively involved.",
    advice: "Recite your prayers and expressions of gratitude. The door of divine help is open — enter through supplication.",
  },
  {
    id: 15,
    innerMark: "zigzag",
    arabic: "الفأل الخامس عشر",
    title: "Faal Fifteen — The Zigzag Path",
    description: "A zigzag line within the heart — the path that moves back and forth before reaching its destination.",
    interpretation: "The road to your goal is not straight. Twists and unexpected turns are part of the journey, not obstacles.",
    advice: "Accept the indirect route. Each turn on the zigzag path is teaching you something essential for your arrival.",
  },
  {
    id: 16,
    innerMark: "line-diag",
    arabic: "الفأل السادس عشر",
    title: "Faal Sixteen — The Diagonal",
    description: "A diagonal line cuts across the heart — bridging two separate realms, connecting what was apart.",
    interpretation: "A connection, reconciliation, or bridge is forming between two separated things — people, situations, or desires.",
    advice: "Be the bridge. The one who connects rather than divides will receive the blessing of both sides.",
  },
];