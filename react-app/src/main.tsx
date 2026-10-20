import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Arc tokens + component styles
import "@arc-ui/tokens-arc/dist/index.css";
import "@arc-ui/tokens-bt-business/dist/index.css"; // BT Business theme (component + semantic tokens)
import "@arc-ui/icons/lib/component-icons-bt.css"; // BT component icon definitions (ThemeIcon)
import "@arc-ui/components/lib/styles.css";

// Component-specific CSS (not bundled in main styles.css)
import "@arc-ui/components/lib/Disclosure/styles.css";
import "@arc-ui/components/lib/RadioGroup/styles.css";
import "@arc-ui/components/lib/ContentSwitcher/styles.css";
import "@arc-ui/components/lib/SiteFooterV2/styles.css";
import "@arc-ui/components/lib/BrandLogo/styles.css";
import "@arc-ui/components/lib/Grid/styles.css";
import "@arc-ui/components/lib/ProgressStepper/styles.css";
import "@arc-ui/components/lib/Rule/styles.css";
import "@arc-ui/components/lib/VerticalSpace/styles.css";
import "@arc-ui/components/lib/Spinner/styles.css";
import "@arc-ui/components/lib/Alert/styles.css";
import "@arc-ui/components/lib/Select/styles.css";
import "@arc-ui/components/lib/TextInput/styles.css";
import "@arc-ui/components/lib/ComboBox/styles.css";
import "@arc-ui/components/lib/Pagination/styles.css";
import "@arc-ui/components/lib/NavigationHeader/styles.css";
import "@arc-ui/components/lib/ButtonV2/styles.css";
import "@arc-ui/components/lib/Heading/styles.css";
import "@arc-ui/components/lib/Text/styles.css";
import "@arc-ui/components/lib/Badge/styles.css";
import "@arc-ui/components/lib/Breadcrumbs/styles.css";
import "@arc-ui/components/lib/Spacing/styles.css";

// App-level overrides
import "./app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
