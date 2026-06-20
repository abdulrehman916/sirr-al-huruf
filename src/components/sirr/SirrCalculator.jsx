import { useState, useCallback, useMemo } from 'react';
import { executeCalculation, getBookRules, CALCULATION_TYPES } from '../../lib/samurHindiEngine';
import SirrMethod1Analyzer from './SirrMethod1Analyzer';

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.20)",
  text: "#E8C84A",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.18)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.12)",
  error: "rgba(239,68,68,0.30)",
};

const CALC_OPTIONS = [
  { id: 'METHOD_1', label: 'Method 1 — Complete Analysis', desc: 'Full letter-by-letter with all 9 Mizan stages' },
  { id: CALCULATION_TYPES.BAST, label: 'Bast Hesabı', desc: '5 seviyeli harf dönüşümü' },
  { id: CALCULATION_TYPES.MIZAN, label: 'Dokuz Mizan', desc: '9 ölçekli tam sistem' },
  { id: CALCULATION_TYPES.VEFK, label: 'Vefk Yapımı', desc: 'Sihirli kare inşası' },
  { id: CALCULATION_TYPES.ELEMENT, label: 'Anasır Analizi', desc: 'Element hakimiyeti' },
  { id: CALCULATION_TYPES.ABJAD, label: 'Ebced Değeri', desc: 'Harf sayısal değeri' },
];

function BastLevelSelector({ level, setLevel }) {
  return (
    <div className="space-y-2">
      <label className="block font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
        Bast Seviyesi
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(l => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`flex-1 py-2 rounded-lg border font-inter text-sm font-bold ${level === l ? 'bg-gold' : ''}`}
            style={{
              background: level === l ? G.bgHi : G.bg,
              borderColor: level === l ? G.borderHi : G.faint,
              color: level === l ? G.text : "rgba(255,255,255,0.40)"
            }}
          >
            {l}. Bast
          </button>
        ))}
      </div>
    </div>
  );
}

function MizanOptions({ options, setOptions }) {
  const handleChange = useCallback((key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, [setOptions]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Talib İsmi
        </label>
        <input
          value={options.talibName}
          onChange={e => handleChange('talibName', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
          placeholder="İsim girin"
        />
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Matlub İsmi
        </label>
        <input
          value={options.matlubName}
          onChange={e => handleChange('matlubName', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
          placeholder="İsim girin"
        />
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Gün
        </label>
        <select
          value={options.day}
          onChange={e => handleChange('day', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
        >
          <option value="pazar">Pazar</option>
          <option value="pazartesi">Pazartesi</option>
          <option value="salı">Salı</option>
          <option value="çarşamba">Çarşamba</option>
          <option value="perşembe">Perşembe</option>
          <option value="cuma">Cuma</option>
          <option value="cumartesi">Cumartesi</option>
        </select>
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Saat
        </label>
        <select
          value={options.hour}
          onChange={e => handleChange('hour', parseInt(e.target.value))}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
            <option key={h} value={h}>{h}. Saat</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Gezegen
        </label>
        <select
          value={options.planet}
          onChange={e => handleChange('planet', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
        >
          <option value="sems">Şems (Güneş)</option>
          <option value="kamer">Kamer (Ay)</option>
          <option value="merih">Merih (Mars)</option>
          <option value="zuhre">Zühre (Venüs)</option>
          <option value="utarid">Utarid (Merkür)</option>
          <option value="musteri">Müşteri (Jüpiter)</option>
          <option value="zuhal">Zühal (Satürn)</option>
        </select>
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Hacet
        </label>
        <select
          value={options.needType}
          onChange={e => handleChange('needType', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
        >
          <option value="celb">Celb (Çekme)</option>
          <option value="tard">Tard (Kovma)</option>
          <option value="sıhhat">Sıhhat (Şifa)</option>
          <option value="sukm">Sukm (Hastalık)</option>
        </select>
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Zaman
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleChange('isDayTime', true)}
            className={`flex-1 py-2 rounded-lg border font-inter text-xs ${options.isDayTime ? 'bg-gold' : ''}`}
            style={{
              background: options.isDayTime ? G.bgHi : G.bg,
              borderColor: options.isDayTime ? G.borderHi : G.faint,
              color: options.isDayTime ? G.text : "rgba(255,255,255,0.40)"
            }}
          >
            Gündüz
          </button>
          <button
            onClick={() => handleChange('isDayTime', false)}
            className={`flex-1 py-2 rounded-lg border font-inter text-xs ${!options.isDayTime ? 'bg-gold' : ''}`}
            style={{
              background: !options.isDayTime ? G.bgHi : G.bg,
              borderColor: !options.isDayTime ? G.borderHi : G.faint,
              color: !options.isDayTime ? G.text : "rgba(255,255,255,0.40)"
            }}
          >
            Gece
          </button>
        </div>
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Niyet
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleChange('isHayir', true)}
            className={`flex-1 py-2 rounded-lg border font-inter text-xs ${options.isHayir ? 'bg-gold' : ''}`}
            style={{
              background: options.isHayir ? G.bgHi : G.bg,
              borderColor: options.isHayir ? G.borderHi : G.faint,
              color: options.isHayir ? G.text : "rgba(255,255,255,0.40)"
            }}
          >
            Hayır
          </button>
          <button
            onClick={() => handleChange('isHayir', false)}
            className={`flex-1 py-2 rounded-lg border font-inter text-xs ${!options.isHayir ? 'bg-gold' : ''}`}
            style={{
              background: !options.isHayir ? G.bgHi : G.bg,
              borderColor: !options.isHayir ? G.borderHi : G.faint,
              color: !options.isHayir ? G.text : "rgba(255,255,255,0.40)"
            }}
          >
            Şer
          </button>
        </div>
      </div>
    </div>
  );
}

function VefkOptions({ options, setOptions }) {
  const handleChange = useCallback((key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, [setOptions]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Vefk Boyutu
        </label>
        <select
          value={options.size}
          onChange={e => handleChange('size', parseInt(e.target.value))}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
        >
          <option value={3}>3×3 (Zühal)</option>
          <option value={4}>4×4 (Müşteri)</option>
          <option value={5}>5×5 (Merih)</option>
          <option value={6}>6×6 (Güneş)</option>
          <option value={7}>7×7 (Zühre)</option>
          <option value={8}>8×8 (Utarid)</option>
          <option value={9}>9×9 (Kamer)</option>
        </select>
      </div>
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          Başlangıç Değeri
        </label>
        <input
          type="number"
          value={options.startValue || ''}
          onChange={e => handleChange('startValue', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 rounded-lg text-white"
          style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '14px' }}
          placeholder="Otomatik"
        />
      </div>
    </div>
  );
}

function CalculationResult({ result, type }) {
  if (!result) return null;

  return (
    <div className="space-y-4">
      {/* Final Result */}
      <div
        className="rounded-2xl border p-6 text-center"
        style={{
          background: G.bgHi,
          borderColor: G.borderHi,
          boxShadow: `0 0 32px ${G.glow}`,
        }}
      >
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          {result.method || 'Calculation Result'}
        </p>
        <p className="font-amiri text-4xl font-bold mb-2" style={{ color: G.text }}>
          {result.total !== undefined ? result.total.toLocaleString() : 'Complete'}
        </p>
        {result.vefkName && (
          <p className="font-inter text-sm font-bold uppercase tracking-wide" style={{ color: G.text }}>
            {result.vefkName}
          </p>
        )}
        <p className="font-inter text-[9px] mt-2" style={{ color: "rgba(255,255,255,0.30)" }}>
          {result.source}
        </p>
      </div>

      {/* Steps Breakdown */}
      {result.steps && (
        <div className="space-y-2">
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            Calculation Steps ({result.steps.length} Mizan)
          </p>
          {result.steps.map((step, i) => (
            <div
              key={i}
              className="rounded-xl border p-4"
              style={{ background: G.bg, borderColor: G.faint }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.text }}>
                  {step.mizan}. Mizan — {step.name}
                </span>
                <span className="font-inter text-sm font-bold" style={{ color: G.text }}>
                  {step.value.toLocaleString()}
                </span>
              </div>
              <p className="font-amiri text-sm mb-2" style={{ color: "rgba(255,255,255,0.60)", direction: "rtl", textAlign: "right" }}>
                {step.description}
              </p>
              {step.breakdown && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {step.breakdown.map((item, j) => (
                    <span
                      key={j}
                      className="font-inter text-[9px] px-2 py-0.5 rounded-full border"
                      style={{ background: "rgba(0,0,0,0.30)", borderColor: G.faint, color: G.dim }}
                    >
                      {item.letter}: {item.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Element Analysis */}
      {result.dominantElement && (
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            Dominant Element
          </p>
          <p className="font-inter text-lg font-bold uppercase" style={{ color: G.text }}>
            {result.dominantElement.element.toUpperCase()}
          </p>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {Object.entries(result.dominantElement.counts).map(([elem, count]) => (
              <div key={elem} className="text-center">
                <p className="font-inter text-[9px] uppercase" style={{ color: G.dim }}>{elem}</p>
                <p className="font-inter text-sm font-bold" style={{ color: count === result.dominantElement.counts[result.dominantElement.element] ? G.text : "rgba(255,255,255,0.40)" }}>
                  {count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vefk Grid */}
      {result.grid && (
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
            Magic Square Grid ({result.size}×{result.size})
          </p>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${result.size}, 1fr)` }}>
            {result.grid.flatMap((row, i) =>
              row.map((val, j) => (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square flex items-center justify-center rounded-lg border font-inter text-sm font-bold"
                  style={{
                    background: "rgba(0,0,0,0.30)",
                    borderColor: G.faint,
                    color: G.text
                  }}
                >
                  {val}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: G.faint }}>
            <div>
              <p className="font-inter text-[9px] uppercase" style={{ color: G.dim }}>Planet</p>
              <p className="font-inter text-xs font-bold" style={{ color: G.text }}>{result.planet}</p>
            </div>
            <div>
              <p className="font-inter text-[9px] uppercase" style={{ color: G.dim }}>Day</p>
              <p className="font-inter text-xs font-bold" style={{ color: G.text }}>{result.day}</p>
            </div>
            <div>
              <p className="font-inter text-[9px] uppercase" style={{ color: G.dim }}>Kutru</p>
              <p className="font-inter text-xs font-bold" style={{ color: G.text }}>{result.kutru}</p>
            </div>
          </div>
        </div>
      )}

      {/* Letter Breakdown */}
      {result.breakdown && result.breakdown.length > 0 && (
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
            Letter Breakdown
          </p>
          <div className="flex flex-wrap gap-2">
            {result.breakdown.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border p-2 min-w-[60px] text-center"
                style={{ background: "rgba(0,0,0,0.30)", borderColor: G.faint }}
              >
                <p className="font-amiri text-xl mb-1" style={{ color: G.text, direction: "rtl" }}>{item.letter}</p>
                <p className="font-inter text-[9px] uppercase" style={{ color: G.dim }}>{item.element}</p>
                <p className="font-inter text-sm font-bold" style={{ color: G.text }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SirrCalculator({ bookData }) {
  const [calcType, setCalcType] = useState('METHOD_1');
  const [input, setInput] = useState('');
  const [bastLevel, setBastLevel] = useState(1);
  const [mizanOptions, setMizanOptions] = useState({
    talibName: '',
    matlubName: '',
    day: 'pazar',
    hour: 1,
    planet: 'sems',
    needType: 'celb',
    isDayTime: true,
    isHayir: true
  });
  const [vefkOptions, setVefkOptions] = useState({ size: 3, startValue: null });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = useCallback(() => {
    try {
      setError(null);
      let calcResult;

      switch (calcType) {
        case CALCULATION_TYPES.BAST:
          calcResult = executeCalculation(calcType, input, { bastLevel });
          break;
        case CALCULATION_TYPES.MIZAN:
          calcResult = executeCalculation(calcType, input, mizanOptions);
          break;
        case CALCULATION_TYPES.VEFK:
          calcResult = executeCalculation(calcType, input, vefkOptions);
          break;
        case CALCULATION_TYPES.ELEMENT:
          calcResult = executeCalculation(calcType, input);
          break;
        case CALCULATION_TYPES.ABJAD:
          calcResult = executeCalculation(calcType, input);
          break;
        default:
          throw new Error('Unknown calculation type');
      }

      setResult(calcResult);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  }, [calcType, input, bastLevel, mizanOptions, vefkOptions]);

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  const bookRules = getBookRules();

  return (
    <div className="space-y-4">
      {/* Book Info */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: G.bg, borderColor: G.faint }}
      >
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Active Engine
        </p>
        <p className="font-amiri text-lg font-bold" style={{ color: G.text }}>
          رِسَالَةِ صَمُورٍ هِنْدِي
        </p>
        <p className="font-inter text-[10px] uppercase tracking-wide mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
          {bookRules.source.title} — {bookRules.source.author}
        </p>
        <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
          {bookRules.calculationMethods.length} calculation methods from {bookRules.source.total_pages} pages
        </p>
      </div>

      {/* Calculation Type Selector */}
      <div>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Calculation Method
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CALC_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setCalcType(opt.id)}
              className={`p-3 rounded-xl border text-left ${calcType === opt.id ? 'selected' : ''}`}
              style={{
                background: calcType === opt.id ? G.bgHi : G.bg,
                borderColor: calcType === opt.id ? G.borderHi : G.faint,
              }}
            >
              <p className="font-inter text-[10px] font-bold uppercase tracking-wide" style={{ color: G.text }}>
                {opt.label}
              </p>
              <p className="font-inter text-[8px] mt-0.5" style={{ color: G.dim }}>
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div>
        <label className="block font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Input (Arabic / Turkish / Name)
        </label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCalculate()}
            placeholder="Enter text, name, or phrase..."
            className="flex-1 px-4 py-3 rounded-xl text-white focus:outline-none caret-white placeholder:text-white/30"
            style={{ background: G.bg, border: `1px solid ${G.faint}`, fontSize: '16px' }}
          />
          {input && (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-xl border font-inter text-[9px]"
              style={{ borderColor: G.error, color: "rgba(239,68,68,0.60)", background: "rgba(239,68,68,0.05)" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Method-Specific Options */}
      {calcType === 'METHOD_1' && (
        <SirrMethod1Analyzer />
      )}
      {calcType === CALCULATION_TYPES.BAST && (
        <>
          <BastLevelSelector level={bastLevel} setLevel={setBastLevel} />
          <button
            onClick={handleCalculate}
            disabled={!input.trim()}
            className="w-full py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-30 text-[#0d1b2a]"
            style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)" }}
          >
            Calculate — Apply Book Rules
          </button>
        </>
      )}
      {calcType === CALCULATION_TYPES.MIZAN && (
        <>
          <MizanOptions options={mizanOptions} setOptions={setMizanOptions} />
          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-xl font-inter font-bold text-sm text-[#0d1b2a]"
            style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)" }}
          >
            Calculate — Apply Book Rules
          </button>
        </>
      )}
      {calcType === CALCULATION_TYPES.VEFK && (
        <>
          <VefkOptions options={vefkOptions} setOptions={setVefkOptions} />
          <button
            onClick={handleCalculate}
            disabled={!input.trim()}
            className="w-full py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-30 text-[#0d1b2a]"
            style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)" }}
          >
            Calculate — Apply Book Rules
          </button>
        </>
      )}
      {calcType === CALCULATION_TYPES.ELEMENT && (
        <button
          onClick={handleCalculate}
          disabled={!input.trim()}
          className="w-full py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-30 text-[#0d1b2a]"
          style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)" }}
        >
          Calculate — Apply Book Rules
        </button>
      )}
      {calcType === CALCULATION_TYPES.ABJAD && (
        <button
          onClick={handleCalculate}
          disabled={!input.trim()}
          className="w-full py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-30 text-[#0d1b2a]"
          style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)" }}
        >
          Calculate — Apply Book Rules
        </button>
      )}

      {/* Error Display (non-METHOD_1 only) */}
      {error && calcType !== 'METHOD_1' && (
        <div
          className="rounded-xl border p-4"
          style={{ background: "rgba(239,68,68,0.05)", borderColor: G.error }}
        >
          <p className="font-inter text-sm" style={{ color: "rgba(239,68,68,0.80)" }}>
            {error}
          </p>
        </div>
      )}

      {/* Result Display (non-METHOD_1 only) */}
      {result && calcType !== 'METHOD_1' && <CalculationResult result={result} type={calcType} />}
    </div>
  );
}