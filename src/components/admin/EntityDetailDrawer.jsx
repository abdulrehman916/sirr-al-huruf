/**
 * EntityDetailDrawer — Slide-in panel showing full record details.
 * Renders all fields from the schema in a readable format.
 */
import { X } from "lucide-react";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.05)",
};

function formatValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  if (typeof value === 'string' && value.length > 200) return value;
  return String(value);
}

function isJsonField(value) {
  return typeof value === 'object' && value !== null;
}

export default function EntityDetailDrawer({ entityDisplayName, schema, record, onClose }) {
  if (!record) return null;

  // Get all fields from schema + any extra fields on the record
  const schemaProps = schema?.properties || {};
  const allKeys = [
    ...Object.keys(schemaProps),
    ...Object.keys(record).filter(k => !schemaProps[k] && !['_rand'].includes(k)),
  ].filter(k => !['_rand'].includes(k));

  // Built-in fields shown separately at bottom
  const builtInKeys = ['id', 'created_date', 'updated_date', 'created_by_id'];
  const mainKeys = allKeys.filter(k => !builtInKeys.includes(k));

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="w-full max-w-md h-full overflow-y-auto rounded-l-2xl"
        style={{ background: 'linear-gradient(145deg, rgba(8,16,38,0.98), rgba(4,10,24,0.99))', border: `1px solid ${G.border}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 z-10" style={{ borderColor: G.border, background: 'rgba(8,16,38,0.98)' }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: G.text }}>{entityDisplayName}</h3>
            <p className="text-xs" style={{ color: G.dim }}>Record Details</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" style={{ color: G.dim }} />
          </button>
        </div>

        {/* Fields */}
        <div className="p-4 space-y-3">
          {mainKeys.map(key => {
            const value = record[key];
            const prop = schemaProps[key];
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const isJson = isJsonField(value);

            return (
              <div key={key} className="p-3 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <div className="text-xs font-medium mb-1" style={{ color: G.text }}>{label}</div>
                {isJson ? (
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap" style={{ color: '#ccc', fontFamily: 'monospace', maxHeight: '200px', overflowY: 'auto' }}>
                    {formatValue(value)}
                  </pre>
                ) : (
                  <div className="text-sm break-words" style={{ color: '#ccc' }}>
                    {formatValue(value)}
                  </div>
                )}
                {prop?.description && (
                  <div className="text-xs mt-1 italic" style={{ color: G.dim }}>{prop.description}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Built-in metadata */}
        <div className="p-4 border-t" style={{ borderColor: G.border }}>
          <div className="text-xs font-medium mb-2" style={{ color: G.dim }}>System Metadata</div>
          <div className="space-y-1 text-xs" style={{ color: G.dim }}>
            {builtInKeys.map(key => (
              <div key={key} className="flex justify-between">
                <span>{key.replace(/_/g, ' ')}:</span>
                <span style={{ color: '#999' }}>{formatValue(record[key])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}