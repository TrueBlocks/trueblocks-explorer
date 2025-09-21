import { StyledText } from '@components';
import { Grid, Group, Stack, Tooltip } from '@mantine/core';
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
  const sum = (arr: unknown[]): bigint =>
    arr.reduce<bigint>((acc, v) => acc + toBig(v), 0n);
  const minerInRaw = sum([
    statement.minerBaseRewardIn,
    statement.minerNephewRewardIn,
    statement.minerTxFeeIn,
    statement.minerUncleRewardIn,
  ]);
  const totalInRaw = sum([
    statement.amountIn,
    statement.internalIn,
    statement.prefundIn,
    statement.selfDestructIn,
    minerInRaw,
  ]);
  const totalOutRaw = sum([
    statement.amountOut,
    statement.internalOut,
    statement.gasOut,
    statement.selfDestructOut,
  ]);
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
  const isReconciled = !statement.correctingReasons;

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

  return (
    <Stack gap={8} className="fixed-prompt-width">
      <Group justify="space-between" align="flex-start">
        <StyledText variant="primary" size="lg" fw={600}>
          Tx {hashToHex(statement.transactionHash)}
        </StyledText>
        <Tooltip
          label={isReconciled ? 'Reconciled' : 'Not reconciled'}
          withArrow
          position="left"
        >
          <StyledText
            size="xl"
            fw={700}
            variant={isReconciled ? 'success' : 'error'}
            style={{ lineHeight: 1, paddingRight: 4 }}
          >
            {isReconciled ? '✓' : '✗'}
          </StyledText>
        </Tooltip>
      </Group>
      <Group justify="space-between" gap={4} wrap="nowrap">
        <StyledText variant="primary" size="md" fw={600}>
          {new Date(statement.timestamp * 1000).toLocaleString()}
        </StyledText>
        <StyledText variant="primary" size="md" fw={600}>
          {statement.blockNumber}.{statement.transactionIndex}
          {statement.logIndex !== undefined && statement.logIndex !== null
            ? `.${statement.logIndex}`
            : ''}
        </StyledText>
      </Group>
      <div className="detail-section-header">Participants</div>
      <Grid gutter={4}>
        <Grid.Col span={6}>
          <div className="detail-row-prompt">Accounted For</div>
          <div className="detail-row-value">
            {displayAddress8(statement.accountedFor || statement.holder)}
          </div>
          <div className="detail-row-prompt">Asset</div>
          <div className="detail-row-value">
            {displayAddress8(statement.asset)}
            {statement.symbol ? ` (${statement.symbol})` : ''}
          </div>
        </Grid.Col>
        <Grid.Col span={6}>
          <div className="detail-row-prompt">Sender</div>
          <div className="detail-row-value">
            {displayAddress8(statement.sender)}
          </div>
          <div className="detail-row-prompt">Recipient</div>
          <div className="detail-row-value">
            {displayAddress8(statement.recipient)}
          </div>
        </Grid.Col>
      </Grid>
      <div className="detail-section-header">Balance Summary</div>
      <Grid gutter={4} columns={100}>
        <Grid.Col span={24}>
          <div className="detail-row-prompt">Beg Bal</div>
          <div className="detail-row-value">
            <Tooltip label={beginBalRaw.toString()} withArrow>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  paddingRight: 16,
                  color:
                    beginBalRaw === 0n
                      ? 'var(--skin-text-dimmed)'
                      : 'var(--skin-text-primary)',
                }}
              >
                {formatRaw(beginBalRaw)}
              </div>
            </Tooltip>
          </div>
        </Grid.Col>
        <Grid.Col span={24}>
          <div className="detail-row-prompt">Income</div>
          <div className="detail-row-value">
            <Tooltip label={totalInRaw.toString()} withArrow>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  paddingRight: 16,
                  color:
                    totalInRaw === 0n
                      ? 'var(--skin-text-dimmed)'
                      : 'var(--skin-text-primary)',
                }}
              >
                {formatRaw(totalInRaw)}
              </div>
            </Tooltip>
          </div>
        </Grid.Col>
        <Grid.Col span={4}></Grid.Col>
        <Grid.Col span={24}>
          <div className="detail-row-prompt">Outflow</div>
          <div className="detail-row-value">
            <Tooltip label={totalOutRaw.toString()} withArrow>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  paddingRight: 16,
                  color:
                    totalOutRaw === 0n
                      ? 'var(--skin-text-dimmed)'
                      : 'var(--skin-text-primary)',
                }}
              >
                {formatRaw(totalOutRaw)}
              </div>
            </Tooltip>
          </div>
        </Grid.Col>
        <Grid.Col span={24}>
          <div className="detail-row-prompt">End Bal</div>
          <div className="detail-row-value">
            <Tooltip label={endBalRaw.toString()} withArrow>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  paddingRight: 16,
                  color:
                    endBalRaw === 0n
                      ? 'var(--skin-text-dimmed)'
                      : 'var(--skin-text-primary)',
                }}
              >
                {formatRaw(endBalRaw)}
              </div>
            </Tooltip>
          </div>
        </Grid.Col>
      </Grid>
      <div className="detail-section-header">Breakdown</div>
      <Grid gutter={4}>
        <Grid.Col span={6}>
          <div className="detail-section-header">Inflows</div>
          {[
            ['Amount In', statement.amountIn],
            ['Internal In', statement.internalIn],
            ['Prefund In', statement.prefundIn],
            ['Self Destruct In', statement.selfDestructIn],
            ['Miner In', minerInRaw],
          ].map(([label, val]) => {
            const raw = toBig(val);
            return (
              <Group key={label} justify="space-between" gap={4} wrap="nowrap">
                <div
                  className="detail-row-prompt"
                  style={{
                    border: 'none',
                    padding: 0,
                    background: 'transparent',
                  }}
                >
                  {label}
                </div>
                <Tooltip label={raw.toString()} withArrow>
                  <div
                    className="detail-row-value"
                    style={{
                      border: 'none',
                      padding: '0 16px 0 0',
                      fontFamily: 'monospace',
                      textAlign: 'right',
                    }}
                  >
                    {formatRaw(raw)}
                  </div>
                </Tooltip>
              </Group>
            );
          })}
        </Grid.Col>
        <Grid.Col span={6}>
          <div className="detail-section-header">Outflows</div>
          {[
            ['Amount Out', statement.amountOut],
            ['Internal Out', statement.internalOut],
            ['Gas Out', statement.gasOut],
            ['Self Destruct Out', statement.selfDestructOut],
          ].map(([label, val]) => {
            const raw = toBig(val);
            return (
              <Group key={label} justify="space-between" gap={4} wrap="nowrap">
                <div
                  className="detail-row-prompt"
                  style={{
                    border: 'none',
                    padding: 0,
                    background: 'transparent',
                  }}
                >
                  {label}
                </div>
                <Tooltip label={raw.toString()} withArrow>
                  <div
                    className="detail-row-value"
                    style={{
                      border: 'none',
                      padding: '0 16px 0 0',
                      fontFamily: 'monospace',
                      textAlign: 'right',
                    }}
                  >
                    {formatRaw(raw)}
                  </div>
                </Tooltip>
              </Group>
            );
          })}
        </Grid.Col>
      </Grid>
      <Grid gutter={4}>
        <Grid.Col span={6}>
          <Group justify="space-between" gap={4} wrap="nowrap">
            <div
              className="detail-row-prompt"
              style={{
                border: 'none',
                padding: 0,
                background: 'transparent',
              }}
            >
              Spot Price
            </div>
            <Tooltip label={toBig(statement.spotPrice).toString()} withArrow>
              <div
                className="detail-row-value"
                style={{
                  border: 'none',
                  padding: '0 16px 0 0',
                  background: 'transparent',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  color: hasPrice
                    ? 'var(--skin-text-dimmed)'
                    : 'var(--skin-text-primary)',
                }}
              >
                {formatToken(statement.spotPrice)}
              </div>
            </Tooltip>
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group justify="space-between" gap={4} wrap="nowrap">
            <div
              className="detail-row-prompt"
              style={{
                border: 'none',
                padding: 0,
                background: 'transparent',
              }}
            >
              Price Source
            </div>
            <div
              className="detail-row-value"
              style={{
                border: 'none',
                padding: 0,
                background: 'transparent',
              }}
            >
              {statement.priceSource || '-'}
            </div>
          </Group>
        </Grid.Col>
      </Grid>
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
    </Stack>
  );
};

export const renderers = {
  'exports.statements': renderStatementDetailPanel,
};
