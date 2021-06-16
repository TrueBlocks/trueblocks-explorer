import { BaseView } from '@components/BaseView';
import React from 'react';
import {
  SettingsCachesLocation,
  SettingsLocation,
  SettingsSchemasLocation,
  SettingsScrapersLocation,
  SettingsSkinsLocation
} from '../../locations';
import { cookieVars } from '../../utils';
import { Caches } from './Tabs/Caches';
import { Schemas } from './Tabs/Schemas';
import { Scrapers } from './Tabs/Scrapers';
import { Skins } from './Tabs/Skins';

export const SettingsView = () => {
  const title = 'Settings';
  const tabs = [
    {name: "Scrapers", location: SettingsScrapersLocation, component: <Scrapers />},
    {name: "Caches", location: SettingsCachesLocation, component: <Caches />},
    {name: "Skins", location: SettingsSkinsLocation, component: <Skins />},
    {name: "Schemas", location: SettingsSchemasLocation, component: <Schemas />},
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
