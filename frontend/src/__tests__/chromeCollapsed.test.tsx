import React from 'react';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { useAppHotkeys } from '../hooks/useAppHotkeys';
import { render, setupFocusedHookMocks, triggerHotkey } from './mocks';

vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: () => {},
}));

describe('chromeCollapsed hotkey behavior only', () => {
  beforeAll(() => {
    // @ts-expect-error: Save original error for warning suppression
    console._error = console.error;
    vi.spyOn(console, 'error').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes('act')) return;
      // @ts-expect-error: Call original error for non-act warnings
      return console._error ? console._error(msg) : undefined;
    });
  });
  afterAll(() => {
    // @ts-expect-error: Restore original error after suppression
    if (console._error) console.error = console._error;
  });
  it('Hotkeys mod+m and mod+h inert while minimal mode active', () => {
    const setMenuCollapsed = vi.fn();
    const setHelpCollapsed = vi.fn();
    setupFocusedHookMocks({
      customPreferences: {
        chromeCollapsed: true,
        setMenuCollapsed,
        setHelpCollapsed,
      },
    });
    const HotkeyHost = () => {
      useAppHotkeys();
      return <div data-testid="hotkey-host" />;
    };
    render(<HotkeyHost />);
    triggerHotkey('mod+m');
    triggerHotkey('mod+h');
    expect(setMenuCollapsed).not.toHaveBeenCalled();
    expect(setHelpCollapsed).not.toHaveBeenCalled();
  });
});
