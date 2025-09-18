import { useCallback, useMemo } from 'react';

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
  const { goToPage } = usePagination(viewStateKey);

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
            goToPage(currentPage - 1);
            setSelectedRowIndex(-1);
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
