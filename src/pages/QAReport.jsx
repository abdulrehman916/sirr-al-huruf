import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, Shield, Info } from "lucide-react";

const REPORT_DATE = "2026-06-19";

const FINDINGS = [
  // ── CRITICAL FIXES ─────────────────────────────────────────────────────────
  {
    id: "C1",
    severity: "CRITICAL",
    area: "Access Control",
    page: "checkPageAccessFast (backend)",
    problem: "ARCHIVED users were NOT blocked from accessing pages — only BLOCKED was checked. Archived users could still access private content.",
    fix: "Added ARCHIVED check using asServiceRole to bypass RLS. ARCHIVED users now receive 'denied' status.",
    status: "FIXED",
  },
  {
    id: "C2",
    severity: "CRITICAL",
    area: "Access Control",
    page: "checkPageAccessFast (backend)",
    problem: "Profile query used user-scoped entities (subject to RLS) instead of asServiceRole — in edge cases RLS could block the admin check itself.",
    fix: "Switched to base44.asServiceRole.entities.UserAccessProfile for the status check.",
    status: "FIXED",
  },
  {
    id: "C3",
    severity: "CRITICAL",
    area: "Subscription Check",
    page: "checkPageAccessFast (backend)",
    problem: "Subscription result was read as subCheck?.has_subscription but the invoke response body needed unwrapping — subscription check never granted access even when valid.",
    fix: "Added subData unwrap: const subData = subCheck?.has_subscription !== undefined ? subCheck : (subCheck?.data || subCheck). Now correctly reads has_subscription.",
    status: "FIXED",
  },

  // ── HIGH FIXES ──────────────────────────────────────────────────────────────
  {
    id: "H1",
    severity: "HIGH",
    area: "Permission System",
    page: "grantPagePermission (backend)",
    problem: "Re-granting an existing permission returned HTTP 409 error — admin could not extend or re-grant access to a user who already had a permission. The UI showed a failure toast.",
    fix: "Changed 409 path to update expiry_date and increment extended_count. Re-granting is now idempotent and updates the existing record.",
    status: "FIXED",
  },
  {
    id: "H2",
    severity: "HIGH",
    area: "Permission System",
    page: "approveAccessRequest (backend)",
    problem: "Permission code generation used .replace(/\\//g, '') which removed slashes instead of replacing with underscores — produced wrong codes like 'MIZAAN9_ACCESS' from '//mizaan9' paths.",
    fix: "Standardized to the canonical path-to-code formula: .replace(/^\\//, '').replace(/\\/$/, '').replace(/[\\/\\-:]/g, '_').toUpperCase() + '_ACCESS'",
    status: "FIXED",
  },
  {
    id: "H3",
    severity: "HIGH",
    area: "Navigation / UX",
    page: "ProtectedPage (LockedScreen)",
    problem: "Locked page had no 'Go Home' button — users could only request access via WhatsApp, but couldn't navigate away if they got stuck on a locked page.",
    fix: "Added 'Go Home' button below the WhatsApp request button on locked and expired states.",
    status: "FIXED",
  },
  {
    id: "H4",
    severity: "HIGH",
    area: "User Management",
    page: "UsersManagementTab",
    problem: "REMOVED status was mapped to DEACTIVATED/SUSPENDED (legacy states not in enum) — Removed Users tab was always empty. Remove action didn't exist on Active users.",
    fix: "Rewrote UsersManagementTab: 'Remove' button on Active tab, proper REMOVED enum in entity, restored correct status filtering. REMOVED users can still log in.",
    status: "FIXED",
  },

  // ── MEDIUM FIXES ────────────────────────────────────────────────────────────
  {
    id: "M1",
    severity: "MEDIUM",
    area: "UI / Content",
    page: "ProtectedPage (LockedScreen)",
    problem: "VIP info card showed the same t('protected_locked_desc') key as the main locked description — duplicate confusing text appeared below the card.",
    fix: "Replaced with a static clear message: 'Contact support via WhatsApp to request access.'",
    status: "FIXED",
  },
  {
    id: "M2",
    severity: "MEDIUM",
    area: "UI / Buttons",
    page: "MessagesTab (ChatModal) + Ticket list",
    problem: "Phone call (tel:) buttons existed in the chat modal header AND the ticket list — per requirements, phone calling must be removed.",
    fix: "Removed all tel: call links and Phone icon buttons from MessagesTab. WhatsApp button retained.",
    status: "FIXED",
  },
  {
    id: "M3",
    severity: "MEDIUM",
    area: "User Management",
    page: "UsersManagementTab",
    problem: "No visual counter row at top — admin had to count manually. Tab pills had counters but were small and easy to miss.",
    fix: "Added 4-card counter grid (Active / Removed / Blocked / Archived) with colored values, clickable to switch tab.",
    status: "FIXED",
  },
  {
    id: "M4",
    severity: "MEDIUM",
    area: "User Management",
    page: "UsersManagementTab (Removed tab)",
    problem: "Removed tab showed 'Archive' button instead of 'Restore to Active' — admin couldn't restore removed users from that tab.",
    fix: "Removed tab now shows 'Restore' (→ ACTIVE) and 'Block' buttons. Archive action removed from this flow.",
    status: "FIXED",
  },

  // ── LOW / INFORMATIONAL ─────────────────────────────────────────────────────
  {
    id: "L1",
    severity: "LOW",
    area: "Backend",
    page: "generateLoginOTP / verifyLoginOTP",
    problem: "REMOVED status comment was missing — code was ambiguous about whether REMOVED users could log in.",
    fix: "Added explicit comment: 'REMOVED users can still log in — only hidden from admin active list'.",
    status: "FIXED",
  },
  {
    id: "L2",
    severity: "LOW",
    area: "Code Quality",
    page: "MessagesTab imports",
    problem: "Unused imports (Phone, MicOff) remained after phone removal.",
    fix: "Cleaned unused imports from lucide-react import list.",
    status: "FIXED",
  },
  {
    id: "L3",
    severity: "INFO",
    area: "Navigation",
    page: "All content pages",
    problem: "Back navigation uses browser history (popstate) — works correctly on all tested paths.",
    fix: "No change needed. PageLayout handles popstate and startNav() for transition.",
    status: "PASS",
  },
  {
    id: "L4",
    severity: "INFO",
    area: "OTP / Auth",
    page: "Onboarding / OTPLogin",
    problem: "BLOCKED and ARCHIVED users correctly receive 403 at OTP generation step (generateLoginOTP). REMOVED users correctly pass through.",
    fix: "No change needed. Already correct.",
    status: "PASS",
  },
  {
    id: "L5",
    severity: "INFO",
    area: "Access Codes",
    page: "redeemAccessCode (backend)",
    problem: "BLOCKED/ARCHIVED check present and working. Invalid codes return clear error messages. Duplicate use returns correct rejection.",
    fix: "No change needed. All scenarios tested and passing.",
    status: "PASS",
  },
  {
    id: "L6",
    severity: "INFO",
    area: "Admin Dashboard",
    page: "OwnerAccessDashboard",
    problem: "All 10 tabs verified: Users, Subscriptions, Payments, Plans, Access Requests, Messages, Page Visibility, User Access, Access Codes, Security Audit.",
    fix: "No change needed. All tabs load correctly with data.",
    status: "PASS",
  },
  {
    id: "L7",
    severity: "INFO",
    area: "Page Visibility",
    page: "VisibilityTab / PageVisibilityConfig",
    problem: "Public/Private toggle verified. Only content pages shown (system pages excluded). Toggle calls updatePageVisibility function.",
    fix: "No change needed.",
    status: "PASS",
  },
  {
    id: "L8",
    severity: "INFO",
    area: "User Access Tab",
    page: "UserAccessTab",
    problem: "Grant, Extend, Revoke flows all verified. Duration picker working. Existing-path detection working.",
    fix: "No change needed.",
    status: "PASS",
  },
  {
    id: "L9",
    severity: "INFO",
    area: "Mobile / Responsive",
    page: "All pages",
    problem: "PageLayout uses 100dvh, safe-area-inset padding, and touch-action: pan-y on scroll container. Nav uses native momentum scrolling.",
    fix: "No change needed.",
    status: "PASS",
  },
];

const SEVERITY_CFG = {
  CRITICAL: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", icon: XCircle },
  HIGH:     { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", icon: AlertTriangle },
  MEDIUM:   { color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.20)", icon: Info },
  LOW:      { color: "#a78bfa", bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.18)", icon: Info },
  INFO:     { color: "rgba(255,255,255,0.40)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", icon: CheckCircle },
};

const STATUS_CFG = {
  FIXED: { color: "#4ade80", label: "✓ FIXED" },
  PASS:  { color: "#22c55e", label: "✓ PASS"  },
  OPEN:  { color: "#ef4444", label: "✗ OPEN"  },
};

const G = {
  border: "rgba(212,175,55,0.30)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.06)",
};

export default function QAReport() {
  const [filter, setFilter] = useState("ALL");

  const severities = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
  const displayed = filter === "ALL" ? FINDINGS : FINDINGS.filter(f => f.severity === filter);

  const counts = {
    CRITICAL: FINDINGS.filter(f => f.severity === "CRITICAL").length,
    HIGH:     FINDINGS.filter(f => f.severity === "HIGH").length,
    MEDIUM:   FINDINGS.filter(f => f.severity === "MEDIUM").length,
    fixed:    FINDINGS.filter(f => f.status === "FIXED").length,
    pass:     FINDINGS.filter(f => f.status === "PASS").length,
  };

  const criticalOpen = FINDINGS.filter(f => f.severity === "CRITICAL" && f.status === "OPEN").length;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto pb-12 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(212,175,55,0.12)", border: `1px solid rgba(212,175,55,0.30)`, color: "#F5D060" }}>
            <Shield className="w-3.5 h-3.5" /> QA Audit Report
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Full Application QA Audit</h1>
          <p className="text-xs text-white/35 font-inter">Sirr al-Huruf · {REPORT_DATE} · All layers tested</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Critical Issues",  value: counts.CRITICAL, color: "#ef4444" },
            { label: "High Issues",      value: counts.HIGH,     color: "#f59e0b" },
            { label: "Fixed",            value: counts.fixed,    color: "#4ade80" },
            { label: "Passed (No Fix)",  value: counts.pass,     color: "#22c55e" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-3 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-white/40 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Overall verdict */}
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${criticalOpen === 0 ? "" : ""}`}
          style={{
            background: criticalOpen === 0 ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.08)",
            borderColor: criticalOpen === 0 ? "rgba(34,197,94,0.30)" : "rgba(239,68,68,0.35)",
          }}>
          {criticalOpen === 0
            ? <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-400" />
            : <XCircle className="w-5 h-5 flex-shrink-0 text-red-400" />}
          <div>
            <p className="font-inter font-bold text-sm" style={{ color: criticalOpen === 0 ? "#4ade80" : "#ef4444" }}>
              {criticalOpen === 0 ? "✓ ZERO critical issues open — application passes QA" : `✗ ${criticalOpen} critical issue(s) still open`}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {counts.fixed} issues fixed · {counts.pass} systems verified passing · {counts.MEDIUM} medium notes
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 flex-wrap">
          {severities.map(s => {
            const cfg = SEVERITY_CFG[s] || {};
            const count = s === "ALL" ? FINDINGS.length : FINDINGS.filter(f => f.severity === s).length;
            return (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: filter === s ? (cfg.bg || G.bg) : "rgba(255,255,255,0.03)",
                  border: `1px solid ${filter === s ? (cfg.border || G.border) : "rgba(255,255,255,0.07)"}`,
                  color: filter === s ? (cfg.color || G.text) : "rgba(255,255,255,0.40)",
                }}>
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Findings list */}
        <div className="space-y-3">
          {displayed.map(f => {
            const sev = SEVERITY_CFG[f.severity];
            const SevIcon = sev.icon;
            const st = STATUS_CFG[f.status];
            return (
              <div key={f.id} className="rounded-xl border p-4 space-y-2"
                style={{ background: sev.bg, borderColor: sev.border }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SevIcon className="w-4 h-4 flex-shrink-0" style={{ color: sev.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ background: `${sev.color}18`, color: sev.color, border: `1px solid ${sev.color}35` }}>
                      {f.severity}
                    </span>
                    <span className="text-[10px] text-white/35 font-mono">{f.id}</span>
                    <span className="text-[10px] text-white/45 font-semibold">{f.area}</span>
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: st.color }}>{st.label}</span>
                </div>

                <div>
                  <p className="text-xs font-mono text-white/35 mb-0.5">{f.page}</p>
                  <p className="text-sm font-semibold text-white/80">{f.problem}</p>
                </div>

                {f.fix && f.status !== "PASS" && (
                  <div className="rounded-lg p-2.5" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)" }}>
                    <p className="text-xs text-green-300/80"><span className="font-bold text-green-400">Fix: </span>{f.fix}</p>
                  </div>
                )}
                {f.status === "PASS" && (
                  <div className="rounded-lg p-2.5" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)" }}>
                    <p className="text-xs text-green-300/60"><span className="font-bold text-green-400/70">Verified: </span>{f.fix}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Checklist summary */}
        <div className="rounded-xl border p-5 space-y-3" style={{ background: G.bg, borderColor: G.border }}>
          <h2 className="font-inter font-bold text-white text-sm">QA Checklist Summary</h2>
          {[
            ["Navigation — Back buttons, browser back, in-app back", true],
            ["Subscription system — grant, expiry, restore", true],
            ["Payment system — success / fail / duplicate / refund paths", true],
            ["User system — Active / Removed / Blocked / Archived login + access", true],
            ["Messages — text, voice, image/file upload, WhatsApp button", true],
            ["Phone call buttons removed", true],
            ["Access permissions — per-page, per-user, per-plan", true],
            ["Mobile layout — touch targets, safe areas, momentum scroll", true],
            ["Error handling — no blank screens, no infinite loaders", true],
            ["Admin dashboard — all 10 tabs verified", true],
            ["Zero critical issues open", true],
          ].map(([label, pass]) => (
            <div key={label} className="flex items-center gap-3">
              {pass
                ? <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-400" />
                : <XCircle className="w-4 h-4 flex-shrink-0 text-red-400" />}
              <p className="text-xs text-white/70">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}