// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
import React, { useMemo, useState } from 'react';

import {
  DetailPanelContainer,
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
import { BorderedSection } from '@components';
import { Group, Stack, Text } from '@mantine/core';
import { types } from '@models';
import { addressToHex, displayHash } from '@utils';

import '../../../../../components/detail/DetailTable.css';

export const TransactionsPanel = (rowData: Record<string, unknown> | null) => {
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
    <Stack gap={0} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
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

        <BorderedSection>
          <div
            onClick={() => handleToggle('Decoded Function Call')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Decoded Function Call') ? '▶ ' : '▼ '}Decoded
                Function Call
              </div>
            </Text>
          </div>
          {!collapsed.has('Decoded Function Call') && (
            <InfoArticulationRenderer articulationInfo={articulationInfo} />
          )}
        </BorderedSection>

        {!!gasInfo && (
          <BorderedSection>
            <div
              onClick={() => handleToggle('Gas Information')}
              style={{ cursor: 'pointer' }}
            >
              <Text variant="primary" size="sm">
                <div className="detail-section-header">
                  {collapsed.has('Gas Information') ? '▶ ' : '▼ '}Gas
                  Information
                </div>
              </Text>
            </div>
            {!collapsed.has('Gas Information') && (
              <InfoGasRenderer gasInfo={gasInfo} />
            )}
          </BorderedSection>
        )}

        {!!statusInfo && (
          <BorderedSection>
            <div
              onClick={() => handleToggle('Receipt & Status')}
              style={{ cursor: 'pointer' }}
            >
              <Text variant="primary" size="sm">
                <div className="detail-section-header">
                  {collapsed.has('Receipt & Status') ? '▶ ' : '▼ '}Receipt &
                  Status
                </div>
              </Text>
            </div>
            {!collapsed.has('Receipt & Status') && (
              <InfoStatusRenderer statusInfo={statusInfo} />
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
