import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft } from 'lucide-react';

const G = {
  border: 'rgba(212,175,55,0.40)',
  borderHi: 'rgba(212,175,55,0.65)',
  glow: 'rgba(212,175,55,0.22)',
  glowHi: 'rgba(212,175,55,0.55)',
  text: '#F5D060',
  dim: 'rgba(212,175,55,0.55)',
  faint: 'rgba(212,175,55,0.22)',
  bg: 'rgba(212,175,55,0.07)',
  bgHi: 'rgba(212,175,55,0.14)',
};

export default function SirrSectionViewer({ section, onBack }) {
  if (!section) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
          style={{
            background: G.bg,
            border: `1px solid ${G.faint}`,
            color: G.text,
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-inter text-xs font-semibold">Back</span>
        </button>
        <div className="flex-1" />
        <span
          className="font-inter text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg"
          style={{ background: G.bg, color: G.dim, border: `1px solid ${G.faint}` }}
        >
          Page {section.pageNumber}
        </span>
      </div>

      {/* Section Title */}
      <div
        className="rounded-2xl border p-6 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(8,18,48,0.99) 0%, rgba(4,10,28,0.99) 100%)',
          borderColor: G.borderHi,
          boxShadow: `0 0 60px ${G.glow}, 0 4px 32px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.12)`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }}
        />
        <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: G.text }} />
        <h2 className="font-inter text-xl font-bold" style={{ color: G.text }}>
          {section.title}
        </h2>
        <p className="font-inter text-[10px] uppercase tracking-widest mt-2" style={{ color: G.dim }}>
          {section.content?.length || 0} paragraphs
        </p>
      </div>

      {/* Section Content */}
      {section.content && section.content.length > 0 && (
        <div className="space-y-3">
          {section.content.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border p-4"
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: G.faint,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span
                  className="font-inter text-[9px] uppercase tracking-widest px-2 py-1 rounded"
                  style={{ background: G.bg, color: G.dim }}
                >
                  {block.type || 'Paragraph'}
                </span>
                <span
                  className="font-inter text-[10px] px-2 py-1 rounded"
                  style={{ background: G.bg, color: G.text }}
                >
                  {block.language === 'arabic' ? 'العربية' : block.language === 'malayalam' ? 'മലയാളം' : 'English'}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed ${block.language === 'arabic' ? 'font-amiri text-right' : 'font-inter'}`}
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  direction: block.language === 'arabic' ? 'rtl' : 'ltr',
                }}
                dir={block.language === 'arabic' ? 'rtl' : 'ltr'}
              >
                {block.text}
              </p>
              <p className="font-inter text-[10px] mt-3" style={{ color: G.dim }}>
                Source: Page {block.pageNumber}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}