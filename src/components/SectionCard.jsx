import { motion } from "framer-motion";

/**
 * Manuscript-inspired premium card with floating light, elegant border,
 * and smooth entrance animation. Drop-in replacement for inline card divs.
 *
 * Props:
 *   children   — card content
 *   delay      — entrance animation delay (default 0)
 *   glow       — boolean, adds a stronger ambient gold glow (default false)
 *   accent     — optional CSS color string to tint the border/glow
 *   className  — extra class names
 *   style      — extra inline styles
 *   noPad      — skip default padding (default false)
 */
export default function SectionCard({
  children,
  delay = 0,
  glow = false,
  accent,
  className = "",
  style = {},
  noPad = false,
}) {
  const borderColor = accent
    ? accent.replace("1)", "0.28)")
    : "rgba(212,175,55,0.20)";
  const glowColor = accent
    ? accent.replace("1)", "0.12)")
    : "rgba(212,175,55,0.10)";
  const sheen = accent
    ? accent.replace("1)", "0.35)")
    : "rgba(212,175,55,0.35)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl ${noPad ? "" : "p-4"} ${className}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(8,16,40,0.98) 0%, rgba(3,8,22,0.99) 100%)",
        border: `1px solid ${borderColor}`,
        boxShadow: glow
          ? `0 6px 40px rgba(0,0,0,0.60), 0 0 28px ${glowColor}, inset 0 1px 0 rgba(212,175,55,0.10)`
          : `0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)`,
        ...style,
      }}
    >
      {/* Manuscript top-sheen line */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${sheen} 50%, transparent 100%)`,
          zIndex: 1,
        }}
      />

      {/* Floating light in top-right corner */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(18px)",
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}