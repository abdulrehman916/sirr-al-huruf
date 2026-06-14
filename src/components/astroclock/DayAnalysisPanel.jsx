import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Star, Heart, Briefcase, Plane, Shield, BookOpen, Info } from "lucide-react";
import { DAY_INFO, PLANET_INFO } from "@/lib/astroClockLiveEngine";

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
  danger: "rgba(239,68,68,0.60)"
};

const WEEKDAYS = [
  { id: 0, name: "Sunday", arabic: "الأحد", malayalam: "ഞായറാഴ്ച", planet: "Sun" },
  { id: 1, name: "Monday", arabic: "الاثنين", malayalam: "തിങ്കളാഴ്ച", planet: "Moon" },
  { id: 2, name: "Tuesday", arabic: "الثلاثاء", malayalam: "ചൊവ്വാഴ്ച", planet: "Mars" },
  { id: 3, name: "Wednesday", arabic: "الأربعاء", malayalam: "ബുധനാഴ്ച", planet: "Mercury" },
  { id: 4, name: "Thursday", arabic: "الخميس", malayalam: "വ്യാഴാഴ്ച", planet: "Jupiter" },
  { id: 5, name: "Friday", arabic: "الجمعة", malayalam: "വെള്ളിയാഴ്ച", planet: "Venus" },
  { id: 6, name: "Saturday", arabic: "السبت", malayalam: "ശനിയാഴ്ച", planet: "Saturn" }
];

export default function DayAnalysisPanel() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const dayData = DAY_INFO[selectedDay];
  const dayInfo = WEEKDAYS.find(d => d.id === selectedDay);

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
          <Calendar className="w-6 h-6" style={{ color: G.text }} />
          <h2 className="font-inter text-xl font-bold uppercase tracking-widest" style={{ color: G.text }}>
            Day Analysis
          </h2>
        </div>

        {/* Day Selector */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {(WEEKDAYS || []).map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className="p-2 rounded-lg text-center border transition-all"
              style={{
                background: selectedDay === day.id ? G.bgHi : "rgba(255,255,255,0.02)",
                borderColor: selectedDay === day.id ? G.border : "rgba(255,255,255,0.08)",
                opacity: selectedDay === day.id ? 1 : 0.6
              }}
            >
              <p className="font-inter text-[8px] uppercase tracking-wider mb-1" style={{ color: G.dim }}>
                {day.planet}
              </p>
              <p className="font-inter text-[9px] font-bold text-white">{day.name.slice(0, 3)}</p>
            </button>
          ))}
        </div>

        {/* Selected Day Details */}
        {dayData && dayInfo && (
          <div className="space-y-4">
            {/* Day Header */}
            <div className="p-4 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                    Planet Ruler
                  </p>
                  <p className="font-inter text-lg font-bold" style={{ color: getPlanetColor(dayInfo.planet) }}>
                    {dayInfo.planet}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-amiri text-2xl font-bold mb-1" style={{ color: G.text }}>
                    {dayInfo.arabic}
                  </p>
                  <p className="font-inter text-xs text-white/60">{dayInfo.malayalam}</p>
                </div>
              </div>

              {/* Relationships */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.success }}>
                    Friendly Days
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(dayData.friendlyDays || []).map((d, idx) => (
                      <span key={idx} className="px-2 py-1 rounded text-[10px]" style={{ background: G.bg, color: G.text }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.danger }}>
                    Enemy Days
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(dayData.enemyDays || []).map((d, idx) => (
                      <span key={idx} className="px-2 py-1 rounded text-[10px]" style={{ background: G.bg, color: G.text }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-2 gap-3">
              <ActivityCard
                icon={Briefcase}
                title="Business"
                content={dayData.business}
                color={G.success}
              />
              <ActivityCard
                icon={Heart}
                title="Love & Marriage"
                content={`${dayData.love} • ${dayData.marriage}`}
                color={G.text}
              />
              <ActivityCard
                icon={Plane}
                title="Travel"
                content={dayData.travel}
                color={G.dim}
              />
              <ActivityCard
                icon={Shield}
                title="Healing"
                content={dayData.healing}
                color={G.success}
              />
            </div>

            {/* Good & Bad Works */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.success }}>
                  Good Works
                </p>
                <ul className="space-y-1">
                  {(dayData.goodWorks || []).map((work, idx) => (
                    <li key={idx} className="font-inter text-xs text-white/70">• {work}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)" }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.danger }}>
                  Bad Works
                </p>
                <ul className="space-y-1">
                  {(dayData.badWorks || []).map((work, idx) => (
                    <li key={idx} className="font-inter text-xs text-white/70">• {work}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Spiritual Operations */}
            <div className="p-4 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4" style={{ color: G.dim }} />
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                  Spiritual Operations
                </p>
              </div>
              <p className="font-inter text-sm text-white/80 mb-2">{dayData.spiritual}</p>
              <p className="font-inter text-[10px] text-white/40">Source: {dayData.source}</p>
            </div>

            {/* Malayalam Explanation */}
            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="font-amiri text-base font-bold mb-2" style={{ color: G.text }}>
                മലയാളം വിശദീകരണം:
              </p>
              <p className="font-inter text-sm text-white/70">{dayData.malayalam}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ActivityCard({ icon: Icon, title, content, color }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color }}>
          {title}
        </p>
      </div>
      <p className="font-inter text-xs text-white/80">{content || "No specific guidance"}</p>
    </div>
  );
}

function getPlanetColor(planet) {
  const colors = {
    Sun: '#FDB813',
    Moon: '#C0C0C0',
    Mercury: '#A0A0A0',
    Venus: '#E0B0FF',
    Mars: '#FF4500',
    Jupiter: '#DAA520',
    Saturn: '#8B4513'
  };
  return colors[planet] || '#FFFFFF';
}