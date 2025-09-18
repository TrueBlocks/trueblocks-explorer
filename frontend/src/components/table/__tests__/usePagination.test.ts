import * as Contexts from '@contexts';
import { types } from '@models';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePagination } from '../usePagination';

const baseMockContext = {
  currentView: '',
  setCurrentView: vi.fn(),
  getSorting: vi.fn(),
  updateSorting: vi.fn(),
  getFiltering: vi.fn(),
  updateFiltering: vi.fn(),
  restoreProjectFilterStates: vi.fn(),
};

describe('usePagination', () => {
  it('returns pagination state and handlers', () => {
    const getPagination = vi.fn().mockReturnValue({
      currentPage: 2,
      pageSize: 25,
      totalItems: 100,
    });
    const updatePagination = vi.fn();
    vi.spyOn(Contexts, 'useViewContext').mockReturnValue({
      ...baseMockContext,
      getPagination,
      updatePagination,
    });

    const viewStateKey = {
      viewName: 'view',
      facetName: types.DataFacet.ALL,
    };
    const { result } = renderHook(() => usePagination(viewStateKey));
    expect(result.current.pagination).toEqual({
      currentPage: 2,
      pageSize: 25,
      totalItems: 100,
    });
    expect(result.current.pagination.currentPage).toBe(2);
    expect(result.current.pagination.pageSize).toBe(25);
    expect(result.current.pagination.totalItems).toBe(100);
  });

  it('goToPage calls updatePagination', () => {
    const getPagination = vi
      .fn()
      .mockReturnValue({ currentPage: 0, pageSize: 10, totalItems: 10 });
    const updatePagination = vi.fn();
    vi.spyOn(Contexts, 'useViewContext').mockReturnValue({
      ...baseMockContext,
      getPagination,
      updatePagination,
    });

    const viewStateKey = {
      viewName: 'view',
      facetName: types.DataFacet.ALL,
    };
    const { result } = renderHook(() => usePagination(viewStateKey));
    act(() => {
      result.current.goToPage(3);
    });
    expect(updatePagination).toHaveBeenCalledWith(viewStateKey, {
      currentPage: 3,
    });
  });

  it('changePageSize calls updatePagination with currentPage 0', () => {
    const getPagination = vi
      .fn()
      .mockReturnValue({ currentPage: 0, pageSize: 10, totalItems: 10 });
    const updatePagination = vi.fn();
    vi.spyOn(Contexts, 'useViewContext').mockReturnValue({
      ...baseMockContext,
      getPagination,
      updatePagination,
    });

    const viewStateKey = {
      viewName: 'view',
      facetName: types.DataFacet.ALL,
    };
    const { result } = renderHook(() => usePagination(viewStateKey));
    act(() => {
      result.current.changePageSize(50);
    });
    expect(updatePagination).toHaveBeenCalledWith(
      { viewName: 'view', facetName: types.DataFacet.ALL },
      { currentPage: 0, pageSize: 50 },
    );
  });

  it('setTotalItems calls updatePagination', () => {
    const getPagination = vi
      .fn()
      .mockReturnValue({ currentPage: 0, pageSize: 10, totalItems: 10 });
    const updatePagination = vi.fn();
    vi.spyOn(Contexts, 'useViewContext').mockReturnValue({
      ...baseMockContext,
      getPagination,
      updatePagination,
    });

    const viewStateKey = {
      viewName: 'view',
      facetName: types.DataFacet.ALL,
    };
    const { result } = renderHook(() => usePagination(viewStateKey));
    act(() => {
      result.current.setTotalItems(123);
    });
    expect(updatePagination).toHaveBeenCalledWith(
      { viewName: 'view', facetName: types.DataFacet.ALL },
      { totalItems: 123 },
    );
  });

  it('uses memoized callbacks', () => {
    const getPagination = vi
      .fn()
      .mockReturnValue({ currentPage: 0, pageSize: 10, totalItems: 10 });
    const updatePagination = vi.fn();
    vi.spyOn(Contexts, 'useViewContext').mockReturnValue({
      ...baseMockContext,
      getPagination,
      updatePagination,
    });

    const viewStateKey = {
      viewName: 'view',
      facetName: types.DataFacet.ALL,
    };
    const { result, rerender } = renderHook(() => usePagination(viewStateKey));

    const initialGoToPage = result.current.goToPage;
    const initialChangePageSize = result.current.changePageSize;
    const initialSetTotalItems = result.current.setTotalItems;

    rerender();

    expect(result.current.goToPage).toBe(initialGoToPage);
    expect(result.current.changePageSize).toBe(initialChangePageSize);
    expect(result.current.setTotalItems).toBe(initialSetTotalItems);
  });
});
