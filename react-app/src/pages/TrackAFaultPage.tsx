import { tafRelatedRows } from "../data/mockData";
import type { TafRelatedRow } from "../data/mockData";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Badge } from "@arc-ui/components/Badge";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsLink } from "@arc-ui/components/Breadcrumbs";
import { ProgressStepper, ProgressStepperItem } from "@arc-ui/components/ProgressStepper";
import { Disclosure } from "@arc-ui/components/Disclosure";
import { Rule } from "@arc-ui/components/Rule";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconPhone } from "@arc-ui/icons/BtIconPhone";
import { BtIconAlertTriangle } from "@arc-ui/icons/BtIconAlertTriangle";
import { BtIconSignature } from "@arc-ui/icons/BtIconSignature";

interface TrackAFaultPageProps {
  onBack: () => void;
}

/* ─── Arc icon wrappers ─── */
const WarningTriangle = () => (
  <img src={BtIconAlertTriangle} alt="" className="taf-alert-icon" style={{ width: 32, height: 32, flexShrink: 0 }} />
);

const EditIcon = () => (
  <img src={BtIconSignature} alt="Edit" className="taf-edit" style={{ width: 20, height: 20, cursor: "pointer" }} />
);

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
          <Text size="s" tone="muted">Fault reference</Text>
          <Text size="m"><strong>{row.ref}</strong></Text>
        </div>
        <TafStatusBadge status={row.status} />
      </div>
      <Rule />
      <div className="taf-fault-tile-rows">
        <div className="taf-fault-tile-row">
          <Text size="s" tone="muted">Product</Text>
          <Text size="s">{row.type}</Text>
        </div>
        <div className="taf-fault-tile-row">
          <Text size="s" tone="muted">Service ID</Text>
          <Text size="s">{row.id}</Text>
        </div>
        <div className="taf-fault-tile-row">
          <Text size="s" tone="muted">Reported on</Text>
          <Text size="s">{row.reported}</Text>
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
        {/* Hero header: breadcrumbs + heading + supporting copy */}
        <div className="hero-header">
          <Breadcrumbs>
            <BreadcrumbsItem spacerIconAfter>
              <BreadcrumbsLink href="#" onClick={() => onBack()}>Dashboard</BreadcrumbsLink>
            </BreadcrumbsItem>
            <BreadcrumbsItem spacerIconAfter>
              <BreadcrumbsLink href="#" onClick={() => onBack()}>Faults</BreadcrumbsLink>
            </BreadcrumbsItem>
            <BreadcrumbsItem>
              <BreadcrumbsLink href="#" aria-current="page">Track a fault</BreadcrumbsLink>
            </BreadcrumbsItem>
          </Breadcrumbs>

          <div className="hero-header-text">
            <Heading level="1" size="xl" fontStyle="display-standard">Fault progress</Heading>
            <p className="taf-subhead">
              <Text size="s" isInline>Fault reference: <strong>1-108617949</strong></Text>
              <span className="sep">|</span>
              <Text size="s" isInline>Service ID: <strong>1-108617949</strong></Text>
              <span className="sep">|</span>
              <Text size="s" isInline>Product: <strong>Broadband</strong></Text>
            </p>
          </div>
        </div>

        <main className="main">
          {/* Two-column layout */}
          <div className="taf-grid">
            {/* Action needed (right sidebar on L+, first on mobile) */}
            <div className="taf-alert-card taf-grid-alert results-animate results-row-animate" style={{ animationDelay: "0.1s" }}>
                <div className="taf-alert-content">
                  <div className="taf-alert-head">
                    <WarningTriangle />
                    <h2 className="taf-heading-m">Action needed</h2>
                  </div>
                  <Text size="m" elementType="p">
                    You&rsquo;ve started reporting a fault but haven&rsquo;t finished yet. Please continue
                    your report so we can start fixing the issue.
                  </Text>
                </div>
                <div className="taf-alert-ctas">
                  <ButtonV2 label="Resume reporting" buttonStyle="primary" isFullWidth />
                  <ButtonV2 label="Cancel fault" buttonStyle="secondary" isFullWidth />
                </div>
            </div>

            {/* LEFT: Progress / timeline card */}
            <div className="taf-progress-card taf-grid-progress results-animate results-row-animate" style={{ animationDelay: "0.25s" }}>
              <div className="taf-progress-top">
                <Text size="s">Estimated fix date: <strong>Monday 18th May</strong></Text>
                <Badge state="warning">Action needed</Badge>
              </div>

              <div className="taf-update-box">
                <div className="taf-update-head">
                  <Text size="s"><strong>No update currently available</strong></Text>
                  <Text size="xs" tone="muted">16 Jul, 10:25 AM</Text>
                </div>
                <VerticalSpace size="8" />
                <Text size="s" elementType="p" isMeasured>
                  There aren&rsquo;t any updates on your fault right now. As soon as there is new
                  information, you&rsquo;ll find it here and we&rsquo;ll keep you informed.
                </Text>
              </div>

              {/* Progress stepper — Arc component */}
              <VerticalSpace size="24" />
              <ProgressStepper direction="vertical" currentStep={0}>
                <ProgressStepperItem
                  title="Fault report in progress"
                  subTitle="08/05/2026"
                  status="current"
                  stepContent={<Text size="s">Complete your fault report so we can start investigating the issue.</Text>}
                />
                <ProgressStepperItem
                  title="Fault opened"
                  status="todo"
                  stepContent={<Text size="s">We&rsquo;re investigating your fault.</Text>}
                />
                <ProgressStepperItem
                  title="We've identified a fix"
                  status="todo"
                  stepContent={<Text size="s">We&rsquo;re applying the fix and monitoring progress to restore your service.</Text>}
                />
                <ProgressStepperItem
                  title="Fault fixed"
                  status="todo"
                  stepContent={<Text size="s">Your fault has been fixed. Check your service and let us know if you still need help.</Text>}
                />
                <ProgressStepperItem
                  title="Fault closed"
                  subTitle="18/05/2026 (est.)"
                  status="todo"
                />
              </ProgressStepper>
            </div>

            {/* Your details (right sidebar on L+, after timeline on mobile) */}
            <div className="taf-details-card taf-grid-details results-animate results-row-animate" style={{ animationDelay: "0.4s" }}>
                <h3 className="taf-heading-m">Your details</h3>
                <VerticalSpace size="16" />
                <div className="taf-detail-block">
                  <div className="taf-detail-row">
                    <Text size="s"><strong>Site address:</strong></Text>
                    <EditIcon />
                  </div>
                  <VerticalSpace size="8" />
                  <Text size="s" elementType="p">1 The Street,<br />Westminister, London<br />SW1 1RY</Text>
                </div>
                <div className="taf-detail-block">
                  <div className="taf-detail-row">
                    <Text size="s"><strong>Contact details:</strong></Text>
                    <EditIcon />
                  </div>
                  <VerticalSpace size="8" />
                  <Text size="s" elementType="p">Name: <strong>Duke Alexa</strong><br />Phone: <strong>01283424873</strong></Text>
                </div>
            </div>
          </div>

          {/* Help & support — using Arc Disclosure for FAQ */}
          <section className="taf-section results-animate results-row-animate" style={{ animationDelay: "0.55s" }}>
            <h2 className="taf-heading-m">Help &amp; support</h2>
            <VerticalSpace size="4" />
            <Text size="s" tone="muted">Learn more about the online fault process</Text>
            <VerticalSpace size="24" />
            {FAQS.map((faq, i) => (
              <Disclosure key={i} summary={faq.q} headingLevel="3">
                <Text size="s" elementType="p">{faq.a}</Text>
              </Disclosure>
            ))}
          </section>

          {/* Track a different fault */}
          <section className="taf-section results-animate results-row-animate" style={{ animationDelay: "0.7s" }}>
            <h2 className="taf-heading-m">Track a different fault</h2>
            <VerticalSpace size="24" />

            {/* Desktop (L+): data table */}
            <div className="taf-table-desktop">
              <div className="data-table">
                <div className="table-scroll">
                  <div className="taf-related-grid">
                    <div className="taf-grid-header">
                      <div className="cell"><Text size="s" tone="muted">Fault reference</Text></div>
                      <div className="cell"><Text size="s" tone="muted">Product</Text></div>
                      <div className="cell"><Text size="s" tone="muted">Service ID</Text></div>
                      <div className="cell"><Text size="s" tone="muted">Fault reported</Text></div>
                      <div className="cell"><Text size="s" tone="muted">Status</Text></div>
                      <div className="cell"><Text size="s" tone="muted">Action</Text></div>
                    </div>
                    {tafRelatedRows.map((row, i) => (
                      <div className="taf-grid-row" key={i}>
                        <div className="cell">
                          <TafProductIcon type={row.type} />
                          <Text size="s"><strong>{row.ref}</strong></Text>
                        </div>
                        <div className="cell"><Text size="s">{row.type}</Text></div>
                        <div className="cell"><Text size="s">{row.id}</Text></div>
                        <div className="cell"><Text size="s">{row.reported}</Text></div>
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
          <h2 className="taf-heading-m" style={{ textAlign: "center" }}>You might be interested in</h2>
          <VerticalSpace size="32" />
          <div className="interested-grid">
            <div className="interested-card">
              <svg className="interested-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 10h18" /><rect x="3" y="5" width="18" height="14" rx="2" />
              </svg>
              <Heading level="3" size="xs">Billing</Heading>
              <VerticalSpace size="8" />
              <Text size="s">Find out what to expect from your first BT Business bill, and how to manage your bill online.</Text>
            </div>
            <div className="interested-card">
              <svg className="interested-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
              </svg>
              <Heading level="3" size="xs">Help and support</Heading>
              <VerticalSpace size="8" />
              <Text size="s">Need more help with your product or service? View our step-by-step guides, FAQs and video tutorials.</Text>
            </div>
            <div className="interested-card">
              <svg className="interested-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-5.4 5.4a2 2 0 0 0 2.8 2.8l5.4-5.4a4 4 0 0 0 5.6-5.6l-2.5 2.5-2.1-2.1 2.5-2.5Z" />
              </svg>
              <Heading level="3" size="xs">Fault and repairs</Heading>
              <VerticalSpace size="8" />
              <Text size="s">Check your service performance, or fix or report your service issues online.</Text>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
