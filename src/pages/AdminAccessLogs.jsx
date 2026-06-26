import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/use-toast";

const RESULT_COLORS = {
  GRANTED: "text-green-400",
  DENIED: "text-red-400",
  EXPIRED: "text-yellow-400",
  REVOKED: "text-orange-400",
  NOT_FOUND: "text-gray-400",
};

export default function AdminAccessLogs() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user || user.role !== "admin") { setIsAdmin(false); return; }
      setIsAdmin(true);
      loadLogs();
    }).catch(() => setIsAdmin(false));
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.AccessLog.list("-timestamp", 500);
      setLogs(data);
    } catch (e) {
      toast({ title: "Failed to load logs", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === false) return <Navigate to="/" replace />;
  if (isAdmin === null) return (
    <AdminLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  const filtered = logs.filter(l =>
    !search ||
    (l.user_id || "").includes(search) ||
    (l.page_path || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.access_result || "").includes(search.toUpperCase())
  );

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div>
          <h1 className="font-inter text-xl font-bold text-white">Access Logs</h1>
          <p className="font-inter text-xs text-white/40 mt-0.5">Page access attempt history</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user ID, page, or result..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", fontSize: 16 }}
          />
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No logs found</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((log, i) => (
              <div key={log.id || i} className="rounded-xl border p-3 flex items-center gap-3 flex-wrap"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
                <span className={`font-mono text-xs font-bold ${RESULT_COLORS[log.access_result] || "text-white"}`}>
                  {log.access_result}
                </span>
                <span className="font-mono text-xs text-white/60 flex-1 min-w-0 truncate">{log.page_path}</span>
                <span className="font-mono text-[10px] text-white/30">{log.user_id?.slice(0, 12)}…</span>
                <span className="font-mono text-[10px] text-white/25">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}