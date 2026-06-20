// ═══════════════════════════════════════════════════════════════
//  ELEMENT TRANSFORMATION AUDIT
//  Tests whether element changes affect numbers or just positions
// ═══════════════════════════════════════════════════════════════

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.32';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Test with a 5x5 square (odd order, simple to verify)
    const n = 5;
    const usurper = 1;
    
    // Generate base square
    const fireSquare = generateSquare(n, usurper, 'fire');
    const airSquare = generateSquare(n, usurper, 'air');
    const waterSquare = generateSquare(n, usurper, 'water');
    const earthSquare = generateSquare(n, usurper, 'earth');
    
    // Extract all values
    const fireValues = fireSquare.flat().sort((a,b) => a - b);
    const airValues = airSquare.flat().sort((a,b) => a - b);
    const waterValues = waterSquare.flat().sort((a,b) => a - b);
    const earthValues = earthSquare.flat().sort((a,b) => a - b);
    
    // Check if values are identical
    const valuesIdentical = (arr1, arr2) => arr1.every((v, i) => v === arr2[i]);
    
    // Check positions
    const positionsIdentical = (sq1, sq2) => 
      sq1.every((row, i) => row.every((val, j) => val === sq2[i][j]));
    
    // Calculate magic constants
    const mc = (sq) => sq[0].reduce((s,v) => s + v, 0);
    
    // Verify sums
    const verifySums = (sq) => {
      const n = sq.length;
      const magicConst = mc(sq);
      const rows = sq.map(row => row.reduce((s,v) => s + v, 0));
      const cols = Array.from({length: n}, (_, j) => sq.reduce((s, row) => s + row[j], 0));
      const d1 = sq.reduce((s, row, i) => s + row[i], 0);
      const d2 = sq.reduce((s, row, i) => s + row[n-1-i], 0);
      return {
        magic_const: magicConst,
        all_rows: rows.every(s => s === magicConst),
        all_cols: cols.every(s => s === magicConst),
        diag1: d1 === magicConst,
        diag2: d2 === magicConst
      };
    };
    
    return Response.json({
      status: 'success',
      test_parameters: {
        size: `${n}×${n}`,
        usurper,
        expected_magic_constant: n * (n * n + 1) / 2
      },
      value_analysis: {
        fire_values: fireValues,
        air_values_match_fire: valuesIdentical(fireValues, airValues),
        water_values_match_fire: valuesIdentical(fireValues, waterValues),
        earth_values_match_fire: valuesIdentical(fireValues, earthValues),
        conclusion: 'All elements use IDENTICAL number sets'
      },
      position_analysis: {
        air_positions_match_fire: positionsIdentical(fireSquare, airSquare),
        water_positions_match_fire: positionsIdentical(fireSquare, waterSquare),
        earth_positions_match_fire: positionsIdentical(fireSquare, earthSquare),
        conclusion: 'Elements change POSITIONS only'
      },
      magic_constant_analysis: {
        fire_mc: mc(fireSquare),
        air_mc: mc(airSquare),
        water_mc: mc(waterSquare),
        earth_mc: mc(earthSquare),
        all_identical: mc(fireSquare) === mc(airSquare) && 
                       mc(fireSquare) === mc(waterSquare) && 
                       mc(fireSquare) === mc(earthSquare),
        conclusion: 'Magic constant remains IDENTICAL across all elements'
      },
      sum_verification: {
        fire: verifySums(fireSquare),
        air: verifySums(airSquare),
        water: verifySums(waterSquare),
        earth: verifySums(earthSquare),
        conclusion: 'All row/column/diagonal sums remain IDENTICAL'
      },
      sample_squares: {
        fire: fireSquare,
        air: airSquare,
        water: waterSquare,
        earth: earthSquare
      },
      transformation_rules: {
        fire: 'Original (no transformation)',
        air: 'Left-Right mirror (reverse each row)',
        water: '180° rotation (reverse rows + reverse each row)',
        earth: 'Top-Bottom mirror (reverse order of rows)'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});

// ════════════════════════════════════════════════════════════════
//  SQUARE GENERATION (from msEngine.js)
// ════════════════════════════════════════════════════════════════

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

function doublyEvenStd(n) {
  const g = Array.from({length:n}, () => Array(n).fill(0));
  for (let i=0;i<n;i++) for (let j=0;j<n;j++) g[i][j] = i*n+j+1;
  for (let i=0;i<n;i++) for (let j=0;j<n;j++) {
    const bi=i%4, bj=j%4;
    if (bi===bj || bi+bj===3) g[i][j] = n*n+1-g[i][j];
  }
  return g;
}

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
    g[i][j+h]     = base[i][j] + 2*h*h;
    g[i+h][j]     = base[i][j] + 3*h*h;
    g[i+h][j+h]   = base[i][j] + h*h;
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

function buildMagicSquare(n, usurper) {
  return buildBaseSquare(n).map(row => row.map(v => v - 1 + usurper));
}

function elementTransform(g, key) {
  const clone = () => g.map(row=>[...row]);
  if (key==="fire")  return clone();
  if (key==="air")   return clone().map(row=>[...row].reverse());
  if (key==="earth") return [...clone()].reverse();
  if (key==="water") return [...clone()].reverse().map(row=>[...row].reverse());
  return clone();
}

function generateSquare(n, usurper, elementKey) {
  return elementTransform(buildMagicSquare(n, usurper), elementKey);
}