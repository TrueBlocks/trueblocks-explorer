// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
import React, { useMemo } from 'react';

import {
  AddressInfoRenderer,
  ArticulationRenderer,
  DetailPanelContainer,
  DetailSection,
  DetailsRenderer,
  GasInfoRenderer,
  StatusRenderer,
  txToAddressInfo,
  txToArticulationInfo,
  txToDetailsInfo,
  txToGasInfo,
  txToStatusInfo,
} from '@components';
import { Group, Stack, Text } from '@mantine/core';
import { types } from '@models';
import { addressToHex, displayHash } from '@utils';

import '../../../../../components/detail/DetailTable.css';

export const TransactionsPanel = (rowData: Record<string, unknown> | null) => {
  // Memoize transaction conversion to avoid dependency warnings
  const transaction = useMemo(
    () =>
      (rowData as unknown as types.Transaction) || ({} as types.Transaction),
    [rowData],
  );

  // Memoized converter functions (called before early return to maintain hook order)
  const articulationInfo = useMemo(
    () => (rowData ? txToArticulationInfo(transaction) : null),
    [rowData, transaction],
  );
  const gasInfo = useMemo(
    () =>
      rowData
        ? txToGasInfo(
            transaction,
            transaction.fromName,
            addressToHex(transaction.from),
          )
        : null,
    [rowData, transaction],
  );
  const statusInfo = useMemo(
    () => (rowData ? txToStatusInfo(transaction) : null),
    [rowData, transaction],
  );
  const detailsInfo = useMemo(
    () => (rowData ? txToDetailsInfo(transaction) : null),
    [rowData, transaction],
  );
  const addressInfo = useMemo(
    () =>
      rowData
        ? txToAddressInfo(
            transaction.from,
            transaction.fromName,
            transaction.to,
            transaction.toName,
          )
        : null,
    [rowData, transaction],
  );

  // Early return after all hooks - simplified like LogsPanel
  if (!rowData || !articulationInfo || !detailsInfo || !addressInfo) {
    return null;
  }

  // Title component with key identifying info
  const titleComponent = () => (
    <Group justify="space-between" align="flex-start">
      <Text variant="primary" size="md" fw={600}>
        Tx {displayHash(transaction.hash)}
      </Text>
      <Text
        variant={transaction.isError ? 'error' : 'success'}
        size="md"
        fw={600}
      >
        {transaction.isError ? '✗' : '✓'}
      </Text>
    </Group>
  );

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
        <DetailSection title="Address Information">
          <AddressInfoRenderer addressInfo={addressInfo} />
        </DetailSection>

        <DetailSection title="Decoded Function Call">
          <ArticulationRenderer articulationInfo={articulationInfo} />
        </DetailSection>

        {!!gasInfo && (
          <DetailSection title="Gas Information">
            <GasInfoRenderer gasInfo={gasInfo} />
          </DetailSection>
        )}

        {!!statusInfo && (
          <DetailSection title="Receipt & Status">
            <StatusRenderer statusInfo={statusInfo} />
          </DetailSection>
        )}

        <DetailSection title="Transaction & Block Details">
          <DetailsRenderer detailsInfo={detailsInfo} />
        </DetailSection>
      </DetailPanelContainer>
    </Stack>
  );
};
