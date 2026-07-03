/**
 * EditCodeModal — Add features/pages to an existing Access Code.
 * Preserves existing code data, merges new selections.
 * User re-redeems the same code to get updated permissions.
 */
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, Check, KeyRound } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { getContentPages } from "@/lib/pageRegistry";
import { DURATION_OPTIONS } from "@/lib/codeDuration";
import CreateCodePageItem from "./CreateCodePageItem";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};



export default function EditCodeModal({ code, onClose, onUpdated }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savingFeature, setSavingFeature] = useState(null);
  const [localCode, setLocalCode] = useState(code);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pageDurations, setPageDurations] = useState({});
  const [pageSubFeatures, setPageSubFeatures] = useState({});
  const [featureDurations, setFeatureDurations] = useState({});

  const pageList = useMemo(() => getContentPages().map(p => ({
    path: p.path, name: p.name, icon: p.icon || '📖',
    category: p.category || 'General', adminOnly: p.adminOnly || false,
  })), []);

  // Initialize from existing code data
  useEffect(() => {
    if (!code) return;
    setLocalCode(code);
    setSelectedPages(code.page_paths || []);
    setPageDurations(code.page_durations || {});
    setPageSubFeatures(code.sub_features || {});
    setFeatureDurations(code.feature_durations || {});
  }, [code]);

  if (!code) return null;

  const togglePage = (path) => {
    setSelectedPages(p => {
      if (p.includes(path)) {
        const newPages = p.filter(x => x !== path);
        const newDurations = { ...pageDurations }; delete newDurations[path];
        setPageDurations(newDurations);
        const newSub = { ...pageSubFeatures }; delete newSub[path];
        setPageSubFeatures(newSub);
        return newPages;
      }
      return [...p, path];
    });
  };

  const updatePageSubFeatures = (path, features) => {
    setPageSubFeatures(prev => ({ ...prev, [path]: features }));
  };

  const updatePageDuration = (path, durationValue) => {
    const opt = DURATION_OPTIONS.find(d => d.value === durationValue);
    setPageDurations(prev => ({ ...prev, [path]: { value: durationValue, label: opt?.label, days: opt?.days, duration_ms: opt?.duration_ms, custom_date: null } }));
  };

  const updateCustomDate = (path, customDate) => {
    setPageDurations(prev => ({ ...prev, [path]: { ...prev[path], custom_date: customDate } }));
  };

  const updateFeatureDuration = (path, featureId, plan) => {
    setFeatureDurations(prev => ({ ...prev, [`${path}:${featureId}`]: plan }));
  };

  // Re-fetch code from backend — updates "Currently Unlocked" without closing modal
  const refreshCode = async () => {
    try {
      const updated = await base44.entities.AccessCode.get(code.id);
      setLocalCode(updated);
      setSelectedPages(updated.page_paths || []);
      setPageDurations(updated.page_durations || {});
      setPageSubFeatures(updated.sub_features || {});
      setFeatureDurations(updated.feature_durations || {});
    } catch {}
  };

  // Save a SINGLE feature's duration — does NOT close the modal
  const handleSaveFeature = async (path, featId, plan) => {
    setSavingFeature({ path, featId });
    try {
      const newFeatureDurations = { ...featureDurations, [`${path}:${featId}`]: plan };
      const currentSubFeats = pageSubFeatures[path] || [];
      const newSubFeats = currentSubFeats.includes(featId) ? currentSubFeats : [...currentSubFeats, featId];
      const newPageSubFeatures = { ...pageSubFeatures, [path]: newSubFeats };
      setFeatureDurations(newFeatureDurations);
      setPageSubFeatures(newPageSubFeatures);
      await base44.entities.AccessCode.update(code.id, {
        feature_durations: newFeatureDurations,
        sub_features: newPageSubFeatures,
      });
      toast({ title: `✓ ${featId} saved` });
      refreshCode();
    } catch (e) {
      toast({ title: "Error saving feature", description: e.message, variant: "destructive" });
    } finally {
      setSavingFeature(null);
    }
  };

  // Close modal + refresh parent list
  const handleClose = () => {
    if (onUpdated) onUpdated();
    else onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const names = selectedPages.map(path => pageList.find(p => p.path === path)?.name || path);

      // Build sub_features — only include pages with specific selections
      const sub_features = {};
      selectedPages.forEach(path => {
        const feats = pageSubFeatures[path];
        if (feats && feats.length > 0) sub_features[path] = feats;
      });

      await base44.entities.AccessCode.update(code.id, {
        page_paths: selectedPages,
        page_names: names,
        page_durations: pageDurations,
        sub_features,
        feature_durations: featureDurations,
      });

      toast({ title: `✓ Code "${code.code}" updated` });
      refreshCode();
    } catch (e) {
      toast({ title: "Error updating code", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const existingPageNames = localCode?.page_names || localCode?.page_paths || code.page_names || code.page_paths || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4"
        style={{ background: "rgba(0,0,0,0.70)" }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl my-8 rounded-2xl border p-5 space-y-4"
          style={{ background: "linear-gradient(145deg, #0c1630, #060c1c)", borderColor: G.borderHi }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" style={{ color: G.text }} />
              <div>
                <h3 className="font-inter font-bold text-white text-sm">Edit Code: {code.code}</h3>
                <p className="text-[10px] text-white/40">{code.customer_name} · Add or modify features</p>
              </div>
            </div>
            <button onClick={handleClose} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current pages summary */}
          <div className="rounded-lg border p-2.5" style={{ background: G.bg, borderColor: G.border }}>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Currently unlocked</p>
            <div className="flex flex-wrap gap-1.5">
              {existingPageNames.map((name, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold"
                  style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Page selection */}
          <div>
            <label className="text-xs text-white/45 mb-2 block">
              Pages & Features ({selectedPages.length} selected)
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {pageList.map(page => {
                const sel = selectedPages.includes(page.path);
                const dur = pageDurations[page.path];
                return (
                  <CreateCodePageItem
                    key={page.path}
                    page={page}
                    isSelected={sel}
                    duration={dur}
                    onToggle={togglePage}
                    onDurationChange={updatePageDuration}
                    onCustomDateChange={updateCustomDate}
                    subFeatures={pageSubFeatures[page.path]}
                    onSubFeaturesChange={updatePageSubFeatures}
                    featureDurations={featureDurations}
                    onFeatureDurationChange={updateFeatureDuration}
                    onSaveFeature={handleSaveFeature}
                    savingFeature={savingFeature}
                  />
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleClose}
              className="flex-1 py-3 rounded-xl font-inter font-semibold text-sm"
              style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}