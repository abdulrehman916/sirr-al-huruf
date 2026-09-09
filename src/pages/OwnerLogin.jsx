import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Crown, Loader2, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import { persistRemove, persistSet } from "@/lib/devModePersistence";

export default function OwnerLogin() {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get("redirect") || "/admin/access-dashboard";
  const returnTo = requested.startsWith("/admin/") && !requested.startsWith("//") ? requested : "/admin/access-dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.login({ email: email.trim(), password });
      const account = await base44.auth.me();
      if (account?.email?.toLowerCase() !== ADMIN_CONFIG.OWNER_EMAIL.toLowerCase()) {
        await base44.auth.logout();
        throw new Error("ഈ account-ന് Owner access ഇല്ല.");
      }
      persistSet("sirr_admin_session", "true");
      window.location.assign(returnTo);
    } catch (err) {
      persistRemove("sirr_admin_session");
      setError(err?.message || "Owner login failed.");
      setLoading(false);
    }
  }

  return <AuthLayout icon={Crown} title="Secure Owner Access" subtitle="Sirr al-Huruf administration">
    {error && <div role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="owner-email">Owner email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input id="owner-email" type="email" autoComplete="username" value={email} onChange={(event)=>setEmail(event.target.value)} className="h-12 pl-10" required/></div></div>
      <div className="space-y-2"><Label htmlFor="owner-password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input id="owner-password" type="password" autoComplete="current-password" value={password} onChange={(event)=>setPassword(event.target.value)} className="h-12 pl-10" required/></div></div>
      <Button type="submit" className="h-12 w-full font-medium" disabled={loading}>{loading?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Signing in…</>:"Open Owner Panel"}</Button>
    </form>
  </AuthLayout>;
}
