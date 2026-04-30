import { motion } from "framer-motion";

const ELEMENT_COLORS = {
  fire: { color: "#f97316", label: "Fire" },
  air:  { color: "#7dd3fc", label: "Air" },
  water:{ color: "#60a5fa", label: "Water" },
  earth:{ color: "#4ade80", label: "Earth" },
};

export default function AnasirLetterGrid({ letterDetails }) {
  if (!letterDetails || !letterDetails.length) return null;

  return (
    <div className="w-full">
      <p className="font-inter text-xs text-white/40 uppercase tracking-widest mb-5">
        Letter Breakdown
      </p>
      <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
        {letterDetails.map((item, i) => {
          const el = ELEMENT_COLORS[item.element];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.015, duration: 0.25, ease: "easeOut" }}
              className="flex flex-col items-center group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.12, y: -3 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm transition-colors duration-200"
                style={{ borderColor: `${el.color}30` }}
              >
                <span className="font-amiri text-xl sm:text-2xl text-white group-hover:text-opacity-80 transition-colors">
                  {item.original}
                </span>
              </motion.div>
              <span
                className="font-inter text-[10px] font-semibold mt-1.5"
                style={{ color: el.color }}
              >
                {el.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}