import { mockUseHotkeys, resetAllCentralMocks, triggerHotkey } from '@mocks';
import { vi } from 'vitest';

import { registerHotkeys } from '../registerHotkeys';
import type { RegisterHotkeyOptions } from '../registerHotkeys';

vi.mock('react-hotkeys-hook', async () => {
  const mocks = await import('../../__tests__/mocks');
  return { useHotkeys: mocks.mockUseHotkeys };
});

describe('registerHotkeys utility', () => {
  beforeEach(() => {
    resetAllCentralMocks();
  });

  test('should register a single hotkey and call useHotkeys with correct parameters', () => {
    const mockHandler = vi.fn();
    const hotkeyConfig = [
      {
        key: 'ctrl+k',
        handler: mockHandler,
        options: { description: 'Test hotkey' } as RegisterHotkeyOptions,
      },
    ];

    registerHotkeys(hotkeyConfig);

    expect(mockUseHotkeys).toHaveBeenCalledTimes(1);
    expect(mockUseHotkeys).toHaveBeenCalledWith(
      'ctrl+k',
      expect.any(Function),
      { description: 'Test hotkey' },
    );

    const firstCall = mockUseHotkeys.mock.calls[0];
    expect(firstCall).toBeDefined();
    if (!firstCall) return;

    const [actualKey, , actualOptions] = firstCall;
    expect(actualKey).toBe('ctrl+k');
    expect(actualOptions).toEqual({ description: 'Test hotkey' });

    triggerHotkey('ctrl+k');
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test('should register and trigger multiple distinct hotkeys', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const hotkeyConfig = [
      { key: 'alt+1', handler: handler1 },
      {
        key: 'alt+2',
        handler: handler2,
        options: { preventDefault: false } as RegisterHotkeyOptions,
      },
    ];

    registerHotkeys(hotkeyConfig);

    expect(mockUseHotkeys).toHaveBeenCalledTimes(2);
    expect(mockUseHotkeys).toHaveBeenCalledWith(
      'alt+1',
      expect.any(Function),
      undefined,
    );
    expect(mockUseHotkeys).toHaveBeenCalledWith('alt+2', expect.any(Function), {
      preventDefault: false,
    });

    triggerHotkey('alt+1');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    triggerHotkey('alt+2');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  test('should pass boolean enableOnFormTags correctly if specified', () => {
    const handler = vi.fn();
    const hotkeyConfig = [
      {
        key: 'meta+s',
        handler,
        options: {
          enableOnFormTags: true,
          description: 'Save action',
        } as RegisterHotkeyOptions,
      },
      {
        key: 'meta+o',
        handler,
        options: {
          enableOnFormTags: false,
          description: 'Open action',
        } as RegisterHotkeyOptions,
      },
    ];

    registerHotkeys(hotkeyConfig);

    expect(mockUseHotkeys).toHaveBeenCalledWith(
      'meta+s',
      expect.any(Function),
      {
        description: 'Save action',
        enableOnFormTags: true,
      },
    );
    expect(mockUseHotkeys).toHaveBeenCalledWith(
      'meta+o',
      expect.any(Function),
      {
        description: 'Open action',
        enableOnFormTags: false,
      },
    );
  });

  test('triggering a non-registered hotkey should not call any handler', () => {
    const handler1 = vi.fn();
    const hotkeyConfig = [{ key: 'a', handler: handler1 }];
    registerHotkeys(hotkeyConfig);

    triggerHotkey('b');
    expect(handler1).not.toHaveBeenCalled();
  });

  test('handler receives KeyboardEvent when triggered', () => {
    const mockHandler = vi.fn();
    const hotkeyConfig = [{ key: 'shift+enter', handler: mockHandler }];
    registerHotkeys(hotkeyConfig);

    const triggeredEvent = triggerHotkey('shift+enter');

    expect(mockHandler).toHaveBeenCalledTimes(1);
    const handlerCall = mockHandler.mock.calls[0];
    expect(handlerCall).toBeDefined();
    if (!handlerCall) return;

    const eventArg = handlerCall[0] as KeyboardEvent;
    expect(eventArg).toBeInstanceOf(Object);
    expect(eventArg.key).toBe('enter'); // Corrected: check for 'enter'
    expect(eventArg.shiftKey).toBe(true);
    expect(eventArg.preventDefault).toEqual(expect.any(Function));
    expect(eventArg.stopPropagation).toEqual(expect.any(Function));
    expect(triggeredEvent).toBe(eventArg);
  });

  test('should pass undefined for options if none are provided in config', () => {
    const mockHandler = vi.fn();
    const hotkeyConfig = [
      {
        key: '/',
        handler: mockHandler,
      },
    ];

    registerHotkeys(hotkeyConfig);

    expect(mockUseHotkeys).toHaveBeenCalledWith(
      '/',
      expect.any(Function),
      undefined,
    );
  });

  test('should correctly register and trigger hotkeys with altKeys', () => {
    const mockHandler = vi.fn();
    const hotkeyConfig = [
      {
        key: 'ctrl+p',
        handler: mockHandler,
        options: { description: 'Primary Print' } as RegisterHotkeyOptions,
        altKeys: ['meta+p'],
      },
    ];

    registerHotkeys(hotkeyConfig);

    expect(mockUseHotkeys).toHaveBeenCalledTimes(2);
    expect(mockUseHotkeys).toHaveBeenCalledWith(
      'ctrl+p',
      expect.any(Function),
      { description: 'Primary Print' },
    );
    expect(mockUseHotkeys).toHaveBeenCalledWith(
      'meta+p',
      expect.any(Function),
      { description: 'Primary Print' },
    );

    triggerHotkey('ctrl+p');
    expect(mockHandler).toHaveBeenCalledTimes(1);

    triggerHotkey('meta+p');
    expect(mockHandler).toHaveBeenCalledTimes(2);
  });
});
