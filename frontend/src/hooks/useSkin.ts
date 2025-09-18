import { useMemo } from 'react';

import { Skin, SkinName, availableSkins, darkModeSkin } from '../utils/skins';

/**
 * Hook to access the current skin
 * For now, just returns the default skin, but this will be expanded
 * to read from preferences/state when we add skin selection
 */
export const useSkin = (skinName?: SkinName): Skin => {
  return useMemo(() => {
    if (skinName && skinName in availableSkins) {
      return availableSkins[skinName];
    }
    return darkModeSkin;
  }, [skinName]);
};
