import { types } from '@models';

export type TimeGroupBy = 'daily' | 'monthly' | 'quarterly' | 'annual';

/**
 * Panel renderer function signature.
 * All detail panels must conform to this signature to ensure type safety.
 *
 * @param rowData - The row data to render (never null - wrapper handles null checking)
 * @param onFinal - Callback when panel action completes (e.g., transaction success)
 */
export type PanelRenderer = (
  rowData: Record<string, unknown>,
  onFinal: (rowKey: string, newValue: string, txHash: string) => void,
) => React.ReactNode;

export type RendererParams = {
  data: Record<string, unknown>[];
  columns: unknown[];
  facet: types.DataFacet;
  onRowAction?: (rowData: Record<string, unknown>) => void;
};

export type FacetRenderer = (params: RendererParams) => React.ReactNode;

export type FacetRendererMap = Partial<Record<types.DataFacet, FacetRenderer>>;
