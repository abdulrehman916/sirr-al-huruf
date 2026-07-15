// ═══════════════════════════════════════════════════════════════
// SIRR UPLOAD BUTTON — native file picker → SIRR-only ingestion
// ═══════════════════════════════════════════════════════════════
// Uploads the PDF then processes it COMPLETELY in sequential chunks
// (8 pages per chunk) so large manuscripts are fully extracted —
// never stops after the first batch. Writes ONLY to SIRR entities.
// ═══════════════════════════════════════════════════════════════
import { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CHUNK_SIZE = 8; // pages per chunk

export default function SirrUploadButton({ onUploaded, language }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const isMl = language === "ml";

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError(isMl ? "PDF ഫയൽ മാത്രം" : "PDF files only");
      return;
    }
    setBusy(true);
    setError("");
    setProgress(isMl ? "PDF അപ്‌ലോഡ് ചെയ്യുന്നു..." : "Uploading PDF...");
    try {
      // 1. Upload the PDF to storage
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const file_url = upRes?.file_url || upRes?.data?.file_url;
      if (!file_url) throw new Error("Upload failed");

      // 2. Process in sequential chunks until entire PDF is covered
      let pageStart = 1;
      let totalPages = 0;
      let bookId = "";
      let totalEntries = 0;

      // First chunk (also creates the book record)
      setProgress(isMl ? `താളുകൾ ${pageStart}–${pageStart + CHUNK_SIZE - 1} പ്രോസസ്സ് ചെയ്യുന്നു...` : `Processing pages ${pageStart}–${pageStart + CHUNK_SIZE - 1}...`);
      const firstRes = await base44.functions.invoke("ingestSirrManuscript", {
        pdf_file_url: file_url,
        original_file_name: file.name,
        page_start: pageStart,
        page_end: pageStart + CHUNK_SIZE - 1,
      });
      let result = firstRes?.data || firstRes;
      if (result?.error) throw new Error(result.error);
      bookId = result.sirr_book_id;
      totalPages = result.total_pages || 0;
      totalEntries += result.total_entries || 0;

      // Continue processing remaining chunks
      if (totalPages > CHUNK_SIZE) {
        pageStart = pageStart + CHUNK_SIZE;
        while (pageStart <= totalPages) {
          const pageEnd = Math.min(pageStart + CHUNK_SIZE - 1, totalPages);
          setProgress(
            isMl
              ? `താളുകൾ ${pageStart}–${pageEnd} / ${totalPages} പ്രോസസ്സ് ചെയ്യുന്നു...`
              : `Processing pages ${pageStart}–${pageEnd} of ${totalPages}...`
          );
          const chunkRes = await base44.functions.invoke("ingestSirrManuscript", {
            pdf_file_url: file_url,
            original_file_name: file.name,
            existing_book_id: bookId,
            page_start: pageStart,
            page_end: pageEnd,
          });
          result = chunkRes?.data || chunkRes;
          if (result?.error) throw new Error(result.error);
          totalEntries += result.total_entries || 0;
          pageStart = pageEnd + 1;
        }
      }

      setProgress("");
      if (onUploaded) onUploaded();
    } catch (err) {
      setProgress("");
      setError(String(err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 btn-gold"
      >
        {busy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isMl ? "ഇറക്കുമതി ചെയ്യുന്നു..." : "Importing..."}
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            {isMl ? "സിറർ ഗ്രന്ഥം ഇറക്കുമതി ചെയ്യുക" : "Upload SIRR Manuscript PDF"}
          </>
        )}
      </button>
      {busy && progress && (
        <p className="font-inter text-[10px] text-center flex items-center justify-center gap-1"
           style={{ color: "rgba(212,175,55,0.70)" }}>
          <Loader2 className="w-3 h-3 animate-spin" />
          {progress}
        </p>
      )}
      {!busy && !error && progress === "" && (
        <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
          {isMl ? "PDF അപ്‌ലോഡ് ചെയ്താൽ സ്വയമേവ പൂർണ്ണമായി പ്രോസസ്സ് ചെയ്യും" : "Upload starts full automatic extraction"}
        </p>
      )}
      {error && (
        <p className="font-inter text-[10px] text-center" style={{ color: "#F87171" }}>{error}</p>
      )}
    </div>
  );
}