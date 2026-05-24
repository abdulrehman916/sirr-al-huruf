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
    borderColor: "rgba(212,175,55,0.45)",
    bg: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)",
    glow: "0 0 40px rgba(212,175,55,0.20)",
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
            style={{ fontSize: "clamp(3rem, 12vw, 5.5rem)", color: "#FFFFFF", textShadow: "0 0 34px rgba(212,175,55,0.42), 0 2px 17px rgba(56,189,248,0.17)", lineHeight: 1.1 }}>
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
              whileHover={{ scale: card.dimmed ? 1 : 1.04, y: card.dimmed ? 0 : -3 }}
              whileTap={{ scale: card.dimmed ? 1 : 0.97 }}
              style={{ opacity: card.dimmed ? 0.5 : 1 }}>
              {card.dimmed ? (
                <div className="rounded-2xl border p-5 flex flex-col items-center text-center cursor-default"
                  style={{ background: card.bg, borderColor: card.borderColor, boxShadow: card.glow, minHeight: 140 }}>
                  <CardInner card={card} />
                </div>
              ) : (
                <Link
                  to={card.path}
                  onClick={startNav}
                  className="block rounded-2xl border p-5 flex flex-col items-center text-center transition-all duration-300"
                  style={{
                    background: card.bg,
                    borderColor: card.borderColor,
                    boxShadow: card.glow,
                    minHeight: 140,
                    transform: "translateZ(0)",
                    willChange: "transform",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
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