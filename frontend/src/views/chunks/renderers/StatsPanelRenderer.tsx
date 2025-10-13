import { useCallback } from 'react';

import { GetChunksBuckets, GetChunksMetric, SetChunksMetric } from '@app';
import { BarchartPanel, BucketsConfig } from '@components';
import { usePayload } from '@hooks';
import { types } from '@models';
import { formatNumericValue } from '@utils';

import { ROUTE } from '../constants';

export const StatsPanelRenderer = (row: Record<string, unknown> | null) => {
  const statsConfig: BucketsConfig = {
    dataFacet: types.DataFacet.STATS,
    collection: ROUTE,
    defaultMetric: 'ratio',
    skipUntil: '2017',
    timeGroupBy: 'quarterly',
    metrics: [
      {
        key: 'ratio',
        label: 'Compressed',
        bucketsField: 'series0' as keyof types.Buckets,
        statsField: 'series0Stats' as keyof types.Buckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'appsPerBlk',
        label: 'Apps per Block',
        bucketsField: 'series1' as keyof types.Buckets,
        statsField: 'series1Stats' as keyof types.Buckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'addrsPerBlk',
        label: 'Addrs per Block',
        bucketsField: 'series2' as keyof types.Buckets,
        statsField: 'series2Stats' as keyof types.Buckets,
        formatValue: (value: number) =>
          formatNumericValue(Math.round(value), true),
        bytes: false,
      },
      {
        key: 'appsPerAddr',
        label: 'Apps per Addr',
        bucketsField: 'series3' as keyof types.Buckets,
        statsField: 'series3Stats' as keyof types.Buckets,
        formatValue: (value: number) =>
          formatNumericValue(Math.round(value), true),
        bytes: false,
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
      config={statsConfig}
      row={row}
      fetchBuckets={fetchBuckets}
      getMetric={getMetric}
      setMetric={setMetric}
    />
  );
};
