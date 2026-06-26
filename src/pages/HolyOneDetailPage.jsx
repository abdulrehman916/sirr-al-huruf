import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Heart, BookOpen, Star, Clock, Calculator } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ABJAD_VALUES } from "@/lib/abjadValues";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
};

export default function HolyOneDetailPage() {
  const { nameId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("A"); // A or B

  useEffect(() => {
    loadName();
  }, [nameId, searchParams.get('tab')]);

  const loadName = async () => {
    setLoading(true);
    try {
      const tab = searchParams.get('tab');
      
      if (tab === 'b' || nameId.startsWith('PDF-')) {
        // Section B: PDF Holy Names
        const result = await base44.entities.HolyOnePDFName.filter({ pdf_name_id: nameId });
        if (result && result.length > 0) {
          setName(result[0]);
          setSource("B");
        } else {
          toast({ title: "Name not found", variant: "destructive" });
          navigate("/holy-names");
        }
      } else {
        // Section A: Original Holy Names
        const result = await base44.entities.HolyOneName.filter({ name_id: nameId });
        if (result && result.length > 0) {
          setName(result[0]);
          setSource("A");
        } else {
          toast({ title: "Name not found", variant: "destructive" });
          navigate("/holy-names/one");
        }
      }
    } catch (e) {
      toast({ title: "Failed to load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!name) return;
    try {
      if (source === "A") {
        await base44.entities.HolyOneName.update(name.id, { is_favorite: !name.is_favorite });
      } else {
        await base44.entities.HolyOnePDFName.update(name.id, { is_favorite: !name.is_favorite });
      }
      loadName();
      toast({ title: name.is_favorite ? "Removed from favorites" : "Added to favorites" });
    } catch (e) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  // Calculate Abjad value for Section B names only
  const abjadValue = useMemo(() => {
    if (source !== "B" || !name || !name.arabic_name) return null;
    
    // Remove harakat and spaces for calculation
    const cleanArabic = name.arabic_name.replace(/[\u064B-\u0652\u0670]/g, '').replace(/\s+/g, '');
    
    let total = 0;
    for (const char of cleanArabic) {
      if (ABJAD_VALUES[char]) {
        total += ABJAD_VALUES[char];
      }
    }
    return total;
  }, [name?.arabic_name, source]);

  const abjadSquare = useMemo(() => {
    if (!abjadValue) return null;
    return abjadValue * abjadValue;
  }, [abjadValue]);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!name) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <ChevronLeft className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="font-inter text-xl font-bold text-white mb-2">Record Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">This Holy Name record does not exist in the database.</p>
          <button
            onClick={() => navigate("/holy-names")}
            className="px-6 py-3 rounded-xl border border-gold-dim text-gold hover:bg-gold/10 transition-colors"
          >
            Back to Holy Names
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl"
          style={{
            color: G.text,
            background: G.bg,
            border: `1px solid ${G.border}`,
            fontSize: 16
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        {/* Source Badge */}
        <div className="flex justify-center mb-4">
          <Badge style={{ 
            background: source === "A" ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
            borderColor: source === "A" ? "rgba(34,197,94,0.40)" : "rgba(59,130,246,0.40)",
            color: source === "A" ? "#4ade80" : "#60a5fa",
            fontSize: 12
          }}>
            {source === "A" ? "Section A - Original" : "Section B - PDF"}
          </Badge>
        </div>

        {/* Arabic Name */}
        <div className="text-center mb-6">
          <h1 className="font-amiri text-4xl font-bold text-gold mb-3">{name.arabic_name || "Unknown"}</h1>
          <p className="text-lg text-white/60 mb-2">{name.malayalam_pronunciation || ""}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge style={{ background: G.bg, borderColor: G.border, fontSize: 12 }}>
              {name.view_count || 0} views
            </Badge>
            {name.last_viewed && (
              <Badge style={{ background: G.bg, borderColor: G.border, fontSize: 12 }}>
                Last viewed {new Date(name.last_viewed).toLocaleDateString()}
              </Badge>
            )}
            {source === "B" && name.source_pdf_page && (
              <Badge style={{ background: G.bg, borderColor: G.border, fontSize: 12 }}>
                PDF Page {name.source_pdf_page}
              </Badge>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleFavorite}
            className="flex items-center gap-2 px-6 py-3 rounded-xl"
            style={{
              color: name.is_favorite ? G.text : "rgba(255,255,255,0.40)",
              background: name.is_favorite ? G.bg : "rgba(255,255,255,0.03)",
              border: `1px solid ${name.is_favorite ? G.border : "rgba(255,255,255,0.08)"}`,
              fontSize: 16
            }}
          >
            <Heart className={`w-5 h-5 ${name.is_favorite ? "fill-current" : ""}`} />
            <span>{name.is_favorite ? "In Favorites" : "Add to Favorites"}</span>
          </button>
        </div>

        {/* Abjad Calculation Cards - Section B Only */}
        {source === "B" && abjadValue && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Card 1: Abjad Value */}
            <div className="rounded-xl border p-5 text-center" style={{
              background: "linear-gradient(145deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.05) 100%)",
              border: "1px solid rgba(212,175,55,0.40)",
              boxShadow: "0 0 20px rgba(212,175,55,0.12)"
            }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calculator className="w-5 h-5" style={{ color: G.text }} />
                <h3 className="font-inter font-semibold text-white text-sm">Abjad Value</h3>
              </div>
              <p className="font-amiri text-4xl font-bold" style={{ color: G.text, textShadow: "0 0 20px rgba(212,175,55,0.35)" }}>
                {abjadValue}
              </p>
              <p className="text-xs text-gray-400 mt-2">{name.arabic_name}</p>
            </div>

            {/* Card 2: Abjad Square */}
            <div className="rounded-xl border p-5 text-center" style={{
              background: "linear-gradient(145deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.05) 100%)",
              border: "1px solid rgba(212,175,55,0.40)",
              boxShadow: "0 0 20px rgba(212,175,55,0.12)"
            }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calculator className="w-5 h-5" style={{ color: G.text }} />
                <h3 className="font-inter font-semibold text-white text-sm">Abjad Square</h3>
              </div>
              <p className="font-amiri text-3xl font-bold" style={{ color: G.text, textShadow: "0 0 20px rgba(212,175,55,0.35)" }}>
                {abjadSquare}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {abjadValue} × {abjadValue} = {abjadSquare}
              </p>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-4">
          
          {/* Meaning */}
          {name.meaning_malayalam ? (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">അർത്ഥം (Meaning)</h2>
              </div>
              <p className="text-white/80 leading-relaxed">{name.meaning_malayalam}</p>
            </div>
          ) : null}

          {/* Explanation */}
          {name.explanation_malayalam ? (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">വിശദീകരണം (Explanation)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.explanation_malayalam}</p>
            </div>
          ) : null}

          {/* Virtues & Benefits */}
          {name.virtues_benefits ? (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">ഗുണങ്ങളും ആനുകൂല്യങ്ങളും (Virtues & Benefits)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.virtues_benefits}</p>
            </div>
          ) : null}

          {/* Islamic Information */}
          {name.islamic_information ? (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">ഇസ്ലാമിക വിവരങ്ങൾ (Islamic Information)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.islamic_information}</p>
            </div>
          ) : null}

          {/* Authentic Notes */}
          {name.authentic_notes ? (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">ആധികാരിക കുറിപ്പുകൾ (Authentic Notes)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.authentic_notes}</p>
            </div>
          ) : null}

          {/* Source Reference */}
          <div className="text-center text-xs text-white/30 mt-6">
            {source === "A" && name.source_reference && (
              <>
                <p>Source: {name.source_reference}</p>
                {name.source_page && <p>Page {name.source_page}</p>}
              </>
            )}
            {source === "B" && (
              <>
                <p>Source: {name.source_pdf_file || "PDF"}</p>
                {name.source_pdf_page && <p>Page {name.source_pdf_page}</p>}
                {name.surah_name && <p>Surah: {name.surah_name}</p>}
              </>
            )}
          </div>

        </div>

      </motion.div>
    </PageLayout>
  );
}