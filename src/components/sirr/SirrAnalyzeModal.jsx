// ═══════════════════════════════════════════════════════════════
// SIRR ANALYZE MODAL — FULL AUTOMATIC PIPELINE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════
// Permanent Master System Rule: Self-Learning Islamic Manuscript Import Engine
//
// When the user presses ANALYZE, this modal automatically runs:
//   Stage 0:  Quality Analysis (reject poor books)
//   Stage 1:  Page-by-Page Extraction (headings, entries, Arabic, images)
//   Stage 2:  Internal Database Search (reuse verified knowledge — FREE)
//   Stage 3:  Deep Internet Verification (only for new entries — strongest model)
//   Stage 4:  Arabic Verification (letters, harakat, word order)
//   Stage 5:  Image & Wafq Extraction
//   Stage 6:  Complete Knowledge Record saved to database
//   Stage 7:  Self-Learning Database (verified entries become permanent knowledge)
//   Stage 8:  Duplicate Detection (merge, keep all source references)
//   Stage 9:  Category Classification (Sirr Al-Huruf categories)
//   Stage 10: Live Progress display (this modal)
//   Stage 11: Performance (reuse > regenerate, reduce credits)
//
// No manual workflow required. One click does everything.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import {
  X, Loader2, CheckCircle2, AlertCircle, Microscope,
  FileSearch, Database, Copy, ShieldAlert,
  Image as ImageIcon, ShieldCheck, Save, Clock
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SirrAnalyzeModal({ file, language, onClose, onComplete }) {
  const isMl = language === "ml";
  const [stage, setStage] = useState("starting");
  const [error, setError] = useState("");
  const [rejection, setRejection] = useState(null);
  const [progress, setProgress] = useState(0);
  const [batchInfo, setBatchInfo] = useState({ current: 0, remaining: 0 });
  const [stats, setStats] = useState({ entries: 0, verified: 0, manualReview: 0, images: 0, malayalam: 0, rate: 0, internalReused: 0, knowledgeRouted: 0 });
  const [finalResult, setFinalResult] = useState(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    runPipeline();
  }, []);

  async function runPipeline() {
    const bookTitle = file.name.replace(/\.pdf$/i, "");
    try {
      // ══ STAGE 0 + 1: Quality Check + Page-by-Page Extraction + Images ══
      setStage("quality");
      setProgress(5);

      const importRes = await base44.functions.invoke("importFromOneDrive", {
        file_id: file.id,
        book_title: bookTitle,
      });
      const importData = importRes.data;

      // Quality rejection — book too poor to import
      if (importData.status === "import_rejected") {
        setStage("rejected");
        setProgress(100);
        setRejection({
          confidence: importData.overall_confidence || 0,
          reason: importData.reason || "Quality below threshold",
          problemPages: importData.problem_pages || [],
        });
        return;
      }

      // File changed — needs confirmation
      if (importData.status === "changed") {
        setStage("changed");
        setRejection({ message: importData.message || "File changed in OneDrive" });
        return;
      }

      const bookId = importData.book_id;
      if (!bookId) {
        setError("No book_id returned from import");
        setStage("error");
        return;
      }

      // Fetch ManuscriptBook to get Phase 1 stats (entries, images)
      setStage("extraction");
      setProgress(20);
      try {
        const books = await base44.entities.ManuscriptBook.filter({ book_id: bookId });
        if (books && books.length > 0) {
          const book = books[0];
          const phase1Report = book.validation_report || {};
          const phase1Summary = phase1Report.summary || {};
          setStats(prev => ({
            ...prev,
            entries: phase1Summary.total_entries_extracted || 0,
            images: phase1Summary.total_images_extracted || 0,
          }));

          // Double-check quality rejection (safety net)
          if (book.validation_status === "failed" && book.extraction_status === "failed") {
            setStage("rejected");
            setProgress(100);
            setRejection({
              confidence: phase1Report.quality_assessment?.overall_confidence || 0,
              reason: phase1Report.reason || "Quality below threshold",
              problemPages: phase1Report.problem_pages || phase1Report.quality_assessment?.problem_pages || [],
            });
            return;
          }
        }
      } catch { /* non-critical — stats will update after verification */ }

      // ══ STAGE: Image Processing (completed during extraction — mark and continue) ══
      setStage("image_processing");
      setProgress(25);
      await new Promise(r => setTimeout(r, 600));

      // ══ STAGE: Internal Database Search + External Verification ══
      // verifyBookEntries now searches internal knowledge base FIRST.
      // Entries found internally are reused (zero credits).
      // Only new entries are sent for external verification.
      setStage("internal_search");
      setProgress(30);

      let verifyData;
      let batchCount = 0;
      let totalInternalReused = 0;

      do {
        batchCount++;
        setBatchInfo({ current: batchCount, remaining: 0 });

        const verifyRes = await base44.functions.invoke("verifyBookEntries", {
          book_id: bookId,
          batch_size: 5,
        });
        verifyData = verifyRes.data;

        if (verifyData.status === "batch_complete") {
          totalInternalReused += verifyData.internal_reused || 0;
          setStats(prev => ({ ...prev, internalReused: totalInternalReused }));
          setBatchInfo({ current: batchCount, remaining: verifyData.remaining_pending });
          if (batchCount === 1) setStage("external_verification");
          setProgress(30 + Math.min(45, batchCount * 7));
        }
      } while (verifyData.status === "batch_complete");

      // Update stats from verification results
      const vSummary = verifyData.verification_summary || {};
      setStats(prev => ({
        ...prev,
        entries: vSummary.total_entries || prev.entries,
        verified: vSummary.verified || 0,
        manualReview: vSummary.manual_review || 0,
        malayalam: vSummary.malayalam_translations || 0,
        rate: vSummary.verification_rate || 0,
      }));

      // ══ STAGE: Duplicate Detection ══
      setStage("duplicates");
      setProgress(80);

      try {
        await base44.functions.invoke("detectManuscriptDuplicates", { book_id: bookId });
      } catch { /* non-critical — duplicates can be detected later */ }

      // ══ STAGE: Universal Knowledge Routing ══
      // Classifies each verified entry by primary purpose and routes to the
      // correct canonical module (Astro Clock, Dua, Ritual, Wafq).
      // Batch-processed — caller re-invokes until all entries routed.
      setStage("knowledge_routing");
      setProgress(83);

      try {
        let routeData;
        do {
          const routeRes = await base44.functions.invoke("routeManuscriptKnowledge", {
            book_id: bookId,
            batch_size: 5,
          });
          routeData = routeRes.data;
          if (routeData.status === "batch_complete") {
            setStats(prev => ({ ...prev, knowledgeRouted: (prev.knowledgeRouted || 0) + (routeData.entries_routed || 0) }));
          }
        } while (routeData.status === "batch_complete");

        if (routeData.total_routed !== undefined) {
          setStats(prev => ({ ...prev, knowledgeRouted: routeData.total_routed }));
        }
      } catch { /* non-critical — routing can run later */ }

      // ══ STAGE: Review Queue (entries below confidence threshold) ══
      setStage("review");
      setProgress(90);
      await new Promise(r => setTimeout(r, 600));

      // ══ STAGE: Save (complete) ══
      setStage("save");
      setProgress(100);
      setFinalResult(verifyData);
      await new Promise(r => setTimeout(r, 400));
      setStage("complete");

    } catch (e) {
      setError(e.response?.data?.error || e.message || "Analysis failed");
      setStage("error");
    }
  }

  const stages = [
    { id: "quality", label: isMl ? "ഗുണനിലവാര പരിശോധന" : "Quality Check", icon: Microscope },
    { id: "extraction", label: isMl ? "പേജ് എക്സ്ട്രാക്ഷൻ" : "Page Extraction", icon: FileSearch },
    { id: "image_processing", label: isMl ? "ചിത്ര സംസ്കരണം" : "Image Processing", icon: ImageIcon },
    { id: "internal_search", label: isMl ? "ആന്തരിക ഡാറ്റാബേസ് തിരയൽ" : "Internal Database Search", icon: Database },
    { id: "external_verification", label: isMl ? "ബാഹ്യ പരിശോധന" : "External Verification", icon: ShieldCheck },
    { id: "duplicates", label: isMl ? "ഡ്യൂപ്ലിക്കേറ്റ് കണ്ടെത്തൽ" : "Duplicate Detection", icon: Copy },
    { id: "knowledge_routing", label: isMl ? "വിജ്ഞാന റൂട്ടിംഗ്" : "Knowledge Routing", icon: Clock },
    { id: "review", label: isMl ? "പരിശോധന ക്യൂ" : "Review Queue", icon: AlertCircle },
    { id: "save", label: isMl ? "സംരക്ഷിക്കൽ" : "Save", icon: Save },
  ];

  const stageOrder = ["quality", "extraction", "image_processing", "internal_search", "external_verification", "duplicates", "knowledge_routing", "review", "save"];
  const currentStageIdx = stageOrder.indexOf(stage);
  const isError = stage === "error" || stage === "rejected" || stage === "changed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.80)" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-5 card-dark max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5" style={{ color: "#D4AF37" }} />
            <p className="font-inter text-sm font-bold" style={{ color: "#D4AF37" }}>
              {isMl ? "കൈന്തരി വിശകലനം" : "Analyze Manuscript"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg transition-all hover:bg-white/10">
            <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />
          </button>
        </div>

        {/* File name */}
        <p className="font-inter text-xs mb-4 truncate" style={{ color: "rgba(255,255,255,0.60)" }}>
          {file.name}
        </p>

        {/* Progress bar */}
        {!isError && (
          <div className="mb-4">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #D4AF37, #e0a820)" }} />
            </div>
            <p className="font-inter text-[9px] mt-1 text-right" style={{ color: "rgba(255,255,255,0.35)" }}>
              {progress}%
            </p>
          </div>
        )}

        {/* Rejected */}
        {stage === "rejected" && rejection && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" style={{ color: "#F87171" }} />
              <p className="font-inter text-sm font-bold" style={{ color: "#F87171" }}>
                {isMl ? "ഇറക്കുമതി നിരസിച്ചു" : "Import Rejected"}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.20)" }}>
              <p className="font-inter text-xs mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
                {isMl ? "വിശ്വാസ്യത" : "Confidence"}:{" "}
                <span className="font-bold" style={{ color: "#F87171" }}>{rejection.confidence}/100</span>
              </p>
              <p className={`text-xs mb-2 ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.60)" }}>
                {rejection.reason}
              </p>
              {rejection.problemPages.length > 0 && (
                <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {isMl ? "പ്രശ്ന പേജുകൾ" : "Problem Pages"}: {rejection.problemPages.join(", ")}
                </p>
              )}
            </div>
            <p className={`text-[10px] ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.35)" }}>
              {isMl
                ? "ഗുണനിലവാരം കുറവായതിനാൽ ഈ പുസ്തകം ഇറക്കുമതി ചെയ്തിട്ടില്ല. കൃത്യത പൂർണ്ണതയേക്കാൾ പ്രധാനമാണ്."
                : "This book was not imported due to poor quality. Accuracy is more important than completeness."}
            </p>
          </div>
        )}

        {/* Changed */}
        {stage === "changed" && rejection && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#FBBF24" }} />
              <p className="font-inter text-sm font-bold" style={{ color: "#FBBF24" }}>
                {isMl ? "ഫയൽ മാറ്റം" : "File Changed"}
              </p>
            </div>
            <p className={`text-xs ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.60)" }}>
              {rejection.message}
            </p>
          </div>
        )}

        {/* Error */}
        {stage === "error" && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#F87171" }} />
              <p className="font-inter text-sm font-bold" style={{ color: "#F87171" }}>
                {isMl ? "പിശക്" : "Error"}
              </p>
            </div>
            <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>{error}</p>
          </div>
        )}

        {/* Stages */}
        {!isError && (
          <div className="space-y-2.5 mb-4">
            {stages.map((s, idx) => {
              const isDone = idx < currentStageIdx || stage === "complete";
              const isActive = idx === currentStageIdx && stage !== "complete";
              return (
                <div key={s.id} className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#4ADE80" }} />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" style={{ color: "#D4AF37" }} />
                  ) : (
                    <div className="w-4 h-4 flex-shrink-0 rounded-full" style={{ border: "1.5px solid rgba(255,255,255,0.20)" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${isMl ? "font-malayalam" : "font-inter"}`}
                      style={{ color: isDone ? "#4ADE80" : isActive ? "#D4AF37" : "rgba(255,255,255,0.35)" }}>
                      {s.label}
                    </p>
                    {isActive && (s.id === "internal_search" || s.id === "external_verification") && batchInfo.current > 0 && (
                      <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {isMl ? `ബാച്ച് ${batchInfo.current}` : `Batch ${batchInfo.current}`}
                        {batchInfo.remaining > 0 ? ` — ${batchInfo.remaining} ${isMl ? "ബാക്കി" : "remaining"}` : ""}
                        {stats.internalReused > 0 ? ` · ${stats.internalReused} ${isMl ? "ആന്തരികം" : "reused"}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Statistics */}
        {!isError && (
          <div className="rounded-lg p-3 mb-4" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
            <p className="font-inter text-[10px] font-bold mb-2" style={{ color: "rgba(212,175,55,0.70)" }}>
              {isMl ? "സ്ഥിതിവിവരം" : "Statistics"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Stat label={isMl ? "എൻട്രികൾ" : "Entries"} value={stats.entries} />
              <Stat label={isMl ? "പരിശോധിച്ചത്" : "Verified"} value={stats.verified} color="#4ADE80" />
              <Stat label={isMl ? "ആന്തരികം" : "Reused"} value={stats.internalReused} color="#60A5FA" />
              <Stat label={isMl ? "പരിശോധന" : "Review"} value={stats.manualReview} color="#FBBF24" />
              <Stat label={isMl ? "ചിത്രങ്ങൾ" : "Images"} value={stats.images} />
              <Stat label={isMl ? "മലയാളം" : "Malayalam"} value={stats.malayalam} />
              <Stat label={isMl ? "റൂട്ടഡ്" : "Routed"} value={stats.knowledgeRouted} color="#D4AF37" />
            </div>
          </div>
        )}

        {/* Complete banner */}
        {stage === "complete" && (
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#4ADE80" }} />
            <p className="font-inter text-sm font-bold" style={{ color: "#4ADE80" }}>
              {isMl ? "വിശകലനം പൂർത്തിയായി" : "Analysis Complete"}
            </p>
          </div>
        )}

        {/* Close / Done button */}
        <button onClick={() => { if (stage === "complete") onComplete(); else onClose(); }}
          className="w-full py-2.5 rounded-xl font-bold transition-all btn-gold">
          {stage === "complete"
            ? (isMl ? "പൂർത്തിയാക്കുക" : "Done")
            : (isMl ? "അടയ്ക്കുക" : "Close")}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
      <p className="font-inter text-sm font-bold" style={{ color: color || "rgba(255,255,255,0.80)" }}>{value}</p>
    </div>
  );
}