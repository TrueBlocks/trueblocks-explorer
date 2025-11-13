import { StyledButton } from '@components';
import { Group, Stack, Text } from '@mantine/core';
import { types } from '@models';

export interface MetricConfig {
  key: string;
  label: string;
  bucketsField: keyof types.Buckets | string;
  formatValue: (value: number) => string;
  bytes: boolean;
}

interface MetricSelectorProps {
  metricConfig: MetricConfig;
  metrics: MetricConfig[];
  onMetricChange: (metricKey: string) => void;
}

export const MetricSelector = ({
  metricConfig,
  metrics,
  onMetricChange,
}: MetricSelectorProps) => (
  <Stack gap="sm">
    <Text variant="primary" size="md" fw={600}>
      {metricConfig.label}
    </Text>
    <Group gap="xs">
      {metrics.map((metric) => (
        <StyledButton
          key={metric.key}
          variant={metricConfig.key === metric.key ? 'filled' : 'light'}
          size="xs"
          onClick={() => onMetricChange(metric.key)}
        >
          {metric.label}
        </StyledButton>
      ))}
    </Group>
  </Stack>
);
