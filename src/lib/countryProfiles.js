/**
 * Global Marketplace — Country Profiles & Marketplace Registry
 *
 * Scalable by design: add entries to COUNTRY_PROFILES or MARKETPLACE_REGISTRY
 * to support new countries, currencies, marketplaces, shipping profiles, or languages.
 * No architecture changes needed for future expansion.
 *
 * AED remains the only stored product price. All other data is display-only.
 */

// ── Marketplace Registry ──
// Each marketplace maps to a platform identifier used in Product.affiliate_links.
export const MARKETPLACE_REGISTRY = {
  amazon_ae: {
    id: "amazon_ae", name: "Amazon UAE", platform: "Amazon UAE",
    aliases: ["Amazon.ae", "Amazon AE", "amazon.ae"],
    countries: ["AE"], icon: "ShoppingBag", color: "#FF9900",
  },
  amazon_in: {
    id: "amazon_in", name: "Amazon India", platform: "Amazon India",
    aliases: ["Amazon.in", "Amazon IN", "amazon.in"],
    countries: ["IN"], icon: "ShoppingBag", color: "#FF9900",
  },
  amazon_sa: {
    id: "amazon_sa", name: "Amazon Saudi", platform: "Amazon Saudi",
    aliases: ["Amazon.sa", "Amazon SA", "amazon.sa", "Amazon KSA"],
    countries: ["SA"], icon: "ShoppingBag", color: "#FF9900",
  },
  amazon_us: {
    id: "amazon_us", name: "Amazon USA", platform: "Amazon USA",
    aliases: ["Amazon.com", "Amazon US", "amazon.com"],
    countries: ["US"], icon: "ShoppingBag", color: "#FF9900",
  },
  amazon_uk: {
    id: "amazon_uk", name: "Amazon UK", platform: "Amazon UK",
    aliases: ["Amazon.co.uk", "Amazon GB", "amazon.co.uk"],
    countries: ["GB"], icon: "ShoppingBag", color: "#FF9900",
  },
  flipkart: {
    id: "flipkart", name: "Flipkart", platform: "Flipkart",
    aliases: ["flipkart"],
    countries: ["IN"], icon: "ShoppingBag", color: "#2874F0",
  },
  noon: {
    id: "noon", name: "Noon", platform: "Noon",
    aliases: ["noon.com", "Noon.com"],
    countries: ["AE", "SA", "QA", "KW", "BH", "OM", "EG"],
    icon: "Sun", color: "#FEEE00",
  },
  external: {
    id: "external", name: "External Website", platform: "External",
    aliases: ["External Website", "Website", "Official", "Official Website", "Direct"],
    countries: null, icon: "ExternalLink", color: "#D4AF37", fallback: true,
  },
  whatsapp: {
    id: "whatsapp", name: "WhatsApp Inquiry", platform: "WhatsApp",
    aliases: ["WhatsApp"], countries: null,
    icon: "MessageCircle", color: "#25D366",
  },
  email: {
    id: "email", name: "Email Inquiry", platform: "Email",
    aliases: ["Email"], countries: null,
    icon: "Mail", color: "#D4AF37",
  },
};

// Marketplace options for Admin Products form (platform dropdown)
export const MARKETPLACE_OPTIONS = [
  { value: "Amazon UAE", label: "Amazon UAE", countries: ["AE"] },
  { value: "Amazon India", label: "Amazon India", countries: ["IN"] },
  { value: "Amazon Saudi", label: "Amazon Saudi", countries: ["SA"] },
  { value: "Amazon USA", label: "Amazon USA", countries: ["US"] },
  { value: "Amazon UK", label: "Amazon UK", countries: ["GB"] },
  { value: "Flipkart", label: "Flipkart", countries: ["IN"] },
  { value: "Noon", label: "Noon", countries: ["AE", "SA", "QA", "KW", "BH", "OM", "EG"] },
  { value: "External", label: "External Website (All Countries)", countries: null },
  { value: "WhatsApp", label: "WhatsApp Inquiry (uses seller_whatsapp)", countries: null },
  { value: "Email", label: "Email Inquiry (uses seller_email)", countries: null },
];

// ── Country Profiles ──
export const COUNTRY_PROFILES = {
  // Middle East
  AE: {
    region: "Middle East", languages: ["English", "Arabic"], taxLabel: "VAT (5%)",
    shipping: { label: "1–2 Days", range: "1-2", note: "Fast domestic delivery" },
    marketplaces: ["amazon_ae", "noon", "external", "whatsapp", "email"],
  },
  SA: {
    region: "Middle East", languages: ["Arabic", "English"], taxLabel: "VAT (15%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard domestic delivery" },
    marketplaces: ["amazon_sa", "noon", "external", "whatsapp", "email"],
  },
  QA: {
    region: "Middle East", languages: ["Arabic", "English"], taxLabel: "VAT (0%)",
    shipping: { label: "2–4 Days", range: "2-4", note: "Standard delivery" },
    marketplaces: ["noon", "external", "whatsapp", "email"],
  },
  KW: {
    region: "Middle East", languages: ["Arabic", "English"], taxLabel: "VAT (0%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  BH: {
    region: "Middle East", languages: ["Arabic", "English"], taxLabel: "VAT (10%)",
    shipping: { label: "2–4 Days", range: "2-4", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  OM: {
    region: "Middle East", languages: ["Arabic", "English"], taxLabel: "VAT (5%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  JO: {
    region: "Middle East", languages: ["Arabic", "English"], taxLabel: "GST (5%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  EG: {
    region: "Middle East", languages: ["Arabic", "English"], taxLabel: "VAT (14%)",
    shipping: { label: "4–7 Days", range: "4-7", note: "Standard delivery" },
    marketplaces: ["noon", "external", "whatsapp", "email"],
  },
  TR: {
    region: "Middle East", languages: ["Turkish", "English"], taxLabel: "VAT (20%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },

  // South Asia
  IN: {
    region: "South Asia", languages: ["Malayalam", "English"], taxLabel: "GST",
    shipping: { label: "4–7 Days", range: "4-7", note: "Standard domestic delivery" },
    marketplaces: ["amazon_in", "flipkart", "external", "whatsapp", "email"],
  },
  PK: {
    region: "South Asia", languages: ["Urdu", "English"], taxLabel: "GST",
    shipping: { label: "5–8 Days", range: "5-8", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  BD: {
    region: "South Asia", languages: ["Bengali", "English"], taxLabel: "VAT (15%)",
    shipping: { label: "5–8 Days", range: "5-8", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  LK: {
    region: "South Asia", languages: ["Sinhala", "English"], taxLabel: "VAT",
    shipping: { label: "5–8 Days", range: "5-8", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  NP: {
    region: "South Asia", languages: ["Nepali", "English"], taxLabel: "VAT (13%)",
    shipping: { label: "5–8 Days", range: "5-8", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },

  // Americas
  US: {
    region: "Americas", languages: ["English"], taxLabel: "Sales Tax",
    shipping: { label: "3–7 Days", range: "3-7", note: "Standard domestic delivery" },
    marketplaces: ["amazon_us", "external", "whatsapp", "email"],
  },
  CA: {
    region: "Americas", languages: ["English", "French"], taxLabel: "GST/HST",
    shipping: { label: "4–8 Days", range: "4-8", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  MX: {
    region: "Americas", languages: ["Spanish", "English"], taxLabel: "IVA (16%)",
    shipping: { label: "5–8 Days", range: "5-8", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  BR: {
    region: "Americas", languages: ["Portuguese", "English"], taxLabel: "ICMS",
    shipping: { label: "5–10 Days", range: "5-10", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },

  // Europe
  GB: {
    region: "Europe", languages: ["English"], taxLabel: "VAT (20%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["amazon_uk", "external", "whatsapp", "email"],
  },
  DE: {
    region: "Europe", languages: ["German", "English"], taxLabel: "MwSt (19%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  FR: {
    region: "Europe", languages: ["French", "English"], taxLabel: "TVA (20%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },

  // Southeast Asia
  SG: {
    region: "Southeast Asia", languages: ["English", "Malay"], taxLabel: "GST (8%)",
    shipping: { label: "3–5 Days", range: "3-5", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  MY: {
    region: "Southeast Asia", languages: ["Malay", "English"], taxLabel: "SST (6%)",
    shipping: { label: "4–7 Days", range: "4-7", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },

  // Oceania
  AU: {
    region: "Oceania", languages: ["English"], taxLabel: "GST (10%)",
    shipping: { label: "4–8 Days", range: "4-8", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
  NZ: {
    region: "Oceania", languages: ["English"], taxLabel: "GST (15%)",
    shipping: { label: "5–9 Days", range: "5-9", note: "Standard delivery" },
    marketplaces: ["external", "whatsapp", "email"],
  },
};

// Default profile for countries without specific configuration
export const DEFAULT_PROFILE = {
  region: "International", languages: ["English"], taxLabel: "Tax may apply",
  shipping: { label: "7–14 Days", range: "7-14", note: "International shipping" },
  marketplaces: ["external", "whatsapp", "email"],
};

// ── Helper Functions ──
export function getCountryProfile(countryCode) {
  return COUNTRY_PROFILES[countryCode] || DEFAULT_PROFILE;
}

export function getMarketplacesForCountry(countryCode) {
  const profile = getCountryProfile(countryCode);
  return profile.marketplaces.map(id => MARKETPLACE_REGISTRY[id]).filter(Boolean);
}

// Match an affiliate link to a marketplace by platform/label
function findLinkForMarketplace(links, mp) {
  if (!links || links.length === 0) return null;
  return links.find(link => {
    const platform = (link.platform || "").toLowerCase().trim();
    const label = (link.label || "").toLowerCase().trim();

    // Exact platform match
    if (platform === mp.platform.toLowerCase()) return true;
    // Alias match
    if (mp.aliases && mp.aliases.some(a => a.toLowerCase() === platform)) return true;
    // Generic "Amazon" matches country-specific Amazon
    if (mp.id.startsWith("amazon_") && platform === "amazon") return true;
    // Label contains marketplace name
    if (label && mp.name && label.includes(mp.name.toLowerCase())) return true;

    return false;
  });
}

/**
 * Returns marketplace buttons for a product, filtered by the user's country.
 * Falls back to External Website if no country-specific marketplace exists.
 */
export function getMarketplaceButtons(product, countryCode) {
  const profile = getCountryProfile(countryCode);
  const links = product.affiliate_links || [];
  const result = [];

  for (const mpId of profile.marketplaces) {
    const mp = MARKETPLACE_REGISTRY[mpId];
    if (!mp) continue;

    if (mpId === "whatsapp") {
      if (product.seller_whatsapp) {
        result.push({ mp, type: "whatsapp", value: product.seller_whatsapp, product });
      }
      continue;
    }
    if (mpId === "email") {
      if (product.seller_email) {
        result.push({ mp, type: "email", value: product.seller_email, product });
      }
      continue;
    }

    // Amazon: use dedicated amazon_url field (not affiliate_links)
    if (mp.id.startsWith("amazon_")) {
      if (product.amazon_url) {
        result.push({ mp, type: "affiliate", link: { url: product.amazon_url, label: `Buy on ${mp.name}`, platform: mp.platform }, product });
      }
      continue;
    }

    const link = findLinkForMarketplace(links, mp);
    if (link) {
      result.push({ mp, type: "affiliate", link, product });
    }
  }

  // If no marketplace buttons at all but there are links, show all as external fallback
  if (result.length === 0 && links.length > 0) {
    const extMp = MARKETPLACE_REGISTRY["external"];
    links.forEach(link => {
      result.push({ mp: extMp, type: "affiliate", link, product });
    });
  }

  return result;
}

// Count available marketplaces for a product in a country
export function getMarketplaceCount(product, countryCode) {
  const buttons = getMarketplaceButtons(product, countryCode);
  return buttons.filter(b => b.type === "affiliate" && !b.mp.fallback).length;
}