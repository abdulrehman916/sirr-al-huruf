/**
 * AdminFeaturePricing — Dynamic per-feature pricing & description management.
 *
 * Lists all features from the FeatureRegistry grouped by page.
 * Admin can set price, description, and display name for each feature.
 * Changes are stored in the FeatureConfig entity and appear on locked screens immediately.
 */
import { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import FeatureConfigEditor from "@/components/admin/FeatureConfigEditor";
import { FEATURE_REGISTRY } from "@/lib/featureRegistry";
import { invalidateFeatureConfigCache } from "@/lib/featureConfigCache";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function AdminFeaturePricing() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") { setIsAdmin(false); return; }
      setIsAdmin(true);
      loadConfigs();
    } catch {
      setIsAdmin(false);
    }
  };

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const all = await base44.entities.FeatureConfig.list("-updated_at", 200);
      setConfigs(all || []);
    } catch {
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const configMap = useMemo(() => {
    const map = {};
    (configs || []).forEach(c => {
      if (c.page_path && c.feature_id) {
        map[`${c.page_path}:${c.feature_id}`] = c;
      }
    });
    return map;
  }, [configs]);

  const handleSaved = (pagePath) => {
    invalidateFeatureConfigCache(pagePath);
    loadConfigs();
  };

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null) {
    return (
      <AdminLayout title="Loading..." showBackButton={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Feature Pricing" subtitle="إدارة أسعار الميزات" showBackButton={true}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Info banner */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <p className="text-sm text-white/70 leading-relaxed">
            Configure the price and description for each feature. These values appear on the
            locked screen when a user clicks a feature they don't have access to. Changes take
            effect immediately — no code changes needed.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          Object.entries(FEATURE_REGISTRY).map(([pagePath, pageData]) => (
            <div key={pagePath} className="rounded-2xl border p-4 space-y-3" style={{
              background: "linear-gradient(145deg, #0c1630 0%, #060c1c 100%)",
              borderColor: G.border,
            }}>
              <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <h3 className="font-inter font-bold text-white text-sm">{pageData.pageName}</h3>
                <span className="text-[10px] text-white/30 font-mono">{pagePath}</span>
                <span className="ml-auto text-[10px] text-white/40">
                  {pageData.features.length} features
                </span>
              </div>
              <div className="space-y-2">
                {pageData.features.map(feature => (
                  <FeatureConfigEditor
                    key={feature.id}
                    pagePath={pagePath}
                    pageName={pageData.pageName}
                    feature={feature}
                    existingConfig={configMap[`${pagePath}:${feature.id}`]}
                    onSaved={() => handleSaved(pagePath)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}