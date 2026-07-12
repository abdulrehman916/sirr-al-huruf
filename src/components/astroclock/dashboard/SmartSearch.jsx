// ═══════════════════════════════════════════════════════════════
// SMART SEARCH — Knowledge Intelligence Engine UI
//
// Displays the complete knowledge package from the Intelligence Engine:
//   • Canonical Action     • Best Time          • Supporting Rules
//   • Related Actions      • Alternative Time   • Blocking Rules
//   • Confidence Score     • Avoid Time         • Conditional Rules
//   • Reasoning Summary    • Manuscript Refs    • Exceptions
//   • Knowledge Sources    • Indirect Rules
//
// DOES NOT modify: timing engine, calculation engine, OCR, ingestion,
// schema, routing, calculations, existing verified records, or any module.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { useAstroData } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { useKnowledgeIntelligenceSearch } from "@/hooks/useKnowledgeIntelligenceSearch";
import { ACTION_CATEGORIES } from "@/lib/astroActionClassifier";
import {
  Search, Clock, CheckCircle2, Ban, BookOpen, AlertTriangle,
  Brain, Tags, FileWarning, Lightbulb, Loader2, AlertCircle,
  Shield, Scale, GitBranch, Sparkles,
} from "lucide-react";
import ManuscriptSourcePanel from "./ManuscriptSourcePanel";
import { planetArabicMLDisplay } from "@/lib/astroClockLabelMap";

const QUICK_TAGS = [
  "construction", "travel", "marriage", "business",
  "agriculture", "medical", "love", "protection",
  "wealth", "knowledge", "spiritual", "courage",
];

const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };

export default function SmartSearch() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  const { search, reset, loading, error, result, searched } = useKnowledgeIntelligenceSearch(d);
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (!input.trim()) return;
    search(input.trim());
  };

  const handleTag = (catKey) => {
    const cat = ACTION_CATEGORIES[catKey];
    const label = cat?.label?.[language] || cat?.label?.en || catKey;
    setInput(label);
    search(catKey);
  };

  const handleReset = () => {
    setInput("");
    reset();
  };

  return (
    <div className="space-y-3">
      {/* ── Search Input ── */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder={txt(
              "പ്രവൃത്തി തിരയുക... (വീട് പണിയൽ, യാത്ര, വിവാഹം, കൃഷി...)",
              "Search action... (Construction, Travel, Marriage, Farming...)",
              "İşlem ara... (İnşaat, Seyahat, Evlilik, Tarım...)"
            )}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl font-inter text-sm"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.border}`, color: "#fff" }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-opacity"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.08) 100%)",
            border: `1px solid ${G.border}`,
            color: G.text,
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "..." : txt("തിരയുക", "Search", "Ara")}
        </button>
      </div>

      {/* ── Quick Tags ── */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_TAGS.map(key => {
          const cat = ACTION_CATEGORIES[key];
          if (!cat) return null;
          const label = cat.label[language] || cat.label.en;
          const isActive = result?.canonicalId === key;
          return (
            <button
              key={key}
              onClick={() => handleTag(key)}
              disabled={loading}
              className="font-inter text-[10px] px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
              style={{
                background: isActive ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? G.border : "rgba(255,255,255,0.08)"}`,
                color: isActive ? G.text : "rgba(255,255,255,0.50)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="rounded-lg p-4 text-center" style={{
          background: "rgba(129,140,248,0.05)",
          border: "1px solid rgba(129,140,248,0.20)",
        }}>
          <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" style={{ color: "rgba(129,140,248,0.70)" }} />
          <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
            {txt(
              "എല്ലാ സ്ഥിരീകരിച്ച വിജ്ഞാനവും വിശകലനം ചെയ്യുന്നു...",
              "Analyzing all verified knowledge...",
              "Tüm doğrulanmış bilgi analiz ediliyor..."
            )}
          </p>
          <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            {txt(
              "നിഗമന എഞ്ചിൻ ഗ്രന്ഥ നിയമങ്ങൾ ശേഖരിക്കുന്നു",
              "Reasoning engine collecting manuscript rules",
              "Akıl yürütme motoru el yazması kuralları topluyor"
            )}
          </p>
        </div>
      )}

      {/* ── Error State ── */}
      {error && !loading && (
        <div className="rounded-lg p-3 text-center" style={{
          background: "rgba(248,113,113,0.04)",
          border: "1px solid rgba(248,113,113,0.15)",
        }}>
          <AlertCircle className="w-4 h-4 mx-auto mb-1" style={{ color: "rgba(248,113,113,0.50)" }} />
          <p className="font-inter text-xs mb-2" style={{ color: "rgba(255,255,255,0.50)" }}>
            {txt(
              "വിജ്ഞാന എഞ്ചിൻ പിശക്. വീണ്ടും ശ്രമിക്കുക.",
              "Knowledge engine error. Please try again.",
              "Bilgi motoru hatası. Lütfen tekrar deneyin."
            )}
          </p>
          <button onClick={handleReset} className="font-inter text-[10px] underline" style={{ color: G.dim }}>
            {txt("പുതിയ തിരൽ", "New Search", "Yeni Arama")}
          </button>
        </div>
      )}

      {/* ── No Match ── */}
      {searched && !result && !loading && !error && (
        <div className="rounded-lg p-3 text-center" style={{
          background: "rgba(248,113,113,0.04)",
          border: "1px solid rgba(248,113,113,0.15)",
        }}>
          <AlertTriangle className="w-4 h-4 mx-auto mb-1" style={{ color: "rgba(248,113,113,0.50)" }} />
          <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
            {txt(
              "ഈ പ്രവൃത്തിയ്ക്ക് സ്ഥിരീകരിച്ച വിജ്ഞാനം കണ്ടെത്താനായില്ല.",
              "No verified knowledge found for this action.",
              "Bu işlem için doğrulanmış bilgi bulunamadı."
            )}
          </p>
          <button onClick={handleReset} className="mt-2 font-inter text-[10px] underline" style={{ color: G.dim }}>
            {txt("പുതിയ തിരൽ", "New Search", "Yeni Arama")}
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div className="space-y-2.5">
          {/* ── Reasoning Header: Detected + Canonical + Confidence ── */}
          <div className="rounded-lg p-2.5" style={{
            background: "rgba(129,140,248,0.05)",
            border: "1px solid rgba(129,140,248,0.20)",
          }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Brain className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(129,140,248,0.70)" }} />
              <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "rgba(129,140,248,0.70)" }}>
                {txt("വിജ്ഞാന വിശകലനം", "Knowledge Analysis", "Bilgi Analizi")}
              </span>
            </div>
            {/* Detected action */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-inter text-[9px] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                {txt("കണ്ടെത്തിയത്", "Detected", "Tespit Edilen")}:
              </span>
              <span className="font-inter text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.80)" }}>
                "{result.detectedAction}"
              </span>
            </div>
            {/* Canonical action */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-inter text-[9px] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                {txt("കാനോണിക്കൽ പ്രവൃത്തി", "Canonical Action", "Kanonik Eylem")}:
              </span>
              <span className="font-inter text-[11px] font-bold" style={{ color: G.text }}>
                {result.canonicalAction[language] || result.canonicalAction.en}
              </span>
            </div>
            {/* Confidence + rules used */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                {txt("ആത്മവിശ്വാസം", "Confidence", "Güven")}: <span style={{ color: result.suitable ? "#4ADE80" : "#F87171" }}>{result.confidence}%</span>
              </span>
              <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                {txt("വിജ്ഞാന നിയമങ്ങൾ", "Knowledge Rules", "Bilgi Kuralları")}: <span style={{ color: G.text }}>{result.knowledgeRulesUsed}</span>
              </span>
              <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                {txt("ബന്ധപ്പെട്ട പദങ്ങൾ", "Related Terms", "İlgili Terimler")}: <span style={{ color: G.dim }}>{result.relatedActions.length}</span>
              </span>
              {result.suitable ? (
                <span className="font-inter text-[9px] uppercase px-2 py-0.5 rounded font-bold" style={{
                  background: "rgba(74,222,128,0.12)", color: "#4ADE80",
                }}>{txt("അനുകൂലം", "Suitable", "Elverişli")}</span>
              ) : (
                <span className="font-inter text-[9px] uppercase px-2 py-0.5 rounded font-bold" style={{
                  background: "rgba(248,113,113,0.12)", color: "#F87171",
                }}>{txt("പ്രതികൂലം", "Not Ideal", "Elverişsiz")}</span>
              )}
            </div>
          </div>

          {/* ── Related Actions ── */}
          {result.relatedActions.length > 0 && (
            <div className="rounded-lg p-2" style={{
              background: "rgba(212,175,55,0.04)",
              border: `1px solid ${G.border}`,
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Tags className="w-3 h-3" style={{ color: G.dim }} />
                <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                  {txt("ബന്ധപ്പെട്ട പ്രവൃത്തികൾ", "Related Actions", "İlgili Eylemler")}
                  <span className="opacity-50"> ({result.relatedActions.length})</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.relatedActions.map((topic, i) => (
                  <span key={i} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                    background: "rgba(212,175,55,0.06)", color: "rgba(212,175,55,0.50)",
                    border: "1px solid rgba(212,175,55,0.10)",
                  }}>{topic}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Reasoning Summary ── */}
          {result.reasoningSummary && (
            <div className="rounded-lg p-2.5" style={{
              background: "rgba(129,140,248,0.03)",
              border: "1px solid rgba(129,140,248,0.10)",
            }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Brain className="w-3 h-3" style={{ color: "rgba(129,140,248,0.50)" }} />
                <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(129,140,248,0.50)" }}>
                  {txt("നിഗമന സംഗ്രഹം", "Reasoning Summary", "Akıl Yürütme Özeti")}
                </span>
              </div>
              <p className="font-inter text-[10px] leading-relaxed whitespace-pre-line" style={{ color: "rgba(255,255,255,0.55)" }}>
                {result.reasoningSummary}
              </p>
            </div>
          )}

          {/* ── Why Suitable / Why Not ── */}
          {result.suitable ? (
            <div className="rounded-lg p-2.5" style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${G.border}` }}>
              <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>
                {txt(
                  `${result.canonicalAction.ml || result.canonicalAction.en} ഇന്ന് അനുകൂലമാണ്. ${result.preferredPlanets.map(p => d.planetInfo[p]?.name_ml_equivalent || p).join(", ")} ഗ്രഹങ്ങളുടെ സഅാതുകൾ ഉപയോഗിക്കുക.`,
                  `${result.canonicalAction.en} is favorable today. Use hours governed by ${result.preferredPlanets.map(p => d.planetInfo[p]?.name_en || p).join(", ")}.`,
                  `${result.canonicalAction.en} today is favorable. Use ${result.preferredPlanets.map(p => d.planetInfo[p]?.name_en || p).join(", ")} hours.`
                )}
              </p>
            </div>
          ) : (
            <div className="rounded-lg p-2.5 space-y-1.5" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
              <div className="flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F87171" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
                  {txt("കാരണങ്ങൾ", "Blocking Reasons", "Engel Sebepleri")}
                </span>
              </div>
              {result.blockingReasons.map((r, i) => (
                <p key={i} className="font-inter text-[11px] pl-5" style={{ color: "rgba(255,255,255,0.60)" }}>
                  • {r[language] || r.en}
                </p>
              ))}
              {(result.alternativeHours.length > 0 || result.recommendedHours.length > 0) && (
                <p className="font-inter text-[11px] pl-5 mt-1" style={{ color: "rgba(74,222,128,0.60)" }}>
                  {txt(
                    "ഇതിനകം ലഭ്യമായ മികച്ച സഅാതുകൾ താഴെ കാണുക.",
                    "Best available hours are shown below.",
                    "Mevcut en iyi saatler aşağıda."
                  )}
                </p>
              )}
            </div>
          )}

          {/* ── Best Saat ── */}
          {result.recommendedHours.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ADE80" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4ADE80" }}>
                  {txt("മികച്ച സഅാത്", "Best Time", "En İyi Saat")}
                </span>
              </div>
              {result.recommendedHours.map((h, i) => <SaatRow key={i} h={h} d={d} lang={language} />)}
            </div>
          )}

          {/* ── Alternative Saat ── */}
          {result.alternativeHours.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5" style={{ color: G.dim }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                  {txt("ബദൽ സഅാത്", "Alternative Time", "Alternatif Saat")}
                </span>
              </div>
              {result.alternativeHours.map((h, i) => <SaatRow key={i} h={h} d={d} lang={language} />)}
            </div>
          )}

          {/* ── Times to Avoid ── */}
          {result.avoidedHours.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Ban className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
                  {txt("ഒഴിവാക്കുക", "Avoid Time", "Kaçınılacak")}
                </span>
              </div>
              {result.avoidedHours.map((h, i) => <SaatRow key={i} h={h} d={d} lang={language} avoid />)}
            </div>
          )}

          {/* ── Supporting Rules ── */}
          {result.supportingRules.length > 0 && (
            <RuleSection
              icon={Shield}
              title={txt("പിന്തുണയ്ക്കുന്ന നിയമങ്ങൾ", "Supporting Rules", "Destekleyici Kurallar")}
              rules={result.supportingRules}
              color="rgba(129,140,248,0.60)"
              bgColor="rgba(129,140,248,0.03)"
              borderColor="rgba(129,140,248,0.10)"
              d={d}
              lang={language}
              txt={txt}
            />
          )}

          {/* ── Blocking Rules ── */}
          {result.blockingRules.length > 0 && (
            <RuleSection
              icon={Ban}
              title={txt("തടയുന്ന നിയമങ്ങൾ", "Blocking Rules", "Engelleyici Kurallar")}
              rules={result.blockingRules}
              color="#F87171"
              bgColor="rgba(248,113,113,0.04)"
              borderColor="rgba(248,113,113,0.12)"
              d={d}
              lang={language}
              txt={txt}
              actionMarker="✗"
            />
          )}

          {/* ── Conditional Rules (NEW) ── */}
          {result.conditionalRules.length > 0 && (
            <RuleSection
              icon={Scale}
              title={txt("വ്യവസ്ഥാപിത നിയമങ്ങൾ", "Conditional Rules", "Koşullu Kurallar")}
              rules={result.conditionalRules}
              color="rgba(251,191,36,0.60)"
              bgColor="rgba(251,191,36,0.03)"
              borderColor="rgba(251,191,36,0.12)"
              d={d}
              lang={language}
              txt={txt}
              showReason
            />
          )}

          {/* ── Exceptions (NEW) ── */}
          {result.exceptions.length > 0 && (
            <RuleSection
              icon={GitBranch}
              title={txt("അപവാദങ്ങൾ", "Exceptions", "İstisnalar")}
              rules={result.exceptions}
              color="rgba(167,139,250,0.60)"
              bgColor="rgba(167,139,250,0.03)"
              borderColor="rgba(167,139,250,0.12)"
              d={d}
              lang={language}
              txt={txt}
              showReason
            />
          )}

          {/* ── Indirect Rules (NEW) ── */}
          {result.indirectRules.length > 0 && (
            <RuleSection
              icon={Sparkles}
              title={txt("പരോക്ഷ നിയമങ്ങൾ", "Indirect Rules", "Dolaylı Kurallar")}
              rules={result.indirectRules}
              color="rgba(96,165,250,0.60)"
              bgColor="rgba(96,165,250,0.03)"
              borderColor="rgba(96,165,250,0.12)"
              d={d}
              lang={language}
              txt={txt}
              showReason
            />
          )}

          {/* ── Manuscript Knowledge (EK records) ── */}
          {result.indirectRules.filter(r => r.recordType === "EK").length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5" style={{ color: "rgba(74,222,128,0.50)" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "rgba(74,222,128,0.50)" }}>
                  {txt("ഗ്രന്ഥ വിജ്ഞാനം", "Manuscript References", "El Yazması Kaynakları")}
                  <span className="opacity-50"> ({result.indirectRules.filter(r => r.recordType === "EK").length})</span>
                </span>
              </div>
              <div className="space-y-1.5">
                {result.indirectRules.filter(r => r.recordType === "EK").map((m, i) => (
                  <div key={i} className="rounded-lg p-2" style={{
                    background: "rgba(74,222,128,0.03)",
                    border: "1px solid rgba(74,222,128,0.10)",
                  }}>
                    {m.category && (
                      <span className="font-inter text-[8px] uppercase tracking-wider font-bold mb-1 block" style={{ color: "rgba(74,222,128,0.40)" }}>
                        {m.category} · {m.entity_type}/{m.entity_key}
                      </span>
                    )}
                    <p className="font-inter text-[10px] leading-snug mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {(language === "ml" && m.text_ml ? m.text_ml : m.text).split("\n---\n")[0]}
                    </p>
                    {m.text_ar && (
                      <p className="font-amiri text-[11px] mt-1" style={{ color: "rgba(212,175,55,0.40)", direction: "rtl" }}>{m.text_ar}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                        background: "rgba(74,222,128,0.06)", color: "rgba(74,222,128,0.40)",
                      }}>📖 {m.source}{m.page ? ` p.${m.page}` : ""}{m.screenshot ? " 📷" : ""}</span>
                      {m.source_count > 1 && (
                        <span className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                          background: "rgba(212,175,55,0.06)", color: "rgba(212,175,55,0.40)",
                        }}>+{m.source_count - 1}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Knowledge Sources ── */}
          {result.sources.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <BookOpen className="w-3 h-3" style={{ color: "rgba(74,222,128,0.50)" }} />
              {result.sources.slice(0, 5).map((s, i) => (
                <span key={i} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                  background: "rgba(74,222,128,0.08)", color: "rgba(74,222,128,0.60)", border: "1px solid rgba(74,222,128,0.15)",
                }}>{s}</span>
              ))}
              {result.sources.length > 5 && (
                <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>+{result.sources.length - 5}</span>
              )}
            </div>
          )}

          {/* ── Kashf Manuscript Operations ── */}
          {result.kashfOps && result.kashfOps.length > 0 && (
            <ManuscriptSourcePanel
              sources={[{
                id: "kashf",
                label: txt("കശ്ഫ് അൽ-ഹഖാഇഖ് (ഒമാൻ)", "Kashf al-Haqa'iq (Omani)", "Kashf al-Haqa'iq (Omani)"),
                items: result.kashfOps.map(op => ({
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

          {/* ── Reset ── */}
          <button onClick={handleReset} className="w-full py-2 rounded-lg font-inter text-[10px] font-bold uppercase tracking-wider" style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.08)`, color: "rgba(255,255,255,0.40)",
          }}>{txt("പുതിയ തിരൽ", "New Search", "Yeni Arama")}</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RuleSection — renders a categorized list of knowledge rules
// Used for Supporting, Blocking, Conditional, Exceptions, Indirect
// ═══════════════════════════════════════════════════════════════
function RuleSection({ icon: Icon, title, rules, color, bgColor, borderColor, d, lang, txt, actionMarker, showReason }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color }}>
          {title}
          <span className="opacity-50"> ({rules.length})</span>
        </span>
      </div>
      <div className="space-y-1.5">
        {rules.map((rule, i) => (
          <div key={i} className="rounded-lg p-2" style={{ background: bgColor, border: `1px solid ${borderColor}` }}>
            {/* ACK record: saat context + actions */}
            {rule.recordType === "ACK" && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                    background: "rgba(212,175,55,0.06)", color: "rgba(212,175,55,0.60)",
                  }}>
                    #{rule.saat > 12 ? rule.saat - 12 : rule.saat} {rule.period}
                  </span>
                  <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                    {d.planetInfo[rule.planet]?.[lang === "ml" ? "name_ml_equivalent" : "name_en"] || rule.planet}
                  </span>
                </div>
                {rule.actions.map((a, j) => (
                  <p key={j} className="font-inter text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <span className="font-bold uppercase mr-1" style={{
                      color: a.type === "recommended" ? "#4ADE80" : a.type === "forbidden" ? "#F87171" : G.dim,
                    }}>
                      {actionMarker || (a.type === "recommended" ? "✓" : a.type === "forbidden" ? "✗" : "•")}
                    </span>
                    {a[lang] || a.en}
                  </p>
                ))}
              </>
            )}
            {/* EK record: text */}
            {rule.recordType === "EK" && (
              <>
                {rule.category && (
                  <span className="font-inter text-[8px] uppercase tracking-wider font-bold mb-1 block" style={{ color: "rgba(96,165,250,0.40)" }}>
                    {rule.category} · {rule.entity_type}/{rule.entity_key}
                  </span>
                )}
                <p className="font-inter text-[10px] leading-snug mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {(lang === "ml" && rule.text_ml ? rule.text_ml : rule.text).split("\n---\n")[0]}
                </p>
                {rule.text_ar && (
                  <p className="font-amiri text-[11px] mt-1" style={{ color: "rgba(212,175,55,0.40)", direction: "rtl" }}>{rule.text_ar}</p>
                )}
              </>
            )}
            {/* Summary */}
            {rule.summary && rule.recordType === "ACK" && (
              <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>{rule.summary}</p>
            )}
            {/* Reason (for conditional/exception/indirect) */}
            {showReason && rule.reason && (
              <p className="font-inter text-[10px] mt-1 italic" style={{ color: "rgba(255,255,255,0.45)" }}>
                {txt("കാരണം", "Reason", "Sebep")}: {rule.reason}
              </p>
            )}
            {/* Source */}
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                background: "rgba(129,140,248,0.06)", color: "rgba(129,140,248,0.40)",
              }}>📖 {rule.source}{rule.page ? ` p.${rule.page}` : ""}{rule.screenshot ? " 📷" : ""}</span>
              {rule.source_count > 1 && (
                <span className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                  background: "rgba(212,175,55,0.06)", color: "rgba(212,175,55,0.40)",
                }}>+{rule.source_count - 1}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Saat row display ──
function SaatRow({ h, d, lang, avoid }) {
  const planetName = lang === "ml"
    ? (planetArabicMLDisplay(h.planet) || d.planetInfo[h.planet]?.name_ml_equivalent)
    : d.planetInfo[h.planet]?.name_en;
  const symbol = d.planetInfo[h.planet]?.symbol || "";
  const color = avoid ? "#F87171" : h.status === "current" ? "#F5D060" : "#86EFAC";
  const statusLabel = h.status === "current" ? (lang === "ml" ? "നിലവിലെ" : "Current") : "";

  return (
    <div className="flex items-center gap-2 rounded-lg p-2 mb-1" style={{
      background: avoid ? "rgba(248,113,113,0.04)" : h.status === "current" ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${avoid ? "rgba(248,113,113,0.15)" : h.status === "current" ? "rgba(212,175,55,0.30)" : "rgba(255,255,255,0.06)"}`,
    }}>
      <span className="font-inter text-xs font-bold tabular-nums w-8" style={{ color }}>
        #{h.hourNumber > 12 ? h.hourNumber - 12 : h.hourNumber}
      </span>
      <span className="text-base">{symbol}</span>
      <span className="font-inter text-xs flex-1" style={{ color: "rgba(255,255,255,0.70)" }}>{planetName}</span>
      <span className="font-inter text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.45)" }}>
        {h.startTime} – {h.endTime}
      </span>
      {statusLabel && (
        <span className="font-inter text-[8px] uppercase px-1.5 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.15)", color: "#F5D060" }}>
          {statusLabel}
        </span>
      )}
    </div>
  );
}