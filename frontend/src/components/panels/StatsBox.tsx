import { Box, Group, Text } from '@mantine/core';
import { types } from '@models';

export interface StatsBoxProps {
  statsData: types.BucketStats;
  formatNumber: (value: number) => string;
  formatAverage: (value: number) => string;
}

export const StatsBox = ({
  statsData,
  formatNumber,
  formatAverage,
}: StatsBoxProps) => (
  <Box bg="gray.0" p="xs" style={{ borderRadius: 4 }}>
    <Group grow gap="lg">
      <Text size="sm">
        <Text span fw={600}>
          Total:
        </Text>{' '}
        {formatNumber(statsData.total)}
      </Text>
      <Text size="sm">
        <Text span fw={600}>
          Avg:
        </Text>{' '}
        {formatAverage(statsData.average)}
      </Text>
      <Text size="sm">
        <Text span fw={600}>
          Buckets:
        </Text>{' '}
        {statsData.count}
      </Text>
    </Group>
    <Group grow gap="lg">
      <Text size="sm">
        <Text span fw={600}>
          Min:
        </Text>{' '}
        {formatNumber(statsData.min)}
      </Text>
      <Text size="sm">
        <Text span fw={600}>
          Max:
        </Text>{' '}
        {formatNumber(statsData.max)}
      </Text>
      <Box></Box>
    </Group>
  </Box>
);
