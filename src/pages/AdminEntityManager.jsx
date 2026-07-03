/**
 * AdminEntityManager — Universal Entity CRUD Manager
 *
 * Auto-discovers all registered entities from EntityRegistry database.
 * Provides universal Create, Read, Update, Delete with:
 *   - Search, sort, pagination
 *   - Schema-driven auto-generated forms
 *   - JSON export/import
 *   - Audit logging for all operations
 *   - RBAC (admin-only)
 *   - Read-only mode for entities with specialized admin pages
 *
 * This page derives entirely from EntityRegistry — zero manual configuration.
 */
import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Database, Search, Plus, Download, Upload, Loader2, RefreshCw, ArrowLeft, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import EntityDataTable from "@/components/admin/EntityDataTable";
import EntityFormModal from "@/components/admin/EntityFormModal";
import EntityDetailDrawer from "@/components/admin/EntityDetailDrawer";
import { useToast } from "@/components/ui/use-toast";
import { logEntityAction } from "@/lib/entityAudit";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

const PAGE_SIZE = 20;

export default function AdminEntityManager() {
  const [user, setUser] = useState(null);
  const [entities, setEntities] = useState([]);
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [schema, setSchema] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("-created_date");
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null);
  const [entitySearch, setEntitySearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const { toast } = useToast();

  // Admin check
  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => setUser({}));
  }, []);

  // Load entity registry
  const loadEntities = useCallback(async () => {
    setLoadingEntities(true);
    try {
      const recs = await base44.entities.EntityRegistry.list('sort_order', 200);
      setEntities((recs || []).filter(r => r.is_active !== false && r.admin_visible !== false && r.archived !== true));
    } catch (_e) {
      setEntities([]);
    } finally {
      setLoadingEntities(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') loadEntities();
  }, [user, loadEntities]);

  // Load schema + records when entity selected
  useEffect(() => {
    if (!selectedEntity) return;
    setSchema(null);
    setRecords([]);
    setPage(0);
    setSearch("");
    setSortField("-created_date");
    loadSchemaAndRecords();
  }, [selectedEntity]); // eslint-disable-line

  const loadSchemaAndRecords = async () => {
    if (!selectedEntity) return;
    try {
      const s = await base44.entities[selectedEntity.entity_name]?.schema();
      setSchema(s);
    } catch (_e) {
      setSchema(null);
    }
    await loadRecords();
  };

  const loadRecords = async () => {
    if (!selectedEntity) return;
    setLoadingRecords(true);
    try {
      const recs = await base44.entities[selectedEntity.entity_name]?.list(sortField, PAGE_SIZE, page * PAGE_SIZE);
      setRecords(recs || []);
    } catch (_e) {
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  // CRUD handlers
  const handleSave = async (data) => {
    const name = selectedEntity.entity_name;
    try {
      if (editRecord) {
        await base44.entities[name].update(editRecord.id, data);
        await logEntityAction(name, 'ENTITY_UPDATE', editRecord.id, { old: editRecord, new: data });
        toast({ title: "Updated", description: "Record updated successfully" });
      } else {
        const created = await base44.entities[name].create(data);
        await logEntityAction(name, 'ENTITY_CREATE', created?.id || '', { new: data });
        toast({ title: "Created", description: "Record created successfully" });
      }
      setShowForm(false);
      setEditRecord(null);
      loadRecords();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (record) => {
    const name = selectedEntity.entity_name;
    if (!window.confirm(`Delete this ${selectedEntity.display_name} record? This cannot be undone.`)) return;
    try {
      await base44.entities[name].delete(record.id);
      await logEntityAction(name, 'ENTITY_DELETE', record.id, { deleted: record });
      toast({ title: "Deleted", description: "Record deleted" });
      loadRecords();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleExport = async () => {
    const name = selectedEntity.entity_name;
    try {
      const all = await base44.entities[name].list('-created_date', 500);
      const json = JSON.stringify(all, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      await logEntityAction(name, 'ENTITY_EXPORT', null, { count: all?.length || 0 });
      toast({ title: "Exported", description: `${all?.length || 0} records exported` });
    } catch (e) {
      toast({ title: "Export Error", description: e.message, variant: "destructive" });
    }
  };

  const handleImport = async (file) => {
    const name = selectedEntity.entity_name;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Invalid format: expected JSON array');
      await base44.entities[name].bulkCreate(data);
      await logEntityAction(name, 'ENTITY_IMPORT', null, { count: data.length });
      toast({ title: "Imported", description: `${data.length} records imported` });
      loadRecords();
    } catch (e) {
      toast({ title: "Import Error", description: e.message, variant: "destructive" });
    }
  };

  // Filter entities by search + category
  const filteredEntities = entities.filter(e => {
    const matchesSearch = !entitySearch ||
      e.entity_name?.toLowerCase().includes(entitySearch.toLowerCase()) ||
      e.display_name?.toLowerCase().includes(entitySearch.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...new Set(entities.map(e => e.category).filter(Boolean))];

  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#020710' }}>
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <AdminLayout title="Entity Manager">
      <div className="flex gap-4 p-4 min-h-[calc(100vh-60px)]" style={{ background: '#020710' }}>
        {/* ── Entity List Sidebar ── */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: G.border }}>
            <Database className="w-5 h-5" style={{ color: G.text }} />
            <h2 className="text-lg font-bold" style={{ color: G.text }}>Entities</h2>
            <span className="ml-auto text-xs" style={{ color: G.dim }}>{entities.length}</span>
          </div>

          {/* Entity search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4" style={{ color: G.dim }} />
            <input
              type="text"
              placeholder="Search entities..."
              value={entitySearch}
              onChange={e => setEntitySearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid ${G.border}`, color: '#e0e0e0' }}
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-2 py-1 rounded text-xs font-medium transition-all"
                style={activeCategory === cat
                  ? { background: G.bgHi, color: G.text, border: `1px solid ${G.borderHi}` }
                  : { background: 'transparent', color: G.dim, border: `1px solid transparent` }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Entity list */}
          <div className="flex-1 overflow-y-auto scrollbar-none space-y-1.5">
            {loadingEntities && <div className="text-center py-4"><Loader2 className="w-5 h-5 animate-spin mx-auto" style={{ color: G.dim }} /></div>}
            {!loadingEntities && filteredEntities.length === 0 && (
              <div className="text-center py-8 text-sm" style={{ color: G.dim }}>No entities found</div>
            )}
            {filteredEntities.map(ent => (
              <button
                key={ent.id}
                onClick={() => setSelectedEntity(ent)}
                className="w-full text-left p-2.5 rounded-lg transition-all"
                style={selectedEntity?.id === ent.id
                  ? { background: G.bgHi, border: `1px solid ${G.borderHi}` }
                  : { background: 'rgba(212,175,55,0.03)', border: `1px solid ${G.border}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ent.icon || '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: G.text }}>{ent.display_name}</div>
                    <div className="text-xs truncate" style={{ color: G.dim }}>{ent.entity_name}</div>
                  </div>
                  {!ent.supports_crud && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(100,100,100,0.2)', color: '#999' }}>RO</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Data View ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {!selectedEntity ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: G.dim }} />
                <p className="text-lg" style={{ color: G.dim }}>Select an entity to manage</p>
                <p className="text-sm mt-1" style={{ color: G.dim }}>{entities.length} entities registered</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header + Toolbar */}
              <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: G.border }}>
                <button onClick={() => setSelectedEntity(null)} className="p-1.5 rounded-lg hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" style={{ color: G.dim }} />
                </button>
                <span className="text-2xl">{selectedEntity.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold truncate" style={{ color: G.text }}>{selectedEntity.display_name}</h2>
                  <p className="text-xs truncate" style={{ color: G.dim }}>{selectedEntity.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedEntity.supports_export && (
                    <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}>
                      <Download className="w-3.5 h-3.5" /> Export
                    </button>
                  )}
                  {selectedEntity.supports_import && (
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all" style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}>
                      <Upload className="w-3.5 h-3.5" /> Import
                      <input type="file" accept=".json" className="hidden" onChange={e => e.target.files[0] && handleImport(e.target.files[0])} />
                    </label>
                  )}
                  <button onClick={loadRecords} className="p-1.5 rounded-lg hover:bg-white/5">
                    <RefreshCw className="w-4 h-4" style={{ color: G.dim }} />
                  </button>
                  {selectedEntity.supports_crud && (
                    <button onClick={() => { setEditRecord(null); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all" style={{ background: 'linear-gradient(135deg, #f6d860, #c98a14)', color: '#0d1b2a' }}>
                      <Plus className="w-3.5 h-3.5" /> New Record
                    </button>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <EntityDataTable
                schema={schema}
                records={records}
                loading={loadingRecords}
                supportsCrud={selectedEntity.supports_crud}
                supportsSearch={selectedEntity.supports_search}
                search={search}
                onSearch={setSearch}
                sortField={sortField}
                onSort={setSortField}
                page={page}
                pageSize={PAGE_SIZE}
                onPage={setPage}
                hasMore={records.length === PAGE_SIZE}
                onView={(r) => setDetailRecord(r)}
                onEdit={(r) => { setEditRecord(r); setShowForm(true); }}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && schema && (
        <EntityFormModal
          entityName={selectedEntity.entity_name}
          entityDisplayName={selectedEntity.display_name}
          schema={schema}
          record={editRecord}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditRecord(null); }}
        />
      )}

      {/* Detail Drawer */}
      {detailRecord && (
        <EntityDetailDrawer
          entityName={selectedEntity.entity_name}
          entityDisplayName={selectedEntity.display_name}
          schema={schema}
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
        />
      )}
    </AdminLayout>
  );
}