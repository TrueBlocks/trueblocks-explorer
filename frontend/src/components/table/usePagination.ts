import { useCallback, useMemo } from 'react';

import { NavigationTarget, useViewContext } from '@contexts';
import { project } from '@models';

import { calculateNavigationTarget } from './navigationUtils';

// usePagination is a custom hook that manages pagination state and handlers for a table view/tab.
export const usePagination = (viewStateKey: project.ViewStateKey) => {
  const { getPagination, updatePagination } = useViewContext();
  const pagination = getPagination(viewStateKey);

  const goToPage = useCallback(
    (page: number) => {
      updatePagination(viewStateKey, { currentPage: page });
    },
    [viewStateKey, updatePagination],
  );

  const changePageSize = useCallback(
    (size: number) => {
      updatePagination(viewStateKey, {
        currentPage: 0,
        pageSize: size,
      });
    },
    [viewStateKey, updatePagination],
  );

  const setTotalItems = useCallback(
    (total: number) => {
      updatePagination(viewStateKey, { totalItems: total });
    },
    [viewStateKey, updatePagination],
  );

  // Calculate navigation target for post-deletion positioning
  const calculatePostDeletionTarget = useCallback(
    (
      deletingRowId: string,
      currentPageData: Record<string, unknown>[],
    ): NavigationTarget | null => {
      return calculateNavigationTarget(
        deletingRowId,
        currentPageData,
        pagination.currentPage,
        pagination.pageSize,
        pagination.totalItems,
      );
    },
    [pagination.currentPage, pagination.pageSize, pagination.totalItems],
  );

  // Apply navigation target (navigate to calculated position)
  const applyNavigationTarget = useCallback(
    (target: NavigationTarget | null) => {
      if (!target) return;

      switch (target.type) {
        case 'page':
          if (target.page !== undefined) {
            updatePagination(viewStateKey, {
              currentPage: target.page,
            });
          }
          break;
        case 'row':
          // For row navigation, we'll let the table component handle it automatically
          // by selecting the last available row when data changes
          break;
        case 'none':
          // No action needed
          break;
      }
    },
    [viewStateKey, updatePagination],
  );

  return useMemo(
    () => ({
      pagination,
      goToPage,
      changePageSize,
      setTotalItems,
      calculatePostDeletionTarget,
      applyNavigationTarget,
    }),
    [
      pagination,
      goToPage,
      changePageSize,
      setTotalItems,
      calculatePostDeletionTarget,
      applyNavigationTarget,
    ],
  );
};
