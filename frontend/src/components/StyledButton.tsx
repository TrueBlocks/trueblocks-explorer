import { MouseEventHandler, ReactNode, RefObject } from 'react';

import { Button, ButtonProps } from '@mantine/core';

import './StyledButton.css';

export interface StyledButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?:
    | 'filled'
    | 'subtle'
    | 'light'
    | 'outline'
    | 'default'
    | 'transparent'
    | 'primary'
    | 'success'
    | 'warning'
    | 'menu'
    | 'menu-selected';
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  tabIndex?: number;
  title?: string;
  ref?: RefObject<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftSection?: ReactNode;
  fullWidth?: boolean;
}

export const StyledButton = ({
  variant = 'filled',
  children,
  onClick,
  type,
  tabIndex,
  title,
  ref,
  disabled,
  loading,
  size,
  leftSection,
  fullWidth,
  ...restProps
}: StyledButtonProps) => {
  const getStyles = () => {
    const baseStyles = (() => {
      switch (variant) {
        case 'menu':
        case 'menu-selected':
          // These variants use CSS classes for proper hover handling
          return {};
        case 'filled':
          return {
            backgroundColor: 'var(--skin-primary)',
            color: 'var(--skin-text-inverse)',
            border: 'none',
          };
        case 'subtle':
          return {
            backgroundColor: 'var(--skin-surface-subtle)',
            color: 'var(--mantine-color-text)',
            border: 'none',
          };
        case 'light':
          return {
            backgroundColor: 'var(--skin-surface-light)',
            color: 'var(--mantine-color-text)',
            border: 'none',
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            color: 'var(--skin-primary)',
            border: '1px solid var(--skin-border)',
          };
        case 'default':
          return {
            backgroundColor: 'var(--skin-surface-base)',
            color: 'var(--mantine-color-text)',
            border: '1px solid var(--skin-border)',
          };
        case 'transparent':
          return {
            backgroundColor: 'transparent',
            color: 'var(--skin-text-dimmed)',
            border: 'none',
          };
        case 'primary':
          return {
            backgroundColor: 'var(--skin-primary)',
            color: 'var(--skin-text-inverse)',
            border: 'none',
          };
        case 'success':
          return {
            backgroundColor: 'var(--skin-success)',
            color: 'var(--skin-text-inverse)',
            border: 'none',
          };
        case 'warning':
          return {
            backgroundColor: 'var(--skin-warning)',
            color: 'var(--skin-text-inverse)',
            border: 'none',
          };
        default:
          return {
            backgroundColor: 'var(--skin-primary)',
            color: 'var(--skin-text-inverse)',
            border: 'none',
          };
      }
    })();

    if (disabled) {
      return {
        ...baseStyles,
        opacity: 0.6,
        cursor: 'not-allowed',
      };
    }

    return baseStyles;
  };

  const getClassName = () => {
    switch (variant) {
      case 'menu':
        return 'styled-button-menu';
      case 'menu-selected':
        return 'styled-button-menu-selected';
      default:
        return '';
    }
  };

  // If there are no children but there's a leftSection (icon), center it
  const shouldCenterIcon = !children && leftSection;

  return (
    <Button
      onClick={onClick}
      type={type}
      tabIndex={tabIndex}
      title={title}
      ref={ref}
      disabled={disabled}
      loading={loading}
      size={size}
      leftSection={shouldCenterIcon ? undefined : leftSection}
      fullWidth={fullWidth}
      variant="unstyled"
      className={getClassName()}
      style={{
        ...getStyles(),
        ...(shouldCenterIcon && {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }),
        ...restProps.style,
      }}
      {...restProps}
    >
      {shouldCenterIcon ? leftSection : children}
    </Button>
  );
};
