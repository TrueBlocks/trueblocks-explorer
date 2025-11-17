import { memo } from 'react';

import { Stack, Text } from '@mantine/core';
import { getDisplayAddress } from '@utils';

import { withFallback } from './utils';

interface NamedAddressRendererProps {
  value: unknown;
  rowData?: Record<string, unknown>;
  field?: { key?: string };
  tableCell?: boolean;
}

export const NamedAddressRenderer = memo(
  ({ value, rowData, field, tableCell }: NamedAddressRendererProps) => {
    if (!rowData || !field?.key) {
      return withFallback(value, 'N/A');
    }

    // Extract the prefix from the synthetic field key (e.g., "addressNamed" -> "address")
    const syntheticKey = field.key;
    const addressKey = syntheticKey.replace(/Named$/, '');
    const nameKey = `${addressKey}Name`;

    const address = rowData[addressKey] as string;
    const name = rowData[nameKey] as string;

    // If both are missing, return fallback
    if (!address && !name) {
      return withFallback(value, 'N/A');
    }

    // If we only have address, show it (shortened in table mode)
    if (address && !name) {
      const displayAddress = tableCell ? getDisplayAddress(address) : address;
      return (
        <Text
          size={tableCell ? 'sm' : 'md'}
          style={{ fontFamily: 'monospace' }}
        >
          {displayAddress}
        </Text>
      );
    }

    // If we only have name, show it normally
    if (name && !address) {
      return <Text size={tableCell ? 'sm' : 'md'}>{name}</Text>;
    }

    // Show both name and address in two lines (address shortened in table mode)
    const displayAddress = tableCell ? getDisplayAddress(address) : address;
    return (
      <Stack gap={2}>
        <Text
          size={tableCell ? 'sm' : 'md'}
          fw={500}
          style={{ lineHeight: 1.2 }}
        >
          {name}
        </Text>
        <Text
          size={tableCell ? 'xs' : 'sm'}
          c="dimmed"
          style={{ fontFamily: 'monospace', lineHeight: 1.2 }}
        >
          {displayAddress}
        </Text>
      </Stack>
    );
  },
);

NamedAddressRenderer.displayName = 'NamedAddressRenderer';
