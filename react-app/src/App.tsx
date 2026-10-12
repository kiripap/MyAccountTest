import { useState, useEffect, useCallback, Component, type ReactNode } from "react";

import { ArcNav } from "./components/ArcNav";
import { ArcFooter } from "./components/ArcFooter";
import { ReportFaultModal } from "./components/ReportFaultModal";

import { LoadingView } from "./pages/LoadingView";
import { ResultsView } from "./pages/ResultsView";
import { TrackAFaultPage } from "./pages/TrackAFaultPage";
import { DuplicateView } from "./pages/DuplicateView";
import { TestResultsPage } from "./pages/TestResultsPage";

import type { Scenario, MockConfig, ServiceRow } from "./data/mockData";
import { defaultMockConfig } from "./data/mockData";

/* ─── Error boundary ─── */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ padding: 24, color: "#DA020F", fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap" }}>
          Render error:{"\n"}
          {this.state.error.message}
          {"\n\n"}
          {this.state.error.stack}
        </pre>
      );
    }
    return this.props.children;
  }
}

/* ─── Screen type ─── */
type Screen = "loading" | "results" | "taf" | "duplicate" | "testResults";

const LOADING_DURATION = 20_000;

/* ═══ Main App ═══ */
export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [mockConfig, setMockConfig] = useState<MockConfig>(defaultMockConfig);
  const [selectedService, setSelectedService] = useState<ServiceRow | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  /* Auto-timer: loading → results after 20s */
  useEffect(() => {
    if (screen !== "loading") return;
    const timer = setTimeout(() => {
      setScreen("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, LOADING_DURATION);
    return () => clearTimeout(timer);
  }, [screen]);

  /* ─── Flow callbacks ─── */

  const handleReportFault = useCallback((row: ServiceRow) => {
    if (row.type !== "Broadband") {
      alert("The enhanced diagnostics journey is available for broadband services in this prototype.");
      return;
    }
    setSelectedService(row);
    setShowReportModal(true);
  }, []);

  const handleDiagComplete = useCallback(() => {
    setShowReportModal(false);
    setScreen("testResults");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleDuplicateFound = useCallback(() => {
    setShowReportModal(false);
    setScreen("duplicate");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleViewProgress = useCallback(() => {
    setScreen("taf");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleBackToResults = useCallback(() => {
    setScreen("results");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleContinueFault = useCallback(() => {
    setScreen("taf");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleViewExistingResult = useCallback(() => {
    setScreen("testResults");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* ─── Dev scenario switcher ─── */
  const updateScenario = useCallback((s: Scenario) => {
    setMockConfig((prev) => ({ ...prev, resultScenario: s }));
  }, []);

  const toggleDuplicate = useCallback(() => {
    setMockConfig((prev) => ({ ...prev, duplicateFound: !prev.duplicateFound }));
  }, []);

  const skipToScreen = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* ─── Render current screen ─── */
  function renderScreen() {
    switch (screen) {
      case "loading":
        return <LoadingView />;
      case "results":
        return (
          <ResultsView
            onReportFault={handleReportFault}
            onViewProgress={handleViewProgress}
            onStartFixing={() => {
              setSelectedService({ type: "Broadband", id: "01168222981", addr: "12 Kingscliffe Road, NG31 8ET" });
              setShowReportModal(true);
            }}
            onTakeAction={handleViewProgress}
          />
        );
      case "taf":
        return <TrackAFaultPage onBack={handleBackToResults} />;
      case "duplicate":
        return (
          <DuplicateView
            serviceId={selectedService?.id ?? "01168222981"}
            onBack={handleBackToResults}
            onViewResult={handleViewExistingResult}
          />
        );
      case "testResults":
        return (
          <TestResultsPage
            scenario={mockConfig.resultScenario}
            serviceId={selectedService?.id}
            serviceAddr={selectedService?.addr}
            onViewHelp={() => {}}
            onContinueFault={handleContinueFault}
            onIssueResolved={handleBackToResults}
            onBookEngineer={handleContinueFault}
            onBack={handleBackToResults}
          />
        );
    }
  }

  return (
    <div className="arc-ds-sys-theme arc-ds-sys-theme--bt-business arc-ds-sys-icons--bt arc-v13-16-0">
      <div className="arc">
        <div className="page">
          <ArcNav />

          <ErrorBoundary>
            {renderScreen()}
          </ErrorBoundary>

          <ArcFooter />
        </div>

        {/* Report Fault Modal (symptom selection → diagnostics loading) */}
        <ReportFaultModal
          isOpen={showReportModal}
          serviceId={selectedService?.id ?? ""}
          diagnosticsDelayMs={mockConfig.diagnosticsDelayMs}
          onClose={() => setShowReportModal(false)}
          onDiagnosticsComplete={handleDiagComplete}
          duplicateFound={mockConfig.duplicateFound}
          onDuplicateFound={handleDuplicateFound}
        />

        {/* Dev scenario switcher */}
        <div className="dev-switcher">
          <div className="dev-switcher-row">
            <span>Screen:</span>
            {(["loading", "results", "taf", "duplicate", "testResults"] as Screen[]).map((s) => (
              <button
                key={s}
                className={screen === s ? "active" : ""}
                onClick={() => skipToScreen(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="dev-switcher-row">
            <span>Scenario:</span>
            {(["no-faults", "internal-checks", "engineer"] as Scenario[]).map((s) => (
              <button
                key={s}
                className={mockConfig.resultScenario === s ? "active" : ""}
                onClick={() => updateScenario(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="dev-switcher-row">
            <span>Duplicate:</span>
            <button
              className={mockConfig.duplicateFound ? "active" : ""}
              onClick={toggleDuplicate}
            >
              {mockConfig.duplicateFound ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
