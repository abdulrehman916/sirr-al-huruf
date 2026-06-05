import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Download, FileText } from "lucide-react";
import { calcKebir, calcSaghir, calcCumeli, calcBast } from "../lib/abjadModes";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { usePageState } from "../context/PageStateContext";

// ... (rest of the file content from read_file) ...

const PAGE_KEY = 'abjadKabir';

export default function AbjadKabirPage() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, {
    mode: "kebir",
    bastLevel: 1,
    history: [],
    input: "",
    results: { kebir: null, saghir: null, cumeli: null, bast: null },
  });
  
  const [mode, setMode] = useState(initialState.mode);
  const [bastLevel, setBastLevel] = useState(initialState.bastLevel);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(initialState.history);
  const debounceTimerRef = useRef(null);
  const [input, setInput] = useState(initialState.input);
  const [results, setResults] = useState(initialState.results);

  useEffect(() => {
    setPageState(PAGE_KEY, { mode, bastLevel, history, input, results });
  }, [mode, bastLevel, history, input, results, setPageState]);

  const handleClear = () => {
    setInput("");
    setResults({ kebir: null, saghir: null, cumeli: null, bast: null });
    setHistory([]);
    setBastLevel(1);
    setMode('kebir');
    clearPageState(PAGE_KEY);
  };

  // ... (rest of the component logic from read_file) ...
}