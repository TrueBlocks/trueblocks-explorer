import { Badge, BadgeProps } from '@mantine/core';

export interface StyledBadgeProps extends Omit<BadgeProps, 'variant'> {
  variant?:
    | 'filled'
    | 'light'
    | 'outline'
    | 'dot'
    | 'default'
    | 'error'
    | 'healthy'
    | 'inactive';
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
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--skin-primary)',
          border: '1px solid var(--skin-primary)',
        };
      case 'dot':
        return {
          backgroundColor: 'var(--skin-surface-base)',
          color: 'var(--skin-text-primary)',
          border: 'none',
          position: 'relative' as const,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--skin-primary)',
          },
        };
      case 'default':
        return {
          backgroundColor: 'var(--skin-surface-base)',
          color: 'var(--skin-text-primary)',
          border: '1px solid var(--skin-border-subtle)',
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
          backgroundColor: 'var(--skin-surface-subtle)',
          color: 'var(--skin-text-dimmed)',
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
