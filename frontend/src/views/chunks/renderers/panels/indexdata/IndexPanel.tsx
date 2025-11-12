import { useViewConfig } from '@hooks';
import { types } from '@models';

import { ChunksPanel } from '../chunks/ChunksPanel';

export const IndexPanel = (row: Record<string, unknown> | null) => {
  const { config: viewConfig } = useViewConfig({ viewName: 'chunks' });
  const facetConfig = viewConfig?.facets?.[types.DataFacet.INDEX];

  if (!facetConfig?.panelChartConfig) return null;

  return (
    <ChunksPanel
      panelConfig={facetConfig.panelChartConfig}
      dataFacet={types.DataFacet.INDEX}
      collection="chunks"
      row={row}
    />
  );
};
