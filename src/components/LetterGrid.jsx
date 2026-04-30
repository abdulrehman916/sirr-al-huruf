import { motion } from "framer-motion";

export default function LetterGrid({ letters }) {
  if (!letters.length) return null;

  return (
    <div className="w-full">
      <h3 className="font-inter text-sm font-medium text-muted-foreground mb-4 tracking-wide uppercase">
        Letter Breakdown
      </h3>
      <div className="flex flex-wrap-reverse gap-2 justify-center direction-rtl" dir="rtl">
        {letters.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.02, duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-card border border-border flex items-center justify-center shadow-sm hover:shadow-md hover:border-accent transition-all duration-200 group cursor-default">
              <span className="font-amiri text-xl sm:text-2xl text-foreground group-hover:text-accent transition-colors">
                {item.original}
              </span>
            </div>
            <span className="font-inter text-xs text-accent font-semibold mt-1.5">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}