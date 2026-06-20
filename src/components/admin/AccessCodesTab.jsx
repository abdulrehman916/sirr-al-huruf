import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, KeyRound, Copy, Check, X, Trash2, ToggleLeft, ToggleRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { getContentPages } from "@/lib/pageRegistry";
import CreateCodePageItem from "./CreateCodePageItem";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const DURATION_OPTIONS = [
    { value: "1_DAY",      label: "1 Day",      days: 1 },
    { value: "7_DAYS",     label: "7 Days",     days: 7 },
    { value: "30_DAYS",    label: "30 Days",    days: 30 },
    { value: "3_MONTHS",   label: "90 Days",   days: 90 },
    { value: "6_MONTHS",   label: "180 Days",   days: 180 },
    { value: "1_YEAR",     label: "1 Year",     days: 365 },
    { value: "LIFETIME",   label: "Lifetime",   days: null },
    { value: "CUSTOM",     label: "Custom Date",     days: null },
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
  const [pageDurations, setPageDurations] = useState({});
  const [maxUses, setMaxUses] = useState(1);
  const [notes, setNotes] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageSearch, setPageSearch] = useState("");

    const pageList = useMemo(() => getContentPages().map(p => ({ 
    path: p.path, 
    name: p.name,
    icon: p.icon || '📖',
    category: p.category || 'General',
    adminOnly: p.adminOnly || false
  })), []);
  
  const filteredPages = useMemo(() => {
    if (!pageSearch) return pageList;
    return pageList.filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()));
  }, [pageList, pageSearch]);

  const togglePage = (path) => {
    setSelectedPages(p => {
      if (p.includes(path)) {
        const newPages = p.filter(x => x !== path);
        const newDurations = { ...pageDurations };
        delete newDurations[path];
        setPageDurations(newDurations);
        return newPages;
      }
      return [...p, path];
    });
  };

  const updatePageDuration = (path, durationValue) => {
    const opt = DURATION_OPTIONS.find(d => d.value === durationValue);
    setPageDurations(prev => ({
      ...prev,
      [path]: {
        value: durationValue,
        label: opt?.label || durationValue,
        days: opt?.days || null,
        custom_date: null
      }
    }));
  };

  const updateCustomDate = (path, customDate) => {
    setPageDurations(prev => ({
      ...prev,
      [path]: {
        ...prev[path],
        custom_date: customDate
      }
    }));
  };

  const computePageExpiry = (path) => {
    const dur = pageDurations[path];
    if (!dur) return null;
    if (dur.value === "LIFETIME") return null;
    if (dur.value === "CUSTOM" && dur.custom_date) return new Date(dur.custom_date).toISOString();
    if (dur.days) return new Date(Date.now() + dur.days * 86400000).toISOString();
    return null;
  };

  const handleCreate = async () => {
    if (!customerName.trim()) { toast({ title: "Customer name required", variant: "destructive" }); return; }
    if (!codeStr.trim()) { toast({ title: "Code string required", variant: "destructive" }); return; }
    if (selectedPages.length === 0) { toast({ title: "Select at least one page", variant: "destructive" }); return; }
    
    for (const path of selectedPages) {
      const dur = pageDurations[path];
      if (!dur) { toast({ title: `Set duration for ${pageList.find(p => p.path === path)?.name}`, variant: "destructive" }); return; }
      if (dur.value === "CUSTOM" && !dur.custom_date) { toast({ title: `Set custom date for ${pageList.find(p => p.path === path)?.name}`, variant: "destructive" }); return; }
    }

    setShowSummary(true);
  };

  const confirmCreate = async () => {
    setSaving(true);
    try {
      const me = await base44.auth.me();
      const normalizedCode = codeStr.trim().toUpperCase();
      const names = selectedPages.map(path => pageList.find(p => p.path === path)?.name || path);
      const page_durations = {};
      selectedPages.forEach(path => {
        const dur = pageDurations[path];
        if (dur) {
          page_durations[path] = dur;
        }
      });

      await base44.entities.AccessCode.create({
        code: normalizedCode,
        customer_name: customerName.trim(),
        page_paths: selectedPages,
        page_names: names,
        page_durations,
        duration: "CUSTOM",
        expiry_date: null,
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

  if (showSummary) {
    return (
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "linear-gradient(145deg, #0c1630, #060c1c)", borderColor: G.borderHi }}>
        <h3 className="font-inter font-bold text-white text-base flex items-center gap-2">
          <CheckCircle className="w-5 h-5" style={{ color: G.text }} /> Confirm Code Details
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-white/45 text-xs">Customer</p>
            <p className="text-white font-semibold">{customerName.trim()}</p>
          </div>
          <div>
            <p className="text-white/45 text-xs">Code</p>
            <p className="text-white font-bold tracking-widest">{codeStr.trim().toUpperCase()}</p>
          </div>
          <div>
            <p className="text-white/45 text-xs mb-2">Unlocked Pages ({selectedPages.length})</p>
            <div className="space-y-2">
              {selectedPages.map(path => {
                const page = pageList.find(p => p.path === path);
                const dur = pageDurations[path];
                return (
                  <div key={path} className="flex items-center justify-between py-2 px-3 rounded-lg"
                    style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                    <span className="text-white font-medium">{page?.name || path}</span>
                    <Badge className="bg-gold/20 text-gold border-gold/50 border text-xs">
                      {dur?.label || "Lifetime"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
          {notes.trim() && (
            <div>
              <p className="text-white/45 text-xs">Notes</p>
              <p className="text-white/70 italic">{notes.trim()}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 pt-3">
          <button onClick={() => setShowSummary(false)} className="flex-1 py-3 rounded-xl font-inter font-semibold text-sm"
            style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>
            Edit
          </button>
          <button onClick={confirmCreate} disabled={saving}
            className="flex-1 py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}>
            {saving ? "Creating…" : "Confirm & Create"}
          </button>
        </div>
      </div>
    );
  }

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

      {/* Pages with Per-Page Duration */}
      <div>
        <label className="text-xs text-white/45 mb-2 block">
          Pages Unlocked * ({selectedPages.length} selected)
        </label>
                <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                    value={pageSearch}
                    onChange={e => setPageSearch(e.target.value)}
                    placeholder={`Search ${pageList.length} pages...`}
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                />
            </div>
          <button 
            onClick={() => setSelectedPages(filteredPages.map(p => p.path))}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
          >
            Select All
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredPages.map(page => {
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
                />
            );
          })}
        </div>
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
          {saving ? "Creating…" : "Review & Create"}
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
  const [showRedeemed, setShowRedeemed] = useState(false);

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

  const redeemedCodes = useMemo(() => codes.filter(c => (c.use_count || 0) > 0), [codes]);

  return (
    <div className="space-y-4">
      {/* Stats + Actions */}
      <div className="flex items-center gap-3 flex-wrap">
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
        <button onClick={() => setShowRedeemed(!showRedeemed)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          style={{ background: redeemedCodes.length > 0 ? G.bgHi : G.bg, border: `1px solid ${G.border}`, color: G.text }}>
          <CheckCircle className="w-3.5 h-3.5" /> Redeemed ({redeemedCodes.length})
        </button>
        <button onClick={() => setShowCreate(v => !v)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
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

      {/* Redeemed Codes Section */}
      {showRedeemed && redeemedCodes.length > 0 && (
        <div className="rounded-2xl border p-4 space-y-3" style={{ background: G.bg, borderColor: G.border }}>
          <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" style={{ color: G.text }} />
            Redeemed Codes ({redeemedCodes.length})
          </h3>
          <div className="space-y-2">
            {redeemedCodes.map(code => (
              <div key={code.id} className="rounded-xl border p-3" style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.20)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-inter font-bold text-white tracking-widest text-sm">{code.code}</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 border text-xs">Used</Badge>
                  </div>
                  <span className="text-xs text-white/40">👤 {code.customer_name || "—"}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                  <span>Redeemed by: {code.used_by_email || "N/A"}</span>
                  <span>Redeemed at: {code.used_at ? new Date(code.used_at).toLocaleString() : "N/A"}</span>
                  <span>Expires: {fmt(code.expiry_date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Codes List */}
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
                    Created: {new Date(code.created_date).toLocaleDateString()}
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