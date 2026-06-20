import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Hash, Languages } from 'lucide-react';

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

function SectionCard({ title, children, icon }) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-3"
      style={{
        background: 'linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)',
        borderColor: G.border,
        boxShadow: '0 2px 20px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
          {title}
        </p>
      </div>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)` }} />
      {children}
    </div>
  );
}

export default function SirrResults({ analysisResult, onSelectSection }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysisResult) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: G.dim }} />
        <p className="font-inter text-sm" style={{ color: G.dim }}>
          Upload a PDF to begin analysis
        </p>
      </div>
    );
  }

  const { document: doc, sections, keyConcepts, languages } = analysisResult;

  return (
    <div className="space-y-4">
      {/* Document Overview */}
      <SectionCard title="Document Overview" icon={<FileText className="w-4 h-4" style={{ color: G.text }} />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-xl" style={{ background: G.bg }}>
            <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
              Total Sections
            </p>
            <p className="font-inter text-2xl font-bold" style={{ color: G.text }}>
              {sections?.length || 0}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: G.bg }}>
            <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
              Total Pages
            </p>
            <p className="font-inter text-2xl font-bold" style={{ color: G.text }}>
              {doc?.totalPages || 0}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: G.bg }}>
            <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
              Languages
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {languages?.map((lang, i) => (
                <span key={i} className="font-inter text-xs font-semibold" style={{ color: G.text }}>
                  {lang}
                </span>
              )) || '-'}
            </div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: G.bg }}>
            <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
              Key Concepts
            </p>
            <p className="font-inter text-2xl font-bold" style={{ color: G.text }}>
              {keyConcepts?.length || 0}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Key Concepts */}
      {keyConcepts && keyConcepts.length > 0 && (
        <SectionCard title="Key Concepts" icon={<Hash className="w-4 h-4" style={{ color: G.text }} />}>
          <div className="flex flex-wrap gap-2">
            {keyConcepts.map((concept, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: G.bg,
                  border: `1px solid ${G.faint}`,
                  color: G.text,
                }}
              >
                {concept}
              </motion.span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Sections List */}
      {sections && sections.length > 0 && (
        <SectionCard title="Document Sections" icon={<BookOpen className="w-4 h-4" style={{ color: G.text }} />}>
          <div className="space-y-2">
            {sections.map((section, i) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelectSection(section)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all hover:scale-[1.01]"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: G.faint,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: G.bg, color: G.text, border: `1px solid ${G.faint}` }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-inter text-sm font-semibold" style={{ color: G.text }}>
                      {section.title}
                    </p>
                    <p className="font-inter text-[10px]" style={{ color: G.dim }}>
                      Page {section.pageNumber} • {section.content?.length || 0} paragraphs
                    </p>
                  </div>
                </div>
                <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
                  View →
                </span>
              </motion.button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}