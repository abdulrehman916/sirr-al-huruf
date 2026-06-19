import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, AlertTriangle, Info, ClipboardCheck, Shield, Zap, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RESOLVED = [
  { id: "W01", title: "OTP Code Hashing", desc: "OTP codes now SHA-256 hashed before storage", impact: "HIGH", done: true },
  { id: "W02", title: "Permission Cache Flush", desc: "Cache invalidated on subscription/access grant/redemption", impact: "HIGH", done: true },
  { id: "W03", title: "Legacy Functions Removed", desc: "Deleted verifyOTP, verifyOtp, sendOtp, generateRegistrationOTP", impact: "LOW", done: true },
  { id: "W04", title: "PWA Manifest Created", desc: "public/manifest.json with app metadata and RTL config", impact: "MEDIUM", done: true },
  { id: "W05", title: "PWA Icons Added", desc: "SVG icons at 192x192 and 512x512 with Arabic 'س' branding", impact: "MEDIUM", done: true },
];

const REMAINING = [
  { id: "RW01", title: "Admin List Pagination", desc: "User lists capped at 200 records", sev: "LOW", blocker: false },
  { id: "RW02", title: "Manual WhatsApp", desc: "No automated WhatsApp integration", sev: "LOW", blocker: false },
  { id: "RW03", title: "PWA PNG Icons", desc: "SVG provided; PNG recommended for production", sev: "INFO", blocker: false },
];

const RISKS = [
  { id: "R01", title: "Permission Cache TTL", desc: "2-min delay on revocation", likelihood: "LOW", impact: "MEDIUM", accepted: true },
  { id: "R02", title: "OTP Rate Limiting", desc: "5/hour may restrict legitimate users", likelihood: "LOW", impact: "LOW", accepted: true },
  { id: "R03", title: "No Automated Tests", desc: "Manual QA only; regression suite planned v1.1", likelihood: "MEDIUM", impact: "MEDIUM", accepted: true },
];

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)", bgHi: "rgba(212,175,55,0.14)" };

export default function PreLaunchReport() {
  const { toast } = useToast();
  const [section, setSection] = useState("resolved");

  const copy = () => {
    navigator.clipboard.writeText(`PRE-LAUNCH REPORT — Sirr al-Huruf\n2026-06-19\n\nRESOLVED: ${RESOLVED.length} warnings\nREMAINING: ${REMAINING.length} (low-priority)\nRISKS: ${RISKS.length} (accepted)\n\nFIXES:\n✓ OTP SHA-256 hashed\n✓ Cache flush on grant\n✓ 4 legacy functions deleted\n✓ PWA manifest + icons\n\nSTATUS: ✓ APPROVED FOR LAUNCH`);
    toast({ title: "Copied!", description: "Report ready to share" });
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(212,175,55,0.12)", border: `1px solid ${G.border}`, color: G.text }}>
            <Shield className="w-3.5 h-3.5" /> Pre-Launch Report
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">سرّ الحروف — Warnings Resolution Report</h1>
          <p className="text-xs text-white/35 font-inter">2026-06-19 · All critical items resolved</p>
        </div>

        {/* Verdict */}
        <div className="rounded-2xl border p-5 flex items-center gap-4"
          style={{ background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.35)" }}>
          <CheckCircle className="w-10 h-10 flex-shrink-0 text-green-400" />
          <div className="flex-1">
            <p className="font-inter font-bold text-lg text-green-400">✓ APPROVED FOR PRODUCTION LAUNCH</p>
            <p className="text-sm text-white/55 mt-0.5">
              {RESOLVED.length} resolved · {REMAINING.length} remaining (low) · {RISKS.length} risks accepted
            </p>
          </div>
          <button onClick={copy}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            style={{ background: G.bgHi, border: `1px solid ${G.border}`, color: G.text }}>
            <ClipboardCheck className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Resolved", value: RESOLVED.length, color: "#4ade80" },
            { label: "Remaining", value: REMAINING.length, color: "#a78bfa" },
            { label: "Risks", value: RISKS.length, color: "#60a5fa" },
            { label: "Status", value: "READY", color: "#4ade80" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-3 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "resolved", label: `Resolved (${RESOLVED.length})` },
            { id: "remaining", label: `Remaining (${REMAINING.length})` },
            { id: "risks", label: `Risks (${RISKS.length})` },
          ].map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className="px-4 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: section === s.id ? G.bgHi : "rgba(255,255,255,0.03)",
                border: `1px solid ${section === s.id ? G.border : "rgba(255,255,255,0.07)"}`,
                color: section === s.id ? G.text : "rgba(255,255,255,0.40)",
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Resolved */}
        {section === "resolved" && (
          <div className="space-y-2">
            {RESOLVED.map(w => (
              <div key={w.id} className="rounded-xl border p-4 flex items-start gap-3"
                style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.25)" }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-inter font-bold text-sm text-white">{w.id}. {w.title}</p>
                  <p className="text-xs text-white/60 mt-0.5">{w.desc}</p>
                  <p className="text-[10px] mt-1 text-green-400/70">Impact: {w.impact}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Remaining */}
        {section === "remaining" && (
          <div className="space-y-2">
            {REMAINING.map(w => {
              const color = w.sev === "LOW" ? "#a78bfa" : "#f59e0b";
              return (
                <div key={w.id} className="rounded-xl border p-4"
                  style={{ background: `${color}08`, borderColor: `${color}25` }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" style={{ color }} />
                    <p className="font-inter font-bold text-sm text-white">{w.id}. {w.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded ml-auto"
                      style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}>{w.sev}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1.5 ml-6">{w.desc}</p>
                  {!w.blocker && <p className="text-[10px] text-green-400/60 mt-1 ml-6">✓ Not a launch blocker</p>}
                </div>
              );
            })}
          </div>
        )}

        {/* Risks */}
        {section === "risks" && (
          <div className="space-y-2">
            {RISKS.map(r => (
              <div key={r.id} className="rounded-xl border p-4"
                style={{ background: "rgba(96,165,246,0.06)", borderColor: "rgba(96,165,246,0.25)" }}>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <p className="font-inter font-bold text-sm text-white">{r.id}. {r.title}</p>
                </div>
                <p className="text-xs text-white/60 mt-1.5 ml-6">{r.desc}</p>
                <div className="flex gap-3 mt-2 ml-6">
                  <p className="text-[10px] text-white/40">Likelihood: {r.likelihood}</p>
                  <p className="text-[10px] text-white/40">Impact: {r.impact}</p>
                </div>
                {r.accepted && <p className="text-[10px] text-green-400/60 mt-1 ml-6">✓ Risk accepted for launch</p>}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="rounded-xl border p-4 text-center" style={{ background: G.bg, borderColor: G.border }}>
          <p className="font-inter text-xs text-white/40">Pre-Launch Report · 2026-06-19 · Sirr al-Huruf v1.0</p>
          <p className="font-inter text-sm font-bold text-green-400 mt-1">
            ✓ All critical warnings resolved. Cleared for production launch.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}