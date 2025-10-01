import { StyledBadge, StyledText } from '@components';
import { Group } from '@mantine/core';

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
      <StyledBadge
        variant={status}
        size="xs"
        aria-label={`Status: ${config.label}`}
      >
        {config.label}
      </StyledBadge>

      <StyledText variant="dimmed" size="xs">
        {label}
      </StyledText>

      {count !== undefined && (
        <StyledText variant="primary" size="sm" fw={600}>
          ({count})
        </StyledText>
      )}
    </Group>
  );
};
