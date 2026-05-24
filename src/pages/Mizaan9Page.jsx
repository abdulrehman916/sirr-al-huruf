import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";

export default function Mizaan9Page() {
  return (
    <PageLayout accentColor="gold">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 20px rgba(212,175,55,0.15)" }}>
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>٩</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">ميزان الأعداد</h1>
          <p className="font-inter text-xs tracking-widest uppercase mt-1.5" style={{ color: "rgba(212,175,55,0.50)" }}>Mizaan 9 System</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-500/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-500/70" />
          </div>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="rounded-2xl border p-10 text-center"
          style={{ background: "rgba(15,48,80,0.92)", borderColor: "rgba(212,175,55,0.25)", boxShadow: "0 0 40px rgba(212,175,55,0.08), 0 4px 24px rgba(0,0,0,0.4)" }}
        >
          {/* Animated glow orb */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full mx-auto mb-6"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)" }}
          />

          <p className="font-amiri text-6xl font-bold mb-4" style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.6)" }}>٩</p>
          <h2 className="font-amiri text-2xl font-bold text-white mb-3">قريباً</h2>
          <p className="font-inter text-sm text-white/40 tracking-widest uppercase mb-6">Coming Soon</p>

          <div className="rounded-xl border border-yellow-500/15 p-4" style={{ background: "rgba(212,175,55,0.04)" }}>
            <p className="font-inter text-xs text-white/35 leading-relaxed">
              The Mizaan 9 system is currently under development. This advanced numerological framework will provide deep insights into the hidden properties of Arabic letters and their relationships with the number 9.
            </p>
          </div>
        </motion.div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 gap-3">
          {[
            { arabic: "الجذر", label: "Digital Root Analysis", desc: "Calculate the digital root of any Arabic phrase" },
            { arabic: "التناسب", label: "Proportional Mapping", desc: "Map letters to the sacred 9-based grid" },
            { arabic: "الخواص", label: "Hidden Properties", desc: "Discover numerical secrets in sacred texts" },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              className="rounded-xl border p-4 flex items-center gap-4"
              style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.12)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <span className="font-amiri text-lg" style={{ color: "rgba(212,175,55,0.60)" }}>{feat.arabic}</span>
              </div>
              <div>
                <p className="font-inter text-xs font-semibold text-white/60 uppercase tracking-wider">{feat.label}</p>
                <p className="font-inter text-[11px] text-white/30 mt-0.5">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}