/**
 * ADMIN CONFIGURATION — Single source of truth for admin settings.
 * 
 * SECURITY: Owner personal email is ONLY stored here and in lib/emailBranding.js
 * Never expose OWNER_EMAIL in customer-facing communications.
 * 
 * Change WHATSAPP_NUMBER here to update it everywhere in the app.
 * Format: international format with country code, no spaces or dashes.
 */
export const ADMIN_CONFIG = {
  WHATSAPP_NUMBER: "971522308926",
  WHATSAPP_DISPLAY: "+971 52 230 8926",
  // Owner email — INTERNAL ONLY. Never shown to customers.
  // Used for: Admin authentication, system notifications
  // Customer-facing emails use: lib/emailBranding.js (SUPPORT_EMAIL, NOREPLY_EMAIL)
  OWNER_EMAIL: "abdulrehmanrehman916@gmail.com",
};