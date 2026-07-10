import { useState } from 'react';
import RulesConditions from '@/pages/RulesConditions';
import { RULES_STORAGE_KEY } from '@/lib/rulesContent';
import { persistGet, persistSet, persistRemove, isDevMode } from '@/lib/devModePersistence';

/**
 * Dev-only: clears ALL onboarding state (rules, splash, Google prompt)
 * so the developer can re-test the first-time user experience.
 * No effect in production.
 */
export function resetDevOnboarding() {
  if (!isDevMode) return;
  persistRemove(RULES_STORAGE_KEY);
  persistRemove('sirr_google_prompt_dismissed');
  persistRemove('hasSeenSplash');
  try { sessionStorage.removeItem('hasSeenSplash'); } catch { /* ignore */ }
}

function DevResetButton() {
  const handleReset = () => {
    resetDevOnboarding();
    window.location.reload();
  };
  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 left-4 z-[9999] px-3 py-1.5 rounded-lg text-[10px] font-bold opacity-40 hover:opacity-90 transition-opacity font-inter"
      style={{
        background: 'rgba(212,175,55,0.12)',
        border: '1px solid rgba(212,175,55,0.30)',
        color: 'rgba(212,175,55,0.70)',
      }}
      title="Reset all onboarding state (rules, splash, Google prompt) and reload"
    >
      🔄 DEV RESET
    </button>
  );
}

// Shows the Rules & Conditions acceptance screen on first launch.
// Once accepted (persisted via devModePersistence), renders the app normally.
// In dev mode (Preview), acceptance is backed up to a cookie so it survives
// preview rebuilds that may clear localStorage.
export default function RulesGate({ children }) {
  const [accepted, setAccepted] = useState(
    () => persistGet(RULES_STORAGE_KEY) === 'true'
  );

  if (!accepted) {
    return (
      <RulesConditions
        mode="gate"
        onAccept={() => {
          persistSet(RULES_STORAGE_KEY, 'true');
          setAccepted(true);
        }}
      />
    );
  }

  return (
    <>
      {children}
      {isDevMode && <DevResetButton />}
    </>
  );
}