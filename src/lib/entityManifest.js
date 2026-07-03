/**
 * Entity Manifest — Central Source of Truth for All Database Entities
 *
 * Every entity in the application is declared here. Adding a new entity:
 * 1. Create the entity schema file in base44/entities/YourEntity.jsonc
 * 2. Add one entry to ENTITY_MANIFEST below
 * 3. It auto-registers in EntityRegistry (database) on next app load
 * 4. It appears in: Admin Entity Manager, Analytics, Audit Logs, Permission selectors
 *
 * Zero manual registration in admin panels needed.
 *
 * Fields per entity:
 *   name            — SDK key (base44.entities.Name)
 *   display_name    — Human-readable label
 *   description     — Short description
 *   category        — Grouping label
 *   icon            — Emoji for display
 *   admin_visible   — Show in Entity Manager? (false for internal entities)
 *   supports_crud   — Can admins create/edit/delete via Entity Manager?
 *                     (false = read-only, entity has a specialized admin page)
 *   supports_search — Enable search field in Entity Manager
 *   supports_export — Allow JSON export
 *   supports_import — Allow JSON import
 *   is_system       — Cannot be deleted/archived (User, EntityRegistry)
 *   sort_order      — Display order
 */

export const ENTITY_CATEGORIES = {
  CONTENT: 'Content & Knowledge',
  USER_DATA: 'User Data',
  ACCESS_CONTROL: 'Access Control',
  ADMIN: 'Admin Management',
  SUBSCRIPTION: 'Subscriptions',
  SUPPORT: 'Support',
  SECURITY: 'Security',
  AUDIT: 'Audit & Logs',
  CONFIGURATION: 'Configuration',
  SYSTEM: 'System',
};

export const ENTITY_MANIFEST = [
  // ── CONTENT (full CRUD) ──
  { name: 'ManuscriptRule', display_name: 'Manuscript Rules', description: 'Rules extracted from occult manuscripts', category: 'CONTENT', icon: '📜', supports_crud: true, sort_order: 1 },
  { name: 'ManuscriptLibrary', display_name: 'Manuscript Library', description: 'Source manuscripts and ingestion status', category: 'CONTENT', icon: '📚', supports_crud: true, sort_order: 2 },
  { name: 'HolyOneName', display_name: 'Holy Names', description: 'Sacred names with Malayalam translations', category: 'CONTENT', icon: '✦', supports_crud: true, sort_order: 3 },
  { name: 'HolyOnePDFName', display_name: 'Holy Names (PDF Source)', description: 'Holy names imported from PDF sources', category: 'CONTENT', icon: '✦', supports_crud: true, sort_order: 4 },
  { name: 'FaalChobTranslation', display_name: 'Faal Chob Translations', description: 'Faal Chob text translations', category: 'CONTENT', icon: '🪵', supports_crud: true, sort_order: 5 },

  // ── USER_DATA (read-only, managed via specialized pages) ──
  { name: 'User', display_name: 'Users', description: 'Platform users (managed by system)', category: 'SYSTEM', icon: '👤', supports_crud: false, is_system: true, supports_import: false, sort_order: 10 },
  { name: 'UserAccessProfile', display_name: 'User Access Profiles', description: 'Extended user access data', category: 'USER_DATA', icon: '👤', supports_crud: false, sort_order: 11 },
  { name: 'ApprovedUser', display_name: 'Approved Users', description: 'Approved user records', category: 'USER_DATA', icon: '✅', supports_crud: false, sort_order: 12 },
  { name: 'VIPAccess', display_name: 'VIP Access', description: 'VIP access records', category: 'USER_DATA', icon: '⭐', supports_crud: false, sort_order: 13 },

  // ── ACCESS_CONTROL (read-only, managed via specialized pages) ──
  { name: 'AccessCode', display_name: 'Reading Codes', description: 'Customer access codes (managed via Reading Codes admin)', category: 'ACCESS_CONTROL', icon: '🔑', supports_crud: false, sort_order: 20 },
  { name: 'PagePermission', display_name: 'Page Permissions', description: 'User page access grants (managed via Page Access admin)', category: 'ACCESS_CONTROL', icon: '🌐', supports_crud: false, sort_order: 21 },
  { name: 'PageVisibilityConfig', display_name: 'Page Visibility', description: 'Page access configuration (auto-synced)', category: 'CONFIGURATION', icon: '📋', supports_crud: false, sort_order: 22 },
  { name: 'FeatureConfig', display_name: 'Feature Configurations', description: 'Feature-level access configuration (auto-synced)', category: 'CONFIGURATION', icon: '⚙️', supports_crud: false, sort_order: 23 },
  { name: 'SubscriptionPlanConfig', display_name: 'Subscription Plan Configs', description: 'Plan pricing and duration configs', category: 'CONFIGURATION', icon: '💳', supports_crud: false, sort_order: 24 },
  { name: 'AccessRequest', display_name: 'Access Requests', description: 'User access requests (managed via Access Requests admin)', category: 'ACCESS_CONTROL', icon: '📨', supports_crud: false, sort_order: 25 },
  { name: 'AccessRequestMessage', display_name: 'Access Request Messages', description: 'Messages on access requests', category: 'ACCESS_CONTROL', icon: '💬', supports_crud: false, supports_search: false, sort_order: 26 },
  { name: 'RedeemCodeApproval', display_name: 'Redeem Approvals', description: 'Redeem code approval pipeline (managed via Redeem Approvals admin)', category: 'ACCESS_CONTROL', icon: '✓', supports_crud: false, sort_order: 27 },
  { name: 'PremiumAccessRequest', display_name: 'Premium Access Requests', description: 'Premium access request records', category: 'ACCESS_CONTROL', icon: '⭐', supports_crud: false, sort_order: 28 },

  // ── ADMIN (read-only) ──
  { name: 'AdminProfile', display_name: 'Admin Profiles', description: 'Admin management profiles (managed via Admins admin)', category: 'ADMIN', icon: '🛡️', supports_crud: false, sort_order: 30 },
  { name: 'AssignmentLog', display_name: 'Assignment Logs', description: 'Customer-admin assignment history', category: 'ADMIN', icon: '📝', supports_crud: false, sort_order: 31 },

  // ── SUBSCRIPTION (read-only) ──
  { name: 'Subscription', display_name: 'Subscriptions', description: 'User subscription records', category: 'SUBSCRIPTION', icon: '💳', supports_crud: false, sort_order: 40 },
  { name: 'SubscriptionPlan', display_name: 'Subscription Plans', description: 'Subscription plan definitions', category: 'SUBSCRIPTION', icon: '💳', supports_crud: false, sort_order: 41 },
  { name: 'SubscriptionRequest', display_name: 'Subscription Requests', description: 'User subscription requests', category: 'SUBSCRIPTION', icon: '📨', supports_crud: false, sort_order: 42 },
  { name: 'SubscriptionPricing', display_name: 'Subscription Pricing', description: 'Pricing tier definitions', category: 'SUBSCRIPTION', icon: '💰', supports_crud: false, sort_order: 43 },

  // ── SUPPORT (read-only, managed via Support admin) ──
  { name: 'SupportTickets', display_name: 'Support Tickets', description: 'Customer support tickets (managed via Support admin)', category: 'SUPPORT', icon: '🎫', supports_crud: false, sort_order: 50 },
  { name: 'SupportMessage', display_name: 'Support Messages', description: 'Legacy support messages', category: 'SUPPORT', icon: '💬', supports_crud: false, supports_search: false, sort_order: 51 },
  { name: 'SupportConversation', display_name: 'Support Conversations', description: 'Chat conversations', category: 'SUPPORT', icon: '💬', supports_crud: false, sort_order: 52 },
  { name: 'SupportChatMessage', display_name: 'Support Chat Messages', description: 'Individual chat messages', category: 'SUPPORT', icon: '💬', supports_crud: false, supports_search: false, sort_order: 53 },

  // ── SECURITY (read-only) ──
  { name: 'OTPVerification', display_name: 'OTP Verifications', description: 'OTP verification records', category: 'SECURITY', icon: '🔐', supports_crud: false, supports_export: false, sort_order: 60 },

  // ── AUDIT (read-only, append-only) ──
  { name: 'AuditLog', display_name: 'Audit Logs', description: 'System audit trail (append-only)', category: 'AUDIT', icon: '📋', supports_crud: false, supports_import: false, sort_order: 70 },
  { name: 'AccessLog', display_name: 'Access Logs', description: 'Page access logs (append-only)', category: 'AUDIT', icon: '📋', supports_crud: false, supports_import: false, sort_order: 71 },

  // ── CONFIGURATION ──
  { name: 'SystemSettings', display_name: 'System Settings', description: 'Application settings (managed via System Settings admin)', category: 'CONFIGURATION', icon: '⚙️', supports_crud: false, sort_order: 80 },
  { name: 'EntityRegistry', display_name: 'Entity Registry', description: 'This registry — auto-managed entity metadata', category: 'CONFIGURATION', icon: '📊', supports_crud: true, is_system: true, supports_import: false, sort_order: 81 },
];