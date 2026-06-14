// ═══════════════════════════════════════════════════
// ASTRO CLOCK PAGE
// Completely independent module. No shared logic.
// ═══════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import LiveAstroClock from "../components/astroclock/LiveAstroClock";
import PlanetaryHourTable from "../components/astroclock/PlanetaryHourTable";
import LiveMoonCenter from "../components/astroclock/LiveMoonCenter";
import LivePlanetCenter from "../components/astroclock/LivePlanetCenter";
import DayAnalysisPanel from "../components/astroclock/DayAnalysisPanel";
import LunarMansionsPanel from "../components/astroclock/LunarMansionsPanel";
import AdvancedTimingAdvisor from "../components/astroclock/AdvancedTimingAdvisor";
import AsteroidKnowledgeSummary from "../components/astroclock/AsteroidKnowledgeSummary";
import { ASTRO_CLOCK_ENGINE_STATUS } from "../lib/astroClockEngine";
import { usePageState } from "../context/PageStateContext";

const PAGE_KEY = 'astro-clock';

export default function AstroClockPage() {
  const { getPageState, setPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, { initialized: true });

  const [engineStatus, setEngineStatus] = useState(null);

  useEffect(() => {
    setPageState(PAGE_KEY, { ...initialState, lastVisited: new Date().toISOString() });
    setEngineStatus(ASTRO_CLOCK_ENGINE_STATUS);
  }, [setPageState]);

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* Header */}
        <PageTitle
          arabic="الساعة الفلكية"
          latin="Astro Clock"
          subtitle="Astrological Timing Framework"
          icon="🕰"
        />

        {/* Engine Status */}
        {engineStatus && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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

        {/* SECTION 1: Live Astro Clock */}
        <LiveAstroClock />

        {/* SECTION 2 & 3: Planetary Hours (Day + Night) */}
        <PlanetaryHourTable />

        {/* SECTION 4: Live Moon Center */}
        <LiveMoonCenter />

        {/* SECTION 5: Live Planet Center */}
        <LivePlanetCenter />

        {/* SECTION 6: Day Analysis */}
        <DayAnalysisPanel />

        {/* SECTION 7: Lunar Mansions */}
        <LunarMansionsPanel />

        {/* SECTION 8: Advanced Timing Advisor */}
        <AdvancedTimingAdvisor />

        {/* Asteroid Knowledge Summary */}
        <AsteroidKnowledgeSummary />

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
            ✦ Framework Ready
          </p>
          <p className="font-inter text-sm mb-2" style={{ color: "rgba(255,255,255,0.60)" }}>
            Astro Clock module initialized successfully.
          </p>
          <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
            PDF-based calculations, planetary hours, and celestial rules will be added from manuscript sources.
          </p>
        </motion.div>

      </div>
    </PageLayout>
  );
}