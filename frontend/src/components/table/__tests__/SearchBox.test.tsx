import React from 'react';

import { setupComponentHookMocks } from '@mocks';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchBox } from '../SearchBox';

// Use a variable for the focusControls mock overridden by central mocks
let focusControlsMock: ReturnType<typeof vi.fn>;

describe('SearchBox', () => {
  beforeEach(() => {
    focusControlsMock = vi.fn();
    setupComponentHookMocks({
      customTableContext: { focusControls: focusControlsMock },
    });
  });

  it('renders with initial value', () => {
    render(<SearchBox value="foo" onChange={() => {}} />);
    expect(screen.getByLabelText(/search/i)).toHaveValue('foo');
  });

  it('calls onChange only on Enter', () => {
    const handleChange = vi.fn();
    render(<SearchBox value="" onChange={handleChange} />);
    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: 'bar' } });
    expect(handleChange).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('bar');
  });

  it('does not call onChange on blur', () => {
    const handleChange = vi.fn();
    render(<SearchBox value="bar" onChange={handleChange} />);
    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: 'baz' } });
    expect(handleChange).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('calls focusControls on focus', () => {
    render(<SearchBox value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/search/i);
    fireEvent.focus(input);
    expect(focusControlsMock).toHaveBeenCalled();
  });

  it('is controlled by value prop', () => {
    const { rerender } = render(<SearchBox value="abc" onChange={() => {}} />);
    const input = screen.getByLabelText(/search/i);
    expect(input).toHaveValue('abc');
    rerender(<SearchBox value="def" onChange={() => {}} />);
    expect(input).toHaveValue('def');
  });
});
