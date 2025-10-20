import { useCallback, useMemo, useSyncExternalStore } from 'react';

import { GetProjectViewState, SetProjectViewState } from '@app';
import { model, project, types } from '@models';
import { LogError } from '@utils';

export const getItemKey = (item: model.DalleDress | null): string => {
  if (!item) return '';
  return `${item.original}:${item.series || ''}`;
};

interface GalleryState {
  selectedKey: string | null;
  orig: string | null;
  series: string | null;
  galleryItems: model.DalleDress[];
  groupedBySeries: Record<string, model.DalleDress[]>;
  groupedByAddress: Record<string, model.DalleDress[]>;
  sortMode: 'series' | 'address';
  columns: number;
  hydrated: boolean;
}

const initial: GalleryState = {
  selectedKey: null,
  orig: null,
  series: null,
  galleryItems: [],
  groupedBySeries: {},
  groupedByAddress: {},
  sortMode: 'series',
  columns: 6,
  hydrated: false,
};

class GalleryStore {
  private state: GalleryState = { ...initial };
  private listeners = new Set<() => void>();
  private setState(updates: Partial<GalleryState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): GalleryState => this.state;

  setSelection(key: string | null, viewStateKey: project.ViewStateKey) {
    if (!key) {
      this.setState({ selectedKey: null, orig: null, series: null });
    } else {
      const found = this.state.galleryItems.find((i) => getItemKey(i) === key);
      if (found) {
        this.setState({
          selectedKey: key,
          orig: found.original,
          series: found.series,
        });
      }
    }

    // Always persist state since viewStateKey is required
    this.persistState(viewStateKey).catch((e) =>
      LogError('gallery:setSelection:persist:' + String(e)),
    );
  }

  setSortMode(mode: 'series' | 'address', viewStateKey: project.ViewStateKey) {
    this.setState({ sortMode: mode });

    // Always persist state since viewStateKey is required
    this.persistState(viewStateKey).catch((e) =>
      LogError('gallery:setSortMode:persist:' + String(e)),
    );
  }

  setColumns(count: number, viewStateKey: project.ViewStateKey) {
    this.setState({ columns: count });

    // Always persist state since viewStateKey is required
    this.persistState(viewStateKey).catch((e) =>
      LogError('gallery:setColumns:persist:' + String(e)),
    );
  }

  clear(viewStateKey: project.ViewStateKey) {
    this.setState({ ...initial });

    // Always persist cleared state since viewStateKey is required
    this.persistState(viewStateKey).catch((e) =>
      LogError('gallery:clear:persist:' + String(e)),
    );
  }

  ingest(items: model.DalleDress[] | null) {
    const list = items ? [...items] : [];
    const groupedBySeries: Record<string, model.DalleDress[]> = {};
    const groupedByAddress: Record<string, model.DalleDress[]> = {};
    for (const it of list) {
      const sKey = it.series || '';
      if (!groupedBySeries[sKey]) groupedBySeries[sKey] = [];
      groupedBySeries[sKey].push(it);
      const aKey = it.original || '';
      if (!groupedByAddress[aKey]) groupedByAddress[aKey] = [];
      groupedByAddress[aKey].push(it);
    }
    this.setState({ galleryItems: list, groupedBySeries, groupedByAddress });
  }

  private async persistToViewState(
    viewStateKey: project.ViewStateKey,
    state: {
      selectedItemKey: string | null;
      sortMode: 'series' | 'address';
      columns: number;
    },
  ) {
    try {
      const viewStates = await GetProjectViewState(viewStateKey.viewName);
      const facetName = viewStateKey.facetName;
      const existing = viewStates[facetName] || {
        sorting: {},
        filtering: {},
        other: {},
      };
      const updated = {
        ...existing,
        other: {
          ...(existing.other || {}),
          gallery: state,
        },
      };
      await SetProjectViewState(viewStateKey.viewName, {
        ...viewStates,
        [facetName]: updated,
      });
    } catch (e) {
      LogError('gallery:persistState:' + String(e));
    }
  }

  private async loadFromViewState(viewStateKey: project.ViewStateKey) {
    try {
      const viewStates = await GetProjectViewState(viewStateKey.viewName);
      const facetState = viewStates[viewStateKey.facetName];
      const other = facetState?.other || {};
      const gallery = (other as Record<string, unknown>).gallery as
        | Record<string, unknown>
        | undefined;

      return {
        selectedItemKey: gallery?.selectedItemKey as string | null | undefined,
        sortMode: gallery?.sortMode as 'series' | 'address' | undefined,
        columns:
          typeof gallery?.columns === 'number' ? gallery.columns : undefined,
      };
    } catch (e) {
      LogError('gallery:loadState:' + String(e));
      return {};
    }
  }

  async ensureHydrated(viewStateKey: project.ViewStateKey) {
    if (this.state.hydrated) return;

    try {
      // Try to load from current facet first
      let persistedState = await this.loadFromViewState(viewStateKey);

      // If no data found and we're not already on gallery facet, try gallery facet
      if (
        !persistedState.sortMode &&
        viewStateKey.facetName !== types.DataFacet.GALLERY
      ) {
        const galleryKey = {
          ...viewStateKey,
          facetName: types.DataFacet.GALLERY as types.DataFacet,
        };
        persistedState = await this.loadFromViewState(galleryKey);
      }

      // Apply persisted state with fallbacks to defaults
      this.setState({
        sortMode: persistedState.sortMode || 'series',
        columns: persistedState.columns || 6,
        selectedKey: persistedState.selectedItemKey || null,
        hydrated: true,
      });
    } catch (e) {
      LogError('gallery:ensureHydrated:' + String(e));
      this.setState({ hydrated: true });
    }
  }

  private async persistState(viewStateKey: project.ViewStateKey) {
    const state = {
      selectedItemKey: this.state.selectedKey,
      sortMode: this.state.sortMode,
      columns: this.state.columns,
    };

    // Dual-facet persistence strategy: save to both gallery and generator facets
    // Do this sequentially to avoid race conditions
    const galleryKey = {
      ...viewStateKey,
      facetName: types.DataFacet.GALLERY as types.DataFacet,
    };
    const generatorKey = {
      ...viewStateKey,
      facetName: types.DataFacet.GENERATOR as types.DataFacet,
    };

    // Save to gallery facet first
    await this.persistToViewState(galleryKey, state);
    // Then save to generator facet (will get fresh state including gallery update)
    await this.persistToViewState(generatorKey, state);
  }
}

const store = new GalleryStore();

export const useGalleryStore = () => {
  const sel = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const getSelectionKey = useCallback(() => sel.selectedKey, [sel.selectedKey]);
  const getSelectedItem = useCallback(() => {
    const k = sel.selectedKey;
    if (!k) return null;
    return sel.galleryItems.find((i) => getItemKey(i) === k) || null;
  }, [sel.selectedKey, sel.galleryItems]);
  const setSelection = useCallback(
    (key: string | null, viewStateKey: project.ViewStateKey) =>
      store.setSelection(key, viewStateKey),
    [],
  );
  const clearSelection = useCallback(
    (viewStateKey: project.ViewStateKey) => store.clear(viewStateKey),
    [],
  );
  const ingestItems = useCallback(
    (items: model.DalleDress[] | null) => store.ingest(items),
    [],
  );

  // New layout state accessors
  const setSortMode = useCallback(
    (mode: 'series' | 'address', viewStateKey: project.ViewStateKey) =>
      store.setSortMode(mode, viewStateKey),
    [],
  );
  const setColumns = useCallback(
    (count: number, viewStateKey: project.ViewStateKey) =>
      store.setColumns(count, viewStateKey),
    [],
  );
  const ensureHydrated = useCallback(
    (viewStateKey: project.ViewStateKey) => store.ensureHydrated(viewStateKey),
    [],
  );
  const useDerived = (sortMode: 'series' | 'address') => {
    const { groupedBySeries, groupedByAddress } = sel;
    const groupNames = useMemo(() => {
      if (sortMode === 'series')
        return Object.keys(groupedBySeries).sort((a, b) => a.localeCompare(b));
      return Object.keys(groupedByAddress).sort((a, b) => a.localeCompare(b));
    }, [sortMode, groupedBySeries, groupedByAddress]);
    const groupedItems = useMemo(() => {
      if (sortMode === 'series') return groupedBySeries;
      return groupedByAddress;
    }, [sortMode, groupedBySeries, groupedByAddress]);
    return { groupNames, groupedItems };
  };
  const handleKey = useCallback(
    (
      e: React.KeyboardEvent<HTMLDivElement>,
      items: model.DalleDress[],
      viewStateKey: project.ViewStateKey,
      columns?: number,
      onDoubleClick?: (item: model.DalleDress) => void,
      groupNames?: Array<string>,
      groupedItems?: Record<string, model.DalleDress[]>,
    ) => {
      if (!items.length) return;
      const selectedKey = getSelectionKey();
      if (!selectedKey) return;

      // Handle +/- keys for column adjustment
      if (e.key === '+' || e.key === '=' || e.key === 'Equal') {
        e.preventDefault();
        const currentColumns = columns || 6;
        if (currentColumns < 12) {
          store.setColumns(currentColumns + 1, viewStateKey);
        }
        return;
      } else if (e.key === '-' || e.key === 'Minus') {
        e.preventDefault();
        const currentColumns = columns || 6;
        if (currentColumns > 1) {
          store.setColumns(currentColumns - 1, viewStateKey);
        }
        return;
      }

      let nextIdx = items.findIndex((g) => getItemKey(g) === selectedKey);
      let groupIdx = 0,
        itemIdxInGroup = 0;
      if (groupNames && groupedItems) {
        let found = false;
        for (let g = 0; g < groupNames.length; g++) {
          const groupKey = groupNames[g] ?? '';
          const group: Array<model.DalleDress> = groupedItems[groupKey] || [];
          const idx = group.findIndex(
            (i: model.DalleDress) => getItemKey(i) === selectedKey,
          );
          if (idx !== -1) {
            groupIdx = g;
            itemIdxInGroup = idx;
            found = true;
            break;
          }
        }
        if (!found) {
          groupIdx = 0;
          itemIdxInGroup = 0;
        }
      }

      // Handle Enter key
      if (e.key === 'Enter' && onDoubleClick) {
        e.preventDefault();
        e.stopPropagation();
        const item = items.find((g) => getItemKey(g) === selectedKey);
        if (item) onDoubleClick(item);
        return;
      }

      // Grid-based navigation when we have columns and grouping
      if (columns && groupNames && groupedItems) {
        const groupKey = groupNames[groupIdx] ?? '';
        const group: Array<model.DalleDress> = groupedItems[groupKey] || [];
        const row = Math.floor(itemIdxInGroup / columns);
        const col = itemIdxInGroup % columns;
        let targetGroupIdx = groupIdx;
        let targetItemIdxInGroup: number | null = null;

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          // Move one position to the right within the current group
          if (itemIdxInGroup < group.length - 1) {
            targetItemIdxInGroup = itemIdxInGroup + 1;
          } else if (groupIdx < groupNames.length - 1) {
            // Move to first item of next group
            targetGroupIdx = groupIdx + 1;
            targetItemIdxInGroup = 0;
          } else {
            // Wrap to first item of first group
            targetGroupIdx = 0;
            targetItemIdxInGroup = 0;
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          // Move one position to the left within the current group
          if (itemIdxInGroup > 0) {
            targetItemIdxInGroup = itemIdxInGroup - 1;
          } else if (groupIdx > 0) {
            // Move to last item of previous group
            targetGroupIdx = groupIdx - 1;
            const prevGroupKey = groupNames[targetGroupIdx] ?? '';
            const prevGroup: Array<model.DalleDress> =
              groupedItems[prevGroupKey] || [];
            targetItemIdxInGroup = prevGroup.length - 1;
          } else {
            // Wrap to last item of last group
            targetGroupIdx = groupNames.length - 1;
            const lastGroupKey = groupNames[targetGroupIdx] ?? '';
            const lastGroup: Array<model.DalleDress> =
              groupedItems[lastGroupKey] || [];
            targetItemIdxInGroup = lastGroup.length - 1;
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          let targetRow = row + 1;
          let totalRows = Math.ceil(group.length / columns);
          if (targetRow < totalRows) {
            // Stay in current group, move down one row
            const start = targetRow * columns;
            const end = Math.min(start + columns, group.length);
            const rowLength = end - start;
            const clampedCol = Math.min(col, rowLength - 1);
            targetItemIdxInGroup = start + clampedCol;
          } else if (groupIdx < groupNames.length - 1) {
            // Move to next group, first row
            targetGroupIdx = groupIdx + 1;
            const nextGroupKey = groupNames[targetGroupIdx] ?? '';
            const nextGroup: Array<model.DalleDress> =
              groupedItems[nextGroupKey] || [];
            const end = Math.min(columns, nextGroup.length);
            const rowLength = end;
            const clampedCol = Math.min(col, rowLength - 1);
            targetItemIdxInGroup = clampedCol;
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          let targetRow = row - 1;
          if (targetRow >= 0) {
            // Stay in current group, move up one row
            const start = targetRow * columns;
            const end = Math.min(start + columns, group.length);
            const rowLength = end - start;
            const clampedCol = Math.min(col, rowLength - 1);
            targetItemIdxInGroup = start + clampedCol;
          } else if (groupIdx > 0) {
            // Move to previous group, last row
            targetGroupIdx = groupIdx - 1;
            const prevGroupKey = groupNames[targetGroupIdx] ?? '';
            const prevGroup: Array<model.DalleDress> =
              groupedItems[prevGroupKey] || [];
            const prevTotalRows = Math.ceil(prevGroup.length / columns);
            const start = (prevTotalRows - 1) * columns;
            const end = prevGroup.length;
            const rowLength = end - start;
            const clampedCol = Math.min(col, rowLength - 1);
            targetItemIdxInGroup = start + clampedCol;
          }
        } else if (e.key === 'Home') {
          e.preventDefault();
          // Go to first item of first group
          targetGroupIdx = 0;
          targetItemIdxInGroup = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          // Go to last item of last group
          targetGroupIdx = groupNames.length - 1;
          const lastGroupKey = groupNames[targetGroupIdx] ?? '';
          const lastGroup: Array<model.DalleDress> =
            groupedItems[lastGroupKey] || [];
          targetItemIdxInGroup = lastGroup.length - 1;
        }

        // Apply the navigation if we found a target
        if (targetItemIdxInGroup !== null) {
          const targetGroupKey = groupNames[targetGroupIdx] ?? '';
          const targetGroup: Array<model.DalleDress> =
            groupedItems[targetGroupKey] || [];
          const targetItem = targetGroup[targetItemIdxInGroup] ?? null;
          if (targetItem) {
            setSelection(getItemKey(targetItem), viewStateKey);
          }
        }
      } else {
        // Fallback to simple linear navigation when no grid layout
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextIdx = (nextIdx + 1) % items.length;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIdx = (nextIdx - 1 + items.length) % items.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIdx = items.length - 1;
        } else {
          return;
        }

        const next = items[nextIdx];
        if (next) {
          setSelection(getItemKey(next), viewStateKey);
        }
      }
    },
    [getSelectionKey, setSelection],
  );
  return {
    orig: sel.orig,
    series: sel.series,
    galleryItems: sel.galleryItems,
    // Layout state
    sortMode: sel.sortMode,
    columns: sel.columns,
    hydrated: sel.hydrated,
    // Methods
    getSelectionKey,
    getSelectedItem,
    setSelection,
    clearSelection,
    ingestItems,
    setSortMode,
    setColumns,
    ensureHydrated,
    useDerived,
    handleKey,
  };
};
