// ═══════════════════════════════════════════════════════════════
// SECTION 8 — REFERENCE LIBRARY
// ALL manuscript references grouped by book — expandable page listings
// Never repeat the same reference elsewhere — point here instead
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";
import { useAstroData } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { getAllKashfReferences } from "@/lib/astroClockManuscriptMerger";

function extractPageNum(source) {
  if (!source) return null;
  const match = source.match(/p\.?\s*(\d+)/i) || source.match(/PDF\d*\s*p\.?\s*(\d+)/i) || source.match(/(\d+)\s*-\s*(\d+)/);
  if (match) return match[2] ? `${match[1]}-${match[2]}` : match[1];
  return source;
}

function extractBookName(source) {
  if (!source) return "Unknown";
  // Extract book name before page numbers
  const match = source.match(/^(.+?)[\s,]+(?:PDF|p\.)/i);
  return match ? match[1].trim() : source.split(",")[0].trim();
}

export default function ReferenceLibrary() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  const [expanded, setExpanded] = useState(null);

  // Collect ALL references from all data sources
  const grouped = useMemo(() => {
    const map = new Map();

    const addRef = (source, category) => {
      if (!source) return;
      const book = extractBookName(source);
      const page = extractPageNum(source);
      if (!map.has(book)) map.set(book, { book, pages: new Map(), categories: new Set() });
      const entry = map.get(book);
      entry.categories.add(category);
      if (page) entry.pages.set(page, (entry.pages.get(page) || 0) + 1);
    };

    // Planet sources
    Object.entries(d.planetInfo || {}).forEach(([key, info]) => {
      addRef(info.source, `${txt("ഗ്രഹം", "Planet", "Gezegen")}: ${info.name_en}`);
    });

    // Friendship sources
    Object.entries(d.planetFriendships || {}).forEach(([key, info]) => {
      addRef(info.source, `${txt("സൌഹൃദം", "Friendship", "Dostluk")}: ${key}`);
    });

    // Weekday analysis sources
    Object.entries(d.weekdayAnalysis || {}).forEach(([key, wa]) => {
      if (wa.source) addRef(wa.source, `${txt("ദിവസം", "Day", "Gün")}: ${wa.source?.includes("50") ? "Day Rules" : "Day Rules"}`);
    });

    // Manuscript references for mansions
    addRef("Havâss'ın Derinlikleri, PDF2 p.64-74", txt("നക്ഷത്രങ്ങൾ", "Lunar Mansions", "Ay Menzilleri"));
    addRef("Havâss'ın Derinlikleri, PDF2 p.51-52", txt("സഅാത് ക്രമം", "Hour Sequence", "Saat Sırası"));
    addRef("Havâss'ın Derinlikleri, PDF2 p.53", txt("പകൽ സഅാത്", "Daytime Hours", "Gündüz Saatleri"));
    addRef("Havâss'ın Derinlikleri, PDF2 p.54", txt("രാത്രി സഅാത്", "Nighttime Hours", "Gece Saatleri"));
    addRef("Havâss'ın Derinlikleri, PDF2 p.54-60", txt("സഅാത് ഗണിതം", "Hour Calculation", "Saat Hesabı"));
    addRef("Havâss'ın Derinlikleri, Pages 20-31", txt("രാശികൾ", "Zodiac Signs", "Burçlar"));
    addRef("Kashf al-Haqa'iq, p.65", txt("ദിവസ അതിര്", "Day Boundary", "Gün Sınırı"));

    // Kashf al-Haqa'iq — full Omani manuscript references
    getAllKashfReferences().forEach(r => addRef(`Kashf al-Haqa'iq, p.${r.page}`, r.topic));

    return Array.from(map.values()).sort((a, b) => a.book.localeCompare(b.book));
  }, [d, txt]);

  const totalPages = grouped.reduce((sum, g) => sum + g.pages.size, 0);

  return (
    <div className="space-y-2">
      {/* ── Summary ── */}
      <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
        <BookOpen className="w-3.5 h-3.5" style={{ color: "rgba(212,175,55,0.50)" }} />
        <span>{grouped.length} {txt("ഗ്രന്ഥങ്ങൾ", "books", "kitap")} · {totalPages} {txt("പേജുകൾ", "page refs", "sayfa")}</span>
      </div>

      {/* ── Book Groups ── */}
      {grouped.map((g, i) => {
        const isOpen = expanded === i;
        const pages = Array.from(g.pages.entries()).sort((a, b) => {
          const aNum = parseInt(a[0].split("-")[0]);
          const bNum = parseInt(b[0].split("-")[0]);
          return aNum - bNum;
        });

        return (
          <div key={i} className="rounded-lg overflow-hidden" style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.10)",
          }}>
            <button onClick={() => setExpanded(isOpen ? null : i)} className="w-full flex items-center gap-2 p-2.5 text-left">
              <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(212,175,55,0.50)" }} />
              <div className="flex-1 min-w-0">
                <span className="font-inter text-xs font-bold block truncate" style={{ color: "rgba(255,255,255,0.80)" }}>{g.book}</span>
                <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {g.pages.size} {txt("പേജുകൾ", "pages", "sayfa")} · {g.categories.size} {txt("വിഷയങ്ങൾ", "topics", "konu")}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 transition-transform flex-shrink-0" style={{ color: "rgba(212,175,55,0.40)", transform: isOpen ? "rotate(180deg)" : "none" }} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                  <div className="px-2.5 pb-2.5 space-y-1">
                    {/* Pages */}
                    <div className="flex flex-wrap gap-1">
                      {pages.map(([page, count]) => (
                        <span key={page} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                          background: "rgba(212,175,55,0.06)", color: "rgba(212,175,55,0.60)", border: "1px solid rgba(212,175,55,0.12)",
                        }}>p.{page}{count > 1 ? ` ×${count}` : ""}</span>
                      ))}
                    </div>
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.from(g.categories).map((cat, ci) => (
                        <span key={ci} className="font-inter text-[8px] px-1.5 py-0.5 rounded" style={{
                          background: "rgba(74,222,128,0.06)", color: "rgba(74,222,128,0.50)", border: "1px solid rgba(74,222,128,0.12)",
                        }}>{cat}</span>
                      ))}
                    </div>
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