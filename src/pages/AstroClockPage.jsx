// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK PAGE — COMPREHENSIVE TRADITIONAL SYSTEM
// 9 Sections: Day Analysis, Planetary Hours, Moon Status, Manazil, Planets, Timing Advisor
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { AstroClockLanguageProvider, useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import LiveDayAnalysis from "../components/astroclock/LiveDayAnalysis";
import DaytimePlanetaryHours from "../components/astroclock/DaytimePlanetaryHours";
import NighttimePlanetaryHours from "../components/astroclock/NighttimePlanetaryHours";
import LiveMoonStatus from "../components/astroclock/LiveMoonStatus";
import ManazilDatabase from "../components/astroclock/ManazilDatabase";
import PlanetKnowledgePanels from "../components/astroclock/PlanetKnowledgePanels";
import ActionTimingAdvisor from "../components/astroclock/ActionTimingAdvisor";
import ZodiacKnowledgePanel from "../components/astroclock/ZodiacKnowledgePanel";
import IncenseAdvisor from "../components/astroclock/IncenseAdvisor";
import BirthProfileAnalyzer from "../components/astroclock/BirthProfileAnalyzer";
import { ASTRO_CLOCK_LIVE_ENGINE_STATUS } from "@/lib/astroClockLiveEngine";

function LanguageToggle() {
  const { t, toggleLanguage } = useAstroClockLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all"
      style={{
        background: "rgba(212,175,55,0.10)",
        color: "#F5D060",
        borderColor: "rgba(212,175,55,0.40)"
      }}
    >
      {t.toggle}
    </button>
  );
}

function AstroClockContent() {
  const { isMalayalam } = useAstroClockLanguage();
  const [engineStatus, setEngineStatus] = useState(ASTRO_CLOCK_LIVE_ENGINE_STATUS);

  return (
    <PageLayout>
      <div className="space-y-6 pb-8">

        {/* Header with Language Toggle */}
        <div className="flex items-center justify-between mb-6">
          <PageTitle
            arabic="الساعة الفلكية"
            latin="Astro Clock"
            subtitle="Traditional Ilm al-Huruf Timing System"
            icon="🕰"
          />
          <LanguageToggle />
        </div>

        {/* Engine Status */}
        {engineStatus && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border p-3 text-center"
            style={{
              background: "rgba(212,175,55,0.04)",
              borderColor: "rgba(212,175,55,0.20)",
            }}
          >
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.45)" }}>
              {engineStatus.note}
            </p>
          </motion.div>
        )}

        {/* SECTION 1: Live Day Analysis */}
        <LiveDayAnalysis />

        {/* SECTION 2: Daytime 12 Hours */}
        <DaytimePlanetaryHours />

        {/* SECTION 3: Nighttime 12 Hours */}
        <NighttimePlanetaryHours />

        {/* SECTION 4: Live Moon Status */}
        <LiveMoonStatus />

        {/* SECTION 5: Manazil Database */}
        <ManazilDatabase />

        {/* SECTION 6: Planet Knowledge Panels */}
        <PlanetKnowledgePanels />

        {/* SECTION 7: Zodiac Knowledge Panel */}
        <ZodiacKnowledgePanel />

        {/* SECTION 8: Incense Advisor */}
        <IncenseAdvisor />

        {/* SECTION 9: Action Timing Advisor */}
        <ActionTimingAdvisor />

        {/* SECTION 10: Birth Profile Analyzer */}
        <BirthProfileAnalyzer />

        {/* Framework Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-2xl border p-5 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)",
            borderColor: "rgba(212,175,55,0.25)",
            boxShadow: "0 2px 20px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.06)",
          }}
        >
          <p className="font-inter text-[9px] uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(212,175,55,0.55)" }}>
            ✦ Traditional System Ready
          </p>
          <p className="font-inter text-sm mb-2" style={{ color: "rgba(255,255,255,0.60)" }}>
            {isMalayalam 
              ? "സമ്പൂർണ്ണ പാരമ്പര്യ ഇൽം അൽ-ഹുറൂഫ് / മൻസിൽ / സഅത്ത് സമയക്രമം സജ്ജമാക്കി" 
              : "Complete traditional Ilm al-Huruf / Manazil / Sa'at timing system initialized"}
          </p>
          <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
            {isMalayalam
              ? "ഗ്രന്ഥങ്ങളിൽ നിന്നുള്ള കൃത്യമായ കണക്കുകൂട്ടലുകൾ, ഗ്രഹ മണിക്കൂറുകൾ, ചാന്ദ്ര നക്ഷത്ര നിയമങ്ങൾ എന്നിവ ചേർക്കും"
              : "PDF-based calculations, planetary hours, and lunar mansion rules will be added from manuscript sources"}
          </p>
        </motion.div>

      </div>
    </PageLayout>
  );
}

export default function AstroClockPage() {
  return (
    <AstroClockLanguageProvider>
      <AstroClockContent />
    </AstroClockLanguageProvider>
  );
}