import { memo } from 'react';

import { Badge, Group, Text } from '@mantine/core';
import { formatNumericValue } from '@utils';

import { isInfiniteValue } from './utils';

interface AllowanceWithStatusRendererProps {
  value: unknown;
  row?: Record<string, unknown>;
}

interface ApprovalRow {
  approvalStatus?: string;
  [key: string]: unknown;
}

export const AllowanceWithStatusRenderer = memo(
  ({ value, row }: AllowanceWithStatusRendererProps) => {
    const approvalStatus = (row as ApprovalRow)?.approvalStatus || '';
    const valueStr = String(value || '0');

    const getBadgeColor = (status: string) => {
      if (status === 'revoking') return 'red';
      if (status.startsWith('pending-')) return 'green';
      if (status === 'revoked') return 'orange';
      return 'gray';
    };

    const getBadgeText = (status: string) => {
      if (status === 'revoking') return 'Pending...';
      return status.startsWith('pending-') ? status.substring(8) : status;
    };

    const displayValue = isInfiniteValue(valueStr) ? (
      <Text style={{ fontStyle: 'italic' }}>infinite</Text>
    ) : (
      <Text>{formatNumericValue(valueStr)}</Text>
    );

    return (
      <Group gap="xs" align="center">
        {displayValue}
        {approvalStatus && (
          <Badge
            size="lg"
            color={getBadgeColor(approvalStatus)}
            style={
              getBadgeColor(approvalStatus) === 'red'
                ? { color: 'white' }
                : undefined
            }
          >
            {getBadgeText(approvalStatus)}
          </Badge>
        )}
      </Group>
    );
  },
);

AllowanceWithStatusRenderer.displayName = 'AllowanceWithStatusRenderer';
