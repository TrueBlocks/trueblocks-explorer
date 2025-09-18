import { Badge, Group, Text } from '@mantine/core';

type StatusType = 'healthy' | 'warning' | 'error' | 'loading' | 'inactive';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  count?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  healthy: { color: 'green', label: 'Healthy' },
  warning: { color: 'orange', label: 'Warning' },
  error: { color: 'red', label: 'Error' },
  loading: { color: 'blue', label: 'Loading' },
  inactive: { color: 'gray', label: 'Inactive' },
};

export const StatusIndicator = ({
  status,
  label,
  count,
  size = 'sm',
}: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const statusText = `${config.label}: ${label}${count !== undefined ? ` (${count})` : ''}`;

  return (
    <Group gap="xs" align="center" role="status" aria-label={statusText}>
      <Badge
        color={config.color}
        variant="light"
        size={size}
        aria-label={`Status: ${config.label}`}
      >
        {config.label}
      </Badge>

      <Text size={size} c="dimmed" aria-hidden="true">
        {label}
      </Text>

      {count !== undefined && (
        <Text size={size} fw={500} aria-hidden="true">
          ({count})
        </Text>
      )}
    </Group>
  );
};
