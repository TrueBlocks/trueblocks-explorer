import { ReactNode, createContext, useContext } from 'react';

import { usePreferences } from '../hooks/usePreferences';
import { Skin, SkinName, availableSkins, darkModeSkin } from '../utils/skins';

interface SkinContextType {
  currentSkin: Skin;
  currentSkinName: SkinName;
  setSkin: (skinName: SkinName) => void;
  availableSkinNames: SkinName[];
}

const SkinContext = createContext<SkinContextType | undefined>(undefined);

interface SkinProviderProps {
  children: ReactNode;
}

export const SkinProvider = ({ children }: SkinProviderProps) => {
  const { lastSkin, setSkin: setPreferencesSkin } = usePreferences();

  const setSkin = (skinName: SkinName) => {
    setPreferencesSkin(skinName);
  };

  const currentSkinName = lastSkin as SkinName;
  const currentSkin = availableSkins[currentSkinName] || darkModeSkin;
  const availableSkinNames = Object.keys(availableSkins) as SkinName[];

  return (
    <SkinContext.Provider
      value={{
        currentSkin,
        currentSkinName,
        setSkin,
        availableSkinNames,
      }}
    >
      {children}
    </SkinContext.Provider>
  );
};

export const useSkinContext = () => {
  const context = useContext(SkinContext);
  if (context === undefined) {
    throw new Error('useSkinContext must be used within a SkinProvider');
  }
  return context;
};
