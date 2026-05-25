import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

function ManuscriptCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="rounded-2xl border p-5 space-y-3"
      style={{
        background: "rgba(6,12,32,0.97)",
        borderColor: G.borderHi,
        boxShadow: `0 0 32px ${G.glow}, 0 4px 24px rgba(0,0,0,0.50)`,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ arabic, latin }) {
  return (
    <div className="text-center space-y-1 mb-4">
      <motion.h2
        className="font-amiri text-2xl font-bold"
        style={{ color: G.text, textShadow: `0 0 20px ${G.glowHi}` }}
        animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {arabic}
      </motion.h2>
      {latin && (
        <p className="font-inter text-[9px] uppercase tracking-[0.28em]" style={{ color: G.dim }}>
          {latin}
        </p>
      )}
      <GoldDivider />
    </div>
  );
}

// ── 5×5 Empty-Center Grid ─────────────────────────────────────────
const GRID_5x5 = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

function Vefk5x5Grid() {
  const flat = GRID_5x5.flat();
  return (
    <div className="flex justify-center">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 52px)", gap: "4px" }}>
        {flat.map((num, idx) => {
          const isEmpty = num === null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02, duration: 0.22 }}
              className="rounded-lg border flex items-center justify-center font-amiri font-bold"
              style={{
                width: 52,
                height: 52,
                fontSize: "15px",
                background: isEmpty
                  ? "rgba(212,175,55,0.03)"
                  : "rgba(212,175,55,0.10)",
                borderColor: isEmpty
                  ? "rgba(212,175,55,0.15)"
                  : "rgba(212,175,55,0.45)",
                color: isEmpty ? "transparent" : G.text,
                boxShadow: isEmpty
                  ? `inset 0 0 14px rgba(212,175,55,0.06)`
                  : `inset 0 0 10px rgba(212,175,55,0.12), 0 0 6px rgba(212,175,55,0.08)`,
                position: "relative",
              }}
            >
              {isEmpty ? (
                <motion.span
                  className="font-amiri"
                  style={{ fontSize: "1.3rem", color: "rgba(212,175,55,0.18)" }}
                  animate={{ opacity: [0.12, 0.45, 0.12] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  □
                </motion.span>
              ) : num}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Sequence Steps ────────────────────────────────────────────────
function StepRow({ step, label, value, highlight, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.28 }}
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{
        background: highlight ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.04)",
        border: `1px solid ${highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)"}`,
        boxShadow: highlight ? `0 0 14px rgba(212,175,55,0.15)` : "none",
      }}
    >
      <span className="font-inter text-sm flex-shrink-0" style={{ color: "rgba(212,175,55,0.45)" }}>{step}</span>
      <div className="flex-1 min-w-0">
        <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,175,55,0.35)" }}>{label}</p>
        <p className="font-amiri font-bold leading-snug"
          style={{
            color: highlight ? G.text : "rgba(212,175,55,0.80)",
            fontSize: highlight ? "1.15rem" : "0.95rem",
            textShadow: highlight ? `0 0 14px ${G.glowHi}` : "none",
          }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

export default function VefkinYapilisiPage() {
  return (
    <PageLayout>
      <div className="space-y-6">

        {/* ── Page Header ────────────────────────────────── */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>📜</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">طريقة عمل الوفق</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>
            Vefkin Yapılışı — Ottoman Manuscript Method
          </p>
          <GoldDivider />
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* SECTION 1 — BEŞLİ VEFK 2. USÛL              */}
        {/* ══════════════════════════════════════════════ */}
        <ManuscriptCard delay={0.1}>
          <SectionTitle arabic="الوفق الخماسي — الطريقة الثانية" latin="BEŞLİ VEFK — 2. USÛL" />

          {/* Grid */}
          <Vefk5x5Grid />

          <div className="h-px w-full mt-4" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />

          {/* Center explanation */}
          <div className="space-y-2 pt-1">
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              🕳 Merkez Hane — الهانة المركزية
            </p>
            {[
              { icon: "✦", text: "Bu vefkin 24 aktif hanesi vardır", sub: "This vefk has 24 active houses" },
              { icon: "🌑", text: "Merkez hane gizli ve ruhani bir noktadır", sub: "The center is a secret spiritual point" },
              { icon: "∅", text: "Merkez hane toplama dahil edilmez", sub: "The center is NOT counted in totals" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 rounded-xl px-4 py-2.5"
                style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.10)" }}
              >
                <span className="font-amiri text-base flex-shrink-0 mt-0.5" style={{ color: G.dim }}>{item.icon}</span>
                <div>
                  <p className="font-amiri text-base" style={{ color: G.text }} dir="rtl">{item.text}</p>
                  <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center may contain */}
          <div className="rounded-xl border p-4 mt-2 space-y-2"
            style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              ✨ Merkez Haneye Yazılabilir
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { ar: "الاسم المطلوب", tr: "Hedef İsim" },
                { ar: "النية", tr: "Niyet" },
                { ar: "الآية الكريمة", tr: "Ayet-i Kerime" },
                { ar: "الاسم الإلهي", tr: "Esma-i İlahiye" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-center"
                  style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <p className="font-amiri text-sm font-bold" style={{ color: G.text }} dir="rtl">{item.ar}</p>
                  <p className="font-inter text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "rgba(212,175,55,0.45)" }}>{item.tr}</p>
                </div>
              ))}
            </div>
          </div>
        </ManuscriptCard>

        {/* ══════════════════════════════════════════════ */}
        {/* SECTION 2 — VEFKİN YAPILIŞI                  */}
        {/* ══════════════════════════════════════════════ */}
        <ManuscriptCard delay={0.2}>
          <SectionTitle arabic="طريقة عمل الوفق" latin="VEFKİN YAPILIŞI — OTTOMAN METHOD" />

          <div className="space-y-2">
            {[
              { step: "①", label: "Birinci Hane Kuralı", value: "İlk haneye başlangıç sayısı yazılır", sub: "First house receives the base number" },
              { step: "②", label: "Tabiî Sıralama", value: "Her hane doğal sırayla çarpılır", sub: "Every house is multiplied by its natural order" },
              { step: "③", label: "20. Hane Kuralı", value: "20. haneden sonra 40 çıkarılır", sub: "After the 20th house, subtract 40" },
              { step: "④", label: "Devam Eden Artış", value: "21. haneden itibaren artış sürer", sub: "From the 21st house onward, values continue increasing" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.28 }}
                className="rounded-xl px-4 py-3"
                style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}
              >
                <div className="flex items-start gap-3">
                  <span className="font-inter text-sm flex-shrink-0 mt-0.5" style={{ color: "rgba(212,175,55,0.45)" }}>{item.step}</span>
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,175,55,0.35)" }}>{item.label}</p>
                    <p className="font-amiri text-base font-bold" style={{ color: G.text }} dir="rtl">{item.value}</p>
                    <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>{item.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ManuscriptCard>

        {/* ══════════════════════════════════════════════ */}
        {/* SECTION 3 — ANIMATED EXAMPLE                  */}
        {/* ══════════════════════════════════════════════ */}
        <ManuscriptCard delay={0.3}>
          <SectionTitle arabic="مثال عملي" latin="ÖRNEK HESAP — LIVE EXAMPLE" />

          <div className="rounded-xl border p-4 text-center mb-4"
            style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.35)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>İlk Sayı — Birinci Hane</p>
            <motion.p
              className="font-amiri text-5xl font-bold mt-1"
              style={{ color: G.text, textShadow: `0 0 24px ${G.glowHi}` }}
              animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 32px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              90
            </motion.p>
          </div>

          <div className="space-y-2">
            <StepRow step="①" label="1. Hane" value="90" delay={0.35} />
            <StepRow step="②" label="2. Hane" value="91" delay={0.40} />
            <StepRow step="⋯" label="Devam eder..." value="92, 93, 94 …" delay={0.45} />
            <StepRow step="⑳" label="20. Hane — 40 çıkar" value="90 + 19 = 109  →  109 − 40 = 69... sonraki hanelere 51'den devam" delay={0.50} highlight />
            <StepRow step="㉑" label="21. Hane" value="51 × temel sayı" delay={0.55} />
            <StepRow step="㉒" label="22. Hane" value="52 × temel sayı" delay={0.60} />
            <StepRow step="㉓" label="23. Hane" value="53 × temel sayı" delay={0.65} highlight />
          </div>

          <div className="h-px w-full mt-3" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="rounded-xl border p-4 mt-3 text-center"
            style={{ background: "rgba(212,175,55,0.05)", borderColor: "rgba(212,175,55,0.28)" }}
          >
            <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              📜 Ottoman Vefk Kuralı
            </p>
            <p className="font-amiri text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }} dir="rtl">
              كل هانة تُكتب بحسب الترتيب الطبيعي مضروبةً في رقمها
            </p>
            <p className="font-inter text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              Each house is written according to natural order multiplied by its number
            </p>
          </motion.div>
        </ManuscriptCard>

        {/* ── Sacred Footer ─────────────────────────────── */}
        <div className="text-center pb-4">
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border"
            style={{ background: G.bg, borderColor: G.borderHi }}
            animate={{ boxShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
            <span className="font-inter text-[9px] uppercase tracking-[0.3em]" style={{ color: G.dim }}>
              Vefkin Yapılışı · Complete
            </span>
            <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
          </motion.div>
        </div>

      </div>
    </PageLayout>
  );
}