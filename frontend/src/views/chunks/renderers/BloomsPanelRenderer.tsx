import { useCallback } from 'react';

import { GetChunksBuckets, GetChunksMetric, SetChunksMetric } from '@app';
import { BucketsConfig, HeatmapPanel } from '@components';
import { usePayload } from '@hooks';
import { types } from '@models';
import { formatNumericValue } from '@utils';

import { ROUTE } from '../constants';

export const BloomsPanelRenderer = (row: Record<string, unknown> | null) => {
  const bloomsConfig: BucketsConfig = {
    dataFacet: types.DataFacet.BLOOMS,
    collection: ROUTE,
    defaultMetric: 'nBlooms',
    metrics: [
      {
        key: 'nBlooms',
        label: 'Number of Blooms',
        bucketsField: 'series3' as keyof types.Buckets,
        statsField: 'series3Stats' as keyof types.Buckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'fileSize',
        label: 'File Size',
        bucketsField: 'series2' as keyof types.Buckets,
        statsField: 'series2Stats' as keyof types.Buckets,
        formatValue: (value: number) =>
          formatNumericValue(Math.round(value), true),
        bytes: true,
      },
    ],
  };

  const createPayload = usePayload();
  const fetchBuckets = useCallback(async () => {
    const payload = createPayload(bloomsConfig.dataFacet);
    const result = await GetChunksBuckets(payload);
    if (!result) {
      throw new Error('No data returned from API');
    }
    return result;
  }, [createPayload, bloomsConfig.dataFacet]);

  const getMetric = useCallback(
    async (facetName: string) => {
      const saved = await GetChunksMetric(facetName);
      const validMetric = bloomsConfig.metrics.find((m) => m.key === saved);
      return validMetric ? validMetric.key : bloomsConfig.defaultMetric;
    },
    [bloomsConfig.metrics, bloomsConfig.defaultMetric],
  );

  const setMetric = useCallback(async (facetName: string, metric: string) => {
    await SetChunksMetric(facetName, metric);
  }, []);

  return (
    <HeatmapPanel
      config={bloomsConfig}
      row={row}
      fetchBuckets={fetchBuckets}
      getMetric={getMetric}
      setMetric={setMetric}
    />
  );
};
