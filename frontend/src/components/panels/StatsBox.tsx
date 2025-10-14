import { Box, Text } from '@mantine/core';
import { types } from '@models';

export interface StatsBoxProps {
  statsData: types.BucketStats;
  formatValue: (value: number) => string;
}

export const StatsBox = ({ statsData, formatValue }: StatsBoxProps) => (
  <Box
    bg="gray.0"
    p="xs"
    style={{
      borderRadius: 4,
      display: 'grid',
      gridTemplateColumns: '9% 24% 9% 24% 12% 21%',
      gap: '4px',
      alignItems: 'center',
    }}
  >
    <Text size="sm" fw={600}>
      Total:
    </Text>
    <Text size="sm">{formatValue(statsData.total)}</Text>
    <Text size="sm" fw={600}>
      Avg:
    </Text>
    <Text size="sm">{formatValue(statsData.average)}</Text>
    <Text size="sm" fw={600}>
      Buckets:
    </Text>
    <Text size="sm">{statsData.count}</Text>
    <Text size="sm" fw={600}>
      Min:
    </Text>
    <Text size="sm">{formatValue(statsData.min)}</Text>
    <Text size="sm" fw={600}>
      Max:
    </Text>
    <Text size="sm">{formatValue(statsData.max)}</Text>
    <Box></Box>
    <Box></Box>
  </Box>
);
