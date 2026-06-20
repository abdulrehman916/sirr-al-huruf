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
      const text = inputText.trim();
      
      // ═══════════════════════════════════════════
      // STEP 1: Normalize Arabic Text
      // Source: Samur Hindi pp. 16-18 (Arabic letter rules)
      // ═══════════════════════════════════════════
      const normalizedText = text
        .replace(/[\u064B-\u065F\u0670]/g, '') // Remove diacritics (tashkeel)
        .replace(/[^\u0600-\u06FF\s]/g, '') // Keep only Arabic letters and spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // ═══════════════════════════════════════════
      // STEP 2: Extract All Letters
      // Source: Samur Hindi pp. 16-18
      // ═══════════════════════════════════════════
      const letters = normalizedText.split('').filter(c => c.trim());

      // ═══════════════════════════════════════════
      // STEP 3-4: Letter-by-Letter Breakdown with Abjad Values
      // Source: Samur Hindi pp. 16-18 (Abjad Kebir table)
      // ═══════════════════════════════════════════
      const letterDetails = letters.map((letter, idx) => {
        const value = getAbjadValue(letter);
        const element = getElementForLetter(letter);
        return { 
          letter, 
          value, 
          element,
          position: idx + 1
        };
      });

      // ═══════════════════════════════════════════
      // STEP 5: Calculate Total Value
      // Source: Samur Hindi pp. 32-35
      // ═══════════════════════════════════════════
      const totalValue = letterDetails.reduce((sum, l) => sum + l.value, 0);

      // ═══════════════════════════════════════════
      // STEP 6: Determine Dominant Anasir (Element)
      // Source: Samur Hindi pp. 18, 32-35
      // ═══════════════════════════════════════════
      const elementCounts = { fire: 0, air: 0, water: 0, earth: 0 };
      const elementValues = { fire: 0, air: 0, water: 0, earth: 0 };
      
      letterDetails.forEach(l => {
        if (elementCounts[l.element] !== undefined) {
          elementCounts[l.element]++;
          elementValues[l.element] += l.value;
        }
      });

      const dominantElement = Object.entries(elementValues).reduce((a, b) => 
        b[1] > a[1] ? b : a
      )[0];

      // ═══════════════════════════════════════════
      // STEP 7-15: Apply All 9 Mizans Sequentially
      // Source: Samur Hindi pp. 32-45 (Dokuz Mizan system)
      // ═══════════════════════════════════════════
      
      // MIZAN 1: Talib İsmi (Name Value) - p.32
      const mizan1 = {
        step: 1,
        name: 'Talib İsmi',
        arabic: 'طَالِبُ ٱسْمِ',
        value: totalValue,
        formula: 'Sum of all letter Abjad values',
        calculation: letterDetails.map(l => l.value).join(' + '),
        result: totalValue,
        source: 'Risale-i Samur Hindi, p.32'
      };

      // MIZAN 2: Galip Anasır (Dominant Element) - p.35
      const mizan2 = {
        step: 2,
        name: 'Galip Anasır',
        arabic: 'غَالِبُ ٱلْعَنَاصِرِ',
        value: elementValues[dominantElement],
        formula: 'Element with highest total value',
        calculation: `Fire: ${elementValues.fire}, Air: ${elementValues.air}, Water: ${elementValues.water}, Earth: ${elementValues.earth}`,
        result: `${dominantElement.toUpperCase()} (${elementValues[dominantElement]})`,
        source: 'Risale-i Samur Hindi, p.35'
      };

      // MIZAN 3: Gündüz/Gece (Day/Night) - p.38
      const isEven = totalValue % 2 === 0;
      const mizan3 = {
        step: 3,
        name: isEven ? 'Gündüz' : 'Gece',
        arabic: isEven ? 'النَّهَارُ' : 'اللَّيْلُ',
        value: isEven ? 237 : 440,
        formula: `${totalValue} % 2 = ${totalValue % 2} → ${isEven ? 'Even (237)' : 'Odd (440)'}`,
        calculation: `${totalValue} ÷ 2 = ${totalValue / 2} (remainder: ${totalValue % 2})`,
        result: isEven ? 237 : 440,
        source: 'Risale-i Samur Hindi, p.38'
      };

      // MIZAN 4: Saat (Hour 1-12) - p.40
      const hourValue = (totalValue % 12) + 1;
      const mizan4 = {
        step: 4,
        name: `Saat ${hourValue}`,
        arabic: `ٱلسَّاعَةُ ${hourValue}`,
        value: hourValue,
        formula: `(${totalValue} % 12) + 1`,
        calculation: `${totalValue} ÷ 12 = ${Math.floor(totalValue / 12)} (remainder: ${totalValue % 12}) + 1`,
        result: hourValue,
        source: 'Risale-i Samur Hindi, p.40'
      };

      // MIZAN 5: Gün (Day of Week) - p.41
      const dayIndex = totalValue % 7;
      const dayNames = ['Ahad', 'Ithnayn', 'Thalatha', 'Arba\'a', 'Khams', 'Jumu\'ah', 'Sabt'];
      const dayArabic = ['الأَحَدُ', 'الْإِثْنَيْنَ', 'الثَّلَاثَاءُ', 'الْأَرْبَعَاءُ', 'الْخَمِيسُ', 'الْجُمُعَةُ', 'السَّبَّتُ'];
      const mizan5 = {
        step: 5,
        name: `Gün: ${dayNames[dayIndex]}`,
        arabic: dayArabic[dayIndex],
        value: dayIndex,
        formula: `${totalValue} % 7`,
        calculation: `${totalValue} ÷ 7 = ${Math.floor(totalValue / 7)} (remainder: ${dayIndex})`,
        result: `${dayIndex} (${dayNames[dayIndex]})`,
        source: 'Risale-i Samur Hindi, p.41'
      };

      // MIZAN 6: Gezegen (Planet Year) - p.42
      const planetYear = (totalValue % 7) + 2029;
      const planetNames = ['Shams', 'Qamar', 'Mirrikh', 'Utarid', 'Mushtari', 'Zuhrah', 'Zuhal'];
      const planetArabic = ['شَمْس', 'قَمَر', 'مَرِيخ', 'عُطَارِد', 'مُشْتَرِي', 'زُهْرَة', 'زُحَل'];
      const mizan6 = {
        step: 6,
        name: `Gezegen: ${planetNames[dayIndex]}`,
        arabic: planetArabic[dayIndex],
        value: planetYear,
        formula: `(${totalValue} % 7) + 2029`,
        calculation: `${dayIndex} + 2029`,
        result: planetYear,
        source: 'Risale-i Samur Hindi, p.42'
      };

      // MIZAN 7: Hacet (Need Type) - p.43
      const needIndex = totalValue % 4;
      const needTypes = ['Celb (جَلْبٌ)', 'Tard (طَرْدٌ)', 'Sihhat (صِحَّتٌ)', 'Sukm (سُقْمٌ)'];
      const mizan7 = {
        step: 7,
        name: `Hacet: ${needTypes[needIndex].split(' ')[0]}`,
        arabic: needTypes[needIndex].match(/\(([^)]+)\)/)[1],
        value: needIndex,
        formula: `${totalValue} % 4`,
        calculation: `${totalValue} ÷ 4 = ${Math.floor(totalValue / 4)} (remainder: ${needIndex})`,
        result: `${needIndex} (${needTypes[needIndex]})`,
        source: 'Risale-i Samur Hindi, p.43'
      };

      // MIZAN 8: Hayır/Şer (Good/Evil) - p.44
      const reversed = totalValue.toString().split('').reverse().join('');
      const isHayir = totalValue > parseInt(reversed);
      const mizan8 = {
        step: 8,
        name: isHayir ? 'Hayır' : 'Şer',
        arabic: isHayir ? 'الْخَيْرُ' : 'الشَّرُّ',
        value: isHayir ? 2731 : 2725,
        formula: `${totalValue} > ${reversed} ? 2731 : 2725`,
        calculation: `${totalValue} vs ${reversed} → ${totalValue > reversed ? 'Greater (2731)' : 'Lesser (2725)'}`,
        result: isHayir ? 2731 : 2725,
        source: 'Risale-i Samur Hindi, p.44'
      };

      // MIZAN 9: Anasır Derecesi (Element Degree) - p.45
      const mizan9 = {
        step: 9,
        name: `Anasır Derecesi: ${dominantElement}`,
        arabic: `دَرَجَةُ ٱلْعُنْصُرِ ${dominantElement.toUpperCase()}`,
        value: 100,
        formula: 'Fixed value for 1st degree of dominant element',
        calculation: '1st degree = 100 (base value)',
        result: 100,
        source: 'Risale-i Samur Hindi, p.45'
      };

      // FINAL TOTAL
      const finalTotal = mizan1.result + mizan3.result + mizan4.result + mizan6.result + mizan9.result;

      setAnalysis({
        normalizedText,
        originalText: text,
        letters,
        letterDetails,
        totalValue,
        elementCounts,
        elementValues,
        dominantElement,
        mizanSteps: [mizan1, mizan2, mizan3, mizan4, mizan5, mizan6, mizan7, mizan8, mizan9],
        finalTotal,
        finalFormula: 'Mizan 1 + Mizan 3 + Mizan 4 + Mizan 6 + Mizan 9'
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

          {/* Steps 7-15: Mizan 1-9 with Full Details */}
          <SectionCard title="Mizan Calculations (9 Stages)" number="7-15">
            <div className="space-y-3">
              {analysis.mizanSteps.map((mizan, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border"
                  style={{ background: G.bg, borderColor: G.faint }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                        {mizan.step}. {mizan.name.toUpperCase()}
                      </p>
                      <p className="font-amiri text-lg font-bold mt-0.5" style={{ color: G.text, direction: 'rtl' }}>
                        {mizan.arabic}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-inter text-2xl font-bold" style={{ color: G.text }}>
                        {typeof mizan.result === 'number' ? mizan.result.toLocaleString() : mizan.result}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: G.faint }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                      FORMULA
                    </p>
                    <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                      {mizan.formula}
                    </p>
                    <p className="font-inter text-[8px] uppercase tracking-widest mt-2 mb-1" style={{ color: G.dim }}>
                      CALCULATION
                    </p>
                    <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                      {mizan.calculation}
                    </p>
                    <p className="font-inter text-[8px] uppercase tracking-widest mt-2" style={{ color: G.dim }}>
                      SOURCE: {mizan.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Step 16: Final Result */}
          <SectionCard title="Final Result" number="16">
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
                <p>{analysis.finalFormula}</p>
                <p className="mt-2 font-bold">
                  {analysis.mizanSteps[0].result} + {analysis.mizanSteps[2].result} + {analysis.mizanSteps[3].result} + {analysis.mizanSteps[5].result} + {analysis.mizanSteps[8].result}
                </p>
              </div>
              <p className="font-amiri text-6xl font-bold" style={{ color: G.text, textShadow: `0 0 30px ${G.glow}` }}>
                {analysis.finalTotal.toLocaleString()}
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