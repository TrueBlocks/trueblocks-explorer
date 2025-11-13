import { memo, useState } from 'react';

import { OpenURL } from '@app';
import { Anchor, Grid, Popover, Stack, Text } from '@mantine/core';
import { displayHash } from '@utils';

import { formatTimestamp } from './utils';

export const IdentifierRenderer = memo(
  ({
    value,
    rowData,
  }: {
    value: unknown;
    rowData?: Record<string, unknown>;
  }) => {
    const [opened, setOpened] = useState(false);

    if (rowData) {
      const hasTimestamp = !!rowData.timestamp;
      const dateStr = hasTimestamp
        ? formatTimestamp(rowData.timestamp as number)
        : '';
      const dottedValue = dotted(rowData);

      // Build tooltip content with tabular layout when timestamp is available
      const tooltipContent = hasTimestamp ? (
        <Grid>
          <Grid.Col span={4}>
            <Text size="sm" fw={600}>
              Date:
            </Text>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text size="sm">{dateStr}</Text>
          </Grid.Col>

          {dottedValue && (
            <>
              <Grid.Col span={4}>
                <Text size="sm" fw={600}>
                  Block.Tx.Log:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text size="sm">{dottedValue}</Text>
              </Grid.Col>
            </>
          )}

          {typeof rowData.transactionHash === 'string' &&
            rowData.transactionHash && (
              <>
                <Grid.Col span={4}>
                  <Text size="sm" fw={600}>
                    Tx Hash:
                  </Text>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Anchor
                    size="sm"
                    c="blue.6"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      OpenURL(
                        `https://etherscan.io/tx/${rowData.transactionHash}`,
                      )
                    }
                  >
                    {displayHash(rowData.transactionHash)}
                  </Anchor>
                </Grid.Col>
              </>
            )}

          {typeof rowData.blockHash === 'string' && rowData.blockHash && (
            <>
              <Grid.Col span={4}>
                <Text size="sm" fw={600}>
                  Block Hash:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Anchor
                  size="sm"
                  c="blue.6"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    OpenURL(`https://etherscan.io/block/${rowData.blockHash}`)
                  }
                >
                  {displayHash(rowData.blockHash)}
                </Anchor>
              </Grid.Col>
            </>
          )}

          {typeof rowData.address === 'string' && rowData.address && (
            <>
              <Grid.Col span={4}>
                <Text size="sm" fw={600}>
                  Address:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text size="sm">{displayHash(rowData.address)}</Text>
              </Grid.Col>
            </>
          )}
        </Grid>
      ) : (
        <Stack gap="xs">
          {dottedValue && (
            <Text size="sm">
              <strong>Block.Tx.Log:</strong> {dottedValue}
            </Text>
          )}
          {typeof rowData.transactionHash === 'string' &&
            rowData.transactionHash && (
              <Text size="sm">
                <strong>Tx Hash:</strong> {displayHash(rowData.transactionHash)}
              </Text>
            )}
          {typeof rowData.blockHash === 'string' && rowData.blockHash && (
            <Text size="sm">
              <strong>Block Hash:</strong> {displayHash(rowData.blockHash)}
            </Text>
          )}
          {typeof rowData.address === 'string' && rowData.address && (
            <Text size="sm">
              <strong>Address:</strong> {displayHash(rowData.address)}
            </Text>
          )}
        </Stack>
      );

      // Display text: date if available, otherwise dotted notation
      const displayText = hasTimestamp ? dateStr : dottedValue;

      return (
        <Popover
          opened={opened}
          onChange={setOpened}
          width={320}
          position="right"
          offset={{ mainAxis: 10, crossAxis: 0 }}
          withArrow
          shadow="md"
          radius="md"
          middlewares={{ flip: false, shift: false }}
          transitionProps={{ duration: 20 }}
        >
          <Popover.Target>
            <Text
              variant="primary"
              size="sm"
              style={{ cursor: 'help', textDecoration: 'underline dotted' }}
              onMouseEnter={() => setOpened(true)}
              onMouseLeave={() => setOpened(false)}
            >
              {displayText || 'N/A'}
            </Text>
          </Popover.Target>
          <Popover.Dropdown
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          >
            {tooltipContent}
          </Popover.Dropdown>
        </Popover>
      );
    }
    return (value as React.ReactNode) || 'N/A';
  },
);

IdentifierRenderer.displayName = 'IdentifierRenderer';

const dotted = (data: Record<string, unknown>) => {
  if (!data) return '';
  if (!data.blockNumber) return '';
  const parts = [String(data.blockNumber)];
  if (data.transactionIndex != null) {
    parts.push(String(data.transactionIndex));
    if (data.logIndex != null) {
      parts.push(String(data.logIndex));
    } else if (data.traceIndex != null) {
      parts.push(`[${data.traceIndex}]`);
    }
  }
  return parts.join('.');
};
