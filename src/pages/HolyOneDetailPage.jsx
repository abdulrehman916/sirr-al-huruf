import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, BookOpen, Star, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
};

export default function HolyOneDetailPage() {
  const { nameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadName();
  }, [nameId]);

  const loadName = async () => {
    setLoading(true);
    try {
      const result = await base44.entities.HolyOneName.filter({ name_id: nameId });
      if (result && result.length > 0) {
        setName(result[0]);
      } else {
        toast({ title: "Name not found", variant: "destructive" });
        navigate("/holy-names/one");
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
      await base44.entities.HolyOneName.update(name.id, { is_favorite: !name.is_favorite });
      loadName();
      toast({ title: name.is_favorite ? "Removed from favorites" : "Added to favorites" });
    } catch (e) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  if (loading || !name) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 rounded-full animate-spin" />
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

        {/* Arabic Name */}
        <div className="text-center mb-6">
          <h1 className="font-amiri text-4xl font-bold text-gold mb-3">{name.arabic_name}</h1>
          <p className="text-lg text-white/60 mb-2">{name.malayalam_pronunciation}</p>
          <div className="flex items-center justify-center gap-3">
            <Badge style={{ background: G.bg, borderColor: G.border, fontSize: 12 }}>
              {name.view_count || 0} views
            </Badge>
            {name.last_viewed && (
              <Badge style={{ background: G.bg, borderColor: G.border, fontSize: 12 }}>
                Last viewed {new Date(name.last_viewed).toLocaleDateString()}
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

        {/* Content Sections */}
        <div className="space-y-4">
          
          {/* Meaning */}
          {name.meaning_malayalam && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">അർത്ഥം (Meaning)</h2>
              </div>
              <p className="text-white/80 leading-relaxed">{name.meaning_malayalam}</p>
            </div>
          )}

          {/* Explanation */}
          {name.explanation_malayalam && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">വിശദീകരണം (Explanation)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.explanation_malayalam}</p>
            </div>
          )}

          {/* Virtues & Benefits */}
          {name.virtues_benefits && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">ഗുണങ്ങളും ആനുകൂല്യങ്ങളും (Virtues & Benefits)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.virtues_benefits}</p>
            </div>
          )}

          {/* Islamic Information */}
          {name.islamic_information && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">ഇസ്ലാമിക വിവരങ്ങൾ (Islamic Information)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.islamic_information}</p>
            </div>
          )}

          {/* Authentic Notes */}
          {name.authentic_notes && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-semibold text-white">ആധികാരിക കുറിപ്പുകൾ (Authentic Notes)</h2>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{name.authentic_notes}</p>
            </div>
          )}

          {/* Source Reference */}
          {name.source_reference && (
            <div className="text-center text-xs text-white/30 mt-6">
              <p>Source: {name.source_reference}</p>
              {name.source_page && <p>Page {name.source_page}</p>}
            </div>
          )}

        </div>

      </motion.div>
    </PageLayout>
  );
}