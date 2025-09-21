import { ReactNode } from 'react';

import { Text, TextProps } from '@mantine/core';

export interface StyledTextProps extends Omit<TextProps, 'c'> {
  variant: 'primary' | 'secondary' | 'dimmed' | 'success' | 'error' | 'warning';
  children?: ReactNode;
}

export const StyledText = ({
  variant = 'primary',
  ...props
}: StyledTextProps) => {
  const getColor = () => {
    switch (variant) {
      case 'primary':
        return 'var(--mantine-color-text)';
      case 'secondary':
        return 'var(--skin-text-secondary)';
      case 'dimmed':
        return 'var(--skin-text-dimmed)';
      case 'success':
        return 'var(--skin-success)';
      case 'error':
        return 'var(--skin-error)';
      case 'warning':
        return 'var(--skin-warning)';
      default:
        return 'var(--mantine-color-text)';
    }
  };

  return (
    <Text
      {...props}
      style={{
        color: getColor(),
        ...props.style,
      }}
    />
  );
};
