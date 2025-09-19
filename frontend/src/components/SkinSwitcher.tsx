import { useEffect, useState } from 'react';

import { GetAvailableSkins } from '@app';
import { usePreferences } from '@hooks';
import { Button, Select } from '@mantine/core';
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
        variant="subtle"
        size="xs"
        w={36}
        h={36}
        px={0}
        onClick={handleCycleSkin}
        title={`Current skin: ${currentSkin?.displayName || lastSkin}. Click to cycle.`}
        style={{
          marginLeft: -9,
        }}
      >
        🎨
      </Button>
    );
  }

  // When expanded, show a proper select
  return (
    <Select
      size="xs"
      value={lastSkin}
      data={availableSkins.map((skinMetadata) => ({
        value: skinMetadata.name,
        label: skinMetadata.displayName,
      }))}
      onChange={(value) => {
        if (value) {
          setSkin(value);
        }
      }}
      placeholder="Select skin"
      w="100%"
    />
  );
};
