import { useCallback, useEffect, useState } from 'react';

import {
  MetricConfig,
  MetricSelector,
  StatsBox,
  StyledButton,
} from '@components';
import { useEvent } from '@hooks';
import { BarChart } from '@mantine/charts';
import { Alert, Box, Stack, Text } from '@mantine/core';
import { chunks, msgs, types } from '@models';

export interface GenericAggregation {
  facetName: string;
  dataFacet: types.DataFacet;
  defaultMetric: string;
  metrics: MetricConfig[];
}

interface GenericBarchartPanelProps {
  agData: GenericAggregation;
  row: Record<string, unknown> | null;
  fetchBuckets: () => Promise<chunks.ChunksBuckets | null>;
  getMetric: (facetName: string) => Promise<string>;
  setMetric: (facetName: string, metric: string) => Promise<void>;
  eventCollection?: string; // e.g., 'chunks', 'exports', etc.
}

export const BarchartPanel = ({
  agData,
  row: _row,
  fetchBuckets,
  getMetric,
  setMetric,
  eventCollection = 'chunks',
}: GenericBarchartPanelProps) => {
  const [buckets, setBuckets] = useState<chunks.ChunksBuckets | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>(
    agData.defaultMetric,
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
        const saved = await getMetric(agData.facetName);
        const validMetric = agData.metrics.find((m) => m.key === saved);
        if (validMetric) {
          setSelectedMetric(validMetric.key);
        }
      } catch (error) {
        console.error('Failed to load saved metric:', error);
      }
    };
    loadSelectedMetric();
  }, [agData.facetName, agData.metrics, getMetric]);

  const handleMetricChange = useCallback(
    async (metric: string) => {
      setSelectedMetric(metric);
      try {
        await setMetric(agData.facetName, metric);
      } catch (error) {
        console.error('Failed to save metric preference:', error);
      }
    },
    [agData.facetName, setMetric],
  );

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
  const currentMetric = agData.metrics.find((m) => m.key === selectedMetric);
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
  const bucketsData = buckets
    ? (buckets[currentMetric.bucketsField] as chunks.Bucket[])
    : [];
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

  if (!bucketsData || bucketsData.length === 0) {
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
  const chartData = bucketsData.map((bucket) => ({
    name: `${bucket.startBlock}-${bucket.endBlock}`,
    value: bucket.total,
    bucket: bucket.bucketIndex,
  }));

  return (
    <Stack gap="md" p="md">
      <MetricSelector
        metricConfig={currentMetric}
        metrics={agData.metrics}
        onMetricChange={handleMetricChange}
      />

      {statsData && (
        <StatsBox
          statsData={statsData}
          formatNumber={formatNumber}
          formatAverage={formatAverage}
        />
      )}

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
                  Block Range: {data.name}
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
