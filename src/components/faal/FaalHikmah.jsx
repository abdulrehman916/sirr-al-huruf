import { motion } from "framer-motion";

export default function FaalHikmah() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Empty placeholder for source pages */}
      <div
        className="rounded-2xl border p-8 flex flex-col items-center justify-center min-h-[300px]"
        style={{
          background: "linear-gradient(145deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)",
          borderColor: "rgba(212,175,55,0.25)",
        }}
      >
        <p className="font-amiri text-center" style={{ fontSize: "1.3rem", color: "rgba(245,208,96,0.60)" }}>
          فال الحكمة
        </p>
        <p className="font-inter text-xs mt-2 text-center" style={{ color: "rgba(255,255,255,0.30)" }}>
          Source pages pending
        </p>
      </div>
    </motion.div>
  );
}