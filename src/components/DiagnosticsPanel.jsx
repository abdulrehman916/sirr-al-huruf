import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Copy, Trash2, Check } from "lucide-react";
import { getDiagLogs, clearDiagLogs, subscribeDiagLogs, copyDiagLogs } from "@/lib/diagLog";

// Temporary debug overlay (DEBUGGING ONLY). Displays all captured [DIAG] logs
// with timestamps and a Copy Logs button. Safe to delete once resolved.
export default function DiagnosticsPanel({ onClose }) {
  const [logs, setLogs] = useState(() => getDiagLogs());
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeDiagLogs((entry) => {
      if (entry === null) { setLogs([]); return; }
      setLogs(prev => [...prev, entry]);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const handleCopy = async () => {
    const ok = await copyDiagLogs();
    setCopied(ok);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3"
      style={{ background: "rgba(0,0,0,0.88)" }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: "1px solid rgba(212,175,55,0.45)", maxHeight: "85vh" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(212,175,55,0.20)" }}>
          <div>
            <h3 className="font-inter font-bold text-white text-sm">Diagnostics — [DIAG] Logs</h3>
            <p className="text-xs text-white/35 mt-0.5">{logs.length} entries · temporary debug panel</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
              style={{
                background: copied ? "rgba(34,197,94,0.15)" : "rgba(212,175,55,0.14)",
                border: "1px solid rgba(212,175,55,0.45)",
                color: copied ? "#4ade80" : "#F5D060",
              }}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Logs"}
            </button>
            <button onClick={clearDiagLogs}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)" }}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.45)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs"
          style={{ background: "rgba(0,0,0,0.40)" }}>
          {logs.length === 0 ? (
            <p className="text-white/30 text-center py-8">No [DIAG] logs captured yet.</p>
          ) : logs.map((e, i) => (
            <div key={i} className="flex gap-2 leading-relaxed">
              <span className="text-white/30 flex-shrink-0">[{e.t}]</span>
              <span className="text-white/80 break-all whitespace-pre-wrap">{e.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}