import { chunks, types } from '@models';
import { formatNumericValue } from '@utils';

import { Aggregation, HeatmapPanel } from './HeatmapPanel';

export const IndexPanelRenderer = (row: Record<string, unknown> | null) => {
  const indexConfig: Aggregation = {
    facetName: 'INDEX',
    dataFacet: types.DataFacet.INDEX,
    defaultMetric: 'nAddresses',
    metrics: [
      {
        key: 'nAddresses',
        label: 'Number of Addresses',
        bucketsField: 'nAddressesBuckets' as keyof chunks.ChunksBuckets,
        statsField: 'nAddressesStats' as keyof chunks.ChunksBuckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'nAppearances',
        label: 'Number of Appearances',
        bucketsField: 'nAppearancesBuckets' as keyof chunks.ChunksBuckets,
        statsField: 'nAppearancesStats' as keyof chunks.ChunksBuckets,
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

  return <HeatmapPanel agData={indexConfig} row={row} />;
};
