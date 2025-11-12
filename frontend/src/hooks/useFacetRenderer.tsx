import { useMemo } from 'react';

import { FormField } from '@components';
import { types } from '@models';

type RendererCtx<T extends Record<string, unknown>> = {
  data: T[];
  columns: FormField<T>[];
  facet: types.DataFacet;
};

type RendererMap<T extends Record<string, unknown>> = Partial<
  Record<types.DataFacet, (ctx: RendererCtx<T>) => React.ReactNode>
>;

interface UseFacetRendererParams<T extends Record<string, unknown>> {
  viewConfig: types.ViewConfig;
  getCurrentDataFacet: () => types.DataFacet;
  currentData: T[];
  currentColumns: FormField<T>[];
  renderers?: RendererMap<T>;
  viewName: string;
}

/**
 * Self-contained hook that handles facet rendering with proper warnings
 * when renderers are expected but missing.
 *
 * Used in auto-generated view files to provide consistent renderer behavior.
 */
export function useFacetRenderer<T extends Record<string, unknown>>({
  viewConfig,
  getCurrentDataFacet,
  currentData,
  currentColumns,
  renderers,
}: UseFacetRendererParams<T>): {
  isCanvas: boolean;
  node: React.ReactNode | null;
  facetConfig?: types.FacetConfig;
} {
  const facet = getCurrentDataFacet();
  const facetConfig = viewConfig?.facets?.[facet];
  const isCanvas = facetConfig?.viewType !== 'table';

  const node = useMemo(() => {
    if (!isCanvas) return null;

    const data = currentData || [];
    const hasCustomRenderer = renderers && renderers[facet];
    if (hasCustomRenderer && data.length > 0) {
      const renderer = renderers[facet];
      return renderer
        ? renderer({ data, columns: currentColumns, facet })
        : null;
    }

    // No custom renderer expected OR no data - return null (fall back to default form handling)
    return null;
  }, [isCanvas, currentData, currentColumns, renderers, facet]);

  return { isCanvas, node, facetConfig };
}
