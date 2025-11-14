import { memo, useState } from 'react';

import { OpenLink } from '@app';
import { Anchor, Grid, Popover, Text } from '@mantine/core';

import { formatTimestamp } from './utils';

interface PopoverField {
  key: string;
  label: string;
  type: string;
}

interface PopoverRendererProps {
  value: unknown;
  rowData?: Record<string, unknown>;
  popFields?: PopoverField[];
}

// Mini-components for individual field rendering
const GridField = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  onClick?: () => void;
}) => (
  <>
    <Grid.Col span={4}>
      <Text size="sm" fw={600}>
        {label}:
      </Text>
    </Grid.Col>
    <Grid.Col span={8}>
      {onClick ? (
        <Anchor
          size="sm"
          c="blue.6"
          style={{ cursor: 'pointer' }}
          onClick={onClick}
        >
          {value}
        </Anchor>
      ) : (
        <Text size="sm">{value}</Text>
      )}
    </Grid.Col>
  </>
);

export const PopoverRenderer = memo(
  ({ value, rowData, popFields }: PopoverRendererProps) => {
    const [opened, setOpened] = useState(false);

    if (rowData) {
      const hasTimestamp = !!rowData.timestamp;
      const dateStr = hasTimestamp
        ? formatTimestamp(rowData.timestamp as number)
        : '';
      const dottedValue = dotted(rowData);
      const tooltipContent = (
        <Grid>
          {popFields?.flatMap((popField) => {
            const keys = popField.key.split('|');
            return keys.map((key) => {
              const trimmedKey = key.trim();
              const value = rowData[trimmedKey];
              if (!value) return null;
              const isLink = /hash|address/i.test(popField.type);
              const handleClick = isLink
                ? () => OpenLink(trimmedKey, String(value))
                : undefined;

              return (
                <GridField
                  key={trimmedKey}
                  label={popField.label}
                  value={String(value)}
                  onClick={handleClick}
                />
              );
            });
          })}
        </Grid>
      );

      // Display text: date if available, otherwise dotted notation
      const displayText = hasTimestamp ? dateStr : dottedValue;

      return (
        <Popover
          opened={opened}
          onChange={setOpened}
          width={500}
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

PopoverRenderer.displayName = 'PopoverRenderer';

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
