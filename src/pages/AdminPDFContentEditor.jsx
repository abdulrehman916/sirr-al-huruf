import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Save, Book, AlertCircle, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function AdminPDFContentEditor() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [content, setContent] = useState({
    arabic_name: '',
    arabic_transliteration: '',
    malayalam_pronunciation: '',
    meaning_malayalam: '',
    explanation_malayalam: '',
    virtues_benefits: '',
    islamic_information: '',
    authentic_notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('incomplete'); // all, complete, incomplete

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      if (user?.role !== "admin") { setIsAdmin(false); return; }
      setIsAdmin(true);
      loadNames();
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadNames = async () => {
    try {
      const allNames = await base44.entities.HolyOnePDFName.list("-global_order");
      setNames(allNames || []);
    } catch (e) {
      toast({ title: "Failed to load names", description: e.message, variant: "destructive" });
    }
  };

  const selectName = (name) => {
    setSelectedName(name);
    setContent({
      arabic_name: name.arabic_name || '',
      arabic_transliteration: name.arabic_transliteration || '',
      malayalam_pronunciation: name.malayalam_pronunciation || '',
      meaning_malayalam: name.meaning_malayalam || '',
      explanation_malayalam: name.explanation_malayalam || '',
      virtues_benefits: name.virtues_benefits || '',
      islamic_information: name.islamic_information || '',
      authentic_notes: name.authentic_notes || ''
    });
  };

  const handleSave = async () => {
    if (!selectedName) return;
    setSaving(true);
    try {
      await base44.entities.HolyOnePDFName.update(selectedName.id, {
        ...content,
        verification_status: 'pending',
        verified_at: null,
        verified_by: null
      });
      
      // Update local state
      setSelectedName(prev => prev ? { ...prev, ...content } : null);
      loadNames();
      
      toast({ 
        title: "✓ Content saved", 
        description: "Please verify against PDF"
      });
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const markAsVerified = async () => {
    if (!selectedName) return;
    try {
      const user = await base44.auth.me();
      await base44.entities.HolyOnePDFName.update(selectedName.id, {
        verification_status: 'verified',
        verified_by: user.id,
        verified_at: new Date().toISOString()
      });
      toast({ title: "✓ Verified", description: "Content verified against PDF" });
      loadNames();
      setSelectedName(prev => prev ? { ...prev, verification_status: 'verified' } : null);
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  if (isAdmin === false) return <Navigate to="/" replace />;
  if (isAdmin === null || loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const stats = {
    total: names.length,
    complete: names.filter(n => n.explanation_malayalam && n.virtues_benefits).length,
    incomplete: names.filter(n => !n.explanation_malayalam || !n.virtues_benefits).length
  };

  const filteredNames = names.filter(n => {
    if (filter === 'complete') return n.explanation_malayalam && n.virtues_benefits;
    if (filter === 'incomplete') return !n.explanation_malayalam || !n.virtues_benefits;
    return true;
  });

  return (
    <AdminLayout title="PDF Holy Names Content Editor" subtitle="Section B - Complete PDF Content">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border p-3 text-center" style={{ background: G.bg, borderColor: G.border }}>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/40">Total Names</p>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.25)" }}>
            <p className="text-2xl font-bold text-green-400">{stats.complete}</p>
            <p className="text-xs text-white/40">Complete</p>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}>
            <p className="text-2xl font-bold text-red-400">{stats.incomplete}</p>
            <p className="text-xs text-white/40">Need Content</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: G.text }} />
            <div className="text-sm text-white/60">
              <p className="font-semibold mb-1" style={{ color: G.text }}>Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Select a name from the list</li>
                <li>Open the source PDF to the specified page</li>
                <li>Copy ALL content (every word, paragraph, note)</li>
                <li>Paste into the fields below</li>
                <li>Save and verify against PDF</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Name List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-inter font-semibold text-white text-sm">Names</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-1 rounded text-xs ${filter === 'all' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('incomplete')}
                  className={`px-2 py-1 rounded text-xs ${filter === 'incomplete' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}
                >
                  Need Content
                </button>
                <button
                  onClick={() => setFilter('complete')}
                  className={`px-2 py-1 rounded text-xs ${filter === 'complete' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}
                >
                  Complete
                </button>
              </div>
            </div>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none">
              {filteredNames.map(name => {
                const isComplete = name.explanation_malayalam && name.virtues_benefits;
                return (
                  <button
                    key={name.id}
                    onClick={() => selectName(name)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedName?.id === name.id
                        ? 'border-gold bg-gold/10'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-amiri text-gold font-bold truncate">{name.arabic_name}</p>
                        <p className="text-xs text-white/30 truncate">
                          PDF {name.source_pdf_file?.replace('pdf', '').split('_')[0] || '?'} • Page {name.source_pdf_page}
                        </p>
                      </div>
                      {isComplete ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            {selectedName ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-inter font-semibold text-white text-sm">
                    Content Editor
                  </h3>
                  <Badge style={{ 
                    background: selectedName.verification_status === 'verified' 
                      ? "rgba(34,197,94,0.15)" 
                      : "rgba(239,68,68,0.15)",
                    borderColor: selectedName.verification_status === 'verified'
                      ? "rgba(34,197,94,0.40)"
                      : "rgba(239,68,68,0.40)",
                    color: selectedName.verification_status === 'verified' ? "#4ade80" : "#f87171"
                  }}>
                    {selectedName.verification_status || 'pending'}
                  </Badge>
                </div>

                {/* Source Info */}
                <div className="rounded-xl border p-3 flex items-center gap-4 flex-wrap" style={{ background: G.bg, borderColor: G.border }}>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase">Source PDF</p>
                    <p className="text-xs text-white/60 font-semibold">{selectedName.source_pdf_file || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase">Page Number</p>
                    <p className="text-xs text-white/60 font-semibold">{selectedName.source_pdf_page || '?'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase">Surah</p>
                    <p className="text-xs text-white/60 font-semibold">{selectedName.surah_name || 'Unknown'}</p>
                  </div>
                </div>

                {/* Content Fields */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Arabic Name (from PDF)</label>
                    <input
                      value={content.arabic_name}
                      onChange={e => setContent(prev => ({ ...prev, arabic_name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none font-amiri text-lg"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">Transliteration (Latin)</label>
                    <input
                      value={content.arabic_transliteration}
                      onChange={e => setContent(prev => ({ ...prev, arabic_transliteration: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">Malayalam Pronunciation</label>
                    <input
                      value={content.malayalam_pronunciation}
                      onChange={e => setContent(prev => ({ ...prev, malayalam_pronunciation: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none font-malayalam"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">
                      അർത്ഥം (Meaning) - <span className="text-gold">Copy EXACT from PDF</span>
                    </label>
                    <textarea
                      value={content.meaning_malayalam}
                      onChange={e => setContent(prev => ({ ...prev, meaning_malayalam: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none font-malayalam"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                      placeholder="Copy complete meaning from PDF..."
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">
                      വിശദീകരണം (Explanation) - <span className="text-gold">ALL paragraphs, nothing omitted</span>
                    </label>
                    <textarea
                      value={content.explanation_malayalam}
                      onChange={e => setContent(prev => ({ ...prev, explanation_malayalam: e.target.value }))}
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none font-malayalam"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                      placeholder="Copy EVERY paragraph from PDF..."
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">
                      ഗുണങ്ങളും ആനുകൂല്യങ്ങളും (Virtues & Benefits) - <span className="text-gold">ALL virtues, benefits, powers</span>
                    </label>
                    <textarea
                      value={content.virtues_benefits}
                      onChange={e => setContent(prev => ({ ...prev, virtues_benefits: e.target.value }))}
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none font-malayalam"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                      placeholder="Copy EVERY virtue and benefit..."
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">
                      ഇസ്ലാമിക വിവരങ്ങൾ (Islamic Info) - <span className="text-gold">Quran, hadith, scholarly opinions</span>
                    </label>
                    <textarea
                      value={content.islamic_information}
                      onChange={e => setContent(prev => ({ ...prev, islamic_information: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none font-malayalam"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                      placeholder="Copy all Islamic references..."
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 block mb-1">
                      ആധികാരിക കുറിപ്പുകൾ (Notes/Warnings) - <span className="text-gold">ALL notes, warnings, conditions</span>
                    </label>
                    <textarea
                      value={content.authentic_notes}
                      onChange={e => setContent(prev => ({ ...prev, authentic_notes: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none font-malayalam"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
                      placeholder="Copy all notes and warnings..."
                    />
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Content"}
                  </button>
                  <button
                    onClick={markAsVerified}
                    className="flex-1 py-3 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.40)", color: "#4ade80" }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify & Approve
                  </button>
                </div>

              </>
            ) : (
              <div className="h-full flex items-center justify-center text-white/30">
                <div className="text-center">
                  <Book className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a name to edit content</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </motion.div>
    </AdminLayout>
  );
}