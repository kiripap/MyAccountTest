import { useState, useCallback, useEffect } from "react";
import { RadioGroup, RadioGroupInput } from "@arc-ui/components/RadioGroup";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { Rule } from "@arc-ui/components/Rule";
import { Disclosure } from "@arc-ui/components/Disclosure";

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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) { setSelected(""); }
  }, [isOpen]);

  const handleSubmit = useCallback(() => {
    if (selected) onSubmit(selected);
  }, [selected, onSubmit]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "60px 24px 24px", overflowY: "auto",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          background: "white", borderRadius: 24, padding: 44, width: "100%", maxWidth: 800,
          position: "relative", boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
          display: "flex", flexDirection: "column", gap: 24,
        }}
      >
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

        <div style={{ paddingRight: 16 }}>
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

        <Rule />
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
    </div>
  );
}
