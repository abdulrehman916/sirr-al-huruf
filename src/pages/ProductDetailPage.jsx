import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ShoppingBag, Star, ExternalLink, Play, X, ZoomIn,
  ChevronLeft, ChevronRight, CheckCircle, MessageSquare, Heart, Share2,
  Link2, Sparkles, Package, Shield, Truck, Award, ChevronDown, ChevronUp
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { base44 } from "../api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { ProductDetailSkeleton } from "../components/shop/ProductSkeleton";
import RelatedProducts from "../components/shop/RelatedProducts";
import {
  isInWishlist, toggleWishlist, shareProduct, copyProductLink,
  addRecentlyViewed, extractFeatures, getRecentlyViewed as getRecentlyViewedList
} from "@/lib/shopUtils";

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

// Trust badges shown below buy buttons
const TRUST_BADGES = [
  { icon: Shield, label: "Quality Assured" },
  { icon: Truck, label: "External Shipping" },
  { icon: Award, label: "Curated Selection" },
];

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ reviewer_name: "", rating: 5, title: "", comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [wished, setWished] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    loadProduct();
    loadAllProducts();
    setRecentlyViewed(getRecentlyViewedList());
  }, [productId]);

  useEffect(() => {
    if (product) {
      setWished(isInWishlist(product.id));
      addRecentlyViewed(product);
    }
  }, [product]);

  useEffect(() => {
    const handler = () => {
      if (product) setWished(isInWishlist(product.id));
      setRecentlyViewed(getRecentlyViewedList());
    };
    window.addEventListener("shop-wishlist-changed", handler);
    window.addEventListener("shop-recently-viewed-changed", handler);
    return () => {
      window.removeEventListener("shop-wishlist-changed", handler);
      window.removeEventListener("shop-recently-viewed-changed", handler);
    };
  }, [product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setActiveImageIdx(0);
      let list = await base44.entities.Product.filter({ slug: productId });
      if (!list || list.length === 0) {
        list = await base44.entities.Product.filter({ product_id: productId });
      }
      if (list && list.length > 0) {
        const p = list[0];
        setProduct(p);
        loadReviews(p.product_id);
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      const list = await base44.entities.Product.list("-created_date", 200);
      setAllProducts(list || []);
    } catch {
      setAllProducts([]);
    }
  };

  const loadReviews = async (pid) => {
    try {
      const list = await base44.entities.ProductReview.filter({ product_id: pid });
      setReviews(list || []);
    } catch {
      setReviews([]);
    }
  };

  const approvedReviews = useMemo(
    () => reviews.filter(r => r.is_approved !== false),
    [reviews]
  );

  const avgRating = useMemo(() => {
    if (approvedReviews.length === 0) return null;
    const sum = approvedReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / approvedReviews.length).toFixed(1);
  }, [approvedReviews]);

  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach(r => {
      const rating = Math.round(r.rating || 0);
      if (breakdown[rating] !== undefined) breakdown[rating]++;
    });
    return breakdown;
  }, [approvedReviews]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.id !== product.id && p.is_active !== false && p.category === product.category)
      .slice(0, 8);
  }, [allProducts, product]);

  const recentlyViewedFiltered = useMemo(() => {
    if (!product) return recentlyViewed;
    return recentlyViewed.filter(p => p.id !== product.id).slice(0, 6);
  }, [recentlyViewed, product]);

  const features = useMemo(() => product ? extractFeatures(product) : [], [product]);

  const handleBuy = (link) => {
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const nextImage = () => {
    if (!product?.images) return;
    setActiveImageIdx(prev => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setActiveImageIdx(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleWish = () => {
    if (!product) return;
    const added = toggleWishlist(product.id);
    setWished(added);
    toast({ title: added ? "Added to wishlist" : "Removed from wishlist", duration: 1800 });
  };

  const handleShare = () => {
    if (!product) return;
    const shared = shareProduct(product);
    toast({ title: "Share dialog opened", duration: 1800 });
  };

  const handleCopyLink = () => {
    if (!product) return;
    copyProductLink(product.slug || product.id).then(success => {
      toast({ title: success ? "Link copied to clipboard" : "Failed to copy", duration: 1800 });
    });
  };

  const handleMouseMove = (e) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const submitReview = async () => {
    if (!reviewForm.reviewer_name.trim() || !reviewForm.comment.trim()) return;
    try {
      setSubmittingReview(true);
      await base44.entities.ProductReview.create({
        review_id: `REV-${Date.now()}`,
        product_id: product.product_id,
        reviewer_name: reviewForm.reviewer_name.trim(),
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
        is_approved: false,
        created_at: new Date().toISOString(),
      });
      setReviewForm({ reviewer_name: "", rating: 5, title: "", comment: "" });
      setShowReviewForm(false);
      toast({ title: "Review submitted! It will appear after approval.", duration: 3000 });
    } catch (err) {
      toast({ title: "Error submitting review", variant: "destructive", duration: 3000 });
    } finally {
      setSubmittingReview(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  if (loading) {
    return (
      <PageLayout>
        <ProductDetailSkeleton />
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="text-center py-20 space-y-4">
          <div className="relative w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle, ${G.bg} 0%, transparent 70%)` }}>
            <div className="absolute inset-0 rounded-full" style={{ border: `2px dashed ${G.faint}` }} />
            <ShoppingBag className="w-8 h-8" style={{ color: G.dim }} />
          </div>
          <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>Product not found</p>
          <button onClick={() => navigate("/shop")} className="font-inter text-xs underline" style={{ color: G.text }}>
            ← Back to Shop
          </button>
        </div>
      </PageLayout>
    );
  }

  const images = product.images || [];
  const specs = product.specifications || {};
  const specEntries = Object.entries(specs).filter(([, v]) => v);
  const affiliateLinks = product.affiliate_links || [];
  const embedUrl = getEmbedUrl(product.video_url);
  const isLongDesc = product.full_description && product.full_description.length > 300;

  return (
    <PageLayout>
      {/* Top action bar */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-1.5 font-inter text-xs font-semibold"
          style={{ color: G.dim }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Shop
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg"
            style={{ background: G.bg, border: `1px solid ${G.faint}` }}
          >
            <Link2 className="w-3.5 h-3.5" style={{ color: G.dim }} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg"
            style={{ background: G.bg, border: `1px solid ${G.faint}` }}
          >
            <Share2 className="w-3.5 h-3.5" style={{ color: G.dim }} />
          </button>
          <button
            onClick={handleWish}
            className="p-2 rounded-lg"
            style={{
              background: wished ? "rgba(248,113,113,0.15)" : G.bg,
              border: wished ? "1px solid rgba(248,113,113,0.40)" : `1px solid ${G.faint}`,
            }}
          >
            <Heart
              className="w-3.5 h-3.5"
              style={{
                color: wished ? "#F87171" : G.dim,
                fill: wished ? "#F87171" : "transparent",
              }}
            />
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-6">
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="space-y-2.5">
            <motion.div
              key={activeImageIdx}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-black/40"
              style={{ border: `1px solid ${G.border}`, boxShadow: "0 8px 40px rgba(0,0,0,0.50)" }}
            >
              <img
                src={images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                style={{
                  transform: zoomed ? "scale(2.5)" : "scale(1)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transition: "transform 0.2s ease-out",
                }}
                onClick={() => setZoomed(!zoomed)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomed(false)}
              />
              {/* Zoom hint */}
              {!zoomed && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg flex items-center gap-1" style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)", border: `1px solid ${G.faint}` }}>
                  <ZoomIn className="w-3 h-3" style={{ color: G.text }} />
                  <span className="font-inter text-[9px] font-semibold" style={{ color: G.text }}>Tap to zoom</span>
                </div>
              )}
              {/* Fullscreen button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-3 right-3 p-2 rounded-lg"
                style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)", border: `1px solid ${G.faint}` }}
              >
                <ExternalLink className="w-3.5 h-3.5" style={{ color: G.text }} />
              </button>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-transform hover:scale-110" style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)" }}>
                    <ChevronLeft className="w-4 h-4" style={{ color: "rgba(255,255,255,0.80)" }} />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-transform hover:scale-110" style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)" }}>
                    <ChevronRight className="w-4 h-4" style={{ color: "rgba(255,255,255,0.80)" }} />
                  </button>
                </>
              )}
              {/* Counter dots */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className="rounded-full transition-all"
                      style={{
                        width: idx === activeImageIdx ? 18 : 6,
                        height: 6,
                        background: idx === activeImageIdx ? G.text : "rgba(255,255,255,0.30)",
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all"
                    style={{
                      border: idx === activeImageIdx ? `2px solid ${G.borderHi}` : `1px solid ${G.faint}`,
                      opacity: idx === activeImageIdx ? 1 : 0.5,
                      transform: idx === activeImageIdx ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {product.category && (
            <span
              className="inline-block px-2.5 py-0.5 rounded-md font-inter text-[9px] font-bold uppercase tracking-widest"
              style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}
            >
              {product.category}
            </span>
          )}
          <h1 className="font-inter text-xl sm:text-2xl font-bold leading-tight" style={{ color: "rgba(255,255,255,0.95)" }}>
            {product.name}
          </h1>
          {product.short_description && (
            <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              {product.short_description}
            </p>
          )}
          {/* Rating + Price */}
          <div className="flex items-center gap-4 flex-wrap">
            {avgRating && (
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star
                      key={n}
                      className="w-3.5 h-3.5"
                      style={{
                        color: n <= Math.round(avgRating) ? G.text : G.faint,
                        fill: n <= Math.round(avgRating) ? G.text : "transparent",
                      }}
                    />
                  ))}
                </div>
                <span className="font-inter text-xs font-semibold" style={{ color: G.text }}>{avgRating}</span>
                <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>({approvedReviews.length} {approvedReviews.length === 1 ? "review" : "reviews"})</span>
              </div>
            )}
            {product.price_display && (
              <span className="font-inter text-lg font-bold" style={{ color: "rgba(255,255,255,0.90)" }}>
                {product.price_display}
              </span>
            )}
          </div>
        </motion.div>

        {/* Buy Buttons */}
        {affiliateLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            {affiliateLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleBuy(link)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-inter text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: idx === 0
                    ? "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.10) 100%)"
                    : "rgba(8,16,38,0.60)",
                  border: `1px solid ${idx === 0 ? G.borderHi : G.border}`,
                  color: G.text,
                  boxShadow: idx === 0 ? `0 0 24px ${G.glow}` : "none",
                }}
              >
                <ExternalLink className="w-4 h-4" />
                {link.label || `Buy on ${link.platform}`}
              </button>
            ))}
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {TRUST_BADGES.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" style={{ color: G.dim }} />
                    <span className="font-inter text-[9px] font-medium" style={{ color: "rgba(255,255,255,0.40)" }}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Video */}
        {embedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" style={{ color: G.text }} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Product Video
              </h2>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black" style={{ border: `1px solid ${G.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.40)" }}>
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </div>
          </motion.div>
        )}

        {/* Features & Benefits */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: G.text }} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Features & Benefits
              </h2>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: G.bg, border: `1px solid ${G.faint}` }}
                  >
                    <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: G.text }} />
                    <span className="font-inter text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Description (with expand/collapse for long text) */}
        {product.full_description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
              Description
            </h2>
            <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
              <p
                className="font-inter text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  maxHeight: isLongDesc && !descExpanded ? "120px" : "none",
                  overflow: "hidden",
                }}
              >
                {product.full_description}
              </p>
              {isLongDesc && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="flex items-center gap-1 font-inter text-[11px] font-bold"
                  style={{ color: G.text }}
                >
                  {descExpanded ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Read more <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Specifications */}
        {specEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" style={{ color: G.text }} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Specifications
              </h2>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
              {specEntries.map(([key, value], idx) => (
                <div
                  key={key}
                  className="flex items-start justify-between px-4 py-3"
                  style={{ borderBottom: idx < specEntries.length - 1 ? `1px solid ${G.faint}` : "none" }}
                >
                  <span className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.50)" }}>
                    {key}
                  </span>
                  <span className="font-inter text-xs font-medium text-right ml-3" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: G.text }} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Customer Reviews ({approvedReviews.length})
              </h2>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-3 py-1 rounded-lg font-inter text-[10px] font-bold"
              style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}
            >
              Write Review
            </button>
          </div>

          {/* Rating Summary */}
          {approvedReviews.length > 0 && (
            <div className="rounded-xl p-4 flex items-center gap-5" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
              <div className="text-center flex-shrink-0">
                <p className="font-inter text-3xl font-bold" style={{ color: G.text }}>{avgRating}</p>
                <div className="flex justify-center my-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star
                      key={n}
                      className="w-3 h-3"
                      style={{
                        color: n <= Math.round(avgRating) ? G.text : G.faint,
                        fill: n <= Math.round(avgRating) ? G.text : "transparent",
                      }}
                    />
                  ))}
                </div>
                <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {approvedReviews.length} {approvedReviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
              {/* Breakdown bars */}
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = ratingBreakdown[stars];
                  const pct = approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="font-inter text-[9px] font-semibold w-3" style={{ color: "rgba(255,255,255,0.50)" }}>{stars}</span>
                      <Star className="w-2 h-2" style={{ color: G.dim, fill: G.dim }} />
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ background: G.text }}
                        />
                      </div>
                      <span className="font-inter text-[9px] w-4 text-right" style={{ color: "rgba(255,255,255,0.40)" }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.border}` }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={reviewForm.reviewer_name}
                    onChange={e => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-transparent outline-none font-inter text-sm"
                    style={{ border: `1px solid ${G.faint}`, color: "rgba(255,255,255,0.90)" }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>Rating:</span>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                        <Star
                          className="w-5 h-5"
                          style={{
                            color: n <= reviewForm.rating ? G.text : G.faint,
                            fill: n <= reviewForm.rating ? G.text : "transparent",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Review title (optional)"
                    value={reviewForm.title}
                    onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-transparent outline-none font-inter text-sm"
                    style={{ border: `1px solid ${G.faint}`, color: "rgba(255,255,255,0.90)" }}
                  />
                  <textarea
                    placeholder="Write your review..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-transparent outline-none font-inter text-sm resize-none"
                    style={{ border: `1px solid ${G.faint}`, color: "rgba(255,255,255,0.90)" }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitReview}
                      disabled={submittingReview || !reviewForm.reviewer_name.trim() || !reviewForm.comment.trim()}
                      className="flex-1 py-2 rounded-lg font-inter text-xs font-bold disabled:opacity-30"
                      style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 rounded-lg font-inter text-xs font-bold"
                      style={{ background: "transparent", border: `1px solid ${G.faint}`, color: "rgba(255,255,255,0.50)" }}
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Reviews are moderated and will appear after admin approval.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          {approvedReviews.length === 0 ? (
            <div className="text-center py-8 rounded-xl" style={{ background: "rgba(8,16,38,0.40)", border: `1px solid ${G.faint}` }}>
              <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: G.dim, opacity: 0.4 }} />
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {approvedReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl p-3.5 space-y-1.5"
                  style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-inter text-[10px] font-bold" style={{ background: G.bgHi, color: G.text }}>
                        {review.reviewer_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-inter text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                        {review.reviewer_name}
                      </span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star
                          key={n}
                          className="w-3 h-3"
                          style={{
                            color: n <= (review.rating || 0) ? G.text : G.faint,
                            fill: n <= (review.rating || 0) ? G.text : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <p className="font-inter text-xs font-semibold" style={{ color: G.text }}>
                      {review.title}
                    </p>
                  )}
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {review.comment}
                  </p>
                  {review.created_at && (
                    <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            title="Related Products"
            icon={Sparkles}
            products={relatedProducts}
          />
        )}

        {/* Recently Viewed */}
        {recentlyViewedFiltered.length > 0 && (
          <RelatedProducts
            title="Recently Viewed"
            icon={ArrowLeft}
            products={recentlyViewedFiltered}
            isRecent
          />
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.95)" }}
          >
            <button className="absolute top-4 right-4 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.10)" }}>
              <X className="w-6 h-6" style={{ color: "rgba(255,255,255,0.80)" }} />
            </button>
            <img
              src={images[activeImageIdx]}
              alt={product.name}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={e => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 p-3 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }}>
                  <ChevronLeft className="w-5 h-5" style={{ color: "rgba(255,255,255,0.80)" }} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 p-3 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }}>
                  <ChevronRight className="w-5 h-5" style={{ color: "rgba(255,255,255,0.80)" }} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}