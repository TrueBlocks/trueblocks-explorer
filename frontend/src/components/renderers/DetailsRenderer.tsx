import { EtherRenderer } from '@components';
import { Grid } from '@mantine/core';
import { types } from '@models';
import { createHashLink } from '@utils';

export interface DetailsInfo {
  hash?: unknown;
  blockNumber?: number;
  blockHash?: unknown;
  transactionIndex?: number;
  timestamp?: number;
  nonce?: number;
  type?: string;
  value?: string | number;
  from?: unknown;
  fromName?: string;
  to?: unknown;
  toName?: string;
}

export const txToDetailsInfo = (
  transaction: types.Transaction,
): DetailsInfo => {
  return {
    hash: transaction.hash,
    blockNumber: transaction.blockNumber,
    blockHash: transaction.blockHash,
    transactionIndex: transaction.transactionIndex,
    timestamp: transaction.timestamp,
    nonce: transaction.nonce,
    type: transaction.type,
    value: transaction.value,
    from: transaction.from,
    fromName: transaction.fromName,
    to: transaction.to,
    toName: transaction.toName,
  };
};

interface DetailsRendererProps {
  detailsInfo: DetailsInfo;
}

export const DetailsRenderer = ({ detailsInfo }: DetailsRendererProps) => {
  // Format combined date and time
  const formatDateTime = () => {
    if (!detailsInfo.timestamp) return 'Unknown';
    const date = new Date(detailsInfo.timestamp * 1000);
    return date.toLocaleString();
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
                    verticalAlign: 'top',
                  }}
                  colSpan={2}
                >
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>
                    {formatDateTime()}
                  </span>
                </td>
              </tr>
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
                  <span style={{ fontWeight: 500 }}>Hash:</span>{' '}
                  {createHashLink(
                    detailsInfo.hash as { hash?: number[] },
                    'hash',
                  )}
                </td>
                <td
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    verticalAlign: 'top',
                    width: '50%',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>Value:</span>{' '}
                  <EtherRenderer value={detailsInfo.value} />
                </td>
              </tr>
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
                  <span style={{ fontWeight: 500 }}>Block:</span>{' '}
                  <span style={{ fontWeight: 600 }}>
                    {detailsInfo.blockNumber}.{detailsInfo.transactionIndex}
                  </span>
                </td>
                <td
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    verticalAlign: 'top',
                    width: '50%',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>Block Hash:</span>{' '}
                  {createHashLink(
                    detailsInfo.blockHash as { hash?: number[] },
                    'block',
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Grid.Col>
    </Grid>
  );
};
