import { JsonToggle } from '@components';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('JsonToggle', () => {
  it('toggles display', () => {
    render(<JsonToggle text={JSON.stringify({ a: 1 })} />);
    const showBtn = screen.getByText('Show JSON');
    expect(showBtn).toBeTruthy();
    fireEvent.click(showBtn);
    expect(screen.getByText('Hide JSON')).toBeTruthy();
    expect(screen.getByText(/"a"/)).toBeTruthy();
    const hideBtn = screen.getByText('Hide JSON');
    fireEvent.click(hideBtn);
    expect(screen.getByText('Show JSON')).toBeTruthy();
  });

  it('renders dash when no text', () => {
    render(<JsonToggle />);
    expect(screen.getByText('-')).toBeTruthy();
  });
});
