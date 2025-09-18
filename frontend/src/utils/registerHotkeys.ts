import { useHotkeys } from 'react-hotkeys-hook';

type HotkeyHandler = (e: KeyboardEvent) => void;

export interface RegisterHotkeyOptions {
  enableOnFormTags?: boolean;
  enableOnContentEditable?: boolean;
  splitKey?: string;
  enabled?: boolean;
  scopes?: string | string[];
  keyup?: boolean;
  keydown?: boolean;
  preventDefault?: boolean;
  description?: string;
}

export interface HotkeyConfig {
  key: string;
  handler: HotkeyHandler;
  options?: RegisterHotkeyOptions;
  altKeys?: string[];
}

export const registerHotkeys = (hotkeys: HotkeyConfig[]): void => {
  hotkeys.forEach(({ key, handler, options, altKeys }) => {
    useHotkeys(key, handler, options);

    if (altKeys && altKeys.length > 0) {
      altKeys.forEach((altKey) => {
        useHotkeys(altKey, handler, options);
      });
    }
  });
};
