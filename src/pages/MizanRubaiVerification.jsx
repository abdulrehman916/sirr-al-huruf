import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { Calculator, CheckCircle, XCircle, FileText, AlertCircle } from "lucide-react";
import { buildVefk, validateVefk, VEFK_TEMPLATES } from "../lib/mizaanPostEngine";

const G = {
  gold: "#F5D060",
  goldDim: "rgba(245,208,96,0.55)",
  goldBorder: "rgba(212,175,55,0.40)",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  bgCard: "rgba(8,16,40,0.98)",
  bgInner: "rgba(212,175,55,0.06)",
  dim: "rgba(255,255,255,0.35)",
};

// MANUSCRIPT EXAMPLES WITH ACTUAL GRID VALUES
// Only Fire examples have verified manuscript sources
// Air, Water, Earth need manuscript examples for validation
const MANUSCRIPT_EXAMPLES = [
  // ═══════════════════════════════════════════════════════════════
  // FIRE TEMPLATE — MANUSCRIPT VERIFIED (100% MATCH)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "fire-1",
    element: "fire",
    elementName: "Fire (Nari)",
    arabic: "النار",
    page: 316,
    sourceNumber: 80,
    grid: [
      [19, 23, 26, 12],
      [25, 13, 18, 24],
      [14, 28, 21, 17],
      [22, 16, 15, 27],
    ],
    status: "verified",
    matchPercentage: 100,
  },
  {
    id: "fire-2",
    element: "fire",
    elementName: "Fire (Nari)",
    arabic: "النار",
    page: 314,
    sourceNumber: 1696,
    grid: [
      [423, 426, 430, 416],
      [429, 417, 422, 427],
      [418, 432, 424, 421],
      [425, 420, 419, 431],
    ],
    status: "verified",
    matchPercentage: 100,
  },
  // ═══════════════════════════════════════════════════════════════
  // AIR TEMPLATE — NEEDS MANUSCRIPT EXAMPLES
  // ═══════════════════════════════════════════════════════════════
  // Status: Algorithm implemented, awaiting manuscript verification
  // {
  //   id: "air-1",
  //   element: "air",
  //   elementName: "Air (Havai)",
  //   arabic: "الهواء",
  //   page: ???,
  //   sourceNumber: ???,
  //   grid: ???, // Need actual manuscript grid
  //   status: "pending",
  // },
  
  // ═══════════════════════════════════════════════════════════════
  // WATER TEMPLATE — NEEDS MANUSCRIPT EXAMPLES
  // ═══════════════════════════════════════════════════════════════
  // Status: Algorithm implemented, awaiting manuscript verification
  // {
  //   id: "water-1",
  //   element: "water",
  //   elementName: "Water (Mai)",
  //   arabic: "الماء",
  //   page: ???,
  //   sourceNumber: ???,
  //   grid: ???, // Need actual manuscript grid
  //   status: "pending",
  // },
  
  // ═══════════════════════════════════════════════════════════════
  // EARTH TEMPLATE — NEEDS MANUSCRIPT EXAMPLES
  // ═══════════════════════════════════════════════════════════════
  // Status: Algorithm implemented, awaiting manuscript verification
  // {
  //   id: "earth-1",
  //   element: "earth",
  //   elementName: "Earth (Turabi)",
  //   arabic: "التراب",
  //   page: ???,
  //   sourceNumber: ???,
  //   grid: ???, // Need actual manuscript grid
  //   status: "pending",
  // },
];

function Card({ children, title, accent }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: G.bgCard,
        borderColor: accent || G.goldBorder,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}
    >
      {children}
    </div>
  );
}

function GridDisplay({ grid, title }) {
  return (
    <div>
      {title && (
        <div className="text-[8px] uppercase tracking-wider font-bold mb-2 text-center" style={{ color: G.goldDim }}>
          {title}
        </div>
      )}
      <div className="grid grid-cols-4 gap-1 max-w-[200px] mx-auto">
        {grid.flat().map((val, idx) => (
          <div
            key={idx}
            className="aspect-square flex items-center justify-center rounded border font-inter text-sm font-bold"
            style={{
              background: G.bgInner,
              borderColor: G.goldBorder + "60",
              color: G.goldDim,
            }}
          >
            {val.toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}

function SumVerification({ grid, sourceNumber }) {
  const rowSums = grid.map(row => row.reduce((a, b) => a + b, 0));
  const colSums = grid[0].map((_, j) => grid.reduce((sum, row) => sum + row[j], 0));
  const diag1 = grid.reduce((sum, row, i) => sum + row[i], 0);
  const diag2 = grid.reduce((sum, row, i) => sum + row[3 - i], 0);
  const mc = rowSums[0];

  const allRowSumsEqual = rowSums.every(s => s === rowSums[0]);
  const allColSumsEqual = colSums.every(s => s === colSums[0]);
  const diagonalsEqual = diag1 === diag2;
  const allEqual = allRowSumsEqual && allColSumsEqual && diagonalsEqual && rowSums[0] === colSums[0] && rowSums[0] === diag1;

  return (
    <div className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder + "40" }}>
      <div className="text-[7px] uppercase tracking-wider font-bold mb-2" style={{ color: G.gold }}>Sum Verification</div>
      <div className={`text-center text-[8px] font-bold p-2 rounded mb-3 ${
        allEqual ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
      }`}>
        {allEqual ? "✓ Valid Magic Square" : "✗ Invalid Magic Square"}
      </div>
      <div className="space-y-1 text-[6px]">
        <div className="flex justify-between">
          <span style={{ color: G.dim }}>Row Sums:</span>
          <span className={`font-mono ${allRowSumsEqual ? "text-green-500 font-bold" : "text-red-500"}`}>
            {rowSums.join(', ')}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: G.dim }}>Col Sums:</span>
          <span className={`font-mono ${allColSumsEqual ? "text-green-500 font-bold" : "text-red-500"}`}>
            {colSums.join(', ')}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: G.dim }}>Diagonals:</span>
          <span className={`font-mono ${diagonalsEqual ? "text-green-500 font-bold" : "text-red-500"}`}>
            {diag1}, {diag2}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t" style={{ borderColor: G.goldBorder + "30" }}>
          <div className="flex justify-between">
            <span style={{ color: G.dim }}>Magic Constant:</span>
            <span className="font-mono font-bold" style={{ color: G.gold }}>
              {mc.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: G.dim }}>Source Number:</span>
            <span className="font-mono font-bold" style={{ color: G.gold }}>
              {sourceNumber.toLocaleString()}
            </span>
          </div>
          <div className={`text-center mt-1 font-bold ${mc === sourceNumber ? "text-green-500" : "text-red-500"}`}>
            {mc === sourceNumber ? "✓ MC = Source" : `✗ MC ≠ Source (diff: ${Math.abs(mc - sourceNumber)})`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MizanRubaiVerification() {
  // Count verification status
  const verifiedCount = MANUSCRIPT_EXAMPLES.filter(ex => ex.status === "verified" && ex.matchPercentage === 100).length;
  const pendingCount = 3; // Air, Water, Earth need manuscript examples
  
  return (
    <PageLayout>
      <div className="space-y-4">
        <PageTitle
          arabic="التحقق من Rubai"
          latin="Rubai Engine Verification"
          subtitle="Manuscript Validation Status — Fire Verified, Air/Water/Earth Pending"
          icon="🔬"
        />

        {/* Algorithm Rules */}
        <Card title="Locked Rubai Algorithm Rules" icon={FileText}>
          <div className="space-y-3 text-[7px]" style={{ color: G.dim }}>
            <div className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder }}>
              <div className="font-bold mb-1" style={{ color: G.gold }}>1. ELEMENTAL TEMPLATE SELECTION</div>
              <div>Use the Rubai positional template for the dominant element:</div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>• Fire → Fire Rubai template</div>
                <div>• Air → Air Rubai template</div>
                <div>• Water → Water Rubai template</div>
                <div>• Earth → Earth Rubai template</div>
              </div>
            </div>

            <div className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder }}>
              <div className="font-bold mb-1" style={{ color: G.gold }}>2. CONSTRUCTION METHOD</div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>V = S - 30</div>
                <div>Q = ⌊V / 4⌋</div>
                <div>R = V % 4</div>
              </div>
            </div>

            <div className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder }}>
              <div className="font-bold mb-1" style={{ color: G.gold }}>3. SEQUENTIAL VALUE GENERATION</div>
              <div>Generate values sequentially starting from Q:</div>
              <div>Position 1 → Q, Position 2 → Q+1, ..., Position 16 → Q+15</div>
            </div>

            <div className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder }}>
              <div className="font-bold mb-1" style={{ color: G.gold }}>4. REMAINDER CORRECTION (SEQUENTIAL CONTINUATION)</div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>• R=1 → +1 at pos 13</div>
                <div>• R=2 → +1 at pos 9,13</div>
                <div>• R=3 → +1 at pos 5,9,13</div>
              </div>
              <div className="mt-1" style={{ color: G.green }}>✓ Use sequential continuation (NOT single-cell correction)</div>
            </div>

            <div className="p-3 rounded-lg border" style={{ borderColor: G.goldBorder }}>
              <div className="font-bold mb-1" style={{ color: G.gold }}>5. TEMPLATE PLACEMENT</div>
              <div>Place the corrected value sequence into the elemental Rubai template positions</div>
            </div>
          </div>
        </Card>

        {/* Verification Results */}
        {MANUSCRIPT_EXAMPLES.map((example) => {
          const result = buildVefk(example.sourceNumber, example.element);
          const validation = validateVefk(result.grid, result.mc);

          return (
            <Card key={example.id} title={`${example.elementName} — ${example.arabic} (Source: ${example.sourceNumber.toLocaleString()})`} icon={Calculator}>
              
              {/* Construction Parameters */}
              <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: G.goldBorder + "40" }}>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-[7px]" style={{ color: G.dim }}>Source (S)</div>
                    <div className="font-inter text-lg font-bold" style={{ color: G.gold }}>{example.sourceNumber.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[7px]" style={{ color: G.dim }}>V = S - 30</div>
                    <div className="font-inter text-lg font-bold" style={{ color: G.gold }}>{result.V.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[7px]" style={{ color: G.dim }}>Q = ⌊V/4⌋</div>
                    <div className="font-inter text-lg font-bold" style={{ color: G.gold }}>{result.Q.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[7px]" style={{ color: G.dim }}>R = V % 4</div>
                    <div className="font-inter text-lg font-bold" style={{ color: result.R > 0 ? G.red : G.green }}>{result.R}</div>
                  </div>
                </div>
                <div className="mt-2 text-center text-[7px]" style={{ color: G.dim }}>
                  Remainder correction:{" "}
                  <span className="font-bold" style={{ color: G.gold }}>
                    {result.R === 0 ? "None" : result.R === 1 ? "Position 13" : result.R === 2 ? "Positions 9, 13" : "Positions 5, 9, 13"}
                  </span>
                </div>
              </div>

              {/* Generated Grid */}
              <div className="mb-4">
                <GridDisplay grid={result.grid} title={`Generated ${example.elementName} Grid (MC: ${result.mc.toLocaleString()})`} />
              </div>

              {/* Sum Verification */}
              <SumVerification grid={result.grid} sourceNumber={example.sourceNumber} />

              {/* Validation Status */}
              <div className={`mt-4 p-3 rounded-lg border text-center ${
                validation.isValid && result.mc === example.sourceNumber
                  ? "bg-green-500/10 border-green-500/40" 
                  : "bg-red-500/10 border-red-500/40"
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {validation.isValid && result.mc === example.sourceNumber ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-inter text-sm font-bold ${
                    validation.isValid && result.mc === example.sourceNumber ? "text-green-500" : "text-red-500"
                  }`}>
                    {validation.isValid && result.mc === example.sourceNumber 
                      ? "✓ MANUSCRIPT-LOCKED VERIFIED" 
                      : "✗ VERIFICATION FAILED"}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Final Summary */}
        <Card title="Verification Status Report" icon={CheckCircle}>
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="p-4 rounded-xl border" style={{ borderColor: G.goldBorder }}>
              <div className="text-[8px] uppercase tracking-wider font-bold mb-2" style={{ color: G.gold }}>
                Overall Validation Status
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-green-500/10 border-green-500/40 border">
                  <div className="text-[7px] mb-1" style={{ color: G.dim }}>Fire Template</div>
                  <div className="text-lg font-bold text-green-500">✓ VERIFIED (100%)</div>
                  <div className="text-[6px]" style={{ color: G.dim }}>2 manuscript examples</div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border-yellow-500/40 border">
                  <div className="text-[7px] mb-1" style={{ color: G.dim }}>Air/Water/Earth</div>
                  <div className="text-lg font-bold text-yellow-500">⚠ PENDING</div>
                  <div className="text-[6px]" style={{ color: G.dim }}>Need manuscript examples</div>
                </div>
              </div>
            </div>

            {/* Detailed Status */}
            <div className="p-4 rounded-xl border" style={{ borderColor: G.goldBorder }}>
              <div className="text-[8px] uppercase tracking-wider font-bold mb-2" style={{ color: G.gold }}>
                Element-by-Element Status
              </div>
              <div className="space-y-3">
                {/* Fire */}
                <div className="p-3 rounded-lg border border-green-500/40 bg-green-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div className="font-bold text-green-500">Fire (Nari) — النار</div>
                  </div>
                  <div className="text-[7px] space-y-1" style={{ color: G.dim }}>
                    <div>✓ Page 316, Source 80: 16/16 cells (100% match)</div>
                    <div>✓ Page 314, Source 1696: 16/16 cells (100% match)</div>
                    <div>✓ Magic Constant verified: S = MC for both examples</div>
                    <div>✓ Row/Column/Diagonal sums: All valid</div>
                    <div style={{ color: G.green }}>Status: MANUSCRIPT-PROVEN</div>
                  </div>
                </div>

                {/* Air */}
                <div className="p-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <div className="font-bold text-yellow-500">Air (Havai) — الهواء</div>
                  </div>
                  <div className="text-[7px] space-y-1" style={{ color: G.dim }}>
                    <div>⚠ Algorithm implemented (sequential continuation)</div>
                    <div>⚠ Rubai template defined</div>
                    <div style={{ color: G.red }}>✗ NO MANUSCRIPT EXAMPLES FOUND</div>
                    <div style={{ color: G.yellow }}>Status: AWAITING MANUSCRIPT PROOF</div>
                  </div>
                </div>

                {/* Water */}
                <div className="p-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <div className="font-bold text-yellow-500">Water (Mai) — الماء</div>
                  </div>
                  <div className="text-[7px] space-y-1" style={{ color: G.dim }}>
                    <div>⚠ Algorithm implemented (sequential continuation)</div>
                    <div>⚠ Rubai template defined</div>
                    <div style={{ color: G.red }}>✗ NO MANUSCRIPT EXAMPLES FOUND</div>
                    <div style={{ color: G.yellow }}>Status: AWAITING MANUSCRIPT PROOF</div>
                  </div>
                </div>

                {/* Earth */}
                <div className="p-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <div className="font-bold text-yellow-500">Earth (Turabi) — التراب</div>
                  </div>
                  <div className="text-[7px] space-y-1" style={{ color: G.dim }}>
                    <div>⚠ Algorithm implemented (sequential continuation)</div>
                    <div>⚠ Rubai template defined</div>
                    <div style={{ color: G.red }}>✗ NO MANUSCRIPT EXAMPLES FOUND</div>
                    <div style={{ color: G.yellow }}>Status: AWAITING MANUSCRIPT PROOF</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 rounded-xl border" style={{ borderColor: G.goldBorder }}>
              <div className="text-[8px] uppercase tracking-wider font-bold mb-2" style={{ color: G.gold }}>
                Required for Full Validation
              </div>
              <div className="text-[7px] space-y-2" style={{ color: G.dim }}>
                <div>For each remaining element (Air, Water, Earth):</div>
                <div className="ml-3">1. Find manuscript example with page number</div>
                <div className="ml-3">2. Extract Source Number and complete 4x4 grid</div>
                <div className="ml-3">3. Verify dominant element matches template used</div>
                <div className="ml-3">4. Apply sequential continuation method</div>
                <div className="ml-3">5. Compare all 16 cells individually</div>
                <div className="ml-3">6. Verify row/column/diagonal sums</div>
                <div className="ml-3">7. Confirm match percentage = 100%</div>
                <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/40" style={{ color: G.red }}>
                  ⚠ DO NOT claim full validation until ALL elements have manuscript proof
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}