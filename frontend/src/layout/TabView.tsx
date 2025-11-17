import { Fragment, useCallback, useEffect, useState } from 'react';

import { StyledDivider } from '@components';
import { useActiveProject, useEvent } from '@hooks';
import { ActionIcon, Tabs } from '@mantine/core';
import { msgs, types } from '@models';

import './TabView.css';

interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
  dividerBefore?: boolean;
  canClose?: boolean;
}

interface TabViewProps {
  tabs: Tab[];
  route: string;
  onTabChange?: (newTab: string) => void;
  onHideFacet?: (facetId: string, e: React.MouseEvent) => void;
}

export const TabView = ({
  tabs,
  route,
  onTabChange,
  onHideFacet,
}: TabViewProps) => {
  const { getLastFacet, setLastFacet, loading, lastFacetMap } =
    useActiveProject();
  const [activeTab, setActiveTab] = useState<string>('');

  // Make activeTab purely reactive to backend state - no more restoration race conditions
  useEffect(() => {
    if (loading || tabs.length === 0) return;
    const vR = route.replace(/^\/+/, '');
    const savedTab = getLastFacet(vR);
    const isValidSavedTab =
      savedTab &&
      String(savedTab) !== 'undefined' &&
      tabs.some((tab) => tab.value === savedTab);
    const targetTab = isValidSavedTab ? savedTab : tabs[0]?.value || '';
    // Only update if different - prevents unnecessary re-renders
    if (targetTab && targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
  }, [lastFacetMap, route, tabs, loading, getLastFacet, activeTab]);

  const nextTab = useCallback((): string => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    return tabs[nextIndex]?.value || activeTab;
  }, [tabs, activeTab]);

  const prevTab = useCallback((): string => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    return tabs[prevIndex]?.value || activeTab;
  }, [tabs, activeTab]);

  useEvent<{ route: string; key: string }>(
    msgs.EventType.TAB_CYCLE,
    async (_message: string, event?: { route: string; key: string }) => {
      if (!event) return;
      const vER = event.route?.replace(/^\/+/, '') || '';
      const vR = route.replace(/^\/+/, '');
      if (vER === vR) {
        const newTab = event.key.startsWith('alt+') ? prevTab() : nextTab();
        // Backend-first update - UI will respond via useEffect above
        await setLastFacet(vR, newTab as types.DataFacet);
        if (onTabChange) {
          onTabChange(newTab);
        }
      }
    },
  );

  const handleTabChange = async (newTab: string | null) => {
    if (newTab === null) return;
    const vR = route.replace(/^\/+/, '');
    // Backend-first update - UI will respond via useEffect above
    await setLastFacet(vR, newTab as types.DataFacet);
    if (onTabChange) {
      onTabChange(newTab);
    }
  };

  return (
    <div className="tab-view-container">
      <Tabs
        value={activeTab}
        onChange={(value) => {
          handleTabChange(value);
        }}
      >
        <Tabs.List>
          {tabs.map((tab, index) => (
            <Fragment key={`tab-${index}`}>
              {tab.dividerBefore && <StyledDivider key={`divider-${index}`} />}
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                rightSection={
                  tab.canClose ? (
                    <ActionIcon
                      variant="subtle"
                      size="xs"
                      onClick={(e) => onHideFacet?.(tab.value, e)}
                      tabIndex={0}
                      c="error"
                    >
                      &#10005;
                    </ActionIcon>
                  ) : null
                }
              >
                {tab.label}
              </Tabs.Tab>
            </Fragment>
          ))}
        </Tabs.List>

        {tabs.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};
