// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
// EXISTING_CODE
import React from 'react';

import { OpenLink } from '@app';
import {
  DetailPanelContainer,
  DetailSection,
  FunctionRenderer,
} from '@components';
import { Anchor, Grid, Group, Stack, Text } from '@mantine/core';
import { types } from '@models';
import { formatNumericValue } from '@utils';

import '../../../../../components/detail/DetailTable.css';
import { EtherRenderer } from '../../../../../components/renderers/EtherRenderer';

// EXISTING_CODE

export const TransactionsPanel = (rowData: Record<string, unknown> | null) => {
  if (!rowData) return null;

  // EXISTING_CODE
  const transaction = rowData as unknown as types.Transaction;

  // Helper functions for formatting
  const formatHash = (hash: { hash?: number[] }): string => {
    if (!hash || !hash.hash) return '';
    try {
      const bytes: number[] = hash.hash;
      const hex =
        '0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
      if (hex.length > 18) {
        return `${hex.slice(0, 10)}...${hex.slice(-8)}`;
      }
      return hex;
    } catch {
      return '';
    }
  };

  // Helper to format shortened hash as clickable link
  const formatHashLink = (
    hash: { hash?: number[] } | { address?: number[] } | null | undefined,
    type: string = 'hash',
  ): React.JSX.Element => {
    // Early return if hash is null, undefined, or not an object
    if (!hash || typeof hash !== 'object') {
      return <span>-</span>;
    }

    // Handle both hash and address types
    const bytes =
      'hash' in hash ? hash.hash : 'address' in hash ? hash.address : undefined;
    const hashString = bytes ? formatHashFromBytes(bytes) : '';

    if (!hashString) return <span>-</span>;

    return (
      <Anchor
        component="button"
        size="sm"
        onClick={() => {
          try {
            const fullHex =
              '0x' +
              bytes!.map((b) => b.toString(16).padStart(2, '0')).join('');
            OpenLink(type, fullHex);
          } catch (error) {
            console.error('Error opening link:', error);
          }
        }}
      >
        {hashString}
      </Anchor>
    );
  };

  // Helper to format hash from bytes array
  const formatHashFromBytes = (bytes: number[]): string => {
    try {
      const hex =
        '0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
      if (hex.length > 18) {
        return `${hex.slice(0, 10)}...${hex.slice(-8)}`;
      }
      return hex;
    } catch {
      return '';
    }
  };

  // Title component with key identifying info
  const titleComponent = () => (
    <Group justify="space-between" align="flex-start">
      <Text variant="primary" size="md" fw={600}>
        Tx {formatHash(transaction.hash)}
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

  // Create synthetic articulatedTx if none exists
  const getDisplayTx = () => {
    if (transaction.articulatedTx) {
      return transaction.articulatedTx;
    }

    // Create synthetic function from input data
    const input = transaction.input || '';
    if (input.length < 10) {
      // Not enough data for function selector
      return {
        name: 'Unknown',
        encoding: input || '0x',
        inputs: [],
        outputs: [],
      } as unknown as types.Function;
    }

    // Extract first 8 bytes (10 chars with 0x) as encoding
    const encoding = input.slice(0, 10);

    // Remaining data chopped into 32-byte (64 char) chunks
    const remainingData = input.slice(10);
    const inputs: types.Parameter[] = [];

    for (let i = 0; i < remainingData.length; i += 64) {
      const chunk = remainingData.slice(i, i + 64);
      if (chunk.length > 0) {
        inputs.push({
          name: `param_${Math.floor(i / 64)}`,
          value: '0x' + chunk,
          type: 'bytes32',
        } as types.Parameter);
      }
    }

    return {
      name: 'Unknown',
      encoding,
      inputs,
      outputs: [],
    } as unknown as types.Function;
  };

  // Get receipt status display
  const getReceiptStatus = () => {
    if (!transaction.receipt) return 'No receipt';

    const status = transaction.receipt.status;
    const isError = transaction.receipt.isError || transaction.isError;

    if (isError) return 'Failed';
    if (status === 1) return 'Success';
    if (status === 0) return 'Failed';
    return 'Unknown';
  };

  // Get receipt status color
  const getReceiptStatusColor = () => {
    if (!transaction.receipt) return 'dimmed';

    const isError = transaction.receipt.isError || transaction.isError;
    const status = transaction.receipt.status;

    if (isError || status === 0) return 'red';
    if (status === 1) return 'green';
    return 'dimmed';
  };

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
        <DetailSection title="Decoded Function Call">
          <FunctionRenderer functionData={getDisplayTx()} />
        </DetailSection>

        <DetailSection title="Transaction Details">
          <Grid gutter={4}>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Hash</div>
              <div className="detail-row-value">
                {formatHashLink(transaction.hash, 'hash')}
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Value</div>
              <div className="detail-row-value">
                <EtherRenderer value={transaction.value} />
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Date</div>
              <div className="detail-row-value">
                {new Date(transaction.timestamp * 1000).toLocaleDateString()}
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Time</div>
              <div className="detail-row-value">
                {new Date(transaction.timestamp * 1000).toLocaleTimeString()}
              </div>
            </Grid.Col>
          </Grid>
        </DetailSection>

        <DetailSection title="Gas Information">
          <Grid gutter={4}>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Gas Used</div>
              <div className="detail-row-value">
                {formatNumericValue(transaction.gasUsed)}
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Gas Limit</div>
              <div className="detail-row-value">
                {formatNumericValue(transaction.gas)}
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Gas Price</div>
              <div className="detail-row-value">
                {formatNumericValue(transaction.gasPrice)} gwei
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Max Fee Per Gas</div>
              <div className="detail-row-value">
                {transaction.maxFeePerGas
                  ? formatNumericValue(transaction.maxFeePerGas) + ' gwei'
                  : '-'}
              </div>
            </Grid.Col>
          </Grid>
        </DetailSection>

        <DetailSection title="Block Information">
          <Grid gutter={4}>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Block Number</div>
              <div className="detail-row-value">{transaction.blockNumber}</div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Transaction Index</div>
              <div className="detail-row-value">
                {transaction.transactionIndex}
              </div>
            </Grid.Col>
            <Grid.Col span={12}>
              <div className="detail-row-prompt">Block Hash</div>
              <div className="detail-row-value">
                {formatHashLink(transaction.blockHash, 'block')}
              </div>
            </Grid.Col>
          </Grid>
        </DetailSection>

        <DetailSection title="Receipt & Status">
          <Grid gutter={4}>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Status</div>
              <div className="detail-row-value">
                <Text c={getReceiptStatusColor()} fw={500}>
                  {getReceiptStatus()}
                </Text>
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Log Count</div>
              <div className="detail-row-value">
                {transaction.receipt?.logs?.length || 0}
              </div>
            </Grid.Col>
            {transaction.receipt?.contractAddress && (
              <>
                <Grid.Col span={12}>
                  <div className="detail-row-prompt">Contract Address</div>
                  <div className="detail-row-value">
                    {formatHashLink(
                      { address: transaction.receipt.contractAddress.address },
                      'address',
                    )}
                  </div>
                </Grid.Col>
              </>
            )}
            <Grid.Col span={12}>
              <div className="detail-row-prompt">Trace Count</div>
              <div className="detail-row-value">
                {transaction.traces?.length || 0}
              </div>
            </Grid.Col>
          </Grid>
        </DetailSection>
      </DetailPanelContainer>
    </Stack>
  );
};
