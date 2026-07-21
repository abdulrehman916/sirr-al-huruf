// ═══════════════════════════════════════════════════════════════
// SECTION 7 — PLANET ENCYCLOPEDIA
// All 7 planetary rulers — expandable cards, current planet highlighted
// Planet info appears ONLY here — no duplication in other sections
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useAstroData } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import ManuscriptSourcePanel from "./ManuscriptSourcePanel";
import { normalizeDisplay, normalizeArray } from "@/lib/astroClockLanguageNormalizer";
import { getKashfOperationsForPlanet, getKashfDirectionForElement } from "@/lib/astroClockManuscriptMerger";
import { elementToML, planetArabicMLDisplay, PLANET_AR_ML } from "@/lib/astroClockLabelMap";
import { GIH_PLANET_INFLUENCE_CHARACTERISTICS, GIH_PLANET_RELATIONSHIPS, GIH_VENUS_VEFK, GIH_SUN_DEGREE_TABLE } from "@/lib/gizliIlimlerHazinesiZodiacData";
import EntityKnowledgePanel from "./EntityKnowledgePanel";
import MagicalPeriodPanel from "./MagicalPeriodPanel";
import AstroClockCategoryVisuals from "@/components/astroclock/AstroClockCategoryVisuals";

const PLANET_ORDER = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

// Element derived from ruling signs in ZODIAC_SIGNS (not invented)
function getPlanetElements(planetKey, zodiacSigns) {
  const elements = new Set();
  Object.values(zodiacSigns || {}).forEach(s => {
    if (s.ruling_planet?.toLowerCase() === planetKey.charAt(0).toUpperCase() + planetKey.slice(1)) {
      elements.add(s.element);
    }
  });
  return Array.from(elements);
}

export default function PlanetEncyclopedia() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  const [expanded, setExpanded] = useState(null);
  const currentPlanet = d.currentHour?.planet;

  return (
    <div className="space-y-1.5">
      {PLANET_ORDER.map(key => {
    const info = d.planetInfo[key];
    if (!info) return null;
    const friends = d.planetFriendships[key];
    const isCurrent = key === currentPlanet;
    const isOpen = expanded === key;
    const displayName = language === "ml" ? (planetArabicMLDisplay(key) || info.name_ml_equivalent) : info.name_en;
    const nature = normalizeDisplay(language === "ml" ? info.nature_ml : info.nature_en);
    const elements = getPlanetElements(key, d.zodiacSigns);
    const color = isCurrent ? "#F5D060" : "rgba(255,255,255,0.70)";
    const borderColor = isCurrent ? "rgba(212,175,55,0.40)" : "rgba(255,255,255,0.08)";

    const goodActions = normalizeArray(language === "ml" ? info.goodActions_ml : info.goodActions_en);
    const badActions = normalizeArray(language === "ml" ? info.badActions_ml : info.badActions_en);
    const benefits = normalizeArray(language === "ml" ? info.benefits_ml : info.benefits_en);
    const warnings = normalizeArray(language === "ml" ? info.warnings_ml : info.warnings_en);
    const spiritual = normalizeArray(language === "ml" ? info.spiritualOperations_ml : info.spiritualOperations_en);

    const friendNames = (friends?.friends || []).map(p => language === "ml" ? d.planetInfo[p]?.name_ml_equivalent : d.planetInfo[p]?.name_en);
    const enemyNames = (friends?.enemies || []).map(p => language === "ml" ? d.planetInfo[p]?.name_ml_equivalent : d.planetInfo[p]?.name_en);
    const neutralNames = (friends?.neutral || []).map(p => language === "ml" ? d.planetInfo[p]?.name_ml_equivalent : d.planetInfo[p]?.name_en);
    const kashfOps = getKashfOperationsForPlanet(key);
    const kashfDir = getKashfDirectionForElement(elements[0]);

    return (
      <div key={key} className="rounded-lg overflow-hidden" style={{
        background: isCurrent ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${borderColor}`,
      }}>
        <button onClick={() => setExpanded(isOpen ? null : key)} className="w-full flex items-center gap-2 p-2.5 text-left">
          <span className="text-lg leading-none w-7 text-center">{info.symbol}</span>
          <div className="flex-1 min-w-0">
            <span className="font-inter text-xs font-bold block truncate" style={{ color }}>{displayName}</span>
            <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>{nature}</span>
          </div>
          {language !== "ml" && <span className="font-amiri text-sm" style={{ color: "rgba(212,175,55,0.40)" }}>{PLANET_AR_ML[key]?.ar || info.name_ar}</span>}
          {isCurrent && <span className="font-inter text-[7px] uppercase px-1.5 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.15)", color: "#F5D060" }}>{txt("നിലവിലെ", "Now", "Şimdi")}</span>}
          <ChevronDown className="w-3.5 h-3.5 transition-transform flex-shrink-0" style={{ color: "rgba(212,175,55,0.40)", transform: isOpen ? "rotate(180deg)" : "none" }} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
              <div className="px-2.5 pb-2.5 space-y-2">
                {/* Names */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div><span className="font-bold" style={{ color: "rgba(255,255,255,0.40)" }}>{txt("അറബി പദം", "Arabic", "Arapça")}: </span><span className="font-amiri" style={{ color: "rgba(255,255,255,0.65)" }}>{PLANET_AR_ML[key]?.ar || info.name_ar}</span></div>
                  <div><span className="font-bold" style={{ color: "rgba(255,255,255,0.40)" }}>{txt("മലയാള അർത്ഥം", "Malayalam", "Malayalam")}: </span><span style={{ color: "rgba(255,255,255,0.65)" }}>{PLANET_AR_ML[key]?.ml || info.name_ml_equivalent}</span></div>
                  <div><span className="font-bold" style={{ color: "rgba(255,255,255,0.40)" }}>{txt("മൂലകം", "Elements", "Elementler")}: </span><span style={{ color: "rgba(255,255,255,0.65)" }}>{language === "ml" ? (elements.map(e => elementToML(e)).join(", ") || "—") : (elements.join(", ") || "—")}</span></div>
                </div>

                {/* Friendships */}
                {friends && (
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="rounded p-1.5" style={{ background: "rgba(74,222,128,0.04)" }}>
                      <p className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: "rgba(74,222,128,0.50)" }}>{txt("സുഹൃത്", "Friends", "Dostlar")}</p>
                      <p className="font-inter text-[9px]" style={{ color: "rgba(74,222,128,0.70)" }}>{friendNames.join(", ") || "—"}</p>
                    </div>
                    <div className="rounded p-1.5" style={{ background: "rgba(248,113,113,0.04)" }}>
                      <p className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: "rgba(248,113,113,0.50)" }}>{txt("ശത്രു", "Enemies", "Düşmanlar")}</p>
                      <p className="font-inter text-[9px]" style={{ color: "rgba(248,113,113,0.70)" }}>{enemyNames.join(", ") || "—"}</p>
                    </div>
                    <div className="rounded p-1.5" style={{ background: "rgba(251,191,36,0.04)" }}>
                      <p className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: "rgba(251,191,36,0.50)" }}>{txt("നിരപേക്ഷം", "Neutral", "Nötr")}</p>
                      <p className="font-inter text-[9px]" style={{ color: "rgba(251,191,36,0.70)" }}>{neutralNames.join(", ") || "—"}</p>
                    </div>
                  </div>
                )}

                {/* Strong / Weak */}
                {warnings?.length > 0 && (
                  <div>
                    <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-0.5" style={{ color: "rgba(248,113,113,0.50)" }}>{txt("ദുർബല അവസ്ഥ", "Weak Conditions", "Zayıf Durumlar")}</p>
                    {warnings.map((w, i) => <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>• {w}</p>)}
                  </div>
                )}

                {/* Good Actions */}
                {goodActions?.length > 0 && (
                  <div>
                    <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-0.5" style={{ color: "rgba(74,222,128,0.50)" }}>{txt("അനുയോജ്യം", "Recommended", "Önerilen")}</p>
                    <div className="flex flex-wrap gap-1">
                      {goodActions.map((a, i) => <span key={i} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.06)", color: "rgba(74,222,128,0.65)" }}>{a}</span>)}
                    </div>
                  </div>
                )}

                {/* Bad Actions */}
                {badActions?.length > 0 && (
                  <div>
                    <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-0.5" style={{ color: "rgba(248,113,113,0.50)" }}>{txt("ഒഴിവാക്കുക", "Avoid", "Kaçınılacak")}</p>
                    <div className="flex flex-wrap gap-1">
                      {badActions.map((a, i) => <span key={i} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.06)", color: "rgba(248,113,113,0.65)" }}>{a}</span>)}
                    </div>
                  </div>
                )}

                {/* Spiritual */}
                {spiritual?.length > 0 && (
                  <div>
                    <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-0.5" style={{ color: "rgba(129,140,248,0.50)" }}>{txt("ആത്മികം", "Spiritual Uses", "Manevi Kullanım")}</p>
                    {spiritual.map((s, i) => <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>• {s}</p>)}
                  </div>
                )}

                {/* GIH Planet Influence Characteristics */}
                {GIH_PLANET_INFLUENCE_CHARACTERISTICS[key] && (() => {
                  const infl = GIH_PLANET_INFLUENCE_CHARACTERISTICS[key];
                  return (
                    <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.15)" }}>
                      <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(212,175,55,0.60)" }}>📖 {txt("ഗ്രഹ സ്വാധീനം (GIH)", "Planet Influence (GIH)", "Gezegen Tesiri")} — p.{infl.source_page}</p>
                      <div className="space-y-1">
                        <div>
                          <p className="font-inter text-[8px] font-bold" style={{ color: "rgba(212,175,55,0.50)" }}>{txt("ശാരീരിക സവിശേഷതകൾ", "Physical Traits", "Fiziksel")}</p>
                          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{infl.physical_traits_en}</p>
                        </div>
                        <div>
                          <p className="font-inter text-[8px] font-bold" style={{ color: "rgba(212,175,55,0.50)" }}>{txt("സ്വഭാവ സവിശേഷതകൾ", "Character Traits", "Karakter")}</p>
                          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{infl.character_traits_en}</p>
                        </div>
                        {infl.moon_phase_note_en && (
                          <p className="font-inter text-[9px] italic" style={{ color: "rgba(129,140,248,0.55)" }}>🌙 {infl.moon_phase_note_en}</p>
                        )}
                        {infl.moon_independence_note_en && (
                          <p className="font-inter text-[9px] italic" style={{ color: "rgba(129,140,248,0.50)" }}>☾ {infl.moon_independence_note_en}</p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* GIH Planet Relationship (p.1419) */}
                {(() => {
                  const gihRel = GIH_PLANET_RELATIONSHIPS.find(r => r.planet_en === info.name_en);
                  if (!gihRel) return null;
                  return (
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div><span className="font-bold" style={{ color: "rgba(212,175,55,0.50)" }}>📖 GIH {txt("സുഹൃത്", "Friend", "Friend")} (p.{gihRel.source_page}): </span><span style={{ color: "rgba(74,222,128,0.65)" }}>{language === "ml" ? (PLANET_AR_ML[gihRel.friend_en?.toLowerCase()]?.ml || gihRel.friend_en) : gihRel.friend_en}</span></div>
                      <div><span className="font-bold" style={{ color: "rgba(212,175,55,0.50)" }}>📖 GIH {txt("ശത്രു", "Enemy", "Enemy")} (p.{gihRel.source_page}): </span><span style={{ color: "rgba(248,113,113,0.65)" }}>{language === "ml" ? (PLANET_AR_ML[gihRel.enemy_en?.toLowerCase()]?.ml || gihRel.enemy_en) : gihRel.enemy_en}</span></div>
                    </div>
                  );
                })()}

                {/* GIH Venus Vefk — only for Venus (p.1454) */}
                {key === "venus" && (() => {
                  const v = GIH_VENUS_VEFK;
                  return (
                    <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.15)" }}>
                      <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(212,175,55,0.60)" }}>📖 {txt("ശുക്ര വെഫ്ക് (7×7)", "Venus Vefk (7×7)", "Venus Vefk")} — p.{v.source_page}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-amiri text-lg" style={{ color: "rgba(212,175,55,0.60)" }}>{v.planet_ar}</span>
                        <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>{txt("മാന്ത്രിക സ്ഥിരാങ്കം", "Magic Constant", "Constant")}: {v.magic_constant}</span>
                      </div>
                      <div className="inline-block rounded overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.20)" }}>
                        {v.grid.map((row, ri) => (
                          <div key={ri} className="flex">
                            {row.map((cell, ci) => (
                              <span key={ci} className="font-inter text-[9px] tabular-nums w-6 h-6 flex items-center justify-center"
                                style={{
                                  background: (ri === ci || ri + ci === 6) ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.02)",
                                  color: (ri === ci || ri + ci === 6) ? "#F5D060" : "rgba(255,255,255,0.55)",
                                  borderRight: ci < 6 ? "1px solid rgba(212,175,55,0.08)" : "none",
                                  borderBottom: ri < 6 ? "1px solid rgba(212,175,55,0.08)" : "none",
                                }}>{cell}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                      <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>{v.ritual_timing_en}</p>
                    </div>
                  );
                })()}

                {/* GIH Sun Degree Table — only for Sun (pp.1420-1422) */}
                {key === "sun" && (() => {
                  const t = GIH_SUN_DEGREE_TABLE;
                  return (
                    <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.15)" }}>
                      <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(212,175,55,0.60)" }}>📖 {txt("സൂര്യ ഡിഗ്രി പട്ടിക", "Sun Degree Calculation", "Sun Degree")} — p.{t.source_page}</p>
                      <p className="font-inter text-[9px] mb-1" style={{ color: "rgba(255,255,255,0.50)" }}>{t.method}</p>
                      <div className="grid grid-cols-3 gap-0.5">
                        {t.monthly_reference.map((m, i) => (
                          <span key={i} className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.50)" }}>{m.month_en}: {m.sign_en} (+{m.degree_offset}°)</span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Source */}
                <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>📖 {normalizeDisplay(info.source)}</p>
                {friends?.source && <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>📖 {normalizeDisplay(friends.source)}</p>}

                {(kashfOps.length > 0 || kashfDir) && (
                  <ManuscriptSourcePanel
                    sources={[{
                      id: "kashf",
                      label: txt("കശ്ഫ് അൽ-ഹഖാഇഖ് (ഒമാൻ)", "Kashf al-Haqa'iq (Omani)", "Kashf al-Haqa'iq (Omani)"),
                      items: [
                        ...(kashfDir ? [{ ...kashfDir, type: "info" }] : []),
                        ...kashfOps.map(op => ({ ...op, type: "info" })),
                      ]
                    }]}
                  />
                )}

                {/* Magical period from manuscript (if available) */}
                <MagicalPeriodPanel entityType="planet" entityKey={key} />

                {/* Entity Knowledge from unified ingestion pipeline */}
                <EntityKnowledgePanel entityType="planet" entityKey={key} />

                {/* Source visuals (gemstone/metal/relationship tables) attached to this planet */}
                <AstroClockCategoryVisuals
                  categories={['gemstones', 'metals', 'planetary relationships', 'planet']}
                  entityAliases={[key]}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  })}
    </div>
  );
}