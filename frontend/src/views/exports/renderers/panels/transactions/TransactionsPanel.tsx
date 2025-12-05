// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import React, { useMemo } from 'react';

import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  InfoAddressRenderer,
  InfoArticulationRenderer,
  InfoDetailsRenderer,
  InfoGasRenderer,
  InfoStatusRenderer,
  StyledValue,
  txToAddressInfo,
  txToArticulationInfo,
  txToDetailsInfo,
  txToGasInfo,
  txToStatusInfo,
} from '@components';
import { Group } from '@mantine/core';
import { types } from '@models';
import { addressToHex, displayHash } from '@utils';

import '../../../../../components/detail/DetailTable.css';

// EXISTING_CODE

export const TransactionsPanel = (
  rowData: Record<string, unknown>,
  _onFinal: (rowKey: string, newValue: string, txHash: string) => void,
) => {
  // EXISTING_CODE
  const facet = 'transactions';

  const transaction = useMemo(
    () =>
      (rowData as unknown as types.Transaction) ||
      types.Transaction.createFrom({}),
    [rowData],
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

  const articulationInfo = useMemo(
    () => txToArticulationInfo(transaction),
    [transaction],
  );

  const detailsInfo = useMemo(
    () => txToDetailsInfo(transaction),
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

  const titleComponent = useMemo(
    () => (
      <Group justify="space-between" align="flex-start">
        <StyledValue variant="blue" weight="strong" size="md">
          Transaction {displayHash(transaction.hash)}
        </StyledValue>
        <StyledValue variant="blue" weight="strong" size="md">
          Block {transaction.blockNumber}
        </StyledValue>
      </Group>
    ),
    [transaction.hash, transaction.blockNumber],
  );

  return (
    <DetailContainer>
      <DetailHeader>{titleComponent}</DetailHeader>

      <DetailSection facet={facet} title={'Information'}>
        <InfoAddressRenderer addressInfo={addressInfo} />
      </DetailSection>

      <DetailSection facet={facet} title={'Articulated Call'}>
        <InfoArticulationRenderer articulationInfo={articulationInfo} />
      </DetailSection>

      <DetailSection facet={facet} title={'Transaction & Block Details'}>
        <InfoDetailsRenderer detailsInfo={detailsInfo} />
      </DetailSection>

      <DetailSection facet={facet} title={'Receipt Details'} cond={!!gasInfo}>
        <InfoGasRenderer gasInfo={gasInfo} />
      </DetailSection>

      <DetailSection
        facet={facet}
        title={'Receipt & Trace Status'}
        cond={!!statusInfo}
      >
        <InfoStatusRenderer statusInfo={statusInfo} />
      </DetailSection>
    </DetailContainer>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
