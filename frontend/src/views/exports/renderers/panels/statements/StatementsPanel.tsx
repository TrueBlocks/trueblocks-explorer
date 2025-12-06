// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { useMemo } from 'react';

import {
  DetailContainer,
  DetailSection,
  PanelRow,
  PanelTable,
  StyledLabel,
  StyledValue,
} from '@components';
import { Group, Stack, Text } from '@mantine/core';
import { types } from '@models';
import { addressToHex } from '@utils';

// EXISTING_CODE

export const StatementsPanel = (
  rowData: Record<string, unknown>,
  _onFinal: (rowKey: string, newValue: string, txHash: string) => void,
) => {
  // EXISTING_CODE
  const facet = 'statements';

  const statement = useMemo(
    () =>
      (rowData as unknown as types.Statement) || types.Statement.createFrom({}),
    [rowData],
  );

  const decimals = useMemo(
    () => statement.decimals || 18,
    [statement.decimals],
  );
  const scale = useMemo(() => BigInt(10) ** BigInt(decimals), [decimals]);

  const toBig = useMemo(() => {
    return (v: unknown): bigint => {
      if (v === undefined || v === null) return 0n;
      const s = typeof v === 'string' ? v : String(v);
      if (s === '' || s === '0') return 0n;
      try {
        return BigInt(s);
      } catch {
        return 0n;
      }
    };
  }, []);

  const formatToken = useMemo(() => {
    return (v: unknown) => {
      const b = toBig(v);
      if (b === 0n) return '-';
      const neg = b < 0n;
      const abs = neg ? -b : b;
      const whole = abs / scale;
      const frac = abs % scale;
      let fracStr = frac.toString().padStart(decimals, '0');
      if (decimals >= 3) {
        fracStr = fracStr.slice(0, 3);
      } else {
        fracStr = fracStr.padEnd(3, '0');
      }
      return `${neg ? '-' : ''}${whole.toString()}.${fracStr}`;
    };
  }, [toBig, scale, decimals]);

  const formatRaw = useMemo(() => {
    return (b: bigint, nDecimals: number = 5) => {
      if (b === 0n) return '-';
      const neg = b < 0n;
      const abs = neg ? -b : b;
      const whole = abs / scale;
      const frac = abs % scale;
      let fracStr = frac.toString().padStart(decimals, '0');
      if (decimals >= nDecimals) {
        fracStr = fracStr.slice(0, nDecimals);
      } else {
        fracStr = fracStr.padEnd(nDecimals, '0');
      }
      return `${neg ? '-' : ''}${whole.toString()}.${fracStr}`;
    };
  }, [scale, decimals]);

  const totalInRaw = useMemo(
    () => toBig(statement.calcs?.totalIn || '0'),
    [toBig, statement.calcs?.totalIn],
  );
  const totalOutRaw = useMemo(
    () => toBig(statement.calcs?.totalOut || '0'),
    [toBig, statement.calcs?.totalOut],
  );
  const minerInRaw = useMemo(
    () =>
      toBig(statement.minerBaseRewardIn || '0') +
      toBig(statement.minerNephewRewardIn || '0') +
      toBig(statement.minerTxFeeIn || '0') +
      toBig(statement.minerUncleRewardIn || '0'),
    [
      toBig,
      statement.minerBaseRewardIn,
      statement.minerNephewRewardIn,
      statement.minerTxFeeIn,
      statement.minerUncleRewardIn,
    ],
  );
  const hasPrice = useMemo(
    () => toBig(statement.spotPrice) === 0n,
    [toBig, statement.spotPrice],
  );
  const beginBalRaw = useMemo(
    () => toBig(statement.begBal),
    [toBig, statement.begBal],
  );
  const endBalRaw = useMemo(
    () => toBig(statement.endBal),
    [toBig, statement.endBal],
  );
  const isReconciled = useMemo(
    () => statement.calcs?.reconciled ?? false,
    [statement.calcs?.reconciled],
  );

  type AddressLike = { address?: number[] } | string | null | undefined;
  const displayAddress8 = (addr: AddressLike): string => {
    if (!addr) return '-';
    try {
      const hex = addressToHex(addr);
      if (!hex || hex.length < 18) return hex || '-';
      return `0x${hex.slice(2, 10)}...${hex.slice(-8)}`;
    } catch {
      return '-';
    }
  };

  const titleComponent = useMemo(() => {
    type TxHashLike = { hash?: number[] };
    const hashToHex = (h: TxHashLike): string => {
      if (!h || !h.hash) return '';
      try {
        const bytes: number[] = h.hash;
        return (
          '0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
        );
      } catch {
        return '';
      }
    };

    const variant = isReconciled ? 'success' : 'error';
    return (
      <>
        <Group justify="space-between" align="flex-start">
          <Text variant="primary" size="md" fw={600}>
            Tx {hashToHex(statement.transactionHash)}
          </Text>
          <Text variant={variant} size="md" fw={600}>
            {isReconciled ? '✓' : '✗'}
          </Text>
        </Group>
        <Group justify="space-between" gap={4} wrap="nowrap">
          <Text variant="primary" size="md" fw={600}>
            {new Date(statement.timestamp * 1000).toLocaleString()}
          </Text>
          <Text variant="primary" size="md" fw={600}>
            {statement.blockNumber}.{statement.transactionIndex}
            {statement.logIndex !== undefined && statement.logIndex !== null
              ? `.${statement.logIndex}`
              : ''}
          </Text>
        </Group>
      </>
    );
  }, [
    isReconciled,
    statement.transactionHash,
    statement.timestamp,
    statement.blockNumber,
    statement.transactionIndex,
    statement.logIndex,
  ]);

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <DetailContainer title={titleComponent}>
        <DetailSection facet={facet} title="Participants">
          <PanelTable>
            <PanelRow
              label={
                <StyledLabel variant="blue" weight="strong">
                  Accounted For
                </StyledLabel>
              }
              value={
                <StyledValue variant="default">
                  {displayAddress8(statement.accountedFor || statement.holder)}
                </StyledValue>
              }
            />
            <PanelRow
              label={
                <StyledLabel variant="blue" weight="strong">
                  Asset
                </StyledLabel>
              }
              value={
                <StyledValue variant="default">{`${displayAddress8(statement.asset)}${statement.symbol ? ` (${statement.symbol})` : ''}`}</StyledValue>
              }
            />
            <PanelRow
              label={
                <StyledLabel variant="blue" weight="strong">
                  Sender
                </StyledLabel>
              }
              value={
                <StyledValue variant="default">
                  {displayAddress8(statement.sender)}
                </StyledValue>
              }
            />
            <PanelRow
              label={
                <StyledLabel variant="blue" weight="strong">
                  Recipient
                </StyledLabel>
              }
              value={
                <StyledValue variant="default">
                  {displayAddress8(statement.recipient)}
                </StyledValue>
              }
            />
          </PanelTable>
        </DetailSection>
        <DetailSection facet={facet} title="Balance Summary">
          <PanelTable>
            <PanelRow>
              <td
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: '16px',
                  padding: '6px 8px',
                }}
                colSpan={2}
              >
                <div style={{ textAlign: 'center' }}>
                  <div>
                    <StyledLabel variant="blue" weight="strong">
                      Beg Bal
                    </StyledLabel>
                  </div>
                  <div>
                    <StyledValue variant="default" size="sm">
                      {formatRaw(beginBalRaw)}
                    </StyledValue>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div>
                    <StyledLabel variant="blue" weight="strong">
                      Income
                    </StyledLabel>
                  </div>
                  <div>
                    <StyledValue
                      variant={totalInRaw === 0n ? 'dimmed' : 'default'}
                      size="sm"
                    >
                      {formatRaw(totalInRaw)}
                    </StyledValue>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div>
                    <StyledLabel variant="blue" weight="strong">
                      Outflow
                    </StyledLabel>
                  </div>
                  <div>
                    <StyledValue
                      variant={totalOutRaw === 0n ? 'dimmed' : 'default'}
                      size="sm"
                    >
                      {formatRaw(totalOutRaw)}
                    </StyledValue>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div>
                    <StyledLabel variant="blue" weight="strong">
                      End Bal
                    </StyledLabel>
                  </div>
                  <div>
                    <StyledValue variant="default" size="sm">
                      {formatRaw(endBalRaw)}
                    </StyledValue>
                  </div>
                </div>
              </td>
            </PanelRow>
          </PanelTable>
        </DetailSection>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <DetailSection facet={facet} title="Inflows">
            <PanelTable>
              {[
                ['Amount In', statement.amountIn],
                ['Internal In', statement.internalIn],
                ['Prefund In', statement.prefundIn],
                ['Self Destruct In', statement.selfDestructIn],
                ['Miner In', minerInRaw],
              ].map(([label, val]) => {
                const raw = toBig(val);
                return (
                  <PanelRow
                    key={`inflow-${label}`}
                    layout="wide"
                    label={<StyledLabel variant="dimmed">{label}</StyledLabel>}
                    value={
                      <StyledValue variant="default" size="sm" align="right">
                        {formatRaw(raw)}
                      </StyledValue>
                    }
                  />
                );
              })}
            </PanelTable>
          </DetailSection>

          <DetailSection facet={facet} title="Outflows">
            <PanelTable>
              {[
                ['Amount Out', statement.amountOut],
                ['Internal Out', statement.internalOut],
                ['Gas Out', statement.gasOut],
                ['Self Destruct Out', statement.selfDestructOut],
              ].map(([label, val]) => {
                const raw = toBig(val);
                return (
                  <PanelRow
                    key={`outflow-${label}`}
                    layout="wide"
                    label={<StyledLabel variant="dimmed">{label}</StyledLabel>}
                    value={
                      <StyledValue variant="default" size="sm" align="right">
                        {formatRaw(raw)}
                      </StyledValue>
                    }
                  />
                );
              })}
            </PanelTable>
          </DetailSection>

          <DetailSection facet={facet} title="Pricing">
            <PanelTable>
              <PanelRow
                label={
                  <StyledLabel variant="blue" weight="strong">
                    Spot Price
                  </StyledLabel>
                }
                value={
                  <StyledValue variant={hasPrice ? 'dimmed' : 'default'}>
                    {formatToken(statement.spotPrice)}
                  </StyledValue>
                }
              />
              <PanelRow
                label={
                  <StyledLabel variant="dimmed" weight="strong">
                    Price Source
                  </StyledLabel>
                }
                value={
                  <StyledValue variant="default">
                    {statement.priceSource || '-'}
                  </StyledValue>
                }
              />
            </PanelTable>
          </DetailSection>
        </div>
        {!isReconciled && statement.correctingReasons && (
          <StyledValue variant="error" size="sm">
            Error: {statement.correctingReasons}
          </StyledValue>
        )}
        {statement.correctionId ? (
          <StyledValue variant="dimmed">
            Correction Id: {statement.correctionId}
          </StyledValue>
        ) : null}
      </DetailContainer>
    </Stack>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
