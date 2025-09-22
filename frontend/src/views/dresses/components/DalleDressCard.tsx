import { StyledText } from '@components';
import { Box, Card, Image, Stack } from '@mantine/core';
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
        borderColor: selected ? 'var(--skin-primary)' : undefined,
        boxShadow: selected
          ? '0 0 0 2px var(--skin-primary), 0 0 6px 2px var(--skin-primary-alpha-50)'
          : undefined,
        background: selected ? 'var(--skin-primary-alpha-10)' : undefined,
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
            background: selected ? 'var(--skin-primary-alpha-10)' : undefined,
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
        <StyledText variant="primary" size="xs" fw={600}>
          {getDisplayAddress(item.original || '')}
        </StyledText>
      </Stack>
    </Card>
  );
};
