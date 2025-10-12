import { useCallback, useEffect, useState } from 'react';

import {
  Aggregation,
  MetricSelector,
  StatsBox,
  StyledButton,
} from '@components';
import { useEvent } from '@hooks';
import { BarChart } from '@mantine/charts';
import { Alert, Box, Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { chunks, msgs } from '@models';
import { Log, aggregateTimeBasedBuckets, formatGroupKey } from '@utils';

interface BarchartPanelProps {
  aggConfig: Aggregation;
  row: Record<string, unknown> | null;
  fetchBuckets: () => Promise<chunks.ChunksBuckets>;
  getMetric: (facetName: string) => Promise<string>;
  setMetric: (facetName: string, metric: string) => Promise<void>;
  eventCollection?: string; // e.g., 'chunks', 'exports', etc.
}

export const BarchartPanel = ({
  aggConfig,
  row: _row,
  fetchBuckets,
  getMetric,
  setMetric,
  eventCollection = 'chunks',
}: BarchartPanelProps) => {
  const [skipUntil, _] = useState<string | null>('2017');
  const [buckets, setBuckets] = useState<chunks.ChunksBuckets | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>(
    aggConfig.defaultMetric,
  );

  // Utility functions
  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  const formatAverage = (value: number): string => {
    return value.toFixed(2);
  };

  useEffect(() => {
    const loadSelectedMetric = async () => {
      try {
        const saved = await getMetric(aggConfig.dataFacet);
        const validMetric = aggConfig.metrics.find((m) => m.key === saved);
        if (validMetric) {
          setSelectedMetric(validMetric.key);
        }
      } catch (error) {
        Log(`Failed to load saved metric: ${error}`);
      }
    };
    loadSelectedMetric();
  }, [aggConfig.dataFacet, aggConfig.metrics, getMetric]);

  const handleMetricChange = useCallback(
    async (metric: string) => {
      setSelectedMetric(metric);
      try {
        await setMetric(aggConfig.dataFacet, metric);
      } catch (error) {
        Log(`Failed to save metric preference: ${error}`);
      }
    },
    [aggConfig.dataFacet, setMetric],
  );

  // Cycle through metrics with hotkey
  const cycleToNextMetric = useCallback(() => {
    const currentIndex = aggConfig.metrics.findIndex(
      (m) => m.key === selectedMetric,
    );
    const nextIndex = (currentIndex + 1) % aggConfig.metrics.length;
    const nextMetric = aggConfig.metrics[nextIndex]?.key;
    if (nextMetric) {
      handleMetricChange(nextMetric);
    }
  }, [selectedMetric, aggConfig.metrics, handleMetricChange]);

  // Add hotkey for cycling metrics
  useHotkeys([['mod+shift+m', cycleToNextMetric]]);

  const handleFetchBuckets = useCallback(async () => {
    setError(null);

    try {
      const result = await fetchBuckets();
      if (result) {
        setBuckets(result);
      } else {
        setError('No data returned from API');
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to fetch buckets data';
      setError(errorMsg);
    }
  }, [fetchBuckets]);

  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (payload?.collection === eventCollection) {
        handleFetchBuckets();
      }
    },
  );

  useEvent(msgs.EventType.ADDRESS_CHANGED, () => handleFetchBuckets());
  useEvent(msgs.EventType.CHAIN_CHANGED, () => handleFetchBuckets());
  useEvent(msgs.EventType.PERIOD_CHANGED, () => handleFetchBuckets());

  useEffect(() => {
    handleFetchBuckets();
  }, [handleFetchBuckets]);

  // Get current metric config
  const currentMetric = aggConfig.metrics.find((m) => m.key === selectedMetric);
  if (!currentMetric) {
    return (
      <Box p="md">
        <Alert color="orange" title="Configuration Error">
          Invalid metric selected: {selectedMetric}
        </Alert>
      </Box>
    );
  }

  // Get the buckets data and stats for the current metric
  const allBucketsData = buckets
    ? (buckets[currentMetric.bucketsField] as chunks.Bucket[])
    : [];

  const filteredBuckets = skipUntil
    ? allBucketsData.filter((bucket) => bucket.bucketIndex >= skipUntil!)
    : allBucketsData;

  const bucketsData = aggConfig.timeGroupBy
    ? aggregateTimeBasedBuckets(filteredBuckets, aggConfig.timeGroupBy)
    : filteredBuckets;

  const statsData = buckets
    ? (buckets[currentMetric.statsField] as chunks.BucketStats)
    : null;

  if (error) {
    return (
      <Box p="md">
        <Alert color="red" title="Error loading chart">
          {error}
        </Alert>
      </Box>
    );
  }

  if (!statsData || !bucketsData?.length) {
    if (!buckets) {
      return <Text>Loading chart data...</Text>;
    }
    return (
      <Box p="md" ta="center">
        <Text c="dimmed" mb="md">
          No chart data available
        </Text>
        <StyledButton onClick={handleFetchBuckets} variant="light" size="sm">
          Refresh Data
        </StyledButton>
      </Box>
    );
  }

  // Prepare chart data
  const chartData = bucketsData.map((bucket) => {
    const name = aggConfig.timeGroupBy
      ? formatGroupKey(bucket.bucketIndex)
      : `${bucket.startBlock}-${bucket.endBlock}`;

    return {
      name,
      value: bucket.total,
      bucket: bucket.bucketIndex,
    };
  });

  return (
    <Stack gap="md" p="md">
      {/* <DateInput
        value={skipUntil}
        onChange={setSkipUntil}
        defaultLevel="decade"
        hideOutsideDates={true}
      /> */}
      <MetricSelector
        metricConfig={currentMetric}
        metrics={aggConfig.metrics}
        onMetricChange={handleMetricChange}
      />

      {statsData && (
        <StatsBox
          statsData={statsData}
          formatNumber={formatNumber}
          formatAverage={formatAverage}
        />
      )}

      <Text size="sm" fw={500} mb="sm">
        {aggConfig.timeGroupBy
          ? `${currentMetric.label} - ${aggConfig.timeGroupBy.charAt(0).toUpperCase() + aggConfig.timeGroupBy.slice(1)} View`
          : 'Bar Chart'}
      </Text>

      <BarChart
        h={400}
        data={chartData}
        dataKey="value"
        series={[
          {
            name: 'value',
            color: 'blue.6',
            label: currentMetric.label,
          },
        ]}
        tickLine="xy"
        gridAxis="xy"
        withTooltip
        tooltipProps={{
          cursor: true,
          content: ({ payload }) => {
            if (!payload || payload.length === 0 || !payload[0]) return null;
            const data = payload[0].payload;
            return (
              <Box
                bg="white"
                p="xs"
                style={{ border: '1px solid #ddd', borderRadius: 4 }}
              >
                <Text size="sm" fw={600}>
                  {aggConfig.timeGroupBy ? 'Time Period' : 'Block Range'}:{' '}
                  {data.name}
                </Text>
                <Text size="sm">
                  {currentMetric.label}: {currentMetric.formatValue(data.value)}
                </Text>
                <Text size="xs" c="dimmed">
                  Bucket: {data.bucket}
                </Text>
              </Box>
            );
          },
        }}
      />

      <Text size="sm" c="dimmed" ta="center">
        Showing {currentMetric.label.toLowerCase()} distribution across{' '}
        {statsData?.count || 0} buckets
        {statsData && ` (avg: ${formatAverage(statsData.average)})`}
      </Text>
    </Stack>
  );
};
