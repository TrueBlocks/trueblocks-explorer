import { Action } from '@components';
import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Action Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<MantineProvider>{component}</MantineProvider>);
  };

  describe('Icon Rendering', () => {
    it('renders the primary icon by default', () => {
      renderWithProvider(<Action icon="Projects" onClick={mockOnClick} />);

      expect(screen.getByTestId('projects-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
    });

    it('renders the primary icon when isOn is true', () => {
      renderWithProvider(
        <Action
          icon="Projects"
          iconOff="Delete"
          isOn={true}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByTestId('projects-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
    });

    it('renders the iconOff when isOn is false and iconOff is provided', () => {
      renderWithProvider(
        <Action
          icon="Projects"
          iconOff="Delete"
          isOn={false}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('projects-icon')).not.toBeInTheDocument();
    });

    it('renders the primary icon when isOn is false but iconOff is not provided', () => {
      renderWithProvider(
        <Action icon="Projects" isOn={false} onClick={mockOnClick} />,
      );

      expect(screen.getByTestId('projects-icon')).toBeInTheDocument();
    });

    it('works with Delete and Undelete icons as specified in design', () => {
      renderWithProvider(
        <Action
          icon="Delete"
          iconOff="Undelete"
          isOn={true}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('undelete-icon')).not.toBeInTheDocument();
    });
  });

  describe('onClick Handler', () => {
    it('invokes onClick handler when enabled and clicked', () => {
      renderWithProvider(<Action icon="Projects" onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('invokes onClick handler multiple times when clicked multiple times', () => {
      renderWithProvider(<Action icon="Projects" onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('does not invoke onClick handler when disabled', () => {
      renderWithProvider(
        <Action icon="Projects" onClick={mockOnClick} disabled={true} />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('does not invoke onClick handler when disabled is explicitly true', () => {
      renderWithProvider(
        <Action icon="Projects" onClick={mockOnClick} disabled />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('passes disabled prop to underlying ActionIcon', () => {
      renderWithProvider(
        <Action icon="Projects" onClick={mockOnClick} disabled={true} />,
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is enabled by default when disabled prop is not provided', () => {
      renderWithProvider(<Action icon="Projects" onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('is enabled when disabled is explicitly false', () => {
      renderWithProvider(
        <Action icon="Projects" onClick={mockOnClick} disabled={false} />,
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Title and Mantine Props Passthrough', () => {
    it('passes title prop to ActionIcon', () => {
      renderWithProvider(
        <Action
          icon="Projects"
          onClick={mockOnClick}
          title="Projects button"
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Projects button');
    });

    it('passes Mantine props to ActionIcon', () => {
      renderWithProvider(
        <Action
          icon="Projects"
          onClick={mockOnClick}
          variant="filled"
          size="lg"
          data-testid="action-button"
        />,
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });

    it('passes aria-label prop to ActionIcon', () => {
      renderWithProvider(
        <Action
          icon="Projects"
          onClick={mockOnClick}
          aria-label="Navigate to projects"
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Navigate to projects');
    });
  });

  describe('Two-State Toggle Behavior', () => {
    it('displays correct icon for delete/undelete toggle when deleted (isOn=false)', () => {
      renderWithProvider(
        <Action
          icon="Delete"
          iconOff="Undelete"
          isOn={false}
          onClick={mockOnClick}
          title="Undelete item"
        />,
      );

      expect(screen.getByTestId('undelete-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Undelete item');
    });

    it('displays correct icon for delete/undelete toggle when not deleted (isOn=true)', () => {
      renderWithProvider(
        <Action
          icon="Delete"
          iconOff="Undelete"
          isOn={true}
          onClick={mockOnClick}
          title="Delete item"
        />,
      );

      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('undelete-icon')).not.toBeInTheDocument();

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Delete item');
    });
  });
});
