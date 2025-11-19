// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
import React, { useMemo, useState } from 'react';

import {
  DetailPanelContainer,
  InfoAddressRenderer,
  InfoArticulationRenderer,
  InfoDetailsRenderer,
  logToAddressInfo,
} from '@components';
import { BorderedSection } from '@components';
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

  // Show loading state if no data is provided
  if (!rowData) {
    return <div className="no-selection">Loading...</div>;
  }

  // Early return after all hooks if computed data is invalid
  if (!articulationInfo || !detailsInfo || !addressInfo) {
    return null;
  }

  // Title component with key identifying info
  const titleComponent = () => (
    <Text variant="primary" size="md" fw={600}>
      Log {log.logIndex} in Tx {displayHash(log.transactionHash)}
    </Text>
  );

  return (
    <Stack gap={0} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
        <BorderedSection>
          <div
            onClick={() => handleToggle('Contract Information')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Contract Information') ? '▶ ' : '▼ '}Contract
                Information
              </div>
            </Text>
          </div>
          {!collapsed.has('Contract Information') && (
            <InfoAddressRenderer addressInfo={addressInfo} />
          )}
        </BorderedSection>

        <BorderedSection>
          <div
            onClick={() => handleToggle('Decoded Event')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Decoded Event') ? '▶ ' : '▼ '}Decoded Event
              </div>
            </Text>
          </div>
          {!collapsed.has('Decoded Event') && (
            <InfoArticulationRenderer articulationInfo={articulationInfo} />
          )}
        </BorderedSection>

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
