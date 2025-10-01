import { Divider, DividerProps } from '@mantine/core';

interface StyledDividerProps extends Omit<DividerProps, 'color'> {
  height?: string | number;
  width?: string | number;
  color?: string;
  margin?: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A styled divider component that provides consistent theming for both horizontal and vertical separators.
 * Uses Mantine semantic colors and supports flexible sizing and spacing.
 */
export const StyledDivider = ({
  height = '24px',
  width,
  color = 'gray.3',
  margin,
  orientation = 'vertical',
  style = {},
  ...props
}: StyledDividerProps) => {
  const defaultMargin = orientation === 'vertical' ? '0 8px' : '8px 0';
  const finalMargin = margin ?? defaultMargin;

  return (
    <Divider
      orientation={orientation}
      c={color}
      style={{
        ...(orientation === 'vertical' && { height }),
        ...(orientation === 'horizontal' && width && { width }),
        margin: finalMargin,
        alignSelf: 'center',
        ...style,
      }}
      {...props}
    />
  );
};
