// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import React from 'react';
import { useRef, useState } from 'react';

import { RendererParams } from '@components';
import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { comparitoor } from '@models';

import { useComparitoorData } from '../../../hooks/useComparitoorData';
import { SummaryColumn } from '../../components/SummaryColumn';

export type AppearanceItem = {
  blockNum: string;
  txid: string;
  value: string;
  missing?: boolean;
  unique?: boolean;
};

// EXISTING_CODE

export const ComparitoorFacet = ({ params }: { params: RendererParams }) => {
  // EXISTING_CODE
  const { data } = params;
  const pageData = data;
  const address = '0x503017d7baf7fbc0fff7492b751025c6a78179b'; // Default address for now
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

  // Transform raw pageData
  const transformed = pageData
    ? ({
        transaction: pageData,
        chifra: pageData,
        etherscan: pageData,
        covalent: pageData,
        alchemy: pageData,
        unionCount: pageData.length,
        overlapCount: 0,
        intersectionCount: 0,
      } as unknown as comparitoor.ComparitoorPage)
    : null;

  const sources = useComparitoorData(transformed);

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
                <Title order={5} mb="xs" ta="center" style={{ flexShrink: 0 }}>
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
                    var variant = isMissing ? 'error' : 'warning';
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
                        <Text variant={variant} size="sm">
                          {isMissing ? '[missing]' : item.value}
                        </Text>
                        {item.value === '100.100' && src.key === 'chifra' ? (
                          <MaterialIcon />
                        ) : null}
                      </Group>
                    );
                  })}
                </Stack>
                <Text variant="primary" size="sm">
                  {src.stats.appearances.toLocaleString()} appearances
                  <br />
                  {src.stats.unique} unique
                </Text>
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
            transformed
              ? {
                  unionCount: transformed.unionCount,
                  overlapCount: transformed.overlapCount,
                  intersectionCount: transformed.intersectionCount,
                }
              : undefined
          }
        />
      </Box>
      {/** Legend removed as per requirements */}
    </Stack>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// TODO: Replace with real icons/components
const MaterialIcon = () => (
  <span style={{ fontWeight: 'bold', marginLeft: 4 }}>★</span>
);
// EXISTING_CODE
