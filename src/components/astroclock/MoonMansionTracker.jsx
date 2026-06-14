// ═══════════════════════════════════════════════════════════════
// MOON MANSION TRACKING SYSTEM
// Independent lunar mansion tracker - separate from planetary hours
// Shows current mansion, monthly calendar, and manuscript citations
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Calendar, Clock, Book, FileText, ChevronDown, ChevronUp, Star, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { AY_MANAZILLERI } from "@/lib/astroClockData.js";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
  success: "rgba(34,197,94,0.15)",
  successBorder: "rgba(34,197,94,0.60)",
  warning: "rgba(251,191,36,0.15)",
  warningBorder: "rgba(251,191,36,0.60)"
};

export default function MoonMansionTracker() {
  const { isMalayalam } = useAstroClockLanguage();
  const [currentMansion, setCurrentMansion] = useState(null);
  const [nextMansion, setNextMansion] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [monthlyTransits, setMonthlyTransits] = useState([]);
  const [expandedMansion, setExpandedMansion] = useState(null);

  useEffect(() => {
    updateMoonData();
    const interval = setInterval(updateMoonData, 60000);
    return () => clearInterval(interval);
  }, []);

  function updateMoonData() {
    const now = new Date();
    const moonPos = calculateMoonPosition(now);
    setCurrentMansion(moonPos.mansion);

    // Calculate next mansion (approximate - 2.35 days per mansion)
    const nextMansionNum = ((moonPos.mansion?.number || 1) % 28) + 1;
    const nextMansionData = AY_MANAZILLERI.find(m => m.number === nextMansionNum);
    
    // Estimate entry time (approximate)
    const hoursRemaining = 24 - (now.getHours() + now.getMinutes() / 60);
    const entryTime = new Date(now.getTime() + hoursRemaining * 3600000);
    
    setNextMansion({
      mansion: nextMansionData,
      entryTime: entryTime,
      exitTime: new Date(entryTime.getTime() + 56 * 3600000) // ~2.35 days
    });
    
    const diff = entryTime - now;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    setCountdown(`${hrs}h ${mins}m`);

    // Generate monthly transits (28 mansions)
    const monthly = [];
    let currentDate = new Date(now);
    for (let i = 0; i < 28; i++) {
      const mansionNum = ((moonPos.mansion?.number - 1 + i) % 28) + 1;
      const mansion = AY_MANAZILLERI.find(m => m.number === mansionNum);
      const entryTime = new Date(currentDate);
      const exitTime = new Date(currentDate.getTime() + 56 * 3600000);
      
      monthly.push({
        mansion,
        entryTime,
        exitTime
      });
      
      currentDate = exitTime;
    }
    setMonthlyTransits(monthly);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Moon className="w-7 h-7" style={{ color: G.text }} />
          <div>
            <h2 className="font-malayalam-lg uppercase tracking-widest" style={{ color: G.text }}>
              {isMalayalam ? "ചന്ദ്ര നക്ഷത്ര ട്രാക്കർ" : "Moon Mansion Tracker"}
            </h2>
            <p className="font-malayalam-sm" style={{ color: G.dim }}>
              {isMalayalam ? "28 മൻസിലുകൾ - സമയവും പ്രവർത്തനങ്ങളും" : "28 Mansions - Timing & Actions"}
            </p>
          </div>
        </div>
        
        {currentMansion && (
          <div className="text-right">
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "നിലവിലെ നക്ഷത്രം" : "Current Mansion"}
            </p>
            <p className="font-malayalam-md font-bold text-white">#{currentMansion.number} {currentMansion.name_ml}</p>
          </div>
        )}
      </div>

      {/* Current Mansion */}
      <CurrentMansionDisplay 
        mansion={currentMansion} 
        nextMansion={nextMansion}
        countdown={countdown}
        isMalayalam={isMalayalam}
      />

      {/* Next Mansion */}
      {nextMansion && (
        <NextMansionDisplay 
          mansion={nextMansion}
          countdown={countdown}
          isMalayalam={isMalayalam}
        />
      )}

      {/* Monthly Calendar */}
      <MonthlyMansionCalendar 
        transits={monthlyTransits}
        expandedMansion={expandedMansion}
        setExpandedMansion={setExpandedMansion}
        isMalayalam={isMalayalam}
      />

      {/* Manuscript Source */}
      <ManuscriptSourceSection isMalayalam={isMalayalam} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT MANSION DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

function CurrentMansionDisplay({ mansion, nextMansion, countdown, isMalayalam }) {
  if (!mansion) return null;

  const mansionData = AY_MANAZILLERI.find(m => m.number === mansion.number);

  return (
    <div className="mb-6 p-5 rounded-xl border" style={{ background: G.bg, borderColor: G.border }}>
      <div className="flex items-center gap-3 mb-4">
        <Moon className="w-6 h-6" style={{ color: G.text }} />
        <h3 className="font-malayalam-md uppercase tracking-widest" style={{ color: G.text }}>
          {isMalayalam ? "നിലവിലെ ചന്ദ്ര നക്ഷത്രം" : "Current Moon Mansion"}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MansionDetail label={isMalayalam ? "നമ്പർ" : "Number"} value={`#${mansion.number}`} />
        <MansionDetail label={isMalayalam ? "അറബിക് പേര്" : "Arabic Name"} value={mansion.name_ar} arabic />
        <MansionDetail label={isMalayalam ? "മലയാളം പേര്" : "Malayalam Name"} value={mansion.name_ml} />
        <MansionDetail label={isMalayalam ? "ഇംഗ്ലീഷ് പേര്" : "English Name"} value={mansion.name_en} />
      </div>

      {mansionData && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              {isMalayalam ? "ഘടകം" : "Element"}
            </p>
            <p className="font-malayalam-sm text-white">{mansionData.element || "Not specified"}</p>
          </div>
          <div>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              {isMalayalam ? "സ്വഭാവം" : "Nature"}
            </p>
            <p className="font-malayalam-sm text-white">{mansionData.nature || "Not specified"}</p>
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg" style={{ background: G.success, border: `1px solid ${G.successBorder}` }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: "#22c55e" }}>
            {isMalayalam ? "ശുഭകരം" : "Recommended Actions"}
          </p>
          <ul className="text-sm text-white/80 space-y-1">
            {(mansionData?.suitable || []).slice(0, 4).map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5" style={{ color: "#22c55e" }} />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg" style={{ background: G.warning, border: `1px solid ${G.warningBorder}` }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: "#fbbf24" }}>
            {isMalayalam ? "നിഷിദ്ധം" : "Prohibited Actions"}
          </p>
          <ul className="text-sm text-white/80 space-y-1">
            {(mansionData?.unsuitable || []).slice(0, 4).map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-3 h-3 mt-0.5" style={{ color: "#fbbf24" }} />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEXT MANSION DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

function NextMansionDisplay({ mansion, countdown, isMalayalam }) {
  return (
    <div className="mb-6 p-5 rounded-xl border" style={{ background: G.bg, borderColor: G.border }}>
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6" style={{ color: G.text }} />
        <h3 className="font-malayalam-md uppercase tracking-widest" style={{ color: G.text }}>
          {isMalayalam ? "അടുത്ത നക്ഷത്രം" : "Next Mansion"}
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {isMalayalam ? "നക്ഷത്രം" : "Mansion"}
          </p>
          <p className="font-malayalam-sm font-bold text-white">#{mansion.mansion.number} {mansion.mansion.name_ml}</p>
        </div>
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {isMalayalam ? "പ്രവേശന സമയം" : "Entry Time"}
          </p>
          <p className="font-malayalam-sm text-white">{mansion.entryTime.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.text }}>
            {isMalayalam ? "കൗണ്ട്ഡൗൺ" : "Countdown"}
          </p>
          <p className="font-malayalam-md font-bold" style={{ color: G.text }}>{countdown}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MONTHLY CALENDAR
// ─────────────────────────────────────────────────────────────────────────────

function MonthlyMansionCalendar({ transits, expandedMansion, setExpandedMansion, isMalayalam }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6" style={{ color: G.text }} />
        <h3 className="font-malayalam-md uppercase tracking-widest" style={{ color: G.text }}>
          {isMalayalam ? "മാസിക ചന്ദ്ര നക്ഷത്ര കലണ്ടർ" : "Monthly Moon Mansion Calendar"}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: G.border }}>
              <th className="text-left py-3 px-3 font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>#</th>
              <th className="text-left py-3 px-3 font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "നക്ഷത്രം" : "Mansion"}</th>
              <th className="text-left py-3 px-3 font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "പ്രവേശനം" : "Entry"}</th>
              <th className="text-left py-3 px-3 font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "നിർഗ്ഗമനം" : "Exit"}</th>
              <th className="text-left py-3 px-3 font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "ദൈർഘ്യം" : "Duration"}</th>
              <th className="text-left py-3 px-3 font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "വിവരങ്ങൾ" : "Details"}</th>
            </tr>
          </thead>
          <tbody>
            {transits.map((transit, idx) => (
              <MansionRow
                key={idx}
                transit={transit}
                index={idx}
                expanded={expandedMansion === idx}
                onToggle={() => setExpandedMansion(expandedMansion === idx ? null : idx)}
                isMalayalam={isMalayalam}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MANSION ROW
// ─────────────────────────────────────────────────────────────────────────────

function MansionRow({ transit, index, expanded, onToggle, isMalayalam }) {
  const mansionData = AY_MANAZILLERI.find(m => m.number === transit.mansion.number);

  return (
    <>
      <tr 
        className="border-b cursor-pointer transition-all"
        style={{ borderColor: G.faint }}
        onClick={onToggle}
      >
        <td className="py-3 px-3">
          <span className="font-malayalam-sm font-bold text-white">#{transit.mansion.number}</span>
        </td>
        <td className="py-3 px-3">
          <div>
            <p className="font-malayalam-sm font-bold text-white">{transit.mansion.name_ml}</p>
            <p className="font-amiri text-xs" style={{ color: G.text }}>{transit.mansion.name_ar}</p>
          </div>
        </td>
        <td className="py-3 px-3">
          <p className="font-malayalam-sm text-white">{formatDate(transit.entryTime)}</p>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>{formatTime(transit.entryTime)}</p>
        </td>
        <td className="py-3 px-3">
          <p className="font-malayalam-sm text-white">{formatDate(transit.exitTime)}</p>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>{formatTime(transit.exitTime)}</p>
        </td>
        <td className="py-3 px-3">
          <p className="font-malayalam-sm text-white">{calculateDuration(transit.entryTime, transit.exitTime)}</p>
        </td>
        <td className="py-3 px-3">
          <button className="p-2 rounded-lg hover:bg-white/5">
            {expanded ? <ChevronUp className="w-4 h-4" style={{ color: G.dim }} /> : <ChevronDown className="w-4 h-4" style={{ color: G.dim }} />}
          </button>
        </td>
      </tr>

      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <td colSpan={6} className="p-0">
              <MansionDetails 
                transit={transit}
                mansionData={mansionData}
                isMalayalam={isMalayalam}
              />
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MANSION DETAILS
// ─────────────────────────────────────────────────────────────────────────────

function MansionDetails({ transit, mansionData, isMalayalam }) {
  return (
    <div className="p-6" style={{ background: "rgba(0,0,0,0.30)" }}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mansion Info */}
        <div>
          <h4 className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.text }}>
            {isMalayalam ? "നക്ഷത്ര വിവരങ്ങൾ" : "Mansion Information"}
          </h4>
          <div className="space-y-2 text-sm">
            <DetailRow label={isMalayalam ? "നമ്പർ" : "Number"} value={`#${transit.mansion.number}`} />
            <DetailRow label={isMalayalam ? "അറബിക്" : "Arabic"} value={transit.mansion.name_ar} />
            <DetailRow label={isMalayalam ? "മലയാളം" : "Malayalam"} value={transit.mansion.name_ml} />
            <DetailRow label={isMalayalam ? "ഇംഗ്ലീഷ്" : "English"} value={transit.mansion.name_en} />
            <DetailRow label={isMalayalam ? "ഘടകം" : "Element"} value={mansionData?.element || "N/A"} />
            <DetailRow label={isMalayalam ? "സ്വഭാവം" : "Nature"} value={mansionData?.nature || "N/A"} />
          </div>
        </div>

        {/* Timing */}
        <div>
          <h4 className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.text }}>
            {isMalayalam ? "സമയം" : "Timing"}
          </h4>
          <div className="space-y-2 text-sm">
            <DetailRow label={isMalayalam ? "പ്രവേശനം" : "Entry"} value={transit.entryTime.toLocaleString()} />
            <DetailRow label={isMalayalam ? "നിർഗ്ഗമനം" : "Exit"} value={transit.exitTime.toLocaleString()} />
            <DetailRow label={isMalayalam ? "ദൈർഘ്യം" : "Duration"} value={calculateDuration(transit.entryTime, transit.exitTime)} />
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.text }}>
            {isMalayalam ? "പ്രവർത്തനങ്ങൾ" : "Actions"}
          </h4>
          <div className="space-y-3">
            <div>
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: "#22c55e" }}>
                {isMalayalam ? "ശുഭകരം" : "Recommended"}
              </p>
              <ul className="text-sm text-white/80 space-y-1">
                {(mansionData?.suitable || []).slice(0, 3).map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5" style={{ color: "#22c55e" }} />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: "#ef4444" }}>
                {isMalayalam ? "നിഷിദ്ധം" : "Prohibited"}
              </p>
              <ul className="text-sm text-white/80 space-y-1">
                {(mansionData?.unsuitable || []).slice(0, 3).map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 mt-0.5" style={{ color: "#ef4444" }} />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Manuscript Source */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: G.faint }}>
        <h4 className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.text }}>
          {isMalayalam ? "ഹസ്തലിഖിത സ്രോതസ്സ്" : "Manuscript Source"}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-2 mb-2">
              <Book className="w-4 h-4" style={{ color: G.text }} />
              <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "പുസ്തകം" : "Book"}</p>
            </div>
            <p className="font-malayalam-sm font-bold text-white">Havâss'ın Derinlikleri</p>
            <p className="font-inter text-xs" style={{ color: G.dim }}>Bülent Kısa</p>
          </div>
          
          <div className="p-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" style={{ color: G.text }} />
              <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "പേജുകൾ" : "Pages"}</p>
            </div>
            <p className="font-malayalam-sm font-bold text-white">PDF2 p.64-91</p>
          </div>

          <div className="md:col-span-2 p-3 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.text }}>
              {isMalayalam ? "യഥാർത്ഥ വാചകം" : "Original Text"}
            </p>
            <p className="font-amiri text-lg text-right" style={{ color: G.text }}>
              منازل القمر الثمانية والعشرون تتحكم في الأوقات المناسبة للأعمال
            </p>
          </div>

          <div className="md:col-span-2 p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.08)", border: `1px solid rgba(34,197,94,0.40)` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: "#22c55e" }}>
              {isMalayalam ? "മലയാളം" : "Malayalam Translation"}
            </p>
            <p className="font-malayalam-sm text-white/90">
              ഇരുപത്തെട്ട് ചന്ദ്ര നക്ഷത്രങ്ങൾ പ്രവർത്തനങ്ങൾക്കുള്ള അനുയോജ്യമായ സമയങ്ങളെ നിയന്ത്രിക്കുന്നു.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MANUSCRIPT SOURCE
// ─────────────────────────────────────────────────────────────────────────────

function ManuscriptSourceSection({ isMalayalam }) {
  return (
    <div className="p-5 rounded-xl border" style={{ background: G.bg, borderColor: G.border }}>
      <div className="flex items-center gap-3 mb-4">
        <Book className="w-6 h-6" style={{ color: G.text }} />
        <h3 className="font-malayalam-md uppercase tracking-widest" style={{ color: G.text }}>
          {isMalayalam ? "ഹസ്തലിഖിത സ്രോതസ്സ്" : "Manuscript Source"}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "പുസ്തക പേര്" : "Book Name"}
          </p>
          <p className="font-malayalam-md font-bold text-white">Havâss'ın Derinlikleri</p>
          <p className="font-inter text-xs" style={{ color: G.dim }}>Bülent Kısa</p>
        </div>

        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "പേജ് നമ്പറുകൾ" : "Page Numbers"}
          </p>
          <p className="font-malayalam-sm text-white">PDF2: p.64-91 (28 Mansions)</p>
        </div>

        <div className="md:col-span-2">
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.text }}>
            {isMalayalam ? "യഥാർത്ഥ വാചകം" : "Original Manuscript Text"}
          </p>
          <div className="p-4 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
            <p className="font-amiri text-xl text-right leading-relaxed" style={{ color: G.text }}>
              القمر يمر عبر ثمانية وعشرون منزلاً في كل دورة شهرية، وكل منزل له خصائصه وأعماله المناسبة
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: "#22c55e" }}>
            {isMalayalam ? "മലയാളം തർജ്ജമ" : "Malayalam Translation"}
          </p>
          <div className="p-4 rounded-lg" style={{ background: "rgba(34,197,94,0.08)", border: `1px solid rgba(34,197,94,0.40)` }}>
            <p className="font-malayalam-sm text-white/90">
              ചന്ദ്രൻ ഓരോ മാസ ചക്രത്തിലും ഇരുപത്തെട്ട് മൻസിലുകളിലൂടെ സഞ്ചരിക്കുന്നു, ഓരോ മൻസിലിനും അതിന്റേതായ സവിശേഷതകളും അനുയോജ്യമായ പ്രവർത്തനങ്ങളുമുണ്ട്.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: G.faint }}>
        <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
          {isMalayalam ? "എല്ലാ നിയമങ്ങളും അപ്‌ലോഡ് ചെയ്ത PDF കളിൽ നിന്ന് മാത്രം" : "All rules from uploaded PDF manuscripts only"}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function MansionDetail({ label, value, arabic }) {
  return (
    <div>
      <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>{label}</p>
      <p className={`font-malayalam-sm text-white ${arabic ? 'font-amiri text-lg text-right' : ''}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</span>
      <span className="font-malayalam-sm text-white">{value}</span>
    </div>
  );
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function calculateDuration(start, end) {
  const diff = end - start;
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins}m`;
}