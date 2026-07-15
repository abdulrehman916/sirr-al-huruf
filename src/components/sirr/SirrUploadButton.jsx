// ═══════════════════════════════════════════════════════════════
// SIRR UPLOAD BUTTON — non-blocking background ingestion
// ═══════════════════════════════════════════════════════════════
// Uploads the PDF to permanent SIRR storage, creates a pending book
// record, and fires the background processor ONCE. The UI returns
// immediately — the user can upload the next PDF while previous
// PDFs continue processing automatically in the background.
//
// The background engine (sirrProcessNextChunk + scheduled automation)
// handles all page-by-page OCR, auto-resume, and completion.
// ═══════════════════════════════════════════════════════════════
import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SirrUploadButton({ onUploaded, language }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
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
    try {
      // 1. Upload PDF to permanent SIRR storage.
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const file_url = upRes?.file_url || upRes?.data?.file_url;
      if (!file_url) throw new Error("Upload failed");

      // 2. Create a pending book record — background engine takes over from here.
      const stamp = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      const sirr_book_id = `SIRRB-${stamp}-${rand}`;
      await base44.entities.SirrManuscriptBook.create({
        sirr_book_id,
        book_title: file.name,
        original_file_url: file_url,
        original_file_name: file.name,
        source: "sirr_upload",
        upload_date: new Date().toISOString(),
        extraction_status: "pending",
        total_pages: 0,
        total_entries: 0,
        last_processed_page: 0,
      });

      // 3. Fire the background processor (fire-and-forget — non-blocking).
      base44.functions.invoke("sirrProcessNextChunk", {}).catch(() => {});

      // 4. Refresh the library immediately so the new cards appear as processed.
      if (onUploaded) onUploaded();
    } catch (err) {
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
            {isMl ? "അപ്‌ലോഡ് ചെയ്യുന്നു..." : "Uploading..."}
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            {isMl ? "സിറർ ഗ്രന്ഥം ഇറക്കുമതി ചെയ്യുക" : "Upload SIRR Manuscript PDF"}
          </>
        )}
      </button>
      {!busy && !error && (
        <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
          {isMl
            ? "പശ്ചാത്തലത്തിൽ സ്വയമേവ പ്രോസസ്സ് ചെയ്യും — അടുത്ത PDF ഉടൻ അപ്‌ലോഡ് ചെയ്യാം"
            : "Processes automatically in background — upload next PDF immediately"}
        </p>
      )}
      {error && (
        <p className="font-inter text-[10px] text-center" style={{ color: "#F87171" }}>{error}</p>
      )}
    </div>
  );
}