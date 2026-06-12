import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { Calculator, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const G = {
  gold: "#F5D060",
  goldDim: "rgba(245,208,96,0.55)",
  goldFaint: "rgba(245,208,96,0.12)",
  goldBorder: "rgba(212,175,55,0.40)",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  bgCard: "rgba(8,16,40,0.98)",
  bgInner: "rgba(212,175,55,0.06)",
  dim: "rgba(255,255,255,0.35)",
};

// Manuscript examples from pages 314-316
const MANUSCRIPT_EXAMPLES = [
  {
    id: "A",
    page: 314,
    sourceNumber: 1696,
    grid: [
      [423, 426, 430, 416],
      [429, 417, 422, 427],
      [418, 432, 424, 421],
      [425, 420, 419, 431],
    ],
  },
  {
    id: "B",
    page: 316,
    sourceNumber: 80,
    grid: [
      [19, 23, 26, 12],
      [25, 13, 18, 24],
      [14, 28, 21, 17],
      [22, 16, 15, 27],
    ],
  },
];

// MODEL A: Single Cell Correction
// Add +1 only to the specified cell, all others unchanged
function buildVefkModelA(S) {
  const V = S - 30;
  const Q = Math.floor(V / 4);
  const R = V % 4;

  // Base template (standard positions 1-16)
  const template = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];

  // Build base grid: Q + (position - 1)
  const grid = template.map(row =>
    row.map(pos => Q + (pos - 1))
  );

  // Apply remainder correction to SINGLE CELL only
  if (R === 1) {
    grid[3][0] += 1; // Cell 13 (0-indexed: row 3, col 0)
  } else if (R === 2) {
    grid[2][0] += 1; // Cell 9
    grid[3][0] += 1; // Cell 13
  } else if (R === 3) {
    grid[1][0] += 1; // Cell 5
    grid[2][0] += 1; // Cell 9
    grid[3][0] += 1; // Cell 13
  }

  return { grid, Q, R, V, model: "A" };
}

// MODEL B: Sequential Continuation Correction
// Add +1 to specified cell, then continue sequential numbering from corrected value
function buildVefkModelB(S) {
  const V = S - 30;
  const Q = Math.floor(V / 4);
  const R = V % 4;

  // Build grid sequentially, cell by cell (reading order)
  const grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let currentValue = Q;
  let cellNumber = 1;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      // Check if this cell needs correction
      let needsCorrection = false;
      if (R === 1 && cellNumber === 13) needsCorrection = true;
      else if (R === 2 && (cellNumber === 9 || cellNumber === 13)) needsCorrection = true;
      else if (R === 3 && (cellNumber === 5 || cellNumber === 9 || cellNumber === 13)) needsCorrection = true;

      // Apply correction if needed
      if (needsCorrection) {
        currentValue += 1;
      }

      grid[row][col] = currentValue;
      currentValue += 1; // Always increment for next cell
      cellNumber += 1;
    }
  }

  return { grid, Q, R, V, model: "B" };
}

function verifyMagicSquare(grid, label) {
  const rowSums = grid.map(row => row.reduce((a, b) => a + b, 0));
  const colSums = grid[0].map((_, j) => grid.reduce((sum, row) => sum + row[j], 0));
  const diag1 = grid.reduce((sum, row, i) => sum + row[i], 0);
  const diag2 = grid.reduce((sum, row, i) => sum + row[3 - i], 0);
  const totalSum = grid.flat().reduce((a, b) => a + b, 0);

  const allRowSumsEqual = rowSums.every(s => s === rowSums[0]);
  const allColSumsEqual = colSums.every(s => s === colSums[0]);
  const diagonalsEqual = diag1 === diag2;
  const allEqual = allRowSumsEqual && allColSumsEqual && diagonalsEqual && rowSums[0] === colSums[0] && rowSums[0] === diag1;

  return {
    rowSums,
    colSums,
    diag1,
    diag2,
    totalSum,
    magicConstant: rowSums[0],
    isValidMagicSquare: allEqual,
    label,
  };
}

function compareGrids(modelGrid, manuscriptGrid) {
  const flatModel = modelGrid.flat();
  const flatManuscript = manuscriptGrid.flat();
  const mismatches = [];

  for (let i = 0; i < 16; i++) {
    const modelVal = flatModel[i];
    const manuscriptVal = flatManuscript[i];
    if (modelVal !== manuscriptVal) {
      mismatches.push({
        cell: i + 1,
        row: Math.floor(i / 4),
        col: i % 4,
        modelValue: modelVal,
        manuscriptValue: manuscriptVal,
        difference: modelVal - manuscriptVal,
      });
    }
  }

  return {
    isExactMatch: mismatches.length === 0,
    mismatchCount: mismatches.length,
    mismatches,
  };
}

function Card({ children, title, icon: Icon, accent }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: G.bgCard,
        borderColor: accent || G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b" style={{ borderColor: G.goldBorder + "40" }}>
          {Icon && <Icon className="w-5 h-5" style={{ color: accent || G.gold }} />}
          <span className="font-inter text-sm font-bold" style={{ color: accent || G.gold }}>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}

function GridDisplay({ grid, highlightCells = [], title }) {
  return (
    <div>
      {title && (
        <div className="text-[8px] uppercase tracking-wider font-bold mb-2 text-center" style={{ color: G.goldDim }}>
          {title}
        </div>
      )}
      <div className="grid grid-cols-4 gap-1 max-w-[200px] mx-auto">
        {grid.flat().map((val, idx) => {
          const isHighlighted = highlightCells.includes(idx + 1);
          return (
            <div
              key={idx}
              className="aspect-square flex items-center justify-center rounded border font-inter text-sm font-bold"
              style={{
                background: isHighlighted ? G.gold + "33" : G.bgInner,
                borderColor: isHighlighted ? G.gold : G.goldBorder + "60",
                color: isHighlighted ? G.gold : G.goldDim,
              }}
            >
              {val.toLocaleString()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VerificationReport({ modelResult, manuscript, exampleId }) {
  const comparison = compareGrids(modelResult.grid, manuscript.grid);
  const verification = verifyMagicSquare(modelResult.grid, `Model ${modelResult.model}`);

  return (
    <div className="space-y-4">
      {/* Grid Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <GridDisplay grid={modelResult.grid} title={`Model ${modelResult.model} Output`} />
        <GridDisplay 
          grid={manuscript.grid} 
          highlightCells={comparison.mismatches.map(m => m.cell)}
          title="Manuscript Grid" 
        />
      </div>

      {/* Match Status */}
      <div className={`text-center p-3 rounded-lg border ${
        comparison.isExactMatch 
          ? "bg-green-500/10 border-green-500/40" 
          : "bg-red-500/10 border-red-500/40"
      }`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          {comparison.isExactMatch ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className={`font-inter text-sm font-bold ${
            comparison.isExactMatch ? "text-green-500" : "text-red-500"
          }`}>
            {comparison.isExactMatch ? "EXACT MATCH" : `${comparison.mismatchCount} CELL MISMATCHES`}
          </span>
        </div>
        {!comparison.isExactMatch && (
          <div className="text-[7px]" style={{ color: G.dim }}>
            Cells: {comparison.mismatches.map(m => m.cell).join(", ")}
          </div>
        )}
      </div>

      {/* Magic Square Verification */}
      <div className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder + "40" }}>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-4 h-4" style={{ color: G.goldDim }} />
          <span className="font-inter text-xs font-bold" style={{ color: G.goldDim }}>
            Magic Square Verification
          </span>
        </div>
        <div className={`text-center text-[8px] font-bold p-2 rounded ${
          verification.isValidMagicSquare ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        }`}>
          {verification.isValidMagicSquare ? "✓ Valid Magic Square" : "✗ Not a Valid Magic Square"}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[7px]">
          <div>
            <span style={{ color: G.dim }}>Row Sums:</span>{" "}
            <span className="font-mono" style={{ color: G.gold}}>
              {verification.rowSums.join(", ")}
            </span>
          </div>
          <div>
            <span style={{ color: G.dim }}>Col Sums:</span>{" "}
            <span className="font-mono" style={{ color: G.gold}}>
              {verification.colSums.join(", ")}
            </span>
          </div>
          <div>
            <span style={{ color: G.dim }}>Diagonal 1:</span>{" "}
            <span className="font-mono" style={{ color: G.gold}}>
              {verification.diag1.toLocaleString()}
            </span>
          </div>
          <div>
            <span style={{ color: G.dim }}>Diagonal 2:</span>{" "}
            <span className="font-mono" style={{ color: G.gold}}>
              {verification.diag2.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Mismatches */}
      {!comparison.isExactMatch && (
        <div className="p-3 rounded-lg border" style={{ borderColor: G.red + "40" }}>
          <div className="text-[8px] uppercase tracking-wider font-bold mb-2" style={{ color: G.red }}>
            Cell-by-Cell Mismatches
          </div>
          <div className="space-y-1">
            {comparison.mismatches.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center text-[7px] py-1 border-b" style={{ borderColor: G.goldBorder + "30" }}>
                <span style={{ color: G.dim }}>
                  Cell {m.cell} (R{m.row + 1}, C{m.col + 1})
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono" style={{ color: G.goldDim }}>
                    Model: {m.modelValue}
                  </span>
                  <span className="font-mono" style={{ color: G.gold }}>
                    Manuscript: {m.manuscriptValue}
                  </span>
                  <span className={`font-mono font-bold ${m.difference > 0 ? "text-red-500" : "text-blue-500"}`}>
                    {m.difference > 0 ? "+" : ""}{m.difference}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MizanVefkModelVerification() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <PageTitle
          arabic="التحقق من النموذج"
          latin="Vefk Model Verification"
          subtitle="Manuscript Model A vs Model B — Cell-by-Cell Analysis"
          icon="🔬"
        />

        {/* Model Definitions */}
        <Card title="Two Competing Models" icon={AlertCircle}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border" style={{ borderColor: G.blue + "40", background: G.blue + "11" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs" style={{ background: G.blue, color: "#fff" }}>A</div>
                <span className="font-inter text-sm font-bold" style={{ color: G.blue }}>Single Cell Correction</span>
              </div>
              <div className="text-[7px] space-y-1" style={{ color: G.dim }}>
                <div>• Add +1 <strong>only</strong> to the specified cell</div>
                <div>• All other cells remain unchanged</div>
                <div>• Example: R=1 → Cell 13 gets +1, Cells 14-16 unchanged</div>
              </div>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: G.green + "40", background: G.green + "11" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs" style={{ background: G.green, color: "#fff" }}>B</div>
                <span className="font-inter text-sm font-bold" style={{ color: G.green }}>Sequential Continuation</span>
              </div>
              <div className="text-[7px] space-y-1" style={{ color: G.dim }}>
                <div>• Add +1 to specified cell</div>
                <div>• Continue sequential numbering from corrected value</div>
                <div>• Example: R=1 → Cell 13=51, Cell 14=52, Cell 15=53, Cell 16=54</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Test Results for Each Example */}
        {MANUSCRIPT_EXAMPLES.map((example) => {
          const modelA = buildVefkModelA(example.sourceNumber);
          const modelB = buildVefkModelB(example.sourceNumber);

          return (
            <Card key={example.id} title={`Page ${example.page} — Example ${example.id} (Source: ${example.sourceNumber.toLocaleString()})`} icon={FileText}>
              
              {/* Construction Parameters */}
              <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: G.goldBorder + "40" }}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-[7px]" style={{ color: G.dim }}>V = S - 30</div>
                    <div className="font-inter text-lg font-bold" style={{ color: G.gold }}>{modelA.V.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[7px]" style={{ color: G.dim }}>Q = ⌊V/4⌋</div>
                    <div className="font-inter text-lg font-bold" style={{ color: G.gold }}>{modelA.Q.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[7px]" style={{ color: G.dim }}>R = V % 4</div>
                    <div className="font-inter text-lg font-bold" style={{ color: modelA.R > 0 ? G.red : G.green }}>{modelA.R}</div>
                  </div>
                </div>
                {modelA.R > 0 && (
                  <div className="mt-2 text-center text-[7px]" style={{ color: G.dim }}>
                    Remainder correction needed at cell(s):{" "}
                    <span className="font-bold" style={{ color: G.gold }}>
                      {modelA.R === 1 ? "13" : modelA.R === 2 ? "9, 13" : "5, 9, 13"}
                    </span>
                  </div>
                )}
              </div>

              {/* Model Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                <VerificationReport modelResult={modelA} manuscript={example} exampleId={example.id} />
                <VerificationReport modelResult={modelB} manuscript={example} exampleId={example.id} />
              </div>
            </Card>
          );
        })}

        {/* Final Summary */}
        <Card title="Mathematical Proof Summary" icon={Calculator}>
          <div className="space-y-3">
            {MANUSCRIPT_EXAMPLES.map((example) => {
              const modelA = buildVefkModelA(example.sourceNumber);
              const modelB = buildVefkModelB(example.sourceNumber);
              const comparisonA = compareGrids(modelA.grid, example.grid);
              const comparisonB = compareGrids(modelB.grid, example.grid);

              return (
                <div key={example.id} className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder + "40" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-inter text-sm font-bold" style={{ color: G.gold }}>
                      Page {example.page} — Example {example.id}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className={`text-[8px] font-bold px-2 py-1 rounded ${
                        comparisonA.isExactMatch ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}>
                        Model A: {comparisonA.isExactMatch ? "✓ MATCH" : "✗ MISMATCH"}
                      </div>
                      <div className={`text-[8px] font-bold px-2 py-1 rounded ${
                        comparisonB.isExactMatch ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}>
                        Model B: {comparisonB.isExactMatch ? "✓ MATCH" : "✗ MISMATCH"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-4 rounded-xl border" style={{ borderColor: G.goldBorder, background: G.bgInner }}>
              <div className="text-[8px] uppercase tracking-wider font-bold mb-2" style={{ color: G.goldDim }}>
                CRITICAL QUESTION
              </div>
              <div className="text-[7px]" style={{ color: G.dim }}>
                Does the manuscript Arabic text on pages 313-316 explicitly state whether the correction is applied to a single cell only, or whether sequential numbering continues from the corrected value? The mathematical proof above will determine which model matches the historical examples exactly.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}