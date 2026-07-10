// ═══════════════════════════════════════════════════════════════
// ASTRO CLOCK PAGE — PROFESSIONAL KNOWLEDGE DASHBOARD
// 8 Sections, each with unique responsibility — zero duplication
// UI-only redesign: no calculation/engine changes
// ═══════════════════════════════════════════════════════════════
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { AstroClockLanguageProvider, useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { useAuth } from "@/lib/AuthContext";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import DashboardSection from "@/components/astroclock/dashboard/DashboardSection";
import AstroClockErrorBoundary from "@/components/astroclock/AstroClockErrorBoundary";

// Lazy-load admin screenshot uploader
const AstroScreenshotUploader = lazy(() => import("@/components/astroclock/AstroScreenshotUploader"));

// Lazy-load all sections — only renders when expanded
const TodayDashboard = lazy(() => import("@/components/astroclock/dashboard/TodayDashboard"));
const DailyMantras = lazy(() => import("@/components/astroclock/dashboard/DailyMantras"));
const SmartSearch = lazy(() => import("@/components/astroclock/dashboard/SmartSearch"));
const SaatGrid = lazy(() => import("@/components/astroclock/dashboard/SaatGrid"));
const MoonCenter = lazy(() => import("@/components/astroclock/dashboard/MoonCenter"));
const MoonZodiac = lazy(() => import("@/components/astroclock/dashboard/MoonZodiac"));
const MansionsReference = lazy(() => import("@/components/astroclock/dashboard/MansionsReference"));
const PlanetEncyclopedia = lazy(() => import("@/components/astroclock/dashboard/PlanetEncyclopedia"));
const ReferenceLibrary = lazy(() => import("@/components/astroclock/dashboard/ReferenceLibrary"));

function LangSelector() {
  const { language, setLanguage, txt } = useAstroClockLanguage();
  const langs = [
    { key: "ml", label: "മലയാളം" },
    { key: "en", label: "English" },
    { key: "ar", label: "العربية" },
  ];
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.30)" }}>
      {langs.map(l => (
        <button key={l.key} onClick={() => setLanguage(l.key)}
          className="px-3 py-2 font-inter text-[10px] font-bold uppercase tracking-wider transition-colors"
          style={{
            background: language === l.key ? "rgba(212,175,55,0.15)" : "transparent",
            color: language === l.key ? "#F5D060" : "rgba(255,255,255,0.40)",
          }}>{l.label}</button>
      ))}
    </div>
  );
}

function CustomDatePicker() {
  const { customDate, setCustomDate, clearCustomDate, txt } = useAstroClockLanguage();
  return (
    <div className="flex items-center gap-1.5">
      <input type="date"
        value={customDate ? customDate.toISOString().split("T")[0] : ""}
        min="2020-01-01" max="2030-12-31"
        onChange={(e) => {
          if (e.target.value) setCustomDate(new Date(e.target.value + "T12:00:00"));
          else clearCustomDate();
        }}
        className="px-2 py-2 rounded-xl font-inter text-[10px] font-bold uppercase tracking-wider cursor-pointer"
        style={{
          background: customDate ? "rgba(212,175,55,0.15)" : "transparent",
          color: customDate ? "#F5D060" : "rgba(255,255,255,0.40)",
          border: "1px solid rgba(212,175,55,0.30)",
          colorScheme: "dark",
        }}
      />
      {customDate && (
        <button onClick={clearCustomDate}
          className="px-2 py-2 rounded-xl font-inter text-[10px] font-bold"
          style={{ background: "rgba(248,113,113,0.10)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
          ✕
        </button>
      )}
    </div>
  );
}

function AstroClockContent() {
  const { txt } = useAstroClockLanguage();
  const { role } = useAuth();
  const isAdmin = role === 'admin' || role === 'owner';

  return (
    <PageLayout>
      <div className="space-y-3 pb-8 max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <PageTitle arabic="الساعة الفلكية" latin="Astro Clock" subtitle={txt("പാരമ്പര്യ സമയ വ്യവസ്ഥ", "Traditional Timing System", "Geleneksel Zaman Sistemi")} icon="🕰" />
          <div className="flex items-center gap-2">
            <Link to="/manuscript-library" className="px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ background: "rgba(212,175,55,0.10)", color: "#F5D060", borderColor: "rgba(212,175,55,0.30)" }}>
              📚 {txt("ഗ്രന്ഥശേഖരം", "Library", "Kütüphane")}
            </Link>
            <LangSelector />
            <CustomDatePicker />
          </div>
        </div>

        {/* ── 8 Sections — each unique, no duplication ── */}
        <AstroClockErrorBoundary label="Today Dashboard">
          <DashboardSection icon="📅" title={txt("ഇന്നത്തെ ഡാഷ്ബോർഡ്", "Today's Dashboard", "Bugün Paneli")}
            subtitle={txt("ദിവസം, സഅാത്, കവ്കബ്, പ്രവൃത്തികൾ, മുന്നറിയിപ്പുകൾ", "Day, Saat, Kawkab, Activities, Warnings", "Gün, Saat, Kavkeb, Eylemler, Uyarılar")}
            defaultOpen badge="●">
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <TodayDashboard />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        {/* ── Section 2 — Daily Mantras & Spiritual Recitations ── */}
        <AstroClockErrorBoundary label="Daily Mantras">
          <DashboardSection icon="📿" title={txt("ദൈനംദിന മന്ത്രങ്ങൾ", "Daily Mantras", "Günlük Mantralar")}
            subtitle={txt("ഇന്നത്തെ ആത്മിക പാരായണങ്ങൾ", "Today's Spiritual Recitations", "Bugünün Ruani Zikirleri")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <DailyMantras />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        <AstroClockErrorBoundary label="Smart Search">
          <DashboardSection icon="🔍" title={txt("സ്മാർട്ട് തിരച്ചിൽ", "Smart Search", "Akıllı Arama")}
            subtitle={txt("ഉദ്ദേശം → മികച്ച സഅാത്", "Purpose → Best Saat", "Amaç → En İyi Saat")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <SmartSearch />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        <AstroClockErrorBoundary label="Saat Grid">
          <DashboardSection icon="⏰" title={txt("ഇന്നത്തെ 24 സഅാത്", "Today's 24 Saat", "Bugünün 24 Saati")}
            subtitle={txt("12 പകൽ + 12 രാത്രി ഗ്രഹ മണിക്കൂറുകൾ", "12 Day + 12 Night Planetary Hours", "12 Gündüz + 12 Gece Gezegen Saati")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <SaatGrid />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        <AstroClockErrorBoundary label="Moon Center">
          <DashboardSection icon="🌙" title={txt("ചന്ദ്ര കേന്ദ്രം", "Moon Center", "Ay Merkezi")}
            subtitle={txt("രാശി, ഘട്ടം, നക്ഷത്രം, ശക്തി, സ്വഭാവം", "Zodiac, Phase, Mansion, Strength, Nature", "Burç, Evre, Menzil, Güç, Doğa")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <MoonCenter />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        <AstroClockErrorBoundary label="Moon Zodiac">
          <DashboardSection icon="♈" title={txt("ചന്ദ്രന്റെ രാശി", "Moon in Zodiac", "Burçta Ay")}
            subtitle={txt("നിലവിലെ രാശി + അടുത്ത മാറ്റം", "Current Zodiac + Next Transition", "Mevcut Burç + Sonraki Geçiş")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <MoonZodiac />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        <AstroClockErrorBoundary label="Mansions">
          <DashboardSection icon="⭐" title={txt("28 ചാന്ദ്ര നക്ഷത്രങ്ങൾ", "28 Lunar Mansions", "28 Ay Menzili")}
            subtitle={txt("മന്സിൽ / നക്ഷത്ര റഫറൻസ്", "Manzil / Nakshatra Reference", "Menzil / Nakşatra Referansı")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <MansionsReference />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        <AstroClockErrorBoundary label="Planets">
          <DashboardSection icon="🪐" title={txt("ഗ്രഹ വിജ്ഞാനകോശം", "Planet Encyclopedia", "Gezegen Ansiklopedisi")}
            subtitle={txt("7 ഗ്രഹ ഭരണികൾ", "7 Planetary Rulers", "7 Gezegen Hükümdarı")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <PlanetEncyclopedia />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        <AstroClockErrorBoundary label="References">
          <DashboardSection icon="📖" title={txt("റഫറൻസ് ലൈബ്രറി", "Reference Library", "Kaynak Kitaplığı")}
            subtitle={txt("ഗ്രന്ഥങ്ങളിലെ എല്ലാ പേജുകളും", "All Manuscript Page References", "Tüm El Yazması Sayfa Referansları")}>
            <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
              <ReferenceLibrary />
            </Suspense>
          </DashboardSection>
        </AstroClockErrorBoundary>

        {/* ── Admin-only: Screenshot Analysis & Merge ── */}
        {isAdmin && (
          <AstroClockErrorBoundary label="Screenshot Uploader">
            <DashboardSection icon="📷" title={txt("സ്ക്രീൻഷോട്ട് വിശകലനം", "Screenshot Analysis", "تحليل لقطة الشاشة")}
              subtitle={txt("ഗ്രന്ഥ സ്ക്രീൻഷോട്ട് → ദിവസം+സഅാത്+കവ്കബ് വിജ്ഞാനം", "Manuscript screenshot → Day+Saat+Kawkab knowledge", "لقطة المخطوطة → معرفة اليوم+الساعة+الكوكب")}>
              <Suspense fallback={<div className="py-8 text-center font-inter text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>...</div>}>
                <AstroScreenshotUploader />
              </Suspense>
            </DashboardSection>
          </AstroClockErrorBoundary>
        )}
      </div>
    </PageLayout>
  );
}

export default function AstroClockPage() {
  return (
    <AstroClockLanguageProvider>
      <AstroClockContent />
    </AstroClockLanguageProvider>
  );
}