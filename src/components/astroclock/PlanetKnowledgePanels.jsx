// ═══════════════════════════════════════════════════════════════
// PLANET KNOWLEDGE PANELS — SECTION 6
// Detailed planetary information cards
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Star, Users, XCircle, CheckCircle, Clock, Calendar, AlertTriangle } from "lucide-react";
import { PLANET_INFO } from "@/lib/astroClockLiveEngine";
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
  danger:   "rgba(239,68,68,0.60)"
};

// Planet relationships from traditional sources
const PLANET_RELATIONSHIPS = {
  sun: { friends: ["moon", "mars", "jupiter"], enemies: ["venus", "saturn"] },
  moon: { friends: ["sun", "mercury"], enemies: ["saturn"] },
  mars: { friends: ["sun", "moon", "jupiter"], enemies: ["mercury"] },
  mercury: { friends: ["sun", "venus"], enemies: ["moon"] },
  jupiter: { friends: ["sun", "moon", "mars"], enemies: ["mercury"] },
  venus: { friends: ["mercury", "saturn"], enemies: ["sun", "moon"] },
  saturn: { friends: ["venus", "mercury"], enemies: ["sun", "moon", "mars"] }
};

const DAY_ASSIGNMENTS = {
  sun: "Sunday",
  moon: "Monday",
  mars: "Tuesday",
  mercury: "Wednesday",
  jupiter: "Thursday",
  venus: "Friday",
  saturn: "Saturday"
};

const ZODIAC_ML = {
  "Koç": "മേഷം", "Boğa": "ഇടവം", "İkizler": "മിഥുനം", "Yengeç": "കർക്കിടകം",
  "Arslan": "ചിങ്ങം", "Başak": "കന്നി", "Terazi": "തുലാം", "Akrep": "വൃശ്ചികം",
  "Yay": "ധനു", "Oğlak": "മകരം", "Kova": "കുംഭം", "Balık": "മീനം"
};

function PlanetCard({ planetKey, planetData, isMalayalam }) {
  const relationships = PLANET_RELATIONSHIPS[planetKey];
  const day = DAY_ASSIGNMENTS[planetKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5"
      style={{
        background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: G.faint }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl"
          style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          {planetData.symbol}
        </div>
        <div>
          <h3 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? planetData.name_ml : planetData.name_en}
          </h3>
          <p className="font-inter text-[10px]" style={{ color: G.dim }}>
            {isMalayalam ? planetData.nature_ml : planetData.nature_en}
          </p>
        </div>
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Day Rulership */}
        <div className="p-3 rounded-lg border" style={{ background: G.bg, borderColor: G.faint }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3 h-3" style={{ color: G.dim }} />
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "ദിവസം" : "Day"}
            </p>
          </div>
          <p className="font-inter text-sm font-bold text-white">{day}</p>
        </div>

        {/* Hour Rulership */}
        <div className="p-3 rounded-lg border" style={{ background: G.bg, borderColor: G.faint }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3" style={{ color: G.dim }} />
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "മണിക്കൂർ" : "Hour"}
            </p>
          </div>
          <p className="font-inter text-xs text-white/70">
            {isMalayalam ? "ഗ്രഹ മണിക്കൂറുകൾ" : "Planetary Hours"}
          </p>
        </div>
      </div>

      {/* Friends & Enemies */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Friends */}
        <div className="p-3 rounded-lg border" style={{ background: "rgba(34,197,94,0.05)", borderColor: G.success }}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3 h-3" style={{ color: G.success }} />
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.success }}>
              {isMalayalam ? "സുഹൃത്തുക്കൾ" : "Friends"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {relationships?.friends.map((friend, idx) => {
              const friendData = PLANET_INFO[friend];
              return (
                <span key={idx} className="px-2 py-1 rounded text-[9px]" style={{ background: G.bg, color: G.text }}>
                  {isMalayalam ? friendData?.name_ml : friendData?.name_en}
                </span>
              );
            })}
          </div>
        </div>

        {/* Enemies */}
        <div className="p-3 rounded-lg border" style={{ background: "rgba(239,68,68,0.05)", borderColor: G.danger }}>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-3 h-3" style={{ color: G.danger }} />
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.danger }}>
              {isMalayalam ? "ശത്രുക്കൾ" : "Enemies"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {relationships?.enemies.map((enemy, idx) => {
              const enemyData = PLANET_INFO[enemy];
              return (
                <span key={idx} className="px-2 py-1 rounded text-[9px]" style={{ background: G.bg, color: G.text }}>
                  {isMalayalam ? enemyData?.name_ml : enemyData?.name_en}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-3 h-3" style={{ color: G.success }} />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.success }}>
            {isMalayalam ? "ഗുണങ്ങൾ" : "Benefits"}
          </p>
        </div>
        <ul className="space-y-1.5">
          {(isMalayalam ? planetData.benefits_ml : planetData.benefits_en || []).map((benefit, idx) => (
            <li key={idx} className="font-inter text-xs text-white/80 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: G.success }} />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Warnings */}
      {(isMalayalam ? planetData.warnings_ml : planetData.warnings_en || []).length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3 h-3" style={{ color: G.danger }} />
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.danger }}>
              {isMalayalam ? "മുന്നറിയിപ്പുകൾ" : "Warnings"}
            </p>
          </div>
          <ul className="space-y-1.5">
            {(isMalayalam ? planetData.warnings_ml : planetData.warnings_en || []).map((warning, idx) => (
              <li key={idx} className="font-inter text-xs text-white/80 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: G.danger }} />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suitable Operations */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-3 h-3" style={{ color: G.text }} />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ഉചിത പ്രവൃത്തികൾ" : "Suitable Operations"}
          </p>
        </div>
        <p className="font-inter text-xs text-white/70">
          {isMalayalam 
            ? "ഈ ഗ്രഹത്തിന്റെ മണിക്കൂറുകളിൽ മുകളിൽ പറഞ്ഞ ഗുണങ്ങൾ ലഭിക്കുന്ന പ്രവൃത്തികൾ ചെയ്യുക"
            : "Perform operations matching this planet's nature during its hours"}
        </p>
      </div>
    </motion.div>
  );
}

export default function PlanetKnowledgePanels() {
  const { isMalayalam } = useAstroClockLanguage();

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border p-5"
        style={{
          background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)",
          borderColor: G.borderHi,
          boxShadow: `0 0 40px ${G.glow}`
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-6 h-6" style={{ color: G.text }} />
          <h2 className="font-inter text-xl font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ഗ്രഹ ജ്ഞാനം" : "Planet Knowledge"}
          </h2>
        </div>
        <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
          {isMalayalam 
            ? "ഏഴ് ക്ലാസിക്കൽ ഗ്രഹങ്ങളുടെ സവിശേഷതകൾ, ബന്ധങ്ങൾ, പ്രവൃത്തികൾ"
            : "Properties, relationships, and operations of the 7 classical planets"}
        </p>
      </motion.div>

      {/* Planet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(PLANET_INFO).map(([key, data]) => (
          <PlanetCard key={key} planetKey={key} planetData={data} isMalayalam={isMalayalam} />
        ))}
      </div>
    </div>
  );
}