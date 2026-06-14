import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter } from "lucide-react";
import { KNOWLEDGE_DAYS_ML, KNOWLEDGE_HOURS_ML, KNOWLEDGE_LUNAR_MANSIONS_ML, KNOWLEDGE_TIMING_RULES_ML } from "@/lib/astroClockKnowledgeBaseML";

// ── Palette ───────────────────────────────────────────────────
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
};

const CATEGORY_LABELS = {
  DAYS: "ദിവസങ്ങൾ (Days)",
  HOURS: "മണിക്കൂറുകൾ (Hours)",
  LUNAR_MANSIONS: "ചന്ദ്രരാശികൾ (Mansions)",
  TIMING_RULES: "സമയനിയമങ്ങൾ (Timing)",
  PLANETS: "ഗ്രഹങ്ങൾ (Planets)",
  ZODIAC: "രാശികൾ (Zodiac)",
  SAAD_NAHS: "സഅദ്/നഹ്സ് (Saad/Nahs)"
};

export default function AstroClockSearch() {
  const [searchParams, setSearchParams] = useState({
    query: "",
    category: "",
    day: "",
    hour: "",
    planet: "",
    mansion: "",
    zodiac: "",
    action: "",
    arabic: ""
  });

  const allKnowledge = useMemo(() => [
    ...KNOWLEDGE_DAYS_ML,
    ...KNOWLEDGE_HOURS_ML,
    ...KNOWLEDGE_LUNAR_MANSIONS_ML,
    ...KNOWLEDGE_TIMING_RULES_ML
  ], []);

  const getSearchableCategories = () => {
    return [...new Set(allKnowledge.map(k => k.category))];
  };

  const results = useMemo(() => {
    return allKnowledge.filter(rule => {
      const q = searchParams.query.toLowerCase();
      const matchQuery = !q || 
        (rule.original_text?.tr && rule.original_text.tr.toLowerCase().includes(q)) ||
        (rule.malayalam?.title && rule.malayalam.title.toLowerCase().includes(q)) ||
        (rule.malayalam?.meaning && rule.malayalam.meaning.toLowerCase().includes(q));

      const matchCategory = !searchParams.category || rule.category === searchParams.category;
      
      const matchDay = !searchParams.day || 
        (rule.original_text?.tr && rule.original_text.tr.toLowerCase().includes(searchParams.day.toLowerCase())) ||
        (rule.malayalam?.title && rule.malayalam.title.toLowerCase().includes(searchParams.day.toLowerCase()));

      const matchPlanet = !searchParams.planet ||
        (rule.original_text?.tr && rule.original_text.tr.toLowerCase().includes(searchParams.planet.toLowerCase())) ||
        (rule.malayalam?.title && rule.malayalam.title.toLowerCase().includes(searchParams.planet.toLowerCase()));

      const matchMansion = !searchParams.mansion ||
        (rule.original_text?.tr && rule.original_text.tr.toLowerCase().includes(searchParams.mansion.toLowerCase())) ||
        (rule.malayalam?.title && rule.malayalam.title.toLowerCase().includes(searchParams.mansion.toLowerCase()));

      const matchArabic = !searchParams.arabic ||
        (rule.original_text?.letter?.arabic && rule.original_text.letter.arabic.includes(searchParams.arabic));

      const matchAction = !searchParams.action ||
        (rule.malayalam?.suitable_actions && rule.malayalam.suitable_actions.toLowerCase().includes(searchParams.action.toLowerCase()));

      return matchQuery && matchCategory && matchDay && matchPlanet && matchMansion && matchArabic && matchAction;
    });
  }, [searchParams, allKnowledge]);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchParams({
      query: "",
      category: "",
      day: "",
      hour: "",
      planet: "",
      mansion: "",
      zodiac: "",
      action: "",
      arabic: ""
    });
  };

  const stats = {
    totalRules: allKnowledge.length,
    showing: results.length
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="rounded-2xl border p-4"
        style={{
          background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)",
          borderColor: G.borderHi,
          boxShadow: `0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.10)`,
        }}>
        
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5" style={{ color: G.text }} />
          <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
            Knowledge Search
          </h2>
          <span className="font-inter text-xs text-white/40 ml-auto">
            {stats.showing} / {stats.totalRules} rules
          </span>
        </div>

        {/* Main Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchParams.query}
            onChange={(e) => handleInputChange("query", e.target.value)}
            placeholder="Search in Turkish, Malayalam, Arabic..."
            className="w-full pl-10 pr-4 py-3 rounded-xl font-inter text-sm focus:outline-none"
            style={{
              background: "rgba(4,12,34,0.97)",
              border: `1px solid ${G.border}`,
              color: "#fff"
            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
          {searchParams.query && (
            <button
              onClick={() => handleInputChange("query", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" style={{ color: G.dim }} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Category Filter */}
          <div className="lg:col-span-2">
            <label className="block font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
              വിഭാഗം (Category)
            </label>
            <div className="flex flex-wrap gap-2">
              {getSearchableCategories().map(cat => (
                <button
                  key={cat}
                  onClick={() => handleInputChange("category", searchParams.category === cat ? "" : cat)}
                  className="px-3 py-1.5 rounded-lg font-inter text-xs font-semibold"
                  style={{
                    background: searchParams.category === cat ? G.bgHi : "rgba(255,255,255,0.05)",
                    color: searchParams.category === cat ? G.text : "rgba(255,255,255,0.40)",
                    border: `1px solid ${searchParams.category === cat ? G.borderHi : "rgba(255,255,255,0.15)"}`
                  }}>
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {/* Day Filter */}
          <div>
            <label className="block font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
              ദിവസം (Day)
            </label>
            <input
              type="text"
              value={searchParams.day}
              onChange={(e) => handleInputChange("day", e.target.value)}
              placeholder="ഞായർ, Sunday..."
              className="w-full px-3 py-2 rounded-lg font-inter text-xs focus:outline-none"
              style={{
                background: "rgba(4,12,34,0.97)",
                border: `1px solid ${G.faint}`,
                color: "#fff"
              }}
            />
          </div>

          {/* Planet Filter */}
          <div>
            <label className="block font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
              ഗ്രഹം (Planet)
            </label>
            <input
              type="text"
              value={searchParams.planet}
              onChange={(e) => handleInputChange("planet", e.target.value)}
              placeholder="സൂര്യൻ, Sun, Güneş..."
              className="w-full px-3 py-2 rounded-lg font-inter text-xs focus:outline-none"
              style={{
                background: "rgba(4,12,34,0.97)",
                border: `1px solid ${G.faint}`,
                color: "#fff"
              }}
            />
          </div>

          {/* Mansion Filter */}
          <div>
            <label className="block font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
              ചന്ദ്രരാശി (Mansion)
            </label>
            <input
              type="text"
              value={searchParams.mansion}
              onChange={(e) => handleInputChange("mansion", e.target.value)}
              placeholder="ശർത്തെയ്ൻ, Şarteyn..."
              className="w-full px-3 py-2 rounded-lg font-inter text-xs focus:outline-none"
              style={{
                background: "rgba(4,12,34,0.97)",
                border: `1px solid ${G.faint}`,
                color: "#fff"
              }}
            />
          </div>

          {/* Action Filter */}
          <div>
            <label className="block font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
              പ്രവർത്തനം (Action)
            </label>
            <input
              type="text"
              value={searchParams.action}
              onChange={(e) => handleInputChange("action", e.target.value)}
              placeholder="ധനം, പ്രണയം, Para..."
              className="w-full px-3 py-2 rounded-lg font-inter text-xs focus:outline-none"
              style={{
                background: "rgba(4,12,34,0.97)",
                border: `1px solid ${G.faint}`,
                color: "#fff"
              }}
            />
          </div>

          {/* Arabic Filter */}
          <div>
            <label className="block font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
              അറബിക് (Arabic)
            </label>
            <input
              type="text"
              value={searchParams.arabic}
              onChange={(e) => handleInputChange("arabic", e.target.value)}
              placeholder="ا, ب, ج..."
              dir="rtl"
              className="w-full px-3 py-2 rounded-lg font-amiri text-lg focus:outline-none text-right"
              style={{
                background: "rgba(4,12,34,0.97)",
                border: `1px solid ${G.faint}`,
                color: "#fff"
              }}
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(Object.values(searchParams).some(v => v !== "")) && (
          <button
            onClick={clearFilters}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg font-inter text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.60)",
              border: `1px solid rgba(255,255,255,0.15)`
            }}>
            <X className="w-3 h-3" /> Clear All Filters
          </button>
        )}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="rounded-xl border px-4 py-8 text-center"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="font-inter text-sm text-white/30">No results found. Try different search terms.</p>
          </div>
        ) : (
          results.map((rule, idx) => (
            <motion.div
              key={rule.id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="rounded-2xl border p-5 space-y-4"
              style={{
                background: "linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)",
                borderColor: G.border,
                boxShadow: "0 2px 20px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.06)",
              }}>
              
              {/* Source Info */}
              <div className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: `rgba(212,175,55,0.15)` }}>
                <div className="flex items-center gap-2">
                  <span className="font-inter text-[9px] uppercase tracking-widest px-2 py-1 rounded"
                    style={{ background: G.bg, color: G.dim, border: `1px solid ${G.faint}` }}>
                    {rule.category}
                  </span>
                  <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                    {rule.source?.book}
                  </span>
                </div>
                <span className="font-inter text-[10px] font-bold" style={{ color: G.text }}>
                  Page {rule.source?.page}
                </span>
              </div>

              {/* Original Source Text */}
              <div>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                  SOURCE:
                </p>
                {rule.original_text?.tr && (
                  <p className="font-inter text-sm text-white/80 mb-2">
                    {rule.original_text.tr}
                  </p>
                )}
                {rule.original_text?.rule && (
                  <p className="font-inter text-sm text-white/70 italic">
                    {rule.original_text.rule}
                  </p>
                )}
                {rule.original_text?.letter?.arabic && (
                  <p className="font-amiri text-2xl text-gold mt-2" dir="rtl">
                    {rule.original_text.letter.arabic}
                  </p>
                )}
              </div>

              {/* Malayalam Explanation */}
              {rule.malayalam && (
                <div className="p-4 rounded-xl"
                  style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
                  <h3 className="font-amiri text-lg font-bold mb-3" style={{ color: G.text }}>
                    മലയാളം വിശദീകരണം:
                  </h3>
                  
                  {rule.malayalam.title && (
                    <p className="font-inter text-sm text-white/90 font-semibold mb-2">
                      {rule.malayalam.title}
                    </p>
                  )}
                  
                  {rule.malayalam.meaning && (
                    <p className="font-inter text-sm text-white/70 mb-3">
                      {rule.malayalam.meaning}
                    </p>
                  )}

                  {rule.malayalam.benefits && rule.malayalam.benefits.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
                        ഗുണങ്ങൾ:
                      </p>
                      <ul className="space-y-1">
                        {rule.malayalam.benefits.map((benefit, i) => (
                          <li key={i} className="font-inter text-xs text-white/60 flex items-start gap-2">
                            <span className="text-gold mt-0.5">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rule.malayalam.suitable_actions && (
                    <div className="mb-3">
                      <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
                        ചെയ്യേണ്ട കാര്യങ്ങൾ:
                      </p>
                      <p className="font-inter text-xs text-white/70">
                        {rule.malayalam.suitable_actions}
                      </p>
                    </div>
                  )}

                  {rule.malayalam.practical_application && (
                    <div className="mb-3">
                      <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
                        പ്രായോഗിക പ്രയോഗം:
                      </p>
                      <p className="font-inter text-xs text-white/70 italic">
                        {rule.malayalam.practical_application}
                      </p>
                    </div>
                  )}

                  {rule.malayalam.warnings && (
                    <div>
                      <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(239,68,68,0.60)" }}>
                        മുന്നറിയിപ്പുകൾ:
                      </p>
                      <p className="font-inter text-xs text-white/60">
                        {rule.malayalam.warnings}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Results Count */}
      {results.length > 0 && (
        <div className="text-center py-4">
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
            Showing {results.length} of {stats.totalRules} rules
          </p>
        </div>
      )}
    </div>
  );
}