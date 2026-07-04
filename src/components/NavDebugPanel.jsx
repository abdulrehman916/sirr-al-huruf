import { useAuth } from "@/lib/AuthContext";
import { isNavTabVisible } from "@/lib/rbac";

// TEMPORARY DEBUG PANEL — shows the live runtime values that decide whether
// the "admin-shop" (SHOP ADMIN) nav tab is rendered. Remove after debugging.
export default function NavDebugPanel() {
  const { user, isAuthenticated, role, adminProfile } = useAuth();

  let sessionFlag = "n/a";
  try {
    sessionFlag = sessionStorage.getItem("sirr_admin_session");
  } catch {
    sessionFlag = "sessionStorage unavailable";
  }

  let lsKeys = [];
  try {
    lsKeys = Object.keys(localStorage);
  } catch {
    lsKeys = [];
  }

  const adminShopVisible = isNavTabVisible("admin-shop", role, adminProfile);

  const row = (label, value) => (
    <div className="flex gap-1 text-[11px] leading-tight">
      <span className="font-bold text-amber-300 shrink-0">{label}:</span>
      <span className="text-emerald-300 break-all">{String(value)}</span>
    </div>
  );

  return (
    <div
      className="fixed left-2 right-2 bottom-24 z-[60] p-2 rounded-lg overflow-auto max-h-[40vh]"
      style={{
        background: "rgba(0,0,0,0.92)",
        border: "1px solid rgba(255,80,80,0.6)",
        color: "#fff",
      }}
    >
      <div className="text-[10px] font-bold text-red-400 mb-1">
        NAV DEBUG — admin-shop visible ={" "}
        <span className={adminShopVisible ? "text-red-400" : "text-emerald-400"}>
          {String(adminShopVisible)}
        </span>
      </div>
      {row("role", role)}
      {row("isAuthenticated", String(isAuthenticated))}
      {row("user", JSON.stringify(user))}
      {row("user.email", user && user.email)}
      {row("user.role", user && user.role)}
      {row("adminProfile", JSON.stringify(adminProfile))}
      {row("adminProfile.perm_shop_management", adminProfile && adminProfile.perm_shop_management)}
      {row("sirr_admin_session", sessionFlag)}
      {row("localStorage keys", lsKeys.join(", "))}
    </div>
  );
}