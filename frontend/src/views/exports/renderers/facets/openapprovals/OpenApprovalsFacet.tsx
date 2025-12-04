// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { useCallback, useMemo, useState } from 'react';

import { BaseTab, RendererParams, createDetailPanel } from '@components';
import { useFacetColumns, useViewConfig } from '@hooks';
import { exports, project, types } from '@models';

import { renderers } from '../../index';

// EXISTING_CODE

export const OpenApprovalsFacet = ({ params }: { params: RendererParams }) => {
  // EXISTING_CODE
  const { data } = params;

  // State for demo hack - manage approval statuses and local data
  const [localData, setLocalData] = useState<Record<string, unknown>[]>(
    data || [],
  );
  const [approvalStatuses, setApprovalStatuses] = useState<Map<string, string>>(
    new Map(),
  );

  // Update local data when props change
  useMemo(() => {
    setLocalData(data || []);
  }, [data]);

  // Generate unique row key from approval details (owner-token-spender)
  const generateRowKey = useCallback((row: Record<string, unknown>) => {
    const owner = row.owner as string;
    const token = row.token as string;
    const spender = row.spender as string;
    return `${owner}-${token}-${spender}`;
  }, []);

  // onFinal callback for transaction success
  const handleOnFinal = useCallback(
    (rowKey: string, newValue: string, _txHash: string) => {
      if (newValue === '0') {
        // Revoke case - use the rowKey (approval details) instead of txHash
        setApprovalStatuses((prev) =>
          new Map(prev).set(rowKey, 'pending-revoke'),
        );

        // Change to revoked after 10 seconds
        setTimeout(() => {
          setApprovalStatuses((prev) => new Map(prev).set(rowKey, 'revoked'));
        }, 10000);
      } else {
        // Approve case - use the rowKey (approval details) instead of txHash
        setApprovalStatuses((prev) =>
          new Map(prev).set(rowKey, 'pending-changed'),
        );

        // Clear status after 10 seconds
        setTimeout(() => {
          setApprovalStatuses((prev) => {
            const newMap = new Map(prev);
            newMap.delete(rowKey);
            return newMap;
          });
        }, 10000);
      }
    },
    [],
  );

  // Augment data with approval status
  const augmentedData = useMemo(() => {
    const result = localData.map((row, _index) => {
      // Use approval details (owner-token-spender) as the key
      const rowKey = generateRowKey(row);
      const status = approvalStatuses.get(rowKey) || '';

      return {
        ...row,
        approvalStatus: status,
      };
    });

    return result;
  }, [localData, approvalStatuses, generateRowKey]);
  const pageData = useMemo(
    () =>
      ({
        openapprovals: augmentedData,
      }) as unknown as exports.ExportsPage,
    [augmentedData],
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

  // Create default detail panel for OpenApprovals facet with onFinal callback
  const detailPanel = useMemo(
    () =>
      createDetailPanel(
        viewConfig,
        () => types.DataFacet.OPENAPPROVALS,
        renderers.panels,
        handleOnFinal,
      ),
    [viewConfig, handleOnFinal],
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

  return (
    <BaseTab<Record<string, unknown>>
      data={augmentedData}
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
