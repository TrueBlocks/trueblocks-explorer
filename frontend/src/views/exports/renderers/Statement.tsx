import { Divider, Grid, Group, Stack, Text, Tooltip } from '@mantine/core';
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
        <Text fw={600} size="lg">
          Tx {hashToHex(statement.transactionHash)}
        </Text>
        <Tooltip
          label={isReconciled ? 'Reconciled' : 'Not reconciled'}
          withArrow
          position="left"
        >
          <Text
            size="xl"
            fw={700}
            c={isReconciled ? 'green' : 'red'}
            style={{ lineHeight: 1, paddingRight: 4 }}
          >
            {isReconciled ? '✓' : '✗'}
          </Text>
        </Tooltip>
      </Group>
      <Group justify="space-between" gap={4} wrap="nowrap">
        <Text size="md" fw={600}>
          {new Date(statement.timestamp * 1000).toLocaleString()}
        </Text>
        <Text size="md" fw={600}>
          {statement.blockNumber}.{statement.transactionIndex}
          {statement.logIndex !== undefined && statement.logIndex !== null
            ? `.${statement.logIndex}`
            : ''}
        </Text>
      </Group>
      <Divider variant="dashed" />
      <Text size="md" fw={600}>
        Participants
      </Text>
      <Grid gutter={4}>
        <Grid.Col span={6}>
          <Text size="md" c="dimmed">
            Accounted For
          </Text>
          <Text size="md">
            {displayAddress8(statement.accountedFor || statement.holder)}
          </Text>
          <Text size="md" c="dimmed" mt={8}>
            Asset
          </Text>
          <Text size="md">
            {displayAddress8(statement.asset)}
            {statement.symbol ? ` (${statement.symbol})` : ''}
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="md" c="dimmed">
            Sender
          </Text>
          <Text size="md">{displayAddress8(statement.sender)}</Text>
          <Text size="md" c="dimmed" mt={8}>
            Recipient
          </Text>
          <Text size="md">{displayAddress8(statement.recipient)}</Text>
        </Grid.Col>
      </Grid>
      <Divider variant="dashed" />
      <Text size="md" fw={600}>
        Balance Summary
      </Text>
      <Grid gutter={4} columns={100}>
        <Grid.Col span={24}>
          <Text size="md" c="dimmed">
            Beg Bal
          </Text>
          <Tooltip label={beginBalRaw.toString()} withArrow>
            <Text
              size="md"
              ta="right"
              c={beginBalRaw === 0n ? 'dimmed' : undefined}
              style={{ fontFamily: 'monospace', paddingRight: 16 }}
            >
              {formatRaw(beginBalRaw)}
            </Text>
          </Tooltip>
        </Grid.Col>
        <Grid.Col span={24}>
          <Text size="md" c="dimmed">
            Income
          </Text>
          <Tooltip label={totalInRaw.toString()} withArrow>
            <Text
              size="md"
              ta="right"
              c={totalInRaw === 0n ? 'dimmed' : undefined}
              style={{ fontFamily: 'monospace', paddingRight: 16 }}
            >
              {formatRaw(totalInRaw)}
            </Text>
          </Tooltip>
        </Grid.Col>
        <Grid.Col span={4}></Grid.Col>
        <Grid.Col span={24}>
          <Text size="md" c="dimmed">
            Outflow
          </Text>
          <Tooltip label={totalOutRaw.toString()} withArrow>
            <Text
              size="md"
              ta="right"
              c={totalOutRaw === 0n ? 'dimmed' : undefined}
              style={{ fontFamily: 'monospace', paddingRight: 16 }}
            >
              {formatRaw(totalOutRaw)}
            </Text>
          </Tooltip>
        </Grid.Col>
        <Grid.Col span={24}>
          <Text size="md" c="dimmed">
            End Bal
          </Text>
          <Tooltip label={endBalRaw.toString()} withArrow>
            <Text
              size="md"
              ta="right"
              c={endBalRaw === 0n ? 'dimmed' : undefined}
              style={{ fontFamily: 'monospace', paddingRight: 16 }}
            >
              {formatRaw(endBalRaw)}
            </Text>
          </Tooltip>
        </Grid.Col>
      </Grid>
      <Divider variant="dashed" />
      <Text size="md" fw={600}>
        Breakdown
      </Text>
      <Grid gutter={4}>
        <Grid.Col span={6}>
          <Text size="md" fw={600}>
            Inflows
          </Text>
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
                <Text size="md" c="dimmed">
                  {label}
                </Text>
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
              <Group key={label} justify="space-between" gap={4} wrap="nowrap">
                <Text size="md" c="dimmed">
                  {label}
                </Text>
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
      <Divider variant="dashed" />
      <Grid gutter={4}>
        <Grid.Col span={4}>
          <Text size="md" c="dimmed">
            Spot Price
          </Text>
          <Tooltip label={toBig(statement.spotPrice).toString()} withArrow>
            <Text
              size="md"
              ta="right"
              c={toBig(statement.spotPrice) === 0n ? 'dimmed' : undefined}
              style={{ fontFamily: 'monospace', paddingRight: 16 }}
            >
              {formatToken(statement.spotPrice)}
            </Text>
          </Tooltip>
        </Grid.Col>
        <Grid.Col span={5}>
          <Text size="md" c="dimmed">
            Price Source
          </Text>
          <Text size="md">{statement.priceSource || '-'}</Text>
        </Grid.Col>
      </Grid>
      {!isReconciled && statement.correctingReasons && (
        <Text size="md" c="red">
          {statement.correctingReasons}
        </Text>
      )}
      {statement.correctionId ? (
        <Text size="md" c="dimmed">
          Correction Id: {statement.correctionId}
        </Text>
      ) : null}
    </Stack>
  );
};

export const renderers = {
  'exports.statements': renderStatementDetailPanel,
};
