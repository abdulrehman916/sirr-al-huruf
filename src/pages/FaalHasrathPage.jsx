import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import ErrorBoundary from "../components/ErrorBoundary";
import FaalAli from "../components/faal/FaalAli";
import FaalLuqman from "../components/faal/FaalLuqman";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
};

const TABS = [
  { id: "ali",    label: "✨ Faal Ali",    arabic: "فأل علي" },
  { id: "luqman", label: "🌟 Faal Luqman", arabic: "فأل لقمان" },
];

function FaalHasrathContent() {
  const [activeTab, setActiveTab] = useState('ali');

  return (
    <div className="space-y-4">
      <PageTitle arabic="فأل" latin="Faal Hasrath" subtitle="Divination System" icon="🔮" />
      
      {/* Tab Navigation */}
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

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'ali' ? <FaalAli /> : <FaalLuqman />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function FaalHasrathPage() {
  return (
    <ErrorBoundary fallbackMessage="Failed to load Faal Hasrath. Please try refreshing.">
      <PageLayout>
        <FaalHasrathContent />
      </PageLayout>
    </ErrorBoundary>
  );
}