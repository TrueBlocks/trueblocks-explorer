// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { useEffect, useMemo } from 'react';

import {
  BaseTab,
  RendererParams,
  createDetailPanel,
  useTableContext,
} from '@components';
import {
  useActions,
  useActiveProject,
  useFacetColumns,
  useViewConfig,
} from '@hooks';
import { project, projects, types } from '@models';

// EXISTING_CODE

export const ProjectsFacet = ({ params }: { params: RendererParams }) => {
  // EXISTING_CODE
  const { data, facet } = params;
  const pageData = {
    addresslist: data || [],
  } as unknown as projects.ProjectsPage;
  const viewStateKey: project.ViewStateKey = useMemo(
    () => ({
      viewName: 'projects',
      facetName: facet,
    }),
    [facet],
  );
  // Get view configuration for columns
  const { config: viewConfig } = useViewConfig({ viewName: 'projects' });

  // Get active address to pre-select matching row
  const { activeAddress } = useActiveProject();

  // Get table context for row selection
  const { setSelectedRowIndex } = useTableContext();

  // Get row action handler for navigation
  const { handlers } = useActions({
    collection: 'projects',
    viewStateKey,
    pagination: { currentPage: 0, pageSize: 50, totalItems: 0 }, // Default pagination for row actions
    goToPage: () => {}, // Not used for row actions
    sort: { fields: [], orders: [] }, // Default sort for row actions
    filter: '', // Default filter for row actions
    viewConfig,
    pageData,
    setPageData: () => {}, // Not used for row actions
    setTotalItems: () => {}, // Not used for row actions
    crudFunc: () => Promise.resolve(), // Not used for projects
    pageFunc: () => Promise.resolve({ totalItems: 0 }), // Not used for row actions
    pageClass: projects.ProjectsPage,
    updateItem: undefined,
    createPayload: () => ({
      collection: 'projects',
      dataFacet: viewStateKey.facetName,
    }), // Default payload creator
    getCurrentDataFacet: () => viewStateKey.facetName,
  });
  const { handleRowAction } = handlers;

  // Create detail panel for the project facet
  const detailPanel = useMemo(
    () =>
      createDetailPanel(
        viewConfig,
        () => viewStateKey.facetName,
        {},
        (_rowKey: string, _newValue: string, _txHash: string) => {},
      ),
    [viewConfig, viewStateKey.facetName],
  );

  // Get columns configuration for the project facet
  const currentColumns = useFacetColumns(
    viewConfig,
    () => viewStateKey.facetName,
    {
      showActions: false,
      actions: [],
      getCanRemove: () => false,
    },
    {},
    pageData,
    { rowActions: [] },
  );

  // Select the row that matches the active address when data loads
  useEffect(() => {
    if (!activeAddress || !pageData?.addresslist?.length) {
      return;
    }

    // Find the index of the row that matches the active address
    const matchingRowIndex = pageData.addresslist.findIndex(
      (item) =>
        item.address &&
        item.address.toLowerCase() === activeAddress.toLowerCase(),
    );

    // If found, select that row
    if (matchingRowIndex >= 0) {
      setSelectedRowIndex(matchingRowIndex);
    }
  }, [activeAddress, pageData?.addresslist, setSelectedRowIndex]);

  // Render project facet with BaseTab
  if (facet === types.DataFacet.MANAGE) {
    return <></>;
  }
  return (
    <BaseTab<Record<string, unknown>>
      data={
        (pageData?.addresslist || []) as unknown as Record<string, unknown>[]
      }
      columns={currentColumns}
      state={pageData?.state || types.StoreState.STALE}
      error={null}
      viewStateKey={viewStateKey}
      headerActions={null}
      detailPanel={detailPanel}
      onSubmit={handleRowAction}
    />
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
