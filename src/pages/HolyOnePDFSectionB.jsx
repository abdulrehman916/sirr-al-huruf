import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Book, Search, Filter } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

export default function HolyOnePDFSectionB() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState("all");
  const [surahList, setSurahList] = useState([]);

  useEffect(() => {
    loadNames();
  }, []);

  const loadNames = async () => {
    try {
      const allNames = await base44.entities.HolyOnePDFName.list();
      setNames(allNames || []);
      
      // Extract unique surahs
      const uniqueSurahs = [...new Set(allNames.map(n => n.surah_name))].filter(Boolean);
      setSurahList(uniqueSurahs);
    } catch (error) {
      console.error("Error loading PDF Holy Names:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNames = names.filter(name => {
    const matchesSearch = searchQuery === "" || 
      name.arabic_name?.includes(searchQuery) ||
      name.arabic_transliteration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning_malayalam?.includes(searchQuery);
    
    const matchesSurah = selectedSurah === "all" || name.surah_name === selectedSurah;
    
    return matchesSearch && matchesSurah;
  });

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <PageLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.15 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold font-amiri text-gold">
            الأسماء الإلهية - القسم ب
          </h1>
          <h2 className="text-xl font-semibold font-inter text-gold-dim">
            Holy Names - Section B (PDF Source)
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Complete collection from Ma'ani al-Asma' al-Ilahiyya by Sheikh Afif al-Din al-Tilimsani
            <br />
            <span className="text-xs">Source: Original PDFs - Pages 1-186</span>
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Arabic name, transliteration, or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-dim bg-card-dark text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
              style={{ fontSize: "16px" }}
            />
          </div>
          
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-dim bg-card-dark text-foreground focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
              style={{ fontSize: "16px" }}
            >
              <option value="all">All Surahs</option>
              {surahList.map(surah => (
                <option key={surah} value={surah}>{surah}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            <span>{filteredNames.length} names</span>
          </div>
          {selectedSurah !== "all" && (
            <div>
              from {surahList.length} surahs
            </div>
          )}
        </div>

        {/* Names Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNames.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No Holy Names found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNames.map((name, index) => (
              <Link
                key={name.id}
                to={`/holy-names-pdf/${name.pdf_name_id}`}
                className="card-dark p-4 hover:border-gold transition-all duration-200 group"
              >
                <div className="space-y-3">
                  {/* Arabic Name */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold font-amiri text-gold group-hover:text-gold-dim transition-colors">
                      {name.arabic_name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {name.arabic_transliteration}
                    </p>
                  </div>

                  {/* Malayalam */}
                  <div className="text-center space-y-1">
                    <p className="text-sm font-malayalam text-gray-300">
                      {name.malayalam_pronunciation}
                    </p>
                    <p className="text-xs text-gray-400">
                      {name.meaning_malayalam}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gold-dim/20">
                    <span>{name.surah_name}</span>
                    <span>Page {name.source_pdf_page}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
}