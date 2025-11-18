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
  txToAddressInfo,
} from '@components';
import { Stack, Text } from '@mantine/core';
import { types } from '@models';
import { displayHash } from '@utils';

import '../../../../../components/detail/DetailTable.css';

// Converter functions for reusing existing thin interfaces
const traceToArticulationInfo = (trace: types.Trace) => {
  return {
    functionData: trace.articulatedTrace || ({} as types.Function),
    input: '', // Traces don't have raw input like transactions
    to: undefined, // Simplified - skip action details
    receipt: undefined,
  };
};

const traceToDetailsInfo = (trace: types.Trace) => {
  return {
    hash: trace.transactionHash,
    blockNumber: trace.blockNumber,
    blockHash: trace.blockHash,
    timestamp: trace.timestamp,
    value: undefined, // Simplified - skip action value
    from: undefined, // Simplified - skip action details
    to: undefined, // Simplified - skip action details
    toName: undefined,
    traceType: trace.type, // Trace-specific addition
    error: trace.error, // Trace-specific addition
    subtraces: trace.subtraces, // Trace-specific addition
  };
};

export const TracesPanel = (rowData: Record<string, unknown> | null) => {
  // Memoize trace conversion to avoid dependency warnings
  const trace = useMemo(
    () => (rowData as unknown as types.Trace) || ({} as types.Trace),
    [rowData],
  );

  // Memoized converter functions (called before early return to maintain hook order)
  const articulationInfo = useMemo(
    () => (rowData ? traceToArticulationInfo(trace) : null),
    [rowData, trace],
  );
  const addressInfo = useMemo(
    () =>
      rowData && trace.action
        ? txToAddressInfo(
            trace.action.from,
            trace.action.fromName,
            trace.action.to,
            trace.action.toName,
          )
        : null,
    [rowData, trace],
  );
  const _gasInfo = useMemo(
    () => null, // Traces don't have gas info - always null
    [],
  );
  const _statusInfo = useMemo(
    () => null, // Traces don't have status info - always null
    [],
  );
  const detailsInfo = useMemo(
    () => (rowData ? traceToDetailsInfo(trace) : null),
    [rowData, trace],
  );

  // Early return after all hooks
  if (!rowData || !articulationInfo || !detailsInfo) {
    return null;
  }

  // Title component with key identifying info
  const titleComponent = () => (
    <Text variant="primary" size="md" fw={600}>
      Trace {trace.type || 'Unknown'} in Tx {displayHash(trace.transactionHash)}
    </Text>
  );

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
        {!!addressInfo && (
          <DetailSection title="Address Information">
            <AddressInfoRenderer addressInfo={addressInfo} />
          </DetailSection>
        )}

        <DetailSection title="Decoded Trace Call">
          <ArticulationRenderer articulationInfo={articulationInfo} />
        </DetailSection>

        {!!trace.error && (
          <DetailSection title="Trace Error">
            <div
              style={{
                border: '1px solid var(--mantine-color-red-3)',
                borderRadius: '4px',
                marginTop: '8px',
                backgroundColor: 'var(--mantine-color-red-0)',
                padding: '8px',
                color: 'var(--mantine-color-red-8)',
                fontWeight: '500',
              }}
            >
              {trace.error}
            </div>
          </DetailSection>
        )}

        <DetailSection title="Transaction & Block Details">
          <DetailsRenderer detailsInfo={detailsInfo} />
        </DetailSection>
      </DetailPanelContainer>
    </Stack>
  );
};
