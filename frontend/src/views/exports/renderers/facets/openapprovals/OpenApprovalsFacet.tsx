// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { useMemo } from 'react';

import { BaseTab, RendererParams, createDetailPanel } from '@components';
import { useFacetColumns, useViewConfig } from '@hooks';
import { exports, project, types } from '@models';

import { renderers } from '../../index';

// EXISTING_CODE

export const OpenApprovalsFacet = ({ params }: { params: RendererParams }) => {
  // EXISTING_CODE
  const { data } = params;
  const pageData = useMemo(
    () =>
      ({
        openapprovals: data || [],
      }) as unknown as exports.ExportsPage,
    [data],
  );
  const viewStateKey: project.ViewStateKey = useMemo(
    () => ({
      viewName: 'exports',
      facetName: types.DataFacet.OPENAPPROVALS,
    }),
    [],
  );

  // Get view configuration for columns
  const { config: viewConfig } = useViewConfig({ viewName: 'exports' });

  // Create default detail panel for OpenApprovals facet
  const detailPanel = useMemo(
    () =>
      createDetailPanel(
        viewConfig,
        () => types.DataFacet.OPENAPPROVALS,
        renderers.panels,
      ),
    [viewConfig],
  );

  // Get columns configuration for OpenApprovals facet
  const currentColumns = useFacetColumns(
    viewConfig,
    () => types.DataFacet.OPENAPPROVALS,
    {
      showActions: false,
      actions: [],
      getCanRemove: () => false,
    },
    {},
    pageData,
    { rowActions: [] },
  );

  // Render OpenApprovals facet with functional BaseTab
  return (
    <BaseTab<Record<string, unknown>>
      data={
        (pageData?.openapprovals || []) as unknown as Record<string, unknown>[]
      }
      columns={currentColumns}
      state={pageData?.state || types.StoreState.STALE}
      error={null}
      viewStateKey={viewStateKey}
      headerActions={null}
      detailPanel={detailPanel}
      onDelete={(_rowData: unknown) => {}}
    />
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
