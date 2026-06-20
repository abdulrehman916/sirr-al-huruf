import { motion } from 'framer-motion';
import { BookOpen, FileText, Hash, MapPin, Quote } from 'lucide-react';

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

function ResultCard({ result, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-xl border p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderColor: G.faint,
      }}
    >
      {/* Header with type and page */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {result.type === 'text_match' && <FileText className="w-4 h-4" style={{ color: G.text }} />}
          {result.type === 'chapter' && <BookOpen className="w-4 h-4" style={{ color: G.text }} />}
          {result.type === 'entity' && <Hash className="w-4 h-4" style={{ color: G.text }} />}
          <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
            {result.type === 'text_match' ? result.matchType === 'exact_word' ? 'Exact Match' : 'Partial Match' :
             result.type === 'chapter' ? 'Chapter' :
             result.entityType || 'Result'}
          </span>
        </div>
        {result.page && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
            style={{ background: G.bg, border: `1px solid ${G.faint}` }}
          >
            <MapPin className="w-3 h-3" style={{ color: G.dim }} />
            <span className="font-inter text-xs font-semibold" style={{ color: G.text }}>
              Page {result.page}
            </span>
          </div>
        )}
      </div>

      {/* Text content */}
      {result.text && (
        <div className="space-y-2">
          {result.before && result.before.trim() && (
            <p className="font-inter text-xs text-white/40 italic">
              ...{result.before}
            </p>
          )}
          <p className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {result.text}
          </p>
          {result.after && result.after.trim() && (
            <p className="font-inter text-xs text-white/40 italic">
              ...{result.after}
            </p>
          )}
        </div>
      )}

      {/* Chapter info */}
      {result.chapter && (
        <div>
          <p className="font-inter text-sm font-semibold" style={{ color: G.text }}>
            {result.chapter}
          </p>
          <p className="font-inter text-xs mt-1" style={{ color: G.dim }}>
            Pages {result.startPage} - {result.endPage}
          </p>
        </div>
      )}

      {/* Entity data */}
      {result.entityType && result.data && (
        <div className="space-y-2">
          <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {result.data.reference || result.data.text?.substring(0, 200)}
          </p>
          {result.data.context && (
            <p className="font-inter text-xs text-white/40">
              Context: {result.data.context}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function SirrAnswerPanel({ results, query, explanation, onResultSelect }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-inter text-sm font-semibold" style={{ color: G.text }}>
            Search Results for "{query}"
          </p>
          <p className="font-inter text-xs mt-1" style={{ color: G.dim }}>
            {results.length} matches found
          </p>
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div
          className="rounded-2xl border p-5"
          style={{
            background: 'linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)',
            borderColor: G.border,
            boxShadow: '0 2px 20px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.06)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4" style={{ color: G.text }} />
            <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
              PDF-Based Explanation
            </p>
          </div>
          <div className="h-px w-full mb-3"
            style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)` }}
          />
          <p className="font-inter text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {explanation}
          </p>
        </div>
      )}

      {/* Results list */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <button
            key={index}
            onClick={() => onResultSelect?.(result)}
            className="w-full text-left"
          >
            <ResultCard result={result} index={index} />
          </button>
        ))}
      </div>
    </div>
  );
}