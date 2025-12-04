// TODO: BOGUS
//   1. Can we move this up a folder to avoid confusing extra utils folder
import type { ReactNode } from 'react';

import {
  DetailTable,
  FormField,
  PanelRenderer,
  ShouldNotHappen,
} from '@components';
import { types } from '@models';

const NoSelection = () => <div className="no-selection">Loading...</div>;

/**
 * The function returned by createDetailPanel that BaseTab uses to render detail panels.
 * This wrapper handles null checking and calls the actual PanelRenderer with non-null data.
 */
export type DetailPanelRenderer<T = Record<string, unknown>> = (
  row: T | null,
) => ReactNode;

/**
 * Creates a detail panel from ViewConfig or falls back to default.
 * This function encapsulates all ViewConfig integration logic and returns
 * a simple detail panel function for use in BaseTab.
 */
export const createDetailPanel = <T extends Record<string, unknown>>(
  viewConfig: types.ViewConfig | null | undefined,
  getCurrentDataFacet: () => string,
  customPanels: Record<string, PanelRenderer> = {},
  onFinal: (rowKey: string, newValue: string, txHash: string) => void,
): DetailPanelRenderer<T> => {
  const panelFunction = (rowData: T | null) => {
    const facet = getCurrentDataFacet();

    // Get the current facet configuration
    const currentFacetConfig = viewConfig?.facets?.[facet];

    // Check for a custom panel override first
    // Check direct facet match first (e.g., "statements", "openapprovals")
    if (customPanels[facet]) {
      const panelFn = customPanels[facet] as PanelRenderer;
      return rowData ? (
        panelFn(rowData, onFinal)
      ) : (
        <div className="no-selection">Loading...</div>
      );
    }

    // Check for compound keys (viewName.facetKey or viewName)
    if (viewConfig?.viewName) {
      const key = `${viewConfig.viewName}.${facet}`;
      if (customPanels[key]) {
        const panelFn = customPanels[key] as PanelRenderer;
        return rowData ? (
          panelFn(rowData, onFinal)
        ) : (
          <div className="no-selection">Loading...</div>
        );
      }
      if (customPanels[viewConfig.viewName]) {
        const panelFn = customPanels[viewConfig.viewName] as PanelRenderer;
        return rowData ? (
          panelFn(rowData, onFinal)
        ) : (
          <div className="no-selection">Loading...</div>
        );
      }
    }

    // Fall back to default panel configuration
    const defaultPanel = buildDetailPanelFromConfigs<T>(
      facet,
      currentFacetConfig?.detailPanels,
    );
    return rowData ? defaultPanel(rowData) : <NoSelection />;
  };

  panelFunction.displayName = 'DetailPanel';
  return panelFunction;
};

/**
 * Builds detail panels from multiple DetailPanelConfig objects.
 * This creates a combined panel with multiple sections using proper styling.
 */
export const buildDetailPanelFromConfigs = <T extends Record<string, unknown>>(
  facet: string,
  panelConfigs?: types.DetailPanelConfig[],
) => {
  const dp = (rowData: T) => {
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
        facet={facet}
        sections={sections}
        defaultCollapsedSections={defaultCollapsedSections}
      />
    );
  };

  dp.displayName = `DetailPanel_Combined`;
  return dp;
};
