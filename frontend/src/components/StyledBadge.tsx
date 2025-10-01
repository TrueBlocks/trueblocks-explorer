import { Badge, BadgeProps } from '@mantine/core';

export interface StyledBadgeProps extends Omit<BadgeProps, 'variant'> {
  variant?: 'filled' | 'light' | 'error' | 'healthy' | 'inactive' | 'boolean';
}

export const StyledBadge = ({
  variant = 'filled',
  ...props
}: StyledBadgeProps) => {
  const getStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'var(--skin-primary)',
          color: 'var(--skin-text-inverse)',
          border: 'none',
        };
      case 'light':
        return {
          backgroundColor: 'var(--skin-surface-raised)',
          color: 'var(--skin-primary)',
          border: 'none',
        };
      case 'error':
        return {
          backgroundColor: 'var(--skin-error-background)',
          color: 'var(--skin-error)',
          border: '1px solid var(--skin-error)',
        };
      case 'healthy':
        return {
          backgroundColor: 'var(--skin-success-background)',
          color: 'var(--skin-success)',
          border: 'none',
        };
      case 'inactive':
        return {
          backgroundColor: 'var(--mantine-color-gray-2)',
          color: 'var(--mantine-color-gray-5)',
          border: 'none',
        };
      case 'boolean':
        return {
          backgroundColor: 'var(--mantine-color-success-6)',
          color: 'var(--mantine-color-white)',
          border: 'none',
        };
      default:
        return {
          backgroundColor: 'var(--skin-primary)',
          color: 'var(--skin-text-inverse)',
          border: 'none',
        };
    }
  };

  return (
    <Badge
      {...props}
      variant="unstyled"
      style={{
        ...getStyles(),
        ...props.style,
      }}
    />
  );
};
