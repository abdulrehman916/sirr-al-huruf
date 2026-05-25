import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

// ── Abjad (Tanzim-isolated) ───────────────────────────────────────
const ABJAD_MAP = {
  'ا':1,'أ':1,'إ':1,'آ':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
  'ي':10,'ى':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
};
function tanzimEbced(t) {
  return [...t].reduce((s, c) => s + (ABJAD_MAP[c] || 0), 0);
}

// ── Ottoman 5×5 layout — null = center (visual only) ────────────
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// ── Tanzim cell formula ──────────────────────────────────────────
// Cells 1–19: value = position (1,2,3...19)
// Cells 20–24: value = (esmaValue - 40) + (pos - 20)
//   i.e. 20 → esmaValue-40, 21 → esmaValue-39, ... 24 → esmaValue-36
function computeTanzimCells(esmaValue) {
  const cells = {};
  for (let pos = 1; pos <= 19; pos++) {
    cells[pos] = pos;
  }
  const base20 = esmaValue - 40;
  for (let pos = 20; pos <= 24; pos++) {
    cells[pos] = base20 + (pos - 20);
  }
  return cells;
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

function TanzimGrid({ cells, esmaText }) {
  const cellW = 58;
  return (
    <div className="flex justify-center overflow-x-auto">
      <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cellW}px)`, gap: "4px" }}>
        {LAYOUT.flat().map((pos, idx) => {
          const isEmpty = pos === null;
          const val = isEmpty ? null : cells[pos];
          const display = val != null ? val.toLocaleString() : null;
          const fontSize = display && display.length > 9 ? "7px"
            : display && display.length > 6 ? "9px"
            : display && display.length > 4 ? "11px" : "13px";
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.018, duration: 0.22 }}
              className="rounded-lg border flex flex-col items-center justify-center"
              style={{
                width: cellW, height: cellW,
                background: isEmpty ? "rgba(212,175,55,0.04)" : "rgba(212,175,55,0.10)",
                borderColor: isEmpty ? "rgba(212,175,55,0.18)" : "rgba(212,175,55,0.45)",
                boxShadow: isEmpty ? "none" : "inset 0 0 8px rgba(212,175,55,0.12)",
              }}
            >
              {isEmpty ? (
                <div className="flex items-center justify-center w-full h-full px-1">
                  {esmaText ? (
                    <p className="font-amiri text-center leading-tight"
                      style={{ color: G.text, fontSize: esmaText.length > 8 ? "8px" : "10px" }}
                      dir="rtl">{esmaText}</p>
                  ) : (
                    <motion.span style={{ fontSize: "1.1rem", color: "rgba(212,175,55,0.18)" }}
                      animate={{ opacity: [0.1, 0.35, 0.1] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>□</motion.span>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-amiri font-bold tabular-nums leading-tight"
                    style={{ color: G.text, fontSize, textShadow: "0 0 6px rgba(212,175,55,0.35)" }}>
                    {display}
                  </p>
                  <p className="font-inter" style={{ fontSize: "7px", color: "rgba(212,175,55,0.28)", marginTop: "1px" }}>
                    [{pos}]
                  </p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function TanzimVefki() {
  const [bazRaw,   setBazRaw]   = useState("");
  const [esmaText, setEsmaText] = useState("");

  // ── Esma/Baz value resolution ─────────────────────────────────
  // If numeric → use directly. If text/Arabic → compute Ebced.
  const bazTrimmed   = bazRaw.trim();
  const bazIsNumeric = /^\d+$/.test(bazTrimmed);
  const bazEbced     = (!bazIsNumeric && bazTrimmed) ? tanzimEbced(bazTrimmed) : null;
  const esmaValue    = bazTrimmed
    ? (bazIsNumeric ? parseInt(bazTrimmed) : bazEbced)
    : null;

  // Need esmaValue > 40 for cells 20–24 to be positive
  const canGenerate = esmaValue && esmaValue > 40;
  const cells       = canGenerate ? computeTanzimCells(esmaValue) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>

        {/* Header */}
        <div className="text-center space-y-1">
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-yellow-500/25 mb-1"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 22px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-lg" style={{ color: "#D4AF37" }}>✨</span>
          </motion.div>
          <motion.h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}
            animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            تنظيم
          </motion.h2>
          <p className="font-inter text-[10px] font-bold text-white">TANZİM VEFKİ</p>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
            Hâli Vasat — 2. Usül
          </p>
          <GoldDivider />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>
            5×5 Empty Center — Ottoman Manuscript Method
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          {/* Esma / Baz Sayı */}
          <div className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              1️⃣ Esma / Baz Sayı — الاسم أو الرقم
            </p>
            <input
              type="text"
              value={bazRaw}
              onChange={e => setBazRaw(e.target.value)}
              placeholder="Sayı veya isim... (örn: 114 / الله / Vedud)"
              dir="auto"
              className="w-full rounded-xl px-4 py-2.5 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
            />
            {bazEbced !== null && bazEbced > 0 && (
              <p className="font-inter text-[9px] text-center" style={{ color: "rgba(212,175,55,0.65)" }}>
                ✦ Ebced: <span className="font-amiri font-bold" style={{ color: G.text }}>{bazEbced.toLocaleString()}</span>
              </p>
            )}
            {esmaValue && (
              <div className="rounded-lg px-3 py-2 space-y-1" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
                <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                  Esma Değeri: <span className="font-amiri font-bold" style={{ color: G.text }}>{esmaValue.toLocaleString()}</span>
                </p>
                {canGenerate && (
                  <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.45)" }}>
                    Hane 20→24: <span className="font-amiri" style={{ color: G.text }}>
                      {[0,1,2,3,4].map(i => esmaValue - 40 + i).join(", ")}
                    </span>
                  </p>
                )}
                {!canGenerate && esmaValue <= 40 && (
                  <p className="font-inter text-[9px]" style={{ color: "rgba(255,160,80,0.80)" }}>
                    ⚠ Esma değeri 40'tan büyük olmalı
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Esma visual — center cell only */}
          <div className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.20)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              2️⃣ Merkez Hücre Metni (İsteğe Bağlı) — النص المركزي
            </p>
            <input
              type="text"
              value={esmaText}
              onChange={e => setEsmaText(e.target.value)}
              placeholder="الله / Vedud / ..."
              dir="rtl"
              className="w-full rounded-xl px-4 py-2 font-amiri text-lg text-white text-right focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid rgba(212,175,55,0.15)` }}
            />
            <p className="font-inter text-[8px]" style={{ color: "rgba(212,175,55,0.30)" }}>
              Sadece görsel — merkez hücrede gösterilir, hesaplara dahil değil
            </p>
          </div>
        </div>

        {/* Rule card */}
        <div className="rounded-xl border px-4 py-3 space-y-1"
          style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            📜 Hesap Kuralı — Tanzim Usülü
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Hane 1–19: <span style={{ color: G.text }}>sabit değer (1, 2, 3 ... 19)</span>
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Hane 20–24: <span style={{ color: G.text }}>Esma − 40, Esma − 39, ... Esma − 36</span>
          </p>
        </div>

        {/* Grid output */}
        <AnimatePresence mode="wait">
          {cells ? (
            <motion.div key={`tanzim-${esmaValue}`}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
                ✨ Hâli Vasat Tanzim Vefki
              </p>

              <TanzimGrid cells={cells} esmaText={esmaText} />

              {/* Esma value display */}
              <div className="rounded-xl border p-3 text-center"
                style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                  ⚖ Esma Değeri
                </p>
                <motion.p className="font-amiri text-3xl font-bold mt-1" style={{ color: G.text }}
                  animate={{ textShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  {esmaValue.toLocaleString()}
                </motion.p>
              </div>

            </motion.div>
          ) : (
            <motion.div key="tanzim-placeholder"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-xl border p-8 flex flex-col items-center gap-3"
              style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.12)" }}
            >
              <motion.span style={{ fontSize: "1.8rem", color: "rgba(212,175,55,0.18)" }}
                animate={{ opacity: [0.12, 0.40, 0.12] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>✨</motion.span>
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.22)" }}>
                Esma değerini veya ismi girerek tanzim vefkini oluşturun
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}