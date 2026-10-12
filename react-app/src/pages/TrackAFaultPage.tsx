import { tafRelatedRows } from "../data/mockData";
import type { TafRelatedRow } from "../data/mockData";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Badge } from "@arc-ui/components/Badge";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconPhone } from "@arc-ui/icons/BtIconPhone";

interface TrackAFaultPageProps {
  onBack: () => void;
}

/* ─── Inline icons ─── */
const ChevronRight = () => (
  <svg className="crumb-sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const WarningTriangle = () => (
  <svg className="taf-alert-icon" viewBox="0 0 24 24" fill="none" stroke="#FFA200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const EditIcon = () => (
  <svg className="taf-edit" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

/* ─── Stepper ─── */
const STEPS = [
  { title: "Fault report in progress", date: "08/05/2026", desc: "Complete your fault report so we can start investigating the issue.", active: true },
  { title: "Fault opened", desc: "We\u2019re investigating your fault." },
  { title: "We\u2019ve identified a fix", desc: "We\u2019re applying the fix and monitoring progress to restore your service." },
  { title: "Fault fixed", desc: "Your fault has been fixed. Check your service and let us know if you still need help." },
  { title: "Fault closed", date: "18/05/2026 (est.)", last: true },
];

/* ─── FAQ items ─── */
const FAQS = [
  { q: "How do I track the progress of a fault?", a: "You can track your fault anytime from this page. We\u2019ll update the progress tracker as your fault moves through each stage, and notify you when action is needed." },
  { q: "What does \u2018Action needed\u2019 mean?", a: "\u2018Action needed\u2019 means we need something from you before we can continue \u2014 for example, finishing your fault report or confirming an appointment." },
  { q: "What happens if my service still isn\u2019t working but the fault has been closed?", a: "If your service still isn\u2019t working after a fault is closed, you can reopen it or report a new fault and we\u2019ll investigate again." },
];

function TafStatusBadge({ status }: { status: TafRelatedRow["status"] }) {
  if (status === "In progress") return <Badge state="default">In progress</Badge>;
  return <Badge state="warning">Action needed</Badge>;
}

/* ─── Arc product icon (Broadband/Phone) ─── */
const TafProductIcon = ({ type }: { type: TafRelatedRow["type"] }) => (
  <img
    src={type === "Broadband" ? BtIconBroadband : BtIconPhone}
    alt={type}
    style={{ width: 32, height: 32, flexShrink: 0 }}
  />
);

/* ─── Mobile / tablet tile card for "Track a different fault" ─── */
function TafFaultTile({ row }: { row: TafRelatedRow }) {
  const ctaLabel = row.status === "In progress" ? "View progress" : "Take action";
  return (
    <div className="taf-fault-tile">
      <div className="taf-fault-tile-top">
        <div className="taf-fault-tile-icon">
          <TafProductIcon type={row.type} />
        </div>
        <div className="taf-fault-tile-ref">
          <span className="taf-fault-tile-ref-label">Fault reference</span>
          <span className="taf-fault-tile-ref-value">{row.ref}</span>
        </div>
        <TafStatusBadge status={row.status} />
      </div>
      <hr className="taf-fault-tile-rule" />
      <div className="taf-fault-tile-rows">
        <div className="taf-fault-tile-row">
          <span className="taf-fault-tile-row-label">Product</span>
          <span className="taf-fault-tile-row-value">{row.type}</span>
        </div>
        <div className="taf-fault-tile-row">
          <span className="taf-fault-tile-row-label">Service ID</span>
          <span className="taf-fault-tile-row-value">{row.id}</span>
        </div>
        <div className="taf-fault-tile-row">
          <span className="taf-fault-tile-row-label">Reported on</span>
          <span className="taf-fault-tile-row-value">{row.reported}</span>
        </div>
      </div>
      <ButtonV2 label={ctaLabel} buttonStyle="primary" isFullWidth />
    </div>
  );
}

export function TrackAFaultPage({ onBack }: TrackAFaultPageProps) {
  return (
    <>
      <div className="container bleed">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <span className="crumb" onClick={onBack}>Dashboard</span>
          <ChevronRight />
          <span className="crumb" onClick={onBack}>Faults</span>
          <ChevronRight />
          <span className="crumb current">Track a fault</span>
        </nav>

        <div className="page-header taf-header">
          <h1>Fault progress</h1>
          <p className="taf-subhead">
            <span>Fault reference: <strong>1-108617949</strong></span>
            <span className="sep">|</span>
            <span>Service ID: <strong>1-108617949</strong></span>
            <span className="sep">|</span>
            <span>Product: <strong>Broadband</strong></span>
          </p>
        </div>

        <main className="main">
          {/* Two-column layout */}
          <div className="taf-grid">
            {/* Action needed (right sidebar on L+, first on mobile) */}
            <div className="taf-alert-card taf-grid-alert results-animate results-row-animate" style={{ animationDelay: "0.1s" }}>
                <div className="taf-alert-content">
                  <div className="taf-alert-head">
                    <WarningTriangle />
                    <span className="taf-alert-title">Action needed</span>
                  </div>
                  <p className="taf-alert-body">
                    You&rsquo;ve started reporting a fault but haven&rsquo;t finished yet. Please continue
                    your report so we can start fixing the issue.
                  </p>
                </div>
                <div className="taf-alert-ctas">
                  <ButtonV2 label="Resume reporting" buttonStyle="primary" isFullWidth />
                  <ButtonV2 label="Cancel fault" buttonStyle="secondary" isFullWidth />
                </div>
            </div>

            {/* LEFT: Progress / timeline card */}
            <div className="taf-progress-card taf-grid-progress results-animate results-row-animate" style={{ animationDelay: "0.25s" }}>
              <div className="taf-progress-top">
                <span className="taf-estimate">
                  Estimated fix date: <strong>Monday 18th May</strong>
                </span>
                <span className="action-badge">Action needed</span>
              </div>

              <div className="taf-update-box">
                <div className="taf-update-head">
                  <span className="taf-update-title">No update currently available</span>
                  <span className="taf-update-time">16 Jul, 10:25 AM</span>
                </div>
                <p className="taf-update-body">
                  There aren&rsquo;t any updates on your fault right now. As soon as there is new
                  information, you&rsquo;ll find it here and we&rsquo;ll keep you informed.
                </p>
              </div>

              {/* Progress stepper */}
              <ol className="progress-stepper">
                {STEPS.map((step, i) => (
                  <li
                    key={i}
                    className={`step${step.active ? " active" : ""}${step.last ? " last" : ""}`}
                  >
                    <span className="step-marker" />
                    <div className="step-content">
                      <span className="step-title">{step.title}</span>
                      {step.date && <span className="step-date">{step.date}</span>}
                      {step.desc && <span className="step-desc">{step.desc}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Your details (right sidebar on L+, after timeline on mobile) */}
            <div className="taf-details-card taf-grid-details results-animate results-row-animate" style={{ animationDelay: "0.4s" }}>
                <h3 className="taf-details-title">Your details</h3>
                <div className="taf-detail-block">
                  <div className="taf-detail-row">
                    <span className="taf-detail-label">Site address:</span>
                    <EditIcon />
                  </div>
                  <p className="taf-detail-value">1 The Street,<br />Westminister, London<br />SW1 1RY</p>
                </div>
                <div className="taf-detail-block">
                  <div className="taf-detail-row">
                    <span className="taf-detail-label">Contact details:</span>
                    <EditIcon />
                  </div>
                  <p className="taf-detail-value">Name: <strong>Duke Alexa</strong><br />Phone: <strong>01283424873</strong></p>
                </div>
            </div>
          </div>

          {/* Help & support */}
          <section className="taf-section results-animate results-row-animate" style={{ animationDelay: "0.55s" }}>
            <div className="taf-faq-head">
              <div>
                <h2 className="section-title" style={{ marginBottom: 4 }}>Help &amp; support</h2>
                <p className="taf-faq-sub">Learn more about the online fault process</p>
              </div>
            </div>
            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <details className="faq-item" key={i}>
                  <summary>
                    {faq.q}
                    <ChevronDown />
                  </summary>
                  <div className="faq-body">{faq.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Track a different fault */}
          <section className="taf-section results-animate results-row-animate" style={{ animationDelay: "0.7s" }}>
            <h2 className="section-title">Track a different fault</h2>

            {/* Desktop (L+): data table */}
            <div className="taf-table-desktop">
              <div className="data-table">
                <div className="table-scroll">
                  <div className="taf-related-grid">
                    <div className="taf-grid-header">
                      <div className="cell">Fault reference</div>
                      <div className="cell">Product</div>
                      <div className="cell">Service ID</div>
                      <div className="cell">Fault reported</div>
                      <div className="cell">Status</div>
                      <div className="cell">Action</div>
                    </div>
                    {tafRelatedRows.map((row, i) => (
                      <div className="taf-grid-row" key={i}>
                        <div className="cell">
                          <TafProductIcon type={row.type} />
                          <strong>{row.ref}</strong>
                        </div>
                        <div className="cell">{row.type}</div>
                        <div className="cell">{row.id}</div>
                        <div className="cell">{row.reported}</div>
                        <div className="cell"><TafStatusBadge status={row.status} /></div>
                        <div className="cell">
                          <ButtonV2
                            label={row.status === "In progress" ? "View progress" : "Take action"}
                            buttonStyle="primary"
                            size="s"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile / tablet (below L): tile cards */}
            <div className="taf-tiles-mobile">
              <div className="taf-fault-tiles">
                {tafRelatedRows.map((row, i) => (
                  <TafFaultTile row={row} key={`tile-${i}`} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* You might be interested in */}
      <section className="taf-interested results-animate results-row-animate" style={{ animationDelay: "0.85s" }}>
        <div className="container bleed">
          <h2 className="section-title" style={{ textAlign: "center" }}>You might be interested in</h2>
          <div className="interested-grid">
            <div className="interested-card">
              <svg className="interested-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 10h18" /><rect x="3" y="5" width="18" height="14" rx="2" />
              </svg>
              <h3>Billing</h3>
              <p>Find out what to expect from your first BT Business bill, and how to manage your bill online.</p>
            </div>
            <div className="interested-card">
              <svg className="interested-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
              </svg>
              <h3>Help and support</h3>
              <p>Need more help with your product or service? View our step-by-step guides, FAQs and video tutorials.</p>
            </div>
            <div className="interested-card">
              <svg className="interested-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-5.4 5.4a2 2 0 0 0 2.8 2.8l5.4-5.4a4 4 0 0 0 5.6-5.6l-2.5 2.5-2.1-2.1 2.5-2.5Z" />
              </svg>
              <h3>Fault and repairs</h3>
              <p>Check your service performance, or fix or report your service issues online.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
