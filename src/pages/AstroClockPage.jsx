// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK PAGE — RESTRUCTURED UX
// 9 Sections: Day Analysis, Planetary Hours, Moon Status, Manazil, Planets, Timing Advisor
// Astro Clock module only — completely isolated
// ✨ NEW: Search box at top, Today's Summary first
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { AstroClockLanguageProvider, useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import LiveDayAnalysis from "../components/astroclock/LiveDayAnalysis";
import LivePlanetaryHours from "../components/astroclock/LivePlanetaryHours";
import DaytimePlanetaryHours from "../components/astroclock/DaytimePlanetaryHours";
import NighttimePlanetaryHours from "../components/astroclock/NighttimePlanetaryHours";
import LiveMoonPosition from "../components/astroclock/LiveMoonPosition";
import ManazilDatabase from "../components/astroclock/ManazilDatabase";
import PlanetKnowledgePanels from "../components/astroclock/PlanetKnowledgePanels";
import ProfessionalTimingDecisionEngine from "../components/astroclock/ProfessionalTimingDecisionEngine";
import KarmaTimingAdvisor from "../components/astroclock/KarmaTimingAdvisor";

import AdvancedManuscriptDecisionEngine from "../components/astroclock/AdvancedManuscriptDecisionEngine.jsx";
import ZodiacKnowledgePanel from "../components/astroclock/ZodiacKnowledgePanel.jsx";
import IncenseAdvisor from "../components/astroclock/IncenseAdvisor.jsx";
import BirthProfileAnalyzer from "../components/astroclock/BirthProfileAnalyzer.jsx";
import TraditionalMoonTransitForecast from "../components/astroclock/TraditionalMoonTransitForecast.jsx";
import BuhurReference from "../components/astroclock/BuhurReference.jsx";
import PlanetaryHourVerification from "../components/astroclock/PlanetaryHourVerification.jsx";
import PlanetaryHourBookView from "../components/astroclock/PlanetaryHourBookView.jsx";
import Full24HourPlanetaryChart from "../components/astroclock/Full24HourPlanetaryChart.jsx";
import MoonMansionTracker from "../components/astroclock/MoonMansionTracker.jsx";
import { ASTRO_CLOCK_LIVE_ENGINE_STATUS } from "@/lib/astroClockLiveEngine";
import { Link } from "react-router-dom";
import AstroClockErrorBoundary from "../components/astroclock/AstroClockErrorBoundary";
import AstroClockSearch from "../components/astroclock/AstroClockSearch.jsx";
import BookBasedSearchBox from "../components/astroclock/BookBasedSearchBox.jsx";
import TodayOverviewFull from "../components/astroclock/TodayOverviewFull.jsx";

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

        {/* Header with Language Toggle and Audit Links */}
        <div className="flex items-center justify-between mb-6">
          <PageTitle
            arabic="الساعة الفلكية"
            latin="Astro Clock"
            subtitle="Traditional Ilm al-Huruf Timing System"
            icon="🕰"
          />
          <div className="flex items-center gap-3">
            <Link
              to="/manuscript-library"
              className="px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              style={{
                background: "rgba(212,175,55,0.10)",
                color: "#F5D060",
                borderColor: "rgba(212,175,55,0.40)"
              }}
            >
              📚 {isMalayalam ? "ഗ്രന്ഥശേഖരം" : "Library"}
            </Link>
            <Link
              to="/manuscript-action-finder"
              className="px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              style={{
                background: "rgba(212,175,55,0.10)",
                color: "#F5D060",
                borderColor: "rgba(212,175,55,0.40)"
              }}
            >
              🔍 {isMalayalam ? "തിരയുക" : "Finder"}
            </Link>
            <Link
              to="/manuscript-audit-full"
              className="px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              style={{
                background: "rgba(212,175,55,0.10)",
                color: "#F5D060",
                borderColor: "rgba(212,175,55,0.40)"
              }}
            >
              📖 {isMalayalam ? "ഹസ്തലിഖിത" : "Audit"}
            </Link>
            <LanguageToggle />
          </div>
        </div>

        {/* Engine Status */}
        {engineStatus && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border p-3 text-center mb-6"
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

        {/* ✨ ENHANCED: Book-Based Search Box (Top Position) */}
        <AstroClockErrorBoundary label="Book Search">
          <BookBasedSearchBox currentAstroData={{}} />
        </AstroClockErrorBoundary>

        {/* ✨ RESTRUCTURED: Full Today Overview with 7 Influences */}
        <AstroClockErrorBoundary label="Today Overview">
          <TodayOverviewFull />
        </AstroClockErrorBoundary>

        {/* ORIGINAL: Live Day Analysis (Preserved) */}
        <AstroClockErrorBoundary label="Live Day Analysis"><LiveDayAnalysis /></AstroClockErrorBoundary>

        {/* SECTION 2: Current Planetary Hour (Live with Countdown) */}
        <AstroClockErrorBoundary label="Current Planetary Hour"><LivePlanetaryHours /></AstroClockErrorBoundary>

        {/* SECTION 4: Daytime 12 Hours */}
        <AstroClockErrorBoundary label="Daytime Hours"><DaytimePlanetaryHours /></AstroClockErrorBoundary>

        {/* SECTION 5: Nighttime 12 Hours */}
        <AstroClockErrorBoundary label="Nighttime Hours"><NighttimePlanetaryHours /></AstroClockErrorBoundary>

        {/* SECTION 6: Live Moon Position */}
        <AstroClockErrorBoundary label="Moon Position"><LiveMoonPosition /></AstroClockErrorBoundary>

        {/* SECTION 7: Manazil Database */}
        <AstroClockErrorBoundary label="Moon Mansions"><ManazilDatabase /></AstroClockErrorBoundary>

        {/* SECTION 8: Planet Knowledge Panels */}
        <AstroClockErrorBoundary label="Planet Knowledge"><PlanetKnowledgePanels /></AstroClockErrorBoundary>

        {/* SECTION 9: Zodiac Knowledge Panel */}
        <AstroClockErrorBoundary label="Zodiac Knowledge"><ZodiacKnowledgePanel /></AstroClockErrorBoundary>

        {/* SECTION 10: Incense Advisor */}
        <AstroClockErrorBoundary label="Incense Advisor"><IncenseAdvisor /></AstroClockErrorBoundary>

        {/* SECTION 11: Professional Timing Decision Engine */}
        <AstroClockErrorBoundary label="Professional Timing"><ProfessionalTimingDecisionEngine /></AstroClockErrorBoundary>

        {/* SECTION 12: Karma Timing Advisor */}
        <AstroClockErrorBoundary label="Karma Timing"><KarmaTimingAdvisor /></AstroClockErrorBoundary>

        {/* SECTION 13: Advanced Manuscript Decision Engine */}
        <AstroClockErrorBoundary label="Advanced Decision Engine"><AdvancedManuscriptDecisionEngine /></AstroClockErrorBoundary>

        {/* SECTION 14: Birth Profile Analyzer */}
        <AstroClockErrorBoundary label="Birth Profile"><BirthProfileAnalyzer /></AstroClockErrorBoundary>

        {/* SECTION 15: Traditional Moon Transit Forecast */}
        <AstroClockErrorBoundary label="Moon Transit"><TraditionalMoonTransitForecast /></AstroClockErrorBoundary>

        {/* SECTION 16: Buhur Reference */}
        <AstroClockErrorBoundary label="Buhur Reference"><BuhurReference /></AstroClockErrorBoundary>

        {/* SECTION 17: Planetary Hour Verification */}
        <AstroClockErrorBoundary label="Hour Verification"><PlanetaryHourVerification /></AstroClockErrorBoundary>

        {/* SECTION 18: Planetary Hour Book View */}
        <AstroClockErrorBoundary label="Book View"><PlanetaryHourBookView /></AstroClockErrorBoundary>

        {/* SECTION 19: Full 24-Hour Planetary Chart */}
        <AstroClockErrorBoundary label="24-Hour Chart"><Full24HourPlanetaryChart /></AstroClockErrorBoundary>

        {/* SECTION 20: Moon Mansion Tracker */}
        <AstroClockErrorBoundary label="Moon Tracker"><MoonMansionTracker /></AstroClockErrorBoundary>

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
              ? "തത്സമയ സൂര്യോദയം/സൂര്യാസ്തമയം, ഗ്രഹ മണിക്കൂറുകൾ, ചന്ദ്ര സ്ഥാനം — ബ്രൗസർ ജിയോലൊക്കേഷൻ ഉപയോഗിച്ച് കണക്കാക്കുന്നു"
              : "Live sunrise/sunset, planetary hours, moon position — calculated using browser geolocation"}
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