import { useCallback, useMemo } from 'react';

import { StyledSelect } from '@components';
import { Group, NumberInput } from '@mantine/core';
import { types } from '@models';

import { useGalleryStore } from '../store';

export type GallerySortMode = 'series' | 'address';

interface GalleryControlsProps {
  disabled?: boolean;
}

export function GalleryControls({ disabled = false }: GalleryControlsProps) {
  const { sortMode, setSortMode, columns, setColumns, ensureHydrated } =
    useGalleryStore();

  const viewStateKey = useMemo(
    () => ({
      viewName: 'dresses',
      facetName: types.DataFacet.GALLERY,
    }),
    [],
  );

  const handleSortModeChange = useCallback(
    (value: string | null) => {
      if (value && (value === 'series' || value === 'address')) {
        setSortMode(value, viewStateKey);
      }
    },
    [setSortMode, viewStateKey],
  );

  const handleColumnsChange = useCallback(
    (value: string | number) => {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
        setColumns(numValue, viewStateKey);
      }
    },
    [setColumns, viewStateKey],
  );

  ensureHydrated(viewStateKey);

  return (
    <Group gap="md">
      <StyledSelect
        label="Sort by"
        data={[
          { value: 'series', label: 'Series' },
          { value: 'address', label: 'Address' },
        ]}
        value={sortMode}
        onChange={handleSortModeChange}
        disabled={disabled}
      />

      <NumberInput
        label="Columns"
        min={1}
        max={20}
        value={columns}
        onChange={handleColumnsChange}
        disabled={disabled}
      />
    </Group>
  );
}
