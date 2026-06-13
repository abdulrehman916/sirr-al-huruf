import { motion } from "framer-motion";

// ── Section 4: KASAM (القسم) ──────────────────────────────────────────────────
// COMPLETELY ISOLATED — reads no data from Sections 1, 2, or 3.
// No calculations, no engine calls. Placeholder for future Kasam logic.
// ─────────────────────────────────────────────────────────────────────────────

const G = {
  bg:           "rgba(5, 12, 28, 0.97)",
  bgInner:      "rgba(10, 20, 45, 0.95)",
  gold:         "#D4AF37",
  goldDim:      "rgba(212,175,55,0.65)",
  goldBorder:   "rgba(212,175,55,0.22)",
  goldBorderHi: "rgba(212,175,55,0.48)",
  goldFaint:    "rgba(212,175,55,0.06)",
  glow:         "rgba(212,175,55,0.10)",
  dim:          "rgba(255,255,255,0.35)",
};

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: G.goldBorder }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.goldFaint, border: `1px solid ${G.goldBorder}` }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: G.goldBorder }} />
      <div style={{ width: 40, height: 0.5, background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

export default function KasamSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* Top accent line */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />

      {/* Title Banner */}
      <div className="text-center px-6 pt-6 pb-4">
        <div
          className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}
        >
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>
            Section 4 — Kasam
          </span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2
          className="font-amiri text-xl font-bold"
          style={{ color: G.gold, lineHeight: 1.7, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}
        >
          القسم
        </h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>
          Kasam — Awaiting Implementation
        </p>
      </div>

      <OrnamentalDivider />

      {/* Placeholder body */}
      <div className="px-4 pb-6 pt-2">
        <div
          className="rounded-2xl border flex flex-col items-center justify-center py-12 gap-3"
          style={{ background: G.bgInner, borderColor: G.goldBorder, borderStyle: "dashed" }}
        >
          <span className="font-amiri text-4xl" style={{ color: G.goldDim }}>☽</span>
          <p className="font-inter text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: G.goldDim }}>
            القسم
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.22)" }}>
            Kasam logic — coming soon
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)`
      }} />
    </motion.div>
  );
}