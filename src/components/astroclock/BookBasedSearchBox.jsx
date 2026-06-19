import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Clock, Star, AlertCircle, CheckCircle } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { searchBookKnowledge, findBestTimeForAction } from "@/lib/astroClockBookSearch.js";
import { useToast } from "@/components/ui/use-toast";

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
            className="rounded-xl border p-4 space-y-4"
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

            {/* Action Timing Results */}
            {searchResults.type === "ACTION_TIMING" && (
              <div className="space-y-4">
                {/* Suitable Mansions */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
                    <span className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {isMalayalam ? "ഉത്തമ മൻസിലുകൾ" : "Suitable Mansions"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.mansions.suitable.map((mansion, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md text-xs"
                        style={{
                          background: "rgba(74,222,128,0.10)",
                          color: "#4ade80",
                          border: "1px solid rgba(74,222,128,0.20)"
                        }}
                      >
                        {mansion.name} (#{mansion.no})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Unsuitable Mansions */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                    <span className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {isMalayalam ? "അനുചിത മൻസിലുകൾ" : "Unsuitable Mansions"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.mansions.unsuitable.map((mansion, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md text-xs"
                        style={{
                          background: "rgba(248,113,113,0.10)",
                          color: "#f87171",
                          border: "1px solid rgba(248,113,113,0.20)"
                        }}
                      >
                        {mansion.name} (#{mansion.no})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suitable Days & Planets */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />
                      <span className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.80)" }}>
                        {isMalayalam ? "ഉത്തമ ദിവസങ്ങൾ" : "Best Days"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {searchResults.days.suitable.map((day, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md text-xs capitalize"
                          style={{
                            background: "rgba(96,165,250,0.10)",
                            color: "#60a5fa",
                            border: "1px solid rgba(96,165,250,0.20)"
                          }}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                      <span className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.80)" }}>
                        {isMalayalam ? "ഉത്തമ ഗ്രഹങ്ങൾ" : "Best Planets"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {searchResults.planets.suitable.map((planet, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md text-xs capitalize"
                          style={{
                            background: "rgba(251,191,36,0.10)",
                            color: "#fbbf24",
                            border: "1px solid rgba(251,191,36,0.20)"
                          }}
                        >
                          {planet}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

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