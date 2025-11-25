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
  txToAddressInfo,
} from '@components';
import { types } from '@models';
import { displayHash } from '@utils';

import '../../../../../components/detail/DetailTable.css';

// EXISTING_CODE

export const TracesPanel = (rowData: Record<string, unknown> | null) => {
  // EXISTING_CODE
  const trace = useMemo(
    () =>
      (rowData as unknown as types.Trace) ||
      types.Trace.createFrom({ TraceAction: {} }),
    [rowData],
  );

  const articulationInfo = useMemo(
    () => traceToArticulationInfo(trace),
    [trace],
  );

  const addressInfo = useMemo(
    () =>
      txToAddressInfo(
        trace.action?.from,
        trace.action?.fromName,
        trace.action?.to,
        trace.action?.toName,
      ),
    [trace],
  );

  const detailsInfo = useMemo(() => traceToDetailsInfo(trace), [trace]);

  if (!rowData) {
    return <div className="no-selection">Loading...</div>;
  }

  return (
    <DetailContainer>
      <DetailHeader>
        Trace {trace.type || 'Unknown'} in Tx{' '}
        {displayHash(trace.transactionHash)}
      </DetailHeader>

      <DetailSection title={'Address Information'}>
        <InfoAddressRenderer addressInfo={addressInfo} />
      </DetailSection>

      <DetailSection title={'Decoded Trace Call'}>
        <InfoArticulationRenderer articulationInfo={articulationInfo} />
      </DetailSection>

      <DetailSection title={'Trace Error'} cond={!!trace.error}>
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

      <DetailSection title={'Transaction & Block Details'}>
        <InfoDetailsRenderer detailsInfo={detailsInfo} />
      </DetailSection>
    </DetailContainer>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
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

// EXISTING_CODE
