// Temporary in-app diagnostics log capture (DEBUGGING ONLY).
// Captures any console.log call whose first argument is a string containing
// the [DIAG] marker, stores it with a timestamp in a ring buffer, and notifies
// subscribers. The original console.log is always preserved — no behavior change.
// This module can be deleted once the issue is resolved.

const DIAG_MARKER = '[DIAG]';
const MAX_ENTRIES = 1000;

let installed = false;
let entries = [];
const listeners = new Set();

function nowStamp() {
  const d = new Date();
  return d.toLocaleTimeString('en-GB', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

function stringifyArgs(args) {
  return args.map(a => {
    if (typeof a === 'string') return a;
    if (a instanceof Error) return a.message;
    try { return JSON.stringify(a); } catch { return String(a); }
  }).join(' ');
}

function push(text) {
  const entry = { t: nowStamp(), text };
  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);
  listeners.forEach(cb => { try { cb(entry); } catch { /* ignore */ } });
}

export function installDiagCapture() {
  if (installed || typeof console === 'undefined') return;
  installed = true;
  const origLog = console.log.bind(console);
  console.log = function (...args) {
    try {
      if (args.length > 0 && typeof args[0] === 'string' && args[0].includes(DIAG_MARKER)) {
        push(stringifyArgs(args));
      }
    } catch { /* never break logging */ }
    return origLog(...args);
  };
}

export function getDiagLogs() {
  return entries.slice();
}

export function clearDiagLogs() {
  entries = [];
  listeners.forEach(cb => { try { cb(null); } catch { /* ignore */ } });
}

export function subscribeDiagLogs(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export async function copyDiagLogs() {
  const text = entries.map(e => `[${e.t}] ${e.text}`).join('\n');
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for WebView without clipboard permission
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

// Auto-install on module import so capture begins as early as possible.
installDiagCapture();