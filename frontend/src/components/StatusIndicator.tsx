import { StyledBadge } from '@components';
import { Group, Text } from '@mantine/core';

type StatusType = 'healthy' | 'inactive';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  count?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const statusConfig: Record<StatusType, { label: string }> = {
  healthy: {
    label: 'Healthy',
  },
  inactive: {
    label: 'Inactive',
  },
};

export const StatusIndicator = ({
  status,
  label,
  count,
}: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const statusText = `${config.label}: ${label}${count !== undefined ? ` (${count})` : ''}`;

  return (
    <Group gap="xs" align="center" role="status" aria-label={statusText}>
      <StyledBadge variant={status} size="xs">
        {config.label}
      </StyledBadge>

      <Text variant="dimmed" size="sm">
        {label}
      </Text>

      {count !== undefined && (
        <Text variant="primary" size="sm" fw={600}>
          ({count})
        </Text>
      )}
    </Group>
  );
};
