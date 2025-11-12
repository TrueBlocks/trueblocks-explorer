import { BucketStats } from '@hooks';
import { Box } from '@mantine/core';
import { StyledText } from 'src/components/StyledText';

export interface StatsBoxProps {
  statsData: BucketStats;
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
    <StyledText size="sm" fw={600}>
      Total:
    </StyledText>
    <StyledText size="sm">{formatValue(statsData.total)}</StyledText>
    <StyledText size="sm" fw={600}>
      Avg:
    </StyledText>
    <StyledText size="sm">{formatValue(statsData.average)}</StyledText>
    <StyledText size="sm" fw={600}>
      Buckets:
    </StyledText>
    <StyledText size="sm">{statsData.count}</StyledText>
    <StyledText size="sm" fw={600}>
      Min:
    </StyledText>
    <StyledText size="sm">{formatValue(statsData.min)}</StyledText>
    <StyledText size="sm" fw={600}>
      Max:
    </StyledText>
    <StyledText size="sm">{formatValue(statsData.max)}</StyledText>
    <Box></Box>
    <Box></Box>
  </Box>
);
