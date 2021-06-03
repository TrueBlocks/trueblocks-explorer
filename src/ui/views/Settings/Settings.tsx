import { PageHeader, Tabs } from 'antd';
import React, { useState } from 'react';

import Cookies from 'js-cookie';
import { Caches } from './Tabs/Caches';
import { Skins } from './Tabs/Skins';
import { Schemas } from './Tabs/Schemas';
import { cookieVars } from '../../utils';

const { TabPane } = Tabs;

export const SystemView = () => {
  const [currentTab, setCurrentTab] = useState(Cookies.get(cookieVars.settings_current_tab) || 'caches');

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.settings_current_tab, key);
    setCurrentTab(key);
  };

  const title = 'Settings';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
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
