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
          backgroundColor: 'var(--mantine-color-primary-6)',
          color: 'var(--mantine-color-white)',
          border: 'none',
        };
      case 'light':
        return {
          backgroundColor: 'var(--mantine-color-gray-2)',
          color: 'var(--mantine-color-primary-6)',
          border: 'none',
        };
      case 'error':
        return {
          backgroundColor: 'var(--mantine-color-error-1)',
          color: 'var(--mantine-color-error-6)',
          border: '1px solid var(--mantine-color-error-6)',
        };
      case 'healthy':
        return {
          backgroundColor: 'var(--mantine-color-success-1)',
          color: 'var(--mantine-color-success-6)',
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
          backgroundColor: 'var(--mantine-color-primary-6)',
          color: 'var(--mantine-color-white)',
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
