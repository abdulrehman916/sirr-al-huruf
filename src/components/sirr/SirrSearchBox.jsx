import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

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

export default function SirrSearchBox({ onSearch, query, setQuery, isLoading, hasIndex }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(() => {
    if (!query?.trim() || !hasIndex) return;
    onSearch(query.trim());
  }, [query, hasIndex, onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  return (
    <div
      className="rounded-2xl border p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)',
        borderColor: G.borderHi,
        boxShadow: `0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)` }}
      />

      <label className="block font-inter text-[10px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
        {hasIndex ? 'Search PDF Knowledge Base' : 'Upload PDF to Enable Search'}
      </label>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for Ayah, Surah, Dua, Wazifa, Amal, Topic, Person, Number, Symbol, or any phrase..."
            disabled={!hasIndex || isLoading}
            className="w-full rounded-xl px-5 py-4 font-inter text-base text-white leading-relaxed focus:outline-none caret-white placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(4,12,34,0.97)',
              border: `1px solid ${isFocused ? G.borderHi : G.border}`,
              boxShadow: isFocused ? `0 0 20px ${G.glow}` : 'none',
            }}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" style={{ color: G.dim }} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={!query?.trim() || !hasIndex || isLoading}
          className="flex items-center gap-2 px-6 py-4 rounded-xl font-inter font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a] tracking-wide"
          style={{
            background: 'linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)',
            boxShadow: `0 0 32px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)`,
          }}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: G.border, borderTopColor: 'transparent' }}
          />
          <span className="font-inter text-xs" style={{ color: G.dim }}>
            Searching PDF knowledge base...
          </span>
        </div>
      )}
    </div>
  );
}