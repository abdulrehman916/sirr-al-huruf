import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import TanzimVefki from "../components/TanzimVefki";
import AnaVefk from "../components/AnaVefk";
import HaliVasat2Usul from "../components/HaliVasat2Usul";

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
  { id: "ana",    label: "📜 Ana Vefk",       arabic: "الوفق الأصلي" },
  { id: "tanzim", label: "✨ Tanzim Vefki",    arabic: "تنظيم الوفق" },
  { id: "hv2",    label: "⬡ Hâli Vasat 2",   arabic: "الوسط الحالي" },
];

export default function VefkinYapilisiPage() {
  const [activeTab, setActiveTab] = useState("ana");

  return (
    <PageLayout>
      <div className="space-y-4">

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
        <div className="grid grid-cols-3 gap-2">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="rounded-xl py-3 px-3 flex flex-col items-center gap-0.5 border transition-all"
                style={{
                  background: active ? G.bg : "rgba(4,12,34,0.97)",
                  borderColor: active ? G.borderHi : "rgba(255,255,255,0.08)",
                  boxShadow: active ? `0 0 16px ${G.glow}` : "none",
                }}
              >
                <span className="font-inter text-xs font-bold" style={{ color: active ? G.text : "rgba(255,255,255,0.45)" }}>
                  {tab.label}
                </span>
                <span className="font-amiri text-sm" style={{ color: active ? "rgba(212,175,55,0.70)" : "rgba(255,255,255,0.25)" }}>
                  {tab.arabic}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content — each system renders its own isolated component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "ana" ? <AnaVefk /> : activeTab === "tanzim" ? <TanzimVefki /> : <HaliVasat2Usul />}
          </motion.div>
        </AnimatePresence>

      </div>
    </PageLayout>
  );
}