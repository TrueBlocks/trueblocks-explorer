import { StyledBadge, StyledText } from '@components';
import { Card, Image, Stack } from '@mantine/core';
import { model } from '@models';

export interface GeneratorThumbProps {
  item: model.DalleDress;
  onSelect?: (item: model.DalleDress) => void;
  selected?: boolean;
}

export const GeneratorThumb = ({
  item,
  onSelect,
  selected,
}: GeneratorThumbProps) => {
  const handleClick = () => {
    onSelect?.(item);
  };
  return (
    <Card
      p={2}
      radius="xs"
      withBorder
      onClick={handleClick}
      bd={selected ? '1px solid var(--mantine-color-primary-6)' : undefined}
      bg={selected ? 'primary.1' : undefined}
      style={{
        cursor: 'pointer',
        width: 72,
      }}
    >
      <Stack gap={2} align="stretch">
        <div
          style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}
        >
          <Image
            src={item.imageUrl}
            alt={item.fileName}
            fit="cover"
            radius="xs"
            style={{ width: '100%', height: '100%' }}
          />
          <StyledBadge
            variant="light"
            size="xs"
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              pointerEvents: 'none',
            }}
          >
            {item.series || '—'}
          </StyledBadge>
        </div>
        <StyledText variant="primary" size="sm">
          {item.fileName.replace(/\.png$/i, '')}
        </StyledText>
      </Stack>
    </Card>
  );
};
