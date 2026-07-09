// ═══════════════════════════════════════════════════════════════
// SIRR METHOD DETAIL — FULL FIELD DISPLAY
// ═══════════════════════════════════════════════════════════════
// Displays EVERY field found in the manuscript.
// Does not invent any information.
// Shows "Not specified in the manuscript" for missing fields.
// Uses VerifiedArabicDisplay for verified Arabic with harakat.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { ChevronLeft, BookOpen, ZoomIn, X, FileText } from "lucide-react";
import VerifiedArabicDisplay from "./VerifiedArabicDisplay";

const NOT_SPECIFIED_ML = "ഗ്രന്ഥത്തിൽ വ്യക്തമാക്കാത്തത്";
const NOT_SPECIFIED_EN = "Not specified in the manuscript";

function FieldRow({ icon: Icon, label, value, accent, language, isArabic }) {
  const isMl = language === "ml";
  const notSpecified = isMl ? NOT_SPECIFIED_ML : NOT_SPECIFIED_EN;
  const hasValue = value && String(value).trim().length > 0;

  return (
    <div className="flex gap-2.5 py-2" style={{ borderBottom: `1px solid ${accent}10` }}>
      <div className="flex-shrink-0 w-7 flex justify-center pt-0.5">
        {Icon && <Icon className="w-4 h-4" style={{ color: `${accent}99` }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide" style={{ color: `${accent}99` }}>
          {label}
        </p>
        <p
          className={`text-sm mt-1 ${isArabic ? "font-amiri" : isMl ? "font-malayalam" : "font-inter"}`}
          style={{
            color: hasValue ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.25)",
            direction: isArabic ? "rtl" : "ltr",
            lineHeight: isArabic ? 2.2 : 1.6,
          }}
        >
          {hasValue ? value : notSpecified}
        </p>
      </div>
    </div>
  );
}

function ImageViewer({ images, accent }) {
  const [fullscreen, setFullscreen] = useState(null);
  const [zoom, setZoom] = useState(1);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {images.map((url, idx) => (
          <button key={idx} onClick={() => { setFullscreen(url); setZoom(1); }}
            className="relative rounded-lg overflow-hidden" style={{ border: `1px solid ${accent}33` }}>
            <img src={url} alt={`Figure ${idx + 1}`} className="w-full h-32 object-contain" style={{ background: "rgba(0,0,0,0.3)" }} />
            <div className="absolute bottom-1 right-1 rounded p-1" style={{ background: "rgba(0,0,0,0.6)" }}>
              <ZoomIn className="w-3 h-3" style={{ color: accent }} />
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen viewer */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={() => setFullscreen(null)}>
          <button className="absolute top-4 right-4 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }}
            onClick={(e) => { e.stopPropagation(); setFullscreen(null); }}>
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="px-3 py-1.5 rounded-lg font-bold text-white" style={{ background: "rgba(255,255,255,0.10)" }}>
              −
            </button>
            <span className="px-3 py-1.5 font-inter text-sm text-white" style={{ background: "rgba(255,255,255,0.10)" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
              className="px-3 py-1.5 rounded-lg font-bold text-white" style={{ background: "rgba(255,255,255,0.10)" }}>
              +
            </button>
          </div>
          <img src={fullscreen} alt="Full view" className="max-w-full max-h-[80vh] object-contain transition-transform"
            style={{ transform: `scale(${zoom})` }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

export default function SirrMethodDetail({ method, accent, language, onBack, backLabel }) {
  const isMl = language === "ml";
  const notSpecified = isMl ? NOT_SPECIFIED_ML : NOT_SPECIFIED_EN;
  const images = method.images || [];

  return (
    <div className="space-y-3">
      {/* Back button */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onBack}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <ChevronLeft className="w-4 h-4" /> {backLabel || (isMl ? "രീതികൾ" : "Methods")}
        </button>
      </div>

      {/* Book & Page header */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
        <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
        <span className="font-amiri text-sm flex-shrink-0" style={{ color: accent, direction: "rtl" }}>
          {method.book_name_ar}
        </span>
        <span className="font-inter text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.40)" }}>
          {method.book_name}
        </span>
        <span className="flex-1"></span>
        <span className="font-inter text-[10px] flex items-center gap-1" style={{ color: accent }}>
          <FileText className="w-3 h-3" /> {isMl ? "പേജ്" : "p."} {method.page_number || notSpecified}
        </span>
      </div>

      {/* Purpose */}
      <div className="rounded-xl p-4" style={{ background: `${accent}08`, border: `1px solid ${accent}22` }}>
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide" style={{ color: `${accent}99` }}>
          {isMl ? "ഉദ്ദേശ്യം" : "Purpose"}
        </p>
        <p className={`text-sm mt-1 ${isMl ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.85)" }}>
          {isMl ? (method.purpose_ml || notSpecified) : (method.purpose_en || notSpecified)}
        </p>
      </div>

      {/* Original Arabic (verbatim from manuscript) */}
      {method.arabic_text && (
        <div className="rounded-xl p-4" style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${accent}30` }}>
          <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-center" style={{ color: `${accent}99` }}>
            {isMl ? "മൂല അറബി പാഠം" : "Original Arabic (Manuscript)"}
          </p>
          <p className="font-amiri text-xl text-center mt-2 selectable" style={{
            color: accent, direction: "rtl", lineHeight: 2.4, letterSpacing: "0.04em",
          }}>
            {method.arabic_text}
          </p>
        </div>
      )}

      {/* Verified Arabic with Harakat (ONLY if verified) */}
      {method.arabic_text && (
        <div>
          <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-center mb-1" style={{ color: `${accent}99` }}>
            {isMl ? "സ്ഥിരീകരിച്ച അറബി (ഹരകത്തോടെ)" : "Verified Arabic with Harakat"}
          </p>
          <VerifiedArabicDisplay
            arabicText={method.arabic_text}
            sourceType={method.type === "ism" ? "divine_name" : method.type === "quran_recitation" ? "quran" : "manuscript_quotation"}
            bookName={method.book_name}
            pageNumber={method.page_number}
            language={language}
            size="lg"
            accent={accent}
          />
        </div>
      )}

      {/* Images (Wafq, Taweez, Seals, Diagrams) */}
      {images.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: `${accent}08`, border: `1px solid ${accent}22` }}>
          <p className="font-inter text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: `${accent}99` }}>
            {isMl ? "ചിത്രങ്ങൾ / വഫ്പ് / താവീസ്" : "Images / Wafq / Taweez"}
          </p>
          <ImageViewer images={images} accent={accent} />
        </div>
      )}

      {/* All remaining fields */}
      <div className="rounded-xl p-4" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${accent}15` }}>
        <FieldRow label={isMl ? "ആമുഖം" : "Introduction"} value={method.introduction} accent={accent} language={language} />
        <FieldRow label={isMl ? "മലയാളം അർത്ഥം" : "Malayalam Meaning"} value={method.purpose_ml} accent={accent} language={language} />
        <FieldRow label={isMl ? "English Meaning" : "English Meaning"} value={method.purpose_en} accent={accent} language={language} />
        <FieldRow label={isMl ? "വസ്തുക്കൾ" : "Materials"} value={method.materials} accent={accent} language={language} />
        <FieldRow label={isMl ? "ഔഷധങ്ങൾ" : "Herbs / Medicines"} value={method.ingredients ? (Array.isArray(method.ingredients) ? method.ingredients.join(", ") : method.ingredients) : undefined} accent={accent} language={language} />
        <FieldRow label={isMl ? "ധൂപം" : "Incense"} value={method.incense} accent={accent} language={language} />
        <FieldRow label={isMl ? "തയ്യാറാക്കൽ" : "Preparation"} value={method.preparation} accent={accent} language={language} />
        <FieldRow label={isMl ? "നടപടിക്രമം" : "Procedure"} value={method.usage || method.procedure} accent={accent} language={language} />
        <FieldRow label={isMl ? "ആവർത്തന എണ്ണം" : "Repetition Count"} value={method.repetition} accent={accent} language={language} />
        <FieldRow label={isMl ? "ഉചിത ദിവസം" : "Suitable Day"} value={method.timing || method.suitable_day} accent={accent} language={language} />
        <FieldRow label={isMl ? "ഉചിത സഅാത്ത്" : "Suitable Saat"} value={method.best_saat || method.suitable_saat} accent={accent} language={language} />
        <FieldRow label={isMl ? "ഗ്രഹം" : "Planet"} value={method.planet} accent={accent} language={language} />
        <FieldRow label={isMl ? "ചന്ദ്രൻ" : "Moon"} value={method.moon} accent={accent} language={language} />
        <FieldRow label={isMl ? "മലക്ക്" : "Angel"} value={method.angel || method.king_en} accent={accent} language={language} />
        <FieldRow label={isMl ? "ജിന്ന്" : "Jinn"} value={method.jinn} accent={accent} language={language} />
        <FieldRow label={isMl ? "മുന്നറിയിപ്പുകൾ" : "Warnings"} value={method.warnings || method.warning || method.forbidden} accent={accent} language={language} />
        <FieldRow label={isMl ? "കുറിപ്പുകൾ" : "Notes"} value={method.notes || method.readings} accent={accent} language={language} />
        <FieldRow label={isMl ? "ഗുണങ്ങൾ" : "Benefits"} value={method.benefits || method.suitable} accent={accent} language={language} />
        <FieldRow label={isMl ? "ഉറവിട പണ്ഡിതൻ" : "Source Scholar"} value={method.source_scholar} accent={accent} language={language} />

        {/* Mansion-specific fields */}
        {method.nature && (
          <FieldRow label={isMl ? "സ്വഭാവം" : "Nature"} value={method.nature} accent={accent} language={language} />
        )}
        {method.marriage_rule && (
          <FieldRow label={isMl ? "വിവാഹ നിയമം" : "Marriage Rule"} value={method.marriage_rule} accent={accent} language={language} />
        )}
        {method.travel_rule && (
          <FieldRow label={isMl ? "യാത്രാ നിയമം" : "Travel Rule"} value={method.travel_rule} accent={accent} language={language} />
        )}
        {method.clothing_rule && (
          <FieldRow label={isMl ? "വസ്ത്ര നിയമം" : "Clothing Rule"} value={method.clothing_rule} accent={accent} language={language} />
        )}
        {method.farming_rule && (
          <FieldRow label={isMl ? "കൃഷി നിയമം" : "Farming Rule"} value={method.farming_rule} accent={accent} language={language} />
        )}
      </div>

      {/* PDF Reference */}
      <div className="text-center py-3">
        <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          {isMl ? "ഗ്രന്ഥം" : "Book"}: {method.book_name} · {isMl ? "പേജ്" : "Page"}: {method.page_number || notSpecified}
        </p>
        <p className="font-inter text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>
          ⚖️ {isMl ? "മൂല ഗ്രന്ഥം പ്രാഥമിക അധികാരം. വിവരങ്ങൾ കണ്ടുപിടിക്കുന്നില്ല." : "Manuscript is primary authority. No information invented."}
        </p>
      </div>
    </div>
  );
}