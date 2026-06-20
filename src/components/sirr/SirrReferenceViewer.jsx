import { motion } from 'framer-motion';
import { BookOpen, Link } from 'lucide-react';

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

export default function SirrReferenceViewer({ relatedSections, currentPage, onNavigate }) {
  if (!relatedSections || relatedSections.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        background: 'linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)',
        borderColor: G.border,
        boxShadow: '0 2px 20px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4" style={{ color: G.text }} />
        <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
          Related Sections from PDF
        </p>
      </div>
      <div className="h-px w-full mb-3"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)` }}
      />

      <div className="space-y-2">
        {relatedSections.map((section, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onNavigate?.(section.page)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all hover:scale-[1.01]"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: G.faint,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded"
                style={{ background: G.bg, border: `1px solid ${G.faint}` }}
              >
                <Link className="w-3 h-3" style={{ color: G.dim }} />
                <span className="font-inter text-xs font-semibold" style={{ color: G.text }}>
                  Page {section.page}
                </span>
              </div>
              <span className="font-inter text-xs" style={{ color: G.dim }}>
                {section.reason}
              </span>
            </div>
            <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
              View →
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}