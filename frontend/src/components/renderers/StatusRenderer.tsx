import { Grid, Text } from '@mantine/core';
import { types } from '@models';
import { createHashLink } from '@utils';

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

interface StatusRendererProps {
  statusInfo: StatusInfo;
}

export const StatusRenderer = ({ statusInfo }: StatusRendererProps) => {
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
    <Grid gutter={4}>
      <Grid.Col span={12}>
        <div
          style={{
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '4px',
            marginTop: '8px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <tbody>
              <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <td
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    borderRight: '1px solid var(--mantine-color-gray-2)',
                    verticalAlign: 'top',
                    width: '50%',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>Status:</span>{' '}
                  <Text component="span" c={getStatusColor()} fw={600}>
                    {getReceiptStatus()}
                  </Text>
                </td>
                <td
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    verticalAlign: 'top',
                    width: '50%',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>Log Count:</span>{' '}
                  <span style={{ fontWeight: 600 }}>
                    {statusInfo.logs?.length || 0}
                  </span>
                </td>
              </tr>
              <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <td
                  style={{
                    padding: '8px',
                    borderRight: '1px solid var(--mantine-color-gray-2)',
                    verticalAlign: 'top',
                    width: '50%',
                  }}
                >
                  {statusInfo.contractAddress ? (
                    <span>
                      {createHashLink(statusInfo.contractAddress, 'address')}
                    </span>
                  ) : (
                    'None'
                  )}
                </td>
                <td
                  style={{
                    padding: '8px',
                    verticalAlign: 'top',
                    width: '50%',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>Trace Count:</span>{' '}
                  <span style={{ fontWeight: 600 }}>
                    {statusInfo.traces?.length || 0}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Grid.Col>
    </Grid>
  );
};
