import { useEffect, useState } from 'react';

import { ConfigOk, IsDisabled } from '@app';
import { MenuItem, MenuItems } from 'src/Menu';

import { areViewConfigsReady, getViewConfig } from './getViewConfig';

interface UseEnabledMenuItemsResult {
  items: MenuItem[];
  isLoading: boolean;
}

export function useEnabledMenuItems(): UseEnabledMenuItemsResult {
  const [enabledMenuItems, setEnabledMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const checkEnabled = async () => {
      // Check config file availability - this will emit error messages if needed
      ConfigOk();

      // Wait for view configs to be ready
      if (!areViewConfigsReady()) {
        retryTimeout = setTimeout(checkEnabled, 100);
        return;
      }

      try {
        const checks = await Promise.all(
          MenuItems.map(async (item) => {
            const viewName = item.path.startsWith('/')
              ? item.path.slice(1)
              : item.path;
            const disabled = await IsDisabled(viewName);

            if (disabled) return null;

            // Try to get menuOrder from view config
            let menuOrder: number | undefined;

            // Handle special cases first
            // DEFAULT_ROUTE
            if (item.path === '/projects') {
              // Home should always be first
              menuOrder = 1;
            } else if (item.path === '/settings') {
              // Settings should be near the end but before unconfigured items
              menuOrder = 998;
            } else if (item.path === '/khedra') {
              // Khedra (AI) should be second to last
              menuOrder = 997;
            } else {
              // Try to get from view config
              try {
                const config = getViewConfig(viewName);
                menuOrder = config.menuOrder;
              } catch {
                // Other views without config get default positioning
                menuOrder = undefined;
              }
            }

            return { ...item, menuOrder };
          }),
        );

        // Filter out disabled items and sort by menuOrder
        const enabledItems = (checks.filter(Boolean) as MenuItem[]).sort(
          (a, b) => {
            const aOrder = a.menuOrder ?? 999;
            const bOrder = b.menuOrder ?? 999;

            if (aOrder !== bOrder) {
              return aOrder - bOrder;
            }

            // For items with same menuOrder, maintain original order
            const aIndex = MenuItems.findIndex((item) => item.path === a.path);
            const bIndex = MenuItems.findIndex((item) => item.path === b.path);
            return aIndex - bIndex;
          },
        );

        if (mounted) {
          setEnabledMenuItems(enabledItems);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading menu items:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkEnabled();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  return { items: enabledMenuItems, isLoading };
}
