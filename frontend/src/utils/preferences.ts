import { GetDefaultAppPreferences } from '@app';
import { preferences } from '@models';

let cachedDefaults: preferences.AppPreferences | null = null;

export async function initializePreferencesDefaults(): Promise<void> {
  if (!cachedDefaults) {
    cachedDefaults = await GetDefaultAppPreferences();
  }
}

function getDefaults(): preferences.AppPreferences {
  if (cachedDefaults) {
    return cachedDefaults;
  }

  return preferences.AppPreferences.createFrom({
    version: '1.0',
    name: 'TrueBlocks-DalleDress',
    lastTheme: 'dark',
    lastLanguage: 'en',
    lastProject: '',
    helpCollapsed: false,
    menuCollapsed: false,
    detailCollapsed: true,
    debugCollapsed: true,
    recentProjects: [],
    silencedDialogs: {},
    bounds: {
      x: 0,
      y: 0,
      width: 1200,
      height: 800,
    },
  });
}

export function createSafeAppPreferences(
  source: Partial<preferences.AppPreferences> = {},
  updates: Partial<preferences.AppPreferences> = {},
): preferences.AppPreferences {
  const defaults = getDefaults();
  const safeSource = {
    ...defaults,
    ...source,
    ...updates,
  };

  // Ensure nested objects are properly initialized
  if (!safeSource.silencedDialogs) {
    safeSource.silencedDialogs = {};
  }

  if (!safeSource.recentProjects) {
    safeSource.recentProjects = [];
  }

  if (!safeSource.bounds) {
    safeSource.bounds = defaults.bounds || {
      x: 0,
      y: 0,
      width: 1200,
      height: 800,
    };
  }

  // Now it's safe to call the auto-generated createFrom method
  return preferences.AppPreferences.createFrom(safeSource);
}

/**
 * Safely updates AppPreferences by merging current preferences with updates.
 * This function ensures all fields have proper defaults before saving.
 *
 * @param currentPrefs - Current preferences from the backend
 * @param updates - Updates to apply
 * @returns A safely updated AppPreferences instance
 */
export function updateAppPreferencesSafely(
  currentPrefs: preferences.AppPreferences,
  updates: Partial<preferences.AppPreferences>,
): preferences.AppPreferences {
  return createSafeAppPreferences(currentPrefs, updates);
}
