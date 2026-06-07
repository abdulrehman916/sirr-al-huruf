import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { FAAL_CHOB_ENTRIES } from "../../lib/faalChobData";
import { FAAL_CHOB_ML } from "../../lib/faalChobTranslations";
import { usePageState } from "../../context/PageStateContext";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PAGE_KEY = "faalChob";

const instructions = [
  {
    ar: "طهارت داشته باشید و بسم‌الله الرحمن الرحیم بگویید.",
    ml: "ശുദ്ധിയോടെ (ത്വഹാറത്ത്) ഇരിക്കുക. ബിസ്മില്ലാഹിർ റഹ്മാനിർ റഹീം എന്ന് ഉരുക്കഴിക്കുക.",
  },
  {
    ar: "سورهٔ الحمد را بخوانید.",
    ml: "സൂറത്തുൽ ഹംദ് (അൽ-ഫാതിഹ) ഓതുക.",
  },
  {
    ar: "فاتحه به روح پرفتوح سرور کائنات صلوات‌الله علیه و آله بخوانید.",
    ml: "സർവ്വ സൃഷ്ടികളുടെ നേതാവും (سرور کائنات) അല്ലാഹുവിന്റെ സ്വലവാത്ത് ഏറ്റവും അർഹനുമായ നബി (സ.അ.വ.) യുടേയും അഹ്ലുൽ ബൈത്തിന്റേയും ആത്മാക്കൾക്ക് ഫാതിഹ ഓതി ഹദ്‌യ ചെയ്യുക.",
  },
  {
    ar: "این آیهٔ شریفه را برزبان آورید: سبحانک لا علم لنا الا ما علمتنا انک انت العلیم‌الحکیم.",
    ml: "ഈ ശ്രേഷ്ഠ ആയത്ത് ഉരുക്കഴിക്കുക: سُبْحَانَکَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا إِنَّکَ أَنْتَ الْعَلِیمُ الْحَکِیمُ — (അർത്ഥം: നിന്റെ പരിശുദ്ധി! നീ ഞങ്ങൾക്ക് പഠിപ്പിച്ചത് മാത്രമേ ഞങ്ങൾക്ക് അറിവുള്ളൂ. തീർച്ചയായും നീ സർവ്വജ്ഞനും യുക്തിമാനുമാകുന്നു.)",
  },
  {
    ar: "نیت نموده و چوب را بدست گرفت چشمها را بسته و چوب را به‌زمین و یا میز بیاندازید.",
    ml: "ഹൃദയത്തിൽ നിയ്യത്ത് (ഉദ്ദേശ്യം) ഉറപ്പിക്കുക. ചൂരൽ/കോൽ (چوب) കൈയ്യിലെടുക്കുക. കണ്ണുകൾ അടക്കുക. പിന്നെ ആ കോൽ നിലത്തോ മേശ മേലോ എറിയുക.",
  },
  {
    ar: "هردفعه که انداخته شد باید حروف نوشته تا سه حروف دلخواه به‌دست بیاید.",
    ml: "ഓരോ തവണ എറിയുമ്പോഴും ലഭിക്കുന്ന അക്ഷരം കുറിച്ചുവെക്കുക. ഇങ്ങനെ മൂന്ന് ഇഷ്ടമുള്ള അക്ഷരങ്ങൾ ലഭിക്കുന്നതുവരെ തുടരുക.",
  },
  {
    ar: "بعد به‌صفحات فال مراجعه کرده تا خیر و شر آن معلوم شود.",
    ml: "തുടർന്ന് ഫാൽ (فال) ന്റെ പേജുകൾ നോക്കി ആ അക്ഷര സംയോജനത്തിന്റെ ഗുണദോഷങ്ങൾ മനസ്സിലാക്കുക.",
  },
];

export default function FaalHikmah() {
  const { getPageState, setPageState, clearPageState } = usePageState();

  const init = getPageState(PAGE_KEY, {
    shuffled: shuffleArray(FAAL_CHOB_ENTRIES),
    selected: null,
    expanded: false,
  });

  const [shuffled, setShuffled]         = useState(init.shuffled);
  const [selected, setSelected]         = useState(init.selected);
  const [expanded, setExpanded]         = useState(init.expanded);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [lang, setLang]                 = useState("ml"); // default: Malayalam

  const persist = useCallback((s, sel, ex) => {
    setPageState(PAGE_KEY, { shuffled: s, selected: sel, expanded: ex });
  }, [setPageState]);

  const handleShuffle = () => {
    const s = shuffleArray(FAAL_CHOB_ENTRIES);
    setShuffled(s);
    setSelected(null);
    persist(s, null, false);
  };

  const handleSelect = (entry) => {
    setSelected(entry);
    persist(shuffled, entry, false);
  };

  const handleBack = () => {
    const s = shuffleArray(FAAL_CHOB_ENTRIES);
    setShuffled(s);
    setSelected(null);
    persist(s, null, false);
  };

  const handleClear = () => {
    clearPageState(PAGE_KEY);
    const s = shuffleArray(FAAL_CHOB_ENTRIES);
    setShuffled(s);
    setSelected(null);
    setExpanded(false);
  };

  const isAr = lang === "ar";
  const ml = selected ? FAAL_CHOB_ML[selected.id] : null;

  return (
    <div className="space-y-4" style={{ minHeight: 0, height: "auto", overflow: "visible" }}>

      {/* ── Language Switcher ── */}
      <div className="flex gap-2 justify-center">
        {[
          { id: "ar", flag: "🇸🇦", label: "العربية" },
          { id: "ml", flag: "🇮🇳", label: "മലയാളം" },
        ].map(opt => {
          const active = lang === opt.id;
          return (
            <motion.button
              key={opt.id}
              onClick={() => setLang(opt.id)}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-inter font-bold text-xs border transition-all"
              style={{
                background: active
                  ? "linear-gradient(145deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.07) 100%)"
                  : "rgba(4,12,34,0.90)",
                borderColor: active ? G.borderHi : "rgba(255,255,255,0.10)",
                color: active ? G.text : "rgba(255,255,255,0.45)",
                boxShadow: active ? `0 0 18px ${G.glow}` : "none",
              }}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Instructions ── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-1">
          <SectionLabel>
            {isAr ? "📜 طریقهٔ ساخت چوب — روش فال" : "📜 ഫാൽ ചോബ് — നിർദ്ദേശ രീതി"}
          </SectionLabel>
          <motion.button
            onClick={() => setInstructionsOpen(!instructionsOpen)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-inter font-bold text-[10px]"
            style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)", color: G.text }}
          >
            {instructionsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {instructionsOpen
              ? (isAr ? "بستن" : "അടക്കുക")
              : (isAr ? "خواندن" : "വായിക്കുക")}
          </motion.button>
        </div>
        <motion.div
          initial={false}
          animate={{ height: instructionsOpen ? "auto" : 0, opacity: instructionsOpen ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="space-y-2 pt-3 pb-1">
            {instructions.map((step, i) => (
              <div key={i} className="rounded-xl border p-3"
                style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.12)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                  {isAr ? `مرحله ${i + 1}` : `ഘട്ടം ${i + 1}`}
                </p>
                {isAr ? (
                  <p className="font-amiri text-sm leading-relaxed text-white/85" dir="rtl">
                    <span className="font-bold" style={{ color: G.text }}>{i + 1}.</span> {step.ar}
                  </p>
                ) : (
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.80)" }}>
                    {step.ml}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </SectionCard>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Shuffle button */}
            <motion.button
              onClick={handleShuffle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-inter font-bold text-sm border transition-all"
              style={{
                background: "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 100%)",
                borderColor: G.borderHi,
                color: G.text,
                boxShadow: `0 0 24px ${G.glow}`,
              }}
            >
              <Shuffle className="w-4 h-4" />
              {isAr ? "بزن بریم — اختلاط کارت‌ها" : "കാർഡ് ഇളക്കുക"}
            </motion.button>

            <SectionCard glow>
              <SectionLabel>
                {isAr ? "✨ یک کارت انتخاب کنید — فال چوب" : "✨ ഒരു കാർഡ് തിരഞ്ഞെടുക്കുക — ഫാൽ ചോബ്"}
              </SectionLabel>
              <p className={`text-sm text-white/60 text-center mb-3 ${isAr ? "font-amiri" : "font-inter text-xs"}`} dir={isAr ? "rtl" : "ltr"}>
                {isAr ? "نیت کنید و یک کارت را انتخاب نمایید" : "നിയ്യത്ത് ചെയ്ത് ഒരു കാർഡ് തിരഞ്ഞെടുക്കുക"}
              </p>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {shuffled.map((entry, idx) => (
                  <motion.button
                    key={entry.id}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.01, duration: 0.3, ease: "easeOut" }}
                    onClick={() => handleSelect(entry)}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="aspect-square rounded-xl border flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, rgba(212,175,55,0.14) 0%, rgba(6,14,32,0.98) 100%)",
                      borderColor: "rgba(212,175,55,0.38)",
                      boxShadow: "0 0 20px rgba(212,175,55,0.14), inset 0 1px 0 rgba(212,175,55,0.10)",
                    }}
                  >
                    <div className="absolute inset-0" style={{
                      background: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(212,175,55,0.03) 8px, rgba(212,175,55,0.03) 16px)"
                    }} />
                    <div className="relative z-10 flex flex-col items-center gap-0.5 px-1">
                      <span className="font-amiri font-bold text-center leading-tight" dir="rtl"
                        style={{ color: G.text, fontSize: "11px", wordBreak: "break-all" }}>
                        {entry.symbol}
                      </span>
                    </div>
                    <div className="absolute top-1 left-1 w-1 h-1 rounded-full" style={{ background: "rgba(212,175,55,0.25)" }} />
                    <div className="absolute top-1 right-1 w-1 h-1 rounded-full" style={{ background: "rgba(212,175,55,0.25)" }} />
                    <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full" style={{ background: "rgba(212,175,55,0.25)" }} />
                    <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full" style={{ background: "rgba(212,175,55,0.25)" }} />
                  </motion.button>
                ))}
              </div>
              <p className="font-inter text-[7px] uppercase tracking-widest text-center mt-3" style={{ color: G.dim }}>
                {FAAL_CHOB_ENTRIES.length} Cards — فال چوب
              </p>
            </SectionCard>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <SectionCard glow>
              <SectionLabel>
                {isAr ? "✨ نتیجهٔ فال چوب" : "✨ ഫാൽ ചോബ് ഫലം"}
              </SectionLabel>

              {/* Symbol header */}
              <div className="text-center py-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-2xl border mb-2"
                  style={{
                    background: "linear-gradient(145deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.05) 100%)",
                    borderColor: "rgba(212,175,55,0.40)",
                    boxShadow: "0 0 28px rgba(212,175,55,0.25), inset 0 1px 0 rgba(212,175,55,0.15)",
                  }}
                >
                  <span className="font-amiri text-3xl font-bold tracking-widest" style={{ color: G.text }} dir="rtl">
                    {selected.symbol}
                  </span>
                </motion.div>
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                  Card #{selected.id} — فال چوب
                </p>
              </div>

              {/* Verse — always Arabic, shown in both modes */}
              {selected.verse && (
                <div className="rounded-xl border p-4"
                  style={{ background: "rgba(212,175,55,0.07)", borderColor: "rgba(212,175,55,0.22)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                    {isAr ? "آیه / حدیث" : "ആയത്ത് / ഹദീഥ്"}
                  </p>
                  <p className="font-amiri text-lg leading-relaxed text-center" style={{ color: G.text }} dir="rtl">
                    {selected.verse}
                  </p>
                </div>
              )}

              {/* Main text */}
              {(selected.text || (ml?.text && !isAr)) && (
                <div className="rounded-xl border p-4"
                  style={{ background: "rgba(8,16,38,0.95)", borderColor: "rgba(212,175,55,0.18)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                    {isAr ? "فال" : "ഫാൽ"}
                  </p>
                  {isAr ? (
                    <>
                      <p className="font-amiri text-base leading-loose text-white/90" dir="rtl">{selected.text}</p>
                      {selected.continuation && (
                        <p className="font-amiri text-base leading-loose text-white/90 mt-2" dir="rtl">{selected.continuation}</p>
                      )}
                    </>
                  ) : (
                    <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {ml?.text}
                    </p>
                  )}
                </div>
              )}

              {/* Danyal */}
              {(selected.danyal || (ml?.danyal && !isAr)) && (
                <div className="rounded-xl border p-4"
                  style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.14)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                    {isAr ? "حضرت دانیال نبی علیه‌السلام" : "ഹസ്രത്ത് ദാനിയ്യൽ നബി (അ.സ.)"}
                  </p>
                  {isAr ? (
                    <p className="font-amiri text-base leading-loose text-white/85" dir="rtl">{selected.danyal}</p>
                  ) : (
                    <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {ml?.danyal}
                    </p>
                  )}
                </div>
              )}

              {/* Sadiq */}
              {(selected.sadiq || (ml?.sadiq && !isAr)) && (
                <div className="rounded-xl border p-4"
                  style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.14)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                    {isAr ? "حضرت امام جعفر صادق علیه‌السلام" : "ഇമാം ജഅ്ഫർ സ്വാദിഖ് (അ.സ.)"}
                  </p>
                  {isAr ? (
                    <p className="font-amiri text-base leading-loose text-white/85" dir="rtl">{selected.sadiq}</p>
                  ) : (
                    <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {ml?.sadiq}
                    </p>
                  )}
                </div>
              )}

              <motion.button
                onClick={handleBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-inter font-bold text-sm text-[#0d1b2a] tracking-wide mt-2"
                style={{
                  background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
                  boxShadow: `0 0 32px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)`,
                }}
              >
                {isAr ? "← بازگشت به کارت‌ها" : "← കാർഡുകളിലേക്ക് മടങ്ങുക"}
              </motion.button>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear */}
      <motion.button
        onClick={handleClear}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-inter font-bold text-sm text-white border transition-all"
        style={{ background: "rgba(4,12,34,0.97)", borderColor: "rgba(255,255,255,0.12)" }}
      >
        <Trash2 className="w-4 h-4" />
        {isAr ? "پاک کردن همه" : "എല്ലാം മായ്ക്കുക"}
      </motion.button>
    </div>
  );
}

function SectionCard({ children, glow = false }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: "rgba(212,175,55,0.22)",
        boxShadow: glow
          ? `0 8px 48px rgba(0,0,0,0.62), 0 0 32px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.12)`
          : `0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
      {children}
    </p>
  );
}