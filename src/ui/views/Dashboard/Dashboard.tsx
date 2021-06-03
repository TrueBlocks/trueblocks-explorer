import { PageHeader, Tabs } from 'antd';
import React, { useState } from 'react';

import Cookies from 'js-cookie';
import { Overview } from './Tabs/Overview';
import { Collections } from './Tabs/Collections';
import { Status } from './Tabs/Status';
import { cookieVars } from '../../utils';

const { TabPane } = Tabs;

export const DashboardView = () => {
  const [currentTab, setCurrentTab] = useState(Cookies.get(cookieVars.dashboard_current_tab) || 'overview');

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.dashboard_current_tab, key);
    setCurrentTab(key);
  };

  const title = 'Dashboard';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Overview" key="overview">
          <Overview />
        </TabPane>
        <TabPane tab="Collections" key="collections">
          <Collections />
        </TabPane>
        <TabPane tab="System Status" key="status">
          <Status />
        </TabPane>
      </Tabs>
    </>
  );
};
