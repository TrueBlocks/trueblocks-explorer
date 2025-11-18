import { Grid } from '@mantine/core';
import { createAddressLink } from '@utils';

export interface AddressInfo {
  from?: unknown;
  fromName?: string;
  to?: unknown;
  toName?: string;
  showFromLabel?: boolean;
  toLabel?: string; // Custom label for 'to' field (e.g., 'Contract' for logs)
}

export const txToAddressInfo = (
  from?: unknown,
  fromName?: string,
  to?: unknown,
  toName?: string,
): AddressInfo => {
  return {
    from,
    fromName,
    to,
    toName,
    showFromLabel: true,
    toLabel: 'To',
  };
};

export const logToAddressInfo = (
  contractAddress?: unknown,
  contractName?: string,
): AddressInfo => {
  return {
    from: undefined,
    fromName: undefined,
    to: contractAddress,
    toName: contractName,
    showFromLabel: false,
    toLabel: 'Contract',
  };
};

interface AddressInfoRendererProps {
  addressInfo: AddressInfo;
}

export const AddressInfoRenderer = ({
  addressInfo,
}: AddressInfoRendererProps) => {
  const { from, fromName, to, toName, showFromLabel, toLabel } = addressInfo;

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
              fontSize: '12px',
              borderCollapse: 'collapse',
            }}
          >
            <tbody>
              {showFromLabel && !!from && (
                <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                  <td
                    style={{
                      padding: '4px 8px',
                      fontWeight: 'bold',
                      borderBottom: '1px solid var(--mantine-color-gray-2)',
                      width: '80px',
                      verticalAlign: 'top',
                    }}
                  >
                    From
                  </td>
                  <td
                    style={{
                      padding: '4px 8px',
                      borderBottom: '1px solid var(--mantine-color-gray-2)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {fromName && (
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                        {fromName}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--mantine-color-blue-6)',
                      }}
                    >
                      {createAddressLink(from)}
                    </div>
                  </td>
                </tr>
              )}
              {!!to && (
                <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                  <td
                    style={{
                      padding: '4px 8px',
                      fontWeight: 'bold',
                      width: '80px',
                      verticalAlign: 'top',
                    }}
                  >
                    {toLabel || 'To'}
                  </td>
                  <td
                    style={{
                      padding: '4px 8px',
                      wordBreak: 'break-all',
                    }}
                  >
                    {toName && (
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                        {toName}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--mantine-color-blue-6)',
                      }}
                    >
                      {createAddressLink(to)}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Grid.Col>
    </Grid>
  );
};
