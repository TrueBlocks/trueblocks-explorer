import { useCallback } from 'react';

import { GetChunksBuckets, GetChunksMetric, SetChunksMetric } from '@app';
import { BarchartPanel } from '@components';
import { usePayload } from '@hooks';
import { chunks, types } from '@models';
import { formatNumericValue } from '@utils';

import { Aggregation } from './';

export const StatsPanelRenderer = (_row: Record<string, unknown> | null) => {
  const createPayload = usePayload();

  const statsConfig: Aggregation = {
    facetName: 'stats',
    dataFacet: types.DataFacet.STATS,
    defaultMetric: 'nAddrs',
    metrics: [
      {
        key: 'nAddrs',
        label: 'Number of Addresses',
        bucketsField: 'nAddressesBuckets' as keyof chunks.ChunksBuckets,
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
      agData={statsConfig}
      row={null}
      fetchBuckets={fetchBuckets}
      getMetric={getMetric}
      setMetric={setMetric}
      eventCollection="chunks"
    />
  );
};
