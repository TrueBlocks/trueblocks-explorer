import { useMemo } from 'react';

import { types } from '@models';

export interface BucketStats {
  total: number;
  average: number;
  min: number;
  max: number;
  count: number;
}

export const useBucketStats = (buckets: types.Bucket[]): BucketStats => {
  return useMemo(() => {
    if (!buckets || buckets.length === 0) {
      return { total: 0, average: 0, min: 0, max: 0, count: 0 };
    }

    // Single pass through the data
    const stats = buckets.reduce(
      (acc, bucket) => {
        const value = bucket.total;
        return {
          total: acc.total + value,
          min: Math.min(acc.min, value),
          max: Math.max(acc.max, value),
          count: acc.count + 1,
        };
      },
      {
        total: 0,
        min: buckets[0]!.total, // Initialize with first value
        max: buckets[0]!.total, // Initialize with first value
        count: 0,
      },
    );

    const average = stats.count > 0 ? stats.total / stats.count : 0;

    return { ...stats, average };
  }, [buckets]);
};
