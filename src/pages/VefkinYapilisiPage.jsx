import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import TanzimVefki from "../components/TanzimVefki";
import AnaVefk from "../components/AnaVefk";
import { VefkSessionProvider } from "../context/VefkSessionContext";
import { VefkSessionIndicator } from "../components/VefkSessionManager";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
};

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

const TABS = [
  { id: "ana",    label: "📜 Ana Vefk",    arabic: "الوفق الأصلي" },
  { id: "tanzim", label: "✨ Tanzim Vefki", arabic: "تنظيم الوفق" },
];

export default function VefkinYapilisiPage() {
  const [activeTab, setActiveTab] = useState("ana");

  return (
    <PageLayout>
      <VefkSessionProvider>
        {/* will-change:transform promotes to GPU layer, preventing repaint cascade on pinch zoom */}
        <div className="space-y-4" style={{ willChange: "transform" }}>

          {/* Session Indicator */}
          <VefkSessionIndicator />

          {/* Header */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}>
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>📜</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">طريقة الوفق</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>
            Vefkin Yapılışı — Ottoman Manuscript Method
          </p>
          <GoldDivider />
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: active ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl py-3.5 px-3 flex flex-col items-center gap-1 border transition-all relative overflow-hidden"
                style={{
                  background: active
                    ? "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)"
                    : "linear-gradient(145deg, rgba(4,12,34,0.99) 0%, rgba(2,8,22,0.99) 100%)",
                  borderColor: active ? G.borderHi : "rgba(255,255,255,0.08)",
                  boxShadow: active ? `0 0 24px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)` : "none",
                }}
              >
                {active && (
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />
                )}
                <span className="font-inter text-xs font-bold tracking-wide" style={{ color: active ? G.text : "rgba(255,255,255,0.40)" }}>
                  {tab.label}
                </span>
                <span className="font-amiri text-sm" style={{ color: active ? "rgba(212,175,55,0.75)" : "rgba(255,255,255,0.22)" }}>
                  {tab.arabic}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab content — both always mounted to preserve state, shown/hidden via CSS */}
        <div style={{ display: activeTab === "ana" ? "block" : "none" }}>
          <AnaVefk />
        </div>
        <div style={{ display: activeTab === "tanzim" ? "block" : "none" }}>
          <TanzimVefki />
        </div>

      </div>
      </VefkSessionProvider>
    </PageLayout>
  );
}