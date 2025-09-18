// Navigation utilities for handling post-deletion table navigation
import {
  NavigationContext,
  NavigationStrategy,
  NavigationTarget,
} from '@contexts';
import { addressToHex } from '@utils';

// Type for address-containing objects
interface AddressEntity {
  address: unknown;
}

// Build navigation context for calculating post-deletion targets
export const buildNavigationContext = (
  deletingRowId: string,
  currentPageData: Record<string, unknown>[],
  currentPage: number,
  pageSize: number,
  totalItems: number,
): NavigationContext => {
  const deletingRowIndex = currentPageData.findIndex((row) => {
    // For ABI data, compare addresses
    if ('address' in row && row.address) {
      return (
        addressToHex(row.address as AddressEntity['address']) === deletingRowId
      );
    }
    // For other data types, could add other comparison logic here
    return false;
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    currentPage,
    pageSize,
    totalItems,
    deletingRowIndex,
    deletingRowId,
    currentPageData,
    // Performance hints
    isOnlyRowOnPage: currentPageData.length === 1,
    isFirstRowOnPage: deletingRowIndex === 0,
    isLastRowOnPage: deletingRowIndex === currentPageData.length - 1,
    hasNextPage: currentPage < totalPages - 1,
    hasPreviousPage: currentPage > 0,
  };
};

// Fast navigation strategy for staying on same page (next/previous row)
export const navigateWithinPage: NavigationStrategy = (context) => {
  const { isOnlyRowOnPage, isLastRowOnPage, currentPageData } = context;

  // If this is the only row on the page, we need page navigation
  if (isOnlyRowOnPage) {
    return null; // Let page navigation strategy handle this
  }

  // If not the last row, focus on next row (same index after deletion)
  if (
    !isLastRowOnPage &&
    context.deletingRowIndex < currentPageData.length - 1
  ) {
    const nextRow = currentPageData[context.deletingRowIndex + 1];
    if (nextRow && 'address' in nextRow) {
      return {
        type: 'row',
        rowId: addressToHex(nextRow.address as AddressEntity['address']),
      };
    }
  }

  // If last row (but not only row), focus on previous row
  if (context.deletingRowIndex > 0) {
    const prevRow = currentPageData[context.deletingRowIndex - 1];
    if (prevRow && 'address' in prevRow) {
      return {
        type: 'row',
        rowId: addressToHex(prevRow.address as AddressEntity['address']),
      };
    }
  }

  return { type: 'none' };
};

// Page navigation strategy for handling empty pages
export const navigateToPage: NavigationStrategy = (context) => {
  const { isOnlyRowOnPage, hasPreviousPage } = context;

  // Only handle the case where this is the only row on the page
  if (!isOnlyRowOnPage) {
    return null; // Let within-page strategy handle this
  }

  // If there's a previous page, go there
  if (hasPreviousPage) {
    return {
      type: 'page',
      page: context.currentPage - 1,
    };
  }

  // If we're on page 0 and it becomes empty, stay on page 0
  return {
    type: 'page',
    page: 0,
  };
};

// Smart strategy selector that chooses the best navigation approach
export const selectNavigationStrategy = (
  context: NavigationContext,
): NavigationStrategy => {
  // If this is the only row on the page, use page navigation
  if (context.isOnlyRowOnPage) {
    return navigateToPage;
  }

  // Otherwise, use within-page navigation
  return navigateWithinPage;
};

// Apply navigation strategy and return the target
export const calculateNavigationTarget = (
  deletingRowId: string,
  currentPageData: Record<string, unknown>[],
  currentPage: number,
  pageSize: number,
  totalItems: number,
): NavigationTarget | null => {
  const context = buildNavigationContext(
    deletingRowId,
    currentPageData,
    currentPage,
    pageSize,
    totalItems,
  );

  const strategy = selectNavigationStrategy(context);
  return strategy(context);
};
