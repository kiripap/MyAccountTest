/* ─── Service row types ─── */
export interface ServiceRow {
  type: "Broadband" | "Phone line";
  id: string;
  addr: string;
  status?: string;
}

export interface TafRelatedRow {
  type: "Broadband" | "Phone line";
  ref: string;
  id: string;
  reported: string;
  status: "In progress" | "Action needed";
}

/* ─── Mock service data ─── */
export const loadingRows: ServiceRow[] = [
  { type: "Broadband", id: "01168222981", addr: "12 Kingscliffe Road, NG31 8ET" },
  { type: "Broadband", id: "01168222982", addr: "7 Rosewood Lane, NW1 8JR" },
  { type: "Broadband", id: "01168222983", addr: "3 Willowbank Avenue, EH10 4SG" },
  { type: "Broadband", id: "01168222984", addr: "48 Meadow Crescent, LS6 2AB" },
  { type: "Broadband", id: "01168222985", addr: "91 Seaview Terrace, BN2 1RJ" },
  { type: "Phone line", id: "01168222972", addr: "48 Meadow Crescent, LS6 2AB" },
  { type: "Phone line", id: "01168222973", addr: "15 Churchfield Drive, BT7 3LP" },
  { type: "Phone line", id: "01168222974", addr: "29 Oakridge Gardens, M20 3GH" },
  { type: "Phone line", id: "01168222975", addr: "48 Meadow Crescent, LS6 2AB" },
  { type: "Phone line", id: "01168222976", addr: "64 Ashford Close, BS8 1PL" },
];

export const allServicesRows: ServiceRow[] = [
  { type: "Broadband", id: "01168222981", addr: "12 Kingscliffe Road, NG31 8ET", status: "No fault detected" },
  { type: "Broadband", id: "01168222982", addr: "7 Rosewood Lane, NW1 8JR", status: "No fault detected" },
  { type: "Broadband", id: "01168222983", addr: "3 Willowbank Avenue, EH10 4SG", status: "No fault detected" },
  { type: "Phone line", id: "01168222972", addr: "48 Meadow Crescent, LS6 2AB", status: "No fault detected" },
  { type: "Broadband", id: "01168222984", addr: "91 Seaview Terrace, BN2 1RJ", status: "No fault detected" },
  { type: "Phone line", id: "01168222973", addr: "15 Churchfield Drive, BT7 3LP", status: "No fault detected" },
  { type: "Broadband", id: "01168222986", addr: "22 Elm Court, SW11 3QF", status: "No fault detected" },
  { type: "Phone line", id: "01168222974", addr: "29 Oakridge Gardens, M20 3GH", status: "No fault detected" },
  { type: "Broadband", id: "01168222987", addr: "8 Harbour View, PL1 2NX", status: "No fault detected" },
  { type: "Phone line", id: "01168222975", addr: "64 Ashford Close, BS8 1PL", status: "No fault detected" },
  // Page 2
  { type: "Broadband", id: "01168222988", addr: "17 Cavendish Place, W1G 0QN", status: "No fault detected" },
  { type: "Broadband", id: "01168222989", addr: "5 Riverside Walk, SE1 7PB", status: "No fault detected" },
  { type: "Phone line", id: "01168222976", addr: "33 Victoria Terrace, LS3 1BQ", status: "No fault detected" },
  { type: "Broadband", id: "01168222990", addr: "14 Maple Drive, B15 2TT", status: "No fault detected" },
  { type: "Phone line", id: "01168222977", addr: "42 Castle Street, EH2 3AH", status: "No fault detected" },
  { type: "Broadband", id: "01168222991", addr: "9 Orchard Lane, OX1 4AQ", status: "No fault detected" },
  { type: "Phone line", id: "01168222978", addr: "56 Regent Road, L5 9SJ", status: "No fault detected" },
  { type: "Broadband", id: "01168222992", addr: "1 Beacon Hill, GU1 3ST", status: "No fault detected" },
  { type: "Phone line", id: "01168222979", addr: "78 High Street, CF10 1AX", status: "No fault detected" },
  { type: "Broadband", id: "01168222993", addr: "20 Park Avenue, NE1 5DH", status: "No fault detected" },
  // Page 3
  { type: "Broadband", id: "01168222994", addr: "11 Church Road, BN1 1UJ", status: "No fault detected" },
  { type: "Phone line", id: "01168222980", addr: "4 Mill Lane, CB2 1RX", status: "No fault detected" },
  { type: "Broadband", id: "01168222995", addr: "36 Queen Street, G1 3DX", status: "No fault detected" },
  { type: "Broadband", id: "01168222996", addr: "19 Lime Grove, NG7 2LA", status: "No fault detected" },
  { type: "Phone line", id: "01168222971", addr: "63 Station Road, S1 2AB", status: "No fault detected" },
  { type: "Broadband", id: "01168222997", addr: "27 Brook Street, IP1 1DT", status: "No fault detected" },
  { type: "Phone line", id: "01168222969", addr: "51 King Edward Road, BH9 1AF", status: "No fault detected" },
  { type: "Broadband", id: "01168222998", addr: "2 Westgate, PE1 1RG", status: "No fault detected" },
  { type: "Phone line", id: "01168222968", addr: "88 London Road, RG1 5AQ", status: "No fault detected" },
  { type: "Broadband", id: "01168222999", addr: "6 Priory Close, EX4 6BH", status: "No fault detected" },
];

export const faultsRows: ServiceRow[] = [
  { type: "Broadband", id: "01168222981", addr: "12 Kingscliffe Road, NG31 8ET", status: "Open fault" },
  { type: "Broadband", id: "01168222981", addr: "12 Kingscliffe Road, NG31 8ET", status: "Open fault" },
  { type: "Broadband", id: "01168222981", addr: "12 Kingscliffe Road, NG31 8ET", status: "Action needed" },
];

export const tafRelatedRows: TafRelatedRow[] = [
  { type: "Broadband", ref: "1-108617949", id: "01168222981", reported: "13/03/23", status: "In progress" },
  { type: "Broadband", ref: "1-108617949", id: "01168222981", reported: "13/03/23", status: "Action needed" },
  { type: "Phone line", ref: "1-108617949", id: "01168222981", reported: "13/03/23", status: "Action needed" },
];

/* ─── Test result scenarios ─── */
export type Scenario = "no-faults" | "internal-checks" | "engineer";

export interface CheckResult {
  name: string;
  state: "pass" | "issue" | "unavailable";
  detail: string;
}

export interface ScenarioData {
  alertStatus: "error" | "success" | "warning" | "general";
  alertHeading: string;
  alertDescription: string;
  results: CheckResult[];
}

export const RESULT_SCENARIOS: Record<Scenario, ScenarioData> = {
  "no-faults": {
    alertStatus: "general",
    alertHeading: "No faults found",
    alertDescription: "Our enhanced checks didn\u2019t identify a fault with your broadband service.",
    results: [
      { name: "Major service outages", state: "pass", detail: "No outages reported in your area." },
      { name: "Broadband connection", state: "pass", detail: "Your connection is stable and performing as expected." },
      { name: "Internal wiring", state: "pass", detail: "No problems detected with your setup." },
      { name: "External network", state: "pass", detail: "The connection to the exchange looks healthy." },
    ],
  },
  "internal-checks": {
    alertStatus: "error",
    alertHeading: "Internal checks required",
    alertDescription: "We couldn\u2019t confirm the issue is with the external network. Please check your hub, cables and internal setup to help us narrow down the problem.",
    results: [
      { name: "Major service outages", state: "pass", detail: "No outages reported in your area." },
      { name: "Broadband connection", state: "pass", detail: "Your connection is stable and performing as expected." },
      { name: "Internal wiring and setup", state: "issue", detail: "We couldn\u2019t confirm this is healthy. Please check your cables and equipment." },
      { name: "External network", state: "pass", detail: "The connection to the exchange looks healthy." },
    ],
  },
  engineer: {
    alertStatus: "error",
    alertHeading: "Engineer needed",
    alertDescription: "Our checks suggest an issue that may need an engineer visit. Contact our support team to review the result and discuss the next steps for this broadband service.",
    results: [
      { name: "Major service outages", state: "pass", detail: "No outages reported in your area." },
      { name: "Broadband connection", state: "issue", detail: "We detected a problem affecting your connection." },
      { name: "Internal wiring", state: "pass", detail: "No problems detected with your setup." },
      { name: "External network", state: "issue", detail: "An issue was detected on the external network. An engineer may be required." },
    ],
  },
};

/* ─── Mock config ─── */
export interface MockConfig {
  duplicateFound: boolean;
  resultScenario: Scenario;
  diagnosticsDelayMs: number;
}

export const defaultMockConfig: MockConfig = {
  duplicateFound: false,
  resultScenario: "internal-checks",
  diagnosticsDelayMs: 6000,
};
