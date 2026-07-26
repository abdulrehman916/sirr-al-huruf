// ═══════════════════════════════════════════════════════════════
// SIRR PAGE — EMPTY PLACEHOLDER
// ═══════════════════════════════════════════════════════════════
// All customer-facing Sirr UI has been migrated into Holy Names →
// Section D (see SirrManuscriptLibrary). This route is retained as
// an empty placeholder with no customer-facing content. All data
// (SirrManuscriptBook / SirrManuscriptEntry) is unchanged and is
// now surfaced from Section D.
// ═══════════════════════════════════════════════════════════════
import PageLayout from "@/components/PageLayout";

export default function SirrPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <h1 className="font-amiri text-3xl text-center" style={{ color: "#D4AF37" }}>السرّ</h1>

        {/* ── Input Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "طالب" },
            { title: "مطلوب" },
            { title: "طلب" },
          ].map((c) => (
            <div key={c.title} className="card-dark p-4">
              <h2 className="font-amiri text-2xl text-center mb-3" style={{ color: "#D4AF37" }}>{c.title}</h2>
              <input
                type="text"
                className="w-full px-3 py-2.5 rounded-lg text-center font-amiri text-lg outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,175,55,0.30)",
                  color: "#fff",
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Calculate Button ── */}
        <div className="flex justify-center">
          <button
            className="btn-gold px-12 py-3.5 rounded-xl font-inter font-bold text-base"
          >
            Calculate
          </button>
        </div>

        {/* ── Empty Placeholder Sections ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "طالب Abjad",
            "مطلوب Abjad",
            "طلب Abjad",
            "كر",
            "دفر",
            "كر Jafr Table",
            "دفر Jafr Table",
            "First Jafr Total",
            "Second Jafr Total",
            "Kaser",
            "Ghutm",
            "Final Result",
          ].map((label) => (
            <div key={label} className="card-dark p-5">
              <h3 className="font-inter text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(212,175,55,0.70)" }}>
                {label}
              </h3>
              <div className="min-h-[6rem]" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}