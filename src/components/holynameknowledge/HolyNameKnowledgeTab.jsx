import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, BookOpen, Sparkles, Loader2, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { HOLY_NAME_SEED } from "@/lib/holyNameKnowledgeSeed";
import HolyNameImportPanel from "./HolyNameImportPanel";

const P = {
  border: "rgba(212,175,55,0.30)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(245,208,96,0.55)",
  faint: "rgba(212,175,55,0.14)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const SECTION_LABELS = {
  arabic_name: "Arabic Name",
  malayalam_meaning: "Malayalam Meaning",
  description: "Description",
  benefits: "Benefits",
  usage: "Usage",
  method: "Method",
  warnings: "Warnings",
  references: "References",
  notes: "Notes",
  other: "From PDF",
};

const LANG_LABELS = { ar: "Arabic", ml: "Malayalam", en: "English", mixed: "Arabic + Malayalam" };

export default function HolyNameKnowledgeTab() {
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "owner";
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [sectionsCache, setSectionsCache] = useState({});
  const [seeding, setSeeding] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await base44.entities.HolyNameKnowledge.list("-order_index", 500);
      setNames(all || []);
    } catch {
      setNames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, reloadKey]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await base44.functions.invoke("seedHolyNameKnowledge", { names: HOLY_NAME_SEED });
      await load();
    } catch (e) {
      // ignore — UI stays usable
    } finally {
      setSeeding(false);
    }
  };

  const toggle = async (name) => {
    const id = name.name_id;
    if (openId === id) { setOpenId(null); return; }
    setOpenId(id);
    if (!sectionsCache[id]) {
      try {
        const secs = await base44.entities.HolyNameImportedSection.filter({ name_id: id }, "source_pdf_page", 200);
        setSectionsCache((s) => ({ ...s, [id]: secs || [] }));
      } catch {
        setSectionsCache((s) => ({ ...s, [id]: [] }));
      }
    }
  };

  const filtered = names.filter((n) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      (n.arabic_name || "").includes(query.trim()) ||
      (n.transliteration || "").toLowerCase().includes(q) ||
      (n.meaning_en || "").toLowerCase().includes(q)
    );
  });

  const totalSections = names.reduce((s, n) => s + (n.section_count || 0), 0);
  const enrichedCount = names.filter((n) => (n.section_count || 0) > 0).length;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: P.dim }} />
      </div>
    );
  }

  // Empty database → admin seed prompt
  if (names.length === 0) {
    return (
      <div className="space-y-4">
        {isAdmin && <HolyNameImportPanel onImported={() => setReloadKey((k) => k + 1)} />}
        <div className="rounded-2xl border p-8 text-center space-y-4" style={{ background: P.bg, borderColor: P.border }}>
          <BookOpen className="w-10 h-10 mx-auto" style={{ color: P.dim }} />
          <div>
            <p className="font-amiri text-lg" style={{ color: P.text }}>قاعدة بيانات الأسماء المقدسة</p>
            <p className="font-inter text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              The Holy Names Knowledge database is empty.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border font-inter text-[11px] uppercase tracking-widest font-bold"
              style={{ background: P.bgHi, borderColor: P.borderHi, color: P.text, opacity: seeding ? 0.6 : 1 }}
            >
              {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {seeding ? "Initializing…" : "Initialize 99 Names"}
            </button>
          )}
          <p className="font-inter text-[9px] leading-relaxed max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
            Initializes the database with the 99 Names of Allah as matching keys. All descriptive content (Malayalam meaning, benefits, usage, method, warnings) is then added ONLY from PDFs you import above — never AI-generated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isAdmin && <HolyNameImportPanel onImported={() => { setSectionsCache({}); setReloadKey((k) => k + 1); }} />}

      {/* Search + stats */}
      <div className="flex items-center gap-2 rounded-2xl border px-3 py-2.5" style={{ background: P.bg, borderColor: P.border }}>
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: P.dim }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Holy Names…"
          className="flex-1 bg-transparent outline-none font-inter text-sm"
          style={{ color: "rgba(255,255,255,0.85)" }}
          dir="auto"
          autoComplete="off"
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)" }}>
          {filtered.length} of {names.length} names
        </p>
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: P.dim }}>
          {enrichedCount} enriched • {totalSections} sections
        </p>
      </div>

      {/* Names list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((name, i) => {
            const isOpen = openId === name.name_id;
            const secs = sectionsCache[name.name_id] || [];
            const hasSections = (name.section_count || 0) > 0;
            return (
              <motion.div
                key={name.name_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.25), duration: 0.2 }}
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: isOpen ? P.borderHi : P.border,
                  background: isOpen ? "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)" : P.bg,
                  boxShadow: isOpen ? `0 0 24px rgba(212,175,55,0.12)` : "none",
                }}
              >
                <button
                  onClick={() => toggle(name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.28)" }}>#{name.order_index}</span>
                      <span className="font-amiri text-[1.6rem] font-bold" style={{ color: P.text, textShadow: "0 0 12px rgba(212,175,55,0.20)" }} dir="rtl">
                        {name.arabic_name}
                      </span>
                      {hasSections && (
                        <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border" style={{ color: P.dim, borderColor: P.border, background: "rgba(245,208,96,0.08)" }}>
                          {name.section_count} PDF
                        </span>
                      )}
                    </div>
                    <p className="font-inter text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.82)" }}>
                      {name.transliteration}
                    </p>
                    {name.meaning_en && (
                      <p className="font-inter text-[11px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{name.meaning_en}</p>
                    )}
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0" style={{ color: isOpen ? P.text : P.dim }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-4 pb-4 pt-1 space-y-2" style={{ borderTop: "1px solid " + P.faint }}>
                        {secs.length === 0 ? (
                          <p className="font-inter text-[10px] py-4 text-center" style={{ color: "rgba(255,255,255,0.30)" }}>
                            No PDF information imported for this name yet.
                          </p>
                        ) : (
                          secs.map((s) => (
                            <div key={s.section_id} className="rounded-xl border p-3 space-y-2" style={{ background: "rgba(8,16,38,0.6)", borderColor: P.border }}>
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ color: P.text, borderColor: P.border, background: P.faint }}>
                                  {SECTION_LABELS[s.section_type] || s.section_type}
                                </span>
                                <span className="font-inter text-[8px]" style={{ color: P.dim }}>
                                  {LANG_LABELS[s.language] || s.language}
                                </span>
                              </div>
                              <p className="font-amiri text-base leading-loose whitespace-pre-wrap selectable" style={{ color: "rgba(255,255,255,0.88)" }} dir="auto">
                                {s.text_content}
                              </p>
                              <div className="flex items-center gap-1.5 pt-1 border-t" style={{ borderColor: "rgba(212,175,55,0.12)" }}>
                                <FileText className="w-3 h-3" style={{ color: "rgba(212,175,55,0.40)" }} />
                                <span className="font-inter text-[8px] truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
                                  {s.source_pdf_file || "PDF"} • Page {s.source_pdf_page || "?"}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}