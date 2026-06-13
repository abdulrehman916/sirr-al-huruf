// ── KASAM DATABASE (Section 4 only) ──────────────────────────────────────────
// SOURCE AUTHORITY: PDF manuscripts only.
// NO AI-generated text. NO web content. NO reconstructed text.
// If PDF source is incomplete: mark entry as PDF_INCOMPLETE.
// Malayalam translations must never alter the Arabic source text.
// ─────────────────────────────────────────────────────────────────────────────

// Entry schema:
// {
//   id: string,
//   arabic: string,           — exact Arabic from PDF
//   malayalam: string,        — Malayalam meaning/translation
//   source: string,           — PDF page reference
//   notes: string,            — optional notes
//   status: "verified" | "pdf_incomplete" | "pending"
// }

export const KASAM_CATEGORIES = [
  {
    id: "muhabbet",
    label: "Muhabbet Kasam",
    arabic: "قسم المحبة",
    malayalamLabel: "മുഹബ്ബത്ത് ഖസം",
    icon: "❤",
    description: "Love & Affection",
    entries: [
      {
        id: "muhabbet_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "adavet",
    label: "Adavet Kasam",
    arabic: "قسم العداوة",
    malayalamLabel: "അദാവത്ത് ഖസം",
    icon: "⚔",
    description: "Separation & Enmity",
    entries: [
      {
        id: "adavet_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "celb",
    label: "Celb Kasam",
    arabic: "قسم الجلب",
    malayalamLabel: "ജൽബ് ഖസം",
    icon: "✦",
    description: "Attraction",
    entries: [
      {
        id: "celb_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "sihir",
    label: "Sihir Bozma Kasam",
    arabic: "قسم كسر السحر",
    malayalamLabel: "സിഹിർ ബോസ്മ ഖസം",
    icon: "🔒",
    description: "Breaking Magic",
    entries: [
      {
        id: "sihir_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "bagli",
    label: "Bagli Cozme Kasam",
    arabic: "قسم حل الربط",
    malayalamLabel: "ബാഗ്‌ലി ചോസ്‌മ ഖസം",
    icon: "🔗",
    description: "Removing Bindings",
    entries: [
      {
        id: "bagli_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "uyku",
    label: "Uyku Kasam",
    arabic: "قسم النوم",
    malayalamLabel: "ഉയ്‌കു ഖസം",
    icon: "☽",
    description: "Sleep",
    entries: [
      {
        id: "uyku_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "hastalandirma",
    label: "Hastalandirma Kasam",
    arabic: "قسم التمريض",
    malayalamLabel: "ഹസ്‌ത്തലൻദ്‌ദർമ ഖസം",
    icon: "⚕",
    description: "Hastalandirma",
    entries: [
      {
        id: "hastalandirma_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "erkeklik",
    label: "Erkeklik Baglama Kasam",
    arabic: "قسم ربط الرجولة",
    malayalamLabel: "എർകെക്‌ലിക്ക് ബാഗ്‌ലമ ഖസം",
    icon: "⚡",
    description: "Erkeklik Baglama",
    entries: [
      {
        id: "erkeklik_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
  {
    id: "general",
    label: "General Purpose Kasam",
    arabic: "قسم عام",
    malayalamLabel: "പൊതു ഖസം",
    icon: "◎",
    description: "General Purpose",
    entries: [
      {
        id: "general_1",
        arabic: "",
        malayalam: "",
        source: "PDF SOURCE INCOMPLETE — Awaiting verified manuscript page",
        notes: "",
        status: "pending",
      },
    ],
  },
];