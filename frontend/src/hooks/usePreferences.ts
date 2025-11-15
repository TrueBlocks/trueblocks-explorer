import { useSyncExternalStore } from 'react';

import {
  GetAppPreferences,
  SetAppPreferences,
  SetChromeCollapsed,
  SetDebugCollapsed,
  SetFontScale,
  SetHelpCollapsed,
  SetLanguage,
  SetMenuCollapsed,
  SetSkin,
  SetTheme,
} from '@app';
import { preferences } from '@models';
import { LogError, updateAppPreferencesSafely } from '@utils';

export interface UsePreferencesReturn {
  lastTheme: string;
  lastSkin: string;
  lastLanguage: string;
  debugCollapsed: boolean;
  menuCollapsed: boolean;
  helpCollapsed: boolean;
  chromeCollapsed: boolean;
  detailCollapsed: boolean;
  fontScale: number;
  showFieldTypes: boolean;
  loading: boolean;
  toggleTheme: () => Promise<void>;
  setSkin: (skin: string) => Promise<void>;
  changeLanguage: (language: string) => Promise<void>;
  setDebugCollapsed: (collapsed: boolean) => Promise<void>;
  setMenuCollapsed: (collapsed: boolean) => Promise<void>;
  setHelpCollapsed: (collapsed: boolean) => Promise<void>;
  setChromeCollapsed: (collapsed: boolean) => Promise<void>;
  setDetailCollapsed: (enabled: boolean) => Promise<void>;
  setFontScale: (scale: number) => Promise<void>;
  setShowFieldTypes: (enabled: boolean) => Promise<void>;
  isDarkMode: boolean;
}

interface PreferencesState {
  lastTheme: string;
  lastSkin: string;
  lastLanguage: string;
  debugCollapsed: boolean;
  menuCollapsed: boolean;
  helpCollapsed: boolean;
  chromeCollapsed: boolean;
  detailCollapsed: boolean;
  fontScale: number;
  showFieldTypes: boolean;
  loading: boolean;
}

const initialPreferencesState: PreferencesState = {
  lastTheme: 'dark',
  lastSkin: 'default',
  lastLanguage: 'en',
  debugCollapsed: true,
  menuCollapsed: false,
  helpCollapsed: false,
  chromeCollapsed: false,
  detailCollapsed: true,
  fontScale: 1.0,
  showFieldTypes: false,
  loading: false,
};

class PreferencesStore {
  private state: PreferencesState = { ...initialPreferencesState };
  private listeners = new Set<() => void>();
  private cachedSnapshot: UsePreferencesReturn | null = null;
  private overrideCollapsed: { menu?: boolean; help?: boolean } | null = null;

  getSnapshot = (): UsePreferencesReturn => {
    const effectiveMenuCollapsed = this.state.chromeCollapsed
      ? true
      : this.state.menuCollapsed;
    const effectiveHelpCollapsed = this.state.chromeCollapsed
      ? true
      : this.state.helpCollapsed;
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = {
        lastTheme: this.state.lastTheme,
        lastSkin: this.state.lastSkin,
        lastLanguage: this.state.lastLanguage,
        debugCollapsed: this.state.debugCollapsed,
        menuCollapsed: effectiveMenuCollapsed,
        helpCollapsed: effectiveHelpCollapsed,
        chromeCollapsed: this.state.chromeCollapsed,
        detailCollapsed: this.state.detailCollapsed,
        fontScale: this.state.fontScale,
        showFieldTypes: this.state.showFieldTypes,
        loading: this.state.loading,
        toggleTheme: this.toggleTheme,
        setSkin: this.setSkin,
        changeLanguage: this.changeLanguage,
        setDebugCollapsed: this.setDebugCollapsed,
        setMenuCollapsed: this.setMenuCollapsed,
        setHelpCollapsed: this.setHelpCollapsed,
        setChromeCollapsed: this.setChromeCollapsed,
        setDetailCollapsed: this.setDetailCollapsed,
        setFontScale: this.setFontScale,
        setShowFieldTypes: this.setShowFieldTypes,
        isDarkMode: this.isDarkMode,
      };
    }
    return this.cachedSnapshot;
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify = (): void => {
    this.listeners.forEach((listener) => listener());
  };

  private setState = (updates: Partial<PreferencesState>): void => {
    this.state = { ...this.state, ...updates };
    this.cachedSnapshot = null;
    this.notify();
  };

  private updatePreferences = async (
    updates: Partial<preferences.AppPreferences>,
  ): Promise<void> => {
    try {
      const currentPrefs = await GetAppPreferences();

      if (
        updates.recentProjects !== undefined &&
        !Array.isArray(updates.recentProjects)
      ) {
        LogError('Invalid recentProjects value, must be an array');
        throw new Error('recentProjects must be an array');
      }

      if (
        updates.silencedDialogs !== undefined &&
        typeof updates.silencedDialogs !== 'object'
      ) {
        LogError('Invalid silencedDialogs value, must be an object');
        throw new Error('silencedDialogs must be an object');
      }

      if (
        updates.bounds !== undefined &&
        (typeof updates.bounds !== 'object' ||
          typeof updates.bounds.width !== 'number' ||
          typeof updates.bounds.height !== 'number' ||
          updates.bounds.width < 100 ||
          updates.bounds.height < 100)
      ) {
        LogError('Invalid bounds value, must have valid width/height >= 100');
        throw new Error('bounds must have valid width and height >= 100');
      }

      const updatedPrefs = updateAppPreferencesSafely(currentPrefs, updates);
      await SetAppPreferences(updatedPrefs);
    } catch (error) {
      LogError('Failed to update preferences: ' + String(error));
      throw error;
    }
  };

  initialize = async (): Promise<void> => {
    try {
      this.setState({ loading: true });

      const prefs = await GetAppPreferences();

      // Clamp fontScale to valid range (0.6 to 1.4) and ensure single decimal precision
      let fontScale = prefs.fontScale ?? 1.0;
      fontScale = Math.max(0.6, Math.min(1.4, fontScale));
      fontScale = Math.round(fontScale * 10) / 10; // Ensure single decimal precision

      this.setState({
        lastTheme: prefs.lastTheme || 'dark',
        lastSkin: prefs.lastSkin || 'default',
        lastLanguage: prefs.lastLanguage || 'en',
        debugCollapsed: prefs.debugCollapsed ?? true,
        menuCollapsed: prefs.menuCollapsed ?? false,
        helpCollapsed: prefs.helpCollapsed ?? false,
        chromeCollapsed: prefs.chromeCollapsed ?? false,
        detailCollapsed: prefs.detailCollapsed ?? true,
        fontScale,
        showFieldTypes: prefs.showFieldTypes ?? false,
        loading: false,
      });
    } catch (error) {
      LogError('Failed to load preferences: ' + String(error));
      this.setState({
        lastTheme: 'dark',
        lastSkin: 'default',
        lastLanguage: 'en',
        debugCollapsed: true,
        menuCollapsed: false,
        helpCollapsed: false,
        chromeCollapsed: false,
        detailCollapsed: true,
        fontScale: 1.0,
        showFieldTypes: false,
        loading: false,
      });
    }
  };

  toggleTheme = async (): Promise<void> => {
    const newTheme = this.state.lastTheme === 'dark' ? 'light' : 'dark';
    await SetTheme(newTheme);
    await this.updatePreferences({ lastTheme: newTheme });
    this.setState({ lastTheme: newTheme });
  };

  setSkin = async (skin: string): Promise<void> => {
    await SetSkin(skin);
    await this.updatePreferences({ lastSkin: skin });
    this.setState({ lastSkin: skin });
  };

  changeLanguage = async (language: string): Promise<void> => {
    await SetLanguage(language);
    await this.updatePreferences({ lastLanguage: language });
    this.setState({ lastLanguage: language });
  };

  setDebugCollapsed = async (collapsed: boolean): Promise<void> => {
    await SetDebugCollapsed(collapsed);
    await this.updatePreferences({ debugCollapsed: collapsed });
    this.setState({ debugCollapsed: collapsed });
  };

  setMenuCollapsed = async (collapsed: boolean): Promise<void> => {
    await SetMenuCollapsed(collapsed);
    await this.updatePreferences({ menuCollapsed: collapsed });
    this.setState({ menuCollapsed: collapsed });
  };

  setHelpCollapsed = async (collapsed: boolean): Promise<void> => {
    await SetHelpCollapsed(collapsed);
    await this.updatePreferences({ helpCollapsed: collapsed });
    this.setState({ helpCollapsed: collapsed });
  };

  setChromeCollapsed = async (collapsed: boolean): Promise<void> => {
    await SetChromeCollapsed(collapsed);
    this.setState({ chromeCollapsed: collapsed });
  };

  setDetailCollapsed = async (collapsed: boolean): Promise<void> => {
    await this.updatePreferences({ detailCollapsed: collapsed });
    this.setState({ detailCollapsed: collapsed });
  };

  setFontScale = async (scale: number): Promise<void> => {
    // Clamp scale to valid range (0.6 to 1.4) and ensure single decimal precision
    let clampedScale = Math.max(0.6, Math.min(1.4, scale));
    clampedScale = Math.round(clampedScale * 10) / 10; // Ensure single decimal precision
    await SetFontScale(clampedScale);
    await this.updatePreferences({ fontScale: clampedScale });
    this.setState({ fontScale: clampedScale });
  };

  setShowFieldTypes = async (enabled: boolean): Promise<void> => {
    await this.updatePreferences({ showFieldTypes: enabled });
    this.setState({ showFieldTypes: enabled });
  };

  get isDarkMode(): boolean {
    return this.state.lastTheme === 'dark';
  }
}

const preferencesStore = new PreferencesStore();

if (
  typeof window !== 'undefined' &&
  typeof import.meta.env.VITEST === 'undefined'
) {
  setTimeout(() => {
    preferencesStore.initialize();
  }, 0);
}

export const usePreferences = (): UsePreferencesReturn => {
  return useSyncExternalStore(
    preferencesStore.subscribe,
    preferencesStore.getSnapshot,
  );
};
