import { useState, useCallback, useEffect, useRef } from "react";
import { RadioGroup, RadioGroupInput } from "@arc-ui/components/RadioGroup";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";

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

/* ─── Types ─── */
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
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [contentFading, setContentFading] = useState(false);

  const diagTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const diagItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen || phase === "loading") return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, phase, onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setPhase("symptom");
      setSelected("");
      setGuidanceOpen(false);
      setContentFading(false);
    }
  }, [isOpen]);

  // Diagnostics timer — runs when phase is "loading"
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

  // Submit symptom → cross-fade to loading phase
  const handleSubmit = useCallback(() => {
    if (!selected) return;

    if (duplicateFound) {
      onDuplicateFound?.();
      return;
    }

    // Cross-fade: fade out symptom content, then switch phase
    setContentFading(true);
    setTimeout(() => {
      setPhase("loading");
      setContentFading(false);
    }, 250); // matches the CSS fade duration
  }, [selected, duplicateFound, onDuplicateFound]);

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
        padding: "60px 24px 24px",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && phase === "symptom") onClose();
      }}
    >
      <div
        className="modal-dialog-enter"
        role={phase === "loading" ? "alertdialog" : "dialog"}
        aria-modal="true"
        style={{
          background: "white",
          borderRadius: 24,
          padding: 44,
          width: "100%",
          maxWidth: 800,
          position: "relative",
          boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
        }}
      >
        {/* Close button — only in symptom phase */}
        {phase === "symptom" && (
          <button className="modal-close-btn" aria-label="close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        )}

        {/* Content area with cross-fade */}
        <div
          style={{
            opacity: contentFading ? 0 : 1,
            transform: contentFading ? "translateY(8px)" : "translateY(0)",
            transition: `opacity 0.25s var(--motion-ease, cubic-bezier(0.4,0,0.2,1)), transform 0.25s var(--motion-ease, cubic-bezier(0.4,0,0.2,1))`,
          }}
        >
          {phase === "symptom" ? (
            <SymptomContent
              serviceId={serviceId}
              selected={selected}
              setSelected={setSelected}
              guidanceOpen={guidanceOpen}
              setGuidanceOpen={setGuidanceOpen}
              onSubmit={handleSubmit}
            />
          ) : (
            <LoadingContent diagItemsRef={diagItemsRef} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Symptom selection content ─── */
function SymptomContent({
  serviceId,
  selected,
  setSelected,
  guidanceOpen,
  setGuidanceOpen,
  onSubmit,
}: {
  serviceId: string;
  selected: string;
  setSelected: (v: string) => void;
  guidanceOpen: boolean;
  setGuidanceOpen: (v: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ paddingRight: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontSize: 32, fontWeight: 500, lineHeight: "40px", color: "#2A2A2A" }}>
          Select the type of broadband issue you&rsquo;re having
        </h2>
        <p style={{ fontSize: 16, lineHeight: "24px", color: "#2A2A2A" }}>
          Service ID: <strong>{serviceId || "XXX"}</strong>
        </p>
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
        <ButtonV2 label="Run test" buttonStyle="primary" onClick={selected ? onSubmit : undefined} />
      </div>

      <div>
        <hr style={{ border: "none", borderTop: "1px solid #C8C8C8", margin: 0 }} />
        <button
          onClick={() => setGuidanceOpen(!guidanceOpen)}
          style={{
            display: "flex", alignItems: "center", gap: 20, width: "100%",
            padding: "16px 0", background: "none", border: "none", cursor: "pointer",
            fontSize: 20, fontWeight: 500, lineHeight: "26px", color: "#5514B4", textAlign: "left",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
            width: 20, height: 20, flexShrink: 0,
            transform: guidanceOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--motion-duration-normal, 0.3s) var(--motion-ease, cubic-bezier(0.4,0,0.2,1))",
          }}>
            <path d="m6 9 6 6 6-6" />
          </svg>
          Guidance on different issues
        </button>
        <hr style={{ border: "none", borderTop: "1px solid #C8C8C8", margin: 0 }} />
        <div style={{
          display: "grid",
          gridTemplateRows: guidanceOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s var(--motion-ease, cubic-bezier(0.4,0,0.2,1))",
        }}>
          <div style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "16px 0" }}>
              {GUIDANCE.map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#2A2A2A" }}>{item.title}</span>
                  <span style={{ fontSize: 16, lineHeight: "24px", color: "#2A2A2A" }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Loading/diagnostics content ─── */
function LoadingContent({
  diagItemsRef,
}: {
  diagItemsRef: React.RefObject<(HTMLLIElement | null)[]>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="arc-spinner" role="status" aria-label="Running checks" />
        <h2 style={{ fontSize: 32, fontWeight: 500, lineHeight: "40px", color: "#2A2A2A" }}>
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
              ref={(el) => { if (diagItemsRef.current) diagItemsRef.current[i] = el; }}
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
  );
}
