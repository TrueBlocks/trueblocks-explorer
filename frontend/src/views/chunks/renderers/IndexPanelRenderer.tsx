import { useCallback } from 'react';

import { GetChunksBuckets, GetChunksMetric, SetChunksMetric } from '@app';
import { BucketsConfig, HeatmapPanel } from '@components';
import { usePayload } from '@hooks';
import { types } from '@models';
import { formatNumericValue } from '@utils';

import { ROUTE } from '../constants';

export const IndexPanelRenderer = (row: Record<string, unknown> | null) => {
  const indexConfig: BucketsConfig = {
    dataFacet: types.DataFacet.INDEX,
    collection: ROUTE,
    defaultMetric: 'nAddresses',
    // skipUntil: '2017',
    // timeGroupBy: 'quarterly',
    metrics: [
      {
        key: 'nAddresses',
        label: 'Number of Addresses',
        bucketsField: 'series0' as keyof types.Buckets,
        statsField: 'series0Stats' as keyof types.Buckets,
        formatValue: (value: number) => formatNumericValue(Math.round(value)),
        bytes: false,
      },
      {
        key: 'nAppearances',
        label: 'Number of Appearances',
        bucketsField: 'series1' as keyof types.Buckets,
        statsField: 'series1Stats' as keyof types.Buckets,
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
    const payload = createPayload(indexConfig.dataFacet);
    const result = await GetChunksBuckets(payload);
    if (!result) {
      throw new Error('No data returned from API');
    }
    return result;
  }, [createPayload, indexConfig.dataFacet]);

  const getMetric = useCallback(
    async (facetName: string) => {
      const saved = await GetChunksMetric(facetName);
      const validMetric = indexConfig.metrics.find((m) => m.key === saved);
      return validMetric ? validMetric.key : indexConfig.defaultMetric;
    },
    [indexConfig.metrics, indexConfig.defaultMetric],
  );

  const setMetric = useCallback(async (facetName: string, metric: string) => {
    await SetChunksMetric(facetName, metric);
  }, []);

  return (
    <HeatmapPanel
      config={indexConfig}
      row={row}
      fetchBuckets={fetchBuckets}
      getMetric={getMetric}
      setMetric={setMetric}
    />
  );
};
