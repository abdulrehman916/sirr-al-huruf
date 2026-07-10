// ═══════════════════════════════════════════════════════════════
// GIH MANUSCRIPT KNOWLEDGE — All stored GIH tables displayed
// Zodiac Properties, Element/Planet Relationships, 12 Houses,
// Sun Degree Table, Ritual Incense, Venus Vefk
// Source: Gizli İlimler Hazinesi — 7th Book (Mustafalolu, pp.1409-1507)
// ═══════════════════════════════════════════════════════════════
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { SubCollapse } from "./DashboardSection";
import {
  GIH_ZODIAC_PROPERTIES, GIH_ELEMENT_RELATIONSHIPS, GIH_PLANET_RELATIONSHIPS,
  GIH_TWELVE_HOUSES, GIH_SUN_DEGREE_TABLE, GIH_RITUAL_INCENSE, GIH_VENUS_VEFK,
  GIH_SOURCE,
} from "@/lib/gizliIlimlerHazinesiZodiacData";

const G = "rgba(212,175,55,0.50)";
const SRC = "📖 GIH pp.";

function PropertyInfo({ title, signs, note, page }) {
  return (
    <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
      <p className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>{title}</p>
      <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>{signs}</p>
      {note && <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>{note}</p>}
      <p className="font-inter text-[8px] mt-0.5" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{page}</p>
    </div>
  );
}

function ZodiacProperties() {
  const { txt } = useAstroClockLanguage();
  const p = GIH_ZODIAC_PROPERTIES;
  return (
    <div className="space-y-1.5">
      <PropertyInfo title={p.munkalibe_signs.name_en} signs={p.munkalibe_signs.signs.join(", ")} note={p.munkalibe_signs.reason} page={p.munkalibe_signs.source_page} />
      <PropertyInfo title={p.sabite_signs.name_en} signs={p.sabite_signs.signs.join(", ")} page={p.sabite_signs.source_page} />
      <PropertyInfo title={p.mumtezic_signs.name_en} signs={p.mumtezic_signs.signs.join(", ")} page={p.mumtezic_signs.source_page} />
      <PropertyInfo title={`${p.nar_teslisler.name_en} (${p.nar_teslisler.nature})`} signs={p.nar_teslisler.signs.join(", ")} page={p.nar_teslisler.source_page} />
      <PropertyInfo title={`${p.turab_teslisler.name_en} (${p.turab_teslisler.nature})`} signs={p.turab_teslisler.signs.join(", ")} page={p.turab_teslisler.source_page} />
      <PropertyInfo title={`${p.heva_teslisler.name_en} (${p.heva_teslisler.nature})`} signs={p.heva_teslisler.signs.join(", ")} page={p.heva_teslisler.source_page} />
      <PropertyInfo title={`${p.maiyye_teslisler.name_en} (${p.maiyye_teslisler.nature})`} signs={p.maiyye_teslisler.signs.join(", ")} page={p.maiyye_teslisler.source_page} />
      <PropertyInfo title={p.masculine_signs.name_en} signs={p.masculine_signs.signs.join(", ")} page={p.masculine_signs.source_page} />
      <PropertyInfo title={p.feminine_signs.name_en} signs={p.feminine_signs.signs.join(", ")} page={p.feminine_signs.source_page} />
      <PropertyInfo title={p.northern_signs.name_en} signs={p.northern_signs.signs.join(", ")} note={p.northern_signs.note} page={p.northern_signs.source_page} />
      <PropertyInfo title={p.southern_signs.name_en} signs={p.southern_signs.signs.join(", ")} note={p.southern_signs.note} page={p.southern_signs.source_page} />
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
          <p className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>{p.planet_order.description}</p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>{p.planet_order.order.join(" → ")}</p>
          <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{p.planet_order.source_page}</p>
        </div>
        <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
          <p className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>{p.horizon_minutes.description}</p>
          <p className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.40)" }}>{p.horizon_minutes.note}</p>
          <div className="grid grid-cols-3 gap-0.5 mt-1">
            {Object.entries(p.horizon_minutes.durations).map(([sign, min]) => (
              <span key={sign} className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.50)" }}>{sign}: {min}m</span>
            ))}
          </div>
          <p className="font-inter text-[8px] mt-0.5" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{p.horizon_minutes.source_page}</p>
        </div>
      </div>
    </div>
  );
}

function Relationships() {
  const { txt } = useAstroClockLanguage();
  const el = GIH_ELEMENT_RELATIONSHIPS;
  return (
    <div className="space-y-2">
      {/* Element Relationships */}
      <div className="grid grid-cols-2 gap-1.5">
        {["fire", "earth", "air", "water"].map(key => (
          <div key={key} className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
            <p className="font-inter text-[10px] font-bold capitalize" style={{ color: "#F5D060" }}>{key}</p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(74,222,128,0.65)" }}>Friend: {el[key].friend}</p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(248,113,113,0.65)" }}>Enemy: {el[key].enemy}</p>
            <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{el[key].source_page}</p>
          </div>
        ))}
      </div>
      <p className="font-inter text-[9px] italic" style={{ color: "rgba(255,255,255,0.40)" }}>{el.note}</p>

      {/* Planet Relationships */}
      <div className="space-y-1">
        <p className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: G }}>{txt("ഗ്രഹ ബന്ധങ്ങൾ", "Planet Relationships", "Planet Relations")} — p.1419</p>
        {GIH_PLANET_RELATIONSHIPS.map((r, i) => (
          <div key={i} className="flex items-center gap-2 rounded p-1.5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <span className="font-inter text-[10px] font-bold w-20" style={{ color: "#F5D060" }}>{r.planet_en}</span>
            <span className="font-inter text-[9px]" style={{ color: "rgba(74,222,128,0.65)" }}>Friend: {r.friend_en}</span>
            <span className="font-inter text-[9px]" style={{ color: "rgba(248,113,113,0.65)" }}>Enemy: {r.enemy_en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HousesTable() {
  return (
    <div className="space-y-1">
      {GIH_TWELVE_HOUSES.houses.map(h => (
        <div key={h.hane} className="flex items-center gap-2 rounded p-1.5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <span className="font-inter text-[10px] font-bold w-6 text-center" style={{ color: "#F5D060" }}>{h.hane}</span>
          <span className="font-inter text-[9px] flex-1" style={{ color: "rgba(255,255,255,0.65)" }}>{h.title_tr}</span>
          <span className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.55)" }}>{h.sign_en} · {h.planet_en}</span>
        </div>
      ))}
      <p className="font-inter text-[9px] italic mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>{GIH_TWELVE_HOUSES.note}</p>
      <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{GIH_TWELVE_HOUSES.source_page}</p>
    </div>
  );
}

function SunDegreeTable() {
  const t = GIH_SUN_DEGREE_TABLE;
  return (
    <div className="space-y-2">
      <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{t.description}</p>
      <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>{t.method}</p>
      <div className="space-y-0.5">
        {t.monthly_reference.map((m, i) => (
          <div key={i} className="flex items-center gap-2 rounded p-1" style={{ background: "rgba(255,255,255,0.02)" }}>
            <span className="font-inter text-[10px] font-bold w-20" style={{ color: "#F5D060" }}>{m.month_en}</span>
            <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>Offset: {m.degree_offset}°</span>
            <span className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.55)" }}>{m.sign_en}</span>
          </div>
        ))}
      </div>
      <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{t.source_page}</p>
    </div>
  );
}

function RitualIncense() {
  const r = GIH_RITUAL_INCENSE;
  const rituals = [
    { key: "aries_ritual", label: "Aries" },
    { key: "taurus_ritual", label: "Taurus" },
    { key: "gemini_ritual", label: "Gemini" },
    { key: "cancer_ritual", label: "Cancer" },
  ];
  return (
    <div className="space-y-2">
      <div className="rounded-lg p-2" style={{ background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.12)" }}>
        <p className="font-inter text-[10px] font-bold" style={{ color: "rgba(129,140,248,0.70)" }}>Universal Protection Ritual</p>
        <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>{r.universal_protection_ritual.method_en}</p>
      </div>
      {rituals.map(({ key, label }) => {
        const ritual = r.universal_protection_ritual[key];
        if (!ritual) return null;
        return (
          <div key={key} className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
            <p className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>{label}</p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>Incense: {ritual.incense.join(", ")}</p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>Timing: {ritual.timing}</p>
            <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{ritual.source_page}</p>
          </div>
        );
      })}
    </div>
  );
}

function VenusVefk() {
  const v = GIH_VENUS_VEFK;
  return (
    <div className="space-y-2">
      <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-amiri text-lg" style={{ color: "rgba(212,175,55,0.60)" }}>{v.planet_ar}</span>
          <span className="font-inter text-[10px] font-bold" style={{ color: "#F5D060" }}>{v.planet_en} Vefk ({v.grid_size})</span>
          <span className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.40)" }}>Constant: {v.magic_constant}</span>
        </div>
        {/* 7×7 grid */}
        <div className="inline-block rounded overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.20)" }}>
          {v.grid.map((row, ri) => (
            <div key={ri} className="flex">
              {row.map((cell, ci) => (
                <span key={ci} className="font-inter text-[9px] tabular-nums w-7 h-7 flex items-center justify-center"
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
        <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Construction: {v.construction_rule}</p>
        <p className="font-inter text-[9px]" style={{ color: "rgba(129,140,248,0.60)" }}>Timing: {v.timing_rule}</p>
        <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{v.ritual_timing_en}</p>
        <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.35)" }}>{SRC}{v.source_page}</p>
      </div>
    </div>
  );
}

export default function GihManuscriptKnowledge() {
  const { txt } = useAstroClockLanguage();
  return (
    <div className="space-y-2">
      <p className="font-inter text-[9px] text-center pb-1" style={{ color: "rgba(212,175,55,0.40)" }}>
        📖 {GIH_SOURCE.book_title} — {GIH_SOURCE.page_range}
      </p>
      <SubCollapse title={txt("രാശി വർഗ്ഗീകരണം", "Zodiac Property Classifications", "Zodiac Properties")}>
        <ZodiacProperties />
      </SubCollapse>
      <SubCollapse title={txt("മൂലകങ്ങളുടെയും ഗ്രഹങ്ങളുടെയും ബന്ധങ്ങൾ", "Element & Planet Relationships", "Relationships")}>
        <Relationships />
      </SubCollapse>
      <SubCollapse title={txt("12 ഭവനങ്ങൾ", "12 Houses", "12 Houses")}>
        <HousesTable />
      </SubCollapse>
      <SubCollapse title={txt("സൂര്യ ഡിഗ്രി പട്ടിക", "Sun Degree Calculation", "Sun Degree")}>
        <SunDegreeTable />
      </SubCollapse>
      <SubCollapse title={txt("ആചാര തൂപം", "Ritual Incense", "Ritual Incense")}>
        <RitualIncense />
      </SubCollapse>
      <SubCollapse title={txt("ശുക്ര വെഫ്ക്", "Venus Vefk (7×7)", "Venus Vefk")}>
        <VenusVefk />
      </SubCollapse>
    </div>
  );
}