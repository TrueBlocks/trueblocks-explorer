import { PerPage } from '@components';
import { project, types } from '@models';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Create mock function
const mockChangePageSize = vi.fn();

// Mock the usePagination hook
vi.mock('../usePagination', () => ({
  usePagination: () => ({
    pagination: { currentPage: 0, pageSize: 25, totalItems: 100 },
    changePageSize: mockChangePageSize,
  }),
}));

describe('PerPage', () => {
  const mockViewStateKey: project.ViewStateKey = {
    viewName: 'test-view',
    facetName: types.DataFacet.ALL,
  };
  const mockedFocusTable = vi.fn();
  const mockedFocusControls = vi.fn();

  const defaultProps = {
    pageSize: 25,
    viewStateKey: mockViewStateKey,
    focusTable: mockedFocusTable,
    focusControls: mockedFocusControls,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders the select with correct value and options', () => {
    render(<PerPage {...defaultProps} />);

    const select = screen.getByLabelText('Items per page');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('15');

    // The visible text for each option is the number only
    expect(
      screen.getByRole('option', { name: '15 per page' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '30' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '100' })).toBeInTheDocument();
  });

  it('calls changePageSize from usePagination and focusTable when select changes', () => {
    // Make sure we're using fake timers before rendering the component
    vi.useFakeTimers();

    render(<PerPage {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Items per page'), {
      target: { value: '50' },
    });

    // Verify changePageSize was called with the new page size
    expect(mockChangePageSize).toHaveBeenCalledWith(50);

    // Advance timers to trigger the setTimeout callback
    vi.advanceTimersByTime(100);

    // Now check that focusTable was called
    expect(mockedFocusTable).toHaveBeenCalled();

    // Clean up by restoring real timers
    vi.useRealTimers();
  });

  it('calls focusControls on focus', () => {
    render(<PerPage {...defaultProps} />);

    fireEvent.focus(screen.getByLabelText('Items per page'));

    expect(mockedFocusControls).toHaveBeenCalled();
  });
});
