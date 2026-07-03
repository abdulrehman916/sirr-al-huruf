import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, Star, ArrowUpDown, ChevronRight } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import ProductCard from "../components/shop/ProductCard";
import { base44 } from "../api/base44Client";

const G = {
  border: "rgba(212,175,55,0.30)",
  borderHi: "rgba(212,175,55,0.55)",
  glow: "rgba(212,175,55,0.18)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.14)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.12)",
};

const SORT_CYCLE = ["featured", "az", "za", "newest"];
const SORT_LABELS = { featured: "Featured", az: "A → Z", za: "Z → A", newest: "Newest" };

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const list = await base44.entities.Product.list("-created_date", 200);
      setProducts(list || []);
    } catch (err) {
      // Entity might be empty or not yet synced — show empty state
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.category) set.add(p.category); });
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter(p => p.is_active !== false);

    if (activeCategory !== "all") {
      list = list.filter(p => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    if (sort === "az") sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sort === "za") sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    else if (sort === "newest") sorted.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
    else if (sort === "featured") {
      sorted.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (a.sort_order || 0) - (b.sort_order || 0);
      });
    }
    return sorted;
  }, [products, activeCategory, search, sort]);

  const featuredProducts = useMemo(
    () => products.filter(p => p.is_featured && p.is_active !== false).slice(0, 4),
    [products]
  );

  const cycleSort = () => {
    const idx = SORT_CYCLE.indexOf(sort);
    setSort(SORT_CYCLE[(idx + 1) % SORT_CYCLE.length]);
  };

  return (
    <PageLayout>
      <PageTitle
        icon={<ShoppingBag className="w-5 h-5" style={{ color: G.text }} />}
        title="Shop"
        subtitle="Curated Spiritual Tools & Products"
      />

      <div className="px-4 pb-8 space-y-5">
        {/* Search Bar */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
          style={{
            background: "rgba(8,16,38,0.80)",
            border: `1px solid ${G.border}`,
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: G.dim }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent outline-none font-inter text-sm placeholder:text-white/25"
            style={{ color: "rgba(255,255,255,0.90)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="flex-shrink-0">
              <X className="w-4 h-4" style={{ color: G.dim }} />
            </button>
          )}
          {/* Sort */}
          <button
            onClick={cycleSort}
            className="flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0"
            style={{ background: G.bg, border: `1px solid ${G.faint}` }}
          >
            <ArrowUpDown className="w-3 h-3" style={{ color: G.text }} />
            <span className="font-inter text-[9px] font-semibold" style={{ color: G.text }}>
              {SORT_LABELS[sort]}
            </span>
          </button>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl border font-inter text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  background: activeCategory === cat ? G.bgHi : "transparent",
                  borderColor: activeCategory === cat ? G.borderHi : G.faint,
                  color: activeCategory === cat ? G.text : "rgba(212,175,55,0.40)",
                  boxShadow: activeCategory === cat ? `0 0 14px ${G.glow}` : "none",
                }}
              >
                {cat === "all" ? "All" : cat}
              </motion.button>
            ))}
          </div>
        )}

        {/* Featured Section (only when no search/active filter) */}
        {featuredProducts.length > 0 && !search && activeCategory === "all" && sort === "featured" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: G.text, fill: G.text }} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Featured
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {featuredProducts.map((p, i) => (
                <div key={p.id} className="flex-shrink-0 w-[280px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: `${G.faint} transparent ${G.faint} transparent` }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <ShoppingBag className="w-12 h-12 mx-auto" style={{ color: G.dim, opacity: 0.4 }} />
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
              {search ? "No products match your search" : "No products available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageLayout>
  );
}