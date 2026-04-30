import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ABJAD_MAP } from "../lib/abjadValues";
import { motion, AnimatePresence } from "framer-motion";

const orderedLetters = [
  'ا','ب','ج','د','ه','و','ز','ح','ط',
  'ي','ك','ل','م','ن','س','ع',
  'ف','ص','ق','ر','ش','ت',
  'ث','خ','ذ','ض','ظ','غ'
];

export default function AbjadReferenceTable() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors font-inter"
      >
        Abjad Reference
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-7 sm:grid-cols-10 gap-1.5 max-w-md mx-auto" dir="rtl">
              {orderedLetters.map((letter) => (
                <div
                  key={letter}
                  className="flex flex-col items-center bg-card border border-border rounded-md py-2 px-1"
                >
                  <span className="font-amiri text-lg text-foreground">{letter}</span>
                  <span className="font-inter text-[10px] text-accent font-semibold">
                    {ABJAD_MAP[letter]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}