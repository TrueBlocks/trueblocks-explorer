import { Button, ButtonProps } from '@mantine/core';

export interface StyledButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?:
    | 'filled'
    | 'subtle'
    | 'light'
    | 'outline'
    | 'default'
    | 'transparent';
}

export const StyledButton = ({
  variant = 'filled',
  ...props
}: StyledButtonProps) => {
  const getStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'var(--skin-primary)',
          color: 'var(--skin-text-inverse)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-primary-hover)',
          },
        };
      case 'subtle':
        return {
          backgroundColor: 'transparent',
          color: 'var(--skin-primary)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-subtle)',
          },
        };
      case 'light':
        return {
          backgroundColor: 'var(--skin-surface-raised)',
          color: 'var(--skin-text-primary)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-hover)',
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--skin-text-primary)',
          border: '1px solid var(--skin-border-default)',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-subtle)',
          },
        };
      case 'default':
        return {
          backgroundColor: 'var(--skin-surface-base)',
          color: 'var(--skin-text-primary)',
          border: '1px solid var(--skin-border-subtle)',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-hover)',
          },
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
          color: 'var(--mantine-color-text)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-subtle)',
          },
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
    <Button
      {...props}
      variant="unstyled"
      style={{
        ...getStyles(),
        ...props.style,
      }}
    />
  );
};
