import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import MysticalBackground from "../components/MysticalBackground";
import SacredWheel from "../components/SacredWheel";
import { useNavigation } from "../context/NavigationContext";

const NAV_CARDS = [
  {
    path: "/abjad",
    arabic: "أبجد",
    label: "ABJAD",
    subtitle: "Numerical Calculator",
    icon: "ح",
    accent: "rgba(212,175,55,1)",
    borderColor: "rgba(212,175,55,0.35)",
    bg: "linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)",
    glow: "0 0 32px rgba(212,175,55,0.15), 0 4px 20px rgba(0,0,0,0.50)",
  },
  {
    path: "/anasir",
    arabic: "عناصر",
    label: "ANASIR",
    subtitle: "Elemental Analysis",
    icon: "🌊",
    accent: "rgba(56,189,248,1)",
    borderColor: "rgba(56,189,248,0.35)",
    bg: "linear-gradient(145deg, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.04) 100%)",
    glow: "0 0 32px rgba(56,189,248,0.12), 0 4px 20px rgba(0,0,0,0.50)",
  },
  {
    path: "/hadim",
    arabic: "خادم",
    label: "HADIM",
    subtitle: "Name Generator",
    icon: "✦",
    accent: "rgba(192,132,252,1)",
    borderColor: "rgba(168,85,247,0.35)",
    bg: "linear-gradient(145deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.04) 100%)",
    glow: "0 0 32px rgba(168,85,247,0.15), 0 4px 20px rgba(0,0,0,0.50)",
  },
  {
    path: "/mizaan9",
    arabic: "ميزان",
    label: "MIZAAN 9",
    subtitle: "Sacred Numerology",
    icon: "٩",
    accent: "rgba(212,175,55,1)",
    borderColor: "rgba(212,175,55,0.35)",
    bg: "linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)",
    glow: "0 0 32px rgba(212,175,55,0.15), 0 4px 20px rgba(0,0,0,0.50)",
  },
  {
    path: "/magic-sqayer",
    arabic: "السحر المربع",
    label: "MAGIC SQAYER",
    subtitle: "Sacred Vefk Construction",
    icon: "✨",
    accent: "rgba(212,175,55,1)",
    borderColor: "rgba(212,175,55,0.35)",
    bg: "linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)",
    glow: "0 0 32px rgba(212,175,55,0.15), 0 4px 20px rgba(0,0,0,0.50)",
  },
  {
    path: "/vefkin-yapilisi",
    arabic: "طريقة الوفق",
    label: "VEFKİN YAPILIŞI",
    subtitle: "Ottoman Manuscript Method",
    icon: "📜",
    accent: "rgba(212,175,55,1)",
    borderColor: "rgba(212,175,55,0.35)",
    bg: "linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)",
    glow: "0 0 32px rgba(212,175,55,0.15), 0 4px 20px rgba(0,0,0,0.50)",
  },
];





function CardInner({ card }) {
  return (
    <>
      {/* Icon */}
      <div className="mb-3 flex items-center justify-center w-10 h-10 rounded-xl"
        style={{
          background: `rgba(${card.accent.match(/[\d.]+/g).slice(0,3).join(",")},0.12)`,
          border: `1px solid ${card.borderColor}`,
          boxShadow: `0 0 14px rgba(${card.accent.match(/[\d.]+/g).slice(0,3).join(",")},0.18)`,
        }}>
        <span className="font-amiri text-xl leading-none" style={{ color: card.accent }}>{card.icon}</span>
      </div>
      {/* Arabic */}
      <p className="font-amiri text-lg font-bold leading-tight mb-0.5" style={{ color: "#f0e6c0" }}>{card.arabic}</p>
      {/* Latin label */}
      <p className="font-inter font-semibold tracking-[0.18em] uppercase" style={{ fontSize: 7.5, color: card.accent, opacity: 0.85 }}>{card.label}</p>
      {/* Divider */}
      <div className="w-6 h-px my-2 rounded-full" style={{ background: card.borderColor }} />
      {/* Subtitle */}
      <p className="font-inter leading-relaxed text-center" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.32)" }}>{card.subtitle}</p>
    </>
  );
}

export default function Home() {
  const { startNav } = useNavigation();
  return (
    <div className="min-h-screen font-inter relative overflow-x-hidden">
      <MysticalBackground />

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pb-8">
        {/* Sacred Wheel + Logo */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "min(500px, 88vw)",
            height: "min(500px, 88vw)",
          }}
        >
          <SacredWheel />
          {/* Central logo on top */}
          {/* Central Allah calligraphy — pure floating, no box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute z-20 flex items-center justify-center"
          >
            {/* Volumetric light — deep golden bloom behind the name */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 220, height: 220,
                background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.07) 35%, rgba(180,130,20,0.03) 60%, transparent 78%)",
                filter: "blur(22px)",
                zIndex: 0,
              }}
              animate={{ scale: [1, 1.30, 1], opacity: [0.38, 0.78, 0.38] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Secondary tighter core bloom */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 110, height: 110,
                background: "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.08) 55%, transparent 80%)",
                filter: "blur(12px)",
                zIndex: 1,
              }}
              animate={{ scale: [1, 1.20, 1], opacity: [0.45, 0.90, 0.45] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />
            {/* Floating depth shadow — sacred object lifting off the plane */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: 90, height: 18,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)",
                filter: "blur(8px)",
                bottom: -22,
                zIndex: 0,
              }}
              animate={{ scaleX: [1, 0.80, 1], opacity: [0.50, 0.28, 0.50] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* الله — luminous calligraphy, elevated */}
            <motion.span
              className="font-amiri font-bold relative select-none"
              style={{
                fontSize: "3.2rem",
                color: "#D4AF37",
                lineHeight: 1,
                letterSpacing: "0.03em",
                zIndex: 2,
              }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(212,175,55,0.48), 0 0 28px rgba(212,175,55,0.62), 0 0 60px rgba(212,175,55,0.20)",
                  "0 0 18px rgba(212,175,55,0.78), 0 0 48px rgba(212,175,55,0.92), 0 0 90px rgba(212,175,55,0.35)",
                  "0 0 10px rgba(212,175,55,0.48), 0 0 28px rgba(212,175,55,0.62), 0 0 60px rgba(212,175,55,0.20)",
                ],
                y: [0, -4, 0],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              الله
            </motion.span>
          </motion.div>
        </div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center z-10 px-4 mt-2" style={{ marginTop: 16 }}>
          <h1 className="font-amiri font-bold"
            style={{ fontSize: "clamp(2.8rem, 12vw, 5.5rem)", color: "#f5ecd4", textShadow: "0 0 40px rgba(212,175,55,0.50), 0 0 80px rgba(212,175,55,0.18), 0 2px 20px rgba(0,0,0,0.60)", lineHeight: 1.1, letterSpacing: "0.02em" }}>
            سرّ الحروف
          </h1>
          {/* Subtle blue atmospheric gradient behind lower text */}
          <div style={{
            position: "relative",
            marginTop: 12,
          }}>
            <div style={{
              position: "absolute",
              inset: "-18px -40px",
              background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(14,40,90,0.28) 0%, rgba(6,18,50,0.12) 55%, transparent 80%)",
              filter: "blur(18px)",
              pointerEvents: "none",
              zIndex: 0,
            }} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="space-y-3" style={{ position: "relative", zIndex: 1 }}>
              <p className="font-inter font-bold tracking-[0.35em] uppercase"
                style={{ fontSize: "clamp(12px, 3vw, 16px)", color: "rgba(212,175,55,0.90)", textShadow: "0 0 14px rgba(212,175,55,0.34)" }}>
                Sirrul Huruf
              </p>
              <p className="font-inter tracking-[0.2em] uppercase"
                style={{ fontSize: "clamp(9px, 2vw, 11px)", color: "rgba(255,255,255,0.45)" }}>
                Advanced Ilm al-Huruf Analysis
              </p>
            </motion.div>
          </div>
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
              whileHover={{ scale: card.dimmed ? 1 : 1.03, y: card.dimmed ? 0 : -4 }}
              whileTap={{ scale: card.dimmed ? 1 : 0.97 }}
              style={{ opacity: card.dimmed ? 0.5 : 1 }}>
              {card.dimmed ? (
                <div className="rounded-2xl border p-5 flex flex-col items-center text-center cursor-default"
                  style={{
                    background: card.bg,
                    borderColor: card.borderColor,
                    boxShadow: card.glow,
                    minHeight: 148,
                    backdropFilter: "blur(4px)",
                  }}>
                  <CardInner card={card} />
                </div>
              ) : (
                <Link
                  to={card.path}
                  onClick={startNav}
                  className="block rounded-2xl border flex flex-col items-center text-center transition-all duration-300"
                  style={{
                    background: card.bg,
                    borderColor: card.borderColor,
                    boxShadow: card.glow,
                    minHeight: 148,
                    padding: "20px 16px",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    backdropFilter: "blur(4px)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Subtle inner top sheen */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 1,
                    background: `linear-gradient(90deg, transparent, rgba(${card.accent.match(/[\d.]+/g).slice(0,3).join(",")},0.30), transparent)`,
                  }} />
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