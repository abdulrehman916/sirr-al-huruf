// ═══════════════════════════════════════════════════════════════
// SectionCVisualIntegrator — Visual Content Integration Tool
//
// This tool lets the Owner integrate visual content (magic squares,
// wafq, tables, symbols, seals, diagrams) from source PDFs into
// the Section C Birhatīya cards.
//
// WORKFLOW:
//   1. Owner uploads a source PDF (or provides a URL)
//   2. The backend scanSectionCVisuals function identifies pages
//      with visual content using vision LLM
//   3. This component renders each identified page as an image
//      using browser-side pdfjs-dist
//   4. Uploads each rendered page image via UploadFile
//   5. Calls attachSectionCVisual to attach the image URL to the
//      matching Birhatīya card
//   6. Shows progress and a final report
//
// RULES:
//   - Append-only — never overwrites existing visuals
//   - Displays visuals exactly as they appear in the source
//   - Multiple versions from different books preserved separately
// ═══════════════════════════════════════════════════════════════
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Scan, Image as ImageIcon, Loader2, CheckCircle2,
  AlertCircle, FileText, ChevronDown, X, Eye, Sparkles,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const P = {
  border: "rgba(212,175,55,0.30)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(245,208,96,0.55)",
  faint: "rgba(212,175,55,0.14)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const VISUAL_TYPE_LABELS = {
  magic_square: "Magic Square",
  wafq: "Wafq",
  table: "Table",
  symbol: "Symbol",
  seal: "Seal",
  diagram: "Diagram",
  figure: "Figure",
  grid: "Grid",
  handwritten_chart: "Handwritten Chart",
  other: "Other",
};

const VISUAL_TYPE_COLORS = {
  magic_square: "rgba(74,222,128,0.65)",
  wafq: "rgba(129,140,248,0.65)",
  table: "rgba(251,191,36,0.65)",
  symbol: "rgba(168,85,247,0.65)",
  seal: "rgba(14,165,233,0.65)",
  diagram: "rgba(236,72,153,0.65)",
  figure: "rgba(239,68,68,0.65)",
  grid: "rgba(34,197,94,0.65)",
  handwritten_chart: "rgba(245,208,96,0.65)",
  other: "rgba(148,163,184,0.65)",
};

// ── Lazy load pdfjs-dist (same pattern as astroPdfRenderer) ──
let _pdfjsLibPromise = null;
async function loadPdfjs() {
  if (_pdfjsLibPromise) return _pdfjsLibPromise;
  _pdfjsLibPromise = (async () => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.worker.min.mjs";
    return pdfjsLib;
  })();
  return _pdfjsLibPromise;
}

const RENDER_SCALE = 2;

export default function SectionCVisualIntegrator() {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState("idle"); // idle | scanning | rendering | attaching | done
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [scanResults, setScanResults] = useState(null);
  const [attachResults, setAttachResults] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, current_page: 0, description: "" });
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("pdf")) {
      toast({ title: "Please select a PDF file", variant: "destructive" });
      return;
    }
    setPdfFile(file);
    setSourceLabel(file.name.replace(/\.pdf$/i, ""));
    setError("");
    setScanResults(null);
    setAttachResults([]);
  }, [toast]);

  const handleScan = useCallback(async () => {
    if (!pdfFile) {
      toast({ title: "Please select a PDF first", variant: "destructive" });
      return;
    }
    setStep("scanning");
    setError("");
    setScanResults(null);
    setAttachResults([]);

    try {
      // Step 1: Upload the PDF to get a URL for the LLM
      setProgress({ current: 0, total: 1, current_page: 0, description: "Uploading PDF for scanning…" });
      const uploadRes = await base44.integrations.Core.UploadFile({ file: pdfFile });
      const uploadedUrl = uploadRes?.file_url || "";

      // Step 2: Call scanSectionCVisuals to identify pages with visual content
      setProgress({ current: 1, total: 1, current_page: 0, description: "Scanning PDF for visual content…" });
      const scanRes = await base44.functions.invoke("scanSectionCVisuals", {
        pdf_url: uploadedUrl,
        source_label: sourceLabel || pdfFile.name,
      });
      const scanData = scanRes?.data || scanRes;

      if (scanData?.error) throw new Error(scanData.error);
      setScanResults(scanData);

      if (!scanData?.visuals || scanData.visuals.length === 0) {
        setStep("done");
        toast({ title: "No visual content found in this PDF" });
        return;
      }

      // Step 3: Render and attach each identified page
      setStep("rendering");
      const visuals = scanData.visuals;
      setProgress({ current: 0, total: visuals.length, current_page: 0, description: "Rendering pages…" });

      // Load the PDF in pdfjs
      const pdfjsLib = await loadPdfjs();
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const results = [];
      // Group visuals by page to avoid re-rendering the same page
      const byPage = {};
      for (const v of visuals) {
        if (!byPage[v.page_number]) byPage[v.page_number] = [];
        byPage[v.page_number].push(v);
      }
      const pageNumbers = Object.keys(byPage).map(Number).sort((a, b) => a - b);

      let idx = 0;
      for (const pageNum of pageNumbers) {
        const pageVisuals = byPage[pageNum];
        setProgress({
          current: idx,
          total: pageNumbers.length,
          current_page: pageNum,
          description: `Rendering page ${pageNum} (${pageVisuals.length} visual${pageVisuals.length > 1 ? "s" : ""})…`,
        });

        try {
          // Render the page to canvas
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: RENDER_SCALE });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;

          // Convert to blob
          const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, "image/png", 0.92);
          });

          // Clean up canvas
          canvas.width = 0;
          canvas.height = 0;
          page.cleanup();

          if (!blob) throw new Error("Failed to render page");

          // Upload the page image
          const imageFile = new File([blob], `section_c_page_${pageNum}.png`, { type: "image/png" });
          const imgUploadRes = await base44.integrations.Core.UploadFile({ file: imageFile });
          const imageUrl = imgUploadRes?.file_url || "";

          // Attach each visual on this page to the matching card
          for (const v of pageVisuals) {
            try {
              const attachRes = await base44.functions.invoke("attachSectionCVisual", {
                name_id: v.name_id || "",
                visual_url: imageUrl,
                visual_type: v.visual_type,
                source_reference: scanData.source_label || sourceLabel,
                source_page: String(v.page_number),
                description: v.description,
              });
              const attachData = attachRes?.data || attachRes;
              results.push({
                page_number: v.page_number,
                name_id: v.name_id || attachData?.name_id || "",
                visual_type: v.visual_type,
                description: v.description,
                status: attachData?.status || "attached",
                visual_url: imageUrl,
              });
            } catch (e) {
              results.push({
                page_number: v.page_number,
                name_id: v.name_id || "",
                visual_type: v.visual_type,
                description: v.description,
                status: "error",
                error: String(e?.message || e),
              });
            }
          }
        } catch (e) {
          for (const v of pageVisuals) {
            results.push({
              page_number: v.page_number,
              name_id: v.name_id || "",
              visual_type: v.visual_type,
              description: v.description,
              status: "render_error",
              error: String(e?.message || e),
            });
          }
        }
        idx++;
      }

      pdf.destroy();
      setAttachResults(results);
      setStep("done");
      setProgress({ current: pageNumbers.length, total: pageNumbers.length, current_page: 0, description: "Complete" });
      setShowResults(true);

      // Generate the report
      const attached = results.filter((r) => r.status === "attached").length;
      const duplicates = results.filter((r) => r.status === "duplicate").length;
      const errors = results.filter((r) => r.status === "error" || r.status === "render_error").length;
      toast({
        title: "Visual integration complete",
        description: `${attached} visuals attached, ${duplicates} duplicates skipped, ${errors} errors`,
      });
    } catch (e) {
      setError(String(e?.message || e));
      setStep("idle");
      toast({ title: "Integration failed", description: String(e?.message || e), variant: "destructive" });
    }
  }, [pdfFile, sourceLabel, toast]);

  const handleReset = useCallback(() => {
    setStep("idle");
    setPdfFile(null);
    setPdfUrl("");
    setScanResults(null);
    setAttachResults([]);
    setProgress({ current: 0, total: 0, current_page: 0, description: "" });
    setError("");
    setShowResults(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const isProcessing = step === "scanning" || step === "rendering" || step === "attaching";

  // ── Final report ──
  const report = showResults ? {
    total_scanned: scanResults?.total_visuals_found || 0,
    pages_with_visuals: scanResults?.pages_with_visuals || 0,
    total_attached: attachResults.filter((r) => r.status === "attached").length,
    duplicates: attachResults.filter((r) => r.status === "duplicate").length,
    errors: attachResults.filter((r) => r.status === "error" || r.status === "render_error").length,
    by_type: attachResults.reduce((acc, r) => {
      if (r.status === "attached") {
        acc[r.visual_type] = (acc[r.visual_type] || 0) + 1;
      }
      return acc;
    }, {}),
  } : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(8,16,38,0.55)", border: `1px solid ${P.border}` }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${P.faint}` }}>
        <Eye className="w-4 h-4" style={{ color: P.text }} />
        <span className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: P.text }}>
          Visual Content Integrator
        </span>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Step 1: File selection */}
        <div className="space-y-2">
          <p className="font-malayalam text-sm font-semibold" style={{ color: P.dim }}>
            സ്രോതസ്സ് PDF തിരഞ്ഞെടുക്കുക
          </p>
          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
            Upload the source PDF containing magic squares, wafq, tables, symbols, seals, diagrams
          </p>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="hidden"
              id="section-c-pdf-input"
            />
            <label
              htmlFor="section-c-pdf-input"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
              style={{
                background: pdfFile ? P.bgHi : P.bg,
                border: `1px solid ${pdfFile ? P.borderHi : P.border}`,
                color: P.text,
                opacity: isProcessing ? 0.5 : 1,
              }}
            >
              <Upload className="w-4 h-4" />
              <span className="font-inter text-xs font-semibold">
                {pdfFile ? pdfFile.name : "Select PDF File"}
              </span>
            </label>
            {pdfFile && !isProcessing && (
              <button
                onClick={handleReset}
                className="px-2 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${P.faint}` }}
              >
                <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />
              </button>
            )}
          </div>
          {pdfFile && (
            <input
              type="text"
              value={sourceLabel}
              onChange={(e) => setSourceLabel(e.target.value)}
              placeholder="Source label (book title)…"
              disabled={isProcessing}
              className="w-full px-3 py-2 rounded-xl font-inter text-xs outline-none"
              style={{ background: "rgba(8,16,38,0.6)", border: `1px solid ${P.border}`, color: "rgba(255,255,255,0.85)" }}
            />
          )}
        </div>

        {/* Step 2: Scan button */}
        {pdfFile && !isProcessing && step !== "done" && (
          <button
            onClick={handleScan}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.20), rgba(212,175,55,0.08))",
              border: `1px solid ${P.borderHi}`,
              color: P.text,
            }}
          >
            <Scan className="w-4 h-4" />
            <span className="font-inter text-xs font-bold uppercase tracking-widest">
              Scan & Integrate Visuals
            </span>
          </button>
        )}

        {/* Progress indicator */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: P.text }} />
              <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: P.text }}>
                {step === "scanning" ? "Scanning PDF…" : "Rendering & Attaching…"}
              </span>
            </div>
            <p className="font-malayalam text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              {progress.description}
            </p>
            {progress.total > 0 && (
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: P.faint }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                    background: "linear-gradient(90deg, rgba(212,175,55,0.60), rgba(245,208,96,0.80))",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.30)" }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(239,68,68,0.70)" }} />
            <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.70)" }}>{error}</p>
          </div>
        )}

        {/* Results / Report */}
        {step === "done" && report && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              {/* Summary */}
              <div className="rounded-xl p-3 space-y-2" style={{ background: P.bgHi, border: `1px solid ${P.borderHi}` }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: P.text }} />
                  <span className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: P.text }}>
                    Integration Report
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <ReportStat label="Visuals Found" value={report.total_scanned} color={P.text} />
                  <ReportStat label="Pages with Visuals" value={report.pages_with_visuals} color={P.text} />
                  <ReportStat label="Visuals Attached" value={report.total_attached} color="rgba(74,222,128,0.70)" />
                  <ReportStat label="Duplicates Skipped" value={report.duplicates} color="rgba(148,163,184,0.60)" />
                </div>
                {Object.keys(report.by_type).length > 0 && (
                  <div className="pt-2 space-y-1" style={{ borderTop: `1px solid ${P.faint}` }}>
                    <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>Attached by Type</p>
                    {Object.entries(report.by_type).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="font-inter text-[10px]" style={{ color: VISUAL_TYPE_COLORS[type] || "rgba(255,255,255,0.70)" }}>
                          {VISUAL_TYPE_LABELS[type] || type}
                        </span>
                        <span className="font-inter text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
                {report.errors > 0 && (
                  <div className="pt-2" style={{ borderTop: `1px solid ${P.faint}` }}>
                    <p className="font-inter text-[10px]" style={{ color: "rgba(239,68,68,0.70)" }}>
                      ⚠ {report.errors} error(s) — see details below
                    </p>
                  </div>
                )}
              </div>

              {/* Detailed results */}
              <details className="rounded-xl overflow-hidden" style={{ background: "rgba(8,16,38,0.4)", border: `1px solid ${P.faint}` }}>
                <summary className="cursor-pointer flex items-center gap-2 px-3 py-2.5 list-none">
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" style={{ color: P.dim }} />
                  <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: P.dim }}>Detailed Results ({attachResults.length})</span>
                </summary>
                <div className="px-3 pb-3 space-y-1.5 max-h-60 overflow-y-auto">
                  {attachResults.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(8,16,38,0.5)" }}>
                      <span
                        className="font-inter text-[8px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                        style={{ background: `${VISUAL_TYPE_COLORS[r.visual_type] || "rgba(148,163,184,0.30)"}22`, color: VISUAL_TYPE_COLORS[r.visual_type] || "rgba(148,163,184,0.70)" }}
                      >
                        {VISUAL_TYPE_LABELS[r.visual_type] || r.visual_type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                          p.{r.page_number} {r.name_id ? `· ${r.name_id}` : "· general"}
                        </span>
                        <p className="font-inter text-[9px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{r.description}</p>
                      </div>
                      <span className="font-inter text-[8px] flex-shrink-0" style={{ color: r.status === "attached" ? "rgba(74,222,128,0.70)" : r.status === "duplicate" ? "rgba(148,163,184,0.60)" : "rgba(239,68,68,0.70)" }}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </details>

              <button
                onClick={handleReset}
                className="w-full px-4 py-2.5 rounded-xl font-inter text-xs font-semibold"
                style={{ background: P.bg, border: `1px solid ${P.border}`, color: P.dim }}
              >
                Integrate Another PDF
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

function ReportStat({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.40)" }}>{label}</span>
      <span className="font-inter text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  );
}