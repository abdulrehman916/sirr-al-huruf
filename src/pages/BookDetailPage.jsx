import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Lock, Download, Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function BookDetailPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BookPublication.filter({ slug, status: "PUBLISHED" }, null, 1)
      .then((rows) => setBook(rows?.[0] || null)).catch(() => setBook(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageLayout><div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-yellow-300" /></div></PageLayout>;
  if (!book) return <PageLayout><div className="mx-auto max-w-xl px-4 py-24 text-center text-white/60">പുസ്തകം ലഭ്യമല്ല.<div className="mt-5"><Link to="/books" className="text-yellow-300">പുസ്തകശാലയിലേക്ക് മടങ്ങുക</Link></div></div></PageLayout>;

  const free = book.access_mode === "FREE";
  return (
    <PageLayout>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Link to="/books" className="mb-6 inline-flex items-center gap-2 text-sm text-white/45 hover:text-yellow-200"><ArrowLeft className="h-4 w-4" /> പുസ്തകശാല</Link>
        <div className="grid gap-7 md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-[#10203d] to-[#040914]">
            {book.cover_url ? <img src={book.cover_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><BookOpen className="h-16 w-16 text-yellow-300/35" /></div>}
          </div>
          <article>
            {book.title_ar && <p dir="rtl" className="font-amiri text-3xl text-yellow-200">{book.title_ar}</p>}
            <h1 className="mt-2 text-3xl font-bold text-white">{book.title_ml || book.title_en}</h1>
            {book.author && <p className="mt-2 text-sm text-white/45">{book.author}</p>}
            <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-white/70">{book.intro_ml || book.intro_en}</div>
            {book.preview_text_ml && <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h2 className="mb-3 font-bold text-yellow-100">സൗജന്യ Preview</h2><div className="whitespace-pre-wrap leading-8 text-white/65">{book.preview_text_ml}</div></section>}
            <div className="mt-7 rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.055] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><p className="text-xs uppercase tracking-wider text-white/35">Access</p><p className="mt-1 text-xl font-bold text-yellow-100">{free ? "FREE" : `${book.price_currency || "AED"} ${Number(book.price_amount || 0).toFixed(2)}`}</p></div>
                {free && isAuthenticated ? <button disabled className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-5 py-3 text-sm font-bold text-emerald-200"><Download className="h-4 w-4" /> Secure download ഉടൻ ലഭ്യമാകും</button> : free ? <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black">Email ഉപയോഗിച്ച് Login</Link> : <button disabled className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/25 px-5 py-3 text-sm font-bold text-yellow-200"><Lock className="h-4 w-4" /> Payment ഉടൻ</button>}
              </div>
            </div>
          </article>
        </div>
      </main>
    </PageLayout>
  );
}
