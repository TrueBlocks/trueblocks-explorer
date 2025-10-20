import { types } from '@models';

export type TimeGroupBy = 'daily' | 'monthly' | 'quarterly' | 'annual';

export type PanelRenderer = (
  rowData: Record<string, unknown> | null,
) => React.ReactNode;

export type FacetRenderer<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (ctx: { data: T | Record<string, unknown> }) => React.ReactNode;
export type RendererMap = {
  panels: Partial<Record<types.DataFacet, PanelRenderer>>;
  facets: Partial<Record<types.DataFacet, FacetRenderer>>;
};

export type AnyRenderer = PanelRenderer | FacetRenderer;
