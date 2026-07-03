/**
 * EntityFormModal — Schema-driven auto-generated create/edit form.
 * Generates appropriate input components based on JSON schema property types.
 */
import { useState, useEffect, useMemo } from "react";
import { X, Save, Loader2 } from "lucide-react";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
};

// Determine if a field should use a textarea
function isLongText(key, prop) {
  if (prop?.format === 'date') return false;
  if (prop?.enum) return false;
  const longHints = ['message', 'description', 'explanation', 'details', 'notes', 'content', 'text', 'body', 'reason', 'summary'];
  return longHints.some(h => key.toLowerCase().includes(h));
}

// Get form fields from schema (exclude built-in fields)
function getFormFields(schema) {
  if (!schema?.properties) return [];
  const props = schema.properties;
  const required = schema.required || [];
  return Object.keys(props)
    .filter(k => !['id', 'created_date', 'updated_date', 'created_by_id', 'log_id', 'timestamp', 'performed_by', 'performed_by_email'].includes(k))
    .map(key => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      type: props[key]?.type || 'string',
      format: props[key]?.format,
      enum: props[key]?.enum,
      required: required.includes(key),
      description: props[key]?.description || '',
      default: props[key]?.default,
    }));
}

function FormField({ field, value, onChange }) {
  const baseInputStyle = {
    background: 'rgba(0,0,0,0.3)',
    border: `1px solid ${G.border}`,
    color: '#e0e0e0',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  };

  // Select for enum fields
  if (field.enum) {
    return (
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        style={baseInputStyle}
      >
        <option value="">— Select —</option>
        {field.enum.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  // Date input
  if (field.format === 'date') {
    return <input type="date" value={value?.split('T')[0] ?? ''} onChange={e => onChange(e.target.value)} style={baseInputStyle} />;
  }

  // DateTime input
  if (field.format === 'date-time') {
    return <input type="datetime-local" value={value?.replace('Z', '').slice(0, 16) ?? ''} onChange={e => onChange(e.target.value)} style={baseInputStyle} />;
  }

  // Number input
  if (field.type === 'number' || field.type === 'integer') {
    return <input type="number" value={value ?? ''} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} style={baseInputStyle} />;
  }

  // Boolean input
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={value ?? false} onChange={e => onChange(e.target.checked)} className="w-4 h-4 accent-yellow-500" />
        <span className="text-sm" style={{ color: G.dim }}>{value ? 'Yes' : 'No'}</span>
      </label>
    );
  }

  // Array / Object → JSON textarea
  if (field.type === 'array' || field.type === 'object') {
    return (
      <textarea
        rows={3}
        value={typeof value === 'string' ? value : (value ? JSON.stringify(value, null, 2) : '')}
        onChange={e => {
          const raw = e.target.value;
          try { onChange(JSON.parse(raw)); }
          catch { onChange(raw); }
        }}
        placeholder={field.type === 'array' ? '["item1", "item2"]' : '{"key": "value"}'}
        style={{ ...baseInputStyle, fontFamily: 'monospace', fontSize: '12px' }}
      />
    );
  }

  // Long text → textarea
  if (isLongText(field.key, { type: field.type })) {
    return <textarea rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} style={baseInputStyle} />;
  }

  // Default: text input
  return <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} style={baseInputStyle} />;
}

export default function EntityFormModal({ entityName, entityDisplayName, schema, record, onSave, onClose }) {
  const fields = useMemo(() => getFormFields(schema), [schema]);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initial = {};
    for (const field of fields) {
      if (record) {
        initial[field.key] = record[field.key] ?? field.default ?? '';
      } else {
        initial[field.key] = field.default ?? (field.type === 'boolean' ? false : field.type === 'array' || field.type === 'object' ? null : '');
      }
    }
    setFormData(initial);
  }, [record, fields]);

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const missing = fields.filter(f => f.required && (formData[f.key] === '' || formData[f.key] === null || formData[f.key] === undefined));
    if (missing.length > 0) {
      alert(`Required fields missing: ${missing.map(f => f.label).join(', ')}`);
      return;
    }
    // Clean: remove empty strings for optional fields, remove null values
    const cleanData = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value !== '' && value !== null && value !== undefined) {
        cleanData[key] = value;
      }
    }
    setSaving(true);
    try {
      await onSave(cleanData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
        style={{ background: 'linear-gradient(145deg, rgba(8,16,38,0.98), rgba(4,10,24,0.99))', border: `1px solid ${G.border}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 z-10" style={{ borderColor: G.border, background: 'rgba(8,16,38,0.98)' }}>
          <h3 className="text-lg font-bold" style={{ color: G.text }}>
            {record ? 'Edit' : 'Create'} {entityDisplayName}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" style={{ color: G.dim }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {fields.length === 0 && (
            <p className="text-center py-8" style={{ color: G.dim }}>No editable fields in schema</p>
          )}
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1" style={{ color: G.text }}>
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <FormField field={field} value={formData[field.key]} onChange={v => handleFieldChange(field.key, v)} />
              {field.description && (
                <p className="text-xs mt-1" style={{ color: G.dim }}>{field.description}</p>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: G.border }}>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ border: `1px solid ${G.border}`, color: G.dim }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f6d860, #c98a14)', color: '#0d1b2a' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {record ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}