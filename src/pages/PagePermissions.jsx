import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Lock, Globe, ChevronDown, ChevronUp, Save, Box } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { getContentPages } from "@/lib/pageRegistry";
import PagePlansSection from "@/components/admin/PagePlansSection";
import FeatureRow from "@/components/admin/FeatureRow";
import { hasSubFeatures, getFeatures } from "@/lib/featureRegistry";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const DURATION_OPTIONS = [
  { value: "1_DAY",    label: "1 Day",     days: 1 },
  { value: "7_DAYS",   label: "7 Days",    days: 7 },
  { value: "30_DAYS",  label: "30 Days",   days: 30 },
  { value: "3_MONTHS", label: "3 Months",  days: 90 },
  { value: "6_MONTHS", label: "6 Months",  days: 180 },
  { value: "1_YEAR",   label: "1 Year",    days: 365 },
  { value: "LIFETIME", label: "Lifetime",  days: null },
];

// Per-page settings editor — shown only for SINGLE pages (no sub-features)
function PremiumSettings({ path, settings, onChange, saving }) {
  const s = settings || {};
  const set = (key, val) => onChange({ ...s, [key]: val });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 pt-3 space-y-3 overflow-hidden"
      style={{ borderTop: `1px solid ${G.border}` }}
    >
      <PagePlansSection pagePath={path} />
      <div>
        <label className="text-xs text-white/45 block mb-1">Description (shown to users)</label>
        <textarea
          value={s.description || ""}
          onChange={e => set("description", e.target.value)}
          placeholder="What does this page contain? Why should users subscribe?"
          rows={2}
          className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`code-req-${path}`}
          checked={s.reading_code_required !== false}
          onChange={e => set("reading_code_required", e.target.checked)}
          className="w-4 h-4 accent-yellow-400"
        />
        <label htmlFor={`code-req-${path}`} className="text-xs text-white/60">
          Require Reading Code to unlock (uncheck = admin grants manually only)
        </label>
      </div>
    </motion.div>
  );
}

// Single page row (no sub-features) — page-level toggle + plans
function SinglePageRow({ page, dbRecord, onSave }) {
  const { toast } = useToast();
  const [isPrivate, setIsPrivate] = useState(
    dbRecord ? dbRecord.requires_permission : page.requiresPermission
  );
  const [expanded, setExpanded] = useState(false);
  const [settings, setSettings] = useState({
    description: dbRecord?.description || "",
    duration: dbRecord?.default_duration || "LIFETIME",
    reading_code_required: dbRecord?.reading_code_required !== false,
  });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const handleToggle = (newValue) => {
    setIsPrivate(newValue);
    setDirty(true);
    if (newValue) setExpanded(true);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.functions.invoke("updatePageVisibility", {
        page_path: page.path,
        requires_permission: isPrivate,
        price: null,
        description: settings.description || null,
        default_duration: settings.duration,
        reading_code_required: settings.reading_code_required,
      });
      toast({ title: `✓ ${page.name} saved` });
      setDirty(false);
      onSave();
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="rounded-xl border p-4 transition-all"
      style={{
        background: isPrivate ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.04)",
        borderColor: isPrivate ? "rgba(239,68,68,0.30)" : "rgba(34,197,94,0.25)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-base w-6 text-center flex-shrink-0">{page.icon || "📄"}</span>
        <div className="flex-1 min-w-0">
          <p className="font-inter font-semibold text-white text-sm truncate">{page.name}</p>
          <p className="text-[10px] text-white/35 font-mono">{page.path}</p>
        </div>
        <Badge className={`text-xs border flex-shrink-0 ${
          isPrivate ? "bg-red-500/15 text-red-400 border-red-500/40" : "bg-green-500/15 text-green-400 border-green-500/40"
        }`}>
          {isPrivate ? "PREMIUM" : "PUBLIC"}
        </Badge>
        <div className="flex gap-1.5 flex-shrink-0">
          <button onClick={() => handleToggle(false)} disabled={saving}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: !isPrivate ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${!isPrivate ? "rgba(34,197,94,0.50)" : "rgba(255,255,255,0.10)"}`,
              color: !isPrivate ? "#4ade80" : "rgba(255,255,255,0.40)",
            }}>
            <Globe className="w-3 h-3 inline mr-1" />Public
          </button>
          <button onClick={() => handleToggle(true)} disabled={saving}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: isPrivate ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isPrivate ? "rgba(239,68,68,0.50)" : "rgba(255,255,255,0.10)"}`,
              color: isPrivate ? "#f87171" : "rgba(255,255,255,0.40)",
            }}>
            <Lock className="w-3 h-3 inline mr-1" />Premium
          </button>
        </div>
        {isPrivate && (
          <button onClick={() => setExpanded(v => !v)}
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ color: G.dim, background: G.bg, border: `1px solid ${G.border}` }}>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
        {dirty && (
          <button onClick={handleSave} disabled={saving}
            className="px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
            <Save className="w-3 h-3 inline mr-1" />{saving ? "…" : "Save"}
          </button>
        )}
      </div>
      <AnimatePresence>
        {isPrivate && expanded && (
          <PremiumSettings path={page.path} settings={settings} onChange={handleSettingsChange} saving={saving} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Multi-feature page row — container with child features
function ContainerPageRow({ page, dbFeatureConfigs }) {
  const [expanded, setExpanded] = useState(false);
  const features = getFeatures(page.path);

  return (
    <div className="rounded-xl border p-4" style={{
      background: "rgba(212,175,55,0.04)",
      borderColor: "rgba(212,175,55,0.25)",
    }}>
      <div className="flex items-center gap-3">
        <span className="text-base w-6 text-center flex-shrink-0">{page.icon || "📄"}</span>
        <div className="flex-1 min-w-0">
          <p className="font-inter font-semibold text-white text-sm truncate">{page.name}</p>
          <p className="text-[10px] text-white/35 font-mono">{page.path}</p>
        </div>
        <Badge className="text-xs border flex-shrink-0 bg-yellow-500/15 text-yellow-400 border-yellow-500/40 flex items-center gap-1">
          <Box className="w-2.5 h-2.5" />CONTAINER
        </Badge>
        <span className="text-[10px] text-white/30 flex-shrink-0">{features.length} features</span>
        <button onClick={() => setExpanded(v => !v)}
          className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
          style={{ color: G.dim, background: G.bg, border: `1px solid ${G.border}` }}>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 space-y-2 overflow-hidden"
            style={{ borderTop: `1px solid ${G.border}` }}
          >
            <p className="text-[10px] text-white/35 mb-2">
              Each feature below has independent pricing, plans, and access. The parent page is only a container.
            </p>
            {features.map((feat, idx) => (
              <FeatureRow
                key={feat.id}
                pagePath={page.path}
                pageName={page.name}
                feature={feat}
                index={idx}
                dbConfig={dbFeatureConfigs?.[feat.id] || null}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PagePermissions() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [dbRecords, setDbRecords] = useState({});
  const [dbFeatureConfigs, setDbFeatureConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const pages = useMemo(() => getContentPages().filter(p => p.name), []);

  useEffect(() => { checkAdmin(); }, [refreshKey]);

  const checkAdmin = async () => {
    if (isAdmin === null) setLoading(true);
    try {
      const user = await base44.auth.me();
      if (user?.role !== "admin") { setIsAdmin(false); return; }
      setIsAdmin(true);

      // Fetch page visibility configs (for single pages)
      const configs = await base44.entities.PageVisibilityConfig.list(null, 500);
      const map = {};
      (configs || []).forEach(c => { map[c.page_path] = c; });
      setDbRecords(map);

      // Fetch feature configs (for multi-feature pages)
      const featConfigs = await base44.entities.FeatureConfig.list(null, 500);
      const featMap = {};
      (featConfigs || []).forEach(c => {
        if (!featMap[c.page_path]) featMap[c.page_path] = {};
        featMap[c.page_path][c.feature_id] = c;
      });
      setDbFeatureConfigs(featMap);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null || loading) {
    return (
      <AdminLayout title="Loading..." showBackButton={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const publicCount = pages.filter(p => {
    if (hasSubFeatures(p.path)) return false; // containers are neither public nor premium
    const db = dbRecords[p.path];
    return db ? !db.requires_permission : !p.requiresPermission;
  }).length;
  const premiumCount = pages.filter(p => {
    if (hasSubFeatures(p.path)) return false;
    const db = dbRecords[p.path];
    return db ? db.requires_permission : p.requiresPermission;
  }).length;
  const containerCount = pages.filter(p => hasSubFeatures(p.path)).length;

  return (
    <AdminLayout title="Page Access Manager" subtitle="Configure every page and child feature independently">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border p-3 text-center"
            style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.25)" }}>
            <p className="text-2xl font-bold text-green-400">{publicCount}</p>
            <p className="text-xs text-white/45">Public</p>
          </div>
          <div className="rounded-xl border p-3 text-center"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}>
            <p className="text-2xl font-bold text-red-400">{premiumCount}</p>
            <p className="text-xs text-white/45">Premium</p>
          </div>
          <div className="rounded-xl border p-3 text-center"
            style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
            <p className="text-2xl font-bold text-yellow-400">{containerCount}</p>
            <p className="text-xs text-white/45">Containers</p>
          </div>
        </div>

        {/* Info note */}
        <div className="rounded-xl border p-3 text-xs text-white/45"
          style={{ background: G.bg, borderColor: G.border }}>
          <span style={{ color: G.text }} className="font-semibold">Note:</span> Multi-feature pages (marked CONTAINER) contain independent child features. Expand a container to configure each child's Public/Premium toggle, pricing, and subscription plans separately.
        </div>

        {/* Page List */}
        <div className="space-y-2">
          {pages.map(page => (
            hasSubFeatures(page.path) ? (
              <ContainerPageRow
                key={page.path}
                page={page}
                dbFeatureConfigs={dbFeatureConfigs[page.path]}
              />
            ) : (
              <SinglePageRow
                key={page.path}
                page={page}
                dbRecord={dbRecords[page.path] || null}
                onSave={() => setRefreshKey(k => k + 1)}
              />
            )
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}