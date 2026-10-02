import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/api/base44Client";
import { persistSet } from "@/lib/devModePersistence";

export default function AuthCallback() {
  const [message, setMessage] = useState("Email പരിശോധിക്കുന്നു…");
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("redirect") || "/";
    const returnTo = requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\") ? requested : "/";
    async function finish() {
      try {
        if (!supabase) throw new Error("Login service സജ്ജമാക്കിയിട്ടില്ല.");
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) throw new Error("Login link കാലഹരണപ്പെട്ടിരിക്കാം. വീണ്ടും login ചെയ്യുക.");
        const { data: profile, error: profileError } = await supabase.from("profiles")
          .select("role,status").eq("id", data.user.id).single();
        if (profileError || !profile || profile.status !== "active")
          throw new Error("ഈ account-ന് പ്രവേശനം ലഭ്യമല്ല. Owner-നെ ബന്ധപ്പെടുക.");
        const { error: claimError } = await supabase.rpc("claim_base44_legacy_data");
        if (claimError) throw new Error("പഴയ permissions ചേർക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.");
        const isAdmin = ["owner", "admin"].includes(profile.role);
        try { persistSet("sirr_admin_session", isAdmin ? "true" : "false"); } catch { /* optional UI hint */ }
        if (active) window.location.replace(returnTo.startsWith("/admin/") && !isAdmin ? "/" : returnTo);
      } catch (error) {
        if (active) setMessage(error.message || "Login പൂർത്തിയാക്കാൻ കഴിഞ്ഞില്ല.");
      }
    }
    finish();
    return () => { active = false; };
  }, []);
  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#020710] px-6 text-center text-white"><Loader2 className="h-8 w-8 animate-spin text-yellow-300"/><p className="text-sm text-white/65">{message}</p><a href="/login" className="text-sm text-yellow-300 underline">വീണ്ടും Login ചെയ്യുക</a></div>;
}
