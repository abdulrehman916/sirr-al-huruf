import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Star, ExternalLink } from "lucide-react";

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

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const primaryImage = product.images?.[0];
  const hasAffiliate = product.affiliate_links?.length > 0;

  const handleClick = () => {
    navigate(`/shop/${product.slug || product.id}`);
  };

  const handleBuy = (e, link) => {
    e.stopPropagation();
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      onClick={handleClick}
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.95) 0%, rgba(4,10,24,0.98) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10" style={{ color: G.dim, opacity: 0.4 }} />
          </div>
        )}
        {/* Category badge */}
        {product.category && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-md font-inter text-[8px] font-bold uppercase tracking-wider"
            style={{
              background: "rgba(2,7,16,0.85)",
              border: `1px solid ${G.border}`,
              color: G.text,
              backdropFilter: "blur(8px)",
            }}
          >
            {product.category}
          </div>
        )}
        {/* Featured badge */}
        {product.is_featured && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-md font-inter text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.30) 0%, rgba(212,175,55,0.15) 100%)",
              border: `1px solid ${G.borderHi}`,
              color: G.text,
              backdropFilter: "blur(8px)",
            }}
          >
            <Star className="w-2.5 h-2.5" style={{ fill: G.text }} />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2">
        <h3
          className="font-inter text-sm font-bold leading-tight line-clamp-2"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          {product.name}
        </h3>

        {product.short_description && (
          <p
            className="font-inter text-[11px] leading-relaxed line-clamp-2"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {product.short_description}
          </p>
        )}

        {/* Rating + Price */}
        <div className="flex items-center justify-between pt-1">
          {product.rating_display ? (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" style={{ color: G.text, fill: G.text }} />
              <span className="font-inter text-[10px] font-semibold" style={{ color: G.text }}>
                {product.rating_display}
              </span>
            </div>
          ) : (
            <span />
          )}
          {product.price_display && (
            <span className="font-inter text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.70)" }}>
              {product.price_display}
            </span>
          )}
        </div>

        {/* Buy button */}
        {hasAffiliate && (
          <button
            onClick={(e) => handleBuy(e, product.affiliate_links[0])}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-inter text-[11px] font-bold transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.08) 100%)",
              border: `1px solid ${G.border}`,
              color: G.text,
            }}
          >
            <ExternalLink className="w-3 h-3" />
            {product.affiliate_links[0].label || `Buy on ${product.affiliate_links[0].platform}`}
          </button>
        )}
      </div>
    </motion.div>
  );
}