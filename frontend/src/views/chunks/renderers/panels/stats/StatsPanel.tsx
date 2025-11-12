import { useViewConfig } from '@hooks';
import { types } from '@models';

import { ChunksPanel } from '../chunks/ChunksPanel';

export const StatsPanel = (row: Record<string, unknown> | null) => {
  const { config: viewConfig } = useViewConfig({ viewName: 'chunks' });
  const facetConfig = viewConfig?.facets?.[types.DataFacet.STATS];

  if (!facetConfig?.panelChartConfig) return null;

  return (
    <ChunksPanel
      panelConfig={facetConfig.panelChartConfig}
      dataFacet={types.DataFacet.STATS}
      collection="chunks"
      row={row}
    />
  );
};
