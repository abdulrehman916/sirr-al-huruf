import { useState } from "react";
import { motion } from "framer-motion";

const ASMA = ["الله", "الرحمن", "الملك", "القدوس", "السلام", "المؤمن", "العزيز", "الجبار"];

// Cosmic star particle
function Star({ style }) {
  return <div className="absolute rounded-full bg-white" style={style} />;
}

function CosmicBackground() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    width: Math.random() * 2.5 + 0.5,
    height: Math.random() * 2.5 + 0.5,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.7 + 0.1,
    animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 4}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => <Star key={i} style={s} />)}
      {/* Gold light rays */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 70%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 30% 60% at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 30% 60% at 70% 50%, rgba(56,189,248,0.06) 0%, transparent 60%)"
      }} />
    </div>
  );
}

function SacredGeometry() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: 340, height: 340,
          border: "1px solid rgba(212,175,55,0.15)",
          borderRadius: "50%",
        }}
      />
      {/* Middle counter-rotating ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: 260, height: 260,
          border: "1px solid rgba(212,175,55,0.20)",
          borderRadius: "50%",
          borderStyle: "dashed",
        }}
      />
      {/* Inner ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: 190, height: 190,
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: "50%",
        }}
      />
      {/* Hexagram lines (Star of creation) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: 300, height: 300,
          border: "0.5px solid rgba(212,175,55,0.08)",
          borderRadius: "50%",
          backgroundImage: `
            repeating-conic-gradient(
              rgba(212,175,55,0.04) 0deg, rgba(212,175,55,0.04) 1deg,
              transparent 1deg, transparent 30deg
            )
          `,
        }}
      />
      {/* Center pulse glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          width: 100, height: 100,
          background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function FloatingAsma() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {ASMA.map((name, i) => {
        const angle = (i / ASMA.length) * 2 * Math.PI - Math.PI / 2;
        const radius = 155;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.6 }}
            className="absolute"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              className="font-amiri text-xs sm:text-sm font-bold text-center px-2 py-1 rounded-lg"
              style={{
                color: "rgba(212,175,55,0.85)",
                background: "rgba(212,175,55,0.06)",
                border: "1px solid rgba(212,175,55,0.18)",
                textShadow: "0 0 12px rgba(212,175,55,0.6)",
                backdropFilter: "blur(4px)",
                whiteSpace: "nowrap",
                fontSize: "clamp(10px, 2.5vw, 14px)",
              }}
            >
              {name}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function MysticalHero({ activeTab, onTabChange, scrollTargets }) {
  const tabs = [
    { id: "abjad", label: "ABJAD", arabic: "أبجد" },
    { id: "anasir", label: "ANASIR", arabic: "عناصر" },
    { id: "hadim", label: "HADIM", arabic: "خادم" },
    { id: "mizaan", label: "MIZAAN 9", arabic: "ميزان" },
  ];

  const scrollTo = (id) => {
    onTabChange(id);
    const el = scrollTargets?.[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050d1a 0%, #0a1628 40%, #0d1f3c 70%, #0f2444 100%)" }}
    >
      <CosmicBackground />

      {/* Center sigil + floating names */}
      <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
        <SacredGeometry />
        <FloatingAsma />

        {/* Center logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ boxShadow: ["0 0 24px rgba(212,175,55,0.3)", "0 0 48px rgba(212,175,55,0.6)", "0 0 24px rgba(212,175,55,0.3)"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2"
            style={{
              background: "linear-gradient(180deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.10) 100%)",
              border: "1px solid rgba(212,175,55,0.40)",
            }}
          >
            <span className="font-amiri text-4xl" style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.8)" }}>ح</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center z-10 px-4 mt-2"
      >
        <h1
          className="font-amiri font-bold"
          style={{
            fontSize: "clamp(3rem, 12vw, 5.5rem)",
            color: "#FFFFFF",
            textShadow: "0 0 40px rgba(212,175,55,0.5), 0 2px 20px rgba(56,189,248,0.2)",
            lineHeight: 1.1,
          }}
        >
          سرّ الحروف
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-3 space-y-1"
        >
          <p
            className="font-inter font-bold tracking-[0.35em] uppercase"
            style={{ fontSize: "clamp(12px, 3vw, 16px)", color: "rgba(212,175,55,0.90)", textShadow: "0 0 16px rgba(212,175,55,0.4)" }}
          >
            Sirrul Huruf
          </p>
          <p
            className="font-inter tracking-[0.2em] uppercase"
            style={{ fontSize: "clamp(9px, 2vw, 11px)", color: "rgba(255,255,255,0.45)" }}
          >
            Advanced Ilm al-Huruf Analysis
          </p>
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-5 flex items-center justify-center gap-3"
        >
          <div style={{ width: 50, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.7))" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 8px rgba(212,175,55,0.8)" }} />
          <div style={{ width: 50, height: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.7))" }} />
        </motion.div>
      </motion.div>

      {/* Nav Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="z-10 mt-10 px-4 w-full max-w-sm"
      >
        <div
          className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.15)", backdropFilter: "blur(16px)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className="flex flex-col items-center py-2.5 px-1 rounded-xl transition-all duration-300"
              style={activeTab === tab.id ? {
                background: "linear-gradient(135deg, rgba(212,175,55,0.35), rgba(212,175,55,0.18))",
                border: "1px solid rgba(212,175,55,0.50)",
                boxShadow: "0 0 16px rgba(212,175,55,0.25)",
              } : {
                background: "transparent",
                border: "1px solid transparent",
              }}
            >
              <span
                className="font-amiri text-sm font-bold"
                style={{ color: activeTab === tab.id ? "#D4AF37" : "rgba(255,255,255,0.45)" }}
              >
                {tab.arabic}
              </span>
              <span
                className="font-inter font-bold mt-0.5"
                style={{ fontSize: 9, letterSpacing: "0.1em", color: activeTab === tab.id ? "rgba(212,175,55,0.90)" : "rgba(255,255,255,0.30)" }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(212,175,55,0.6), transparent)" }}
        />
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.4)" }}>Scroll</p>
      </motion.div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}