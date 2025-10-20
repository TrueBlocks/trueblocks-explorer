import { useCallback, useEffect, useMemo, useState } from 'react';

import { GetExportsBuckets, GetExportsMetric, SetExportsMetric } from '@app';
import { useEvent, usePayload } from '@hooks';
import { SimpleGrid, Stack, Text } from '@mantine/core';
import { exports, msgs, types } from '@models';
import { LogError, useErrorHandler } from '@utils';

import { AssetChart, AssetHeader, type MetricOption } from '../../components';

export const AssetChartsFacet = ({
  pageData: _pageData,
}: {
  pageData: exports.ExportsPage;
}) => {
  const [bucketsData, setBucketsData] = useState<types.Buckets | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(() => {
    const saved = localStorage.getItem('assetCharts-sortDirection');
    return (saved as 'asc' | 'desc') || 'desc';
  });
  const [selectedMetric, setSelectedMetric] =
    useState<MetricOption>('frequency');
  const createPayload = usePayload();
  const { error, handleError, clearError } = useErrorHandler();

  // Load metric from backend preferences on component mount
  useEffect(() => {
    const loadSelectedMetric = async () => {
      try {
        const saved = await GetExportsMetric('assetcharts');
        if (saved && ['frequency', 'volume', 'endBal'].includes(saved)) {
          setSelectedMetric(saved as MetricOption);
        }
      } catch {
        // Fallback to localStorage if backend fails
        const localSaved = localStorage.getItem('assetCharts-selectedMetric');
        if (
          localSaved &&
          ['frequency', 'volume', 'endBal'].includes(localSaved)
        ) {
          setSelectedMetric(localSaved as MetricOption);
        }
      }
    };
    loadSelectedMetric();
  }, []);

  // Save metric to backend preferences when it changes
  const handleMetricChange = useCallback(async (metric: MetricOption) => {
    setSelectedMetric(metric);
    try {
      await SetExportsMetric('assetcharts', metric);
      // Also save to localStorage as backup
      localStorage.setItem('assetCharts-selectedMetric', metric);
    } catch {
      // Fallback to localStorage only if backend fails
      localStorage.setItem('assetCharts-selectedMetric', metric);
    }
  }, []);

  // Cycle through metrics using hotkey (Cmd+M / Ctrl+M)
  const cycleMetric = useCallback(() => {
    const metrics: MetricOption[] = ['frequency', 'volume', 'endBal'];
    const currentIndex = metrics.indexOf(selectedMetric);
    const nextIndex = (currentIndex + 1) % metrics.length;
    const nextMetric = metrics[nextIndex];
    if (nextMetric) {
      handleMetricChange(nextMetric);
    }
  }, [selectedMetric, handleMetricChange]);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+M (Mac) or Ctrl+M (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        cycleMetric();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cycleMetric]);

  // Fetch buckets data - no loading state, just update data
  const fetchBucketsData = useCallback(async () => {
    clearError();
    try {
      const payload = createPayload(types.DataFacet.ASSETCHARTS);
      const result = await GetExportsBuckets(payload);
      setBucketsData(result);
    } catch (err: unknown) {
      handleError(err, 'Failed to fetch asset charts data');
    }
  }, [createPayload, handleError, clearError]);

  // Initial data fetch only - no deps to prevent re-renders
  useEffect(() => {
    fetchBucketsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for DATA_LOADED events to keep buckets data synchronized with streaming updates
  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (
        payload?.collection === 'exports' &&
        payload?.dataFacet === types.DataFacet.ASSETCHARTS
      ) {
        fetchBucketsData();
      }
    },
  );

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('assetCharts-sortDirection', sortDirection);
  }, [sortDirection]);

  // Calculate statistics for a metric's buckets
  const calculateStats = (buckets: types.Bucket[]) => {
    if (buckets.length === 0) {
      return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
    }

    const values = buckets.map((b) => b.total);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { sum, avg, min, max, count: values.length };
  };

  // Memoize parsed series data to prevent unnecessary recalculations
  const groupedData = useMemo(() => {
    if (!bucketsData?.series) return {};

    const grouped: Record<string, Record<string, types.Bucket[]>> = {};
    const availableMetrics = new Set<string>();
    const seriesWithData: string[] = [];

    Object.entries(bucketsData.series).forEach(([seriesName, buckets]) => {
      // Parse dot notation: "0x1234567890ab_ETH.frequency" -> asset="0x1234567890ab_ETH", metric="frequency"
      const dotIndex = seriesName.lastIndexOf('.');
      if (dotIndex === -1) {
        LogError(`Invalid series name format: ${seriesName}`);
        return;
      }

      const assetKey = seriesName.substring(0, dotIndex);
      const metric = seriesName.substring(dotIndex + 1);
      availableMetrics.add(metric);

      // Check if this series has any non-zero data
      const hasData = buckets.some((bucket) => bucket.total > 0);
      if (hasData) {
        seriesWithData.push(`${assetKey}.${metric}`);
      }

      if (!grouped[assetKey]) {
        grouped[assetKey] = {};
      }

      grouped[assetKey][metric] = buckets;
    });

    return grouped;
  }, [bucketsData?.series]);

  // Memoize sorted assets to prevent unnecessary recalculations
  const sortedAssets = useMemo(() => {
    const entries = Object.entries(groupedData);

    return entries.sort(([_assetA, metricsA], [_assetB, metricsB]) => {
      // Always sort by the frequency metric's sum/total
      const statsA = metricsA['frequency']
        ? calculateStats(metricsA['frequency'])
        : { sum: 0 };
      const statsB = metricsB['frequency']
        ? calculateStats(metricsB['frequency'])
        : { sum: 0 };

      const valueA = statsA.sum;
      const valueB = statsB.sum;

      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }, [groupedData, sortDirection]);

  if (error) {
    return (
      <Stack gap="md" p="xl" align="center" justify="center" h={400}>
        <Text size="lg" c="red">
          Error loading data: {error.message}
        </Text>
      </Stack>
    );
  }

  const assetCount = Object.keys(groupedData).length;

  if (assetCount === 0 && bucketsData) {
    return (
      <Stack gap="md" p="xl" align="center" justify="center" h={400}>
        <Text size="lg" c="dimmed">
          No asset chart data available
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md" p="md">
      {/* Global Header with Controls */}
      <AssetHeader
        bucketsData={bucketsData}
        selectedMetric={selectedMetric}
        sortDirection={sortDirection}
        onMetricChange={handleMetricChange}
        onSortToggle={() =>
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        }
      />

      {/* Asset Charts Grid */}
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing="md"
        style={{ minWidth: 0 }}
      >
        {sortedAssets.map(
          ([assetKey, metrics]: [string, Record<string, types.Bucket[]>]) => {
            const metricBuckets = metrics[selectedMetric];
            return (
              <AssetChart
                key={assetKey}
                assetKey={assetKey}
                buckets={metricBuckets || []}
                selectedMetric={selectedMetric}
                assetNames={bucketsData?.assetNames}
              />
            );
          },
        )}
      </SimpleGrid>
    </Stack>
  );
};
