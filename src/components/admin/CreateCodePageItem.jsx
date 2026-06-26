import { motion } from "framer-motion";
import { Check } from "lucide-react";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const DURATION_OPTIONS = [
  { value: "1_DAY",     label: "1 Day",      days: 1 },
  { value: "2_DAYS",    label: "2 Days",     days: 2 },
  { value: "3_DAYS",    label: "3 Days",     days: 3 },
  { value: "7_DAYS",    label: "7 Days",     days: 7 },
  { value: "15_DAYS",   label: "15 Days",    days: 15 },
  { value: "30_DAYS",   label: "30 Days",    days: 30 },
  { value: "2_MONTHS",  label: "2 Months",   days: 60 },
  { value: "3_MONTHS",  label: "3 Months",   days: 90 },
  { value: "6_MONTHS",  label: "6 Months",   days: 180 },
  { value: "9_MONTHS",  label: "9 Months",   days: 270 },
  { value: "1_YEAR",    label: "1 Year",     days: 365 },
  { value: "LIFETIME",  label: "Lifetime",   days: null },
  { value: "CUSTOM",    label: "Custom",     days: null },
];

export default function CreateCodePageItem({
  page,
  isSelected,
  duration,
  onToggle,
  onDurationChange,
  onCustomDateChange,
}) {
  return (
    <div
      className="rounded-lg border p-3 transition-all"
      style={{
        background: isSelected ? G.bg : "rgba(255,255,255,0.02)",
        borderColor: isSelected ? G.border : "rgba(255,255,255,0.06)",
      }}
    >
      <button
        onClick={() => onToggle(page.path)}
        className="w-full flex items-center gap-3 mb-2 text-left"
        style={{ color: isSelected ? "white" : "rgba(255,255,255,0.50)" }}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
          style={{
            background: isSelected ? G.text : "transparent",
            border: `1.5px solid ${isSelected ? G.text : "rgba(255,255,255,0.25)"}`,
          }}
        >
          {isSelected && <Check className="w-3 h-3 text-black" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium flex items-center gap-2">
            <span>{page.icon || '📖'}</span>
            <span>{page.name}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
            <span>{page.category || 'General'}</span>
            <span>·</span>
            <span>{page.adminOnly ? "Admin" : "User"} Access</span>
          </div>
        </div>
      </button>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="ml-8 space-y-2"
        >
          <label className="text-xs text-white/45 block">Duration</label>
          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onDurationChange(page.path, opt.value)}
                className="px-2 py-1 rounded text-[10px] font-semibold"
                style={{
                  background: duration?.value === opt.value ? G.bgHi : "rgba(255,255,255,0.04)",
                  border: `1px solid ${duration?.value === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                  color: duration?.value === opt.value ? G.text : "rgba(255,255,255,0.50)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {duration?.value === "CUSTOM" && (
            <input
              type="date"
              value={duration.custom_date || ""}
              onChange={(e) => onCustomDateChange(page.path, e.target.value)}
              className="mt-1 w-full px-2 py-1.5 rounded text-xs text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${G.border}`,
              }}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}