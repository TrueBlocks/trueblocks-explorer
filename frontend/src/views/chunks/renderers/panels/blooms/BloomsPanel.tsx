import { useViewConfig } from '@hooks';
import { types } from '@models';

import { ChunksPanel } from '../chunks/ChunksPanel';

export const BloomsPanel = (row: Record<string, unknown> | null) => {
  const { config: viewConfig } = useViewConfig({ viewName: 'chunks' });
  const facetConfig = viewConfig?.facets?.[types.DataFacet.BLOOMS];

  if (!facetConfig?.panelChartConfig) return null;

  return (
    <ChunksPanel
      panelConfig={facetConfig.panelChartConfig}
      dataFacet={types.DataFacet.BLOOMS}
      collection="chunks"
      row={row}
    />
  );
};
