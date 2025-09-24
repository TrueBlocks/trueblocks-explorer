import { useCallback, useEffect, useMemo } from 'react';

import { CancelFetch, GetAvailableSkins, Reload } from '@app';
import {
  useActiveProject,
  useEnabledMenuItems,
  usePayload,
  usePreferences,
} from '@hooks';
import { msgs, types } from '@models';
import { LogError, emitEvent, useEmitters } from '@utils';
import { useLocation } from 'wouter';

type Hotkey = {
  type: 'navigation' | 'dev' | 'toggle';
  hotkey: string;
  label: string;
  path?: string;
  action?: (() => void) | (() => Promise<void>);
};

export const useAppHotkeys = (): void => {
  const [currentLocation] = useLocation();
  const { getLastFacet } = useActiveProject();
  const createPayload = usePayload();
  const {
    debugCollapsed,
    setDebugCollapsed,
    menuCollapsed,
    setMenuCollapsed,
    helpCollapsed,
    setHelpCollapsed,
    chromeCollapsed,
    setChromeCollapsed,
    detailCollapsed,
    setDetailCollapsed,
    lastSkin,
    setSkin,
    toggleTheme,
  } = usePreferences();
  const { items: enabledMenuItems, isLoading: menuLoading } =
    useEnabledMenuItems();

  // Helper function to get current facet for the current route
  const vR = currentLocation.replace(/^\/+/, '');
  const currentFacet = getLastFacet(vR);

  const [, navigate] = useLocation();
  const { emitStatus, emitError } = useEmitters();

  const handleHotkey = useCallback(
    async (hkType: Hotkey, _e: KeyboardEvent): Promise<void> => {
      try {
        switch (hkType.type) {
          case 'navigation':
            if (hkType.path) {
              if (
                currentLocation === hkType.path ||
                currentLocation.startsWith(hkType.path + '/')
              ) {
                emitEvent(msgs.EventType.TAB_CYCLE, 'Tab cycle triggered', {
                  route: hkType.path,
                  key: hkType.hotkey,
                });
              } else {
                navigate(hkType.path);
              }
            }
            break;

          case 'dev':
            if (!import.meta.env.DEV) return;
            if (hkType.action) await hkType.action();
            if (hkType.path) navigate(hkType.path);
            break;

          case 'toggle':
            if (hkType.action) hkType.action();
            break;
        }
      } catch (error) {
        LogError(error instanceof Error ? error.message : String(error));

        if (
          (hkType.type === 'navigation' || hkType.type === 'dev') &&
          hkType.path
        ) {
          window.location.href = hkType.path;
        }
      }
    },
    [currentLocation, navigate],
  );

  const toggleHotkeys = [
    {
      key: 'mod+m',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+m',
            label: 'Toggle menu panel',
            action: () => {
              if (!chromeCollapsed) setMenuCollapsed(!menuCollapsed);
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
    {
      key: 'mod+h',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+h',
            label: 'Toggle help panel',
            action: () => {
              if (!chromeCollapsed) setHelpCollapsed(!helpCollapsed);
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
    {
      key: 'mod+j',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+j',
            label: 'Toggle header and footer',
            action: () => {
              setChromeCollapsed(!chromeCollapsed);
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
    {
      key: 'mod+p',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+p',
            label: 'Toggle detail panel',
            action: () => {
              setDetailCollapsed(!detailCollapsed);
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
    {
      key: 'mod+d',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+d',
            label: 'Toggle debug info',
            action: () => {
              setDebugCollapsed(!debugCollapsed);
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
    {
      key: 'mod+r',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+r',
            label: 'Reload',
            action: () => {
              Reload(createPayload(currentFacet as types.DataFacet)).then(
                () => {},
              );
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
    {
      key: 'mod+shift+s',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+shift+s',
            label: 'Cycle skin',
            action: async () => {
              try {
                const availableSkins = await GetAvailableSkins();
                const currentIndex = availableSkins.findIndex(
                  (skin) => skin.name === lastSkin,
                );
                const nextIndex = (currentIndex + 1) % availableSkins.length;
                const nextSkin = availableSkins[nextIndex];
                if (nextSkin) {
                  await setSkin(nextSkin.name);
                }
              } catch (error) {
                LogError(`Failed to cycle skin: ${error}`);
              }
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
    {
      key: 'mod+shift+d',
      handler: (e: KeyboardEvent) =>
        handleHotkey(
          {
            type: 'toggle',
            hotkey: 'mod+shift+d',
            label: 'Toggle light/dark mode',
            action: async () => {
              try {
                await toggleTheme();
              } catch (error) {
                LogError(`Failed to toggle theme: ${error}`);
              }
            },
          },
          e,
        ),
      options: { preventDefault: true, enableOnFormTags: true },
    },
  ];

  // Dynamically assign hotkeys based on visual menu order
  // Build hotkey registry: key -> handler
  const hotkeyRegistry = useMemo(() => {
    const registry: Record<string, (e: KeyboardEvent) => void> = {};

    // Don't build hotkeys while menu is still loading
    if (menuLoading) {
      return registry;
    }

    let idx = 1;
    enabledMenuItems.forEach((item) => {
      // Special hotkeys that don't use sequential numbering
      if (item.path === '/wizard') {
        registry['mod+w'] = (e: KeyboardEvent) => {
          handleHotkey(
            {
              type: item.type || 'navigation',
              hotkey: 'mod+w',
              path: item.path,
              label: `Navigate to ${item.label}`,
              action: item.action,
            },
            e,
          );
        };
        return; // Don't increment idx for wizard
      }
      if (item.path === '/settings') {
        registry['mod+comma'] = (e: KeyboardEvent) => {
          handleHotkey(
            {
              type: item.type || 'navigation',
              hotkey: 'mod+comma',
              path: item.path,
              label: `Navigate to ${item.label}`,
              action: item.action,
            },
            e,
          );
        };
        registry['alt+comma'] = (e: KeyboardEvent) => {
          handleHotkey(
            {
              type: item.type || 'navigation',
              hotkey: 'alt+comma',
              path: item.path,
              label: `Navigate to ${item.label} (alt)`,
              action: item.action,
            },
            e,
          );
        };
        return; // Don't increment idx for settings
      }
      if (item.path === '/khedra') {
        registry['mod+k'] = (e: KeyboardEvent) => {
          handleHotkey(
            {
              type: item.type || 'navigation',
              hotkey: 'mod+k',
              path: item.path,
              label: `Navigate to ${item.label}`,
              action: item.action,
            },
            e,
          );
        };
        return; // Don't increment idx for khedra
      }

      // Sequential numbering for all other items based on their visual position
      let hotkey: string;
      if (idx <= 9) hotkey = `mod+${idx}`;
      else if (idx === 10) hotkey = 'mod+0';
      else hotkey = `mod+shift+${idx - 10}`;

      registry[hotkey] = (e: KeyboardEvent) => {
        handleHotkey(
          {
            type: item.type || 'navigation',
            hotkey,
            path: item.path,
            label: `Navigate to ${item.label}`,
            action: item.action,
          },
          e,
        );
      };

      if (idx <= 10) {
        const altHotkey = idx === 10 ? 'alt+0' : `alt+${idx}`;
        registry[altHotkey] = (e: KeyboardEvent) => {
          handleHotkey(
            {
              type: item.type || 'navigation',
              hotkey: altHotkey,
              path: item.path,
              label: `Navigate to ${item.label} (alt)`,
              action: item.action,
            },
            e,
          );
        };
      }
      idx++; // Increment for next visual position
    });
    return registry;
  }, [enabledMenuItems, handleHotkey, menuLoading]);

  // Edit (text) hotkeys (allow native behavior)
  const editHotkeys = [
    {
      key: 'mod+c',
      handler: (_e: KeyboardEvent) => {},
      options: { preventDefault: false, enableOnFormTags: true },
    },
    {
      key: 'mod+v',
      handler: (_e: KeyboardEvent) => {},
      options: { preventDefault: false, enableOnFormTags: true },
    },
    {
      key: 'mod+x',
      handler: (_e: KeyboardEvent) => {},
      options: { preventDefault: false, enableOnFormTags: true },
    },
    {
      key: 'mod+z',
      handler: (_e: KeyboardEvent) => {},
      options: { preventDefault: false, enableOnFormTags: true },
    },
    {
      key: 'mod+shift+z',
      handler: (_e: KeyboardEvent) => {},
      options: { preventDefault: false, enableOnFormTags: true },
    },
    {
      key: 'mod+y',
      handler: (_e: KeyboardEvent) => {},
      options: { preventDefault: false, enableOnFormTags: true },
    },
  ];

  const globalHotkeys = [
    {
      key: 'escape',
      handler: (_e: KeyboardEvent) => {
        CancelFetch(currentFacet as types.DataFacet)
          .then(() => {
            emitStatus('Cancellation request processed.');
          })
          .catch((err: Error) => {
            emitError(
              `Failed to send cancellation request via Escape key: ${
                err.message || 'Unknown error'
              }`,
            );
          });
      },
      options: { enableOnFormTags: true, preventDefault: true },
    },
  ];

  function normalizeHotkey(e: KeyboardEvent): string {
    if (
      e.key === 'Alt' ||
      e.key === 'Meta' ||
      e.key === 'Control' ||
      e.key === 'Shift'
    )
      return '';
    let key = '';
    if (e.metaKey || e.ctrlKey) key += 'mod+';
    if (e.altKey) key += 'alt+';
    if (e.shiftKey) key += 'shift+';
    if (e.code.startsWith('Digit')) key += e.code.replace('Digit', '');
    else if (e.code === 'Comma') key += 'comma';
    else key += e.key.toLowerCase();
    return key;
  }

  const memoToggleHotkeys = toggleHotkeys;
  const memoEditHotkeys = editHotkeys;
  const memoGlobalHotkeys = globalHotkeys;

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      const key = normalizeHotkey(e);
      if (!key) return;
      let handled = false;
      if (hotkeyRegistry[key]) {
        hotkeyRegistry[key](e);
        handled = true;
      }
      memoToggleHotkeys.forEach((hk) => {
        if (hk.key === key) {
          hk.handler(e);
          handled = true;
        }
      });
      memoEditHotkeys.forEach((hk) => {
        if (hk.key === key) {
          hk.handler(e);
          handled = true;
        }
      });
      memoGlobalHotkeys.forEach((hk) => {
        if (hk.key === key) {
          hk.handler(e);
          handled = true;
        }
      });
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [hotkeyRegistry, memoToggleHotkeys, memoEditHotkeys, memoGlobalHotkeys]);
};
