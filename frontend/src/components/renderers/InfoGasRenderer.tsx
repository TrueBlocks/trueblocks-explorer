import { StyledValue } from '@components';
import { useActiveProject } from '@hooks';
import { types } from '@models';
import { formatNumericValue } from '@utils';

import { PanelRow, PanelTable } from '.';

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

interface InfoGasRendererProps {
  gasInfo: GasInfo;
}

export const InfoGasRenderer = ({ gasInfo }: InfoGasRendererProps) => {
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
    return (cost / 1e18).toFixed(6); // Convert from wei to ETH (divide by 1e18)
  };

  // Convert gas price from wei to gwei for display
  const formatGasPrice = () => {
    const price = Number(gasInfo.effectiveGasPrice || gasInfo.gasPrice || 0);
    return (price / 1e9).toFixed(2); // Convert wei to gwei
  };

  return (
    <>
      <PanelTable>
        <PanelRow layout="full" colSpan={2}>
          <StyledValue weight="strong">
            {gasInfo.gasUsed ? formatNumericValue(gasInfo.gasUsed) : 'N/A'}
          </StyledValue>{' '}
          ×{' '}
          <StyledValue weight="strong">
            {gasInfo.gasPrice ? formatGasPrice() : 'N/A'}
          </StyledValue>{' '}
          gwei = <StyledValue weight="strong">{calculateGasCost()}</StyledValue>{' '}
          ETH
        </PanelRow>
        <PanelRow layout="full" colSpan={2}>
          Gas charged to{' '}
          {shouldShowGasInfo ? (
            <StyledValue weight="strong">
              {gasInfo.namedFrom || gasInfo.fromAddress}
            </StyledValue>
          ) : (
            'sender'
          )}
        </PanelRow>
      </PanelTable>
      <div className="panel-formula-note">gasUsed × gasPrice = gasCost</div>
    </>
  );
};

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
