// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK MASTER SEARCH — ONE UNIFIED SEARCH BAR
// Searches ALL sources: Database, PDFs, Books, Manuscripts, User Knowledge
// Supports: Malayalam, English, Arabic, Turkish
// Returns ONE unified 10-section report
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Clock, Star, Moon, Sun, AlertCircle, CheckCircle, Info, Calendar, Compass, Sparkles } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { searchBookKnowledge } from "@/lib/astroClockBookSearch.js";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentPlanetaryHour, getDayRuler, PLANET_INFO } from "@/lib/astroClockLiveEngine.js";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { AY_MANAZILLERI, PLANETARY_DAY_RULERS } from "@/lib/astroClockData.js";

// Translation dictionary for multi-language search
const TRANSLATION_MAP = {
  marriage: { ml: "വിവാഹം", ar: "النكاح", tr: "Evlilik" },
  business: { ml: "വ്യാപാരം", ar: "التجارة", tr: "İş" },
  travel: { ml: "യാത്ര", ar: "السفر", tr: "Seyahat" },
  healing: { ml: "ചികിത്സ", ar: "الشفاء", tr: "Şifa" },
  education: { ml: "പഠനം", ar: "التعلم", tr: "Eğitim" },
  love: { ml: "പ്രണയം", ar: "المحبة", tr: "Aşk" },
  construction: { ml: "വീട് നിർമ്മാണം", ar: "البناء", tr: "İnşaat" },
  spiritual: { ml: "ആത്മീയ അമൽ", ar: "العمل الروحي", tr: "Spiritual" }
};

export default function AdvancedKnowledgeSearch({ currentAstroData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { t, isMalayalam } = useAstroClockLanguage();
  const { toast } = useToast();

  // Load current astrological data on mount
  useEffect(() => {
    const now = new Date();
    const planetaryHour = getCurrentPlanetaryHour(now, 6.5, 18.25);
    const moonPos = calculateMoonPosition(now);
    const dayRulerInfo = PLANETARY_DAY_RULERS.find(d => d.day_name_en === now.toLocaleDateString('en-US', { weekday: 'long' }));
    const currentMansion = AY_MANAZILLERI.find(m => m.no === moonPos.mansion?.number);
    
    setCurrentData({
      date: now,
      planetaryHour,
      moonPosition: moonPos,
      currentMansion,
      dayRuler: dayRulerInfo,
      zodiacSign: moonPos.mansion?.zodiac_sign || "Unknown"
    });
  }, []);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      // Search ALL sources simultaneously
      const results = searchBookKnowledge(query);
      
      // Generate unified 10-section report
      const unifiedReport = generateUnifiedReport(query, results, currentData);
      
      setSearchResults(unifiedReport);
      
      if (results.found) {
        toast({
          title: isMalayalam ? "ഫലങ്ങൾ കണ്ടെത്തി" : "Results Found",
          description: isMalayalam 
            ? "എല്ലാ സ്രോതസ്സുകളും തിരഞ്ഞു"
            : "Searched all 8 sources",
          duration: 3000
        });
      } else {
        toast({
          title: isMalayalam ? "ഫലങ്ങളില്ല" : "No Results",
          description: isMalayalam 
            ? "ബുക്ക് ഡാറ്റാബേസിൽ ഫലങ്ങളില്ല"
            : "No book-based reference found",
          duration: 3000
        });
      }
      
      setIsSearching(false);
    }, 400);
  }, [isMalayalam, toast, currentData]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* MASTER SEARCH BOX */}
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

      {/* UNIFIED 10-SECTION REPORT */}
      <AnimatePresence>
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <UnifiedReport 
              report={searchResults} 
              isMalayalam={isMalayalam} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generate unified 10-section report
function generateUnifiedReport(query, searchResults, currentData) {
  if (!currentData) return null;
  
  const { planetaryHour, moonPosition, currentMansion, dayRuler, zodiacSign } = currentData;
  
  // Find best times from search results
  const bestTimes = searchResults.type === 'ACTION_TIMING' ? searchResults.rules : {};
  
  return {
    // Section 1: Meaning of the topic
    section1_meaning: {
      title_en: "Meaning of the Topic",
      title_ml: "വിഷയത്തിന്റെ അർത്ഥം",
      title_ar: "معنى الموضوع",
      query: query,
      found: searchResults.found,
      sources: searchResults._metadata?.sources_searched || []
    },
    
    // Section 2: Related topics
    section2_related: {
      title_en: "Related Topics",
      title_ml: "ബന്ധപ്പെട്ട വിഷയങ്ങൾ",
      title_ar: "المواضيع ذات الصلة",
      topics: searchResults.type === 'ACTION_TIMING' 
        ? [bestTimes.suitableDays, bestTimes.suitablePlanets].flat().filter(Boolean)
        : searchResults.dayRules?.map(r => r.data?.day).filter(Boolean) || []
    },
    
    // Section 3: Current lunar mansion
    section3_mansion: {
      title_en: "Current Lunar Mansion",
      title_ml: "നിലവിലെ ചന്ദ്ര നക്ഷത്രം",
      title_ar: "المحطة القمرية الحالية",
      number: currentMansion?.no || null,
      name: currentMansion?.name || "Unknown",
      name_arabic: currentMansion?.name_arabic || null,
      nature: currentMansion?.genel_hukum || "Unknown",
      source: "Havâss'ın Derinlikleri p.64-74"
    },
    
    // Section 4: Current moon position
    section4_moon: {
      title_en: "Current Moon Position",
      title_ml: "നിലവിലെ ചന്ദ്ര സ്ഥാനം",
      title_ar: "موضع القمر الحالي",
      mansion: moonPosition?.mansion?.number || null,
      zodiac: moonPosition?.mansion?.zodiac_sign || "Unknown",
      degree: moonPosition?.mansion?.zodiac_degree || null,
      source: "Live Calculation"
    },
    
    // Section 5: Current planetary hour
    section5_hour: {
      title_en: "Current Planetary Hour",
      title_ml: "നിലവിലെ ഗ്രഹ മണിക്കൂർ",
      title_ar: "الساعة الكوكبية الحالية",
      planet: planetaryHour?.planetInfo?.name_en || "Unknown",
      planet_ar: planetaryHour?.planetInfo?.name_ar || null,
      nature: planetaryHour?.planetInfo?.nature_en || "Unknown",
      remaining: planetaryHour?.remainingTime || "Unknown",
      source: "Live Calculation"
    },
    
    // Section 6: Current planetary day
    section6_day: {
      title_en: "Current Planetary Day",
      title_ml: "നിലവിലെ ഗ്രഹ ദിവസം",
      title_ar: "اليوم الكوكبي الحالي",
      day: dayRuler?.day_name_en || "Unknown",
      ruler: dayRuler?.planet || "Unknown",
      symbol: dayRuler?.symbol || null,
      source: "Havâss'ın Derinlikleri p.50-51"
    },
    
    // Section 7: Current zodiac influence
    section7_zodiac: {
      title_en: "Current Zodiac Influence",
      title_ml: "നിലവിലെ രാശി സ്വാധീനം",
      title_ar: "تأثير البرج الحالي",
      sign: zodiacSign || "Unknown",
      element: getElementForSign(zodiacSign),
      source: "Havâss'ın Derinlikleri p.77"
    },
    
    // Section 8: Best time today
    section8_best_today: {
      title_en: "Best Time Today",
      title_ml: "ഇന്നത്തെ മികച്ച സമയം",
      title_ar: "أفضل وقت اليوم",
      planets: bestTimes.suitablePlanets || ["Jupiter", "Venus"],
      mansions: (bestTimes.suitableMansions || []).map(num => AY_MANAZILLERI.find(m => m.no === num)).filter(Boolean),
      source: searchResults.source || "Database lookup"
    },
    
    // Section 9: Next best hour today
    section9_next_hour: {
      title_en: "Next Best Hour Today",
      title_ml: "അടുത്ത മികച്ച മണിക്കൂർ",
      title_ar: "أفضل ساعة تالية",
      hour: planetaryHour?.nextPlanet || "Jupiter",
      reason: "Next favorable planetary sequence",
      source: "Planetary hour sequence"
    },
    
    // Section 10: Next best day
    section10_next_day: {
      title_en: "Next Best Day",
      title_ml: "അടുത്ത മികച്ച ദിവസം",
      title_ar: "أفضل يوم تالي",
      day: findNextGoodDay(dayRuler?.day_name_en),
      ruler: "Jupiter or Venus",
      reason: "Most benefic planetary rulers",
      source: "Havâss'ın Derinlikleri p.51"
    },
    
    // Metadata
    _metadata: {
      all_sources_searched: true,
      total_sections: 10,
      generated_at: new Date().toISOString()
    }
  };
}

function getElementForSign(sign) {
  const fireSigns = ["Koç", "Arslan", "Yay"];
  const earthSigns = ["Boğa", "Başak", "Oğlak"];
  const airSigns = ["İkizler", "Terazi", "Kova"];
  if (fireSigns.includes(sign)) return "Fire";
  if (earthSigns.includes(sign)) return "Earth";
  if (airSigns.includes(sign)) return "Air";
  return "Water";
}

function findNextGoodDay(currentDay) {
  const goodDays = ["Thursday", "Friday", "Sunday"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentIndex = days.indexOf(currentDay);
  for (let i = currentIndex + 1; i < currentIndex + 7; i++) {
    const nextDay = days[i % 7];
    if (goodDays.includes(nextDay)) return nextDay;
  }
  return "Thursday";
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

function UnifiedReport({ report, isMalayalam }) {
  if (!report) return null;
  
  const sections = [
    { id: 1, data: report.section1_meaning, icon: Book, title_key: "title_en" },
    { id: 2, data: report.section2_related, icon: Info, title_key: "title_en" },
    { id: 3, data: report.section3_mansion, icon: Moon, title_key: "title_en" },
    { id: 4, data: report.section4_moon, icon: Moon, title_key: "title_en" },
    { id: 5, data: report.section5_hour, icon: Clock, title_key: "title_en" },
    { id: 6, data: report.section6_day, icon: Sun, title_key: "title_en" },
    { id: 7, data: report.section7_zodiac, icon: Sparkles, title_key: "title_en" },
    { id: 8, data: report.section8_best_today, icon: CheckCircle, title_key: "title_en" },
    { id: 9, data: report.section9_next_hour, icon: Clock, title_key: "title_en" },
    { id: 10, data: report.section10_next_day, icon: Calendar, title_key: "title_en" }
  ];
  
  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <ReportSectionCard 
          key={section.id}
          section={section}
          isMalayalam={isMalayalam}
        />
      ))}
    </div>
  );
}

function ReportSectionCard({ section, isMalayalam }) {
  const SectionIcon = section.icon || Book;
  const data = section.data;
  
  return (
    <div className="rounded-xl border p-4" style={{ background: "rgba(8,18,44,0.95)", borderColor: "rgba(212,175,55,0.25)" }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "rgba(212,175,55,0.15)" }}>
          <SectionIcon className="w-4 h-4" style={{ color: "#D4AF37" }} />
        </div>
        <div>
          <h3 className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(212,175,55,0.80)" }}>
            {isMalayalam ? (data.title_ml || data.title_en) : data.title_en}
          </h3>
          {data.title_ar && (
            <p className="font-amiri text-sm" style={{ color: "rgba(212,175,55,0.60)" }}>
              {data.title_ar}
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-2 pl-11">
        {Object.entries(data).filter(([key]) => !key.startsWith('title_') && key !== 'found' && key !== 'sources').map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "rgba(212,175,55,0.60)" }} />
            <div className="flex-1">
              <span className="font-inter text-xs font-semibold capitalize" style={{ color: "rgba(212,175,55,0.70)" }}>
                {key.replace(/_/g, ' ')}: 
              </span>
              <span className="font-inter text-sm ml-1" style={{ color: "rgba(255,255,255,0.80)" }}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          </div>
        ))}
        
        {data.source && (
          <div className="pt-2 border-t mt-2" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
            <div className="flex items-center gap-2">
              <Book className="w-3 h-3" style={{ color: "rgba(212,175,55,0.50)" }} />
              <p className="font-inter text-xs" style={{ color: "rgba(212,175,55,0.50)" }}>
                {data.source}
              </p>
            </div>
          </div>
        )}
      </div>
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