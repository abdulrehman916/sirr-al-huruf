// ═══════════════════════════════════════════════════════════════
// RBAC — Role-Based Access Control layer
// Built ON TOP of the existing access system (PageVisibilityConfig,
// AdminProfile flags, AccessCode/reading-code permissions, ProtectedPage).
// This module is READ-ONLY logic. It NEVER modifies Mizan calculations,
// Astro Clock, Ritual Engine, or any existing business logic.
//
// Roles (identified via AdminProfile flags):
//   owner      = AdminProfile.is_owner === true (or OWNER_EMAIL safety net)
//   admin      = AdminProfile active, is_owner false, NOT shop-only
//   shop_admin = AdminProfile active, perm_shop_management === true, is_owner false
//   customer   = no admin profile / role === 'user'
//   guest      = not authenticated
// ═══════════════════════════════════════════════════════════════
import { ADMIN_CONFIG } from "@/lib/adminConfig";

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  SHOP_ADMIN: "shop_admin",
  CUSTOMER: "customer",
  GUEST: "guest",
};

export function isAdminRole(role) {
  return role === ROLES.OWNER || role === ROLES.ADMIN || role === ROLES.SHOP_ADMIN;
}

// Resolve role from platform user + AdminProfile record.
export function resolveRole(user, adminProfile) {
  if (!user) return ROLES.GUEST;
  // Owner email safety net — guarantees the owner is never locked out,
  // even before the AdminProfile record is bootstrapped.
  if (user.email && ADMIN_CONFIG.OWNER_EMAIL &&
      user.email.toLowerCase() === String(ADMIN_CONFIG.OWNER_EMAIL).toLowerCase()) {
    return ROLES.OWNER;
  }
  if (user.role !== "admin") return ROLES.CUSTOMER;
  if (!adminProfile) return ROLES.CUSTOMER;
  if (adminProfile.is_owner === true) return ROLES.OWNER;
  if (adminProfile.status !== "ACTIVE") return ROLES.CUSTOMER;
  // Shop-only admin: has the shop management flag and is not the owner.
  if (adminProfile.perm_shop_management === true) return ROLES.SHOP_ADMIN;
  return ROLES.ADMIN;
}

// ── Admin route access matrix ──────────────────────────────────
// roles: which admin roles may access (owner always allowed).
// perm: optional AdminProfile flag required for the 'admin' role.
export const ROUTE_ACCESS = {
  // Owner-only
  "/admin/admins":               { roles: [ROLES.OWNER] },
  "/admin/page-permissions":     { roles: [ROLES.OWNER] },
  "/admin/access-logs":          { roles: [ROLES.OWNER] },
  "/admin/analytics":            { roles: [ROLES.OWNER] },
  "/admin/settings":             { roles: [ROLES.OWNER] },
  "/admin/system-settings":      { roles: [ROLES.OWNER] },
  "/admin/pdf-content-editor":    { roles: [ROLES.OWNER] },
  "/admin/holy-names-translator": { roles: [ROLES.OWNER] },
  "/admin/feature-pricing":       { roles: [ROLES.OWNER] },
  "/admin/access-codes":          { roles: [ROLES.OWNER] },
  "/admin/access-codes/:codeId":  { roles: [ROLES.OWNER] },
  // Shop admin (owner + shop_admin)
  "/admin/shop":                  { roles: [ROLES.OWNER, ROLES.SHOP_ADMIN] },
  "/admin/products":              { roles: [ROLES.OWNER, ROLES.SHOP_ADMIN] },
  // General admin (owner + admin; admin gated by perm flag)
  "/admin/access-dashboard":      { roles: [ROLES.OWNER, ROLES.ADMIN] },
  "/admin/approved-users":        { roles: [ROLES.OWNER, ROLES.ADMIN], perm: "perm_customer_management" },
  "/admin/access-requests":       { roles: [ROLES.OWNER, ROLES.ADMIN], perm: "perm_access_requests" },
  "/admin/redeem-approvals":      { roles: [ROLES.OWNER, ROLES.ADMIN], perm: "perm_redeem_code_approval" },
  "/admin/support":               { roles: [ROLES.OWNER, ROLES.ADMIN], perm: "perm_support_messages" },
  "/admin/user/:userId":          { roles: [ROLES.OWNER, ROLES.ADMIN], perm: "perm_customer_management" },
};

// Match a concrete path against ROUTE_ACCESS patterns (supports :param).
export function matchAdminRoute(path) {
  for (const pattern of Object.keys(ROUTE_ACCESS)) {
    if (pattern.indexOf(":") === -1) {
      if (path === pattern) return { pattern, ...ROUTE_ACCESS[pattern] };
    } else {
      const re = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
      if (re.test(path)) return { pattern, ...ROUTE_ACCESS[pattern] };
    }
  }
  return null;
}

// Can the given role access an admin route?
export function canAccessAdminRoute(role, path, adminProfile) {
  const rule = matchAdminRoute(path);
  if (!rule) {
    // Unlisted /admin route — default owner-only (strict).
    return role === ROLES.OWNER;
  }
  if (role === ROLES.OWNER) return true;
  if (!rule.roles.includes(role)) return false;
  if (role === ROLES.ADMIN && rule.perm) {
    return adminProfile ? adminProfile[rule.perm] === true : false;
  }
  return true;
}

// Landing admin path per role.
export function getAdminHomePath(role) {
  if (role === ROLES.SHOP_ADMIN) return "/admin/shop";
  return "/admin/access-dashboard";
}

// Top-nav tab visibility (PageLayout TAB_KEYS ids).
// Content tabs are visible to all roles (gated by reading codes downstream).
// 'admin-shop' tab is visible only to owner + shop_admin.
export function isNavTabVisible(tabId, role) {
  if (tabId !== "admin-shop") return true;
  return role === ROLES.OWNER || role === ROLES.SHOP_ADMIN;
}

// Filter admin sidebar sections for the role.
// sections: array of { label, items: [{path, label, icon}] }
export function filterAdminSections(sections, role, adminProfile) {
  if (role === ROLES.OWNER) return sections;
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessAdminRoute(role, item.path, adminProfile)),
    }))
    .filter((section) => section.items.length > 0);
}