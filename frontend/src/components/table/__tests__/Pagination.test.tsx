import { Pagination } from '@components';
import { project, types } from '@models';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the usePagination hook
const mockGoToPage = vi.fn();
vi.mock('../usePagination', () => ({
  usePagination: () => ({
    pagination: { currentPage: 0, pageSize: 10, totalItems: 100 },
    goToPage: mockGoToPage,
  }),
}));

describe('Pagination', () => {
  const mockViewStateKey: project.ViewStateKey = {
    viewName: 'test-view',
    facetName: types.DataFacet.ALL,
  };
  const mockFocusControls = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correct number of page buttons', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={0}
        viewStateKey={mockViewStateKey}
        focusControls={mockFocusControls}
      />,
    );

    // First page + previous + 5 page buttons + next + last = 9 buttons total
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(9);

    // First page and previous buttons should be disabled on page 0
    expect(buttons[0]).toBeDisabled(); // First page
    expect(buttons[1]).toBeDisabled(); // Previous page

    // Next and last buttons should be enabled
    expect(buttons[7]).not.toBeDisabled(); // Next
    expect(buttons[8]).not.toBeDisabled(); // Last
  });

  it('handles page button clicks', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={2}
        viewStateKey={mockViewStateKey}
        focusControls={mockFocusControls}
      />,
    );

    // Click on the third page button (index 4 because of first+prev buttons)
    const pageButtons = screen.getAllByRole('button');

    // Make sure the button exists before clicking
    const pageButton = pageButtons[4];
    expect(pageButton).toBeDefined();

    if (pageButton) {
      fireEvent.click(pageButton);
      // mockGoToPage should be called with 2 (zero-indexed)
      expect(mockGoToPage).toHaveBeenCalledWith(2);
    }
  });

  it('handles first, previous, next, and last page navigation', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={5}
        viewStateKey={mockViewStateKey}
        focusControls={mockFocusControls}
      />,
    );

    const buttons = screen.getAllByRole('button');

    // First page
    const firstButton = buttons[0];
    if (firstButton) {
      fireEvent.click(firstButton);
      expect(mockGoToPage).toHaveBeenCalledWith(0);
    }

    mockGoToPage.mockClear();

    // Previous page (jumps back or to start)
    const prevButton = buttons[1];
    if (prevButton) {
      fireEvent.click(prevButton);
      expect(mockGoToPage).toHaveBeenCalledWith(0);
    }

    mockGoToPage.mockClear();

    // Next page (jumps forward or to end)
    const nextButton = buttons[7];
    if (nextButton) {
      fireEvent.click(nextButton);
      expect(mockGoToPage).toHaveBeenCalledWith(9);
    }

    mockGoToPage.mockClear();

    // Last page
    const lastButton = buttons[8];
    if (lastButton) {
      fireEvent.click(lastButton);
      expect(mockGoToPage).toHaveBeenCalledWith(9);
    }
  });

  it('shows correct button states when on first page', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={0}
        viewStateKey={mockViewStateKey}
        focusControls={mockFocusControls}
      />,
    );

    const buttons = screen.getAllByRole('button');

    // First and prev should be disabled
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();

    // Next and last should be enabled
    expect(buttons[7]).not.toBeDisabled();
    expect(buttons[8]).not.toBeDisabled();
  });

  it('shows correct button states when on last page', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={9}
        viewStateKey={mockViewStateKey}
        focusControls={mockFocusControls}
      />,
    );

    const buttons = screen.getAllByRole('button');

    // First and prev should be enabled
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();

    // Next and last should be disabled
    expect(buttons[7]).toBeDisabled();
    expect(buttons[8]).toBeDisabled();
  });

  it('calls focusControls when a button is focused', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={5}
        viewStateKey={mockViewStateKey}
        focusControls={mockFocusControls}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];

    if (firstButton) {
      fireEvent.focus(firstButton);
      expect(mockFocusControls).toHaveBeenCalled();
    }
  });

  it('handles single page case correctly', () => {
    render(
      <Pagination
        totalPages={1}
        currentPage={0}
        viewStateKey={mockViewStateKey}
        focusControls={mockFocusControls}
      />,
    );

    // All buttons should be disabled when there's only one page
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
