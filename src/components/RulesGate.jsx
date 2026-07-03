import { useState } from 'react';
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

  if (!accepted) {
    return <RulesConditions mode="gate" onAccept={() => setAccepted(true)} />;
  }

  return children;
}