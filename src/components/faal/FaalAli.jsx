import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Trash2, Sparkles } from "lucide-react";
import { FAAL_CELLS } from "../../lib/faalHasrathData";
import { usePageState } from "../../context/PageStateContext";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

function shuffleArray(array) {
  const arr = [...array];
  let currentIndex = arr.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}

const PAGE_KEY = 'faalAli';

export default function FaalAli() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const createShuffled = useCallback(() => shuffleArray(FAAL_CELLS), []);
  
  const initialShuffled = useMemo(() => createShuffled(), []);
  const initialState = getPageState(PAGE_KEY, {
    lang: "ml",
    shuffled: initialShuffled,
    selectedCell: null,
  });
  
  const [lang, setLang] = useState(initialState.lang);
  const [shuffled, setShuffled] = useState(initialState.shuffled);
  const [selectedCell, setSelectedCell] = useState(initialState.selectedCell);

  useEffect(() => {
    setPageState(PAGE_KEY, { lang, shuffled, selectedCell });
  }, [lang, shuffled, selectedCell, setPageState]);

  const handleShuffle = useCallback(() => {
    setShuffled(createShuffled());
    setSelectedCell(null);
  }, [createShuffled]);

  const handleClear = useCallback(() => {
    clearPageState(PAGE_KEY);
    setLang("ml");
    setShuffled(createShuffled());
    setSelectedCell(null);
  }, [clearPageState, createShuffled]);

  const handleSelectCell = (cell) => {
    setSelectedCell(cell);
  };

  const handleBack = () => {
    setSelectedCell(null);
  };

  return (
    <div className="space-y-4">
      {/* Language Toggle */}
      <SectionCard>
        <SectionLabel>🌐 Language — ഭാഷ — اللغة</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => setLang('ml')}
            whileHover={{ scale: lang === 'ml' ? 1 : 1.02 }}
            whileTap={{ scale: lang === 'ml' ? 1 : 0.98 }}
            className="rounded-xl py-3.5 font-inter font-bold text-xs border transition-all relative overflow-hidden"
            style={{
              background: lang === 'ml'
                ? "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)"
                : "rgba(4,12,34,0.97)",
              borderColor: lang === 'ml' ? G.borderHi : "rgba(255,255,255,0.08)",
              color: lang === 'ml' ? G.text : "rgba(255,255,255,0.38)",
              boxShadow: lang === 'ml' ? `0 0 18px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)` : "none",
            }}>
            {lang === 'ml' && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />}
            മലയാളം
          </motion.button>
          <motion.button
            onClick={() => setLang('en')}
            whileHover={{ scale: lang === 'en' ? 1 : 1.02 }}
            whileTap={{ scale: lang === 'en' ? 1 : 0.98 }}
            className="rounded-xl py-3.5 font-inter font-bold text-xs border transition-all relative overflow-hidden"
            style={{
              background: lang === 'en'
                ? "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)"
                : "rgba(4,12,34,0.97)",
              borderColor: lang === 'en' ? G.borderHi : "rgba(255,255,255,0.08)",
              color: lang === 'en' ? G.text : "rgba(255,255,255,0.38)",
              boxShadow: lang === 'en' ? `0 0 18px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)` : "none",
            }}>
            {lang === 'en' && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />}
            English
          </motion.button>
        </div>
      </SectionCard>

      <AnimatePresence mode="wait">
        {!selectedCell ? (
          /* Card Grid Selection View */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <SectionCard glow>
              <SectionLabel>✨ Select Your Omen — Choose a Card</SectionLabel>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {shuffled.map((cell, idx) => (
                  <motion.button
                    key={cell.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02, duration: 0.2 }}
                    onClick={() => handleSelectCell(cell)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(4,12,34,0.97) 100%)",
                      borderColor: "rgba(212,175,55,0.35)",
                      boxShadow: "0 0 16px rgba(212,175,55,0.12), inset 0 1px 0 rgba(212,175,55,0.08)",
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 120%, rgba(212,175,55,0.15) 0%, transparent 70%)` }} />
                    <span className="font-amiri text-2xl font-bold" style={{ color: G.text, zIndex: 1 }}>
                      {cell.innerMark === "dot" ? "•" : 
                       cell.innerMark === "two-dots" ? "••" :
                       cell.innerMark === "arc-up" ? "⌒" :
                       cell.innerMark === "three-dots" ? "∴" :
                       cell.innerMark === "line-h" ? "─" :
                       cell.innerMark === "eye" ? "◉" :
                       cell.innerMark === "x-cross" ? "✕" :
                       cell.innerMark === "line-v" ? "│" :
                       cell.innerMark === "circle" ? "○" :
                       cell.innerMark === "arc-down" ? "⌃" :
                       cell.innerMark === "cross" ? "＋" :
                       cell.innerMark === "spiral" ? "🌀" :
                       cell.innerMark === "double-arc" ? "≈" :
                       cell.innerMark === "star3" ? "✦" :
                       cell.innerMark === "zigzag" ? "⚡" : "✧"}
                    </span>
                    <span className="font-inter text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(212,175,55,0.60)", zIndex: 1 }}>
                      #{cell.id}
                    </span>
                  </motion.button>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        ) : (
          /* Result View */
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <SectionCard glow>
              <SectionLabel>✨ Faal Ali Result — ഫൽ ഫലം</SectionLabel>
              <div className="mt-4 space-y-4">
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border mb-3"
                    style={{
                      background: "linear-gradient(145deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.05) 100%)",
                      borderColor: "rgba(212,175,55,0.40)",
                      boxShadow: "0 0 28px rgba(212,175,55,0.25), inset 0 1px 0 rgba(212,175,55,0.15)",
                    }}
                  >
                    <span className="font-amiri text-3xl" style={{ color: G.text }}>
                      {selectedCell.innerMark === "dot" ? "•" : 
                       selectedCell.innerMark === "two-dots" ? "••" :
                       selectedCell.innerMark === "arc-up" ? "⌒" :
                       selectedCell.innerMark === "three-dots" ? "∴" :
                       selectedCell.innerMark === "line-h" ? "─" :
                       selectedCell.innerMark === "eye" ? "◉" :
                       selectedCell.innerMark === "x-cross" ? "✕" :
                       selectedCell.innerMark === "line-v" ? "│" :
                       selectedCell.innerMark === "circle" ? "○" :
                       selectedCell.innerMark === "arc-down" ? "⌃" :
                       selectedCell.innerMark === "cross" ? "＋" :
                       selectedCell.innerMark === "spiral" ? "🌀" :
                       selectedCell.innerMark === "double-arc" ? "≈" :
                       selectedCell.innerMark === "star3" ? "✦" :
                       selectedCell.innerMark === "zigzag" ? "⚡" : "✧"}
                    </span>
                  </motion.div>
                  <h3 className="font-amiri text-2xl font-bold" style={{ color: G.text }} dir="rtl">
                    {selectedCell[lang]?.shortTitle}
                  </h3>
                  <p className="font-inter text-[9px] uppercase tracking-widest mt-1" style={{ color: G.dim }}>
                    Card #{selectedCell.id}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                    Result — ഫലം
                  </p>
                  <p className="font-amiri text-lg font-bold leading-relaxed" style={{ color: G.text }}>
                    {selectedCell[lang]?.result}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.15)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                    Interpretation — വ്യാഖ്യാനം
                  </p>
                  <p className="font-inter text-sm text-white/80 leading-relaxed">
                    {selectedCell[lang]?.body}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.15)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                    Remedy — പരിഹാരം
                  </p>
                  <p className="font-inter text-sm text-white/80 leading-relaxed">
                    {selectedCell[lang]?.remedy}
                  </p>
                </div>

                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl font-inter font-bold text-sm text-[#0d1b2a] tracking-wide"
                  style={{
                    background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
                    boxShadow: `0 0 32px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)`,
                  }}
                >
                  ← Back to Cards
                </motion.button>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          onClick={handleShuffle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-inter font-bold text-sm text-[#0d1b2a] tracking-wide"
          style={{
            background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
            boxShadow: `0 0 32px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)`,
          }}
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </motion.button>
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-inter font-bold text-sm text-white border transition-all"
          style={{
            background: "rgba(4,12,34,0.97)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </motion.button>
      </div>
    </div>
  );
}

function SectionCard({ children, glow = false }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: "rgba(212,175,55,0.22)",
        boxShadow: glow
          ? `0 8px 48px rgba(0,0,0,0.62), 0 0 32px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.12)`
          : `0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
      {children}
    </p>
  );
}