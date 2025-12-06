// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { useCallback, useMemo } from 'react';

import { BaseTab, RendererParams, createDetailPanel } from '@components';
import { useFacetColumns, useViewConfig } from '@hooks';
import { dresses, project, types } from '@models';

// EXISTING_CODE

export const DatabasesFacet = ({ params }: { params: RendererParams }) => {
  // EXISTING_CODE
  const { data, onRowAction } = params;
  const pageData = useMemo(
    () =>
      ({
        databases: data || [],
      }) as unknown as dresses.DressesPage,
    [data],
  );
  const viewStateKey: project.ViewStateKey = useMemo(
    () => ({
      viewName: 'dresses',
      facetName: types.DataFacet.DATABASES,
    }),
    [],
  );

  const { config: viewConfig } = useViewConfig({ viewName: 'dresses' });

  const columns = useFacetColumns(
    viewConfig,
    () => types.DataFacet.DATABASES,
    {
      showActions: false,
      actions: [],
    },
    {},
    pageData,
    {
      rowActions: [],
      isWalletConnected: false,
    },
  );

  const detailPanel = useMemo(
    () =>
      createDetailPanel(
        viewConfig,
        () => types.DataFacet.DATABASES,
        {},
        (_rowKey: string, _newValue: string, _txHash: string) => {},
      ),
    [viewConfig],
  );

  return (
    <BaseTab<Record<string, unknown>>
      data={(pageData?.databases || []) as unknown as Record<string, unknown>[]}
      columns={columns}
      state={pageData?.state || types.StoreState.LOADED}
      error={null}
      viewStateKey={viewStateKey}
      headerActions={null}
      detailPanel={detailPanel}
      onDelete={useCallback(() => {}, [])}
      onSubmit={onRowAction}
    />
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
