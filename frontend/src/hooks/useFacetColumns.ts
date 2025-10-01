import { useMemo } from 'react';

import { FormField } from '@components';
import { types } from '@models';

import { toPageDataProp, useColumns } from './useColumns';
import type { ActionConfig, ActionHandlers, ColumnConfig } from './useColumns';

// Convert backend ColumnConfig to frontend FormField
function convertColumnConfigToFormField(
  columnConfig: types.ColumnConfig,
): FormField<Record<string, unknown>> {
  return {
    key: columnConfig.key,
    header: columnConfig.header,
    name: columnConfig.key,
    label: columnConfig.header,
    type: columnConfig.formatter as FormField['type'], // Map formatter to type for proper formatting
    width: columnConfig.width,
    sortable: columnConfig.sortable,
    value: '',
    onChange: () => {},
    onBlur: () => {},
  };
}

/**
 * Shared hook to generate columns for a view based on facet and config.
 * Keeps all views consistent and DRY.
 */
export function useFacetColumns(
  viewConfig: types.ViewConfig,
  getCurrentDataFacet: () => types.DataFacet,
  columnConfig: ColumnConfig<Record<string, unknown>>,
  handlers: ActionHandlers,
  pageData: unknown,
  actionConfig: ActionConfig,
) {
  const baseCols = useMemo(() => {
    const backendColumns =
      viewConfig?.facets?.[getCurrentDataFacet()]?.columns || [];
    return backendColumns.map(convertColumnConfigToFormField);
  }, [viewConfig, getCurrentDataFacet]);

  return useColumns(
    baseCols,
    columnConfig,
    handlers,
    toPageDataProp(pageData),
    actionConfig,
  );
}
