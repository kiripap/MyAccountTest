import { useState, useEffect } from "react";
import { Lottie } from "lottie-react";
import { ArcContentSwitcher } from "../components/ArcContentSwitcher";
import { ServiceTable } from "../components/ServiceTable";
import { loadingRows } from "../data/mockData";

const PHASE_MS = 6667;
const TOTAL_PHASES = 3;

const CAPTIONS = [
  { title: "Checking for local outages", desc: "We\u2019re checking if a local issue is affecting your connection." },
  { title: "Checking your services", desc: "Testing your connection to make sure it\u2019s working right and checking for open issues." },
  { title: "Checking your devices", desc: "Checking your connected devices for issues." },
];

const SWITCHER_TABS = [
  { label: "All your services", value: "all" },
  { label: "Track a fault", value: "track" },
];

export function LoadingView() {
  const [phase, setPhase] = useState(0);
  const [switcherValue, setSwitcherValue] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % TOTAL_PHASES);
    }, PHASE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container bleed">
      <div className="page-header">
        <h1>Checking faults</h1>
        <p>We&rsquo;re running initial checks on your services. This should take less than a minute.</p>
      </div>

      <main className="main">
        <section className="loading-section" aria-label="Diagnostic checks in progress">
          <div className="carousel-viewport">
            <div className="pulse-circle" aria-hidden="true" />
            <div
              className="carousel-track"
              style={{ transform: `translateX(${-phase * 100}%)` }}
            >
              <div className="carousel-slide">
                <div className="lottie-holder lottie-map">
                  <Lottie src="/anim-map.json" loop autoplay style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
              <div className="carousel-slide">
                <div className="lottie-holder lottie-building">
                  <Lottie src="/anim-building.json" loop autoplay style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
              <div className="carousel-slide">
                <div className="lottie-holder lottie-router">
                  <Lottie src="/anim-router.json" loop autoplay style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="loading-caption">
            <div className="arc-spinner" role="status" aria-label="Loading" />
            <div className="caption-text" aria-live="polite">
              {CAPTIONS.map((cap, i) => (
                <div className={`caption-item${i === phase ? " active" : ""}`} key={i}>
                  <div className="caption-title">{cap.title}</div>
                  <div className="caption-desc">{cap.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ArcContentSwitcher
          tabs={SWITCHER_TABS}
          value={switcherValue}
          onValueChange={setSwitcherValue}
        />

        <ServiceTable rows={loadingRows} showActions={false} />
      </main>
    </div>
  );
}
