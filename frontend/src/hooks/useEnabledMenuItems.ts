import { useEffect, useState } from 'react';

import { IsDisabled } from '@app';
import { MenuItem, MenuItems } from 'src/Menu';

export function useEnabledMenuItems(): MenuItem[] {
  const [enabledMenuItems, setEnabledMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    const checkEnabled = async () => {
      const checks = await Promise.all(
        MenuItems.map(async (item) => {
          const viewName = item.path.startsWith('/')
            ? item.path.slice(1)
            : item.path;
          const disabled = await IsDisabled(viewName);
          return disabled ? null : item;
        }),
      );
      setEnabledMenuItems(checks.filter(Boolean) as MenuItem[]);
    };
    checkEnabled();
  }, []);
  return enabledMenuItems;
}
