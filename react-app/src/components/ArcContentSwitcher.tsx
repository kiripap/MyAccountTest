import { ContentSwitcher, ContentSwitcherList, ContentSwitcherTab } from "@arc-ui/components/ContentSwitcher";

interface ArcContentSwitcherProps {
  tabs: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
}

export function ArcContentSwitcher({ tabs, value, onValueChange }: ArcContentSwitcherProps) {
  return (
    <div className="switcher-row">
      <ContentSwitcher value={value} onValueChange={onValueChange}>
        <ContentSwitcherList>
          {tabs.map((tab) => (
            <ContentSwitcherTab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </ContentSwitcherList>
      </ContentSwitcher>
    </div>
  );
}
