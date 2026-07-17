import { useState, useRef } from "react";
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle, FileText, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

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

const RAW_MIN_CHARS = 200; // below this, fall back to LLM verbatim transcription

export default function HolyNameImportPanel({ onImported }) {
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "owner";
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([]);
  const inputRef = useRef(null);

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border p-5 flex items-center gap-3" style={{ background: P.bg, borderColor: P.border }}>
        <Lock className="w-4 h-4" style={{ color: P.dim }} />
        <p className="font-inter text-[11px]" style={{ color: P.dim }}>
          PDF import is available to administrators only.
        </p>
      </div>
    );
  }

  const addLog = (line) => setLog((l) => [...l, line]);

  const extractRaw = async (file_url) => {
    const pages = [];
    let totalLen = 0;
    try {
      const pdfjsLib = await import("pdfjs-dist");
      try {
        const workerModule = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;
      } catch { /* worker setup optional — getDocument still works */ }
      const task = pdfjsLib.getDocument({ url: file_url });
      const pdf = await task.promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        const text = (tc.items || []).map((it) => it.str || "").join(" ");
        pages.push({ page_number: i, text });
        totalLen += (text || "").length;
      }
    } catch (e) {
      return { pages: [], ok: false };
    }
    return { pages, ok: totalLen >= RAW_MIN_CHARS };
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setLog([]);
    const import_batch = "HNK-" + Date.now();
    for (const file of files) {
      try {
        addLog(`Uploading "${file.name}"…`);
        const up = await base44.integrations.Core.UploadFile({ file });
        const file_url = up?.file_url;
        if (!file_url) { addLog(`✗ Upload failed for "${file.name}"`); continue; }

        addLog(`Extracting text from "${file.name}"…`);
        const { pages, ok } = await extractRaw(file_url);

        let payload = { import_batch, source_pdf_file: file.name, source_pdf_url: file_url };
        if (ok) {
          payload.pages = pages;
          addLog(`Raw text layer found (${pages.length} pages). Matching names…`);
        } else {
          addLog(`No usable text layer. Using verbatim LLM fallback…`);
        }

        const res = await base44.functions.invoke("importHolyNamesPDF", payload);
        const d = res?.data || {};
        addLog(
          `✓ "${file.name}": ${d.names_found || 0} names • ${d.sections_added || 0} sections added • ${d.duplicates_skipped || 0} duplicates skipped (${d.extraction_method || "raw"})`
        );
      } catch (e) {
        addLog(`✗ "${file.name}": ${e?.message || "error"}`);
      }
    }
    setBusy(false);
    if (onImported) onImported();
  };

  const onPick = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    handleFiles(files);
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl border p-4 space-y-3" style={{ background: P.bg, borderColor: P.borderHi, boxShadow: `0 0 18px ${P.glow}` }}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" style={{ color: P.text }} />
          <span className="font-inter text-[11px] font-bold uppercase tracking-widest" style={{ color: P.text }}>
            Import PDF Knowledge
          </span>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border font-inter text-[10px] uppercase tracking-widest font-bold"
          style={{
            background: busy ? P.faint : P.bgHi,
            borderColor: busy ? P.border : P.borderHi,
            color: busy ? P.dim : P.text,
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
          {busy ? "Importing…" : "Import PDF"}
        </button>
        <input ref={inputRef} type="file" accept="application/pdf" multiple onChange={onPick} className="hidden" />
      </div>

      {log.length === 0 ? (
        <p className="font-inter text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Select one or more PDF books. The system extracts the text, finds Holy Names already in the database, and appends only the information printed in the PDF — with the source file and page number recorded on every section. Existing information is never overwritten; duplicate paragraphs are skipped.
        </p>
      ) : (
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {log.map((line, i) => {
            const ok = line.startsWith("✓");
            const bad = line.startsWith("✗");
            return (
              <div key={i} className="flex items-start gap-2 font-inter text-[10px]" style={{ color: ok ? "rgba(134,239,172,0.85)" : bad ? "rgba(248,113,113,0.85)" : "rgba(255,255,255,0.65)" }}>
                {ok ? <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" /> : bad ? <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" /> : <span className="mt-0.5">•</span>}
                <span className="leading-relaxed">{line}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}