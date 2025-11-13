import { useState } from 'react';

import { StyledSelect } from '@components';
import { BarChart } from '@mantine/charts';
import { Divider, Paper, Stack, Text, Title } from '@mantine/core';

import type { AppearanceItem } from '../../hooks/useComparitoorData';

type ActiveType = {
  source: string;
  blockNum: string | undefined;
  txid: string | undefined;
} | null;

const effectivenessOptions = [
  { value: 'total', label: 'Total Found' },
  { value: 'unique', label: 'Unique' },
  { value: 'missing', label: 'Missing' },
  { value: 'present', label: 'Present' },
] as const;

type Source = {
  key: string;
  label: string;
  data: AppearanceItem[];
  stats: { appearances: number; time?: number; unique: number };
};

type UnionStats = {
  unionCount: number;
  intersectionCount: number;
  overlapCount: number;
};

export type SummaryColumnProps = {
  active: ActiveType;
  rowValues: AppearanceItem[] | null;
  sourceKeys: string[];
  sources: Source[];
  unionStats?: UnionStats;
};

function getEffectivenessData(
  sources: Source[],
  metric: (typeof effectivenessOptions)[number]['value'],
): { source: string; value: number }[] {
  switch (metric) {
    case 'total':
      return sources.map((src) => ({
        source: src.label,
        value: src.stats.appearances,
      }));
    case 'unique':
      return sources.map((src) => ({
        source: src.label,
        value: src.stats.unique,
      }));
    case 'missing':
      return sources.map((src) => ({
        source: src.label,
        value: src.data.filter((item) => item.missing).length,
      }));
    case 'present':
      return sources.map((src) => ({
        source: src.label,
        value: src.data.filter((item) => !item.missing).length,
      }));
    default:
      return sources.map((src) => ({ source: src.label, value: 0 }));
  }
}

export const SummaryColumn = ({
  active,
  rowValues,
  sourceKeys,
  sources,
  unionStats,
}: SummaryColumnProps) => {
  const [effectivenessMetric, setEffectivenessMetric] =
    useState<(typeof effectivenessOptions)[number]['value']>('total');

  return (
    <Paper
      p="xs"
      radius="md"
      withBorder
      style={{
        minWidth: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack gap={8} style={{ flexGrow: 1, minHeight: 0 }}>
        <Title order={5} ta="center" mb="xs">
          Summary
        </Title>
        <Text variant="primary" size="sm">
          This summary compares the effectiveness and speed of each source. Use
          the dropdowns below to switch metrics and see how each provider
          performs in terms of total found, unique, missing, present, and
          completion speed.
        </Text>
        <StyledSelect
          label="Effectiveness Metric"
          data={effectivenessOptions}
          value={effectivenessMetric}
          onChange={(value) =>
            value &&
            setEffectivenessMetric(
              value as (typeof effectivenessOptions)[number]['value'],
            )
          }
          size="xs"
          mb="xs"
        />
        <BarChart
          h={120}
          data={getEffectivenessData(sources, effectivenessMetric)}
          series={[{ name: 'value', color: 'primary' }]}
          dataKey="source"
          barProps={{ radius: 4 }}
        />
        {unionStats ? (
          <>
            <Divider
              my={8}
              label="Union/Overlap/Intersection"
              labelPosition="center"
            />
            <BarChart
              h={80}
              data={[
                { label: 'Union', value: unionStats.unionCount },
                { label: 'Overlap', value: unionStats.overlapCount },
                { label: 'Intersection', value: unionStats.intersectionCount },
              ]}
              series={[{ name: 'value', color: 'secondary' }]}
              dataKey="label"
              barProps={{ radius: 4 }}
            />
          </>
        ) : null}
        {active && rowValues ? (
          <>
            <Text variant="primary" size="sm" fw={600}>
              Selected: {active.blockNum}.{active.txid}
            </Text>
            <Stack gap={2} mt={2}>
              {rowValues.map((item, idx) => (
                <div key={sourceKeys[idx]}>
                  <Text variant="primary" size="sm">
                    <b>{sourceKeys[idx]}</b>: {item?.value ?? '[missing]'}
                    {item?.missing ? ' (missing)' : ''}
                  </Text>
                </div>
              ))}
            </Stack>
          </>
        ) : null}
      </Stack>
    </Paper>
  );
};
