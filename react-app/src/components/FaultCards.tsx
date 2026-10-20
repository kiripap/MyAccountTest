/* ─── Fault cards — matches Figma node 5546:296682 / 5546:296699 / 5546:296713 ─── */
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { Badge } from "@arc-ui/components/Badge";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconSpanner } from "@arc-ui/icons/BtIconSpanner";
import { BtIconLocation } from "@arc-ui/icons/BtIconLocation";
import { BtIconClock } from "@arc-ui/icons/BtIconClock";
import { BtIconAlertTriangle } from "@arc-ui/icons/BtIconAlertTriangle";

import type { ResultsVariant } from "../data/mockData";

const LocationIcon = () => (
  <img src={BtIconLocation} alt="" style={{ width: 20, height: 28, flexShrink: 0 }} />
);

const ClockIcon = () => (
  <img src={BtIconClock} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
);

const WarningTriangle = () => (
  <img src={BtIconAlertTriangle} alt="" style={{ width: 20, height: 20, flexShrink: 0, filter: "brightness(0) invert(1)" }} />
);

function ServiceHeading({ badge }: { badge?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center", flex: 1, minWidth: 0 }}>
        <img src={BtIconBroadband} alt="Broadband" style={{ width: 44, height: 44, flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
          <Heading level="3" size="xs">BT Broadband</Heading>
          <Text size="xs" tone="muted"><strong style={{ letterSpacing: "1.4px", textTransform: "uppercase" }}>Service xx-111</strong></Text>
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
      <Text size="m">12 Kingscliffe Road, Grantham Lincs, NG31 8ET</Text>
    </div>
  );
}

interface FaultCardsProps {
  variant?: ResultsVariant;
  onStartFixing?: () => void;
  onTakeAction?: () => void;
}

export function FaultCards({ variant = "single-card", onStartFixing, onTakeAction }: FaultCardsProps) {
  if (variant === "single-card") {
    return (
      <section aria-label="Faults found">
        <div style={{ marginBottom: 24 }}>
          <h2 className="taf-heading-m">Faults found</h2>
        </div>
        <div className="fault-cards-grid">
          <div className="fault-card results-animate" style={{ background: "#FFE9EC", border: "1px solid #FA9590", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: "0.1s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, flex: 1 }}>
              <ServiceHeading />
              <AddressRow />
              <Text size="m" elementType="p">
                <strong>Broadband keeps dropping.</strong> Your connection has dropped in the last 24 hours. Let&rsquo;s run a few more checks to find out why.
              </Text>
              <div style={{ flex: 1 }} />
              <ButtonV2 label="Start fixing" buttonStyle="primary" isFullWidth icon={BtIconSpanner} iconPosition="beforeText" onClick={onStartFixing} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Faults found">
      <div style={{ marginBottom: 24 }}>
        <h2 className="taf-heading-m">Faults found</h2>
      </div>
      <div className="fault-cards-grid">

        {/* ─── Card 1: Red — network issue ─── */}
        <div className="fault-card results-animate" style={{ background: "#FFE9EC", border: "1px solid #FA9590", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: "0.1s" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, flex: 1 }}>
            <ServiceHeading />
            <AddressRow />
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
              <Text size="m" elementType="p">
                We&rsquo;re experiencing an issue with our network that might be impacting your service(s). We&rsquo;re working hard to fix this.
              </Text>
              <div style={{ display: "flex", gap: 4, alignItems: "center", background: "#FFC8CB", borderRadius: 57, padding: 12, width: "100%" }}>
                <ClockIcon />
                <Text size="s"><strong>Estimated fix date: 11/08/2025</strong></Text>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <ButtonV2 label="Report something else" buttonStyle="primary" isFullWidth />
          </div>
        </div>

        {/* ─── Card 2: Red — offline ─── */}
        <div className="fault-card results-animate" style={{ background: "#FFE9EC", border: "1px solid #FA9590", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: "0.3s" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, flex: 1 }}>
            <ServiceHeading />
            <AddressRow />
            <Text size="m" elementType="p">
              Our checks have found that this service is offline, you need to run further checks to fix this issue.
            </Text>
            <div style={{ flex: 1 }} />
            <ButtonV2 label="Start fixing" buttonStyle="primary" isFullWidth icon={BtIconSpanner} iconPosition="beforeText" onClick={onStartFixing} />
          </div>
        </div>

        {/* ─── Card 3: Amber — open fault ─── */}
        <div className="fault-card results-animate" style={{ background: "#FEF6DE", border: "1px solid #FFA200", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: "0.5s" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center", background: "#FFA200", padding: 8, width: "100%" }}>
            <WarningTriangle />
            <Text size="s"><strong style={{ color: "white" }}>Open fault</strong></Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, flex: 1 }}>
            <ServiceHeading badge={<Badge state="warning">Action needed</Badge>} />
            <AddressRow />
            <Text size="m" elementType="p">
              This fault requires your action in order to progress it.
            </Text>
            <div style={{ flex: 1 }} />
            <ButtonV2 label="Take action" buttonStyle="primary" isFullWidth onClick={onTakeAction} />
          </div>
        </div>

      </div>
    </section>
  );
}
