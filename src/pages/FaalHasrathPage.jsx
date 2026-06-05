import { useState, useMemo, useEffect, useCallback } from "react";
import { Trash2, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import ErrorBoundary from "../components/ErrorBoundary";
import { FAAL_CELLS } from "../lib/faalHasrathData";
import { LUQMAN_CELLS } from "../lib/faalLuqmanData";
import { usePageState } from "../context/PageStateContext";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
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

const PAGE_KEY = 'faalHasrath';

function FaalHasrathContent() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const createShuffledAli = useCallback(() => shuffleArray(FAAL_CELLS), []);
  const createShuffledLuqman = useCallback(() => shuffleArray(LUQMAN_CELLS), []);
  
  const initialState = getPageState(PAGE_KEY, {
    lang: "ml",
    section: "ali",
    shuffledAli: createShuffledAli(),
    shuffledLuqman: createShuffledLuqman(),
  });
  
  const [lang, setLang] = useState(initialState.lang);
  const [section, setSection] = useState(initialState.section);
  const [shuffledAli, setShuffledAli] = useState(initialState.shuffledAli);
  const [shuffledLuqman, setShuffledLuqman] = useState(initialState.shuffledLuqman);

  useEffect(() => {
    setPageState(PAGE_KEY, { lang, section, shuffledAli, shuffledLuqman });
  }, [lang, section, shuffledAli, shuffledLuqman, setPageState]);

  const handleShuffle = (type) => {
    if (type === 'ali') setShuffledAli(createShuffledAli());
    if (type === 'luqman') setShuffledLuqman(createShuffledLuqman());
  };

  const handleClear = () => {
    clearPageState(PAGE_KEY);
    setLang("ml");
    setSection("ali");
    setShuffledAli(createShuffledAli());
    setShuffledLuqman(createShuffledLuqman());
  };

  return (
    <PageLayout>
      <div className="space-y-4">
        {/* Header */}
        <PageTitle arabic="فأل" latin="Faal Hasrath" subtitle="Divination System" icon="🔮" />

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

        {/* Section Toggle */}
        <SectionCard>
          <SectionLabel>📜 Section — വിഭാഗം — القسم</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={() => setSection('ali')}
              whileHover={{ scale: section === 'ali' ? 1 : 1.02 }}
              whileTap={{ scale: section === 'ali' ? 1 : 0.98 }}
              className="rounded-xl py-3.5 font-inter font-bold text-xs border transition-all relative overflow-hidden"
              style={{
                background: section === 'ali'
                  ? "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)"
                  : "rgba(4,12,34,0.97)",
                borderColor: section === 'ali' ? G.borderHi : "rgba(255,255,255,0.08)",
                color: section === 'ali' ? G.text : "rgba(255,255,255,0.38)",
                boxShadow: section === 'ali' ? `0 0 18px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)` : "none",
              }}>
              {section === 'ali' && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />}
              Faal Ali
            </motion.button>
            <motion.button
              onClick={() => setSection('luqman')}
              whileHover={{ scale: section === 'luqman' ? 1 : 1.02 }}
              whileTap={{ scale: section === 'luqman' ? 1 : 0.98 }}
              className="rounded-xl py-3.5 font-inter font-bold text-xs border transition-all relative overflow-hidden"
              style={{
                background: section === 'luqman'
                  ? "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)"
                  : "rgba(4,12,34,0.97)",
                borderColor: section === 'luqman' ? G.borderHi : "rgba(255,255,255,0.08)",
                color: section === 'luqman' ? G.text : "rgba(255,255,255,0.38)",
                boxShadow: section === 'luqman' ? `0 0 18px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)` : "none",
              }}>
              {section === 'luqman' && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />}
              Luqman
            </motion.button>
          </div>
        </SectionCard>

        {/* Results */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${section}-${lang}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <SectionCard glow>
              <SectionLabel>
                {section === 'ali' ? '✨ Faal Ali Results' : '🌟 Luqman Results'}
              </SectionLabel>
              
              <div className="space-y-4 mt-3">
                {section === 'ali' ? (
                  shuffledAli.slice(0, 3).map((cell, idx) => (
                    <motion.div
                      key={cell.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.28 }}
                      className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-inter text-[10px] font-bold" style={{ color: G.text }}>
                          {cell.id}.
                        </span>
                        <h3 className="font-amiri text-lg font-bold" style={{ color: G.text }} dir="rtl">
                          {cell[lang]?.shortTitle}
                        </h3>
                      </div>
                      <p className="font-inter text-sm text-white/80 leading-relaxed">
                        {cell[lang]?.result}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  shuffledLuqman.slice(0, 3).map((cell, idx) => (
                    <motion.div
                      key={cell.lq_id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.28 }}
                      className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-amiri text-xl font-bold" style={{ color: G.text }} dir="rtl">
                          {cell.symbol}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-amiri text-lg font-bold" style={{ color: G.text }} dir="rtl">
                            {cell[lang]?.shortTitle}
                          </h3>
                          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                            {cell[lang]?.title}
                          </p>
                        </div>
                      </div>
                      <p className="font-inter text-sm text-white/80 leading-relaxed">
                        {cell[lang]?.result}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </SectionCard>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => handleShuffle(section)}
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
    </PageLayout>
  );
}

// ── Reusable Components ───────────────────────────────────────────────
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

export default function FaalHasrathPage() {
  return (
    <ErrorBoundary fallbackMessage="Failed to load Faal Hasrath. Please try refreshing.">
      <FaalHasrathContent />
    </ErrorBoundary>
  );
}