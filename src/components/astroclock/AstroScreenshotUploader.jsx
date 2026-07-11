// ═══════════════════════════════════════════════════════════════
// ASTRO SCREENSHOT UPLOADER — ADMIN ONLY
// Multi-page manuscript upload system for the Astrology module.
//
// SUPPORTS:
//   • Single screenshot (backward compatible with original flow)
//   • Multiple screenshots (gallery multi-select)
//   • Single PDF (each page rendered to image, processed individually)
//   • Multiple PDFs
//   • Mixed images + PDFs together
//
// PAGE ORDER PRESERVATION:
//   1. Files are processed in the exact order selected by the user
//      (Array.from(FileList) preserves selection order).
//   2. PDF pages are rendered in order (1, 2, 3, ...).
//   3. Every page is processed STRICTLY SEQUENTIALLY — each page
//      completes the full pipeline before the next page starts.
//      No parallel processing. This guarantees merge order matches
//      the user's selected page order.
//
// PIPELINE (per page, unchanged from existing system):
//   Upload → unifiedIngestKnowledge (OCR + Entity Detection +
//   Routing + Duplicate Detection + Merge + Storage)
//
// The existing unifiedIngestKnowledge backend function is called
// unchanged for every page. No backend modifications.
// ═══════════════════════════════════════════════════════════════
import { useState, useRef } from "react";
import { Upload, Loader2, AlertCircle, Image as ImageIcon, FileText, Layers } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { renderPdfPages } from "@/lib/astroPdfRenderer";
import AstroUploadProgress from "./AstroUploadProgress";
import AstroUploadSummary from "./AstroUploadSummary";

export default function AstroScreenshotUploader() {
  const { txt } = useAstroClockLanguage();
  const [stage, setStage] = useState('idle'); // idle | preparing | processing | complete
  const [pages, setPages] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [error, setError] = useState(null);
  const [sourceLabel, setSourceLabel] = useState("");
  const [summary, setSummary] = useState(null);
  const [pdfProgress, setPdfProgress] = useState(null);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const fileInputRef = useRef(null);

  // ── Main handler: user selects one or more files ──
  // FileList preserves user selection order — Array.from keeps that order.
  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setError(null);
    setSummary(null);
    setSelectedFileNames(selectedFiles.map(f => f.name));
    setStage('preparing');
    setPages([]);

    try {
      // ══ PHASE 1: PREPARE ══
      // Build a flat, ordered page list from all selected files.
      // Files are iterated in user-selection order.
      // PDF pages are rendered in page-number order (1, 2, 3, ...).
      const pageList = [];
      let pageId = 0;

      for (const file of selectedFiles) {
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const sourceName = sourceLabel || file.name;

        if (isPdf) {
          setPdfProgress({ fileName: file.name, current: 0, total: 0 });
          // renderPdfPages renders pages IN ORDER (1→2→3→...) and returns
          // an array of { page_number, blob } in that same order.
          const renderedPages = await renderPdfPages(file, (pageNum, total) => {
            setPdfProgress({ fileName: file.name, current: pageNum, total });
          });
          setPdfProgress(null);

          for (const rp of renderedPages) {
            pageList.push({
              id: `page-${pageId++}`,
              source_name: sourceName,
              file_name: file.name,
              page_number: rp.page_number,
              isPdf: true,
              blob: rp.blob,
              file: null,
              status: 'pending',
              result: null,
            });
          }
        } else {
          // Image file — one page per image, preserves selection order
          pageList.push({
            id: `page-${pageId++}`,
            source_name: sourceName,
            file_name: file.name,
            page_number: 1,
            isPdf: false,
            blob: null,
            file: file,
            status: 'pending',
            result: null,
          });
        }
      }

      if (pageList.length === 0) {
        setError(txt("ഒരു പേജും കണ്ടെത്താനായില്ല", "No pages found", "لم يتم العثور على صفحات"));
        setStage('idle');
        return;
      }

      // ══ PHASE 2: PROCESS ══
      // Process every page STRICTLY SEQUENTIALLY through the existing
      // unifiedIngestKnowledge pipeline. Each page completes before the
      // next begins — no parallel processing, preserving merge order.
      setPages(pageList);
      setStage('processing');

      const startTime = Date.now();
      let processed = 0, rejected = 0, duplicates = 0, errors = 0;
      let newKnowledge = 0;
      const entityKeysCreated = new Set();
      const entityKeysUpdated = new Set();

      for (let i = 0; i < pageList.length; i++) {
        setCurrentIdx(i);
        setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'uploading' } : p));

        try {
          const page = pageList[i];

          // Build upload object: File for images, File-from-blob for PDF pages
          const fileObj = page.blob
            ? new File([page.blob], `${page.file_name}-p${page.page_number}.png`, { type: 'image/png' })
            : page.file;

          if (!fileObj) {
            errors++;
            setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
            continue;
          }

          // Step 1: Upload the page image to Base44 storage
          const uploadRes = await base44.integrations.Core.UploadFile({ file: fileObj });
          const fileUrl = uploadRes.data?.file_url || uploadRes.file_url;

          if (!fileUrl) {
            errors++;
            setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
            continue;
          }

          // Step 2: Send through the EXISTING unifiedIngestKnowledge pipeline
          // (OCR + Entity Detection + Routing + Dedup + Merge + Storage)
          setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'analyzing' } : p));

          const response = await base44.functions.invoke('unifiedIngestKnowledge', {
            file_url: fileUrl,
            source_label: page.source_name,
            source_type: page.isPdf ? 'pdf_page' : 'screenshot',
          });

          const data = response.data || response;

          if (data.error) {
            errors++;
            setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error', result: data } : p));
            continue;
          }

          // Categorize the page result
          const created = data.records_created || 0;
          const merged = data.records_merged || 0;
          const entriesFound = data.entries_found || 0;

          let pageStatus = 'done';
          if (entriesFound === 0) {
            pageStatus = 'rejected';
            rejected++;
          } else if (created === 0 && merged === 0) {
            pageStatus = 'duplicate';
            duplicates++;
          } else {
            processed++;
            newKnowledge += created;
            // Track unique entities created/updated
            if (Array.isArray(data.details)) {
              data.details.forEach(d => {
                const key = `${d.entity_type}/${d.entity_key}`;
                if (d.action === 'created') entityKeysCreated.add(key);
                if (d.action && String(d.action).includes('merged')) entityKeysUpdated.add(key);
              });
            }
          }

          setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: pageStatus, result: data } : p));
        } catch (err) {
          errors++;
          setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        }
      }

      // ══ PHASE 3: SUMMARY ══
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      setSummary({
        total_pages: pageList.length,
        processed,
        rejected,
        duplicates,
        new_entities: entityKeysCreated.size,
        updated_entities: entityKeysUpdated.size,
        new_knowledge: newKnowledge,
        errors,
        elapsed_seconds: elapsedSeconds,
      });
      setStage('complete');
    } catch (err) {
      setError(err?.message || txt("പിശക് സംഭവിച്ചു", "An error occurred", "حدث خطأ"));
      setStage('idle');
    } finally {
      setPdfProgress(null);
      setCurrentIdx(-1);
    }
  };

  const reset = () => {
    setStage('idle');
    setPages([]);
    setSummary(null);
    setError(null);
    setSourceLabel("");
    setSelectedFileNames([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isProcessing = stage === 'preparing' || stage === 'processing';
  const isPreparing = stage === 'preparing';
  const showProgress = stage === 'preparing' || stage === 'processing';
  const showSummary = stage === 'complete' && summary;

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: "rgba(212,175,55,0.04)",
      border: "1px solid rgba(212,175,55,0.20)",
    }}>
      {/* Header */}
      <div className="p-2.5" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#F5D060" }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "rgba(212,175,55,0.65)" }}>
            {txt("കൈപ്പറ്റഺ അപ്ലോഡ്", "Manuscript Upload", "رفع المخطوطة")}
          </span>
          <span className="font-inter text-[7px] px-1.5 py-0.5 rounded uppercase font-bold" style={{
            background: "rgba(248,113,113,0.10)",
            color: "rgba(248,113,113,0.60)",
            border: "1px solid rgba(248,113,113,0.20)",
          }}>
            {txt("അഡ്മിൻ", "Admin", "مشرف")}
          </span>
        </div>
        <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          {txt(
            "ഒന്നിലധികം ചിത്രങ്ങളോ PDF ഉകളോ തിരഞ്ഞെടുക്കുക — ഓരോ പേജും തിരഞ്ഞെടുത്ത ക്രമത്തിൽ AI വഴി വിശകലനം ചെയ്യും",
            "Select multiple images or PDFs — each page processed in selected order by AI",
            "اختر صورًا متعددة أو ملفات PDF — كل صفحة تُعالج بالترتيب المحدد"
          )}
        </p>
      </div>

      {/* Body */}
      <div className="p-2.5 space-y-2">
        {/* Source label input */}
        <input
          type="text"
          value={sourceLabel}
          onChange={(e) => setSourceLabel(e.target.value)}
          placeholder={txt("സ്രോതസ്സ് പേര് (ഓപ്ഷണൽ)", "Source name (optional)", "اسم المصدر (اختياري)")}
          className="w-full px-2.5 py-2 rounded-lg font-inter text-[10px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(212,175,55,0.15)",
            color: "rgba(255,255,255,0.70)",
          }}
          disabled={isProcessing}
        />

        {/* Upload button — multiple selection */}
        <label className="block">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          <div
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className="cursor-pointer rounded-lg p-3 flex items-center justify-center gap-2 transition-opacity"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px dashed rgba(212,175,55,0.30)",
              opacity: isProcessing ? 0.5 : 1,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#F5D060" }} />
                <span className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>
                  {isPreparing
                    ? txt("PDF വായിക്കുന്നു...", "Reading PDF...", "قراءة PDF...")
                    : txt("പ്രോസസ് ചെയ്യുന്നു...", "Processing...", "معالجة...")}
                </span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" style={{ color: "#F5D060" }} />
                <span className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>
                  {txt("ചിത്രങ്ങൾ/PDF തിരഞ്ഞെടുക്കുക", "Select Images or PDFs", "اختر صورًا أو PDF")}
                </span>
                <Layers className="w-3 h-3 ml-1" style={{ color: "rgba(212,175,55,0.40)" }} />
              </>
            )}
          </div>
        </label>

        {/* Selected files preview (during processing) */}
        {selectedFileNames.length > 0 && showProgress && (
          <div className="flex flex-wrap gap-1">
            {selectedFileNames.map((name, i) => (
              <span key={i} className="font-inter text-[8px] px-1.5 py-0.5 rounded" style={{
                background: "rgba(212,175,55,0.06)",
                color: "rgba(212,175,55,0.50)",
                border: "1px solid rgba(212,175,55,0.10)",
              }}>
                {name.toLowerCase().endsWith('.pdf')
                  ? <FileText className="w-2 h-2 inline mr-0.5" />
                  : <ImageIcon className="w-2 h-2 inline mr-0.5" />}
                {name.length > 20 ? name.substring(0, 17) + '...' : name}
              </span>
            ))}
          </div>
        )}

        {/* Progress display (during preparing/processing) */}
        {showProgress && pages.length > 0 && (
          <AstroUploadProgress
            pages={pages}
            currentIdx={currentIdx}
            stage={stage}
            pdfProgress={pdfProgress}
          />
        )}

        {/* Preparing indicator (before page list is built) */}
        {isPreparing && pages.length === 0 && pdfProgress && (
          <div className="flex items-center gap-2 p-2 rounded-lg" style={{
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.12)",
          }}>
            <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: "#F5D060" }} />
            <span className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.60)" }}>
              {txt("PDF വായിക്കുന്നു", "Reading PDF", "قراءة PDF")}: {pdfProgress.fileName}
              {pdfProgress.current > 0 && ` (${pdfProgress.current}/${pdfProgress.total})`}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg p-2 flex items-start gap-2" style={{
            background: "rgba(248,113,113,0.06)",
            border: "1px solid rgba(248,113,113,0.20)",
          }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(248,113,113,0.60)" }} />
            <p className="font-inter text-[10px]" style={{ color: "rgba(248,113,113,0.70)" }}>{error}</p>
          </div>
        )}

        {/* Final summary */}
        {showSummary && (
          <AstroUploadSummary summary={summary} onReset={reset} />
        )}
      </div>
    </div>
  );
}