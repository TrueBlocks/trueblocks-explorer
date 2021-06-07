import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ExplorerBlocksLocation,
  ExplorerIndexesLocation,
  ExplorerLogsLocation,
  ExplorerReceiptsLocation,
  ExplorerTracesLocation,
  ExplorerTransactionsLocation,
} from '../../locations';
import { cookieVars } from '../../utils';
import { Blocks } from './Tabs/Blocks';
import { Indexes } from './Tabs/Indexes';
import { Logs } from './Tabs/Logs';
import { Receipts } from './Tabs/Receipts';
import { Traces } from './Tabs/Traces';
import { Transactions } from './Tabs/Transactions';

const { TabPane } = Tabs;

export const ExplorerView = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(
    Cookies.get(cookieVars.explorer_current_tab) || ExplorerIndexesLocation
  );

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.explorer_current_tab, key);
    history.push(key);
    setCurrentTab(key);
  };

  const title = 'Explorer';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Indexes" key={ExplorerIndexesLocation}>
          <Indexes />
        </TabPane>
        <TabPane tab="Blocks" key={ExplorerBlocksLocation}>
          <Blocks />
        </TabPane>
        <TabPane tab="Transactions" key={ExplorerTransactionsLocation}>
          <Transactions />
        </TabPane>
        <TabPane tab="Receipts" key={ExplorerReceiptsLocation}>
          <Receipts />
        </TabPane>
        <TabPane tab="Logs" key={ExplorerLogsLocation}>
          <Logs />
        </TabPane>
        <TabPane tab="Traces" key={ExplorerTracesLocation}>
          <Traces />
        </TabPane>
      </Tabs>
    </>
  );
};
