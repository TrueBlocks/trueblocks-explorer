import { EtherRenderer } from '@components';
import { types } from '@models';
import { createHashLink } from '@utils';

import { CustomSection, PanelRow, PanelTable } from '.';

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
    <CustomSection>
      <PanelTable>
        <PanelRow
          layout="full"
          colSpan={2}
          value={
            <span style={{ fontWeight: 600, fontSize: '13px' }}>
              {formatDateTime()}
            </span>
          }
        />
        <PanelRow
          layout="wide"
          label={
            <>
              <span style={{ fontWeight: 500 }}>Hash:</span>{' '}
              {createHashLink(detailsInfo.hash as { hash?: number[] }, 'hash')}
            </>
          }
          value={
            <>
              <span style={{ fontWeight: 500 }}>Value:</span>{' '}
              <EtherRenderer value={detailsInfo.value} />
            </>
          }
        />
        <PanelRow
          layout="wide"
          label={
            <>
              <span style={{ fontWeight: 500 }}>Block:</span>{' '}
              <span style={{ fontWeight: 600 }}>
                {detailsInfo.blockNumber}.{detailsInfo.transactionIndex}
              </span>
            </>
          }
          value={
            <>
              <span style={{ fontWeight: 500 }}>Block Hash:</span>{' '}
              {createHashLink(
                detailsInfo.blockHash as { hash?: number[] },
                'block',
              )}
            </>
          }
        />
      </PanelTable>
    </CustomSection>
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
