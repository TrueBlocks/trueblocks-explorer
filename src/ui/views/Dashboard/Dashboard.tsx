import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  DashboardCollectionsLocation,
  DashboardOverviewLocation,
  DashboardSystemStatusLocation,
} from '../..//locations';
import { cookieVars } from '../../utils';
import { Collections } from './Tabs/Collections';
import { Overview } from './Tabs/Overview';
import { Status } from './Tabs/Status';

const { TabPane } = Tabs;

export const DashboardView = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(
    Cookies.get(cookieVars.dashboard_current_tab) || DashboardOverviewLocation
  );

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.dashboard_current_tab, key);
    history.push(key);
    setCurrentTab(key);
  };

  const title = 'Dashboard';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Overview" key={DashboardOverviewLocation}>
          <Overview />
        </TabPane>
        <TabPane tab="Collections" key={DashboardCollectionsLocation}>
          <Collections />
        </TabPane>
        <TabPane tab="System Status" key={DashboardSystemStatusLocation}>
          <Status />
        </TabPane>
      </Tabs>
    </>
  );
};
