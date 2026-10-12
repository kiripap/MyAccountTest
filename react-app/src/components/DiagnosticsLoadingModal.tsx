import { useEffect, useRef } from "react";

const DIAG_ITEMS = [
  "Major service outages...",
  "Your broadband connection...",
  "Your internal wiring...",
  "The external network...",
];

interface DiagnosticsLoadingModalProps {
  isOpen: boolean;
  delayMs: number;
  onComplete: () => void;
}

export function DiagnosticsLoadingModal({ isOpen, delayMs, onComplete }: DiagnosticsLoadingModalProps) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    itemsRef.current.forEach((el) => el?.classList.remove("revealed"));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealWindow = delayMs - 800;
    const interval = revealWindow / DIAG_ITEMS.length;

    DIAG_ITEMS.forEach((_, i) => {
      const t = interval * (i + 1);
      const timer = setTimeout(() => {
        itemsRef.current[i]?.classList.add("revealed");
      }, reduceMotion ? 0 : t);
      timersRef.current.push(timer);
    });

    const completeTimer = setTimeout(onComplete, delayMs);
    timersRef.current.push(completeTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isOpen, delayMs, onComplete]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay-enter"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px 24px 24px",
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog-enter"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="diagHeading"
        style={{
          background: "white",
          borderRadius: 24,
          padding: 44,
          width: "100%",
          maxWidth: 640,
          position: "relative",
          boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="arc-spinner" role="status" aria-label="Running checks" />
          <h2 id="diagHeading" style={{ fontSize: 32, fontWeight: 500, lineHeight: "40px", color: "#2A2A2A" }}>
            We&rsquo;re running further checks
          </h2>
        </div>

        <div aria-live="polite">
          <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, color: "#2A2A2A" }}>
            We&rsquo;re checking:
          </p>
          <ul className="diag-list">
            {DIAG_ITEMS.map((label, i) => (
              <li
                key={i}
                className="diag-item"
                ref={(el) => { itemsRef.current[i] = el; }}
              >
                {label}
              </li>
            ))}
          </ul>
          <hr style={{ border: "none", borderTop: "1px solid #C8C8C8", margin: "24px 0" }} />
          <p style={{ fontSize: 14, lineHeight: "20px", color: "#434343" }}>
            This can take a couple of minutes. Please keep this page open while we complete the checks.
          </p>
        </div>
      </div>
    </div>
  );
}
