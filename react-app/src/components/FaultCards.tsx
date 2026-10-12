/* ─── Fault cards — matches Figma node 5546:296682 / 5546:296699 / 5546:296713 ─── */
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconSpanner } from "@arc-ui/icons/BtIconSpanner";

const LocationIcon = () => (
  <svg viewBox="0 0 20 28" fill="none" stroke="#2A2A2A" strokeWidth="1.5" style={{ width: 20, height: 28, flexShrink: 0 }}>
    <path d="M10 26s-9-6-9-14a9 9 0 0 1 18 0c0 8-9 14-9 14Z" />
    <circle cx="10" cy="12" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="#2A2A2A" strokeWidth="1.5" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <circle cx="10" cy="10" r="8.5" />
    <path d="M10 5v5l3.5 1.75" />
  </svg>
);

const WarningTriangle = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <path d="M8.575 3.494 1.326 15.747a1.667 1.667 0 0 0 1.425 2.503h14.498a1.667 1.667 0 0 0 1.425-2.503L11.425 3.494a1.667 1.667 0 0 0-2.85 0Z" />
    <path d="M10 7.5v3.333" /><path d="M10 14.167h.008" />
  </svg>
);

function ServiceHeading({ badge }: { badge?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center", flex: 1, minWidth: 0 }}>
        <img src={BtIconBroadband} alt="Broadband" style={{ width: 44, height: 44, flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 500, lineHeight: "28px", color: "#2A2A2A" }}>BT Broadband</span>
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "16px", letterSpacing: "1.4px", textTransform: "uppercase" as const, color: "#434343" }}>Service xx-111</span>
        </div>
      </div>
      {badge}
    </div>
  );
}

function AddressRow() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.4)", borderRadius: 16, padding: "12px 16px", width: "100%" }}>
      <LocationIcon />
      <span style={{ fontSize: 16, lineHeight: "24px", color: "#434343", flex: 1, minWidth: 0 }}>
        12 Kingscliffe Road, Grantham Lincs, NG31 8ET
      </span>
    </div>
  );
}

interface FaultCardsProps {
  onStartFixing?: () => void;
  onTakeAction?: () => void;
}

export function FaultCards({ onStartFixing, onTakeAction }: FaultCardsProps) {
  return (
    <section aria-label="Faults found">
      <h2 className="section-title">Faults found</h2>
      <div className="fault-cards-grid">

        {/* ─── Card 1: Red — network issue (tallest card, has estimate pill) ─── */}
        <div className="fault-card results-animate" style={{ background: "#FFE9EC", border: "1px solid #FA9590", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: "0.1s" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, flex: 1 }}>
            <ServiceHeading />
            <AddressRow />
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
              <p style={{ fontSize: 16, lineHeight: "24px", color: "#434343" }}>
                We&rsquo;re experiencing an issue with our network that might be impacting your service(s). We&rsquo;re working hard to fix this.
              </p>
              <div style={{ display: "flex", gap: 4, alignItems: "center", background: "#FFC8CB", borderRadius: 57, padding: 12, width: "100%" }}>
                <ClockIcon />
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "#2A2A2A" }}>
                  Estimated fix date: 11/08/2025
                </span>
              </div>
            </div>
            {/* flex: 1 on this spacer absorbs extra height when grid stretches cards */}
            <div style={{ flex: 1 }} />
            <ButtonV2 label="Report something else" buttonStyle="primary" isFullWidth />
          </div>
        </div>

        {/* ─── Card 2: Red — offline ─── */}
        <div className="fault-card results-animate" style={{ background: "#FFE9EC", border: "1px solid #FA9590", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: "0.3s" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, flex: 1 }}>
            <ServiceHeading />
            <AddressRow />
            <p style={{ fontSize: 16, lineHeight: "24px", color: "#434343" }}>
              Our checks have found that this service is offline, you need to run further checks to fix this issue.
            </p>
            {/* Spacer pushes CTA to bottom, matching tallest card */}
            <div style={{ flex: 1 }} />
            <ButtonV2 label="Start fixing" buttonStyle="primary" isFullWidth icon={BtIconSpanner} iconPosition="beforeText" onClick={onStartFixing} />
          </div>
        </div>

        {/* ─── Card 3: Amber — open fault ─── */}
        <div className="fault-card results-animate" style={{ background: "#FEF6DE", border: "1px solid #FFA200", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: "0.5s" }}>
          {/* Open fault banner */}
          <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center", background: "#FFA200", padding: 8, width: "100%" }}>
            <WarningTriangle />
            <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "white" }}>Open fault</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, flex: 1 }}>
            <ServiceHeading
              badge={
                <div style={{ background: "#FFA200", borderRadius: 1000, padding: "0 8px", height: 24, display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, lineHeight: "12px", color: "white", whiteSpace: "nowrap" }}>Action needed</span>
                </div>
              }
            />
            <AddressRow />
            <p style={{ fontSize: 16, lineHeight: "24px", color: "#434343" }}>
              This fault requires your action in order to progress it.
            </p>
            {/* Spacer pushes CTA to bottom */}
            <div style={{ flex: 1 }} />
            <ButtonV2 label="Take action" buttonStyle="primary" isFullWidth onClick={onTakeAction} />
          </div>
        </div>

      </div>
    </section>
  );
}
