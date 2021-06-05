import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { cookieVars } from '../../utils';
import { Caches } from './Tabs/Caches';
import { Schemas } from './Tabs/Schemas';
import { Scrapers } from './Tabs/Scrapers';
import { Skins } from './Tabs/Skins';

const { TabPane } = Tabs;

export const SystemView = () => {
  const [currentTab, setCurrentTab] = useState(Cookies.get(cookieVars.settings_current_tab) || 'scraper');

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.settings_current_tab, key);
    setCurrentTab(key);
  };

  const title = 'Settings';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Scrapers" key="scraper">
          <Scrapers />
        </TabPane>
        <TabPane tab="Caches" key="caches">
          <Caches />
        </TabPane>
        <TabPane tab="Skins" key="skins">
          <Skins />
        </TabPane>
        <TabPane tab="Schemas" key="schemas">
          <Schemas />
        </TabPane>
      </Tabs>
    </>
  );
};
