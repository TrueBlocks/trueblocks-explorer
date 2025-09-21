import { StyledBadge, StyledText } from '@components';
import { Group } from '@mantine/core';

type StatusType = 'healthy' | 'inactive';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  count?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const statusConfig: Record<
  StatusType,
  { colorVar: string; backgroundVar: string; label: string }
> = {
  healthy: {
    colorVar: 'var(--skin-success)',
    backgroundVar: 'var(--skin-success-background)',
    label: 'Healthy',
  },
  inactive: {
    colorVar: 'var(--skin-text-dimmed)',
    backgroundVar: 'var(--skin-surface-subtle)',
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
        variant="light"
        size="xs"
        aria-label={`Status: ${config.label}`}
        style={{
          backgroundColor: config.backgroundVar,
          color: config.colorVar,
          border: 'none',
        }}
      >
        {config.label}
      </StyledBadge>

      <StyledText variant="dimmed" size="xs">
        {label}
      </StyledText>

      {count !== undefined && (
        <StyledText variant="primary" size="xs" fw={600}>
          ({count})
        </StyledText>
      )}
    </Group>
  );
};
