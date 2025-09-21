import { useEffect, useState } from 'react';

import { GetAvailableSkins } from '@app';
import { StyledSelect } from '@components';
import { usePreferences } from '@hooks';
import { Button } from '@mantine/core';
import { skin } from '@models';
import { Log } from '@utils';

interface SkinSwitcherProps {
  collapsed?: boolean;
}

export const SkinSwitcher = ({ collapsed = false }: SkinSwitcherProps) => {
  const { lastSkin, setSkin } = usePreferences();
  const [availableSkins, setAvailableSkins] = useState<skin.SkinMetadata[]>([]);

  // Load available skins from backend
  useEffect(() => {
    async function loadAvailableSkins() {
      try {
        const skins = await GetAvailableSkins();
        setAvailableSkins(skins);
      } catch (error) {
        Log(
          `Failed to load available skins: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    loadAvailableSkins();
  }, []);

  if (collapsed) {
    // When collapsed, show a simple button that cycles through skins
    const handleCycleSkin = () => {
      const currentIndex = availableSkins.findIndex(
        (skin) => skin.name === lastSkin,
      );
      const nextIndex = (currentIndex + 1) % availableSkins.length;
      const nextSkin = availableSkins[nextIndex];
      if (nextSkin) {
        setSkin(nextSkin.name);
      }
    };

    const currentSkin = availableSkins.find((skin) => skin.name === lastSkin);

    return (
      <Button
        size="xs"
        w={34}
        h={34}
        px={0}
        onClick={handleCycleSkin}
        title={`Current skin: ${currentSkin?.displayName || lastSkin}. Click to cycle.`}
        style={{
          backgroundColor: 'transparent',
          color: 'var(--mantine-color-text)',
        }}
        variant="transparent"
      >
        🎨
      </Button>
    );
  }

  // When expanded, show a proper select
  return (
    <StyledSelect
      size="xs"
      value={lastSkin}
      data={availableSkins.map((skinMetadata) => ({
        value: skinMetadata.name,
        label: skinMetadata.displayName,
      }))}
      onChange={(value: string | null) => {
        if (value) {
          setSkin(value);
        }
      }}
      placeholder="Select skin"
      w="100%"
    />
  );
};
