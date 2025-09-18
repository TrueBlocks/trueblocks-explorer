import { useMemo } from 'react';

import { types } from '@models';

import { toPageDataProp, useColumns } from './useColumns';
import type { ActionConfig, ActionHandlers, ColumnConfig } from './useColumns';

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
  const baseCols = useMemo(
    () => viewConfig?.facets?.[getCurrentDataFacet()]?.columns || [],
    [viewConfig, getCurrentDataFacet],
  );
  return useColumns(
    baseCols as unknown as Record<string, unknown>[],
    columnConfig,
    handlers,
    toPageDataProp(pageData),
    actionConfig,
  );
}
