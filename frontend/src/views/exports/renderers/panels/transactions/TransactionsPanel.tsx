// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
import React from 'react';

import { Group, Text } from '@mantine/core';
import { types } from '@models';
import { displayHash } from '@utils';

import { TransactionPanelBase } from '../shared/TransactionPanelBase';

export const TransactionsPanel = (rowData: Record<string, unknown> | null) => {
  // Convert rowData to transaction for title display
  const transaction =
    (rowData as unknown as types.Transaction) || ({} as types.Transaction);

  // Custom title for transactions
  const titleComponent = () => (
    <Group justify="space-between" align="flex-start">
      <Text variant="primary" size="md" fw={600}>
        Transaction {displayHash(transaction.hash)}
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
      showGasSection={true}
      showStatusSection={true}
    />
  );
};
