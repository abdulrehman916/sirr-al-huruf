// ═══════════════════════════════════════════════════════════════
// SECTION 2 — SMART SEARCH
// User types a purpose → gets purpose-specific Saat recommendations
// Shows ONLY: Best Saat, Alternative Saat, Times to Avoid, Explanation, References
// Does NOT re-render the entire Astro Clock
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { useAstroData, PURPOSE_MAP } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { Search, Clock, CheckCircle2, Ban, BookOpen } from "lucide-react";
import ManuscriptSourcePanel from "./ManuscriptSourcePanel";
import { getKashfOperationsForPurpose } from "@/lib/astroClockManuscriptMerger";
import { planetMLDisplay } from "@/lib/astroClockLabelMap";

const PURPOSE_LABELS = {
  love: { ml: "പ്രണയം", en: "Love", tr: "Aşk" },
  marriage: { ml: "വിവാഹം", en: "Marriage", tr: "Evlilik" },
  business: { ml: "വ്യാപാരം", en: "Business", tr: "Ticaret" },
  travel: { ml: "യാത്ര", en: "Travel", tr: "Seyahat" },
  healing: { ml: "ചികിത്സ", en: "Healing", tr: "Şifa" },
  knowledge: { ml: "ജ്ഞാനം", en: "Knowledge", tr: "İlim" },
  protection: { ml: "സംരക്ഷണം", en: "Protection", tr: "Koruma" },
  wealth: { ml: "ഐശ്വര്യം", en: "Wealth", tr: "Zenginlik" },
  courage: { ml: "ധൈര്യം", en: "Courage", tr: "Cesaret" },
  spiritual: { ml: "ആത്മികം", en: "Spiritual", tr: "Manevi" },
};

export default function SmartSearch() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  const [query, setQuery] = useState("");
  const [matched, setMatched] = useState(null);

  const results = useMemo(() => {
    if (!matched || !d.allHours) return null;
    const config = PURPOSE_MAP[matched];
    if (!config) return null;

    const planetLC = config.planets;
    const bestHours = d.allHours.filter(h => h.status !== "past" && planetLC.includes(h.planet));
    const avoidHours = d.allHours.filter(h => h.status !== "past" && !planetLC.includes(h.planet) && (h.planet === "saturn" || h.planet === "mars"));

    const best = bestHours.slice().sort((a, b) => {
      if (a.status === "current") return -1;
      if (b.status === "current") return 1;
      return 0;
    }).slice(0, 3);

    const alt = bestHours.slice(3, 5);
    const avoid = avoidHours.slice(0, 3);

    const planetNames = config.planets.map(p =>
      language === "ml" ? d.planetInfo[p]?.name_ml_equivalent : d.planetInfo[p]?.name_en
    );

    const explanation = txt(
      `${PURPOSE_LABELS[matched].ml} ${txt("കർമ്മത്തിന്", "work benefits from", "çalışması için")}`,
      `${PURPOSE_LABELS[matched].en} work benefits from ${planetNames.join(", ")} ${txt("സഅാത്", "hours", "saatleri")}.`,
      `${PURPOSE_LABELS[matched].tr} çalışması ${planetNames.join(", ")} saatleri için elverişlidir.`
    );

    const references = config.planets.map(p => d.planetInfo[p]?.source).filter(Boolean);

    const kashfOps = getKashfOperationsForPurpose(matched);
    return { best, alt, avoid, explanation, references, planetNames, kashfOps };
  }, [matched, d, language, txt]);

  const handleSearch = () => {
    const q = query.toLowerCase().trim();
    if (!q) return;
    for (const [key, cfg] of Object.entries(PURPOSE_MAP)) {
      const allKw = [...cfg.keywords.en, ...cfg.keywords.ml, ...cfg.keywords.tr, key, PURPOSE_LABELS[key].en.toLowerCase(), PURPOSE_LABELS[key].ml, PURPOSE_LABELS[key].tr.toLowerCase()];
      if (allKw.some(kw => q.includes(kw) || kw.includes(q))) {
        setMatched(key);
        return;
      }
    }
    setMatched("__none__");
  };

  const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };

  return (
    <div className="space-y-3">
      {/* ── Search Input ── */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder={txt("ഉദ്ദേശം തിരയുക... (പ്രണയം, വ്യാപാരം, യാത്ര...)", "Search purpose... (Love, Business, Travel...)", "Amaç ara... (Aşk, Ticaret, Seyahat...)")}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl font-inter text-sm"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.border}`, color: "#fff" }}
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2.5 rounded-xl font-inter text-xs font-bold uppercase tracking-wider" style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.08) 100%)",
          border: `1px solid ${G.border}`, color: G.text,
        }}>{txt("തിരയുക", "Search", "Ara")}</button>
      </div>

      {/* ── Quick Tags ── */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(PURPOSE_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => { setQuery(label[language] || label.en); setMatched(key); }}
            className="font-inter text-[10px] px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: matched === key ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${matched === key ? G.border : "rgba(255,255,255,0.08)"}`, color: matched === key ? G.text : "rgba(255,255,255,0.50)" }}>
            {label[language] || label.en}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      {matched === "__none__" && (
        <p className="font-inter text-xs text-center py-4" style={{ color: "rgba(255,255,255,0.40)" }}>
          {txt("പൊരുത്തമില്ല. മുകളിലെ ടാഗുകൾ ഉപയോഗിക്കുക.", "No match. Try the tags above.", "Eşleşme yok. Yukarıdaki etiketleri deneyin.")}
        </p>
      )}

      {results && (
        <div className="space-y-2.5">
          {/* Explanation */}
          <div className="rounded-lg p-2.5" style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>{results.explanation}</p>
          </div>

          {/* Best Saat */}
          {results.best.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ADE80" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4ADE80" }}>{txt("മികച്ച സഅാത്", "Best Saat", "En İyi Saat")}</span>
              </div>
              {results.best.map((h, i) => <SaatRow key={i} h={h} d={d} lang={language} />)}
            </div>
          )}

          {/* Alternative Saat */}
          {results.alt.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5" style={{ color: G.dim }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>{txt("ബദൽ സഅാത്", "Alternative Saat", "Alternatif Saat")}</span>
              </div>
              {results.alt.map((h, i) => <SaatRow key={i} h={h} d={d} lang={language} />)}
            </div>
          )}

          {/* Times to Avoid */}
          {results.avoid.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Ban className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>{txt("ഒഴിവാക്കുക", "Times to Avoid", "Kaçınılacak")}</span>
              </div>
              {results.avoid.map((h, i) => <SaatRow key={i} h={h} d={d} lang={language} avoid />)}
            </div>
          )}

          {/* References */}
          {results.references.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <BookOpen className="w-3 h-3" style={{ color: "rgba(74,222,128,0.50)" }} />
              {results.references.map((r, i) => (
                <span key={i} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.08)", color: "rgba(74,222,128,0.60)", border: "1px solid rgba(74,222,128,0.15)" }}>{r}</span>
              ))}
            </div>
          )}

          {/* Additional Manuscript Sources */}
          {results.kashfOps && results.kashfOps.length > 0 && (
            <ManuscriptSourcePanel
              sources={[{
                id: "kashf",
                label: txt("കശ്ഫ് അൽ-ഹഖാഇഖ് (ഒമാൻ)", "Kashf al-Haqa'iq (Omani)", "Kashf al-Haqa'iq (Omani)"),
                items: results.kashfOps.map(op => ({
                  ar: op.ar,
                  en: `${op.en} — ${op.day_en}, ${op.planet_en}`,
                  ml: op.ml,
                  tr: `${op.tr} — ${op.day_en}, ${op.planet_en}`,
                  type: "recommend",
                  source: op.source,
                }))
              }]}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SaatRow({ h, d, lang, avoid }) {
  const planetName = lang === "ml" ? (planetMLDisplay(h.planet) || d.planetInfo[h.planet]?.name_ml_equivalent) : d.planetInfo[h.planet]?.name_en;
  const symbol = d.planetInfo[h.planet]?.symbol || "";
  const color = avoid ? "#F87171" : h.status === "current" ? "#F5D060" : "#86EFAC";
  const statusLabel = h.status === "current" ? (lang === "ml" ? "നിലവിലെ" : "Current") : "";

  return (
    <div className="flex items-center gap-2 rounded-lg p-2 mb-1" style={{
      background: avoid ? "rgba(248,113,113,0.04)" : h.status === "current" ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${avoid ? "rgba(248,113,113,0.15)" : h.status === "current" ? "rgba(212,175,55,0.30)" : "rgba(255,255,255,0.06)"}`,
    }}>
      <span className="font-inter text-xs font-bold tabular-nums w-8" style={{ color }}>#{h.hourNumber > 12 ? h.hourNumber - 12 : h.hourNumber}</span>
      <span className="text-base">{symbol}</span>
      <span className="font-inter text-xs flex-1" style={{ color: "rgba(255,255,255,0.70)" }}>{planetName}</span>
      <span className="font-inter text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.45)" }}>{h.startTime} – {h.endTime}</span>
      {statusLabel && <span className="font-inter text-[8px] uppercase px-1.5 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.15)", color: "#F5D060" }}>{statusLabel}</span>}
    </div>
  );
}