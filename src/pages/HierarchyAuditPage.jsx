import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  angel: "#4FE3FF",
  jinn: "#FF9F5A",
};

export default function HierarchyAuditPage() {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    try {
      const res = await base44.functions.invoke('auditHierarchy', {});
      setAudit(res.data);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (tier) => {
    setExpanded(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load audit data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold" style={{ color: G.text }}>
            Hierarchy Audit Trail
          </h1>
          <p className="text-lg" style={{ color: G.dim }}>
            MC = {audit.mc} ({audit.gridSize}×{audit.gridSize} Grid)
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" style={{ borderColor: G.borderHi, color: G.text }}>
              Triangle Constant: {audit.triangleConstant}
            </Badge>
          </div>
        </motion.div>

        {/* Hierarchy Table */}
        <Card style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi }}>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderBottomColor: G.borderHi }}>
                    <TableHead className="w-32" style={{ color: G.text }}>Tier</TableHead>
                    <TableHead className="w-24 text-right" style={{ color: G.text }}>Value</TableHead>
                    <TableHead className="w-48" style={{ color: G.text }}>Ulvi Adjustment</TableHead>
                    <TableHead className="w-40" style={{ color: G.text }}>Letters</TableHead>
                    <TableHead style={{ color: G.text }}>Angel Name</TableHead>
                    <TableHead style={{ color: G.text }}>Jinn Name</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(audit.hierarchy).map(([tier, data], idx) => (
                    <TableRow key={tier} style={{ borderBottomColor: "rgba(212,175,55,0.15)" }}>
                      <TableCell className="font-medium" style={{ color: G.text }}>{tier}</TableCell>
                      <TableCell className="text-right font-bold" style={{ color: G.text }}>{data.value}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div style={{ color: G.angel }}>
                            Original: {data.arabicAngel.originalValue}
                          </div>
                          <div className="flex items-center gap-1" style={{ color: G.angel }}>
                            <ChevronRight className="w-3 h-3" />
                            Adjusted: {data.arabicAngel.adjustedValue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1" dir="rtl">
                          {data.arabicAngel.letters.map((letter, i) => (
                            <span key={i} className="px-2 py-1 rounded text-sm"
                              style={{ background: "rgba(212,175,55,0.15)", color: G.angel, border: `1px solid ${G.angel}40` }}>
                              {letter}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs" style={{ color: G.dim }}>
                            Before: {data.arabicAngel.nameBefore}
                          </div>
                          <div className="text-lg font-bold" dir="rtl" style={{ color: G.angel }}>
                            {data.arabicAngel.nameAfter}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs" style={{ color: G.dim }}>
                            Before: {data.arabicJinn.nameBefore}
                          </div>
                          <div className="text-lg font-bold" dir="rtl" style={{ color: G.jinn }}>
                            {data.arabicJinn.nameAfter}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(tier)}
                          style={{ color: G.text }}
                        >
                          {expanded[tier] ? '−' : '+'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        {Object.entries(audit.hierarchy).map(([tier, data]) => (
          expanded[tier] && (
            <motion.div
              key={`detail-${tier}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Angel Details */}
              <Card style={{ background: "rgba(4,8,24,0.99)", borderColor: G.angel }}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" style={{ color: G.angel }} />
                    <h3 className="text-lg font-bold" style={{ color: G.angel }}>
                      {tier} — Arabic Angel
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Original Hierarchy Value</p>
                      <p className="text-2xl font-bold" style={{ color: G.text }}>{data.arabicAngel.originalValue}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Adjusted Ulvi Value</p>
                      <p className="text-2xl font-bold" style={{ color: G.angel }}>{data.arabicAngel.adjustedValue}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: "rgba(79,227,255,0.08)", border: `1px solid ${G.angel}40` }}>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: G.angel }}>Ulvi Adjustment Rule</p>
                    <p className="font-mono text-sm" style={{ color: G.text }}>{data.arabicAngel.adjustmentRule}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Letter Extraction Steps</p>
                    <div className="space-y-1">
                      {data.arabicAngel.extractionSteps.map((step, i) => (
                        <p key={i} className="font-mono text-sm" style={{ color: G.text }}>{step}</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Name Before Tashkeel</p>
                      <p className="text-xl font-bold" dir="rtl" style={{ color: G.text }}>{data.arabicAngel.nameBefore}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Name After Tashkeel</p>
                      <p className="text-xl font-bold" dir="rtl" style={{ color: G.angel }}>{data.arabicAngel.nameAfter}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Jinn Details */}
              <Card style={{ background: "rgba(4,8,24,0.99)", borderColor: G.jinn }}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" style={{ color: G.jinn }} />
                    <h3 className="text-lg font-bold" style={{ color: G.jinn }}>
                      {tier} — Arabic Jinn
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Original Hierarchy Value</p>
                      <p className="text-2xl font-bold" style={{ color: G.text }}>{data.arabicJinn.originalValue}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Adjusted Ulvi Value</p>
                      <p className="text-2xl font-bold" style={{ color: G.jinn }}>{data.arabicJinn.adjustedValue}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: "rgba(255,159,90,0.08)", border: `1px solid ${G.jinn}40` }}>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: G.jinn }}>Ulvi Adjustment Rule</p>
                    <p className="font-mono text-sm" style={{ color: G.text }}>{data.arabicJinn.adjustmentRule}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Letter Extraction Steps</p>
                    <div className="space-y-1">
                      {data.arabicJinn.extractionSteps.map((step, i) => (
                        <p key={i} className="font-mono text-sm" style={{ color: G.text }}>{step}</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Name Before Tashkeel</p>
                      <p className="text-xl font-bold" dir="rtl" style={{ color: G.text }}>{data.arabicJinn.nameBefore}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest" style={{ color: G.dim }}>Name After Tashkeel</p>
                      <p className="text-xl font-bold" dir="rtl" style={{ color: G.jinn }}>{data.arabicJinn.nameAfter}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
}