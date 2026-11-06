import { useState, type CSSProperties, type ReactNode } from "react";

import { Box } from "@arc-ui/components/Box";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Heading } from "@arc-ui/components/Heading";
import { Icon } from "@arc-ui/components/Icon";
import { Tabs, TabsContent, TabsItem, TabsList } from "@arc-ui/components/Tabs";
import { Text } from "@arc-ui/components/Text";
import { VisuallyHidden } from "@arc-ui/components/VisuallyHidden";
import { BtIconArrowAltRight } from "@arc-ui/icons/BtIconArrowAltRight";
import { BtIconCalendar } from "@arc-ui/icons/BtIconCalendar";
import { BtIconChevronRightMid } from "@arc-ui/icons/BtIconChevronRightMid";
import { BtIconLocation } from "@arc-ui/icons/BtIconLocation";
import { BtIconShield } from "@arc-ui/icons/BtIconShield";
import { BtIconWholeHomeWifi } from "@arc-ui/icons/BtIconWholeHomeWifi";
import { BtIconWiFi } from "@arc-ui/icons/BtIconWiFi";

import { useCountUp } from "./useCountUp";

/** Staggered fade/slide-in. `i` is the item's position in the reveal order. */
const reveal = (i: number, extraClass?: string) => ({
  className: extraClass ? `ob-reveal ${extraClass}` : "ob-reveal",
  style: { "--i": i } as CSSProperties,
});

/* ─────────────────────────── Welcome ─────────────────────────── */

interface StatProps {
  /**
   * Target number to count up to.
   */
  value: number;
  /**
   * Decimal places to show while counting.
   */
  decimals?: number;
  /**
   * Text shown after the number, e.g. "+", "m", "%".
   */
  suffix: string;
  /**
   * Supporting copy under the number.
   */
  children: ReactNode;
  /**
   * Delay before counting starts (ms).
   */
  delay: number;
  /**
   * Position in the reveal order.
   */
  index: number;
}

const Stat = ({ value, decimals = 0, suffix, children, delay, index }: StatProps) => {
  const current = useCountUp(value, { delay, duration: 1300 });
  const format = (n: number) =>
    n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <li {...reveal(index)}>
      <div className="ob-stat-value">
        <Heading level="3" size="l" fontStyle="display-standard" casing="none" isResponsive={false}>
          <span aria-hidden="true">
            {format(current)}
            {suffix}
          </span>
          <VisuallyHidden>
            {format(value)}
            {suffix}
          </VisuallyHidden>
        </Heading>
      </div>
      <Text size="m" elementType="p">
        {children}
      </Text>
    </li>
  );
};

export const WelcomePanel = ({ firstName, baseDelay }: WelcomePanelProps) => (
  <div className="ob-panel ob-panel--welcome">
    <div className="ob-welcome-intro">
      <div className="ob-welcome-title">
        <Heading level="2" size="xxl" id="ob-welcome-title">
          <span {...reveal(0)}>Hey</span> <span {...reveal(1)}>{firstName}</span>
        </Heading>
      </div>
      <div {...reveal(2)}>
        <Text size="l" elementType="p">
          Thanks for choosing BT Business.
        </Text>
      </div>
    </div>

    <ul className="ob-stats" aria-label="Why businesses choose BT">
      <Stat value={800000} suffix="+" delay={baseDelay + 450} index={4}>
        businesses across the UK trust us to keep them <strong>secure</strong> and{" "}
        <strong>connected.</strong>
      </Stat>
      <Stat value={23.4} decimals={1} suffix="m" delay={baseDelay + 600} index={5}>
        UK premises reached by our Full Fibre network.
      </Stat>
      <Stat value={77} suffix="%" delay={baseDelay + 750} index={6}>
        of the UK population covered by EE 5G+
      </Stat>
    </ul>
  </div>
);

interface WelcomePanelProps {
  /**
   * Customer's first name for the greeting.
   */
  firstName: string;
  /**
   * Delay (ms) before the panel's reveal sequence starts; count-ups are timed off it.
   */
  baseDelay: number;
}

/* ──────────────────────── Shared tile ────────────────────────── */

interface InfoTileProps {
  /**
   * Arc icon data URI.
   */
  icon: string;
  /**
   * Overline label.
   */
  label: string;
  /**
   * Main tile copy.
   */
  children: ReactNode;
  /**
   * Action button rendered on the right.
   */
  action: ReactNode;
  /**
   * Position in the reveal order.
   */
  index: number;
}

const InfoTile = ({ icon, label, children, action, index }: InfoTileProps) => (
  <li {...reveal(index)}>
    <Box surface="light-neutral-01" padding="16" isBorderRadius>
      <div className="ob-tile">
        <Icon icon={icon} size={40} />
        <div className="ob-tile-copy">
          <Heading fontStyle="overline">{label}</Heading>
          {children}
        </div>
        <div className="ob-tile-action">{action}</div>
      </div>
    </Box>
  </li>
);

const PRODUCT_TABS = [
  { label: "Broadband", value: "broadband" },
  { label: "Digital Voice", value: "voice" },
  { label: "Security", value: "security" },
];

interface ProductTabsProps {
  /**
   * Accessible name for the tab list.
   */
  ariaLabel: string;
  /**
   * Content for the Broadband tab.
   */
  broadband: ReactNode;
  /**
   * Placeholder copy for the other tabs.
   */
  emptyCopy: (product: string) => string;
}

const ProductTabs = ({ ariaLabel, broadband, emptyCopy }: ProductTabsProps) => {
  const [active, setActive] = useState("broadband");

  return (
    <Tabs defaultValue="broadband" onValueChange={setActive}>
      <div {...reveal(1)}>
        <TabsList ariaLabel={ariaLabel}>
          {PRODUCT_TABS.map((tab) => (
            <TabsItem key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </TabsList>
      </div>
      {/* `hidden` removes inactive panels from layout so the footer stays put */}
      <TabsContent value="broadband" hidden={active !== "broadband"}>
        {broadband}
      </TabsContent>
      {PRODUCT_TABS.slice(1).map((tab) => (
        <TabsContent key={tab.value} value={tab.value} hidden={active !== tab.value}>
          <div className="ob-tab-empty">
            <Text size="m" tone="supporting" elementType="p">
              {emptyCopy(tab.label)}
            </Text>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

/* ─────────────────────────── Tracking ─────────────────────────── */

export const TrackingPanel = () => (
  <div className="ob-panel">
    <div className="ob-panel-head">
      <div {...reveal(0, "ob-phase-title")}>
        <Heading level="2" size="xl" isResponsive={false} id="ob-tracking-title">
          Track your order
        </Heading>
      </div>
      <ProductTabs
        ariaLabel="Orders by product"
        emptyCopy={(p) => `You don't have any ${p} orders in progress.`}
        broadband={
          <div className="ob-product">
            <div {...reveal(2)}>
              <Heading level="3" size="s" isResponsive={false}>
                Full Fibre pro 500
              </Heading>
            </div>
            <ul className="ob-tiles">
              <InfoTile
                index={3}
                icon={BtIconCalendar}
                label="Installation date:"
                action={
                  <ButtonV2
                    label="Amend"
                    buttonStyle="compact"
                    icon={BtIconChevronRightMid}
                    iconPosition="afterText"
                    ariaLabel="Amend installation date"
                  />
                }
              >
                <Text size="m">
                  <strong>Monday, 14 December</strong>
                </Text>
              </InfoTile>
              <InfoTile
                index={4}
                icon={BtIconLocation}
                label="Installation address:"
                action={
                  <ButtonV2
                    label="More info"
                    buttonStyle="compact"
                    icon={BtIconChevronRightMid}
                    iconPosition="afterText"
                    ariaLabel="More info about installation address"
                  />
                }
              >
                <Text size="m">
                  <strong>1 Braham, E1 8EE</strong>
                </Text>
              </InfoTile>
            </ul>
          </div>
        }
      />
    </div>
  </div>
);

/* ─────────────────────────── Products ─────────────────────────── */

const PRODUCT_EXTRAS = [
  { icon: BtIconWholeHomeWifi, label: "Guest WiFi", copy: "Activate a separate network for your customers" },
  { icon: BtIconShield, label: "BT Web Protect", copy: "Protect your network from malicious websites" },
  { icon: BtIconWiFi, label: "WiFi extenders", copy: "Need to boost your signal - order wifi-discs for free" },
];

export const ProductsPanel = () => (
  <div className="ob-panel">
    <div className="ob-panel-head">
      <div {...reveal(0, "ob-phase-title")}>
        <Heading level="2" size="xl" isResponsive={false} id="ob-products-title">
          Making the most out of your products
        </Heading>
      </div>
      <ProductTabs
        ariaLabel="Products"
        emptyCopy={(p) => `Extras for ${p} will show here once it's set up.`}
        broadband={
          <div className="ob-product">
            <div {...reveal(2)}>
              <Heading level="3" size="s" isResponsive={false}>
                Full Fibre pro 500
              </Heading>
            </div>
            <ul className="ob-tiles">
              {PRODUCT_EXTRAS.map((extra, i) => (
                <InfoTile
                  key={extra.label}
                  index={3 + i}
                  icon={extra.icon}
                  label={extra.label}
                  action={
                    <ButtonV2
                      buttonStyle="compact"
                      icon={BtIconChevronRightMid}
                      ariaLabel={`Find out about ${extra.label}`}
                    />
                  }
                >
                  <Text size="m">{extra.copy}</Text>
                </InfoTile>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  </div>
);

/* ─────────────────────────── Billing ─────────────────────────── */

const BILLING_FIRST_BILL_COPY =
  "This is due to one\u2011off charges being included, along with a pro\u2011rated charge that covers the time between your service activation and your first full billing period.";

const BILLING_DIRECT_DEBIT_COPY =
  "Set up a Direct Debit to pay your bills automatically, giving you one less thing to remember.";

export const BillingPanel = () => (
  <div className="ob-panel">
    <div {...reveal(0, "ob-phase-title")}>
      <Heading level="2" size="xl" isResponsive={false} id="ob-billing-title">
        Billing made simple
      </Heading>
    </div>
    <div {...reveal(1, "ob-billing-card")}>
      <Box surface="light-neutral-01" padding="32" isBorderRadius>
        <div className="ob-billing-sections">
          <div {...reveal(2)}>
            <Heading level="3" size="s" isResponsive={false}>
              Your first bill may be higher than expected
            </Heading>
            <Text size="m" elementType="p">
              {BILLING_FIRST_BILL_COPY}
            </Text>
            <div className="ob-billing-action">
              <ButtonV2
                label="View bills"
                buttonStyle="tertiary"
                icon={BtIconArrowAltRight}
                iconPosition="afterText"
              />
            </div>
          </div>
          <div {...reveal(3)}>
            <Heading level="3" size="s" isResponsive={false}>
              Never miss a payment with direct debit
            </Heading>
            <Text size="m" elementType="p">
              {BILLING_DIRECT_DEBIT_COPY}
            </Text>
            <div className="ob-billing-action">
              <ButtonV2
                label="Set up direct debit"
                buttonStyle="tertiary"
                icon={BtIconArrowAltRight}
                iconPosition="afterText"
              />
            </div>
          </div>
        </div>
      </Box>
    </div>
  </div>
);
