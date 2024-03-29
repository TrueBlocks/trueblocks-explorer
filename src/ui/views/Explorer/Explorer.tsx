import React from 'react';

import { BaseView } from '@components/BaseView';

import {
  ExplorerBlocksLocation,
  ExplorerLocation,
  ExplorerLogsLocation,
  ExplorerReceiptsLocation,
  ExplorerTracesLocation,
  ExplorerTransactionsLocation,
} from '../../Routes';
import { Blocks } from './Tabs/Blocks';
import { Logs } from './Tabs/Logs';
import { Receipts } from './Tabs/Receipts';
import { Traces } from './Tabs/Traces';
import { Transactions } from './Tabs/Transactions';

export const ExplorerView = () => {
  const tabs = [
    {
      name: 'Blocks',
      location: [
        ExplorerLocation,
        ExplorerBlocksLocation,
      ],
      component: <Blocks />,
    },
    { name: 'Transactions', location: ExplorerTransactionsLocation, component: <Transactions /> },
    { name: 'Receipts', location: ExplorerReceiptsLocation, component: <Receipts /> },
    { name: 'Logs', location: ExplorerLogsLocation, component: <Logs /> },
    { name: 'Traces', location: ExplorerTracesLocation, component: <Traces /> },
  ];

  return (
    <div>
      <div style={{ backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <BaseView title='Explorer' cookieName='COOKIE_EXPLORER' tabs={tabs} />
    </div>
  );
};
