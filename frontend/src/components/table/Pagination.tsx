import { useTableContext } from '@components';
import { project } from '@models';

import './Pagination.css';
import { usePagination } from './usePagination';

// PaginationProps defines the props for the Pagination component.
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  viewStateKey: project.ViewStateKey;
  focusControls: () => void;
}

// Pagination renders pagination controls for navigating between pages in the table.
export const Pagination = ({
  totalPages,
  currentPage,
  viewStateKey,
  focusControls,
}: PaginationProps) => {
  const { goToPage } = usePagination(viewStateKey);
  const { setSelectedRowIndex } = useTableContext();

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      goToPage(page);
    }
  };

  const maxButtons = 5;
  let pageButtons = [];
  let start = 0;
  let end = maxButtons - 1;

  // Special case: if totalPages <= 1, all buttons should be disabled
  const allDisabled = totalPages <= 1;

  if (totalPages > maxButtons) {
    if (currentPage <= 2) {
      start = 0;
      end = maxButtons - 1;
    } else if (currentPage >= totalPages - 3) {
      start = totalPages - maxButtons;
      end = totalPages - 1;
    } else {
      start = currentPage - 2;
      end = currentPage + 2;
    }
  } else {
    start = 0;
    end = maxButtons - 1;
  }

  for (let i = start; i <= end; i++) {
    const pageNum = i + 1;
    const exists = i < totalPages && totalPages > 0;
    pageButtons.push(
      <button
        key={i}
        onClick={exists && !allDisabled ? () => handlePageChange(i) : undefined}
        className={i === currentPage ? 'active' : ''}
        aria-current={i === currentPage ? 'page' : undefined}
        onFocus={focusControls}
        disabled={!exists || allDisabled}
      >
        {pageNum}
      </button>,
    );
  }

  return (
    <div className="pagination">
      <button
        onClick={
          !allDisabled && currentPage > 0
            ? () => handlePageChange(0)
            : currentPage === 0 && !allDisabled
              ? () => setSelectedRowIndex(0)
              : undefined
        }
        disabled={currentPage === 0 || allDisabled}
        title="First Page"
        onFocus={focusControls}
      >
        &laquo;
      </button>
      <button
        onClick={
          !allDisabled && currentPage > 0
            ? () => handlePageChange(Math.max(0, currentPage - 10))
            : currentPage === 0 && !allDisabled
              ? () => setSelectedRowIndex(0)
              : undefined
        }
        disabled={currentPage === 0 || allDisabled}
        title="Previous Page"
        onFocus={focusControls}
      >
        &lsaquo;
      </button>
      {pageButtons}
      <button
        onClick={
          !allDisabled && currentPage < totalPages - 1
            ? () => handlePageChange(Math.min(totalPages - 1, currentPage + 10))
            : currentPage >= totalPages - 1 && !allDisabled
              ? () => setSelectedRowIndex(Number.MAX_SAFE_INTEGER) // This will be clamped to the last item
              : undefined
        }
        disabled={currentPage >= totalPages - 1 || allDisabled}
        title="Next Page"
        onFocus={focusControls}
      >
        &rsaquo;
      </button>
      <button
        onClick={
          !allDisabled && currentPage < totalPages - 1
            ? () => handlePageChange(totalPages - 1)
            : currentPage >= totalPages - 1 && !allDisabled
              ? () => setSelectedRowIndex(Number.MAX_SAFE_INTEGER) // This will be clamped to the last item
              : undefined
        }
        disabled={currentPage >= totalPages - 1 || allDisabled}
        title="Last Page"
        onFocus={focusControls}
      >
        &raquo;
      </button>
    </div>
  );
};
