// ═══════════════════════════════════════════════════════════════
// SIRR PAGE — CLEAN, ISOLATED, MANUSCRIPT-DRIVEN READER
// ═══════════════════════════════════════════════════════════════
// Production-ready container. Reads ONLY from the SIRR-dedicated
// entities (SirrManuscriptBook / SirrManuscriptEntry). It does NOT
// connect to the global ManuscriptBook / ManuscriptEntry collections
// used by Astro Clock, Reference Library, or Import History.
//
// The page starts COMPLETELY EMPTY. No placeholder books, no old
// imports, and no cross-module manuscripts are shown. A book appears
// here ONLY after a PDF is uploaded specifically for the SIRR module.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import SirrManuscriptReader from "@/components/sirr/SirrManuscriptReader";

export default function SirrPage() {
  const [language, setLanguage] = useState("ml");

  return (
    <PageLayout>
      <SirrManuscriptReader language={language} setLanguage={setLanguage} />
    </PageLayout>
  );
}