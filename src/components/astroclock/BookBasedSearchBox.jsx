import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Clock, Star, AlertCircle, CheckCircle, Moon, Sun, Zap, Heart } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { searchBookKnowledge, findBestTimeForAction, getTodaysAnalysis } from "@/lib/astroClockBookSearch.js";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentPlanetaryHour } from "@/lib/astroClockLiveEngine.js";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { ACTION_TIMING_RULES } from "@/lib/astroClockActionTimingRules.js";

const ACTION_SUGGESTIONS = [
  { key: "MARRIAGE", en: "Marriage", ml: "വിവാഹം", ar: "النكاح" },
  { key: "BUSINESS", en: "Business", ml: "വ്യാപാരം", ar: "التجارة" },
  { key: "TRAVEL", en: "Travel", ml: "യാത്ര", ar: "السفر" },
  { key: "HEALING", en: "Healing", ml: "ചികിത്സ", ar: "الشفاء" },
  { key: "EDUCATION", en: "Education", ml: "പഠനം", ar: "التعلم" },
  { key: "LOVE", en: "Love", ml: "പ്രണയം", ar: "المحبة" },
  { key: "CONSTRUCTION", en: "Construction", ml: "വീട് നിർമ്മാണം", ar: "البناء" },
  { key: "SPIRITUAL", en: "Spiritual Practice", ml: "ആത്മീയ അമൽ", ar: "العمل الروحي" }
];

export default function BookBasedSearchBox({ onActionSelect, currentAstroData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const { t, isMalayalam } = useAstroClockLanguage();
  const { toast } = useToast();

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    
    // Simulate async search (could be optimized with debouncing)
    setTimeout(() => {
      const results = searchBookKnowledge(query);
      setSearchResults(results);
      
      if (results.found) {
        toast({
          title: isMalayalam ? "ഫലങ്ങൾ കണ്ടെത്തി" : "Results Found",
          description: isMalayalam 
            ? `ബുക്ക് ഡാറ്റാബേസിൽ നിന്നും ${results.type === 'ACTION_TIMING' ? '1' : results.dayRules.length + results.mansionRules.length} ഫലങ്ങൾ`
            : `Found ${results.type === 'ACTION_TIMING' ? '1' : results.dayRules.length + results.mansionRules.length} entries from book database`,
          duration: 3000
        });
      } else {
        toast({
          title: isMalayalam ? "ഫലങ്ങളില്ല" : "No Results",
          description: isMalayalam 
            ? "ഈ പ്രവർത്തിക്ക് ബുക്ക് ഡാറ്റാബേസിൽ ഫലങ്ങളില്ല"
            : "No book-based reference found for this action",
          duration: 3000
        });
      }
      
      setIsSearching(false);
    }, 300);
  }, [isMalayalam, toast]);

  const handleActionSelect = useCallback((actionKey) => {
    const action = ACTION_SUGGESTIONS.find(a => a.key === actionKey);
    if (!action) return;

    setSelectedAction(actionKey);
    setSearchQuery(isMalayalam ? action.ml : action.en);
    
    // Get best timing for this action
    const bestTime = findBestTimeForAction(actionKey, currentAstroData);
    setSearchResults(bestTime);
    
    if (onActionSelect) {
      onActionSelect(actionKey);
    }

    toast({
      title: isMalayalam ? `${action.ml} തിരഞ്ഞെടുത്തു` : `${action.en} Selected`,
      description: isMalayalam ? "മികച്ച സമയം കാണുക" : "Viewing best timing",
      duration: 2000
    });
  }, [isMalayalam, onActionSelect, currentAstroData, toast]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults(null);
    setSelectedAction(null);
    if (onActionSelect) {
      onActionSelect(null);
    }
  }, [onActionSelect]);

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5" style={{ color: "rgba(212,175,55,0.60)" }} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          placeholder={isMalayalam ? "തിരയുക: വിവാഹം, വ്യാപാരം, യാത്ര..." : "Search: Marriage, Business, Travel..."}
          className="w-full pl-12 pr-12 py-4 rounded-xl border text-base"
          style={{
            background: "rgba(8,18,44,0.95)",
            borderColor: "rgba(212,175,55,0.25)",
            color: "#ffffff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.40)"
          }}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
          >
            <AlertCircle className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />
          </button>
        )}
      </div>

      {/* Action Suggestions */}
      <div className="flex flex-wrap gap-2">
        {ACTION_SUGGESTIONS.map((action) => (
          <button
            key={action.key}
            onClick={() => handleActionSelect(action.key)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              selectedAction === action.key
                ? "bg-gold/20 border-gold/40"
                : "bg-white/5 border-white/10 hover:border-gold/20"
            }`}
            style={{
              background: selectedAction === action.key 
                ? "rgba(212,175,55,0.15)" 
                : "rgba(255,255,255,0.05)",
              borderColor: selectedAction === action.key 
                ? "rgba(212,175,55,0.40)" 
                : "rgba(255,255,255,0.10)",
              color: selectedAction === action.key ? "#F5D060" : "rgba(255,255,255,0.70)"
            }}
          >
            <span className="font-amiri text-xs">{isMalayalam ? action.ml : action.en}</span>
          </button>
        ))}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults && searchResults.found && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border p-5 space-y-4"
            style={{
              background: "rgba(8,18,44,0.95)",
              borderColor: "rgba(212,175,55,0.25)"
            }}
          >
            {/* Result Header */}
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
              <Book className="w-4 h-4" style={{ color: "#D4AF37" }} />
              <span className="font-inter text-xs uppercase tracking-wider" style={{ color: "rgba(212,175,55,0.70)" }}>
                {searchResults.type === "ACTION_TIMING" 
                  ? (isMalayalam ? "പ്രവർത്തി സമയം" : "Action Timing")
                  : (isMalayalam ? "പൊതുവായ ഫലങ്ങൾ" : "General Results")
                }
              </span>
            </div>

            {/* Action Timing Results - COMPREHENSIVE VIEW */}
            {searchResults.type === "ACTION_TIMING" && (
              <div className="space-y-4">
                {/* Current Status */}
                <CurrentStatusCard 
                  currentTiming={searchResults.currentTiming} 
                  isMalayalam={isMalayalam} 
                />

                {/* Best Times Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard
                    icon={Moon}
                    title={isMalayalam ? "ഉത്തമ മൻസിലുകൾ" : "Best Mansions"}
                    items={searchResults.bestTimes.mansions.map(m => `${m.name} (#${m.no})`)}
                    color="#4ade80"
                    bg="rgba(74,222,128,0.10)"
                    border="rgba(74,222,128,0.20)"
                  />
                  <InfoCard
                    icon={Sun}
                    title={isMalayalam ? "ഉത്തമ ദിവസങ്ങൾ" : "Best Days"}
                    items={searchResults.bestTimes.days}
                    color="#60a5fa"
                    bg="rgba(96,165,250,0.10)"
                    border="rgba(96,165,250,0.20)"
                  />
                </div>

                {/* Planets */}
                <InfoCard
                  icon={Star}
                  title={isMalayalam ? "ഉത്തമ ഗ്രഹങ്ങൾ" : "Best Planets"}
                  items={searchResults.bestTimes.planets}
                  color="#fbbf24"
                  bg="rgba(251,191,36,0.10)"
                  border="rgba(251,191,36,0.20)"
                />

                {/* Avoid Section */}
                <AvoidCard
                  avoid={searchResults.avoid}
                  isMalayalam={isMalayalam}
                />

                {/* Notes & Source */}
                {searchResults.notes && (
                  <div className="p-3 rounded-lg border" style={{ background: "rgba(212,175,55,0.05)", borderColor: "rgba(212,175,55,0.20)" }}>
                    <p className="font-inter text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(212,175,55,0.60)" }}>
                      {isMalayalam ? "കുറിപ്പുകൾ" : "Notes"}
                    </p>
                    <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>
                      {searchResults.notes}
                    </p>
                  </div>
                )}

                {/* Source Reference */}
                <div className="pt-3 border-t" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
                  <div className="flex items-start gap-2">
                    <Book className="w-3.5 h-3.5 mt-0.5" style={{ color: "rgba(212,175,55,0.60)" }} />
                    <div>
                      <p className="font-inter text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(212,175,55,0.50)" }}>
                        {isMalayalam ? "സ്രോതസ്സ്" : "Source Reference"}
                      </p>
                      <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                        {searchResults.source}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Search Results */}
            {searchResults.type === "GENERAL_SEARCH" && (
              <div className="space-y-4">
                {searchResults.dayRules.length > 0 && (
                  <div>
                    <h4 className="font-inter text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {isMalayalam ? "ദിവസ ഫലങ്ങൾ" : "Day Results"}
                    </h4>
                    {searchResults.dayRules.map((rule, idx) => (
                      <div key={idx} className="mb-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <p className="font-inter text-xs mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
                          {rule.data.day} - {rule.data.ruler}
                        </p>
                        <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                          {rule.source.book} p.{rule.source.page}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.mansionRules.length > 0 && (
                  <div>
                    <h4 className="font-inter text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {isMalayalam ? "മൻസിൽ ഫലങ്ങൾ" : "Mansion Results"}
                    </h4>
                    {searchResults.mansionRules.map((rule, idx) => (
                      <div key={idx} className="mb-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <p className="font-inter text-xs mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
                          {rule.data.name} - {rule.data.classification}
                        </p>
                        <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                          {rule.source.book} p.{rule.source.page}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* No Results */}
        {searchResults && !searchResults.found && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border p-6 text-center"
            style={{
              background: "rgba(8,18,44,0.95)",
              borderColor: "rgba(212,175,55,0.15)"
            }}
          >
            <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.40)" }} />
            <p className="font-inter text-sm mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
              {isMalayalam ? "ഫലങ്ങൾ കണ്ടെത്താനായില്ല" : "No Results Found"}
            </p>
            <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
              {isMalayalam 
                ? "ഈ പ്രവർത്തിക്ക് ബുക്ക് ഡാറ്റാബേസിൽ ഫലങ്ങളില്ല" 
                : "No book-based reference found for this action"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function CurrentStatusCard({ currentTiming, isMalayalam }) {
  const isGood = currentTiming?.isSuitable;
  const isNeutral = !isGood && currentTiming?.score >= 0;
  
  return (
    <div className={`p-4 rounded-xl border ${
      isGood ? "bg-green-500/10 border-green-500/40" : 
      isNeutral ? "bg-yellow-500/10 border-yellow-500/40" : 
      "bg-red-500/10 border-red-500/40"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {isGood ? <CheckCircle className="w-4 h-4" style={{ color: "#4ade80" }} /> : 
         <AlertCircle className="w-4 h-4" style={{ color: "#f87171" }} />}
        <span className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: isGood ? "#4ade80" : "#f87171" }}>
          {isMalayalam 
            ? (isGood ? "നല്ല സമയം ✓" : isNeutral ? "സാധാരണ സമയം" : "ഉചിതമല്ല ✗")
            : (isGood ? "Good Time ✓" : isNeutral ? "Neutral" : "Not Suitable ✗")}
        </span>
      </div>
      <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>
        {currentTiming?.reasons?.[0] || (isMalayalam ? "നിലവിലെ ഗ്രഹനിലകൾ പരിശോധിക്കുക" : "Check current planetary positions")}
      </p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, items, color, bg, border }) {
  return (
    <div className="p-3 rounded-lg border" style={{ background: bg, borderColor: border }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.80)" }}>
          {title}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="px-2 py-1 rounded-md text-xs"
            style={{ background: "rgba(255,255,255,0.05)", color, border: `1px solid ${border}` }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function AvoidCard({ avoid, isMalayalam }) {
  if (!avoid || avoid.mansions.length === 0) return null;
  
  return (
    <div className="p-4 rounded-xl border" style={{ background: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.30)" }}>
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4" style={{ color: "#f87171" }} />
        <span className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: "#f87171" }}>
          {isMalayalam ? "ഒഴിവാക്കുക" : "Avoid"}
        </span>
      </div>
      {avoid.mansions.length > 0 && (
        <div className="mb-2">
          <p className="font-inter text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.60)" }}>
            {isMalayalam ? "മൻസിലുകൾ:" : "Mansions:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {avoid.mansions.map((m, idx) => (
              <span key={idx} className="px-2 py-1 rounded-md text-xs" style={{ background: "rgba(239,68,68,0.20)", color: "#f87171", border: "1px solid rgba(239,68,68,0.30)" }}>
                {m.name} (#{m.no})
              </span>
            ))}
          </div>
        </div>
      )}
      {avoid.days.length > 0 && (
        <div>
          <p className="font-inter text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.60)" }}>
            {isMalayalam ? "ദിവസങ്ങൾ:" : "Days:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {avoid.days.map((d, idx) => (
              <span key={idx} className="px-2 py-1 rounded-md text-xs capitalize" style={{ background: "rgba(239,68,68,0.20)", color: "#f87171", border: "1px solid rgba(239,68,68,0.30)" }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}