import { TimeGroupBy } from '@components';
import { types } from '@models';

/**
 * Aggregates daily bucket data into larger time periods
 * @param buckets Array of daily buckets with YYYYMMDD keys
 * @param groupBy How to group the buckets (daily, quarterly, annual)
 * @returns Aggregated buckets with new keys and summed values
 */
export function aggregateTimeBasedBuckets(
  buckets: types.Bucket[],
  groupBy: TimeGroupBy,
): types.Bucket[] {
  if (groupBy === 'daily') {
    return buckets; // No aggregation needed
  }

  const aggregatedMap = new Map<string, types.Bucket>();

  buckets.forEach((bucket) => {
    const groupKey = getGroupKey(bucket.bucketIndex, groupBy);
    if (!groupKey) return; // Skip invalid bucket keys

    if (aggregatedMap.has(groupKey)) {
      const existing = aggregatedMap.get(groupKey)!;
      existing.total += bucket.total;
      existing.colorValue += bucket.colorValue;
    } else {
      aggregatedMap.set(groupKey, {
        bucketIndex: groupKey,
        startBlock: bucket.startBlock, // Use first bucket's start block
        endBlock: bucket.endBlock, // Will be updated to last bucket's end block
        total: bucket.total,
        colorValue: bucket.colorValue,
      });
    }
  });

  return Array.from(aggregatedMap.values()).sort((a, b) =>
    a.bucketIndex.localeCompare(b.bucketIndex),
  );
}

/**
 * Converts a daily bucket key (YYYYMMDD) to a group key based on the grouping type
 * @param bucketKey Daily bucket key (e.g., "20220315")
 * @param groupBy How to group the bucket
 * @returns Group key (e.g., "2022", "2022Q1") or null if invalid
 */
function getGroupKey(bucketKey: string, groupBy: TimeGroupBy): string | null {
  // Check if it's a date-based bucket key (8 digits: YYYYMMDD)
  if (!/^\d{8}$/.test(bucketKey)) {
    return null; // Not a time-based bucket
  }

  const year = bucketKey.substring(0, 4);
  const month = parseInt(bucketKey.substring(4, 6), 10);

  switch (groupBy) {
    case 'annual':
      return year;

    case 'quarterly': {
      const quarter = Math.ceil(month / 3);
      return `${year}Q${quarter}`;
    }

    case 'daily':
    default:
      return bucketKey; // Return as-is for daily
  }
}

/**
 * Formats a group key for display
 * @param groupKey The group key (e.g., "2022", "2022Q1", "20220315")
 * @returns Formatted display string
 */
export function formatGroupKey(groupKey: string): string {
  // Annual: "2022" → "2022"
  if (/^\d{4}$/.test(groupKey)) {
    return groupKey;
  }

  // Quarterly: "2022Q1" → "2022 Q1"
  if (/^\d{4}Q[1-4]$/.test(groupKey)) {
    const year = groupKey.substring(0, 4);
    const quarter = groupKey.substring(5, 6);
    return `${year} Q${quarter}`;
  }

  // Daily: "20220315" → "2022-03-15"
  if (/^\d{8}$/.test(groupKey)) {
    const year = groupKey.substring(0, 4);
    const month = groupKey.substring(4, 6);
    const day = groupKey.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // Fallback for any other format
  return groupKey;
}
