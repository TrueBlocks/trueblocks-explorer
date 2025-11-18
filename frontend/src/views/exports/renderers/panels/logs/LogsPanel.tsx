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
  logToAddressInfo,
} from '@components';
import { Stack, Text } from '@mantine/core';
import { types } from '@models';
import { displayHash } from '@utils';

import '../../../../../components/detail/DetailTable.css';

// Converter functions for reusing existing thin interfaces
const logToArticulationInfo = (log: types.Log) => {
  return {
    functionData: log.articulatedLog || ({} as types.Function),
    input: log.data || '',
    to: log.address,
    receipt: undefined,
  };
};

const logToDetailsInfo = (log: types.Log) => {
  return {
    hash: log.transactionHash,
    blockNumber: log.blockNumber,
    blockHash: log.blockHash,
    timestamp: log.timestamp,
    value: undefined, // Logs don't have value transfers
    from: undefined, // Logs don't have from address
    to: log.address, // Contract that emitted the log
    toName: log.addressName,
    logIndex: log.logIndex, // Additional log-specific data
  };
};

export const LogsPanel = (rowData: Record<string, unknown> | null) => {
  // Memoize log conversion to avoid dependency warnings
  const log = useMemo(
    () => (rowData as unknown as types.Log) || ({} as types.Log),
    [rowData],
  );

  // Memoized converter functions (called before early return to maintain hook order)
  const articulationInfo = useMemo(
    () => (rowData ? logToArticulationInfo(log) : null),
    [rowData, log],
  );

  const _gasInfo = useMemo(
    () => null, // Logs don't have gas info - always null
    [],
  );

  const _statusInfo = useMemo(
    () => null, // Logs don't have status info - always null
    [],
  );
  const detailsInfo = useMemo(
    () => (rowData ? logToDetailsInfo(log) : null),
    [rowData, log],
  );
  const addressInfo = useMemo(
    () => (rowData ? logToAddressInfo(log.address, log.addressName) : null),
    [rowData, log],
  );

  // Early return after all hooks
  if (!rowData || !articulationInfo || !detailsInfo || !addressInfo) {
    return null;
  }

  // Title component with key identifying info
  const titleComponent = () => (
    <Text variant="primary" size="md" fw={600}>
      Log {log.logIndex} in Tx {displayHash(log.transactionHash)}
    </Text>
  );

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
        <DetailSection title="Contract Information">
          <AddressInfoRenderer addressInfo={addressInfo} />
        </DetailSection>

        <DetailSection title="Decoded Event">
          <ArticulationRenderer articulationInfo={articulationInfo} />
        </DetailSection>

        <DetailSection title="Transaction & Block Details">
          <DetailsRenderer detailsInfo={detailsInfo} />
        </DetailSection>
      </DetailPanelContainer>
    </Stack>
  );
};
