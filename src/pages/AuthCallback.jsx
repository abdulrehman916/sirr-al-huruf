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
    const returnTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

    async function finish() {
      if (!supabase) {
        if (active) setMessage("Login service configured അല്ല.");
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        try { persistSet("sirr_admin_session", "true"); } catch { /* ignore */ }
        window.location.replace(returnTo);
        return;
      }
      if (active) setMessage("Link കാലഹരണപ്പെട്ടിരിക്കാം. വീണ്ടും login ചെയ്യുക.");
    }

    const timer = window.setTimeout(finish, 700);
    return () => { active = false; window.clearTimeout(timer); };
  }, []);

  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#020710] px-6 text-center text-white"><Loader2 className="h-8 w-8 animate-spin text-yellow-300"/><p className="text-sm text-white/65">{message}</p><a href="/login" className="text-sm text-yellow-300 underline">Login page</a></div>;
}
