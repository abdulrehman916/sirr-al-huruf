import { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Plus, Search, X, Edit3, Trash2, Eye, EyeOff, ChevronUp, ChevronDown,
  Star, ExternalLink, Upload, Save, Flame, Sparkles, PackageX, Play, TrendingUp
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

const EMPTY_FORM = {
  product_id: "",
  name: "",
  slug: "",
  short_description: "",
  full_description: "",
  specifications: "{}",
  images: [],
  video_url: "",
  video_urls: [],
  pdf_url: "",
  category: "",
  affiliate_links: [],
  price_display: "",
  compare_price_display: "",
  rating_display: "",
  sort_order: 0,
  is_active: true,
  is_featured: false,
  is_best_seller: false,
  is_new_arrival: false,
  is_out_of_stock: false,
  discount_percentage: "",
  seller_whatsapp: "",
  seller_email: "",
  tags: [],
  faqs: [],
  brand: "",
  sku: "",
  malayalam_description: "",
  usage_instructions: "",
  ingredients: "",
  benefits: "",
  warnings: "",
  rules_precautions: "",
  storage_instructions: "",
  is_trending: false,
};

export default function AdminProducts() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [affiliateInput, setAffiliateInput] = useState({ platform: "", url: "", label: "" });
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [faqInput, setFaqInput] = useState({ question: "", answer: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      loadProducts();
      loadReviews();
    } catch {
      setIsAdmin(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const list = await base44.entities.Product.list("-created_date", 500);
      setProducts(list || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const list = await base44.entities.ProductReview.list("-created_date", 100);
      setReviews(list || []);
    } catch {
      setReviews([]);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.category) set.add(p.category); });
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filterCategory !== "all") list = list.filter(p => p.category === filterCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || p.product_id?.toLowerCase().includes(q));
    }
    return list;
  }, [products, search, filterCategory]);

  const openCreate = () => {
    setForm({
      ...EMPTY_FORM,
      product_id: `PRD-${Date.now()}`,
      slug: `prd-${Date.now()}`,
    });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      ...EMPTY_FORM,
      ...product,
      specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : "{}",
      images: product.images || [],
      video_urls: product.video_urls || [],
      affiliate_links: product.affiliate_links || [],
      tags: product.tags || [],
      faqs: product.faqs || [],
      discount_percentage: product.discount_percentage ?? "",
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast({ title: "Name and slug are required", variant: "destructive" });
      return;
    }
    try {
      setSaving(true);
      let specs = {};
      try { specs = JSON.parse(form.specifications || "{}"); } catch { specs = {}; }

      const payload = {
        product_id: form.product_id || `PRD-${Date.now()}`,
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
        short_description: form.short_description,
        full_description: form.full_description,
        specifications: specs,
        images: form.images,
        video_url: form.video_url,
        video_urls: form.video_urls,
        pdf_url: form.pdf_url,
        category: form.category,
        affiliate_links: form.affiliate_links,
        price_display: form.price_display,
        compare_price_display: form.compare_price_display,
        rating_display: form.rating_display,
        sort_order: form.sort_order || 0,
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_best_seller: form.is_best_seller,
        is_new_arrival: form.is_new_arrival,
        is_out_of_stock: form.is_out_of_stock,
        discount_percentage: form.discount_percentage ? Number(form.discount_percentage) : null,
        seller_whatsapp: form.seller_whatsapp,
        seller_email: form.seller_email,
        tags: form.tags,
        faqs: form.faqs,
        brand: form.brand,
        sku: form.sku,
        malayalam_description: form.malayalam_description,
        usage_instructions: form.usage_instructions,
        ingredients: form.ingredients,
        benefits: form.benefits,
        warnings: form.warnings,
        rules_precautions: form.rules_precautions,
        storage_instructions: form.storage_instructions,
        is_trending: form.is_trending,
        updated_at: new Date().toISOString(),
      };

      if (editId) {
        await base44.entities.Product.update(editId, payload);
        toast({ title: "Product updated" });
      } else {
        await base44.entities.Product.create(payload);
        toast({ title: "Product created" });
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      toast({ title: "Error saving product", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await base44.entities.Product.delete(id);
      toast({ title: "Product deleted" });
      loadProducts();
    } catch (err) {
      toast({ title: "Error deleting", description: err.message, variant: "destructive" });
    }
  };

  const toggleActive = async (product) => {
    try {
      await base44.entities.Product.update(product.id, { is_active: !product.is_active, updated_at: new Date().toISOString() });
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await base44.entities.Product.update(product.id, { is_featured: !product.is_featured, updated_at: new Date().toISOString() });
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const moveOrder = async (product, direction) => {
    try {
      await base44.entities.Product.update(product.id, {
        sort_order: (product.sort_order || 0) + direction,
        updated_at: new Date().toISOString(),
      });
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const addImage = () => {
    if (!imageUrlInput.trim()) return;
    setForm({ ...form, images: [...form.images, imageUrlInput.trim()] });
    setImageUrlInput("");
  };

  const removeImage = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const addAffiliate = () => {
    if (!affiliateInput.platform.trim() || !affiliateInput.url.trim()) return;
    setForm({
      ...form,
      affiliate_links: [...form.affiliate_links, { ...affiliateInput }],
    });
    setAffiliateInput({ platform: "", url: "", label: "" });
  };

  const removeAffiliate = (idx) => {
    setForm({ ...form, affiliate_links: form.affiliate_links.filter((_, i) => i !== idx) });
  };

  const addSpec = () => {
    if (!specKey.trim()) return;
    try {
      const specs = JSON.parse(form.specifications || "{}");
      specs[specKey.trim()] = specValue.trim();
      setForm({ ...form, specifications: JSON.stringify(specs, null, 2) });
      setSpecKey("");
      setSpecValue("");
    } catch { /* ignore */ }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
    }
    setTagInput("");
  };

  const removeTag = (idx) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== idx) });
  };

  const addVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    if (!form.video_urls.includes(videoUrlInput.trim())) {
      setForm({ ...form, video_urls: [...form.video_urls, videoUrlInput.trim()] });
    }
    setVideoUrlInput("");
  };

  const removeVideoUrl = (idx) => {
    setForm({ ...form, video_urls: form.video_urls.filter((_, i) => i !== idx) });
  };

  const addFaq = () => {
    if (!faqInput.question.trim() || !faqInput.answer.trim()) return;
    setForm({ ...form, faqs: [...form.faqs, { ...faqInput }] });
    setFaqInput({ question: "", answer: "" });
  };

  const removeFaq = (idx) => {
    setForm({ ...form, faqs: form.faqs.filter((_, i) => i !== idx) });
  };

  const toggleBestSeller = async (product) => {
    try {
      await base44.entities.Product.update(product.id, { is_best_seller: !product.is_best_seller, updated_at: new Date().toISOString() });
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleNewArrival = async (product) => {
    try {
      await base44.entities.Product.update(product.id, { is_new_arrival: !product.is_new_arrival, updated_at: new Date().toISOString() });
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleTrending = async (product) => {
    try {
      await base44.entities.Product.update(product.id, { is_trending: !product.is_trending, updated_at: new Date().toISOString() });
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleStock = async (product) => {
    try {
      await base44.entities.Product.update(product.id, { is_out_of_stock: !product.is_out_of_stock, updated_at: new Date().toISOString() });
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const approveReview = async (review) => {
    try {
      await base44.entities.ProductReview.update(review.id, { is_approved: true });
      loadReviews();
      toast({ title: "Review approved" });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await base44.entities.ProductReview.delete(id);
      loadReviews();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const pendingReviews = reviews.filter(r => !r.is_approved);

  if (isAdmin === false) return <Navigate to="/" replace />;
  if (isAdmin === null) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products" subtitle="Shop Management">
      <div className="space-y-6">
        {/* Stats + Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.border}` }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Products</p>
              <p className="font-inter text-lg font-bold" style={{ color: G.text }}>{products.length}</p>
            </div>
            {pendingReviews.length > 0 && (
              <div className="px-4 py-2 rounded-xl" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.border}` }}>
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Pending Reviews</p>
                <p className="font-inter text-lg font-bold" style={{ color: G.text }}>{pendingReviews.length}</p>
              </div>
            )}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-inter text-xs font-bold"
            style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.border}` }}>
          <Search className="w-4 h-4" style={{ color: G.dim }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent outline-none font-inter text-sm"
            style={{ color: "rgba(255,255,255,0.90)" }}
          />
          {search && <X className="w-4 h-4 cursor-pointer" style={{ color: G.dim }} onClick={() => setSearch("")} />}
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="flex-shrink-0 px-3 py-1 rounded-lg font-inter text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: filterCategory === cat ? G.bgHi : "transparent",
                  border: `1px solid ${filterCategory === cat ? G.borderHi : G.faint}`,
                  color: filterCategory === cat ? G.text : G.dim,
                }}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-yellow-400 border-r-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3" style={{ color: G.dim, opacity: 0.4 }} />
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>No products yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
                {/* Image */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" style={{ color: G.dim, opacity: 0.4 }} />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-xs font-bold truncate" style={{ color: "rgba(255,255,255,0.90)" }}>
                    {p.name}
                  </p>
                  <p className="font-inter text-[10px] truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
                    {p.category || "Uncategorized"} {p.price_display ? `· ${p.price_display}` : ""}
                  </p>
                </div>
                {/* Status badges */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {p.is_best_seller && (
                    <Flame className="w-3.5 h-3.5" style={{ color: "#FB923C", fill: "#FB923C" }} />
                  )}
                  {p.is_new_arrival && (
                    <Sparkles className="w-3.5 h-3.5" style={{ color: "#60A5FA", fill: "#60A5FA" }} />
                  )}
                  {p.is_trending && (
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: "#C084FC" }} />
                  )}
                  {p.is_out_of_stock && (
                    <PackageX className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
                  )}
                  {p.is_featured && (
                    <Star className="w-3.5 h-3.5" style={{ color: G.text, fill: G.text }} />
                  )}
                  <span
                    className="px-1.5 py-0.5 rounded font-inter text-[8px] font-bold uppercase"
                    style={{
                      background: p.is_active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                      color: p.is_active ? "#86EFAC" : "rgba(255,255,255,0.40)",
                    }}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveOrder(p, -1)} className="p-1.5 rounded-lg hover:bg-white/5" title="Move up">
                    <ChevronUp className="w-3.5 h-3.5" style={{ color: G.dim }} />
                  </button>
                  <button onClick={() => moveOrder(p, 1)} className="p-1.5 rounded-lg hover:bg-white/5" title="Move down">
                    <ChevronDown className="w-3.5 h-3.5" style={{ color: G.dim }} />
                  </button>
                  <button onClick={() => toggleBestSeller(p)} className="p-1.5 rounded-lg hover:bg-white/5" title="Toggle best seller">
                    <Flame className="w-3.5 h-3.5" style={{ color: p.is_best_seller ? "#FB923C" : G.dim, fill: p.is_best_seller ? "#FB923C" : "transparent" }} />
                  </button>
                  <button onClick={() => toggleNewArrival(p)} className="p-1.5 rounded-lg hover:bg-white/5" title="Toggle new arrival">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: p.is_new_arrival ? "#60A5FA" : G.dim, fill: p.is_new_arrival ? "#60A5FA" : "transparent" }} />
                  </button>
                  <button onClick={() => toggleTrending(p)} className="p-1.5 rounded-lg hover:bg-white/5" title="Toggle trending">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: p.is_trending ? "#C084FC" : G.dim }} />
                  </button>
                  <button onClick={() => toggleStock(p)} className="p-1.5 rounded-lg hover:bg-white/5" title="Toggle out of stock">
                    <PackageX className="w-3.5 h-3.5" style={{ color: p.is_out_of_stock ? "#F87171" : G.dim }} />
                  </button>
                  <button onClick={() => toggleFeatured(p)} className="p-1.5 rounded-lg hover:bg-white/5" title="Toggle featured">
                    <Star className="w-3.5 h-3.5" style={{ color: p.is_featured ? G.text : G.dim, fill: p.is_featured ? G.text : "transparent" }} />
                  </button>
                  <button onClick={() => toggleActive(p)} className="p-1.5 rounded-lg hover:bg-white/5" title="Toggle visibility">
                    {p.is_active ? <Eye className="w-3.5 h-3.5" style={{ color: G.dim }} /> : <EyeOff className="w-3.5 h-3.5" style={{ color: G.dim }} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-white/5" title="Edit">
                    <Edit3 className="w-3.5 h-3.5" style={{ color: G.text }} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-white/5" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pending Reviews */}
        {pendingReviews.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
              Pending Reviews
            </h2>
            <div className="space-y-2">
              {pendingReviews.map(r => (
                <div key={r.id} className="p-3 rounded-xl space-y-1" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>{r.reviewer_name}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className="w-3 h-3" style={{ color: n <= (r.rating||0) ? G.text : G.faint, fill: n <= (r.rating||0) ? G.text : "transparent" }} />
                      ))}
                    </div>
                  </div>
                  {r.title && <p className="font-inter text-xs font-semibold" style={{ color: G.text }}>{r.title}</p>}
                  <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.60)" }}>{r.comment}</p>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => approveReview(r)} className="px-3 py-1 rounded-lg font-inter text-[10px] font-bold" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.40)", color: "#86EFAC" }}>
                      Approve
                    </button>
                    <button onClick={() => deleteReview(r.id)} className="px-3 py-1 rounded-lg font-inter text-[10px] font-bold" style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.30)", color: "#F87171" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end lg:items-center justify-center"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full lg:w-[600px] max-h-[90vh] overflow-y-auto rounded-t-2xl lg:rounded-2xl p-5 space-y-4"
              style={{ background: "linear-gradient(180deg, rgba(5,10,28,0.99) 0%, rgba(2,5,16,1) 100%)", border: `1px solid ${G.border}` }}
            >
              <div className="flex items-center justify-between sticky top-0" style={{ background: "rgba(5,10,28,0.95)" }}>
                <h2 className="font-inter text-sm font-bold" style={{ color: G.text }}>
                  {editId ? "Edit Product" : "New Product"}
                </h2>
                <button onClick={() => setShowForm(false)}><X className="w-4 h-4" style={{ color: G.dim }} /></button>
              </div>

              {/* Basic Fields */}
              <div className="space-y-3">
                <FormField label="Name *">
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" />
                </FormField>
                <FormField label="Slug *">
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="form-input" />
                </FormField>
                <FormField label="Category">
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input" placeholder="e.g. Books, Tools, Incense" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Brand">
                    <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="form-input" placeholder="e.g. Dabur, Hamdard" />
                  </FormField>
                  <FormField label="SKU">
                    <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="form-input" placeholder="e.g. AYR-001" />
                  </FormField>
                </div>
                <FormField label="Short Description">
                  <input value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} className="form-input" />
                </FormField>
                <FormField label="Full Description (English)">
                  <textarea value={form.full_description} onChange={e => setForm({ ...form, full_description: e.target.value })} rows={4} className="form-input resize-none" />
                </FormField>
                <FormField label="Malayalam Description">
                  <textarea value={form.malayalam_description} onChange={e => setForm({ ...form, malayalam_description: e.target.value })} rows={4} className="form-input resize-none" />
                </FormField>
                <FormField label="Usage Instructions">
                  <textarea value={form.usage_instructions} onChange={e => setForm({ ...form, usage_instructions: e.target.value })} rows={3} className="form-input resize-none" />
                </FormField>
                <FormField label="Ingredients">
                  <textarea value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} rows={3} className="form-input resize-none" />
                </FormField>
                <FormField label="Benefits">
                  <textarea value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} rows={3} className="form-input resize-none" />
                </FormField>
                <FormField label="Warnings">
                  <textarea value={form.warnings} onChange={e => setForm({ ...form, warnings: e.target.value })} rows={3} className="form-input resize-none" />
                </FormField>
                <FormField label="Rules & Precautions">
                  <textarea value={form.rules_precautions} onChange={e => setForm({ ...form, rules_precautions: e.target.value })} rows={3} className="form-input resize-none" />
                </FormField>
                <FormField label="Storage Instructions">
                  <textarea value={form.storage_instructions} onChange={e => setForm({ ...form, storage_instructions: e.target.value })} rows={3} className="form-input resize-none" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Price Display">
                    <input value={form.price_display} onChange={e => setForm({ ...form, price_display: e.target.value })} className="form-input" placeholder="e.g. AED 50" />
                  </FormField>
                  <FormField label="Compare Price (original, for discount)">
                    <input value={form.compare_price_display} onChange={e => setForm({ ...form, compare_price_display: e.target.value })} className="form-input" placeholder="e.g. AED 80" />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Rating Display">
                    <input value={form.rating_display} onChange={e => setForm({ ...form, rating_display: e.target.value })} className="form-input" placeholder="e.g. 4.5/5" />
                  </FormField>
                  <FormField label="Discount % (optional, overrides auto-calc)">
                    <input type="number" value={form.discount_percentage} onChange={e => setForm({ ...form, discount_percentage: e.target.value })} className="form-input" placeholder="e.g. 25" />
                  </FormField>
                </div>
                <FormField label="Video URL (single, legacy)">
                  <input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} className="form-input" placeholder="https://youtube.com/watch?v=..." />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="PDF Attachment URL">
                    <input value={form.pdf_url} onChange={e => setForm({ ...form, pdf_url: e.target.value })} className="form-input" placeholder="https://.../datasheet.pdf" />
                  </FormField>
                  <div className="flex items-end gap-3 pb-2">
                    <FormField label="Seller WhatsApp">
                      <input value={form.seller_whatsapp} onChange={e => setForm({ ...form, seller_whatsapp: e.target.value })} className="form-input" placeholder="97150XXXXXXX" />
                    </FormField>
                  </div>
                </div>
                <FormField label="Seller Email">
                  <input value={form.seller_email} onChange={e => setForm({ ...form, seller_email: e.target.value })} className="form-input" placeholder="seller@example.com" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Sort Order">
                    <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="form-input" />
                  </FormField>
                  <div className="flex items-end gap-2 pb-2 flex-wrap">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                      <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>Active</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                      <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>Featured</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.is_best_seller} onChange={e => setForm({ ...form, is_best_seller: e.target.checked })} />
                      <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>Best Seller</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.is_new_arrival} onChange={e => setForm({ ...form, is_new_arrival: e.target.checked })} />
                      <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>New Arrival</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.is_out_of_stock} onChange={e => setForm({ ...form, is_out_of_stock: e.target.checked })} />
                      <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>Out of Stock</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.is_trending} onChange={e => setForm({ ...form, is_trending: e.target.checked })} />
                      <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>Trending</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>Images</p>
                <div className="flex gap-2">
                  <input
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="form-input flex-1"
                  />
                  <button onClick={addImage} className="px-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                    <Plus className="w-4 h-4" style={{ color: G.text }} />
                  </button>
                </div>
                {form.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden" style={{ border: `1px solid ${G.faint}` }}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(idx)} className="absolute top-0 right-0 p-0.5" style={{ background: "rgba(0,0,0,0.70)" }}>
                          <X className="w-2.5 h-2.5" style={{ color: "#F87171" }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Affiliate Links */}
              <div className="space-y-2">
                <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>Affiliate / Buy Links (External Link Mode)</p>
                <div className="grid grid-cols-3 gap-2">
                  <input value={affiliateInput.platform} onChange={e => setAffiliateInput({ ...affiliateInput, platform: e.target.value })} placeholder="Platform (Amazon)" className="form-input" />
                  <input value={affiliateInput.url} onChange={e => setAffiliateInput({ ...affiliateInput, url: e.target.value })} placeholder="URL" className="form-input col-span-2" />
                </div>
                <input value={affiliateInput.label} onChange={e => setAffiliateInput({ ...affiliateInput, label: e.target.value })} placeholder="Button label (e.g. Buy on Amazon) — optional" className="form-input" />
                <button onClick={addAffiliate} className="px-3 py-1.5 rounded-lg font-inter text-[10px] font-bold" style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}>
                  + Add Link
                </button>
                {form.affiliate_links.length > 0 && (
                  <div className="space-y-1">
                    {form.affiliate_links.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.faint}` }}>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" style={{ color: G.dim }} />
                        <span className="font-inter text-[11px] font-bold" style={{ color: G.text }}>{link.platform}</span>
                        <span className="font-inter text-[10px] truncate flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>{link.url}</span>
                        <button onClick={() => removeAffiliate(idx)}><X className="w-3 h-3" style={{ color: "#F87171" }} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="space-y-2">
                <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>Specifications</p>
                <div className="flex gap-2">
                  <input value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="Key (e.g. Material)" className="form-input flex-1" />
                  <input value={specValue} onChange={e => setSpecValue(e.target.value)} placeholder="Value (e.g. Brass)" className="form-input flex-1" />
                  <button onClick={addSpec} className="px-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                    <Plus className="w-4 h-4" style={{ color: G.text }} />
                  </button>
                </div>
                <textarea value={form.specifications} onChange={e => setForm({ ...form, specifications: e.target.value })} rows={3} className="form-input resize-none font-mono text-[10px]" />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>Tags</p>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag..." className="form-input flex-1" onKeyDown={e => e.key === "Enter" && addTag()} />
                  <button onClick={addTag} className="px-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                    <Plus className="w-4 h-4" style={{ color: G.text }} />
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {form.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md flex items-center gap-1 font-inter text-[10px]" style={{ background: G.bg, border: `1px solid ${G.faint}`, color: G.text }}>
                        {tag}
                        <button onClick={() => removeTag(idx)}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Videos */}
              <div className="space-y-2">
                <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>Additional Videos (multiple)</p>
                <div className="flex gap-2">
                  <input
                    value={videoUrlInput}
                    onChange={e => setVideoUrlInput(e.target.value)}
                    placeholder="Paste video URL..."
                    className="form-input flex-1"
                    onKeyDown={e => e.key === "Enter" && addVideoUrl()}
                  />
                  <button onClick={addVideoUrl} className="px-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                    <Plus className="w-4 h-4" style={{ color: G.text }} />
                  </button>
                </div>
                {form.video_urls.length > 0 && (
                  <div className="space-y-1">
                    {form.video_urls.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.faint}` }}>
                        <Play className="w-3 h-3 flex-shrink-0" style={{ color: G.dim }} />
                        <span className="font-inter text-[10px] truncate flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>{url}</span>
                        <button onClick={() => removeVideoUrl(idx)}><X className="w-3 h-3" style={{ color: "#F87171" }} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FAQs */}
              <div className="space-y-2">
                <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>FAQs</p>
                <input
                  value={faqInput.question}
                  onChange={e => setFaqInput({ ...faqInput, question: e.target.value })}
                  placeholder="Question..."
                  className="form-input"
                />
                <textarea
                  value={faqInput.answer}
                  onChange={e => setFaqInput({ ...faqInput, answer: e.target.value })}
                  placeholder="Answer..."
                  rows={2}
                  className="form-input resize-none"
                />
                <button onClick={addFaq} className="px-3 py-1.5 rounded-lg font-inter text-[10px] font-bold" style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}>
                  + Add FAQ
                </button>
                {form.faqs.length > 0 && (
                  <div className="space-y-1">
                    {form.faqs.map((faq, idx) => (
                      <div key={idx} className="px-2 py-1.5 rounded-lg space-y-0.5" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.faint}` }}>
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-[11px] font-bold flex-1" style={{ color: G.text }}>{faq.question}</span>
                          <button onClick={() => removeFaq(idx)}><X className="w-3 h-3" style={{ color: "#F87171" }} /></button>
                        </div>
                        <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-inter text-xs font-bold disabled:opacity-40"
                  style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Saving..." : editId ? "Update Product" : "Create Product"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl font-inter text-xs font-bold" style={{ border: `1px solid ${G.faint}`, color: "rgba(255,255,255,0.50)" }}>
                  Cancel
                </button>
              </div>

              <style>{`
                .form-input {
                  width: 100%;
                  padding: 8px 12px;
                  border-radius: 8px;
                  background: rgba(255,255,255,0.04);
                  border: 1px solid rgba(212,175,55,0.22);
                  color: rgba(255,255,255,0.90);
                  font-family: Inter, sans-serif;
                  font-size: 13px;
                  outline: none;
                }
                .form-input:focus { border-color: rgba(212,175,55,0.55); }
                .form-input::placeholder { color: rgba(255,255,255,0.25); }
              `}</style>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function FormField({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.dim }}>{label}</p>
      {children}
    </div>
  );
}