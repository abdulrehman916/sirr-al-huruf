// ═══════════════════════════════════════════════════════════════
// BIRTH PROFILE ANALYZER — Complete Astrological Birth Analysis
// From Havâss'ın Derinlikleri and traditional sources
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Star, Moon, Sun, Info, ChevronDown, Sparkles } from "lucide-react";
import { calculateBirthProfile, analyzeCompatibility, BIRTH_PROFILE_STATUS } from "@/lib/astroClockBirthProfile.js";
import { getCurrentPlanetaryHour, getAllPlanetaryHours, PLANET_INFO } from "@/lib/astroClockLiveEngine.js";
import { calculateSunriseSunset, getUserLocation } from "@/lib/astroClockSunriseSunset.js";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
  success: "rgba(34,197,94,0.60)",
  warning: "rgba(255,193,7,0.60)",
  danger: "rgba(239,68,68,0.60)"
};

export default function BirthProfileAnalyzer() {
  const { isMalayalam } = useAstroClockLanguage();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthProfile, setBirthProfile] = useState(null);
  const [currentHour, setCurrentHour] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [activeTab, setActiveTab] = useState("zodiac");
  const [liveData, setLiveData] = useState(null);

  // Update live data every minute
  useEffect(() => {
    const updateLiveData = () => {
      const now = new Date();
      const userLoc = getUserLocation();
      const sunData = calculateSunriseSunset(now, userLoc.lat, userLoc.lng, userLoc.timezone);
      const currentHourData = getCurrentPlanetaryHour(now, sunData.sunrise, sunData.sunset);
      
      setLiveData({
        moonPosition: calculateMoonPosition(now),
        currentHour: currentHourData,
        dayRuler: currentHourData.dayRuler,
        sunData
      });
      setCurrentHour(currentHourData);
    };

    updateLiveData();
    const interval = setInterval(updateLiveData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Calculate birth profile when data changes
  useEffect(() => {
    if (birthDate) {
      const profile = calculateBirthProfile(birthDate, birthTime || null, birthPlace || "Unknown");
      setBirthProfile(profile);
      
      if (profile && currentHour) {
        const compat = analyzeCompatibility(profile, currentHour);
        setCompatibility(compat);
      }
    }
  }, [birthDate, birthTime, birthPlace, currentHour]);

  const handleCalculate = () => {
    if (birthDate) {
      const profile = calculateBirthProfile(birthDate, birthTime || null, birthPlace || "Unknown");
      setBirthProfile(profile);
      
      if (profile && currentHour) {
        const compat = analyzeCompatibility(profile, currentHour);
        setCompatibility(compat);
      }
    }
  };

  const tabs = [
    { id: "zodiac", label_en: "Zodiac", label_ml: "രാശി", icon: Star },
    { id: "planet", label_en: "Planet", label_ml: "ഗ്രഹം", icon: Sun },
    { id: "element", label_en: "Element", label_ml: "മൂലകം", icon: Sparkles },
    { id: "relations", label_en: "Relations", label_ml: "ബന്ധങ്ങൾ", icon: Info },
    { id: "incense", label_en: "Incense", label_ml: "സുഗന്ധം", icon: Moon }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Calendar className="w-6 h-6" style={{ color: G.text }} />
        <div>
          <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ജനന വിശകലനം" : "Birth Profile Analyzer"}
          </h2>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "ജനന തീയതി അടിസ്ഥാനമാക്കിയുള്ള സമ്പൂർണ്ണ ജാതക വിശകലനം" : "Complete astrological profile from birth data"}
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <div>
          <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {isMalayalam ? "ജനന തീയതി" : "Date of Birth"}
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: G.faint,
              color: "#fff"
            }}
          />
        </div>
        
        <div>
          <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {isMalayalam ? "ജനന സമയം" : "Time of Birth"}
            <span className="text-[8px] ml-1">({isMalayalam ? "ഐച്ഛികം" : "Optional"})</span>
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: G.faint,
              color: "#fff"
            }}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {isMalayalam ? "ജനന സ്ഥലം" : "Place of Birth"}
          </label>
          <input
            type="text"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            placeholder={isMalayalam ? "നഗരം, രാജ്യം" : "City, Country"}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: G.faint,
              color: "#fff"
            }}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={!birthDate}
        className="w-full mb-5 px-4 py-3 rounded-xl font-inter text-sm font-bold uppercase tracking-wider transition-all"
        style={{
          background: birthDate ? "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)" : "rgba(255,255,255,0.05)",
          color: birthDate ? "#0d1b2a" : "rgba(255,255,255,0.30)",
          opacity: birthDate ? 1 : 0.5,
          cursor: birthDate ? "pointer" : "not-allowed"
        }}
      >
        {isMalayalam ? "വിശകലനം ആരംഭിക്കുക" : "Calculate Birth Profile"}
      </button>

      {/* Results */}
      <AnimatePresence>
        {birthProfile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            {/* Tab Selector */}
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-3 py-2 rounded-lg border font-inter text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    style={{
                      background: activeTab === tab.id ? G.bgHi : "rgba(255,255,255,0.02)",
                      borderColor: activeTab === tab.id ? G.border : "rgba(255,255,255,0.08)",
                      color: activeTab === tab.id ? G.text : "rgba(255,255,255,0.60)"
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    {isMalayalam ? tab.label_ml : tab.label_en}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.faint }}>
              {activeTab === "zodiac" && <ZodiacTab profile={birthProfile} isMalayalam={isMalayalam} />}
              {activeTab === "planet" && <PlanetTab profile={birthProfile} isMalayalam={isMalayalam} />}
              {activeTab === "element" && <ElementTab profile={birthProfile} isMalayalam={isMalayalam} />}
              {activeTab === "relations" && <RelationsTab profile={birthProfile} isMalayalam={isMalayalam} />}
              {activeTab === "incense" && <IncenseTab profile={birthProfile} isMalayalam={isMalayalam} />}
            </div>

            {/* Compatibility Analysis */}
            {compatibility && (
              <div className="rounded-xl border p-4" style={{
                background: compatibility.status === "favorable" ? "rgba(34,197,94,0.05)" :
                           compatibility.status === "unfavorable" ? "rgba(239,68,68,0.05)" :
                           "rgba(255,193,7,0.05)",
                borderColor: compatibility.status === "favorable" ? "rgba(34,197,94,0.30)" :
                            compatibility.status === "unfavorable" ? "rgba(239,68,68,0.30)" :
                            "rgba(255,193,7,0.30)"
              }}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{
                    color: compatibility.status === "favorable" ? G.success :
                           compatibility.status === "unfavorable" ? G.danger : G.warning
                  }} />
                  <p className="font-inter text-[9px] uppercase tracking-widest" style={{
                    color: compatibility.status === "favorable" ? G.success :
                           compatibility.status === "unfavorable" ? G.danger : G.warning
                  }}>
                    {isMalayalam ? "നിലവിലെ സമയവുമായുള്ള താരതമ്യം" : "Comparison With Current Time"}
                  </p>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-inter text-xs text-white/80">
                      {isMalayalam ? "അനുയോജ്യത" : "Compatibility"}
                    </p>
                    <p className="font-inter text-sm font-bold" style={{ color: G.text }}>
                      {compatibility.score}%
                    </p>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${compatibility.score}%`,
                        background: compatibility.status === "favorable" ? G.success :
                                   compatibility.status === "unfavorable" ? G.danger : G.warning
                      }}
                    />
                  </div>
                </div>

                <p className="font-inter text-sm text-white/80 mb-2">
                  {isMalayalam ? compatibility.recommendation_ml : compatibility.recommendation_en}
                </p>

                {(compatibility[isMalayalam ? "reasons_ml" : "reasons_en"] || []).map((reason, idx) => (
                  <p key={idx} className="font-inter text-xs text-white/60">• {reason}</p>
                ))}
              </div>
            )}

            {/* Live Data Section */}
            {liveData && (
              <div className="rounded-xl border p-4" style={{ background: "rgba(212,175,55,0.04)", borderColor: G.faint }}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" style={{ color: G.dim }} />
                  <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                    {isMalayalam ? "തത്സമയ ഗ്രഹ നിലവാരം" : "Live Planetary Data"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                      {isMalayalam ? "നിലവിലെ ഗ്രഹ മണിക്കൂർ" : "Current Hour"}
                    </p>
                    <p className="font-inter text-sm font-bold text-white">
                      {liveData.currentHour?.planetInfo?.[isMalayalam ? "name_ml" : "name_en"]}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                      {isMalayalam ? "ദിന നാഥൻ" : "Day Ruler"}
                    </p>
                    <p className="font-inter text-sm font-bold text-white">
                      {PLANET_INFO[liveData.dayRuler]?.[isMalayalam ? "name_ml" : "name_en"]}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                      {isMalayalam ? "ചന്ദ്രൻ" : "Moon Position"}
                    </p>
                    <p className="font-inter text-sm font-bold text-white">
                      {liveData.moonPosition?.sign || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Note */}
      <div className="mt-5 p-3 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5" style={{ color: G.dim }} />
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
              {isMalayalam ? "കുറിപ്പ്" : "Note"}
            </p>
            <p className="font-inter text-xs text-white/60">
              {isMalayalam 
                ? "ജനന തീയതി നൽകിയാൽ മാത്രമേ വിശകലനം സാധ്യമാകൂ. സമയവും സ്ഥലവും ഐച്ഛികമാണ്."
                : "Date of birth is required for analysis. Time and place are optional for enhanced accuracy."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function ZodiacTab({ profile, isMalayalam }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-6xl mb-2">{profile.zodiacSign.symbol}</p>
        <p className="font-inter text-xl font-bold text-white">
          {isMalayalam ? profile.zodiacSign.name_ml : profile.zodiacSign.name_en}
        </p>
        <p className="font-inter text-xs text-white/60">
          {isMalayalam ? profile.zodiacSign.dateRangeMl : profile.zodiacSign.dateRange}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          label_en="Gender"
          label_ml="ലിംഗം"
          value={isMalayalam ? profile.gender.ml : profile.gender.en}
          isMalayalam={isMalayalam}
        />
        <InfoCard
          label_en="Metal"
          label_ml="ലോഹം"
          value={isMalayalam ? profile.metal.ml : profile.metal.en}
          isMalayalam={isMalayalam}
        />
      </div>

      <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          {isMalayalam ? "ആത്മിക അർത്ഥം" : "Spiritual Meaning"}
        </p>
        <p className="font-inter text-sm text-white/80">
          {isMalayalam ? profile.spiritualMeaning.ml : profile.spiritualMeaning.en}
        </p>
      </div>
    </div>
  );
}

function PlanetTab({ profile, isMalayalam }) {
  if (!profile.rulingPlanet) return null;

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-5xl mb-2">{profile.rulingPlanet.symbol}</p>
        <p className="font-inter text-lg font-bold text-white">
          {isMalayalam ? profile.rulingPlanet.name_ml : profile.rulingPlanet.name_en}
        </p>
        <p className="font-inter text-xs text-white/60">
          {isMalayalam ? profile.rulingPlanet.nature_ml : profile.rulingPlanet.nature_en}
        </p>
      </div>

      <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.success }}>
          {isMalayalam ? "ഗുണങ്ങൾ" : "Benefits"}
        </p>
        <div className="space-y-1">
          {(isMalayalam ? profile.rulingPlanet.benefits_ml : profile.rulingPlanet.benefits_en || []).map((benefit, idx) => (
            <p key={idx} className="font-inter text-xs text-white/80">• {benefit}</p>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg" style={{ background: G.bg }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          {isMalayalam ? "ആത്മിക പ്രവർത്തനങ്ങൾ" : "Spiritual Operations"}
        </p>
        <p className="font-inter text-sm text-white/80">
          {isMalayalam ? profile.rulingPlanet.spiritualOperations_ml : profile.rulingPlanet.spiritualOperations_en}
        </p>
      </div>
    </div>
  );
}

function ElementTab({ profile, isMalayalam }) {
  if (!profile.element) return null;

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="font-inter text-2xl font-bold text-white mb-1">
          {isMalayalam ? profile.element.name_ml : profile.element.name_en}
        </p>
        <p className="font-inter text-xs text-white/60">
          {isMalayalam ? profile.element.direction_ml : profile.element.direction_en} {isMalayalam ? "ദിശ" : "Direction"}
        </p>
      </div>

      <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          {isMalayalam ? "ഗുണങ്ങൾ" : "Qualities"}
        </p>
        <div className="flex flex-wrap gap-2">
          {(isMalayalam ? profile.element.qualities_ml : profile.element.qualities_en || []).map((quality, idx) => (
            <span key={idx} className="px-2 py-1 rounded text-[10px]" style={{ background: G.bg, color: G.text }}>
              {quality}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.success }}>
            {isMalayalam ? "അനുയോജ്യ മൂലകങ്ങൾ" : "Compatible"}
          </p>
          <div className="space-y-1">
            {(isMalayalam ? profile.element.compatible_ml : profile.element.compatible_en || []).map((elem, idx) => (
              <p key={idx} className="font-inter text-xs text-white/80">• {elem}</p>
            ))}
          </div>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.danger }}>
            {isMalayalam ? "അനുയോജ്യമല്ലാത്ത മൂലകങ്ങൾ" : "Incompatible"}
          </p>
          <div className="space-y-1">
            {(isMalayalam ? profile.element.incompatible_ml : profile.element.incompatible_en || []).map((elem, idx) => (
              <p key={idx} className="font-inter text-xs text-white/80">• {elem}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RelationsTab({ profile, isMalayalam }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.success }}>
            {isMalayalam ? "സൌഹൃദ രാശികൾ" : "Friendly Signs"}
          </p>
          <div className="space-y-1">
            {(isMalayalam ? profile.relationships.friendlySigns_ml : profile.relationships.friendlySigns_en || []).map((sign, idx) => (
              <p key={idx} className="font-inter text-xs text-white/80">• {sign}</p>
            ))}
          </div>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.danger }}>
            {isMalayalam ? "ശത്രു രാശികൾ" : "Enemy Signs"}
          </p>
          <div className="space-y-1">
            {(isMalayalam ? profile.relationships.enemySigns_ml : profile.relationships.enemySigns_en || []).map((sign, idx) => (
              <p key={idx} className="font-inter text-xs text-white/80">• {sign}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.success }}>
            {isMalayalam ? "സൌഹൃദ ഗ്രഹങ്ങൾ" : "Friendly Planets"}
          </p>
          <div className="space-y-1">
            {(isMalayalam ? profile.relationships.friendlyPlanets_ml : profile.relationships.friendlyPlanets_en || []).map((planet, idx) => (
              <p key={idx} className="font-inter text-xs text-white/80">• {planet}</p>
            ))}
          </div>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.danger }}>
            {isMalayalam ? "ശത്രു ഗ്രഹങ്ങൾ" : "Enemy Planets"}
          </p>
          <div className="space-y-1">
            {(isMalayalam ? profile.relationships.enemyPlanets_ml : profile.relationships.enemyPlanets_en || []).map((planet, idx) => (
              <p key={idx} className="font-inter text-xs text-white/80">• {planet}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IncenseTab({ profile, isMalayalam }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="font-amiri text-2xl font-bold mb-2" style={{ color: G.text }}>
          {profile.incense.ar}
        </p>
        <p className="font-inter text-sm text-white/80">
          {isMalayalam ? profile.incense.ml : profile.incense.en}
        </p>
      </div>

      <div className="p-4 rounded-lg" style={{ background: "rgba(212,175,55,0.04)" }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          {isMalayalam ? "ഉപയോഗം" : "How to Use"}
        </p>
        <p className="font-inter text-xs text-white/70">
          {isMalayalam 
            ? "ഈ സുഗന്ധം നിങ്ങളുടെ ജന്മനക്ഷത്രത്തിന്റെ ഭരണ ഗ്രഹത്തിന് അനുയോജ്യമാണ്. പ്രത്യേക ആവശ്യങ്ങൾക്കായി ഉപയോഗിക്കുക."
            : "This incense is aligned with your zodiac sign's ruling planet. Use during planetary hours for enhanced effects."}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ label_en, label_ml, value, isMalayalam }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
      <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
        {isMalayalam ? label_ml : label_en}
      </p>
      <p className="font-inter text-sm font-bold text-white">{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function calculateMoonPosition(date) {
  // Approximate moon sign calculation (simplified)
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const moonCycle = 27.3;
  const position = (dayOfYear % moonCycle) / moonCycle * 360;
  const signIndex = Math.floor(position / 30);
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  return { sign: signs[signIndex] || "Unknown", degree: Math.floor(position % 30) };
}