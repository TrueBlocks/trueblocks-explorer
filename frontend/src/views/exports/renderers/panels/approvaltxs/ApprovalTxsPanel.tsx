// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import React from 'react';

import { Group, Text } from '@mantine/core';
import { types } from '@models';
import { displayHash } from '@utils';

import { TransactionPanelBase } from '../shared/TransactionPanelBase';

// EXISTING_CODE

export const ApprovalTxsPanel = (rowData: Record<string, unknown> | null) => {
  // EXISTING_CODE
  const transaction =
    (rowData as unknown as types.Transaction) || ({} as types.Transaction);

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
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
