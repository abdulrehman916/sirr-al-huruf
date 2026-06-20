import React from "react";
import { motion } from "framer-motion";
import { Star, Flame, Circle } from "lucide-react";

export default function HadimTypePanel({ result }) {
  const MODE_ICONS = {
    ulvi: { icon: Star, color: '#FFD700', label: 'ULVI', arabic: 'علوي' },
    sufli: { icon: Flame, color: '#FF6B35', label: 'SUFLI', arabic: 'سفلي' },
    sherli: { icon: Circle, color: '#9B7FD4', label: 'SHERLI', arabic: 'شرلي' },
  };

  const modeData = MODE_ICONS[result.hadimType] || MODE_ICONS.ulvi;
  const Icon = modeData.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border p-5 backdrop-blur-sm"
      style={{
        background: `rgba(106,90,205,0.10)`,
        borderColor: modeData.color,
        boxShadow: `0 4px 24px rgba(106,90,205,0.30)`
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8" style={{ color: modeData.color }} />
          <div>
            <p className="font-inter text-[10px] uppercase tracking-widest mb-1 font-semibold" style={{ color: modeData.color }}>
              {modeData.label}
            </p>
            <p className="font-amiri text-xl font-bold text-white">
              {modeData.arabic}
            </p>
            <p className="font-inter text-xs text-white/55 mt-1">
              Grand Total: {result.grandTotal}
            </p>
          </div>
        </div>
        <span className="font-amiri text-4xl opacity-20" style={{ color: modeData.color }}>
          {result.ceremonialName.charAt(0) || '✦'}
        </span>
      </div>
    </motion.div>
  );
}