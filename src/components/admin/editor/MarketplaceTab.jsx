import { useState } from "react";
import { Plus, X, Eye, EyeOff, ShoppingBag } from "lucide-react";
import { MARKETPLACE_OPTIONS } from "@/lib/countryProfiles";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>
      {children}
    </p>
  );
}

/**
 * Marketplace tab — manage affiliate/buy links with platform, country, URL, label, and visibility.
 * Also manages seller WhatsApp and email contact info.
 */
export default function MarketplaceTab({ form, setForm }) {
  const [input, setInput] = useState({ platform: "", country: "", url: "", label: "", visible: true });

  const links = form.affiliate_links || [];

  const addLink = () => {
    if (!input.platform || !input.url.trim()) return;
    setForm({
      ...form,
      affiliate_links: [...links, {
        platform: input.platform,
        country: input.country,
        url: input.url.trim(),
        label: input.label.trim() || `Buy on ${input.platform}`,
        visible: input.visible !== false,
      }],
    });
    setInput({ platform: "", country: "", url: "", label: "", visible: true });
  };

  const removeLink = (idx) => {
    setForm({ ...form, affiliate_links: links.filter((_, i) => i !== idx) });
  };

  const toggleVisible = (idx) => {
    const newLinks = [...links];
    newLinks[idx] = { ...newLinks[idx], visible: !newLinks[idx].visible };
    setForm({ ...form, affiliate_links: newLinks });
  };

  const updateLinkField = (idx, field, value) => {
    const newLinks = [...links];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    setForm({ ...form, affiliate_links: newLinks });
  };

  // Auto-derive country from platform selection
  const handlePlatformChange = (platformValue) => {
    const opt = MARKETPLACE_OPTIONS.find(o => o.value === platformValue);
    const country = opt?.countries?.[0] || "";
    setInput({ ...input, platform: platformValue, country });
  };

  return (
    <div className="space-y-4">
      {/* Amazon Product URL — dedicated field */}
      <div className="space-y-2 p-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
        <SectionLabel>Amazon Product URL</SectionLabel>
        <input
          value={form.amazon_url || ""}
          onChange={e => setForm({ ...form, amazon_url: e.target.value })}
          className="form-input"
          placeholder="https://www.amazon.ae/dp/BXXXXXXXX"
        />
        <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Paste this product's exact Amazon listing URL. The "Buy on Amazon" button opens this link. Leave empty to hide the Amazon button.
        </p>
      </div>

      {/* Existing Links */}
      {links.length > 0 && (
        <div className="space-y-2">
          <SectionLabel>Marketplace Links ({links.length})</SectionLabel>
          {links.map((link, idx) => (
            <div
              key={idx}
              className="space-y-2 p-2.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${link.visible === false ? G.faint : G.border}` }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-3 h-3 flex-shrink-0" style={{ color: G.text }} />
                <span className="font-inter text-[11px] font-bold flex-1" style={{ color: G.text }}>{link.platform}</span>
                {link.country && (
                  <span className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{ background: G.bg, color: G.dim }}>{link.country}</span>
                )}
                <button onClick={() => toggleVisible(idx)} className="p-1 rounded" title={link.visible === false ? "Show" : "Hide"}>
                  {link.visible === false ? <EyeOff className="w-3 h-3" style={{ color: G.dim }} /> : <Eye className="w-3 h-3" style={{ color: G.text }} />}
                </button>
                <button onClick={() => removeLink(idx)} className="p-1 rounded">
                  <X className="w-3 h-3" style={{ color: "#F87171" }} />
                </button>
              </div>
              {/* Editable fields */}
              <input
                value={link.url || ""}
                onChange={e => updateLinkField(idx, "url", e.target.value)}
                className="form-input"
                placeholder="URL"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={link.label || ""}
                  onChange={e => updateLinkField(idx, "label", e.target.value)}
                  className="form-input"
                  placeholder="Button label"
                />
                <input
                  value={link.country || ""}
                  onChange={e => updateLinkField(idx, "country", e.target.value)}
                  className="form-input"
                  placeholder="Country code (e.g. AE, IN)"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Link */}
      <div className="space-y-2 p-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
        <SectionLabel>Add Marketplace Link</SectionLabel>
        <select
          value={input.platform}
          onChange={e => handlePlatformChange(e.target.value)}
          className="form-input"
          style={{ background: "rgba(8,16,38,0.60)" }}
        >
          <option value="">Select marketplace...</option>
          {MARKETPLACE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          value={input.url}
          onChange={e => setInput({ ...input, url: e.target.value })}
          className="form-input"
          placeholder="Product URL (https://...)"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={input.label}
            onChange={e => setInput({ ...input, label: e.target.value })}
            className="form-input"
            placeholder="Button label (optional)"
          />
          <input
            value={input.country}
            onChange={e => setInput({ ...input, country: e.target.value })}
            className="form-input"
            placeholder="Country (auto-filled)"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={input.visible !== false}
            onChange={e => setInput({ ...input, visible: e.target.checked })}
            className="w-3.5 h-3.5 cursor-pointer"
            style={{ accentColor: "#D4AF37" }}
          />
          <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.60)" }}>Visible on storefront</span>
        </label>
        <button
          onClick={addLink}
          disabled={!input.platform || !input.url.trim()}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-inter text-[10px] font-bold disabled:opacity-30"
          style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
        >
          <Plus className="w-3 h-3" /> Add Link
        </button>
      </div>

      <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
        Marketplace links are filtered by the user's selected country on the storefront. Links without a country match are shown as "External Website" fallback.
      </p>
    </div>
  );
}