import { useState, useCallback, useEffect } from "react";
import { RadioGroup, RadioGroupInput } from "@arc-ui/components/RadioGroup";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";

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

interface SymptomModalProps {
  isOpen: boolean;
  serviceId: string;
  onClose: () => void;
  onSubmit: (symptom: string) => void;
}

export function SymptomModal({ isOpen, serviceId, onClose, onSubmit }: SymptomModalProps) {
  const [selected, setSelected] = useState<string>("");
  const [guidanceOpen, setGuidanceOpen] = useState(false);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) { setSelected(""); setGuidanceOpen(false); }
  }, [isOpen]);

  const handleSubmit = useCallback(() => {
    if (selected) onSubmit(selected);
  }, [selected, onSubmit]);

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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-dialog-enter"
        role="dialog"
        aria-modal="true"
        aria-labelledby="symptomHeading"
        style={{
          background: "white",
          borderRadius: 24,
          padding: 44,
          width: "100%",
          maxWidth: 800,
          position: "relative",
          boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Close button */}
        <button className="modal-close-btn" aria-label="close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Title */}
        <div style={{ paddingRight: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 id="symptomHeading" style={{ fontSize: 32, fontWeight: 500, lineHeight: "40px", color: "#2A2A2A" }}>
            Select the type of broadband issue you&rsquo;re having
          </h2>
          <p style={{ fontSize: 16, lineHeight: "24px", color: "#2A2A2A" }}>
            Service ID: <strong>{serviceId || "XXX"}</strong>
          </p>
        </div>

        {/* Radio group */}
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

        {/* CTA — above the disclosure */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonV2 label="Run test" buttonStyle="primary" onClick={selected ? handleSubmit : undefined} />
        </div>

        {/* Disclosure with animated expand/collapse */}
        <div>
          <hr style={{ border: "none", borderTop: "1px solid #C8C8C8", margin: 0 }} />
          <button
            onClick={() => setGuidanceOpen(!guidanceOpen)}
            style={{
              display: "flex", alignItems: "center", gap: 20,
              width: "100%", padding: "16px 0", background: "none", border: "none",
              cursor: "pointer", fontSize: 20, fontWeight: 500, lineHeight: "26px",
              color: "#5514B4", textAlign: "left",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                width: 20, height: 20, flexShrink: 0,
                transform: guidanceOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s var(--motion-ease, cubic-bezier(0.4, 0, 0.2, 1))",
              }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            Guidance on different issues
          </button>
          <hr style={{ border: "none", borderTop: "1px solid #C8C8C8", margin: 0 }} />

          {/* Animated content area */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: guidanceOpen ? "1fr" : "0fr",
              transition: "grid-template-rows 0.35s var(--motion-ease, cubic-bezier(0.4, 0, 0.2, 1))",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "16px 0" }}>
                {GUIDANCE.map((item, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#2A2A2A" }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: 16, lineHeight: "24px", color: "#2A2A2A" }}>
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
