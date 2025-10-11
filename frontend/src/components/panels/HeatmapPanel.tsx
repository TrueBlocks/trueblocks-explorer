import { useCallback, useEffect, useState } from 'react';

import {
  GenericAggregation,
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
import { chunks, msgs } from '@models';

interface GenericHeatmapPanelProps {
  agData: GenericAggregation;
  row: Record<string, unknown> | null;
  fetchBuckets: () => Promise<chunks.ChunksBuckets>;
  getMetric: (facetName: string) => Promise<string>;
  setMetric: (facetName: string, metric: string) => Promise<void>;
  eventCollection: string;
}

export const HeatmapPanel = ({
  agData,
  row: _row,
  fetchBuckets,
  getMetric,
  setMetric,
  eventCollection,
}: GenericHeatmapPanelProps) => {
  const theme = useMantineTheme();
  const [buckets, setBuckets] = useState<chunks.ChunksBuckets | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>(
    agData.defaultMetric,
  );

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

  const getMetricConfig = (metric: string) => {
    return agData.metrics.find((m) => m.key === metric);
  };

  const getMetricData = () => {
    if (!buckets) return { bucketsData: [], statsData: null };

    const config = getMetricConfig(selectedMetric);
    if (!config) return { bucketsData: [], statsData: null };

    return {
      bucketsData: (buckets[config.bucketsField] as chunks.Bucket[]) || [],
      statsData: buckets[config.statsField] as chunks.BucketStats,
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatAverage = (num: number) => {
    return num.toFixed(3);
  };

  if (error) {
    return (
      <Alert color="red" title="Error">
        {error}
      </Alert>
    );
  }

  if (!buckets) {
    return <Text>Loading heat map...</Text>;
  }

  const { bucketsData, statsData } = getMetricData();

  if (!statsData || !bucketsData?.length) {
    return <Text>No data available for heat map</Text>;
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
                    <Text size="xs">
                      Blocks: {formatNumber(dataPoint.startBlock)} -{' '}
                      {formatNumber(dataPoint.endBlock)}
                    </Text>
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
            total, {formatAverage(statsData.average)} avg per{' '}
            {formatNumber(buckets.gridInfo.size)}-block range
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
