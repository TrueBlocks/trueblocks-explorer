import { useCallback, useEffect, useState } from 'react';

import {
  BucketsConfig,
  IntensityLegend,
  MetricSelector,
  StatsBox,
} from '@components';
import { useEvent } from '@hooks';
import {
  Alert,
  Box,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { msgs, types } from '@models';
import {
  Log,
  aggregateTimeBasedBuckets,
  formatGroupKey,
  formatNumber,
} from '@utils';

interface HeatmapPanelProps {
  config: BucketsConfig;
  row: Record<string, unknown> | null;
  fetchBuckets: () => Promise<types.Buckets>;
  getMetric: (facetName: string) => Promise<string>;
  setMetric: (facetName: string, metric: string) => Promise<void>;
}

export const HeatmapPanel = ({
  config,
  row: _row,
  fetchBuckets,
  getMetric,
  setMetric,
}: HeatmapPanelProps) => {
  const theme = useMantineTheme();
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

  const getMetricConfig = (metric: string) => {
    return config.metrics.find((m) => m.key === metric);
  };

  const getMetricData = () => {
    if (!buckets) {
      return { bucketsData: [], statsData: null };
    }

    const metConfig = getMetricConfig(selectedMetric);
    if (!metConfig) {
      return { bucketsData: [], statsData: null };
    }

    const allBuckets =
      (buckets[metConfig.bucketsField] as types.Bucket[]) || [];

    let filteredBuckets = config.skipUntil
      ? allBuckets.filter((bucket) => bucket.bucketIndex >= config.skipUntil!)
      : allBuckets;

    if (config.timeGroupBy) {
      filteredBuckets = aggregateTimeBasedBuckets(
        filteredBuckets,
        config.timeGroupBy,
      );
    }

    return {
      bucketsData: filteredBuckets,
      statsData: buckets[metConfig.statsField] as types.BucketStats,
    };
  };

  const getColor = (value: number, min: number, max: number) => {
    // Handle edge case where all values are the same
    if (max === min) {
      return theme.colors.blue[0]; // Lightest color
    }

    // Linear scale from 0 (min) to 1 (max)
    const normalizedValue = (value - min) / (max - min);

    // Map to intensity level 0-9
    const intensityLevel = Math.floor(normalizedValue * 9);

    return theme.colors.blue[intensityLevel];
  };

  if (error) {
    return (
      <Alert color="red" title="Error">
        {error}
      </Alert>
    );
  }

  // Only show loading if we've never loaded any data before
  if (!hasEverLoaded) {
    return <Text>Loading heat map...</Text>;
  }

  const { bucketsData, statsData } = getMetricData();

  if (!bucketsData?.length || !statsData || !buckets) {
    return (
      <Box p="md" ta="center">
        <Text c="dimmed" mb="md">
          Loading...
        </Text>
      </Box>
    );
  }

  const metricConfig = getMetricConfig(selectedMetric);
  if (!metricConfig) {
    return (
      <Box p="md">
        <Alert color="orange" title="Configuration Error">
          Invalid metric selected: {selectedMetric}
        </Alert>
      </Box>
    );
  }

  const { columns } = buckets.gridInfo;

  return (
    <Stack gap="md" p="md">
      <MetricSelector
        metricConfig={metricConfig}
        metrics={config.metrics}
        onMetricChange={handleMetricChange}
      />

      {statsData && (
        <StatsBox
          statsData={statsData}
          formatValue={metricConfig.formatValue}
        />
      )}

      <Box>
        <Text size="sm" fw={500} mb="sm">
          Heat Map
        </Text>

        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '0px',
            border: '1px solid #e0e0e0',
            padding: '1px',
            borderRadius: '2px',
            backgroundColor: '#f9f9f9',
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              ${theme.colors.gray[0]},
              ${theme.colors.gray[0]} 5px,
              ${theme.colors.gray[1]} 5px,
              ${theme.colors.gray[1]} 10px
            )`,
            width: '100%',
            aspectRatio: `${columns} / ${Math.ceil(bucketsData.length / columns)}`,
          }}
        >
          {bucketsData.map((dataPoint) => {
            const color = getColor(
              dataPoint.total,
              statsData.min,
              statsData.max,
            );

            return (
              <Tooltip
                key={dataPoint.bucketIndex}
                label={
                  <Box>
                    {config.timeGroupBy ? (
                      <Text size="xs">
                        Period: {formatGroupKey(dataPoint.bucketIndex)}
                      </Text>
                    ) : (
                      <Text size="xs">
                        Blocks: {formatNumber(dataPoint.startBlock)} -{' '}
                        {formatNumber(dataPoint.endBlock)}
                      </Text>
                    )}
                    <Text size="xs">
                      {getMetricConfig(selectedMetric)?.label}:{' '}
                      {getMetricConfig(selectedMetric)?.formatValue(
                        dataPoint.total,
                      )}
                    </Text>
                  </Box>
                }
              >
                <Box
                  style={{
                    backgroundColor: color,
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    aspectRatio: '1',
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>

        <Box mt="md">
          <Text size="xs" c="dimmed">
            {formatNumber(statsData.count)} buckets,{' '}
            {getMetricConfig(selectedMetric)?.formatValue(statsData.total)}{' '}
            total,{' '}
            {getMetricConfig(selectedMetric)?.formatValue(statsData.average)}{' '}
            avg per {formatNumber(buckets.gridInfo.size)}-block range
          </Text>
        </Box>

        <IntensityLegend
          metricConfig={metricConfig}
          minValue={statsData.min}
          maxValue={statsData.max}
        />
      </Box>
    </Stack>
  );
};
