import { useState, useCallback } from "react";
import { FaultCards } from "../components/FaultCards";
import { ArcContentSwitcher } from "../components/ArcContentSwitcher";
import { ServiceTable } from "../components/ServiceTable";
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsLink } from "@arc-ui/components/Breadcrumbs";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { BtIconArrowDown } from "@arc-ui/icons/BtIconArrowDown";
import { allServicesRows, faultsRows } from "../data/mockData";
import type { ServiceRow, ResultsVariant } from "../data/mockData";

const SWITCHER_TABS = [
  { label: "All services", value: "all" },
  { label: "Faults", value: "faults" },
];

interface ResultsViewProps {
  resultsVariant?: ResultsVariant;
  onReportFault: (row: ServiceRow) => void;
  onViewProgress: () => void;
  onStartFixing: () => void;
  onTakeAction: () => void;
  /** Opens the My Account onboarding tour (drawer slides down over this page). */
  onStartTour?: () => void;
}

export function ResultsView({ resultsVariant = "single-card", onReportFault, onViewProgress, onStartFixing, onTakeAction, onStartTour }: ResultsViewProps) {
  const [switcherValue, setSwitcherValue] = useState("all");

  const handleSwitcherChange = useCallback((value: string) => {
    setSwitcherValue(value);
  }, []);

  const isFaultsView = switcherValue === "faults";
  const rows = isFaultsView ? faultsRows : allServicesRows;

  return (
    <div className="container bleed">
      {/* "Take the My Account tour" entry point — slides the onboarding drawer
          down over this page (Figma node 2375-71363). */}
      {onStartTour && (
        <div className="ob-tour-entry">
          <ButtonV2
            size="l"
            icon={BtIconArrowDown}
            ariaLabel="Take the My Account tour"
            onClick={onStartTour}
          />
          <button type="button" className="ob-tour-entry-label" onClick={onStartTour}>
            Take the My Account tour
          </button>
        </div>
      )}

      {/* Hero header: single Dashboard breadcrumb + heading */}
      <div className="hero-header">
        <Breadcrumbs>
          <BreadcrumbsItem spacerIconAfter>
            <BreadcrumbsLink href="#">Dashboard</BreadcrumbsLink>
          </BreadcrumbsItem>
          <BreadcrumbsItem>
            <BreadcrumbsLink href="#" aria-current="page">Faults</BreadcrumbsLink>
          </BreadcrumbsItem>
        </Breadcrumbs>

        <div className="hero-header-text">
          <h1 className="hero-h1-40">Checks complete</h1>
        </div>
      </div>

      <main className="main">
        <FaultCards variant={resultsVariant} onStartFixing={onStartFixing} onTakeAction={onTakeAction} />

        <ArcContentSwitcher
          tabs={SWITCHER_TABS}
          value={switcherValue}
          onValueChange={handleSwitcherChange}
        />

        <ServiceTable
          rows={rows}
          showActions
          ctaMode={isFaultsView ? "track" : "report"}
          title={isFaultsView ? "Open faults" : "All your services"}
          description={
            isFaultsView
              ? "Track and manage your open faults."
              : "Experiencing a fault on a service our initial checks haven\u2019t picked up on? Report a fault here and we\u2019ll look into it for you."
          }
          onReportFault={onReportFault}
          onViewProgress={onViewProgress}
        />
      </main>
    </div>
  );
}
