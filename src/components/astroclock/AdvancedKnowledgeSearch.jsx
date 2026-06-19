// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK ADVANCED SEARCH - UNIVERSAL KNOWLEDGE ENGINE
// Single search box for all topics: actions, mansions, planets, zodiac, timing
// Book-based ONLY — no generated content
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Clock, Star, Moon, Sun, Zap, Heart, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { searchBookKnowledge, generateComprehensiveAnalysis } from "@/lib/astroClockBookSearch.js";
import { useToast } from "@/components/ui/use-toast";

const SEARCH_CATEGORIES = [
  { key: "ACTIONS", en: "Actions & Rituals", ml: "പ്രവർത്തികൾ", ar: "الأعمال" },
  { key: "MANSIONS", en: "Lunar Mansions", ml: "ചന്ദ്ര നക്ഷത്രങ്ങൾ", ar: "المنازل" },
  { key: "PLANETS", en: "Planets", ml: "ഗ്രഹങ്ങൾ", ar: "الكواكب" },
  { key: "ZODIAC", en: "Zodiac Signs", ml: "രാശികൾ", ar: "الأبراج" },
  { key: "TIMING", en: "Timing Rules", ml: "സമയ നിയമങ്ങൾ", ar: "قواعد التوقيت" }
];

export default function AdvancedKnowledgeSearch({ currentAstroData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const { t, isMalayalam } = useAstroClockLanguage();
  const { toast } = useToast();

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      // Search all sources (PRESERVATION LAW COMPLIANT)
      const results = searchBookKnowledge(query);
      
      // Generate comprehensive 18-point analysis
      const comprehensiveAnalysis = generateComprehensiveAnalysis(query, {});
      
      // Combine results
      const enrichedResults = {
        ...results,
        comprehensive_analysis: comprehensiveAnalysis,
        all_sources_searched: true,
        preservation_compliant: true
      };
      
      setSearchResults(enrichedResults);
      
      if (results.found) {
        const sectionCount = results.type === 'ACTION_TIMING' ? 1 : 
          (results.dayRules?.length || 0) + (results.mansionRules?.length || 0) + (results.timingRules?.length || 0);
        toast({
          title: isMalayalam ? "ഫലങ്ങൾ കണ്ടെത്തി" : "Results Found",
          description: isMalayalam 
            ? `ബുക്ക് ഡാറ്റാബേസിൽ നിന്നും ${sectionCount} ഫലങ്ങൾ`
            : `Found ${sectionCount} entries from book database`,
          duration: 3000
        });
      } else {
        toast({
          title: isMalayalam ? "ഫലങ്ങളില്ല" : "No Results",
          description: isMalayalam 
            ? "ഈ വിഷയത്തിൽ ബുക്ക് ഡാറ്റാബേസിൽ ഫലങ്ങളില്ല"
            : "No book-based reference found for this topic",
          duration: 3000
        });
      }
      
      setIsSearching(false);
    }, 400);
  }, [isMalayalam, toast]);

  const handleCategorySelect = useCallback((categoryKey) => {
    setSelectedCategory(categoryKey);
    setSearchQuery("");
    setSearchResults(null);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults(null);
    setSelectedCategory(null);
  }, []);

  const toggleSection = useCallback((sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  return (
    <div className="space-y-6">
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
          placeholder={isMalayalam 
            ? "തിരയുക: വിവാഹം, യാത്ര, അൽ ഷറടൈൻ, ചൊവ്വ, മേഷം..." 
            : "Search: Marriage, Travel, Al Sharatain, Mars, Aries..."}
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

      {/* Category Quick Select */}
      <div className="flex flex-wrap gap-2">
        {SEARCH_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategorySelect(cat.key)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              selectedCategory === cat.key
                ? "bg-gold/20 border-gold/40"
                : "bg-white/5 border-white/10 hover:border-gold/20"
            }`}
            style={{
              background: selectedCategory === cat.key 
                ? "rgba(212,175,55,0.15)" 
                : "rgba(255,255,255,0.05)",
              borderColor: selectedCategory === cat.key 
                ? "rgba(212,175,55,0.40)" 
                : "rgba(255,255,255,0.10)",
              color: selectedCategory === cat.key ? "#F5D060" : "rgba(255,255,255,0.70)"
            }}
          >
            <span className="font-amiri text-xs">{isMalayalam ? cat.ml : cat.en}</span>
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
            className="space-y-4"
          >
            {/* Action Timing Results */}
            {searchResults.type === "ACTION_TIMING" && (
              <ActionTimingResult 
                results={searchResults} 
                isMalayalam={isMalayalam} 
              />
            )}
            
            {/* General Search Results */}
            {searchResults.type === "GENERAL_SEARCH" && (
              <GeneralSearchResult 
                results={searchResults} 
                isMalayalam={isMalayalam} 
              />
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
            <Info className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.40)" }} />
            <p className="font-inter text-sm mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
              {isMalayalam ? "ഫലങ്ങൾ കണ്ടെത്താനായില്ല" : "No Results Found"}
            </p>
            <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
              {isMalayalam 
                ? "ഈ വിഷയത്തിൽ ബുക്ക് ഡാറ്റാബേസിൽ ഫലങ്ങളില്ല" 
                : "No book-based reference found for this topic"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KnowledgeSectionCard({ section, isExpanded, onToggle, isMalayalam }) {
  const SectionIcon = section.icon || Book;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border overflow-hidden"
      style={{
        background: "rgba(8,18,44,0.95)",
        borderColor: "rgba(212,175,55,0.25)"
      }}
    >
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between"
        style={{
          background: "rgba(212,175,55,0.05)",
          borderBottom: isExpanded ? "1px solid rgba(212,175,55,0.15)" : "none"
        }}
      >
        <div className="flex items-center gap-3">
          <SectionIcon className="w-5 h-5" style={{ color: "#D4AF37" }} />
          <div className="text-left">
            <h3 className="font-inter text-sm font-bold" style={{ color: "rgba(255,255,255,0.90)" }}>
              {isMalayalam ? section.title_ml || section.title_en : section.title_en}
            </h3>
            {section.subtitle && (
              <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                {section.subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {section.status && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
              section.status === "favorable" ? "bg-green-500/20 text-green-400" :
              section.status === "unfavorable" ? "bg-red-500/20 text-red-400" :
              "bg-yellow-500/20 text-yellow-400"
            }`}>
              {section.status}
            </span>
          )}
          <div className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>
            <svg className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-3"
          >
            {section.content?.map((block, bIdx) => (
              <ContentBlock key={bIdx} block={block} isMalayalam={isMalayalam} />
            ))}
            
            {/* Source References */}
            {section.sources && section.sources.length > 0 && (
              <div className="pt-3 border-t" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
                <div className="flex items-start gap-2">
                  <Book className="w-3.5 h-3.5 mt-0.5" style={{ color: "rgba(212,175,55,0.60)" }} />
                  <div>
                    <p className="font-inter text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(212,175,55,0.50)" }}>
                      {isMalayalam ? "സ്രോതസ്സുകൾ" : "Source References"}
                    </p>
                    {section.sources.map((src, sIdx) => (
                      <p key={sIdx} className="font-inter text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.60)" }}>
                        • {src.book} {src.page ? `p.${src.page}` : ""} {src.chapter ? `— ${src.chapter}` : ""}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ContentBlock({ block, isMalayalam }) {
  if (block.type === "text") {
    return (
      <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
        {isMalayalam ? block.text_ml || block.text_en : block.text_en}
      </p>
    );
  }
  
  if (block.type === "list") {
    return (
      <div className="space-y-1.5">
        {block.title && (
          <p className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.80)" }}>
            {isMalayalam ? block.title_ml || block.title_en : block.title_en}
          </p>
        )}
        {block.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: block.color || "rgba(212,175,55,0.60)" }} />
            <span className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
              {isMalayalam ? item.ml || item.en : item.en}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  if (block.type === "warning") {
    return (
      <div className="p-3 rounded-lg border" style={{ background: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.30)" }}>
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
          <div>
            {block.title && (
              <p className="font-inter text-xs font-semibold mb-1" style={{ color: "#f87171" }}>
                {isMalayalam ? block.title_ml || block.title_en : block.title_en}
              </p>
            )}
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
              {isMalayalam ? block.text_ml || block.text_en : block.text_en}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (block.type === "info") {
    return (
      <div className="p-3 rounded-lg border" style={{ background: "rgba(96,165,250,0.10)", borderColor: "rgba(96,165,250,0.30)" }}>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#60a5fa" }} />
          <div>
            {block.title && (
              <p className="font-inter text-xs font-semibold mb-1" style={{ color: "#60a5fa" }}>
                {isMalayalam ? block.title_ml || block.title_en : block.title_en}
              </p>
            )}
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
              {isMalayalam ? block.text_ml || block.text_en : block.text_en}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (block.type === "success") {
    return (
      <div className="p-3 rounded-lg border" style={{ background: "rgba(74,222,128,0.10)", borderColor: "rgba(74,222,128,0.30)" }}>
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#4ade80" }} />
          <div>
            {block.title && (
              <p className="font-inter text-xs font-semibold mb-1" style={{ color: "#4ade80" }}>
                {isMalayalam ? block.title_ml || block.title_en : block.title_en}
              </p>
            )}
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
              {isMalayalam ? block.text_ml || block.text_en : block.text_en}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}

function ActionTimingResult({ results, isMalayalam }) {
  const { category, rules, mansions, planets, days } = results || {};
  
  if (!category || !rules) {
    return (
      <div className="p-4 rounded-xl border" style={{ background: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.30)" }}>
        <p className="font-inter text-sm" style={{ color: "#f87171" }}>
          {isMalayalam ? "ഡാറ്റ ലഭ്യമല്ല" : "Data not available"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Category Info */}
      <div className="p-4 rounded-xl border" style={{ background: "rgba(212,175,55,0.05)", borderColor: "rgba(212,175,55,0.25)" }}>
        <h3 className="font-inter text-sm font-bold mb-2" style={{ color: "#D4AF37" }}>
          {isMalayalam ? (category.ml || category.en) : category.en}
        </h3>
        <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>
          {rules.source || "Source not specified"}
        </p>
      </div>

      {/* Suitable Mansions */}
      {(mansions?.suitable?.length || 0) > 0 && (
        <ContentBlock
          block={{
            type: "list",
            title_en: "Suitable Lunar Mansions",
            title_ml: "ഉത്തമ ചന്ദ്ര നക്ഷത്രങ്ങൾ",
            items: mansions.suitable.filter(m => m).map(m => ({ en: `${m?.name} (#${m?.no})`, ml: `${m?.name} (#${m?.no})` })),
            color: "#4ade80"
          }}
          isMalayalam={isMalayalam}
        />
      )}

      {/* Suitable Days */}
      {(days?.suitable?.length || 0) > 0 && (
        <ContentBlock
          block={{
            type: "list",
            title_en: "Suitable Days",
            title_ml: "ഉത്തമ ദിവസങ്ങൾ",
            items: (days.suitable || []).map(d => ({ en: d, ml: d })),
            color: "#60a5fa"
          }}
          isMalayalam={isMalayalam}
        />
      )}

      {/* Suitable Planets */}
      {(planets?.suitable?.length || 0) > 0 && (
        <ContentBlock
          block={{
            type: "list",
            title_en: "Suitable Planets",
            title_ml: "ഉത്തമ ഗ്രഹങ്ങൾ",
            items: (planets.suitable || []).map(p => ({ en: p, ml: p })),
            color: "#fbbf24"
          }}
          isMalayalam={isMalayalam}
        />
      )}
    </div>
  );
}

function GeneralSearchResult({ results, isMalayalam }) {
  const sections = [];
  
  if (results.dayRules?.length > 0) {
    sections.push({
      title_en: "Day Rules",
      title_ml: "ദിവസ നിയമങ്ങൾ",
      icon: Sun,
      items: results.dayRules
    });
  }
  
  if (results.mansionRules?.length > 0) {
    sections.push({
      title_en: "Lunar Mansion Rules",
      title_ml: "ചന്ദ്ര നക്ഷത്ര നിയമങ്ങൾ",
      icon: Moon,
      items: results.mansionRules
    });
  }
  
  if (results.timingRules?.length > 0) {
    sections.push({
      title_en: "Timing Rules",
      title_ml: "സമയ നിയമങ്ങൾ",
      icon: Clock,
      items: results.timingRules
    });
  }

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <KnowledgeSectionCard
          key={idx}
          section={{
            title_en: section.title_en,
            title_ml: section.title_ml,
            icon: section.icon,
            content: section.items.map(item => ({
              type: "text",
              text_en: item.data?.description || JSON.stringify(item.data),
              text_ml: item.data?.description || ""
            })),
            sources: section.items.map(item => item.source)
          }}
          isExpanded={true}
          onToggle={() => {}}
          isMalayalam={isMalayalam}
        />
      ))}
    </div>
  );
}