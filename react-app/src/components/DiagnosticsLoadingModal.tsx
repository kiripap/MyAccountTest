import { useEffect, useRef } from "react";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { Spinner } from "@arc-ui/components/Spinner";
import { Rule } from "@arc-ui/components/Rule";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";

const DIAG_ITEMS = [
  "Service status",
  "The external network",
  "Your broadband connection",
  "Internal wiring",
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
    document.body.style.overflow = isOpen ? "hidden" : "";
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
      timersRef.current.push(setTimeout(() => {
        itemsRef.current[i]?.classList.add("revealed");
      }, reduceMotion ? 0 : t));
    });

    timersRef.current.push(setTimeout(onComplete, delayMs));
    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, [isOpen, delayMs, onComplete]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "80px 24px 24px", overflowY: "auto",
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        style={{
          background: "white", borderRadius: 24, padding: 44, width: "100%", maxWidth: 640,
          position: "relative", boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
          display: "flex", flexDirection: "column", gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Spinner size="s" />
          <Heading level="2" size="m" isResponsive={false}>Running broadband tests</Heading>
        </div>

        <div aria-live="polite">
          <Text size="m"><strong>We&rsquo;re checking what might be causing the issue:</strong></Text>
          <VerticalSpace size="16" />
          <ul className="diag-list">
            {DIAG_ITEMS.map((label, i) => (
              <li key={i} className="diag-item" ref={(el) => { itemsRef.current[i] = el; }}>
                <Text size="m">{label}</Text>
              </li>
            ))}
          </ul>
          <VerticalSpace size="24" />
          <Rule />
          <VerticalSpace size="24" />
          <Text size="s" tone="muted" elementType="p">
            This may take a few minutes. Keep this page open to view your results.
          </Text>
        </div>
      </div>
    </div>
  );
}
