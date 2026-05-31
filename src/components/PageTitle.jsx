import { motion } from "framer-motion";

/**
 * Premium page header with celestial glow, manuscript divider, and entrance animation.
 * Usage: <PageTitle arabic="..." latin="..." subtitle="..." icon="..." />
 */
export default function PageTitle({ arabic, latin, subtitle, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="text-center relative mb-2"
    >
      {/* Celestial glow bloom */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          width: 260,
          height: 120,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 45%, transparent 75%)",
          filter: "blur(22px)",
          zIndex: 0,
        }}
      />

      {/* Icon orb */}
      {icon && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/20 mb-4 relative"
          style={{
            background:
              "linear-gradient(145deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.06) 100%)",
            boxShadow:
              "0 0 32px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.20)",
            zIndex: 1,
          }}
        >
          <motion.span
            className="font-amiri text-2xl"
            style={{ color: "#D4AF37" }}
            animate={{
              textShadow: [
                "0 0 8px rgba(212,175,55,0.40)",
                "0 0 20px rgba(212,175,55,0.80)",
                "0 0 8px rgba(212,175,55,0.40)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
          fontSize: "clamp(2rem, 8vw, 3rem)",
          color: "#f5ead4",
          textShadow:
            "0 0 28px rgba(212,175,55,0.45), 0 0 60px rgba(212,175,55,0.15), 0 2px 12px rgba(0,0,0,0.60)",
          zIndex: 1,
        }}
      >
        {arabic}
      </motion.h1>

      {/* Latin subtitle row */}
      {latin && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-inter font-bold tracking-[0.28em] uppercase mt-1 relative"
          style={{
            fontSize: "clamp(9px, 2.2vw, 11px)",
            color: "rgba(212,175,55,0.80)",
            zIndex: 1,
          }}
        >
          {latin}
        </motion.p>
      )}

      {/* Manuscript ornamental divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        className="flex items-center justify-center gap-2.5 mt-3 relative"
        style={{ zIndex: 1 }}
      >
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(212,175,55,0.70))",
          }}
        />
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(212,175,55,0.55)",
            boxShadow: "0 0 6px rgba(212,175,55,0.80)",
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "rgba(212,175,55,0.20)",
            border: "1px solid rgba(212,175,55,0.50)",
            boxShadow: "0 0 10px rgba(212,175,55,0.40)",
          }}
        />
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(212,175,55,0.55)",
            boxShadow: "0 0 6px rgba(212,175,55,0.80)",
          }}
        />
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(to left, transparent, rgba(212,175,55,0.70))",
          }}
        />
      </motion.div>

      {/* Page subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="font-inter tracking-[0.22em] uppercase mt-2 relative"
          style={{
            fontSize: "clamp(8px, 1.8vw, 10px)",
            color: "rgba(255,255,255,0.35)",
            zIndex: 1,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}