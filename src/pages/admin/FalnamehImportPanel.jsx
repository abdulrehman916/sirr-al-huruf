// ═══════════════════════════════════════════════════════════════
// FALNAMEH SHEIKH BAHAI — ADMIN IMPORT PANEL
// Upload PDF, JSON, and manually edit grids/verses
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Edit3, Save, X, Grid3x3, BookOpen } from "lucide-react";
import PageLayout from "../../components/PageLayout";
import PageTitle from "../../components/PageTitle";

const P = {
  border:   "rgba(160,100,220,0.40)",
  borderHi: "rgba(180,120,255,0.70)",
  glow:     "rgba(160,100,220,0.25)",
  glowHi:   "rgba(180,120,255,0.55)",
  text:     "#D8B4FE",
  dim:      "rgba(216,180,254,0.55)",
  faint:    "rgba(216,180,254,0.18)",
  bg:       "rgba(160,100,220,0.07)",
  bgHi:     "rgba(160,100,220,0.16)",
  gold:     "#D4AF37",
};

function ImportOption({ icon: Icon, title, description, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="rounded-2xl border p-6 text-left"
      style={{
        background: P.bg,
        borderColor: disabled ? P.faint : P.border,
        boxShadow: `0 0 16px ${P.glow}`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0"
          style={{
            background: P.bgHi,
            borderColor: P.borderHi,
            boxShadow: `0 0 12px ${P.glow}`,
          }}>
          <Icon className="w-6 h-6" style={{ color: P.gold }} />
        </div>
        <div className="flex-1">
          <h3 className="font-amiri font-bold text-lg mb-1" style={{ color: P.text }}>{title}</h3>
          <p className="font-inter text-xs leading-relaxed" style={{ color: P.dim }}>{description}</p>
        </div>
      </div>
    </motion.button>
  );
}

function QuestionEditor({ questionNumber, gridData, verseData, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("grid");
  const [grid, setGrid] = useState(gridData || Array(12).fill(null).map(() => Array(18).fill("")));
  const [selectedCell, setSelectedCell] = useState(null);
  const [verse, setVerse] = useState({
    persian: verseData?.verseResult || "",
    malayalamMeaning: verseData?.malayalamMeaning || "",
    malayalamInterpretation: verseData?.malayalamInterpretation || "",
    englishMeaning: verseData?.englishMeaning || "",
    englishInterpretation: verseData?.englishInterpretation || "",
  });

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleCellEdit = (value) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const newGrid = grid.map((r, ri) => 
      r.map((c, ci) => (ri === row && ci === col ? value : c))
    );
    setGrid(newGrid);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(questionNumber, { grid, verse });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.84)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94 }}
        animate={{ scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-6xl rounded-3xl border overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
          borderColor: P.borderHi,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b z-10"
          style={{
            background: "rgba(18,8,44,0.99)",
            borderColor: P.faint,
          }}>
          <h2 className="font-amiri font-bold text-xl" style={{ color: P.text }}>
            Question {questionNumber} — Editor
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl border flex items-center gap-2"
              style={{
                background: P.bgHi,
                borderColor: P.borderHi,
                color: P.text,
              }}
            >
              <Save className="w-4 h-4" />
              <span className="font-inter text-xs uppercase tracking-widest">Save</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border"
              style={{
                background: P.bg,
                borderColor: P.faint,
                color: P.dim,
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: P.faint }}>
          <button
            onClick={() => setActiveTab("grid")}
            className="flex-1 py-3 flex items-center justify-center gap-2"
            style={{
              background: activeTab === "grid" ? P.bgHi : "transparent",
              color: activeTab === "grid" ? P.text : P.dim,
            }}
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="font-inter text-xs uppercase tracking-widest">Grid (12×18)</span>
          </button>
          <button
            onClick={() => setActiveTab("verse")}
            className="flex-1 py-3 flex items-center justify-center gap-2"
            style={{
              background: activeTab === "verse" ? P.bgHi : "transparent",
              color: activeTab === "verse" ? P.text : P.dim,
            }}
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-inter text-xs uppercase tracking-widest">Verse & Meaning</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "grid" && (
            <div>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: P.gold }}>
                Click any cell to edit the Persian letter
              </p>
              
              {selectedCell && (
                <div className="mb-4 p-4 rounded-2xl border"
                  style={{ background: P.bg, borderColor: P.faint }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: P.dim }}>
                    Editing Cell ({selectedCell.row + 1}, {selectedCell.col + 1})
                  </p>
                  <input
                    type="text"
                    value={grid[selectedCell.row][selectedCell.col]}
                    onChange={(e) => handleCellEdit(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border font-amiri text-lg"
                    style={{
                      background: P.bgHi,
                      borderColor: P.border,
                      color: P.text,
                    }}
                    dir="rtl"
                    placeholder="Enter Persian letter"
                    autoFocus
                  />
                </div>
              )}

              {/* Grid Display */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(18, 1fr)`,
                gap: "2px",
              }}>
                {grid.map((row, ri) =>
                  row.map((cell, ci) => (
                    <button
                      key={`${ri}-${ci}`}
                      onClick={() => handleCellClick(ri, ci)}
                      className="rounded-lg border flex items-center justify-center aspect-square"
                      style={{
                        background: selectedCell?.row === ri && selectedCell?.col === ci ? P.bgHi : P.bg,
                        borderColor: selectedCell?.row === ri && selectedCell?.col === ci ? P.borderHi : P.faint,
                        boxShadow: selectedCell?.row === ri && selectedCell?.col === ci ? `0 0 12px ${P.glowHi}` : "none",
                      }}
                    >
                      <span className="font-amiri text-sm" style={{ color: P.text }}>
                        {cell || "·"}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <p className="font-inter text-[8px] uppercase tracking-widest text-center mt-4" style={{ color: P.faint }}>
                ൧൨ × ൧൮ = ൨൧൬ Cells — Click to edit
              </p>
            </div>
          )}

          {activeTab === "verse" && (
            <div className="space-y-4">
              {/* Persian Verse */}
              <div>
                <label className="font-inter text-[9px] uppercase tracking-widest mb-2 block" style={{ color: P.gold }}>
                  ◈ Persian Verse
                </label>
                <textarea
                  value={verse.persian}
                  onChange={(e) => setVerse({ ...verse, persian: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border font-amiri text-lg"
                  style={{
                    background: P.bg,
                    borderColor: P.border,
                    color: P.text,
                    minHeight: 80,
                  }}
                  dir="rtl"
                  placeholder="Enter Persian verse text"
                />
              </div>

              {/* Malayalam Meaning */}
              <div>
                <label className="font-inter text-[9px] uppercase tracking-widest mb-2 block" style={{ color: P.gold }}>
                  ◈ Malayalam Meaning
                </label>
                <textarea
                  value={verse.malayalamMeaning}
                  onChange={(e) => setVerse({ ...verse, malayalamMeaning: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border font-amiri"
                  style={{
                    background: P.bg,
                    borderColor: P.border,
                    color: P.text,
                    minHeight: 60,
                  }}
                  placeholder="Enter Malayalam meaning"
                />
              </div>

              {/* Malayalam Interpretation */}
              <div>
                <label className="font-inter text-[9px] uppercase tracking-widest mb-2 block" style={{ color: P.gold }}>
                  ☽ Malayalam Interpretation
                </label>
                <textarea
                  value={verse.malayalamInterpretation}
                  onChange={(e) => setVerse({ ...verse, malayalamInterpretation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border font-amiri"
                  style={{
                    background: P.bg,
                    borderColor: P.border,
                    color: P.text,
                    minHeight: 80,
                  }}
                  placeholder="Enter Malayalam interpretation"
                />
              </div>

              {/* English Meaning */}
              <div>
                <label className="font-inter text-[9px] uppercase tracking-widest mb-2 block" style={{ color: P.gold }}>
                  ◈ English Meaning
                </label>
                <textarea
                  value={verse.englishMeaning}
                  onChange={(e) => setVerse({ ...verse, englishMeaning: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border font-inter text-sm"
                  style={{
                    background: P.bg,
                    borderColor: P.border,
                    color: P.text,
                    minHeight: 60,
                  }}
                  placeholder="Enter English meaning"
                />
              </div>

              {/* English Interpretation */}
              <div>
                <label className="font-inter text-[9px] uppercase tracking-widest mb-2 block" style={{ color: P.gold }}>
                  ☽ English Interpretation
                </label>
                <textarea
                  value={verse.englishInterpretation}
                  onChange={(e) => setVerse({ ...verse, englishInterpretation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border font-inter text-sm"
                  style={{
                    background: P.bg,
                    borderColor: P.border,
                    color: P.text,
                    minHeight: 80,
                  }}
                  placeholder="Enter English interpretation"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FalnamehImportPanel() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditQuestion = (questionNumber) => {
    setSelectedQuestion(questionNumber);
    setIsEditing(true);
  };

  const handleSave = (questionNumber, data) => {
    console.log("Saving data for question", questionNumber, data);
    setIsEditing(false);
    setSelectedQuestion(null);
  };

  return (
    <PageLayout>
      <div className="space-y-4">
        <PageTitle
          arabic="لوحة استيراد فالنامه"
          latin="FALNAMEH IMPORT PANEL"
          subtitle="Admin — Sheikh Bahai Data Import"
          icon="⚙"
        />

        {/* Import Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImportOption
            icon={Upload}
            title="Upload Scanned PDF"
            description="Upload original Sheikh Bahai Falnameh PDF pages for automated extraction"
            onClick={() => {}}
            disabled={true}
          />
          <ImportOption
            icon={FileText}
            title="Upload Extracted JSON"
            description="Import pre-extracted JSON data with questions, grids, and verses"
            onClick={() => {}}
            disabled={true}
          />
        </div>

        {/* Manual Editing Section */}
        <div className="rounded-2xl border p-4"
          style={{
            background: P.bg,
            borderColor: P.border,
            boxShadow: `0 0 20px ${P.glow}`,
          }}>
          <h3 className="font-amiri font-bold text-lg mb-4" style={{ color: P.text }}>
            Manual Data Entry — 26 Questions
          </h3>

          <div className="space-y-2">
            {Array.from({ length: 26 }, (_, i) => i + 1).map((qNum) => (
              <div
                key={qNum}
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{
                  background: P.bg,
                  borderColor: P.faint,
                }}
              >
                <span className="font-inter text-sm font-semibold" style={{ color: P.text }}>
                  Question {qNum}
                </span>
                <button
                  onClick={() => handleEditQuestion(qNum)}
                  className="px-4 py-2 rounded-lg border flex items-center gap-2"
                  style={{
                    background: P.bgHi,
                    borderColor: P.border,
                    color: P.text,
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="font-inter text-[9px] uppercase tracking-widest">Edit</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="rounded-2xl border px-4 py-3 text-center"
          style={{
            background: P.bg,
            borderColor: P.faint,
          }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>
            Status: Empty structure — Waiting for PDF/JSON import or manual entry
          </p>
        </div>
      </div>

      {/* Question Editor Modal */}
      {isEditing && selectedQuestion && (
        <QuestionEditor
          questionNumber={selectedQuestion}
          gridData={Array(12).fill(null).map(() => Array(18).fill(""))}
          verseData={{}}
          onSave={handleSave}
          onClose={() => {
            setIsEditing(false);
            setSelectedQuestion(null);
          }}
        />
      )}
    </PageLayout>
  );
}