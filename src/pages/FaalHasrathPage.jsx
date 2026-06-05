import { useState, useMemo, useEffect, useCallback } from "react";
import { Trash2, X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import ErrorBoundary from "../components/ErrorBoundary";
import { FAAL_CELLS } from "../lib/faalHasrathData";
import { LUQMAN_CELLS } from "../lib/faalLuqmanData";
import { usePageState } from "../context/PageStateContext";

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

  const t = useMemo(() => {
    return shuffledAli.find(cell => cell.id === 1)?.[lang] || {};
  }, [shuffledAli, lang]);

  return (
    <PageLayout>
      <div className="space-y-4">
        <PageTitle arabic="فأل" latin="Faal Hasrath" subtitle="Divination System" icon="🔮" />
        
        {/* Language Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setLang('ml')}
            className={`flex-1 py-2 rounded-lg ${lang === 'ml' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/50'}`}
          >
            മലയാളം
          </button>
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-2 rounded-lg ${lang === 'en' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/50'}`}
          >
            English
          </button>
        </div>

        {/* Section Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSection('ali')}
            className={`flex-1 py-2 rounded-lg ${section === 'ali' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/50'}`}
          >
            Faal Ali
          </button>
          <button
            onClick={() => setSection('luqman')}
            className={`flex-1 py-2 rounded-lg ${section === 'luqman' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/50'}`}
          >
            Luqman
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${section}-${lang}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-dark rounded-2xl border p-6"
            >
              {section === 'ali' ? (
                <div className="space-y-4">
                  {shuffledAli.slice(0, 3).map((cell) => (
                    <div key={cell.id} className="border-b border-white/10 pb-4 last:border-0">
                      <h3 className="text-lg font-bold text-yellow-400">{cell[lang]?.shortTitle}</h3>
                      <p className="text-white/80 mt-2">{cell[lang]?.result}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {shuffledLuqman.slice(0, 3).map((cell) => (
                    <div key={cell.lq_id} className="border-b border-white/10 pb-4 last:border-0">
                      <h3 className="text-lg font-bold text-yellow-400">{cell.symbol} - {cell[lang]?.shortTitle}</h3>
                      <p className="text-white/80 mt-2">{cell[lang]?.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button onClick={() => handleShuffle(section)} className="flex-1 btn-gold py-3 rounded-xl">
            🔀 Shuffle
          </button>
          <button onClick={handleClear} className="flex-1 bg-white/10 py-3 rounded-xl text-white">
            <Trash2 className="w-5 h-5 mx-auto" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

export default function FaalHasrathPage() {
  return (
    <ErrorBoundary fallbackMessage="Failed to load Faal Hasrath. Please try refreshing.">
      <FaalHasrathContent />
    </ErrorBoundary>
  );
}