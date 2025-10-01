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
        return 'gray.8';
      case 'secondary':
        return 'gray.6';
      case 'dimmed':
        return 'gray.5';
      case 'success':
        return 'success.6';
      case 'error':
        return 'error.6';
      case 'warning':
        return 'warning.6';
      default:
        return 'gray.8';
    }
  };

  return <Text {...props} c={getColor()} />;
};
