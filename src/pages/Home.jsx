import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MysticalBackground from "../components/MysticalBackground";
import SacredWheel from "../components/SacredWheel";

const NAV_CARDS = [
  {
    path: "/abjad",
    arabic: "أبجد",
    label: "ABJAD",
    subtitle: "Numerical Calculator",
    icon: "ح",
    borderColor: "rgba(212,175,55,0.45)",
    bg: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)",
    glow: "0 0 40px rgba(212,175,55,0.20)",
  },
  {
    path: "/anasir",
    arabic: "عناصر",
    label: "ANASIR",
    subtitle: "Elemental Analysis",
    icon: "🌊",
    borderColor: "rgba(6,182,212,0.45)",
    bg: "linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0.06) 100%)",
    glow: "0 0 40px rgba(6,182,212,0.18)",
  },
  {
    path: "/hadim",
    arabic: "خادم",
    label: "HADIM",
    subtitle: "Name Generator",
    icon: "✦",
    borderColor: "rgba(168,85,247,0.45)",
    bg: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(168,85,247,0.06) 100%)",
    glow: "0 0 40px rgba(168,85,247,0.20)",
  },
  {
    path: "/mizaan9",
    arabic: "ميزان",
    label: "MIZAAN 9",
    subtitle: "Sacred Numerology",
    icon: "٩",
    borderColor: "rgba(212,175,55,0.30)",
    bg: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)",
    glow: "0 0 30px rgba(212,175,55,0.10)",
    dimmed: true,
  },
];





function CardInner({ card }) {
  return (
    <>
      <div className="text-3xl mb-3">
        <span className="font-amiri" style={{ color: card.borderColor.replace("0.45", "0.90").replace("0.30", "0.70") }}>{card.icon}</span>
      </div>
      <p className="font-amiri text-xl font-bold text-white mb-0.5">{card.arabic}</p>
      <p className="font-inter font-bold tracking-widest uppercase text-white/80" style={{ fontSize: 9 }}>{card.label}</p>
      <p className="font-inter text-[10px] text-white/35 mt-2 leading-relaxed">{card.subtitle}</p>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-inter relative overflow-x-hidden">
      <MysticalBackground />

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pb-8">
        {/* Sacred Wheel + Logo */}
        <div className="relative flex items-center justify-center" style={{ width: 500, height: 500 }}>
          <SacredWheel />
          {/* Central logo on top */}
          {/* Central Allah calligraphy — pure floating, no box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute z-20 flex items-center justify-center"
          >
            {/* Soft divine aura — refined, not excessive */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 130, height: 130,
                background: "radial-gradient(circle, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.05) 55%, transparent 80%)",
                filter: "blur(16px)",
              }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.40, 0.85, 0.40] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* الله — bare luminous calligraphy */}
            <motion.span
              className="font-amiri font-bold relative z-10 select-none"
              style={{
                  fontSize: "3.2rem",
                  color: "#D4AF37",
                  lineHeight: 1,
                  letterSpacing: "0.03em",
                }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(212,175,55,0.45), 0 0 28px rgba(212,175,55,0.60), 0 0 55px rgba(212,175,55,0.22)",
                  "0 0 16px rgba(212,175,55,0.70), 0 0 44px rgba(212,175,55,0.88), 0 0 80px rgba(212,175,55,0.38)",
                  "0 0 10px rgba(212,175,55,0.45), 0 0 28px rgba(212,175,55,0.60), 0 0 55px rgba(212,175,55,0.22)",
                ],
                y: [0, -3, 0],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              الله
            </motion.span>
          </motion.div>
        </div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center z-10 px-4 mt-2">
          <h1 className="font-amiri font-bold"
            style={{ fontSize: "clamp(3rem, 12vw, 5.5rem)", color: "#FFFFFF", textShadow: "0 0 40px rgba(212,175,55,0.5), 0 2px 20px rgba(56,189,248,0.2)", lineHeight: 1.1 }}>
            سرّ الحروف
          </h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="mt-3 space-y-1">
            <p className="font-inter font-bold tracking-[0.35em] uppercase"
              style={{ fontSize: "clamp(12px, 3vw, 16px)", color: "rgba(212,175,55,0.90)", textShadow: "0 0 16px rgba(212,175,55,0.4)" }}>
              Sirrul Huruf
            </p>
            <p className="font-inter tracking-[0.2em] uppercase"
              style={{ fontSize: "clamp(9px, 2vw, 11px)", color: "rgba(255,255,255,0.45)" }}>
              Advanced Ilm al-Huruf Analysis
            </p>
          </motion.div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.8 }}
            className="mt-5 flex items-center justify-center gap-3">
            <div style={{ width: 50, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.7))" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 8px rgba(212,175,55,0.8)" }} />
            <div style={{ width: 50, height: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.7))" }} />
          </motion.div>
        </motion.div>

        {/* Nav Cards */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
          className="relative z-10 w-full max-w-sm mt-10 grid grid-cols-2 gap-3 px-2">
          {NAV_CARDS.map((card, i) => (
            <motion.div key={card.path}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: card.dimmed ? 1 : 1.04, y: card.dimmed ? 0 : -3 }}
              whileTap={{ scale: card.dimmed ? 1 : 0.97 }}
              style={{ opacity: card.dimmed ? 0.5 : 1 }}>
              {card.dimmed ? (
                <div className="rounded-2xl border p-5 flex flex-col items-center text-center cursor-default"
                  style={{ background: card.bg, borderColor: card.borderColor, boxShadow: card.glow, minHeight: 140 }}>
                  <CardInner card={card} />
                </div>
              ) : (
                <Link to={card.path} className="block rounded-2xl border p-5 flex flex-col items-center text-center transition-all duration-300"
                  style={{ background: card.bg, borderColor: card.borderColor, boxShadow: card.glow, minHeight: 140 }}>
                  <CardInner card={card} />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>


    </div>
  );
}