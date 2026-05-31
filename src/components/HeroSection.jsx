import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigation } from "../context/NavigationContext";
import SacredWheel from "./SacredWheel";
import useIsMobile from "../hooks/useIsMobile";
import useMouseParallax from "../hooks/useMouseParallax";

// ── Static data (module-level — zero re-renders) ──────────────────
const LIGHT_RAYS = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * 360,
  opacity: 0.04 + (i % 3) * 0.02,
  dur: 5 + i * 0.7,
  delay: i * 0.4,
  width: i % 4 === 0 ? 2 : 1,
  length: i % 3 === 0 ? "62vh" : "48vh",
}));

const ORBITAL_RINGS = [
  { r: "min(340px, 70vw)", dur: 180, dir: 1,  opacity: 0.18, dash: "4 12",   width: 0.8 },
  { r: "min(260px, 54vw)", dur: 120, dir: -1, opacity: 0.22, dash: "2 8",    width: 0.6 },
  { r: "min(180px, 38vw)", dur:  80, dir: 1,  opacity: 0.28, dash: "1 6",    width: 0.5 },
  { r: "min(430px, 88vw)", dur: 260, dir: -1, opacity: 0.10, dash: "6 18",   width: 0.6 },
];

const CALLIGRAPHY_CHARS = [
  { char: "ب", top: "8%",  left: "7%",  size: 48, opacity: 0.028, dur: 14, delay: 0 },
  { char: "ح", top: "15%", left: "88%", size: 38, opacity: 0.022, dur: 18, delay: 3 },
  { char: "ن", top: "72%", left: "5%",  size: 55, opacity: 0.025, dur: 16, delay: 6 },
  { char: "ع", top: "80%", left: "85%", size: 42, opacity: 0.020, dur: 20, delay: 2 },
  { char: "م", top: "45%", left: "3%",  size: 36, opacity: 0.018, dur: 22, delay: 8 },
  { char: "ق", top: "40%", left: "92%", size: 44, opacity: 0.023, dur: 17, delay: 5 },
  { char: "ر", top: "90%", left: "45%", size: 52, opacity: 0.019, dur: 19, delay: 1 },
  { char: "و", top: "5%",  left: "48%", size: 40, opacity: 0.021, dur: 15, delay: 7 },
];

const NAV_CARDS = [
  { path: "/abjad",            arabic: "أبجد",         label: "ABJAD",          subtitle: "Numerical Calculator",       icon: "ح",  accent: [212, 175, 55] },
  { path: "/anasir",           arabic: "عناصر",        label: "ANASIR",         subtitle: "Elemental Analysis",         icon: "🌊", accent: [56, 189, 248] },
  { path: "/hadim",            arabic: "خادم",         label: "HADIM",          subtitle: "Name Generator",             icon: "✦",  accent: [192, 132, 252] },
  { path: "/mizaan9",          arabic: "ميزان",        label: "MIZAAN 9",       subtitle: "Sacred Numerology",          icon: "٩",  accent: [212, 175, 55] },
  { path: "/magic-sqayer",     arabic: "السحر المربع", label: "MAGIC SQAYER",   subtitle: "Sacred Vefk Construction",   icon: "✨", accent: [212, 175, 55] },
  { path: "/vefkin-yapilisi",  arabic: "طريقة الوفق",  label: "VEFKİN YAPILIŞI",subtitle: "Ottoman Manuscript Method",  icon: "📜", accent: [212, 175, 55] },
];

// ── Orbiting golden rings ─────────────────────────────────────────
function OrbitalRings({ paused }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
      {ORBITAL_RINGS.map((ring, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: ring.r, height: ring.r,
            border: `${ring.width}px dashed rgba(212,175,55,${ring.opacity})`,
            boxShadow: `0 0 12px rgba(212,175,55,${ring.opacity * 0.5}), inset 0 0 12px rgba(212,175,55,${ring.opacity * 0.3})`,
          }}
          animate={paused ? {} : { rotate: ring.dir * 360 }}
          transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Solid accent rings */}
      <div className="absolute rounded-full" style={{
        width: "min(235px, 49vw)", height: "min(235px, 49vw)",
        border: "1px solid rgba(212,175,55,0.32)",
        boxShadow: "0 0 20px rgba(212,175,55,0.12), 0 0 60px rgba(212,175,55,0.06)",
      }} />
      <div className="absolute rounded-full" style={{
        width: "min(295px, 61vw)", height: "min(295px, 61vw)",
        border: "0.5px solid rgba(212,175,55,0.15)",
      }} />
    </div>
  );
}

// ── Light rays from center ────────────────────────────────────────
function LightRays({ paused, isMobile }) {
  if (isMobile) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {LIGHT_RAYS.map((ray, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: ray.width,
            height: ray.length,
            background: `linear-gradient(to bottom, rgba(212,175,55,0.22), rgba(212,175,55,0.06), transparent)`,
            transformOrigin: "top center",
            top: "50%",
            left: "50%",
            marginLeft: -ray.width / 2,
            rotate: `${ray.angle}deg`,
          }}
          animate={paused ? {} : { opacity: [ray.opacity, ray.opacity * 3, ray.opacity] }}
          transition={{ duration: ray.dur, repeat: Infinity, ease: "easeInOut", delay: ray.delay }}
        />
      ))}
      {/* Central burst bloom */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={paused ? {} : { scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ── Background Arabic calligraphy atmosphere ──────────────────────
function CalligraphyAtmosphere({ mouse }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: "blur(1px)", zIndex: 0 }}>
      {CALLIGRAPHY_CHARS.map((c, i) => (
        <motion.span
          key={i}
          className="absolute font-amiri select-none"
          style={{
            top: c.top, left: c.left,
            fontSize: c.size,
            color: "#D4AF37",
            opacity: c.opacity,
            x: mouse.x * -5,
            y: mouse.y * -5,
          }}
          animate={{ opacity: [c.opacity * 0.4, c.opacity, c.opacity * 0.4], y: [0, -12, 0] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut", delay: c.delay }}
        >
          {c.char}
        </motion.span>
      ))}
    </div>
  );
}

// ── Manuscript introduction area ──────────────────────────────────
function ManuscriptIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="relative z-10 w-full max-w-sm mx-auto mt-8 px-4"
    >
      <div
        className="rounded-2xl px-5 py-4 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(8,16,40,0.92) 0%, rgba(4,10,26,0.95) 100%)",
          border: "1px solid rgba(212,175,55,0.20)",
          boxShadow: "0 0 40px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.12)",
        }}
      >
        {/* Top gold sheen */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.55) 50%, transparent 90%)",
        }} />
        {/* Corner lights */}
        <div style={{
          position: "absolute", top: -12, left: -12, width: 60, height: 60,
          background: "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)",
          filter: "blur(8px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -12, right: -12, width: 60, height: 60,
          background: "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)",
          filter: "blur(8px)", pointerEvents: "none",
        }} />

        <p
          className="font-amiri text-sm leading-relaxed"
          dir="rtl"
          style={{ color: "rgba(245,230,180,0.72)", lineHeight: 1.9, letterSpacing: "0.04em" }}
        >
          علم الحروف — الحكمة الربانية في ميزان الأعداد والأسرار
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-8" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.45))" }} />
          <div className="w-1 h-1 rounded-full" style={{ background: "rgba(212,175,55,0.55)" }} />
          <p className="font-inter text-[9px] uppercase tracking-[0.25em]" style={{ color: "rgba(212,175,55,0.45)" }}>
            Ilm al-Huruf
          </p>
          <div className="w-1 h-1 rounded-full" style={{ background: "rgba(212,175,55,0.55)" }} />
          <div className="h-px w-8" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.45))" }} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Nav card inner ────────────────────────────────────────────────
function CardInner({ card }) {
  const [r, g, b] = card.accent;
  return (
    <>
      <div className="mb-3.5 flex items-center justify-center w-11 h-11 rounded-2xl"
        style={{
          background: `linear-gradient(145deg, rgba(${r},${g},${b},0.18) 0%, rgba(${r},${g},${b},0.06) 100%)`,
          border: `1px solid rgba(${r},${g},${b},0.35)`,
          boxShadow: `0 0 18px rgba(${r},${g},${b},0.22), inset 0 1px 0 rgba(${r},${g},${b},0.15)`,
        }}>
        <span className="font-amiri text-2xl leading-none" style={{ color: `rgb(${r},${g},${b})` }}>{card.icon}</span>
      </div>
      <p className="font-amiri text-xl font-bold leading-tight mb-0.5" style={{ color: "#f5ead4" }}>{card.arabic}</p>
      <p className="font-inter font-bold tracking-[0.20em] uppercase" style={{ fontSize: 7, color: `rgba(${r},${g},${b},0.90)` }}>{card.label}</p>
      <div className="w-8 h-px my-2.5 rounded-full" style={{ background: `linear-gradient(90deg, transparent, rgba(${r},${g},${b},0.45), transparent)` }} />
      <p className="font-inter leading-relaxed text-center" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{card.subtitle}</p>
    </>
  );
}

// ── Main title block ──────────────────────────────────────────────
function HeroTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className="text-center z-10 px-4 mt-4"
    >
      {/* Main title */}
      <motion.h1
        className="font-amiri font-bold"
        style={{
          fontSize: "clamp(3rem, 13vw, 5.8rem)",
          color: "#f5ecd4",
          textShadow: "0 0 40px rgba(212,175,55,0.55), 0 0 90px rgba(212,175,55,0.20), 0 2px 24px rgba(0,0,0,0.65)",
          lineHeight: 1.08,
          letterSpacing: "0.02em",
        }}
        animate={{
          textShadow: [
            "0 0 30px rgba(212,175,55,0.45), 0 0 70px rgba(212,175,55,0.15), 0 2px 20px rgba(0,0,0,0.60)",
            "0 0 55px rgba(212,175,55,0.70), 0 0 110px rgba(212,175,55,0.30), 0 2px 28px rgba(0,0,0,0.65)",
            "0 0 30px rgba(212,175,55,0.45), 0 0 70px rgba(212,175,55,0.15), 0 2px 20px rgba(0,0,0,0.60)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        سرّ الحروف
      </motion.h1>

      {/* Subtitle row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="mt-3 space-y-2"
      >
        <p
          className="font-inter font-bold tracking-[0.35em] uppercase"
          style={{ fontSize: "clamp(11px, 2.8vw, 15px)", color: "rgba(212,175,55,0.90)", textShadow: "0 0 14px rgba(212,175,55,0.35)" }}
        >
          Sirrul Huruf
        </p>
        <p
          className="font-inter tracking-[0.2em] uppercase"
          style={{ fontSize: "clamp(8px, 1.8vw, 11px)", color: "rgba(255,255,255,0.40)" }}
        >
          Advanced Ilm al-Huruf Analysis
        </p>
      </motion.div>

      {/* Ornamental divider */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 1.1, duration: 0.9 }}
        className="mt-5 flex items-center justify-center gap-3"
      >
        <div style={{ width: 40, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.7))" }} />
        <motion.div
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 8px rgba(212,175,55,0.8)" }}
          animate={{ boxShadow: ["0 0 6px rgba(212,175,55,0.6)", "0 0 18px rgba(212,175,55,1)", "0 0 6px rgba(212,175,55,0.6)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div style={{ width: 14, height: 0.5, background: "rgba(212,175,55,0.4)" }} />
        <motion.div
          style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(212,175,55,0.7)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <div style={{ width: 14, height: 0.5, background: "rgba(212,175,55,0.4)" }} />
        <motion.div
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 8px rgba(212,175,55,0.8)" }}
          animate={{ boxShadow: ["0 0 6px rgba(212,175,55,0.6)", "0 0 18px rgba(212,175,55,1)", "0 0 6px rgba(212,175,55,0.6)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <div style={{ width: 40, height: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.7))" }} />
      </motion.div>
    </motion.div>
  );
}

// ── Central Allah calligraphy floating above wheel ────────────────
function AllahCalligraphy() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      className="absolute z-20 flex items-center justify-center"
    >
      {/* Deep golden bloom */}
      <motion.div className="absolute rounded-full pointer-events-none" style={{
        width: 220, height: 220,
        background: "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 35%, rgba(180,130,20,0.03) 60%, transparent 78%)",
        filter: "blur(22px)", zIndex: 0,
      }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.40, 0.85, 0.40] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Tight core bloom */}
      <motion.div className="absolute rounded-full pointer-events-none" style={{
        width: 110, height: 110,
        background: "radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.10) 55%, transparent 80%)",
        filter: "blur(12px)", zIndex: 1,
      }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.50, 0.95, 0.50] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Floating shadow */}
      <motion.div className="absolute pointer-events-none" style={{
        width: 90, height: 18, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.48) 0%, transparent 70%)",
        filter: "blur(8px)", bottom: -22, zIndex: 0,
      }}
        animate={{ scaleX: [1, 0.78, 1], opacity: [0.52, 0.28, 0.52] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* الله */}
      <motion.span
        className="font-amiri font-bold relative select-none"
        style={{ fontSize: "3.4rem", color: "#D4AF37", lineHeight: 1, letterSpacing: "0.03em", zIndex: 2 }}
        animate={{
          textShadow: [
            "0 0 10px rgba(212,175,55,0.50), 0 0 30px rgba(212,175,55,0.65), 0 0 65px rgba(212,175,55,0.22)",
            "0 0 20px rgba(212,175,55,0.85), 0 0 55px rgba(212,175,55,0.98), 0 0 100px rgba(212,175,55,0.40)",
            "0 0 10px rgba(212,175,55,0.50), 0 0 30px rgba(212,175,55,0.65), 0 0 65px rgba(212,175,55,0.22)",
          ],
          y: [0, -5, 0],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        الله
      </motion.span>
    </motion.div>
  );
}

// ── Nav cards grid ────────────────────────────────────────────────
function NavCards({ startNav }) {
  return (
    <div className="relative z-10 w-full max-w-sm mt-8 grid grid-cols-2 gap-3 px-2">
      {NAV_CARDS.map((card, i) => {
        const [r, g, b] = card.accent;
        return (
          <motion.div
            key={card.path}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.8 + i * 0.08, duration: 0.55, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to={card.path}
              onClick={startNav}
              className="block rounded-2xl border flex flex-col items-center text-center"
              style={{
                background: `linear-gradient(145deg, rgba(${r},${g},${b},0.12) 0%, rgba(${r},${g},${b},0.04) 100%)`,
                borderColor: `rgba(${r},${g},${b},0.35)`,
                boxShadow: `0 0 32px rgba(${r},${g},${b},0.15), 0 4px 20px rgba(0,0,0,0.50)`,
                minHeight: 148,
                padding: "20px 16px",
                transform: "translateZ(0)",
                willChange: "transform",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                backdropFilter: "blur(6px)",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Top sheen */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${r},${g},${b},0.40), transparent)`,
              }} />
              {/* Floating light top-right */}
              <div style={{
                position: "absolute", top: -20, right: -20,
                width: 80, height: 80, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(${r},${g},${b},0.15) 0%, transparent 70%)`,
                filter: "blur(12px)", pointerEvents: "none",
              }} />
              {/* Floating light bottom-left */}
              <div style={{
                position: "absolute", bottom: -16, left: -16,
                width: 60, height: 60, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(${r},${g},${b},0.10) 0%, transparent 70%)`,
                filter: "blur(10px)", pointerEvents: "none",
              }} />
              <CardInner card={card} />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function HeroSection() {
  const { startNav, isNavigating } = useNavigation();
  const isMobile = useIsMobile();
  const mouse = useMouseParallax(1);

  const wheelSize = `min(${isMobile ? "420px" : "500px"}, 88vw)`;

  return (
    <div className="min-h-screen font-inter relative overflow-x-hidden flex flex-col items-center justify-center pb-10">

      {/* ── Calligraphy atmosphere ── */}
      <CalligraphyAtmosphere mouse={mouse} />

      {/* ── Light rays ── */}
      <LightRays paused={isNavigating} isMobile={isMobile} />

      {/* ── Sacred wheel + orbital rings + Allah ── */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex items-center justify-center"
        style={{ width: wheelSize, height: wheelSize, zIndex: 2 }}
      >
        {/* Orbital decorative rings behind wheel */}
        <OrbitalRings paused={isNavigating} />

        {/* Sacred wheel */}
        <SacredWheel />

        {/* Allah calligraphy floating in center */}
        <AllahCalligraphy />
      </motion.div>

      {/* ── Hero title ── */}
      <HeroTitle />

      {/* ── Manuscript intro ── */}
      <ManuscriptIntro />

      {/* ── Nav cards ── */}
      <NavCards startNav={startNav} />
    </div>
  );
}