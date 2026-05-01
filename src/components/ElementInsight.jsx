import { motion } from "framer-motion";

const INSIGHTS = {
  fire: {
    title: "Power & Energy",
    description: "This text carries the energy of fire — dominance, willpower, and transformative strength. Those aligned with this element possess natural leadership and burning drive.",
    traits: ["Dominant", "Energetic", "Transformative", "Courageous"],
    color: "#ff6a00",
    glow: "rgba(255,60,0,0.15)",
    border: "rgba(255,60,0,0.25)",
  },
  air: {
    title: "Intelligence & Knowledge",
    description: "The air element governs the realm of thought. This text is imbued with clarity, swift thinking, and the power of communication and learning.",
    traits: ["Intellectual", "Communicative", "Swift", "Perceptive"],
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.25)",
  },
  water: {
    title: "Emotion & Spirituality",
    description: "Water flows with deep emotion and spiritual resonance. This text holds a reflective, intuitive power — connected to the unseen and the heart.",
    traits: ["Intuitive", "Spiritual", "Empathetic", "Deep"],
    color: "#0ea5e9",
    glow: "rgba(14,165,233,0.12)",
    border: "rgba(14,165,233,0.25)",
  },
  earth: {
    title: "Stability & Grounding",
    description: "Earth energy brings solidity and endurance. This text reflects permanence, patience, and a deep connection to the material and the real.",
    traits: ["Stable", "Patient", "Grounded", "Enduring"],
    color: "#22c55e",
    glow: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
  },
};

const ELEMENT_ICONS = { fire: "🔥", air: "💨", water: "💧", earth: "🌍" };

export default function ElementInsight({ dominant }) {
  if (!dominant) return null;
  const insight = INSIGHTS[dominant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border p-5"
      style={{
        background: `linear-gradient(180deg, ${insight.glow} 0%, rgba(0,0,0,0) 100%)`,
        borderColor: insight.border,
        boxShadow: `0 0 20px ${insight.glow}`,
      }}
    >
      <p className="font-inter text-[10px] text-white/35 uppercase tracking-widest mb-3">Element Insight</p>
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{ELEMENT_ICONS[dominant]}</span>
        <div>
          <p className="font-inter font-semibold text-sm mb-1" style={{ color: insight.color }}>{insight.title}</p>
          <p className="font-inter text-xs text-white/55 leading-relaxed">{insight.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {insight.traits.map((t) => (
          <span key={t} className="font-inter text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border"
            style={{ color: insight.color, borderColor: insight.border, background: insight.glow }}>
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}