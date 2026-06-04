import { motion } from "framer-motion";
import { useNavigation } from "../context/NavigationContext";

/**
 * Premium page header — celestial glow bloom, manuscript divider, entrance animation.
 * Usage: <PageTitle arabic="..." latin="..." subtitle="..." icon="..." />
 */
export default function PageTitle({ arabic, latin, subtitle, icon }) {
  const { isNavigating } = useNavigation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: "easeOut" }}
      className="text-center relative mb-3 overflow-hidden"
    >
      {/* Celestial bloom */}
      <div className="absolute pointer-events-none" style={{
        top: "50%", left: "50%",
        transform: "translate(-50%, -52%)",
        width: 280, height: 130,
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 48%, transparent 76%)",
        filter: "blur(24px)", zIndex: 0,
      }} />

      {/* Icon orb */}
      {icon && (
        <motion.div
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.50, delay: 0.10 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-4 relative"
          style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.05) 100%)",
            borderColor: "rgba(212,175,55,0.28)",
            boxShadow: "0 0 28px rgba(212,175,55,0.18), 0 4px 16px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.22)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 1,
          }}
        >
          <motion.span
            className="font-amiri text-2xl"
            style={{ color: "#D4AF37" }}
            animate={isNavigating ? {} : { textShadow: [
              "0 0 6px rgba(212,175,55,0.35)",
              "0 0 18px rgba(212,175,55,0.78)",
              "0 0 6px rgba(212,175,55,0.35)",
            ]}}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.span>
        </motion.div>
      )}

      {/* Arabic title */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="font-amiri font-bold leading-tight relative"
        style={{
          fontSize: "clamp(1.9rem, 7.5vw, 2.9rem)",
          color: "#f5ead4",
          textShadow: "0 0 26px rgba(212,175,55,0.42), 0 0 58px rgba(212,175,55,0.14), 0 2px 12px rgba(0,0,0,0.62)",
          letterSpacing: "0.015em",
          zIndex: 1,
        }}
      >
        {arabic}
      </motion.h1>

      {/* Latin label */}
      {latin && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-inter font-bold tracking-[0.30em] uppercase mt-1.5 relative"
          style={{ fontSize: "clamp(8px, 2vw, 10.5px)", color: "rgba(212,175,55,0.82)", zIndex: 1 }}
        >
          {latin}
        </motion.p>
      )}

      {/* Ornamental divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        className="flex items-center justify-center gap-2.5 mt-3.5 relative"
        style={{ zIndex: 1 }}
      >
        <div style={{ width: 44, height: 0.5, background: "linear-gradient(to right,transparent,rgba(212,175,55,0.68))" }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(212,175,55,0.55)", boxShadow: "0 0 5px rgba(212,175,55,0.75)" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%",
          background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.48)",
          boxShadow: "0 0 10px rgba(212,175,55,0.38)" }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(212,175,55,0.55)", boxShadow: "0 0 5px rgba(212,175,55,0.75)" }} />
        <div style={{ width: 44, height: 0.5, background: "linear-gradient(to left,transparent,rgba(212,175,55,0.68))" }} />
      </motion.div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="font-inter tracking-[0.24em] uppercase mt-2 relative"
          style={{ fontSize: "clamp(7.5px, 1.7vw, 9.5px)", color: "rgba(255,255,255,0.33)", zIndex: 1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}