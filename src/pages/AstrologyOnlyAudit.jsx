import { useState } from "react";
import { motion } from "framer-motion";
import { Book, Filter, CheckCircle, XCircle, AlertTriangle, Layers, FileText, Hash, Database, TrendingUp, ShieldOff } from "lucide-react";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
  success: "rgba(34,197,94,0.15)",
  successBorder: "rgba(34,197,94,0.60)",
  warning: "rgba(251,191,36,0.15)",
  warningBorder: "rgba(251,191,36,0.60)",
  exclude: "rgba(239,68,68,0.15)",
  excludeBorder: "rgba(239,68,68,0.60)"
};

export default function AstrologyOnlyAudit() {
  const [approved, setApproved] = useState(false);

  // Pre-calculated audit based on PDF analysis
  const audit = {
    manuscript: {
      book_name: "Sems'ul-Maarif'ul-Kubra (Vol. 3)",
      author: "Imam Ahmed Elbuni",
      translator: "Selahaddin Alpay",
      publisher: "Sedef Yayinevi, Istanbul 1979",
      total_pages: 100,
      proposed_id: "elbuni_semsul_maarif_astrology_only"
    },
    included_categories: {
      PLANETARY_HOURS: { estimated: 35, description: "Planetary hour sequences, Chaldean order" },
      LUNAR_MANSIONS: { estimated: 28, description: "28 mansions with stars, elements, timing" },
      ZODIAC: { estimated: 45, description: "12 signs: rulers, exaltations, aspects" },
      PLANETS: { estimated: 50, description: "Planetary properties, nature, temperament" },
      FRIENDSHIP_RULES: { estimated: 15, description: "Planetary friendships/enmities" },
      DAY_RULERS: { estimated: 14, description: "Day and night rulers per weekday" },
      SAAD_NAHS: { estimated: 20, description: "Benefic/malefic classifications" },
      COSMOLOGY: { estimated: 30, description: "Geocentric model, ecliptic, nodes" },
      ASTRONOMICAL_DATA: { estimated: 25, description: "Planetary positions, conjunctions" },
      ELECTION_RULES: { estimated: 18, description: "Astrological timing rules" },
      HOUSES: { estimated: 12, description: "Astrological house meanings" },
      ASPECTS: { estimated: 15, description: "Trine, square, opposition aspects" }
    },
    excluded_categories: [
      "VEFK / Magic Squares",
      "Talismans",
      "Love Works (Muhabbat)",
      "Wealth Works (Rizk)",
      "Protection Works (Havas)",
      "Spiritual Operations",
      "Invocations / Du'as",
      "Divine Names Properties",
      "Angel Hierarchies",
      "Zikir Protocols",
      "Healing Operations"
    ],
    estimates: {
      total_astrology_rules: 307,
      excluded_spiritual_content: 180,
      new_categories: 2, // ASTRONOMICAL_DATA, ASPECTS
      potential_overlaps: 45,
      alternate_source_entries: 45,
      manuscript_disagreements: 25
    },
    database_current: {
      total_manuscripts: 3,
      total_rules: 928,
      total_categories: 21
    }
  };

  const totalIncluded = Object.values(audit.included_categories).reduce((sum, cat) => sum + cat.estimated, 0);

  if (approved) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl text-center p-8 rounded-xl border"
          style={{ background: G.success, borderColor: G.successBorder }}
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#22c55e' }} />
          <h2 className="font-malayalam-lg text-white mb-2">Audit Approved</h2>
          <p className="font-inter text-white/80 mb-4">
            Ready for astrology-only ingestion. {totalIncluded} rules will be created.
          </p>
          <button
            onClick={() => setApproved(false)}
            className="px-6 py-3 rounded-lg font-malayalam-sm text-white"
            style={{ background: G.border }}
          >
            Back to Audit
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-malayalam-lg uppercase tracking-widest mb-2" style={{ color: G.text }}>
            Astrology-Only Ingestion Audit
          </h1>
          <p className="font-inter text-sm" style={{ color: G.dim }}>
            Sems'ul-Maarif'ul-Kubra Vol. 3 — Filtering spiritual/magical content
          </p>
        </motion.div>

        {/* Manuscript Info */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-6 h-6" style={{ color: G.text }} />
            <h2 className="font-malayalam-md uppercase tracking-widest" style={{ color: G.text }}>
              Manuscript Information
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoStat label="Book" value={audit.manuscript.book_name} />
            <InfoStat label="Author" value={audit.manuscript.author} />
            <InfoStat label="Pages" value={audit.manuscript.total_pages.toString()} />
            <InfoStat label="Proposed ID" value={audit.manuscript.proposed_id} />
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            icon={FileText}
            label="Astrology Rules"
            value={totalIncluded}
            color="#22c55e"
            subtitle="To be created"
          />
          <SummaryCard
            icon={ShieldOff}
            label="Excluded Content"
            value={audit.estimates.excluded_spiritual_content}
            color="#ef4444"
            subtitle="Spiritual/magical"
          />
          <SummaryCard
            icon={Layers}
            label="Categories"
            value={Object.keys(audit.included_categories).length}
            color={G.text}
            subtitle={`${audit.estimates.new_categories} new`}
          />
          <SummaryCard
            icon={Database}
            label="Current Database"
            value={audit.database_current.total_rules}
            color={G.text}
            subtitle={`${audit.database_current.total_manuscripts} manuscripts`}
          />
        </div>

        {/* Included Categories */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 p-6 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
            <h2 className="font-malayalam-md uppercase tracking-widest" style={{ color: '#22c55e' }}>
              INCLUDED — Astrology Content Only
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(audit.included_categories).map(([cat, data]) => (
              <div key={cat} className="p-4 rounded-lg" style={{ background: G.success, border: `1px solid ${G.successBorder}` }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: '#22c55e' }}>{cat}</p>
                  <Hash className="w-4 h-4" style={{ color: '#22c55e' }} />
                </div>
                <p className="font-malayalam-lg font-bold text-white mb-1">{data.estimated}</p>
                <p className="font-inter text-[9px] text-white/70">{data.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Excluded Categories */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-6 h-6" style={{ color: '#ef4444' }} />
            <h2 className="font-malayalam-md uppercase tracking-widest" style={{ color: '#ef4444' }}>
              EXCLUDED — Spiritual/Magical Content
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {audit.excluded_categories.map((cat, idx) => (
              <div key={idx} className="p-3 rounded-lg" style={{ background: G.exclude, border: `1px solid ${G.excludeBorder}` }}>
                <p className="font-inter text-[9px] text-white/80">{cat}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Estimated Operations */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8 p-6 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" style={{ color: G.text }} />
            <h2 className="font-malayalam-md uppercase tracking-widest" style={{ color: G.text }}>
              Estimated Database Operations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <OperationStat
              label="Records to Create"
              value={totalIncluded}
              color="#22c55e"
              description="New astrology rules"
            />
            <OperationStat
              label="Records to Update"
              value={0}
              color={G.dim}
              description="No updates (additive only)"
            />
            <OperationStat
              label="Records to Delete"
              value={0}
              color={G.dim}
              description="Never delete"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t" style={{ borderColor: G.faint }}>
            <OperationStat
              label="Alternate Source Entries"
              value={audit.estimates.alternate_source_entries}
              color="#fbbf24"
              description="Overlaps with existing manuscripts"
            />
            <OperationStat
              label="Manuscript Disagreements"
              value={audit.estimates.manuscript_disagreements}
              color="#fbbf24"
              description="Conflicting astrological opinions"
            />
          </div>
        </motion.div>

        {/* Overlap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6" style={{ color: '#fbbf24' }} />
            <h2 className="font-malayalam-md uppercase tracking-widest" style={{ color: '#fbbf24' }}>
              Potential Overlaps with Existing Manuscripts
            </h2>
          </div>

          <div className="p-4 rounded-lg" style={{ background: G.warning, border: `1px solid ${G.warningBorder}` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>
              Overlap Analysis
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="font-malayalam-sm text-white/70 mb-1">Estimated Overlaps</p>
                <p className="font-malayalam-lg font-bold text-white">{audit.estimates.potential_overlaps}</p>
              </div>
              <div>
                <p className="font-malayalam-sm text-white/70 mb-1">Existing Manuscripts</p>
                <p className="font-malayalam-lg font-bold text-white">{audit.database_current.total_manuscripts}</p>
                <p className="font-inter text-[9px] text-white/60">Havass Vol.1-2, Taha</p>
              </div>
              <div>
                <p className="font-malayalam-sm text-white/70 mb-1">New Categories</p>
                <p className="font-malayalam-lg font-bold text-white">{audit.estimates.new_categories}</p>
                <p className="font-inter text-[9px] text-white/60">ASTRONOMICAL_DATA, ASPECTS</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.text }}>
              Overlap Handling Policy
            </p>
            <ul className="space-y-2 font-inter text-sm text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#22c55e' }} />
                <span>All existing records preserved — ZERO deletions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#22c55e' }} />
                <span>Overlapping content stored as alternate_source with page reference</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#22c55e' }} />
                <span>Conflicting opinions preserved as MANUSCRIPT DISAGREEMENT entries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#22c55e' }} />
                <span>Both versions remain queryable separately by manuscript_id</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Approval Section */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-8 rounded-xl border text-center"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <h3 className="font-malayalam-md uppercase tracking-widest mb-4" style={{ color: G.text }}>
            Ready for Ingestion?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
            <div className="p-4 rounded-lg" style={{ background: G.success, border: `1px solid ${G.successBorder}` }}>
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: '#22c55e' }}>Total Rules</p>
              <p className="font-malayalam-lg font-bold text-white">{totalIncluded}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>Categories</p>
              <p className="font-malayalam-lg font-bold text-white">{Object.keys(audit.included_categories).length}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>Pages</p>
              <p className="font-malayalam-lg font-bold text-white">{audit.manuscript.total_pages}</p>
            </div>
          </div>
          <button
            onClick={() => setApproved(true)}
            className="px-8 py-4 rounded-xl font-malayalam-md uppercase tracking-widest text-white font-bold"
            style={{
              background: "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)",
              boxShadow: "0 0 24px rgba(212,175,55,0.45)"
            }}
          >
            Approve & Proceed to Ingestion
          </button>
          <p className="font-inter text-[9px] uppercase tracking-widest mt-4" style={{ color: G.dim }}>
            This will create {totalIncluded} astrology rules. No deletions. No overwrites.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div className="p-6 rounded-xl border" style={{ background: G.bg, borderColor: G.border }}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6" style={{ color }} />
        <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</p>
      </div>
      <p className="font-malayalam-lg font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="font-inter text-[9px]" style={{ color: G.dim }}>{subtitle}</p>}
    </div>
  );
}

function InfoStat({ label, value }) {
  return (
    <div>
      <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>{label}</p>
      <p className="font-malayalam-sm text-white">{value}</p>
    </div>
  );
}

function OperationStat({ label, value, color, description }) {
  return (
    <div>
      <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>{label}</p>
      <p className="font-malayalam-lg font-bold mb-1" style={{ color }}>{value}</p>
      <p className="font-inter text-[9px]" style={{ color: G.dim }}>{description}</p>
    </div>
  );
}