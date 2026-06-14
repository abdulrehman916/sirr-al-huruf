// ═══════════════════════════════════════════════════════════════
// MOON TRANSIT ADVISOR — COMPREHENSIVE TIMING GUIDANCE
// Real-time moon transit analysis with actionable recommendations
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, ArrowRight, Clock, Calendar, Info, Star, AlertCircle, CheckCircle, XCircle, Sun } from "lucide-react";
import { calculateMoonTransits, calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { DAY_INFO, PLANET_INFO, getCurrentPlanetaryHour } from "@/lib/astroClockLiveEngine.js";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
  success:  "rgba(34,197,94,0.60)",
  danger:   "rgba(239,68,68,0.60)",
  neutral:  "rgba(148,163,184,0.60)"
};

export default function MoonTransitAdvisor() {
  const { isMalayalam } = useAstroClockLanguage();
  const [advisorData, setAdvisorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateAdvisorData();
    const interval = setInterval(updateAdvisorData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  function updateAdvisorData() {
    const now = new Date();
    
    // Get moon transits
    const transits = calculateMoonTransits(now);
    
    // Get moon position
    const moonPos = calculateMoonPosition(now);
    
    // Get day info
    const dayIndex = now.getDay();
    const dayInfo = DAY_INFO[dayIndex];
    
    // Get planetary hour (using default sunrise/sunset for demo)
    const planetHour = getCurrentPlanetaryHour(now, 6.5, 18.25);
    
    // Calculate status (Sa'd/Nahs/Neutral)
    const status = calculateMoonStatus(moonPos, dayInfo, planetHour);
    
    // Get best/worst actions
    const actions = getActionRecommendations(status, moonPos, dayInfo);
    
    setAdvisorData({
      transits,
      moonPos,
      dayInfo,
      planetHour,
      status,
      actions,
      timestamp: now
    });
    setLoading(false);
  }

  if (loading || !advisorData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border p-8 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)",
          borderColor: G.border
        }}
      >
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: G.text, borderTopColor: "transparent" }} />
        <p className="mt-4 font-inter text-sm" style={{ color: G.dim }}>
          {isMalayalam ? "കണക്കാക്കുന്നു..." : "Calculating..."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Moon className="w-7 h-7" style={{ color: G.text }} />
        <div>
          <h2 className="font-malayalam-lg uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ചന്ദ്ര ഗതാഗത ഉപദേഷ്ടാവ്" : "Moon Transit Advisor"}
          </h2>
          <p className="font-malayalam-sm" style={{ color: G.dim }}>
            {isMalayalam ? "തത്സമയ ചാന്ദ്ര സമയ നിർദ്ദേശങ്ങൾ" : "Real-time lunar timing guidance"}
          </p>
        </div>
      </div>

      {/* CURRENT STATUS */}
      <CurrentStatusSection data={advisorData} isMalayalam={isMalayalam} />

      {/* TRANSIT TIMING */}
      <TransitTimingSection data={advisorData} isMalayalam={isMalayalam} />

      {/* ACTION RECOMMENDATIONS */}
      <ActionRecommendationsSection data={advisorData} isMalayalam={isMalayalam} />

      {/* ASTROLOGICAL BASIS */}
      <AstrologicalBasisSection data={advisorData} isMalayalam={isMalayalam} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// CURRENT STATUS SECTION
// ─────────────────────────────────────────────────────────────

function CurrentStatusSection({ data, isMalayalam }) {
  const { moonPos, status } = data;

  const statusColors = {
    saad: { bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.50)", text: "#22c55e" },
    nahs: { bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.50)", text: "#ef4444" },
    neutral: { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.50)", text: "#94a3b8" }
  };

  const colors = statusColors[status.type];

  return (
    <div className="mb-6 p-5 rounded-xl border" style={{ background: colors.bg, borderColor: colors.border }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6" style={{ color: colors.text }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: colors.text }}>
            {isMalayalam ? "നിലവിലെ അവസ്ഥ" : "Current Status"}
          </p>
        </div>
        <p className="font-malayalam-lg font-bold" style={{ color: colors.text }}>
          {status.type === 'saad' ? (isMalayalam ? 'സഅദ് (ശുഭം)' : 'Sa\'d (Auspicious)') :
           status.type === 'nahs' ? (isMalayalam ? 'നഹ്സ് (അശുഭം)' : 'Nahs (Inauspicious)') :
           (isMalayalam ? 'നിഷ്പക്ഷ' : 'Neutral')}
        </p>
      </div>

      {/* Current Position Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg" style={{ background: "rgba(0,0,0,0.20)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "നിലവിലെ രാശി" : "Current Sign"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{moonPos.zodiacSign?.symbol}</span>
            <p className="font-malayalam-md font-bold text-white">
              {isMalayalam ? moonPos.zodiacSign?.name_ml : moonPos.zodiacSign?.name_en}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ background: "rgba(0,0,0,0.20)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "നിലവിലെ നക്ഷത്രം" : "Current Mansion"}
          </p>
          <p className="font-amiri text-2xl font-bold text-right mb-1" style={{ color: G.text }} dir="rtl">
            {moonPos.mansion?.name_ar}
          </p>
          <p className="font-malayalam-sm font-bold text-white">
            {isMalayalam ? moonPos.mansion?.name_ml : moonPos.mansion?.name_en}
          </p>
        </div>

        <div className="p-4 rounded-lg" style={{ background: "rgba(0,0,0,0.20)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "ഡിഗ്രി" : "Degree"}
          </p>
          <p className="font-inter text-2xl font-bold text-white">
            {moonPos.longitude}°
          </p>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "വിഷുവരേഖ" : "Ecliptic Longitude"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TRANSIT TIMING SECTION
// ─────────────────────────────────────────────────────────────

function TransitTimingSection({ data, isMalayalam }) {
  const { transits } = data;
  const nextSign = transits.signTransits[1];
  const nextMansion = transits.mansionTransits.next;

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {/* Next Sign */}
      <div className="p-5 rounded-xl border" style={{ background: G.bgHi, borderColor: G.borderHi }}>
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight className="w-5 h-5" style={{ color: G.text }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "അടുത്ത രാശി" : "Next Sign"}
          </p>
        </div>
        {nextSign && (
          <>
            <div className="text-4xl mb-2">{nextSign.symbol}</div>
            <p className="font-malayalam-md font-bold text-white mb-2">{nextSign.name}</p>
            <div className="space-y-1">
              <p className="font-inter text-xs" style={{ color: G.dim }}>
                {isMalayalam ? "പ്രവേശന സമയം:" : "Entry Time:"} <span className="text-white font-bold">{formatTime(nextSign.entryTime)}</span>
              </p>
              <p className="font-inter text-xs" style={{ color: G.dim }}>
                {isMalayalam ? "ബാക്കി സമയം:" : "Time Remaining:"} <span className="text-white font-bold">{formatDuration(nextSign.remainingTime)}</span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Next Mansion */}
      <div className="p-5 rounded-xl border" style={{ background: G.bgHi, borderColor: G.borderHi }}>
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight className="w-5 h-5" style={{ color: G.text }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "അടുത്ത നക്ഷത്രം" : "Next Mansion"}
          </p>
        </div>
        {nextMansion && (
          <>
            <p className="font-amiri text-3xl font-bold text-right mb-2" style={{ color: G.text }} dir="rtl">
              {nextMansion.arabic}
            </p>
            <p className="font-malayalam-md font-bold text-white mb-2">{nextMansion.name}</p>
            <div className="space-y-1">
              <p className="font-inter text-xs" style={{ color: G.dim }}>
                {isMalayalam ? "പ്രവേശന സമയം:" : "Entry Time:"} <span className="text-white font-bold">{formatTime(nextMansion.entryTime)}</span>
              </p>
              <p className="font-inter text-xs" style={{ color: G.dim }}>
                {isMalayalam ? "ബാക്കി സമയം:" : "Time Remaining:"} <span className="text-white font-bold">{formatDuration(nextMansion.remainingTime)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ACTION RECOMMENDATIONS SECTION
// ─────────────────────────────────────────────────────────────

function ActionRecommendationsSection({ data, isMalayalam }) {
  const { actions } = data;

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {/* Best Actions */}
      <div className="p-5 rounded-xl border" style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.40)" }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5" style={{ color: "#22c55e" }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#22c55e" }}>
            {isMalayalam ? "ഉചിത പ്രവർത്തനങ്ങൾ" : "Best Actions Now"}
          </p>
        </div>
        <div className="space-y-2">
          {(actions.best || []).slice(0, 5).map((action, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#22c55e" }} />
              <p className="font-malayalam-sm text-white/80">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Worst Actions */}
      <div className="p-5 rounded-xl border" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.40)" }}>
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-5 h-5" style={{ color: "#ef4444" }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#ef4444" }}>
            {isMalayalam ? "ഒഴിവാക്കേണ്ടവ" : "Worst Actions Now"}
          </p>
        </div>
        <div className="space-y-2">
          {(actions.worst || []).slice(0, 5).map((action, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#ef4444" }} />
              <p className="font-malayalam-sm text-white/80">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ASTROLOGICAL BASIS SECTION
// ─────────────────────────────────────────────────────────────

function AstrologicalBasisSection({ data, isMalayalam }) {
  const { moonPos, dayInfo, planetHour, status } = data;

  return (
    <div className="p-5 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5" style={{ color: G.dim }} />
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
          {isMalayalam ? "ജ്യോതിശാസ്ത്ര അടിസ്ഥാനം" : "Astrological Basis"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Moon Sign */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{moonPos.zodiacSign?.symbol}</span>
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "ചന്ദ്ര രാശി" : "Moon Sign"}
            </p>
            <p className="font-malayalam-sm font-bold text-white">
              {isMalayalam ? moonPos.zodiacSign?.name_ml : moonPos.zodiacSign?.name_en}
            </p>
          </div>
        </div>

        {/* Moon Mansion */}
        <div className="flex items-center gap-2">
          <div className="text-right min-w-[50px]">
            <p className="font-amiri text-lg font-bold" style={{ color: G.text }} dir="rtl">
              {moonPos.mansion?.name_ar}
            </p>
          </div>
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "ചന്ദ്ര നക്ഷത്രം" : "Moon Mansion"}
            </p>
            <p className="font-malayalam-sm font-bold text-white">
              {isMalayalam ? moonPos.mansion?.name_ml : moonPos.mansion?.name_en}
            </p>
          </div>
        </div>

        {/* Planetary Hour */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: G.dim }} />
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "ഗ്രഹ മണിക്കൂർ" : "Planetary Hour"}
            </p>
            <p className="font-malayalam-sm font-bold text-white">
              {planetHour?.planet ? (isMalayalam ? planetHour.planet.name_ml_equivalent : planetHour.planet.name_en) : '-'}
            </p>
          </div>
        </div>

        {/* Day Ruler */}
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4" style={{ color: G.dim }} />
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "ദിവസ ഭരണാധികാരി" : "Day Ruler"}
            </p>
            <p className="font-malayalam-sm font-bold text-white">
              {dayInfo?.ruler ? (isMalayalam ? PLANET_INFO[dayInfo.ruler]?.name_ml_equivalent : PLANET_INFO[dayInfo.ruler]?.name_en) : '-'}
            </p>
          </div>
        </div>

        {/* Element */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: getElementColor(moonPos.zodiacSign?.element) }} />
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "മൂലകം (അനാസിർ)" : "Element (Anasir)"}
            </p>
            <p className="font-malayalam-sm font-bold text-white">
              {moonPos.zodiacSign?.element || '-'}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" style={{ color: status.type === 'saad' ? '#22c55e' : status.type === 'nahs' ? '#ef4444' : '#94a3b8' }} />
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "നില" : "Status"}
            </p>
            <p className="font-malayalam-sm font-bold text-white">
              {status.type === 'saad' ? (isMalayalam ? 'സഅദ്' : 'Sa\'d') :
               status.type === 'nahs' ? (isMalayalam ? 'നഹ്സ്' : 'Nahs') :
               (isMalayalam ? 'നിഷ്പക്ഷ' : 'Neutral')}
            </p>
          </div>
        </div>
      </div>

      {/* Source */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: G.faint }}>
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
          {isMalayalam ? "സ്രോതസ്സ്:" : "Based on:"} Havâss'ın Derinlikleri, Taha
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function calculateMoonStatus(moonPos, dayInfo, planetHour) {
  // Simplified status calculation based on traditional rules
  const sign = moonPos.zodiacSign?.name_en;
  const mansion = moonPos.mansion?.name_en;
  
  // Check if moon is in beneficial sign/mansion
  const beneficialSigns = ['Taurus', 'Cancer', 'Sagittarius', 'Pisces'];
  const challengingSigns = ['Scorpio', 'Capricorn', 'Aquarius'];
  
  if (beneficialSigns.includes(sign)) {
    return { type: 'saad', reason: 'Moon in beneficial sign' };
  } else if (challengingSigns.includes(sign)) {
    return { type: 'nahs', reason: 'Moon in challenging sign' };
  }
  
  return { type: 'neutral', reason: 'Moon in neutral position' };
}

function getActionRecommendations(status, moonPos, dayInfo) {
  const best = [];
  const worst = [];
  
  if (status.type === 'saad') {
    best.push('Start new projects and initiatives');
    best.push('Sign important contracts');
    best.push('Travel and journey');
    best.push('Spiritual practices and prayers');
    best.push('Financial investments');
    
    worst.push('Avoid conflicts and arguments');
    worst.push('Do not rush decisions');
  } else if (status.type === 'nahs') {
    worst.push('Starting new ventures');
    worst.push('Major financial decisions');
    worst.push('Signing contracts');
    worst.push('Long-distance travel');
    worst.push('Important meetings');
    
    best.push('Focus on completion of existing work');
    best.push('Meditation and reflection');
    best.push('Planning and preparation');
  } else {
    best.push('Routine work and maintenance');
    best.push('Learning and study');
    best.push('Collaboration with others');
    
    worst.push('Major life changes');
    worst.push('High-risk activities');
  }
  
  return { best, worst };
}

function formatTime(date) {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

function formatDuration(ms) {
  if (!ms || ms <= 0) return '0h 0m';
  
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

function getElementColor(element) {
  const colors = {
    'Fire': '#ef4444',
    'Earth': '#84cc16',
    'Air': '#3b82f6',
    'Water': '#06b6d4'
  };
  return colors[element] || '#94a3b8';
}