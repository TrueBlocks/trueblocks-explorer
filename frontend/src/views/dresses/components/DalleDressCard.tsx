import { Box, Card, Image, Stack, Text } from '@mantine/core';
import { model } from '@models';
import { getDisplayAddress } from '@utils';

import { getItemKey } from '../store';

export interface DalleDressCardProps {
  item: model.DalleDress;
  onClick?: (item: model.DalleDress) => void;
  onDoubleClick?: (item: model.DalleDress) => void;
  selected?: boolean;
}

export const DalleDressCard = ({
  item,
  onClick,
  onDoubleClick,
  selected,
}: DalleDressCardProps) => {
  const itemKey = getItemKey(item);
  const handleClick = () => {
    onClick?.(item);
  };
  const handleDoubleClick = () => {
    onDoubleClick?.(item);
  };
  return (
    <Card
      p={4}
      radius="sm"
      withBorder
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: 'pointer',
        borderColor: selected ? 'var(--mantine-color-blue-5)' : undefined,
        boxShadow: selected
          ? '0 0 0 2px var(--mantine-color-blue-6), 0 0 6px 2px rgba(51,154,240,0.55)'
          : undefined,
        background: selected
          ? 'linear-gradient(135deg, rgba(51,154,240,0.18), rgba(51,154,240,0.05))'
          : undefined,
        transition: 'box-shadow 120ms, border-color 120ms, background 160ms',
      }}
      data-key={itemKey}
    >
      <Stack gap={4} align="stretch">
        <Box
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            background: selected ? 'rgba(51,154,240,0.12)' : undefined,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Image
            src={item.imageUrl}
            alt={item.fileName}
            radius="xs"
            fit="cover"
            loading="lazy"
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
        <Text size="xs" fw={500} truncate>
          {getDisplayAddress(item.original || '')}
        </Text>
      </Stack>
    </Card>
  );
};
