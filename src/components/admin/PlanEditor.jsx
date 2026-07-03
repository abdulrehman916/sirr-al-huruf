/**
 * PlanEditor — Inline editor for a single subscription plan.
 * Creates/updates/deletes a SubscriptionPlanConfig record.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Edit3, Trash2, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function PlanEditor({ pagePath, featureId, plan, sortOrder, onSaved }) {
  const isExisting = !!plan;
  const [editing, setEditing] = useState(!isExisting);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [planName, setPlanName] = useState(plan?.plan_name || "");
  const [durationType, setDurationType] = useState(plan?.duration_type || "DAYS");
  const [durationDays, setDurationDays] = useState(plan?.duration_days || 30);
  const [price, setPrice] = useState(plan?.price || "");
  const [currency, setCurrency] = useState(plan?.currency || "AED");

  const planConfigId = plan?.plan_config_id || `PLAN-${featureId}-${Date.now()}`;

  const handleSave = async () => {
    if (!planName.trim() || !price) return;
    setSaving(true);
    try {
      const me = await base44.auth.me();
      const data = {
        plan_config_id: planConfigId,
        page_path: pagePath,
        feature_id: featureId,
        plan_name: planName.trim(),
        duration_type: durationType,
        duration_days: durationType === "LIFETIME" ? null : parseInt(durationDays) || 0,
        price: parseFloat(price) || 0,
        currency: currency.trim() || "AED",
        is_active: true,
        sort_order: plan?.sort_order ?? sortOrder,
        updated_by: me?.id || "",
        updated_at: new Date().toISOString(),
      };
      if (plan?.id) {
        await base44.entities.SubscriptionPlanConfig.update(plan.id, data);
      } else {
        await base44.entities.SubscriptionPlanConfig.create(data);
      }
      setEditing(false);
      if (onSaved) onSaved();
    } catch (e) {
      console.error("Failed to save plan:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!plan?.id) { setEditing(false); return; }
    if (!confirm(`Delete plan "${plan.plan_name}"?`)) return;
    setDeleting(true);
    try {
      await base44.entities.SubscriptionPlanConfig.delete(plan.id);
      if (onSaved) onSaved();
    } catch (e) {
      console.error("Failed to delete plan:", e);
    } finally {
      setDeleting(false);
    }
  };

  // Display mode (existing plan, not editing)
  if (isExisting && !editing) {
    return (
      <div className="rounded-lg border p-2.5 flex items-center gap-3" style={{
        background: G.bg, borderColor: G.border,
      }}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{plan.plan_name}</p>
          <p className="text-[10px] text-white/40">
            {plan.duration_type === "LIFETIME" ? "Lifetime" : `${plan.duration_days} days`}
            {" · "}{plan.currency} {plan.price}
          </p>
        </div>
        <button onClick={() => setEditing(true)}
          className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.50)" }}>
          <Edit3 className="w-3 h-3" />
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
          {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
        </button>
      </div>
    );
  }

  // Edit / Create mode
  return (
    <div className="rounded-lg border p-3 space-y-2.5" style={{
      background: G.bgHi, borderColor: G.borderHi,
    }}>
      <div className="flex items-center gap-2 mb-1">
        {isExisting ? (
          <Edit3 className="w-3 h-3" style={{ color: G.text }} />
        ) : (
          <Plus className="w-3 h-3" style={{ color: G.text }} />
        )}
        <span className="text-xs font-semibold" style={{ color: G.text }}>
          {isExisting ? "Edit Plan" : "New Plan"}
        </span>
      </div>

      <div>
        <label className="text-[10px] text-white/40 block mb-1">Plan Name</label>
        <input value={planName} onChange={e => setPlanName(e.target.value)}
          placeholder="e.g. 1 Month"
          className="w-full px-2 py-1.5 rounded text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-white/40 block mb-1">Duration Type</label>
          <div className="flex gap-1">
            {["DAYS", "LIFETIME"].map(t => (
              <button key={t} onClick={() => setDurationType(t)}
                className="flex-1 py-1.5 rounded text-[10px] font-semibold"
                style={{
                  background: durationType === t ? G.bgHi : "rgba(255,255,255,0.04)",
                  border: `1px solid ${durationType === t ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                  color: durationType === t ? G.text : "rgba(255,255,255,0.50)",
                }}>
                {t === "DAYS" ? "Days" : "Lifetime"}
              </button>
            ))}
          </div>
        </div>
        {durationType === "DAYS" && (
          <div>
            <label className="text-[10px] text-white/40 block mb-1">Days</label>
            <input type="number" min={1} value={durationDays} onChange={e => setDurationDays(e.target.value)}
              className="w-full px-2 py-1.5 rounded text-sm text-white outline-none text-center"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <label className="text-[10px] text-white/40 block mb-1">Price</label>
          <input type="number" min={0} step="0.01" value={price} onChange={e => setPrice(e.target.value)}
            placeholder="25"
            className="w-full px-2 py-1.5 rounded text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
        </div>
        <div>
          <label className="text-[10px] text-white/40 block mb-1">Currency</label>
          <input value={currency} onChange={e => setCurrency(e.target.value)}
            className="w-full px-2 py-1.5 rounded text-sm text-white outline-none text-center"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => { setEditing(false); if (!isExisting && onSaved) onSaved(); }}
          className="flex-1 py-2 rounded-lg text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${G.border}`, color: "rgba(255,255,255,0.50)" }}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving || !planName.trim() || !price}
          className="flex-1 py-2 rounded-lg text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
          style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}>
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}