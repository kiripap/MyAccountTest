import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { VisuallyHidden } from "@arc-ui/components/VisuallyHidden";
import { Icon } from "@arc-ui/components/Icon";
import { BtIconArrowLeft } from "@arc-ui/icons/BtIconArrowLeft";
import { BtIconArrowRightFill } from "@arc-ui/icons/BtIconArrowRightFill";
import { BtIconArrowUpFill } from "@arc-ui/icons/BtIconArrowUpFill";

import { BillingPanel, ProductsPanel, TrackingPanel, WelcomePanel } from "./OnboardingPanels";
import { PHASES, transitionDuration, type Phase } from "./phases";
import { OnboardingScene } from "./scene/OnboardingScene";
import { prefersReducedMotion } from "./useCountUp";
import "./onboarding.css";

const PHASE_LABELS: Record<Phase, string> = {
  welcome: "Welcome",
  tracking: "Track your order",
  products: "Making the most out of your products",
  billing: "Billing made simple",
};

/** Delay before the first welcome reveal (the drawer takes ~550ms to open). */
const INTRO_DELAY = 500;
/** Time the outgoing panel takes to fade, at the start of the camera move. */
const PANEL_EXIT_MS = 200;
/** Incoming copy starts revealing at this fraction of the camera move. */
const REVEAL_AT = 0.62;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * First-run onboarding drawer for the My Account dashboard. Slides down from
 * the top of the page and walks the user through four phases while the
 * illustration camera zooms/pans through one continuous scene.
 *
 * Arc has no top-anchored Drawer, so the shell is custom (dialog semantics,
 * focus trap, Esc to close). Everything inside uses Arc components.
 */
export const OnboardingDrawer = ({
  firstName,
  initialPhase = "welcome",
  onClose,
}: OnboardingDrawerProps) => {
  const dialogRef = useRef<HTMLElement>(null);
  const exitTimer = useRef<number | undefined>(undefined);

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [shownPhase, setShownPhase] = useState<Phase>(initialPhase);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [panelDelay, setPanelDelay] = useState(INTRO_DELAY);

  const index = PHASES.indexOf(phase);

  const goTo = useCallback(
    (next: Phase) => {
      if (next === phase) return;
      const revealDelay = Math.max(0, transitionDuration(phase, next) * REVEAL_AT - PANEL_EXIT_MS);
      setPhase(next);

      window.clearTimeout(exitTimer.current);
      const swap = () => {
        setShownPhase(next);
        setPanelDelay(revealDelay);
        setIsLeaving(false);
      };
      if (prefersReducedMotion()) {
        swap();
      } else {
        setIsLeaving(true);
        exitTimer.current = window.setTimeout(swap, PANEL_EXIT_MS);
      }
    },
    [phase],
  );

  const next = useCallback(() => {
    if (index < PHASES.length - 1) goTo(PHASES[index + 1]);
  }, [goTo, index]);

  const prev = useCallback(() => {
    if (index > 0) goTo(PHASES[index - 1]);
  }, [goTo, index]);

  const close = useCallback(() => {
    if (prefersReducedMotion()) onClose();
    else setIsClosing(true);
  }, [onClose]);

  /* Lock page scroll and move focus into the dialog. */
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(exitTimer.current);
      previous?.focus?.();
    };
  }, []);

  /* Buttons swap between phases; keep focus inside the dialog. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.contains(document.activeElement)) dialog.focus();
  }, [shownPhase]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    const target = e.target as HTMLElement;
    const inTabs = target.closest('[role="tablist"]');
    if (!inTabs && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.preventDefault();
      if (e.key === "ArrowRight") next();
      else prev();
      return;
    }

    if (e.key === "Tab" && dialogRef.current) {
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const renderPanel = () => {
    switch (shownPhase) {
      case "welcome":
        return <WelcomePanel firstName={firstName} baseDelay={panelDelay} />;
      case "tracking":
        return <TrackingPanel />;
      case "products":
        return <ProductsPanel />;
      case "billing":
        return <BillingPanel />;
    }
  };

  const renderFooter = () => {
    if (phase === "welcome") {
      return (
        <div className="ob-footer-wide">
          <ButtonV2 label="Start tour" isFullWidth onClick={next} />
        </div>
      );
    }
    const back = (
      <button type="button" className="ob-nav-btn ob-nav-btn--back" aria-label="Previous step" onClick={prev}>
        <Icon icon={BtIconArrowLeft} size={48} />
      </button>
    );
    if (phase === "billing") {
      return (
        <div className="ob-footer-row">
          {back}
          <div className="ob-footer-wide">
            <ButtonV2 label="End tour" buttonStyle="secondary" isFullWidth onClick={close} />
          </div>
        </div>
      );
    }
    return (
      <div className="ob-footer-row" role="group" aria-label="Tour navigation">
        {back}
        <button type="button" className="ob-nav-btn ob-nav-btn--next" aria-label="Next step" onClick={next}>
          <Icon icon={BtIconArrowRightFill} size={48} />
        </button>
      </div>
    );
  };

  return (
    <div className={`ob-overlay${isClosing ? " is-closing" : ""}`} onClick={close}>
      <section
        ref={dialogRef}
        className="ob-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to your BT Business account"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={(e) => {
          if (isClosing && e.target === e.currentTarget) onClose();
        }}
      >
        <div className="ob-drawer-inner">
          <div className="ob-content">
            <div
              key={shownPhase}
              className={`ob-panel-wrap${isLeaving ? " is-leaving" : ""}`}
              style={{ "--ob-delay": `${panelDelay}ms` } as CSSProperties}
            >
              {renderPanel()}
            </div>
            {/* Navigation stays put while copy transitions */}
            <div className="ob-footer">{renderFooter()}</div>
          </div>

          {/* One persistent Three.js world; the camera moves, nothing is swapped.
              The stage keeps a fixed aspect ratio so the scene always looks the same. */}
          <div className="ob-illustration">
            <div className="ob-illustration-stage">
              <OnboardingScene phase={phase} />
            </div>
          </div>
        </div>

        <ol className="ob-dots" aria-hidden="true">
          {PHASES.map((p) => (
            <li key={p} className={p === phase ? "is-active" : undefined} />
          ))}
        </ol>
        <VisuallyHidden>
          <span aria-live="polite">
            Step {index + 1} of {PHASES.length}: {PHASE_LABELS[phase]}
          </span>
        </VisuallyHidden>

        <div className="ob-close">
          <button type="button" className="ob-close-btn" aria-label="Close tour" onClick={close}>
            <Icon icon={BtIconArrowUpFill} size={44} />
          </button>
        </div>
      </section>
    </div>
  );
};

interface OnboardingDrawerProps {
  /**
   * Customer's first name for the welcome greeting.
   */
  firstName: string;
  /**
   * Phase to open on. Defaults to `welcome`; other phases are for review/dev links.
   */
  initialPhase?: Phase;
  /**
   * Called once the drawer has finished closing.
   */
  onClose: () => void;
}
