import { memo } from 'react';

import { Text } from '@mantine/core';

export const CheckmarkRenderer = memo(
  ({ value, tableCell }: { value: unknown; tableCell?: boolean }) => {
    const isTrue = value === true || value === 'true';

    if (tableCell) {
      return (
        <Text c={isTrue ? 'green' : 'red'} fw={600} size="md">
          {isTrue ? '✓' : '✗'}
        </Text>
      );
    } else {
      return (
        <Text component="span" c={isTrue ? 'green' : 'red'} fw={500}>
          {isTrue ? '✓' : '✗'}
        </Text>
      );
    }
  },
);

CheckmarkRenderer.displayName = 'CheckmarkRenderer';
