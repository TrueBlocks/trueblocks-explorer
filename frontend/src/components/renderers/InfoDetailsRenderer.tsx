import { EtherRenderer, StyledLabel, StyledValue } from '@components';
import { types } from '@models';
import { createHashLink } from '@utils';

import { PanelRow, PanelTable } from '.';

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

interface InfoDetailsRendererProps {
  detailsInfo: DetailsInfo;
}

export const InfoDetailsRenderer = ({
  detailsInfo,
}: InfoDetailsRendererProps) => {
  // Format combined date and time
  const formatDateTime = () => {
    if (!detailsInfo.timestamp) return 'Unknown';
    const date = new Date(detailsInfo.timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <PanelTable>
      <PanelRow
        layout="full"
        colSpan={2}
        value={
          <StyledValue weight="strong" size="md">
            {formatDateTime()}
          </StyledValue>
        }
      />
      <PanelRow
        layout="wide"
        label={
          <>
            <StyledLabel weight="normal">Hash</StyledLabel>{' '}
            {createHashLink(detailsInfo.hash as { hash?: number[] }, 'hash')}
          </>
        }
        value={
          <>
            <StyledLabel weight="normal">Value</StyledLabel>{' '}
            <EtherRenderer value={detailsInfo.value} />
          </>
        }
      />
      <PanelRow
        layout="wide"
        label={
          <>
            <StyledLabel weight="normal">Block</StyledLabel>{' '}
            <StyledValue weight="strong">
              {detailsInfo.blockNumber}.{detailsInfo.transactionIndex}
            </StyledValue>
          </>
        }
        value={
          <>
            <StyledLabel weight="normal">Block Hash</StyledLabel>{' '}
            {createHashLink(
              detailsInfo.blockHash as { hash?: number[] },
              'block',
            )}
          </>
        }
      />
    </PanelTable>
  );
};

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
