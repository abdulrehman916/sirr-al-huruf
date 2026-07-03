/**
 * Admin permission definitions and helpers.
 * Used by AdminAdmins page, AdminFormModal, AdminDetailPanel.
 */

export const ADMIN_PERMISSIONS = [
  {
    key: "perm_support_messages",
    shortKey: "support_messages",
    label: "Support Messages",
    description: "View and reply to support messages",
    icon: "💬",
  },
  {
    key: "perm_access_requests",
    shortKey: "access_requests",
    label: "Access Requests",
    description: "View and process access requests",
    icon: "📝",
  },
  {
    key: "perm_customer_management",
    shortKey: "customer_management",
    label: "Customer Management",
    description: "View and manage assigned customers",
    icon: "👥",
  },
  {
    key: "perm_redeem_code_approval",
    shortKey: "redeem_code_approval",
    label: "Redeem Code Approval",
    description: "Verify payment and approve pending redeem codes",
    icon: "🔑",
  },
];

export const ADMIN_FORBIDDEN = [
  "Admin Management",
  "Page Access",
  "Reading Code Creation",
  "Reading Code Deletion",
  "Pricing Configuration",
  "Publish",
  "Settings",
  "Database",
  "Security",
  "Access Logs",
];

export function hasPermission(profile, permKey) {
  if (!profile) return false;
  if (profile.is_owner) return true;
  return profile[permKey] === true;
}

export function isAdminActive(profile) {
  return profile?.status === "ACTIVE";
}

export function getEnabledPermissions(profile) {
  return ADMIN_PERMISSIONS.filter(
    (p) => profile?.is_owner || profile?.[p.key] === true
  );
}