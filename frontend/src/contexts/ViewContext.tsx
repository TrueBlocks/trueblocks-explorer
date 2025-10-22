import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  GetProjectViewState,
  GetRegisteredViews,
  SetProjectViewState,
} from '@app';
import { project, sdk, types } from '@models';
import { LogError, createEmptySortSpec } from '@utils';

import { viewStateKeyToString } from '.';

const EMPTY_SORT = createEmptySortSpec();

// Pagination interfaces
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

// Navigation context for calculating post-deletion targets
export interface NavigationContext {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  deletingRowIndex: number;
  deletingRowId: string;
  currentPageData: Record<string, unknown>[];

  isOnlyRowOnPage: boolean;
  isFirstRowOnPage: boolean;
  isLastRowOnPage: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Navigation target for post-action positioning
export interface NavigationTarget {
  type: 'page' | 'row' | 'none';
  page?: number;
  rowId?: string;
}

// Navigation strategy function type
export type NavigationStrategy = (
  context: NavigationContext,
) => NavigationTarget | null;

export interface ViewSortState {
  [key: string]: sdk.SortSpec | null;
}

export interface ViewFilterState {
  [key: string]: string;
}

export interface ViewPaginationState {
  [key: string]: PaginationState;
}

export interface ViewRowActionState {
  [key: string]: types.RowActionPayload | null;
}

// Create stable reference for initial state to prevent new object creation
export const initialPaginationState: PaginationState = Object.freeze({
  currentPage: 0,
  pageSize: 15,
  totalItems: 0,
});

interface ViewContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  getPagination: (viewStateKey: project.ViewStateKey) => PaginationState;
  updatePagination: (
    viewStateKey: project.ViewStateKey,
    changes: Partial<PaginationState>,
  ) => void;
  getSorting: (viewStateKey: project.ViewStateKey) => sdk.SortSpec | null;
  updateSorting: (
    viewStateKey: project.ViewStateKey,
    sort: sdk.SortSpec | null,
  ) => void;
  getFiltering: (viewStateKey: project.ViewStateKey) => string;
  updateFiltering: (viewStateKey: project.ViewStateKey, filter: string) => void;
  getPendingRowAction: (
    viewStateKey: project.ViewStateKey,
  ) => types.RowActionPayload | null;
  setPendingRowAction: (
    viewStateKey: project.ViewStateKey,
    navigation: types.RowActionPayload | null,
  ) => void;
  restoreProjectFilterStates: () => Promise<void>;
}

export const ViewContext = createContext<ViewContextType>({
  currentView: '',
  setCurrentView: () => {},
  getPagination: () => initialPaginationState,
  updatePagination: () => {},
  getSorting: () => null,
  updateSorting: () => {},
  getFiltering: () => '',
  updateFiltering: () => {},
  getPendingRowAction: () => null,
  setPendingRowAction: () => {},
  restoreProjectFilterStates: async () => {},
});

export const ViewContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState('');
  const [viewPagination, setViewPagination] = useState<ViewPaginationState>({});
  const [viewSorting, setViewSorting] = useState<ViewSortState>({});
  const [viewFiltering, setViewFiltering] = useState<ViewFilterState>({});
  const [viewRowAction, setViewRowAction] = useState<ViewRowActionState>({});

  const getPagination = useCallback(
    (viewStateKey: project.ViewStateKey) => {
      const key = viewStateKeyToString(viewStateKey);
      return viewPagination[key] || initialPaginationState;
    },
    [viewPagination],
  );

  const updatePagination = useCallback(
    (viewStateKey: project.ViewStateKey, changes: Partial<PaginationState>) => {
      setViewPagination((prev) => {
        const key = viewStateKeyToString(viewStateKey);
        const currentPagination = prev[key] || { ...initialPaginationState };
        return {
          ...prev,
          [key]: {
            ...currentPagination,
            ...changes,
          },
        };
      });
    },
    [],
  );

  const getSorting = useCallback(
    (viewStateKey: project.ViewStateKey) => {
      const key = viewStateKeyToString(viewStateKey);
      return viewSorting[key] || null;
    },
    [viewSorting],
  );

  const updateSorting = useCallback(
    (viewStateKey: project.ViewStateKey, sort: sdk.SortSpec | null) => {
      setViewSorting((prev) => {
        const key = viewStateKeyToString(viewStateKey);
        return {
          ...prev,
          [key]: sort,
        };
      });

      // Fire-and-forget background persistence
      (async () => {
        try {
          const viewStates = await GetProjectViewState(viewStateKey.viewName);
          const facetName = viewStateKey.facetName;

          const existingState = viewStates[facetName] || {
            sorting: {},
            filtering: {},
            other: {},
          };

          const updatedState: project.FilterState = {
            ...existingState,
            sorting: {
              ...(existingState.sorting || {}),
              sortSpec: sort,
            },
          };

          const updatedViewStates = {
            ...viewStates,
            [facetName]: updatedState,
          };

          await SetProjectViewState(viewStateKey.viewName, updatedViewStates);
        } catch (error) {
          LogError(`Failed to persist sorting state to backend: ${error}`);
        }
      })();
    },
    [],
  );

  const getFiltering = useCallback(
    (viewStateKey: project.ViewStateKey) => {
      const key = viewStateKeyToString(viewStateKey);
      return viewFiltering[key] || '';
    },
    [viewFiltering],
  );

  const updateFiltering = useCallback(
    (viewStateKey: project.ViewStateKey, filter: string) => {
      const key = viewStateKeyToString(viewStateKey);
      setViewFiltering((prev) => ({
        ...prev,
        [key]: filter,
      }));

      // Fire-and-forget background persistence
      (async () => {
        try {
          const viewStates = await GetProjectViewState(viewStateKey.viewName);
          const facetName = viewStateKey.facetName;

          const existingState = viewStates[facetName] || {
            sorting: {},
            filtering: {},
            other: {},
          };

          const updatedState: project.FilterState = {
            ...existingState,
            filtering: {
              ...(existingState.filtering || {}),
              searchTerm: filter,
            },
          };

          const updatedViewStates = {
            ...viewStates,
            [facetName]: updatedState,
          };

          await SetProjectViewState(viewStateKey.viewName, updatedViewStates);
        } catch (error) {
          LogError(`Failed to persist filtering state to backend: ${error}`);
        }
      })();
    },
    [],
  );

  const getPendingRowAction = useCallback(
    (viewStateKey: project.ViewStateKey) => {
      const key = viewStateKeyToString(viewStateKey);
      return viewRowAction[key] || null;
    },
    [viewRowAction],
  );

  const setPendingRowAction = useCallback(
    (
      viewStateKey: project.ViewStateKey,
      navigation: types.RowActionPayload | null,
    ) => {
      const key = viewStateKeyToString(viewStateKey);
      setViewRowAction((prev) => ({
        ...prev,
        [key]: navigation,
      }));
    },
    [],
  );

  const restoreProjectFilterStates = useCallback(async () => {
    try {
      const viewNames = await GetRegisteredViews();

      for (const viewName of viewNames) {
        try {
          const viewStates = await GetProjectViewState(viewName);

          Object.entries(viewStates).forEach(([facetName, filterState]) => {
            if (filterState.sorting?.sortSpec) {
              const viewStateKey: project.ViewStateKey = {
                viewName,
                facetName: facetName as types.DataFacet,
              };
              const key = viewStateKeyToString(viewStateKey);

              setViewSorting((prev) => ({
                ...prev,
                [key]: filterState.sorting?.sortSpec || null,
              }));
            }

            if (filterState.filtering?.searchTerm) {
              const viewStateKey: project.ViewStateKey = {
                viewName,
                facetName: facetName as types.DataFacet,
              };
              const key = viewStateKeyToString(viewStateKey);

              setViewFiltering((prev) => ({
                ...prev,
                [key]: filterState.filtering?.searchTerm || '',
              }));
            }
          });
        } catch (viewError) {
          LogError(`No stored state for view ${viewName}: ${viewError}`);
        }
      }

      setViewPagination({});
    } catch (error) {
      LogError(`Failed to restore project filter states: ${error}`);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      currentView,
      setCurrentView,
      getPagination,
      updatePagination,
      getSorting,
      updateSorting,
      getFiltering,
      updateFiltering,
      getPendingRowAction,
      setPendingRowAction,
      restoreProjectFilterStates,
    }),
    [
      currentView,
      setCurrentView,
      getPagination,
      updatePagination,
      getSorting,
      updateSorting,
      getFiltering,
      updateFiltering,
      getPendingRowAction,
      setPendingRowAction,
      restoreProjectFilterStates,
    ],
  );

  return (
    <ViewContext.Provider value={contextValue}>{children}</ViewContext.Provider>
  );
};

export const useViewContext = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useViewContext must be used within a ViewContextProvider');
  }
  return context;
};

// Hook for sorting state (per-facet)
// Uses full ViewStateKey (viewName + facetName) to scope sorting per facet
export const useSorting = (viewStateKey: project.ViewStateKey) => {
  const { getSorting, updateSorting } = useViewContext();

  const setSorting = useCallback(
    (sort: sdk.SortSpec | null) => {
      updateSorting(viewStateKey, sort);
    },
    [viewStateKey, updateSorting],
  );

  // Get the sort value, but never return null - instead return a default empty SortSpec
  const sortValue = getSorting(viewStateKey);
  const sort = sortValue || EMPTY_SORT;

  return useMemo(() => ({ sort, setSorting }), [sort, setSorting]);
};

// Hook for filtering state (per-facet)
// Uses full ViewStateKey (viewName + facetName) to scope filtering per facet
export const useFiltering = (viewStateKey: project.ViewStateKey) => {
  const { getFiltering, updateFiltering } = useViewContext();

  const setFiltering = useCallback(
    (filter: string) => {
      updateFiltering(viewStateKey, filter);
    },
    [viewStateKey, updateFiltering],
  );

  const filter = getFiltering(viewStateKey);

  return useMemo(() => ({ filter, setFiltering }), [filter, setFiltering]);
};
