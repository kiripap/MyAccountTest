import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";

interface DuplicateViewProps {
  serviceId: string;
  onBack: () => void;
  onViewResult: () => void;
}

const BroadbandIcon = () => (
  <svg className="row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path d="M3.6 9h16.8" />
    <path d="M3.6 15h16.8" />
    <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
);

const ChevronRight = () => (
  <svg className="crumb-sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export function DuplicateView({ serviceId, onBack, onViewResult }: DuplicateViewProps) {
  return (
    <div className="container bleed">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <span className="crumb" onClick={onBack}>Faults</span>
        <ChevronRight />
        <span className="crumb current">Recent test found</span>
      </nav>

      <div className="page-header taf-header">
        <h1>You&rsquo;ve already run a test on this service</h1>
      </div>

      <main className="main journey-main">
        <div className="journey-panel">
          <div className="journey-service-chip">
            <BroadbandIcon />
            <span className="chip-text">
              <strong>BT Broadband</strong> &middot; {serviceId}
            </span>
          </div>

          <div className="info-row">
            <InfoIcon />
            <div>
              <p className="info-strong">
                Previous test completed: <strong>Today at 09:42</strong>
              </p>
              <p className="info-muted">
                We ran a full set of checks on this service recently. To avoid putting extra load on the
                line, we don&rsquo;t run another test straight away &mdash; the earlier result is still valid.
              </p>
            </div>
          </div>

          <div className="journey-actions">
            <ButtonV2 label="Back to Repairs" buttonStyle="secondary" onClick={onBack} />
            <ButtonV2 label="View existing result" buttonStyle="primary" icon={BtIconArrowRight} onClick={onViewResult} />
          </div>
        </div>
      </main>
    </div>
  );
}
