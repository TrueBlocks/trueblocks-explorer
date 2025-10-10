import { useCallback, useEffect, useState } from 'react';

import { GetChunksBuckets, GetChunksMetric, SetChunksMetric } from '@app';
import { useEvent, usePayload } from '@hooks';
import {
  Alert,
  Box,
  Select,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { chunks, msgs, types } from '@models';

export interface Aggregation {
  facetName: string;
  dataFacet: types.DataFacet;
  defaultMetric: string;
  metrics: {
    key: string;
    label: string;
    bucketsField: keyof chunks.ChunksBuckets;
    statsField: keyof chunks.ChunksBuckets;
    formatValue: (value: number) => string;
    bytes: boolean;
  }[];
}

interface HeatmapPanelProps {
  agData: Aggregation;
  row: Record<string, unknown> | null;
}

export const HeatmapPanel = ({ agData, row: _row }: HeatmapPanelProps) => {
  const theme = useMantineTheme();
  const [buckets, setBuckets] = useState<chunks.ChunksBuckets | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>(
    agData.defaultMetric,
  );

  const createPayload = usePayload();

  useEffect(() => {
    const loadSelectedMetric = async () => {
      try {
        const saved = await GetChunksMetric(agData.facetName);
        const validMetric = agData.metrics.find((m) => m.key === saved);
        if (validMetric) {
          setSelectedMetric(validMetric.key);
        }
      } catch (error) {
        console.error('Failed to load saved metric:', error);
      }
    };
    loadSelectedMetric();
  }, [agData.facetName, agData.metrics]);

  const handleMetricChange = useCallback(
    async (metric: string) => {
      setSelectedMetric(metric);
      try {
        await SetChunksMetric(agData.facetName, metric);
      } catch (error) {
        console.error('Failed to save metric preference:', error);
      }
    },
    [agData.facetName],
  );

  const fetchBuckets = useCallback(async () => {
    setError(null);

    try {
      const payload = createPayload(agData.dataFacet);
      const result = await GetChunksBuckets(payload);
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
  }, [createPayload, agData.dataFacet]);

  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (payload?.collection === 'chunks') {
        fetchBuckets();
      }
    },
  );

  useEvent(msgs.EventType.ADDRESS_CHANGED, () => fetchBuckets());
  useEvent(msgs.EventType.CHAIN_CHANGED, () => fetchBuckets());
  useEvent(msgs.EventType.PERIOD_CHANGED, () => fetchBuckets());

  useEffect(() => {
    fetchBuckets();
  }, [fetchBuckets]);

  const getMetricConfig = (metric: string) => {
    return agData.metrics.find((m) => m.key === metric);
  };

  const getMetricData = () => {
    if (!buckets) return { curBuckets: [], curStats: null };

    const config = getMetricConfig(selectedMetric);
    if (!config) return { curBuckets: [], curStats: null };

    return {
      curBuckets: (buckets[config.bucketsField] as chunks.Bucket[]) || [],
      curStats: buckets[config.statsField] as chunks.BucketStats,
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

  const { curBuckets, curStats } = getMetricData();

  if (!curStats || !curBuckets?.length) {
    return <Text>No data available for heat map</Text>;
  }

  const { columns } = buckets.gridInfo;

  return (
    <Box p="md">
      <Box mb="md">
        <Select
          label="Metric"
          data={agData.metrics.map((metric) => ({
            value: metric.key,
            label: metric.label,
          }))}
          value={selectedMetric}
          onChange={(value) => handleMetricChange(value as string)}
          w={200}
        />
      </Box>

      <Box mb="md">
        <Text size="sm" fw={500}>
          {getMetricConfig(selectedMetric)?.label} Stats
        </Text>
        <Text size="xs" c="dimmed">
          Total: {getMetricConfig(selectedMetric)?.formatValue(curStats.total)},
          Average: {formatAverage(curStats.average)}, Min:{' '}
          {getMetricConfig(selectedMetric)?.formatValue(curStats.min)}, Max:{' '}
          {getMetricConfig(selectedMetric)?.formatValue(curStats.max)}
        </Text>
      </Box>

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
            aspectRatio: `${columns} / ${Math.ceil(curBuckets.length / columns)}`,
          }}
        >
          {curBuckets.map((dataPoint) => {
            const color = getColor(dataPoint.total, curStats.min, curStats.max);

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
            {formatNumber(curStats.count)} buckets,{' '}
            {getMetricConfig(selectedMetric)?.formatValue(curStats.total)}{' '}
            total, {formatAverage(curStats.average)} avg per{' '}
            {formatNumber(buckets.gridInfo.size)}-block range
          </Text>
        </Box>

        <Box mt="md">
          <Text size="sm" fw={500} mb="xs">
            Intensity Legend
          </Text>
          <Box
            style={{
              width: '100%',
              height: '20px',
              background: `linear-gradient(to right, ${theme.colors.blue[0]}, ${theme.colors.blue[9]})`,
              border: '1px solid #ddd',
              borderRadius: '2px',
              marginBottom: '4px',
            }}
          />
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: theme.colors.gray[6],
            }}
          >
            <Text size="xs">
              {getMetricConfig(selectedMetric)?.formatValue(curStats.min)}
            </Text>
            <Text size="xs">
              {getMetricConfig(selectedMetric)?.formatValue(curStats.max)}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
