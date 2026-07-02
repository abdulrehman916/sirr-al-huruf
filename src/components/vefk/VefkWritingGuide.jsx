import { motion } from "framer-motion";

// Same 5×5 Ottoman "Hâli Vasat" layout used by both Ana Vefk and Tanzim Vefki.
// The position numbers below ARE the traditional writing order (1 → 24).
// This component is DISPLAY-ONLY — it never touches any calculation.
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

const G = {
  dim: "rgba(212,175,55,0.55)",
};

function stepColor(step) {
  // Cool (early steps) → warm/gold (late steps) so the eye can follow the order.
  const t = (step - 1) / 23;
  const hue = 205 - t * 165; // 205 (blue) → 40 (gold)
  return `hsl(${hue}, 70%, 58%)`;
}

export default function VefkWritingGuide({ title = "Yazım Sırası Rehberi" }) {
  return (
    <div className="rounded-xl border p-4 space-y-3"
      style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.30)" }}>
      <div className="text-center space-y-1">
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
          🖊 {title}
        </p>
        <p className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.40)" }}>
          Sadece öğrenim amaçlı — hesaplamaları etkilemez
        </p>
      </div>

      <div className="w-full max-w-[380px] mx-auto" style={{ containerType: "inline-size" }}>
        <div className="grid grid-cols-5 gap-1.5">
          {LAYOUT.flat().map((pos, idx) => {
            const isCenter = pos === null;
            const color = isCenter ? "rgba(212,175,55,0.45)" : stepColor(pos);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: isCenter ? 0 : pos * 0.025, duration: 0.22 }}
                className="relative aspect-square rounded-lg border flex flex-col items-center justify-center overflow-hidden"
                style={{
                  background: isCenter ? "rgba(212,175,55,0.06)" : `${color}22`,
                  borderColor: isCenter ? "rgba(212,175,55,0.30)" : color,
                }}
              >
                {isCenter ? (
                  <span className="font-inter text-center leading-none px-0.5"
                    style={{ fontSize: "clamp(6px, 2.6cqw, 9px)", color }}>
                    merkez
                  </span>
                ) : (
                  <>
                    <span className="font-inter font-black leading-none"
                      style={{ fontSize: "clamp(10px, 4.5cqw, 18px)", color }}>
                      {pos}
                    </span>
                    <span className="font-inter uppercase tracking-wide leading-none mt-0.5"
                      style={{ fontSize: "clamp(5px, 1.8cqw, 7px)", color: "rgba(255,255,255,0.35)" }}>
                      Adım
                    </span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}