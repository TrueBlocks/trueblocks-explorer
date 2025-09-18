import { CSSProperties } from 'react';

interface TabDividerProps {
  /** Height of the divider line */
  height?: string | number;
  /** Color of the divider line */
  color?: string;
  /** Margin around the divider */
  margin?: string;
  /** Additional styles */
  style?: CSSProperties;
}

/**
 * A visual separator for use between tab groups in Mantine Tabs component.
 * Creates a vertical line to distinguish between different sets of tabs.
 */
export const TabDivider = ({
  height = '24px',
  color = 'var(--mantine-color-gray-4)',
  margin = '0 8px',
  style = {},
}: TabDividerProps) => (
  <div
    style={{
      width: '1px',
      height,
      backgroundColor: color,
      margin,
      alignSelf: 'center',
      ...style,
    }}
  />
);
