import { chunks, types } from '@models';
import { formatNumericValue } from '@utils';

import { Aggregation, HeatmapPanel } from './HeatmapPanel';

export const BloomsPanelRenderer = (row: Record<string, unknown> | null) => {
  const bloomsConfig: Aggregation = {
    facetName: 'blooms',
    dataFacet: types.DataFacet.BLOOMS,
    defaultMetric: 'nBlooms',
    metrics: [
      {
        key: 'nBlooms',
        label: 'Number of Blooms',
        bucketsField: 'nBloomsBuckets' as keyof chunks.ChunksBuckets,
        statsField: 'nBloomsStats' as keyof chunks.ChunksBuckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'fileSize',
        label: 'File Size',
        bucketsField: 'fileSizeBuckets' as keyof chunks.ChunksBuckets,
        statsField: 'fileSizeStats' as keyof chunks.ChunksBuckets,
        formatValue: (value: number) =>
          formatNumericValue(Math.round(value), true),
        bytes: true,
      },
    ],
  };

  return <HeatmapPanel agData={bloomsConfig} row={row} />;
};
