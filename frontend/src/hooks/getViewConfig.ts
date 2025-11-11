import {
  GetAbisConfig,
  GetChunksConfig,
  GetComparitoorConfig,
  GetContractsConfig,
  GetDressesConfig,
  GetExportsConfig,
  GetMonitorsConfig,
  GetNamesConfig,
  GetProjectsConfig,
  GetStatusConfig,
} from '@app';
import { types } from '@models';
import { LogError } from '@utils';

// Global cache for configs - they never change during app run
const configCache = new Map<string, types.ViewConfig>();

// Track initialization state
let initializationPromise: Promise<void> | null = null;
let isInitialized = false;

/**
 * Initialize all ViewConfigs at app startup.
 * Loads all 7 view configurations in parallel.
 * This should be called once during app initialization.
 */
export async function initializeAllViewConfigs(): Promise<{
  isLoading: boolean;
}> {
  // If already initialized, return not loading
  if (isInitialized) {
    return { isLoading: !isInitialized };
  }

  // If currently initializing, return loading state
  if (initializationPromise) {
    await initializationPromise;
    return { isLoading: !isInitialized };
  }

  initializationPromise = (async () => {
    try {
      // Create base payload - configs don't depend on specific values
      const basePayload: Omit<types.Payload, 'collection'> = {
        dataFacet: types.DataFacet.ALL,
        activeChain: 'mainnet',
        activeAddress: '0x0000000000000000000000000000000000000000',
        activePeriod: types.Period.BLOCKLY,
      };

      // Define all view configs to load
      const viewConfigs = [
        { name: 'projects', getter: GetProjectsConfig },
        { name: 'exports', getter: GetExportsConfig },
        { name: 'monitors', getter: GetMonitorsConfig },
        { name: 'abis', getter: GetAbisConfig },
        { name: 'names', getter: GetNamesConfig },
        { name: 'chunks', getter: GetChunksConfig },
        { name: 'contracts', getter: GetContractsConfig },
        { name: 'status', getter: GetStatusConfig },
        { name: 'dresses', getter: GetDressesConfig },
        { name: 'comparitoor', getter: GetComparitoorConfig },
      ];

      // Load all configs in parallel
      const configPromises = viewConfigs.map(async ({ name, getter }) => {
        const payload = { ...basePayload, collection: name };
        const config = await getter(payload);
        configCache.set(name, config);

        return { name, config };
      });

      // Wait for all configs to load
      await Promise.all(configPromises);

      isInitialized = true;
    } catch (error) {
      LogError(`ViewConfig initialization failed: ${error}`);
      // Reset state so initialization can be retried
      initializationPromise = null;
      throw error;
    }
  })();

  await initializationPromise;
  return { isLoading: !isInitialized };
}

/**
 * Get ViewConfig synchronously (after initialization).
 * This function assumes initializeAllViewConfigs() has been called.
 *
 * @param viewName - Name of the view
 * @returns ViewConfig - guaranteed to exist
 * @throws Error if not initialized or view not found
 */
export function getViewConfig(viewName: string): types.ViewConfig {
  if (!isInitialized) {
    throw new Error(
      `ViewConfigs not initialized. Call initializeAllViewConfigs() during app startup.`,
    );
  }

  const config = configCache.get(viewName);
  if (!config) {
    throw new Error(`ViewConfig not found for view: ${viewName}`);
  }

  return config;
}

/**
 * Hook version that returns config synchronously (after initialization).
 * This replaces the old useViewConfig hook but with loading state.
 */
export function useViewConfig({ viewName }: { viewName: string }): {
  config: types.ViewConfig;
  isLoading: boolean;
} {
  // Return loading state based on initialization status
  const isLoading = !isInitialized;

  // Just return the cached config - no loading state needed!
  const config = getViewConfig(viewName);
  validateViewConfigOnce(config);
  return { config, isLoading };
}

/**
 * Check if ViewConfigs are ready.
 */
export function areViewConfigsReady(): boolean {
  return isInitialized;
}

// One-time runtime validation of facet ordering coherence
const validatedViews = new Set<string>();
function validateViewConfigOnce(cfg: types.ViewConfig) {
  if (!cfg || validatedViews.has(cfg.viewName)) return;
  validatedViews.add(cfg.viewName);
  const errs: string[] = [];
  const order = cfg.facetOrder || [];
  if (!order.length) {
    errs.push('empty facetOrder');
  }
  const seen = new Set<string>();
  for (const id of order) {
    if (seen.has(id)) errs.push('duplicate ' + id);
    seen.add(id);
    if (!cfg.facets[id]) errs.push('unknown facet ' + id);
  }
  for (const key of Object.keys(cfg.facets)) {
    if (!seen.has(key)) errs.push('missing in facetOrder ' + key);
  }
  if (errs.length) {
    LogError(
      '[FACET_ORDER_VALIDATION ' + cfg.viewName + '] ' + errs.join('; '),
    );
  }
}

// refreshViewConfig - refresh a specific ViewConfig (for dynamic content like Projects).
export async function refreshViewConfig(viewName: string): Promise<void> {
  if (!isInitialized) {
    LogError(`Cannot refresh ViewConfig before initialization: ${viewName}`);
    return;
  }

  try {
    // Create base payload
    const basePayload: Omit<types.Payload, 'collection'> = {
      dataFacet: types.DataFacet.ALL,
      activeChain: 'mainnet',
      activeAddress: '0x0000000000000000000000000000000000000000',
      activePeriod: types.Period.BLOCKLY,
    };

    const payload = { ...basePayload, collection: viewName };

    // Get the appropriate config getter
    let getter;
    switch (viewName) {
      case 'abis':
        getter = GetAbisConfig;
        break;
      case 'chunks':
        getter = GetChunksConfig;
        break;
      case 'comparitoor':
        getter = GetComparitoorConfig;
        break;
      case 'contracts':
        getter = GetContractsConfig;
        break;
      case 'dresses':
        getter = GetDressesConfig;
        break;
      case 'exports':
        getter = GetExportsConfig;
        break;
      case 'monitors':
        getter = GetMonitorsConfig;
        break;
      case 'names':
        getter = GetNamesConfig;
        break;
      case 'projects':
        getter = GetProjectsConfig;
        break;
      case 'status':
        getter = GetStatusConfig;
        break;
      default:
        LogError(`Unknown view name for refresh: ${viewName}`);
        return;
    }

    // Fetch fresh config and update cache
    const config = await getter(payload);
    configCache.set(viewName, config);
  } catch (error) {
    LogError(`Failed to refresh ViewConfig for ${viewName}: ${error}`);
  }
}
