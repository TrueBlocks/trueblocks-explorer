import { types } from '@models';

export type TimeGroupBy = 'daily' | 'monthly' | 'quarterly' | 'annual';

export type PanelRenderer = (
  rowData: Record<string, unknown> | null,
) => React.ReactNode;

export type RendererParams = {
  data: Record<string, unknown>[];
  columns: unknown[];
  facet: types.DataFacet;
};

export type FacetRenderer = (params: RendererParams) => React.ReactNode;
export type RendererMap = {
  panels: Partial<Record<types.DataFacet, PanelRenderer>>;
  facets: Partial<Record<types.DataFacet, FacetRenderer>>;
};

export type AnyRenderer = PanelRenderer | FacetRenderer;
