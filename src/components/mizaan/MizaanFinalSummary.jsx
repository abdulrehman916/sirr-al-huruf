import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  MIZAAN_KHAYR_SHARR,
  MIZAAN_HOURS,
  MIZAAN_DAYS,
  MIZAAN_PLANETS_ALL,
  MIZAAN_PURPOSES,
  MIZAAN_ELEMENT_DEGREES,
} from "../../lib/mizaan9Data";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
};

const ELEMENT_META = {
  fire:  { arabic: "النار",  icon: "🔥", color: "#FF6B35" },
  earth: { arabic: "التراب", icon: "🌍", color: "#A5C880" },
  air:   { arabic: "الهواء", icon: "🌪",  color: "#B2EBF2" },
  water: { arabic: "الماء",  icon: "💧", color: "#4FC3F7" },
};

// Count Arabic letters (only Arabic Unicode range chars)
function countArabicLetters(str) {
  if (!str) return 0;
  return (str.match(/[\u0600-\u06FF]/g) || []).length;
}

function BreakdownRow({ label, arabic, bast, color, icon }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b"
      style={{ borderColor: "rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-2 min-w-0">
        {icon && <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>{icon}</span>}
        <span className="font-inter text-[9px] uppercase tracking-widest truncate"
          style={{ color: "rgba(255,255,255,0.30)" }}>{label}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {arabic && (
          <span className="font-amiri text-sm" dir="rtl"
            style={{ color: color || G.dim }}>{arabic}</span>
        )}
        {bast != null && (
          <span className="font-inter text-[10px] font-bold tabular-nums"
            style={{ color: G.text }}>{bast.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}

export default function MizaanFinalSummary({ result, selections, degreeSels = {}, inputText = "" }) {
  const { dominant, bastUlAval: inputBast = 0 } = result;

  const summary = useMemo(() => {
    const rows = [];
    let totalBast = inputBast;
    let totalLetters = countArabicLetters(inputText);

    // Mizaan 2 — Element
    const el = selections.elements?.[0];
    if (el && ELEMENT_META[el]) {
      const meta = ELEMENT_META[el];
      rows.push({ key: 'm2', label: 'Mizaan 2 · Element', arabic: meta.arabic, icon: meta.icon, bast: null, color: meta.color });
      totalLetters += countArabicLetters(meta.arabic);
    }

    // Mizaan 3 — Khayr / Sharr
    const ks = selections.khayrSharr;
    if (ks && MIZAAN_KHAYR_SHARR[ks]) {
      const d = MIZAAN_KHAYR_SHARR[ks];
      rows.push({ key: 'm3', label: 'Mizaan 3 · Khayr/Sharr', arabic: d.arabic, icon: d.icon, bast: d.bast, color: d.color });
      totalBast += d.bast;
      totalLetters += countArabicLetters(d.arabic);
    }

    // Mizaan 4 — Hour
    const hourEntry = MIZAAN_HOURS.find(h => h.hour === selections.hour);
    if (hourEntry) {
      rows.push({ key: 'm4', label: 'Mizaan 4 · Hour', arabic: hourEntry.arabic, icon: '🕐', bast: hourEntry.bast, color: G.text });
      totalBast += hourEntry.bast;
      totalLetters += countArabicLetters(hourEntry.arabic);
    }

    // Mizaan 5 — Day
    const dayEntry = MIZAAN_DAYS.find(d => d.key === selections.days);
    if (dayEntry) {
      rows.push({ key: 'm5', label: 'Mizaan 5 · Day', arabic: dayEntry.arabic, icon: dayEntry.icon, bast: dayEntry.bast, color: dayEntry.color });
      totalBast += dayEntry.bast;
      totalLetters += countArabicLetters(dayEntry.arabic);
    }

    // Mizaan 6 — Planet
    const planetEntry = MIZAAN_PLANETS_ALL.find(p => p.key === selections.planet);
    if (planetEntry) {
      rows.push({ key: 'm6', label: 'Mizaan 6 · Planet', arabic: planetEntry.arabic, icon: planetEntry.icon, bast: planetEntry.bast, color: planetEntry.color });
      totalBast += planetEntry.bast;
      totalLetters += countArabicLetters(planetEntry.arabic);
    }

    // Mizaan 7 — Purpose
    const purposeEntry = MIZAAN_PURPOSES.find(p => p.key === selections.purposes);
    if (purposeEntry) {
      rows.push({ key: 'm7', label: 'Mizaan 7 · Purpose', arabic: purposeEntry.arabic, icon: purposeEntry.icon, bast: purposeEntry.bast, color: purposeEntry.color });
      totalBast += purposeEntry.bast;
      totalLetters += countArabicLetters(purposeEntry.arabic);
    }

    // Mizaan 8 — Khayr/Sharr (second scale)
    const ks8 = selections.khayrSharr8;
    if (ks8) {
      const KHAYR_SHARR_8 = {
        khayr: { arabic: 'الخير', icon: '✨', bast: 2731, color: '#4ADE80' },
        sharr: { arabic: 'الشر',  icon: '⚡', bast: 2725, color: '#F87171' },
      };
      const d8 = KHAYR_SHARR_8[ks8];
      if (d8) {
        rows.push({ key: 'm8', label: 'Mizaan 8 · Khayr/Sharr', arabic: d8.arabic, icon: d8.icon, bast: d8.bast, color: d8.color });
        totalBast += d8.bast;
        totalLetters += countArabicLetters(d8.arabic);
      }
    }

    // Mizaan 9 — Selected degree (from primary element)
    const primaryEl = selections.elements?.[0] ?? dominant;
    if (primaryEl && degreeSels[primaryEl]) {
      const elData = MIZAAN_ELEMENT_DEGREES[primaryEl];
      const deg = elData?.degrees.find(d => d.key === degreeSels[primaryEl]);
      if (deg) {
        rows.push({ key: 'm9', label: 'Mizaan 9 · Degree', arabic: deg.arabic, icon: ELEMENT_META[primaryEl]?.icon, bast: deg.bast, color: ELEMENT_META[primaryEl]?.color });
        totalBast += deg.bast;
        totalLetters += countArabicLetters(deg.arabic);
      }
    }

    return { rows, totalBast, totalLetters };
  }, [result, selections, degreeSels, inputText, dominant, inputBast]);

  if (!dominant) return null;

  const elMeta = ELEMENT_META[dominant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border p-5 space-y-5"
      style={{
        background: "rgba(4,8,24,0.99)",
        borderColor: G.borderHi,
        boxShadow: `0 0 60px ${G.glowHi}, 0 0 120px ${G.glow}, 0 8px 32px rgba(0,0,0,0.60)`,
      }}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="font-inter text-[9px] uppercase tracking-[0.25em]" style={{ color: G.dim }}>
          ✦ Final Sacred Calculation ✦
        </p>
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}>
          الحاصل النهائي — النتيجة الكاملة
        </h2>
        <div className="h-px w-24 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
      </div>

      {/* Total Bast Hero */}
      <div className="rounded-2xl border p-5 text-center space-y-1"
        style={{ background: "rgba(212,175,55,0.05)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
        <p className="font-inter text-[8px] uppercase tracking-[0.3em]" style={{ color: G.dim }}>
          Total Bast-ul Aval
        </p>
        <motion.p
          className="font-amiri font-bold tabular-nums leading-none"
          style={{
            fontSize: "clamp(3rem, 12vw, 5rem)",
            color: G.text,
            textShadow: `0 0 30px ${G.glowHi}, 0 0 60px ${G.glow}`,
          }}
          animate={{
            textShadow: [
              `0 0 24px ${G.glowHi}`,
              `0 0 48px rgba(212,175,55,0.80)`,
              `0 0 24px ${G.glowHi}`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {summary.totalBast.toLocaleString()}
        </motion.p>
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.40)" }}>
          مجموع الأوزان
        </p>
      </div>

      {/* Total Letter Count + Dominant Element */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-3 text-center space-y-1"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(212,175,55,0.20)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Total Huruf</p>
          <p className="font-amiri text-3xl font-bold tabular-nums" style={{ color: G.text }}>
            {summary.totalLetters}
          </p>
          <p className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>Total Letters</p>
        </div>
        <div className="rounded-xl border p-3 text-center space-y-1"
          style={{ background: elMeta ? `${elMeta.color}0D` : "rgba(255,255,255,0.02)", borderColor: elMeta ? `${elMeta.color}44` : "rgba(255,255,255,0.10)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Dominant</p>
          <p className="text-2xl leading-none">{elMeta?.icon ?? "◈"}</p>
          <p className="font-amiri text-base font-bold" style={{ color: elMeta?.color ?? G.text }}>{elMeta?.arabic ?? dominant}</p>
        </div>
      </div>

      {/* Breakdown */}
      {summary.rows.length > 0 && (
        <div className="space-y-0 rounded-xl border overflow-hidden"
          style={{ borderColor: "rgba(212,175,55,0.15)", background: "rgba(4,10,28,0.98)" }}>
          <div className="px-4 py-2" style={{ background: "rgba(212,175,55,0.06)", borderBottom: `1px solid rgba(212,175,55,0.12)` }}>
            <p className="font-inter text-[8px] uppercase tracking-[0.25em]" style={{ color: G.dim }}>
              Selected Mizaan Breakdown
            </p>
          </div>
          <div className="px-4 py-1 divide-y" style={{ divideColor: "transparent" }}>
            {summary.rows.map(row => (
              <BreakdownRow key={row.key} {...row} />
            ))}
          </div>
        </div>
      )}

      {/* Sacred Seal Footer */}
      <div className="text-center pt-1">
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border"
          style={{ background: G.bg, borderColor: G.borderHi }}
          animate={{ boxShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
          <span className="font-inter text-[9px] uppercase tracking-[0.3em]" style={{ color: G.dim }}>
            9 Mizaan · Complete
          </span>
          <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
        </motion.div>
      </div>
    </motion.div>
  );
}