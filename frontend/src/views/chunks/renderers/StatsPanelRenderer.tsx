import { useCallback } from 'react';

import { GetChunksBuckets, GetChunksMetric, SetChunksMetric } from '@app';
import { Aggregation, BarchartPanel } from '@components';
import { usePayload } from '@hooks';
import { chunks, types } from '@models';
import { formatNumericValue } from '@utils';

export const StatsPanelRenderer = (row: Record<string, unknown> | null) => {
  const statsConfig: Aggregation = {
    dataFacet: types.DataFacet.STATS,
    defaultMetric: 'nAddrs',
    metrics: [
      {
        key: 'nAddrs',
        label: 'Number of Addresses',
        bucketsField: 'series0' as keyof chunks.ChunksBuckets,
        statsField: 'nAddressesStats' as keyof chunks.ChunksBuckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'nApps',
        label: 'Number of Appearances',
        bucketsField: 'nAppearancesBuckets' as keyof chunks.ChunksBuckets,
        statsField: 'nAppearancesStats' as keyof chunks.ChunksBuckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'chunkSz',
        label: 'Chunk Size',
        bucketsField: 'fileSizeBuckets' as keyof chunks.ChunksBuckets,
        statsField: 'fileSizeStats' as keyof chunks.ChunksBuckets,
        formatValue: (value: number) =>
          formatNumericValue(Math.round(value), true),
        bytes: true,
      },
    ],
  };

  const createPayload = usePayload();
  const fetchBuckets = useCallback(async () => {
    const payload = createPayload(statsConfig.dataFacet);
    const result = await GetChunksBuckets(payload);
    if (!result) {
      throw new Error('No data returned from API');
    }
    return result;
  }, [createPayload, statsConfig.dataFacet]);

  const getMetric = useCallback(
    async (facetName: string) => {
      const saved = await GetChunksMetric(facetName);
      const validMetric = statsConfig.metrics.find((m) => m.key === saved);
      return validMetric ? validMetric.key : statsConfig.defaultMetric;
    },
    [statsConfig.metrics, statsConfig.defaultMetric],
  );

  const setMetric = useCallback(async (facetName: string, metric: string) => {
    await SetChunksMetric(facetName, metric);
  }, []);

  return (
    <BarchartPanel
      aggConfig={statsConfig}
      row={row}
      fetchBuckets={fetchBuckets}
      getMetric={getMetric}
      setMetric={setMetric}
      eventCollection="chunks"
    />
  );
};
