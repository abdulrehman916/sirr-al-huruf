import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { calculateBast, getDominantElement, ABJAD_KEBIR, ELEMENT_LETTERS } from '../../lib/samurHindiEngine';

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.20)",
  text: "#E8C84A",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.18)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.12)",
};

// Helper functions using imported constants
function getElementForLetter(letter) {
  for (const [element, letters] of Object.entries(ELEMENT_LETTERS)) {
    if (letters.includes(letter)) return element;
  }
  return 'unknown';
}

function getAbjadValue(letter) {
  return ABJAD_KEBIR[letter] || 0;
}

const LETTER_BOX_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.02, duration: 0.2 }
  })
};

function LetterBox({ letter, value, element, index }) {
  return (
    <motion.div
      custom={index}
      variants={LETTER_BOX_VARIANTS}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center p-2 rounded-lg border"
      style={{
        background: G.bg,
        borderColor: G.faint,
        minWidth: 48,
      }}
    >
      <span className="font-amiri text-lg font-bold" style={{ color: G.text }}>{letter}</span>
      <span className="font-inter text-[8px] mt-0.5" style={{ color: G.dim }}>{value}</span>
      <span className="font-inter text-[7px] mt-0.5 uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.25)" }}>{element}</span>
    </motion.div>
  );
}

function SectionCard({ title, number, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: G.faint }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: G.bg }}
      >
        <div className="flex items-center gap-3">
          <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: G.text }}>
            {number ? `STEP ${number}` : ''}
          </span>
          <span className="font-inter text-sm font-bold" style={{ color: "rgba(255,255,255,0.70)" }}>{title}</span>
        </div>
        <span className="font-inter text-[10px]" style={{ color: G.dim }}>{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && <div className="p-4 border-t" style={{ borderColor: G.faint }}>{children}</div>}
    </div>
  );
}

export default function SirrMethod1Analyzer() {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(() => {
    if (!inputText.trim()) {
      setError('Please enter Arabic text');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      // Step 1-5: Letter breakdown and values
      const text = inputText.trim();
      const letters = text.split('').filter(c => c.trim());
      const letterDetails = letters.map(letter => {
        const value = getAbjadValue(letter);
        const element = getElementForLetter(letter);
        return { letter, value, element };
      });

      const totalValue = letterDetails.reduce((sum, l) => sum + l.value, 0);

      // Step 6: Anasir (Element) Analysis
      const elementCounts = { Fire: 0, Air: 0, Water: 0, Earth: 0 };
      const elementValues = { Fire: 0, Air: 0, Water: 0, Earth: 0 };
      
      letterDetails.forEach(l => {
        if (elementCounts[l.element] !== undefined) {
          elementCounts[l.element]++;
          elementValues[l.element] += l.value;
        }
      });

      const dominantElement = Object.entries(elementValues).reduce((a, b) => 
        b[1] > a[1] ? b : a
      )[0];

      // Step 7: Mizan Calculations (9 stages)
      const mizan1 = totalValue; // Talib name value
      const mizan2 = dominantElement; // Galip Anasir
      const mizan3 = totalValue % 2 === 0 ? 237 : 440; // Day/Night
      const mizan4 = (totalValue % 12) + 1; // Hour (1-12)
      const mizan5 = (totalValue % 7); // Day of week (0-6)
      const mizan6 = (totalValue % 7) + 2029; // Planet year
      const mizan7 = totalValue % 4; // Need type (0-3)
      const mizan8 = totalValue > (totalValue.toString().split('').reverse().join('')) ? 2731 : 2725; // Hayir/Ser
      const mizan9 = 100; // Anasir Derecesi (fixed)

      const finalTotal = mizan1 + mizan3 + mizan4 + mizan6 + mizan9;

      setAnalysis({
        originalText: text,
        letters,
        letterDetails,
        totalValue,
        elementCounts,
        elementValues,
        dominantElement,
        mizan: {
          mizan1,
          mizan2,
          mizan3,
          mizan4,
          mizan5,
          mizan6,
          mizan7,
          mizan8,
          mizan9,
          finalTotal
        }
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [inputText]);

  const handleClear = useCallback(() => {
    setInputText('');
    setAnalysis(null);
    setError(null);
  }, []);

  const dayNames = ['Ahad', 'Ithnayn', 'Thalatha', 'Arba\'a', 'Khams', 'Jumu\'ah', 'Sabt'];
  const planetNames = ['Shams', 'Qamar', 'Mirrikh', 'Utarid', 'Mushtari', 'Zuhrah', 'Zuhal'];
  const needTypes = ['Celb (Attraction)', 'Tard (Repulsion)', 'Sihhat (Health)', 'Sukm (Silence)'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="rounded-2xl border p-5 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(8,18,48,0.99) 0%, rgba(4,12,34,0.99) 100%)",
          borderColor: G.borderHi,
          boxShadow: `0 0 40px ${G.glow}`,
        }}
      >
        <p className="font-amiri text-2xl font-bold mb-1" style={{ color: G.text }}>
          الطريقة الأولى
        </p>
        <p className="font-inter text-[10px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
          METHOD 1 — SAMUR HINDI
        </p>
        <p className="font-inter text-[9px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          Complete letter-by-letter analysis with all 9 Mizan stages
        </p>
      </div>

      {/* Input Box */}
      <div
        className="rounded-2xl border p-4"
        style={{
          background: "rgba(4,12,34,0.97)",
          borderColor: G.border,
        }}
      >
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Arabic Text Input (Letter / Word / Name / Sentence / Ayah / Surah)
        </label>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="أدخل النص العربي هنا..."
          dir="rtl"
          className="w-full min-h-[200px] p-4 font-amiri text-xl text-white focus:outline-none caret-white placeholder:text-white/30 resize-y"
          style={{ 
            background: "rgba(4,12,34,0.97)", 
            border: `1px solid ${G.border}`,
            fontSize: '20px',
            lineHeight: '2',
          }}
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="flex-1 px-6 py-3 rounded-xl font-inter font-bold text-base disabled:opacity-30"
            style={{ 
              background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
              color: "#0d1b2a"
            }}
          >
            {isAnalyzing ? 'ANALYZING...' : 'ANALYZE'}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-3 rounded-xl border font-inter text-sm font-bold"
            style={{ 
              borderColor: "rgba(239,68,68,0.30)", 
              color: "rgba(239,68,68,0.60)", 
              background: "rgba(239,68,68,0.05)" 
            }}
          >
            CLEAR
          </button>
        </div>
        {error && (
          <p className="mt-3 font-inter text-sm" style={{ color: "rgba(239,68,68,0.70)" }}>
            ⚠ {error}
          </p>
        )}
      </div>

      {/* Results */}
      {analysis && (
        <div className="space-y-3">
          {/* Step 1: Original Text */}
          <SectionCard title="Original Text" number="1">
            <p className="font-amiri text-2xl text-right leading-relaxed p-4 rounded-lg" 
               style={{ background: G.bg, color: G.text, direction: 'rtl' }}>
              {analysis.originalText}
            </p>
          </SectionCard>

          {/* Step 2-4: Letter Breakdown with Values */}
          <SectionCard title="Letter Breakdown & Numerical Values" number="2-4">
            <div className="flex flex-wrap gap-2 justify-center p-4">
              {analysis.letterDetails.map((l, i) => (
                <LetterBox
                  key={i}
                  index={i}
                  letter={l.letter}
                  value={l.value}
                  element={l.element}
                />
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg" style={{ background: G.bg }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                Calculation Formula:
              </p>
              <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
                {analysis.letterDetails.map(l => l.value).join(' + ')} = {analysis.totalValue}
              </p>
            </div>
          </SectionCard>

          {/* Step 5: Total Value */}
          <SectionCard title="Total Numerical Value" number="5">
            <div className="text-center p-6 rounded-lg" style={{ background: G.bg }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                TOTAL VALUE
              </p>
              <p className="font-amiri text-5xl font-bold" style={{ color: G.text }}>
                {analysis.totalValue}
              </p>
            </div>
          </SectionCard>

          {/* Step 6: Anasir Analysis */}
          <SectionCard title="Anasir (Element) Analysis" number="6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(analysis.elementCounts).map(([element, count]) => (
                <div
                  key={element}
                  className="p-3 rounded-lg border"
                  style={{
                    background: element === analysis.dominantElement ? G.bgHi : G.bg,
                    borderColor: element === analysis.dominantElement ? G.borderHi : G.faint,
                  }}
                >
                  <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                    {element.toUpperCase()}
                  </p>
                  <p className="font-inter text-lg font-bold mt-1" style={{ color: G.text }}>
                    {count} letters / {analysis.elementValues[element]} value
                  </p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg" style={{ background: G.bg }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                DOMINANT ELEMENT
              </p>
              <p className="font-inter text-xl font-bold" style={{ color: G.text }}>
                {analysis.dominantElement}
              </p>
            </div>
          </SectionCard>

          {/* Step 7: Mizan 1-9 */}
          <SectionCard title="Mizan Calculations (9 Stages)" number="7">
            <div className="space-y-3">
              {/* Mizan 1 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 1 — Talib İsmi (Name Value)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan1}
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: Total letter value
                </p>
              </div>

              {/* Mizan 2 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 2 — Galip Anasır (Dominant Element)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan2}
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: Element with highest total value
                </p>
              </div>

              {/* Mizan 3 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 3 — Gündüz/Gece (Day/Night)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan3}
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: {analysis.totalValue} % 2 = {analysis.totalValue % 2 === 0 ? 'Even (237)' : 'Odd (440)'}
                </p>
              </div>

              {/* Mizan 4 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 4 — Saat (Hour 1-12)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan4}
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: ({analysis.totalValue} % 12) + 1 = {analysis.mizan.mizan4}
                </p>
              </div>

              {/* Mizan 5 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 5 — Gün (Day of Week)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan5} ({dayNames[analysis.mizan.mizan5]})
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: {analysis.totalValue} % 7 = {analysis.mizan.mizan5}
                </p>
              </div>

              {/* Mizan 6 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 6 — Gezegen (Planet Year)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan6} ({planetNames[analysis.mizan.mizan5]})
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: ({analysis.totalValue} % 7) + 2029 = {analysis.mizan.mizan6}
                </p>
              </div>

              {/* Mizan 7 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 7 — Hacet (Need Type)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan7} ({needTypes[analysis.mizan.mizan7]})
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: {analysis.totalValue} % 4 = {analysis.mizan.mizan7}
                </p>
              </div>

              {/* Mizan 8 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 8 — Hayır/Şer (Good/Evil)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan8}
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: Comparison test = {analysis.mizan.mizan8}
                </p>
              </div>

              {/* Mizan 9 */}
              <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                  MIZAN 9 — Anasır Derecesi (Element Degree)
                </p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
                  {analysis.mizan.mizan9}
                </p>
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                  Formula: Fixed value = 100
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Step 9: Final Result */}
          <SectionCard title="Final Result" number="9">
            <div className="text-center p-8 rounded-2xl border" 
                 style={{ 
                   background: "linear-gradient(145deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
                   borderColor: G.borderHi,
                   boxShadow: `0 0 40px ${G.glow}`
                 }}>
              <p className="font-inter text-[9px] uppercase tracking-[0.22em] mb-3" style={{ color: G.dim }}>
                FINAL CALCULATION
              </p>
              <div className="font-inter text-sm mb-4" style={{ color: "rgba(255,255,255,0.60)" }}>
                <p>Mizan 1 + Mizan 3 + Mizan 4 + Mizan 6 + Mizan 9</p>
                <p className="mt-2 font-bold">
                  {analysis.mizan.mizan1} + {analysis.mizan.mizan3} + {analysis.mizan.mizan4} + {analysis.mizan.mizan6} + {analysis.mizan.mizan9}
                </p>
              </div>
              <p className="font-amiri text-6xl font-bold" style={{ color: G.text, textShadow: `0 0 30px ${G.glow}` }}>
                {analysis.mizan.finalTotal}
              </p>
              <p className="font-inter text-[9px] uppercase tracking-widest mt-3" style={{ color: G.dim }}>
                TOTAL RESULT
              </p>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}