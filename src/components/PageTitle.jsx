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
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-center relative mb-4 overflow-hidden"
    >
      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border mb-2.5"
          style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)",
            borderColor: "rgba(212,175,55,0.25)",
            boxShadow: "0 0 18px rgba(212,175,55,0.15)",
          }}
        >
          <span className="font-amiri text-base" style={{ color: "#D4AF37" }}>
            {icon}
          </span>
        </motion.div>
      )}

      {/* Arabic title */}
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-amiri font-bold leading-tight"
        style={{
          fontSize: "1.55rem",
          color: "#f5ead4",
          textShadow: "0 0 18px rgba(212,175,55,0.30)",
        }}
      >
        {arabic}
      </motion.h1>

      {/* Latin label */}
      {latin && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="font-inter font-bold tracking-[0.22em] uppercase mt-1"
          style={{ fontSize: "7.5px", color: "rgba(212,175,55,0.70)" }}
        >
          {latin}
        </motion.p>
      )}

      {/* Divider */}
      {subtitle && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-2"
        >
          <div style={{ width: 32, height: 0.5, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.55))" }} />
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(212,175,55,0.50)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.40)" }} />
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(212,175,55,0.50)" }} />
          <div style={{ width: 32, height: 0.5, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.55))" }} />
        </motion.div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="font-inter tracking-[0.20em] uppercase mt-1.5"
          style={{ fontSize: "7px", color: "rgba(255,255,255,0.30)" }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}