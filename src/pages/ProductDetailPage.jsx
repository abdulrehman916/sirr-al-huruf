import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ShoppingBag, Star, ExternalLink, Play, X, ZoomIn,
  ChevronLeft, ChevronRight, CheckCircle, MessageSquare
} from "lucide-react";
import PageLayout from "../components/PageLayout";
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

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ reviewer_name: "", rating: 5, title: "", comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // Try slug match first, then ID
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

  const loadReviews = async (pid) => {
    try {
      const list = await base44.entities.ProductReview.filter({ product_id: pid });
      setReviews(list || []);
    } catch (err) {
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
    } catch (err) {
      // ignore
    } finally {
      setSubmittingReview(false);
    }
  };

  // Embed URL helper for YouTube/Vimeo
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
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 border-4 rounded-full animate-spin"
            style={{ borderColor: `${G.faint} transparent ${G.faint} transparent` }}
          />
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="text-center py-20 space-y-4">
          <ShoppingBag className="w-12 h-12 mx-auto" style={{ color: G.dim, opacity: 0.4 }} />
          <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>Product not found</p>
          <button
            onClick={() => navigate("/shop")}
            className="font-inter text-xs underline"
            style={{ color: G.text }}
          >
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

  return (
    <PageLayout>
      {/* Back button */}
      <div className="px-4 pt-3 pb-1">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-1.5 font-inter text-xs font-semibold"
          style={{ color: G.dim }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Shop
        </button>
      </div>

      <div className="px-4 pb-8 space-y-6">
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="space-y-2">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-black/40"
              style={{ border: `1px solid ${G.border}` }}
            >
              <img
                src={images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                style={{ transform: zoomed ? "scale(2)" : "scale(1)", transformOrigin: "center", transition: "transform 0.3s ease" }}
                onClick={() => setZoomed(!zoomed)}
              />
              {/* Zoom hint */}
              {!zoomed && (
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg flex items-center gap-1" style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)" }}>
                  <ZoomIn className="w-3 h-3" style={{ color: G.text }} />
                  <span className="font-inter text-[8px] font-semibold" style={{ color: G.text }}>Tap to zoom</span>
                </div>
              )}
              {/* Lightbox button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-2 right-2 p-2 rounded-lg"
                style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)", border: `1px solid ${G.faint}` }}
              >
                <ExternalLink className="w-3.5 h-3.5" style={{ color: G.text }} />
              </button>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg" style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)" }}>
                    <ChevronLeft className="w-4 h-4" style={{ color: "rgba(255,255,255,0.80)" }} />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg" style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)" }}>
                    <ChevronRight className="w-4 h-4" style={{ color: "rgba(255,255,255,0.80)" }} />
                  </button>
                </>
              )}
              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg font-inter text-[10px] font-semibold" style={{ background: "rgba(2,7,16,0.80)", backdropFilter: "blur(8px)", color: G.text }}>
                  {activeImageIdx + 1} / {images.length}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden"
                    style={{
                      border: idx === activeImageIdx ? `2px solid ${G.borderHi}` : `1px solid ${G.faint}`,
                      opacity: idx === activeImageIdx ? 1 : 0.5,
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
        <div className="space-y-3">
          {product.category && (
            <span
              className="inline-block px-2.5 py-0.5 rounded-md font-inter text-[9px] font-bold uppercase tracking-widest"
              style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}
            >
              {product.category}
            </span>
          )}
          <h1 className="font-inter text-xl font-bold leading-tight" style={{ color: "rgba(255,255,255,0.95)" }}>
            {product.name}
          </h1>
          {product.short_description && (
            <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              {product.short_description}
            </p>
          )}
          {/* Rating + Price */}
          <div className="flex items-center gap-4">
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
                <span className="font-inter text-xs font-semibold" style={{ color: G.text }}>
                  {avgRating}
                </span>
                <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                  ({approvedReviews.length})
                </span>
              </div>
            )}
            {product.price_display && (
              <span className="font-inter text-base font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                {product.price_display}
              </span>
            )}
          </div>
        </div>

        {/* Buy Buttons */}
        {affiliateLinks.length > 0 && (
          <div className="space-y-2">
            {affiliateLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleBuy(link)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-inter text-sm font-bold transition-all"
                style={{
                  background: idx === 0
                    ? "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.10) 100%)"
                    : "rgba(8,16,38,0.60)",
                  border: `1px solid ${idx === 0 ? G.borderHi : G.border}`,
                  color: G.text,
                  boxShadow: idx === 0 ? `0 0 20px ${G.glow}` : "none",
                }}
              >
                <ExternalLink className="w-4 h-4" />
                {link.label || `Buy on ${link.platform}`}
              </button>
            ))}
          </div>
        )}

        {/* Video */}
        {embedUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" style={{ color: G.text }} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Product Video
              </h2>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black" style={{ border: `1px solid ${G.border}` }}>
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </div>
          </div>
        )}

        {/* Full Description */}
        {product.full_description && (
          <div className="space-y-2">
            <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
              Description
            </h2>
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}
            >
              <p className="font-inter text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.75)" }}>
                {product.full_description}
              </p>
            </div>
          </div>
        )}

        {/* Specifications */}
        {specEntries.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
              Specifications
            </h2>
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
              {specEntries.map(([key, value], idx) => (
                <div
                  key={key}
                  className="flex items-start justify-between px-4 py-2.5"
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
          </div>
        )}

        {/* Reviews Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: G.text }} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Reviews ({approvedReviews.length})
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
            <div className="text-center py-8">
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {approvedReviews.map(review => (
                <div key={review.id} className="rounded-xl p-3.5 space-y-1.5" style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.faint}` }}>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {review.reviewer_name}
                    </span>
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
                </div>
              ))}
            </div>
          )}
        </div>
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