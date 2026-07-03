import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { getFeatures, hasSubFeatures } from "@/lib/featureRegistry";
import { getPagePlans } from "@/lib/subscriptionPlanCache";
import { DURATION_OPTIONS } from "@/lib/codeDuration";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};



export default function CreateCodePageItem({
  page,
  isSelected,
  duration,
  onToggle,
  onDurationChange,
  onCustomDateChange,
  subFeatures,
  onSubFeaturesChange,
  featureDurations,
  onFeatureDurationChange,
}) {
  const features = getFeatures(page.path);
  const isMultiFeature = hasSubFeatures(page.path);
  const selectedFeatures = subFeatures || [];
  const [pagePlans, setPagePlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);

  // Fetch plans for this page when it's selected and has sub-features
  useEffect(() => {
    if (!isSelected || !isMultiFeature) return;
    setPlansLoading(true);
    getPagePlans(page.path).then(plans => {
      setPagePlans(plans);
      setPlansLoading(false);
    });
  }, [isSelected, isMultiFeature, page.path]);

  const toggleFeature = (featId) => {
    if (!onSubFeaturesChange) return;
    if (selectedFeatures.includes(featId)) {
      onSubFeaturesChange(page.path, selectedFeatures.filter(f => f !== featId));
    } else {
      onSubFeaturesChange(page.path, [...selectedFeatures, featId]);
    }
  };

  const selectAllFeatures = () => {
    if (!onSubFeaturesChange) return;
    onSubFeaturesChange(page.path, []);
  };

  const selectPlan = (featId, plan) => {
    if (!onFeatureDurationChange) return;
    onFeatureDurationChange(page.path, featId, {
      plan_name: plan.plan_name,
      duration_days: plan.duration_type === "LIFETIME" ? null : plan.duration_days,
      is_lifetime: plan.duration_type === "LIFETIME",
    });
  };

  const getFeaturePlan = (featId) => {
    const key = `${page.path}:${featId}`;
    return featureDurations?.[key];
  };

  const getPlansForFeature = (featId) => pagePlans.filter(p => p.feature_id === featId);

  return (
    <div
      className="rounded-lg border p-3 transition-all"
      style={{
        background: isSelected ? G.bg : "rgba(255,255,255,0.02)",
        borderColor: isSelected ? G.border : "rgba(255,255,255,0.06)",
      }}
    >
      <button
        onClick={() => onToggle(page.path)}
        className="w-full flex items-center gap-3 mb-2 text-left"
        style={{ color: isSelected ? "white" : "rgba(255,255,255,0.50)" }}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
          style={{
            background: isSelected ? G.text : "transparent",
            border: `1.5px solid ${isSelected ? G.text : "rgba(255,255,255,0.25)"}`,
          }}
        >
          {isSelected && <Check className="w-3 h-3 text-black" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium flex items-center gap-2">
            <span>{page.icon || '📖'}</span>
            <span>{page.name}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
            <span>{page.category || 'General'}</span>
            <span>·</span>
            <span>{page.adminOnly ? "Admin" : "User"} Access</span>
          </div>
        </div>
      </button>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="ml-8 space-y-2"
        >
          {/* For non-multi-feature pages: show duration selector (existing behavior) */}
          {!isMultiFeature && (
            <>
              <label className="text-xs text-white/45 block">Duration</label>
              <div className="flex flex-wrap gap-1.5">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onDurationChange(page.path, opt.value)}
                    className="px-2 py-1 rounded text-[10px] font-semibold"
                    style={{
                      background: duration?.value === opt.value ? G.bgHi : "rgba(255,255,255,0.04)",
                      border: `1px solid ${duration?.value === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                      color: duration?.value === opt.value ? G.text : "rgba(255,255,255,0.50)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {duration?.value === "CUSTOM" && (
                <input
                  type="datetime-local"
                  value={duration.custom_date || ""}
                  onChange={(e) => onCustomDateChange(page.path, e.target.value)}
                  className="mt-1 w-full px-2 py-1.5 rounded text-xs text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }}
                />
              )}
            </>
          )}

          {/* Feature-level permission + plan selector for multi-feature pages */}
          {isMultiFeature && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-white/45 block">Features & Plans</label>
                <button
                  onClick={selectAllFeatures}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: selectedFeatures.length === 0 ? G.bgHi : "rgba(255,255,255,0.04)",
                    border: `1px solid ${selectedFeatures.length === 0 ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                    color: selectedFeatures.length === 0 ? G.text : "rgba(255,255,255,0.50)",
                  }}
                >
                  All Features
                </button>
              </div>

              {plansLoading && (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="w-3 h-3 animate-spin text-white/30" />
                  <span className="text-[10px] text-white/30">Loading plans…</span>
                </div>
              )}

              <div className="space-y-2">
                {features.map(feat => {
                  const isFeatSelected = selectedFeatures.includes(feat.id);
                  const allMode = selectedFeatures.length === 0;
                  const featPlans = getPlansForFeature(feat.id);
                  const selectedPlan = getFeaturePlan(feat.id);

                  return (
                    <div key={feat.id}
                      className="rounded-lg border p-2 transition-all"
                      style={{
                        background: isFeatSelected ? G.bgHi : "rgba(255,255,255,0.02)",
                        borderColor: isFeatSelected ? G.borderHi : "rgba(255,255,255,0.06)",
                        opacity: allMode ? 0.5 : 1,
                      }}
                    >
                      <button
                        onClick={() => toggleFeature(feat.id)}
                        disabled={allMode}
                        className="w-full flex items-center gap-2 text-left disabled:cursor-default"
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isFeatSelected ? G.text : "transparent",
                            border: `1.5px solid ${isFeatSelected ? G.text : "rgba(255,255,255,0.20)"}`,
                          }}
                        >
                          {isFeatSelected && <Check className="w-2.5 h-2.5 text-black" />}
                        </div>
                        <span className="text-xs font-medium" style={{ color: isFeatSelected ? "white" : "rgba(255,255,255,0.50)" }}>
                          {feat.icon} {feat.label}
                        </span>
                      </button>

                      {/* Plan selector for selected feature */}
                      {isFeatSelected && !allMode && (
                        <div className="mt-2 ml-6">
                          {featPlans.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {featPlans.map(plan => {
                                const isPlanSelected = selectedPlan?.plan_name === plan.plan_name;
                                return (
                                  <button
                                    key={plan.plan_config_id}
                                    onClick={() => selectPlan(feat.id, plan)}
                                    className="px-2 py-1 rounded text-[10px] font-semibold"
                                    style={{
                                      background: isPlanSelected ? G.bgHi : "rgba(255,255,255,0.04)",
                                      border: `1px solid ${isPlanSelected ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                                      color: isPlanSelected ? G.text : "rgba(255,255,255,0.50)",
                                    }}
                                  >
                                    {plan.plan_name} · {plan.currency} {plan.price}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[10px] text-white/30">
                              No plans configured. Set duration below.
                            </p>
                          )}
                          {/* Fallback duration selector if no plans configured */}
                          {featPlans.length === 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {DURATION_OPTIONS.map((opt) => {
                                const currentDur = selectedPlan?.duration_days === opt.days &&
                                  (opt.value === "LIFETIME") === (selectedPlan?.is_lifetime);
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => onFeatureDurationChange(page.path, feat.id, {
                                      plan_name: opt.label,
                                      duration_days: opt.days,
                                      duration_ms: opt.duration_ms,
                                      is_lifetime: opt.value === "LIFETIME",
                                    })}
                                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                                    style={{
                                      background: currentDur ? G.bgHi : "rgba(255,255,255,0.04)",
                                      border: `1px solid ${currentDur ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                                      color: currentDur ? G.text : "rgba(255,255,255,0.40)",
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedFeatures.length === 0 && (
                <p className="text-[10px] text-white/30 mt-1.5">
                  All features unlocked (default). Click individual features to limit access.
                </p>
              )}
              {selectedFeatures.length > 0 && (
                <p className="text-[10px] mt-1.5" style={{ color: G.text }}>
                  {selectedFeatures.length} of {features.length} features selected
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}