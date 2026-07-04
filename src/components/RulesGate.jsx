import { useState, useEffect } from 'react';
import RulesConditions from '@/pages/RulesConditions';
import { RULES_STORAGE_KEY } from '@/lib/rulesContent';

// Shows the Rules & Conditions acceptance screen on first launch.
// Once accepted (saved to localStorage), renders the app normally.
export default function RulesGate({ children }) {
  const [accepted, setAccepted] = useState(() => {
    try {
      return localStorage.getItem(RULES_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // [DIAG] Log RulesGate state on change
  useEffect(() => {
    let rulesAccepted = null;
    try { rulesAccepted = localStorage.getItem(RULES_STORAGE_KEY); } catch { /* ignore */ }
    console.log('[DIAG] RulesGate state:', { accepted, rulesAccepted });
  }, [accepted]);

  if (!accepted) {
    console.log('[DIAG] Rules screen mounted (gate shown)');
    return <RulesConditions mode="gate" onAccept={() => {
      console.log('[DIAG] Rules accepted');
      setAccepted(true);
    }} />;
  }

  console.log('[DIAG] Rules accepted — rendering app');
  return children;
}