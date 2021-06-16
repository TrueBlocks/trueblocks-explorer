import { BaseView } from '@components/BaseView';
import React from 'react';
import {
  ExplorerBlocksLocation,
  ExplorerLocation, ExplorerLogsLocation,
  ExplorerReceiptsLocation,
  ExplorerTracesLocation,
  ExplorerTransactionsLocation
} from '../../locations';
import { cookieVars } from '../../utils';
import { Blocks } from './Tabs/Blocks';
import { Logs } from './Tabs/Logs';
import { Receipts } from './Tabs/Receipts';
import { Traces } from './Tabs/Traces';
import { Transactions } from './Tabs/Transactions';

export const ExplorerView = () => {
  const title = 'Explorer';
  const tabs = [
    {name: "Blocks", location: ExplorerBlocksLocation, component: <Blocks />},
    {name: "Transactions", location: ExplorerTransactionsLocation, component: <Transactions />},
    {name: "Receipts", location: ExplorerReceiptsLocation, component: <Receipts />},
    {name: "Logs", location: ExplorerLogsLocation, component: <Logs />},
    {name: "Traces", location: ExplorerTracesLocation, component: <Traces />},
  ];
  return (
    <BaseView
      title={title}
      defaultActive={ExplorerBlocksLocation}
      baseActive={ExplorerLocation}
      cookieName={cookieVars.explorer_current_tab}
      tabs={tabs}
    />
  );
};
