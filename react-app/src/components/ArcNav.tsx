/* ─── BT Business Navigation Header using Arc BrandLogo ─── */
import { BrandLogo } from "@arc-ui/components/BrandLogo";

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function ArcNav() {
  return (
    <header className="arc-nav">
      <div className="arc-nav-inner">
        <div className="arc-nav-logo">
          <BrandLogo size={48} color="brand" label="BT Business" />
        </div>

        <nav className="arc-nav-items">
          <span className="arc-nav-item">Dashboard</span>
          <span className="arc-nav-item">Billing <ChevronDown /></span>
          <span className="arc-nav-item">Orders</span>
          <span className="arc-nav-item active">Faults</span>
          <span className="arc-nav-item">Products &amp; Services <ChevronDown /></span>
        </nav>

        <div className="arc-nav-right">
          <span className="arc-nav-item">Help <ChevronDown /></span>
          <span className="arc-nav-item">One Braham <ChevronDown /></span>
          <div className="arc-nav-avatar">JD</div>
        </div>
      </div>
    </header>
  );
}
