import { useSkinContext } from '@contexts';
import { Button, Select } from '@mantine/core';

import type { SkinName } from '../utils/skins';

interface SkinSwitcherProps {
  collapsed?: boolean;
}

export const SkinSwitcher = ({ collapsed = false }: SkinSwitcherProps) => {
  const { currentSkinName, setSkin, availableSkinNames } = useSkinContext();

  if (collapsed) {
    // When collapsed, show a simple button that cycles through skins
    const handleCycleSkin = () => {
      const currentIndex = availableSkinNames.indexOf(currentSkinName);
      const nextIndex = (currentIndex + 1) % availableSkinNames.length;
      const nextSkinName = availableSkinNames[nextIndex];
      if (nextSkinName) {
        setSkin(nextSkinName);
      }
    };

    return (
      <Button
        variant="subtle"
        size="xs"
        w={36}
        h={36}
        px={0}
        onClick={handleCycleSkin}
        title={`Current skin: ${currentSkinName}. Click to cycle.`}
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
      value={currentSkinName}
      data={availableSkinNames.map((name) => ({
        value: name,
        label: name.charAt(0).toUpperCase() + name.slice(1),
      }))}
      onChange={(value) => {
        if (value && (value as SkinName)) {
          setSkin(value as SkinName);
        }
      }}
      placeholder="Select skin"
      w="100%"
    />
  );
};
