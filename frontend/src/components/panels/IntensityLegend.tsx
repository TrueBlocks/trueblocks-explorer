import { Box, Text, useMantineTheme } from '@mantine/core';

import { MetricConfig } from './MetricSelector';

interface IntensityLegendProps {
  metricConfig: MetricConfig;
  minValue: number;
  maxValue: number;
}

export const IntensityLegend = ({
  metricConfig,
  minValue,
  maxValue,
}: IntensityLegendProps) => {
  const theme = useMantineTheme();

  return (
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
        <Text size="xs">{metricConfig.formatValue(minValue)}</Text>
        <Text size="xs">{metricConfig.formatValue(maxValue)}</Text>
      </Box>
    </Box>
  );
};
