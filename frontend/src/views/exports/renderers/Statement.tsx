import { StyledText } from '@components';
import { DetailField, DetailPanelContainer, DetailSection } from '@components';
import { Grid, Group, Stack } from '@mantine/core';
import { types } from '@models';
import { addressToHex } from '@utils';

import '../../../components/detail/DetailTable.css';

export const renderStatementDetailPanel = (
  rowData: Record<string, unknown> | null,
) => {
  if (!rowData) return null;
  const statement = rowData as unknown as types.Statement;
  const decimals = statement.decimals || 18;
  const scale = BigInt(10) ** BigInt(decimals);
  const toBig = (v: unknown): bigint => {
    if (v === undefined || v === null) return 0n;
    const s = typeof v === 'string' ? v : String(v);
    if (s === '' || s === '0') return 0n;
    try {
      return BigInt(s);
    } catch {
      return 0n;
    }
  };
  const formatToken = (v: unknown) => {
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

  const totalInRaw = toBig(statement.calcs?.totalIn || '0');
  const totalOutRaw = toBig(statement.calcs?.totalOut || '0');
  const minerInRaw =
    toBig(statement.minerBaseRewardIn || '0') +
    toBig(statement.minerNephewRewardIn || '0') +
    toBig(statement.minerTxFeeIn || '0') +
    toBig(statement.minerUncleRewardIn || '0');
  const hasPrice = toBig(statement.spotPrice) === 0n;
  const formatRaw = (b: bigint) => {
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
  const beginBalRaw = toBig(statement.begBal);
  const endBalRaw = toBig(statement.endBal);
  const isReconciled = statement.calcs?.reconciled ?? false;

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

  type TxHashLike = { hash?: number[] };
  const hashToHex = (h: TxHashLike): string => {
    if (!h || !h.hash) return '';
    try {
      const bytes: number[] = h.hash;
      return '0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return '';
    }
  };

  // Create complex title component
  const titleComponent = (
    <>
      <Group justify="space-between" align="flex-start">
        <StyledText
          variant="primary"
          size="lg"
          fw={600}
          style={{ color: 'var(--mantine-color-text)' }}
        >
          Tx {hashToHex(statement.transactionHash)}
        </StyledText>
        <StyledText
          variant={isReconciled ? 'success' : 'error'}
          size="xl"
          fw={600}
        >
          {isReconciled ? '✓' : '✗'}
        </StyledText>
      </Group>
      <Group justify="space-between" gap={4} wrap="nowrap">
        <StyledText
          variant="primary"
          size="md"
          fw={600}
          style={{ color: 'var(--mantine-color-text)' }}
        >
          {new Date(statement.timestamp * 1000).toLocaleString()}
        </StyledText>
        <StyledText
          variant="primary"
          size="md"
          fw={600}
          style={{ color: 'var(--mantine-color-text)' }}
        >
          {statement.blockNumber}.{statement.transactionIndex}
          {statement.logIndex !== undefined && statement.logIndex !== null
            ? `.${statement.logIndex}`
            : ''}
        </StyledText>
      </Group>
    </>
  );

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <DetailPanelContainer title={titleComponent}>
        <DetailSection title="Participants">
          <Grid gutter={4}>
            <Grid.Col span={6}>
              <DetailField
                label="Accounted For"
                value={displayAddress8(
                  statement.accountedFor || statement.holder,
                )}
                labelSpan={12}
                valueSpan={12}
              />
              <DetailField
                label="Asset"
                value={`${displayAddress8(statement.asset)}${statement.symbol ? ` (${statement.symbol})` : ''}`}
                labelSpan={12}
                valueSpan={12}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DetailField
                label="Sender"
                value={displayAddress8(statement.sender)}
                labelSpan={12}
                valueSpan={12}
              />
              <DetailField
                label="Recipient"
                value={displayAddress8(statement.recipient)}
                labelSpan={12}
                valueSpan={12}
              />
            </Grid.Col>
          </Grid>
        </DetailSection>
        <DetailSection title="Balance Summary">
          <Grid gutter={4}>
            <Grid.Col span={3}>
              <DetailField
                label="Beg Bal"
                value={
                  <div
                    style={{
                      border: 'none',
                      padding: '0 8px 0 0',
                      fontFamily: 'monospace',
                      textAlign: 'right',
                      fontSize: '0.85em',
                    }}
                  >
                    {formatRaw(beginBalRaw)}
                  </div>
                }
                labelSpan={12}
                valueSpan={12}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <DetailField
                label="Income"
                value={
                  <div
                    style={{
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      paddingRight: 16,
                      color:
                        totalInRaw === 0n
                          ? 'var(--mantine-color-dimmed)'
                          : 'var(--mantine-color-text)',
                    }}
                  >
                    {formatRaw(totalInRaw)}
                  </div>
                }
                labelSpan={12}
                valueSpan={12}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <DetailField
                label="Outflow"
                value={
                  <div
                    style={{
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      paddingRight: 16,
                      color:
                        totalOutRaw === 0n
                          ? 'var(--mantine-color-dimmed)'
                          : 'var(--mantine-color-text)',
                    }}
                  >
                    {formatRaw(totalOutRaw)}
                  </div>
                }
                labelSpan={12}
                valueSpan={12}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <DetailField
                label="End Bal"
                value={
                  <div
                    style={{
                      border: 'none',
                      padding: '0 8px 0 0',
                      fontFamily: 'monospace',
                      textAlign: 'right',
                      fontSize: '0.85em',
                    }}
                  >
                    {formatRaw(endBalRaw)}
                  </div>
                }
                labelSpan={12}
                valueSpan={12}
              />
            </Grid.Col>
          </Grid>
        </DetailSection>
        <Grid gutter={1}>
          <Grid.Col span={6}>
            <DetailSection title="Inflows">
              <Grid gutter={1}>
                {[
                  ['Amount In', statement.amountIn],
                  ['Internal In', statement.internalIn],
                  ['Prefund In', statement.prefundIn],
                  ['Self Destruct In', statement.selfDestructIn],
                  ['Miner In', minerInRaw],
                ].map(([label, val]) => {
                  const raw = toBig(val);
                  return (
                    <DetailField
                      key={label}
                      label={label}
                      labelSpan={5}
                      valueSpan={7}
                      labelProps={{
                        style: {
                          padding: '1px 4px',
                          fontSize: '0.85em',
                          textOverflow: 'clip',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        },
                      }}
                      valueProps={{
                        style: {
                          padding: '1px 4px',
                        },
                      }}
                      value={
                        <div
                          style={{
                            border: 'none',
                            padding: '0 8px 0 0',
                            fontFamily: 'monospace',
                            textAlign: 'right',
                            fontSize: '0.85em',
                          }}
                        >
                          {formatRaw(raw)}
                        </div>
                      }
                    />
                  );
                })}
              </Grid>
            </DetailSection>
          </Grid.Col>
          <Grid.Col span={6}>
            <DetailSection title="Outflows">
              <Grid gutter={1}>
                {[
                  ['Amount Out', statement.amountOut],
                  ['Internal Out', statement.internalOut],
                  ['Gas Out', statement.gasOut],
                  ['Self Destruct Out', statement.selfDestructOut],
                ].map(([label, val]) => {
                  const raw = toBig(val);
                  return (
                    <DetailField
                      key={label}
                      label={label}
                      labelSpan={5}
                      valueSpan={7}
                      labelProps={{
                        style: {
                          padding: '1px 4px',
                          fontSize: '0.85em',
                          textOverflow: 'clip',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        },
                      }}
                      valueProps={{
                        style: {
                          padding: '1px 4px',
                        },
                      }}
                      value={
                        <div
                          style={{
                            border: 'none',
                            padding: '0 8px 0 0',
                            fontFamily: 'monospace',
                            textAlign: 'right',
                            fontSize: '0.85em',
                          }}
                        >
                          {formatRaw(raw)}
                        </div>
                      }
                    />
                  );
                })}
              </Grid>
            </DetailSection>
          </Grid.Col>
        </Grid>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '5fr 7fr 5fr 7fr',
            alignItems: 'center',
            gap: 0,
            fontSize: '0.85em',
          }}
        >
          <div
            style={{
              padding: '1px 4px',
              fontWeight: 500,
              textOverflow: 'clip',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              background: 'transparent',
              color: 'var(--mantine-color-dimmed)',
            }}
          >
            Spot Price
          </div>
          <div
            style={{
              border: 'none',
              padding: '0 8px 0 0',
              fontFamily: 'monospace',
              textAlign: 'right',
              fontSize: 'inherit',
              color: hasPrice
                ? 'var(--mantine-color-dimmed)'
                : 'var(--mantine-color-text)',
            }}
          >
            {formatToken(statement.spotPrice)}
          </div>
          <div
            style={{
              padding: '1px 4px',
              fontWeight: 500,
              textOverflow: 'clip',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              background: 'transparent',
              color: 'var(--mantine-color-dimmed)',
            }}
          >
            Price Source
          </div>
          <div
            style={{
              padding: '1px 4px',
              fontSize: 'inherit',
              textOverflow: 'clip',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              color: 'var(--mantine-color-text)',
            }}
          >
            {statement.priceSource || '-'}
          </div>
        </div>
        {!isReconciled && statement.correctingReasons && (
          <StyledText variant="error" size="md">
            {statement.correctingReasons}
          </StyledText>
        )}
        {statement.correctionId ? (
          <StyledText variant="dimmed" size="md">
            Correction Id: {statement.correctionId}
          </StyledText>
        ) : null}
      </DetailPanelContainer>
    </Stack>
  );
};
