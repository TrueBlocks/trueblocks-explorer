import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  SystemCachesLocation,
  SystemSchemasLocation,
  SystemScrapersLocation,
  SystemSkinsLocation,
} from '../../locations';
import { cookieVars } from '../../utils';
import { Caches } from './Tabs/Caches';
import { Schemas } from './Tabs/Schemas';
import { Scrapers } from './Tabs/Scrapers';
import { Skins } from './Tabs/Skins';

const { TabPane } = Tabs;

export const SystemView = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(
    Cookies.get(cookieVars.settings_current_tab) || SystemScrapersLocation
  );

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.settings_current_tab, key);
    history.push(key);
    setCurrentTab(key);
  };

  const title = 'Settings';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Scrapers" key={SystemScrapersLocation}>
          <Scrapers />
        </TabPane>
        <TabPane tab="Caches" key={SystemCachesLocation}>
          <Caches />
        </TabPane>
        <TabPane tab="Skins" key={SystemSkinsLocation}>
          <Skins />
        </TabPane>
        <TabPane tab="Schemas" key={SystemSchemasLocation}>
          <Schemas />
        </TabPane>
      </Tabs>
    </>
  );
};
