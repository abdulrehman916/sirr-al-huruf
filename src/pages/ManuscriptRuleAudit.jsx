import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { FileText, CheckCircle, AlertCircle, Database, TrendingUp } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  success: "rgba(34,197,94,0.70)",
  warning: "rgba(255,193,7,0.70)",
  danger: "rgba(239,68,68,0.70)"
};

export default function ManuscriptRuleAudit() {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    runAudit();
  }, []);

  async function runAudit() {
    try {
      setLoading(true);
      const response = await base44.functions.invoke('auditManuscriptRuleCompleteness', {});
      setAudit(response.data.audit);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-inter text-white/70">Running database audit...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 rounded-xl border" style={{ borderColor: G.danger, background: "rgba(239,68,68,0.1)" }}>
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: G.danger }} />
            <p className="font-inter text-white/90">Audit failed: {error}</p>
            <button onClick={runAudit} className="mt-4 px-6 py-2 rounded-lg" style={{ background: G.danger, color: "#fff" }}>
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-inter text-3xl font-bold uppercase tracking-widest" style={{ color: G.text }}>
              ManuscriptRule Database Audit
            </h1>
            <p className="font-inter text-sm mt-2" style={{ color: G.dim }}>
              Completeness Report - {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              icon={Database}
              label="Total Records"
              value={audit.total_records}
              color={G.text}
            />
            <SummaryCard
              icon={CheckCircle}
              label="Completeness Score"
              value={`${audit.completeness_score}%`}
              color={audit.completeness_score >= 70 ? G.success : audit.completeness_score >= 40 ? G.warning : G.danger}
            />
            <SummaryCard
              icon={FileText}
              label="Missing Arabic"
              value={audit.missing_fields.missing_arabic.length}
              color={audit.missing_fields.missing_arabic.length === 0 ? G.success : G.danger}
            />
            <SummaryCard
              icon={AlertCircle}
              label="Needs Re-ingestion"
              value={audit.records_requiring_reingestion_count}
              color={audit.records_requiring_reingestion_count === 0 ? G.success : G.warning}
            />
          </div>

          {/* Field Completeness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border p-6"
            style={{ background: G.bg, borderColor: G.faint }}
          >
            <h2 className="font-inter text-xl font-bold uppercase tracking-widest mb-6" style={{ color: G.text }}>
              Field Completeness
            </h2>
            <div className="space-y-4">
              <FieldBar label="Original Arabic Text" count={audit.with_original_arabic} total={audit.total_records} color={G.success} />
              <FieldBar label="Malayalam Translation" count={audit.with_malayalam_translation} total={audit.total_records} color={G.text} />
              <FieldBar label="Arabic Letter Associations" count={audit.with_arabic_letter} total={audit.total_records} color={G.text} />
              <FieldBar label="Planetary Associations" count={audit.with_planet} total={audit.total_records} color={G.text} />
              <FieldBar label="Zodiac Associations" count={audit.with_zodiac} total={audit.total_records} color={G.text} />
              <FieldBar label="Lunar Mansion Associations" count={audit.with_lunar_mansion} total={audit.total_records} color={G.text} />
            </div>
          </motion.div>

          {/* By Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border p-6"
            style={{ background: G.bg, borderColor: G.faint }}
          >
            <h2 className="font-inter text-xl font-bold uppercase tracking-widest mb-6" style={{ color: G.text }}>
              Completeness by Category
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${G.faint}` }}>
                    <th className="text-left py-3 px-4 font-inter" style={{ color: G.dim }}>Category</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Total</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Arabic</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Malayalam</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Letters</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Planets</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Zodiac</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Mansions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(audit.by_category).map(([category, stats]) => (
                    <tr key={category} style={{ borderBottom: `1px solid ${G.faint}` }}>
                      <td className="py-3 px-4 font-inter" style={{ color: G.text }}>{category}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>{stats.total}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_arabic === stats.total ? G.success : G.text }}>{stats.with_arabic}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_malayalam === stats.total ? G.success : G.text }}>{stats.with_malayalam}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_letter === stats.total ? G.success : G.text }}>{stats.with_letter}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_planet === stats.total ? G.success : G.text }}>{stats.with_planet}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_zodiac === stats.total ? G.success : G.text }}>{stats.with_zodiac}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_mansion === stats.total ? G.success : G.text }}>{stats.with_mansion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* By Manuscript */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border p-6"
            style={{ background: G.bg, borderColor: G.faint }}
          >
            <h2 className="font-inter text-xl font-bold uppercase tracking-widest mb-6" style={{ color: G.text }}>
              Completeness by Manuscript
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${G.faint}` }}>
                    <th className="text-left py-3 px-4 font-inter" style={{ color: G.dim }}>Manuscript</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Total</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Arabic</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Malayalam</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Letters</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Planets</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Zodiac</th>
                    <th className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>Mansions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(audit.by_manuscript).map(([manuscript, stats]) => (
                    <tr key={manuscript} style={{ borderBottom: `1px solid ${G.faint}` }}>
                      <td className="py-3 px-4 font-inter text-xs" style={{ color: G.text }}>{manuscript}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: G.dim }}>{stats.total}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_arabic === stats.total ? G.success : G.text }}>{stats.with_arabic}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_malayalam === stats.total ? G.success : G.text }}>{stats.with_malayalam}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_letter === stats.total ? G.success : G.text }}>{stats.with_letter}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_planet === stats.total ? G.success : G.text }}>{stats.with_planet}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_zodiac === stats.total ? G.success : G.text }}>{stats.with_zodiac}</td>
                      <td className="text-center py-3 px-4 font-inter" style={{ color: stats.with_mansion === stats.total ? G.success : G.text }}>{stats.with_mansion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Action Required */}
          {audit.records_requiring_reingestion_count > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border p-6"
              style={{ background: "rgba(255,193,7,0.08)", borderColor: G.warning }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6" style={{ color: G.warning }} />
                <h2 className="font-inter text-xl font-bold uppercase tracking-widest" style={{ color: G.warning }}>
                  Records Requiring Re-ingestion
                </h2>
              </div>
              <p className="font-inter text-white/70 mb-4">
                {audit.records_requiring_reingestion_count} records are missing 3 or more critical fields and should be re-ingested with enhanced extraction.
              </p>
              <div className="text-xs font-mono" style={{ color: G.dim }}>
                Sample IDs: {audit.records_requiring_reingestion.slice(0, 5).join(", ")}...
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border p-4 text-center"
      style={{ background: G.bg, borderColor: G.faint }}
    >
      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color }} />
      <p className="font-inter text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="font-inter text-xs mt-1" style={{ color: G.dim }}>{label}</p>
    </motion.div>
  );
}

function FieldBar({ label, count, total, color }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-inter text-sm" style={{ color: G.text }}>{label}</span>
        <span className="font-inter text-sm" style={{ color: G.dim }}>{count} / {total} ({percentage}%)</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
    </div>
  );
}