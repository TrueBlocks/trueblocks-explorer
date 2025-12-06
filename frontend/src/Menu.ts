// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
import { SetInitialized } from '@app';
import { Khedra, Settings } from '@views';
import {
  Abis,
  Chunks,
  Comparitoor,
  Contracts,
  Dresses,
  Exports,
  Monitors,
  Names,
  Projects,
  Status,
} from '@views';
import { Wizard } from '@wizards';

export interface MenuItem {
  label: string;
  path: string;
  viewName?: string;
  position: 'top' | 'bottom' | 'hidden';
  component?: React.ComponentType;
  type?: 'navigation' | 'dev' | 'toggle';
  action?: () => void | Promise<void>;
  menuOrder?: number;
  separator?: boolean;
}

export const MenuItems: MenuItem[] = [
  {
    label: 'Projects',
    path: '/projects',
    menuOrder: 1,
    position: 'top',
    component: Projects,
    type: 'navigation',
  },
  {
    label: 'Exports',
    path: '/exports',
    menuOrder: 10,
    position: 'top',
    component: Exports,
    type: 'navigation',
  },
  {
    label: 'Monitors',
    path: '/monitors',
    menuOrder: 15,
    position: 'top',
    component: Monitors,
    type: 'navigation',
  },
  {
    label: 'Abis',
    path: '/abis',
    menuOrder: 20,
    position: 'top',
    component: Abis,
    type: 'navigation',
  },
  {
    label: 'Names',
    path: '/names',
    menuOrder: 30,
    position: 'top',
    component: Names,
    type: 'navigation',
  },
  {
    label: 'Unchained',
    path: '/chunks',
    menuOrder: 40,
    position: 'top',
    component: Chunks,
    type: 'navigation',
  },
  {
    label: 'Contracts',
    path: '/contracts',
    menuOrder: 50,
    position: 'top',
    component: Contracts,
    type: 'navigation',
  },
  {
    label: 'Status',
    path: '/status',
    menuOrder: 60,
    position: 'top',
    component: Status,
    type: 'navigation',
  },
  {
    label: 'Dresses',
    path: '/dresses',
    menuOrder: 70,
    position: 'top',
    component: Dresses,
    type: 'navigation',
  },
  {
    label: 'Comparitoor',
    path: '/comparitoor',
    menuOrder: 80,
    position: 'top',
    component: Comparitoor,
    type: 'navigation',
  },
  {
    label: 'Khedra',
    path: '/khedra',
    menuOrder: 997,
    position: 'bottom',
    component: Khedra,
    type: 'navigation',
  },
  {
    label: 'Settings',
    path: '/settings',
    menuOrder: 998,
    position: 'bottom',
    component: Settings,
    type: 'navigation',
  },
  {
    path: '/wizard',
    label: 'Wizard',
    position: 'hidden',
    component: Wizard,
    type: 'dev',
    action: async () => {
      await SetInitialized(false);
    },
  },
];
