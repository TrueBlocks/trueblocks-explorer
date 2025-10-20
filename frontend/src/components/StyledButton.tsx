import { MouseEventHandler, ReactNode, RefObject } from 'react';

import { Button, ButtonProps } from '@mantine/core';

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
  const getMantineVariant = () => {
    switch (variant) {
      case 'menu':
      case 'menu-selected':
        return 'subtle'; // Use subtle for both, differentiate with bg prop
      case 'filled':
      case 'primary':
      case 'success':
      case 'warning':
        return 'filled'; // Use filled variant with color prop for all colored buttons
      case 'outline':
        return 'outline';
      case 'transparent':
        return 'transparent';
      case 'subtle':
        return 'subtle';
      case 'light':
        return 'light';
      case 'default':
        return 'default';
      default:
        return 'filled';
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'menu':
        return 'gray.6'; // TabView non-active color
      case 'menu-selected':
        return 'gray.9'; // TabView active color
      case 'success':
        // For filled success buttons, use white text for contrast
        return getMantineVariant() === 'filled' ? 'white' : 'success';
      case 'warning':
        // For filled warning buttons, use dark text for contrast (yellow is light)
        return getMantineVariant() === 'filled' ? 'dark' : 'warning';
      case 'primary':
        // For filled primary buttons, use white text for contrast
        return getMantineVariant() === 'filled' ? 'white' : 'primary';
      default:
        return undefined; // Let Mantine handle default colors
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'menu':
        return 'transparent'; // TabView non-active background
      case 'menu-selected':
        return 'gray.2'; // TabView active background
      default:
        return undefined;
    }
  };

  const getStyles = () => {
    // For menu variants, only apply fontWeight for selected
    if (variant === 'menu' || variant === 'menu-selected') {
      return variant === 'menu-selected' ? { fontWeight: 600 } : {};
    }

    // For custom variants (success, warning, primary), let Mantine's color prop handle colors
    const baseStyles = {
      border: 'none', // Remove border for custom variants
    };

    if (disabled) {
      return {
        ...baseStyles,
        opacity: 0.6,
        cursor: 'not-allowed',
      };
    }

    return baseStyles;
  };

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
      variant={getMantineVariant()}
      c={getColor()}
      bg={getBackgroundColor()}
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
