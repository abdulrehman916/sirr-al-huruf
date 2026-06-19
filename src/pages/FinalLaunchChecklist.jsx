import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, Shield, Info, ClipboardCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SIMULATION_SCENARIOS, VERIFICATION_CHECKS, PRE_LAUNCH_MANDATORY, KNOWN_LIMITATIONS, LAUNCH_READY, LAUNCH_SUMMARY } from "@/lib/launchChecklistData";

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)", bgHi: "rgba(212,175,55,0.14)", borderHi: "rgba(212,175,55,0.55)" };

const STATUS_CFG = {
  PASS: { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", label: "✓" },
  FAIL: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", label: "✗" },
  WARN: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", label: "⚠" },
};

const SEV_CFG = {
  CRITICAL: { color: "#ef4444" },
  MEDIUM: { color: "#f59e0b" },
  LOW: { color: "#a78bfa" },
  INFO: { color: "rgba(255,255,255,0.35)" },
};

export default function FinalLaunchChecklist() {
  const { toast } = useToast();
  const [section, setSection] = useState("simulations");
  const [expandedSim, setExpandedSim] = useState(null);

  const simPassCount = SIMULATION_SCENARIOS.filter(s => s.steps.every(st => st.status === "PASS")).length;
  const totalSimSteps = SIMULATION_SCENARIOS.reduce((acc, s) => acc + s.steps.length, 0);
  const passSteps = SIMULATION_SCENARIOS.reduce((acc, s) => acc + s.steps.filter(st => st.status === "PASS").length, 0);
  const mandatoryPass = PRE_LAUNCH_MANDATORY.filter(m => m.status === "PASS").length;
  const mandatoryCritical = PRE_LAUNCH_MANDATORY.filter(m => m.critical && m.status !== "PASS").length;

  const copyChecklist = () => {
    const text = `FINAL LAUNCH CHECKLIST — Sirr al-Huruf
Date: 2026-06-19
Status: ${LAUNCH_READY ? "✓ APPROVED FOR LAUNCH" : "✗ NOT READY"}

SIMULATIONS: ${simPassCount}/${SIMULATION_SCENARIOS.length} scenarios (${passSteps}/${totalSimSteps} steps)
VERIFICATION: ${VERIFICATION_CHECKS.length} categories checked
MANDATORY: ${mandatoryPass}/${PRE_LAUNCH_MANDATORY.length} items (${mandatoryCritical} critical blockers)
LIMITATIONS: ${KNOWN_LIMITATIONS.length} known (accepted)

${LAUNCH_READY ? "✓ CLEARED FOR PRODUCTION LAUNCH" : "✗ CRITICAL ITEMS REMAINING"}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Checklist copied!", description: "Ready to share with team" });
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-16 space-y-6">

        {/* ── Header ── */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(212,175,55,0.12)", border: `1px solid ${G.border}`, color: G.text }}>
            <Shield className="w-3.5 h-3.5" /> Final Launch Checklist
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">سرّ الحروف — Pre-Launch Simulation Report</h1>
          <p className="text-xs text-white/35 font-inter">
            2026-06-19 · 10 scenarios · {totalSimSteps} test steps · {PRE_LAUNCH_MANDATORY.length} mandatory checks
          </p>
        </div>

        {/* ── Launch Verdict Banner ── */}
        <div className={`rounded-2xl border p-5 flex items-center gap-4`}
          style={{
            background: LAUNCH_READY ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            borderColor: LAUNCH_READY ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.40)",
          }}>
          {LAUNCH_READY
            ? <CheckCircle className="w-10 h-10 flex-shrink-0 text-green-400" />
            : <XCircle className="w-10 h-10 flex-shrink-0 text-red-400" />}
          <div className="flex-1">
            <p className="font-inter font-bold text-lg" style={{ color: LAUNCH_READY ? "#4ade80" : "#ef4444" }}>
              {LAUNCH_READY ? "✓ CLEARED FOR PRODUCTION LAUNCH" : "✗ NOT READY — Critical items remaining"}
            </p>
            <p className="text-sm text-white/55 mt-0.5">
              {simPassCount}/{SIMULATION_SCENARIOS.length} scenarios · {mandatoryPass}/{PRE_LAUNCH_MANDATORY.length} mandatory · {mandatoryCritical} critical blockers
            </p>
          </div>
          <button onClick={copyChecklist}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <ClipboardCheck className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Scenarios Pass", value: `${simPassCount}/${SIMULATION_SCENARIOS.length}`, color: simPassCount === SIMULATION_SCENARIOS.length ? "#4ade80" : "#f59e0b" },
            { label: "Test Steps", value: `${passSteps}/${totalSimSteps}`, color: passSteps === totalSimSteps ? "#4ade80" : "#f59e0b" },
            { label: "Mandatory", value: `${mandatoryPass}/${PRE_LAUNCH_MANDATORY.length}`, color: mandatoryCritical === 0 ? "#4ade80" : "#ef4444" },
            { label: "Critical Blockers", value: mandatoryCritical, color: mandatoryCritical === 0 ? "#4ade80" : "#ef4444" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-3 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-white/40 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Section Nav ── */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "simulations", label: `Scenarios (${SIMULATION_SCENARIOS.length})` },
            { id: "verification", label: `Verification (${VERIFICATION_CHECKS.length})` },
            { id: "mandatory", label: `Mandatory (${PRE_LAUNCH_MANDATORY.length})` },
            { id: "limitations", label: `Limitations (${KNOWN_LIMITATIONS.length})` },
          ].map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: section === s.id ? G.bgHi : "rgba(255,255,255,0.03)",
                border: `1px solid ${section === s.id ? G.borderHi : "rgba(255,255,255,0.07)"}`,
                color: section === s.id ? G.text : "rgba(255,255,255,0.40)",
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── SIMULATIONS SECTION ── */}
        {section === "simulations" && (
          <div className="space-y-3">
            {SIMULATION_SCENARIOS.map(sim => {
              const allPass = sim.steps.every(st => st.status === "PASS");
              const isExpanded = expandedSim === sim.id;
              return (
                <div key={sim.id} className="rounded-xl border overflow-hidden"
                  style={{ background: allPass ? `${STATUS_CFG.PASS.color}06` : G.bg, borderColor: allPass ? `${STATUS_CFG.PASS.color}25` : G.border }}>
                  <button onClick={() => setExpandedSim(isExpanded ? null : sim.id)}
                    className="w-full p-4 flex items-center gap-3 text-left">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs`}
                      style={{ background: allPass ? `${STATUS_CFG.PASS.color}18` : `${STATUS_CFG.FAIL.color}18`, color: allPass ? STATUS_CFG.PASS.color : STATUS_CFG.FAIL.color }}>
                      {allPass ? STATUS_CFG.PASS.label : STATUS_CFG.FAIL.label}
                    </div>
                    <div className="flex-1">
                      <p className="font-inter font-bold text-sm text-white">{sim.id} — {sim.title}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{sim.steps.filter(s => s.status === "PASS").length}/{sim.steps.length} steps pass · Risk: {sim.risk}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: G.border }}>
                      {sim.steps.map((st, idx) => (
                        <div key={idx} className="flex items-start gap-2 py-1.5">
                          <span className={`text-[10px] font-bold flex-shrink-0 w-4 pt-0.5`} style={{ color: st.status === "PASS" ? STATUS_CFG.PASS.color : STATUS_CFG.FAIL.color }}>
                            {st.status === "PASS" ? "✓" : "✗"}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs text-white/80">{st.step}</p>
                            <p className="text-[10px] text-white/40 mt-0.5">Expected: {st.expected}</p>
                          </div>
                        </div>
                      ))}
                      {sim.notes && (
                        <div className="mt-3 p-2.5 rounded-lg" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.20)" }}>
                          <p className="text-[11px]" style={{ color: "#60a5fa" }}><span className="font-bold">Note: </span>{sim.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── VERIFICATION SECTION ── */}
        {section === "verification" && (
          <div className="space-y-4">
            {VERIFICATION_CHECKS.map((cat, idx) => (
              <div key={idx} className="rounded-xl border p-4 space-y-2" style={{ background: G.bg, borderColor: G.border }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4" style={{ color: STATUS_CFG.PASS.color }} />
                  <p className="font-inter font-bold text-sm text-white">{cat.category}</p>
                </div>
                <ul className="space-y-1.5 ml-6">
                  {cat.checks.map((check, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2">
                      <span className="text-[10px] text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-white/70">{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ── MANDATORY SECTION ── */}
        {section === "mandatory" && (
          <div className="space-y-2">
            {PRE_LAUNCH_MANDATORY.map(m => {
              const st = m.status === "PASS" ? STATUS_CFG.PASS : m.status === "WARN" ? STATUS_CFG.WARN : STATUS_CFG.FAIL;
              return (
                <div key={m.id} className="rounded-xl border p-4 flex items-center gap-3"
                  style={{ background: st.bg, borderColor: st.border }}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs`}
                    style={{ background: `${st.color}18`, color: st.color }}>
                    {st.label}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-white/80">{m.item}</p>
                    {m.critical && <p className="text-[10px] mt-0.5" style={{ color: "#ef4444" }}>CRITICAL</p>}
                  </div>
                  <span className="text-[11px] font-mono text-white/25">{m.id}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LIMITATIONS SECTION ── */}
        {section === "limitations" && (
          <div className="space-y-3">
            {KNOWN_LIMITATIONS.map(lim => {
              const sc = SEV_CFG[lim.severity];
              return (
                <div key={lim.id} className="rounded-xl border p-4 space-y-2"
                  style={{ background: `${sc.color}08`, borderColor: `${sc.color}25` }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: sc.color }} />
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                      style={{ background: `${sc.color}18`, color: sc.color, border: `1px solid ${sc.color}35` }}>
                      {lim.severity}
                    </span>
                    <span className="text-[10px] font-mono text-white/25 ml-auto">{lim.id}</span>
                  </div>
                  <p className="text-sm text-white/80">{lim.limitation}</p>
                  <div className="rounded-lg p-2.5" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)" }}>
                    <p className="text-xs text-green-300/80"><span className="font-bold text-green-400">Workaround: </span>{lim.workaround}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="rounded-xl border p-4 text-center space-y-2" style={{ background: G.bg, borderColor: G.border }}>
          <p className="font-inter text-xs text-white/40">Simulation completed 2026-06-19 · Sirr al-Huruf v1.0</p>
          <p className={`font-inter text-sm font-bold ${LAUNCH_READY ? "text-green-400" : "text-red-400"}`}>
            {LAUNCH_READY
              ? "✓ All critical flows tested end-to-end. Application is PRODUCTION READY."
              : "✗ Critical failures must be resolved before launch."}
          </p>
        </div>

      </div>
    </PageLayout>
  );
}