import { useViewConfig } from '@hooks';
import { types } from '@models';

import { ChunksPanelRenderer } from './ChunksPanelRenderer';

export { ChunksPanelRenderer } from './ChunksPanelRenderer';

// Generic renderer factory that reads backend config
const createPanelRenderer = (dataFacet: types.DataFacet) => {
  return (row: Record<string, unknown> | null) => {
    const { config: viewConfig } = useViewConfig({ viewName: 'chunks' });
    const facetConfig = viewConfig?.facets?.[dataFacet];

    if (!facetConfig?.panelConfig) return null;

    return ChunksPanelRenderer({
      panelConfig: facetConfig.panelConfig,
      dataFacet,
      collection: 'chunks',
      row,
    });
  };
};

// Same exact structure as before - Chunks.tsx sees no difference!
export const renderers = {
  'chunks.blooms': createPanelRenderer(types.DataFacet.BLOOMS),
  'chunks.index': createPanelRenderer(types.DataFacet.INDEX),
  'chunks.stats': createPanelRenderer(types.DataFacet.STATS),
};
