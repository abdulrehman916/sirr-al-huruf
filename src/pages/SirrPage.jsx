import { useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import SirrAccordionSection from "@/components/sirr/SirrAccordionSection";
import SirrRitualCard from "@/components/sirr/SirrRitualCard";
import { KASHF_FULL_MANTRAS } from "@/lib/manuscriptRitualGuideFullData";
import {
  KASHF_UNIVERSAL_SUPPLICATIONS,
  KASHF_ISTIKHARA_DUAS,
  KASHF_QURAN_RECITATIONS,
  KASHF_OPENING_SECRETS_DUAS,
  KASHF_TANZIL_DUAS,
  KASHF_DIVINE_NAMES,
  KASHF_TAWKEEL,
} from "@/lib/astroClockDailyMantrasData";
import {
  ALL_NEW_AZAYIM,
  TAHWIRAT,
  NAQADAT,
} from "@/lib/kashfManuscriptRegistration";

export default function SirrPage() {
  const [language, setLanguage] = useState("ml");
  const sections = useMemo(() => {
    const protectionItems = KASHF_FULL_MANTRAS.filter(
      (m) => m.type === "protection" || m.type === "conditions"
    );
    const jinnItems = KASHF_FULL_MANTRAS.filter(
      (m) => m.type === "jinn_related" || m.type === "exorcism"
    );
    const incenseMaterialsItems = KASHF_FULL_MANTRAS.filter(
      (m) => m.type === "incense" || m.type === "materials"
    );
    const timingFastingItems = KASHF_FULL_MANTRAS.filter(
      (m) => m.type === "timing" || m.type === "fasting"
    );
    const lunarItems = KASHF_FULL_MANTRAS.filter(
      (m) =>
        m.type === "lunar_mansion" ||
        m.type === "lunar_day" ||
        m.type === "nahs_days"
    );
    const rulesItems = KASHF_FULL_MANTRAS.filter(
      (m) =>
        m.type === "warnings" || m.type === "poetry" || m.type === "dua"
    );

    const azayimItems = ALL_NEW_AZAYIM.map((a) => ({
      ...a,
      type: "azimah",
      king_en: a.title_en,
    }));
    const tahwiratItems = TAHWIRAT.map((t) => ({
      ...t,
      type: "tawkeel",
      king_en: t.title_en,
    }));
    const naqadatItems = NAQADAT.map((n) => ({
      ...n,
      type: "incense",
      king_en: n.title_en,
    }));

    return [
      {
        id: "universal-prayers",
        title: "Universal Prayers",
        titleAr: "الأدعية الشاملة",
        titleMl: "സർവ പ്രാർഥനകൾ",
        accent: "#4ADE80",
        items: [
          ...KASHF_UNIVERSAL_SUPPLICATIONS,
          ...KASHF_OPENING_SECRETS_DUAS,
          ...KASHF_TANZIL_DUAS,
        ],
      },
      {
        id: "istikhara",
        title: "Istikhara & Guidance",
        titleAr: "الاستخارة",
        titleMl: "ഇസ്തിഖാറയും മാർഗ്ഗനിർദ്ദേശവും",
        accent: "#FBBF24",
        items: KASHF_ISTIKHARA_DUAS,
      },
      {
        id: "quran-verses",
        title: "Quran Verses for Rituals",
        titleAr: "آيات قرآنية",
        titleMl: "ആചാരങ്ങൾക്കുള്ള ഖുർആൻ വചനങ്ങൾ",
        accent: "#34D399",
        items: KASHF_QURAN_RECITATIONS,
      },
      {
        id: "divine-names-tawkeel",
        title: "Divine Names & Tawkeel",
        titleAr: "الأسماء والتوكيل",
        titleMl: "ദൈവ നാമങ്ങളും തവ്കീലും",
        accent: "#A78BFA",
        items: [...KASHF_DIVINE_NAMES, ...KASHF_TAWKEEL],
      },
      {
        id: "protection-amulets",
        title: "Protection & Amulets (Tahseen)",
        titleAr: "التحصينات",
        titleMl: "സംരക്ഷണവും ഹിജ്ബും (തഹ്സീൻ)",
        accent: "#60A5FA",
        items: protectionItems,
      },
      {
        id: "jinn-exorcism",
        title: "Jinn & Exorcism (Sarf)",
        titleAr: "الجن والعزائم",
        titleMl: "ജ്ഞമാരും ആഭിചാരവും (സ്വർഫ്)",
        accent: "#F87171",
        items: jinnItems,
      },
      {
        id: "spiritual-azayim",
        title: "Spiritual Azayim & Invocations",
        titleAr: "العزائم والدعوات",
        titleMl: "ആത്മ കൃത്യങ്ങളും ആഹ്വാനങ്ങളും",
        accent: "#D4AF37",
        items: azayimItems,
      },
      {
        id: "return-formulas",
        title: "Return Formulas (Tahwirat)",
        titleAr: "التحويرات",
        titleMl: "തിരികെ കൊണ്ടുവരൽ (തഹ്വീറാത്)",
        accent: "#818CF8",
        items: tahwiratItems,
      },
      {
        id: "herbal-incense",
        title: "Herbal Incense (Naqadat)",
        titleAr: "النقادات",
        titleMl: "ധൂപ മിശ്രിതങ്ങൾ (നഖാദാത്)",
        accent: "#34D399",
        items: naqadatItems,
      },
      {
        id: "incense-materials",
        title: "Incense & Materials",
        titleAr: "البخور والمواد",
        titleMl: "ധൂപവും സാധനങ്ങളും",
        accent: "#FBBF24",
        items: incenseMaterialsItems,
      },
      {
        id: "timing-fasting",
        title: "Timing & Fasting",
        titleAr: "الأوقات والصيام",
        titleMl: "സമയവും വ്രതവും",
        accent: "#F472B6",
        items: timingFastingItems,
      },
      {
        id: "lunar-mansions-days",
        title: "Lunar Mansions & Days",
        titleAr: "المنازل والأيام",
        titleMl: "നക്ഷത്രങ്ങളും ദിവസങ്ങളും",
        accent: "#D4AF37",
        items: lunarItems,
      },
      {
        id: "rules-warnings",
        title: "Rules, Conditions & Warnings",
        titleAr: "الشروط والتحذيرات",
        titleMl: "നിയമങ്ങളും വ്യവസ്ഥകളും മുന്നറിയിപ്പുകളും",
        accent: "#F87171",
        items: rulesItems,
      },
    ];
  }, []);

  const totalEntries = sections.reduce((sum, s) => sum + s.items.length, 0);

  const subtitleCls = language === "ml" ? "font-malayalam" : "font-inter";
  const subtitleText =
    language === "ml"
      ? "ഗ്രന്ഥ വിജ്ഞാന സമാഹാരം — കശ്ഫ് അൽ-ഹഖാഇഖ് മൂലത്തിൽ നിന്ന്"
      : "Manuscript Knowledge Collection — from Kashf al-Haqa'iq";
  const entriesLabel = language === "ml" ? "രേഖകൾ" : "entries";
  const categoriesLabel = language === "ml" ? "വിഭാഗങ്ങൾ" : "categories";
  const authorityText =
    language === "ml"
      ? "⚖️ മൂല ഗ്രന്ഥം ആണ് പ്രാഥമിക അധികാരം. എല്ലാ അറബി പാഠവും ഗ്രന്ഥത്തിൽ നിന്ന് നേരിട്ട് പകർത്തിയതാണ്."
      : "⚖️ The original manuscript is the primary authority. All Arabic text is copied directly from the source.";

  return (
    <PageLayout>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-3">
        {/* Header */}
        <div className="text-center pt-2 pb-2">
          <h1
            className="font-amiri text-3xl font-bold"
            style={{ color: "#D4AF37", direction: "rtl" }}
          >
            سرّ
          </h1>
          <p
            className="font-inter text-sm font-bold tracking-wider uppercase mt-1"
            style={{ color: "#D4AF37" }}
          >
            SIRR
          </p>
          <p
            className={`${subtitleCls} text-xs mt-1`}
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {subtitleText}
          </p>
          <p
            className="font-inter text-[10px] mt-1"
            style={{ color: "rgba(212,175,55,0.50)" }}
          >
            {totalEntries} {entriesLabel} · {sections.length} {categoriesLabel}
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          <button
            onClick={() => setLanguage("ml")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === "ml" ? "btn-gold" : ""
            }`}
            style={
              language !== "ml"
                ? {
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.50)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }
                : {}
            }
          >
            🇲🇱 മലയാളം
          </button>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>
            |
          </span>
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === "en" ? "btn-gold" : ""
            }`}
            style={
              language !== "en"
                ? {
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.50)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }
                : {}
            }
          >
            🇬🇧 English
          </button>
        </div>

        {/* Manuscript Authority Notice */}
        <div
          className="rounded-lg p-2.5"
          style={{
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.10)",
          }}
        >
          <p
            className={`${subtitleCls} text-[10px] leading-relaxed text-center`}
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {authorityText}
          </p>
        </div>

        {/* Accordion Sections */}
        {sections.map((section, i) => (
          <SirrAccordionSection
            key={section.id}
            title={section.title}
            titleAr={section.titleAr}
            titleMl={section.titleMl}
            count={section.items.length}
            accent={section.accent}
            defaultOpen={i === 0}
            language={language}
          >
            {section.items.map((item, j) => (
              <SirrRitualCard
                key={item.id || j}
                item={item}
                accent={section.accent}
                language={language}
              />
            ))}
          </SirrAccordionSection>
        ))}
      </div>
    </PageLayout>
  );
}