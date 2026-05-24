// Letter to element classification
export const ELEMENTS = {
  fire: {
    name: "Fire",
    arabic: "النار",
    letters: ['ا', 'ه', 'ط', 'م', 'ف', 'ش', 'ذ'],
    color: "#FF8C42",
    arabicColor: "#ffffff",
    numberColor: "#FFD0B0",
    glow: "rgba(247,92,60,0.20)",
    bg: "linear-gradient(135deg, rgba(247,92,60,0.10), rgba(255,179,71,0.07))",
    dominantBg: "linear-gradient(135deg, #F75C3C 0%, #FF8C42 55%, #FFB347 100%)",
    dominantShadow: "0 6px 18px rgba(247,92,60,0.28), 0 2px 6px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.12)",
    dominantBorder: "1px solid rgba(255,255,255,0.22)",
    dominantBadge: { background: "linear-gradient(135deg, #F75C3C, #FF8C42)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", borderColor: "rgba(255,255,255,0.2)" },
    border: "rgba(255,140,66,0.35)",
    icon: "🔥",
  },
  water: {
    name: "Water",
    arabic: "الماء",
    letters: ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'ض'],
    color: "#4FC3F7",
    arabicColor: "#ffffff",
    numberColor: "#B3E5FC",
    glow: "rgba(60,166,247,0.20)",
    bg: "linear-gradient(135deg, rgba(60,166,247,0.10), rgba(129,212,250,0.07))",
    dominantBg: "linear-gradient(135deg, #3CA6F7 0%, #4FC3F7 55%, #81D4FA 100%)",
    dominantShadow: "0 6px 18px rgba(60,166,247,0.28), 0 2px 6px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.12)",
    dominantBorder: "1px solid rgba(255,255,255,0.22)",
    dominantBadge: { background: "linear-gradient(135deg, #3CA6F7, #4FC3F7)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", borderColor: "rgba(255,255,255,0.2)" },
    border: "rgba(79,195,247,0.35)",
    icon: "💧",
  },
  air: {
    name: "Air",
    arabic: "الهواء",
    letters: ['ج', 'ز', 'ك', 'س', 'ق', 'ت', 'ظ'],
    color: "#90A4AE",
    arabicColor: "#263238",
    numberColor: "#455A64",
    glow: "rgba(0,0,0,0.10)",
    bg: "linear-gradient(135deg, rgba(176,190,197,0.10), rgba(236,239,241,0.07))",
    dominantBg: "linear-gradient(135deg, #B0BEC5 0%, #CFD8DC 55%, #ECEFF1 100%)",
    dominantShadow: "0 6px 18px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.10), inset 0 1px 2px rgba(255,255,255,0.18)",
    dominantBorder: "1px solid rgba(255,255,255,0.30)",
    dominantBadge: { background: "linear-gradient(135deg, #B0BEC5, #CFD8DC)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", borderColor: "rgba(255,255,255,0.2)" },
    border: "rgba(144,164,174,0.35)",
    icon: "💨",
  },
  earth: {
    name: "Earth",
    arabic: "الأرض",
    letters: ['ب', 'و', 'ي', 'ن', 'ص', 'ث', 'غ'],
    color: "#7CB342",
    arabicColor: "#ffffff",
    numberColor: "#DCEDC8",
    glow: "rgba(93,138,74,0.20)",
    bg: "linear-gradient(135deg, rgba(93,138,74,0.10), rgba(165,214,167,0.07))",
    dominantBg: "linear-gradient(135deg, #5D8A4A 0%, #7CB342 55%, #A5D6A7 100%)",
    dominantShadow: "0 6px 18px rgba(93,138,74,0.28), 0 2px 6px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.12)",
    dominantBorder: "1px solid rgba(255,255,255,0.22)",
    dominantBadge: { background: "linear-gradient(135deg, #5D8A4A, #7CB342)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", borderColor: "rgba(255,255,255,0.2)" },
    border: "rgba(124,179,66,0.35)",
    icon: "🌍",
  },
};

// ════════════════════════════════════════════════
// MERTEBE HIERARCHY — 7 ranks per element
// Order: Mertebe → Derece → Dakika → Saniye → Salise → Rabia → Hamise
// ════════════════════════════════════════════════
export const RANK_NAMES = ['Mertebe', 'Derece', 'Dakika', 'Saniye', 'Salise', 'Rabia', 'Hamise'];

// Each element's letters are already listed in rank order (index 0 = highest rank)
// fire:  ا ه ط م ف ش ذ
// water: د ح ل ع ر خ ض
// air:   ج ز ك س ق ت ظ
// earth: ب و ي ن ص ث غ

// Normalize common Arabic letter variants
const NORMALIZE_MAP = {
  'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا',
  'ى': 'ي', 'ئ': 'ي',
  'ؤ': 'و',
  'ة': 'ه',
};

function normalize(char) {
  return NORMALIZE_MAP[char] || char;
}

// Build reverse lookup: letter → element key
const LETTER_TO_ELEMENT = {};
for (const [key, el] of Object.entries(ELEMENTS)) {
  for (const letter of el.letters) {
    LETTER_TO_ELEMENT[letter] = key;
  }
}

// Build letter → rank index lookup: { letter: { elementKey, rankIndex } }
const LETTER_RANK = {};
for (const [key, el] of Object.entries(ELEMENTS)) {
  el.letters.forEach((letter, idx) => {
    LETTER_RANK[letter] = { elementKey: key, rankIndex: idx };
  });
}

/**
 * When two or more elements share the same count, resolve dominance using
 * the book's internal rank hierarchy (Mertebe → Derece → Dakika → … → Hamise).
 *
 * For each tied element we find the HIGHEST-ranked letter it contributed
 * (lowest rankIndex = highest rank).  The element whose best letter has the
 * smallest rankIndex wins.  If still tied at every rank, the first tied element
 * is returned (no further tiebreak defined by the book).
 *
 * Returns: { winner: elementKey, resolvedByRank: rankIndex, rankName: string }
 *          or null if the letter set has no ranked letters at all.
 */
function resolveTieByRank(tiedKeys, letterDetails) {
  // For each tied element, collect the minimum rankIndex among its contributed letters
  const bestRank = {};
  for (const key of tiedKeys) {
    bestRank[key] = Infinity;
  }

  for (const { original, element } of letterDetails) {
    if (!tiedKeys.includes(element)) continue;
    const norm = NORMALIZE_MAP[original] || original;
    const rankInfo = LETTER_RANK[norm];
    if (rankInfo && rankInfo.elementKey === element) {
      if (rankInfo.rankIndex < bestRank[element]) {
        bestRank[element] = rankInfo.rankIndex;
      }
    }
  }

  // Sort tied keys by their best rank (ascending = higher rank wins)
  const sorted = [...tiedKeys].sort((a, b) => bestRank[a] - bestRank[b]);
  const winner = sorted[0];
  const resolvedByRank = bestRank[winner];

  if (resolvedByRank === Infinity) return null; // no ranked letters found

  return {
    winner,
    resolvedByRank,
    rankName: RANK_NAMES[resolvedByRank] ?? `Rank ${resolvedByRank + 1}`,
  };
}

export function analyzeText(text) {
  const counts = { fire: 0, air: 0, water: 0, earth: 0 };
  const letterDetails = [];

  for (const char of text) {
    const norm = normalize(char);
    const element = LETTER_TO_ELEMENT[norm];
    if (element) {
      counts[element]++;
      letterDetails.push({ original: char, element });
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages = {};
  for (const key of Object.keys(counts)) {
    percentages[key] = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
  }

  if (total === 0) {
    return { counts, percentages, total, dominant: null, letterDetails, tiebreak: null };
  }

  const maxCount = Math.max(...Object.values(counts));
  const topKeys = Object.entries(counts)
    .filter(([, v]) => v === maxCount)
    .map(([k]) => k);

  let dominant;
  let tiebreak = null;

  if (topKeys.length === 1) {
    // Clear winner — no tiebreak needed
    dominant = topKeys[0];
  } else {
    // Equal totals — resolve via rank hierarchy
    const resolution = resolveTieByRank(topKeys, letterDetails);
    if (resolution) {
      dominant = resolution.winner;
      tiebreak = {
        tiedElements: topKeys,
        resolvedByRank: resolution.resolvedByRank,
        rankName: resolution.rankName,
      };
    } else {
      // Fallback: first in element order
      dominant = topKeys[0];
      tiebreak = { tiedElements: topKeys, resolvedByRank: null, rankName: null };
    }
  }

  return { counts, percentages, total, dominant, letterDetails, tiebreak };
}