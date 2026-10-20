import { Alert } from "@arc-ui/components/Alert";
import { Badge } from "@arc-ui/components/Badge";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Text } from "@arc-ui/components/Text";
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsLink } from "@arc-ui/components/Breadcrumbs";
import { BtIconQuestion } from "@arc-ui/icons/BtIconQuestion";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";

import type { Scenario, ScenarioData, CheckResult } from "../data/mockData";
import { RESULT_SCENARIOS } from "../data/mockData";

/* ── Check result row icon (raw 24px arc icon, no border wrapper) ── */
function CheckIcon({ state }: { state: CheckResult["state"] }) {
  if (state === "pass") {
    return (
      <div
        style={{
          width: 24,
          height: 24,
          flexShrink: 0,
          backgroundColor: "var(--icon-color-status-success-light, #088003)",
          maskImage: "var(--comp-alert-success)",
          WebkitMaskImage: "var(--comp-alert-success)",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
        aria-label="Pass"
      />
    );
  }
  return (
    <div
      style={{
        width: 24,
        height: 24,
        flexShrink: 0,
        backgroundColor: state === "issue" ? "var(--icon-color-status-error-light, #da020f)" : "var(--sem-color-border-secondary-light-default, #6B6B6B)",
        maskImage: "var(--comp-alert-error)",
        WebkitMaskImage: "var(--comp-alert-error)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
      aria-label={state === "issue" ? "Issue" : "Unavailable"}
    />
  );
}

/* ── Badge for each check result ── */
function CheckBadge({ state }: { state: CheckResult["state"] }) {
  if (state === "pass") return <Badge state="success">Pass</Badge>;
  if (state === "issue") return <Badge state="error">Issue found</Badge>;
  return <Badge state="default">Check unavailable</Badge>;
}

/* ── Scenario-specific CTA buttons (from Figma) ── */
function ResultActions({
  scenario,
  onContinueFault,
  onViewHelp,
  onBookEngineer,
}: {
  scenario: Scenario;
  onContinueFault?: () => void;
  onViewHelp?: () => void;
  onBookEngineer?: () => void;
}) {
  // Figma specifies different CTA layouts per scenario
  if (scenario === "no-faults") {
    return (
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <ButtonV2 label="View help" buttonStyle="primary" icon={BtIconQuestion} onClick={onViewHelp} />
        <ButtonV2 label="Continue reporting" buttonStyle="secondary" icon={BtIconArrowRight} iconPosition="afterText" onClick={onContinueFault} />
      </div>
    );
  }
  if (scenario === "engineer") {
    return (
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <ButtonV2 label="Book engineer" buttonStyle="primary" icon={BtIconArrowRight} iconPosition="afterText" onClick={onBookEngineer} />
      </div>
    );
  }
  // internal-checks
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <ButtonV2 label="View help" buttonStyle="primary" icon={BtIconQuestion} onClick={onViewHelp} />
      <ButtonV2 label="Continue with fault" buttonStyle="secondary" icon={BtIconArrowRight} iconPosition="afterText" onClick={onContinueFault} />
    </div>
  );
}

/* ═══ Page component ═══ */
interface TestResultsPageProps {
  scenario: Scenario;
  serviceId?: string;
  serviceAddr?: string;
  onViewHelp?: () => void;
  onContinueFault?: () => void;
  onIssueResolved?: () => void;
  onBookEngineer?: () => void;
  onBack?: () => void;
}

export function TestResultsPage({
  scenario,
  serviceId = "01168222981",
  serviceAddr = "12 Kingscliffe Road, NG31 8ET",
  onViewHelp,
  onContinueFault,
  onBookEngineer,
  onBack,
}: TestResultsPageProps) {
  const data: ScenarioData = RESULT_SCENARIOS[scenario];

  return (
    <div className="container bleed" style={{ paddingBottom: 64 }}>
      {/* Hero header: breadcrumbs + heading + service info */}
      <div className="hero-header">
        <Breadcrumbs>
          <BreadcrumbsItem spacerIconAfter>
            <BreadcrumbsLink href="#">Dashboard</BreadcrumbsLink>
          </BreadcrumbsItem>
          <BreadcrumbsItem spacerIconAfter>
            <BreadcrumbsLink href="#faults" onClick={() => { onBack?.(); }}>Faults</BreadcrumbsLink>
          </BreadcrumbsItem>
          <BreadcrumbsItem>
            <BreadcrumbsLink isActive>Test results</BreadcrumbsLink>
          </BreadcrumbsItem>
        </Breadcrumbs>

        <div className="hero-header-text">
          <h1 className="hero-h1-40">Your test results</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Text size="m"><Text size="m" isInline>Service ID:</Text> <Text size="m" isInline><strong>{serviceId}</strong></Text></Text>
            <Text size="m"><Text size="m" isInline>Location:</Text> <Text size="m" isInline><strong>{serviceAddr}</strong></Text></Text>
          </div>
        </div>
      </div>

      {/* Result summary (56px gap from heading via hero-header padding-bottom) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Arc Alert — animates in first */}
        <div className="results-animate results-alert-animate">
          <Alert
            heading={data.alertHeading}
            headingLevel="3"
            description={data.alertDescription}
            status={data.alertStatus}
            isMeasured
          />
        </div>

        {/* Check results list — each row staggers in after the alert */}
        <div
          className="results-animate results-row-animate"
          style={{
            border: "1px solid #D9D9D9",
            borderRadius: 16,
            overflow: "hidden",
            animationDelay: "0.35s",
          }}
        >
          {data.results.map((result, i) => (
            <div
              key={i}
              className="results-animate results-row-animate"
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: i < data.results.length - 1 ? "1px solid #D9D9D9" : "none",
                background: "white",
                animationDelay: `${0.45 + i * 0.12}s`,
              }}
            >
              <CheckIcon state={result.state} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <Text size="m"><strong>{result.name}</strong></Text>
                <Text size="s" tone="muted">{result.detail}</Text>
              </div>
              <CheckBadge state={result.state} />
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons (16px gap from results, scenario-specific) */}
      <div
        className="results-animate results-row-animate"
        style={{ marginTop: 32, animationDelay: "1s" }}
      >
        <ResultActions
          scenario={scenario}
          onContinueFault={onContinueFault}
          onViewHelp={onViewHelp}
          onBookEngineer={onBookEngineer}
        />
      </div>
    </div>
  );
}
