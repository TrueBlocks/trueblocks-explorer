import { Badge, Card, Image, Stack, Text } from '@mantine/core';
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
      style={{
        cursor: 'pointer',
        width: 72,
        borderColor: selected
          ? 'var(--skin-primary-selected-border)'
          : undefined,
        background: selected ? 'var(--skin-primary-selected)' : undefined,
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
          <Badge
            size="xs"
            variant="light"
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              pointerEvents: 'none',
            }}
          >
            {item.series || '—'}
          </Badge>
        </div>
        <Text size="10px" truncate>
          {item.fileName.replace(/\.png$/i, '')}
        </Text>
      </Stack>
    </Card>
  );
};
