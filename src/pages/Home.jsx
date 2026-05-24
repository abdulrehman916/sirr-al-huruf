import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ASMA = ["الله", "الرحمن", "الملك", "القدوس", "السلام", "المؤمن", "العزيز", "الجبار"];

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
      {stars.map((s, i) => <div key={i} className="absolute rounded-full bg-white" style={s} />)}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 70%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 30% 60% at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 30% 60% at 70% 50%, rgba(56,189,248,0.06) 0%, transparent 60%)" }} />
    </div>
  );
}

function SacredGeometry() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute" style={{ width: 340, height: 340, border: "1px solid rgba(212,175,55,0.15)", borderRadius: "50%" }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute" style={{ width: 260, height: 260, border: "1px solid rgba(212,175,55,0.20)", borderRadius: "50%", borderStyle: "dashed" }} />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute" style={{ width: 190, height: 190, border: "1px solid rgba(212,175,55,0.25)", borderRadius: "50%" }} />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full" style={{ width: 100, height: 100, background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)" }} />
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
          <motion.div key={name} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.6 }} className="absolute"
            style={{ transform: `translate(${x}px, ${y}px)` }}>
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              className="font-amiri text-xs sm:text-sm font-bold text-center px-2 py-1 rounded-lg"
              style={{ color: "rgba(212,175,55,0.85)", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.18)", textShadow: "0 0 12px rgba(212,175,55,0.6)", backdropFilter: "blur(4px)", whiteSpace: "nowrap", fontSize: "clamp(10px, 2.5vw, 14px)" }}>
              {name}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

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
    <div className="min-h-screen font-inter relative overflow-x-hidden" style={{ background: "linear-gradient(180deg, #050d1a 0%, #0a1628 40%, #112840 100%)" }}>
      <CosmicBackground />

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pb-8">
        {/* Sigil */}
        <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
          <SacredGeometry />
          <FloatingAsma />
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ boxShadow: ["0 0 24px rgba(212,175,55,0.3)", "0 0 48px rgba(212,175,55,0.6)", "0 0 24px rgba(212,175,55,0.3)"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.10) 100%)", border: "1px solid rgba(212,175,55,0.40)" }}>
              <span className="font-amiri text-4xl" style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.8)" }}>ح</span>
            </motion.div>
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

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}