import { memo } from 'react';

import { useActiveProject, useIconSets } from '@hooks';
import { Box, Group, Stack, Text } from '@mantine/core';
import { addressToHex, getDisplayAddress } from '@utils';

import { withFallback } from './utils';

interface NamedAddressRendererProps {
  value: unknown;
  rowData?: Record<string, unknown>;
  field?: { key?: string };
  tableCell?: boolean;
}

export const NamedAddressRenderer = memo(
  ({ value, rowData, field, tableCell }: NamedAddressRendererProps) => {
    const { activeAddress } = useActiveProject();
    const icons = useIconSets();

    if (!rowData || !field?.key) {
      return withFallback(value, 'N/A');
    }

    // Extract the prefix from the synthetic field key (e.g., "addressNamed" -> "address")
    const syntheticKey = field.key;
    const addressKey = syntheticKey.replace(/Named$/, '');
    const nameKey = `${addressKey}Name`;

    const address = rowData[addressKey] as string;
    const name = rowData[nameKey] as string;

    // Check if this address matches the active address (normalize both to hex)
    const isActiveAddress =
      address &&
      activeAddress &&
      addressToHex(address) === addressToHex(activeAddress);

    // If both are missing, return fallback
    if (!address && !name) {
      return withFallback(value, 'N/A');
    }

    // If we only have address, show it (shortened in table mode)
    if (address && !name) {
      const displayAddress = tableCell ? getDisplayAddress(address) : address;

      if (isActiveAddress) {
        return (
          <Group gap="xs" align="center">
            <icons.Pin
              size={12}
              style={{ color: 'var(--mantine-color-blue-6)' }}
            />
            <Text
              size={tableCell ? 'sm' : 'md'}
              style={{ fontFamily: 'monospace' }}
              fw={600}
              c="blue"
            >
              {displayAddress}
            </Text>
          </Group>
        );
      }

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

    if (isActiveAddress) {
      return (
        <Stack gap={2}>
          <Group gap="xs" align="center">
            <icons.Pin
              size={12}
              style={{ color: 'var(--mantine-color-blue-6)' }}
            />
            <Text
              size={tableCell ? 'sm' : 'md'}
              fw={600}
              c="blue"
              style={{ lineHeight: 1.2 }}
            >
              {name}
            </Text>
          </Group>
          <Text
            size={tableCell ? 'xs' : 'sm'}
            c="dimmed"
            style={{
              fontFamily: 'monospace',
              lineHeight: 1.2,
              marginLeft: '20px',
            }}
          >
            {displayAddress}
          </Text>
        </Stack>
      );
    }

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
