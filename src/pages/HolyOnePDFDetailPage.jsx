import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Book, FileText, Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function HolyOnePDFDetailPage() {
  const { nameId } = useParams();
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadDetail();
  }, [nameId]);

  const loadDetail = async () => {
    try {
      const allNames = await base44.entities.HolyOnePDFName.list();
      const foundName = allNames.find(n => n.pdf_name_id === nameId);
      if (foundName) {
        setName(foundName);
        setIsFavorite(foundName.is_favorite || false);
        
        // Increment view count
        await base44.entities.HolyOnePDFName.update(foundName.id, {
          view_count: (foundName.view_count || 0) + 1,
          last_viewed: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error loading PDF Holy Name detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!name) return;
    try {
      await base44.entities.HolyOnePDFName.update(name.id, {
        is_favorite: !isFavorite
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (!name) {
    return (
      <PageLayout>
        <div className="text-center py-12 text-gray-400">
          <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Holy Name not found</p>
          <Link to="/holy-names-pdf" className="text-gold mt-4 inline-block">
            ← Back to list
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="space-y-6"
      >
        {/* Back Button */}
        <Link
          to="/holy-names-pdf"
          className="inline-flex items-center gap-2 text-gold-dim hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Holy Names - Section B</span>
        </Link>

        {/* Header */}
        <div className="card-dark p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Arabic Name */}
              <h1 className="text-5xl font-bold font-amiri text-gold text-center mb-2">
                {name.arabic_name}
              </h1>
              <p className="text-center text-gray-400 text-lg">
                {name.arabic_transliteration}
              </p>
            </div>
            
            <button
              onClick={toggleFavorite}
              className={`p-3 rounded-xl border transition-all ${
                isFavorite 
                  ? "bg-gold/20 border-gold text-gold" 
                  : "bg-card border-gold-dim text-gray-400 hover:text-gold"
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? "fill-gold" : ""}`} />
            </button>
          </div>

          {/* Malayalam Pronunciation & Meaning */}
          <div className="text-center space-y-2 pt-4 border-t border-gold-dim/20">
            <p className="text-xl font-malayalam text-gray-200">
              {name.malayalam_pronunciation}
            </p>
            <p className="text-lg text-gold-dim">
              {name.meaning_malayalam}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 pt-4 border-t border-gold-dim/20">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{name.surah_name} (Surah {name.surah_number})</span>
            </div>
            <div>
              PDF Page: {name.source_pdf_page}
            </div>
            <div>
              Order: #{name.global_order}
            </div>
            {name.verification_status === "verified" && (
              <div className="text-green-400">
                ✓ Verified
              </div>
            )}
          </div>
        </div>

        {/* Complete Explanation */}
        {name.explanation_malayalam && (
          <div className="card-dark p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gold flex items-center gap-2">
              <Book className="w-5 h-5" />
              വിശദീകരണം (Complete Explanation)
            </h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown className="text-gray-300 leading-relaxed font-malayalam">
                {name.explanation_malayalam}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Virtues & Benefits */}
        {name.virtues_benefits && (
          <div className="card-dark p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gold">
              ഗുണങ്ങളും ആശീർവാദങ്ങളും (Virtues & Benefits)
            </h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown className="text-gray-300 leading-relaxed font-malayalam">
                {name.virtues_benefits}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Islamic Information */}
        {name.islamic_information && (
          <div className="card-dark p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gold">
              ഇസ്ലാമിക വിവരങ്ങൾ (Islamic Information)
            </h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown className="text-gray-300 leading-relaxed font-malayalam">
                {name.islamic_information}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Authentic Notes */}
        {name.authentic_notes && (
          <div className="card-dark p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gold">
              ആധികാരിക കുറിപ്പുകൾ (Authentic Notes)
            </h2>
            <div className="prose prose-invert max-w-none bg-gold/5 p-4 rounded-xl border border-gold-dim/30">
              <ReactMarkdown className="text-gray-300 leading-relaxed font-malayalam text-sm">
                {name.authentic_notes}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Source Reference */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gold-dim/20">
          <p>Source: {name.source_reference_arabic}</p>
          <p>PDF: {name.source_pdf_file.replace(/_/g, " ")} - Page {name.source_pdf_page}</p>
          <p className="mt-2">ഗ്രന്ഥം: മആനി അൽ-അസ്‌മാ അൽ-ഇലാഹിയ്യ - ശൈഖ് അഫീഫ് അൽ-ദീൻ അൽ-തിലിംസാനി</p>
        </div>
      </motion.div>
    </PageLayout>
  );
}