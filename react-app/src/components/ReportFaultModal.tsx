import { useState, useCallback, useEffect, useRef } from "react";
import { RadioGroup, RadioGroupInput } from "@arc-ui/components/RadioGroup";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { Spinner } from "@arc-ui/components/Spinner";
import { Rule } from "@arc-ui/components/Rule";
import { Disclosure } from "@arc-ui/components/Disclosure";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";

/* ─── Data ─── */
const SYMPTOMS = [
  { id: "no-connection", label: "No connection", value: "No connection" },
  { id: "slow-speeds", label: "Slow speeds", value: "Slow speeds" },
  { id: "connection-drops", label: "Connection drops", value: "Connection drops" },
  { id: "no-websites", label: "No access to websites", value: "No access to websites" },
  { id: "other-products", label: "Other products", value: "Other products" },
  { id: "email-issues", label: "Email issues", value: "Email issues" },
];

const GUIDANCE = [
  { title: "No connection", desc: "Can\u2019t connect to the internet." },
  { title: "Connection drops", desc: "I\u2019m connected to my broadband service however my connection is dropping sometimes." },
  { title: "Slow Speeds", desc: "My broadband connection is running slower than I would expect." },
  { title: "No access to websites", desc: "My email is working but I can\u2019t see web pages." },
  { title: "Email", desc: "I have a problem with my email, for example, issues with login, reset password, sending/receiving emails." },
  { title: "Other products", desc: "Issues with add-on products such as MS Office applications, Static IP, Webhosting & Domain issues, BT Sport, BT eshop, PC Security & Backup and Music for Business issues." },
];

const DIAG_ITEMS = [
  "Major service outages...",
  "Your broadband connection...",
  "Your internal wiring...",
  "The external network...",
];

type Phase = "symptom" | "loading";

interface ReportFaultModalProps {
  isOpen: boolean;
  serviceId: string;
  diagnosticsDelayMs: number;
  onClose: () => void;
  onDiagnosticsComplete: () => void;
  onDuplicateFound?: () => void;
  duplicateFound?: boolean;
}

export function ReportFaultModal({
  isOpen,
  serviceId,
  diagnosticsDelayMs,
  onClose,
  onDiagnosticsComplete,
  onDuplicateFound,
  duplicateFound,
}: ReportFaultModalProps) {
  const [phase, setPhase] = useState<Phase>("symptom");
  const [selected, setSelected] = useState("");
  const [contentFading, setContentFading] = useState(false);

  const diagTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const diagItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || phase === "loading") return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, phase, onClose]);

  useEffect(() => {
    if (isOpen) {
      setPhase("symptom");
      setSelected("");
      setContentFading(false);
    }
  }, [isOpen]);

  // Diagnostics timer
  useEffect(() => {
    if (phase !== "loading") return;

    diagTimersRef.current.forEach(clearTimeout);
    diagTimersRef.current = [];
    diagItemsRef.current.forEach((el) => el?.classList.remove("revealed"));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealWindow = diagnosticsDelayMs - 800;
    const interval = revealWindow / DIAG_ITEMS.length;

    DIAG_ITEMS.forEach((_, i) => {
      const t = interval * (i + 1);
      diagTimersRef.current.push(
        setTimeout(() => {
          diagItemsRef.current[i]?.classList.add("revealed");
        }, reduceMotion ? 0 : t)
      );
    });

    diagTimersRef.current.push(
      setTimeout(onDiagnosticsComplete, diagnosticsDelayMs)
    );

    return () => {
      diagTimersRef.current.forEach(clearTimeout);
      diagTimersRef.current = [];
    };
  }, [phase, diagnosticsDelayMs, onDiagnosticsComplete]);

  const handleSubmit = useCallback(() => {
    if (!selected) return;
    if (duplicateFound) { onDuplicateFound?.(); return; }
    setContentFading(true);
    setTimeout(() => { setPhase("loading"); setContentFading(false); }, 250);
  }, [selected, duplicateFound, onDuplicateFound]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay-enter"
      style={{
        position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "60px 24px 24px", overflowY: "auto",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && phase === "symptom") onClose(); }}
    >
      <div
        className="modal-dialog-enter"
        role={phase === "loading" ? "alertdialog" : "dialog"}
        aria-modal="true"
        style={{
          background: "white", borderRadius: 24, padding: 44, width: "100%", maxWidth: 800,
          position: "relative", boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
        }}
      >
        {phase === "symptom" && (
          <button
            aria-label="close"
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12, width: 40, height: 40,
              background: "none", border: "none", cursor: "pointer", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        )}

        <div
          style={{
            opacity: contentFading ? 0 : 1,
            transform: contentFading ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
        {phase === "symptom" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ paddingRight: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <Heading level="2" size="m" isResponsive={false}>
                Select the type of broadband issue you&rsquo;re having
              </Heading>
              <Text size="m" elementType="p">Service ID: <strong>{serviceId || "XXX"}</strong></Text>
            </div>

            <RadioGroup
              id="symptom-group"
              label="Select the symptom you're experiencing"
              name="symptom"
              size="s"
              checkedValue={selected}
              onChange={(e) => setSelected((e.target as HTMLInputElement).value)}
            >
              {SYMPTOMS.map((s) => (
                <RadioGroupInput key={s.id} id={s.id} label={s.label} value={s.value} />
              ))}
            </RadioGroup>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <ButtonV2 label="Run test" buttonStyle="primary" onClick={selected ? handleSubmit : undefined} />
            </div>

            <Disclosure summary="Guidance on different issues" headingLevel="3">
              <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "8px 0" }}>
                {GUIDANCE.map((item, i) => (
                  <div key={i}>
                    <Text size="m"><strong>{item.title}</strong></Text>
                    <Text size="m" elementType="p">{item.desc}</Text>
                  </div>
                ))}
              </div>
            </Disclosure>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Spinner size="s" />
              <Heading level="2" size="m" isResponsive={false}>We&rsquo;re running further checks</Heading>
            </div>
            <div aria-live="polite">
              <Text size="m"><strong>We&rsquo;re checking:</strong></Text>
              <VerticalSpace size="16" />
              <ul className="diag-list">
                {DIAG_ITEMS.map((label, i) => (
                  <li
                    key={i}
                    className="diag-item"
                    ref={(el) => { if (diagItemsRef.current) diagItemsRef.current[i] = el; }}
                  >
                    <Text size="m">{label}</Text>
                  </li>
                ))}
              </ul>
              <VerticalSpace size="24" />
              <Rule />
              <VerticalSpace size="24" />
              <Text size="s" tone="muted" elementType="p">
                This can take a couple of minutes. Please keep this page open while we complete the checks.
              </Text>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
