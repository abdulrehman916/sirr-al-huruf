import { useState } from "react";
import { useVefkSession } from "../context/VefkSessionContext";
import { exportGridAsPNG, exportGridAsPDF } from "../lib/vefkExport";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

export function VefkActionButtons({ gridId, mode, hasResult }) {
  const { session, clearSession } = useVefkSession();
  const [exporting, setExporting] = useState(false);

  const handleDownloadPNG = async () => {
    setExporting(true);
    await exportGridAsPNG(gridId, mode);
    setExporting(false);
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    const title = mode === "ana" ? "Ana Vefk — الوفق الأصلي" : "Tanzim Vefki — تنظيم الوفق";
    await exportGridAsPDF(gridId, mode, title);
    setExporting(false);
  };

  if (!hasResult) return null;

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-4">
      <button
        onClick={handleDownloadPNG}
        disabled={exporting}
        className="rounded-lg px-4 py-2 font-inter font-semibold text-xs uppercase tracking-widest border transition-all disabled:opacity-50"
        style={{
          background: "rgba(212,175,55,0.08)",
          borderColor: G.borderHi,
          color: G.text,
          boxShadow: `0 0 12px ${G.glow}`,
        }}
      >
        📥 PNG
      </button>
      <button
        onClick={handleDownloadPDF}
        disabled={exporting}
        className="rounded-lg px-4 py-2 font-inter font-semibold text-xs uppercase tracking-widest border transition-all disabled:opacity-50"
        style={{
          background: "rgba(212,175,55,0.08)",
          borderColor: G.borderHi,
          color: G.text,
          boxShadow: `0 0 12px ${G.glow}`,
        }}
      >
        📕 PDF
      </button>
    </div>
  );
}

export function VefkSessionIndicator() {
  const { session, clearSession } = useVefkSession();
  const hasData = session.anaData || session.tanzimData;

  if (!hasData) return null;

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs"
      style={{ background: "rgba(212,175,55,0.05)", border: `1px solid ${G.dim}` }}>
      <span style={{ color: G.dim }}>
        ✓ Session saved locally
      </span>
      <button
        onClick={clearSession}
        className="font-inter text-[10px] uppercase tracking-wider px-2 py-1 rounded border transition-all"
        style={{
          background: "rgba(212,175,55,0.08)",
          borderColor: "rgba(212,175,55,0.30)",
          color: "rgba(255,100,100,0.80)",
        }}
      >
        Clear
      </button>
    </div>
  );
}