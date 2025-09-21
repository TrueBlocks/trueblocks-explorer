import { StyledText } from '@components';
import { Grid, Group, Stack, Text, Tooltip } from '@mantine/core';
import { types } from '@models';
import { addressToHex } from '@utils';

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
    <div
      className="statement-detail-panel"
      style={{
        background: 'var(--skin-surface-base)',
        color: 'var(--skin-text-primary)',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid var(--skin-border-subtle)',
      }}
    >
      <Stack gap={8} className="fixed-prompt-width">
        <Group justify="space-between" align="flex-start">
          <StyledText fw={600} size="lg">
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
          <StyledText size="md" fw={600}>
            {new Date(statement.timestamp * 1000).toLocaleString()}
          </StyledText>
          <StyledText size="md" fw={600}>
            {statement.blockNumber}.{statement.transactionIndex}
            {statement.logIndex !== undefined && statement.logIndex !== null
              ? `.${statement.logIndex}`
              : ''}
          </StyledText>
        </Group>
        <div
          style={{
            borderBottom: '1px dashed var(--skin-border-default)',
            margin: '8px 0',
          }}
        />
        <StyledText size="md" fw={600}>
          Participants
        </StyledText>
        <Grid gutter={4}>
          <Grid.Col span={6}>
            <StyledText variant="dimmed" size="md">
              Accounted For
            </StyledText>
            <StyledText size="md">
              {displayAddress8(statement.accountedFor || statement.holder)}
            </StyledText>
            <StyledText variant="dimmed" size="md" mt={8}>
              Asset
            </StyledText>
            <StyledText size="md">
              {displayAddress8(statement.asset)}
              {statement.symbol ? ` (${statement.symbol})` : ''}
            </StyledText>
          </Grid.Col>
          <Grid.Col span={6}>
            <StyledText variant="dimmed" size="md">
              Sender
            </StyledText>
            <StyledText size="md">
              {displayAddress8(statement.sender)}
            </StyledText>
            <StyledText variant="dimmed" size="md" mt={8}>
              Recipient
            </StyledText>
            <StyledText size="md">
              {displayAddress8(statement.recipient)}
            </StyledText>
          </Grid.Col>
        </Grid>
        <div
          style={{
            borderBottom: '1px dashed var(--skin-border-default)',
            margin: '8px 0',
          }}
        />
        <StyledText size="md" fw={600}>
          Balance Summary
        </StyledText>
        <Grid gutter={4} columns={100}>
          <Grid.Col span={24}>
            <StyledText variant="dimmed" size="md">
              Beg Bal
            </StyledText>
            <Tooltip label={beginBalRaw.toString()} withArrow>
              <StyledText
                size="md"
                ta="right"
                variant={beginBalRaw === 0n ? 'dimmed' : undefined}
                style={{ fontFamily: 'monospace', paddingRight: 16 }}
              >
                {formatRaw(beginBalRaw)}
              </StyledText>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={24}>
            <StyledText variant="dimmed" size="md">
              Income
            </StyledText>
            <Tooltip label={totalInRaw.toString()} withArrow>
              <StyledText
                size="md"
                ta="right"
                variant={totalInRaw === 0n ? 'dimmed' : undefined}
                style={{ fontFamily: 'monospace', paddingRight: 16 }}
              >
                {formatRaw(totalInRaw)}
              </StyledText>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={4}></Grid.Col>
          <Grid.Col span={24}>
            <StyledText variant="dimmed" size="md">
              Outflow
            </StyledText>
            <Tooltip label={totalOutRaw.toString()} withArrow>
              <StyledText
                size="md"
                ta="right"
                variant={totalOutRaw === 0n ? 'dimmed' : undefined}
                style={{ fontFamily: 'monospace', paddingRight: 16 }}
              >
                {formatRaw(totalOutRaw)}
              </StyledText>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={24}>
            <StyledText variant="dimmed" size="md">
              End Bal
            </StyledText>
            <Tooltip label={endBalRaw.toString()} withArrow>
              <StyledText
                size="md"
                ta="right"
                variant={endBalRaw === 0n ? 'dimmed' : undefined}
                style={{ fontFamily: 'monospace', paddingRight: 16 }}
              >
                {formatRaw(endBalRaw)}
              </StyledText>
            </Tooltip>
          </Grid.Col>
        </Grid>
        <div
          style={{
            borderBottom: '1px dashed var(--skin-border-default)',
            margin: '8px 0',
          }}
        />
        <StyledText size="md" fw={600}>
          Breakdown
        </StyledText>
        <Grid gutter={4}>
          <Grid.Col span={6}>
            <StyledText size="md" fw={600}>
              Inflows
            </StyledText>
            {[
              ['Amount In', statement.amountIn],
              ['Internal In', statement.internalIn],
              ['Prefund In', statement.prefundIn],
              ['Self Destruct In', statement.selfDestructIn],
              ['Miner In', minerInRaw],
            ].map(([label, val]) => {
              const raw = toBig(val);
              return (
                <Group
                  key={label}
                  justify="space-between"
                  gap={4}
                  wrap="nowrap"
                >
                  <StyledText variant="dimmed" size="md">
                    {label}
                  </StyledText>
                  <Tooltip label={raw.toString()} withArrow>
                    <Text
                      size="md"
                      style={{ fontFamily: 'monospace', paddingRight: 16 }}
                      c={raw === 0n ? 'dimmed' : undefined}
                      ta="right"
                    >
                      {formatRaw(raw)}
                    </Text>
                  </Tooltip>
                </Group>
              );
            })}
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="md" fw={600}>
              Outflows
            </Text>
            {[
              ['Amount Out', statement.amountOut],
              ['Internal Out', statement.internalOut],
              ['Gas Out', statement.gasOut],
              ['Self Destruct Out', statement.selfDestructOut],
            ].map(([label, val]) => {
              const raw = toBig(val);
              return (
                <Group
                  key={label}
                  justify="space-between"
                  gap={4}
                  wrap="nowrap"
                >
                  <StyledText variant="dimmed" size="md">
                    {label}
                  </StyledText>
                  <Tooltip label={raw.toString()} withArrow>
                    <Text
                      size="md"
                      style={{ fontFamily: 'monospace', paddingRight: 16 }}
                      c={raw === 0n ? 'dimmed' : undefined}
                      ta="right"
                    >
                      {formatRaw(raw)}
                    </Text>
                  </Tooltip>
                </Group>
              );
            })}
          </Grid.Col>
        </Grid>
        <div
          style={{
            borderBottom: '1px dashed var(--skin-border-default)',
            margin: '8px 0',
          }}
        />
        <Grid gutter={4}>
          <Grid.Col span={4}>
            <StyledText variant="dimmed" size="md">
              Spot Price
            </StyledText>
            <Tooltip label={toBig(statement.spotPrice).toString()} withArrow>
              <StyledText
                size="md"
                ta="right"
                variant={hasPrice ? 'dimmed' : undefined}
                style={{ fontFamily: 'monospace', paddingRight: 16 }}
              >
                {formatToken(statement.spotPrice)}
              </StyledText>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={5}>
            <StyledText variant="dimmed" size="md">
              Price Source
            </StyledText>
            <StyledText size="md">{statement.priceSource || '-'}</StyledText>
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
    </div>
  );
};

export const renderers = {
  'exports.statements': renderStatementDetailPanel,
};
