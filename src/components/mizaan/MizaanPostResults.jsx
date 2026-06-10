import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runMizaanPostPipeline, ELEMENT_BAST_TOTALS } from "../../lib/mizaanPostEngine";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

const ELEMENT_META = {
  fire:  { arabic: "النار",  icon: "🔥", color: "#FF6B35", glow: "rgba(255,107,53,0.35)", bg: "rgba(255,107,53,0.10)", border: "rgba(255,107,53,0.50)" },
  earth: { arabic: "التراب", icon: "🌍", color: "#A5C880", glow: "rgba(165,200,128,0.35)", bg: "rgba(165,200,128,0.10)", border: "rgba(165,200,128,0.50)" },
  air:   { arabic: "الهواء", icon: "🌪",  color: "#B2EBF2", glow: "rgba(178,235,242,0.35)", bg: "rgba(178,235,242,0.10)", border: "rgba(178,235,242,0.50)" },
  water: { arabic: "الماء",  icon: "💧", color: "#4FC3F7", glow: "rgba(79,195,247,0.35)", bg: "rgba(79,195,247,0.10)", border: "rgba(79,195,247,0.50)" },
};

function SectionHeader({ label, arabic, isOpen, onToggle, color }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border"
      style={{ background: isOpen ? "rgba(212,175,55,0.08)" : "rgba(4,10,28,0.97)", borderColor: isOpen ? G.borderHi : G.border }}
    >
      <div className="flex items-center gap-2">
        <span className="font-amiri text-base" style={{ color: color || G.text }}>{arabic}</span>
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</span>
      </div>
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
        className="font-inter text-xs" style={{ color: G.dim }}>▼</motion.span>
    </button>
  );
}

function StatRow({ label, value, mono = true }) {
  return (
    <div className="flex items-center justify-between py-1 border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
      <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</span>
      <span className={mono ? "font-inter text-xs font-bold tabular-nums" : "font-amiri text-base"} style={{ color: G.text }}>{value}</span>
    </div>
  );
}

function NameBadge({ name, prefix, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border"
      style={{ background: "rgba(212,175,55,0.06)", borderColor: G.border }}>
      {prefix && <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{prefix}</span>}
      <span className="font-amiri text-lg" dir="rtl" style={{ color: color || G.text }}>{name}</span>
    </div>
  );
}

function SeedStep({ data, label }) {
  return (
    <div className="space-y-2">
      <StatRow label="Satır Vahid Total" value={(data.bastSum + data.letterCount).toLocaleString()} />
      <StatRow label="First Bast Sum" value={data.bastSum.toLocaleString()} />
      <StatRow label="+ Letter Count" value={data.letterCount} />
      <StatRow label="= Istintak Input" value={(data.bastSum + data.letterCount).toLocaleString()} />
      <div className="flex items-center justify-between py-1">
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Seed Letters</span>
        <div className="flex gap-1 flex-wrap justify-end">
          {[...data.seedLetters].reverse().map((l, i) => (
            <span key={i} className="font-amiri text-lg px-1.5 py-0.5 rounded border"
              style={{ color: G.text, borderColor: G.border, background: G.bg }}>{l}</span>
          ))}
        </div>
      </div>
      <StatRow label="Seed Count" value={`${data.seedCount} → ${data.isZevc ? 'ZEVC (even)' : 'FERD (odd)'}`} />
      <StatRow label="Bast Level Used" value={`${data.bastLevelUsed}${data.bastLevelUsed === 5 && label === 'Kasem' ? ' (always 5th for Kasem)' : ''}`} />
    </div>
  );
}

function EsmaSection({ data, tierLabel, aziметPrefix, color, isOpen, onToggle }) {
  const el = ELEMENT_META;
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: G.border, background: "rgba(4,8,24,0.99)" }}>
      <SectionHeader label={tierLabel} arabic={
        tierLabel === 'Esma-i Kitabet' ? 'أسماء الكتابة' :
        tierLabel === 'Esma-i Avan'    ? 'أسماء الأعوان' :
        'أسماء القسم'
      } isOpen={isOpen} onToggle={onToggle} color={color} />
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <SeedStep data={data} label={tierLabel.split('-i ')[1]} />
              <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
              {/* Expanded letters */}
              <div>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                  Expanded Letters ({data.expandedCount}) → {data.isExpandedZevc ? `Groups of 4` : `Groups of 5`}
                </p>
                <div className="flex flex-wrap gap-1">
                  {[...data.expandedLetters].reverse().map((l, i) => (
                    <span key={i} className="font-amiri text-base px-1 rounded"
                      style={{ color: "rgba(255,255,255,0.60)", background: "rgba(255,255,255,0.04)" }}>{l}</span>
                  ))}
                </div>
              </div>
              {/* Names */}
              <div>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                  {tierLabel} Names ({data.names.length})
                  {tierLabel === 'Esma-i Kitabet' && (
                    <span className="ml-2 opacity-60">· Vefk only — not in Azimet</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.names.map((name, i) => (
                    <NameBadge key={i} name={name} prefix={aziметPrefix} color={color} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VefkGrid({ vefk, element }) {
  const meta = ELEMENT_META[element] || ELEMENT_META.fire;
  return (
    <div className="space-y-3">
      {/* Guardian name */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl border"
        style={{ background: G.bg, borderColor: G.borderHi }}>
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Guardian Name (4 borders)</span>
        <span className="font-amiri text-xl" dir="rtl" style={{ color: meta.color }}>{vefk.guardianName}</span>
      </div>
      {/* Stats */}
      <div className="space-y-1">
        <StatRow label="Input (S)" value={vefk.S.toLocaleString()} />
        <StatRow label="S − 30" value={(vefk.S - 30).toLocaleString()} />
        <StatRow label="÷ 4 = Q" value={vefk.Q.toLocaleString()} />
        <StatRow label="Remainder R" value={`${vefk.R} ${vefk.R === 0 ? '(no correction)' : `→ Cell ${vefk.R === 3 ? 5 : vefk.R === 2 ? 9 : 13} +1`}`} />
        <StatRow label="Magic Constant" value={vefk.mc.toLocaleString()} />
      </div>
      {/* Grid */}
      <div>
        <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          {element.charAt(0).toUpperCase() + element.slice(1)} Element Vefk Grid
        </p>
        <div className="grid grid-cols-4 gap-1 max-w-xs mx-auto">
          {vefk.grid.flat().map((val, i) => (
            <div key={i} className="aspect-square flex items-center justify-center rounded-lg border font-inter text-xs font-bold tabular-nums"
              style={{
                background: "rgba(212,175,55,0.06)",
                borderColor: G.border,
                color: G.text,
                fontSize: "0.65rem",
              }}>
              {val.toLocaleString()}
            </div>
          ))}
        </div>
        <p className="font-inter text-[8px] text-center mt-2 uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.35)" }}>
          Each row · column · diagonal = {vefk.mc.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function AziметSection({ kasem, avan }) {
  return (
    <div className="space-y-3">
      <p className="font-inter text-[9px] text-center uppercase tracking-widest" style={{ color: G.dim }}>
        Insert into Azimet template
      </p>
      <div className="space-y-2">
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(79,195,247,0.80)" }}>
            Esma-i Avan — prefix each with يا (Yâ)
          </p>
          <div className="flex flex-wrap gap-2">
            {avan.names.map((name, i) => (
              <NameBadge key={i} name={`يا ${name}`} color="#B2EBF2" />
            ))}
          </div>
        </div>
        <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(212,175,55,0.80)" }}>
            Esma-i Kasem — prefix each with بحق (Bi hakki)
          </p>
          <div className="flex flex-wrap gap-2">
            {kasem.names.map((name, i) => (
              <NameBadge key={i} name={`بحق ${name}`} color={G.text} />
            ))}
          </div>
        </div>
        <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
        <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,255,255,0.30)" }}>
          Esma-i Kitabet is NOT included in the Azimet
        </p>
      </div>
    </div>
  );
}

export default function MizaanPostResults({ grandBast, grandLetters, dominant }) {
  const pipeline = useMemo(() => {
    if (!grandBast || grandBast <= 0) return null;
    return runMizaanPostPipeline({ grandBast, grandLetters, dominant });
  }, [grandBast, grandLetters, dominant]);

  const [open, setOpen] = useState({
    main: true,
    kitabet: false,
    avan: false,
    kasem: false,
    vefk: false,
    azimet: false,
  });
  const toggle = (k) => setOpen(prev => ({ ...prev, [k]: !prev[k] }));

  if (!pipeline) return null;

  const { element, vefk, kitabet, avan, kasem, input, initialSeedLetters } = pipeline;
  const meta = ELEMENT_META[element] || ELEMENT_META.fire;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(3,6,20,0.99)", borderColor: G.borderHi, boxShadow: `0 0 60px ${G.glow}, 0 0 120px rgba(0,0,0,0.6)` }}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="font-inter text-[9px] uppercase tracking-[0.25em]" style={{ color: G.dim }}>✦ Post-Mizan Sacred Pipeline ✦</p>
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}>أسماء الكتابة والأعوان والقسم</h2>
        <div className="h-px w-24 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
        <div className="flex items-center justify-center gap-2">
          <span style={{ fontSize: "1.2rem" }}>{meta.icon}</span>
          <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: meta.color }}>
            Galip Anasır — {element} — {meta.arabic}
          </span>
        </div>
      </div>

      {/* Pipeline overview — always visible */}
      <button onClick={() => toggle('main')}
        className="w-full rounded-xl border px-4 py-3 flex items-center justify-between"
        style={{ background: open.main ? G.bg : "rgba(4,10,28,0.97)", borderColor: open.main ? G.borderHi : G.border }}>
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Pipeline Input</span>
        <motion.span animate={{ rotate: open.main ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="font-inter text-xs" style={{ color: G.dim }}>▼</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open.main && (
          <motion.div key="main" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
            <div className="px-4 space-y-2 pb-2">
              <StatRow label="Grand Bast (Σ 9 Mizans)" value={input.grandBast.toLocaleString()} />
              <StatRow label="Grand Letters (Σ 9 Mizans)" value={input.grandLetters} />
              <StatRow label="Satır Vahid Total" value={input.satirVahidTotal.toLocaleString()} />
              <div className="flex items-center justify-between py-1">
                <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Initial Seed Letters</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {[...initialSeedLetters].reverse().map((l, i) => (
                    <span key={i} className="font-amiri text-lg px-1.5 py-0.5 rounded border"
                      style={{ color: G.text, borderColor: G.border, background: G.bg }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Esma-i Kitabet */}
      <EsmaSection data={kitabet} tierLabel="Esma-i Kitabet" aziметPrefix="" color="#C4B5FD"
        isOpen={open.kitabet} onToggle={() => toggle('kitabet')} />

      {/* Esma-i Avan */}
      <EsmaSection data={avan} tierLabel="Esma-i Avan" aziметPrefix="يا" color="#B2EBF2"
        isOpen={open.avan} onToggle={() => toggle('avan')} />

      {/* Esma-i Kasem */}
      <EsmaSection data={kasem} tierLabel="Esma-i Kasem" aziметPrefix="بحق" color={G.text}
        isOpen={open.kasem} onToggle={() => toggle('kasem')} />

      {/* Vefk */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: meta.border, background: "rgba(4,8,24,0.99)" }}>
        <SectionHeader label="Vefk — Magic Square" arabic="الوفق" isOpen={open.vefk} onToggle={() => toggle('vefk')} color={meta.color} />
        <AnimatePresence initial={false}>
          {open.vefk && (
            <motion.div key="vefk" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              <div className="px-4 pb-4 pt-2">
                <VefkGrid vefk={vefk} element={element} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Azimet */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: G.borderHi, background: "rgba(4,8,24,0.99)" }}>
        <SectionHeader label="Azimet Assembly" arabic="العزيمة" isOpen={open.azimet} onToggle={() => toggle('azimet')} color={G.text} />
        <AnimatePresence initial={false}>
          {open.azimet && (
            <motion.div key="azimet" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              <div className="px-4 pb-4 pt-2">
                <AziметSection kasem={kasem} avan={avan} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer seal */}
      <div className="text-center pt-1">
        <motion.div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border"
          style={{ background: G.bg, borderColor: G.borderHi }}
          animate={{ boxShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
          <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
          <span className="font-inter text-[9px] uppercase tracking-[0.3em]" style={{ color: G.dim }}>
            Kitabet · Avan · Kasem · Vefk
          </span>
          <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
        </motion.div>
      </div>
    </motion.div>
  );
}