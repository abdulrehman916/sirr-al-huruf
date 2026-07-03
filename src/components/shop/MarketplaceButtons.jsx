import {
  ShoppingBag, ExternalLink, MessageCircle, Mail, Sun,
} from "lucide-react";
import { useCountryProfile } from "@/hooks/useCountryProfile";

const G = {
  text: "#F5D060", dim: "rgba(212,175,55,0.55)",
  border: "rgba(212,175,55,0.30)", glow: "rgba(212,175,55,0.18)",
};

const ICON_MAP = { ShoppingBag, ExternalLink, MessageCircle, Mail, Sun };

function getIcon(mp) {
  return ICON_MAP[mp.icon] || ExternalLink;
}

function handleClick(btn, product) {
  if (btn.type === "affiliate") {
    window.open(btn.link.url, "_blank", "noopener,noreferrer");
  } else if (btn.type === "whatsapp") {
    const num = String(btn.value).replace(/[^0-9]/g, "");
    const msg = `Hi, I'm interested in: ${product.name}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  } else if (btn.type === "email") {
    const subject = `Inquiry: ${product.name}`;
    window.open(`mailto:${btn.value}?subject=${encodeURIComponent(subject)}`, "_blank");
  }
}

/**
 * Country-aware marketplace buttons.
 * compact=true: renders a single button (top priority marketplace) for product cards.
 * compact=false: renders full vertical list for product detail page.
 * Falls back to External Website if no country-specific marketplace exists.
 */
export default function MarketplaceButtons({ product, compact = false }) {
  const { getMarketplaceButtons } = useCountryProfile();
  const buttons = getMarketplaceButtons(product);

  if (buttons.length === 0) return null;

  if (compact) {
    const first = buttons[0];
    const Icon = getIcon(first.mp);
    const label = product.is_out_of_stock
      ? "Out of Stock"
      : first.type === "affiliate"
        ? (first.link.label || `Buy on ${first.mp.name}`)
        : first.mp.name;

    return (
      <button
        onClick={(e) => { e.stopPropagation(); if (!product.is_out_of_stock) handleClick(first, product); }}
        disabled={product.is_out_of_stock}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-inter text-[11px] font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, ${first.mp.color}22 0%, ${first.mp.color}08 100%)`,
          border: `1px solid ${first.mp.color}55`,
          color: G.text,
        }}
      >
        <Icon className="w-3 h-3" style={{ color: first.mp.color }} />
        {label}
      </button>
    );
  }

  // Full mode — product detail page
  return (
    <div className="space-y-2">
      {buttons.map((btn, i) => {
        const Icon = getIcon(btn.mp);
        const label = btn.type === "affiliate"
          ? (btn.link.label || `Buy on ${btn.mp.name}`)
          : btn.mp.name;
        const isPrimary = i === 0;

        return (
          <button
            key={i}
            onClick={() => { if (!product.is_out_of_stock) handleClick(btn, product); }}
            disabled={product.is_out_of_stock}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-inter text-sm font-bold transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: isPrimary
                ? `linear-gradient(135deg, ${btn.mp.color}28 0%, ${btn.mp.color}10 100%)`
                : "rgba(8,16,38,0.60)",
              border: `1px solid ${isPrimary ? `${btn.mp.color}66` : G.border}`,
              color: G.text,
              boxShadow: isPrimary ? `0 0 24px ${btn.mp.color}22` : "none",
            }}
          >
            <Icon className="w-4 h-4" style={{ color: btn.mp.color }} />
            {product.is_out_of_stock ? "Unavailable" : label}
          </button>
        );
      })}
    </div>
  );
}