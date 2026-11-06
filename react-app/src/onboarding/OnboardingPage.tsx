import { useState } from "react";

import { ButtonV2 } from "@arc-ui/components/ButtonV2";

import { OnboardingDrawer } from "./OnboardingDrawer";
import { PHASES, type Phase } from "./phases";

/** Supports review links like `#onboarding/products`. */
const phaseFromHash = (): Phase => {
  const requested = window.location.hash.split("/")[1] as Phase | undefined;
  return requested && PHASES.includes(requested) ? requested : "welcome";
};

/**
 * My Account dashboard placeholder with the first-run onboarding drawer.
 * The dashboard itself is intentionally blank for now.
 */
export const OnboardingPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [run, setRun] = useState(0);
  const [initialPhase] = useState(phaseFromHash);

  return (
    <main className="ob-dashboard" aria-label="My Account dashboard">
      {!isOpen && (
        <div className="ob-dashboard-replay">
          <ButtonV2
            label="Replay onboarding tour"
            buttonStyle="secondary"
            onClick={() => {
              setRun((r) => r + 1);
              setIsOpen(true);
            }}
          />
        </div>
      )}
      {isOpen && (
        <OnboardingDrawer
          key={run}
          firstName="Kiriakos"
          initialPhase={run === 0 ? initialPhase : "welcome"}
          onClose={() => setIsOpen(false)}
        />
      )}
    </main>
  );
};
