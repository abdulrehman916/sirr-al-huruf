import { useState, useMemo, useEffect } from "react";
import { Trash2, X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FAAL_CELLS } from "../lib/faalHasrathData";
import { LUQMAN_CELLS } from "../lib/faalLuqmanData";
import { usePageState } from "../context/PageStateContext";


// ... (rest of the file content from read_file) ...

const PAGE_KEY = 'faalHasrath';

export default function FaalHasrathPage() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, {
    lang: "ml",
    section: "ali",
    shuffledAli: shuffleArray(FAAL_CELLS),
    shuffledLuqman: shuffleArray(LUQMAN_CELLS),
  });
  
  const [lang, setLang] = useState(initialState.lang);
  const [section, setSection] = useState(initialState.section);
  const [shuffledAli, setShuffledAli] = useState(initialState.shuffledAli);
  const [shuffledLuqman, setShuffledLuqman] = useState(initialState.shuffledLuqman);

  useEffect(() => {
    setPageState(PAGE_KEY, { lang, section, shuffledAli, shuffledLuqman });
  }, [lang, section, shuffledAli, shuffledLuqman, setPageState]);

  const handleShuffle = (type) => {
    if (type === 'ali') setShuffledAli(shuffleArray(FAAL_CELLS));
    if (type === 'luqman') setShuffledLuqman(shuffleArray(LUQMAN_CELLS));
  };

  const handleClear = () => {
    clearPageState(PAGE_KEY);
    setLang("ml");
    setSection("ali");
    setShuffledAli(shuffleArray(FAAL_CELLS));
    setShuffledLuqman(shuffleArray(LUQMAN_CELLS));
  };

  // ... (rest of the component logic from read_file) ...
}