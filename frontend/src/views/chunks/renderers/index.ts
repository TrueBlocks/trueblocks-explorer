import { useViewConfig } from '@hooks';
import { types } from '@models';

import { ChunksPanel } from './panels';

export * from './panels';

// Generic renderer factory that reads backend config
const createPanelRenderer = (dataFacet: types.DataFacet) => {
  return (row: Record<string, unknown> | null) => {
    const { config: viewConfig } = useViewConfig({ viewName: 'chunks' });
    const facetConfig = viewConfig?.facets?.[dataFacet];

    if (!facetConfig?.panelChartConfig) return null;

    return ChunksPanel({
      panelConfig: facetConfig.panelChartConfig,
      dataFacet,
      collection: 'chunks',
      row,
    });
  };
};

// Same exact structure as before - Chunks.tsx sees no difference!
export const renderers = {
  panels: {
    [types.DataFacet.BLOOMS]: createPanelRenderer(types.DataFacet.BLOOMS),
    [types.DataFacet.INDEX]: createPanelRenderer(types.DataFacet.INDEX),
    [types.DataFacet.STATS]: createPanelRenderer(types.DataFacet.STATS),
  },
  facets: {},
};
