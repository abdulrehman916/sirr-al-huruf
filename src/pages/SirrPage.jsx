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
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="font-amiri text-3xl" style={{ color: "#D4AF37" }}>السرّ</h1>
        <p className="font-inter text-[10px] uppercase tracking-[0.3em] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          Sirr · content moved to Holy Names → Section D
        </p>
      </div>
    </PageLayout>
  );
}