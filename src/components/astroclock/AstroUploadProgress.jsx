// ═══════════════════════════════════════════════════════════════
// ASTRO UPLOAD PROGRESS — Per-page progress display during
// multi-page manuscript ingestion. Shows overall progress bar,
// current stage label, and per-page status list in selection order.
// ═══════════════════════════════════════════════════════════════
import { Loader2, CheckCircle2, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";

export default function AstroUploadProgress({ pages, currentIdx, stage, pdfProgress }) {
  const { txt } = useAstroClockLanguage();

  const completed = pages.filter(p =>
    p.status === 'done' || p.status === 'rejected' || p.status === 'duplicate' || p.status === 'error'
  ).length;
  const total = pages.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Build current stage label
  let stageText = '';
  if (stage === 'preparing' && pdfProgress) {
    stageText = `${txt("PDF വായിക്കുന്നു", "Reading PDF", "قراءة PDF")}: ${pdfProgress.fileName}`;
    if (pdfProgress.current > 0) stageText += ` (${pdfProgress.current}/${pdfProgress.total})`;
  } else if (stage === 'processing' && currentIdx >= 0 && pages[currentIdx]) {
    const p = pages[currentIdx];
    const stageLabel = p.status === 'uploading'
      ? txt("അപ്ലോഡ് ചെയ്യുന്നു", "Uploading", "رفع")
      : txt("OCR + എന്റിറ്റി കണ്ടെത്തൽ", "OCR + Entity Detection", "OCR + كشف");
    stageText = `${stageLabel} — ${p.source_name} ${txt("പേജ്", "p", "ص")}${p.page_number} (${currentIdx + 1}/${total})`;
  }

  return (
    <div className="space-y-2">
      {/* Stage label + percentage */}
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: "#F5D060" }} />
        <span className="font-inter text-[10px] font-bold truncate flex-1" style={{ color: "#F5D060" }}>{stageText}</span>
        <span className="font-inter text-[9px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.40)" }}>{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(212,175,55,0.10)" }}>
        <div className="h-full transition-all duration-300" style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #D4AF37, #F5D060)",
        }} />
      </div>

      {/* Per-page status list (in selection order) */}
      <div className="space-y-0.5 max-h-32 overflow-y-auto scrollbar-none">
        {pages.map((p, i) => (
          <div key={p.id} className="flex items-center gap-1.5 py-0.5">
            {p.status === 'done' ? (
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(74,222,128,0.60)" }} />
            ) : p.status === 'rejected' ? (
              <AlertCircle className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(248,113,113,0.50)" }} />
            ) : p.status === 'duplicate' ? (
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(212,175,55,0.50)" }} />
            ) : p.status === 'error' ? (
              <AlertCircle className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(248,113,113,0.60)" }} />
            ) : i === currentIdx && stage === 'processing' ? (
              <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" style={{ color: "#F5D060" }} />
            ) : (
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ border: "1px solid rgba(212,175,55,0.20)" }} />
            )}
            {p.isPdf ? (
              <FileText className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.40)" }} />
            ) : (
              <ImageIcon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.40)" }} />
            )}
            <span className="font-inter text-[9px] truncate" style={{
              color: p.status === 'pending' ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.55)",
            }}>
              {p.source_name} · {txt("പേജ്", "p", "ص")} {p.page_number}
              {p.status === 'done' && p.result && ` · ${p.result.records_created || 0}${txt("പുതിയത്", "N", "ج")} ${p.result.records_merged || 0}${txt("ലയിച്ചത്", "M", "م")}`}
              {p.status === 'rejected' && ` · ${txt("നിരസിച്ചു", "rejected", "مرفوض")}`}
              {p.status === 'duplicate' && ` · ${txt("തനിപ്പകർപ്പ്", "duplicate", "مكرر")}`}
              {p.status === 'error' && ` · ${txt("പിശക്", "error", "خطأ")}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}