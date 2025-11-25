import { DetailSection } from '@components';
import { Text } from '@mantine/core';
import { types } from '@models';
import { createHashLink } from '@utils';

import { PanelRow, PanelTable } from '.';

export interface StatusInfo {
  status?: number | string;
  isError?: boolean;
  contractAddress?: unknown;
  contractAddressName?: string;
  cumulativeGasUsed?: number | string;
  effectiveGasPrice?: number | string;
  logs?: unknown[];
  traces?: unknown[];
}

interface InfoStatusRendererProps {
  statusInfo: StatusInfo;
}

export const InfoStatusRenderer = ({ statusInfo }: InfoStatusRendererProps) => {
  // Get receipt status display
  const getReceiptStatus = () => {
    if (statusInfo.status === undefined) return 'No receipt';

    const status = statusInfo.status;
    const isError = statusInfo.isError;

    if (isError) return 'Failed';
    if (status === 1) return 'Success';
    if (status === 0) return 'Failed';
    return 'Unknown';
  };

  // Get receipt status color
  const getStatusColor = () => {
    if (statusInfo.status === undefined) return 'dimmed';

    const isError = statusInfo.isError;
    const status = statusInfo.status;

    if (isError) return 'red';
    if (status === 1) return 'green';
    if (status === 0) return 'red';
    return 'dimmed';
  };

  return (
    <DetailSection>
      <PanelTable>
        <PanelRow
          layout="wide"
          label={
            <>
              <span style={{ fontWeight: 500 }}>Status:</span>{' '}
              <Text component="span" c={getStatusColor()} fw={600}>
                {getReceiptStatus()}
              </Text>
            </>
          }
          value={
            <>
              <span style={{ fontWeight: 500 }}>Log Count:</span>{' '}
              <span style={{ fontWeight: 600 }}>
                {statusInfo.logs?.length || 0}
              </span>
            </>
          }
        />
        <PanelRow
          layout="wide"
          label={
            statusInfo.contractAddress ? (
              <span>
                {createHashLink(statusInfo.contractAddress, 'address')}
              </span>
            ) : (
              'None'
            )
          }
          value={
            <>
              <span style={{ fontWeight: 500 }}>Trace Count:</span>{' '}
              <span style={{ fontWeight: 600 }}>
                {statusInfo.traces?.length || 0}
              </span>
            </>
          }
        />
      </PanelTable>
    </DetailSection>
  );
};

export const txToStatusInfo = (transaction: types.Transaction): StatusInfo => {
  return {
    status: transaction.receipt?.status,
    isError: transaction.isError,
    contractAddress: transaction.receipt?.contractAddress,
    contractAddressName: transaction.receipt?.contractAddressName,
    cumulativeGasUsed: transaction.receipt?.cumulativeGasUsed,
    effectiveGasPrice: transaction.receipt?.effectiveGasPrice,
    logs: transaction.receipt?.logs,
    traces: transaction.traces,
  };
};
