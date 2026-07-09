// ═══════════════════════════════════════════════════════════════
// SIRR SOURCE LIBRARY — ALL IMPORTED MANUSCRIPTS
// ═══════════════════════════════════════════════════════════════
import { ChevronLeft, BookMarked, FileText, Globe } from "lucide-react";

export default function SirrSourceLibrary({ sourceLibrary, onBack, language }) {
  const isMl = language === "ml";

  return (
    <div className="space-y-3">
      {/* Back button */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onBack}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <ChevronLeft className="w-4 h-4" /> {isMl ? "തിരികെ" : "Back"}
        </button>
      </div>

      {/* Title */}
      <div className="text-center pb-2">
        <h2 className="font-amiri text-2xl font-bold" style={{ color: "#D4AF37", direction: "rtl" }}>المكتبة</h2>
        <p className={`text-sm font-bold mt-1 ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "#D4AF37" }}>
          {isMl ? "ഗ്രന്ഥ ശേഖരം" : "Source Library"}
        </p>
        <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          {sourceLibrary.length} {isMl ? "കൈപ്പടികൾ" : "manuscripts"}
        </p>
      </div>

      {/* Manuscript Cards */}
      <div className="space-y-2.5">
        {sourceLibrary.map((ms) => (
          <div key={ms.book_id} className="rounded-xl p-4"
            style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: "1px solid rgba(212,175,55,0.22)" }}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.30)" }}>
                <BookMarked className="w-5 h-5" style={{ color: "#D4AF37" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-amiri text-base" style={{ color: "#D4AF37", direction: "rtl" }}>
                  {ms.book_name_ar}
                </p>
                <p className="font-inter text-sm font-bold" style={{ color: "rgba(255,255,255,0.80)" }}>
                  {ms.book_name}
                </p>
                <p className="font-inter text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {ms.author}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" style={{ color: "rgba(212,175,55,0.60)" }} />
                <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                  {ms.language}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3 h-3" style={{ color: "rgba(212,175,55,0.60)" }} />
                <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                  {isMl ? "പേജുകൾ" : "Pages"}: {ms.pages_ingested}
                </span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mt-2">
              {ms.categories.map((cat, idx) => (
                <span key={idx} className="font-inter text-[9px] px-2 py-0.5 rounded"
                  style={{ background: "rgba(212,175,55,0.08)", color: "rgba(212,175,55,0.70)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  {cat}
                </span>
              ))}
            </div>

            {/* Tradition */}
            <p className="font-inter text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              {ms.tradition} · {ms.pdf_count} {isMl ? "PDF കൾ" : "PDFs"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}