// ═══════════════════════════════════════════════════════════════
// SIRR UPLOAD BUTTON — native file picker → SIRR-only ingestion
// ═══════════════════════════════════════════════════════════════
// Opens the device's native file picker (laptop / tablet / mobile).
// The selected PDF is uploaded via Core.UploadFile, then sent to the
// SIRR-only `ingestSirrManuscript` backend function which writes ONLY
// to SirrManuscriptBook / SirrManuscriptEntry. Never touches any
// global manuscript collection.
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
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError(isMl ? "PDF ഫയൽ മാത്രം" : "PDF files only");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // 1. Upload the PDF to storage
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const file_url = upRes?.file_url || upRes?.data?.file_url;
      if (!file_url) throw new Error("Upload failed");

      // 2. SIRR-only ingestion (writes only to SIRR entities)
      const res = await base44.functions.invoke("ingestSirrManuscript", {
        pdf_file_url: file_url,
        original_file_name: file.name,
      });
      const result = res?.data || res;
      if (result?.error) throw new Error(result.error);

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
            {isMl ? "ഇറക്കുമതി ചെയ്യുന്നു..." : "Importing..."}
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            {isMl ? "സിറർ ഗ്രന്ഥം ഇറക്കുമതി ചെയ്യുക" : "Upload SIRR Manuscript PDF"}
          </>
        )}
      </button>
      {error && (
        <p className="font-inter text-[10px] text-center" style={{ color: "#F87171" }}>{error}</p>
      )}
    </div>
  );
}