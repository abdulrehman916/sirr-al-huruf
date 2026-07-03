/**
 * AdminPricingDashboard — Complete pricing & plan management system.
 *
 * Features:
 * - Lists ALL premium/multi-feature pages from pageRegistry
 * - Search by page name
 * - Filter: All / Premium / Public / Purchasable / Not Purchasable
 * - Drag-and-drop ordering (updates display_order)
 * - Per-page: title, description, price, show/hide, enable/disable purchasing, display order
 * - Per-feature (multi-feature pages): name, description, purchasable toggle
 * - Per-plan: name, duration, price, sale price, discount %, sale dates, recommended, active
 * - Validation before saving
 * - Save confirmation toasts
 *
 * Reuses: PageVisibilityConfig, FeatureConfig, SubscriptionPlanConfig entities.
 * Backward compatible: existing records work without migration.
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Search, RefreshCw, Save, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import PricingPageCard from "@/components/admin/PricingPageCard";
import { getContentPages } from "@/lib/pageRegistry";
import { FEATURE_REGISTRY } from "@/lib/featureRegistry";
import { invalidateFeatureConfigCache } from "@/lib/featureConfigCache";
import { invalidatePlanCache } from "@/lib/subscriptionPlanCache";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

// Build the list of pages to manage: premium pages + multi-feature pages (deduped)
function buildPageList() {
  const contentPages = getContentPages();
  const premiumPages = contentPages.filter((p) => p.requiresPermission);
  const multiFeaturePaths = Object.keys(FEATURE_REGISTRY);

  // Merge: premium pages + multi-feature pages not already in the list
  const seen = new Set();
  const result = [];
  for (const p of premiumPages) {
    if (!seen.has(p.path)) {
      seen.add(p.path);
      result.push(p);
    }
  }
  for (const path of multiFeaturePaths) {
    if (!seen.has(path)) {
      const reg = FEATURE_REGISTRY[path];
      seen.add(path);
      result.push({ path, name: reg.pageName, icon: "✨", requiresPermission: false });
    }
  }
  return result;
}

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "PREMIUM", label: "Premium" },
  { value: "PUBLIC", label: "Public" },
  { value: "PURCHASABLE", label: "Purchasable" },
  { value: "NOT_PURCHASABLE", label: "Not Purchasable" },
];

export default function AdminPricingDashboard() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  // Data
  const [visibilityConfigs, setVisibilityConfigs] = useState([]);
  const [featureConfigs, setFeatureConfigs] = useState([]);
  const [allPlans, setAllPlans] = useState([]);

  // UI
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [pageOrder, setPageOrder] = useState([]);

  const allPages = useMemo(() => buildPageList(), []);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      loadData();
    } catch {
      setIsAdmin(false);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [vis, cfgs, plans] = await Promise.all([
        base44.entities.PageVisibilityConfig.list("-updated_at", 200),
        base44.entities.FeatureConfig.list("-updated_at", 200),
        base44.entities.SubscriptionPlanConfig.list("sort_order", 500),
      ]);
      setVisibilityConfigs(vis || []);
      setFeatureConfigs(cfgs || []);
      setAllPlans(plans || []);

      // Build page order sorted by display_order (from visibility config), fallback to registry order
      const visMap = {};
      (vis || []).forEach((v) => {
        if (v.page_path) visMap[v.page_path] = v;
      });
      const ordered = [...allPages].sort((a, b) => {
        const aOrder = visMap[a.path]?.display_order || 0;
        const bOrder = visMap[b.path]?.display_order || 0;
        return aOrder - bOrder;
      });
      setPageOrder(ordered);
    } catch {
      setVisibilityConfigs([]);
      setFeatureConfigs([]);
      setAllPlans([]);
      setPageOrder(allPages);
    } finally {
      setLoading(false);
    }
  }, [allPages]);

  // Lookup maps
  const visMap = useMemo(() => {
    const map = {};
    visibilityConfigs.forEach((v) => {
      if (v.page_path) map[v.page_path] = v;
    });
    return map;
  }, [visibilityConfigs]);

  const configMap = useMemo(() => {
    const map = {};
    featureConfigs.forEach((c) => {
      if (c.page_path) {
        if (!map[c.page_path]) map[c.page_path] = [];
        map[c.page_path].push(c);
      }
    });
    return map;
  }, [featureConfigs]);

  const plansMap = useMemo(() => {
    const map = {};
    allPlans.forEach((p) => {
      if (p.page_path) {
        if (!map[p.page_path]) map[p.page_path] = [];
        map[p.page_path].push(p);
      }
    });
    return map;
  }, [allPlans]);

  // Filtered + searched pages
  const filteredPages = useMemo(() => {
    return pageOrder.filter((page) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (visMap[page.path]?.page_name || page.name || "").toLowerCase();
        if (!name.includes(q) && !page.path.toLowerCase().includes(q)) return false;
      }

      // Filter
      const vc = visMap[page.path];
      switch (filter) {
        case "PREMIUM":
          return vc ? vc.requires_permission !== false : page.requiresPermission;
        case "PUBLIC":
          return vc ? vc.requires_permission === false : !page.requiresPermission;
        case "PURCHASABLE":
          return vc ? vc.is_purchasable !== false : true;
        case "NOT_PURCHASABLE":
          return vc ? vc.is_purchasable === false : false;
        default:
          return true;
      }
    });
  }, [pageOrder, searchQuery, filter, visMap]);

  // Drag-and-drop handler
  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const newOrder = [...pageOrder];
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setPageOrder(newOrder);

    // Save new order to PageVisibilityConfig
    setSavingOrder(true);
    try {
      const me = await base44.auth.me();
      // Batch update display_order for all affected pages
      const updates = newOrder.map((page, idx) => {
        const vc = visMap[page.path];
        const data = {
          page_path: page.path,
          page_name: vc?.page_name || page.name,
          requires_permission: vc?.requires_permission !== false,
          is_purchasable: vc?.is_purchasable !== false,
          price: vc?.price || "",
          description: vc?.description || "",
          display_order: idx,
          default_duration: vc?.default_duration || "LIFETIME",
          reading_code_required: vc?.reading_code_required !== false,
          updated_by: me?.id || "",
          updated_at: new Date().toISOString(),
          archived: vc?.archived || false,
          admin_only: vc?.admin_only || false,
        };
        if (vc?.id) {
          return base44.entities.PageVisibilityConfig.update(vc.id, data);
        } else {
          return base44.entities.PageVisibilityConfig.create(data);
        }
      });

      await Promise.all(updates);
      toast({ title: "Order saved", description: "Page display order updated" });
      loadData();
    } catch (e) {
      toast({ title: "Order save failed", description: e.message, variant: "destructive" });
      loadData(); // Revert to server state
    } finally {
      setSavingOrder(false);
    }
  };

  const handleSaved = (pagePath) => {
    invalidateFeatureConfigCache(pagePath);
    invalidatePlanCache(pagePath);
    loadData();
  };

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null) {
    return (
      <AdminLayout title="Loading...">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pricing & Plans" subtitle="إدارة التسعير والخطط" showBackButton={true}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-inter text-xl font-bold text-white">Pricing & Plan Management</h1>
            <p className="text-xs text-white/40 mt-0.5">
              Manage all premium pages, features, plans, and discounts from one place
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl"
            style={{ border: `1px solid ${G.border}`, background: G.bg, color: G.text }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Info banner */}
        <div className="rounded-xl border p-3" style={{ background: G.bg, borderColor: G.border }}>
          <p className="text-xs text-white/60 leading-relaxed">
            Changes appear on locked screens immediately. Drag pages to reorder. Existing Reading Codes,
            permissions, and requests are not affected — only display configuration changes here.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder-white/30"
              style={{ background: G.bg, border: `1px solid ${G.border}`, fontSize: "16px" }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-3 py-2 rounded-xl font-inter text-xs font-bold transition-all"
                style={{
                  background: filter === f.value ? G.bgHi : G.bg,
                  border: `1px solid ${filter === f.value ? G.borderHi : G.border}`,
                  color: filter === f.value ? G.text : "rgba(255,255,255,0.50)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Saving order indicator */}
        {savingOrder && (
          <div className="flex items-center gap-2 text-xs" style={{ color: G.text }}>
            <Save className="w-3 h-3 animate-pulse" />
            Saving display order...
          </div>
        )}

        {/* Page List with Drag-and-Drop */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center" style={{ background: G.bg, borderColor: G.border }}>
            <p className="text-sm text-white/40">No pages match your search</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pricing-pages">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                  {filteredPages.map((page, index) => {
                    const vc = visMap[page.path];
                    const configs = configMap[page.path] || [];
                    const plans = plansMap[page.path] || [];

                    return (
                      <Draggable key={page.path} draggableId={page.path} index={index}>
                        {(dragProvided, snapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            style={{
                              ...dragProvided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.9 : 1,
                            }}
                          >
                            <PricingPageCard
                              pagePath={page.path}
                              pageName={page.name}
                              pageIcon={page.icon}
                              visibilityConfig={vc}
                              configs={configs}
                              plans={plans}
                              onSaved={() => handleSaved(page.path)}
                              index={index}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </AdminLayout>
  );
}