/**
 * EntityDataTable — Universal data table with search, sort, and pagination.
 * Schema-driven: auto-generates columns from the entity JSON schema.
 */
import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Loader2 } from "lucide-react";

const G = {
  border: "rgba(212,175,55,0.30)",
  borderHi: "rgba(212,175,55,0.55)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.50)",
  bg: "rgba(212,175,55,0.05)",
};

// Get visible columns (first 6 non-system fields)
function getColumns(schema) {
  if (!schema?.properties) return [];
  const props = schema.properties;
  const allKeys = Object.keys(props).filter(k =>
    !['id', 'created_date', 'updated_date', 'created_by_id'].includes(k)
  );
  return allKeys.slice(0, 6).map(key => ({
    key,
    label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    type: props[key]?.type || 'string',
  }));
}

function formatCell(value, type) {
  if (value === null || value === undefined) return <span style={{ color: '#666' }}>—</span>;
  if (type === 'boolean') return value ? '✓ Yes' : '✗ No';
  if (type === 'array') return `[${Array.isArray(value) ? value.length : 0} items]`;
  if (type === 'object') return `{object}`;
  if (typeof value === 'string' && value.length > 60) return value.substring(0, 60) + '…';
  if (typeof value === 'object') return JSON.stringify(value).substring(0, 60) + '…';
  return String(value);
}

export default function EntityDataTable({
  schema, records, loading, supportsCrud, supportsSearch,
  search, onSearch, sortField, onSort, page, pageSize, onPage, hasMore,
  onView, onEdit, onDelete,
}) {
  const columns = useMemo(() => getColumns(schema), [schema]);

  // Client-side search within current page
  const filteredRecords = useMemo(() => {
    if (!search || !supportsSearch) return records;
    const q = search.toLowerCase();
    return records.filter(r =>
      JSON.stringify(r).toLowerCase().includes(q)
    );
  }, [records, search, supportsSearch]);

  const handleSort = (colKey) => {
    const currentDir = sortField === colKey ? 'asc' : sortField === `-${colKey}` ? 'desc' : null;
    if (currentDir === 'asc') onSort(`-${colKey}`);
    else if (currentDir === 'desc') onSort('-created_date');
    else onSort(colKey);
  };

  const getSortIcon = (colKey) => {
    if (sortField === colKey) return <ArrowUp className="w-3 h-3" />;
    if (sortField === `-${colKey}`) return <ArrowDown className="w-3 h-3" />;
    return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: G.dim }} />
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm" style={{ color: G.dim }}>Unable to load schema for this entity</p>
          <p className="text-xs mt-1" style={{ color: G.dim }}>The entity may not be accessible via the SDK</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-hidden">
      {/* Search bar */}
      {supportsSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: G.dim }} />
          <input
            type="text"
            placeholder="Search within current page..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: G.bg, border: `1px solid ${G.border}`, color: '#e0e0e0' }}
          />
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg" style={{ border: `1px solid ${G.border}` }}>
        <table className="w-full text-sm">
          <thead style={{ background: G.bg, position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left px-3 py-2.5 cursor-pointer select-none whitespace-nowrap font-medium"
                  style={{ color: G.text, borderBottom: `1px solid ${G.border}` }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {getSortIcon(col.key)}
                  </div>
                </th>
              ))}
              <th className="px-3 py-2.5 text-right font-medium" style={{ color: G.text, borderBottom: `1px solid ${G.border}` }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-12" style={{ color: G.dim }}>
                  No records found
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, idx) => (
                <tr
                  key={record.id || idx}
                  className="hover:bg-white/5 transition-colors"
                  style={{ borderBottom: idx < filteredRecords.length - 1 ? `1px solid ${G.border}` : 'none' }}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-3 py-2 max-w-xs truncate" style={{ color: '#ccc' }}>
                      {formatCell(record[col.key], col.type)}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onView(record)} className="p-1.5 rounded hover:bg-white/10" title="View">
                        <Eye className="w-3.5 h-3.5" style={{ color: G.dim }} />
                      </button>
                      {supportsCrud && (
                        <>
                          <button onClick={() => onEdit(record)} className="p-1.5 rounded hover:bg-white/10" title="Edit">
                            <Pencil className="w-3.5 h-3.5" style={{ color: G.dim }} />
                          </button>
                          <button onClick={() => onDelete(record)} className="p-1.5 rounded hover:bg-red-500/20" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs" style={{ color: G.dim }}>
        <span>
          Page {page + 1} · {filteredRecords.length} records {search ? '(filtered)' : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg disabled:opacity-30"
            style={{ border: `1px solid ${G.border}` }}
          >
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          <button
            onClick={() => onPage(page + 1)}
            disabled={!hasMore && !search}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg disabled:opacity-30"
            style={{ border: `1px solid ${G.border}` }}
          >
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}