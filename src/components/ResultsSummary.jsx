import { motion } from "framer-motion";
import { Hash, Sigma } from "lucide-react";

export default function ResultsSummary({ count, total }) {
  if (!count) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-2 gap-4 w-full"
    >
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Hash className="w-5 h-5 text-primary" />
        </div>
        <span className="font-inter text-xs text-muted-foreground uppercase tracking-wide">
          Letters
        </span>
        <span className="font-amiri text-3xl font-bold text-foreground">
          {count}
        </span>
      </div>
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <Sigma className="w-5 h-5 text-accent" />
        </div>
        <span className="font-inter text-xs text-muted-foreground uppercase tracking-wide">
          Abjad Value
        </span>
        <span className="font-amiri text-3xl font-bold text-accent">
          {total.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}