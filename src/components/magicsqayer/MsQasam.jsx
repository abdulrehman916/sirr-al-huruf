import { motion } from "framer-motion";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

/**
 * QASAM — Sacred oath section.
 * Container only; Turkish text will be inserted here by the owner.
 */
export default function MsQasam({ qasamText }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-6 space-y-4"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 28px ${G.glow}`,
      }}
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <h2
          className="font-inter font-bold tracking-[0.20em] uppercase"
          style={{ color: G.text, fontSize: "1.1rem", letterSpacing: "0.25em" }}
        >
          QASAM
        </h2>
        <div
          className="mx-auto"
          style={{
            width: 48,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)`,
          }}
        />
      </div>

      {/* Content area */}
      <div
        className="rounded-xl p-5 min-h-[120px]"
        style={{
          background: "rgba(212,175,55,0.04)",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        {qasamText ? (
          <p
            className="font-amiri text-lg leading-relaxed text-center"
            dir="rtl"
            style={{ color: "rgba(255,255,255,0.85)", whiteSpace: "pre-wrap" }}
          >
            {qasamText}
          </p>
        ) : (
          <p
            className="font-inter text-xs text-center pt-4"
            style={{ color: "rgba(255,255,255,0.20)" }}
          >
            — Sacred Oath Text —
          </p>
        )}
      </div>
    </motion.div>
  );
}