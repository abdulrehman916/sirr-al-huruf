// ═══════════════════════════════════════════════════════════════
// ASTRO SCREENSHOT UPLOADER — ADMIN ONLY
// Upload manuscript screenshots → AI vision analysis → merge into
// the canonical AstroClockKnowledge database.
//
// MERGE RULES (enforced by backend):
//   • Never overwrite previous knowledge
//   • Never delete existing knowledge
//   • Remove duplicate rules
//   • Preserve every unique recommendation
//   • Preserve every source reference
//   • Knowledge indexed by full context (Day+Saat+Kawkab+Nakshatra)
// ═══════════════════════════════════════════════════════════════
import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";

export default function AstroScreenshotUploader() {
  const { txt } = useAstroClockLanguage();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [sourceLabel, setSourceLabel] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setReport(null);

    // Preview
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // Step 1: Upload the file
      setUploading(true);
      const uploadRes = await base44.integrations.Core.UploadFile({ file });
      const fileUrl = uploadRes.data?.file_url || uploadRes.file_url;
      setUploading(false);

      if (!fileUrl) {
        setError(txt("അപ്ലോഡ് പരാജയപ്പെട്ടു", "Upload failed", "فشل الرفع"));
        return;
      }

      // Step 2: Analyze and merge
      setAnalyzing(true);
      const response = await base44.functions.invoke('unifiedIngestKnowledge', {
        file_url: fileUrl,
        source_label: sourceLabel || 'Screenshot Upload',
        source_type: 'screenshot'
      });
      setAnalyzing(false);

      const data = response.data || response;
      if (data.error) {
        setError(data.error);
      } else {
        setReport(data);
      }
    } catch (err) {
      setUploading(false);
      setAnalyzing(false);
      setError(err?.message || txt("പിശക് സംഭവിച്ചു", "An error occurred", "حدث خطأ"));
    }
  };

  const reset = () => {
    setReport(null);
    setError(null);
    setPreviewUrl(null);
    setSourceLabel("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isProcessing = uploading || analyzing;

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
            {txt("സ്ക്രീൻഷോട്ട് വിശകലനം", "Screenshot Analysis", "تحليل لقطة الشاشة")}
          </span>
          <span className="font-inter text-[7px] px-1.5 py-0.5 rounded uppercase font-bold" style={{
            background: "rgba(248,113,113,0.10)",
            color: "rgba(248,113,113,0.60)",
            border: "1px solid rgba(248,113,113,0.20)"
          }}>
            {txt("അഡ്മിൻ", "Admin", "مشرف")}
          </span>
        </div>
        <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          {txt(
            "ഗ്രന്ഥ സ്ക്രീൻഷോട്ട് അപ്ലോഡ് ചെയ്യുക — AI ദിവസം + സഅാത് + കവ്കബ് പ്രകാരം വിജ്ഞാനം എക്സ്ട്രാക്റ്റ് ചെയ്യും",
            "Upload a manuscript screenshot — AI extracts knowledge by Day+Saat+Kawkab",
            "ارفع لقطة شاشة من المخطوطة — يستخرج الذكاء الاصطناعي المعرفة حسب اليوم+الساعة+الكوكب"
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

        {/* Upload button */}
        <label className="block">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
                  {uploading
                    ? txt("അപ്ലോഡ് ചെയ്യുന്നു...", "Uploading...", "جار الرفع...")
                    : txt("വിശകലനം ചെയ്യുന്നു...", "Analyzing...", "جار التحليل...")}
                </span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" style={{ color: "#F5D060" }} />
                <span className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>
                  {txt("സ്ക്രീൻഷോട്ട് തിരഞ്ഞെടുക്കുക", "Select Screenshot", "اختر لقطة الشاشة")}
                </span>
              </>
            )}
          </div>
        </label>

        {/* Preview */}
        {previewUrl && !report && (
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.15)" }}>
            <img src={previewUrl} alt="preview" className="w-full max-h-32 object-contain" style={{ background: "rgba(0,0,0,0.30)" }} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg p-2 flex items-start gap-2" style={{
            background: "rgba(248,113,113,0.06)",
            border: "1px solid rgba(248,113,113,0.20)"
          }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(248,113,113,0.60)" }} />
            <p className="font-inter text-[10px]" style={{ color: "rgba(248,113,113,0.70)" }}>{error}</p>
          </div>
        )}

        {/* Report */}
        {report && (
          <div className="space-y-1.5">
            <div className="rounded-lg p-2 flex items-start gap-2" style={{
              background: "rgba(74,222,128,0.06)",
              border: "1px solid rgba(74,222,128,0.20)"
            }}>
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(74,222,128,0.60)" }} />
              <div className="flex-1">
                <p className="font-inter text-[10px] font-bold" style={{ color: "rgba(74,222,128,0.70)" }}>
                  {report.message}
                </p>
              </div>
            </div>

            {/* Ingestion details */}
            {report.details && report.details.length > 0 && (
              <div className="space-y-1">
                {report.details.map((detail, i) => (
                  <div key={i} className="rounded-lg p-1.5" style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(212,175,55,0.10)"
                  }}>
                    <p className="font-inter text-[9px] font-bold" style={{ color: "rgba(212,175,55,0.55)" }}>
                      {detail.entity_type} → {detail.entity_key}
                      {detail.weekday !== undefined ? ` · Day ${detail.weekday}` : ''}
                      {detail.saat ? ` · Saat #${detail.saat}` : ''}
                      {detail.kawkab ? ` · ${detail.kawkab}` : ''}
                    </p>
                    <p className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                      {detail.action === 'created'
                        ? txt("പുതിയ രേഖ സൃഷ്ടിച്ചു", "New record created", "سجل جديد")
                        : txt("നിലവിലുള്ള രേഖയിൽ ലയിപ്പിച്ചു", "Merged into existing record", "دمج في سجل موجود")}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={reset}
              className="w-full py-2 rounded-lg font-inter text-[10px] font-bold uppercase tracking-wider transition-opacity"
              style={{
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.25)",
                color: "#F5D060",
              }}
            >
              {txt("മറ്റൊരു സ്ക്രീൻഷോട്ട് അപ്ലോഡ് ചെയ്യുക", "Upload Another Screenshot", "رفع لقطة أخرى")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}