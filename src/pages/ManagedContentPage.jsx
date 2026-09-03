import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/lib/AuthContext";

function isStillActive(record) {
  if (!record) return false;
  if (record.status && record.status !== "ACTIVE") return false;
  if (record.is_active === false || record.is_revoked === true) return false;
  if (!record.expiry_date) return true;
  const expiry = new Date(record.expiry_date).getTime();
  return Number.isFinite(expiry) ? expiry > Date.now() : true;
}

function AccessCard({ mode, page, isAuthenticated }) {
  const isPaid = mode === "PAID" || mode === "PREMIUM";
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-yellow-500/20 bg-white/[0.025] p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/25 bg-yellow-500/10 text-yellow-200">
        {isAuthenticated ? <LockKeyhole className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
      </div>
      <h2 className="mt-4 text-lg font-bold text-white">
        {!isAuthenticated ? "ലോഗിൻ ആവശ്യമാണ്" : mode === "SELECTED_CUSTOMERS" ? "ഈ പേജിന് പ്രത്യേക അനുമതി ആവശ്യമാണ്" : "ഈ ഉള്ളടക്കം ലോക്കുചെയ്തിരിക്കുന്നു"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-white/55">
        {!isAuthenticated
          ? "ഈ ഉള്ളടക്കം കാണാൻ ആദ്യം നിങ്ങളുടെ അക്കൗണ്ടിൽ ലോഗിൻ ചെയ്യുക."
          : mode === "SELECTED_CUSTOMERS"
            ? "Owner അനുവദിച്ച ഉപഭോക്താക്കൾക്കാണ് ഈ പേജ് ലഭ്യമാകുന്നത്."
            : "Active subscription അല്ലെങ്കിൽ page permission ലഭിച്ചാൽ ഈ പേജ് തുറക്കും."}
      </p>
      {isPaid && Number(page?.price_amount || 0) > 0 && (
        <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.06] px-4 py-3 font-semibold text-yellow-100">
          {page.price_currency || "AED"} {Number(page.price_amount).toFixed(2)}
        </div>
      )}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {!isAuthenticated ? (
          <Link to="/login" className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-100">
            Login
          </Link>
        ) : (
          <Link to="/premium/request" className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-100">
            Request Access
          </Link>
        )}
        <Link to="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60">Home</Link>
      </div>
    </div>
  );
}

export default function ManagedContentPage() {
  const { slug } = useParams();
  const { user, role, isAuthenticated } = useAuth();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [accessResolved, setAccessResolved] = useState(false);

  const pagePath = useMemo(() => `/content/${slug || ""}`, [slug]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setAccessResolved(false);
      try {
        const rows = await base44.entities.ManagedPage.filter({ slug, status: "PUBLISHED" }, null, 1);
        const found = Array.isArray(rows) && rows.length ? rows[0] : null;
        if (cancelled) return;
        setPage(found);
        if (!found) {
          setAllowed(false);
          setAccessResolved(true);
          return;
        }

        if (role === "owner" || role === "admin" || found.access_mode === "PUBLIC") {
          setAllowed(true);
          setAccessResolved(true);
          return;
        }

        if (found.access_mode === "LOGIN") {
          setAllowed(Boolean(isAuthenticated && user?.id));
          setAccessResolved(true);
          return;
        }

        if (!isAuthenticated || !user?.id) {
          setAllowed(false);
          setAccessResolved(true);
          return;
        }

        const [subscriptions, permissions] = await Promise.all([
          base44.entities.Subscription.filter({ user_id: user.id, page_path: pagePath }).catch(() => []),
          base44.entities.PagePermission.filter({ user_id: user.id, page_path: pagePath }).catch(() => []),
        ]);
        if (cancelled) return;

        const hasSubscription = Array.isArray(subscriptions) && subscriptions.some(isStillActive);
        const hasPermission = Array.isArray(permissions) && permissions.some(isStillActive);

        if (found.access_mode === "SELECTED_CUSTOMERS") setAllowed(hasPermission);
        else setAllowed(hasSubscription || hasPermission);
        setAccessResolved(true);
      } catch {
        if (!cancelled) {
          setPage(null);
          setAllowed(false);
          setAccessResolved(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug, pagePath, role, isAuthenticated, user?.id]);

  return (
    <PageLayout>
      <div className="min-h-[70vh] px-4 py-8 sm:px-6 lg:px-8">
        {loading && <div className="mx-auto mt-20 h-9 w-9 animate-spin rounded-full border-4 border-yellow-400/20 border-t-yellow-300" />}

        {!loading && !page && (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.025] p-6 text-center">
            <h1 className="text-xl font-bold text-white">Page not found</h1>
            <p className="mt-2 text-sm text-white/45">ഈ content page publish ചെയ്തിട്ടില്ല അല്ലെങ്കിൽ നിലവിലില്ല.</p>
            <Link to="/" className="mt-5 inline-block rounded-lg border border-yellow-500/25 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-100">Home</Link>
          </div>
        )}

        {!loading && page && accessResolved && !allowed && (
          <AccessCard mode={page.access_mode} page={page} isAuthenticated={isAuthenticated} />
        )}

        {!loading && page && accessResolved && allowed && (
          <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-[#07101f] to-[#030711] shadow-2xl shadow-black/30">
            {page.featured_image_url && (
              <img src={page.featured_image_url} alt={page.title_en || page.title_ml || ""} className="max-h-[460px] w-full object-cover" />
            )}
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-yellow-100">
                  {page.category || "general"}
                </span>
                {page.access_mode !== "PUBLIC" && (
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-300/80">
                    <ShieldCheck className="h-3.5 w-3.5" /> Access verified
                  </span>
                )}
              </div>

              {page.title_ar && <h1 dir="rtl" className="font-amiri text-3xl leading-relaxed text-yellow-100 sm:text-4xl">{page.title_ar}</h1>}
              <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">{page.title_ml}</h1>
              {page.title_en && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">{page.title_en}</p>}

              {page.excerpt_ml && <p className="mt-7 text-base leading-8 text-white/65">{page.excerpt_ml}</p>}
              {page.body_ar && <section dir="rtl" className="mt-8 whitespace-pre-wrap font-amiri text-xl leading-10 text-white/90 sm:text-2xl">{page.body_ar}</section>}
              {page.body_ml && <section className="mt-8 whitespace-pre-wrap text-base leading-8 text-white/78 sm:text-lg sm:leading-9">{page.body_ml}</section>}
              {page.body_en && <section className="mt-8 whitespace-pre-wrap border-t border-white/8 pt-6 text-sm leading-7 text-white/50">{page.body_en}</section>}
            </div>
          </article>
        )}
      </div>
    </PageLayout>
  );
}
