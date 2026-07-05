import { useState, useRef } from "react";
import { Upload, FileJson, FileSpreadsheet, Loader2, Database } from "lucide-react";
import * as XLSX from "xlsx";
import { base44 } from "@/api/base44Client";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
};

export default function ImportExportBar({ entries, onImportComplete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);
  const [importMode, setImportMode] = useState("json"); // "json" | "csv" | "xlsx"

  // ── Export JSON ──
  const exportJSON = () => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purpose-dictionary-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  // ── Export CSV ──
  const exportCSV = () => {
    const headers = [
      "purpose_phrase", "arabic_keyword", "malayalam_meaning", "english_meaning",
      "action", "normalized_purpose_key", "language", "aliases", "source", "is_active", "notes",
    ];
    const escapeCSV = (val) => {
      const s = (val || "").toString();
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const rows = entries.map(e => [
      escapeCSV(e.purpose_phrase),
      escapeCSV(e.arabic_keyword),
      escapeCSV(e.malayalam_meaning),
      escapeCSV(e.english_meaning),
      escapeCSV(e.action),
      escapeCSV(e.normalized_purpose_key),
      escapeCSV(e.language),
      escapeCSV((e.aliases || []).join("|")),
      escapeCSV(e.source),
      escapeCSV(e.is_active !== false ? "true" : "false"),
      escapeCSV(e.notes),
    ].join(","));

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purpose-dictionary-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  // ── Import ──
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setMessage("");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        let parsed = [];

        if (importMode === "json") {
          const content = event.target.result;
          parsed = JSON.parse(content);
          if (!Array.isArray(parsed)) {
            // Maybe it's a backup object with entries array
            if (parsed.entries && Array.isArray(parsed.entries)) {
              parsed = parsed.entries;
            } else {
              throw new Error("Invalid JSON: expected an array of entries");
            }
          }
        } else if (importMode === "xlsx") {
          // Excel parse — read as ArrayBuffer
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          parsed = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        } else {
          // CSV parse
          const content = event.target.result;
          parsed = parseCSV(content);
        }

        if (parsed.length === 0) {
          setMessage("No entries found in file.");
          setImporting(false);
          return;
        }

        // Validate and clean entries
        const cleaned = parsed
          .filter(e => e && e.purpose_phrase && e.normalized_purpose_key)
          .map(e => ({
            purpose_phrase: String(e.purpose_phrase).trim(),
            arabic_keyword: String(e.arabic_keyword || "").trim(),
            malayalam_meaning: String(e.malayalam_meaning || "").trim(),
            english_meaning: String(e.english_meaning || "").trim(),
            action: e.action || "jalb",
            normalized_purpose_key: e.normalized_purpose_key,
            language: e.language || "mixed",
            aliases: Array.isArray(e.aliases)
              ? e.aliases.map(a => String(a).trim()).filter(Boolean)
              : (typeof e.aliases === "string" ? e.aliases.split("|").map(a => a.trim()).filter(Boolean) : []),
            source: String(e.source || "").trim(),
            is_active: e.is_active !== false,
            notes: String(e.notes || "").trim(),
          }));

        if (cleaned.length === 0) {
          setMessage("No valid entries found (purpose_phrase and normalized_purpose_key are required).");
          setImporting(false);
          return;
        }

        // Bulk create
        const result = await base44.entities.PurposeDictionary.bulkCreate(cleaned);
        const successCount = Array.isArray(result) ? result.length : (result?.created || cleaned.length);
        setMessage(`Imported ${successCount} entries successfully.`);
        onImportComplete();
      } catch (err) {
        setMessage("Import failed: " + (err.message || "Unknown error"));
      } finally {
        setImporting(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    if (importMode === "xlsx") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const triggerImport = (mode) => {
    setImportMode(mode);
    setShowMenu(false);
    setTimeout(() => {
      if (fileRef.current) fileRef.current.click();
    }, 100);
  };

  return (
    <div className="relative">
      <input
        ref={fileRef}
        type="file"
        accept={importMode === "json" ? ".json,application/json" : importMode === "xlsx" ? ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : ".csv,text/csv"}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={importing}
        className="px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold font-inter"
        style={{
          background: G.bg,
          border: `1px solid ${G.border}`,
          color: G.text,
        }}
      >
        {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
        {importing ? "Importing..." : "Import / Export"}
      </button>

      {showMenu && (
        <>
          <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 999 }} />
          <div
            className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-1000 min-w-[200px]"
            style={{
              background: "linear-gradient(145deg, rgba(8,16,38,0.99) 0%, rgba(4,10,24,0.99) 100%)",
              border: `1px solid ${G.borderHi}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.60)",
            }}
          >
            <div className="p-2 space-y-1">
              <p className="font-inter text-[9px] uppercase tracking-wider font-bold px-2 py-1" style={{ color: "rgba(212,175,55,0.50)" }}>Export</p>
              <MenuItem icon={<FileJson className="w-3.5 h-3.5" />} label="Export JSON (Backup)" onClick={exportJSON} />
              <MenuItem icon={<FileSpreadsheet className="w-3.5 h-3.5" />} label="Export CSV" onClick={exportCSV} />
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
              <p className="font-inter text-[9px] uppercase tracking-wider font-bold px-2 py-1" style={{ color: "rgba(212,175,55,0.50)" }}>Import</p>
              <MenuItem icon={<Upload className="w-3.5 h-3.5" />} label="Import JSON" onClick={() => triggerImport("json")} />
              <MenuItem icon={<Upload className="w-3.5 h-3.5" />} label="Import CSV" onClick={() => triggerImport("csv")} />
              <MenuItem icon={<Upload className="w-3.5 h-3.5" />} label="Import Excel (.xlsx)" onClick={() => triggerImport("xlsx")} />
            </div>
          </div>
        </>
      )}

      {message && (
        <div className="absolute right-0 top-full mt-1 rounded-lg p-2 z-1000 min-w-[250px]"
          style={{
            background: message.includes("failed") ? "rgba(248,113,113,0.14)" : "rgba(74,222,128,0.14)",
            border: `1px solid ${message.includes("failed") ? "rgba(248,113,113,0.40)" : "rgba(74,222,128,0.40)"}`,
          }}>
          <p className="font-inter text-xs" style={{ color: message.includes("failed") ? "#F87171" : "#4ADE80" }}>{message}</p>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg font-inter text-xs hover:bg-white/5 transition-colors text-left"
      style={{ color: "rgba(255,255,255,0.75)" }}
    >
      <span style={{ color: "rgba(212,175,55,0.60)" }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Simple CSV parser ──
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const parseLine = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { current += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ",") { result.push(current); current = ""; }
        else { current += ch; }
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]);
  const entries = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const entry = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j].trim();
      let val = (values[j] || "").trim();
      if (key === "aliases") {
        entry[key] = val ? val.split("|").map(a => a.trim()).filter(Boolean) : [];
      } else if (key === "is_active") {
        entry[key] = val === "true";
      } else {
        entry[key] = val;
      }
    }
    entries.push(entry);
  }
  return entries;
}