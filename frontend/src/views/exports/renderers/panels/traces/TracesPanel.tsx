// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
import React, { useMemo, useState } from 'react';

import {
  DetailPanelContainer,
  InfoAddressRenderer,
  InfoArticulationRenderer,
  InfoDetailsRenderer,
  txToAddressInfo,
} from '@components';
import { BorderedSection } from '@components';
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
  // Collapse state management
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Handle section toggle
  const handleToggle = (sectionName: string) => {
    const isCollapsed = collapsed.has(sectionName);
    if (isCollapsed) {
      setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(sectionName);
        return next;
      });
    } else {
      setCollapsed((prev) => new Set([...prev, sectionName]));
    }
  };

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

  // Show loading state if no data is provided
  if (!rowData) {
    return <div className="no-selection">Loading...</div>;
  }

  // Early return after all hooks if computed data is invalid
  if (!articulationInfo || !detailsInfo) {
    return null;
  }

  // Title component with key identifying info
  const titleComponent = () => (
    <Text variant="primary" size="md" fw={600}>
      Trace {trace.type || 'Unknown'} in Tx {displayHash(trace.transactionHash)}
    </Text>
  );

  return (
    <Stack gap={0} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
        {!!addressInfo && (
          <BorderedSection>
            <div
              onClick={() => handleToggle('Address Information')}
              style={{ cursor: 'pointer' }}
            >
              <Text variant="primary" size="sm">
                <div className="detail-section-header">
                  {collapsed.has('Address Information') ? '▶ ' : '▼ '}Address
                  Information
                </div>
              </Text>
            </div>
            {!collapsed.has('Address Information') && (
              <InfoAddressRenderer addressInfo={addressInfo} />
            )}
          </BorderedSection>
        )}

        <BorderedSection>
          <div
            onClick={() => handleToggle('Decoded Trace Call')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Decoded Trace Call') ? '▶ ' : '▼ '}Decoded
                Trace Call
              </div>
            </Text>
          </div>
          {!collapsed.has('Decoded Trace Call') && (
            <InfoArticulationRenderer articulationInfo={articulationInfo} />
          )}
        </BorderedSection>

        {!!trace.error && (
          <BorderedSection>
            <div
              onClick={() => handleToggle('Trace Error')}
              style={{ cursor: 'pointer' }}
            >
              <Text variant="primary" size="sm">
                <div className="detail-section-header">
                  {collapsed.has('Trace Error') ? '▶ ' : '▼ '}Trace Error
                </div>
              </Text>
            </div>
            {!collapsed.has('Trace Error') && (
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
            )}
          </BorderedSection>
        )}

        <BorderedSection>
          <div
            onClick={() => handleToggle('Transaction & Block Details')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Transaction & Block Details') ? '▶ ' : '▼ '}
                Transaction & Block Details
              </div>
            </Text>
          </div>
          {!collapsed.has('Transaction & Block Details') && (
            <InfoDetailsRenderer detailsInfo={detailsInfo} />
          )}
        </BorderedSection>
      </DetailPanelContainer>
    </Stack>
  );
};
