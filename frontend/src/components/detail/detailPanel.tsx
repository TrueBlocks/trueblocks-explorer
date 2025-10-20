// TODO: BOGUS
//   1. Can we move this up a folder to avoid confusing extra utils folder
//   2. Why must we disable this lint?
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';

import { DetailTable, ShouldNotHappen } from '@components';
import { types } from '@models';

/**
 * Type definition for MetaOverlay configuration
 */
export interface MetaOverlay {
  section: string;
  detailLabel?: string;
  detailFormat?: 'address' | 'hash' | string;
  detailOrder?: number;
  detailOnly?: boolean;
  formatters?: Record<string, (value: any) => string>;
  extras?: Record<string, any>;
}

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
 * Creates a default detail panel function that renders key-value pairs
 * for any row data object. This is the fallback used when no custom
 * detail panel is provided.
 */
export const createDefaultDetailPanel = <
  T extends Record<string, unknown>,
>() => {
  const DefaultDetailPanel = (rowData: T | null) => {
    if (!rowData) {
      return <div className="no-selection">Loading...</div>;
    }

    return (
      <div>
        <h4>
          {(rowData as any).name
            ? `${(rowData as any).name} Details`
            : 'Row Details'}
        </h4>
        <div className="detail-panel-default">
          {Object.entries(rowData).map(([key, value]) => (
            <div key={key} className="detail-row">
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  DefaultDetailPanel.displayName = 'DefaultDetailPanel';
  return DefaultDetailPanel;
};

/**
 * Bridge function to build detail panels from column configurations.
 * This is a temporary bridge until all views migrate to backend ViewConfig.
 */
export const buildDetailPanelFromColumns = <T extends Record<string, unknown>>(
  columns: any[],
  meta: Record<string, MetaOverlay>,
  options?: {
    title?: string;
    collapsedSections?: string[];
    formatters?: Record<string, (value: any) => string>;
    extras?: Record<string, any>;
  },
) => {
  const dp = (rowData: T | null) => {
    if (!rowData) {
      return <div className="no-selection">Loading...</div>;
    }

    // Group columns by section if meta is provided
    const sections: Record<
      string,
      Array<{
        key: string;
        column: any;
        meta: MetaOverlay | undefined;
      }>
    > = {};

    columns.forEach((column) => {
      const key = column.key;
      const columnMeta = meta[key];
      const sectionName = columnMeta?.section || 'General';

      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }

      sections[sectionName].push({ key, column, meta: columnMeta });
    });

    return (
      <div>
        {options?.title && <h4>{options.title}</h4>}
        <div className="detail-panel-columns">
          {Object.entries(sections).map(([sectionName, sectionColumns]) => (
            <div key={sectionName} className="detail-section">
              <h5>{sectionName}</h5>
              {sectionColumns
                .sort(
                  (a, b) =>
                    (a.meta?.detailOrder || 99) - (b.meta?.detailOrder || 99),
                )
                .map(({ key, column, meta }) => {
                  const value = (rowData as any)[key];
                  if (value === undefined || value === null) return null;

                  return (
                    <div key={key} className="detail-row">
                      <strong>
                        {meta?.detailLabel ||
                          column.header ||
                          column.Header ||
                          key}
                        :
                      </strong>{' '}
                      {formatFieldValue(value, meta?.detailFormat)}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  dp.displayName = `DetailPanel_${options?.title || 'Columns'}`;
  return dp;
};

/**
 * Builds detail panels from backend ViewConfig DetailPanelConfig.
 * This is the new approach that uses backend-generated configuration.
 */
export const buildDetailPanelFromConfig = <T extends Record<string, unknown>>(
  panelConfig: types.DetailPanelConfig,
) => {
  const dp = (rowData: T | null) => {
    if (!rowData) {
      return <div className="no-selection">Loading...</div>;
    }

    return (
      <div>
        <h4>{panelConfig.title}</h4>
        <div className="detail-panel-config">
          {panelConfig.fields.map((field) => {
            const value = (rowData as any)[field.key];
            if (value === undefined || value === null) return null;

            return (
              <div key={field.key} className="detail-row">
                <strong>{field.label}:</strong>{' '}
                {formatFieldValue(value, field.formatter)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  dp.displayName = `DetailPanel_${panelConfig.title}`;
  return dp;
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
      rows: panelConfig.fields
        .map((field) => {
          const value = (rowData as any)[field.key];
          if (value === undefined || value === null) return null;

          return {
            label: field.label,
            value: formatFieldValue(value, field.formatter),
          };
        })
        .filter(Boolean) as { label: string; value: React.ReactNode }[],
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

/**
 * Format field values based on formatter type
 */
function formatFieldValue(value: any, formatter?: string): string {
  if (!formatter) return String(value);

  switch (formatter) {
    case 'address':
      return `${String(value).slice(0, 8)}...${String(value).slice(-6)}`;
    case 'hash':
      return `${String(value).slice(0, 10)}...${String(value).slice(-8)}`;
    case 'number':
      return Number(value).toLocaleString();
    case 'fileSize':
      // Simple file size formatting
      const bytes = Number(value);
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'timestamp':
      return new Date(Number(value) * 1000).toLocaleString();
    case 'computed':
      // For computed fields, we'd need additional logic here
      return String(value);
    default:
      return String(value);
  }
}
