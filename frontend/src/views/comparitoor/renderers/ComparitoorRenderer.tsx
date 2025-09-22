import React from 'react';
import { useRef, useState } from 'react';

import { StyledText } from '@components';
import {
  Box,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { comparitoor } from '@models';

import { useComparitoorData } from '../hooks/useComparitoorData';
import { SummaryColumn } from './SummaryColumn';

export type AppearanceItem = {
  blockNum: string;
  txid: string;
  value: string;
  missing?: boolean;
  unique?: boolean;
};

export type ComparitoorRendererProps = {
  _pageData: comparitoor.ComparitoorPage | null;
  address?: string;
};
// TODO: Replace with real icons/components
const MaterialIcon = () => (
  <span style={{ fontWeight: 'bold', marginLeft: 4 }}>★</span>
);

export const ComparitoorRenderer = ({
  _pageData,
  address,
}: ComparitoorRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useMantineTheme();
  // statusColors and getRowStyle removed (no longer used)

  // Use index-based selection for speed
  const [active, setActive] = useState<{
    sourceIdx: number;
    itemIdx: number;
  } | null>(null);

  // Keyboard navigation handler
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!active) return;
    let { sourceIdx, itemIdx } = active;
    const numSources = sources.length;
    const numItems = sources[0]?.data.length || 0;

    switch (e.key) {
      case 'ArrowUp':
        itemIdx = itemIdx === 0 ? numItems - 1 : itemIdx - 1;
        break;
      case 'ArrowDown':
        itemIdx = itemIdx === numItems - 1 ? 0 : itemIdx + 1;
        break;
      case 'ArrowLeft':
        sourceIdx = sourceIdx === 0 ? numSources - 1 : sourceIdx - 1;
        break;
      case 'ArrowRight':
        sourceIdx = sourceIdx === numSources - 1 ? 0 : sourceIdx + 1;
        break;
      case 'Home':
        sourceIdx = 0;
        itemIdx = 0;
        break;
      case 'End':
        sourceIdx = numSources - 1;
        itemIdx = numItems - 1;
        break;
      case 'Escape':
        setActive(null);
        e.preventDefault();
        return;
      default:
        return;
    }
    e.preventDefault();
    setActive({ sourceIdx, itemIdx });
  }

  const sources = useComparitoorData(_pageData);

  // Data-driven row style: assign by item properties only
  // getRowStyle removed (no longer used)

  return (
    <Stack
      p="md"
      gap="md"
      style={{ height: '100%', flexGrow: 1 }}
      tabIndex={0}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <Title order={3} ta="center" style={{ flexShrink: 0 }}>
        Comparatooor - We Find More So You Don’t Have To
      </Title>
      <Group align="center" justify="center" style={{ flexShrink: 0 }}>
        <TextInput
          value={address || '0x503017d7baf7fbc0fff7492b751025c6a78179b'}
          readOnly
          maw={420}
          style={{ flexGrow: 1 }}
          size="sm"
          label="Address"
        />
      </Group>
      <Box
        style={{
          flexGrow: 1,
          display: 'flex',
          gap: theme.spacing.md,
          width: '100%',
        }}
      >
        {sources.map((src, sourceIdx) => {
          const items: AppearanceItem[] = src.data;
          return (
            <Paper
              key={src.key}
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
              <Stack gap={2} style={{ flexGrow: 1, minHeight: 0 }}>
                <Title order={5} mb={2} ta="center" style={{ flexShrink: 0 }}>
                  {src.label}
                </Title>
                <Stack gap={2} style={{ flexGrow: 1, overflowY: 'auto' }}>
                  {items.map((item, itemIdx) => {
                    const isActive =
                      active &&
                      active.sourceIdx === sourceIdx &&
                      active.itemIdx === itemIdx;
                    const isMatching =
                      active && active.itemIdx === itemIdx && !isActive;
                    const isMissing = !!item.missing;
                    let borderStyle = '2px solid transparent';
                    if (isActive) {
                      borderStyle = `2px solid ${theme.colors.blue[6]}`;
                    } else if (isMatching) {
                      borderStyle = `2px solid ${theme.colors.blue[2]}`;
                    }
                    return (
                      <Group
                        key={item.value + itemIdx}
                        gap={4}
                        align="center"
                        style={{
                          border: borderStyle,
                          opacity: isMissing ? 0.6 : 1,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          setActive({
                            sourceIdx,
                            itemIdx,
                          })
                        }
                      >
                        <StyledText
                          variant={isMissing ? 'error' : 'warning'}
                          size="sm"
                        >
                          {isMissing ? '[missing]' : item.value}
                        </StyledText>
                        {item.value === '100.100' && src.key === 'chifra' ? (
                          <MaterialIcon />
                        ) : null}
                      </Group>
                    );
                  })}
                </Stack>
                <StyledText variant="primary" size="xs">
                  {src.stats.appearances.toLocaleString()} appearances
                  <br />
                  {src.stats.unique} unique
                </StyledText>
              </Stack>
            </Paper>
          );
        })}
        <SummaryColumn
          active={
            active
              ? {
                  source: sources[active.sourceIdx]?.key ?? '',
                  blockNum:
                    sources[active.sourceIdx]?.data[active.itemIdx]?.blockNum,
                  txid: sources[active.sourceIdx]?.data[active.itemIdx]?.txid,
                }
              : null
          }
          rowValues={
            active
              ? sources.map(
                  (src) =>
                    src.data[active.itemIdx] ?? {
                      blockNum: '',
                      txid: '',
                      value: '[missing]',
                      missing: true,
                    },
                )
              : null
          }
          sourceKeys={sources.map((src) => src.key)}
          sources={sources}
          unionStats={
            _pageData
              ? {
                  unionCount: _pageData.unionCount,
                  overlapCount: _pageData.overlapCount,
                  intersectionCount: _pageData.intersectionCount,
                }
              : undefined
          }
        />
      </Box>
      {/** Legend removed as per requirements */}
    </Stack>
  );
};
