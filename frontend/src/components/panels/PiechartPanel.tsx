import { useCallback, useEffect, useState } from 'react';

import { BucketsConfig, MetricSelector, StatsBox } from '@components';
import { useBucketStats, useEvent } from '@hooks';
import { PieChart } from '@mantine/charts';
import { Alert, Box, Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { msgs, types } from '@models';
import { Log, aggregateTimeBasedBuckets, formatGroupKey } from '@utils';

import { PanelDataWarning } from './PanelDataWarning';

// Helper function to get bucket data from the series map
const getBucketData = (
  buckets: types.Buckets,
  field: string,
): types.Bucket[] => {
  return buckets.series?.[field] || [];
};

interface PiechartPanelProps {
  config: BucketsConfig;
  row: Record<string, unknown> | null;
  fetchBuckets: () => Promise<types.Buckets>;
  getMetric: (facetName: string) => Promise<string>;
  setMetric: (facetName: string, metric: string) => Promise<void>;
}

export const PiechartPanel = ({
  config,
  row: _row,
  fetchBuckets,
  getMetric,
  setMetric,
}: PiechartPanelProps) => {
  const [buckets, setBuckets] = useState<types.Buckets | null>(null);
  const [hasEverLoaded, setHasEverLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>(
    config.defaultMetric,
  );

  useEffect(() => {
    const loadSelectedMetric = async () => {
      try {
        const saved = await getMetric(config.dataFacet);
        const validMetric = config.metrics.find((m) => m.key === saved);
        if (validMetric) {
          setSelectedMetric(validMetric.key);
        }
      } catch (error) {
        Log(`Failed to load saved metric: ${error}`);
      }
    };
    loadSelectedMetric();
  }, [config.dataFacet, config.metrics, getMetric]);

  const handleMetricChange = useCallback(
    async (metric: string) => {
      setSelectedMetric(metric);
      try {
        await setMetric(config.dataFacet, metric);
      } catch (error) {
        Log(`Failed to save metric preference: ${error}`);
      }
    },
    [config.dataFacet, setMetric],
  );

  // Cycle through metrics with hotkey
  const cycleToNextMetric = useCallback(() => {
    const currentIndex = config.metrics.findIndex(
      (m) => m.key === selectedMetric,
    );
    const nextIndex = (currentIndex + 1) % config.metrics.length;
    const nextMetric = config.metrics[nextIndex]?.key;
    if (nextMetric) {
      handleMetricChange(nextMetric);
    }
  }, [selectedMetric, config.metrics, handleMetricChange]);

  // Add hotkey for cycling metrics
  useHotkeys([['mod+shift+m', cycleToNextMetric]]);

  const handleFetchBuckets = useCallback(async () => {
    setError(null);

    try {
      const result = await fetchBuckets();
      if (result) {
        setBuckets(result);
        setHasEverLoaded(true);
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
      if (payload?.collection === config.collection) {
        handleFetchBuckets();
      }
    },
  );

  useEvent(
    msgs.EventType.DATA_RELOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (payload?.collection === config.collection) {
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

  const currentMetric = config.metrics.find((m) => m.key === selectedMetric);

  const allBucketsData = buckets
    ? getBucketData(buckets, currentMetric?.bucketsField || 'ratio')
    : [];

  const filteredBuckets = config.skipUntil
    ? allBucketsData.filter((bucket) => {
        const bucketNum = parseInt(bucket.bucketIndex, 10);
        const skipUntilNum = parseInt(config.skipUntil!, 10);
        return bucketNum >= skipUntilNum;
      })
    : allBucketsData;

  const bucketsData = config.timeGroupBy
    ? aggregateTimeBasedBuckets(filteredBuckets, config.timeGroupBy)
    : filteredBuckets;

  const statsData = useBucketStats(bucketsData);

  if (!currentMetric) {
    return (
      <Box p="md">
        <Alert color="orange" title="Configuration Error">
          Invalid metric selected: {selectedMetric}
        </Alert>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="md">
        <Alert color="red" title="Error loading chart">
          {error}
        </Alert>
      </Box>
    );
  }

  // Only show loading if we've never loaded any data before
  if (!hasEverLoaded) {
    return <Text>Loading chart data...</Text>;
  }

  if (!statsData || !bucketsData?.length) {
    // If we've loaded data before but now have no buckets, this may indicate a configuration issue
    if (hasEverLoaded && (!bucketsData?.length || !statsData)) {
      return <PanelDataWarning facet={config.dataFacet} />;
    }

    return (
      <Box p="md" ta="center">
        <Text c="dimmed" mb="md">
          Loading...
        </Text>
      </Box>
    );
  }

  // Prepare chart data
  const chartData = bucketsData.map((bucket, index) => {
    const name = config.timeGroupBy
      ? formatGroupKey(bucket.bucketIndex)
      : `${bucket.startBlock}-${bucket.endBlock}`;

    return {
      name,
      value: bucket.total,
      color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`, // Generate distinct colors
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
        metrics={config.metrics}
        onMetricChange={handleMetricChange}
      />

      {statsData && (
        <StatsBox
          statsData={statsData}
          formatValue={currentMetric.formatValue}
        />
      )}

      <Text size="sm" fw={500} mb="sm">
        {config.timeGroupBy
          ? `${currentMetric.label} - ${config.timeGroupBy.charAt(0).toUpperCase() + config.timeGroupBy.slice(1)} View`
          : 'Pie Chart'}
      </Text>

      <PieChart
        h={400}
        data={chartData}
        withTooltip
        tooltipDataSource="segment"
        mx="auto"
        withLabels
        labelsPosition="inside"
        labelsType="percent"
        strokeWidth={1}
        size={200}
      />

      <Text size="sm" c="dimmed" ta="center">
        Showing {currentMetric.label.toLowerCase()} distribution across{' '}
        {statsData?.count || 0} buckets
        {statsData && ` (avg: ${currentMetric.formatValue(statsData.average)})`}
      </Text>
    </Stack>
  );
};
