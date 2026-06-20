import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  calculateBast, 
  getDominantElement, 
  getDominantElementFromMebsut,
  transformToMebsut,
  countMebsutLetters,
  countElementsByElement,
  ABJAD_KEBIR, 
  ELEMENT_LETTERS,
  DAY_VALUES,
  PLANET_VALUES,
  NEED_VALUES
} from '../../lib/samurHindiEngine';

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
      // Source: Samur Hindi pp. 16-18, 41-43
      // ═══════════════════════════════════════════
      const normalizedText = text
        .replace(/[\u064B-\u065F\u0670]/g, '') // Remove diacritics (tashkeel)
        .replace(/[^\u0600-\u06FF\s]/g, '') // Keep only Arabic letters and spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // ═══════════════════════════════════════════
      // STEP 2: Extract All Letters
      // Source: Samur Hindi pp. 16-18, 41
      // ═══════════════════════════════════════════
      const originalLetters = normalizedText.split('').filter(c => c.trim());

      // ═══════════════════════════════════════════
      // STEP 3: Generate Mebsut Forms (pp.41-43)
      // Each letter transforms into component strokes/dots
      // Source: Samur Hindi pp. 41-43
      // ═══════════════════════════════════════════
      const { mebsutLetters, transformSteps } = transformToMebsut(originalLetters);

      // ═══════════════════════════════════════════
      // STEP 4: Count Every Resulting Letter
      // Source: Samur Hindi p.42
      // ═══════════════════════════════════════════
      const mebsutCounts = countMebsutLetters(mebsutLetters);

      // ═══════════════════════════════════════════
      // STEP 5: Separate Counts by Element
      // Source: Samur Hindi pp. 18, 42
      // ═══════════════════════════════════════════
      const { elementCounts, elementValues } = countElementsByElement(mebsutCounts);

      // ═══════════════════════════════════════════
      // STEP 6: Determine Dominant Element
      // Source: Samur Hindi p.42
      // ═══════════════════════════════════════════
      const dominantElementData = getDominantElementFromMebsut(mebsutLetters);
      const dominantElement = dominantElementData.element;

      // ═══════════════════════════════════════════
      // STEP 7: Calculate Total Value (Original Letters)
      // Source: Samur Hindi pp. 16-18, 32-35
      // ═══════════════════════════════════════════
      const originalLetterDetails = originalLetters.map((letter, idx) => {
        const value = getAbjadValue(letter);
        const element = getElementForLetter(letter);
        return { letter, value, element, position: idx + 1 };
      });
      const totalValue = originalLetterDetails.reduce((sum, l) => sum + l.value, 0);

      // ═══════════════════════════════════════════
      // STEP 7-15: Apply All 9 Mizans Sequentially
      // Source: Samur Hindi pp. 32-45 (Dokuz Mizan system)
      // Using Mebsut-based element counts from pp.41-43
      // ═══════════════════════════════════════════
      
      // MIZAN 1: Talib İsmi (Name Value) - p.32
      const mizan1 = {
        step: 1,
        name: 'Talib İsmi',
        arabic: 'طَالِبُ ٱسْمِ',
        value: totalValue,
        formula: 'Sum of all original letter Abjad values',
        calculation: originalLetterDetails.map(l => l.value).join(' + '),
        result: totalValue,
        source: 'Risale-i Samur Hindi, p.32'
      };

      // MIZAN 2: Galip Anasır (Dominant Element from Mebsut) - p.35, p.42
      const mizan2 = {
        step: 2,
        name: 'Galip Anasır (Mebsut)',
        arabic: 'غَالِبُ ٱلْعَنَاصِرِ',
        value: dominantElementData.elementValues[dominantElement],
        formula: 'Element with highest count in Mebsut transformation',
        calculation: `Fire: ${dominantElementData.elementCounts.fire}, Air: ${dominantElementData.elementCounts.air}, Water: ${dominantElementData.elementCounts.water}, Earth: ${dominantElementData.elementCounts.earth}`,
        result: `${dominantElement.toUpperCase()} (${dominantElementData.elementCounts[dominantElement]} letters, value: ${dominantElementData.elementValues[dominantElement]})`,
        source: 'Risale-i Samur Hindi, pp.35, 42'
      };

      // MIZAN 3: Gündüz/Gece (Day/Night) - p.33
      // Book values: النَّهَارُ (237) for day, اللَّيْلُ (440) for night
      const isEven = totalValue % 2 === 0;
      const dayNightValue = isEven ? 237 : 440;
      const mizan3 = {
        step: 3,
        name: isEven ? 'Gündüz' : 'Gece',
        arabic: isEven ? 'النَّهَارُ' : 'اللَّيْلُ',
        value: dayNightValue,
        formula: `${totalValue} % 2 = ${totalValue % 2} → ${isEven ? 'Even → النَّهَارُ (237)' : 'Odd → اللَّيْلُ (440)'}`,
        calculation: `${totalValue} ÷ 2 = ${Math.floor(totalValue / 2)} (remainder: ${totalValue % 2}) → ${dayNightValue}`,
        result: dayNightValue,
        source: 'Risale-i Samur Hindi, p.33'
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

      // MIZAN 5: Gün (Day of Week) - p.33
      // Book values from DAY_VALUES (verified from Risale-i Samur Hindi p.33)
      const dayIndex = totalValue % 7;
      const dayKeys = ['pazar', 'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi'];
      const dayData = DAY_VALUES[dayKeys[dayIndex]] || DAY_VALUES.pazar;
      const mizan5 = {
        step: 5,
        name: `Gün: ${dayKeys[dayIndex]}`,
        arabic: dayData.arabic,
        value: dayData.value,
        formula: `Day index: ${totalValue} % 7 = ${dayIndex} → ${dayKeys[dayIndex].toUpperCase()}`,
        calculation: `${totalValue} ÷ 7 = ${Math.floor(totalValue / 7)} (remainder: ${dayIndex}) → ${dayData.arabic} (${dayData.value})`,
        result: dayData.value,
        source: 'Risale-i Samur Hindi, p.33'
      };

      // MIZAN 6: Gezegen (Planet Year) - p.34
      // Book values from PLANET_VALUES (verified from Risale-i Samur Hindi p.34)
      // Planet corresponds to the day's planet
      const planetKeys = ['zuhal', 'kamer', 'merih', 'utarid', 'musteri', 'zuhre', 'sems'];
      const planetData = PLANET_VALUES[planetKeys[dayIndex]] || PLANET_VALUES.sems;
      const mizan6 = {
        step: 6,
        name: `Gezegen: ${planetKeys[dayIndex]}`,
        arabic: planetData.arabic,
        value: planetData.value,
        formula: `Planet of ${dayKeys[dayIndex]}: ${planetKeys[dayIndex].toUpperCase()}`,
        calculation: `${planetData.arabic} = ${planetData.value}`,
        result: planetData.value,
        source: 'Risale-i Samur Hindi, p.34'
      };

      // MIZAN 7: Hacet (Need Type) - p.34
      // Book values from NEED_VALUES (verified from Risale-i Samur Hindi p.34)
      const needIndex = totalValue % 4;
      const needKeys = ['celb', 'tard', 'sıhhat', 'sukm'];
      const needData = NEED_VALUES[needKeys[needIndex]] || NEED_VALUES.celb;
      const mizan7 = {
        step: 7,
        name: `Hacet: ${needKeys[needIndex]}`,
        arabic: needData.arabic,
        value: needData.value,
        formula: `Need index: ${totalValue} % 4 = ${needIndex} → ${needKeys[needIndex].toUpperCase()}`,
        calculation: `${totalValue} ÷ 4 = ${Math.floor(totalValue / 4)} (remainder: ${needIndex}) → ${needData.arabic} (${needData.value})`,
        result: needData.value,
        source: 'Risale-i Samur Hindi, p.34'
      };

      // MIZAN 8: Hayır/Şer (Good/Evil) - p.35
      // Book values: الْخَيْرُ (2731) for hayır, الشَّرُّ (2725) for şer
      const reversed = totalValue.toString().split('').reverse().join('');
      const isHayir = totalValue > parseInt(reversed);
      const hayirSerValue = isHayir ? 2731 : 2725;
      const mizan8 = {
        step: 8,
        name: isHayir ? 'Hayır' : 'Şer',
        arabic: isHayir ? 'الْخَيْرُ' : 'الشَّرُّ',
        value: hayirSerValue,
        formula: `${totalValue} > reverse(${totalValue}) = ${totalValue} > ${reversed} → ${isHayir ? 'الْخَيْرُ (2731)' : 'الشَّرُّ (2725)'}`,
        calculation: `${totalValue} vs ${reversed} → ${isHayir ? 'Greater → 2731' : 'Lesser → 2725'}`,
        result: hayirSerValue,
        source: 'Risale-i Samur Hindi, p.35'
      };

      // MIZAN 9: Anasır Derecesi (Element Degree) - p.35
      // Book: Each element has 4 degrees (some say 5 for water)
      // Using 1st degree base value = 100
      const mizan9 = {
        step: 9,
        name: `Anasır Derecesi: ${dominantElement}`,
        arabic: `دَرَجَةُ ٱلْعُنْصُرِ`,
        value: 100,
        formula: '1st degree of dominant element (base value)',
        calculation: `${dominantElement.toUpperCase()} 1st degree = 100`,
        result: 100,
        source: 'Risale-i Samur Hindi, p.35'
      };

      // FINAL TOTAL - Book formula: Mizan 1 + Mizan 3 + Mizan 4 + Mizan 6 + Mizan 9
      const finalTotal = mizan1.result + mizan3.result + mizan4.result + mizan6.result + mizan9.result;

      setAnalysis({
        normalizedText,
        originalText: text,
        originalLetters,
        originalLetterDetails,
        mebsutLetters,
        transformSteps,
        mebsutCounts,
        totalValue,
        elementCounts,
        elementValues,
        dominantElement,
        dominantElementData,
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
          className="w-full min-h-[160px] max-h-[35vh] p-4 font-amiri text-lg text-white focus:outline-none caret-white placeholder:text-white/30 resize-y"
          style={{ 
            background: "rgba(4,12,34,0.97)", 
            border: `1px solid ${G.border}`,
            fontSize: '16px',
            lineHeight: '1.8',
            WebkitAppearance: 'none',
            borderRadius: '12px',
            contain: 'layout',
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

          {/* Step 2: Original Letters */}
          <SectionCard title="Original Letters (pp.16-18)" number="2">
            <div className="flex flex-wrap gap-2 justify-center p-4">
              {analysis.originalLetterDetails.map((l, i) => (
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
                Original Letter Values:
              </p>
              <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
                {analysis.originalLetterDetails.map(l => l.value).join(' + ')} = {analysis.totalValue}
              </p>
            </div>
          </SectionCard>

          {/* Step 3: Mebsut Transformation (pp.41-43) */}
          <SectionCard title="Mebsut Transformation (pp.41-43)" number="3">
            <div className="space-y-2">
              {analysis.transformSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg" style={{ background: G.bg }}>
                  <span className="font-amiri text-lg" style={{ color: G.text, direction: 'rtl' }}>{step.original}</span>
                  <span className="font-inter text-xs" style={{ color: G.dim }}>→</span>
                  <div className="flex gap-1">
                    {step.mebsut.map((m, i) => (
                      <span key={i} className="font-amiri text-lg" style={{ color: G.text, direction: 'rtl' }}>{m}</span>
                    ))}
                  </div>
                  <span className="font-inter text-[9px]" style={{ color: G.dim }}>{step.mebsut.length} letters</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg" style={{ background: G.bg }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                TRANSFORMATION SUMMARY
              </p>
              <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
                Original: {analysis.originalLetters.length} letters → Mebsut: {analysis.mebsutLetters.length} letters
              </p>
            </div>
          </SectionCard>

          {/* Step 4: Mebsut Letter Counts */}
          <SectionCard title="Mebsut Letter Counts (p.42)" number="4">
            <div className="grid grid-cols-4 gap-2 p-4">
              {Object.entries(analysis.mebsutCounts).map(([letter, count]) => (
                <div key={letter} className="text-center p-2 rounded-lg" style={{ background: G.bg }}>
                  <span className="font-amiri text-xl block" style={{ color: G.text, direction: 'rtl' }}>{letter}</span>
                  <span className="font-inter text-xs" style={{ color: G.dim }}>×{count}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Step 5: Total Value (Original Letters) */}
          <SectionCard title="Total Value - Original Letters" number="5">
            <div className="text-center p-6 rounded-lg" style={{ background: G.bg }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                ORIGINAL LETTER TOTAL
              </p>
              <p className="font-amiri text-5xl font-bold" style={{ color: G.text }}>
                {analysis.totalValue}
              </p>
              <p className="font-inter text-xs mt-2" style={{ color: "rgba(255,255,255,0.50)" }}>
                From {analysis.originalLetters.length} original letters
              </p>
            </div>
          </SectionCard>

          {/* Step 6: Anasir Analysis (from Mebsut) */}
          <SectionCard title="Anasir Analysis - Mebsut (p.42)" number="6">
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
                DOMINANT ELEMENT (from Mebsut)
              </p>
              <p className="font-inter text-xl font-bold" style={{ color: G.text }}>
                {analysis.dominantElement.toUpperCase()}
              </p>
              <p className="font-inter text-xs mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>
                {analysis.dominantElementData.elementCounts[analysis.dominantElement]} Mebsut letters / {analysis.dominantElementData.elementValues[analysis.dominantElement]} total value
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