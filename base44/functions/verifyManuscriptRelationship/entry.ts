import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Inline buildVefk logic (from mizaanPostEngine.js)
const VEFK_TEMPLATES = {
  fire: [
    [ 8, 11, 14,  1],
    [13,  2,  7, 12],
    [ 3, 16,  9,  6],
    [10,  5,  4, 15],
  ],
  earth: [
    [15,  4,  5, 10],
    [ 6,  9, 16,  3],
    [12,  7,  2, 13],
    [ 1, 14, 11,  8],
  ],
  air: [
    [ 1, 14, 11,  8],
    [12,  7,  2, 13],
    [ 6,  9, 16,  3],
    [15,  4,  5, 10],
  ],
  water: [
    [10,  5,  4, 15],
    [ 3, 16,  9,  6],
    [13,  2,  7, 12],
    [ 8, 11, 14,  1],
  ],
};

function buildVefk(S, element = 'fire') {
  const V = S - 30;
  const Q = Math.floor(V / 4);
  const R = V % 4;

  const template = VEFK_TEMPLATES[element] || VEFK_TEMPLATES.fire;

  const values = [];
  for (let i = 0; i < 16; i++) {
    values.push(Q + i);
  }

  if (R === 1) {
    values[12] += 1;
  } else if (R === 2) {
    values[8] += 1;
    values[12] += 1;
  } else if (R === 3) {
    values[4] += 1;
    values[8] += 1;
    values[12] += 1;
  }

  const grid = template.map(row => 
    row.map(pos => values[pos - 1])
  );

  const mc = grid[0].reduce((s, v) => s + v, 0);

  return { grid, mc, Q, R, V, S, element };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const manuscriptExamples = [
      {
        id: "page-316",
        description: "Page 316 Fire Example",
        source: 80,
        element: "fire",
        manuscriptMC: 80,
      },
      {
        id: "page-314",
        description: "Page 314 Fire Example",
        source: 1696,
        element: "fire",
        manuscriptMC: 1696,
      },
      {
        id: "page-62",
        description: "Page 62 Manuscript Authority",
        source: 12419,
        element: "fire",
        manuscriptMC: 12419,
      },
      {
        id: "allah-example",
        description: "Allah Example (Current)",
        source: 12645,
        element: "fire",
        manuscriptMC: null,
      },
    ];

    const results = [];

    manuscriptExamples.forEach((example) => {
      const S = example.source;
      const result = buildVefk(S, example.element);
      
      results.push({
        id: example.id,
        description: example.description,
        source: S,
        expandedLetterTotal: S,
        V: result.V,
        Q: result.Q,
        R: result.R,
        magicConstant: result.mc,
        mcMinusExpandedTotal: result.mc - S,
        mcMinusSource: result.mc - S,
        manuscriptMC: example.manuscriptMC,
        matchesManuscript: example.manuscriptMC !== null ? result.mc === example.manuscriptMC : null,
      });
    });

    const allMCEqualsSource = results.every(r => r.magicConstant === r.source);
    const allMCEqualsSourcePlusR = results.every(r => r.magicConstant === r.source + r.R);
    const allMatchManuscript = results.filter(r => r.manuscriptMC !== null).every(r => r.magicConstant === r.manuscriptMC);

    return Response.json({
      results,
      analysis: {
        allMCEqualsSource,
        allMCEqualsSourcePlusR,
        allMatchManuscript,
        relationship: allMCEqualsSourcePlusR ? "MC = Source + R" : allMCEqualsSource ? "MC = Source" : "No consistent pattern",
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});