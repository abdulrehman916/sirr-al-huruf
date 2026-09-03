import { useEffect, useMemo, useState } from "react";
import { KeyRound, RefreshCw, ShieldCheck, UserPlus, XCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

function makePermissionId() {
  const rand = Math.random().toString(36).slice(2, 9).toUpperCase();
  return `CMS-${Date.now()}-${rand}`;
}

function toIsoEndOfDay(value) {
  if (!value) return null;
  const d = new Date(`${value}T23:59:59`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function activePermission(record) {
  if (!record || record.is_active === false || record.is_revoked === true) return false;
  if (!record.expiry_date) return true;
  const t = new Date(record.expiry_date).getTime();
  return !Number.isFinite(t) || t > Date.now();
}

export default function ManagedPageAccessPanel({ page, ownerUser }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [expiry, setExpiry] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [permissions, setPermissions] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [granting, setGranting] = useState(false);

  const pagePath = page?.slug ? `/content/${page.slug}` : "";
  const active = useMemo(() => permissions.filter(activePermission), [permissions]);

  useEffect(() => {
    if (pagePath) loadPermissions();
    else {
      setPermissions([]);
      setProfiles({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagePath]);

  async function loadPermissions() {
    if (!pagePath) return;
    setLoading(true);
    try {
      const rows = await base44.entities.PagePermission.filter({ page_path: pagePath }, "-granted_at", 500);
      const list = Array.isArray(rows) ? rows : [];
      setPermissions(list);

      const userIds = [...new Set(list.map((p) => p.user_id).filter(Boolean))];
      if (!userIds.length) {
        setProfiles({});
        return;
      }
      const allProfiles = await base44.entities.UserAccessProfile.list("-last_login", 1000);
      const map = {};
      for (const profile of Array.isArray(allProfiles) ? allProfiles : []) {
        if (userIds.includes(profile.user_id)) map[profile.user_id] = profile;
      }
      setProfiles(map);
    } catch (error) {
      toast({ title: "Access list failed", description: error?.message || "Could not load page permissions.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function grant() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!pagePath || !normalizedEmail) {
      toast({ title: "Customer email required", variant: "destructive" });
      return;
    }
    const expiryIso = toIsoEndOfDay(expiry);
    if (!expiryIso) {
      toast({ title: "Valid expiry date required", variant: "destructive" });
      return;
    }

    setGranting(true);
    try {
      const matches = await base44.entities.UserAccessProfile.filter({ email: normalizedEmail }, null, 10);
      const profile = Array.isArray(matches)
        ? matches.find((p) => String(p.email || "").toLowerCase() === normalizedEmail)
        : null;

      if (!profile?.user_id) {
        toast({
          title: "Customer not found",
          description: "ഈ email ഉപയോഗിച്ച് website account ഉള്ള customer കണ്ടെത്താനായില്ല.",
          variant: "destructive",
        });
        return;
      }

      const existing = await base44.entities.PagePermission.filter({ user_id: profile.user_id, page_path: pagePath }, null, 50);
      const existingActive = Array.isArray(existing) ? existing.find(activePermission) : null;

      if (existingActive) {
        await base44.entities.PagePermission.update(existingActive.id, {
          expiry_date: expiryIso,
          is_active: true,
          is_revoked: false,
          last_extended_at: new Date().toISOString(),
          last_extended_by: ownerUser?.id || ownerUser?.email || "owner",
          extended_count: Number(existingActive.extended_count || 0) + 1,
        });
      } else {
        const now = new Date().toISOString();
        await base44.entities.PagePermission.create({
          permission_id: makePermissionId(),
          user_id: profile.user_id,
          page_path: pagePath,
          page_name: page.title_ml || page.title_en || page.slug,
          permission_code: `MANAGED_PAGE:${page.slug}`,
          granted_by: ownerUser?.id || ownerUser?.email || "owner",
          granted_at: now,
          start_date: now,
          expiry_date: expiryIso,
          is_active: true,
          is_revoked: false,
          notes: "Granted from Owner Content Studio",
        });
      }

      setEmail("");
      await loadPermissions();
      toast({ title: "Access granted", description: `${normalizedEmail} → ${pagePath}` });
    } catch (error) {
      toast({ title: "Grant failed", description: error?.message || "Could not grant access.", variant: "destructive" });
    } finally {
      setGranting(false);
    }
  }

  async function revoke(permission) {
    if (!permission?.id) return;
    try {
      const now = new Date().toISOString();
      await base44.entities.PagePermission.update(permission.id, {
        is_active: false,
        is_revoked: true,
        revoked_at: now,
        revoked_by: ownerUser?.id || ownerUser?.email || "owner",
        revoked_reason: "Revoked from Owner Content Studio",
      });
      await loadPermissions();
      toast({ title: "Access revoked" });
    } catch (error) {
      toast({ title: "Revoke failed", description: error?.message || "Could not revoke access.", variant: "destructive" });
    }
  }

  if (!page?.id || !page?.slug) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/40">
        Page ആദ്യം Save Draft ചെയ്യുക. അതിന് ശേഷം customer access manage ചെയ്യാം.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-yellow-500/20 bg-white/[0.025] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-yellow-300" />
            <h3 className="text-sm font-bold text-white">Customer Page Access</h3>
          </div>
          <p className="mt-1 text-[10px] text-white/35">{pagePath} · real account user ID അടിസ്ഥാനത്തിലുള്ള secure grant</p>
        </div>
        <button onClick={loadPermissions} disabled={loading} className="rounded-lg border border-white/10 p-2 text-white/50 disabled:opacity-50" title="Refresh">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_170px_auto]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@email.com"
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-yellow-400/50"
        />
        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-yellow-400/50"
        />
        <button onClick={grant} disabled={granting} className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300 disabled:opacity-50">
          <UserPlus className="h-3.5 w-3.5" /> {granting ? "Granting…" : "Grant Access"}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <p className="text-xs text-white/35">Loading access records…</p>}
        {!loading && active.length === 0 && <p className="text-xs text-white/35">ഈ page-ന് active customer grants ഇല്ല.</p>}
        {active.map((permission) => {
          const profile = profiles[permission.user_id];
          return (
            <div key={permission.id || permission.permission_id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/10 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/75">{profile?.full_name || profile?.email || permission.user_id}</p>
                <p className="truncate text-[10px] text-white/35">{profile?.email || permission.user_id}</p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-emerald-300/80">
                  <ShieldCheck className="h-3 w-3" />
                  {permission.expiry_date ? new Date(permission.expiry_date).toLocaleDateString() : "Lifetime"}
                </span>
                <button onClick={() => revoke(permission)} className="rounded-lg border border-red-400/20 bg-red-400/10 p-2 text-red-300" title="Revoke access">
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
