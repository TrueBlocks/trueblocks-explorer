// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
import React from 'react';

import { Group, Text } from '@mantine/core';
import { types } from '@models';
import { displayHash } from '@utils';

import { TransactionPanelBase } from '../shared/TransactionPanelBase';

// ApprovalTxs uses the same panel base as Transactions since the data structure is compatible
// The TransactionPanelBase will automatically hide sections for missing data (gas, receipt, traces)
export const ApprovalTxsPanel = (rowData: Record<string, unknown> | null) => {
  // Convert rowData to transaction for title display
  const transaction =
    (rowData as unknown as types.Transaction) || ({} as types.Transaction);

  // Custom title for approval transactions
  const titleComponent = () => (
    <Group justify="space-between" align="flex-start">
      <Text variant="primary" size="md" fw={600}>
        Approval Tx {displayHash(transaction.hash)}
      </Text>
      <Text variant="primary" size="md" fw={600}>
        Block {transaction.blockNumber}
      </Text>
    </Group>
  );

  return (
    <TransactionPanelBase
      rowData={rowData}
      title={titleComponent()}
      showGasSection={false}
      showStatusSection={false}
    />
  );
};
