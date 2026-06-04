import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigation } from "../context/NavigationContext";
import SacredWheel from "./SacredWheel";
import useIsMobile from "../hooks/useIsMobile";

// ── Static data ───────────────────────────────────────────────────
const LIGHT_RAYS = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * 360,
  opacity: 0.04 + (i % 3) * 0.02,
  dur: 5 + i * 0.7,
  delay: i * 0.4,
  width: i % 4 === 0 ? 2 : 1,
  length: i % 3 === 0 ? "62vh" : "48vh",
}));

const ORBITAL_RINGS = [
  { r: "min(340px, 70vw)", dur: 180, dir: 1,  opacity: 0.16, width: 0.8 },
  { r: "min(260px, 54vw)", dur: 120, dir: -1, opacity: 0.20, width: 0.6 },
  { r: "min(180px, 38vw)", dur:  80, dir: 1,  opacity: 0.26, width: 0.5 },
  { r: "min(430px, 88vw)", dur: 260, dir: -1, opacity: 0.09, width: 0.6 },
];

const CALLIGRAPHY_CHARS = [
  { char: "ب", top: "8%",  left: "7%",  size: 48, opacity: 0.026, dur: 14, delay: 0 },
  { char: "ح", top: "15%", left: "88%", size: 38, opacity: 0.020, dur: 18, delay: 3 },
  { char: "ن", top: "72%", left: "5%",  size: 55, opacity: 0.023, dur: 16, delay: 6 },
  { char: "ع", top: "80%", left: "85%", size: 42, opacity: 0.018, dur: 20, delay: 2 },
  { char: "م", top: "45%", left: "3%",  size: 36, opacity: 0.016, dur: 22, delay: 8 },
  { char: "ق", top: "40%", left: "92%", size: 44, opacity: 0.021, dur: 17, delay: 5 },
  { char: "ر", top: "90%", left: "45%", size: 52, opacity: 0.017, dur: 19, delay: 1 },
  { char: "و", top: "5%",  left: "48%", size: 40, opacity: 0.019, dur: 15, delay: 7 },
];

// SVG icon system
const CARD_ICONS = {
  abjad: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
        fontFamily="Amiri, serif" fontWeight="700" fontSize="20" fill={color}>ح</text>
      <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="0.8" strokeOpacity="0.5"/>
    </svg>
  ),
  anasir: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <path d="M16 4 C10 4 5 10 6 16 C7 22 11 27 16 28 C21 27 25 22 26 16 C27 10 22 4 16 4Z"
        stroke={color} strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
      <path d="M8 16 Q12 10 16 16 Q20 22 24 16" stroke={color} strokeWidth="1" strokeOpacity="0.6" fill="none"/>
      <circle cx="16" cy="16" r="2.5" fill={color} fillOpacity="0.9"/>
    </svg>
  ),
  hadim: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <polygon points="16,3 19.5,12 29,12 21.5,18 24,27 16,21.5 8,27 10.5,18 3,12 12.5,12"
        stroke={color} strokeWidth="1" strokeOpacity="0.85" fill={color} fillOpacity="0.12"/>
      <circle cx="16" cy="16" r="3" fill={color} fillOpacity="0.9"/>
    </svg>
  ),
  mizaan: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <line x1="16" y1="4" x2="16" y2="28" stroke={color} strokeWidth="1.2" strokeOpacity="0.7"/>
      <line x1="6" y1="12" x2="26" y2="12" stroke={color} strokeWidth="1" strokeOpacity="0.6"/>
      <ellipse cx="9" cy="20" rx="5" ry="3" stroke={color} strokeWidth="0.9" strokeOpacity="0.75" fill={color} fillOpacity="0.10"/>
      <ellipse cx="23" cy="20" rx="5" ry="3" stroke={color} strokeWidth="0.9" strokeOpacity="0.75" fill={color} fillOpacity="0.10"/>
      <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle"
        fontFamily="Amiri, serif" fontWeight="700" fontSize="9" fill={color} fillOpacity="0.9">٩</text>
    </svg>
  ),
  sqayer: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <rect x="5" y="5" width="22" height="22" rx="2" stroke={color} strokeWidth="0.9" strokeOpacity="0.7" fill="none"/>
      <line x1="5" y1="12.3" x2="27" y2="12.3" stroke={color} strokeWidth="0.5" strokeOpacity="0.45"/>
      <line x1="5" y1="19.7" x2="27" y2="19.7" stroke={color} strokeWidth="0.5" strokeOpacity="0.45"/>
      <line x1="12.3" y1="5" x2="12.3" y2="27" stroke={color} strokeWidth="0.5" strokeOpacity="0.45"/>
      <line x1="19.7" y1="5" x2="19.7" y2="27" stroke={color} strokeWidth="0.5" strokeOpacity="0.45"/>
      <circle cx="16" cy="16" r="2" fill={color} fillOpacity="0.85"/>
    </svg>
  ),
  vefkin: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <rect x="6" y="8" width="20" height="16" rx="1.5" stroke={color} strokeWidth="1" strokeOpacity="0.75" fill="none"/>
      <line x1="6" y1="12" x2="26" y2="12" stroke={color} strokeWidth="0.6" strokeOpacity="0.5"/>
      <line x1="9" y1="16" x2="23" y2="16" stroke={color} strokeWidth="0.5" strokeOpacity="0.4"/>
      <line x1="9" y1="19" x2="20" y2="19" stroke={color} strokeWidth="0.5" strokeOpacity="0.4"/>
      <path d="M14 5 L16 8 L18 5" stroke={color} strokeWidth="0.8" strokeOpacity="0.65" fill="none"/>
    </svg>
  ),
  bast: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fontFamily="Amiri, serif" fontWeight="700" fontSize="16" fill={color}>بسط</text>
      <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="0.8" strokeOpacity="0.55"/>
      <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="0.4" strokeOpacity="0.25" strokeDasharray="2,4"/>
    </svg>
  ),
  faal: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
        fontFamily="Amiri, serif" fontWeight="700" fontSize="18" fill={color}>ف</text>
      <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="0.8" strokeOpacity="0.55"/>
      <path d="M16 6 L16 26 M10 12 L16 16 L22 12" stroke={color} strokeWidth="0.6" strokeOpacity="0.45"/>
    </svg>
  ),
  plants: (color) => (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <path d="M16 2 Q12 8 12 14 Q12 22 16 28 Q20 22 20 14 Q20 8 16 2Z"
        stroke={color} strokeWidth="1" strokeOpacity="0.75" fill={color} fillOpacity="0.12"/>
      <path d="M8 16 Q10 12 14 12 L14 20 Q10 20 8 18Z"
        stroke={color} strokeWidth="0.8" strokeOpacity="0.70" fill={color} fillOpacity="0.08"/>
      <path d="M24 16 Q22 12 18 12 L18 20 Q22 20 24 18Z"
        stroke={color} strokeWidth="0.8" strokeOpacity="0.70" fill={color} fillOpacity="0.08"/>
      <circle cx="16" cy="16" r="1.5" fill={color} fillOpacity="0.9"/>
    </svg>
  ),
  };

const NAV_CARDS = [
   { path: "/abjad",            arabic: "أبجد",         label: "ABJAD",            subtitle: "Numerical Calculator",      iconKey: "abjad",  accent: [212, 175, 55] },
   { path: "/anasir",           arabic: "عناصر",        label: "ANASIR",           subtitle: "Elemental Analysis",        iconKey: "anasir", accent: [56, 189, 248] },
   { path: "/hadim",            arabic: "خادم",         label: "HADIM",            subtitle: "Name Generator",            iconKey: "hadim",  accent: [192, 132, 252] },
   { path: "/mizaan9",          arabic: "ميزان",        label: "MIZAAN 9",         subtitle: "Sacred Numerology",         iconKey: "mizaan", accent: [212, 175, 55] },
   { path: "/magic-sqayer",     arabic: "السحر المربع", label: "MAGIC SQAYER",     subtitle: "Sacred Vefk Construction",  iconKey: "sqayer", accent: [212, 175, 55] },
   { path: "/vefkin-yapilisi",  arabic: "طريقة الوفق",  label: "VEFKİN YAPILIŞI",  subtitle: "Ottoman Manuscript Method", iconKey: "vefkin", accent: [212, 175, 55] },
   { path: "/basthul-huroof-2", arabic: "بسط الحروف",   label: "BASTHUL HUROOF 2", subtitle: "Basti Adedi Cedveli",       iconKey: "bast",   accent: [180, 140, 255] },
   { path: "/faal-hasrath",     arabic: "فأل",          label: "FAAL",             subtitle: "Sacred Omen System",        iconKey: "faal",   accent: [212, 175, 55] },
   { path: "/plants",           arabic: "نباتات",       label: "PLANTS",           subtitle: "Medicinal Dictionary",      iconKey: "plants", accent: [34, 197, 94] },
];

// ── Static ring sizes for mobile (no Framer Motion) ──────────────
const STATIC_RINGS = [
  { r: "min(235px,49vw)", border: "1px solid rgba(212,175,55,0.30)", shadow: "0 0 24px rgba(212,175,55,0.12)" },
  { r: "min(295px,61vw)", border: "0.5px solid rgba(212,175,55,0.13)", shadow: "none" },
];

// ── Sub-components ────────────────────────────────────────────────

function OrbitalRings({ paused, isMobile }) {
  if (isMobile) {
    // CSS-only rings on mobile — no Framer Motion
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
        {STATIC_RINGS.map((r, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: r.r, height: r.r,
            border: r.border,
            boxShadow: r.shadow,
          }} />
        ))}
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
      {ORBITAL_RINGS.map((ring, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: ring.r, height: ring.r,
            border: `${ring.width}px dashed rgba(212,175,55,${ring.opacity})`,
            boxShadow: `0 0 16px rgba(212,175,55,${ring.opacity * 0.55})`,
          }}
          animate={paused ? {} : { rotate: ring.dir * 360 }}
          transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <div className="absolute rounded-full" style={{
        width: "min(235px,49vw)", height: "min(235px,49vw)",
        border: "1px solid rgba(212,175,55,0.30)",
        boxShadow: "0 0 24px rgba(212,175,55,0.12), 0 0 70px rgba(212,175,55,0.05)",
      }} />
      <div className="absolute rounded-full" style={{
        width: "min(295px,61vw)", height: "min(295px,61vw)",
        border: "0.5px solid rgba(212,175,55,0.13)",
      }} />
    </div>
  );
}

function LightRays({ paused }) {
  // Desktop only — caller already guards with !isMobile
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {LIGHT_RAYS.map((ray, i) => (
        <motion.div key={i} className="absolute"
          style={{
            width: ray.width, height: ray.length,
            background: "linear-gradient(to bottom, rgba(212,175,55,0.20), rgba(212,175,55,0.05), transparent)",
            transformOrigin: "top center",
            top: "50%", left: "50%", marginLeft: -ray.width / 2,
            rotate: `${ray.angle}deg`,
          }}
          animate={paused ? {} : { opacity: [ray.opacity, ray.opacity * 3.2, ray.opacity] }}
          transition={{ duration: ray.dur, repeat: Infinity, ease: "easeInOut", delay: ray.delay }}
        />
      ))}
      <motion.div className="absolute rounded-full" style={{
        width: 220, height: 220,
        background: "radial-gradient(circle, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 45%, transparent 72%)",
        filter: "blur(22px)",
      }}
        animate={paused ? {} : { scale: [1, 1.42, 1], opacity: [0.45, 0.88, 0.45] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Desktop: parallax calligraphy with Framer Motion
function CalligraphyAtmosphereDesktop({ mouse, paused }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: "blur(1px)", zIndex: 0 }}>
      {CALLIGRAPHY_CHARS.map((c, i) => (
        <motion.span key={i} className="absolute font-amiri select-none"
          style={{ top: c.top, left: c.left, fontSize: c.size, color: "#D4AF37", opacity: c.opacity,
            x: mouse.x * -5, y: mouse.y * -5 }}
          animate={paused ? {} : { opacity: [c.opacity * 0.35, c.opacity, c.opacity * 0.35], y: [0, -13, 0] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut", delay: c.delay }}
        >
          {c.char}
        </motion.span>
      ))}
    </div>
  );
}

// Mobile: pure CSS calligraphy — zero JS animation, visibility-paused
function CalligraphyAtmosphereMobile() {
  useEffect(() => {
    const root = document.getElementById("hero-calligraphy-mobile");
    if (!root) return;
    const onVis = () => {
      const state = document.hidden ? "paused" : "running";
      root.querySelectorAll("[data-canim]").forEach(el => {
        el.style.animationPlayState = state;
      });
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div id="hero-calligraphy-mobile" className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: "blur(1px)", zIndex: 0 }}>
      {CALLIGRAPHY_CHARS.slice(0, 4).map((c, i) => (
        <span key={i} data-canim="1" className="absolute font-amiri select-none"
          style={{
            top: c.top, left: c.left, fontSize: c.size,
            color: "#D4AF37", opacity: c.opacity,
            animation: `sh-twinkle ${c.dur}s ease-in-out infinite`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
}

function ManuscriptIntro() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="relative z-10 w-full max-w-xs mx-auto mt-7 px-4">
      <div className="rounded-2xl px-6 py-4 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(10,20,50,0.75) 0%, rgba(4,10,28,0.85) 100%)",

          border: "1px solid rgba(212,175,55,0.22)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.55), 0 0 24px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.15)",
        }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
          background:"linear-gradient(90deg,transparent 5%,rgba(212,175,55,0.60) 50%,transparent 95%)" }} />
        <p className="font-amiri text-sm leading-relaxed" dir="rtl"
          style={{ color:"rgba(245,230,180,0.78)", lineHeight:2, letterSpacing:"0.04em", fontSize:"15px" }}>
          علم الحروف — الحكمة الربانية في ميزان الأعداد والأسرار
        </p>
        <div className="flex items-center justify-center gap-2.5 mt-3">
          <div style={{ height:1, width:28, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.50))" }} />
          <div style={{ width:3, height:3, borderRadius:"50%", background:"rgba(212,175,55,0.50)" }} />
          <p className="font-inter text-[8px] uppercase tracking-[0.28em]" style={{ color:"rgba(212,175,55,0.50)" }}>
            Ilm al-Huruf
          </p>
          <div style={{ width:3, height:3, borderRadius:"50%", background:"rgba(212,175,55,0.50)" }} />
          <div style={{ height:1, width:28, background:"linear-gradient(to left,transparent,rgba(212,175,55,0.50))" }} />
        </div>
      </div>
    </motion.div>
  );
}

function GoldDivider({ delay = 0 }) {
  return (
    <motion.div initial={{ scaleX:0, opacity:0 }} animate={{ scaleX:1, opacity:1 }}
      transition={{ duration:0.7, delay, ease:"easeOut" }}
      className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto my-1">
      <div style={{ flex:1, height:0.5, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.35))" }} />
      <div style={{ width:4, height:4, borderRadius:"50%", background:"rgba(212,175,55,0.55)", boxShadow:"0 0 6px rgba(212,175,55,0.7)" }} />
      <div style={{ flex:1, height:0.5, background:"linear-gradient(to left,transparent,rgba(212,175,55,0.35))" }} />
    </motion.div>
  );
}

function IconOrb({ iconKey, accent }) {
  const [r, g, b] = accent;
  const color = `rgb(${r},${g},${b})`;
  const renderIcon = CARD_ICONS[iconKey];
  // Pass larger size to icon renderers
  const iconEl = renderIcon
    ? (() => {
        const el = renderIcon(color);
        return el ? { ...el, props: { ...el.props, width: 26, height: 26 } } : null;
      })()
    : <span className="font-amiri text-2xl" style={{ color }}>{iconKey}</span>;
  return (
    <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-xl relative"
      style={{
        background: `linear-gradient(145deg, rgba(${r},${g},${b},0.20) 0%, rgba(${r},${g},${b},0.07) 100%)`,
        border: `1px solid rgba(${r},${g},${b},0.38)`,
        boxShadow: `0 0 20px rgba(${r},${g},${b},0.25), inset 0 1px 0 rgba(${r},${g},${b},0.18)`,
      }}>
      {iconEl}
    </div>
  );
}

function CardInner({ card }) {
  const [r, g, b] = card.accent;
  return (
    <>
      <IconOrb iconKey={card.iconKey} accent={card.accent} />
      <p className="font-amiri font-bold leading-tight mb-0.5"
        style={{ fontSize:"clamp(1.2rem,5vw,1.5rem)", color:"#f5ead4", letterSpacing:"0.01em" }}>
        {card.arabic}
      </p>
      <p className="font-inter font-bold tracking-[0.22em] uppercase"
        style={{ fontSize:"7px", color:`rgba(${r},${g},${b},0.88)`, marginTop:1 }}>
        {card.label}
      </p>
      <div className="my-2.5 rounded-full"
        style={{ width:28, height:0.5, background:`linear-gradient(90deg,transparent,rgba(${r},${g},${b},0.55),transparent)` }} />
      <p className="font-inter leading-relaxed text-center"
        style={{ fontSize:"9px", color:"rgba(255,255,255,0.32)", letterSpacing:"0.04em" }}>
        {card.subtitle}
      </p>
    </>
  );
}

// Desktop: full animated title
function HeroTitleDesktop({ paused }) {
  return (
    <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.9, delay:0.4 }}
      className="text-center z-10 px-4 mt-4">
      <h1 className="font-amiri font-bold"
        style={{
          fontSize:"clamp(3rem,13vw,5.8rem)", color:"#f5ecd4", lineHeight:1.08, letterSpacing:"0.025em",
          textShadow:"0 0 36px rgba(212,175,55,0.48), 0 0 70px rgba(212,175,55,0.18), 0 2px 20px rgba(0,0,0,0.60)",
        }}>
        سرّ الحروف
      </h1>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9, duration:0.7 }} className="mt-3 space-y-1.5">
        <p className="font-inter font-bold tracking-[0.38em] uppercase"
          style={{ fontSize:"clamp(10px,2.6vw,14px)", color:"rgba(212,175,55,0.88)", textShadow:"0 0 14px rgba(212,175,55,0.30)" }}>
          Sirrul Huruf
        </p>
        <p className="font-inter tracking-[0.22em] uppercase"
          style={{ fontSize:"clamp(8px,1.6vw,10px)", color:"rgba(255,255,255,0.38)" }}>
          Advanced Ilm al-Huruf Analysis
        </p>
      </motion.div>
      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1.1, duration:0.9 }}
        className="mt-5 flex items-center justify-center gap-2.5">
        <div style={{ width:36, height:0.5, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.65))" }} />
        <div style={{ width:10, height:10, borderRadius:"50%", border:"1px solid rgba(212,175,55,0.40)", background:"rgba(212,175,55,0.08)", boxShadow:"0 0 8px rgba(212,175,55,0.35)" }} />
        <div style={{ width:6, height:6, borderRadius:"50%", background:"#D4AF37", boxShadow:"0 0 10px rgba(212,175,55,0.75)" }} />
        <div style={{ width:10, height:10, borderRadius:"50%", border:"1px solid rgba(212,175,55,0.40)", background:"rgba(212,175,55,0.08)", boxShadow:"0 0 8px rgba(212,175,55,0.35)" }} />
        <div style={{ width:36, height:0.5, background:"linear-gradient(to left,transparent,rgba(212,175,55,0.65))" }} />
      </motion.div>
    </motion.div>
  );
}

// Mobile: entrance animations only, no infinite loops
function HeroTitleMobile() {
  return (
    <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.9, delay:0.4 }}
      className="text-center z-10 px-4 mt-4">
      <h1 className="font-amiri font-bold"
        style={{
          fontSize:"clamp(3rem,13vw,5.8rem)", color:"#f5ecd4",
          lineHeight:1.08, letterSpacing:"0.025em",
          textShadow:"0 0 32px rgba(212,175,55,0.50), 0 2px 20px rgba(0,0,0,0.60)",
        }}>
        سرّ الحروف
      </h1>
      <div className="mt-3 space-y-1.5">
        <p className="font-inter font-bold tracking-[0.38em] uppercase"
          style={{ fontSize:"clamp(10px,2.6vw,14px)", color:"rgba(212,175,55,0.88)" }}>
          Sirrul Huruf
        </p>
        <p className="font-inter tracking-[0.22em] uppercase"
          style={{ fontSize:"clamp(8px,1.6vw,10px)", color:"rgba(255,255,255,0.38)" }}>
          Advanced Ilm al-Huruf Analysis
        </p>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2.5">
        <div style={{ width:36, height:0.5, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.65))" }} />
        <div style={{ width:6, height:6, borderRadius:"50%", background:"#D4AF37", boxShadow:"0 0 10px rgba(212,175,55,0.75)" }} />
        <div style={{ width:36, height:0.5, background:"linear-gradient(to left,transparent,rgba(212,175,55,0.65))" }} />
      </div>
    </motion.div>
  );
}

// Desktop: full Allah animations
function AllahCalligraphyDesktop({ paused }) {
  return (
    <motion.div initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }}
      transition={{ duration:1.4, ease:"easeOut" }}
      className="absolute z-20 flex items-center justify-center">
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:220, height:220, background:"radial-gradient(circle,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 38%,transparent 75%)", filter:"blur(22px)", zIndex:0, opacity:0.60 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:110, height:110, background:"radial-gradient(circle,rgba(212,175,55,0.32) 0%,rgba(212,175,55,0.10) 58%,transparent 82%)", filter:"blur(12px)", zIndex:1, opacity:0.70 }} />
      <motion.span className="font-amiri font-bold relative select-none"
        style={{
          fontSize:"3.4rem", color:"#D4AF37", lineHeight:1, letterSpacing:"0.03em", zIndex:2,
          textShadow:"0 0 14px rgba(212,175,55,0.70), 0 0 40px rgba(212,175,55,0.35)",
        }}
        animate={paused ? {} : { y:[0,-5,0] }}
        transition={{ duration:4.5, repeat:Infinity, ease:"easeInOut" }}>
        الله
      </motion.span>
    </motion.div>
  );
}

// Mobile: static Allah — no infinite animations
function AllahCalligraphyMobile() {
  return (
    <motion.div initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }}
      transition={{ duration:1.2, ease:"easeOut" }}
      className="absolute z-20 flex items-center justify-center">
      <div className="absolute rounded-full pointer-events-none" style={{
        width:160, height:160,
        background:"radial-gradient(circle,rgba(212,175,55,0.20) 0%,transparent 72%)",
        filter:"blur(18px)",
      }} />
      <span className="font-amiri font-bold relative select-none"
        style={{
          fontSize:"3.4rem", color:"#D4AF37", lineHeight:1, letterSpacing:"0.03em",
          textShadow:"0 0 18px rgba(212,175,55,0.70), 0 0 50px rgba(212,175,55,0.28)",
        }}>
        الله
      </span>
    </motion.div>
  );
}

function NavCards({ startNav }) {
  return (
    <div className="relative z-20 w-full mt-8 grid grid-cols-2 gap-3">
      {NAV_CARDS.map((card, i) => {
        const [r, g, b] = card.accent;
        return (
          <motion.div key={card.path}
            initial={{ opacity:0, y:26, scale:0.93 }}
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ delay:2.0 + i * 0.05, duration:0.4, ease:"easeOut" }}
            whileHover={{ scale:1.04, y:-6, transition:{ duration:0.22, ease:"easeOut" } }}
            whileTap={{ scale:0.96, transition:{ duration:0.1 } }}>
            <Link to={card.path} onClick={startNav}
              className="block rounded-2xl border flex flex-col items-center text-center"
              style={{
                background:`linear-gradient(155deg,rgba(${r},${g},${b},0.13) 0%,rgba(8,16,42,0.92) 55%,rgba(${r},${g},${b},0.05) 100%)`,
                borderColor:`rgba(${r},${g},${b},0.32)`,
                boxShadow:`0 0 28px rgba(${r},${g},${b},0.14),0 6px 24px rgba(0,0,0,0.55),inset 0 1px 0 rgba(${r},${g},${b},0.18)`,
                minHeight:185, padding:"24px 16px",
                WebkitTapHighlightColor:"transparent",
                touchAction:"manipulation",

                position:"relative", overflow:"hidden",
              }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
                background:`linear-gradient(90deg,transparent 5%,rgba(${r},${g},${b},0.50) 50%,transparent 95%)` }} />
              <CardInner card={card} />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

const ZERO_MV = { x: { get: () => 0, set: () => {}, on: () => () => {} }, y: { get: () => 0, set: () => {}, on: () => () => {} } };

// ── Main ──────────────────────────────────────────────────────────
export default function HeroSection({ mouse }) {
  const { startNav, isNavigating } = useNavigation();
  const isMobile = useIsMobile();
  const safeMouse = mouse ?? ZERO_MV;
  const wheelSize = `min(${isMobile ? "420px" : "500px"},88vw)`;

  return (
    <div className="font-inter relative flex flex-col items-center w-full pb-20 pt-4">

      {/* Light rays — desktop only */}
      {!isMobile && <LightRays paused={isNavigating} />}

      {/* Wheel container */}
      {isMobile ? (
        // Mobile: no floating animation on wrapper
        <div className="relative flex items-center justify-center" style={{ width:wheelSize, height:wheelSize, zIndex:2 }}>
          <OrbitalRings paused={isNavigating} isMobile={true} />
          <SacredWheel mouse={safeMouse} />
          <AllahCalligraphyMobile />
        </div>
      ) : (
        <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:7.5, repeat:Infinity, ease:"easeInOut" }}
          className="relative flex items-center justify-center"
          style={{ width:wheelSize, height:wheelSize, zIndex:2 }}>
          <OrbitalRings paused={isNavigating} isMobile={false} />
          <SacredWheel mouse={safeMouse} />
          <AllahCalligraphyDesktop paused={isNavigating} />
        </motion.div>
      )}

      {/* Title */}
      {isMobile ? <HeroTitleMobile /> : <HeroTitleDesktop paused={isNavigating} />}

      <GoldDivider delay={1.55} />
      <ManuscriptIntro />
      <NavCards startNav={startNav} />
    </div>
  );
}