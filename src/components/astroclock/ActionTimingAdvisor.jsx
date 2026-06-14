import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, Star, AlertTriangle, CheckCircle, BookOpen, Info } from "lucide-react";
import { getActionTimingAdvice, findSimilarActions, PLANET_DATA, LUNAR_MANSION_DATA } from "@/lib/astroClockActionTimingAdvisor";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
  success:  "rgba(34,197,94,0.60)",
  danger:   "rgba(239,68,68,0.60)"
};

export default function ActionTimingAdvisor() {
  const { t, isMalayalam } = useAstroClockLanguage();
  const [action, setAction] = useState("");
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!action.trim()) return;
    
    setLoading(true);
    // Simulate async for better UX
    setTimeout(() => {
      const advice = getActionTimingAdvice(action, isMalayalam ? 'ml' : 'en');
      setResults(advice);
      setLoading(false);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setAction(suggestion.category);
    const advice = getActionTimingAdvice(suggestion.category, isMalayalam ? 'ml' : 'en');
    setResults(advice);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAction(value);
    if (value.length >= 2) {
      const sims = findSimilarActions(value, isMalayalam);
      setSuggestions(sims);
    } else {
      setSuggestions([]);
    }
  };

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
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6" style={{ color: G.text }} />
          <h2 className="font-inter text-xl font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "പ്രവൃത്തി സമയ ഉപദേശം" : "Action Timing Advisor"}
          </h2>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={action}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={isMalayalam 
                ? "പ്രവൃത്തി നൽകുക (വിവാഹം, യാത്ര, വ്യാപാരം...)" 
                : "Enter action (Marriage, Travel, Business...)"}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: G.border,
                color: "#fff",
                fontSize: "14px"
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !action.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              style={{
                background: G.bgHi,
                color: G.text,
                border: `1px solid ${G.border}`
              }}
            >
              {loading ? (isMalayalam ? "ലോഡ്..." : "Loading...") : (isMalayalam ? "തിരയുക" : "Search")}
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="mt-2 p-3 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                {isMalayalam ? "നിർദ്ദേശങ്ങൾ" : "Suggestions"}
              </p>
              <div className="flex flex-wrap gap-2">
                {(suggestions || []).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all hover:opacity-80"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: G.text,
                      border: `1px solid ${G.faint}`
                    }}
                  >
                    {suggestion.category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {results.found ? (
              <>
                {/* Action Header */}
                <div className="p-4 rounded-xl border" style={{ background: G.bgHi, borderColor: G.border }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-inter text-lg font-bold" style={{ color: G.text }}>
                      {results.action}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.40)" }}>
                      {results.totalRulesFound} {isMalayalam ? "നിയമങ്ങൾ" : "Rules"} Found
                    </span>
                  </div>
                  <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {isMalayalam ? "വിഭാഗം" : "Category"}: {results.category}
                  </p>
                </div>

                {/* Best Days */}
                {results.bestDays && results.bestDays.length > 0 && (
                  <TimingSection
                    icon={Calendar}
                    title={isMalayalam ? "ഉത്തമ ദിവസങ്ങൾ" : "Best Days"}
                    color={G.success}
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {(results.bestDays || []).map((day, idx) => (
                        <DayCard key={idx} day={day} isMalayalam={isMalayalam} />
                      ))}
                    </div>
                  </TimingSection>
                )}

                {/* Worst Days */}
                {results.worstDays && results.worstDays.length > 0 && (
                  <TimingSection
                    icon={AlertTriangle}
                    title={isMalayalam ? "അനുചിത ദിവസങ്ങൾ" : "Worst Days"}
                    color={G.danger}
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {(results.worstDays || []).map((day, idx) => (
                        <DayCard key={idx} day={day} isMalayalam={isMalayalam} isWarning />
                      ))}
                    </div>
                  </TimingSection>
                )}

                {/* Best Hours */}
                {results.bestHours && results.bestHours.length > 0 && (
                  <TimingSection
                    icon={Clock}
                    title={isMalayalam ? "ഉത്തമ ഗ്രഹ മണിക്കൂറുകൾ" : "Best Planetary Hours"}
                    color={G.success}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {(results.bestHours || []).map((hour, idx) => (
                        <HourCard key={idx} hour={hour} isMalayalam={isMalayalam} />
                      ))}
                    </div>
                  </TimingSection>
                )}

                {/* Suitable Mansions */}
                {results.suitableMansions && results.suitableMansions.length > 0 && (
                  <TimingSection
                    icon={Star}
                    title={isMalayalam ? "ഉചിത നക്ഷത്രങ്ങൾ" : "Suitable Lunar Mansions"}
                    color={G.text}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {(results.suitableMansions || []).map((mansion, idx) => (
                        <MansionCard key={idx} mansion={mansion} isMalayalam={isMalayalam} />
                      ))}
                    </div>
                  </TimingSection>
                )}

                {/* Benefits */}
                {results.benefits && results.benefits.length > 0 && (
                  <TimingSection
                    icon={CheckCircle}
                    title={isMalayalam ? "ഗുണങ്ങൾ" : "Benefits"}
                    color={G.success}
                  >
                    <ul className="space-y-1">
                      {(results.benefits || []).map((benefit, idx) => (
                        <li key={idx} className="font-inter text-xs text-white/70 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full mt-1.5" style={{ background: G.success }} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </TimingSection>
                )}

                {/* Warnings */}
                {results.warnings && results.warnings.length > 0 && (
                  <TimingSection
                    icon={AlertTriangle}
                    title={isMalayalam ? "മുന്നറിയിപ്പുകൾ" : "Warnings"}
                    color={G.danger}
                  >
                    <ul className="space-y-1">
                      {(results.warnings || []).map((warning, idx) => (
                        <li key={idx} className="font-inter text-xs text-white/70 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full mt-1.5" style={{ background: G.danger }} />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </TimingSection>
                )}

                {/* Sources */}
                {results.sources && results.sources.length > 0 && (
                  <div className="p-4 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: G.faint }}>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4" style={{ color: G.dim }} />
                      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                        {isMalayalam ? "ഗ്രന്ഥങ്ങൾ" : "Sources"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {(results.sources || []).map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg" style={{ background: G.bg }}>
                          <span className="font-inter text-xs text-white/70">{source.book}</span>
                          <span className="font-inter text-[10px] font-bold" style={{ color: G.text }}>
                            {isMalayalam ? "പുറം" : "Page"} {source.page}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <NoResults message={results.message} suggestions={results.suggestions} isMalayalam={isMalayalam} onSuggestionClick={handleSuggestionClick} />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function TimingSection({ icon: Icon, title, color, children }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: color }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function DayCard({ day, isMalayalam, isWarning = false }) {
  return (
    <div className="p-3 rounded-lg border flex items-center justify-between" style={{ background: isWarning ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.05)", borderColor: isWarning ? "rgba(239,68,68,0.30)" : "rgba(34,197,94,0.30)" }}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{day.symbol}</span>
        <div>
          <p className="font-inter text-sm font-bold" style={{ color: isWarning ? "#ef4444" : "#22c55e" }}>
            {day.day}
          </p>
          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            {isMalayalam ? "ഗ്രഹ നാഥൻ" : "Planet Ruler"}: {day.planet}
          </p>
        </div>
      </div>
      {day.benefits && day.benefits.length > 0 && (
        <div className="text-right">
          <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>
            {isMalayalam ? "ഗുണങ്ങൾ" : "Benefits"}
          </p>
          <div className="flex gap-1">
            {day.benefits.slice(0, 2).map((b, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HourCard({ hour, isMalayalam }) {
  return (
    <div className="p-2 rounded-lg border text-center" style={{ background: G.bg, borderColor: G.faint }}>
      <p className="text-lg mb-1">{hour.symbol}</p>
      <p className="font-inter text-xs font-bold" style={{ color: G.text }}>{hour.planet}</p>
      <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>{hour.day}</p>
    </div>
  );
}

function MansionCard({ mansion, isMalayalam }) {
  return (
    <div className="p-2 rounded-lg border" style={{ background: G.bg, borderColor: G.faint }}>
      <p className="font-amiri text-sm font-bold mb-1" style={{ color: G.text }} dir="rtl">{mansion.arabic}</p>
      <p className="font-inter text-xs font-bold" style={{ color: G.text }}>{mansion.name}</p>
      <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
        {isMalayalam ? "സ്വഭാവം" : "Nature"}: {mansion.nature}
      </p>
    </div>
  );
}

function NoResults({ message, suggestions, isMalayalam, onSuggestionClick }) {
  return (
    <div className="p-6 rounded-xl border text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: G.faint }}>
      <Info className="w-8 h-8 mx-auto mb-3" style={{ color: G.dim }} />
      <p className="font-inter text-sm mb-4" style={{ color: "rgba(255,255,255,0.70)" }}>{message}</p>
      {suggestions && suggestions.suggestions && (
        <div>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "നിർദ്ദേശങ്ങൾ" : "Suggestions"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {(suggestions?.suggestions || []).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all hover:opacity-80"
                style={{ background: G.bg, color: G.text, border: `1px solid ${G.faint}` }}
              >
                {suggestion.category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}