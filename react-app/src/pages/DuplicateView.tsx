import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsLink } from "@arc-ui/components/Breadcrumbs";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconInfo } from "@arc-ui/icons/BtIconInfo";

interface DuplicateViewProps {
  serviceId: string;
  onBack: () => void;
  onViewResult: () => void;
}

const BroadbandIcon = () => (
  <img src={BtIconBroadband} alt="Broadband" className="row-icon" style={{ width: 24, height: 24 }} />
);

const InfoIcon = () => (
  <img src={BtIconInfo} alt="" className="info-icon" style={{ width: 24, height: 24 }} />
);

export function DuplicateView({ serviceId, onBack, onViewResult }: DuplicateViewProps) {
  return (
    <div className="container bleed">
      <div className="hero-header">
        <Breadcrumbs>
          <BreadcrumbsItem spacerIconAfter>
            <BreadcrumbsLink href="#" onClick={() => onBack()}>Faults</BreadcrumbsLink>
          </BreadcrumbsItem>
          <BreadcrumbsItem>
            <BreadcrumbsLink href="#" aria-current="page">Recent test found</BreadcrumbsLink>
          </BreadcrumbsItem>
        </Breadcrumbs>

        <div className="hero-header-text">
          <Heading level="1" size="xl" fontStyle="display-standard">You&rsquo;ve already run a test on this service</Heading>
        </div>
      </div>

      <main className="main journey-main">
        <div className="journey-panel">
          <div className="journey-service-chip">
            <BroadbandIcon />
            <Text size="m" isInline>
              <strong>BT Broadband</strong> &middot; {serviceId}
            </Text>
          </div>

          <div className="info-row">
            <InfoIcon />
            <div>
              <Text size="m" elementType="p">
                Previous test completed: <strong>Today at 09:42</strong>
              </Text>
              <VerticalSpace size="4" />
              <Text size="m" tone="muted" elementType="p">
                We ran a full set of checks on this service recently. To avoid putting extra load on the
                line, we don&rsquo;t run another test straight away &mdash; the earlier result is still valid.
              </Text>
            </div>
          </div>

          <div className="journey-actions">
            <ButtonV2 label="Back to Repairs" buttonStyle="secondary" onClick={onBack} />
            <ButtonV2 label="View existing result" buttonStyle="primary" icon={BtIconArrowRight} iconPosition="afterText" onClick={onViewResult} />
          </div>
        </div>
      </main>
    </div>
  );
}
