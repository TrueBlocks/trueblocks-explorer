// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
// === SECTION 1: Imports & Dependencies ===
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GetDressesPage, Reload } from '@app';
import { DressesCrud } from '@app';
import { BaseTab, usePagination } from '@components';
import { Action, ConfirmModal, ExportFormatModal } from '@components';
import { createDetailPanel } from '@components';
import { useFiltering, useSorting } from '@contexts';
import {
  DataFacetConfig,
  buildFacetConfigs,
  useActions,
  useActiveFacet,
  useEvent,
  useFacetColumns,
  useFacetForm,
  usePayload,
  useSilencedDialog,
  useViewConfig,
} from '@hooks';
import { TabView } from '@layout';
import { Group, Stack } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { dalle, dresses, model } from '@models';
import { crud, msgs, project, types } from '@models';
import { Debugger, LogError, useErrorHandler } from '@utils';

import { assertRouteConsistency } from '../routes';
import { SeriesModal } from './components';
import { ROUTE } from './constants';
import { useSeriesModal } from './hooks/seriesModal';
import { renderers } from './renderers';
import { getItemKey, useGalleryStore } from './store/useGalleryStore';

export const Dresses = () => {
  // === SECTION 2: Hook Initialization ===
  const renderCnt = useRef(0);
  const createPayload = usePayload();
  // === SECTION 2.5: Initial ViewConfig Load ===
  const { config: viewConfig } = useViewConfig({ viewName: ROUTE });
  assertRouteConsistency(ROUTE, viewConfig);

  const facetsFromConfig: DataFacetConfig[] = useMemo(
    () => buildFacetConfigs(viewConfig),
    [viewConfig],
  );

  const activeFacetHook = useActiveFacet({
    facets: facetsFromConfig,
    viewRoute: ROUTE,
  });
  const { availableFacets, getCurrentDataFacet, setActiveFacet } =
    activeFacetHook;

  const [pageData, setPageData] = useState<dresses.DressesPage | null>(null);
  const viewStateKey = useMemo(
    (): project.ViewStateKey => ({
      viewName: ROUTE,
      facetName: getCurrentDataFacet(),
    }),
    [getCurrentDataFacet],
  );

  const { error, handleError, clearError } = useErrorHandler();
  const { pagination, setTotalItems, goToPage } = usePagination(viewStateKey);
  const { sort } = useSorting(viewStateKey);
  const { filter } = useFiltering(viewStateKey);

  // Check if series removal dialog is silenced
  const seriesRemoveSilencedDialog = useSilencedDialog('confirm.removeSeries');

  // Gallery store for selection management
  const galleryState = useGalleryStore();

  // === SECTION 3: Data Fetching ===
  const fetchData = useCallback(async () => {
    clearError();
    try {
      const result = await GetDressesPage(
        createPayload(getCurrentDataFacet()),
        pagination.currentPage * pagination.pageSize,
        pagination.pageSize,
        sort,
        filter,
      );
      setPageData(result);
      setTotalItems(result.totalItems || 0);
    } catch (err: unknown) {
      handleError(err, `Failed to fetch ${getCurrentDataFacet()}`);
    }
  }, [
    clearError,
    createPayload,
    getCurrentDataFacet,
    pagination.currentPage,
    pagination.pageSize,
    sort,
    filter,
    setTotalItems,
    handleError,
  ]);

  const currentData = useMemo(() => {
    if (!pageData) return [];
    const facet = getCurrentDataFacet();
    switch (facet) {
      case types.DataFacet.GENERATOR:
        return pageData.dalledress || [];
      case types.DataFacet.SERIES:
        return pageData.series || [];
      case types.DataFacet.DATABASES:
        return pageData.databases || [];
      case types.DataFacet.EVENTS:
        return pageData.logs || [];
      case types.DataFacet.GALLERY:
        return pageData.dalledress || [];
      default:
        LogError('[Dresses] unexpected facet=' + String(facet));
        return [];
    }
  }, [pageData, getCurrentDataFacet]);

  // === SECTION 4: Event Handling ===
  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (payload?.collection === ROUTE) {
        const eventDataFacet = payload.dataFacet;
        if (eventDataFacet === getCurrentDataFacet()) {
          fetchData();
        }
      }
    },
  );

  // Listen for active address/chain/period changes to refresh data
  useEvent(msgs.EventType.ADDRESS_CHANGED, fetchData);
  useEvent(msgs.EventType.CHAIN_CHANGED, fetchData);
  useEvent(msgs.EventType.PERIOD_CHANGED, fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReload = useCallback(async () => {
    clearError();
    try {
      await Reload(createPayload(getCurrentDataFacet()));
    } catch (err: unknown) {
      handleError(err, `Failed to reload ${getCurrentDataFacet()}`);
    }
  }, [clearError, getCurrentDataFacet, createPayload, handleError]);

  useHotkeys([['mod+r', handleReload]]);

  // === SECTION 5: Actions ===
  const { handlers, config, exportFormatModal, confirmModal } = useActions({
    collection: ROUTE,
    viewStateKey,
    pagination,
    goToPage,
    sort,
    filter,
    viewConfig,
    pageData,
    setPageData,
    setTotalItems,
    crudFunc: async (
      _payload: types.Payload,
      _op: crud.Operation,
      _item: unknown,
    ) => {
      if (getCurrentDataFacet() !== types.DataFacet.SERIES) {
        await DressesCrud(_payload, _op, _item as unknown as model.DalleDress);
      }
    },
    pageFunc: GetDressesPage,
    pageClass: dresses.DressesPage,
    updateItem: model.DalleDress.createFrom({}),
    createPayload,
    getCurrentDataFacet,
  });

  // State for custom series removal confirmation
  const [seriesRemoveConfirm, setSeriesRemoveConfirm] = useState<{
    opened: boolean;
    suffix: string;
  }>({ opened: false, suffix: '' });

  // Helper function to refresh gallery cache
  const refreshGalleryCache = useCallback(async () => {
    try {
      // Force gallery cache refresh by calling reload on gallery facet
      await Reload(createPayload(types.DataFacet.GALLERY));
    } catch {
      // TODO: handle error if needed
    }
  }, [createPayload]);

  // Helper function to handle selected series management
  const handleSelectedSeriesUpdate = useCallback(
    async (affectedSuffix: string, operation: crud.Operation) => {
      try {
        // Get currently selected dresses from gallery store
        const selectedItem = galleryState.getSelectedItem();
        if (!selectedItem) {
          return;
        }

        // Check if the selected dresses belongs to the affected series
        if (selectedItem.series !== affectedSuffix) {
          return;
        }

        // If selected dresses series was deleted or removed, select a reasonable alternative
        if (
          operation === crud.Operation.DELETE ||
          operation === crud.Operation.REMOVE
        ) {
          // Get all available dresseses from the gallery
          const allDresses = galleryState.galleryItems || [];

          // Find first dresses from a non-deleted series that isn't the affected one
          const availableDresses = allDresses.filter((d: model.DalleDress) => {
            const dressesSeries = pageData?.series?.find(
              (s) => s.suffix === d.series,
            );
            return (
              dressesSeries &&
              !dressesSeries.deleted &&
              d.series !== affectedSuffix
            );
          });

          if (availableDresses.length > 0 && availableDresses[0]) {
            const newSelection = availableDresses[0];
            const newKey = getItemKey(newSelection);

            // Update gallery selection
            galleryState.setSelection(newKey, viewStateKey);
          } else {
            // Clear selection if no alternatives available
            galleryState.clearSelection(viewStateKey);
          }
        }
      } catch {
        // TODO: handle error if needed
      }
    },
    [galleryState, pageData, viewStateKey],
  );

  // Custom handlers for Series facet operations
  const handleSeriesToggle = useCallback(
    async (suffix: string) => {
      try {
        // Find the current series to check its deleted state
        const currentSeries = pageData?.series?.find(
          (s) => s.suffix === suffix,
        );
        if (!currentSeries) {
          return;
        }

        const isCurrentlyDeleted = Boolean(currentSeries.deleted);
        const operation = isCurrentlyDeleted
          ? crud.Operation.UNDELETE
          : crud.Operation.DELETE;

        await DressesCrud(createPayload(types.DataFacet.SERIES), operation, {
          suffix,
        });

        // Force a complete data refresh FIRST
        await fetchData();

        // Then invalidate gallery cache to ensure UI updates
        await refreshGalleryCache();

        // Finally handle selected item management with fresh data
        await handleSelectedSeriesUpdate(suffix, operation);

        // Also try to force a reload from the backend
        await Reload(createPayload(types.DataFacet.SERIES));

        // Fetch data again after reload
        await fetchData();
      } catch (err) {
        handleError(err, 'Toggle operation failed');
      }
    },
    [
      createPayload,
      fetchData,
      handleError,
      pageData,
      refreshGalleryCache,
      handleSelectedSeriesUpdate,
    ],
  );

  const performSeriesRemove = useCallback(
    async (suffix: string) => {
      if (!suffix) return;

      try {
        await DressesCrud(
          createPayload(types.DataFacet.SERIES),
          crud.Operation.REMOVE,
          { suffix },
        );
        // Refresh data first, then cache, then handle selection
        await fetchData();
        await refreshGalleryCache();
        await handleSelectedSeriesUpdate(suffix, crud.Operation.REMOVE);
      } catch (err) {
        handleError(err, 'Remove operation failed');
      }
    },
    [
      createPayload,
      fetchData,
      handleError,
      refreshGalleryCache,
      handleSelectedSeriesUpdate,
    ],
  );

  const handleSeriesRemove = useCallback(
    async (suffix: string) => {
      // Check if dialog is silenced - if so, proceed directly
      if (
        seriesRemoveSilencedDialog.isSilenced &&
        !seriesRemoveSilencedDialog.isLoading
      ) {
        await performSeriesRemove(suffix);
        return;
      }

      // Show custom confirmation for series removal
      setSeriesRemoveConfirm({ opened: true, suffix });
    },
    [
      seriesRemoveSilencedDialog.isSilenced,
      seriesRemoveSilencedDialog.isLoading,
      performSeriesRemove,
    ],
  );

  const confirmSeriesRemove = useCallback(async () => {
    const { suffix } = seriesRemoveConfirm;
    setSeriesRemoveConfirm({ opened: false, suffix: '' });
    await performSeriesRemove(suffix);
  }, [seriesRemoveConfirm, performSeriesRemove]);

  const cancelSeriesRemove = useCallback(() => {
    setSeriesRemoveConfirm({ opened: false, suffix: '' });
  }, []);

  // Override handlers for Series facet
  const customHandlers = useMemo(() => {
    if (getCurrentDataFacet() === types.DataFacet.SERIES) {
      const result = {
        ...handlers,
        handleToggle: (suffix: string) => {
          handleSeriesToggle(suffix);
        },
        handleRemove: (suffix: string) => {
          handleSeriesRemove(suffix);
        },
      };
      return result;
    }
    return handlers;
  }, [handlers, getCurrentDataFacet, handleSeriesToggle, handleSeriesRemove]);

  const { seriesModal, closeSeriesModal, submitSeriesModal } = useSeriesModal({
    getCurrentDataFacet,
    createPayload,
    collection: ROUTE,
  });

  const headerActions = useMemo(() => {
    if (!config.headerActions.length) return null;
    return (
      <Group gap="xs" style={{ flexShrink: 0 }}>
        {config.headerActions.map((action) => {
          const handlerKey =
            `handle${action.type.charAt(0).toUpperCase() + action.type.slice(1)}` as keyof typeof handlers;
          const handler = handlers[handlerKey] as () => void;
          return (
            <Action
              key={action.type}
              icon={
                action.icon as keyof ReturnType<
                  typeof import('@hooks').useIconSets
                >
              }
              onClick={handler}
              title={
                action.requiresWallet && !config.isWalletConnected
                  ? `${action.title} (requires wallet connection)`
                  : action.title
              }
              hotkey={action.type === 'export' ? 'mod+x' : undefined}
              size="sm"
            />
          );
        })}
      </Group>
    );
  }, [config.headerActions, config.isWalletConnected, handlers]);

  // === SECTION 6: UI Configuration ===
  const currentColumns = useFacetColumns(
    viewConfig,
    getCurrentDataFacet,
    {
      showActions: useCallback(
        () => getCurrentDataFacet() === types.DataFacet.SERIES,
        [getCurrentDataFacet],
      ),
      actions: config.rowActions.map(
        (a) => a.type as unknown as import('@hooks').ActionType,
      ),
      getCanRemove: useCallback(
        (row: unknown) => {
          // Only allow removal for series facet and if the row is deleted
          if (getCurrentDataFacet() !== types.DataFacet.SERIES) {
            return false;
          }
          const seriesItem = row as { deleted?: boolean };
          return Boolean(seriesItem.deleted);
        },
        [getCurrentDataFacet],
      ),
      getCanToggle: useCallback(
        (row: unknown) => {
          if (getCurrentDataFacet() !== types.DataFacet.SERIES) return true;
          const seriesItem = row as { suffix?: string };
          if (!seriesItem.suffix) return true;
          return seriesItem.suffix !== 'empty';
        },
        [getCurrentDataFacet],
      ),
      getId: useCallback(
        (row: unknown) => {
          // For Series objects, use suffix as identifier, otherwise use address
          if (getCurrentDataFacet() === types.DataFacet.SERIES) {
            const seriesItem = row as { suffix?: string };
            return String(seriesItem.suffix || '');
          }
          // Default behavior for other facets (will fallback to addressToHex in useColumns)
          return ''; // Let useColumns handle the default case
        },
        [getCurrentDataFacet],
      ),
    },
    customHandlers,
    pageData,
    config,
  );

  const detailPanel = useMemo(
    () => createDetailPanel(viewConfig, getCurrentDataFacet),
    [viewConfig, getCurrentDataFacet],
  );

  const rendererMap = useMemo(
    () => renderers(pageData, viewStateKey, setActiveFacet),
    [pageData, viewStateKey, setActiveFacet],
  );
  const { isForm, node: formNode } = useFacetForm<Record<string, unknown>>({
    viewConfig,
    getCurrentDataFacet,
    currentData: currentData as unknown as Record<string, unknown>[],
    currentColumns:
      currentColumns as unknown as import('@components').FormField<
        Record<string, unknown>
      >[],
    renderers: rendererMap,
  });

  const perTabContent = useMemo(() => {
    const facet = getCurrentDataFacet();
    if (
      rendererMap[facet] &&
      (facet === types.DataFacet.GENERATOR || facet === types.DataFacet.GALLERY)
    ) {
      return (
        <Stack gap="xs">
          {headerActions}
          {rendererMap[facet]()}
        </Stack>
      );
    }
    if (isForm && formNode) return formNode;
    return (
      <BaseTab<Record<string, unknown>>
        data={currentData as unknown as Record<string, unknown>[]}
        columns={currentColumns}
        loading={!!pageData?.isFetching}
        error={error}
        viewStateKey={viewStateKey}
        headerActions={headerActions}
        detailPanel={detailPanel}
        onDelete={(_rowData) => {}}
      />
    );
  }, [
    getCurrentDataFacet,
    rendererMap,
    currentColumns,
    isForm,
    formNode,
    currentData,
    pageData?.isFetching,
    error,
    viewStateKey,
    headerActions,
    detailPanel,
  ]);

  const tabs = useMemo(
    () =>
      availableFacets.map((facetConfig: DataFacetConfig) => ({
        key: facetConfig.id,
        label: facetConfig.label,
        value: facetConfig.id,
        content: perTabContent,
        dividerBefore: facetConfig.dividerBefore,
      })),
    [availableFacets, perTabContent],
  );

  // === SECTION 7: Render ===
  return (
    <div className="mainView">
      <TabView tabs={tabs} route={ROUTE} />
      {error && (
        <div>
          <h3>{`Error fetching ${getCurrentDataFacet()}`}</h3>
          <p>{error.message}</p>
        </div>
      )}
      <Debugger
        rowActions={config.rowActions}
        headerActions={config.headerActions}
        count={++renderCnt.current}
      />
      <ConfirmModal
        opened={confirmModal.opened}
        onClose={confirmModal.onClose}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        dialogKey={confirmModal.dialogKey}
      />
      <ConfirmModal
        opened={seriesRemoveConfirm.opened}
        onClose={cancelSeriesRemove}
        onConfirm={confirmSeriesRemove}
        title="Confirm Series Removal"
        message={`This will permanently remove the series "${seriesRemoveConfirm.suffix}" and all associated images. This action cannot be undone.`}
        dialogKey="confirm.removeSeries"
      />
      <ExportFormatModal
        opened={exportFormatModal.opened}
        onClose={exportFormatModal.onClose}
        onFormatSelected={exportFormatModal.onFormatSelected}
      />
      <SeriesModal
        opened={
          seriesModal.opened && getCurrentDataFacet() === types.DataFacet.SERIES
        }
        mode={seriesModal.mode}
        existing={(pageData?.series || []) as dalle.Series[]}
        initial={seriesModal.initial as dalle.Series | undefined}
        onSubmit={submitSeriesModal}
        onClose={closeSeriesModal}
      />
    </div>
  );
};

// EXISTING_CODE
// EXISTING_CODE
