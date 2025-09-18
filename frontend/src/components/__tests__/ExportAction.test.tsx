import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Action } from '../Action';

describe('Export Action', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<MantineProvider>{component}</MantineProvider>);
  };

  it('renders Export icon correctly', () => {
    renderWithProvider(
      <Action icon="Export" onClick={() => {}} title="Export Data" />,
    );

    // Check that the Export icon is rendered (should have export-icon test id)
    const icon = screen.getByTestId('export-icon');
    expect(icon).toBeInTheDocument();
  });

  it('calls onClick when Export action is clicked', () => {
    const mockOnClick = vi.fn();
    renderWithProvider(
      <Action icon="Export" onClick={mockOnClick} title="Export Data" />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('shows correct title for Export action', () => {
    renderWithProvider(
      <Action icon="Export" onClick={() => {}} title="Export Data" />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Export Data');
  });
});
