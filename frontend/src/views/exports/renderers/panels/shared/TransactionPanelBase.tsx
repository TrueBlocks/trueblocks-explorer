import React, { useMemo } from 'react';

import {
  DetailContainer,
  DetailSection,
  InfoAddressRenderer,
  InfoArticulationRenderer,
  InfoDetailsRenderer,
  InfoGasRenderer,
  InfoStatusRenderer,
  txToAddressInfo,
  txToArticulationInfo,
  txToDetailsInfo,
  txToGasInfo,
  txToStatusInfo,
} from '@components';
import { types } from '@models';
import { addressToHex } from '@utils';

import '../../../../../components/detail/DetailTable.css';

interface TransactionPanelBaseProps {
  rowData: Record<string, unknown> | null;
  title: React.ReactNode;
  showGasSection?: boolean;
  showStatusSection?: boolean;
}

export const TransactionPanelBase: React.FC<TransactionPanelBaseProps> = ({
  rowData,
  title,
  showGasSection = true,
  showStatusSection = true,
}) => {
  const transaction = useMemo(
    () =>
      (rowData as unknown as types.Transaction) ||
      types.Transaction.createFrom({}),
    [rowData],
  );

  const articulationInfo = useMemo(
    () => txToArticulationInfo(transaction),
    [transaction],
  );

  const gasInfo = useMemo(
    () =>
      txToGasInfo(
        transaction,
        transaction.fromName,
        addressToHex(transaction.from),
      ),
    [transaction],
  );

  const statusInfo = useMemo(() => txToStatusInfo(transaction), [transaction]);

  const detailsInfo = useMemo(
    () => txToDetailsInfo(transaction),
    [transaction],
  );

  const addressInfo = useMemo(
    () =>
      txToAddressInfo(
        transaction.from,
        transaction.fromName,
        transaction.to,
        transaction.toName,
      ),
    [transaction],
  );

  if (!rowData) {
    return <div className="no-selection">Loading...</div>;
  }

  return (
    <DetailContainer title={title}>
      <DetailSection title={'Information'}>
        <InfoAddressRenderer addressInfo={addressInfo} />
      </DetailSection>

      <DetailSection title={'Function Call'}>
        <InfoArticulationRenderer articulationInfo={articulationInfo} />
      </DetailSection>

      <DetailSection title={'Transaction & Block Details'}>
        <InfoDetailsRenderer detailsInfo={detailsInfo} />
      </DetailSection>

      <DetailSection
        title={'Receipt Details'}
        cond={showGasSection && !!gasInfo}
      >
        <InfoGasRenderer gasInfo={gasInfo} />
      </DetailSection>

      <DetailSection
        title={'Receipt & Trace Status'}
        cond={showStatusSection && !!statusInfo}
      >
        <InfoStatusRenderer statusInfo={statusInfo} />
      </DetailSection>
    </DetailContainer>
  );
};
