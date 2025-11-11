import { useCallback, useMemo } from 'react';

import { types } from '@models';

import { useActiveProject } from './useActiveProject';

export type DataFacet = types.DataFacet;

export interface DataFacetConfig {
  id: DataFacet;
  label: string;
  dividerBefore?: boolean;
  canClose?: boolean;
}

export interface UseActiveFacetReturn {
  activeFacet: DataFacet;
  setActiveFacet: (facet: DataFacet) => void;
  availableFacets: DataFacetConfig[];
  getFacetConfig: (facet: DataFacet) => DataFacetConfig | undefined;
  isFacetActive: (facet: DataFacet) => boolean;
  getDefaultFacet: () => DataFacet;
  getCurrentDataFacet: () => types.DataFacet;
}

export interface UseActiveFacetParams {
  viewRoute: string;
  facets: DataFacetConfig[];
}

/**
 * Hook for managing active data facets in views (using focused hooks)
 *
 * This hook provides a clean API for:
 * - Managing the currently active facet in a view
 * - Persisting facet selection to user preferences via useActiveProject
 * - Providing facet configuration and metadata
 * - Backward compatibility with existing DataFacet usage
 *
 * @param params Configuration for the hook
 * @returns Hook interface for facet management
 */
export const useActiveFacet = ({
  viewRoute,
  facets,
}: UseActiveFacetParams): UseActiveFacetReturn => {
  const { getLastFacet, setLastFacet, lastFacetMap } = useActiveProject();

  const getDefaultFacet = useCallback((): DataFacet => {
    const firstFacet = facets[0];
    // TODO: BOGUS - SHOULD WE FAIL MISERABLY HERE. THERE SHOULD ALWAYS BE A FIRST FACET
    return firstFacet ? firstFacet.id : types.DataFacet.DASHBOARD;
  }, [facets]);

  const activeFacet = useMemo((): DataFacet => {
    const saved = getLastFacet(viewRoute);

    // Check if saved facet is valid for this view
    const isValidFacet = facets.some((facet) => facet.id === saved);

    return isValidFacet ? (saved as DataFacet) : getDefaultFacet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLastFacet, viewRoute, facets, getDefaultFacet, lastFacetMap]);

  const setActiveFacet = useCallback(
    async (facet: DataFacet): Promise<void> => {
      await setLastFacet(viewRoute, facet);
    },
    [setLastFacet, viewRoute],
  );

  const getFacetConfig = useCallback(
    (facet: DataFacet): DataFacetConfig | undefined => {
      return facets.find((f) => f.id === facet);
    },
    [facets],
  );

  const isFacetActive = useCallback(
    (facet: DataFacet): boolean => {
      return activeFacet === facet;
    },
    [activeFacet],
  );

  const getCurrentDataFacet = useCallback((): types.DataFacet => {
    return activeFacet;
  }, [activeFacet]);

  return {
    activeFacet,
    setActiveFacet,
    availableFacets: facets,
    getFacetConfig,
    isFacetActive,
    getDefaultFacet,
    getCurrentDataFacet,
  };
};
