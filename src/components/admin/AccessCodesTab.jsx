import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, KeyRound, Copy, Check, X, Trash2, ToggleLeft, ToggleRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { getContentPages } from "@/lib/pageRegistry";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const DURATION_OPTIONS = [
  { value: "1_DAY",     label: "1 Day",     days: 1 },
  { value: "7_DAYS",    label: "7 Days",    days: 7 },
  { value: "30_DAYS",   label: "30 Days",   days: 30 },
  { value: "1_YEAR",    label: "1 Year",    days: 365 },
  { value: "LIFETIME",  label: "Lifetime",  days: null },
  { value: "CUSTOM",    label: "Custom",    days: null },
];

function fmt(d) {
  if (!d) return "♾ Lifetime";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getStatus(code) {
  if (code.is_disabled) return { label: "Disabled", color: "#6b7280" };
  if (code.expiry_date && new Date(code.expiry_date) < new Date()) return { label: "Expired", color: "#ef4444" };
  if ((code.use_count || 0) >= (code.max_uses || 1)) return { label: "Used", color: "#f59e0b" };
  return { label: "Active", color: "#22c55e" };
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: copied ? "#4ade80" : "rgba(255,255,255,0.40)" }}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

// ── Create Code Form ──────────────────────────────────────────────────────────
function CreateCodeForm({ onCreated, onCancel }) {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [codeStr, setCodeStr] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);
  const [duration, setDuration] = useState("1_MONTH");
  const [customDate, setCustomDate] = useState("");
  const [maxUses, setMaxUses] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const pageList = useMemo(() => getContentPages().map(p => ({ path: p.path, name: p.name })), []);

  const togglePage = (path) =>
    setSelectedPages(p => p.includes(path) ? p.filter(x => x !== path) : [...p, path]);

  const computeExpiry = () => {
    if (duration === "LIFETIME") return null;
    if (duration === "CUSTOM") return customDate ? new Date(customDate).toISOString() : null;
    const opt = DURATION_OPTIONS.find(d => d.value === duration);
    if (!opt || !opt.days) return null;
    return new Date(Date.now() + opt.days * 86400000).toISOString();
  };

  const handleCreate = async () => {
    if (!customerName.trim()) { toast({ title: "Customer name required", variant: "destructive" }); return; }
    if (!codeStr.trim()) { toast({ title: "Code string required", variant: "destructive" }); return; }
    if (selectedPages.length === 0) { toast({ title: "Select at least one page", variant: "destructive" }); return; }
    if (duration === "CUSTOM" && !customDate) { toast({ title: "Custom expiry date required", variant: "destructive" }); return; }

    setSaving(true);
    try {
      const me = await base44.auth.me();
      const normalizedCode = codeStr.trim().toUpperCase();
      const expiry = computeExpiry();
      const names = selectedPages.map(path => pageList.find(p => p.path === path)?.name || path);

      await base44.entities.AccessCode.create({
        code: normalizedCode,
        customer_name: customerName.trim(),
        page_paths: selectedPages,
        page_names: names,
        duration,
        expiry_date: expiry,
        max_uses: maxUses,
        use_count: 0,
        is_disabled: false,
        created_by: me.id,
        notes: notes.trim() || undefined,
      });

      toast({ title: `✓ Code "${normalizedCode}" created for ${customerName.trim()}` });
      onCreated();
    } catch (e) {
      toast({ title: "Error creating code", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border p-5 space-y-4"
      style={{ background: "linear-gradient(145deg, #0c1630, #060c1c)", borderColor: G.borderHi }}>
      <div className="flex items-center justify-between">
        <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
          <KeyRound className="w-4 h-4" style={{ color: G.text }} /> Create Access Code
        </h3>
        <button onClick={onCancel} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-white/45 mb-1 block">Customer Name *</label>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)}
            placeholder="e.g. Abdul Rahman"
            className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-white/45 mb-1 block">Code String * (auto-uppercase)</label>
          <input value={codeStr} onChange={e => setCodeStr(e.target.value.toUpperCase())}
            placeholder="e.g. ABDUL2026"
            className="w-full px-3 py-2 rounded-lg text-sm text-white font-bold tracking-widest outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
        </div>
      </div>

      {/* Pages */}
      <div>
        <label className="text-xs text-white/45 mb-2 block">
          Pages Unlocked * ({selectedPages.length} selected)
        </label>
        <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
          {pageList.map(page => {
            const sel = selectedPages.includes(page.path);
            return (
              <button key={page.path} onClick={() => togglePage(page.path)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm"
                style={{
                  background: sel ? G.bgHi : "rgba(255,255,255,0.025)",
                  border: `1px solid ${sel ? G.borderHi : "rgba(255,255,255,0.06)"}`,
                  color: sel ? "white" : "rgba(255,255,255,0.50)",
                }}>
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: sel ? G.text : "transparent", border: `1px solid ${sel ? G.text : "rgba(255,255,255,0.25)"}` }}>
                  {sel && <Check className="w-2.5 h-2.5 text-black" />}
                </div>
                {page.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="text-xs text-white/45 mb-2 block">Duration *</label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setDuration(opt.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: duration === opt.value ? G.bgHi : "rgba(255,255,255,0.04)",
                border: `1px solid ${duration === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                color: duration === opt.value ? G.text : "rgba(255,255,255,0.50)",
              }}>
              {opt.label}
            </button>
          ))}
        </div>
        {duration === "CUSTOM" && (
          <input type="datetime-local" value={customDate} onChange={e => setCustomDate(e.target.value)}
            className="mt-2 w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
        )}
      </div>

      {/* Max Uses */}
      <div>
        <label className="text-xs text-white/45 mb-1 block">Max Uses (default 1 = single-use)</label>
        <div className="flex items-center gap-3">
          <input type="number" min={1} max={999} value={maxUses} onChange={e => setMaxUses(parseInt(e.target.value) || 1)}
            className="w-24 px-3 py-2 rounded-lg text-sm text-white outline-none text-center"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
          <span className="text-xs text-white/35">{maxUses === 1 ? "Single-use (recommended)" : `Up to ${maxUses} accounts can redeem`}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs text-white/45 mb-1 block">Notes (optional)</label>
        <input value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="e.g. Paid 6 months via WhatsApp"
          className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}` }} />
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-inter font-semibold text-sm"
          style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>
          Cancel
        </button>
        <button onClick={handleCreate} disabled={saving}
          className="flex-1 py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}>
          {saving ? "Creating…" : "Create Code"}
        </button>
      </div>
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function AccessCodesTab() {
  const { toast } = useToast();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.AccessCode.list("-created_date", 500);
      setCodes(data);
    } catch (e) {
      toast({ title: "Failed to load codes", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggleDisable = async (code) => {
    try {
      await base44.entities.AccessCode.update(code.id, { is_disabled: !code.is_disabled });
      toast({ title: code.is_disabled ? "✓ Code enabled" : "✓ Code disabled" });
      load();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (code) => {
    if (!confirm(`Delete code "${code.code}"? This cannot be undone.`)) return;
    try {
      await base44.entities.AccessCode.delete(code.id);
      toast({ title: `✓ Code "${code.code}" deleted` });
      load();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const filtered = useMemo(() => {
    let list = codes;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(c =>
        c.code.toLowerCase().includes(q) ||
        (c.customer_name || "").toLowerCase().includes(q) ||
        (c.notes || "").toLowerCase().includes(q)
      );
    }
    if (filter !== "all") {
      list = list.filter(c => getStatus(c).label.toLowerCase() === filter);
    }
    return list;
  }, [codes, search, filter]);

  const counts = useMemo(() => ({
    active: codes.filter(c => getStatus(c).label === "Active").length,
    used: codes.filter(c => getStatus(c).label === "Used").length,
    expired: codes.filter(c => getStatus(c).label === "Expired").length,
    disabled: codes.filter(c => getStatus(c).label === "Disabled").length,
  }), [codes]);

  return (
    <div className="space-y-4">
      {/* Create button */}
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-4 gap-2 flex-1">
          {[
            { key: "active",   label: "Active",   color: "#22c55e" },
            { key: "used",     label: "Used",     color: "#f59e0b" },
            { key: "expired",  label: "Expired",  color: "#ef4444" },
            { key: "disabled", label: "Disabled", color: "#6b7280" },
          ].map(({ key, label, color }) => (
            <div key={key} className="rounded-xl border p-2.5 text-center cursor-pointer"
              style={{ background: G.bg, borderColor: filter === key ? color + "80" : G.border }}
              onClick={() => setFilter(f => f === key ? "all" : key)}>
              <p className="text-lg font-bold" style={{ color }}>{counts[key]}</p>
              <p className="text-[10px] text-white/35">{label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowCreate(v => !v)}
          className="ml-3 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 flex-shrink-0"
          style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
          <Plus className="w-3.5 h-3.5" /> New Code
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <CreateCodeForm
              onCreated={() => { setShowCreate(false); load(); }}
              onCancel={() => setShowCreate(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by code, customer name…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }} />
      </div>

      {/* Code list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.25)" }}>
          <KeyRound className="w-12 h-12 mx-auto mb-3 opacity-25" />
          <p className="text-sm">No access codes found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(code => {
            const status = getStatus(code);
            return (
              <div key={code.id} className="rounded-xl border p-4 space-y-3"
                style={{ background: G.bg, borderColor: code.is_disabled ? "rgba(107,114,128,0.30)" : G.border }}>
                {/* Row 1: code + status + actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <KeyRound className="w-4 h-4 flex-shrink-0" style={{ color: G.text }} />
                    <span className="font-inter font-bold text-white tracking-widest text-sm">{code.code}</span>
                    <CopyButton text={code.code} />
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0"
                    style={{ background: status.color + "18", color: status.color, border: `1px solid ${status.color}40` }}>
                    {status.label}
                  </span>
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleToggleDisable(code)}
                      title={code.is_disabled ? "Enable code" : "Disable code"}
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ background: code.is_disabled ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.12)", color: code.is_disabled ? "#4ade80" : "#9ca3af", border: `1px solid ${code.is_disabled ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.25)"}` }}>
                      {code.is_disabled ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(code)}
                      title="Delete code"
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ background: "rgba(239,68,68,0.10)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Row 2: customer + usage + expiry */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/45">
                  <span>👤 {code.customer_name || "—"}</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Used {code.use_count || 0}/{code.max_uses || 1}
                    {(code.max_uses || 1) === 1 && " (single-use)"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expires: {fmt(code.expiry_date)}
                  </span>
                  {code.used_by_email && (
                    <span className="text-white/30">Redeemed by: {code.used_by_email}</span>
                  )}
                </div>

                {/* Row 3: pages */}
                <div className="flex flex-wrap gap-1.5">
                  {(code.page_names || code.page_paths || []).map((name, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>
                      {name}
                    </span>
                  ))}
                </div>

                {/* Notes */}
                {code.notes && (
                  <p className="text-xs text-white/30 italic">{code.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}