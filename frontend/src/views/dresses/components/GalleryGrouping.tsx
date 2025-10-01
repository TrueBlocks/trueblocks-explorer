import { useCallback, useEffect, useState } from 'react';

import { FromTemplate } from '@app';
import { StyledText } from '@components';
import { Box, SimpleGrid, Title } from '@mantine/core';
import { model, types } from '@models';

import { getItemKey } from '../store';
import { DalleDressCard } from './DalleDressCard';

export interface GalleryGroupingProps {
  items: model.DalleDress[];
  series: string;
  columns: number;
  sortMode: 'series' | 'address';
  selected?: string | null;
  onItemClick?: (item: model.DalleDress) => void;
  onItemDoubleClick?: (item: model.DalleDress) => void;
}

export const GalleryGrouping = ({
  series,
  items,
  columns,
  sortMode,
  onItemClick,
  onItemDoubleClick,
  selected,
}: GalleryGroupingProps) => {
  const [descriptiveText, setDescriptiveText] = useState<string>('');
  const firstItemOriginal = items?.[0]?.original || '';
  const itemsLength = items?.length || 0;

  const generateDescription = useCallback(
    async (address: string): Promise<string> => {
      if (!address) {
        return 'No address available';
      }

      try {
        const template =
          '{{.Adverb true}} {{.Adjective true}} {{.Noun true}} felling {{.Emotion true}} who works as {{.Occupation true}} in the style of {{.ArtStyle true 1}}';
        const payload = types.Payload.createFrom({
          dataFacet: 'gallery' as types.DataFacet,
          chain: 'mainnet',
          address: address,
          period: '',
        });
        const result = await FromTemplate(payload, template);
        return result || 'Unable to generate description';
      } catch {
        return 'Error generating description';
      }
    },
    [],
  );

  useEffect(() => {
    const fetchDescriptiveText = async () => {
      if (sortMode === 'address' && itemsLength > 0 && firstItemOriginal) {
        try {
          const result = await generateDescription(firstItemOriginal);
          setDescriptiveText(result);
        } catch {
          setDescriptiveText('Error generating description');
        }
      } else {
        setDescriptiveText('');
      }
    };

    fetchDescriptiveText();
  }, [sortMode, series, itemsLength, firstItemOriginal, generateDescription]);

  return (
    <Box mb="lg">
      <Title order={5} mb={6} style={{ fontFamily: 'monospace' }}>
        {series || 'unknown'} ({items.length})
      </Title>
      {sortMode === 'address' && descriptiveText && (
        <Box
          bg="gray.1"
          bd="2px solid var(--mantine-color-gray-4)"
          style={{
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px',
          }}
        >
          <StyledText variant="primary" size="md">
            {descriptiveText}
          </StyledText>
        </Box>
      )}
      <SimpleGrid cols={columns} spacing={6} verticalSpacing={6}>
        {items.map((it) => {
          const itemKey = getItemKey(it);
          return (
            <DalleDressCard
              key={itemKey}
              item={it}
              onClick={onItemClick}
              onDoubleClick={onItemDoubleClick}
              selected={itemKey === selected}
            />
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
