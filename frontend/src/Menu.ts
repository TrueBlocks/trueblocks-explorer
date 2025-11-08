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
    position: 'top',
    component: Projects,
    type: 'navigation',
  },
  {
    label: 'Exports',
    path: '/exports',
    position: 'top',
    component: Exports,
    type: 'navigation',
  },
  {
    label: 'Monitors',
    path: '/monitors',
    position: 'top',
    component: Monitors,
    type: 'navigation',
  },
  {
    label: 'Abis',
    path: '/abis',
    position: 'top',
    component: Abis,
    type: 'navigation',
  },
  {
    label: 'Names',
    path: '/names',
    position: 'top',
    component: Names,
    type: 'navigation',
  },
  {
    label: 'Chunks',
    path: '/chunks',
    position: 'top',
    component: Chunks,
    type: 'navigation',
  },
  {
    label: 'Contracts',
    path: '/contracts',
    position: 'top',
    component: Contracts,
    type: 'navigation',
  },
  {
    label: 'Status',
    path: '/status',
    position: 'top',
    component: Status,
    type: 'navigation',
  },
  {
    label: 'Dresses',
    path: '/dresses',
    position: 'top',
    component: Dresses,
    type: 'navigation',
  },
  {
    label: 'Comparitoor',
    path: '/comparitoor',
    position: 'top',
    component: Comparitoor,
    type: 'navigation',
  },
  {
    label: 'Khedra',
    path: '/khedra',
    position: 'bottom',
    component: Khedra,
    type: 'navigation',
  },
  {
    label: 'Settings',
    path: '/settings',
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
