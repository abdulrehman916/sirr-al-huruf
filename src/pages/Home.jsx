import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { processText } from "../lib/abjadValues";
import LetterGrid from "../components/LetterGrid";
import ResultsSummary from "../components/ResultsSummary";
import AbjadReferenceTable from "../components/AbjadReferenceTable";
import { Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState("");

  const result = useMemo(() => processText(input), [input]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-12 pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            سرّ الحروف
          </h1>
          <p className="font-inter text-sm text-muted-foreground mt-2 tracking-wide">
            Abjad Numerology Calculator
          </p>
          <div className="w-16 h-0.5 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <Textarea
            dir="rtl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب هنا... أدخل أي نص عربي"
            className="font-amiri text-xl leading-relaxed min-h-[120px] resize-none bg-card border-border shadow-sm focus:border-accent focus:ring-accent/30 transition-all rounded-xl p-4 placeholder:text-muted-foreground/50"
          />
          {input && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInput("")}
              className="absolute top-3 left-3 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          )}
        </motion.div>

        {/* Results Summary */}
        <ResultsSummary count={result.count} total={result.total} />

        {/* Letter Grid */}
        <LetterGrid letters={result.letters} />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="font-amiri text-lg text-muted-foreground/40">✦</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Reference Table */}
        <AbjadReferenceTable />
      </main>
    </div>
  );
}