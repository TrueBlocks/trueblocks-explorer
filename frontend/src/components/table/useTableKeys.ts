import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { useTableContext } from '@components';
import { project } from '@models';

import { usePagination } from './usePagination';

// UseTableKeysProps defines the props for the useTableKeys hook.
interface UseTableKeysProps {
  itemCount: number;
  currentPage: number;
  totalPages: number;
  viewStateKey: project.ViewStateKey;
  onEnter?: () => void;
  onDelete?: () => void;
  onCmdDelete?: () => void;
  onAutoname?: () => void;
  onEscape?: () => void;
}

// useTableKeys is a custom hook that provides keyboard navigation logic for the table, handling arrow keys, page navigation, and selection.
export const useTableKeys = ({
  itemCount,
  currentPage,
  totalPages,
  viewStateKey,
  onEnter,
  onDelete,
  onCmdDelete,
  onAutoname,
  onEscape,
}: UseTableKeysProps) => {
  const { focusState, selectedRowIndex, setSelectedRowIndex, focusTable } =
    useTableContext();
  const { goToPage, pagination } = usePagination(viewStateKey);
  const { pageSize } = pagination;
  const pendingRowIndex = useRef<number | null>(null);

  // Handle delayed row selection after data loads
  // Use useLayoutEffect to run before Table's useEffect auto-correction
  useLayoutEffect(() => {
    if (pendingRowIndex.current !== null && itemCount > 0) {
      // For non-last pages, we expect pageSize items. For last page, we expect fewer.
      // If we have a pending navigation and itemCount is much smaller than pageSize,
      // we might still be seeing old data from the previous page
      const expectedMinItems = currentPage < totalPages - 1 ? pageSize : 1;

      if (itemCount >= expectedMinItems) {
        const targetIndex = Math.min(pendingRowIndex.current, itemCount - 1);
        setSelectedRowIndex(targetIndex);
        pendingRowIndex.current = null;
      }
    }
  }, [itemCount, setSelectedRowIndex, currentPage, totalPages, pageSize]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (focusState !== 'table') return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (selectedRowIndex < itemCount - 1) {
            setSelectedRowIndex(selectedRowIndex + 1);
          } else if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
            setSelectedRowIndex(0);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (selectedRowIndex > 0) {
            setSelectedRowIndex(selectedRowIndex - 1);
          } else if (currentPage > 0) {
            const targetPage = currentPage - 1;
            // Target page always has pageSize items (since it's not the last page when we navigate backwards)
            const targetRow = pageSize - 1;
            pendingRowIndex.current = targetRow;
            goToPage(targetPage);
          }
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          if (currentPage > 0) {
            goToPage(currentPage - 1);
          } else {
            // If on first page, select the first row
            setSelectedRowIndex(0);
          }
          break;
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
          } else {
            // If on last page, select the last row
            setSelectedRowIndex(itemCount - 1);
          }
          break;
        case 'Home':
          e.preventDefault();
          if (currentPage !== 0) {
            goToPage(0);
            setSelectedRowIndex(0);
          } else {
            setSelectedRowIndex(0);
          }
          break;
        case 'End':
          e.preventDefault();
          if (currentPage !== totalPages - 1) {
            goToPage(totalPages - 1);
            setSelectedRowIndex(itemCount - 1);
          } else {
            setSelectedRowIndex(itemCount - 1);
          }
          break;
        case 'Enter':
          e.preventDefault();
          onEnter?.();
          break;
        case 'Delete':
        case 'Backspace':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            if (onDelete) {
              onDelete();
            }
          } else {
            e.preventDefault();
            if (onCmdDelete) {
              onCmdDelete();
            }
          }
          break;
        case 'a':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            if (onAutoname) {
              onAutoname();
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (onEscape) onEscape();
          break;
      }
    },
    [
      focusState,
      selectedRowIndex,
      itemCount,
      currentPage,
      totalPages,
      setSelectedRowIndex,
      goToPage,
      pageSize,
      onEnter,
      onDelete,
      onCmdDelete,
      onAutoname,
      onEscape,
    ],
  );

  const requestFocus = useCallback(() => {
    if (focusTable) {
      focusTable();
    }
  }, [focusTable]);

  return useMemo(
    () => ({
      handleKeyDown,
      requestFocus,
    }),
    [handleKeyDown, requestFocus],
  );
};
