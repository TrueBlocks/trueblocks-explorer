// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
// EXISTING_CODE
import { useEffect, useState } from 'react';

import { NameFromAddress } from '@app';
import { DetailPanelContainer, DetailSection } from '@components';
import { Grid, Group, Stack, Text } from '@mantine/core';
import { types } from '@models';

import '../../../../../components/detail/DetailTable.css';

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

  // Component to display parameter value with address name resolution
  const ParameterValue = ({ param }: { param: types.Parameter }) => {
    const [addressName, setAddressName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const isAddress =
        param.type === 'address' &&
        param.value &&
        typeof param.value === 'string' &&
        param.value.startsWith('0x') &&
        param.value.length === 42;

      if (isAddress) {
        setIsLoading(true);
        NameFromAddress(param.value as string)
          .then((result) => {
            if (result && typeof result === 'object' && 'name' in result) {
              setAddressName(result.name);
            }
          })
          .catch(() => {
            // Silently fail, just show the address
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [param.type, param.value]);

    const displayValue = param.value ? String(param.value) : '-';

    if (param.type === 'address' && addressName) {
      return (
        <div>
          <div style={{ fontWeight: 500 }}>{addressName}</div>
          <div
            style={{ fontSize: '10px', color: 'var(--mantine-color-dimmed)' }}
          >
            {displayValue}
          </div>
        </div>
      );
    }

    return <span>{isLoading ? `${displayValue}...` : displayValue}</span>;
  };

  // ArticulatedTx Display Component
  const ArticulatedTxDisplay = ({
    articulatedTx,
  }: {
    articulatedTx: types.Function;
  }) => {
    const renderParameterTable = (
      parameters: types.Parameter[],
      title: string,
    ) => {
      return (
        <div style={{ marginTop: '12px' }}>
          <div
            style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}
          >
            {title}
          </div>
          <div
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: '4px',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                  <th
                    style={{
                      padding: '6px 0px 6px 0px',
                      textAlign: 'left',
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                      fontWeight: 500,
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: '6px 8px',
                      textAlign: 'left',
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                      fontWeight: 500,
                    }}
                  >
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {parameters && parameters.length > 0 ? (
                  parameters.slice(0, 12).map((param, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: '4px 0px 4px 0px',
                          borderBottom: '1px solid var(--mantine-color-gray-2)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          verticalAlign: 'top',
                        }}
                      >
                        {param.name || '-'}
                      </td>
                      <td
                        style={{
                          padding: '4px 8px',
                          borderBottom: '1px solid var(--mantine-color-gray-2)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          verticalAlign: 'top',
                        }}
                      >
                        <ParameterValue param={param} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      style={{
                        padding: '8px',
                        textAlign: 'left',
                        color: 'var(--mantine-color-dimmed)',
                        fontStyle: 'italic',
                      }}
                    >
                      No parameters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    return (
      <div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          {articulatedTx.name} ({articulatedTx.encoding})
        </div>
        {renderParameterTable(articulatedTx.inputs || [], 'Inputs')}
        {articulatedTx.outputs &&
          articulatedTx.outputs.length > 0 &&
          renderParameterTable(articulatedTx.outputs, 'Outputs')}
      </div>
    );
  };
  // EXISTING_CODE

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

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent()}>
        <DetailSection title="Decoded Function Call">
          <ArticulatedTxDisplay articulatedTx={getDisplayTx()} />
        </DetailSection>
        <DetailSection title="Block Information">
          <Grid gutter={4}>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Block</div>
              <div className="detail-row-value">{transaction.blockNumber}</div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div className="detail-row-prompt">Index</div>
              <div className="detail-row-value">
                {transaction.transactionIndex}
              </div>
            </Grid.Col>
            <Grid.Col span={12}>
              <div className="detail-row-prompt">Timestamp</div>
              <div className="detail-row-value">
                {new Date(transaction.timestamp * 1000).toLocaleString()}
              </div>
            </Grid.Col>
          </Grid>
        </DetailSection>
      </DetailPanelContainer>
    </Stack>
  );
};
