// TODO: BOGUS
//   1. Can we move this up a folder to avoid confusing extra utils folder
//   2. Why must we disable this lint?
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';

import { DetailTable, FormField, ShouldNotHappen } from '@components';
import { types } from '@models';

/**
 * Creates a detail panel from ViewConfig or falls back to default
 * This function encapsulates all ViewConfig integration logic and returns
 * a simple detail panel function for use in BaseTab.
 */
export type DetailPanelFn<T = any> = (row: T | null) => ReactNode;

export const createDetailPanel = <T extends Record<string, unknown>>(
  viewConfig: types.ViewConfig | null | undefined,
  getCurrentDataFacet: () => string,
  customPanels: Record<string, DetailPanelFn<any>> = {},
): DetailPanelFn<T> => {
  // Get the current facet configuration
  const currentFacetConfig = viewConfig?.facets?.[getCurrentDataFacet()];

  // Check for a custom panel override first
  const facet = getCurrentDataFacet();

  // Check direct facet match first (e.g., "statements", "openapprovals")
  if (customPanels[facet]) return customPanels[facet] as DetailPanelFn<T>;

  // Check for compound keys (viewName.facetKey or viewName)
  if (viewConfig?.viewName) {
    const key = `${viewConfig.viewName}.${facet}`;
    if (customPanels[key]) return customPanels[key] as DetailPanelFn<T>;
    if (customPanels[viewConfig.viewName])
      return customPanels[viewConfig.viewName] as DetailPanelFn<T>;
  }

  return buildDetailPanelFromConfigs<T>(currentFacetConfig?.detailPanels);
};

/**
 * Builds detail panels from multiple DetailPanelConfig objects.
 * This creates a combined panel with multiple sections using proper styling.
 */
export const buildDetailPanelFromConfigs = <T extends Record<string, unknown>>(
  panelConfigs?: types.DetailPanelConfig[],
) => {
  const dp = (rowData: T | null) => {
    if (!rowData) {
      return <div className="no-selection">Loading...</div>;
    }

    if (!panelConfigs || !panelConfigs.length) {
      return (
        <ShouldNotHappen message="buildDetailPanelFromConfigs called with empty panelConfigs" />
      );
    }

    const sections = panelConfigs.map((panelConfig) => ({
      name: panelConfig.title,
      rows: panelConfig.fields as FormField[],
      rowData: rowData,
    }));

    // Respect backend collapsed flags per panel; default to no collapsed sections
    const defaultCollapsedSections = panelConfigs
      .filter((p) => p.collapsed)
      .map((p) => p.title);

    return (
      <DetailTable
        sections={sections}
        defaultCollapsedSections={defaultCollapsedSections}
      />
    );
  };

  dp.displayName = `DetailPanel_Combined`;
  return dp;
};
