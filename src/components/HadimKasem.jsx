import React from "react";
import { motion } from "framer-motion";

export default function HadimKasem({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border p-5 backdrop-blur-sm"
      style={{
        background: "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.05) 100%)",
        borderColor: "rgba(212,175,55,0.30)",
        boxShadow: "0 4px 24px rgba(212,175,55,0.15)"
      }}
    >
      <div className="space-y-3">
        <p className="font-inter text-[10px] uppercase tracking-widest text-amber-400/70 font-semibold">
          Kasem (Oath Formula)
        </p>
        <div className="rounded-xl p-4"
          style={{
            background: "rgba(20,14,6,0.60)",
            border: "1px solid rgba(212,175,55,0.20)"
          }}>
          <p className="font-amiri text-lg text-white/90 text-center leading-relaxed" dir="rtl">
            {result.kasem}
          </p>
        </div>
        <p className="font-inter text-[9px] text-white/40 text-center">
          Ceremonial name: {result.ceremonialName} • Mode: {result.mode.toUpperCase()}
        </p>
      </div>
    </motion.div>
  );
}