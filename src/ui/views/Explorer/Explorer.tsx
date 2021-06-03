import { PageHeader, Tabs } from 'antd';
import React, { useState } from 'react';

import Cookies from 'js-cookie';
import { Indexes } from './Tabs/Indexes';
import { Blocks } from './Tabs/Blocks';
import { Transactions } from './Tabs/Transactions';
import { Receipts } from './Tabs/Receipts';
import { Logs } from './Tabs/Logs';
import { Traces } from './Tabs/Traces';
import { cookieVars } from '../../utils';

const { TabPane } = Tabs;

export const ExplorerView = () => {
  const [currentTab, setCurrentTab] = useState(Cookies.get(cookieVars.explorer_current_tab) || 'indexes');

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.explorer_current_tab, key);
    setCurrentTab(key);
  };

  const title = 'Explorer';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Indexes" key="indexes">
          <Indexes />
        </TabPane>
        <TabPane tab="Blocks" key="blocks">
          <Blocks />
        </TabPane>
        <TabPane tab="Transactions" key="transactions">
          <Transactions />
        </TabPane>
        <TabPane tab="Receipts" key="receipts">
          <Receipts />
        </TabPane>
        <TabPane tab="Logs" key="logs">
          <Logs />
        </TabPane>
        <TabPane tab="Traces" key="traces">
          <Traces />
        </TabPane>
      </Tabs>
    </>
  );
};
