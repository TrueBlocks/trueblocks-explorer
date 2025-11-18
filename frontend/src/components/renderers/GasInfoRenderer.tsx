import { useActiveProject } from '@hooks';
import { Grid } from '@mantine/core';
import { types } from '@models';
import { formatNumericValue } from '@utils';

export interface GasInfo {
  gas?: number | string;
  gasOut?: number | string;
  gasPrice?: number | string;
  gasUsed?: number | string;
  maxFeePerGas?: number | string;
  maxPriorityFeePerGas?: number | string;
  cumulativeGasUsed?: number | string;
  effectiveGasPrice?: number | string;
  namedFrom?: string;
  fromAddress?: string;
}

interface GasInfoRendererProps {
  gasInfo: GasInfo;
}

export const txToGasInfo = (
  transaction: types.Transaction,
  namedFrom?: string,
  fromAddress?: string,
): GasInfo => {
  return {
    gas: transaction.gas,
    gasOut: transaction.gasPrice * transaction.gasUsed,
    gasPrice: transaction.gasPrice,
    gasUsed: transaction.gasUsed,
    maxFeePerGas: transaction.maxFeePerGas,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
    cumulativeGasUsed: transaction.receipt?.cumulativeGasUsed,
    effectiveGasPrice: transaction.receipt?.effectiveGasPrice,
    namedFrom,
    fromAddress,
  };
};

export const GasInfoRenderer = ({ gasInfo }: GasInfoRendererProps) => {
  const { activeAddress } = useActiveProject();

  // Calculate gas cost
  const gasCost = () => {
    const gasUsedNum = Number(gasInfo.gasUsed || gasInfo.gasOut || 0);
    const gasPriceNum = Number(
      gasInfo.effectiveGasPrice || gasInfo.gasPrice || 0,
    );
    return gasUsedNum * gasPriceNum;
  };

  // Only show gas info if this is a transaction from the active address
  const shouldShowGasInfo =
    gasInfo.fromAddress &&
    activeAddress &&
    gasInfo.fromAddress.toLowerCase() === activeAddress.toLowerCase();

  // Calculate gas cost in ETH
  const calculateGasCost = () => {
    const cost = gasCost();
    return (cost / 1e18).toFixed(8);
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
                >
                  <span style={{ fontWeight: 600 }}>
                    {gasInfo.gasUsed
                      ? formatNumericValue(gasInfo.gasUsed)
                      : 'N/A'}
                  </span>{' '}
                  ×{' '}
                  <span style={{ fontWeight: 600 }}>
                    {gasInfo.gasPrice
                      ? formatNumericValue(gasInfo.gasPrice)
                      : 'N/A'}
                  </span>{' '}
                  gwei ={' '}
                  <span style={{ fontWeight: 600 }}>{calculateGasCost()}</span>{' '}
                  gwei
                </td>
              </tr>
              <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <td
                  style={{
                    padding: '8px',
                    verticalAlign: 'top',
                  }}
                >
                  Gas charged to{' '}
                  {shouldShowGasInfo ? (
                    <span style={{ fontWeight: 600 }}>
                      {gasInfo.namedFrom || gasInfo.fromAddress}
                    </span>
                  ) : (
                    'sender'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          style={{
            fontSize: '11px',
            fontStyle: 'italic',
            textAlign: 'left',
            marginTop: '4px',
            color: 'var(--mantine-color-dimmed)',
          }}
        >
          gasUsed × gasPrice = gasCost
        </div>
      </Grid.Col>
    </Grid>
  );
};
