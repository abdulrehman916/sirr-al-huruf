import React from "react";
import { motion } from "framer-motion";

export default function HadimTypePanel({ result }) {
  const typeColors = {
    ulvi: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.40)', glow: 'rgba(59,130,246,0.30)', text: '#3b82f6' },
    sufli: { bg: 'rgba(132,204,22,0.15)', border: 'rgba(132,204,22,0.40)', glow: 'rgba(132,204,22,0.30)', text: '#84cc16' },
    sherli: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.40)', glow: 'rgba(239,68,68,0.30)', text: '#ef4444' }
  };

  const typeNames = {
    ulvi: 'Ulvi (Celestial)',
    sufli: 'Sufli (Terrestrial)',
    sherli: 'Sherli (Lion)'
  };

  const colors = typeColors[result.hadimType] || typeColors.ulvi;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border p-5 backdrop-blur-sm"
      style={{
        background: colors.bg,
        borderColor: colors.border,
        boxShadow: `0 4px 24px ${colors.glow}`
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-inter text-[10px] uppercase tracking-widest mb-1 font-semibold" style={{ color: colors.text }}>
            Hadim Type
          </p>
          <p className="font-amiri text-2xl font-bold text-white">
            {typeNames[result.hadimType]}
          </p>
          <p className="font-inter text-xs text-white/55 mt-1">
            Grand Total: {result.grandTotal}
          </p>
        </div>
        <span className="font-amiri text-5xl opacity-15" style={{ color: colors.text }}>
          {result.ceremonialName.charAt(0)}
        </span>
      </div>
    </motion.div>
  );
}