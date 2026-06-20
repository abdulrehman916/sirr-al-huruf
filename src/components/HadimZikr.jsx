import React from "react";
import { motion } from "framer-motion";

export default function HadimZikr({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border p-5 backdrop-blur-sm"
      style={{
        background: "linear-gradient(145deg, rgba(251,191,36,0.10) 0%, rgba(251,191,36,0.05) 100%)",
        borderColor: "rgba(251,191,36,0.30)",
        boxShadow: "0 4px 24px rgba(251,191,36,0.15)"
      }}
    >
      <div className="text-center space-y-3">
        <p className="font-inter text-[10px] uppercase tracking-widest text-amber-400/70 font-semibold">
          Zikr (Dhikr) Count
        </p>
        <p className="font-amiri text-5xl font-bold text-white">
          {result.zikrCount}
        </p>
        <p className="font-inter text-xs text-white/55">
          Recommended repetitions for spiritual practice
        </p>
      </div>
    </motion.div>
  );
}