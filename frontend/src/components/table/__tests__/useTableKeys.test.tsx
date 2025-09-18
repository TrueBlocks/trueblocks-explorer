import { useTableContext } from '@components';
import { project, types } from '@models';
import { act, renderHook } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePagination } from '../usePagination';
import { useTableKeys } from '../useTableKeys';

vi.mock('@components', () => ({
  useTableContext: vi.fn(),
}));

vi.mock('@contexts', async () => {
  const actual = await vi.importActual('@contexts');
  return {
    ...actual,
    usePagination: vi.fn(() => ({
      page: 1,
      perPage: 10,
      setPagination: vi.fn(),
    })),
    useSorting: vi.fn(() => ({
      fields: [],
      orders: [],
      setSorting: vi.fn(),
    })),
    useFiltering: vi.fn(() => ({
      filters: {},
      setFilter: vi.fn(),
    })),
    useViewState: vi.fn(() => ({
      setFilterState: vi.fn(),
      getFilterState: vi.fn(),
      clearFilterState: vi.fn(),
    })),
  };
});

vi.mock('../usePagination', () => ({
  usePagination: vi.fn(),
}));

describe('useTableKeys', () => {
  function mockEvent(
    key: string,
    extra: Partial<React.KeyboardEvent> = {},
  ): React.KeyboardEvent {
    return {
      key,
      preventDefault: vi.fn(),
      ...extra,
    } as unknown as React.KeyboardEvent;
  }

  const createMockTableContext = (
    overrides: Partial<ReturnType<typeof useTableContext>> = {},
  ) => ({
    focusState: 'table' as 'table' | 'controls' | 'none',
    selectedRowIndex: 1,
    setSelectedRowIndex: vi.fn(),
    focusTable: vi.fn(),
    focusControls: vi.fn(),
    tableRef: { current: null as HTMLDivElement | null },
    columnDefs: [],
    setColumnDefs: vi.fn(),
    gridRef: { current: null },
    searchState: { term: '', isActive: false, results: [], count: 0 },
    setSearchState: vi.fn(),
    clearSearch: vi.fn(),
    currentView: undefined,
    setCurrentView: vi.fn(),
    editMode: false,
    setEditMode: vi.fn(),
    detailViewName: undefined,
    setDetailViewName: vi.fn(),
    ...overrides,
  });

  const mockGoToPage = vi.fn();
  const viewStateKey: project.ViewStateKey = {
    viewName: 'test-view',
    facetName: types.DataFacet.ALL,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (usePagination as Mock).mockReturnValue({
      pagination: { currentPage: 0, pageSize: 10, totalItems: 100 },
      goToPage: mockGoToPage,
    });
  });

  // Group 1: Focus state behavior
  describe('Focus state behavior', () => {
    it('should do nothing when focusState is not "table"', () => {
      const mockContextValue = createMockTableContext({
        focusState: 'controls',
      });
      (useTableContext as Mock).mockReturnValue(mockContextValue);

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowDown'));
      });

      expect(mockContextValue.setSelectedRowIndex).not.toHaveBeenCalled();
      expect(mockGoToPage).not.toHaveBeenCalled();
    });

    it('should call focusTable when requestFocus is called', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.requestFocus();
      });

      expect(mockContextValue.focusTable).toHaveBeenCalled();
    });
  });

  // Group 2: Vertical navigation (ArrowUp/ArrowDown) tests
  describe('Vertical navigation', () => {
    it('should handle ArrowDown key - within items', () => {
      const mockContextValue = createMockTableContext({ selectedRowIndex: 1 });
      (useTableContext as Mock).mockReturnValue(mockContextValue);

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowDown'));
      });

      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(2);
      expect(mockGoToPage).not.toHaveBeenCalled();
    });

    it('should handle ArrowDown key - navigate to next page', () => {
      const mockContextValue = createMockTableContext({ selectedRowIndex: 4 });
      (useTableContext as Mock).mockReturnValue(mockContextValue);

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowDown'));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(1);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(0);
    });

    it('should handle ArrowUp key - within items', () => {
      const mockContextValue = createMockTableContext({ selectedRowIndex: 2 });
      (useTableContext as Mock).mockReturnValue(mockContextValue);

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowUp'));
      });

      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(1);
      expect(mockGoToPage).not.toHaveBeenCalled();
    });

    it('should handle ArrowUp key - navigate to previous page', () => {
      const mockContextValue = createMockTableContext({ selectedRowIndex: 0 });
      (useTableContext as Mock).mockReturnValue(mockContextValue);

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowUp'));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(0);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(-1);
    });

    it('should not navigate down at last row of last page', () => {
      const mockContextValue = createMockTableContext({ selectedRowIndex: 4 });
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 1, pageSize: 5, totalItems: 10 }, // Last page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1, // Already on last page
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowDown'));
      });

      expect(mockGoToPage).not.toHaveBeenCalled();
      expect(mockContextValue.setSelectedRowIndex).not.toHaveBeenCalled();
    });

    it('should not navigate up at first row of first page', () => {
      const mockContextValue = createMockTableContext({ selectedRowIndex: 0 });
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 5, totalItems: 10 }, // First page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0, // Already on first page
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowUp'));
      });

      expect(mockGoToPage).not.toHaveBeenCalled();
      expect(mockContextValue.setSelectedRowIndex).not.toHaveBeenCalled();
    });
  });

  describe('Page navigation', () => {
    it('should handle PageUp key', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 1, pageSize: 5, totalItems: 10 },
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('PageUp'));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(0);
    });

    it('should handle PageDown key', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 5, totalItems: 10 },
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('PageDown'));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(1);
    });

    it('should not navigate to previous page when already on the first page', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 5, totalItems: 10 }, // First page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0, // Already on first page
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('PageUp'));
      });

      expect(mockGoToPage).not.toHaveBeenCalled();
    });

    it('should not navigate to next page when already on the last page', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 1, pageSize: 5, totalItems: 10 }, // Last page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1, // Already on last page
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('PageDown'));
      });

      expect(mockGoToPage).not.toHaveBeenCalled();
    });
  });

  describe('Home/End navigation', () => {
    it('should handle Home key', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 1, pageSize: 5, totalItems: 10 }, // Not on first page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('Home'));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(0);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(0);
    });

    it('should handle Home key with Ctrl modifier', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 1, pageSize: 5, totalItems: 10 },
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('Home', { ctrlKey: true }));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(0);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(0);
    });

    it('should handle Home key with Meta modifier', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 1, pageSize: 5, totalItems: 10 },
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('Home', { metaKey: true }));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(0);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(0);
    });

    it('should handle End key', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 5, totalItems: 10 }, // Not on last page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('End'));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(1);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(4);
    });

    it('should handle End key with Ctrl modifier', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 5, totalItems: 10 },
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('End', { ctrlKey: true }));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(1);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(4);
    });

    it('should handle End key with Meta modifier', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 5, totalItems: 10 },
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('End', { metaKey: true }));
      });

      expect(mockGoToPage).toHaveBeenCalledWith(1);
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(4);
    });

    it('should not change page when Home is pressed on first page', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 5, totalItems: 10 }, // Already on first page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('Home'));
      });

      expect(mockGoToPage).not.toHaveBeenCalled();
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(0);
    });

    it('should not change page when End is pressed on last page', () => {
      const mockContextValue = createMockTableContext({ selectedRowIndex: 2 });
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 1, pageSize: 5, totalItems: 10 }, // Already on last page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 1,
          totalPages: 2,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('End'));
      });

      expect(mockGoToPage).not.toHaveBeenCalled();
      expect(mockContextValue.setSelectedRowIndex).toHaveBeenCalledWith(4);
    });
  });

  describe('Special cases', () => {
    it('should handle empty data set correctly', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 10, totalItems: 0 }, // Empty dataset
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 0,
          currentPage: 0,
          totalPages: 1, // Or 0, depending on calculation for empty set
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('ArrowDown'));
      });

      expect(mockContextValue.setSelectedRowIndex).not.toHaveBeenCalled();
      expect(mockGoToPage).not.toHaveBeenCalled();
    });

    it('should handle single page dataset correctly', () => {
      const mockContextValue = createMockTableContext();
      (useTableContext as Mock).mockReturnValue(mockContextValue);
      (usePagination as Mock).mockReturnValueOnce({
        pagination: { currentPage: 0, pageSize: 10, totalItems: 5 }, // Single page
        goToPage: mockGoToPage,
      });

      const { result } = renderHook(() =>
        useTableKeys({
          itemCount: 5,
          currentPage: 0,
          totalPages: 1,
          viewStateKey,
        }),
      );

      act(() => {
        result.current.handleKeyDown(mockEvent('PageDown'));
      });

      expect(mockGoToPage).not.toHaveBeenCalled();
    });
  });
});
