import { useCallback } from 'react';

import { GetChunksBuckets, GetChunksMetric, SetChunksMetric } from '@app';
import { usePayload } from '@hooks';
import { types } from '@models';

export const useChunksPanelRenderer = (dataFacet: types.DataFacet) => {
  const createPayload = usePayload();

  const fetchBuckets = useCallback(async () => {
    const payload = createPayload(dataFacet);
    const result = await GetChunksBuckets(payload);
    if (!result) {
      throw new Error('No data returned from API');
    }
    return result;
  }, [createPayload, dataFacet]);

  const getMetric = useCallback(
    async (
      facetName: string,
      metrics: types.MetricConfig[],
      defaultMetric: string,
    ) => {
      const saved = await GetChunksMetric(facetName);
      const validMetric = metrics.find((m) => m.key === saved);
      return validMetric ? validMetric.key : defaultMetric;
    },
    [],
  );

  const setMetric = useCallback(async (facetName: string, metric: string) => {
    await SetChunksMetric(facetName, metric);
  }, []);

  return { fetchBuckets, getMetric, setMetric };
};
