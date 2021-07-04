import { BaseView } from '@components/BaseView';
import React from 'react';
import {
  SettingsCachesLocation,
  SettingsIndexesLocation,
  SettingsLocation,
  SettingsSchemasLocation,
  SettingsScrapersLocation,
  SettingsSkinsLocation,
} from '../../locations';
import { cookieVars } from '../../utils';
import { IndexesView } from '../Dashboard/Tabs/Indexes/Indexes';
import { Caches } from './Tabs/Caches';
import { Schemas } from './Tabs/Schemas';
import { Scrapers } from './Tabs/Scrapers';
import { Skins } from './Tabs/Skins';

export const SettingsView = () => {
  const title = 'Settings';
  const tabs = [
    { name: 'Scrapers', location: SettingsScrapersLocation, component: <Scrapers /> },
    { name: 'Indexes', location: SettingsIndexesLocation, component: <IndexesView />, disabled: false },
    { name: 'Caches', location: SettingsCachesLocation, component: <Caches /> },
    { name: 'Skins', location: SettingsSkinsLocation, component: <Skins /> },
    { name: 'Schemas', location: SettingsSchemasLocation, component: <Schemas /> },
  ];
  return (
    <BaseView
      title={title}
      defaultActive={SettingsScrapersLocation}
      baseActive={SettingsLocation}
      cookieName={cookieVars.settings_current_tab}
      tabs={tabs}
    />
  );
};
