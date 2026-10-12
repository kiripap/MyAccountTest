import { useState, useMemo } from "react";
import type { ServiceRow } from "../data/mockData";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconPhone } from "@arc-ui/icons/BtIconPhone";

/* ─── Row icons using Arc icon data URIs ─── */
const ProductIcon = ({ type }: { type: ServiceRow["type"] }) => (
  <img
    src={type === "Broadband" ? BtIconBroadband : BtIconPhone}
    alt={type}
    style={{ width: 24, height: 24, flexShrink: 0 }}
    className="row-icon"
  />
);

const LocIcon = () => (
  <svg className="row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SortIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 15l5 5 5-5" />
    <path d="M7 9l5-5 5 5" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function StatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="cell-empty">-</span>;
  if (status === "No fault detected") return <span className="status-badge success">No fault detected</span>;
  return <span className="status-badge pending">{status}</span>;
}

const PAGE_SIZE = 10;

interface ServiceTableProps {
  rows: ServiceRow[];
  showActions?: boolean;
  ctaMode?: "report" | "track";
  title?: string;
  description?: string;
  onReportFault?: (row: ServiceRow) => void;
  onViewProgress?: () => void;
}

export function ServiceTable({
  rows,
  showActions = true,
  ctaMode = "report",
  title = "All your services",
  description = "Experiencing a fault on a service our initial checks haven\u2019t picked up on? Report a fault here and we\u2019ll look into it for you.",
  onReportFault,
  onViewProgress,
}: ServiceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState<"all" | "Broadband" | "Phone line">("all");
  const [filterOpen, setFilterOpen] = useState(false);

  // Filtered rows
  const filteredRows = useMemo(() => {
    let result = rows;
    if (productFilter !== "all") {
      result = result.filter((r) => r.type === productFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) => r.id.toLowerCase().includes(q) || r.addr.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, productFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset page when filters change
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: "all" | "Broadband" | "Phone line") => {
    setProductFilter(value);
    setFilterOpen(false);
    setCurrentPage(1);
  };

  /* ─── Pagination footer (shared between views) ─── */
  const paginationFooter = (
    <div className="table-footer">
      <div className="table-footer-text">
        Showing <strong>{pageRows.length}</strong> of <strong>{filteredRows.length} items</strong>
      </div>
      <div className="pagination">
        <div
          className={`page-arrow${currentPage === 1 ? " disabled" : ""}`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <div
            key={p}
            className={`page-dot${p === currentPage ? " active" : ""}`}
            onClick={() => setCurrentPage(p)}
          >
            {p}
          </div>
        ))}
        <div
          className={`page-arrow${currentPage === totalPages ? " disabled" : ""}`}
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
        </div>
      </div>
    </div>
  );

  /* ─── CTA button for a row ─── */
  const rowCta = (row: ServiceRow, fullWidth?: boolean) => {
    if (!showActions) return <span className="cell-empty">-</span>;
    if (ctaMode === "track") {
      return <ButtonV2 label="View progress" buttonStyle="primary" size="s" isFullWidth={fullWidth} onClick={onViewProgress} />;
    }
    return <ButtonV2 label="Report a fault" buttonStyle="secondary" size="s" isFullWidth={fullWidth} onClick={() => onReportFault?.(row)} />;
  };

  return (
    <section className="table-section">
      <div className="table-header">
        <div className="table-header-text">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <ButtonV2 label="Get started" buttonStyle="secondary" />
      </div>

      {/* ─── Filters ─── */}
      <div className="filters-row">
        <div className="input-field" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search Service ID or Address"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: 16,
              fontFamily: "inherit",
              color: "#2A2A2A",
              width: "100%",
            }}
          />
          <SearchIcon />
        </div>
        <div
          className="input-field"
          style={{ cursor: "pointer", position: "relative", userSelect: "none" }}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <span>{productFilter === "all" ? "All products" : productFilter}</span>
          <ChevronIcon />
          {filterOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #D9D9D9",
                borderRadius: 12,
                marginTop: 4,
                zIndex: 10,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              {(["all", "Broadband", "Phone line"] as const).map((opt) => (
                <div
                  key={opt}
                  onClick={(e) => { e.stopPropagation(); handleFilterChange(opt); }}
                  style={{
                    padding: "12px 16px",
                    fontSize: 16,
                    cursor: "pointer",
                    background: productFilter === opt ? "#F7F7F7" : "white",
                    borderBottom: opt !== "Phone line" ? "1px solid #F0F0F0" : "none",
                  }}
                >
                  {opt === "all" ? "All products" : opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Desktop table view (xl+) ─── */}
      <div className="service-table-desktop">
        <div className="data-table">
          <div className="table-scroll">
            <div className="table-grid">
              <div className="grid-header">
                <div className="cell">Product <SortIcon /></div>
                <div className="cell">Service ID <SortIcon /></div>
                <div className="cell">Address <SortIcon /></div>
                <div className="cell">Status <SortIcon /></div>
                <div className="cell">Actions</div>
              </div>

              {pageRows.map((row, i) => (
                <div className="grid-row" key={`${row.id}-${i}`}>
                  <div className="cell">
                    <ProductIcon type={row.type} />
                    {row.type}
                  </div>
                  <div className="cell">{row.id}</div>
                  <div className="cell"><LocIcon /> {row.addr}</div>
                  <div className="cell"><StatusBadge status={row.status} /></div>
                  <div className="cell">
                    {rowCta(row)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {paginationFooter}
        </div>
      </div>

      {/* ─── Mobile / tablet tile view (below xl) ─── */}
      <div className="service-tiles-mobile">
        <div className="service-tiles-grid">
          {pageRows.map((row, i) => (
            <div className="service-tile" key={`tile-${row.id}-${i}`}>
              <div className="service-tile-field">
                <span className="service-tile-label">Product</span>
                <span className="service-tile-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ProductIcon type={row.type} />
                  {row.type}
                </span>
              </div>
              <hr className="service-tile-divider" />
              <div className="service-tile-field">
                <span className="service-tile-label">Service ID</span>
                <span className="service-tile-value">{row.id}</span>
              </div>
              <div className="service-tile-field">
                <span className="service-tile-label">Address</span>
                <span className="service-tile-value">{row.addr}</span>
              </div>
              <div className="service-tile-status">
                <span className="service-tile-label">Status</span>
                <StatusBadge status={row.status} />
              </div>
              {rowCta(row, true)}
            </div>
          ))}
        </div>
        {paginationFooter}
      </div>
    </section>
  );
}
