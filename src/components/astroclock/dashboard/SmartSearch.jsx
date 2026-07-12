// ═══════════════════════════════════════════════════════════════
// SECTION 2 — SEMANTIC SMART SEARCH (Knowledge Reasoning Engine)
//
// FLOW:
//   1. User types any action (any language) → reasoning engine resolves it
//   2. Engine expands to all related terms (synonyms, topics, equivalents)
//   3. Knowledge bases queried with full expansion
//   4. Timing engine combines with matched knowledge (UNMODIFIED)
//   5. UI shows: detected action, canonical action, related topics,
//      knowledge rules used, reasoning summary, confidence, warnings,
//      recommendations, recommended/alternative/avoid hours,
//      supporting rules, supporting manuscripts, sources
//
// DOES NOT modify: timing engine, OCR, ingestion, schema, routing,
// calculations, existing verified records, or any other module.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { useAstroData } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { useSemanticActionSearch } from "@/hooks/useSemanticActionSearch";
import { ACTION_CATEGORIES } from "@/lib/astroActionClassifier";
import { Search, Clock, CheckCircle2, Ban, BookOpen, AlertTriangle, Sparkles, Shield, Brain, Tags, FileWarning, Lightbulb } from "lucide-react";
import ManuscriptSourcePanel from "./ManuscriptSourcePanel";
import { planetArabicMLDisplay } from "@/lib/astroClockLabelMap";

// Quick tag categories shown to the user (internal mapping is hidden)
const QUICK_TAGS = [
  "construction", "travel", "marriage", "business",
  "agriculture", "medical", "love", "protection",
  "wealth", "knowledge", "spiritual", "courage",
];

export default function SmartSearch() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  const { query, search, reset, resolution, result, loading, searched } = useSemanticActionSearch();
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

  const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };

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
        <button onClick={handleSearch} disabled={loading} className="px-4 py-2.5 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-opacity" style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.08) 100%)",
          border: `1px solid ${G.border}`, color: G.text, opacity: loading ? 0.5 : 1,
        }}>{loading ? "..." : txt("തിരയുക", "Search", "Ara")}</button>
      </div>

      {/* ── Quick Tags ── */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_TAGS.map(key => {
          const cat = ACTION_CATEGORIES[key];
          if (!cat) return null;
          const label = cat.label[language] || cat.label.en;
          const isActive = resolution?.canonicalId === key;
          return (
            <button key={key} onClick={() => handleTag(key)}
              className="font-inter text-[10px] px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
              style={{
                background: isActive ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? G.border : "rgba(255,255,255,0.08)"}`,
                color: isActive ? G.text : "rgba(255,255,255,0.50)",
              }}>{label}</button>
          );
        })}
      </div>

      {/* ── No Match ── */}
      {searched && !resolution && !loading && (
        <div className="rounded-lg p-3 text-center" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
          <AlertTriangle className="w-4 h-4 mx-auto mb-1" style={{ color: "rgba(248,113,113,0.50)" }} />
          <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
            {txt(
              "ഈ പ്രവൃത്തി തിരിച്ചറിയാൻ കഴിഞ്ഞില്ല. മുകളിലെ വിഭാഗങ്ങൾ ഉപയോഗിക്കുക.",
              "Could not identify this action. Try the categories above.",
              "Bu işlem tanınamadı. Yukarıdaki kategorileri deneyin."
            )}
          </p>
          <button onClick={handleReset} className="mt-2 font-inter text-[10px] underline" style={{ color: G.dim }}>
            {txt("പുതിയ തിരൽ", "New Search", "Yeni Arama")}
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {result && resolution && (
        <div className="space-y-2.5">
          {/* ── Reasoning Header: Detected + Canonical + Confidence ── */}
          <div className="rounded-lg p-2.5" style={{
            background: "rgba(129,140,248,0.05)",
            border: "1px solid rgba(129,140,248,0.20)",
          }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Brain className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(129,140,248,0.70)" }} />
              <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "rgba(129,140,248,0.70)" }}>
                {txt("നിഗമന ഫലം", "Reasoning Result", "Akıl Yürütme Sonucu")}
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
                {txt("വിപുലീകരണ പദങ്ങൾ", "Expansion Terms", "Genişletme Terimleri")}: <span style={{ color: G.dim }}>{result.expansionTermsCount}</span>
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

          {/* ── Related Topics Found ── */}
          {result.relatedTopics.length > 0 && (
            <div className="rounded-lg p-2" style={{
              background: "rgba(212,175,55,0.04)",
              border: `1px solid ${G.border}`,
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Tags className="w-3 h-3" style={{ color: G.dim }} />
                <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                  {txt("ബന്ധപ്പെട്ട വിഷയങ്ങൾ", "Related Topics Found", "İlgili Konular")}
                  <span className="opacity-50"> ({result.relatedTopics.length})</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.relatedTopics.map((topic, i) => (
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
                  `${result.canonicalAction.ml} ഇന്ന് അനുകൂലമാണ്. ${result.preferredPlanets.map(p => d.planetInfo[p]?.name_ml_equivalent || p).join(", ")} ഗ്രഹങ്ങളുടെ സഅാതുകൾ ഉപയോഗിക്കുക.`,
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

          {/* ── Recommended Saat ── */}
          {result.recommendedHours.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ADE80" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4ADE80" }}>
                  {txt("മികച്ച സഅാത്", "Best Saat", "En İyi Saat")}
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
                  {txt("ബദൽ സഅാത്", "Alternative Saat", "Alternatif Saat")}
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
                  {txt("ഒഴിവാക്കുക", "Times to Avoid", "Kaçınılacak")}
                </span>
              </div>
              {result.avoidedHours.map((h, i) => <SaatRow key={i} h={h} d={d} lang={language} avoid />)}
            </div>
          )}

          {/* ── Warnings from Knowledge ── */}
          {result.warnings.length > 0 && (
            <div className="rounded-lg p-2" style={{
              background: "rgba(248,113,113,0.03)",
              border: "1px solid rgba(248,113,113,0.10)",
            }}>
              <div className="flex items-center gap-1.5 mb-1">
                <FileWarning className="w-3 h-3" style={{ color: "rgba(248,113,113,0.50)" }} />
                <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(248,113,113,0.50)" }}>
                  {txt("മുന്നറിയിപ്പുകൾ", "Warnings", "Uyarılar")}
                  <span className="opacity-50"> ({result.warnings.length})</span>
                </span>
              </div>
              {result.warnings.slice(0, 5).map((w, i) => (
                <p key={i} className="font-inter text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  • {w.text}
                </p>
              ))}
            </div>
          )}

          {/* ── Recommendations from Knowledge ── */}
          {result.recommendations.length > 0 && (
            <div className="rounded-lg p-2" style={{
              background: "rgba(74,222,128,0.03)",
              border: "1px solid rgba(74,222,128,0.10)",
            }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3 h-3" style={{ color: "rgba(74,222,128,0.50)" }} />
                <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(74,222,128,0.50)" }}>
                  {txt("ശുപാർശകൾ", "Recommendations", "Öneriler")}
                  <span className="opacity-50"> ({result.recommendations.length})</span>
                </span>
              </div>
              {result.recommendations.slice(0, 5).map((r, i) => (
                <p key={i} className="font-inter text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  • {r.text}
                </p>
              ))}
            </div>
          )}

          {/* ── Supporting Rules (from AstroClockKnowledge) ── */}
          {result.supportingRules.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Shield className="w-3.5 h-3.5" style={{ color: "rgba(129,140,248,0.60)" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "rgba(129,140,248,0.60)" }}>
                  {txt("ഗ്രന്ഥ നിയമങ്ങൾ", "Supporting Rules", "Destekleyici Kurallar")}
                  <span className="opacity-50"> ({result.supportingRules.length})</span>
                </span>
              </div>
              <div className="space-y-1.5">
                {result.supportingRules.map((rule, i) => (
                  <div key={i} className="rounded-lg p-2" style={{
                    background: "rgba(129,140,248,0.03)",
                    border: "1px solid rgba(129,140,248,0.10)",
                  }}>
                    {/* Saat context */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                        background: "rgba(212,175,55,0.06)", color: "rgba(212,175,55,0.60)",
                      }}>#{rule.saat > 12 ? rule.saat - 12 : rule.saat} {rule.period}</span>
                      <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                        {d.planetInfo[rule.planet]?.[language === 'ml' ? 'name_ml_equivalent' : 'name_en'] || rule.planet}
                      </span>
                    </div>
                    {/* Action texts */}
                    {rule.actions.map((a, j) => (
                      <p key={j} className="font-inter text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <span className="font-bold uppercase mr-1" style={{
                          color: a.type === 'recommended' ? '#4ADE80' : a.type === 'forbidden' ? '#F87171' : G.dim,
                        }}>{a.type === 'recommended' ? '✓' : a.type === 'forbidden' ? '✗' : '•'}</span>
                        {a[language] || a.en}
                      </p>
                    ))}
                    {/* Summary */}
                    {rule.summary && (
                      <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>{rule.summary}</p>
                    )}
                    {/* Source */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                        background: "rgba(129,140,248,0.06)", color: "rgba(129,140,248,0.40)",
                      }}>📖 {rule.source}{rule.page ? ` p.${rule.page}` : ''}{rule.screenshot ? ' 📷' : ''}</span>
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
          )}

          {/* ── Blocking Rules (from knowledge database) ── */}
          {result.blockingRules && result.blockingRules.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Ban className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
                  {txt("തടയുന്ന നിയമങ്ങൾ", "Blocking Rules", "Engelleyici Kurallar")}
                  <span className="opacity-50"> ({result.blockingRules.length})</span>
                </span>
              </div>
              <div className="space-y-1.5">
                {result.blockingRules.map((rule, i) => (
                  <div key={i} className="rounded-lg p-2" style={{
                    background: "rgba(248,113,113,0.04)",
                    border: "1px solid rgba(248,113,113,0.12)",
                  }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                        background: "rgba(248,113,113,0.08)", color: "rgba(248,113,113,0.60)",
                      }}>#{rule.saat > 12 ? rule.saat - 12 : rule.saat} {rule.period}</span>
                      <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                        {d.planetInfo[rule.planet]?.[language === 'ml' ? 'name_ml_equivalent' : 'name_en'] || rule.planet}
                      </span>
                    </div>
                    {rule.actions.map((a, j) => (
                      <p key={j} className="font-inter text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <span className="font-bold uppercase mr-1" style={{ color: "#F87171" }}>✗</span>
                        {a[language] || a.en}
                      </p>
                    ))}
                    {rule.summary && (
                      <p className="font-inter text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>{rule.summary}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                        background: "rgba(248,113,113,0.06)", color: "rgba(248,113,113,0.40)",
                      }}>📖 {rule.source}{rule.page ? ` p.${rule.page}` : ''}{rule.screenshot ? ' 📷' : ''}</span>
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
          )}

          {/* ── Supporting Manuscripts (from EntityKnowledge) ── */}
          {result.supportingManuscripts.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5" style={{ color: "rgba(74,222,128,0.50)" }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "rgba(74,222,128,0.50)" }}>
                  {txt("ഗ്രന്ഥ വിജ്ഞാനം", "Manuscript Knowledge", "El Yazması Bilgisi")}
                  <span className="opacity-50"> ({result.supportingManuscripts.length})</span>
                </span>
              </div>
              <div className="space-y-1.5">
                {result.supportingManuscripts.map((m, i) => (
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
                      {(language === 'ml' && m.text_ml ? m.text_ml : m.text).split('\n---\n')[0]}
                    </p>
                    {m.text_ar && (
                      <p className="font-amiri text-[11px] mt-1" style={{ color: "rgba(212,175,55,0.40)", direction: "rtl" }}>{m.text_ar}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                        background: "rgba(74,222,128,0.06)", color: "rgba(74,222,128,0.40)",
                      }}>📖 {m.source}{m.page ? ` p.${m.page}` : ''}{m.screenshot ? ' 📷' : ''}</span>
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

          {/* ── Source References ── */}
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

// ── Saat row display (preserved from original) ──
function SaatRow({ h, d, lang, avoid }) {
  const planetName = lang === "ml" ? (planetArabicMLDisplay(h.planet) || d.planetInfo[h.planet]?.name_ml_equivalent) : d.planetInfo[h.planet]?.name_en;
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