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
          '&:hover': {
            backgroundColor: 'var(--skin-primary-hover)',
          },
        };
      case 'subtle':
        return {
          backgroundColor: 'var(--skin-surface-subtle)',
          color: 'var(--mantine-color-text)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-hover)',
          },
        };
      case 'light':
        return {
          backgroundColor: 'var(--skin-surface-light)',
          color: 'var(--mantine-color-text)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-hover)',
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--skin-primary)',
          border: '1px solid var(--skin-border)',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-subtle)',
          },
        };
      case 'default':
        return {
          backgroundColor: 'var(--skin-surface-base)',
          color: 'var(--mantine-color-text)',
          border: '1px solid var(--skin-border)',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-hover)',
          },
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
          color: 'var(--skin-text-dimmed)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-subtle)',
          },
        };
      case 'primary':
        return {
          backgroundColor: 'var(--skin-primary)',
          color: 'var(--skin-text-inverse)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-primary-hover)',
          },
        };
      case 'success':
        return {
          backgroundColor: 'var(--skin-success)',
          color: 'var(--skin-text-inverse)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-success-hover)',
          },
        };
      case 'warning':
        return {
          backgroundColor: 'var(--skin-warning)',
          color: 'var(--skin-text-inverse)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-warning-hover)',
          },
        };
      default:
        return {
          backgroundColor: 'var(--skin-primary)',
          color: 'var(--skin-text-inverse)',
          border: 'none',
          '&:hover': {
            backgroundColor: 'var(--skin-primary-hover)',
          },
        };
    }
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
      leftSection={leftSection}
      fullWidth={fullWidth}
      variant="unstyled"
      className={getClassName()}
      style={{
        ...getStyles(),
        ...restProps.style,
      }}
      {...restProps}
    >
      {children}
    </Button>
  );
};
