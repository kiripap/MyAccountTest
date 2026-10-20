import { useState, useMemo } from "react";
import type { ServiceRow } from "../data/mockData";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Text } from "@arc-ui/components/Text";
import { Badge } from "@arc-ui/components/Badge";
import { ComboBox } from "@arc-ui/components/ComboBox";
import { TextInput } from "@arc-ui/components/TextInput";
import { Pagination } from "@arc-ui/components/Pagination";
import { Rule } from "@arc-ui/components/Rule";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconPhone } from "@arc-ui/icons/BtIconPhone";
import { BtIconLocation } from "@arc-ui/icons/BtIconLocation";
import { BtIconSearch } from "@arc-ui/icons/BtIconSearch";

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
  <img src={BtIconLocation} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} className="row-icon" />
);

const SortIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 15l5 5 5-5" />
    <path d="M7 9l5-5 5 5" />
  </svg>
);

function StatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="cell-empty">-</span>;
  if (status === "No fault detected") return <Badge state="success">No fault detected</Badge>;
  return <Badge state="warning">{status}</Badge>;
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

  const filteredRows = useMemo(() => {
    let result = rows;
    if (productFilter !== "all") {
      result = result.filter((r) => r.type === productFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      // Search across every category/content in the table
      result = result.filter((r) =>
        [r.type, r.id, r.addr, r.status ?? ""]
          .some((field) => field.toLowerCase().includes(q))
      );
    }
    return result;
  }, [rows, productFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (value: string | string[] | null) => {
    const v = Array.isArray(value) ? value[0] : value;
    if (!v || v === "All products") {
      setProductFilter("all");
    } else {
      setProductFilter(v as "Broadband" | "Phone line");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          <Text size="m" elementType="p">{description}</Text>
        </div>
        <ButtonV2 label="Get started" buttonStyle="secondary" />
      </div>

      {/* ─── Filters — Arc TextInput (search) + Arc ComboBox (product) ─── */}
      <div className="filters-row">
        <div className="filter-field">
          <TextInput
            id="table-search"
            name="table-search"
            label="Search"
            leadingSlot={
              <span style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <img src={BtIconSearch} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
              </span>
            }
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="filter-field">
          <ComboBox
            id="product-filter"
            name="product-filter"
            label="Product"
            listBoxAriaLabel="Filter by product"
            options={["All products", "Broadband", "Phone line"]}
            defaultValue="All products"
            isAutocomplete
            onChange={handleFilterChange}
            isFluid
          />
        </div>
      </div>

      {/* ─── Desktop table view (xl+) ─── */}
      <div className="service-table-desktop">
        <div className="data-table">
          <div className="table-scroll">
            <div className="table-grid">
              <div className="grid-header">
                <div className="cell"><Text size="s"><strong>Product</strong></Text> <SortIcon /></div>
                <div className="cell"><Text size="s"><strong>Service ID</strong></Text> <SortIcon /></div>
                <div className="cell"><Text size="s"><strong>Address</strong></Text> <SortIcon /></div>
                <div className="cell"><Text size="s"><strong>Status</strong></Text> <SortIcon /></div>
                <div className="cell"><Text size="s"><strong>Actions</strong></Text></div>
              </div>

              {pageRows.map((row, i) => (
                <div className="grid-row" key={`${row.id}-${i}`}>
                  <div className="cell">
                    <ProductIcon type={row.type} />
                    <Text size="s">{row.type}</Text>
                  </div>
                  <div className="cell"><Text size="s">{row.id}</Text></div>
                  <div className="cell"><LocIcon /> <Text size="s">{row.addr}</Text></div>
                  <div className="cell"><StatusBadge status={row.status} /></div>
                  <div className="cell">
                    {rowCta(row)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Arc Pagination */}
          <div className="table-footer">
            <Text size="s">
              Showing <strong>{pageRows.length}</strong> of <strong>{filteredRows.length} items</strong>
            </Text>
            {totalPages > 1 && (
              <Pagination
                pageCount={totalPages}
                defaultSelectedPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile / tablet tile view (below xl) ─── */}
      <div className="service-tiles-mobile">
        <div className="service-tiles-grid">
          {pageRows.map((row, i) => (
            <div className="service-tile" key={`tile-${row.id}-${i}`}>
              <div className="service-tile-field">
                <Text size="s" tone="muted">Product</Text>
                <span className="service-tile-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ProductIcon type={row.type} />
                  <Text size="s">{row.type}</Text>
                </span>
              </div>
              <Rule />
              <div className="service-tile-field">
                <Text size="s" tone="muted">Service ID</Text>
                <Text size="s">{row.id}</Text>
              </div>
              <div className="service-tile-field">
                <Text size="s" tone="muted">Address</Text>
                <Text size="s">{row.addr}</Text>
              </div>
              <div className="service-tile-status">
                <Text size="s" tone="muted">Status</Text>
                <StatusBadge status={row.status} />
              </div>
              {rowCta(row, true)}
            </div>
          ))}
        </div>
        <div className="table-footer">
          <Text size="s">
            Showing <strong>{pageRows.length}</strong> of <strong>{filteredRows.length} items</strong>
          </Text>
          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              defaultSelectedPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </section>
  );
}
